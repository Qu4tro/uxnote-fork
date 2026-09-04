const { test, expect } = require('@playwright/test');

function varsOf(page) {
  return page.evaluate(() => {
    const read = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return {
      text: read('--wn-text-highlight'),
      element: read('--wn-element-highlight'),
      region: read('--wn-shot-frame')
    };
  });
}

test('the three kinds start on three different colours', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  const colors = await varsOf(page);
  expect(colors).toEqual({ text: '#4e9cf6', element: '#8b5cf6', region: '#f59f00' });
  // The point of three defaults is that a marker says which kind it is, so
  // they have to be three and not two.
  expect(new Set(Object.values(colors)).size).toBe(3);
});

test('naming one kind leaves the other two where they are', async ({ page }) => {
  await page.goto('/test/fixtures/highlight-text-only.html');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  const colors = await varsOf(page);
  expect(colors.text).toBe('#e04f5f');
  // This is what changed: the text colour used to become the base and take
  // the element outline and the region frame with it.
  expect(colors.element).toBe('#8b5cf6');
  expect(colors.region).toBe('#f59f00');
});

test('the shortcut still paints all three', async ({ page }) => {
  await page.goto('/test/fixtures/highlight-all-three.html');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  const colors = await varsOf(page);
  expect(colors).toEqual({ text: '#118844', element: '#118844', region: '#118844' });
});
