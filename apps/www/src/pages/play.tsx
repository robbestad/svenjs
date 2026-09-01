import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import LZString from "lz-string";
import { transform } from "sucrase";
import { create } from "svenjs";
import blank from "../playground/examples/blank.jsx?raw";
import click from "../playground/examples/click.jsx?raw";
import compose from "../playground/examples/compose.jsx?raw";
import todo from "../playground/examples/todo.jsx?raw";

const EXAMPLES: Record<string, string> = {
  click,
  todo,
  compose,
  blank,
};

function compile(source: string) {
  const { code } = transform(source, {
    transforms: ["jsx", "typescript"],
    jsxRuntime: "automatic",
    jsxImportSource: "svenjs",
    production: true,
  });
  return code;
}

function rewriteImports(code: string) {
  return code.replace(
    /import\s+([\s\S]*?)\s+from\s+["']svenjs(?:\/jsx(?:-dev)?-runtime)?["']\s*;?/g,
    (_, spec) => {
      const trimmed = String(spec).trim();
      if (trimmed.startsWith("{")) {
        const inner = trimmed.slice(1, -1).replace(/\bas\b/g, ":");
        return `const {${inner}} = Svenjs;`;
      }
      return `const ${trimmed} = Svenjs;`;
    },
  );
}

function previewDoc(code: string, error: string) {
  if (error) {
    return `<!DOCTYPE html><html><body style="font:14px/1.4 ui-monospace,monospace;color:#ff8a80;padding:1rem;white-space:pre-wrap">${escapeHtml(error)}</body></html>`;
  }
  const runtime = `${location.origin}/playground-svenjs.js`;
  const safe = rewriteImports(code).replace(/<\/script/gi, "<\\/script");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="${location.origin}/preview.css" />
</head>
<body>
  <div id="app"></div>
  <script src="${runtime}"></script>
  <script>${safe}</script>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function readHash() {
  const hash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
  const params = new URLSearchParams(hash);
  const packed = params.get("code");
  if (!packed) return null;
  try {
    return LZString.decompressFromEncodedURIComponent(packed);
  } catch {
    return null;
  }
}

export const PlayPage = create({
  initialState: {
    source: click,
    example: "click",
    compiled: "",
    error: "",
    copied: false,
  },
  onBeforeMount() {
    const shared = readHash();
    const source = shared || this.state.source;
    let compiled = "";
    let error = "";
    try {
      compiled = compile(source);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
    this.state = {
      source,
      example: shared ? "shared" : "click",
      compiled,
      error,
      copied: false,
    };
  },
  attach(el: HTMLElement | null) {
    if (!el) {
      this.view?.destroy();
      this.view = null;
      return;
    }
    if (this.view) return;
    const self = this;
    this.view = new EditorView({
      doc: this.state.source,
      parent: el,
      extensions: [
        basicSetup,
        javascript({ jsx: true, typescript: true }),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          const source = update.state.doc.toString();
          clearTimeout(self._timer);
          self._timer = setTimeout(() => self.applySource(source, self.state.example), 180);
        }),
      ],
    });
  },
  applySource(source: string, example: string) {
    try {
      const compiled = compile(source);
      this.setState({ ...this.state, source, example, compiled, error: "", copied: false });
    } catch (err) {
      this.setState({
        ...this.state,
        source,
        example,
        error: err instanceof Error ? err.message : String(err),
        copied: false,
      });
    }
  },
  loadExample(name: string) {
    const source = EXAMPLES[name] ?? blank;
    this.view?.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: source },
    });
    this.applySource(source, name);
  },
  share() {
    const packed = LZString.compressToEncodedURIComponent(this.state.source);
    const url = `${location.origin}/play#code=${packed}`;
    history.replaceState({}, "", `/play#code=${packed}`);
    navigator.clipboard?.writeText(url);
    this.setState({ ...this.state, copied: true });
  },
  onDestroy() {
    clearTimeout(this._timer);
    this.view?.destroy();
  },
  render() {
    return (
      <div className="play">
        <div>
          <h1 className="page-title">Playground</h1>
          <p className="page-lede">Edit JSX in the browser. It compiles with Sucrase and runs in a sandboxed iframe against the SvenJS 3 runtime.</p>
        </div>
        <div className="play-toolbar">
          <label>
            Example{" "}
            <select
              value={EXAMPLES[this.state.example] ? this.state.example : "click"}
              onChange={(e: Event) => this.loadExample((e.target as HTMLSelectElement).value)}
            >
              <option value="click">Click</option>
              <option value="todo">Todo</option>
              <option value="compose">Composition</option>
              <option value="blank">Blank</option>
            </select>
          </label>
          <button type="button" onClick={() => this.share()}>
            {this.state.copied ? "Copied link" : "Copy share link"}
          </button>
        </div>
        {this.state.error ? <p className="play-error">{this.state.error}</p> : null}
        <div className="play-grid">
          <div className="play-editor" ref={this.attach} />
          <iframe
            className="play-preview"
            title="Playground preview"
            sandbox="allow-scripts"
            srcdoc={previewDoc(this.state.compiled, this.state.error)}
          />
        </div>
      </div>
    );
  },
});
