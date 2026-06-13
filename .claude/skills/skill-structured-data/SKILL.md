---
name: skill-structured-data
description: |
  Use este skill quando o usuário pedir para "adicionar JSON-LD", "Schema.org",
  "structured data", "rich snippets", "FAQ schema", ou mencionar
  dados estruturados, breadcrumb schema ou validação de rich results.
  Cobre JSON-LD Schema.org - Website, Article, Breadcrumb, FAQ, validação.
model: opus
---

# Structured Data (JSON-LD)

## Objetivo
JSON-LD Schema.org - Website, Article, Breadcrumb, FAQ, validação.

## Quando usar
- Ao adicionar JSON-LD Schema.org.
- Ao validar rich results e warnings.
- Ao padronizar tipos (Article/FAQ/etc.).

## Website

```tsx
const WebsiteSchema = (props: WebsiteSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: props.name,
    url: props.url,
    description: props.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${props.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  )
}
```

## Article (Blog Post)

```tsx
const ArticleSchema = (props: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    image: props.image,
    datePublished: props.publishedAt,
    dateModified: props.updatedAt,
    author: {
      '@type': 'Person',
      name: props.author.name,
      url: props.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: props.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: props.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.url,
    },
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  )
}
```

## Breadcrumb

```tsx
const BreadcrumbSchema = (props: BreadcrumbProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: props.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  )
}
```

## FAQ

```tsx
const FAQSchema = (props: FAQProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  )
}
```

## Validação

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

## Checklist

- [ ] JSON-LD presente
- [ ] Validado no Rich Results Test
- [ ] Article para posts
- [ ] Breadcrumbs
- [ ] FAQ se aplicável
