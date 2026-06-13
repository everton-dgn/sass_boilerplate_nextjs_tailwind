import { isTestModeEnabled } from '..'

describe('[constants] isTestModeEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should return true when E2E_TEST_MODE is "true"', () => {
    vi.stubEnv('E2E_TEST_MODE', 'true')

    expect(isTestModeEnabled()).toBe(true)
  })

  it('should return false when E2E_TEST_MODE is not "true"', () => {
    vi.stubEnv('E2E_TEST_MODE', '')

    expect(isTestModeEnabled()).toBe(false)
  })
})
