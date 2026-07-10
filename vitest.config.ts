import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { generateMessages } from './src/i18n/messagesCodegen'

generateMessages()

const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url))
}

const shared = {
  pool: 'threads' as const,
  css: false,
  globals: true,
  passWithNoTests: true,
  clearMocks: true,
  exclude: ['**/node_modules/**', '**/playwright/**'],
  server: {
    deps: {
      inline: ['next-intl']
    }
  }
}

export default defineConfig({
  resolve: { alias },
  plugins: [react()],
  test: {
    ...shared,
    coverage: {
      provider: 'v8',
      include: ['**/src/**/*.ts', '**/src/**/*.tsx'],
      exclude: [
        '**/tests/**',
        '**/src/theme/fontFamily.ts',
        '**/src/app/**/error.tsx',
        '**/src/app/**/not-found.tsx',
        '**/src/app/global-not-found.tsx',
        '**/src/app/global-error.tsx',
        '**/src/**/layout.tsx',
        '**/src/**/page.tsx',
        '**/src/**/loading.tsx',
        '**/src/**/types.ts',
        '**/src/@types/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },
    projects: [
      {
        resolve: {
          alias: {
            ...alias,
            'server-only': fileURLToPath(
              new URL('./node_modules/server-only/empty.js', import.meta.url)
            )
          }
        },
        test: {
          ...shared,
          name: 'node',
          environment: 'node',
          include: ['src/**/test.ts']
        }
      },
      {
        plugins: [react()],
        resolve: {
          alias,
          conditions: ['development', 'browser']
        },
        test: {
          ...shared,
          name: 'dom',
          environment: 'happy-dom',
          deps: {
            optimizer: {
              client: { enabled: false }
            }
          },
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/test.tsx']
        }
      }
    ]
  }
})
