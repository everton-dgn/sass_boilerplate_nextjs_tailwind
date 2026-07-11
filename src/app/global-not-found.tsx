'use client'

import { ArrowLeft } from 'lucide-react'
import { useId, useSyncExternalStore } from 'react'

import { buildThemeScript } from '@/components/atoms/ThemeScript'
import {
  DARK_MEDIA_QUERY,
  LIGHT_MEDIA_QUERY,
  THEME_COLORS
} from '@/constants/theme'
import { cn } from '@/helpers/cn'
import { getLocaleFromPathname } from '@/helpers/getLocaleFromPathname'
import { routing } from '@/i18n/routing'
import { geistSans } from '@/theme/fontFamily'

import { ERROR_MESSAGES, METADATA_MESSAGES } from './constants'

import '@/theme/globals.css'

const subscribeToLocale = () => () => undefined

const getServerLocale = () => routing.defaultLocale

const GlobalNotFound = () => {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleFromPathname,
    getServerLocale
  )
  const titleId = useId()
  const descriptionId = useId()
  const messages = ERROR_MESSAGES[locale]

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
        <title>{messages.Error.notFound}</title>
        <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />
      </head>

      <body>
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background px-4 py-10 sm:px-6">
          <div
            aria-hidden
            className="-translate-1/2 absolute top-1/2 left-1/2 size-80 rounded-full bg-primary/5 blur-3xl sm:size-112"
          />
          <section
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            className="relative flex w-full max-w-3xl flex-col items-center text-center"
          >
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/90 px-3.5 py-1.5 font-medium text-foreground text-xs uppercase tracking-[0.16em] shadow-foreground/10 shadow-xs backdrop-blur-sm dark:border-foreground/10 dark:bg-muted/50 dark:text-foreground/70 dark:shadow-none">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-foreground ring-4 ring-foreground/10 dark:bg-foreground/60 dark:ring-foreground/5"
              />
              404
            </p>
            <h1
              className="max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl"
              id={titleId}
            >
              {messages.Error.notFound}
            </h1>
            <p
              className="mt-5 max-w-xl text-balance text-base text-muted-foreground leading-7 sm:text-lg"
              id={descriptionId}
            >
              {messages.Error.notFoundDescription}
            </p>
            <a
              className="mt-10 inline-flex h-10 min-w-40 items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground text-sm outline-none transition-all hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              href={`/${locale}`}
            >
              <ArrowLeft aria-hidden className="size-4" />
              <span>{messages.Error.backToHome}</span>
            </a>
          </section>
        </main>
      </body>
    </html>
  )
}

export default GlobalNotFound
