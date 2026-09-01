const { test, expect } = require('@playwright/test');

test('the widget mounts on the demo page without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(page.locator('.wn-annot-panel')).toBeAttached();
  expect(errors).toEqual([]);
});
