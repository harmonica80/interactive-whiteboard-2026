import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf8');
const vqJs = fs.readFileSync('js/video_quiz.js', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const quizJs = fs.readFileSync('js/quiz.js', 'utf8');

const fbJs = fs.readFileSync('js/firebase-config.js', 'utf8');

const checks = [
  ['package.json version 3.3.3', pkg.version === '3.3.3'],
  ['app.js APP_VERSION 3.3.3', appJs.includes("this.APP_VERSION = '3.3.3';")],
  ['index.html badge ver 3.3.3', html.includes('ver 3.3.3')],
  ['index.html adminNewClassName maxlength="50"', html.includes('id="adminNewClassName"') && html.includes('maxlength="50"')],
  ['index.html adminEditClassName maxlength="50"', html.includes('id="adminEditClassName"') && html.includes('maxlength="50"')],
  ['index.html studentNameModal exists', html.includes('id="studentNameModal"')],
  ['index.html itemEditModal exists', html.includes('id="itemEditModal"')],
  ['app.js openStudentNameModal method', appJs.includes('openStudentNameModal()')],
  ['app.js isItemOwner method', appJs.includes('isItemOwner(item)')],
  ['index.html style.css?v=180', html.includes('css/style.css?v=180')],
  ['index.html firebase-config.js?v=333', html.includes('js/firebase-config.js?v=333')],
  ['index.html app.js?v=333', html.includes('js/app.js?v=333')],
  ['index.html quiz.js?v=333', html.includes('js/quiz.js?v=333')],
  ['index.html video_quiz.js?v=333', html.includes('js/video_quiz.js?v=333')],
  ['index.html song_quiz.js?v=333', html.includes('js/song_quiz.js?v=333')],
  ['firebase-config.js updateClass method exists', fbJs.includes('async updateClass(oldCode, newCode, newName')],
  ['firebase-config.js updateClass checks duplicate code', fbJs.includes('checkClassExists(sanitizedNew)') && fbJs.includes('已存在，無法使用此代碼')],
  ['firebase-config.js getModuleCounts method exists', fbJs.includes('async getModuleCounts(')],
  ['firebase-config.js copyModuleData method exists', fbJs.includes('async copyModuleData(')],
  ['firebase-config.js copySingleCustomSet method exists', fbJs.includes('async copySingleCustomSet(')],
  ['firebase-config.js copySingleItem method exists', fbJs.includes('async copySingleItem(')],
  ['index.html adminCrossClassCopySection exists', html.includes('id="adminCrossClassCopySection"')],
  ['index.html quickCopyCustomSetModal exists', html.includes('id="quickCopyCustomSetModal"')],
  ['index.html singleItemCopyModal exists', html.includes('id="singleItemCopyModal"')],
  ['app.js startCrossClassCopy method exists', appJs.includes('async startCrossClassCopy()')],
  ['app.js openQuickCopyCustomSetModal method exists', appJs.includes('openQuickCopyCustomSetModal(')],
  ['app.js confirmQuickCopyCustomSet method exists', appJs.includes('async confirmQuickCopyCustomSet()')],
  ['app.js openSingleItemCopyModal method exists', appJs.includes('openSingleItemCopyModal(')],
  ['app.js confirmSingleItemCopy method exists', appJs.includes('async confirmSingleItemCopy()')],
  ['video_quiz.js custom set has quick copy button', vqJs.includes('openQuickCopyCustomSetModal(') && vqJs.includes('📤 複製到其他班')],
  ['video_quiz.js quiz card has single item copy button', vqJs.includes("openSingleItemCopyModal('videoQuiz'") && vqJs.includes('📤 複製到其他班')],
  ['quiz.js history has single item copy button', quizJs.includes("openSingleItemCopyModal('quiz'")],
  ['index.html adminEditClassModal exists', html.includes('id="adminEditClassModal"')],
  ['index.html adminClassChangedReminderModal exists', html.includes('id="adminClassChangedReminderModal"')],
  ['app.js renderAdminClassList has edit button', appJs.includes('adminOpenEditClassModal(') && appJs.includes('✏️ 編輯')],
  ['app.js adminOpenEditClassModal method', appJs.includes('adminOpenEditClassModal(code)')],
  ['app.js adminConfirmEditClass method', appJs.includes('adminConfirmEditClass()')],
  ['app.js adminShowClassChangedReminder method', appJs.includes('adminShowClassChangedReminder(')],
  ['app.js copyNewClassShareLink method', appJs.includes('copyNewClassShareLink(')],
  ['quiz.js clearQuizResults method', quizJs.includes('clearQuizResults()') && quizJs.includes('resultsContainer.innerHTML = \'\'')],
  ['app.js resetAll clears quiz results', appJs.includes('window.quiz.clearQuizResults()')],
  ['index.html panel-video-quiz', html.includes('id="panel-video-quiz"')],
  ['index.html vqStudentModeBanner', html.includes('id="vqStudentModeBanner"')],
  ['index.html vqStudentModeBadge', html.includes('id="vqStudentModeBadge"')],
  ['index.html adminVideoQuizModeRadio', html.includes('name="adminVideoQuizModeRadio"')],
  ['index.html vqAdminModeSectionTitle (dynamic section title)', html.includes('id="vqAdminModeSectionTitle"')],
  ['index.html vqAdminQuizSelectLabel (dynamic select label)', html.includes('id="vqAdminQuizSelectLabel"')],
  ['index.html vqAdminStartQuizBtn (dynamic start quiz button)', html.includes('id="vqAdminStartQuizBtn"')],
  ['index.html vqAdminCustomSetsList', html.includes('id="vqAdminCustomSetsList"')],
  ['index.html vqEditCustomSetNameModal (rename modal)', html.includes('id="vqEditCustomSetNameModal"')],
  ['index.html vqEditCustomSetNameInput', html.includes('id="vqEditCustomSetNameInput"')],
  ['index.html vqAnalyticsModal backdrop close support', html.includes('id="vqAnalyticsModal"') && html.includes('event.target===this')],
  ['video_quiz.js VideoQuizManager class', vqJs.includes('class VideoQuizManager')],
  ['video_quiz.js applyGlobalMode dynamic title & label & button', vqJs.includes('vqAdminModeSectionTitle') && vqJs.includes('vqAdminQuizSelectLabel') && vqJs.includes('vqAdminStartQuizBtn')],
  ['video_quiz.js startAdminSelectedQuiz', vqJs.includes('startAdminSelectedQuiz()')],
  ['video_quiz.js openEditCustomSetNameModal', vqJs.includes('openEditCustomSetNameModal(setId)')],
  ['video_quiz.js confirmEditCustomSetName', vqJs.includes('confirmEditCustomSetName()')],
  ['video_quiz.js custom sets optgroup renamed to 測驗組合', vqJs.includes('🌟 測驗組合') && vqJs.includes('renderQuizSelector')],
  ['video_quiz.js toggleQuizEnabled (video-level display toggle)', vqJs.includes('toggleQuizEnabled(quizId)')],
  ['video_quiz.js toggleSelectQuizForCustomSet (multi-video selection)', vqJs.includes('toggleSelectQuizForCustomSet(quizId)')],
  ['video_quiz.js startSyncQuizFromCustomSet', vqJs.includes('startSyncQuizFromCustomSet(setId)')],
  ['video_quiz.js assignCustomSetToSelfPaced', vqJs.includes('assignCustomSetToSelfPaced(setId)')],
  ['video_quiz.js student quiz selector filters enabled videos', vqJs.includes('this.quizzes.filter(q => q.enabled !== false)')],
  ['video_quiz.js jumpToQuestion (out-of-order jump)', vqJs.includes('jumpToQuestion(index)')],
  ['video_quiz.js toggleAllowStudentRepeat (repeat questions toggle)', vqJs.includes('toggleAllowStudentRepeat(checked)')],
  ['video_quiz.js handleVideoEnded (multi-video auto-advance)', vqJs.includes('handleVideoEnded()') && vqJs.includes('switchCustomSetVideo')],
  ['video_quiz.js stopSyncQuiz returns to admin tab', vqJs.includes("switchToTab('panel-admin')")],
  ['video_quiz.js returnToQuizVideo method', vqJs.includes('returnToQuizVideo()')],
  ['video_quiz.js question overlay has 返回測驗影片 button', vqJs.includes('🎬 返回測驗影片')],
  ['video_quiz.js question overlay deleted 返回後台 button', !vqJs.includes('⚙️ 返回後台')],
  ['video_quiz.js sanitizeCustomSets single default custom set', vqJs.includes('sanitizeCustomSets(list)') && vqJs.includes('綜合影音複習測驗組')],
  ['style.css video-quiz styles', css.includes('.video-quiz-player-container') && css.includes('.video-quiz-overlay')]
];

let allPassed = true;
console.log('\n--- 驗證互動式影片出題測驗系統項目 (ver 3.2.3) ---');
for (const [name, passed] of checks) {
  if (passed) {
    console.log(`✅ ${name}`);
  } else {
    console.error(`❌ ${name}`);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n⚠️ 有項目未通過驗證！');
  process.exit(1);
} else {
  console.log(`\n🎉 所有 ${checks.length} 項功能與整合檢查皆全數通過！\n`);
}
