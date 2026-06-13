import { renderHooksProvider } from '@/tests/providers/hook'

import { waitFor } from '@testing-library/react'

import { useQueryClient } from '@tanstack/react-query'

import type { NotesCache } from '../../types'

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
  title: 'Updated Note',
  content: 'Updated Content',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z'
}

const previousNote = {
  id: '1',
  title: 'Original Note',
  content: 'Original Content',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

const createNotesCache = (): NotesCache => ({
  pages: [{ items: [previousNote], total: 1 }],
  pageParams: [1]
})

const updateInput = {
  id: '1',
  title: 'Updated Note',
  content: 'Updated Content'
}

describe('[hooks] useUpdateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(httpClient.put).mockResolvedValue({
      data: noteResponse
    })
  })

  it('should call httpClient.put with correct params', async () => {
    const { useUpdateNote } = await import('..')
    const { result } = renderHooksProvider(() => useUpdateNote())

    result.current.mutate(updateInput)

    await waitFor(() => {
      expect(httpClient.put).toHaveBeenCalledWith('/api/notes/1', {
        title: 'Updated Note',
        content: 'Updated Content'
      })
    })
  })

  it('should call toast.success on success', async () => {
    const { useUpdateNote } = await import('..')
    const { result } = renderHooksProvider(() => useUpdateNote())

    result.current.mutate(updateInput)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Nota atualizada com sucesso.')
    })
  })

  it('should optimistically update the cached note with a fresh updatedAt', async () => {
    vi.mocked(httpClient.put).mockReturnValue(new Promise(() => undefined))

    const { useUpdateNote } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useUpdateNote(),
      queryClient: useQueryClient()
    }))

    result.current.queryClient.setQueryData(['notes'], createNotesCache())

    result.current.mutation.mutate(updateInput)

    await waitFor(() => {
      const cache = result.current.queryClient.getQueryData<NotesCache>([
        'notes'
      ])
      const note = cache?.pages[0]?.items[0]
      expect(note?.title).toBe('Updated Note')
      expect(note?.content).toBe('Updated Content')
      expect(note?.updatedAt).not.toBe(previousNote.updatedAt)
    })
  })

  it('should roll back the cache and toast an error when update fails', async () => {
    vi.mocked(httpClient.put).mockRejectedValue(new Error('network error'))

    const { useUpdateNote } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useUpdateNote(),
      queryClient: useQueryClient()
    }))

    result.current.queryClient.setQueryData(['notes'], createNotesCache())

    result.current.mutation.mutate(updateInput)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar nota.')
    })

    const cache = result.current.queryClient.getQueryData<NotesCache>(['notes'])
    expect(cache?.pages[0]?.items[0]).toEqual(previousNote)
  })

  it('should invalidate the notes query when the mutation settles', async () => {
    const { useUpdateNote } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useUpdateNote(),
      queryClient: useQueryClient()
    }))
    const invalidateSpy = vi.spyOn(
      result.current.queryClient,
      'invalidateQueries'
    )

    result.current.mutation.mutate(updateInput)

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
    })
  })
})
