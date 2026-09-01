import { create } from "svenjs";

export const ClickDemo = create({
  initialState: { clicks: 0 },
  render() {
    return (
      <div className="click-demo">
        <h3>The Click App</h3>
        <button onClick={() => this.setState({ clicks: this.state.clicks + 1 })}>Why not click me?</button>
        <p className="click-stats">
          You have clicked <strong>{this.state.clicks}</strong> {this.state.clicks === 1 ? "time" : "times"}.
        </p>
      </div>
    );
  },
});
