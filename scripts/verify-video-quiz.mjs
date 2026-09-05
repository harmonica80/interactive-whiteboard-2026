import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf8');
const vqJs = fs.readFileSync('js/video_quiz.js', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const checks = [
  ['package.json version 2.9.9', pkg.version === '2.9.9'],
  ['app.js APP_VERSION 2.9.9', appJs.includes("this.APP_VERSION = '2.9.9';")],
  ['index.html badge ver 2.9.9', html.includes('ver 2.9.9')],
  ['index.html style.css?v=169', html.includes('css/style.css?v=169')],
  ['index.html panel-video-quiz', html.includes('id="panel-video-quiz"')],
  ['index.html vqSyncSection', html.includes('id="vqSyncSection"')],
  ['index.html vqSelfSection', html.includes('id="vqSelfSection"')],
  ['index.html vqEditorSection', html.includes('id="vqEditorSection"')],
  ['index.html vqQuestionOverlay', html.includes('id="vqQuestionOverlay"')],
  ['index.html vqAnalyticsModal', html.includes('id="vqAnalyticsModal"')],
  ['index.html vqEditQuizModal', html.includes('id="vqEditQuizModal"')],
  ['index.html vqQuestionEditModal', html.includes('id="vqQuestionEditModal"')],
  ['index.html vqImportModal', html.includes('id="vqImportModal"')],
  ['index.html vqFormatGuideModal', html.includes('id="vqFormatGuideModal"')],
  ['index.html video_quiz.js?v=299', html.includes('js/video_quiz.js?v=299')],
  ['video_quiz.js VideoQuizManager class', vqJs.includes('class VideoQuizManager')],
  ['video_quiz.js single choice support', vqJs.includes("type: 'single'")],
  ['video_quiz.js multiple choice support', vqJs.includes("type: 'multiple'")],
  ['video_quiz.js text question support', vqJs.includes("type: 'text'")],
  ['video_quiz.js getSampleTemplateJSON', vqJs.includes('getSampleTemplateJSON')],
  ['video_quiz.js downloadSampleTemplateJSON', vqJs.includes('downloadSampleTemplateJSON')],
  ['video_quiz.js getSampleTemplateCSV', vqJs.includes('getSampleTemplateCSV')],
  ['video_quiz.js downloadSampleTemplateCSV', vqJs.includes('downloadSampleTemplateCSV')],
  ['video_quiz.js exportQuizzesJSON', vqJs.includes('exportQuizzesJSON')],
  ['video_quiz.js exportQuizzesCSV', vqJs.includes('exportQuizzesCSV')],
  ['video_quiz.js executeImport', vqJs.includes('executeImport')],
  ['video_quiz.js parseQuizzesFromJSON', vqJs.includes('parseQuizzesFromJSON')],
  ['video_quiz.js parseQuizzesFromCSV', vqJs.includes('parseQuizzesFromCSV')],
  ['video_quiz.js class analytics calculation', vqJs.includes('renderAnalyticsDashboard')],
  ['style.css video-quiz styles', css.includes('.video-quiz-player-container') && css.includes('.video-quiz-overlay')]
];

let allPassed = true;
console.log('\n--- 驗證互動式影片出題測驗系統項目 (ver 2.9.9) ---');
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
