---
name: skill-security-patterns
description: |
  Use este skill quando o usuário pedir para "verificar segurança", "OWASP",
  "validar input", "configurar CSP", "headers de segurança", "autenticação segura",
  ou mencionar vulnerabilidades, XSS, CSRF, SQL injection ou proteção de dados.
  Cobre OWASP Top 10, validação de input, autenticação, headers de segurança, CSP.
model: opus
---

# Security Patterns

## Objetivo
Padrões de segurança web - OWASP Top 10, validação de input, autenticação, headers de segurança, CSP, proteção de dados.

## Quando usar
- Ao aplicar práticas OWASP Top 10.
- Ao configurar headers de segurança e CSP.
- Ao validar autenticação e autorização.

Padrões e práticas de segurança para aplicações web.

## OWASP Top 10 (2021)

| # | Vulnerabilidade | Prevenção |
|---|-----------------|-----------|
| 1 | Broken Access Control | Verificar autorização em cada request |
| 2 | Cryptographic Failures | Criptografar dados sensíveis, TLS |
| 3 | Injection | Parametrizar queries, validar input |
| 4 | Insecure Design | Threat modeling, secure by design |
| 5 | Security Misconfiguration | Hardening, remover defaults |
| 6 | Vulnerable Components | Atualizar dependências |
| 7 | Auth Failures | MFA, rate limiting, sessões seguras |
| 8 | Data Integrity Failures | Verificar atualizações, CI/CD seguro |
| 9 | Logging Failures | Logs de segurança, alertas |
| 10 | SSRF | Validar URLs, whitelist de destinos |

---

## Validação de Input

### Princípios

```typescript
// Sempre valide e sanitize input do usuário
const email = validateEmail(req.body.email)
if (!email) throw new ValidationError('Invalid email')
```

### Checklist

- [ ] Validar tipo (string, number, boolean)
- [ ] Validar formato (regex, schema)
- [ ] Validar tamanho (min, max length)
- [ ] Sanitizar HTML (prevenir XSS)
- [ ] Escapar para contexto (SQL, HTML, URL)
- [ ] Validar server-side (não só client)

### Zod Schema Example

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150).optional(),
})

type User = z.infer<typeof UserSchema>

const validate = (input: unknown): User => {
  return UserSchema.parse(input)
}
```

---

## Autenticação

### Senhas

```typescript
// Usar bcrypt ou argon2
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
```

### Tokens JWT

```typescript
// Configuração segura de JWT
const tokenConfig = {
  algorithm: 'RS256', // Assimétrico preferível
  expiresIn: '15m',   // Curta duração
  issuer: 'app-name',
  audience: 'app-users',
}

// Refresh tokens separados com maior duração
// Armazenar em httpOnly cookie ou DB
```

### Rate Limiting

```typescript
// Limitar tentativas de login
const loginLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // 5 tentativas
  message: 'Too many login attempts',
}

// Limitar por IP para APIs
const apiLimiter = {
  windowMs: 60 * 1000,  // 1 minuto
  max: 100,             // 100 requests
}
```

---

## Autorização

### Verificar em Cada Request

```typescript
// Verificar autorização além de autenticação
app.get('/users/:id', authenticate, authorize('read:user'), getUser)

const authorize = (permission: string) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

### Prevenir IDOR

```typescript
// Sempre verificar ownership
app.get('/orders/:id', async (req, res) => {
  const order = await db.orders.findById(req.params.id)
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  res.json(order)
})
```

---

## Headers de Segurança

```typescript
const securityHeaders = {
  // Previne clickjacking
  'X-Frame-Options': 'DENY',

  // Previne MIME sniffing
  'X-Content-Type-Options': 'nosniff',

  // XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // Controla referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // HTTPS obrigatório
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Desabilita APIs do browser
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // Content Security Policy
  'Content-Security-Policy': "default-src 'self'; script-src 'self'",
}
```

---

## Content Security Policy (CSP)

### Configuração Básica

```
default-src 'self';
script-src 'self' https://trusted-cdn.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://api.example.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### Diretivas Importantes

| Diretiva | Propósito |
|----------|-----------|
| `default-src` | Fallback para todas as diretivas |
| `script-src` | Fontes de JavaScript |
| `style-src` | Fontes de CSS |
| `img-src` | Fontes de imagens |
| `connect-src` | URLs para fetch/XHR |
| `frame-ancestors` | Quem pode embeddar (anti-clickjacking) |
| `base-uri` | Restringe `<base>` |
| `form-action` | Destinos de forms |

### Nonces para Inline Scripts

```typescript
// Gerar nonce único por request
const nonce = crypto.randomBytes(16).toString('base64')

// CSP header com nonce
// script-src 'self' 'nonce-${nonce}'
```

---

## Cookies Seguros

```typescript
const cookieOptions = {
  httpOnly: true,     // Não acessível via JS
  secure: true,       // Apenas HTTPS
  sameSite: 'strict', // Previne CSRF
  maxAge: 3600000,    // 1 hora
  path: '/',
  domain: '.example.com',
}

res.cookie('session', token, cookieOptions)
```

---

## Proteção de Dados

### Dados Sensíveis

```typescript
// Nunca logar dados sensíveis
console.log('User login:', { email, password: '[REDACTED]' })

// Selecionar campos explicitamente em responses
return { id: user.id, email: user.email, name: user.name }
```

### Secrets

```typescript
// Variáveis de ambiente, nunca no código
const API_KEY = process.env.API_KEY

// Validar na inicialização
if (!process.env.API_KEY) {
  throw new Error('API_KEY is required')
}
```

---

## SQL Injection

```typescript
// Seguro - query parametrizada
const query = 'SELECT * FROM users WHERE id = $1'
const result = await db.query(query, [userId])

// Seguro - ORM com binding
const user = await prisma.user.findUnique({
  where: { id: userId }
})
```

---

## Prevenção de XSS

```typescript
// Em JSX/TSX - React/Solid escapam por padrão
// Usar texto diretamente (escapado automaticamente)
<div>{userInput}</div>

// Para HTML necessário, usar sanitização
import DOMPurify from 'dompurify'
const safeHTML = DOMPurify.sanitize(userInput)
```

---

## CORS

```typescript
// Configuração específica (não usar origin: '*' com credentials)
const corsOptions = {
  origin: ['https://app.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 horas
}
```

---

## Checklist de Segurança

### Input/Output
- [ ] Todos os inputs validados server-side
- [ ] Queries parametrizadas (SQL injection)
- [ ] Output escapado por contexto (XSS)
- [ ] Uploads validados (tipo, tamanho)

### Autenticação
- [ ] Senhas com hash seguro (bcrypt/argon2)
- [ ] Tokens com expiração curta
- [ ] Rate limiting em login
- [ ] MFA disponível

### Autorização
- [ ] Verificação em cada endpoint
- [ ] Sem IDOR
- [ ] Princípio do menor privilégio

### Infraestrutura
- [ ] HTTPS obrigatório
- [ ] Headers de segurança configurados
- [ ] CSP implementado
- [ ] Cookies com flags seguras
- [ ] CORS restrito

### Dados
- [ ] Dados sensíveis criptografados
- [ ] Secrets em env vars
- [ ] Logs sem dados sensíveis
- [ ] Backups criptografados
