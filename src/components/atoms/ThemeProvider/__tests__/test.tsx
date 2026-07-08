import { THEME_COLORS } from '@/constants/theme'

import { act, render, renderHook, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { ThemeProvider, useTheme } from '..'

type MediaQueryChangeListener = (event: MediaQueryListEvent) => void

const createMatchMediaMock = (initialMatches: boolean) => {
  const listeners = new Set<MediaQueryChangeListener>()
  const state = { matches: initialMatches }

  const mediaQueryList = {
    get matches() {
      return state.matches
    },
    addEventListener: (_type: string, listener: MediaQueryChangeListener) => {
      listeners.add(listener)
    },
    removeEventListener: (
      _type: string,
      listener: MediaQueryChangeListener
    ) => {
      listeners.delete(listener)
    }
  }

  vi.spyOn(window, 'matchMedia').mockReturnValue(
    mediaQueryList as unknown as MediaQueryList
  )

  const dispatchChange = (nextMatches: boolean) => {
    state.matches = nextMatches

    for (const listener of listeners) {
      listener({ matches: nextMatches } as MediaQueryListEvent)
    }
  }

  return { dispatchChange }
}

const ThemeConsumer = () => {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme()

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="system-theme">{systemTheme}</span>
      <button type="button" onClick={() => setTheme('light')}>
        set light
      </button>
      <button type="button" onClick={() => setTheme('system')}>
        set system
      </button>
    </div>
  )
}

const renderWithProvider = () =>
  render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  )

describe('[Component] ThemeProvider', () => {
  beforeEach(() => {
    document.cookie = 'theme=; path=/; max-age=0'
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

  it('should provide the default theme when no cookie is set', () => {
    renderWithProvider()

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should read the initial theme from the cookie', () => {
    document.cookie = 'theme=light; path=/'

    renderWithProvider()

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('should fall back to the default theme for invalid cookie values', () => {
    document.cookie = 'theme=neon; path=/'

    renderWithProvider()

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('should apply the theme to the DOM and persist it when set', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'set light' }))

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(document.cookie).toContain('theme=light')
  })

  it('should expose the explicit theme as the resolved theme', () => {
    document.cookie = 'theme=light; path=/'

    renderWithProvider()

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
  })

  it('should resolve the system theme from the media query state', () => {
    createMatchMediaMock(true)
    document.cookie = 'theme=system; path=/'

    renderWithProvider()

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should react to system scheme changes while on the system theme', () => {
    const { dispatchChange } = createMatchMediaMock(false)
    document.cookie = 'theme=system; path=/'

    renderWithProvider()

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')

    act(() => dispatchChange(true))

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('system-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should persist the system preference when set', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'set system' }))

    expect(document.cookie).toContain('theme=system')
    expect(['light', 'dark']).toContain(
      document.documentElement.style.colorScheme
    )
  })

  it('should sync theme-color metas with the resolved theme', async () => {
    const themeColorMeta = document.createElement('meta')
    themeColorMeta.setAttribute('name', 'theme-color')
    document.head.appendChild(themeColorMeta)

    const user = userEvent.setup()
    renderWithProvider()

    expect(themeColorMeta.getAttribute('content')).toBe(THEME_COLORS.dark)

    await user.click(screen.getByRole('button', { name: 'set light' }))

    expect(themeColorMeta.getAttribute('content')).toBe(THEME_COLORS.light)
  })

  it('should throw when useTheme is used outside the provider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    )

    consoleError.mockRestore()
  })
})
