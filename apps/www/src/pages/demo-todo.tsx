import { create } from "svenjs";
import { TodoDemo } from "../demos/todo/todo";
import { DemoNav } from "./demo-nav";

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
