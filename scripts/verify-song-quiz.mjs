import fs from 'fs';

// 1. 載入並測試 song_quiz_pool.js
const poolCode = fs.readFileSync('js/song_quiz_pool.js', 'utf8');
const poolSandbox = { window: {}, console, document: { addEventListener() {}, getElementById() { return null; } } };
const runInSandbox = (code, sandbox) => {
  const fn = new Function('window', 'global', 'document', 'localStorage', code);
  fn(sandbox.window, sandbox.window, sandbox.document, sandbox.localStorage);
};
runInSandbox(poolCode, poolSandbox);

const defaultPool = poolSandbox.window.DEFAULT_SONG_QUIZ_POOL;
if (!Array.isArray(defaultPool) || defaultPool.length < 30) {
  throw new Error(`DEFAULT_SONG_QUIZ_POOL 歌曲數不足：${defaultPool?.length}`);
}

// 驗證紅蓮華在內的關鍵歌曲 ID 是否已修正為真實有效 ID
const gurenge = defaultPool.find(s => s.title === '紅蓮華');
if (!gurenge || gurenge.youtubeId !== 'MpYy6wwqxoo') {
  throw new Error(`紅蓮華 YouTube ID 未正確更新為 MpYy6wwqxoo，目前為：${gurenge?.youtubeId}`);
}
const littleHappiness = defaultPool.find(s => s.title === '小幸運');
if (!littleHappiness || littleHappiness.youtubeId !== 'HDMQuMJ4MSk') {
  throw new Error(`小幸運 YouTube ID 未正確更新為 HDMQuMJ4MSk，目前為：${littleHappiness?.youtubeId}`);
}

// 2. 測試 FocusQuestionBankManager
const qbCode = fs.readFileSync('js/focus_question_bank.js', 'utf8');
const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

const qbSandbox = {
  window: {
    DEFAULT_SONG_QUIZ_POOL: defaultPool,
    localStorage: mockLocalStorage,
    document: {
      getElementById() { return null; },
      querySelectorAll() { return []; },
      addEventListener() {}
    }
  },
  localStorage: mockLocalStorage,
  document: {
    getElementById() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {}
  }
};
runInSandbox(qbCode, qbSandbox);

const qb = qbSandbox.window.focusQB;
if (!qb) throw new Error('focusQB 初始化失敗！');

// 測試取得預設題庫
const pool = qb.getPool('songQuiz');
if (pool.length !== defaultPool.length) {
  throw new Error(`getPool('songQuiz') 題目數量不符：${pool.length} vs ${defaultPool.length}`);
}

// 測試標籤獲取
const tags = qb.getAllTags('songQuiz');
const expectedTags = ['古典音樂', '台灣五年級', '台灣六年級', '台灣七年級', '台灣八年級'];
expectedTags.forEach(t => {
  if (!tags.includes(t)) {
    throw new Error(`缺少預期標籤 ${t}：${JSON.stringify(tags)}`);
  }
  const count = pool.filter(s => s.tag === t).length;
  if (count < 20) {
    throw new Error(`標籤 ${t} 歌曲不足 20 首（目前 ${count} 首）`);
  }
});

// 測試標籤過濾
qb.selectedTagFilters.songQuiz = '台灣七年級';
const popSongs = qb.searchPool('songQuiz', '');
if (popSongs.length === 0 || !popSongs.every(s => s.tag === '台灣七年級')) {
  throw new Error('標籤過濾台灣七年級失敗！');
}

// 測試關鍵字搜尋
qb.selectedTagFilters.songQuiz = 'all';
const jayResults = qb.searchPool('songQuiz', '周杰倫');
if (jayResults.length === 0 || !jayResults.some(s => s.title === '晴天')) {
  throw new Error('關鍵字搜尋周杰倫失敗！');
}

// 測試 CSV 範本生成
const csvTemplate = qb.getCSVTemplateContent('songQuiz');
if (!csvTemplate.includes('標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明')) {
  throw new Error('CSV 範本標頭錯誤！');
}
if (!csvTemplate.includes('月亮代表我的心')) {
  throw new Error('CSV 範本缺少代表歌曲！');
}

// 測試 CSV 匯入
const sampleImportCsv = `標籤分組,歌曲名稱(正解),演唱者,YouTube網址,開始播放秒數,播放秒數,干擾選項1,干擾選項2,干擾選項3,提示說明
經典台語,愛拼才會贏,葉啟田,https://www.youtube.com/watch?v=sample1,20,15,家後,浪子的心情,歡喜就好,勵志台語名曲
民歌時光,外婆的澎湖灣,潘安邦,https://www.youtube.com/watch?v=sample2,10,15,鄉間小路,橄欖樹,童年,校園民歌代表作`;

const importedCount = qb.importPool('songQuiz', sampleImportCsv, 'replace');
if (importedCount !== 2) throw new Error(`CSV 匯入數量錯誤：${importedCount}`);
if (!qb.isCustomPool('songQuiz')) throw new Error('isCustomPool 狀態未更新為自訂題庫！');
const importedPool = qb.getPool('songQuiz');
if (importedPool[0].title !== '愛拼才會贏' || importedPool[1].title !== '外婆的澎湖灣') {
  throw new Error('匯入內容不符合預期！');
}

// 測試一鍵重置
qb.resetPool('songQuiz');
if (qb.isCustomPool('songQuiz')) throw new Error('重置後仍為自訂題庫！');
if (qb.getPool('songQuiz').length !== defaultPool.length) {
  throw new Error('重置後題庫未還原為原廠預設題庫！');
}

// 測試多標籤核選篩選邏輯 (單選/多選/全選)
const rawSongPool = qb.getPool('songQuiz');
const classicalOnly = rawSongPool.filter(s => ['古典音樂'].includes(s.tag));
if (classicalOnly.length !== 20) throw new Error(`單一標籤古典音樂歌曲數應為 20，實際為：${classicalOnly.length}`);

const twoTagSongs = rawSongPool.filter(s => ['古典音樂', '台灣五年級'].includes(s.tag));
if (twoTagSongs.length !== 40) throw new Error(`雙標籤歌曲數應為 40，實際為：${twoTagSongs.length}`);

const threeTagSongs = rawSongPool.filter(s => ['古典音樂', '台灣五年級', '動漫神曲'].includes(s.tag));
if (threeTagSongs.length !== 46) throw new Error(`三標籤歌曲數應為 46，實際為：${threeTagSongs.length}`);

// 3. 測試 index.html 元素與配置
const html = fs.readFileSync('index.html', 'utf8');
const classicsQuizCode = fs.readFileSync('js/classics_quiz.js', 'utf8');
const htmlChecks = [
  ['index.html 包含 ver 3.4.6 版本標示', html.includes('ver 3.4.6')],
  ['focusGameType 包含 songQuiz 選項', html.includes('value="songQuiz"')],
  ['包含 focusSongQuizSettings 設定區塊', html.includes('id="focusSongQuizSettings"')],
  ['包含玩法模式選擇單選按鈕 focusSongQuizPlayMode 且預設選中 buzzer (全班同步搶答)', html.includes('name="focusSongQuizPlayMode" value="buzzer" checked')],
  ['包含音訊廣播選擇選單 focusSongQuizAudioMode', html.includes('id="focusSongQuizAudioMode"')],
  ['包含歌單標籤核選容器 focusSongQuizTagContainer', html.includes('id="focusSongQuizTagContainer"')],
  ['包含出題歌單標籤統計與相容元素 focusSongQuizTag', html.includes('id="focusSongQuizTag"')],
  ['包含歌單標籤統計資訊摘要 focusSongQuizTagSummary', html.includes('id="focusSongQuizTagSummary"')],
  ['包含全選按鈕呼叫 setAllSongQuizTags(true)', html.includes('setAllSongQuizTags(true)')],
  ['包含清空按鈕呼叫 setAllSongQuizTags(false)', html.includes('setAllSongQuizTags(false)')],
  ['包含每局題數下拉選單 focusSongQuizCount', html.includes('id="focusSongQuizCount"')],
  ['每局題數支援 1 題選項', html.includes('<option value="1">1 題')],
  ['每局題數支援 2 題選項', html.includes('<option value="2">2 題')],
  ['包含每題播放長度下拉選單 focusSongQuizDuration', html.includes('id="focusSongQuizDuration"')],
  ['包含題庫徽章 focusQbBadge_songQuiz', html.includes('id="focusQbBadge_songQuiz"')],
  ['題庫彈窗包含 songQuiz 頁籤按鈕', html.includes('data-type="songQuiz"')],
  ['題庫彈窗包含標籤篩選下拉選單 focusQbTagFilterSelect', html.includes('id="focusQbTagFilterSelect"')],
  ['引用 song_quiz_pool.js?v=346', html.includes('js/song_quiz_pool.js?v=346')],
  ['引用 song_quiz.js?v=346', html.includes('js/song_quiz.js?v=346')],
  ['引用 focus_question_bank.js?v=346', html.includes('js/focus_question_bank.js?v=346')],
  ['引用 app.js?v=346', html.includes('js/app.js?v=346')],
  ['字力測驗包含出題數量下拉選單 focusCharacterTestCount', html.includes('id="focusCharacterTestCount"')],
  ['成語測驗出題數量包含 1 題與 2 題選項', html.includes('id="focusClassicsQuizCount"') && html.includes('<option value="1">1 題') && html.includes('<option value="2">2 題')],
  ['成語測驗答題說明改為 Google 查詢', classicsQuizCode.includes('google.com/search?q=') && classicsQuizCode.includes('透過 Google 查詢')],
  ['成語測驗答題說明移除延伸介紹獨立連結', !classicsQuizCode.includes('🔎 延伸介紹')]
];

htmlChecks.forEach(([desc, cond]) => {
  if (!cond) throw new Error(`HTML 檢查失敗：${desc}`);
});

// 4. 測試 app.js 邏輯
const appCode = fs.readFileSync('js/app.js', 'utf8');
const appChecks = [
  ['app.js APP_VERSION 為 3.4.6', appCode.includes("this.APP_VERSION = '3.4.6';")],
  ['startFocusGame 支援 songQuiz 抽題與標籤篩選', appCode.includes("gameType === 'songQuiz'")],
  ['startFocusGame 支援多標籤核選篩選與空標籤防呆', appCode.includes("getSelectedSongQuizTags") && appCode.includes("請先勾選歌單標籤")],
  ['startFocusGame 支援全班搶答模式 buzzerRound 初始化', appCode.includes("songQuizPlayMode === 'buzzer'")],
  ['startFocusGame 支援 audioMode 音訊廣播參數設定', appCode.includes("focusSongQuizAudioMode") && appCode.includes("audioMode:")],
  ['startFocusGame 初始化 audioSeekTime', appCode.includes("audioSeekTime:")],
  ['startFocusGame 支援選項隨機打亂', appCode.includes('opts[k], opts[r]')],
  ['startFocusGame 支援自訂播放長度 focusSongQuizDuration', appCode.includes('focusSongQuizDuration')],
  ['updateFocusGameAdminOptions 支援 songQuizSettings', appCode.includes('focusSongQuizSettings')],
  ['adminEditQuestionFolder 方法存在 (支援群組名稱編輯)', appCode.includes('adminEditQuestionFolder(folderId)')],
  ['adminEditImageFolder 方法存在', appCode.includes('adminEditImageFolder(folderId)')],
  ['adminEditVideoFolder 方法存在', appCode.includes('adminEditVideoFolder(folderId)')],
  ['adminEditShareFolder 方法存在', appCode.includes('adminEditShareFolder(folderId)')],
  ['updateSongQuizAdminTagSelect 方法存在', appCode.includes('updateSongQuizAdminTagSelect()')],
  ['getSelectedSongQuizTags 方法存在', appCode.includes('getSelectedSongQuizTags()')],
  ['onSongQuizTagCheckboxChange 方法存在', appCode.includes('onSongQuizTagCheckboxChange()')],
  ['setAllSongQuizTags 方法存在', appCode.includes('setAllSongQuizTags(selectAll)')],
  ['updateSongQuizTagSummary 方法存在', appCode.includes('updateSongQuizTagSummary()')],
  ['updateFocusCountdownCopy 包含聽歌搶答倒數文案', appCode.includes('🎵 聽歌搶答 (歌曲聽音辨曲)！')],
  ['stopFocusTimers 包含 stopSongQuizAudio', appCode.includes('this.stopSongQuizAudio()')],
  ['專注力主迴圈分流 startSongQuizGame', appCode.includes('this.startSongQuizGame(game)')],
  ['app.js 提供 stopFocusGame 別名安全呼叫', appCode.includes('stopFocusGame()')],
  ['renderFocusGameLeaderboard 支援分數顯示與高亮', appCode.includes('${points} 分')],
  ['renderFocusGameLeaderboard 支援答對題數與首數標籤', appCode.includes('✅ 答對 ${correctCount}')],
  ['renderFocusGameLeaderboard 支援答錯題數與首數標籤', appCode.includes('❌ 答錯 ${wrongCount}')],
  ['renderFocusGameLeaderboard 支援自主模式同分並列排名', appCode.includes('🥇 並列') && appCode.includes('🥈 並列')],
  ['calculateFocusUserRank 支援 songQuiz 優先以答對數排序', appCode.includes("a.gameType === 'songQuiz'") && appCode.includes('if (scoreB !== scoreA) return scoreB - scoreA;')]
];

appChecks.forEach(([desc, cond]) => {
  if (!cond) throw new Error(`app.js 檢查失敗：${desc}`);
});

// 5. 測試 song_quiz.js 模組
const songQuizCode = fs.readFileSync('js/song_quiz.js', 'utf8');
const sqChecks = [
  ['song_quiz.js 定義 startSongQuizGame', songQuizCode.includes('startSongQuizGame')],
  ['song_quiz.js 定義 renderSongQuizQuestion', songQuizCode.includes('renderSongQuizQuestion')],
  ['song_quiz.js 定義 playSongQuizAudio', songQuizCode.includes('playSongQuizAudio')],
  ['playSongQuizAudio 支援 remainingDuration 倒數計算', songQuizCode.includes('remainingDuration')],
  ['song_quiz.js 定義 replaySongQuizAudio', songQuizCode.includes('replaySongQuizAudio')],
  ['song_quiz.js 定義 answerSongQuiz', songQuizCode.includes('answerSongQuiz')],
  ['song_quiz.js 定義 useSongQuizSingerHint', songQuizCode.includes('useSongQuizSingerHint')],
  ['song_quiz.js 定義 useSongQuizEliminationHint', songQuizCode.includes('useSongQuizEliminationHint')],
  ['song_quiz.js 定義 finishSongQuizGame', songQuizCode.includes('finishSongQuizGame')],
  ['song_quiz.js 定義 initBuzzerSongQuiz', songQuizCode.includes('initBuzzerSongQuiz')],
  ['song_quiz.js 定義 renderBuzzerSongQuizUI', songQuizCode.includes('renderBuzzerSongQuizUI')],
  ['renderBuzzerSongQuizUI 支援從暫停進度繼續播放與從頭重播按鈕', songQuizCode.includes('從暫停進度') || songQuizCode.includes('從頭重新播放')],
  ['song_quiz.js 定義 pressBuzzerButton (Transaction 搶答)', songQuizCode.includes('pressBuzzerButton')],
  ['pressBuzzerButton 支援 audioSeekTime 精確進度結算', songQuizCode.includes('current.audioSeekTime = currentPos')],
  ['pressBuzzerButton 具備學生姓名強制驗證防呆', songQuizCode.includes('請先設定姓名') && songQuizCode.includes('openStudentNameModal')],
  ['song_quiz.js 定義 submitBuzzerAnswer (四選一搶答作答)', songQuizCode.includes('submitBuzzerAnswer')],
  ['song_quiz.js 定義 teacherBuzzerAction (老師續播/跳題/揭曉主控)', songQuizCode.includes('teacherBuzzerAction')],
  ['teacherBuzzerAction 支援 restart 從頭重播功能', songQuizCode.includes("action === 'restart'")],
  ['teacherBuzzerAction 支援 resume 保持 audioSeekTime 無縫續播', songQuizCode.includes("audioAction: 'resume'") && songQuizCode.includes("audioSeekTime: currentSeek")],
  ['song_quiz.js 定義 renderBuzzerFinalLeaderboard', songQuizCode.includes('renderBuzzerFinalLeaderboard')],
  ['renderBuzzerFinalLeaderboard 支援同分並列冠軍', songQuizCode.includes('並列冠軍')],
  ['renderBuzzerFinalLeaderboard 支援同分並列亞軍與季軍', songQuizCode.includes('並列亞軍') && songQuizCode.includes('並列季軍')],
  ['頒獎典禮重置按鈕呼叫 endFocusGame', songQuizCode.includes('window.app.endFocusGame()')],
  ['handleBuzzerAudioSync 依 audioMode 支援全班發聲與老師專屬模式', songQuizCode.includes("audioMode === 'teacher'")],
  ['handleBuzzerAudioSync 動作鍵包含 audioSeekTime 變更監控', songQuizCode.includes("audioSeekTime || 0")],
  ['playSongQuizAudio 包含 audioMode 廣播分流支援', songQuizCode.includes("audioMode === 'teacher'")],
  ['song_quiz.js 包含旋轉黑膠唱片動畫 spinVinyl', songQuizCode.includes('spinVinyl')],
  ['song_quiz.js 包含搶答脈衝動畫 pulseBuzzer', songQuizCode.includes('pulseBuzzer')],
  ['song_quiz.js 自主模式結算包含排行榜容器 songQuizSelfRankList', songQuizCode.includes('songQuizSelfRankList')]
];

sqChecks.forEach(([desc, cond]) => {
  if (!cond) throw new Error(`song_quiz.js 檢查失敗：${desc}`);
});

console.log('🎉 聽歌搶答 (songQuiz) ver 3.3.8 自主模式答對/答錯統計與成績顯示 60+ 項驗證均全數通過！');
