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
  let notifying = false;
  const pending: S[] = [];

  function notify(current: S, errors: unknown[]) {
    for (const fn of [...listeners]) {
      try {
        fn(current);
      } catch (error) {
        errors.push(error);
      }
    }
  }

  const store = {
    get() {
      return state;
    },
    set(next: S | ((s: S) => S)) {
      const raw = typeof next === "function" ? (next as (s: S) => S)(state) : next;
      if (Object.is(raw, state)) return;
      state = import.meta.env.DEV ? freezeState(raw) : raw;
      if (notifying) {
        pending.push(state);
        return;
      }
      notifying = true;
      const errors: unknown[] = [];
      try {
        notify(state, errors);
        for (let i = 0; i < pending.length; i++) notify(pending[i], errors);
        pending.length = 0;
      } finally {
        notifying = false;
      }
      if (!errors.length) return;
      for (let i = 1; i < errors.length; i++) console.error(errors[i]);
      throw errors[0];
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
