import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

import { IS_SERVER } from '@/constants/sharedEnv'

const FIVE_MINUTES = 1000 * 60 * 5
const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: FIVE_MINUTES,
        gcTime: TWENTY_FOUR_HOURS
      },
      dehydrate: {
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      }
    }
  })

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (IS_SERVER) return makeQueryClient()
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

export const persister: ReturnType<typeof createAsyncStoragePersister> =
  createAsyncStoragePersister({
    storage: IS_SERVER ? null : window.localStorage
  })
