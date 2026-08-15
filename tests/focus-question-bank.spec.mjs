import test, { expect } from '@playwright/test'

test.describe('Focus Question Bank & Music Manager Tests', () => {
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

  test('Focus Question Bank CSV Template Generator contains UTF-8 BOM and correct headers', async ({ page }) => {
    const csvTemplates = await page.evaluate(() => {
      const qb = window.focusQB
      return {
        classics: qb.getCSVTemplateContent('classicsQuiz'),
        charTest: qb.getCSVTemplateContent('characterTest'),
        crossword: qb.getCSVTemplateContent('characterCrossword'),
        unitedWords: qb.getCSVTemplateContent('characterUnitedWords')
      }
    })

    // Classics Quiz CSV Header
    expect(csvTemplates.classics).toContain('題型,題目問句,名句引言,作品名,作者或主角,朝代,選項A,選項B,選項C,選項D,標準答案,原典全文')
    expect(csvTemplates.classics).toContain('天生我材必有用')

    // Character Test CSV Header
    expect(csvTemplates.charTest).toContain('解答正字,注音,題幹提示,字典關聯詞')
    expect(csvTemplates.charTest).toContain('畫蛇添（　）')

    // Crossword CSV Header
    expect(csvTemplates.crossword).toContain('中心正字,注音,周圍字1(上或前),周圍字2(下或前),周圍字3(左或後),周圍字4(右或後),組成詞語說明')
    expect(csvTemplates.crossword).toContain('天氣、天空')

    // United Words CSV Header
    expect(csvTemplates.unitedWords).toContain('解答詞語,散裝部件(以空格分開),詞語解釋提示')
    expect(csvTemplates.unitedWords).toContain('明月')
  })

  test('Focus Question Bank imports CSV data correctly', async ({ page }) => {
    const importResult = await page.evaluate(() => {
      const qb = window.focusQB
      const sampleCsv = `解答正字,注音,題幹提示,字典關聯詞
鳳,ㄈㄥˋ,龍（　）呈祥,龍鳳呈祥
凰,ㄏㄨㄤˊ,鳳（　）于飛,鳳凰于飛`

      const count = qb.importPool('characterTest', sampleCsv, 'replace')
      const pool = qb.getPool('characterTest')
      const isCustom = qb.isCustomPool('characterTest')

      // reset back
      qb.resetPool('characterTest')

      return {
        count,
        poolLength: pool.length,
        firstChar: pool[0].char,
        firstClue: pool[0].clue,
        isCustom
      }
    })

    expect(importResult.count).toBe(2)
    expect(importResult.poolLength).toBe(2)
    expect(importResult.firstChar).toBe('鳳')
    expect(importResult.firstClue).toBe('龍（　）呈祥')
    expect(importResult.isCustom).toBe(true)
  })

  test('Timer Music Manager loads properly and supports search & CRUD', async ({ page }) => {
    const musicResult = await page.evaluate(() => {
      const mm = window.timerMusicManager
      if (!mm) return { loaded: false }

      const defaultList = mm.getPlaylist()
      const searchCanon = mm.searchPlaylist('卡農')

      // Add custom track
      mm.saveTrack({
        category: '流行抒情',
        title: '🎵 測試背景音樂',
        url: 'https://example.com/test.mp3'
      })

      const afterAddList = mm.getPlaylist()
      const isCustom = mm.isCustomPlaylist()

      // Reset
      mm.resetPlaylist()
      const afterResetList = mm.getPlaylist()

      return {
        loaded: true,
        defaultCount: defaultList.length,
        searchCanonCount: searchCanon.length,
        afterAddCount: afterAddList.length,
        isCustom,
        afterResetCount: afterResetList.length
      }
    })

    expect(musicResult.loaded).toBe(true)
    expect(musicResult.defaultCount).toBeGreaterThanOrEqual(10)
    expect(musicResult.searchCanonCount).toBeGreaterThan(0)
    expect(musicResult.afterAddCount).toBe(musicResult.defaultCount + 1)
    expect(musicResult.isCustom).toBe(true)
    expect(musicResult.afterResetCount).toBe(musicResult.defaultCount)
  })

  test('Timer Music Manager Modal opens and functions correctly', async ({ page }) => {
    // Open music modal
    await page.evaluate(() => {
      window.timerMusicManager.openModal()
    })

    const modal = page.locator('#modal-timer-music-manager')
    await expect(modal).toHaveClass(/active/)
    await expect(modal).toBeVisible()

    const cardsCount = await page.locator('#timerMusicListContainer .timer-music-item-card').count()
    expect(cardsCount).toBeGreaterThan(0)

    // Filter in search box
    await page.fill('#timerMusicSearchInput', '莫札特')
    const filteredCount = await page.locator('#timerMusicListContainer .timer-music-item-card').count()
    expect(filteredCount).toBeGreaterThan(0)

    // Close modal
    await page.click('#modal-timer-music-manager button:has-text("完成關閉")')
    await expect(modal).not.toHaveClass(/active/)
  })

  test('Image, Question, and Video modals navigate within their assigned folder group in correct display order', async ({ page }) => {
    const navResult = await page.evaluate(() => {
      const app = window.app
      if (!app) return { ok: false }

      // Set mock folders and items
      app.imageFolders = [
        { id: 'f1', name: '髮型與造型設計' },
        { id: 'f2', name: '3D建築' }
      ]
      app.images = [
        { id: 'img1', filename: 'hair1.png', folderId: 'f1', timestamp: 1000 },
        { id: 'img2', filename: 'arch1.png', folderId: 'f2', timestamp: 2000 },
        { id: 'img3', filename: 'hair2.png', folderId: 'f1', timestamp: 3000 },
        { id: 'img4', filename: 'unassigned1.png', timestamp: 4000 }
      ]

      const f1List = app.getNavigableImageList('img1')
      const f2List = app.getNavigableImageList('img2')
      const unassignedList = app.getNavigableImageList('img4')

      return {
        ok: true,
        f1Ids: f1List.map(img => img.id),
        f2Ids: f2List.map(img => img.id),
        unassignedIds: unassignedList.map(img => img.id)
      }
    })

    expect(navResult.ok).toBe(true)
    expect(navResult.f1Ids).toEqual(['img1', 'img3'])
    expect(navResult.f2Ids).toEqual(['img2'])
    expect(navResult.unassignedIds).toEqual(['img4'])
  })

  test('Question Input is a multi-line textarea supporting newlines and left-aligned text', async ({ page }) => {
    // Check question input is textarea
    const tagName = await page.locator('#questionInput').evaluate(el => el.tagName.toLowerCase())
    expect(tagName).toBe('textarea')

    // Test filling multi-line question
    await page.fill('#questionInput', '第一行問題\n第二行問題\n第三行問題')
    const val = await page.inputValue('#questionInput')
    expect(val).toContain('\n')

    // Verify CSS styles
    const styles = await page.locator('#questionInput').evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        textAlign: computed.textAlign,
        whiteSpace: computed.whiteSpace
      }
    })
    expect(styles.textAlign).toBe('left')
    expect(styles.whiteSpace).toContain('pre-wrap')
  })

  test('Image modal zoomInfo badge is positioned on the right side', async ({ page }) => {
    const zoomInfoRight = await page.locator('#zoomInfo').evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        position: computed.position,
        right: computed.right,
        left: computed.left
      }
    })
    expect(zoomInfoRight.position).toBe('absolute')
    expect(zoomInfoRight.right).toBe('15px')
  })
})

