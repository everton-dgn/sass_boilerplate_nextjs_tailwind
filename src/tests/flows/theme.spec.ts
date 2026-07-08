import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

const openThemeMenu = (page: Page) =>
  page.getByRole('button', { name: 'Select theme' }).click()

const selectTheme = async (page: Page, name: string) => {
  await openThemeMenu(page)
  await page.getByRole('menuitem', { name }).click()
}

test.describe('theme flow', () => {
  test('should list every theme option in the switcher', async ({ page }) => {
    await page.goto('/en')
    await openThemeMenu(page)

    await expect(page.getByRole('menuitem', { name: 'Light' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Dark' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'System' })).toBeVisible()
  })

  test('should apply the dark theme to the document', async ({ page }) => {
    await page.goto('/en')
    await selectTheme(page, 'Dark')

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  })

  test('should mark the active theme option', async ({ page }) => {
    await page.goto('/en')
    await selectTheme(page, 'Light')

    await openThemeMenu(page)

    await expect(page.getByRole('menuitem', { name: 'Light' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  test('should persist the theme across locale navigation', async ({
    page
  }) => {
    await page.goto('/en')
    await selectTheme(page, 'Light')
    await expect(page.locator('html')).toHaveClass(/\blight\b/)

    await page.goto('/pt')

    await expect(page.locator('html')).toHaveClass(/\blight\b/)
  })

  test('should resolve the system theme from the OS preference', async ({
    page
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/en')
    await selectTheme(page, 'System')

    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

    await page.emulateMedia({ colorScheme: 'light' })

    await expect(page.locator('html')).toHaveClass(/\blight\b/)
  })
})
