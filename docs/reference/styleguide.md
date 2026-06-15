# Guia de estilo

Guia visual base do projeto. Todas as decisões de estilo usam Tailwind CSS v4
com tokens semânticos do shadcn/ui e propriedades CSS customizadas.

---

## Cores

Paleta shadcn/ui com modo escuro via `next-themes`. Tokens definidos como
variáveis CSS em `src/theme/globals.css`.

| Uso | Token Tailwind |
|-----|---------------|
| Plano de fundo (body) | `bg-background` |
| Superfície padrão | `bg-card` |
| Ao passar o mouse | `hover:bg-accent` |
| Borda | `border` (`border-border`) |
| Texto primário | `text-foreground` |
| Texto secundário | `text-muted-foreground` |
| Destrutivo | `text-destructive` |

---

## Tipografia

- **Família tipográfica**: Geist Sans (`var(--font-geist-sans)`)
- **Monoespaçada**: Geist Mono (`var(--font-geist-mono)`)
- **Escala Tailwind**: `text-xs`=12px, `text-sm`=14px, `text-base`=16px,
  `text-lg`=18px, `text-xl`=20px
- **Tamanho de fonte mínimo**: `text-xs` (12px) — nenhuma exceção
- **Títulos**: `tracking-tight` (`-0.025em`), `font-bold` (700)

---

## Raio da borda

| Contexto | Classe Tailwind | Exemplo |
|----------|----------------|---------|
| Padrão | `rounded-md` (8px) | Button, Card, Input |
| Formato pílula | `rounded-full` | Badge |

---

## Espaçamento

Usar exclusivamente classes Tailwind (`gap-1`, `p-2`, `m-4`, etc.). Zero
valores fixos no código.

---

## Acessibilidade

### Contraste (WCAG 2.1 AA)

| Tipo | Proporção mínima |
|------|-----------------|
| Texto normal | 4.5:1 |
| Texto grande (≥18px ou bold ≥14px) | 3:1 |
| Elementos UI (bordas, ícones) | 3:1 |

### Tamanho de fonte

Mínimo absoluto: `text-xs` (12px). Nenhum texto no app pode ser menor que isso.

---

## Componentes

### Card (shadcn)

- Classes: `rounded-lg border bg-card text-card-foreground shadow-sm`
- Usa `<Card>`, `<CardHeader>`, `<CardContent>` do shadcn

### Badge (shadcn)

- `rounded-full` (pílula)
- Variantes: `default`, `secondary`, `outline`, `destructive`

### Button (shadcn)

- Variantes TV: `default`, `destructive`, `outline`, `secondary`, `ghost`,
  `link`
- Tamanhos: `default`, `sm`, `lg`, `icon`

---

## CSS customizado (`globals.css`)

Ao adicionar CSS não-utilitário em `src/theme/globals.css`, **SEMPRE** usar
`@layer base { ... }`. O Lightning CSS (engine do Tailwind v4) remove
propriedades que não reconhece quando estão fora de `@layer`.

```css
/* Errado — será removido pelo Lightning CSS */
html {
  scrollbar-gutter: stable;
}

/* Correto — preservado na compilação */
@layer base {
  html {
    scrollbar-gutter: stable;
  }
}
```

Propriedades afetadas incluem: `scrollbar-gutter`, `overscroll-behavior`,
seletores com atributos `[data-*]`, e qualquer CSS que não seja tokens
(`@theme`) ou variáveis (`:root`).

---

## Interatividade

### Ponteiro do cursor

- Elementos clicáveis que não são `<button>` ou `<a>` devem ter `cursor-pointer`
- Exemplo: `<label>` clicável associado a checkbox
