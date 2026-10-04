/** Hero ink canvas: blots bloom where the pointer moves and slowly soak away. */
import { blotOutline, growBlot } from '../lib/motion.js';

const LIFE = 90;

export function mountInk(canvas, { reduceMotion }) {
  const host = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let blots = [];
  let width = 0;
  let height = 0;
  let rgb = '28 27 25';
  let last = null;
  let frame = 0;

  const readInk = () => {
    rgb = getComputedStyle(document.documentElement).getPropertyValue('--ink-rgb').trim() || rgb;
  };
  const resize = () => {
    const box = host.getBoundingClientRect();
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const fillOutline = (pts, alpha) => {
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.closePath();
    ctx.fillStyle = `rgb(${rgb} / ${alpha})`;
    ctx.fill();
  };
  const spawn = (x, y, big) => {
    const count = big ? 3 : 1;
    for (let i = 0; i < count; i += 1) {
      blots.push({
        x: x + (Math.random() - 0.5) * (big ? 30 : 6),
        y: y + (Math.random() - 0.5) * (big ? 30 : 6),
        r: 1,
        target: big ? 40 + Math.random() * 70 : 6 + Math.random() * 18,
        seed: Math.random() * 1000,
        alpha: big ? 0.07 : 0.05,
        life: 0,
      });
    }
  };
  const tick = () => {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgb(0 0 0 / 0.012)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    blots = blots.map((b) => growBlot(b)).filter((b) => b.life <= LIFE);
    blots.forEach((b) => fillOutline(blotOutline(b), b.alpha * (1 - b.life / LIFE)));
    frame = requestAnimationFrame(tick);
  };
  const drawStill = () => {
    for (let k = 0; k < 5; k += 1) {
      const b = { x: width * (0.55 + Math.random() * 0.4), y: height * (0.15 + Math.random() * 0.7), r: 30 + Math.random() * 60, seed: Math.random() * 1000 };
      for (let j = 0; j < 4; j += 1) {
        b.r *= 0.85;
        fillOutline(blotOutline(b), 0.035);
      }
    }
  };
  const local = (e) => {
    const box = canvas.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };
  const onMove = (e) => {
    const p = local(e);
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 26) {
      spawn(p.x, p.y, false);
      last = p;
    }
  };
  const onDown = (e) => {
    const p = local(e);
    spawn(p.x, p.y, true);
  };

  readInk();
  resize();
  const themeObserver = new MutationObserver(readInk);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener?.('change', readInk);
  const onResize = () => {
    resize();
    if (reduceMotion) drawStill();
  };
  window.addEventListener('resize', onResize);

  if (reduceMotion) {
    drawStill();
  } else {
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerdown', onDown);
    frame = requestAnimationFrame(tick);
    [[0.72, 0.3, 600], [0.86, 0.62, 1100], [0.62, 0.78, 1600], [0.92, 0.2, 2300]].forEach(([fx, fy, delay]) => {
      setTimeout(() => spawn(width * fx, height * fy, true), delay);
    });
  }

  return () => {
    cancelAnimationFrame(frame);
    themeObserver.disconnect();
    window.removeEventListener('resize', onResize);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerdown', onDown);
  };
}
