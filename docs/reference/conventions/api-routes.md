# API Routes

Padrão para endpoints REST em `src/app/api/`:

```
src/app/api/resources/
├── route.ts            # GET (listagem paginada) + POST (criação)
├── store.ts            # Store em memória + seed data + toApiResponse
└── [id]/
    └── route.ts        # PUT (atualização) + DELETE (remoção)
```

---

## Convenções

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Arquivo de rota | `route.ts` | exporta `GET`, `POST`, `PUT`, `DELETE` |
| Rotas dinâmicas | `[param]/route.ts` | `[id]/route.ts` |
| Tipo de params | `{ params: Promise<{ id: string }> }` | Next.js 16 async params |
| Validação | Zod `safeParse` no body | `createSchema.safeParse(body)` |
| Resposta de erro | `{ error: string }` + status code | `{ status: 400 }` |
| Resposta da API | **snake_case** | `created_at`, `updated_at` |
| Store de dev | `store.ts` com `Map` global | `globalThis` para HMR |

---

## Resposta em snake_case

A API **sempre** retorna `snake_case`. O mapper no client converte para
`camelCase`:

```
API (snake_case) → mappers.ts (parse + toResource) → domínio (camelCase)
```

---

## Store em memória (desenvolvimento)

```tsx
export const resourcesStore = (() => {
  const glob = globalThis as unknown as {
    resourcesStore: Map<string, ResourceRecord>
  }
  if (!glob.resourcesStore) {
    glob.resourcesStore = new Map(
      seedResources.map(resource => [resource.id, resource])
    )
  }
  return glob.resourcesStore
})()
```

- `globalThis` evita perda de dados durante HMR do Next.js.
- `toApiResponse` converte `camelCase` → `snake_case` na saída.
- Seed data populado com `daysAgo()` helper para datas realistas.
