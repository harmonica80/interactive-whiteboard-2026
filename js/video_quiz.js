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

  const DEFAULT_CUSTOM_SETS = [
    {
      id: 'cset_comprehensive_default',
      name: '綜合影音複習測驗組',
      quizIds: ['vq_science_solar', 'vq_chinese_culture'],
      createdAt: 1725550000000,
      totalQuestions: 6
    }
  ];

  class VideoQuizManager {
    constructor() {
      this.STORAGE_KEY = 'video_quizzes_v1';
      this.CUSTOM_SETS_KEY = 'video_quiz_custom_sets_v1';
      this.quizzes = this.loadStoredQuizzes();
      this.customSets = this.loadStoredCustomSets();
      this.activeQuiz = null;
      this.currentMode = 'sync'; // 'sync' (全班同步) | 'self' (自主學習) | 'editor' (出題管理)
      this.globalMode = 'sync'; // 由授課老師於管理後台統一設定 ('sync' | 'self')
      this.allowStudentRepeat = false; // 老師決定重播時學生端是否重複出題作答 (預設關閉)
      this.currentCustomSet = null; // 當前進行中的測驗組合 (支援多影片)
      this.currentSetQuizIndex = 0; // 測驗組合中當前播放的影片索引
      this.lastTeacherTickTime = 0; // 教師端上次時間軸刻度 (用於倒轉/重播偵測)
      
      // 題庫後台搜尋、分頁與影片核選自訂組合狀態
      this.adminSearchQuery = '';
      this.adminCurrentPage = 1;
      this.adminPageSize = 3;
      this.selectedQuizIds = new Set();

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
      this.lastSession = null;
      this.pendingQuestion = null;
      
      // 編輯器暫存
      this.editingQuiz = null;
      this.editingQuestionIndex = -1;

      // Firebase 同步參照
      this.sessionRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizSession') : null;
      this.answersRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizAnswers') : null;
      this.quizzesRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizzes') : null;
      this.settingsRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizSettings') : null;
      this.customSetsRef = typeof db !== 'undefined' ? db.ref('quiz/videoQuizCustomSets') : null;

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

    // 清理與驗證測驗組合清單（官方預設範例僅嚴格保留唯一一組「綜合影音複習測驗組」，其餘舊範例一律清理刪除）
    sanitizeCustomSets(list) {
      const existingDefault = Array.isArray(list) ? list.find(s => s && (s.id === 'cset_comprehensive_default' || s.name === '綜合影音複習測驗組')) : null;
      const defaultSet = existingDefault
        ? JSON.parse(JSON.stringify(existingDefault))
        : JSON.parse(JSON.stringify(DEFAULT_CUSTOM_SETS[0]));
      if (!Array.isArray(list) || list.length === 0) {
        return [defaultSet];
      }

      // 舊版範例名稱或測試留存黑名單，全部自動清除
      const legacySampleNames = new Set([
        '更新後的跨領域精選測驗組',
        '原測驗組合名稱',
        '太陽系科學核心組',
        '八大行星核心速測組',
        '經典成語與文化精選組',
        '國文與成語典故組',
        '歷史與科學綜合特輯',
        '新測驗組合'
      ]);

      // 篩選出使用者自行新建的非範例組合（排除官方預設範例與各舊版範例）
      const userCreatedSets = list.filter(s => {
        if (!s || !s.name) return false;
        if (s.name === '綜合影音複習測驗組' || s.id === 'cset_comprehensive_default' || s.id === defaultSet.id) return false;
        if (legacySampleNames.has(s.name)) return false;
        if (s.id && (s.id.startsWith('cset_default') || s.id.startsWith('cset_sample'))) return false;
        return true;
      });

      // 官方預設範例只保留唯一一個（綜合影音複習測驗組），其餘範例全數刪除
      return [defaultSet, ...userCreatedSets];
    }

    // 載入自訂常用測驗組合清單 (預設範例只保留一組「綜合影音複習測驗組」，其餘/重複自動刪除)
    loadStoredCustomSets() {
      try {
        const stored = localStorage.getItem(this.CUSTOM_SETS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const sanitized = this.sanitizeCustomSets(parsed);
          localStorage.setItem(this.CUSTOM_SETS_KEY, JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.warn('Failed to parse stored video quiz custom sets', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_CUSTOM_SETS));
    }

    // 儲存自訂常用測驗組合清單
    saveCustomSets() {
      try {
        localStorage.setItem(this.CUSTOM_SETS_KEY, JSON.stringify(this.customSets));
        if (this.customSetsRef) {
          const setObj = {};
          this.customSets.forEach(s => { setObj[s.id] = s; });
          this.customSetsRef.set(setObj);
        }
      } catch (e) {
        console.error('Failed to save video quiz custom sets', e);
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

      // 監聽測驗模式全班同步設定 (老師主導)
      if (this.settingsRef) {
        this.settingsRef.on('value', (snapshot) => {
          const val = snapshot.val();
          const mode = (val && (val.mode === 'self' || val.mode === 'sync')) ? val.mode : 'sync';
          this.applyGlobalMode(mode);
          if (val && val.assignedQuizId && mode === 'self' && !this.isTeacher) {
            this.selectQuiz(val.assignedQuizId);
            this.startSelfPacedQuiz(val.assignedQuizId);
          }
        });
      }

      // 監聽自訂常用測驗組合同步 (確保官方預設範例只保留一組，其餘舊範例自動刪除並回寫清理 Firebase)
      if (this.customSetsRef) {
        this.customSetsRef.on('value', (snapshot) => {
          const val = snapshot.val();
          let rawList = (val && typeof val === 'object') ? Object.values(val) : [];
          const sanitized = this.sanitizeCustomSets(rawList);

          const rawIds = rawList.map(s => `${s.id || ''}:${s.name || ''}`).sort().join(',');
          const sanitizedIds = sanitized.map(s => `${s.id || ''}:${s.name || ''}`).sort().join(',');
          const needsSyncBack = rawIds !== sanitizedIds;

          this.customSets = sanitized;
          localStorage.setItem(this.CUSTOM_SETS_KEY, JSON.stringify(sanitized));

          if (needsSyncBack) {
            const setObj = {};
            this.customSets.forEach(s => { setObj[s.id] = s; });
            this.customSetsRef.set(setObj);
          }

          this.renderCustomSetsList();
          this.renderQuizSelector();
        });
      }
    }

    // 初始化介面與事件綁定
    init() {
      this.renderCustomSetsList();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.bindEvents();
      this.applyGlobalMode(this.globalMode);
      
      // 預設選取第一部測驗
      if (this.quizzes.length > 0) {
        this.selectQuiz(this.quizzes[0].id);
      }

      if (window.app && window.app.isAdmin) {
        this.setAdminState(true);
      }
    }

    // 設定全班測驗模式 (僅授課老師於管理後台可操作)
    setGlobalMode(mode) {
      if (mode !== 'sync' && mode !== 'self') return;
      this.globalMode = mode;
      if (this.settingsRef) {
        this.settingsRef.set({ mode, updatedAt: Date.now() });
      }
      this.applyGlobalMode(mode);
      if (window.app) {
        const modeLabel = mode === 'sync' ? '🧑‍🏫 全班同步測驗模式' : '🎧 個人自主學習模式';
        window.app.showNotification('測驗模式設定', `已將全班學生端切換為「${modeLabel}」！`);
      }
    }

    // 套用測驗模式至畫面 (更新學生端狀態列與後台按鈕狀態)
    applyGlobalMode(mode) {
      this.globalMode = mode;

      // 1. 更新管理後台的 Radio 樣式
      const syncRadio = document.querySelector('input[name="adminVideoQuizModeRadio"][value="sync"]');
      const selfRadio = document.querySelector('input[name="adminVideoQuizModeRadio"][value="self"]');
      const lblSync = document.getElementById('lblGlobalModeSync');
      const lblSelf = document.getElementById('lblGlobalModeSelf');
      if (syncRadio && selfRadio) {
        syncRadio.checked = (mode === 'sync');
        selfRadio.checked = (mode === 'self');
      }
      if (lblSync && lblSelf) {
        if (mode === 'sync') {
          lblSync.style.borderColor = 'var(--accent-color)';
          lblSync.style.background = 'rgba(0,122,255,0.08)';
          lblSelf.style.borderColor = 'var(--border-color)';
          lblSelf.style.background = 'var(--bg-input)';
        } else {
          lblSelf.style.borderColor = 'var(--accent-color)';
          lblSelf.style.background = 'rgba(0,122,255,0.08)';
          lblSync.style.borderColor = 'var(--border-color)';
          lblSync.style.background = 'var(--bg-input)';
        }
      }

      // 2. 更新學生端頂部狀態列
      const badge = document.getElementById('vqStudentModeBadge');
      const note = document.getElementById('vqStudentModeNote');
      if (badge) {
        badge.textContent = mode === 'sync' ? '🧑‍🏫 模式：全班同步測驗' : '🎧 模式：個人自主學習';
        badge.style.background = mode === 'sync' ? 'var(--accent-color)' : '#34c759';
      }
      if (note) {
        note.textContent = mode === 'sync' 
          ? '由授課老師統一設定與引導播放'
          : '由授課老師設定為自主學習，可自由選擇影片練習';
      }

      // 3. 學生端顯示區域連動 (同步模式顯示同步區，自主模式顯示自主區)
      const syncSec = document.getElementById('vqSyncSection');
      const selfSec = document.getElementById('vqSelfSection');
      if (syncSec && selfSec) {
        if (mode === 'sync') {
          syncSec.style.display = 'block';
          selfSec.style.display = 'none';
        } else {
          syncSec.style.display = 'none';
          selfSec.style.display = 'block';
          if (this.activeQuiz && (!this.playerType || this.currentMode !== 'self')) {
            this.startSelfPacedQuiz(this.activeQuiz.id);
          }
        }
      }

      // 4. 更新管理後台測驗控制台標題、選單標籤與按鈕 (依模式即時切換)
      const secTitle = document.getElementById('vqAdminModeSectionTitle');
      const selectLabel = document.getElementById('vqAdminQuizSelectLabel');
      const startBtn = document.getElementById('vqAdminStartQuizBtn');
      const broadcastBadge = document.getElementById('vqAdminBroadcastStatusBadge');

      if (secTitle) {
        secTitle.textContent = (mode === 'sync') ? '🧑‍🏫 全班同步測驗廣播控制' : '🎧 個人自主學習測驗控制';
      }
      if (selectLabel) {
        selectLabel.textContent = (mode === 'sync') ? '選擇同步測驗單元：' : '選擇自主學習測驗單元：';
      }
      if (startBtn) {
        if (mode === 'sync') {
          startBtn.textContent = '🚀 發起全班同步測驗';
          startBtn.style.background = 'var(--accent-color)';
        } else {
          startBtn.textContent = '🚀 指派自主學習測驗';
          startBtn.style.background = '#34c759';
        }
      }
      if (broadcastBadge && (!this.lastSession || this.lastSession.status === 'idle')) {
        if (mode === 'self') {
          broadcastBadge.textContent = '🟢 自主學習中';
          broadcastBadge.style.background = '#34c759';
        } else {
          broadcastBadge.textContent = '⚪ 未發起測驗';
          broadcastBadge.style.background = 'var(--text-muted)';
        }
      }

      this.currentMode = mode;
    }

    // 管理員登入 / 登出狀態連動
    setAdminState(isAdmin) {
      this.isTeacher = !!isAdmin;
      const link = document.getElementById('vqAdminQuickLinkWrapper');
      if (link) link.style.display = this.isTeacher ? 'block' : 'none';
      this.renderCustomSetsList();
      this.renderQuizSelector();
      this.renderEditorQuizList();
      this.updateAdminBroadcastUI(this.lastSession);
      const ctrls = document.getElementById('vqSyncTeacherControls');
      if (ctrls) {
        ctrls.style.display = (this.isTeacher && this.lastSession && this.lastSession.status !== 'idle') ? 'block' : 'none';
      }
    }

    // 當切換進入「影片出題測驗」分頁時的觸發邏輯
    onTabEnter() {
      if (this.lastSession && this.lastSession.status !== 'idle') {
        const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
        const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
        if (studentNotice) studentNotice.style.display = 'none';
        if (activeWrapper) activeWrapper.style.display = 'block';

        if (!this.playerType || !this.isPlayerReady) {
          if (this.lastSession.quizData) {
            this.activeQuiz = this.lastSession.quizData;
            this.setupPlayer('vqSyncPlayerContainer', this.lastSession.quizData.videoUrl, () => {
              if (this.lastSession.status === 'playing') this.playVideo();
            });
          }
        }

        if (this.lastSession.status === 'question' && this.lastSession.currentQuestion && !this.isTeacher) {
          this.showQuestionOverlay(this.lastSession.currentQuestion, false);
        }
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

      // 需求 5：點擊遮罩外側背景自動關閉彈窗
      const overlaysToDismiss = [
        { id: 'vqAnalyticsModal', close: () => this.closeClassAnalytics() },
        { id: 'vqCustomSetModal', close: () => this.closeCustomSetModal() },
        { id: 'vqEditCustomSetNameModal', close: () => this.closeEditCustomSetNameModal() },
        { id: 'vqEditQuizModal', close: () => this.closeEditQuizModal() },
        { id: 'vqFormatGuideModal', close: () => this.closeFormatGuideModal() },
        { id: 'vqImportModal', close: () => this.closeImportModal() }
      ];
      overlaysToDismiss.forEach(({ id, close }) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('click', (e) => {
            if (e.target === el) close();
          });
        }
      });
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
      } else if (mode === 'sync') {
        this.handleRemoteSessionUpdate(this.lastSession);
      }
    }

    // 渲染主畫面與後台測驗選擇選單
    renderQuizSelector() {
      const selects = [
        document.getElementById('vqAdminQuizSelect'),
        document.getElementById('vqSyncQuizSelect'),
        document.getElementById('vqSelfQuizSelect')
      ];

      selects.forEach(sel => {
        if (!sel) return;
        const isAdminSel = (sel.id === 'vqAdminQuizSelect');
        const curVal = sel.value;
        let html = '';

        if (this.customSets && this.customSets.length > 0) {
          html += `<optgroup label="🌟 測驗組合">` +
            this.customSets.map(s => `
              <option value="custom:${s.id}">🌟 ${this.escapeHtml(s.name)} (共 ${s.quizIds?.length || s.quizCount || 0} 部影片 · ${s.totalQuestions || 0} 題)</option>
            `).join('') +
            `</optgroup>`;
        }

        const candidateQuizzes = isAdminSel 
          ? this.quizzes 
          : this.quizzes.filter(q => q.enabled !== false);

        if (candidateQuizzes.length > 0) {
          html += `<optgroup label="${isAdminSel ? '🎬 所有影片測驗庫' : '🎬 開放測驗影片'}">` +
            candidateQuizzes.map(q => {
              const qCount = q.questions?.length || 0;
              const statusText = isAdminSel ? (q.enabled !== false ? ' [🟢 開放]' : ' [⚪ 隱藏]') : '';
              return `<option value="${q.id}">🎬 ${this.escapeHtml(q.title)}${statusText} (${qCount} 題)</option>`;
            }).join('') +
            `</optgroup>`;
        } else if (!isAdminSel) {
          html += `<option value="">⚠️ 目前尚無開放測驗的影片</option>`;
        }

        sel.innerHTML = html;
        if (curVal && (this.quizzes.some(q => q.id === curVal) || (this.customSets && this.customSets.some(s => `custom:${s.id}` === curVal)))) {
          sel.value = curVal;
        }
      });
    }

    // 更新管理後台廣播狀態 UI
    updateAdminBroadcastUI(session) {
      const badge = document.getElementById('vqAdminBroadcastStatusBadge');
      const forceStopBtn = document.getElementById('vqAdminForceStopBtn');
      const activeControls = document.getElementById('vqAdminActiveControls');
      const currentTitle = document.getElementById('vqAdminCurrentQuizTitle');
      const currentProgress = document.getElementById('vqAdminCurrentQuizProgress');

      if (!session || session.status === 'idle') {
        if (badge) {
          if (this.globalMode === 'self') {
            badge.textContent = '🟢 自主學習中';
            badge.style.background = '#34c759';
          } else {
            badge.textContent = '⚪ 未發起測驗';
            badge.style.background = 'var(--text-muted)';
          }
        }
        if (forceStopBtn) forceStopBtn.style.display = 'none';
        if (activeControls) activeControls.style.display = 'none';
        return;
      }

      if (forceStopBtn) forceStopBtn.style.display = 'inline-block';
      if (activeControls) activeControls.style.display = 'block';
      if (currentTitle) {
        currentTitle.textContent = `當前測驗：${session.quizData?.title || '全班同步測驗'}`;
      }

      if (badge) {
        if (session.status === 'playing') {
          badge.textContent = '🟢 正在播放中';
          badge.style.background = 'var(--success-color)';
        } else if (session.status === 'question') {
          const qIdx = (session.currentQuestionIndex ?? -1) + 1;
          badge.textContent = `🟡 測驗作答中 (第 ${qIdx} 題)`;
          badge.style.background = '#ff9500';
        } else if (session.status === 'completed') {
          badge.textContent = '🔵 測驗已結束';
          badge.style.background = '#007aff';
        } else {
          badge.textContent = '🟣 準備中';
          badge.style.background = '#5856d6';
        }
      }

      if (currentProgress) {
        if (session.status === 'playing') {
          currentProgress.textContent = `狀態：影片同步播放中...`;
        } else if (session.status === 'question') {
          const q = session.currentQuestion;
          currentProgress.textContent = `狀態：作答中 -「${q?.prompt || ''}」`;
        } else if (session.status === 'completed') {
          currentProgress.textContent = `狀態：全體測驗完成，已統計成績`;
        } else {
          currentProgress.textContent = `狀態：等待開始播放...`;
        }
      }
    }

    // 從後台發起所選測驗 (依當前模式：同步廣播或指派自主學習)
    startAdminSelectedQuiz() {
      const select = document.getElementById('vqAdminQuizSelect');
      const quizId = select ? select.value : (this.activeQuiz ? this.activeQuiz.id : null);
      if (!quizId) {
        if (window.app) window.app.showNotification('提示', '請先選擇測驗單元！');
        return;
      }

      if (this.globalMode === 'self') {
        this.startSelfPacedQuiz(quizId);
        if (this.settingsRef) {
          this.settingsRef.update({
            mode: 'self',
            assignedQuizId: quizId,
            updatedAt: Date.now()
          });
        }
        if (window.app && typeof window.app.switchToTab === 'function') {
          window.app.switchToTab('panel-video-quiz');
        }
        if (window.app) {
          const quizTitle = this.activeQuiz?.title || '指定單元';
          window.app.showNotification('自主學習', `已載入「${quizTitle}」，學生端同步切換至此測驗！`);
        }
      } else {
        this.startSyncQuizAsTeacher(quizId);
      }
    }

    // 選取指定測驗
    selectQuiz(quizId) {
      if (typeof quizId === 'string' && quizId.startsWith('custom:')) {
        const setId = quizId.replace('custom:', '');
        const set = (this.customSets || []).find(s => s.id === setId);
        if (set) {
          const firstQuizId = (set.quizIds && set.quizIds[0]) || set.quizId;
          const parent = this.quizzes.find(q => q.id === firstQuizId);
          if (parent) {
            const cloned = JSON.parse(JSON.stringify(parent));
            cloned.id = `custom_${set.id}`;
            cloned.title = `🌟 ${set.name}`;
            cloned.description = `【測驗組合】內含 ${set.quizIds?.length || set.quizCount || 1} 部影片，共 ${set.totalQuestions || parent.questions?.length || 0} 題測驗`;
            this.activeQuiz = cloned;
          }
        }
      } else {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) return;
        this.activeQuiz = quiz;
      }

      const descEls = [
        document.getElementById('vqSyncQuizDesc'),
        document.getElementById('vqSelfQuizDesc')
      ];
      descEls.forEach(el => {
        if (el) el.textContent = this.activeQuiz ? (this.activeQuiz.description || '') : '';
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
                  if (event.data === YT.PlayerState.ENDED) {
                    this.handleVideoEnded();
                  }
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
        videoEl.onended = () => { this.handleVideoEnded(); };
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
    startSyncQuizAsTeacher(quizId, customQuizData = null) {
      let quiz = customQuizData;
      if (!quiz) {
        if (typeof quizId === 'string' && quizId.startsWith('custom:')) {
          const setId = quizId.replace('custom:', '');
          const set = (this.customSets || []).find(s => s.id === setId);
          if (set) {
            const subQuizIds = (set.quizIds && set.quizIds.length > 0) ? set.quizIds : [set.quizId || 'vq_science_solar'];
            const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
            this.currentCustomSet = set;
            this.currentSetQuizIndex = 0;
            const currentSubQuiz = allSubQuizzes[0] || this.quizzes[0];

            quiz = JSON.parse(JSON.stringify(currentSubQuiz));
            quiz.id = `custom_${set.id}`;
            quiz.customSetId = set.id;
            quiz.customSetName = set.name;
            quiz.currentSubQuizIndex = 0;
            quiz.totalSubQuizzes = allSubQuizzes.length;
            quiz.allSubQuizIds = subQuizIds;
            quiz.allSubQuizzes = allSubQuizzes;
            quiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
              (sq.questions || []).map(q => ({
                ...q,
                videoTitle: sq.title,
                videoIndex: sqIdx + 1
              }))
            );
            quiz.title = `🌟 ${set.name}`;
            quiz.description = `【測驗組合】第 1/${allSubQuizzes.length} 部：《${currentSubQuiz.title}》（共 ${quiz.allQuestions.length} 題測驗）`;
          }
        } else {
          quiz = this.quizzes.find(q => q.id === quizId) || this.activeQuiz;
          this.currentCustomSet = null;
          this.currentSetQuizIndex = 0;
        }
      }
      if (!quiz) {
        if (window.app) window.app.showNotification('錯誤', '請先選擇有效的影片測驗！');
        return;
      }
      this.activeQuiz = quiz;
      this.isTeacher = true;
      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.lastTeacherTickTime = 0;

      // 清除前次作答紀錄
      if (this.answersRef) {
        this.answersRef.remove();
      }

      // 設定 Firebase 同步廣播狀態
      const sessionData = {
        status: 'waiting',
        quizId: quiz.id,
        quizData: quiz,
        currentSubQuizIndex: this.currentSetQuizIndex || 0,
        currentTime: 0,
        currentQuestionIndex: -1,
        questionStartTime: 0,
        allowRepeat: !!this.allowStudentRepeat,
        createdAt: Date.now()
      };

      if (this.sessionRef) {
        this.sessionRef.set(sessionData).then(() => {
          if (window.app) window.app.showNotification('成功', `已發起「${quiz.title}」全班同步測驗！`);
        });
      }

      // 自動切換至「影片出題測驗」前台畫面以供投影與播放
      if (window.app && typeof window.app.switchToTab === 'function') {
        window.app.switchToTab('panel-video-quiz');
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
      this.hideQuestionOverlay();
      this.lastSession = { status: 'idle' };
      this.updateAdminBroadcastUI(this.lastSession);

      const ctrls = document.getElementById('vqSyncTeacherControls');
      if (ctrls) ctrls.style.display = 'none';

      const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
      const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
      if (studentNotice) studentNotice.style.display = 'block';
      if (activeWrapper) activeWrapper.style.display = 'none';

      const link = document.getElementById('vqAdminQuickLinkWrapper');
      if (link) link.style.display = (this.isTeacher || window.app?.isAdmin) ? 'block' : 'none';

      // 需求 7：在後台（或老師結束測驗）按下結束測驗時，應回到管理後台分頁（panel-admin）
      if (window.app && typeof window.app.switchToTab === 'function') {
        if (window.app.isAdmin || this.isTeacher || document.getElementById('panel-admin')?.classList.contains('active')) {
          window.app.switchToTab('panel-admin');
          const videoSection = document.getElementById('adminVideoQuizSection');
          if (videoSection && videoSection.classList.contains('collapsed')) {
            videoSection.classList.remove('collapsed');
          }
        }
      }

      this.currentCustomSet = null;
      this.currentSetQuizIndex = 0;
      if (window.app) window.app.showNotification('提示', '全班同步測驗已結束，已返回管理後台！');
    }

    // 教師端播放時間軸偵測出題點
    handleTeacherTimelineTick(currentTime) {
      if (!this.isTeacher || !this.activeQuiz || !this.activeQuiz.questions) return;

      // 需求 4：若倒轉或重播（目前時間小於上次時間 - 1.5 秒），清除目前時間點之後的題目已觸發紀錄，教師端皆可重複出現
      if (typeof this.lastTeacherTickTime === 'number' && currentTime < this.lastTeacherTickTime - 1.5) {
        for (let i = 0; i < this.activeQuiz.questions.length; i++) {
          const q = this.activeQuiz.questions[i];
          if (q.time > currentTime) {
            this.triggeredQuestions.delete(q.id);
          }
        }
      }
      this.lastTeacherTickTime = currentTime;

      for (let i = 0; i < this.activeQuiz.questions.length; i++) {
        const q = this.activeQuiz.questions[i];
        if (q.enabled === false) continue; // 略過後台設定不測驗的題目
        if (!this.triggeredQuestions.has(q.id) && Math.abs(currentTime - q.time) <= 1.0) {
          // 觸發時間點！暫停影片並廣播題目
          this.triggeredQuestions.add(q.id);
          this.pauseVideo();
          this.broadcastQuestion(q, i);
          this.renderSyncTeacherControls();
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
          currentTime: this.currentTime,
          allowRepeat: !!this.allowStudentRepeat
        });
      }
      this.showQuestionOverlay(question, true);
    }

    // 需求 3：直接跳轉至指定題目並立即出題 (不一定要照順序)
    jumpToQuestion(index) {
      if (!this.activeQuiz || !this.activeQuiz.questions || !this.activeQuiz.questions[index]) return;
      const q = this.activeQuiz.questions[index];
      this.currentActiveQuestion = q;
      this.triggeredQuestions.add(q.id);

      const targetTime = Math.max(0, (q.time || 0) - 0.5);
      if (this.playerType === 'youtube' && this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        this.ytPlayer.seekTo(targetTime, true);
        this.pauseVideo();
      } else if (this.playerType === 'html5' && this.html5Player) {
        this.html5Player.currentTime = targetTime;
        this.pauseVideo();
      }

      this.broadcastQuestion(q, index);
      this.renderSyncTeacherControls();

      if (window.app) {
        window.app.showNotification('跳題出題', `已跳轉至第 ${index + 1} 題 (${q.timeFormatted || this.formatSeconds(q.time)}) 並廣播題目！`);
      }
    }

    // 需求 4：切換學生端重播重複出題設定
    toggleAllowStudentRepeat(checked) {
      this.allowStudentRepeat = !!checked;
      if (this.sessionRef) {
        this.sessionRef.update({
          allowRepeat: this.allowStudentRepeat
        });
      }
      if (window.app) {
        window.app.showNotification('重複出題設定', `學生端重播時出題：${this.allowStudentRepeat ? '允許重複出題作答' : '已關閉重複出題（已答過的題目略過）'}`);
      }
    }

    // 需求 6：載入測驗組合中指定影片
    loadCustomSetVideo(subIndex) {
      if (!this.currentCustomSet) return;
      const subQuizIds = this.currentCustomSet.quizIds || [];
      if (subIndex < 0 || subIndex >= subQuizIds.length) return;

      this.currentSetQuizIndex = subIndex;
      const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
      const subQuiz = allSubQuizzes[subIndex];
      if (!subQuiz) return;

      this.activeQuiz = JSON.parse(JSON.stringify(subQuiz));
      this.activeQuiz.id = `custom_${this.currentCustomSet.id}`;
      this.activeQuiz.customSetId = this.currentCustomSet.id;
      this.activeQuiz.customSetName = this.currentCustomSet.name;
      this.activeQuiz.currentSubQuizIndex = subIndex;
      this.activeQuiz.totalSubQuizzes = allSubQuizzes.length;
      this.activeQuiz.allSubQuizIds = subQuizIds;
      this.activeQuiz.allSubQuizzes = allSubQuizzes;
      this.activeQuiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
        (sq.questions || []).map(q => ({
          ...q,
          videoTitle: sq.title,
          videoIndex: sqIdx + 1
        }))
      );
      this.activeQuiz.title = `🌟 ${this.currentCustomSet.name}`;
      this.activeQuiz.description = `【測驗組合】第 ${subIndex + 1}/${allSubQuizzes.length} 部：《${subQuiz.title}》（共 ${this.activeQuiz.allQuestions.length} 題測驗）`;

      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.lastTeacherTickTime = 0;

      if (this.sessionRef) {
        this.sessionRef.update({
          status: 'playing',
          currentSubQuizIndex: subIndex,
          quizData: this.activeQuiz,
          currentTime: 0,
          currentQuestionIndex: -1,
          currentQuestion: null,
          allowRepeat: !!this.allowStudentRepeat
        });
      }

      this.setupPlayer('vqSyncPlayerContainer', subQuiz.videoUrl, () => {
        this.renderSyncTeacherControls();
        this.playVideo();
      }, (time) => {
        this.handleTeacherTimelineTick(time);
      });

      if (window.app) {
        window.app.showNotification('影片切換', `正在播放第 ${subIndex + 1}/${allSubQuizzes.length} 部影片：《${subQuiz.title}》`);
      }
    }

    // 切換上一部或下一部影片 (delta: -1 或 +1)
    switchCustomSetVideo(delta) {
      if (!this.currentCustomSet) return;
      const targetIndex = this.currentSetQuizIndex + delta;
      this.loadCustomSetVideo(targetIndex);
    }

    // 需求 6：影片播放結束時自動銜接下一部影片
    handleVideoEnded() {
      if (this.currentCustomSet && this.currentCustomSet.quizIds && this.currentCustomSet.quizIds.length > 1) {
        if (this.currentSetQuizIndex < this.currentCustomSet.quizIds.length - 1) {
          const nextIndex = this.currentSetQuizIndex + 1;
          if (this.isTeacher) {
            if (window.app) {
              window.app.showNotification('提示', `第 ${this.currentSetQuizIndex + 1} 部影片播放結束，即將自動播放第 ${nextIndex + 1} 部影片！`);
            }
            setTimeout(() => {
              this.loadCustomSetVideo(nextIndex);
            }, 1200);
          } else if (this.currentMode === 'self') {
            if (window.app) {
              window.app.showNotification('提示', `第 ${this.currentSetQuizIndex + 1} 部影片播放結束，即將自動播放第 ${nextIndex + 1} 部影片！`);
            }
            setTimeout(() => {
              this.loadSelfPacedCustomSetVideo(nextIndex);
            }, 1200);
          }
          return;
        } else {
          // 所有影片均已播放完畢
          if (this.isTeacher) {
            if (window.app) {
              window.app.showNotification('測驗完成', '測驗組合中所有影片已播放完畢！您可以點選「查看本題統計」檢視所有影片的總答題數據。');
            }
          } else if (this.currentMode === 'self') {
            if (window.app) {
              window.app.showNotification('測驗完成', '測驗組合中所有影片測驗已全數完成！');
            }
            this.showClassAnalytics(this.activeQuiz, {
              self: {
                userName: window.app?.currentUserName || '您',
                answers: this.userAnswers
              }
            });
          }
        }
      }
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
      this.lastSession = session;
      this.updateAdminBroadcastUI(session);

      const studentNotice = document.getElementById('vqSyncStudentIdleNotice');
      const activeWrapper = document.getElementById('vqSyncActivePlayerWrapper');
      const studentTopInfo = document.getElementById('vqStudentTopInfo');
      const quickLink = document.getElementById('vqAdminQuickLinkWrapper');

      if (quickLink) {
        quickLink.style.display = (this.isTeacher || window.app?.isAdmin) ? 'block' : 'none';
      }

      if (!session || session.status === 'idle') {
        this.hideQuestionOverlay();
        if (studentNotice) studentNotice.style.display = 'block';
        if (activeWrapper) activeWrapper.style.display = 'none';
        if (studentTopInfo) studentTopInfo.innerHTML = '';
        const ctrls = document.getElementById('vqSyncTeacherControls');
        if (ctrls) ctrls.style.display = 'none';
        return;
      }

      // 有測驗正在廣播中
      if (studentNotice) studentNotice.style.display = 'none';
      if (activeWrapper) activeWrapper.style.display = 'block';
      if (studentTopInfo) {
        studentTopInfo.innerHTML = `<span style="color: var(--success-color); font-weight: bold;">🟢 廣播進行中</span>`;
      }

      const quizTitleEl = document.getElementById('vqSyncQuizTitle');
      const quizDescEl = document.getElementById('vqSyncQuizDesc');
      if (quizTitleEl && session.quizData?.title) {
        quizTitleEl.textContent = `🎬 ${session.quizData.title}`;
      }
      if (quizDescEl && session.quizData?.description) {
        quizDescEl.textContent = session.quizData.description;
      }

      // 若當前使用者為管理員或老師，顯示控制列
      if (this.isTeacher || window.app?.isAdmin) {
        this.renderSyncTeacherControls();
      }

      // 檢查是否處於「影片出題測驗」分頁
      const isVideoQuizActive = document.getElementById('panel-video-quiz')?.classList.contains('active');

      // 若為學生端（非老師），接收廣播
      if (!this.isTeacher) {
        if (session.status === 'waiting' || session.status === 'playing' || session.status === 'question') {
          if (!this.activeQuiz || this.activeQuiz.id !== session.quizId || this.activeQuiz.currentSubQuizIndex !== session.currentSubQuizIndex) {
            this.activeQuiz = session.quizData;
            if (isVideoQuizActive) {
              this.setupPlayer('vqSyncPlayerContainer', session.quizData.videoUrl, () => {
                if (session.status === 'playing') this.playVideo();
              });
            }
          }
        }

        if (session.status === 'question' && session.currentQuestion) {
          this.pauseVideo();
          const qId = session.currentQuestion.id;
          const hasAnswered = !!this.userAnswers[qId];
          const allowRepeat = session.allowRepeat !== false;

          // 關鍵防卡死：僅在使用者處於「影片出題測驗」分頁時才彈出題目覆蓋視窗，絕不遮蔽提問區或登入按鈕
          if (isVideoQuizActive) {
            if (!hasAnswered || allowRepeat) {
              if (allowRepeat && hasAnswered) {
                delete this.userAnswers[qId];
              }
              this.showQuestionOverlay(session.currentQuestion, false);
            } else {
              this.hideQuestionOverlay();
              if (window.app) {
                window.app.showNotification('提示', '老師正在重播此題，您先前已完成作答，請靜候老師繼續播放！');
              }
            }
          }
        } else if (session.status === 'playing') {
          this.hideQuestionOverlay();
          if (isVideoQuizActive) {
            this.playVideo();
          }
        } else if (session.status === 'completed') {
          this.hideQuestionOverlay();
          if (isVideoQuizActive) {
            this.showClassAnalytics(this.activeQuiz, this.cachedRemoteAnswers || {});
          }
        }
      }
    }

    // 渲染教師專屬同步控制列 (圖2 顯示出題時間點與題目清單、支援直接跳題、重複出題開關、多影片導覽)
    renderSyncTeacherControls() {
      const container = document.getElementById('vqSyncTeacherControls');
      if (!container) return;
      if (!this.isTeacher && !window.app?.isAdmin) {
        container.style.display = 'none';
        return;
      }
      container.style.display = 'block';

      // 檢查是否為多影片測驗組合
      const isMultiVideoSet = !!(this.currentCustomSet && this.currentCustomSet.quizIds && this.currentCustomSet.quizIds.length > 1);
      const multiVideoHtml = isMultiVideoSet ? `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px dashed var(--border-color); flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 6px; font-size: 11px;">測驗組合</span>
            <span style="font-weight: bold; color: var(--text-primary); font-size: 13px;">
              影片 ${this.currentSetQuizIndex + 1} / ${this.currentCustomSet.quizIds.length}：《${this.escapeHtml(this.activeQuiz?.title || '')}》
            </span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="action-btn" onclick="window.videoQuiz.switchCustomSetVideo(-1)" ${this.currentSetQuizIndex <= 0 ? 'disabled' : ''} style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); cursor: ${this.currentSetQuizIndex <= 0 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentSetQuizIndex <= 0 ? '0.5' : '1'};">◀ 上一部影片</button>
            <button type="button" class="action-btn" onclick="window.videoQuiz.switchCustomSetVideo(1)" ${this.currentSetQuizIndex >= this.currentCustomSet.quizIds.length - 1 ? 'disabled' : ''} style="padding: 4px 10px; font-size: 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); cursor: ${this.currentSetQuizIndex >= this.currentCustomSet.quizIds.length - 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentSetQuizIndex >= this.currentCustomSet.quizIds.length - 1 ? '0.5' : '1'};">下一部影片 ▶</button>
          </div>
        </div>
      ` : '';

      // 圖2 紅色方框區域：出題時間與題目清單按鈕、重複出題控制開關
      const questionsListHtml = `
        <div id="vqTeacherQuestionsList" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; flex: 1; margin: 4px 8px;">
          <span style="font-size: 12px; font-weight: bold; color: var(--text-secondary); white-space: nowrap;">出題時間軸：</span>
          ${(this.activeQuiz?.questions || []).map((q, idx) => {
            const isCurrent = this.currentActiveQuestion?.id === q.id;
            return `
              <button type="button" class="action-btn vq-qjump-btn" onclick="window.videoQuiz.jumpToQuestion(${idx})" style="padding: 4px 10px; border-radius: 16px; font-size: 12px; font-weight: bold; background: ${isCurrent ? 'var(--accent-color)' : 'var(--bg-primary)'}; color: ${isCurrent ? '#fff' : 'var(--text-primary)'}; border: 1px solid ${isCurrent ? 'var(--accent-color)' : 'var(--border-color)'}; cursor: pointer; transition: all 0.2s;" title="${this.escapeHtml(q.prompt)}">
                ⏱️ ${q.timeFormatted || this.formatSeconds(q.time)} 第 ${idx + 1} 題
              </button>
            `;
          }).join('')}
          <label style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer; color: var(--text-secondary); margin-left: 6px; white-space: nowrap;" title="勾選時，重播影片或跳題時學生端會再次跳出題目作答">
            <input type="checkbox" id="vqAllowRepeatCheckbox" onchange="window.videoQuiz.toggleAllowStudentRepeat(this.checked)" ${this.allowStudentRepeat ? 'checked' : ''}> 重播時學生重複出題
          </label>
        </div>
      `;

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; background: var(--bg-card); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-top: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          ${multiVideoHtml}
          <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: bold; color: var(--accent-color); white-space: nowrap;">🧑‍🏫 老師同步控制台</span>
              <span id="vqSyncSubmittedCountBadge" class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; white-space: nowrap;">已提交 0 人</span>
            </div>
            ${questionsListHtml}
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
              <button class="action-btn" onclick="window.videoQuiz.resumeSyncPlayback()" style="background: var(--success-color); color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">▶ 繼續播放影片</button>
              <button class="action-btn" onclick="window.videoQuiz.showCurrentQuestionAnalytics()" style="background: #5856d6; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">📊 查看本題統計</button>
              <button class="action-btn" onclick="window.videoQuiz.stopSyncQuiz()" style="background: var(--danger-color); color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">⏹ 結束全班測驗</button>
            </div>
          </div>
        </div>
      `;
    }

    // ==========================================
    // 情境 B：學生自主學習測驗 (Self-paced)
    // ==========================================

    startSelfPacedQuiz(quizId, customQuizData = null) {
      let quiz = customQuizData;
      if (!quiz) {
        if (typeof quizId === 'string' && quizId.startsWith('custom:')) {
          const setId = quizId.replace('custom:', '');
          const set = (this.customSets || []).find(s => s.id === setId);
          if (set) {
            const subQuizIds = (set.quizIds && set.quizIds.length > 0) ? set.quizIds : [set.quizId || 'vq_science_solar'];
            const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
            this.currentCustomSet = set;
            this.currentSetQuizIndex = 0;
            const currentSubQuiz = allSubQuizzes[0] || this.quizzes[0];

            quiz = JSON.parse(JSON.stringify(currentSubQuiz));
            quiz.id = `custom_${set.id}`;
            quiz.customSetId = set.id;
            quiz.customSetName = set.name;
            quiz.currentSubQuizIndex = 0;
            quiz.totalSubQuizzes = allSubQuizzes.length;
            quiz.allSubQuizIds = subQuizIds;
            quiz.allSubQuizzes = allSubQuizzes;
            quiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
              (sq.questions || []).map(q => ({
                ...q,
                videoTitle: sq.title,
                videoIndex: sqIdx + 1
              }))
            );
            quiz.title = `🌟 ${set.name}`;
            quiz.description = `【測驗組合】第 1/${allSubQuizzes.length} 部：《${currentSubQuiz.title}》（共 ${quiz.allQuestions.length} 題測驗）`;
          }
        } else {
          quiz = this.quizzes.find(q => q.id === quizId) || this.activeQuiz;
          this.currentCustomSet = null;
          this.currentSetQuizIndex = 0;
        }
      }
      if (!quiz) return;
      this.activeQuiz = quiz;
      this.isTeacher = false;
      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;
      this.userAnswers = {};

      const progressEl = document.getElementById('vqSelfProgressInfo');
      if (progressEl) {
        const activeCount = (quiz.questions || []).filter(q => q.enabled !== false).length;
        const totalSetCount = quiz.allQuestions ? quiz.allQuestions.length : activeCount;
        progressEl.textContent = `共有 ${totalSetCount} 題互動測驗，影片播放到關鍵時間點會自動跳出題目！`;
      }

      this.setupPlayer('vqSelfPlayerContainer', quiz.videoUrl, () => {
        if (window.app) window.app.showNotification('提示', '自主學習測驗已準備就緒，請點擊播放開始觀看！');
      }, (currentTime) => {
        this.handleSelfTimelineTick(currentTime);
      });
    }

    // 載入自主學習組合中下一部影片
    loadSelfPacedCustomSetVideo(subIndex) {
      if (!this.currentCustomSet) return;
      const subQuizIds = this.currentCustomSet.quizIds || [];
      if (subIndex < 0 || subIndex >= subQuizIds.length) return;

      this.currentSetQuizIndex = subIndex;
      const allSubQuizzes = subQuizIds.map(id => this.quizzes.find(q => q.id === id)).filter(Boolean);
      const subQuiz = allSubQuizzes[subIndex];
      if (!subQuiz) return;

      this.activeQuiz = JSON.parse(JSON.stringify(subQuiz));
      this.activeQuiz.id = `custom_${this.currentCustomSet.id}`;
      this.activeQuiz.customSetId = this.currentCustomSet.id;
      this.activeQuiz.customSetName = this.currentCustomSet.name;
      this.activeQuiz.currentSubQuizIndex = subIndex;
      this.activeQuiz.totalSubQuizzes = allSubQuizzes.length;
      this.activeQuiz.allSubQuizIds = subQuizIds;
      this.activeQuiz.allSubQuizzes = allSubQuizzes;
      this.activeQuiz.allQuestions = allSubQuizzes.flatMap((sq, sqIdx) => 
        (sq.questions || []).map(q => ({
          ...q,
          videoTitle: sq.title,
          videoIndex: sqIdx + 1
        }))
      );
      this.activeQuiz.title = `🌟 ${this.currentCustomSet.name}`;
      this.activeQuiz.description = `【測驗組合】第 ${subIndex + 1}/${allSubQuizzes.length} 部：《${subQuiz.title}》（共 ${this.activeQuiz.allQuestions.length} 題測驗）`;

      this.triggeredQuestions.clear();
      this.currentActiveQuestion = null;

      const progressEl = document.getElementById('vqSelfProgressInfo');
      if (progressEl) {
        progressEl.textContent = `第 ${subIndex + 1}/${allSubQuizzes.length} 部影片，本片共有 ${subQuiz.questions?.length || 0} 題測驗！`;
      }

      this.setupPlayer('vqSelfPlayerContainer', subQuiz.videoUrl, () => {
        this.playVideo();
      }, (time) => {
        this.handleSelfTimelineTick(time);
      });
    }

    // 自主學習時間軸偵測
    handleSelfTimelineTick(currentTime) {
      if (!this.activeQuiz || !this.activeQuiz.questions) return;

      for (let i = 0; i < this.activeQuiz.questions.length; i++) {
        const q = this.activeQuiz.questions[i];
        if (q.enabled === false) continue; // 略過後台設定不測驗的題目
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

      const isTeacherOrAdmin = (this.isTeacher || window.app?.isAdmin);

      content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: bold; color: var(--accent-color); font-size: 14px;">${typeBadge}（${points} 分）</span>
            <span style="font-size: 12px; color: var(--text-secondary);">時間點：${question.timeFormatted || '00:00'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${isTeacherOrAdmin ? `
              <button type="button" onclick="window.videoQuiz.stopSyncQuiz()" style="background: var(--danger-color); color: white; border: none; padding: 5px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;" title="立即停止全班測驗廣播">⏹️ 結束測驗</button>
              <button type="button" onclick="window.videoQuiz.returnToQuizVideo()" style="background: var(--accent-color); color: white; border: none; padding: 5px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;" title="關閉題目彈窗，返回測驗影片播放介面">🎬 返回測驗影片</button>
            ` : `
              <button type="button" onclick="window.app.switchToTab('panel-admin')" style="background: transparent; border: 1.5px solid var(--accent-color); color: var(--accent-color); padding: 4px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;" title="若您是老師，點此登入管理後台">⚙️ 後台登入</button>
            `}
            <button type="button" onclick="window.videoQuiz.hideQuestionOverlay()" style="background: rgba(0,0,0,0.06); color: var(--text-primary); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="暫時收合題目視窗">✕</button>
          </div>
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

    // 返回測驗影片播放介面並關閉題目彈窗 (教師端)
    returnToQuizVideo() {
      if (window.app) {
        window.app.switchToTab('panel-video-quiz');
      }
      this.hideQuestionOverlay();
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

      // 需求 6：多影片測驗組合彙整所有影片題目進行統計
      const targetQuestions = (quiz.allQuestions && quiz.allQuestions.length > 0) ? quiz.allQuestions : (quiz.questions || []);
      const subQuizzes = (quiz.allSubQuizzes && quiz.allSubQuizzes.length > 0) ? quiz.allSubQuizzes : [quiz];

      let totalClassScore = 0;
      let maxPossibleScore = 0;
      targetQuestions.forEach(q => { maxPossibleScore += (q.points || 10); });

      // 計算排行榜 (以整組測驗所有題目為基準)
      const leaderboard = userList.map(u => {
        let userScore = 0;
        let correctCount = 0;
        const answers = u.answers || {};
        targetQuestions.forEach(q => {
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

      // 渲染單題選項統計 (支援多影片分段顯示)
      let questionsHtml = '';
      subQuizzes.forEach((sq, sqIdx) => {
        if (subQuizzes.length > 1) {
          questionsHtml += `
            <div style="background: rgba(0,122,255,0.08); border-left: 4px solid var(--accent-color); padding: 8px 12px; border-radius: 6px; margin: 16px 0 10px 0; font-weight: bold; font-size: 14px; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between;">
              <span>🎬 影片 ${sqIdx + 1}：《${this.escapeHtml(sq.title)}》</span>
              <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">${sq.questions?.length || 0} 題</span>
            </div>
          `;
        }

        (sq.questions || []).forEach((q, qIdx) => {
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
                <span style="font-weight: bold; color: var(--accent-color); font-size: 14px;">第 ${qIdx + 1} 題（${q.timeFormatted || this.formatSeconds(q.time)}）</span>
                <span style="font-size: 12px; color: var(--text-secondary);">${q.type === 'single' ? '單選題' : (q.type === 'multiple' ? '複選題' : '問答題')}</span>
              </div>
              <div style="font-size: 15px; font-weight: bold; margin: 6px 0; color: var(--text-primary);">${this.escapeHtml(q.prompt)}</div>
              ${qStatsHtml}
            </div>
          `;
        });
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
        <h4 style="margin: 16px 0 10px 0; font-size: 16px;">📊 各題答題分佈與統計（共 ${targetQuestions.length} 題）</h4>
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
                  <td style="padding: 8px; text-align: center;">${item.correctCount} / ${targetQuestions.length}</td>
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

    // 匯出全班成績 CSV (多影片測驗組合彙整全體題目)
    exportAnalyticsCSV() {
      if (!this.activeQuiz) return;
      const targetQuestions = (this.activeQuiz.allQuestions && this.activeQuiz.allQuestions.length > 0) ? this.activeQuiz.allQuestions : (this.activeQuiz.questions || []);
      const userList = Object.values(this.cachedRemoteAnswers || {});
      let csv = '\uFEFF學生暱稱,總得分,答對題數';
      targetQuestions.forEach((q, idx) => {
        const vPrefix = q.videoIndex ? `[影片${q.videoIndex}]` : '';
        csv += `,${vPrefix}第${idx + 1}題(${q.timeFormatted || this.formatSeconds(q.time)})`;
      });
      csv += '\r\n';

      userList.forEach(u => {
        let totalScore = 0;
        let correctCount = 0;
        const answers = u.answers || {};
        const qCols = targetQuestions.map(q => {
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

    // ==========================================
    // 測驗組合 (Quiz Sets)
    // ==========================================

    renderCustomSetsList() {
      const container = document.getElementById('vqAdminCustomSetsList');
      if (!container) return;

      if (!this.customSets || this.customSets.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 18px; background: var(--bg-card); border-radius: 10px; border: 1px dashed var(--border-color); color: var(--text-secondary); font-size: 13px;">
            💡 尚未建立任何測驗組合。<br>
            您可以在下方題庫中勾選單部或多部影片，點選「🌟 儲存為測驗組合」，即可建立專屬快速測驗組！
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px;">
          ${this.customSets.map(set => {
            const count = set.quizIds ? set.quizIds.length : (set.quizCount || 1);
            const totalQ = set.totalQuestions || 0;
            const titles = (set.quizTitles && set.quizTitles.length > 0)
              ? set.quizTitles.map(t => `<span style="background: var(--bg-input); border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px; display: inline-block; margin-top: 3px;">🎬 ${this.escapeHtml(t)}</span>`).join('')
              : '';
            return `
              <div style="background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;">
                      <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); word-break: break-word;">🌟 ${this.escapeHtml(set.name)}</span>
                      <button class="action-btn" onclick="window.videoQuiz.openEditCustomSetNameModal('${set.id}')" title="編輯組合名稱" style="background: transparent; border: none; padding: 2px 4px; cursor: pointer; color: var(--accent-color); font-size: 13px; line-height: 1; flex-shrink: 0;">✏️</button>
                    </div>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">
                      <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 6px; border-radius: 6px; font-size: 11px; white-space: nowrap;">${count} 部影片</span>
                      <span class="badge" style="background: #34c759; color: white; padding: 2px 6px; border-radius: 6px; font-size: 11px; white-space: nowrap;">${totalQ} 題</span>
                    </div>
                  </div>
                  <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4;">
                    <div>建立日期：${new Date(set.createdAt || Date.now()).toLocaleDateString()}</div>
                    <div style="margin-top: 4px;">${titles}</div>
                  </div>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 8px;">
                  <button class="action-btn" onclick="window.videoQuiz.startSyncQuizFromCustomSet('${set.id}')" style="flex: 1; background: var(--accent-color); color: white; border: none; padding: 6px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;" title="以此組合直接發起全班同步測驗">
                    ▶ 全班開測
                  </button>
                  <button class="action-btn" onclick="window.videoQuiz.assignCustomSetToSelfPaced('${set.id}')" style="flex: 1; background: #34c759; color: white; border: none; padding: 6px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;" title="切換為學生自主學習此組合">
                    🎧 自主學習
                  </button>
                  <button class="action-btn" onclick="window.videoQuiz.deleteCustomSet('${set.id}')" style="background: var(--bg-input); border: 1px solid var(--border-color); color: var(--danger-color); padding: 6px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;" title="刪除此組合">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // 開啟編輯測驗組合名稱彈窗
    openEditCustomSetNameModal(setId) {
      const set = (this.customSets || []).find(s => s.id === setId);
      if (!set) return;
      this.editingCustomSetId = setId;

      const input = document.getElementById('vqEditCustomSetNameInput');
      if (input) {
        input.value = set.name || '';
      }
      const modal = document.getElementById('vqEditCustomSetNameModal');
      if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => { if (input) { input.focus(); input.select(); } }, 50);
      } else {
        const newName = prompt('請輸入新的測驗組合名稱：', set.name);
        if (newName && newName.trim() && newName.trim() !== set.name) {
          set.name = newName.trim();
          this.saveCustomSets();
          this.renderCustomSetsList();
          this.renderQuizSelector();
          if (window.app) window.app.showNotification('成功', `已將測驗組合更名為「${set.name}」！`);
        }
      }
    }

    // 關閉編輯測驗組合名稱彈窗
    closeEditCustomSetNameModal() {
      const modal = document.getElementById('vqEditCustomSetNameModal');
      if (modal) modal.style.display = 'none';
      this.editingCustomSetId = null;
    }

    // 確認編輯測驗組合名稱
    confirmEditCustomSetName() {
      if (!this.editingCustomSetId) return;
      const set = (this.customSets || []).find(s => s.id === this.editingCustomSetId);
      if (!set) return;

      const input = document.getElementById('vqEditCustomSetNameInput');
      const newName = input ? input.value.trim() : '';
      if (!newName) {
        if (window.app) window.app.showNotification('提示', '請輸入測驗組合名稱！');
        return;
      }

      set.name = newName;
      this.saveCustomSets();
      this.closeEditCustomSetNameModal();
      this.renderCustomSetsList();
      this.renderQuizSelector();

      if (window.app) {
        window.app.showNotification('成功', `已更新測驗組合名稱為「${newName}」！`);
      }
    }

    // 核選單部或多部影片加入組合 (需求 c)
    toggleSelectQuizForCustomSet(quizId) {
      if (this.selectedQuizIds.has(quizId)) {
        this.selectedQuizIds.delete(quizId);
      } else {
        this.selectedQuizIds.add(quizId);
      }
      this.renderEditorQuizList();
    }

    // 清除已勾選的影片
    clearSelectedQuizzes() {
      this.selectedQuizIds.clear();
      this.renderEditorQuizList();
    }

    // 開啟自訂組合命名彈窗
    openSaveCustomSetModal() {
      if (this.selectedQuizIds.size === 0) {
        if (window.app) window.app.showNotification('提示', '請先核選至少一部影片！');
        return;
      }

      const selectedQuizzes = this.quizzes.filter(q => this.selectedQuizIds.has(q.id));
      const input = document.getElementById('vqCustomSetNameInput');
      if (input) {
        if (selectedQuizzes.length === 1) {
          input.value = `${selectedQuizzes[0].title.replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/, '')} - 精選速測組`;
        } else {
          const shortNames = selectedQuizzes.map(q => q.title.replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/, '').slice(0, 6)).join('與');
          input.value = `${shortNames} - 跨領域測驗組`;
        }
      }

      const previewContainer = document.getElementById('vqCustomSetQuestionsPreview');
      if (previewContainer) {
        previewContainer.innerHTML = selectedQuizzes.map((q, idx) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 13px; background: var(--bg-card); margin-bottom: 4px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">影片 ${idx + 1}</span>
              <span style="font-weight: bold; color: var(--text-primary);">${this.escapeHtml(q.title)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge" style="background: ${q.enabled !== false ? 'rgba(52,199,89,0.15)' : 'rgba(142,142,147,0.15)'}; color: ${q.enabled !== false ? '#28a745' : 'var(--text-muted)'}; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                ${q.enabled !== false ? '🟢 前台開放' : '⚪ 前台隱藏'}
              </span>
              <span style="font-size: 12px; color: var(--text-secondary); white-space: nowrap;">共 ${q.questions?.length || 0} 題</span>
            </div>
          </div>
        `).join('');
      }

      const modal = document.getElementById('vqCustomSetModal');
      if (modal) modal.style.display = 'flex';
    }

    // 關閉自訂組合命名彈窗
    closeCustomSetModal() {
      const modal = document.getElementById('vqCustomSetModal');
      if (modal) modal.style.display = 'none';
    }

    // 確認儲存自訂測驗組合 (多影片)
    confirmSaveCustomSet() {
      const input = document.getElementById('vqCustomSetNameInput');
      const name = input ? input.value.trim() : '';
      if (!name) {
        if (window.app) window.app.showNotification('提示', '請輸入組合自訂名稱！');
        return;
      }

      const selected = this.quizzes.filter(q => this.selectedQuizIds.has(q.id));
      if (selected.length === 0) {
        if (window.app) window.app.showNotification('提示', '未選取任何影片！');
        return;
      }

      const totalQuestions = selected.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

      const newSet = {
        id: 'set_' + Date.now(),
        name: name,
        quizIds: selected.map(q => q.id),
        quizTitles: selected.map(q => q.title),
        quizCount: selected.length,
        totalQuestions: totalQuestions,
        createdAt: Date.now()
      };

      this.customSets.unshift(newSet);
      this.saveCustomSets();
      this.clearSelectedQuizzes();
      this.closeCustomSetModal();
      this.renderCustomSetsList();
      this.renderQuizSelector();

      if (window.app) {
        window.app.showNotification('成功', `已成功建立測驗組合「${name}」（含 ${selected.length} 部影片）！未來可直接一鍵開測。`);
      }
    }

    // 刪除自訂測驗組合
    deleteCustomSet(setId) {
      const set = this.customSets.find(s => s.id === setId);
      if (!set) return;
      if (!confirm(`確定要刪除「${set.name}」測驗組合嗎？`)) return;

      this.customSets = this.customSets.filter(s => s.id !== setId);
      this.saveCustomSets();
      this.renderCustomSetsList();
      this.renderQuizSelector();
      if (window.app) window.app.showNotification('成功', `已刪除測驗組合「${set.name}」。`);
    }

    // 從自訂組合直接發起全班同步測驗
    startSyncQuizFromCustomSet(setId) {
      const set = this.customSets.find(s => s.id === setId);
      if (!set) return;

      this.setGlobalMode('sync');
      this.startSyncQuizAsTeacher('custom:' + setId);
    }

    // 將自訂組合指派給自主學習模式
    assignCustomSetToSelfPaced(setId) {
      const set = this.customSets.find(s => s.id === setId);
      if (!set) return;

      this.setGlobalMode('self');
      this.startSelfPacedQuiz('custom:' + setId);
      if (window.app && typeof window.app.switchToTab === 'function') {
        window.app.switchToTab('panel-video-quiz');
      }
      if (window.app) {
        window.app.showNotification('成功', `已載入「${set.name}」進入個人自主學習！`);
      }
    }

    // 切換影片在前台的開放 / 隱藏狀態 (需求 a)
    toggleQuizEnabled(quizId) {
      const quiz = this.quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      quiz.enabled = (quiz.enabled === false); // 若為 false 轉為 true，若為 true 或 undefined 轉為 false
      this.saveQuizzes();
      this.renderEditorQuizList();
      this.renderQuizSelector();

      if (window.app) {
        const status = quiz.enabled !== false ? '已開放（學生端可見並能進行測驗）' : '已隱藏（學生端不會顯示此影片）';
        window.app.showNotification('影片出題設定', `《${quiz.title}》：${status}`);
      }
    }

    // 設定後台題庫搜尋關鍵字 (需求 b)
    setAdminSearchQuery(query) {
      this.adminSearchQuery = (query || '').trim().toLowerCase();
      this.adminCurrentPage = 1;
      this.renderEditorQuizList();
    }

    // 切換後台題庫分頁 (需求 b)
    setAdminPage(page) {
      this.adminCurrentPage = page;
      this.renderEditorQuizList();
    }

    // ==========================================
    // 視覺化影片出題編輯器 (Visual Quiz Editor)
    // ==========================================

    renderEditorQuizList() {
      const container = document.getElementById('vqAdminEditorQuizList');
      const otherContainer = document.getElementById('vqEditorQuizList');
      const paginationContainer = document.getElementById('vqAdminPaginationContainer');

      // 1. 影片搜尋過濾 (需求 b)
      const qText = this.adminSearchQuery;
      const filtered = this.quizzes.filter(quiz => {
        if (!qText) return true;
        const inTitle = (quiz.title || '').toLowerCase().includes(qText);
        const inDesc = (quiz.description || '').toLowerCase().includes(qText);
        const inUrl = (quiz.videoUrl || '').toLowerCase().includes(qText);
        const inQ = (quiz.questions || []).some(q => 
          (q.prompt || '').toLowerCase().includes(qText) || 
          (q.explanation || '').toLowerCase().includes(qText) ||
          (q.options || []).some(opt => opt.toLowerCase().includes(qText))
        );
        return inTitle || inDesc || inUrl || inQ;
      });

      // 2. 影片分頁計算 (需求 b)
      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / this.adminPageSize));
      if (this.adminCurrentPage > totalPages) this.adminCurrentPage = totalPages;
      if (this.adminCurrentPage < 1) this.adminCurrentPage = 1;

      const startIndex = (this.adminCurrentPage - 1) * this.adminPageSize;
      const pageQuizzes = filtered.slice(startIndex, startIndex + this.adminPageSize);

      // 3. 渲染題庫卡片清單
      let html = '';

      // 多選影片批量操作列 (需求 c)
      if (this.selectedQuizIds.size > 0) {
        html += `
          <div style="background: rgba(0,122,255,0.08); border: 1.5px dashed var(--accent-color); border-radius: 10px; padding: 10px 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 13px; font-weight: bold; color: var(--accent-color);">
              ✨ 目前已核選 ${this.selectedQuizIds.size} 部影片
            </span>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.videoQuiz.openSaveCustomSetModal()" class="action-btn" style="background: var(--accent-color); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer;">
                🌟 儲存為測驗組合
              </button>
              <button onclick="window.videoQuiz.clearSelectedQuizzes()" class="action-btn" style="background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                ✕ 取消核選
              </button>
            </div>
          </div>
        `;
      }

      if (this.quizzes.length === 0) {
        html += `
          <div style="text-align: center; padding: 28px; color: var(--text-secondary); font-size: 14px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color);">
            目前尚無影片測驗，請點擊上方「➕ 建立新影片測驗」或「📥 匯入題庫」開始！
          </div>
        `;
      } else if (pageQuizzes.length === 0) {
        html += `
          <div style="text-align: center; padding: 24px; color: var(--text-secondary); font-size: 14px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color);">
            🔍 查無符合「${this.escapeHtml(qText)}」的影片或題目，請嘗試其他關鍵字。
          </div>
        `;
      } else {
        html += pageQuizzes.map(quiz => {
          const questions = quiz.questions || [];
          const isEnabled = (quiz.enabled !== false);
          const isChecked = this.selectedQuizIds.has(quiz.id);

          const questionsPreview = questions.length === 0 ? `
            <div style="padding: 6px; color: var(--text-muted); font-size: 12px; text-align: center;">尚未設定任何題目</div>
          ` : questions.map((q, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; margin-bottom: 4px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 6px; flex: 1;">
                <span class="badge" style="background: var(--accent-color); color: white; padding: 1px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">⏱️ ${q.timeFormatted || '00:00'}</span>
                <span class="badge" style="background: var(--bg-input); border: 1px solid var(--border-color); padding: 1px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">${q.type === 'single' ? '單選' : (q.type === 'multiple' ? '複選' : '問答')}</span>
                <span style="color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 320px;">${this.escapeHtml(q.prompt)}</span>
              </div>
              <span style="color: var(--text-secondary); font-size: 11px; white-space: nowrap;">${q.points || 10} 分</span>
            </div>
          `).join('');

          return `
            <div style="background: var(--bg-card); border: 1.5px solid ${isChecked ? 'var(--accent-color)' : 'var(--border-color)'}; border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
              <!-- 測驗卡片頂部控制列 (核選、標題、開放開關、操作按鈕) -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 260px;">
                  <!-- 核選以自訂常用組合 (需求 c) -->
                  <div style="padding-top: 3px;">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="window.videoQuiz.toggleSelectQuizForCustomSet('${quiz.id}')" title="核選此影片加入常用組合" style="width: 18px; height: 18px; cursor: pointer;">
                  </div>
                  <div>
                    <div style="font-weight: bold; font-size: 16px; color: var(--text-primary); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span>🎬 ${this.escapeHtml(quiz.title)}</span>
                      <span class="badge" style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 8px; font-size: 11px;">共 ${questions.length} 題</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px; word-break: break-all;">
                      影片：<a href="${this.escapeHtml(quiz.videoUrl)}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${this.escapeHtml(quiz.videoUrl)}</a> · 建立時間：${new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <!-- 影片出題開關 (需求 a) 與 編輯/刪除按鈕 -->
                <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                  <button class="action-btn" onclick="window.videoQuiz.toggleQuizEnabled('${quiz.id}')" style="background: ${isEnabled ? 'rgba(52,199,89,0.12)' : 'rgba(142,142,147,0.15)'}; color: ${isEnabled ? '#28a745' : 'var(--text-muted)'}; border: 1px solid ${isEnabled ? 'rgba(52,199,89,0.3)' : 'var(--border-color)'}; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;" title="${isEnabled ? '點擊設為隱藏（前台學生選單不顯示此影片）' : '點擊設為開放（前台學生可見並能測驗此影片）'}">
                    ${isEnabled ? '🟢 前台開放測驗' : '⚪ 前台隱藏 (不顯示)'}
                  </button>
                  <button class="action-btn" onclick="window.videoQuiz.openEditQuizModal('${quiz.id}')" style="background: var(--accent-color); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">✏️ 編輯題目</button>
                  <button class="action-btn" onclick="window.videoQuiz.deleteQuiz('${quiz.id}')" style="background: var(--danger-color); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">🗑️ 刪除</button>
                </div>
              </div>

              <!-- 題目預覽列表 -->
              <div style="background: var(--bg-input); border-radius: 10px; padding: 10px; border: 1px solid var(--border-color); margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid var(--border-color);">
                  <span style="font-size: 12px; font-weight: bold; color: var(--text-secondary);">
                    📌 影片題目預覽：
                  </span>
                  <span style="font-size: 11px; color: var(--text-muted);">
                    點擊右上角「✏️ 編輯題目」可微調各題時間點與選項
                  </span>
                </div>
                ${questionsPreview}
              </div>
            </div>
          `;
        }).join('');
      }

      if (container) container.innerHTML = html;
      if (otherContainer) otherContainer.innerHTML = html;

      // 4. 渲染分頁導覽控制列 (需求 b)
      if (paginationContainer) {
        if (totalItems <= this.adminPageSize) {
          paginationContainer.innerHTML = `
            <div style="font-size: 12px; color: var(--text-secondary);">
              顯示全部 ${totalItems} 部測驗
            </div>
          `;
        } else {
          let pagesHtml = '';
          for (let p = 1; p <= totalPages; p++) {
            pagesHtml += `
              <button onclick="window.videoQuiz.setAdminPage(${p})" style="background: ${p === this.adminCurrentPage ? 'var(--accent-color)' : 'var(--bg-card)'}; color: ${p === this.adminCurrentPage ? 'white' : 'var(--text-primary)'}; border: 1px solid var(--border-color); width: 32px; height: 32px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">
                ${p}
              </button>
            `;
          }

          paginationContainer.innerHTML = `
            <div style="font-size: 12px; color: var(--text-secondary);">
              顯示第 ${startIndex + 1} - ${Math.min(startIndex + this.adminPageSize, totalItems)} 筆，共 ${totalItems} 部測驗
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button onclick="window.videoQuiz.setAdminPage(${this.adminCurrentPage - 1})" ${this.adminCurrentPage <= 1 ? 'disabled' : ''} style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: ${this.adminCurrentPage <= 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.adminCurrentPage <= 1 ? 0.5 : 1};">
                ◀ 上一頁
              </button>
              ${pagesHtml}
              <button onclick="window.videoQuiz.setAdminPage(${this.adminCurrentPage + 1})" ${this.adminCurrentPage >= totalPages ? 'disabled' : ''} style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: ${this.adminCurrentPage >= totalPages ? 'not-allowed' : 'pointer'}; opacity: ${this.adminCurrentPage >= totalPages ? 0.5 : 1};">
                下一頁 ▶
              </button>
            </div>
          `;
        }
      }
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

    // ==========================================
    // 題庫匯入 / 匯出 / 範例格式檔管理
    // ==========================================

    // 取得 JSON 格式範例物件
    getSampleTemplateJSON() {
      return [
        {
          "title": "自然科學：太陽系與行星探索 (範例)",
          "description": "探索太陽系天體特徵與八大行星奧秘",
          "videoUrl": "https://www.youtube.com/watch?v=libKVRa01L8",
          "questions": [
            {
              "time": 25,
              "timeFormatted": "00:25",
              "type": "single",
              "prompt": "太陽系中體積最大、質量最重的行星是哪一顆？",
              "options": ["水星", "金星", "木星", "土星"],
              "correctAnswer": "木星",
              "explanation": "木星是太陽系中最大的氣態巨行星。",
              "points": 10
            },
            {
              "time": 60,
              "timeFormatted": "01:00",
              "type": "multiple",
              "prompt": "下列哪些行星屬於主要由岩石和金屬組成的「類地行星」？（多選題）",
              "options": ["水星", "金星", "地球", "木星"],
              "correctAnswer": ["水星", "金星", "地球"],
              "explanation": "類地行星包含水星、金星、地球與火星。",
              "points": 10
            },
            {
              "time": 95,
              "timeFormatted": "01:35",
              "type": "text",
              "prompt": "【問答題】請簡述為什麼地球能夠孕育豐富多樣的生命？",
              "options": [],
              "correctAnswer": "位於適居帶、具備液態水、大氣層與地磁場保護",
              "explanation": "地球具備適當日地距離、充足液態水與防護大氣。",
              "points": 10
            }
          ]
        }
      ];
    }

    // 下載 JSON 格式範例檔案
    downloadSampleTemplateJSON() {
      const templateData = this.getSampleTemplateJSON();
      const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video_quiz_template.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', '已下載影片測驗 JSON 範例格式檔！');
    }

    // 取得 CSV 格式範例字串
    getSampleTemplateCSV() {
      let csv = '\uFEFF測驗標題,測驗簡介,影片網址,時間點(分:秒或秒數),題型(單選/複選/問答),題目問句,選項(以分號;區隔),標準答案(複選以分號;區隔),題目解析,配分\r\n';
      csv += '"自然科學：太陽系行星探索","探索太陽系各大行星特徵與運行奧秘","https://www.youtube.com/watch?v=libKVRa01L8","00:25","單選","太陽系中體積最大、質量最重的行星是哪一顆？","水星;金星;木星;土星","木星","木星是太陽系中最大的行星，屬於氣態巨行星。","10"\r\n';
      csv += '"自然科學：太陽系行星探索","探索太陽系各大行星特徵與運行奧秘","https://www.youtube.com/watch?v=libKVRa01L8","01:00","複選","下列哪些行星屬於主要由岩石和金屬組成的「類地行星」？","水星;金星;地球;木星","水星;金星;地球","類地行星包含水星、金星、地球與火星。","10"\r\n';
      csv += '"自然科學：太陽系行星探索","探索太陽系各大行星特徵與運行奧秘","https://www.youtube.com/watch?v=libKVRa01L8","01:35","問答","請簡述為什麼地球能夠孕育豐富多樣的生命？","","適居帶、液態水、適宜大氣與地磁保護","地球位處適居帶，擁有液態水與完整大氣保護。","10"\r\n';
      return csv;
    }

    // 下載 CSV 格式範例檔案
    downloadSampleTemplateCSV() {
      const csv = this.getSampleTemplateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video_quiz_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', '已下載影片測驗 CSV 範例格式檔！');
    }

    // 匯出全部題庫備份 (JSON)
    exportQuizzesJSON() {
      if (!this.quizzes || this.quizzes.length === 0) {
        if (window.app) window.app.showNotification('提示', '目前沒有任何影片測驗可供匯出！');
        return;
      }
      const dataStr = JSON.stringify(this.quizzes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_quizzes_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', `已順利匯出 ${this.quizzes.length} 部影片測驗題庫備份！`);
    }

    // 匯出全部題庫備份 (CSV)
    exportQuizzesCSV() {
      if (!this.quizzes || this.quizzes.length === 0) {
        if (window.app) window.app.showNotification('提示', '目前沒有任何影片測驗可供匯出！');
        return;
      }
      let csv = '\uFEFF測驗標題,測驗簡介,影片網址,時間點(分:秒或秒數),題型(單選/複選/問答),題目問句,選項(以分號;區隔),標準答案(複選以分號;區隔),題目解析,配分\r\n';
      this.quizzes.forEach(quiz => {
        const title = (quiz.title || '').replace(/"/g, '""');
        const desc = (quiz.description || '').replace(/"/g, '""');
        const url = (quiz.videoUrl || '').replace(/"/g, '""');
        (quiz.questions || []).forEach(q => {
          const timeStr = q.timeFormatted || this.formatSeconds(q.time);
          const typeStr = q.type === 'single' ? '單選' : (q.type === 'multiple' ? '複選' : '問答');
          const prompt = (q.prompt || '').replace(/"/g, '""');
          const opts = ((q.options || []).join(';')).replace(/"/g, '""');
          const ans = (Array.isArray(q.correctAnswer) ? q.correctAnswer.join(';') : (q.correctAnswer || '')).replace(/"/g, '""');
          const exp = (q.explanation || '').replace(/"/g, '""');
          const pts = q.points || 10;
          csv += `"${title}","${desc}","${url}","${timeStr}","${typeStr}","${prompt}","${opts}","${ans}","${exp}","${pts}"\r\n`;
        });
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_quizzes_backup_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.app) window.app.showNotification('成功', '已順利匯出 CSV 格式影片題庫！');
    }

    // 開啟匯入彈窗
    openImportModal() {
      const modal = document.getElementById('vqImportModal');
      const input = document.getElementById('vqImportTextInput');
      const fileInput = document.getElementById('vqImportFileInput');
      if (input) input.value = '';
      if (fileInput) fileInput.value = '';
      if (modal) modal.style.display = 'flex';
    }

    // 關閉匯入彈窗
    closeImportModal() {
      const modal = document.getElementById('vqImportModal');
      if (modal) modal.style.display = 'none';
    }

    // 處理檔案拖曳或選取
    handleImportFileChange(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const textInput = document.getElementById('vqImportTextInput');
        if (textInput) textInput.value = text;
      };
      reader.readAsText(file, 'utf-8');
    }

    // 執行匯入
    executeImport() {
      const textInput = document.getElementById('vqImportTextInput');
      const text = textInput ? textInput.value.trim() : '';
      if (!text) {
        if (window.app) window.app.showNotification('提示', '請先選擇檔案或在文字框中貼上 JSON / CSV 內容！');
        return;
      }

      const modeRadio = document.querySelector('input[name="vqImportMode"]:checked');
      const mode = modeRadio ? modeRadio.value : 'merge'; // 'merge' or 'replace'

      try {
        let importedList = [];
        if (text.startsWith('[') || text.startsWith('{')) {
          importedList = this.parseQuizzesFromJSON(text);
        } else {
          importedList = this.parseQuizzesFromCSV(text);
        }

        if (!importedList || importedList.length === 0) {
          throw new Error('未在檔案中解析出任何有效的測驗資料，請檢查格式是否正確！');
        }

        if (mode === 'replace') {
          this.quizzes = importedList;
        } else {
          // 合併模式：同 ID 或同標題進行覆蓋，否則新增
          importedList.forEach(newQ => {
            const existingIdx = this.quizzes.findIndex(q => q.id === newQ.id || q.title === newQ.title);
            if (existingIdx >= 0) {
              this.quizzes[existingIdx] = newQ;
            } else {
              this.quizzes.push(newQ);
            }
          });
        }

        this.saveQuizzes();
        this.renderQuizSelector();
        this.renderEditorQuizList();
        this.closeImportModal();

        const qCount = importedList.reduce((acc, cur) => acc + (cur.questions?.length || 0), 0);
        if (window.app) {
          window.app.showNotification('成功', `已順利匯入 ${importedList.length} 部影片測驗（共 ${qCount} 道題目）！`);
        }
      } catch (err) {
        console.error('Import failed', err);
        alert('匯入失敗：' + err.message);
      }
    }

    // 解析 JSON
    parseQuizzesFromJSON(jsonText) {
      const parsed = JSON.parse(jsonText);
      const rawList = Array.isArray(parsed) ? parsed : [parsed];
      const validQuizzes = [];

      rawList.forEach((item, idx) => {
        if (!item.title || !item.videoUrl) return;
        const qId = item.id || 'vq_' + Date.now() + '_' + idx;
        const ytId = this.extractYoutubeId(item.videoUrl);
        const videoType = ytId ? 'youtube' : 'html5';

        const questions = (item.questions || []).map((q, qIdx) => {
          const time = typeof q.time === 'number' ? q.time : this.parseTime(q.time || q.timeFormatted);
          const type = (q.type === 'multiple' || q.type === '複選') ? 'multiple' : ((q.type === 'text' || q.type === '問答') ? 'text' : 'single');
          let options = Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? q.options.split(';').map(s => s.trim()).filter(Boolean) : []);
          let correctAnswer = q.correctAnswer;
          if (type === 'multiple' && typeof correctAnswer === 'string') {
            correctAnswer = correctAnswer.split(';').map(s => s.trim()).filter(Boolean);
          }
          return {
            id: q.id || 'q_' + qIdx + '_' + Date.now(),
            time,
            timeFormatted: q.timeFormatted || this.formatSeconds(time),
            type,
            prompt: q.prompt || q.question || '',
            options,
            correctAnswer,
            explanation: q.explanation || '',
            points: parseInt(q.points, 10) || 10
          };
        }).filter(q => q.prompt);

        validQuizzes.push({
          id: qId,
          title: item.title,
          description: item.description || '',
          videoUrl: item.videoUrl,
          videoType,
          youtubeId: ytId,
          createdAt: item.createdAt || Date.now(),
          questions
        });
      });

      return validQuizzes;
    }

    // 解析 CSV
    parseQuizzesFromCSV(csvText) {
      const rows = this.parseCSVText(csvText);
      if (rows.length < 2) {
        throw new Error('CSV 格式錯誤：請至少提供表頭與一行題目資料！');
      }

      // 跳過表頭，對資料列依「測驗標題」進行分組
      const dataRows = rows.slice(1);
      const groups = {};

      dataRows.forEach(cols => {
        if (!cols || cols.length < 4) return;
        const title = (cols[0] || '').trim();
        const desc = (cols[1] || '').trim();
        const url = (cols[2] || '').trim();
        const timeStr = (cols[3] || '').trim();
        const typeStr = (cols[4] || '單選').trim();
        const prompt = (cols[5] || '').trim();
        const optionsStr = (cols[6] || '').trim();
        const ansStr = (cols[7] || '').trim();
        const explanation = (cols[8] || '').trim();
        const points = parseInt(cols[9], 10) || 10;

        if (!title || !url || !prompt) return;

        const groupKey = title + '||' + url;
        if (!groups[groupKey]) {
          groups[groupKey] = {
            title,
            description: desc,
            videoUrl: url,
            questions: []
          };
        }

        const time = this.parseTime(timeStr);
        const type = (typeStr.includes('複選') || typeStr === 'multiple') ? 'multiple' : ((typeStr.includes('問答') || typeStr === 'text') ? 'text' : 'single');
        const options = type !== 'text' ? optionsStr.split(/[\;\；\n]/).map(s => s.trim()).filter(Boolean) : [];
        let correctAnswer = ansStr;
        if (type === 'multiple') {
          correctAnswer = ansStr.split(/[\;\；\n]/).map(s => s.trim()).filter(Boolean);
        }

        groups[groupKey].questions.push({
          id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          time,
          timeFormatted: this.formatSeconds(time),
          type,
          prompt,
          options,
          correctAnswer,
          explanation,
          points
        });
      });

      const list = Object.values(groups).map((g, idx) => {
        const ytId = this.extractYoutubeId(g.videoUrl);
        return {
          id: 'vq_' + Date.now() + '_' + idx,
          title: g.title,
          description: g.description,
          videoUrl: g.videoUrl,
          videoType: ytId ? 'youtube' : 'html5',
          youtubeId: ytId,
          createdAt: Date.now(),
          questions: g.questions.sort((a, b) => a.time - b.time)
        };
      });

      return list;
    }

    // CSV 解析工具，相容雙引號與逗號包含
    parseCSVText(text) {
      const clean = text.replace(/^\uFEFF/, '');
      const lines = [];
      let row = [];
      let inQuotes = false;
      let cur = '';

      for (let i = 0; i < clean.length; i++) {
        const c = clean[i];
        const next = clean[i + 1];

        if (c === '"') {
          if (inQuotes && next === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          row.push(cur);
          cur = '';
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
          if (c === '\r' && next === '\n') i++;
          row.push(cur);
          if (row.some(field => field.trim().length > 0)) {
            lines.push(row);
          }
          row = [];
          cur = '';
        } else {
          cur += c;
        }
      }
      if (cur.length > 0 || row.length > 0) {
        row.push(cur);
        if (row.some(field => field.trim().length > 0)) {
          lines.push(row);
        }
      }
      return lines;
    }

    // 時間字串轉秒數 (支援 "01:25" 或 "85")
    parseTime(str) {
      if (typeof str === 'number') return Math.max(0, Math.round(str));
      if (!str) return 0;
      str = String(str).trim();
      if (/^\d+$/.test(str)) return parseInt(str, 10);
      const parts = str.split(':').map(p => parseInt(p, 10) || 0);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      return 0;
    }

    // 秒數轉時間格式字串 (如 "01:25")
    formatSeconds(seconds) {
      const s = Math.max(0, Math.round(seconds || 0));
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // 開啟範例格式說明彈窗
    openFormatGuideModal() {
      const modal = document.getElementById('vqFormatGuideModal');
      if (modal) {
        this.switchFormatGuideTab('json');
        modal.style.display = 'flex';
      }
    }

    closeFormatGuideModal() {
      const modal = document.getElementById('vqFormatGuideModal');
      if (modal) modal.style.display = 'none';
    }

    switchFormatGuideTab(tabType) {
      const jsonTab = document.getElementById('vqFormatTabJson');
      const csvTab = document.getElementById('vqFormatTabCsv');
      const jsonContent = document.getElementById('vqFormatContentJson');
      const csvContent = document.getElementById('vqFormatContentCsv');

      if (jsonTab) jsonTab.classList.toggle('active', tabType === 'json');
      if (csvTab) csvTab.classList.toggle('active', tabType === 'csv');
      if (jsonContent) jsonContent.style.display = (tabType === 'json' ? 'block' : 'none');
      if (csvContent) csvContent.style.display = (tabType === 'csv' ? 'block' : 'none');
    }

    copyFormatCode(elemId) {
      const el = document.getElementById(elemId);
      if (!el) return;
      const text = el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        if (window.app) window.app.showNotification('成功', '範例格式代碼已複製至剪貼簿！');
      }).catch(() => {
        if (window.app) window.app.showNotification('提示', '請手動選取代碼進行複製。');
      });
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
