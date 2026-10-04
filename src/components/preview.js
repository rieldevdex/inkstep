/**
 * The Eighthundred preview: one question from eighthundred.site's homepage, rebuilt with
 * Eighthundred's own markup and look, and marked as a preview. Pure: props in, SafeHtml out.
 */
import { html, mathText, raw } from '../lib/html.js';
import { Otto } from './atoms.js';
import { selectPreview } from '../state/selectors.js';

const LETTERS = 'ABCD';
const plain = (text) => text.replace(/[*{}]/g, '');

/** The part that changes as you answer. The client re-renders it into [data-slot="ehp"]. */
export function PreviewQuestion({ preview, state, url }) {
  const view = selectPreview(state, preview);
  const choice = (text, i) => {
    const isRight = view.answered && i === preview.answer;
    const isWrong = view.answered && !view.right && i === view.pick;
    return html`<button type="button" class="ehp__choice${isRight ? ' is-right' : ''}${isWrong ? ' is-wrong' : ''}" data-eh-pick="${i}" aria-pressed="${i === view.pick ? 'true' : 'false'}"${view.answered ? raw(' disabled') : ''}><span class="ehp__letter">${LETTERS[i]}</span><span class="ehp__text">${text}</span></button>`;
  };
  let feedback = '';
  if (view.right) feedback = html`<p class="ehp__feedback ehp__feedback--good"><b>Right.</b> ${mathText(preview.right)}</p>`;
  else if (view.miss) feedback = html`<p class="ehp__feedback ehp__feedback--bad"><b>Not this one.</b> ${mathText(view.miss.why)} The answer is ${LETTERS[preview.answer]}.</p>`;
  const reasons = view.askReason
    ? html`<fieldset class="ehp__reason"><legend>${preview.reasonPrompt}</legend><div class="ehp__options">${preview.reasons.map((r) => html`<button type="button" data-eh-reason="${r.id}" aria-pressed="${r.id === view.reason ? 'true' : 'false'}">${r.name}<small>${r.note}</small></button>`)}</div></fieldset>`
    : '';
  const after = view.done
    ? html`<div class="ehp__after"><a class="ehp__btn ehp__btn--primary" href="${url}" target="_blank" rel="noopener">${preview.more} <span aria-hidden="true">→</span></a><button type="button" class="ehp__btn" data-eh-reset>${preview.again}</button></div>`
    : '';
  return html`<p class="ehp__qlabel"><span>${preview.label}</span><span>${preview.level}</span></p>
<p class="ehp__question" id="ehp-question">${mathText(preview.question)}</p>
<div class="ehp__choices">${preview.choices.map(choice)}</div>
${feedback}
<div class="ehp__otto">${Otto({ className: 'ehp__avatar' })}<p class="ehp__say"><span class="ehp__who">Otto <span class="ehp__tag">AI tutor</span></span>${view.otto}</p></div>
${reasons}${after}`;
}

/** Plain text for the screen-reader live region after each step. */
export function previewAnnouncement(preview, state) {
  const view = selectPreview(state, preview);
  if (!view.answered) return '';
  if (view.right) return `Right. ${plain(preview.right)} Otto: ${view.otto}`;
  const lead = view.reason ? '' : `Not this one. ${plain(view.miss.why)} The answer is ${LETTERS[preview.answer]}. `;
  return `${lead}Otto: ${view.otto}`;
}

export function EighthundredPreview({ preview, state, url, host }) {
  return html`<figure class="ehp" aria-label="${preview.flag}: Eighthundred">
  <div class="ehp__bar"><span class="ehp__dots" aria-hidden="true"><span></span><span></span><span></span></span><span class="ehp__url">${host}</span><strong class="ehp__flag">${preview.flag}</strong></div>
  <div class="ehp__page">
    <p class="ehp__brand"><span class="ehp__logo">Eighthundred</span><span class="ehp__beta">Beta</span></p>
    <div class="ehp__sheet" role="group" aria-labelledby="ehp-question" data-slot="ehp">${PreviewQuestion({ preview, state, url })}</div>
    <p class="ehp__live" role="status" aria-live="polite" data-slot="ehp-live"></p>
  </div>
  <figcaption class="ehp__caption"><strong>${preview.flag}.</strong> ${preview.caption} <a href="${url}" target="_blank" rel="noopener">Open ${host}</a></figcaption>
</figure>`;
}
