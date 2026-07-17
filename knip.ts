import type { KnipConfig } from 'knip'

const config = {
  entry: [
    'src/global.ts!',
    'src/components/atoms/{Input,Textarea}/index.tsx!',
    'src/components/atoms/DropdownMenu/index.tsx!',
    'src/components/molecules/Dialog/index.tsx!',
    'src/constants/{clientEnv,serverEnv,sharedEnv}.ts!',
    'src/i18n/navigation.ts!',
    'src/infra/adapters/httpClient/index.ts!',
    'src/infra/store/{config,types}.ts!'
  ],
  project: [
    'src/**/*.{ts,tsx}!',
    'src/**/*.css!',
    '*.{js,ts}',
    '!src/**/__tests__/**!',
    '!src/tests/**!',
    '!src/constants/testMode/**!',
    '!src/i18n/messagesCodegen/**!',
    '!src/i18n/parseMessageFile/**!',
    '!src/i18n/warnLocaleParity/**!',
    '!src/i18n/watchMessages/**!'
  ],
  ignoreDependencies: [
    '@hookform/resolvers',
    '@next/third-parties',
    '@svgr/webpack',
    'react-hook-form',
    'react-microsoft-clarity',
    'tailwindcss!',
    'tw-animate-css!',
    'uuid'
  ],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  rules: {
    cycles: 'error'
  },
  treatConfigHintsAsErrors: true
} satisfies KnipConfig

export default config
