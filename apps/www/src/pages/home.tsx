import { create } from "svenjs";
import { ClickDemo } from "../demos/click/click";

export const HomePage = create({
  render() {
    return (
      <div>
        <section className="hero">
          <div>
            <p className="kicker">SvenJS 3</p>
            <h1>A tiny UI runtime with the 2015 mental model, rebuilt for 2026.</h1>
            <p className="lede">
              JSX, immutable state, and a keyed DOM patch. No compiler. No <code>innerHTML</code> wipe. The same{" "}
              <code>create</code> / <code>setState</code> API — just no longer stuck in Webpack 4.
            </p>
            <div className="cta-row">
              <a className="btn primary" href="/play">
                Open playground
              </a>
              <a className="btn" href="/docs">
                Read the docs
              </a>
            </div>
            <p className="meta">
              <span className="size-badge">tiny ESM</span> · TypeScript · keyed patch · immutable state
            </p>
          </div>
          <div className="hero-demo">
            <ClickDemo />
          </div>
        </section>

        <section className="features">
          <article className="feature">
            <h2>Keyed patch</h2>
            <p>setState re-renders that component and diffs the vnode. Lists keep identity. The old runtime tore the tree down every time.</p>
          </article>
          <article className="feature">
            <h2>Frozen state</h2>
            <p>State is cloned and frozen in development. Accidental mutation throws instead of failing silently two screens later.</p>
          </article>
          <article className="feature">
            <h2>No compiler</h2>
            <p>
              JSX becomes <code>h()</code>. There is no reactive compiler, no generated code, no extra toolchain beyond Vite.
            </p>
          </article>
        </section>

        <section>
          <p className="kicker">Demos</p>
          <div className="demo-links">
            <a href="/demo/todo">
              <h3>Todo</h3>
              <p>The original TodoMVC, restyled, with localStorage and filters.</p>
            </a>
            <a href="/demo/click">
              <h3>Click</h3>
              <p>The first example. A button, a number, setState.</p>
            </a>
            <a href="/demo/compose">
              <h3>Composition</h3>
              <p>Nested components, props, and independent child state.</p>
            </a>
          </div>
        </section>
      </div>
    );
  },
});
