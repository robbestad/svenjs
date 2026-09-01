export const CDN = "https://unpkg.com/svenjs@3";

export const HELLO_JS = `const { create, render, html } = Svenjs;

const App = create({
  initialState: { clicks: 0 },
  render() {
    return html\`
      <div class="demo-card">
        <h1>The Click App</h1>
        <button onClick=\${() => this.setState({ clicks: this.state.clicks + 1 })}>
          Why not click me?
        </button>
        <p>You have clicked \${this.state.clicks} times.</p>
      </div>
    \`;
  },
});

render(App, document.getElementById("app"));
`;

export const TODO_JS = `const { create, render, html } = Svenjs;

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
    return html\`
      <div class="todo-app">
        <h1>todos</h1>
        <input
          type="text"
          placeholder="What needs to be done?"
          value=\${this.state.draft}
          onInput=\${(e) => this.setState({ ...this.state, draft: e.target.value })}
          onKeyDown=\${(e) => {
            if (e.key !== "Enter" || !this.state.draft.trim()) return;
            const items = this.state.items.concat({
              id: Date.now(),
              text: this.state.draft.trim(),
              done: false,
            });
            this.setState({ ...this.state, items, draft: "" });
          }}
        />
        <ul class="todo-list">
          \${this.state.items.map(
            (todo) => html\`
              <li key=\${todo.id} class=\${todo.done ? "done" : ""}>
                <input
                  type="checkbox"
                  checked=\${todo.done}
                  onChange=\${() => {
                    const items = this.state.items.map((t) =>
                      t.id === todo.id ? { ...t, done: !t.done } : t,
                    );
                    this.setState({ ...this.state, items });
                  }}
                />
                <label>\${todo.text}</label>
                <button
                  class="destroy"
                  onClick=\${() =>
                    this.setState({
                      ...this.state,
                      items: this.state.items.filter((t) => t.id !== todo.id),
                    })}
                >
                  ×
                </button>
              </li>
            \`,
          )}
        </ul>
        <p>\${remaining} left</p>
      </div>
    \`;
  },
});

render(App, document.getElementById("app"));
`;

export const COMPOSE_JS = `const { create, render, html } = Svenjs;

const Welcome = create({
  render() {
    return html\`<div>\${this.props.greeting ?? "Hello from a child component."}</div>\`;
  },
});

const Counter = create({
  initialState: { n: 0 },
  onMount() {
    this._id = setInterval(() => this.setState({ n: this.state.n + 1 }), 1000);
  },
  onDestroy() {
    clearInterval(this._id);
  },
  render() {
    return html\`<div>Child counter: \${this.state.n}</div>\`;
  },
});

const App = create({
  render() {
    return html\`
      <div class="compose-grid">
        <\${Welcome} greeting="We meet again." />
        <\${Welcome} />
        <\${Counter} />
      </div>
    \`;
  },
});

render(App, document.getElementById("app"));
`;

export const BLANK_JS = `const { create, render, html } = Svenjs;

const App = create({
  initialState: { name: "Sven" },
  render() {
    return html\`
      <div class="demo-card">
        <h1>Hello, \${this.state.name}</h1>
        <input
          type="text"
          value=\${this.state.name}
          onInput=\${(e) => this.setState({ name: e.target.value })}
        />
      </div>
    \`;
  },
});

render(App, document.getElementById("app"));
`;

const PREVIEW_CSS = `body{font:16px/1.5 system-ui,sans-serif;margin:1.25rem;background:#141210;color:#f2ebe3}
button{font:inherit;cursor:pointer;background:#e07a3d;color:#fff;border:0;border-radius:8px;padding:.55rem .95rem}
input[type=text]{font:inherit;background:#1c1915;border:1px solid #3a342c;border-radius:8px;padding:.5rem .7rem;color:inherit}
.demo-card,.todo-app{max-width:32rem}
h1{font-size:1.6rem;margin:0 0 .8rem}
.todo-list{list-style:none;margin:1rem 0;padding:0}
.todo-list li{display:flex;gap:.6rem;align-items:center;padding:.5rem 0;border-bottom:1px solid #3a342c}
.todo-list li.done label{opacity:.6;text-decoration:line-through}
.destroy{margin-left:auto;background:transparent;color:#a3988c}
.compose-grid{display:grid;gap:.75rem}`;

export function wrapHtmlFile(script: string, runtimeSrc: string, inlineRuntime?: string) {
  const safe = script.replace(/<\/script/gi, "<\\/script");
  const runtimeTag = inlineRuntime
    ? `<script>\n${inlineRuntime.replace(/<\/script/gi, "<\\/script")}\n</script>`
    : `<script src="${runtimeSrc}"></script>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SvenJS</title>
  <style>${PREVIEW_CSS}</style>
</head>
<body>
  <div id="app"></div>
  ${runtimeTag}
  <script>
${safe}
  </script>
</body>
</html>
`;
}

export const HELLO_HTML = wrapHtmlFile(HELLO_JS, CDN);
