'use client'

import { useState } from 'react'

import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { useNotesPreferences } from '@/infra/store/notesPreferences'

import { Loader2 } from 'lucide-react'

import { EditNoteDialog } from './components/EditNoteDialog'
import { NoteList } from './components/NoteList'
import { NotesToolbar } from './components/NotesToolbar'
import { useCreateNoteForm } from './hooks/useCreateNoteForm'
import { useSortedNotes } from './hooks/useSortedNotes'
import { useFindNotes } from './services/queries/useFindNotes'
import type { Note } from './services/types'

import type { NotesClientProps } from './types'

export const NotesClient = ({ sessionId }: NotesClientProps) => {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFindNotes(sessionId)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const { stateNotesPreferences } = useNotesPreferences()
  const { form, formKey, isPending, onSubmit } = useCreateNoteForm()
  const sorted = useSortedNotes(data?.pages)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-14">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 pt-14">
        <p className="text-destructive">Erro ao carregar notas.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pt-24 pb-12">
      <header className="flex items-center gap-3">
        <div>
          <h1 className="font-semibold text-2xl">Notas</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Demonstração de React Query + Zustand
          </p>
        </div>
        {isFetching && !isLoading && (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        )}
      </header>

      <form
        key={formKey}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Título da nota"
            variant={form.formState.errors.title ? 'destructive' : 'default'}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-destructive text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Textarea
            placeholder="Conteúdo da nota"
            variant={form.formState.errors.content ? 'destructive' : 'default'}
            {...form.register('content')}
          />
          {form.formState.errors.content && (
            <p className="text-destructive text-sm">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending ? 'Criando...' : 'Criar nota'}
          </Button>
        </div>
      </form>

      <NotesToolbar
        sortOrder={stateNotesPreferences.sortOrder}
        viewMode={stateNotesPreferences.viewMode}
        onToggleSortOrder={stateNotesPreferences.setToggleSortOrder}
        onToggleViewMode={stateNotesPreferences.setToggleViewMode}
      />

      {sorted.length ? (
        <NoteList
          notes={sorted}
          viewMode={stateNotesPreferences.viewMode}
          onEdit={setEditingNote}
        />
      ) : (
        <p className="text-center text-muted-foreground">
          Nenhuma nota encontrada. Crie a primeira!
        </p>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            disabled={isFetchingNextPage}
            variant="outline"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Mostrar mais'}
          </Button>
        </div>
      )}

      <EditNoteDialog note={editingNote} onClose={() => setEditingNote(null)} />
    </div>
  )
}
