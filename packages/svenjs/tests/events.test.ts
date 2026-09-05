import { afterEach, describe, expect, it, vi } from "vitest";
import { create, flushSync, html, hydrate, render, renderToString, type VNode } from "svenjs";

function host() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("events", () => {
  it("maps onDoubleClick to native dblclick", () => {
    const spy = vi.fn();
    const App = create({
      render() {
        return html`<button onDoubleClick=${spy}>x</button>`;
      },
    });
    const root = host();
    render(App, root);
    root.querySelector("button")!.dispatchEvent(new Event("dblclick"));
    expect(spy).toHaveBeenCalledTimes(1);
    root.querySelector("button")!.dispatchEvent(new Event("doubleclick"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not serialize string event props as HTML attributes", () => {
    const node = html`<button ONCLICK=${"alert(1)"} onClick=${"alert(2)"}>x</button>` as VNode;
    expect(renderToString(node)).toBe("<button>x</button>");
    const root = host();
    render(node, root);
    const btn = root.querySelector("button")!;
    expect(btn.getAttribute("ONCLICK")).toBeNull();
    expect(btn.getAttribute("onclick")).toBeNull();
    expect(btn.getAttribute("onClick")).toBeNull();
  });

  it("replaces and removes listeners", () => {
    const first = vi.fn();
    const second = vi.fn();
    const App = create({
      initialState: { which: "first" as "first" | "second" | "none" },
      render() {
        const handler = this.state.which === "first" ? first : this.state.which === "second" ? second : null;
        return html`
          <div>
            <button class="target" onClick=${handler}>x</button>
            <button class="next" onClick=${() =>
              this.setState({
                which: this.state.which === "first" ? "second" : "none",
              })}
            >
              next
            </button>
          </div>
        `;
      },
    });
    const root = host();
    render(App, root);
    const target = root.querySelector(".target") as HTMLButtonElement;
    target.click();
    expect(first).toHaveBeenCalledTimes(1);
    (root.querySelector(".next") as HTMLButtonElement).click();
    flushSync();
    target.click();
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    (root.querySelector(".next") as HTMLButtonElement).click();
    flushSync();
    target.click();
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("strips inline handlers during hydration", () => {
    const spy = vi.fn();
    const App = create({
      render() {
        return html`<button onClick=${spy}>x</button>`;
      },
    });
    const root = host();
    root.innerHTML = `<button onclick="throw new Error('inline')">x</button>`;
    hydrate(App, root);
    const btn = root.querySelector("button")!;
    expect(btn.getAttribute("onclick")).toBeNull();
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
