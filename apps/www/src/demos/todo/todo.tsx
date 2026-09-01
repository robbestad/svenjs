import { create } from "svenjs";

export type Filter = "all" | "active" | "completed";
type Todo = { id: number; message: string; complete: boolean; editing: boolean };

const STORAGE = "svenjs-todos";
const DEFAULT_ITEMS: Todo[] = [
  { id: 1, message: "Answer all the mail", complete: false, editing: false },
  { id: 2, message: "Get a cup of coffee", complete: false, editing: false },
];

function load(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return DEFAULT_ITEMS;
    return JSON.parse(raw) as Todo[];
  } catch {
    return DEFAULT_ITEMS;
  }
}

function persist(items: Todo[]) {
  localStorage.setItem(STORAGE, JSON.stringify(items.map(({ editing, ...rest }) => rest)));
}

function readFilter(search: string): Filter {
  const v = new URLSearchParams(search).get("filter");
  if (v === "active" || v === "completed") return v;
  return "all";
}

export const TodoDemo = create<{ search?: string }, { items: Todo[]; draft: string; editText: string }>({
  initialState: { items: DEFAULT_ITEMS, draft: "", editText: "" },
  onMount() {
    this.setState({ ...this.state, items: load() });
  },
  filter(): Filter {
    return readFilter(this.props.search ?? location.search);
  },
  shown() {
    const filter = this.filter();
    return this.state.items.filter((t: Todo) => {
      if (filter === "active") return !t.complete;
      if (filter === "completed") return t.complete;
      return true;
    });
  },
  render() {
    const items = this.state.items;
    const shown = this.shown();
    const filter = this.filter();
    const remaining = items.filter((t) => !t.complete).length;
    const completed = items.length - remaining;

    return (
      <div className="todo-shell">
        <input
          className="todo-input"
          placeholder="What needs to be done?"
          value={this.state.draft}
          autofocus
          onInput={(e: InputEvent) =>
            this.setState({ ...this.state, draft: (e.target as HTMLInputElement).value })
          }
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key !== "Enter") return;
            const message = this.state.draft.trim();
            if (!message) return;
            const id = this.state.items.reduce((m, t) => Math.max(m, t.id), 0) + 1;
            const next = [...this.state.items, { id, message, complete: false, editing: false }];
            persist(next);
            this.setState({ ...this.state, draft: "", items: next });
          }}
        />
        <section className="todo-main">
          {items.length > 0 && (
            <div className="todo-toolbar">
              <label>
                <input
                  type="checkbox"
                  checked={items.length > 0 && remaining === 0}
                  onChange={() => {
                    const allDone = remaining === 0;
                    const next = items.map((t) => ({ ...t, complete: !allDone, editing: false }));
                    persist(next);
                    this.setState({ ...this.state, items: next });
                  }}
                />{" "}
                Mark all as complete
              </label>
            </div>
          )}
          <ul className="todo-list">
            {shown.map((todo: Todo) => (
              <li key={todo.id} className={`todo${todo.complete ? " done" : ""}${todo.editing ? " editing" : ""}`}>
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() => {
                    const next = items.map((t) =>
                      t.id === todo.id ? { ...t, complete: !t.complete, editing: false } : t,
                    );
                    persist(next);
                    this.setState({ ...this.state, items: next });
                  }}
                />
                <div
                  className="view"
                  onDblClick={() => {
                    if (todo.complete) return;
                    const next = items.map((t: Todo) => ({ ...t, editing: t.id === todo.id }));
                    this.setState({ ...this.state, items: next, editText: todo.message });
                  }}
                >
                  <label>{todo.message}</label>
                </div>
                {todo.editing ? (
                  <EditField
                    value={this.state.editText}
                    onInput={(value: string) => this.setState({ ...this.state, editText: value })}
                    onCancel={() => {
                      const next = items.map((t) => ({ ...t, editing: false }));
                      this.setState({ ...this.state, items: next });
                    }}
                    onCommit={() => {
                      const message = this.state.editText.trim();
                      const next = items
                        .map((t) => (t.id === todo.id ? { ...t, message, editing: false } : t))
                        .filter((t) => t.message.length > 0);
                      persist(next);
                      this.setState({ ...this.state, items: next });
                    }}
                  />
                ) : (
                  <button
                    className="destroy"
                    aria-label={`Delete ${todo.message}`}
                    onClick={() => {
                      const next = items.filter((t) => t.id !== todo.id);
                      persist(next);
                      this.setState({ ...this.state, items: next });
                    }}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <footer className="todo-footer">
              <span>
                {remaining} {remaining === 1 ? "item" : "items"} left
              </span>
              <nav className="todo-filters subnav">
                <a href="/demo/todo/" className={filter === "all" ? "selected" : ""} aria-current={filter === "all" ? "page" : undefined}>
                  All
                </a>
                <a
                  href="/demo/todo/?filter=active"
                  className={filter === "active" ? "selected" : ""}
                  aria-current={filter === "active" ? "page" : undefined}
                >
                  Active
                </a>
                <a
                  href="/demo/todo/?filter=completed"
                  className={filter === "completed" ? "selected" : ""}
                  aria-current={filter === "completed" ? "page" : undefined}
                >
                  Completed
                </a>
              </nav>
              {completed > 0 && (
                <button
                  className="ghost"
                  onClick={() => {
                    const next = items.filter((t) => !t.complete);
                    persist(next);
                    this.setState({ ...this.state, items: next });
                  }}
                >
                  Clear completed
                </button>
              )}
            </footer>
          )}
        </section>
      </div>
    );
  },
});

const EditField = create<{
  value: string;
  onInput: (value: string) => void;
  onCancel: () => void;
  onCommit: () => void;
}>({
  capture(el: HTMLInputElement | null) {
    this._el = el;
  },
  onMount() {
    const el = this._el as HTMLInputElement | undefined;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  },
  render() {
    return (
      <input
        className="edit"
        value={this.props.value}
        ref={this.capture}
        onInput={(e: InputEvent) => this.props.onInput((e.target as HTMLInputElement).value)}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Escape") this.props.onCancel();
          if (e.key === "Enter") this.props.onCommit();
        }}
        onBlur={() => this.props.onCommit()}
      />
    );
  },
});
