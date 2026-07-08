'use client'

import { defaultShouldDehydrateQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import { getQueryClient, persister } from '@/infra/adapters/queryClient'
import { ThemeSetup } from './ThemeSetup'
import type { MainProvidersProps } from './types'

export const MainProvider = ({ children }: MainProvidersProps) => (
  <PersistQueryClientProvider
    client={getQueryClient()}
    persistOptions={{
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) && query.meta?.persist !== false
      }
    }}
  >
    <ThemeSetup>{children}</ThemeSetup>
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>
)
