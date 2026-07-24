// 測驗模組
class Quiz {
  constructor() {
    this.currentQuiz = null;
    this.quizRef = db.ref('quiz/current');
    this.answersRef = db.ref('quiz/answers');
    this.setupFirebaseSync();
  }
  
  setupFirebaseSync() {
    this.quizRef.on('value', (snapshot) => {
      this.currentQuiz = snapshot.val();
      this.updateUI();
    });
    
    this.answersRef.on('value', (snapshot) => {
      const answers = snapshot.val() || {};
      this.updateResults(answers);
    });
  }
  
  startQuiz(question, options, quizType = 'single') {
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
      quizType: quizType, // 'single' 或 'multiple'
      startTime: Date.now(),
      active: true
    };
    
    this.quizRef.set(quizData);
    this.answersRef.remove();
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
  
  endQuiz() {
    if (this.currentQuiz) {
      this.quizRef.update({ active: false });
    }
  }
  
  updateUI() {
    const quizStatus = document.getElementById('quizStatus');
    const quizForm = document.getElementById('quizForm');
    const answerOptions = document.getElementById('answerOptions');
    const endQuizBtn = document.getElementById('endQuizBtn');
    
    if (this.currentQuiz && this.currentQuiz.active) {
      const isMultiple = this.currentQuiz.quizType === 'multiple';
      const badgeText = isMultiple ? '☑️ 複選題' : '🔘 單選題';

      if (quizStatus) {
        quizStatus.innerHTML = `
          <div class="quiz-status">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 14px; font-weight: bold; color: var(--accent-color);">📝 測驗進行中</span>
              <span class="quiz-type-badge" style="background: rgba(0,122,255,0.1); color: var(--accent-color); padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${badgeText}</span>
            </div>
            <div style="font-size: 18px; font-weight: bold; color: var(--text-primary); text-align: center;">${this.escapeHtml(this.currentQuiz.question)}</div>
          </div>
        `;
      }
      if (quizForm) quizForm.style.display = 'none';
      if (endQuizBtn) endQuizBtn.style.display = 'block';
      
      // 顯示答題選項
      if (answerOptions) {
        answerOptions.style.display = 'block';
        if (isMultiple) {
          answerOptions.innerHTML = `
            <div class="answer-options-container multiple-choice-container" style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
              ${this.currentQuiz.options.map((opt, i) => `
                <label class="answer-option-multiple" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 12px; cursor: pointer; user-select: none; transition: all 0.2s ease;">
                  <input type="checkbox" class="quiz-multiple-checkbox" value="${i}" style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--accent-color);">
                  <span class="option-text" style="font-size: 15px; font-weight: bold; color: var(--text-primary);">${this.escapeHtml(opt)}</span>
                </label>
              `).join('')}
              <button class="submit-multiple-btn" onclick="window.quiz.submitMultipleAnswers()" style="margin-top: 10px; width: 100%; padding: 12px; background: var(--accent-color); color: white; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.3);">
                ☑️ 提交答案
              </button>
            </div>
          `;
        } else {
          answerOptions.innerHTML = `
            <div class="answer-options-container">
              ${this.currentQuiz.options.map((opt, i) => `
                <button class="answer-option" onclick="window.quiz.submitAnswer(${i})">
                  ${this.escapeHtml(opt)}
                </button>
              `).join('')}
            </div>
          `;
        }
      }
    } else if (this.currentQuiz && !this.currentQuiz.active) {
      if (quizStatus) quizStatus.innerHTML = '<div style="color: var(--text-muted); text-align: center;">測驗已結束</div>';
      if (quizForm) quizForm.style.display = 'block';
      if (endQuizBtn) endQuizBtn.style.display = 'none';
      if (answerOptions) answerOptions.style.display = 'none';
      this.showFinalResults();
    } else {
      if (quizStatus) quizStatus.innerHTML = '<div style="color: var(--text-muted); text-align: center;">目前沒有進行中的測驗</div>';
      if (quizForm) quizForm.style.display = 'block';
      if (endQuizBtn) endQuizBtn.style.display = 'none';
      if (answerOptions) answerOptions.style.display = 'none';
    }
  }
  
  updateResults(answers) {
    const resultsContainer = document.getElementById('quizResults');
    if (!resultsContainer || !this.currentQuiz || !this.currentQuiz.active) return;
    
    const totalVoters = Object.keys(answers).length;
    const optionCount = this.currentQuiz.options.length;
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
      ${this.currentQuiz.options.map((opt, i) => `
        <div class="result-bar">
          <span class="result-label">${this.escapeHtml(opt)}</span>
          <div class="result-progress">
            <div class="result-fill" style="width: ${totalVoters > 0 ? (counts[i] / totalVoters * 100) : 0}%">
              ${counts[i]}
            </div>
          </div>
        </div>
      `).join('')}
    `;
  }
  
  showFinalResults() {
    const resultsContainer = document.getElementById('quizResults');
    if (!resultsContainer) return;
    
    this.answersRef.once('value', (snapshot) => {
      const answers = snapshot.val() || {};
      const totalVoters = Object.keys(answers).length;
      const optionCount = this.currentQuiz ? this.currentQuiz.options.length : 0;
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
      
      if (totalVoters === 0) {
        resultsContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 13px;">無人作答</div>';
        return;
      }
      
      resultsContainer.innerHTML = `
        <div style="padding: 10px; background: var(--bg-input); border-radius: 10px; margin-bottom: 10px;">
          <div style="font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">📊 最終結果</div>
          <div style="font-size: 12px; color: var(--text-secondary);">總計 ${totalVoters} 人作答 ${this.currentQuiz.quizType === 'multiple' ? '(複選題)' : ''}</div>
        </div>
        ${this.currentQuiz.options.map((opt, i) => `
          <div class="result-bar">
            <span class="result-label">${this.escapeHtml(opt)}</span>
            <div class="result-progress">
              <div class="result-fill" style="width: ${totalVoters > 0 ? (counts[i] / totalVoters * 100) : 0}%">
                ${counts[i]} (${totalVoters > 0 ? Math.round(counts[i] / totalVoters * 100) : 0}%)
              </div>
            </div>
          </div>
        `).join('')}
      `;
    });
  }

  // 匯出純文字檔 TXT 格式題目庫
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
              const quizType = (typeStr.includes('複') || typeStr.toLowerCase().includes('multi')) ? 'multiple' : 'single';
              const options = lines.slice(2);
              if (options.length >= 2) {
                questions.push({ question, quizType, options });
              }
            }
          });
        }

        if (questions.length === 0) {
          if (window.app) window.app.showNotification('錯誤', '匯入失敗：格式無法解析，請參考格式範例');
          return;
        }

        // 帶入第一題
        const q0 = questions[0];
        if (q0 && q0.question && Array.isArray(q0.options)) {
          const qInput = document.getElementById('quizQuestion');
          if (qInput) qInput.value = q0.question;
          
          if (q0.quizType === 'multiple') {
            const radMulti = document.querySelector('input[name="quizTypeRadio"][value="multiple"]');
            if (radMulti) radMulti.checked = true;
          } else {
            const radSingle = document.querySelector('input[name="quizTypeRadio"][value="single"]');
            if (radSingle) radSingle.checked = true;
          }

          // 重新填入選項
          const container = document.getElementById('optionsContainer');
          if (container) {
            container.innerHTML = q0.options.map(opt => `
              <div class="option-input">
                <input type="text" class="option-field" value="${this.escapeHtml(opt)}">
                <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
              </div>
            `).join('');
          }
        }

        if (window.app) window.app.showNotification('成功', `已成功解析 ${questions.length} 個題目！第一題已自動帶入出題框`);
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
