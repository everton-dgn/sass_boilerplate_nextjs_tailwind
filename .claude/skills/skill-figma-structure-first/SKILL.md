---
name: skill-figma-structure-first
description: |
  Use este skill quando o usuário pedir para "implementar estrutura primeiro",
  "skeleton antes de estilos", "abordagem structure-first", ou ao implementar
  designs Figma seguindo a metodologia de 3 fases: mapeamento, skeleton, styled.
  Cobre implementação Figma em 3 fases - mapeamento, skeleton, styled.
model: opus
---

# Figma Structure-First

## Conceito

```
FASE 0: MAPEAMENTO   → Identificar componentes existentes
FASE 1: SKELETON     → Wireframe com estrutura correta
FASE 2: STYLED       → Aplicar estilos e tokens
```

**Por quê**: Corrigir estrutura após estilizar = retrabalho.

---

## Fase 0: Mapeamento

### 1. Verificar Figma

- [ ] Auto Layout usado (traduz para Flexbox)
- [ ] Naming descritivo (não "Frame 123")
- [ ] Componentes para elementos repetidos

### 2. Buscar componentes existentes

```bash
ls src/components/atoms/
ls src/components/molecules/
ls src/components/organisms/
```

### 3. Criar mapa

```
┌────────────────────┬──────────────────────────────┐
│ Elemento Figma     │ Componente Existente         │
├────────────────────┼──────────────────────────────┤
│ Primary Button     │ Button variant="primary"     │
│ Card               │ (criar novo)                 │
└────────────────────┴──────────────────────────────┘
```

---

## Fase 1: Skeleton

### O que é

- ✅ HTML semântico
- ✅ Layout (flex/grid)
- ✅ Ordem e quantidade correta
- ❌ SEM cores finais
- ❌ SEM tipografia final
- ❌ SEM imagens reais

### Implementar

```tsx
<main data-skeleton>
  <section data-skeleton-label="HERO">
    <h1>[TITLE:Headline]</h1>
    <button>[BTN:Começar]</button>
  </section>
</main>
```

Ver CSS completo: `reference/skeleton-css.md`

### Validar

**Estrutura:**
- [ ] Ordem das seções
- [ ] Hierarquia HTML (h1 > h2 > h3)
- [ ] Quantidade de elementos
- [ ] Layout geral (flex/grid)

**Semântica:**
- [ ] `<section>` com heading
- [ ] `<button>` para ações
- [ ] `<a>` com href para navegação

**Responsividade:**
- [ ] Desktop (1920x1080)
- [ ] Mobile (390x844)

**Se TODOS OK** → Fase 2
**Se FALHAR** → Corrigir antes

---

## Fase 2: Styled

### Transição

```tsx
// ANTES (skeleton)
<main data-skeleton>
  <h1>[TITLE:Headline]</h1>
</main>

// DEPOIS (styled)
<main>
  <h1 className="text-5xl-bold">Headline Real</h1>
</main>
```

### Passos

1. Remover `data-skeleton`
2. Aplicar tokens (`var(--color-*)`)
3. Aplicar classes (`text-*`)
4. Substituir placeholders
5. Importar componentes mapeados

### Validar

Usar `skill-figma-visual-loop`:
- [ ] Screenshot Figma vs Browser
- [ ] Análise qualitativa
- [ ] Tokens corretos

---

## Responsividade

### Quando Figma só tem Desktop

| Desktop | Mobile |
|---------|--------|
| Grid 3-4 cols | 1-2 cols ou stack |
| Imagem lateral | Imagem acima |
| Nav horizontal | Menu hamburguer |

### CSS Preferido

```css
/* Fluid Typography */
font-size: clamp(2rem, 5vw + 1rem, 4rem);

/* Grid Auto-Fit */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

/* Container Queries */
@container (min-width: 400px) { ... }
```

Ver patterns: `reference/responsive-patterns.md`

---

## Quando Usar

**Usar Structure-First:**
- Páginas novas com múltiplas seções
- Layouts complexos
- Designs com muitos elementos

**Pular para Styled:**
- Componentes simples (botão, input)
- Estrutura óbvia
- Pequenas alterações

---

## Referências

- `reference/skeleton-css.md` - CSS e placeholders
- `reference/responsive-patterns.md` - Patterns CSS responsivo
- `skill-figma-visual-loop` - Validação final
