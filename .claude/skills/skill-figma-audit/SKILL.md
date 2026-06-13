---
name: skill-figma-audit
description: |
  Use este skill quando o usuário pedir para "analisar design do Figma", "auditar Figma",
  "inventário de componentes", "entender design antes de codar", ou compartilhar
  URL do Figma querendo entender o design antes de implementar.
  Gera inventário de componentes, tokens e gaps antes da implementação.
argument-hint: <figma-url>
model: opus
user-invocable: true
---

# /skill-figma-audit

Analisa um design do Figma e gera um inventário completo antes da implementação.

## Uso

```
/skill-figma-audit <figma-url>
/skill-figma-audit <figma-url> "Frame 1, Frame 2"
```

## Argumentos

- `$ARGUMENTS` - URL do Figma, opcionalmente seguida de nomes de frames específicos

## Propósito

Execute este comando ANTES de implementar um design do Figma para:

1. Entender a estrutura do design
2. Identificar componentes existentes para reuso
3. Mapear tokens do design para tokens do projeto
4. Identificar gaps que precisam de atenção
5. Estimar esforço de implementação

## Workflow

### Passo 1: Extrair Informações do Design

Usar ferramentas Figma MCP:

1. `get_design_context` - Obter estrutura completa do design
2. `get_variable_defs` - Obter tokens do Figma
3. `get_metadata` - Obter detalhes se design for grande
4. `get_code_connect_map` - Verificar mapeamentos existentes

### Passo 2: Analisar Estrutura de Layout

Para cada frame/seção, documentar:

- Nome e dimensões do frame
- Configurações de Auto Layout
- Hierarquia de aninhamento
- Comportamento responsivo (se documentado)

### Passo 3: Inventariar Componentes

Listar todos os elementos de UI no design:

| Elemento | Nome Figma | Instâncias | Match Potencial |
|----------|------------|------------|-----------------|
| Botão | Primary Button | 5 | atoms/Button |
| Card | Product Card | 12 | molecules/Card |
| Input | Text Field | 3 | molecules/Input |

### Passo 4: Inventariar Tokens

**ANTES de mapear, ler os arquivos do tema:**
```bash
cat src/theme/tokens/colors.css      # Ver tokens de cor disponíveis
cat src/theme/class/typography.css   # Ver classes text-* disponíveis
```

Extrair todos os estilos usados no design e mapear para tokens existentes:

**Cores:**
| Cor Figma | Hex | Token do Projeto |
|-----------|-----|------------------|
| [Nome] | [Valor] | [Consultar colors.css] |

**Tipografia:**
| Estilo Figma | Size/Weight | Classe do Projeto |
|--------------|-------------|-------------------|
| [Nome] | [Valor] | [Consultar typography.css] |

**Espaçamento:**
| Valor Figma | Valor do Projeto |
|-------------|------------------|
| [Valor] | [Alinhar à escala 4/8/12/16/24/32/48/64] |

### Passo 5: Identificar Gaps

Documentar elementos sem correspondência:

| Tipo | Descrição | Proposta |
|------|-----------|----------|
| Componente | Carousel não existe | Criar componente |
| Token | Cor #F5A623 não mapeada | Usar token existente mais próximo |
| Padrão | Layout masonry grid | Pesquisar implementação CSS |

### Passo 6: Gerar Relatório

## Formato de Output

```markdown
# Relatório de Auditoria Figma

## Visão Geral do Design
- Arquivo: [nome do arquivo Figma]
- Frames analisados: X
- Total de elementos: Y

## Estrutura de Layout

### Frame: [Nome]
- Dimensões: LxA
- Auto Layout: [Direção, Gap, Padding]
- Seções: [Lista]

## Inventário de Componentes

### Reutilizáveis (X itens)
| Componente | Correspondência | Notas |
|-----------|-----------------|-------|

### Novos Necessários (Y itens)
| Componente | Complexidade | Prioridade |
|-----------|--------------|------------|

## Mapeamento de Tokens

### Cores (X mapeadas, Y gaps)
[Tabela]

### Tipografia (X mapeadas, Y gaps)
[Tabela]

### Espaçamento (alinhado à escala)
[Tabela]

## Resumo de Gaps

| Prioridade | Quantidade | Itens |
|------------|------------|-------|
| Alta | X | [Lista] |
| Média | Y | [Lista] |
| Baixa | Z | [Lista] |

## Estimativa de Implementação

- Componentes para reusar: X%
- Novos componentes necessários: Y
- Gaps de tokens a resolver: Z
- Complexidade estimada: [Baixa/Média/Alta]

## Recomendações

1. [Recomendação 1]
2. [Recomendação 2]
3. [Recomendação 3]
```

## Exemplo

```
/skill-figma-audit https://figma.com/design/abc123

=== Relatório de Auditoria Figma ===

Visão Geral do Design:
- Arquivo: "Landing Page E-commerce"
- Frames: 3 (Hero, Produtos, Footer)
- Elementos: 47

Inventário de Componentes:
- Reutilizáveis: 12 (Button, Card, Input, Badge, Avatar...)
- Novos Necessários: 2 (ProductCarousel, FilterPanel)

Mapeamento de Tokens:
- Cores: 8/10 mapeadas (2 gaps)
- Tipografia: 5/5 mapeadas
- Espaçamento: Todos alinhados à escala

Gaps:
- ALTA: Componente ProductCarousel necessário
- MÉDIA: Cor #F5A623 não está nos tokens
- BAIXA: Radius 10px não é padrão (usar 8 ou 12)

Recomendações:
1. Criar ProductCarousel antes da implementação
2. Decidir sobre token de cor warning
3. Alinhar radius não-padrão para 8px ou 12px
```

## Referência

- Mapeamento de componentes: `skill-figma-component-mapping`
- Mapeamento de tokens: `skill-figma-design-tokens`
- Componentes do projeto: `src/components/`
- Tokens do projeto: `src/theme/` (consultar arquivos CSS diretamente)
