---
name: skill-api-design
description: |
  Use este skill quando o usuário pedir para "criar API", "desenhar endpoint",
  "estrutura de response", "middleware", "rotas REST", ou mencionar design de API,
  padrões REST, estrutura de resposta ou tratamento de erros em APIs.
  Cobre padrões REST, estrutura de response, handlers, middleware, rotas.
model: opus
---

# API Design

## Objetivo
Padrões de API REST - estrutura de response, handlers, middleware, rotas em SolidStart.

## Quando usar
- Ao desenhar contratos REST e responses padrão.
- Ao padronizar status codes e erros.
- Ao definir handlers, rotas e middleware.

## Response Structure

```typescript
type SuccessResponse<T> = {
  success: true
  data: T
}

type ErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
```

## Handler Pattern

```typescript
import type { APIEvent } from '@solidjs/start/server'

export const GET = async (event: APIEvent) => {
  try {
    const id = event.params.id
    const user = await getUser(id)

    return Response.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const POST = async (event: APIEvent) => {
  try {
    const body = await event.request.json()
    const user = await createUser(body)

    return Response.json(
      { success: true, data: user },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
```

## Middleware

```typescript
import type { RequestMiddleware } from '@solidjs/start/middleware'

export const authMiddleware: RequestMiddleware = async ({ request, next }) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await verifyToken(token)
    return next()
  } catch {
    return new Response('Invalid token', { status: 401 })
  }
}
```

### Composição

```typescript
import { createMiddleware } from '@solidjs/start/middleware'

export default createMiddleware({
  onRequest: [
    corsMiddleware,
    rateLimitMiddleware,
    authMiddleware,
    loggingMiddleware,
  ],
})
```

## Checklist

- [ ] Endpoints RESTful
- [ ] Responses consistentes
- [ ] Erros não expõem internos
- [ ] Rate limiting
- [ ] CORS configurado
