import { loadEnvFile } from 'node:process'

import { defineConfig, devices } from '@playwright/test'

loadEnvFile('.env.test')

const e2eHost = '127.0.0.1'
const e2ePort = 3100
const e2eBaseUrl = `http://${e2eHost}:${e2ePort}`

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',
  testMatch: '**/*.spec.ts',
  use: {
    // bypassCSP: true,
    // headless: false,
    // launchOptions: {
    //   slowMo: 600,
    // },
    // video: 'on',
    // screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    baseURL: e2eBaseUrl,
    locale: 'en-US'
  },
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    // {
    //   name: 'Edge',
    //   use: { ...devices['Desktop Edge'] },
    // }
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 7'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 14'] },
    // },
    // {
    //   name: 'Mobile Firefox',
    //   use: { ...devices['Pixel 7'], browserName: 'firefox' },
    // }
  ],
  webServer: {
    command: `E2E_TEST_MODE=true pnpm dev --hostname ${e2eHost} --port ${e2ePort}`,
    url: `${e2eBaseUrl}/en`,
    reuseExistingServer: !process.env.CI
  }
})
