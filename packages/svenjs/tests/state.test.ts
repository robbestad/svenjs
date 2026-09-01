import { describe, expect, it, vi } from "vitest";
import { createStore } from "svenjs";

describe("state hardening", () => {
  it("rejects uncloneable state instead of silently corrupting it", () => {
    expect(() => createStore({ state: { callback: () => 1 } })).toThrow(
      "SvenJS: state must be structured-cloneable",
    );

    const store = createStore<any>({ state: { value: 1 } });
    expect(() => store.set({ value: 2, callback: () => 2 })).toThrow(
      "SvenJS: state must be structured-cloneable",
    );
    expect(store.get()).toEqual({ value: 1 });
  });

  it("keeps explicit null state", () => {
    const store = createStore<null>({ state: null });
    expect(store.get()).toBeNull();
  });

  it("does not clone or notify when an updater returns the current state", () => {
    const store = createStore({ state: { value: 1 } });
    const listener = vi.fn();
    store.subscribe(listener);

    const current = store.get();
    store.set((state) => state);

    expect(store.get()).toBe(current);
    expect(listener).not.toHaveBeenCalled();
  });

  it("notifies the listener snapshot present at the start of an update", () => {
    const store = createStore({ state: 0 });
    const calls: string[] = [];
    let added = false;
    let unsubscribeB = () => {};

    store.subscribe((state) => {
      calls.push(`a:${state}`);
      unsubscribeB();
      if (!added) {
        added = true;
        store.subscribe((next) => calls.push(`c:${next}`));
      }
    });
    unsubscribeB = store.subscribe((state) => calls.push(`b:${state}`));

    store.set(1);
    expect(calls).toEqual(["a:1", "b:1"]);

    store.set(2);
    expect(calls).toEqual(["a:1", "b:1", "a:2", "c:2"]);
  });
});
