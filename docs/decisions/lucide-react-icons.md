# lucide-react para ícones

**Situação**: Aceita

## Contexto

O projeto precisa de um conjunto consistente de ícones. shadcn/ui usa
lucide-react por padrão.

## Decisão

Usar lucide-react como biblioteca de ícones padrão. Alinhada com o ecossistema
shadcn/ui, sem necessidade de substituições manuais após
`npx shadcn@latest add`.

## Alternativas rejeitadas

- **@tabler/icons-react** — rejeitada: exigia substituição manual em cada
  componente shadcn gerado.
- **Ícones SVG customizados** — rejeitada: sobrecarga de manutenção.

## Consequências

Estilo de ícones consistente. Imports com tree-shaking mantêm o bundle
pequeno. Zero fricção com shadcn CLI.
