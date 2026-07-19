# Perguntas frequentes

## pnpm install falha com erro de versão

O repositório exige Node 24.x e uma versão fixa de pnpm. Atualize o Node e
execute:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Meu commit foi rejeitado pelo Commitlint

Use Conventional Commits:

```text
feat: add login page
fix: handle empty state
chore: update deps
```

## Pré-commit falha na formatação ou linting

Execute `pnpm format` e depois `pnpm lint` para ver os detalhes.

## Verificação de tipos falha com erros de TypeScript

O projeto usa modo estrito. Corrija os erros de tipo e tente novamente.

## Biome fica reordenando imports

Isso é esperado. Execute `pnpm format` e mantenha seu editor configurado
para terminações de linha LF.

## CI falhou com erro de import sensível a maiúsculas

CI roda em Linux. Corrija a capitalização do caminho do import para
corresponder exatamente ao nome do arquivo.

## Playwright não encontra o Chromium

A configuração usa o Chromium gerenciado pelo Playwright. Execute
`pnpm exec playwright install chromium`; uma revisão já presente no cache global
será reutilizada sem novo download.

## Como adicionar um novo componente shadcn/ui?

1. Execute `npx shadcn@latest add <component>` para gerar em
   `src/components/atoms/`.
2. Personalize o componente gerado conforme necessário (Tailwind classes, TV
   variants).
3. Importe o componente onde necessário.

## Teste `.tsx` falha com "Cannot find module" ao usar `from '..'`

O transformer SWC do Vitest (`@vitejs/plugin-react-swc`) tem um bug onde
strings contendo `:` passadas **diretamente como argumento** em callbacks
(como `act()`) corrompem o hoisting de `vi.mock`, quebrando a resolução
de imports relativos (`from '..'`).

**Sintoma**: erro `Cannot find module '/src/.../module.ts'` — o resolver
tenta o caminho como arquivo (`.ts`) em vez de diretório (`/index.ts`).

**Condições**: ambiente `dom` (happy-dom) + `vi.mock` + string com `:` inline.

**Solução**: extrair a string para uma `const`.

```tsx
// Quebra a resolução de imports
act(() => result.current.handleToggle('skill:changed:s1'))

// Funciona
const key = 'skill:changed:s1'
act(() => result.current.handleToggle(key))
```

## Como criar um componente personalizado (sem shadcn)?

1. Crie uma pasta em `src/components/atoms/` ou `molecules/` ou `organisms/`.
2. Use Tailwind classes + `cn()` para estilização.
3. Exporte de `index.tsx` com exportação nomeada.
4. Escreva testes em `__tests__/test.tsx`.
