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

/**
 * What the Eighthundred preview shows for the current answer and Reason.
 * Mirrors eighthundred.site: a wrong answer asks for a Reason, Otto compares it with his guess.
 */
export function selectPreview(state, preview) {
  const { pick, reason } = state.preview;
  const answered = pick !== null;
  const right = answered && pick === preview.answer;
  const miss = answered && !right ? preview.wrong[pick] : null;
  const nameOf = (id) => preview.reasons.find((r) => r.id === id)?.name ?? '';
  let otto = preview.otto.start;
  if (right) otto = preview.otto.right;
  else if (miss && !reason) otto = miss.otto;
  else if (miss && reason === miss.reason) otto = preview.otto.agree.replace('{reason}', nameOf(reason));
  else if (miss) otto = preview.otto.differ.replace('{likely}', nameOf(miss.reason));
  return { pick, reason, answered, right, miss, otto, askReason: Boolean(miss), done: right || Boolean(miss && reason) };
}
