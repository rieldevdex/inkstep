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

test('FeaturedProject shows a live Eighthundred preview, marked as a preview, and when its numbers were counted', async () => {
  const { FeaturedProject } = await import('../src/components/organisms.js');
  const out = FeaturedProject({ featured: site.featured }).value;
  assert.doesNotMatch(out, /<img|\.webp/);
  assert.match(out, /<strong class="ehp__flag">This is a preview<\/strong>/);
  assert.match(out, /<figcaption class="ehp__caption"><strong>This is a preview\.<\/strong>/);
  assert.equal((out.match(/data-eh-pick=/g) || []).length, 4);
  assert.match(out, /Counted on eighthundred\.site on 3 October 2026\./);
});

test('mathText escapes, then italicises *x* and keeps {…} on one line', async () => {
  const { mathText } = await import('../src/lib/html.js');
  assert.equal(mathText('If {4*x* − 7 = 21} & <b>').value, 'If <span class="nw">4<i>x</i> − 7 = 21</span> &amp; &lt;b&gt;');
});

test('PreviewQuestion: before answering, no feedback and Otto invites an answer', async () => {
  const { PreviewQuestion } = await import('../src/components/preview.js');
  const { preview } = site.featured;
  const out = PreviewQuestion({ preview, state: initialState, url: site.featured.url }).value;
  assert.doesNotMatch(out, /ehp__feedback|data-eh-reason|disabled/);
  assert.match(out, new RegExp(preview.otto.start));
});

test('PreviewQuestion: a wrong answer locks the choices, explains it and asks for a Reason', async () => {
  const { PreviewQuestion, previewAnnouncement } = await import('../src/components/preview.js');
  const { preview } = site.featured;
  const state = { ...initialState, preview: { pick: 2, reason: null } };
  const out = PreviewQuestion({ preview, state, url: site.featured.url }).value;
  assert.equal((out.match(/ disabled/g) || []).length, 4);
  assert.match(out, /is-wrong" data-eh-pick="2" aria-pressed="true"/);
  assert.match(out, /is-right" data-eh-pick="1"/);
  assert.match(out, /Not this one\.<\/b> 7 is the value of <i>x<\/i>\./);
  assert.equal((out.match(/data-eh-reason=/g) || []).length, 3);
  assert.doesNotMatch(out, /data-eh-reset/);
  assert.match(previewAnnouncement(preview, state), /^Not this one\. 7 is the value of x\. .*The answer is B\. Otto: /);
});

test('PreviewQuestion: Otto agrees or differs with the chosen Reason, then offers another try', async () => {
  const { PreviewQuestion } = await import('../src/components/preview.js');
  const { preview } = site.featured;
  const agree = PreviewQuestion({ preview, state: { ...initialState, preview: { pick: 2, reason: 'app' } }, url: site.featured.url }).value;
  assert.match(agree, /That’s my guess too\. .*under “I didn’t see it was this idea”/);
  assert.match(agree, /data-eh-reason="app" aria-pressed="true"/);
  assert.match(agree, /data-eh-reset/);
  const differ = PreviewQuestion({ preview, state: { ...initialState, preview: { pick: 0, reason: 'concept' } }, url: site.featured.url }).value;
  assert.match(differ, /My guess was “I slipped”/);
});

test('PreviewQuestion: the right answer needs no Reason', async () => {
  const { PreviewQuestion } = await import('../src/components/preview.js');
  const { preview } = site.featured;
  const out = PreviewQuestion({ preview, state: { ...initialState, preview: { pick: 1, reason: null } }, url: site.featured.url }).value;
  assert.match(out, /ehp__feedback--good"><b>Right\.<\/b>/);
  assert.doesNotMatch(out, /data-eh-reason/);
  assert.match(out, /data-eh-reset/);
});
