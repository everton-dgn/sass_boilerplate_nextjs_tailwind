import type { ViewMode } from '@/infra/store/notesPreferences/types'

import type { Note } from '../../services/types'

export type NoteCardProps = {
  viewMode: ViewMode
  note: Note
  onEdit: (note: Note) => void
}
