import test, { expect } from '@playwright/test'

test.describe('Focus Question Bank Manager Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Focus Question Bank Manager loads properly and initializes default pools', async ({ page }) => {
    const result = await page.evaluate(() => {
      if (!window.focusQB) return { loaded: false }
      return {
        loaded: true,
        classicsCount: window.focusQB.getPool('classicsQuiz').length,
        charTestCount: window.focusQB.getPool('characterTest').length,
        crosswordCount: window.focusQB.getPool('characterCrossword').length,
        unitedWordsCount: window.focusQB.getPool('characterUnitedWords').length
      }
    })

    expect(result.loaded).toBe(true)
    expect(result.classicsCount).toBeGreaterThanOrEqual(200)
    expect(result.charTestCount).toBeGreaterThanOrEqual(500)
    expect(result.crosswordCount).toBeGreaterThanOrEqual(100)
    expect(result.unitedWordsCount).toBeGreaterThanOrEqual(150)
  })

  test('Focus Question Bank Search filters questions correctly', async ({ page }) => {
    const searchResult = await page.evaluate(() => {
      const qb = window.focusQB
      const classicsLiBai = qb.searchPool('classicsQuiz', '李白')
      const charTestShe = qb.searchPool('characterTest', '蛇')
      return {
        classicsLiBaiCount: classicsLiBai.length,
        charTestSheCount: charTestShe.length
      }
    })

    expect(searchResult.classicsLiBaiCount).toBeGreaterThan(0)
    expect(searchResult.charTestSheCount).toBeGreaterThan(0)
  })

  test('Focus Question Bank template generator provides compliant schema', async ({ page }) => {
    const templates = await page.evaluate(() => {
      const qb = window.focusQB
      return {
        classics: qb.getTemplateData('classicsQuiz'),
        charTest: qb.getTemplateData('characterTest'),
        crossword: qb.getTemplateData('characterCrossword'),
        unitedWords: qb.getTemplateData('characterUnitedWords')
      }
    })

    expect(templates.classics.length).toBeGreaterThan(0)
    expect(templates.classics[0].title).toBeTruthy()
    expect(templates.classics[0].answer).toBeTruthy()
    expect(templates.classics[0].options.length).toBe(4)

    expect(templates.charTest[0].char).toBeTruthy()
    expect(templates.charTest[0].clue).toBeTruthy()

    expect(templates.crossword[0].centerChar).toBeTruthy()
    expect(templates.unitedWords[0].word).toBeTruthy()
  })

  test('Focus Question Bank allows adding, modifying, and resetting custom questions', async ({ page }) => {
    const cycleResult = await page.evaluate(() => {
      const qb = window.focusQB
      const initialCount = qb.getPool('characterTest').length

      // Add custom question
      qb.saveQuestion('characterTest', {
        char: '龍',
        zhuyin: 'ㄌㄨㄥˊ',
        clue: '畫（　）點睛',
        searchWord: '畫龍點睛'
      })

      const afterAddPool = qb.getPool('characterTest')
      const isCustomAfterAdd = qb.isCustomPool('characterTest')
      const firstItem = afterAddPool[0]

      // Reset
      qb.resetPool('characterTest')
      const afterResetPool = qb.getPool('characterTest')
      const isCustomAfterReset = qb.isCustomPool('characterTest')

      return {
        initialCount,
        afterAddCount: afterAddPool.length,
        isCustomAfterAdd,
        addedChar: firstItem.char,
        afterResetCount: afterResetPool.length,
        isCustomAfterReset
      }
    })

    expect(cycleResult.afterAddCount).toBe(cycleResult.initialCount + 1)
    expect(cycleResult.isCustomAfterAdd).toBe(true)
    expect(cycleResult.addedChar).toBe('龍')
    expect(cycleResult.afterResetCount).toBe(cycleResult.initialCount)
    expect(cycleResult.isCustomAfterReset).toBe(false)
  })

  test('Focus Question Bank Modal opens and renders questions properly on button click', async ({ page }) => {
    // Select classics quiz in admin dropdown
    await page.selectOption('#focusGameType', 'classicsQuiz')
    
    // Check that settings block is visible
    const isVisible = await page.isVisible('#focusClassicsQuizSettings')
    expect(isVisible).toBe(true)

    // Click on "管理與搜尋題庫" button
    await page.click('#focusClassicsQuizSettings button:has-text("管理與搜尋題庫")')

    // Modal should have active class and be visible
    const modal = page.locator('#modal-focus-question-bank')
    await expect(modal).toHaveClass(/active/)
    await expect(modal).toBeVisible()

    // Question items should be rendered
    const itemsCount = await page.locator('#focusQbListContainer .focus-qb-item-card').count()
    expect(itemsCount).toBeGreaterThan(0)

    // Type in search box
    await page.fill('#focusQbSearchInput', '李白')
    const filteredCount = await page.locator('#focusQbListContainer .focus-qb-item-card').count()
    expect(filteredCount).toBeGreaterThan(0)

    // Close modal
    await page.click('#modal-focus-question-bank button:has-text("完成關閉")')
    await expect(modal).not.toHaveClass(/active/)
  })

  test('Focus Question Bank renders characterCrossword without undefined values', async ({ page }) => {
    // Switch to characterCrossword tab
    await page.evaluate(() => {
      window.focusQB.openModal('characterCrossword')
    })

    const listHtml = await page.locator('#focusQbListContainer').innerHTML()
    expect(listHtml).not.toContain('undefined')
    expect(listHtml).toContain('中心正字')
    expect(listHtml).toContain('四方字')
  })

  test('Focus Question Bank renders characterUnitedWords without undefined values', async ({ page }) => {
    // Switch to characterUnitedWords tab
    await page.evaluate(() => {
      window.focusQB.openModal('characterUnitedWords')
    })

    const listHtml = await page.locator('#focusQbListContainer').innerHTML()
    expect(listHtml).not.toContain('undefined')
    expect(listHtml).toContain('解答詞語')
    expect(listHtml).toContain('散裝部件')
  })
})


