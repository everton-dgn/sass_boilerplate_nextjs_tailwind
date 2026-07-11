'use client'

import { useServerInsertedHTML } from 'next/navigation'

import {
  DARK_MEDIA_QUERY,
  DEFAULT_THEME,
  THEME_COOKIE_NAME,
  THEMES
} from '@/constants/theme'

export const buildThemeScript = (): string => `(() => {
  try {
    const cookieRow = document.cookie
      .split('; ')
      .find(row => row.startsWith('${THEME_COOKIE_NAME}='))
    let cookieValue = ''
    if (cookieRow) {
      try {
        cookieValue = decodeURIComponent(
          cookieRow.slice('${THEME_COOKIE_NAME}='.length)
        )
      } catch {
        cookieValue = ''
      }
    }
    const theme = ${JSON.stringify(THEMES)}.includes(cookieValue)
      ? cookieValue
      : '${DEFAULT_THEME}'
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('${DARK_MEDIA_QUERY}').matches
          ? 'dark'
          : 'light'
        : theme
    const root = document.documentElement
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme
  } catch {}
})()`

export const ThemeScript = () => {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />
  ))

  return null
}
