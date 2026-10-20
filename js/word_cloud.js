// 即時互動文字雲系統 (Interactive Real-Time Word Cloud Assessment & Interactive System)
// 支援：純文字出題、圖片出題 (剪貼簿 Ctrl+V 貼上 / 檔案拖曳上傳)、多重提交限制、熱門詞頻排行、即時 Canvas 螺旋佈局演算、不當詞彙一鍵遮蔽、成果匯出 PNG
(function (global) {
  'use strict';

  // 預設鮮豔活潑色彩盤 (支援自適應深淺色)
  const CLOUD_PALETTES = [
    ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1'],
    ['#e11d48', '#be185d', '#a21caf', '#7c3aed', '#4338ca', '#1d4ed8', '#0369a1', '#0e7490', '#0f766e', '#047857'],
    ['#ff007f', '#7928ca', '#0070f3', '#00dfd8', '#79ffe1', '#f5a623', '#50e3c2', '#ff4081', '#00e676', '#ff9100']
  ];

  class WordCloudManager {
    constructor() {
      this.activeActivity = null;
      this.submissions = {};
      this.hiddenWords = new Set();
      this.currentPalette = 0;
      this.wordsData = [];
      this.placedWords = [];
      this.animFrameId = null;
      this.isSubmitting = false;
      this.uploadedImageUrl = null;
      this.maxSubmissionsPerStudent = 1; // 預設每人 1 次，可選 3 次或不限 (0)
      this.maxWordLength = 15;
      
      this.initFirebaseListeners();
      this.initClipboardPasteListener();
    }

    // 初始化 Firebase 監聽
    initFirebaseListeners() {
      if (typeof db === 'undefined') return;

      // 監聽文字雲活動狀態
      db.ref('quiz/wordCloud/active').on('value', (snapshot) => {
        const val = snapshot.val();
        this.activeActivity = val || null;
        this.updateActiveActivityUI();
      });

      // 監聽提交資料
      db.ref('quiz/wordCloud/submissions').on('value', (snapshot) => {
        this.submissions = snapshot.val() || {};
        this.recalculateAndRender();
      });

      // 監聽教師隱藏的詞彙名單 (自動進行 URL 解碼以相容所有編碼格式)
      db.ref('quiz/wordCloud/hiddenWords').on('value', (snapshot) => {
        const val = snapshot.val();
        const set = new Set();
        if (Array.isArray(val)) {
          val.forEach(item => {
            if (typeof item === 'string') {
              try {
                set.add(decodeURIComponent(item).trim().toLowerCase());
              } catch (e) {
                set.add(item.trim().toLowerCase());
              }
            }
          });
        }
        this.hiddenWords = set;
        this.recalculateAndRender();
      });
    }

    // 支援直接於網頁或出題區 Ctrl + V 貼上截圖
    initClipboardPasteListener() {
      window.addEventListener('paste', (e) => {
        // 若當前焦點在一般非文字雲圖片輸入框且不是文字雲管理狀態，不攔截
        const activeModal = document.getElementById('adminFeatureModal');
        const isWordCloudAdminOpen = activeModal && activeModal.style.display !== 'none' && activeModal.getAttribute('data-feature') === 'gameWordCloud';
        const panelWordCloud = document.getElementById('panel-word-cloud');
        const isWordCloudTab = panelWordCloud && panelWordCloud.classList.contains('active');

        if (!isWordCloudAdminOpen && !isWordCloudTab && !window.app?.isAdmin) return;

        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              e.preventDefault();
              this.processAndSetImage(blob);
              break;
            }
          }
        }
      });
    }

    // 處理與壓縮題目圖片 (上限 5MB, 自動最佳化為 WebP/JPEG)
    processAndSetImage(file) {
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        window.app?.showNotification('提示', '圖片大小超過 15MB，請先縮小後再上傳！');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);

          this.uploadedImageUrl = compressedUrl;
          this.renderQuestionImagePreview(compressedUrl);
          window.app?.showNotification('成功', '題目圖片已成功載入！');
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }

    // 渲染出題圖片預覽
    renderQuestionImagePreview(dataUrl) {
      const container = document.getElementById('wcImagePreviewContainer');
      const adminContainer = document.getElementById('adminWcImagePreviewContainer');
      const html = dataUrl ? `
        <div style="position: relative; display: inline-block; margin-top: 8px;">
          <img src="${dataUrl}" style="max-width: 100%; max-height: 180px; border-radius: 8px; border: 1.5px solid var(--accent-color); box-shadow: 0 4px 12px rgba(0,0,0,0.15);" onclick="window.app?.zoomShareImage('${dataUrl}')" title="點擊放大預覽">
          <button type="button" onclick="window.wordCloud?.removeQuestionImage()" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 13px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">✕</button>
        </div>
      ` : '';

      if (container) container.innerHTML = html;
      if (adminContainer) adminContainer.innerHTML = html;
    }

    removeQuestionImage() {
      this.uploadedImageUrl = null;
      this.renderQuestionImagePreview(null);
      const input = document.getElementById('wcImageFileInput');
      if (input) input.value = '';
      const adminInput = document.getElementById('adminWcImageFileInput');
      if (adminInput) adminInput.value = '';
    }

    // 發布或開啟新一輪文字雲活動
    publishActivity(isNewRound = false) {
      if (!window.app?.isAdmin) return;

      const titleInput = document.getElementById('adminWcQuestionTitleInput') || document.getElementById('wcQuestionTitleInput');
      const title = (titleInput?.value || '').trim() || '即時互動文字雲';

      const limitSelect = document.getElementById('adminWcLimitSelect') || document.getElementById('wcLimitSelect');
      const limit = (limitSelect && limitSelect.value !== undefined) ? parseInt(limitSelect.value, 10) : 1;

      const sessionId = 'wc_' + Date.now();

      const payload = {
        sessionId: sessionId,
        title: title,
        imageUrl: this.uploadedImageUrl || null,
        limitPerStudent: limit,
        active: true,
        accepting: true, // 是否持續接收作答
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        creator: window.app?.currentUserName || '老師'
      };

      // 每次發布全新活動或新一輪時，徹底清除舊提交紀錄與隱藏名單，確保全班同學皆可重新提交
      db.ref('quiz/wordCloud/submissions').remove();
      db.ref('quiz/wordCloud/hiddenWords').remove();
      this.submissions = {};
      this.hiddenWords.clear();
      this.recalculateAndRender();

      // 寫入 Firebase
      db.ref('quiz/wordCloud/active').set(payload).then(() => {
        window.app?.showNotification('成功', isNewRound ? '已成功開啟新一輪文字雲！全班同學已可再次作答。' : '即時文字雲活動已成功發布！全班同學端將同步接收。');
        this.broadcastToClass();
      }).catch(err => {
        window.app?.showNotification('錯誤', '發布失敗: ' + err.message);
      });
    }

    // 重設並開啟新一輪活動
    restartOrNewRound() {
      if (!window.app?.isAdmin) return;
      window.app?.showConfirmModal(
        '🔄',
        '確定要開啟新一輪文字雲活動嗎？',
        '這將重設所有同學的提交次數並清空畫布，讓全班重新進行文字雲作答。',
        () => {
          this.publishActivity(true);
        }
      );
    }

    // 即時調整學生提交次數限制
    changeSubmissionLimit(newLimit) {
      if (!window.app?.isAdmin) return;
      const limit = parseInt(newLimit, 10);
      this.maxSubmissionsPerStudent = limit;

      const frontSel = document.getElementById('wcLimitSelect');
      if (frontSel && String(frontSel.value) !== String(limit)) frontSel.value = limit;
      const adminSel = document.getElementById('adminWcLimitSelect');
      if (adminSel && String(adminSel.value) !== String(limit)) adminSel.value = limit;

      if (this.activeActivity) {
        db.ref('quiz/wordCloud/active/limitPerStudent').set(limit).then(() => {
          window.app?.showNotification('設定更新', `每人提交上限已調整為：${limit === 0 ? '不限次數' : limit + ' 次'}`);
        }).catch(err => {
          window.app?.showNotification('錯誤', '設定更新失敗: ' + err.message);
        });
      } else {
        window.app?.showNotification('設定更新', `已預設每人提交上限為：${limit === 0 ? '不限次數' : limit + ' 次'}`);
      }
    }

    // 廣播至全班切換分頁
    broadcastToClass() {
      if (!window.app?.isAdmin) return;
      db.ref('quiz/wordCloud/active/broadcastTimestamp').set(Date.now()).then(() => {
        window.app?.showNotification('廣播成功', '已通知全班切換至即時文字雲畫面！');
      });
    }

    // 停止/恢復接收作答 (鎖定作答)
    toggleAccepting() {
      if (!window.app?.isAdmin || !this.activeActivity) return;
      const nextState = !this.activeActivity.accepting;
      db.ref('quiz/wordCloud/active/accepting').set(nextState).then(() => {
        window.app?.showNotification('成功', nextState ? '已開放學生提交詞彙！' : '已停止接收提交 (鎖定作答)');
      });
    }

    // 結束文字雲活動
    stopActivity() {
      if (!window.app?.isAdmin) return;
      window.app?.showConfirmModal(
        '☁️',
        '確定要結束文字雲活動嗎？',
        '結束後學生端將不再顯示作答視窗，但本次文字雲成果畫面仍會保留。',
        () => {
          db.ref('quiz/wordCloud/active/active').set(false).then(() => {
            window.app?.showNotification('成功', '即時文字雲活動已結束！');
          });
        }
      );
    }

    // 清空本次文字雲的所有提交資料
    clearSubmissions() {
      if (!window.app?.isAdmin) return;
      window.app?.showConfirmModal(
        '🗑️',
        '確定要清空所有學生提交的詞彙嗎？',
        '這將重設文字雲畫布並清除所有詞頻統計，此動作無法復原。',
        () => {
          db.ref('quiz/wordCloud/submissions').remove().then(() => {
            db.ref('quiz/wordCloud/hiddenWords').remove();
            this.submissions = {};
            this.hiddenWords.clear();
            this.recalculateAndRender();
            window.app?.showNotification('成功', '已成功清空所有文字雲詞彙！');
          });
        }
      );
    }

    // 學生提交詞彙
    submitWord() {
      if (!this.activeActivity || !this.activeActivity.active) {
        window.app?.showNotification('提示', '目前尚無進行中的文字雲活動！');
        return;
      }
      if (this.activeActivity.accepting === false) {
        window.app?.showNotification('提示', '老師已鎖定作答，目前暫停接收提交！');
        return;
      }

      const input = document.getElementById('wcStudentWordInput');
      const rawText = (input?.value || '').trim();
      if (!rawText) {
        window.app?.showNotification('提示', '請輸入詞彙內容！');
        return;
      }

      // 清除過濾多餘符號，長度限制
      const cleanWord = rawText.replace(/[\r\n\t]+/g, ' ').substring(0, this.maxWordLength);

      const studentName = window.app?.currentUserName || '匿名同學';
      const studentId = window.app?.currentUserId || (navigator.userAgent + '_' + (studentName));
      
      // 正確判定提交限制：若設定為 0 代表不限次數；避免 0 || 1 誤判為 1
      const limit = (this.activeActivity && this.activeActivity.limitPerStudent !== undefined)
        ? parseInt(this.activeActivity.limitPerStudent, 10)
        : 1;

      const currentSessionId = this.activeActivity.sessionId;

      // 檢查提交次數限制 (limit === 0 為不限次數)
      if (limit > 0) {
        let userSubmitCount = 0;
        for (const key in this.submissions) {
          const item = this.submissions[key];
          if (!item) continue;
          // 若有 sessionId，只統計當前本輪的提交
          if (currentSessionId && item.sessionId && item.sessionId !== currentSessionId) {
            continue;
          }
          if (this.activeActivity.timestamp && item.timestamp && item.timestamp < (this.activeActivity.timestamp - 1000)) {
            continue;
          }
          if (item.userId === studentId || item.user === studentName) {
            userSubmitCount++;
          }
        }
        if (userSubmitCount >= limit) {
          window.app?.showNotification('提示', `每位同學最多僅能提交 ${limit} 次，您已達上限！`);
          return;
        }
      }

      if (this.isSubmitting) return;
      this.isSubmitting = true;
      setTimeout(() => { this.isSubmitting = false; }, 4000);

      const payload = {
        sessionId: currentSessionId || null,
        word: cleanWord,
        user: studentName,
        userId: studentId,
        avatar: window.app?.currentUserAvatar || null,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      db.ref('quiz/wordCloud/submissions').push(payload).then(() => {
        this.isSubmitting = false;
        if (input) input.value = '';
        window.app?.showNotification('🎉 提交成功', `您的詞彙「${cleanWord}」已飛入全班文字雲！`);
        this.showFlyingWordAnimation(cleanWord);
      }).catch(err => {
        this.isSubmitting = false;
        window.app?.showNotification('錯誤', '提交失敗: ' + err.message);
      });
    }

    // 送出成功時的輕快飛入小動畫
    showFlyingWordAnimation(word) {
      const toast = document.createElement('div');
      toast.className = 'wc-flying-word-toast';
      toast.textContent = `✨ ${word} ➔ ☁️`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fly-up');
        setTimeout(() => toast.remove(), 800);
      }, 50);
    }

    // 隱藏/遮蔽特定不當詞彙 (支援 URI 解碼)
    toggleHideWord(rawWord) {
      if (!window.app?.isAdmin) return;
      let word = rawWord;
      try {
        word = decodeURIComponent(rawWord);
      } catch (e) {
        word = rawWord;
      }
      word = (word || '').trim();
      if (!word) return;

      const lower = word.toLowerCase();
      const isHiding = !this.hiddenWords.has(lower);

      if (isHiding) {
        this.hiddenWords.add(lower);
        window.app?.showNotification('遮蔽詞彙', '已遮蔽隱藏詞彙「' + word + '」！');
      } else {
        this.hiddenWords.delete(lower);
        window.app?.showNotification('取消遮蔽', '已取消遮蔽詞彙「' + word + '」！');
      }

      this.recalculateAndRender();
      db.ref('quiz/wordCloud/hiddenWords').set(Array.from(this.hiddenWords));
    }

    // 全部取消遮蔽
    unhideAllWords() {
      if (!window.app?.isAdmin) return;
      this.hiddenWords.clear();
      db.ref('quiz/wordCloud/hiddenWords').remove();
      this.recalculateAndRender();
      window.app?.showNotification('成功', '已解除所有詞彙之遮蔽！');
    }

    // 更新活動狀態 UI (題目標題、圖片、按鈕狀態)
    updateActiveActivityUI() {
      const act = this.activeActivity;
      const isActive = act && act.active;

      // 學生端狀態提示列與輸入區
      const promptEl = document.getElementById('wcStudentPrompt');
      const studentInputSection = document.getElementById('wcStudentInputSection');
      const studentTitle = document.getElementById('wcStudentTitleDisplay');
      const studentImageWrapper = document.getElementById('wcStudentImageDisplay');
      const lockBadge = document.getElementById('wcStatusLockBadge');

      if (studentTitle) {
        studentTitle.textContent = isActive ? act.title : '目前無進行中的文字雲活動';
      }

      if (studentImageWrapper) {
        if (isActive && act.imageUrl) {
          studentImageWrapper.style.display = 'block';
          studentImageWrapper.innerHTML = `
            <img src="${act.imageUrl}" style="max-height: 220px; max-width: 100%; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.15);" onclick="window.app?.zoomShareImage('${act.imageUrl}')" title="點擊放大題目圖片">
          `;
        } else {
          studentImageWrapper.style.display = 'none';
          studentImageWrapper.innerHTML = '';
        }
      }

      if (studentInputSection) {
        studentInputSection.style.display = isActive ? 'flex' : 'none';
      }

      if (lockBadge) {
        lockBadge.style.display = (isActive && act.accepting === false) ? 'inline-flex' : 'none';
      }

      // 廣播跳轉
      if (act && act.broadcastTimestamp) {
        const now = Date.now();
        if (now - act.broadcastTimestamp < 10000 && act.broadcastTimestamp > (this.lastBroadcastTs || 0)) {
          this.lastBroadcastTs = act.broadcastTimestamp;
          if (!window.app?.isAdmin && window.app?.activeTabId !== 'panel-word-cloud') {
            window.app?.switchToTab('panel-word-cloud');
            window.app?.showNotification('即時文字雲', '老師已開啟全班即時文字雲互動！');
          }
        }
      }

      // 教師後台控制鈕同步
      const btnToggle = document.getElementById('wcBtnToggleAccept');
      const adminBtnToggle = document.getElementById('adminWcBtnToggleAccept');
      const statusText = (isActive && act.accepting === false) ? '▶️ 恢復接收作答' : '⏸️ 停止接收作答';
      if (btnToggle) btnToggle.textContent = statusText;
      if (adminBtnToggle) adminBtnToggle.textContent = statusText;

      const adminTitleInput = document.getElementById('adminWcQuestionTitleInput');
      if (adminTitleInput && document.activeElement !== adminTitleInput && isActive && act.title) {
        if (!adminTitleInput.value) adminTitleInput.value = act.title;
      }
      const currentLimit = (isActive && act.limitPerStudent !== undefined) ? parseInt(act.limitPerStudent, 10) : 1;
      const adminLimitSelect = document.getElementById('adminWcLimitSelect');
      if (adminLimitSelect && String(adminLimitSelect.value) !== String(currentLimit)) {
        adminLimitSelect.value = currentLimit;
      }
      const frontLimitSelect = document.getElementById('wcLimitSelect');
      if (frontLimitSelect && String(frontLimitSelect.value) !== String(currentLimit)) {
        frontLimitSelect.value = currentLimit;
      }
      const wordInput = document.getElementById('wcStudentWordInput');
      if (wordInput && isActive) {
        wordInput.placeholder = currentLimit === 0
          ? '請輸入 1~15 字詞彙（不限提交次數）...'
          : `請輸入 1~15 字詞彙（每人限 ${currentLimit} 次）...`;
      }
      if (isActive && act.imageUrl && !this.uploadedImageUrl) {
        this.uploadedImageUrl = act.imageUrl;
        this.renderQuestionImagePreview(act.imageUrl);
      }

      // 後台進行中狀態列即時更新
      window.app?.updateAdminActiveActivitiesUI();
    }

    // 重新統計詞頻並觸發排版演算
    recalculateAndRender() {
      const counts = {};
      const wordsList = [];

      for (const id in this.submissions) {
        const item = this.submissions[id];
        if (!item || !item.word) continue;
        const w = item.word.trim();
        if (!w) continue;
        const key = w.toLowerCase();
        if (this.hiddenWords.has(key)) continue;

        if (!counts[key]) {
          counts[key] = { word: w, count: 0, latestTs: item.timestamp || 0 };
        }
        counts[key].count++;
        if (item.timestamp && item.timestamp > counts[key].latestTs) {
          counts[key].latestTs = item.timestamp;
          counts[key].word = w; // 保留最新大小寫/格式
        }
      }

      for (const k in counts) {
        wordsList.push(counts[k]);
      }

      // 依出現次數降序排列
      wordsList.sort((a, b) => b.count - a.count || b.latestTs - a.latestTs);
      this.wordsData = wordsList;

      this.updateRankingListUI(wordsList);
      this.renderCanvas();
    }

    // 更新詞頻排行榜 UI
    updateRankingListUI(wordsList) {
      const listEl = document.getElementById('wcRankingList');
      const totalCountEl = document.getElementById('wcTotalWordsCount');
      const uniqueCountEl = document.getElementById('wcUniqueWordsCount');

      const totalWords = Object.keys(this.submissions).length;
      if (totalCountEl) totalCountEl.textContent = `${totalWords} 則`;
      if (uniqueCountEl) uniqueCountEl.textContent = `${wordsList.length} 款`;

      if (!listEl) return;
      if (wordsList.length === 0) {
        listEl.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 16px; font-size: 13px;">尚無詞彙，等待同學提交中...</li>';
        return;
      }

      const top10 = wordsList.slice(0, 15);
      const maxCount = top10[0]?.count || 1;

      listEl.innerHTML = top10.map((item, idx) => {
        const pct = Math.round((item.count / maxCount) * 100);
        const rankColor = idx === 0 ? '#f59e0b' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : 'var(--text-secondary)'));
        return `
          <li class="wc-rank-item" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--border-color); font-size: 13px;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1;">
              <span style="font-weight: 800; color: ${rankColor}; width: 22px; flex-shrink: 0; font-size: 14px;">#${idx + 1}</span>
              <span style="font-weight: bold; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.word}">${item.word}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
              <div style="width: 55px; height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; overflow: hidden;">
                <div style="width: ${pct}%; height: 100%; background: var(--accent-color); border-radius: 3px;"></div>
              </div>
              <span style="font-weight: bold; color: var(--accent-color); font-size: 12px; min-width: 28px; text-align: right;">${item.count}票</span>
              ${window.app?.isAdmin ? `
                <button type="button" class="preset-btn" onclick="window.wordCloud?.toggleHideWord('${encodeURIComponent(item.word)}')" style="padding: 1px 6px; font-size: 11px; color: #ef4444; border-color: rgba(239,68,68,0.3); background: transparent; height: auto;" title="隱藏此詞彙">✕</button>
              ` : ''}
            </div>
          </li>
        `;
      }).join('');

      if (window.app?.isAdmin && this.hiddenWords.size > 0) {
        listEl.innerHTML += `
          <li style="margin-top: 10px; padding: 6px 10px; background: rgba(239, 68, 68, 0.08); border-radius: 8px; font-size: 12px; display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #ef4444; font-weight: bold;">🚫 已遮蔽 ${this.hiddenWords.size} 個詞彙</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.wordCloud?.unhideAllWords()" style="font-size: 11px; padding: 2px 8px; height: 22px; cursor: pointer;">全部取消遮蔽</button>
          </li>
        `;
      }
    }

    // 核心 Canvas 文字雲螺旋碰撞排版演算
    renderCanvas() {
      const canvas = document.getElementById('wordCloudCanvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(340, Math.floor(rect.width || 750));
      const height = Math.max(300, Math.floor(rect.height || 480));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const words = this.wordsData;
      if (!words || words.length === 0) {
        ctx.fillStyle = 'rgba(150, 150, 150, 0.4)';
        ctx.font = 'bold 20px "Microsoft JhengHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☁️ 等待同學提交詞彙，文字雲將即時呈現！', width / 2, height / 2);
        return;
      }

      const maxCount = words[0].count;
      const minCount = words[words.length - 1].count;
      const countRange = Math.max(1, maxCount - minCount);

      // 字體大小區間計算 (最小 16px, 最大 72px)
      const minFont = Math.max(14, Math.floor(width / 38));
      const maxFont = Math.min(76, Math.floor(width / 8.5));

      const palette = CLOUD_PALETTES[this.currentPalette % CLOUD_PALETTES.length];
      const centerX = width / 2;
      const centerY = height / 2;

      const occupiedBoxes = [];
      const placedResults = [];

      words.forEach((item, index) => {
        // 正規化字級大小
        const weight = (item.count - minCount) / countRange;
        const fontSize = Math.round(minFont + Math.pow(weight, 0.8) * (maxFont - minFont));
        const fontStr = `bold ${fontSize}px "Microsoft JhengHei", "Noto Sans TC", sans-serif`;
        ctx.font = fontStr;

        const metrics = ctx.measureText(item.word);
        const textWidth = Math.ceil(metrics.width);
        const textHeight = Math.ceil(fontSize * 1.05);

        // 阿基米德螺旋線 (Archimedean Spiral) 搜尋碰撞空位
        let angle = (index * 2.39996); // 黃金角分散
        let radius = 0;
        const angleStep = 0.22;
        const radiusStep = 1.35;
        let placed = false;
        let bestX = centerX;
        let bestY = centerY;

        const maxSteps = 420;
        for (let step = 0; step < maxSteps; step++) {
          const testX = Math.round(centerX + radius * Math.cos(angle) - textWidth / 2);
          const testY = Math.round(centerY + radius * Math.sin(angle) - textHeight / 2);

          // 邊界檢查
          if (testX >= 6 && testX + textWidth <= width - 6 && testY >= 6 && testY + textHeight <= height - 6) {
            // 碰撞檢測 (AABB 邊界碰撞 + 留白 padding)
            const padding = Math.max(2, Math.floor(fontSize * 0.12));
            const box = {
              x: testX - padding,
              y: testY - padding,
              w: textWidth + padding * 2,
              h: textHeight + padding * 2
            };

            let collided = false;
            for (let b = 0; b < occupiedBoxes.length; b++) {
              const ob = occupiedBoxes[b];
              if (box.x < ob.x + ob.w && box.x + box.w > ob.x &&
                  box.y < ob.y + ob.h && box.y + box.h > ob.y) {
                collided = true;
                break;
              }
            }

            if (!collided) {
              bestX = testX;
              bestY = testY;
              occupiedBoxes.push(box);
              placed = true;
              break;
            }
          }

          angle += angleStep;
          radius += radiusStep;
        }

        if (placed) {
          const color = palette[index % palette.length];
          placedResults.push({
            word: item.word,
            count: item.count,
            x: bestX,
            y: bestY,
            w: textWidth,
            h: textHeight,
            fontSize: fontSize,
            color: color
          });
        }
      });

      this.placedWords = placedResults;

      // 繪製放置結果
      placedResults.forEach(item => {
        ctx.font = `bold ${item.fontSize}px "Microsoft JhengHei", "Noto Sans TC", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // 柔和文字陰影
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = item.color;
        ctx.fillText(item.word, item.x, item.y);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
    }

    // 切換色系調色盤
    switchPalette() {
      this.currentPalette = (this.currentPalette + 1) % CLOUD_PALETTES.length;
      this.renderCanvas();
    }

    // 匯出文字雲為高畫質 PNG 圖片
    exportPng() {
      const canvas = document.getElementById('wordCloudCanvas');
      if (!canvas) return;
      if (!this.wordsData || this.wordsData.length === 0) {
        window.app?.showNotification('提示', '目前文字雲尚無詞彙，無法匯出圖片！');
        return;
      }

      // 建立高畫質純色背景畫布
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext('2d');

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? '#1a1a2e' : '#ffffff';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // 繪製文字雲內容
      ctx.drawImage(canvas, 0, 0);

      // 加上浮水印與課堂代碼/題目標題
      const title = this.activeActivity?.title || '課堂即時文字雲';
      const classCode = window.currentClassCode ? `班級：${window.currentClassCode}` : '公開課堂';
      const timeStr = new Date().toLocaleDateString('zh-TW');

      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
      ctx.font = 'bold 24px "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`☁️ ${title}`, 30, 45);

      ctx.font = '16px "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${classCode} ‧ ${timeStr}`, exportCanvas.width - 30, 45);

      const url = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `文字雲成果_${title}_${Date.now()}.png`;
      a.click();
      window.app?.showNotification('成功', '文字雲高畫質圖片已下載！');
    }
  }

  global.WordCloudManager = WordCloudManager;
  global.wordCloud = new WordCloudManager();
})(window);
