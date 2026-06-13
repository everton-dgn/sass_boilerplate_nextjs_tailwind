# Ferramentas - Visual Loop

## MCPs Disponíveis (JÁ CONFIGURADOS)

### Figma MCP

```
mcp__figma__get_screenshot(
  fileKey="xxx",           # da URL: figma.com/design/{fileKey}/...
  nodeId="123:456",        # da URL: ?node-id=123-456 (trocar - por :)
  clientLanguages="typescript,css",
  clientFrameworks="react,nextjs"
)
```

**Retorno**: Imagem inline (não salva arquivo)

### Playwright MCP (RECOMENDADO para browser)

```
# 1. Navegar
mcp__playwright__browser_navigate(url="http://localhost:3000/...")

# 2. Obter refs dos elementos
mcp__playwright__browser_snapshot()

# 3. Capturar seção específica (SALVA ARQUIVO)
mcp__playwright__browser_take_screenshot(
  ref="e117",
  element="Section name",
  filename=".claude/images/browser-section.png",
  type="png"
)
# Arquivo em: .playwright-mcp/.claude/images/browser-section.png
```

### Claude in Chrome (alternativa)

```
mcp__claude-in-chrome__tabs_context_mcp()
mcp__claude-in-chrome__navigate(url="...", tabId=123)
mcp__claude-in-chrome__computer(action="screenshot", tabId=123)
```

**Retorno**: Imagem inline (não salva arquivo)

---

## Scripts Python

### visual_compare.py (RECOMENDADO)

**Workflow completo automatizado - lida com proporções diferentes.**

```bash
VENV=.claude/skills/skill-figma-visual-loop/scripts/.venv
SCRIPT=.claude/skills/skill-figma-visual-loop/scripts/visual_compare.py

# Comparação completa (alinha + redimensiona + compara)
$VENV/bin/python3 $SCRIPT figma.png browser.png

# Com preset específico
$VENV/bin/python3 $SCRIPT figma.png browser.png --preset strict

# Salvar em diretório específico
$VENV/bin/python3 $SCRIPT figma.png browser.png -o .claude/images/comparison
```

**O script automatiza:**
1. Alinhamento inteligente (feature matching / template matching)
2. Redimensionamento automático (max 4096px)
3. Comparação com métricas
4. Geração de diff visual e relatório HTML

### align_images.py

**Apenas alinhamento (sem comparação).**

```bash
SCRIPT=.claude/skills/skill-figma-visual-loop/scripts/align_images.py

$VENV/bin/python3 $SCRIPT figma.png browser.png --json
```

### compare_images.py

**Apenas comparação (imagens devem ter mesmo tamanho).**

```bash
SCRIPT=.claude/skills/skill-figma-visual-loop/scripts/compare_images.py

$VENV/bin/python3 $SCRIPT figma.png browser.png \
  --preset strict \
  --diff-out diff.png \
  --html-report report.html
```

### Flags

| Flag | Descrição |
|------|-----------|
| `--preset` | strict / normal / loose |
| `--diff-out` | Heatmap com bounding boxes |
| `--html-report` | Relatório HTML interativo |
| `--auto-align` | Auto-alinhar (compare_images.py) |
| `--ignore-regions` | JSON de regiões a ignorar |

---

## Setup do Python (uma vez)

```bash
cd .claude/skills/skill-figma-visual-loop/scripts
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
