# Métricas - Visual Loop

## Arquitetura de Métricas

```
┌─────────────────────────────────────────────────────────────────┐
│                    DECISION: ANY-FAIL RULE                       │
├─────────────────────────────────────────────────────────────────┤
│  MAIN METRICS - Original (qualquer falha → REVIEW)               │
│  ├── SSIM        ≥ threshold  │  Similaridade estrutural        │
│  ├── pixel_diff  ≤ threshold  │  % pixels diferentes            │
│  └── delta_e     ≤ threshold  │  Diferença de cor (ΔE2000)      │
├─────────────────────────────────────────────────────────────────┤
│  MAIN METRICS - Layered (qualquer falha → REVIEW + actions)      │
│  ├── layout_similarity    ≥ 0.85  │  Estrutura (Canny edges)    │
│  ├── regional_color_diff  < 0.20  │  Cor por região 4x4         │
│  ├── text_similarity      > 0.90  │  Conteúdo OCR               │
│  └── spacing_match        > 0.70  │  Gaps entre elementos       │
├─────────────────────────────────────────────────────────────────┤
│  SECONDARY (informativas)                                        │
│  ├── MS-SSIM     │  Multi-scale SSIM                            │
│  └── PSNR        │  Relação sinal/ruído                         │
├─────────────────────────────────────────────────────────────────┤
│  HEURISTICS (triagem apenas)                                     │
│  └── pHash       │  Hash perceptual                             │
└─────────────────────────────────────────────────────────────────┘
```

## Métricas em Camadas (Layered)

**Cada métrica é MAIN e inclui `action_if_fail` com instrução de correção.**

| Métrica | Threshold | O que mede | Se falhar |
|---------|-----------|------------|-----------|
| `layout_similarity` | ≥ 0.85 | IoU de Canny edges | "Verificar CSS flex/grid, containers" |
| `regional_color_diff` | < 0.20 | Histograma HSV 4x4 | "Verificar tokens de cor na região (X,Y)" |
| `text_similarity` | > 0.90 | Sequência de texto OCR | "Palavras faltando: X; Extras: Y" |
| `spacing_match` | > 0.70 | Gaps entre componentes | "Gaps Figma: [16,24] vs Browser: [16,20]" |

### Layout Similarity

Usa Canny edge detection para comparar estrutura:
- IoU (Intersection over Union) das bordas detectadas
- Ignora cores e texturas, foca apenas em estrutura
- Threshold: 0.85

### Regional Color Diff

Divide imagem em grid 4x4 e compara histogramas HSV:
- Usa Bhattacharyya distance
- Retorna quais regiões (row, col) têm diferença
- Threshold: média < 0.20

### Text Similarity

Extrai texto via OCR (pytesseract) e compara:
- SequenceMatcher ratio entre textos normalizados
- Retorna palavras faltando/extras
- Threshold: > 0.90

### Spacing Match

Analisa gaps verticais entre componentes:
- Connected components para detectar elementos
- Compara conjunto de gaps com tolerância de 4px
- Threshold: > 0.70

## Thresholds por Preset

| Métrica | Strict | Normal | Loose |
|---------|--------|--------|-------|
| **SSIM** | ≥ 0.98 | ≥ 0.95 | ≥ 0.90 |
| **pixel_diff** | ≤ 0.5% | ≤ 2.0% | ≤ 5.0% |
| **delta_e** | ≤ 1.0 | ≤ 2.0 | ≤ 5.0 |

**Quando usar:**
- **strict**: Validação final, mesmo OS/browser
- **normal**: Desenvolvimento (padrão)
- **loose**: Cross-platform, fontes diferentes

## Interpretação

| Métrica | Valor | Significado |
|---------|-------|-------------|
| SSIM | 1.0 | Idêntico |
| SSIM | < 0.90 | Muito diferente |
| pixel_diff | 0% | Idêntico |
| pixel_diff | > 5% | Diferença significativa |
| delta_e | < 1 | Imperceptível |
| delta_e | 1-2 | Quase imperceptível |
| delta_e | > 5 | Perceptível |

## Análise Qualitativa (Claude Vision)

| Aspecto | Checklist | Peso |
|---------|-----------|------|
| **Estrutura** | Ordem das seções corresponde? | Crítico |
| **Conteúdo** | Títulos, textos corretos? | Crítico |
| **Hierarquia** | Níveis de heading corretos? | Alto |
| **Layout** | Flex/grid corresponde? | Alto |
| **Ícones** | Ícones corretos? | Médio |
| **Botões** | Quantidade e labels? | Médio |
| **Imagens** | Posição e presença? | Médio |

## Matriz de Decisão

| Quantitativo | Qualitativo | Veredicto |
|--------------|-------------|-----------|
| PASS | PASS | ✅ **APROVADO** |
| PASS | REVIEW | ⚠️ Revisão semântica |
| REVIEW | PASS | ⚠️ Revisão visual |
| REVIEW | REVIEW | ❌ **REPROVADO** |

**Desempate**: Análise qualitativa tem prioridade.
