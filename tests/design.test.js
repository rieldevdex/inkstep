import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { lintCss } from '../scripts/lint-tokens.mjs';
import { lerp, clamp, blotOutline, growBlot } from '../src/lib/motion.js';

test('token lint flags raw values and allows tokens', () => {
  assert.deepEqual(lintCss('.a { color: var(--color-ink); padding: var(--space-4); }'), []);
  assert.equal(lintCss('.a { color: #fff; }').length, 1);
  assert.equal(lintCss('.a { margin: 12px; }').length, 1);
  assert.equal(lintCss('.a { font-family: Arial; }').length, 1);
  assert.deepEqual(lintCss('@media (max-width: 720px) {'), []);
  assert.equal(lintCss('@media (max-width: 600px) {').length, 1);
});

test('every color token has a dark value', async () => {
  const css = await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
  const [light, darkMedia] = css.split('@media (prefers-color-scheme: dark)');
  const names = [...light.matchAll(/(--color-[a-z0-9-]+):\s*#/g)].map((m) => m[1]);
  assert.ok(names.length >= 10);
  names.forEach((n) => assert.ok(darkMedia.includes(`${n}:`), `${n} has no dark value`));
});

test('motion helpers', () => {
  assert.equal(clamp(5, 0, 1), 1);
  assert.equal(lerp(0, 10, 0.5), 5);
  assert.equal(lerp(0, 10, 2), 10);
  const pts = blotOutline({ x: 0, y: 0, r: 10, seed: 1 }, 20);
  assert.equal(pts.length, 21);
  // the outline closes on itself
  assert.ok(Math.abs(pts[0][0] - pts[20][0]) < 1e-9 && Math.abs(pts[0][1] - pts[20][1]) < 1e-9);
  const b = growBlot({ r: 0, target: 100, life: 0 }, 0.5);
  assert.deepEqual(b, { r: 50, target: 100, life: 1 });
});
