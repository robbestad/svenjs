import { afterEach, describe, expect, it } from "vitest";
import { create, flushSync, h, html, hydrate, render, renderToString, unmountRoot } from "svenjs";

function host() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

const Box = create({
  render() {
    return html`<p class="box">static</p>`;
  },
});

describe("vnode ownership", () => {
  it("keeps two sibling static html templates independent", () => {
    const App = create({
      initialState: { showFirst: true },
      render() {
        return html`
          <div>
            ${this.state.showFirst ? html`<${Box} key="first" />` : null}
            <${Box} key="second" />
            <button key="hide" onClick=${() => this.setState({ showFirst: false })}>hide</button>
          </div>
        `;
      },
    });

    const root = host();
    render(App, root);
    const boxes = [...root.querySelectorAll(".box")];
    expect(boxes).toHaveLength(2);
    const second = boxes[1];
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(root.querySelectorAll(".box")).toHaveLength(1);
    expect(root.querySelector(".box")).toBe(second);
    expect(second.textContent).toBe("static");
    expect(second.isConnected).toBe(true);
  });

  it("keeps two roots that share a static template independent", () => {
    const a = host();
    const b = host();
    render(Box, a);
    render(Box, b);
    const nodeA = a.querySelector(".box");
    const nodeB = b.querySelector(".box");
    expect(nodeA).not.toBe(nodeB);
    unmountRoot(a);
    expect(a.querySelector(".box")).toBeNull();
    expect(b.querySelector(".box")).toBe(nodeB);
    expect(nodeB?.textContent).toBe("static");
  });

  it("does not share mount data when the same h() tree is rendered twice", () => {
    const tree = h("p", { class: "once" }, "hi");
    const a = host();
    const b = host();
    render(tree, a);
    render(tree, b);
    expect(a.querySelector(".once")).not.toBe(b.querySelector(".once"));
    unmountRoot(a);
    expect(b.querySelector(".once")?.textContent).toBe("hi");
  });

  it("hydrates and unmounts independent copies of a static template", () => {
    const App = create({
      render() {
        return html`
          <section>
            <${Box} />
            <${Box} />
          </section>
        `;
      },
    });
    const markup = renderToString(App);
    const root = host();
    root.innerHTML = markup;
    expect(root.querySelectorAll(".box")).toHaveLength(2);
    hydrate(App, root);
    const [first, second] = [...root.querySelectorAll(".box")];
    expect(first).not.toBe(second);
    unmountRoot(root);
    expect(root.querySelector(".box")).toBeNull();
  });

  it("isolates a static subtree inside a dynamic parent", () => {
    const App = create({
      initialState: { n: 0 },
      render() {
        return html`
          <div>
            <span class="count">${this.state.n}</span>
            ${html`<p class="static">keep</p>`}
            <button onClick=${() => this.setState({ n: this.state.n + 1 })}>+</button>
          </div>
        `;
      },
    });
    const root = host();
    render(App, root);
    const staticNode = root.querySelector(".static");
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(root.querySelector(".count")?.textContent).toBe("1");
    expect(root.querySelector(".static")).toBe(staticNode);
  });

  it("remounts when a component root key changes", () => {
    const Cell = create<{ id: string }>({
      render() {
        return html`<span key=${this.props.id} class="cell">${this.props.id}</span>`;
      },
    });
    const App = create({
      initialState: { id: "a" },
      render() {
        return html`
          <div>
            <${Cell} id=${this.state.id} />
            <button onClick=${() => this.setState({ id: "b" })}>swap</button>
          </div>
        `;
      },
    });
    const root = host();
    render(App, root);
    const first = root.querySelector(".cell");
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    const second = root.querySelector(".cell");
    expect(second).not.toBe(first);
    expect(second?.textContent).toBe("b");
  });

  it("moves keyed list siblings without remounting", () => {
    const App = create({
      initialState: { items: ["a", "b"] },
      render() {
        return html`
          <div>
            <ul>
              ${this.state.items.map((id) => html`<li key=${id} class=${id}>${id}</li>`)}
            </ul>
            <button onClick=${() => this.setState({ items: ["b", "a"] })}>reorder</button>
          </div>
        `;
      },
    });
    const root = host();
    render(App, root);
    const a = root.querySelector(".a");
    const b = root.querySelector(".b");
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(root.querySelector(".a")).toBe(a);
    expect(root.querySelector(".b")).toBe(b);
    expect([...root.querySelectorAll("li")].map((n) => n.textContent)).toEqual(["b", "a"]);
  });

  it("isolates fragment templates used twice", () => {
    const Pair = create({
      render() {
        return [html`<i class="dot">x</i>`, html`<i class="dot">y</i>`];
      },
    });
    const App = create({
      initialState: { show: true },
      render() {
        return html`
          <div>
            ${this.state.show ? html`<${Pair} />` : null}
            <${Pair} />
            <button onClick=${() => this.setState({ show: false })}>hide</button>
          </div>
        `;
      },
    });
    const root = host();
    render(App, root);
    expect(root.querySelectorAll(".dot")).toHaveLength(4);
    const kept = [...root.querySelectorAll(".dot")].slice(2);
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect([...root.querySelectorAll(".dot")]).toEqual(kept);
  });
});
