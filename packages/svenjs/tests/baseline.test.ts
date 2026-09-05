import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runBaselineScenario } from "./baseline-scenario";
import { countDomOps } from "./dom-ops";

const here = dirname(fileURLToPath(import.meta.url));
const recorded = JSON.parse(readFileSync(resolve(here, "baseline/3.2.1.json"), "utf8")) as {
  version: string;
  size: { "svenjs.iife.js": { gzip: number } };
  iifeGzipBudget: number;
  domOps: Record<string, number>;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("DOM-op baseline", () => {
  it("matches the recorded mount/update/reorder/remove scenario", () => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const ops = countDomOps(() => runBaselineScenario(root));
    expect(ops).toEqual(recorded.domOps);
  });
});
