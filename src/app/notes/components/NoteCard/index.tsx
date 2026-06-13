import { Button } from '@/components/atoms/Button'
import { cn } from '@/helpers/cn'

import { Pencil, Trash2 } from 'lucide-react'

import { useDeleteNote } from '../../services/mutations/useDeleteNote'

import type { NoteCardProps } from './types'

export const NoteCard = ({ viewMode, note, onEdit }: NoteCardProps) => {
  const deleteNote = useDeleteNote()
  const isList = viewMode === 'list'
  const editLabel = `Editar nota ${note.title}`
  const deleteLabel = `Excluir nota ${note.title}`
  const headingId = `note-title-${note.id}`

  return (
    <article
      aria-labelledby={headingId}
      data-note-id={note.id}
      className={cn(
        'rounded-xl border border-border bg-card',
        'transition-colors hover:border-primary/50',
        isList ? 'flex items-center gap-4 px-6 py-4' : 'flex flex-col gap-3 p-6'
      )}
    >
      <h3
        id={headingId}
        className={cn(
          'min-w-0 truncate font-semibold text-base',
          isList && 'shrink-0 basis-1/4'
        )}
      >
        {note.title}
      </h3>
      <p
        className={cn(
          'text-muted-foreground text-sm',
          isList ? 'min-w-0 flex-1 truncate' : 'line-clamp-2'
        )}
      >
        {note.content}
      </p>
      <div
        className={cn(
          'flex items-center',
          isList ? 'shrink-0 gap-1' : 'justify-between gap-2'
        )}
      >
        {!isList && (
          <span className="text-muted-foreground text-xs">
            {new Date(note.createdAt).toLocaleDateString('pt-BR')}
          </span>
        )}
        <div className="flex shrink-0 gap-1">
          <Button
            aria-label={editLabel}
            size="icon"
            variant="ghost"
            onClick={() => onEdit(note)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            aria-label={deleteLabel}
            size="icon"
            variant="ghost"
            onClick={() => deleteNote.mutate(note.id)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </article>
  )
}
