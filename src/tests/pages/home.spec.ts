import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/)
  })

  test('should render topbar with brand and navigation', async ({ page }) => {
    const topbar = page.locator('header').first()
    await expect(topbar).toBeVisible()
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()

    await expect(topbar.getByRole('link', { name: 'Início' })).toBeVisible()
    await expect(topbar.getByRole('link', { name: 'Notas' })).toBeVisible()
  })

  test('should highlight active nav link', async ({ page }) => {
    const inicioLink = page.getByRole('link', { name: 'Início' })
    await expect(inicioLink).toHaveAttribute('aria-current', 'page')

    const notasLink = page.getByRole('link', { name: 'Notas' })
    await expect(notasLink).not.toHaveAttribute('aria-current', 'page')
  })

  test('should render logos and subtitle', async ({ page }) => {
    await expect(page.getByAltText('Logo Nextjs')).toBeVisible()
    await expect(page.getByTestId('logo-tailwind')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Nextjs + Tailwind CSS' })
    ).toBeVisible()
  })

  test('should render header text', async ({ page }) => {
    await expect(page.getByText('Boilerplate', { exact: true })).toBeVisible()
  })

  test('should toggle theme between light and dark', async ({ page }) => {
    const themeButton = page.getByRole('button', {
      name: /Mudar para o modo/
    })
    await expect(themeButton).toBeVisible()

    const initialLabel = await themeButton.getAttribute('aria-label')
    await themeButton.click()

    const expectedLabel =
      initialLabel === 'Mudar para o modo escuro'
        ? 'Mudar para o modo claro'
        : 'Mudar para o modo escuro'

    await expect(
      page.getByRole('button', { name: expectedLabel })
    ).toBeVisible()
  })

  test('should navigate to notes page', async ({ page }) => {
    await page.getByRole('link', { name: 'Notas' }).click()

    await expect(page).toHaveURL('/notes')
    await expect(page.getByRole('heading', { name: 'Notas' })).toBeVisible()
  })
})
