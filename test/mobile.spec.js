const { test, expect } = require('@playwright/test');

// These run on the four phone projects of playwright.config.js, with touch
// emulation and a mobile user agent. Every number here was a measured fault
// before this branch: a bar that scrolled its own controls out of reach, an
// end control clipped by that scroll, 30-36px targets, and a landscape phone
// on the desktop layout because the breakpoint only ever read the width.

const TOUCH_MINIMUM = 44;

// The reading a fixed element is positioned against. When these disagree the
// host page overflows horizontally, and fixed chrome sized in vw is then sized
// by one box and placed against another.
async function viewport(page) {
  return page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
}

test('the widget mounts with no page error', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.wn-annot-toolbar')).toBeVisible();
  expect(errors).toEqual([]);
});

test('the demo page does not widen the document', async ({ page }) => {
  await page.goto('/');
  const box = await viewport(page);
  // The pricing table used to run to 461px and take the layout viewport with
  // it, which moved the toolbar off the screen it was supposed to sit on.
  expect(box.scrollWidth).toBe(box.clientWidth);
  expect(box.innerWidth).toBe(box.clientWidth);
});

test('the toolbar is anchored to the edges, not centred', async ({ page }) => {
  await page.goto('/');
  const bar = page.locator('.wn-annot-toolbar');
  // A media query adds no specificity, so the rule that meant to do this lost
  // to .wn-annot-toolbar.wn-pos-bottom and the bar stayed on left: 50%.
  await expect(bar).toHaveCSS('transform', 'none');
  const { clientWidth } = await viewport(page);
  const box = await bar.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(clientWidth);
});

test('the toolbar neither scrolls nor wraps', async ({ page }) => {
  await page.goto('/');
  const bar = page.locator('.wn-annot-toolbar');
  // The strip is what hid 41-60px of controls behind a scroll no gesture on a
  // phone reaches for; the bar holds its row instead.
  await expect(bar).toHaveCSS('overflow-x', 'visible');
  await expect(bar).toHaveCSS('flex-wrap', 'nowrap');
  const overflow = await bar.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBe(0);
  const box = await bar.boundingBox();
  // One row of 48px controls in a bar with 6px of padding.
  expect(box.height).toBeLessThan(70);
});

test('no toolbar control is clipped or off the screen', async ({ page }) => {
  await page.goto('/');
  const { clientWidth } = await viewport(page);
  const bar = await page.locator('.wn-annot-toolbar').boundingBox();
  const buttons = await page.locator('.wn-annot-toolbar button').all();
  expect(buttons.length).toBeGreaterThan(0);
  for (const button of buttons) {
    const name = await button.evaluate((el) => el.getAttribute('data-action') || 'visibility');
    const box = await button.boundingBox();
    expect(box.x, `${name} starts left of the bar`).toBeGreaterThanOrEqual(bar.x - 0.5);
    expect(box.x + box.width, `${name} runs past the bar`).toBeLessThanOrEqual(bar.x + bar.width + 0.5);
    expect(box.x, `${name} starts off screen`).toBeGreaterThanOrEqual(-0.5);
    expect(box.x + box.width, `${name} runs off screen`).toBeLessThanOrEqual(clientWidth + 0.5);
  }
});

test('every toolbar target is at least 44px', async ({ page }) => {
  await page.goto('/');
  const buttons = await page.locator('.wn-annot-toolbar button').all();
  for (const button of buttons) {
    const name = await button.evaluate((el) => el.getAttribute('data-action') || 'visibility');
    const box = await button.boundingBox();
    expect(box.width, `${name} is ${box.width}px wide`).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
    expect(box.height, `${name} is ${box.height}px tall`).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  }
});

test('the bar carries five controls and drops the rest', async ({ page }) => {
  await page.goto('/');
  const names = await page.locator('.wn-annot-toolbar button').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-mode') || el.getAttribute('data-action') || 'visibility')
  );
  expect(names).toEqual(['visibility', 'text', 'element', 'screenshot', 'toggle-panel']);
  // The wordmark has no room and the two dropped controls have no answer here:
  // import needs the file on the device, and the bar belongs in thumb reach.
  await expect(page.locator('.wn-annot-logo')).toBeHidden();
});

test('export leaves the bar for the panel and stays a 44px target', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  const exportBtn = page.locator('.wn-annot-panel-export');
  await expect(exportBtn).toBeVisible();
  const box = await exportBtn.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  const deleteAll = await page.locator('.wn-annot-delete-all').boundingBox();
  expect(deleteAll.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  await exportBtn.click();
  await expect(page.locator('.wn-annot-modal-backdrop.show')).toBeVisible();
});

test('the landscape phone gets the compact layout, not the desktop one', async ({ page }, testInfo) => {
  await page.goto('/');
  const factors = await page.evaluate(() => ({
    width640: matchMedia('(max-width: 640px)').matches,
    compact: matchMedia('(max-width: 640px), (max-height: 480px)').matches,
    touch: matchMedia('(pointer: coarse) and (hover: none)').matches
  }));
  // Touch is true at every one of these widths; width alone is not.
  expect(factors.touch).toBe(true);
  expect(factors.compact).toBe(true);
  if (testInfo.project.name.endsWith('landscape')) {
    // 852px wide: the old rule read this as a desktop and gave it a 66px bar,
    // a 14px textarea, and an import dialog it could not dismiss.
    expect(factors.width640).toBe(false);
  }
});

test('the tooltips are not drawn where there is no hover', async ({ page }) => {
  await page.goto('/');
  const content = await page
    .locator('.wn-annot-btn')
    .first()
    .evaluate((el) => getComputedStyle(el, '::after').content);
  expect(content).toBe('none');
});

test('the fields are 16px, so focus does not zoom the page', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  const search = page.locator('.wn-annot-filters input[type="search"]');
  await expect(search).toHaveCSS('font-size', '16px');
  const box = await search.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
});

test('the page dimmer is off by default on touch', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.wn-annot-dimmer')).toHaveCount(0);
  // A page that asks for it by name still gets it.
  await page.goto('/?backdrop=true');
  await expect(page.locator('.wn-annot-dimmer')).toHaveCount(1);
});

test('the panel fills the viewport without measuring itself in vw or vh', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wn-annot-toolbar button[data-action="toggle-panel"]').click();
  const panel = page.locator('.wn-annot-panel');
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  const view = await page.evaluate(() => ({
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
  }));
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.width)).toBe(view.w);
  expect(Math.round(box.height)).toBe(view.h);
});

test('the visibility control sits in the bar and reads in English', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.wn-annot-visibility-btn');
  await expect(toggle).toHaveAttribute('aria-label', 'Hide Uxnote');
  const inBar = await toggle.evaluate((el) => !!el.closest('.wn-annot-toolbar'));
  expect(inBar).toBe(true);
});

test('a marker on a full-bleed block stays on the screen', async ({ page }) => {
  await page.goto('/');
  // Written straight to storage: pinning an element by touch is not this
  // branch's job, and the question here is only where the marker lands.
  await page.evaluate(() => {
    const key = `uxnote:site:${location.origin}`;
    localStorage.setItem(
      key,
      JSON.stringify([
        {
          id: 'mobile-marker',
          type: 'element',
          comment: 'a note',
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
  const marker = page.locator('.wn-annot-marker').first();
  await expect(marker).toBeVisible();
  const box = await marker.boundingBox();
  const { clientWidth } = await viewport(page);
  expect(box.width).toBeGreaterThanOrEqual(TOUCH_MINIMUM);
  expect(box.x + box.width).toBeLessThanOrEqual(clientWidth);
  expect(box.x).toBeGreaterThanOrEqual(0);
});
