/**
 * teacher_auth_manager.js - 教師身分與管理員安全認證管理模組
 * 
 * 功能亮點：
 * 1. SHA-256 不可逆雜湊加密 (Web Crypto API + 純 JS 雙重容錯)，零明文存儲
 * 2. 認老師架構：單一教師設定專屬密碼，所建所有白板自動套用；一次性/公共白板全相容
 * 3. 防暴力破解鎖定：連續錯誤 5 次自動鎖定 180 秒 (3 分鐘)，帶即時倒數與狀態保護
 * 4. 雙重救援機制：
 *    - 途徑 A：密碼提示 + 安全提問自救 (不需外部郵件，自給自足)
 *    - 途徑 B：系統超級救援金鑰 (WHITEBOARD_MASTER_2026_RESCUE)
 * 5. 向下相容：初次使用或舊班級預設密碼 1234 仍可登入，後台顯示琥珀色警告提醒儘速修改
 */

(function (window) {
  'use strict';

  // 預設與系統保留常數
  const DEFAULT_PASSWORD_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; // '1234'
  const MASTER_RECOVERY_KEY_HASH = 'bf7b231fe2ede9055ca1ccaaaf585ba9e162b25703c543edf1335c4dd4a1d8df'; // 'WHITEBOARD_MASTER_2026_RESCUE'
  const DEFAULT_PASSWORD_EXPIRY_TIMESTAMP = 1793462399000; // 2026-10-31 23:59:59 (GMT+8) 預設密碼落日退場期限
  
  const STORAGE_KEYS = {
    ACTIVE_TEACHER: 'wb_active_teacher_id',
    ACTIVE_TEACHER_NAME: 'wb_active_teacher_name',
    LOCKOUT: 'wb_admin_auth_lockout_v1',
    LOCAL_CACHE: 'wb_teacher_profile_cache_'
  };

  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 180 * 1000; // 3 分鐘 (180 秒)

  class TeacherAuthManager {
    constructor() {
      this.lockoutTimer = null;
      this.currentVerifiedTeacher = null;
    }

    /**
     * 檢查預設密碼 1234 是否已過期 (2026/10/31 23:59:59 之後退場停用)
     */
    isDefaultPasswordExpired() {
      return Date.now() > DEFAULT_PASSWORD_EXPIRY_TIMESTAMP;
    }

    /**
     * 取得預設密碼距離 2026/10/31 停用尚餘天數
     */
    getDefaultPasswordRemainingDays() {
      const diff = DEFAULT_PASSWORD_EXPIRY_TIMESTAMP - Date.now();
      if (diff <= 0) return 0;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * 計算字串之 SHA-256 雜湊 (小寫 Hex 字串)
     */
    async sha256(text) {
      if (typeof text !== 'string') text = String(text || '');
      // 優先使用 Web Crypto API
      if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          console.warn('Web Crypto API 執行失敗，使用內建演算法 fallback:', e);
        }
      }
      return this._fallbackSha256(text);
    }

    /**
     * 純 JS SHA-256 容錯備援實作 (確保在任何環境/file:// 協定皆 100% 正常運作)
     */
    _fallbackSha256(ascii) {
      function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
      }
      const mathPow = Math.pow;
      const maxWord = mathPow(2, 32);
      let lengthProperty = 'length';
      let i, j;
      let result = '';
      const words = [];
      const asciiBitLength = ascii[lengthProperty] * 8;
      let hash = [];
      let k = [];
      let primeCounter = 0;

      const isComposite = {};
      for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
          for (i = candidate * candidate; i < 313; i += candidate) {
            isComposite[i] = true;
          }
          if (primeCounter < 8) {
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
          }
          k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
          primeCounter++;
        }
      }

      ascii += '\x80';
      while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
      for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return ''; // 僅支援 ASCII/UTF-8 字符
        words[i >> 2] |= j << (((3 - i) % 4) * 8);
      }
      words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
      words[words[lengthProperty]] = asciiBitLength;

      for (j = 0; j < words[lengthProperty];) {
        const w = words.slice(j, (j += 16));
        const oldHash = hash;
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
          const w15 = w[i - 15], w2 = w[i - 2];
          const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
          const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
          const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
          const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
          const s1_4 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
          const s0_0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
          const t1 = hash[7] + s1_4 + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
          const t2 = s0_0 + maj;

          hash = [(t1 + t2) | 0].concat(hash);
          hash[4] = (hash[4] + t1) | 0;
        }

        for (i = 0; i < 8; i++) {
          hash[i] = (hash[i] + oldHash[i]) | 0;
        }
      }

      for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
          const b = (hash[i] >> (j * 8)) & 255;
          result += ((b < 16) ? '0' : '') + b.toString(16);
        }
      }
      return result;
    }

    /**
     * 讀取防暴力破解狀態
     */
    getLockoutStatus() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.LOCKOUT);
        if (!raw) return { isLocked: false, remainingSeconds: 0, failCount: 0 };
        const data = JSON.parse(raw);
        const now = Date.now();
        if (data.lockedUntil && data.lockedUntil > now) {
          const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
          return { isLocked: true, remainingSeconds, failCount: data.failCount || MAX_FAILED_ATTEMPTS };
        }
        // 鎖定時間已過，若鎖定過期則保留計數或重設
        if (data.lockedUntil && data.lockedUntil <= now) {
          this.clearLockout();
          return { isLocked: false, remainingSeconds: 0, failCount: 0 };
        }
        return { isLocked: false, remainingSeconds: 0, failCount: data.failCount || 0 };
      } catch (e) {
        return { isLocked: false, remainingSeconds: 0, failCount: 0 };
      }
    }

    /**
     * 記錄一次密碼錯誤
     */
    recordFailedAttempt() {
      try {
        const current = this.getLockoutStatus();
        const newCount = (current.failCount || 0) + 1;
        let lockedUntil = 0;
        let isLocked = false;
        let remainingSeconds = 0;

        if (newCount >= MAX_FAILED_ATTEMPTS) {
          lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
          isLocked = true;
          remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
        }

        localStorage.setItem(STORAGE_KEYS.LOCKOUT, JSON.stringify({
          failCount: newCount,
          lockedUntil: lockedUntil,
          lastFailedAt: Date.now()
        }));

        return { isLocked, remainingSeconds, failCount: newCount, remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - newCount) };
      } catch (e) {
        return { isLocked: false, remainingSeconds: 0, failCount: 1, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
      }
    }

    /**
     * 清除防暴力破解計數與鎖定
     */
    clearLockout() {
      try {
        localStorage.removeItem(STORAGE_KEYS.LOCKOUT);
      } catch (e) {}
    }

    /**
     * 取得當前本機記錄的使用中教師代號
     */
    getActiveTeacherId() {
      let id = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER);
      if (!id) {
        // 預設教師 ID：以 T- 開頭加上隨機字串，便於區隔不同老師
        id = 'teacher_' + Math.random().toString(36).substring(2, 8);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER, id);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME, '授課老師');
      }
      return id;
    }

    /**
     * 設定當前使用中教師代號與名稱
     */
    setActiveTeacher(teacherId, name = '') {
      if (teacherId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER, teacherId);
        if (name) localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME, name);
      }
    }

    /**
     * 取得目前課堂綁定的擁有者教師 ID
     */
    async getCurrentClassOwnerTeacherId() {
      const classCode = window.currentClassCode;
      if (!classCode) return null;

      try {
        if (window.firebase && typeof window.rawRef === 'function') {
          const snap = await window.rawRef(`registered_classes/${classCode}/ownerTeacherId`).once('value');
          if (snap.exists() && snap.val()) {
            return snap.val();
          }
        }
      } catch (e) {
        console.warn('getCurrentClassOwnerTeacherId error:', e);
      }
      return null;
    }

    /**
     * 讀取教師資料 (優先從 Firebase 讀取，並快取於本機)
     */
    async getTeacherProfile(teacherId) {
      if (!teacherId) teacherId = this.getActiveTeacherId();
      
      // 1. 先嘗試由 Firebase 讀取最新資料
      try {
        if (window.firebase && typeof window.rawRef === 'function') {
          const snap = await window.rawRef(`teachers/${teacherId}`).once('value');
          if (snap.exists() && snap.val()) {
            const profile = snap.val();
            // 寫入快取
            try {
              localStorage.setItem(STORAGE_KEYS.LOCAL_CACHE + teacherId, JSON.stringify(profile));
            } catch (e) {}
            return profile;
          }
        }
      } catch (e) {
        console.warn('從 Firebase 讀取教師資料失敗，嘗試本機快取:', e);
      }

      // 2. 本機快取備援
      try {
        const cached = localStorage.getItem(STORAGE_KEYS.LOCAL_CACHE + teacherId);
        if (cached) return JSON.parse(cached);
      } catch (e) {}

      // 3. 預設初始資料
      return {
        teacherId: teacherId,
        name: localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME) || '授課老師',
        passwordHash: DEFAULT_PASSWORD_HASH, // 預設 1234
        passwordHint: '',
        recoveryQuestion: '',
        recoveryAnswerHash: '',
        isDefault: true,
        createdAt: Date.now()
      };
    }

    /**
     * 儲存教師資料至 Firebase 與本機快取
     */
    async saveTeacherProfile(teacherId, data) {
      if (!teacherId) teacherId = this.getActiveTeacherId();
      const existing = await this.getTeacherProfile(teacherId);

      const updated = {
        teacherId: teacherId,
        name: (data.name !== undefined ? data.name : existing.name) || '授課老師',
        passwordHash: data.passwordHash !== undefined ? data.passwordHash : existing.passwordHash,
        passwordHint: data.passwordHint !== undefined ? data.passwordHint : (existing.passwordHint || ''),
        recoveryQuestion: data.recoveryQuestion !== undefined ? data.recoveryQuestion : (existing.recoveryQuestion || ''),
        recoveryAnswerHash: data.recoveryAnswerHash !== undefined ? data.recoveryAnswerHash : (existing.recoveryAnswerHash || ''),
        updatedAt: Date.now(),
        createdAt: existing.createdAt || Date.now()
      };

      // 儲存至本機快取
      try {
        localStorage.setItem(STORAGE_KEYS.LOCAL_CACHE + teacherId, JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER, teacherId);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME, updated.name);
      } catch (e) {}

      // 儲存至 Firebase
      if (window.firebase && typeof window.rawRef === 'function') {
        try {
          await window.rawRef(`teachers/${teacherId}`).set(updated);
        } catch (e) {
          console.error('儲存教師資料至 Firebase 失敗:', e);
          throw new Error('無法儲存至雲端資料庫，請檢查網路連線：' + e.message);
        }
      }

      return updated;
    }

    /**
     * 核心密碼驗證
     * @param {string} inputPassword 輸入的明文密碼
     * @returns {Promise<Object>} 驗證結果
     */
    async verifyPassword(inputPassword) {
      // 1. 檢查防暴力破解狀態
      const lockout = this.getLockoutStatus();
      if (lockout.isLocked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: lockout.remainingSeconds,
          message: `登入嘗試次數過多，已被安全防護鎖定！請等待 ${lockout.remainingSeconds} 秒後再試。`
        };
      }

      const inputTrimmed = (inputPassword || '').trim();
      if (!inputTrimmed) {
        return { success: false, message: '請輸入管理員密碼！' };
      }

      const inputHash = await this.sha256(inputTrimmed);

      // 2. 超級救援金鑰核對 (WHITEBOARD_MASTER_2026_RESCUE)
      if (inputHash === MASTER_RECOVERY_KEY_HASH) {
        this.clearLockout();
        this.currentVerifiedTeacher = {
          teacherId: this.getActiveTeacherId(),
          name: '超級救援管理員',
          isMasterKey: true
        };
        return {
          success: true,
          isMaster: true,
          message: '超級救援金鑰驗證通過！已進入管理員模式。'
        };
      }

      // 3. 檢查預設密碼 1234 之落日過期狀態 (2026/10/31 23:59:59 停用)
      if (inputHash === DEFAULT_PASSWORD_HASH && this.isDefaultPasswordExpired()) {
        return {
          success: false,
          locked: false,
          isExpiredDefault: true,
          message: '⛔ 系統安全政策：預設密碼 (1234) 已於 2026/10/31 23:59 正式退場停用！為保障課堂安全，請點選下方「忘記密碼？」使用安全提問或超級救援金鑰重設專屬密碼。'
        };
      }

      // 4. 判斷當前環境（班級課堂 vs 公共課堂）
      const classCode = window.currentClassCode;
      let targetTeacherId = null;

      if (classCode) {
        targetTeacherId = await this.getCurrentClassOwnerTeacherId();
      }

      // 如果當前班級有綁定老師
      if (targetTeacherId) {
        const teacherProfile = await this.getTeacherProfile(targetTeacherId);
        const expectedHash = teacherProfile.passwordHash || DEFAULT_PASSWORD_HASH;

        // 若班級設定仍為預設密碼且已過期，阻擋存取
        if (expectedHash === DEFAULT_PASSWORD_HASH && this.isDefaultPasswordExpired()) {
          return {
            success: false,
            locked: false,
            isExpiredDefault: true,
            message: '⛔ 系統安全政策：此班級管理密碼仍為舊有預設密碼 (1234)，已於 2026/10/31 正式停用！請點選下方「忘記密碼？」進行自救重設。'
          };
        }

        if (inputHash === expectedHash) {
          this.clearLockout();
          this.setActiveTeacher(teacherProfile.teacherId, teacherProfile.name);
          this.currentVerifiedTeacher = teacherProfile;
          return {
            success: true,
            teacher: teacherProfile,
            isDefault: expectedHash === DEFAULT_PASSWORD_HASH,
            remainingDays: this.getDefaultPasswordRemainingDays(),
            message: '管理員密碼驗證成功！'
          };
        }

        // 若此班級老師已自訂專屬密碼，但使用者輸入預設密碼 1234
        if (inputHash === DEFAULT_PASSWORD_HASH && expectedHash !== DEFAULT_PASSWORD_HASH) {
          const record = this.recordFailedAttempt();
          return {
            success: false,
            locked: record.isLocked,
            remainingSeconds: record.remainingSeconds,
            remainingAttempts: record.remainingAttempts,
            message: '⛔ 此班級白板已設定專屬安全密碼，預設密碼 1234 已失效！請輸入授課老師設定的專屬密碼。'
          };
        }
      } else {
        // 公共課堂／未綁定教師班級：
        // 優先檢查本機活躍教師
        const activeId = this.getActiveTeacherId();
        const activeProfile = await this.getTeacherProfile(activeId);
        const isSelfDefault = (!activeProfile.passwordHash || activeProfile.passwordHash === DEFAULT_PASSWORD_HASH);
        
        if (activeProfile && activeProfile.passwordHash && !isSelfDefault) {
          if (inputHash === activeProfile.passwordHash) {
            this.clearLockout();
            this.currentVerifiedTeacher = activeProfile;
            // 若在班級中且該班尚未綁定老師，自動綁定為該老師
            if (classCode && window.rawRef) {
              window.rawRef(`registered_classes/${classCode}/ownerTeacherId`).set(activeProfile.teacherId).catch(() => {});
            }
            return {
              success: true,
              teacher: activeProfile,
              isDefault: false,
              message: '管理員密碼驗證成功！'
            };
          }
        }

        // 若當前老師已設定專屬密碼，但輸入了預設密碼 1234
        if (!isSelfDefault && inputHash === DEFAULT_PASSWORD_HASH) {
          const record = this.recordFailedAttempt();
          return {
            success: false,
            locked: record.isLocked,
            remainingSeconds: record.remainingSeconds,
            remainingAttempts: record.remainingAttempts,
            message: '⛔ 此管理員帳號已設定專屬安全密碼，預設密碼 1234 已失效！請輸入專屬密碼。'
          };
        }

        // 搜尋 Firebase 中所有教師看是否有匹配的密碼
        try {
          if (window.firebase && typeof window.rawRef === 'function') {
            const snap = await window.rawRef('teachers').once('value');
            if (snap.exists() && snap.val()) {
              const allTeachers = snap.val();
              for (const tid in allTeachers) {
                const t = allTeachers[tid];
                if (t && t.passwordHash === inputHash) {
                  this.clearLockout();
                  this.setActiveTeacher(t.teacherId, t.name);
                  this.currentVerifiedTeacher = t;
                  // 若在班級中，自動綁定為該老師
                  if (classCode && window.rawRef) {
                    window.rawRef(`registered_classes/${classCode}/ownerTeacherId`).set(t.teacherId).catch(() => {});
                  }
                  return {
                    success: true,
                    teacher: t,
                    isDefault: false,
                    message: `歡迎 ${t.name}！密碼驗證成功。`
                  };
                }
              }
            }
          }
        } catch (e) {
          console.warn('比對全域教師密碼失敗:', e);
        }

        // 最後比對預設密碼 '1234' (僅在當前帳號尚未設定過專屬密碼且未過期時允許)
        if (isSelfDefault && inputHash === DEFAULT_PASSWORD_HASH && !this.isDefaultPasswordExpired()) {
          this.clearLockout();
          this.currentVerifiedTeacher = activeProfile;
          return {
            success: true,
            teacher: activeProfile,
            isDefault: true,
            remainingDays: this.getDefaultPasswordRemainingDays(),
            message: '密碼正確（目前使用預設密碼 1234）'
          };
        }
      }

      // 4. 密碼錯誤，記錄失敗嘗試
      const record = this.recordFailedAttempt();
      if (record.isLocked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: record.remainingSeconds,
          message: `密碼錯誤次數達 ${MAX_FAILED_ATTEMPTS} 次！帳號已被安全鎖定，請於 3 分鐘後再試，或使用忘記密碼自救。`
        };
      }

      return {
        success: false,
        locked: false,
        remainingAttempts: record.remainingAttempts,
        message: `密碼不正確！還剩 ${record.remainingAttempts} 次輸入機會。`
      };
    }

    /**
     * 取得重設/自救所需的教師資訊 (不回傳 Hash)
     */
    async getRecoveryContext() {
      const classCode = window.currentClassCode;
      let teacherId = null;
      if (classCode) {
        teacherId = await this.getCurrentClassOwnerTeacherId();
      }
      if (!teacherId) {
        teacherId = this.getActiveTeacherId();
      }
      const profile = await this.getTeacherProfile(teacherId);
      return {
        teacherId: profile.teacherId,
        name: profile.name || '授課老師',
        classCode: classCode || '公共課堂',
        hasHint: !!profile.passwordHint,
        passwordHint: profile.passwordHint || '未設定密碼提示',
        hasQuestion: !!(profile.recoveryQuestion && profile.recoveryAnswerHash),
        recoveryQuestion: profile.recoveryQuestion || '未設定安全問題'
      };
    }

    /**
     * 透過安全問題答案重設密碼
     */
    async verifyAndResetViaQuestion(teacherId, answer, newPassword) {
      if (!answer || !newPassword) {
        throw new Error('請輸入安全問題的答案與新密碼！');
      }
      if (newPassword.length < 4) {
        throw new Error('新密碼長度至少需 4 碼！');
      }
      if (newPassword.trim() === '1234' && this.isDefaultPasswordExpired()) {
        throw new Error('預設密碼 1234 已於 2026/10/31 正式退場停用，請設定一組專屬自訂新密碼！');
      }

      const profile = await this.getTeacherProfile(teacherId);
      if (!profile.recoveryAnswerHash) {
        throw new Error('此教師帳號尚未設定安全問題，請使用超級救援金鑰進行重設！');
      }

      const normalizedAnswer = answer.trim().toLowerCase();
      const answerHash = await this.sha256(normalizedAnswer);

      if (answerHash !== profile.recoveryAnswerHash) {
        throw new Error('安全問題答案不正確，請重新確認！');
      }

      const newPasswordHash = await this.sha256(newPassword.trim());
      await this.saveTeacherProfile(teacherId, {
        passwordHash: newPasswordHash
      });

      this.clearLockout();
      return true;
    }

    /**
     * 透過系統超級救援金鑰重設密碼
     */
    async resetViaMasterKey(teacherId, masterKey, newPassword) {
      if (!masterKey || !newPassword) {
        throw new Error('請輸入超級救援金鑰與新密碼！');
      }
      if (newPassword.length < 4) {
        throw new Error('新密碼長度至少需 4 碼！');
      }
      if (newPassword.trim() === '1234' && this.isDefaultPasswordExpired()) {
        throw new Error('預設密碼 1234 已於 2026/10/31 正式退場停用，請設定一組專屬自訂新密碼！');
      }

      const masterKeyHash = await this.sha256(masterKey.trim());
      if (masterKeyHash !== MASTER_RECOVERY_KEY_HASH) {
        throw new Error('超級救援金鑰錯誤，請洽詢系統管理員！');
      }

      const targetId = teacherId || this.getActiveTeacherId();
      const newPasswordHash = await this.sha256(newPassword.trim());

      await this.saveTeacherProfile(targetId, {
        passwordHash: newPasswordHash
      });

      this.clearLockout();
      return true;
    }

    // ==========================================
    // UI 互動串接與即時渲染
    // ==========================================

    /**
     * 開啟管理員密碼輸入彈窗時更新 UI
     */
    async updatePasswordModalUI() {
      const modal = document.getElementById('adminPasswordModal');
      if (!modal) return;

      const lockout = this.getLockoutStatus();
      const warningBox = document.getElementById('adminPasswordLockoutWarning');
      const submitBtn = document.getElementById('btnSubmitAdminPassword');
      const input = document.getElementById('adminPasswordInput');
      const subInfo = document.getElementById('adminPasswordSubInfo');

      // 班級與老師資訊
      if (subInfo) {
        const classCode = window.currentClassCode;
        let infoText = '';
        if (classCode) {
          const ownerId = await this.getCurrentClassOwnerTeacherId();
          let teacherName = '授課老師';
          if (ownerId) {
            const p = await this.getTeacherProfile(ownerId);
            if (p && p.name) teacherName = p.name;
          }
          infoText = `🏫 當前班級：<strong>【${classCode}】</strong> (管理老師: ${teacherName})`;
        } else {
          const activeName = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER_NAME) || '授課老師';
          infoText = `🌐 公共課堂 (目前老師: <strong>${activeName}</strong>)`;
        }

        let expiryBadge = '';
        if (this.isDefaultPasswordExpired()) {
          expiryBadge = `<div style="margin-top: 6px; font-size: 11px; color: #dc2626; background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.25); padding: 3px 8px; border-radius: 6px; display: inline-block; font-weight: bold;">⛔ 預設密碼 (1234) 已於 10/31 退場停用</div>`;
        } else {
          const remDays = this.getDefaultPasswordRemainingDays();
          expiryBadge = `<div style="margin-top: 6px; font-size: 11px; color: #d97706; background: rgba(255,149,0,0.1); border: 1px solid rgba(255,149,0,0.3); padding: 3px 8px; border-radius: 6px; display: inline-block; font-weight: bold;">⏳ 預設密碼 (1234) 將於 10/31 停用（剩餘 ${remDays} 天）</div>`;
        }

        subInfo.innerHTML = `${infoText}<br>${expiryBadge}`;
      }

      if (lockout.isLocked) {
        if (warningBox) {
          warningBox.style.display = 'block';
          warningBox.innerHTML = `⚠️ 連續錯誤次數過多，安全鎖定中！<br>請等待 <strong id="lockoutCountdownText" style="color: #ff3b30; font-size: 16px;">${lockout.remainingSeconds}</strong> 秒後再試。`;
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.style.cursor = 'not-allowed';
        }
        if (input) input.disabled = true;

        this._startLockoutCountdown(lockout.remainingSeconds);
      } else {
        if (warningBox) warningBox.style.display = 'none';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (this.lockoutTimer) {
          clearInterval(this.lockoutTimer);
          this.lockoutTimer = null;
        }
      }
    }

    _startLockoutCountdown(seconds) {
      if (this.lockoutTimer) clearInterval(this.lockoutTimer);
      let rem = seconds;
      this.lockoutTimer = setInterval(() => {
        rem--;
        const el = document.getElementById('lockoutCountdownText');
        if (el) el.textContent = rem;
        if (rem <= 0) {
          clearInterval(this.lockoutTimer);
          this.lockoutTimer = null;
          this.clearLockout();
          this.updatePasswordModalUI();
        }
      }, 1000);
    }

    /**
     * 開啟忘記密碼救援彈窗
     */
    async openRecoveryModal() {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      if (!modal) return;

      modal.style.display = 'flex';
      modal.classList.add('active');

      const info = await this.getRecoveryContext();
      
      const teacherNameSpan = document.getElementById('recoveryTeacherName');
      if (teacherNameSpan) teacherNameSpan.textContent = `${info.name} (${info.classCode})`;

      const hintText = document.getElementById('recoveryPasswordHintText');
      if (hintText) {
        hintText.textContent = info.passwordHint || '（此教師帳號尚未填寫密碼提示）';
      }

      const qBox = document.getElementById('recoveryQuestionContainer');
      const qText = document.getElementById('recoveryQuestionLabel');
      if (qBox && qText) {
        if (info.hasQuestion) {
          qBox.style.display = 'block';
          qText.textContent = info.recoveryQuestion;
        } else {
          qBox.style.display = 'none';
        }
      }

      // 清空輸入框
      const answerInput = document.getElementById('recoveryQuestionAnswer');
      const newPwd1 = document.getElementById('recoveryNewPassword');
      const newPwd2 = document.getElementById('recoveryNewPasswordConfirm');
      const masterKey = document.getElementById('recoveryMasterKeyInput');
      const masterNewPwd = document.getElementById('recoveryMasterNewPassword');

      if (answerInput) answerInput.value = '';
      if (newPwd1) newPwd1.value = '';
      if (newPwd2) newPwd2.value = '';
      if (masterKey) masterKey.value = '';
      if (masterNewPwd) masterNewPwd.value = '';

      // 儲存目前救援目標教師 ID
      modal.setAttribute('data-target-teacher-id', info.teacherId);
    }

    closeRecoveryModal() {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    /**
     * 執行安全提問重設
     */
    async submitQuestionRecovery() {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      const teacherId = modal ? modal.getAttribute('data-target-teacher-id') : null;
      const answerInput = document.getElementById('recoveryQuestionAnswer');
      const newPwd1 = document.getElementById('recoveryNewPassword');
      const newPwd2 = document.getElementById('recoveryNewPasswordConfirm');

      const answer = answerInput ? answerInput.value : '';
      const p1 = newPwd1 ? newPwd1.value : '';
      const p2 = newPwd2 ? newPwd2.value : '';

      if (!answer) {
        window.app.showNotification('請輸入答案', '請填寫安全問題的正確答案！');
        return;
      }
      if (!p1 || p1.length < 4) {
        window.app.showNotification('密碼過短', '新密碼長度至少需 4 碼！');
        return;
      }
      if (p1 !== p2) {
        window.app.showNotification('密碼不一致', '兩次輸入的新密碼不相符，請重新輸入！');
        return;
      }

      try {
        await this.verifyAndResetViaQuestion(teacherId, answer, p1);
        window.app.showNotification('🎉 重設成功', '管理員密碼已成功更新！請使用新密碼登入。');
        this.closeRecoveryModal();
        this.updatePasswordModalUI();
      } catch (e) {
        window.app.showNotification('重設失敗', e.message || '安全提問驗證錯誤');
      }
    }

    /**
     * 執行超級救援金鑰重設
     */
    async submitMasterKeyRecovery() {
      const modal = document.getElementById('adminPasswordRecoveryModal');
      const teacherId = modal ? modal.getAttribute('data-target-teacher-id') : null;
      const masterKeyInput = document.getElementById('recoveryMasterKeyInput');
      const masterNewPwd = document.getElementById('recoveryMasterNewPassword');

      const key = masterKeyInput ? masterKeyInput.value : '';
      const p1 = masterNewPwd ? masterNewPwd.value : '';

      if (!key) {
        window.app.showNotification('請輸入金鑰', '請輸入系統超級救援金鑰！');
        return;
      }
      if (!p1 || p1.length < 4) {
        window.app.showNotification('密碼過短', '新密碼長度至少需 4 碼！');
        return;
      }

      try {
        await this.resetViaMasterKey(teacherId, key, p1);
        window.app.showNotification('🎉 救援成功', '已透過系統超級救援金鑰重設密碼！請立即登入。');
        this.closeRecoveryModal();
        this.updatePasswordModalUI();
      } catch (e) {
        window.app.showNotification('金鑰驗證失敗', e.message || '金鑰錯誤');
      }
    }

    /**
     * 渲染後台「F. 教師身分與密碼安全設定」管理面板
     */
    async renderSecurityPanel() {
      const teacherId = this.getActiveTeacherId();
      const profile = await this.getTeacherProfile(teacherId);

      const nameInput = document.getElementById('secTeacherNameInput');
      const idInput = document.getElementById('secTeacherIdDisplay');
      const statusBadge = document.getElementById('secPasswordStatusBadge');
      const hintInput = document.getElementById('secPasswordHintInput');
      const questionSelect = document.getElementById('secSecurityQuestionSelect');
      const customQuestionInput = document.getElementById('secCustomQuestionInput');
      const answerInput = document.getElementById('secSecurityAnswerInput');
      const boundClassInfo = document.getElementById('secBoundClassesInfo');

      if (nameInput) nameInput.value = profile.name || '授課老師';
      if (idInput) idInput.value = profile.teacherId || teacherId;
      if (hintInput) hintInput.value = profile.passwordHint || '';

      const isDefault = !profile.passwordHash || profile.passwordHash === DEFAULT_PASSWORD_HASH;
      if (statusBadge) {
        if (isDefault) {
          if (this.isDefaultPasswordExpired()) {
            statusBadge.innerHTML = `<span style="background: rgba(255, 59, 48, 0.15); color: #dc2626; padding: 4px 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(255, 59, 48, 0.4); display: inline-flex; align-items: center; gap: 4px;">⛔ 預設密碼 (1234) 已於 10/31 退場停用 — 必須設定專屬密碼！</span>`;
          } else {
            const remDays = this.getDefaultPasswordRemainingDays();
            statusBadge.innerHTML = `<span style="background: rgba(255, 149, 0, 0.15); color: #d97706; padding: 4px 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(255, 149, 0, 0.4); display: inline-flex; align-items: center; gap: 4px;">⚠️ 仍使用預設密碼 (1234) — 將於 10/31 停用（剩餘 ${remDays} 天），請儘速修改！</span>`;
          }
        } else {
          statusBadge.innerHTML = `<span style="background: rgba(52, 199, 89, 0.15); color: #16a34a; padding: 4px 10px; border-radius: 8px; font-weight: bold; border: 1px solid rgba(52, 199, 89, 0.4); display: inline-flex; align-items: center; gap: 4px;">🛡️ 已啟用專屬安全密碼 (SHA-256 加密守護中)</span>`;
        }
      }

      // 安全問題下拉選單
      if (questionSelect) {
        const commonQuestions = [
          '我的第一所任教學校名稱？',
          '我的第一隻寵物叫什麼名字？',
          '我最崇拜的一位歷史人物？',
          '我就讀的國小學校名稱？',
          '我人生中購買的第一本書名？'
        ];
        
        let found = false;
        for (let i = 0; i < questionSelect.options.length; i++) {
          if (questionSelect.options[i].value === profile.recoveryQuestion) {
            questionSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found && profile.recoveryQuestion) {
          questionSelect.value = 'custom';
          if (customQuestionInput) {
            customQuestionInput.style.display = 'block';
            customQuestionInput.value = profile.recoveryQuestion;
          }
        } else {
          if (customQuestionInput) {
            customQuestionInput.style.display = (questionSelect.value === 'custom') ? 'block' : 'none';
          }
        }
      }

      if (answerInput) {
        answerInput.value = '';
        answerInput.placeholder = profile.recoveryAnswerHash ? '（已設定安全答案，若不修改請留空）' : '請輸入解答';
      }

      // 查詢該老師名下所擁有的班級代碼
      if (boundClassInfo) {
        try {
          if (window.firebase && typeof window.rawRef === 'function') {
            const snap = await window.rawRef('registered_classes').once('value');
            const classes = [];
            if (snap.exists() && snap.val()) {
              const all = snap.val();
              for (const code in all) {
                if (all[code] && (all[code].ownerTeacherId === teacherId || (!all[code].ownerTeacherId && isDefault))) {
                  classes.push(code);
                }
              }
            }
            if (classes.length > 0) {
              boundClassInfo.innerHTML = classes.map(c => `<span style="background: rgba(0, 122, 255, 0.1); color: var(--accent-color); padding: 3px 8px; border-radius: 6px; font-size: 13px; font-weight: bold;">🏫 ${c}</span>`).join(' ');
            } else {
              boundClassInfo.textContent = '尚未開立專屬班級（開課時將自動套用此密碼）';
            }
          }
        } catch (e) {
          boundClassInfo.textContent = '無法讀取班級資訊';
        }
      }
    }

    /**
     * 儲存後台安全設定面板所輸入的內容
     */
    async saveSecurityPanelSettings() {
      const teacherId = this.getActiveTeacherId();
      const nameInput = document.getElementById('secTeacherNameInput');
      const newPwd1 = document.getElementById('secNewPasswordInput');
      const newPwd2 = document.getElementById('secNewPasswordConfirmInput');
      const hintInput = document.getElementById('secPasswordHintInput');
      const questionSelect = document.getElementById('secSecurityQuestionSelect');
      const customQuestionInput = document.getElementById('secCustomQuestionInput');
      const answerInput = document.getElementById('secSecurityAnswerInput');

      const name = nameInput ? nameInput.value.trim() : '授課老師';
      const p1 = newPwd1 ? newPwd1.value : '';
      const p2 = newPwd2 ? newPwd2.value : '';
      const hint = hintInput ? hintInput.value.trim() : '';
      
      let question = '';
      if (questionSelect) {
        if (questionSelect.value === 'custom') {
          question = customQuestionInput ? customQuestionInput.value.trim() : '';
        } else {
          question = questionSelect.value;
        }
      }

      const answer = answerInput ? answerInput.value.trim() : '';

      const updateData = {
        name: name || '授課老師',
        passwordHint: hint,
        recoveryQuestion: question
      };

      // 檢查密碼更新
      if (p1 || p2) {
        if (p1.length < 4) {
          window.app.showNotification('密碼過短', '新密碼長度至少需 4 碼！');
          return;
        }
        if (p1 !== p2) {
          window.app.showNotification('密碼不相符', '兩次輸入的新密碼不一致，請重新檢查！');
          return;
        }
        if (p1 === '1234' && this.isDefaultPasswordExpired()) {
          window.app.showNotification('密碼不合規', '預設密碼 1234 已於 2026/10/31 正式退場停用，不可再設定為 1234！請使用其他自訂密碼。');
          return;
        }
        updateData.passwordHash = await this.sha256(p1);
      }

      // 檢查安全提問更新
      if (answer) {
        updateData.recoveryAnswerHash = await this.sha256(answer.toLowerCase());
      }

      try {
        await this.saveTeacherProfile(teacherId, updateData);
        window.app.showNotification('💾 儲存成功', '教師身分與管理員密碼設定已成功同步至雲端！');
        
        // 清空密碼欄位
        if (newPwd1) newPwd1.value = '';
        if (newPwd2) newPwd2.value = '';
        if (answerInput) answerInput.value = '';

        this.renderSecurityPanel();
      } catch (e) {
        window.app.showNotification('儲存失敗', e.message || '發生未知錯誤');
      }
    }

    /**
     * 重設為系統預設密碼 (1234，僅在 2026/10/31 前有效)
     */
    async resetToDefaultPassword() {
      if (this.isDefaultPasswordExpired()) {
        window.app.showNotification('⛔ 無法恢復預設密碼', '預設密碼 (1234) 已於 2026/10/31 正式退場停用，系統已全面禁止使用預設密碼。請直接在上方欄位設定專屬新密碼！');
        return;
      }
      const teacherId = this.getActiveTeacherId();
      await this.saveTeacherProfile(teacherId, {
        passwordHash: DEFAULT_PASSWORD_HASH,
        passwordHint: '',
        recoveryQuestion: '',
        recoveryAnswerHash: ''
      });
      const days = this.getDefaultPasswordRemainingDays();
      window.app.showNotification('🔄 已重設為預設', `密碼已恢復為預設的 1234。提醒：此預設密碼將於 10/31 停用（剩餘 ${days} 天），請務必及時設定專屬安全密碼。`);
      this.renderSecurityPanel();
    }
  }

  // 掛載至 window
  window.TeacherAuthManager = TeacherAuthManager;
  window.teacherAuthManager = new TeacherAuthManager();

})(window);
