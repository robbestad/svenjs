---
title: Lifecycle
nav: Lifecycle
order: 12
---

Preferred names:

| Hook | When |
| --- | --- |
| `onBeforeMount` | After the instance exists, before the first `render()` |
| `onMount` | After the first DOM commit |
| `onUpdate` | After every later patch |
| `onDestroy` | Before the instance is removed |

2.x aliases still work: `_beforeMount`, `_didMount`, `_didUpdate`. There was no unmount hook before; use `onDestroy`.

`onMount` may call `setState`. That schedules one extra patch after mount — it does not re-run `onMount`.

Clear timers and subscriptions in `onDestroy`. The composition demo does this for its interval.
