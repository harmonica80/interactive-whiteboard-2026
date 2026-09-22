/**
 * 專注力測驗：聽歌搶答 (歌曲聽音辨曲) 核心運作模組
 * 支援 YouTube 音訊背景播放 (防看畫面作弊)、黑膠唱片動畫、四選一搶答、提示歌手、刪去法與成績結算
 */
(function () {
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

  // 取得隱藏的 YouTube 播放容器
  function getHiddenPlayerContainer() {
    let container = document.getElementById('songQuizAudioWrapper');
    if (!container) {
      container = document.createElement('div');
      container.id = 'songQuizAudioWrapper';
      container.style.cssText = 'position: fixed; top: -9999px; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; z-index: -1; overflow: hidden;';
      document.body.appendChild(container);
    }
    return container;
  }

  // 開始專注力聽歌搶答遊戲
  App.prototype.startSongQuizGame = function startSongQuizGame(game) {
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

    const questions = Array.isArray(game.questions) ? game.questions : [];
    if (questions.length === 0) {
      grid.innerHTML = '<div style="padding:24px; color:var(--danger-color); font-weight:bold; text-align:center;">題庫載入失敗或歌單中無題目，請請老師重新發起測驗。</div>';
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

  // 渲染當前聽歌搶答題目畫面
  App.prototype.renderSongQuizQuestion = function renderSongQuizQuestion() {
    const state = this.songQuizState;
    const game = this.focusGame;
    const grid = document.getElementById('focusGameGrid');
    if (!state || !game || !grid) return;

    const question = (game.questions || [])[state.index];
    if (!question) return;

    // 播放音訊
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
      <!-- 頂部題號與歌單標籤 -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span style="background:rgba(0,122,255,0.1); color:var(--accent-color); padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          🎵 第 ${state.index + 1} / ${game.questions.length} 題
        </span>
        <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:4px 10px; border-radius:8px; font-size:13px; font-weight:bold;">
          🏷️ ${escapeForSong(tagBadge)}
        </span>
      </div>

      <!-- 唱片防作弊音樂播放區 -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:20px; text-align:center; box-shadow:0 4px 16px rgba(0,0,0,0.03);">
        <div style="position:relative; width:110px; height:110px; margin:0 auto 14px; display:flex; align-items:center; justify-content:center;">
          <!-- 旋轉黑膠唱片 -->
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

      <!-- 四選一搶答選項 -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${optionsHtml}
      </div>

      <!-- 操作與提示區 -->
      ${actionAreaHtml}

      <!-- CSS 動畫定義 -->
      <style>
        @keyframes spinVinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  };

  // 播放歌曲音訊片段 (防作弊隱藏 YouTube 播放)
  App.prototype.playSongQuizAudio = function playSongQuizAudio(question) {
    const state = this.songQuizState;
    if (!state || !question) return;

    this.stopSongQuizAudio();

    const duration = Math.max(5, Math.min(30, parseInt(question.duration) || 15));
    const startTime = Math.max(0, parseInt(question.startTime) || 0);
    const youtubeId = question.youtubeId || (this.parseYoutubeUrl ? this.parseYoutubeUrl(question.youtubeUrl).videoId : 'bv_cEeDlop0');

    const wrapper = getHiddenPlayerContainer();
    // 使用隱藏式 iframe 播放指定區段
    wrapper.innerHTML = `
      <iframe id="songQuizHiddenIframe" width="200" height="200" src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${startTime}&enablejsapi=1&controls=0" allow="autoplay" style="border:none;"></iframe>
    `;

    state.isPlayingAudio = true;
    state.audioRemainingSeconds = duration;

    state.audioTimerInterval = setInterval(() => {
      state.audioRemainingSeconds--;
      if (state.audioRemainingSeconds <= 0) {
        this.stopSongQuizAudio();
        this.renderSongQuizQuestion();
      } else {
        // 即時刷新剩餘秒數文字
        const textEl = document.querySelector('#focusGameGrid strong');
        if (textEl && state.isPlayingAudio) {
          textEl.textContent = state.audioRemainingSeconds;
        }
      }
    }, 1000);
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

  // 學生選擇答案
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

  // 下一題
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

  // 遊戲結束與結算
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

  // 渲染結算與解析清單
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
})();
