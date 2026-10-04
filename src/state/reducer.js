/** Application state: pure data + a pure reducer. No DOM access here. */

export const TEAM_FILTERS = Object.freeze(['all', 'make', 'grow']);
export const THEMES = Object.freeze(['system', 'light', 'dark']);

export const initialState = Object.freeze({
  teamFilter: 'all',
  theme: 'system',
  menuOpen: false,
});

export const actions = {
  filterTeams: (filter) => ({ type: 'teams/filter', filter }),
  setTheme: (theme) => ({ type: 'theme/set', theme }),
  toggleMenu: () => ({ type: 'menu/toggle' }),
  closeMenu: () => ({ type: 'menu/close' }),
};

export function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'teams/filter':
      if (!TEAM_FILTERS.includes(action.filter) || action.filter === state.teamFilter) return state;
      return { ...state, teamFilter: action.filter };
    case 'theme/set':
      if (!THEMES.includes(action.theme) || action.theme === state.theme) return state;
      return { ...state, theme: action.theme };
    case 'menu/toggle':
      return { ...state, menuOpen: !state.menuOpen };
    case 'menu/close':
      return state.menuOpen ? { ...state, menuOpen: false } : state;
    default:
      return state;
  }
}
