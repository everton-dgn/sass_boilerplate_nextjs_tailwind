---
name: skill-research-first
description: |
  Use este skill quando o usuário pedir para "pesquisar documentação", "verificar API",
  "como usar SDK", "configurar ferramenta externa", ou ao trabalhar com APIs,
  SDKs, CLIs desconhecidos, ferramentas externas ou comportamento específico de versão.
  Cobre pesquisa de documentação oficial antes de implementar.
model: opus
---

# Research First

## Objetivo
Pesquise documentação oficial antes de usar APIs, SDKs ou configurar ferramentas externas.

## Quando usar
- Antes de usar APIs/SDKs/CLIs desconhecidos.
- Ao configurar ferramentas externas ou integrações.
- Ao lidar com comportamento divergente de versões.

## Quando pesquisar

- APIs e SDKs externos
- Configs de ferramentas (hooks, CI/CD, headers HTTP)
- CLIs e flags desconhecidas
- Integrações com serviços terceiros

## Como pesquisar

1. **Cheque fontes locais primeiro**: README, `docs/`, `CHANGELOG`, exemplos e configs do repo.
2. **Se houver internet**: priorize documentação oficial + changelog da versão usada.
3. **Use ferramentas disponíveis**: `curl`/`wget`/browser ou MCP/Context7 quando aplicável.
4. **Se não encontrar**: peça links/referências ao usuário antes de assumir.

## Quando não encontrar

```
Não encontrei documentação oficial sobre [X].

Pesquisei:
- [fonte 1]
- [fonte 2]

Opções:
1. [Abordagem A] - baseada em [referência parcial]
2. [Abordagem B] - convenção comum
3. Você tem documentação ou referência específica?

Qual prefere?
```

## Anti-patterns

- Assumir que API/CONFIG funciona igual à versão anterior
- Supor parâmetros, flags ou opções que "parecem fazer sentido"
- Implementar baseado em tutoriais desatualizados

## Checklist

- [ ] Fonte oficial consultada e versão registrada
- [ ] Documentação local do repo conferida
- [ ] Decisões não documentadas confirmadas com o usuário
- [ ] Links/fonte listados na resposta quando aplicável
