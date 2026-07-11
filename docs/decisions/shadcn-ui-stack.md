# shadcn/ui + Tailwind CSS v4 como pilha de UI

**Situação**: Aceita

## Contexto

O projeto precisa de uma pilha de UI leve, consistente e alinhada ao
ecossistema Next.js/React. shadcn/ui + Tailwind CSS v4 oferece componentes
Radix, composição por utilitários e baixa dependência de runtime.

## Decisão

Usar shadcn/ui (componentes Radix + TV) com Tailwind CSS v4 (configuração
orientada a CSS) e Sonner para notificações. O modo escuro, originalmente
implementado com next-themes, passou a usar um `ThemeProvider` próprio
(classe `.dark`, cookie e script anti-flash) — atualização de julho/2026.

## Alternativas rejeitadas

- **Mantine** — rejeitada: bundle maior e camada visual mais opinativa.
- **Headless UI** — rejeitada: muito baixo nível, exige esforço significativo.

## Consequências

Componentes leves com zero CSS em tempo de execução. Tailwind v4 inclui
autoprefixer, imports e aninhamento nativamente. Configuração PostCSS mínima
(`@tailwindcss/postcss` apenas).
