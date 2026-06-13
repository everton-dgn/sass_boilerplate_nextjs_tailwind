import { useMutation, useQueryClient } from '@tanstack/react-query'

import { httpClient } from '../../config'
import { noteResponseSchema, toNote } from '../../mappers'
import { createMutationCallbacks } from '../mutationDefaults'
import type { CreateNoteInput } from '../../types'

export const useCreateNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const { data } = await httpClient.post('/api/notes', input)
      return toNote(noteResponseSchema.parse(data))
    },
    ...createMutationCallbacks(queryClient, {
      success: 'Nota criada com sucesso.',
      error: 'Erro ao criar nota.'
    })
  })
}
