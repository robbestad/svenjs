import { create, render } from "svenjs";

const App = create({
  initialState: {
    draft: "",
    items: [
      { id: 1, text: "Answer all the mail", done: false },
      { id: 2, text: "Get a cup of coffee", done: false },
    ],
  },
  render() {
    const remaining = this.state.items.filter((t) => !t.done).length;
    return (
      <div className="todo-app">
        <h1>todos</h1>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={this.state.draft}
          onInput={(e) => this.setState({ ...this.state, draft: e.target.value })}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || !this.state.draft.trim()) return;
            const items = this.state.items.concat({
              id: Date.now(),
              text: this.state.draft.trim(),
              done: false,
            });
            this.setState({ ...this.state, items, draft: "" });
          }}
        />
        <ul className="todo-list">
          {this.state.items.map((todo) => (
            <li key={todo.id} className={todo.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => {
                  const items = this.state.items.map((t) =>
                    t.id === todo.id ? { ...t, done: !t.done } : t,
                  );
                  this.setState({ ...this.state, items });
                }}
              />
              <label>{todo.text}</label>
              <button
                className="destroy"
                onClick={() =>
                  this.setState({
                    ...this.state,
                    items: this.state.items.filter((t) => t.id !== todo.id),
                  })
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <p>{remaining} left</p>
      </div>
    );
  },
});

render(App, document.getElementById("app"));
