import { QueryClient } from '@tanstack/react-query'

import { createMutationCallbacks } from '..'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}))

const { toast } = await import('sonner')

describe('[mutations] createMutationCallbacks', () => {
  const messages = {
    success: 'Created successfully.',
    error: 'Failed to create.'
  }

  it('should call toast.success with the success message', () => {
    const callbacks = createMutationCallbacks(new QueryClient(), messages)

    callbacks.onSuccess()

    expect(toast.success).toHaveBeenCalledWith(messages.success)
  })

  it('should call toast.error with the error message', () => {
    const callbacks = createMutationCallbacks(new QueryClient(), messages)

    callbacks.onError()

    expect(toast.error).toHaveBeenCalledWith(messages.error)
  })

  it('should invalidate notes query on settled', async () => {
    const queryClient = new QueryClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const callbacks = createMutationCallbacks(queryClient, messages)

    await callbacks.onSettled()

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
  })
})
