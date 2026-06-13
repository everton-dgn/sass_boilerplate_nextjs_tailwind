import { QueryClient } from '@tanstack/react-query'

import { getDehydratedState } from '..'

describe('[helpers] getDehydratedState', () => {
  it('should normalize dataUpdatedAt for deterministic hydration', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['notes'], { items: [], total: 0 })

    const { queries } = getDehydratedState(queryClient)

    expect(queries.length).toBeGreaterThan(0)
    expect(queries.every(query => query.state.dataUpdatedAt === 1)).toBe(true)
  })
})
