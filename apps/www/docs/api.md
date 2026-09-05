---
title: API
nav: API
description: Exported SvenJS functions and the edges they support.
order: 20
---

| Export | Role |
| --- | --- |
| `create(spec)` | Component spec. `render()` is required. Extra methods stay on the instance. |
| `render(app, el)` | Mount or patch. |
| `hydrate(app, el)` | Attach to server HTML. |
| `renderToString(app)` | SSR. Runs `onBeforeMount`, never `onMount`. |
| `unmountRoot(el)` | Destroy the app in `el`. Safe to call twice. |
| `flushSync(fn?)` | Run `fn` and flush `setState` now. |
| `html` / `h` / `jsx` | Same vnode model. |
| `createStore` | Synchronous pub/sub. `observe` on a component unsubscribes on destroy. |
| `version` | Installed package version string. |
| `Fragment` | JSX fragment. |

**State:** `setState` replaces the object. Updaters and microtask batching are supported. Development clones plain objects/arrays and freezes them.

**Events:** DOM names. `onDoubleClick` → `dblclick`. Custom `onFooBar` → `"foobar"`. No synthetic system.

**Forms:** controlled `input` / `textarea` / `select` (single). Not `select multiple`.

**SSR stores:** create a store per app/request. Do not share mutable user data across `renderToString` calls.
