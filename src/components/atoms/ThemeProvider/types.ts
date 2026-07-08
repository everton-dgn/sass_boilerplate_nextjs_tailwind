import type { ReactNode } from 'react'

import type { ResolvedTheme, Theme } from '@/constants/theme'

export type ThemeProviderProps = {
  children: ReactNode
}

export type ThemeContextValue = {
  theme: Theme | undefined
  resolvedTheme: ResolvedTheme | undefined
  systemTheme: ResolvedTheme | undefined
  setTheme: (theme: Theme) => void
}
