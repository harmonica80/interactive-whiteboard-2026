// 主程式
class App {
  constructor() {
    this.quiz = null;
    this.imageRef = db.ref('images');
    this.videoRef = db.ref('videos');
    this.currentZoom = 1;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.imagePos = { x: 0, y: 0 };
    
    // 初始化狀態快取
    this.questions = [];
    this.images = [];
    this.videos = [];
    this.currentQuiz = null;
    this.quizAnswers = {};
    this.isAdmin = false;
    this.activeQuestionId = null;
    this.activeImageId = null;
    this.activeVideoId = null;
    this.isUploadingImage = false;
    this.isUploadingVideo = false;
    
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
    this.questionFolders = [];
    this.imageFolders = [];
    this.videoFolders = [];
    this.expandedFolders = new Set();
    
    this.init();
  }
  
  init() {
    this.quiz = new Quiz();
    window.quiz = this.quiz;
    
    this.bindCollapseEvents();
    this.bindQuestionEvents();
    this.bindImageUpload();
    this.bindVideoUpload();
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
    
    // Global user interaction listener to resume audio if blocked by autoplay
    const resumeAudioOnGesture = () => {
      if (this.timerState && this.timerState.isActive && !this.timerState.isPaused) {
        if (this.ytPlayersReady && this.playerCanon && typeof this.playerCanon.playVideo === 'function') {
          this.playerCanon.playVideo();
          
          document.removeEventListener('click', resumeAudioOnGesture);
          document.removeEventListener('keydown', resumeAudioOnGesture);
          document.removeEventListener('touchstart', resumeAudioOnGesture);
        }
      } else {
        document.removeEventListener('click', resumeAudioOnGesture);
        document.removeEventListener('keydown', resumeAudioOnGesture);
        document.removeEventListener('touchstart', resumeAudioOnGesture);
      }
    };
    document.addEventListener('click', resumeAudioOnGesture);
    document.addEventListener('keydown', resumeAudioOnGesture);
    document.addEventListener('touchstart', resumeAudioOnGesture);
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

    // 監聽提問與圖片群組資料庫
    db.ref('quiz/questionFolders').on('value', (snapshot) => {
      const folders = [];
      snapshot.forEach(child => {
        folders.push({ id: child.key, ...child.val() });
      });
      folders.sort((a, b) => a.name.localeCompare(b.name, 'zh-hant'));
      this.questionFolders = folders;
      this.renderQuestionFoldersList();
      this.renderBatchQuestionFolderOptions();
      this.renderQuestions();
      this.renderAdminQuestions();
    });

    db.ref('quiz/imageFolders').on('value', (snapshot) => {
      const folders = [];
      snapshot.forEach(child => {
        folders.push({ id: child.key, ...child.val() });
      });
      folders.sort((a, b) => a.name.localeCompare(b.name, 'zh-hant'));
      this.imageFolders = folders;
      this.renderImageFoldersList();
      this.renderBatchImageFolderOptions();
      this.renderImages();
      this.renderAdminImages();
    });

    // 監聽影片資料庫
    this.videoRef.on('value', (snapshot) => {
      const videos = [];
      snapshot.forEach(child => {
        videos.push({ id: child.key, ...child.val() });
      });
      videos.sort((a, b) => b.timestamp - a.timestamp);
      this.videos = videos;
      this.renderVideos();
      this.renderAdminVideos();
      this.updateActiveVideoModal();
    });

    // 監聽影片群組資料庫
    db.ref('quiz/videoFolders').on('value', (snapshot) => {
      const folders = [];
      snapshot.forEach(child => {
        folders.push({ id: child.key, ...child.val() });
      });
      folders.sort((a, b) => a.name.localeCompare(b.name, 'zh-hant'));
      this.videoFolders = folders;
      this.renderVideoFoldersList();
      this.renderBatchVideoFolderOptions();
      this.renderVideos();
      this.renderAdminVideos();
    });

    // 監聽影片廣播狀態
    db.ref('quiz/broadcastVideo').on('value', (snapshot) => {
      const broadcastObj = snapshot.val();
      this.handleVideoBroadcastSync(broadcastObj);
    });
  }
  
  initModals() {
    const questionModal = document.getElementById('questionModal');
    const questionModalClose = document.getElementById('questionModalClose');
    
    questionModalClose.addEventListener('click', () => {
      questionModal.classList.remove('active');
      this.activeQuestionId = null;
    });
    questionModal.addEventListener('click', (e) => {
      if (e.target === questionModal) {
        questionModal.classList.remove('active');
        this.activeQuestionId = null;
      }
    });
    
    const imageModal = document.getElementById('imageModal');
    const imageModalClose = document.getElementById('imageModalClose');
    
    imageModalClose.addEventListener('click', () => {
      imageModal.classList.remove('active');
      this.activeImageId = null;
    });
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.remove('active');
        this.activeImageId = null;
      }
    });
    
    // 左右導覽按鈕事件註冊
    const questionModalPrev = document.getElementById('questionModalPrev');
    const questionModalNext = document.getElementById('questionModalNext');
    if (questionModalPrev) {
      questionModalPrev.addEventListener('click', () => {
        if (!this.activeQuestionId || this.questions.length <= 1) return;
        const index = this.questions.findIndex(q => q.id === this.activeQuestionId);
        if (index > -1) {
          const prevIndex = (index - 1 + this.questions.length) % this.questions.length;
          this.showQuestionModal(this.questions[prevIndex].id);
        }
      });
    }
    if (questionModalNext) {
      questionModalNext.addEventListener('click', () => {
        if (!this.activeQuestionId || this.questions.length <= 1) return;
        const index = this.questions.findIndex(q => q.id === this.activeQuestionId);
        if (index > -1) {
          const nextIndex = (index + 1) % this.questions.length;
          this.showQuestionModal(this.questions[nextIndex].id);
        }
      });
    }

    const imageModalPrev = document.getElementById('imageModalPrev');
    const imageModalNext = document.getElementById('imageModalNext');
    if (imageModalPrev) {
      imageModalPrev.addEventListener('click', () => {
        if (!this.activeImageId || this.images.length <= 1) return;
        const index = this.images.findIndex(img => img.id === this.activeImageId);
        if (index > -1) {
          const prevIndex = (index - 1 + this.images.length) % this.images.length;
          this.showImageModal(this.images[prevIndex].id);
        }
      });
    }
    if (imageModalNext) {
      imageModalNext.addEventListener('click', () => {
        if (!this.activeImageId || this.images.length <= 1) return;
        const index = this.images.findIndex(img => img.id === this.activeImageId);
        if (index > -1) {
          const nextIndex = (index + 1) % this.images.length;
          this.showImageModal(this.images[nextIndex].id);
        }
      });
    }

    // 影片視窗事件註冊
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          this.closeVideoModal();
        }
      });
    }

    const videoModalPrev = document.getElementById('videoModalPrev');
    const videoModalNext = document.getElementById('videoModalNext');
    if (videoModalPrev) {
      videoModalPrev.addEventListener('click', () => {
        if (!this.activeVideoId || this.videos.length <= 1) return;
        const index = this.videos.findIndex(v => v.id === this.activeVideoId);
        if (index > -1) {
          const prevIndex = (index - 1 + this.videos.length) % this.videos.length;
          this.showVideoModal(this.videos[prevIndex].id);
        }
      });
    }
    if (videoModalNext) {
      videoModalNext.addEventListener('click', () => {
        if (!this.activeVideoId || this.videos.length <= 1) return;
        const index = this.videos.findIndex(v => v.id === this.activeVideoId);
        if (index > -1) {
          const nextIndex = (index + 1) % this.videos.length;
          this.showVideoModal(this.videos[nextIndex].id);
        }
      });
    }
    
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
        this.activeQuestionId = null;
        this.activeImageId = null;
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
      this.isDragging = true;
      this.dragStart = { x: e.clientX - this.imagePos.x, y: e.clientY - this.imagePos.y };
      zoomContainer.style.cursor = 'grabbing';
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
      if (e.touches.length === 1) {
        touchStartPos = { x: e.touches[0].clientX - this.imagePos.x, y: e.touches[0].clientY - this.imagePos.y };
      }
    });
    
    zoomContainer.addEventListener('touchmove', (e) => {
      if (this.imageMode === 'draw') return;
      if (e.touches.length === 1) {
        this.imagePos.x = e.touches[0].clientX - touchStartPos.x;
        this.imagePos.y = e.touches[0].clientY - touchStartPos.y;
        this.updateImageTransform();
      }
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
  // ===== 提問與圖片群組分開管理 =====
  adminCreateQuestionFolder() {
    const input = document.getElementById('newQuestionFolderName');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      this.showNotification('提示', '請輸入提問群組名稱');
      return;
    }
    db.ref('quiz/questionFolders').push({ name: name }).then(() => {
      input.value = '';
      this.showNotification('成功', '提問群組已建立');
    });
  }

  adminDeleteQuestionFolder(folderId) {
    if (confirm('確定要刪除此提問群組嗎？\n（其中的提問不會被刪除，會移回無群組狀態）')) {
      db.ref(`quiz/questionFolders/${folderId}`).remove().then(() => {
        this.questions.forEach(q => {
          if (q.folderId === folderId) {
            db.ref(`questions/${q.id}/folderId`).remove();
          }
        });
        this.showNotification('成功', '提問群組已刪除');
      });
    }
  }

  adminCreateImageFolder() {
    const input = document.getElementById('newImageFolderName');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      this.showNotification('提示', '請輸入圖片群組名稱');
      return;
    }
    db.ref('quiz/imageFolders').push({ name: name }).then(() => {
      input.value = '';
      this.showNotification('成功', '圖片群組已建立');
    });
  }

  adminDeleteImageFolder(folderId) {
    if (confirm('確定要刪除此圖片群組嗎？\n（其中的圖片不會被刪除，會移回無群組狀態）')) {
      db.ref(`quiz/imageFolders/${folderId}`).remove().then(() => {
        this.images.forEach(img => {
          if (img.folderId === folderId) {
            db.ref(`images/${img.id}/folderId`).remove();
          }
        });
        this.showNotification('成功', '圖片群組已刪除');
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

  assignVideoFolder(videoId, folderId) {
    if (!folderId) {
      db.ref(`videos/${videoId}/folderId`).remove();
    } else {
      db.ref(`videos/${videoId}/folderId`).set(folderId);
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

  reactToVideo(id, type) {
    db.ref(`videos/${id}/reactions/${type}`).transaction(count => {
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
    this.renderVideos();
    this.renderAdminQuestions();
    this.renderAdminImages();
    this.renderAdminVideos();
  }

  isFolderCollapsed(folderId) {
    return !this.expandedFolders.has(folderId);
  }

  updateBatchSelectCount() {
    const qBoxesChecked = document.querySelectorAll('.admin-select-question:checked');
    const qCountEl = document.getElementById('batchQuestionSelectCount');
    if (qCountEl) qCountEl.textContent = qBoxesChecked.length;

    const imgBoxesChecked = document.querySelectorAll('.admin-select-image:checked');
    const imgCountEl = document.getElementById('batchImageSelectCount');
    if (imgCountEl) imgCountEl.textContent = imgBoxesChecked.length;

    const vidBoxesChecked = document.querySelectorAll('.admin-select-video:checked');
    const vidCountEl = document.getElementById('batchVideoSelectCount');
    if (vidCountEl) vidCountEl.textContent = vidBoxesChecked.length;
  }

  applyBatchQuestionArchive() {
    const select = document.getElementById('batchQuestionFolderSelect');
    if (!select) return;
    const folderId = select.value;
    const qBoxes = document.querySelectorAll('.admin-select-question:checked');
    
    if (qBoxes.length === 0) {
      this.showNotification('提示', '請先勾選下方的提問項目');
      return;
    }

    const updates = {};
    qBoxes.forEach(box => {
      const qId = box.value;
      updates[`questions/${qId}/folderId`] = folderId === "" ? null : folderId;
    });
    
    db.ref().update(updates).then(() => {
      this.showNotification('成功', '提問批次分組歸檔完成！');
      const selectAll = document.getElementById('selectAllQuestions');
      if (selectAll) selectAll.checked = false;
      this.updateBatchSelectCount();
    }).catch(err => {
      this.showNotification('錯誤', '歸檔失敗: ' + err.message);
    });
  }

  applyBatchImageArchive() {
    const select = document.getElementById('batchImageFolderSelect');
    if (!select) return;
    const folderId = select.value;
    const imgBoxes = document.querySelectorAll('.admin-select-image:checked');
    
    if (imgBoxes.length === 0) {
      this.showNotification('提示', '請先勾選下方的圖片項目');
      return;
    }

    const updates = {};
    imgBoxes.forEach(box => {
      const imgId = box.value;
      updates[`images/${imgId}/folderId`] = folderId === "" ? null : folderId;
    });
    
    db.ref().update(updates).then(() => {
      this.showNotification('成功', '圖片批次分組歸檔完成！');
      const selectAll = document.getElementById('selectAllImages');
      if (selectAll) selectAll.checked = false;
      this.updateBatchSelectCount();
    }).catch(err => {
      this.showNotification('錯誤', '歸檔失敗: ' + err.message);
    });
  }

  toggleSelectAllQuestions(checked) {
    const qBoxes = document.querySelectorAll('#adminQuestionList .admin-select-question');
    qBoxes.forEach(box => box.checked = checked);
    this.updateBatchSelectCount();
  }

  toggleSelectAllImages(checked) {
    const imgBoxes = document.querySelectorAll('#adminImagePreview .admin-select-image');
    imgBoxes.forEach(box => box.checked = checked);
    this.updateBatchSelectCount();
  }

  toggleSelectAllFolderQuestions(folderId, checked) {
    const qBoxes = document.querySelectorAll(`.folder-questions-${folderId} .admin-select-question`);
    qBoxes.forEach(box => box.checked = checked);
    this.updateBatchSelectCount();
  }

  toggleSelectAllFolderImages(folderId, checked) {
    const imgBoxes = document.querySelectorAll(`.folder-images-${folderId} .admin-select-image`);
    imgBoxes.forEach(box => box.checked = checked);
    this.updateBatchSelectCount();
  }

  deleteSelectedQuestions() {
    const qBoxes = document.querySelectorAll('.admin-select-question:checked');
    if (qBoxes.length === 0) {
      this.showNotification('提示', '請先勾選要刪除的提問！');
      return;
    }
    
    this.showConfirmModal(
      '🗑️',
      `確定要刪除這 ${qBoxes.length} 個提問嗎？`,
      '此動作將永久刪除所選提問，且無法復原。',
      () => {
        const updates = {};
        qBoxes.forEach(box => {
          updates[`questions/${box.value}`] = null;
        });
        
        db.ref().update(updates).then(() => {
          this.showNotification('成功', `已成功刪除 ${qBoxes.length} 個提問！`);
          const selectAll = document.getElementById('selectAllQuestions');
          if (selectAll) selectAll.checked = false;
          this.updateBatchSelectCount();
        }).catch(err => {
          this.showNotification('錯誤', '刪除失敗: ' + err.message);
        });
      }
    );
  }

  deleteSelectedImages() {
    const imgBoxes = document.querySelectorAll('.admin-select-image:checked');
    if (imgBoxes.length === 0) {
      this.showNotification('提示', '請先勾選要刪除的圖片！');
      return;
    }
    
    this.showConfirmModal(
      '🖼️',
      `確定要刪除這 ${imgBoxes.length} 張圖片嗎？`,
      '此動作將永久刪除所選圖片，且無法復原。',
      () => {
        const updates = {};
        imgBoxes.forEach(box => {
          updates[`images/${box.value}`] = null;
        });
        
        db.ref().update(updates).then(() => {
          this.showNotification('成功', `已成功刪除 ${imgBoxes.length} 張圖片！`);
          const selectAll = document.getElementById('selectAllImages');
          if (selectAll) selectAll.checked = false;
          this.updateBatchSelectCount();
        }).catch(err => {
          this.showNotification('錯誤', '刪除失敗: ' + err.message);
        });
      }
    );
  }

  deleteSelectedFolderQuestions(folderId) {
    const qBoxes = document.querySelectorAll(`.folder-questions-${folderId} .admin-select-question:checked`);
    if (qBoxes.length === 0) {
      this.showNotification('提示', '請先勾選此群組中要刪除的提問！');
      return;
    }
    
    this.showConfirmModal(
      '🗑️',
      `確定要刪除此群組中的 ${qBoxes.length} 個提問嗎？`,
      '此動作將永久刪除所選提問，且無法復原。',
      () => {
        const updates = {};
        qBoxes.forEach(box => {
          updates[`questions/${box.value}`] = null;
        });
        
        db.ref().update(updates).then(() => {
          this.showNotification('成功', `已成功刪除群組中的 ${qBoxes.length} 個提問！`);
          const folderSelectAll = document.querySelector(`.folder-select-all-checkbox-${folderId}`);
          if (folderSelectAll) folderSelectAll.checked = false;
          this.updateBatchSelectCount();
        }).catch(err => {
          this.showNotification('錯誤', '刪除失敗: ' + err.message);
        });
      }
    );
  }

  deleteSelectedFolderImages(folderId) {
    const imgBoxes = document.querySelectorAll(`.folder-images-${folderId} .admin-select-image:checked`);
    if (imgBoxes.length === 0) {
      this.showNotification('提示', '請先勾選此群組中要刪除的圖片！');
      return;
    }
    
    this.showConfirmModal(
      '🖼️',
      `確定要刪除此群組中的 ${imgBoxes.length} 張圖片嗎？`,
      '此動作將永久刪除所選圖片，且無法復原。',
      () => {
        const updates = {};
        imgBoxes.forEach(box => {
          updates[`images/${box.value}`] = null;
        });
        
        db.ref().update(updates).then(() => {
          this.showNotification('成功', `已成功刪除群組中的 ${imgBoxes.length} 張圖片！`);
          const folderSelectAll = document.querySelector(`.folder-select-all-checkbox-${folderId}`);
          if (folderSelectAll) folderSelectAll.checked = false;
          this.updateBatchSelectCount();
        }).catch(err => {
          this.showNotification('錯誤', '刪除失敗: ' + err.message);
        });
      }
    );
  }

  adminCreateVideoFolder() {
    const input = document.getElementById('newVideoFolderName');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      this.showNotification('提示', '請輸入影片群組名稱');
      return;
    }
    db.ref('quiz/videoFolders').push({ name: name }).then(() => {
      input.value = '';
      this.showNotification('成功', '影片群組已建立');
    });
  }

  adminDeleteVideoFolder(folderId) {
    if (confirm('確定要刪除此影片群組嗎？\n（其中的影片不會被刪除，會移回無群組狀態）')) {
      db.ref(`quiz/videoFolders/${folderId}`).remove().then(() => {
        this.videos.forEach(vid => {
          if (vid.folderId === folderId) {
            db.ref(`videos/${vid.id}/folderId`).remove();
          }
        });
        this.showNotification('成功', '影片群組已刪除');
      });
    }
  }

  renderVideoFoldersList() {
    const container = document.getElementById('adminVideoFolderList');
    if (!container) return;

    if (this.videoFolders.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 12px 0;">暫無群組</div>';
      return;
    }

    container.innerHTML = this.videoFolders.map(f => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(0,0,0,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
        <span style="font-weight: bold; color: var(--text-primary); font-size: 13px;">📁 ${this.escapeHtml(f.name)}</span>
        <button class="preset-btn" onclick="window.app.adminDeleteVideoFolder('${f.id}')" style="background: var(--danger-color); color: white; border: none; padding: 2px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">刪除</button>
      </div>
    `).join('');
  }

  renderBatchVideoFolderOptions() {
    const select = document.getElementById('batchVideoFolderSelect');
    if (!select) return;
    const currentVal = select.value;
    
    let html = '<option value="">📁 移出影片群組 (無群組)</option>';
    this.videoFolders.forEach(f => {
      html += `<option value="${f.id}">📁 ${this.escapeHtml(f.name)}</option>`;
    });
    
    select.innerHTML = html;
    select.value = currentVal;
  }

  applyBatchVideoArchive() {
    const select = document.getElementById('batchVideoFolderSelect');
    if (!select) return;
    const folderId = select.value;
    const vidBoxes = document.querySelectorAll('.admin-select-video:checked');
    
    if (vidBoxes.length === 0) {
      this.showNotification('提示', '請先勾選下方的影片項目');
      return;
    }

    const updates = {};
    vidBoxes.forEach(box => {
      const vidId = box.value;
      updates[`videos/${vidId}/folderId`] = folderId === "" ? null : folderId;
    });
    
    db.ref().update(updates).then(() => {
      this.showNotification('成功', '影片批次分組歸檔完成！');
      const selectAll = document.getElementById('selectAllVideos');
      if (selectAll) selectAll.checked = false;
      this.updateBatchSelectCount();
    }).catch(err => {
      this.showNotification('錯誤', '歸檔失敗: ' + err.message);
    });
  }

  toggleSelectAllVideos(checked) {
    const vidBoxes = document.querySelectorAll('#adminVideoPreview .admin-select-video, #adminVideosGroupedContainer .admin-select-video');
    vidBoxes.forEach(box => box.checked = checked);
    this.updateBatchSelectCount();
  }

  toggleSelectAllFolderVideos(folderId, checked) {
    const vidBoxes = document.querySelectorAll(`.folder-videos-${folderId} .admin-select-video`);
    vidBoxes.forEach(box => box.checked = checked);
    this.updateBatchSelectCount();
  }

  deleteSelectedVideos() {
    const vidBoxes = document.querySelectorAll('.admin-select-video:checked');
    if (vidBoxes.length === 0) {
      this.showNotification('提示', '請先勾選要刪除的影片！');
      return;
    }
    
    this.showConfirmModal(
      '🎥',
      `確定要刪除這 ${vidBoxes.length} 個影片嗎？`,
      '此動作將永久刪除所選影片，且無法復原。',
      () => {
        const updates = {};
        vidBoxes.forEach(box => {
          updates[`videos/${box.value}`] = null;
        });
        
        db.ref().update(updates).then(() => {
          this.showNotification('成功', `已成功刪除 ${vidBoxes.length} 個影片！`);
          const selectAll = document.getElementById('selectAllVideos');
          if (selectAll) selectAll.checked = false;
          this.updateBatchSelectCount();
        }).catch(err => {
          this.showNotification('錯誤', '刪除失敗: ' + err.message);
        });
      }
    );
  }

  deleteSelectedFolderVideos(folderId) {
    const vidBoxes = document.querySelectorAll(`.folder-videos-${folderId} .admin-select-video:checked`);
    if (vidBoxes.length === 0) {
      this.showNotification('提示', '請先勾選此群組中要刪除的影片！');
      return;
    }
    
    this.showConfirmModal(
      '🎥',
      `確定要刪除此群組中的 ${vidBoxes.length} 個影片嗎？`,
      '此動作將永久刪除所選影片，且無法復原。',
      () => {
        const updates = {};
        vidBoxes.forEach(box => {
          updates[`videos/${box.value}`] = null;
        });
        
        db.ref().update(updates).then(() => {
          this.showNotification('成功', `已成功刪除群組中的 ${vidBoxes.length} 個影片！`);
          const folderSelectAll = document.querySelector(`.folder-select-all-checkbox-${folderId}`);
          if (folderSelectAll) folderSelectAll.checked = false;
          this.updateBatchSelectCount();
        }).catch(err => {
          this.showNotification('錯誤', '刪除失敗: ' + err.message);
        });
      }
    );
  }

  renderAdminVideos() {
    const adminVideoPreview = document.getElementById('adminVideoPreview');
    const adminVideosGroupedContainer = document.getElementById('adminVideosGroupedContainer');
    if (!adminVideoPreview || !adminVideosGroupedContainer) return;

    if (this.videos.length === 0) {
      adminVideosGroupedContainer.innerHTML = '';
      adminVideoPreview.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px; width: 100%;">暫無影片</div>';
      return;
    }

    const getThumbnailUrl = (vid) => {
      if (vid.type === 'youtube' && vid.youtubeId) {
        return `https://img.youtube.com/vi/${vid.youtubeId}/0.jpg`;
      }
      return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><rect width='100%' height='100%' fill='%232c2c2e'/><path d='M35,45 L75,45 L75,85 L35,85 Z M80,50 L105,35 L105,95 L80,80 Z' fill='%238e8e93' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>`;
    };

    const renderAdminVideoItemHtml = (vid) => `
      <div class="preview-item-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 12px; border: 1px solid var(--border-color); position: relative; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 4px;">
          <input type="checkbox" class="admin-select-video" value="${vid.id}" onchange="window.app.updateBatchSelectCount()" style="width: 14px; height: 14px; margin: 0; cursor: pointer;">
          <button onclick="window.app.broadcastVideo('${vid.id}')" style="background: var(--accent-color); color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: bold;" title="廣播播放此影片到學生端螢幕">📢 廣播</button>
        </div>
        <div class="preview-item video-item" style="cursor: pointer; margin: 0; position: relative;">
          <img src="${getThumbnailUrl(vid)}" onclick="window.app.showVideoModal('${vid.id}')" alt="${vid.filename}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 10px; border: 2px solid var(--border-color);">
          <button onclick="deleteVideo('${vid.id}')" title="刪除影片" style="
            position: absolute; top: -6px; right: -6px;
            width: 20px; height: 20px; border: none;
            background: var(--danger-color); color: white;
            border-radius: 50%; cursor: pointer;
            font-size: 10px; display: flex;
            align-items: center; justify-content: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            z-index: 5;
          ">✕</button>
          <div style="position: absolute; bottom: 2px; left: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; font-size: 9px; padding: 1px 2px; border-radius: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">
            ${this.escapeHtml(vid.filename)}
          </div>
        </div>
      </div>
    `;

    // 1. Grouped Folders
    let groupedHtml = '';
    this.videoFolders.forEach(f => {
      const folderVideos = this.videos.filter(vid => vid.folderId === f.id);
      if (folderVideos.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        groupedHtml += `
          <div class="folder-group-row folder-videos-${f.id}" style="margin-bottom: 16px; border-left: 6px solid #34c759; background: var(--bg-card); border-radius: 12px; border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow: hidden; width: 100%;">
            <div class="folder-group-header" style="padding: 10px 14px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; user-select: none;">
              <span onclick="window.app.toggleFolderCollapse('${f.id}')" style="font-size: 13px; font-weight: bold; color: var(--text-primary); cursor: pointer; flex: 1;">
                📁 ${this.escapeHtml(f.name)} (${folderVideos.length} 個影片)
              </span>
              <div style="display: flex; align-items: center; gap: 10px;">
                <label style="font-size: 11px; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 4px; user-select: none; margin: 0;">
                  <input type="checkbox" class="folder-select-all-checkbox-${f.id}" onchange="window.app.toggleSelectAllFolderVideos('${f.id}', this.checked)" style="width: 12px; height: 12px; margin: 0;"> 全選
                </label>
                <button onclick="window.app.deleteSelectedFolderVideos('${f.id}')" style="background: var(--danger-color); color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold;">🗑️ 刪除選取</button>
                <button onclick="window.app.toggleFolderCollapse('${f.id}')" style="background: transparent; border: none; font-size: 12px; color: var(--accent-color); cursor: pointer; font-weight: bold;">${isCollapsed ? '展開' : '折疊'}</button>
              </div>
            </div>
            <div class="folder-group-content" style="display: ${isCollapsed ? 'none' : 'block'}; padding: 12px; background: var(--bg-card);">
              <div class="image-preview" style="margin: 0; padding: 0;">
                ${folderVideos.map(vid => renderAdminVideoItemHtml(vid)).join('')}
              </div>
            </div>
          </div>
        `;
      }
    });
    adminVideosGroupedContainer.innerHTML = groupedHtml;

    // 2. Unassigned Videos
    const unassignedVideos = this.videos.filter(vid => {
      if (!vid.folderId) return true;
      return !this.videoFolders.some(f => f.id === vid.folderId);
    });

    if (unassignedVideos.length > 0) {
      adminVideoPreview.innerHTML = unassignedVideos.map(vid => renderAdminVideoItemHtml(vid)).join('');
    } else {
      adminVideoPreview.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 16px; width: 100%; font-size: 12px;">暫無未分類影片</div>';
    }
  }

  renderBatchQuestionFolderOptions() {
    const select = document.getElementById('batchQuestionFolderSelect');
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = `
      <option value="">📁 移出提問群組 (無群組)</option>
      ${this.questionFolders.map(f => `<option value="${f.id}">${this.escapeHtml(f.name)}</option>`).join('')}
    `;
    select.value = currentVal;
  }

  renderBatchImageFolderOptions() {
    const select = document.getElementById('batchImageFolderSelect');
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = `
      <option value="">📁 移出圖片群組 (無群組)</option>
      ${this.imageFolders.map(f => `<option value="${f.id}">${this.escapeHtml(f.name)}</option>`).join('')}
    `;
    select.value = currentVal;
  }

  renderQuestionFoldersList() {
    const list = document.getElementById('adminQuestionFolderList');
    if (!list) return;
    if (this.questionFolders.length === 0) {
      list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 8px; font-size: 13px;">暫無提問群組</div>';
      return;
    }
    list.innerHTML = this.questionFolders.map(f => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: rgba(0,0,0,0.03); border-radius: 6px; font-size: 13px; margin-bottom: 4px; cursor: default;">
        <span style="font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 4px;">📁 ${this.escapeHtml(f.name)}</span>
        <button class="preset-btn" onclick="event.stopPropagation(); window.app.adminDeleteQuestionFolder('${f.id}')" style="color: var(--danger-color); border-color: var(--danger-color); padding: 2px 6px; font-size: 11px; margin: 0; background: transparent; cursor: pointer;">刪除</button>
      </div>
    `).join('');
  }

  renderImageFoldersList() {
    const list = document.getElementById('adminImageFolderList');
    if (!list) return;
    if (this.imageFolders.length === 0) {
      list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 8px; font-size: 13px;">暫無圖片群組</div>';
      return;
    }
    list.innerHTML = this.imageFolders.map(f => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: rgba(0,0,0,0.03); border-radius: 6px; font-size: 13px; margin-bottom: 4px; cursor: default;">
        <span style="font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 4px;">📁 ${this.escapeHtml(f.name)}</span>
        <button class="preset-btn" onclick="event.stopPropagation(); window.app.adminDeleteImageFolder('${f.id}')" style="color: var(--danger-color); border-color: var(--danger-color); padding: 2px 6px; font-size: 11px; margin: 0; background: transparent; cursor: pointer;">刪除</button>
      </div>
    `).join('');
  }

  showQuestionModal(id) {
    this.activeQuestionId = id;
    const questionModal = document.getElementById('questionModal');
    const q = this.questions.find(item => item.id === id);
    if (!q) {
      questionModal.classList.remove('active');
      this.activeQuestionId = null;
      return;
    }
    
    document.getElementById('questionModalUser').textContent = q.user;
    document.getElementById('questionModalText').innerHTML = this.linkify(q.text);
    
    this.updateActiveQuestionModal();
    
    const prevBtn = document.getElementById('questionModalPrev');
    const nextBtn = document.getElementById('questionModalNext');
    if (this.questions.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    } else {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    }
    
    questionModal.classList.add('active');
  }

  updateActiveQuestionModal() {
    if (!this.activeQuestionId) return;
    const q = this.questions.find(item => item.id === this.activeQuestionId);
    if (!q) return;
    
    const container = document.getElementById('questionModalReactions');
    if (container) {
      container.innerHTML = `
        <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'like')" title="讚">
          <span class="reaction-emoji">👍</span>
          <span class="reaction-count">${q.reactions?.like || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'love')" title="愛心">
          <span class="reaction-emoji">❤️</span>
          <span class="reaction-count">${q.reactions?.love || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'laugh')" title="大笑">
          <span class="reaction-emoji">😆</span>
          <span class="reaction-count">${q.reactions?.laugh || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'wow')" title="驚訝">
          <span class="reaction-emoji">😮</span>
          <span class="reaction-count">${q.reactions?.wow || 0}</span>
        </button>
      `;
    }
  }
  
  showImageModal(id) {
    this.activeImageId = id;
    const imageModal = document.getElementById('imageModal');
    const img = this.images.find(item => item.id === id);
    if (!img) {
      imageModal.classList.remove('active');
      this.activeImageId = null;
      return;
    }
    
    const modalImage = document.getElementById('modalImage');
    const canvas = document.getElementById('imageMarkupCanvas');
    
    modalImage.src = img.url;
    document.getElementById('modalImageUser').textContent = '上傳者: ' + img.user;
    document.getElementById('modalImageFilename').textContent = img.filename;
    document.getElementById('modalDownloadBtn').href = img.url;
    document.getElementById('modalDownloadBtn').download = img.filename;
    
    this.currentZoom = 1;
    this.imagePos = { x: 0, y: 0 };
    
    const wrapper = document.getElementById('imageCanvasWrapper');
    if (wrapper) {
      wrapper.style.transform = 'translate(0px, 0px) scale(1)';
    }
    
    document.getElementById('zoomInfo').textContent = '100%';
    this.setImageMode('pan');
    
    modalImage.onload = () => {
      if (canvas) {
        canvas.width = modalImage.naturalWidth;
        canvas.height = modalImage.naturalHeight;
        this.clearImageMarkup();
      }
    };
    
    this.updateActiveImageModal();
    
    const prevBtn = document.getElementById('imageModalPrev');
    const nextBtn = document.getElementById('imageModalNext');
    if (this.images.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    } else {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    }
    
    imageModal.classList.add('active');
  }

  updateActiveImageModal() {
    if (!this.activeImageId) return;
    const img = this.images.find(item => item.id === this.activeImageId);
    if (!img) return;
    
    const container = document.getElementById('imageModalReactions');
    if (container) {
      container.innerHTML = `
        <button class="reaction-btn" onclick="reactToImage('${img.id}', 'like')" style="min-width: 32px; padding: 2px 6px;" title="讚">
          <span class="reaction-emoji" style="font-size: 11px;">👍</span>
          <span class="reaction-count" style="font-size: 9px;">${img.reactions?.like || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToImage('${img.id}', 'love')" style="min-width: 32px; padding: 2px 6px;" title="愛心">
          <span class="reaction-emoji" style="font-size: 11px;">❤️</span>
          <span class="reaction-count" style="font-size: 9px;">${img.reactions?.love || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToImage('${img.id}', 'laugh')" style="min-width: 32px; padding: 2px 6px;" title="大笑">
          <span class="reaction-emoji" style="font-size: 11px;">😆</span>
          <span class="reaction-count" style="font-size: 9px;">${img.reactions?.laugh || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToImage('${img.id}', 'wow')" style="min-width: 32px; padding: 2px 6px;" title="驚訝">
          <span class="reaction-emoji" style="font-size: 11px;">😮</span>
          <span class="reaction-count" style="font-size: 9px;">${img.reactions?.wow || 0}</span>
        </button>
      `;
    }
  }

  showVideoModal(id) {
    this.activeVideoId = id;
    const videoModal = document.getElementById('videoModal');
    const vid = this.videos.find(item => item.id === id);
    if (!vid) {
      if (videoModal) videoModal.classList.remove('active');
      this.activeVideoId = null;
      return;
    }

    document.getElementById('modalVideoUser').textContent = '分享者: ' + vid.user;
    document.getElementById('modalVideoFilename').textContent = vid.filename;

    const downloadBtn = document.getElementById('modalVideoDownloadBtn');
    if (vid.type === 'upload' && vid.url && !vid.url.startsWith('data:')) {
      downloadBtn.href = vid.url;
      downloadBtn.download = vid.filename;
      downloadBtn.style.display = 'block';
    } else {
      downloadBtn.style.display = 'none';
    }

    const playerContainer = document.getElementById('videoPlayerContainer');
    playerContainer.innerHTML = '';

    if (vid.type === 'youtube' && vid.youtubeId) {
      playerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${vid.youtubeId}?autoplay=1&enablejsapi=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else if (vid.type === 'drive') {
      const driveMatch = vid.url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || vid.url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      const embedUrl = driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : vid.url;
      playerContainer.innerHTML = `<iframe src="${embedUrl}" allow="autoplay" allowfullscreen></iframe>`;
    } else {
      playerContainer.innerHTML = `<video src="${vid.url}" controls autoplay playsinline style="width: 100%; height: 100%; object-fit: contain;"></video>`;
    }

    this.updateActiveVideoModal();

    const prevBtn = document.getElementById('videoModalPrev');
    const nextBtn = document.getElementById('videoModalNext');
    if (this.videos.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    } else {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    }

    if (videoModal) videoModal.classList.add('active');
  }

  closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) videoModal.classList.remove('active');
    
    const playerContainer = document.getElementById('videoPlayerContainer');
    if (playerContainer) playerContainer.innerHTML = '';
    
    this.activeVideoId = null;
  }

  updateActiveVideoModal() {
    if (!this.activeVideoId) return;
    const vid = this.videos.find(item => item.id === this.activeVideoId);
    if (!vid) return;

    const container = document.getElementById('videoModalReactions');
    if (container) {
      container.innerHTML = `
        <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'like')" style="min-width: 32px; padding: 2px 6px;" title="讚">
          <span class="reaction-emoji" style="font-size: 11px;">👍</span>
          <span class="reaction-count" style="font-size: 9px;">${vid.reactions?.like || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'love')" style="min-width: 32px; padding: 2px 6px;" title="愛心">
          <span class="reaction-emoji" style="font-size: 11px;">❤️</span>
          <span class="reaction-count" style="font-size: 9px;">${vid.reactions?.love || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'laugh')" style="min-width: 32px; padding: 2px 6px;" title="大笑">
          <span class="reaction-emoji" style="font-size: 11px;">😆</span>
          <span class="reaction-count" style="font-size: 9px;">${vid.reactions?.laugh || 0}</span>
        </button>
        <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'wow')" style="min-width: 32px; padding: 2px 6px;" title="驚訝">
          <span class="reaction-emoji" style="font-size: 11px;">😮</span>
          <span class="reaction-count" style="font-size: 9px;">${vid.reactions?.wow || 0}</span>
        </button>
      `;
    }
  }

  handleVideoBroadcastSync(broadcastObj) {
    const overlay = document.getElementById('broadcastVideoOverlay');
    const container = document.getElementById('broadcastPlayerContainer');
    if (!overlay || !container) return;

    if (!broadcastObj) {
      overlay.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    overlay.style.display = 'flex';
    container.innerHTML = '';
    
    const unmuteBtn = document.getElementById('broadcastUnmuteBtn');
    if (unmuteBtn) unmuteBtn.style.display = 'flex';

    if (broadcastObj.type === 'youtube' && broadcastObj.youtubeId) {
      container.innerHTML = `<iframe id="broadcastIframe" src="https://www.youtube.com/embed/${broadcastObj.youtubeId}?autoplay=1&mute=1&enablejsapi=1" allow="autoplay; encrypted-media" allowfullscreen style="width:100%; height:100%;"></iframe>`;
    } else if (broadcastObj.type === 'drive') {
      const driveMatch = broadcastObj.url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || broadcastObj.url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      const embedUrl = driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : broadcastObj.url;
      container.innerHTML = `<iframe id="broadcastIframe" src="${embedUrl}" allow="autoplay" allowfullscreen style="width:100%; height:100%;"></iframe>`;
    } else {
      container.innerHTML = `<video id="broadcastVideoEl" src="${broadcastObj.url}" autoplay muted playsinline controls style="width: 100%; height: 100%; object-fit: contain;"></video>`;
    }
  }

  unmuteBroadcastVideo() {
    const unmuteBtn = document.getElementById('broadcastUnmuteBtn');
    if (unmuteBtn) unmuteBtn.style.display = 'none';

    const videoEl = document.getElementById('broadcastVideoEl');
    if (videoEl) {
      videoEl.muted = false;
      return;
    }

    const iframe = document.getElementById('broadcastIframe');
    if (iframe) {
      iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
  }

  closeBroadcastOverlayLocal() {
    const overlay = document.getElementById('broadcastVideoOverlay');
    const container = document.getElementById('broadcastPlayerContainer');
    if (overlay) overlay.style.display = 'none';
    if (container) container.innerHTML = '';
  }

  broadcastVideo(id) {
    if (!this.isAdmin) {
      this.showNotification('提示', '只有管理員老師可以進行廣播');
      return;
    }
    const vid = this.videos.find(item => item.id === id);
    if (!vid) return;

    db.ref('quiz/broadcastVideo').set({
      url: vid.url,
      type: vid.type,
      filename: vid.filename,
      youtubeId: vid.youtubeId || null,
      timestamp: Date.now()
    }).then(() => {
      this.showNotification('成功', '已對全班廣播播放該影片！');
    });
  }

  stopBroadcastVideo() {
    if (!this.isAdmin) return;
    db.ref('quiz/broadcastVideo').set(null).then(() => {
      this.showNotification('提示', '已停止全體影片廣播');
    });
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
      if (this.askBtn.disabled) return;
      
      const now = Date.now();
      if (this.lastQuestionSubmitTime && now - this.lastQuestionSubmitTime < 2000) {
        this.showNotification('提示', '提問頻率太快，請稍候再試...');
        return;
      }
      this.lastQuestionSubmitTime = now;
      
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
    const questionsGroupedContainer = document.getElementById('questionsGroupedContainer');
    if (!questionList || !questionsGroupedContainer) return;

    if (this.questions.length === 0) {
      questionsGroupedContainer.innerHTML = '';
      questionList.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 20px; width: 100%;">暫無問題</li>';
      return;
    }
    
    const total = this.questions.length;
    
    const renderQuestionItemHtml = (q, idx) => `
      <li class="question-item card-style" data-id="${q.id}" data-user="${this.escapeHtml(q.user)}" data-text="${this.escapeHtml(q.text)}" style="cursor: pointer; margin-bottom: 8px;">
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
            <span class="reaction-emoji">👍</span>
            <span class="reaction-count">${q.reactions?.like || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'love')" title="愛心">
            <span class="reaction-emoji">❤️</span>
            <span class="reaction-count">${q.reactions?.love || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'laugh')" title="大笑">
            <span class="reaction-emoji">😆</span>
            <span class="reaction-count">${q.reactions?.laugh || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToQuestion('${q.id}', 'wow')" title="驚訝">
            <span class="reaction-emoji">😮</span>
            <span class="reaction-count">${q.reactions?.wow || 0}</span>
          </button>
        </div>
      </li>
    `;

    // 1. Render Grouped Folders (takes full rows)
    let groupedHtml = '';
    this.questionFolders.forEach(f => {
      const folderQuestions = this.questions.filter(q => q.folderId === f.id);
      if (folderQuestions.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        groupedHtml += `
          <div class="folder-group-row" style="margin-bottom: 16px; border-left: 6px solid #ff9500; background: var(--bg-card); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow: hidden; width: 100%;">
            <div class="folder-group-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="padding: 14px 20px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: bold; color: var(--text-primary);">
              <span style="font-size: 15px; display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderQuestions.length} 個提問)</span>
              </span>
              <button class="folder-toggle-btn" style="background: transparent; border: none; font-size: 13px; font-weight: bold; color: var(--accent-color); cursor: pointer;">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <div class="folder-group-content" style="display: ${isCollapsed ? 'none' : 'block'}; padding: 16px 20px; background: var(--bg-card);">
              <ul class="question-list" style="margin: 0; padding: 0; list-style: none;">
                ${folderQuestions.map(q => {
                  const idx = this.questions.indexOf(q);
                  return renderQuestionItemHtml(q, idx);
                }).join('')}
              </ul>
            </div>
          </div>
        `;
      }
    });
    questionsGroupedContainer.innerHTML = groupedHtml;
    
    // 2. Render Unassigned Questions
    const unassignedQuestions = this.questions.filter(q => {
      if (!q.folderId) return true;
      return !this.questionFolders.some(f => f.id === q.folderId);
    });
    
    let ungroupedHtml = '';
    if (unassignedQuestions.length > 0) {
      ungroupedHtml = unassignedQuestions.map(q => {
        const idx = this.questions.indexOf(q);
        return renderQuestionItemHtml(q, idx);
      }).join('');
    } else {
      ungroupedHtml = '<li style="text-align: center; color: var(--text-muted); padding: 20px; width: 100%;">暫無未分類提問</li>';
    }
    questionList.innerHTML = ungroupedHtml;
    
    // Bind click events
    document.querySelectorAll('.panel-body .question-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('.reactions-bar')) {
          return;
        }
        this.showQuestionModal(item.dataset.id);
      });
    });
    
    // Reactively update active question modal reactions
    this.updateActiveQuestionModal();
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
          e.stopPropagation(); // 阻止事件冒泡到 document 造成重複觸發
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
    const now = Date.now();
    if (this.lastImageUploadTime && now - this.lastImageUploadTime < 2000) {
      this.showNotification('提示', '貼上/上傳頻率太快，請稍候再試...');
      return;
    }
    this.lastImageUploadTime = now;

    if (this.isUploadingImage) {
      this.showNotification('提示', '上傳中，請稍候...');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      this.showNotification('提示', '請上傳圖片檔案（JPG、PNG、GIF 等）');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      this.showNotification('提示', '圖片大小不能超過 5MB');
      return;
    }
    
    this.isUploadingImage = true;
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
        this.isUploadingImage = false;
      })
      .catch((error) => {
        console.warn('Firebase Storage 上傳失敗，啟用本地壓縮備用方案:', error);
        this.showNotification('提示', '正在進行圖片輕量化壓縮並寫入資料庫...');
        compressAndUpload()
          .then(() => {
            this.showNotification('成功', '圖片上傳成功！');
            this.isUploadingImage = false;
          })
          .catch((err) => {
            console.error('備用圖片上傳失敗:', err);
            this.showNotification('錯誤', '圖片上傳失敗，請稍後再試');
            this.isUploadingImage = false;
          });
      });
  }

  bindVideoUpload() {
    const videoUploadZone = document.getElementById('videoUploadZone');
    const videoFileInput = document.getElementById('videoFileInput');
    if (!videoUploadZone || !videoFileInput) return;

    videoUploadZone.addEventListener('click', (e) => {
      e.stopPropagation();
      videoFileInput.click();
    });

    videoUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoUploadZone.classList.add('dragover');
    });

    videoUploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoUploadZone.classList.remove('dragover');
    });

    videoUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoUploadZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleVideoUpload(e.dataTransfer.files[0]);
      }
    });

    videoFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleVideoUpload(e.target.files[0]);
        videoFileInput.value = '';
      }
    });
  }

  compressVideo(file, progressCallback) {
    return new Promise(async (resolve, reject) => {
      let objectUrl = null;
      try {
        const video = document.createElement('video');
        objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;
        video.muted = true;
        video.playsInline = true;
        
        await new Promise((res, rej) => {
          video.onloadedmetadata = () => res();
          video.onerror = (e) => rej(new Error("無法讀取影片元資料"));
        });
        
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;
        const MAX_SIZE = 640;
        if (targetWidth > MAX_SIZE || targetHeight > MAX_SIZE) {
          if (targetWidth > targetHeight) {
            targetHeight = Math.round((targetHeight * MAX_SIZE) / targetWidth);
            targetWidth = MAX_SIZE;
          } else {
            targetWidth = Math.round((targetWidth * MAX_SIZE) / targetHeight);
            targetHeight = MAX_SIZE;
          }
        }
        targetWidth = targetWidth - (targetWidth % 2);
        targetHeight = targetHeight - (targetHeight % 2);
        
        const duration = video.duration;
        const fps = 25;
        const interval = 1 / fps;
        
        let audioBuffer = null;
        try {
          const arrayBuffer = await file.arrayBuffer();
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        } catch (err) {
          console.warn("無法解碼音軌，將以無聲模式壓縮:", err);
        }
        
        const muxerConfig = {
          target: new Mp4Muxer.ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width: targetWidth,
            height: targetHeight
          },
          fastStart: 'in-memory'
        };
        
        if (audioBuffer) {
          muxerConfig.audio = {
            codec: 'aac',
            numberOfChannels: Math.min(2, audioBuffer.numberOfChannels),
            sampleRate: audioBuffer.sampleRate
          };
        }
        
        const muxer = new Mp4Muxer.Muxer(muxerConfig);
        
        const videoEncoder = new VideoEncoder({
          output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
          error: (e) => {
            console.error("VideoEncoder 發生錯誤:", e);
            reject(e);
          }
        });
        
        videoEncoder.configure({
          codec: 'avc1.42001f',
          width: targetWidth,
          height: targetHeight,
          bitrate: 500000,
          framerate: fps,
          latencyMode: 'quality'
        });
        
        let audioEncoder = null;
        if (audioBuffer) {
          try {
            audioEncoder = new AudioEncoder({
              output: (chunk, metadata) => muxer.addAudioChunk(chunk, metadata),
              error: (e) => {
                console.error("AudioEncoder 發生錯誤:", e);
              }
            });
            audioEncoder.configure({
              codec: 'mp4a.40.2',
              numberOfChannels: Math.min(2, audioBuffer.numberOfChannels),
              sampleRate: audioBuffer.sampleRate,
              bitrate: 64000
            });
          } catch (err) {
            console.warn("瀏覽器不支援 AAC 音訊編碼，改為無聲壓縮:", err);
            audioEncoder = null;
          }
        }
        
        let currentTime = 0;
        video.pause();
        
        while (currentTime < duration) {
          video.currentTime = currentTime;
          await new Promise(res => {
            video.onseeked = () => res();
          });
          
          const timestampUs = Math.round(currentTime * 1000000);
          const frame = new VideoFrame(video, { timestamp: timestampUs });
          
          videoEncoder.encode(frame);
          frame.close();
          
          currentTime += interval;
          if (progressCallback) {
            const percent = Math.min(80, Math.round((currentTime / duration) * 80));
            progressCallback(percent);
          }
        }
        
        await videoEncoder.flush();
        videoEncoder.close();
        
        if (audioBuffer && audioEncoder) {
          const sampleRate = audioBuffer.sampleRate;
          const channels = Math.min(2, audioBuffer.numberOfChannels);
          const length = audioBuffer.length;
          const chunkSize = 1024;
          let offset = 0;
          
          while (offset < length) {
            const currentChunkSize = Math.min(chunkSize, length - offset);
            const audioDataBuffer = new Float32Array(channels * currentChunkSize);
            
            for (let c = 0; c < channels; c++) {
              const channelData = audioBuffer.getChannelData(c);
              const subarray = channelData.subarray(offset, offset + currentChunkSize);
              audioDataBuffer.set(subarray, c * currentChunkSize);
            }
            
            const timestampUs = Math.round((offset / sampleRate) * 1000000);
            const audioFrame = new AudioData({
              format: 'f32-planar',
              sampleRate: sampleRate,
              numberOfFrames: currentChunkSize,
              numberOfChannels: channels,
              timestamp: timestampUs,
              data: audioDataBuffer
            });
            
            audioEncoder.encode(audioFrame);
            audioFrame.close();
            
            offset += currentChunkSize;
            if (progressCallback) {
              const percent = 80 + Math.min(18, Math.round((offset / length) * 18));
              progressCallback(percent);
            }
          }
          
          await audioEncoder.flush();
          audioEncoder.close();
        }
        
        muxer.finalize();
        
        const { buffer } = muxer.target;
        const compressedBlob = new Blob([buffer], { type: 'video/mp4' });
        
        if (progressCallback) progressCallback(100);
        resolve(compressedBlob);
        
      } catch (err) {
        console.error("影片壓縮失敗:", err);
        reject(err);
      } finally {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      }
    });
  }

  handleVideoUpload(file) {
    const now = Date.now();
    if (this.lastVideoUploadTime && now - this.lastVideoUploadTime < 2000) {
      this.showNotification('提示', '上傳頻率太快，請稍候再試...');
      return;
    }
    this.lastVideoUploadTime = now;

    if (this.isUploadingVideo) {
      this.showNotification('提示', '影片上傳中，請稍候...');
      return;
    }

    if (!file.type.startsWith('video/')) {
      this.showNotification('提示', '請上傳影片檔案（MP4、WebM 等）');
      return;
    }

    const isWebCodecsSupported = typeof VideoEncoder !== 'undefined' && typeof AudioEncoder !== 'undefined';
    
    if (isWebCodecsSupported) {
      if (file.size > 100 * 1024 * 1024) {
        this.showNotification('提示', '本地影片最大限制為 100MB！');
        return;
      }
    } else {
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('提示', '您的瀏覽器不支援影片壓縮，直接上傳大小不能超過 5MB！');
        return;
      }
    }

    this.isUploadingVideo = true;

    const startUpload = (uploadFile) => {
      this.showNotification('提示', '正在上傳影片...');

      const base64UploadFallback = () => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.onerror = () => reject(new Error('讀取檔案失敗'));
          reader.readAsDataURL(uploadFile);
        }).then(dataUrl => {
          return this.videoRef.push({
            url: dataUrl,
            user: '匿名',
            filename: file.name,
            timestamp: Date.now(),
            type: 'upload'
          });
        });
      };

      const tryStorageUpload = () => {
        return new Promise((resolve, reject) => {
          if (typeof storage === 'undefined' || !storage) {
            return reject(new Error('Storage not initialized'));
          }
          const fileRef = storage.ref().child('videos/' + Date.now() + '_' + file.name);
          fileRef.put(uploadFile).then((snapshot) => {
            return snapshot.ref.getDownloadURL();
          }).then((downloadURL) => {
            return this.videoRef.push({ 
              url: downloadURL, 
              user: '匿名', 
              filename: file.name, 
              timestamp: Date.now(),
              type: 'upload'
            });
          }).then(resolve).catch(reject);
        });
      };

      tryStorageUpload()
        .then(() => {
          this.showNotification('成功', '影片上傳成功！');
          this.isUploadingVideo = false;
        })
        .catch((error) => {
          console.warn('Firebase Storage 上傳影片失敗，啟用本地 Base64 備用方案:', error);
          this.showNotification('提示', '正在將影片轉換為 Base64 並寫入資料庫...');
          base64UploadFallback()
            .then(() => {
              this.showNotification('成功', '影片上傳成功！');
              this.isUploadingVideo = false;
            })
            .catch((err) => {
              console.error('備用影片上傳失敗:', err);
              this.showNotification('錯誤', '影片上傳失敗，請稍後再試');
              this.isUploadingVideo = false;
            });
        });
    };

    if (isWebCodecsSupported) {
      this.showNotification('提示', '正在準備壓縮影片，請稍候...');
      
      const updateProgressNotification = (percent) => {
        this.showNotification('提示', `🎬 正在壓縮影片中... ${percent}%`);
      };

      this.compressVideo(file, updateProgressNotification)
        .then(compressedBlob => {
          console.log(`Original: ${file.size} bytes, Compressed: ${compressedBlob.size} bytes`);
          if (compressedBlob.size > 5 * 1024 * 1024) {
            this.showNotification('提示', `影片壓縮後大小為 ${(compressedBlob.size / 1024 / 1024).toFixed(1)}MB (超過 5MB)，請使用較短的影片。`);
            this.isUploadingVideo = false;
            return;
          }
          const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + "_compressed.mp4", { type: 'video/mp4' });
          startUpload(compressedFile);
        })
        .catch(err => {
          console.error("Compression failed, fallback to original upload:", err);
          this.showNotification('提示', '影片壓縮失敗，嘗試直接上傳原始檔案...');
          if (file.size > 5 * 1024 * 1024) {
            this.showNotification('提示', '原始影片大小超過 5MB，無法上傳！');
            this.isUploadingVideo = false;
            return;
          }
          startUpload(file);
        });
    } else {
      startUpload(file);
    }
  }

  submitVideoLink() {
    const input = document.getElementById('videoLinkInput');
    if (!input) return;
    const url = input.value.trim();
    if (!url) {
      this.showNotification('提示', '請輸入影片網址');
      return;
    }

    const now = Date.now();
    if (this.lastVideoUploadTime && now - this.lastVideoUploadTime < 2000) {
      this.showNotification('提示', '操作頻率太快，請稍候再試...');
      return;
    }
    this.lastVideoUploadTime = now;

    let ytId = null;
    let type = '';
    
    const ytReg1 = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match1 = url.match(ytReg1);
    if (match1) {
      ytId = match1[1];
      type = 'youtube';
    } else if (url.includes('drive.google.com')) {
      type = 'drive';
    } else {
      type = 'external';
    }

    if (type === 'external' && !url.startsWith('http')) {
      this.showNotification('提示', '請輸入正確的網址連結');
      return;
    }

    let filename = '分享影片';
    if (type === 'youtube') {
      filename = `YouTube 影片 (${ytId})`;
    } else if (type === 'drive') {
      filename = 'Google Drive 共享影片';
    } else {
      filename = '外部影片連結';
    }

    this.videoRef.push({
      url: url,
      user: '匿名',
      filename: filename,
      timestamp: Date.now(),
      type: type,
      youtubeId: ytId || null
    }).then(() => {
      input.value = '';
      this.showNotification('成功', '影片連結分享成功！');
    }).catch(err => {
      this.showNotification('錯誤', '分享失敗: ' + err.message);
    });
  }
  
  renderImages() {
    const imagePreview = document.getElementById('imagePreview');
    const imagesGroupedContainer = document.getElementById('imagesGroupedContainer');
    if (!imagePreview || !imagesGroupedContainer) return;
    
    if (this.images.length === 0) {
      imagesGroupedContainer.innerHTML = '';
      imagePreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無圖片</div>';
      return;
    }

    const renderImageItemHtml = (img) => `
      <div class="preview-item-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 12px; border: 1px solid var(--border-color);">
        <div class="preview-item" data-id="${img.id}" data-url="${img.url}" data-user="${this.escapeHtml(img.user)}" data-filename="${this.escapeHtml(img.filename)}" style="cursor: pointer; margin: 0;">
          <img src="${img.url}" alt="${img.filename}">
        </div>
        <div class="reactions-bar" style="margin-top: 0; justify-content: center; gap: 4px;">
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'like')" style="min-width: 32px; padding: 2px 6px;" title="讚">
            <span class="reaction-emoji" style="font-size: 11px;">👍</span>
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.like || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'love')" style="min-width: 32px; padding: 2px 6px;" title="愛心">
            <span class="reaction-emoji" style="font-size: 11px;">❤️</span>
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.love || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'laugh')" style="min-width: 32px; padding: 2px 6px;" title="大笑">
            <span class="reaction-emoji" style="font-size: 11px;">😆</span>
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.laugh || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToImage('${img.id}', 'wow')" style="min-width: 32px; padding: 2px 6px;" title="驚訝">
            <span class="reaction-emoji" style="font-size: 11px;">😮</span>
            <span class="reaction-count" style="font-size: 9px;">${img.reactions?.wow || 0}</span>
          </button>
        </div>
      </div>
    `;

    // 1. Grouped Folders (takes full rows)
    let groupedHtml = '';
    this.imageFolders.forEach(f => {
      const folderImages = this.images.filter(img => img.folderId === f.id);
      if (folderImages.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        groupedHtml += `
          <div class="folder-group-row" style="margin-bottom: 16px; border-left: 6px solid #af52de; background: var(--bg-card); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow: hidden; width: 100%;">
            <div class="folder-group-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="padding: 14px 20px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: bold; color: var(--text-primary);">
              <span style="font-size: 15px; display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderImages.length} 張圖片)</span>
              </span>
              <button class="folder-toggle-btn" style="background: transparent; border: none; font-size: 13px; font-weight: bold; color: var(--accent-color); cursor: pointer;">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <div class="folder-group-content" style="display: ${isCollapsed ? 'none' : 'block'}; padding: 16px 20px; background: var(--bg-card);">
              <div class="image-preview" style="margin: 0; padding: 0;">
                ${folderImages.map(img => renderImageItemHtml(img)).join('')}
              </div>
            </div>
          </div>
        `;
      }
    });
    imagesGroupedContainer.innerHTML = groupedHtml;
    
    // 2. Unassigned Images
    const unassignedImages = this.images.filter(img => {
      if (!img.folderId) return true;
      return !this.imageFolders.some(f => f.id === img.folderId);
    });
    
    if (unassignedImages.length > 0) {
      imagePreview.innerHTML = unassignedImages.map(img => renderImageItemHtml(img)).join('');
    } else {
      imagePreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無未分類圖片</div>';
    }
    
    // Bind click events
    document.querySelectorAll('.panel-body .preview-item').forEach(item => {
      item.addEventListener('click', () => {
        this.showImageModal(item.dataset.id);
      });
    });
    
    // Reactively update active image modal reactions
    this.updateActiveImageModal();
  }

  renderVideos() {
    const videoPreview = document.getElementById('videoPreview');
    const videosGroupedContainer = document.getElementById('videosGroupedContainer');
    if (!videoPreview || !videosGroupedContainer) return;
    
    if (this.videos.length === 0) {
      videosGroupedContainer.innerHTML = '';
      videoPreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無影片</div>';
      return;
    }

    const getThumbnailUrl = (vid) => {
      if (vid.type === 'youtube' && vid.youtubeId) {
        return `https://img.youtube.com/vi/${vid.youtubeId}/0.jpg`;
      }
      return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><rect width='100%' height='100%' fill='%232c2c2e'/><path d='M35,45 L75,45 L75,85 L35,85 Z M80,50 L105,35 L105,95 L80,80 Z' fill='%238e8e93' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>`;
    };

    const renderVideoItemHtml = (vid) => `
      <div class="preview-item-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 12px; border: 1px solid var(--border-color);">
        <div class="preview-item video-item" data-id="${vid.id}" style="cursor: pointer; margin: 0; position: relative;">
          <img src="${getThumbnailUrl(vid)}" alt="${vid.filename}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 10px; border: 2px solid var(--border-color);">
          <div style="position: absolute; bottom: 4px; left: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; font-size: 10px; padding: 2px 4px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">
            ${this.escapeHtml(vid.filename)}
          </div>
        </div>
        <div class="reactions-bar" style="margin-top: 0; justify-content: center; gap: 4px; width: 100%; flex-wrap: wrap;">
          <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'like')" style="min-width: 28px; padding: 2px 4px;" title="讚">
            <span class="reaction-emoji" style="font-size: 10px;">👍</span>
            <span class="reaction-count" style="font-size: 8px;">${vid.reactions?.like || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'love')" style="min-width: 28px; padding: 2px 4px;" title="愛心">
            <span class="reaction-emoji" style="font-size: 10px;">❤️</span>
            <span class="reaction-count" style="font-size: 8px;">${vid.reactions?.love || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'laugh')" style="min-width: 28px; padding: 2px 4px;" title="大笑">
            <span class="reaction-emoji" style="font-size: 10px;">😆</span>
            <span class="reaction-count" style="font-size: 8px;">${vid.reactions?.laugh || 0}</span>
          </button>
          <button class="reaction-btn" onclick="reactToVideo('${vid.id}', 'wow')" style="min-width: 28px; padding: 2px 4px;" title="驚訝">
            <span class="reaction-emoji" style="font-size: 10px;">😮</span>
            <span class="reaction-count" style="font-size: 8px;">${vid.reactions?.wow || 0}</span>
          </button>
        </div>
      </div>
    `;

    // 1. Grouped Folders
    let groupedHtml = '';
    this.videoFolders.forEach(f => {
      const folderVideos = this.videos.filter(vid => vid.folderId === f.id);
      if (folderVideos.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        groupedHtml += `
          <div class="folder-group-row" style="margin-bottom: 16px; border-left: 6px solid #34c759; background: var(--bg-card); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow: hidden; width: 100%;">
            <div class="folder-group-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="padding: 14px 20px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: bold; color: var(--text-primary);">
              <span style="font-size: 15px; display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderVideos.length} 個影片)</span>
              </span>
              <button class="folder-toggle-btn" style="background: transparent; border: none; font-size: 13px; font-weight: bold; color: var(--accent-color); cursor: pointer;">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <div class="folder-group-content" style="display: ${isCollapsed ? 'none' : 'block'}; padding: 16px 20px; background: var(--bg-card);">
              <div class="image-preview" style="margin: 0; padding: 0;">
                ${folderVideos.map(vid => renderVideoItemHtml(vid)).join('')}
              </div>
            </div>
          </div>
        `;
      }
    });
    videosGroupedContainer.innerHTML = groupedHtml;
    
    // 2. Unassigned Videos
    const unassignedVideos = this.videos.filter(vid => {
      if (!vid.folderId) return true;
      return !this.videoFolders.some(f => f.id === vid.folderId);
    });
    
    if (unassignedVideos.length > 0) {
      videoPreview.innerHTML = unassignedVideos.map(vid => renderVideoItemHtml(vid)).join('');
    } else {
      videoPreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無未分類影片</div>';
    }
    
    // Bind click events for all video preview items
    document.querySelectorAll('#panel-videos .preview-item').forEach(item => {
      item.addEventListener('click', () => {
        this.showVideoModal(item.dataset.id);
      });
    });
    
    this.updateActiveVideoModal();
  }
  
  renderAdminQuestions() {
    const adminQuestionList = document.getElementById('adminQuestionList');
    const adminQuestionsGroupedContainer = document.getElementById('adminQuestionsGroupedContainer');
    if (!adminQuestionList || !adminQuestionsGroupedContainer) return;

    if (this.questions.length === 0) {
      adminQuestionsGroupedContainer.innerHTML = '';
      adminQuestionList.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 20px; width: 100%;">暫無問題</li>';
      return;
    }
    
    const total = this.questions.length;
    
    const renderQuestionItemHtml = (q, idx) => `
      <li class="question-item card-style admin-card" style="border-left-color: var(--danger-color); cursor: default; flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
          <input type="checkbox" class="admin-select-question" value="${q.id}" onchange="window.app.updateBatchSelectCount()" style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0; margin-top: 4px; margin-right: 12px;">
          
          <div style="flex: 1; min-width: 0;">
            <div class="question-card-header">
              <div class="header-left">
                <span class="question-badge admin-badge">#${total - idx}</span>
                <span class="user" style="color: var(--danger-color);">${this.escapeHtml(q.user)}</span>
              </div>
              <span class="time">${this.formatTime(q.timestamp)}</span>
            </div>
            <div class="text">${this.linkify(q.text)}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: 12px;">
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
    `;

    // 1. Grouped Folders
    let groupedHtml = '';
    this.questionFolders.forEach(f => {
      const folderQuestions = this.questions.filter(q => q.folderId === f.id);
      if (folderQuestions.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        groupedHtml += `
          <div class="folder-group-row" style="margin-bottom: 16px; border-left: 6px solid #ff9500; background: var(--bg-card); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow: hidden; width: 100%;">
            <div class="folder-group-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="padding: 14px 20px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: bold; color: var(--text-primary);">
              <span style="font-size: 15px; display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderQuestions.length} 個提問)</span>
              </span>
              <button class="folder-toggle-btn" style="background: transparent; border: none; font-size: 13px; font-weight: bold; color: var(--accent-color); cursor: pointer;">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <div class="folder-group-content" style="display: ${isCollapsed ? 'none' : 'block'}; padding: 16px 20px; background: var(--bg-card);">
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-bottom: 10px; width: 100%;">
                <label style="font-size: 12px; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 4px; user-select: none;">
                  <input type="checkbox" class="folder-select-all-checkbox-${f.id}" onchange="window.app.toggleSelectAllFolderQuestions('${f.id}', this.checked)" style="width: 14px; height: 14px; margin: 0;"> 全選群組提問
                </label>
                <button onclick="window.app.deleteSelectedFolderQuestions('${f.id}')" style="
                  background: var(--danger-color); color: white; border: none;
                  padding: 4px 8px; border-radius: 6px; font-size: 11px;
                  cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;
                ">🗑️ 刪除所選</button>
              </div>
              <ul class="question-list folder-questions-${f.id}" style="margin: 0; padding: 0; list-style: none;">
                ${folderQuestions.map(q => {
                  const idx = this.questions.indexOf(q);
                  return renderQuestionItemHtml(q, idx);
                }).join('')}
              </ul>
            </div>
          </div>
        `;
      }
    });
    adminQuestionsGroupedContainer.innerHTML = groupedHtml;
    
    // 2. Unassigned Questions
    const unassignedQuestions = this.questions.filter(q => {
      if (!q.folderId) return true;
      return !this.questionFolders.some(f => f.id === q.folderId);
    });
    
    let ungroupedHtml = '';
    if (unassignedQuestions.length > 0) {
      ungroupedHtml = unassignedQuestions.map(q => {
        const idx = this.questions.indexOf(q);
        return renderQuestionItemHtml(q, idx);
      }).join('');
    } else {
      ungroupedHtml = '<li style="text-align: center; color: var(--text-muted); padding: 20px; width: 100%;">暫無未分類提問</li>';
    }
    adminQuestionList.innerHTML = ungroupedHtml;
    
    // Bind click events on all admin cards to toggle checkbox selection
    document.querySelectorAll('#adminQuestionList .admin-card, #adminQuestionsGroupedContainer .admin-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input[type="checkbox"]')) {
          return;
        }
        const checkbox = card.querySelector('.admin-select-question');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          window.app.updateBatchSelectCount();
        }
      });
    });
  }

  renderAdminImages() {
    const adminImagePreview = document.getElementById('adminImagePreview');
    const adminImagesGroupedContainer = document.getElementById('adminImagesGroupedContainer');
    if (!adminImagePreview || !adminImagesGroupedContainer) return;
    
    if (this.images.length === 0) {
      adminImagesGroupedContainer.innerHTML = '';
      adminImagePreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無圖片</div>';
      return;
    }

    const renderImageItemHtml = (img) => `
      <div class="preview-item-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 6px; background: var(--bg-card); padding: 8px; border-radius: 12px; border: 1px solid var(--border-color); position: relative; margin-bottom: 12px;">
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
        
        <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; cursor: pointer; margin-top: 2px; user-select: none;">
          <input type="checkbox" class="admin-select-image" value="${img.id}" onchange="window.app.updateBatchSelectCount()" style="width: 14px; height: 14px; margin: 0;">
          <span>選取</span>
        </label>
        
        <div style="font-size: 10px; color: var(--text-secondary); display: flex; gap: 6px; justify-content: center; width: 100%;">
          <span>👍 ${img.reactions?.like || 0}</span>
          <span>❤️ ${img.reactions?.love || 0}</span>
          <span>😆 ${img.reactions?.laugh || 0}</span>
          <span>😮 ${img.reactions?.wow || 0}</span>
        </div>
      </div>
    `;

    // 1. Grouped Folders
    let groupedHtml = '';
    this.imageFolders.forEach(f => {
      const folderImages = this.images.filter(img => img.folderId === f.id);
      if (folderImages.length > 0) {
        const isCollapsed = this.isFolderCollapsed(f.id);
        groupedHtml += `
          <div class="folder-group-row" style="margin-bottom: 16px; border-left: 6px solid #af52de; background: var(--bg-card); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); overflow: hidden; width: 100%;">
            <div class="folder-group-header" onclick="window.app.toggleFolderCollapse('${f.id}')" style="padding: 14px 20px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; font-weight: bold; color: var(--text-primary);">
              <span style="font-size: 15px; display: flex; align-items: center; gap: 6px;">
                📁 ${this.escapeHtml(f.name)} 
                <span style="font-size: 12px; font-weight: normal; color: var(--text-secondary);">(${folderImages.length} 張圖片)</span>
              </span>
              <button class="folder-toggle-btn" style="background: transparent; border: none; font-size: 13px; font-weight: bold; color: var(--accent-color); cursor: pointer;">${isCollapsed ? '▶ 展開' : '▼ 折疊'}</button>
            </div>
            <div class="folder-group-content" style="display: ${isCollapsed ? 'none' : 'block'}; padding: 16px 20px; background: var(--bg-card);">
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-bottom: 10px; width: 100%;">
                <label style="font-size: 12px; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 4px; user-select: none;">
                  <input type="checkbox" class="folder-select-all-checkbox-${f.id}" onchange="window.app.toggleSelectAllFolderImages('${f.id}', this.checked)" style="width: 14px; height: 14px; margin: 0;"> 全選群組圖片
                </label>
                <button onclick="window.app.deleteSelectedFolderImages('${f.id}')" style="
                  background: var(--danger-color); color: white; border: none;
                  padding: 4px 8px; border-radius: 6px; font-size: 11px;
                  cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;
                ">🗑️ 刪除所選</button>
              </div>
              <div class="image-preview folder-images-${f.id}" style="margin: 0; padding: 0;">
                ${folderImages.map(img => renderImageItemHtml(img)).join('')}
              </div>
            </div>
          </div>
        `;
      }
    });
    adminImagesGroupedContainer.innerHTML = groupedHtml;
    
    // 2. Unassigned Images
    const unassignedImages = this.images.filter(img => {
      if (!img.folderId) return true;
      return !this.imageFolders.some(f => f.id === img.folderId);
    });
    
    if (unassignedImages.length > 0) {
      adminImagePreview.innerHTML = unassignedImages.map(img => renderImageItemHtml(img)).join('');
    } else {
      adminImagePreview.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 20px;">暫無未分類圖片</div>';
    }
    
    // Bind click events on all admin image wrappers to toggle checkbox selection
    document.querySelectorAll('#adminImagePreview .preview-item-wrapper, #adminImagesGroupedContainer .preview-item-wrapper').forEach(wrapper => {
      wrapper.style.cursor = 'pointer';
      wrapper.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('input[type="checkbox"]')) {
          return;
        }
        const checkbox = wrapper.querySelector('.admin-select-image');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          window.app.updateBatchSelectCount();
        }
      });
    });
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
        
        // 同步音樂來源
        this.updateMusicSource(data.musicUrl || 'https://www.youtube.com/watch?v=MnhXZRw_ATU');
        
        // Sync inputs in admin if not active focus
        const minsInput = document.getElementById('timerMinutes');
        const styleInput = document.getElementById('timerStyle');
        if (minsInput && document.activeElement !== minsInput) {
          minsInput.value = Math.round((data.duration || 600) / 60);
        }
        if (styleInput) {
          styleInput.value = data.style;
        }
        
        if (this.isAdmin) {
          const musicSelect = document.getElementById('timerMusicSelect');
          const customUrlInput = document.getElementById('timerMusicCustomUrl');
          const customWrapper = document.getElementById('customMusicInputWrapper');
          
          if (musicSelect && data.musicUrl) {
            const presetExists = Array.from(musicSelect.options).some(opt => opt.value === data.musicUrl);
            if (presetExists) {
              musicSelect.value = data.musicUrl;
              if (customWrapper) customWrapper.style.display = 'none';
            } else {
              musicSelect.value = 'custom';
              if (customWrapper) customWrapper.style.display = 'flex';
              if (customUrlInput && document.activeElement !== customUrlInput) {
                customUrlInput.value = data.musicUrl;
              }
            }
          }
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
      
      const musicSelect = document.getElementById('timerMusicSelect');
      let musicUrl = 'https://www.youtube.com/watch?v=MnhXZRw_ATU'; // Default Canon
      if (musicSelect) {
        if (musicSelect.value === 'custom') {
          const customInput = document.getElementById('timerMusicCustomUrl');
          if (customInput && customInput.value.trim() !== '') {
            musicUrl = customInput.value.trim();
          }
        } else {
          musicUrl = musicSelect.value;
        }
      }
      
      this.timerRef.set({
        duration: duration,
        endTime: Date.now() + duration * 1000,
        isActive: true,
        isPaused: false,
        remainingTime: duration,
        style: style,
        musicUrl: musicUrl
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
        height: '200',
        width: '200',
        videoId: this.currentVideoId || 'MnhXZRw_ATU',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: () => {
            this.ytPlayersReady = true;
            this.applyMuteState();
            if (this.pendingMusicUrl) {
              this.updateMusicSource(this.pendingMusicUrl);
              this.pendingMusicUrl = null;
            }
          },
          onStateChange: (event) => {
            // Loop video: when ended, seek to start time and play
            if (event.data === YT.PlayerState.ENDED) {
              if (this.playerCanon && typeof this.playerCanon.seekTo === 'function') {
                this.playerCanon.seekTo(this.currentVideoStart || 0, true);
                this.playerCanon.playVideo();
              }
            }
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize YouTube players:", e);
    }
  }

  parseYoutubeUrl(url) {
    if (!url) return { videoId: 'MnhXZRw_ATU', startTime: 0 };
    
    let videoId = 'MnhXZRw_ATU';
    let startTime = 0;
    
    try {
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else if (url.includes('v=')) {
        const parts = url.split('v=');
        if (parts[1]) {
          videoId = parts[1].split('&')[0].split('#')[0];
        }
      } else if (url.includes('embed/')) {
        const parts = url.split('embed/');
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else if (url.trim().length === 11) {
        videoId = url.trim();
      }
      
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      const searchParams = urlObj.searchParams;
      let t = searchParams.get('t') || searchParams.get('start') || '';
      
      if (!t && urlObj.hash && urlObj.hash.includes('t=')) {
        t = urlObj.hash.split('t=')[1].split('&')[0];
      }
      
      if (t) {
        if (t.includes('m') || t.includes('s')) {
          let mins = 0;
          let secs = 0;
          if (t.includes('m')) {
            const splitMin = t.split('m');
            mins = parseInt(splitMin[0]) || 0;
            t = splitMin[1] || '';
          }
          if (t.includes('s')) {
            secs = parseInt(t.split('s')[0]) || 0;
          } else {
            secs = parseInt(t) || 0;
          }
          startTime = mins * 60 + secs;
        } else {
          startTime = parseInt(t) || 0;
        }
      }
    } catch (e) {
      console.error("Error parsing YouTube URL:", e);
    }
    
    return { videoId, startTime };
  }

  updateMusicSource(url) {
    if (!this.ytPlayersReady) {
      this.pendingMusicUrl = url;
      return;
    }
    
    const { videoId, startTime } = this.parseYoutubeUrl(url);
    if (this.currentVideoId === videoId && this.currentVideoStart === startTime) {
      return;
    }
    
    this.currentVideoId = videoId;
    this.currentVideoStart = startTime;
    
    if (this.playerCanon) {
      try {
        if (this.currentAudioPlaying === 'canon') {
          if (typeof this.playerCanon.loadVideoById === 'function') {
            this.playerCanon.loadVideoById({
              videoId: videoId,
              startSeconds: startTime
            });
            return;
          }
        }
        
        if (typeof this.playerCanon.cueVideoById === 'function') {
          this.playerCanon.cueVideoById({
            videoId: videoId,
            startSeconds: startTime
          });
        }
      } catch (e) {
        console.error("Error updating music source:", e);
      }
    }
  }

  onTimerMusicSelectChange(val) {
    const customWrapper = document.getElementById('customMusicInputWrapper');
    if (val === 'custom') {
      if (customWrapper) customWrapper.style.display = 'flex';
      const customInput = document.getElementById('timerMusicCustomUrl');
      if (customInput && customInput.value.trim() !== '') {
        this.updateMusicSource(customInput.value.trim());
      }
    } else {
      if (customWrapper) customWrapper.style.display = 'none';
      this.updateMusicSource(val);
    }
  }

  playAudio(track) {
    try {
      if (track === 'canon') {
        this.currentAudioPlaying = 'canon';
        if (this.ytPlayersReady && this.playerCanon && typeof this.playerCanon.playVideo === 'function') {
          if (typeof this.playerCanon.setVolume === 'function') {
            this.playerCanon.setVolume(100);
          }
          
          if (this.currentVideoStart > 0 && typeof this.playerCanon.seekTo === 'function') {
            this.playerCanon.seekTo(this.currentVideoStart, true);
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
      db.ref('videos').once('value'),
      db.ref('quiz').once('value'),
      db.ref('whiteboard').once('value')
    ]).then(([questionsSnap, imagesSnap, videosSnap, quizSnap, whiteboardSnap]) => {
      const quizData = quizSnap.val() || {};
      
      const exportData = {
        questions: questionsSnap.val() || {},
        images: imagesSnap.val() || {},
        videos: videosSnap.val() || {},
        whiteboard: whiteboardSnap.val() || {},
        quiz: {
          current: quizData.current || null,
          answers: quizData.answers || null,
          timer: quizData.timer || null,
          questionFolders: quizData.questionFolders || null,
          imageFolders: quizData.imageFolders || null,
          videoFolders: quizData.videoFolders || null
        },
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
        if (!importedData.questions && !importedData.images && !importedData.videos && !importedData.quiz && !importedData.whiteboard) {
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
            promises.push(db.ref('whiteboard').set(importedData.whiteboard || null));
            promises.push(db.ref('quiz/broadcastVideo').remove()); // Reset broadcast state
            
            // Write images sequentially to prevent WebSocket connection frame overflow & disconnects
            const writeImagesSequentially = async () => {
              await db.ref('images').remove();
              const imagesObj = importedData.images || {};
              const keys = Object.keys(imagesObj);
              for (const imgId of keys) {
                await db.ref(`images/${imgId}`).set(imagesObj[imgId]);
              }
            };
            promises.push(writeImagesSequentially());

            // Write videos sequentially
            const writeVideosSequentially = async () => {
              await db.ref('videos').remove();
              const videosObj = importedData.videos || {};
              const keys = Object.keys(videosObj);
              for (const vidId of keys) {
                await db.ref(`videos/${vidId}`).set(videosObj[vidId]);
              }
            };
            promises.push(writeVideosSequentially());
            
            // Set subnodes of quiz explicitly (excluding presence to prevent connection issues)
            const quizNode = importedData.quiz || {};
            
            // Defensive check: If the imported file has no folders but the current database has folders, preserve them!
            let questionFolders = quizNode.questionFolders;
            if (!questionFolders && this.questionFolders && this.questionFolders.length > 0) {
              questionFolders = {};
              this.questionFolders.forEach(f => {
                questionFolders[f.id] = { name: f.name };
              });
            }
            
            let imageFolders = quizNode.imageFolders;
            if (!imageFolders && this.imageFolders && this.imageFolders.length > 0) {
              imageFolders = {};
              this.imageFolders.forEach(f => {
                imageFolders[f.id] = { name: f.name };
              });
            }

            let videoFolders = quizNode.videoFolders;
            if (!videoFolders && this.videoFolders && this.videoFolders.length > 0) {
              videoFolders = {};
              this.videoFolders.forEach(f => {
                videoFolders[f.id] = { name: f.name };
              });
            }
            
            promises.push(db.ref('quiz/current').set(quizNode.current || null));
            promises.push(db.ref('quiz/answers').set(quizNode.answers || null));
            promises.push(db.ref('quiz/timer').set(quizNode.timer || null));
            promises.push(db.ref('quiz/questionFolders').set(questionFolders || null));
            promises.push(db.ref('quiz/imageFolders').set(imageFolders || null));
            promises.push(db.ref('quiz/videoFolders').set(videoFolders || null));
            
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
  db.ref('videos').remove();
  db.ref('quiz/videoFolders').remove();
  db.ref('quiz/broadcastVideo').remove();
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

// 管理員刪除影片操作
function deleteVideo(id) {
  window.app.showConfirmModal(
    '🎥',
    '確定要刪除此影片嗎？',
    '此動作將永久刪除該影片，且無法復原。',
    () => {
      db.ref('videos').child(id).remove()
        .then(() => window.app.showNotification('成功', '已刪除影片！'))
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

function reactToVideo(id, type) {
  if (window.app) window.app.reactToVideo(id, type);
}

function assignVideoFolder(videoId, folderId) {
  if (window.app) window.app.assignVideoFolder(videoId, folderId);
}
