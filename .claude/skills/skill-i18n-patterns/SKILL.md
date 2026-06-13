---
name: skill-i18n-patterns
description: |
  Use este skill quando o usuário pedir para "adicionar tradução", "internacionalizar",
  "i18n", "suporte multi-idioma", "extrair strings", ou mencionar internacionalização,
  estrutura de traduções ou uso de i18n em componentes.
  Use /skill-i18n-patterns para adicionar suporte i18n em arquivos existentes.
argument-hint: "<caminho-alvo>"
model: opus
user-invocable: true
---

# Padrões de Internacionalização (i18n)

## Objetivo

Internacionalização - estrutura de traduções, padrão i18n.ts, uso em componentes e boas práticas de tradução.

## Quando usar

- Ao estruturar arquivos i18n e chaves
- Para adicionar suporte i18n → `/skill-i18n-patterns`
- Ao lidar com pluralização e variáveis

---

## Workflow Interativo

### /add-i18n <caminho>

Adicione suporte a i18n em: **$ARGUMENTS**

#### Tipos de alvo

**Componente:**
```
<alvo>/
├── index.tsx
├── styles.module.css
├── types.ts
└── i18n.ts  ← criar
```

**Página/Rota:**
```
<alvo>/
├── index.tsx
├── styles.module.css
└── i18n.ts  ← criar
```

**Arquivo avulso:**
Criar `i18n.ts` na mesma pasta ou pasta adequada.

#### Processo

**1. Identificar textos**

Leia o arquivo alvo e liste todos os textos visíveis ao usuário:
- Labels, Títulos, Descrições
- Placeholders, Mensagens de erro
- Botões, Links

**2. Criar i18n.ts**

```ts
export const i18n = {
  pt: {
    title: 'Título em português',
    description: 'Descrição em português',
    button: 'Clique aqui'
  },
  en: {
    title: 'Title in English',
    description: 'Description in English',
    button: 'Click here'
  },
  es: {
    title: 'Título en español',
    description: 'Descripción en español',
    button: 'Haz clic aquí'
  }
}
```

**3. Atualizar componente/página**

```tsx
import { i18n } from './i18n'
import type { Locale } from '@/core/i18n/types'

type Props = {
  locale: Locale
}

export const Component = (props: Props) => {
  const t = i18n[props.locale]

  return (
    <div>
      <h1>{t.title}</h1>
      <p>{t.description}</p>
    </div>
  )
}
```

**4. Atualizar types.ts (se existir)**

Adicionar `locale` às props.

#### Checklist

- [ ] Todos os textos visíveis identificados
- [ ] i18n.ts criado com 3 idiomas (pt, en, es)
- [ ] Componente atualizado para usar traduções
- [ ] Props incluem `locale`
- [ ] Types atualizados
- [ ] Traduções naturais (não literais)

---

## Conhecimento Base

### Idiomas Suportados

- `pt` - Português (idioma base)
- `en` - English
- `es` - Español

### Estrutura do Arquivo i18n.ts

Cada componente ou página com textos visíveis deve ter um arquivo `i18n.ts`:

```ts
export const i18n = {
  pt: {
    title: 'Título em português',
    description: 'Descrição em português',
    button: 'Clique aqui'
  },
  en: {
    title: 'Title in English',
    description: 'Description in English',
    button: 'Click here'
  },
  es: {
    title: 'Título en español',
    description: 'Descripción en español',
    button: 'Haz clic aquí'
  }
}
```

### Uso no Componente

```tsx
import { i18n } from './i18n'
import type { Locale } from '@/core/i18n/types'

type Props = {
  locale: Locale
}

export const Component = (props: Props) => {
  const t = i18n[props.locale]

  return (
    <div>
      <h1>{t.title}</h1>
      <p>{t.description}</p>
    </div>
  )
}
```

### Textos com Variáveis

```ts
export const i18n = {
  pt: {
    greeting: (name: string) => `Olá, ${name}!`,
    count: (n: number) => `${n} ${n === 1 ? 'item' : 'itens'}`
  },
  en: {
    greeting: (name: string) => `Hello, ${name}!`,
    count: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`
  },
  es: {
    greeting: (name: string) => `¡Hola, ${name}!`,
    count: (n: number) => `${n} ${n === 1 ? 'elemento' : 'elementos'}`
  }
}
```

### Textos com HTML/JSX

Evite HTML nas traduções. Prefira compor no componente:

```tsx
const t = i18n[locale]
return <p>{t.prefix} <strong>{t.highlight}</strong> {t.suffix}</p>
```

### Boas Práticas

- Português é o idioma base - traduza a partir dele
- Mantenha as chaves idênticas entre idiomas
- Adapte expressões idiomáticas (não traduza literalmente)
- Revise pluralização para cada idioma
- Considere tamanho do texto (alemão é mais longo)

### Localização de Arquivos

- Componentes: `src/presentation/components/**/i18n.ts`
- Páginas: `src/routes/[locale]/**/i18n.ts`
- Types: `src/core/i18n/types.ts`

---

## Checklist

- [ ] Idioma base definido (PT) e chaves alinhadas
- [ ] Variáveis e pluralização tratadas corretamente
- [ ] Texto composto no componente, não no i18n
- [ ] Comprimentos revisados para idiomas longos
- [ ] Pastas e tipos seguem o padrão do projeto
