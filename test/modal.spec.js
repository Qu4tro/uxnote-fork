const { test, expect } = require('@playwright/test');

// Annotating inside a host page's modal dialog. The dialog carries
// data-uxnote-allow, which is what invites the widget in; the comment prompt
// is a dialog of its own, opened modally on top of it, so it stays live while
// everything under it is inert.

const FIXTURE = '/test/fixtures/modal-allow.html';
const CARD = '.wn-annot-comment-dialog[open]';

const store = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem(`uxnote:site:${location.origin}`) || '[]'));

const modeButton = (page, mode) => page.locator(`.wn-annot-toolbar button[data-mode="${mode}"]`);

// A mouse drag across the first line, which is the desktop gesture the widget
// reads a selection from.
async function selectLine(page, selector) {
  const box = await page.locator(selector).boundingBox();
  await page.mouse.move(box.x + 4, box.y + 8);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 8, box.y + 8, { steps: 8 });
  await page.mouse.up();
}

async function saveComment(page, text) {
  const card = page.locator(CARD);
  await expect(card).toBeVisible();
  await card.locator('textarea').fill(text);
  await card.locator('.wn-annot-pill.primary').click();
  await expect(card).toHaveCount(0);
}

test('a highlight taken inside the modal is kept inside it', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'text').click();
  await page.locator('#open-thread').click();
  // The tip that says what the mode does is a body-level fixed node; the top
  // layer is the only place it can paint above the host's dialog.
  await expect(page.locator('.wn-annot-tip.show')).toBeVisible();
  expect(await page.locator('.wn-annot-tip').evaluate((el) => el.matches(':popover-open'))).toBe(true);
  await selectLine(page, '#inside');
  await saveComment(page, 'the wording of the thread');

  expect((await store(page)).map((one) => one.comment)).toEqual(['the wording of the thread']);
  await expect(page.locator('#thread .uxnote-textmark')).toHaveCount(1);
});

test('the comment card is the topmost dialog and takes the pointer', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'text').click();
  await page.locator('#open-thread').click();
  await selectLine(page, '#inside');
  const card = page.locator(CARD);
  await expect(card).toBeVisible();
  expect(await card.evaluate((el) => el.matches(':modal'))).toBe(true);
  // The host's dialog is what the card would otherwise sit under.
  expect(
    await page.evaluate(() => {
      const area = document.querySelector('.wn-annot-comment-dialog textarea').getBoundingClientRect();
      const hit = document.elementFromPoint(area.x + area.width / 2, area.y + area.height / 2);
      return hit && hit.tagName.toLowerCase();
    })
  ).toBe('textarea');
});

test('a second note inside the modal asks for no trip to the toolbar', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'text').click();
  await page.locator('#open-thread').click();
  await selectLine(page, '#inside');
  await saveComment(page, 'the first pass');
  // The toolbar is under the host's dialog and cannot be pressed, so the mode
  // it would arm has to still be on.
  await expect(modeButton(page, 'text')).toHaveClass(/active/);
  await selectLine(page, '#inside-again');
  await saveComment(page, 'the second pass');
  expect((await store(page)).map((one) => one.comment)).toEqual(['the first pass', 'the second pass']);
});

test('escape inside the modal leaves the mode and keeps the thread open', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'text').click();
  await page.locator('#open-thread').click();
  await selectLine(page, '#inside');
  await expect(page.locator(CARD)).toBeVisible();
  // One press dismisses the card. The host's dialog is inert under it and
  // hears nothing.
  await page.keyboard.press('Escape');
  await expect(page.locator(CARD)).toHaveCount(0);
  expect(await page.evaluate(() => document.getElementById('thread').open)).toBe(true);
  await expect(modeButton(page, 'text')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(modeButton(page, 'text')).not.toHaveClass(/active/);
  expect(await store(page)).toEqual([]);
});

test('the element outline is drawn over the modal and the pin is kept inside it', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'element').click();
  // Element mode takes every click on the page, the trigger of the thread
  // included, so the page opens it here.
  await page.evaluate(() => document.getElementById('thread').showModal());
  await page.locator('#inside').hover();
  const outline = page.locator('.wn-annot-outline');
  await expect(outline).toHaveCSS('display', 'block');
  // The top layer is the only place a fixed node paints above an open modal.
  expect(await outline.evaluate((el) => el.matches(':popover-open'))).toBe(true);
  // The box is the paragraph's, give or take the dashed border a page that
  // sets no box-sizing of its own puts outside it.
  const drawn = await outline.boundingBox();
  const target = await page.locator('#inside').boundingBox();
  expect(Math.abs(drawn.width - target.width)).toBeLessThanOrEqual(4);
  expect(Math.abs(drawn.height - target.height)).toBeLessThanOrEqual(4);

  await page.locator('#inside-button').click();
  await saveComment(page, 'the reply control');
  expect((await store(page)).map((one) => one.type)).toEqual(['element']);
  await expect(page.locator('#thread .wn-annot-marker')).toHaveCount(1);
});

test('outside a modal the card is still parked against the toolbar', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'text').click();
  await selectLine(page, '#outside');
  const card = page.locator(CARD);
  await expect(card).toBeVisible();
  const box = await card.boundingBox();
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();
  expect(Math.round(box.x + box.width / 2)).toBe(Math.round(bar.x + bar.width / 2));
  expect(box.y + box.height).toBeLessThanOrEqual(bar.y + 0.5);
  await page.keyboard.press('Escape');
  await expect(card).toHaveCount(0);
  await expect(page.locator('#outside')).toBeVisible();
  expect(await store(page)).toEqual([]);
});

test('the page under an open card is not a target', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'element').click();
  await page.locator('#outside').click();
  await expect(page.locator(CARD)).toBeVisible();
  // The card is a dialog over the whole page. A press that lands past it
  // picks nothing and previews nothing.
  await page.mouse.click(40, 300);
  await expect(page.locator('.wn-annot-outline')).toHaveCSS('display', 'none');
  await saveComment(page, 'the paragraph on the page');
  expect(await store(page)).toHaveLength(1);
});

test('a dialog the page says nothing about is still refused', async ({ page }) => {
  await page.goto(FIXTURE);
  await modeButton(page, 'text').click();
  await page.locator('#open-menu').click();
  await selectLine(page, '#inside-menu');
  const toast = page.locator('.wn-annot-toast.show');
  await expect(toast).toHaveText('This area is a popup or overlay. It cannot be annotated.');
  expect(await toast.evaluate((el) => el.matches(':popover-open'))).toBe(true);
  await expect(page.locator(CARD)).toHaveCount(0);
  expect(await store(page)).toEqual([]);
});
