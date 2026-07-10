import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/tests/providers/component'

import ErrorPage from '../error'

vi.mock('@/helpers/reportRuntimeError', () => ({
  reportRuntimeError: vi.fn()
}))

describe('[page] ErrorPage', () => {
  it('should use unstable retry when retrying a localized error', async () => {
    const user = userEvent.setup()
    const reset = vi.fn()
    const unstableRetry = vi.fn()

    renderWithProviders(
      <ErrorPage
        error={new Error('request failed')}
        reset={reset}
        unstable_retry={unstableRetry}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(unstableRetry).toHaveBeenCalledOnce()
    expect(reset).not.toHaveBeenCalled()
  })
})
