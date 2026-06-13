---
name: skill-solidjs-scaffolding
description: |
  Use este skill quando o usuário pedir para "criar componente Solid", "novo primitive",
  "nova página SolidStart", "scaffold Solid", ou mencionar criação de componentes,
  primitives ou páginas seguindo convenções SolidJS/SolidStart.
  Use /skill-solidjs-scaffolding [component|primitive|page].
argument-hint: "[component|primitive|page] [args]"
model: opus
user-invocable: true
---

# SolidJS/SolidStart Scaffolding

## Objetivo

Scaffolding para criar componentes, primitives e páginas seguindo as convenções do projeto SolidJS/SolidStart.

## Quando usar

- Para criar componente → `/skill-solidjs-scaffolding component`
- Para criar primitive → `/skill-solidjs-scaffolding primitive`
- Para criar página → `/skill-solidjs-scaffolding page`

## Skills relacionados

- `skill-solidstart-component-structure` - estrutura de componentes
- `skill-solidjs-primitives` - padrões de primitives
- `skill-solidjs-patterns` - padrões SolidJS

---

## Workflows Invocáveis

### /solidjs-component type=<atom|molecule|organism> name=<PascalCase>

Crie o componente com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `type` (atom, molecule, organism) e `name` (PascalCase).

#### Antes de criar

Pergunte:
1. O componente terá textos visíveis ao usuário? (Se sim, criar `i18n.ts`)
2. Qual a funcionalidade principal?

#### Estrutura

```
src/presentation/components/<type>s/<ComponentName>/
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

export const <ComponentName> = (props: <ComponentName>Props) => (
  <div class={clsx(S.container, props.class)}>
    {props.children}
  </div>
)
```

**types.ts:**
```ts
import type { JSX } from 'solid-js'

export type <ComponentName>Props = {
  children?: JSX.Element
  class?: string
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

### /solidjs-primitive name=<create...|make...>

Crie o primitive com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `name` com prefixo `create` ou `make`.

#### Antes de criar

Identifique o tipo pelo prefixo do nome:

| Prefixo | Tipo | Retorna |
|---------|------|---------|
| `create*` | Cria estado próprio | signals/accessors |
| `make*` | Recebe estado | void (side effects) |

Se o nome não começar com `create` ou `make`, pergunte qual é a intenção.

#### Estrutura

```
src/presentation/primitives/<PrimitiveName>/
├── index.ts
└── types.ts
```

#### index.ts

```ts
import { createSignal, createEffect } from 'solid-js'
import type { <PrimitiveName>Return } from './types'

export const <PrimitiveName> = (): <PrimitiveName>Return => {
  // Implementação
}
```

#### types.ts

```ts
export type <PrimitiveName>Return = {
  // Retorno do primitive
}
```

---

### /solidstart-page path="<rota>" name="<nome>"

Crie a página com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `path` para a rota e `name` para o nome da página.

#### Estrutura a criar

```
src/routes/[locale]/<rota>/
├── index.tsx          # Componente da página
├── styles.module.css  # Estilos
└── i18n.ts            # Traduções
```

#### index.tsx

```tsx
import S from './styles.module.css'
import { i18n } from './i18n'
import { PageHead } from '@/presentation/components/molecules/PageHead'
import type { Locale } from '@/core/i18n/types'

type PageProps = {
  params: { locale: Locale }
}

export default (props: PageProps) => {
  const t = i18n[props.params.locale]

  return (
    <>
      <PageHead
        title={t.title}
        description={t.description}
        lang={props.params.locale}
      />
      <main class={S.page}>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
      </main>
    </>
  )
}
```

#### Checklist

- [ ] Página criada em `src/routes/[locale]/<rota>/`
- [ ] Traduções nos 3 idiomas (pt, en, es)
- [ ] Estilos com CSS Modules
- [ ] PageHead para SEO
- [ ] Responsivo (mobile-first)

---

## Referências

- Tokens: `src/presentation/theme/tokens/`
- Componentes existentes: `src/presentation/components/`
- Primitives existentes: `src/presentation/primitives/`

---

## Checklist

- [ ] Estrutura de pastas correta
- [ ] Types definidos
- [ ] Estilos com CSS Modules
- [ ] i18n se tiver textos visíveis
- [ ] Prefixos corretos (create*/make* para primitives)
