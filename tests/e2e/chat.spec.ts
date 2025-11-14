import { test, expect } from '@playwright/test'

test.describe('GhostChat E2E', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('h1')).toContainText('GhostChat')
    await expect(page.locator('text=Start Chatting')).toBeVisible()
  })

  test('should navigate to chat page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Start Chatting')
    
    await expect(page).toHaveURL('/chat')
  })

  test('should show create room button', async ({ page }) => {
    await page.goto('/chat')
    
    await expect(page.locator('text=Create Room')).toBeVisible({ timeout: 5000 })
  })

  test('should show connection status', async ({ page }) => {
    await page.goto('/chat')
    
    await expect(page.locator('text=Disconnected')).toBeVisible()
  })
})
