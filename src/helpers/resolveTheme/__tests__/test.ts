import { resolveTheme } from '..'

describe('[helpers] resolveTheme', () => {
  it('should return the theme when the value is valid', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
    expect(resolveTheme('system')).toBe('system')
  })

  it('should fall back to the default theme for invalid values', () => {
    expect(resolveTheme('neon')).toBe('dark')
  })

  it('should fall back to the default theme for empty values', () => {
    expect(resolveTheme('')).toBe('dark')
    expect(resolveTheme(null)).toBe('dark')
    expect(resolveTheme(undefined)).toBe('dark')
  })
})
