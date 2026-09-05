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

1. `setState` records the next state (cloned and frozen in DEV)
2. The instance is marked dirty and queued
3. A microtask flushes the queue
4. `render()` produces a new vnode — children with the same props are skipped
5. A keyed diff patches the previous tree. Same-order keyed children patch in place; fragments move as the contiguous range between their marker comments

`this.observe(store)` marks the instance dirty when the store changes, without a dummy `setState`.

DOM writes follow the tree, not the other way around. Unchanged style keys are not rewritten. A controlled `value` that already matches the input is left alone so the caret stays put. SVG attributes such as `points` still go through `setAttribute` — the animated `SVGPointList` property is not a string.

Forms mean the same thing on the server and after hydration:

- `textarea value` is serialized as **text content**, not a `value` attribute
- `select value` marks the matching `option` as `selected`
- hydration writes live properties, not just HTML attributes
- user input typed before hydration is overwritten by a controlled value
- `select multiple` is unsupported
- if both `dangerouslySetInnerHTML` and children are set, innerHTML wins (development warns)

Each `html` evaluation that is mounted gets its own DOM and instance, even when HTM reuses a static template.

The 2.x renderer assigned `node.innerHTML = ""` on every update. That is gone on purpose.

`flushSync(fn)` runs `fn` and flushes immediately. The site router uses it so view transitions see the new DOM.
