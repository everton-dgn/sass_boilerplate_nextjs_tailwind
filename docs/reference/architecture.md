# Arquitetura

O projeto usa Next.js App Router com Atomic Design para componentes e
separação clara entre UI, estado e infraestrutura.

## Estrutura de camadas

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
├── components/          # Atomic Design (atoms, molecules, organisms)
├── constants/           # Schemas de ambiente e configurações estáticas
├── hooks/               # React hooks customizados
├── helpers/             # Utilitários compartilhados (cn helper)
├── i18n/                # next-intl: routing, request e mensagens
│   ├── messages/        # Traduções por idioma e namespace
│   ├── messagesCodegen/ # Merge das mensagens e geração de tipos
│   ├── parseMessageFile/ # Leitura e validação de arquivo de mensagens
│   ├── warnLocaleParity/ # Aviso de divergência entre idiomas
│   └── watchMessages/   # Watcher de mensagens em desenvolvimento
├── infra/               # Infraestrutura
│   ├── adapters/        # Adapters de libs (httpClient, queryClient)
│   └── store/           # Base para stores Zustand
├── tests/               # Testes E2E e utilitários
│   ├── pages/           # Testes por página
│   ├── flows/           # Testes de jornada
│   ├── mocks/           # Mocks compartilhados
│   ├── providers/       # Providers de teste
│   └── helpers/         # Helpers de teste
├── theme/               # Configuração de fontes e globals.css
├── global.ts            # Tipos de Locale e Messages do next-intl
└── proxy.ts             # Middleware de idioma (next-intl)
```

## Responsabilidades das camadas

### `src/@types/` — Declarações de tipo globais

Arquivos de declaração TypeScript (`.d.ts`) para módulos sem tipagem nativa:
`images.d.ts` (SVG, JPG, WebP, PNG) e `styles.d.ts` (CSS Modules).

### `src/app/` — Rotas

Segmentos de rota do App Router. Cada pasta define uma rota com `page.tsx`,
e `layout.tsx` envolve segmentos. Route groups `(group)` organizam rotas
sem afetar a URL.

Toda rota de página vive sob `[locale]/`, o segmento de idioma do next-intl.
O prefixo é sempre explícito na URL (`/en`, `/es`, `/pt`), configurado com
`localePrefix: 'always'` em `src/i18n/routing.ts`.

Rotas atuais:

- `[locale]/(home)/` — página inicial (route group).
- `[locale]/[...rest]/` — catch-all que devolve o 404 do idioma.

Fora do segmento de idioma ficam apenas os arquivos que o Next.js resolve
antes de conhecer o locale: `global-error.tsx` e `global-not-found.tsx`.

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

### `src/i18n/` — Internacionalização

Configuração do next-intl e as traduções do projeto:

- **`routing.ts`**: idiomas suportados (`en` padrão, `es`, `pt`), prefixo
  sempre explícito na URL e detecção por cabeçalho.
- **`navigation.ts`**: `Link`, `redirect`, `usePathname`, `useRouter` e
  `getPathname` cientes do idioma. Use estes no lugar dos equivalentes do
  `next/navigation`.
- **`request.ts`**: resolve o idioma da requisição e carrega as mensagens.
- **`messages/<locale>/`**: traduções divididas por namespace, um arquivo por
  componente ou página.
- **`messagesCodegen/`**: junta os arquivos de cada idioma em um único JSON e
  gera a declaração de tipos a partir do `en`. Roda no `next.config.ts`.
- **`warnLocaleParity/`**: compara os idiomas contra a referência e reporta
  chave faltante ou sobrando durante a geração.
- **`watchMessages/`**: regenera as mensagens em desenvolvimento a cada
  alteração.

A saída do codegen fica em `messages/generated/`, que está no `.gitignore` e
não deve ser editada.

O middleware que aplica o prefixo de idioma é `src/proxy.ts`, e a
augmentação de tipos (`Locale` e `Messages`) vive em `src/global.ts`, o que
faz chave de tradução inexistente falhar no `pnpm typecheck`.

### `src/infra/` — Infraestrutura

Camada de infraestrutura com adapters de bibliotecas e base para Zustand:

- **`adapters/`**: Configuração centralizada de dependências externas
  - `httpClient/`: Cliente Axios configurado com interceptores
  - `queryClient/`: TanStack React Query com persistência assíncrona
- **`store/`**: Tipos e configuração compartilhada para stores do lado do
  cliente.

### `src/helpers/` — Utilitários compartilhados

Auxiliar `cn()` (clsx + tailwind-merge) para composição de classes Tailwind.

### `src/theme/` — Fontes

Configuração de fontes (Geist Sans, Geist Mono) via `fontFamily.ts`.

### `src/tests/` — Testes E2E e utilitários

Testes end-to-end com Playwright e utilitários compartilhados:

- **`pages/`**: testes E2E por página.
- **`flows/`**: testes de jornada e persistência de tema.
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
