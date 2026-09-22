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
if (!tags.includes('懷舊經典') || !tags.includes('熱門流行') || !tags.includes('動漫神曲')) {
  throw new Error(`標籤未正確獲取：${JSON.stringify(tags)}`);
}

// 測試標籤過濾
qb.selectedTagFilters.songQuiz = '熱門流行';
const popSongs = qb.searchPool('songQuiz', '');
if (popSongs.length === 0 || !popSongs.every(s => s.tag === '熱門流行')) {
  throw new Error('標籤過濾熱門流行失敗！');
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

// 3. 測試 index.html 元素與配置
const html = fs.readFileSync('index.html', 'utf8');
const htmlChecks = [
  ['index.html 包含 ver 3.2.7 版本標示', html.includes('ver 3.2.7')],
  ['focusGameType 包含 songQuiz 選項', html.includes('value="songQuiz"')],
  ['包含 focusSongQuizSettings 設定區塊', html.includes('id="focusSongQuizSettings"')],
  ['包含玩法模式選擇單選按鈕 focusSongQuizPlayMode', html.includes('name="focusSongQuizPlayMode"')],
  ['包含出題歌單標籤下拉選單 focusSongQuizTag', html.includes('id="focusSongQuizTag"')],
  ['包含每局題數下拉選單 focusSongQuizCount', html.includes('id="focusSongQuizCount"')],
  ['包含每題播放長度下拉選單 focusSongQuizDuration', html.includes('id="focusSongQuizDuration"')],
  ['包含題庫徽章 focusQbBadge_songQuiz', html.includes('id="focusQbBadge_songQuiz"')],
  ['題庫彈窗包含 songQuiz 頁籤按鈕', html.includes('data-type="songQuiz"')],
  ['題庫彈窗包含標籤篩選下拉選單 focusQbTagFilterSelect', html.includes('id="focusQbTagFilterSelect"')],
  ['引用 song_quiz_pool.js?v=327', html.includes('js/song_quiz_pool.js?v=327')],
  ['引用 song_quiz.js?v=327', html.includes('js/song_quiz.js?v=327')],
  ['引用 focus_question_bank.js?v=327', html.includes('js/focus_question_bank.js?v=327')],
  ['引用 app.js?v=327', html.includes('js/app.js?v=327')]
];

htmlChecks.forEach(([desc, cond]) => {
  if (!cond) throw new Error(`HTML 檢查失敗：${desc}`);
});

// 4. 測試 app.js 邏輯
const appCode = fs.readFileSync('js/app.js', 'utf8');
const appChecks = [
  ['app.js APP_VERSION 為 3.2.7', appCode.includes("this.APP_VERSION = '3.2.7';")],
  ['startFocusGame 支援 songQuiz 抽題與標籤篩選', appCode.includes("gameType === 'songQuiz'")],
  ['startFocusGame 支援全班搶答模式 buzzerRound 初始化', appCode.includes("songQuizPlayMode === 'buzzer'")],
  ['startFocusGame 支援選項隨機打亂', appCode.includes('opts[k], opts[r]')],
  ['startFocusGame 支援自訂播放長度 focusSongQuizDuration', appCode.includes('focusSongQuizDuration')],
  ['updateFocusGameAdminOptions 支援 songQuizSettings', appCode.includes('focusSongQuizSettings')],
  ['updateSongQuizAdminTagSelect 方法存在', appCode.includes('updateSongQuizAdminTagSelect()')],
  ['updateFocusCountdownCopy 包含聽歌搶答倒數文案', appCode.includes('🎵 聽歌搶答 (歌曲聽音辨曲)！')],
  ['stopFocusTimers 包含 stopSongQuizAudio', appCode.includes('this.stopSongQuizAudio()')],
  ['專注力主迴圈分流 startSongQuizGame', appCode.includes('this.startSongQuizGame(game)')],
  ['handleFocusGameSync 支援全班搶答即時大螢幕渲染', appCode.includes('this.renderBuzzerSongQuizUI(game)')]
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
  ['song_quiz.js 定義 replaySongQuizAudio', songQuizCode.includes('replaySongQuizAudio')],
  ['song_quiz.js 定義 answerSongQuiz', songQuizCode.includes('answerSongQuiz')],
  ['song_quiz.js 定義 useSongQuizSingerHint', songQuizCode.includes('useSongQuizSingerHint')],
  ['song_quiz.js 定義 useSongQuizEliminationHint', songQuizCode.includes('useSongQuizEliminationHint')],
  ['song_quiz.js 定義 finishSongQuizGame', songQuizCode.includes('finishSongQuizGame')],
  ['song_quiz.js 定義 initBuzzerSongQuiz', songQuizCode.includes('initBuzzerSongQuiz')],
  ['song_quiz.js 定義 renderBuzzerSongQuizUI', songQuizCode.includes('renderBuzzerSongQuizUI')],
  ['song_quiz.js 定義 pressBuzzerButton (Transaction 搶答)', songQuizCode.includes('pressBuzzerButton')],
  ['song_quiz.js 定義 submitBuzzerAnswer (四選一搶答作答)', songQuizCode.includes('submitBuzzerAnswer')],
  ['song_quiz.js 定義 teacherBuzzerAction (老師續播/跳題/揭曉主控)', songQuizCode.includes('teacherBuzzerAction')],
  ['song_quiz.js 定義 renderBuzzerFinalLeaderboard', songQuizCode.includes('renderBuzzerFinalLeaderboard')],
  ['song_quiz.js 包含旋轉黑膠唱片動畫 spinVinyl', songQuizCode.includes('spinVinyl')],
  ['song_quiz.js 包含搶答脈衝動畫 pulseBuzzer', songQuizCode.includes('pulseBuzzer')]
];

sqChecks.forEach(([desc, cond]) => {
  if (!cond) throw new Error(`song_quiz.js 檢查失敗：${desc}`);
});

console.log('🎉 聽歌搶答 (songQuiz) 修復 YouTube 與全班同步搶答雙軌模式 40+ 項驗證均全數通過！');
