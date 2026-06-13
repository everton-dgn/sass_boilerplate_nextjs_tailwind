import { renderHooksProvider } from '@/tests/providers/hook'

import { waitFor } from '@testing-library/react'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null
}))

vi.mock('@/app/notes/services/config', () => ({
  NOTES_QUERY_KEY: ['notes'],
  ITEMS_PER_PAGE: 3,
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

const { httpClient } = await import('@/app/notes/services/config')

const paginatedResponse = {
  items: [
    {
      id: '1',
      title: 'Note 1',
      content: 'Content 1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    }
  ],
  total: 1
}

describe('[hooks] useFindNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(httpClient.get).mockResolvedValue({
      data: paginatedResponse
    })
  })

  it('should fetch notes from /api/notes', async () => {
    const { useFindNotes } = await import('..')
    renderHooksProvider(() => useFindNotes())

    await waitFor(() => {
      expect(httpClient.get).toHaveBeenCalledWith(
        '/api/notes',
        expect.objectContaining({
          params: { page: 1, per_page: 3 }
        })
      )
    })
  })

  it('should forward the session header when provided', async () => {
    const { useFindNotes } = await import('..')
    renderHooksProvider(() => useFindNotes('session-123'))

    await waitFor(() => {
      expect(httpClient.get).toHaveBeenCalledWith(
        '/api/notes',
        expect.objectContaining({
          headers: { 'x-test-session': 'session-123' },
          params: { page: 1, per_page: 3 }
        })
      )
    })
  })

  it('should return mapped notes data', async () => {
    const { useFindNotes } = await import('..')
    const { result } = renderHooksProvider(() => useFindNotes())

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const pages = result.current.data?.pages
    expect(pages?.[0]).toEqual([
      {
        id: '1',
        title: 'Note 1',
        content: 'Content 1',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z'
      }
    ])
  })
})
