import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { parseMessageFile } from '..'

const createdRoots: string[] = []

const writeFixture = (content: string) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-message-file-'))
  createdRoots.push(root)
  const filePath = path.join(root, 'Home.json')
  fs.writeFileSync(filePath, content)
  return filePath
}

describe('[i18n] parseMessageFile', () => {
  afterAll(() => {
    for (const root of createdRoots) {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  it('should parse a valid messages file', () => {
    const filePath = writeFixture('{"Home":{"title":"Home"}}')

    expect(parseMessageFile(filePath)).toEqual({ Home: { title: 'Home' } })
  })

  it('should include the file path when the json is malformed', () => {
    const filePath = writeFixture('{"Home":')

    expect(() => parseMessageFile(filePath)).toThrow(
      `Failed to parse messages file "${filePath}"`
    )
  })
})
