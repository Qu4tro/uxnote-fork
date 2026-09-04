const { test, expect } = require('@playwright/test');

// The bubble on a mark. Every annotation leaves something on the page -- a
// highlight over the words and a numbered badge beside it -- and resting on
// one of those says what the note says without a trip to the panel.

async function seed(page, annotations) {
  await page.evaluate((set) => {
    localStorage.setItem(
      `uxnote:site:${location.origin}`,
      JSON.stringify(
        set.map((one, idx) => ({
          id: `bubble-probe-${idx}`,
          type: 'element',
          comment: `note ${idx}`,
          createdAt: Date.parse('2026-08-30T09:00:00Z') + idx * 60000,
          pageUrl: location.href,
          pageKey: location.origin + location.pathname,
          target: { xpath: '', css: '#card-offline', tag: 'div' },
          ...one
        }))
      )
    );
  }, annotations);
  await page.reload();
  await page.locator('.wn-annot-toolbar').waitFor();
}

const HIGHLIGHT = { type: 'text', snippet: 'Works offline', target: { quote: 'Works offline' } };

test('resting on a highlight says what the note says', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ ...HIGHLIGHT, comment: 'The claim and the proof are three screens apart.' }]);
  const bubble = page.locator('.wn-annot-note');
  await expect(bubble).toBeHidden();
  await page.locator('.uxnote-textmark').first().hover();
  await expect(bubble).toBeVisible();
  await expect(bubble.locator('.wn-annot-note-kind')).toHaveText('Text highlight');
  // The same number the badge beside the mark carries, and the panel's card.
  await expect(bubble.locator('.wn-annot-note-number')).toHaveText('#1');
  await expect(bubble.locator('.wn-annot-note-text')).toHaveText(
    'The claim and the proof are three screens apart.'
  );
});

test('the badge on a pinned element opens the same bubble', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ comment: 'Nothing here says it can be pressed.' }]);
  // A pin draws its border on the page's own element, and one the size of the
  // screen would then answer to the pointer anywhere on it. The badge in the
  // corner is the border there.
  await page.locator('#card-offline').hover();
  await expect(page.locator('.wn-annot-note')).toBeHidden();
  await page.locator('.wn-annot-marker').first().hover();
  await expect(page.locator('.wn-annot-note-text')).toHaveText('Nothing here says it can be pressed.');
});

test('the bubble edits the note it is showing', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ ...HIGHLIGHT, comment: 'first thoughts' }]);
  await page.locator('.uxnote-textmark').first().hover();
  await page.locator('.wn-annot-note-edit').click();
  const card = page.locator('.wn-annot-comment-card');
  await expect(card).toBeVisible();
  await expect(card.locator('textarea')).toHaveValue('first thoughts');
  await card.locator('textarea').fill('second thoughts');
  await card.locator('.wn-annot-pill.primary').click();
  await page.locator('.uxnote-textmark').first().hover();
  await expect(page.locator('.wn-annot-note-text')).toHaveText('second thoughts');
});

test('a note nobody wrote a comment on says so', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ ...HIGHLIGHT, comment: '' }]);
  await page.locator('.uxnote-textmark').first().hover();
  await expect(page.locator('.wn-annot-note-text')).toHaveClass(/is-empty/);
  await expect(page.locator('.wn-annot-note-text')).toHaveText('Nothing written on this one yet.');
});

test('a capture mode keeps the bubble out of the way', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ ...HIGHLIGHT, comment: 'in the way of the next one' }]);
  await page.locator('.uxnote-textmark').first().hover();
  await expect(page.locator('.wn-annot-note')).toBeVisible();
  // Element mode draws its own preview under the pointer, and picking what to
  // mark next is not the moment to read what was marked last.
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await expect(page.locator('.wn-annot-note')).toBeHidden();
  await page.locator('.uxnote-textmark').first().hover();
  await expect(page.locator('.wn-annot-note')).toBeHidden();
});

test('the bubble stands clear of the mark and stays on the screen', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ ...HIGHLIGHT, comment: 'a comment long enough to widen the bubble past its mark' }]);
  await page.locator('.uxnote-textmark').first().hover();
  const bubble = await page.locator('.wn-annot-note').boundingBox();
  const mark = await page.locator('.uxnote-textmark').first().boundingBox();
  const view = await page.evaluate(() => document.documentElement.clientWidth);
  expect(bubble.y + bubble.height).toBeLessThanOrEqual(mark.y);
  expect(bubble.x).toBeGreaterThanOrEqual(0);
  expect(bubble.x + bubble.width).toBeLessThanOrEqual(view);
});

test('the bubble follows its mark up the page', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ ...HIGHLIGHT, comment: 'still pointing at the same words' }]);
  await page.locator('.uxnote-textmark').first().hover();
  const before = await page.locator('.wn-annot-note').boundingBox();
  await page.evaluate(() => window.scrollBy(0, 120));
  await expect
    .poll(async () => Math.round((await page.locator('.wn-annot-note').boundingBox()).y))
    .toBe(Math.round(before.y) - 120);
});
