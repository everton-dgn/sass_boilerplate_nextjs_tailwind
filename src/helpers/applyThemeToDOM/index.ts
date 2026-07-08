import { IS_SERVER } from '@/constants/sharedEnv'
import type { ResolvedTheme, Theme } from '@/constants/theme'
import { DARK_MEDIA_QUERY, THEME_COLORS } from '@/constants/theme'

const canUseMatchMedia = () => !IS_SERVER && 'matchMedia' in window

export const getSystemTheme = (): ResolvedTheme =>
  canUseMatchMedia() && window.matchMedia(DARK_MEDIA_QUERY).matches
    ? 'dark'
    : 'light'

const suppressTransitions = () => {
  const disableAllTransitions =
    '*,*::before,*::after{transition:none!important}'
  const style = document.createElement('style')

  style.appendChild(document.createTextNode(disableAllTransitions))
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    window.setTimeout(() => style.remove(), 1)
  }
}

export const applyThemeToDOM = (theme: Theme) => {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement
  const restoreTransitions = suppressTransitions()

  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  const themeColorMetas = document.querySelectorAll('meta[name="theme-color"]')

  for (const meta of themeColorMetas) {
    meta.setAttribute('content', THEME_COLORS[resolvedTheme])
  }

  restoreTransitions()
}
