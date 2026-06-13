import { dehydrate, type QueryClient } from '@tanstack/react-query'

export const getDehydratedState = (queryClient: QueryClient) => {
  const dehydratedState = dehydrate(queryClient)
  for (const query of dehydratedState.queries) {
    query.state.dataUpdatedAt = 1
  }
  return dehydratedState
}
