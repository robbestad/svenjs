# SvenJS 3

A tiny JavaScript framework for composable web apps. JSX, immutable state, keyed DOM patch. No compiler.

Save as `hello.html` and open it. No npm.

```html
<script src="https://unpkg.com/svenjs@3"></script>
<div id="app"></div>
<script>
  const { create, render, html } = Svenjs;
  const App = create({
    initialState: { clicks: 0 },
    render() {
      return html`
        <button onClick=${() => this.setState({ clicks: this.state.clicks + 1 })}>
          ${this.state.clicks}
        </button>
      `;
    },
  });
  render(App, document.getElementById("app"));
</script>
```

With a bundler: `npm install svenjs`, then JSX via `"jsxImportSource": "svenjs"`.

For static HTML, render the same tree on both sides and hydrate it in the browser:

```jsx
import { hydrate, renderToString } from "svenjs";

// build/server
const markup = renderToString(<App url="/docs" />);

// browser
hydrate(<App url={location.pathname} />, document.getElementById("app"));
```

`initialState` accepts a value or `(props) => state`. State is cloned on every change and deep-frozen in development; non-cloneable values fail clearly instead of being silently discarded.

This is a rewrite of 2.x. Not drop-in compatible (`svenjsx-loader` is gone; `setState` still replaces, does not merge).

ISC license.
