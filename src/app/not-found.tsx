'use client'

import type { Locale } from 'next-intl'
import { useEffect, useState } from 'react'

import { cn } from '@/helpers/cn'
import { getLocaleFromPathname } from '@/helpers/getLocaleFromPathname'
import { routing } from '@/i18n/routing'
import { geistSans } from '@/theme/fontFamily'

import { ERROR_MESSAGES } from './constants'

import '@/theme/globals.css'

const GlobalNotFound = () => {
  const [locale, setLocale] = useState<Locale>(routing.defaultLocale)
  const messages = ERROR_MESSAGES[locale]

  useEffect(() => {
    setLocale(getLocaleFromPathname())
  }, [])

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable)}
      suppressHydrationWarning
    >
      <body>
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-2">
          <header className="mb-8 font-medium text-4xl">404</header>
          <h1 className="text-center font-medium text-3xl">
            {messages.Error.notFound}
          </h1>
        </div>
      </body>
    </html>
  )
}

export default GlobalNotFound
