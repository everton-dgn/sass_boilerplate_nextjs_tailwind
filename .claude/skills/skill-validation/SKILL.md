---
name: skill-validation
description: |
  Use este skill quando o usuário pedir para "validar input", "criar schema Zod",
  "validar request", "inferir tipos de schema", ou mencionar validação de dados,
  schemas de validação ou tratamento de erros de validação.
  Cobre padrões Zod, schemas, inferência de tipos, validação de request, tratamento de erros.
model: opus
---

# Validation

## Objetivo
Padrões de validação com Zod - schemas, inferência de tipos, validação de request, tratamento de erros.

## Quando usar
- Ao validar inputs e payloads com Zod.
- Ao compartilhar schemas entre client/server.
- Ao padronizar erros de validação.

## Zod Schemas

```typescript
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user']),
  createdAt: z.date(),
})

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
})

export const UpdateUserSchema = CreateUserSchema.partial()

export type User = z.infer<typeof UserSchema>
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
```

## Request Validation

```typescript
const validateRequest = <T>(schema: z.Schema<T>, data: unknown): T => {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new ValidationError(result.error.errors)
  }

  return result.data
}

export const POST = async (event: APIEvent) => {
  const body = await event.request.json()
  const data = validateRequest(CreateUserSchema, body)
}
```

## Error Classes

```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} with id ${id} not found`, 404)
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super('VALIDATION_ERROR', 'Invalid input', 400, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401)
  }
}
```

## Error Handler

```typescript
export const handleApiError = (error: unknown): Response => {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof z.ZodError) {
    return Response.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
      },
      { status: 400 }
    )
  }

  return Response.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  )
}
```

## Zod Patterns Avançados

### Custom validators

```typescript
const PasswordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Deve conter letra maiúscula')
  .regex(/[0-9]/, 'Deve conter número')
  .regex(/[^a-zA-Z0-9]/, 'Deve conter caractere especial')

const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido')
```

### Transformações

```typescript
const DateStringSchema = z
  .string()
  .transform((val) => new Date(val))
  .pipe(z.date())

const TrimmedStringSchema = z
  .string()
  .transform((val) => val.trim())

const NormalizedEmailSchema = z
  .string()
  .email()
  .transform((val) => val.toLowerCase())
```

### Refinements

```typescript
const DateRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date()
  })
  .refine(
    (data) => data.endDate > data.startDate,
    { message: 'Data final deve ser após data inicial' }
  )

const PasswordConfirmSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string()
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Senhas não conferem',
      path: ['confirmPassword']
    }
  )
```

### Union e Discriminated Union

```typescript
// Union simples
const IdSchema = z.union([z.string().uuid(), z.number().int()])

// Discriminated union (mais performático)
const EventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('click'),
    x: z.number(),
    y: z.number()
  }),
  z.object({
    type: z.literal('keypress'),
    key: z.string()
  })
])
```

### Coercion

```typescript
// Converte automaticamente
const QueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  active: z.coerce.boolean().default(true)
})

// Uso com query strings
const params = QueryParamsSchema.parse({
  page: '2',      // string -> number
  limit: '50',    // string -> number
  active: 'true'  // string -> boolean
})
```

### Async validation

```typescript
const UniqueEmailSchema = z
  .string()
  .email()
  .refine(
    async (email) => {
      const exists = await db.users.findByEmail(email)
      return !exists
    },
    { message: 'Email já cadastrado' }
  )

// Uso
const result = await UniqueEmailSchema.safeParseAsync(email)
```

## Form Validation

### Com mensagens i18n

```typescript
const createUserSchema = (t: TranslationFunction) =>
  z.object({
    email: z
      .string({ required_error: t('errors.required') })
      .email(t('errors.invalidEmail')),
    name: z
      .string({ required_error: t('errors.required') })
      .min(2, t('errors.minLength', { min: 2 }))
  })
```

### Validação de arquivo

```typescript
const FileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'Arquivo muito grande (max 5MB)')
  .refine(
    (file) => ['image/jpeg', 'image/png'].includes(file.type),
    'Formato inválido (apenas JPG e PNG)'
  )
```

## Checklist

- [ ] Input validado com Zod
- [ ] Tipos inferidos dos schemas
- [ ] Erros tipados
- [ ] Mensagens amigáveis (não expor internos)
- [ ] Transformações para normalizar dados
- [ ] Refinements para validações complexas
- [ ] Coercion para query params/form data
