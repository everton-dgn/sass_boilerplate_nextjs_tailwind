---
name: skill-git-workflow
description: |
  Use este skill quando o usuário pedir para "fazer commit", "commitar", "commit atômico",
  "preparar PR", "criar branch", "resolver conflito", "fazer merge", "fazer rebase",
  ou mencionar Conventional Commits, workflow git ou estratégia de branching.
  Cobre commits atômicos, Conventional Commits, branching, PR, merge, rebase, resolução de conflitos.
  Use /skill-git-workflow para guia interativo.
model: opus
user-invocable: true
---

# Git Workflow

## Objetivo

Workflow git - commits atômicos, Conventional Commits, branching, PR, merge, rebase, resolução de conflitos.

## Quando usar

- Ao fazer commits atômicos (uma mudança lógica por commit)
- Ao padronizar branches e Conventional Commits
- Ao preparar PRs, merges e rebases
- Ao resolver conflitos e tags/releases
- Para guia interativo → `/skill-git-workflow`

---

## Workflow Invocável

### /skill-git-workflow

Guia interativo para operações git.

#### Processo

1. **Identificar situação atual**
   ```bash
   git status
   git log --oneline -5
   git branch -a
   ```

2. **Perguntar ao usuário** qual operação deseja:
   - Fazer commit atômico
   - Criar/trocar branch
   - Preparar PR
   - Fazer merge/rebase
   - Resolver conflitos

3. **Guiar passo a passo** conforme a operação escolhida

4. **Validar resultado** com `git status` e `git log`

---

## Qualidade e CI

### Ferramentas

| Ferramenta | Comando | Uso |
|------------|---------|-----|
| Biome | `pnpm format` | Formatação |
| Biome | `pnpm lint` | Linting |
| TypeScript | `pnpm typecheck` | Verificação de tipos |

### Lefthook (Git Hooks)

| Hook | Executa |
|------|---------|
| `pre-commit` | `format`, `lint`, `typecheck` |
| `pre-push` | `test` |

### Dependências

Versão exata, sem `^` ou `~`:

```json
{
  "dependencies": {
    "axios": "1.8.0"
  }
}
```

## Conventional Commits

### Formato

```
<type>(<scope>): <description>

[body opcional]

[footer opcional]
```

### Limites (Commitlint)

| Elemento | Limite |
|----------|--------|
| Header (primeira linha) | máx 120 caracteres |
| Body (linhas seguintes) | máx 200 caracteres/linha |

### Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (sem mudança de código) |
| `refactor` | Refatoração |
| `perf` | Performance |
| `test` | Testes |
| `chore` | Manutenção |

### Exemplos

```bash
feat(auth): add login with Google OAuth

fix(api): handle timeout on slow connections

docs(readme): update installation instructions

refactor(components): extract Button from Form
```

### Breaking Changes

```bash
feat(api)!: change response format

BREAKING CHANGE: response.data is now response.result
```

## Commits Atômicos

### O que é

Um commit atômico representa **uma única mudança lógica** que:
- Compila/funciona sozinho
- Pode ser revertido sem quebrar outras coisas
- É compreensível isoladamente

### Regra: Um Commit = Uma Coisa

Pergunte: "Este commit faz **uma** coisa ou **várias**?"

- Uma feature? → 1 commit
- Uma correção? → 1 commit
- Um refactor? → 1 commit
- Feature + correção + refactor? → 3 commits separados

### Critérios

| ✅ Atômico | ❌ Não atômico |
|-----------|---------------|
| "fix: corrigir validação de email" | "fix: corrigir validação e adicionar loading" |
| "feat: adicionar botão de logout" | "feat: logout, refactor header, ajustar css" |
| "refactor: extrair função de parse" | "refactor: várias melhorias no código" |

### Técnicas

#### Staging parcial (selecionar apenas partes)

```bash
git add -p arquivo.ts    # Interativo: escolher hunks
git add -p               # Todos os arquivos modificados
```

#### Separar mudanças com stash

```bash
git stash -p             # Stash parcial (interativo)
git commit -m "feat: X"
git stash pop
git commit -m "fix: Y"
```

#### Ver o que será commitado

```bash
git diff --staged        # O que está no stage
git diff                 # O que NÃO está no stage
```

### Workflow para Commits Atômicos

1. Fazer todas as mudanças normalmente
2. `git diff` para revisar tudo
3. `git add -p` para selecionar apenas mudanças relacionadas
4. `git commit -m "tipo: descrição específica"`
5. Repetir 3-4 até commitar tudo

## Branching

### Nomenclatura

```
feat/nome-da-feature
fix/descricao-do-bug
docs/o-que-documenta
refactor/o-que-refatora
```

### Fluxo

```bash
# Criar branch
git checkout -b feat/nova-feature

# Trabalhar...
git add .
git commit -m "feat: implementar X"

# Atualizar com main
git fetch origin
git rebase origin/main

# Push
git push -u origin feat/nova-feature
```

## Pull Request

### Título

Seguir Conventional Commits:
```
feat(auth): add social login
```

### Template

```markdown
## Summary
- Bullet points do que foi feito

## Test plan
- [ ] Como testar a mudança
- [ ] Cenários verificados

🤖 Generated with Claude Code
```

### Comandos úteis

```bash
# Criar PR
gh pr create --title "feat: ..." --body "..."

# Ver PRs
gh pr list

# Checkout PR local
gh pr checkout 123
```

## Merge vs Rebase

### Quando usar Merge

```bash
# Branches de longa duração
# Preservar histórico completo
git merge feature-branch
```

### Quando usar Rebase

```bash
# Atualizar branch com main
# Histórico linear
git rebase main

# Interativo (squash commits)
git rebase -i HEAD~3
```

## Resolução de Conflitos

```bash
# Durante rebase
git rebase main
# ... conflito ...
# Resolver arquivos
git add .
git rebase --continue

# Abortar se necessário
git rebase --abort
```

## Comandos Úteis

```bash
# Status
git status
git log --oneline -10

# Stash
git stash
git stash pop

# Reset (cuidado!)
git reset --soft HEAD~1  # Desfaz commit, mantém changes
git reset --hard HEAD~1  # Desfaz commit E changes

# Cherry-pick
git cherry-pick abc123

# Blame
git blame src/file.ts
```

## Regras de Segurança

- ❌ Nunca `push --force` em main/master
- ❌ Nunca commitar secrets (.env, keys)
- ❌ Nunca `git add .` sem revisar
- ✅ Sempre fazer PR para main
- ✅ Sempre revisar diff antes de commit
- ✅ Usar .gitignore adequado

## Checklist PR

- [ ] Branch atualizada com main
- [ ] Commits seguem Conventional Commits
- [ ] Testes passando
- [ ] Lint passando
- [ ] Descrição clara do que foi feito
- [ ] Screenshots se mudança visual
