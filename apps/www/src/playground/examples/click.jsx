import { create, render } from "svenjs";

const App = create({
  initialState: { clicks: 0 },
  render() {
    return (
      <div className="demo-card">
        <h1>The Click App</h1>
        <button onClick={() => this.setState({ clicks: this.state.clicks + 1 })}>
          Why not click me?
        </button>
        <p>You have clicked {this.state.clicks} times.</p>
      </div>
    );
  },
});

render(App, document.getElementById("app"));
