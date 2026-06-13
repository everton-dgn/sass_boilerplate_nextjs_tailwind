import { z } from 'zod'

import type { Note } from './types'

export const noteResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export const paginatedResponseSchema = z.object({
  items: z.array(noteResponseSchema),
  total: z.number()
})

export type NoteResponse = z.infer<typeof noteResponseSchema>

export const toNote = (raw: NoteResponse): Note => ({
  id: raw.id,
  title: raw.title,
  content: raw.content,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
})
