import { getLocaleFromPathname } from '..'

const stubPathname = (pathname: string) => {
  vi.stubGlobal('window', { location: { pathname } })
}

describe('[helpers] getLocaleFromPathname', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return the locale from the first path segment', () => {
    stubPathname('/pt/dashboard')

    expect(getLocaleFromPathname()).toBe('pt')
  })

  it('should fall back to the default locale for unknown segments', () => {
    stubPathname('/unknown/page')

    expect(getLocaleFromPathname()).toBe('en')
  })

  it('should fall back to the default locale on the root path', () => {
    stubPathname('/')

    expect(getLocaleFromPathname()).toBe('en')
  })
})
