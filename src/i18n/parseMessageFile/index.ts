import fs from 'node:fs'

import type { LocaleMessages } from '../messagesCodegen/types'

export const parseMessageFile = (file: string): LocaleMessages => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as LocaleMessages
  } catch (error) {
    throw new Error(`Failed to parse messages file "${file}"`, {
      cause: error
    })
  }
}
