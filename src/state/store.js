/** Minimal observable store. Listeners run only when state actually changes. */
export function createStore(reducer, preloaded) {
  let state = preloaded === undefined ? reducer(undefined, { type: '@@init' }) : preloaded;
  const listeners = new Set();

  return {
    getState: () => state,
    dispatch(action) {
      const prev = state;
      state = reducer(state, action);
      if (state !== prev) listeners.forEach((fn) => fn(state, prev));
      return action;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
