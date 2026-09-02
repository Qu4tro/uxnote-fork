const { test, expect } = require('@playwright/test');

test('the widget mounts on the demo page without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(page.locator('.wn-annot-panel')).toBeAttached();
  expect(errors).toEqual([]);
});

test('an annotation card offers a capture button', async ({ page }) => {
  await page.addInitScript(() => {
    const annotation = {
      id: 'capturebutton',
      type: 'element',
      comment: 'The hero title runs too long on a narrow screen.',
      author: 'Smoke test',
      priority: 'medium',
      snippet: 'Notes that stay where you took them',
      pageUrl: window.location.href,
      pageKey: `${window.location.origin}${window.location.pathname}`,
      createdAt: 1,
      status: 'active',
      target: { css: '#hero-title', xpath: '', tag: 'h1' },
      rect: { x: 0, y: 0, w: 320, h: 48 }
    };
    localStorage.setItem(`uxnote:site:${location.protocol}//${location.host}`, JSON.stringify([annotation]));
  });
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-item .wn-annot-shot-btn')).toBeVisible();
});
