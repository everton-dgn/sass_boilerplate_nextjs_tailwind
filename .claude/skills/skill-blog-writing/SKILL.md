---
name: skill-blog-writing
description: |
  Use este skill quando o usuário pedir para "escrever post", "criar artigo técnico",
  "estruturar post de blog", "melhorar engajamento", ou mencionar escrita técnica,
  estrutura de posts, SEO de conteúdo ou formatação de artigos.
  Cobre estrutura de posts, tom, SEO, code snippets, formatação, engajamento.
model: opus
---

# Blog Writing

## Objetivo
Padrões de escrita técnica para blog - estrutura de posts, tom, SEO, code snippets, formatação, engajamento.

## Quando usar
- Ao escrever posts técnicos longos.
- Ao estruturar narrativa e SEO do artigo.
- Ao revisar clareza e engajamento do conteúdo.

Padrões e práticas para escrita de posts técnicos de blog.

## Estrutura de Post

### Template Básico

```markdown
---
title: Título Atrativo e Descritivo
description: Meta description com 150-160 caracteres que resume o post
date: 2025-01-08
tags: [tag1, tag2, tag3]
author: Nome do Autor
image: /images/og-image.png
---

# Título do Post

[Parágrafo de abertura - hook que prende atenção]

## O que você vai aprender

- Ponto 1
- Ponto 2
- Ponto 3

## Contexto / Problema

[Descrever o problema que o post resolve]

## Solução

[Conteúdo principal]

### Subtópico 1

[Explicação + código]

### Subtópico 2

[Explicação + código]

## Conclusão

[Resumo dos pontos principais]

## Próximos passos

- [Sugestão 1]
- [Sugestão 2]

## Referências

- [Link 1](url)
- [Link 2](url)
```

---

## Títulos Efetivos

### Fórmulas que Funcionam

| Tipo | Exemplo |
|------|---------|
| How-to | Como criar componentes reutilizáveis em SolidJS |
| Lista | 5 padrões de TypeScript que todo dev deveria conhecer |
| Comparação | React vs Solid: Quando usar cada um |
| Guia | Guia completo de testes com Vitest |
| Erro comum | O erro que 90% dos devs cometem com async/await |
| Deep dive | Entendendo o sistema de reatividade do Solid |

### Checklist de Título

- [ ] Descreve claramente o conteúdo
- [ ] Tem entre 50-60 caracteres
- [ ] Inclui palavra-chave principal
- [ ] Gera curiosidade ou promete valor
- [ ] Não é clickbait

---

## Abertura (Hook)

### Técnicas de Hook

**Problema/Dor:**
```markdown
Você já passou horas debugando um re-render desnecessário?
Eu também. Até descobrir esse padrão.
```

**Estatística:**
```markdown
70% dos bugs em produção são relacionados a gerenciamento de estado.
Neste post, vamos ver como evitar os mais comuns.
```

**História:**
```markdown
Na semana passada, um bug em produção me custou 3 horas.
A causa? Uma dependência circular que eu não sabia que existia.
```

**Pergunta:**
```markdown
O que torna um componente realmente reutilizável?
Não é só aceitar props. Vamos explorar.
```

---

## Code Snippets

### Boas Práticas

```tsx
// ✅ Mostrar o antes e depois
// Antes (problema)
const UserCard = () => {
  const [user, setUser] = useState(null)
  // ... muito código
}

// Depois (solução)
const UserCard = (props: { user: User }) => {
  return <Card>{props.user.name}</Card>
}
```

```tsx
// ✅ Comentários explicativos em pontos-chave
const createDebounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timeoutId: number

  return (...args: T) => {
    // Cancela execução anterior
    clearTimeout(timeoutId)

    // Agenda nova execução
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
```

```tsx
// ✅ Código completo e funcional
// O leitor deve poder copiar e usar
import { createSignal, onCleanup } from 'solid-js'

export const useDebounce = <T>(value: () => T, delay: number) => {
  const [debounced, setDebounced] = createSignal(value())

  const timeout = setTimeout(() => setDebounced(value), delay)
  onCleanup(() => clearTimeout(timeout))

  return debounced
}
```

### Evitar

- ❌ Código incompleto sem contexto
- ❌ Snippets muito longos (> 30 linhas)
- ❌ Código sem explicação
- ❌ Variáveis genéricas (a, b, x, temp)

---

## Formatação

### Escaneabilidade

```markdown
## Use headers para organizar

Parágrafos curtos. Máximo 3-4 linhas.

**Negrito para pontos importantes.**

- Listas para enumerar
- Itens relacionados
- Facilitam a leitura

> Citações para destacar insights

| Tabelas | Para |
|---------|------|
| Comparar | Dados |
```

### Tamanho Ideal

| Elemento | Recomendação |
|----------|--------------|
| Parágrafos | 2-4 linhas |
| Seções | 200-400 palavras |
| Post total | 1000-2500 palavras |
| Code blocks | 5-25 linhas |

---

## Tom e Voz

### Características

- **Conversacional**: Como explicar para um colega
- **Direto**: Sem rodeios, vá ao ponto
- **Didático**: Explique o "porquê", não só o "como"
- **Humilde**: Admita limitações, não seja arrogante

### Exemplos

```markdown
❌ "É óbvio que você deve usar TypeScript"
✅ "TypeScript ajuda a pegar erros cedo - veja como"

❌ "Todo mundo sabe que..."
✅ "Um padrão comum é..."

❌ "Simplesmente faça X"
✅ "Uma abordagem é fazer X. Funciona bem quando..."
```

---

## SEO para Posts

### On-page

- [ ] Palavra-chave no título
- [ ] Palavra-chave na URL (slug)
- [ ] Palavra-chave no primeiro parágrafo
- [ ] Meta description atrativa
- [ ] Headers com palavras relacionadas
- [ ] Alt text em imagens

### Estrutura

```markdown
# H1 - Título principal (apenas 1)

## H2 - Seções principais

### H3 - Subseções

#### H4 - Detalhes (usar com moderação)
```

### URLs

```
✅ /blog/como-criar-componentes-solidjs
❌ /blog/post-123
❌ /blog/meu-novo-post-sobre-componentes-em-solidjs-2025
```

---

## Call to Action

### Tipos de CTA

**Engajamento:**
```markdown
Tem alguma dúvida? Deixe nos comentários!
```

**Compartilhamento:**
```markdown
Achou útil? Compartilhe com outros devs.
```

**Continuidade:**
```markdown
Quer aprofundar? Veja também:
- [Post relacionado 1](/blog/post-1)
- [Post relacionado 2](/blog/post-2)
```

**Newsletter:**
```markdown
Receba posts como este no seu email.
[Assinar newsletter]
```

---

## Checklist de Publicação

### Antes de Publicar

- [ ] Título atrativo e descritivo
- [ ] Meta description escrita
- [ ] Tags relevantes adicionadas
- [ ] Código testado e funcional
- [ ] Links funcionando
- [ ] Imagens com alt text
- [ ] Revisão de gramática
- [ ] Leitura em voz alta (flui bem?)

### SEO

- [ ] URL amigável
- [ ] Open Graph image
- [ ] Palavra-chave no título e descrição
- [ ] Headers organizados (H1 → H2 → H3)

### Qualidade

- [ ] Resolve um problema real
- [ ] Código pode ser copiado e usado
- [ ] Explicações claras
- [ ] Sem jargão desnecessário
- [ ] Conclusão com valor

---

## Processo de Escrita

### 1. Pesquisa (30%)

- Entender o tema profundamente
- Ver o que já existe sobre o assunto
- Identificar o ângulo único

### 2. Outline (10%)

- Estruturar os pontos principais
- Ordenar logicamente
- Identificar exemplos de código

### 3. Rascunho (30%)

- Escrever sem editar
- Focar em colocar as ideias
- Não se preocupar com perfeição

### 4. Revisão (20%)

- Cortar o desnecessário
- Clarificar pontos confusos
- Verificar código

### 5. Polimento (10%)

- Gramática e ortografia
- Formatação
- Meta dados
