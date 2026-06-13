'use client'

import { ErrorFallback } from '@/components/organisms/ErrorFallback'
import { cn } from '@/helpers/cn'
import { geistSans } from '@/theme/fontFamily'

type ErrorProps = {
  error: Error
  reset: () => void
}

const GlobalError = ({ error, reset }: ErrorProps) => (
  <html
    lang="pt-BR"
    className={cn(geistSans.variable)}
    suppressHydrationWarning
  >
    <head>
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width"
        name="viewport"
      />
      <meta content="Project frontend with nextjs" name="description" />
      <meta content="#fff" name="theme-color" />
      <link href="/favicon.png" rel="icon" type="image/png" />
      <link href="/favicon.png" rel="apple-touch-icon" />
      <title>Error Page</title>
    </head>

    <body>
      <ErrorFallback reset={reset} />
      <p>{error.message}</p>
    </body>
  </html>
)

export default GlobalError
