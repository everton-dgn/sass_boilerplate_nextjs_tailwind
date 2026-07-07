import type { Viewport } from 'next'
import type { ReactNode } from 'react'

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  themeColor: '#ffffff'
}

const RootLayout = ({ children }: { children: ReactNode }) => children

export default RootLayout
