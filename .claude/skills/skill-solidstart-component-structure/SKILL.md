---
name: skill-solidstart-component-structure
description: |
  Use este skill quando o usuário pedir para "organizar componentes Solid",
  "estrutura de componentes SolidStart", "Atomic Design Solid", ou mencionar
  organização de pastas de componentes Solid ou padrões de export.
  Cobre organização de pastas, arquivos obrigatórios, padrões de export e Atomic Design.
model: opus
---

# Estrutura de Componentes (SolidStart/SolidJS)

## Objetivo
Estrutura de componentes SolidStart/SolidJS - organização de pastas, arquivos obrigatórios, padrões de export e Atomic Design.

## Quando usar
- Ao criar componentes SolidStart/SolidJS.
- Ao aplicar Atomic Design e estrutura de pastas.
- Ao padronizar class/clsx e tokens.

## Organização de Pastas

```
src/presentation/components/
├── atoms/           # Elementos básicos (Button, Input, Icon)
├── molecules/       # Combinações de atoms (SearchBar, Card)
└── organisms/       # Seções completas (Header, Footer, Sidebar)
```

## Estrutura de um Componente

```
src/presentation/components/{atoms,molecules,organisms}/NomeComponente/
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

export const Nome = (props: NomeProps) => (
  <div class={clsx(S.container, props.class)}>
    {props.children}
  </div>
)
```

## Padrão types.ts

```ts
import type { JSX } from 'solid-js'

export type NomeProps = {
  children?: JSX.Element
  class?: string
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
| Atoms | - | Molecules, Organisms, Routes |
| Molecules | Atoms | Organisms, Routes |
| Organisms | Atoms, Molecules | Routes |

## Convenções de Naming

- Pasta: `PascalCase` (ex: `UserCard`)
- Arquivo principal: `index.tsx`
- Export: mesmo nome da pasta
- Props type: `NomeProps` (ex: `UserCardProps`)

## Extração de Componentes

**Regra:** SEMPRE mova CSS junto ao extrair componente.

```
# Antes (componente inline em página)
src/routes/[locale]/(baseLayout)/page/
├── index.tsx        # Contém UserCard inline + estilos
└── styles.module.css

# Depois (componente extraído)
src/routes/[locale]/(baseLayout)/page/
├── index.tsx
├── styles.module.css
└── components/
    └── UserCard/
        ├── index.tsx
        └── styles.module.css  # ← Mover estilos junto!
```

## Trabalhando com Figma MCP

Ao implementar designs do Figma:

1. **Busque componentes existentes primeiro**
   - Verifique `src/presentation/components/` antes de criar algo novo
   - Use Glob/Grep para encontrar componentes similares
   - Consulte `docs/styleguide.md#components` para catálogo

2. **Use props, não CSS customizado**
   - Componentes existentes têm props para variações
   - Ajuste via props: `size`, `variant`, `class`
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
- [ ] Componentes usam `class` e `clsx` corretamente
- [ ] `index.tsx`, `types.ts` e `styles.module.css` criados quando necessário
- [ ] Estilos ficam junto do componente (sem espalhar CSS)
- [ ] Design system reaproveitado antes de criar algo novo
