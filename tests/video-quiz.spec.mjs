import { test, expect } from '@playwright/test'

test.describe('Interactive Video Quiz Assessment System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173/index.html')
  })

  test('Video Quiz panel and VideoQuizManager initialize correctly', async ({ page }) => {
    const initialized = await page.evaluate(() => {
      return {
        hasManager: typeof window.videoQuiz !== 'undefined',
        hasQuizzes: Array.isArray(window.videoQuiz?.quizzes) && window.videoQuiz.quizzes.length > 0,
        firstQuiz: window.videoQuiz?.quizzes[0]?.title,
        questionsCount: window.videoQuiz?.quizzes[0]?.questions?.length
      }
    })

    expect(initialized.hasManager).toBe(true)
    expect(initialized.hasQuizzes).toBe(true)
    expect(initialized.firstQuiz).toContain('太陽系')
    expect(initialized.questionsCount).toBeGreaterThanOrEqual(3)
  })

  test('Supports Single Choice, Multiple Choice, and Short Answer Text questions', async ({ page }) => {
    const questionTypes = await page.evaluate(() => {
      const qList = window.videoQuiz?.quizzes[0]?.questions || []
      return {
        types: qList.map(q => q.type),
        hasSingle: qList.some(q => q.type === 'single'),
        hasMultiple: qList.some(q => q.type === 'multiple'),
        hasText: qList.some(q => q.type === 'text')
      }
    })

    expect(questionTypes.hasSingle).toBe(true)
    expect(questionTypes.hasMultiple).toBe(true)
    expect(questionTypes.hasText).toBe(true)
  })

  test('Can switch modes between Sync, Self-paced, and Editor', async ({ page }) => {
    await page.evaluate(() => {
      window.app.switchToTab('panel-video-quiz')
    })

    const panelVisible = await page.locator('#panel-video-quiz').isVisible()
    expect(panelVisible).toBe(true)

    // Switch to Self-paced mode
    await page.evaluate(() => {
      window.videoQuiz.switchMode('self')
    })

    const selfSecVisible = await page.locator('#vqSelfSection').isVisible()
    expect(selfSecVisible).toBe(true)

    // Switch to Editor mode
    await page.evaluate(() => {
      window.videoQuiz.switchMode('editor')
    })

    const editorSecVisible = await page.locator('#vqEditorSection').isVisible()
    expect(editorSecVisible).toBe(true)
  })

  test('Question overlay popup and analytics report calculate accurately', async ({ page }) => {
    const calcResult = await page.evaluate(() => {
      const quiz = window.videoQuiz.quizzes[0]
      const mockAnswers = {
        'user_1': {
          userName: '小華',
          answers: {
            'q_1': { isCorrect: true, score: 10, answer: '木星' },
            'q_2': { isCorrect: true, score: 10, answer: ['水星', '金星', '地球'] },
            'q_3': { isCorrect: true, score: 10, answer: '有水與大氣層保護' }
          }
        },
        'user_2': {
          userName: '小明',
          answers: {
            'q_1': { isCorrect: false, score: 0, answer: '金星' },
            'q_2': { isCorrect: true, score: 10, answer: ['水星', '金星', '地球'] },
            'q_3': { isCorrect: true, score: 10, answer: '合適溫度' }
          }
        }
      }

      window.videoQuiz.renderAnalyticsDashboard(quiz, mockAnswers)
      const content = document.getElementById('vqAnalyticsContent')?.innerHTML || ''
      return {
        hasParticipants: content.includes('2 人'),
        hasLeaderboard: content.includes('小華') && content.includes('小明'),
        hasCSVBtn: content.includes('匯出全班成績 CSV')
      }
    })

    expect(calcResult.hasParticipants).toBe(true)
    expect(calcResult.hasLeaderboard).toBe(true)
    expect(calcResult.hasCSVBtn).toBe(true)
  })

  test('Teacher controls global student mode strictly (sync vs self)', async ({ page }) => {
    const modeResult = await page.evaluate(() => {
      window.videoQuiz.setGlobalMode('self')
      const isSelf = window.videoQuiz.globalMode === 'self'
      const badgeText = document.getElementById('vqStudentModeBadge')?.textContent || ''
      const selfSectionVisible = document.getElementById('vqSelfSection')?.style.display === 'block'

      window.videoQuiz.setGlobalMode('sync')
      const isSync = window.videoQuiz.globalMode === 'sync'
      const syncSectionVisible = document.getElementById('vqSyncSection')?.style.display === 'block'

      return { isSelf, badgeText, selfSectionVisible, isSync, syncSectionVisible }
    })

    expect(modeResult.isSelf).toBe(true)
    expect(modeResult.badgeText).toContain('個人自主學習')
    expect(modeResult.isSync).toBe(true)
    expect(modeResult.syncSectionVisible).toBe(true)
  })

  test('Teacher can toggle per-question enabled/disabled status', async ({ page }) => {
    const toggleResult = await page.evaluate(() => {
      const quiz = window.videoQuiz.quizzes[0]
      const q = quiz.questions[0]
      const initEnabled = q.enabled !== false
      window.videoQuiz.toggleQuestionEnabled(quiz.id, q.id)
      const afterFirstToggle = q.enabled === false
      window.videoQuiz.toggleQuestionEnabled(quiz.id, q.id)
      const afterSecondToggle = q.enabled !== false
      return { initEnabled, afterFirstToggle, afterSecondToggle }
    })

    expect(toggleResult.initEnabled).toBe(true)
    expect(toggleResult.afterFirstToggle).toBe(true)
    expect(toggleResult.afterSecondToggle).toBe(true)
  })

  test('Admin quiz bank supports search and pagination', async ({ page }) => {
    const searchPaginationResult = await page.evaluate(() => {
      window.videoQuiz.setAdminSearchQuery('太陽系')
      const filtered1 = window.videoQuiz.adminSearchQuery === '太陽系'
      window.videoQuiz.setAdminSearchQuery('不存在的關鍵字xyz123')
      const containerText = document.getElementById('vqAdminEditorQuizList')?.textContent || ''
      const hasEmptyNotice = containerText.includes('查無符合')
      window.videoQuiz.setAdminSearchQuery('')
      window.videoQuiz.setAdminPage(1)
      const page1 = window.videoQuiz.adminCurrentPage === 1
      return { filtered1, hasEmptyNotice, page1 }
    })

    expect(searchPaginationResult.filtered1).toBe(true)
    expect(searchPaginationResult.hasEmptyNotice).toBe(true)
    expect(searchPaginationResult.page1).toBe(true)
  })

  test('Teacher can check questions to create custom quiz set and load to start', async ({ page }) => {
    const customSetResult = await page.evaluate(() => {
      const quiz = window.videoQuiz.quizzes[0]
      const q1 = quiz.questions[0].id
      const q2 = quiz.questions[1].id

      window.videoQuiz.toggleSelectQuestionForCustomSet(quiz.id, q1)
      window.videoQuiz.toggleSelectQuestionForCustomSet(quiz.id, q2)
      const selectedCount = window.videoQuiz.selectedQuestionIds.size

      // Mock open modal and confirm save
      window.videoQuiz.openSaveCustomSetModal(quiz.id)
      document.getElementById('vqCustomSetNameInput').value = '單元核心速測兩題組'
      window.videoQuiz.confirmSaveCustomSet()

      const created = window.videoQuiz.customSets.find(s => s.name === '單元核心速測兩題組')
      const hasOptionInDropdown = document.getElementById('vqAdminQuizSelect')?.innerHTML.includes('單元核心速測兩題組')

      return {
        selectedCount,
        createdSet: !!created,
        questionCount: created?.questionIds?.length,
        hasOptionInDropdown
      }
    })

    expect(customSetResult.selectedCount).toBe(2)
    expect(customSetResult.createdSet).toBe(true)
    expect(customSetResult.questionCount).toBe(2)
    expect(customSetResult.hasOptionInDropdown).toBe(true)
  })
})
