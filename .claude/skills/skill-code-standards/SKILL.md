---
name: skill-code-standards
description: |
  Use este skill quando o usuário pedir para "padronizar código", "aplicar convenções",
  "formatar código", "organizar imports", "seguir padrões do projeto", ou mencionar
  padrões TypeScript, formatação de código, convenções JSX ou padrões do projeto.
  Cobre padrões TypeScript, formatação, imports, JSX, convenções do projeto.
model: opus
---

# Regras Obrigatórias de Código

## Objetivo
Aplicar regras obrigatórias de código - padrões TypeScript, formatação, imports, JSX e convenções do projeto.

## Quando usar
- Ao criar ou editar código no projeto.
- Ao revisar PRs para garantir consistência.
- Ao alinhar padrões tecnicos do time.

## Escopo

- Regras gerais valem para todo o código TS/JS.
- Se o projeto já tiver padrão diferente, preserve o padrão local.
- Seções específicas (ex.: SolidJS) só se aplicam quando o stack for esse.

## Formatação

- **Sem `;`** em TS/JS. Se o repositório já usa `;`, mantenha o padrão local
- **Evite comentários** - use apenas para decisões não óbvias (trade-offs/invariantes)
- Indentação com tabs (ou padrão do repositório)

## TypeScript

- **`type` sobre `interface`**
  ```ts
  // ✅ Correto
  type Props = { name: string }

  // ❌ Errado
  interface Props { name: string }
  ```

- **Arrow functions com `const`**
  ```ts
  // ✅ Correto
  export const fetchUser = async (id: string) => {}

  // ❌ Errado
  export async function fetchUser(id: string) {}
  ```

- **`import type` para imports somente de tipo**
  ```ts
  import type { User } from './types'
  import { createUser } from './utils'
  ```

- **Sem `enum`** - use union types ou `as const`
  ```ts
  // ✅ Correto
  type Status = 'pending' | 'active' | 'done'
  const ROLES = ['admin', 'user'] as const

  // ❌ Errado
  enum Status { Pending, Active, Done }
  ```

## Imports

- **Alias `@/`** para imports absolutos
  ```ts
  import { Button } from '@/presentation/components/atoms/Button'
  ```

- **Sem barrel files** (`export *`, `index.ts` que só re-exporta)

## JSX (Solid.js)

- **`class`** em vez de `className`
  ```tsx
  // ✅ Correto
  <div class={S.container}>

  // ❌ Errado
  <div className={S.container}>
  ```

## Arquitetura

- **Evite context/providers** - prefira primitives, props ou signals locais
- Limites de Atomic Design: atoms não dependem de organisms nem de routes

## Checklist

- [ ] Formatação segue o padrão do projeto
- [ ] Typescript usa `type`, `import type` e sem `enum`
- [ ] Imports respeitam alias e evitam barrels
- [ ] JSX usa a convenção correta do framework
- [ ] Arquitetura respeita limites de camada
