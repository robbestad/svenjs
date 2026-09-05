import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

test("ships a crawlable deterministic Mission Control page", async ({ page, request }) => {
  const response = await request.get("/demo/mission-control/");
  expect(response.ok()).toBeTruthy();
  const html = await response.text();

  expect(html).toContain("<title>Mission Control — SvenJS 3</title>");
  const socialImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  expect(new URL(socialImage!).pathname).toBe("/mission-control-og.png");
  expect(html).toContain('property="og:image:alt" content="SvenJS Mission Control dashboard with telemetry graphs, fleet metrics, and selected asset state"');
  const socialImageResponse = await request.get(new URL(socialImage!).pathname);
  expect(socialImageResponse.ok()).toBeTruthy();
  expect(socialImageResponse.headers()["content-type"]).toContain("image/png");
  expect(html).toContain("data-mission-control");
  expect(html).toContain('data-mission-theme="night"');
  expect(html).toContain('data-running="false"');
  expect(html).toContain('aria-label="Fleet telemetry"');
  expect(html).toContain('[data-mission-theme="paper"]');
  expect(html).not.toContain("&quot;paper&quot;");
  expect(html.match(/data-unit-id="SV-/g)).toHaveLength(100);
  expect(html).toContain('data-unit-id="SV-001"');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  expect(new URL(canonical!).pathname).toBe("/demo/mission-control/");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${canonical}</loc>`);

  await page.goto("/demo/mission-control/");
  await expect(page.locator("[data-mission-control]")).toHaveCount(1);
  await expect(page.locator("[data-unit-id]")).toHaveCount(100);
  await expect(page.locator("[data-mission-tick]")).toHaveAttribute("data-mission-tick", "0");
});

test("streams, graphs, sorts, filters, and cleans up coherently", async ({ page }) => {
  await page.goto("/demo/mission-control/");
  const tick = page.locator("[data-mission-tick]");
  const chart = page.locator(".mission-chart-line");
  const initialPoints = await chart.getAttribute("points");
  const detailChart = page.locator(".mission-mini-chart polyline");
  const initialDetailPoints = await detailChart.getAttribute("points");
  const tracked = page.locator('[data-unit-id="SV-024"]');
  await tracked.evaluate((node) => ((window as any).__trackedMissionRow = node));

  await page.getByRole("button", { name: "Acknowledge" }).first().click();
  await expect(page.locator('.mission-alert button[aria-disabled="true"]').first()).toBeFocused();
  await expect(detailChart).toHaveAttribute("points", initialDetailPoints!);
  await page.getByRole("button", { name: "Close details" }).click();
  await expect(page.getByRole("button", { name: "Inspect SV-024" })).toBeFocused();
  await expect(page.locator(".mission-announcement")).toHaveText("Asset details closed.");
  await page.getByRole("button", { name: "Inspect SV-024" }).click();
  await expect(page.locator(".mission-announcement")).toHaveText("Details opened for SV-024.");

  await page.getByRole("button", { name: "Start stream" }).click();
  await expect(page.locator("[data-mission-control]")).toHaveAttribute("data-running", "true");
  await expect.poll(async () => Number(await tick.getAttribute("data-mission-tick"))).toBeGreaterThan(2);
  await expect.poll(() => chart.getAttribute("points")).not.toBe(initialPoints);

  await page.getByRole("button", { name: "Signal", exact: true }).click();
  await page.getByRole("button", { name: "Callsign" }).click();
  await expect.poll(() => page.evaluate(() =>
    (window as any).__trackedMissionRow === document.querySelector('[data-unit-id="SV-024"]'),
  )).toBe(true);

  await page.getByRole("button", { name: "Pause stream" }).click();
  const pausedAt = await tick.getAttribute("data-mission-tick");
  await page.waitForTimeout(400);
  await expect(tick).toHaveAttribute("data-mission-tick", pausedAt!);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(tick).toHaveAttribute("data-mission-tick", "0");
  await expect(detailChart).toHaveAttribute("points", initialDetailPoints!);

  const filter = page.getByLabel("Filter callsign or sector");
  await filter.fill("SV-042");
  await expect(page.locator("[data-unit-id]")).toHaveCount(1);
  await page.getByRole("button", { name: "Inspect SV-042" }).click();
  await expect(page.getByRole("heading", { name: "SV-042" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "SV-042" })).toHaveCount(0);
  await expect(page.getByText("No asset selected")).toBeVisible();
});

test("supports shortcuts and persists console preferences", async ({ page }) => {
  await page.goto("/demo/mission-control/");
  const root = page.locator("[data-mission-control]");

  await page.getByRole("button", { name: "Paper console" }).click();
  await expect(root).toHaveAttribute("data-mission-theme", "paper");
  expect(await page.evaluate(() => localStorage.getItem("svenjs-mission-theme"))).toBe("paper");

  await page.reload();
  await expect(root).toHaveAttribute("data-mission-theme", "paper");
  await page.keyboard.press("Alt+k");
  await expect(page.getByLabel("Filter callsign or sector")).toBeFocused();
  await page.getByLabel("Filter callsign or sector").blur();
  await page.keyboard.press("Alt+s");
  await expect(root).toHaveAttribute("data-running", "true");
  await page.keyboard.press("Alt+s");
  await expect(root).toHaveAttribute("data-running", "false");
});

test("downloads a genuinely offline one-file Mission Control", async ({ page }, testInfo) => {
  await page.goto("/play/?example=mission");
  await expect(page.getByLabel("Example")).toHaveValue("mission");
  const preview = page.frameLocator(".play-preview");
  await expect(preview.locator("[data-mission-control]")).toBeVisible({ timeout: 20_000 });
  await expect(preview.locator("[data-unit-id]")).toHaveCount(100);

  await page.getByRole("button", { name: "Copy share link" }).click();
  await expect(page).toHaveURL(/#example=mission$/);
  expect(page.url().length).toBeLessThan(200);
  await page.reload();
  await expect(page.getByLabel("Example")).toHaveValue("mission");
  await expect(preview.locator("[data-mission-control]")).toBeVisible({ timeout: 20_000 });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .html" }).click();
  const download = await downloadPromise;
  const destination = testInfo.outputPath("svenjs-mission-control.html");
  await download.saveAs(destination);
  const artifact = await readFile(destination, "utf8");

  expect(artifact).toContain("<title>SvenJS Mission Control</title>");
  expect(artifact).toContain("function createMissionControl");
  expect(artifact).toContain(".mission-console");
  expect(artifact).toContain("globalThis.Svenjs");
  expect(artifact).not.toMatch(/<script[^>]+src=/i);
  expect(artifact).not.toMatch(/<link[^>]+stylesheet/i);

  const offline = await page.context().newPage();
  const remoteRequests: string[] = [];
  offline.on("request", (request) => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
  });
  await offline.goto(pathToFileURL(destination).href);
  await expect(offline.locator("[data-mission-control]")).toBeVisible();
  await offline.getByRole("button", { name: "Start stream" }).click();
  await expect.poll(async () => Number(await offline.locator("[data-mission-tick]").getAttribute("data-mission-tick"))).toBeGreaterThan(1);
  expect(remoteRequests).toEqual([]);
});

test("round-trips an edited built-in example through the share hash", async ({ page }) => {
  await page.goto("/play/?example=click");
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("Control+End");
  await page.keyboard.insertText("\n// shared edit marker");
  await expect(editor).toContainText("shared edit marker");

  await page.getByRole("button", { name: "Copy share link" }).click();
  await expect(page).toHaveURL(/#example=click&code=/);
  expect(page.url().length).toBeLessThan(2_000);
  await page.reload();

  await expect(page.getByLabel("Example")).toHaveValue("click");
  await expect(page.locator(".cm-content")).toContainText("shared edit marker");
});
