---
title: Lifecycle
nav: Lifecycle
description: Use SvenJS mount, update, and destroy lifecycle hooks for DOM integrations and cleanup.
order: 12
---

Preferred names:

| Hook | When |
| --- | --- |
| `onBeforeMount` | After the instance exists, before the first `render()` |
| `onMount` | After the first DOM commit (the whole tree is inserted; refs have run) |
| `onUpdate` | After every later patch |
| `onDestroy` | Before the instance is removed |

2.x aliases still work: `_beforeMount`, `_didMount`, `_didUpdate`. There was no unmount hook before; use `onDestroy`.

`onMount` may call `setState`. That schedules one extra patch after mount — it does not re-run `onMount`. Nested children run `onMount` before their parent. Refs run before `onMount`, so a ref callback can stash an element that `onMount` then focuses.

`isConnected` is true in `onMount` only when the **root container** is in the document. Detached roots still mount; hooks still run.

`onBeforeMount` also runs during `renderToString`. Put browser-only work in `onMount`. SSR never runs refs or `onMount`.

`onDestroy`, ref teardown, and `observe` unsubscribe functions always run to completion even if one of them throws. The first error is rethrown after the rest of the cleanup.

Clear timers and subscriptions in `onDestroy`. The composition demo does this for its interval. `unmountRoot(container)` is safe to call more than once.
