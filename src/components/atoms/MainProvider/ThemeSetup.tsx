import type { ReactNode } from 'react'

import { ThemeProvider } from '../ThemeProvider'
import { Toast } from '../Toast'

export const ThemeSetup = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    {children}
    <Toast position="top-right" richColors />
  </ThemeProvider>
)
