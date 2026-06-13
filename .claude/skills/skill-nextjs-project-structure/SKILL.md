---
name: skill-nextjs-project-structure
description: |
  Use este skill quando o usuário pedir para "organizar projeto Next.js",
  "estrutura de pastas Next", "onde colocar arquivos", "limites entre camadas",
  ou mencionar organização de projeto Next.js, app router ou middleware.
  Cobre organização de pastas, responsabilidades de cada camada e limites de dependência.
model: opus
---

# Estrutura do Projeto (Next.js)

## Objetivo
Estrutura do projeto Next.js - organização de pastas, responsabilidades de cada camada e limites de dependência.

## Quando usar
- Ao organizar o app Next.js (app/routes/lib).
- Ao definir limites entre camadas e imports.
- Ao configurar middleware e layouts.

## Visão Geral

```
src/
├── app/[locale]/        # Rotas por idioma (App Router)
├── components/          # UI (componentes)
├── hooks/               # Hooks React reutilizáveis
├── theme/               # Tokens e estilos globais
├── context/             # Contextos React
├── lib/                 # Utilitários e helpers
├── services/            # Serviços e API clients
├── types/               # Types compartilhados
└── content/             # Conteúdo estático (MDX, etc.)
```

## Detalhamento

### `src/app/[locale]/`

Rotas baseadas em arquivos com prefixo de locale (App Router).

```
app/[locale]/
├── layout.tsx           # Layout raiz
├── page.tsx             # Página inicial
├── loading.tsx          # Loading UI
├── error.tsx            # Error boundary
└── blog/
    ├── page.tsx         # Lista de posts
    └── [slug]/
        └── page.tsx     # Post dinâmico
```

### `src/components/`

Tudo relacionado à UI, organizado por Atomic Design.

```
components/
├── atoms/               # Elementos básicos
│   ├── Button/
│   ├── Input/
│   └── Icon/
├── molecules/           # Combinações de atoms
│   ├── SearchBar/
│   └── Card/
└── organisms/           # Seções completas
    ├── Header/
    └── Footer/
```

### `src/hooks/`

Hooks React reutilizáveis.

```
hooks/
├── useDisclosure/
├── useLocalStorage/
└── useMediaQuery/
```

### `src/lib/`

Utilitários, helpers e configurações.

```
lib/
├── utils/               # Funções utilitárias
├── api/                 # API helpers
└── constants/           # Constantes globais
```

### `src/services/`

Serviços e API clients.

```
services/
├── api/                 # Chamadas de API
└── auth/                # Autenticação
```

### `src/content/`

Conteúdo estático como blog posts MDX.

```
content/
├── blog/
│   └── posts/
│       └── <slug>/
│           ├── pt.mdx
│           ├── en.mdx
│           └── images/
└── pages/
```

## Limites de Dependência

| Camada | Pode importar | Não pode importar |
|--------|---------------|-------------------|
| `app/` | Todas | - |
| `components/` | hooks, theme, lib, types | app |
| `hooks/` | lib, types | components, app |
| `services/` | lib, types | components, hooks, app |
| `lib/` | types | Todas (é a base) |

## Arquivos Especiais

- `src/app/layout.tsx` - Layout raiz, providers
- `src/app/[locale]/layout.tsx` - Layout por locale
- `src/middleware.ts` - Middleware (i18n redirect, auth, etc.)
- `next.CONFIG.js` - Configuração do Next.js

## Server Actions

```typescript
// src/app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  // ... validação e persistência
}
```

## Route Handlers

```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await getUsers()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await createUser(body)
  return NextResponse.json(user)
}
```

## Checklist

- [ ] Estrutura de pastas segue o padrão do projeto
- [ ] Imports respeitam limites entre camadas
- [ ] Layouts e middleware estão nas pastas corretas
- [ ] Server Actions/Route Handlers usados quando apropriado
- [ ] Configurações essenciais revisadas (next.CONFIG.js, env)
