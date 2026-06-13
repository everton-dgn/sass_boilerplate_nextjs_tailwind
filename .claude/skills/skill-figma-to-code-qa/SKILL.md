---
name: skill-figma-to-code-qa
description: |
  Use este skill quando o usuário pedir para "QA de implementação Figma",
  "verificar qualidade Figma-to-code", "documentar gaps", ou antes de marcar
  uma implementação Figma como concluída para verificações obrigatórias.
  Cobre verificações obrigatórias e gerenciamento de gap log.
model: opus
---

# QA Figma-to-Code

## Objetivo

Garantir que as verificações obrigatórias sejam passadas e todos os gaps documentados antes de completar uma tarefa Figma-to-code.

## Quando usar

- Antes de marcar uma implementação Figma como concluída
- Ao revisar qualidade do trabalho Figma-to-code
- Ao documentar gaps encontrados durante implementação

## Checklist de QA

### Qualidade de Código

- [ ] Sem erros TypeScript (`pnpm typecheck`)
- [ ] Sem erros de lint (`pnpm lint`)
- [ ] Testes passando (`pnpm test`)
- [ ] Sem valores hardcoded (cores, tamanhos, strings)
- [ ] Sem código comentado

### Uso de Tokens

- [ ] Todas as cores usam tokens `var(--color-*)`
- [ ] Toda tipografia usa classes `text-*`
- [ ] Todos os radius usam tokens `var(--radius-*)`
- [ ] Todas as sombras usam tokens `var(--shadow-*)`
- [ ] Nenhuma nova variável CSS criada

### Padrões de Componentes

- [ ] Componentes são auto-contidos
- [ ] CSS importado como `S` de `./styles.module.css`
- [ ] `clsx` usado para múltiplas classes (não template literals)
- [ ] Types em arquivo `types.ts` separado
- [ ] Interface de props exportada

### Acessibilidade

- [ ] Elementos HTML semânticos usados
- [ ] Focus visível em elementos interativos
- [ ] Aria labels onde apropriado
- [ ] Hierarquia de headings correta
- [ ] Contraste de cor suficiente

### Documentação

- [ ] Gap log atualizado com exceções
- [ ] Props do componente documentadas em types.ts
- [ ] Lógica complexa tem explicação

## Gap Log

### Propósito

Documentar desvios da implementação ideal que requerem atenção futura.

### Tipos de Gap

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| Token | Cor/estilo não está no sistema de tokens | Cor de accent faltando |
| Componente | Funcionalidade não suportada por componente existente | Variante de tamanho faltando |
| Variante | Variante de componente não disponível | Botão "ghost" faltando |
| Padrão | Padrão de design não estabelecido | Novo tipo de layout de card |
| Asset | Ícone/imagem não está no projeto | Ícone customizado necessário |

### Template do Gap Log

Criar ou atualizar arquivo na raiz do projeto ou na descrição do PR:

```markdown
# Gap Log - [Nome da Feature/Página]

## Resumo
- Total de gaps: X
- Resolvidos: Y
- Pendentes: Z

## Gaps

| ID | Tipo | Descrição | Origem | Proposta | Status |
|----|------|-----------|--------|----------|--------|
| G001 | Token | Cor #F5A623 não está nos tokens | Banner hero | Adicionar --color-warning | Pendente |
| G002 | Componente | Chip com botão de fechar | Filtro de tags | Adicionar prop dismissible | Em Revisão |
| G003 | Variante | Tamanho de botão apenas ícone | Barra de ações | Adicionar variante iconOnly | Pendente |
```

### Status do Gap

| Status | Significado |
|--------|-------------|
| Pendente | Gap identificado, ainda não tratado |
| Em Revisão | Proposta enviada para revisão |
| Aprovado | Proposta aprovada, aguardando implementação |
| Resolvido | Gap corrigido no codebase |
| Adiado | Postergado para sprint futura |
| Rejeitado | Proposta rejeitada, workaround usado |

## Verificações Obrigatórias

### Verificação 1: Análise Estática

```bash
pnpm typecheck  # Deve passar
pnpm lint       # Deve passar (rodar pnpm format se falhar)
```

### Verificação 2: Suite de Testes

```bash
pnpm test       # Todos os testes devem passar
```

### Verificação 3: Revisão Manual

- [ ] Comparação visual com design do Figma
- [ ] Comportamento responsivo verificado
- [ ] Estados interativos funcionam
- [ ] Básicos de acessibilidade verificados

### Verificação 4: Documentação de Gaps

- [ ] Todos os gaps documentados no gap log
- [ ] Workarounds justificados
- [ ] Nenhum novo componente sem aprovação

## Tratamento de Falhas

### Se Verificação Falhar

1. **Falha na Análise Estática**
   - Rodar `pnpm format` para problemas de formatação
   - Corrigir erros TypeScript antes de prosseguir
   - NÃO usar `// @ts-ignore`

2. **Falha de Teste**
   - Corrigir o código, não o teste
   - Adicionar casos de teste faltantes
   - NÃO deletar testes que falham

3. **Falha na Revisão Manual**
   - Documentar problemas específicos
   - Criar lista de correções necessárias
   - Reimplementar e revalidar

4. **Documentação de Gaps Faltando**
   - Não pode completar tarefa sem gap log
   - Todas exceções devem ser documentadas
   - Obter aprovação para novos componentes

## Critérios de Sucesso

Tarefa está completa quando:

- [ ] Todas as 4 verificações passam
- [ ] Gap log está atualizado
- [ ] Descrição do PR inclui resumo da implementação
- [ ] Nenhum issue P1 ou P2 aberto

## Referência

- Padrões do projeto: `CLAUDE.md`
- Design tokens: `src/theme/` (consultar arquivos CSS diretamente)
- Constraints de qualidade: `docs/quality-constraints.md`
