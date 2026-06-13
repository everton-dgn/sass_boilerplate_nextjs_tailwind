import {
  useMutation,
  useMutationState,
  useQueryClient
} from '@tanstack/react-query'

import { httpClient, NOTES_QUERY_KEY } from '../../config'
import { createMutationCallbacks } from '../mutationDefaults'
import type { NotesCache } from '../types'

const DELETE_NOTE_KEY = ['deleteNote'] as const

export const useDeleteNotePendingIds = () =>
  useMutationState({
    filters: { mutationKey: DELETE_NOTE_KEY },
    select: mutation => {
      const { status, variables } = mutation.state
      if (status === 'pending' || status === 'success') {
        return variables as string
      }
      return null
    }
  }).filter(Boolean) as string[]

export const useDeleteNote = () => {
  const queryClient = useQueryClient()
  const callbacks = createMutationCallbacks(queryClient, {
    success: 'Nota excluída com sucesso.',
    error: 'Erro ao excluir nota.'
  })

  return useMutation({
    mutationKey: DELETE_NOTE_KEY,
    mutationFn: async (id: string) => {
      await httpClient.delete(`/api/notes/${id}`)
    },
    onMutate: async id => {
      await queryClient.cancelQueries({
        queryKey: NOTES_QUERY_KEY
      })
      const previous = queryClient.getQueryData<NotesCache>(NOTES_QUERY_KEY)
      queryClient.setQueryData<NotesCache>(NOTES_QUERY_KEY, old => {
        if (!old) return old
        const newTotal = Math.max(0, (old.pages[0]?.total ?? 0) - 1)
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.filter(note => note.id !== id),
            total: newTotal
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
