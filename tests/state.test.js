import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reducer, initialState, actions } from '../src/state/reducer.js';
import { createStore } from '../src/state/store.js';
import { selectVisibleTeams, countByGroup, effectiveTheme, nextTheme } from '../src/state/selectors.js';
import { site } from '../src/content/site.js';

test('reducer returns initial state for unknown actions', () => {
  assert.equal(reducer(undefined, { type: '@@init' }), initialState);
  assert.equal(reducer(initialState, { type: 'nope' }), initialState);
});

test('teams/filter changes the filter without mutating the previous state', () => {
  const before = { ...initialState };
  const after = reducer(before, actions.filterTeams('make'));
  assert.equal(after.teamFilter, 'make');
  assert.equal(before.teamFilter, 'all');
  assert.notEqual(after, before);
});

test('teams/filter ignores unknown filters and no-op changes (same reference)', () => {
  assert.equal(reducer(initialState, actions.filterTeams('sales')), initialState);
  assert.equal(reducer(initialState, actions.filterTeams('all')), initialState);
});

test('theme/set accepts only known themes', () => {
  assert.equal(reducer(initialState, actions.setTheme('dark')).theme, 'dark');
  assert.equal(reducer(initialState, actions.setTheme('purple')), initialState);
});

test('menu toggles and closes; closing a closed menu keeps the same reference', () => {
  const open = reducer(initialState, actions.toggleMenu());
  assert.equal(open.menuOpen, true);
  assert.equal(reducer(open, actions.toggleMenu()).menuOpen, false);
  assert.equal(reducer(open, actions.closeMenu()).menuOpen, false);
  assert.equal(reducer(initialState, actions.closeMenu()), initialState);
});

test('store notifies only on real changes and supports unsubscribe', () => {
  const store = createStore(reducer);
  const calls = [];
  const off = store.subscribe((s, prev) => calls.push([prev.teamFilter, s.teamFilter]));
  store.dispatch(actions.filterTeams('grow'));
  store.dispatch(actions.filterTeams('grow'));
  store.dispatch(actions.filterTeams('bogus'));
  assert.deepEqual(calls, [['all', 'grow']]);
  off();
  store.dispatch(actions.filterTeams('make'));
  assert.equal(calls.length, 1);
  assert.equal(store.getState().teamFilter, 'make');
});

test('selectVisibleTeams filters by group and keeps order', () => {
  const make = selectVisibleTeams({ teamFilter: 'make' }, site.teams).map((t) => t.id);
  const grow = selectVisibleTeams({ teamFilter: 'grow' }, site.teams).map((t) => t.id);
  assert.deepEqual(make, ['content', 'developer', 'design']);
  assert.deepEqual(grow, ['marketing', 'pr', 'people']);
  assert.equal(selectVisibleTeams({ teamFilter: 'all' }, site.teams), site.teams);
});

test('countByGroup counts every filter shown in the bar', () => {
  const counts = countByGroup(site.teams);
  assert.deepEqual(counts, { all: 6, make: 3, grow: 3 });
  site.teamFilters.forEach((f) => assert.ok(counts[f.id] >= 0, `missing count for ${f.id}`));
});

test('theme toggle always flips what the viewer sees', () => {
  assert.equal(effectiveTheme('system', true), 'dark');
  assert.equal(effectiveTheme('system', false), 'light');
  assert.equal(effectiveTheme('light', true), 'light');
  assert.equal(nextTheme('system', true), 'light');
  assert.equal(nextTheme('system', false), 'dark');
  assert.equal(nextTheme('dark', false), 'light');
});
