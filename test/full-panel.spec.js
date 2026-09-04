const { test, expect } = require('@playwright/test');

// The full-size view of the annotation panel: full width, and vertically the
// room between the two toolbar positions, so it clears the bar whether the bar
// is up or down and does not move when the reviewer swaps it over.

const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function viewport(page) {
  return page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }));
}

async function seed(page, annotations) {
  await page.evaluate((set) => {
    localStorage.setItem(
      `uxnote:site:${location.origin}`,
      JSON.stringify(
        set.map((one, idx) => ({
          id: `full-probe-${idx}`,
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

async function openPanel(page) {
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  await expect(page.locator('.wn-annot-panel')).toBeVisible();
}

async function openFull(page) {
  await openPanel(page);
  await page.locator('.wn-annot-panel-view').click();
  await expect(page.locator('.wn-annot-panel')).toHaveClass(/is-full/);
}

test('the full-size view runs full width and gives up the bar at both ends', async ({ page }) => {
  await page.goto('/');
  await openFull(page);
  const view = await viewport(page);
  const box = await page.locator('.wn-annot-panel').boundingBox();
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.width)).toBe(view.width);
  // The bar is docked to one edge and the room is given up at both, so the
  // view clears it at either position without being told which one it is at.
  expect(box.y).toBeGreaterThanOrEqual(bar.height);
  expect(view.height - (box.y + box.height)).toBeGreaterThanOrEqual(bar.height);
});

test('moving the toolbar leaves the full-size view where it is', async ({ page }) => {
  await page.goto('/');
  await openFull(page);
  const panel = page.locator('.wn-annot-panel');
  const before = await panel.boundingBox();
  await page.locator('.wn-annot-toolbar button[data-action="toggle-pos"]').click();
  await expect(page.locator('.wn-annot-toolbar')).toHaveClass(/wn-pos-top/);
  const after = await panel.boundingBox();
  expect(Math.round(after.y)).toBe(Math.round(before.y));
  expect(Math.round(after.height)).toBe(Math.round(before.height));
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();
  expect(after.y).toBeGreaterThanOrEqual(bar.y + bar.height);
});

test('a compact layout keeps its sheet however the view was left', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('wn-panel-view', 'full'));
  await page.setViewportSize({ width: 600, height: 800 });
  await page.reload();
  await openPanel(page);
  // The sheet's rules and the full-size view's would fight over the same
  // panel, so the class never reaches a compact layout and its control is not
  // drawn there either.
  await expect(page.locator('.wn-annot-panel')).not.toHaveClass(/is-full/);
  await expect(page.locator('.wn-annot-panel-view')).toBeHidden();
  await expect(page.locator('.wn-annot-panel .wn-annot-sheet-grip')).toBeVisible();
});

test('the full-size view shows the detail the rail has no room for', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ type: 'text', snippet: 'Works offline', target: { quote: 'Works offline' } }]);
  await openPanel(page);
  await expect(page.locator('.wn-annot-kind')).toBeVisible();
  await expect(page.locator('.wn-annot-quote')).toBeHidden();
  await expect(page.locator('.wn-annot-facts')).toBeHidden();
  await page.locator('.wn-annot-panel-view').click();
  await expect(page.locator('.wn-annot-kind')).toHaveText('Text highlight');
  await expect(page.locator('.wn-annot-quote')).toHaveText('Works offline');
  await expect(page.locator('.wn-annot-facts')).toBeVisible();
});

test('See more lifts the clamp the full-size card puts on a long comment', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{ comment: 'A sentence about a spacing problem. '.repeat(20) }]);
  await openFull(page);
  const comment = page.locator('.wn-annot-comment');
  const clamped = (await comment.boundingBox()).height;
  await page.locator('.wn-annot-showmore').click();
  // The rule that clamps a comment in the full-size view is the more specific
  // of the two, so the rule that lifts the clamp has to name the view as well.
  expect((await comment.boundingBox()).height).toBeGreaterThan(clamped);
});

test('a filtered card carries the number its marker carries', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{}, {}, { comment: 'the third one, on its own' }]);
  await openPanel(page);
  await page.locator('#wn-filter-search').fill('third');
  await expect(page.locator('.wn-annot-item')).toHaveCount(1);
  // Numbering off the filtered list is what made the card and the mark on the
  // page disagree; both count from the order the notes were made in.
  await expect(page.locator('.wn-annot-number')).toHaveText('#3');
  await expect(page.locator('.wn-annot-marker[data-wn-annot-id="full-probe-2"]')).toHaveText('3');
});

test('a screenshot is not asked for until its card is on the screen', async ({ page }) => {
  await page.goto('/');
  await seed(page, [
    { type: 'screenshot', rect: { x: 0, y: 0, w: 80, h: 60 }, screenshot: { dataUrl: PIXEL } }
  ]);
  await expect(page.locator('.wn-annot-shot')).toHaveCount(1);
  // Nobody has opened the panel, so nothing in it is worth decoding.
  expect(await page.locator('.wn-annot-shot img[src]').count()).toBe(0);
  await openPanel(page);
  await expect(page.locator('.wn-annot-shot img')).toHaveAttribute('src', PIXEL);
});

test('a keystroke in the search box keeps the cards it did not change', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{}, {}, {}]);
  await openPanel(page);
  await page.evaluate(() => {
    document.querySelectorAll('.wn-annot-item').forEach((el, idx) => {
      el.dataset.probe = String(idx);
    });
  });
  await page.locator('#wn-filter-search').fill('note');
  await page.locator('#wn-filter-search').fill('');
  // A list emptied and built again would have lost the marks, and with them
  // every picture it had already decoded.
  const probes = await page
    .locator('.wn-annot-item')
    .evaluateAll((els) => els.map((el) => el.dataset.probe));
  expect(probes).toEqual(['0', '1', '2']);
});

test('the arrows walk the list and only one card is in the tab order', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{}, {}, {}]);
  await openFull(page);
  const stops = await page
    .locator('.wn-annot-item')
    .evaluateAll((els) => els.filter((el) => el.tabIndex === 0).length);
  expect(stops).toBe(1);
  await page.locator('.wn-annot-item').first().focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  expect(await page.evaluate(() => document.activeElement.dataset.id)).toBe('full-probe-2');
  await page.keyboard.press('Home');
  expect(await page.evaluate(() => document.activeElement.dataset.id)).toBe('full-probe-0');
});

test('a band head owns the width of the grid and counts what is under it', async ({ page }) => {
  await page.goto('/');
  await seed(page, [{}, {}, { type: 'text', snippet: 'Works offline', target: { quote: 'Works offline' } }]);
  await openFull(page);
  await page.locator('#wn-filter-group').selectOption('kind');
  await expect(page.locator('.wn-annot-band')).toHaveCount(2);
  const view = await viewport(page);
  const band = await page.locator('.wn-annot-band').first().boundingBox();
  const card = await page.locator('.wn-annot-item').first().boundingBox();
  expect(band.width).toBeGreaterThan(card.width);
  expect(band.width).toBeLessThanOrEqual(view.width);
  await expect(page.locator('.wn-annot-band').first().locator('.wn-annot-band-count')).toHaveText('2');
});

test('picking a way to mark puts the panel away', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('.wn-annot-panel');
  // Marking is done on the page, and the panel is over the page: a rail of it
  // in the side view and the whole of it in the full-size one.
  for (const mode of ['text', 'element']) {
    await openPanel(page);
    await page.locator(`.wn-annot-toolbar button[data-mode="${mode}"]`).click();
    await expect(panel).toBeHidden();
    await page.keyboard.press('Escape');
  }
  await openFull(page);
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  await expect(panel).toBeHidden();
  // The region overlay takes the page it was opened over, with no part of
  // the panel standing on it.
  await expect(page.locator('.wn-shot-overlay')).toBeVisible();
});

test('the head carries the three handoffs at either shape', async ({ page }) => {
  await page.goto('/?mailto=team%40example.org');
  await openPanel(page);
  const tools = page.locator('.wn-annot-panel-tools button[data-action]');
  await expect(tools).toHaveCount(3);
  // Four symbols and a named button in the head of a 360px rail. Whether they
  // sit beside the count or drop under it depends on how wide the font the
  // page has draws the count, so what is fixed is that they drop as one row
  // and that the row stays inside the head.
  const head = await page.locator('.wn-annot-panel-top').boundingBox();
  const group = await page.locator('.wn-annot-panel-tools').boundingBox();
  const button = await page.locator('.wn-annot-panel-view').boundingBox();
  expect(group.height).toBeLessThan(button.height * 2);
  expect(group.x).toBeGreaterThanOrEqual(head.x);
  expect(group.x + group.width).toBeLessThanOrEqual(head.x + head.width + 0.5);
  expect(group.y + group.height).toBeLessThanOrEqual(head.y + head.height + 0.5);
  await page.locator('.wn-annot-panel-view').click();
  await expect(page.locator('.wn-annot-panel')).toHaveClass(/is-full/);
  for (const one of await tools.all()) {
    await expect(one).toBeVisible();
  }
});

test('a symbol on its own is named where there is a pointer to name it with', async ({ page }) => {
  await page.goto('/?mailto=team%40example.org');
  await openPanel(page);
  // Four symbols share a head 360px wide, so none of them carries a word.
  // What says which is which is the label that opens under it.
  const named = await page
    .locator('.wn-annot-panel-tools button[data-action]')
    .evaluateAll((els) => els.map((el) => getComputedStyle(el, '::after').content));
  expect(named).toEqual(['"Import JSON"', '"Export JSON"', '"Send by mail"']);
});
