import { renderWithProviders } from '@/tests/providers/component'

import { screen } from '@testing-library/react'

import { ErrorFallback } from '..'

describe('[Component] ErrorFallback', () => {
  it('should the following section title: Page not found!', () => {
    renderWithProviders(<ErrorFallback reset={vi.fn()} />)

    const heading = screen.getByRole('banner')
    const title = screen.getByRole('heading', {
      name: 'Page not found!'
    })

    expect(heading).toHaveTextContent('Error!')
    expect(title).toBeInTheDocument()
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
