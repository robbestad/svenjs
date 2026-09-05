import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const { version } = JSON.parse(read("packages/svenjs/package.json"));
const exported = read("packages/svenjs/src/index.ts").match(/export const version = "([^"]+)"/)?.[1];
if (exported !== version) throw Error(`Runtime version ${exported} differs from package ${version}`);
const tag = process.env.GITHUB_REF_TYPE === "tag" ? process.env.GITHUB_REF_NAME : undefined;
if (tag && tag.replace(/^v/, "") !== version) throw Error(`Release tag ${tag} differs from package ${version}`);
if (!read("CHANGELOG.md").includes(`## [${version}]`)) throw Error("Missing version in changelog");
for (const file of ["AGENTS.md", "README.md", "packages/svenjs/README.md", "apps/www/src/lib/one-file.ts", "examples/hello.html", "apps/www/docs/one-file.md", "apps/www/docs/install.md"]) {
  for (const match of read(file).matchAll(/svenjs@(\d+\.\d+\.\d+)/g)) {
    if (match[1] !== version) throw Error(`Stale package version in ${file}: ${match[1]}`);
  }
}
if (!read("AGENTS.md").includes(`SvenJS **${version}**`)) throw Error("Stale AGENTS release");
console.log(`versions-ok ${version}${tag ? ` (${tag})` : ""}`);
