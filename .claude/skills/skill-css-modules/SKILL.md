---
name: skill-css-modules
description: |
  Use este skill quando o usuário pedir para "estilizar componente", "CSS Module",
  "criar estilos", "CSS nesting", "responsividade", ou mencionar CSS Modules,
  naming de classes, tokens do tema ou padrões de media queries.
  Cobre import, naming, CSS nesting, tokens do tema e padrões de responsividade.
model: opus
---

# CSS Modules

## Objetivo
CSS Modules - import, naming, CSS nesting, tokens do tema e padrões de responsividade.

## Quando usar
- Ao estilizar componentes com CSS Modules.
- Ao padronizar naming e estrutura de classes.
- Ao aplicar tokens e responsividade.

## Import

Sempre importe como `S`.

**Atenção:** Mantenha o casing exato dos paths de import (CI é Linux):

```tsx
// Correto
import S from './styles.module.css'

// Errado - vai falhar no CI
import S from './Styles.module.css'
```

Exemplo:

```tsx
import S from './styles.module.css'

<div className={S.container}>
```

## Classes Condicionais

Use `clsx` para classes condicionais:

```tsx
import { clsx } from 'clsx'

<div className={clsx(S.button, variant && S[`variant_${variant}`])}>
```

## Naming de Classes

Use `snake_case` para classes multi-palavra:

```css
/* Correto */
.nav_item { }
.is_active { }
.size_sm { }

/* Errado */
.navItem { }
.isActive { }
.sizeSm { }
```

### Contexto Semântico

SEMPRE use nomes que indiquem o propósito/conteúdo do elemento:

```css
/* Correto - indica o que contém */
.checkbox_row { }
.remove_button { }
.user_avatar { }

/* Errado - muito genérico, perde contexto */
.checkbox { }    /* É o checkbox ou o container? */
.button { }      /* Qual botão? Faz o quê? */
.wrapper { }     /* Wrapper de quê? */
```

## CSS Nesting

Use nesting para pseudo-classes, pseudo-elementos e media queries:

```css
.button {
  padding: 12px;
  background: var(--color-bg-primary);

  &:hover {
    background: var(--color-bg-secondary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-accent);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.is_active {
    border-color: var(--color-stroke-accent);
  }

  @media (width >= 768px) {
    padding: 16px;
  }
}
```

## Tokens do Tema

**SEMPRE consultar os arquivos do tema antes de usar tokens.**

```bash
# Procurar pasta de tokens/theme
fd -t d "theme" src/
fd -t d "tokens" src/

# Ler tokens disponíveis (ajustar paths conforme projeto)
cat src/theme/tokens/*.css
```

**Padrões gerais:**
- Cores: `var(--color-bg-*)`, `var(--color-text-*)`, `var(--color-surface-*)`, etc.
- Espaçamento: usar pixels diretamente (4, 8, 12, 16, 24, 32, 48, 64)
- Tipografia: classes globais ou variáveis `--font-*`
- Bordas: `var(--radius-*)`
- Sombras: `var(--shadow-*)`

**NUNCA inventar tokens.** Se não existir, usar o mais próximo.

## Responsividade

Use media queries com CSS nesting e `width`:

```css
.container {
  padding: 16px;

  @media (width >= 768px) {
    padding: 24px;
  }

  @media (width >= 1024px) {
    padding: 32px;
  }
}
```

## Checklist

- [ ] Importado como `S` e casing do arquivo está correto
- [ ] Classes em `snake_case` e com contexto semântico
- [ ] Condicionais com `clsx` e sem concatenação manual
- [ ] Tokens do tema usados em vez de valores mágicos
- [ ] Responsividade coberta nos breakpoints necessários

## Referência

Tokens completos em: `src/theme/` ou `src/presentation/theme/` (consultar arquivos CSS diretamente)
