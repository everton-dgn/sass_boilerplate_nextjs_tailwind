import type { SortOrder, ViewMode } from '@/infra/store/notesPreferences/types'

export type NotesToolbarProps = {
  viewMode: ViewMode
  sortOrder: SortOrder
  onToggleViewMode: () => void
  onToggleSortOrder: () => void
}
