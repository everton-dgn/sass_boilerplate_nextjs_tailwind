import 'server-only'

import { isTestModeEnabled } from '@/constants/testMode'

import { createSeedNotes } from './seedNotes'

export type NoteRecord = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export const toApiResponse = (note: NoteRecord) => ({
  id: note.id,
  title: note.title,
  content: note.content,
  created_at: note.createdAt,
  updated_at: note.updatedAt
})

const sessionStores = (() => {
  const glob = globalThis as unknown as {
    sessionStores: Map<string, Map<string, NoteRecord>>
  }
  if (!glob.sessionStores) {
    glob.sessionStores = new Map()
  }
  return glob.sessionStores
})()

const createOrGetStore = (sessionId: string) => {
  const existingStore = sessionStores.get(sessionId)
  if (existingStore) return existingStore

  const newStore = createSeedNotes()
  sessionStores.set(sessionId, newStore)
  return newStore
}

export const resolveSessionId = (request: Request) =>
  isTestModeEnabled()
    ? (request.headers.get('x-test-session') ?? 'default')
    : 'default'

export const getStore = (sessionId = 'default') => createOrGetStore(sessionId)

export const resetStore = (sessionId = 'default') => {
  const nextStore = createSeedNotes()
  sessionStores.set(sessionId, nextStore)
  return nextStore
}

export const deleteStore = (sessionId = 'default') =>
  sessionStores.delete(sessionId)
