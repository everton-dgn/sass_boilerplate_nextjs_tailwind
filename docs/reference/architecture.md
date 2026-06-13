# Arquitetura

SaaS Boilerplate usa Next.js App Router com Atomic Design para componentes
e separação clara entre UI, estado e infraestrutura.

## Estrutura de camadas

```
src/
├── @types/              # Declarações de tipo globais
├── app/                 # Rotas (App Router)
│   ├── (home)/          # Grupo de rotas da home
│   ├── notes/           # Rota de notas (CRUD completo)
│   │   ├── components/  # Componentes colocalizados
│   │   ├── hooks/       # Hooks colocalizados
│   │   └── services/    # Services (mutations, queries, mappers)
│   └── api/notes/       # API Routes REST
├── assets/              # SVGs e recursos privados
├── components/          # Atomic Design (atoms, molecules, organisms)
├── constants/           # Schemas de ambiente e configurações estáticas
├── hooks/               # React hooks customizados
├── helpers/             # Utilitários compartilhados (cn helper)
├── infra/               # Infraestrutura
│   ├── adapters/        # Adapters de libs (httpClient, queryClient)
│   └── store/           # Zustand stores (notesPreferences)
├── tests/               # Testes E2E e utilitários
│   ├── pages/           # Testes por página (home, notes)
│   ├── flows/           # Testes de jornada multi-página
│   ├── mocks/           # Mocks compartilhados
│   ├── providers/       # Providers de teste
│   └── helpers/         # Helpers de teste
└── theme/               # Configuração de fontes e globals.css
```

## Responsabilidades das camadas

### `src/@types/` — Declarações de tipo globais

Arquivos de declaração TypeScript (`.d.ts`) para módulos sem tipagem nativa:
`images.d.ts` (SVG, JPG, WebP, PNG) e `styles.d.ts` (CSS Modules).

### `src/app/` — Rotas

Segmentos de rota do App Router. Cada pasta define uma rota com `page.tsx`,
e `layout.tsx` envolve segmentos. Route groups `(group)` organizam rotas
sem afetar a URL.

Rotas atuais:

- `(home)/` — página inicial (route group).
- `notes/` — CRUD de notas com componentes, hooks e services colocalizados.
- `api/notes/` — API Routes REST (GET paginado, POST, PATCH, DELETE).

### `src/assets/` — Recursos privados

SVGs e imagens que não devem ser expostos na pasta `public/`.
Importados como módulos no código via `@svgr/webpack`.

### `src/components/` — UI com Atomic Design

Três níveis de composição:

- **atoms**: elementos básicos (Button, Input, Textarea, Toast, MainProvider,
  ThemeToggle). Componentes UI primitivos do shadcn/ui são gerados em
  `src/components/atoms/` (configurado via `components.json` com alias
  `"ui": "@/components/atoms"`).
- **molecules**: composições de atoms (Topbar, Dialog).
- **organisms**: composições de nível de funcionalidade (ErrorFallback).

### `src/constants/` — Configuração estática

Schemas Zod para validação de variáveis de ambiente (servidor e cliente),
constantes de configuração e valores que não mudam em tempo de execução.

### `src/hooks/` — Lógica reutilizável

Hooks customizados que extraem lógica com estado dos componentes.
**Nunca** adicionar `'use client'` em hooks — a diretiva pertence ao
componente consumidor, não ao hook.

### `src/infra/` — Infraestrutura

Camada de infraestrutura com adapters de bibliotecas e Zustand stores:

- **`adapters/`**: Configuração centralizada de dependências externas
  - `httpClient/`: Cliente Axios configurado com interceptores
  - `queryClient/`: TanStack React Query com persistência assíncrona
- **`store/`**: Zustand stores com persist middleware para estado do lado
  do cliente. Atualmente contém `notesPreferences` (viewMode, sortOrder).

### `src/helpers/` — Utilitários compartilhados

Auxiliar `cn()` (clsx + tailwind-merge) para composição de classes Tailwind.

### `src/theme/` — Fontes

Configuração de fontes (Geist Sans, Geist Mono) via `fontFamily.ts`.

### `src/tests/` — Testes E2E e utilitários

Testes end-to-end com Playwright e utilitários compartilhados:

- **`pages/`**: testes E2E por página (home, notes).
- **`flows/`**: testes de jornada multi-página (navegação, CRUD de notas,
  persistência de tema e dados).
- **`mocks/`**: mocks compartilhados (SVG, estilos).
- **`providers/`**: providers de teste (component, hook, TestProvider).
- **`helpers/`**: helpers compartilhados de teste.

## Convenções do App Router

- Toda pasta dentro de `src/app` é um segmento de rota.
- `page.tsx` define uma rota, `layout.tsx` envolve segmentos.
- Route groups `(group)` não afetam a URL.
- `error.tsx`, `global-error.tsx` e `not-found.tsx` são arquivos reservados.

## Componentes Server vs Client

- Pages e layouts são Server Components por padrão.
- Componentes que precisam de interatividade usam `'use client'`.
- Hooks nunca recebem `'use client'` — são consumidos por Client Components.

## Convenções de import

- Imports absolutos via alias `@/`.
- Manter capitalização exata nos imports (CI roda em Linux).
- Biome organiza a ordenação de imports automaticamente.

## Funcionalidades do Next.js habilitadas

- `reactCompiler: true`
- `reactStrictMode: true`
- `typedRoutes: true`
- Regra Turbopack para `*.svg` com `@svgr/webpack`
