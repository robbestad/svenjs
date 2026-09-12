import { afterEach, expect, it } from "vitest";
import { create, flushSync, h, hydrate, render, unmountRoot } from "svenjs";

const roots: Element[] = [];
function host() {
  const root = document.createElement("div");
  document.body.append(root);
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) { unmountRoot(root); root.remove(); }
  flushSync();
});

it.each(["render", "hydrate"] as const)("defers outer mount hooks during a nested flush (%s)", (mode) => {
  const mount = mode === "render" ? render : hydrate;
  let counter: any;
  const Counter = create({
    initialState: { n: 0 },
    onMount() { counter = this; },
    render() { return h("b", {}, this.state.n); },
  });
  const counterRoot = host();
  render(Counter, counterRoot);
  const connected: boolean[] = [];
  const Child = create({
    onMount() { connected.push(this.el.isConnected); this.el.focus(); },
    render() { return h("input", { ref: (el: Element | null) => { this.el = el; } }); },
  });
  const Trigger = create({
    onBeforeMount() {
      flushSync(() => counter.setState({ n: 1 }));
      expect(counterRoot.textContent).toBe("1");
      expect(connected).toEqual([]);
    },
    render() { return h("span", {}, "trigger"); },
  });
  const root = host();
  if (mode === "hydrate") root.innerHTML = "<div><input><span>trigger</span></div>";
  mount(h("div", {}, h(Child, {}), h(Trigger, {})), root);
  expect(connected).toEqual([true]);
  expect(document.activeElement).toBe(root.querySelector("input"));
});

it("does not mount a partial tree when a sibling fails after a nested flush", () => {
  let counter: any;
  const Counter = create({
    initialState: 0,
    onMount() { counter = this; },
    render() { return h("b", {}, this.state); },
  });
  render(Counter, host());
  const log: string[] = [];
  const Child = create({
    onMount() { log.push("mount"); },
    onDestroy() { log.push("destroy"); },
    render() { return h("input", {}); },
  });
  const Broken = create({
    onBeforeMount() { flushSync(() => counter.setState(1)); },
    render() { throw new Error("sibling failed"); },
  });
  const root = host();
  expect(() => render(h("div", {}, h(Child, {}), h(Broken, {})), root)).toThrow("sibling failed");
  expect(log).toEqual(["destroy"]);
  expect(root.childNodes).toHaveLength(0);
});

it("mounts roots created by onMount before draining their queued updates", () => {
  const log: string[] = [];
  const nestedRoot = host();
  let owner: any;
  const Nested = create({
    initialState: { n: 0 },
    onBeforeMount() { this.setState({ n: 1 }); },
    onMount() { this.ready = true; log.push("mount"); },
    onUpdate() {
      expect(this.ready).toBe(true);
      log.push("update");
      if (this.state.n === 1) this.setState({ n: 2 });
    },
    render() { return h("b", {}, this.state.n); },
  });
  const Starter = create({
    onMount() { render(Nested, nestedRoot); },
    render() { return h("i", {}, "starter"); },
  });
  const Owner = create({
    initialState: { show: false },
    onMount() { owner = this; },
    render() { return h("div", {}, this.state.show ? h(Starter, {}) : null); },
  });
  render(Owner, host());
  flushSync(() => owner.setState({ show: true }));
  expect(log).toEqual(["mount", "update", "update"]);
  expect(nestedRoot.textContent).toBe("2");
});
