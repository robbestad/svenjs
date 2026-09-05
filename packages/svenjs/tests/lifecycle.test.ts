import { afterEach, describe, expect, it } from "vitest";
import { create, flushSync, html, render, renderToString, unmountRoot } from "svenjs";

function host() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("lifecycle commit", () => {
  it("runs nested onMount after the tree is inserted", () => {
    const log: Array<{ name: string; connected: boolean }> = [];
    const Field = create({
      onMount() {
        log.push({ name: "field", connected: this._input?.isConnected === true });
      },
      render() {
        return html`<input ref=${(el: HTMLInputElement | null) => {
          this._input = el;
        }} />`;
      },
    });
    const App = create({
      onMount() {
        log.push({ name: "app", connected: this._input?.isConnected === true });
      },
      render() {
        return html`<div><${Field} /><span ref=${(el: HTMLElement | null) => {
          this._input = el;
        }}></span></div>`;
      },
    });
    render(App, host());
    expect(log[0]?.name).toBe("field");
    expect(log[0]?.connected).toBe(true);
    expect(log[1]?.name).toBe("app");
    expect(log[1]?.connected).toBe(true);
  });

  it("runs onMount once per mount and setState from onMount does not re-run it", () => {
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
      render() {
        return html`<span>${this.state.n}</span>`;
      },
    });
    const root = host();
    render(App, root);
    expect(log).toEqual(["mount"]);
    flushSync();
    expect(log).toEqual(["mount", "update"]);
    expect(root.textContent).toBe("1");
  });

  it("still runs onMount on a detached root", () => {
    let connected = true;
    const App = create({
      onMount() {
        connected = this._el?.isConnected === true;
      },
      render() {
        return html`<p ref=${(el: HTMLElement | null) => {
          this._el = el;
        }}>x</p>`;
      },
    });
    const root = document.createElement("div");
    render(App, root);
    expect(connected).toBe(false);
    expect(root.textContent).toBe("x");
  });

  it("does not run onMount during SSR", () => {
    let mounted = false;
    const App = create({
      onBeforeMount() {
        this.server = true;
      },
      onMount() {
        mounted = true;
      },
      render() {
        return html`<b>${this.server ? "ssr" : "client"}</b>`;
      },
    });
    expect(renderToString(App)).toBe("<b>ssr</b>");
    expect(mounted).toBe(false);
  });

  it("applies refs before onMount", () => {
    const order: string[] = [];
    const App = create({
      onMount() {
        order.push(this._el ? "mount-with-ref" : "mount-without-ref");
      },
      render() {
        return html`<i
          ref=${(el: HTMLElement | null) => {
            this._el = el;
            if (el) order.push("ref");
          }}
        ></i>`;
      },
    });
    render(App, host());
    expect(order).toEqual(["ref", "mount-with-ref"]);
  });
});
