---
name: skill-figma-extract
description: |
  Use este skill quando o usuário pedir para "extrair do Figma", "obter informações do Figma",
  "listar componentes do design", ou precisar extrair componentes, tokens, layout e assets
  de uma tela do Figma antes de implementar.
  Extrai tudo necessário para implementar uma tela - componentes, tokens, layout, assets.
model: opus
---

# Figma Extract

## Objetivo

Extrair do Figma MCP todas as informações necessárias para implementar uma nova tela.

## Inputs (perguntar se faltar)

- `FIGMA_URL`: URL do Figma com file key e node-id
- `TARGET_STACK`: Next.js + React + CSS Modules (padrão do projeto)

## Limitação de Tokens

**Aplica-se a `get_design_context`** (não a `get_metadata`).

| Escopo | `get_design_context` | `get_metadata` |
|--------|---------------------|----------------|
| Página inteira | ❌ Estoura (>25k tokens) | ✅ Funciona (~42k processável) |
| Seção específica | ✅ Funciona | ✅ Funciona |

**SEMPRE** usar `get_metadata` para página inteira, `get_design_context` apenas por seção.

---

## Fase 0: Mapa Estrutural (OBRIGATÓRIO para páginas)

### Quando usar

- URL aponta para PÁGINA (não componente individual)
- Frame com múltiplas seções
- Precisa entender contexto antes de implementar

### Regra de Ouro

| Escopo | Ferramenta | Permitido |
|--------|------------|-----------|
| Página inteira | `get_metadata` | ✅ USAR |
| Página inteira | `get_design_context` | ❌ PROIBIDO |
| Seção específica | `get_design_context` | ✅ USAR |

### Execução

1. Extrair `fileKey` e `nodeId` da URL do Figma
   - URL: `figma.com/design/{fileKey}/...?node-id={nodeId}`
   - **IMPORTANTE**: trocar `-` por `:` no nodeId (ex: `123-456` → `123:456`)
2. Chamar `get_metadata` para obter estrutura:
   ```
   mcp__figma__get_metadata(fileKey, nodeId)
   ```
3. Parsear XML para extrair seções de primeiro nível
4. Criar tabela de seções:

| ID | Nome | Y | Altura |
|----|------|---|--------|
| 10562:21618 | Hero | 114 | 914 |
| 10562:20453 | Dores | 1028 | 1060 |

### Output esperado

Lista de seções com:
- **Node ID** para chamadas subsequentes (`get_design_context`, `get_screenshot`)
- **Nome** (se disponível no Figma)
- **Posição Y** (para validar ordem)
- **Altura** (para estimar complexidade)

### Exemplo Real (testado)

URL: `figma.com/design/abc123?node-id=10562-20059`

```
get_metadata → XML com estrutura (42K tokens - processável)
```

Seções extraídas:
```
10562:20195 → Header (114px)
10562:21618 → Hero (914px)
10562:20453 → Dores (1060px)
10562:20497 → Benefícios (1226px)
```

---

## Extração via Figma MCP

### 1. Screenshot e Contexto (POR SEÇÃO)

```
mcp__figma__get_screenshot(fileKey, sectionNodeId)
mcp__figma__get_design_context(fileKey, sectionNodeId)
```

**NUNCA** passar nodeId da página inteira para `get_design_context`.

### 2. Coletar

| Item | O que extrair |
|------|---------------|
| **Componentes** | Nomes, variantes, props, origem do DS |
| **Tokens** | Cores, tipografia, spacing, radius, elevation |
| **Layout** | Auto-layout, constraints, grids, responsivo |
| **Interações** | Triggers, estados, transições |
| **Assets** | Ícones/imagens exportáveis, formatos |
| **Code Connect** | Mapeamentos existentes para código |

### 3. Code Connect (se disponível)

```
mcp__figma__get_code_connect_map(fileKey, nodeId)
```

## Output Estruturado

### Resumo

Breve descrição da tela/seção.

### Tabela de Assets

| Nome | Tipo | Uso | Formato | Link |
|------|------|-----|---------|------|
| icon-star | SVG | Destaque | svg | ... |

### Tabela de Tokens

| Categoria | Nome | Valor | Fonte |
|-----------|------|-------|-------|
| Color | --color-bg-primary | #1A1A1A | Variable |
| Spacing | gap | 16px | Auto Layout |

### Lista de Componentes

| Nome | Props/Variantes | Estados | Mapeamento DS |
|------|-----------------|---------|---------------|
| Button | variant: primary/secondary | hover, active, disabled | Button existente |
| Card | (criar novo) | - | - |

### Notas de Layout

- Container: flex column, gap 48px
- Hero: flex row em desktop, stack em mobile
- Grid: auto-fit minmax(300px, 1fr)

### Interações

- Hover nos cards: opacity 1, background change
- Click: navega para rota X

### Plano de Implementação

```
src/app/.../page.tsx
src/app/.../components/
├── HeroSection/
├── BenefitsGrid/
└── CTABanner/
```

### Questões Abertas

- [ ] Comportamento mobile não especificado
- [ ] Fonte do ícone X não identificada

## Regras

- Preferir tokens/variáveis sobre valores hardcoded
- Usar nomenclatura semântica do DS existente
- Não exportar formas simples que podem ser código
- Marcar claramente info faltante/ambígua
- Mapear para componentes existentes antes de criar novos

---

## Regras de Assets

O `get_design_context` retorna URLs temporárias (7 dias) para download de assets.

### Formato por Tipo de Asset

| Tipo | Formato | Exemplo |
|------|---------|---------|
| Ícones | SVG | Setas, logos, símbolos simples |
| Ilustrações complexas | WebP | Ilustrações com gradientes, muitas cores |
| Fotos/Imagens | WebP | Banners, fotos de pessoas |
| Fallback | PNG | Se WebP indisponível |

### Regras de Download

1. **Ícones** → Sempre SVG (vetorial, escalável)
2. **Imagens complexas** → Preferir WebP (melhor compressão)
3. **Se WebP não disponível** → PNG como fallback
4. **NUNCA usar JPG** para ícones ou ilustrações com transparência

### Destino dos Arquivos

| Tipo | Diretório |
|------|-----------|
| Ícones (SVG) | `src/assets/icons/` |
| Imagens de seção | `public/images/sections/{section-name}/` |
| Banners | `public/images/banners/{page-name}/` |

### Nomenclatura

- snake_case para arquivos (ex: `benefit_clarity.webp`)
- Prefixo semântico quando aplicável (ex: `icon_arrow_right.svg`)
