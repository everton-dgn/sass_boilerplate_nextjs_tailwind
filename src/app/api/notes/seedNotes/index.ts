import { v4 as uuidv4 } from 'uuid'

import type { NoteRecord } from '../store'

import { SEED_NOTES } from './constants'

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export const createSeedNotes = (): Map<string, NoteRecord> =>
  new Map(
    SEED_NOTES.map(seed => {
      const note: NoteRecord = {
        id: uuidv4(),
        title: seed.title,
        content: seed.content,
        createdAt: daysAgo(seed.createdDaysAgo),
        updatedAt: daysAgo(seed.updatedDaysAgo)
      }

      return [note.id, note] as const
    })
  )
