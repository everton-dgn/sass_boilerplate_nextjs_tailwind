# Atomic Design para organização de componentes

**Situação**: Aceita

## Contexto

O projeto precisa de uma estratégia escalável de organização de componentes.

## Decisão

Usar Atomic Design com três níveis: atoms, molecules, organisms.

## Alternativas rejeitadas

- **Pastas baseadas em funcionalidades** — rejeitada: hierarquia menos clara
  para componentes compartilhados.
- **Estrutura plana** — rejeitada: não escala conforme a quantidade de
  componentes cresce.

## Consequências

Direção de dependência clara (atoms ← molecules ← organisms). Fácil encontrar
e reutilizar componentes.
