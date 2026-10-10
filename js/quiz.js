// 測驗模組
class Quiz {
  constructor() {
    this.currentQuiz = null;
    this.historyBank = {};
    this.quizRef = db.ref('quiz/current');
    this.answersRef = db.ref('quiz/answers');
    this.historyRef = db.ref('quiz/history');
    this.setupFirebaseSync();
    this.initEditorEvents();
  }
  
  setupFirebaseSync() {
    this.quizRef.on('value', (snapshot) => {
      const prevActive = this.currentQuiz?.active;
      this.currentQuiz = snapshot.val();
      this.updateUI();

      // 當老師發起選擇題測驗時，學生端比照專注力測驗，自動切換至測驗分頁無需學生手動點選按鈕
      if (this.currentQuiz && this.currentQuiz.active) {
        if (!window.app?.isAdmin) {
          if (window.app && typeof window.app.switchToTab === 'function') {
            if (window.app.activeTabId !== 'panel-quiz') {
              window.app.switchToTab('panel-quiz');
            }
          }
          if (!prevActive && window.app) {
            const cleanSummary = (this.currentQuiz.question || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
            const displayQuestion = cleanSummary.length > 50 ? cleanSummary.substring(0, 50) + '...' : (cleanSummary || '新題目');
            window.app.showNotification('測驗進行中', `老師已發起測驗：${displayQuestion}`);
          }
        }
      }
    });
    
    this.answersRef.on('value', (snapshot) => {
      const answers = snapshot.val() || {};
      this.updateResults(answers);
    });

    this.historyRef.on('value', (snapshot) => {
      this.historyBank = snapshot.val() || {};
      this.renderQuizHistoryUI();
    });
  }
  
  startQuiz(question, options, quizType = 'single', extraData = {}) {
    if (!question || options.length < 2) {
      if (window.app) window.app.showNotification('提示', '請填寫題目及至少兩個選項');
      return;
    }
    
    // 自動停止搶答與專注力測驗
    db.ref('quiz/buzzGame').set(null);
    db.ref('quiz/focusGame/status').set('idle');
    
    const quizData = {
      question: question,
      options: options,
      quizType: quizType, // 'single', 'multiple', 或 'matching'
      startTime: Date.now(),
      active: true
    };

    if (quizType === 'matching') {
      quizData.pairs = extraData.pairs || [];
      quizData.matchOptions = extraData.matchOptions || (extraData.pairs ? extraData.pairs.map(p => p.right) : []);
      quizData.correctAnswer = extraData.correctAnswer || (extraData.pairs ? extraData.pairs.reduce((acc, p) => { acc[p.left] = p.right; return acc; }, {}) : {});
    }
    
    this.quizRef.set(quizData);
    this.answersRef.remove();

    // 備份至歷屆題目庫
    this.saveToHistoryBank(question, options, quizType, extraData);
  }

  // 儲存至歷屆題目庫 (防重覆)
  saveToHistoryBank(question, options, quizType, extraData = {}) {
    const keys = Object.keys(this.historyBank);
    const exists = keys.some(k => {
      const item = this.historyBank[k];
      return item.question === question && JSON.stringify(item.options) === JSON.stringify(options);
    });

    if (!exists) {
      const historyItem = {
        question: question,
        options: options,
        quizType: quizType || 'single',
        createdAt: Date.now()
      };
      if (quizType === 'matching') {
        historyItem.pairs = extraData.pairs || [];
        historyItem.matchOptions = extraData.matchOptions || (extraData.pairs ? extraData.pairs.map(p => p.right) : []);
        historyItem.correctAnswer = extraData.correctAnswer || {};
      }
      this.historyRef.push(historyItem);
    }
  }
  
  submitAnswer(answerData) {
    if (!this.currentQuiz || !this.currentQuiz.active) return;
    
    let userId = localStorage.getItem('quiz_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('quiz_user_id', userId);
    }
    
    this.answersRef.child(userId).once('value', (snapshot) => {
      if (snapshot.exists()) {
        if (window.app) window.app.showNotification('提示', '您已經投過票了！');
        return;
      }
      this.answersRef.child(userId).set(answerData);
      if (window.app) window.app.showNotification('成功', '投票成功！');
    });
  }

  submitMultipleAnswers() {
    if (!this.currentQuiz || !this.currentQuiz.active || this.currentQuiz.quizType !== 'multiple') return;
    
    const checkedBoxes = document.querySelectorAll('.quiz-multiple-checkbox:checked');
    if (checkedBoxes.length === 0) {
      if (window.app) window.app.showNotification('提示', '請至少勾選一個選項');
      return;
    }

    const selectedIndices = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
    this.submitAnswer(selectedIndices);
  }

  // 學生端提交連連看配對答案
  submitMatchingAnswer() {
    if (!this.currentQuiz || !this.currentQuiz.active || this.currentQuiz.quizType !== 'matching') return;
    const boardContainer = document.getElementById('quizMatchingBoardContainer');
    if (!boardContainer || !window.MatchingQuizEngine) return;

    const connections = window.MatchingQuizEngine.getConnections(boardContainer);
    if (!connections || Object.keys(connections).length === 0) {
      if (window.app) window.app.showNotification('提示', '請先進行連線配對再提交答案！');
      return;
    }

    const submitBtn = document.querySelector('.submit-matching-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.innerText = '✅ 已提交連線答案';
    }

    if (this.currentQuiz.correctAnswer && window.MatchingQuizEngine.renderResults) {
      window.MatchingQuizEngine.renderResults(boardContainer, connections, this.currentQuiz.correctAnswer, { showAnswers: true });
    }

    this.submitAnswer(connections);
  }

  // 老師端題型 Radio 切換處理 (單選 / 複選 / 配對連連看)
  handleQuizTypeChange(type) {
    const container = document.getElementById('optionsContainer');
    if (!container) return;

    if (type === 'matching') {
      container.innerHTML = `
        <div class="option-matching-pair">
          <div class="option-matching-item matching-left-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-left-field" placeholder="左側題目 1 (例如：守株待兔)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-right-field" placeholder="右側答案 1 (例如：妄想不勞而獲)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
        </div>
        <div class="option-matching-pair">
          <div class="option-matching-item matching-left-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-left-field" placeholder="左側題目 2 (例如：臥薪嚐膽)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-right-field" placeholder="右側答案 2 (例如：刻苦自勵)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
        </div>
        <div class="option-matching-pair">
          <div class="option-matching-item matching-left-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-left-field" placeholder="左側題目 3 (例如：水落石出)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <span class="matching-pair-link-icon">🔗</span>
          <div class="option-matching-item matching-right-item" data-type="text">
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片">📝 文字</button>
            <input type="text" class="option-field matching-right-field" placeholder="右側答案 3 (例如：真相大白)">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
          </div>
          <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
        </div>
      `;
    } else {
      if (container.querySelector('.option-matching-pair')) {
        container.innerHTML = `
          <div class="option-input" data-type="text">
            <span class="option-label">1</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片選項">📝 文字</button>
            <input type="text" class="option-field" placeholder="選項 1 文字內容">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
            <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
          </div>
          <div class="option-input" data-type="text">
            <span class="option-label">2</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" title="切換文字或圖片選項">📝 文字</button>
            <input type="text" class="option-field" placeholder="選項 2 文字內容">
            <input type="hidden" class="option-img-data" value="">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="display: none;" title="上傳或貼上圖片">🖼️ 選取圖片</button>
            <img class="option-img-preview-thumb" style="display: none;" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
            <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
          </div>
        `;
      }
    }
  }
  
  endQuiz() {
    if (this.currentQuiz) {
      this.quizRef.update({ active: false });
    }
  }
  
  // 題目內容渲染器 (支援純文字或豐富 HTML，並確保圖片/影片安全居中展示)
  renderQuestionContent(question) {
    if (!question) return '';
    const hasTags = /<[a-z][\s\S]*>/i.test(question);
    if (!hasTags) {
      return `<div class="quiz-question-rendered">${this.escapeHtml(question)}</div>`;
    }
    // 簡單清理潛在危險的 script 標籤
    const cleaned = String(question).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return `<div class="quiz-question-rendered">${cleaned}</div>`;
  }

  // 選項文字/圖片標籤渲染
  getOptionLabel(opt, defaultText = '') {
    if (!opt) return defaultText;
    if (typeof opt === 'string') return opt;
    if (typeof opt === 'object') {
      return opt.text || (opt.image ? '【圖片選項】' : defaultText);
    }
    return String(opt);
  }

  // 學生端選項按鈕內容渲染 (包含圖片與文字)
  renderOptionButtonHtml(opt, index) {
    if (typeof opt === 'object' && opt !== null && opt.image) {
      return `
        <div class="answer-option-img-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
          <img src="${opt.image}" class="answer-option-img" alt="選項 ${index + 1}">
          ${opt.text ? `<span style="font-size: 14px; font-weight: bold;">${this.escapeHtml(opt.text)}</span>` : ''}
        </div>
      `;
    }
    const text = typeof opt === 'object' ? (opt.text || '') : String(opt);
    return `<span>${this.escapeHtml(text)}</span>`;
  }

  updateUI() {
    const quizStatus = document.getElementById('quizStatus');
    const quizForm = document.getElementById('quizForm');
    const answerOptions = document.getElementById('answerOptions');
    const endQuizBtn = document.getElementById('endQuizBtn');
    
    if (this.currentQuiz && this.currentQuiz.active) {
      const isMultiple = this.currentQuiz.quizType === 'multiple';
      const isMatching = this.currentQuiz.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對題 (連連看)' : (isMultiple ? '☑️ 複選題' : '🔘 單選題');
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';

      if (quizStatus) {
        quizStatus.innerHTML = `
          <div class="quiz-status">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 14px; font-weight: bold; color: ${badgeColor};">📝 測驗進行中</span>
              <span class="quiz-type-badge" style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${badgeText}</span>
            </div>
            ${this.renderQuestionContent(this.currentQuiz.question)}
          </div>
        `;
      }
      if (quizForm) quizForm.style.display = 'none';
      if (endQuizBtn) endQuizBtn.style.display = 'block';
      
      // 顯示答題選項
      if (answerOptions) {
        answerOptions.style.display = 'block';
        const quizOpts = Array.isArray(this.currentQuiz.options) ? this.currentQuiz.options : [];
        if (isMatching) {
          answerOptions.innerHTML = `
            <div id="quizMatchingBoardContainer" style="margin-top: 14px;"></div>
            <button class="submit-matching-btn" onclick="window.quiz.submitMatchingAnswer()" style="margin-top: 12px; width: 100%; padding: 12px; background: #5856d6; color: white; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(88,86,214,0.3);">
              🔗 提交連線答案
            </button>
          `;
          if (window.MatchingQuizEngine) {
            const pairs = this.currentQuiz.pairs || (this.currentQuiz.options || []).map((opt, i) => ({
              left: typeof opt === 'object' ? opt.text : opt,
              right: this.currentQuiz.matchOptions?.[i] || ''
            }));
            const leftItems = (this.currentQuiz.options || []).map(opt => typeof opt === 'object' ? opt.text : opt);
            const rightItems = this.currentQuiz.matchOptions || pairs.map(p => p.right);
            window.MatchingQuizEngine.createBoard(document.getElementById('quizMatchingBoardContainer'), {
              id: 'quiz_matching_live',
              pairs,
              leftItems,
              rightItems,
              solution: this.currentQuiz.correctAnswer || null
            });
          }
        } else if (isMultiple) {
          answerOptions.innerHTML = `
            <div class="answer-options-container multiple-choice-container" style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
              ${quizOpts.map((opt, i) => {
                const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
                return `
                  <label class="answer-option-multiple ${isImg ? 'option-has-img' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; user-select: none; transition: all 0.2s ease;">
                    <input type="checkbox" class="quiz-multiple-checkbox" value="${i}" style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--accent-color); flex-shrink: 0;">
                    <div style="flex: 1; text-align: ${isImg ? 'center' : 'left'};">
                      ${this.renderOptionButtonHtml(opt, i)}
                    </div>
                  </label>
                `;
              }).join('')}
              <button class="submit-multiple-btn" onclick="window.quiz.submitMultipleAnswers()" style="margin-top: 10px; width: 100%; padding: 12px; background: var(--accent-color); color: white; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.3);">
                ☑️ 提交答案
              </button>
            </div>
          `;
        } else {
          answerOptions.innerHTML = `
            <div class="answer-options-container">
              ${quizOpts.map((opt, i) => {
                const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
                return `
                  <button class="answer-option ${isImg ? 'option-has-img' : ''}" onclick="window.quiz.submitAnswer(${i})">
                    ${this.renderOptionButtonHtml(opt, i)}
                  </button>
                `;
              }).join('')}
            </div>
          `;
        }
      }
    } else if (this.currentQuiz && !this.currentQuiz.active) {
      const isMultiple = this.currentQuiz.quizType === 'multiple';
      const isMatching = this.currentQuiz.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對題 (連連看)' : (isMultiple ? '☑️ 複選題' : '🔘 單選題');
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';

      if (quizStatus) {
        quizStatus.innerHTML = `
          <div class="quiz-status">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 14px; font-weight: bold; color: var(--text-muted);">⏹️ 測驗已結束</span>
              <span class="quiz-type-badge" style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${badgeText}</span>
            </div>
            ${this.renderQuestionContent(this.currentQuiz.question || '')}
          </div>
        `;
      }
      if (quizForm) quizForm.style.display = 'block';
      if (endQuizBtn) endQuizBtn.style.display = 'none';
      if (answerOptions) {
        answerOptions.style.display = 'none';
        answerOptions.innerHTML = '';
      }
      this.showFinalResults();
    } else {
      this.clearQuizResults();
    }
  }

  // 清除學生端與後台測驗結果及答題介面，回復至「目前沒有進行中的測驗」
  clearQuizResults() {
    const quizStatus = document.getElementById('quizStatus');
    const quizForm = document.getElementById('quizForm');
    const answerOptions = document.getElementById('answerOptions');
    const endQuizBtn = document.getElementById('endQuizBtn');
    const resultsContainer = document.getElementById('quizResults');

    if (quizStatus) quizStatus.innerHTML = '<div style="color: var(--text-muted); text-align: center;">目前沒有進行中的測驗</div>';
    if (quizForm) quizForm.style.display = 'block';
    if (endQuizBtn) endQuizBtn.style.display = 'none';
    if (answerOptions) {
      answerOptions.style.display = 'none';
      answerOptions.innerHTML = '';
    }
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }
  
  updateResults(answers) {
    const resultsContainer = document.getElementById('quizResults');
    if (!resultsContainer) return;
    if (!this.currentQuiz) {
      resultsContainer.innerHTML = '';
      return;
    }
    if (!this.currentQuiz.active) return;

    const totalVoters = Object.keys(answers).length;

    if (this.currentQuiz.quizType === 'matching') {
      const pairs = this.currentQuiz.pairs || (this.currentQuiz.options || []).map((opt, i) => ({
        left: typeof opt === 'object' ? opt.text : opt,
        right: this.currentQuiz.matchOptions?.[i] || ''
      }));

      const pairCorrectCounts = pairs.map(p => {
        let count = 0;
        Object.values(answers).forEach(ans => {
          if (ans && typeof ans === 'object' && ans[p.left] === p.right) {
            count++;
          }
        });
        return count;
      });

      resultsContainer.innerHTML = `
        <div style="margin-bottom: 8px; color: var(--text-secondary); font-size: 12px;">
          已回答: ${totalVoters} 人 (配對連連看計票)
        </div>
        ${pairs.map((p, i) => {
          const cnt = pairCorrectCounts[i];
          const pct = totalVoters > 0 ? Math.round((cnt / totalVoters) * 100) : 0;
          return `
            <div class="result-bar" style="align-items: center; margin-bottom: 8px;">
              <div class="result-label" style="display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; width: auto; font-size: 13px;" title="${this.escapeHtml(p.left)} 🔗 ${this.escapeHtml(p.right)}">
                <span>${this.escapeHtml(p.left)} 🔗 ${this.escapeHtml(p.right)}</span>
              </div>
              <div class="result-progress">
                <div class="result-fill" style="width: ${pct}%; background: #5856d6;">
                  ${cnt}人 (${pct}%)
                </div>
              </div>
            </div>
          `;
        }).join('')}
      `;
      return;
    }
    
    const quizOpts = Array.isArray(this.currentQuiz.options) ? this.currentQuiz.options : [];
    const optionCount = quizOpts.length;
    if (optionCount === 0) return;
    const counts = new Array(optionCount).fill(0);
    
    Object.values(answers).forEach(answer => {
      if (Array.isArray(answer)) {
        answer.forEach(idx => {
          if (idx >= 0 && idx < optionCount) counts[idx]++;
        });
      } else if (typeof answer === 'number' && answer >= 0 && answer < optionCount) {
        counts[answer]++;
      }
    });
    
    resultsContainer.innerHTML = `
      <div style="margin-bottom: 8px; color: var(--text-secondary); font-size: 12px;">
        已回答: ${totalVoters} 人 ${this.currentQuiz.quizType === 'multiple' ? '(複選計票)' : ''}
      </div>
      ${quizOpts.map((opt, i) => {
        const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
        const optText = this.getOptionLabel(opt, `選項 ${i + 1}`);
        return `
          <div class="result-bar" style="align-items: center;">
            <div class="result-label" style="display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; width: auto;" title="${this.escapeHtml(optText)}">
              ${isImg ? `<img src="${opt.image}" style="width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">` : ''}
              <span>${this.escapeHtml(optText)}</span>
            </div>
            <div class="result-progress">
              <div class="result-fill" style="width: ${totalVoters > 0 ? (counts[i] / totalVoters * 100) : 0}%">
                ${counts[i]}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  }
  
  showFinalResults() {
    const resultsContainer = document.getElementById('quizResults');
    if (!resultsContainer) return;
    if (!this.currentQuiz) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    this.answersRef.once('value', (snapshot) => {
      if (!this.currentQuiz) {
        resultsContainer.innerHTML = '';
        return;
      }
      const answers = snapshot.val() || {};
      const totalVoters = Object.keys(answers).length;

      if (this.currentQuiz.quizType === 'matching') {
        const pairs = this.currentQuiz.pairs || (this.currentQuiz.options || []).map((opt, i) => ({
          left: typeof opt === 'object' ? opt.text : opt,
          right: this.currentQuiz.matchOptions?.[i] || ''
        }));
        const pairCorrectCounts = pairs.map(p => {
          let count = 0;
          Object.values(answers).forEach(ans => {
            if (ans && typeof ans === 'object' && ans[p.left] === p.right) {
              count++;
            }
          });
          return count;
        });

        resultsContainer.innerHTML = `
          <div style="padding: 10px; background: var(--bg-input); border-radius: 10px; margin-bottom: 10px;">
            <div style="font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">📊 最終結果 (配對題連連看)</div>
            <div style="font-size: 12px; color: var(--text-secondary);">總計 ${totalVoters} 人作答</div>
          </div>
          ${pairs.map((p, i) => {
            const cnt = pairCorrectCounts[i];
            const pct = totalVoters > 0 ? Math.round((cnt / totalVoters) * 100) : 0;
            return `
              <div class="result-bar" style="align-items: center; margin-bottom: 8px;">
                <div class="result-label" style="display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; width: auto; font-size: 13px;">
                  <span style="color: var(--success-color); font-weight: bold;">✅ ${this.escapeHtml(p.left)} 🔗 ${this.escapeHtml(p.right)}</span>
                </div>
                <div class="result-progress">
                  <div class="result-fill" style="width: ${pct}%; background: #5856d6;">
                    ${cnt} (${pct}%)
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        `;
        return;
      }

      const quizOpts = (this.currentQuiz && Array.isArray(this.currentQuiz.options)) ? this.currentQuiz.options : [];
      const optionCount = quizOpts.length;
      if (optionCount === 0) {
        resultsContainer.innerHTML = '';
        return;
      }
      const counts = new Array(optionCount).fill(0);
      
      Object.values(answers).forEach(answer => {
        if (Array.isArray(answer)) {
          answer.forEach(idx => {
            if (idx >= 0 && idx < optionCount) counts[idx]++;
          });
        } else if (typeof answer === 'number' && answer >= 0 && answer < optionCount) {
          counts[answer]++;
        }
      });
      
      if (totalVoters === 0) {
        resultsContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 13px;">無人作答</div>';
        return;
      }
      
      resultsContainer.innerHTML = `
        <div style="padding: 10px; background: var(--bg-input); border-radius: 10px; margin-bottom: 10px;">
          <div style="font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">📊 最終結果</div>
          <div style="font-size: 12px; color: var(--text-secondary);">總計 ${totalVoters} 人作答 ${this.currentQuiz.quizType === 'multiple' ? '(複選題)' : ''}</div>
        </div>
        ${quizOpts.map((opt, i) => {
          const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
          const optText = this.getOptionLabel(opt, `選項 ${i + 1}`);
          return `
            <div class="result-bar" style="align-items: center;">
              <div class="result-label" style="display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; width: auto;" title="${this.escapeHtml(optText)}">
                ${isImg ? `<img src="${opt.image}" style="width: 28px; height: 28px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">` : ''}
                <span>${this.escapeHtml(optText)}</span>
              </div>
              <div class="result-progress">
                <div class="result-fill" style="width: ${totalVoters > 0 ? (counts[i] / totalVoters * 100) : 0}%">
                  ${counts[i]} (${totalVoters > 0 ? Math.round(counts[i] / totalVoters * 100) : 0}%)
                </div>
              </div>
            </div>
          `;
        }).join('')}
      `;
    });
  }

  // 渲染歷屆題目庫 UI
  renderQuizHistoryUI() {
    const listContainer = document.getElementById('quizHistoryList');
    const countSpan = document.getElementById('quizHistoryCount');
    if (!listContainer) return;

    const keys = Object.keys(this.historyBank);
    if (countSpan) countSpan.textContent = `(${keys.length} 題)`;

    if (keys.length === 0) {
      listContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 12px; padding: 12px;">目前歷史題庫空白（發起或匯入題目後會自動保存）</div>';
      return;
    }

    // 按建立時間由新到舊排序
    const sortedKeys = keys.sort((a, b) => (this.historyBank[b].createdAt || 0) - (this.historyBank[a].createdAt || 0));

    listContainer.innerHTML = sortedKeys.map(key => {
      const q = this.historyBank[key];
      const isMultiple = q.quizType === 'multiple';
      const isMatching = q.quizType === 'matching';
      const badgeText = isMatching ? '🔗 配對' : (isMultiple ? '☑️ 複選' : '🔘 單選');
      const badgeBg = isMatching ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.1)';
      const badgeColor = isMatching ? '#5856d6' : 'var(--accent-color)';

      let optionsStr = '';
      if (isMatching && q.pairs && q.pairs.length > 0) {
        optionsStr = q.pairs.map(p => `${p.left} = ${p.right}`).join(' | ');
      } else {
        optionsStr = (q.options || []).map((opt, i) => this.getOptionLabel(opt, `選項 ${i + 1}`)).join(' | ');
      }
      const questionText = (q.question || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() || (q.question || '');

      return `
        <div class="quiz-history-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <input type="checkbox" class="quiz-history-checkbox" value="${key}" style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--accent-color);">
            <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 11px; padding: 1px 6px; border-radius: 6px; font-weight: bold; flex-shrink: 0;">${badgeText}</span>
                <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(questionText)}</span>
              </div>
              <div style="font-size: 11px; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                選項：${this.escapeHtml(optionsStr)}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button type="button" class="btn btn-secondary" onclick="window.app && window.app.openSingleItemCopyModal('quiz', '${key}')" style="padding: 4px 8px; font-size: 11px; color: var(--accent-color); font-weight: bold;" title="複製此題到其他班級歷屆題庫">📤 複製</button>
            <button type="button" class="btn btn-secondary" onclick="window.quiz.loadQuizFromHistory('${key}')" style="padding: 4px 8px; font-size: 11px; font-weight: bold;" title="帶入此題到出題框">🚀 載入</button>
            <button type="button" class="btn btn-secondary" onclick="window.quiz.deleteQuizHistoryItem('${key}')" style="padding: 4px 8px; font-size: 11px; color: var(--danger-color);" title="刪除此題">✕</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 切換全選 / 全不選
  toggleSelectAllHistory(isChecked) {
    const checkboxes = document.querySelectorAll('.quiz-history-checkbox');
    checkboxes.forEach(cb => cb.checked = isChecked);
  }

  // 匯出勾選的題目庫 TXT
  exportSelectedQuizBankTxt() {
    const checkedBoxes = document.querySelectorAll('.quiz-history-checkbox:checked');
    if (checkedBoxes.length === 0) {
      if (window.app) window.app.showNotification('提示', '請先勾選欲匯出的題目！');
      return;
    }

    const selectedKeys = Array.from(checkedBoxes).map(cb => cb.value);
    const questionsToExport = selectedKeys.map(k => this.historyBank[k]).filter(Boolean);

    this.downloadQuizBankTxt(questionsToExport, "selected_quiz_bank.txt");
    if (window.app) window.app.showNotification('成功', `已成功匯出 ${questionsToExport.length} 道選取題目！`);
  }

  // 匯出全部歷屆題目庫 TXT
  exportAllQuizBankTxt() {
    const keys = Object.keys(this.historyBank);
    if (keys.length === 0) {
      if (window.app) window.app.showNotification('提示', '歷屆題目庫目前無任何題目可匯出');
      return;
    }

    const allQuestions = keys.map(k => this.historyBank[k]);
    this.downloadQuizBankTxt(allQuestions, "all_quiz_bank.txt");
    if (window.app) window.app.showNotification('成功', `已成功匯出全部 ${allQuestions.length} 道題目！`);
  }

  // 下載 TXT 工具方法
  downloadQuizBankTxt(questions, filename) {
    const txtBlocks = questions.map(q => {
      let typeStr = '單選';
      if (q.quizType === 'matching') typeStr = '配對';
      else if (q.quizType === 'multiple') typeStr = '複選';

      let optionsText = '';
      if (q.quizType === 'matching' && q.pairs && q.pairs.length > 0) {
        optionsText = q.pairs.map(p => `${p.left} = ${p.right}`).join('\n');
      } else {
        optionsText = (q.options || []).map(opt => {
          if (typeof opt === 'object' && opt !== null) {
            return opt.text ? `${opt.text} [圖片選項]` : '[圖片選項]';
          }
          return String(opt);
        }).join('\n');
      }
      return `${q.question}\n${typeStr}\n${optionsText}`;
    });

    const txtContent = txtBlocks.join('\n\n---\n\n');
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // 執行編輯器指令
  execEditorCmd(cmd, value = null) {
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    document.execCommand(cmd, false, value);
  }

  // 清空題目編輯器
  clearEditor() {
    const editor = document.getElementById('quizQuestionEditor');
    if (editor) editor.innerHTML = '';
  }

  // 初始化編輯器事件（貼上圖片監聽與點擊外部關閉選單）
  initEditorEvents() {
    const bindEvents = () => {
      const editor = document.getElementById('quizQuestionEditor');
      if (editor && !editor.__eventsBound) {
        editor.__eventsBound = true;
        editor.addEventListener('paste', (e) => {
          const clipboardData = e.clipboardData || window.clipboardData;
          if (!clipboardData) return;
          const items = clipboardData.items;
          if (!items) return;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  this.compressAndInsertImage(ev.target.result);
                };
                reader.readAsDataURL(file);
                return;
              }
            }
          }
        });
      }

      // 選項欄位也支援直接貼上剪貼簿圖片
      const optionsContainer = document.getElementById('optionsContainer');
      if (optionsContainer && !optionsContainer.__eventsBound) {
        optionsContainer.__eventsBound = true;
        optionsContainer.addEventListener('paste', (e) => {
          const row = e.target.closest('.option-input');
          if (!row) return;
          const clipboardData = e.clipboardData || window.clipboardData;
          if (!clipboardData) return;
          const items = clipboardData.items;
          if (!items) return;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                this.currentEditingOptionRow = row;
                const toggleBtn = row.querySelector('.option-type-toggle-btn');
                if (row.getAttribute('data-type') !== 'image' && toggleBtn) {
                  this.toggleOptionType(toggleBtn);
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  this.compressOptionImage(ev.target.result);
                };
                reader.readAsDataURL(file);
                return;
              }
            }
          }
        });
      }

      if (!window.__quizDropdownClickBound) {
        window.__quizDropdownClickBound = true;
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.quiz-editor-dropdown-wrapper')) {
            this.closeAllDropdowns();
          }
          const optMenu = document.getElementById('quizOptionImgActionMenu');
          if (optMenu && !e.target.closest('#quizOptionImgActionMenu') && !e.target.closest('.option-img-btn')) {
            optMenu.style.display = 'none';
          }
        });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindEvents);
    } else {
      bindEvents();
    }
  }

  // 切換工具列下拉選單
  toggleDropdown(dropdownId, event) {
    if (event) event.stopPropagation();
    const target = document.getElementById(dropdownId);
    const wasOpen = target && target.style.display === 'block';
    this.closeAllDropdowns();
    if (target && !wasOpen) {
      target.style.display = 'block';
      target.style.left = '0';
      target.style.right = 'auto';
      const rect = target.getBoundingClientRect();
      if (rect.right > (window.innerWidth - 12)) {
        target.style.left = 'auto';
        target.style.right = '0';
      }
    }
  }

  // 關閉所有編輯器下拉選單
  closeAllDropdowns() {
    document.querySelectorAll('.quiz-editor-dropdown-menu').forEach(m => {
      m.style.display = 'none';
    });
  }

  // 設定段落區塊樣式 (h1, h2, h3, p, blockquote, pre)
  handleFormatBlock(tag) {
    if (!tag) return;
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    document.execCommand('formatBlock', false, `<${tag.toUpperCase()}>`);
  }

  // 設定字體大小 (1~7)
  handleFontSize(size) {
    if (!size) return;
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    document.execCommand('fontSize', false, size);
  }

  // 設定文字色彩
  setTextColor(color) {
    this.closeAllDropdowns();
    this.execEditorCmd('foreColor', color);
  }

  // 設定螢光筆標記色彩
  setHighlightColor(color) {
    this.closeAllDropdowns();
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    if (color === 'transparent') {
      document.execCommand('removeFormat', false, null);
    } else {
      try {
        document.execCommand('hiliteColor', false, color);
      } catch (e) {
        document.execCommand('backColor', false, color);
      }
    }
  }

  // 觸發本機圖檔上傳
  triggerImageUpload() {
    this.closeAllDropdowns();
    const fileInput = document.getElementById('quizEditorImgFileInput');
    if (fileInput) fileInput.click();
  }

  // 壓縮圖檔並插入編輯器
  compressAndInsertImage(src) {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      this.insertEditorImageHtml(dataUrl);
    };
    img.src = src;
  }

  // 處理題目編輯器圖檔上傳
  handleEditorImgUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (window.app) window.app.showNotification('提示', '請選擇圖片檔案');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.compressAndInsertImage(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  // 從網址插入圖片
  insertImageFromUrl() {
    const input = document.getElementById('quizEditorImgUrlInput');
    const url = input ? input.value.trim() : '';
    if (!url) {
      if (window.app) window.app.showNotification('提示', '請輸入圖片網址');
      return;
    }
    this.closeAllDropdowns();
    if (input) input.value = '';
    this.insertEditorImageHtml(url);
  }

  // 從剪貼簿讀取圖片並貼上
  async pasteFromClipboard() {
    this.closeAllDropdowns();
    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        let found = false;
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const reader = new FileReader();
              reader.onload = (e) => {
                this.compressAndInsertImage(e.target.result);
              };
              reader.readAsDataURL(blob);
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) {
          if (window.app) window.app.showNotification('成功', '已從剪貼簿插入圖片！');
          return;
        }
      } catch (err) {
        console.warn('Clipboard read failed:', err);
      }
    }
    const editor = document.getElementById('quizQuestionEditor');
    if (editor) editor.focus();
    if (window.app) {
      window.app.showNotification('提示', '請在題目編輯框中直接按下 Ctrl+V (或 ⌘+V) 即可貼上剪貼簿圖片！');
    }
  }

  // 在編輯器光標處或尾端插入圖片
  insertEditorImageHtml(src) {
    const editor = document.getElementById('quizQuestionEditor');
    if (!editor) return;
    editor.focus();
    const imgHtml = `<p><img src="${src}" alt="題目圖片" style="max-width: 100%; max-height: 260px; border-radius: 8px; margin: 6px 0; display: block;"></p><p><br></p>`;
    document.execCommand('insertHTML', false, imgHtml);
  }

  // 從影片與音樂選單插入
  insertVideoFromUrl() {
    const input = document.getElementById('quizEditorVideoUrlInput');
    const url = input ? input.value.trim() : '';
    if (!url) {
      if (window.app) window.app.showNotification('提示', '請輸入影片或音樂網址');
      return;
    }
    this.closeAllDropdowns();
    if (input) input.value = '';
    this.embedVideoToEditor(url);
  }

  // 嵌入影片或音樂至編輯器
  embedVideoToEditor(url) {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();

    let embedHtml = '';
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
    if (ytMatch && ytMatch[1]) {
      const ytId = ytMatch[1];
      embedHtml = `<p><iframe src="https://www.youtube.com/embed/${ytId}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width: 100%; max-width: 500px; aspect-ratio: 16/9; border: none; border-radius: 8px; margin: 6px 0; display: block;"></iframe></p><p><br></p>`;
    } else if (cleanUrl.includes('drive.google.com')) {
      const driveEmbed = cleanUrl.replace(/\/view(\?.*)?$/, '/preview');
      embedHtml = `<p><iframe src="${driveEmbed}" allow="autoplay" allowfullscreen style="width: 100%; max-width: 500px; aspect-ratio: 16/9; border: none; border-radius: 8px; margin: 6px 0; display: block;"></iframe></p><p><br></p>`;
    } else if (cleanUrl.match(/\.(mp3|wav|m4a|aac|flac|oga)($|\?)/i)) {
      embedHtml = `<p><audio src="${cleanUrl}" controls style="width: 100%; max-width: 500px; margin: 6px 0; display: block;"></audio></p><p><br></p>`;
    } else if (cleanUrl.match(/\.(mp4|webm|ogg)($|\?)/i)) {
      embedHtml = `<p><video src="${cleanUrl}" controls style="width: 100%; max-width: 500px; max-height: 280px; border-radius: 8px; margin: 6px 0; display: block;"></video></p><p><br></p>`;
    } else {
      embedHtml = `<p><iframe src="${cleanUrl}" allowfullscreen style="width: 100%; max-width: 500px; aspect-ratio: 16/9; border: none; border-radius: 8px; margin: 6px 0; display: block;"></iframe></p><p><br></p>`;
    }

    const editor = document.getElementById('quizQuestionEditor');
    if (editor) {
      editor.focus();
      document.execCommand('insertHTML', false, embedHtml);
    }
  }

  // 相容保留舊方法
  promptInsertEditorImage() {
    this.toggleDropdown('quizImageDropdown');
  }

  promptInsertEditorVideo() {
    this.toggleDropdown('quizVideoDropdown');
  }

  // 切換選項類型（文字 / 圖片）
  toggleOptionType(btn) {
    const row = btn.closest('.option-input, .option-matching-item, .vq-option-row-item');
    if (!row) return;
    const curType = row.getAttribute('data-type') || 'text';
    const textField = row.querySelector('.option-field, .matching-left-field, .matching-right-field, .vq-option-text-field');
    const imgBtn = row.querySelector('.option-img-btn');
    const imgThumb = row.querySelector('.option-img-preview-thumb');
    const imgData = row.querySelector('.option-img-data');

    if (curType === 'text') {
      row.setAttribute('data-type', 'image');
      btn.innerHTML = '🖼️ 圖片';
      btn.style.color = '#ff9500';
      btn.style.borderColor = '#ff9500';
      if (textField) {
        if (!textField.hasAttribute('data-original-placeholder')) {
          textField.setAttribute('data-original-placeholder', textField.placeholder || '選項文字內容');
        }
        textField.placeholder = '說明文字或留空';
      }
      if (imgBtn) imgBtn.style.display = 'inline-flex';
      if (imgData && imgData.value && imgThumb) {
        imgThumb.src = imgData.value;
        imgThumb.style.display = 'inline-block';
      }
    } else {
      row.setAttribute('data-type', 'text');
      btn.innerHTML = '📝 文字';
      btn.style.color = 'var(--text-secondary)';
      btn.style.borderColor = 'var(--border-color)';
      if (textField) {
        textField.placeholder = textField.getAttribute('data-original-placeholder') || '選項文字內容';
      }
      if (imgBtn) imgBtn.style.display = 'none';
      if (imgThumb) imgThumb.style.display = 'none';
    }
  }

  // 選取選項圖片（彈出選單：上傳圖檔 / 從剪貼簿貼上）
  selectOptionImage(btn, event) {
    const ev = event || window.event;
    if (ev) ev.stopPropagation();
    const row = btn.closest('.option-input, .option-matching-item, .vq-option-row-item');
    if (!row) return;
    this.currentEditingOptionRow = row;

    let menu = document.getElementById('quizOptionImgActionMenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'quizOptionImgActionMenu';
      menu.className = 'quiz-editor-dropdown-menu';
      menu.style.position = 'fixed';
      menu.style.zIndex = '9999';
      menu.innerHTML = `
        <div class="quiz-dropdown-item" onclick="window.quiz && window.quiz.triggerOptionFileUpload()">
          📁 上傳電腦圖檔...
        </div>
        <div class="quiz-dropdown-item" onclick="window.quiz && window.quiz.pasteOptionFromClipboard()">
          📋 從剪貼簿貼上圖片
        </div>
      `;
      document.body.appendChild(menu);
    }

    const rect = btn.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${Math.max(10, rect.left - 40)}px`;
    menu.style.display = 'block';
  }

  // 觸發選項電腦圖檔上傳
  triggerOptionFileUpload() {
    const menu = document.getElementById('quizOptionImgActionMenu');
    if (menu) menu.style.display = 'none';

    const fileInput = document.getElementById('quizOptionImgFileInput');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.compressOptionImage(ev.target.result);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      };
      fileInput.click();
    }
  }

  // 從剪貼簿為選項貼上圖片
  async pasteOptionFromClipboard() {
    const menu = document.getElementById('quizOptionImgActionMenu');
    if (menu) menu.style.display = 'none';

    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        let found = false;
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const reader = new FileReader();
              reader.onload = (e) => {
                this.compressOptionImage(e.target.result);
              };
              reader.readAsDataURL(blob);
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) return;
      } catch (err) {
        console.warn('Clipboard read error for option:', err);
      }
    }

    if (this.currentEditingOptionRow) {
      const field = this.currentEditingOptionRow.querySelector('.option-field');
      if (field) field.focus();
    }
    if (window.app) {
      window.app.showNotification('提示', '未能直接讀取剪貼簿，請點「上傳電腦圖檔」或在此選項輸入框中直接按 Ctrl+V 貼上圖片！');
    }
  }

  // 壓縮選項圖檔並設定
  compressOptionImage(src) {
    const img = new Image();
    img.onload = () => {
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      this.setOptionImage(dataUrl);
      if (window.app) window.app.showNotification('成功', '已成功設定選項圖片！');
    };
    img.src = src;
  }

  // 設定選項列圖片
  setOptionImage(dataUrl) {
    if (!this.currentEditingOptionRow) return;
    const dataInput = this.currentEditingOptionRow.querySelector('.option-img-data');
    const thumb = this.currentEditingOptionRow.querySelector('.option-img-preview-thumb');
    const btn = this.currentEditingOptionRow.querySelector('.option-img-btn');
    if (dataInput) dataInput.value = dataUrl;
    if (thumb) {
      thumb.src = dataUrl;
      thumb.style.display = 'inline-block';
    }
    if (btn) btn.textContent = '🔄 更換圖片';
  }

  // 預覽選項大圖
  previewOptionImg(src) {
    if (!src) return;
    if (window.app && typeof window.app.showNotification === 'function') {
      const modal = document.getElementById('notifyModal');
      const textEl = document.getElementById('notifyModalText');
      if (modal && textEl) {
        document.getElementById('notifyModalTitle').textContent = '🖼️ 圖片預覽';
        textEl.innerHTML = `<img src="${src}" style="max-width: 100%; max-height: 70vh; border-radius: 8px; display: block; margin: 0 auto;">`;
        modal.classList.add('active');
        return;
      }
    }
    window.open(src, '_blank');
  }

  // 載入歷史題目至出題框
  loadQuizFromHistory(key) {
    const item = this.historyBank[key];
    if (!item) return;

    // 將題目文字/HTML 載入編輯器
    const editor = document.getElementById('quizQuestionEditor');
    if (editor) {
      editor.innerHTML = item.question || '';
    }
    const qInput = document.getElementById('quizQuestion');
    if (qInput) qInput.value = item.question || '';

    if (item.quizType === 'matching') {
      const radMatching = document.querySelector('input[name="quizTypeRadio"][value="matching"]');
      if (radMatching) radMatching.checked = true;
      const pairs = item.pairs || (item.options || []).map((opt, i) => ({
        left: typeof opt === 'object' ? opt.text : opt,
        right: item.matchOptions?.[i] || ''
      }));
      const container = document.getElementById('optionsContainer');
      if (container && pairs.length > 0) {
        container.innerHTML = pairs.map((p, idx) => {
          const isLeftImg = typeof p.left === 'object' && p.left !== null && !!p.left.image;
          const leftText = isLeftImg ? (p.left.text || '') : (typeof p.left === 'object' ? (p.left.text || '') : String(p.left || ''));
          const leftImg = isLeftImg ? p.left.image : '';

          const isRightImg = typeof p.right === 'object' && p.right !== null && !!p.right.image;
          const rightText = isRightImg ? (p.right.text || '') : (typeof p.right === 'object' ? (p.right.text || '') : String(p.right || ''));
          const rightImg = isRightImg ? p.right.image : '';

          return `
            <div class="option-matching-pair">
              <div class="option-matching-item matching-left-item" data-type="${isLeftImg ? 'image' : 'text'}">
                <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isLeftImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                  ${isLeftImg ? '🖼️ 圖片' : '📝 文字'}
                </button>
                <input type="text" class="option-field matching-left-field" value="${this.escapeHtml(leftText)}" placeholder="${isLeftImg ? '說明文字或留空' : '左側題目 ' + (idx + 1)}">
                <input type="hidden" class="option-img-data" value="${this.escapeHtml(leftImg)}">
                <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isLeftImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                  ${isLeftImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                </button>
                <img class="option-img-preview-thumb" src="${this.escapeHtml(leftImg)}" style="${isLeftImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
              </div>
              <span class="matching-pair-link-icon">🔗</span>
              <div class="option-matching-item matching-right-item" data-type="${isRightImg ? 'image' : 'text'}">
                <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isRightImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                  ${isRightImg ? '🖼️ 圖片' : '📝 文字'}
                </button>
                <input type="text" class="option-field matching-right-field" value="${this.escapeHtml(rightText)}" placeholder="${isRightImg ? '說明文字或留空' : '右側答案 ' + (idx + 1)}">
                <input type="hidden" class="option-img-data" value="${this.escapeHtml(rightImg)}">
                <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isRightImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                  ${isRightImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                </button>
                <img class="option-img-preview-thumb" src="${this.escapeHtml(rightImg)}" style="${isRightImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
              </div>
              <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
            </div>
          `;
        }).join('');
      }
      if (window.app) window.app.showNotification('成功', '已載入此題至出題框！');
      return;
    }

    if (item.quizType === 'multiple') {
      const radMulti = document.querySelector('input[name="quizTypeRadio"][value="multiple"]');
      if (radMulti) radMulti.checked = true;
    } else {
      const radSingle = document.querySelector('input[name="quizTypeRadio"][value="single"]');
      if (radSingle) radSingle.checked = true;
    }

    const container = document.getElementById('optionsContainer');
    if (container && Array.isArray(item.options)) {
      container.innerHTML = item.options.map((opt, idx) => {
        const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
        const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt));
        const imgSrc = isImg ? opt.image : '';

        return `
          <div class="option-input" data-type="${isImg ? 'image' : 'text'}">
            <span class="option-label">${idx + 1}</span>
            <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
              ${isImg ? '🖼️ 圖片' : '📝 文字'}
            </button>
            <input type="text" class="option-field" value="${this.escapeHtml(optText)}" placeholder="${isImg ? '說明文字或留空' : '選項文字內容'}">
            <input type="hidden" class="option-img-data" value="${this.escapeHtml(imgSrc)}">
            <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isImg ? 'display: inline-flex;' : 'display: none;'}">
              ${isImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
            </button>
            <img class="option-img-preview-thumb" src="${this.escapeHtml(imgSrc)}" style="${isImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
            <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
          </div>
        `;
      }).join('');
    }

    if (window.app) window.app.showNotification('成功', '已載入此題至出題框！');
  }

  // 刪除單題歷史紀錄 (新增彈窗確認動作)
  deleteQuizHistoryItem(key) {
    const item = this.historyBank[key];
    const qText = item ? item.question : '';

    if (window.app) {
      window.app.showConfirmModal(
        '🗑️',
        '確定要刪除此題目嗎？',
        qText ? `題目：「${qText}」\n刪除後將無法復原。` : '此動作無法復原。',
        () => {
          this.historyRef.child(key).remove();
          window.app.showNotification('成功', '已刪除該題目！');
        }
      );
    } else {
      if (confirm(`確定要刪除題目「${qText}」嗎？`)) {
        this.historyRef.child(key).remove();
      }
    }
  }

  // 清空歷屆題庫
  clearHistoryBank() {
    if (window.app) {
      window.app.showConfirmModal(
        '🗑️',
        '確定要清空歷屆題庫嗎？',
        '這將刪除所有在後台保存的歷史題目，此動作無法復原。',
        () => {
          this.historyRef.remove();
          window.app.showNotification('成功', '已清空歷屆題庫！');
        }
      );
    }
  }

  // 匯出純文字檔 TXT 格式範例
  exportQuizBankTxt() {
    const sampleTxtContent = `您對今天的課堂內容滿意度如何？
單選
⭐ 1 星
⭐⭐ 2 星
⭐⭐⭐ 3 星
⭐⭐⭐⭐ 4 星
⭐⭐⭐⭐⭐ 5 星

---

請問下列哪些是網頁前端開發的核心語言？
複選
HTML
CSS
JavaScript
Python

---

您對今天的教學節奏滿意嗎？
單選
😍 非常滿意
👍 滿意
😐 普通
👎 不滿意
😡 非常不滿意`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(sampleTxtContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sample_quiz_bank.txt");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (window.app) window.app.showNotification('成功', '已下載純文字格式 (.txt) 題目檔！');
  }

  // 匯入純文字檔 TXT 格式題目庫
  importQuizBankTxtFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const textContent = e.target.result;
        let questions = [];

        // 嘗試解析 JSON 作為向下相容備用
        if (textContent.trim().startsWith('[') && textContent.trim().endsWith(']')) {
          try {
            questions = JSON.parse(textContent);
          } catch(err) { /* ignore JSON parse error */ }
        }

        // 若不是 JSON，則進行 TXT 段落解析
        if (questions.length === 0) {
          const blocks = textContent.split(/\n\s*---\s*\n|\n\s*\n\s*\n/).map(b => b.trim()).filter(Boolean);
          blocks.forEach(block => {
            const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '' && l !== '---');
            if (lines.length >= 3) {
              const question = lines[0];
              const typeStr = lines[1];
              let quizType = 'single';
              if (typeStr.includes('配對') || typeStr.includes('連') || typeStr.toLowerCase().includes('match')) {
                quizType = 'matching';
              } else if (typeStr.includes('複') || typeStr.toLowerCase().includes('multi')) {
                quizType = 'multiple';
              }

              const rawOptions = lines.slice(2);
              if (quizType === 'matching') {
                const pairs = [];
                rawOptions.forEach(optLine => {
                  const parts = optLine.split(/[=＝]/);
                  if (parts.length >= 2) {
                    const left = parts[0].trim();
                    const right = parts.slice(1).join('=').trim();
                    if (left && right) pairs.push({ left, right });
                  }
                });
                if (pairs.length >= 2) {
                  questions.push({
                    question,
                    quizType,
                    options: pairs.map(p => p.left),
                    matchOptions: pairs.map(p => p.right),
                    pairs,
                    correctAnswer: pairs.reduce((acc, p) => { acc[p.left] = p.right; return acc; }, {})
                  });
                }
              } else if (rawOptions.length >= 2) {
                questions.push({ question, quizType, options: rawOptions });
              }
            }
          });
        }

        if (questions.length === 0) {
          if (window.app) window.app.showNotification('錯誤', '匯入失敗：格式無法解析，請參考格式範例');
          return;
        }

        // 自動寫入歷屆題目庫
        questions.forEach(q => {
          this.saveToHistoryBank(q.question, q.options, q.quizType, q);
        });

        // 帶入第一題
        const q0 = questions[0];
        if (q0 && q0.question && Array.isArray(q0.options)) {
          const editor = document.getElementById('quizQuestionEditor');
          if (editor) editor.innerHTML = q0.question;
          const qInput = document.getElementById('quizQuestion');
          if (qInput) qInput.value = q0.question;
          
          if (q0.quizType === 'matching') {
            const radMatching = document.querySelector('input[name="quizTypeRadio"][value="matching"]');
            if (radMatching) radMatching.checked = true;
            const container = document.getElementById('optionsContainer');
            if (container && q0.pairs && q0.pairs.length > 0) {
              container.innerHTML = q0.pairs.map((p, idx) => {
                const isLeftImg = typeof p.left === 'object' && p.left !== null && !!p.left.image;
                const leftText = isLeftImg ? (p.left.text || '') : (typeof p.left === 'object' ? (p.left.text || '') : String(p.left || ''));
                const leftImg = isLeftImg ? p.left.image : '';

                const isRightImg = typeof p.right === 'object' && p.right !== null && !!p.right.image;
                const rightText = isRightImg ? (p.right.text || '') : (typeof p.right === 'object' ? (p.right.text || '') : String(p.right || ''));
                const rightImg = isRightImg ? p.right.image : '';

                return `
                  <div class="option-matching-pair">
                    <div class="option-matching-item matching-left-item" data-type="${isLeftImg ? 'image' : 'text'}">
                      <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isLeftImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                        ${isLeftImg ? '🖼️ 圖片' : '📝 文字'}
                      </button>
                      <input type="text" class="option-field matching-left-field" value="${this.escapeHtml(leftText)}" placeholder="${isLeftImg ? '說明文字或留空' : '左側題目 ' + (idx + 1)}">
                      <input type="hidden" class="option-img-data" value="${this.escapeHtml(leftImg)}">
                      <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isLeftImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                        ${isLeftImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                      </button>
                      <img class="option-img-preview-thumb" src="${this.escapeHtml(leftImg)}" style="${isLeftImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
                    </div>
                    <span class="matching-pair-link-icon">🔗</span>
                    <div class="option-matching-item matching-right-item" data-type="${isRightImg ? 'image' : 'text'}">
                      <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isRightImg ? 'color: #ff9500; border-color: #ff9500;' : ''}" title="切換文字或圖片">
                        ${isRightImg ? '🖼️ 圖片' : '📝 文字'}
                      </button>
                      <input type="text" class="option-field matching-right-field" value="${this.escapeHtml(rightText)}" placeholder="${isRightImg ? '說明文字或留空' : '右側答案 ' + (idx + 1)}">
                      <input type="hidden" class="option-img-data" value="${this.escapeHtml(rightImg)}">
                      <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isRightImg ? 'display: inline-flex;' : 'display: none;'}" title="上傳或貼上圖片">
                        ${isRightImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                      </button>
                      <img class="option-img-preview-thumb" src="${this.escapeHtml(rightImg)}" style="${isRightImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
                    </div>
                    <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
                  </div>
                `;
              }).join('');
            }
          } else if (q0.quizType === 'multiple') {
            const radMulti = document.querySelector('input[name="quizTypeRadio"][value="multiple"]');
            if (radMulti) radMulti.checked = true;
          } else {
            const radSingle = document.querySelector('input[name="quizTypeRadio"][value="single"]');
            if (radSingle) radSingle.checked = true;
          }

          // 重新填入非配對選項
          if (q0.quizType !== 'matching') {
            const container = document.getElementById('optionsContainer');
            if (container) {
              container.innerHTML = q0.options.map((opt, idx) => {
                const isImg = typeof opt === 'object' && opt !== null && !!opt.image;
                const optText = isImg ? (opt.text || '') : (typeof opt === 'object' ? (opt.text || '') : String(opt));
                const imgSrc = isImg ? opt.image : '';

                return `
                  <div class="option-input" data-type="${isImg ? 'image' : 'text'}">
                    <span class="option-label">${idx + 1}</span>
                    <button type="button" class="option-type-toggle-btn" onclick="window.quiz && window.quiz.toggleOptionType(this)" style="${isImg ? 'color: #ff9500; border-color: #ff9500;' : ''}">
                      ${isImg ? '🖼️ 圖片' : '📝 文字'}
                    </button>
                    <input type="text" class="option-field" value="${this.escapeHtml(optText)}" placeholder="${isImg ? '說明文字或留空' : '選項文字內容'}">
                    <input type="hidden" class="option-img-data" value="${this.escapeHtml(imgSrc)}">
                    <button type="button" class="option-img-btn" onclick="window.quiz && window.quiz.selectOptionImage(this, event)" style="${isImg ? 'display: inline-flex;' : 'display: none;'}">
                      ${isImg ? '🔄 更換圖片' : '🖼️ 選取圖片'}
                    </button>
                    <img class="option-img-preview-thumb" src="${this.escapeHtml(imgSrc)}" style="${isImg ? 'display: inline-block;' : 'display: none;'}" title="點擊預覽大圖" onclick="window.quiz && window.quiz.previewOptionImg(this.src)">
                    <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
                  </div>
                `;
              }).join('');
            }
          }
        }


        if (window.app) window.app.showNotification('成功', `已成功解析並儲存 ${questions.length} 個題目至歷屆題目庫！第一題已自動帶入出題框`);
      } catch (err) {
        if (window.app) window.app.showNotification('錯誤', '解析文字檔失敗: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
