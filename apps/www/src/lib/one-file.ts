import { version } from "svenjs";
import previewCss from "../../public/preview.css?raw";

export const CDN = "https://unpkg.com/svenjs@3.2.1";

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

const STAMP = `<a class="svenjs-credit" href="https://svenjs.xyz/" rel="noopener noreferrer">
  <svg class="svenjs-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326 326" width="36" height="36" aria-hidden="true">
    <rect width="326" height="326" rx="72" fill="#312725"/>
    <g fill="#e07a3d" transform="translate(0 4)">
      <polygon points="127,73 258,73 204,130 78,129"/>
      <polygon points="78,129 121,129 172,184 131,184"/>
      <polygon points="154,139 198,139 249,195 205,195"/>
      <polygon points="116,193 249,195 199,250 66,250"/>
    </g>
  </svg>
  <span class="svenjs-credit-copy">
    <span class="svenjs-credit-kicker">UI built with</span>
    <span class="svenjs-credit-name">SvenJS ${version}</span>
  </span>
</a>`;

export function wrapHtmlFile(script: string, runtimeSrc: string, inlineRuntime?: string, title = "SvenJS") {
  const safe = script.replace(/<\/script/gi, "<\\/script");
  const runtimeTag = inlineRuntime
    ? `<script>\n${inlineRuntime.replace(/<\/script/gi, "<\\/script")}\n</script>`
    : `<script src="${runtimeSrc}"></script>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>${previewCss}</style>
</head>
<body>
  <div id="app"></div>
  ${runtimeTag}
  <script>
${safe}
  </script>
  ${STAMP}
</body>
</html>
`;
}

export const HELLO_HTML = wrapHtmlFile(HELLO_JS, CDN);
