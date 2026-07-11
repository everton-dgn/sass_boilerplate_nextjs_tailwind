import { renderHook } from '@testing-library/react'

import { ThemeProvider } from '@/components/atoms/ThemeProvider'

import { useTheme } from '..'

describe('[hooks] useTheme', () => {
  it('should throw when used outside the provider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    )

    consoleError.mockRestore()
  })

  it('should expose the theme context value inside the provider', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    })

    expect(result.current).toEqual(
      expect.objectContaining({ setTheme: expect.any(Function) })
    )
  })
})
