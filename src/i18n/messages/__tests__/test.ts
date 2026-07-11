import enMessages from '@/i18n/messages/generated/en.json' with { type: 'json' }
import esMessages from '@/i18n/messages/generated/es.json' with { type: 'json' }
import ptMessages from '@/i18n/messages/generated/pt.json' with { type: 'json' }

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

const collectPlaceholderPaths = (node: unknown, prefix = ''): string[] => {
  if (typeof node === 'string') {
    const tokens = [...node.matchAll(/\{[^}]+\}/g)]
      .map(match => match[0])
      .toSorted((left, right) => left.localeCompare(right))

    return [`${prefix}=${tokens.join('|')}`]
  }

  if (typeof node !== 'object' || node === null) {
    return [`${prefix}=`]
  }

  return Object.keys(node)
    .toSorted()
    .flatMap(key =>
      collectPlaceholderPaths(
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

  it('should keep es message placeholders in parity with en', () => {
    expect(collectPlaceholderPaths(esMessages)).toEqual(
      collectPlaceholderPaths(enMessages)
    )
  })

  it('should keep pt message placeholders in parity with en', () => {
    expect(collectPlaceholderPaths(ptMessages)).toEqual(
      collectPlaceholderPaths(enMessages)
    )
  })
})
