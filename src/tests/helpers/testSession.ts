import { createHash } from 'node:crypto'

import { test as base } from '@playwright/test'

const buildSessionId = (
  projectName: string,
  testKey: string,
  retry: number
) => {
  const hash = createHash('sha1')
    .update(`${projectName}:${testKey}:${retry}`)
    .digest('hex')
    .slice(0, 12)

  return `e2e-${projectName.toLowerCase()}-${retry}-${hash}`
}

export const test = base.extend<{
  sessionId: string
}>({
  sessionId: async ({ browserName: _browserName }, use, testInfo) => {
    const titlePath = testInfo.titlePath.slice(1).join(':')
    const testKey = `${testInfo.file}:${titlePath}`
    await use(buildSessionId(testInfo.project.name, testKey, testInfo.retry))
  },
  page: async ({ page, sessionId }, use) => {
    await page.context().setExtraHTTPHeaders({ 'x-test-session': sessionId })

    await use(page)
  }
})
