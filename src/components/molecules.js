/** Molecules: small groups of atoms with one job each. */
import { html } from '../lib/html.js';
import { Chip, Tag, Icon } from './atoms.js';

export const pad2 = (n) => String(n).padStart(2, '0');

export function StatTile({ n, label, note }) {
  return html`<div class="stat"><p class="stat__n">${n}</p><p class="stat__label">${label}</p><p class="stat__note">${note}</p></div>`;
}

export function FilterBar({ filters, active, counts }) {
  return html`<div class="filterbar" role="group" aria-label="Filter teams">${filters.map((f) => Chip({ text: f.label, value: f.id, pressed: f.id === active, count: counts[f.id] }))}</div>`;
}

export function TeamCard({ team, index }) {
  return html`<article class="team" data-team="${team.id}">
  <div class="team__top"><span class="team__index">${pad2(index + 1)}</span><span class="team__vi" lang="vi">${team.vi}</span></div>
  <h3 class="team__name">${team.name}</h3>
  <p class="team__summary">${team.summary}</p>
  <div class="team__trial"><p class="label">Trial task</p><p>${team.trial}</p></div>
  <div class="team__tags">${team.skills.map((s) => Tag({ text: s }))}</div>
</article>`;
}

export function StepItem({ step, index, total }) {
  return html`<li class="step${step.check ? ' step--check' : ''}" style="--i:${index};--n:${total}">
  <span class="step__index">${pad2(index + 1)}${step.check ? Icon('check') : ''}</span>
  <span class="step__name">${step.name}</span>
  <span class="step__text">${step.text}</span>
</li>`;
}

export function EventRow({ event, index }) {
  return html`<li class="event">
  <span class="event__index">${pad2(index + 1)}</span>
  <div class="event__main">
    <h3 class="event__name">${event.name}</h3>
    <p class="event__text">${event.text}</p>
  </div>
  <dl class="event__meta">
    <div><dt>When</dt><dd>${event.when}</dd></div>
    <div><dt>Format</dt><dd>${event.kind}${event.open ? html` · <strong>open to all students</strong>` : ''}</dd></div>
    <div><dt>Outcome</dt><dd>${event.prize}</dd></div>
  </dl>
</li>`;
}

export function PathItem({ step }) {
  return html`<li class="path__item"><span class="path__name">${step.name}</span><span class="path__text">${step.text}</span></li>`;
}
