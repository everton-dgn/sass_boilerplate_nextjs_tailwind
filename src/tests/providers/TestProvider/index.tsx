import { type ReactNode, useState } from 'react'

import { ThemeSetup } from '@/components/atoms/MainProvider/ThemeSetup'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createTestQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSetup>{children}</ThemeSetup>
    </QueryClientProvider>
  )
}
