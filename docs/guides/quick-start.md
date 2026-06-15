# Início rápido

Este guia cobre o mínimo para rodar o boilerplate e entender a configuração.

## Requisitos

- Node 24.x (veja `engines` em `package.json`).
- pnpm (via Corepack, usando a versão em `packageManager`).

## Configuração

```bash
corepack enable
pnpm install
```

Se `pnpm install` falhar com erro de versão, sua versão de Node ou pnpm está
fora da faixa. Verifique as versões:

```bash
node -v
pnpm -v
```

## Desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

Durante o desenvolvimento, mantenha o retorno rápido:

```bash
pnpm typecheck && pnpm lint
```

## Pipeline de qualidade

Execute antes de cada commit:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Estrutura do projeto

```
project/
├── src/                    Código-fonte
│   ├── app/                Rotas (App Router)
│   │   └── (home)/         Página inicial
│   ├── components/         Atomic Design (atoms, molecules, organisms)
│   ├── constants/          Schemas de ambiente e configurações
│   ├── hooks/              React hooks customizados
│   ├── helpers/            Utilitários compartilhados
│   ├── infra/              Infraestrutura (adapters + store base)
│   ├── tests/              Testes E2E e utilitários
│   └── theme/              Configuração de fontes
├── docs/                   Documentação
│   ├── guides/             Como fazer (tarefas)
│   ├── reference/          Consulta técnica
│   ├── decisions/          ADRs (decisões arquiteturais)
│   └── rules/              Regras de domínio, aplicação e experiência
├── package.json
└── ...
```

## Próximos passos

- Arquitetura: `../reference/architecture.md`
- Convenções: `../reference/conventions/`
- Funcionalidades: `../reference/features.md`
- Restrições de qualidade: `../reference/quality-constraints.md`
- Fluxos de trabalho: `./workflows.md`
- Regras: `../rules/`
- Perguntas frequentes: `./faq.md`
