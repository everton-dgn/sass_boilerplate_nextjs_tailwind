import { cookies } from 'next/headers'

import { getServerTheme } from '..'

vi.mock('next/headers', () => ({
  cookies: vi.fn()
}))

const mockThemeCookie = (value?: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: () => (value === undefined ? undefined : { value })
  } as unknown as Awaited<ReturnType<typeof cookies>>)
}

describe('[helpers] getServerTheme', () => {
  it('should return the theme stored in the cookie', async () => {
    mockThemeCookie('light')

    await expect(getServerTheme()).resolves.toBe('light')
  })

  it('should fall back to the default theme when the cookie is missing', async () => {
    mockThemeCookie(undefined)

    await expect(getServerTheme()).resolves.toBe('dark')
  })

  it('should fall back to the default theme for invalid values', async () => {
    mockThemeCookie('neon')

    await expect(getServerTheme()).resolves.toBe('dark')
  })
})
