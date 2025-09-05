import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'path';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
    actionTimeout: 30 * 1000,
    navigationTimeout: 30 * 1000,
  },
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: {
      mode: 'css',
      animations: 'disabled',
      caret: 'hide',
    },
    toMatchSnapshot: {
      threshold: 0.2
    }
  },
  globalSetup: resolve('./tests/setup/e2e.global-setup.ts'),
  globalTeardown: resolve('./tests/setup/e2e.global-teardown.ts'),
  projects: [
    // Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
    // Mobile devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },
    // Tablet devices
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
      dependencies: ['setup'],
    },
    // Edge cases
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      dependencies: ['setup'],
    },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: 'development',
      PORT: '5000',
      DATABASE_URL: process.env.PLAYWRIGHT_DATABASE_URL || process.env.DATABASE_URL,
      OPENAI_API_KEY: 'test-openai-key',
      GOOGLE_ANALYTICS_PROPERTY_ID: 'test-ga-property',
      TWILIO_ACCOUNT_SID: 'test-twilio-sid',
      TWILIO_AUTH_TOKEN: 'test-twilio-token'
    }
  },
  outputDir: 'test-results/',
});