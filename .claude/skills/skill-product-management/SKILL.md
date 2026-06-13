---
name: skill-product-management
description: |
  Use este skill quando o usuário pedir para "criar PRD", "discovery de produto",
  "user stories", "priorizar backlog", "roadmap", "OKRs", ou mencionar
  gestão de produto, PRDs, métricas ou priorização.
  Use /skill-product-management para criar PRD completo com discovery iterativo.
argument-hint: "<feature-slug>"
model: opus
user-invocable: true
---

# Product Management

## Objetivo

Frameworks e templates para gestão de produto - PRDs, discovery, user stories, roadmap, priorização, OKRs e métricas.

## Quando usar

- Ao criar PRDs e conduzir discovery → `/skill-product-management`
- Ao priorizar roadmap e backlog
- Ao definir métricas, OKRs e sucesso

---

## Workflow Interativo

### /prd <feature-slug>

Crie um PRD (Product Requirements Document) para a feature: **$ARGUMENTS**

#### Formato dos argumentos

Use um slug sem espaços (ex: `sistema-comentarios`).

#### FASE 0: SELEÇÃO DE FORMATO (obrigatória)

**PRIMEIRA AÇÃO**: Pergunte qual formato de PRD o usuário deseja:

```
Pergunta: "Qual formato de PRD você quer gerar?"
Header: "Formato PRD"
Opções:
1. label: "Full (Recomendado)"
   description: "PRD completo com todas as seções. Use para features complexas."

2. label: "Lean (One-pager)"
   description: "Documento simplificado de 1 página. Use para features pequenas."

3. label: "Pitch (Shape Up)"
   description: "Formato da Basecamp: problem, appetite, solution, rabbit holes, no-gos."
```

#### FASE 1: PRE-FLIGHT

1. **Contexto existente**: "Já existe algum documento, decisão ou workaround que precisamos respeitar?"
2. **Restrições legais/compliance**: "Existe alguma exigência legal/compliance (ex: LGPD) que afete essa feature?"

#### FASE 2: CONTEXTO

3. **Problema**: "Qual problema do usuário estamos resolvendo? Me conte sobre a última vez que esse problema aconteceu."
4. **Status Quo**: "Como o usuário resolve isso hoje? O que é frustrante nessa solução atual?"
5. **Urgência**: "Por que resolver isso agora? O que muda se não fizermos?"
6. **Usuários**: "Quem são os usuários afetados? Quantos aproximadamente?"

#### FASE 3: HIPÓTESES E MÉTRICAS

7. **Sucesso**: "Se resolvermos esse problema, qual será o indicador de sucesso?"
8. **Baseline**: "Qual é o valor atual (com período e unidade) e qual seria um bom resultado?"
9. **Evidências**: "Temos alguma evidência de que isso é um problema real?"

#### FASE 4: ESCOPO E LIMITES

10. **MVP**: "Qual é o mínimo viável para resolver o problema principal?"
11. **Nice-to-have**: "O que seria bom ter mas pode ficar para depois?"
12. **Non-goals**: "O que explicitamente NÃO faremos nessa versão?"
13. **Restrições**: "Quais restrições técnicas ou de negócio existem?"

#### FASE 5: USER STORIES

14. Proponha user stories no formato:
    ```
    Como [persona], quero [ação], para [benefício].
    ```

15. Para cada story, defina critérios de aceitação:
    - Use formato: "Should [comportamento]"
    - Considere: happy path, edge cases, estados de erro

**PAUSA OBRIGATÓRIA**: Mostre resumo e peça aprovação ANTES de gerar o PRD.

#### FASE 6: GERAÇÃO DO PRD

Após aprovação, crie o arquivo `tasks/prd-<feature>.md` no formato selecionado.

#### FASE 7: LISTA DE TAREFAS (opcional)

Após aprovação do PRD, pergunte:

```
Deseja que eu gere a lista de tarefas em tasks/tasks-<feature>.md? [S/n]
```

---

## Conhecimento Base

### PRD Template Completo

```markdown
# PRD: [Nome da Feature]

## Visão Geral
[1-2 parágrafos: O que é e por que importa]

## Problema
[Problema do usuário que estamos resolvendo]
- Evidências: [dados, feedback, pesquisa]
- Impacto de não resolver: [consequências]

## Hipóteses
- Se [ação], então [resultado], porque [razão]

## Objetivos e Métricas de Sucesso

| Objetivo | Métrica | Baseline | Target |
|----------|---------|----------|--------|
| [O que queremos] | [Como medir] | [Valor atual] | [Valor esperado] |

## Personas Impactadas

### [Persona 1]
- **Quem**: [descrição]
- **Necessidade**: [o que precisa]
- **Como é afetada**: [impacto da feature]

## User Stories

### [US-01] [Título]
**Como** [persona],
**Quero** [ação],
**Para** [benefício].

#### Critérios de Aceitação
- [ ] Deve [comportamento esperado]
- [ ] NÃO deve [comportamento indesejado]

## Requisitos Funcionais

| ID | Requisito | Prioridade | Notas |
|----|-----------|------------|-------|
| RF01 | [Descrição] | Must | [Detalhes] |

## Requisitos Não-Funcionais

- **Performance**: [requisito específico]
- **Acessibilidade**: WCAG 2.1 AA
- **i18n**: Suporte pt/en/es
- **Segurança**: [requisitos]

## Fora de Escopo
- [O que NÃO será feito nessa versão]

## Dependências
- [Dependência técnica ou de negócio]

## Riscos e Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| [Risco] | B/M/A | B/M/A | [Como evitar] |
```

---

### Discovery

#### Framework de Discovery

```
1. PROBLEMA
   - Qual problema estamos resolvendo?
   - Para quem?
   - Como sabemos que é um problema real?

2. EVIDÊNCIAS
   - Dados quantitativos (analytics, métricas)
   - Dados qualitativos (entrevistas, feedback)
   - Comportamento observado

3. HIPÓTESES
   - O que acreditamos ser verdade?
   - Como validar cada hipótese?

4. EXPERIMENTOS
   - MVP / Protótipo / Teste A/B
   - Métricas de sucesso do experimento
   - Critérios de go/no-go
```

#### Jobs To Be Done (JTBD)

```markdown
Quando [situação],
Eu quero [motivação],
Para que eu possa [resultado esperado].
```

---

### User Stories

#### Formato INVEST

| Critério | Significado | Verificação |
|----------|-------------|-------------|
| **I**ndependent | Pode ser desenvolvida isoladamente | Não depende de outras stories |
| **N**egotiable | Detalhes podem ser discutidos | Não é contrato rígido |
| **V**aluable | Entrega valor ao usuário | Usuário se beneficia |
| **E**stimable | Pode ser estimada | Tamanho compreensível |
| **S**mall | Pequena o suficiente | Cabe em uma sprint |
| **T**estable | Pode ser testada | Critérios claros |

---

### Priorização

#### RICE Score

```
RICE = (Reach × Impact × Confidence) / Effort
```

| Fator | Escala | Descrição |
|-------|--------|-----------|
| **Reach** | Número | Usuários impactados por período |
| **Impact** | 0.25, 0.5, 1, 2, 3 | Quanto impacta cada usuário |
| **Confidence** | 0-100% | Certeza nas estimativas |
| **Effort** | Pessoa-semanas | Trabalho necessário |

#### MoSCoW

| Categoria | Significado | Critério |
|-----------|-------------|----------|
| **Must** | Obrigatório | Sem isso não lança |
| **Should** | Importante | Queremos muito, mas dá pra viver sem |
| **Could** | Desejável | Legal ter se sobrar tempo |
| **Won't** | Não agora | Explicitamente fora do escopo |

---

### OKRs

#### Estrutura

```markdown
## Objetivo: [Qualitativo, inspirador, ambicioso]

### Key Results:
1. [Métrica] de [X atual] para [Y target]
2. [Métrica] de [X atual] para [Y target]
3. [Métrica] de [X atual] para [Y target]

### Iniciativas:
- [Projeto/feature que contribui para os KRs]
```

#### Bons vs Maus OKRs

| Ruim | Bom |
|------|-----|
| "Melhorar UX" | "Reduzir tempo de checkout de 5min para 2min" |
| "Lançar feature X" | "Aumentar retenção D7 de 20% para 35%" |
| "Fazer mais vendas" | "Aumentar MRR de R$10k para R$25k" |

---

### Roadmap

#### Formato Now/Next/Later

```markdown
## Now (Este trimestre)
- [Feature A] - Em desenvolvimento
- [Feature B] - Em discovery

## Next (Próximo trimestre)
- [Feature C] - Validada, aguardando
- [Feature D] - Em discovery

## Later (Futuro)
- [Feature E] - Ideia, não validada
- [Feature F] - Dependente de X
```

---

### Anti-Padrões

| Evite | Prefira |
|-------|---------|
| Começar pela solução | Começar pelo problema |
| PRD sem métricas | Definir sucesso antes |
| Stories sem critérios | Critérios testáveis |
| Roadmap com datas fixas | Now/Next/Later |
| Priorizar por HiPPO | Framework consistente |
| Ignorar o "fora de escopo" | Explicitar limites |

---

### Onde Salvar

```
tasks/prd-nome-feature.md
docs/product/roadmap.md
docs/product/personas.md
docs/product/okrs-q1-2025.md
```
