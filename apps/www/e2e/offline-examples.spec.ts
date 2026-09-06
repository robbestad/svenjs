import { expect, test, type Page } from "@playwright/test";
import { checkOfflineExport } from "./offline-export";

const examples: { id: string; name: string; verify: (page: Page) => Promise<void> }[] = [
  {
    id: "click", name: "Click",
    async verify(page) {
      await expect(page.getByRole("heading", { name: "The Click App" })).toBeVisible();
      await expect(page.getByText("You have clicked 0 times.")).toBeVisible();
      await page.getByRole("button", { name: "Why not click me?" }).click();
      await expect(page.getByText("You have clicked 1 times.")).toBeVisible();
    },
  },
  {
    id: "todo", name: "Todo",
    async verify(page) {
      await expect(page.getByText("2 left", { exact: true })).toBeVisible();
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Test offline export");
      await input.press("Enter");
      await expect(input).toHaveValue("");
      await expect(page.getByText("3 left", { exact: true })).toBeVisible();
      const added = page.getByRole("listitem").filter({ hasText: "Test offline export" });
      await added.getByRole("checkbox").check();
      await expect(added).toHaveClass("done");
      await expect(page.getByText("2 left", { exact: true })).toBeVisible();
      await added.getByRole("button", { name: "×" }).click();
      await expect(added).toHaveCount(0);
      await expect(page.getByRole("listitem")).toHaveCount(2);
    },
  },
  {
    id: "compose", name: "Composition",
    async verify(page) {
      await expect(page.getByText("We meet again.", { exact: true })).toBeVisible();
      await expect(page.getByText("Hello from a child component.", { exact: true })).toBeVisible();
      const counter = page.getByText(/^Child counter: \d+$/);
      const initial = Number((await counter.textContent())!.split(": ")[1]);
      await expect.poll(async () => Number((await counter.textContent())!.split(": ")[1])).toBeGreaterThan(initial);
    },
  },
  {
    id: "blank", name: "Blank",
    async verify(page) {
      await expect(page.getByRole("heading", { name: "Hello, Sven", exact: true })).toBeVisible();
      await page.getByRole("textbox").fill("Offline");
      await expect(page.getByRole("heading", { name: "Hello, Offline", exact: true })).toBeVisible();
    },
  },
];

for (const example of examples) {
  test(`downloads a genuinely offline one-file ${example.name}`, async ({ page }, testInfo) => {
    await page.goto(`/play/?example=${example.id}`);
    await expect(page.getByLabel("Example")).toHaveValue(example.id);
    await expect(page.frameLocator(".play-preview").locator("#app > div")).toBeVisible();
    await checkOfflineExport(page, testInfo, async (offline, artifact) => {
      expect(artifact).toContain("<title>SvenJS</title>");
      await example.verify(offline);
    });
  });
}
