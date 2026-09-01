---
title: JSX
nav: JSX
description: Configure and use the SvenJS automatic JSX runtime, fragments, attributes, events, and refs.
order: 13
---

JSX compiles to `h()` via the automatic runtime (`jsx` / `jsxs` / `Fragment`).

Supported:

- `class` and `className`
- `htmlFor` / `for`
- `onClick`, `onDoubleClick`, `onInput`, `onKeyDown`, …
- boolean attributes (`disabled`, `checked`)
- `style` as a string or object
- `ref` as a callback, called with the element on mount and `null` on unmount
- `dangerouslySetInnerHTML={{ __html }}` for trusted markup
- Fragments (`<>…</>`)
- `key` on list children

Dynamic lists of components should have keys. In development SvenJS warns about mixed or duplicate keys.

You can skip JSX and call `h("div", { className: "box" }, "hi")` directly.
