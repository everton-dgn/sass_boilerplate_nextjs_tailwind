---
name: skill-solidstart-project-structure
description: |
  Use este skill quando o usuário pedir para "organizar projeto SolidStart",
  "estrutura de pastas Solid", "onde colocar arquivos", "limites entre camadas",
  ou mencionar organização de projeto SolidStart, rotas ou app.CONFIG.
  Cobre organização de pastas, responsabilidades de cada camada e limites de dependência.
model: opus
---

# Estrutura do Projeto (SolidStart)

## Objetivo
Estrutura do projeto SolidStart - organização de pastas, responsabilidades de cada camada e limites de dependência.

## Quando usar
- Ao organizar projeto SolidStart.
- Ao definir limites entre presentation/core/infra.
- Ao configurar rotas, entry e app.CONFIG.

## Visão Geral

```
src/
├── routes/[locale]/     # Rotas por idioma (páginas)
├── presentation/        # UI (componentes, tema, primitives)
├── infra/               # Adaptadores de infraestrutura
├── core/                # Regras de negócio e constantes
├── content/blog/        # Blog: posts MDX + funções de acesso
├── middleware/          # Middleware do servidor
├── tests/               # Testes E2E (Playwright)
└── assets/              # Assets para unplugin-icons
```

## Detalhamento

### `src/routes/[locale]/`

Rotas baseadas em arquivos com prefixo de locale.

```
routes/[locale]/
├── (baseLayout).tsx     # Layout base
├── (home)/index.tsx     # Página inicial
└── blog/posts/
    ├── [slug].tsx       # Post dinâmico
    └── (list)/index.tsx # Lista de posts
```

### `src/presentation/`

Tudo relacionado à UI.

```
presentation/
├── components/          # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── primitives/          # Funções reativas (create*, make*)
├── theme/               # Tokens e estilos globais
│   └── tokens/
└── context/             # Contextos Solid (Theme)
```

### `src/infra/`

Adaptadores de infraestrutura e integrações externas.

```
infra/
├── adapters/
│   └── storage/         # Abstração de storage
├── i18n/
│   └── getServerLocale/ # Locale server-side
└── env/                 # Variáveis de ambiente
```

### `src/core/`

Regras de negócio e constantes compartilhadas.

```
core/
├── constants/           # Constantes globais
│   ├── i18n/
│   └── theme/
├── i18n/
│   ├── types.ts         # Locale type
│   └── resolveLocale.ts
└── CONFIG/
    └── site.ts          # Config do site
```

### `src/content/blog/`

Blog: posts em MDX e funções de acesso.

```
content/blog/
├── posts/               # Posts em MDX
│   └── <slug>/
│       ├── pt.mdx
│       ├── en.mdx
│       ├── es.mdx
│       └── images/
├── posts.ts             # Funções de acesso e listagem
├── processMdx/          # Processamento MDX
├── getPrerenderRoutes/  # Geração de rotas estáticas
└── postBlogSchema.ts    # Validação Zod
```

## Limites de Dependência

| Camada | Pode importar | Não pode importar |
|--------|---------------|-------------------|
| `routes` | Todas | - |
| `presentation/components` | primitives, theme, infra, core, content | routes |
| `presentation/primitives` | core | components, routes |
| `infra` | core | presentation, routes |
| `core` | - | Todas (é a base) |
| `content` | core, infra | presentation, routes |

## Arquivos Especiais

- `src/app.tsx` - Raiz do app, providers
- `src/entry-client.tsx` - Entrada do cliente (hidratação)
- `src/entry-server.tsx` - Entrada do servidor e template HTML
- `app.CONFIG.ts` - Configuração do Vinxi/SolidStart

## Checklist

- [ ] Estrutura de pastas segue o padrão do projeto
- [ ] Imports respeitam limites entre camadas
- [ ] Rotas e conteúdos estão organizados por locale
- [ ] Configurações essenciais revisadas (app.CONFIG.ts, env)
- [ ] Tipos e schemas de conteúdo validados
