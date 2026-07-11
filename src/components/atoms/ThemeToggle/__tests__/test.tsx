import { screen } from '@testing-library/react'

import { event } from '@/tests/helpers'
import { installCookieMock } from '@/tests/helpers/cookieMock'
import { renderWithProviders } from '@/tests/providers/component'

import { ThemeToggle } from '..'

const openMenu = async () => {
  await event().click(screen.getByRole('button', { name: 'Select theme' }))
}

let cookieMock: ReturnType<typeof installCookieMock>

beforeEach(() => {
  cookieMock = installCookieMock()
  document.documentElement.classList.remove('light', 'dark')
})

afterEach(() => {
  cookieMock.restore()
  vi.restoreAllMocks()
})

describe('[Component] ThemeToggle', () => {
  it('should render the trigger button with an accessible label', () => {
    renderWithProviders(<ThemeToggle />)

    expect(
      screen.getByRole('button', { name: 'Select theme' })
    ).toBeInTheDocument()
  })

  it('should list light, dark and system options when opened', async () => {
    renderWithProviders(<ThemeToggle />)

    await openMenu()

    expect(
      screen.getByRole('menuitemradio', { name: 'Light' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: 'Dark' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: 'System' })
    ).toBeInTheDocument()
  })

  it('should apply the selected theme when an option is chosen', async () => {
    renderWithProviders(<ThemeToggle />)

    await openMenu()
    await event().click(screen.getByRole('menuitemradio', { name: 'Light' }))

    expect(document.cookie).toContain('theme=light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('should resolve the system option from the OS preference', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaQueryList)
    cookieMock.setCookie('theme', 'light')

    renderWithProviders(<ThemeToggle />)

    await openMenu()
    await event().click(screen.getByRole('menuitemradio', { name: 'System' }))

    expect(document.cookie).toContain('theme=system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should mark the active theme option', async () => {
    cookieMock.setCookie('theme', 'light')

    renderWithProviders(<ThemeToggle />)

    await openMenu()

    expect(
      screen.getByRole('menuitemradio', { name: 'Light' })
    ).toHaveAttribute('aria-checked', 'true')
  })
})
