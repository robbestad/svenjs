import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const src = `export { Fragment, jsx, jsxDEV, jsxs } from "./svenjs.js";\n`;
writeFileSync(resolve(dist, "jsx-runtime.js"), src);
writeFileSync(resolve(dist, "jsx-dev-runtime.js"), src);
