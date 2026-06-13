import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { getStore, resolveSessionId, toApiResponse } from '../store'

const updateSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório')
})

type RouteParams = { params: Promise<{ id: string }> }

const getSessionStore = (request: NextRequest) =>
  getStore(resolveSessionId(request))

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.at(0)?.message ?? 'Dados inválidos' },
      { status: 400 }
    )
  }

  const store = getSessionStore(request)
  const existing = store.get(id)

  if (!existing) {
    return NextResponse.json({ error: 'Nota não encontrada' }, { status: 404 })
  }

  const updated = {
    ...existing,
    title: parsed.data.title,
    content: parsed.data.content,
    updatedAt: new Date().toISOString()
  }

  store.set(id, updated)
  return NextResponse.json(toApiResponse(updated))
}

export const DELETE = async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params
  const store = getSessionStore(request)
  const existing = store.get(id)

  if (!existing) {
    return NextResponse.json({ error: 'Nota não encontrada' }, { status: 404 })
  }

  store.delete(id)
  return new NextResponse(null, { status: 204 })
}
