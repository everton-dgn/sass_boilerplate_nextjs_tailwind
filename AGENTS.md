# AGENTS

Este arquivo orienta agentes de IA (Codex CLI) ao trabalhar neste repositório.

## Idioma

**Sempre responda ao usuário em português (PT-BR).** Código permanece em inglês.

---

## Regras Críticas

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

### Escopo de alterações

- Faça APENAS o solicitado
- NUNCA refatore sem solicitação explícita
- Ao encontrar problemas adjacentes pequenos (< 5 linhas): corrija junto
- Médios (5-20 linhas): mencione e pergunte
- Grandes (> 20 linhas): documente para tarefa separada

### Comentários e documentação

- **No código**: sem comentários (código auto-explicativo)
- **Exceção**: TODO temporários com ticket (ex: `// TODO: ENG-123`)

---

## Tecnologias

- **Projeto**: boilerplate Next.js para iniciar projetos
- **Stack**: Next.js 16 App Router + React 19 + TypeScript + shadcn/ui +
  Tailwind CSS v4
- **Pacotes**: pnpm (não use npm/yarn). A versão de pnpm vem de
  `packageManager` e a linha do Node vem de `engines.node`, ambos no
  `package.json` — nunca fixe esses números na documentação
- **Imports absolutos**: via `@/` alias (tsconfig `paths`)
- **UI**: shadcn/ui (Radix UI + Tailwind Variants)
- **Estado**: Zustand (com persist middleware)
- **Dados**: TanStack React Query
- **Formulários**: React Hook Form + Zod
- **HTTP**: Axios
- **Toast**: Sonner
- **i18n**: next-intl com rotas `[locale]` (`en` padrão, `es`, `pt`).
  Middleware em `src/proxy.ts`, tipos em `src/global.ts`, mensagens por
  namespace em `src/i18n/messages/<locale>/`
- **Tema**: `ThemeProvider` próprio (classe `.dark` + cookie `theme` +
  `useTheme`)
- **Ícones**: lucide-react
- **Linter/Formatter**: Biome (não ESLint/Prettier)
- **Testes**: Vitest + Testing Library (unitário), Playwright (E2E)

---

## Estrutura do repositório

```
src/
├── @types/              # Declarações de tipo globais
├── app/                 # Rotas (App Router)
│   ├── [locale]/        # Segmento de idioma (next-intl)
│   │   ├── (home)/      # Grupo de rotas da home
│   │   ├── [...rest]/   # Catch-all de rota inexistente
│   │   ├── layout.tsx   # Layout do idioma
│   │   ├── error.tsx    # Fronteira de erro de rota
│   │   └── not-found.tsx # Página 404 do idioma
│   ├── global-error.tsx # Fronteira de erro global
│   └── global-not-found.tsx # 404 fora do segmento de idioma
├── assets/              # SVGs e recursos privados
├── components/          # Atomic Design
│   ├── atoms/           # Elementos básicos (Button, Input, Textarea…)
│   ├── molecules/       # Composições simples (Topbar, Dialog)
│   └── organisms/       # Seções complexas (ErrorFallback)
├── constants/           # Configurações estáticas e schemas de ambiente
├── hooks/               # React hooks customizados
├── helpers/             # Utilitários compartilhados (cn helper)
├── i18n/                # next-intl: routing, request e mensagens
│   ├── messages/        # Traduções por idioma e namespace
│   ├── messagesCodegen/ # Merge das mensagens e geração de tipos
│   └── warnLocaleParity/ # Aviso de divergência entre idiomas
├── infra/               # Infraestrutura
│   ├── adapters/        # Adapters de libs (httpClient, queryClient)
│   └── store/           # Base para stores Zustand
├── tests/               # Testes E2E e utilitários
│   ├── pages/           # Testes por página
│   ├── flows/           # Testes de jornada
│   ├── mocks/           # Mocks compartilhados
│   ├── providers/       # Providers de teste
│   └── helpers/         # Helpers de teste
├── theme/               # Fontes e globals.css
├── global.ts            # Tipos de Locale e Messages do next-intl
└── proxy.ts             # Middleware de idioma (next-intl)
```

---

## Padrões de Código

### Geral

- Sem comentários, sem `;` (Biome: `asNeeded`), sem `var`, sem `enum`
- `type` sobre `interface`, arrow functions com `const`
- `import type` para tipos
- 80 caracteres por linha no máximo
- Exportações nomeadas para todos os componentes
- Nomenclatura SEMPRE em inglês
- **Nomes descritivos obrigatórios**: NUNCA usar nomes de uma letra
  (`p`, `n`, `d`, `c`, `i`, `x`, etc.) em variáveis locais ou
  parâmetros de callbacks (métodos de array, state setters, event
  handlers, Promises). SEMPRE usar nomes descritivos.
  Exemplos: `.map(page =>` não `.map(p =>`,
  `setState(prev =>` não `setState(c =>`,
  `const date = new Date()` não `const d = new Date()`.
  Exceções: `(a, b)` em `.sort()`, `_` para parâmetros ignorados,
  `i`/`j` em loops `for` tradicionais.
  Detalhes: `docs/reference/quality-constraints.md`
- **Traduções**: use `t` para a função retornada por `useTranslations` e
  `getTranslations`. Esta é uma exceção explícita à regra de nomes de uma
  letra; não renomeie para `translate`.
- NUNCA crie barrel files (`index.ts` que apenas re-exporta de subpastas)
- Overrides do Biome: proibidos para silenciar regras em código de produto.
  Permitidos apenas nas categorias técnicas declaradas em `biome.json` e na
  exceção funcional `noDocumentCookie` (detalhes no CLAUDE.md)

### Nomes de arquivos

- `.ts`/`.tsx`: APENAS `camelCase` ou `PascalCase`. NUNCA `kebab-case`
- Exceções: convenções Next.js (`not-found.tsx`, `global-error.tsx`)

### Imports

- NUNCA importar `./index` ou `../index`. Usar `'.'` ou `'..'`
- Sem imports profundos (3+ níveis) — usar `@/` alias

### Estrutura de componente

```
ComponentName/
├── index.tsx           (exportação nomeada)
├── types.ts            (tipos do componente)
└── __tests__/test.tsx  (testes unitários)
```

### Estrutura de módulo

```
moduleName/
├── index.ts            (exportação nomeada)
├── types.ts            (tipos do módulo, se necessário)
└── __tests__/test.ts   (testes unitários)
```

- 1 pasta = 1 `index.ts` = 1 teste em `__tests__/test.ts` ou
  `__tests__/test.tsx`
- NUNCA deixe `.ts` com lógica exportada solto (sem pasta própria)

### Limites de tamanho

- Componentes/páginas `.tsx`: máximo **150 linhas**
- Funções/módulos `.ts`: máximo **80 linhas**

### Estilização (Tailwind CSS v4 + shadcn/ui)

- Tailwind classes diretamente no JSX
- `cn()` para classes condicionais (`import { cn } from '@/helpers/cn'`).
  NUNCA template literals
- shadcn/ui em `src/components/atoms/`
- Variantes via `tailwind-variants` (TV)
- Cores semânticas: tokens shadcn (`text-muted-foreground`, `bg-destructive`)
- Tamanho de fonte mínimo: `text-xs` (12px)
- Contraste WCAG AA: 4.5:1 texto normal, 3:1 texto grande
- Modo escuro via `ThemeProvider` próprio + variáveis CSS (`:root` / `.dark`)
- **CSS customizado no globals.css**: SEMPRE usar `@layer base { ... }`
  para regras CSS que não são classes utilitárias. O Lightning CSS
  (engine do Tailwind v4) remove propriedades que não reconhece quando
  fora de `@layer`. Exemplo: `scrollbar-gutter`, `overscroll-behavior`,
  seletores com `[data-*]`

### Hooks

- Hooks customizados em `src/hooks/` com prefixo `use`
- NUNCA adicione `'use client'` em hooks

### Internacionalização

- Todo texto visível ao usuário passa por tradução. NUNCA escreva string
  literal de UI no JSX
- Um arquivo por componente ou página em
  `src/i18n/messages/<locale>/{components,pages}/<Nome>.json`. O nome do
  arquivo é o namespace, e namespace duplicado quebra o build
- Ao criar uma chave, crie nos três idiomas (`en`, `es`, `pt`). O `en` é a
  referência, e os testes de paridade falham se algum idioma tiver chave a
  mais, a menos, ou placeholder diferente
- Em componentes use `useTranslations` (vale para Server e Client Component);
  reserve `getTranslations` para contexto assíncrono como `generateMetadata`
- Navegação entre rotas usa os helpers de `@/i18n/navigation`
- NUNCA edite nem versione `src/i18n/messages/generated/` — é gerado pelo
  `next.config.ts` e ignorado pelo git

### Testes

- Vitest globals habilitados. NUNCA importe `describe`, `it`, `expect`,
  `vi` etc. de `'vitest'`
- Ambiente Node: use `__tests__/test.ts` para módulos e funções puras
- Ambiente DOM: use `__tests__/test.tsx` para componentes e hooks que usam
  Testing Library, `renderHook`, `window` ou `document`
- A extensão seleciona o projeto do Vitest (`.ts` → Node, `.tsx` → happy-dom).
  NUNCA altere a configuração para executar um teste DOM nomeado como `.ts`
- NUNCA use `__tests__/<nome>.test.ts` nem `__tests__/<nome>.test.tsx`
- `describe`: `[tipo] nome` (ex: `[Component] Button`, `[hooks] useCount`)
- `it`: inglês, prefixo `should` (ex: `should return true when active`)

### Colocalização

- Código relacionado deve ficar próximo de quem o usa
- NUNCA colocar em camada genérica se há apenas 1 consumidor
- Mover para camada compartilhada apenas quando 2+ módulos precisarem

---

## Comandos

```bash
pnpm dev                # Servidor de desenvolvimento (localhost:3000)
pnpm test               # Testes unitários (Vitest)
pnpm test:e2e           # Testes E2E (Playwright)
pnpm typecheck          # Verificação de tipos
pnpm dead-code          # Auditoria de código e dependências sem uso
pnpm format             # Formatação Biome
pnpm lint               # Linting Biome
pnpm build              # Build de produção
```

Pipeline completo:

```bash
pnpm format && pnpm lint && pnpm typecheck && \
  pnpm dead-code && pnpm test && pnpm build
```

---

## Referências

- Arquitetura: `docs/reference/architecture.md`
- Convenções: `docs/reference/conventions/`
- Funcionalidades: `docs/reference/features.md`
- Qualidade: `docs/reference/quality-constraints.md`
- Styleguide: `docs/reference/styleguide.md`
- Decisões: `docs/decisions/`
- Regras: `docs/rules/`
- Guias: `docs/guides/`
