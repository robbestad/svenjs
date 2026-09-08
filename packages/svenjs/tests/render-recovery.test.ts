import { afterEach, describe, expect, it, vi } from "vitest";
import { create, flushSync, Fragment, h, hydrate, render, unmountRoot, type VNode } from "svenjs";

const roots: Element[] = [];

function host() {
  const root = document.createElement("div");
  document.body.append(root);
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    unmountRoot(root);
    root.remove();
  }
  vi.restoreAllMocks();
});

function trackedItems() {
  const failure = new Error("child render failed");
  const mounts: string[] = [];
  const destroys: string[] = [];
  const unsubscribes: string[] = [];
  const refs = new Map<string, ReturnType<typeof vi.fn>>();
  const Item = create({
    onBeforeMount() {
      const id = this.props.id;
      this.observe({ subscribe: () => () => { unsubscribes.push(id); } });
    },
    onMount() { mounts.push(this.props.id); },
    onDestroy() { destroys.push(this.props.id); },
    render() {
      if (this.props.fail) throw failure;
      return h("span", { "data-item": this.props.id, ref: refs.get(this.props.id) }, this.props.id);
    },
  });
  return {
    failure, mounts, destroys, unsubscribes, refs,
    item(id: string, fail = false) {
      if (!refs.has(id)) refs.set(id, vi.fn());
      return h(Item, { key: id, id, fail });
    },
  };
}

function clearedRefCount(ref: ReturnType<typeof vi.fn>) {
  return ref.mock.calls.filter(([node]) => node === null).length;
}

describe("render failure recovery", () => {
  it.each(["element", "fragment", "component"] as const)(
    "recovers an explicit %s root update after mounting a child before another child throws",
    (kind) => {
      const root = host();
      const tracked = trackedItems();
      const Wrapper = create({ render() { return h("div", {}, this.props.children); } });
      const tree = (children: VNode[]) => h(kind === "element" ? "div" : kind === "fragment" ? Fragment : Wrapper, {}, children);

      render(tree([tracked.item("a")]), root);
      expect(() => render(tree([tracked.item("b"), tracked.item("boom", true)]), root)).toThrow(tracked.failure);
      expect(root.childNodes).toHaveLength(0);
      render(tree([tracked.item("c")]), root);

      expect(root.textContent).toBe("c");
      expect(root.querySelectorAll("[data-item]")).toHaveLength(1);
      expect(tracked.mounts).toEqual(["a", "c"]);
      expect(tracked.destroys.filter((id) => id === "b")).toHaveLength(1);
      expect(tracked.unsubscribes.filter((id) => id === "boom")).toHaveLength(1);
      expect(clearedRefCount(tracked.refs.get("b")!)).toBe(1);

      unmountRoot(root);
      expect(root.childNodes).toHaveLength(0);
      expect(tracked.destroys.sort()).toEqual(["a", "b", "boom", "c"]);
      expect(tracked.unsubscribes.sort()).toEqual(["a", "b", "boom", "c"]);
      expect(clearedRefCount(tracked.refs.get("a")!)).toBe(1);
      expect(clearedRefCount(tracked.refs.get("c")!)).toBe(1);
    },
  );

  it.each(["element", "fragment", "empty"] as const)(
    "lets the same instance retry a failed state update from an %s output without disturbing siblings",
    (kind) => {
      const root = host();
      const tracked = trackedItems();
      const ownerDestroyed = vi.fn();
      let instance: any;
      const App = create({
        initialState: { step: 0 },
        onMount() { instance = this; },
        onDestroy: ownerDestroyed,
        render() {
          if (kind === "empty" && this.state.step === 0) return null;
          const children = this.state.step === 0 ? [tracked.item("a")]
            : this.state.step === 1 ? [tracked.item("b"), tracked.item("boom", true)]
              : [tracked.item("c")];
          return h(kind === "element" ? "div" : Fragment, {}, children);
        },
      });
      render(h("section", {}, h("i", {}, "before"), h(App, {}), h("i", {}, "after")), root);
      const outside = [...root.querySelectorAll("i")];

      expect(() => flushSync(() => instance.setState({ step: 1 }))).toThrow(tracked.failure);
      expect(ownerDestroyed).not.toHaveBeenCalled();
      expect(root.textContent).toBe("beforeafter");
      flushSync(() => instance.setState({ step: 2 }));

      expect(root.textContent).toBe("beforecafter");
      expect(root.querySelectorAll("i")[0]).toBe(outside[0]);
      expect(root.querySelectorAll("i")[1]).toBe(outside[1]);
      expect(tracked.mounts).toEqual(kind === "empty" ? ["c"] : ["a", "c"]);
      expect(tracked.destroys.filter((id) => id === "b")).toHaveLength(1);
      expect(tracked.unsubscribes.filter((id) => id === "boom")).toHaveLength(1);
      expect(clearedRefCount(tracked.refs.get("b")!)).toBe(1);

      unmountRoot(root);
      expect(ownerDestroyed).toHaveBeenCalledTimes(1);
      expect(tracked.destroys.sort()).toEqual(kind === "empty" ? ["b", "boom", "c"] : ["a", "b", "boom", "c"]);
      expect(tracked.unsubscribes).toHaveLength(tracked.destroys.length);
    },
  );

  it("cleans a reused child and its ref once when a later sibling fails", () => {
    const root = host();
    const tracked = trackedItems();
    render(h("div", {}, tracked.item("a")), root);
    expect(() => render(h("div", {}, tracked.item("b"), tracked.item("a"), tracked.item("boom", true)), root)).toThrow(tracked.failure);
    render(h("div", {}, tracked.item("c")), root);
    unmountRoot(root);

    expect(root.childNodes).toHaveLength(0);
    expect(tracked.destroys.sort()).toEqual(["a", "b", "boom", "c"]);
    expect(tracked.unsubscribes.sort()).toEqual(["a", "b", "boom", "c"]);
    expect(clearedRefCount(tracked.refs.get("a")!)).toBe(1);
    expect(clearedRefCount(tracked.refs.get("b")!)).toBe(1);
  });

  it("clears replaced refs exactly once when a later sibling fails", () => {
    const root = host();
    const previous = vi.fn();
    const replacement = vi.fn();
    const failure = new Error("later sibling failed");
    const Broken = create({ render() { throw failure; } });
    render(h(Fragment, {}, h("span", { key: "shared", ref: previous }, "before")), root);
    const element = root.querySelector("span");

    expect(() => render(h(Fragment, {},
      h("span", { key: "shared", ref: replacement }, "after"),
      h(Broken, { key: "broken" }),
    ), root)).toThrow(failure);

    expect(previous.mock.calls).toEqual([[element], [null]]);
    expect(replacement.mock.calls).toEqual([[element], [null]]);
    expect(root.childNodes).toHaveLength(0);
    render(h("span", {}, "recovered"), root);
    expect(root.textContent).toBe("recovered");
  });

  it("clears only the active ref if a child fails before ref replacement, preserving the render error", () => {
    const root = host();
    const failure = new Error("child failed before ref replacement");
    const previous = vi.fn((element: Element | null) => {
      if (element === null) throw new Error("ref cleanup failed");
    });
    const proposed = vi.fn();
    const Broken = create({ render() { throw failure; } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(h("div", { ref: previous }, "before"), root);
    const element = root.firstElementChild;

    let caught;
    try { render(h("div", { ref: proposed }, h(Broken, {})), root); }
    catch (error) { caught = error; }

    expect(caught).toBe(failure);
    expect(previous.mock.calls).toEqual([[element], [null]]);
    expect(proposed).not.toHaveBeenCalled();
    expect(root.childNodes).toHaveLength(0);
    render(h("span", {}, "recovered"), root);
    expect(root.textContent).toBe("recovered");
  });

  it.each(["attach", "detach"] as const)("finishes cleanup when a ref %s callback throws without masking its error", (phase) => {
    const root = host();
    const failure = new Error(`${phase} ref failed`);
    const previous = vi.fn((element: Element | null) => {
      if (phase === "detach" && element === null) throw failure;
    });
    const replacement = vi.fn((element: Element | null) => {
      if (element !== null) throw failure;
      throw new Error("replacement ref cleanup failed");
    });
    const siblingRef = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(h(Fragment, {},
      h("span", { key: "shared", ref: previous }, "before"),
      h("i", { key: "sibling", ref: siblingRef }, "sibling"),
    ), root);
    const element = root.querySelector("span");
    const sibling = root.querySelector("i");

    let caught;
    try {
      render(h(Fragment, {},
        h("span", { key: "shared", ref: replacement }, "after"),
        h("i", { key: "sibling", ref: siblingRef }, "sibling"),
      ), root);
    } catch (error) { caught = error; }

    expect(caught).toBe(failure);
    expect(previous.mock.calls).toEqual([[element], [null]]);
    expect(replacement.mock.calls).toEqual(phase === "attach" ? [[element], [null]] : []);
    expect(siblingRef.mock.calls).toEqual([[sibling], [null]]);
    expect(root.childNodes).toHaveLength(0);
    render(h("span", {}, "recovered"), root);
    expect(root.textContent).toBe("recovered");
  });

  it.each([false, true])("cleans partial first mount resources and permits retry (hydrate: %s)", (hydrating) => {
    const root = host();
    const tracked = trackedItems();
    if (hydrating) root.innerHTML = '<span data-item="b">server</span><strong>unclaimed server tail</strong>';
    const start = hydrating ? hydrate : render;

    expect(() => start(h(Fragment, {}, tracked.item("b"), tracked.item("boom", true)), root)).toThrow(tracked.failure);
    expect(root.childNodes).toHaveLength(0);
    expect(tracked.mounts).toEqual([]);
    expect(tracked.destroys.sort()).toEqual(["b", "boom"]);
    expect(tracked.unsubscribes.sort()).toEqual(["b", "boom"]);
    expect(clearedRefCount(tracked.refs.get("b")!)).toBe(1);

    render(h(Fragment, {}, tracked.item("c")), root);
    expect(root.textContent).toBe("c");
    expect(tracked.mounts).toEqual(["c"]);
    unmountRoot(root);
    expect(root.childNodes).toHaveLength(0);
    expect(tracked.destroys.sort()).toEqual(["b", "boom", "c"]);
  });

  it.each([false, true])("unsubscribes after onBeforeMount throws and can mount again (hydrate: %s)", (hydrating) => {
    const root = host();
    const failure = new Error("before mount failed");
    const off = vi.fn();
    const destroy = vi.fn();
    const renderChild = vi.fn(() => h("span", {}, "unreachable"));
    const Broken = create({
      onBeforeMount() {
        this.observe({ subscribe: () => off });
        throw failure;
      },
      onDestroy: destroy,
      render: renderChild,
    });
    expect(() => (hydrating ? hydrate : render)(Broken, root)).toThrow(failure);
    expect(off).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(renderChild).not.toHaveBeenCalled();
    render(h("span", {}, "recovered"), root);
    expect(root.textContent).toBe("recovered");
  });

  it("keeps the render error primary while completing cleanup after unsubscribe and destroy errors", () => {
    const root = host();
    const failure = new Error("primary render error");
    const off = vi.fn();
    const destroy = vi.fn();
    const ref = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Partial = create({
      onBeforeMount() {
        this.observe({ subscribe: () => () => { throw new Error("unsubscribe error"); } });
        this.observe({ subscribe: () => off });
      },
      onDestroy() { destroy(); throw new Error("destroy error"); },
      render() { return h("span", { ref }, "partial"); },
    });
    const Broken = create({ render() { throw failure; } });
    render(h("div", {}, "previous"), root);
    expect(() => render(h("div", {}, h(Partial, {}), h(Broken, {})), root)).toThrow(failure);
    expect(off).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(clearedRefCount(ref)).toBe(1);

    render(h("div", {}, "recovered"), root);
    expect(root.textContent).toBe("recovered");
    unmountRoot(root);
    expect(root.childNodes).toHaveLength(0);
  });

  it("preserves a successful independent nested root and its mount hooks when the outer root fails", () => {
    const root = host();
    const independent = host();
    const failure = new Error("outer render failed");
    const mount = vi.fn();
    const destroy = vi.fn();
    let instance: any;
    const Nested = create({
      initialState: { text: "independent" },
      onMount() { instance = this; mount(); },
      onDestroy: destroy,
      render() { return h("span", {}, this.state.text); },
    });
    const Broken = create({ render() { throw failure; } });
    const Outer = create({
      render() {
        render(Nested, independent);
        return h("div", {}, h("span", {}, "partial"), h(Broken, {}));
      },
    });

    expect(() => render(Outer, root)).toThrow(failure);
    expect(root.childNodes).toHaveLength(0);
    expect(independent.textContent).toBe("independent");
    expect(mount).toHaveBeenCalledTimes(1);
    expect(destroy).not.toHaveBeenCalled();
    flushSync(() => instance.setState({ text: "still updates" }));
    expect(independent.textContent).toBe("still updates");
    expect(mount).toHaveBeenCalledTimes(1);
    unmountRoot(independent);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("reports secondary cleanup errors only in the caught failed nested commit", () => {
    const root = host();
    const nested = host();
    const failure = new Error("nested render failed");
    const cleanupFailure = new Error("nested destroy failed");
    const reported = vi.spyOn(console, "error").mockImplementation(() => {});
    const Old = create({
      onDestroy() { throw cleanupFailure; },
      render() { return h("span", {}, "old nested root"); },
    });
    const Broken = create({ render() { throw failure; } });
    let caught;
    const Outer = create({
      render() {
        try { render(Broken, nested); }
        catch (error) { caught = error; }
        return h("span", {}, "outer succeeded");
      },
    });
    render(Old, nested);

    expect(() => render(Outer, root)).not.toThrow();
    expect(caught).toBe(failure);
    expect(reported.mock.calls).toEqual([[cleanupFailure]]);
    expect(root.textContent).toBe("outer succeeded");
    expect(nested.childNodes).toHaveLength(0);
    render(h("span", {}, "nested recovered"), nested);
    expect(nested.textContent).toBe("nested recovered");
    expect(reported.mock.calls).toEqual([[cleanupFailure]]);
  });
});
