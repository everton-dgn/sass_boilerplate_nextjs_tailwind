---
name: skill-jest
description: |
  Use este skill quando o usuário pedir para "configurar Jest", "teste com Jest",
  "mock com Jest", "testar componente React", "testar hook", ou mencionar
  Jest, testes em React/Next.js ou mocks centralizados.
  Cobre setup, APIs, testes de componentes React/Next.js, hooks e mocks.
model: opus
---

# Jest Testing

## Objetivo
Testes com Jest - setup, APIs, testes de componentes React/Next.js, hooks e mocks centralizados.

## Quando usar
- Ao configurar Jest no projeto.
- Ao testar componentes/hooks React/Next.
- Ao criar mocks centralizados.

## Setup

### Instalação

```bash
pnpm add -D jest @types/jest ts-jest jest-environment-jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D timezone-mock
```

### jest.CONFIG.js

```js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### .jest/setup.ts

```ts
import '@testing-library/jest-dom'
import timezoneMock from 'timezone-mock'

// Mock timezone para testes consistentes
timezoneMock.register('UTC')

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
```

## Scripts package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:w": "jest --watch",
    "test:c": "jest --coverage",
    "test:ci": "jest --ci --coverage --reporters=default"
  }
}
```

## APIs Principais

### Estrutura de teste

```ts
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

describe('[categoria] nome', () => {
  beforeEach(() => {
    // setup antes de cada teste
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should do something', () => {
    expect(value).toBe(expected)
  })
})
```

### Matchers comuns

```ts
// Igualdade
expect(value).toBe(expected)           // igualdade estrita
expect(value).toEqual(expected)        // igualdade profunda
expect(value).toStrictEqual(expected)  // igualdade estrita profunda

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Números
expect(value).toBeGreaterThan(n)
expect(value).toBeLessThan(n)
expect(value).toBeCloseTo(n, decimals)

// Strings
expect(value).toMatch(/regex/)
expect(value).toContain('substring')

// Arrays/Objects
expect(array).toContain(item)
expect(array).toHaveLength(n)
expect(object).toHaveProperty('key', value)

// Exceções
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('message')
expect(() => fn()).toThrow(ErrorClass)

// Assíncrono
await expect(promise).resolves.toBe(value)
await expect(promise).rejects.toThrow()
```

### Mocks

```ts
// Função mock
const fn = jest.fn()
const fnWithReturn = jest.fn().mockReturnValue(42)
const asyncFn = jest.fn().mockResolvedValue(data)

// Verificações
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toHaveBeenCalledTimes(n)
expect(fn).toHaveBeenLastCalledWith(arg)

// Mock de módulo
jest.mock('./module', () => ({
  myFunction: jest.fn().mockReturnValue('mocked'),
}))

// Mock parcial
jest.mock('./module', () => ({
  ...jest.requireActual('./module'),
  specificFn: jest.fn(),
}))

// Spy
const spy = jest.spyOn(object, 'method')
spy.mockImplementation(() => 'mocked')

// Timers
jest.useFakeTimers()
jest.setSystemTime(new Date('2024-01-01'))
jest.advanceTimersByTime(1000)
jest.useRealTimers()
```

## Testes React / Next.js

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
    const handleClick = jest.fn()

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

### Teste de hook

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

```tsx
import { act, waitFor } from '@testing-library/react'
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

## Next.js Específico

### Testando Server Components

```tsx
// Para Server Components, testar a lógica separadamente
// O componente em si é testado via E2E

// Testar função de data fetching
describe('[data] getUserData', () => {
  it('should fetch user by id', async () => {
    const user = await getUserData('123')
    expect(user).toEqual({ id: '123', name: 'John' })
  })
})
```

### Testando API Routes

```ts
import { GET, POST } from './route'
import { NextRequest } from 'next/server'

describe('[api] /api/users', () => {
  it('should return users list', async () => {
    const request = new NextRequest('http://localhost/api/users')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.users).toHaveLength(2)
  })

  it('should create user', async () => {
    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'John' }),
    })
    const response = await POST(request)

    expect(response.status).toBe(201)
  })
})
```

## Mocks Centralizados

### Estrutura de mocks

```
.jest/
├── setup.ts
└── mocks/
    ├── axios.ts
    ├── matchMedia.ts
    ├── nextNavigation.ts
    └── svg.ts
```

### Mock de Axios

```ts
// .jest/mocks/axios.ts
import axios from 'axios'

jest.mock('axios')

export const mockedAxios = axios as jest.Mocked<typeof axios>

export function mockAxiosGet<T>(data: T) {
  mockedAxios.get.mockResolvedValueOnce({ data })
}

export function mockAxiosPost<T>(data: T) {
  mockedAxios.post.mockResolvedValueOnce({ data })
}

export function mockAxiosError(message: string, status = 500) {
  const error = {
    response: { status, data: { message } },
    isAxiosError: true,
  }
  mockedAxios.get.mockRejectedValueOnce(error)
}
```

### Mock de Next.js Navigation

```ts
// .jest/mocks/nextNavigation.ts
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
}

const mockPathname = '/'
const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useParams: () => ({}),
}))

export { mockRouter, mockPathname, mockSearchParams }
```

### Mock de SVG

```ts
// .jest/mocks/svg.ts
jest.mock('*.svg', () => ({
  __esModule: true,
  default: () => 'svg',
  ReactComponent: () => 'svg',
}))
```

### Mock de matchMedia

```ts
// .jest/mocks/matchMedia.ts
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}
```

## Jest vs Vitest

| Recurso | Jest | Vitest |
|---------|------|--------|
| Mock function | `jest.fn()` | `vi.fn()` |
| Mock module | `jest.mock()` | `vi.mock()` |
| Spy | `jest.spyOn()` | `vi.spyOn()` |
| Timers | `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| System time | `jest.setSystemTime()` | `vi.setSystemTime()` |
| Clear mocks | `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| Require actual | `jest.requireActual()` | `vi.importActual()` |
| Config file | `jest.CONFIG.js` | `vitest.CONFIG.ts` |
| Setup file | `.jest/setup.ts` | `vitest.setup.ts` |
| Globals | Automático | `globals: true` |
| Watch mode | `--watch` | Default (usar `run` para single) |
| UI mode | N/A | `--ui` |

## Async Testing

### waitFor

```tsx
import { waitFor } from '@testing-library/react'

it('should show data after loading', async () => {
  render(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### findBy queries

```tsx
it('should display user name', async () => {
  render(<UserProfile />)

  // findBy = getBy + waitFor
  const userName = await screen.findByText('John Doe')
  expect(userName).toBeInTheDocument()
})
```

### act para updates de estado

```tsx
import { act } from '@testing-library/react'

it('should update after async action', async () => {
  const { result } = renderHook(() => useAsyncHook())

  await act(async () => {
    await result.current.fetchData()
  })

  expect(result.current.data).toBeDefined()
})
```

## Checklist

- [ ] Setup e ambiente de testes configurados
- [ ] Mocks centralizados e limpos após cada teste
- [ ] Testes cobrem casos felizes e erros
- [ ] Imports/aliases resolvidos no jest.CONFIG
- [ ] Scripts de CI e coverage revisados
