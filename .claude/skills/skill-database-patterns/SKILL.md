---
name: skill-database-patterns
description: |
  Use este skill quando o usuário pedir para "otimizar query", "problema N+1",
  "criar migration", "índice de banco", "transaction", "connection pool", ou mencionar
  otimização de banco, performance de queries ou evolução de schema.
  Cobre queries eficientes, problema N+1, connection pooling, migrations, transactions, índices.
model: opus
---

# Database Patterns

## Objetivo
Padrões de banco de dados - queries eficientes, N+1 problem, connection pooling, migrations, transactions, índices.

## Quando usar
- Ao otimizar queries e índices.
- Ao lidar com transações e concorrência.
- Ao planejar migrations e evolução de schema.

## Conexão e Pooling

### Connection Pool

```typescript
// ❌ Ruim - nova conexão a cada request
export async function getUser(id: string) {
  const client = new Client()
  await client.connect()
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id])
  await client.end()
  return result.rows[0]
}

// ✅ Bom - pool compartilhado
import { Pool } from 'pg'

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

export async function getUser(id: string) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0]
}
```

## Problema N+1

### Identificar

```typescript
// ❌ N+1 - 1 query para posts + N queries para autores
const posts = await db.query('SELECT * FROM posts')
for (const post of posts) {
  post.author = await db.query('SELECT * FROM users WHERE id = $1', [post.author_id])
}
```

### Resolver com JOIN

```typescript
// ✅ Bom - 1 query com JOIN
const posts = await db.query(`
  SELECT
    p.*,
    u.name as author_name,
    u.avatar as author_avatar
  FROM posts p
  JOIN users u ON p.author_id = u.id
`)
```

### Resolver com IN clause

```typescript
// ✅ Bom - 2 queries no máximo
const posts = await db.query('SELECT * FROM posts')
const authorIds = [...new Set(posts.map(p => p.author_id))]

const authors = await db.query(
  'SELECT * FROM users WHERE id = ANY($1)',
  [authorIds]
)

const authorsMap = new Map(authors.map(a => [a.id, a]))
posts.forEach(p => p.author = authorsMap.get(p.author_id))
```

## Índices

### Quando criar

```sql
-- Colunas usadas em WHERE
CREATE INDEX idx_users_email ON users(email);

-- Colunas usadas em ORDER BY
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- Colunas usadas em JOIN
CREATE INDEX idx_posts_author ON posts(author_id);

-- Índice composto para queries frequentes
CREATE INDEX idx_posts_status_date ON posts(status, created_at DESC);
```

### Verificar uso de índice

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Bom: Index Scan
-- Ruim: Seq Scan (em tabelas grandes)
```

## Transactions

### Operações atômicas

```typescript
// ✅ Bom - transaction para operações relacionadas
const client = await pool.connect()

try {
  await client.query('BEGIN')

  const order = await client.query(
    'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
    [userId, total]
  )

  for (const item of items) {
    await client.query(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
      [order.rows[0].id, item.productId, item.quantity]
    )

    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [item.quantity, item.productId]
    )
  }

  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
}
```

## Migrations

### Estrutura

```
migrations/
├── 001_create_users.sql
├── 002_create_posts.sql
├── 003_add_posts_slug.sql
└── 004_create_comments.sql
```

### Migration reversível

```sql
-- 003_add_posts_slug.sql

-- Up
ALTER TABLE posts ADD COLUMN slug VARCHAR(255) UNIQUE;
CREATE INDEX idx_posts_slug ON posts(slug);

-- Down
DROP INDEX idx_posts_slug;
ALTER TABLE posts DROP COLUMN slug;
```

## Query Patterns

### Paginação eficiente

```typescript
// ❌ Ruim - OFFSET lento em páginas altas
const posts = await db.query(
  'SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 10000'
)

// ✅ Bom - cursor-based pagination
const posts = await db.query(
  'SELECT * FROM posts WHERE id > $1 ORDER BY id LIMIT 20',
  [lastId]
)
```

### Soft delete

```typescript
// Schema
// ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

// Delete
await db.query(
  'UPDATE users SET deleted_at = NOW() WHERE id = $1',
  [userId]
)

// Query (sempre filtrar)
await db.query(
  'SELECT * FROM users WHERE deleted_at IS NULL'
)
```

### Upsert

```sql
-- PostgreSQL
INSERT INTO users (email, name)
VALUES ($1, $2)
ON CONFLICT (email)
DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();
```

## Segurança

### Prepared statements (sempre!)

```typescript
// ❌ NUNCA - SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ SEMPRE - prepared statement
const query = 'SELECT * FROM users WHERE email = $1'
await db.query(query, [email])
```

### Princípio do menor privilégio

```sql
-- Criar usuário da aplicação com permissões limitadas
CREATE USER app_user WITH PASSWORD 'secret';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
-- NÃO dar DELETE, DROP, TRUNCATE
```

## Testing

### Banco de teste isolado

```typescript
// test/setup.ts
beforeAll(async () => {
  await db.query('BEGIN')
})

afterAll(async () => {
  await db.query('ROLLBACK')
})
```

### Factories

```typescript
// test/factories/user.ts
export const createUser = async (overrides = {}) => {
  const user = {
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    ...overrides
  }

  const result = await db.query(
    'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
    [user.email, user.name]
  )

  return result.rows[0]
}
```

## Checklist

- [ ] Queries evitam N+1 e usam índices corretos
- [ ] Transações delimitam operações críticas
- [ ] Migrations são reversíveis e seguras
- [ ] Queries são parametrizadas (sem SQL injection)
- [ ] Estratégia de testes cobre casos de erro e concorrência
