/** Trailing ink cursor for fine pointers. The native cursor stays visible. */
import { lerp } from '../lib/motion.js';

export function mountCursor(el) {
  if (!el || !window.matchMedia('(pointer: fine)').matches) return () => {};
  const label = el.querySelector('.cursor__label');
  const target = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  let frame = 0;

  document.documentElement.classList.add('has-cursor');
  const onMove = (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
    const hit = e.target.closest?.('[data-cursor]');
    el.classList.toggle('is-active', Boolean(hit));
    label.textContent = hit ? hit.getAttribute('data-cursor') : '';
  };
  const tick = () => {
    pos.x = lerp(pos.x, target.x, 0.2);
    pos.y = lerp(pos.y, target.y, 0.2);
    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    frame = requestAnimationFrame(tick);
  };
  window.addEventListener('pointermove', onMove);
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onMove);
    document.documentElement.classList.remove('has-cursor');
  };
}
