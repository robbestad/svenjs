import { create } from "svenjs";

export const DemoNav = create<{ current: string }, Record<string, never>>({
  render() {
    const current = this.props.current;
    return (
      <nav className="subnav" aria-label="Demos">
        <a href="/demo/mission-control/" aria-current={current === "mission-control" ? "page" : undefined}>
          Mission Control
        </a>
        <a href="/demo/todo/" aria-current={current === "todo" ? "page" : undefined}>
          Todo
        </a>
        <a href="/demo/click/" aria-current={current === "click" ? "page" : undefined}>
          Click
        </a>
        <a href="/demo/compose/" aria-current={current === "compose" ? "page" : undefined}>
          Composition
        </a>
      </nav>
    );
  },
});
