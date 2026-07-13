import fs from 'node:fs'
import path from 'node:path'

import {
  GENERATED_DIR_NAME,
  generateMessages,
  MESSAGES_DIR
} from '../messagesCodegen'

export const watchMessages = (rootDir = process.cwd()) => {
  const messagesDir = path.join(rootDir, MESSAGES_DIR)
  fs.watch(messagesDir, { recursive: true }, (_event, filename) => {
    if (!filename?.endsWith('.json')) return
    if (filename.startsWith(GENERATED_DIR_NAME)) return
    try {
      generateMessages(rootDir)
    } catch (error) {
      console.error('[messages codegen]', error)
    }
  })
}
