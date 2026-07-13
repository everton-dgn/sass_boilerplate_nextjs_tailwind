import type { LocaleMessages } from '../messagesCodegen/types'

const isRecord = (value: unknown): value is LocaleMessages =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const collectKeyPaths = (messages: LocaleMessages, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) => {
    const keyPath = prefix ? `${prefix}.${key}` : key
    return isRecord(value) ? collectKeyPaths(value, keyPath) : [keyPath]
  })

export const warnLocaleParity = (
  messagesByLocale: readonly (readonly [string, LocaleMessages])[]
) => {
  const [reference, ...rest] = messagesByLocale
  if (!reference) return

  const [referenceLocale, referenceMessages] = reference
  const referenceKeys = new Set(collectKeyPaths(referenceMessages))

  for (const [locale, messages] of rest) {
    const keys = new Set(collectKeyPaths(messages))
    const missing = [...referenceKeys].filter(key => !keys.has(key))
    const extra = [...keys].filter(key => !referenceKeys.has(key))

    if (missing.length > 0 || extra.length > 0) {
      console.error(
        `[i18n] locale "${locale}" diverges from "${referenceLocale}" — ` +
          `missing: [${missing.join(', ')}], extra: [${extra.join(', ')}]`
      )
    }
  }
}
