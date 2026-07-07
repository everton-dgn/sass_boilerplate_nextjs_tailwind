import enMessages from '@/i18n/messages/en/components/Error.json' with {
  type: 'json'
}
import enMetadata from '@/i18n/messages/en/pages/Metadata.json' with {
  type: 'json'
}
import esMessages from '@/i18n/messages/es/components/Error.json' with {
  type: 'json'
}
import esMetadata from '@/i18n/messages/es/pages/Metadata.json' with {
  type: 'json'
}
import ptMessages from '@/i18n/messages/pt/components/Error.json' with {
  type: 'json'
}
import ptMetadata from '@/i18n/messages/pt/pages/Metadata.json' with {
  type: 'json'
}

import type { Locale } from 'next-intl'

export const ERROR_MESSAGES: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages
}

export const METADATA_MESSAGES: Record<Locale, typeof enMetadata> = {
  en: enMetadata,
  es: esMetadata,
  pt: ptMetadata
}
