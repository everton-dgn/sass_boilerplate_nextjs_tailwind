import type { ReactNode } from 'react'

import type { Locale } from 'next-intl'

export type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}
