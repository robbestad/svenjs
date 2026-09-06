---
title: Components and props
nav: Components
description: Compose SvenJS component specs and pass props with tagged templates or compiled JSX.
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


## TypeScript methods

`create({...})` infers extra method signatures, including calls through `this` in
`render`, other methods, and lifecycle hooks. State is inferred from
`initialState`; annotate its props parameter to infer props as well:

```ts
const Counter = create({
  initialState: (props: { start: number }) => ({ count: props.start }),
  add(amount: number) {
    this.setState({ count: this.state.count + amount });
  },
  render() {
    this.add(1); // this.add("one") is a type error
    return html`<p>${this.state.count}</p>`;
  },
});
```

Dynamic instance fields such as `this._timer` or `this._output` remain allowed.
Undeclared instance members stay permissive; declare methods in the spec to check
their argument and return types.

Existing `create<Props, State>(...)` and `ComponentSpec<Props, State>` annotations
remain supported. TypeScript cannot infer the remaining generic parameters when
you supply the first ones explicitly. These two-parameter forms therefore retain
permissive extra methods. Supply an optional third type parameter to check method
signatures in those forms:

```ts
type Methods = { add(amount: number): void };
const Counter = create<{ start: number }, { count: number }, Methods>({
  initialState: (props) => ({ count: props.start }),
  add(amount) {
    this.setState({ count: this.state.count + amount });
  },
  render() {
    this.add(1);
    return html`<p>${this.state.count}</p>`;
  },
});
```

The same third parameter works with `ComponentSpec<Props, State, Methods>`.
