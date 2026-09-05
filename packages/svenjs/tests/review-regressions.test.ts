import { afterEach, expect, it, vi } from "vitest";
import { create, flushSync, h, hydrate, render, renderToString, unmountRoot } from "svenjs";

const roots: Element[] = [];
function host() {
  const root = document.createElement("div");
  document.body.append(root);
  roots.push(root);
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) { unmountRoot(root); root.remove(); }
});

it.each([false, true])("finishes list removal and commits the new tree (state update: %s)", (update) => {
  const off = vi.fn();
  const destroy = vi.fn();
  let instance: any;
  const Item = create({
    onMount() { this.observe({ subscribe: () => off }); },
    onDestroy() { destroy(); if (this.props.id === "a") throw Error("destroy-a"); },
    render() { return h("p", {}, this.props.id); },
  });
  const App = create({
    initialState: { items: ["a", "b"] },
    onMount() { instance = this; },
    render() { return h("div", {}, ...this.state.items.map((id: string) => h(Item, { key: id, id }))); },
  });
  const root = host();
  render(App, root);
  expect(() => update ? flushSync(() => instance.setState({ items: [] })) : render(h("div", {}), root)).toThrow("destroy-a");
  expect(root.querySelectorAll("p")).toHaveLength(0);
  expect(off).toHaveBeenCalledTimes(2);
  expect(destroy).toHaveBeenCalledTimes(2);
  if (update) flushSync(() => instance.setState({ items: ["c"] }));
  else render(h("div", {}, "c"), root);
  expect(root.textContent).toBe("c");
});

it("preserves outer mount hooks and commit depth after a caught nested render failure", () => {
  const root = host();
  const nested = host();
  const log: boolean[] = [];
  const Child = create({
    onMount() { log.push(this.el.isConnected); },
    render() { return h("span", { ref: (el: Element) => { this.el = el; } }); },
  });
  const Boom = create({ render() { throw Error("nested"); } });
  const Catch = create({
    render() {
      expect(() => render(h("div", {}, h(Child, {}), h(Boom, {})), nested)).toThrow("nested");
      return h(Child, {});
    },
  });
  render(h("div", {}, h(Child, {}), h(Catch, {})), root);
  expect(log).toEqual([true, true]);
  render(h("section", {}, h(Child, {})), root);
  expect(log).toEqual([true, true, true]);
});

it("restores controlled input properties during hydration", () => {
  const root = host();
  const tree = h("div", {}, h("input", { value: "saved" }), h("input", { type: "checkbox", checked: true }));
  root.innerHTML = renderToString(tree);
  const [input, checkbox] = root.querySelectorAll("input");
  input.value = "typed";
  checkbox.checked = false;
  hydrate(tree, root);
  expect(root.querySelector("input")).toBe(input);
  expect(input.value).toBe("saved");
  expect(checkbox.checked).toBe(true);
});

it("does not leak SSR select context after errors or into independent SSR calls", () => {
  const Boom = create({ render() { throw Error("ssr"); } });
  expect(() => renderToString(h("select", { value: "x" }, h(Boom, {})))).toThrow("ssr");
  expect(renderToString(h("option", { value: "x" }, "x"))).toBe('<option value="x">x</option>');
  const Nested = create({ render() { return renderToString(h("option", { value: "x" }, "x")); } });
  expect(renderToString(h("select", { value: "x" }, h(Nested, {})))).not.toContain(" selected");
});

it("matches component-generated option text without rendering it twice", () => {
  const renderText = vi.fn(() => " A & B ");
  const Text = create({ render: renderText });
  expect(renderToString(h("select", { value: "A & B" }, h("option", {}, h(Text, {}))))).toBe('<select><option selected> A &amp; B </option></select>');
  expect(renderText).toHaveBeenCalledTimes(1);
});

it("does not clear refs on ignored raw HTML children", () => {
  const ref = vi.fn();
  const root = host();
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  render(h("div", { dangerouslySetInnerHTML: { __html: "raw" } }, h("span", { ref })), root);
  unmountRoot(root);
  expect(ref).not.toHaveBeenCalled();
  warn.mockRestore();
});
