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
        <article className="prose">
          <h1 className="page-title">Playground</h1>
          <p className="page-lede">
            Build a SvenJS app in the browser, see it run immediately, and keep the result as a single HTML file.
          </p>
          <h2>What you can do</h2>
          <ul>
            <li>Start from click, todo, composition, or blank examples.</li>
            <li>Share source in a URL fragment without uploading it.</li>
            <li>Copy or download an HTML file that opens without npm.</li>
          </ul>
          <p>
            The editor is loading. You can also read the <a href="/docs/playground/">playground guide</a>.
          </p>
        </article>
      );
    }
    const Page = this._Page;
    return <Page />;
  },
});
