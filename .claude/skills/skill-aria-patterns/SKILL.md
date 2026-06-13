---
name: skill-aria-patterns
description: |
  Use este skill quando o usuário pedir para "adicionar ARIA", "landmarks",
  "live region", "aria-label", "formulário acessível", "role", ou mencionar
  padrões ARIA, estados acessíveis ou contraste.
  Cobre landmarks, live regions, estados, formulários acessíveis, contraste.
model: opus
---

# ARIA Patterns

## Objetivo
Padrões ARIA - landmarks, live regions, estados, formulários acessíveis, contraste.

## Quando usar
- Ao implementar componentes com ARIA (dialog, menu, tabs).
- Ao configurar landmarks, roles e estados acessíveis.
- Ao adicionar live regions e feedback dinâmico.

## Landmarks

```tsx
// Usar elementos semânticos (preferível)
<header>...</header>        // role="banner"
<nav>...</nav>              // role="navigation"
<main>...</main>            // role="main"
<aside>...</aside>          // role="complementary"
<footer>...</footer>        // role="contentinfo"

// ARIA só quando necessário
<div role="search">...</div>
```

## Live Regions

```tsx
// Anunciar mudanças dinâmicas
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// "polite": anuncia quando ocioso
// "assertive": interrompe (usar com moderação)

// Para toasts
<div role="status" aria-live="polite">
  Arquivo salvo com sucesso
</div>

// Para erros urgentes
<div role="alert" aria-live="assertive">
  Erro: conexão perdida
</div>
```

## Estados Comuns

```tsx
// Expandido/Colapsado
<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden={!isOpen}>...</ul>

// Selecionado
<li role="option" aria-selected={isSelected}>Opção</li>

// Atual (navegação)
<a href="/about" aria-current={isCurrentPage ? 'page' : undefined}>
  Sobre
</a>

// Ocupado/Carregando
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</button>
```

## Formulários

```tsx
// Label explícito
<label for="email">E-mail</label>
<input id="email" type="email" />

// aria-label para inputs sem label visível
<input type="search" aria-label="Buscar no site" />

// Campos obrigatórios
<label for="name">
  Nome <span aria-hidden="true">*</span>
</label>
<input id="name" required aria-required="true" />

// Erros
<input
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  E-mail inválido
</span>
```

## Contraste

| Tipo | Ratio Mínimo |
|------|--------------|
| Texto normal (< 18px) | 4.5:1 |
| Texto grande (≥ 18px) | 3:1 |
| UI components | 3:1 |

## Visually Hidden

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Checklist

- [ ] Landmarks semânticos
- [ ] Live regions para dinâmico
- [ ] Estados ARIA corretos
- [ ] Labels em todos inputs
- [ ] Erros identificados
- [ ] Contraste adequado
