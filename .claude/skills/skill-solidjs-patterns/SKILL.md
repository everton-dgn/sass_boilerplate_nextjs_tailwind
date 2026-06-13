---
name: skill-solidjs-patterns
description: |
  Use este skill quando o usuário pedir para "criar componente Solid", "usar signals",
  "createEffect", "Show/For", "createResource", ou mencionar padrões Solid.js,
  reatividade, Suspense ou evitar anti-patterns de reatividade.
  Cobre reatividade, signals, createEffect, Show/For, recursos, Suspense.
model: opus
---

# Solid.js Patterns

## Objetivo
Padrões específicos do Solid.js - reatividade, signals, createEffect, Show/For, recursos, Suspense.

## Quando usar
- Ao aplicar padrões Solid (signals/effects/control flow).
- Ao evitar anti-patterns de reatividade.
- Ao otimizar performance em Solid.

## Reatividade

### Signals

```tsx
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)

// Ler valor (é uma função!)
console.log(count())

// Atualizar
setCount(5)
setCount((prev) => prev + 1)
```

### Derived Values (Memo)

```tsx
import { createMemo } from 'solid-js'

const [firstName, setFirstName] = createSignal('John')
const [lastName, setLastName] = createSignal('Doe')

// Recalcula apenas quando dependências mudam
const fullName = createMemo(() => `${firstName()} ${lastName()}`)
```

### Effects

```tsx
import { createEffect, onCleanup } from 'solid-js'

// Executa quando dependências mudam
createEffect(() => {
  const id = count()
  console.log('Count changed:', id)

  // Cleanup antes do próximo run
  onCleanup(() => {
    console.log('Cleaning up for:', id)
  })
})
```

## Control Flow

### Show (Condicional)

```tsx
import { Show } from 'solid-js'

<Show when={isLoading()} fallback={<Content />}>
  <Spinner />
</Show>

// Com tipagem do valor
<Show when={user()} fallback={<Login />}>
  {(user) => <Profile user={user()} />}
</Show>
```

### For (Lista)

```tsx
import { For } from 'solid-js'

<For each={items()} fallback={<p>Nenhum item</p>}>
  {(item, index) => (
    <li data-index={index()}>{item.name}</li>
  )}
</For>
```

### Switch/Match

```tsx
import { Switch, Match } from 'solid-js'

<Switch fallback={<p>Default</p>}>
  <Match when={status() === 'loading'}>
    <Spinner />
  </Match>
  <Match when={status() === 'error'}>
    <Error />
  </Match>
  <Match when={status() === 'success'}>
    <Success />
  </Match>
</Switch>
```

## Recursos (Data Fetching)

### createResource

```tsx
import { createResource, Suspense } from 'solid-js'

const fetchUser = async (id: string) => {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

const [user] = createResource(() => props.userId, fetchUser)

// No JSX
<Suspense fallback={<Spinner />}>
  <Show when={user()}>
    {(data) => <Profile user={data()} />}
  </Show>
</Suspense>
```

### Com Mutate

```tsx
const [user, { mutate, refetch }] = createResource(fetchUser)

// Atualizar cache local
mutate((prev) => ({ ...prev, name: 'New Name' }))

// Refetch do servidor
refetch()
```

## Stores (Estado Complexo)

```tsx
import { createStore, produce } from 'solid-js/store'

const [state, setState] = createStore({
  users: [],
  filters: { active: true },
})

// Atualização imutável
setState('filters', 'active', false)

// Com produce (mutável)
setState(
  produce((s) => {
    s.users.push({ id: 1, name: 'John' })
  })
)
```

## Refs

```tsx
let inputRef: HTMLInputElement

<input ref={inputRef!} />

// Usar após mount
onMount(() => {
  inputRef.focus()
})
```

## Context

```tsx
import { createContext, useContext } from 'solid-js'

const ThemeContext = createContext<Theme>()

// Provider
<ThemeContext.Provider value={theme}>
  {props.children}
</ThemeContext.Provider>

// Consumer
const theme = useContext(ThemeContext)
```

## Lifecycle

```tsx
import { onMount, onCleanup } from 'solid-js'

onMount(() => {
  // Após primeiro render
  const handler = () => {}
  window.addEventListener('resize', handler)

  onCleanup(() => {
    window.removeEventListener('resize', handler)
  })
})
```

## Anti-Patterns

```tsx
// ❌ Desestruturar props (perde reatividade)
const Component = ({ name }) => <div>{name}</div>

// ✅ Acessar props diretamente
const Component = (props) => <div>{props.name}</div>

// ❌ Chamar signal fora do tracking
const value = count() // Não reativo se fora de JSX/effect
const doubled = value * 2

// ✅ Usar createMemo para derived values
const doubled = createMemo(() => count() * 2)
```

## Checklist

- [ ] Signals para estado primitivo
- [ ] createMemo para valores derivados
- [ ] Show/For para control flow (não &&)
- [ ] createResource para data fetching
- [ ] Não desestruturar props
- [ ] onCleanup para side effects
