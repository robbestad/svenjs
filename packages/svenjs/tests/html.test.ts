import { describe, expect, it } from "vitest";
import { create, flushSync, html, render } from "svenjs";

function mount(spec: Parameters<typeof render>[0]) {
  const root = document.createElement("div");
  document.body.appendChild(root);
  render(spec, root);
  return root;
}

describe("html tagged template", () => {
  it("renders tags, text, and class", () => {
    const App = create({
      render() {
        return html`<div class="box">hello</div>`;
      },
    });
    const root = mount(App);
    expect(root.querySelector(".box")?.textContent).toBe("hello");
  });

  it("interpolates values and events", () => {
    const App = create({
      initialState: { n: 0 },
      render() {
        return html`
          <button onClick=${() => this.setState({ n: this.state.n + 1 })}>${this.state.n}</button>
        `;
      },
    });
    const root = mount(App);
    const btn = root.querySelector("button")!;
    expect(btn.textContent).toBe("0");
    btn.click();
    flushSync();
    expect(btn.textContent).toBe("1");
  });

  it("nests components", () => {
    const Child = create<{ label: string }>({
      render() {
        return html`<span class="c">${this.props.label}</span>`;
      },
    });
    const App = create({
      render() {
        return html`<div><${Child} label="hi" /></div>`;
      },
    });
    const root = mount(App);
    expect(root.querySelector(".c")?.textContent).toBe("hi");
  });

  it("maps lists with keys", () => {
    const App = create({
      render() {
        const ids = ["a", "b"];
        return html`
          <ul>
            ${ids.map((id) => html`<li key=${id}>${id}</li>`)}
          </ul>
        `;
      },
    });
    const root = mount(App);
    expect([...root.querySelectorAll("li")].map((n) => n.textContent)).toEqual(["a", "b"]);
  });
});
