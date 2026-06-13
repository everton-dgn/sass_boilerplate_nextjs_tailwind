# shadcn/ui + Tailwind CSS v4 como pilha de UI

**Situação**: Aceita (substitui decisão anterior sobre Mantine)

## Contexto

O projeto usava Mantine + CSS Modules. A migração para shadcn/ui + Tailwind
CSS v4 foi motivada por: melhor ecossistema, componentes mais leves (Radix),
CSS baseado em utilitários sem runtime, e melhor integração com o
ecossistema Next.js/React.

## Decisão

Usar shadcn/ui (componentes Radix + TV) com Tailwind CSS v4 (configuração
orientada a CSS), Sonner para notificações e next-themes para modo escuro.

## Alternativas rejeitadas

- **Mantine** (anterior) — substituída: bundle maior, ecossistema menor, CSS
  Modules adicionam complexidade desnecessária.
- **Headless UI** — rejeitada: muito baixo nível, exige esforço significativo.

## Consequências

Componentes leves com zero CSS em tempo de execução. Tailwind v4 inclui
autoprefixer, imports e aninhamento nativamente. Configuração PostCSS mínima
(`@tailwindcss/postcss` apenas).
