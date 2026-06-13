---
name: skill-reactjs-hooks
description: |
  Use este skill quando o usuário pedir para "criar hook customizado", "quando usar useMemo",
  "useCallback vs useMemo", "hook de fetch", ou mencionar hooks React,
  diferença entre tipos de hooks ou boas práticas de hooks.
  Cobre diferença entre tipos de hooks, quando usar cada um, exemplos e boas práticas.
model: opus
---

# React Hooks

## Objetivo
Hooks React - diferença entre tipos de hooks, quando usar cada um, exemplos e boas práticas.

## Quando usar
- Ao criar hooks reutilizáveis em React.
- Ao decidir entre useState/useEffect/useMemo.
- Ao padronizar API e nomes de hooks.

Este projeto usa **hooks** para encapsular lógica de estado e comportamento reutilizável.

## Prefixo `use*`

**Todos os hooks React começam com `use`.**

Hooks podem:
- Gerenciar estado interno (useState, useReducer)
- Executar side effects (useEffect)
- Acessar contextos (useContext)
- Memorizar valores (useMemo, useCallback)
- Acessar refs (useRef)

## Hooks de Estado

```tsx
import { useState, useCallback } from 'react'

type UseDisclosureReturn = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

export const useDisclosure = (initial = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(initial)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen(prev => !prev), [])

  return { isOpen, onOpen, onClose, onToggle }
}

// Uso
const { isOpen, onToggle } = useDisclosure()
```

## Hooks de Side Effect

```tsx
import { useEffect, useRef, RefObject } from 'react'

type UseClickOutsideProps = {
  ref: RefObject<HTMLElement>
  isActive: boolean
  onClickOutside: () => void
}

export const useClickOutside = ({ ref, isActive, onClickOutside }: UseClickOutsideProps) => {
  useEffect(() => {
    if (!isActive) return

    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside()
      }
    }

    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [ref, isActive, onClickOutside])
}

// Uso
const containerRef = useRef<HTMLDivElement>(null)
useClickOutside({
  ref: containerRef,
  isActive: isOpen,
  onClickOutside: onClose
})
```

## Hooks de Data Fetching

```tsx
import { useState, useEffect } from 'react'

type UseFetchReturn<T> = {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export const useFetch = <T,>(url: string): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Fetch failed')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}
```

## Hooks de Storage

```tsx
import { useState, useEffect } from 'react'

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn('LocalStorage error:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}

// Uso
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

## Categorias de Hooks

| Tipo | Propósito | Exemplos |
|------|-----------|----------|
| Estado | Gerenciar valores reativos | useDisclosure, useToggle, useCounter |
| Side Effect | Interagir com DOM/APIs | useClickOutside, useEventListener |
| Data | Buscar/sincronizar dados | useFetch, useLocalStorage |
| UI | Comportamentos de UI | useMediaQuery, useScrollLock |

## Regras dos Hooks

1. **Apenas no topo** - Não use hooks dentro de condições ou loops
2. **Apenas em componentes/hooks** - Não use em funções regulares
3. **Dependências corretas** - Inclua todas as deps em useEffect/useMemo/useCallback

```tsx
// ❌ Errado - hook dentro de condição
if (condition) {
  const [value, setValue] = useState(0)
}

// ✅ Correto - hook no topo
const [value, setValue] = useState(0)
if (condition) {
  // usar value aqui
}
```

## Estrutura de Arquivos

```
src/hooks/
├── useDisclosure/
│   ├── index.ts
│   └── types.ts
├── useClickOutside/
│   ├── index.ts
│   └── types.ts
└── useLocalStorage/
    ├── index.ts
    └── types.ts
```

## Hooks Comuns

- `useDisclosure` - estado aberto/fechado
- `useToggle` - boolean toggle
- `useLocalStorage` - persistência em localStorage
- `useClickOutside` - detectar clique fora
- `useMediaQuery` - responsive breakpoints
- `useDebounce` - debounce de valores
- `usePrevious` - valor anterior

## Checklist

- [ ] Hook respeita as regras de hooks (topo, sem condições)
- [ ] Dependências de efeitos/memos estão completas
- [ ] API do hook é simples e consistente (nome + retorno)
- [ ] Tipos expostos e defaults documentados
- [ ] Testes cobrem casos principais e edge cases
