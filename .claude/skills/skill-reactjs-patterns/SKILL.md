---
name: skill-reactjs-patterns
description: |
  Use este skill quando o usuário pedir para "criar componente React", "usar useState",
  "useEffect", "renderização condicional", "listar itens", "data fetching React",
  ou mencionar padrões React, hooks, Context ou evitar re-renders.
  Cobre hooks, useState, useEffect, renderização condicional, listas, data fetching, Context.
model: opus
---

# React.js Patterns

## Objetivo
Padrões específicos do React.js - hooks, useState, useEffect, renderização condicional, listas, data fetching, Context.

## Quando usar
- Ao aplicar padrões React em UI e data fetching.
- Ao evitar anti-patterns e re-renders.
- Ao estruturar componentes com hooks.

## Hooks Básicos

### useState

```tsx
import { useState } from 'react'

const [count, setCount] = useState(0)

// Ler valor
console.log(count)

// Atualizar
setCount(5)
setCount((prev) => prev + 1)
```

### Derived Values (useMemo)

```tsx
import { useMemo } from 'react'

const [firstName, setFirstName] = useState('John')
const [lastName, setLastName] = useState('Doe')

// Recalcula apenas quando dependências mudam
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])
```

### useEffect

```tsx
import { useEffect } from 'react'

// Executa quando dependências mudam
useEffect(() => {
  console.log('Count changed:', count)

  // Cleanup
  return () => {
    console.log('Cleaning up for:', count)
  }
}, [count])
```

## Renderização Condicional

### Ternário (blocos curtos)

Use ternário apenas para blocos curtos (até 3 linhas cada):

```tsx
{isLoading ? <Spinner /> : <Content />}
```

### AND lógico (blocos longos)

EVITE ternários longos. Prefira `&&` separados quando os blocos têm mais de 3 linhas:

```tsx
/* ❌ Errado - ternário longo dificulta leitura */
{hasItems ? (
  <div className={S.list}>
    {items.map(item => (
      <Card key={item.id} {...item} />
    ))}
  </div>
) : (
  <Empty
    icon={<IconBox />}
    title="Nenhum item"
    onAction={handleAdd}
  />
)}

/* ✅ Correto - && separados */
{hasItems && (
  <div className={S.list}>
    {items.map(item => (
      <Card key={item.id} {...item} />
    ))}
  </div>
)}

{!hasItems && (
  <Empty
    icon={<IconBox />}
    title="Nenhum item"
    onAction={handleAdd}
  />
)}
```

### Early return

```tsx
const Component = ({ user }) => {
  if (!user) return <Login />
  return <Profile user={user} />
}
```

## Listas

### map()

```tsx
{items.map((item, index) => (
  <li key={item.id} data-index={index}>
    {item.name}
  </li>
))}

// Com fallback
{items.length === 0 ? (
  <p>Nenhum item</p>
) : (
  items.map((item) => <li key={item.id}>{item.name}</li>)
)}
```

## Data Fetching

### Com useEffect

```tsx
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchUser = async () => {
    setLoading(true)
    const res = await fetch(`/api/users/${userId}`)
    const data = await res.json()
    setUser(data)
    setLoading(false)
  }
  fetchUser()
}, [userId])
```

### Com TanStack Query (recomendado)

```tsx
import { useQuery } from '@tanstack/react-query'

const { data: user, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json())
})
```

## Estado Complexo (useReducer)

```tsx
import { useReducer } from 'react'

type State = { users: User[]; filters: { active: boolean } }
type Action =
  | { type: 'SET_FILTER'; active: boolean }
  | { type: 'ADD_USER'; user: User }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filters: { active: action.active } }
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.user] }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, {
  users: [],
  filters: { active: true }
})

dispatch({ type: 'ADD_USER', user: { id: 1, name: 'John' } })
```

## Refs

```tsx
import { useRef, useEffect } from 'react'

const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

<input ref={inputRef} />
```

## Context

```tsx
import { createContext, useContext } from 'react'

const ThemeContext = createContext<Theme | undefined>(undefined)

// Provider
<ThemeContext.Provider value={theme}>
  {children}
</ThemeContext.Provider>

// Consumer
const theme = useContext(ThemeContext)
```

## Lifecycle

```tsx
import { useEffect } from 'react'

// componentDidMount
useEffect(() => {
  const handler = () => {}
  window.addEventListener('resize', handler)

  // componentWillUnmount
  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])
```

## Patterns Comuns

### Custom Hook

```tsx
const useToggle = (initial = false) => {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle] as const
}

// Uso
const [isOpen, toggleOpen] = useToggle()
```

### Compound Components

```tsx
const Tabs = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.Tab = ({ index, children }) => {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  return (
    <button onClick={() => setActiveIndex(index)}>
      {children}
    </button>
  )
}
```

## Anti-Patterns

```tsx
// ❌ Mutar estado diretamente
const [items, setItems] = useState([])
items.push(newItem) // Errado!
setItems(items) // Não vai re-renderizar

// ✅ Criar novo array
setItems([...items, newItem])

// ❌ Dependências faltando no useEffect
useEffect(() => {
  console.log(count) // count não está nas deps
}, [])

// ✅ Incluir todas as dependências
useEffect(() => {
  console.log(count)
}, [count])

// ❌ Criar objetos/funções no render
<Component style={{ color: 'red' }} /> // Novo objeto a cada render

// ✅ Usar useMemo/useCallback
const style = useMemo(() => ({ color: 'red' }), [])
```

## Checklist

- [ ] useState para estado primitivo
- [ ] useMemo para valores derivados caros
- [ ] useCallback para funções passadas como props
- [ ] useEffect com dependências corretas
- [ ] Keys únicas em listas
- [ ] Cleanup em useEffect quando necessário
