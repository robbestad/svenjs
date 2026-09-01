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

In development the new state is `structuredClone`d and deep-frozen. Mutating `this.state.clicks++` throws. Production assigns the next value as-is — treat it as immutable.

State must be structured-cloneable in development. Functions, DOM nodes, and similar runtime objects belong on the component instance (`this.timer`, `this.element`), not inside `this.state`; SvenJS throws a clear error instead of silently dropping them.

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
