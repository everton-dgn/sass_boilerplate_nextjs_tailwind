# Plugins de lint (GritQL)

Gates mecânicos para convenções do projeto que as rules nativas do Biome não
cobrem. Vivem em `biome-plugins/`, são registrados no array `plugins` do
`biome.json` e rodam dentro do `pnpm lint` (portanto no pre-commit do Lefthook
e na CI, sem configuração extra).

Organização: 1 arquivo `.grit` por regra, com mensagem e severidade próprias.
Exceção deliberada: `hook-conventions.grit` agrupa as convenções de hooks em
3 checagens no mesmo arquivo.

## Catálogo

| Plugin | Acusa | Não acusa (por design) |
|--------|-------|------------------------|
| `css-module-import` | Alias diferente de `S`, nome diferente de `styles.module.css` e import fora da pasta do consumidor | Componente sem CSS Module |
| `hook-conventions` | Retorno anotado de arrow hook, tipo `Use<Nome>Return` e `'use client'` em módulo com arrow hook | Function declaration, componente client e store `const useX = create(...)` |
| `metadata-in-layout-only` | Export de `metadata` ou `generateMetadata` em `page.tsx` | Ausência de metadata no layout e conteúdo SEO incompleto |
| `no-classname-template-literal` | Template literal em `className` | Concatenação, array e template literal em outros atributos |
| `no-context-api` | Chamada direta a `createContext(...)` | `React.createContext`, alias e a exceção legada do `useTheme` |
| `no-crypto-random-uuid` | `crypto.randomUUID()`, inclusive via `window` e `globalThis` | Outras fontes de ID e uso positivo de `uuidv7` |
| `no-inline-typed-event-handler` | Parâmetro tipado em arrow handler inline no JSX | Handler extraído e arrow inline com tipo inferido |
| `no-jsx-ternary-null` | Ternário com JSX e `null`/`undefined` em children ou variável | Prop com contrato `\| null`, valor não-JSX e coerção de condição numérica |
| `no-named-reexport` | Reexport nomeado, reexport de tipo e export separado da declaração | Exports declarados diretamente e arquivos em `src/tests/` |
| `no-nested-render-function` | Arrow `renderX` com JSX declarada dentro de outra função | Declaração top-level e função sem o prefixo `render` |
| `no-nullable-useref-generic` | `useRef<T \| null>(null)` e `useRef<null \| T>(null)` | `null` que faz parte do dado, como arrays de elementos anuláveis |
| `no-qualified-react-types` | Tipo qualificado `React.X` | Uso de valor, como `React.isValidElement(...)` |
| `no-raw-process-env` | Acesso direto a `process.env` no código da aplicação | Testes, `.d.ts` e os módulos de env `constants/*Env.ts` |
| `no-reduced-motion-in-css` | Media query de `prefers-reduced-motion` em CSS local | Implementação global em `src/theme/globals.css` |
| `no-reduced-motion-in-js` | String ou template com `prefers-reduced-motion` em JS/TS | Movimento declarado normalmente no CSS |
| `no-structural-ref-type` | Objeto, callback ou interseção inline em `useRef` e `RefObject` | Tipo nomeado e tipos folha simples |
| `test-naming` | `describe` raiz fora de `[tipo] nome` e `it`/`test` sem prefixo `should` | Colocalização, basename do arquivo e idioma completo do título |

O contrato executável vive nos arquivos `.grit` e o escopo exato de cada gate
vive no `biome.json`. Este catálogo explica comportamento e limitações sem
replicar as regras nas instruções de agentes.

## Escopo

Dez plugins são globais. Os demais usam overrides do `biome.json`:

| Plugin | Escopo resumido |
|--------|-----------------|
| `no-raw-process-env` | `src/**`, exceto testes, `.d.ts` e os módulos `constants/*Env.ts` |
| `no-reduced-motion-in-css` | CSS em `src/**`, exceto `src/theme/globals.css` |
| `no-named-reexport` | `src/**`, exceto `src/tests/**` |
| `no-context-api` | `src/**`, exceto o contexto legado do `useTheme` |
| `metadata-in-layout-only` | `src/app/**/page.tsx` |
| `test-naming` | `src/**/__tests__/**` |
| `css-module-import` | `src/**` |

## Supressão pontual

Preferir a categoria específica do plugin (o nome é o do arquivo `.grit`):

```tsx
{/* biome-ignore lint/plugin/no-jsx-ternary-null: motivo real da exceção */}
{ok ? <Icon /> : null}
```

Em código fora de JSX, usar comentário de linha:

```ts
// biome-ignore lint/plugin/hook-conventions: motivo real da exceção
```

As categorias amplas `lint/plugin` e `lint` também suprimem, mas escondem
mais do que o necessário. Categoria errada não suprime e gera o aviso
`suppressions/unused`.

## Como criar um plugin novo

1. Escrever o pattern num sandbox fora do repositório, com um arquivo de
   teste contendo casos proibidos e permitidos. Só instalar quando os
   proibidos acusarem e os permitidos passarem.
2. Criar `biome-plugins/<nome-da-regra>.grit` e registrar em
   `biome.json > plugins`.
3. Rodar `pnpm lint` no repositório inteiro: o gate novo pode revelar
   violações pré-existentes. Corrigir ou usar `severity = "warn"` durante a
   migração (warn aparece no lint sem quebrar o exit code).

Estrutura mínima:

```grit
engine biome(1.0)
language js(typescript, jsx)

JsConditionalExpression() as $node where {
  register_diagnostic(
    span = $node,
    message = "Mensagem em PT-BR apontando a doc da regra.",
    severity = "error"
  )
}
```

### Armadilhas do CST do Biome (aprendidas na prática)

- JSX em posição de expressão vem embrulhado em `JsxTagExpression`. Casar
  `JsxElement()` direto num field como `consequent` nunca funciona.
- Expressão entre parênteses vira nó próprio: `JsParenthesizedExpression`.
  O formato multilinha do formatter sempre produz esse nó.
- `initializer` tem nós intermediários: `JsInitializerClause` em declarações
  (`const x = ...`) e `JsxAttributeInitializerClause` em atributos JSX.
- Field opcional ausente ainda casa metavariável: `campo = $x` não exige a
  presença do campo. Para exigir, casar o nó: `campo = TsReturnTypeAnnotation()`.
- O nó raiz `JsModule` nunca é visitado pelo executor. Para condição sobre o
  arquivo inteiro, ancorar num nó interno e subir:
  `$node <: within JsModule() as $mod, $mod <: contains <outro pattern>`.
- Snippets funcionam para expressões (`` `useRef<$t | null>(null)` `` casa),
  mas não para atributo JSX com valor `{...}` — nesse caso usar os nós do CST.
- Descobrir nomes de nós e fields: Playground do Biome (aba Syntax) ou
  sondas locais (`Nó() as $d where { register_diagnostic(span = $d, ...) }`).
