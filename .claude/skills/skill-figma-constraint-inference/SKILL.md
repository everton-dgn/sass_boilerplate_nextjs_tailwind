---
name: skill-figma-constraint-inference
description: |
  Use este skill quando o usuário pedir para "inferir tokens do design",
  "mapear cores automaticamente", "identificar tokens no Figma", ou precisar
  inferir automaticamente cores, radius, shadows e typography do design.
  NÃO infere spacing (usa pixels).
model: opus
---

# Constraint Inference: Inferência Automática de Tokens

## Quando Usar

**Trigger:** Após Multi-Critic ser aprovado (Checkpoint 1)
**Antes de:** Skeleton Phase

## O Que Infere

| Categoria | Infere? | Fonte no Projeto |
|-----------|---------|------------------|
| **Cores** | ✅ Sim | `src/theme/tokens/colors.css` |
| **Radius** | ✅ Sim | `src/theme/tokens/radius.css` |
| **Shadows** | ✅ Sim | `src/theme/tokens/shadows.css` |
| **Typography** | ✅ Sim | `src/theme/class/typography.css` |
| **Z-index** | ✅ Sim | `src/theme/tokens/z-index.css` |
| **Spacing** | ❌ Não | Usa pixels direto (4, 8, 12, 16, 24, 32, 48, 64) |

---

## Processo

### Fase 1: Extração de Padrões

```yaml
Objetivo: Identificar valores REPETIDOS no design

Passos:
  1. Usar get_variable_defs(fileKey, nodeId) para extrair:
     - Cores usadas
     - Radius usados
     - Shadows usados
     - Font sizes/weights

  2. Agrupar por categoria

  3. Identificar padrões:
     - Cor X aparece N vezes
     - Radius Y aparece em todos os cards
     - Shadow Z usado em elementos elevados
```

### Fase 2: Validação contra Theme

```yaml
Objetivo: Verificar compatibilidade com tokens existentes

Passos:
  1. Ler arquivos de tokens do projeto:
     - src/theme/tokens/colors.css
     - src/theme/tokens/radius.css
     - src/theme/tokens/shadows.css
     - src/theme/class/typography.css

  2. Para cada valor do Figma:
     - Buscar token correspondente
     - Calcular delta (se aproximado)
     - Marcar como: EXATO | APROXIMADO | NAO_EXISTE

  3. Calcular % de compatibilidade geral
```

### Fase 3: Decisão Inteligente

```yaml
Regras de Decisão:

Se EXATO (delta = 0):
  → Usar token diretamente
  → Confiança: 100%

Se APROXIMADO (delta pequeno):
  Radius: 1-2px → Arredondar para token mais próximo
  Cor: delta_e < 3 → Usar token mais próximo
  → Registrar como ajuste
  → Confiança: 85%

Se NAO_EXISTE:
  → Registrar como GAP
  → Sugerir alternativa ou novo token
  → Confiança: depende da alternativa
```

---

## Output: Mapa de Tokens

```yaml
token_map:
  cores:
    "#3B82F6":
      token: "var(--color-primary-500)"
      match: "exato"
      confianca: 100%
    "#FF5733":
      token: "var(--color-warning-500)"
      match: "aproximado"
      delta_e: 2.1
      confianca: 85%
    "#ABC123":
      token: null
      match: "nao_existe"
      sugestao: "Adicionar ao theme ou usar var(--color-success-400)"
      confianca: 0%

  radius:
    "4px":
      token: "var(--radius-4)"
      match: "exato"
    "6px":
      token: "var(--radius-8)"
      match: "aproximado"
      ajuste: "+2px"
    "16px":
      token: "var(--radius-16)"
      match: "exato"

  shadows:
    "0 2px 4px rgba(0,0,0,0.1)":
      token: "var(--shadow-sm)"
      match: "exato"
    "0 4px 8px rgba(0,0,0,0.15)":
      token: "var(--shadow-md)"
      match: "aproximado"

  typography:
    "24px/32px Inter 600":
      token: "text-h2"
      match: "exato"
    "16px/24px Inter 400":
      token: "text-body-md"
      match: "exato"

compatibilidade_geral: 94%
gaps_identificados: 2
ajustes_necessarios: 3
```

---

## Confidence Gate

Durante a inferência, aplicar threshold de confiança:

```yaml
Para cada mapeamento:
  Se confiança >= 85%:
    → Usar automaticamente
    → Declarar: "Confiança: X% - [justificativa]"

  Se confiança 60-84%:
    → Consultar Codex CLI (Second Opinion):
      codex exec "Este mapeamento está correto?
        Figma: #FF5733
        Sugestão: var(--color-warning-500)
        Contexto: Usado em badges de alerta"
    → Se Codex concorda: usar
    → Se Codex discorda: mostrar ao usuário

  Se confiança < 60%:
    → PARAR e perguntar ao usuário
    → Mostrar opções de alternativas
```

---

## Integração com Próximas Etapas

```
Constraint Inference
    ↓ Output: token_map + gaps
    ↓
Skeleton Phase
    ↓ Usa: mapeamento de componentes
    ↓
Styled Phase
    ↓ USA token_map para aplicar estilos
    ↓ Cores → var(--color-*)
    ↓ Radius → var(--radius-*)
    ↓ Shadows → var(--shadow-*)
    ↓ Typography → classes text-*
    ↓ Spacing → pixels direto
```

---

## Execução

```yaml
Passo 1 - Extrair do Figma:
  get_variable_defs(fileKey, nodeId)

Passo 2 - Ler tokens do projeto:
  - fd -t f "*.css" src/theme/
  - Parse CSS variables

Passo 3 - Mapear cada valor:
  Para cada cor/radius/shadow/typography:
    - Buscar match exato
    - Se não encontrar: buscar aproximado
    - Se não encontrar: registrar gap

Passo 4 - Calcular confiança:
  - Aplicar Confidence Gate
  - Consultar Codex se necessário
  - Perguntar usuário se muito incerto

Passo 5 - Gerar token_map:
  - JSON estruturado
  - Usado pela Styled Phase
```

---

## Sugestão de Evolução do Design System

Se gap aparece 5+ vezes:

```yaml
Sugestão: "A cor #ABC123 aparece em 7 elementos.
Considerar adicionar como novo token:
  --color-accent-custom: #ABC123;"

Ação: Registrar no Gap Log para revisão com designer
```
