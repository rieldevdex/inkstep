/** Application state: pure data + a pure reducer. No DOM access here. */

export const TEAM_FILTERS = Object.freeze(['all', 'make', 'grow']);
export const THEMES = Object.freeze(['system', 'light', 'dark']);
export const PREVIEW_CHOICES = 4;
export const PREVIEW_REASONS = Object.freeze(['slip', 'concept', 'app']);
const PREVIEW_START = Object.freeze({ pick: null, reason: null });

export const initialState = Object.freeze({
  teamFilter: 'all',
  theme: 'system',
  menuOpen: false,
  preview: PREVIEW_START,
});

export const actions = {
  filterTeams: (filter) => ({ type: 'teams/filter', filter }),
  setTheme: (theme) => ({ type: 'theme/set', theme }),
  toggleMenu: () => ({ type: 'menu/toggle' }),
  closeMenu: () => ({ type: 'menu/close' }),
  previewPick: (choice) => ({ type: 'preview/pick', choice }),
  previewReason: (reason) => ({ type: 'preview/reason', reason }),
  previewReset: () => ({ type: 'preview/reset' }),
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
    case 'preview/pick': {
      // one answer per try, as on Eighthundred: the choices lock until "Try it again"
      const ok = Number.isInteger(action.choice) && action.choice >= 0 && action.choice < PREVIEW_CHOICES;
      if (!ok || state.preview.pick !== null) return state;
      return { ...state, preview: { pick: action.choice, reason: null } };
    }
    case 'preview/reason':
      if (state.preview.pick === null || !PREVIEW_REASONS.includes(action.reason) || action.reason === state.preview.reason) return state;
      return { ...state, preview: { ...state.preview, reason: action.reason } };
    case 'preview/reset':
      return state.preview.pick === null ? state : { ...state, preview: PREVIEW_START };
    default:
      return state;
  }
}
