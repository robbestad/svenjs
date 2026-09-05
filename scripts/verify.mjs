import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(title, command, args) {
  console.log(`\n:: ${title}`);
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("test", "pnpm", ["test"]);
run("build", "pnpm", ["build"]);
run("typecheck", "pnpm", ["typecheck"]);
run("check:dist", "pnpm", ["--filter", "svenjs", "check:dist"]);
run("size", "pnpm", ["--filter", "svenjs", "size"]);
run("check:pack", "pnpm", ["--filter", "svenjs", "check:pack"]);
