import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

test.describe('navigation flow', () => {
  test('should render home navigation as the active link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()

    const inicioLink = page.getByRole('link', { name: 'Início' })

    await expect(inicioLink).toHaveAttribute('aria-current', 'page')

    await inicioLink.click()
    await expect(page).toHaveURL('/')
    await expect(inicioLink).toHaveAttribute('aria-current', 'page')
  })

  test('should persist theme across page reloads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()

    const themeButton = page.getByRole('button', {
      name: /Mudar para o modo/
    })
    await expect(themeButton).toBeVisible()

    const initialLabel = await themeButton.getAttribute('aria-label')
    await themeButton.click()

    const toggledLabel =
      initialLabel === 'Mudar para o modo escuro'
        ? 'Mudar para o modo claro'
        : 'Mudar para o modo escuro'

    await expect(page.getByRole('button', { name: toggledLabel })).toBeVisible()

    await page.reload()

    await expect(page.getByRole('button', { name: toggledLabel })).toBeVisible()
  })

  test('should maintain topbar visible on home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()

    const topbar = page.locator('header').first()
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()
  })
})
