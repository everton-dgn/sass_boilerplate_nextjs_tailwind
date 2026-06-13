# Troubleshooting - Visual Loop

## Erros Comuns - NÃO FAZER

### Erro 1: Instalar Playwright manualmente
```bash
# ❌ ERRADO
pip install playwright

# ✅ CORRETO - usar MCP
mcp__playwright__browser_take_screenshot(...)
```

### Erro 2: Usar Figma API com token
```bash
# ❌ ERRADO
export FIGMA_ACCESS_TOKEN="..."

# ✅ CORRETO - usar MCP
mcp__figma__get_screenshot(...)
```

### Erro 3: Criar scripts de exportação do Figma
```bash
# ❌ ERRADO
python scripts/export_figma.py ...

# ✅ CORRETO
# Usar MCP ou pedir ao usuário exportar manualmente
```

### Erro 4: Não solicitar URL do Figma
```
# ❌ ERRADO
"Vou fazer validação visual..." [sem URL]

# ✅ CORRETO
"Preciso da URL do Figma com node-id. Pode compartilhar?"
```

### Erro 5: Assumir path do Playwright MCP
```
# ❌ ERRADO
filename=".claude/images/x.png"
# procurar em .claude/images/x.png

# ✅ CORRETO
# Arquivo em: .playwright-mcp/.claude/images/x.png
```

### Erro 6: Não executar em loop
```
# ❌ ERRADO
[captura] → [analisa] → "Concluído!"

# ✅ CORRETO
[captura] → [analisa] → [corrige] → [captura] → ... → [PASS]
```

---

## Limitações

### Figma MCP
- Retorna imagem **inline** (base64)
- Não salva como arquivo automaticamente
- Para Python: pedir exportação manual ao usuário

### Claude Vision (VLM)
| Faz bem | Faz mal |
|---------|---------|
| ✅ Contar elementos | ❌ Medir distâncias |
| ✅ Identificar ordem | ❌ Detectar desalinhamentos sutis |
| ✅ Verificar texto | ❌ Comparar tamanhos relativos |
| ✅ Reconhecer padrões | ❌ Verificar espaçamentos |

### Script Python
| Limitação | Mitigação |
|-----------|-----------|
| Sensível a antialiasing | Tolerância configurável |
| Não entende contexto | Usar Claude Vision junto |
| Falsos positivos em fontes | Verificar se é rendering |

---

## Critérios de Parada

| Condição | Ação |
|----------|------|
| APROVADO + usuário confirma | ✅ Finalizar |
| 10 iterações atingidas | ⚠️ Escalar |
| Mesmo problema 2x | ⚠️ Mudar abordagem |
| 3 iterações sem melhoria | ⚠️ Stagnation |
