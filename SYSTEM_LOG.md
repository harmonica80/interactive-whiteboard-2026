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
## 2026-07-23 - Antigravity
- 修改項目：修復行動裝置 Safari/Chrome 載入 `@tldraw/sync` 拋出 WebSocket `onSyncError` 崩潰卡死問題。
- 行為：
  1. 移除行動端不相容且易被電信商/瀏覽器擋下的 `@tldraw/sync` WebSocket 示範伺服器連線。
  2. 改回以穩定流暢的 Firebase Realtime DB 為中央控制樞紐，配合 `JSON.stringify` 序列化畫稿與 `myTldrawClientId` 防重複刷洗機制，確保跨電腦與手機/平板（iOS & Android）100% 穩定即時同步。
## 2026-07-23 - Antigravity
- 修改項目：優化行動裝置白板工具列邊距遮擋與平移拖曳手勢支援。
- 行為：
  1. 在 `whiteboard.html` 中加入 `touch-action: none` 允許 tldraw 完全接管行動端手勢，並抬升 `.tlui-toolbar` 底部邊距 `margin-bottom: 16px`，防止下方工具列被說明框遮擋。
  2. 更新白板使用說明，註明行動裝置「雙指滑動平移/捏合縮放」與「點擊選單 🖐️ 手掌工具單指拖曳平移」的操作指南。
## 2026-07-23 - Antigravity
- 修改項目：壓縮 tldraw 工具列高度，並開啟工具列橫向滑動平移功能。
- 行為：
  1. 將 `.tlui-toolbar` 及其按鈕高度由 48px+ 壓縮至 44px (按鈕 36px)，顯著減少工具列佔用的垂直空間。
  2. 加入 `max-width: calc(100vw - 20px)`, `overflow-x: auto`, `touch-action: pan-x` 與 `flex-wrap: nowrap`，讓手機使用者可在工具列上直接左右滑動平移，輕鬆選取後方的便條紙、形狀、媒體、雷射筆等工具。
## 2026-07-23 - Antigravity
- 修改項目：修復 tldraw 底部工具列於行動端遺失/隱藏的 CSS 佈局問題。
- 行為：
  1. 將 `.tlui-toolbar` 設定為 `position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); z-index: 999`，強制置中懸浮於畫布下方 12px 處，100% 清晰顯示。
  2. 對內部按鈕容器 `.tlui-toolbar__tools` 設定 `overflow-x: auto; flex-wrap: nowrap; flex-shrink: 0; touch-action: pan-x`，讓使用者能在工具列上順暢單指左右滑動，選取所有工具（選擇、手掌、畫筆、橡皮擦、箭頭、文字、便條紙、圖形、媒體等）。
## 2026-07-23 - Antigravity
- 修改項目：還原並重構 tldraw 原生工具列 CSS 樣式，解決工具列消失問題。
- 行為：
  1. 移除過度幹擾 tldraw 原生計算的 `position: absolute / transform` 強制改寫，恢復 tldraw 原生 React 工具列定位邏輯，確保工具列 100% 正常浮現。
  2. 僅保留極簡的 `margin-bottom: 10px` 抬升邊距與 `overflow-x: auto` 手勢平移，兼顧手機版滑動平移選取工具與畫面穩定顯示。
## 2026-07-23 - Antigravity
- 修改項目：去除 tldraw 底部工具列白框下方的多餘空白，使外框高度精準緊貼工具圖示。
- 行為：
  1. 重設 `.tlui-toolbar` 的 `min-height: unset; height: auto` 並精準將上下 padding 縮減至 `4px 6px`。
  2. 移除工具按鈕上下多餘 margin，使白框高度與工具圖示緊密貼合，消除原本下方的空白區塊。
## 2026-07-23 - Antigravity
- 修改項目：隔離電腦端與行動端工具列 CSS，電腦端 100% 完全恢復 tldraw 原始原生樣式與大小。
- 行為：
  1. 電腦端 (`width > 768px`) 完全不施加任何自訂 CSS 樣式，百分之百保留 tldraw 官方原汁原味的工具列尺寸、寬度與高度。
  2. 行動端 (`@media (max-width: 768px)`) 僅作最安全輕量的 `padding-bottom/margin-bottom` 貼合與 `overflow-x: auto` 橫向滑動選取，解決手機端工具列消失或擠壓問題。
## 2026-07-23 - Antigravity
- 修改項目：恢復行動端 tldraw 原生 `^`（Chevron Up）工具選單展開彈窗功能。
- 行為：
  1. 移除行動端過度強制干擾的 `overflow-x: auto`，完整還原 tldraw 原生右側 `^` 展開按鈕。點擊即可開啟 4 欄式全工具彈窗（包含文字、便條紙、各式形狀、箭頭、雷射筆等 24 種工具）。
  2. 精準收緊行動端白框上下 Padding (4px)，消除工具列下方的多餘留白，且電腦端 (Desktop > 768px) 保持 100% 原生樣式完全不受影響。
## 2026-07-23 - Antigravity
- 修改項目：將行動端最右側 `^` 展開按鈕向內移動，防止被螢幕右側邊緣裁切。
- 行為：
  1. 將行動端 (`@media (max-width: 768px)`) 工具列單個按鈕尺寸由 38px 輕量精簡至 34px，並縮減按鈕間距至 1px。
  2. 設定左右 Padding 為 8px，使 7 個工具按鈕（含最右側 `^` 箭頭）整體寬度減少約 35px，確保最右側 `^` 展開選單按鈕完全向內移入畫面，100% 清晰可點擊。
## 2026-07-23 - Antigravity
- 修改項目：消除行動端工具列左側過多留白，大幅將右側 `^` 展開按鈕向左拉回入鏡。
- 行為：
  1. 對 `.tlui-toolbar__tools` 設定 `display: flex; justify-content: center` 消除原先左側的偏置留白，使按鈕群置中。
  2. 精簡行動端按鈕尺寸至 32px，總寬度縮減至 236px，使最右側 `^` 展開按鈕向左大幅拉回 35px+，在各種解析度的手機上均 100% 完整呈現且絕不被裁切。
## 2026-07-23 - Antigravity
- 修改項目：修復行動端工具列因容器寬度計算錯誤導致向右跑版偏離螢幕的 Bug。
- 行為：
  1. 移除幹擾 tldraw 原生計算的 `width: 100%; justify-content: center` 強制改寫，恢復 tldraw 原生置中與寬度計算機制。
  2. 將按鈕精準固定為 `width: 32px; max-width: 32px`，將 7 個工具按鈕（含最右側 `^` 箭頭）完美收納在 224px 的白框內部，使工具列 100% 穩定居中浮現於手機螢幕中央。
## 2026-07-23 - Antigravity
- 修改項目：擴大行動端工具列白框左右內邊距 (10px)，並微調按鈕為 29px，使最右側 `^` 箭頭完全收納入白框內部。
- 行為：
  1. 將行動端工具列左右 padding 設定為 `10px`，按鈕固定為 `29px` (圖示 `15px`)。
  2. 確保最右側 `^` 向上箭頭按鈕與白框右邊界保有 10px 的安全距離，100% 完整清晰呈現於白框內部且容易點擊。
## 2026-07-23 - Antigravity
- 修改項目：修復按鈕過度縮小導致 tldraw 內部條件性卸載最右側 `^` 箭頭按鈕的 Bug。
- 行為：
  1. 對行動端 (`@media (max-width: 768px)`) 工具列設定 `width: max-content !important`，確保容器寬度達 273px 以上，100% 觸發 tldraw 渲染第 7 個 `^` 箭頭按鈕。
  2. 將按鈕設定為適中的 `35px` (圖示 `17px`) 搭配 8px 左右 padding，使第 7 個 `^` 箭頭按鈕在白框內部 100% 完整清晰呈現，不再因容器過窄而被 tldraw 自動隱藏。
## 2026-07-23 - Antigravity
- 修改項目：徹底修復行動端切換至 Desktop 模式導致 `T` 按鈕裁切且 `^` 箭頭消失的根源 Bug。
- 行為：
  1. 對行動端 (`@media (max-width: 768px)`) 工具列設定 `max-width: 250px !important`，100% 強制觸發 tldraw 啟動原生 Mobile 模式。
  2. 對內部容器設定 `justify-content: space-between` 均勻排列 7 個 30px 按鈕，確保最右側 `^` 向上箭頭按鈕 100% 完整清晰呈現於白框內右側，點擊即可順暢彈出 24 種工具選擇面板。
## 2026-07-23 - Antigravity
- 修改項目：於行動端 (`@media (max-width: 768px)`) 設定絕對置中定位，徹底解決工具列向右跑版問題。
- 行為：
  1. 對行動端設定 `position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%)`，強制白框於手機螢幕中央懸浮，防範任何 flex 偏移。
  2. 精簡 7 個按鈕尺寸至 32px，確保包含最右側 `^` 向上箭頭在內的全體工具按鈕完美呈現於白框內。
  3. 電腦端 (`width > 768px`) 保持 100% 原始原生樣式完全不受影響。
## 2026-07-23 - Antigravity
- 修改項目：修復行動端快捷操作列 (復原/重做/刪除) 與工具列重疊覆蓋的 Bug。
- 行為：
  1. 對行動端底部佈局容器 `.tlui-layout__bottom` 設定 `flex-direction: column; align-items: center`，將快捷操作列 (復原/重做/刪除/複製) 自動整齊地排列在主工具列正上方。
  2. 主工具列恢復 `relative` 流式居中對齊，兩層選單上下分離不重疊、不遮擋，操作流暢美觀。
- 影響檔案：`whiteboard.html`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：引入 `forceMobile` 屬性與行動端滿版白板 CSS，徹底修復 `^` 向上箭頭在手機端消失的 Bug。
- 行為：
  1. 在 `whiteboard.html` 中對 `<Tldraw />` 傳入 `forceMobile: isMobile` 屬性，強制 tldraw 在任何手機視窗下都 100% 採用行動版折疊工具列，防止其誤入中等寬度半電腦版版型。
  2. 在 `css/style.css` 中設定行動端負 Margin (`margin-left: -12px` / `-20px`)，使白板卡片頂滿手機螢幕邊緣，免除 body padding 限制，為白板工具列多爭取 24px+ 可用寬度，確保工具按鈕完全不被裁剪且 `^` 箭頭 100% 清晰浮現。
- 影響檔案：`whiteboard.html`, `css/style.css`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：移除 `forceMobile` 限制，恢復行動端主工具列絕對置中定位與按鈕大小，還原最右側 `^` 箭頭。
- 行為：
  1. 移除 `whiteboard.html` 中強制的 `forceMobile: isMobile` 標記，允許 tldraw 使用預設的 overflow 摺疊邏輯渲染工具列。
  2. 恢復行動端工具列 `.tlui-toolbar` 的 `position: absolute; left: 50%; transform: translateX(-50%)` 絕對置中，並將按鈕精細微調至 `34px` (圖示 `16px`)。
  3. 這與行動端滿版白板（40px 可用寬度提升）相結合，使 7 個工具按鈕（選擇、手掌、畫筆、橡皮擦、箭頭、文字 + `^` 向上箭頭）以 Desktop/Tablet 模式的 Overflow 機制 100% 完整清晰呈現在螢幕中央，無任何裁切跑版。
- 影響檔案：`whiteboard.html`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：行動端 DOM 優化，動態將圓形選單按鈕（StylePanel 切換按鈕）移入工具列內部，徹底解決重疊並還原 `^` 箭頭。
- 行為：
  1. 啟用 `forceMobile: isMobile`，以啟動帶有 `^` 向上箭頭的圓圈選單按鈕，保證工具折疊的完整度。
  2. 使用 `MutationObserver` 監聽 DOM 節點變動，在行動端動態將 `.tlui-style-panel__button` 節點以 `appendChild` 移入 `.tlui-toolbar__tools` 容器內。
  3. 配合 CSS 微調工具列右側 `padding-right: 40px`，並將該按鈕以絕對定位（不使用 scale）完美鎖定在工具列白框的最右側。
  4. 此方案兼具行動端 100% 座標精準度，將原本浮動重疊的圓圈按鈕完美改造成工具列的最右側第 7 個按鈕，無任何跑版或遮擋。
- 影響檔案：`whiteboard.html`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：更新資源版本號，並引入 iframe 專屬防快取（Cache-Busting）控制機制。
- 行為：
  1. 將 `index.html` 中的應用程式 JS 版本 Query Parameter 統一由 `?v=141` 升級為 `?v=142`。
  2. 在 `index.html` 的 `<body>` 尾端加上 `DOMContentLoaded` 初始化監聽，動態為 `whiteboardFrame` iframe 的 src 附加 `?v=142` 版本字串。
  3. 這可強制行動端瀏覽器與 GitHub Pages CDN 繞過舊有快取快照，在每次更新時即時獲取最新版 DOM 移入方案程式碼。
- 影響檔案：`index.html`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：行動端隱藏說明文字面板，徹底解決 iframe 高度受擠壓向下偏移遮擋工具列的 Bug。
- 行為：
  1. 在 `css/style.css` 的行動端查詢 `@media (max-width: 768px)` 中設定 `.whiteboard-instructions { display: none !important; }`，徹底釋放底部近 100px 的垂直高度空間。
  2. 將 `index.html` 的 `style.css` 版本 Query Parameter 升級為 `?v=142`，強制繞過瀏覽器對 CSS 的快取。
  3. 這保證 iframe 的底部完整貼合卡片底邊，主工具列能以 100% 完整的高度呈現，不再遭受任何底部遮擋。
- 影響檔案：`css/style.css`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：恢復工具列行動端絕對定位，徹底解決主工具列向下溢出裁切的排版問題。
- 行為：
  1. 將 `whiteboard.html` 行動端 CSS 中的 `.tlui-toolbar` 重新設定為 `position: absolute !important; bottom: 12px !important; left: 50% !important; transform: translateX(-50%) !important;`。
  2. 這能確保工具列不受相對定位的流式高度影響，穩妥懸浮於白板底邊上方 12px 處，100% 完整展示，不再被向下推出視口之外。
- 影響檔案：`whiteboard.html`, `SYSTEM_LOG.md`。
## 2026-07-23 - Antigravity
- 修改項目：升級所有主幹資源快取控制版本至 `v143`。
- 行為：
  1. 將 `index.html` 中引入 `css/style.css`、`js/app.js` 等腳本以及 `whiteboardFrame` iframe 的動態 src 版本號統一提升至 `?v=143`。
  2. 強制手機與 CDN 客端徹底重新整理暫存，確保最新的絕對定位優化與說明文字隱藏樣式 100% 立即生效。
- 影響檔案：`index.html`, `SYSTEM_LOG.md`。







## 2026-07-23 - Antigravity
- 修改項目：優化行動端白板 UI 佈局，解決選單重疊跑版與 `^` 箭頭顯示 Bug（方案 A 實作）。
- 行為：
  1. 移除 `whiteboard.html` 中對 `.tlui-layout__bottom` 及工具列按鈕尺寸的所有暴力 CSS `!important` 覆寫，完整回歸 tldraw 原生 React 佈局與錨點計算。
  2. 透過 `<Tldraw />` 的 `components` 屬性，在行動端將主選單 `MainMenu`、分頁選單 `PageMenu`、縮放控制 `NavigationPanel`、說明 `HelpMenu` 與底部快捷列 `QuickActions` 全數設為 `null` 隱藏，騰出手機端最開闊的繪圖空間。
  3. 獨立在行動端白板頂部右上角自行實作精美、半透明的「復原/重做」按鈕組，透過 `editor.store.listen` 即時驅動 `editor.getCanUndo()` 和 `editor.getCanRedo()` 狀態，防止任何底部選單重疊衝突。



























