---
name: skill-planning
description: |
  Use este skill quando o usuário pedir para "criar plano", "planejar implementação",
  "quebrar em tarefas", "definir escopo", "preparar roadmap", ou mencionar
  planejamento de implementação, divisão de tarefas ou escopo de projeto.
  Cobre perguntas iterativas, pesquisa, verificação, planos de implementação.
model: opus
---

# Planning

## Objetivo
Diretrizes para criar planos de implementação - perguntas iterativas, pesquisa, verificação.

## Quando usar
- Ao preparar planos de implementação.
- Ao quebrar escopos grandes em tarefas menores.
- Ao definir criterios de validação e sucesso.

## Onde Salvar

```
plans/YYYY-MM-DD-slug-descritivo.md
```

**NUNCA** use `~/.claude/plans/`

## Princípios

1. **Nunca assuma** - faça 10-20 perguntas antes de planejar
2. **Pesquise** - docs oficiais, Reddit, blogs, código existente
3. **Verifique** - cada etapa tem critério de sucesso

## Processo

```
1. DESCOBERTA (perguntas)
   └── Uma pergunta por vez, com opções

2. PESQUISA
   ├── Docs oficiais
   ├── Comunidade (Reddit, fóruns)
   └── Código existente

3. DESIGN
   ├── 2-3 opções com trade-offs
   └── Recomendação justificada

4. ESTRUTURAÇÃO
   ├── Tarefas atômicas (max 30 min)
   └── Verificação por tarefa

5. VALIDAÇÃO
   └── Lint + Typecheck + Tests
```

## Template Simplificado

```markdown
# [Tipo] Título

> **Status**: draft | ready | in-progress | completed

## Contexto
[1-2 parágrafos]

## Perguntas Respondidas
1. [Pergunta] → [Resposta]

## Decisão
[Abordagem e justificativa]

## Tarefas
- [ ] Tarefa 1 → Verificar: [como]
- [ ] Tarefa 2 → Verificar: [como]

## Critérios de Sucesso
- [ ] [Critério mensurável]

## Verificação Final
- [ ] Lint + Typecheck + Tests
```

## Formato de Pergunta

```
❓ **[Categoria] Pergunta?**

Por que pergunto: [breve]

Opções:
- **A) Opção** (Recomendado) - [motivo]
- **B) Opção** - [motivo]

Qual prefere?
```

## Checklist de Qualidade

- [ ] 10-20 perguntas feitas
- [ ] Pesquisa diversificada
- [ ] 2+ opções consideradas
- [ ] Verificação por tarefa
- [ ] Critérios mensuráveis
- [ ] Usuário aprovou
