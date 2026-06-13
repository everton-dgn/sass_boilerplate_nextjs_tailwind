---
name: skill-nextjs-component-structure
description: |
  Use este skill quando o usuário pedir para "organizar componentes Next.js",
  "estrutura de componentes React", "Atomic Design", "Server vs Client Component",
  ou mencionar organização de pastas de componentes ou padrões de export.
  Cobre organização de pastas, arquivos obrigatórios, padrões de export e Atomic Design.
model: opus
---

# Estrutura de Componentes (Next.js/React)

## Objetivo
Estrutura de componentes Next.js/React - organização de pastas, arquivos obrigatórios, padrões de export e Atomic Design.

## Quando usar
- Ao criar componentes React/Next com Atomic Design.
- Ao decidir entre Server e Client Components.
- Ao aplicar estrutura de pastas e exports.

## Organização de Pastas

```
src/components/
├── atoms/           # Elementos básicos (Button, Input, Icon)
├── molecules/       # Combinações de atoms (SearchBar, Card)
└── organisms/       # Seções completas (Header, Footer, Sidebar)
```

## Estrutura de um Componente

```
src/components/{atoms,molecules,organisms}/NomeComponente/
├── index.tsx           # Componente principal (obrigatório)
├── styles.module.css   # Estilos (obrigatório)
├── types.ts            # Types (quando necessário)
└── i18n.ts             # Traduções (quando tem textos visíveis)
```

## Padrão index.tsx

```tsx
import { clsx } from 'clsx'
import S from './styles.module.css'
import type { NomeProps } from './types'

export const Nome = ({ children, className }: NomeProps) => (
  <div className={clsx(S.container, className)}>
    {children}
  </div>
)
```

## Padrão types.ts

```ts
import type { ReactNode } from 'react'

export type NomeProps = {
  children?: ReactNode
  className?: string
}
```

## Padrão styles.module.css

```css
.container {
  display: flex;
  gap: 8px;
}
```

## Atomic Design - Limites de Dependência

| Tipo | Pode importar | Não pode importar |
|------|---------------|-------------------|
| Atoms | - | Molecules, Organisms, Pages |
| Molecules | Atoms | Organisms, Pages |
| Organisms | Atoms, Molecules | Pages |

## Convenções de Naming

- Pasta: `PascalCase` (ex: `UserCard`)
- Arquivo principal: `index.tsx`
- Export: mesmo nome da pasta
- Props type: `NomeProps` (ex: `UserCardProps`)

## Extração de Componentes

**Regra:** SEMPRE mova CSS junto ao extrair componente.

```
# Antes (componente inline em página)
app/dashboard/page/
├── page.tsx         # Contém UserCard inline + estilos
└── styles.module.css

# Depois (componente extraído)
app/dashboard/page/
├── page.tsx
├── styles.module.css
└── components/
    └── UserCard/
        ├── index.tsx
        └── styles.module.css  # ← Mover estilos junto!
```

## Server vs Client Components

```tsx
// Server Component (default no App Router)
// Pode usar async/await, acessar DB, etc.
export default async function ServerComponent() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component (precisa da diretiva)
'use client'
import { useState } from 'react'

export const ClientComponent = () => {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Trabalhando com Figma MCP

Ao implementar designs do Figma:

1. **Busque componentes existentes primeiro**
   - Verifique `src/components/` antes de criar algo novo
   - Use Glob/Grep para encontrar componentes similares
   - Consulte `docs/styleguide.md#components` para catálogo

2. **Use props, não CSS customizado**
   - Componentes existentes têm props para variações
   - Ajuste via props: `size`, `variant`, `className`
   - Evite sobrescrever estilos do design system

3. **Quando criar novo componente**
   - Apenas se não existir nada similar
   - Siga estrutura padrão (index.tsx + styles.module.css + types.ts)
   - Use tokens existentes, não valores hardcoded

4. **Hierarquia de decisão**
   ```
   1. Componente exato existe? → Use direto
   2. Componente similar existe? → Use com props/composição
   3. Pode compor componentes existentes? → Componha
   4. Nenhuma opção? → Crie novo seguindo padrões
```

## Checklist

- [ ] Estrutura de pastas e nomes seguem o padrão do projeto
- [ ] Componentes usam `className` e `clsx` corretamente
- [ ] `index.tsx`, `types.ts` e `styles.module.css` criados quando necessário
- [ ] Server/Client Components estão separados com `use client` só quando preciso
- [ ] Design system reaproveitado antes de criar algo novo
