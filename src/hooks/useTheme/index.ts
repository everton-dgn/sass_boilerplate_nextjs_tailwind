import { createContext, useContext } from 'react'

import type { ThemeContextValue } from './types'

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
)

export const useTheme = (): ThemeContextValue => {
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return themeContext
}
