import { create } from "svenjs";

export const HeritagePage = create({
  render() {
    return (
      <article className="prose heritage">
        <h1>Heritage</h1>
        <p>
          SvenJS 2.0.2 was a microframework from the Webpack 4 / Babel RC years. Components were plain objects with{" "}
          <code>render</code> and <code>setState</code>. JSX came from a separate <code>svenjsx-loader</code>. Every
          update cleared the root with <code>innerHTML = ""</code> and rebuilt the tree.
        </p>
        <p>Version 3 keeps the mental model and throws away the implementation.</p>
        <dl>
          <dt>2.x</dt>
          <dd>Webpack 4, Babel 7 RC, tape, jsdom, a custom JSX loader</dd>
          <dt>3.x</dt>
          <dd>TypeScript, Vite, Vitest, native automatic JSX runtime</dd>
          <dt>2.x update</dt>
          <dd>Wipe the DOM, run render(), insert a new tree</dd>
          <dt>3.x update</dt>
          <dd>DEV clone + freeze, observe(store), keyed vnode patch in place when order is stable, skip unchanged children</dd>
          <dt>Lifecycle</dt>
          <dd>
            <code>_didMount</code> / <code>_didUpdate</code> / <code>_beforeMount</code> still work. Prefer{" "}
            <code>onMount</code>, <code>onUpdate</code>, <code>onDestroy</code>.
          </dd>
          <dt>Store</dt>
          <dd>
            <code>listenTo</code> / <code>emit</code> remain as aliases around <code>subscribe</code> / <code>set</code>.
          </dd>
        </dl>
        <p>
          This is not a drop-in for 2.0.2. There is no <code>svenjsx-loader</code>, no <code>require("dist/index.js")</code>,
          and no promise that old examples compile unchanged. The demos were ported by hand.
        </p>
        <p>
          <a href="/docs/first-component/">Write a component</a> or <a href="/play/">open the playground</a>.
        </p>
      </article>
    );
  },
});
