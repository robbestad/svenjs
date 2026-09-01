---
title: Rendering
nav: Rendering
description: Mount, patch, prerender, and hydrate SvenJS component trees while preserving interactive state.
order: 15
---

`render(App, element)` mounts a spec (or a vnode) into a DOM node. Calling it again on the same node patches instead of wiping.

`renderToString(App)` walks the tree without a document. Event handlers are omitted, so use `hydrate(App, element)` in the browser to attach them while reusing the prerendered DOM.

Render the same component tree and initial props on the server and in the browser. Hydration keeps matching DOM nodes, attaches events and refs, and patches text or elements that differ. On an empty element it behaves like `render`.

```jsx
// build/server
const markup = renderToString(<App initialUrl="/docs/state/" />);

// browser
hydrate(<App initialUrl={location.pathname} />, document.getElementById("app"));
```

Updates:

1. `setState` clones (and in DEV, freezes) the next state
2. The instance is queued
3. A microtask flushes the queue
4. `render()` produces a new vnode
5. A keyed diff patches the previous tree

The 2.x renderer assigned `node.innerHTML = ""` on every update. That is gone on purpose.

`flushSync(fn)` runs `fn` and flushes immediately. The site router uses it so view transitions see the new DOM.
