import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

test.describe('localization flow', () => {
  test('should render translated content on /pt', async ({ page }) => {
    await page.goto('/pt')

    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt')
    await expect(page).toHaveTitle(/Início/)
  })

  test('should render translated content on /es', async ({ page }) => {
    await page.goto('/es')

    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })

  test('should switch locale via the switcher and persist it', async ({
    page
  }) => {
    await page.goto('/en')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()

    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByRole('menuitemradio', { name: 'Portuguese' }).click()

    await expect(page).toHaveURL(/\/pt$/)
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()

    await page.goto('/')

    await expect(page).toHaveURL(/\/pt$/)
  })

  test('should render the localized 404 page for unknown routes', async ({
    page
  }) => {
    await page.goto('/pt/rota-inexistente')

    await expect(
      page.getByRole('heading', { name: 'Página não encontrada!' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Voltar ao início' })
    ).toBeVisible()
  })
})
