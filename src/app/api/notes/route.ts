import { type NextRequest, NextResponse } from 'next/server'

import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import {
  getStore,
  type NoteRecord,
  resolveSessionId,
  toApiResponse
} from './store'

const ITEMS_PER_PAGE = 3

const createSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório')
})

const getSessionStore = (request: NextRequest) =>
  getStore(resolveSessionId(request))

export const GET = (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const perPage = Number(searchParams.get('per_page') ?? ITEMS_PER_PAGE)

  const store = getSessionStore(request)
  const all = Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const start = (page - 1) * perPage
  const notes = all.slice(start, start + perPage)

  return NextResponse.json({
    items: notes.map(toApiResponse),
    total: all.length
  })
}

export const POST = async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.at(0)?.message ?? 'Dados inválidos' },
      { status: 400 }
    )
  }

  const now = new Date().toISOString()
  const note: NoteRecord = {
    id: uuidv4(),
    title: parsed.data.title,
    content: parsed.data.content,
    createdAt: now,
    updatedAt: now
  }

  const store = getSessionStore(request)
  store.set(note.id, note)
  return NextResponse.json(toApiResponse(note), { status: 201 })
}
