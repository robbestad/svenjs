import { create } from "svenjs";

export const PlayGate = create({
  initialState: { ready: false },
  onMount() {
    import("./play").then((mod) => {
      this._Page = mod.PlayPage;
      this.setState({ ready: true });
    });
  },
  render() {
    if (!this.state.ready) {
      return (
        <div>
          <h1 className="page-title">Playground</h1>
          <p className="page-lede">Loading editor…</p>
        </div>
      );
    }
    const Page = this._Page;
    return <Page />;
  },
});
