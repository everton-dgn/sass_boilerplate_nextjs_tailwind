import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()'
  }
]

const nextConfig: NextConfig = {
  headers: () => [{ source: '/(.*)', headers: securityHeaders }],
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  images: {
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ],
    formats: ['image/webp'],
    loader: 'default',
    path: '/_next/image'
  },
  typedRoutes: true,
  reactCompiler: true,
  reactStrictMode: true,
  cacheComponents: true,
  poweredByHeader: false,
  devIndicators: false
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)
