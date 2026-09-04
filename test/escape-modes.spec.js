const { test, expect } = require('@playwright/test');

const modeButton = (page, mode) => page.locator(`.wn-annot-toolbar button[data-mode="${mode}"]`);

// The widget binds its own handler at init, so a probe added afterwards on the
// same target runs second and sees whether the key was taken.
async function watchEscape(page) {
  await page.evaluate(() => {
    window.__escapeTaken = null;
    window.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') window.__escapeTaken = evt.defaultPrevented;
    });
  });
}

test('escape leaves the element mode', async ({ page }) => {
  await page.goto('/');
  await modeButton(page, 'element').click();
  await expect(modeButton(page, 'element')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(modeButton(page, 'element')).not.toHaveClass(/active/);
});

test('escape leaves the text mode', async ({ page }) => {
  await page.goto('/');
  await modeButton(page, 'text').click();
  await expect(modeButton(page, 'text')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(modeButton(page, 'text')).not.toHaveClass(/active/);
  await expect(page.locator('.wn-annot-tip.show')).toHaveCount(0);
});

test('escape leaves the region mode and takes its overlay with it', async ({ page }) => {
  await page.goto('/');
  const camera = modeButton(page, 'screenshot');
  test.skip((await camera.count()) === 0, 'this page offers no camera');
  await camera.click();
  await expect(page.locator('.wn-shot-overlay')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.wn-shot-overlay')).toHaveCount(0);
  await expect(camera).not.toHaveClass(/active/);
});

test('escape cancels the comment card and the mode stands', async ({ page }) => {
  await page.goto('/');
  await modeButton(page, 'element').click();
  await page.locator('#copy').click();
  await expect(page.locator('.wn-annot-modal textarea')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.wn-annot-modal textarea')).toBeHidden();
  // One press dismisses one thing. The mode is what a second press is for.
  await expect(modeButton(page, 'element')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(modeButton(page, 'element')).not.toHaveClass(/active/);
});

test('escape is the page owner key while no mode is on', async ({ page }) => {
  await page.goto('/');
  await watchEscape(page);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => window.__escapeTaken)).toBe(false);
});
