'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useEffect } from 'react'

import { buildThemeScript } from '@/components/atoms/ThemeScript'
import { ErrorFallback } from '@/components/organisms/ErrorFallback'
import { IS_DEVELOPMENT } from '@/constants/sharedEnv'
import {
  DARK_MEDIA_QUERY,
  LIGHT_MEDIA_QUERY,
  THEME_COLORS
} from '@/constants/theme'
import { cn } from '@/helpers/cn'
import { reportRuntimeError } from '@/helpers/reportRuntimeError'
import { useBoundaryLocale } from '@/hooks/useBoundaryLocale'
import { geistSans } from '@/theme/fontFamily'

import { ERROR_MESSAGES, METADATA_MESSAGES } from './constants'
import type { ErrorPageProps } from './types'

import '@/theme/globals.css'

const GlobalError = (props: ErrorPageProps) => {
  const { error } = props
  const unstableRetry = props.unstable_retry
  const locale = useBoundaryLocale()
  const messages = ERROR_MESSAGES[locale]

  useEffect(() => {
    reportRuntimeError(error)
  }, [error])

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width"
          name="viewport"
        />
        <meta
          content={METADATA_MESSAGES[locale].Metadata.description}
          name="description"
        />
        <meta
          content={THEME_COLORS.light}
          media={LIGHT_MEDIA_QUERY}
          name="theme-color"
        />
        <meta
          content={THEME_COLORS.dark}
          media={DARK_MEDIA_QUERY}
          name="theme-color"
        />
        <link href="/favicon.png" rel="icon" type="image/png" />
        <link href="/favicon.png" rel="apple-touch-icon" />
        <title>{messages.Error.title}</title>
        <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />
      </head>

      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorFallback messageKey="somethingWrong" reset={unstableRetry} />
        </NextIntlClientProvider>
        {IS_DEVELOPMENT ? (
          <p
            className={cn(
              'fixed inset-x-4 bottom-4 z-10 mx-auto max-h-24 max-w-2xl',
              'overflow-auto break-words px-4 py-2 text-center font-mono',
              'text-muted-foreground text-xs'
            )}
          >
            {error.message}
          </p>
        ) : null}
      </body>
    </html>
  )
}

export default GlobalError
