import { create, flushSync } from "svenjs";
import { isInternalLink, matchRoute, navigate, type Route } from "./lib/router";
import { applyTheme, cycleTheme, readTheme, themeLabel, type Theme } from "./lib/theme";
import { ClickPage, ComposePage, TodoPage } from "./pages/demos";
import { DocsPage } from "./pages/docs";
import { HeritagePage } from "./pages/heritage";
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/not-found";
import { PlayGate } from "./pages/play-gate";

const routes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/play", component: PlayGate },
  { path: "/demo/todo", component: TodoPage },
  { path: "/demo/click", component: ClickPage },
  { path: "/demo/compose", component: ComposePage },
  { path: "/docs", component: DocsPage },
  { path: "/docs/:slug", component: DocsPage },
  { path: "/heritage", component: HeritagePage },
];

type ShellState = {
  path: string;
  search: string;
  menu: boolean;
  theme: Theme;
};

export const App = create<Record<string, never>, ShellState>({
  initialState: {
    path: "/",
    search: "",
    menu: false,
    theme: "system",
  },
  onBeforeMount() {
    this.state = {
      path: location.pathname,
      search: location.search,
      menu: false,
      theme: readTheme(),
    };
    applyTheme(this.state.theme);
  },
  onMount() {
    this._onPop = () => {
      flushSync(() => {
        this.setState({
          ...this.state,
          path: location.pathname,
          search: location.search,
          menu: false,
        });
      });
      const main = document.getElementById("main");
      const heading = main?.querySelector("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus();
    };
    this._onClick = (event: MouseEvent) => {
      const a = (event.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a || !isInternalLink(a, event)) return;
      event.preventDefault();
      navigate(a.pathname + a.search + a.hash);
    };
    window.addEventListener("popstate", this._onPop);
    this._root?.addEventListener("click", this._onClick);
  },
  onDestroy() {
    window.removeEventListener("popstate", this._onPop);
    this._root?.removeEventListener("click", this._onClick);
  },
  render() {
    const matched = matchRoute(this.state.path, routes);
    const Page = matched?.route.component ?? NotFoundPage;
    const params = matched?.params ?? {};
    const path = this.state.path;

    return (
      <div className="shell" ref={(el: HTMLElement | null) => (this._root = el)}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="top">
          <a className="wordmark" href="/">
            SvenJS <span className="badge">3</span>
          </a>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-expanded={this.state.menu}
            aria-label="Open menu"
            onClick={() => this.setState({ ...this.state, menu: !this.state.menu })}
          >
            ☰
          </button>
          <nav className={this.state.menu ? "nav open" : "nav"} aria-label="Primary">
            <a href="/play" aria-current={path.startsWith("/play") ? "page" : undefined}>
              Playground
            </a>
            <a href="/demo/todo" aria-current={path.startsWith("/demo") ? "page" : undefined}>
              Demos
            </a>
            <a href="/docs" aria-current={path.startsWith("/docs") ? "page" : undefined}>
              Docs
            </a>
            <a href="/heritage" aria-current={path.startsWith("/heritage") ? "page" : undefined}>
              Heritage
            </a>
          </nav>
          <button
            className="icon-btn"
            type="button"
            aria-label={`Theme: ${themeLabel(this.state.theme)}. Click to change.`}
            title={themeLabel(this.state.theme)}
            onClick={() => this.setState({ ...this.state, theme: cycleTheme(this.state.theme) })}
          >
            ◑
          </button>
        </header>
        <main className="main" id="main">
          <Page params={params} search={this.state.search} />
        </main>
        <footer className="foot">
          <span>
            SvenJS 3 · ISC · <a href="/heritage">Heritage</a>
          </span>
          <span>
            <a href="https://github.com/svenanders/svenjs">GitHub</a>
          </span>
        </footer>
      </div>
    );
  },
});
