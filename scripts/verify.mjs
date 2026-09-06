import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(title, command, args, env = {}) {
  console.log(`\n:: ${title}`);
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", env: { ...process.env, ...env } });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("versions", "node", ["scripts/check-versions.mjs"]);
run("test", "pnpm", ["test"]);
run("build", "pnpm", ["build"]);
run("typecheck", "pnpm", ["typecheck"]);
run("check:dist", "pnpm", ["--filter", "svenjs", "check:dist"]);
run("size", "pnpm", ["--filter", "svenjs", "size"]);
run("check:pack", "pnpm", ["--filter", "svenjs", "check:pack"]);

run("e2e", "pnpm", ["test:e2e"], { SVENJS_E2E_PREBUILT: "1" });
