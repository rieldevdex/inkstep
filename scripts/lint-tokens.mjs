/**
 * Enforces DESIGN.md: only tokens.css may hold raw colors, font names or px values.
 * px is allowed elsewhere only inside @media queries (the two breakpoints).
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ALLOWED_BREAKPOINTS = new Set(['720px', '1024px']);

export function lintCss(source, file = 'inline.css') {
  const problems = [];
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  stripped.split('\n').forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    if (/@media/.test(line)) {
      (line.match(/\d+px/g) || []).forEach((v) => {
        if (!ALLOWED_BREAKPOINTS.has(v)) problems.push(`${at} breakpoint ${v} is not in DESIGN.md`);
      });
      return;
    }
    if (/#[0-9a-fA-F]{3,8}\b/.test(line)) problems.push(`${at} raw hex color`);
    if (/\b(rgba?|hsla?)\(/.test(line)) problems.push(`${at} raw color function`);
    if (/\d(\.\d+)?px\b/.test(line)) problems.push(`${at} raw px value`);
    if (/font-family\s*:(?!\s*var\()/.test(line)) problems.push(`${at} font-family must use a --font-* token`);
  });
  return problems;
}

async function main() {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.css') && f !== 'tokens.css');
  const problems = (await Promise.all(files.map(async (f) => lintCss(await readFile(join(dir, f), 'utf8'), f)))).flat();
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`Token lint passed (${files.length} stylesheets).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
