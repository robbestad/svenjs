---
title: Lists
nav: Lists
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

Duplicate or missing keys on a dynamic list warn in development.
