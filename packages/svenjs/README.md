# SvenJS 3

A tiny JavaScript framework for composable web apps. JSX, immutable state, keyed DOM patch. No compiler.

```bash
npm install svenjs
```

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "svenjs"
  }
}
```

```jsx
import { create, render } from "svenjs";

const App = create({
  initialState: { clicks: 0 },
  render() {
    return (
      <button onClick={() => this.setState({ clicks: this.state.clicks + 1 })}>
        {this.state.clicks}
      </button>
    );
  },
});

render(App, document.getElementById("app"));
```

CDN / script tag: `svenjs.iife.js` (unpkg / jsdelivr).

This is a rewrite of 2.x. Not drop-in compatible (`svenjsx-loader` is gone; `setState` still replaces, does not merge).

ISC license.
