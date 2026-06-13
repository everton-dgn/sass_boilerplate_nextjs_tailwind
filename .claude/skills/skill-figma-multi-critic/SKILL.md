---
name: skill-figma-multi-critic
description: |
  Use este skill quando o usuário pedir para "analisar design criticamente",
  "múltiplas perspectivas no design", "validar design antes de implementar",
  ou antes de iniciar implementação Figma-to-code para análise crítica.
  3 perspectivas independentes analisam o design antes de implementar.
model: opus
---

# Multi-Critic: 3 Perspectivas Independentes

## Quando Usar

**Trigger:** Início de qualquer implementação Figma-to-code
**Antes de:** Constraint Inference, Structure-First, qualquer código

## Inputs Necessários

1. URL do Figma ou node ID
2. Screenshot do design (via `get_screenshot`)
3. Design context (via `get_design_context`)
4. Tokens do projeto (arquivos em `src/theme/`)
5. Componentes existentes (inventário de `src/components/`)

---

## Os 3 Critics

### Critic 1: Token Police

**Foco:** Consistência técnica com design system

```yaml
Verifica:
  Cores:
    - Todas existem no theme?
    - Nomenclatura correta (primary, secondary)?
  Radius:
    - Valores existem como tokens?
    - Padrão consistente?
  Shadows:
    - Box-shadows existem no theme?
  Typography:
    - Fontes existem no projeto?
    - Tamanhos mapeiam para classes text-*?
  Z-index:
    - Camadas fazem sentido?

Output:
  status: APROVADO | REPROVADO
  score: 0-100
  violacoes: [lista]
  gaps_identificados: [lista]
```

---

### Critic 2: UX Advocate

**Foco:** Experiência do usuário e qualidade visual

```yaml
Verifica:
  Hierarquia Visual:
    - Qual elemento mais proeminente?
    - CTAs claramente identificáveis?
  Fluxo de Leitura:
    - Padrão F, Z ou linear?
    - Ordem faz sentido?
  Affordances:
    - Botões parecem clicáveis?
    - Links distinguíveis?
  Consistência:
    - Alinha com outras telas?
  Acessibilidade Básica:
    - Contraste adequado?
    - Texto legível?

Output:
  status: APROVADO | REPROVADO
  score: 0-100
  problemas: [lista]
  observacoes: [lista]
```

---

### Critic 3: Code Feasibility

**Foco:** Implementabilidade técnica

```yaml
Verifica:
  Componentes:
    - Quais existentes podem ser usados?
    - Quais precisam ser criados?
    - Quais precisam de extensão?
  Animacoes:
    - Viáveis com CSS/JS?
    - Precisam de biblioteca externa?
  Responsividade:
    - Design mostra variantes mobile?
    - Breakpoints claros?
  Complexidade:
    - Estimativa de esforço

Output:
  status: APROVADO | REPROVADO
  score: 0-100
  componentes:
    reutilizar: [lista]
    criar: [lista]
    estender: [lista]
  animacoes: [lista]
  estimativa_esforco: baixo | medio | alto
```

---

## Síntese Final

```yaml
Design Health Score: (média ponderada)
  Token Police:      peso 0.40
  UX Advocate:       peso 0.35
  Code Feasibility:  peso 0.25

Regra de Decisão:
  3/3 APROVADO → Avança para Constraint Inference
  2/3 APROVADO → Mostra divergência, usuário decide
  1/3 APROVADO → PARA. Resolve problemas críticos
  0/3 APROVADO → PARA. Design precisa revisão
```

---

## Checkpoint 1: Apresentação

```
🛑 CHECKPOINT 1: Análise do Design

═══════════════════════════════════════════════════════════════
DESIGN HEALTH SCORE: XX/100
═══════════════════════════════════════════════════════════════

Token Police: ✅ APROVADO (XX/100)
├── N cores analisadas
├── N mapeadas para tokens ✅
├── N gaps identificados
└── Radius e shadows: status

UX Advocate: ✅ APROVADO (XX/100)
├── Hierarquia visual: status
├── Affordances: status
├── Consistência: status
└── Observação: [se houver]

Code Feasibility: ⚠️ APROVADO com ressalvas (XX/100)
├── Componentes a reutilizar: [lista]
├── Componentes a criar: [lista]
├── Animação complexa: [status]
└── Estimativa: [esforço]

═══════════════════════════════════════════════════════════════

Gaps identificados para registro:
1. [gap 1]
2. [gap 2]
3. [gap 3]

═══════════════════════════════════════════════════════════════

Posso prosseguir para a fase de implementação?

[Sim, prosseguir] [Ajustar antes] [Ver detalhes de X]
```

---

## Integração com Próximas Etapas

```
Multi-Critic
    ↓ (se aprovado)
    ↓ Passa: gaps, componentes a usar/criar
    ↓
Constraint Inference
    ↓ (usa gaps de tokens)
    ↓
Skeleton Phase
    ↓ (usa componentes identificados)
```

---

## Execução

```yaml
Passo 1 - Coletar inputs:
  - get_screenshot(fileKey, nodeId)
  - get_design_context(fileKey, nodeId)
  - Ler src/theme/ para tokens
  - Listar src/components/ para inventário

Passo 2 - Executar critics (pode ser em paralelo):
  - Token Police analisa
  - UX Advocate analisa
  - Code Feasibility analisa

Passo 3 - Sintetizar:
  - Calcular score ponderado
  - Consolidar gaps
  - Determinar decisão (3/3, 2/3, etc)

Passo 4 - Checkpoint:
  - Apresentar resumo ao usuário
  - Aguardar aprovação explícita
  - NÃO avançar sem confirmação
```
