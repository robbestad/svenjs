import { execSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = mkdtempSync(join(tmpdir(), "svenjs-pack-"));

try {
  execSync(`pnpm pack --pack-destination ${JSON.stringify(dir)}`, { cwd: pkg, stdio: "inherit" });
  const tgz = readdirSync(dir).find((name) => name.endsWith(".tgz"));
  if (!tgz) throw new Error("svenjs pack did not emit a tarball");

  const consumer = join(dir, "consumer");
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({ name: "svenjs-pack-consumer", type: "module", private: true }, null, 2),
  );
  writeFileSync(
    join(consumer, "index.mjs"),
    `import Svenjs, { create, html, renderToString, version } from "svenjs";

if (typeof version !== "string" || !version) throw new Error("missing version");
if (typeof document !== "undefined") throw new Error("pack check must run without a DOM");

const App = create({
  initialState: { n: 1 },
  render() {
    return html\`<p>\${this.state.n}</p>\`;
  },
});

const out = renderToString(App);
if (out !== "<p>1</p>") throw new Error("unexpected SSR: " + out);
if (Svenjs.version !== version) throw new Error("default export version mismatch");
console.log("pack-ok", version);
`,
  );

  execSync(`npm install --omit=dev ${JSON.stringify(join(dir, tgz))}`, { cwd: consumer, stdio: "inherit" });
  execSync("node index.mjs", { cwd: consumer, stdio: "inherit" });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
