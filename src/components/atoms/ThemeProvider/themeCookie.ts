import { IS_SERVER } from '@/constants/sharedEnv'
import type { Theme } from '@/constants/theme'
import {
  THEME_COOKIE_MAX_AGE_IN_SECONDS,
  THEME_COOKIE_NAME
} from '@/constants/theme'
import { resolveTheme } from '@/helpers/resolveTheme'

const themeCookiePrefix = `${THEME_COOKIE_NAME}=`

const decodeCookieValue = (rawValue: string): string | undefined => {
  try {
    return decodeURIComponent(rawValue)
  } catch {
    return undefined
  }
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

export const readInitialTheme = (): Theme | undefined =>
  IS_SERVER ? undefined : readThemeCookie()

export const writeThemeCookie = (theme: Theme) => {
  document.cookie = [
    `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}`,
    'path=/',
    `max-age=${THEME_COOKIE_MAX_AGE_IN_SECONDS}`,
    'samesite=lax'
  ].join('; ')
}
