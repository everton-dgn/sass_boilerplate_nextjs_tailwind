# Skeleton CSS

## Toggle com data-skeleton

```tsx
// Ativar skeleton mode
<main data-skeleton>...</main>

// Desativar (basta remover)
<main>...</main>
```

## CSS Completo

```css
/* Skeleton Mode - Wireframe Visual */
[data-skeleton] {
  --skeleton-bg: #f0f0f0;
  --skeleton-outline: #999;
  --skeleton-text: #666;
}

[data-skeleton] * {
  font-family: system-ui, sans-serif !important;
  color: var(--skeleton-text) !important;
}

[data-skeleton] section,
[data-skeleton] article,
[data-skeleton] header,
[data-skeleton] footer,
[data-skeleton] nav,
[data-skeleton] aside,
[data-skeleton] div[class] {
  background: var(--skeleton-bg) !important;
  outline: 2px dashed var(--skeleton-outline) !important;
  outline-offset: -2px;
  position: relative;
}

/* Labels para identificar elementos */
[data-skeleton] section::before,
[data-skeleton] article::before,
[data-skeleton] header::before,
[data-skeleton] footer::before,
[data-skeleton] nav::before {
  content: attr(data-skeleton-label);
  position: absolute;
  top: -10px;
  left: 8px;
  background: var(--skeleton-outline);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 1;
}

/* Placeholders para imagens */
[data-skeleton] img {
  background: repeating-linear-gradient(
    45deg, #ddd, #ddd 10px, #eee 10px, #eee 20px
  ) !important;
  min-height: 100px;
}

/* Botões como wireframe */
[data-skeleton] button,
[data-skeleton] a[class*="button"],
[data-skeleton] [role="button"] {
  background: white !important;
  outline: 2px solid var(--skeleton-outline) !important;
  outline-offset: -2px;
  color: var(--skeleton-text) !important;
}

/* Inputs como wireframe */
[data-skeleton] input,
[data-skeleton] textarea,
[data-skeleton] select {
  background: white !important;
  outline: 1px solid var(--skeleton-outline) !important;
  outline-offset: -1px;
}
```

## Placeholders Padronizados

| Formato | Exemplo |
|---------|---------|
| `[ICON:name]` | `[ICON:star]` |
| `[IMG:desc]` | `[IMG:hero-product]` |
| `[TITLE:texto]` | `[TITLE:Benefícios]` |
| `[TEXT:desc]` | `[TEXT:2 linhas]` |
| `[BTN:label]` | `[BTN:Começar]` |
| `[INPUT:tipo]` | `[INPUT:email]` |
| `[LIST:N]` | `[LIST:4 itens]` |
| `[GRID:NxM]` | `[GRID:2x2 cards]` |
| `[LINK:texto]` | `[LINK:Saiba mais]` |

## Exemplo

```tsx
<section data-skeleton data-skeleton-label="BENEFITS">
  <header data-skeleton-label="HEADER">
    <span>[ICON:star] [TEXT:Novo]</span>
    <h2>[TITLE:Main heading]</h2>
  </header>
  <ul data-skeleton-label="LIST:4">
    <li>[TEXT:Item 1]</li>
    <li>[TEXT:Item 2]</li>
  </ul>
</section>
```
