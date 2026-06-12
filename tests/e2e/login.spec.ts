import { test, expect } from '@playwright/test'

test('login page renders sign in form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  await expect(page.getByPlaceholder('••••••••')).toBeVisible()
})

test('login page has OAuth buttons', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('link', { name: /google/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible()
})
