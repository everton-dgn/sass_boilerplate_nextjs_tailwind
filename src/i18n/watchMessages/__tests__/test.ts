import fs from 'node:fs'

import { generateMessages } from '../../messagesCodegen'
import { watchMessages } from '..'

vi.mock('../../messagesCodegen', () => ({
  generateMessages: vi.fn(),
  MESSAGES_DIR: 'src/i18n/messages',
  GENERATED_DIR_NAME: 'generated'
}))

type WatchListener = (event: string, filename: string | null) => void

const setupWatch = () => {
  let listener: WatchListener | undefined

  vi.spyOn(fs, 'watch').mockImplementation(((
    _dir: unknown,
    _options: unknown,
    callback: WatchListener
  ) => {
    listener = callback
    return { close: () => undefined } as fs.FSWatcher
  }) as typeof fs.watch)

  return () => listener
}

describe('[i18n] watchMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should regenerate messages when a source json changes', () => {
    const getListener = setupWatch()

    watchMessages('/root')
    getListener()?.('change', 'en/pages/Home.json')

    expect(generateMessages).toHaveBeenCalledWith('/root')
  })

  it('should ignore generated files and non-json files', () => {
    const getListener = setupWatch()

    watchMessages('/root')
    getListener()?.('change', 'generated/en.json')
    getListener()?.('change', 'readme.md')

    expect(generateMessages).not.toHaveBeenCalled()
  })
})
