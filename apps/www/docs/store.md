---
title: Store
nav: Store
description: Share state through the tiny SvenJS publish-and-subscribe store without adding a state library.
order: 14
---

`createStore` is a tiny pub/sub. It is not Redux.

```js
import { createStore } from "svenjs";

const store = createStore({
  state: { posts: [] },
  init() {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((posts) => this.set({ posts }));
  },
});

store.get();
store.set((s) => ({ ...s, posts: [] }));
```

A component that should re-render when the store changes calls `this.observe(store)` in `onMount`. That schedules a patch without touching component state, and unsubscribes on destroy.

```js
const List = create({
  onMount() {
    this.observe(store);
  },
  render() {
    return html`<ul>${store.get().posts.map((p) => html`<li key=${p.id}>${p.title}</li>`)}</ul>`;
  },
});
```

`listenTo` is an alias for `subscribe`. `emit(data)` is an alias for `set(data)`. Use `subscribe` yourself when the store update should derive local state, not just re-render.
