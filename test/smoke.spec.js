const { test, expect } = require('@playwright/test');

test('the widget mounts on the demo page without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(page.locator('.wn-annot-panel')).toBeAttached();
  expect(errors).toEqual([]);
});

test('the toolbar offers a capture button', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.wn-annot-toolbar button[data-mode="screenshot"]')).toBeVisible();
});

test('the capture leaves the interface on the page', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('/');
  for (const width of [1280, 1366, 1440]) {
    await page.setViewportSize({ width, height: 768 });
    const box = await page.locator('.wn-annot-toolbar').boundingBox();
    expect(box.height, `the toolbar wrapped at ${width}px`).toBeLessThan(100);
  }
});

test('the toolbar offers the mail handoff on its own button', async ({ page }) => {
  await page.goto('/');
  const mail = page.locator('.wn-annot-toolbar button[data-action="mail"]');
  await expect(mail).toBeVisible();
  await expect(mail).toHaveAttribute('data-tip', 'Send by mail');
});

test('the mail handoff survives a page with the JSON export off', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/test/fixtures/mail-without-json-export.html');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  await expect(page.locator('.wn-annot-toolbar button[data-action="export"]')).toHaveCount(0);
  await expect(page.locator('.wn-annot-toolbar button[data-action="import"]')).toHaveCount(0);
  // The mail button carries its own option, so taking the JSON export away
  // leaves the reviewer a way to hand the annotations over.
  await expect(page.locator('.wn-annot-toolbar button[data-action="mail"]')).toBeVisible();
  await page.locator('.wn-annot-toolbar button[data-action="mail"]').click();
  // The handoff goes straight to the mail client; it opens nothing on the page.
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('the JSON export survives a page with the mail off', async ({ page }) => {
  await page.goto('/test/fixtures/json-export-without-mail.html');
  await expect(page.locator('.wn-annot-toolbar button[data-action="mail"]')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.locator('.wn-annot-toolbar button[data-action="export"]').click();
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
});

test('the export button writes the file without asking first', async ({ page }) => {
  await page.goto('/');
  const download = page.waitForEvent('download');
  await page.locator('.wn-annot-toolbar button[data-action="export"]').click();
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
  // The file holds every annotation of the site whatever is answered, so
  // nothing stands between the press and it.
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toHaveCount(0);
});

test('the widget writes the resolved theme on the html element', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-wn-theme', 'dark');
});

test('reverse-auto wears the side of the system theme the page does not', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/test/fixtures/theme-reverse-auto.html');
  await expect(page.locator('html')).toHaveAttribute('data-wn-theme', 'light');
  // It reads the preference rather than a fixed side, so it keeps following it.
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-wn-theme', 'dark');
});

test('the page theme switch holds the demo page against the widget', async ({ page }) => {
  // The page is explicit: a dark system resolves the widget to dark and must
  // leave the page in light, which is the contrast the switch exists for.
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-page-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-wn-theme', 'dark');

  await page.locator('.page-theme-switch button[data-page-theme-set="dark"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-page-theme', 'dark');

  // The choice is read before the first paint, so a reload lands dark outright.
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-page-theme', 'dark');
});

test('the page theme switch sits inside the subtree the widget ignores', async ({ page }) => {
  await page.goto('/');
  const ignored = await page.locator('.page-theme-switch').evaluate((el) => !!el.closest('[data-uxnote-ignore]'));
  expect(ignored).toBe(true);
});

test('the query string sets the widget options', async ({ page }) => {
  await page.goto('/?json-export=false&theme=dark&color=%23e04f5f');
  await expect(page.locator('.wn-annot-toolbar button[data-action="export"]')).toHaveCount(0);
  // Only the requested option changed; the import and mail buttons are untouched.
  await expect(page.locator('.wn-annot-toolbar button[data-action="import"]')).toBeVisible();
  await expect(page.locator('.wn-annot-toolbar button[data-action="mail"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-wn-theme', 'dark');
  const highlight = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--wn-text-highlight').trim()
  );
  expect(highlight).toBe('#e04f5f');
});

test('the mail handoff has an option of its own here too', async ({ page }) => {
  await page.goto('/?mail-export=false');
  await expect(page.locator('.wn-annot-toolbar button[data-action="mail"]')).toHaveCount(0);
  // The JSON export answers to a different attribute and is still here.
  await expect(page.locator('.wn-annot-toolbar button[data-action="export"]')).toBeVisible();
  await expect(page.locator('#settings-snippet')).toContainText('data-mail-export="false"');
});

test('the demo page carries the reversed theme through to the widget', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/?theme=reverse-auto');
  // The widget takes the side the system did not, and the form shows the value
  // the widget was handed rather than the default it fell back from.
  await expect(page.locator('html')).toHaveAttribute('data-wn-theme', 'light');
  await expect(page.locator('#set-theme')).toHaveValue('reverse-auto');
});

test('every option in the settings grid says what it does', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.settings-grid label');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  await expect(cards.locator('.settings-desc')).toHaveCount(count);
});

test('the demo page refuses a server that is not on the loopback address', async ({ page }) => {
  await page.goto('/?server-url=https://example.invalid&server-api-key=k');
  const carried = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script')).some(
      (s) => s.hasAttribute('data-server-url') || s.hasAttribute('data-server-api-key')
    )
  );
  expect(carried).toBe(false);
  // Silence would read as a link that worked, so the notice names both what it
  // dropped and the rule that dropped it.
  await expect(page.locator('#settings-notice')).toBeVisible();
  await expect(page.locator('#settings-notice')).toContainText('server-url, server-api-key');
  await expect(page.locator('#settings-notice')).toContainText('loopback address only');
});

test('the demo page names a server key spelled some other way', async ({ page }) => {
  await page.goto('/?serverUrl=https://example.invalid&Server_Url=x&api_key=k');
  // These name no option this page reads, so nothing applies them. Saying so
  // beats letting the link look honoured.
  await expect(page.locator('#settings-notice')).toContainText('serverUrl, Server_Url, api_key');
  await expect(page.locator('#settings-notice')).toContainText('loopback address only');
});

test('the demo page takes a loopback server onto the script tag', async ({ page }) => {
  await page.goto('/?server-url=http%3A%2F%2F127.0.0.1%3A8123&server-api-key=local-key');
  const carried = await page.evaluate(() => {
    const tag = Array.from(document.querySelectorAll('script')).find((s) => s.hasAttribute('data-server-url'));
    return tag && [tag.getAttribute('data-server-url'), tag.getAttribute('data-server-api-key')];
  });
  expect(carried).toEqual(['http://127.0.0.1:8123/', 'local-key']);
  await expect(page.locator('#settings-notice')).toBeHidden();
  await expect(page.locator('#settings-snippet')).toContainText('data-server-url="http://127.0.0.1:8123/"');
});

test('applying a set carries it through the reload and leaves the defaults out', async ({ page }) => {
  await page.goto('/');
  await page.fill('#set-server-url', 'http://localhost:8123');
  await page.fill('#set-server-api-key', 'local-key');
  await page.click('#settings-apply');
  await page.waitForURL(/server-url=/);
  // Only the two edited options travel; everything still at its default is
  // absent from the query string, so a plain path means defaults.
  expect(new URL(page.url()).searchParams.toString()).toBe(
    'server-url=http%3A%2F%2Flocalhost%3A8123%2F&server-api-key=local-key'
  );
  await expect(page.locator('#set-server-url')).toHaveValue('http://localhost:8123/');
  const key = await page.evaluate(() => {
    const tag = Array.from(document.querySelectorAll('script')).find((s) => s.hasAttribute('data-server-url'));
    return tag && tag.getAttribute('data-server-api-key');
  });
  expect(key).toBe('local-key');
});

test('the server fields come filled with the address the bundled server answers on', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#set-server-url')).toHaveValue('http://localhost:8123');
  await expect(page.locator('#set-server-api-key')).toHaveValue('review-key');
  // Filled is not applied. A visitor who runs no server should not land on a
  // page already pointed at one, so a plain load still keeps the notes here.
  const carried = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script')).some((s) => s.hasAttribute('data-server-url'))
  );
  expect(carried).toBe(false);
  // The snippet is the tag the widget was built from, so a field that is filled
  // only because it was seeded stays out of it until it is applied or edited.
  await expect(page.locator('#settings-snippet')).not.toContainText('data-server-url');
  await expect(page.locator('#settings-snippet')).not.toContainText('data-server-api-key');
  // Editing one is acting on it, and the snippet says so before Apply is near.
  await page.fill('#set-server-api-key', 'review-key-2');
  await expect(page.locator('#settings-snippet')).toContainText('data-server-api-key="review-key-2"');
  await page.fill('#set-server-api-key', 'review-key');

  // What the filling buys is the press: nothing to type before Apply.
  await page.click('#settings-apply');
  await page.waitForURL(/server-url=/);
  const applied = await page.evaluate(() => {
    const tag = Array.from(document.querySelectorAll('script')).find((s) => s.hasAttribute('data-server-url'));
    return tag && [tag.getAttribute('data-server-url'), tag.getAttribute('data-server-api-key')];
  });
  expect(applied).toEqual(['http://localhost:8123/', 'review-key']);
  // Applied is in the set, so now the snippet carries it.
  await expect(page.locator('#settings-snippet')).toContainText('data-server-url="http://localhost:8123/"');
});

test('the demo page drops a server key that arrives on its own', async ({ page }) => {
  await page.goto('/?server-api-key=local-key');
  const carried = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script')).some((s) => s.hasAttribute('data-server-api-key'))
  );
  expect(carried).toBe(false);
  await expect(page.locator('#settings-notice')).toContainText('no server to reach');
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
