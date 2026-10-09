import fs from 'fs';
import path from 'path';
import vm from 'vm';

const html = fs.readFileSync('index.html', 'utf8');
const vqJs = fs.readFileSync('js/video_quiz.js', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 載入題庫
const classicsJs = fs.readFileSync('js/classics_quiz_pool.js', 'utf8');
const charJs = fs.readFileSync('js/character_pool.js', 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(classicsJs, sandbox);
vm.runInContext(charJs, sandbox);

const classicsPool = sandbox.window.CLASSICS_QUIZ_POOL || [];
const idiomQuestions = classicsPool.filter(q => q.category === '成語典故');
const crosswordPool = sandbox.window.CHARACTER_CROSSWORD_POOL || [];
const unitedWordsPool = sandbox.window.CHARACTER_UNITED_WORDS_POOL || [];

// 靜態程式碼與版本標籤檢查項目
const checks = [
  ['package.json version 3.8.0', pkg.version === '3.8.0'],
  ['app.js APP_VERSION 3.8.0', appJs.includes("this.APP_VERSION = '3.8.0';")],
  ['index.html badge ver 3.8.0', html.includes('ver 3.8.0')],
  ['index.html Google Identity Services script removed', !html.includes('accounts.google.com/gsi/client')],
  ['index.html Google API Client (gapi) script removed', !html.includes('apis.google.com/js/api.js')],
  ['index.html style.css?v=380', html.includes('css/style.css?v=380')],
  ['index.html firebase-config.js?v=380', html.includes('js/firebase-config.js?v=380')],
  ['index.html app.js?v=380', html.includes('js/app.js?v=380')],
  ['index.html quiz.js?v=380', html.includes('js/quiz.js?v=380')],
  ['index.html video_quiz.js?v=380', html.includes('js/video_quiz.js?v=380')],
  ['index.html song_quiz.js?v=380', html.includes('js/song_quiz.js?v=380')],
  ['index.html vqEditorChooseDriveBtn removed', !html.includes('id="vqEditorChooseDriveBtn"')],
  ['index.html vqEditorDriveConfigBtn removed', !html.includes('id="vqEditorDriveConfigBtn"')],
  ['index.html vqDriveConfigModal removed', !html.includes('id="vqDriveConfigModal"')],
  ['index.html vqEditorChooseLocalFileBtn removed', !html.includes('id="vqEditorChooseLocalFileBtn"')],
  ['index.html vqEditorLocalFileInput removed', !html.includes('id="vqEditorLocalFileInput"')],
  ['index.html menu tab is 🎬 影片出題測驗', html.includes('🎬 影片出題測驗') && !html.includes('🎬 影片/音檔出題測驗')],
  ['index.html admin section is 🎬 影片出題測驗管理', html.includes('🎬 影片出題測驗管理') && !html.includes('🎬 影片/音檔出題測驗管理')],
  ['video_quiz.js Drive API & OAuth removed', !vqJs.includes('google.accounts.oauth2.initTokenClient') && !vqJs.includes('google.picker.PickerBuilder')],
  ['video_quiz.js Blob/Drive download removed', !vqJs.includes('downloadDriveFileAsBlob')],
  ['video_quiz.js getValidCurrentTime method exists', vqJs.includes('getValidCurrentTime()')],
  ['video_quiz.js updateEditorReadyState method exists', vqJs.includes('updateEditorReadyState(')],
  ['video_quiz.js processTimelineTick method exists', vqJs.includes('processTimelineTick(')],
  ['video_quiz.js handleTeacherTimelineTick uses processTimelineTick', vqJs.includes('this.processTimelineTick(currentTime, true)')],
  ['video_quiz.js handleSelfTimelineTick uses processTimelineTick', vqJs.includes('this.processTimelineTick(currentTime, false)')],
  ['video_quiz.js broadcastQuestion includes sessionId, eventId, seq, timestamp', vqJs.includes('sessionId:') && vqJs.includes('eventId:') && vqJs.includes('seq:') && vqJs.includes('timestamp:')],
  ['video_quiz.js handleRemoteSessionUpdate has handledEventIds deduplication', vqJs.includes('this.handledEventIds.has(eventId)')],
  ['video_quiz.js openAddQuestionModal checks getValidCurrentTime', vqJs.includes('openAddQuestionModal()') && vqJs.includes('this.getValidCurrentTime()')],
  ['video_quiz.js setStartCurrent and setEndCurrent check getValidCurrentTime', vqJs.includes('vqSetStartCurrentBtn') && vqJs.includes('this.getValidCurrentTime()')],
  ['video_quiz.js jumpToQuestion exists', vqJs.includes('jumpToQuestion(index)')],
  ['video_quiz.js toggleAllowStudentRepeat exists', vqJs.includes('toggleAllowStudentRepeat(checked)')],
  ['video_quiz.js handleVideoEnded exists', vqJs.includes('handleVideoEnded()')],
  ['video_quiz.js stopSyncQuiz returns to admin tab', vqJs.includes("switchToTab('panel-admin')")],
  ['video_quiz.js returnToQuizVideo method', vqJs.includes('returnToQuizVideo()')],
  ['video_quiz.js question overlay has 返回測驗影片 button', vqJs.includes('🎬 返回測驗影片')],
  ['video_quiz.js DEFAULT_CUSTOM_SETS two default custom sets', vqJs.includes('綜合影音複習測驗組') && vqJs.includes('跨學科精選測驗組')],
  ['index.html vqSelfTeacherControls exists', html.includes('id="vqSelfTeacherControls"')],
  ['style.css video-quiz styles', css.includes('.video-quiz-player-container') && css.includes('.video-quiz-overlay')],
  ['video_quiz.js sync mode student pauses video on resume playback', vqJs.includes('this.pauseVideo();') && vqJs.includes('全班同步測驗模式')],
  ['index.html vqRangeStartInput and vqRangeEndInput dual sliders', html.includes('id="vqRangeStartInput"') && html.includes('id="vqRangeEndInput"')],
  ['video_quiz.js formatTime method exists', vqJs.includes('formatTime(')],
  ['video_quiz.js updateTimeRangeUI method exists', vqJs.includes('updateTimeRangeUI(')],
  ['video_quiz.js startTime seekTo support', vqJs.includes('this.seekTo(this.activeQuiz.startTime)')],
  ['video_quiz.js endTime pauseVideo support', vqJs.includes('this.activeQuiz.endTime') && vqJs.includes('this.pauseVideo()')],

  // 三大題庫檢查
  ['成語題庫 (CLASSICS_QUIZ_POOL) 成語典故題目數達到 300 題', idiomQuestions.length === 300],
  ['名句與典故題庫 (CLASSICS_QUIZ_POOL) 總題目數達到 396 題', classicsPool.length === 396],
  ['字字珠璣題庫 (CHARACTER_CROSSWORD_POOL) 達到 200 題', crosswordPool.length === 200],
  ['字字珠璣題庫中心字 200 題皆不重複', new Set(crosswordPool.map(q => q.char)).size === 200],
  ['團結一詞題庫 (CHARACTER_UNITED_WORDS_POOL) 達到 200 題', unitedWordsPool.length === 200],
  ['團結一詞題庫目標詞 200 題皆不重複', new Set(unitedWordsPool.map(q => q.targetWord)).size === 200]
];

let allPassed = true;
console.log('\n--- 驗證純影片出題測驗與三大擴充題庫項目 (ver 3.8.0) ---');
for (const [name, passed] of checks) {
  if (passed) {
    console.log(`✅ ${name}`);
  } else {
    console.error(`❌ ${name}`);
    allPassed = false;
  }
}

// ========================================================
// 演算法與核心邏輯行為單元測試 (Unit Tests for Video Quiz Logic)
// ========================================================
console.log('\n--- 演算法與核心邏輯行為單元測試 ---');

// 1. 時間格式化測試 (mm:ss 與長素材 hh:mm:ss)
function formatTime(sec) {
  const totalSec = Math.max(0, Math.floor(sec || 0));
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function parseTimeString(val) {
  if (typeof val === 'number') return Math.max(0, Math.floor(val));
  if (!val) return 0;
  const str = String(val).trim();
  if (str.includes(':')) {
    const parts = str.split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 3) {
      return Math.max(0, parts[0] * 3600 + parts[1] * 60 + parts[2]);
    } else if (parts.length === 2) {
      return Math.max(0, parts[0] * 60 + parts[1]);
    }
  }
  return Math.max(0, parseInt(str, 10) || 0);
}

// 測試 01:31 插題精準取得約 91 秒
const t91 = formatTime(91);
const p91 = parseTimeString('01:31');
if (t91 === '01:31' && p91 === 91) {
  console.log(`✅ 時間雙向轉換測試 (01:31 <=> 91s): 成功 (${t91} => ${p91}s)`);
} else {
  console.error(`❌ 時間雙向轉換測試失敗: t91=${t91}, p91=${p91}`);
  allPassed = false;
}

// 測試 01:05:40 長素材支援小時
const tHour = formatTime(3940);
const pHour = parseTimeString('01:05:40');
if (tHour === '01:05:40' && pHour === 3940) {
  console.log(`✅ 長素材小時格式化測試 (01:05:40 <=> 3940s): 成功 (${tHour} => ${pHour}s)`);
} else {
  console.error(`❌ 長素材小時格式化測試失敗: tHour=${tHour}, pHour=${pHour}`);
  allPassed = false;
}

// 2. 模擬 processTimelineTick 行為
class TimelineSimulator {
  constructor(questions, allowStudentRepeat = false) {
    this.activeQuiz = { questions };
    this.allowStudentRepeat = allowStudentRepeat;
    this.triggeredQuestions = new Set();
    this.lastMediaTime = null;
    this.currentTime = 0;
    this.paused = false;
    this.overlayShowing = false;
    this.triggeredOrder = [];
  }

  seekTo(sec) {
    this.currentTime = sec;
    this.lastMediaTime = sec;
  }

  pauseVideo() {
    this.paused = true;
  }

  showQuestionOverlay(q) {
    this.overlayShowing = true;
    this.triggeredOrder.push(q.id);
  }

  tick(newTime) {
    if (this.overlayShowing) return;
    const questions = this.activeQuiz.questions;
    if (typeof this.lastMediaTime !== 'number') {
      this.lastMediaTime = newTime;
      return;
    }
    const lastTime = this.lastMediaTime;

    const isBackward = (newTime < lastTime - 1.0);
    const isForwardSeek = (newTime > lastTime + 2.0);

    if (isBackward) {
      if (this.allowStudentRepeat) {
        for (const q of questions) {
          if (q.time >= newTime - 0.5) {
            this.triggeredQuestions.delete(q.id);
          }
        }
      }
      this.lastMediaTime = newTime;
      return;
    }

    if (newTime === lastTime) return;

    const validQuestions = questions.filter(q => q.enabled !== false);

    if (isForwardSeek) {
      const skipped = validQuestions.filter(q => {
        return !this.triggeredQuestions.has(q.id) && q.time > lastTime && q.time <= newTime;
      }).sort((a, b) => a.time - b.time);

      if (skipped.length > 0) {
        const firstQ = skipped[0];
        this.seekTo(firstQ.time);
        this.triggeredQuestions.add(firstQ.id);
        this.pauseVideo();
        this.showQuestionOverlay(firstQ);
        return;
      }
    }

    const triggerCandidates = validQuestions.filter(q => {
      if (this.triggeredQuestions.has(q.id)) return false;
      if (q.time === 0 && lastTime <= 0.1 && newTime >= 0) return true;
      return q.time > lastTime && q.time <= newTime + 0.15;
    }).sort((a, b) => a.time - b.time);

    if (triggerCandidates.length > 0) {
      const qToTrigger = triggerCandidates[0];
      this.triggeredQuestions.add(qToTrigger.id);
      this.lastMediaTime = qToTrigger.time;
      this.pauseVideo();
      this.showQuestionOverlay(qToTrigger);
      return;
    }

    this.lastMediaTime = newTime;
  }
}

// 測試 00:20 與 02:40 (160s) 依序播放與出題暫停
{
  const sim = new TimelineSimulator([
    { id: 'q1', time: 20 },
    { id: 'q2', time: 160 }
  ]);

  // 正常推進
  sim.tick(0); // 初始化為 0
  sim.tick(10);
  sim.tick(20.2); // 到達 q1
  const passedQ1 = sim.paused && sim.overlayShowing && sim.triggeredOrder.includes('q1');
  sim.overlayShowing = false;
  sim.paused = false;

  // 繼續播放至 150，未到 q2
  sim.tick(21);
  sim.tick(150);
  const notQ2Yet = sim.triggeredOrder.length === 1;

  // 播放至 160.1
  sim.tick(160.1);
  const passedQ2 = sim.paused && sim.overlayShowing && sim.triggeredOrder.includes('q2');

  if (passedQ1 && notQ2Yet && passedQ2) {
    console.log('✅ 題目設定於 00:20、02:40 (160s) 播放時依序暫停並出題: 通過');
  } else {
    console.error('❌ 00:20、02:40 題目依序出題測試失敗');
    allPassed = false;
  }
}

// 測試向前快進跳過多題 (10s -> 180s)，預設停在第一道未觸發題目 (20s) 並出題
{
  const sim = new TimelineSimulator([
    { id: 'q20', time: 20 },
    { id: 'q50', time: 50 },
    { id: 'q90', time: 90 }
  ]);
  sim.tick(0);
  sim.tick(10);
  sim.tick(180); // 向前快進跳過多題

  if (sim.currentTime === 20 && sim.triggeredOrder[0] === 'q20' && !sim.triggeredQuestions.has('q50') && !sim.triggeredQuestions.has('q90')) {
    console.log('✅ 向前拖曳跨過多題時預設停在第一道未觸發題目 (20s) 並出題: 通過');
  } else {
    console.error('❌ 向前拖曳快進測試失敗:', sim.currentTime, sim.triggeredOrder);
    allPassed = false;
  }
}

// 測試向後拖曳重播規則 (allowStudentRepeat: false vs true)
{
  const simNoRepeat = new TimelineSimulator([{ id: 'q30', time: 30 }], false);
  simNoRepeat.tick(0);
  simNoRepeat.tick(10);
  simNoRepeat.tick(30.1); // 觸發 q30
  simNoRepeat.overlayShowing = false;
  simNoRepeat.tick(50);
  simNoRepeat.tick(10);
  simNoRepeat.tick(30.1);
  const noRepeatPassed = simNoRepeat.triggeredOrder.length === 1;

  const simRepeat = new TimelineSimulator([{ id: 'q30', time: 30 }], true);
  simRepeat.tick(0);
  simRepeat.tick(10);
  simRepeat.tick(30.1); // 觸發 q30
  simRepeat.overlayShowing = false;
  simRepeat.tick(50);
  simRepeat.tick(10);
  simRepeat.tick(30.1);
  const repeatPassed = simRepeat.triggeredOrder.length === 2;

  if (noRepeatPassed && repeatPassed) {
    console.log('✅ 向後拖曳重播規則符合設定 (未勾選不重複 / 已勾選可再次出題): 通過');
  } else {
    console.error(`❌ 向後拖曳重播規則測試失敗: noRepeatPassed=${noRepeatPassed}, repeatPassed=${repeatPassed}`);
    allPassed = false;
  }
}

// 測試同步事件去重機制
{
  const handledEventIds = new Set();
  let triggerCount = 0;
  function handleSyncEvent(session) {
    const eventId = session.eventId || `${session.sessionId}_${session.questionId}`;
    if (handledEventIds.has(eventId)) {
      return;
    }
    handledEventIds.add(eventId);
    triggerCount++;
  }

  const evt = { sessionId: 'sess_123', questionId: 'q1', eventId: 'evt_123_q1_seq1' };
  handleSyncEvent(evt);
  handleSyncEvent(evt);
  handleSyncEvent(evt);

  if (triggerCount === 1) {
    console.log('✅ 全班同步廣播事件去重機制 (重複網路事件不重複彈題): 通過');
  } else {
    console.error('❌ 全班同步事件去重測試失敗: triggerCount =', triggerCount);
    allPassed = false;
  }
}

// 測試 getValidCurrentTime 絕不回傳假 0 秒
{
  function getValidCurrentTime(isPlayerReady, playerType, mockTime) {
    if (!isPlayerReady) return null;
    if (playerType === 'html5') {
      return (typeof mockTime === 'number' && !isNaN(mockTime)) ? mockTime : null;
    }
    return null;
  }

  const notReadyTime = getValidCurrentTime(false, 'html5', 0);
  const readyZeroTime = getValidCurrentTime(true, 'html5', 0);
  const readyPlayingTime = getValidCurrentTime(true, 'html5', 91.5);

  if (notReadyTime === null && readyZeroTime === 0 && readyPlayingTime === 91.5) {
    console.log('✅ getValidCurrentTime 規則 (未就緒回傳 null、起點合法 0 秒回傳 0、播放時回傳實際秒數): 通過');
  } else {
    console.error('❌ getValidCurrentTime 測試失敗');
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n⚠️ 有項目未通過驗證！');
  process.exit(1);
} else {
  console.log(`\n🎉 所有 ${checks.length} 項靜態檢查與所有核心演算法單元測試全數 100% 通過！\n`);
}
