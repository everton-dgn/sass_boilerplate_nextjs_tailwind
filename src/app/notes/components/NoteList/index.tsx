import { cn } from '@/helpers/cn'

import { NoteCard } from '../NoteCard'

import type { NoteListProps } from './types'

export const NoteList = ({ viewMode, notes, onEdit }: NoteListProps) => (
  <div
    className={cn(
      'gap-4',
      viewMode === 'grid'
        ? 'grid sm:grid-cols-2 lg:grid-cols-3'
        : 'flex flex-col gap-3'
    )}
  >
    {notes.map(note => (
      <NoteCard key={note.id} note={note} viewMode={viewMode} onEdit={onEdit} />
    ))}
  </div>
)
