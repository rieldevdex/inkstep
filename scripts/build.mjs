/**
 * Static build: pre-renders the page with the same components the client uses,
 * bundles the client, and writes a deployable dist/ folder.
 * Also writes preview/inkstep.html, a single self-contained file for previews.
 */
import { mkdir, readFile, writeFile, rm, copyFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { Page } from '../src/components/page.js';
import { site } from '../src/content/site.js';
import { initialState } from '../src/state/reducer.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const preview = join(root, 'preview');
const CSS_ORDER = ['tokens', 'base', 'atoms', 'molecules', 'organisms'];
const FONTS = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,700;0,800;1,400&family=JetBrains+Mono:wght@500&family=Atkinson+Hyperlegible+Next:wght@400;700&family=Fraunces:opsz,wght@9..144,600&display=swap';

const css = (await Promise.all(CSS_ORDER.map((n) => readFile(join(root, 'src/styles', `${n}.css`), 'utf8')))).join('\n');
const bundle = await build({
  entryPoints: [join(root, 'src/client/main.js')],
  bundle: true, format: 'iife', minify: true, target: ['es2020'], write: false,
});
const js = bundle.outputFiles[0].text;
const body = Page({ site, state: initialState }).value;

const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Inkstep</title>
<meta name="description" content="Inkstep is a student club that builds free learning tools, starting with Eighthundred, a free SAT Math platform.">
<meta property="og:title" content="Inkstep">
<meta property="og:description" content="A student club that builds free learning tools, one step at a time.">
<meta property="og:url" content="${site.url}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#F6F1E7">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">`;

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await writeFile(join(dist, 'assets/site.css'), css);
await writeFile(join(dist, 'assets/app.js'), js);
await copyFile(join(root, 'public/favicon.svg'), join(dist, 'favicon.svg'));
if (existsSync(join(root, 'public/assets'))) await cp(join(root, 'public/assets'), join(dist, 'assets'), { recursive: true });
await writeFile(join(dist, 'index.html'), `<!doctype html>
<html lang="en">
<head>
${head}
<link rel="stylesheet" href="assets/site.css">
<script src="assets/app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`);

// Single-file preview (the artifact host adds doctype/head/body itself). The page uses no images.
const previewBody = body;
await mkdir(preview, { recursive: true });
await writeFile(join(preview, 'inkstep.html'), `<title>Inkstep</title>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
</style>
${previewBody}
<script>
${js}
</script>
`);

console.log(`Built dist/ (${(css.length / 1024).toFixed(1)} KB css, ${(js.length / 1024).toFixed(1)} KB js) and preview/inkstep.html`);
