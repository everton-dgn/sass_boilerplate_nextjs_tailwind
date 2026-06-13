---
name: skill-ddd
description: |
  Use este skill quando o usuário pedir para "modelar domínio", "criar entidade",
  "value object", "agregado", "bounded context", "linguagem ubíqua", ou mencionar
  Domain-Driven Design, modelagem de domínio ou regras de negócio complexas.
  Cobre entidades, value objects, agregados, repositórios, bounded contexts.
model: opus
---

# Domain-Driven Design (DDD)

## Objetivo
Domain-Driven Design - entidades, value objects, agregados, repositórios, bounded contexts.

## Quando usar
- Ao modelar domínios complexos e suas regras.
- Ao definir entidades, VOs, agregados e repositórios.
- Ao separar bounded contexts e linguagem ubíqua.

## Conceitos Básicos

### Ubiquitous Language

Usar mesma linguagem no código e no negócio:

```typescript
// ❌ Termos técnicos
const item = cart.items[0]
item.qty = 5

// ✅ Linguagem do domínio
const product = shoppingCart.products[0]
product.quantity = 5
```

### Bounded Context

Cada contexto tem sua própria linguagem:

```
📦 Vendas
├── Cliente = quem compra
├── Produto = o que vende
└── Pedido = transação

📦 Suporte
├── Cliente = quem abre ticket
├── Produto = sobre o que é o ticket
└── Ticket = solicitação
```

## Building Blocks

### Entity

Objeto com identidade única:

```typescript
type User = {
  id: UserId
  email: Email
  name: string
  createdAt: Date
}

// Identidade define igualdade
const isSameUser = (a: User, b: User) => a.id === b.id
```

### Value Object

Objeto definido por seus atributos:

```typescript
type Email = {
  value: string
}

const createEmail = (value: string): Email => {
  if (!isValidEmail(value)) {
    throw new Error('Email inválido')
  }
  return { value }
}

// Igualdade por valor
const isSameEmail = (a: Email, b: Email) => a.value === b.value
```

### Aggregate

Cluster de entidades com raiz:

```typescript
// Order é a raiz do agregado
type Order = {
  id: OrderId
  customerId: CustomerId
  items: OrderItem[]
  status: OrderStatus
}

// OrderItem só existe dentro de Order
type OrderItem = {
  productId: ProductId
  quantity: number
  price: Money
}

// Modificações através da raiz
const addItem = (order: Order, item: OrderItem): Order => ({
  ...order,
  items: [...order.items, item],
})
```

### Repository

Abstração para persistência:

```typescript
type OrderRepository = {
  findById: (id: OrderId) => Promise<Order | null>
  save: (order: Order) => Promise<void>
  findByCustomer: (customerId: CustomerId) => Promise<Order[]>
}

// Implementação escondida
const createOrderRepository = (db: Database): OrderRepository => ({
  findById: (id) => db.query('SELECT...'),
  save: (order) => db.execute('INSERT...'),
  findByCustomer: (id) => db.query('SELECT...'),
})
```

### Domain Service

Lógica que não pertence a uma entidade:

```typescript
type PaymentService = {
  processPayment: (order: Order, method: PaymentMethod) => Promise<Payment>
}

// Quando usar:
// - Operação envolve múltiplas entidades
// - Não pertence naturalmente a nenhuma entidade
// - Regra de negócio complexa
```

## Estrutura de Pastas

```
src/
├── core/                 # Domínio
│   ├── entities/         # Entidades
│   ├── value-objects/    # Value Objects
│   ├── aggregates/       # Agregados
│   ├── services/         # Domain Services
│   └── repositories/     # Interfaces
├── infra/                # Implementações
│   ├── database/         # Repositórios concretos
│   └── external/         # APIs externas
└── application/          # Casos de uso
    └── usecases/
```

## Use Cases

```typescript
type CreateOrderUseCase = {
  execute: (input: CreateOrderInput) => Promise<Order>
}

const createOrderUseCase = (
  orderRepo: OrderRepository,
  productRepo: ProductRepository
): CreateOrderUseCase => ({
  execute: async (input) => {
    // 1. Validar
    const products = await productRepo.findByIds(input.productIds)
    if (products.length !== input.productIds.length) {
      throw new Error('Produto não encontrado')
    }

    // 2. Criar agregado
    const order = createOrder({
      customerId: input.customerId,
      items: buildOrderItems(products, input.quantities),
    })

    // 3. Persistir
    await orderRepo.save(order)

    return order
  },
})
```

## Anti-Patterns

```typescript
// ❌ Anemic Domain Model
type User = { name: string; email: string }
const validateUser = (user: User) => {} // Lógica separada

// ✅ Rich Domain Model
type User = {
  name: string
  email: Email
  changeEmail: (newEmail: string) => User
}

// ❌ Repositório com lógica de negócio
const findActiveUsersWithDiscount = () => {}

// ✅ Repositório genérico + service
const findActive = () => {}
const applyDiscount = (users: User[]) => {}
```

## Checklist

- [ ] Ubiquitous Language definida
- [ ] Bounded Contexts identificados
- [ ] Entidades com identidade
- [ ] Value Objects imutáveis
- [ ] Agregados com raiz clara
- [ ] Repositórios como interfaces
- [ ] Use Cases orquestram fluxo
