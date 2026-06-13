import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

import { httpClient, ITEMS_PER_PAGE, NOTES_QUERY_KEY } from '../../config'
import { paginatedResponseSchema, toNote } from '../../mappers'
import type { NotesPage } from '../../types'

import type { UseFindNotesOptions } from './types'

const fetchNotes = async (
  page: number,
  sessionId?: string,
  signal?: AbortSignal
): Promise<NotesPage> => {
  const { data } = await httpClient.get('/api/notes', {
    headers: sessionId ? { 'x-test-session': sessionId } : undefined,
    params: { page, per_page: ITEMS_PER_PAGE },
    signal
  })
  const raw = paginatedResponseSchema.parse(data)
  return { items: raw.items.map(toNote), total: raw.total }
}

export const notesQueryOptions = (options: UseFindNotesOptions = {}) =>
  infiniteQueryOptions({
    queryKey: NOTES_QUERY_KEY,
    meta: { persist: false },
    staleTime: 30_000,
    queryFn: ({ pageParam, signal }) =>
      fetchNotes(pageParam, options.sessionId, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loaded = allPages.flatMap(page => page.items).length
      return loaded < lastPage.total ? lastPageParam + 1 : undefined
    },
    select: data => ({
      ...data,
      pages: data.pages.map(page => page.items)
    })
  })

export const useFindNotes = (sessionId?: string) =>
  useInfiniteQuery(notesQueryOptions({ sessionId }))
