import type { TestProject } from 'vitest/node'

import { generateMessages } from '@/i18n/messagesCodegen'

import setup from '..'

vi.mock('@/i18n/messagesCodegen', () => ({
  generateMessages: vi.fn()
}))

type TestsRerunCallback = () => Promise<void>

describe('[tests] globalSetup', () => {
  it('should generate messages before tests and reruns', async () => {
    const onTestsRerun = vi.fn()
    const project = { onTestsRerun } as unknown as TestProject

    setup(project)

    expect(generateMessages).toHaveBeenCalledTimes(1)
    expect(onTestsRerun).toHaveBeenCalledOnce()

    const rerunCallback = onTestsRerun.mock.calls.at(0)?.at(0)
    expect(rerunCallback).toBeDefined()

    await (rerunCallback as TestsRerunCallback)()

    expect(generateMessages).toHaveBeenCalledTimes(2)
  })
})
