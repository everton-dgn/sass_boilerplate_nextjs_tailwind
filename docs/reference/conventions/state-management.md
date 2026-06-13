# Zustand store

Padrão de organização de Zustand stores em `src/infra/store/`:

```
src/infra/store/
├── config.ts                   # middlewaresProvider (factory)
├── types.ts                    # Tipos base (Middleware, MiddlewaresProvider)
└── notesPreferences/
    ├── types.ts                # State, Actions, Store, Slice
    ├── slice.ts                # initialState + slice (reducers)
    ├── store.ts                # useStore (instância com middlewares)
    └── index.ts                # Hook facade (useNotesPreferences)
```

---

## `types.ts` — Tipos da store

```tsx
export type ViewMode = 'grid' | 'list'
export type SortOrder = 'newest' | 'oldest'

export type State = { viewMode: ViewMode; sortOrder: SortOrder }
type Actions = {
  setToggleViewMode: () => void
  setToggleSortOrder: () => void
}
export type Store = State & Actions
export type Slice = StateCreator<Store, Middleware>
```

| Tipo | O que representa |
|------|------------------|
| `State` | Dados puros (o que é persistido) |
| `Actions` | Funções que alteram o estado |
| `Store` | `State & Actions` (tipo completo) |
| `Slice` | `StateCreator` tipado com middlewares |

---

## `slice.ts` — Estado inicial + reducers

```tsx
export const initialState: State = {
  viewMode: 'grid',
  sortOrder: 'newest'
}
export const slice: Slice = set => ({
  ...initialState,
  setToggleViewMode: () =>
    set(state => {
      state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid'
    }, undefined, 'setToggleViewMode'),
})
```

- `initialState` exportado separado (útil para testes/reset).
- Terceiro argumento do `set` = **action name** para DevTools.
- Usa **Immer** (mutação direta do state).

---

## `store.ts` — Instância com middlewares

```tsx
const name = 'notesPreferences'
const storage: PersistOptions<Store, Partial<State>> = {
  name,
  partialize: state => {
    const { sortOrder, ...rest } = state
    return rest
  }
}
export const useStore = middlewaresProvider<Store>({ slice, storage, name })
```

- `name` = chave no localStorage + nome no DevTools.
- `partialize` controla **o que persiste** (ex: sortOrder não persiste).
- `middlewaresProvider` aplica stack: `devtools(persist(immer(slice)))`.

---

## `index.ts` — Hook facade

```tsx
export const useNotesPreferences = () => {
  const stateNotesPreferences = {
    viewMode: useStore(state => state.viewMode),
    sortOrder: useStore(state => state.sortOrder),
    setToggleViewMode: useStore(state => state.setToggleViewMode),
    setToggleSortOrder: useStore(state => state.setToggleSortOrder)
  }
  return { stateNotesPreferences }
}
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Hook facade | `use<Nome>` | `useNotesPreferences` |
| Objeto retornado | `state<Nome>` | `stateNotesPreferences` |
| Actions | `setToggle<Propriedade>` | `setToggleViewMode` |
| Store interna | `useStore` (não exportada) | — |

- O hook é o **único export** da pasta — consumidores nunca acessam a store
  diretamente.
- Seletores individuais no hook evitam re-renders desnecessários.

---

## `config.ts` — Factory de middlewares

```tsx
export const middlewaresProvider = <TStore>({
  slice, storage, name
}: MiddlewaresProvider<TStore>) => {
  const isPersist = IS_CLIENT && storage
  const appliedSlice = isPersist
    ? persist(immer(slice), storage)
    : immer(slice)
  return create<TStore>()(
    devtools(appliedSlice, devtoolsOptions(name))
  )
}
```

- Stack de middlewares: **devtools → persist → immer**.
- Persistência só no cliente (`IS_CLIENT` guard).
- DevTools só em desenvolvimento (`IS_DEVELOPMENT`).
