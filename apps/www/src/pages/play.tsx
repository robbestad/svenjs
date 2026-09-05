import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import LZString from "lz-string";
import { transform } from "sucrase";
import { create } from "svenjs";
import missionControlSource from "../demos/mission-control/mission-control.js?raw";
import {
  BLANK_JS,
  CDN,
  COMPOSE_JS,
  HELLO_JS,
  TODO_JS,
  wrapHtmlFile,
} from "../lib/one-file";

const MISSION_JS = `${missionControlSource.replace(
  "export function createMissionControl",
  "function createMissionControl",
)}\n\nconst App = createMissionControl(Svenjs);\nSvenjs.render(Svenjs.h(App, { standalone: true }), document.getElementById("app"));\n`;

const EXAMPLES: Record<string, string> = {
  mission: MISSION_JS,
  click: HELLO_JS,
  todo: TODO_JS,
  compose: COMPOSE_JS,
  blank: BLANK_JS,
};

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

function toIframeScript(source: string) {
  if (!/from\s+["']svenjs/.test(source)) return source;
  const { code } = transform(source, {
    transforms: ["jsx", "typescript"],
    jsxRuntime: "automatic",
    jsxImportSource: "svenjs",
    production: true,
  });
  return rewriteImports(code);
}

function previewDoc(source: string, error: string) {
  if (error) {
    return `<!DOCTYPE html><html><body style="font:14px/1.4 ui-monospace,monospace;color:#ff8a80;padding:1rem;white-space:pre-wrap">${escapeHtml(error)}</body></html>`;
  }
  const runtime = `${location.origin}/playground-svenjs.js`;
  const safe = toIframeScript(source).replace(/<\/script/gi, "<\\/script");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="${location.origin}/preview.css" />
</head>
<body>
  <div id="app"></div>
  <script>
    window.addEventListener("error", function (event) {
      parent.postMessage({ type: "sven-preview-error", message: String(event.message || event.error || "Preview error") }, "*");
    });
    window.addEventListener("unhandledrejection", function (event) {
      parent.postMessage({ type: "sven-preview-error", message: String(event.reason) }, "*");
    });
  </script>
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
  const requested = params.get("example") ?? "";
  const example = EXAMPLES[requested] ? requested : "shared";
  const packed = params.get("code");
  if (!packed) return EXAMPLES[example] ? { source: EXAMPLES[example], example } : null;
  try {
    const source = LZString.decompressFromEncodedURIComponent(packed);
    return source ? { source, example } : null;
  } catch {
    return null;
  }
}

export const PlayPage = create({
  initialState() {
    if (typeof location === "undefined") {
      return { source: HELLO_JS, example: "click", error: "", copied: "" };
    }
    const shared = readHash();
    const requested = new URLSearchParams(location.search).get("example") ?? "click";
    const example = EXAMPLES[requested] ? requested : "click";
    return {
      source: shared?.source || EXAMPLES[example],
      example: shared?.example ?? example,
      error: "",
      copied: "",
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
      toIframeScript(source);
      this.setState({ ...this.state, source, example, error: "", copied: "" });
    } catch (err) {
      this.setState({
        ...this.state,
        source,
        example,
        error: err instanceof Error ? err.message : String(err),
        copied: "",
      });
    }
  },
  loadExample(name: string) {
    const source = EXAMPLES[name] ?? BLANK_JS;
    this.view?.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: source },
    });
    this.applySource(source, name);
  },
  sourceSnapshot() {
    return this.view ? this.view.state.doc.toString() : this.state.source;
  },
  bindFrame(el: HTMLIFrameElement | null) {
    this._iframe = el;
  },
  onPreviewMessage(event: MessageEvent) {
    if (event.source !== this._iframe?.contentWindow) return;
    const data = event.data;
    if (!data || data.type !== "sven-preview-error") return;
    this.setState({ ...this.state, error: String(data.message ?? "Preview error"), copied: "" });
  },
  onMount() {
    this._onMessage = (event: MessageEvent) => this.onPreviewMessage(event);
    window.addEventListener("message", this._onMessage);
  },
  share() {
    const source = this.sourceSnapshot();
    const example = this.state.example;
    const params = new URLSearchParams({ example });
    if (EXAMPLES[example] !== source) {
      params.set("code", LZString.compressToEncodedURIComponent(source));
    }
    const hash = params.toString();
    const url = `${location.origin}/play/#${hash}`;
    history.replaceState({}, "", `/play/#${hash}`);
    const write = navigator.clipboard?.writeText(url);
    if (!write) {
      this.setState({ ...this.state, source, example, copied: "", error: "Clipboard is not available." });
      return;
    }
    write.then(
      () => this.setState({ ...this.state, source, example, copied: "link", error: "" }),
      () => this.setState({ ...this.state, source, example, copied: "", error: "Could not copy the share link." }),
    );
  },
  async fileHtml() {
    const source = this.sourceSnapshot();
    const res = await fetch(`${location.origin}/playground-svenjs.prod.js`);
    if (!res.ok) throw new Error(`Could not load the SvenJS runtime (${res.status}).`);
    const runtime = await res.text();
    const script = toIframeScript(source);
    const title = this.state.example === "mission" ? "SvenJS Mission Control" : "SvenJS";
    return wrapHtmlFile(script, CDN, runtime, title);
  },
  copyHtml() {
    this.fileHtml().then(
      (html: string) =>
        navigator.clipboard.writeText(html).then(
          () => this.setState({ ...this.state, copied: "html", error: "" }),
          () => this.setState({ ...this.state, copied: "", error: "Could not copy HTML." }),
        ),
      (err: unknown) =>
        this.setState({
          ...this.state,
          copied: "",
          error: err instanceof Error ? err.message : String(err),
        }),
    );
  },
  downloadHtml() {
    this.fileHtml().then(
      (html: string) => {
        const blob = new Blob([html], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "svenjs-app.html";
        a.click();
        URL.revokeObjectURL(a.href);
        this.setState({ ...this.state, copied: "", error: "" });
      },
      (err: unknown) =>
        this.setState({
          ...this.state,
          copied: "",
          error: err instanceof Error ? err.message : String(err),
        }),
    );
  },
  onDestroy() {
    clearTimeout(this._timer);
    if (this._onMessage) window.removeEventListener("message", this._onMessage);
    this.view?.destroy();
  },
  render() {
    return (
      <div className="play">
        <div>
          <h1 className="page-title">Playground</h1>
          <p className="page-lede">
            Edit in the browser. Download a single HTML file — open it locally, no npm.
          </p>
        </div>
        <div className="play-toolbar">
          <label>
            Example{" "}
            <select
              value={EXAMPLES[this.state.example] ? this.state.example : "shared"}
              onChange={(e: Event) => this.loadExample((e.target as HTMLSelectElement).value)}
            >
              {!EXAMPLES[this.state.example] ? <option value="shared">Shared source</option> : null}
              <option value="mission">Mission Control</option>
              <option value="click">Click</option>
              <option value="todo">Todo</option>
              <option value="compose">Composition</option>
              <option value="blank">Blank</option>
            </select>
          </label>
          <button type="button" onClick={() => this.copyHtml()}>
            {this.state.copied === "html" ? "Copied HTML" : "Copy HTML"}
          </button>
          <button type="button" onClick={() => this.downloadHtml()}>
            Download .html
          </button>
          <button type="button" onClick={() => this.share()}>
            {this.state.copied === "link" ? "Copied link" : "Copy share link"}
          </button>
        </div>
        {this.state.error ? <p className="play-error">{this.state.error}</p> : null}
        <div className="play-grid">
          <div className="play-editor" ref={this.attach} />
          <iframe
            className="play-preview"
            title="Playground preview"
            sandbox="allow-scripts"
            ref={this.bindFrame}
            srcdoc={previewDoc(this.state.source, this.state.error)}
          />
        </div>
      </div>
    );
  },
});
