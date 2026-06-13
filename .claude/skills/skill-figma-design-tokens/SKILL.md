---
name: skill-figma-design-tokens
description: |
  Use este skill quando o usuário pedir para "extrair tokens do Figma",
  "mapear cores do Figma", "converter estilos Figma para CSS", ou mencionar
  correspondência entre estilos do Figma e tokens CSS do projeto.
  Mapeia tokens de design do Figma para variáveis CSS, garantindo consistência visual.
model: opus
---

# Mapeamento de Design Tokens Figma

## Objetivo

Mapear estilos e variáveis do Figma para tokens CSS do projeto, garantindo consistência visual.

## Quando usar

- Ao extrair estilos de designs do Figma
- Ao converter cores, tipografia, espaçamento do Figma para CSS
- Ao validar se um token do Figma existe no projeto

## Localizar Pasta do Tema

**SEMPRE consultar os arquivos do tema antes de mapear tokens.**

### Buscar pasta do tema

```bash
# Procurar pasta de tokens/theme
fd -t d "theme" src/
fd -t d "tokens" src/
```

### Estrutura típica

```
src/theme/
├── tokens/
│   ├── colors.css      # Variáveis --color-*
│   ├── fonts.css       # Variáveis --font-*
│   ├── radius.css      # Variáveis --radius-*
│   ├── shadows.css     # Variáveis --shadow-*
│   ├── zIndex.css      # Variáveis --z-index-*
│   └── grids.css       # Variáveis de grid
└── class/
    ├── typography.css  # Classes text-*
    └── animations.css  # Classes de animação
```

**Se não encontrar a pasta do tema, pergunte ao usuário.**

## Processo de Mapeamento

### Passo 1: Ler tokens do projeto

Antes de mapear qualquer valor do Figma:

```bash
# Ler todos os tokens disponíveis
cat src/theme/tokens/*.css
cat src/theme/class/typography.css
```

### Passo 2: Extrair estilos do Figma

Usar `get_variable_defs` para obter tokens do Figma.

### Passo 3: Criar tabela de mapeamento

Para cada tipo de token, criar tabela Figma -> CSS baseada nos arquivos lidos.

### Passo 4: Registrar gaps

Documentar valores do Figma sem correspondência no projeto.

## Tipos de Tokens

### Cores

- Ler `tokens/colors.css` para ver variáveis `--color-*` disponíveis
- NUNCA hardcode valores hex
- Mapear para token existente mais próximo

### Tipografia

- Ler `class/typography.css` para ver classes `text-*` disponíveis
- Padrão típico: `text-{size}-{weight}` (ex: `text-16-medium`)
- NUNCA usar CSS customizado para fonte

### Border Radius

- Ler `tokens/radius.css` para ver variáveis `--radius-*` disponíveis
- Valores fora da escala devem usar o mais próximo

### Sombras

- Ler `tokens/shadows.css` para ver variáveis `--shadow-*` disponíveis

### Z-Index

- Ler `tokens/zIndex.css` para ver variáveis `--z-index-*` disponíveis
- NUNCA inventar valores de z-index

### Espaçamento

- Geralmente sem variáveis CSS - usar valores diretos em pixels
- Alinhar à escala do projeto (tipicamente 4/8/12/16/24/32/48/64)

## Template de Análise de Gaps

Quando Figma usa valores que não estão nos tokens do projeto:

```markdown
| Valor Figma | Token Mais Próximo | Ação |
|-------------|-------------------|------|
| #FF5733 | [consultar colors.css] | Usar mais próximo |
| 10px radius | [consultar radius.css] | Escolher mais próximo |
| 20px spacing | 16px ou 24px | Alinhar à escala |
```

## Checklist de Validação

- [ ] Pasta do tema localizada e arquivos lidos
- [ ] Todas as cores mapeadas para tokens existentes em `colors.css`
- [ ] Toda tipografia usa classes existentes em `typography.css`
- [ ] Todos os radius usam tokens existentes em `radius.css`
- [ ] Todas as sombras usam tokens existentes em `shadows.css`
- [ ] Z-index usa apenas tokens existentes em `zIndex.css`
- [ ] Espaçamento alinhado à escala do projeto
- [ ] Nenhum valor hardcoded inventado

## Registro de Gaps

Quando um token não existe:

```markdown
| ID | Tipo | Valor Figma | Proposta | Status |
|----|------|-------------|----------|--------|
| T001 | Cor | #FF5733 | Usar token existente X | Resolvido |
| T002 | Radius | 10px | Usar --radius-8 ou --radius-12 | Resolvido |
```

**Regras:**
- NUNCA criar novas CSS vars sem aprovação
- NUNCA inventar tokens que não existem
- Quando faltar token, usar existente mais próximo
- Registrar gap e propor extensão se necessário
