/**
 * 同步共編白板核心引擎 (Collaborative Whiteboard Engine)
 * 支援多白板、分頁、學生編輯權限控管、他人物件移動保護、作者姓名標籤、剪貼簿貼上文字便利貼/圖片、PDF 頁面解析選取插入與整齊排版。
 */

(function () {
  'use strict';

  // ===== 使用者身分與角色 =====
  const urlParams = new URLSearchParams(window.location.search);
  const parentApp = (window.parent && window.parent.app) || null;

  const isTeacher = (
    urlParams.get('role') === 'teacher' ||
    urlParams.get('isAdmin') === '1' ||
    (parentApp && parentApp.isAdmin) ||
    false
  );

  const persistentUid = (
    urlParams.get('uid') ||
    (parentApp && typeof parentApp.getUserId === 'function' && parentApp.getUserId()) ||
    localStorage.getItem('whiteboard_uid') ||
    sessionStorage.getItem('whiteboard_uid') ||
    ('u_' + Math.random().toString(36).substring(2, 9))
  );
  try {
    localStorage.setItem('whiteboard_uid', persistentUid);
    sessionStorage.setItem('whiteboard_uid', persistentUid);
  } catch (e) {}

  const myClientId = persistentUid;
  const myPresenceKey = isTeacher ? ('teacher_' + persistentUid) : ('student_' + persistentUid);

  const myName = (
    urlParams.get('name') ||
    (parentApp && typeof parentApp.getCurrentUserName === 'function' && parentApp.getCurrentUserName()) ||
    localStorage.getItem('user_nickname') ||
    localStorage.getItem('user_name') ||
    (isTeacher ? '老師' : '同學')
  ).trim();

  // ===== 狀態管理 =====
  const state = {
    activeCanvasId: 'main',
    activePageId: 'page_1',
    canvases: {
      main: { id: 'main', name: '主白板', pages: ['page_1'] }
    },
    objects: {}, // 當前頁面物件: { [id]: obj }
    settings: {
      studentCanEdit: true,
      canMoveOthers: true,
      followTeacher: true,
      showAuthorBadge: true,
      activeCanvasId: 'main',
      activePageId: 'page_1'
    },
    currentTool: 'select', // select, pen, rect, circle, arrow, sticky, hand, eraser
    currentColor: '#1e293b',
    currentStrokeWidth: 4,
    showAuthorBadge: true,
    view: { x: 0, y: 0, zoom: 1 },
    selectedObjId: null,
    isPanning: false,
    panStart: { x: 0, y: 0 },
    activeDrawing: null,
    onlineUsers: {}
  };

  // ===== DOM 參照 =====
  const els = {
    canvasViewport: document.getElementById('canvasViewport'),
    canvasWorld: document.getElementById('canvasWorld'),
    svgLayer: document.getElementById('svgLayer'),
    htmlLayer: document.getElementById('htmlLayer'),
    floatingToolbar: document.getElementById('floatingToolbar'),
    canvasSelect: document.getElementById('canvasSelect'),
    pagesTabs: document.getElementById('pagesTabs'),
    btnAddCanvas: document.getElementById('btnAddCanvas'),
    btnAddPage: document.getElementById('btnAddPage'),
    btnZoomIn: document.getElementById('btnZoomIn'),
    btnZoomOut: document.getElementById('btnZoomOut'),
    btnZoomReset: document.getElementById('btnZoomReset'),
    zoomVal: document.getElementById('zoomVal'),
    btnToggleStudentEdit: document.getElementById('btnToggleStudentEdit'),
    btnToggleMoveOthers: document.getElementById('btnToggleMoveOthers'),
    btnFollowMode: document.getElementById('btnFollowMode'),
    btnSummonAll: document.getElementById('btnSummonAll'),
    btnExport: document.getElementById('btnExport'),
    btnToggleDrawer: document.getElementById('btnToggleDrawer'),
    btnFullscreen: document.getElementById('btnFullscreen'),
    btnClearOrEnd: document.getElementById('btnClearOrEnd'),
    btnCloseWhiteboard: document.getElementById('btnCloseWhiteboard'),
    btnToggleAuthorBadge: document.getElementById('btnToggleAuthorBadge'),
    colorCurrentDot: document.getElementById('colorCurrentDot'),
    colorPalette: document.getElementById('colorPalette'),
    strokeSizeSelect: document.getElementById('strokeSizeSelect'),
    participantsDrawer: document.getElementById('participantsDrawer'),
    userCount: document.getElementById('userCount'),
    userList: document.getElementById('userList'),
    readonlyBanner: document.getElementById('readonlyBanner'),
    // Guide Modal
    btnHelpGuide: document.getElementById('btnHelpGuide'),
    guideModal: document.getElementById('guideModal'),
    btnCloseGuideModal: document.getElementById('btnCloseGuideModal'),
    btnConfirmGuide: document.getElementById('btnConfirmGuide'),
    // PDF Modal
    pdfModal: document.getElementById('pdfModal'),
    btnClosePdfModal: document.getElementById('btnClosePdfModal'),
    btnCancelPdf: document.getElementById('btnCancelPdf'),
    btnConfirmInsertPdf: document.getElementById('btnConfirmInsertPdf'),
    pdfTotalPages: document.getElementById('pdfTotalPages'),
    pdfSelectAll: document.getElementById('pdfSelectAll'),
    pdfSelectedBadge: document.getElementById('pdfSelectedBadge'),
    pdfThumbnailGrid: document.getElementById('pdfThumbnailGrid'),
    btnInsertPdf: document.getElementById('btnInsertPdf'),
    btnInsertImage: document.getElementById('btnInsertImage'),
    btnTrashCanvas: document.getElementById('btnTrashCanvas'),
    imageFileInput: document.getElementById('imageFileInput'),
    pdfFileInput: document.getElementById('pdfFileInput')
  };

  // ===== Firebase 資料庫參照 =====
  let db = (window.parent && window.parent.db) || (window.firebase && firebase.database ? firebase.database() : null);
  let roomRef = null;
  let objectsRef = null;

  function initFirebase() {
    if (!db && window.firebase && firebase.database) {
      try {
        db = firebase.database();
      } catch (e) {
        console.warn('Firebase init fallback:', e);
      }
    }
    if (!db) {
      console.warn('Firebase DB not available. Operating in local mode.');
      return;
    }

    roomRef = db.ref('whiteboard_v2');

    // 1. 同步全域設定 (權限、當前畫布、頁面)
    roomRef.child('settings').on('value', (snap) => {
      const val = snap.val();
      if (!val) return;
      Object.assign(state.settings, val);
      state.showAuthorBadge = state.settings.showAuthorBadge !== false;
      applySettingsUI();

      // 若啟用了「全班跟隨老師視角」且當前使用者是學生，強制切換到老師當前頁
      if (!isTeacher && state.settings.followTeacher) {
        if (state.settings.activeCanvasId && state.settings.activePageId) {
          if (state.activeCanvasId !== state.settings.activeCanvasId || state.activePageId !== state.settings.activePageId) {
            switchCanvasAndPage(state.settings.activeCanvasId, state.settings.activePageId, false);
          }
        }
      }
    });

    // 2. 同步畫布清單
    roomRef.child('canvases').on('value', (snap) => {
      const val = snap.val();
      if (!val) return;
      state.canvases = val;
      renderCanvasSelector();
      renderPagesTabs();
    });

    // 3. 同步一鍵召集全班事件
    roomRef.child('summon').on('value', (snap) => {
      const val = snap.val();
      if (!val || !val.ts) return;
      if (!isTeacher && (Date.now() - val.ts < 5000)) {
        switchCanvasAndPage(val.canvasId, val.pageId, false);
      }
    });

    // 4. 線上參與者 (Presence)
    const myPresenceRef = roomRef.child('presence').child(myPresenceKey);
    function updateMyPresence() {
      myPresenceRef.set({
        id: myPresenceKey,
        uid: persistentUid,
        name: myName,
        role: isTeacher ? 'teacher' : 'student',
        canvasId: state.activeCanvasId,
        pageId: state.activePageId,
        lastActive: firebase.database.ServerValue.TIMESTAMP
      });
    }
    updateMyPresence();
    myPresenceRef.onDisconnect().remove();

    // 每 40 秒定時發送心跳維護在線狀態
    setInterval(() => {
      if (roomRef) {
        myPresenceRef.child('lastActive').set(firebase.database.ServerValue.TIMESTAMP);
      }
    }, 40000);

    roomRef.child('presence').on('value', (snap) => {
      state.onlineUsers = snap.val() || {};
      renderParticipantsList();
    });

    // 綁定當前畫布頁面的即時物件監聽
    bindCurrentPageObjects();
  }

  function getPageKey(canvasId, pageId) {
    return `${canvasId || state.activeCanvasId}_${pageId || state.activePageId}`;
  }

  function bindCurrentPageObjects() {
    if (!roomRef) return;
    if (objectsRef) {
      objectsRef.off();
    }
    const pageKey = getPageKey();
    objectsRef = roomRef.child('pages').child(pageKey).child('objects');

    // 監聽單一物件新增/變更 (增量同步，極致省流)
    objectsRef.on('child_added', (snap) => {
      const obj = snap.val();
      if (!obj || !obj.id) return;
      state.objects[obj.id] = obj;
      renderObject(obj);
    });

    objectsRef.on('child_changed', (snap) => {
      const obj = snap.val();
      if (!obj || !obj.id) return;
      state.objects[obj.id] = obj;
      renderObject(obj);
    });

    objectsRef.on('child_removed', (snap) => {
      const obj = snap.val();
      const id = snap.key || (obj && obj.id);
      if (id && state.objects[id]) {
        delete state.objects[id];
        removeObjectDOM(id);
      }
    });
  }

  // ===== UI 控制與權限套用 =====
  function applySettingsUI() {
    // 學生可編輯開關
    if (els.btnToggleStudentEdit) {
      if (state.settings.studentCanEdit) {
        els.btnToggleStudentEdit.classList.add('is-active');
        els.btnToggleStudentEdit.classList.remove('is-inactive');
        els.btnToggleStudentEdit.innerHTML = '<span>🔒 學生可編輯</span>';
      } else {
        els.btnToggleStudentEdit.classList.remove('is-active');
        els.btnToggleStudentEdit.classList.add('is-inactive');
        els.btnToggleStudentEdit.innerHTML = '<span>🚫 學生唯讀</span>';
      }
    }

    // 可動他人物件開關
    if (els.btnToggleMoveOthers) {
      if (state.settings.canMoveOthers) {
        els.btnToggleMoveOthers.classList.add('is-active');
        els.btnToggleMoveOthers.classList.remove('is-inactive');
        els.btnToggleMoveOthers.innerHTML = '<span>👥 可動他人物件</span>';
      } else {
        els.btnToggleMoveOthers.classList.remove('is-active');
        els.btnToggleMoveOthers.classList.add('is-inactive');
        els.btnToggleMoveOthers.innerHTML = '<span>👤 僅限自己物件</span>';
      }
    }

    // 跟隨老師模式
    if (els.btnFollowMode) {
      if (state.settings.followTeacher) {
        els.btnFollowMode.innerHTML = '<span>🎯 全班跟隨</span>';
        els.btnFollowMode.style.color = 'var(--primary)';
        if (els.btnSummonAll) els.btnSummonAll.style.display = 'none';
      } else {
        els.btnFollowMode.innerHTML = '<span>🕊️ 自由分組</span>';
        els.btnFollowMode.style.color = '#0284c7';
        if (els.btnSummonAll && isTeacher) els.btnSummonAll.style.display = 'inline-flex';
      }
    }

    // 學生端非教師處理
    if (!isTeacher) {
      if (els.btnToggleStudentEdit) els.btnToggleStudentEdit.style.display = 'none';
      if (els.btnToggleMoveOthers) els.btnToggleMoveOthers.style.display = 'none';
      if (els.btnFollowMode) els.btnFollowMode.style.display = 'none';
      if (els.btnSummonAll) els.btnSummonAll.style.display = 'none';
      if (els.btnClearOrEnd) els.btnClearOrEnd.style.display = 'none';

      // 唯讀提示 Banner
      if (!state.settings.studentCanEdit) {
        els.readonlyBanner.style.display = 'block';
        disableDrawingTools(true);
      } else {
        els.readonlyBanner.style.display = 'none';
        disableDrawingTools(false);
      }
    }

    // 作者標籤切換按鈕狀態
    if (els.btnToggleAuthorBadge) {
      if (state.showAuthorBadge) {
        els.btnToggleAuthorBadge.classList.add('active');
      } else {
        els.btnToggleAuthorBadge.classList.remove('active');
      }
    }

    // 刷新畫布上所有作者標籤顯示
    updateAllAuthorBadgesVisibility();
  }

  function disableDrawingTools(disabled) {
    const tools = els.floatingToolbar.querySelectorAll('.tool-btn');
    tools.forEach(btn => {
      const tool = btn.dataset.tool;
      if (tool && tool !== 'select' && tool !== 'hand') {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.35' : '1';
        btn.style.pointerEvents = disabled ? 'none' : 'auto';
      }
    });
    if (disabled && state.currentTool !== 'select' && state.currentTool !== 'hand') {
      setTool('select');
    }
  }

  // ===== 畫布與頁面切換 =====
  function renderCanvasSelector() {
    els.canvasSelect.innerHTML = '';
    Object.keys(state.canvases).forEach(id => {
      const c = state.canvases[id];
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = c.name || id;
      if (id === state.activeCanvasId) opt.selected = true;
      els.canvasSelect.appendChild(opt);
    });
  }

  function renderPagesTabs() {
    const curCanvas = state.canvases[state.activeCanvasId] || { pages: ['page_1'] };
    els.pagesTabs.innerHTML = '';
    (curCanvas.pages || ['page_1']).forEach((pId, idx) => {
      const tab = document.createElement('div');
      tab.className = `page-tab-item ${pId === state.activePageId ? 'active' : ''}`;
      tab.dataset.page = pId;
      tab.textContent = `頁 ${idx + 1}`;
      tab.onclick = () => switchCanvasAndPage(state.activeCanvasId, pId, true);
      els.pagesTabs.appendChild(tab);
    });
  }

  function switchCanvasAndPage(canvasId, pageId, broadcast) {
    state.activeCanvasId = canvasId;
    state.activePageId = pageId;

    // 清空目前畫面 DOM
    state.objects = {};
    state.selectedObjId = null;
    els.svgLayer.innerHTML = `
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/>
        </marker>
      </defs>
    `;
    els.htmlLayer.innerHTML = '';

    renderCanvasSelector();
    renderPagesTabs();
    bindCurrentPageObjects();

    // 更新個人 Presence
    if (roomRef) {
      roomRef.child('presence').child(myPresenceKey).update({
        canvasId: state.activeCanvasId,
        pageId: state.activePageId,
        lastActive: firebase.database.ServerValue.TIMESTAMP
      });

      // 老師切換且開啟跟隨模式時，廣播給全班
      if (isTeacher && broadcast && state.settings.followTeacher) {
        roomRef.child('settings').update({
          activeCanvasId: state.activeCanvasId,
          activePageId: state.activePageId
        });
      }
    }
  }

  // ===== 參與者名單 (依「姓名 + 角色」去重，徹底解決重複出現問題) =====
  function renderParticipantsList() {
    const rawUsers = Object.values(state.onlineUsers || {});
    const now = Date.now();

    // 1. 過濾超過 2.5 分鐘未發送心跳的過期殘留節點
    const activeUsers = rawUsers.filter(u => {
      if (!u || !u.name) return false;
      if (u.lastActive && typeof u.lastActive === 'number' && (now - u.lastActive > 150000)) {
        return false;
      }
      return true;
    });

    // 2. 嚴格依「姓名 + 角色」去重，保證同一個人永不重複顯示
    const uniqueMap = new Map();
    activeUsers.forEach(u => {
      const trimmedName = (u.name || '').trim();
      if (!trimmedName) return;
      const key = `${u.role || 'student'}_${trimmedName}`;
      const isMe = (u.id === myPresenceKey || u.uid === persistentUid || trimmedName === myName);

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, { ...u, name: trimmedName, isMe });
      } else if (isMe) {
        uniqueMap.get(key).isMe = true;
      }
    });

    const deduplicatedUsers = Array.from(uniqueMap.values());
    els.userCount.textContent = deduplicatedUsers.length;
    els.userList.innerHTML = '';

    // 老師排在最前面，自己優先，其餘按姓名排序
    deduplicatedUsers.sort((a, b) => {
      if (a.role === 'teacher' && b.role !== 'teacher') return -1;
      if (a.role !== 'teacher' && b.role === 'teacher') return 1;
      if (a.isMe && !b.isMe) return -1;
      if (!a.isMe && b.isMe) return 1;
      return a.name.localeCompare(b.name, 'zh-Hant');
    });

    deduplicatedUsers.forEach(u => {
      const item = document.createElement('div');
      item.className = 'user-list-item';
      const roleBadgeClass = u.role === 'teacher' ? 'role-teacher' : 'role-student';
      const roleText = u.role === 'teacher' ? '老師' : '同學';

      item.innerHTML = `
        <div class="user-info-left">
          <div class="user-dot"></div>
          <span style="font-weight:600;">${escapeHtml(u.name)}${u.isMe ? ' (您)' : ''}</span>
        </div>
        <span class="user-role-badge ${roleBadgeClass}">${roleText}</span>
      `;
      els.userList.appendChild(item);
    });
  }

  // ===== 視角縮放與平移 (Pan & Zoom) =====
  function updateWorldTransform() {
    els.canvasWorld.style.transform = `translate(${state.view.x}px, ${state.view.y}px) scale(${state.view.zoom})`;
    els.zoomVal.textContent = Math.round(state.view.zoom * 100) + '%';
  }

  function zoomAt(targetZoom, clientX, clientY) {
    const rect = els.canvasViewport.getBoundingClientRect();
    const cx = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const cy = clientY !== undefined ? clientY - rect.top : rect.height / 2;

    const clamped = Math.max(0.2, Math.min(3.0, targetZoom));
    const factor = clamped / state.view.zoom;

    state.view.x = cx - (cx - state.view.x) * factor;
    state.view.y = cy - (cy - state.view.y) * factor;
    state.view.zoom = clamped;
    updateWorldTransform();
  }

  function resetView() {
    state.view.x = 0;
    state.view.y = 0;
    state.view.zoom = 1;
    updateWorldTransform();
  }

  // ===== 座標轉換 =====
  function screenToWorld(sx, sy) {
    const rect = els.canvasViewport.getBoundingClientRect();
    const vx = sx - rect.left;
    const vy = sy - rect.top;
    return {
      x: (vx - state.view.x) / state.view.zoom,
      y: (vy - state.view.y) / state.view.zoom
    };
  }

  // ===== 工具切換 =====
  function setTool(toolName) {
    state.currentTool = toolName;
    const btns = els.floatingToolbar.querySelectorAll('.tool-btn[data-tool]');
    btns.forEach(b => {
      if (b.dataset.tool === toolName) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    els.canvasViewport.className = 'grid-bg';
    if (toolName === 'select') els.canvasViewport.classList.add('cursor-select');
    else if (toolName === 'hand') els.canvasViewport.classList.add('cursor-grab');
    else if (toolName === 'eraser') els.canvasViewport.classList.add('cursor-eraser');
  }

  // ===== 權限檢查：是否可動該物件 =====
  function canModifyObject(obj) {
    if (isTeacher) return true;
    if (!state.settings.studentCanEdit) return false;
    if (state.settings.canMoveOthers) return true;
    // 嚴格模式：僅可動自己創建的物件
    return (obj.authorId === myClientId || obj.author === myName);
  }

  // ===== 物件渲染引擎 =====
  function renderObject(obj) {
    if (!obj || !obj.id) return;

    if (obj.type === 'sticky') {
      renderStickyNoteDOM(obj);
    } else if (obj.type === 'image') {
      renderImageDOM(obj);
    } else {
      renderSvgElement(obj);
    }
  }

  function removeObjectDOM(id) {
    const htmlEl = document.getElementById(`html_obj_${id}`);
    if (htmlEl) htmlEl.remove();
    const svgEl = document.getElementById(`svg_obj_${id}`);
    if (svgEl) svgEl.remove();
    const badgeEl = document.getElementById(`badge_obj_${id}`);
    if (badgeEl) badgeEl.remove();
  }

  function updateAllAuthorBadgesVisibility() {
    const badges = document.querySelectorAll('.obj-author-badge');
    badges.forEach(b => {
      b.style.display = state.showAuthorBadge ? 'block' : 'none';
    });
  }

  // 1. 便利貼渲染
  function renderStickyNoteDOM(obj) {
    let el = document.getElementById(`html_obj_${obj.id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `html_obj_${obj.id}`;
      el.className = 'board-sticky-note';
      els.htmlLayer.appendChild(el);
      bindObjectInteraction(el, obj);
    }

    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
    el.style.width = (obj.width || 200) + 'px';
    el.style.minHeight = (obj.height || 140) + 'px';
    if (obj.bg) el.style.background = obj.bg;

    // 作者標籤
    const badgeHtml = `<div class="obj-author-badge" id="badge_obj_${obj.id}" style="display:${state.showAuthorBadge ? 'block' : 'none'};">${escapeHtml(obj.author || '同學')}</div>`;

    // 內容自動連結化 (URL 自動轉超連結)
    const linkedText = formatTextWithLinks(obj.text || '');
    el.innerHTML = `
      ${badgeHtml}
      <div class="sticky-content" contenteditable="${canModifyObject(obj) ? 'true' : 'false'}" spellcheck="false">${linkedText}</div>
    `;

    // 綁定編輯完成即時同步
    const contentEl = el.querySelector('.sticky-content');
    contentEl.onblur = () => {
      const newText = contentEl.innerText.trim();
      if (newText !== obj.text) {
        obj.text = newText;
        pushObjectUpdate(obj);
      }
    };
  }

  // 2. 圖片與 PDF 頁面渲染
  function renderImageDOM(obj) {
    let el = document.getElementById(`html_obj_${obj.id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `html_obj_${obj.id}`;
      el.className = 'board-image-item';
      els.htmlLayer.appendChild(el);
      bindObjectInteraction(el, obj);
    }

    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
    el.style.width = (obj.width || 320) + 'px';
    el.style.height = (obj.height || 200) + 'px';

    const badgeHtml = `<div class="obj-author-badge" id="badge_obj_${obj.id}" style="display:${state.showAuthorBadge ? 'block' : 'none'};">${escapeHtml(obj.author || '同學')}</div>`;
    el.innerHTML = `
      ${badgeHtml}
      <img src="${obj.src}" alt="${escapeHtml(obj.title || '圖片')}" loading="lazy" />
    `;
  }

  // 3. SVG 筆劃、矩形、圓形、箭頭渲染
  function renderSvgElement(obj) {
    let el = document.getElementById(`svg_obj_${obj.id}`);
    if (!el) {
      if (obj.type === 'pen') el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      else if (obj.type === 'rect') el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      else if (obj.type === 'circle') el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      else if (obj.type === 'arrow') el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      el.id = `svg_obj_${obj.id}`;
      els.svgLayer.appendChild(el);
      bindSvgInteraction(el, obj);
    }

    if (obj.type === 'pen') {
      el.setAttribute('d', obj.d);
      el.setAttribute('stroke', obj.color || '#1e293b');
      el.setAttribute('stroke-width', obj.strokeWidth || 4);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
    } else if (obj.type === 'rect') {
      el.setAttribute('x', obj.x);
      el.setAttribute('y', obj.y);
      el.setAttribute('width', Math.max(1, obj.width));
      el.setAttribute('height', Math.max(1, obj.height));
      el.setAttribute('stroke', obj.color || '#1e293b');
      el.setAttribute('stroke-width', obj.strokeWidth || 3);
      el.setAttribute('fill', obj.fill || 'transparent');
      el.setAttribute('rx', '4');
    } else if (obj.type === 'circle') {
      el.setAttribute('cx', obj.cx);
      el.setAttribute('cy', obj.cy);
      el.setAttribute('rx', Math.max(1, obj.rx));
      el.setAttribute('ry', Math.max(1, obj.ry));
      el.setAttribute('stroke', obj.color || '#1e293b');
      el.setAttribute('stroke-width', obj.strokeWidth || 3);
      el.setAttribute('fill', obj.fill || 'transparent');
    } else if (obj.type === 'arrow') {
      el.setAttribute('x1', obj.x1);
      el.setAttribute('y1', obj.y1);
      el.setAttribute('x2', obj.x2);
      el.setAttribute('y2', obj.y2);
      el.setAttribute('stroke', obj.color || '#f97316');
      el.setAttribute('stroke-width', obj.strokeWidth || 4);
      el.setAttribute('marker-end', 'url(#arrowhead)');
    }

    // SVG 物件作者標籤 (置於起點上方)
    let badgeEl = document.getElementById(`badge_obj_${obj.id}`);
    if (!badgeEl) {
      badgeEl = document.createElement('div');
      badgeEl.id = `badge_obj_${obj.id}`;
      badgeEl.className = 'obj-author-badge';
      badgeEl.textContent = obj.author || '同學';
      els.htmlLayer.appendChild(badgeEl);
    }
    const bx = obj.x !== undefined ? obj.x : (obj.x1 !== undefined ? Math.min(obj.x1, obj.x2) : (obj.cx - (obj.rx || 0)));
    const by = obj.y !== undefined ? obj.y : (obj.y1 !== undefined ? Math.min(obj.y1, obj.y2) : (obj.cy - (obj.ry || 0)));
    badgeEl.style.left = bx + 'px';
    badgeEl.style.top = (by - 20) + 'px';
    badgeEl.style.display = state.showAuthorBadge ? 'block' : 'none';
  }

  // ===== 物件拖曳與點選互動 (DOM & SVG) =====
  function bindObjectInteraction(el, obj) {
    el.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'A' || e.target.classList.contains('sticky-content')) return;
      if (state.currentTool === 'eraser') {
        e.stopPropagation();
        deleteObject(obj.id);
        return;
      }
      if (state.currentTool !== 'select') return;

      if (!canModifyObject(obj)) {
        flashToast('⚠️ 老師已設定僅能移動自己建立的物件');
        return;
      }

      e.stopPropagation();
      selectObject(obj.id);

      const startPos = screenToWorld(e.clientX, e.clientY);
      const initX = obj.x;
      const initY = obj.y;

      function onMove(me) {
        const cur = screenToWorld(me.clientX, me.clientY);
        obj.x = initX + (cur.x - startPos.x);
        obj.y = initY + (cur.y - startPos.y);
        el.style.left = obj.x + 'px';
        el.style.top = obj.y + 'px';
      }

      function onUp() {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        pushObjectUpdate(obj);
      }

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  function bindSvgInteraction(el, obj) {
    el.addEventListener('pointerdown', (e) => {
      if (state.currentTool === 'eraser') {
        e.stopPropagation();
        deleteObject(obj.id);
        return;
      }
      if (state.currentTool !== 'select') return;
      if (!canModifyObject(obj)) {
        flashToast('⚠️ 老師已設定僅能移動自己建立的物件');
        return;
      }

      e.stopPropagation();
      selectObject(obj.id);

      const startPos = screenToWorld(e.clientX, e.clientY);
      const snapshot = JSON.parse(JSON.stringify(obj));

      function onMove(me) {
        const cur = screenToWorld(me.clientX, me.clientY);
        const dx = cur.x - startPos.x;
        const dy = cur.y - startPos.y;

        if (obj.type === 'pen') {
          // 移動整個 path: 重組 d 字串
          obj.d = translateSvgPath(snapshot.d, dx, dy);
        } else if (obj.type === 'rect') {
          obj.x = snapshot.x + dx;
          obj.y = snapshot.y + dy;
        } else if (obj.type === 'circle') {
          obj.cx = snapshot.cx + dx;
          obj.cy = snapshot.cy + dy;
        } else if (obj.type === 'arrow') {
          obj.x1 = snapshot.x1 + dx;
          obj.y1 = snapshot.y1 + dy;
          obj.x2 = snapshot.x2 + dx;
          obj.y2 = snapshot.y2 + dy;
        }
        renderSvgElement(obj);
      }

      function onUp() {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        pushObjectUpdate(obj);
      }

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  function translateSvgPath(d, dx, dy) {
    return d.replace(/([ML])\s*(-?[\d.]+)\s*[, ]\s*(-?[\d.]+)/g, (_, cmd, x, y) => {
      return `${cmd} ${(parseFloat(x) + dx).toFixed(1)} ${(parseFloat(y) + dy).toFixed(1)}`;
    });
  }

  function selectObject(id) {
    state.selectedObjId = id;
    document.querySelectorAll('.selected-border').forEach(el => el.classList.remove('selected-border'));
    const el = document.getElementById(`html_obj_${id}`);
    if (el) el.classList.add('selected-border');
  }

  // ===== 繪圖與手勢交互 (畫布事件) =====
  els.canvasViewport.addEventListener('pointerdown', (e) => {
    // 抓手平移模式
    if (state.currentTool === 'hand' || e.button === 1 || e.spaceKey) {
      state.isPanning = true;
      state.panStart = { x: e.clientX - state.view.x, y: e.clientY - state.view.y };
      els.canvasViewport.classList.add('cursor-grabbing');
      return;
    }

    // 檢查學生編輯權限
    if (!isTeacher && !state.settings.studentCanEdit) {
      flashToast('🔒 老師目前設定白板為唯讀狀態');
      return;
    }

    const pos = screenToWorld(e.clientX, e.clientY);
    const objId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    // 1. 手繪畫筆 (Pen)
    if (state.currentTool === 'pen') {
      state.activeDrawing = {
        id: objId,
        type: 'pen',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        d: `M ${pos.x.toFixed(1)} ${pos.y.toFixed(1)}`,
        points: [pos]
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 2. 矩形 (Rect)
    else if (state.currentTool === 'rect') {
      state.activeDrawing = {
        id: objId,
        type: 'rect',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        x: pos.x,
        y: pos.y,
        width: 1,
        height: 1,
        startX: pos.x,
        startY: pos.y
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 3. 圓形 (Circle)
    else if (state.currentTool === 'circle') {
      state.activeDrawing = {
        id: objId,
        type: 'circle',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        cx: pos.x,
        cy: pos.y,
        rx: 1,
        ry: 1,
        startX: pos.x,
        startY: pos.y
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 4. 箭頭直線 (Arrow)
    else if (state.currentTool === 'arrow') {
      state.activeDrawing = {
        id: objId,
        type: 'arrow',
        author: myName,
        authorId: myClientId,
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y
      };
      state.objects[objId] = state.activeDrawing;
      renderSvgElement(state.activeDrawing);
    }
    // 5. 便利貼 (Sticky Note) - 點選直接插入
    else if (state.currentTool === 'sticky') {
      createStickyNote(pos.x, pos.y, '雙擊編輯文字...');
      setTool('select');
    }
    // 6. 選取模式點擊空白處取消選取
    else if (state.currentTool === 'select') {
      state.selectedObjId = null;
      document.querySelectorAll('.selected-border').forEach(el => el.classList.remove('selected-border'));
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (state.isPanning) {
      state.view.x = e.clientX - state.panStart.x;
      state.view.y = e.clientY - state.panStart.y;
      updateWorldTransform();
      return;
    }

    if (!state.activeDrawing) return;
    const pos = screenToWorld(e.clientX, e.clientY);
    const d = state.activeDrawing;

    if (d.type === 'pen') {
      d.points.push(pos);
      d.d += ` L ${pos.x.toFixed(1)} ${pos.y.toFixed(1)}`;
      renderSvgElement(d);
    } else if (d.type === 'rect') {
      d.x = Math.min(d.startX, pos.x);
      d.y = Math.min(d.startY, pos.y);
      d.width = Math.abs(pos.x - d.startX);
      d.height = Math.abs(pos.y - d.startY);
      renderSvgElement(d);
    } else if (d.type === 'circle') {
      d.cx = (d.startX + pos.x) / 2;
      d.cy = (d.startY + pos.y) / 2;
      d.rx = Math.abs(pos.x - d.startX) / 2;
      d.ry = Math.abs(pos.y - d.startY) / 2;
      renderSvgElement(d);
    } else if (d.type === 'arrow') {
      d.x2 = pos.x;
      d.y2 = pos.y;
      renderSvgElement(d);
    }
  });

  window.addEventListener('pointerup', () => {
    if (state.isPanning) {
      state.isPanning = false;
      els.canvasViewport.classList.remove('cursor-grabbing');
    }

    if (state.activeDrawing) {
      const finishedObj = state.activeDrawing;
      state.activeDrawing = null;
      // 寫入 Firebase 同步
      pushObjectUpdate(finishedObj);
    }
  });

  // 滾輪縮放 (平滑對準滑鼠游標)
  els.canvasViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    zoomAt(state.view.zoom * zoomFactor, e.clientX, e.clientY);
  }, { passive: false });

  // 鍵盤 Delete / Backspace 刪除選取物件
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedObjId && state.objects[state.selectedObjId]) {
        const obj = state.objects[state.selectedObjId];
        if (canModifyObject(obj)) {
          deleteObject(obj.id);
        } else {
          flashToast('⚠️ 僅能刪除自己建立的物件');
        }
      }
    }
  });

  // ===== 剪貼簿整合 (Ctrl+V 支援圖片與文字便利貼) =====
  window.addEventListener('paste', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (!isTeacher && !state.settings.studentCanEdit) {
      flashToast('🔒 老師目前已關閉學生編輯權限');
      return;
    }

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let foundImage = false;

    // 當前視角中心點
    const rect = els.canvasViewport.getBoundingClientRect();
    const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // 1. 剪貼簿是圖片
      if (item.type.indexOf('image') !== -1) {
        foundImage = true;
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          insertImageObject(event.target.result, center.x - 150, center.y - 100);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }

    // 2. 剪貼簿是純文字 -> 自動轉為黃色便利貼 (文字若有網址自動轉超連結)
    if (!foundImage) {
      const text = e.clipboardData.getData('text');
      if (text && text.trim()) {
        createStickyNote(center.x - 100, center.y - 70, text.trim());
      }
    }
  });

  function createStickyNote(x, y, text) {
    const objId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const stickyObj = {
      id: objId,
      type: 'sticky',
      author: myName,
      authorId: myClientId,
      x: Math.round(x),
      y: Math.round(y),
      width: 210,
      height: 140,
      text: text,
      bg: '#fef08a'
    };
    state.objects[objId] = stickyObj;
    renderStickyNoteDOM(stickyObj);
    pushObjectUpdate(stickyObj);
  }

  function insertImageObject(src, x, y, width, height, title) {
    const img = new Image();
    img.onload = () => {
      const w = width || Math.min(480, img.naturalWidth || 320);
      const h = height || (img.naturalHeight ? Math.round(w * (img.naturalHeight / img.naturalWidth)) : 220);
      const objId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const imgObj = {
        id: objId,
        type: 'image',
        author: myName,
        authorId: myClientId,
        title: title || '貼圖',
        x: Math.round(x),
        y: Math.round(y),
        width: w,
        height: h,
        src: src
      };
      state.objects[objId] = imgObj;
      renderImageDOM(imgObj);
      pushObjectUpdate(imgObj);
    };
    img.src = src;
  }

  // 網址文字自動轉超連結
  function formatTextWithLinks(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const escaped = escapeHtml(text);
    return escaped.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

  // ===== PDF 頁面解析與選取插入 (圖 2) =====
  let currentPdfDoc = null;
  let selectedPdfPages = new Set();

  els.btnInsertPdf.onclick = () => {
    if (!isTeacher && !state.settings.studentCanEdit) {
      flashToast('🔒 老師目前已關閉學生編輯權限');
      return;
    }
    els.pdfFileInput.click();
  };

  els.pdfFileInput.onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!window.pdfjsLib) {
      alert('PDF 解析元件載入中，請稍候重試！');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      currentPdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      openPdfSelectModal();
    } catch (err) {
      console.error('Failed to parse PDF:', err);
      alert('解析 PDF 檔案失敗，請確認檔案格式是否正確。');
    }
  };

  async function openPdfSelectModal() {
    if (!currentPdfDoc) return;
    const numPages = currentPdfDoc.numPages;
    els.pdfTotalPages.textContent = numPages;
    els.pdfThumbnailGrid.innerHTML = '';
    selectedPdfPages.clear();

    // 預設全選
    for (let i = 1; i <= numPages; i++) selectedPdfPages.add(i);
    updatePdfSelectedCountBadge();

    els.pdfModal.classList.add('open');

    // 渲染各頁縮圖卡片
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await currentPdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.28 });

      const card = document.createElement('div');
      card.className = 'pdf-page-card selected';
      card.dataset.page = pageNum;

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      card.innerHTML = `
        <div class="page-index-badge">${pageNum}</div>
        <div class="page-check-badge">✓</div>
      `;
      card.appendChild(canvas);

      card.onclick = () => {
        if (selectedPdfPages.has(pageNum)) {
          selectedPdfPages.delete(pageNum);
          card.classList.remove('selected');
        } else {
          selectedPdfPages.add(pageNum);
          card.classList.add('selected');
        }
        updatePdfSelectedCountBadge();
      };

      els.pdfThumbnailGrid.appendChild(card);
    }
  }

  function updatePdfSelectedCountBadge() {
    els.pdfSelectedBadge.textContent = `已選 ${selectedPdfPages.size} 頁`;
    els.pdfSelectAll.checked = (selectedPdfPages.size === (currentPdfDoc ? currentPdfDoc.numPages : 0));
  }

  els.pdfSelectAll.onchange = () => {
    const isChecked = els.pdfSelectAll.checked;
    const cards = els.pdfThumbnailGrid.querySelectorAll('.pdf-page-card');
    selectedPdfPages.clear();
    cards.forEach(card => {
      const pageNum = parseInt(card.dataset.page, 10);
      if (isChecked) {
        selectedPdfPages.add(pageNum);
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
    updatePdfSelectedCountBadge();
  };

  els.btnClosePdfModal.onclick = closePdfModal;
  els.btnCancelPdf.onclick = closePdfModal;

  function closePdfModal() {
    els.pdfModal.classList.remove('open');
    els.pdfFileInput.value = '';
  }

  // 確認插入選取的 PDF 頁面 (自動計算網格排版，絕不重疊)
  els.btnConfirmInsertPdf.onclick = async () => {
    if (!currentPdfDoc || selectedPdfPages.size === 0) {
      alert('請至少勾選一頁要插入的 PDF！');
      return;
    }

    const pagesToInsert = Array.from(selectedPdfPages).sort((a, b) => a - b);
    closePdfModal();
    flashToast(`正在以高清畫質插入 ${pagesToInsert.length} 頁 PDF...`);

    // 計算視角中心或整齊起點
    const rect = els.canvasViewport.getBoundingClientRect();
    const center = screenToWorld(rect.left + 60, rect.top + 60);

    const cols = pagesToInsert.length <= 4 ? pagesToInsert.length : Math.ceil(Math.sqrt(pagesToInsert.length * 1.5));
    const cardWidth = 420;
    const gap = 35;

    for (let idx = 0; idx < pagesToInsert.length; idx++) {
      const pageNum = pagesToInsert[idx];
      const page = await currentPdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 }); // 高畫質

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardHeight = Math.round(cardWidth * (viewport.height / viewport.width));

      const posX = center.x + col * (cardWidth + gap);
      const posY = center.y + row * (cardHeight + gap);

      insertImageObject(dataUrl, posX, posY, cardWidth, cardHeight, `PDF 第 ${pageNum} 頁`);
    }

    flashToast('✅ PDF 頁面已全部依序編排插入完成！');
  };

  // 插入本機圖片
  els.btnInsertImage.onclick = () => {
    if (!isTeacher && !state.settings.studentCanEdit) {
      flashToast('🔒 老師目前已關閉學生編輯權限');
      return;
    }
    els.imageFileInput.click();
  };

  els.imageFileInput.onchange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rect = els.canvasViewport.getBoundingClientRect();
      const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
      insertImageObject(event.target.result, center.x - 160, center.y - 110, 320, 220, file.name);
    };
    reader.readAsDataURL(file);
    els.imageFileInput.value = '';
  };

  // ===== 資料同步推播 =====
  function pushObjectUpdate(obj) {
    if (!objectsRef) return;
    objectsRef.child(obj.id).set(obj).catch(err => {
      console.error('Firebase object sync error:', err);
    });
  }

  function deleteObject(id) {
    if (!objectsRef) {
      delete state.objects[id];
      removeObjectDOM(id);
      return;
    }
    objectsRef.child(id).remove().catch(err => console.error(err));
  }

  // ===== 老師權限開關點擊事件 =====
  if (isTeacher) {
    els.btnToggleStudentEdit.onclick = () => {
      state.settings.studentCanEdit = !state.settings.studentCanEdit;
      applySettingsUI();
      if (roomRef) roomRef.child('settings').update({ studentCanEdit: state.settings.studentCanEdit });
    };

    els.btnToggleMoveOthers.onclick = () => {
      state.settings.canMoveOthers = !state.settings.canMoveOthers;
      applySettingsUI();
      if (roomRef) roomRef.child('settings').update({ canMoveOthers: state.settings.canMoveOthers });
    };

    els.btnFollowMode.onclick = () => {
      state.settings.followTeacher = !state.settings.followTeacher;
      applySettingsUI();
      if (roomRef) roomRef.child('settings').update({ followTeacher: state.settings.followTeacher });
    };

    if (els.btnSummonAll) {
      els.btnSummonAll.onclick = () => {
        if (roomRef) {
          roomRef.child('summon').set({
            canvasId: state.activeCanvasId,
            pageId: state.activePageId,
            ts: firebase.database.ServerValue.TIMESTAMP
          });
          flashToast('📢 已發送廣播，正在將全班召集至當前頁面！');
        }
      };
    }
  }

  // 作者姓名標籤開關
  els.btnToggleAuthorBadge.onclick = () => {
    state.showAuthorBadge = !state.showAuthorBadge;
    applySettingsUI();
    if (isTeacher && roomRef) {
      roomRef.child('settings').update({ showAuthorBadge: state.showAuthorBadge });
    }
  };

  // 新增畫布
  els.btnAddCanvas.onclick = () => {
    const name = prompt('請輸入新畫布名稱：', `畫布 ${Object.keys(state.canvases).length + 1}`);
    if (!name || !name.trim()) return;
    const newId = 'canvas_' + Date.now().toString(36);
    state.canvases[newId] = { id: newId, name: name.trim(), pages: ['page_1'] };
    renderCanvasSelector();
    if (roomRef) roomRef.child('canvases').set(state.canvases);
    switchCanvasAndPage(newId, 'page_1', true);
  };

  // 下拉選單切換畫布
  els.canvasSelect.onchange = () => {
    const cId = els.canvasSelect.value;
    const cur = state.canvases[cId];
    const targetPage = (cur && cur.pages && cur.pages[0]) || 'page_1';
    switchCanvasAndPage(cId, targetPage, true);
  };

  // 新增頁面
  els.btnAddPage.onclick = () => {
    const cur = state.canvases[state.activeCanvasId] || { pages: ['page_1'] };
    const newPageId = 'page_' + (cur.pages.length + 1);
    cur.pages.push(newPageId);
    state.canvases[state.activeCanvasId] = cur;
    renderPagesTabs();
    if (roomRef) roomRef.child('canvases').set(state.canvases);
    switchCanvasAndPage(state.activeCanvasId, newPageId, true);
  };

  // 縮放按鈕
  els.btnZoomIn.onclick = () => zoomAt(state.view.zoom * 1.2);
  els.btnZoomOut.onclick = () => zoomAt(state.view.zoom * 0.8);
  els.btnZoomReset.onclick = resetView;
  els.zoomVal.onclick = resetView;

  // 清空或結束白板
  els.btnTrashCanvas.onclick = clearCurrentPage;
  els.btnClearOrEnd.onclick = () => {
    if (!isTeacher) return;
    if (confirm('確定要結束並清空白板當前畫布所有頁面內容嗎？')) {
      if (roomRef) {
        roomRef.child('pages').remove();
        flashToast('💥 白板內容已全部重設清空');
      }
    }
  };

  function clearCurrentPage() {
    if (!isTeacher && !state.settings.studentCanEdit) return;
    if (confirm('確定要清空當前頁面的所有內容嗎？')) {
      if (objectsRef) objectsRef.remove();
      state.objects = {};
      els.svgLayer.innerHTML = `
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/>
          </marker>
        </defs>
      `;
      els.htmlLayer.innerHTML = '';
    }
  }

  // 工具按鈕點選綁定
  els.floatingToolbar.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.onclick = () => setTool(btn.dataset.tool);
  });

  // 顏色選取盤快選
  els.colorCurrentDot.onclick = () => {
    const isVisible = els.colorPalette.style.display === 'grid';
    els.colorPalette.style.display = isVisible ? 'none' : 'grid';
  };

  els.colorPalette.querySelectorAll('.color-swatch').forEach(sw => {
    sw.onclick = () => {
      const color = sw.dataset.color;
      state.currentColor = color;
      els.colorCurrentDot.style.background = color;
      els.colorPalette.style.display = 'none';
    };
  });

  els.strokeSizeSelect.onchange = () => {
    state.currentStrokeWidth = parseInt(els.strokeSizeSelect.value, 10) || 4;
  };

  // 右側抽屜展開/收合
  els.btnToggleDrawer.onclick = () => {
    els.participantsDrawer.classList.toggle('open');
  };

  // 全螢幕切換
  els.btnFullscreen.onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // 使用說明彈窗事件 (圖 2)
  if (els.btnHelpGuide && els.guideModal) {
    els.btnHelpGuide.onclick = () => els.guideModal.classList.add('open');
  }
  if (els.btnCloseGuideModal && els.guideModal) {
    els.btnCloseGuideModal.onclick = () => els.guideModal.classList.remove('open');
  }
  if (els.btnConfirmGuide && els.guideModal) {
    els.btnConfirmGuide.onclick = () => els.guideModal.classList.remove('open');
  }

  // 關閉白板按鈕 (透過 postMessage 通知父頁面切換或關閉)
  els.btnCloseWhiteboard.onclick = () => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'CLOSE_WHITEBOARD' }, '*');
    } else {
      window.history.back();
    }
  };

  // 匯出當前畫布為 PNG 高畫質圖檔
  els.btnExport.onclick = () => {
    flashToast('正在生成高畫質匯出圖片...');
    const curCanvas = state.canvases[state.activeCanvasId] || { name: '白板' };
    const fileName = `${curCanvas.name}_${state.activePageId}_匯出.png`;

    // 建立離線高解析度 canvas
    const exportCanvas = document.createElement('canvas');
    const width = 2400;
    const height = 1500;
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 繪製背景點狀網格
    ctx.fillStyle = '#cbd5e1';
    for (let x = 0; x < width; x += 30) {
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 依序繪製當前頁面所有物件
    const objs = Object.values(state.objects);
    let loadedCount = 0;

    if (objs.length === 0) {
      downloadCanvasImage(exportCanvas, fileName);
      return;
    }

    objs.forEach(obj => {
      if (obj.type === 'pen') {
        ctx.strokeStyle = obj.color || '#1e293b';
        ctx.lineWidth = (obj.strokeWidth || 4) * 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (obj.points && obj.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(obj.points[0].x, obj.points[0].y);
          for (let i = 1; i < obj.points.length; i++) {
            ctx.lineTo(obj.points[i].x, obj.points[i].y);
          }
          ctx.stroke();
        }
      } else if (obj.type === 'rect') {
        ctx.strokeStyle = obj.color || '#1e293b';
        ctx.lineWidth = (obj.strokeWidth || 3) * 1.5;
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
      } else if (obj.type === 'circle') {
        ctx.strokeStyle = obj.color || '#1e293b';
        ctx.lineWidth = (obj.strokeWidth || 3) * 1.5;
        ctx.beginPath();
        ctx.ellipse(obj.cx, obj.cy, obj.rx, obj.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === 'sticky') {
        ctx.fillStyle = obj.bg || '#fef08a';
        ctx.fillRect(obj.x, obj.y, obj.width || 210, obj.height || 140);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x, obj.y, obj.width || 210, obj.height || 140);

        ctx.fillStyle = '#1e293b';
        ctx.font = '16px sans-serif';
        const lines = (obj.text || '').split('\n');
        lines.forEach((l, idx) => {
          ctx.fillText(l, obj.x + 12, obj.y + 32 + idx * 22);
        });
      }
    });

    downloadCanvasImage(exportCanvas, fileName);
  };

  function downloadCanvasImage(canvas, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = canvas.toDataURL('image/png');
    a.click();
    flashToast('✅ 圖片已成功匯出至下載資料夾！');
  }

  // 輕量 Toast 提示
  function flashToast(msg) {
    let t = document.getElementById('whiteboardToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'whiteboardToast';
      t.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.92); color:#fff; padding:8px 20px; border-radius:24px; font-size:13px; font-weight:600; z-index:9999; box-shadow:0 6px 18px rgba(0,0,0,0.25); pointer-events:none; transition:all 0.2s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.style.opacity = '0';
    }, 2400);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ===== 初始化啟動 =====
  window.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    renderCanvasSelector();
    renderPagesTabs();
    applySettingsUI();
    setTool('select');
  });

})();
