export type Theme = 'light' | 'dark' | 'system'

export type ResolvedTheme = Exclude<Theme, 'system'>

export const THEMES: Theme[] = ['light', 'dark', 'system']

export const DEFAULT_THEME: Theme = 'dark'

export const THEME_COOKIE_NAME = 'theme'

export const THEME_COOKIE_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 365

export const THEME_BROADCAST_CHANNEL = 'theme'

export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const LIGHT_MEDIA_QUERY = '(prefers-color-scheme: light)'

export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#ffffff',
  dark: '#09090b'
}
