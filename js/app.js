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
    
    // 計時器與音訊狀態
    this.timerRef = db.ref('quiz/timer');
    this.localTimerStyle = 'flip';
    this.isTimerMinimized = false;
    this.timerInterval = null;
    this.timerState = null;
    this.lastRenderedDigits = { minTens: '', minOnes: '', secTens: '', secOnes: '' };
    this.isFirstTimerSync = true;
    
    this.ytPlayersReady = false;
    this.timerMuted = localStorage.getItem('timer_muted') === 'true';
    this.currentAudioPlaying = 'none';
    this.playerCanon = null;
    this.playerBell = null;
    
    // 群組資料夾變數
    this.folders = [];
    this.expandedFolders = new Set();
    
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
    this.loadYoutubeAPI();
    this.initImageCanvasDrawing();
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

    // 監聽群組資料夾資料庫
    db.ref('quiz/folders').on('value', (snapshot) => {
      const folders = [];
      snapshot.forEach(child => {
        folders.push({ id: child.key, ...child.val() });
      });
      folders.sort((a, b) => a.name.localeCompare(b.name, 'zh-hant'));
      this.folders = folders;
      this.renderFoldersList();
      this.renderQuestions();
      this.renderImages();
      this.renderAdminQuestions();
      this.renderAdminImages();
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
    }, 1500);
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
      if (this.imageMode === 'draw') return;
      if (this.currentZoom > 1) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX - this.imagePos.x, y: e.clientY - this.imagePos.y };
        zoomContainer.style.cursor = 'grabbing';
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging && this.imageMode !== 'draw') {
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
      if (this.imageMode === 'draw') return;
      if (e.touches.length === 1 && this.currentZoom > 1) {
        touchStartPos = { x: e.touches[0].clientX - this.imagePos.x, y: e.touches[0].clientY - this.imagePos.y };
      }
    });
    
    zoomContainer.addEventListener('touchmove', (e) => {
      if (this.imageMode === 'draw') return;
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
    const wrapper = document.getElementById('imageCanvasWrapper');
    const zoomInfo = document.getElementById('zoomInfo');
    if (wrapper) {
      wrapper.style.transform = `translate(${this.imagePos.x}px, ${this.imagePos.y}px) scale(${this.currentZoom})`;
    }
    if (zoomInfo) {
      zoomInfo.textContent = `${Math.round(this.currentZoom * 100)}%`;
    }
  }

  initImageCanvasDrawing() {
    const canvas = document.getElementById('imageMarkupCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0, lastY = 0;
    
    this.imageBrushColor = '#ff3b30';
    this.imageBrushSize = 5;
    this.imageMode = 'pan';
    
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const clientX = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
      const clientY = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };
    
    const startDrawing = (e) => {
      if (this.imageMode !== 'draw') return;
      isDrawing = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
      
      ctx.beginPath();
      ctx.arc(lastX, lastY, this.imageBrushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = this.imageBrushColor;
      ctx.fill();
    };
    
    const draw = (e) => {
      if (!isDrawing || this.imageMode !== 'draw') return;
      if (e.cancelable) e.preventDefault();
      
      const pos = getPos(e);
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      
      ctx.strokeStyle = this.imageBrushColor;
      ctx.lineWidth = this.imageBrushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      lastX = pos.x;
      lastY = pos.y;
    };
    
    const stopDrawing = () => {
      isDrawing = false;
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
  }

  toggleImageMode() {
    const nextMode = (this.imageMode === 'draw') ? 'pan' : 'draw';
    this.setImageMode(nextMode);
  }

  setImageMode(mode) {
    this.imageMode = mode;
    const canvas = document.getElementById('imageMarkupCanvas');
    const drawBtn = document.getElementById('modeDrawBtn');
    const settingsPanel = document.getElementById('drawSettingsPanel');
    const zoomContainer = document.getElementById('imageZoomContainer');
    
    if (mode === 'draw') {
      if (canvas) canvas.style.pointerEvents = 'auto';
      if (drawBtn) drawBtn.classList.add('active');
      if (settingsPanel) settingsPanel.style.display = 'flex';
      if (zoomContainer) zoomContainer.style.cursor = 'crosshair';
    } else {
      if (canvas) canvas.style.pointerEvents = 'none';
      if (drawBtn) drawBtn.classList.remove('active');
      if (settingsPanel) settingsPanel.style.display = 'none';
      if (zoomContainer) zoomContainer.style.cursor = 'grab';
    }
  }

  setImageColor(color, btn) {
    this.imageBrushColor = color;
    document.querySelectorAll('#markupColorPicker .color-dot').forEach(d => {
      d.classList.remove('active');
    });
    btn.classList.add('active');
  }

  setImageBrushSize(size) {
    this.imageBrushSize = parseInt(size) || 5;
  }

  clearImageMarkup() {
    const canvas = document.getElementById('imageMarkupCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ===== 群組資料夾與心情回饋方法 =====
  adminCreateFolder() {
    const input = document.getElementById('newFolderName');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      this.showNotification('提示', '請輸入群組名稱');
      return;
    }
    db.ref('quiz/folders').push({ name: name }).then(() => {
      input.value = '';
      this.showNotification('成功', '群組資料夾已建立');
    });
  }

  adminDeleteFolder(folderId) {
    if (confirm('確定要刪除此群組資料夾嗎？\n（其中的提問與圖片不會被刪除，會移回無群組狀態）')) {
      db.ref(`quiz/folders/${folderId}`).remove().then(() => {
        this.questions.forEach(q => {
          if (q.folderId === folderId) {
            db.ref(`questions/${q.id}/folderId`).remove();
          }
        });
        this.images.forEach(img => {
          if (img.folderId === folderId) {
            db.ref(`images/${img.id}/folderId`).remove();
          }
        });
        this.showNotification('成功', '群組資料夾已刪除');
      });
    }
  }

  assignQuestionFolder(questionId, folderId) {
    if (!folderId) {
      db.ref(`questions/${questionId}/folderId`).remove();
    } else {
      db.ref(`questions/${questionId}/folderId`).set(folderId);
    }
  }

  assignImageFolder(imageId, folderId) {
    if (!folderId) {
      db.ref(`images/${imageId}/folderId`).remove();
    } else {
      db.ref(`images/${imageId}/folderId`).set(folderId);
    }
  }

  reactToQuestion(id, type) {
    db.ref(`questions/${id}/reactions/${type}`).transaction(count => {
      return (count || 0) + 1;
    });
  }

  reactToImage(id, type) {
    db.ref(`images/${id}/reactions/${type}`).transaction(count => {
      return (count || 0) + 1;
    });
  }

  toggleFolderCollapse(folderId) {
    if (this.expandedFolders.has(folderId)) {
      this.expandedFolders.delete(folderId);
    } else {
      this.expandedFolders.add(folderId);
    }
    this.renderQuestions();
    this.renderImages();
    this.renderAdminQuestions();
    this.renderAdminImages();
  }

  isFolderCollapsed(folderId) {
    return !this.expandedFolders.has(folderId);
  }

  renderFoldersList() {
    const list = document.getElementById('adminFolderList');
    if (!list) return;
    if (this.folders.length === 0) {
      list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 8px; font-size: 13px;">暫無群組</div>';
      return;
    }
    list.innerHTML = this.folders.map(f => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: rgba(0,0,0,0.03); border-radius: 6px; font-size: 13px; margin-bottom: 4px;">
        <span style="font-weight: bold; color: var(--text-primary);">📁 ${this.escapeHtml(f.name)}</span>
        <button class="preset-btn" onclick="window.app.adminDeleteFolder('${f.id}')" style="color: var(--danger-color); border-color: var(--danger-color); padding: 2px 6px; font-size: 11px; margin: 0; background: transparent; cursor: pointer;">刪除</button>
      </div>
    `).join('');
  }

  showQuestionModal(user, text) {
    const questionModal = document.getElementById('questionModal');
    document.getElementById('questionModalUser').textContent = user;
    document.getElementById('questionModalText').innerHTML = this.linkify(text);
    questionModal.classList.add('active');
  }
  
  showImageModal(url, user, filename) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const canvas = document.getElementById('imageMarkupCanvas');
    
    modalImage.src = url;
    document.getElementById('modalImageUser').textContent = '上傳者: ' + user;
    document.getElementById('modalImageFilename').textContent = filename;
    document.getElementById('modalDownloadBtn').href = url;
    document.getElementById('modalDownloadBtn').download = filename;
    
    this.currentZoom = 1;
    this.imagePos = { x: 0, y: 0 };
    
    const wrapper = document.getElementById('imageCanvasWrapper');
    if (wrapper) {
      wrapper.style.transform = 'translate(0px, 0px) scale(1)';
    }
    
    document.getElementById('zoomInfo').textContent = '100%';
    
    // Set default mode to pan
    this.setImageMode('pan');
    
    modalImage.onload = () => {
      if (canvas) {
        canvas.width = modalImage.naturalWidth;
        canvas.height = modalImage.naturalHeight;
        this.clearImageMarkup();
      }
    };
    
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
    
    const renderQuestionItemHtml = (q, idx) => `
      <li class="question-item card-style" data-user="${this.escapeHtml(q.user)}" data-text="${this.escapeHtml(q.text)}" style="cursor: pointer; margin-bottom: 8px;">
        <div class="question-card-header">
          <div class="header-left">
            <span class="question-badge">#${total - idx}</span>
            <span class="user">${this.escapeHtml(q.user)}</span>
          </div>
          <span class="time">${this.formatTime(q.timestamp)}</span>
        </div>
        <div class="text">${this.linkify(q.text)}</div>
        <div class="reactions-bar" onclick="event.stopPropagation()">
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'like')" title="讚">
            <span class="reaction-count">${q.reactions?.like || 0}</span>
            <span class="reaction-emoji">👍</span>
          </button>
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'love')" title="愛心">
            <span class="reaction-count">${q.reactions?.love || 0}</span>
            <span class="reaction-emoji">❤️</span>
          </button>
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'laugh')" title="大笑">
            <span class="reaction-count">${q.reactions?.laugh || 0}</span>
            <span class="reaction-emoji">😆</span>
          </button>
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'wow')" title="驚訝">
            <span class="reaction-count">${q.reactions?.wow || 0}</span>
            <span class="reaction-emoji">😮</span>
          </button>
        </div>
      </li>
    `;

    let html = '';
    
    // 1. Grouped Folders
    this.folders.forEach(f => {
      const folderQuestions = this.questions.filter(q => q.folderId === f.id);
      if (folderQuestions.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        html += `
          <li class="folder-card card-style">
            <div class="folder-card-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span style="font-weight: bold; font-size: 15px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderQuestions.length} 個提問)</span>
              </span>
              <button class="folder-toggle-btn">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <ul class="folder-content" style="display: ${isCollapsed ? 'none' : 'block'}; margin-top: 12px; list-style: none; padding-left: 0;">
              ${folderQuestions.map(q => {
                const idx = this.questions.indexOf(q);
                return renderQuestionItemHtml(q, idx);
              }).join('')}
            </ul>
          </li>
        `;
      }
    });
    
    // 2. Unassigned Questions
    const unassignedQuestions = this.questions.filter(q => {
      if (!q.folderId) return true;
      return !this.folders.some(f => f.id === q.folderId);
    });
    
    if (unassignedQuestions.length > 0) {
      html += unassignedQuestions.map(q => {
        const idx = this.questions.indexOf(q);
        return renderQuestionItemHtml(q, idx);
      }).join('');
    }
    
    questionList.innerHTML = html;
    
    questionList.querySelectorAll('.question-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('.reactions-bar')) {
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
    
    const renderImageItemHtml = (img) => `
      <div class="preview-item-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 12px; border: 1px solid var(--border-color);">
        <div class="preview-item" data-url="${img.url}" data-user="${this.escapeHtml(img.user)}" data-filename="${this.escapeHtml(img.filename)}" style="cursor: pointer; margin: 0;">
          <img src="${img.url}" alt="${img.filename}">
        </div>
        <div class="reactions-bar" style="margin-top: 0; justify-content: center; gap: 4px;">
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'like')" style="min-width: 32px; padding: 2px 6px;" title="讚">
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.like || 0}</span>
            <span class="reaction-emoji" style="font-size: 11px;">👍</span>
          </button>
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'love')" style="min-width: 32px; padding: 2px 6px;" title="愛心">
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.love || 0}</span>
            <span class="reaction-emoji" style="font-size: 11px;">❤️</span>
          </button>
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'laugh')" style="min-width: 32px; padding: 2px 6px;" title="大笑">
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.laugh || 0}</span>
            <span class="reaction-emoji" style="font-size: 11px;">😆</span>
          </button>
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'wow')" style="min-width: 32px; padding: 2px 6px;" title="驚訝">
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.wow || 0}</span>
            <span class="reaction-emoji" style="font-size: 11px;">😮</span>
          </button>
        </div>
      </div>
    `;

    let html = '';
    
    // 1. Grouped Folders
    this.folders.forEach(f => {
      const folderImages = this.images.filter(img => img.folderId === f.id);
      if (folderImages.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        html += `
          <div class="folder-image-card">
            <div class="folder-card-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span style="font-weight: bold; font-size: 14px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderImages.length} 張圖片)</span>
              </span>
              <button class="folder-toggle-btn">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <div class="image-preview" style="display: ${isCollapsed ? 'none' : 'flex'}; margin-top: 12px; gap: 12px; flex-wrap: wrap;">
              ${folderImages.map(img => renderImageItemHtml(img)).join('')}
            </div>
          </div>
        `;
      }
    });
    
    // 2. Unassigned Images
    const unassignedImages = this.images.filter(img => {
      if (!img.folderId) return true;
      return !this.folders.some(f => f.id === img.folderId);
    });
    
    if (unassignedImages.length > 0) {
      html += `
        <div class="image-preview" style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${unassignedImages.map(img => renderImageItemHtml(img)).join('')}
        </div>
      `;
    }
    
    if (html === '') {
      imagePreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無圖片</div>';
      return;
    }
    
    imagePreview.innerHTML = html;
    
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
      <li class="question-item card-style admin-card" style="border-left-color: var(--danger-color); cursor: default; flex-direction: column; align-items: stretch; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
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
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: 12px;">
            <select class="folder-select" onchange="assignQuestionFolder('${q.id}', this.value)">
              <option value="">📁 無群組</option>
              ${this.folders.map(f => `<option value="${f.id}" ${q.folderId === f.id ? 'selected' : ''}>${this.escapeHtml(f.name)}</option>`).join('')}
            </select>
            <button class="remove-option-btn" onclick="deleteQuestion('${q.id}')" title="刪除問題" style="width: 28px; height: 28px; font-size: 13px;">✕</button>
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; align-items: center; background: rgba(0,0,0,0.02); padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 12px; width: 100%;">
          <span style="font-weight: bold; color: var(--text-secondary);">回饋統計:</span>
          <span>👍 ${q.reactions?.like || 0}</span>
          <span>❤️ ${q.reactions?.love || 0}</span>
          <span>😆 ${q.reactions?.laugh || 0}</span>
          <span>😮 ${q.reactions?.wow || 0}</span>
        </div>
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
      <div class="preview-item-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px; background: var(--bg-card); padding: 8px; border-radius: 12px; border: 1px solid var(--border-color); position: relative;">
        <div class="preview-item" style="position: relative; margin: 0;">
          <img src="${img.url}" alt="${img.filename}">
          <button onclick="deleteImage('${img.id}')" title="刪除圖片" style="
            position: absolute; top: -6px; right: -6px;
            width: 24px; height: 24px; border: none;
            background: var(--danger-color); color: white;
            border-radius: 50%; cursor: pointer;
            font-size: 12px; display: flex;
            align-items: center; justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 5;
          ">✕</button>
        </div>
        
        <select class="folder-select" onchange="assignImageFolder('${img.id}', this.value)" style="width: 100%; font-size: 11px; padding: 2px 4px;">
          <option value="">📁 無群組</option>
          ${this.folders.map(f => `<option value="${f.id}" ${img.folderId === f.id ? 'selected' : ''}>${this.escapeHtml(f.name)}</option>`).join('')}
        </select>
        
        <div style="font-size: 10px; color: var(--text-secondary); display: flex; gap: 6px; justify-content: center; width: 100%;">
          <span>👍 ${img.reactions?.like || 0}</span>
          <span>❤️ ${img.reactions?.love || 0}</span>
          <span>😆 ${img.reactions?.laugh || 0}</span>
          <span>😮 ${img.reactions?.wow || 0}</span>
        </div>
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
    this.timerRef.on('value', (snapshot) => {
      try {
        const data = snapshot.val();
        
        const wasActive = this.timerState ? this.timerState.isActive : false;
        this.timerState = data;
        
        const isInitialLoad = this.isFirstTimerSync;
        this.isFirstTimerSync = false;
        
        const floatingTimer = document.getElementById('floatingTimer');
        const localStyleSelect = document.getElementById('localTimerStyle');
        const volBtn = document.getElementById('timerVolumeBtn');
        
        // Show volume toggle only for admin
        if (volBtn) {
          volBtn.style.display = this.isAdmin ? 'inline-block' : 'none';
        }
        
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
          // Stop music
          this.playAudio('none');
          return;
        }
        
        // Show timer
        if (floatingTimer) {
          floatingTimer.style.display = 'block';
        }
        
        // Handle centering vs corner display based on initial load vs dynamic start
        if (isInitialLoad) {
          // Page load: minimize by default to avoid blocking student screen
          this.toggleMinimizeTimer(true);
        } else if (!wasActive) {
          // Dynamic start by admin: show expanded in center
          this.toggleMinimizeTimer(false);
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
          minsInput.value = Math.round((data.duration || 600) / 60);
        }
        if (styleInput) {
          styleInput.value = data.style;
        }
        
        // Start/maintain ticking interval
        if (!this.timerInterval) {
          this.timerInterval = setInterval(() => this.tickTimer(), 250);
        }
        this.tickTimer();
      } catch (err) {
        console.error("Timer sync error:", err);
      }
    }, (error) => {
      console.error("Timer database sync error:", error);
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
    
    let remMs = 0;
    if (this.timerState.isPaused) {
      remMs = this.timerState.remainingTime * 1000;
    } else {
      remMs = Math.max(0, this.timerState.endTime - Date.now());
    }
    
    const remainingSeconds = Math.ceil(remMs / 1000);
    this.updateTimerDisplay(remainingSeconds);

    // 音樂播放與淡出邏輯 (僅在教師端/管理者端執行)
    if (this.isAdmin) {
      if (this.timerState.isPaused) {
        this.playAudio('none');
      } else if (remainingSeconds > 0) {
        // 播放卡農
        if (this.currentAudioPlaying !== 'canon') {
          this.playAudio('canon');
        }
        
        // 最後 10 秒音樂淡出
        if (remMs <= 10000) {
          const vol = Math.max(0, Math.min(100, Math.floor((remMs / 10000) * 100)));
          if (this.ytPlayersReady && this.playerCanon && typeof this.playerCanon.setVolume === 'function') {
            this.playerCanon.setVolume(vol);
          }
        } else {
          // 正常音量 (100)
          if (this.ytPlayersReady && this.playerCanon && typeof this.playerCanon.setVolume === 'function') {
            this.playerCanon.setVolume(100);
          }
        }
      } else {
        // 時間到，停止播放
        if (this.currentAudioPlaying !== 'none') {
          this.playAudio('none');
        }
      }
    } else {
      // 學生端強制停止播放音樂
      if (this.currentAudioPlaying !== 'none') {
        this.playAudio('none');
      }
    }
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
      const offset = 251.32 * (1 - pct);
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
        // Save expanded position details before minimizing
        this.expandedPosition = {
          left: floatingTimer.style.left,
          top: floatingTimer.style.top,
          transform: floatingTimer.style.transform
        };
        
        floatingTimer.style.background = 'none';
        floatingTimer.style.border = 'none';
        floatingTimer.style.boxShadow = 'none';
        floatingTimer.style.backdropFilter = 'none';
        floatingTimer.style.top = 'auto';
        floatingTimer.style.left = 'auto';
        floatingTimer.style.bottom = '24px';
        floatingTimer.style.right = '24px';
        floatingTimer.style.transform = 'none';
      }
    } else {
      if (expanded) expanded.style.display = 'block';
      if (minimized) minimized.style.display = 'none';
      if (floatingTimer) {
        floatingTimer.style.background = 'var(--bg-card)';
        floatingTimer.style.border = '1px solid var(--border-color)';
        floatingTimer.style.boxShadow = '0 15px 50px rgba(0,0,0,0.2)';
        floatingTimer.style.backdropFilter = 'blur(12px)';
        
        // Restore expanded position or center
        if (this.expandedPosition && this.expandedPosition.left) {
          floatingTimer.style.top = this.expandedPosition.top;
          floatingTimer.style.left = this.expandedPosition.left;
          floatingTimer.style.bottom = 'auto';
          floatingTimer.style.right = 'auto';
          floatingTimer.style.transform = this.expandedPosition.transform;
        } else {
          floatingTimer.style.top = '50%';
          floatingTimer.style.left = '50%';
          floatingTimer.style.bottom = 'auto';
          floatingTimer.style.right = 'auto';
          floatingTimer.style.transform = 'translate(-50%, -50%)';
        }
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
      
      // Remove transform so it doesn't offset absolute coordinates
      timer.style.transform = 'none';
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
    try {
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
      }).catch(err => {
        console.error("Timer set error:", err);
        this.showNotification('資料庫錯誤', '無法設定計時器: ' + err.message);
      });
    } catch (e) {
      console.error("Start timer exception:", e);
      this.showNotification('錯誤', '啟動失敗: ' + e.message);
    }
  }

  adminPauseTimer() {
    try {
      this.timerRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (!data || !data.isActive || data.isPaused) return;
        
        const remaining = Math.max(0, Math.ceil((data.endTime - Date.now()) / 1000));
        this.timerRef.update({
          isPaused: true,
          remainingTime: remaining
        }).catch(err => {
          this.showNotification('資料庫錯誤', '無法暫停計時器: ' + err.message);
        });
      });
    } catch (e) {
      this.showNotification('錯誤', '暫停失敗: ' + e.message);
    }
  }

  adminResumeTimer() {
    try {
      this.timerRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (!data || !data.isActive || !data.isPaused) return;
        
        this.timerRef.update({
          isPaused: false,
          endTime: Date.now() + data.remainingTime * 1000
        }).catch(err => {
          this.showNotification('資料庫錯誤', '無法繼續計時器: ' + err.message);
        });
      });
    } catch (e) {
      this.showNotification('錯誤', '繼續計時失敗: ' + e.message);
    }
  }

  adminResetTimer() {
    try {
      this.timerRef.update({
        isActive: false
      }).catch(err => {
        this.showNotification('資料庫錯誤', '無法重設計時器: ' + err.message);
      });
    } catch (e) {
      this.showNotification('錯誤', '重設失敗: ' + e.message);
    }
  }

  loadYoutubeAPI() {
    window.onYouTubeIframeAPIReady = () => {
      this.initYoutubePlayers();
    };

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  initYoutubePlayers() {
    try {
      this.playerCanon = new YT.Player('canonPlayer', {
        height: '1',
        width: '1',
        videoId: 'MnhXZRw_ATU',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          loop: 1,
          playlist: 'MnhXZRw_ATU'
        },
        events: {
          onReady: () => {
            this.ytPlayersReady = true;
            this.applyMuteState();
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize YouTube players:", e);
    }
  }

  playAudio(track) {
    try {
      if (track === 'canon') {
        this.currentAudioPlaying = 'canon';
        if (this.ytPlayersReady && this.playerCanon && typeof this.playerCanon.playVideo === 'function') {
          // Reset volume to 100 on start play
          if (typeof this.playerCanon.setVolume === 'function') {
            this.playerCanon.setVolume(100);
          }
          this.playerCanon.playVideo();
        }
      } else {
        this.currentAudioPlaying = 'none';
        if (this.ytPlayersReady && this.playerCanon && typeof this.playerCanon.pauseVideo === 'function') {
          this.playerCanon.pauseVideo();
        }
      }
    } catch (e) {
      console.error("Error playing audio track:", track, e);
    }
  }

  toggleTimerMute() {
    this.timerMuted = !this.timerMuted;
    localStorage.setItem('timer_muted', this.timerMuted ? 'true' : 'false');
    this.applyMuteState();
  }

  applyMuteState() {
    const volBtn = document.getElementById('timerVolumeBtn');
    if (volBtn) {
      volBtn.textContent = this.timerMuted ? '🔇' : '🔊';
    }
    
    if (!this.ytPlayersReady) return;
    
    try {
      if (this.timerMuted) {
        if (this.playerCanon && typeof this.playerCanon.mute === 'function') this.playerCanon.mute();
      } else {
        if (this.playerCanon && typeof this.playerCanon.unMute === 'function') this.playerCanon.unMute();
      }
    } catch (e) {
      console.error("Error applying mute state:", e);
    }
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

  adminExportRecord() {
    this.showNotification('提示', '正在準備匯出檔案，請稍候...');
    
    Promise.all([
      db.ref('questions').once('value'),
      db.ref('images').once('value'),
      db.ref('quiz').once('value'),
      db.ref('whiteboard').once('value')
    ]).then(([questionsSnap, imagesSnap, quizSnap, whiteboardSnap]) => {
      const exportData = {
        questions: questionsSnap.val() || {},
        images: imagesSnap.val() || {},
        quiz: quizSnap.val() || {},
        whiteboard: whiteboardSnap.val() || {},
        exportedAt: new Date().toISOString(),
        dbUrl: db.app.options.databaseURL || ""
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `classroom_record_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      
      // Clean up
      setTimeout(() => {
        downloadAnchor.remove();
        URL.revokeObjectURL(url);
      }, 100);
      
      this.showNotification('成功', '匯出記錄檔完成！');
    }).catch(err => {
      console.error("Export failed:", err);
      this.showNotification('錯誤', '匯出失敗: ' + err.message);
    });
  }

  adminImportRecord(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate format
        if (!importedData.questions && !importedData.images && !importedData.quiz && !importedData.whiteboard) {
          this.showNotification('錯誤', '無效的記錄檔格式！');
          return;
        }
        
        this.showConfirmModal(
          '📥',
          '確定要匯入此記錄檔嗎？',
          '此動作會覆蓋當前資料庫的所有資料（提問、測驗與白板畫跡），且無法復原。',
          () => {
            this.showNotification('提示', '正在匯入資料，請稍候...');
            
            const promises = [];
            
            // Set data nodes
            promises.push(db.ref('questions').set(importedData.questions || null));
            promises.push(db.ref('images').set(importedData.images || null));
            promises.push(db.ref('quiz').set(importedData.quiz || null));
            promises.push(db.ref('whiteboard').set(importedData.whiteboard || null));
            
            Promise.all(promises).then(() => {
              this.showNotification('成功', '匯入記錄檔完成！');
              // Clear file input value
              event.target.value = '';
              
              // Force reload to refresh UI
              setTimeout(() => {
                location.reload();
              }, 1000);
            }).catch(err => {
              console.error("Import set failed:", err);
              this.showNotification('錯誤', '寫入資料庫失敗: ' + err.message);
            });
          }
        );
      } catch (err) {
        console.error("Parse failed:", err);
        this.showNotification('錯誤', '解析 JSON 檔案失敗！');
      }
    };
    reader.readAsText(file);
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
    if (window.app.timerState) {
      window.app.updateAdminTimerUI(window.app.timerState);
    }
  } else {
    window.app.showNotification('錯誤', '密碼不正確！');
  }
}

function logoutAdmin() {
  window.app.isAdmin = false;
  window.app.switchToTab('panel-questions');
  window.app.showNotification('提示', '已登出管理員模式');
  
  const volBtn = document.getElementById('timerVolumeBtn');
  if (volBtn) volBtn.style.display = 'none';
  window.app.playAudio('none');
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

// 課堂記錄備份全域呼叫介面
function adminExportRecord() {
  if (window.app) window.app.adminExportRecord();
}

function triggerImportInput() {
  const input = document.getElementById('importRecordInput');
  if (input) input.click();
}

function adminImportRecord(event) {
  if (window.app) window.app.adminImportRecord(event);
}

// 全域群組與心情回饋呼叫介面
function reactToQuestion(id, type) {
  if (window.app) window.app.reactToQuestion(id, type);
}

function reactToImage(id, type) {
  if (window.app) window.app.reactToImage(id, type);
}

function assignQuestionFolder(questionId, folderId) {
  if (window.app) window.app.assignQuestionFolder(questionId, folderId);
}

function assignImageFolder(imageId, folderId) {
  if (window.app) window.app.assignImageFolder(imageId, folderId);
}
