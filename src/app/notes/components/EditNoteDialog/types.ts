import type { Note } from '../../services/types'

export type EditNoteDialogProps = {
  note: Note | null
  onClose: () => void
}
