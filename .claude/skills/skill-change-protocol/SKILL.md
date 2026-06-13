---
name: skill-change-protocol
description: |
  Use este skill quando o usuário pedir para "modificar código existente",
  "alterar arquivos", "refatorar", "mudar implementação", ou quando mudanças
  afetam contratos, múltiplos arquivos ou têm risco de regressão/arquitetural.
  Cobre as 3 fases obrigatórias: análise, execução, validação.
model: opus
---

# Protocolo de Alterações

## Objetivo
Protocolo de alterações - as 3 fases obrigatórias (análise, execução, validação) antes de modificar qualquer código.

## Quando usar
- Antes de modificar qualquer arquivo.
- Quando a mudança afeta contratos ou multiplos arquivos.
- Quando há risco de regressão ou impacto arquitetural.

Antes de modificar qualquer arquivo, siga este protocolo obrigatório:

## Fase 1: Análise (não altere código)

1. **Visão global**: Analise todo o fluxo impactado:
   - Contratos públicos (exports, tipos)
   - Imports e dependências
   - Usos indiretos em outros arquivos
   - Padrões arquiteturais existentes

2. **Liste explicitamente**: Se qualquer arquivo além do solicitado for
   impactado, liste antes de alterar.

3. **Explique**:
   - O que precisa ser alterado
   - Por que a alteração é necessária
   - Quais arquivos serão afetados

## Fase 2: Execução (aplique apenas o planejado)

1. **Alteração mínima e controlada**:
   - Altere apenas o solicitado
   - Não refatore, reestruture ou simplifique código existente
   - Não renomeie variáveis, funções, tipos ou arquivos sem solicitação
   - Não introduza novas abstrações, helpers ou padrões
   - Preserve completamente convenções já adotadas

2. **Respeito absoluto aos guias**: Trate arquivos de documentação e guias como
   regras obrigatórias, não sugestões. Priorize sempre os guias do projeto.

## Fase 3: Validação

1. **Rodar validação obrigatória** (mesmo em arquivos de teste):
   - `pnpm lint` (ou equivalente do projeto)
   - `pnpm typecheck` (ou equivalente do projeto)
   - `pnpm test` (ou equivalente do projeto)

2. **Antes de finalizar**:
   - Valide mentalmente contra todo o projeto
   - Verifique possíveis regressões
   - Confirme que nenhum comportamento não solicitado foi alterado

3. **Se existir risco**: Aponte explicitamente antes de concluir.

4. **Justifique**: Explique por que cada mudança é necessária e segura.

## Postura Esperada

- Atue de forma cuidadosa e conservadora
- Priorize previsibilidade, estabilidade e consistência global
- Não assuma contexto implícito sem validação
- Se algo não estiver claro, pare e pergunte antes de alterar

## Exemplo Prático

### Solicitação
"Adicione validação de email no formulário de contato"

### Fase 1: Análise

```markdown
## Arquivos impactados

1. `src/components/ContactForm/index.tsx` - adicionar validação
2. `src/components/ContactForm/types.ts` - pode precisar de novo tipo
3. `src/lib/validation.ts` - verificar se já existe validador de email

## Verificações
- [ ] Padrão de validação existente no projeto? → Sim, usa Zod
- [ ] Onde mostrar erro? → Já existe padrão em outros forms
- [ ] i18n necessário? → Sim, mensagem de erro precisa tradução

## Plano
1. Adicionar schema Zod com validação de email
2. Usar mensagem de erro do i18n existente
3. Não alterar estrutura do componente
```

### Fase 2: Execução

```typescript
// Apenas adicionar validação, não refatorar
const schema = z.object({
  email: z.string().email({ message: i18n.errors.invalidEmail }),
  // ... resto do schema existente (não alterar)
})
```

### Fase 3: Validação

```bash
pnpm lint      # ✅ passou
pnpm typecheck # ✅ passou
pnpm test      # ✅ passou
```

```markdown
## Checklist
- [x] Validação funciona corretamente
- [x] Mensagem de erro aparece no local correto
- [x] Não quebrou outros campos do form
- [x] Padrão consistente com outros forms do projeto
```
