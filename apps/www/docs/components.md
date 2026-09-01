---
title: Components and props
nav: Components
order: 4
---

Nest specs with `<${Child} />` in a template (or `<Child />` if you compile JSX).

```js
const Welcome = create({
  render() {
    return html`<p>${this.props.greeting ?? "Hello"}</p>`;
  },
});

const Page = create({
  render() {
    return html`<${Welcome} greeting="We meet again." />`;
  },
});
```

Each mount gets its own instance and its own state. When a parent re-renders, a child of the same type and `key` is reused: props update, state stays.

`this.props.children` is whatever was placed between the tags.

`create()` throws if `render` is missing. That is the only required field.
