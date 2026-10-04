import { expect, test } from "@playwright/test";

const corpus = (page: import("@playwright/test").Page) =>
  page.locator("[data-testid=corpus]").first();

test("moving the hero years slider changes the corpus", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const before = await corpus(page).innerText();
  await page.getByRole("slider", { name: "For", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(corpus(page)).not.toHaveText(before);
});

test("waitlist rejects a bad email and accepts a good one", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Email address");
  await input.fill("nope");
  await page.getByRole("button", { name: "Join waitlist", exact: true }).last().click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await input.fill("a@b.com");
  await page.getByRole("button", { name: "Join waitlist", exact: true }).last().click();
  await expect(page.getByText(/on the list/)).toBeVisible();
});

test("no horizontal scroll at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(375);
});

test("calculator tabs respond to ArrowRight", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Goal" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "EMI" })).toHaveAttribute("aria-selected", "true");
});

test("content is visible without motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3101/");
  const heading = page.getByRole("heading", { name: /Questions, answered plainly/ });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveCSS("opacity", "1");
  await ctx.close();
});

test("typing above the maximum shows the clamped value", async ({ page }) => {
  await page.goto("/");
  const field = page.getByLabel("Monthly investment value").first();
  await field.fill("200000");
  await expect(field).toHaveValue("1,00,000");
});

test("mobile menu keeps Close reachable by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  const close = page.getByRole("button", { name: "Close" });
  await page.keyboard.press("Shift+Tab"); // from the first link back to the toggle
  await expect(close).toBeFocused();
});

test("hero chart redraws when the years change", async ({ page }) => {
  await page.goto("/");
  const chart = page.getByRole("img", { name: /Growth over/ });
  await expect(chart).toHaveAttribute("aria-label", /10 years/);
  await page.getByLabel("Years value").fill("20");
  await expect(chart).toHaveAttribute("aria-label", /20 years/);
});

test("unknown pages show the 404 page", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Go to the homepage" })).toBeVisible();
});
