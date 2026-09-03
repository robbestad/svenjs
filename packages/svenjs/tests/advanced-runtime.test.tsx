import { afterEach, describe, expect, it, vi } from "vitest";
import { create, createStore, flushSync, hydrate, render, renderToString, unmountRoot } from "svenjs";

function root() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("component boundaries", () => {
  it("keeps JSX children on component props", () => {
    const Frame = create<{ children?: unknown }>({
      render() {
        return <section>{this.props.children}</section>;
      },
    });
    const App = create({
      render() {
        return (
          <Frame>
            <b>one</b>
            <i>two</i>
          </Frame>
        );
      },
    });

    const host = root();
    render(App, host);
    expect(host.querySelector("section")?.innerHTML).toBe("<b>one</b><i>two</i>");
  });

  it("preserves the position of a component that changes from empty to DOM", () => {
    const Maybe = create<{ show: boolean }>({
      render() {
        return this.props.show ? <b>middle</b> : null;
      },
    });
    const App = create({
      initialState: { show: false },
      render() {
        return (
          <div>
            <span>before</span>
            <Maybe show={this.state.show} />
            <span>after</span>
            <button onClick={() => this.setState({ show: true })}>show</button>
          </div>
        );
      },
    });

    const host = root();
    render(App, host);
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect([...host.querySelector("div")!.children].map((el) => el.textContent)).toEqual([
      "before",
      "middle",
      "after",
      "show",
    ]);
  });

  it("keeps an independently updated Fragment root inside its boundary", () => {
    const Child = create({
      initialState: { count: 0 },
      render() {
        return (
          <>
            <button onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>
            <i>inside</i>
          </>
        );
      },
    });
    const App = create({
      render() {
        return (
          <div>
            <Child />
            <b>after</b>
          </div>
        );
      },
    });

    const host = root();
    render(App, host);
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect([...host.querySelector("div")!.children].map((el) => `${el.tagName}:${el.textContent}`)).toEqual([
      "BUTTON:1",
      "I:inside",
      "B:after",
    ]);
  });
});

describe("DOM patch details", () => {
  it("applies a controlled select value after mounting its options", () => {
    const host = root();
    render(
      <select value="second">
        <option value="first">First</option>
        <option value="second">Second</option>
      </select>,
      host,
    );
    expect((host.querySelector("select") as HTMLSelectElement).value).toBe("second");
  });

  it("detaches an old ref and attaches its replacement", () => {
    const first = vi.fn();
    const second = vi.fn();
    const App = create({
      initialState: { swapped: false },
      render() {
        return (
          <button
            ref={this.state.swapped ? second : first}
            onClick={() => this.setState({ swapped: true })}
          >
            swap
          </button>
        );
      },
    });

    const host = root();
    render(App, host);
    const button = host.querySelector("button")!;
    button.click();
    flushSync();
    expect(first.mock.calls).toEqual([[button], [null]]);
    expect(second).toHaveBeenCalledWith(button);
  });

  it("leaves a shared ref attached when the element type changes", () => {
    const ref = vi.fn();
    const App = create({
      initialState: { swapped: false },
      render() {
        return this.state.swapped ? (
          <span ref={ref}>new</span>
        ) : (
          <button ref={ref} onClick={() => this.setState({ swapped: true })}>
            swap
          </button>
        );
      },
    });

    const host = root();
    render(App, host);
    const button = host.querySelector("button")!;
    button.click();
    flushSync();
    const span = host.querySelector("span")!;
    expect(ref.mock.calls).toEqual([[button], [null], [span]]);
  });

  it("removes stale camelCase styles and serializes object styles", () => {
    const App = create({
      initialState: { compact: false },
      render() {
        const style = this.state.compact
          ? { color: "blue", "--accent": "teal" }
          : { backgroundColor: "red", color: "white", "--accent": "orange" };
        return <div style={style} onClick={() => this.setState({ compact: true })} />;
      },
    });

    expect(renderToString(App)).toContain('style="background-color:red;color:white;--accent:orange"');
    const mounted = root();
    render(App, mounted);
    expect((mounted.querySelector("div") as HTMLElement).style.getPropertyValue("--accent")).toBe("orange");

    const host = root();
    host.innerHTML = renderToString(App);
    hydrate(App, host);
    const div = host.querySelector("div") as HTMLElement;
    expect(div.style.getPropertyValue("--accent")).toBe("orange");
    div.click();
    flushSync();
    expect(div.style.backgroundColor).toBe("");
    expect(div.style.color).toBe("blue");
    expect(div.style.getPropertyValue("--accent")).toBe("teal");
  });
});

describe("svg attributes", () => {
  it("patches polyline points through the attribute, not the SVGPointList", () => {
    const App = create({
      initialState: { points: "0,0 10,10" },
      render() {
        return (
          <div>
            <svg>
              <polyline className="line" points={this.state.points} />
            </svg>
            <button onClick={() => this.setState({ points: "0,0 20,5" })}>go</button>
          </div>
        );
      },
    });
    const host = root();
    render(App, host);
    const line = host.querySelector(".line")!;
    expect(line.getAttribute("points")).toBe("0,0 10,10");
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(line.getAttribute("points")).toBe("0,0 20,5");
  });
});

describe("hydration", () => {
  it("restores a controlled select value after adopting its options", () => {
    const node = (
      <select value="second">
        <option value="first">First</option>
        <option value="second">Second</option>
      </select>
    );
    const host = root();
    host.innerHTML = renderToString(node);
    (host.querySelector("select") as HTMLSelectElement).selectedIndex = 0;

    hydrate(node, host);
    expect((host.querySelector("select") as HTMLSelectElement).value).toBe("second");
  });

  it("reuses prerendered DOM and makes it interactive", () => {
    const mounted = vi.fn();
    const App = create({
      initialState: { clicks: 0 },
      onMount: mounted,
      render() {
        return (
          <>
            <button onClick={() => this.setState({ clicks: this.state.clicks + 1 })}>{this.state.clicks}</button>
            <span>ready</span>
          </>
        );
      },
    });
    const host = root();
    host.innerHTML = renderToString(App);
    const button = host.querySelector("button")!;

    hydrate(App, host);
    expect(host.querySelector("button")).toBe(button);
    expect(mounted).toHaveBeenCalledTimes(1);
    button.click();
    flushSync();
    expect(button.textContent).toBe("1");

    unmountRoot(host);
    expect(host.childNodes).toHaveLength(0);
  });

  it("supports state factories based on props", () => {
    const Counter = create<{ start: number }, { count: number }>({
      initialState: (props) => ({ count: props.start }),
      render() {
        return <strong>{this.state.count}</strong>;
      },
    });
    expect(renderToString(<Counter start={4} />)).toBe("<strong>4</strong>");
  });

  it("removes stale server attributes while adopting an element", () => {
    const App = create({
      render() {
        return <button className="current">ready</button>;
      },
    });
    const host = root();
    host.innerHTML = '<button class="stale" aria-current="page" data-old="yes">ready</button>';

    hydrate(App, host);
    const button = host.querySelector("button")!;
    expect(button.className).toBe("current");
    expect(button.hasAttribute("aria-current")).toBe(false);
    expect(button.hasAttribute("data-old")).toBe(false);
  });

  it("replaces matching tag names from the wrong namespace", () => {
    const node = <svg aria-label="shape" />;
    const host = root();
    host.appendChild(document.createElement("svg"));
    expect(host.firstElementChild?.namespaceURI).toBe("http://www.w3.org/1999/xhtml");

    hydrate(node, host);
    expect(host.firstElementChild?.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("mounts HTML descendants inside SVG foreignObject", () => {
    const host = root();
    render(
      <svg>
        <foreignObject>
          <div>html</div>
          <path data-test="html-path" />
          <svg><path data-test="svg-path" /></svg>
        </foreignObject>
      </svg>,
      host,
    );
    expect(host.querySelector("foreignObject")?.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(host.querySelector("div")?.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(host.querySelector('[data-test="html-path"]')?.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(host.querySelector('[data-test="svg-path"]')?.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("removes stale inline handlers during hydration", () => {
    const legacy = vi.fn();
    const modern = vi.fn();
    const App = create({
      render() {
        return <button onClick={modern}>ready</button>;
      },
    });
    const host = root();
    host.innerHTML = '<button onclick="legacy()">ready</button>';
    (host.ownerDocument.defaultView as any).legacy = legacy;

    hydrate(App, host);
    const button = host.querySelector("button")!;
    expect(button.hasAttribute("onclick")).toBe(false);
    button.click();
    expect(legacy).not.toHaveBeenCalled();
    expect(modern).toHaveBeenCalledTimes(1);
  });

  it("does not confuse empty attributes with boolean props", () => {
    const host = root();
    host.innerHTML = '<div class=""></div>';
    hydrate(<div className={true as any} />, host);
    expect(host.firstElementChild?.getAttribute("class")).toBe("true");
  });
});

describe("server rendering safety", () => {
  it("ignores invalid attribute names", () => {
    const node = <div {...{ 'data-safe': 'yes', 'x" onmouseover="alert(1)': 'bad' }} />;
    expect(renderToString(node)).toBe('<div data-safe="yes"></div>');
  });

  it("rejects invalid tag names", () => {
    const node = <div />;
    node.type = 'div><script>alert(1)</script><div';
    expect(() => renderToString(node)).toThrow("SvenJS: bad tag");
    expect(() => render(node, root())).toThrow("SvenJS: bad tag");
  });
});

describe("scheduler recovery", () => {
  it("finishes the batch and continues after a render throws", () => {
    const Broken = create({
      initialState: { fail: false },
      render() {
        if (this.state.fail) throw new Error("broken render");
        return <button onClick={() => this.setState({ fail: true })}>break</button>;
      },
    });
    const Healthy = create({
      initialState: { count: 0 },
      render() {
        return <button onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>;
      },
    });
    const badRoot = root();
    const goodRoot = root();
    render(Broken, badRoot);
    render(Healthy, goodRoot);

    (badRoot.querySelector("button") as HTMLButtonElement).click();
    (goodRoot.querySelector("button") as HTMLButtonElement).click();
    expect(() => flushSync()).toThrow("broken render");
    expect(goodRoot.textContent).toBe("1");
    (goodRoot.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(goodRoot.textContent).toBe("2");
  });

  it("flushes queued state even when the flushSync callback throws", () => {
    const App = create({
      initialState: { count: 0 },
      render() {
        return <button onClick={() => this.setState({ count: 1 })}>{this.state.count}</button>;
      },
    });
    const host = root();
    render(App, host);

    expect(() =>
      flushSync(() => {
        (host.querySelector("button") as HTMLButtonElement).click();
        throw new Error("callback failed");
      }),
    ).toThrow("callback failed");
    expect(host.textContent).toBe("1");
  });
});

describe("observe", () => {
  it("re-renders from a store without setState", () => {
    const store = createStore({ state: { n: 0 } });
    const App = create({
      onMount() {
        this.observe(store);
      },
      render() {
        return <span>{store.get().n}</span>;
      },
    });
    const host = root();
    render(App, host);
    expect(host.textContent).toBe("0");
    store.set({ n: 1 });
    flushSync();
    expect(host.textContent).toBe("1");
  });

  it("stops after unmount", () => {
    const store = createStore({ state: { n: 0 } });
    const App = create({
      onMount() {
        this.observe(store);
      },
      render() {
        return <span>{store.get().n}</span>;
      },
    });
    const host = root();
    render(App, host);
    unmountRoot(host);
    store.set({ n: 2 });
    flushSync();
    expect(host.textContent).toBe("");
  });

  it("does not re-render when setState receives the current state", () => {
    const renders: number[] = [];
    const App = create({
      initialState: { n: 1 },
      onMount() {
        this.setState(this.state);
      },
      render() {
        renders.push(this.state.n);
        return <span>{this.state.n}</span>;
      },
    });
    const host = root();
    render(App, host);
    flushSync();
    expect(renders).toEqual([1]);
    expect(host.textContent).toBe("1");
  });
});

describe("keyed patch throughput", () => {
  it("does not move keyed children that kept their order", () => {
    const App = create({
      initialState: { ids: ["a", "b", "c"], n: 0 },
      render() {
        return (
          <div>
            <ul>
              {this.state.ids.map((id: string) => (
                <li key={id}>
                  {id}:{this.state.n}
                </li>
              ))}
            </ul>
            <button onClick={() => this.setState({ ...this.state, n: 1 })}>go</button>
          </div>
        );
      },
    });
    const host = root();
    render(App, host);
    const ul = host.querySelector("ul")!;
    const spy = vi.spyOn(ul, "insertBefore");
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(spy).not.toHaveBeenCalled();
    expect([...ul.querySelectorAll("li")].map((n) => n.textContent)).toEqual(["a:1", "b:1", "c:1"]);
  });

  it("moves a fragment component as a contiguous range", () => {
    const Pair = create<{ id: string }>({
      render() {
        return (
          <>
            <i data-pair={this.props.id}>{this.props.id}</i>
            <b data-pair={this.props.id}>{this.props.id}</b>
          </>
        );
      },
    });
    const App = create({
      initialState: { ids: ["a", "b"] },
      render() {
        return (
          <div>
            <span>
              {this.state.ids.map((id: string) => (
                <Pair key={id} id={id} />
              ))}
            </span>
            <button onClick={() => this.setState({ ids: ["b", "a"] })}>go</button>
          </div>
        );
      },
    });
    const host = root();
    render(App, host);
    const aI = host.querySelector('i[data-pair="a"]')!;
    const aB = host.querySelector('b[data-pair="a"]')!;
    const bI = host.querySelector('i[data-pair="b"]')!;
    const bB = host.querySelector('b[data-pair="b"]')!;
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    const nodes = [...host.querySelector("span")!.childNodes].filter((n) => n.nodeType === 1);
    expect(nodes.map((n) => `${(n as Element).tagName}:${(n as Element).textContent}`)).toEqual([
      "I:b",
      "B:b",
      "I:a",
      "B:a",
    ]);
    expect(host.querySelector('i[data-pair="a"]')).toBe(aI);
    expect(host.querySelector('b[data-pair="a"]')).toBe(aB);
    expect(host.querySelector('i[data-pair="b"]')).toBe(bI);
    expect(host.querySelector('b[data-pair="b"]')).toBe(bB);
    expect(bI.nextSibling).toBe(bB);
    expect(aI.nextSibling).toBe(aB);
  });

  it("mounts a keyed node instead of stealing an unkeyed node of the same type", () => {
    const mounts: string[] = [];
    const Item = create<{ id: string }>({
      onMount() {
        mounts.push(this.props.id);
      },
      render() {
        return <span data-id={this.props.id}>{this.props.id}</span>;
      },
    });
    const App = create({
      initialState: { keyed: false },
      render() {
        return (
          <div>
            <p>{this.state.keyed ? <Item key="x" id="x" /> : <Item id="old" />}</p>
            <button onClick={() => this.setState({ keyed: true })}>go</button>
          </div>
        );
      },
    });
    const host = root();
    render(App, host);
    expect(mounts).toEqual(["old"]);
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(mounts).toEqual(["old", "x"]);
    expect(host.querySelector("span")?.textContent).toBe("x");
  });
});

describe("unchanged child bailout", () => {
  it("skips render when props are shallow-equal and the child is not dirty", () => {
    const renders: string[] = [];
    const Child = create<{ n: number }>({
      render() {
        renders.push(`child:${this.props.n}`);
        return <span>{this.props.n}</span>;
      },
    });
    const Parent = create({
      initialState: { n: 1, extra: 0 },
      render() {
        renders.push(`parent:${this.state.extra}`);
        return (
          <div>
            <Child n={this.state.n} />
            <button onClick={() => this.setState({ ...this.state, extra: this.state.extra + 1 })}>x</button>
          </div>
        );
      },
    });
    const host = root();
    render(Parent, host);
    expect(renders).toEqual(["parent:0", "child:1"]);
    (host.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(renders).toEqual(["parent:0", "child:1", "parent:1"]);
    expect(host.querySelector("span")?.textContent).toBe("1");
  });
});

describe("aria and data booleans", () => {
  it("serializes true and false as strings", () => {
    expect(renderToString(<div aria-expanded={false} data-on={true} />)).toBe(
      '<div aria-expanded="false" data-on="true"></div>',
    );
    const host = root();
    render(<button aria-pressed={true} aria-expanded={false} />, host);
    const button = host.querySelector("button")!;
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});
