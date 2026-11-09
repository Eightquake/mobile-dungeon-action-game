import { defineConfig, devices } from '@playwright/test';

// ADR-009: end-to-end tests in Chromium, Firefox, and WebKit against the production build.
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Pixel 7 landscape'] } },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 915, height: 412 } },
    },
    { name: 'webkit', use: { ...devices['iPhone 13 Pro landscape'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
