import type { Locale } from 'next-intl'
import type { ReactNode } from 'react'

export type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}
