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

import type { AppConfig, Locale } from 'next-intl'

type GlobalErrorMessages = Pick<AppConfig['Messages'], 'Error'>
type GlobalMetadataMessages = Pick<AppConfig['Messages'], 'Metadata'>

export const ERROR_MESSAGES = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages
} as Record<Locale, GlobalErrorMessages>

export const METADATA_MESSAGES = {
  en: enMetadata,
  es: esMetadata,
  pt: ptMetadata
} as Record<Locale, GlobalMetadataMessages>
