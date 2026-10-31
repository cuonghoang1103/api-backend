import { defineConfig, devices } from '@playwright/test';

// End-to-end tests (Chapter 7). Run: npm run test:e2e
export default defineConfig({
  testDir: '.',
  testMatch: ['e2e/**/*.spec.js', 'demo7/**/*.spec.js'],   // npm run test:e2e runs e2e/ only
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build:web && node e2e/server.js',
    url: 'http://localhost:4173/api/health',
    reuseExistingServer: false,   // always build and start fresh: the mutation script (Lab 7) depends on it
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.js/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] }, dependencies: ['setup'] },
  ],
});
