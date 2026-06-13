import { useNotesPreferences } from '@/infra/store/notesPreferences'

import { useDeleteNotePendingIds } from '../../services/mutations/useDeleteNote'
import type { Note } from '../../services/types'

export const useSortedNotes = (pages?: Note[][]) => {
  const deletingIds = useDeleteNotePendingIds()
  const { stateNotesPreferences } = useNotesPreferences()

  const notes = (pages?.flat() ?? []).filter(
    note => !deletingIds.includes(note.id)
  )

  return [...notes].sort((a, b) =>
    stateNotesPreferences.sortOrder === 'newest'
      ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  )
}
