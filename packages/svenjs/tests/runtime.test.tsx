import { afterEach, describe, expect, it, vi } from "vitest";
import { create, createStore, flushSync, h, render, renderToString, unmountRoot } from "svenjs";

function mount(spec: Parameters<typeof render>[0]) {
  const root = document.createElement("div");
  document.body.appendChild(root);
  render(spec, root);
  return root;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("create + render", () => {
  it("mounts a component", () => {
    const App = create({
      render() {
        return <div id="hello">world</div>;
      },
    });
    const root = mount(App);
    expect(root.querySelector("#hello")?.textContent).toBe("world");
  });

  it("throws without render", () => {
    expect(() => create({} as any)).toThrow(/render/);
  });
});

describe("setState", () => {
  it("replaces state and patches text without remounting", () => {
    let host: HTMLElement | null = null;
    const App = create<{ clicks?: number }, { clicks: number }>({
      initialState: { clicks: 0 },
      render() {
        return (
          <button
            ref={(el: HTMLElement | null) => {
              if (el) host = el;
            }}
            onClick={() => this.setState({ clicks: this.state.clicks + 1 })}
          >
            {this.state.clicks}
          </button>
        );
      },
    });
    const root = mount(App);
    const btn = root.querySelector("button")!;
    expect(btn.textContent).toBe("0");
    btn.click();
    flushSync();
    expect(btn.textContent).toBe("1");
    expect(root.querySelector("button")).toBe(btn);
    expect(host).toBe(btn);
  });

  it("supports updater functions", () => {
    const App = create({
      initialState: { n: 1 },
      onMount() {
        this.setState((s: { n: number }) => ({ n: s.n + 1 }));
      },
      render() {
        return <span>{this.state.n}</span>;
      },
    });
    const root = mount(App);
    flushSync();
    expect(root.textContent).toBe("2");
  });

  it("batches multiple setState calls", () => {
    const renders: number[] = [];
    const App = create({
      initialState: { n: 0 },
      onMount() {
        this.setState({ n: 1 });
        this.setState({ n: 2 });
        this.setState({ n: 3 });
      },
      render() {
        renders.push(this.state.n);
        return <span>{this.state.n}</span>;
      },
    });
    const root = mount(App);
    expect(renders[0]).toBe(0);
    flushSync();
    expect(root.textContent).toBe("3");
    expect(renders.filter((n) => n === 3).length).toBeGreaterThanOrEqual(1);
    expect(renders.length).toBeLessThanOrEqual(3);
  });
});

describe("keyed lists", () => {
  it("reorders keyed children without remounting", () => {
    const mounts: string[] = [];
    const Item = create<{ id: string }, Record<string, never>>({
      onMount() {
        mounts.push(this.props.id);
      },
      render() {
        return <li data-id={this.props.id}>{this.props.id}</li>;
      },
    });
    const List = create({
      initialState: { ids: ["a", "b", "c"] },
      render() {
        return (
          <ul>
            {this.state.ids.map((id: string) => (
              <Item key={id} id={id} />
            ))}
          </ul>
        );
      },
    });
    const root = mount(List);
    const nodeA = root.querySelector('[data-id="a"]');
    const nodeB = root.querySelector('[data-id="b"]');
    const nodeC = root.querySelector('[data-id="c"]');
    expect([...root.querySelectorAll("li")].map((n) => n.getAttribute("data-id"))).toEqual(["a", "b", "c"]);
    expect(mounts).toEqual(["a", "b", "c"]);

    const btn = document.createElement("button");
    root.appendChild(btn);
    // Drive reorder through the same instance by clicking a sibling control.
    const driver = create({
      initialState: { ids: ["a", "b", "c"] },
      render() {
        return (
          <div>
            <ul>
              {this.state.ids.map((id: string) => (
                <Item key={id} id={id} />
              ))}
            </ul>
            <button className="go" onClick={() => this.setState({ ids: ["c", "a", "b"] })}>
              go
            </button>
          </div>
        );
      },
    });
    unmountRoot(root);
    const root2 = mount(driver);
    const a = root2.querySelector('[data-id="a"]');
    const b = root2.querySelector('[data-id="b"]');
    const c = root2.querySelector('[data-id="c"]');
    (root2.querySelector(".go") as HTMLButtonElement).click();
    flushSync();
    expect([...root2.querySelectorAll("li")].map((n) => n.getAttribute("data-id"))).toEqual(["c", "a", "b"]);
    expect(root2.querySelector('[data-id="a"]')).toBe(a);
    expect(root2.querySelector('[data-id="b"]')).toBe(b);
    expect(root2.querySelector('[data-id="c"]')).toBe(c);
    expect(mounts.filter((id) => id === "a").length).toBe(2);
    void nodeA;
    void nodeB;
    void nodeC;
  });

  it("adds and removes keyed items", () => {
    const App = create({
      initialState: { ids: ["a", "b"] },
      onMount() {
        this.setState({ ids: ["b", "c"] });
      },
      render() {
        return (
          <ul>
            {this.state.ids.map((id: string) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        );
      },
    });
    const root = mount(App);
    flushSync();
    expect([...root.querySelectorAll("li")].map((n) => n.textContent)).toEqual(["b", "c"]);
  });
});

describe("nested components", () => {
  it("passes props and keeps child state across parent render", () => {
    const Child = create<{ label: string }, { n: number }>({
      initialState: { n: 0 },
      render() {
        return (
          <button className="child" onClick={() => this.setState({ n: this.state.n + 1 })}>
            {this.props.label}:{this.state.n}
          </button>
        );
      },
    });
    const Parent = create({
      initialState: { label: "x" },
      render() {
        return (
          <div>
            <Child label={this.state.label} />
            <button className="relabel" onClick={() => this.setState({ label: "y" })}>
              relabel
            </button>
          </div>
        );
      },
    });
    const root = mount(Parent);
    const child = root.querySelector(".child") as HTMLButtonElement;
    child.click();
    flushSync();
    expect(child.textContent).toBe("x:1");
    (root.querySelector(".relabel") as HTMLButtonElement).click();
    flushSync();
    expect(root.querySelector(".child")?.textContent).toBe("y:1");
    expect(root.querySelector(".child")).toBe(child);
  });
});

describe("lifecycle", () => {
  it("runs onMount once, onUpdate after patches, onDestroy on unmount", () => {
    const log: string[] = [];
    const App = create({
      initialState: { n: 0 },
      onMount() {
        log.push("mount");
        this.setState({ n: 1 });
      },
      onUpdate() {
        log.push("update");
      },
      onDestroy() {
        log.push("destroy");
      },
      render() {
        return <span>{this.state.n}</span>;
      },
    });
    const root = mount(App);
    expect(log).toEqual(["mount"]);
    flushSync();
    expect(log).toEqual(["mount", "update"]);
    unmountRoot(root);
    expect(log).toEqual(["mount", "update", "destroy"]);
  });

  it("supports 2.x lifecycle aliases", () => {
    const log: string[] = [];
    const App = create({
      _beforeMount() {
        log.push("before");
      },
      _didMount() {
        log.push("did");
      },
      render() {
        return <i />;
      },
    });
    mount(App);
    expect(log).toEqual(["before", "did"]);
  });
});

describe("events + attrs", () => {
  it("binds onClick and className", () => {
    const spy = vi.fn();
    const App = create({
      render() {
        return (
          <button className="go" onClick={spy}>
            go
          </button>
        );
      },
    });
    const root = mount(App);
    expect(root.querySelector(".go")).toBeTruthy();
    (root.querySelector("button") as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("updates checked and value", () => {
    const App = create({
      initialState: { on: false, text: "a" },
      render() {
        return (
          <div>
            <input className="box" type="checkbox" checked={this.state.on} />
            <input className="txt" value={this.state.text} />
            <button onClick={() => this.setState({ on: true, text: "b" })}>x</button>
          </div>
        );
      },
    });
    const root = mount(App);
    const box = root.querySelector(".box") as HTMLInputElement;
    const txt = root.querySelector(".txt") as HTMLInputElement;
    expect(box.checked).toBe(false);
    expect(txt.value).toBe("a");
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(box.checked).toBe(true);
    expect(txt.value).toBe("b");
  });
});

describe("freeze", () => {
  it("freezes state in DEV", () => {
    let leaked: { n: number } | null = null;
    const App = create({
      initialState: { n: 1 },
      onMount() {
        leaked = this.state;
      },
      render() {
        return <span>{this.state.n}</span>;
      },
    });
    mount(App);
    expect(leaked).toBeTruthy();
    expect(() => {
      leaked!.n = 2;
    }).toThrow();
  });
});

describe("store", () => {
  it("notifies subscribers and unsubscribes", () => {
    const store = createStore({ state: { n: 0 } });
    const seen: number[] = [];
    const off = store.subscribe((s) => seen.push(s.n));
    store.set({ n: 1 });
    store.set((s) => ({ n: s.n + 1 }));
    off();
    store.set({ n: 99 });
    expect(seen).toEqual([1, 2]);
    expect(store.get().n).toBe(99);
  });

  it("keeps listenTo / emit aliases", () => {
    const store = createStore({ state: { v: 0 } });
    let v = 0;
    store.listenTo((s) => {
      v = s.v;
    });
    store.emit({ v: 7 });
    expect(v).toBe(7);
  });
});

describe("renderToString", () => {
  it("serializes a small tree", () => {
    const App = create({
      render() {
        return (
          <div className="box" data-x="1">
            <p>hi</p>
            <input disabled />
          </div>
        );
      },
    });
    const html = renderToString(App);
    expect(html).toContain('<div class="box" data-x="1">');
    expect(html).toContain("<p>hi</p>");
    expect(html).toContain("<input disabled>");
    expect(html).not.toContain("onClick");
  });
});

describe("h hyperscript", () => {
  it("flattens children", () => {
    const node = h("div", { id: "x" }, "a", ["b", null, h("span", null, "c")]);
    const App = create({
      render() {
        return node;
      },
    });
    const root = mount(App);
    expect(root.querySelector("#x")?.textContent).toBe("abc");
  });
});
