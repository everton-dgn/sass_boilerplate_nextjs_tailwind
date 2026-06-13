---
name: skill-bug-fix
description: |
  Use este skill quando o usuário pedir para "corrigir bug", "resolver erro",
  "debugar", "investigar problema", "encontrar causa do bug", ou mencionar
  teste de regressão, investigação de bugs ou processo sistemático de correção.
  Cobre checklist de correção, teste de regressão, validação de não quebrar nada.
model: opus
---

# Bug Fix

## Objetivo
Correção de bugs - checklist de correção, garantir teste de regressão, validar que não quebrou nada, processo sistemático de fix.

## Quando usar
- Ao investigar e isolar um bug reproduzível.
- Ao aplicar correção mínima com teste de regressão.
- Ao validar que o fix não quebrou fluxos.

## Pré-requisitos

Antes de corrigir, certifique-se que:

- [ ] O problema foi **reproduzido** localmente
- [ ] A **causa raiz** foi identificada (não apenas o sintoma)
- [ ] Você entende **por que** o bug acontece

Se não, use o agent `debug` primeiro.

## Processo de Correção

### 1. Isolar o Escopo

```markdown
## Escopo da Correção

### Causa Raiz
[Uma frase explicando a causa]

### Arquivos a Modificar
- `src/path/file.ts` - [o que mudar]

### Arquivos que NÃO Devem Mudar
- [Listar se houver risco de mudar algo errado]
```

### 2. Escrever Teste Primeiro (TDD)

**Antes de corrigir**, crie um teste que:

1. **Falha** com o código atual (prova que o bug existe)
2. **Passa** após a correção (prova que foi corrigido)

```ts
describe('bugfix: [descrição do bug]', () => {
  it('should [comportamento esperado]', () => {
    // Arrange - setup que reproduz o bug
    // Act - ação que causava o bug
    // Assert - verificar comportamento correto
  })
})
```

### 3. Aplicar Correção Mínima

**Regras:**

- Corrija **apenas** o bug - sem refatorações extras
- Menor mudança possível que resolve o problema
- Mantenha o estilo do código existente
- Não adicione features junto com o fix

### 4. Validar Correção

```bash
# 1. Teste específico passa
pnpm test -- path/to/test.ts

# 2. Todos os testes passam
pnpm test

# 3. Sem erros de tipo
pnpm typecheck

# 4. Código formatado
pnpm lint
```

### 5. Verificar Regressões

- [ ] Funcionalidades relacionadas continuam funcionando
- [ ] Casos de borda tratados
- [ ] Diferentes estados (loading, error, empty) OK
- [ ] Diferentes viewports (se UI)

### 6. Testar Manualmente

Mesmo com testes automatizados:

- [ ] Reproduzir cenário original - bug não ocorre mais
- [ ] Testar fluxo completo - nada quebrou
- [ ] Verificar UX - comportamento faz sentido

## Checklist de Qualidade

### Antes do Commit

- [ ] Teste de regressão escrito e passando
- [ ] `pnpm test` passa
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa
- [ ] Testado manualmente

### Commit Message

Use o prefixo `fix:` seguindo Conventional Commits:

```
fix(escopo): descrição curta do que foi corrigido

Causa: [explicação breve da causa raiz]
Solução: [explicação breve da correção]
```

Exemplo:

```
fix(auth): prevent redirect loop on expired session

Causa: token refresh não atualizava cookie antes do redirect
Solução: await no refresh antes de redirecionar
```

## Categorias de Bugs

### Bugs de Lógica

- Condicionais incorretas
- Edge cases não tratados
- Ordem de operações errada

**Dica:** Adicione testes para cada edge case descoberto.

### Bugs de Estado

- Race conditions
- Estado stale
- Sincronização incorreta

**Dica:** Use `createEffect` para debug de mudanças de estado.

### Bugs de UI

- Layout quebrado
- Responsividade
- Acessibilidade

**Dica:** Teste em múltiplos viewports e com teclado.

### Bugs de Integração

- API retorna formato inesperado
- Timeout/erro de rede
- Dados inconsistentes

**Dica:** Adicione validação e tratamento de erro.

## Anti-Padrões

❌ **Fix sem teste** - sempre adicione teste de regressão
❌ **Fix + refactor** - separe em commits diferentes
❌ **Fix do sintoma** - corrija a causa raiz
❌ **Copiar solução** - entenda antes de aplicar
❌ **Skip manual test** - sempre verificar na UI

## Quando Não Corrigir

Às vezes a melhor ação é **não corrigir agora**:

- Bug de baixo impacto com alto risco de regressão
- Requer refatoração grande para fix correto
- Causa raiz está em dependência externa

Nesses casos, documente e crie issue para tracking.
