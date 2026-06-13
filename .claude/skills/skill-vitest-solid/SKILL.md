---
name: skill-vitest-solid
description: |
  Use este skill quando o usuário pedir para "configurar Vitest Solid", "teste com Vitest",
  "Solid Testing Library", "testar componente Solid", "testar primitive", ou mencionar
  Vitest em projetos SolidJS ou mocks com Vitest.
  Cobre setup, APIs, Solid Testing Library, primitives e mocks.
model: opus
---

# Vitest + SolidJS Testing

## Objetivo
Testes com Vitest + SolidJS - setup, APIs, Solid Testing Library, primitives e mocks.

## Quando usar
- Ao usar Vitest + Solid Testing Library.
- Ao testar signals e efeitos.
- Ao configurar mocks e setup.

## Setup

### Instalação

```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 jsdom
pnpm add -D @solidjs/testing-library @testing-library/jest-dom
```

### vitest.CONFIG.ts

```ts
import { defineConfig } from 'vitest/CONFIG'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/__tests__/test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/**/__tests__/'],
    },
    deps: {
      optimizer: {
        web: {
          include: ['solid-js'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    conditions: ['development', 'browser'],
  },
})
```

### vitest.setup.ts

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@solidjs/testing-library'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## Scripts package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:w": "vitest",
    "test:c": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

## APIs Vitest

### Estrutura de teste

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('[categoria] nome', () => {
  beforeEach(() => {
    // setup antes de cada teste
  })

  afterEach(() => {
    // cleanup após cada teste
  })

  it('should do something', () => {
    expect(value).toBe(expected)
  })
})
```

### Mocks

```ts
// Função mock
const fn = vi.fn()
const fnWithReturn = vi.fn().mockReturnValue(42)
const asyncFn = vi.fn().mockResolvedValue(data)

// Verificações
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toHaveBeenCalledTimes(n)
expect(fn).toHaveBeenCalledOnce()

// Mock de módulo
vi.mock('./module', () => ({
  myFunction: vi.fn().mockReturnValue('mocked'),
}))

// Mock parcial
vi.mock('./module', async () => {
  const actual = await vi.importActual('./module')
  return {
    ...actual,
    specificFn: vi.fn(),
  }
})

// Spy
const spy = vi.spyOn(object, 'method')
spy.mockImplementation(() => 'mocked')

// Timers
vi.useFakeTimers()
vi.setSystemTime(new Date('2024-01-01'))
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

## Testes de Componente

### Setup de providers

```tsx
// src/tests/providers/component/index.tsx
import { render } from '@solidjs/testing-library'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { JSX } from 'solid-js'

export function renderWithProviders(ui: () => JSX.Element) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(() => (
    <QueryClientProvider client={queryClient}>
      {ui()}
    </QueryClientProvider>
  ))
}
```

### Teste de componente

```tsx
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@solidjs/testing-library'
import { renderWithProviders } from '@/tests/providers/component'
import { Button } from '../index'

describe('[component] Button', () => {
  it('should render children', () => {
    renderWithProviders(() => <Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()

    renderWithProviders(() => <Button onClick={handleClick}>Click</Button>)
    await fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should be disabled when loading', () => {
    renderWithProviders(() => <Button isLoading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

**Nota:** No SolidJS, sempre passe o componente como função arrow `() => <Component />`.

## Testes de Primitive/Hook

### Setup de providers

```tsx
// src/tests/providers/hook/index.tsx
import { renderHook } from '@solidjs/testing-library'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

export function renderHooksProvider<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return renderHook(hook, {
    wrapper: (props) => (
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    ),
  })
}
```

### Teste de primitive

```tsx
import { describe, it, expect } from 'vitest'
import { renderHooksProvider } from '@/tests/providers/hook'
import { createCounter } from '../createCounter'

describe('[primitive] createCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHooksProvider(() => createCounter())
    // No SolidJS, signals são funções
    expect(result.count()).toBe(0)
  })

  it('should increment count', () => {
    const { result } = renderHooksProvider(() => createCounter())
    result.increment()
    expect(result.count()).toBe(1)
  })
})
```

**Nota:** No SolidJS, signals são acessados como funções: `result.count()` não `result.current.count`.

## Async Testing

### waitFor

```tsx
import { waitFor } from '@solidjs/testing-library'

it('should show data after loading', async () => {
  renderWithProviders(() => <DataComponent />)

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### findBy queries

```tsx
it('should display user name', async () => {
  renderWithProviders(() => <UserProfile />)

  // findBy = getBy + waitFor
  const userName = await screen.findByText('John Doe')
  expect(userName).toBeInTheDocument()
})
```

## Mocks Comuns

### Storage mock

```ts
// src/tests/mocks/storage.ts
import { vi } from 'vitest'

export function createStorageMock() {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
}

export function mockLocalStorage() {
  const mock = createStorageMock()
  Object.defineProperty(window, 'localStorage', { value: mock })
  return mock
}
```

### Fetch mock

```ts
// src/tests/mocks/fetch.ts
import { vi } from 'vitest'

export function mockFetch(response: unknown, options?: { ok?: boolean; status?: number }) {
  const { ok = true, status = 200 } = options ?? {}

  return vi.spyOn(global, 'fetch').mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  } as Response)
}
```

### matchMedia mock

```ts
// src/tests/mocks/matchMedia.ts
import { vi } from 'vitest'

export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
```

## Diferenças SolidJS vs React

| Aspecto | SolidJS | React |
|---------|---------|-------|
| Render | `render(() => <C />)` | `render(<C />)` |
| Testing Library | `@solidjs/testing-library` | `@testing-library/react` |
| Eventos | `fireEvent` | `userEvent` (preferido) |
| Acesso a signals | `result.count()` | `result.current.count` |
| Query state | `@tanstack/solid-query` | `@tanstack/react-query` |
| Plugin Vite | `vite-plugin-solid` | `@vitejs/plugin-react` |

## fireEvent no SolidJS

No SolidJS, use `fireEvent` do `@solidjs/testing-library`:

```tsx
import { fireEvent, screen } from '@solidjs/testing-library'

it('should handle click', async () => {
  renderWithProviders(() => <Button onClick={handleClick}>Click</Button>)

  await fireEvent.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalled()
})

it('should handle input', async () => {
  renderWithProviders(() => <Input onInput={handleInput} />)

  await fireEvent.input(screen.getByRole('textbox'), {
    target: { value: 'test' },
  })

  expect(handleInput).toHaveBeenCalled()
})
```

## Checklist

- [ ] Setup do Vitest e Solid Testing Library configurado
- [ ] `fireEvent` usado conforme padrões do SolidJS
- [ ] Mocks e helpers centralizados
- [ ] Clean-up de mocks após cada teste
- [ ] Testes cobrem sinais e efeitos principais
