import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { MainProvider } from '@/components/atoms/MainProvider'
import { Topbar } from '@/components/molecules/Topbar'
import { cn } from '@/helpers/cn'
import { geistSans } from '@/theme/fontFamily'
import '@/theme/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SaaS Boilerplate',
    template: '%s | SaaS Boilerplate'
  },
  description: 'Project frontend with Next.js',
  icons: {
    icon: { url: '/favicon.png', type: 'image/png' },
    apple: '/favicon.png'
  }
}

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  themeColor: '#ffffff'
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="pt-BR"
    className={cn(geistSans.variable)}
    suppressHydrationWarning
  >
    <body>
      <MainProvider>
        <Topbar />
        {children}
      </MainProvider>
    </body>
  </html>
)

export default RootLayout
