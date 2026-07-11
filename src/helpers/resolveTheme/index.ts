import type { Theme } from '@/constants/theme'
import { DEFAULT_THEME, THEMES } from '@/constants/theme'

export const resolveTheme = (value?: string | null): Theme => {
  if (!value) return DEFAULT_THEME

  return THEMES.includes(value as Theme) ? (value as Theme) : DEFAULT_THEME
}
