---
name: skill-figma-component-mapping
description: |
  Use este skill quando o usuário pedir para "mapear componentes do Figma",
  "qual componente usar para este elemento", "reusar componente existente",
  ou mencionar correspondência entre elementos Figma e componentes do projeto.
  Mapeia elementos do Figma para componentes existentes usando match semântico.
model: opus
---

# Mapeamento de Componentes Figma

## Objetivo

Mapear elementos do Figma para componentes existentes do projeto, priorizando reuso sobre criação.

## Quando usar

- Ao analisar um design do Figma para implementação
- Ao decidir qual componente do projeto corresponde a um elemento Figma
- Ao avaliar se um novo componente é realmente necessário

## Hierarquia de Decisão

```
1. Componente exato existe?     -> Usar diretamente
2. Componente similar existe?   -> Usar com props/className
3. Pode compor existentes?      -> Criar composição
4. Pode estender?               -> Propor nova prop (registrar gap)
5. Nenhuma opção?               -> Criar novo (última opção, registrar gap)
```

## Mapeamento Visual -> Componente

| Visual no Figma | Componente | Path |
|-----------------|------------|------|
| Botão | `Button` | `atoms/Button` |
| Campo de texto | `Input` | `molecules/Input` |
| Dropdown | `Select` / `Dropdown` | `molecules/` |
| Checkbox | `Checkbox` | `atoms/Checkbox` |
| Avatar | `Avatar` | `atoms/Avatar` |
| Tag/label | `Badge` | `atoms/Badge` |
| Modal | `Modal` | `organisms/Modal` |
| Tabela | `Table` | `organisms/Table` |
| Notificação | `Toast` | `molecules/Toast` |
| Paginação | `Pagination` | `molecules/Pagination` |
| Abas | `Tabs` | `molecules/Tabs` |
| Card | `Card` | `molecules/Card` |
| Ícone | `Icon` / SVG | `atoms/Icon` ou `assets/icons/` |

## Processo de Busca

```bash
# Buscar por padrão de nome
fd -t d "Button|Card|Modal" src/components/

# Buscar componente específico
fd -t d "ComponentName" src/components/

# Verificar props disponíveis
cat src/components/atoms/Button/types.ts

# Encontrar todos os exports de componentes
grep -r "export.*Component" src/components/
```

## Rubrica de Match (Semântica > Visual)

| Critério | Peso | Descrição |
|----------|------|-----------|
| Função/comportamento | +40% | Faz a mesma coisa? |
| Estrutura | +30% | Estrutura HTML similar? |
| Cobertura de props | +20% | Variações cobertas por props existentes? |
| Compatibilidade de tokens | +10% | Usa os mesmos design tokens? |

**Threshold de match:** >= 80%

**Threshold de gap:** Se precisa de 3+ overrides, registrar gap

## Checklist de Avaliação

Antes de decidir criar um novo componente:

- [ ] Buscou em `src/components/` por componentes similares
- [ ] Verificou se componente existente tem props de variação
- [ ] Confirmou se pode compor 2+ componentes existentes
- [ ] Confirmou que nenhum componente cobre >= 80% das necessidades
- [ ] Documentou razão para novo componente no gap log

## Formato de Entrada no Gap Log

Quando um novo componente é realmente necessário:

```markdown
| ID | Tipo | Descrição | Origem | Proposta | Status |
|----|------|-----------|--------|----------|--------|
| G001 | Componente | Card com header de imagem não suportado | Seção Hero | Adicionar prop `headerImage` | Pendente |
| G002 | Variante | Tamanho grande de botão não disponível | Banner CTA | Adicionar `size="lg"` | Pendente |
```

## Padrões Comuns

### Frame Figma -> Componente React

```
Frame Figma "Card"
  - Imagem
  - Título (Texto)
  - Descrição (Texto)
  - Botão

Mapeia para:
<Card>
  <Card.Image src={...} alt={...} />
  <Card.Title>{title}</Card.Title>
  <Card.Description>{description}</Card.Description>
  <Button>{cta}</Button>
</Card>
```

### Auto Layout Figma -> Container Flex

```
Auto Layout Figma (horizontal, gap 16)

Mapeia para:
.container {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
```

### Componente Figma com Variantes -> Props

```
Figma "Button" com variantes:
  - Type: Primary, Secondary, Ghost
  - Size: Small, Medium, Large

Mapeia para:
<Button variant="primary" size="medium">
```

## Anti-Padrões

**NUNCA:**
- Match apenas por aparência visual (cor, tamanho)
- Criar novo componente sem buscar existentes
- Override de mais de 2 propriedades de estilo via className
- Adicionar estilos inline para casar com Figma exatamente

**SEMPRE:**
- Match por função semântica primeiro
- Verificar documentação de props antes de criar novo
- Registrar gaps ao invés de criar workarounds
- Pedir aprovação antes de criar novos componentes

## Referência

- Componentes do projeto: `src/components/`
- Documentação de componentes: `docs/ui-conventions.md`
- Design tokens: `src/theme/` (consultar arquivos CSS diretamente)
