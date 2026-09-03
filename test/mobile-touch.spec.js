const { test, expect } = require('@playwright/test');

// These run on the four phone projects of playwright.config.js, with touch
// emulation. Every fault named here was measured on this tree before the
// branch: a region drag that framed nothing and left the reviewer inside an
// overlay whose only way out named the Escape key; a highlight committed on
// the first release, with one word of the selection the reviewer was still
// making; and an element outline that appeared only once the tap had already
// committed to it.

const TOUCH_MINIMUM = 44;
const SETTLE_MS = 400;

function store(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem(`uxnote:site:${location.origin}`) || '[]'));
}

function viewport(page) {
  return page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }));
}

// A point inside the element that no part of the widget covers. The toolbar
// sits in thumb reach at the bottom of the screen and the centre of a tall
// paragraph can land under it.
async function tapInside(page, selector) {
  const point = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    for (let dy = 4; dy < rect.height; dy += 6) {
      const p = { x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + dy) };
      const hit = document.elementFromPoint(p.x, p.y);
      if (hit && (hit === el || el.contains(hit))) return p;
    }
    return null;
  }, selector);
  expect(point, `nothing of ${selector} is reachable`).not.toBeNull();
  await page.touchscreen.tap(point.x, point.y);
}

async function tapControl(page, locator) {
  const box = await locator.boundingBox();
  await page.touchscreen.tap(Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2));
}

// Select the first `count` words of the hero paragraph, the way a long press
// and a drag of the handles would.
function selectWords(page, count) {
  return page.evaluate((n) => {
    const node = document.getElementById('hero-copy').firstChild;
    const text = node.textContent;
    let end = text.length;
    let seen = 0;
    for (let i = 0; i < text.length; i += 1) {
      if (/\s/.test(text[i])) {
        seen += 1;
        if (seen === n) {
          end = i;
          break;
        }
      }
    }
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, end);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return selection.toString();
  }, count);
}

// The release. A handle drag ends in one of these, and so does a tap.
function release(page) {
  return page.evaluate(() => document.dispatchEvent(new TouchEvent('touchend', { bubbles: true })));
}

async function enterMode(page, mode) {
  await page.locator(`.wn-annot-toolbar button[data-mode="${mode}"]`).click();
  await expect(page.locator(`.wn-annot-toolbar button[data-mode="${mode}"]`)).toHaveClass(/active/);
}

async function saveComment(page, text) {
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
  await page.locator('.wn-annot-modal textarea').fill(text);
  await page.locator('.wn-annot-modal .wn-annot-pill.primary').click();
}

test('a release mid-selection no longer commits the highlight', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'text');
  const first = await selectWords(page, 1);
  expect(first.trim().split(/\s+/)).toHaveLength(1);
  await release(page);
  await page.waitForTimeout(150);
  // Measured on this tree before the branch: promptOpenedOnFirstTouchend was
  // true, and it cleared the selection the reviewer was still extending.
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeHidden();
  expect(await page.evaluate(() => window.getSelection().toString())).toBe(first);
  expect(await store(page)).toEqual([]);
});

test('a multi-word selection survives to the prompt', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'text');
  await selectWords(page, 1);
  await release(page);
  // The handles are dragged out, and each release along the way is another
  // touchend the old path would have committed on.
  const wanted = await selectWords(page, 6);
  await release(page);
  expect(wanted.trim().split(/\s+/).length).toBeGreaterThan(4);

  const bar = page.locator('.wn-annot-selection-bar');
  await expect(bar).toBeVisible({ timeout: SETTLE_MS + 2000 });
  await tapControl(page, bar.locator('button'));
  await saveComment(page, 'a note on the whole phrase');

  await expect.poll(async () => (await store(page)).length).toBe(1);
  const [annotation] = await store(page);
  expect(annotation.type).toBe('text');
  expect(annotation.snippet).toBe(wanted.trim());
  expect(annotation.target.quote).toBe(wanted.trim());
  await expect(page.locator('.uxnote-textmark')).toHaveCount(1);
});

test('the add-note bar is a thumb-sized target clear of the toolbar', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'text');
  await selectWords(page, 6);
  const bar = page.locator('.wn-annot-selection-bar');
  await expect(bar).toBeVisible({ timeout: SETTLE_MS + 2000 });
  const view = await viewport(page);
  const box = await bar.boundingBox();
  const toolbar = await page.locator('.wn-annot-toolbar').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(view.width);
  // Clear of the bar it stands on, and on the screen.
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(toolbar.y);
  const button = await bar.locator('button').boundingBox();
  expect(button.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  expect(button.width).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  // The mode tip wants the same strip of screen; the bar is the instruction.
  await expect(page.locator('.wn-annot-tip.show')).toHaveCount(0);
});

test('losing the selection takes the bar back down', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'text');
  await selectWords(page, 6);
  await expect(page.locator('.wn-annot-selection-bar')).toBeVisible({ timeout: SETTLE_MS + 2000 });
  await page.evaluate(() => window.getSelection().removeAllRanges());
  await expect(page.locator('.wn-annot-selection-bar')).toBeHidden({ timeout: SETTLE_MS + 2000 });
  await expect(page.locator('.wn-annot-tip.show')).toHaveCount(1);
});

test('the element preview precedes the commit', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  const outline = page.locator('.wn-annot-outline');
  // Measured before this branch: outlineBeforeTap "none", outlineAfterTap
  // "block", and the comment prompt already open behind it.
  await expect(outline).toHaveCSS('display', 'none');
  await tapInside(page, '#hero-copy');
  await expect(outline).toHaveCSS('display', 'block');
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeHidden();
  await expect(page.locator('.wn-annot-pick-name')).toHaveText('p#hero-copy');
  expect(await store(page)).toEqual([]);
  const outlined = await outline.boundingBox();
  const target = await page.locator('#hero-copy').boundingBox();
  expect(Math.round(outlined.width)).toBe(Math.round(target.width));
  expect(Math.round(outlined.height)).toBe(Math.round(target.height));
});

test('the picker walks the ancestor chain and stops at the page', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  await tapInside(page, '#hero-copy');
  const name = page.locator('.wn-annot-pick-name');
  const wider = page.locator('.wn-annot-pick-wider');
  const narrower = page.locator('.wn-annot-pick-narrower');
  await expect(narrower).toBeDisabled();
  await expect(wider).toBeEnabled();

  const started = await page.locator('.wn-annot-outline').boundingBox();
  await tapControl(page, wider);
  await expect(name).not.toHaveText('p#hero-copy');
  const climbed = await page.locator('.wn-annot-outline').boundingBox();
  // Wider is also the answer to a fat finger: start anywhere inside the block
  // and climb to the block.
  expect(climbed.height).toBeGreaterThan(started.height);
  await expect(narrower).toBeEnabled();

  await tapControl(page, narrower);
  await expect(name).toHaveText('p#hero-copy');
  await expect(narrower).toBeDisabled();

  for (let step = 0; step < 12 && !(await wider.isDisabled()); step += 1) {
    await tapControl(page, wider);
  }
  await expect(name).toHaveText('body');
  await expect(wider).toBeDisabled();

  const view = await viewport(page);
  const toolbar = await page.locator('.wn-annot-toolbar').boundingBox();
  const box = await page.locator('.wn-annot-pick-bar').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(view.width);
  expect(box.y + box.height).toBeLessThanOrEqual(toolbar.y);
  for (const control of [wider, narrower, page.locator('.wn-annot-pick-pin')]) {
    const size = await control.boundingBox();
    expect(size.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
    expect(size.width).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  }
});

test('previewing a clipped element does not widen the page', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() => document.documentElement.scrollWidth);
  await enterMode(page, 'element');
  await page.locator('table').scrollIntoViewIfNeeded();
  await tapInside(page, 'table');
  const wider = page.locator('.wn-annot-pick-wider');
  const name = page.locator('.wn-annot-pick-name');
  for (let step = 0; step < 6 && (await name.textContent()) !== 'table'; step += 1) {
    await tapControl(page, wider);
  }
  await expect(name).toHaveText('table');
  // The pricing table sits in a scroller narrower than itself. An outline of
  // its raw box runs past what the page shows, and a box in the page's flow
  // that does not fit the page widens it -- which moves every fixed element
  // on it, the toolbar included.
  const view = await viewport(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(before);
  const outlined = await page.locator('.wn-annot-outline').boundingBox();
  expect(outlined.x + outlined.width).toBeLessThanOrEqual(view.width + 0.5);
  const toolbar = await page.locator('.wn-annot-toolbar').boundingBox();
  expect(toolbar.x + toolbar.width).toBeLessThanOrEqual(view.width);
});

test('pinning commits the element the preview named', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  await tapInside(page, '#hero-copy');
  await tapControl(page, page.locator('.wn-annot-pick-wider'));
  const previewed = await page.locator('.wn-annot-outline').boundingBox();
  await tapControl(page, page.locator('.wn-annot-pick-pin'));
  await saveComment(page, 'the block, not the paragraph');

  await expect.poll(async () => (await store(page)).length).toBe(1);
  const [annotation] = await store(page);
  expect(annotation.type).toBe('element');
  expect(annotation.rect.w).toBeCloseTo(previewed.width, 0);
  expect(annotation.rect.h).toBeCloseTo(previewed.height, 0);
  // The picker goes down with the commit and does not outlive it.
  await expect(page.locator('.wn-annot-pick-bar')).toBeHidden();
});

test('leaving a mode takes its bar with it', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  await tapInside(page, '#hero-copy');
  await expect(page.locator('.wn-annot-pick-bar')).toBeVisible();
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await expect(page.locator('.wn-annot-pick-bar')).toBeHidden();

  await enterMode(page, 'text');
  await selectWords(page, 6);
  await expect(page.locator('.wn-annot-selection-bar')).toBeVisible({ timeout: SETTLE_MS + 2000 });
  await page.locator('.wn-annot-toolbar button[data-mode="text"]').click();
  await expect(page.locator('.wn-annot-selection-bar')).toBeHidden();
});

test('the camera takes the visible viewport in one tap', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(100);
  const framed = await page.evaluate(() => ({
    x: window.scrollX,
    y: window.scrollY,
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
  }));
  await tapControl(page, page.locator('.wn-annot-toolbar button[data-mode="screenshot"]'));

  // The drag overlay read mouse events only: a touch drag framed nothing, the
  // prompt never opened, and the overlay stayed up with `Escape stops.` on it.
  await expect(page.locator('.wn-shot-overlay')).toHaveCount(0);
  await expect(page.locator('.wn-shot-hint')).toHaveCount(0);
  await saveComment(page, 'this view');

  await expect.poll(async () => (await store(page)).length, { timeout: 30000 }).toBe(1);
  const [annotation] = await store(page);
  expect(annotation.type).toBe('screenshot');
  expect(annotation.rect).toEqual(framed);
  expect(annotation.screenshot.dataUrl.startsWith('data:image/png')).toBe(true);
  expect(annotation.screenshot.w).toBeGreaterThan(0);
  expect(annotation.screenshot.h).toBeGreaterThan(0);
  // The rect is what the marker and the frame are drawn from.
  await expect(page.locator('.wn-annot-marker')).toHaveCount(1);
});

test('the bars follow the toolbar to the top of the screen', async ({ page }) => {
  await page.goto('/?toolbar-top=true');
  await expect(page.locator('.wn-annot-toolbar.wn-pos-top')).toBeVisible();
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  await tapInside(page, '#hero-copy');
  const bar = await page.locator('.wn-annot-pick-bar').boundingBox();
  const toolbar = await page.locator('.wn-annot-toolbar').boundingBox();
  const view = await viewport(page);
  expect(bar.y).toBeGreaterThanOrEqual(toolbar.y + toolbar.height);
  expect(bar.y + bar.height).toBeLessThanOrEqual(view.height);
});

test('a bar up when the form factor changes follows the toolbar', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  await tapInside(page, '#hero-copy');
  await expect(page.locator('.wn-annot-pick-bar')).toBeVisible();
  // A rotation crosses the compact boundary and rebuilds the bar the picker
  // stands on, so the picker has to be placed again rather than left where the
  // old bar was.
  const view = await viewport(page);
  await page.setViewportSize({ width: view.height, height: view.width });
  await page.waitForTimeout(300);
  const bar = await page.locator('.wn-annot-pick-bar').boundingBox();
  const toolbar = await page.locator('.wn-annot-toolbar').boundingBox();
  const turned = await viewport(page);
  expect(bar.x).toBeGreaterThanOrEqual(0);
  expect(bar.x + bar.width).toBeLessThanOrEqual(turned.width);
  expect(bar.y + bar.height).toBeLessThanOrEqual(toolbar.y);
  // The outline is pinned rather than redrawn by the next move, so a reflow
  // has to place it again. Left on the old geometry it widened the document
  // and carried the toolbar past the edge of the screen with it.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(turned.width);
  expect(errors).toEqual([]);
});

test('the widget raises no page error while capturing on touch', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await enterMode(page, 'text');
  await selectWords(page, 6);
  await expect(page.locator('.wn-annot-selection-bar')).toBeVisible({ timeout: SETTLE_MS + 2000 });
  await page.locator('.wn-annot-toolbar button[data-mode="text"]').click();
  await enterMode(page, 'element');
  await page.locator('#hero-copy').scrollIntoViewIfNeeded();
  await tapInside(page, '#hero-copy');
  await tapControl(page, page.locator('.wn-annot-pick-wider'));
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  expect(errors).toEqual([]);
});
