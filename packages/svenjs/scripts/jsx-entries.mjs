import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const src = `export { Fragment, jsx, jsxDEV, jsxs } from "./svenjs.js";\n`;
writeFileSync(resolve(dist, "jsx-runtime.js"), src);
writeFileSync(resolve(dist, "jsx-dev-runtime.js"), src);

// TypeScript emits the source's extensionless imports verbatim. They are valid
// with "bundler" resolution, but not in ESM projects using NodeNext/Node16.
// Point declaration imports at the JavaScript files that ship beside them.
const relativeImport = /((?:from\s+|import\s*\()\s*["'])(\.\.?\/[^"']+)(["'])/g;
for (const name of readdirSync(dist)) {
  if (!name.endsWith(".d.ts")) continue;
  const file = resolve(dist, name);
  const declaration = readFileSync(file, "utf8");
  const compatible = declaration.replace(relativeImport, (match, before, specifier, after) => {
    return /\.[cm]?[jt]sx?$/.test(specifier) ? match : `${before}${specifier}.js${after}`;
  });
  if (compatible !== declaration) writeFileSync(file, compatible);
}
