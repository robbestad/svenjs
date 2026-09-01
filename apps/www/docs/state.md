---
title: State
nav: State
order: 3
---

`setState` **replaces** state. It does not merge. That is the 2.x contract.

```jsx
this.setState({ clicks: this.state.clicks + 1 });
this.setState((s) => ({ ...s, clicks: s.clicks + 1 }));
```

Several `setState` calls in one event are batched into a single microtask patch.

In development the new state is `structuredClone`d and deep-frozen. Mutating `this.state.clicks++` throws. In production the clone still happens; the freeze does not.

Pass a full object. If you need fields from the previous state, copy them — or use the updater form.
