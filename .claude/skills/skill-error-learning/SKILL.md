---
name: skill-error-learning
description: |
  Use este skill quando o usuário pedir para "documentar erro", "aprender com erro",
  "testar conhecimento", "refletir sobre erros", ou reportar um erro que cometeu.
  Sistema de aprendizado contínuo baseado em retrieval practice.
  Use /skill-error-learning [learn|quiz|reflect] proativamente.
argument-hint: "[learn|quiz|reflect] [args]"
model: opus
user-invocable: true
---

# Error Learning (Sistema de Aprendizado Contínuo)

## Objetivo

Sistema de aprendizado contínuo baseado em pesquisa sobre memória, retrieval practice, e limitações de auto-correção em LLMs.

## Quando usar

- Quando usuário reportar erro → `/skill-error-learning learn`
- Para testar conhecimento → `/skill-error-learning quiz`
- Para analisar padrões → `/skill-error-learning reflect`

---

## Workflows Invocáveis

### /learn <erro>

**Erro reportado**: $ARGUMENTS

#### Processo com Verificação Externa

**Base científica**: LLMs não conseguem identificar próprios erros sem feedback
externo ([Huang et al. 2024](https://arxiv.org/html/2310.01798v2)). O usuário é
o "oracle" que valida cada etapa.

#### Etapa 1: Confirmar o Erro

Pergunte ao usuário:

> "Entendi que **[descrever o erro]** aconteceu. Está correto?"

**Aguarde confirmação antes de continuar.**

#### Etapa 2: Validar a Causa

Proponha a causa raiz e pergunte:

> "A causa parece ser **[causa identificada]**. Você concorda?"

**Aguarde confirmação ou correção antes de continuar.**

#### Etapa 3: Propor a Regra

Com base na causa validada, proponha uma regra e pergunte:

> "Proponho a regra: **[SEMPRE/NUNCA + ação]**. Faz sentido?"

**Aguarde aprovação antes de continuar.**

#### Etapa 4: Definir Verificação

Pergunte como medir efetividade:

> "Como vamos saber se essa regra está funcionando?"

Sugestões:
- "Não acontecer de novo"
- "Aparecer em code review"
- "Lint/test pegar automaticamente"

#### Etapa 5: Classificar e Documentar

**Taxonomia Simplificada (3 tipos)**:

| Tipo | Memória | Destino | Quando usar |
|------|---------|---------|-------------|
| **Regra** | Semântica | CLAUDE.md | "Sempre/Nunca faça X" |
| **Procedimento** | Procedural | .claude/learn/faq.md | "Para fazer X, faça Y" |
| **Incidente** | Episódica | .claude/learn/lessons-learned.md | "No dia X, Y aconteceu porque Z" |

**Formato de Documentação (AAR)**:

```markdown
## [Data] - [Título curto]

**O quê**: [O que aconteceu - 1 frase]
**Por quê**: [Causa raiz - 1 frase]
**Regra**: [SEMPRE/NUNCA + ação]
**Verificação**: [Como saber se está funcionando]
```

**Formato de Resposta** (após todas as validações):

```
✅ Validado com usuário:
- Erro: [confirmado]
- Causa: [confirmado]
- Regra: [aprovado]
- Verificação: [definido]

**Classificação**: [tipo] → [arquivo]

**Proposta de documentação**:
[Texto formatado no template AAR]

Inserir no arquivo? [S/n]
```

---

### /quiz [area]

**Base científica**: Testar conhecimento é 25% mais efetivo que apenas reler
([Rowland 2014](https://pubmed.ncbi.nlm.nih.gov/25150680/)). Effect size g=0.50.

#### Como Funciona

1. Leia as regras recentes documentadas em:
   - `CLAUDE.md` (seção "Regras obrigatórias")
   - `.claude/learn/faq.md` (seção "Procedimentos")
   - `.claude/learn/lessons-learned.md` (incidentes recentes)

2. Selecione 3-5 regras relevantes para testar

3. Para cada regra, formule uma pergunta que testa aplicação prática

#### Formato das Perguntas

**Tipo 1: Situação Hipotética**
```
"Você está criando um novo componente e precisa definir tipos.
Qual é a regra do projeto sobre `type` vs `interface`?"
```

**Tipo 2: Identificar Problema**
```
"O código abaixo tem um problema segundo as regras do projeto. Qual é?

const Component = ({ name }: Props) => <div>{name}</div>
```

**Tipo 3: Completar Regra**
```
"Complete a regra: 'SEMPRE use ___ para importações que são apenas tipos.'"
```

#### Fluxo do Quiz

```
Claude: "Vou testar seu conhecimento sobre regras do projeto.
Área: $ARGUMENTS (ou geral)

Pergunta 1/3:
[pergunta]"

Usuário: [resposta]

Claude:
- Se correto: "✅ Correto! [breve explicação]"
- Se incorreto: "❌ A regra é: [regra completa]. Vou marcar para revisão."

[próxima pergunta...]
```

#### Após o Quiz

Apresente resumo:

```
## Resultado do Quiz

✅ Acertos: N/M
❌ Erros: X

### Regras para Revisar
[Lista das regras erradas com explicação]

### Próximos Passos
- Regras erradas serão mencionadas no início da próxima sessão
- Considere `/skill-error-learning learn` se descobrir lacunas no conhecimento
```

---

### /reflect [escopo]

Analise os aprendizados documentados e identifique oportunidades de melhoria.

**Escopo**: $ARGUMENTS (padrão: recent)

#### Processo de Reflexão

**1. Coleta de Dados**

Leia os arquivos de aprendizados:
- `.claude/learn/lessons-learned.md` - aprendizados específicos
- `.claude/learn/faq.md` - armadilhas comuns
- `.claude/learn/decisions.md` - decisões arquiteturais

**2. Análise de Padrões**

Identifique:
1. **Padrões recorrentes** (2+ ocorrências do mesmo tipo de erro)
2. **Regras que podem ser promovidas** (pitfall → CLAUDE.md)
3. **Duplicatas** (mesma informação em lugares diferentes)
4. **Obsoletos** (regras que não se aplicam mais)

**3. Métricas**

```markdown
## Métricas de Aprendizado

### Por Categoria
| Categoria | Total | Último mês |
|-----------|-------|------------|
| Frontend  | N     | N          |
| Backend   | N     | N          |

### Efetividade
- Erros repetidos após documentação: N (falhas do sistema)
- Regras nunca referenciadas: N (candidatas a remoção)
```

**4. Recomendações**

```markdown
## Ações Recomendadas

### Consolidação
- [ ] Mesclar X e Y em regra única
- [ ] Promover Z para CLAUDE.md (frequência alta)

### Limpeza
- [ ] Remover regra obsoleta W
- [ ] Atualizar regra V (contexto mudou)
```

#### Escopo de Reflexão

| Escopo | O que analisa |
|--------|---------------|
| `all` | Todos os aprendizados desde o início |
| `recent` | Últimas 10 entradas ou último mês |
| `frontend` | Apenas categoria Frontend |
| `backend` | Apenas categoria Backend |
| `critical` | Apenas severidade Crítica/Alta |

---

## Conhecimento Base

### Referências Científicas

- [Huang et al. 2024](https://arxiv.org/html/2310.01798v2): LLMs não auto-corrigem sem feedback externo
- [Rowland 2014](https://pubmed.ncbi.nlm.nih.gov/25150680/): Retrieval practice g=0.50
- [Ebbinghaus](https://en.wikipedia.org/wiki/Spaced_repetition): 90% esquecido em 3 dias
- [Bjork](https://bjorklab.psych.ucla.edu/): Desirable difficulties

### Princípio 1: Verificação Externa Obrigatória

**Por quê**: LLMs não conseguem identificar próprios erros. O usuário é o "oracle".

**Como aplicar**: Antes de documentar qualquer aprendizado, valide com o usuário:
1. O erro realmente aconteceu?
2. A causa identificada está correta?
3. A regra proposta faz sentido?
4. Como vamos verificar se funciona?

**NUNCA** documente sem confirmação explícita do usuário em cada etapa.

### Princípio 2: Taxonomia Simplificada (3 tipos)

Baseada em tipos de memória cognitiva:

| Tipo | Memória | Destino | Pergunta-chave |
|------|---------|---------|----------------|
| **Regra** | Semântica | CLAUDE.md | "Claude deve SEMPRE/NUNCA fazer isso?" |
| **Procedimento** | Procedural | .claude/learn/faq.md | "É um passo-a-passo para resolver algo?" |
| **Incidente** | Episódica | .claude/learn/lessons-learned.md | "É um evento único para contexto?" |

### Princípio 3: Template AAR (After Action Review)

**Por quê**: NASA e McKinsey usam AAR com sucesso comprovado.

```markdown
## [Data] - [Título curto]

**O quê**: [O que aconteceu - 1 frase]
**Por quê**: [Causa raiz - 1 frase]
**Regra**: [SEMPRE/NUNCA + ação]
**Verificação**: [Como saber se está funcionando]
```

### Princípio 4: Reforço Automático (Spaced Review)

**Por quê**: 90% esquecido em 3 dias sem reforço.

No início de sessões relevantes, mencione regras recentes:

```
"Contexto: vamos trabalhar com [área].
Lembrete: documentamos recentemente que [regra].
Isso se aplica ao que vamos fazer?"
```

### Princípio 5: Métricas de Efetividade

1. **Taxa de reincidência**: Erro repetiu após documentação = FALHA
2. **Taxa de aplicação**: Regra aparece em code review = SUCESSO
3. **Taxa de acerto /quiz**: Conhecimento internalizado

### Meta-Rules para Escrita

- SEMPRE use diretivas absolutas (NUNCA/SEMPRE) para regras
- SEMPRE explique o problema antes da solução (1-3 bullets)
- SEMPRE inclua campo "Verificação"
- NUNCA documente sem validação do usuário
- NUNCA adicione regras genéricas (só específicas do projeto)

### Padrões de Produção

#### Erros são Dados, Não Lixo
- NUNCA limpe traces de erro automaticamente
- Stack traces visíveis = aprendizado implícito

#### Regra dos 3 Tentativas
Após 3 falhas no mesmo problema:
1. STOP - não continue tentando a mesma abordagem
2. Documente o que foi tentado
3. Pesquise abordagens alternativas

#### Context Window Degradation
- 50-60% é o limite prático, não 100%
- Performance degrada com comprimento, não com dificuldade

#### Proteção de Testes
- NUNCA modifique testes para passar
- SEMPRE peça self-review antes de aceitar código

### Referências
- [DoltHub - Claude Code Gotchas](https://www.dolthub.com/blog/2025-06-30-claude-code-gotchas/)
- [Applied LLMs](https://applied-llms.org/)
- [Manus AI - Context Engineering](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)

---

## Checklist

- [ ] Erro descrito com contexto e impacto real
- [ ] Verificação externa registrada (evidência objetiva)
- [ ] Regra/contramedida específica e acionável
- [ ] Categoria mantida simples (máx. 3)
- [ ] Revisão posterior planejada
