# Services layer (React Query)

Camada de serviços que encapsula toda comunicação HTTP + cache:

```
services/
├── config.ts       # Query keys, constantes, instância httpClient
├── types.ts        # Schemas Zod + tipos do domínio
├── mappers.ts      # Schemas de resposta + funções de transformação
├── queries/        # Hooks de leitura (useQuery, useInfiniteQuery)
└── mutations/      # Hooks de escrita (useMutation)
    └── types.ts    # Tipos compartilhados entre mutations
```

---

## `config.ts` — Configuração central

```tsx
export const NOTES_QUERY_KEY = ['notes'] as const
export const ITEMS_PER_PAGE = 3
export const httpClient = createHttpClient({
  baseURL: sharedEnv.NEXT_PUBLIC_API_BASE_URL
})
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Query key | `RECURSO_QUERY_KEY` | `NOTES_QUERY_KEY` |
| Items por página | `ITEMS_PER_PAGE` | `3` |
| HTTP client | `httpClient` | instância local do Axios |

---

## `types.ts` — Schemas e tipos de domínio

```tsx
export const createNoteSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório')
})
export const updateNoteSchema = createNoteSchema

export type Note = { id: string; title: string; ... }
export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
export type NotesPage = { items: Note[]; total: number }
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Schema de criação | `create<Recurso>Schema` | `createNoteSchema` |
| Schema de edição | `update<Recurso>Schema` | `updateNoteSchema` |
| Tipo do domínio | `<Recurso>` (PascalCase) | `Note` |
| Tipo de input | `<Ação><Recurso>Input` | `CreateNoteInput` |
| Tipo de página | `<Recurso>sPage` | `NotesPage` |

- Schemas Zod definem validação + inferem tipos via `z.infer`.
- Tipos do domínio usam **camelCase** (independente da API).

---

## `mappers.ts` — Transformação API → domínio

```tsx
export const noteResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})
export const paginatedResponseSchema = z.object({
  items: z.array(noteResponseSchema),
  total: z.number()
})
export type NoteResponse = z.infer<typeof noteResponseSchema>

export const toNote = (raw: NoteResponse): Note => ({
  id: raw.id,
  title: raw.title,
  content: raw.content,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
})
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Schema de resposta | `<recurso>ResponseSchema` | `noteResponseSchema` |
| Schema paginado | `paginatedResponseSchema` | — |
| Tipo de resposta | `<Recurso>Response` | `NoteResponse` |
| Função de mapeamento | `to<Recurso>` | `toNote` |

- **Separação**: `types.ts` = domínio, `mappers.ts` = contrato da API.
- Mappers fazem `snake_case` → `camelCase` + validação Zod.
- Toda resposta da API passa por `schema.parse(data)` antes do mapper.

---

## `queries/` — Hooks de leitura

```tsx
export const notesQueryOptions = infiniteQueryOptions({
  queryKey: NOTES_QUERY_KEY,
  meta: { persist: false },
  staleTime: 30_000,
  queryFn: ({ pageParam, signal }) => fetchNotes(pageParam, signal),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages, lastPageParam) => { ... },
  select: data => ({ ...data, pages: data.pages.map(p => p.items) })
})
export const useFindNotes = () => useInfiniteQuery(notesQueryOptions)
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Opções de query | `<recurso>QueryOptions` | `notesQueryOptions` |
| Hook de query | `useFind<Recurso>s` | `useFindNotes` |
| Função de fetch | `fetch<Recurso>s` | `fetchNotes` |

- `queryOptions` é exportado separado para uso em **prefetch no servidor**.
- `meta: { persist: false }` desabilita persistência offline para dados
  dinâmicos.
- `signal` passado para suportar **abort** em cancelamento de requests.

---

## `mutations/` — Hooks de escrita

Padrão por operação:

| Hook | Convenção | Exemplo |
|------|-----------|---------|
| Criar | `useCreate<Recurso>` | `useCreateNote` |
| Atualizar | `useUpdate<Recurso>` | `useUpdateNote` |
| Deletar | `useDelete<Recurso>` | `useDeleteNote` |

Estrutura interna de um mutation hook:

```tsx
export const useCreateNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const { data } = await httpClient.post('/api/notes', input)
      return toNote(noteResponseSchema.parse(data))
    },
    onSuccess: () => { toast.success('Nota criada com sucesso.') },
    onError: () => { toast.error('Erro ao criar nota.') },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
  })
}
```

- **`mutationFn`**: faz request → valida resposta com schema → mapeia para
  domínio.
- **`onSuccess`/`onError`**: feedback com `toast` (Sonner).
- **`onSettled`**: invalida cache **sempre** (sucesso ou erro).

---

## Optimistic updates (delete e update)

Delete e update usam **optimistic updates**:

```tsx
onMutate: async id => {
  await queryClient.cancelQueries({ queryKey: NOTES_QUERY_KEY })
  const previous = queryClient.getQueryData<NotesCache>(NOTES_QUERY_KEY)
  queryClient.setQueryData<NotesCache>(NOTES_QUERY_KEY, old => { ... })
  return { previous }
},
onError: (_err, _vars, context) => {
  queryClient.setQueryData(NOTES_QUERY_KEY, context?.previous)
  toast.error('Erro ao ...')
},
```

- `NotesCache` = `InfiniteData<NotesPage>` (definido em `mutations/types.ts`).
- Cancela queries em andamento → salva snapshot → atualiza otimisticamente
  → reverte em caso de erro.
