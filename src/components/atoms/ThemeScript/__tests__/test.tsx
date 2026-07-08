import { runInNewContext } from 'node:vm'

import { render } from '@testing-library/react'
import { useServerInsertedHTML } from 'next/navigation'
import type { ReactElement } from 'react'

import { buildThemeScript, ThemeScript } from '..'

vi.mock('next/navigation', () => ({
  useServerInsertedHTML: vi.fn()
}))

type RunThemeScriptProps = {
  cookie: string
  prefersDark?: boolean
}

const runThemeScript = ({
  cookie,
  prefersDark = false
}: RunThemeScriptProps) => {
  const addedClasses: string[] = []
  const style: { colorScheme?: string } = {}
  const sandbox = {
    document: {
      cookie,
      documentElement: {
        classList: {
          add: (className: string) => addedClasses.push(className)
        },
        style
      }
    },
    window: {
      matchMedia: () => ({ matches: prefersDark })
    },
    decodeURIComponent
  }

  runInNewContext(buildThemeScript(), sandbox)

  return { addedClasses, style }
}

describe('[Component] ThemeScript', () => {
  it('should apply the theme stored in the cookie', () => {
    const { addedClasses, style } = runThemeScript({ cookie: 'theme=light' })

    expect(addedClasses).toEqual(['light'])
    expect(style.colorScheme).toBe('light')
  })

  it('should apply the default theme when no cookie is set', () => {
    const { addedClasses, style } = runThemeScript({ cookie: '' })

    expect(addedClasses).toEqual(['dark'])
    expect(style.colorScheme).toBe('dark')
  })

  it('should apply the default theme for invalid cookie values', () => {
    const { addedClasses } = runThemeScript({ cookie: 'theme=neon' })

    expect(addedClasses).toEqual(['dark'])
  })

  it('should resolve the system theme through the media query', () => {
    const { addedClasses } = runThemeScript({
      cookie: 'theme=system',
      prefersDark: true
    })

    expect(addedClasses).toEqual(['dark'])
  })

  it('should ignore unrelated cookies', () => {
    const { addedClasses } = runThemeScript({
      cookie: 'session=abc; theme=light; locale=en'
    })

    expect(addedClasses).toEqual(['light'])
  })

  it('should render nothing and insert the script during SSR', () => {
    const { container } = render(<ThemeScript />)

    expect(container).toBeEmptyDOMElement()

    expect(useServerInsertedHTML).toHaveBeenCalledTimes(1)

    const insertHTML = vi.mocked(useServerInsertedHTML).mock.lastCall?.[0]
    const scriptElement = insertHTML?.() as ReactElement<{
      dangerouslySetInnerHTML: { __html: string }
    }>

    expect(scriptElement.props.dangerouslySetInnerHTML.__html).toBe(
      buildThemeScript()
    )
  })
})
