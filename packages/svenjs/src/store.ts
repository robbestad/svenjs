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
  let state = freezeState((spec.state ?? {}) as S);
  const listeners = new Set<(s: S) => void>();

  const store: Store<S> = {
    get() {
      return state;
    },
    set(next) {
      const raw = typeof next === "function" ? (next as (s: S) => S)(state) : next;
      state = freezeState(raw);
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    listenTo(fn) {
      return store.subscribe(fn);
    },
    emit(data) {
      store.set(data);
    },
  };

  spec.init?.call(store);
  return store;
}
