import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { expect, type Page, type TestInfo } from "@playwright/test";

export async function checkOfflineExport(
  page: Page,
  testInfo: TestInfo,
  verifyExample: (offline: Page, artifact: string) => Promise<void>,
) {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .html" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("svenjs-app.html");
  const destination = testInfo.outputPath("svenjs-app.html");
  await download.saveAs(destination);
  const artifact = await readFile(destination, "utf8");
  const { version } = JSON.parse(await readFile(new URL("../../../packages/svenjs/package.json", import.meta.url), "utf8"));
  const previewCss = await readFile(new URL("../public/preview.css", import.meta.url), "utf8");
  expect(artifact).toContain("globalThis.Svenjs");
  expect(artifact).toContain(`<style>${previewCss}</style>`);
  expect(artifact).not.toMatch(/<script[^>]+src=/i);
  expect(artifact).not.toMatch(/<link[^>]+stylesheet/i);

  // Block remote traffic in a fresh context. WebKit's offline mode also blocks file:// navigation.
  const context = await page.context().browser()!.newContext();
  try {
    const offline = await context.newPage();
    const remoteRequests: string[] = [];
    const errors: string[] = [];
    context.on("request", request => {
      if (/^(https?|wss?):/.test(request.url())) remoteRequests.push(request.url());
    });
    await context.route(/^https?:/, route => route.abort("internetdisconnected"));
    await context.routeWebSocket(/.*/, socket => {
      remoteRequests.push(socket.url());
      socket.close();
    });
    offline.on("websocket", socket => remoteRequests.push(socket.url()));
    offline.on("pageerror", error => errors.push(error.message));
    await offline.goto(pathToFileURL(destination).href);
    expect(await offline.evaluate(() => (globalThis as any).Svenjs.version)).toBe(version);

    const stamp = offline.locator("body > .svenjs-credit");
    await stamp.scrollIntoViewIfNeeded();
    await expect(stamp).toBeVisible();
    await expect(stamp).toBeInViewport();
    await expect(stamp).toHaveAttribute("href", "https://svenjs.xyz/");
    await expect(stamp).toHaveCSS("display", "inline-flex");
    await expect(stamp).toHaveCSS("opacity", "1");
    await expect(stamp).not.toHaveAttribute("aria-hidden", "true");
    await expect(stamp.locator(".svenjs-credit-kicker")).toHaveText("UI built with");
    await expect(stamp.locator(".svenjs-credit-kicker")).toHaveCSS("text-transform", "uppercase");
    await expect(stamp.locator(".svenjs-credit-name")).toHaveText(`SvenJS ${version}`);
    await expect(stamp.locator(".svenjs-credit-name")).toHaveCSS("font-weight", "600");
    const mark = stamp.locator("svg.svenjs-mark");
    await expect(mark).toBeVisible();
    await expect(mark).toHaveAttribute("viewBox", "0 0 326 326");
    await expect(mark).toHaveCSS("width", "36px");
    await expect(mark).toHaveCSS("height", "36px");
    await expect(mark).toHaveCSS("border-radius", "8px");
    await expect(mark.locator("polygon")).toHaveCount(4);

    await verifyExample(offline, artifact);
    expect(errors).toEqual([]);
    expect(remoteRequests).toEqual([]);
  } finally {
    await context.close();
  }
}
