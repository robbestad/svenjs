import { expect, test } from "@playwright/test";

test("home click demo increments", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#app > .shell")).toHaveCount(1);
  const btn = page.getByRole("button", { name: "Why not click me?" });
  await expect(page.locator(".click-stats")).toContainText("0");
  await btn.click();
  await expect(page.locator(".click-stats")).toContainText("1");
});

test("todo add and complete", async ({ page }) => {
  await page.goto("/demo/todo/");
  const input = page.getByPlaceholder("What needs to be done?");
  await input.fill("Ship SvenJS 3");
  await input.press("Enter");
  await expect(page.getByText("Ship SvenJS 3")).toBeVisible();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page.getByText("Ship SvenJS 3")).toBeVisible();
});

test("docs render", async ({ page }) => {
  await page.goto("/docs/");
  await expect(page.getByRole("heading", { name: "A page in one file" })).toBeVisible();
  await page.getByRole("link", { name: "State" }).click();
  await expect(page.getByRole("heading", { name: "State" })).toBeVisible();
  await expect(page).toHaveTitle("State — SvenJS 3");
  await expect(page).toHaveURL(/\/docs\/state\/$/);
});

test("query state hydrates without stale server attributes", async ({ page }) => {
  await page.goto("/demo/todo/?filter=completed");
  const all = page.getByRole("link", { name: "All" });
  const completed = page.getByRole("link", { name: "Completed" });
  await expect(completed).toHaveAttribute("aria-current", "page");
  await expect(completed).toHaveClass(/selected/);
  await expect(all).not.toHaveAttribute("aria-current", "page");
  await expect(all).not.toHaveClass(/selected/);
  await expect(page.locator(".todo-list > li")).toHaveCount(0);
});

test("static same-origin links bypass the app router", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/examples/hello.html"]').click();
  await expect(page).toHaveURL(/\/examples\/hello\.html$/);
  await expect(page.getByRole("button", { name: "Why not click me?" })).toBeVisible();
});

test("known routes ship crawlable HTML and sharing metadata", async ({ request }) => {
  const response = await request.get("/docs/state/");
  expect(response.ok()).toBeTruthy();
  const html = await response.text();

  expect(html).toContain("<h1>State</h1>");
  expect(html).toContain("<title>State — SvenJS 3</title>");
  expect(html).toContain('<meta property="og:title" content="State — SvenJS 3"');
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  expect(canonical).toBeTruthy();
  expect(new URL(canonical!).pathname).toBe("/docs/state/");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${canonical}</loc>`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("/sitemap.xml");
});

test("playground compiles the click example", async ({ page }) => {
  await page.goto("/play/");
  const frame = page.frameLocator(".play-preview");
  await expect(frame.getByRole("button", { name: "Why not click me?" })).toBeVisible({ timeout: 15_000 });
  await frame.getByRole("button", { name: "Why not click me?" }).click();
  await expect(frame.getByText("You have clicked 1 times.")).toBeVisible();
});
