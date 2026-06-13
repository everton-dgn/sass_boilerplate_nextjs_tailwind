import type { ViewMode } from '@/infra/store/notesPreferences/types'

import type { Note } from '../../services/types'

export type NoteListProps = {
  viewMode: ViewMode
  notes: Note[]
  onEdit: (note: Note) => void
}
