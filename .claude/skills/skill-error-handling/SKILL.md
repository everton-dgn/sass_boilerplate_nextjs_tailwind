---
name: skill-error-handling
description: |
  Use este skill quando o usuário pedir para "tratar erros", "Error Boundary",
  "mensagem de erro amigável", "fallback de erro", "logging de erros", ou mencionar
  tratamento de exceções, try/catch ou monitoramento de erros.
  Cobre Error Boundary, try/catch, fallbacks, mensagens amigáveis, logging.
model: opus
---

# Error Handling

## Objetivo
Tratamento de erros - Error Boundary, try/catch, fallbacks, mensagens amigáveis, logging.

## Quando usar
- Ao implementar fallbacks e mensagens de erro.
- Ao configurar Error Boundaries e try/catch.
- Ao integrar logging e monitoramento.

## Princípios

1. **Nunca expor internos** - mensagens amigáveis para usuário
2. **Sempre logar** - erros completos no servidor
3. **Fallback gracioso** - UI não deve quebrar
4. **Recuperação** - permitir retry quando possível

## Error Boundary (Solid.js)

```tsx
import { ErrorBoundary } from 'solid-js'

<ErrorBoundary fallback={(err, reset) => (
  <div>
    <p>Algo deu errado</p>
    <button onClick={reset}>Tentar novamente</button>
  </div>
)}>
  <Component />
</ErrorBoundary>
```

## Try/Catch Pattern

```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Log completo no servidor
    console.error('Fetch error:', error)

    // Retornar/lançar erro amigável
    throw new Error('Não foi possível carregar os dados')
  }
}
```

## Result Pattern

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

const safeParseJSON = <T>(json: string): Result<T> => {
  try {
    return { success: true, data: JSON.parse(json) }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

// Uso
const result = safeParseJSON<User>(data)
if (result.success) {
  console.log(result.data)
} else {
  console.error(result.error)
}
```

## Estados de Erro em UI

```tsx
const DataList = () => {
  const [data] = createResource(fetchData)

  return (
    <Switch>
      <Match when={data.loading}>
        <Skeleton />
      </Match>
      <Match when={data.error}>
        <ErrorMessage
          message="Erro ao carregar dados"
          onRetry={() => refetch()}
        />
      </Match>
      <Match when={data()}>
        {(items) => <List items={items()} />}
      </Match>
    </Switch>
  )
}
```

## Componente de Erro

```tsx
type ErrorMessageProps = {
  message: string
  details?: string
  onRetry?: () => void
}

const ErrorMessage = (props: ErrorMessageProps) => (
  <div role="alert" class={S.error}>
    <p>{props.message}</p>
    <Show when={props.details}>
      <details>
        <summary>Detalhes técnicos</summary>
        <pre>{props.details}</pre>
      </details>
    </Show>
    <Show when={props.onRetry}>
      <button onClick={props.onRetry}>
        Tentar novamente
      </button>
    </Show>
  </div>
)
```

## Logging Estruturado

```typescript
const logError = (
  error: unknown,
  context?: Record<string, unknown>
) => {
  const entry = {
    level: 'error',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...context,
  }

  console.error(JSON.stringify(entry))
}

// Uso
try {
  await riskyOperation()
} catch (error) {
  logError(error, { userId, action: 'riskyOperation' })
}
```

## Network Errors

```typescript
const fetchWithTimeout = async (
  url: string,
  options?: RequestInit & { timeout?: number }
) => {
  const { timeout = 10000, ...fetchOptions } = options ?? {}

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tempo limite excedido')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
```

## Checklist

- [ ] Error Boundary no root
- [ ] Try/catch em operações async
- [ ] Mensagens amigáveis ao usuário
- [ ] Logging completo no servidor
- [ ] Estados loading/error/empty
- [ ] Opção de retry quando possível
- [ ] Timeout em requests
