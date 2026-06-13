# Feature routes — colocalização

Cada feature com lógica própria vive dentro de `src/app/<rota>/` com
componentes, hooks e services colocalizados:

```
src/app/notes/
├── page.tsx                        # Server Component (prefetch + hydration)
├── Client.tsx                      # Client Component principal ('use client')
├── layout.tsx                      # Metadata da rota
├── loading.tsx                     # Skeleton loading (Server Component)
├── components/                     # Componentes exclusivos da rota
│   ├── NoteCard/
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── NoteList/
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── NotesToolbar/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── EditNoteDialog/
│       ├── index.tsx
│       └── types.ts
├── hooks/                          # Hooks exclusivos da rota
│   └── useCreateNoteForm/
│       └── index.ts
└── services/                       # Camada de serviços (React Query)
    ├── config.ts
    ├── types.ts
    ├── mappers.ts
    ├── queries/
    │   └── useFindNotes.ts
    └── mutations/
        ├── types.ts
        ├── useCreateNote.ts
        ├── useDeleteNote.ts
        └── useUpdateNote.ts
```

## Regras de colocalização

- Componentes, hooks e services usados **apenas por uma rota** ficam dentro
  da pasta da rota.
- Só migra para `src/components/`, `src/hooks/` ou `src/helpers/` quando
  **2+ rotas diferentes** precisarem.
- Componentes de feature seguem a mesma estrutura `index.tsx` + `types.ts`
  dos componentes globais, mas **sem `__tests__/`** — a cobertura vem dos
  testes E2E.

---

## Server/Client split

Padrão para páginas que precisam de dados do servidor + interatividade:

### `page.tsx` — Server Component

```tsx
const NotesPage = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchInfiniteQuery(notesQueryOptions)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  )
}
export default NotesPage
```

- Faz **prefetch** no servidor via `getQueryClient()`.
- Envolve o client com `HydrationBoundary` para hidratar o cache.
- **Default export** (convenção do App Router).

### `Client.tsx` — Client Component

- Arquivo separado com `'use client'` no topo.
- Consome hooks de query/mutation, state do Zustand, formulários.
- Nome: `<Feature>Client` (ex: `NotesClient`).

### `layout.tsx` — Metadata

```tsx
export const metadata: Metadata = {
  title: 'Notas',
  description:
    'Demonstração de mutations com React Query'
}
const NotesLayout = ({ children }: { children: ReactNode }) => children
export default NotesLayout
```

- Define `metadata` para SEO.
- Layout mínimo (apenas passa children) quando não há wrapper visual.

### `loading.tsx` — Skeleton

- Skeleton components locais (não exportados).
- Usa `animate-pulse` + divs com `bg-muted` para simular o layout final.
- Constante para contagem de skeletons (ex: `SKELETON_COUNT = 3`).

---

## Hook de formulário (colocalizado)

Hook customizado que encapsula React Hook Form + mutation:

```
src/app/notes/hooks/useCreateNoteForm/
└── index.ts
```

```tsx
export const useCreateNoteForm = () => {
  const [formKey, setFormKey] = useState(0)
  const createNote = useCreateNote()
  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: '', content: '' }
  })
  const onSubmit = (values: CreateNoteInput) => {
    createNote.mutate(values, {
      onSuccess: () => { form.reset(); setFormKey(prev => prev + 1) }
    })
  }
  return { form, formKey, isPending: createNote.isPending, onSubmit }
}
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Hook de form | `useCreate<Recurso>Form` | `useCreateNoteForm` |
| Retorno: form | `form` (instância RHF) | `useForm<T>()` |
| Retorno: key | `formKey` (reset visual) | `useState(0)` |
| Retorno: submit | `onSubmit` | handler para `form.handleSubmit` |
| Retorno: loading | `isPending` | do mutation |

- `formKey` incrementa em `onSuccess` para forçar reset visual dos inputs
  (necessário quando `form.reset()` não limpa componentes não-controlados).
- `zodResolver(schema)` conecta validação Zod ao RHF.
