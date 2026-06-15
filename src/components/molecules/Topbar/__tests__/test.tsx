import { renderWithProviders } from '@/tests/providers/component'

import { screen } from '@testing-library/react'

import { Topbar } from '..'

const mockUsePathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname()
}))

describe('[Component] Topbar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('should render the default title', () => {
    renderWithProviders(<Topbar />)

    expect(screen.getByText('SaaS Boilerplate')).toBeInTheDocument()
  })

  it('should render custom children as title', () => {
    renderWithProviders(<Topbar>My App</Topbar>)

    expect(screen.getByText('My App')).toBeInTheDocument()
  })

  it('should render the theme toggle button', () => {
    renderWithProviders(<Topbar />)

    const toggleBtn = screen.getByRole('button')
    expect(toggleBtn).toBeInTheDocument()
  })

  it('should highlight the active link for home', () => {
    mockUsePathname.mockReturnValue('/')
    renderWithProviders(<Topbar />)

    const homeLink = screen.getByText('Início')
    expect(homeLink).toHaveClass('text-foreground')
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('should render the home link as inactive outside home', () => {
    mockUsePathname.mockReturnValue('/settings')
    renderWithProviders(<Topbar />)

    const homeLink = screen.getByText('Início')
    expect(homeLink).toHaveClass('text-muted-foreground')
    expect(homeLink).not.toHaveAttribute('aria-current')
  })
})
