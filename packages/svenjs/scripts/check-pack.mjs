import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync, mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { browserContract } from "./browser-contract.mjs";

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = mkdtempSync(join(tmpdir(), "svenjs-pack-"));

try {
  execFileSync("pnpm", ["pack", "--pack-destination", dir], { cwd: pkg, stdio: "inherit" });
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

  execFileSync("npm", ["install", "--omit=dev", join(dir, tgz)], { cwd: consumer, stdio: "inherit" });
  const expectedVersion = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8")).version;
  writeFileSync(join(consumer, "entries.mjs"), `
import { strict as assert } from "node:assert";
import { create, h, renderToString, version } from "svenjs";
import { jsx } from "svenjs/jsx-runtime";
import { jsxDEV } from "svenjs/jsx-dev-runtime";
assert.equal(version, ${JSON.stringify(expectedVersion)});
for (const factory of [h, jsx, jsxDEV]) {
  let frozen;
  const App = create({ initialState: { n: 1 }, render() { frozen = Object.isFrozen(this.state); return factory("p", { children: "ok" }); } });
  assert.equal(renderToString(App), "<p>ok</p>");
  assert.equal(frozen, process.argv[2] === "development");
}
`);
  for (const mode of ["production", "development"]) {
    const flags = mode === "development" ? ["--conditions=development"] : [];
    for (const file of ["index.mjs", "entries.mjs"]) execFileSync(process.execPath, [...flags, file, mode], { cwd: consumer, stdio: "inherit" });
  }
  copyFileSync(join(pkg, "tests/fixtures/nodenext/consumer.tsx"), join(consumer, "consumer.tsx"));
  copyFileSync(join(pkg, "tests/fixtures/types/methods.tsx"), join(consumer, "methods.tsx"));
  for (const mode of ["NodeNext", "Bundler"]) for (const jsx of ["react-jsx", "react-jsxdev"]) {
    writeFileSync(join(consumer, "tsconfig.json"), JSON.stringify({ compilerOptions: {
      target: "ES2022", module: mode === "NodeNext" ? mode : "ESNext", moduleResolution: mode,
      jsx, jsxImportSource: "svenjs", strict: true, noEmit: true, skipLibCheck: false,
      lib: ["ES2022", "DOM"],
    }, files: ["consumer.tsx", "methods.tsx"] }));
    execFileSync(process.execPath, [join(pkg, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"], { cwd: consumer, stdio: "inherit" });
  }
  const require = createRequire(join(pkg, "../../apps/www/package.json"));
  const playwright = require("@playwright/test");
  for (const name of ["chromium", "firefox", "webkit"]) {
    const browser = await playwright[name].launch();
    try {
      for (const development of [false, true]) {
        const page = await browser.newPage();
        await page.addScriptTag({ path: join(consumer, `node_modules/svenjs/dist/svenjs.iife${development ? ".dev" : ""}.js`) });
        const version = await page.evaluate(browserContract, development);
        if (version !== expectedVersion) throw Error("IIFE version mismatch");
        await page.close();
        console.log(`pack-browser-ok ${name} ${development ? "dev" : "prod"}`);
      }
    } finally { await browser.close(); }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
