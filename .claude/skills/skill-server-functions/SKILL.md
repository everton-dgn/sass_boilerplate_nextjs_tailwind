---
name: skill-server-functions
description: |
  Use este skill quando o usuário pedir para "criar server function", "implementar backend",
  "repository pattern", "configurar cache", "logging estruturado", ou mencionar
  server functions em SolidStart, padrão de repositório ou caching server-side.
  Cobre server functions SolidStart, repository pattern, caching, logging estruturado.
model: opus
---

# Server Functions

## Objetivo
Server functions SolidStart, repository pattern, caching, logging estruturado.

## Quando usar
- Ao criar server functions em SolidStart.
- Ao aplicar repository pattern, caching e logging.
- Ao definir limites e responsabilidades do server.

## Definição

```typescript
'use server'

import { db } from '@/infra/database'

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')
  return user
}

export const createUser = async (data: CreateUserInput) => {
  const validated = CreateUserSchema.parse(data)
  return db.user.create({ data: validated })
}
```

## Repository Pattern

```typescript
type UserRepository = {
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  create: (data: CreateUserInput) => Promise<User>
  update: (id: string, data: UpdateUserInput) => Promise<User>
  delete: (id: string) => Promise<void>
}

export const createUserRepository = (prisma: PrismaClient): UserRepository => ({
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  create: (data) => prisma.user.create({ data }),
  update: (id, data) => prisma.user.update({ where: { id }, data }),
  delete: (id) => prisma.user.delete({ where: { id } }).then(() => {}),
})
```

## Paginação

```typescript
type PaginatedResult<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const paginate = async <T>(
  query: () => Promise<T[]>,
  count: () => Promise<number>,
  params: { page?: number; limit?: number }
): Promise<PaginatedResult<T>> => {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const [data, total] = await Promise.all([query(), count()])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
```

## Caching

```typescript
const withCache = async <T>(
  fn: () => Promise<T>,
  options: { key: string; ttl?: number }
): Promise<T> => {
  const cached = await cache.get(options.key)
  if (cached) return JSON.parse(cached) as T

  const result = await fn()
  await cache.set(options.key, JSON.stringify(result), options.ttl)
  return result
}

const getUser = async (id: string) => {
  return withCache(
    () => db.user.findUnique({ where: { id } }),
    { key: `user:${id}`, ttl: 300 }
  )
}
```

## Logging

```typescript
export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
}

const log = (level: string, message: string, context?: Record<string, unknown>) => {
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }))
}
```

## Checklist

- [ ] Server functions com 'use server'
- [ ] Repository para acesso a dados
- [ ] Paginação em listas
- [ ] Cache onde apropriado
- [ ] Logging estruturado
