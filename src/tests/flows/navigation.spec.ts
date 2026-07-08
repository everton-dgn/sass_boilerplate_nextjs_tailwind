import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

test.describe('navigation flow', () => {
  test('should render home navigation as the active link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()

    const homeLink = page.getByRole('link', { name: 'Home' })

    await expect(homeLink).toHaveAttribute('aria-current', 'page')

    await homeLink.click()
    await expect(page).toHaveURL(/\/en$/)
    await expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  test('should persist theme across page reloads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()

    const themeButton = page.getByRole('button', { name: 'Select theme' })
    await expect(themeButton).toBeVisible()

    await themeButton.click()
    await page.getByRole('menuitem', { name: 'Light' }).click()
    await expect(page.locator('html')).toHaveClass(/\blight\b/)

    await page.reload()

    await expect(page.locator('html')).toHaveClass(/\blight\b/)
  })

  test('should maintain topbar visible on home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()

    const topbar = page.locator('header').first()
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()
  })
})
