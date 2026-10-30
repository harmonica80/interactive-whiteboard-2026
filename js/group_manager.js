/**
 * 學生分組管理系統 (GroupManager)
 * 支援功能：
 * 1. 自動分組 (依每組人數 / 依總組數；範圍可限定全班或僅目前線上學生)
 * 2. 未到課學生處理：可選保留於組內或暫移至未分配清單
 * 3. 手動拖曳調整、換組、指派組長、自訂組名與代表色
 * 4. 歷史分組快照存取、歷程載入、線上名單差異比對與一鍵補位/剔除
 * 5. 小組獨立積分池 (groupPoints) 與日誌 (groupPointsLog)
 * 6. 小組積分轉移至個人：支援「全額均分」與「全員同額獎勵」
 */

(function () {
  'use strict';

  class GroupManager {
    constructor() {
      this.app = null;
      this.activeGroupSet = null; // 當前班級活躍組別資料
      this.historyGroupSets = []; // 歷史分組快照清單
      this.groupListenerRef = null;
      this.isInitialized = false;
      this.activeTab = 'active'; // 'active' | 'history'
      this.draggedStudentUid = null;
      this.draggedFromGroupId = null;

      // 預設鮮明且高對比的主題配色庫 (連動四大主題且高辨識度)
      this.PRESET_COLORS = [
        '#3B82F6', // 湛藍
        '#10B981', // 翡翠綠
        '#F59E0B', // 琥珀金
        '#8B5CF6', // 紫羅蘭
        '#EC4899', // 玫瑰粉
        '#06B6D4', // 青綠
        '#F97316', // 活力橘
        '#6366F1', // 靛藍
        '#14B8A6', // 湖水綠
        '#E11D48', // 緋紅
        '#84CC16', // 萊姆綠
        '#A855F7'  // 魅紫
      ];
    }

    init(appInstance) {
      this.app = appInstance || window.app;
      this.isInitialized = true;
      this.bindEvents();
    }

    bindEvents() {
      // 監聽鍵盤快捷或全域通知事件
    }

    // 取得當前班級代碼
    getActiveClassCode() {
      if (window.ClassRoomManager && typeof window.ClassRoomManager.getActiveClassCode === 'function') {
        return window.ClassRoomManager.getActiveClassCode();
      }
      return window.currentClassCode || '';
    }

    // 取得 Firebase db 參考
    getDb() {
      return (window.firebase && window.firebase.database && window.firebase.database()) || window.db;
    }

    // 啟動監聽當前活躍組別 (按需監聽)
    listenActiveGroups() {
      const classCode = this.getActiveClassCode();
      const db = this.getDb();
      if (!db) return;

      this.unlistenActiveGroups();

      const path = classCode ? `classes/${classCode}/activeGroups` : 'groups/activeGroups';
      this.groupListenerRef = db.ref(path);
      this.groupListenerRef.on('value', (snapshot) => {
        this.activeGroupSet = snapshot.val() || null;
        this.renderAdminPanel();
        if (this.app && typeof this.app.updateFloatingStudentGroupBadge === 'function') {
          this.app.updateFloatingStudentGroupBadge();
        }
      });
    }

    // 卸載監聽器 (遵守規範)
    unlistenActiveGroups() {
      if (this.groupListenerRef) {
        this.groupListenerRef.off();
        this.groupListenerRef = null;
      }
    }

    // 取得目前班級所有學生資料物件
    getAllStudentsMap() {
      if (this.app && this.app.registeredStudents) {
        return this.app.registeredStudents;
      }
      return {};
    }

    // 取得線上學生 UID 集合
    getOnlineStudentUidsSet() {
      const onlineSet = new Set();
      const presenceData = (this.app && this.app.onlinePresence) || {};
      Object.values(presenceData).forEach((p) => {
        if (p && p.userId) onlineSet.add(p.userId);
      });
      return onlineSet;
    }

    // 判斷學生是否在線
    isStudentOnline(uid) {
      return this.getOnlineStudentUidsSet().has(uid);
    }

    // 取得指定學生的當前小組物件
    getStudentGroup(studentUid) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) return null;
      for (const group of Object.values(this.activeGroupSet.groups)) {
        if (group && Array.isArray(group.memberUids) && group.memberUids.includes(studentUid)) {
          return group;
        }
      }
      return null;
    }

    // 取得目前小組統計摘要
    getActiveStats() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) {
        return { groupCount: 0, assignedCount: 0, unassignedCount: 0, totalPoints: 0 };
      }
      const groups = Object.values(this.activeGroupSet.groups);
      let assignedCount = 0;
      let totalPoints = 0;
      groups.forEach((g) => {
        assignedCount += (g.memberUids || []).length;
        totalPoints += parseInt(g.points, 10) || 0;
      });
      const unassignedCount = (this.activeGroupSet.unassignedUids || []).length;
      return {
        groupCount: groups.length,
        assignedCount,
        unassignedCount,
        totalPoints
      };
    }

    // ==========================================
    // 核心功能 1：自動分組演算法
    // ==========================================
    /**
     * @param {Object} options
     * @param {'bySize'|'byCount'} options.mode - 分組模式：依每組人數 (bySize) 或依總組數 (byCount)
     * @param {number} options.value - 人數或組數
     * @param {'online'|'all'} options.scope - 篩選範圍：僅線上學生 (online) 或全班學生 (all)
     * @param {'keep'|'unassign'} options.unassignedHandling - 未到課學生處理：保留於組內 (keep) 或暫移未分配區 (unassign)
     * @param {string} options.setName - 分組方案名稱 (可選)
     */
    async createAutoGroups(options = {}) {
      const mode = options.mode || 'bySize';
      const value = Math.max(1, parseInt(options.value, 10) || 4);
      const scope = options.scope || 'all';
      const unassignedHandling = options.unassignedHandling || 'keep';
      const setName = options.setName || `分組活動 (${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })})`;

      const studentsMap = this.getAllStudentsMap();
      const onlineSet = this.getOnlineStudentUidsSet();
      const allUids = Object.keys(studentsMap);

      if (allUids.length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前名冊尚無任何學生，無法進行分組。');
        }
        return false;
      }

      // 決定參與分組的名單
      let targetUids = [];
      let excludedUids = [];

      if (scope === 'online') {
        allUids.forEach((uid) => {
          if (onlineSet.has(uid)) {
            targetUids.push(uid);
          } else {
            excludedUids.push(uid);
          }
        });

        if (targetUids.length === 0) {
          if (this.app && this.app.showNotification) {
            this.app.showNotification('⚠️ 目前無任何線上學生，請確認同學已連線登入。');
          }
          return false;
        }
      } else {
        // 全班參與
        if (unassignedHandling === 'unassign') {
          // 若老師要求將未上線學生移出組別，則僅在線者入組，離線者入 unassigned
          allUids.forEach((uid) => {
            if (onlineSet.has(uid)) {
              targetUids.push(uid);
            } else {
              excludedUids.push(uid);
            }
          });
        } else {
          // 未上線學生亦保留在組內
          targetUids = [...allUids];
        }
      }

      // Fisher-Yates 隨機打散演算法
      for (let i = targetUids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targetUids[i], targetUids[j]] = [targetUids[j], targetUids[i]];
      }

      // 計算總組數
      let groupCount = 1;
      if (mode === 'bySize') {
        const perGroup = value;
        groupCount = Math.max(1, Math.ceil(targetUids.length / perGroup));
      } else {
        groupCount = Math.min(value, targetUids.length || 1);
      }

      // 均分學生至各小組
      const groups = {};
      for (let g = 0; g < groupCount; g++) {
        const gId = `grp_${Date.now()}_${g + 1}`;
        const color = this.PRESET_COLORS[g % this.PRESET_COLORS.length];
        groups[gId] = {
          id: gId,
          name: `第 ${g + 1} 組`,
          color: color,
          captainUid: null,
          memberUids: [],
          points: 0,
          pointsLog: {}
        };
      }

      const groupKeys = Object.keys(groups);
      targetUids.forEach((uid, idx) => {
        const targetGKey = groupKeys[idx % groupCount];
        groups[targetGKey].memberUids.push(uid);
        // 預設第一位組員暫定為組長，老師可自由更換
        if (!groups[targetGKey].captainUid) {
          groups[targetGKey].captainUid = uid;
        }
      });

      const newGroupSet = {
        id: `set_${Date.now()}`,
        name: setName,
        updatedAt: Date.now(),
        groups: groups,
        unassignedUids: excludedUids
      };

      await this.saveActiveGroupSet(newGroupSet);
      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🎉 已成功自動分為 ${groupCount} 組 (共 ${targetUids.length} 位同學入組)`);
      }
      return true;
    }

    // ==========================================
    // 核心功能 2：手動分組、換組、自訂與調整
    // ==========================================
    // 新增一組空白小組
    async createEmptyGroup(customName, customColor) {
      if (!this.activeGroupSet) {
        this.activeGroupSet = {
          id: `set_${Date.now()}`,
          name: '自訂分組',
          updatedAt: Date.now(),
          groups: {},
          unassignedUids: Object.keys(this.getAllStudentsMap())
        };
      }
      const existingCount = Object.keys(this.activeGroupSet.groups || {}).length;
      const gId = `grp_${Date.now()}_${existingCount + 1}`;
      const name = customName || `第 ${existingCount + 1} 組`;
      const color = customColor || this.PRESET_COLORS[existingCount % this.PRESET_COLORS.length];

      if (!this.activeGroupSet.groups) this.activeGroupSet.groups = {};
      this.activeGroupSet.groups[gId] = {
        id: gId,
        name: name,
        color: color,
        captainUid: null,
        memberUids: [],
        points: 0,
        pointsLog: {}
      };
      this.activeGroupSet.updatedAt = Date.now();

      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 刪除指定小組 (組員自動退回未分配清單)
    async deleteGroup(groupId) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const group = this.activeGroupSet.groups[groupId];
      const members = group.memberUids || [];

      if (!this.activeGroupSet.unassignedUids) this.activeGroupSet.unassignedUids = [];
      members.forEach((uid) => {
        if (!this.activeGroupSet.unassignedUids.includes(uid)) {
          this.activeGroupSet.unassignedUids.push(uid);
        }
      });

      delete this.activeGroupSet.groups[groupId];
      this.activeGroupSet.updatedAt = Date.now();

      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 更新組別名稱或顏色
    async updateGroupInfo(groupId, { name, color, captainUid }) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      if (name !== undefined) g.name = String(name).trim() || g.name;
      if (color !== undefined) g.color = color;
      if (captainUid !== undefined) g.captainUid = captainUid;
      this.activeGroupSet.updatedAt = Date.now();

      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 移動單一學生至指定組別 (或移至未分配清單)
    async moveStudentToGroup(studentUid, targetGroupId) {
      if (!this.activeGroupSet) return;
      if (!this.activeGroupSet.unassignedUids) this.activeGroupSet.unassignedUids = [];
      const groups = this.activeGroupSet.groups || {};

      // 1. 從所有現有小組與未分配清單中移出該學生
      this.activeGroupSet.unassignedUids = this.activeGroupSet.unassignedUids.filter((u) => u !== studentUid);
      Object.values(groups).forEach((g) => {
        if (Array.isArray(g.memberUids)) {
          g.memberUids = g.memberUids.filter((u) => u !== studentUid);
        }
        if (g.captainUid === studentUid) {
          g.captainUid = g.memberUids[0] || null;
        }
      });

      // 2. 加入目標小組或未分配清單
      if (targetGroupId && groups[targetGroupId]) {
        groups[targetGroupId].memberUids.push(studentUid);
        if (!groups[targetGroupId].captainUid) {
          groups[targetGroupId].captainUid = studentUid;
        }
      } else {
        this.activeGroupSet.unassignedUids.push(studentUid);
      }

      this.activeGroupSet.updatedAt = Date.now();
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 一鍵清空目前分組 (全部組員回歸未分配)
    async clearActiveGroups() {
      if (!this.activeGroupSet) return;
      const allStudents = Object.keys(this.getAllStudentsMap());
      this.activeGroupSet = {
        id: `set_${Date.now()}`,
        name: '未分組',
        updatedAt: Date.now(),
        groups: {},
        unassignedUids: allStudents
      };
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
    }

    // 一鍵移除當前未在線組員至未分配區
    async removeOfflineMembersToUnassigned() {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) return;
      const onlineSet = this.getOnlineStudentUidsSet();
      let movedCount = 0;

      if (!this.activeGroupSet.unassignedUids) this.activeGroupSet.unassignedUids = [];

      Object.values(this.activeGroupSet.groups).forEach((g) => {
        const remaining = [];
        (g.memberUids || []).forEach((uid) => {
          if (onlineSet.has(uid)) {
            remaining.push(uid);
          } else {
            this.activeGroupSet.unassignedUids.push(uid);
            movedCount++;
          }
        });
        g.memberUids = remaining;
        if (g.captainUid && !remaining.includes(g.captainUid)) {
          g.captainUid = remaining[0] || null;
        }
      });

      this.activeGroupSet.updatedAt = Date.now();
      await this.saveActiveGroupSet(this.activeGroupSet);
      this.renderAdminPanel();
      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🧹 已將 ${movedCount} 位未在線同學暫時移至未分配清單。`);
      }
    }

    // ==========================================
    // 核心功能 3：歷史分組記錄庫與載入
    // ==========================================
    // 將當前活躍組別儲存為歷史分組快照
    async saveCurrentToHistory(customName) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前尚未建立小組，無法儲存為歷史記錄。');
        }
        return false;
      }
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return false;

      const title = String(customName || '').trim() || this.activeGroupSet.name || `分組快照 (${new Date().toLocaleDateString('zh-TW')})`;
      const setId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const stats = this.getActiveStats();

      const snapshotData = {
        id: setId,
        name: title,
        createdAt: Date.now(),
        classCode: classCode,
        groupCount: stats.groupCount,
        assignedCount: stats.assignedCount,
        groups: JSON.parse(JSON.stringify(this.activeGroupSet.groups)),
        unassignedUids: [...(this.activeGroupSet.unassignedUids || [])]
      };

      const path = classCode ? `classes/${classCode}/groupSets/${setId}` : `groups/groupSets/${setId}`;
      await db.ref(path).set(snapshotData);

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`💾 已成功將「${title}」儲存至歷史分組記錄庫！`);
      }
      return true;
    }

    // 取得歷史分組快照清單
    async fetchHistoryGroupSets() {
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return [];

      const path = classCode ? `classes/${classCode}/groupSets` : 'groups/groupSets';
      const snap = await db.ref(path).once('value');
      const val = snap.val() || {};
      this.historyGroupSets = Object.values(val).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return this.historyGroupSets;
    }

    // 載入指定歷史分組快照
    /**
     * @param {string} setId
     * @param {Object} options
     * @param {'keep'|'unassign'} options.unassignedHandling - 未到課學生處理：'keep' (保留組內) 或 'unassign' (移出至未分配)
     */
    async loadHistoryGroupSet(setId, options = {}) {
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return false;

      const path = classCode ? `classes/${classCode}/groupSets/${setId}` : `groups/groupSets/${setId}`;
      const snap = await db.ref(path).once('value');
      const data = snap.val();

      if (!data || !data.groups) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 查無該筆歷史分組記錄。');
        }
        return false;
      }

      const unassignedHandling = options.unassignedHandling || 'keep';
      const onlineSet = this.getOnlineStudentUidsSet();
      const clonedGroups = JSON.parse(JSON.stringify(data.groups));
      const unassignedUids = [...(data.unassignedUids || [])];

      // 重設或保留積分（歷史載入時小組積分預設歸 0 重新開展活動）
      Object.values(clonedGroups).forEach((g) => {
        g.points = 0;
        g.pointsLog = {};

        if (unassignedHandling === 'unassign') {
          const validMembers = [];
          (g.memberUids || []).forEach((uid) => {
            if (onlineSet.has(uid)) {
              validMembers.push(uid);
            } else {
              unassignedUids.push(uid);
            }
          });
          g.memberUids = validMembers;
          if (g.captainUid && !validMembers.includes(g.captainUid)) {
            g.captainUid = validMembers[0] || null;
          }
        }
      });

      // 檢查是否有新加入但未在歷史記錄裡的學生，自動排入未分配清單
      const currentAllStudents = Object.keys(this.getAllStudentsMap());
      const historicalAllUids = new Set(unassignedUids);
      Object.values(clonedGroups).forEach((g) => {
        (g.memberUids || []).forEach((u) => historicalAllUids.add(u));
      });

      currentAllStudents.forEach((uid) => {
        if (!historicalAllUids.has(uid)) {
          unassignedUids.push(uid);
        }
      });

      const newActiveSet = {
        id: `set_${Date.now()}`,
        name: data.name,
        updatedAt: Date.now(),
        groups: clonedGroups,
        unassignedUids: unassignedUids
      };

      await this.saveActiveGroupSet(newActiveSet);

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🔄 已成功套用歷史分組：「${data.name}」！`);
      }
      return true;
    }

    // 刪除歷史分組記錄
    async deleteHistoryGroupSet(setId) {
      const db = this.getDb();
      const classCode = this.getActiveClassCode();
      if (!db) return false;

      const path = classCode ? `classes/${classCode}/groupSets/${setId}` : `groups/groupSets/${setId}`;
      await db.ref(path).remove();
      await this.fetchHistoryGroupSets();
      this.renderHistoryModalList();
      if (this.app && this.app.showNotification) {
        this.app.showNotification('🗑️ 已刪除該筆歷史分組記錄。');
      }
      return true;
    }

    // 匯出分組名冊為 CSV
    exportGroupSetCsv(groupSetData) {
      const data = groupSetData || this.activeGroupSet;
      if (!data || !data.groups) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification('⚠️ 目前無分組資料可匯出。');
        }
        return;
      }

      const studentsMap = this.getAllStudentsMap();
      const rows = [['組別名稱', '組長標記', '學生姓名', '座號', '使用者ID', '小組累計積分']];

      Object.values(data.groups).forEach((g) => {
        const isCaptain = (uid) => (g.captainUid === uid ? '組長' : '組員');
        (g.memberUids || []).forEach((uid) => {
          const st = studentsMap[uid] || {};
          rows.push([
            `"${(g.name || '').replace(/"/g, '""')}"`,
            `"${isCaptain(uid)}"`,
            `"${(st.name || uid).replace(/"/g, '""')}"`,
            `"${st.seatNumber || ''}"`,
            `"${uid}"`,
            `"${g.points || 0}"`
          ]);
        });
      });

      // 未分配學生
      (data.unassignedUids || []).forEach((uid) => {
        const st = studentsMap[uid] || {};
        rows.push([
          '"未分配名單"',
          '"-"',
          `"${(st.name || uid).replace(/"/g, '""')}"`,
          `"${st.seatNumber || ''}"`,
          `"${uid}"`,
          '"-"'
        ]);
      });

      const csvContent = '\uFEFF' + rows.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `學生分組名冊_${data.name || '課堂分組'}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // ==========================================
    // 核心功能 4：小組獨立積分與轉移機制
    // ==========================================
    // 為小組加減積分
    async addGroupPoints(groupId, deltaPoints, reason = '課堂小組表現優異') {
      const delta = parseInt(deltaPoints, 10);
      if (isNaN(delta) || delta === 0) return;
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;

      const g = this.activeGroupSet.groups[groupId];
      const curPts = parseInt(g.points, 10) || 0;
      const newPts = Math.max(0, curPts + delta);
      g.points = newPts;

      if (!g.pointsLog) g.pointsLog = {};
      const logId = `glog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      g.pointsLog[logId] = {
        id: logId,
        delta: delta,
        newPoints: newPts,
        reason: reason,
        timestamp: Date.now()
      };

      const classCode = this.getActiveClassCode();
      const db = this.getDb();
      if (db) {
        const path = classCode
          ? `classes/${classCode}/activeGroups/groups/${groupId}`
          : `groups/activeGroups/groups/${groupId}`;
        await db.ref(path).update({
          points: newPts,
          [`pointsLog/${logId}`]: g.pointsLog[logId]
        });
      }

      this.renderAdminPanel();

      if (this.app && this.app.showNotification) {
        this.app.showNotification(`🏆 已為【${g.name}】${delta > 0 ? `+${delta}` : delta} 點！`);
      }
    }

    // 小組積分轉移/派發至每位組員
    /**
     * @param {string} groupId - 目標小組 ID
     * @param {Object} options
     * @param {'split'|'equalReward'} options.method - 'split' (全額均分) 或 'equalReward' (全員等額獎勵)
     * @param {string} options.reason - 自訂轉移事由
     * @param {boolean} options.resetGroupPoints - 是否將小組積分歸零 (預設 true)
     */
    async transferGroupPointsToMembers(groupId, options = {}) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      const members = g.memberUids || [];
      const currentGroupPoints = parseInt(g.points, 10) || 0;

      if (members.length === 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification(`⚠️ 【${g.name}】目前組內無任何成員，無法進行轉移。`);
        }
        return;
      }

      if (currentGroupPoints <= 0) {
        if (this.app && this.app.showNotification) {
          this.app.showNotification(`⚠️ 【${g.name}】目前無累積小組點數可轉移。`);
        }
        return;
      }

      const method = options.method || 'split';
      const reasonPrefix = options.reason || '小組榮譽結算轉移';
      const resetGroupPoints = options.resetGroupPoints !== false;

      let perMemberDelta = 0;
      if (method === 'split') {
        perMemberDelta = Math.floor(currentGroupPoints / members.length);
        if (perMemberDelta <= 0) {
          perMemberDelta = 1; // 至少發給 1 點
        }
      } else {
        // 全員獲得與小組等額獎勵
        perMemberDelta = currentGroupPoints;
      }

      // 批次透過 app.adminQuickAdjustPoints 為每位學生加點並記錄
      for (const uid of members) {
        const fullReason = `${reasonPrefix}：【${g.name}】獲分配 +${perMemberDelta} 點`;
        if (this.app && typeof this.app.adminQuickAdjustPoints === 'function') {
          await this.app.adminQuickAdjustPoints(uid, perMemberDelta, fullReason);
        }
      }

      // 歸零或扣除小組積分
      if (resetGroupPoints) {
        g.points = 0;
        if (!g.pointsLog) g.pointsLog = {};
        const logId = `glog_trans_${Date.now()}`;
        g.pointsLog[logId] = {
          id: logId,
          delta: -currentGroupPoints,
          newPoints: 0,
          reason: `結算轉移至組員 (${method === 'split' ? '均分' : '全員同獎'})`,
          timestamp: Date.now()
        };

        const classCode = this.getActiveClassCode();
        const db = this.getDb();
        if (db) {
          const path = classCode
            ? `classes/${classCode}/activeGroups/groups/${groupId}`
            : `groups/activeGroups/groups/${groupId}`;
          await db.ref(path).update({
            points: 0,
            [`pointsLog/${logId}`]: g.pointsLog[logId]
          });
        }
      }

      this.renderAdminPanel();

      if (this.app && this.app.showNotification) {
        this.app.showNotification(
          `🎉 已成功將【${g.name}】點數轉移給 ${members.length} 位組員 (每人獲得 +${perMemberDelta} 點)！`
        );
      }
    }

    // ==========================================
    // 儲存與同步輔助
    // ==========================================
    async saveActiveGroupSet(setData) {
      this.activeGroupSet = setData;
      const classCode = this.getActiveClassCode();
      const db = this.getDb();
      if (!db) return;

      const path = classCode ? `classes/${classCode}/activeGroups` : 'groups/activeGroups';
      await db.ref(path).set(setData);
    }

    // ==========================================
    // UI 渲染：教師後台管理工作區
    // ==========================================
    renderAdminPanel() {
      const container = document.getElementById('adminGroupEmbeddedContainer');
      if (!container) return;

      const classCode = this.getActiveClassCode();
      const scopeBadge = document.getElementById('adminGroupPanelScopeBadge');
      if (scopeBadge) {
        scopeBadge.textContent = classCode ? `🏫 當前班級：${classCode}` : '🌱 一次性課堂';
      }

      const stats = this.getActiveStats();
      const statsBadge = document.getElementById('adminGroupStatsBadge');
      if (statsBadge) {
        statsBadge.textContent = `共 ${stats.groupCount} 組 · 入組 ${stats.assignedCount} 人 · 未分配 ${stats.unassignedCount} 人 · 累計小組積分 ${stats.totalPoints} 點`;
      }

      const studentsMap = this.getAllStudentsMap();
      const onlineSet = this.getOnlineStudentUidsSet();
      const groups = (this.activeGroupSet && this.activeGroupSet.groups) || {};
      const groupList = Object.values(groups);
      const unassignedUids = (this.activeGroupSet && this.activeGroupSet.unassignedUids) || [];

      // 若目前無分組且無未分配清單，初次引導
      if (groupList.length === 0 && unassignedUids.length === 0 && Object.keys(studentsMap).length > 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 48px 20px; background: var(--bg-input); border: 2px dashed var(--border-color); border-radius: 14px;">
            <div style="font-size: 40px; margin-bottom: 12px;">👥</div>
            <div style="font-size: 17px; font-weight: bold; color: var(--text-primary); margin-bottom: 8px;">課堂尚未進行分組</div>
            <p style="font-size: 14px; color: var(--text-secondary); max-width: 460px; margin: 0 auto 20px auto; line-height: 1.6;">
              支援依「每組人數」或「總組數」快速自動分組，亦可載入過往歷史分組記錄。
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button type="button" class="presentation-tool-btn purple" onclick="window.groupManager.openAutoGroupModal()" style="font-size: 14px; padding: 8px 18px; border-radius: 8px;">
                ⚡ 立即自動分組
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.createEmptyGroup()" style="font-size: 14px; padding: 8px 18px; border-radius: 8px;">
                ➕ 新增空組別手動分配
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openHistoryModal()" style="font-size: 14px; padding: 8px 18px; border-radius: 8px;">
                📂 從歷史記錄載入
              </button>
            </div>
          </div>
        `;
        return;
      }

      // 主工作區 HTML：上方操作列 + 左側/主區小組網格 + 右側未分配側欄
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <!-- 分組主工作區卡片佈局 -->
          <div style="display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 18px; align-items: start;" class="group-workspace-grid">
            
            <!-- 左側：小組卡片清單網格 -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                  <span>📋 課堂小組 (${groupList.length} 組)</span>
                  <span style="font-size: 14px; font-weight: normal; color: var(--text-secondary);">可拖曳學生名牌換組</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="presentation-tool-btn" onclick="window.groupManager.createEmptyGroup()" style="font-size: 14px; padding: 5px 12px; border-radius: 6px;" title="新增一個新組別">
                    ➕ 新增組別
                  </button>
                  <button type="button" class="presentation-tool-btn" onclick="window.groupManager.removeOfflineMembersToUnassigned()" style="font-size: 14px; padding: 5px 12px; border-radius: 6px;" title="將目前未連線的同學一鍵移至未分配清單">
                    🧹 排除離線學生
                  </button>
                </div>
              </div>

              ${groupList.length === 0 ? `
                <div style="text-align: center; padding: 36px; background: var(--bg-input); border-radius: 12px; color: var(--text-secondary); font-size: 14px;">
                  目前無小組，請點擊上方「⚡ 自動分組」或「➕ 新增組別」。
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;" id="groupCardsContainer">
                  ${groupList.map((g) => this.renderSingleGroupCard(g, studentsMap, onlineSet)).join('')}
                </div>
              `}
            </div>

            <!-- 右側：未分配學生專區 -->
            <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                  <span>⏳ 未分配名單</span>
                  <span style="background: rgba(245, 158, 11, 0.2); color: #d97706; padding: 2px 7px; border-radius: 8px; font-size: 14px; font-weight: bold;">
                    ${unassignedUids.length}
                  </span>
                </div>
                ${unassignedUids.length > 0 ? `
                  <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openAutoGroupModal({ forceUnassignedOnly: true })" style="font-size: 14px; padding: 3px 8px; border-radius: 6px;" title="將未分配同學自動分入現有組別">
                    ⚡ 自動補位
                  </button>
                ` : ''}
              </div>

              <div id="unassignedDropZone" 
                   ondragover="event.preventDefault(); this.style.borderColor='var(--accent-color)';" 
                   ondragleave="this.style.borderColor='var(--border-color)';" 
                   ondrop="window.groupManager.onDropToGroup(event, null)" 
                   style="display: flex; flex-direction: column; gap: 8px; min-height: 180px; max-height: 520px; overflow-y: auto; padding: 6px; border: 2px dashed var(--border-color); border-radius: 8px; transition: border-color 0.2s;">
                ${unassignedUids.length === 0 ? `
                  <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin: auto; padding: 20px;">
                    全班同學皆已入組 🎉
                  </div>
                ` : unassignedUids.map((uid) => this.renderStudentChip(uid, studentsMap[uid], onlineSet.has(uid), null)).join('')}
              </div>
              <div style="font-size: 14px; color: var(--text-muted); line-height: 1.4;">
                💡 提示：將上方學生名牌直接拖入左側小組即可完成加入。
              </div>
            </div>

          </div>
        </div>
      `;
    }

    // 渲染單一小組卡片
    renderSingleGroupCard(group, studentsMap, onlineSet) {
      const safeGid = String(group.id).replace(/'/g, "\\'");
      const safeName = this.escapeHtml(group.name);
      const color = group.color || '#3B82F6';
      const members = group.memberUids || [];
      const captainUid = group.captainUid;
      const points = parseInt(group.points, 10) || 0;

      return `
        <div class="group-admin-card" 
             id="card_${group.id}" 
             ondragover="event.preventDefault(); this.classList.add('drag-hover');" 
             ondragleave="this.classList.remove('drag-hover');" 
             ondrop="window.groupManager.onDropToGroup(event, '${safeGid}')" 
             style="background: var(--bg-card); border: 1px solid var(--border-color); border-top: 4px solid ${color}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow); transition: all 0.2s;">
          
          <!-- 組別卡片頂部：組名、顏色切換、小組點數、操作選單 -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1;">
              <input type="color" value="${color}" onchange="window.groupManager.updateGroupInfo('${safeGid}', { color: this.value })" title="更換小組代表色" style="width: 24px; height: 24px; padding: 0; border: none; border-radius: 50%; cursor: pointer; flex-shrink: 0; background: none;">
              <span style="font-weight: bold; font-size: 15px; color: var(--text-primary); cursor: pointer;" onclick="window.groupManager.promptRenameGroup('${safeGid}', '${safeName}')" title="點擊更換組名">
                ${safeName}
              </span>
              <span style="font-size: 14px; color: var(--text-secondary); flex-shrink: 0;">(${members.length}人)</span>
            </div>

            <!-- 小組點數徽章與快速加分 -->
            <div style="display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;">
              <div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: bold; font-size: 14px;" title="小組累計積分">
                <span>⭐️</span>
                <span>${points}</span>
              </div>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.addGroupPoints('${safeGid}', 1, '課堂小組發言優異')" title="小組 +1 點" style="padding: 2px 7px; font-size: 14px; font-weight: bold; color: #10b981; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px;">
                +1
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openGroupPointsModal('${safeGid}')" title="自訂小組加減分或事由" style="padding: 2px 7px; font-size: 14px; color: var(--text-primary); border-radius: 6px;">
                給點
              </button>
            </div>
          </div>

          <!-- 組員清單區域 -->
          <div style="display: flex; flex-direction: column; gap: 6px; min-height: 80px; padding: 6px; background: var(--bg-input); border-radius: 8px;">
            ${members.length === 0 ? `
              <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin: auto; padding: 14px;">
                尚未指派組員 (拖曳名牌至此)
              </div>
            ` : members.map((uid) => this.renderStudentChip(uid, studentsMap[uid], onlineSet.has(uid), group.id, captainUid === uid)).join('')}
          </div>

          <!-- 底部工具列：小組點數結算轉移 / 刪除小組 -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px dashed var(--border-color); font-size: 14px;">
            <button type="button" class="presentation-tool-btn" onclick="window.groupManager.openTransferModal('${safeGid}')" style="font-size: 14px; padding: 3px 8px; border-radius: 6px; color: #8b5cf6; background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.3);" title="將小組累積的積分結算並分配給組內成員">
              🎁 轉移給組員
            </button>
            <div style="display: flex; gap: 4px;">
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.deleteGroup('${safeGid}')" style="font-size: 14px; padding: 3px 8px; border-radius: 6px; color: #ef4444; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);" title="刪除此小組 (組員移至未分配清單)">
                🗑️
              </button>
            </div>
          </div>

        </div>
      `;
    }

    // 渲染學生標籤晶片 (支援 HTML5 拖曳)
    renderStudentChip(uid, studentData, isOnline, currentGroupId, isCaptain = false) {
      const safeUid = String(uid).replace(/'/g, "\\'");
      const safeName = this.escapeHtml((studentData && studentData.name) || uid);
      const avatarId = studentData ? studentData.avatar : 0;
      const avatarHtml = this.app && typeof this.app.renderAvatarHtml === 'function'
        ? this.app.renderAvatarHtml(avatarId, 24)
        : '👤';
      const points = (studentData && parseInt(studentData.points, 10)) || 0;

      return `
        <div class="student-drag-chip" 
             draggable="true" 
             ondragstart="window.groupManager.onDragStart(event, '${safeUid}', '${currentGroupId || ''}')" 
             style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; cursor: grab; user-select: none; gap: 6px; font-size: 14px;">
          
          <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1;">
            <div style="flex-shrink: 0;">${avatarHtml}</div>
            <!-- 線上綠點或離線灰點 -->
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isOnline ? '#10b981' : '#9ca3af'}; flex-shrink: 0;" title="${isOnline ? '線上連線中' : '目前離線'}"></span>
            <span style="font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${safeName}
            </span>
            ${isCaptain ? `
              <span style="background: rgba(245, 158, 11, 0.2); color: #d97706; padding: 1px 5px; border-radius: 4px; font-size: 14px; font-weight: bold; flex-shrink: 0;" title="組長">
                👑 組長
              </span>
            ` : ''}
          </div>

          <!-- 右側微型動作：設為組長 / 移出組別 -->
          <div style="display: inline-flex; align-items: center; gap: 2px; flex-shrink: 0;">
            <span style="font-size: 14px; color: var(--text-muted); margin-right: 2px;" title="個人點數">⭐️${points}</span>
            ${currentGroupId ? `
              ${!isCaptain ? `
                <button type="button" class="chip-action-btn" onclick="event.stopPropagation(); window.groupManager.updateGroupInfo('${currentGroupId}', { captainUid: '${safeUid}' })" title="設為組長" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px;">
                  👑
                </button>
              ` : ''}
              <button type="button" class="chip-action-btn" onclick="event.stopPropagation(); window.groupManager.moveStudentToGroup('${safeUid}', null)" title="移至未分配清單" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px; color: var(--text-muted);">
                ✕
              </button>
            ` : ''}
          </div>

        </div>
      `;
    }

    // ==========================================
    // 拖曳互動事件 (Drag & Drop)
    // ==========================================
    onDragStart(event, studentUid, fromGroupId) {
      this.draggedStudentUid = studentUid;
      this.draggedFromGroupId = fromGroupId || null;
      event.dataTransfer.setData('text/plain', studentUid);
      event.dataTransfer.effectAllowed = 'move';
    }

    onDropToGroup(event, targetGroupId) {
      event.preventDefault();
      document.querySelectorAll('.group-admin-card').forEach((el) => el.classList.remove('drag-hover'));
      const studentUid = this.draggedStudentUid || event.dataTransfer.getData('text/plain');
      if (!studentUid) return;

      this.moveStudentToGroup(studentUid, targetGroupId);
      this.draggedStudentUid = null;
      this.draggedFromGroupId = null;
    }

    // 彈窗與使用者互動
    promptRenameGroup(groupId, currentName) {
      const newName = prompt('請輸入新的小組名稱：', currentName);
      if (newName && newName.trim()) {
        this.updateGroupInfo(groupId, { name: newName.trim() });
      }
    }

    // 開啟「自動分組設定彈窗」
    openAutoGroupModal(options = {}) {
      const modal = document.getElementById('adminAutoGroupModal');
      if (!modal) return;
      modal.style.display = 'flex';

      const stats = this.getActiveStats();
      const onlineCount = this.getOnlineStudentUidsSet().size;
      const totalStudents = Object.keys(this.getAllStudentsMap()).length;

      const infoBadge = document.getElementById('autoGroupStudentCountInfo');
      if (infoBadge) {
        infoBadge.innerHTML = `名冊總額：<strong>${totalStudents}</strong> 人 · 目前線上連線中：<strong style="color: #10b981;">${onlineCount}</strong> 人`;
      }
    }

    closeAutoGroupModal() {
      const modal = document.getElementById('adminAutoGroupModal');
      if (modal) modal.style.display = 'none';
    }

    // 確認執行自動分組
    async confirmAutoGroup() {
      const modeEl = document.querySelector('input[name="autoGroupMode"]:checked');
      const mode = modeEl ? modeEl.value : 'bySize';
      const valEl = document.getElementById('autoGroupValueInput');
      const value = parseInt(valEl ? valEl.value : 4, 10) || 4;

      const scopeEl = document.querySelector('input[name="autoGroupScope"]:checked');
      const scope = scopeEl ? scopeEl.value : 'all';

      const unassignedEl = document.querySelector('input[name="autoGroupUnassigned"]:checked');
      const unassignedHandling = unassignedEl ? unassignedEl.value : 'keep';

      const titleInput = document.getElementById('autoGroupNameInput');
      const setName = (titleInput && titleInput.value.trim()) || `分組活動 (${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })})`;

      this.closeAutoGroupModal();
      await this.createAutoGroups({
        mode,
        value,
        scope,
        unassignedHandling,
        setName
      });
    }

    // 開啟「歷史分組庫彈窗」
    async openHistoryModal() {
      const modal = document.getElementById('adminGroupHistoryModal');
      if (!modal) return;
      modal.style.display = 'flex';
      await this.fetchHistoryGroupSets();
      this.renderHistoryModalList();
    }

    closeHistoryModal() {
      const modal = document.getElementById('adminGroupHistoryModal');
      if (modal) modal.style.display = 'none';
    }

    renderHistoryModalList() {
      const container = document.getElementById('adminGroupHistoryListContainer');
      if (!container) return;

      if (!this.historyGroupSets || this.historyGroupSets.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; color: var(--text-secondary); font-size: 14px; padding: 40px; background: var(--bg-input); border-radius: 10px;">
            🌱 尚無歷史分組記錄。可將目前的活躍小組儲存為歷史記錄以供往後重新套用。
          </div>
        `;
        return;
      }

      container.innerHTML = this.historyGroupSets.map((set) => {
        const safeId = String(set.id).replace(/'/g, "\\'");
        const safeName = this.escapeHtml(set.name);
        const timeStr = set.createdAt ? new Date(set.createdAt).toLocaleString('zh-TW') : '';

        return `
          <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: bold; font-size: 15px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <span>📁 ${safeName}</span>
                <span style="font-size: 14px; font-weight: normal; color: var(--text-secondary);">${timeStr}</span>
              </div>
              <div style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">
                共 <strong>${set.groupCount || 0}</strong> 組 · 組員 <strong>${set.assignedCount || 0}</strong> 人
              </div>
            </div>

            <div style="display: flex; gap: 6px; align-items: center;">
              <button type="button" class="presentation-tool-btn purple" onclick="window.groupManager.promptLoadHistorySet('${safeId}', '${safeName}')" style="font-size: 14px; padding: 5px 12px; border-radius: 6px;" title="套用此歷史分組為課堂當前組別">
                🔄 重新套用
              </button>
              <button type="button" class="presentation-tool-btn" onclick="window.groupManager.deleteHistoryGroupSet('${safeId}')" style="font-size: 14px; padding: 5px 10px; border-radius: 6px; color: #ef4444;" title="刪除此筆記錄">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // 提示套用歷史分組與未到課學生處理
    promptLoadHistorySet(setId, setName) {
      const choice = confirm(
        `確定要重新套用歷史分組「${setName}」嗎？\n\n【確定】：保留未在線學生於原組別中等候上線。\n【取消】：僅將目前在線學生排入組別，未上線者移出至未分配名單。`
      );
      this.closeHistoryModal();
      this.loadHistoryGroupSet(setId, { unassignedHandling: choice ? 'keep' : 'unassign' });
    }

    // 開啟「儲存當前分組為歷史記錄彈窗」
    openSaveHistoryModal() {
      const defaultName = (this.activeGroupSet && this.activeGroupSet.name) || `課堂分組 (${new Date().toLocaleDateString('zh-TW')})`;
      const name = prompt('請輸入此分組方案的歷史記錄名稱：', defaultName);
      if (name && name.trim()) {
        this.saveCurrentToHistory(name.trim());
      }
    }

    // 開啟「小組給點彈窗」
    openGroupPointsModal(groupId) {
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];
      const delta = prompt(`請輸入為【${g.name}】加減的點數 (例如 5 或 -2)：`, '2');
      if (delta === null) return;
      const val = parseInt(delta, 10);
      if (isNaN(val) || val === 0) return;
      const reason = prompt(`請輸入給點事由：`, '課堂小組活動表現優異');
      this.addGroupPoints(groupId, val, reason || '課堂小組活動表現優異');
    }

    // 開啟「小組積分結算轉移彈窗」
    openTransferModal(groupId) {
      const modal = document.getElementById('adminGroupTransferModal');
      if (!modal) return;
      if (!this.activeGroupSet || !this.activeGroupSet.groups || !this.activeGroupSet.groups[groupId]) return;
      const g = this.activeGroupSet.groups[groupId];

      this.currentTransferGroupId = groupId;
      modal.style.display = 'flex';

      const infoEl = document.getElementById('groupTransferTargetInfo');
      if (infoEl) {
        infoEl.innerHTML = `
          目標小組：<strong style="color: ${g.color || 'var(--accent-color)'}; font-size: 15px;">${this.escapeHtml(g.name)}</strong>
          · 目前小組累計積分：<strong style="color: #d97706; font-size: 15px;">⭐️ ${g.points || 0} 點</strong>
          · 成員人數：<strong>${(g.memberUids || []).length}</strong> 人
        `;
      }
    }

    closeTransferModal() {
      const modal = document.getElementById('adminGroupTransferModal');
      if (modal) modal.style.display = 'none';
      this.currentTransferGroupId = null;
    }

    async confirmTransferPoints() {
      const groupId = this.currentTransferGroupId;
      if (!groupId) return;

      const methodEl = document.querySelector('input[name="groupTransferMethod"]:checked');
      const method = methodEl ? methodEl.value : 'split';

      const resetEl = document.getElementById('chkGroupTransferReset');
      const resetGroupPoints = resetEl ? resetEl.checked : true;

      const reasonEl = document.getElementById('groupTransferReasonInput');
      const reason = (reasonEl && reasonEl.value.trim()) || '小組積分結算分配';

      this.closeTransferModal();
      await this.transferGroupPointsToMembers(groupId, {
        method,
        reason,
        resetGroupPoints
      });
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  // 掛載於全域
  window.GroupManager = GroupManager;
  window.groupManager = new GroupManager();

  // 頁面載入後自動掛載
  document.addEventListener('DOMContentLoaded', () => {
    if (window.app) {
      window.groupManager.init(window.app);
    }
  });
})();
