import { create } from "svenjs";
import { ClickDemo } from "../demos/click/click";
import { ComposeDemo } from "../demos/compose/compose";
import { TodoDemo } from "../demos/todo/todo";

const DemoNav = create<{ current: string }, Record<string, never>>({
  render() {
    const current = this.props.current;
    return (
      <nav className="subnav" aria-label="Demos">
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

export const TodoPage = create<{ search?: string }, Record<string, never>>({
  render() {
    return (
      <div>
        <h1 className="page-title">Todo</h1>
        <p className="page-lede">Add, edit, complete, filter. Double-click a row to rename it. State lives in localStorage.</p>
        <DemoNav current="todo" />
        <TodoDemo search={this.props.search} />
      </div>
    );
  },
});

export const ClickPage = create({
  render() {
    return (
      <div>
        <h1 className="page-title">Click</h1>
        <p className="page-lede">The original example. A component, a number, a button.</p>
        <DemoNav current="click" />
        <div className="panel" style={{ maxWidth: "28rem" }}>
          <ClickDemo />
        </div>
      </div>
    );
  },
});

export const ComposePage = create({
  render() {
    return (
      <div>
        <h1 className="page-title">Composition</h1>
        <p className="page-lede">Parent renders children by name. Each child owns its own state.</p>
        <DemoNav current="compose" />
        <ComposeDemo />
      </div>
    );
  },
});
