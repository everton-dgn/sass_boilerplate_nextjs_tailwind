# Documentação

Índice da documentação do SaaS Boilerplate, organizada pelo framework
Diátaxis.

## Estrutura

```
docs/
├── guides/              # Como fazer (orientado a tarefas)
├── reference/           # Consulta técnica (orientado a informação)
├── decisions/           # ADRs (por quê decidimos)
├── rules/               # Regras (o que deve ser respeitado)
└── specs/               # Especificações (o que será construído)
```

## Guias — "Como eu faço X?"

| Documento | Descrição |
|-----------|-----------|
| [Início rápido](./guides/quick-start.md) | Configuração inicial e primeira execução |
| [Fluxos de trabalho](./guides/workflows.md) | Como adicionar componentes, hooks, páginas e lançamentos |
| [Perguntas frequentes](./guides/faq.md) | Problemas comuns com pnpm, Biome, Playwright e testes |
| [Solução de problemas](./guides/troubleshooting-platforms.md) | Correções para Linux, macOS e CI |

## Referência — "Como funciona X?"

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](./reference/architecture.md) | Estrutura de camadas, App Router e convenções |
| [Convenções](./reference/conventions/) | Padrões de implementação: services, stores, API routes, nomenclatura |
| [Funcionalidades](./reference/features.md) | Notes CRUD, modo escuro, toast, validação de ambiente, React Query |
| [Restrições de qualidade](./reference/quality-constraints.md) | Regras de código, estilização e ferramentas de lint |
| [Guia de estilo](./reference/styleguide.md) | Cores, tipografia, espaçamento e acessibilidade |

## Decisões — "Por que escolhemos X?"

| Documento | Descrição |
|-----------|-----------|
| [Índice de ADRs](./decisions/) | Registro de todas as decisões arquiteturais |

## Regras — "O que deve ser respeitado?"

| Categoria | Descrição |
|-----------|-----------|
| [Negócio](./rules/business/) | Planos, billing, limites, assinaturas |
| [Aplicação](./rules/application/) | Autenticação, validação, erros, rate limiting |
| [Produto](./rules/product/) | Funcionalidades, permissões, fluxos, onboarding |

## Especificações — "O que será construído?"

| Diretório | Descrição |
|-----------|-----------|
| [Em andamento](./specs/in-progress/) | Features em planejamento ou desenvolvimento |
| [Concluídas](./specs/done/) | Features implementadas (referência) |
