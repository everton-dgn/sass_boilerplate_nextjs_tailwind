---
name: skill-reactjs-scaffolding
description: |
  Use este skill quando o usuário pedir para "criar componente React", "novo hook",
  "nova página Next.js", "scaffold React", ou mencionar criação de componentes,
  hooks ou páginas seguindo convenções React/Next.js.
  Use /skill-reactjs-scaffolding [component|hook|page].
argument-hint: "[component|hook|page] [args]"
model: opus
user-invocable: true
---

# React/Next.js Scaffolding

## Objetivo

Scaffolding para criar componentes, hooks e páginas seguindo as convenções do projeto React/Next.js.

## Quando usar

- Para criar componente → `/skill-reactjs-scaffolding component`
- Para criar hook → `/skill-reactjs-scaffolding hook`
- Para criar página → `/skill-reactjs-scaffolding page`

## Skills relacionados

- `skill-nextjs-component-structure` - estrutura de componentes
- `skill-reactjs-hooks` - padrões de hooks
- `skill-reactjs-patterns` - padrões React

---

## Workflows Invocáveis

### /reactjs-component type=<atom|molecule|organism> name=<PascalCase>

Crie o componente com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `type` (atom, molecule, organism) e `name` (PascalCase).

#### Antes de criar

Pergunte:
1. O componente terá textos visíveis ao usuário? (Se sim, criar `i18n.ts`)
2. Qual a funcionalidade principal?

#### Estrutura

```
src/components/<type>s/<ComponentName>/
├── index.tsx
├── styles.module.css
├── types.ts
└── i18n.ts          # apenas se tiver textos
```

#### Arquivos

**index.tsx:**
```tsx
import { clsx } from 'clsx'
import S from './styles.module.css'
import type { <ComponentName>Props } from './types'

export const <ComponentName> = ({ children, className }: <ComponentName>Props) => (
  <div className={clsx(S.container, className)}>
    {children}
  </div>
)
```

**types.ts:**
```ts
import type { ReactNode } from 'react'

export type <ComponentName>Props = {
  children?: ReactNode
  className?: string
}
```

**styles.module.css:**
```css
.container {
  display: flex;
  gap: 8px;
  padding: 16px;
}
```

**i18n.ts:** (se precisar)
```ts
export const i18n = {
  pt: { title: 'Título' },
  en: { title: 'Title' },
  es: { title: 'Título' }
}
```

---

### /reactjs-hook name=<useHook>

Crie o hook com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `name` com prefixo `use` (ex: useModal).

#### Antes de criar

Verifique o prefixo do nome:

| Prefixo | Válido? | Exemplo |
|---------|---------|---------|
| `use*` | Sim | useModal, useToggle |
| Outro | Não | getModal, createToggle |

Se o nome não começar com `use`, pergunte qual é a intenção.

#### Estrutura

```
src/hooks/<HookName>/
├── index.ts
└── types.ts
```

#### index.ts

```tsx
import { useState, useCallback } from 'react'
import type { <HookName>Return } from './types'

export const <HookName> = (): <HookName>Return => {
  // Implementação
}
```

#### types.ts

```ts
export type <HookName>Return = {
  // Retorno do hook
}
```

---

### /nextjs-page path="<rota>" name="<nome>"

Crie a página com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `path` para a rota e `name` para o nome da página.

#### Estrutura a criar (App Router)

```
src/app/[locale]/<rota>/
├── page.tsx           # Componente da página
├── styles.module.css  # Estilos
└── i18n.ts            # Traduções
```

#### page.tsx

```tsx
import S from './styles.module.css'
import { i18n } from './i18n'
import { PageHead } from '@/components/molecules/PageHead'

type PageProps = {
  params: { locale: string }
}

export default function Page({ params }: PageProps) {
  const t = i18n[params.locale as keyof typeof i18n]

  return (
    <>
      <PageHead
        title={t.title}
        description={t.description}
      />
      <main className={S.page}>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
      </main>
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const t = i18n[params.locale as keyof typeof i18n]
  return {
    title: t.title,
    description: t.description,
  }
}
```

#### Checklist

- [ ] Página criada em `src/app/[locale]/<rota>/`
- [ ] Traduções nos idiomas suportados
- [ ] Estilos com CSS Modules
- [ ] generateMetadata para SEO
- [ ] Responsivo (mobile-first)

---

## Referências

- Tokens: `src/theme/tokens/`
- Componentes existentes: `src/components/`
- Hooks existentes: `src/hooks/`

---

## Checklist

- [ ] Estrutura de pastas correta
- [ ] Types definidos
- [ ] Estilos com CSS Modules
- [ ] i18n se tiver textos visíveis
- [ ] Prefixos corretos (use* para hooks)
