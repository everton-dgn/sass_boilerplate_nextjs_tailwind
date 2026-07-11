export type LocaleMessages = Record<string, unknown>

export type MessageFile = {
  file: string
  content: LocaleMessages
}
