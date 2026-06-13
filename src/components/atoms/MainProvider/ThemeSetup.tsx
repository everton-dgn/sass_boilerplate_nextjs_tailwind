import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

import { Toast } from '../Toast'

export const ThemeSetup = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    {children}
    <Toast position="top-right" richColors />
  </ThemeProvider>
)
