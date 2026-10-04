/** Pure motion helpers shared by the client effects. */

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation; t is clamped to [0, 1]. */
export function lerp(from, to, t) {
  return from + (to - from) * clamp(t, 0, 1);
}

/**
 * Outline of one ink blot as a closed list of points.
 * Deterministic for a given seed so it can be tested.
 */
export function blotOutline({ x, y, r, seed }, points = 40) {
  const out = [];
  for (let i = 0; i <= points; i += 1) {
    const t = (i / points) * Math.PI * 2;
    const wobble = 1
      + 0.14 * Math.sin(t * 3 + seed)
      + 0.09 * Math.sin(t * 7 + seed * 1.7)
      + 0.05 * Math.sin(t * 13 + seed * 0.3);
    out.push([x + Math.cos(t) * r * wobble, y + Math.sin(t) * r * wobble]);
  }
  return out;
}

/** Ease a blot one frame toward its target radius; returns a new blot. */
export function growBlot(blot, rate = 0.06) {
  return { ...blot, r: blot.r + (blot.target - blot.r) * rate, life: blot.life + 1 };
}
