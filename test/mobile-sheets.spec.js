const { test, expect } = require('@playwright/test');

// These run on the four phone projects of playwright.config.js. The survey
// measured the panel as a full-bleed layer with no close control of its own,
// under the toolbar that painted over its bottom 50px; a comment card at 55%
// opacity that the page text read straight through; and an import dialog that
// stood 109% of a landscape viewport tall and could neither scroll nor close.

const TOUCH_MINIMUM = 44;
const SHEET_ACTION_MINIMUM = 48;
// A box measured on a device pixel ratio comes back a hair under the CSS
// value it was given: 47.99998 for a 48px pill, on the landscape phone and
// only on some machines. Half a pixel of slack, the same as the placement
// checks use.
const SLACK = 0.5;

function viewport(page) {
  return page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }));
}

// One annotation, written straight to storage: what is under test here is the
// panel and the sheets, not how an annotation is made on touch.
async function seedAnnotation(page, extra = {}) {
  await page.evaluate((over) => {
    localStorage.setItem(
      `uxnote:site:${location.origin}`,
      JSON.stringify([
        {
          id: 'sheet-probe',
          type: 'element',
          comment: 'a note to read in the list',
          color: '#4e9cf6',
          createdAt: new Date().toISOString(),
          pageUrl: location.href,
          pageKey: location.origin + location.pathname,
          target: { xpath: '/html/body/header', selector: 'header' },
          ...over
        }
      ])
    );
  }, extra);
  await page.reload();
  await page.locator('.wn-annot-toolbar').waitFor();
}

async function openPanel(page) {
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  await expect(page.locator('.wn-annot-panel')).toBeVisible();
}

test('the notes panel is a sheet on the bottom edge, not the whole screen', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  const view = await viewport(page);
  const panel = page.locator('.wn-annot-panel');
  const box = await panel.boundingBox();
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.width)).toBe(view.width);
  // 85% at most, so the page it is about is still on the screen behind it.
  expect(box.height).toBeLessThanOrEqual(view.height * 0.85 + 1);
  // Rounded at the top, square against the edge it is anchored to.
  await expect(panel).toHaveCSS('border-top-left-radius', '18px');
  await expect(panel).toHaveCSS('border-bottom-left-radius', '0px');
});

test('the toolbar no longer paints over the panel', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  const panel = await page.locator('.wn-annot-panel').boundingBox();
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();
  // Measured before this branch: the bar covered the bottom 74px of the panel,
  // which is the panel's footer and, until now, its only way out.
  expect(panel.y + panel.height).toBeLessThanOrEqual(bar.y + 0.5);
});

test('the panel is dismissable without the toolbar', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  const close = page.locator('.wn-annot-panel .wn-annot-sheet-close');
  await expect(close).toBeVisible();
  const box = await close.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(TOUCH_MINIMUM - SLACK);
  expect(box.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM - SLACK);
  await close.click();
  await expect(page.locator('.wn-annot-panel')).toBeHidden();
});

test('a drag down the handle dismisses the sheet', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  const handle = await page.locator('.wn-annot-panel .wn-annot-sheet-handle').boundingBox();
  const from = { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  // Past a third of the sheet's own height, which is what the shell asks for.
  await page.mouse.move(from.x, from.y + 40, { steps: 4 });
  await page.mouse.move(from.x, from.y + 260, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('.wn-annot-panel')).toBeHidden();
});

test('a short drag springs the sheet back', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  const handle = await page.locator('.wn-annot-panel .wn-annot-sheet-handle').boundingBox();
  const from = { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x, from.y + 18, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator('.wn-annot-panel')).toBeVisible();
  await expect(page.locator('.wn-annot-panel')).toHaveCSS('transform', 'none');
});

test('the page is held still under an open sheet, and let go after', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  const start = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  // Nothing locked the page before, so a flick that ran off the end of the
  // list carried straight on into the host page underneath.
  expect(await page.evaluate(() => window.scrollY)).toBe(start);
  await page.locator('.wn-annot-panel .wn-annot-sheet-close').click();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(start);
});

test('the list scrolls inside the sheet rather than the sheet growing', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const many = Array.from({ length: 40 }, (unused, i) => ({
      id: `bulk-${i}`,
      type: 'element',
      comment: `note number ${i}`,
      color: '#4e9cf6',
      createdAt: new Date().toISOString(),
      pageUrl: location.href,
      pageKey: location.origin + location.pathname,
      target: { xpath: '/html/body/header', selector: 'header' }
    }));
    localStorage.setItem(`uxnote:site:${location.origin}`, JSON.stringify(many));
  });
  await page.reload();
  await openPanel(page);
  const view = await viewport(page);
  const panel = await page.locator('.wn-annot-panel').boundingBox();
  expect(panel.height).toBeLessThanOrEqual(view.height * 0.85 + 1);
  expect(panel.y).toBeGreaterThanOrEqual(0);
  const list = await page.locator('.wn-annot-list').evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight
  }));
  expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
});

test('tapping a note closes the sheet and moves the page to it', async ({ page }) => {
  await page.goto('/');
  await seedAnnotation(page, { target: { xpath: '/html/body/section[3]', selector: '#pricing' } });
  await openPanel(page);
  await page.locator('.wn-annot-item').first().click();
  await expect(page.locator('.wn-annot-panel')).toBeHidden();
  // The lock hides the root's overflow, which leaves programmatic scrolling
  // alone; if it did not, this tap would close the sheet onto the same view.
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('a bar docked to the top still leaves the sheet its room', async ({ page }) => {
  await page.goto('/');
  // The position toggle is not on the compact bar, but a saved top from a
  // wider window still applies, and the sheet has to clear the bar either way.
  await page.evaluate(() => localStorage.setItem('wn-toolbar-pos', 'top'));
  await page.reload();
  await expect(page.locator('.wn-annot-toolbar')).toHaveClass(/wn-pos-top/);
  await openPanel(page);
  const view = await viewport(page);
  const panel = await page.locator('.wn-annot-panel').boundingBox();
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();
  expect(panel.y).toBeGreaterThanOrEqual(bar.y + bar.height - 0.5);
  expect(panel.y + panel.height).toBeLessThanOrEqual(view.height + 0.5);
});

test('hiding the widget lets the page go, sheet or no sheet', async ({ page }) => {
  await page.goto('/');
  await openPanel(page);
  // Every surface goes off the screen with a display rule when the widget is
  // hidden. A page held still for a sheet nobody can see cannot be scrolled.
  await page.locator('.wn-annot-visibility-btn').click();
  const start = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(start);
});

test('the comment prompt is an opaque sheet with thumb-sized actions', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await page.locator('.card').first().click();
  const card = page.locator('.wn-annot-comment-card');
  await expect(card).toBeVisible();
  // Measured at 0.55 on every device before this branch, because the rule that
  // brought it back was :hover and there is no hover here.
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('transform', 'none');
  await expect(page.locator('.wn-annot-comment-card textarea')).toHaveCSS('font-size', '16px');
  const view = await viewport(page);
  const box = await card.boundingBox();
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.width)).toBe(view.width);
  for (const pill of await page.locator('.wn-annot-comment-card .wn-annot-pill').all()) {
    const rect = await pill.boundingBox();
    expect(rect.height).toBeGreaterThanOrEqual(SHEET_ACTION_MINIMUM - SLACK);
  }
});

test('a confirm dialog is the same sheet', async ({ page }) => {
  await page.goto('/');
  await seedAnnotation(page);
  await openPanel(page);
  await page.locator('.wn-annot-delete-all').click();
  const dialog = page.locator('.wn-annot-modal-backdrop.show .wn-annot-modal');
  await expect(dialog).toBeVisible();
  const view = await viewport(page);
  const box = await dialog.boundingBox();
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.width)).toBe(view.width);
  await expect(dialog).toHaveCSS('border-bottom-left-radius', '0px');
  await expect(page.locator('.wn-annot-modal-backdrop.show .wn-annot-sheet-grip')).toBeVisible();
  await page.locator('.wn-annot-modal-backdrop.show .wn-annot-sheet-close').click();
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
  // Dismissing is not confirming.
  await expect(page.locator('.wn-annot-item')).toHaveCount(1);
});

test('no sheet runs past the viewport or under the toolbar', async ({ page }) => {
  await page.goto('/');
  await seedAnnotation(page);
  const view = await viewport(page);
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();

  const fits = async (locator, name) => {
    const box = await locator.boundingBox();
    expect(box.x, `${name} starts off screen`).toBeGreaterThanOrEqual(-0.5);
    expect(box.y, `${name} starts above the viewport`).toBeGreaterThanOrEqual(-0.5);
    expect(box.x + box.width, `${name} runs past the right edge`).toBeLessThanOrEqual(view.width + 0.5);
    expect(box.y + box.height, `${name} runs past the bottom edge`).toBeLessThanOrEqual(view.height + 0.5);
    expect(box.y + box.height, `${name} runs under the toolbar`).toBeLessThanOrEqual(bar.y + 0.5);
  };

  await openPanel(page);
  await fits(page.locator('.wn-annot-panel'), 'the notes panel');
  await page.locator('.wn-annot-delete-all').click();
  await fits(page.locator('.wn-annot-modal-backdrop.show .wn-annot-modal'), 'the confirm dialog');
  await page.locator('.wn-annot-modal-backdrop.show .wn-annot-sheet-close').click();
  await page.locator('.wn-annot-panel .wn-annot-sheet-close').click();
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await page.locator('.card').first().click();
  await fits(page.locator('.wn-annot-comment-card'), 'the comment prompt');
});

test('export is one action and opens no modal', async ({ page }) => {
  await page.goto('/');
  await seedAnnotation(page);
  await openPanel(page);
  const download = page.waitForEvent('download');
  await page.locator('.wn-annot-panel-export').click();
  // Nothing to share with here, so the one action is the download the desktop
  // has always used. Picking between a file, a mail and a cancel is a dialog's
  // worth of a screen this size, and the mail arm puts the whole document in a
  // URL.
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
});

test('export hands the file to the share sheet where there is one', async ({ page }) => {
  await page.addInitScript(() => {
    window.__shared = null;
    navigator.canShare = (data) => Boolean(data && data.files && data.files.length);
    navigator.share = async (data) => {
      window.__shared = data.files.map((file) => ({ name: file.name, type: file.type, size: file.size }));
    };
  });
  await page.goto('/');
  await seedAnnotation(page);
  await openPanel(page);
  await page.locator('.wn-annot-panel-export').click();
  await expect.poll(() => page.evaluate(() => window.__shared)).not.toBeNull();
  const shared = await page.evaluate(() => window.__shared);
  expect(shared).toHaveLength(1);
  expect(shared[0].type).toBe('application/json');
  expect(shared[0].name).toMatch(/\.json$/);
  expect(shared[0].size).toBeGreaterThan(0);
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
});

test('the import modal is absent, and the landscape failure cannot recur', async ({ page }) => {
  await page.goto('/');
  await seedAnnotation(page);
  await openPanel(page);
  await page.locator('.wn-annot-delete-all').click();
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
  // The import dialog carried min-width: 760px and neither it nor its backdrop
  // scrolled. At 852x393 it measured 760x429 with its title cut off above the
  // viewport, and there was no way out of it. It is not built here at all, and
  // no surface that is built asks for more room than the screen has.
  await expect(page.locator('.wn-annot-import-modal')).toHaveCount(0);
  await expect(page.locator('.wn-annot-toolbar button[data-action="import"]')).toHaveCount(0);
  const view = await viewport(page);
  const widths = await page.locator('.wn-annot-modal').evaluateAll((els) =>
    els.map((el) => ({
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
      minWidth: getComputedStyle(el).minWidth
    }))
  );
  expect(widths.length).toBeGreaterThan(0);
  for (const entry of widths) {
    expect(entry.width).toBeLessThanOrEqual(view.width + 0.5);
    expect(entry.height).toBeLessThanOrEqual(view.height + 0.5);
    expect(entry.minWidth).toBe('0px');
  }
});

test('the screenshot lightbox carries a close button', async ({ page }) => {
  await page.goto('/');
  const pixel =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  await seedAnnotation(page, { type: 'screenshot', rect: { x: 0, y: 0, w: 80, h: 60 }, screenshot: { dataUrl: pixel } });
  await openPanel(page);
  await page.locator('.wn-annot-shot img').click();
  const box = page.locator('.wn-shot-lightbox');
  await expect(box).toBeVisible();
  const close = page.locator('.wn-shot-lightbox-close');
  await expect(close).toBeVisible();
  const rect = await close.boundingBox();
  // Escape was the only deliberate way out, and a phone has no Escape.
  expect(rect.width).toBeGreaterThanOrEqual(TOUCH_MINIMUM - SLACK);
  expect(rect.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM - SLACK);
  await close.click();
  await expect(box).toHaveCount(0);
});

test('the sheet surfaces follow the dark theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await openPanel(page);
  // The native controls inside a surface -- the search field's clear button --
  // render light on dark unless the surface names its scheme.
  await expect(page.locator('.wn-annot-panel')).toHaveCSS('color-scheme', 'dark');
  await page.locator('.wn-annot-panel .wn-annot-sheet-close').click();
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await page.locator('.card').first().click();
  await expect(page.locator('.wn-annot-comment-card')).toHaveCSS('color-scheme', 'dark');
});
