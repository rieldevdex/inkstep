/** Pure derivations from state + content. */

export function selectVisibleTeams(state, teams) {
  if (state.teamFilter === 'all') return teams;
  return teams.filter((team) => team.group === state.teamFilter);
}

export function countByGroup(teams) {
  return teams.reduce(
    (acc, team) => ({ ...acc, all: acc.all + 1, [team.group]: (acc[team.group] || 0) + 1 }),
    { all: 0 },
  );
}

/** The theme actually shown, given the stored choice and the OS preference. */
export function effectiveTheme(theme, prefersDark) {
  if (theme === 'light' || theme === 'dark') return theme;
  return prefersDark ? 'dark' : 'light';
}

/** Theme after pressing the toggle: always the opposite of what is shown. */
export function nextTheme(theme, prefersDark) {
  return effectiveTheme(theme, prefersDark) === 'dark' ? 'light' : 'dark';
}
