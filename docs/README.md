# Documentação

Índice da documentação do projeto, organizada pelo framework Diátaxis.

## Estrutura

```
docs/
├── guides/              # Como fazer (orientado a tarefas)
├── reference/           # Consulta técnica (orientado a informação)
├── decisions/           # ADRs (por quê decidimos)
└── rules/               # Regras (o que deve ser respeitado)
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
| [Convenções](./reference/conventions/) | Padrões de implementação para UI, infraestrutura, services e nomenclatura |
| [Funcionalidades](./reference/features.md) | Base de UI, modo escuro, toast, validação de ambiente e React Query |
| [Restrições de qualidade](./reference/quality-constraints.md) | Regras de código, estilização e ferramentas de lint |
| [Guia de estilo](./reference/styleguide.md) | Cores, tipografia, espaçamento e acessibilidade |

## Decisões — "Por que escolhemos X?"

| Documento | Descrição |
|-----------|-----------|
| [Índice de ADRs](./decisions/) | Registro de todas as decisões arquiteturais |

## Regras — "O que deve ser respeitado?"

| Categoria | Descrição |
|-----------|-----------|
| [Domínio](./rules/business/) | Regras do negócio ou problema atendido |
| [Aplicação](./rules/application/) | Regras técnicas, segurança, erros e integrações |
| [Experiência](./rules/product/) | Regras de interface, permissões e fluxos |
