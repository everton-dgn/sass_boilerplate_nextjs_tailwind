---
name: skill-design-tokens
description: |
  Use este skill quando o usuário pedir para "criar design tokens", "definir cores",
  "escala de tipografia", "tokens semânticos", "variáveis CSS", ou mencionar
  design tokens, cores primitivas/semânticas, tipografia ou escalas de design.
  Cobre cores primitivas e semânticas, tipografia, bordas, sombras.
model: opus
---

# Design Tokens

## Objetivo
Tokens de design - cores primitivas e semânticas, tipografia, bordas, sombras.

## Quando usar
- Ao definir escalas de cor, tipografia e spacing.
- Ao mapear tokens semânticos e primários.
- Ao padronizar tokens entre temas.

## Cores

```css
:root {
  /* Primitivos (não usar diretamente) */
  --color-blue-50: #eff6ff;
  --color-blue-500: #3b82f6;
  --color-blue-900: #1e3a8a;
  --color-gray-50: #f9fafb;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;

  /* Semânticos (usar nos componentes) */
  --color-primary: var(--color-blue-500);
  --color-primary-hover: var(--color-blue-600);
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-background: var(--color-gray-50);
  --color-surface: #ffffff;
  --color-border: var(--color-gray-200);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

## Tipografia

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Scale 1.25 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## Bordas e Sombras

```css
:root {
  --radius-4: 4px;
  --radius-8: 8px;
  --radius-12: 12px;
  --radius-16: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

## Checklist

- [ ] Cores primitivas definidas
- [ ] Cores semânticas mapeadas
- [ ] Tipografia com escala modular
- [ ] Border radius padronizado
