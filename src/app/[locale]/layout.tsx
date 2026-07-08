import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  getTranslations,
  setRequestLocale
} from 'next-intl/server'

import { MainProvider } from '@/components/atoms/MainProvider'
import { ThemeScript } from '@/components/atoms/ThemeScript'
import { Topbar } from '@/components/molecules/Topbar'
import { cn } from '@/helpers/cn'
import { routing } from '@/i18n/routing'
import { geistSans } from '@/theme/fontFamily'

import '@/theme/globals.css'

import type { LocaleLayoutProps } from './types'

export const generateStaticParams = () =>
  routing.locales.map(locale => ({ locale }))

export const generateMetadata = async ({
  params
}: Omit<LocaleLayoutProps, 'children'>): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`
    },
    description: t('description'),
    icons: {
      icon: { url: '/favicon.png', type: 'image/png' },
      apple: '/favicon.png'
    }
  }
}

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages({ locale })
  const clientMessages = {
    Error: messages.Error,
    LocaleSwitcher: messages.LocaleSwitcher,
    ThemeToggle: messages.ThemeToggle,
    Topbar: messages.Topbar
  }

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeScript />
        <MainProvider>
          <NextIntlClientProvider messages={clientMessages}>
            <Topbar />
            {children}
          </NextIntlClientProvider>
        </MainProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
