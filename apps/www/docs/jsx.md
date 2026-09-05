---
title: JSX
nav: JSX
description: Configure and use the SvenJS automatic JSX runtime, fragments, attributes, events, and refs.
order: 13
---

JSX compiles through the automatic runtime (`jsx` / `jsxs` / `jsxDEV` / `Fragment`). Those functions build vnodes directly; they do not call `h()`. `h()` remains the public hyperscript helper.

Supported:

- `class` and `className`
- `htmlFor` / `for`
- DOM events: `onClick`, `onDoubleClick` (native `dblclick`), `onInput`, `onKeyDown`, …
- Any `on*` prop is treated as an event. `onFooBar` listens for `"foobar"`. String values are never written as inline HTML handlers.
- boolean attributes (`disabled`, `checked`)
- `style` as a string or object
- `ref` as a callback, called with the element on mount and `null` on unmount
- `dangerouslySetInnerHTML={{ __html }}` for trusted markup
- Fragments (`<>…</>`)
- `key` on list children

Dynamic lists of components should have keys. In development SvenJS warns about mixed or duplicate keys.

You can skip JSX and call `h("div", { className: "box" }, "hi")` directly.
