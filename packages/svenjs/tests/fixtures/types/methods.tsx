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
