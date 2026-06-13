---
name: skill-evolutionary-architecture
description: |
  Use este skill quando o usuário pedir para "evoluir arquitetura", "mudança incremental",
  "fitness function", "refatorar sem quebrar", "migração gradual", ou mencionar
  evolução arquitetural, mudanças incrementais ou evitar reescritas big-bang.
  Cobre decisões incrementais, fitness functions, refatoração segura, trade-offs.
model: opus
---

# Evolutionary Architecture

## Objetivo
Arquitetura evolutiva - decisões incrementais, fitness functions, refatoração segura, trade-offs.

## Quando usar
- Ao planejar mudanças incrementais de arquitetura.
- Ao definir fitness functions e guardrails técnicos.
- Ao evoluir sistemas sem big-bang rewrite.

## Princípios

### Last Responsible Moment

Adiar decisões até ter informação suficiente:

```
❌ Dia 1: "Vamos usar microservices!"
✅ Dia 1: "Vamos começar modular, extrair depois"

❌ "Precisamos de Kubernetes"
✅ "Vamos deployar simples, escalar quando precisar"
```

### YAGNI (You Aren't Gonna Need It)

```typescript
// ❌ Over-engineering
const createUserFactory = (CONFIG: UserFactoryConfig) => {
  return new UserFactoryBuilder()
    .withValidation(CONFIG.validation)
    .withTransformation(CONFIG.transform)
    .build()
}

// ✅ Simples até precisar
const createUser = (data: CreateUserInput) => ({
  id: generateId(),
  ...data,
})
```

### Fitness Functions

Métricas automatizadas que validam arquitetura:

```typescript
// Teste de dependência cíclica
test('no circular dependencies', () => {
  const cycles = detectCycles(importGraph)
  expect(cycles).toHaveLength(0)
})

// Teste de acoplamento
test('presentation does not import from routes', () => {
  const imports = getImports('src/presentation/**')
  const routeImports = imports.filter((i) => i.includes('routes/'))
  expect(routeImports).toHaveLength(0)
})

// Teste de performance
test('bundle size under limit', () => {
  const size = getBundleSize()
  expect(size).toBeLessThan(500_000) // 500KB
})
```

## Refatoração Incremental

### Strangler Fig Pattern

```
Fase 1: Nova feature no novo padrão
┌─────────────────────────────┐
│ Sistema Legado              │
│ ┌─────────────────────────┐ │
│ │ Nova Feature (novo)     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Fase 2: Migrar funcionalidades
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ Novo Sistema            │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ Legado (reduzindo)  │ │ │
│ │ └─────────────────────┘ │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Fase 3: Remover legado
┌─────────────────────────────┐
│ Novo Sistema (100%)         │
└─────────────────────────────┘
```

### Branch by Abstraction

```typescript
// 1. Criar abstração
type PaymentGateway = {
  charge: (amount: Money) => Promise<Payment>
}

// 2. Implementar antiga
const stripeGateway: PaymentGateway = { /* ... */ }

// 3. Implementar nova
const newGateway: PaymentGateway = { /* ... */ }

// 4. Feature flag
const getPaymentGateway = (): PaymentGateway =>
  featureFlags.useNewPayment ? newGateway : stripeGateway

// 5. Remover antiga quando estável
```

## Trade-offs

### Documentar decisões (ADR)

```markdown
# ADR-001: Usar SolidStart para SSR

## Status
Aceito

## Contexto
Precisamos de SSR para SEO e performance inicial.

## Decisão
Usar SolidStart com Solid.js.

## Consequências
✅ SSR nativo
✅ Hidratação eficiente
✅ File-based routing
⚠️ Ecossistema menor que React
⚠️ Menos bibliotecas prontas
```

### Matriz de decisão

| Critério | Opção A | Opção B | Peso |
|----------|---------|---------|------|
| Performance | ⭐⭐⭐ | ⭐⭐ | 3 |
| Manutenção | ⭐⭐ | ⭐⭐⭐ | 2 |
| Time-to-market | ⭐ | ⭐⭐⭐ | 1 |
| **Total** | **13** | **14** | - |

## Modularização

### Boundaries claros

```
src/
├── modules/
│   ├── auth/           # Autenticação
│   │   ├── index.ts    # API pública
│   │   ├── internal/   # Implementação
│   │   └── types.ts
│   ├── blog/           # Blog
│   │   ├── index.ts
│   │   └── internal/
│   └── shared/         # Compartilhado
│       └── index.ts
```

### Regras de dependência

```
✅ auth → shared
✅ blog → shared
❌ auth → blog (diretamente)
❌ shared → auth
```

## Evolução Segura

### Feature Flags

```typescript
const featureFlags = {
  newCheckout: process.env.FF_NEW_CHECKOUT === 'true',
  darkMode: process.env.FF_DARK_MODE === 'true',
}

// Uso
const CheckoutPage = () => {
  if (featureFlags.newCheckout) {
    return <NewCheckout />
  }
  return <LegacyCheckout />
}
```

### Canary Releases

```
1% → 5% → 25% → 50% → 100%

Cada fase: monitorar erros, performance, feedback
Rollback se métricas degradarem
```

## Checklist

- [ ] Decisões adiadas até necessário
- [ ] YAGNI aplicado
- [ ] Fitness functions automatizadas
- [ ] ADRs documentados
- [ ] Módulos com boundaries claros
- [ ] Feature flags para mudanças grandes
- [ ] Refatoração incremental
