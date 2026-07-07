'use client'

import { useEffect, useState } from 'react'

import { ErrorFallback } from '@/components/organisms/ErrorFallback'
import { IS_DEVELOPMENT } from '@/constants/sharedEnv'
import { cn } from '@/helpers/cn'
import { getLocaleFromPathname } from '@/helpers/getLocaleFromPathname'
import { reportRuntimeError } from '@/helpers/reportRuntimeError'
import { routing } from '@/i18n/routing'
import { geistSans } from '@/theme/fontFamily'

import { type Locale, NextIntlClientProvider } from 'next-intl'

import { ERROR_MESSAGES, METADATA_MESSAGES } from './constants'
import type { ErrorPageProps } from './types'

const GlobalError = ({ error, reset }: ErrorPageProps) => {
  const [locale, setLocale] = useState<Locale>(routing.defaultLocale)
  const messages = ERROR_MESSAGES[locale]

  useEffect(() => {
    setLocale(getLocaleFromPathname())
  }, [])

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
        <meta content="#fff" name="theme-color" />
        <link href="/favicon.png" rel="icon" type="image/png" />
        <link href="/favicon.png" rel="apple-touch-icon" />
        <title>{messages.Error.title}</title>
      </head>

      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorFallback messageKey="somethingWrong" reset={reset} />
        </NextIntlClientProvider>
        {IS_DEVELOPMENT ? <p>{error.message}</p> : null}
      </body>
    </html>
  )
}

export default GlobalError
