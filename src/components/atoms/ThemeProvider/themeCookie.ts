import type { Theme } from '@/constants/theme'
import {
  THEME_COOKIE_MAX_AGE_IN_SECONDS,
  THEME_COOKIE_NAME
} from '@/constants/theme'
import { resolveTheme } from '@/helpers/resolveTheme'

const MILLISECONDS_IN_SECOND = 1000

const themeCookiePrefix = `${THEME_COOKIE_NAME}=`

const decodeCookieValue = (rawValue: string): string | undefined => {
  try {
    return decodeURIComponent(rawValue)
  } catch {
    return undefined
  }
}

const writeThemeCookieWithDocument = (theme: Theme) => {
  const attributes = [
    `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}`,
    'path=/',
    `max-age=${THEME_COOKIE_MAX_AGE_IN_SECONDS}`,
    'samesite=lax'
  ]

  if (window.location.protocol === 'https:') {
    attributes.push('secure')
  }

  document.cookie = attributes.join('; ')
}

export const readThemeCookie = (): Theme => {
  const cookieRow = document.cookie
    .split('; ')
    .find(row => row.startsWith(themeCookiePrefix))

  return resolveTheme(
    cookieRow
      ? decodeCookieValue(cookieRow.slice(themeCookiePrefix.length))
      : undefined
  )
}

export const writeThemeCookie = (theme: Theme) => {
  if (!('cookieStore' in window)) {
    writeThemeCookieWithDocument(theme)
    return
  }

  window.cookieStore
    .set({
      name: THEME_COOKIE_NAME,
      value: encodeURIComponent(theme),
      path: '/',
      expires:
        Date.now() + THEME_COOKIE_MAX_AGE_IN_SECONDS * MILLISECONDS_IN_SECOND,
      sameSite: 'lax'
    })
    .catch(() => writeThemeCookieWithDocument(theme))
}
