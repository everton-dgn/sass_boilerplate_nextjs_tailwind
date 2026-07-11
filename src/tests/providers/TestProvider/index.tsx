import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { type ReactNode, useState } from 'react'

import { ThemeSetup } from '@/components/atoms/MainProvider/ThemeSetup'
import messages from '@/i18n/messages/generated/en.json' with { type: 'json' }

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createTestQueryClient)

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ThemeSetup>{children}</ThemeSetup>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
