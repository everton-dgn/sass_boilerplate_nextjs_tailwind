import type { Note } from '@/app/notes/services/types'
import { renderHooksProvider } from '@/tests/providers/hook'

const mocks = vi.hoisted(() => ({
  pendingIds: [] as string[],
  sortOrder: 'newest' as 'newest' | 'oldest'
}))

vi.mock('@/app/notes/services/mutations/useDeleteNote', () => ({
  useDeleteNotePendingIds: () => mocks.pendingIds
}))

vi.mock('@/infra/store/notesPreferences', () => ({
  useNotesPreferences: () => ({
    stateNotesPreferences: { sortOrder: mocks.sortOrder }
  })
}))

const createNote = (id: string, updatedAt: string): Note => ({
  id,
  title: `Note ${id}`,
  content: `Content ${id}`,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt
})

const olderNote = createNote('older', '2026-01-01T00:00:00.000Z')
const newerNote = createNote('newer', '2026-02-01T00:00:00.000Z')

describe('[hooks] useSortedNotes', () => {
  beforeEach(() => {
    mocks.pendingIds = []
    mocks.sortOrder = 'newest'
  })

  it('should flatten pages and sort by newest first', async () => {
    const { useSortedNotes } = await import('..')
    const { result } = renderHooksProvider(() =>
      useSortedNotes([[olderNote], [newerNote]])
    )

    expect(result.current).toEqual([newerNote, olderNote])
  })

  it('should sort by oldest when preference is oldest', async () => {
    mocks.sortOrder = 'oldest'

    const { useSortedNotes } = await import('..')
    const { result } = renderHooksProvider(() =>
      useSortedNotes([[newerNote, olderNote]])
    )

    expect(result.current).toEqual([olderNote, newerNote])
  })

  it('should filter out notes pending deletion', async () => {
    mocks.pendingIds = [olderNote.id]

    const { useSortedNotes } = await import('..')
    const { result } = renderHooksProvider(() =>
      useSortedNotes([[olderNote, newerNote]])
    )

    expect(result.current).toEqual([newerNote])
  })

  it('should return an empty array when pages are undefined', async () => {
    const { useSortedNotes } = await import('..')
    const { result } = renderHooksProvider(() => useSortedNotes(undefined))

    expect(result.current).toEqual([])
  })
})
