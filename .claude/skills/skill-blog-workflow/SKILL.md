---
name: skill-blog-workflow
description: |
  Use este skill quando o usuário pedir para "criar post de blog", "novo artigo",
  "divulgar nas redes", "criar post social", ou mencionar workflow de conteúdo,
  criação de artigos ou posts para redes sociais.
  Use /skill-blog-workflow [new-post|social-post] para criar artigos ou divulgação.
argument-hint: "[new-post|social-post] [args]"
model: opus
user-invocable: true
---

# Blog Workflow

## Objetivo

Workflows procedurais para criação de conteúdo de blog e posts para redes sociais.

## Quando usar

- Para criar novo artigo de blog → `/skill-blog-workflow new-post`
- Para criar posts de divulgação → `/skill-blog-workflow social-post`

## Skills relacionados

- `skill-blog-writing` - técnicas de escrita para blog
- `skill-content-marketing` - estratégias de marketing de conteúdo

---

## Workflows Invocáveis

### /new-post slug="x" title="y" category="z"

Crie um post completo para o blog Dev Insights com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use pares `chave="valor"` para `slug`, `title` e `category`.

#### Fluxo completo (PT primeiro, traduções depois)

**IMPORTANTE**: Crie e finalize o post em português PRIMEIRO. Só depois de revisado e aprovado, faça as traduções.

#### 1. Descoberta

- Pergunte sobre o tema e objetivo do post
- Entenda o público-alvo
- Identifique os pontos principais a cobrir

#### 2. Estrutura inicial (apenas PT)

Crie a pasta e arquivo em português:
```
src/content/blog/posts/<slug>/
├── pt.mdx
└── images/
```

#### 3. Escrita em PT

- Escreva o conteúdo em português
- Use tom técnico mas acessível
- Inclua exemplos de código quando relevante
- Estruture: introdução → desenvolvimento → conclusão

#### 4. SEO em PT

- Crie descrição otimizada (150-160 caracteres)
- Título atrativo e específico
- Alt text descritivo para imagens em português

#### 5. Tags e palavras-chave (PT)

- Sugira 3-5 tags relevantes em português
- Considere termos de busca em PT-BR
- Mantenha consistência com posts existentes

#### 6. Revisão do PT

- Verifique gramática e ortografia
- Confirme links funcionais
- Valide frontmatter completo
- **PAUSE aqui** - peça aprovação antes de traduzir

#### 7. Tradução (APÓS APROVAÇÃO)

Só após o PT estar finalizado:
- Crie `en.mdx` e `es.mdx`
- Traduza e adapte (não tradução literal)
- Adapte expressões idiomáticas
- Traduza tags
- Mantenha `translationKey` idêntico

#### Frontmatter

```yaml
locale: pt
publishDate: <data-de-hoje-ISO>
updateDate: <data-de-hoje-ISO>
author: "Everton Toffanetto"
title: "<titulo>"
description: "<descrição-SEO-150-160-chars>"
category: "<categoria>"
tags:
  - <tag1>
  - <tag2>
  - <tag3>
image:
  src: /images/posts/<slug>/hero.png
  alt: "<alt-descritivo>"
  cardSrc: /images/posts/<slug>/card.png
  cardAlt: "<alt-descritivo>"
slug: "<slug>"
translationKey: "<slug>"
isDraft: true
```

#### Checklist

**Fase 1: PT (antes de traduzir)**
- [ ] Conteúdo em PT escrito e revisado
- [ ] Descrição SEO otimizada em PT
- [ ] Tags relevantes em PT definidas
- [ ] Alt text em PT para imagens
- [ ] `isDraft: true` configurado
- [ ] **Aprovação do usuário para traduzir**

**Fase 2: Traduções (após aprovação)**
- [ ] Tradução EN completa
- [ ] Tradução ES completa
- [ ] Tags traduzidas
- [ ] Alt text traduzido

---

### /social-post slug="x" [platforms="all"] [lang="pt"]

Gere posts para redes sociais do artigo com base nos argumentos: **$ARGUMENTS**

#### Formato dos argumentos

Use `slug` (obrigatório). `platforms` e `lang` são opcionais.
Valores: `platforms=linkedin,x,reddit,youtube,bluesky` ou `all`; `lang=pt|en|both`.

#### Processo

**IMPORTANTE**: Crie os posts em português PRIMEIRO. Só depois de revisados e aprovados, faça as versões em outros idiomas.

#### 1. Ler o artigo

Leia o post em `src/content/blog/posts/<slug>/pt.mdx` e identifique:
- Tema principal
- Insights únicos
- Pontos mais interessantes
- Código de exemplo (se houver)

#### 2. Extrair hooks

Liste 3 possíveis ganchos:
1. **Problema** - Qual dor o artigo resolve?
2. **Curiosidade** - Qual fato surpreende?
3. **Benefício** - O que o leitor ganha?

#### 3. Gerar posts por plataforma

**LinkedIn:**
```
🚀 [Hook]

[3-5 parágrafos curtos com o conteúdo principal]

[CTA: Link para o post completo]

#hashtag1 #hashtag2 #hashtag3

Link: https://devinsights.io/pt/blog/posts/<slug>
```

**X (Thread):**
```
[Hook] 🧵

1/ [Introdução do problema/tema]
2/ [Ponto principal]
3/ [Exemplo ou insight]
4/ [Conclusão]
5/ Post completo: [link]
```

**X (Tweet único):**
```
[Versão condensada em 280 chars com link]
```

**Reddit:**
```
Título: [Título não clickbait, focado em valor]

Contexto: [Por que isso importa]

O que descobri: [Resumo dos pontos principais]

Detalhes completos no post: [link]

---
Subreddits sugeridos: r/webdev, r/frontend, etc.
```

**YouTube (descrição):**
```
Título sugerido: [Título otimizado para busca]

Descrição:
[Resumo em 2-3 linhas]

📚 Post completo: [link]

Tags sugeridas: [lista de tags]
```

**Bluesky:**
```
[Versão casual e conversacional, 300 chars]
```

#### Checklist PT (antes de traduzir)

- [ ] Hooks testados (qual performa melhor?)
- [ ] Links corretos
- [ ] Hashtags relevantes (onde aplicável)
- [ ] Tom adequado por plataforma
- [ ] Sem erros de digitação
- [ ] **Aprovação do usuário para traduzir**

#### Fase 2: English (APÓS APROVAÇÃO do PT)

Só gere os posts em inglês após a versão PT estar aprovada.

- [ ] Adaptado (não traduzido literalmente)
- [ ] Links apontando para /en/
- [ ] Hashtags relevantes em inglês
- [ ] Tom natural para audiência internacional

#### Dicas de timing

| Plataforma | Melhor horário (BRT) |
|------------|---------------------|
| LinkedIn | 8h-10h, 12h-13h |
| X | 9h-11h, 18h-20h |
| Reddit | 14h-16h (horário US) |
| Bluesky | Qualquer (menos saturado) |

---

## Checklist

- [ ] Post criado com estrutura correta
- [ ] Conteúdo técnico e acessível
- [ ] SEO otimizado
- [ ] Traduções naturais (não literais)
- [ ] Posts sociais adaptados por plataforma
