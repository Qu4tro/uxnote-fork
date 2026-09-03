const { test, expect } = require('@playwright/test');

test('the widget mounts on the demo page without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(page.locator('.wn-annot-panel')).toBeAttached();
  expect(errors).toEqual([]);
});

test('the toolbar offers a capture button', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar button[data-mode="screenshot"]')).toBeVisible();
});

test('the capture leaves the interface on the page', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  await expect(page.locator('.wn-shot-overlay')).toBeVisible();
  await page.mouse.move(200, 300);
  await page.mouse.down();
  await page.mouse.move(420, 440);
  await page.mouse.up();
  // The picture comes off a copy of the page, so releasing the drag takes
  // nothing away from the reviewer and the comment prompt opens on the spot.
  expect(await page.locator('.wn-annot-toolbar').isVisible()).toBe(true);
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
});
