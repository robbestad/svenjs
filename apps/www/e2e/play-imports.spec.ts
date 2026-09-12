import { expect, test } from "@playwright/test";
import { checkOfflineExport } from "./offline-export";

const source = `import Sven, { create, render, version } from "svenjs";
import * as api from "svenjs";
import "svenjs";

export const require = 1;
export const exports = 2;
export const module = 3;
const names = { require, exports, module };

const App = create({
  initialState: { clicks: 0, loaded: false },
  async onMount() {
    const runtime = await import("svenjs");
    this.setState({ ...this.state, loaded: runtime.default.create === Sven.create && api.version === version });
  },
  render() {
    return <button onClick={() => this.setState({ ...this.state, clicks: this.state.clicks + 1 })}>
      {this.state.loaded ? "ready" : "loading"} {names.require + names.exports + names.module} {this.state.clicks}
    </button>;
  },
});
export default App;
render(<App />, document.getElementById("app"));`;

test("imports and exports coexist with CommonJS names in preview and offline HTML", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/play/?example=click");
  await page.locator(".cm-content").fill(source);
  const preview = page.frameLocator(".play-preview");
  await expect(preview.getByRole("button", { name: "ready 6 0" })).toBeVisible();
  await preview.getByRole("button").click();
  await expect(preview.getByRole("button", { name: "ready 6 1" })).toBeVisible();
  await expect(page.locator(".play-error:not([role])")).toHaveCount(0);
  await checkOfflineExport(page, testInfo, async offline => {
    await expect(offline.getByRole("button", { name: "ready 6 0" })).toBeVisible();
    await offline.getByRole("button").click();
    await expect(offline.getByRole("button", { name: "ready 6 1" })).toBeVisible();
  });
  expect(errors).toEqual([]);
});
