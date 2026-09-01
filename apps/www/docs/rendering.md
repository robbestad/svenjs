---
title: Rendering
nav: Rendering
order: 8
---

`render(App, element)` mounts a spec (or a vnode) into a DOM node. Calling it again on the same node patches instead of wiping.

`renderToString(App)` walks the tree without a document. Event handlers are omitted. Use it for a static snapshot, not a full SSR framework — there is no hydration.

Updates:

1. `setState` clones (and in DEV, freezes) the next state
2. The instance is queued
3. A microtask flushes the queue
4. `render()` produces a new vnode
5. A keyed diff patches the previous tree

The 2.x renderer assigned `node.innerHTML = ""` on every update. That is gone on purpose.

`flushSync(fn)` runs `fn` and flushes immediately. The site router uses it so view transitions see the new DOM.
