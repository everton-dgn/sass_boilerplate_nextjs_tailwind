import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { generateMessages, mergeMessageFiles } from '..'

const createdRoots: string[] = []

const createFixtureRoot = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'messages-codegen-'))
  createdRoots.push(root)
  const messagesDir = path.join(root, 'src/i18n/messages')

  const write = (relativePath: string, content: object) => {
    const filePath = path.join(messagesDir, relativePath)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(content))
  }

  return { root, messagesDir, write }
}

const readGenerated = (messagesDir: string, locale: string) => {
  const file = path.join(messagesDir, 'generated', `${locale}.json`)
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

describe('[i18n] messagesCodegen', () => {
  afterAll(() => {
    for (const root of createdRoots) {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  it('should merge namespaces from multiple files', () => {
    const merged = mergeMessageFiles([
      { file: 'a.json', content: { Home: { title: 'Home' } } },
      { file: 'b.json', content: { Topbar: { brand: 'Brand' } } }
    ])

    expect(merged).toEqual({
      Home: { title: 'Home' },
      Topbar: { brand: 'Brand' }
    })
  })

  it('should throw when a namespace is duplicated across files', () => {
    expect(() =>
      mergeMessageFiles([
        { file: 'a.json', content: { Home: {} } },
        { file: 'b.json', content: { Home: {} } }
      ])
    ).toThrow('Duplicated namespace "Home" in "b.json"')
  })

  it('should generate merged json per locale with common translations', () => {
    const { root, messagesDir, write } = createFixtureRoot()
    write('en/pages/Home.json', { Home: { title: 'Home' } })
    write('pt/pages/Home.json', { Home: { title: 'Início' } })
    write('common/en.json', { Common: { save: 'Save' } })
    write('__tests__/fake.json', { Fake: {} })

    generateMessages(root)

    expect(readGenerated(messagesDir, 'en')).toEqual({
      Home: { title: 'Home' },
      Common: { save: 'Save' }
    })
    expect(readGenerated(messagesDir, 'pt')).toEqual({
      Home: { title: 'Início' }
    })
    expect(fs.readdirSync(path.join(messagesDir, 'generated'))).toEqual([
      'en.json',
      'pt.json'
    ])
  })

  it('should not rewrite generated files when content is unchanged', () => {
    const { root, write } = createFixtureRoot()
    write('en/pages/Home.json', { Home: {} })

    generateMessages(root)
    const writeSpy = vi.spyOn(fs, 'writeFileSync')
    generateMessages(root)

    expect(writeSpy).not.toHaveBeenCalled()
    writeSpy.mockRestore()
  })
})
