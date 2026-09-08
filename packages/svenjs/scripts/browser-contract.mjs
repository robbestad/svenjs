// Runs against each installed IIFE in a real browser, without source aliases.
export function browserContract(development) {
  const { create, h, html, Fragment, render, renderToString, hydrate, flushSync, unmountRoot } = window.Svenjs;
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

  for (const mode of ["render", "state", "hydrate"]) {
    const failure = Error(`${mode} child render failed`);
    const mounted = [];
    const destroyed = [];
    const unsubscribed = [];
    const cleared = [];
    let owner;
    const Tracked = create({
      onBeforeMount() {
        const id = this.props.id;
        this.observe({ subscribe: () => () => { unsubscribed.push(id); } });
      },
      onMount() { mounted.push(this.props.id); },
      onDestroy() { destroyed.push(this.props.id); },
      render() {
        if (this.props.id === "boom") throw failure;
        return h("span", { ref: el => { if (el === null) cleared.push(this.props.id); } }, this.props.id);
      },
    });
    const tree = ids => h(Fragment, {}, ids.map(id => h(Tracked, { key: id, id })));
    const Stateful = create({
      initialState: { ids: ["a"] },
      onMount() { owner = this; },
      render() { return tree(this.state.ids); },
    });
    if (mode === "state") {
      render(h("section", {}, h("i", {}, "before"), h(Stateful), h("i", {}, "after")), root);
    } else if (mode === "render") {
      render(tree(["a"]), root);
    } else {
      root.innerHTML = "<span>server</span><strong>unclaimed server tail</strong>";
    }

    let caught;
    try {
      if (mode === "state") flushSync(() => owner.setState({ ids: ["b", "boom"] }));
      else if (mode === "render") render(tree(["b", "boom"]), root);
      else hydrate(tree(["b", "boom"]), root);
    } catch (error) { caught = error; }
    check(caught === failure, `${mode} preserves render error`);
    check(root.textContent === (mode === "state" ? "beforeafter" : ""), `${mode} clears failed output`);
    check(!mounted.includes("b") && destroyed.includes("b") && destroyed.includes("boom"), `${mode} partial lifecycle cleanup`);
    check(unsubscribed.includes("b") && unsubscribed.includes("boom") && cleared.filter(id => id === "b").length === 1, `${mode} partial resource cleanup`);
    if (mode === "state") flushSync(() => owner.setState({ ids: ["c"] }));
    else render(tree(["c"]), root);
    check(root.textContent === (mode === "state" ? "beforecafter" : "c"), `${mode} retry without orphan DOM`);
    check(mounted.join() === (mode === "hydrate" ? "c" : "a,c"), `${mode} successful mount hooks`);
    unmountRoot(root);
    check(root.childNodes.length === 0 && destroyed.sort().join() === (mode === "hydrate" ? "b,boom,c" : "a,b,boom,c"), `${mode} final cleanup once`);
    check(unsubscribed.sort().join() === destroyed.join(), `${mode} final unsubscribe once`);
    check(cleared.sort().join() === (mode === "hydrate" ? "b,c" : "a,b,c"), `${mode} final ref cleanup once`);
  }
  root.remove();
  return window.Svenjs.version;
}
