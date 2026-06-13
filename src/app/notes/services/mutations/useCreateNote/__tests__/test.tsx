import { renderHooksProvider } from '@/tests/providers/hook'

import { waitFor } from '@testing-library/react'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null
}))

vi.mock('@/app/notes/services/config', () => ({
  NOTES_QUERY_KEY: ['notes'],
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

const { toast } = await import('sonner')
const { httpClient } = await import('@/app/notes/services/config')

const noteResponse = {
  id: '1',
  title: 'Test Note',
  content: 'Test Content',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z'
}

describe('[hooks] useCreateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(httpClient.post).mockResolvedValue({
      data: noteResponse
    })
  })

  it('should call httpClient.post with correct params', async () => {
    const { useCreateNote } = await import('..')
    const { result } = renderHooksProvider(() => useCreateNote())

    const input = {
      title: 'Test Note',
      content: 'Test Content'
    }

    result.current.mutate(input)

    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalledWith('/api/notes', input)
    })
  })

  it('should call toast.success on success', async () => {
    const { useCreateNote } = await import('..')
    const { result } = renderHooksProvider(() => useCreateNote())

    result.current.mutate({
      title: 'Test Note',
      content: 'Test Content'
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Nota criada com sucesso.')
    })
  })
})
