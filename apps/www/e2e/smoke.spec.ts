import { expect, test } from "@playwright/test";

test("home click demo increments", async ({ page }) => {
  await page.goto("/");
  const btn = page.getByRole("button", { name: "Why not click me?" });
  await expect(page.locator(".click-stats")).toContainText("0");
  await btn.click();
  await expect(page.locator(".click-stats")).toContainText("1");
});

test("todo add and complete", async ({ page }) => {
  await page.goto("/demo/todo");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Ship SvenJS 3");
  await input.press("Enter");
  await expect(page.getByText("Ship SvenJS 3")).toBeVisible();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page.getByText("Ship SvenJS 3")).toBeVisible();
});

test("docs render", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByRole("heading", { name: "A page in one file" })).toBeVisible();
  await page.getByRole("link", { name: "State" }).click();
  await expect(page.getByRole("heading", { name: "State" })).toBeVisible();
});

test("playground compiles the click example", async ({ page }) => {
  await page.goto("/play");
  const frame = page.frameLocator(".play-preview");
  await expect(frame.getByRole("button", { name: "Why not click me?" })).toBeVisible({ timeout: 15_000 });
  await frame.getByRole("button", { name: "Why not click me?" }).click();
  await expect(frame.getByText("You have clicked 1 times.")).toBeVisible();
});
