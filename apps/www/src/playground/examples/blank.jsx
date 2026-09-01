import { create, render } from "svenjs";

const App = create({
  initialState: { name: "Sven" },
  render() {
    return (
      <div className="demo-card">
        <h1>Hello, {this.state.name}</h1>
        <input
          type="text"
          value={this.state.name}
          onInput={(e) => this.setState({ name: e.target.value })}
        />
      </div>
    );
  },
});

render(App, document.getElementById("app"));
