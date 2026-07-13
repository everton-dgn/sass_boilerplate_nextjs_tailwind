import { warnLocaleParity } from '..'

const spyOnConsoleError = () =>
  vi.spyOn(console, 'error').mockImplementation(() => undefined)

describe('[i18n] warnLocaleParity', () => {
  it('should not warn when locales share the same keys', () => {
    const errorSpy = spyOnConsoleError()

    warnLocaleParity([
      ['en', { Home: { title: 'Home' } }],
      ['pt', { Home: { title: 'Início' } }]
    ])

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('should warn listing keys missing in a diverging locale', () => {
    const errorSpy = spyOnConsoleError()

    warnLocaleParity([
      ['en', { Home: { title: 'Home', subtitle: 'Sub' } }],
      ['pt', { Home: { title: 'Início' } }]
    ])

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Home.subtitle')
    )
    errorSpy.mockRestore()
  })

  it('should warn about extra keys absent from the reference locale', () => {
    const errorSpy = spyOnConsoleError()

    warnLocaleParity([
      ['en', { Home: { title: 'Home' } }],
      ['pt', { Home: { title: 'Início' }, Extra: { note: 'Nota' } }]
    ])

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Extra.note'))
    errorSpy.mockRestore()
  })

  it('should do nothing when there is a single locale', () => {
    const errorSpy = spyOnConsoleError()

    warnLocaleParity([['en', { Home: { title: 'Home' } }]])

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
