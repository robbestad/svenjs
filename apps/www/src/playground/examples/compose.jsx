import { create, render } from "svenjs";

const Welcome = create({
  render() {
    return (
      <div>
        {this.props.greeting ?? "Hello from a child component."}
      </div>
    );
  },
});

const Counter = create({
  initialState: { n: 0 },
  onMount() {
    this._id = setInterval(() => this.setState({ n: this.state.n + 1 }), 1000);
  },
  onDestroy() {
    clearInterval(this._id);
  },
  render() {
    return <div>Child counter: {this.state.n}</div>;
  },
});

const App = create({
  render() {
    return (
      <div className="compose-grid">
        <Welcome greeting="We meet again." />
        <Welcome />
        <Counter />
      </div>
    );
  },
});

render(App, document.getElementById("app"));
