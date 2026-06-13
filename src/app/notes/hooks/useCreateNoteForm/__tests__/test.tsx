import { renderHooksProvider } from '@/tests/providers/hook'

import { act, waitFor } from '@testing-library/react'

const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null
}))

vi.mock('@/app/notes/services/mutations/useCreateNote', () => ({
  useCreateNote: () => ({
    mutate: mockMutate,
    isPending: false
  })
}))

describe('[hooks] useCreateNoteForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', async () => {
    const { useCreateNoteForm } = await import('..')
    const { result } = renderHooksProvider(() => useCreateNoteForm())

    expect(result.current.form.getValues()).toEqual({
      title: '',
      content: ''
    })
    expect(result.current.isPending).toBe(false)
    expect(result.current.formKey).toBe(0)
  })

  it('should call createNote.mutate on submit', async () => {
    const { useCreateNoteForm } = await import('..')
    const { result } = renderHooksProvider(() => useCreateNoteForm())

    const values = {
      title: 'New Note',
      content: 'Note content'
    }

    act(() => {
      result.current.onSubmit(values)
    })

    expect(mockMutate).toHaveBeenCalledWith(
      values,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('should reset form and increment key on success', async () => {
    mockMutate.mockImplementation(
      (_values: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess()
      }
    )

    const { useCreateNoteForm } = await import('..')
    const { result } = renderHooksProvider(() => useCreateNoteForm())

    act(() => {
      result.current.form.setValue('title', 'Test')
      result.current.form.setValue('content', 'Content')
    })

    act(() => {
      result.current.onSubmit({
        title: 'Test',
        content: 'Content'
      })
    })

    await waitFor(() => {
      expect(result.current.formKey).toBe(1)
    })
  })
})
