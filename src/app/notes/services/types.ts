import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório')
})

export const updateNoteSchema = createNoteSchema

export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>

export type NotesPage = {
  items: Note[]
  total: number
}
