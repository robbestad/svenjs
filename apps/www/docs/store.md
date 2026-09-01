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

const off = store.subscribe((state) => {
  // attach to a component with setState if you want a re-render
});
store.get();
store.set((s) => ({ ...s, posts: [] }));
off();
```

`listenTo` is an alias for `subscribe`. `emit(data)` is an alias for `set(data)`.
