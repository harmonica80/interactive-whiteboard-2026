import { expect, test } from '@playwright/test'

async function openWhiteboard(page) {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/whiteboard_v146.html?e2e=1')
  await expect.poll(
    () => page.evaluate(() => Boolean(window.editorInstanceRef)),
    { timeout: 15_000 },
  ).toBe(true)
  await expect(page.locator('[data-testid="tools.draw"]')).toBeVisible()

  return pageErrors
}

async function shapeTypes(page) {
  return page.evaluate(() => window.editorInstanceRef.getCurrentPageShapes().map((shape) => shape.type))
}

async function drawStroke(page, toolTestId, start, end) {
  await page.locator(`[data-testid="tools.${toolTestId}"]`).click()
  await page.mouse.move(...start)
  await page.mouse.down()
  await page.mouse.move(...end)
  await page.mouse.up()
}

test('initializes tldraw without a page error', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  expect(pageErrors).toEqual([])
})

test('creates a draw shape', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  await drawStroke(page, 'draw', [220, 200], [380, 260])
  await expect.poll(() => shapeTypes(page)).toContain('draw')
  expect(pageErrors).toEqual([])
})

test('creates geometry and arrow shapes', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  await drawStroke(page, 'rectangle', [240, 200], [380, 300])
  await expect.poll(() => shapeTypes(page)).toContain('geo')
  await drawStroke(page, 'arrow', [450, 200], [600, 300])
  await expect.poll(() => shapeTypes(page)).toContain('arrow')
  expect(pageErrors).toEqual([])
})

test('creates note and text shapes', async ({ page }) => {
  const pageErrors = await openWhiteboard(page)
  await page.locator('[data-testid="tools.note"]').click()
  await page.mouse.click(240, 200)
  await page.keyboard.type('note')
  await page.keyboard.press('Escape')
  await expect.poll(() => shapeTypes(page)).toContain('note')

  await page.locator('[data-testid="tools.text"]').click()
  await page.mouse.click(450, 200)
  await page.keyboard.type('text')
  await page.keyboard.press('Escape')
  await expect.poll(() => shapeTypes(page)).toContain('text')
  expect(pageErrors).toEqual([])
})