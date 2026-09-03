const { test, expect } = require('@playwright/test');

// The address in the fixture is never listening. Each check answers for it,
// so the three states are reached without a server to start and stop.
const SERVER_FIXTURE = '/test/fixtures/server-dot.html';
const CORS = { 'Access-Control-Allow-Origin': '*' };

function dotOf(page) {
  return page.locator('.wn-annot-toolbar .wn-annot-sync-dot');
}

test('the dot reads green while the server answers', async ({ page }) => {
  await page.route('**/annotations*', (route) =>
    route.fulfill({ status: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: '{"annotations":[]}' })
  );
  await page.goto(SERVER_FIXTURE);
  await expect(dotOf(page)).toHaveAttribute('data-sync-status', 'ok');
  await expect(dotOf(page)).toHaveAttribute('data-tip', 'Server connected');
});

test('the dot reads yellow when the server refuses the request', async ({ page }) => {
  await page.route('**/annotations*', (route) => route.fulfill({ status: 403, headers: CORS, body: 'no' }));
  await page.goto(SERVER_FIXTURE);
  await expect(dotOf(page)).toHaveAttribute('data-sync-status', 'refused');
  // The address answered, so the reviewer is sent to the key and the path
  // rather than to the network.
  await expect(dotOf(page)).toHaveAttribute('data-tip', /check the address or the key/);
});

test('the dot reads yellow when the address answers as something else', async ({ page }) => {
  await page.route('**/annotations*', (route) =>
    route.fulfill({ status: 200, headers: { ...CORS, 'Content-Type': 'text/html' }, body: '<!doctype html><p>a website' })
  );
  await page.goto(SERVER_FIXTURE);
  await expect(dotOf(page)).toHaveAttribute('data-sync-status', 'refused');
});

test('the dot reads red when nothing answers at all', async ({ page }) => {
  await page.route('**/annotations*', (route) => route.abort());
  await page.goto(SERVER_FIXTURE);
  await expect(dotOf(page)).toHaveAttribute('data-sync-status', 'unreachable');
  await expect(dotOf(page)).toHaveAttribute('data-tip', /notes stay in this browser/);
});

test('the three states do not share one tooltip', async ({ page }) => {
  const tips = [];
  for (const [name, handler] of [
    ['ok', (route) => route.fulfill({ status: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: '{"annotations":[]}' })],
    ['refused', (route) => route.fulfill({ status: 403, headers: CORS, body: 'no' })],
    ['unreachable', (route) => route.abort()]
  ]) {
    await page.unrouteAll();
    await page.route('**/annotations*', handler);
    await page.goto(SERVER_FIXTURE);
    await expect(dotOf(page)).toHaveAttribute('data-sync-status', name);
    tips.push(await dotOf(page).getAttribute('data-tip'));
  }
  expect(new Set(tips).size).toBe(3);
});

test('a page with no server named has no dot to read', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(dotOf(page)).toHaveCount(0);
});
