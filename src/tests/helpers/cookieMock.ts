type CookieMock = {
  setCookie: (name: string, value: string) => void
  clearCookies: () => void
  restore: () => void
  cookieStoreSet: ReturnType<typeof vi.fn>
}

export const installCookieMock = (): CookieMock => {
  const store = new Map<string, string>()

  Object.defineProperty(document, 'cookie', {
    get: () =>
      [...store.entries()]
        .map(([name, value]) => `${name}=${value}`)
        .join('; '),
    configurable: true
  })

  const cookieStoreSet = vi.fn(
    (options: { name: string; value: string }): Promise<void> => {
      store.set(options.name, options.value)
      return Promise.resolve()
    }
  )

  vi.stubGlobal('cookieStore', { set: cookieStoreSet })

  return {
    setCookie: (name, value) => {
      store.set(name, value)
    },
    clearCookies: () => {
      store.clear()
    },
    restore: () => {
      Reflect.deleteProperty(document, 'cookie')
      vi.unstubAllGlobals()
    },
    cookieStoreSet
  }
}
