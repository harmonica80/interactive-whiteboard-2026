import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf8');
const vqJs = fs.readFileSync('js/video_quiz.js', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const checks = [
  ['package.json version 3.0.4', pkg.version === '3.0.4'],
  ['app.js APP_VERSION 3.0.4', appJs.includes("this.APP_VERSION = '3.0.4';")],
  ['index.html badge ver 3.0.4', html.includes('ver 3.0.4')],
  ['index.html style.css?v=174', html.includes('css/style.css?v=174')],
  ['index.html video_quiz.js?v=304', html.includes('js/video_quiz.js?v=304')],
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
  ['video_quiz.js single default custom set in DEFAULT_CUSTOM_SETS', vqJs.includes('DEFAULT_CUSTOM_SETS') && vqJs.includes('綜合影音複習測驗組') && vqJs.includes('cset_comprehensive_default')],
  ['style.css video-quiz styles', css.includes('.video-quiz-player-container') && css.includes('.video-quiz-overlay')]
];

let allPassed = true;
console.log('\n--- 驗證互動式影片出題測驗系統項目 (ver 3.0.4) ---');
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
