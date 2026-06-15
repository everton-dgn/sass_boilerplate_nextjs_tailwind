# Fluxos de trabalho

## Desenvolvimento local

```bash
pnpm dev
```

## Verificações de qualidade

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
```

## Pipeline completo

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Variantes de teste

| Comando | Propósito |
|---------|-----------|
| `pnpm test` | Executar testes unitários uma vez |
| `pnpm test:w` | Modo de observação |
| `pnpm test:c` | Com cobertura |
| `pnpm test:ui` | Vitest UI com cobertura |
| `pnpm test:e2e` | Testes E2E com Playwright |
| `pnpm test:e2e:ui` | Modo UI do Playwright |
| `pnpm test:e2e:codegen` | Geração de código do Playwright |

## Testes end-to-end (Playwright)

- `pnpm test:e2e` inicia um servidor de desenvolvimento usando `BASE_URL_TEST`
  de `.env.test` (padrão: `http://localhost:3000`).
- A configuração usa Chrome via `channel: 'chrome'`.
- Se a porta 3000 estiver ocupada, atualize `BASE_URL_TEST` e execute
  novamente.

### Estrutura de testes E2E

```
src/tests/
├── pages/               # Testes por página individual
│   └── home.spec.ts     # UI, navegação e tema da home
├── flows/               # Jornadas multi-página
│   └── navigation.spec.ts   # Navegação e persistência de tema
├── mocks/               # Mocks compartilhados
├── providers/           # Providers de teste
└── helpers/             # Helpers compartilhados
```

- **Page tests**: verificam funcionalidade isolada de cada página.
- **Flow tests**: validam jornadas do usuário que cruzam estados ou páginas.

## Detecção de duplicatas

```bash
pnpm detect:duplicates
```

## Atualização de dependências

```bash
pnpm check:update
pnpm update:pnpm
```

## Hooks do Git (Lefthook)

- Instalados automaticamente no `pnpm install` quando `.git` está presente.
- `pre-commit`: `pnpm format`, `pnpm lint`, `pnpm typecheck`.
- `pre-push`: `pnpm test`.

## Adicionando um novo componente

1. Escolha o nível do Atomic Design (atom, molecule, organism).
2. Crie a estrutura de pastas:
   ```
   ComponentName/
   ├── index.tsx
   ├── types.ts
   └── __tests__/test.tsx
   ```
3. Use exportações nomeadas.
4. Use Tailwind classes + `cn()` para estilização.
5. Escreva testes.
6. Execute `pnpm format && pnpm lint && pnpm typecheck && pnpm test`.

## Adicionando um novo hook

1. Crie a pasta em `src/hooks/`:
   ```
   useHookName/
   ├── index.ts
   ├── types.ts
   └── __tests__/test.ts
   ```
2. Use `renderHook` do Testing Library nos testes.

## Adicionando um novo módulo/auxiliar

Todo `.ts` com funções exportadas segue a mesma estrutura de pasta:

1. Crie a pasta no local onde o módulo será consumido:
   ```
   moduleName/
   ├── index.ts
   ├── types.ts          (se necessário)
   └── __tests__/test.ts
   ```
2. **1 pasta = 1 `index.ts` = 1 `__tests__/test.ts`** — relação 1:1 sempre.
3. Arquivos só com tipos (`types.ts`) ou constantes (`constants.ts`) podem
   ficar soltos — não precisam de pasta própria.
4. Se o `index.ts` ultrapassar 80 linhas, crie pastas-irmãs (novos módulos).
   Nunca coloque 2+ arquivos de lógica na mesma pasta.
5. Execute `pnpm format && pnpm lint && pnpm typecheck && pnpm test`.

## Adicionando uma nova página

1. Crie uma pasta em `src/app/` com `page.tsx`.
2. Páginas são Server Components por padrão.
3. Adicione metadados via `export const metadata`.
4. Use organisms para o conteúdo da página.

## Adicionando uma API Route

1. Crie uma pasta em `src/app/api/<recurso>/` com `route.ts`.
2. Exporte funções nomeadas por método HTTP (`GET`, `POST`, `PATCH`, `DELETE`).
3. Use Zod para validar request body e query params.
4. Para rotas dinâmicas, crie subpasta `[id]/route.ts`.

Exemplo de estrutura:

```
src/app/api/<resource>/
├── route.ts             # GET (listagem) e POST (criação)
└── [id]/
    └── route.ts         # PATCH (atualização) e DELETE (remoção)
```

## Adicionando services com React Query

Ao criar uma feature com busca/mutação de dados, siga este padrão:

```
src/app/<rota>/services/
├── queries/             # Hooks de query (useFindX)
├── mutations/           # Hooks de mutação (useCreateX, useUpdateX, useDeleteX)
│   └── types.ts         # Tipos compartilhados entre mutations
├── mappers.ts           # Transformação API → domínio (com validação Zod)
├── types.ts             # Schemas Zod e tipos do serviço
└── config.ts            # Query keys e configurações
```

- **Queries**: usam `useInfiniteQuery` ou `useQuery` do TanStack.
- **Mutations**: usam `useMutation` com invalidação de cache automática.
- **Mappers**: transformam respostas da API (snake_case) para domínio
  (camelCase) com validação via Zod schemas.

## Guias relacionados

- Arquitetura: `../reference/architecture.md`
- Convenções: `../reference/conventions/`
- Restrições de qualidade: `../reference/quality-constraints.md`
