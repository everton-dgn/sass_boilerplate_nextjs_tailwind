import { messages as enMessages } from '@/i18n/messages/en'
import { messages as esMessages } from '@/i18n/messages/es'
import { messages as ptMessages } from '@/i18n/messages/pt'

const collectKeyPaths = (node: unknown, prefix = ''): string[] => {
  if (typeof node !== 'object' || node === null) {
    return [prefix]
  }

  return Object.keys(node)
    .toSorted()
    .flatMap(key =>
      collectKeyPaths(
        (node as Record<string, unknown>)[key],
        prefix ? `${prefix}.${key}` : key
      )
    )
}

describe('[i18n] messages', () => {
  it('should keep es message keys in parity with en', () => {
    expect(collectKeyPaths(esMessages)).toEqual(collectKeyPaths(enMessages))
  })

  it('should keep pt message keys in parity with en', () => {
    expect(collectKeyPaths(ptMessages)).toEqual(collectKeyPaths(enMessages))
  })
})
