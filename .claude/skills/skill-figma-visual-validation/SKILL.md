---
name: skill-figma-visual-validation
description: |
  Use este skill quando o usuário pedir para "validar implementação contra Figma",
  "comparar com design", "verificar fidelidade visual", ou mencionar
  validação visual, tolerâncias de implementação ou métricas de fidelidade.
  Valida implementação contra design do Figma com métricas e tolerâncias.
model: opus
---

# Validação Visual Figma

## Objetivo

Validar que a implementação corresponde ao design do Figma dentro de tolerâncias aceitáveis.

## Quando usar

- Após implementar um design do Figma
- Ao revisar fidelidade da implementação
- Antes de marcar uma tarefa Figma-to-code como concluída

## Tolerâncias

| Aspecto | Tolerância |
|---------|------------|
| Posição/espaçamento | +/- 2px |
| Tamanho de fonte | Exato |
| Cores | Exato (via tokens) |
| Radius | Exato (via tokens) |

## Checklist de Validação

### Layout & Estrutura

- [ ] Estrutura DOM corresponde à hierarquia do Figma
- [ ] Layout flex/grid corresponde ao Auto Layout
- [ ] Elementos na ordem correta
- [ ] Profundidade de aninhamento corresponde ao design

### Espaçamento

- [ ] Padding corresponde ao Figma (dentro de 2px)
- [ ] Margin corresponde ao Figma (dentro de 2px)
- [ ] Gap entre elementos corresponde (dentro de 2px)
- [ ] Valores alinhados à escala de espaçamento (4/8/12/16/24/32/48/64)

### Cores

- [ ] Cores de fundo usam tokens corretos
- [ ] Cores de texto usam tokens corretos
- [ ] Cores de borda usam tokens corretos
- [ ] Cores de ícones usam tokens corretos
- [ ] Nenhum valor hex hardcoded

### Tipografia

- [ ] Tamanho de fonte corresponde (usando classes text-*)
- [ ] Peso de fonte corresponde (usando classes text-*)
- [ ] Line height apropriado
- [ ] Alinhamento de texto correto

### Bordas & Sombras

- [ ] Border radius usa tokens corretos
- [ ] Largura de borda corresponde
- [ ] Sombra usa tokens corretos
- [ ] Sombra aplicada nos elementos corretos

### Estados

- [ ] Estado hover implementado
- [ ] Estado focus com outline visível
- [ ] Estado disabled com opacidade reduzida
- [ ] Estado active/pressed se aplicável
- [ ] Estado loading se aplicável

### Responsividade

- [ ] Layout mobile (< 768px) correto
- [ ] Layout tablet (768px - 1023px) correto
- [ ] Layout desktop (>= 1024px) correto
- [ ] Transições de breakpoint suaves

### Acessibilidade

- [ ] Focus visível em todos elementos interativos
- [ ] Aria labels onde necessário
- [ ] Elementos HTML semânticos usados
- [ ] Contraste de cor suficiente (4.5:1 mínimo)

## Anti-patterns (Erros Comuns)

**NUNCA fazer:**

1. **Declarar "aprovado" após verificar apenas uma coisa**
   - Verificou ícone? Ainda falta: ordem, conteúdo, espaçamentos, larguras, cores

2. **Focar só no que alterou e ignorar o resto**
   - Alterou um componente? Verificar a página inteira

3. **Assumir que estrutura está correta sem comparar**
   - Ordem das seções pode estar errada
   - Seções podem estar duplicadas
   - Conteúdo pode estar diferente

4. **Pular verificação de detalhes "pequenos"**
   - Largura de títulos (quebra de linha)
   - Gaps entre seções
   - Número de botões
   - Lista de itens

**SEMPRE fazer antes de declarar aprovado:**

1. Comparar ordem das seções na página vs Figma
2. Verificar se há seções duplicadas ou faltando
3. Comparar todo conteúdo: títulos, subtítulos, listas, botões
4. Verificar larguras (max-width) de elementos de texto
5. Verificar espaçamentos verticais entre seções
6. Perguntar ao usuário se há mais diferenças

## Critérios de Aceitação

| Resultado | Condição | Ação |
|-----------|----------|------|
| Aprovado | Todos itens do checklist OK | Marcar como concluído |
| Ajuste | 1-3 itens pendentes | Correção rápida e revalidar |
| Reprovar | >3 itens ou diferenças significativas | Revisar implementação |

## Métricas Determinísticas

### Fidelidade Visual

| Métrica | Fórmula | Threshold |
|---------|---------|-----------|
| PixelDiffRate | pixels_diferentes / pixels_totais | <= 0.5% |
| SSIMScore | Similaridade estrutural (0-1) | >= 0.98 |
| Layout IoU | intersection / union (bounding boxes) | >= 0.95 |
| Color Delta E | Diferença perceptual CIELAB | <= 2.0 |

### Qualidade de Código

| Métrica | Ferramenta | Threshold |
|---------|------------|-----------|
| TokenMatchRate | % estilos usando tokens | >= 95% |
| ComponentReuseRate | % mapeados para componentes existentes | >= 90% |
| TypographyMatchRate | % textos com estilo exato | 100% |
| SpacingMatchRate | % gaps/paddings dentro tolerância | >= 98% |

## Taxonomia de Erros

| Categoria | % Ocorrência | Exemplos |
|----------|--------------|----------|
| Estrutura/Layout | 27% | Posicionamento errado, hierarquia DOM incorreta |
| Ação/Interação | 43% | Eventos não implementados, navegação quebrada |
| Apresentação Visual | 14% | Cores erradas, tipografia incorreta |
| Reversibilidade | 11% | Estados não restauráveis |
| Feedback | 1% | Estados loading/erro não implementados |
| Mapeamento | - | Componente errado escolhido |

## Matriz de Severidade

| Severidade | Alta Freq | Média Freq | Baixa Freq |
|------------|-----------|------------|------------|
| Crítica (bloqueia uso) | P1 - Imediato | P1 - Imediato | P2 - Urgente |
| Alta (funciona mal) | P2 - Urgente | P3 - Planejado | P3 - Planejado |
| Média (inconveniente) | P3 - Planejado | P4 - Backlog | P4 - Backlog |
| Baixa (cosmético) | P4 - Backlog | P5 - Nice to have | P5 - Nice to have |

## Pipeline de Validação

```
FASE 1: Validação Estática (Pré-build)
├── TypeScript strict mode
├── Regras de lint
├── Validação de design tokens (tokens usados existem?)
└── Validação de imports (componentes importados existem?)

FASE 2: Validação Estrutural (Pós-build)
├── Diff de estrutura DOM (esperada vs gerada)
├── Check de computed styles CSS (valores aplicados corretos?)
├── Validação de props de componentes (props passadas válidas?)
└── Auditoria de acessibilidade (checks automatizados axe-core)

FASE 3: Validação Visual (Runtime)
├── Comparação de screenshot (manual ou automatizada)
├── Regressão de layout (posições/tamanhos)
└── Consistência cross-browser

FASE 4: Validação Funcional (E2E)
├── Testes de interação (clicks, inputs, navegação)
├── Gerenciamento de estado (estados corretos)
└── Responsividade (breakpoints funcionam)
```

## Comandos de Validação

```bash
# Validação obrigatória (ajustar conforme projeto)
pnpm lint        # ou npm run lint
pnpm typecheck   # ou npm run typecheck
pnpm test        # ou npm test

# Se lint falhar
pnpm format && pnpm lint
```

## Referência

- Ferramentas de comparação visual: pixelmatch, odiff, jest-image-snapshot
- Testes de acessibilidade: axe-core
- Testes E2E: Playwright, Cypress
