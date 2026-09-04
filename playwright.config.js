const { defineConfig, devices } = require('@playwright/test');

// The port is settable so a local run can serve the worktree it is testing.
// The default is the one CI uses; without this, a second checkout already
// listening on 4173 is reused and measured instead, and says nothing about it.
const port = Number(process.env.UXNOTE_TEST_PORT || 4173);
const baseURL = `http://localhost:${port}`;

// The four viewports the mobile survey was taken on. The landscape one is the
// case a width-only breakpoint gets wrong: wider than 640px, and still a phone.
const phones = [
  ['iphone-se', 'iPhone SE (3rd gen)', { width: 375, height: 667 }],
  ['iphone-14-pro', 'iPhone 14 Pro', { width: 393, height: 852 }],
  ['pixel-7', 'Pixel 7', { width: 412, height: 915 }],
  ['iphone-14-pro-landscape', 'iPhone 14 Pro landscape', { width: 852, height: 393 }]
];

module.exports = defineConfig({
  testDir: 'test',
  use: { baseURL, browserName: 'chromium' },
  projects: [
    {
      name: 'desktop',
      testIgnore: /mobile[\w-]*\.spec\.js/,
      use: { viewport: { width: 1280, height: 800 } }
    },
    ...phones.map(([name, device, viewport]) => ({
      name,
      testMatch: /mobile[\w-]*\.spec\.js/,
      use: { ...devices[device], viewport }
    }))
  ],
  webServer: {
    command: `node scripts/serve.js ${port}`,
    url: `${baseURL}/`,
    reuseExistingServer: !process.env.CI
  }
});
