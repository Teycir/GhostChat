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
    await expect(page.locator('h2')).toContainText('Join a Room')
  })

  test('should show room name input', async ({ page }) => {
    await page.goto('/chat')
    
    const input = page.locator('input[placeholder*="unique room name"]')
    await expect(input).toBeVisible()
    
    const button = page.locator('button:has-text("Join Room")')
    await expect(button).toBeVisible()
  })

  test('should show warning about unique room names', async ({ page }) => {
    await page.goto('/chat')
    
    await expect(page.locator('text=Use unique room names')).toBeVisible()
    await expect(page.locator('text=alice-bob-jan15')).toBeVisible()
  })

  test('should join room with valid name', async ({ page }) => {
    await page.goto('/chat')
    
    await page.fill('input[placeholder*="unique room name"]', 'test-room-123')
    await page.click('button:has-text("Join Room")')
    
    await expect(page.locator('text=Room: test-room-123')).toBeVisible()
  })
})
