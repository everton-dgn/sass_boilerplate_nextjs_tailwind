---
name: skill-keyboard-nav
description: |
  Use este skill quando o usuário pedir para "navegação por teclado", "tab order",
  "focus trap", "skip link", "focus visible", "acessível por teclado", ou mencionar
  navegação sem mouse, ordem de foco ou atalhos de teclado.
  Cobre tab order, focus trap, skip links, focus visible.
model: opus
---

# Keyboard Navigation

## Objetivo
Navegação por teclado - tab order, focus trap, skip links, focus visible.

## Quando usar
- Ao garantir navegação por teclado em fluxos completos.
- Ao implementar focus trap, skip link e focus visible.
- Ao revisar ordem de tab e atalhos de teclado.

## Requisitos

```tsx
// Elementos interativos devem ser focáveis
<button>OK</button>           // ✅ Focável por padrão
<div onClick={...}>OK</div>   // ❌ Não focável

// Se precisar de div interativo (evitar):
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  OK
</div>
```

## Tab Order

```tsx
// ❌ Ruim - ordem visual diferente da DOM
<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
  <button>Terceiro visualmente, primeiro no tab</button>
</div>

// ✅ Bom - ordem DOM = ordem visual
// Evitar tabIndex com valores positivos
```

## Focus Trap (Modais)

```tsx
const Modal = (props) => {
  let dialogRef: HTMLDialogElement
  let previousFocus: Element | null

  createEffect(() => {
    if (props.open) {
      previousFocus = document.activeElement
      dialogRef.showModal()
    } else {
      dialogRef.close()
      (previousFocus as HTMLElement)?.focus()
    }
  })

  return (
    <dialog ref={dialogRef!} onClose={props.onClose}>
      {props.children}
    </dialog>
  )
}
```

Modal deve:
1. Capturar foco ao abrir
2. Manter foco dentro enquanto aberto
3. Retornar foco ao elemento que abriu
4. Fechar com Escape

## Skip Links

```tsx
<a href="#main-content" class="skip-link">
  Pular para conteúdo principal
</a>

<nav>...</nav>

<main id="main-content" tabIndex={-1}>
  ...
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## Focus Visible CSS

```css
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.2);
}
```

## Checklist

- [ ] Tudo acessível via teclado
- [ ] Focus visível em todos estados
- [ ] Ordem de tab lógica
- [ ] Skip link presente
- [ ] Modais com focus trap
