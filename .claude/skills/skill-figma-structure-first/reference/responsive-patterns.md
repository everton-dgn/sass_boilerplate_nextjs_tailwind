# Responsive CSS Patterns

## Hierarquia de Preferência

```
1. CSS Intrínseco (sem media queries)
   → clamp(), min(), max()
   → auto-fit/auto-fill grids
   → flex-wrap

2. Container Queries
   → @container
   → Componente se adapta ao espaço

3. Media Queries (último recurso)
   → Mudanças estruturais grandes
   → Mostrar/esconder elementos
```

## Patterns

### Fluid Typography

```css
h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
}
```

### Fluid Spacing

```css
.section {
  padding: clamp(1rem, 5vw, 4rem);
  gap: clamp(1rem, 3vw, 2rem);
}
```

### Grid Auto-Fit

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

### Container Queries

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  grid-template-columns: 1fr;
}

@container (min-width: 400px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}
```

### Flexbox com Wrap

```css
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions > * {
  flex: 1 1 auto;
  min-width: fit-content;
}
```

### Aspect Ratio

```css
.hero-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

### Min/Max Constraints

```css
.content {
  width: min(100%, 1200px);
  margin-inline: auto;
  padding-inline: max(1rem, 5vw);
}
```

## Adaptação Mobile (quando Figma só tem Desktop)

| Desktop | Mobile |
|---------|--------|
| Grid 3-4 colunas | Grid 1-2 ou stack |
| Imagem ao lado | Imagem acima |
| Nav horizontal | Menu hamburguer |
| Hover states | Touch-friendly 44px |

## Auto Layout → CSS

| Figma | CSS |
|-------|-----|
| Direction Horizontal | `flex-direction: row` |
| Direction Vertical | `flex-direction: column` |
| Gap | `gap: Npx` |
| Space between | `justify-content: space-between` |
| Center | `justify-content: center` |
| Fill | `flex: 1` |
| Hug | `width: fit-content` |
