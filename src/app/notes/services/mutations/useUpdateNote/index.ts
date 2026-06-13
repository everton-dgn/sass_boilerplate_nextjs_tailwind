import { useMutation, useQueryClient } from '@tanstack/react-query'

import { httpClient, NOTES_QUERY_KEY } from '../../config'
import { noteResponseSchema, toNote } from '../../mappers'
import { createMutationCallbacks } from '../mutationDefaults'
import type { NotesCache, UpdateNoteVariables } from '../types'

export const useUpdateNote = () => {
  const queryClient = useQueryClient()
  const callbacks = createMutationCallbacks(queryClient, {
    success: 'Nota atualizada com sucesso.',
    error: 'Erro ao atualizar nota.'
  })

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateNoteVariables) => {
      const { data } = await httpClient.put(`/api/notes/${id}`, input)
      return toNote(noteResponseSchema.parse(data))
    },
    onMutate: async updated => {
      await queryClient.cancelQueries({
        queryKey: NOTES_QUERY_KEY
      })
      const previous = queryClient.getQueryData<NotesCache>(NOTES_QUERY_KEY)
      queryClient.setQueryData<NotesCache>(NOTES_QUERY_KEY, old => {
        if (!old) return old
        const updatedAt = new Date().toISOString()
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.map(note =>
              note.id === updated.id ? { ...note, ...updated, updatedAt } : note
            )
          }))
        }
      })
      return { previous }
    },
    onSuccess: callbacks.onSuccess,
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(NOTES_QUERY_KEY, context?.previous)
      callbacks.onError()
    },
    onSettled: callbacks.onSettled
  })
}
