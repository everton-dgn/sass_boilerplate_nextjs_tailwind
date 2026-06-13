---
name: skill-theming
description: |
  Use este skill quando o usuário pedir para "implementar dark mode", "criar tema",
  "alternar light/dark", "respeitar preferência do sistema", "reduced motion",
  ou mencionar sistema de temas, CSS variables de tema ou breakpoints responsivos.
  Cobre light/dark mode, preferência do sistema, breakpoints, animações com reduced motion.
model: opus
---

# Theming

## Objetivo
Sistema de temas - light/dark mode, preferência do sistema, breakpoints, animações com reduced motion.

## Quando usar
- Ao implementar tema light/dark.
- Ao definir tokens e CSS variables de tema.
- Ao respeitar reduced motion e breakpoints.

## Light/Dark Mode

```css
:root {
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
}

[data-theme='dark'] {
  --color-bg: #111827;
  --color-bg-secondary: #1f2937;
  --color-text: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
}

.card {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

## Preferência do Sistema

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --color-bg: #111827;
    --color-text: #f9fafb;
  }
}
```

## Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Mobile-first */
.container { padding: 16px; }

@media (min-width: 768px) {
  .container { padding: 24px; }
}

@media (min-width: 1024px) {
  .container { padding: 32px; }
}
```

## Animações

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Respeitar preferência do usuário */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Checklist

- [ ] Light theme
- [ ] Dark theme
- [ ] Respeita prefers-color-scheme
- [ ] Mobile-first breakpoints
- [ ] Respeita prefers-reduced-motion
