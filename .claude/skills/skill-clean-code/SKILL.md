---
name: skill-clean-code
description: |
  Use este skill quando o usuário pedir para "melhorar código", "refatorar",
  "aplicar clean code", "renomear variáveis", "reduzir complexidade", "code smell",
  ou mencionar princípios SOLID, tamanho de funções, convenções de naming ou legibilidade.
  Cobre naming, funções pequenas, SOLID, code smells, refatoração segura.
model: opus
---

# Clean Code

## Objetivo
Princípios Clean Code - naming, funções pequenas, SOLID, code smells, refatoração.

## Quando usar
- Ao melhorar legibilidade e coesão de código.
- Ao revisar naming, função pequena e responsabilidades.
- Ao remover code smells com refatoração segura.

## Naming

### Variáveis

```typescript
// ❌ Obscuro
const d = new Date()
const arr = users.filter((u) => u.a)

// ✅ Revelador de intenção
const createdAt = new Date()
const activeUsers = users.filter((user) => user.isActive)
```

### Funções

```typescript
// ❌ Vago
const handle = () => {}
const process = (data) => {}

// ✅ Ação clara
const submitLoginForm = () => {}
const validateUserInput = (input) => {}
```

### Booleanos

```typescript
// ❌ Sem prefixo
const loading = true
const admin = user.role === 'admin'

// ✅ Prefixo is/has/can
const isLoading = true
const isAdmin = user.role === 'admin'
const hasPermission = checkPermission(user)
const canEdit = isAdmin && hasPermission
```

## Funções

### Pequenas e focadas

```typescript
// ❌ Faz muitas coisas
const processUser = (data) => {
  validate(data)
  const user = transform(data)
  save(user)
  sendEmail(user)
  log(user)
}

// ✅ Uma responsabilidade
const createUser = (data) => {
  const validated = validateUserData(data)
  const user = buildUser(validated)
  return saveUser(user)
}
```

### Poucos parâmetros

```typescript
// ❌ Muitos parâmetros
const createUser = (name, email, age, role, dept, manager) => {}

// ✅ Objeto de configuração
type CreateUserInput = {
  name: string
  email: string
  role: UserRole
}

const createUser = (input: CreateUserInput) => {}
```

### Early return

```typescript
// ❌ Nesting profundo
const processOrder = (order) => {
  if (order) {
    if (order.isValid) {
      if (order.items.length > 0) {
        // lógica
      }
    }
  }
}

// ✅ Guard clauses
const processOrder = (order) => {
  if (!order) return
  if (!order.isValid) return
  if (order.items.length === 0) return

  // lógica
}
```

## SOLID

### Single Responsibility

```typescript
// ❌ Faz muitas coisas
class UserService {
  createUser() {}
  sendEmail() {}
  generateReport() {}
  validateInput() {}
}

// ✅ Uma responsabilidade
class UserService { createUser() {} }
class EmailService { send() {} }
class ReportService { generate() {} }
```

### Open/Closed

```typescript
// ✅ Extensível sem modificar
type PaymentMethod = {
  process: (amount: number) => Promise<void>
}

const creditCard: PaymentMethod = {
  process: async (amount) => { /* ... */ }
}

const pix: PaymentMethod = {
  process: async (amount) => { /* ... */ }
}
```

### Dependency Inversion

```typescript
// ❌ Dependência concreta
const userService = new UserService(new PostgresDB())

// ✅ Dependência de abstração
type Database = {
  query: (sql: string) => Promise<unknown>
}

const createUserService = (db: Database) => ({
  findUser: (id) => db.query(`SELECT * FROM users WHERE id = ${id}`)
})
```

## Code Smells

| Smell | Solução |
|-------|---------|
| Função longa (> 20 linhas) | Extract function |
| Muitos parâmetros (> 3) | Parameter object |
| Código duplicado | Extract function/component |
| Nesting profundo | Early return |
| Comentários explicativos | Renomear/refatorar |
| Magic numbers | Constantes nomeadas |
| God class/component | Split |

## Refatoração

### Quando refatorar

- ✅ Antes de adicionar feature
- ✅ Ao corrigir bug
- ✅ Durante code review
- ❌ Por "melhorar"
- ❌ Sem testes

### Técnicas

```typescript
// Extract variable
// ❌
if (user.role === 'admin' && user.permissions.includes('delete')) {}

// ✅
const canDelete = user.role === 'admin' && user.permissions.includes('delete')
if (canDelete) {}

// Extract function
// ❌
const price = basePrice * (1 - discount) * (1 + tax)

// ✅
const calculateFinalPrice = (base, discount, tax) =>
  base * (1 - discount) * (1 + tax)
```

## Checklist

- [ ] Nomes revelam intenção
- [ ] Funções < 20 linhas
- [ ] Máximo 3 parâmetros
- [ ] Uma responsabilidade por função
- [ ] Sem nesting profundo
- [ ] Sem magic numbers
- [ ] Sem código duplicado
