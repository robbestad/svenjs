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

  it("notifies remaining listeners when one throws", () => {
    const store = createStore({ state: 0 });
    const seen: number[] = [];
    store.subscribe(() => {
      throw new Error("boom");
    });
    store.subscribe((state) => {
      seen.push(state);
    });
    expect(() => store.set(1)).toThrow("boom");
    expect(seen).toEqual([1]);
    expect(store.get()).toBe(1);
  });

  it("queues nested set so listeners see states in order", () => {
    const store = createStore({ state: 0 });
    const seen: Array<[string, number, number]> = [];
    store.subscribe((state) => {
      seen.push(["a", state, store.get()]);
      if (state === 1) store.set(2);
    });
    store.subscribe((state) => {
      seen.push(["b", state, store.get()]);
    });
    store.set(1);
    expect(store.get()).toBe(2);
    expect(seen).toEqual([
      ["a", 1, 1],
      ["b", 1, 2],
      ["a", 2, 2],
      ["b", 2, 2],
    ]);
  });

  it("clones Map, Set, Date, and typed arrays without throwing", () => {
    const store = createStore({
      state: {
        map: new Map([["a", { n: 1 }]]),
        set: new Set([1]),
        date: new Date("2020-01-01"),
        bytes: new Uint8Array([1, 2, 3]),
      },
    });
    const state = store.get();
    state.map.set("b", { n: 2 });
    state.set.add(2);
    state.date.setFullYear(2021);
    state.bytes[0] = 9;
    expect(state.map.size).toBe(2);
    expect(state.bytes[0]).toBe(9);
  });
});
