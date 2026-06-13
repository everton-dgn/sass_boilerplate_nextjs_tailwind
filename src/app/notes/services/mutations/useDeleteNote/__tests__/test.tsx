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

const cachedNote = {
  id: 'note-123',
  title: 'Cached Note',
  content: 'Cached Content',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

const createNotesCache = (total = 1): NotesCache => ({
  pages: [{ items: [cachedNote], total }],
  pageParams: [1]
})

describe('[hooks] useDeleteNote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(httpClient.delete).mockResolvedValue({
      data: null
    })
  })

  it('should call httpClient.delete with correct id', async () => {
    const { useDeleteNote } = await import('..')
    const { result } = renderHooksProvider(() => useDeleteNote())

    result.current.mutate('note-123')

    await waitFor(() => {
      expect(httpClient.delete).toHaveBeenCalledWith('/api/notes/note-123')
    })
  })

  it('should call toast.success on success', async () => {
    const { useDeleteNote } = await import('..')
    const { result } = renderHooksProvider(() => useDeleteNote())

    result.current.mutate('note-123')

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Nota excluída com sucesso.')
    })
  })

  it('should optimistically remove the note and clamp total at zero', async () => {
    vi.mocked(httpClient.delete).mockReturnValue(new Promise(() => undefined))

    const { useDeleteNote } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useDeleteNote(),
      queryClient: useQueryClient()
    }))

    result.current.queryClient.setQueryData(['notes'], createNotesCache(0))

    result.current.mutation.mutate('note-123')

    await waitFor(() => {
      const cache = result.current.queryClient.getQueryData<NotesCache>([
        'notes'
      ])
      expect(cache?.pages[0]?.items).toEqual([])
      expect(cache?.pages[0]?.total).toBe(0)
    })
  })

  it('should roll back the cache and toast an error when deletion fails', async () => {
    vi.mocked(httpClient.delete).mockRejectedValue(new Error('network error'))

    const { useDeleteNote } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useDeleteNote(),
      queryClient: useQueryClient()
    }))

    result.current.queryClient.setQueryData(['notes'], createNotesCache())

    result.current.mutation.mutate('note-123')

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir nota.')
    })

    const cache = result.current.queryClient.getQueryData<NotesCache>(['notes'])
    expect(cache?.pages[0]?.items).toEqual([cachedNote])
    expect(cache?.pages[0]?.total).toBe(1)
  })

  it('should expose ids for pending and successful deletions', async () => {
    let resolveDelete: () => void = () => undefined
    vi.mocked(httpClient.delete).mockImplementation(
      () =>
        new Promise(resolve => {
          resolveDelete = () => resolve({ data: null })
        })
    )

    const { useDeleteNote, useDeleteNotePendingIds } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useDeleteNote(),
      pendingIds: useDeleteNotePendingIds()
    }))

    expect(result.current.pendingIds).toEqual([])

    result.current.mutation.mutate('note-123')

    await waitFor(() => {
      expect(result.current.pendingIds).toEqual(['note-123'])
    })

    resolveDelete()

    await waitFor(() => {
      expect(result.current.mutation.isSuccess).toBe(true)
    })
    expect(result.current.pendingIds).toEqual(['note-123'])
  })

  it('should not expose ids for failed deletions', async () => {
    vi.mocked(httpClient.delete).mockRejectedValue(new Error('network error'))

    const { useDeleteNote, useDeleteNotePendingIds } = await import('..')
    const { result } = renderHooksProvider(() => ({
      mutation: useDeleteNote(),
      pendingIds: useDeleteNotePendingIds()
    }))

    result.current.mutation.mutate('note-456')

    await waitFor(() => {
      expect(result.current.mutation.isError).toBe(true)
    })
    expect(result.current.pendingIds).toEqual([])
  })
})
