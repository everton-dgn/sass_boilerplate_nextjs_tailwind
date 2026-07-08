import type { Viewport } from 'next'
import type { ReactNode } from 'react'

import {
  DARK_MEDIA_QUERY,
  LIGHT_MEDIA_QUERY,
  THEME_COLORS
} from '@/constants/theme'

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  themeColor: [
    { media: LIGHT_MEDIA_QUERY, color: THEME_COLORS.light },
    { media: DARK_MEDIA_QUERY, color: THEME_COLORS.dark }
  ]
}

const RootLayout = ({ children }: { children: ReactNode }) => children

export default RootLayout
