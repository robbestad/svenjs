# Changelog

## Unreleased

Throughput work in the 3.2 runtime. Public API and observable semantics are unchanged aside from one mixed-key correction noted below.

### Keyed patch

- Same-order keyed children patch in place. No `Map`/`Set`, no `insertBefore`, no per-child node arrays.
- `collectDom` is gone. Moves walk the live instance tree (`_dom`…`_end`, through nested components) as a contiguous range, so a fragment stays together when it is reordered even if an inner component independently changed its root.
- A new keyed node no longer steals an unkeyed sibling of the same type. That was a correctness hole; mixed keys already warn in development.

### Vnode create

- `jsx` / `jsxs` / `jsxDEV` build a vnode directly. They snapshot props once instead of copying them and then calling `h`, which copied them again.
- `h` keeps its one props snapshot for public hyperscript semantics.
- `flatten` no longer wraps every item in `normalizeChild` after it has already dropped `null` / `true` / `false`.
- An array returned from `render()` becomes a fragment without spreading into `h`.

### DOM writes

- Style object keys that did not change skip `setProperty`.
- A DOM property is not assigned when it already matches. Controlled inputs keep the caret when `value` is unchanged.
- `setAttribute` is still used for string values, including SVG `points`. Skipping it after a property write broke polyline updates: `el.points` is an `SVGPointList`, not a string.

### SSR

- `escapeHtml` runs one `/[&<>"]/` pass instead of four replacements.
- `stringify` concatenates in a loop instead of `map` / `join`.

### Mission Control

- Fleet filter is one pass over the 100 units, then an in-place sort.
- Callsign clicks are delegated on `tbody`. The previous per-row `onClick` closed over `unit.id` every tick and rebound 100 listeners.

### Size

IIFE gzip 5267 bytes (budget 5632). ESM gzip 5826 bytes.
