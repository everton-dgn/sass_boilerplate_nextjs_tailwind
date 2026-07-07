import { expect } from '@playwright/test'

import { test } from '../helpers/testSession'

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/)
  })

  test('should render topbar with brand and navigation', async ({ page }) => {
    const topbar = page.locator('header').first()
    await expect(topbar).toBeVisible()
    await expect(topbar.getByText('SaaS Boilerplate')).toBeVisible()

    await expect(topbar.getByRole('link', { name: 'Home' })).toBeVisible()
  })

  test('should highlight active nav link', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: 'Home' })
    await expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  test('should render logos and subtitle', async ({ page }) => {
    await expect(page.getByAltText('Next.js logo')).toBeVisible()
    await expect(page.getByTestId('logo-tailwind')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Next.js + Tailwind CSS' })
    ).toBeVisible()
  })

  test('should render header text', async ({ page }) => {
    await expect(page.getByText('Boilerplate', { exact: true })).toBeVisible()
  })

  test('should toggle theme between light and dark', async ({ page }) => {
    const themeButton = page.getByRole('button', {
      name: /Switch to (light|dark) mode/
    })
    await expect(themeButton).toBeVisible()

    const initialLabel = await themeButton.getAttribute('aria-label')
    await themeButton.click()

    const expectedLabel =
      initialLabel === 'Switch to dark mode'
        ? 'Switch to light mode'
        : 'Switch to dark mode'

    await expect(
      page.getByRole('button', { name: expectedLabel })
    ).toBeVisible()
  })

  test('should keep home navigation on the current page', async ({ page }) => {
    await page.getByRole('link', { name: 'Home' }).click()

    await expect(page).toHaveURL(/\/en$/)
    await expect(page.getByText('Boilerplate', { exact: true })).toBeVisible()
  })
})
