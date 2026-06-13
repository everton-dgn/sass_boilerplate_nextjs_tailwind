import { deleteStore, getStore, resetStore, resolveSessionId } from '../store'
import type { NoteRecord } from '../store'

const testNote: NoteRecord = {
  id: 'note-id',
  title: 'Test note',
  content: 'Test content',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

describe('[api] notes store', () => {
  afterEach(() => {
    deleteStore('session-a')
    deleteStore('session-b')
    deleteStore('session-reset')
  })

  it('should isolate notes by session id', () => {
    const firstStore = getStore('session-a')
    const secondStore = getStore('session-b')

    firstStore.set(testNote.id, testNote)

    expect(firstStore.has(testNote.id)).toBe(true)
    expect(secondStore.has(testNote.id)).toBe(false)
  })

  it('should reset and recreate session state', () => {
    const sessionStore = getStore('session-reset')
    sessionStore.set(testNote.id, testNote)

    const resetSessionStore = resetStore('session-reset')

    expect(resetSessionStore.has(testNote.id)).toBe(false)

    deleteStore('session-reset')

    const recreatedSessionStore = getStore('session-reset')
    expect(recreatedSessionStore).not.toBe(resetSessionStore)
    expect(recreatedSessionStore.has(testNote.id)).toBe(false)
  })
})

describe('[api] resolveSessionId', () => {
  const buildRequest = (headers?: HeadersInit) =>
    new Request('http://localhost/api/notes', { headers })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should use the session header when test mode is enabled', () => {
    vi.stubEnv('E2E_TEST_MODE', 'true')

    const request = buildRequest({ 'x-test-session': 'session-from-header' })

    expect(resolveSessionId(request)).toBe('session-from-header')
  })

  it('should ignore the session header when test mode is disabled', () => {
    vi.stubEnv('E2E_TEST_MODE', '')

    const request = buildRequest({ 'x-test-session': 'session-from-header' })

    expect(resolveSessionId(request)).toBe('default')
  })

  it('should fall back to default when the header is missing', () => {
    vi.stubEnv('E2E_TEST_MODE', 'true')

    expect(resolveSessionId(buildRequest())).toBe('default')
  })
})
