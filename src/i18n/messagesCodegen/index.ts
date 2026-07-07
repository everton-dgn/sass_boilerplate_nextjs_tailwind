import fs from 'node:fs'
import path from 'node:path'

import type { LocaleMessages, MessageFile } from './types'

const MESSAGES_DIR = 'src/i18n/messages'
const GENERATED_DIR_NAME = 'generated'
const NON_LOCALE_DIRS = new Set([GENERATED_DIR_NAME, 'common', '__tests__'])
const JSON_INDENT = 2

export const mergeMessageFiles = (files: MessageFile[]): LocaleMessages => {
  const merged: LocaleMessages = {}
  for (const { file, content } of files) {
    for (const [namespace, value] of Object.entries(content)) {
      if (namespace in merged) {
        throw new Error(`Duplicated namespace "${namespace}" in "${file}"`)
      }
      merged[namespace] = value
    }
  }

  return merged
}

const listLocales = (messagesDir: string): string[] =>
  fs
    .readdirSync(messagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !NON_LOCALE_DIRS.has(entry.name))
    .map(entry => entry.name)
    .toSorted()

const readMessageFiles = (
  messagesDir: string,
  locale: string
): MessageFile[] => {
  const localeDir = path.join(messagesDir, locale)
  const commonFile = path.join(messagesDir, 'common', `${locale}.json`)
  const files = fs
    .globSync('**/*.json', { cwd: localeDir })
    .toSorted()
    .map(file => path.join(localeDir, file))

  if (fs.existsSync(commonFile)) files.push(commonFile)
  return files.map(file => ({
    file,
    content: JSON.parse(fs.readFileSync(file, 'utf-8')) as LocaleMessages
  }))
}

const writeIfChanged = (filePath: string, content: string) => {
  const current = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf-8')
    : null
  if (current !== content) fs.writeFileSync(filePath, content)
}

export const generateMessages = (rootDir = process.cwd()) => {
  const messagesDir = path.join(rootDir, MESSAGES_DIR)
  const generatedDir = path.join(messagesDir, GENERATED_DIR_NAME)
  fs.mkdirSync(generatedDir, { recursive: true })

  for (const locale of listLocales(messagesDir)) {
    const merged = mergeMessageFiles(readMessageFiles(messagesDir, locale))
    const json = `${JSON.stringify(merged, null, JSON_INDENT)}\n`
    writeIfChanged(path.join(generatedDir, `${locale}.json`), json)
  }
}

export const watchMessages = (rootDir = process.cwd()) => {
  const messagesDir = path.join(rootDir, MESSAGES_DIR)
  fs.watch(messagesDir, { recursive: true }, (_event, filename) => {
    if (!filename?.endsWith('.json')) return
    if (filename.startsWith(GENERATED_DIR_NAME)) return
    try {
      generateMessages(rootDir)
    } catch (error) {
      console.log(error)
    }
  })
}
