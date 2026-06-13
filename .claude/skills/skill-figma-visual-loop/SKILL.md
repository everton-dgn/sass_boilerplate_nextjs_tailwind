---
name: skill-figma-visual-loop
description: |
  Use este skill quando o usuário pedir para "validar visualmente", "comparar com Figma",
  "loop de validação visual", ou ao finalizar implementação Figma-to-code
  para validar que a implementação corresponde ao design. Máximo 10 iterações.
model: opus
---

# Validação Visual Figma-to-Code

## OBRIGATÓRIO

**Este workflow é OBRIGATÓRIO para toda implementação Figma-to-code.**

- [ ] Screenshot do Figma capturado
- [ ] Screenshot do browser capturado
- [ ] Análise qualitativa documentada
- [ ] Veredicto: PASS ou justificativa
- [ ] Usuário confirmou aprovação

**NUNCA finalizar sem validação visual.**

---

## Ferramentas Disponíveis (JÁ CONFIGURADAS)

| Ferramenta | Uso | Retorno |
|------------|-----|---------|
| `mcp__figma__get_screenshot` | Screenshot do Figma | Inline |
| `mcp__figma__get_metadata` | Estrutura XML da página | Texto |
| `mcp__playwright__browser_navigate` | Navegar para URL | - |
| `mcp__playwright__browser_snapshot` | Obter refs dos elementos | Texto |
| `mcp__playwright__browser_take_screenshot` | Screenshot do browser | **Arquivo** |
| `mcp__claude-in-chrome__computer` | Screenshot do browser | Inline |

**NÃO instalar Playwright ou configurar Figma API - já tem MCP.**

Ver detalhes: `reference/tools.md`

---

## Workflow

### Fase 0: Preparação

1. `pnpm dev` rodando
2. Obter URL do Figma: `figma.com/design/{fileKey}?node-id={nodeId}`
3. Se não tiver URL: **solicitar ao usuário**

### Fase 0.5: Mapa Estrutural (se página inteira)

**OBRIGATÓRIO quando URL aponta para página com múltiplas seções.**

```
mcp__figma__get_metadata(fileKey, pageNodeId)
```

Extrair IDs das seções para validar por componente:

| ID | Nome | Y | Altura |
|----|------|---|--------|
| 123:456 | Hero | 0 | 914 |
| 123:789 | Benefits | 914 | 600 |

Usar esses IDs para screenshots e validação por seção.

**Ver `skill-figma-extract` para workflow completo.**

### Fase 1: Captura Figma

```
mcp__figma__get_screenshot(
  fileKey="xxx",
  nodeId="123:456"  # trocar - por :
)
```

### Fase 2: Captura Browser

```
mcp__playwright__browser_navigate(url="http://localhost:3000/...")
mcp__playwright__browser_snapshot()  # obter ref
mcp__playwright__browser_take_screenshot(
  ref="e117",
  element="Section name",
  filename=".claude/images/browser.png"
)
# Arquivo em: .playwright-mcp/.claude/images/browser.png
```

---

## Captura por Componente (AVANÇADO)

Para comparar componentes específicos ao invés de páginas inteiras:

### 1. Obter Estrutura do Figma

```
mcp__figma__get_design_context(
  fileKey="abc123",
  nodeId="123:456"
)
```

Analisar output para identificar componentes e seus nodeIds.

### 2. Capturar Componente no Figma

```
mcp__figma__get_screenshot(
  fileKey="abc123",
  nodeId="789:012"  # nodeId do componente específico
)
```

Salvar o base64 retornado em arquivo.

### 3. Encontrar Elemento no Browser

```
mcp__playwright__browser_snapshot()
```

Procurar no snapshot o ref do elemento correspondente.
Identificar por classe CSS ou data-testid.

### 4. Capturar Elemento no Browser

```
mcp__playwright__browser_take_screenshot(
  ref="e117",
  element="Benefits Section",
  filename=".claude/images/benefits_browser.png"
)
```

### 5. Comparar (automático)

```bash
python visual_compare.py figma_benefits.png browser_benefits.png
```

Todas as métricas rodam automaticamente. Output mostra ações específicas para corrigir.

### Fase 3: Análise Qualitativa (Claude Vision)

Comparar AMBOS screenshots:

```
=== ANÁLISE QUALITATIVA ===

ESTRUTURA:
- [ ] Ordem das seções: OK/DIFERENTE
- [ ] Seções faltando: NÃO/SIM

CONTEÚDO POR SEÇÃO:
1. [Nome da seção]
   - Título: OK/DIFERENTE
   - Subtítulo: OK/DIFERENTE
   - Botões: OK (N/N)
   - Imagens: OK/FALTANDO

VEREDICTO: PASS/REVIEW (N problemas)
```

### Fase 4: Análise Quantitativa

**Usar o script `visual_compare.py` que automatiza tudo:**

```bash
VENV=.claude/skills/skill-figma-visual-loop/scripts/.venv
SCRIPT=.claude/skills/skill-figma-visual-loop/scripts/visual_compare.py

$VENV/bin/python3 $SCRIPT figma.png browser.png --preset normal
```

#### Zero Configuração (AUTOMÁTICO)

O script roda automaticamente sem flags:

| Feature | O que faz |
|---------|-----------|
| **Blur** | Aplica blur leve (σ=0.5) para tolerar antialiasing |
| **Alinhamento** | Ajusta imagens de proporções diferentes |
| **Redimensionamento** | Normaliza para max 4096px |
| **Regiões dinâmicas** | Ignora timestamps, IDs, datas automaticamente |
| **Métricas em camadas** | Analisa estrutura, cor, texto e espaçamento |

#### Métricas MAIN (influenciam veredicto)

| Métrica | O que mede | Se falhar |
|---------|------------|-----------|
| `layout_similarity` | Estrutura/bordas | Verificar flex/grid, containers |
| `regional_color_diff` | Cor por região 4x4 | Verificar tokens de cor na região (X,Y) |
| `text_similarity` | Conteúdo OCR | Palavras faltando/extras |
| `spacing_match` | Gaps entre elementos | Comparar gaps Figma vs Browser |
| `ssim` | Similaridade estrutural | Diferença geral de layout |
| `pixel_diff_pct` | % pixels diferentes | Renderização diferente |
| `delta_e_mean` | Diferença de cor CIE | Cores perceptualmente diferentes |

#### Output com Actions (acionável)

O resultado inclui `actions` com sugestões de correção:

```json
{
  "status": "REVIEW",
  "actions": [
    "Verificar tokens de cor nas regioes: (1,2), (2,3)",
    "Gaps Figma: [16, 24] vs Browser: [16, 20]"
  ],
  "failed_count": 2
}
```

**Presets disponíveis:**
- `strict` - Produção (SSIM ≥ 0.98)
- `normal` - Desenvolvimento (SSIM ≥ 0.95)
- `loose` - Protótipo (SSIM ≥ 0.90)

Ver métricas: `reference/metrics.md`

### Fase 5: Self-Refine (se REVIEW)

```
=== FEEDBACK ===

PROBLEMAS:
1. [Onde]: [O que está errado]
   [Instrução para corrigir]

PRIORIDADE:
1. [Problema mais crítico]
```

**Após corrigir → voltar à Fase 1 (nova captura)**

### Fase 6: Validação de Código

```bash
pnpm lint && pnpm typecheck && pnpm test
```

- [ ] Usa tokens CSS (`var(--color-*)`)
- [ ] Tipografia com classes (`text-*`)
- [ ] Sem valores hardcoded

### Fase 7: Finalização

1. Perguntar: "Há mais diferenças que identifica?"
2. Se aprovado:
   ```
   === RESULTADO FINAL ===
   Status: APROVADO
   Iterações: N
   ```

---

## Critérios de Parada

| Condição | Ação |
|----------|------|
| APROVADO + confirmação | ✅ Finalizar |
| 10 iterações | ⚠️ Escalar |
| Mesmo problema 2x | ⚠️ Mudar abordagem |

---

## Referências

- `reference/tools.md` - Como usar MCPs e Python
- `reference/metrics.md` - Thresholds e interpretação
- `reference/troubleshooting.md` - Erros comuns e limitações
