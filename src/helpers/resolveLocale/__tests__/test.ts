import { resolveLocale } from '..'

describe('[helpers] resolveLocale', () => {
  it('should return the candidate when it is a supported locale', () => {
    expect(resolveLocale('pt')).toBe('pt')
    expect(resolveLocale('es')).toBe('es')
    expect(resolveLocale('en')).toBe('en')
  })

  it('should fall back to the default locale for unknown values', () => {
    expect(resolveLocale('fr')).toBe('en')
    expect(resolveLocale('favicon.ico')).toBe('en')
    expect(resolveLocale('')).toBe('en')
  })
})
