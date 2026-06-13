---
name: skill-deploy
description: |
  Use este skill quando o usuário pedir para "fazer deploy", "configurar deploy",
  "criar preview", "deploy para produção", "configurar Docker", "health check",
  ou mencionar pipelines CI/CD, ambientes staging/produção ou estratégias de rollback.
  Cobre preview em PR, produção, Docker multi-stage, health checks.
model: opus
---

# Deploy

## Objetivo
Deploy workflows - preview em PR, produção, Docker multi-stage, health checks.

## Quando usar
- Ao configurar pipelines de deploy e ambientes.
- Ao preparar preview e produção com rollback.
- Ao definir health checks e monitoramento.

## Preview em PR

```yaml
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Preview
        id: deploy
        run: |
          echo "url=https://preview-${{ github.event.pull_request.number }}.example.com" >> $GITHUB_OUTPUT

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: '🚀 Preview: ${{ steps.deploy.outputs.url }}'
            })
```

## Produção

```yaml
name: Production Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: pnpm build
      - name: Deploy
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: |
          # Deploy script
```

## Dockerfile Multi-stage

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Health Check

```typescript
export const GET = () => {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  })
}
```

## Checklist

- [ ] Deploy automático em main
- [ ] Preview em PRs
- [ ] Health checks
- [ ] Environment separado
- [ ] Secrets não no código
