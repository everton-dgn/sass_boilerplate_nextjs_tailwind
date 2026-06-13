---
name: skill-code-review
description: |
  Use este skill quando o usuário pedir para "revisar código", "code review",
  "revisar PR", "verificar qualidade", "analisar mudanças", ou mencionar
  revisão de pull request, verificação de qualidade ou feedback sobre código.
  Cobre checklist de review, categorias de feedback, comunicação construtiva.
  Use /skill-code-review para review estruturado.
argument-hint: "[escopo]"
model: opus
user-invocable: true
---

# Code Review

## Objetivo

Práticas de code review - checklist, categorias de feedback, comunicação construtiva, foco em bugs, segurança e manutenibilidade.

## Quando usar

- Ao revisar PRs, commits ou propostas de mudança
- Para executar review estruturado → `/skill-code-review`

---

## Workflow Interativo

### /review-pr [escopo]

Execute um code review estruturado no escopo: **$ARGUMENTS**

Se não especificado, revise as alterações não commitadas (`git diff`).

#### Skills de referência

Consulte estes skills para detalhes:
- `.claude/skills/skill-code-standards/SKILL.md` - regras de código
- `.claude/skills/skill-css-modules/SKILL.md` - padrões CSS

**SolidStart/SolidJS:**
- `.claude/skills/skill-solidstart-component-structure/SKILL.md` - estrutura de componentes
- `.claude/skills/skill-solidjs-primitives/SKILL.md` - guia de primitives

**Next.js/React:**
- `.claude/skills/skill-nextjs-component-structure/SKILL.md` - estrutura de componentes
- `.claude/skills/skill-reactjs-hooks/SKILL.md` - guia de hooks

#### Processo

**1. Identificar mudanças**

```bash
git diff              # alterações não commitadas
git diff --staged     # alterações staged
git diff HEAD~N       # últimos N commits
```

**2. Aplicar checklists**

**Código:**
- [ ] Segue padrões do projeto

**Componentes:**
- [ ] Estrutura correta
- [ ] i18n.ts se tiver textos visíveis

**CSS:**
- [ ] Tokens do tema
- [ ] Classes snake_case
- [ ] CSS nesting

**Primitives/Hooks:**
- [ ] Prefixo correto (create*/make* para Solid, use* para React)

**Acessibilidade:**
- [ ] Elementos semânticos
- [ ] Labels em inputs
- [ ] Alt em imagens
- [ ] Navegação por teclado

**Testes:**
- [ ] Testes existentes passam
- [ ] Novos testes para funcionalidade nova

#### Formato de Feedback

```markdown
### 🔴 [arquivo:linha] Blocker - Título

**Problema:** Descrição do issue

**Sugestão:**
\`\`\`tsx
// código sugerido
\`\`\`
```

#### Severidades

- 🔴 **Blocker** - Deve corrigir antes de merge
- 🟡 **Warning** - Deveria corrigir
- 🟢 **Suggestion** - Nice to have

---

## Conhecimento Base

### Filosofia

#### Objetivos do Code Review

1. **Encontrar bugs** antes de ir para produção
2. **Garantir qualidade** e manutenibilidade
3. **Compartilhar conhecimento** entre o time
4. **Manter consistência** do codebase

#### Mindset

- **Revisar o código, não a pessoa**
- **Ser específico e construtivo**
- **Sugerir, não ordenar**
- **Reconhecer o que está bom**

---

### Checklist de Review

#### 1. Correção

- [ ] O código faz o que deveria fazer?
- [ ] Edge cases são tratados?
- [ ] Há bugs lógicos óbvios?
- [ ] Testes cobrem os cenários importantes?
- [ ] Testes estão passando?

#### 2. Segurança

- [ ] Input do usuário é validado?
- [ ] Queries são parametrizadas (SQL injection)?
- [ ] Output é escapado (XSS)?
- [ ] Autenticação/autorização verificada?
- [ ] Dados sensíveis protegidos?
- [ ] Secrets não estão no código?

#### 3. Performance

- [ ] Há queries N+1?
- [ ] Loops desnecessários?
- [ ] Operações que deveriam ser lazy?
- [ ] Caching onde apropriado?
- [ ] Bundle size impactado?

#### 4. Manutenibilidade

- [ ] Código é legível e claro?
- [ ] Nomes são descritivos?
- [ ] Funções são pequenas e focadas?
- [ ] Complexidade é justificada?
- [ ] Há duplicação desnecessária?

#### 5. Consistência

- [ ] Segue padrões do projeto?
- [ ] Estilo consistente com codebase?
- [ ] Importações organizadas?
- [ ] TypeScript strict?

#### 6. Documentação

- [ ] Código auto-documentado?
- [ ] Comentários onde necessário (e só onde)?
- [ ] README atualizado se necessário?
- [ ] Breaking changes documentados?

---

### Categorias de Feedback

#### 🔴 Blocker (deve corrigir)

Issues que impedem o merge:

- Bugs que quebram funcionalidade
- Vulnerabilidades de segurança
- Regressões em features existentes
- Testes falhando
- Violações graves de padrões

**Formato:**
```
🔴 **Blocker**: [Descrição do problema]

[Explicação do impacto]

Sugestão:
```código sugerido```
```

#### 🟡 Should Fix (deveria corrigir)

Issues importantes mas não bloqueantes:

- Code smells significativos
- Problemas de performance potenciais
- Violações menores de padrões
- Testes faltando para casos importantes

**Formato:**
```
🟡 **Should Fix**: [Descrição]

[Por que é importante]

Sugestão: [alternativa]
```

#### 🟢 Suggestion (sugestão)

Melhorias opcionais:

- Refatorações que melhoram legibilidade
- Abordagens alternativas
- Oportunidades de simplificação
- Boas práticas não obrigatórias

**Formato:**
```
🟢 **Sugestão**: [Descrição]

[Benefício da mudança]

Opcional - fique à vontade para ignorar se preferir a abordagem atual.
```

#### 💬 Question (pergunta)

Dúvidas genuínas:

- Entender decisões de design
- Clarificar intenção
- Aprender algo novo

**Formato:**
```
💬 **Pergunta**: [Dúvida]

Estou curioso sobre a escolha de [X]. Poderia explicar?
```

#### 👍 Praise (elogio)

Reconhecer o que está bom:

- Soluções elegantes
- Boas práticas seguidas
- Código bem testado
- Melhorias no codebase

**Formato:**
```
👍 Muito boa essa abordagem para [X]!
```

---

### Comunicação Efetiva

#### ❌ Evite

```
// Vago
"Isso está confuso"

// Pessoal
"Você sempre faz isso errado"

// Imperativo
"Mude isso para X"

// Sem explicação
"Use useCallback aqui"
```

#### ✅ Prefira

```
// Específico
"A função `processData` está fazendo muitas coisas.
Considere extrair a validação para uma função separada."

// Sobre o código
"Este padrão pode causar re-renders desnecessários.
Veja: [link para explicação]"

// Sugestão
"Que tal usar `useCallback` aqui? Evitaria
recriação da função a cada render."

// Com explicação
"Sugiro `useCallback` para evitar que o efeito
execute a cada render, já que a função é dependência do useEffect."
```

### Frases Úteis

**Para sugestões:**
- "Que tal...?"
- "Considere..."
- "Uma alternativa seria..."
- "Você poderia..."

**Para dúvidas:**
- "Estou curioso sobre..."
- "Poderia explicar...?"
- "Qual a razão para...?"
- "Não entendi bem..."

**Para elogios:**
- "Boa solução para..."
- "Gostei de como você..."
- "Essa abordagem é elegante"
- "Bem pensado!"

---

### O que NÃO revisar (deixe para linters)

- Formatação e estilo
- Ordenação de imports
- Espaços e indentação
- Aspas simples vs duplas
- Trailing commas

---

### Template de PR Description

```markdown
## O que mudou

[Descrição breve das mudanças]

## Por quê

[Contexto e motivação]

## Como testar

1. [Passo 1]
2. [Passo 2]
3. [Resultado esperado]

## Checklist

- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada (se necessário)
- [ ] Breaking changes documentados
- [ ] Self-review realizado

## Screenshots (se aplicável)

[Antes/Depois]

## Issues relacionadas

Closes #123
```

---

### Métricas de Code Review

#### Saudáveis

- **Tempo para primeira review**: < 24h
- **Ciclos de review**: 1-3
- **Tamanho do PR**: < 400 linhas
- **Comentários por PR**: 2-10

#### Red Flags

- PRs muito grandes (> 1000 linhas)
- Muitos ciclos de review (> 5)
- Reviews demorados (> 3 dias)
- Zero comentários (rubber stamping)
- Só comentários negativos

---

### Anti-Padrões

| ❌ Evite | ✅ Prefira |
|----------|-----------|
| Rubber stamping (aprovar sem ler) | Review genuíno |
| Bloquear por estilo | Automatizar com linters |
| Comentários vagos | Feedback específico |
| Focar só no negativo | Reconhecer o positivo |
| PRs gigantes | PRs pequenos e focados |
| Review dias depois | Review em < 24h |
| Discussões infinitas | Conversar offline se necessário |
