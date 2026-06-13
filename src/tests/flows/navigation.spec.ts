import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

test.describe('navigation flow', () => {
  test('should navigate between home and notes with active link updating', async ({
    page
  }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()

    const inicioLink = page.getByRole('link', { name: 'Início' })
    const notasLink = page.getByRole('link', { name: 'Notas' })

    await expect(inicioLink).toHaveAttribute('aria-current', 'page')
    await expect(notasLink).not.toHaveAttribute('aria-current', 'page')

    await notasLink.click()
    await expect(page).toHaveURL('/notes')
    await expect(notasLink).toHaveAttribute('aria-current', 'page')
    await expect(inicioLink).not.toHaveAttribute('aria-current', 'page')

    await inicioLink.click()
    await expect(page).toHaveURL('/')
    await expect(inicioLink).toHaveAttribute('aria-current', 'page')
    await expect(notasLink).not.toHaveAttribute('aria-current', 'page')
  })

  test('should persist theme across page navigation', async ({ page }) => {
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

    await page.getByRole('link', { name: 'Notas' }).click()
    await expect(page).toHaveURL('/notes')

    await expect(page.getByRole('button', { name: toggledLabel })).toBeVisible()
  })

  test('should maintain topbar visible across all pages', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()

    const topbar = page.locator('header').first()
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()

    await page.getByRole('link', { name: 'Notas' }).click()
    await expect(page).toHaveURL('/notes')
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()
  })
})
