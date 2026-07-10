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

  test('should render localized home content', async ({ page }) => {
    const homePage = page.locator('main[data-page="home"]')

    await expect(homePage.getByAltText('Next.js logo')).toBeVisible()
    await expect(homePage.getByTestId('logo-tailwind')).toBeVisible()
    await expect(
      homePage.getByRole('heading', {
        name: 'A clean foundation for modern products.'
      })
    ).toBeVisible()
    await expect(
      homePage.getByText('Next.js 16 · React 19 · Tailwind CSS 4')
    ).toBeVisible()
  })

  test('should render the localized eyebrow', async ({ page }) => {
    const homePage = page.locator('main[data-page="home"]')

    await expect(
      homePage.getByText('SaaS Boilerplate', { exact: true })
    ).toBeVisible()
  })

  test('should toggle theme between light and dark', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: 'Select theme' })
    await expect(themeButton).toBeVisible()

    await themeButton.click()
    await page.getByRole('menuitem', { name: 'Light' }).click()
    await expect(page.locator('html')).toHaveClass(/\blight\b/)

    await themeButton.click()
    await page.getByRole('menuitem', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  })

  test('should keep home navigation on the current page', async ({ page }) => {
    await page.getByRole('link', { name: 'Home' }).click()

    await expect(page).toHaveURL(/\/en$/)
    await expect(
      page.locator('main[data-page="home"]').getByRole('heading', {
        name: 'A clean foundation for modern products.'
      })
    ).toBeVisible()
  })
})
