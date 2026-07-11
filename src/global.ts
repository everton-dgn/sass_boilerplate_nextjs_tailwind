import type { routing } from '@/i18n/routing'

type EnMessages = typeof import('@/i18n/messages/generated/en.json')

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: EnMessages['default']
  }
}
