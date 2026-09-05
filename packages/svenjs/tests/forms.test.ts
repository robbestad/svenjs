import { afterEach, describe, expect, it } from "vitest";
import { create, flushSync, html, hydrate, render, renderToString } from "svenjs";

function host() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("forms", () => {
  it("serializes textarea value as text content", () => {
    const App = create({
      render() {
        return html`<textarea value=${"saved"}></textarea>`;
      },
    });
    expect(renderToString(App)).toBe("<textarea>saved</textarea>");
  });

  it("serializes the matching select option as selected", () => {
    const App = create({
      render() {
        return html`<select value=${"second"}><option value=${"first"}>First</option><option value=${"second"}>Second</option></select>`;
      },
    });
    const markup = renderToString(App);
    expect(markup).toContain("<option value=\"second\" selected>Second</option>");
    expect(markup).not.toContain("<select value=");
  });

  it("hydrates textarea and select to the same values as client mount", () => {
    const App = create({
      render() {
        return html`<form>
          <textarea value=${"saved"}></textarea>
          <select value=${"second"}>
            <option value=${"first"}>First</option>
            <option value=${"second"}>Second</option>
          </select>
        </form>`;
      },
    });
    const markup = renderToString(App);
    const server = host();
    server.innerHTML = markup;
    expect((server.querySelector("textarea") as HTMLTextAreaElement).textContent).toBe("saved");
    expect(server.querySelector("option[selected]")?.getAttribute("value")).toBe("second");

    hydrate(App, server);
    expect((server.querySelector("textarea") as HTMLTextAreaElement).value).toBe("saved");
    expect((server.querySelector("select") as HTMLSelectElement).value).toBe("second");
    const area = server.querySelector("textarea");
    const select = server.querySelector("select");

    const client = host();
    render(App, client);
    expect((client.querySelector("textarea") as HTMLTextAreaElement).value).toBe("saved");
    expect((client.querySelector("select") as HTMLSelectElement).value).toBe("second");
    expect(server.querySelector("textarea")).toBe(area);
    expect(server.querySelector("select")).toBe(select);
  });

  it("lets dangerouslySetInnerHTML win over children", () => {
    const App = create({
      initialState: { html: true },
      render() {
        return this.state.html
          ? html`<div class="box" dangerouslySetInnerHTML=${{ __html: "<b>html</b>" }}><i>child</i></div>`
          : html`<div class="box"><i>child</i></div>`;
      },
    });
    expect(renderToString(App)).toBe('<div class="box"><b>html</b></div>');
    const root = host();
    render(App, root);
    expect(root.querySelector(".box")?.innerHTML).toBe("<b>html</b>");
    expect(root.querySelector("i")).toBeNull();
  });

  it("switches from children to innerHTML without leaving live children", () => {
    const App = create({
      initialState: { html: false },
      render() {
        return this.state.html
          ? html`<div class="box" dangerouslySetInnerHTML=${{ __html: "<b>html</b>" }}></div>`
          : html`<div class="box"><button onClick=${() => this.setState({ html: true })}>child</button></div>`;
      },
    });
    const root = host();
    render(App, root);
    (root.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    expect(root.querySelector(".box")?.innerHTML).toBe("<b>html</b>");
    expect(root.querySelector("button")).toBeNull();
  });
});
