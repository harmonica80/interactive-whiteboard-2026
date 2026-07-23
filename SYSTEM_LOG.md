# System Log

## 2026-07-09 - OpenCode
- 修改項目：專注力遊戲新增「求救提示」按鈕。
- 行為：使用者按提示後，系統會高亮下一個應點擊的數字。
- 計分：每使用一次提示會將完成時間增加 5 秒。
- 資料紀錄：排行榜結果會寫入 `helpCount` 與 `penaltySeconds`，方便日後查詢提示使用狀況。
- 影響檔案：`index.html`, `js/app.js`, `css/style.css`。
- 備註：程式碼中已加入 `OpenCode 修改` 註解，方便 Antigravity 或其他 AI 接手辨識修改來源。

## 2026-07-09 - OpenCode
- 修改項目：專注力遊戲新增第一版「位置序列記憶」與「反向模式」。
- 行為：老師可在管理後台選擇位置序列記憶，設定序列長度與是否反向作答；系統會將同一組位置序列寫入 Firebase，學生觀看閃爍後依序或反向點回。
- 計分：完成時間會寫入排行榜；點錯會加時 3 秒並記錄 `mistakes`。
- 資料紀錄：排行榜結果會寫入 `gameType`, `reverseMode`, `mistakes`, `helpCount`, `penaltySeconds`。
- 同步保護：新增本地遊戲 key，避免其他學生完成造成 Firebase `results` 更新時，重置尚在作答學生的遊戲畫面。
- 影響檔案：`index.html`, `js/app.js`, `css/style.css`。
- 備註：程式碼中已加入 `OpenCode 修改` 註解，方便 Antigravity 或其他 AI 接手辨識修改來源。

## 2026-07-09 - OpenCode
- 修改項目：修正「位置序列記憶」切換後看似無作用的錯誤。
- 原因：位置序列模式啟動時使用 `grid` 但未宣告，造成 JavaScript 錯誤中斷。
- 行為：補上 `focusGameGrid` 參照，並相容 Firebase 將序列存為 array 或 object 的情況。
- 快取：前端資源版本更新為 `v=85`，避免瀏覽器繼續載入舊版程式。
- 影響檔案：`index.html`, `js/app.js`。

## 2026-07-09 - OpenCode
- 修改項目：專注力遊戲管理區依遊戲類型切換設定顯示。
- 行為：選擇「舒爾特方格」時顯示數字數量卡片；選擇「位置序列記憶」時隱藏舒爾特方格設定，只顯示位置記憶的盤面大小、序列長度與反向模式。
- 共用設定：開始倒數秒數保留為兩種遊戲共用欄位。
- 快取：前端資源版本更新為 `v=86`。
- 影響檔案：`index.html`, `js/app.js`。

## 2026-07-09 - OpenCode
- 修改項目：專注力遊戲倒數畫面說明依遊戲類型切換。
- 行為：舒爾特方格倒數仍顯示依序尋找數字說明；位置序列記憶倒數會改顯示盤面格數、序列長度，以及正常或反向作答提示。
- 快取：前端資源版本更新為 `v=87`。
- 同步：本次變更需同步推送至 GitHub 遠端倉庫。
- 影響檔案：`index.html`, `js/app.js`。

## 2026-07-22 - Antigravity
- 修改項目：新增整合 tldraw 互動白板（方案 A：iframe 沙盒隔離）與 JSON 備份同步。
- 行為：
  1. 新增 `whiteboard.html` 獨立頁面，採用 tldraw 畫布並透過 IndexedDB 進行本地畫圖自動存檔。
  2. `index.html` 功能選單新增「🎨 互動白板」分頁與 iframe 沙盒容器，確保 100% 樣式與系統腳本隔離。
  3. 管理後台「📤 匯出 JSON 記錄」自動透過 `postMessage` 通訊抓取白板快照，打包至單一 `.json` 檔案。
  4. 管理後台「📥 匯入 JSON 記錄」自動解析並還原白板畫圖，且不干擾 Firebase 資料庫。
## 2026-07-22 - Antigravity
- 修改項目：取消主要功能單元標題區塊 (.panel-header) 的點擊收合功能。
- 行為：
  1. 移除 `.panel-header` 的點擊切換 `.collapsed` 事件監聽。
  2. 移除主要單元標題右側的 `▼` 收合箭頭 (`.collapse-icon`)。
  3. 滑鼠移至單元標題上時保持預設指標 (`cursor: default`)。
## 2026-07-22 - Antigravity
- 修改項目：於「🎨 互動白板」面板下方新增操作使用說明。
- 行為：標註剪貼（文字/圖片/連結）、縮放（Ctrl+滑鼠滾輪）、平移（空白鍵拖曳/滾輪拖曳）3 大提示。
## 2026-07-22 - Antigravity
- 修改項目：管理後台「🔄 清除所有資料」同步清除 tldraw 互動白板內容。
- 行為：點擊重設時，系統經由 `postMessage` 呼叫白板清空所有筆跡圖案，並刪除 IndexedDB 快取，隨後清除 Firebase 資料庫。
## 2026-07-23 - Antigravity
- 修改項目：專注力遊戲兩款一字千金測驗（字力測驗、字字珠璣）新增未填寫位置的醒目螢光框提醒。
- 行為：點擊「送出答案」時若有未填寫格子，系統會自動高亮標記螢光霓虹邊框與脈衝動畫，並自動 focus 聚焦至第一個未填寫處；輸入文字後螢光框自動消除。
## 2026-07-23 - Antigravity
- 修改項目：刪除各功能卡片上方重複的標題列 (.panel-header)。
- 行為：因頁面頂部功能選單已有高亮標示當前頁籤，故移除卡片內部的紫色/主題標題欄位，使介面更加簡潔俐落且增大操作空間。
## 2026-07-23 - Antigravity
- 修改項目：實現 tldraw 互動白板多人在線跨裝置即時同步 (Multiplayer Realtime Sync)。
- 行為：
  1. 監聽 `whiteboard.html` 的使用者動作 (`source: 'user'`)，防抖 300ms 傳送畫快照至 `app.js`。
  2. `app.js` 將繪圖狀態自動推播至 Firebase `whiteboard_room` 節點。
  3. 所有在線學生與老師即時訂閱 Firebase 廣播，並自動重繪白板 (`LOAD_TLDRAW_SNAPSHOT`)，解決異地跨裝置貼圖與手寫無法同步的問題。
## 2026-07-23 - Antigravity
- 修改項目：修復 tldraw 快照寫入 Firebase 時因 Key 包含 "."（點號）導致被資料庫拒絕而無法即時同步的關鍵 Bug。
- 行為：
  1. 將 tldraw Snapshot 在寫入 Firebase 前統一經由 `JSON.stringify` 序列化為純文字字串儲存，徹底避開 Firebase Key 非法字元限制。
  2. 加上 `myTldrawClientId` 客戶端唯一識別碼，精準避免傳送者接收到自己廣播造成的畫面重複重繪。
## 2026-07-23 - Antigravity
- 修改項目：移除 tldraw 的單機本機 `persistenceKey` 隔離快取，徹底統一為雲端共享白板房間。
- 行為：原先 `persistenceKey` 會讓各個瀏覽器強制讀取各自電腦的 IndexedDB 快取，導致不同使用者開出來的畫面都不相同；移除後全體連線使用者一律共享同一份由 Firebase Realtime DB 派發的同步畫稿。
## 2026-07-23 - Antigravity
- 修改項目：切換為 tldraw 官方原生連線同步引擎 (`@tldraw/sync` - `useSyncDemo`)，完全不需經過 Firebase。
- 行為：
  1. 在 `whiteboard.html` 中引入 `@tldraw/sync`，並以專屬房間 ID (`interactive-whiteboard-2026-shared-room`) 啟用 tldraw 原生 WebSocket 同步連線。
  2. 所有人手寫筆劃、文字、圖片貼上、移動及游標全部經由 tldraw 官方原生地通道進行毫秒級即時雙向同步，移除 `app.js` 中複雜的 Firebase 白板寫入與廣播邏輯。
- 影響檔案：`js/app.js`, `whiteboard.html`, `SYSTEM_LOG.md`。










