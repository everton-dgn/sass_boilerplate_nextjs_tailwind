import type { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { NOTES_QUERY_KEY } from '../../config'

import type { MutationMessages } from './types'

export const createMutationCallbacks = (
  queryClient: QueryClient,
  messages: MutationMessages
) => ({
  onSuccess: () => {
    toast.success(messages.success)
  },
  onError: () => {
    toast.error(messages.error)
  },
  onSettled: () =>
    queryClient.invalidateQueries({
      queryKey: NOTES_QUERY_KEY
    })
})
