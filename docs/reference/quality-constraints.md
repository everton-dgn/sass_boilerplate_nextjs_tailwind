# Restrições de qualidade

O projeto aplica um padrão de qualidade rigoroso e previsível. Essas regras
são aplicadas localmente e no CI.

## Regras de código

- **Zero comentários** — código deve ser auto-explicativo.
- **Sem ponto e vírgula** (Biome: `asNeeded`).
- **80 caracteres** máximo por linha.
- **`type` em vez de `interface`**.
- **`import type`** para imports apenas de tipos.
- **Arrow functions com `const`** (nunca declarações `function`).
- **Sem barrel files**, sem `export *`.
- **Sem `var`**, sem `enum`.
- **Sem imports profundos** (3+ níveis) — usar alias `@/`.
- **Exportações nomeadas** para todos os componentes.
- **Nomes auto-explicativos** — em inglês, claros, sem abreviações obscuras.
- **Nomes descritivos obrigatórios** — ver seção dedicada abaixo.

## Regras de estilização (Tailwind CSS v4 + shadcn/ui)

- Classes utilitárias Tailwind diretamente no JSX.
- `cn()` (clsx + tailwind-merge) para classes condicionais.
- Componentes UI via shadcn/ui em `src/components/atoms/`.
- Variantes via `tailwind-variants` (TV).
- Cores semânticas shadcn (`text-muted-foreground`, `bg-destructive`).
- Variáveis CSS em `src/theme/globals.css` para tokens de tema.
- Biome `useSortedClasses` ordena classes automaticamente.
- Zero valores inline — tudo via Tailwind classes ou variáveis CSS.

## Convenções de nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente | PascalCase | `ErrorFallback`, `MainProvider` |
| Hook | camelCase com `use` | `useCount`, `useTheme` |
| Função | camelCase | `getServerEnv` |
| Constante | UPPER_SNAKE_CASE | `IS_CLIENT`, `IS_SERVER` |
| Tipo | PascalCase | `ButtonProps`, `StoreState` |
| Arquivo `.ts`/`.tsx` | camelCase ou PascalCase | `clientEnv.ts` |
| Pasta de componente | PascalCase | `Button/`, `ErrorFallback/` |

## Nomenclatura de arquivos

Permitidos para `.ts`/`.tsx`: `camelCase` ou `PascalCase`. NUNCA `kebab-case`.
Exceção: convenções Next.js (`not-found.tsx`, `global-error.tsx`).

## Ferramentas que aplicam as regras

- **Biome** (formatação + linting):
  - Escopo: `src/` e arquivos de configuração listados em `biome.json`.
  - `pnpm format` corrige problemas e reescreve arquivos.
  - `pnpm lint` e `pnpm biome:ci` falham em violações.
  - Padrões do formatador: recuo de 2 espaços, 80 caracteres por linha,
    terminações de linha LF.
  - Linting inclui regras recomendadas mais verificações de a11y e
    complexidade.
- **Knip** (código e dependências sem uso):
  - `pnpm audit:dead-code` executa análise completa, análise estrita do grafo
    de produção e detecção de ciclos.
  - Hints de configuração são erros para evitar grafos incompletos.
  - `pnpm audit:dead-code:entrypoints` audita superfícies públicas sem bloquear.
- **Commitlint** (formato de commit):
  - Conventional Commits são obrigatórios.
  - Tamanho máximo do header é 120 caracteres.
- **Lefthook** (gates locais):
  - `pre-commit`: `pnpm format`, `pnpm lint`, `pnpm typecheck`.
  - `pre-push`: `pnpm test` e `pnpm audit:dead-code` em paralelo.
- **TypeScript** (modo estrito):
  - `strict: true`, `noImplicitAny`, `noUnusedLocals`,
    `noUncheckedIndexedAccess`.

## Ordenação de imports

Biome organiza imports automaticamente. A ordem está configurada em
`biome.json`:

- Módulos nativos do Node
- Next.js (`next`, `next/**`)
- React
- Pacotes npm (incluindo `lucide-react`, `sonner`, etc.)
- Módulos com alias de `src` (`@/*`)
- Imports relativos

## Padrões proibidos

- `enum` → usar objetos `as const` em vez disso.
- `var` → usar `let` ou `const`.
- Barrel files (`index.ts` re-exportando tudo).
- Reexportação total (`export * from`).
- Imports relativos profundos (3+ níveis como `../../../`).
- Condições Yoda (`if (5 === x)`).
- Spread acumulativo em loops.

## Nomes descritivos obrigatórios

NUNCA usar nomes de uma única letra para variáveis ou parâmetros. Nomes
devem revelar a intenção e o domínio.

### Onde se aplica

| Contexto | Proibido | Correto |
|----------|----------|---------|
| Variável local | `const d = new Date()` | `const date = new Date()` |
| `.map()` | `.map(p => p.items)` | `.map(page => page.items)` |
| `.filter()` | `.filter(n => n.active)` | `.filter(note => note.active)` |
| `.flatMap()` | `.flatMap(p => p.items)` | `.flatMap(page => page.items)` |
| `.reduce()` | `(a, item) => a + item` | `(total, item) => total + item` |
| `.forEach()` | `.forEach(n => delete(n))` | `.forEach(note => delete(note))` |
| State setter | `setState(c => c + 1)` | `setState(prev => prev + 1)` |
| Event handler | `onChange(e => log(e))` | `onChange(event => log(event))` |
| Promise | `.then(r => r.data)` | `.then(response => response.data)` |

### Exceções permitidas

| Padrão | Motivo |
|--------|--------|
| `(a, b)` em `.sort()` | Convenção universal de comparadores |
| `_` para parâmetro ignorado | Convenção para valores descartados |
| `i`, `j` em loops `for` tradicionais | Convenção de índice numérico |

**Importante**: `i` em `.forEach()` ou `.map()` continua proibido — usar
`index` em vez disso.

### Regra geral

Se o nome não comunica **o que a variável representa**, está errado. O custo
de digitar alguns caracteres extras é insignificante comparado ao custo de
decifrar código obscuro.

## Dependências

- **Versões exatas** — `.npmrc` contém `save-exact=true`. Todo `pnpm add`
  grava sem `^` ou `~` (ex: `"1.2.3"` em vez de `"^1.2.3"`).
- **Por quê**: builds determinísticos, sem surpresas de minor/patch.
- **Atenção com geradores**: `shadcn add` e similares podem ignorar essa
  configuração. Sempre verifique o `package.json` após usar geradores e remova
  prefixos `^`/`~` se necessário.

## Formato de commit

Conventional Commits:

```
<type>(<scope>): <subject>
```

Tipos comuns: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, `revert`.

## Se uma verificação falhar

1. Execute `pnpm format` e tente novamente.
2. Execute `pnpm lint`, `pnpm typecheck`, `pnpm test` localmente.
3. Corrija os problemas antes de fazer push.
