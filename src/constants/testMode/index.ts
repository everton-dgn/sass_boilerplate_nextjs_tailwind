import 'server-only'

export const isTestModeEnabled = () => process.env.E2E_TEST_MODE === 'true'
