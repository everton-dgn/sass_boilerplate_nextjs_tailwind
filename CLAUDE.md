# CLAUDE

Este arquivo orienta Claude ao trabalhar neste repositório.

## Índice

1. [Meta](#meta) - Propósito, idioma, resolução de conflitos
2. [Regras Críticas](#regras-críticas) - OBRIGATÓRIO
3. [Tecnologias e Estrutura](#tecnologias-e-estrutura) - Contexto do projeto
4. [Padrões de Código](#padrões-de-código) - RECOMENDADO
5. [Fluxos de trabalho](#fluxos-de-trabalho) - Processos de trabalho
6. [Referências](#referências) - Links para docs/
7. [Glossário](#glossário) - Definição de termos

---

## Meta

### Propósito e escopo

- Este arquivo é a referência principal para convenções do repositório.
- Se houver conflito de instruções, priorize este arquivo, `package.json` e
  `.lefthook.yml`.

### Idioma

**Sempre responda ao usuário em português (PT-BR).** Código permanece em inglês.

### Resolução de conflitos

| Nível          | Significado                      | Exemplo                          |
|----------------|----------------------------------|----------------------------------|
| **OBRIGATÓRIO** | Quebra build/deploy             | Validação após tarefa            |
| **RECOMENDADO** | Padrão esperado                 | Atomic Design                    |
| **OPCIONAL**    | Melhoria opcional               | Remoção proativa de código morto |

---

## Regras Críticas

**OBRIGATÓRIO. Não negociável.**

### Validação obrigatória após cada tarefa

Ao finalizar qualquer código:

1. `pnpm lint` - se falhar, rode `pnpm format` e depois `pnpm lint` novamente
2. `pnpm typecheck`
3. `pnpm test`

Se qualquer comando falhar, corrija e repita até todos passarem.

### Regras de proteção

- NUNCA modifique testes para passar - corrija o código
- NUNCA use --no-verify em commits
- NUNCA permita force push ou operações Git destrutivas
- SEMPRE revise `git diff` antes de commit
- SEMPRE peça confirmação explícita antes de commit/push
- SEMPRE copie fielmente configs reais ao documentar - NUNCA generalize

### Escopo de alterações

- **Solicitação explícita**: Faça APENAS o solicitado
- **Expansão de escopo controlada**: Ao encontrar problemas adjacentes:
  - Pequenos (< 5 linhas): Corrija junto
  - Médios (5-20 linhas): Mencione, pergunte se deve corrigir
  - Grandes (> 20 linhas): Documente para tarefa separada
- **Refatoração**: NUNCA sem solicitação explícita

### Refatoração de símbolos

Ao refatorar qualquer símbolo (variável, função, tipo):

1. **SEMPRE** buscar todos os usos no arquivo/projeto antes de alterar
2. **NUNCA** assumir que o caso mencionado é o único uso

### Imports ao mover arquivos

Ao mover arquivos ou pastas:

1. **SEMPRE** verificar TODOS os imports afetados (não só os que TypeScript
   acusa)
2. **SEMPRE** verificar mocks em testes que usam caminhos absolutos

### Coesão e colocalização

Código relacionado deve ficar próximo de quem o usa:

1. **SEMPRE** criar/manter funções, tipos e utilitários na mesma pasta de quem
   usa
2. **NUNCA** colocar em camada genérica (`infra/utils/`, `helpers/`) se
   há apenas 1 consumidor
3. **Mover para camada compartilhada** apenas quando 2+ módulos de pastas
   diferentes precisarem

Exemplos:

- Auxiliar usado só em `src/actions/` → criar em `src/actions/`
- Tipo usado só em `src/components/Button/` → criar em
  `src/components/Button/types.ts`
- Utilitário usado por `src/hooks/` e `src/actions/` → aí sim camada
  compartilhada

### Barrel files e sobrescritas

- **NUNCA** crie barrel files (`index.ts` que apenas re-exporta de subpastas)
- **NUNCA** sobrescreva ou desabilite regras do Biome (nem via overrides, nem
  via `biome-ignore`)

### Limites de tamanho de arquivo

- **Componentes/páginas `.tsx`**: máximo **150 linhas**. Se ultrapassar,
  extrair hooks customizados, sub-componentes ou helpers em arquivos
  separados
- **Funções/módulos `.ts`**: máximo **80 linhas** por arquivo. Se ultrapassar,
  **perguntar ao usuário** antes de quebrar — NUNCA quebrar automaticamente
- **Ao criar ou refatorar**: SEMPRE verificar se o arquivo resultante respeita
  estes limites. Se ultrapassar, avisar o usuário e propor estratégia
  de decomposição (pastas-irmãs com `index.ts` + testes)
- **NUNCA** deixar passar arquivos acima do limite durante refatorações

### Comentários e documentação

- **No código**: Sem comentários (código auto-explicativo)
- **Em arquivos .md**: Documentação completa
- **Exceção**: TODO temporários com ticket (ex: `// TODO: ENG-123`)

---

## Tecnologias e Estrutura

### Contexto rápido

- **Projeto**: SaaS Boilerplate — fundação para construir aplicações SaaS
  com Next.js.
- **Tecnologias**: Next.js 16 App Router + React 19 + TypeScript + shadcn/ui +
  Tailwind CSS v4
- **Gerenciador de pacotes**: pnpm (não use npm/yarn). Node 24.x.
- **Imports absolutos** via `@/` alias (tsconfig `paths`).
- **App Router**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`,
  `global-error.tsx`, `not-found.tsx`. Route groups usam `(group)`.
- **Biblioteca UI**: shadcn/ui (Radix UI + Tailwind Variants).
- **Gerenciamento de estado**: Zustand (com persist e immer middleware).
- **Busca de dados**: TanStack React Query (com async storage persister).
- **Formulários**: React Hook Form + Zod.
- **HTTP**: Axios.
- **Notificações**: Sonner (toast).
- **Modo escuro**: next-themes (`attribute="class"`).
- **Ícones**: lucide-react.
- **React Compiler**: habilitado via `reactCompiler: true` no
  `next.config.ts` — otimizações automáticas de memoização.
- **Analytics**: Microsoft Clarity (`react-microsoft-clarity`).

### Variáveis de ambiente

| Variável | Schema | Default | Obrigatória |
|----------|--------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `sharedEnv` | `''` | Não |
| `NEXT_PUBLIC_GITHUB_API_URL` | `sharedEnv` | `https://api.github.com` | Não |
| `NEXT_PUBLIC_GITHUB_USER` | `sharedEnv` | `everton-dgn` | Não |
| `NEXT_PUBLIC_CLARITY_TRACKING` | `clientEnv` | `''` | Não |

Schemas validados com Zod em `src/constants/`:
- `clientEnv.ts` — variáveis client-only
- `serverEnv.ts` — variáveis server-only
- `sharedEnv.ts` — variáveis compartilhadas + helpers (`IS_SERVER`,
  `IS_CLIENT`, `IS_PRODUCTION`, `IS_DEVELOPMENT`)

### Configuração Next.js (`next.config.ts`)

- **Security headers**: X-Content-Type-Options, X-Frame-Options (DENY),
  Referrer-Policy, Permissions-Policy aplicados a todas as rotas
- **SVGs como componentes**: `@svgr/webpack` via Turbopack rules —
  `import Icon from './icon.svg'` funciona como componente React
- **Typed Routes**: `typedRoutes: true` — imports de rotas são tipados
- **Component Caching**: `cacheComponents: true` (experimental)
- **Pacotes de fronteira**: `client-only` e `server-only` usados nos
  schemas de env para garantir execução no ambiente correto

### Estrutura do repositório

```
saas-boilerplate/
├── src/
│   ├── @types/              # Declarações de tipo globais
│   ├── app/                 # Rotas (App Router)
│   │   ├── (home)/          # Grupo de rotas da home
│   │   ├── notes/           # CRUD de notas (componentes, hooks, services)
│   │   ├── api/notes/       # API Routes REST
│   │   ├── layout.tsx       # Layout raiz
│   │   ├── global-error.tsx # Fronteira de erro global
│   │   └── not-found.tsx    # Página 404
│   ├── assets/              # SVGs e recursos privados
│   ├── components/          # Atomic Design
│   │   ├── atoms/           # Elementos básicos (Button, Input, Textarea…)
│   │   ├── molecules/       # Composições simples (Topbar, Dialog)
│   │   └── organisms/       # Seções complexas (ErrorFallback)
│   ├── constants/           # Configurações estáticas e schemas de ambiente
│   ├── hooks/               # React hooks customizados
│   ├── helpers/             # Utilitários compartilhados (cn helper)
│   ├── infra/               # Infraestrutura
│   │   ├── adapters/        # Adapters de libs (httpClient, queryClient)
│   │   └── store/           # Zustand stores (notesPreferences)
│   ├── tests/               # Testes E2E e utilitários
│   │   ├── pages/           # Testes por página (home, notes)
│   │   ├── flows/           # Testes de jornada multi-página
│   │   └── ...              # mocks, providers, helpers
│   └── theme/               # Configuração de fontes
├── docs/
│   ├── guides/              # Como fazer (tarefas)
│   ├── reference/           # Consulta técnica
│   ├── decisions/           # ADRs
│   ├── rules/               # Catálogo de regras
│   │   ├── business/        # Regras de negócio
│   │   ├── application/     # Regras de aplicação
│   │   └── product/         # Regras de produto
│   └── specs/               # Especificações de features
│       ├── in-progress/     # Em desenvolvimento
│       └── done/            # Implementadas
└── CLAUDE.md                # Este arquivo
```

---

## Padrões de Código

**RECOMENDADO. Padrão esperado.**

### Padrões de código

Detalhes: `docs/reference/styleguide.md` e
`docs/reference/quality-constraints.md`

- `type` sobre `interface`, arrow functions com `const`, `import type`.
  Sem `;`, `var`, `enum` ou barrel files (`export *`)
- **Arquivos**: `camelCase` ou `PascalCase` (exceções: convenções Next.js,
  `@types/*.d.ts`)
- **Imports**: `'.'`/`'..'` (não `./index`). Sem imports profundos (3+
  níveis) — usar `@/` alias
- 80 caracteres por linha. Nomenclatura em inglês. Exportações nomeadas
- Atomic Design: atoms → molecules → organisms
- **DRY**: verificar código existente antes de criar
- **Dados estáticos** (3+ itens): separar em `constants.ts`
- **Números mágicos**: extrair para `const` nomeada (exceções: 0, 1, -1)
- **Nomes descritivos**: nomes de uma letra proibidos em variáveis e
  callbacks. Detalhes: `docs/reference/quality-constraints.md`

### Estrutura de componente

```
ComponentName/
├── index.tsx           (exportação nomeada)
├── types.ts            (tipos do componente)
└── __tests__/test.tsx  (testes unitários)
```

### Estrutura de módulo

Todo `.ts` com funções exportadas segue a mesma estrutura de pasta:

```
moduleName/
├── index.ts            (exportação nomeada)
├── types.ts            (tipos do módulo, se necessário)
└── __tests__/test.ts   (testes unitários)
```

- **1 pasta = 1 `index.ts` = 1 `__tests__/test.ts`** — relação 1:1 sempre
- Arquivos só com tipos ou constantes podem ficar soltos
- Todo `.ts` com `export const`/`export function` requer pasta própria
- Para decompor: criar pastas-irmãs (não 2+ arquivos de lógica na mesma
  pasta)

### Convenções de estilização (Tailwind CSS v4 + shadcn/ui)

Detalhes: `docs/reference/styleguide.md`

- Tailwind classes no JSX. `cn()` para condicionais (não template literals)
- shadcn/ui em `src/components/atoms/` com `tailwind-variants` (TV)
- Cores semânticas (tokens shadcn) para UI, Tailwind direto para status
- Fonte mínima: `text-xs` (12px). Contraste WCAG AA: 4.5:1 / 3:1
- Biome `useSortedClasses` ordena classes automaticamente
- Modo escuro: `next-themes` + variáveis CSS (`:root` / `.dark`)
- **Gotcha**: CSS customizado em `globals.css` requer `@layer base { ... }`
  — Lightning CSS remove propriedades fora de `@layer`

### Hooks

- Hooks customizados em `src/hooks/` com prefixo `use`
- **NUNCA** adicione `'use client'` em hooks. Hooks são consumidos
  por componentes que já são Client Components — a diretiva pertence
  ao componente consumidor, não ao hook

### Testes

- Unitário: Vitest + Testing Library em `src/**/__tests__/test.{ts,tsx}`
- E2E: Playwright em `src/tests/`
- Funções sempre têm testes; componentes só com lógica complexa (pergunte
  antes)
- **Globais**: Vitest globals estão habilitados. NUNCA importe `describe`,
  `it`, `expect`, `vi`, `beforeEach` etc. de `'vitest'` — eles já existem
  no escopo global
- **Arquivo**: SEMPRE `__tests__/test.ts` (não `__tests__/<nome>.test.ts`)
- **Nomenclatura**: Verifique 2-3 testes existentes antes de criar novos:
  - `describe`: `[tipo] nome` (ex: `[hooks] useHook`, `[Component] Button`)
  - `it`: inglês, prefixo `should` (ex: `should return true when active`)

### Qualidade e CI

- Biome: `pnpm format` e `pnpm lint`
- TypeScript modo estrito: `pnpm typecheck`
- Lefthook: pré-commit (format, lint, typecheck), pré-push (test)
- Commitlint: Conventional Commits (max 120 chars)

### Verificação de APIs

Ao usar APIs, SDKs ou ferramentas externas: pesquise a doc oficial antes.
Se não encontrar, pergunte.

---

## Fluxos de trabalho

### Comandos

```bash
pnpm install            # Instalar dependências (primeiro uso)
pnpm dev                # Servidor de desenvolvimento (localhost:3000)
pnpm test               # Testes unitários (Vitest)
pnpm test:e2e           # Testes E2E (Playwright)
pnpm typecheck          # Verificação de tipos
pnpm format             # Formatação Biome
pnpm lint               # Linting Biome
pnpm build              # Build de produção
```

Pipeline completo:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Comandos auxiliares:

```bash
pnpm test:c             # Testes com coverage
pnpm test:w             # Testes em watch mode
pnpm test:ui            # Vitest UI com coverage
pnpm detect:duplicates  # Detectar código duplicado (jscpd)
pnpm check:update       # Atualizar dependências interativamente
pnpm biome:ci           # Biome para CI (sem erros em unmatched)
```

### Melhoria contínua (OPCIONAL)

Antes de criar algo novo:

- Procure reuso no projeto
- Identifique duplicidade
- Detecte código morto

Ao remover código morto: confirme usos antes, remova em alterações pequenas.

---

## Referências

Índice completo: `docs/README.md`

### Guias — Como fazer

- `docs/guides/quick-start.md`
- `docs/guides/workflows.md`
- `docs/guides/faq.md`
- `docs/guides/troubleshooting-platforms.md`

### Referência — Consulta técnica

- `docs/reference/architecture.md`
- `docs/reference/conventions/`
- `docs/reference/features.md`
- `docs/reference/quality-constraints.md`
- `docs/reference/styleguide.md`

### Decisões arquiteturais

Documentadas em `docs/decisions/`:

| Decisão                        | Arquivo                       |
|--------------------------------|-------------------------------|
| shadcn/ui + Tailwind CSS v4    | `shadcn-ui-stack.md`          |
| Classes utilitárias Tailwind   | `tailwind-utility-classes.md` |
| lucide-react para ícones       | `lucide-react-icons.md`       |
| Atomic Design                  | `atomic-design.md`            |
| Zero comentários no código     | `zero-comments.md`            |

### Regras

Documentadas em `docs/rules/`:

| Categoria   | Diretório      | Escopo                                  |
|-------------|----------------|-----------------------------------------|
| Negócio     | `business/`    | Planos, billing, limites, assinaturas   |
| Aplicação   | `application/` | Autenticação, validação, erros          |
| Produto     | `product/`     | Funcionalidades, permissões, fluxos     |

### Especificações de features

Documentadas em `docs/specs/`:
- `in-progress/` — features em planejamento ou desenvolvimento
- `done/` — features implementadas (referência)

---

## Glossário

| Termo                | Definição                                      |
|----------------------|------------------------------------------------|
| **Lógica complexa**  | 3+ estados derivados OU 2+ efeitos colaterais |
| **Alteração mínima** | Não excede 20 linhas fora do escopo solicitado |
| **Código morto**     | Funções/componentes sem uso, flags obsoletas   |
