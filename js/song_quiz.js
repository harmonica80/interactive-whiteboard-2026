/**
 * 專注力測驗：聽歌搶答 (歌曲聽音辨曲) 核心運作模組 (ver 3.2.5)
 * 支援：
 * 1. 個人自主挑戰模式 (模式 A: 每位同學各自聽歌作答、計時與結算)
 * 2. 全班同步搶答模式 (模式 B: 全班同步播放，搶答暫停音訊，答錯可由老師決定繼續播放或跳至下一題)
 * 3. YouTube 嵌入播放相容性優化與錯誤防護
 */
(function (global) {
  'use strict';

  function escapeForSong(value) {
    const text = String(value ?? '');
    return text.replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  // 取得/建立音訊播放容器 (置於可視範圍外邊緣，避免瀏覽器防作弊/背景阻擋 Autoplay)
  function getHiddenPlayerContainer() {
    let container = document.getElementById('songQuizAudioWrapper');
    if (!container) {
      container = document.createElement('div');
      container.id = 'songQuizAudioWrapper';
      container.style.cssText = 'position:fixed; bottom:0; right:0; width:1px; height:1px; opacity:0.01; z-index:-1; pointer-events:none; overflow:hidden;';
      document.body.appendChild(container);
    }
    return container;
  }

  // ==========================================
  // 模式 A：個人自主挑戰模式 (Self-Paced Mode)
  // ==========================================

  // 開始個人自主挑戰
  App.prototype.startSongQuizGame = function startSongQuizGame(game) {
    this.focusGame = game;
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    // 若為全班同步搶答模式，導流至搶答控制器
    if (game.playMode === 'buzzer') {
      this.initBuzzerSongQuiz(game);
      return;
    }

    const helpBtn = document.getElementById('focusHelpBtn');
    const helpInfo = document.getElementById('focusHelpInfo');
    const targetLabel = document.getElementById('focusCurrentTarget')?.parentElement;
    if (helpBtn) helpBtn.style.display = 'none';
    if (helpInfo) helpInfo.textContent = '';
    if (targetLabel) targetLabel.style.display = 'none';

    grid.style.aspectRatio = 'auto';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '14px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';
    grid.style.minHeight = 'auto';

    const questions = Array.isArray(game.questions) ? game.questions : [];
    if (questions.length === 0) {
      grid.innerHTML = '<div style="padding:24px; color:var(--danger-color); font-weight:bold; text-align:center;">題庫中無題目，請至題庫管理中心確認。</div>';
      return;
    }

    this.focusHelpCount = 0;
    this.focusHelpPenaltySeconds = 0;

    this.songQuizState = {
      gameKey: `${game.startTime || game.countdownStartTime || 'start'}_${questions.map((q) => q.id || q.title).join('_')}`,
      index: 0,
      correctCount: 0,
      answers: [],
      eliminated: new Set(),
      revealedSinger: false,
      answered: false,
      isPlayingAudio: false,
      audioRemainingSeconds: 0,
      audioTimerInterval: null
    };

    this.focusStartTimeLocal = game.startTime || Date.now();
    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval);
    this.focusTimerInterval = setInterval(() => {
      const elapsed = (Date.now() - (game.startTime || this.focusStartTimeLocal)) / 1000 + (this.focusHelpPenaltySeconds || 0);
      const timer = document.getElementById('focusTimer');
      if (timer) timer.textContent = elapsed.toFixed(2);
    }, 30);

    this.renderSongQuizQuestion();
  };

  // 渲染個人自主挑戰題目畫面
  App.prototype.renderSongQuizQuestion = function renderSongQuizQuestion() {
    const state = this.songQuizState;
    const game = this.focusGame;
    const grid = document.getElementById('focusGameGrid');
    if (!state || !game || !grid) return;

    const question = (game.questions || [])[state.index];
    if (!question) return;

    // 播放音訊片段
    if (!state.answered && !state.audioInitiated) {
      state.audioInitiated = true;
      this.playSongQuizAudio(question);
    }

    const remainingWrong = (question.options || []).filter(
      (opt) => opt !== question.title && !state.eliminated.has(opt)
    );

    const isPlaying = state.isPlayingAudio;
    const tagBadge = question.tag || game.selectedTag || '精選歌單';

    // 四選一選項按鈕
    const optionsHtml = (question.options || []).map((option, optIdx) => {
      const isEliminated = state.eliminated.has(option);
      const isCorrect = option === question.title;
      const isSelected = state.selectedOption === option;

      let background = 'var(--bg-card)';
      let border = '1.5px solid var(--border-color)';
      let color = 'var(--text-primary)';

      if (state.answered && isCorrect) {
        background = 'rgba(52,199,89,0.15)';
        border = '2px solid #34c759';
        color = '#167a31';
      }
      if (state.answered && isSelected && !isCorrect) {
        background = 'rgba(255,59,48,0.12)';
        border = '2px solid #ff3b30';
        color = '#b42318';
      }

      const eliminatedStyle = isEliminated
        ? 'opacity:0.35; text-decoration:line-through; cursor:not-allowed;'
        : 'cursor:pointer;';

      return `
        <button type="button" onclick="window.app.answerSongQuiz(${optIdx})" ${state.answered || isEliminated ? 'disabled' : ''} style="width:100%; text-align:left; padding:12px 14px; border-radius:10px; border:${border}; background:${background}; color:${color}; font-size:15px; font-weight:bold; transition:all 0.15s; ${eliminatedStyle}">
          ${isEliminated ? '✖ 已排除　' : `${String.fromCharCode(65 + optIdx)}．`}${escapeForSong(option)}
        </button>
      `;
    }).join('');

    // 作答後回饋或提示按鈕區
    let actionAreaHtml = '';
    if (state.answered) {
      const isCorrect = state.isCorrect;
      actionAreaHtml = `
        <div style="margin-top:14px; padding:16px; border-radius:12px; background:${isCorrect ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)'}; border:1px solid ${isCorrect ? '#34c759' : '#ff9500'}; line-height:1.6;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div style="font-weight:900; color:${isCorrect ? '#167a31' : '#b26a00'}; font-size:17px;">
              ${isCorrect ? '🎉 答對了！太厲害了！' : '❌ 答錯了！'}
            </div>
            <span style="font-size:13px; font-weight:bold; color:var(--text-secondary);">正解：【${escapeForSong(question.title)}】</span>
          </div>
          <div style="font-size:14px; color:var(--text-primary); margin-top:8px; font-weight:bold;">
            🎤 演唱者：<span style="color:var(--accent-color);">${escapeForSong(question.artist || '未知')}</span>
          </div>
          ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">💡 歌曲提示：${escapeForSong(question.clue)}</div>` : ''}
          
          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
              ▶️ 在 YouTube 聆聽完整歌曲
            </a>
          </div>
        </div>
        <button type="button" onclick="window.app.nextSongQuizQuestion()" style="margin-top:14px; width:100%; padding:13px; border:none; border-radius:10px; background:var(--accent-color); color:white; font-size:16px; font-weight:900; cursor:pointer; box-shadow:0 3px 10px rgba(0,122,255,0.3);">
          ${state.index + 1 === game.questions.length ? '🏁 查看全部解答與本局成績' : '下一首 ➜'}
        </button>
      `;
    } else {
      actionAreaHtml = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px;">
          <button type="button" onclick="window.app.useSongQuizSingerHint()" ${state.revealedSinger ? 'disabled' : ''} style="padding:10px; border:none; border-radius:8px; background:#6366f1; color:white; font-size:13px; font-weight:bold; cursor:pointer; opacity:${state.revealedSinger ? 0.45 : 1};">
            💡 提示歌手 (+5秒)
          </button>
          <button type="button" onclick="window.app.useSongQuizEliminationHint()" ${remainingWrong.length === 0 ? 'disabled' : ''} style="padding:10px; border:none; border-radius:8px; background:#ff9500; color:white; font-size:13px; font-weight:bold; cursor:pointer; opacity:${remainingWrong.length === 0 ? 0.45 : 1};">
            ✂️ 刪除1個錯誤 (+5秒)
          </button>
        </div>
        ${state.revealedSinger ? `<div style="background:rgba(99,102,241,0.1); border:1px solid #6366f1; padding:8px 12px; border-radius:8px; font-size:13px; color:#4f46e5; font-weight:bold; margin-top:8px; text-align:center;">🎤 提示歌手：${escapeForSong(question.artist || '無提供歌手資訊')}</div>` : ''}
        <div style="font-size:12px; color:var(--text-muted); text-align:center; margin-top:8px;">
          累計使用提示懲罰：+${this.focusHelpPenaltySeconds || 0} 秒（已算入總耗時）
        </div>
      `;
    }

    grid.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span style="background:rgba(0,122,255,0.1); color:var(--accent-color); padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          🎵 第 ${state.index + 1} / ${game.questions.length} 題
        </span>
        <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          🏷️ ${escapeForSong(tagBadge)}
        </span>
      </div>

      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:20px; text-align:center; box-shadow:0 4px 16px rgba(0,0,0,0.03);">
        <div style="position:relative; width:110px; height:110px; margin:0 auto 14px; display:flex; align-items:center; justify-content:center;">
          <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(circle, #2a2a2a 20%, #111 60%, #000 100%); border:4px solid #333; box-shadow:0 6px 18px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; ${isPlaying ? 'animation: spinVinyl 3s linear infinite;' : ''}">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-color); border:3px solid #fff; display:flex; align-items:center; justify-content:center; color:white; font-size:16px;">
              🎵
            </div>
          </div>
        </div>

        <div style="font-size:16px; font-weight:bold; color:var(--text-primary); margin-bottom:4px;">
          ${isPlaying ? '🎧 歌曲片段播放中...' : (state.answered ? '✅ 歌曲已揭曉' : '⏸️ 試聽片段播放完畢')}
        </div>
        <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">
          ${isPlaying ? `剩餘播放時間：<strong>${state.audioRemainingSeconds}</strong> 秒` : (state.answered ? '請瀏覽解析或進入下一題' : '沒聽清楚嗎？可點擊下方重新播放！')}
        </div>

        <button type="button" onclick="window.app.replaySongQuizAudio()" style="padding:7px 16px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:13px; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          🔄 重新試聽歌曲片段
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${optionsHtml}
      </div>

      ${actionAreaHtml}

      <style>
        @keyframes spinVinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  };

  // 播放歌曲音訊片段
  App.prototype.playSongQuizAudio = function playSongQuizAudio(question, customStartTime) {
    const state = this.songQuizState;
    if (!question) return;

    this.stopSongQuizAudio();

    const duration = Math.max(5, Math.min(30, parseInt(question.duration) || 15));
    const startTime = typeof customStartTime === 'number' ? customStartTime : Math.max(0, parseInt(question.startTime) || 0);
    const youtubeId = question.youtubeId || (this.parseYoutubeUrl ? this.parseYoutubeUrl(question.youtubeUrl).videoId : 'bv_cEeDlop0');

    const wrapper = getHiddenPlayerContainer();
    // 使用 YouTube Iframe 播放
    wrapper.innerHTML = `
      <iframe id="songQuizHiddenIframe" width="200" height="200" src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${startTime}&enablejsapi=1&controls=0" allow="autoplay" style="border:none;"></iframe>
    `;

    if (state) {
      state.isPlayingAudio = true;
      state.audioRemainingSeconds = duration;
      state.audioTimerInterval = setInterval(() => {
        state.audioRemainingSeconds--;
        if (state.audioRemainingSeconds <= 0) {
          this.stopSongQuizAudio();
          if (this.renderSongQuizQuestion) this.renderSongQuizQuestion();
        } else {
          const textEl = document.querySelector('#focusGameGrid strong');
          if (textEl && state.isPlayingAudio) {
            textEl.textContent = state.audioRemainingSeconds;
          }
        }
      }, 1000);
    }
  };

  // 停止歌曲播放
  App.prototype.stopSongQuizAudio = function stopSongQuizAudio() {
    const state = this.songQuizState;
    if (state) {
      state.isPlayingAudio = false;
      if (state.audioTimerInterval) {
        clearInterval(state.audioTimerInterval);
        state.audioTimerInterval = null;
      }
    }
    const wrapper = document.getElementById('songQuizAudioWrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
    }
  };

  // 重播歌曲片段
  App.prototype.replaySongQuizAudio = function replaySongQuizAudio() {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game) return;
    const question = (game.questions || [])[state.index];
    if (question) {
      this.playSongQuizAudio(question);
      this.renderSongQuizQuestion();
    }
  };

  // 學生選擇答案 (個人自主挑戰)
  App.prototype.answerSongQuiz = function answerSongQuiz(selectedIndex) {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game || state.answered) return;

    const question = (game.questions || [])[state.index];
    if (!question) return;

    const chosenOption = (question.options || [])[selectedIndex];
    const isCorrect = chosenOption === question.title;

    state.answered = true;
    state.selectedOption = chosenOption;
    state.isCorrect = isCorrect;
    if (isCorrect) state.correctCount++;

    state.answers.push({
      questionId: question.id || question.title,
      title: question.title,
      artist: question.artist || '',
      selectedOption: chosenOption,
      correctOption: question.title,
      correct: isCorrect
    });

    this.stopSongQuizAudio();
    this.renderSongQuizQuestion();
  };

  // 提示歌手 (懲罰 +5 秒)
  App.prototype.useSongQuizSingerHint = function useSongQuizSingerHint() {
    const state = this.songQuizState;
    if (!state || state.answered || state.revealedSinger) return;

    state.revealedSinger = true;
    this.focusHelpCount = (this.focusHelpCount || 0) + 1;
    this.focusHelpPenaltySeconds = (this.focusHelpPenaltySeconds || 0) + 5;

    this.renderSongQuizQuestion();
  };

  // 刪除錯誤選項 (懲罰 +5 秒)
  App.prototype.useSongQuizEliminationHint = function useSongQuizEliminationHint() {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game || state.answered) return;

    const question = (game.questions || [])[state.index];
    if (!question) return;

    const wrongOptions = (question.options || []).filter(
      (opt) => opt !== question.title && !state.eliminated.has(opt)
    );

    if (wrongOptions.length === 0) return;

    const randIdx = Math.floor(Math.random() * wrongOptions.length);
    state.eliminated.add(wrongOptions[randIdx]);

    this.focusHelpCount = (this.focusHelpCount || 0) + 1;
    this.focusHelpPenaltySeconds = (this.focusHelpPenaltySeconds || 0) + 5;

    this.renderSongQuizQuestion();
  };

  // 下一題 (個人自主挑戰)
  App.prototype.nextSongQuizQuestion = function nextSongQuizQuestion() {
    const state = this.songQuizState;
    const game = this.focusGame;
    if (!state || !game) return;

    this.stopSongQuizAudio();

    if (state.index + 1 >= (game.questions || []).length) {
      this.finishSongQuizGame();
      return;
    }

    state.index++;
    state.answered = false;
    state.audioInitiated = false;
    state.selectedOption = null;
    state.isCorrect = false;
    state.eliminated = new Set();
    state.revealedSinger = false;

    this.renderSongQuizQuestion();
  };

  // 遊戲結束與結算 (個人自主挑戰)
  App.prototype.finishSongQuizGame = function finishSongQuizGame() {
    const state = this.songQuizState;
    if (!state || state.submitted) return;
    state.submitted = true;

    this.stopSongQuizAudio();

    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval);
    this.focusTimerInterval = null;

    const game = this.focusGame;
    const userId = localStorage.getItem('user_id') || 'guest';
    const userName = localStorage.getItem('comment_nickname') || localStorage.getItem('user_name') || '匿名';
    const timeSpent = (Date.now() - (game.startTime || this.focusStartTimeLocal)) / 1000 + (this.focusHelpPenaltySeconds || 0);

    const result = {
      name: userName,
      userName,
      answers: state.answers,
      score: state.correctCount,
      totalQuestions: (game.questions || []).length,
      timeSpent,
      completedAt: firebase.database.ServerValue.TIMESTAMP,
      status: 'correct',
      gameType: 'songQuiz',
      playMode: 'self',
      tag: game.selectedTag || '全部歌單',
      helpCount: this.focusHelpCount || 0,
      penaltySeconds: this.focusHelpPenaltySeconds || 0
    };

    db.ref(`quiz/focusGame/results/${userId}`).set(result).then(() => {
      this.renderSongQuizCompleted(game, result);
      this.showNotification('完成', `聽歌搶答完成！答對 ${state.correctCount}／${game.questions.length} 題！`);
    }).catch((error) => {
      this.showNotification('錯誤', `送出成績失敗：${error.message}`);
    });
  };

  // 渲染個人自主挑戰結算與解析清單
  App.prototype.renderSongQuizCompleted = function renderSongQuizCompleted(game, result) {
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    const answers = result.answers || [];
    const score = Number(result.score) || 0;
    const total = Number(result.totalQuestions) || (game.questions || []).length;
    const byId = new Map(answers.map((item) => [item.questionId, item]));

    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '14px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';

    grid.innerHTML = `
      <div style="padding:18px; border-radius:14px; background:rgba(52,199,89,0.12); border:1px solid #34c759; width:100%; box-sizing:border-box; text-align:center;">
        <div style="font-size:22px; font-weight:900; color:#167a31;">🎉 恭喜完成！答對 ${score}／${total} 題</div>
        <div style="font-size:14px; color:var(--text-secondary); margin-top:6px;">
          總耗時：<strong>${Number(result.timeSpent || 0).toFixed(2)}</strong> 秒（含提示加罰 ${result.penaltySeconds || 0} 秒）
        </div>
        <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">
          以下為本局歌曲清單與正解，可點擊在 YouTube 欣賞完整 MV！
        </div>
      </div>

      ${(game.questions || []).map((question, index) => {
        const answer = byId.get(question.id || question.title);
        const isCorrect = answer?.correct;

        return `
          <div style="padding:16px; border-radius:12px; background:var(--bg-card); border:1px solid var(--border-color); width:100%; box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:13px; color:var(--text-secondary); font-weight:bold;">第 ${index + 1} 題・${escapeForSong(question.tag || '歌曲')}</span>
              <span style="font-size:14px;">${isCorrect ? '✅ 答對' : '❌ 答錯'}</span>
            </div>
            <div style="font-size:17px; font-weight:900; color:var(--text-primary); margin-bottom:4px;">
              🎵 ${escapeForSong(question.title)}
            </div>
            <div style="font-size:14px; color:var(--accent-color); font-weight:bold; margin-bottom:6px;">
              🎤 演唱者：${escapeForSong(question.artist || '未知')}
            </div>
            ${answer && !isCorrect ? `<div style="font-size:13px; color:#b42318; margin-bottom:4px;">你的答案：${escapeForSong(answer.selectedOption || '未作答')}</div>` : ''}
            ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:10px;">💡 ${escapeForSong(question.clue)}</div>` : ''}
            
            <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
              ▶️ 在 YouTube 聆聽完整歌曲
            </a>
          </div>
        `;
      }).join('')}
    `;
  };

  // ==========================================
  // 模式 B：全班同步搶答模式 (Buzzer Sync Mode)
  // ==========================================

  // 初始化全班同步搶答狀態
  App.prototype.initBuzzerSongQuiz = function initBuzzerSongQuiz(game) {
    this.focusGame = game;
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    const helpBtn = document.getElementById('focusHelpBtn');
    const helpInfo = document.getElementById('focusHelpInfo');
    const targetLabel = document.getElementById('focusCurrentTarget')?.parentElement;
    if (helpBtn) helpBtn.style.display = 'none';
    if (helpInfo) helpInfo.textContent = '';
    if (targetLabel) targetLabel.style.display = 'none';

    grid.style.aspectRatio = 'auto';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '14px';
    grid.style.width = '100%';
    grid.style.maxWidth = '600px';
    grid.style.minHeight = 'auto';

    // 停止本地單機計時器
    if (this.focusTimerInterval) clearInterval(this.focusTimerInterval);
    this.focusTimerInterval = null;

    this.renderBuzzerSongQuizUI(game);
  };

  // 渲染全班同步搶答畫面 (由 Firebase 同步事件驅動)
  App.prototype.renderBuzzerSongQuizUI = function renderBuzzerSongQuizUI(game) {
    const grid = document.getElementById('focusGameGrid');
    if (!grid || !game) return;

    const questions = Array.isArray(game.questions) ? game.questions : [];
    const qIndex = Number(game.currentQuestionIndex || 0);
    const question = questions[qIndex];

    // 全部題目完成：顯示全班排行榜與頒獎
    if (!question || qIndex >= questions.length) {
      this.renderBuzzerFinalLeaderboard(game);
      return;
    }

    const round = game.buzzerRound || { status: 'waiting' };
    const roundStatus = round.status || 'waiting';
    const buzzedUser = round.buzzedUser || null;
    const eliminatedUsers = round.eliminatedUsers || {};
    const myUid = localStorage.getItem('user_id') || 'guest';
    const isMeBuzzed = buzzedUser && (buzzedUser.uid === myUid);
    const amIEliminated = !!eliminatedUsers[myUid];

    // 處理音訊播放同步
    this.handleBuzzerAudioSync(question, round);

    const isPlaying = roundStatus === 'playing';
    const tagBadge = question.tag || game.selectedTag || '精選歌單';

    // 頂部題號與資訊
    const headerHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span style="background:rgba(0,122,255,0.1); color:var(--accent-color); padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          ⚡ 全班搶答：第 ${qIndex + 1} / ${questions.length} 題
        </span>
        <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          🏷️ ${escapeForSong(tagBadge)}
        </span>
      </div>
    `;

    // 黑膠唱片動畫與狀態提示區
    let vinylStatusText = '⏸️ 等待老師開始播放歌曲...';
    if (roundStatus === 'playing') vinylStatusText = '🎧 歌曲播放中，全班可按搶答！';
    if (roundStatus === 'buzzed') vinylStatusText = `🔔 【${escapeForSong(buzzedUser?.name || '同學')}】搶答成功！音樂已暫停`;
    if (roundStatus === 'answered_correct') vinylStatusText = `🎉 【${escapeForSong(buzzedUser?.name || '同學')}】答對了！`;
    if (roundStatus === 'answered_wrong') vinylStatusText = `❌ 【${escapeForSong(buzzedUser?.name || '同學')}】答錯了！`;
    if (roundStatus === 'revealed') vinylStatusText = '💡 答案已揭曉';

    const vinylHtml = `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:20px; text-align:center; box-shadow:0 4px 16px rgba(0,0,0,0.03);">
        <div style="position:relative; width:110px; height:110px; margin:0 auto 14px; display:flex; align-items:center; justify-content:center;">
          <div style="width:100%; height:100%; border-radius:50%; background:radial-gradient(circle, #2a2a2a 20%, #111 60%, #000 100%); border:4px solid #333; box-shadow:0 6px 18px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; ${isPlaying ? 'animation: spinVinyl 3s linear infinite;' : ''}">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-color); border:3px solid #fff; display:flex; align-items:center; justify-content:center; color:white; font-size:16px;">
              ${isPlaying ? '🎵' : (roundStatus === 'buzzed' ? '⚡' : '⏸️')}
            </div>
          </div>
        </div>
        <div style="font-size:16px; font-weight:900; color:var(--text-primary); margin-bottom:4px;">
          ${vinylStatusText}
        </div>
        <div style="font-size:13px; color:var(--text-secondary);">
          ${roundStatus === 'playing' ? '聽出歌名了嗎？手速要快！' : (roundStatus === 'buzzed' ? '歌曲暫停中，等待搶答同學回答' : '專注聆聽音樂辨識歌曲')}
        </div>
      </div>
    `;

    // 核心互動搶答按鈕 / 作答選項區
    let interactiveAreaHtml = '';

    if (roundStatus === 'playing') {
      // 播放中：顯示巨大搶答按鈕
      if (amIEliminated) {
        interactiveAreaHtml = `
          <div style="padding:24px; text-align:center; background:rgba(255,59,48,0.08); border:2px dashed #ff3b30; border-radius:14px;">
            <div style="font-size:18px; font-weight:bold; color:#b42318;">❌ 您本題已回答錯誤</div>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">請等待其他同學搶答，或等待老師切換至下一題！</div>
          </div>
        `;
      } else {
        interactiveAreaHtml = `
          <div style="text-align:center; padding:10px 0;">
            <button type="button" onclick="window.app.pressBuzzerButton()" style="width:100%; max-width:400px; height:110px; border-radius:55px; border:none; background:linear-gradient(135deg, #ff3b30 0%, #ff9500 100%); color:white; font-size:26px; font-weight:900; cursor:pointer; box-shadow:0 8px 24px rgba(255,59,48,0.4); animation: pulseBuzzer 1.5s infinite; transition:transform 0.1s;">
              ⚡ 按我搶答！
            </button>
            <div style="font-size:12px; color:var(--text-muted); margin-top:10px;">按下後音樂將立即全班暫停，由您獲得 10 秒作答權！</div>
          </div>
        `;
      }
    } else if (roundStatus === 'buzzed') {
      // 有人搶到了：搶到者作答，其餘同學等待
      if (isMeBuzzed) {
        const optionsButtons = (question.options || []).map((opt, optIdx) => `
          <button type="button" onclick="window.app.submitBuzzerAnswer(${optIdx})" style="width:100%; text-align:left; padding:13px 16px; border-radius:10px; border:2px solid var(--accent-color); background:var(--bg-card); color:var(--text-primary); font-size:16px; font-weight:bold; cursor:pointer; transition:all 0.15s;">
            ${String.fromCharCode(65 + optIdx)}．${escapeForSong(opt)}
          </button>
        `).join('');

        interactiveAreaHtml = `
          <div style="padding:16px; border-radius:12px; background:rgba(0,122,255,0.08); border:2px solid var(--accent-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:16px; font-weight:900; color:var(--accent-color);">⚡ 您搶到了！請選擇答案：</span>
              <span id="buzzerAnswerTimer" style="background:#ff3b30; color:white; padding:3px 10px; border-radius:12px; font-size:13px; font-weight:900;">限時 10 秒</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${optionsButtons}
            </div>
          </div>
        `;
      } else {
        interactiveAreaHtml = `
          <div style="padding:24px; text-align:center; background:rgba(0,122,255,0.06); border:1.5px solid var(--accent-color); border-radius:14px;">
            <div style="font-size:19px; font-weight:900; color:var(--accent-color);">
              🔔 【${escapeForSong(buzzedUser?.name || '同學')}】搶答成功！
            </div>
            <div style="font-size:14px; color:var(--text-secondary); margin-top:8px;">
              正在作答中，歌曲已為全班暫停，請稍候...
            </div>
          </div>
        `;
      }
    } else if (roundStatus === 'answered_wrong') {
      // 答錯：維持暫停，等待老師指令
      interactiveAreaHtml = `
        <div style="padding:18px; text-align:center; background:rgba(255,59,48,0.1); border:1.5px solid #ff3b30; border-radius:12px;">
          <div style="font-size:18px; font-weight:900; color:#b42318;">
            ❌ 【${escapeForSong(buzzedUser?.name || '同學')}】答錯了！
          </div>
          <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
            音樂維持暫停。等待老師指示【繼續播放讓大家再搶】或【跳至下一題】...
          </div>
        </div>
      `;
    } else if (roundStatus === 'answered_correct' || roundStatus === 'revealed') {
      // 答對或公佈答案
      interactiveAreaHtml = `
        <div style="padding:18px; border-radius:12px; background:rgba(52,199,89,0.12); border:1.5px solid #34c759; text-align:center;">
          <div style="font-size:19px; font-weight:900; color:#167a31;">
            ${roundStatus === 'answered_correct' ? `🎉 恭喜【${escapeForSong(buzzedUser?.name || '同學')}】答對！` : '💡 本題正解揭曉'}
          </div>
          <div style="font-size:16px; font-weight:bold; color:var(--text-primary); margin-top:8px;">
            正解：🎵【${escapeForSong(question.title)}】
          </div>
          <div style="font-size:14px; color:var(--accent-color); font-weight:bold; margin-top:4px;">
            🎤 演唱者：${escapeForSong(question.artist || '未知')}
          </div>
          ${question.clue ? `<div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">💡 提示：${escapeForSong(question.clue)}</div>` : ''}
          <div style="margin-top:10px;">
            <a href="${escapeForSong(question.youtubeUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#ff0000; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; text-decoration:none;">
              ▶️ 在 YouTube 聆聽完整歌曲
            </a>
          </div>
        </div>
      `;
    } else {
      // waiting 狀態
      interactiveAreaHtml = `
        <div style="padding:24px; text-align:center; background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px;">
          <div style="font-size:16px; font-weight:bold; color:var(--text-primary);">
            🎵 等待老師開始播放音樂
          </div>
          <div style="font-size:13px; color:var(--text-secondary); margin-top:6px;">
            老師按下開始後，請仔細聆聽歌曲並準備按搶答！
          </div>
        </div>
      `;
    }

    // 老師專屬控制面板 (管理員在畫面底部具備主控權)
    let teacherControlHtml = '';
    if (this.isAdmin) {
      teacherControlHtml = `
        <div style="margin-top:10px; padding:14px; border-radius:12px; background:var(--bg-input); border:1.5px solid var(--accent-color);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:13px; font-weight:900; color:var(--accent-color);">👑 老師主控台 (正解：${escapeForSong(question.title)} / ${escapeForSong(question.artist || '')})</span>
            <span style="font-size:12px; color:var(--text-muted);">狀態：${roundStatus}</span>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${roundStatus === 'waiting' ? `
              <button type="button" onclick="window.app.teacherBuzzerAction('play')" style="flex:1; padding:10px; border:none; border-radius:8px; background:#34c759; color:white; font-size:14px; font-weight:bold; cursor:pointer;">
                ▶️ 開始播放音樂 (開放搶答)
              </button>
            ` : ''}

            ${roundStatus === 'playing' ? `
              <button type="button" onclick="window.app.teacherBuzzerAction('pause')" style="flex:1; padding:10px; border:none; border-radius:8px; background:#ff9500; color:white; font-size:14px; font-weight:bold; cursor:pointer;">
                ⏸️ 暫停播放
              </button>
            ` : ''}

            ${roundStatus === 'answered_wrong' ? `
              <button type="button" onclick="window.app.teacherBuzzerAction('resume')" style="flex:1; padding:12px; border:none; border-radius:8px; background:#34c759; color:white; font-size:14px; font-weight:900; cursor:pointer; box-shadow:0 2px 8px rgba(52,199,89,0.3);">
                ▶️ 繼續播放音樂 (開放其餘同學繼續搶答)
              </button>
              <button type="button" onclick="window.app.teacherBuzzerAction('next')" style="flex:1; padding:12px; border:none; border-radius:8px; background:#ff3b30; color:white; font-size:14px; font-weight:900; cursor:pointer;">
                ⏭️ 跳至下一題
              </button>
            ` : ''}

            ${(roundStatus === 'answered_correct' || roundStatus === 'revealed') ? `
              <button type="button" onclick="window.app.teacherBuzzerAction('next')" style="flex:1; padding:12px; border:none; border-radius:8px; background:var(--accent-color); color:white; font-size:15px; font-weight:900; cursor:pointer; box-shadow:0 3px 10px rgba(0,122,255,0.3);">
                ${qIndex + 1 >= questions.length ? '🏁 結束並查看全班排行榜' : '⏭️ 進入下一題 ➜'}
              </button>
            ` : ''}

            ${roundStatus !== 'answered_correct' && roundStatus !== 'revealed' && roundStatus !== 'answered_wrong' ? `
              <button type="button" onclick="window.app.teacherBuzzerAction('reveal')" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-card); color:var(--text-primary); font-size:13px; font-weight:bold; cursor:pointer;">
                💡 揭曉答案
              </button>
              <button type="button" onclick="window.app.teacherBuzzerAction('next')" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-card); color:var(--text-primary); font-size:13px; font-weight:bold; cursor:pointer;">
                ⏭️ 跳題
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }

    // 即時積分看板 (縮小版置於底部)
    const scores = game.buzzerScores || {};
    const scoreEntries = Object.values(scores).sort((a, b) => (b.score || 0) - (a.score || 0));
    let scoreBoardHtml = '';
    if (scoreEntries.length > 0) {
      scoreBoardHtml = `
        <div style="margin-top:10px; padding:10px 14px; border-radius:10px; background:var(--bg-card); border:1px solid var(--border-color);">
          <div style="font-size:12px; font-weight:bold; color:var(--text-secondary); margin-bottom:6px;">🏆 目前搶答積分排行榜：</div>
          <div style="display:flex; gap:12px; overflow-x:auto; padding-bottom:4px;">
            ${scoreEntries.slice(0, 5).map((u, i) => `
              <span style="font-size:12px; font-weight:bold; white-space:nowrap; background:rgba(0,122,255,0.08); padding:3px 8px; border-radius:6px; color:var(--text-primary);">
                ${i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `${i + 1}.`))} ${escapeForSong(u.name)}: <strong style="color:var(--accent-color);">${u.score || 0}分</strong>
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    grid.innerHTML = `
      ${headerHtml}
      ${vinylHtml}
      ${interactiveAreaHtml}
      ${teacherControlHtml}
      ${scoreBoardHtml}

      <style>
        @keyframes spinVinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseBuzzer {
          0% { transform: scale(1); box-shadow: 0 4px 16px rgba(255,59,48,0.3); }
          50% { transform: scale(1.03); box-shadow: 0 8px 28px rgba(255,59,48,0.6); }
          100% { transform: scale(1); box-shadow: 0 4px 16px rgba(255,59,48,0.3); }
        }
      </style>
    `;
  };

  // 處理全班音訊同步播放 / 暫停
  App.prototype.handleBuzzerAudioSync = function handleBuzzerAudioSync(question, round) {
    const roundStatus = round.status || 'waiting';
    const action = round.audioAction || 'stop';

    if (roundStatus === 'playing') {
      // 播放中：如果尚未播放，啟動播放
      const currentActionKey = `${question.id}_${round.timestamp || 0}`;
      if (this.lastBuzzerAudioKey !== currentActionKey) {
        this.lastBuzzerAudioKey = currentActionKey;
        const seekTime = Number(round.audioSeekTime || question.startTime || 0);
        this.playSongQuizAudio(question, seekTime);
      }
    } else {
      // 非播放狀態 (buzzed, answered_wrong, answered_correct, waiting, revealed)：立即停止/暫停音訊
      this.lastBuzzerAudioKey = null;
      this.stopSongQuizAudio();
    }
  };

  // 學生按下「⚡ 按我搶答！」
  App.prototype.pressBuzzerButton = function pressBuzzerButton() {
    const game = this.focusGame;
    if (!game || game.playMode !== 'buzzer') return;

    const round = game.buzzerRound || {};
    if (round.status !== 'playing') return;

    const userId = localStorage.getItem('user_id') || 'guest';
    const userName = localStorage.getItem('comment_nickname') || localStorage.getItem('user_name') || '同學';

    // 檢查是否已被淘汰
    if (round.eliminatedUsers && round.eliminatedUsers[userId]) {
      this.showNotification('提醒', '您本題已回答錯誤，請等待其他同學搶答！');
      return;
    }

    // 播放搶答音效
    if (this.playFocusSound) this.playFocusSound('click');

    // 透過 Firebase Transaction 原子性搶奪答題權
    db.ref('quiz/focusGame/buzzerRound').transaction((current) => {
      if (!current) return current;
      if (current.status === 'playing' && !current.buzzedUser) {
        current.status = 'buzzed';
        current.buzzedUser = {
          uid: userId,
          name: userName,
          buzzedAt: Date.now()
        };
        current.audioAction = 'pause';
        current.timestamp = Date.now();
        return current;
      }
      return; // 已被搶走，取消操作
    }, (error, committed, snapshot) => {
      if (error) {
        this.showNotification('錯誤', '搶答失敗: ' + error.message);
      } else if (committed) {
        this.showNotification('搶答成功', '您成功搶到了！請於 10 秒內作答！');
        // 啟動 10 秒作答倒數
        this.startBuzzerAnswerCountdown(10);
      } else {
        this.showNotification('慢了一步', '已被其他同學搶先按下了！');
      }
    });
  };

  // 搶答者作答 10 秒倒數計時
  App.prototype.startBuzzerAnswerCountdown = function startBuzzerAnswerCountdown(seconds) {
    if (this.buzzerCountdownInterval) clearInterval(this.buzzerCountdownInterval);
    let remaining = seconds;
    const timerEl = document.getElementById('buzzerAnswerTimer');
    if (timerEl) timerEl.textContent = `限時 ${remaining} 秒`;

    this.buzzerCountdownInterval = setInterval(() => {
      remaining--;
      const el = document.getElementById('buzzerAnswerTimer');
      if (el) el.textContent = `限時 ${remaining} 秒`;

      if (remaining <= 0) {
        clearInterval(this.buzzerCountdownInterval);
        this.buzzerCountdownInterval = null;
        // 逾時視為答錯
        this.submitBuzzerAnswer(-1);
      }
    }, 1000);
  };

  // 搶答者送出四選一答案
  App.prototype.submitBuzzerAnswer = function submitBuzzerAnswer(optIdx) {
    if (this.buzzerCountdownInterval) {
      clearInterval(this.buzzerCountdownInterval);
      this.buzzerCountdownInterval = null;
    }

    const game = this.focusGame;
    if (!game) return;

    const qIndex = Number(game.currentQuestionIndex || 0);
    const question = (game.questions || [])[qIndex];
    if (!question) return;

    const userId = localStorage.getItem('user_id') || 'guest';
    const userName = localStorage.getItem('comment_nickname') || localStorage.getItem('user_name') || '同學';

    const chosenOption = optIdx >= 0 ? (question.options || [])[optIdx] : '（逾時未答）';
    const isCorrect = optIdx >= 0 && (chosenOption === question.title);

    const roundRef = db.ref('quiz/focusGame/buzzerRound');
    const scoresRef = db.ref(`quiz/focusGame/buzzerScores/${userId}`);

    if (isCorrect) {
      // 答對：加 10 分，更新 round 狀態為 answered_correct
      roundRef.update({
        status: 'answered_correct',
        selectedOption: chosenOption,
        isCorrect: true,
        timestamp: Date.now()
      });

      scoresRef.transaction((curr) => {
        const score = (curr && curr.score) || 0;
        const correctCount = (curr && curr.correctCount) || 0;
        return {
          name: userName,
          score: score + 10,
          correctCount: correctCount + 1,
          updatedAt: Date.now()
        };
      });

      if (this.playFocusSound) this.playFocusSound('finish');
    } else {
      // 答錯：將該學生加入 eliminatedUsers，狀態切換為 answered_wrong
      db.ref(`quiz/focusGame/buzzerRound/eliminatedUsers/${userId}`).set(true);
      roundRef.update({
        status: 'answered_wrong',
        selectedOption: chosenOption,
        isCorrect: false,
        timestamp: Date.now()
      });
      if (this.playFocusSound) this.playFocusSound('click');
    }
  };

  // 老師端主控操作指令
  App.prototype.teacherBuzzerAction = function teacherBuzzerAction(action) {
    if (!this.isAdmin) return;
    const game = this.focusGame;
    if (!game) return;

    const questions = game.questions || [];
    const qIndex = Number(game.currentQuestionIndex || 0);
    const round = game.buzzerRound || {};

    if (action === 'play') {
      // 開始播放
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'playing',
        audioAction: 'play',
        buzzedUser: null,
        timestamp: Date.now()
      });
    } else if (action === 'pause') {
      // 手動暫停
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'waiting',
        audioAction: 'pause',
        timestamp: Date.now()
      });
    } else if (action === 'resume') {
      // 繼續播放 (答錯後讓其他同學繼續搶)
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'playing',
        audioAction: 'resume',
        buzzedUser: null,
        timestamp: Date.now()
      });
      this.showNotification('指令發送', '已繼續播放歌曲，開放其他同學搶答！');
    } else if (action === 'reveal') {
      // 揭曉答案
      db.ref('quiz/focusGame/buzzerRound').update({
        status: 'revealed',
        audioAction: 'stop',
        timestamp: Date.now()
      });
    } else if (action === 'next') {
      // 切換下一題
      const nextIndex = qIndex + 1;
      if (nextIndex >= questions.length) {
        // 全部完成：標記遊戲結束
        db.ref('quiz/focusGame').update({
          currentQuestionIndex: nextIndex,
          buzzerRound: {
            status: 'finished',
            audioAction: 'stop',
            timestamp: Date.now()
          }
        });
      } else {
        // 進入下一題，重置 round
        db.ref('quiz/focusGame').update({
          currentQuestionIndex: nextIndex,
          buzzerRound: {
            status: 'waiting',
            audioAction: 'init',
            buzzedUser: null,
            eliminatedUsers: {},
            timestamp: Date.now()
          }
        });
      }
    }
  };

  // 渲染全班搶答最終排行榜與頒獎
  App.prototype.renderBuzzerFinalLeaderboard = function renderBuzzerFinalLeaderboard(game) {
    const grid = document.getElementById('focusGameGrid');
    if (!grid) return;

    this.stopSongQuizAudio();

    const scores = game.buzzerScores || {};
    const entries = Object.values(scores).sort((a, b) => (b.score || 0) - (a.score || 0));

    grid.innerHTML = `
      <div style="padding:20px; border-radius:16px; background:linear-gradient(135deg, rgba(0,122,255,0.12) 0%, rgba(52,199,89,0.12) 100%); border:1.5px solid var(--accent-color); text-align:center; box-sizing:border-box;">
        <div style="font-size:26px; font-weight:900; color:var(--text-primary);">🏆 全班聽歌搶答 頒獎典禮 🏆</div>
        <div style="font-size:14px; color:var(--text-secondary); margin-top:6px;">全部歌曲搶答完畢！以下為全班同學的搶答戰績與榮譽榜：</div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px; margin-top:6px;">
        ${entries.length === 0 ? `
          <div style="padding:24px; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border-color);">
            本局無同學得分
          </div>
        ` : entries.map((entry, rank) => {
          let badge = `${rank + 1}`;
          let bg = 'var(--bg-card)';
          let border = '1px solid var(--border-color)';
          if (rank === 0) {
            badge = '🥇 冠軍';
            bg = 'rgba(255,215,0,0.15)';
            border = '2px solid #ffd700';
          } else if (rank === 1) {
            badge = '🥈 亞軍';
            bg = 'rgba(192,192,192,0.15)';
            border = '2px solid #c0c0c0';
          } else if (rank === 2) {
            badge = '🥉 季軍';
            bg = 'rgba(205,127,50,0.15)';
            border = '2px solid #cd7f32';
          }

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-radius:12px; background:${bg}; border:${border};">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-weight:900; font-size:15px; color:var(--text-primary); min-width:60px;">${badge}</span>
                <span style="font-size:16px; font-weight:bold; color:var(--text-primary);">${escapeForSong(entry.name)}</span>
              </div>
              <div style="text-align:right;">
                <span style="font-size:18px; font-weight:900; color:var(--accent-color);">${entry.score || 0} 分</span>
                <span style="font-size:12px; color:var(--text-secondary); margin-left:8px;">(答對 ${entry.correctCount || 0} 首)</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${this.isAdmin ? `
        <button type="button" onclick="window.app.stopFocusGame()" style="margin-top:14px; width:100%; padding:13px; border:none; border-radius:10px; background:#ff3b30; color:white; font-size:16px; font-weight:bold; cursor:pointer;">
          🛑 關閉全班測驗並重置
        </button>
      ` : ''}
    `;
  };

})(typeof window !== 'undefined' ? window : this);
