import { afterEach, describe, expect, it } from "vitest";
import { create, flushSync, h, html, render } from "svenjs";

function host() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

const authors = {
  html: (clicks: number, bump: () => void) =>
    html`<button class="n" onClick=${bump}>${clicks}</button>`,
  jsx: (clicks: number, bump: () => void) => (
    <button className="n" onClick={bump}>
      {clicks}
    </button>
  ),
  h: (clicks: number, bump: () => void) => h("button", { class: "n", onClick: bump }, clicks),
};

describe.each(["html", "jsx", "h"] as const)("contract via %s", (author) => {
  it("updates isolated instance state", () => {
    const App = create({
      initialState: { clicks: 0 },
      render() {
        return authors[author](this.state.clicks, () => this.setState({ clicks: this.state.clicks + 1 }));
      },
    });
    const root = host();
    render(App, root);
    const btn = root.querySelector(".n") as HTMLButtonElement;
    expect(btn.textContent).toBe("0");
    btn.click();
    flushSync();
    expect(btn.textContent).toBe("1");
    expect(root.querySelector(".n")).toBe(btn);
  });
});
