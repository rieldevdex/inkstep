/**
 * Tiny, safe HTML templating used by every component.
 * Interpolated values are escaped unless they are already SafeHtml.
 */
export class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(input) {
  return String(input).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

function toHtml(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(toHtml).join('');
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += toHtml(values[i]) + strings[i + 1];
  }
  return new SafeHtml(out);
}

/** Mark a trusted string (e.g. static SVG) as safe. Never pass user input. */
export function raw(trusted) {
  return new SafeHtml(String(trusted));
}

/** Join class names, skipping falsy entries. */
export function cx(...names) {
  return names.filter(Boolean).join(' ');
}

/**
 * Question text with two tiny marks, escaped first: *x* is a math variable (italic),
 * {…} keeps a piece of math on one line.
 */
export function mathText(text) {
  return new SafeHtml(escapeHtml(text)
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/\{([^{}]+)\}/g, '<span class="nw">$1</span>'));
}
