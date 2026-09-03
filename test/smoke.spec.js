const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

test('the server under test is serving this working copy', async ({ request }) => {
  const response = await request.get('/uxnote-tool/uxnote.js');
  expect(response.ok()).toBe(true);
  const onDisk = sha256(fs.readFileSync(path.join(__dirname, '..', 'uxnote-tool', 'uxnote.js')));
  // Outside CI a server already listening on this port is reused rather than
  // started, so a second checkout is measured in place of this one and nothing
  // in the output says so. Every number below is worthless if this fails.
  expect(sha256(await response.body()), 'another checkout answers on this port').toBe(onDisk);
});


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

test('the toolbar keeps its full set on a laptop screen', async ({ page }) => {
  await page.goto('/');
  const names = await page.locator('.wn-annot-toolbar button').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-mode') || el.getAttribute('data-action'))
  );
  // The compact bar trims this set; a mouse and a wide window keep all of it.
  expect(names).toEqual(['text', 'element', 'screenshot', 'import', 'export', 'mail', 'toggle-pos', 'toggle-panel']);
  await expect(page.locator('.wn-annot-logo')).toBeVisible();
  await expect(page.locator('.wn-annot-visibility-btn')).toBeVisible();
  const floating = await page
    .locator('.wn-annot-visibility-btn')
    .evaluate((el) => !el.closest('.wn-annot-toolbar'));
  expect(floating).toBe(true);
});

test('the panel keeps its side rail and draws no sheet chrome', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  const panel = page.locator('.wn-annot-panel');
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  const view = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }));
  // A rail on the right, not a sheet on the bottom edge.
  expect(Math.round(box.width)).toBe(360);
  expect(box.x + box.width).toBeLessThanOrEqual(view.width - 17);
  await expect(panel).toHaveCSS('border-bottom-left-radius', '18px');
  await expect(page.locator('.wn-annot-panel .wn-annot-sheet-grip')).toBeHidden();
  await expect(page.locator('.wn-annot-panel-export')).toBeHidden();
  // Nothing holds the page still here; the panel never covered it.
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('a confirm dialog keeps its answers in a row on a laptop screen', async ({ page }) => {
  await page.goto('/');
  // One annotation, written straight to storage: what is under test is the
  // shape of the dialog, not how the annotation was made.
  await page.evaluate(() => {
    localStorage.setItem(
      `uxnote:site:${location.origin}`,
      JSON.stringify([
        {
          id: 'dialog-probe',
          type: 'element',
          comment: 'a note to delete',
          color: '#4e9cf6',
          createdAt: new Date().toISOString(),
          pageUrl: location.href,
          pageKey: location.origin + location.pathname,
          target: { xpath: '/html/body/header', selector: 'header' }
        }
      ])
    );
  });
  await page.reload();
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  await page.locator('.wn-annot-delete-all').click();
  const modal = page.locator('.wn-annot-modal-backdrop.show .wn-annot-modal');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.wn-annot-pill')).toHaveCount(2);
  // A dialog here and not a sheet: the grip is built but never drawn.
  await expect(modal.locator('.wn-annot-sheet-grip')).toBeHidden();
  const view = await page.evaluate(() => document.documentElement.clientWidth);
  const box = await modal.boundingBox();
  expect(box.width).toBeLessThan(view);
});

test('the comment card is still parked and translucent where there is hover', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await page.locator('.card').first().click();
  const card = page.locator('.wn-annot-comment-card');
  await expect(card).toBeVisible();
  // The premise holds on a desktop: the card is parked over the page it is
  // about, and reading through it is the point.
  await expect(card).toHaveCSS('opacity', '0.55');
  const box = await card.boundingBox();
  expect(Math.round(box.width)).toBe(420);
  await expect(page.locator('.wn-annot-comment-card .wn-annot-sheet-grip')).toBeHidden();
});

test('a narrow window gets the sheet and keeps its hover previews', async ({ page }) => {
  await page.goto('/');
  // The two axes answer two questions. How much room there is decides that
  // this is a sheet; what kind of pointer is driving decides that the tooltips
  // and the parked card's hover are still worth drawing. A mouse in a small
  // window is not a finger.
  await page.setViewportSize({ width: 600, height: 800 });
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  const panel = page.locator('.wn-annot-panel');
  const box = await panel.boundingBox();
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.width)).toBe(600);
  await expect(panel).toHaveCSS('border-bottom-left-radius', '0px');
  await expect(page.locator('.wn-annot-panel .wn-annot-sheet-grip')).toBeVisible();
  const tip = await page
    .locator('.wn-annot-btn')
    .first()
    .evaluate((el) => getComputedStyle(el, '::after').content);
  expect(tip).not.toBe('none');
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

test('a mouse still commits a highlight on the release', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="text"]').click();
  const copy = await page.locator('#hero-copy').boundingBox();
  await page.mouse.move(copy.x + 4, copy.y + 8);
  await page.mouse.down();
  await page.mouse.move(copy.x + 240, copy.y + 8, { steps: 8 });
  await page.mouse.up();
  // The selection action bar is a coarse-pointer answer. A mouse has a
  // release that means what it says, and never builds one.
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
  await expect(page.locator('.wn-annot-selection-bar')).toHaveCount(0);
});

test('a mouse still previews an element on hover and commits on the click', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  const card = page.locator('.card').first();
  await card.hover();
  await expect(page.locator('.wn-annot-outline')).toHaveCSS('display', 'block');
  await card.click();
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
  // Tap-to-preview is what replaces a hover the pointer does not have.
  await expect(page.locator('.wn-annot-pick-bar')).toHaveCount(0);
});

test('a mouse still frames the region it captures', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  // One tap of the camera takes the viewport where there is no drag to make.
  // Where there is one, the reviewer keeps the frame.
  await expect(page.locator('.wn-shot-overlay')).toBeVisible();
  await page.mouse.move(200, 300);
  await page.mouse.down();
  await page.mouse.move(420, 440, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
  await page.locator('.wn-annot-modal textarea').fill('a framed corner');
  await page.locator('.wn-annot-modal .wn-annot-pill.primary').click();
  await expect
    .poll(async () => (await page.evaluate(() => JSON.parse(localStorage.getItem(`uxnote:site:${location.origin}`) || '[]')))[0]?.rect, {
      timeout: 30000
    })
    .toEqual({ x: 200, y: 300, w: 220, h: 140 });
});

// A page with a server behind it, served through a route so the widget starts
// on a fresh window with `data-server-url` set.
const SERVER_HOST_PAGE = `<!doctype html>
<html><head><meta charset="utf-8"><title>sync probe</title></head>
<body><main><p id="copy">A page with a server behind it.</p></main>
<script src="/uxnote-tool/uxnote.js" data-server-url="/api"></script></body></html>`;

async function withSyncServer(page) {
  const puts = [];
  let refuse = true;
  await page.route('**/sync-probe.html', (route) =>
    route.fulfill({ contentType: 'text/html; charset=utf-8', body: SERVER_HOST_PAGE })
  );
  await page.route('**/api/annotations?*', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ annotations: [] }) })
  );
  await page.route('**/api/annotations/*', (route) => {
    const request = route.request();
    if (request.method() !== 'PUT') return route.fulfill({ status: 200, body: '{}' });
    puts.push(JSON.parse(request.postData() || '{}').id);
    if (refuse) {
      refuse = false;
      return route.fulfill({ status: 503, body: 'no' });
    }
    return route.fulfill({ status: 200, body: '{}' });
  });
  await page.goto('/sync-probe.html');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  return { puts };
}

async function annotateOnce(page) {
  await page.locator('.wn-annot-toolbar button[data-mode="element"]').click();
  await page.locator('#copy').click();
  await page.locator('.wn-annot-modal textarea').fill('a note the server refused');
  await page.locator('.wn-annot-modal .wn-annot-pill.primary').click();
}

test('a hidden tab sends the annotation the server refused', async ({ page }) => {
  const { puts } = await withSyncServer(page);
  await annotateOnce(page);
  await expect.poll(() => puts.length).toBe(1);
  // A refused upsert leaves the snapshot stale so the next change retries.
  // On a phone the tab goes to a lock screen and there is no next change.
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { get: () => 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => puts.length).toBe(2);
  expect(puts[0]).toBe(puts[1]);
});

test('a page on its way out sends what it still owes', async ({ page }) => {
  const { puts } = await withSyncServer(page);
  await annotateOnce(page);
  await expect.poll(() => puts.length).toBe(1);
  // `pagehide` and not `beforeunload`, which iOS does not fire reliably.
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await expect.poll(() => puts.length).toBe(2);
});

test('a connection coming back sends what the lost one did not', async ({ page }) => {
  const { puts } = await withSyncServer(page);
  await annotateOnce(page);
  await expect.poll(() => puts.length).toBe(1);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect.poll(() => puts.length).toBe(2);
  // The second answer was taken, so a third event owes nothing.
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await page.waitForTimeout(300);
  expect(puts.length).toBe(2);
});

test('a render that never answers is not waited on for ever', async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    const stall = () => new Promise(() => {});
    Object.defineProperty(window, 'snapdom', {
      configurable: true,
      get: () => ({ toCanvas: stall }),
      set: () => {}
    });
  });
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  await page.mouse.move(200, 300);
  await page.mouse.down();
  await page.mouse.move(420, 440, { steps: 5 });
  await page.mouse.up();
  await page.locator('.wn-annot-modal textarea').fill('a page that will not draw');
  await page.locator('.wn-annot-modal .wn-annot-pill.primary').click();
  // snapdom renders the whole document before the crop comes out of it. A long
  // page on a slow device used to leave the reviewer with a prompt they had
  // answered and nothing else, for as long as it took.
  await expect(page.locator('.wn-annot-toast.show')).toHaveText(
    'Uxnote: the page took too long to capture',
    { timeout: 40000 }
  );
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem(`uxnote:site:${location.origin}`) || '[]'))).toEqual([]);
});

test('a render that fails says so and writes nothing', async ({ page }) => {
  await page.addInitScript(() => {
    const fail = () => Promise.reject(new Error('no canvas here'));
    Object.defineProperty(window, 'snapdom', {
      configurable: true,
      get: () => ({ toCanvas: fail }),
      set: () => {}
    });
  });
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-mode="screenshot"]').click();
  await page.mouse.move(200, 300);
  await page.mouse.down();
  await page.mouse.move(420, 440, { steps: 5 });
  await page.mouse.up();
  await page.locator('.wn-annot-modal textarea').fill('a page that cannot draw');
  await page.locator('.wn-annot-modal .wn-annot-pill.primary').click();
  await expect(page.locator('.wn-annot-toast.show')).toHaveText('Uxnote: could not capture that region');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem(`uxnote:site:${location.origin}`) || '[]'))).toEqual([]);
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
