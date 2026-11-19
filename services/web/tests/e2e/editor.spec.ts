import { expect, test } from "@playwright/test";

const workId = "kunsthaus-1930-rbby";
const catalogPattern = `**/patterns/${workId}.json`;
const marker = "catalog-loaded-by-browser-test";

// Alter the JSON response in the test only. If Svelte actually renders that
// JSON, its unique marker must appear in the SVG instead of just the original.
for (const path of [`./create/${workId}/`, "./kiosk/"]) {
  test(`renders the fetched catalog plan at ${path}`, async ({ page }) => {
    let fetchedCatalog = false;

    await page.route(catalogPattern, async (route) => {
      const response = await route.fetch();
      expect(response.ok()).toBe(true);

      const plan = await response.json();
      expect(Array.isArray(plan.items)).toBe(true);
      expect(plan.items.length).toBeGreaterThan(0);

      fetchedCatalog = true;
      plan.items[0].id = marker;
      await route.fulfill({ response, json: plan });
    });

    await page.goto(path);

    await expect(
      page.locator(`.editor-study__painting svg rect[data-id="${marker}"]`),
    ).toHaveCount(1);
    expect(fetchedCatalog).toBe(true);
  });
}

test("preserves the measured SVG if catalog loading fails", async ({ page }) => {
  await page.route(catalogPattern, async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: "{}",
    });
  });

  await page.goto(`./create/${workId}/`);

  await expect(page.locator(".editor-study__error")).toContainText(
    "No se pudo cargar el catalogo",
  );
  await expect(page.locator(".editor-study__painting svg")).toBeVisible();
});
