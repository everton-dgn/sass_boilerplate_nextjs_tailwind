'use client'

import type { CSSProperties } from 'react'

import {
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
  XCircle
} from 'lucide-react'
import { Toaster, type ToasterProps } from 'sonner'

import { useTheme } from '../ThemeProvider/useTheme'

export const Toast = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Toaster
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <XCircle className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)'
        } as CSSProperties
      }
      {...props}
    />
  )
}
