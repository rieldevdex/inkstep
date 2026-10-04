/** Atoms: the smallest presentational pieces. Pure: props in, SafeHtml out. */
import { html, raw, cx } from '../lib/html.js';

export const Dot = ({ className } = {}) => html`<span class="${cx('dot', className)}" aria-hidden="true"></span>`;

export const Label = ({ text, className }) => html`<p class="${cx('label', className)}">${text}</p>`;

export function Button({ href, text, variant = 'solid', external = false, cursor }) {
  const rel = external ? ' target="_blank" rel="noopener"' : '';
  return html`<a class="${cx('btn', `btn--${variant}`)}" href="${href}"${raw(rel)}${cursor ? raw(` data-cursor="${cursor}"`) : ''}>${text}${external ? Icon('arrow') : ''}</a>`;
}

export function Chip({ text, pressed, value, count }) {
  return html`<button type="button" class="chip" data-filter="${value}" aria-pressed="${pressed ? 'true' : 'false'}">${text}${count !== undefined ? html`<span class="chip__count">${count}</span>` : ''}</button>`;
}

export const Tag = ({ text }) => html`<span class="tag">${text}</span>`;

export function Wordmark({ size = 'md', withDot = true, as = 'span' }) {
  const tag = raw(as);
  return html`<${tag} class="${cx('wordmark', `wordmark--${size}`)}"><span class="wordmark__word">inkstep</span>${withDot ? Dot({ className: 'wordmark__dot' }) : ''}</${tag}>`;
}

/** The climbing pen stroke from the logo. `steps` controls how many risers. */
export function InkStroke({ className, steps = 3 }) {
  const paths = {
    3: 'M6 54 Q90 52 176 51 L182 35 Q270 33 356 33 L362 17 Q450 15 548 14',
    4: 'M6 100 Q60 99 120 98 L126 76 Q186 74 246 74 L252 52 Q312 50 372 50 L378 28 Q438 26 498 26 L504 8',
  };
  const box = steps === 4 ? '0 0 560 108' : '0 0 560 64';
  return raw(`<svg class="${cx('stroke', className)}" viewBox="${box}" fill="none" aria-hidden="true" focusable="false"><path d="${paths[steps] || paths[3]}" pathLength="1"/></svg>`);
}

const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
};

export function Icon(name) {
  return raw(`<svg class="icon icon--${name}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`);
}

/** Otto, Eighthundred's AI tutor, as drawn on eighthundred.site. Decorative: always aria-hidden. */
export function Otto({ className } = {}) {
  return raw(`<svg class="${cx('otto', className)}" viewBox="0 0 120 132" aria-hidden="true" focusable="false"><path class="otto__line" d="M36 92 Q24 92 17 83" stroke-width="6"/><path class="otto__line" d="M84 92 Q96 92 103 83" stroke-width="6"/><ellipse class="otto__shape" cx="60" cy="97" rx="28" ry="24" stroke-width="6"/><ellipse class="otto__shape" cx="60" cy="52" rx="23" ry="21" stroke-width="6"/><ellipse class="otto__cheek" cx="44" cy="58" rx="4.2" ry="2.6"/><ellipse class="otto__cheek" cx="76" cy="58" rx="4.2" ry="2.6"/><ellipse class="otto__eye" cx="52" cy="50" rx="3.4" ry="4.4"/><ellipse class="otto__eye" cx="68" cy="50" rx="3.4" ry="4.4"/><circle class="otto__shine" cx="53.2" cy="48.4" r="1.2"/><circle class="otto__shine" cx="69.2" cy="48.4" r="1.2"/><path class="otto__mouth" d="M55 59 Q60 63.5 65 59" stroke-width="3"/><circle class="otto__dot" cx="60" cy="17" r="6.5"/></svg>`);
}
