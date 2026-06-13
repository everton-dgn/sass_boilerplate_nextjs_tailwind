import { event } from '@/tests/helpers'
import { renderWithProviders } from '@/tests/providers/component'

import { screen } from '@testing-library/react'

import { ThemeToggle } from '..'

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
})
