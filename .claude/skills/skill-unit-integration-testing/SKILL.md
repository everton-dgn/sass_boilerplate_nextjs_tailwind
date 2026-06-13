---
name: skill-unit-integration-testing
description: |
  Use este skill quando o usuário pedir para "escrever teste", "teste unitário",
  "teste de integração", "quando usar mock", "estrutura de teste", ou mencionar
  estratégia de testes, isolamento ou boas práticas de testing.
  Cobre estrutura, nomenclatura, boas práticas e quando usar cada tipo de teste.
model: opus
---

# Unit & Integration Testing

## Objetivo
Conceitos gerais de testes unitários e de integração - estrutura, nomenclatura, boas práticas e quando usar cada tipo.

## Quando usar
- Ao definir estratégia unit vs integration.
- Ao escrever testes com isolamento.
- Ao decidir limites de mocks.

## Tipos de Teste

| Tipo | Escopo | Velocidade | Isolamento |
|------|--------|------------|------------|
| **Unitário** | Função/classe individual | Muito rápido | Total (mocks) |
| **Integração** | Múltiplos componentes | Rápido | Parcial |

### Quando usar cada tipo

| Cenário | Tipo Recomendado |
|---------|------------------|
| Função pura com lógica de negócio | Unitário |
| Transformação de dados | Unitário |
| Validação de inputs | Unitário |
| Hook com estado simples | Unitário |
| Componente isolado | Unitário |
| Componente com providers | Integração |
| Fluxo de múltiplos hooks | Integração |
| Interação entre componentes | Integração |
| Formulário completo | Integração |

## Nomenclatura Padrão

### Formato describe

```ts
// Formato simples
describe('[categoria] nome', () => {})

// Formato com subcategoria
describe('[categoria:subcategoria] nome', () => {})
```

**Categorias comuns:**

| Categoria | Uso |
|-----------|-----|
| `[utils]` | Funções utilitárias |
| `[primitive]` | Primitivas/hooks base |
| `[hook]` | Hooks customizados |
| `[component]` | Componentes UI |
| `[page]` | Páginas/views |
| `[page:logic]` | Lógica de página |
| `[domain]` | Regras de domínio |
| `[data:formatters]` | Formatadores de dados |
| `[presentation:components]` | Componentes de apresentação |

### Formato it/test

```ts
// Sempre em inglês, prefixo "should"
it('should return true when condition is met', () => {})
it('should throw error when input is invalid', () => {})
it('should call callback with correct arguments', () => {})
```

## Estrutura AAA (Arrange, Act, Assert)

```ts
it('should calculate total with discount', () => {
  // Arrange - preparar dados e dependências
  const items = [{ price: 100 }, { price: 50 }]
  const discount = 0.1

  // Act - executar a ação sendo testada
  const result = calculateTotal(items, discount)

  // Assert - verificar o resultado
  expect(result).toBe(135)
})
```

## Estrutura de Diretórios

```
src/
├── feature/
│   ├── index.ts
│   ├── types.ts
│   └── __tests__/
│       └── test.ts          # ou test.tsx para componentes
```

### Estrutura de providers de teste

```
src/tests/
├── providers/
│   ├── component/
│   │   └── index.tsx        # renderWithProviders
│   └── hook/
│       └── index.tsx        # renderHooksProvider
├── mocks/
│   ├── storage.ts
│   ├── fetch.ts
│   └── matchMedia.ts
└── utils/
    └── index.ts
```

## Boas Práticas

### Testar comportamento, não implementação

```ts
// Ruim - testa detalhes de implementação
it('should set isLoading to true then false', () => {
  expect(hook.result.current.isLoading).toBe(true)
  // ...
})

// Bom - testa comportamento observável
it('should display loading indicator while fetching', () => {
  render(<UserProfile id={1} />)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})
```

### Um conceito por teste

```ts
// Ruim - múltiplos conceitos
it('should validate, transform and save data', () => {})

// Bom - conceitos separados
it('should reject invalid email format', () => {})
it('should normalize email to lowercase', () => {})
it('should persist valid user data', () => {})
```

### Testes determinísticos

```ts
// Ruim - depende de data atual
it('should show current date', () => {
  expect(result).toContain(new Date().toISOString())
})

// Bom - data controlada via mock do framework
it('should format date correctly', () => {
  // Usar vi.setSystemTime (Vitest) ou jest.setSystemTime (Jest)
  expect(formatDate(new Date('2024-01-15'))).toBe('15/01/2024')
})
```

## Seletores (Testing Library)

### Prioridade de seletores

| Prioridade | Seletor | Quando usar |
|------------|---------|-------------|
| 1 | `getByRole` | Sempre que possível |
| 2 | `getByLabelText` | Inputs de formulário |
| 3 | `getByPlaceholderText` | Quando label não existe |
| 4 | `getByText` | Textos estáticos |
| 5 | `getByTestId` | Último recurso |

### Exemplos

```tsx
// Melhor - acessível e semântico
screen.getByRole('button', { name: 'Submit' })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { level: 1 })

// Aceitável - formulários
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter your email')

// Último recurso
screen.getByTestId('submit-button')
```

## Anti-patterns

### Evitar

```ts
// Não testar implementação interna
expect(component.state.count).toBe(1)

// Não usar delays arbitrários
await new Promise(r => setTimeout(r, 1000))

// Não ignorar erros silenciosamente
try { doSomething() } catch {}

// Não usar any sem necessidade
const mock: any = {}
```

### Preferir

```ts
// Testar resultado observável
expect(screen.getByText('Count: 1')).toBeInTheDocument()

// Usar waitFor para assíncrono
await waitFor(() => expect(result).toBe(expected))

// Testar que erros são lançados
expect(() => doSomething()).toThrow()

// Tipar mocks corretamente (ver skill específica do framework)
```

## Checklist

- [ ] Tipo de teste escolhido corretamente (unit vs integration)
- [ ] Setup/teardown controlado e isolado
- [ ] Testes verificam resultados observáveis
- [ ] Mocks tipados e usados apenas quando necessário
- [ ] Cobertura mínima definida e revisada
