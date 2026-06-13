import { expect } from '@playwright/test'

import { test as base } from './testSession'

export const test = base.extend({
  page: async ({ page, request, sessionId }, use) => {
    const resetResponse = await request.post('/api/test/notes', {
      headers: { 'x-test-session': sessionId }
    })
    expect(resetResponse.ok(), 'failed to reset the notes test store').toBe(
      true
    )

    await use(page)

    const cleanupResponse = await request.delete('/api/test/notes', {
      headers: { 'x-test-session': sessionId }
    })
    expect(
      cleanupResponse.ok(),
      'failed to clean up the notes test store'
    ).toBe(true)
  }
})
