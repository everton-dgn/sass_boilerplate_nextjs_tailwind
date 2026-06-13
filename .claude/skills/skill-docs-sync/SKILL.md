---
name: skill-docs-sync
description: |
  Use este skill quando o usuário pedir para "atualizar documentação", "sincronizar docs",
  "docs desatualizados", "atualizar README", ou após mover arquivos, mudar convenções
  ou modificar estrutura do projeto que afeta documentação.
  Use /skill-docs-sync para atualizar docs após alterações.
argument-hint: "<descricao-da-mudanca>"
model: opus
user-invocable: true
---

# Docs Sync

## Objetivo

Sincronizar documentação do projeto após mudanças em padrões, estrutura ou convenções.

## Quando usar

- Após mover arquivos ou pastas → `/skill-docs-sync`
- Após mudar convenções de código
- Após atualizar dependências importantes

## Skills relacionados

- `skill-documentation` - padrões de documentação

---

## Workflow Interativo

### /sync-docs <mudança>

Sincronize a documentação do projeto após a mudança: **$ARGUMENTS**

#### Processo

**1. Analisar a mudança**

- O que mudou exatamente?
- Afeta código, estrutura ou convenção?

**2. Verificar se afeta um skill**

Skills disponíveis:

| Skill | Arquivo |
|-------|---------|
| code-standards | `.claude/skills/skill-code-standards/SKILL.md` |
| i18n-patterns | `.claude/skills/skill-i18n-patterns/SKILL.md` |
| css-modules | `.claude/skills/skill-css-modules/SKILL.md` |
| content-marketing | `.claude/skills/skill-content-marketing/SKILL.md` |
| unit-integration-testing | `.claude/skills/skill-unit-integration-testing/SKILL.md` |

**Testing por Framework:**

| Skill | Arquivo |
|-------|---------|
| vitest-solid | `.claude/skills/skill-vitest-solid/SKILL.md` |
| vitest-react | `.claude/skills/skill-vitest-react/SKILL.md` |
| jest | `.claude/skills/skill-jest/SKILL.md` |

**SolidStart/SolidJS:**

| Skill | Arquivo |
|-------|---------|
| solidstart-component-structure | `.claude/skills/skill-solidstart-component-structure/SKILL.md` |
| solidstart-project-structure | `.claude/skills/skill-solidstart-project-structure/SKILL.md` |
| solidjs-primitives | `.claude/skills/skill-solidjs-primitives/SKILL.md` |
| solidjs-patterns | `.claude/skills/skill-solidjs-patterns/SKILL.md` |

**Next.js/React:**

| Skill | Arquivo |
|-------|---------|
| nextjs-component-structure | `.claude/skills/skill-nextjs-component-structure/SKILL.md` |
| nextjs-project-structure | `.claude/skills/skill-nextjs-project-structure/SKILL.md` |
| reactjs-hooks | `.claude/skills/skill-reactjs-hooks/SKILL.md` |
| reactjs-patterns | `.claude/skills/skill-reactjs-patterns/SKILL.md` |

**3. Atualizar arquivos afetados**

- [ ] `.claude/skills/<skill>/SKILL.md` (skill afetado)
- [ ] `CLAUDE.md`
- [ ] `.claude/agents/*.md` (se relevante)
- [ ] `README.md` (se aplicável)
- [ ] `docs/*.md` (se aplicável)

**4. Verificar consistência**

- Exemplos de código funcionais
- Sem contradições entre arquivos

#### Checklist

- [ ] Skill atualizado
- [ ] `CLAUDE.md` atualizado
- [ ] Docs atualizados (se aplicável)
- [ ] Sem contradições

---

## Conhecimento Base

### Arquivos de documentação comuns

| Arquivo | Propósito |
|---------|-----------|
| `CLAUDE.md` | Regras e convenções do projeto para Claude |
| `README.md` | Documentação pública do projeto |
| `EXTENDING.md` | Guia para estender o sistema |
| `.claude/skills/**` | Skills especializados |
| `.claude/agents/**` | Agents disponíveis |
| `docs/**` | Documentação adicional |

### Tipos de mudança

| Tipo | Exemplos | Impacto |
|------|----------|---------|
| **Estrutura** | Mover pastas, renomear arquivos | Paths em skills/agents |
| **Convenção** | Mudar naming, padrões | Skills de padrões |
| **Dependência** | Atualizar lib, trocar ferramenta | Skills específicos |
| **Arquitetura** | Nova camada, refatorar | Múltiplos skills |

### Processo de atualização

1. Identifique todos os arquivos que mencionam o que mudou
2. Atualize um arquivo por vez
3. Verifique se exemplos de código ainda funcionam
4. Confirme que não há contradições entre arquivos
5. Teste a mudança (se aplicável)

---

## Checklist

- [ ] Mudança claramente identificada
- [ ] Skills afetados atualizados
- [ ] Documentação principal atualizada
- [ ] Sem contradições entre arquivos
- [ ] Exemplos de código validados
