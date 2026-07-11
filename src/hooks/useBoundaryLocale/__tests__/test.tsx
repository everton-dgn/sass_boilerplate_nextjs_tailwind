import { renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'

import { useBoundaryLocale } from '..'

const LocaleProbe = () => <span>{useBoundaryLocale()}</span>

describe('[hooks] useBoundaryLocale', () => {
  it('should return the pathname locale on client mount', () => {
    window.history.pushState({}, '', '/pt/any-route')

    const { result } = renderHook(() => useBoundaryLocale())

    expect(result.current).toBe('pt')
  })

  it('should fall back to the default locale for unknown segments', () => {
    window.history.pushState({}, '', '/xx/any-route')

    const { result } = renderHook(() => useBoundaryLocale())

    expect(result.current).toBe('en')
  })

  it('should render the default locale on the server snapshot', () => {
    window.history.pushState({}, '', '/pt/any-route')

    expect(renderToString(<LocaleProbe />)).toContain('en')
  })
})
