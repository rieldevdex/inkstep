import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, escapeHtml, raw, SafeHtml } from '../src/lib/html.js';
import { Chip, Button, Wordmark } from '../src/components/atoms.js';
import { TeamCard, StepItem, FilterBar } from '../src/components/molecules.js';
import { TeamsGrid, JoinBand } from '../src/components/organisms.js';
import { Page } from '../src/components/page.js';
import { site } from '../src/content/site.js';
import { initialState } from '../src/state/reducer.js';

test('html escapes interpolations but keeps SafeHtml and arrays', () => {
  const out = html`<p>${'<script>"x"&'}</p>${[raw('<b>1</b>'), '<i>']}`;
  assert.ok(out instanceof SafeHtml);
  assert.equal(out.value, '<p>&lt;script&gt;&quot;x&quot;&amp;</p><b>1</b>&lt;i&gt;');
  assert.equal(escapeHtml("it's"), 'it&#39;s');
  assert.equal(html`${null}${undefined}${false}`.value, '');
});

test('Chip exposes pressed state and filter value', () => {
  assert.match(Chip({ text: 'All', value: 'all', pressed: true, count: 6 }).value, /aria-pressed="true".*data-filter="all"|data-filter="all".*aria-pressed="true"/s);
  assert.match(Chip({ text: 'Grow', value: 'grow', pressed: false }).value, /aria-pressed="false"/);
});

test('external Button opens safely in a new tab', () => {
  const out = Button({ href: 'https://eighthundred.site', text: 'Go', external: true }).value;
  assert.match(out, /target="_blank" rel="noopener"/);
});

test('Wordmark always carries the signature dot unless disabled', () => {
  assert.match(Wordmark({}).value, /class="dot wordmark__dot"/);
  assert.doesNotMatch(Wordmark({ withDot: false }).value, /dot/);
});

test('TeamCard renders Vietnamese name with lang and escapes content', () => {
  const team = { ...site.teams[0], name: 'A & B' };
  const out = TeamCard({ team, index: 0 }).value;
  assert.match(out, /lang="vi">Ban Chuyên môn</);
  assert.match(out, /A &amp; B/);
  assert.match(out, />01</);
});

test('StepItem marks the two check steps', () => {
  const out = site.process.steps.map((step, index) => StepItem({ step, index, total: 7 }).value);
  assert.equal(out.filter((s) => s.includes('step--check')).length, 2);
});

test('FilterBar presses exactly the active chip', () => {
  const out = FilterBar({ filters: site.teamFilters, active: 'grow', counts: { all: 6, make: 3, grow: 3 } }).value;
  assert.equal((out.match(/aria-pressed="true"/g) || []).length, 1);
  assert.match(out, /data-filter="grow" aria-pressed="true"/);
});

test('TeamsGrid shows only the filtered teams and the right count', () => {
  const out = TeamsGrid({ site, state: { ...initialState, teamFilter: 'make' } }).value;
  assert.equal((out.match(/<article class="team"/g) || []).length, 3);
  assert.match(out, /Showing 3 of 6/);
});

test('JoinBand shows a button only when an application URL exists', () => {
  assert.doesNotMatch(JoinBand({ site }).value, /Apply now/);
  assert.match(JoinBand({ site: { ...site, applyUrl: 'https://forms.example/apply' } }).value, /Apply now/);
});

test('Page has one h1, a skip link and unique ids', () => {
  const out = Page({ site, state: initialState }).value;
  assert.equal((out.match(/<h1/g) || []).length, 1);
  assert.match(out, /class="skip" href="#main"/);
  const ids = [...out.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids}`);
  ['work', 'teams', 'process', 'events', 'join'].forEach((id) => assert.ok(ids.includes(id), `missing #${id}`));
});

test('FeaturedProject shows the real screenshot with size and alt text', async () => {
  const { FeaturedProject } = await import('../src/components/organisms.js');
  const out = FeaturedProject({ featured: site.featured }).value;
  assert.match(out, /<img class="preview__shot" src="assets\/eighthundred-1000\.webp"/);
  assert.match(out, /width="1000" height="632"/);
  assert.match(out, /alt="Eighthundred home page/);
});
