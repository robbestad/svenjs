---
title: Lists
nav: Lists
description: Render and update SvenJS lists with stable keys so DOM nodes and component state follow each item.
order: 3
---

Map an array to `html` snippets. Put `key` on each row so the patcher can reorder without remounting.

```js
render() {
  return html`
    <ul>
      ${this.state.items.map(
        (item) => html`<li key=${item.id}>${item.text}</li>`,
      )}
    </ul>
  `;
}
```

Keys are the identity of a row. Same key and type keeps the DOM node and any child component state. When every child has a key and the keys stay in the same order, the patcher updates text and attributes in place and does not call `insertBefore`.

A new keyed node does not reuse an unkeyed sibling of the same type. Mix keys on a dynamic list only if you mean it — development warns when some children have keys and others do not.

Duplicate or missing keys on a dynamic list warn in development.
