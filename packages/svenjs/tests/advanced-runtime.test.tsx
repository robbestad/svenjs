import { afterEach, describe, expect, it, vi } from "vitest";
import { create, flushSync, hydrate, render, renderToString, unmountRoot } from "svenjs";

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

describe("hydration", () => {
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
    expect(() => renderToString(node)).toThrow("SvenJS: invalid tag name");
    expect(() => render(node, root())).toThrow("SvenJS: invalid tag name");
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
