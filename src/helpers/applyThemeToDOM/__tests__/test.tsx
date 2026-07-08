import { THEME_COLORS } from '@/constants/theme'

import { applyThemeToDOM, getSystemTheme } from '..'

const mockMatchMedia = (matches: boolean) =>
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  } as unknown as MediaQueryList)

beforeEach(() => {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.style.colorScheme = ''

  for (const style of document.head.querySelectorAll('style')) {
    style.remove()
  }

  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.remove()
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[helpers] applyThemeToDOM', () => {
  it('should apply the resolved theme class and color scheme', () => {
    applyThemeToDOM('light')

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('should resolve the system theme through the media query', () => {
    mockMatchMedia(true)

    applyThemeToDOM('system')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('should sync theme-color metas with the resolved theme', () => {
    const themeColorMeta = document.createElement('meta')
    themeColorMeta.setAttribute('name', 'theme-color')
    document.head.appendChild(themeColorMeta)

    applyThemeToDOM('dark')

    expect(themeColorMeta.getAttribute('content')).toBe(THEME_COLORS.dark)
  })

  it('should suppress CSS transitions only while applying the theme', () => {
    vi.useFakeTimers()

    applyThemeToDOM('light')

    const styleTag = document.head.querySelector('style')
    expect(styleTag?.textContent).toContain('transition:none!important')

    vi.advanceTimersByTime(1)

    expect(document.head.querySelector('style')).toBeNull()

    vi.useRealTimers()
  })

  it('should return light from getSystemTheme when the media query does not match', () => {
    mockMatchMedia(false)

    expect(getSystemTheme()).toBe('light')
  })

  it('should return dark from getSystemTheme when the media query matches', () => {
    mockMatchMedia(true)

    expect(getSystemTheme()).toBe('dark')
  })
})
