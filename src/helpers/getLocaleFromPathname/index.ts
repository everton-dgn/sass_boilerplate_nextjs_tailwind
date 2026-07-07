import { routing } from '@/i18n/routing'

import { hasLocale, type Locale } from 'next-intl'

export const getLocaleFromPathname = (): Locale => {
  const segment = window.location.pathname.split('/')[1]

  return hasLocale(routing.locales, segment) ? segment : routing.defaultLocale
}
