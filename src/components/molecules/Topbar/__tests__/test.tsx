import { screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

import { renderWithProviders } from '@/tests/providers/component'

import { Topbar } from '..'

const mockUsePathname = vi.fn()

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: vi.fn() })
}))

describe('[Component] Topbar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('should render the default brand', () => {
    renderWithProviders(<Topbar />)

    expect(screen.getByText('SaaS Boilerplate')).toBeInTheDocument()
  })

  it('should render custom children as title', () => {
    renderWithProviders(<Topbar>My App</Topbar>)

    expect(screen.getByText('My App')).toBeInTheDocument()
  })

  it('should render the navigation links', () => {
    renderWithProviders(<Topbar />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('should render the locale switcher and theme toggle', () => {
    renderWithProviders(<Topbar />)

    expect(screen.getByRole('button', { name: 'Language' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Select theme' })
    ).toBeInTheDocument()
  })

  it('should highlight the active link for home', () => {
    mockUsePathname.mockReturnValue('/')
    renderWithProviders(<Topbar />)

    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('text-foreground')
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('should highlight the 404 link outside home', () => {
    mockUsePathname.mockReturnValue('/404')
    renderWithProviders(<Topbar />)

    const homeLink = screen.getByText('Home')
    const notFoundLink = screen.getByText('404')
    expect(homeLink).toHaveClass('text-muted-foreground')
    expect(homeLink).not.toHaveAttribute('aria-current')
    expect(notFoundLink).toHaveClass('text-foreground')
    expect(notFoundLink).toHaveAttribute('aria-current', 'page')
  })
})
