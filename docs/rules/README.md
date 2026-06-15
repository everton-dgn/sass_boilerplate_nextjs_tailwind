# Regras

Catálogo centralizado de regras do sistema, organizadas por categoria.

## Categorias

| Categoria                        | Escopo                                           |
|----------------------------------|--------------------------------------------------|
| [Domínio](./business/)           | Regras do negócio ou problema atendido            |
| [Aplicação](./application/)      | Regras técnicas, segurança, erros e integrações   |
| [Experiência](./product/)        | Regras de interface, permissões e fluxos          |

## Como documentar regras

Cada regra segue o formato:

```markdown
### REGRA-XXX: Nome da regra

**Contexto**: Quando e por que esta regra se aplica.

**Regra**: Descrição clara e objetiva do comportamento esperado.

**Exemplos**:
- Caso válido: ...
- Caso inválido: ...

**Exceções**: Situações onde a regra não se aplica (se houver).
```

### Convenções

- **ID**: Prefixo por categoria (`DOM-`, `APP-`, `UX-`) + número sequencial
- **Idioma**: Português para documentação, inglês para identificadores
  no código
- **Granularidade**: Uma regra por comportamento. Se uma regra tem muitas
  exceções, considere dividir
- **Rastreabilidade**: Quando implementada, referencie o arquivo de código
  relevante

## Quando criar uma regra

- Comportamento que precisa ser consistente em toda a aplicação
- Decisão de domínio que impacta múltiplos fluxos
- Restrição que desenvolvedores precisam conhecer antes de implementar
- Lógica que já causou bugs por falta de documentação
