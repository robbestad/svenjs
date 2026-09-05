import { create } from "svenjs";

const Counter = create({
  initialState: { n: 0 },
  add(n: number) {
    this.setState({ n: this.state.n + n });
  },
  render() {
    this.add(1);
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
