import { test, expect } from '@playwright/test'

test.describe('P2P Chat', () => {
  test('two peers can chat in same room', async ({ browser }) => {
    const context = await browser.newContext({ ignoreHTTPSErrors: true })
    
    const page1 = await context.newPage()
    const page2 = await context.newPage()

    page1.on('console', msg => console.log('PAGE1:', msg.text()))
    page2.on('console', msg => console.log('PAGE2:', msg.text()))
    page1.on('pageerror', err => console.error('PAGE1 ERROR:', err))
    page2.on('pageerror', err => console.error('PAGE2 ERROR:', err))

    await page1.goto('/chat', { waitUntil: 'networkidle' })
    await page2.goto('/chat', { waitUntil: 'networkidle' })

    const roomName = 'test-' + Date.now()

    await page1.fill('input[placeholder*="room name"]', roomName)
    await page1.click('button:has-text("Join Room")')

    await page2.fill('input[placeholder*="room name"]', roomName)
    await page2.click('button:has-text("Join Room")')

    await page1.waitForSelector('text=/Connected/', { timeout: 30000 })
    await page2.waitForSelector('text=/Connected/', { timeout: 30000 })

    await page1.fill('input[placeholder*="Type a message"]', 'Hello from peer 1')
    await page1.click('button:has-text("Send")')

    await expect(page2.locator('text=Hello from peer 1')).toBeVisible({ timeout: 5000 })

    await page2.fill('input[placeholder*="Type a message"]', 'Hello from peer 2')
    await page2.click('button:has-text("Send")')

    await expect(page1.locator('text=Hello from peer 2')).toBeVisible({ timeout: 5000 })

    await context.close()
  })

  test('UI shows waiting state when no peers connected', async ({ page }) => {
    await page.goto('/chat')
    const roomName = 'test-' + Date.now()
    
    await page.fill('input[placeholder*="room name"]', roomName)
    await page.click('button:has-text("Join Room")')
    
    await expect(page.locator('text=/Room:/i')).toBeVisible()
    await expect(page.locator('text=/Waiting for peers/i')).toBeVisible()
    await expect(page.locator('button:has-text("Send")')).toBeDisabled()
  })
})
