import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { cpus, platform, arch, release } from "node:os";
import { performance } from "node:perf_hooks";
import { createRequire } from "node:module";
import { Window } from "happy-dom";
// Explicit path guarantees the production artifact, even with development conditions.
import { create, createStore, flushSync, h, html, render, renderToString, unmountRoot, version } from "../dist/svenjs.js";

const options = { warmup: 3, repeats: 10, json: false };
for (const arg of process.argv.slice(2)) {
  if (arg === "--json") options.json = true;
  else if (/^--(warmup|repeats)=\d+$/.test(arg)) {
    const [key, value] = arg.slice(2).split("=");
    options[key] = Number(value);
  } else throw new Error(`Unknown argument: ${arg}. Use --warmup=N --repeats=N --json`);
}
assert(options.warmup >= 0 && options.warmup <= 1000, "warmup must be between 0 and 1000");
assert(options.repeats >= 1 && options.repeats <= 1000, "repeats must be between 1 and 1000");

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
const factories = {
  h(ids, revision, keyed) {
    return h("ul", null, ids.map((id) => h("li", keyed ? { key: id } : null, `${id}:${revision}`)));
  },
  html(ids, revision, keyed) {
    return html`<ul>${ids.map((id) => keyed
      ? html`<li key=${id}>${`${id}:${revision}`}</li>`
      : html`<li>${`${id}:${revision}`}</li>`)}</ul>`;
  },
};
const operations = ["mount", "same-order", "reorder", "insert", "remove", "batched", "unbatched", "store", "ssr"];
const results = [];
const burst = 10;

function trial(factory, count, keyed, operation) {
  const ids = Array.from({ length: count }, (_, i) => i);
  let expectedIds = ids;
  let expectedRevision = 0;
  let instance;
  let renders = 0;
  let output;
  const store = createStore({ state: 0 });
  const App = create({
    initialState: { ids, revision: 0 },
    onMount() {
      instance = this;
      if (operation === "store") this.observe(store);
    },
    render() {
      renders++;
      return factory(this.state.ids, operation === "store" ? store.get() : this.state.revision, keyed);
    },
  });
  const container = document.createElement("div");
  document.body.append(container);
  try {
    // Fixture construction, initial mounting for updates, assertions and teardown
    // are outside the measured interval. VNode construction remains inside it.
    if (operation !== "mount" && operation !== "ssr") render(App, container);
    const originalNodes = [...container.querySelectorAll("li")];
    let run;
    switch (operation) {
      case "mount": run = () => render(App, container); break;
      case "ssr": run = () => { output = renderToString(App); }; break;
      case "same-order":
        expectedRevision = 1;
        run = () => flushSync(() => instance.setState({ ids, revision: 1 }));
        break;
      case "reorder":
        expectedIds = [...ids].reverse();
        run = () => flushSync(() => instance.setState({ ids: expectedIds, revision: 0 }));
        break;
      case "insert":
        expectedIds = [...ids];
        expectedIds.splice(Math.floor(count / 2), 0, ...Array.from({ length: count / 10 }, (_, i) => count + i));
        run = () => flushSync(() => instance.setState({ ids: expectedIds, revision: 0 }));
        break;
      case "remove":
        expectedIds = ids.filter((_, i) => i < count / 2 || i >= count / 2 + count / 10);
        run = () => flushSync(() => instance.setState({ ids: expectedIds, revision: 0 }));
        break;
      case "batched":
        expectedRevision = burst;
        run = () => flushSync(() => {
          for (let i = 1; i <= burst; i++) instance.setState({ ids, revision: i });
        });
        break;
      case "unbatched":
        expectedRevision = burst;
        run = () => {
          for (let i = 1; i <= burst; i++) flushSync(() => instance.setState({ ids, revision: i }));
        };
        break;
      case "store":
        expectedRevision = burst;
        run = () => flushSync(() => {
          for (let i = 1; i <= burst; i++) store.set(i);
        });
        break;
    }
    const start = performance.now();
    run();
    const elapsed = performance.now() - start;
    if (operation === "ssr") {
      assert.equal(output, `<ul>${ids.map((id) => `<li>${id}:0</li>`).join("")}</ul>`);
    } else {
      const nodes = [...container.querySelectorAll("li")];
      assert.deepEqual(nodes.map((node) => node.textContent), expectedIds.map((id) => `${id}:${expectedRevision}`));
      if (keyed && originalNodes.length) {
        const originalById = new Map(ids.map((id, i) => [id, originalNodes[i]]));
        expectedIds.forEach((id, i) => {
          if (originalById.has(id)) assert.equal(nodes[i], originalById.get(id), "keyed nodes must retain identity");
        });
      }
    }
    assert.equal(renders, operation === "mount" || operation === "ssr" ? 1 : operation === "unbatched" ? burst + 1 : 2);
    return elapsed;
  } finally {
    unmountRoot(container);
    container.remove();
  }
}

try {
  for (const count of [100, 1000]) {
    for (const [syntax, factory] of Object.entries(factories)) {
      for (const keyed of [true, false]) {
        for (const operation of operations) {
          // SSR does not reconcile keys, so one case per syntax/size is enough.
          if (operation === "ssr" && !keyed) continue;
          const samples = [];
          for (let i = 0; i < options.warmup + options.repeats; i++) {
            const elapsed = trial(factory, count, keyed, operation);
            if (i >= options.warmup) samples.push(elapsed);
            // Drain any scheduler microtasks before the next independent sample.
            await Promise.resolve();
          }
          const sorted = [...samples].sort((a, b) => a - b);
          const median = sorted.length % 2 ? sorted[Math.floor(sorted.length / 2)]
            : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
          results.push({ count, syntax, keys: operation === "ssr" ? "n/a" : keyed ? "keyed" : "unkeyed", operation,
            medianMs: median, p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1], minMs: sorted[0], samplesMs: samples });
        }
      }
    }
  }
  const require = createRequire(import.meta.url);
  const report = {
    environment: {
      timestamp: new Date().toISOString(), node: process.version, platform: platform(), arch: arch(), os: release(),
      cpu: cpus()[0]?.model ?? "unknown", svenjs: version, happyDom: require("happy-dom/package.json").version,
      artifact: "packages/svenjs/dist/svenjs.js",
      artifactSha256: createHash("sha256").update(readFileSync(new URL("../dist/svenjs.js", import.meta.url))).digest("hex"),
    },
    config: { ...options, sizes: [100, 1000], burst, units: "milliseconds per operation", gc: "automatic; included if it occurs during measurement" },
    results,
  };
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(JSON.stringify({ environment: report.environment, config: report.config }, null, 2));
    console.table(results.map(({ samplesMs, ...row }) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, typeof value === "number" && key !== "count" ? value.toFixed(3) : value]))));
    console.log("Synthetic happy-dom timings; no browser layout/paint. Compare repeated runs on the same idle machine and toolchain. See packages/svenjs/benchmarks/README.md.");
  }
} finally {
  await window.happyDOM.close();
}
