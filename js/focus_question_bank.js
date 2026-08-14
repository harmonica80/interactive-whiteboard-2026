/**
 * Focus Question Bank Manager (專注力測驗題庫管理系統)
 * 支援單元：
 * 1. classicsQuiz: 📜 唐詩宋詞・成語典故 (選擇題)
 * 2. characterTest: ✍️ 一字千金：字力測驗 (手寫/輸入)
 * 3. characterCrossword: ✍️ 一字千金：字字珠璣 (十字選字)
 * 4. characterUnitedWords: ✍️ 一字千金：團結一詞 (部件組詞)
 */
(function (global) {
  'use strict';

  class FocusQuestionBankManager {
    constructor() {
      this.STORAGE_PREFIX = 'focus_qb_v1_';
      this.currentActiveType = 'classicsQuiz';
      this.searchKeywords = {
        classicsQuiz: '',
        characterTest: '',
        characterCrossword: '',
        characterUnitedWords: ''
      };
      this.editingIndex = -1;
    }

    // 取得指定單元的原廠預設題庫
    getDefaultPool(type) {
      if (type === 'classicsQuiz') {
        return (global.CLASSICS_QUIZ_POOL && Array.isArray(global.CLASSICS_QUIZ_POOL))
          ? JSON.parse(JSON.stringify(global.CLASSICS_QUIZ_POOL))
          : [];
      }
      if (type === 'characterTest') {
        return (typeof CHARACTER_TEST_POOL !== 'undefined' && Array.isArray(CHARACTER_TEST_POOL))
          ? JSON.parse(JSON.stringify(CHARACTER_TEST_POOL))
          : [];
      }
      if (type === 'characterCrossword') {
        return (typeof CHARACTER_CROSSWORD_POOL !== 'undefined' && Array.isArray(CHARACTER_CROSSWORD_POOL))
          ? JSON.parse(JSON.stringify(CHARACTER_CROSSWORD_POOL))
          : [];
      }
      if (type === 'characterUnitedWords') {
        return (typeof CHARACTER_UNITED_WORDS_POOL !== 'undefined' && Array.isArray(CHARACTER_UNITED_WORDS_POOL))
          ? JSON.parse(JSON.stringify(CHARACTER_UNITED_WORDS_POOL))
          : [];
      }
      return [];
    }

    // 取得指定單元目前啟用的題庫（優先讀取 localStorage，若無則讀取原廠預設）
    getPool(type) {
      try {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + type);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to load stored question bank for ' + type, e);
      }
      return this.getDefaultPool(type);
    }

    // 檢查目前是否為自訂題庫
    isCustomPool(type) {
      try {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + type);
        return !!stored;
      } catch (e) {
        return false;
      }
    }

    // 儲存題庫至 localStorage
    savePool(type, pool) {
      try {
        localStorage.setItem(this.STORAGE_PREFIX + type, JSON.stringify(pool));
        this.updateAdminBadge(type);
        return true;
      } catch (e) {
        console.error('Failed to save question bank to localStorage', e);
        return false;
      }
    }

    // 恢復原廠預設題庫
    resetPool(type) {
      localStorage.removeItem(this.STORAGE_PREFIX + type);
      this.updateAdminBadge(type);
    }

    // 取得單元中文名稱
    getTypeName(type) {
      const names = {
        classicsQuiz: '唐詩宋詞・成語典故',
        characterTest: '一字千金：字力測驗',
        characterCrossword: '一字千金：字字珠璣',
        characterUnitedWords: '一字千金：團結一詞'
      };
      return names[type] || type;
    }

    // 關鍵字搜尋過濾
    searchPool(type, query = '') {
      const pool = this.getPool(type);
      const q = (query || '').trim().toLowerCase();
      if (!q) return pool.map((item, idx) => ({ ...item, _originalIndex: idx }));

      return pool
        .map((item, idx) => ({ ...item, _originalIndex: idx }))
        .filter((item) => {
          if (type === 'classicsQuiz') {
            return (
              (item.title && item.title.toLowerCase().includes(q)) ||
              (item.author && item.author.toLowerCase().includes(q)) ||
              (item.dynasty && item.dynasty.toLowerCase().includes(q)) ||
              (item.quote && item.quote.toLowerCase().includes(q)) ||
              (item.prompt && item.prompt.toLowerCase().includes(q)) ||
              (item.answer && item.answer.toLowerCase().includes(q)) ||
              (item.fullPoem && item.fullPoem.toLowerCase().includes(q))
            );
          }
          if (type === 'characterTest') {
            return (
              (item.char && item.char.toLowerCase().includes(q)) ||
              (item.zhuyin && item.zhuyin.toLowerCase().includes(q)) ||
              (item.clue && item.clue.toLowerCase().includes(q)) ||
              (item.searchWord && item.searchWord.toLowerCase().includes(q))
            );
          }
          if (type === 'characterCrossword') {
            return (
              (item.centerChar && item.centerChar.toLowerCase().includes(q)) ||
              (item.topWord && item.topWord.toLowerCase().includes(q)) ||
              (item.bottomWord && item.bottomWord.toLowerCase().includes(q)) ||
              (item.leftWord && item.leftWord.toLowerCase().includes(q)) ||
              (item.rightWord && item.rightWord.toLowerCase().includes(q)) ||
              (item.searchWord && item.searchWord.toLowerCase().includes(q))
            );
          }
          if (type === 'characterUnitedWords') {
            return (
              (item.word && item.word.toLowerCase().includes(q)) ||
              (item.p1 && item.p1.toLowerCase().includes(q)) ||
              (item.p2 && item.p2.toLowerCase().includes(q)) ||
              (item.clue && item.clue.toLowerCase().includes(q)) ||
              (item.searchWord && item.searchWord.toLowerCase().includes(q)) ||
              (Array.isArray(item.parts) && item.parts.join('').includes(q))
            );
          }
          return false;
        });
    }

    // 匯出題庫為 JSON 檔案
    exportPool(type) {
      const pool = this.getPool(type);
      const dataStr = JSON.stringify(pool, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${type}_question_bank_${new Date().toISOString().slice(0, 10)}.json`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 取得範本資料物件
    getTemplateData(type) {
      if (type === 'classicsQuiz') {
        return [
          {
            "id": "poetry_sample_1",
            "type": "poetry",
            "title": "將進酒",
            "author": "李白",
            "dynasty": "唐",
            "quote": "天生我材必有用，千金散盡還復來。",
            "prompt": "「天生我材必有用，千金散盡還復來。」是哪一位詩人的名句？",
            "options": ["李白", "杜甫", "王維", "白居易"],
            "answer": "李白",
            "fullPoem": "君不見黃河之水天上來，奔流到海不復回。君不見高堂明鏡悲白髮，朝如青絲暮成雪。人生得意須盡歡，莫使金樽空對月。天生我材必有用，千金散盡還復來。",
            "links": {
              "sinoreading": "https://www.google.com/search?q=將進酒+中讀網",
              "wikisource": "https://zh.wikisource.org/wiki/將進酒_(李白)",
              "wikipedia": "https://zh.wikipedia.org/wiki/將進酒"
            }
          },
          {
            "id": "idiom_sample_2",
            "type": "idiom",
            "title": "畫蛇添足",
            "author": "劉向",
            "dynasty": "西漢",
            "quote": "蛇固無足，子安能為之足？",
            "prompt": "「蛇固無足，子安能為之足？」出自哪一個著名成語典故？",
            "options": ["畫蛇添足", "掩耳盜鈴", "亡羊補牢", "自相矛盾"],
            "answer": "畫蛇添足",
            "fullPoem": "楚有祠者，賜其舍人卮酒。舍人相謂曰：「數人飲之不足，一人飲之有餘。請畫地為蛇，先成者飲酒。」一人蛇先成，引酒且飲之，乃左手持卮，右手畫蛇，曰：「吾能為之足。」未成，一人之蛇成，奪其卮曰：「蛇固無足，子安能為之足？」遂飲其酒。為蛇足者，終亡其酒。",
            "links": {
              "sinoreading": "https://www.google.com/search?q=畫蛇添足+中讀網",
              "wikisource": "https://zh.wikisource.org/wiki/戰國策/卷09#楚一",
              "wikipedia": "https://zh.wikipedia.org/wiki/畫蛇添足"
            }
          }
        ];
      }
      if (type === 'characterTest') {
        return [
          {
            "char": "足",
            "zhuyin": "ㄗㄨˊ",
            "clue": "畫蛇添（　）",
            "searchWord": "畫蛇添足"
          },
          {
            "char": "兔",
            "zhuyin": "ㄊㄨˋ",
            "clue": "守株待（　）",
            "searchWord": "守株待兔"
          }
        ];
      }
      if (type === 'characterCrossword') {
        return [
          {
            "centerChar": "天",
            "topWord": "藍",
            "bottomWord": "地",
            "leftWord": "今",
            "rightWord": "下",
            "searchWord": "藍天、天地、今天、天下"
          },
          {
            "centerChar": "風",
            "topWord": "春",
            "bottomWord": "雨",
            "leftWord": "微",
            "rightWord": "光",
            "searchWord": "春風、風雨、微風、風光"
          }
        ];
      }
      if (type === 'characterUnitedWords') {
        return [
          {
            "word": "森林",
            "p1": "木木木",
            "p2": "木木",
            "parts": ["木", "木", "木", "木", "木"],
            "clue": "大片生長樹木的廣大土地",
            "searchWord": "森林"
          },
          {
            "word": "品嚐",
            "p1": "口口口",
            "p2": "龸口日小",
            "parts": ["口", "口", "口", "龸", "口", "日", "小"],
            "clue": "仔細辨別食物的滋味",
            "searchWord": "品嚐"
          }
        ];
      }
      return [];
    }

    // 下載標準範本檔案
    downloadTemplate(type) {
      const templateData = this.getTemplateData(type);
      const dataStr = JSON.stringify(templateData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${type}_template_範本.json`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // 驗證並匯入題庫
    importPool(type, jsonStr, mode = 'replace') {
      let data;
      try {
        data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      } catch (e) {
        throw new Error('JSON 格式錯誤，請確認檔案內容符合標準 JSON 語法！');
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('匯入資料必須為非空的 JSON 陣列（[ ... ]）！');
      }

      // 依單元進行欄位驗證與補齊防呆
      const validatedList = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!item || typeof item !== 'object') {
          throw new Error(`第 ${i + 1} 筆題目格式無效！`);
        }

        if (type === 'classicsQuiz') {
          if (!item.title || !item.answer) {
            throw new Error(`第 ${i + 1} 筆唐詩宋詞題目缺少必要欄位（title、answer）！`);
          }
          const options = Array.isArray(item.options) && item.options.length === 4
            ? item.options
            : [item.answer, '李白', '杜甫', '蘇軾'].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 4);
          
          if (!options.includes(item.answer)) {
            options[0] = item.answer;
          }

          validatedList.push({
            id: item.id || `custom_q_${Date.now()}_${i}`,
            type: item.type || (item.author ? 'poetry' : 'idiom'),
            title: String(item.title).trim(),
            author: String(item.author || '').trim(),
            dynasty: String(item.dynasty || '').trim(),
            quote: String(item.quote || item.title).trim(),
            prompt: String(item.prompt || `「${item.quote || item.title}」是哪一位詩人的名句？`).trim(),
            options: options.map(String),
            answer: String(item.answer).trim(),
            fullPoem: String(item.fullPoem || item.quote || '').trim(),
            links: item.links || {
              sinoreading: `https://www.google.com/search?q=${encodeURIComponent(item.title + ' 中讀網')}`,
              wikisource: `https://zh.wikisource.org/wiki/${encodeURIComponent(item.title)}`,
              wikipedia: `https://zh.wikipedia.org/wiki/${encodeURIComponent(item.title)}`
            }
          });
        } else if (type === 'characterTest') {
          if (!item.char || !item.clue) {
            throw new Error(`第 ${i + 1} 筆字力測驗題目缺少必要欄位（char、clue）！`);
          }
          validatedList.push({
            char: String(item.char).trim(),
            zhuyin: String(item.zhuyin || '').trim(),
            clue: String(item.clue).trim(),
            searchWord: String(item.searchWord || item.clue.replace(/[（(].*?[）)]/g, item.char)).trim()
          });
        } else if (type === 'characterCrossword') {
          if (!item.centerChar) {
            throw new Error(`第 ${i + 1} 筆字字珠璣題目缺少 centerChar 中心字！`);
          }
          validatedList.push({
            centerChar: String(item.centerChar).trim(),
            topWord: String(item.topWord || '').trim(),
            bottomWord: String(item.bottomWord || '').trim(),
            leftWord: String(item.leftWord || '').trim(),
            rightWord: String(item.rightWord || '').trim(),
            searchWord: String(item.searchWord || '').trim()
          });
        } else if (type === 'characterUnitedWords') {
          if (!item.word) {
            throw new Error(`第 ${i + 1} 筆團結一詞題目缺少 word 詞語！`);
          }
          const parts = Array.isArray(item.parts) ? item.parts : String(item.p1 || '' + item.p2 || '').split('');
          validatedList.push({
            word: String(item.word).trim(),
            p1: String(item.p1 || '').trim(),
            p2: String(item.p2 || '').trim(),
            parts: parts.map(String),
            clue: String(item.clue || '').trim(),
            searchWord: String(item.searchWord || item.word).trim()
          });
        }
      }

      let finalPool = validatedList;
      if (mode === 'append') {
        const current = this.getPool(type);
        finalPool = current.concat(validatedList);
      }

      this.savePool(type, finalPool);
      return finalPool.length;
    }

    // 刪除指定索引之題目
    deleteQuestion(type, originalIndex) {
      const pool = this.getPool(type);
      if (originalIndex >= 0 && originalIndex < pool.length) {
        pool.splice(originalIndex, 1);
        this.savePool(type, pool);
        return true;
      }
      return false;
    }

    // 新增或儲存題目
    saveQuestion(type, questionData, originalIndex = -1) {
      const pool = this.getPool(type);
      if (originalIndex >= 0 && originalIndex < pool.length) {
        pool[originalIndex] = questionData;
      } else {
        pool.unshift(questionData); // 新增在最前面
      }
      this.savePool(type, pool);
    }

    // 更新管理後台的題庫狀態徽章
    updateAdminBadge(type) {
      const badge = document.getElementById(`focusQbBadge_${type}`);
      if (badge) {
        const pool = this.getPool(type);
        const isCustom = this.isCustomPool(type);
        badge.innerHTML = isCustom
          ? `<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">自訂題庫：共 ${pool.length} 題</span>`
          : `<span style="background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">預設題庫：共 ${pool.length} 題</span>`;
      }
    }

    // 開啟題庫管理中心彈窗
    openModal(type = 'classicsQuiz') {
      this.currentActiveType = type;
      const modal = document.getElementById('modal-focus-question-bank');
      if (!modal) return;
      modal.style.display = 'flex';
      this.switchTab(type);
    }

    // 關閉題庫管理中心彈窗
    closeModal() {
      const modal = document.getElementById('modal-focus-question-bank');
      if (modal) modal.style.display = 'none';
      this.closeQuestionEditForm();
    }

    // 切換彈窗內的單元頁籤
    switchTab(type) {
      this.currentActiveType = type;
      this.editingIndex = -1;
      this.closeQuestionEditForm();

      // 更新頁籤按鈕樣式
      const tabs = document.querySelectorAll('.focus-qb-tab-btn');
      tabs.forEach((tab) => {
        if (tab.dataset.type === type) {
          tab.classList.add('active');
          tab.style.background = 'var(--accent-color)';
          tab.style.color = '#ffffff';
          tab.style.borderColor = 'var(--accent-color)';
        } else {
          tab.classList.remove('active');
          tab.style.background = 'var(--bg-card)';
          tab.style.color = 'var(--text-primary)';
          tab.style.borderColor = 'var(--border-color)';
        }
      });

      // 渲染題庫統計與清單
      const searchInput = document.getElementById('focusQbSearchInput');
      if (searchInput) {
        searchInput.value = this.searchKeywords[type] || '';
      }
      this.renderList();
    }

    // 渲染題目清單
    renderList() {
      const type = this.currentActiveType;
      const query = this.searchKeywords[type] || '';
      const listContainer = document.getElementById('focusQbListContainer');
      const countEl = document.getElementById('focusQbCountBadge');
      if (!listContainer) return;

      const totalPool = this.getPool(type);
      const filtered = this.searchPool(type, query);
      const isCustom = this.isCustomPool(type);

      if (countEl) {
        countEl.innerHTML = query
          ? `🔍 搜尋符合：<strong>${filtered.length}</strong> / 全部 ${totalPool.length} 題 ${isCustom ? '(自訂題庫)' : '(預設題庫)'}`
          : `📚 題庫總計：<strong>${totalPool.length}</strong> 題 ${isCustom ? '(自訂題庫)' : '(預設題庫)'}`;
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 36px; margin-bottom: 8px;">📭</div>
            <div style="font-size: 15px; font-weight: bold;">查無符合「${query}」的題目</div>
            <div style="font-size: 12px; margin-top: 4px;">您可以清除搜尋關鍵字，或點選上方「➕ 新增題目」！</div>
          </div>
        `;
        return;
      }

      let html = '';
      filtered.forEach((item, displayIdx) => {
        const origIdx = item._originalIndex;
        let contentHtml = '';

        if (type === 'classicsQuiz') {
          contentHtml = `
            <div style="font-weight: bold; font-size: 15px; color: var(--text-primary); margin-bottom: 6px;">
              ${displayIdx + 1}. 「${this.highlightText(item.quote || item.title, query)}」
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 6px;">
              <span><strong>作者：</strong>${this.highlightText(item.author || '無', query)} (${item.dynasty || '朝代'})</span>
              <span><strong>作品：</strong>${this.highlightText(item.title, query)}</span>
              <span style="color: #10b981;"><strong>正解：</strong>${item.answer}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5; background: var(--bg-input); padding: 8px; border-radius: 6px;">
              <strong>選項：</strong>${(item.options || []).map(opt => opt === item.answer ? `<span style="color: #10b981; font-weight:bold;">${opt} (正解)</span>` : opt).join('、 ')}
            </div>
          `;
        } else if (type === 'characterTest') {
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-size: 28px; font-weight: bold; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(0,122,255,0.1); border-radius: 8px; color: var(--accent-color);">
                ${this.highlightText(item.char, query)}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 15px; font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">
                  ${displayIdx + 1}. 提示：${this.highlightText(item.clue, query)}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; gap: 12px;">
                  <span><strong>注音：</strong>${item.zhuyin || '無'}</span>
                  <span><strong>關聯詞：</strong>${this.highlightText(item.searchWord || '無', query)}</span>
                </div>
              </div>
            </div>
          `;
        } else if (type === 'characterCrossword') {
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-size: 24px; font-weight: bold; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(16,185,129,0.1); border-radius: 8px; color: #10b981;">
                ${this.highlightText(item.centerChar, query)}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 14px; font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">
                  ${displayIdx + 1}. 中心字【${this.highlightText(item.centerChar, query)}】
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 10px;">
                  <span>上：${item.topWord}</span>
                  <span>下：${item.bottomWord}</span>
                  <span>左：${item.leftWord}</span>
                  <span>右：${item.rightWord}</span>
                  <span>詞語：${this.highlightText(item.searchWord || '', query)}</span>
                </div>
              </div>
            </div>
          `;
        } else if (type === 'characterUnitedWords') {
          contentHtml = `
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="font-size: 22px; font-weight: bold; padding: 6px 12px; display: flex; align-items: center; justify-content: center; background: rgba(245,158,11,0.1); border-radius: 8px; color: #f59e0b;">
                ${this.highlightText(item.word, query)}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 14px; font-weight: bold; color: var(--text-primary); margin-bottom: 4px;">
                  ${displayIdx + 1}. 部件拆解：${(item.parts || []).join(' + ')}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary);">
                  <span><strong>解釋提示：</strong>${this.highlightText(item.clue || '無', query)}</span>
                </div>
              </div>
            </div>
          `;
        }

        html += `
          <div class="focus-qb-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="flex: 1; min-width: 0;">${contentHtml}</div>
            <div style="display: flex; gap: 8px; flex-shrink: 0;">
              <button onclick="window.focusQB.openQuestionEditForm(${origIdx})" title="編輯題目" style="background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                ✏️ 編輯
              </button>
              <button onclick="window.focusQB.handleDeleteQuestion(${origIdx})" title="刪除題目" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                🗑️ 刪除
              </button>
            </div>
          </div>
        `;
      });

      listContainer.innerHTML = html;
    }

    // 搜尋高亮關鍵字
    highlightText(text, query) {
      if (!text) return '';
      if (!query) return text;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return String(text).replace(regex, '<span style="background: #fef08a; color: #854d0e; padding: 0 2px; border-radius: 2px; font-weight:bold;">$1</span>');
    }

    // 關鍵字搜尋輸入處理
    handleSearchInput(val) {
      this.searchKeywords[this.currentActiveType] = val;
      this.renderList();
    }

    // 刪除題目事件處理
    handleDeleteQuestion(originalIndex) {
      const type = this.currentActiveType;
      const pool = this.getPool(type);
      const item = pool[originalIndex];
      const name = item.title || item.char || item.centerChar || item.word || `第 ${originalIndex + 1} 題`;
      if (confirm(`確定要刪除題目「${name}」嗎？`)) {
        this.deleteQuestion(type, originalIndex);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', '題目已成功刪除！');
        }
        this.renderList();
        this.updateAdminBadge(type);
      }
    }

    // 打開新增/編輯題目表單
    openQuestionEditForm(originalIndex = -1) {
      this.editingIndex = originalIndex;
      const type = this.currentActiveType;
      const formContainer = document.getElementById('focusQbEditFormContainer');
      const formTitle = document.getElementById('focusQbEditFormTitle');
      const fieldsContainer = document.getElementById('focusQbFormFields');
      if (!formContainer || !fieldsContainer) return;

      const isEdit = originalIndex >= 0;
      const pool = this.getPool(type);
      const item = isEdit ? pool[originalIndex] : {};

      if (formTitle) {
        formTitle.textContent = isEdit ? `✏️ 編輯題目 (${this.getTypeName(type)})` : `➕ 新增題目 (${this.getTypeName(type)})`;
      }

      let fieldsHtml = '';
      if (type === 'classicsQuiz') {
        const opts = item.options || ['', '', '', ''];
        fieldsHtml = `
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">作品名 / 典故名 *</label>
              <input type="text" id="qb_input_title" value="${item.title || ''}" placeholder="例如：水調歌頭 或 畫蛇添足" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">作者 / 出處</label>
              <input type="text" id="qb_input_author" value="${item.author || ''}" placeholder="例如：蘇軾" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">朝代</label>
              <input type="text" id="qb_input_dynasty" value="${item.dynasty || ''}" placeholder="例如：宋" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">名句 / 詩詞名句引言 *</label>
            <input type="text" id="qb_input_quote" value="${item.quote || ''}" placeholder="例如：但願人長久，千里共嬋娟。" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 1 (A)</label>
              <input type="text" id="qb_input_opt0" value="${opts[0] || ''}" placeholder="選項A" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 2 (B)</label>
              <input type="text" id="qb_input_opt1" value="${opts[1] || ''}" placeholder="選項B" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 3 (C)</label>
              <input type="text" id="qb_input_opt2" value="${opts[2] || ''}" placeholder="選項C" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">選項 4 (D)</label>
              <input type="text" id="qb_input_opt3" value="${opts[3] || ''}" placeholder="選項D" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px; color:#10b981;">標準解答 (必須與上方其中一個選項完全一致) *</label>
            <input type="text" id="qb_input_answer" value="${item.answer || ''}" placeholder="例如：蘇軾 或 水調歌頭" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid #10b981; background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">原典 / 完整詩詞全文 (作答後解析與複習呈現)</label>
            <textarea id="qb_input_fullPoem" rows="3" placeholder="請輸入完整詩詞原文..." class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-family:inherit;">${item.fullPoem || ''}</textarea>
          </div>
        `;
      } else if (type === 'characterTest') {
        fieldsHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">正字 (解答單字) *</label>
              <input type="text" id="qb_input_char" maxlength="1" value="${item.char || ''}" placeholder="例如：足" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:16px; font-weight:bold;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">注音符號</label>
              <input type="text" id="qb_input_zhuyin" value="${item.zhuyin || ''}" placeholder="例如：ㄗㄨˊ" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">題幹提示語 (包含填空處) *</label>
            <input type="text" id="qb_input_clue" value="${item.clue || ''}" placeholder="例如：畫蛇添（　）" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">延伸關聯詞語 (字典搜尋詞)</label>
            <input type="text" id="qb_input_searchWord" value="${item.searchWord || ''}" placeholder="例如：畫蛇添足" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      } else if (type === 'characterCrossword') {
        fieldsHtml = `
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">中心字 (解答) *</label>
            <input type="text" id="qb_input_centerChar" maxlength="1" value="${item.centerChar || ''}" placeholder="例如：天" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:18px; font-weight:bold;">
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">上字 (Top)</label>
              <input type="text" id="qb_input_topWord" maxlength="1" value="${item.topWord || ''}" placeholder="藍" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">下字 (Bottom)</label>
              <input type="text" id="qb_input_bottomWord" maxlength="1" value="${item.bottomWord || ''}" placeholder="地" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">左字 (Left)</label>
              <input type="text" id="qb_input_leftWord" maxlength="1" value="${item.leftWord || ''}" placeholder="今" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">右字 (Right)</label>
              <input type="text" id="qb_input_rightWord" maxlength="1" value="${item.rightWord || ''}" placeholder="下" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">組成的四個詞語說明</label>
            <input type="text" id="qb_input_searchWord" value="${item.searchWord || ''}" placeholder="例如：藍天、天地、今天、天下" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      } else if (type === 'characterUnitedWords') {
        fieldsHtml = `
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">二字詞語 (解答) *</label>
            <input type="text" id="qb_input_word" value="${item.word || ''}" placeholder="例如：森林" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary); font-size:16px; font-weight:bold;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">第一字部件</label>
              <input type="text" id="qb_input_p1" value="${item.p1 || ''}" placeholder="例如：木木木" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">第二字部件</label>
              <input type="text" id="qb_input_p2" value="${item.p2 || ''}" placeholder="例如：木木" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
            </div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">所有散裝部件 (以逗號或空格隔開) *</label>
            <input type="text" id="qb_input_parts" value="${(item.parts || []).join(' ')}" placeholder="例如：木 木 木 木 木" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:4px;">詞語解釋 / 提示語 *</label>
            <input type="text" id="qb_input_clue" value="${item.clue || ''}" placeholder="例如：大片生長樹木的廣大土地" class="question-input" style="width:100%; box-sizing:border-box; margin:0; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
          </div>
        `;
      }

      fieldsContainer.innerHTML = fieldsHtml;
      formContainer.style.display = 'block';
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // 關閉新增/編輯表單
    closeQuestionEditForm() {
      const formContainer = document.getElementById('focusQbEditFormContainer');
      if (formContainer) formContainer.style.display = 'none';
      this.editingIndex = -1;
    }

    // 儲存表單資料
    handleSaveForm() {
      const type = this.currentActiveType;
      let questionData = {};

      try {
        if (type === 'classicsQuiz') {
          const title = document.getElementById('qb_input_title')?.value.trim();
          const quote = document.getElementById('qb_input_quote')?.value.trim();
          const author = document.getElementById('qb_input_author')?.value.trim() || '';
          const dynasty = document.getElementById('qb_input_dynasty')?.value.trim() || '';
          const answer = document.getElementById('qb_input_answer')?.value.trim();
          const fullPoem = document.getElementById('qb_input_fullPoem')?.value.trim() || '';
          const opt0 = document.getElementById('qb_input_opt0')?.value.trim();
          const opt1 = document.getElementById('qb_input_opt1')?.value.trim();
          const opt2 = document.getElementById('qb_input_opt2')?.value.trim();
          const opt3 = document.getElementById('qb_input_opt3')?.value.trim();

          if (!title) throw new Error('請輸入作品名稱！');
          if (!quote) throw new Error('請輸入詩詞名句！');
          if (!answer) throw new Error('請輸入標準解答！');
          
          const options = [opt0, opt1, opt2, opt3].filter(Boolean);
          if (options.length < 4) throw new Error('請完整填寫 4 個選項！');
          if (!options.includes(answer)) throw new Error('標準解答必須與 4 個選項中的其中一個完全相符！');

          questionData = {
            id: `custom_q_${Date.now()}`,
            type: author ? 'poetry' : 'idiom',
            title,
            author,
            dynasty,
            quote,
            prompt: `「${quote}」是哪一位詩人的名句？`,
            options,
            answer,
            fullPoem: fullPoem || quote,
            links: {
              sinoreading: `https://www.google.com/search?q=${encodeURIComponent(title + ' 中讀網')}`,
              wikisource: `https://zh.wikisource.org/wiki/${encodeURIComponent(title)}`,
              wikipedia: `https://zh.wikipedia.org/wiki/${encodeURIComponent(title)}`
            }
          };
        } else if (type === 'characterTest') {
          const char = document.getElementById('qb_input_char')?.value.trim();
          const zhuyin = document.getElementById('qb_input_zhuyin')?.value.trim() || '';
          const clue = document.getElementById('qb_input_clue')?.value.trim();
          const searchWord = document.getElementById('qb_input_searchWord')?.value.trim() || '';

          if (!char) throw new Error('請輸入解答正字！');
          if (!clue) throw new Error('請輸入題幹提示！');

          questionData = {
            char,
            zhuyin,
            clue,
            searchWord: searchWord || clue.replace(/[（(].*?[）)]/g, char)
          };
        } else if (type === 'characterCrossword') {
          const centerChar = document.getElementById('qb_input_centerChar')?.value.trim();
          const topWord = document.getElementById('qb_input_topWord')?.value.trim() || '';
          const bottomWord = document.getElementById('qb_input_bottomWord')?.value.trim() || '';
          const leftWord = document.getElementById('qb_input_leftWord')?.value.trim() || '';
          const rightWord = document.getElementById('qb_input_rightWord')?.value.trim() || '';
          const searchWord = document.getElementById('qb_input_searchWord')?.value.trim() || '';

          if (!centerChar) throw new Error('請輸入十字中心字！');

          questionData = {
            centerChar,
            topWord,
            bottomWord,
            leftWord,
            rightWord,
            searchWord
          };
        } else if (type === 'characterUnitedWords') {
          const word = document.getElementById('qb_input_word')?.value.trim();
          const p1 = document.getElementById('qb_input_p1')?.value.trim() || '';
          const p2 = document.getElementById('qb_input_p2')?.value.trim() || '';
          const partsInput = document.getElementById('qb_input_parts')?.value.trim() || '';
          const clue = document.getElementById('qb_input_clue')?.value.trim();

          if (!word) throw new Error('請輸入二字詞語！');
          if (!partsInput) throw new Error('請輸入散裝部件！');
          if (!clue) throw new Error('請輸入詞語提示！');

          const parts = partsInput.split(/[\s,，、]+/).filter(Boolean);
          questionData = {
            word,
            p1,
            p2,
            parts,
            clue,
            searchWord: word
          };
        }

        this.saveQuestion(type, questionData, this.editingIndex);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', this.editingIndex >= 0 ? '題目修改已儲存！' : '新題目已成功加入題庫！');
        }
        this.closeQuestionEditForm();
        this.renderList();
        this.updateAdminBadge(type);
      } catch (err) {
        alert(err.message || '儲存失敗，請檢查欄位！');
      }
    }

    // 打開匯入題庫彈窗
    openImportDialog(type = this.currentActiveType) {
      this.currentActiveType = type;
      const fileInput = document.getElementById('focusQbFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }

    // 處理檔案上傳匯入
    handleFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const type = this.currentActiveType;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const count = this.importPool(type, e.target.result, 'replace');
          if (window.app && typeof window.app.showNotification === 'function') {
            window.app.showNotification('成功', `成功匯入 ${count} 筆題目至【${this.getTypeName(type)}】！`);
          } else {
            alert(`成功匯入 ${count} 筆題目！`);
          }
          this.renderList();
          this.updateAdminBadge(type);
        } catch (err) {
          alert('匯入失敗：' + err.message);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }

    // 處理恢復預設題庫
    handleResetDefault(type = this.currentActiveType) {
      if (confirm(`確定要將【${this.getTypeName(type)}】題庫重置還原為原廠官方預設題庫嗎？所有自訂增修將會被清除。`)) {
        this.resetPool(type);
        if (window.app && typeof window.app.showNotification === 'function') {
          window.app.showNotification('成功', `【${this.getTypeName(type)}】已成功恢復為官方預設題庫！`);
        }
        this.renderList();
        this.updateAdminBadge(type);
      }
    }
  }

  // 掛載至 global
  global.FocusQuestionBankManager = FocusQuestionBankManager;
  global.focusQB = new FocusQuestionBankManager();

})(typeof window !== 'undefined' ? window : this);
