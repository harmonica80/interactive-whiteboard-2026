// 主程式
class App {
  constructor() {
    this.quiz = null;
    this.imageRef = db.ref('images');
    this.currentZoom = 1;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.imagePos = { x: 0, y: 0 };
    
    // 初始化狀態快取
    this.questions = [];
    this.images = [];
    this.currentQuiz = null;
    this.quizAnswers = {};
    this.isAdmin = false;
    
    // 計時器狀態
    this.timerRef = db.ref('quiz/timer');
    this.localTimerStyle = 'flip';
    this.isTimerMinimized = false;
    this.timerInterval = null;
    this.timerState = null;
    this.lastRenderedDigits = { minTens: '', minOnes: '', secTens: '', secOnes: '' };
    
    this.init();
  }
  
  init() {
    this.quiz = new Quiz();
    window.quiz = this.quiz;
    
    this.bindCollapseEvents();
    this.bindQuestionEvents();
    this.bindImageUpload();
    this.setupRealtimeSync();
    this.setupConnectionStatus();
    this.initModals();
    this.initImageZoom();
    this.initThemeSwitcher();
    this.initFunctionMenu();
    this.setupTimerSync();
    this.initTimerDragging();
  }
  
  initFunctionMenu() {
    const tabs = document.querySelectorAll('.menu-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetId = tab.dataset.target;
        
        // 攔截管理員後台分頁
        if (targetId === 'panel-admin' && !this.isAdmin) {
          e.preventDefault();
          this.openAdminPasswordModal();
          return;
        }
        
        this.switchToTab(targetId);
      });
    });
  }
  
  switchToTab(targetId) {
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.main-content .panel-card');
    
    tabs.forEach(tab => {
      if (tab.dataset.target === targetId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  openAdminPasswordModal() {
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminPasswordModal').classList.add('active');
    setTimeout(() => document.getElementById('adminPasswordInput').focus(), 300);
  }
  
  closeAdminPasswordModal() {
    document.getElementById('adminPasswordModal').classList.remove('active');
  }

  showConfirmModal(icon, title, subtitle, onConfirm) {
    document.getElementById('confirmModalIcon').textContent = icon;
    document.getElementById('confirmModalText').textContent = title;
    document.getElementById('confirmModalSubtext').textContent = subtitle;
    
    const confirmBtn = document.getElementById('confirmModalBtn');
    
    // 複製按鈕以清除之前的事件監聽器，避免重疊執行
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
      onConfirm();
      this.closeConfirmModal();
    });
    
    document.getElementById('customConfirmModal').classList.add('active');
  }

  closeConfirmModal() {
    document.getElementById('customConfirmModal').classList.remove('active');
  }
  
  setupRealtimeSync() {
    // 監聽問題資料庫
    db.ref('questions').on('value', (snapshot) => {
      const questions = [];
      snapshot.forEach(child => {
        questions.push({ id: child.key, ...child.val() });
      });
      questions.sort((a, b) => b.timestamp - a.timestamp);
      this.questions = questions;
      this.renderQuestions();
      this.renderAdminQuestions();
    });

    // 監聽圖片資料庫
    this.imageRef.on('value', (snapshot) => {
      const images = [];
      snapshot.forEach(child => {
        images.push({ id: child.key, ...child.val() });
      });
      images.sort((a, b) => b.timestamp - a.timestamp);
      this.images = images;
      this.renderImages();
      this.renderAdminImages();
    });

    // 監聽測驗狀態
    db.ref('quiz/current').on('value', (snapshot) => {
      this.currentQuiz = snapshot.val();
    });

    db.ref('quiz/answers').on('value', (snapshot) => {
      this.quizAnswers = snapshot.val() || {};
    });
  }
  
  initModals() {
    const questionModal = document.getElementById('questionModal');
    const questionModalClose = document.getElementById('questionModalClose');
    
    questionModalClose.addEventListener('click', () => questionModal.classList.remove('active'));
    questionModal.addEventListener('click', (e) => {
      if (e.target === questionModal) questionModal.classList.remove('active');
    });
    
    const imageModal = document.getElementById('imageModal');
    const imageModalClose = document.getElementById('imageModalClose');
    
    imageModalClose.addEventListener('click', () => imageModal.classList.remove('active'));
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) imageModal.classList.remove('active');
    });
    
    const customConfirmModal = document.getElementById('customConfirmModal');
    customConfirmModal.addEventListener('click', (e) => {
      if (e.target === customConfirmModal) this.closeConfirmModal();
    });
    
    const notifyModal = document.getElementById('notifyModal');
    const notifyModalClose = document.getElementById('notifyModalClose');
    
    notifyModalClose.addEventListener('click', () => notifyModal.classList.remove('active'));
    notifyModal.addEventListener('click', (e) => {
      if (e.target === notifyModal) notifyModal.classList.remove('active');
    });
    
    const adminPasswordModal = document.getElementById('adminPasswordModal');
    adminPasswordModal.addEventListener('click', (e) => {
      if (e.target === adminPasswordModal) this.closeAdminPasswordModal();
    });
    
    document.getElementById('adminPasswordInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitAdminPassword();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        questionModal.classList.remove('active');
        imageModal.classList.remove('active');
        customConfirmModal.classList.remove('active');
        notifyModal.classList.remove('active');
        adminPasswordModal.classList.remove('active');
      }
    });
  }
  
  showNotification(title, message) {
    const notifyModal = document.getElementById('notifyModal');
    document.getElementById('notifyModalTitle').textContent = title;
    document.getElementById('notifyModalText').textContent = message;
    notifyModal.classList.add('active');
    if (this.notifyTimer) clearTimeout(this.notifyTimer);
    this.notifyTimer = setTimeout(() => {
      notifyModal.classList.remove('active');
    }, 2000);
  }
  
  initImageZoom() {
    const zoomContainer = document.getElementById('imageZoomContainer');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    
    zoomContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.currentZoom = Math.max(0.5, Math.min(5, this.currentZoom + delta));
      this.updateImageTransform();
    });
    
    let initialDistance = 0;
    let initialZoom = 1;
    
    zoomContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = this.getDistance(e.touches[0], e.touches[1]);
        initialZoom = this.currentZoom;
      }
    });
    
    zoomContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = this.getDistance(e.touches[0], e.touches[1]);
        this.currentZoom = Math.max(0.5, Math.min(5, initialZoom * (distance / initialDistance)));
        this.updateImageTransform();
      }
    });
    
    zoomContainer.addEventListener('mousedown', (e) => {
      if (this.currentZoom > 1) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX - this.imagePos.x, y: e.clientY - this.imagePos.y };
        zoomContainer.style.cursor = 'grabbing';
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.imagePos.x = e.clientX - this.dragStart.x;
        this.imagePos.y = e.clientY - this.dragStart.y;
        this.updateImageTransform();
      }
    });
    
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      zoomContainer.style.cursor = 'grab';
    });
    
    let touchStartPos = { x: 0, y: 0 };
    
    zoomContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && this.currentZoom > 1) {
        touchStartPos = { x: e.touches[0].clientX - this.imagePos.x, y: e.touches[0].clientY - this.imagePos.y };
      }
    });
    
    zoomContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.currentZoom > 1) {
        this.imagePos.x = e.touches[0].clientX - touchStartPos.x;
        this.imagePos.y = e.touches[0].clientY - touchStartPos.y;
        this.updateImageTransform();
      }
    });
    
    zoomInBtn.addEventListener('click', () => {
      this.currentZoom = Math.min(5, this.currentZoom + 0.3);
      this.updateImageTransform();
    });
    
    zoomOutBtn.addEventListener('click', () => {
      this.currentZoom = Math.max(0.5, this.currentZoom - 0.3);
      this.updateImageTransform();
    });
    
    zoomResetBtn.addEventListener('click', () => {
      this.currentZoom = 1;
      this.imagePos = { x: 0, y: 0 };
      this.updateImageTransform();
    });
  }
  
  getDistance(t1, t2) {
    return Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2));
  }
  
  updateImageTransform() {
    const modalImage = document.getElementById('modalImage');
    const zoomInfo = document.getElementById('zoomInfo');
    modalImage.style.transform = `translate(${this.imagePos.x}px, ${this.imagePos.y}px) scale(${this.currentZoom})`;
    zoomInfo.textContent = `${Math.round(this.currentZoom * 100)}%`;
  }
  
  showQuestionModal(user, text) {
    const questionModal = document.getElementById('questionModal');
    document.getElementById('questionModalUser').textContent = user;
    document.getElementById('questionModalText').innerHTML = this.linkify(text);
    questionModal.classList.add('active');
  }
  
  showImageModal(url, user, filename) {
    const imageModal = document.getElementById('imageModal');
    document.getElementById('modalImage').src = url;
    document.getElementById('modalImageUser').textContent = '上傳者: ' + user;
    document.getElementById('modalImageFilename').textContent = filename;
    document.getElementById('modalDownloadBtn').href = url;
    document.getElementById('modalDownloadBtn').download = filename;
    
    this.currentZoom = 1;
    this.imagePos = { x: 0, y: 0 };
    document.getElementById('modalImage').style.transform = 'scale(1)';
    document.getElementById('zoomInfo').textContent = '100%';
    
    imageModal.classList.add('active');
  }
  
  bindCollapseEvents() {
    document.querySelectorAll('.panel-header').forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.panel-card').classList.toggle('collapsed');
      });
    });
  }
  
  bindQuestionEvents() {
    this.questionInput = document.getElementById('questionInput');
    this.askBtn = document.getElementById('askBtn');
    this.questionList = document.getElementById('questionList');
    this.questionsRef = db.ref('questions');
    
    const submitQuestion = () => {
      const text = this.questionInput.value.trim();
      if (!text) {
        this.showNotification('提示', '請輸入問題');
        return;
      }
      
      this.askBtn.disabled = true;
      this.askBtn.textContent = '提交中...';
      
      this.questionsRef.push({ 
        text: text, 
        user: '匿名', 
        timestamp: Date.now() 
      }).then(() => {
        this.questionInput.value = '';
        this.questionInput.focus();
        this.askBtn.disabled = false;
        this.askBtn.textContent = '提問';
        this.showNotification('成功', '問題已提交！');
      }).catch((error) => {
        console.error('提問失敗:', error);
        this.askBtn.disabled = false;
        this.askBtn.textContent = '提問';
        this.showNotification('錯誤', '提問失敗，請稍後再試');
      });
    };
    
    this.askBtn.addEventListener('click', submitQuestion);
    this.questionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitQuestion();
    });
  }
  
  renderQuestions() {
    const questionList = document.getElementById('questionList');
    if (!questionList) return;

    if (this.questions.length === 0) {
      questionList.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 20px;">暫無問題</li>';
      return;
    }
    
    const total = this.questions.length;
    questionList.innerHTML = this.questions.map((q, index) => `
      <li class="question-item card-style" data-user="${this.escapeHtml(q.user)}" data-text="${this.escapeHtml(q.text)}">
        <div class="question-card-header">
          <div class="header-left">
            <span class="question-badge">#${total - index}</span>
            <span class="user">${this.escapeHtml(q.user)}</span>
          </div>
          <span class="time">${this.formatTime(q.timestamp)}</span>
        </div>
        <div class="text">${this.linkify(q.text)}</div>
      </li>
    `).join('');
    
    questionList.querySelectorAll('.question-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          return;
        }
        this.showQuestionModal(item.dataset.user, item.dataset.text);
      });
    });
  }
  
  bindImageUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const imageInput = document.getElementById('imageInput');
    
    // 點擊上傳
    uploadZone.addEventListener('click', (e) => {
      e.stopPropagation();
      imageInput.click();
    });
    
    // 拖曳上傳
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleImageUpload(e.dataTransfer.files[0]);
      }
    });
    
    // 選擇檔案
    imageInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleImageUpload(e.target.files[0]);
        imageInput.value = '';
      }
    });
    
    // 剪貼簿貼上圖片 - 在上傳區域貼上
    const handlePaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (let item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            this.handleImageUpload(file);
          }
          break;
        }
      }
    };
    
    uploadZone.addEventListener('paste', handlePaste);
    
    // 全域貼上支援（當焦點不在輸入框時）
    document.addEventListener('paste', (e) => {
      // 如果焦點在輸入框，不處理
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        return;
      }
      handlePaste(e);
    });
  }
  
  handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      this.showNotification('提示', '請上傳圖片檔案（JPG、PNG、GIF 等）');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      this.showNotification('提示', '圖片大小不能超過 5MB');
      return;
    }
    
    this.showNotification('提示', '圖片上傳中...');
    
    const compressAndUpload = () => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const MAX = 1000; // 限制最大寬高為 1000px 以便看清圖片中的文字
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
            // 壓縮成 JPEG，品質設為 0.8，既能看清文字又能保持體積在合理範圍（約 80KB - 150KB）
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = () => reject(new Error('讀取圖片失敗'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('讀取檔案失敗'));
        reader.readAsDataURL(file);
      }).then(dataUrl => {
        return this.imageRef.push({
          url: dataUrl,
          user: '匿名',
          filename: file.name,
          timestamp: Date.now()
        });
      });
    };

    const tryStorageUpload = () => {
      return new Promise((resolve, reject) => {
        if (typeof storage === 'undefined' || !storage) {
          return reject(new Error('Storage not initialized'));
        }
        const fileRef = storage.ref().child('images/' + Date.now() + '_' + file.name);
        fileRef.put(file).then((snapshot) => {
          return snapshot.ref.getDownloadURL();
        }).then((downloadURL) => {
          return this.imageRef.push({ 
            url: downloadURL, 
            user: '匿名', 
            filename: file.name, 
            timestamp: Date.now() 
          });
        }).then(resolve).catch(reject);
      });
    };

    tryStorageUpload()
      .then(() => {
        this.showNotification('成功', '圖片上傳成功！');
      })
      .catch((error) => {
        console.warn('Firebase Storage 上傳失敗，啟用本地壓縮備用方案:', error);
        this.showNotification('提示', '正在進行圖片輕量化壓縮並寫入資料庫...');
        compressAndUpload()
          .then(() => {
            this.showNotification('成功', '圖片上傳成功！');
          })
          .catch((err) => {
            console.error('備用圖片上傳失敗:', err);
            this.showNotification('錯誤', '圖片上傳失敗，請稍後再試');
          });
      });
  }
  
  renderImages() {
    const imagePreview = document.getElementById('imagePreview');
    if (!imagePreview) return;
    
    imagePreview.innerHTML = this.images.map(img => `
      <div class="preview-item" data-url="${img.url}" data-user="${this.escapeHtml(img.user)}" data-filename="${this.escapeHtml(img.filename)}">
        <img src="${img.url}" alt="${img.filename}">
      </div>
    `).join('');
    
    imagePreview.querySelectorAll('.preview-item').forEach(item => {
      item.addEventListener('click', () => {
        this.showImageModal(item.dataset.url, item.dataset.user, item.dataset.filename);
      });
    });
  }
  
  renderAdminQuestions() {
    const adminQuestionList = document.getElementById('adminQuestionList');
    if (!adminQuestionList) return;

    if (this.questions.length === 0) {
      adminQuestionList.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 20px;">暫無問題</li>';
      return;
    }
    
    const total = this.questions.length;
    adminQuestionList.innerHTML = this.questions.map((q, index) => `
      <li class="question-item card-style admin-card" style="border-left-color: var(--danger-color); cursor: default;">
        <div style="flex: 1; min-width: 0;">
          <div class="question-card-header">
            <div class="header-left">
              <span class="question-badge admin-badge">#${total - index}</span>
              <span class="user" style="color: var(--danger-color);">${this.escapeHtml(q.user)}</span>
            </div>
            <span class="time">${this.formatTime(q.timestamp)}</span>
          </div>
          <div class="text">${this.linkify(q.text)}</div>
        </div>
        <button class="remove-option-btn" onclick="deleteQuestion('${q.id}')" title="刪除問題" style="width: 28px; height: 28px; font-size: 13px; margin-left: 12px; flex-shrink: 0;">✕</button>
      </li>
    `).join('');
  }

  renderAdminImages() {
    const adminImagePreview = document.getElementById('adminImagePreview');
    if (!adminImagePreview) return;
    
    if (this.images.length === 0) {
      adminImagePreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無圖片</div>';
      return;
    }

    adminImagePreview.innerHTML = this.images.map(img => `
      <div class="preview-item" style="position: relative;">
        <img src="${img.url}" alt="${img.filename}">
        <button onclick="deleteImage('${img.id}')" title="刪除圖片" style="
          position: absolute; top: -5px; right: -5px;
          width: 20px; height: 20px; border: none;
          background: var(--danger-color); color: white;
          border-radius: 50%; cursor: pointer;
          font-size: 10px; display: flex;
          align-items: center; justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">✕</button>
      </div>
    `).join('');
  }

  setupConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    const onlineEl = document.getElementById('onlineCount');
    
    const presenceRef = db.ref('quiz/presence');
    let myPresenceRef = null;

    db.ref('.info/connected').on('value', (snapshot) => {
      if (snapshot.val()) {
        statusEl.textContent = '已連線';
        statusEl.className = 'connection-status connected';
        
        // Clean up previous reference if it exists
        if (myPresenceRef) {
          myPresenceRef.remove();
        }
        
        // Register connection session
        myPresenceRef = presenceRef.push();
        myPresenceRef.set({
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        myPresenceRef.onDisconnect().remove();
      } else {
        statusEl.textContent = '斷線中...';
        statusEl.className = 'connection-status disconnected';
      }
    });

    // Listen for changes in the presence list and count active users
    presenceRef.on('value', (snapshot) => {
      let count = 0;
      if (snapshot.exists()) {
        count = snapshot.numChildren();
      }
      if (onlineEl) {
        onlineEl.textContent = `線上人數 ${count} 人`;
      }
    });
  }

  setupTimerSync() {
    const floatingTimer = document.getElementById('floatingTimer');
    const localStyleSelect = document.getElementById('localTimerStyle');
    
    this.timerRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.timerState = data;
      
      // Update admin UI buttons if user is admin
      if (this.isAdmin) {
        this.updateAdminTimerUI(data);
      }
      
      if (!data || !data.isActive) {
        // Hide timer
        if (floatingTimer) floatingTimer.style.display = 'none';
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        return;
      }
      
      // Show timer
      if (floatingTimer) {
        floatingTimer.style.display = 'block';
      }
      
      // Set timer style
      if (localStyleSelect && !localStyleSelect.dataset.userChanged) {
        localStyleSelect.value = data.style;
        this.changeLocalTimerStyle(data.style, false);
      }
      
      // Sync inputs in admin if not active focus
      const minsInput = document.getElementById('timerMinutes');
      const styleInput = document.getElementById('timerStyle');
      if (minsInput && document.activeElement !== minsInput) {
        minsInput.value = Math.round(data.duration / 60);
      }
      if (styleInput) {
        styleInput.value = data.style;
      }
      
      // Start/maintain ticking interval
      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => this.tickTimer(), 250);
      }
      this.tickTimer();
    });
  }

  updateAdminTimerUI(data) {
    const startBtn = document.getElementById('adminStartTimerBtn');
    const pauseBtn = document.getElementById('adminPauseTimerBtn');
    const resumeBtn = document.getElementById('adminResumeTimerBtn');
    
    if (!data || !data.isActive) {
      if (startBtn) startBtn.style.display = 'inline-block';
      if (pauseBtn) pauseBtn.style.display = 'none';
      if (resumeBtn) resumeBtn.style.display = 'none';
    } else if (data.isPaused) {
      if (startBtn) startBtn.style.display = 'none';
      if (pauseBtn) pauseBtn.style.display = 'none';
      if (resumeBtn) resumeBtn.style.display = 'inline-block';
    } else {
      if (startBtn) startBtn.style.display = 'none';
      if (pauseBtn) pauseBtn.style.display = 'inline-block';
      if (resumeBtn) resumeBtn.style.display = 'none';
    }
  }

  tickTimer() {
    if (!this.timerState || !this.timerState.isActive) return;
    
    let remaining = 0;
    if (this.timerState.isPaused) {
      remaining = this.timerState.remainingTime;
    } else {
      remaining = Math.max(0, Math.ceil((this.timerState.endTime - Date.now()) / 1000));
    }
    
    this.updateTimerDisplay(remaining);
  }

  updateTimerDisplay(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    const minStr = String(mins).padStart(2, '0');
    const secStr = String(secs).padStart(2, '0');
    const timeStr = `${minStr}:${secStr}`;
    
    // 1. Update Minimized Display
    const minimizedText = document.getElementById('minimizedTimeText');
    if (minimizedText) minimizedText.textContent = timeStr;
    
    // 2. Update style: Flip style
    if (this.localTimerStyle === 'flip') {
      this.updateFlipCard('flipMinTens', minStr[0]);
      this.updateFlipCard('flipMinOnes', minStr[1]);
      this.updateFlipCard('flipSecTens', secStr[0]);
      this.updateFlipCard('flipSecOnes', secStr[1]);
    }
    
    // 3. Update style: LED Digital style
    const ledDisplay = document.querySelector('.led-display');
    if (ledDisplay) ledDisplay.textContent = timeStr;
    
    // 4. Update style: SVG Ring style
    const ringText = document.getElementById('ringTimeText');
    if (ringText) ringText.textContent = timeStr;
    
    const ringProgress = document.getElementById('ringProgress');
    if (ringProgress && this.timerState) {
      const total = this.timerState.duration || 600;
      const pct = totalSeconds / total;
      const offset = 263.89 * (1 - pct);
      ringProgress.style.strokeDashoffset = offset;
    }
  }

  updateFlipCard(cardId, digit) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const digitEl = card.querySelector('.digit');
    if (!digitEl) return;
    
    if (digitEl.textContent !== digit) {
      card.classList.remove('flipping');
      void card.offsetWidth; // Trigger reflow
      digitEl.textContent = digit;
      card.classList.add('flipping');
    }
  }

  changeLocalTimerStyle(style, userInitiated = true) {
    this.localTimerStyle = style;
    
    if (userInitiated) {
      const localStyleSelect = document.getElementById('localTimerStyle');
      if (localStyleSelect) {
        localStyleSelect.dataset.userChanged = "true";
      }
    }
    
    const styles = ['flip', 'digital', 'ring'];
    styles.forEach(s => {
      const el = document.getElementById(`timerStyle${s.charAt(0).toUpperCase() + s.slice(1)}`);
      if (el) {
        if (s === style) {
          el.style.display = (s === 'flip') ? 'flex' : 'block';
        } else {
          el.style.display = 'none';
        }
      }
    });
    
    this.tickTimer();
  }

  toggleMinimizeTimer(minimize) {
    this.isTimerMinimized = minimize;
    
    const expanded = document.getElementById('timerExpandedContent');
    const minimized = document.getElementById('timerMinimizedContent');
    const floatingTimer = document.getElementById('floatingTimer');
    
    if (minimize) {
      if (expanded) expanded.style.display = 'none';
      if (minimized) minimized.style.display = 'flex';
      if (floatingTimer) {
        floatingTimer.style.background = 'none';
        floatingTimer.style.border = 'none';
        floatingTimer.style.boxShadow = 'none';
        floatingTimer.style.backdropFilter = 'none';
      }
    } else {
      if (expanded) expanded.style.display = 'block';
      if (minimized) minimized.style.display = 'none';
      if (floatingTimer) {
        floatingTimer.style.background = 'var(--bg-card)';
        floatingTimer.style.border = '1px solid var(--border-color)';
        floatingTimer.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
        floatingTimer.style.backdropFilter = 'blur(8px)';
      }
    }
  }

  initTimerDragging() {
    const timer = document.getElementById('floatingTimer');
    const handle = timer ? timer.querySelector('.timer-drag-handle') : null;
    if (!timer || !handle) return;
    
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0;
    
    const onStart = (e) => {
      if (this.isTimerMinimized) return;
      
      const clientX = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
      const clientY = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
      
      isDragging = true;
      startX = clientX;
      startY = clientY;
      
      const rect = timer.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      timer.style.bottom = 'auto';
      timer.style.right = 'auto';
      timer.style.left = `${initialX}px`;
      timer.style.top = `${initialY}px`;
      
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    };
    
    const onMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      
      const clientX = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
      const clientY = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      let newLeft = initialX + dx;
      let newTop = initialY + dy;
      
      const maxLeft = window.innerWidth - timer.offsetWidth;
      const maxTop = window.innerHeight - timer.offsetHeight;
      
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));
      
      timer.style.left = `${newLeft}px`;
      timer.style.top = `${newTop}px`;
    };
    
    const onEnd = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    
    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: true });
  }

  adminStartTimer() {
    const mins = parseInt(document.getElementById('timerMinutes').value) || 10;
    const style = document.getElementById('timerStyle').value || 'flip';
    const duration = mins * 60;
    
    this.timerRef.set({
      duration: duration,
      endTime: Date.now() + duration * 1000,
      isActive: true,
      isPaused: false,
      remainingTime: duration,
      style: style
    });
  }

  adminPauseTimer() {
    this.timerRef.once('value', (snapshot) => {
      const data = snapshot.val();
      if (!data || !data.isActive || data.isPaused) return;
      
      const remaining = Math.max(0, Math.ceil((data.endTime - Date.now()) / 1000));
      this.timerRef.update({
        isPaused: true,
        remainingTime: remaining
      });
    });
  }

  adminResumeTimer() {
    this.timerRef.once('value', (snapshot) => {
      const data = snapshot.val();
      if (!data || !data.isActive || !data.isPaused) return;
      
      this.timerRef.update({
        isPaused: false,
        endTime: Date.now() + data.remainingTime * 1000
      });
    });
  }

  adminResetTimer() {
    this.timerRef.update({
      isActive: false
    });
  }
  
  initThemeSwitcher() {
    const savedTheme = localStorage.getItem('whiteboard_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      if (btn.dataset.theme === savedTheme) btn.classList.add('active');
      else btn.classList.remove('active');
      
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('whiteboard_theme', theme);
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  linkify(text) {
    if (!text) return '';
    const escaped = this.escapeHtml(text);
    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
    
    return escaped.replace(urlRegex, (match) => {
      let cleanUrl = match;
      let trailing = '';
      
      const punc = ['.', ',', '!', '?', ';', ':', ')', ']', '}', '。', '，', '！', '？', '；', '：'];
      while (cleanUrl.length > 0 && punc.includes(cleanUrl[cleanUrl.length - 1])) {
        trailing = cleanUrl[cleanUrl.length - 1] + trailing;
        cleanUrl = cleanUrl.substring(0, cleanUrl.length - 1);
      }
      
      const href = cleanUrl.startsWith('www.') ? `https://${cleanUrl}` : cleanUrl;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="linkified">${cleanUrl}</a>${trailing}`;
    });
  }

  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return `${hours}:${minutes}`;
    } else {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}-${day} ${hours}:${minutes}`;
    }
  }
}

// 開始測驗
function startQuiz() {
  const question = document.getElementById('quizQuestion').value.trim();
  const optionFields = document.querySelectorAll('.option-field');
  const options = Array.from(optionFields).map(input => input.value.trim()).filter(v => v);
  
  if (!question) { window.app.showNotification('提示', '請填寫題目'); return; }
  if (options.length < 2) { window.app.showNotification('提示', '請填寫至少兩個選項'); return; }
  
  if (window.quiz) {
    window.quiz.startQuiz(question, options);
    document.getElementById('quizQuestion').value = '';
    optionFields.forEach(input => input.value = '');
  }
}

// 載入預設選項
function loadPreset(type) {
  const container = document.getElementById('optionsContainer');
  const presets = {
    yesno: ['是', '否'],
    truefalse: ['正確', '錯誤'],
    abcd: ['A', 'B', 'C', 'D'],
    '1234': ['1', '2', '3', '4']
  };
  
  const options = presets[type];
  container.innerHTML = options.map(opt => `
    <div class="option-input">
      <input type="text" class="option-field" value="${opt}" placeholder="選項">
      <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
    </div>
  `).join('');
}

// 新增選項
function addOption() {
  const container = document.getElementById('optionsContainer');
  const count = container.querySelectorAll('.option-input').length + 1;
  
  const div = document.createElement('div');
  div.className = 'option-input';
  div.innerHTML = `
    <input type="text" class="option-field" placeholder="選項 ${count}">
    <button class="remove-option-btn" onclick="removeOption(this)" title="移除">✕</button>
  `;
  container.appendChild(div);
}

// 移除選項
function removeOption(btn) {
  const container = document.getElementById('optionsContainer');
  if (container.querySelectorAll('.option-input').length > 2) {
    btn.parentElement.remove();
  } else {
    window.app.showNotification('提示', '至少需要兩個選項');
  }
}

// 結束測驗
function endQuiz() {
  if (window.quiz) window.quiz.endQuiz();
}

// 重設功能
function confirmReset() {
  window.app.showConfirmModal(
    '🔄',
    '確定要重設嗎？',
    '這將清除所有提問、測驗及圖片資料。',
    () => {
      resetAll();
    }
  );
}

function closeCustomConfirmModal() {
  window.app.closeConfirmModal();
}

function closeNotifyModal() {
  document.getElementById('notifyModal').classList.remove('active');
}

function resetAll() {
  db.ref('questions').remove();
  db.ref('quiz/current').remove();
  db.ref('quiz/answers').remove();
  db.ref('images').remove();
  db.ref('whiteboard').remove();
  location.reload();
}

// 啟動應用程式
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// 管理員密碼驗證
function closeAdminPasswordModal() {
  window.app.closeAdminPasswordModal();
}

function submitAdminPassword() {
  const pwd = document.getElementById('adminPasswordInput').value;
  if (pwd === '1234') {
    window.app.isAdmin = true;
    window.app.closeAdminPasswordModal();
    window.app.switchToTab('panel-admin');
    window.app.showNotification('成功', '已進入管理員模式！');
  } else {
    window.app.showNotification('錯誤', '密碼不正確！');
  }
}

function logoutAdmin() {
  window.app.isAdmin = false;
  window.app.switchToTab('panel-questions');
  window.app.showNotification('提示', '已登出管理員模式');
}

// 管理員資料刪除操作
function deleteQuestion(id) {
  window.app.showConfirmModal(
    '🗑️',
    '確定要刪除此問題嗎？',
    '此動作將永久刪除該提問，且無法復原。',
    () => {
      db.ref('questions').child(id).remove()
        .then(() => window.app.showNotification('成功', '已刪除問題！'))
        .catch(err => window.app.showNotification('錯誤', '刪除失敗: ' + err.message));
    }
  );
}

// 管理員刪除圖片操作
function deleteImage(id) {
  window.app.showConfirmModal(
    '🖼️',
    '確定要刪除此圖片嗎？',
    '此動作將永久刪除該圖片，且無法復原。',
    () => {
      db.ref('images').child(id).remove()
        .then(() => window.app.showNotification('成功', '已刪除圖片！'))
        .catch(err => window.app.showNotification('錯誤', '刪除失敗: ' + err.message));
    }
  );
}

// 教師專屬建置連結產生器
function generateLinks() {
  const dbUrl = document.getElementById('dbUrlInput').value.trim();
  if (!dbUrl) {
    window.app.showNotification('提示', '請先輸入或貼上您的 Firebase Database URL！');
    return;
  }
  
  if (!dbUrl.startsWith('https://')) {
    window.app.showNotification('提示', '格式不正確！URL 應該以 https:// 開頭。');
    return;
  }

  // 取得目前白板主頁面的網址路徑
  const currentUrl = window.location.href;
  const cleanUrl = currentUrl.split('?')[0].split('#')[0];

  // 產生專屬連結，加入 dbUrl 參數
  const finalShareUrl = `${cleanUrl}?dbUrl=${encodeURIComponent(dbUrl)}`;

  document.getElementById('shareUrl').value = finalShareUrl;
  document.getElementById('resultArea').style.display = 'block';
}

function copyText(elementId) {
  const copyText = document.getElementById(elementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999); // 適用行動端

  try {
    navigator.clipboard.writeText(copyText.value);
    window.app.showNotification('成功', '連結已成功複製！');
  } catch (err) {
    // 備用方案
    document.execCommand('copy');
    window.app.showNotification('成功', '連結已複製！');
  }
}

// 倒數計時全域呼叫介面
function adminStartTimer() {
  if (window.app) window.app.adminStartTimer();
}

function adminPauseTimer() {
  if (window.app) window.app.adminPauseTimer();
}

function adminResumeTimer() {
  if (window.app) window.app.adminResumeTimer();
}

function adminResetTimer() {
  if (window.app) window.app.adminResetTimer();
}
