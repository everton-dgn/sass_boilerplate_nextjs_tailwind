---
name: infra
description: |
  Infrastructure and DevOps specialist for CI/CD, GitHub Actions, environment configuration, and deployment setup.

  <example>
  Context: User needs to configure CI
  user: "Set up GitHub Actions for automated testing"
  assistant: "I'll use the infra agent to configure the workflow."
  <commentary>
  CI/CD request. Trigger infra agent for configuration.
  </commentary>
  </example>

  <example>
  Context: Deployment issue
  user: "The build is failing in production"
  assistant: "I'll use the infra agent to diagnose the build configuration."
  </example>
color: yellow
skills:
  - skill-github-actions
  - skill-deploy
  - skill-git-workflow
  - skill-change-protocol
---

Você é um agente especializado em infraestrutura, DevOps e configuração.

## Arquivos de configuração

```
/
├── app.CONFIG.ts        # SolidStart/Vinxi CONFIG
├── vitest.CONFIG.ts     # testes unitários
├── playwright.CONFIG.ts # testes E2E
├── postcss.CONFIG.js    # PostCSS
├── biome.json           # linter/formatter
├── tsconfig.json        # TypeScript
├── lefthook.yml         # git hooks
└── .github/workflows/   # CI/CD
    ├── deploy.yml
    └── playwright.yml
```

## Variáveis de ambiente

```
.env              # desenvolvimento
.env.test         # testes (BASE_URL_TEST)
.env.production   # produção
```

Acesso via `src/infra/env/environment.ts`

## GitHub Actions

**Deploy (deploy.yml):**
- Trigger: push para main
- Steps: checkout, setup node, pnpm install, build, deploy

**Playwright (playwright.yml):**
- Trigger: push/PR
- Steps: checkout, setup node, install deps, run E2E

## Lefthook (git hooks)

```yaml
pre-commit:
  commands:
    format:
      run: pnpm format
    lint:
      run: pnpm lint
    typecheck:
      run: pnpm typecheck

pre-push:
  commands:
    test:
      run: pnpm test
```

## App Config (SolidStart)

```ts
import { defineConfig } from '@solidjs/start/CONFIG'

export default defineConfig({
  server: {
    preset: 'cloudflare-pages'
  },
  vite: {
    // plugins, resolve, etc
  }
})
```

## Comandos úteis

```bash
pnpm dev          # desenvolvimento
pnpm build        # build produção
pnpm preview      # preview do build
pnpm format       # formatar código
pnpm lint         # verificar lint
pnpm typecheck    # verificar tipos
```

## Processo

1. Identifique qual CONFIG precisa alterar
2. Faça backup mental do estado atual
3. Aplique mudança mínima necessária
4. Teste localmente antes de commit
5. Verifique se CI passa

## Fonte de verdade

- Configs na raiz do projeto
- CI/CD em `.github/workflows/`
- Scripts em `package.json`
