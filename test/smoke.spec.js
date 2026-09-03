const { test, expect } = require('@playwright/test');

test('the widget mounts on the demo page without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(page.locator('.wn-annot-panel')).toBeAttached();
  expect(errors).toEqual([]);
});

test('the toolbar offers a capture button', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar button[data-mode="screenshot"]')).toBeVisible();
});

test('the capture leaves the interface on the page', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  await expect(page.locator('.wn-shot-overlay')).toBeVisible();
  await page.mouse.move(200, 300);
  await page.mouse.down();
  await page.mouse.move(420, 440);
  await page.mouse.up();
  // The picture comes off a copy of the page, so releasing the drag takes
  // nothing away from the reviewer and the comment prompt opens on the spot.
  expect(await page.locator('.wn-annot-toolbar').isVisible()).toBe(true);
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
});

test('the toolbar holds one row on a laptop screen', async ({ page }) => {
  await page.goto('/demo/');
  for (const width of [1280, 1366, 1440]) {
    await page.setViewportSize({ width, height: 768 });
    const box = await page.locator('.wn-annot-toolbar').boundingBox();
    expect(box.height, `the toolbar wrapped at ${width}px`).toBeLessThan(100);
  }
});

const CAPTURE_FIXTURE = '/test/fixtures/server-capture.html';
const ALLOW = { 'Access-Control-Allow-Origin': '*' };

async function captureRegion(page) {
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  await expect(page.locator('.wn-shot-overlay')).toBeVisible();
  await page.mouse.move(80, 80);
  await page.mouse.down();
  await page.mouse.move(360, 300);
  await page.mouse.up();
  const prompt = page.locator('.wn-annot-modal-backdrop.show');
  await expect(prompt).toBeVisible();
  // The reviewer name is still asked for at this point in the series.
  await prompt.locator('input[placeholder="Reviewer name"]').fill('Smoke test');
  await prompt.locator('textarea').fill('a region written while the server was away');
  await prompt.locator('.wn-annot-pill.primary').click();
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
}

test('a capture survives a server that is not answering', async ({ page }) => {
  await page.route('**/annotations**', (route) => route.abort());
  await page.route('**/screenshots/**', (route) => route.abort());
  await page.goto(CAPTURE_FIXTURE);
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await captureRegion(page);
  // A text or an element note written with the server down is kept and sent
  // again later. The capture used to be the one kind thrown away instead.
  await expect(page.locator('.wn-annot-marker')).toHaveCount(1);
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  // The picture is on the annotation, so the card can still draw it with the
  // server unreachable.
  const src = await page.locator('.wn-annot-shot img').getAttribute('src');
  expect(src.startsWith('data:image/png;base64,')).toBe(true);
});

test('the picture goes up as a PNG once the server answers', async ({ page }) => {
  const puts = [];
  await page.route('**/annotations**', (route) => route.abort());
  await page.route('**/screenshots/**', (route) => route.abort());
  await page.goto(CAPTURE_FIXTURE);
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await captureRegion(page);
  await expect(page.locator('.wn-annot-marker')).toHaveCount(1);

  await page.unrouteAll();
  await page.route('**/screenshots/**', (route) => {
    puts.push({ kind: 'screenshot', type: route.request().headers()['content-type'] });
    return route.fulfill({
      status: 200,
      headers: { ...ALLOW, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: '/screenshots/one.png' })
    });
  });
  await page.route('**/annotations**', (route) => {
    puts.push({ kind: 'annotation', body: route.request().postData() });
    return route.fulfill({ status: 200, headers: { ...ALLOW, 'Content-Type': 'application/json' }, body: '{}' });
  });
  // A failed upsert left the snapshot stale, so the next push queues the
  // annotation again -- and that is when the picture leaves.
  await page.evaluate(() => window.Uxnote.sync.push());
  await expect.poll(() => puts.filter((p) => p.kind === 'annotation').length).toBeGreaterThan(0);

  expect(puts.some((p) => p.kind === 'screenshot' && p.type === 'image/png')).toBe(true);
  const sent = puts.find((p) => p.kind === 'annotation');
  // The annotation that reaches the server points at the file; it does not
  // carry a base64 document of its own.
  expect(sent.body).toContain('/screenshots/one.png');
  expect(sent.body).not.toContain('data:image/png;base64');
});
