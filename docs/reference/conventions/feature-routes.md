# Feature routes — colocalização

Cada feature com lógica própria vive dentro de `src/app/[locale]/<rota>/` com
componentes, hooks e services colocalizados:

```
src/app/[locale]/resources/
├── page.tsx                        # Server Component (prefetch + hydration)
├── Client.tsx                      # Client Component principal ('use client')
├── layout.tsx                      # Metadata da rota
├── loading.tsx                     # Skeleton loading (Server Component)
├── components/                     # Componentes exclusivos da rota
│   ├── ResourceCard/
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── ResourceList/
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── ResourcesToolbar/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── EditResourceDialog/
│       ├── index.tsx
│       └── types.ts
├── hooks/                          # Hooks exclusivos da rota
│   └── useCreateResourceForm/
│       └── index.ts
└── services/                       # Camada de serviços (React Query)
    ├── config.ts
    ├── types.ts
    ├── mappers.ts
    ├── queries/
    │   └── useFindResources.ts
    └── mutations/
        ├── types.ts
        ├── useCreateResource.ts
        ├── useDeleteResource.ts
        └── useUpdateResource.ts
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
const ResourcesPage = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchInfiniteQuery(resourcesQueryOptions)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResourcesClient />
    </HydrationBoundary>
  )
}
export default ResourcesPage
```

- Faz **prefetch** no servidor via `getQueryClient()`.
- Envolve o client com `HydrationBoundary` para hidratar o cache.
- **Default export** (convenção do App Router).

### `Client.tsx` — Client Component

- Arquivo separado com `'use client'` no topo.
- Consome hooks de query/mutation, state do Zustand, formulários.
- Nome: `<Feature>Client` (ex: `ResourcesClient`).

### `layout.tsx` — Metadata

```tsx
export const metadata: Metadata = {
  title: 'Recursos',
  description:
    'Demonstração de mutations com React Query'
}
const ResourcesLayout = ({ children }: { children: ReactNode }) => children
export default ResourcesLayout
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
src/app/[locale]/resources/hooks/useCreateResourceForm/
└── index.ts
```

```tsx
export const useCreateResourceForm = () => {
  const [formKey, setFormKey] = useState(0)
  const createResource = useCreateResource()
  const form = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { name: '', description: '' }
  })
  const onSubmit = (values: CreateResourceInput) => {
    createResource.mutate(values, {
      onSuccess: () => { form.reset(); setFormKey(prev => prev + 1) }
    })
  }
  return { form, formKey, isPending: createResource.isPending, onSubmit }
}
```

| Item | Convenção de nome | Exemplo |
|------|-------------------|---------|
| Hook de form | `useCreate<Recurso>Form` | `useCreateResourceForm` |
| Retorno: form | `form` (instância RHF) | `useForm<T>()` |
| Retorno: key | `formKey` (reset visual) | `useState(0)` |
| Retorno: submit | `onSubmit` | handler para `form.handleSubmit` |
| Retorno: loading | `isPending` | do mutation |

- `formKey` incrementa em `onSuccess` para forçar reset visual dos inputs
  (necessário quando `form.reset()` não limpa componentes não-controlados).
- `zodResolver(schema)` conecta validação Zod ao RHF.
