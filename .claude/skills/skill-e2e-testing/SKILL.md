---
name: skill-e2e-testing
description: |
  Use este skill quando o usuário pedir para "teste E2E", "Playwright", "testar fluxo completo",
  "Page Object Model", "seletores resilientes", "flaky test", ou mencionar
  testes end-to-end, automação de browser ou integração com CI/CD.
  Cobre Playwright, Page Object Model, seletores resilientes, flaky tests, CI/CD.
model: opus
---

# E2E Testing

## Objetivo
Testes end-to-end com Playwright - Page Object Model, seletores resilientes, handling de flaky tests, CI/CD integration.

## Quando usar
- Ao criar testes E2E com Playwright.
- Ao definir seletores resilientes e POM.
- Ao configurar CI e reduzir flakiness.

## Setup Playwright

```bash
pnpm add -D @playwright/test
pnpm exec playwright install
```

### Config básico

```typescript
// playwright.CONFIG.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

## Page Object Model

### Estrutura

```
e2e/
├── pages/
│   ├── base.page.ts
│   ├── home.page.ts
│   ├── login.page.ts
│   └── dashboard.page.ts
├── fixtures/
│   └── index.ts
├── home.spec.ts
├── login.spec.ts
└── dashboard.spec.ts
```

### Base Page

```typescript
// e2e/pages/base.page.ts
import { Page, Locator } from '@playwright/test'

export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path)
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  getByTestId(id: string): Locator {
    return this.page.getByTestId(id)
  }
}
```

### Page específica

```typescript
// e2e/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Senha')
    this.submitButton = page.getByRole('button', { name: 'Entrar' })
    this.errorMessage = page.getByRole('alert')
  }

  async goto() {
    await this.navigate('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message)
  }
}
```

### Fixtures customizados

```typescript
// e2e/fixtures/index.ts
import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { DashboardPage } from '../pages/dashboard.page'

type Pages = {
  loginPage: LoginPage
  dashboardPage: DashboardPage
}

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  }
})

export { expect } from '@playwright/test'
```

### Teste usando Page Object

```typescript
// e2e/login.spec.ts
import { test, expect } from './fixtures'

test.describe('Login', () => {
  test('deve fazer login com sucesso', async ({ loginPage, dashboardPage }) => {
    await loginPage.goto()
    await loginPage.login('user@example.com', 'password123')

    await expect(dashboardPage.welcomeMessage).toBeVisible()
  })

  test('deve mostrar erro com credenciais inválidas', async ({ loginPage }) => {
    await loginPage.goto()
    await loginPage.login('invalid@example.com', 'wrong')

    await loginPage.expectError('Credenciais inválidas')
  })
})
```

## Seletores Resilientes

### Prioridade de seletores

```typescript
// ✅ Preferido - role com nome acessível
page.getByRole('button', { name: 'Salvar' })
page.getByRole('link', { name: 'Home' })
page.getByRole('textbox', { name: 'Email' })

// ✅ Bom - label
page.getByLabel('Email')
page.getByPlaceholder('Digite seu email')

// ✅ Bom - test id (quando não há alternativa semântica)
page.getByTestId('submit-button')

// ⚠️ Evitar - texto exato (quebra com i18n)
page.getByText('Clique aqui')

// ❌ Evitar - seletores CSS frágeis
page.locator('.btn-primary')
page.locator('#submit')
page.locator('div > button:nth-child(2)')
```

## Handling Flaky Tests

### Waits explícitos

```typescript
// ❌ Ruim - sleep fixo
await page.waitForTimeout(2000)

// ✅ Bom - esperar elemento
await expect(page.getByRole('alert')).toBeVisible()

// ✅ Bom - esperar navegação
await Promise.all([
  page.waitForURL('**/dashboard'),
  submitButton.click()
])

// ✅ Bom - esperar request
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/login')),
  submitButton.click()
])
```

### Retries configurados

```typescript
// playwright.CONFIG.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  expect: {
    timeout: 10000 // timeout para assertions
  },
  use: {
    actionTimeout: 15000, // timeout para ações
    navigationTimeout: 30000
  }
})
```

### Isolamento de testes

```typescript
// ✅ Cada teste independente
test.beforeEach(async ({ page }) => {
  // Setup limpo para cada teste
  await page.goto('/')
})

// ✅ Usar contexto de storage para auth
test.use({
  storageState: 'e2e/.auth/user.json'
})
```

## Authentication

### Setup de auth

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Senha').fill('password123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByTestId('user-menu')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
```

### Usar auth nos testes

```typescript
// playwright.CONFIG.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json'
      },
      dependencies: ['setup']
    }
  ]
})
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm exec playwright test

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## Visual Regression

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

test('homepage visual', async ({ page }) => {
  await page.goto('/')

  // Screenshot da página inteira
  await expect(page).toHaveScreenshot('homepage.png')

  // Screenshot de elemento específico
  const hero = page.getByTestId('hero-section')
  await expect(hero).toHaveScreenshot('hero.png')
})
```

### Atualizar screenshots

```bash
# Atualizar todos os snapshots
pnpm exec playwright test --update-snapshots

# Atualizar snapshot específico
pnpm exec playwright test visual.spec.ts --update-snapshots
```

## Checklist

- [ ] Cenários críticos cobertos (fluxo principal)
- [ ] Seletores resilientes (`data-testid`/role)
- [ ] Sem dependência de estado compartilhado entre testes
- [ ] Flakiness mitigada (retries, waits explícitos)
- [ ] Relatórios e artifacts configurados no CI
