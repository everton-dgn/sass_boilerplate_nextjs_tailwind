---
name: skill-a11y-checklist
description: |
  Use este skill quando o usuário pedir para "verificar acessibilidade", "checklist a11y",
  "WCAG", "acessível", "critérios de acessibilidade", ou mencionar
  verificação de acessibilidade, princípios POUR ou conformidade WCAG 2.1 AA.
  Cobre checklist rápido WCAG 2.1 AA, princípios POUR, critérios essenciais.
model: opus
---

# A11y Checklist

## Objetivo
Checklist rápido de acessibilidade WCAG 2.1 AA - princípios POUR, critérios essenciais, verificação.

## Quando usar
- Antes de QA/release de UI e fluxos críticos.
- Ao validar critérios WCAG 2.1 AA.
- Ao revisar páginas com alto impacto de acessibilidade.

## WCAG 2.1 AA - Princípios POUR

| Princípio | Significado | Exemplos |
|-----------|-------------|----------|
| **Perceptível** | Usuário pode perceber | Alt text, contraste |
| **Operável** | Usuário pode interagir | Teclado, tempo |
| **Compreensível** | Usuário pode entender | Linguagem clara |
| **Robusto** | Funciona com assistivas | HTML válido, ARIA |

## Critérios Essenciais

| Critério | Nome | Requisito |
|----------|------|-----------|
| 1.1.1 | Non-text Content | Alt text em imagens |
| 1.4.3 | Contrast | 4.5:1 texto, 3:1 grande |
| 2.1.1 | Keyboard | Tudo via teclado |
| 2.4.7 | Focus Visible | Indicador de foco |
| 3.3.2 | Labels | Labels em forms |
| 4.1.2 | Name, Role, Value | ARIA correto |

## Checklist Rápido

### Estrutura
- [ ] Headings hierárquicos (h1 → h2 → h3)
- [ ] Landmarks semânticos (header, nav, main, footer)
- [ ] Listas para grupos de itens

### Interação
- [ ] Tudo acessível via teclado
- [ ] Focus visível em todos estados
- [ ] Ordem de tab lógica
- [ ] Skip link para conteúdo principal

### Visual
- [ ] Contraste mínimo 4.5:1 (texto)
- [ ] Não depende só de cor
- [ ] Texto redimensionável até 200%
- [ ] Respeita prefers-reduced-motion

### Mídia
- [ ] Alt text em imagens informativas
- [ ] alt="" em imagens decorativas

### Forms
- [ ] Labels associados a inputs
- [ ] Erros identificados claramente
- [ ] Campos obrigatórios indicados

### ARIA
- [ ] Usar elementos nativos primeiro
- [ ] ARIA só quando necessário
- [ ] Live regions para conteúdo dinâmico

## Exemplos de Código

### Estrutura semântica correta

```html
<header>
  <nav aria-label="Principal">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main id="main-content">
  <h1>Título da página</h1>
  <article>
    <h2>Seção</h2>
    <p>Conteúdo...</p>
  </article>
</main>

<footer>
  <p>© 2025</p>
</footer>
```

### Skip link

```html
<a href="#main-content" class="skip-link">
  Pular para conteúdo principal
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #000;
  color: #fff;
}

.skip-link:focus {
  top: 0;
}
```

### Form acessível

```html
<form>
  <div>
    <label for="email">Email *</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-describedby="email-error"
    />
    <span id="email-error" role="alert">
      <!-- Erro aparece aqui -->
    </span>
  </div>
</form>
```

### Live region para notificações

```html
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <!-- Mensagens dinâmicas -->
</div>
```
