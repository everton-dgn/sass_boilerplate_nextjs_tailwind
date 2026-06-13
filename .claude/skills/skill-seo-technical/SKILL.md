---
name: skill-seo-technical
description: |
  Use este skill quando o usuário pedir para "criar sitemap", "configurar robots.txt",
  "canonical URL", "URLs amigáveis", "SEO técnico", ou mencionar
  indexação, Core Web Vitals ou hreflang.
  Cobre sitemap, robots.txt, canonical URLs, URLs amigáveis, Core Web Vitals.
model: opus
---

# SEO Technical

## Objetivo
SEO técnico - sitemap, robots.txt, canonical URLs, URLs amigáveis, Core Web Vitals.

## Quando usar
- Ao configurar sitemap, robots e canonicals.
- Ao revisar indexação e Core Web Vitals.
- Ao ajustar URLs e hreflang.

## Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/pt/</loc>
    <lastmod>2025-01-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="https://example.com/pt/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
  </url>
</urlset>
```

## robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml

Disallow: /admin/
Disallow: /search?
Disallow: /api/
```

## Canonical URLs

```tsx
// Mesma página em múltiplas URLs
<link rel="canonical" href="https://example.com/produtos/camiseta" />

// Paginação - apontar para página 1
<link rel="canonical" href="https://example.com/blog" />

// Parâmetros de tracking
// /produto?utm_source=facebook → /produto
<link rel="canonical" href="https://example.com/produto" />
```

## URLs Amigáveis

```
✅ /blog/como-criar-componentes-solidjs
❌ /blog/post?id=123

✅ /pt/blog/titulo-do-post
❌ /blog/titulo-do-post?lang=pt
```

### Slugify

```typescript
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

## Core Web Vitals

### LCP (< 2.5s)

```tsx
<img
  src={heroImage}
  alt="Hero"
  fetchpriority="high"
  loading="eager"
/>

<link rel="preload" href={heroImage} as="image" />
```

### CLS (< 0.1)

```css
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
```

### INP (< 200ms)

```typescript
// Quebrar tarefas longas
for (const chunk of chunks(items, 100)) {
  await processChunk(chunk)
  await new Promise((r) => setTimeout(r, 0))
}
```

## Checklist

- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Canonical URLs
- [ ] URLs amigáveis
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] HTTPS obrigatório
- [ ] Mobile-friendly
