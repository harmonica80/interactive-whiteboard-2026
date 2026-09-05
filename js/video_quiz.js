// 互動式影片出題測驗系統 (Interactive Video Quiz Assessment System)
// 支援：全班同步播放測驗 (Teacher-led) 與 學生自主學習測驗 (Self-paced)
// 支援題型：單選題 (single)、複選題 (multiple)、問答題 (text)
(function (global) {
  'use strict';

  // 原廠預設精選影片測驗範例題庫
  const DEFAULT_VIDEO_QUIZZES = [
    {
      id: 'vq_solar_system',
      title: '🌌 自然科學：太陽系行星奧秘探索',
      description: '跟隨影片探索太陽系各大行星特徵、運轉規律與宇宙奧秘！',
      videoUrl: 'https://www.youtube.com/watch?v=libKVRa01L8',
      videoType: 'youtube',
      youtubeId: 'libKVRa01L8',
      createdAt: 1725550000000,
      questions: [
        {
          id: 'q_1',
          time: 25,
          timeFormatted: '00:25',
          type: 'single',
          prompt: '太陽系中體積最大、質量最重的行星是哪一顆？',
          options: ['水星', '金星', '木星', '土星'],
          correctAnswer: '木星',
          explanation: '木星是太陽系中最大的行星，屬於氣態巨行星，其質量是其他所有行星總和的2.5倍。',
          points: 10
        },
        {
          id: 'q_2',
          time: 60,
          timeFormatted: '01:00',
          type: 'multiple',
          prompt: '下列哪些行星屬於主要由岩石和金屬組成的「類地行星」？（複選題，請選出所有正確選項）',
          options: ['水星', '金星', '地球', '木星'],
          correctAnswer: ['水星', '金星', '地球'],
          explanation: '太陽系內的類地行星包含水星、金星、地球與火星；木星則為氣態巨行星。',
          points: 10
        },
        {
          id: 'q_3',
          time: 95,
          timeFormatted: '01:35',
          type: 'text',
          prompt: '【問答題】請用您自己的話簡述：為什麼地球是目前已知唯一能孕育複雜生命的行星？',
          options: [],
          correctAnswer: '位於適居帶、擁有適量液態水、合適厚度的大氣層與地磁防護',
          explanation: '地球具備適宜的日地距離（適居帶）、充足的液態水、富含氧與氮的大氣層，以及阻擋宇宙射線的強大地磁場。',
          points: 10
        }
      ]
    },
    {
      id: 'vq_chinese_culture',
      title: '📜 國文與成語典故：歷史故事與智慧啟示',
      description: '從經典歷史典故中學習成語智慧與修身哲理。',
      videoUrl: 'https://www.youtube.com/watch?v=lGbrMl8PAYA',
      videoType: 'youtube',
      youtubeId: 'lGbrMl8PAYA',
      createdAt: 1725550100000,
      questions: [
        {
          id: 'qc_1',
          time: 30,
          timeFormatted: '00:30',
          type: 'single',
          prompt: '成語「臥薪嘗膽」主要用來比喻什麼精神？',
          options: ['隨遇而安', '刻苦自勵，發憤圖強', '自不量力', '好逸惡勞'],
          correctAnswer: '刻苦自勵，發憤圖強',
          explanation: '越王勾踐戰敗後臥薪嘗膽、忍辱負重，最終成功復國。比喻刻苦自勵，奮發圖強。',
          points: 10
        },
        {
          id: 'qc_2',
          time: 75,
          timeFormatted: '01:15',
          type: 'multiple',
          prompt: '下列哪些成語典故的主角出自《三國演義》或三國時期？（複選題）',
          options: ['三顧茅廬', '草船借箭', '完璧歸趙', '鞠躬盡瘁'],
          correctAnswer: ['三顧茅廬', '草船借箭', '鞠躬盡瘁'],
          explanation: '「完璧歸趙」主角為戰國時期的藺相如；其餘三者皆為三國時期劉備與諸葛亮之典故。',
          points: 10
        },
        {
          id: 'qc_3',
          time: 120,
          timeFormatted: '02:00',
          type: 'text',
          prompt: '【問答題】在日常學習或生活中，您會如何實踐「擇善固執」的態度？請簡述您的看法。',
          options: [],
          correctAnswer: '在認清正確且善良的目標後，不隨波逐流，堅持努力到底。',
          explanation: '「擇善固執」出自《中庸》，指選擇合宜善道並堅定遵循實踐。',
          points: 10
        }
      ]
    }
  ];

  class VideoQuizManager {
    constructor() {
      this.STORAGE_KEY = 'video_quizzes_v1';
      this.quizzes = this.loadStoredQuizzes();
      this.activeQuiz = null;
      this.currentMode = 'sync'; // 'sync' (全班同步) | 'self' (自主學習) | 'editor' (出題管理)
      
      // 播放器狀態
      this.playerType = null; // 'youtube' | 'html5'
      this.ytPlayer = null;
      this.html5Player = null;
      this.pollTimer = null;
      this.currentTime = 0;
      this.duration = 0;
      this.isPlaying = false;
      this.isPlayerReady = false;

      // 測驗進度狀態 (自主學習 & 同步模式)
      this.triggeredQuestions = new Set();
      this.currentActiveQuestion = null;
      this.userAnswers = {}; // { qId: { answer, isCorrect, score } }
      this.isTeacher = false;
      
      // 編輯器暫存
      this.editingQuiz = null;
      this.editingQuestionIndex = -1;

      // Firebase 同步參照
      this.sessionRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizSession') : null;
      this.answersRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizAnswers') : null;
      this.quizzesRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizzes') : null;

      this.initFirebaseSync();
    }

    // 載入儲存的題庫清單 (優先 LocalStorage，若無則使用預設範例)
    loadStoredQuizzes() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored video quizzes', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_VIDEO_QUIZZES));
    }

    // 儲存題庫清單
    saveQuizzes() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.quizzes));
        if (this.quizzesRef) {
          const quizObj = {};
          this.quizzes.forEach(q => { quizObj[q.id] = q; });
          this.quizzesRef.set(quizObj);
        }
      } catch (e) {
        console.error('Failed to save video quizzes', e);
      }
    }

    // 初始化 Firebase 同步監聽
    initFirebaseSync() {
      if (!this.sessionRef) return;

      // 監聽遠端同步測驗廣播
      this.sessionRef.on('value', (snapshot) => {
        const session = snapshot.val();
        this.handleRemoteSessionUpdate(session);
      });

      // 監聽全班即時答題資料 (用於即時統計與排行榜)
      if (this.answersRef) {
        this.answersRef.on('value', (snapshot) => {
          const answers = snapshot.val() || {};
          this.handleRemoteAnswersUpdate(answers);
        });
      }

      // 監聽線上題庫同步
      if (this.quizzesRef) {
        this.quizzesRef.on('value', (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list = Object.values(val);
            if (list.length > 0) {
              this.quizzes = list;
              this.renderQuizSelector();
              this.renderEditorQuizList();
            }
          }
        });
      }
    }

    // 初始化介面與事件綁定
    init() {
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.bindEvents();
      
      // 預設選取第一部測驗
      if (this.quizzes.length > 0) {
        this.selectQuiz(this.quizzes[0].id);
      }
    }

    // 綁定 UI 事件
    bindEvents() {
      const modeTabs = document.querySelectorAll('.video-quiz-mode-tab');
      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const mode = tab.dataset.mode;
          this.switchMode(mode);
        });
      });

      // 編輯器影片載入按鈕
      const loadBtn = document.getElementById('vqEditorLoadVideoBtn');
      if (loadBtn) {
        loadBtn.addEventListener('click', () => this.loadEditorVideo());
      }

      // 編輯器時間點新增按鈕
      const addQBtn = document.getElementById('vqEditorAddQuestionBtn');
      if (addQBtn) {
        addQBtn.addEventListener('click', () => this.openAddQuestionModal());
      }

      // 儲存測驗按鈕
      const saveQuizBtn = document.getElementById('vqEditorSaveQuizBtn');
      if (saveQuizBtn) {
        saveQuizBtn.addEventListener('click', () => this.saveEditingQuiz());
      }
    }

    // 切換模式：'sync' (全班同步) | 'self' (自主學習) | 'editor' (出題管理)
    switchMode(mode) {
      this.currentMode = mode;
      
      document.querySelectorAll('.video-quiz-mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
      });

      const syncSec = document.getElementById('vqSyncSection');
      const selfSec = document.getElementById('vqSelfSection');
      const editorSec = document.getElementById('vqEditorSection');

      if (syncSec) syncSec.style.display = mode === 'sync' ? 'block' : 'none';
      if (selfSec) selfSec.style.display = mode === 'self' ? 'block' : 'none';
      if (editorSec) editorSec.style.display = mode === 'editor' ? 'block' : 'none';

      // 停止先前播放器避免背景繼續發聲
      this.pauseVideo();

      if (mode === 'editor') {
        this.renderEditorQuizList();
      } else if (mode === 'self' && this.activeQuiz) {
        this.startSelfPacedQuiz(this.activeQuiz.id);
      }
    }

    // 渲染主畫面測驗選擇選單
    renderQuizSelector() {
      const selects = [
        document.getElementById('vqSyncQuizSelect'),
        document.getElementById('vqSelfQuizSelect')
      ];

      selects.forEach(sel => {
        if (!sel) return;
        const curVal = sel.value;
        sel.innerHTML = this.quizzes.map(q => `
          <option value="${q.id}">🎬 ${this.escapeHtml(q.title)} (${q.questions?.length || 0} 題)</option>
        `).join('');
        if (curVal && this.quizzes.some(q => q.id === curVal)) {
          sel.value = curVal;
        }
      });
    }

    // 選取指定測驗
    selectQuiz(quizId) {
      const quiz = this.quizzes.find(q => q.id === quizId);
      if (!quiz) return;
      this.activeQuiz = quiz;

      const descEls = [
        document.getElementById('vqSyncQuizDesc'),
        document.getElementById('vqSelfQuizDesc')
      ];
      descEls.forEach(el => {
        if (el) el.textContent = quiz.description || '';
      });
    }

    // 解析 YouTube 網址取得 11 碼 ID
    extractYoutubeId(url) {
      if (!url) return null;
      const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
      const match = url.match(reg);
      return match ? match[1] : null;
    }

    // ==========================================
    // 播放器封裝 (YouTube IFrame & HTML5 Video)
    // ==========================================

    setupPlayer(containerId, videoUrl, onReadyCallback, onTimeUpdateCallback) {
      const container = document.getElementById(containerId);
      if (!container) return;

      this.destroyPlayer();
      container.innerHTML = '';
      this.isPlayerReady = false;

      const ytId = this.extractYoutubeId(videoUrl);
      if (ytId) {
        this.playerType = 'youtube';
        const playerDivId = containerId + '_yt_frame';
        container.innerHTML = `<div id="${playerDivId}" style="width: 100%; height: 100%;"></div>`;

        const initYT = () => {
          try {
            this.ytPlayer = new YT.Player(playerDivId, {
              height: '100%',
              width: '100%',
              videoId: ytId,
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin
              },
              events: {
                onReady: (event) => {
                  this.isPlayerReady = true;
                  this.duration = this.ytPlayer.getDuration() || 0;
                  if (typeof onReadyCallback === 'function') onReadyCallback(this);
                },
                onStateChange: (event) => {
                  this.isPlaying = (event.data === YT.PlayerState.PLAYING);
                }
              }
            });
          } catch (e) {
            console.error('Failed to init YouTube Player', e);
          }
        };

        if (window.YT && window.YT.Player) {
          initYT();
        } else {
          this.loadYoutubeAPI(initYT);
        }
      } else {
        // HTML5 本地或直連影片
        this.playerType = 'html5';
        const videoEl = document.createElement('video');
        videoEl.src = videoUrl;
        videoEl.controls = true;
        videoEl.playsInline = true;
        videoEl.style.width = '100%';
        videoEl.style.height = '100%';
        videoEl.style.objectFit = 'contain';
        videoEl.style.background = '#000';
        container.appendChild(videoEl);
        this.html5Player = videoEl;

        videoEl.onloadedmetadata = () => {
          this.isPlayerReady = true;
          this.duration = videoEl.duration || 0;
          if (typeof onReadyCallback === 'function') onReadyCallback(this);
        };
        videoEl.onplay = () => { this.isPlaying = true; };
        videoEl.onpause = () => { this.isPlaying = false; };
      }

      // 啟動時間輪詢
      this.pollTimer = setInterval(() => {
        if (!this.isPlayerReady) return;
        let t = 0;
        if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
          t = this.ytPlayer.getCurrentTime() || 0;
        } else if (this.playerType === 'html5' && this.html5Player) {
          t = this.html5Player.currentTime || 0;
        }
        this.currentTime = t;
        if (typeof onTimeUpdateCallback === 'function') {
          onTimeUpdateCallback(t);
        }
      }, 250);
    }

    destroyPlayer() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        try { this.ytPlayer.destroy(); } catch (e) {}
        this.ytPlayer = null;
      }
      this.html5Player = null;
      this.isPlaying = false;
      this.isPlayerReady = false;
    }

    playVideo() {
      if (!this.isPlayerReady) return;
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.playVideo();
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.play();
      }
      this.isPlaying = true;
    }

    pauseVideo() {
      if (!this.isPlayerReady) return;
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.pause();
      }
      this.isPlaying = false;
    }

    seekTo(seconds) {
      if (!this.isPlayerReady) return;
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        this.ytPlayer.seekTo(seconds, true);
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.currentTime = seconds;
      }
    }

    loadYoutubeAPI(callback) {
      if (window.YT && window.YT.Player) {
        if (typeof callback === 'function') callback();
        return;
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        if (typeof callback === 'function') callback();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const first = document.getElementsByTagName('script')[0];
        if (first && first.parentNode) {
          first.parentNode.insertBefore(tag, first);
        } else {
          document.head.appendChild(tag);
        }
      }
    }

    // ==========================================
    // 情境 A：全班同步播放測驗 (Teacher-led Sync)
    // ==========================================

    // 老師發起全班同步測驗
    startSyncQuizAsTeacher(quizId) {
      const quiz = this.quizzes.find(q => q.id === quizId) || this.activeQuiz;
      if (!quiz) {
        if (window.app) window.app.showNotification('錯誤', '請先選擇有效的影片測驗！');
        return;
      }
      this.activeQuiz = quiz;
      this.isTeacher = true;
      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;

      // 清除前次作答紀錄
      if (this.answersRef) {
        this.answersRef.remove();
      }

      // 設定 Firebase 同步廣播狀態
      const sessionData = {
        status: 'waiting',
        quizId: quiz.id,
        quizData: quiz,
        currentTime: 0,
        currentQuestionIndex: -1,
        questionStartTime: 0,
        createdAt: Date.now()
      };

      if (this.sessionRef) {
        this.sessionRef.set(sessionData).then(() => {
          if (window.app) window.app.showNotification('成功', `已發起「${quiz.title}」全班同步測驗！`);
        });
      }

      // 教師端載入播放器並監聽時間點
      this.setupPlayer('vqSyncPlayerContainer', quiz.videoUrl, () => {
        this.renderSyncTeacherControls();
      }, (time) => {
        this.handleTeacherTimelineTick(time);
      });
    }

    // 停止全班同步測驗
    stopSyncQuiz() {
      if (this.sessionRef) {
        this.sessionRef.set({ status: 'idle', updatedAt: Date.now() });
      }
      this.destroyPlayer();
      this.isTeacher = false;
      const ctrls = document.getElementById('vqSyncTeacherControls');
      if (ctrls) ctrls.style.display = 'none';
      if (window.app) window.app.showNotification('提示', '全班同步測驗已結束。');
    }

    // 教師端播放時間軸偵測出題點
    handleTeacherTimelineTick(currentTime) {
      if (!this.isTeacher || !this.activeQuiz || !this.activeQuiz.questions) return;

      for (let i = 0; i < this.activeQuiz.questions.length; i++) {
        const q = this.activeQuiz.questions[i];
        if (!this.triggeredQuestions.has(q.id) && Math.abs(currentTime - q.time) <= 1.0) {
          // 觸發時間點！暫停影片並廣播題目
          this.triggeredQuestions.add(q.id);
          this.pauseVideo();
          this.broadcastQuestion(q, i);
          break;
        }
      }
    }

    // 廣播題目給全班
    broadcastQuestion(question, index) {
      this.currentActiveQuestion = question;
      if (this.sessionRef) {
        this.sessionRef.update({
          status: 'question',
          currentQuestionIndex: index,
          currentQuestion: question,
          questionStartTime: Date.now(),
          currentTime: this.currentTime
        });
      }
      this.showQuestionOverlay(question, true);
    }

    // 教師點擊繼續播放
    resumeSyncPlayback() {
      this.hideQuestionOverlay();
      if (this.sessionRef) {
        this.sessionRef.update({
          status: 'playing',
          currentQuestionIndex: -1,
          currentQuestion: null
        });
      }
      this.playVideo();
    }

    // 處理遠端廣播更新 (學生端與老師端同步)
    handleRemoteSessionUpdate(session) {
      if (!session || session.status === 'idle') {
        const overlay = document.getElementById('vqQuestionOverlay');
        if (overlay) overlay.style.display = 'none';
        return;
      }

      // 若為學生端（非老師），接收廣播
      if (!this.isTeacher && this.currentMode === 'sync') {
        if (session.status === 'waiting' || session.status === 'playing' || session.status === 'question') {
          if (!this.activeQuiz || this.activeQuiz.id !== session.quizId) {
            this.activeQuiz = session.quizData;
            this.setupPlayer('vqSyncPlayerContainer', session.quizData.videoUrl, () => {
              if (session.status === 'playing') this.playVideo();
            });
          }
        }

        if (session.status === 'question' && session.currentQuestion) {
          this.pauseVideo();
          this.showQuestionOverlay(session.currentQuestion, false);
        } else if (session.status === 'playing') {
          this.hideQuestionOverlay();
          this.playVideo();
        } else if (session.status === 'completed') {
          this.hideQuestionOverlay();
          this.showClassAnalytics(this.activeQuiz, this.cachedRemoteAnswers || {});
        }
      }
    }

    // 渲染教師專屬同步控制列
    renderSyncTeacherControls() {
      const container = document.getElementById('vqSyncTeacherControls');
      if (!container) return;
      container.style.display = 'block';
      container.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap; background: var(--bg-card); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-top: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: bold; color: var(--accent-color);">🧑‍🏫 老師同步控制台</span>
            <span id="vqSyncSubmittedCountBadge" class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">已提交 0 人</span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="action-btn" onclick="window.videoQuiz.resumeSyncPlayback()" style="background: var(--success-color); color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">▶ 繼續播放影片</button>
            <button class="action-btn" onclick="window.videoQuiz.showCurrentQuestionAnalytics()" style="background: #5856d6; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">📊 查看本題統計</button>
            <button class="action-btn" onclick="window.videoQuiz.stopSyncQuiz()" style="background: var(--danger-color); color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">⏹ 結束全班測驗</button>
          </div>
        </div>
      `;
    }

    // ==========================================
    // 情境 B：學生自主學習測驗 (Self-paced)
    // ==========================================

    startSelfPacedQuiz(quizId) {
      const quiz = this.quizzes.find(q => q.id === quizId) || this.activeQuiz;
      if (!quiz) return;
      this.activeQuiz = quiz;
      this.isTeacher = false;
      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.userAnswers = {};

      const progressEl = document.getElementById('vqSelfProgressInfo');
      if (progressEl) {
        progressEl.textContent = `共有 ${quiz.questions?.length || 0} 題互動測驗，影片播放到關鍵時間點會自動跳出題目！`;
      }

      this.setupPlayer('vqSelfPlayerContainer', quiz.videoUrl, () => {
        if (window.app) window.app.showNotification('提示', '自主學習測驗已準備就緒，請點擊播放開始觀看！');
      }, (currentTime) => {
        this.handleSelfTimelineTick(currentTime);
      });
    }

    // 自主學習時間軸偵測
    handleSelfTimelineTick(currentTime) {
      if (!this.activeQuiz || !this.activeQuiz.questions) return;

      for (let i = 0; i < this.activeQuiz.questions.length; i++) {
        const q = this.activeQuiz.questions[i];
        if (!this.triggeredQuestions.has(q.id) && Math.abs(currentTime - q.time) <= 1.0) {
          this.triggeredQuestions.add(q.id);
          this.pauseVideo();
          this.showQuestionOverlay(q, false);
          break;
        }
      }
    }

    // ==========================================
    // 答題彈窗與作答處理 (Single / Multiple / Text)
    // ==========================================

    showQuestionOverlay(question, isTeacherView = false) {
      this.currentActiveQuestion = question;
      const overlay = document.getElementById('vqQuestionOverlay');
      const content = document.getElementById('vqQuestionOverlayContent');
      if (!overlay || !content) return;

      const typeBadge = question.type === 'single' ? '🔘 單選題' : (question.type === 'multiple' ? '☑️ 複選題' : '✍️ 問答題');
      const points = question.points || 10;

      let formHtml = '';
      if (question.type === 'single') {
        formHtml = `
          <div class="vq-options-list" style="display: flex; flex-direction: column; gap: 10px; margin: 16px 0;">
            ${(question.options || []).map((opt, idx) => `
              <label class="vq-option-item" style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 15px;">
                <input type="radio" name="vqSingleOption" value="${this.escapeHtml(opt)}" style="width: 18px; height: 18px; cursor: pointer;">
                <span>${String.fromCharCode(65 + idx)}. ${this.escapeHtml(opt)}</span>
              </label>
            `).join('')}
          </div>
        `;
      } else if (question.type === 'multiple') {
        formHtml = `
          <div class="vq-options-list" style="display: flex; flex-direction: column; gap: 10px; margin: 16px 0;">
            ${(question.options || []).map((opt, idx) => `
              <label class="vq-option-item" style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 15px;">
                <input type="checkbox" name="vqMultipleOption" value="${this.escapeHtml(opt)}" style="width: 18px; height: 18px; cursor: pointer;">
                <span>${String.fromCharCode(65 + idx)}. ${this.escapeHtml(opt)}</span>
              </label>
            `).join('')}
          </div>
        `;
      } else if (question.type === 'text') {
        formHtml = `
          <div style="margin: 16px 0;">
            <textarea id="vqTextAnswerInput" placeholder="請在此輸入您的回答..." rows="4" style="width: 100%; box-sizing: border-box; padding: 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 15px; font-family: inherit; resize: vertical;"></textarea>
          </div>
        `;
      }

      content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
          <span style="font-weight: bold; color: var(--accent-color); font-size: 14px;">${typeBadge}（${points} 分）</span>
          <span style="font-size: 12px; color: var(--text-secondary);">時間節點：${question.timeFormatted || '00:00'}</span>
        </div>
        <h3 style="font-size: 18px; line-height: 1.5; margin: 0 0 12px 0; color: var(--text-primary);">${this.escapeHtml(question.prompt)}</h3>
        ${formHtml}
        <div id="vqQuestionFeedbackArea" style="display: none; margin: 14px 0; padding: 12px; border-radius: 8px;"></div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
          <button id="vqSubmitAnswerBtn" onclick="window.videoQuiz.submitCurrentAnswer()" class="action-btn" style="background: var(--accent-color); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">
            📤 確認提交答案
          </button>
          <button id="vqContinuePlayBtn" onclick="window.videoQuiz.continueAfterAnswer()" class="action-btn" style="display: none; background: var(--success-color); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">
            ▶ 繼續播放影片
          </button>
        </div>
      `;

      overlay.style.display = 'flex';
    }

    hideQuestionOverlay() {
      const overlay = document.getElementById('vqQuestionOverlay');
      if (overlay) overlay.style.display = 'none';
      this.currentActiveQuestion = null;
    }

    // 學生提交答案
    submitCurrentAnswer() {
      if (!this.currentActiveQuestion) return;
      const q = this.currentActiveQuestion;
      let userAnswer = null;
      let isCorrect = false;

      if (q.type === 'single') {
        const checked = document.querySelector('input[name="vqSingleOption"]:checked');
        if (!checked) {
          if (window.app) window.app.showNotification('提示', '請先選擇一個選項！');
          return;
        }
        userAnswer = checked.value;
        isCorrect = (userAnswer === q.correctAnswer);
      } else if (q.type === 'multiple') {
        const checkedList = Array.from(document.querySelectorAll('input[name="vqMultipleOption"]:checked')).map(el => el.value);
        if (checkedList.length === 0) {
          if (window.app) window.app.showNotification('提示', '請至少勾選一個選項！');
          return;
        }
        userAnswer = checkedList;
        const correctSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
        isCorrect = (checkedList.length === correctSet.size && checkedList.every(val => correctSet.has(val)));
      } else if (q.type === 'text') {
        const txtEl = document.getElementById('vqTextAnswerInput');
        const textVal = txtEl ? txtEl.value.trim() : '';
        if (!textVal) {
          if (window.app) window.app.showNotification('提示', '請輸入您的問答文字回答！');
          return;
        }
        userAnswer = textVal;
        isCorrect = true; // 問答題只要提交即視為完成作答
      }

      const score = isCorrect ? (q.points || 10) : 0;
      this.userAnswers[q.id] = {
        questionId: q.id,
        type: q.type,
        answer: userAnswer,
        isCorrect,
        score
      };

      // 儲存至 Firebase
      this.syncUserAnswerToFirebase(q.id, this.userAnswers[q.id]);

      // 呈現即時答題反饋
      const feedbackArea = document.getElementById('vqQuestionFeedbackArea');
      const submitBtn = document.getElementById('vqSubmitAnswerBtn');
      const continueBtn = document.getElementById('vqContinuePlayBtn');

      if (feedbackArea) {
        feedbackArea.style.display = 'block';
        if (q.type === 'text') {
          feedbackArea.style.background = 'rgba(0, 122, 255, 0.1)';
          feedbackArea.style.border = '1px solid var(--accent-color)';
          feedbackArea.innerHTML = `
            <div style="font-weight: bold; color: var(--accent-color); margin-bottom: 4px;">✅ 問答已提交！</div>
            <div style="font-size: 13px; color: var(--text-secondary);">💡 參考解析：${this.escapeHtml(q.explanation || q.correctAnswer || '感謝您的回答！')}</div>
          `;
        } else if (isCorrect) {
          feedbackArea.style.background = 'rgba(52, 199, 89, 0.1)';
          feedbackArea.style.border = '1px solid var(--success-color)';
          feedbackArea.innerHTML = `
            <div style="font-weight: bold; color: var(--success-color); margin-bottom: 4px;">🎉 答對了！（+${score} 分）</div>
            <div style="font-size: 13px; color: var(--text-secondary);">💡 解析：${this.escapeHtml(q.explanation || '觀念非常正確！')}</div>
          `;
        } else {
          feedbackArea.style.background = 'rgba(255, 59, 48, 0.1)';
          feedbackArea.style.border = '1px solid var(--danger-color)';
          const correctText = Array.isArray(q.correctAnswer) ? q.correctAnswer.join('、') : q.correctAnswer;
          feedbackArea.innerHTML = `
            <div style="font-weight: bold; color: var(--danger-color); margin-bottom: 4px;">❌ 答錯了！正確解答為：${this.escapeHtml(correctText)}</div>
            <div style="font-size: 13px; color: var(--text-secondary);">💡 解析：${this.escapeHtml(q.explanation || '請注意影片中提到的關鍵細節喔！')}</div>
          `;
        }
      }

      if (submitBtn) submitBtn.style.display = 'none';
      if (continueBtn) continueBtn.style.display = 'inline-block';

      // 若在同步模式且為學生端，顯示等待老師廣播
      if (this.currentMode === 'sync' && !this.isTeacher) {
        if (continueBtn) continueBtn.textContent = '⏳ 等待老師繼續播放...';
        if (continueBtn) continueBtn.disabled = true;
      }
    }

    // 答題後繼續播放
    continueAfterAnswer() {
      this.hideQuestionOverlay();
      this.playVideo();

      // 檢查是否所有題目都已完成
      if (this.activeQuiz && this.activeQuiz.questions && this.triggeredQuestions.size >= this.activeQuiz.questions.length) {
        setTimeout(() => {
          this.checkSelfQuizCompletion();
        }, 1500);
      }
    }

    // 檢查自主學習完成度並顯示成績
    checkSelfQuizCompletion() {
      if (!this.activeQuiz) return;
      let totalScore = 0;
      let maxScore = 0;
      let correctCount = 0;

      (this.activeQuiz.questions || []).forEach(q => {
        maxScore += (q.points || 10);
        const ans = this.userAnswers[q.id];
        if (ans && ans.isCorrect) {
          totalScore += ans.score;
          correctCount++;
        }
      });

      this.showClassAnalytics(this.activeQuiz, this.cachedRemoteAnswers || {});
    }

    // 同步作答資料至 Firebase
    syncUserAnswerToFirebase(questionId, answerObj) {
      if (!this.answersRef) return;
      let userId = localStorage.getItem('quiz_user_id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('quiz_user_id', userId);
      }
      const userName = localStorage.getItem('user_nickname') || '同學_' + userId.slice(-4);

      this.answersRef.child(userId).update({
        userId,
        userName,
        updatedAt: Date.now()
      });
      this.answersRef.child(userId).child('answers').child(questionId).set(answerObj);
    }

    // 接收遠端全班答題更新
    handleRemoteAnswersUpdate(answers) {
      this.cachedRemoteAnswers = answers;
      const count = Object.keys(answers).length;
      const badge = document.getElementById('vqSyncSubmittedCountBadge');
      if (badge) badge.textContent = `已提交 ${count} 人`;

      // 若當前開啟統計面板，即時重繪
      const analyticsModal = document.getElementById('vqAnalyticsModal');
      if (analyticsModal && analyticsModal.style.display === 'flex' && this.activeQuiz) {
        this.renderAnalyticsDashboard(this.activeQuiz, answers);
      }
    }

    // ==========================================
    // 全班答題統計與分析儀表板 (Class Analytics)
    // ==========================================

    showCurrentQuestionAnalytics() {
      if (!this.activeQuiz) return;
      this.showClassAnalytics(this.activeQuiz, this.cachedRemoteAnswers || {});
    }

    showClassAnalytics(quiz, answersMap) {
      const modal = document.getElementById('vqAnalyticsModal');
      if (!modal) return;
      this.renderAnalyticsDashboard(quiz, answersMap);
      modal.style.display = 'flex';
    }

    closeClassAnalytics() {
      const modal = document.getElementById('vqAnalyticsModal');
      if (modal) modal.style.display = 'none';
    }

    renderAnalyticsDashboard(quiz, answersMap) {
      const container = document.getElementById('vqAnalyticsContent');
      if (!container) return;

      const userList = Object.values(answersMap || {});
      const totalParticipants = userList.length;

      let totalClassScore = 0;
      let maxPossibleScore = 0;
      (quiz.questions || []).forEach(q => { maxPossibleScore += (q.points || 10); });

      // 計算排行榜
      const leaderboard = userList.map(u => {
        let userScore = 0;
        let correctCount = 0;
        const answers = u.answers || {};
        (quiz.questions || []).forEach(q => {
          const a = answers[q.id];
          if (a && a.isCorrect) {
            userScore += (a.score || 10);
            correctCount++;
          }
        });
        totalClassScore += userScore;
        return {
          userName: u.userName || '匿名同學',
          score: userScore,
          correctCount,
          answers
        };
      }).sort((a, b) => b.score - a.score);

      const avgScore = totalParticipants > 0 ? (totalClassScore / totalParticipants).toFixed(1) : 0;
      const avgRate = maxPossibleScore > 0 ? Math.round((avgScore / maxPossibleScore) * 100) : 0;

      // 渲染單題選項統計
      let questionsHtml = '';
      (quiz.questions || []).forEach((q, qIdx) => {
        let qStatsHtml = '';
        if (q.type === 'single' || q.type === 'multiple') {
          const counts = {};
          (q.options || []).forEach(opt => { counts[opt] = 0; });
          let correctTotal = 0;

          userList.forEach(u => {
            const ans = u.answers?.[q.id];
            if (ans) {
              if (Array.isArray(ans.answer)) {
                ans.answer.forEach(opt => { counts[opt] = (counts[opt] || 0) + 1; });
              } else if (ans.answer) {
                counts[ans.answer] = (counts[ans.answer] || 0) + 1;
              }
              if (ans.isCorrect) correctTotal++;
            }
          });

          const accuracy = totalParticipants > 0 ? Math.round((correctTotal / totalParticipants) * 100) : 0;

          qStatsHtml = `
            <div style="margin-top: 10px;">
              <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                全班答對率：<strong style="color: ${accuracy >= 60 ? 'var(--success-color)' : 'var(--danger-color)'};">${accuracy}%</strong> (${correctTotal}/${totalParticipants} 人答對)
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${(q.options || []).map((opt, optIdx) => {
                  const cnt = counts[opt] || 0;
                  const pct = totalParticipants > 0 ? Math.round((cnt / totalParticipants) * 100) : 0;
                  const isAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : (q.correctAnswer === opt);
                  return `
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                      <span style="width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: ${isAnswer ? 'bold' : 'normal'}; color: ${isAnswer ? 'var(--success-color)' : 'var(--text-primary)'};">
                        ${isAnswer ? '✅ ' : ''}${String.fromCharCode(65 + optIdx)}. ${this.escapeHtml(opt)}
                      </span>
                      <div style="flex: 1; height: 16px; background: rgba(0,0,0,0.06); border-radius: 8px; overflow: hidden; position: relative;">
                        <div style="width: ${pct}%; height: 100%; background: ${isAnswer ? 'var(--success-color)' : 'var(--accent-color)'}; border-radius: 8px; transition: width 0.3s;"></div>
                      </div>
                      <span style="width: 60px; text-align: right; font-size: 12px; color: var(--text-secondary);">${cnt}人 (${pct}%)</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        } else if (q.type === 'text') {
          // 問答題條列答案文字牆
          const textAnswers = userList.map(u => ({
            name: u.userName,
            text: u.answers?.[q.id]?.answer || ''
          })).filter(item => item.text);

          qStatsHtml = `
            <div style="margin-top: 10px;">
              <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                已提交回答：<strong>${textAnswers.length}</strong> 則回饋
              </div>
              <div style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding: 6px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color);">
                ${textAnswers.length > 0 ? textAnswers.map(item => `
                  <div style="padding: 8px 12px; background: var(--bg-card); border-radius: 6px; border-left: 3px solid var(--accent-color); font-size: 13px; line-height: 1.4;">
                    <strong style="color: var(--accent-color);">${this.escapeHtml(item.name)}：</strong>
                    <span>${this.escapeHtml(item.text)}</span>
                  </div>
                `).join('') : '<div style="color: var(--text-muted); font-size: 12px; text-align: center; padding: 12px;">尚無學生提交問答</div>'}
              </div>
            </div>
          `;
        }

        questionsHtml += `
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; color: var(--accent-color); font-size: 14px;">第 ${qIdx + 1} 題（${q.timeFormatted}）</span>
              <span style="font-size: 12px; color: var(--text-secondary);">${q.type === 'single' ? '單選題' : (q.type === 'multiple' ? '複選題' : '問答題')}</span>
            </div>
            <div style="font-size: 15px; font-weight: bold; margin: 6px 0; color: var(--text-primary);">${this.escapeHtml(q.prompt)}</div>
            ${qStatsHtml}
          </div>
        `;
      });

      container.innerHTML = `
        <!-- 統計摘要卡片 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 18px;">
          <div style="background: var(--bg-card); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 12px; color: var(--text-secondary);">參與人數</div>
            <div style="font-size: 24px; font-weight: bold; color: var(--accent-color);">${totalParticipants} 人</div>
          </div>
          <div style="background: var(--bg-card); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 12px; color: var(--text-secondary);">全班平均得分</div>
            <div style="font-size: 24px; font-weight: bold; color: var(--success-color);">${avgScore} / ${maxPossibleScore}</div>
          </div>
          <div style="background: var(--bg-card); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 12px; color: var(--text-secondary);">平均答對率</div>
            <div style="font-size: 24px; font-weight: bold; color: #5856d6;">${avgRate}%</div>
          </div>
        </div>

        <!-- 各題詳細統計 -->
        <h4 style="margin: 16px 0 10px 0; font-size: 16px;">📊 各題答題分佈與統計</h4>
        ${questionsHtml}

        <!-- 全班排行榜 -->
        <h4 style="margin: 20px 0 10px 0; font-size: 16px;">🏆 全班成績排行榜</h4>
        <div style="max-height: 220px; overflow-y: auto; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); padding: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary); text-align: left;">
                <th style="padding: 8px;">排名</th>
                <th style="padding: 8px;">學生暱稱</th>
                <th style="padding: 8px; text-align: center;">答對題數</th>
                <th style="padding: 8px; text-align: right;">總得分</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard.length > 0 ? leaderboard.map((item, idx) => `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
                  <td style="padding: 8px; font-weight: bold; color: ${idx === 0 ? '#ffcc00' : (idx === 1 ? '#8e8e93' : (idx === 2 ? '#cd7f32' : 'var(--text-primary)'))};">
                    ${idx === 0 ? '🥇 1' : (idx === 1 ? '🥈 2' : (idx === 2 ? '🥉 3' : `${idx + 1}`))}
                  </td>
                  <td style="padding: 8px; font-weight: 500;">${this.escapeHtml(item.userName)}</td>
                  <td style="padding: 8px; text-align: center;">${item.correctCount} / ${quiz.questions?.length || 0}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: var(--success-color);">${item.score} 分</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="text-align: center; padding: 16px; color: var(--text-muted);">尚無作答數據</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
          <button class="action-btn" onclick="window.videoQuiz.exportAnalyticsCSV()" style="background: var(--accent-color); color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            📥 匯出全班成績 CSV
          </button>
        </div>
      `;
    }

    // 匯出全班成績 CSV
    exportAnalyticsCSV() {
      if (!this.activeQuiz) return;
      const userList = Object.values(this.cachedRemoteAnswers || {});
      let csv = '\uFEFF學生暱稱,總得分,答對題數';
      (this.activeQuiz.questions || []).forEach((q, idx) => {
        csv += `,第${idx + 1}題(${q.timeFormatted})`;
      });
      csv += '\r\n';

      userList.forEach(u => {
        let totalScore = 0;
        let correctCount = 0;
        const answers = u.answers || {};
        const qCols = (this.activeQuiz.questions || []).map(q => {
          const a = answers[q.id];
          if (a && a.isCorrect) {
            totalScore += (a.score || 10);
            correctCount++;
          }
          const ansVal = a ? (Array.isArray(a.answer) ? a.answer.join(';') : a.answer) : '未作答';
          return `"${String(ansVal).replace(/"/g, '""')}"`;
        });

        csv += `"${(u.userName || '匿名').replace(/"/g, '""')}",${totalScore},${correctCount},${qCols.join(',')}\r\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.activeQuiz.title}_全班答題統計_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // ==========================================
    // 視覺化影片出題編輯器 (Visual Quiz Editor)
    // ==========================================

    renderEditorQuizList() {
      const container = document.getElementById('vqEditorQuizList');
      if (!container) return;

      container.innerHTML = this.quizzes.map((q, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 8px;">
          <div>
            <div style="font-weight: bold; font-size: 15px; color: var(--text-primary);">${this.escapeHtml(q.title)}</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              ${q.questions?.length || 0} 個出題時間點 · 建立時間：${new Date(q.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="action-btn" onclick="window.videoQuiz.openEditQuizModal('${q.id}')" style="background: var(--accent-color); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">✏️ 編輯</button>
            <button class="action-btn" onclick="window.videoQuiz.deleteQuiz('${q.id}')" style="background: var(--danger-color); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">🗑️ 刪除</button>
          </div>
        </div>
      `).join('');
    }

    openEditQuizModal(quizId = null) {
      if (quizId) {
        const found = this.quizzes.find(q => q.id === quizId);
        this.editingQuiz = JSON.parse(JSON.stringify(found));
      } else {
        this.editingQuiz = {
          id: 'vq_' + Date.now(),
          title: '新建影片測驗',
          description: '',
          videoUrl: 'https://www.youtube.com/watch?v=libKVRa01L8',
          videoType: 'youtube',
          youtubeId: 'libKVRa01L8',
          createdAt: Date.now(),
          questions: []
        };
      }

      document.getElementById('vqEditQuizTitle').value = this.editingQuiz.title || '';
      document.getElementById('vqEditQuizDesc').value = this.editingQuiz.description || '';
      document.getElementById('vqEditQuizUrl').value = this.editingQuiz.videoUrl || '';

      this.renderEditorTimelineList();
      this.loadEditorVideo();

      const modal = document.getElementById('vqEditQuizModal');
      if (modal) modal.style.display = 'flex';
    }

    closeEditQuizModal() {
      const modal = document.getElementById('vqEditQuizModal');
      if (modal) modal.style.display = 'none';
      this.editingQuiz = null;
    }

    loadEditorVideo() {
      const url = document.getElementById('vqEditQuizUrl')?.value?.trim();
      if (!url) return;
      this.setupPlayer('vqEditorPlayerContainer', url);
    }

    // 渲染時間節點題目清單
    renderEditorTimelineList() {
      const container = document.getElementById('vqEditorTimelineList');
      if (!container || !this.editingQuiz) return;

      const qList = this.editingQuiz.questions || [];
      if (qList.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px;">目前尚未設定任何時間點題目，請播放影片至關鍵處點擊下方按鈕新增！</div>';
        return;
      }

      container.innerHTML = qList.map((q, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 8px;">
          <div>
            <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 6px; border-radius: 6px; font-size: 11px; margin-right: 6px;">⏱️ ${q.timeFormatted || '00:00'}</span>
            <span class="badge" style="background: rgba(0,0,0,0.06); color: var(--text-primary); padding: 2px 6px; border-radius: 6px; font-size: 11px; margin-right: 6px;">${q.type === 'single' ? '單選' : (q.type === 'multiple' ? '複選' : '問答')}</span>
            <strong style="font-size: 14px;">${this.escapeHtml(q.prompt)}</strong>
          </div>
          <div style="display: flex; gap: 6px;">
            <button onclick="window.videoQuiz.previewQuestionAtTime(${idx})" style="background: #5856d6; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">▶ 跳轉</button>
            <button onclick="window.videoQuiz.openEditQuestionModal(${idx})" style="background: var(--accent-color); color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">✏️ 編輯</button>
            <button onclick="window.videoQuiz.deleteQuestion(${idx})" style="background: var(--danger-color); color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">✕</button>
          </div>
        </div>
      `).join('');
    }

    // 在當前播放時間開啟新增題目彈窗
    openAddQuestionModal() {
      const curTime = Math.round(this.currentTime || 0);
      const mins = Math.floor(curTime / 60);
      const secs = curTime % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      this.editingQuestionIndex = -1;
      document.getElementById('vqQuestionTimeInput').value = curTime;
      document.getElementById('vqQuestionTimeFormatted').value = formatted;
      document.getElementById('vqQuestionTypeSelect').value = 'single';
      document.getElementById('vqQuestionPromptInput').value = '';
      document.getElementById('vqQuestionOptionsInput').value = '選項A\n選項B\n選項C\n選項D';
      document.getElementById('vqQuestionAnswerInput').value = '選項A';
      document.getElementById('vqQuestionExplanationInput').value = '';
      document.getElementById('vqQuestionPointsInput').value = '10';

      this.updateQuestionEditorTypeFields();
      const modal = document.getElementById('vqQuestionEditModal');
      if (modal) modal.style.display = 'flex';
    }

    openEditQuestionModal(index) {
      if (!this.editingQuiz || !this.editingQuiz.questions[index]) return;
      const q = this.editingQuiz.questions[index];
      this.editingQuestionIndex = index;

      document.getElementById('vqQuestionTimeInput').value = q.time;
      document.getElementById('vqQuestionTimeFormatted').value = q.timeFormatted || '00:00';
      document.getElementById('vqQuestionTypeSelect').value = q.type || 'single';
      document.getElementById('vqQuestionPromptInput').value = q.prompt || '';
      document.getElementById('vqQuestionOptionsInput').value = (q.options || []).join('\n');
      document.getElementById('vqQuestionAnswerInput').value = Array.isArray(q.correctAnswer) ? q.correctAnswer.join('\n') : (q.correctAnswer || '');
      document.getElementById('vqQuestionExplanationInput').value = q.explanation || '';
      document.getElementById('vqQuestionPointsInput').value = q.points || 10;

      this.updateQuestionEditorTypeFields();
      const modal = document.getElementById('vqQuestionEditModal');
      if (modal) modal.style.display = 'flex';
    }

    closeQuestionEditModal() {
      const modal = document.getElementById('vqQuestionEditModal');
      if (modal) modal.style.display = 'none';
    }

    updateQuestionEditorTypeFields() {
      const type = document.getElementById('vqQuestionTypeSelect')?.value || 'single';
      const optGroup = document.getElementById('vqOptionsFieldGroup');
      const ansLabel = document.getElementById('vqAnswerFieldLabel');

      if (type === 'text') {
        if (optGroup) optGroup.style.display = 'none';
        if (ansLabel) ansLabel.textContent = '參考正解或評分關鍵詞：';
      } else if (type === 'multiple') {
        if (optGroup) optGroup.style.display = 'block';
        if (ansLabel) ansLabel.textContent = '標準答案（每行填寫一個正確選項）：';
      } else {
        if (optGroup) optGroup.style.display = 'block';
        if (ansLabel) ansLabel.textContent = '標準答案（請填寫完全相符的選項文字）：';
      }
    }

    saveQuestionItem() {
      if (!this.editingQuiz) return;
      const time = parseInt(document.getElementById('vqQuestionTimeInput').value, 10) || 0;
      const mins = Math.floor(time / 60);
      const secs = time % 60;
      const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const type = document.getElementById('vqQuestionTypeSelect').value;
      const prompt = document.getElementById('vqQuestionPromptInput').value.trim();
      const optsText = document.getElementById('vqQuestionOptionsInput').value.trim();
      const ansText = document.getElementById('vqQuestionAnswerInput').value.trim();
      const explanation = document.getElementById('vqQuestionExplanationInput').value.trim();
      const points = parseInt(document.getElementById('vqQuestionPointsInput').value, 10) || 10;

      if (!prompt) {
        if (window.app) window.app.showNotification('提示', '請填寫題目問句！');
        return;
      }

      const options = type !== 'text' ? optsText.split('\n').map(s => s.trim()).filter(Boolean) : [];
      let correctAnswer = ansText;
      if (type === 'multiple') {
        correctAnswer = ansText.split('\n').map(s => s.trim()).filter(Boolean);
      }

      const qItem = {
        id: this.editingQuestionIndex >= 0 ? this.editingQuiz.questions[this.editingQuestionIndex].id : 'q_' + Date.now(),
        time,
        timeFormatted,
        type,
        prompt,
        options,
        correctAnswer,
        explanation,
        points
      };

      if (!this.editingQuiz.questions) this.editingQuiz.questions = [];
      if (this.editingQuestionIndex >= 0) {
        this.editingQuiz.questions[this.editingQuestionIndex] = qItem;
      } else {
        this.editingQuiz.questions.push(qItem);
      }

      // 按時間先後排序
      this.editingQuiz.questions.sort((a, b) => a.time - b.time);
      this.renderEditorTimelineList();
      this.closeQuestionEditModal();
    }

    deleteQuestion(index) {
      if (!this.editingQuiz || !this.editingQuiz.questions) return;
      this.editingQuiz.questions.splice(index, 1);
      this.renderEditorTimelineList();
    }

    previewQuestionAtTime(index) {
      if (!this.editingQuiz || !this.editingQuiz.questions[index]) return;
      const q = this.editingQuiz.questions[index];
      this.seekTo(q.time);
    }

    saveEditingQuiz() {
      if (!this.editingQuiz) return;
      const title = document.getElementById('vqEditQuizTitle').value.trim();
      const desc = document.getElementById('vqEditQuizDesc').value.trim();
      const url = document.getElementById('vqEditQuizUrl').value.trim();

      if (!title || !url) {
        if (window.app) window.app.showNotification('提示', '請填寫測驗標題與影片網址！');
        return;
      }

      this.editingQuiz.title = title;
      this.editingQuiz.description = desc;
      this.editingQuiz.videoUrl = url;
      this.editingQuiz.youtubeId = this.extractYoutubeId(url);
      this.editingQuiz.videoType = this.editingQuiz.youtubeId ? 'youtube' : 'html5';

      const idx = this.quizzes.findIndex(q => q.id === this.editingQuiz.id);
      if (idx >= 0) {
        this.quizzes[idx] = this.editingQuiz;
      } else {
        this.quizzes.push(this.editingQuiz);
      }

      this.saveQuizzes();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.closeEditQuizModal();
      if (window.app) window.app.showNotification('成功', '影片測驗已成功儲存！');
    }

    deleteQuiz(quizId) {
      if (!confirm('確定要刪除這部影片測驗嗎？')) return;
      this.quizzes = this.quizzes.filter(q => q.id !== quizId);
      this.saveQuizzes();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      if (window.app) window.app.showNotification('成功', '已刪除影片測驗。');
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // 掛載至全域
  global.VideoQuizManager = VideoQuizManager;
  global.videoQuiz = new VideoQuizManager();

})(typeof window !== 'undefined' ? window : global);
