---
name: skill-meta-tags
description: |
  Use este skill quando o usuário pedir para "adicionar meta tags", "Open Graph",
  "Twitter Card", "SEO da página", "título e descrição", ou mencionar
  meta tags, preview social ou viewport.
  Cobre title, description, Open Graph, Twitter Cards, viewport.
model: opus
---

# Meta Tags

## Objetivo
Meta tags essenciais - title, description, Open Graph, Twitter Cards, viewport.

## Quando usar
- Ao configurar title/description/OG por página.
- Ao preparar previews sociais consistentes.
- Ao validar tags essenciais e viewport.

## Essenciais

```tsx
const PageHead = (props: PageHeadProps) => {
  return (
    <>
      {/* Título - 50-60 caracteres */}
      <title>{props.title}</title>

      {/* Descrição - 150-160 caracteres */}
      <meta name="description" content={props.description} />

      {/* Canonical URL */}
      <link rel="canonical" href={props.canonicalUrl} />

      {/* Idioma */}
      <html lang={props.locale} />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </>
  )
}
```

## Open Graph

```tsx
const OpenGraphTags = (props: OGProps) => {
  return (
    <>
      <meta property="og:type" content={props.type ?? 'website'} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:url" content={props.url} />
      <meta property="og:image" content={props.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={props.siteName} />
      <meta property="og:locale" content={props.locale} />
    </>
  )
}
```

## Twitter Cards

```tsx
const TwitterTags = (props: TwitterProps) => {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={props.image} />
      <meta name="twitter:site" content="@username" />
    </>
  )
}
```

## hreflang (i18n)

```tsx
const AlternateLinks = (props: AlternateProps) => {
  const locales = ['pt', 'en', 'es']

  return (
    <>
      {locales.map((locale) => (
        <link
          rel="alternate"
          hreflang={locale}
          href={`${props.baseUrl}/${locale}${props.path}`}
        />
      ))}
      <link
        rel="alternate"
        hreflang="x-default"
        href={`${props.baseUrl}/pt${props.path}`}
      />
    </>
  )
}
```

## Checklist

- [ ] Title único (50-60 chars)
- [ ] Description única (150-160 chars)
- [ ] Canonical URL
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] hreflang se multilíngue
- [ ] Imagens 1200x630
