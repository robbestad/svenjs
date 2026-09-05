---
title: State
nav: State
description: Learn SvenJS replacement state, updater functions, batching, and development-time mutation protection.
order: 2
---

`setState` **replaces** state. It does not merge. That is the 2.x contract.

```jsx
this.setState({ clicks: this.state.clicks + 1 });
this.setState((s) => ({ ...s, clicks: s.clicks + 1 }));
```

Several `setState` calls in one event are batched into a single microtask patch.

In development the new state is `structuredClone`d and plain objects/arrays are deep-frozen. Mutating `this.state.clicks++` throws. Production assigns the next value as-is — treat it as immutable.

`Map`, `Set`, `Date`, and typed arrays are allowed and cloned, but they are **not** mutation-proof after freeze. Functions, DOM nodes, and cyclic structures throw `TypeError: SvenJS: state must be structured-cloneable` and leave the previous state in place.

Development diagnostics live in the published `svenjs.dev.js` / `svenjs.iife.dev.js` builds. `NODE_ENV=development` cannot restore code that was already stripped from the production file. Bundlers should honor the package `development` export condition; a script tag must load the `.dev.` file explicitly.

`initialState` may be a value or a factory that receives props. A factory is useful when each mount needs state derived from its own props, and keeps server rendering and hydration deterministic.

```jsx
const Counter = create({
  initialState: (props) => ({ count: props.start ?? 0 }),
  render() {
    return <button>{this.state.count}</button>;
  },
});
```

Pass a full object. If you need fields from the previous state, copy them — or use the updater form.
