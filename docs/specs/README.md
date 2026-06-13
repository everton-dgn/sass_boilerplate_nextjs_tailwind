# Especificações de Features

Documentação de features antes e durante o desenvolvimento.

## Ciclo de vida

```
Ideia → in-progress/ → Desenvolvimento → done/
```

1. **Nova feature**: Criar `.md` em `in-progress/` usando o template abaixo
2. **Durante desenvolvimento**: Atualizar conforme decisões são tomadas
3. **Feature pronta**: Mover para `done/` e atualizar
   `docs/reference/features.md`

## Estrutura dos diretórios

| Diretório       | Conteúdo                                    |
|-----------------|---------------------------------------------|
| `in-progress/`  | Features em planejamento ou desenvolvimento |
| `done/`         | Features implementadas (referência futura)  |

## Template

```markdown
# SPEC-XXX: Nome da Feature

## Resumo

Descrição em 1-2 frases do que a feature faz e por que existe.

## Contexto

- Problema que resolve
- Quem se beneficia (persona/role)
- Links relevantes (issues, discussões, referências)

## Requisitos

### Funcionais

- [ ] Requisito 1
- [ ] Requisito 2

### Não-funcionais

- [ ] Performance: ...
- [ ] Acessibilidade: ...
- [ ] Responsividade: ...

## Design

Wireframes, mockups ou descrição visual da interface.
Referenciar `docs/reference/styleguide.md` para padrões visuais.

## Regras relacionadas

Links para regras em `docs/rules/` que se aplicam.

## Critérios de aceite

- [ ] Critério 1
- [ ] Critério 2

## Decisões técnicas

Decisões tomadas durante o desenvolvimento.
Se relevante, criar ADR em `docs/decisions/`.

## Escopo fora

O que explicitamente **não** faz parte desta feature.
```

## Convenções

- **ID**: `SPEC-` + número sequencial (ex: `SPEC-001`)
- **Nome do arquivo**: `SPEC-XXX-nome-curto.md` (ex: `SPEC-001-auth-flow.md`)
- **Checklist**: Usar `- [ ]` para requisitos e critérios — marcar conforme
  progride
- **Escopo fora**: Sempre documentar para evitar scope creep
