import { create } from "svenjs";

const Counter = create({
  initialState: { n: 0 },
  add(n: number) {
    this.setState({ n: this.state.n + n });
    // @ts-expect-error inferred state stays numeric in extra methods
    this.setState({ n: "wrong" });
    this._timer = setTimeout(() => this.add(1), 10);
    return this.state.n;
  },
  render() {
    const result: number = this.add(1);
    // @ts-expect-error method return type is retained
    const wrong: string = this.add(1);
    void [result, wrong];
    // @ts-expect-error methods retain their parameter types
    this.add("wrong");
    return <button onClick={(e: MouseEvent) => this.add(e.button)}>{this.state.n}</button>;
  },
});

void Counter;

import type { ComponentSpec } from "svenjs";
const Annotated: ComponentSpec<{}, { count: number }> = {
  initialState: { count: 0 },
  increment() { this.setState({ count: this.state.count + 1 }); },
  render() {
    const count: number = this.state.count;
    // @ts-expect-error state remains typed for annotated specs
    const invalid: string = this.state.count;
    this.increment();
    return <p>{count}</p>;
  },
};
create(Annotated);

// Props and state can both be inferred from an annotated state initializer.
const WithProps = create({
  initialState: (props: { start: number }) => ({ count: props.start }),
  add(n: number) {
    const start: number = this.props.start;
    // @ts-expect-error inferred props stay numeric
    const invalid: string = this.props.start;
    this.setState((state) => ({ count: state.count + n }));
    // @ts-expect-error updater must return the inferred state
    this.setState(() => ({ count: "wrong" }));
    void [start, invalid];
  },
  onMount() {
    this._output = document.createElement("output");
    this.add(1);
    // @ts-expect-error lifecycle hooks use the inferred method signatures
    this.add("wrong");
  },
  render() {
    this.add(1);
    // @ts-expect-error inferred props do not gain arbitrary known fields
    this.props.missing;
    return <p>{this.state.count}</p>;
  },
});
const valid = <WithProps start={1} />;
// @ts-expect-error JSX props retain the inferred type
const invalid = <WithProps start="wrong" />;
void [valid, invalid];

// Existing explicit two-parameter calls retain state/props and dynamic methods.
create<{ start: number }, { count: number }>({
  initialState: (props) => ({ count: props.start }),
  add(n: number) { this.setState({ count: this.state.count + n }); },
  render() {
    this.add(1);
    this._node = document.createElement("div");
    // @ts-expect-error explicitly declared props stay typed
    const wrong: string = this.props.start;
    // @ts-expect-error explicitly declared state stays typed
    this.setState({ count: "wrong" });
    return <p>{wrong}</p>;
  },
});

// Explicit methods are available when specifying props/state generic arguments.
type Methods = { add(n: number): number };
create<{}, { count: number }, Methods>({
  description: "counter",
  initialState: { count: 0 },
  add(n) { this.setState({ count: this.state.count + n }); return this.state.count; },
  render() {
    const count: number = this.add(1);
    // @ts-expect-error explicit method parameter type
    this.add("wrong");
    return <p>{count}</p>;
  },
});
const TypedSpec: ComponentSpec<{}, { count: number }, Methods> = {
  description: "counter",
  initialState: { count: 0 },
  add(n) { this.setState({ count: this.state.count + n }); return this.state.count; },
  render() {
    // @ts-expect-error annotated spec with explicit method signatures
    this.add("wrong");
    return <p>{this.add(1)}</p>;
  },
};
create(TypedSpec);

const Stateless = create({
  label(value: number) { return String(value); },
  render() {
    const label: string = this.label(1);
    // @ts-expect-error no initialState is needed for method inference
    this.label("wrong");
    return <p>{label}</p>;
  },
});
void Stateless;
