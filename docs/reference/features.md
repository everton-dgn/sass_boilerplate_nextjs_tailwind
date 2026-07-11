# Funcionalidades

## Página inicial

O boilerplate entrega uma página inicial mínima em `src/app/(home)/` para
validar layout, assets, tema e configuração do App Router.

## Modo escuro

Suporte a modo escuro via `ThemeProvider` próprio: classe `.dark` no
`<html>`, cookie `theme`, sincronização entre abas via `BroadcastChannel` e
script anti-flash. Tokens de cor
são definidos como variáveis CSS em `src/theme/globals.css` com valores
distintos para `:root` e `.dark`. O toggle de tema está disponível na Topbar
via componente `ThemeToggle`.

## Topbar

Barra de navegação fixa no topo da página com backdrop blur. O componente fica
em `src/components/molecules/Topbar/` e os links são configurados em
`constants.ts`.

## Notificações toast

Notificações via Sonner (`sonner`). O componente `Toast` está disponível como
atom em `src/components/atoms/Toast/`.

## Fronteiras de erro

- **ErrorFallback**: organism em `src/components/organisms/ErrorFallback/`.
- **error.tsx**: fronteira de erro em nível de rota.
- **global-error.tsx**: fronteira de erro global do Next.js.
- **not-found.tsx**: página 404 customizada.

## Validação de ambiente

Variáveis de ambiente são validadas com schemas Zod em `src/constants/`:

- **serverEnv**: variáveis server-only protegidas pelo pacote `server-only`.
- **clientEnv**: variáveis client-only protegidas pelo pacote `client-only`.
- **sharedEnv**: variáveis compartilhadas e helpers de ambiente.

Erros de validação falham no build e evitam deploys com configuração inválida.

## Busca de dados

TanStack React Query fica configurado no `MainProvider` com:

- QueryClient singleton no browser e instância nova no servidor.
- Async storage persister para cache no cliente.
- `staleTime` e `gcTime` padronizados.
- React Query Devtools disponível em desenvolvimento.

## HTTP, estado e formulários

O boilerplate mantém fundações prontas para features:

- Axios via `src/infra/adapters/httpClient/`.
- Zustand com configuração base em `src/infra/store/`.
- React Hook Form + Zod disponíveis para formulários tipados.

## Atomic Design

Componentes organizados em três níveis:

- **atoms**: Button, Input, Textarea, Toast, MainProvider, ThemeToggle.
- **molecules**: Topbar, Dialog.
- **organisms**: ErrorFallback.

## shadcn/ui

Biblioteca de componentes UI baseada em Radix UI + Tailwind Variants.
Componentes são gerados em `src/components/atoms/` via configuração do
`components.json`.

## SVG como componentes

SVGs são importados como componentes React via `@svgr/webpack` com regra
Turbopack configurada no `next.config`.

## React Compiler

React Compiler habilitado via `babel-plugin-react-compiler` para otimização
automática de re-renderizações.

## Rotas tipadas

Rotas tipadas via `typedRoutes: true` no Next.js config.

## Testes

- **Unitários**: Vitest + Testing Library em `src/**/__tests__/test.{ts,tsx}`.
- **E2E**: Playwright em `src/tests/` para home, tema e navegação base.
