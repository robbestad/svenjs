import { expect, test } from "@playwright/test";

test("pending share only changes action status after switching examples", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => new Promise<void>(resolve => { (window as any).finishCopy = resolve; }) } });
  });
  await page.goto("/play/?example=click");
  await page.getByRole("button", { name: "Copy share link" }).click();
  await page.getByLabel("Example").selectOption("todo");
  const input = page.frameLocator(".play-preview").getByPlaceholder("What needs to be done?");
  await expect(input).toBeVisible();
  await page.evaluate(() => (window as any).finishCopy());
  await expect(page.getByRole("button", { name: "Copied link" })).toBeVisible();
  await expect(page.getByLabel("Example")).toHaveValue("todo");
  await expect(input).toBeVisible();
  await expect(page.locator(".cm-content")).toContainText("What needs to be done?");
});

test("clipboard rejection preserves a working preview", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(Error("Clipboard denied")) } });
  });
  await page.goto("/play/?example=click");
  const button = page.frameLocator(".play-preview").getByRole("button", { name: "Why not click me?" });
  await expect(button).toBeVisible();
  await button.click();
  for (const name of ["Copy share link", "Copy HTML"]) {
    await page.getByRole("button", { name }).click();
    await expect(page.getByRole("status")).toHaveText("Clipboard denied");
    await expect(page.frameLocator(".play-preview").getByText("You have clicked 1 times.")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("successful sharing preserves a compiler error and allows recovery", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve() } });
  });
  await page.goto("/play/?example=click");
  const editor = page.locator(".cm-content");
  await editor.fill('import { create } from "svenjs"; const bad = <div>');
  const error = page.locator(".play-error:not([role])");
  await expect(error).toBeVisible();
  const message = await error.textContent();
  await page.getByRole("button", { name: "Copy share link" }).click();
  await expect(page.getByRole("button", { name: "Copied link" })).toBeVisible();
  await expect(error).toHaveText(message!);
  expect(errors).toEqual([]);
  await page.getByLabel("Example").selectOption("todo");
  await expect(error).toHaveCount(0);
  await expect(page.frameLocator(".play-preview").getByPlaceholder("What needs to be done?")).toBeVisible();
});

test("missing Clipboard API reports both actions without unhandled rejection", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: undefined }));
  await page.goto("/play/?example=click");
  for (const name of ["Copy HTML", "Copy share link"]) {
    await page.getByRole("button", { name }).click();
    await expect(page.getByRole("status")).toHaveText("Clipboard is not available.");
  }
  await expect(page.frameLocator(".play-preview").getByRole("button", { name: "Why not click me?" })).toBeVisible();
  expect(errors).toEqual([]);
});
