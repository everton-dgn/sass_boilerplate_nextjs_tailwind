---
name: skill-state-management
description: |
  Use este skill quando o usuário pedir para "gerenciar estado", "estado global",
  "quando usar store", "Context vs Store", "prop drilling", ou mencionar
  gerenciamento de estado, estado local vs global, derivações ou computed values.
  Cobre quando usar cada abordagem, Solid Store vs React Context, derivações.
model: opus
---

# State Management

## Objetivo
Padrões de gerenciamento de estado - quando usar cada abordagem, Solid Store vs React Context, estado local vs global, derivações e computed values.

## Quando usar
- Ao decidir estado local vs global.
- Ao escolher stores, contexts ou signals.
- Ao evitar duplicacao e prop drilling.

## Quando Usar Cada Tipo

| Tipo | Quando Usar | Exemplos |
|------|-------------|----------|
| **Local** | Componente isolado | Form inputs, toggles, modals |
| **Lifted** | Pai + poucos filhos | Accordion, tabs |
| **Context** | Subárvore específica | Theme, auth, i18n |
| **Global** | App inteira | User session, cart |

## Regra de Ouro

> Mantenha estado o mais local possível. Só eleve quando necessário.

## SolidJS - Stores

### Criar store

```typescript
import { createStore } from 'solid-js/store'

type CartStore = {
  items: CartItem[]
  total: number
}

const [cart, setCart] = createStore<CartStore>({
  items: [],
  total: 0
})
```

### Atualizar store

```typescript
// Adicionar item
setCart('items', items => [...items, newItem])

// Atualizar item específico
setCart('items', index, 'quantity', q => q + 1)

// Atualizar múltiplos campos
setCart({
  items: newItems,
  total: calculateTotal(newItems)
})
```

### Context com Store

```typescript
import { createContext, useContext, ParentComponent } from 'solid-js'
import { createStore } from 'solid-js/store'

type AuthState = {
  user: User | null
  isLoading: boolean
}

type AuthContextValue = [
  AuthState,
  {
    login: (credentials: Credentials) => Promise<void>
    logout: () => void
  }
]

const AuthContext = createContext<AuthContextValue>()

export const AuthProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AuthState>({
    user: null,
    isLoading: true
  })

  const actions = {
    login: async (credentials: Credentials) => {
      setState('isLoading', true)
      const user = await api.login(credentials)
      setState({ user, isLoading: false })
    },
    logout: () => {
      setState({ user: null, isLoading: false })
    }
  }

  return (
    <AuthContext.Provider value={[state, actions]}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

## React - Context + useReducer

### Criar context

```typescript
import { createContext, useContext, useReducer, ReactNode } from 'react'

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const items = [...state.items, action.payload]
      return { items, total: calculateTotal(items) }
    case 'REMOVE_ITEM':
      const filtered = state.items.filter(i => i.id !== action.payload)
      return { items: filtered, total: calculateTotal(filtered) }
    case 'CLEAR':
      return { items: [], total: 0 }
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

## Derivações / Computed Values

### SolidJS - createMemo

```typescript
import { createMemo } from 'solid-js'

const CartSummary = () => {
  const [cart] = useCart()

  // Recomputa apenas quando items muda
  const itemCount = createMemo(() =>
    cart.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  const hasItems = createMemo(() => cart.items.length > 0)

  return (
    <div>
      <span>{itemCount()} itens</span>
      {hasItems() && <CheckoutButton />}
    </div>
  )
}
```

### React - useMemo

```typescript
import { useMemo } from 'react'

const CartSummary = () => {
  const { state } = useCart()

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  )

  const hasItems = useMemo(
    () => state.items.length > 0,
    [state.items]
  )

  return (
    <div>
      <span>{itemCount} itens</span>
      {hasItems && <CheckoutButton />}
    </div>
  )
}
```

## Anti-Patterns

### Evite estado duplicado

```typescript
// ❌ Ruim - total duplicado
const [items, setItems] = createSignal([])
const [total, setTotal] = createSignal(0)

// Fácil dessincronizar!
setItems([...items(), newItem])
setTotal(calculateTotal([...items(), newItem]))

// ✅ Bom - total derivado
const [items, setItems] = createSignal([])
const total = createMemo(() => calculateTotal(items()))
```

### Evite prop drilling excessivo

```typescript
// ❌ Ruim - passando por muitos níveis
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>

// ✅ Bom - context
<UserProvider>
  <App>
    <Layout>
      <Sidebar>
        <UserMenu /> {/* usa useUser() */}
      </Sidebar>
    </Layout>
  </App>
</UserProvider>
```

### Evite context muito grande

```typescript
// ❌ Ruim - tudo junto
<AppContext.Provider value={{ user, cart, theme, notifications, ... }}>

// ✅ Bom - separado por domínio
<UserProvider>
  <CartProvider>
    <ThemeProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </ThemeProvider>
  </CartProvider>
</UserProvider>
```

## Checklist

- [ ] Estado local antes de estado global
- [ ] Derivações com `createMemo`/selectors, sem duplicação
- [ ] Contexts pequenos e separados por domínio
- [ ] Store/Context só quando há múltiplos consumidores
- [ ] Nomes e APIs consistentes para setters e getters
