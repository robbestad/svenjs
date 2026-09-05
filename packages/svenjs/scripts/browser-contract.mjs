// Runs against each installed IIFE in a real browser, without source aliases.
export function browserContract(development) {
  const { create, h, html, render, renderToString, hydrate, flushSync, unmountRoot } = window.Svenjs;
  const check = (ok, message) => { if (!ok) throw Error(message); };
  const root = document.createElement("main");
  document.body.append(root);
  const mounts = [];
  const refs = [];
  let instance;
  const Child = create({
    onMount() { mounts.push(this.el.isConnected); this.el.focus(); },
    render() { return h("input", { value: "saved", ref: el => { this.el = el; } }); },
  });
  const App = create({
    initialState: { n: 0 },
    onMount() { instance = this; },
    render() { return h("div", {}, h(Child), h("button", { onDoubleClick: () => this.setState({ n: this.state.n + 1 }) }, this.state.n)); },
  });
  root.innerHTML = renderToString(App);
  const input = root.querySelector("input");
  input.value = "typed";
  hydrate(App, root);
  check(root.querySelector("input") === input && input.value === "saved", "hydration value / identity");
  check(mounts.length === 1 && mounts[0] && document.activeElement === input, "connected lifecycle / focus");
  check(Object.isFrozen(instance.state) === development, "dev/prod state contract");
  input.setSelectionRange(2, 2);
  root.querySelector("button").dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
  flushSync();
  check(root.querySelector("button").textContent === "1" && input.selectionStart === 2, "event / caret");
  unmountRoot(root);
  const Item = create({ render() { return html`<span>same</span>`; }, onDestroy() { refs.push(this.props.id); if (this.props.id === 1) throw Error("destroy"); } });
  render(h("div", {}, h(Item, { key: 1, id: 1 }), h(Item, { key: 2, id: 2 })), root);
  try { render(h("div", {}), root); } catch (error) { check(error.message === "destroy", "cleanup error"); }
  check(refs.join() === "1,2" && !root.querySelector("span"), "list cleanup");
  unmountRoot(root);
  root.remove();
  return window.Svenjs.version;
}
