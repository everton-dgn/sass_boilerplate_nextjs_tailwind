import { event } from '@/tests/helpers'
import { renderWithProviders } from '@/tests/providers/component'

import { screen } from '@testing-library/react'

import { ThemeToggle } from '..'

beforeEach(() => {
  document.cookie = 'theme=; path=/; max-age=0'
  document.documentElement.classList.remove('light', 'dark')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[Component] ThemeToggle', () => {
  it('should render the toggle button', () => {
    renderWithProviders(<ThemeToggle />)

    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })

  it('should have an accessible label', () => {
    renderWithProviders(<ThemeToggle />)

    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label')
  })

  it('should call setTheme when clicked', async () => {
    renderWithProviders(<ThemeToggle />)

    const btn = screen.getByRole('button')
    await event().click(btn)

    expect(btn).toBeInTheDocument()
  })

  it('should toggle from the resolved theme when the system theme is active', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaQueryList)
    document.cookie = 'theme=system; path=/'

    renderWithProviders(<ThemeToggle />)

    const btn = screen.getByRole('button', { name: 'Switch to light mode' })
    await event().click(btn)

    expect(document.cookie).toContain('theme=light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})
