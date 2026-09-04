const { test, expect } = require('@playwright/test');

// The fixture names a same-origin base URL, which the protocol allows and which
// keeps CORS preflights out of the way of the fake. Nothing serves that path:
// the fake answers for it inside the page, so the server can be taken away and
// given back between two loads without a process to stop and start.
const FIXTURE = '/test/fixtures/server-sync.html';
const SITE_KEY = 'http://localhost:4173';
const API = '/uxnote-api';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

// A store the test can read and write between loads, and a switch that takes
// the whole server away.
function fakeServer(initial = []) {
  return { annotations: [...initial], up: true, puts: [], deletes: [] };
}

// One route over the whole API, dispatched inside on method and path. A glob
// per route would not do: Playwright's `*` stops at a slash, so a pattern that
// catches `/annotations?site=` lets `/annotations/<id>?site=` through.
async function serve(page, srv) {
  await page.route(`**${API}/**`, (route) => {
    if (!srv.up) return route.abort();
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === `${API}/health`) {
      return route.fulfill({ status: 200, headers: JSON_HEADERS, body: '{"status":"ok","version":1}' });
    }
    const head = `${API}/annotations/`;
    const id = path.startsWith(head) ? decodeURIComponent(path.slice(head.length)) : '';
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        headers: JSON_HEADERS,
        body: JSON.stringify({ version: 1, annotations: srv.annotations })
      });
    }
    if (request.method() === 'PUT') {
      const body = JSON.parse(request.postData() || '{}');
      srv.puts.push(body);
      const at = srv.annotations.findIndex((ann) => ann.id === id);
      if (at === -1) srv.annotations.push(body);
      else srv.annotations[at] = body;
      return route.fulfill({ status: 200, headers: JSON_HEADERS, body: '{"ok":true}' });
    }
    if (request.method() === 'DELETE') {
      srv.deletes.push(id);
      srv.annotations = id ? srv.annotations.filter((ann) => ann.id !== id) : [];
      return route.fulfill({ status: 200, headers: JSON_HEADERS, body: '{"ok":true}' });
    }
    return route.fulfill({ status: 405, body: 'no' });
  });
}

// Annotating an element is the shortest path through the real widget: pick the
// mode, click the paragraph, name the reviewer, write the note, save.
async function annotate(page, selector, comment) {
  await page.click('.wn-annot-toolbar [data-action="mode"][data-mode="element"]');
  await page.click(selector);
  const modal = page.locator('.wn-annot-modal-backdrop.show');
  await expect(modal).toBeVisible();
  // A comment is the whole of a note from this branch on, so the reviewer name
  // is only there on the branches before it.
  const name = modal.locator('input');
  if (await name.count()) await name.fill('Reviewer');
  await modal.locator('textarea').fill(comment);
  await modal.locator('.wn-annot-pill.primary').click();
  await expect(modal).toBeHidden();
}

function cards(page) {
  return page.locator('.wn-annot-item');
}

// The panel starts closed, and writing a note opens it. A load does not, so a
// test that reaches for a card's own buttons after one opens it itself.
async function openPanel(page) {
  const panel = page.locator('.wn-annot-panel');
  if (!(await panel.isVisible())) {
    await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  }
  await expect(panel).toBeVisible();
}

// The server taking a note and this browser recording that it did are two
// moments, and a reload between them re-sends the note. Tests that go on to
// reload wait for the second one.
async function settled(page) {
  await expect
    .poll(() =>
      page.evaluate((key) => {
        const set = JSON.parse(localStorage.getItem(key) || '[]');
        const agreed = new Map(JSON.parse(localStorage.getItem(`${key}:synced`) || '[]'));
        return set.length === agreed.size && set.every((ann) => agreed.has(ann.id));
      }, `uxnote:site:${SITE_KEY}`)
    )
    .toBe(true);
}

test('a note written while the server is down is still there after a reload', async ({ page }) => {
  const srv = fakeServer();
  srv.up = false;
  await serve(page, srv);

  await page.goto(FIXTURE);
  await annotate(page, '#first', 'written while the server was away');
  await expect(cards(page)).toHaveCount(1);

  await page.reload();
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page)).toContainText('written while the server was away');
});

test('the note goes up when the server comes back, with nobody writing', async ({ page }) => {
  const srv = fakeServer();
  srv.up = false;
  await serve(page, srv);
  await page.clock.install();

  await page.goto(FIXTURE);
  await annotate(page, '#first', 'held here until the server answers');
  expect(srv.puts).toHaveLength(0);

  // Nothing else happens on the page: no reload, no second note. The probe is
  // the only thing that can notice, and it is backing off.
  srv.up = true;
  await page.clock.fastForward('00:30');
  await expect.poll(() => srv.puts.map((ann) => ann.comment)).toEqual(['held here until the server answers']);
  await expect(page.locator('.wn-annot-sync-dot')).toHaveAttribute('data-sync-status', 'ok');
});

test('a note nobody here touched takes the server copy', async ({ page }) => {
  const srv = fakeServer();
  await serve(page, srv);

  await page.goto(FIXTURE);
  await annotate(page, '#first', 'the first wording');
  await settled(page);

  // Another reviewer edits it between the two loads.
  srv.annotations[0] = { ...srv.annotations[0], comment: 'the second wording' };
  await page.reload();
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page)).toContainText('the second wording');
});

test('a note another reviewer deleted goes, and is not written back', async ({ page }) => {
  const srv = fakeServer();
  await serve(page, srv);

  await page.goto(FIXTURE);
  await annotate(page, '#first', 'a note with a short life');
  await settled(page);

  srv.annotations = [];
  srv.puts = [];
  await page.reload();
  await expect(cards(page)).toHaveCount(0);
  await expect.poll(() => srv.puts).toEqual([]);
});

test('a note edited here while the server was away beats the server copy', async ({ page }) => {
  const srv = fakeServer();
  await serve(page, srv);

  await page.goto(FIXTURE);
  await annotate(page, '#first', 'the wording the server has');
  await settled(page);

  srv.up = false;
  await page.reload();
  await openPanel(page);
  await cards(page).first().locator('.wn-annot-edit').click();
  const modal = page.locator('.wn-annot-modal-backdrop.show');
  await expect(modal).toBeVisible();
  await modal.locator('textarea').fill('the wording written while it was away');
  await modal.locator('.wn-annot-pill.primary').click();

  srv.up = true;
  srv.puts = [];
  await page.reload();
  await expect(cards(page)).toContainText('the wording written while it was away');
  await expect.poll(() => srv.puts.map((ann) => ann.comment)).toEqual(['the wording written while it was away']);
});

test('a set written before a server was named is not pushed onto the shared one', async ({ page }) => {
  const srv = fakeServer();
  await serve(page, srv);
  await page.addInitScript(
    ([key, set]) => window.localStorage.setItem(key, set),
    [
      `uxnote:site:${SITE_KEY}`,
      JSON.stringify([
        {
          id: 'a-note-from-before',
          type: 'element',
          comment: 'written before any server was named',
          author: 'Reviewer',
          priority: 'medium',
          snippet: 'first',
          pageUrl: `${SITE_KEY}${FIXTURE}`,
          pageKey: `${SITE_KEY}${FIXTURE}`,
          createdAt: 1,
          status: 'active',
          target: { xpath: '', css: '#first', tag: 'P' },
          rect: { x: 0, y: 0, w: 10, h: 10 }
        }
      ])
    ]
  );

  await page.goto(FIXTURE);
  await expect(page.locator('.wn-annot-sync-dot')).toHaveAttribute('data-sync-status', 'ok');
  await expect(cards(page)).toHaveCount(0);
  expect(srv.puts).toEqual([]);
});

test('a route change once the server is back does not drop the notes it has not seen', async ({ page }) => {
  const srv = fakeServer();
  srv.up = false;
  await serve(page, srv);

  await page.goto(FIXTURE);
  await annotate(page, '#first', 'written between two routes');
  await expect(cards(page)).toHaveCount(1);

  // The pull a route change starts is the one that used to take the set from
  // the server whole, with nothing on the screen to say a note had gone.
  srv.up = true;
  await page.evaluate(() => window.history.pushState({}, '', '/test/fixtures/somewhere-else'));
  await expect.poll(() => srv.annotations.map((ann) => ann.comment)).toEqual(['written between two routes']);

  await page.evaluate((to) => window.history.pushState({}, '', to), FIXTURE);
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page)).toContainText('written between two routes');
});
