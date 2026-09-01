---
title: Your first component
nav: First component
order: 2
---

A component is a spec object. `create()` tags it; `render()` mounts it.

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

`render` must be a method (not an arrow) so `this` is the instance. `this.props` and `this.state` are available while it runs.

The same spec can be used as a child: `<App />` creates a new instance each time it is mounted.
