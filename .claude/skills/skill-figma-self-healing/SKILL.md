---
name: skill-figma-self-healing
description: |
  Use este skill quando o usuário pedir para "corrigir automaticamente diferenças",
  "self-healing", "ajustar implementação automaticamente", ou após a fase Styled
  para detectar e corrigir diferenças visuais automaticamente. Máximo 3 iterações.
model: opus
---

# Self-Healing: Detecção e Correção Automática

## Quando Usar

**Trigger:** Após Styled Phase ser aprovada (Checkpoint 3)
**Antes de:** QA Final
**Máximo:** 3 iterações

## Por Que Self-Healing?

```
ANTES (Visual Loop Manual):
  Compare → "Diferença no padding" → VOCÊ investiga
  → VOCÊ encontra problema → VOCÊ corrige → Repete 5-10x

DEPOIS (Self-Healing):
  Compare → Identifica REGIÃO → Mapeia para elemento DOM
  → Lê CSS → Identifica propriedade → CORRIGE automaticamente
  → Máximo 3 iterações
```

---

## Processo

### Nível 1: Diagnóstico Visual

```yaml
Passo 1.1 - Capturar screenshots:
  Figma: mcp__figma__get_screenshot(fileKey, nodeId)
  Browser: mcp__playwright__browser_take_screenshot() ou Claude in Chrome

Passo 1.2 - Comparar com Claude Vision:
  Foco:
    - Estrutura geral
    - Posicionamento de elementos
    - Cores e contrastes
    - Espaçamentos
    - Tipografia

Passo 1.3 - Identificar regiões com diferença:
  Output:
    regiao: [x, y, width, height]
    descricao: "Card do meio tem padding diferente"
    severidade: baixa | media | alta
```

### Nível 2: Análise de Causa Raiz

```yaml
Passo 2.1 - Mapear região → elemento DOM:
  regiao_identificada: [x: 100, y: 200]
  elemento_dom: article.card (segundo card)
  seletor_css: .Benefits_card__xyz:nth-child(2)

Passo 2.2 - Ler CSS computado:
  Via browser tools ou leitura do arquivo CSS
  computed_styles:
    padding: "24px"
    margin: "0"
    background-color: "rgb(255, 255, 255)"
    border-radius: "16px"

Passo 2.3 - Comparar com Figma:
  figma_values:
    padding: "32px"
    margin: "0"
    background-color: "#FFFFFF"
    border-radius: "16px"

  divergencias:
    - propriedade: "padding"
      implementado: "24px"
      esperado: "32px"
      diferenca: "8px"
```

### Nível 3: Auto-Correção

```yaml
Regras de Auto-Correção:

Se diferença < 10px ou < 10%:
  ação: CORRIGIR AUTOMATICAMENTE
  confiança: alta
  exemplo: padding 24px → 32px

Se diferença 10-20px ou 10-20%:
  ação: PEDIR CONFIRMAÇÃO
  confiança: média
  exemplo: "Corrigir padding de 24px para 40px?"

Se diferença > 20px ou > 20%:
  ação: ESCALAR PARA HUMANO
  confiança: baixa
  exemplo: "Diferença estrutural significativa"

Se diferença é ESTRUTURAL (ordem, quantidade):
  ação: NUNCA corrigir automaticamente
  exemplo: "Falta um card no design"
```

### Nível 4: Aprendizado

```yaml
Após cada correção:

Passo 4.1 - Registrar em lessons-learned:
  erro:
    tipo: "padding incorreto"
    causa: "valor copiado errado do Figma"
    correção: "24px → 32px"
    arquivo: "Benefits/styles.module.css"
    linha: 42

Passo 4.2 - Atualizar padrões:
  Se mesmo erro ocorrer 2x:
    → Adicionar verificação específica
    → Próxima vez: detectar antes de implementar
```

---

## Fluxo de Iteração

```
┌─────────────────────────────────────────────────────────────┐
│  ITERAÇÃO 1                                                 │
│                                                             │
│  1. Captura Figma + Browser                                │
│  2. Compara: N diferenças encontradas                      │
│  3. Diagnóstico de cada diferença                          │
│  4. Auto-correção (se < 10px)                              │
│  5. Re-compara...                                          │
└─────────────────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────┐
│  ITERAÇÃO 2                                                 │
│                                                             │
│  1. Captura novamente                                      │
│  2. Compara: menos diferenças                              │
│  3. Se diferenças restantes < threshold: APROVADO          │
│  4. Se ainda há diferenças: corrigir                       │
└─────────────────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────┐
│  ITERAÇÃO 3 (máximo)                                        │
│                                                             │
│  Se ainda não convergiu:                                   │
│  → PARAR                                                   │
│  → Mostrar diferenças restantes                            │
│  → Escalar para usuário                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Regras de Parada

```yaml
APROVAR quando:
  - Zero diferenças significativas
  - Apenas diferenças < threshold (imperceptíveis)
  - Usuário aprova estado atual

PARAR E ESCALAR quando:
  - 3 iterações atingidas sem convergência
  - Mesmo problema aparece 2x seguidas
  - Diferença estrutural detectada
  - Auto-correção falharia (> 20px/20%)

NUNCA:
  - Mais de 3 iterações
  - Ignorar diferenças significativas
  - Corrigir estrutura automaticamente
```

---

## Checkpoint 4: Apresentação

```
🛑 CHECKPOINT 4: Self-Healing Completado

═══════════════════════════════════════════════════════════════
RESUMO DO SELF-HEALING
═══════════════════════════════════════════════════════════════

Iterações: 2 de 3 máximo

═══════════════════════════════════════════════════════════════
CORREÇÕES AUTOMÁTICAS APLICADAS
═══════════════════════════════════════════════════════════════

1. ✅ Card padding
   Antes: 24px
   Depois: 32px
   Arquivo: Benefits/styles.module.css:45
   Motivo: Valor do Figma era 32px

2. ✅ Grid gap
   Antes: 20px
   Depois: 24px
   Arquivo: Benefits/styles.module.css:28
   Motivo: Alinhamento com escala de spacing

═══════════════════════════════════════════════════════════════
MANTIDO SEM ALTERAÇÃO (decisão consciente)
═══════════════════════════════════════════════════════════════

1. ℹ️ Cor do título
   Implementado: var(--color-text-primary)
   Figma: #1a1a1a (ligeiramente diferente)
   Motivo: Token do projeto > valor específico

═══════════════════════════════════════════════════════════════
IGNORADO (diferença imperceptível)
═══════════════════════════════════════════════════════════════

1. ℹ️ Shadow sutil
   Diferença: < threshold visual
   Ação: Não requer correção

═══════════════════════════════════════════════════════════════
SCREENSHOTS FINAIS
═══════════════════════════════════════════════════════════════

[Figma]              [Implementação]
[screenshot]         [screenshot]

═══════════════════════════════════════════════════════════════

Aceitar correções e prosseguir para QA final?

[Sim, aceitar] [Reverter correção X] [Ver diff completo]
```

---

## Troubleshooting

### Mesmo erro aparece 2x

```yaml
Diagnóstico:
  - Correção não foi aplicada corretamente
  - OU correção foi sobrescrita
  - OU arquivo errado foi editado

Ação:
  - PARAR
  - Mostrar histórico de edições
  - Verificar se arquivo está salvo
  - Pedir orientação ao usuário
```

### 3 iterações sem convergência

```yaml
Diagnóstico:
  - Diferenças são estruturais, não de estilo
  - OU valores do Figma estão inconsistentes
  - OU há conflito de CSS (especificidade)

Ação:
  - PARAR
  - Mostrar todas as diferenças restantes
  - Explicar o que foi tentado
  - Sugerir: "Pode ser necessário revisar o design"
```

### Diferença estrutural

```yaml
Diagnóstico:
  - Número de elementos diferente
  - Ordem dos elementos diferente
  - Hierarquia DOM diferente

Ação:
  - NUNCA corrigir automaticamente
  - Mostrar diferença ao usuário
  - Perguntar: "O skeleton foi aprovado com essa estrutura?"
  - Se sim: problema no design
  - Se não: voltar para Skeleton Phase
```

---

## Regression Check Integrado

Após CADA correção:

```yaml
1. Aplicar correção no CSS

2. Executar:
   - pnpm lint
   - pnpm typecheck

3. Se falhar:
   - REVERTER correção
   - Tentar abordagem diferente
   - Se falhar 2x: escalar para usuário

4. Se passar:
   - Re-capturar screenshot
   - Continuar para próxima diferença
```
