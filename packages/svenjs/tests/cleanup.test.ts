import { afterEach, describe, expect, it, vi } from "vitest";
import { create, createStore, html, render, unmountRoot } from "svenjs";

function host() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("unmount cleanup", () => {
  it("finishes sibling cleanup when onDestroy throws", () => {
    const log: string[] = [];
    const Boom = create({
      onDestroy() {
        log.push("boom");
        throw new Error("destroy-a");
      },
      render() {
        return html`<p class="a">a</p>`;
      },
    });
    const Ok = create({
      onDestroy() {
        log.push("ok");
      },
      render() {
        return html`<p class="b">b</p>`;
      },
    });
    const App = create({
      render() {
        return html`<div><${Boom} /><${Ok} /></div>`;
      },
    });
    const root = host();
    render(App, root);
    expect(() => unmountRoot(root)).toThrow("destroy-a");
    expect(log).toEqual(["boom", "ok"]);
    expect(root.querySelector("p")).toBeNull();
  });

  it("unsubscribes even when onDestroy throws", () => {
    const store = createStore({ state: { n: 0 } });
    let seen = 0;
    const App = create({
      onMount() {
        this.observe(store);
      },
      onDestroy() {
        throw new Error("nope");
      },
      render() {
        seen += 1;
        return html`<span>${store.get().n}</span>`;
      },
    });
    const root = host();
    render(App, root);
    expect(() => unmountRoot(root)).toThrow("nope");
    store.set({ n: 1 });
    expect(seen).toBe(1);
  });

  it("makes unmountRoot idempotent and allows remount after a thrown destroy", () => {
    const App = create({
      onDestroy() {
        throw new Error("once");
      },
      render() {
        return html`<p class="x">x</p>`;
      },
    });
    const root = host();
    render(App, root);
    expect(() => unmountRoot(root)).toThrow("once");
    unmountRoot(root);
    render(App, root);
    expect(root.querySelector(".x")?.textContent).toBe("x");
  });

  it("runs remaining unsubscribe functions when one throws", () => {
    const second = vi.fn();
    const App = create({
      onMount() {
        this.observe({
          subscribe() {
            return () => {
              throw new Error("unsub");
            };
          },
        });
        this.observe({
          subscribe() {
            return second;
          },
        });
      },
      render() {
        return html`<i />`;
      },
    });
    const root = host();
    render(App, root);
    expect(() => unmountRoot(root)).toThrow("unsub");
    expect(second).toHaveBeenCalledTimes(1);
  });
});
