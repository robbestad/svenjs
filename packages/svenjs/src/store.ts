import { freezeState } from "./freeze";

export type Store<S> = {
  get(): S;
  set(next: S | ((s: S) => S)): void;
  subscribe(fn: (state: S) => void): () => void;
  listenTo(fn: (state: S) => void): () => void;
  emit(data: S): void;
};

export type StoreSpec<S> = {
  state?: S;
  init?(this: Store<S>): void;
};

export function createStore<S = any>(spec: StoreSpec<S> = {}): Store<S> {
  const initial = (spec.state === undefined ? {} : spec.state) as S;
  let state = import.meta.env.DEV ? freezeState(initial) : initial;
  const listeners = new Set<(s: S) => void>();

  const store = {
    get() {
      return state;
    },
    set(next: S | ((s: S) => S)) {
      const raw = typeof next === "function" ? (next as (s: S) => S)(state) : next;
      if (Object.is(raw, state)) return;
      state = import.meta.env.DEV ? freezeState(raw) : raw;
      const current = state;
      for (const fn of [...listeners]) fn(current);
    },
    subscribe(fn: (state: S) => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  } as Store<S>;
  store.listenTo = store.subscribe;
  store.emit = store.set;
  spec.init?.call(store);
  return store;
}
