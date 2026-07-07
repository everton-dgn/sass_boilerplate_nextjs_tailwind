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

    const themeButton = page.getByRole('button', {
      name: /Switch to (light|dark) mode/
    })
    await expect(themeButton).toBeVisible()

    const initialLabel = await themeButton.getAttribute('aria-label')
    await themeButton.click()

    const toggledLabel =
      initialLabel === 'Switch to dark mode'
        ? 'Switch to light mode'
        : 'Switch to dark mode'

    await expect(page.getByRole('button', { name: toggledLabel })).toBeVisible()

    await page.reload()

    await expect(page.getByRole('button', { name: toggledLabel })).toBeVisible()
  })

  test('should maintain topbar visible on home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()

    const topbar = page.locator('header').first()
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()
  })
})
