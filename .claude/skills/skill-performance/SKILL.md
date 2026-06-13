---
name: skill-performance
description: |
  Use este skill quando o usuário pedir para "otimizar performance", "lazy loading",
  "reduzir bundle", "melhorar Core Web Vitals", "memoização", "profiling",
  ou mencionar performance, carregamento lento ou otimização de renderização.
  Cobre lazy loading, memoização, bundle size, Core Web Vitals, profiling.
model: opus
---

# Performance

## Objetivo
Otimização de performance - lazy loading, memoização, bundle size, Core Web Vitals, profiling.

## Quando usar
- Ao otimizar bundle e renderização.
- Ao medir Core Web Vitals e gargalos.
- Ao aplicar lazy loading e memoização.

## Lazy Loading

### Componentes

```tsx
import { lazy, Suspense } from 'solid-js'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### Imagens

```tsx
<img
  src={image}
  alt={alt}
  loading="lazy"
  decoding="async"
/>

// Imagem crítica (above the fold)
<img
  src={heroImage}
  alt={alt}
  fetchpriority="high"
  loading="eager"
/>
```

## Memoização

### createMemo

```tsx
// ✅ Recalcula só quando items() muda
const sortedItems = createMemo(() =>
  items().slice().sort((a, b) => a.name.localeCompare(b.name))
)

// ❌ Recalcula em todo render
const sorted = items().slice().sort(...)
```

### Event Handlers

Em SolidJS, arrow functions inline são aceitáveis porque componentes
não re-executam como no React. Use a sintaxe de array para melhor performance:

```tsx
// ✅ Aceitável em SolidJS (componente não re-executa)
<button onClick={() => handleClick(item.id)}>

// ✅ Melhor performance: sintaxe de array evita criar closure
<button onClick={[handleClick, item.id]}>

// ✅ Handler simples sem argumentos
<button onClick={handleClick}>
```

> **Nota:** A sintaxe `[handler, arg]` é específica do SolidJS e passa
> o argumento diretamente sem criar uma nova função.

## Bundle Size

### Importações específicas

```typescript
// ❌ Importa toda a biblioteca
import _ from 'lodash'
_.debounce(fn, 300)

// ✅ Importa só o necessário
import debounce from 'lodash/debounce'
debounce(fn, 300)
```

### Análise de bundle

```bash
# Visualizar bundle
pnpm build
npx source-map-explorer dist/**/*.js
```

## Core Web Vitals

### LCP (< 2.5s)

```tsx
// Preload recursos críticos
<link rel="preload" href={heroImage} as="image" />
<link rel="preload" href={criticalFont} as="font" crossorigin />

// Priorizar imagem principal
<img fetchpriority="high" src={hero} />
```

### CLS (< 0.1)

```css
/* Sempre definir dimensões */
img, video {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}

/* Reservar espaço */
.skeleton {
  min-height: 200px;
  background: var(--color-skeleton);
}
```

### INP (< 200ms)

```typescript
// Quebrar tarefas longas
const processLargeList = async (items: Item[]) => {
  for (const chunk of chunks(items, 100)) {
    await processChunk(chunk)
    // Yield para o browser
    await new Promise((r) => setTimeout(r, 0))
  }
}

// Debounce em inputs
const debouncedSearch = debounce(search, 300)
```

## Renderização

### Evitar re-renders

```tsx
// ❌ Objeto novo a cada render
<Component style={{ color: 'red' }} />

// ✅ Objeto estável
const style = { color: 'red' }
<Component style={style} />
```

### Listas grandes

```tsx
// Virtualização para listas longas
import { VirtualList } from '@solid-primitives/virtual'

<VirtualList
  items={items()}
  itemHeight={50}
  overscan={5}
>
  {(item) => <ListItem item={item} />}
</VirtualList>
```

## Profiling

### DevTools

```typescript
// Marcar para profiling
performance.mark('start-operation')
await heavyOperation()
performance.mark('end-operation')
performance.measure('operation', 'start-operation', 'end-operation')
```

### Console timing

```typescript
console.time('operation')
await heavyOperation()
console.timeEnd('operation')
```

## Checklist

- [ ] Lazy load componentes pesados
- [ ] Imagens com loading="lazy"
- [ ] createMemo para valores derivados
- [ ] Bundle size analisado
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Listas grandes virtualizadas
