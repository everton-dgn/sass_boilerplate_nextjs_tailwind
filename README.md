<div align="center">

<a href="./LICENSE">![GitHub](https://img.shields.io/github/license/everton-dgn/sass_boilerplate_nextjs_tailwind?style=plastic)</a>
![GitHub repo size](https://img.shields.io/github/repo-size/everton-dgn/sass_boilerplate_nextjs_tailwind?style=plastic)
![GitHub Repo stars](https://img.shields.io/github/stars/everton-dgn/sass_boilerplate_nextjs_tailwind?color=yellow&style=plastic)

</div>

<h1 align="center">Next.js + Tailwind CSS Boilerplate</h1>

<br />

# :memo: Sobre o Projeto

Boilerplate enxuto para iniciar projetos com Next.js 16, React 19, TypeScript
e Tailwind CSS v4. A base mantém tooling, providers e componentes essenciais,
sem trazer uma aplicação de produto pronta.

<br />

---

# :globe_with_meridians: Tecnologias

| Categoria               | Tecnologia                               |
|-------------------------|------------------------------------------|
| Framework               | Next.js 16 (App Router)                  |
| Linguagem               | TypeScript (modo estrito)                |
| Biblioteca UI           | shadcn/ui (Radix UI + Tailwind Variants) |
| Estilização             | Tailwind CSS v4 (baseada em utilitários) |
| Gerenciamento de Estado | Zustand                                  |
| Busca de dados          | TanStack React Query                     |
| Formulários             | React Hook Form + Zod                    |
| Cliente HTTP            | Axios                                    |
| Modo escuro             | ThemeProvider próprio (cookie + `.dark`) |
| Notificações            | Sonner (toast)                           |
| Ícones                  | lucide-react                             |
| Testes                  | Vitest + Testing Library                 |
| Testes E2E              | Playwright                               |
| Análise estática        | Biome + Knip                             |
| Hooks do Git            | Lefthook + Commitlint                    |

<br />

---

# :triangular_flag_on_post: Funcionalidades

- [x] Modo escuro com ThemeProvider próprio (cookie, BroadcastChannel e
  script anti-flash)
- [x] Notificações toast com Sonner
- [x] Fronteiras de erro (ErrorFallback + global-error)
- [x] Validação de variáveis de ambiente com schemas Zod (server-only /
  client-only)
- [x] Estrutura de componentes com Atomic Design (atoms, molecules, organisms)
- [x] Biblioteca de componentes shadcn/ui pronta
- [x] React Query configurado no provider principal
- [x] Axios, Zustand, React Hook Form e Zod disponíveis para features
- [x] SVG como componentes React via SVGR
- [x] React Compiler habilitado
- [x] Rotas tipadas
- [x] Padrões de acessibilidade WCAG 2.1 AA
- [x] Conventional Commits
- [x] Testes E2E por página e flow tests multi-página

<br />

---

# :open_file_folder: Estrutura do Projeto

```
project/
├── src/
│   ├── @types/              # Declarações de tipo globais
│   ├── app/                 # Rotas (App Router)
│   │   ├── (home)/          # Grupo de rotas da home
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
│   │   └── store/           # Base para stores Zustand
│   ├── tests/               # Testes E2E e utilitários
│   │   ├── pages/           # Testes por página
│   │   ├── flows/           # Testes de jornada
│   │   ├── mocks/           # Mocks compartilhados
│   │   ├── providers/       # Providers de teste
│   │   └── helpers/         # Helpers de teste
│   └── theme/               # Configuração de fontes
├── docs/
│   ├── guides/              # Como fazer (tarefas)
│   ├── reference/           # Consulta técnica
│   ├── decisions/           # ADRs (decisões arquiteturais)
│   └── rules/               # Regras de domínio, aplicação e experiência
└── CLAUDE.md                # Convenções do repositório
```

<br />

---

# :white_check_mark: Pré-requisitos

- Node 24.x (veja `engines` em `package.json` e `.nvmrc`).
- pnpm 10.x via Corepack (veja `packageManager` em `package.json`).

<br />

---

# :rocket: Primeiros Passos

```bash
# Clonar o repositório
git clone https://github.com/everton-dgn/sass_boilerplate_nextjs_tailwind.git

# Habilitar Corepack (para pnpm)
corepack enable

# Instalar dependências
pnpm i

# Iniciar servidor de desenvolvimento
pnpm dev
```

Disponível em http://localhost:3000

<br />

---

# :wrench: Scripts

| Script              | Descrição                              |
|---------------------|----------------------------------------|
| `pnpm dev`          | Iniciar servidor de desenvolvimento    |
| `pnpm build`        | Gerar build de produção                |
| `pnpm start`        | Iniciar servidor de produção           |
| `pnpm lint`         | Executar linting do Biome              |
| `pnpm format`       | Formatar código com Biome              |
| `pnpm audit:dead-code` | Auditar código e dependências com Knip |
| `pnpm typecheck`    | Verificação de tipos TypeScript        |
| `pnpm test`         | Executar testes unitários (Vitest)     |
| `pnpm test:w`       | Executar testes em modo de observação  |
| `pnpm test:c`       | Executar testes com cobertura          |
| `pnpm test:ui`      | Interface Vitest com cobertura         |
| `pnpm test:e2e`     | Executar testes E2E (Playwright)       |
| `pnpm check:update` | Verificar atualizações de dependências |

**Pipeline completo de qualidade:**

```bash
pnpm format && pnpm lint && pnpm typecheck && \
  pnpm audit:dead-code && pnpm test && pnpm build
```

<br />

---

# :books: Guias

**Guias** — Como fazer:
- [Início rápido](./docs/guides/quick-start.md) — Configuração inicial e
  primeira execução
- [Fluxos de trabalho](./docs/guides/workflows.md) — Como adicionar
  componentes, hooks, páginas e lançamentos
- [Perguntas frequentes](./docs/guides/faq.md) — Problemas comuns com pnpm,
  Biome, Playwright e testes
- [Solução de problemas](./docs/guides/troubleshooting-platforms.md) —
  Correções para Linux, macOS e CI

**Referência** — Consulta técnica:
- [Arquitetura](./docs/reference/architecture.md) — Estrutura de camadas,
  App Router e convenções de import
- [Convenções](./docs/reference/conventions/) — Padrões de implementação:
  services, stores, API routes, nomenclatura
- [Funcionalidades](./docs/reference/features.md) — base de UI, modo escuro,
  toast, validação de ambiente e React Query
- [Restrições de qualidade](./docs/reference/quality-constraints.md) — Regras
  de código, estilização e ferramentas de lint
- [Guia de estilo](./docs/reference/styleguide.md) — Cores, tipografia,
  espaçamento e acessibilidade

**Projeto** — Decisões e regras:
- [Decisões (ADRs)](./docs/decisions/) — Registro de decisões arquiteturais
- [Regras](./docs/rules/) — Regras de domínio, aplicação e experiência

<br />

---

# :rotating_light: Considerações Importantes

- Este boilerplate exige um padrão de qualidade rigoroso. Leia
  `docs/reference/quality-constraints.md` antes de começar.
- Commits devem seguir Conventional Commits.
- Use as versões de Node e pnpm definidas em `package.json`.
- Mantenha as versões de Node alinhadas entre `package.json`, `.node-version`,
  `.nvmrc` e GitHub Actions.

<br />

---

# :link: Referências

- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Zustand: https://zustand.docs.pmnd.rs
- TanStack React Query: https://tanstack.com/query
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- Biome: https://biomejs.dev
- Knip: https://knip.dev
- Commitlint: https://commitlint.js.org
- Lefthook: https://github.com/evilmartians/lefthook
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev
- TypeScript: https://www.typescriptlang.org/docs

<br />

---

# :technologist: Autor

Por [Éverton Toffanetto](https://devinsights.dev).

:link: LinkedIn: https://www.linkedin.com/in/everton-toffanetto

:link: YouTube: https://youtube.com/@toffanettodev
