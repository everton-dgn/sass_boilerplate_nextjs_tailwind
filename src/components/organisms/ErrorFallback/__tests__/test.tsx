import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/tests/providers/component'

import { ErrorFallback } from '..'

describe('[Component] ErrorFallback', () => {
  it('should render the not found variant', () => {
    renderWithProviders(<ErrorFallback reset={vi.fn()} />)

    const title = screen.getByRole('heading', {
      name: 'Page not found!'
    })

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(
      screen.getByText(
        "The page you're looking for doesn't exist or may have moved."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument()
  })

  it('should render the runtime error variant', () => {
    renderWithProviders(
      <ErrorFallback messageKey="somethingWrong" reset={vi.fn()} />
    )

    expect(
      screen.getByRole('heading', { name: 'Something went wrong!' })
    ).toBeInTheDocument()
    expect(
      screen.getByText("We couldn't complete your request. Please try again.")
    ).toBeInTheDocument()
  })

  it('should render the back to home action', () => {
    renderWithProviders(
      <ErrorFallback actionKey="backToHome" reset={vi.fn()} />
    )

    expect(
      screen.getByRole('button', { name: 'Back to home' })
    ).toBeInTheDocument()
  })
})
