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
  
  startQuiz(question, options) {
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
      startTime: Date.now(),
      active: true
    };
    
    this.quizRef.set(quizData);
    this.answersRef.remove();
  }
  
  submitAnswer(answerIndex) {
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
      this.answersRef.child(userId).set(answerIndex);
      if (window.app) window.app.showNotification('成功', '投票成功！');
    });
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
      quizStatus.innerHTML = `
        <div class="quiz-status">
          <div>📝 測驗進行中</div>
          <div style="margin-top: 10px; font-size: 18px; font-weight: bold; color: var(--text-primary);">${this.escapeHtml(this.currentQuiz.question)}</div>
        </div>
      `;
      quizForm.style.display = 'none';
      endQuizBtn.style.display = 'block';
      
      // 顯示答題選項 - 使用選項文字
      answerOptions.style.display = 'block';
      answerOptions.innerHTML = `
        <div class="answer-options-container">
          ${this.currentQuiz.options.map((opt, i) => `
            <button class="answer-option" onclick="window.quiz.submitAnswer(${i})">
              ${this.escapeHtml(opt)}
            </button>
          `).join('')}
        </div>
      `;
    } else if (this.currentQuiz && !this.currentQuiz.active) {
      quizStatus.innerHTML = '<div style="color: var(--text-muted); text-align: center;">測驗已結束</div>';
      quizForm.style.display = 'block';
      endQuizBtn.style.display = 'none';
      answerOptions.style.display = 'none';
      this.showFinalResults();
    } else {
      quizStatus.innerHTML = '<div style="color: var(--text-muted); text-align: center;">目前沒有進行中的測驗</div>';
      quizForm.style.display = 'block';
      endQuizBtn.style.display = 'none';
      answerOptions.style.display = 'none';
    }
  }
  
  updateResults(answers) {
    const resultsContainer = document.getElementById('quizResults');
    if (!this.currentQuiz || !this.currentQuiz.active) return;
    
    const total = Object.keys(answers).length;
    const optionCount = this.currentQuiz.options.length;
    const counts = new Array(optionCount).fill(0);
    
    Object.values(answers).forEach(answer => {
      if (answer >= 0 && answer < optionCount) counts[answer]++;
    });
    
    resultsContainer.innerHTML = `
      <div style="margin-bottom: 8px; color: var(--text-secondary); font-size: 12px;">
        已回答: ${total} 人
      </div>
      ${this.currentQuiz.options.map((opt, i) => `
        <div class="result-bar">
          <span class="result-label">${this.escapeHtml(opt)}</span>
          <div class="result-progress">
            <div class="result-fill" style="width: ${total > 0 ? (counts[i] / total * 100) : 0}%">
              ${counts[i]}
            </div>
          </div>
        </div>
      `).join('')}
    `;
  }
  
  showFinalResults() {
    const resultsContainer = document.getElementById('quizResults');
    
    this.answersRef.once('value', (snapshot) => {
      const answers = snapshot.val() || {};
      const total = Object.keys(answers).length;
      const optionCount = this.currentQuiz.options.length;
      const counts = new Array(optionCount).fill(0);
      
      Object.values(answers).forEach(answer => {
        if (answer >= 0 && answer < optionCount) counts[answer]++;
      });
      
      if (total === 0) {
        resultsContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 13px;">無人作答</div>';
        return;
      }
      
      resultsContainer.innerHTML = `
        <div style="padding: 10px; background: var(--bg-input); border-radius: 10px; margin-bottom: 10px;">
          <div style="font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">📊 最終結果</div>
          <div style="font-size: 12px; color: var(--text-secondary);">總計 ${total} 人作答</div>
        </div>
        ${this.currentQuiz.options.map((opt, i) => `
          <div class="result-bar">
            <span class="result-label">${this.escapeHtml(opt)}</span>
            <div class="result-progress">
              <div class="result-fill" style="width: ${total > 0 ? (counts[i] / total * 100) : 0}%">
                ${counts[i]} (${total > 0 ? Math.round(counts[i] / total * 100) : 0}%)
              </div>
            </div>
          </div>
        `).join('')}
      `;
    });
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
