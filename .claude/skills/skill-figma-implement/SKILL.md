---
name: skill-figma-implement
description: |
  Use este skill quando o usuário pedir para "implementar do Figma", "converter Figma para código",
  "codar este design", ou compartilhar URL do Figma querendo converter para código React/Next.js.
  Implementa design usando componentes e tokens existentes do projeto.
argument-hint: <figma-url>
model: opus
user-invocable: true
---

# /skill-figma-implement

Implementa design do Figma como componentes React/Next.js usando componentes e design tokens existentes do projeto.

## Uso

```
/skill-figma-implement <figma-url>
```

## Argumentos

- `$ARGUMENTS` - URL do Figma ou referência de seleção

## Workflow

### Passo 1: Parse da URL

Extrair `fileKey` e `nodeId` da URL do Figma:
```
https://figma.com/design/{fileKey}?node-id={nodeId}
```

### Passo 2: Obter Contexto do Design

Usar ferramentas Figma MCP para extrair informações do design:

1. `get_design_context` - Obter estrutura do design
2. `get_screenshot` - Obter referência visual
3. `get_variable_defs` - Obter tokens do Figma

### Passo 2.5: Analisar Contexto do Container Pai (OBRIGATÓRIO)

**ANTES de escrever qualquer CSS, verificar onde o componente será inserido.**

1. **Ler CSS do container pai:**
   ```bash
   cat src/app/.../page.tsx          # Ver estrutura da página
   cat src/app/.../styles.module.css # Ver CSS existente
   ```

2. **Verificar se já existe no pai:**
   - Padding lateral?
   - Gap entre seções?
   - Max-width definido?

3. **Regra de não-duplicação:**
   | Se o pai tem... | O filho NÃO adiciona... |
   |-----------------|-------------------------|
   | `padding` lateral | padding lateral próprio |
   | `gap` entre filhos | margin-top/bottom |
   | `max-width` | max-width (usar `width: 100%`) |

4. **Documentar a decisão:**
   > "Container pai tem padding de 24px, portanto não adiciono padding lateral."
   > "Seção anterior tem margin-bottom, ajustando gap para evitar duplicação."

### Passo 3: Analisar Projeto

Antes de implementar, analisar o projeto:

1. Ler `CLAUDE.md` para convenções do projeto
2. Localizar pasta do tema (`fd -t d "theme" src/`) e ler tokens disponíveis
3. Listar componentes existentes em `src/components/`

### Passo 4: Mapear Componentes

Para cada elemento do Figma, seguir a hierarquia de decisão:

1. **Componente exato existe?** -> Usar diretamente
2. **Componente similar existe?** -> Usar com props
3. **Pode compor existentes?** -> Criar composição
4. **Pode estender?** -> Propor nova prop (registrar gap)
5. **Nenhuma opção?** -> Criar novo (última opção)

Usar `skill-figma-component-mapping` para mapeamento detalhado.

### Passo 5: Mapear Tokens

**SEMPRE ler os arquivos do tema antes de mapear.**

1. Localizar pasta do tema: `fd -t d "theme" src/`
2. Ler tokens disponíveis: `cat src/theme/tokens/*.css`
3. Ler classes de tipografia: `cat src/theme/class/typography.css`

Mapear estilos do Figma para tokens existentes no projeto.
Se não encontrar a pasta do tema, pergunte ao usuário.

Usar `skill-figma-design-tokens` para processo detalhado.

### Passo 6: Converter Auto Layout

Converter Auto Layout do Figma para CSS:

| Auto Layout | CSS |
|-------------|-----|
| Direction Horizontal | `flex-direction: row` |
| Direction Vertical | `flex-direction: column` |
| Gap | `gap: Xpx` |
| Padding | `padding: Xpx` |
| Space between | `justify-content: space-between` |
| Center | `justify-content: center` |
| Fill | `flex: 1` |
| Hug | `width: fit-content` |

### Passo 7: Processar Assets

Para ícones e imagens do Figma:

**Ícones:**
- Exportar como SVG
- Salvar em `src/assets/icons/`
- Remover metadados desnecessários

**Imagens:**
- Exportar como WebP
- Salvar em `public/images/`
- Usar `next/image` com dimensões corretas

### Passo 8: Implementar Código

Criar estrutura de componente:
```
ComponentName/
├── index.tsx
├── types.ts
└── styles.module.css
```

Seguir padrões do projeto:
- Importar CSS como `S`
- Usar `clsx` para múltiplas classes
- Types em arquivo separado
- Componentes auto-contidos

### Passo 9: Validar (PÁGINA INTEIRA)

**CRÍTICO: Validar a página inteira, não só o componente alterado!**

1. Usar `skill-figma-visual-loop` para loop de validação
2. Rodar checklist de `skill-figma-visual-validation`

**Verificações obrigatórias antes de declarar aprovado:**
- [ ] Ordem das seções na página corresponde ao Figma?
- [ ] Não há seções duplicadas ou faltando?
- [ ] Conteúdo de CADA seção confere (títulos, subtítulos, listas, botões)?
- [ ] Larguras de elementos de texto (max-width, quebra de linha)?
- [ ] Espaçamentos verticais entre seções?
- [ ] Ícones corretos em cada seção?
- [ ] Número de botões em cada seção?

**NUNCA declarar "aprovado" após verificar apenas uma coisa.**
**SEMPRE perguntar ao usuário se há mais diferenças antes de finalizar.**

### Passo 10: Rodar QA

Executar validação obrigatória:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Atualizar gap log se alguma exceção foi feita.

## Output

Após implementação:

1. Lista de arquivos criados/modificados
2. Componentes reusados vs criados
3. Gap log com exceções
4. Resultados da validação

## Exemplo

```
/skill-figma-implement https://figma.com/design/abc123?node-id=1-2

Processando design do Figma...

1. Contexto do Design:
   - Frame: "Seção Hero"
   - Tamanho: 1440x600
   - Elementos: 5

2. Mapeamento de Componentes:
   - Button (existente) -> atoms/Button
   - Heading (existente) -> classe de tipografia do tema
   - Container (novo) -> criado HeroSection

3. Mapeamento de Tokens:
   - Cores -> tokens de src/theme/tokens/colors.css
   - Radius -> tokens de src/theme/tokens/radius.css
   - Tipografia -> classes de src/theme/class/typography.css

4. Arquivos Criados:
   - src/components/organisms/HeroSection/index.tsx
   - src/components/organisms/HeroSection/types.ts
   - src/components/organisms/HeroSection/styles.module.css

5. Validação:
   - lint: PASS
   - typecheck: PASS
   - tests: PASS

6. Gap Log:
   - G001: Novo token de gradiente necessário (--gradient-hero)
```

## Referência

- Mapeamento de componentes: `skill-figma-component-mapping`
- Mapeamento de tokens: `skill-figma-design-tokens`
- Loop de validação: `skill-figma-visual-loop`
- Checklist de validação: `skill-figma-visual-validation`
- Verificações de QA: `skill-figma-to-code-qa`
