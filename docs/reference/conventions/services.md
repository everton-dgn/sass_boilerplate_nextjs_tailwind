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
export const RESOURCES_QUERY_KEY = ['resources'] as const
export const ITEMS_PER_PAGE = 3
export const httpClient = createHttpClient({
  baseURL: sharedEnv.NEXT_PUBLIC_API_BASE_URL
})
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Query key | `RECURSO_QUERY_KEY` | `RESOURCES_QUERY_KEY` |
| Items por página | `ITEMS_PER_PAGE` | `3` |
| HTTP client | `httpClient` | instância local do Axios |

---

## `types.ts` — Schemas e tipos de domínio

```tsx
export const createResourceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória')
})
export const updateResourceSchema = createResourceSchema

export type Resource = { id: string; name: string; ... }
export type CreateResourceInput = z.infer<typeof createResourceSchema>
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>
export type ResourcesPage = { items: Resource[]; total: number }
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Schema de criação | `create<Recurso>Schema` | `createResourceSchema` |
| Schema de edição | `update<Recurso>Schema` | `updateResourceSchema` |
| Tipo do domínio | `<Recurso>` (PascalCase) | `Resource` |
| Tipo de input | `<Ação><Recurso>Input` | `CreateResourceInput` |
| Tipo de página | `<Recurso>sPage` | `ResourcesPage` |

- Schemas Zod definem validação + inferem tipos via `z.infer`.
- Tipos do domínio usam **camelCase** (independente da API).

---

## `mappers.ts` — Transformação API → domínio

```tsx
export const resourceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})
export const paginatedResponseSchema = z.object({
  items: z.array(resourceResponseSchema),
  total: z.number()
})
export type ResourceResponse = z.infer<typeof resourceResponseSchema>

export const toResource = (raw: ResourceResponse): Resource => ({
  id: raw.id,
  name: raw.name,
  description: raw.description,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
})
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Schema de resposta | `<recurso>ResponseSchema` | `resourceResponseSchema` |
| Schema paginado | `paginatedResponseSchema` | — |
| Tipo de resposta | `<Recurso>Response` | `ResourceResponse` |
| Função de mapeamento | `to<Recurso>` | `toResource` |

- **Separação**: `types.ts` = domínio, `mappers.ts` = contrato da API.
- Mappers fazem `snake_case` → `camelCase` + validação Zod.
- Toda resposta da API passa por `schema.parse(data)` antes do mapper.

---

## `queries/` — Hooks de leitura

```tsx
export const resourcesQueryOptions = infiniteQueryOptions({
  queryKey: RESOURCES_QUERY_KEY,
  meta: { persist: false },
  staleTime: 30_000,
  queryFn: ({ pageParam, signal }) => fetchResources(pageParam, signal),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages, lastPageParam) => { ... },
  select: data => ({
    ...data,
    pages: data.pages.map(page => page.items)
  })
})
export const useFindResources = () => useInfiniteQuery(resourcesQueryOptions)
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Opções de query | `<recurso>QueryOptions` | `resourcesQueryOptions` |
| Hook de query | `useFind<Recurso>s` | `useFindResources` |
| Função de fetch | `fetch<Recurso>s` | `fetchResources` |

- `queryOptions` é exportado separado para uso em **prefetch no servidor**.
- `meta: { persist: false }` desabilita persistência offline para dados
  dinâmicos.
- `signal` passado para suportar **abort** em cancelamento de requests.

---

## `mutations/` — Hooks de escrita

Padrão por operação:

| Hook | Convenção | Exemplo |
|------|-----------|---------|
| Criar | `useCreate<Recurso>` | `useCreateResource` |
| Atualizar | `useUpdate<Recurso>` | `useUpdateResource` |
| Deletar | `useDelete<Recurso>` | `useDeleteResource` |

Estrutura interna de um mutation hook:

```tsx
export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateResourceInput) => {
      const { data } = await httpClient.post('/api/resources', input)
      return toResource(resourceResponseSchema.parse(data))
    },
    onSuccess: () => { toast.success('Recurso criado com sucesso.') },
    onError: () => { toast.error('Erro ao criar recurso.') },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY })
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
  await queryClient.cancelQueries({ queryKey: RESOURCES_QUERY_KEY })
  const previous = queryClient.getQueryData<ResourcesCache>(
    RESOURCES_QUERY_KEY
  )
  queryClient.setQueryData<ResourcesCache>(RESOURCES_QUERY_KEY, old => { ... })
  return { previous }
},
onError: (_err, _vars, context) => {
  queryClient.setQueryData(RESOURCES_QUERY_KEY, context?.previous)
  toast.error('Erro ao ...')
},
```

- `ResourcesCache` = `InfiniteData<ResourcesPage>` (definido em
  `mutations/types.ts`).
- Cancela queries em andamento → salva snapshot → atualiza otimisticamente
  → reverte em caso de erro.
