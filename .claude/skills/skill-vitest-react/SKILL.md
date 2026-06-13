---
name: skill-vitest-react
description: |
  Use este skill quando o usuário pedir para "configurar Vitest React", "teste com Vitest",
  "React Testing Library", "testar componente com Vitest", ou mencionar
  Vitest em projetos React, RTL ou mocks com Vitest.
  Cobre setup, APIs, React Testing Library, hooks e mocks.
model: opus
---

# Vitest + React Testing

## Objetivo
Testes com Vitest + React - setup, APIs, React Testing Library, hooks e mocks.

## Quando usar
- Ao usar Vitest + RTL em React.
- Ao testar hooks e componentes.
- Ao configurar mocks e setup.

## Setup

### Instalação

```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 jsdom
pnpm add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

### vitest.CONFIG.ts

```ts
import { defineConfig } from 'vitest/CONFIG'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### vitest.setup.ts

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
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
import { render, RenderOptions } from '@testing-library/react'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface WrapperProps {
  children: ReactNode
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: createWrapper(), ...options })
}
```

### Teste de componente

```tsx
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/tests/providers/component'
import { Button } from '../index'

describe('[component] Button', () => {
  it('should render children', () => {
    renderWithProviders(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithProviders(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should be disabled when loading', () => {
    renderWithProviders(<Button isLoading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## Testes de Hook

### Setup de providers

```tsx
// src/tests/providers/hook/index.tsx
import { renderHook, RenderHookOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export function renderHooksProvider<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  return renderHook(hook, { wrapper, ...options })
}
```

### Teste de hook

```tsx
import { describe, it, expect } from 'vitest'
import { act } from '@testing-library/react'
import { renderHooksProvider } from '@/tests/providers/hook'
import { useCounter } from '../useCounter'

describe('[hook] useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHooksProvider(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('should increment count', () => {
    const { result } = renderHooksProvider(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
```

## Async Testing

### waitFor

```tsx
import { waitFor } from '@testing-library/react'

it('should show data after loading', async () => {
  renderWithProviders(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### findBy queries

```tsx
it('should display user name', async () => {
  renderWithProviders(<UserProfile />)

  // findBy = getBy + waitFor
  const userName = await screen.findByText('John Doe')
  expect(userName).toBeInTheDocument()
})
```

### act para updates de estado

```tsx
import { act } from '@testing-library/react'

it('should update after async action', async () => {
  const { result } = renderHooksProvider(() => useAsyncHook())

  await act(async () => {
    await result.current.fetchData()
  })

  expect(result.current.data).toBeDefined()
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

## userEvent vs fireEvent

**Sempre prefira `userEvent`** - simula interação real do usuário:

```tsx
import userEvent from '@testing-library/user-event'

it('should handle user interaction', async () => {
  const user = userEvent.setup()

  renderWithProviders(<Form />)

  // userEvent - simula digitação real
  await user.type(screen.getByLabelText('Email'), 'test@example.com')

  // userEvent - simula clique real
  await user.click(screen.getByRole('button', { name: 'Submit' }))
})
```

Use `fireEvent` apenas para eventos que `userEvent` não suporta.

## Checklist

- [ ] Setup do Vitest e RTL configurado
- [ ] `userEvent` usado para interações reais
- [ ] Mocks e helpers centralizados
- [ ] Clean-up de mocks após cada teste
- [ ] Testes cobrem estados de loading/erro
