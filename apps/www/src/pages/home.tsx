import { create } from "svenjs";
import { ClickDemo } from "../demos/click/click";
import { HELLO_HTML } from "../lib/one-file";

const CopyRecipe = create({
  initialState: { copied: false },
  copy() {
    navigator.clipboard?.writeText(HELLO_HTML);
    this.setState({ copied: true });
  },
  render() {
    return (
      <div className="recipe">
        <div className="recipe-bar">
          <span>hello.html — open in a browser, no npm</span>
          <button type="button" className="btn" onClick={() => this.copy()}>
            {this.state.copied ? "Copied" : "Copy this file"}
          </button>
        </div>
        <pre>
          <code>{HELLO_HTML}</code>
        </pre>
      </div>
    );
  },
});

export const HomePage = create({
  render() {
    return (
      <div>
        <section className="hero">
          <div>
            <p className="kicker">SvenJS 3</p>
            <h1>One HTML file. A button. State. That’s it.</h1>
            <p className="lede">
              A tiny UI runtime you drop on a page. No Node, no Vite, no compiler. Tagged templates instead of JSX —
              save the file and double-click it.
            </p>
            <div className="cta-row">
              <a className="btn primary" href="/play">
                Open playground
              </a>
              <a className="btn" href="/docs/one-file">
                The one-file recipe
              </a>
            </div>
            <p className="meta">
              <a className="size-badge" href="https://unpkg.com/svenjs@3">
                unpkg.com/svenjs@3
              </a>{" "}
              · script tag · <code>html`…`</code>
            </p>
          </div>
          <div className="hero-demo">
            <ClickDemo />
          </div>
        </section>

        <CopyRecipe />

        <section className="features">
          <article className="feature">
            <h2>No build</h2>
            <p>One <code>&lt;script src&gt;</code> from a CDN. Open the file from disk. That is the whole toolchain.</p>
          </article>
          <article className="feature">
            <h2>State you can see</h2>
            <p>
              <code>setState</code> replaces the object. Copy the fields you keep. Accidental mutation throws in
              development.
            </p>
          </article>
          <article className="feature">
            <h2>Download from the playground</h2>
            <p>
              Tweak the example, hit <strong>Download .html</strong>, mail the file to yourself. It still runs.
            </p>
          </article>
        </section>

        <section>
          <p className="kicker">Demos</p>
          <div className="demo-links">
            <a href="/demo/todo">
              <h3>Todo</h3>
              <p>Add, complete, filter. Same app as the playground export.</p>
            </a>
            <a href="/play">
              <h3>Playground</h3>
              <p>Edit and download a single HTML file.</p>
            </a>
            <a href="/examples/hello.html">
              <h3>hello.html</h3>
              <p>The recipe, served as a page. View source.</p>
            </a>
          </div>
        </section>
      </div>
    );
  },
});
