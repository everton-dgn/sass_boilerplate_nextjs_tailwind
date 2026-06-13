---
name: skill-architecture-patterns
description: |
  Use este skill quando o usuário pedir para "organizar projeto", "estrutura de pastas",
  "separar responsabilidades", "definir camadas", "modularizar", ou mencionar
  arquitetura de software, gestão de dependências, limites de módulos ou trade-offs.
  Cobre estrutura de pastas, separação de responsabilidades, dependências, módulos.
model: opus
---

# Architecture Patterns

## Objetivo
Padrões de arquitetura de software - estrutura de pastas, separação de responsabilidades, dependências, módulos, trade-offs.

## Quando usar
- Ao definir estrutura de pastas, camadas e módulos.
- Ao refatorar dependências e limites entre contextos.
- Ao avaliar trade-offs de arquitetura.

Padrões e práticas para arquitetura de aplicações frontend/fullstack.

## Estrutura de Pastas

### Estrutura Recomendada

```
src/
├── app.tsx                 # Root do app
├── entry-client.tsx        # Entrada client
├── entry-server.tsx        # Entrada server
│
├── routes/                 # Rotas (file-based routing)
│   └── [locale]/          # Rotas por locale
│       ├── (baseLayout).tsx
│       ├── (home)/
│       └── blog/
│
├── presentation/           # Camada de apresentação
│   ├── components/        # UI Components
│   │   ├── atoms/        # Básicos (Button, Input)
│   │   ├── molecules/    # Compostos (Card, Form)
│   │   └── organisms/    # Complexos (Header, Footer)
│   ├── primitives/       # Funções reativas (create*, make*)
│   ├── context/          # UI contexts (Theme)
│   └── theme/            # Tokens, estilos globais
│
├── core/                  # Lógica de negócio
│   ├── entities/         # Modelos de domínio
│   ├── usecases/         # Casos de uso
│   └── constants/        # Constantes compartilhadas
│
├── infra/                 # Infraestrutura
│   ├── database/         # Conexão DB
│   ├── i18n/             # Internacionalização
│   ├── env/              # Variáveis de ambiente
│   └── external/         # APIs externas
│
├── content/               # Conteúdo estático
│   └── blog/             # Posts MDX
│
├── middleware/            # Middleware server
│
└── tests/                 # Testes E2E
```

---

## Limites de Dependência

### Regras de Importação

```
┌─────────────────────────────────────────────┐
│                  routes/                     │
│  (pode importar de qualquer lugar)           │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            presentation/                     │
│  organisms → molecules → atoms               │
│  (organisms podem usar molecules e atoms)    │
│  (atoms NÃO podem usar organisms)            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│                  core/                       │
│  (lógica de negócio pura)                   │
│  (não depende de presentation nem routes)    │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│                  infra/                      │
│  (adapters de infraestrutura)               │
│  (não depende de presentation nem routes)    │
└─────────────────────────────────────────────┘
```

### Proibições

| Origem | NÃO pode importar de |
|--------|---------------------|
| `atoms/` | `molecules/`, `organisms/`, `routes/` |
| `molecules/` | `organisms/`, `routes/` |
| `organisms/` | `routes/` |
| `core/` | `presentation/`, `routes/` |
| `infra/` | `presentation/`, `routes/`, `core/` |

---

## Atomic Design

### Atoms

Componentes básicos, sem dependências de outros componentes.

```tsx
// atoms/Button/index.tsx
export const Button = (props: ButtonProps) => {
  return (
    <button class={styles.button} {...props}>
      {props.children}
    </button>
  )
}
```

### Molecules

Combinam atoms para formar unidades funcionais.

```tsx
// molecules/SearchInput/index.tsx
import { Input } from '@/presentation/components/atoms/Input'
import { Button } from '@/presentation/components/atoms/Button'

export const SearchInput = (props: SearchInputProps) => {
  return (
    <div class={styles.container}>
      <Input placeholder="Buscar..." value={props.value} />
      <Button onClick={props.onSearch}>Buscar</Button>
    </div>
  )
}
```

### Organisms

Seções completas da UI, podem ter estado próprio.

```tsx
// organisms/Header/index.tsx
import { Logo } from '@/presentation/components/atoms/Logo'
import { NavMenu } from '@/presentation/components/molecules/NavMenu'
import { SearchInput } from '@/presentation/components/molecules/SearchInput'

export const Header = () => {
  return (
    <header class={styles.header}>
      <Logo />
      <NavMenu />
      <SearchInput />
    </header>
  )
}
```

---

## Separação de Responsabilidades

### UI vs Lógica

```tsx
// ❌ Misturado
const UserCard = () => {
  const [user, setUser] = createSignal(null)

  onMount(async () => {
    const res = await fetch('/api/user')
    setUser(await res.json())
  })

  return <div>{user()?.name}</div>
}

// ✅ Separado
// core/usecases/getUser.ts
export const getUser = async (id: string) => {
  const res = await fetch(`/api/user/${id}`)
  return res.json()
}

// presentation/components/UserCard.tsx
const UserCard = (props: { user: User }) => {
  return <div>{props.user.name}</div>
}

// routes/user/[id].tsx
const UserPage = () => {
  const user = createAsync(() => getUser(params.id))
  return <UserCard user={user()} />
}
```

### Primitives vs Components

```tsx
// primitives/createCounter.ts (lógica)
export const createCounter = (initial = 0) => {
  const [count, setCount] = createSignal(initial)
  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  return { count, increment, decrement }
}

// components/Counter.tsx (UI)
export const Counter = () => {
  const { count, increment, decrement } = createCounter(0)

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count()}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## Módulos e Coesão

### Alta Coesão

Manter relacionados juntos.

```
components/
└── UserProfile/
    ├── index.tsx           # Componente principal
    ├── styles.module.css   # Estilos
    ├── types.ts            # Tipos
    ├── UserAvatar.tsx      # Sub-componente
    └── UserStats.tsx       # Sub-componente
```

### Baixo Acoplamento

Minimizar dependências entre módulos.

```tsx
// ❌ Alto acoplamento
import { db } from '@/infra/database'
import { emailService } from '@/infra/email'
import { logger } from '@/infra/logger'

const createUser = async (data) => {
  const user = await db.user.create(data)
  await emailService.sendWelcome(user.email)
  logger.info('User created', user)
  return user
}

// ✅ Baixo acoplamento (dependency injection)
type CreateUserDeps = {
  createUser: (data: UserData) => Promise<User>
  sendWelcomeEmail: (email: string) => Promise<void>
  log: (msg: string, data?: unknown) => void
}

const createUserUseCase = (deps: CreateUserDeps) => {
  return async (data: UserData) => {
    const user = await deps.createUser(data)
    await deps.sendWelcomeEmail(user.email)
    deps.log('User created', user)
    return user
  }
}
```

---

## Trade-offs Comuns

### Monolito vs Módulos

| Aspecto | Monolito | Módulos/Features |
|---------|----------|-----------------|
| Simplicidade | Mais simples inicialmente | Mais complexo setup |
| Escalabilidade | Difícil | Mais fácil |
| Code splitting | Manual | Natural |
| Quando usar | MVP, projetos pequenos | Projetos médios+ |

### Colocation vs Separation

| Aspecto | Colocation | Separation |
|---------|-----------|------------|
| Navegação | Fácil achar relacionados | Arquivos espalhados |
| Reutilização | Duplicação possível | Compartilhamento fácil |
| Quando usar | Componentes isolados | Lógica compartilhada |

### Props Drilling vs Context

| Aspecto | Props | Context |
|---------|-------|---------|
| Explicitness | Explícito | Implícito |
| Refactoring | Mais trabalho | Mais fácil |
| Performance | Melhor | Pode causar re-renders |
| Quando usar | 1-3 níveis | Estado global UI |

---

## Decisões de Arquitetura

### Checklist de Decisão

1. **Qual o problema?**
   - Descrever claramente o problema

2. **Quais as opções?**
   - Listar 2-3 abordagens

3. **Quais os trade-offs?**
   - Prós e contras de cada

4. **Qual a recomendação?**
   - Escolha justificada

5. **Como reverter?**
   - Plano se der errado

### ADR (Architecture Decision Record)

```markdown
# ADR-001: Usar CSS Modules

## Status
Aceito

## Contexto
Precisamos de uma solução de estilos que:
- Tenha escopo local (evitar conflitos)
- Seja performática (sem runtime)
- Integre bem com TypeScript

## Decisão
Usar CSS Modules com convenção `styles.module.css`.

## Consequências
### Positivas
- Escopo automático
- Zero runtime
- Suporte nativo do bundler

### Negativas
- Sintaxe de classes mais verbosa
- Composição de estilos limitada

## Alternativas Consideradas
- Tailwind: Rejeitado por classes longas no JSX
- CSS-in-JS: Rejeitado por runtime overhead
```

---

## Evolução Incremental

### Refatoração Segura

1. **Adicionar novo** (não modificar existente)
2. **Migrar gradualmente** (feature por feature)
3. **Remover antigo** (quando não usado)

```tsx
// Passo 1: Criar nova versão
// components/Button/ButtonV2.tsx
export const ButtonV2 = () => { /* nova implementação */ }

// Passo 2: Migrar usos gradualmente
// Arquivo por arquivo, substituir Button por ButtonV2

// Passo 3: Quando tudo migrado, remover Button antigo
// e renomear ButtonV2 para Button
```

### Feature Flags

```tsx
const FEATURES = {
  NEW_CHECKOUT: process.env.FEATURE_NEW_CHECKOUT === 'true',
}

const CheckoutPage = () => {
  if (FEATURES.NEW_CHECKOUT) {
    return <NewCheckout />
  }
  return <OldCheckout />
}
```

## Checklist

- [ ] Estrutura de pastas reflete responsabilidades reais
- [ ] Regras de dependência são respeitadas
- [ ] Atomic Design aplicado sem inversão de camadas
- [ ] Mudanças arquiteturais são incrementais e seguras
- [ ] Trade-offs e decisões estão documentados
