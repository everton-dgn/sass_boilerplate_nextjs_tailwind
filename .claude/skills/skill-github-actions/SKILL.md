---
name: skill-github-actions
description: |
  Use este skill quando o usuário pedir para "criar workflow", "configurar CI",
  "GitHub Actions", "automatizar testes", "configurar cache", "matrix de versões",
  ou mencionar CI/CD, testes automatizados, pipelines de build ou secrets do GitHub.
  Cobre workflows de CI, cache de dependências, matrix de versões, secrets.
model: opus
---

# GitHub Actions

## Objetivo
GitHub Actions - workflows de CI, cache de dependências, matrix de versões, secrets.

## Quando usar
- Ao criar workflows de CI/CD.
- Ao configurar cache, matrix e secrets.
- Ao automatizar testes, lint e build.

## Workflow Básico

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

## Cache de Dependências

```yaml
- name: Get pnpm store directory
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

## Matrix de Versões

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: pnpm test
```

## Secrets e Variáveis

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  NODE_ENV: production

steps:
  - name: Deploy
    run: echo "Deploying to ${{ vars.DEPLOY_TARGET }}"
    env:
      API_KEY: ${{ secrets.API_KEY }}
```

## Checklist

- [ ] Lint automático
- [ ] Type check
- [ ] Testes
- [ ] Build
- [ ] Cache de dependências
