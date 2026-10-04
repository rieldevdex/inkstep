/**
 * Client entry: wires the store to the server-rendered page.
 * Business logic lives in src/state; this file only connects events and DOM.
 */
import { site } from '../content/site.js';
import { createStore } from '../state/store.js';
import { reducer, initialState, actions } from '../state/reducer.js';
import { nextTheme, selectVisibleTeams } from '../state/selectors.js';
import { TeamsList } from '../components/organisms.js';
import { Icon } from '../components/atoms.js';
import { mountInk } from './ink.js';
import { mountCursor } from './cursor.js';

const THEME_KEY = 'inkstep-theme';

const storage = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* storage unavailable: keep in memory */ }
  },
};

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

function boot() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = storage.get(THEME_KEY);
  const store = createStore(reducer, { ...initialState, theme: savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'system' });

  const $ = (sel) => document.querySelector(sel);
  const header = $('.header');
  const menuBtn = $('[data-action="menu"]');
  const teamsSlot = $('[data-slot="teams"]');
  const countSlot = $('[data-slot="team-count"]');

  if (store.getState().theme !== 'system') applyTheme(store.getState().theme);

  store.subscribe((state, prev) => {
    if (state.theme !== prev.theme) {
      applyTheme(state.theme);
      storage.set(THEME_KEY, state.theme);
    }
    if (state.menuOpen !== prev.menuOpen) {
      header.dataset.menuOpen = String(state.menuOpen);
      menuBtn.setAttribute('aria-expanded', String(state.menuOpen));
      menuBtn.innerHTML = Icon(state.menuOpen ? 'close' : 'menu').value;
    }
    if (state.teamFilter !== prev.teamFilter) {
      teamsSlot.innerHTML = TeamsList({ site, state }).value;
      [...teamsSlot.children].forEach((card, i) => {
        card.style.setProperty('--enter-i', i);
        card.classList.add('is-entering');
      });
      document.querySelectorAll('[data-filter]').forEach((chip) => {
        chip.setAttribute('aria-pressed', String(chip.dataset.filter === state.teamFilter));
      });
      countSlot.textContent = `Showing ${selectVisibleTeams(state, site.teams).length} of ${site.teams.length}`;
    }
  });

  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (chip) return void store.dispatch(actions.filterTeams(chip.dataset.filter));
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'theme') return void store.dispatch(actions.setTheme(nextTheme(store.getState().theme, prefersDark.matches)));
    if (action === 'menu') return void store.dispatch(actions.toggleMenu());
    if (e.target.closest('.header__nav a')) store.dispatch(actions.closeMenu());
    return undefined;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && store.getState().menuOpen) {
      store.dispatch(actions.closeMenu());
      menuBtn.focus();
    }
  });

  // Process staircase draws itself once it scrolls into view.
  const steps = $('[data-slot="steps"]');
  if (steps && !reduceMotion && 'IntersectionObserver' in window) {
    const box = steps.getBoundingClientRect();
    if (box.top > window.innerHeight) {
      steps.classList.add('will-draw');
      const io = new IntersectionObserver((entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          steps.classList.add('is-drawn');
          io.disconnect();
        }
      }, { threshold: 0.35 });
      io.observe(steps);
    }
  }

  const canvas = $('.hero__ink');
  if (canvas) mountInk(canvas, { reduceMotion });
  if (!reduceMotion) mountCursor($('.cursor'));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
