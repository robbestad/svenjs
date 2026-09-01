import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const files = ["svenjs.js", "svenjs.iife.js"];
let failed = false;
for (const name of files) {
  const file = resolve(dir, "../packages/svenjs/dist", name);
  const raw = readFileSync(file);
  const gz = gzipSync(raw);
  const kb = (n) => (n / 1024).toFixed(2);
  console.log(`${name.padEnd(16)} ${raw.length} bytes raw, ${gz.length} gzip (${kb(gz.length)} kB)`);
}
const iife = gzipSync(readFileSync(resolve(dir, "../packages/svenjs/dist/svenjs.iife.js")));
if (iife.length > 5632) {
  console.warn("IIFE gzip exceeds 5.5 kB target");
  failed = true;
}
if (failed) process.exitCode = 1;
