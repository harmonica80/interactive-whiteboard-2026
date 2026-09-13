// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDTPE7lFa86CMq0wd6eWDJZ6t_spH2W26k",
  authDomain: "opencode-whiteboard.firebaseapp.com",
  databaseURL: "https://opencode-whiteboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "opencode-whiteboard",
  storageBucket: "opencode-whiteboard.firebasestorage.app",
  messagingSenderId: "473141473085",
  appId: "1:473141473085:web:091f760eb2ab737f385f54"
};

// 支援透過 URL 參數動態載入自訂的 Firebase Database URL (供不同老師分流使用，無需重新架站)
const urlParams = new URLSearchParams(window.location.search);
const customDbUrl = urlParams.get('dbUrl');

if (customDbUrl) {
  // 如果 URL 帶有 dbUrl 參數，覆蓋預設的 databaseURL
  firebaseConfig.databaseURL = decodeURIComponent(customDbUrl);
}

// 班級代碼與智慧雙軌管理器 (ClassRoomManager)
window.ClassRoomManager = {
  // 清理並標準化班級代碼（移除 Firebase 禁止字元 . $ # [ ] /）
  sanitizeClassCode(code) {
    if (!code) return '';
    return String(code).trim().replace(/[.$#\[\]\/]/g, '_').toUpperCase();
  },

  // 取得當前班級代碼 (優先順序: URL 參數 > localStorage)
  getActiveClassCode() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const fromUrl = urlParams.get('class') || urlParams.get('room');
      if (fromUrl) {
        const sanitized = this.sanitizeClassCode(fromUrl);
        if (sanitized) {
          localStorage.setItem('active_class_code', sanitized);
          this.addToHistory(sanitized);
          return sanitized;
        }
      }
      const stored = localStorage.getItem('active_class_code');
      return stored ? this.sanitizeClassCode(stored) : '';
    } catch (e) {
      return '';
    }
  },

  // 是否為一次性課堂（無特定班級代碼）
  isOneOffClass() {
    return !this.getActiveClassCode();
  },

  // 儲存並切換班級代碼 (若傳入空值則切換回一次性課堂)
  setActiveClassCode(code) {
    const sanitized = this.sanitizeClassCode(code);
    if (sanitized) {
      localStorage.setItem('active_class_code', sanitized);
      this.addToHistory(sanitized);
      window.currentClassCode = sanitized;
    } else {
      localStorage.removeItem('active_class_code');
      window.currentClassCode = '';
    }
    return sanitized;
  },

  // 記錄最近使用過的班級列表（最多保留 5 個）
  addToHistory(code) {
    if (!code) return;
    try {
      let history = this.getClassHistory();
      history = [code, ...history.filter(c => c !== code)].slice(0, 5);
      localStorage.setItem('class_code_history', JSON.stringify(history));
    } catch (e) {}
  },

  getClassHistory() {
    try {
      const h = localStorage.getItem('class_code_history');
      return h ? JSON.parse(h) : [];
    } catch (e) {
      return [];
    }
  },

  // 使用者姓名管理
  getUserName() {
    return (localStorage.getItem('user_nickname') || localStorage.getItem('user_name') || '').trim();
  },

  setUserName(name) {
    if (name) {
      const trimmed = name.trim();
      localStorage.setItem('user_nickname', trimmed);
      localStorage.setItem('user_name', trimmed);
    }
  },

  // 身分管理 (student / teacher)
  getUserRole() {
    return localStorage.getItem('user_role') || 'student';
  },

  setUserRole(role) {
    localStorage.setItem('user_role', role === 'teacher' ? 'teacher' : 'student');
  },

  // 檢查班級是否已由老師登記開課
  async checkClassExists(code) {
    if (!code) return false;
    const sanitized = this.sanitizeClassCode(code);
    if (!sanitized) return false;
    try {
      const snap = await rawRef(`registered_classes/${sanitized}`).once('value');
      return snap.exists() && snap.val() !== null;
    } catch (e) {
      console.warn('checkClassExists error:', e);
      return false;
    }
  },

  // 老師登記新班級 (開課)
  async registerClass(code, name = '', createdBy = '老師') {
    const sanitized = this.sanitizeClassCode(code);
    if (!sanitized) throw new Error('班級代碼不可為空或包含不合法字元！');
    
    // 檢查是否已存在
    const exists = await this.checkClassExists(sanitized);
    if (exists) {
      throw new Error(`班級代碼【${sanitized}】已存在，無需重複開課！`);
    }

    const classData = {
      code: sanitized,
      name: (name || sanitized).trim(),
      createdAt: Date.now(),
      createdBy: createdBy || '老師',
      status: 'active'
    };

    await rawRef(`registered_classes/${sanitized}`).set(classData);
    return classData;
  },

  // 刪除已登記的班級
  async deleteClass(code, deleteSpaceData = true) {
    const sanitized = this.sanitizeClassCode(code);
    if (!sanitized) return;

    await rawRef(`registered_classes/${sanitized}`).remove();
    if (deleteSpaceData) {
      // 一併清空該班專屬資料，徹底釋放空間
      await rawRef(`classes/${sanitized}`).remove();
    }
  },

  // 監聽所有已開課班級清單 (用於管理後台即時顯示)
  onClassesChange(callback) {
    return rawRef('registered_classes').on('value', (snap) => {
      const val = snap.val() || {};
      const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
      // 依建立時間倒序
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(list);
    });
  }
};

// 初始化全域當前班級代碼
window.currentClassCode = window.ClassRoomManager.getActiveClassCode();

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 取得資料庫原生實例
const rawDb = firebase.database();
const rawRef = rawDb.ref.bind(rawDb);
rawDb.rawRef = rawRef;

// 透過透明代理 (Transparent Routing)，支援「一次性課堂」與「專屬班級」雙軌自動分流
rawDb.ref = function(path) {
  if (!path || path === '/') {
    const code = window.currentClassCode;
    return code ? rawRef(`classes/${code}`) : rawRef();
  }
  // 系統內部保留路徑不加班級前綴 (如連線檢測 .info/connected、班級名單 registered_classes)
  if (path.startsWith('.info/') || path.startsWith('system/') || path.startsWith('classes/') || path.startsWith('registered_classes')) {
    return rawRef(path);
  }
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const code = window.currentClassCode;

  // 雙軌分流核心：
  // 1. 若處於專屬班級（有班級代碼）：自動導向 classes/{classCode}/{cleanPath}
  // 2. 若處於一次性課堂（無班級代碼）：維持原本的 cleanPath（零破壞、100% 相容既有課堂資料！）
  if (code) {
    return rawRef(`classes/${code}/${cleanPath}`);
  } else {
    return rawRef(cleanPath);
  }
};

const db = rawDb;
let storage = null; // 免費版 Spark 方案不支援 Storage，設為 null 以直接啟用本地壓縮資料庫備用方案

