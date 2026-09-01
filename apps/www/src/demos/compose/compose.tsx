import { create } from "svenjs";

const Welcome = create<{ greeting?: string }, Record<string, never>>({
  render() {
    return (
      <div className="compose-card">
        <h3>Welcome</h3>
        <p>{this.props.greeting ?? "Hello from a child component."}</p>
      </div>
    );
  },
});

const Welcome2 = create<{ greeting?: string }, Record<string, never>>({
  render() {
    return (
      <div className="compose-card">
        <h3>Welcome 2</h3>
        <p>{this.props.greeting ?? "Same pattern, different props."}</p>
      </div>
    );
  },
});

const Counter = create({
  initialState: { count: 0 },
  onMount() {
    this._timer = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  },
  onDestroy() {
    clearInterval(this._timer);
  },
  render() {
    return (
      <div className="compose-card">
        <h3>Counter</h3>
        <p>Independent child state — I have counted to {this.state.count}.</p>
      </div>
    );
  },
});

export const ComposeDemo = create({
  render() {
    return (
      <div className="compose-grid">
        <Welcome greeting="We meet again." />
        <Welcome />
        <Welcome2 greeting="Yeah boi." />
        <Counter />
      </div>
    );
  },
});
