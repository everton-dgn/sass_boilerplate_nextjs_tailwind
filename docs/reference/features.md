# Funcionalidades

## Notes (CRUD completo)

Feature de gerenciamento de notas com CRUD completo:

- **Página**: `src/app/notes/` com Server Component que faz prefetch via
  React Query e hidrata no cliente.
- **API Routes**: `src/app/api/notes/` com endpoints REST (GET paginado,
  POST, PATCH, DELETE) e store em memória.
- **Componentes**: NoteCard, NoteList, NotesToolbar e EditNoteDialog
  colocalizados em `src/app/notes/components/`.
- **Services**: camada de serviços com mutations (useCreateNote,
  useDeleteNote, useUpdateNote), queries (useFindNotes), mappers
  (transformação snake_case → camelCase com validação Zod) e config.
- **Hook de formulário**: `useCreateNoteForm` em
  `src/app/notes/hooks/useCreateNoteForm/`.
- **Preferências**: Zustand store `notesPreferences` para viewMode
  (grid/list) e sortOrder (newest/oldest) com persistência.
- **Paginação**: infinite query com botão "Mostrar mais".

## Modo escuro

Suporte a modo escuro via `next-themes` com `attribute="class"`. Tokens de cor
são definidos como variáveis CSS em `src/theme/globals.css` com valores
distintos para `:root` (claro) e `.dark` (escuro). O toggle de tema está
disponível na Topbar via componente `ThemeToggle`.

## Topbar

Barra de navegação fixa no topo da página com backdrop blur. Contém links
de navegação (Home, Notes) à esquerda e o botão de toggle de tema à direita.
Componente molecule em `src/components/molecules/Topbar/`. Links configurados
em `constants.ts`.

## Notificações toast

Notificações via Sonner (`sonner`). O componente `Toast` está disponível como
atom em `src/components/atoms/Toast/`.

## Fronteiras de erro

- **ErrorFallback**: organism em `src/components/organisms/ErrorFallback/` para
  tratamento de erros em nível de rota.
- **error.tsx**: fronteira de erro em nível de rota.
- **global-error.tsx**: fronteira de erro global do Next.js para erros não
  capturados.
- **not-found.tsx**: página 404 customizada.

## Validação de ambiente

Variáveis de ambiente são validadas com schemas Zod em `src/constants/`:

- **serverEnv**: variáveis server-only protegidas pelo pacote `server-only`.
- **clientEnv**: variáveis do lado do cliente protegidas pelo pacote
  `client-only`, prefixadas com `NEXT_PUBLIC_`.

Erros de validação falham no build, prevenindo deploys com configuração
incorreta.

## Gerenciamento de estado

Zustand em `src/infra/store/` com:

- Persist middleware para persistência automática no cliente.
- Guard `IS_CLIENT` para evitar erros de SSR.
- Store `notesPreferences` para preferências de visualização (viewMode,
  sortOrder).

## Busca de dados

TanStack React Query com:

- Async storage persister para cache offline.
- Configuração de stale time, retry e refetch.
- Suporte a abort signals para cancelamento de requisições.
- Infinite queries para paginação.
- Prefetch no servidor com hidratação no cliente.
- Integrado ao MainProvider.

## Formulários

React Hook Form + Zod para:

- Validação de formulários com schemas tipados.
- Integração com segurança de tipos entre schema e estado do formulário.
- Hook customizado `useCreateNoteForm` para lógica de formulário de notas.

## API Routes

Endpoints REST em `src/app/api/notes/`:

- `GET /api/notes` — listagem paginada com query params.
- `POST /api/notes` — criação com validação Zod.
- `PATCH /api/notes/[id]` — atualização parcial.
- `DELETE /api/notes/[id]` — remoção.

## Atomic Design

Componentes organizados em três níveis:

- **atoms**: Button, Input, Textarea, Toast, MainProvider, ThemeToggle.
- **molecules**: Topbar, Dialog.
- **organisms**: ErrorFallback e seções complexas.

## shadcn/ui

Biblioteca de componentes UI baseada em Radix UI + Tailwind
Variants. Componentes gerados em `src/components/atoms/` via CLI
`npx shadcn@latest add`.

## SVG como componentes

SVGs importados como componentes React via `@svgr/webpack` com regra
Turbopack configurada no `next.config`.

## React Compiler

React Compiler habilitado via `babel-plugin-react-compiler` para
otimização automática de re-renderizações.

## Rotas tipadas

Rotas tipadas via `typedRoutes: true` no Next.js config, fornecendo
autocompletar e validação de links em tempo de compilação.

## Testes

- **Unitários**: Vitest + Testing Library em `src/**/__tests__/test.{ts,tsx}`.
- **E2E por página**: Playwright em `src/tests/pages/` (home, notes).
- **Flow tests**: Playwright em `src/tests/flows/` para jornadas multi-página
  (navegação, CRUD de notas, persistência de tema e dados).
