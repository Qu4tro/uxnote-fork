const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'test',
  use: { baseURL: 'http://localhost:4173', browserName: 'chromium' },
  webServer: {
    command: 'node scripts/serve.js 4173',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI
  }
});
