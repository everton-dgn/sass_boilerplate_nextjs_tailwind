---
name: skill-solidjs-primitives
description: |
  Use este skill quando o usuário pedir para "criar primitive Solid", "createSignal vs makeSignal",
  "diferença create* e make*", ou mencionar primitives em Solid.js,
  APIs reativas reutilizáveis ou nomenclatura de primitives.
  Cobre diferença entre create* e make*, quando usar cada prefixo, exemplos e localização.
model: opus
---

# Primitives (não "hooks")

## Objetivo
Primitives - diferença entre create* e make*, quando usar cada prefixo, exemplos e localização.

## Quando usar
- Ao criar primitives create* e make*.
- Ao padronizar APIs reativas e nomenclatura.
- Ao organizar pasta de primitives.

Este projeto usa **primitives**, não "hooks". Primitives são funções reativas reutilizáveis que encapsulam lógica de estado e comportamento.

## Prefixo `create*`

**Cria e retorna estado reativo próprio.**

Características:
- Cria signals internamente
- Retorna accessors e setters
- Não depende de estado externo
- Uso: `const { ... } = createX()`

```ts
import { createSignal } from 'solid-js'
import type { CreateDisclosureReturn } from './types'

export const createDisclosure = (): CreateDisclosureReturn => {
  const [isOpen, setIsOpen] = createSignal(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const onToggle = () => setIsOpen(prev => !prev)

  return { isOpen, onOpen, onClose, onToggle }
}

// Uso
const { isOpen, onToggle } = createDisclosure()
```

## Prefixo `make*`

**Recebe estado e configura side effects.**

Características:
- Recebe signals como parâmetros
- Não retorna nada (ou retorna cleanup)
- Configura listeners, observers, etc.
- Uso: `makeX({ signal1, signal2 })`

```ts
import { createEffect, onCleanup } from 'solid-js'
import type { MakeDetectClickOutsideProps } from './types'

export const makeDetectClickOutside = ({ ref, isActive, onClickOutside }: MakeDetectClickOutsideProps) => {
  createEffect(() => {
    if (!isActive()) return

    const handler = (e: PointerEvent) => {
      if (ref() && !ref()!.contains(e.target as Node)) {
        onClickOutside()
      }
    }

    document.addEventListener('pointerdown', handler)
    onCleanup(() => document.removeEventListener('pointerdown', handler))
  })
}

// Uso
makeDetectClickOutside({
  ref: containerRef,
  isActive: isOpen,
  onClickOutside: onClose
})
```

## Como Identificar

| Pergunta | `create*` | `make*` |
|----------|-----------|---------|
| Cria estado novo? | Sim | Não |
| Retorna signals? | Sim | Não |
| Recebe signals? | Opcional | Obrigatório |
| Faz side effects? | Não | Sim |

**Regra prática:**
- `create*` → "cria algo novo" → retorna signals/accessors
- `make*` → "faz algo com" → recebe signals, configura comportamentos

## Estrutura de Arquivos

```
src/presentation/primitives/
├── createDisclosure/
│   ├── index.ts
│   └── types.ts
├── createStorage/
│   ├── index.ts
│   └── types.ts
└── makeDetectClickOutside/
    ├── index.ts
    └── types.ts
```

## Primitives Existentes

- `createDisclosure` - estado aberto/fechado
- `createStorage` - persistência em storage
- `makeDetectClickOutside` - detectar clique fora

## Checklist

- [ ] Nome do primitive reflete `create*` ou `make*`
- [ ] API expõe signals/accessors de forma consistente
- [ ] Side effects encapsulados em `createEffect`/`onCleanup`
- [ ] Tipos definidos em `types.ts` e exportados
- [ ] Uso documentado com exemplo mínimo
