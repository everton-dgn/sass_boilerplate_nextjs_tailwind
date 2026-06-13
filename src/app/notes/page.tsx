import { headers } from 'next/headers'
import { connection } from 'next/server'

import { getQueryClient } from '@/infra/adapters/queryClient'

import { HydrationBoundary } from '@tanstack/react-query'

import { getDehydratedState } from './helpers/getDehydratedState'
import { notesQueryOptions } from './services/queries/useFindNotes'

import { NotesClient } from './Client'

const NotesPage = async () => {
  await connection()
  const requestHeaders = await headers()
  const sessionId = requestHeaders.get('x-test-session') ?? undefined
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery(notesQueryOptions({ sessionId }))

  const dehydratedState = getDehydratedState(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient sessionId={sessionId} />
    </HydrationBoundary>
  )
}

export default NotesPage
