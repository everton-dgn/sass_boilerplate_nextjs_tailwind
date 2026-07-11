import { hasLocale, type Locale } from 'next-intl'

import { routing } from '@/i18n/routing'

export const resolveLocale = (candidate: string): Locale =>
  hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale
