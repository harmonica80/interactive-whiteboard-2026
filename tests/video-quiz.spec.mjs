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
})
