const { test, expect } = require('@playwright/test');

const REFUSAL = 'This area is a popup or overlay. It cannot be annotated.';

const modeButton = (page, mode) => page.locator(`.wn-annot-toolbar button[data-mode="${mode}"]`);
const card = (page) => page.locator('.wn-annot-comment-card textarea');
const isOpen = (page, id) => page.locator(`#${id}`).evaluate((dialog) => dialog.open);

// The interface follows the dialog in on the mutation that opened it, which is
// a microtask later than the click.
async function openThread(page) {
  await page.locator('#open-thread').click();
  await expect(page.locator('#thread #uxnote-root')).toHaveCount(1);
}

async function dragAcross(page, selector) {
  const box = await page.locator(selector).boundingBox();
  // The first line of the box: a paragraph that wraps has more than one, and
  // the middle of the box is the gap between two of them.
  const y = box.y + 6;
  await page.mouse.move(box.x + 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 2, y, { steps: 8 });
  await page.mouse.up();
}

async function writeComment(page, text) {
  await expect(card(page)).toBeVisible();
  await card(page).fill(text);
  await page.locator('.wn-annot-comment-card .wn-annot-pill.primary').click();
  await expect(card(page)).toBeHidden();
}

test('a note written inside the open modal saves, and its mark is drawn in the dialog', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await modeButton(page, 'text').click();
  await dragAcross(page, '#inside');
  await writeComment(page, 'A note from inside the thread');
  await expect(page.locator('#thread .uxnote-textmark')).toHaveCount(1);
  expect(await isOpen(page, 'thread')).toBe(true);
});

test('the toolbar answers inside the modal and pins a control in the dialog', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await modeButton(page, 'element').click();
  await expect(modeButton(page, 'element')).toHaveClass(/active/);
  await page.locator('#reply').click();
  await writeComment(page, 'This control belongs to the thread');
  await expect(page.locator('#reply')).toHaveClass(/uxnote-annotated/);
  await expect(page.locator('#thread .wn-annot-marker')).toHaveCount(1);
});

test('closing the dialog brings the interface back to the page', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await page.locator('#close-thread').click();
  await expect(page.locator('body > #uxnote-root')).toHaveCount(1);
  await modeButton(page, 'text').click();
  await dragAcross(page, '#outside');
  await writeComment(page, 'A note on the page itself');
  await expect(page.locator('#outside .uxnote-textmark')).toHaveCount(1);
});

// A dialog a framework unmounts while it is open takes the interface out of
// the document with it, and there is no close event to read.
test('a dialog taken out of the document leaves the interface on the page', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await page.locator('#thread').evaluate((dialog) => dialog.remove());
  await expect(page.locator('body > #uxnote-root')).toHaveCount(1);
  await modeButton(page, 'text').click();
  await expect(modeButton(page, 'text')).toHaveClass(/active/);
});

test('a note written in the dialog is drawn again when the dialog is opened again', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await modeButton(page, 'text').click();
  await dragAcross(page, '#inside');
  await writeComment(page, 'A note to find again');
  const marked = await page.locator('#thread .uxnote-textmark').innerText();
  await page.locator('#close-thread').click();
  await page.reload();
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await openThread(page);
  await expect(page.locator('#thread .uxnote-textmark')).toHaveCount(1);
  await expect(page.locator('#thread .uxnote-textmark')).toHaveText(marked);
});

test('a dialog the page says nothing about is refused', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await modeButton(page, 'text').click();
  await page.locator('#open-plain').click();
  await dragAcross(page, '#inside-plain');
  await expect(page.locator('.wn-annot-toast.show')).toHaveText(REFUSAL);
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
  await expect(page.locator('body > #uxnote-root')).toHaveCount(1);
});

// A dialog with a transform, a filter or a paint containment on it is the
// containing block of the fixed boxes the interface is made of, and they would
// be laid out against the dialog rather than against the screen.
test('a dialog that would hold the interface in place is refused', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await modeButton(page, 'text').click();
  await page.locator('#thread').evaluate((dialog) => {
    dialog.style.transform = 'translateY(0)';
  });
  await page.locator('#open-thread').click();
  await expect(page.locator('.wn-annot-toast.show')).toHaveText(REFUSAL);
  await expect(page.locator('body > #uxnote-root')).toHaveCount(1);
  await dragAcross(page, '#inside');
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
});

test('escape closes the comment card inside the modal and the dialog stands', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await modeButton(page, 'element').click();
  await page.locator('#reply').click();
  await expect(card(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card(page)).toBeHidden();
  expect(await isOpen(page, 'thread')).toBe(true);
});

test('escape leaves the mode inside the modal and the dialog stands', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await modeButton(page, 'text').click();
  await expect(modeButton(page, 'text')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(modeButton(page, 'text')).not.toHaveClass(/active/);
  expect(await isOpen(page, 'thread')).toBe(true);
});

test('escape is the page owner key with nothing of the widget up', async ({ page }) => {
  await page.goto('/test/fixtures/modal-allow.html');
  await openThread(page);
  await page.keyboard.press('Escape');
  expect(await isOpen(page, 'thread')).toBe(false);
  await expect(page.locator('body > #uxnote-root')).toHaveCount(1);
});
