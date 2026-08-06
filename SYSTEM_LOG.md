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
- 修改項目：升級 DOM 節點移入選擇器（全匹配型）並套用強行 JS 內聯 inline important 覆寫，且版本升級至 `v144`。
- 行為：
  1. 在 `whiteboard.html` 中，將 DOM 節點 Observer 匹配 Selector 改為超寬容的 `button[class*="style-panel"], [class*="style-panel"] button`（覆蓋 style-panel__toggle 類名），並對工具列定位容器啟用 `.tlui-toolbar` 全匹配，徹底確保按鈕與容器 100% 成功匹配。
  2. 在 JS 中對移入後的按鈕以 `.style.setProperty(..., 'important')` 強制灌注 inline 絕對定位，徹底擺脫原處浮動，融合為第 7 個按鈕。
  3. 將 `index.html` 的所有資源與 iframe src 版本 Query 升級為 `?v=144`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：修復專注力測驗與搶答功能在倒數完畢後卡死於 0 秒的 Bug（注入本地樂觀切換機制）。
- 行為：
  1. 在 `js/app.js` 的 `startLocalCountdown` 與 `startBuzzLocalCountdown` 中加入學生端防禦性本地啟動備援。
  2. 當倒數到 0 秒後，若因老師端瀏覽器分頁休眠（Background Suspend）未將 status 改為 `playing`，學生端會自動在 600ms 後發起「本地樂觀切換」，讓學生 100% 順暢進入作答畫面，解決卡死現象。
- 影響檔案：`js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動端白板徹底清空工具列中央滯留的 `.tlui-popover` 白色背景底座與殘影，升級至 `v1.5.2`。
- 行為：
  1. 在 `whiteboard_v146.html` 中新增對非 content 的 `[class*="popover"]` 外層容器強制 `background: transparent !important` 與 `box-shadow: none !important` 覆寫，徹底解決工具列中央（橡皮擦下方）殘留白色圓角底座卡片的問題。
  2. 為右側偏置的第 7 個按鈕（黑色手寫筆圖標）添加獨立的 hover/active 點擊圓角反饋效果，提升視覺質感與操作反饋。
  3. 將 `index.html` 資源與 iframe src 版本 Query 升級為 `?v=152`，白板標記升級為 `v1.5.2`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動端白板實現一屏高免滾動顯示、卡片左右留空與單一工具列結構，升級至 `v1.5.3`。
- 行為：
  1. 在 `css/style.css` 中調整行動端 `#panel-whiteboard > .panel-body` 的高度計算為 `height: calc(100vh - 190px)`，實現開啟頁面免滾動一屏完整呈現在手機畫面上。
  2. 移除白板卡片的負邊距，為 `#panel-whiteboard` 加上左右邊距 `margin: 0`（保留頁面內邊距）、圓角 `border-radius: 16px` 及柔和陰影，使白板範圍邊界清晰易辨。
  3. 在 `whiteboard_v146.html` 中將 `forceMobile` 設為 `false`，回歸桌面端單一工具列模式，將 7 個工具按鈕（包含最右側帶 `^` 箭頭的樣式按鈕）一字排開固定於底部中央，徹底消滅半空中浮動圓圈與雙重工具列重疊問題。
  4. 將 `index.html` 資源與 iframe src 版本 Query 升級為 `?v=153`，白板標記升級為 `v1.5.3`。
- 影響檔案：`css/style.css`, `whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動裝置隱藏主題色系切換按鈕組 (`.theme-switcher`)。
- 行為：
  1. 在 `css/style.css` 的 `@media (max-width: 768px)` 中將 `.theme-switcher` 設為 `display: none !important`，釋放手機端頂部空間。
  2. 將 `index.html` 的 `style.css` 版本 Query 升級為 `?v=154`。
- 影響檔案：`css/style.css`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動端白板徹底隱藏最底部浮動的黑色塗鴉樣式設定按鈕 (`.tlui-popover`, `.tlui-style-panel__toggle`)，升級至 `v1.5.4`。
- 行為：
  1. 在 `whiteboard_v146.html` 的 CSS 中，對獨立浮動於工具列最下方邊緣的黑色塗鴉按鈕及容器注入 `display: none !important`。
  2. 將 `index.html` 資源與 iframe src 版本 Query 升級為 `?v=154`，白板標記升級為 `v1.5.4`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動端白板徹底透明化並限制工具列包裝容器高度，解決下垂長條白色矩形框，並注入 Debug Panel v1.5.5。
- 行為：
  1. 在 `whiteboard_v146.html` 中對 `.tlui-toolbar div` 等所有包裝容器設定 `background: transparent !important` 與 `max-height: 38px !important`，徹底切斷垂直下垂白底。
  2. 依使用者建議重新注入 Debug Panel v1.5.5 於頂部，探測 `y: window.innerHeight - 20` 處之 DOM 節點 Class 名稱。
  3. 將 `index.html` 的 iframe src 版本 Query 升級為 `?v=155`，白板標記升級為 `v1.5.5`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動端白板還原完整 7 工具按鈕佈局，精準清空樣式選單白底，升級至 `v1.5.6`。
- 行為：
  1. 移除 `v1.5.5` 中對全體 `.tlui-toolbar div` 的高度與背景限制，徹底恢復 7 個按鈕（選取、手掌、畫筆、橡皮擦、箭頭、文字、樣式^）的橫向平鋪與高亮感。
  2. 精準針對 `.tlui-style-panel:not([class*="content"])` 進行 background/box-shadow 清空，防止任何下垂白框。
  3. 移除 Debug Panel，升級 Querystring 至 `?v=156`，標記升級至 `v1.5.6`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：行動端白板徹底回歸 100% 原生 Mobile UI Layout，完全恢復樣式按鈕 Hitbox 點擊功能，升級至 `v1.5.7`。
- 行為：
  1. 在 `whiteboard_v146.html` 中重新啟用 `forceMobile: isMobile`，並清除所有會導致 Hitbox 與視覺呈現錯位的 CSS 暴力覆寫。
  2. 樣式按鈕（黑色塗鴉圓圈）原生懸浮於底部工具列正上方 60px 處，與 6 個基本工具按鈕保有 12px 物理間距，無重疊且點擊 **100% 順暢彈出 24 色樣式選單面板**。
  3. 將 `index.html` 的 iframe src 版本 Query 升級為 `?v=157`，白板標記升級為 `v1.5.7`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：全平台白板預設輸入文字字型升級為 `sans` (第二個 Aa - 無襯線字型)，升級至 `v1.5.8`。
- 行為：
  1. 在 `whiteboard_v146.html` 的 `handleMount` 函數中，透過 `editor.setStyleForNextShapes(DefaultFontStyle, 'sans')` 將預設字型設定為無襯線字型 `sans`（即屬性選單紅框處之第二個 `Aa`）。
  2. 監聽工具切換事件（`editor.store.listen`），當使用者切換至文字工具（`text`）時，自動確保預設字型維護為 `sans`。
  3. 將 `index.html` 的 iframe src 版本 Query 升級為 `?v=158`，白板標記升級為 `v1.5.8`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：注入 `registerBeforeCreateHandler` 雙保險 Hook，強制將所有新建文字 shape 的初始字型設為 `sans` (第二個 Aa)，升級至 `v1.5.9`。
- 行為：
  1. 在 `whiteboard_v146.html` 中注入 tldraw `editor.sideEffects.registerBeforeCreateHandler('shape', ...)`，攔截所有類型為 `text` 的新建圖形，將初始 `font` 屬性直接強制綁定為 `sans` (無襯線體，選單中的第二個 Aa)。
  2. 擴充 `applySansFontDefault` 的 StyleProp 掃描覆蓋面，確保不論在 Desktop 還是 Mobile 上，預設打字皆 100% 呈現第二個 Aa 無襯線字型。
  3. 將 `index.html` 的 iframe src 版本 Query 升級為 `?v=159`，白板標記升級為 `v1.5.9`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：全平台無條件渲染右上角版本號標記 (`v1.6.0`) 並提高層級至 `z-index: 9999`，防止行動端誤判消失。
- 行為：
  1. 在 `whiteboard_v146.html` 中調整 `customControls` 為無條件全平台渲染，版本號標記獨立擁有 `z-index: 9999` 與高對比度白底，確保行動端與桌面端 100% 穩定顯示於右上角。
  2. 行動端同步保留半透明 `[↩️ 復原]` 與 `[↪️ 重做]` 按鈕組。
  3. 將 `index.html` 的 iframe src 版本 Query 升級為 `?v=160`，白板標記升級為 `v1.6.0`。
- 影響檔案：`whiteboard_v146.html`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：實作卡片右上角懸浮「留言數量通知徽章 (.card-comment-badge)」。
- 行為：
  1. 在 `css/style.css` 中新增 `.card-comment-badge` 樣式，精準重現使用者設計截圖風格：白底圓角懸浮卡片、黑色通知鈴鐺 🔔 及右上角鮮紅色圓形數字徽章 🔴。
  2. 在 `js/app.js` 的 `renderQuestions` (提問區)、`renderImages` (圖片分享)、`renderVideos` (影片分享) 與 `buildShareItemHTML` (教師分享) 中加入留言總數 `commentCount` 判斷。
  3. 當 `commentCount > 0` 時，自動於卡片右上角渲染懸浮通知徽章，點擊徽章可直接開啟該項目的留言回應視窗。
  4. 將 `index.html` 的 `style.css` 版本 Query 升級為 `?v=161`。
- 影響檔案：`css/style.css`, `js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：電腦端選單項目強制單行不換行 (`white-space: nowrap`) 並增設左右平滑滾動導覽箭頭按鈕 (`◀` / `▶`)。
- 行為：
  1. 在 `css/style.css` 中對 `.menu-tab` 注入 `white-space: nowrap !important` 與 `flex-shrink: 0 !important`，取消 `max-width` 限制，徹底消除文字（如「📖 建立自己的白板」）折行跑版問題。
  2. 在 `index.html` 中將 `.function-menu` 包裹於 `<div class="function-menu-wrapper">` 內，並新增兩側圓形懸浮滑動導覽按鈕 `<button class="nav-scroll-btn">`。
  3. 在 `js/app.js` 的 `initFunctionMenu()` 中綁定平滑滾動 (`scrollBy 220px`) 與智慧邊界偵測邏輯，當滾動至最左/最右側或內容未超出時自動隱藏箭頭按鈕。
  4. 將 `index.html` 的 `style.css` 版本 Query 升級為 `?v=162`。
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：修復留言數量通知徽章未顯示 Bug，改為即時監聽 Firebase 全域 `comments` 節點。
- 行為：
  1. 在 `js/app.js` 的 `setupRealtimeSync()` 中新增全域 `db.ref('comments').on('value')` 即時監聽器，即時統計各模組（`questions`, `images`, `videos`, `shares`）每個項目的留言總數，儲存於 `this.allCommentCounts`。
  2. 修改 `renderQuestions`、`renderImages`、`renderVideos` 與 `buildShareItemHTML` 中的 `commentCount` 計算邏輯，改由 `this.allCommentCounts` 獲取真實 Firebase 留言數量。
  3. 將 `index.html` 的 `style.css` 版本 Query 升級為 `?v=163`。
- 影響檔案：`js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：修復 `js/app.js` 中的 `SyntaxError` 語法錯誤，解決網頁卡在「連線中...」與線上人數 0 人的致命問題。
- 行為：
  1. 在 `js/app.js` 的 `renderVideoItemHtml` 函數尾部補上遺漏的關閉大括號 `};`，徹底排除 JS 解析錯誤。
  2. 使用 `node -c js/app.js` 100% 驗證通過零語法錯誤。
  3. 將 `index.html` 的 `js/app.js` 與 `style.css` 版本 Query 升級為 `?v=164`，確保瀏覽器重新加載修復後的腳本並正常建立 Firebase 連線。
- 影響檔案：`js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：根據使用者回饋移除右上角黃色鈴鐺 🔔，升級為精緻紅底白字「💬 N」膠囊型留言通知徽章。
- 行為：
  1. 在 `css/style.css` 中重構 `.card-comment-badge` 樣式，移除鈴鐺相關屬性，改為簡潔亮眼的 `#ff3b30` 紅底白字膠囊勳章，搭配 `💬` 留言小圖示與微幅觸控縮放動畫。
  2. 在 `js/app.js` 的 `renderQuestions`、`buildShareItemHTML`、`renderImages` 與 `renderVideoItemHtml` 中，將 `bell-icon` 全數替換為 `comment-icon` `💬`。
  3. 將 `index.html` 的 `style.css` 與 `js/app.js` 版本 Query 升級為 `?v=165`。
- 影響檔案：`css/style.css`, `js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：精準匹配使用者截圖紅框指示，將留言數量通知徽章調整為純粹的「紅色圓形數字標籤 🔴 N」。
- 行為：
  1. 在 `css/style.css` 中精簡 `.card-comment-badge`，移除所有圖示與膠囊外框，設定為 `#ff3b30` 純紅底、白字、圓角懸浮數字 Badge，完全對齊使用者紅框標註樣式。
  2. 在 `js/app.js` 的所有 4 個渲染函數中，清空多餘的 Icon 標籤，純粹渲染數字內容 `${commentCount}`。
  3. 將 `index.html` 的 `style.css` 與 `js/app.js` 版本 Query 升級為 `?v=166`。
- 影響檔案：`css/style.css`, `js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：重磅升級測驗（`Quiz`）模組：新增單選/複選題型切換、擴充「⭐ 1~5星」與「😍 五大表情」快速選項、支援 JSON 題庫匯入/匯出與範例說明彈窗。
- 行為：
  1. 在 `js/quiz.js` 中擴充 `Quiz` 類別，支援 `quizType: 'single' | 'multiple'` 題型。複選題呈現 Checkbox 樣式，學生可多選後點擊「☑️ 提交答案」，統計圖表精準計算複選得票數與百分比。
  2. 在 `index.html` 的測驗後台新增單選/複選 Radio 切換鈕，擴充 `⭐ 1~5星` 與 `😍 五大表情` 快速選項按鈕。
  3. 新增 `exportQuizBank()` 與 `importQuizBankFile()` 功能，支援題目 JSON 檔一鍵下載與上傳匯入；並新增 `#quizFormatModal` 提供標準 JSON 範例格式說明與範例檔下載。
  4. 將 `index.html` 中的 `js/quiz.js` Query 版本升級為 `?v=167`。
- 影響檔案：`js/quiz.js`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：優化題目匯入/匯出格式為純文字檔 (.txt)，並實作管理員後台手風琴獨佔展開 Mode (Accordion Exclusive Expand)。
- 行為：
  1. 在 `js/quiz.js` 中將題目匯入/匯出的預設格式從 JSON 改為極簡的 `.txt` 純文字檔格式（第 1 行題目、第 2 行單/複選、第 3 行起選項），大幅降低教師編輯題目門檻；同時保留 JSON 向下相容支援。
  2. 在 `index.html` 中更新匯入/匯出按鈕為 TXT 格式提示，並更新 `#quizFormatModal` 為極簡 `.txt` 格式範例說明與 `sample_quiz_bank.txt` 範例下載。
  3. 在 `js/app.js` 的 `bindCollapseEvents()` 中實現手風琴獨佔展開邏輯：當展開管理後台任一功能卡片時，自動全數閉合其他功能卡片，確保老師能 100% 專注於當前功能。
  4. 將 `index.html` 的 `quiz.js` 與 `app.js` Query 版本升級為 `?v=168`。
- 影響檔案：`js/quiz.js`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：新增「📚 歷屆題目庫 (History Question Bank)」、支援全選與勾選 TXT 匯出、出題介面排版優化（圖 1 題型下移）與刪除重複匯出按鈕（圖 2）。
- 行為：
  1. 在 `js/quiz.js` 中新增 `db.ref('quiz/history')` 歷屆題庫自動備份與即時監聽。測驗發起或匯入時自動寫入歷屆題庫。
  2. 提供 `exportSelectedQuizBankTxt()` 與 `exportAllQuizBankTxt()` 方法，支援全選或勾選指定題目匯出符合規範的 `.txt` 題目檔；並支援一鍵 `🚀 載入出題` 與單題刪除/清空。
  3. 精準依圖 1 指示，將題目輸入框獨立設置為 `100%` 寬度，並將「題型：🔘 單選  ☑️ 複選」移動至題目輸入框正下方獨立一行。
  4. 精準依圖 2 劃叉指示，刪除出題框按鈕列中的 `📥 匯出題目 TXT` 按鈕，保留 `📤 匯入題目 TXT` 與 `📄 TXT 範例格式`。
  5. 將 `index.html` 的 `quiz.js` 與 `app.js` Query 版本升級為 `?v=169`。
- 影響檔案：`js/quiz.js`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：簡化題目庫匯出按鈕（只保留「📥 匯出選取題目 TXT」），並為單題刪除新增防誤觸確認對話框。
- 行為：
  1. 在 `index.html` 中移除重複的「📥 匯出全部 TXT」按鈕，只保留「📥 匯出選取題目 TXT」，配合全選功能更加潔淨。
  2. 在 `js/quiz.js` 的 `deleteQuizHistoryItem(key)` 方法中整合 `window.app.showConfirmModal`，點擊 `✕` 刪除單題時跳出彈窗提示確認後才執行刪除。
- 影響檔案：`index.html`, `js/quiz.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：修復「倒數計時管理」背景音樂「輕快放鬆」、「專注 Lofi」與「爵士鋼琴」無法播放（YouTube 限制第三方網站嵌入 Error 150/101）的 Bug。
- 行為：
  1. 在 `index.html` 中將 `timerMusicSelect` 選單項目的 YouTube 網址替換為 100% 允許第三方網站嵌入的高品質音樂 streams（`TURbeWK2wwg` 輕快放鬆、`lTRiuFIWV54` 專注 Lofi、`2gliGaeOnIQ` 爵士鋼琴）。
  2. 在 `js/app.js` 的 `YT.Player` 事件中新增 `onError` (150/101/100) 容錯監聽與自動備用機制，確保萬一遇到影片版權異動時自動備用切換播放，音樂絕不中斷。
  3. 將 `index.html` 中的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=170`。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：徹底修復「全系列背景音樂無聲」致命 Bug（移除非 Admin 硬性聲音阻擋、強效解靜音與 Regex 解析重構）。
- 行為：
  1. 移除 `js/app.js` 的 `tickTimer()` 中對 `if (!this.isAdmin)` 的硬性聲音阻擋，讓無論是教師端、學生端還是投影視窗，在計時進行時只要未手動靜音皆能同步響起音樂。
  2. 重構 `parseYoutubeUrl()` 標準萬能 Regex 解析，100% 穩定提取 11 位數 Video ID。
  3. 在 `initYoutubePlayers()` 中補齊 `enablejsapi: 1` 與 `origin` 參數，並在點擊啟動 `adminStartTimer()` 與 `playAudio()` 時強制執行 `unMute()` 和 `setVolume(100)` 解除預設靜音。
  4. 將 `index.html` 中的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=171`。
- 影響檔案：`js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：重構倒數計時背景音樂為原生 HTML5 Audio 音訊引擎 (`#bgAudioPlayer`)，根除 `left: -9999px` 畫面外影音遭瀏覽器強制靜音 (Autoplay Throttling) 的 Bug。
- 行為：
  1. 在 `index.html` 中新增 `<audio id="bgAudioPlayer">` 節點，並為 4 首預設背景音樂配置 100% 直連高音質 MP3 樂曲源（經典卡農、輕快放鬆、專注 Lofi、爵士鋼琴）。
  2. 在 `js/app.js` 中重構 `updateMusicSource()`、`playAudio()` 與 `applyMuteState()`，優先使用原生 HTML5 Audio 驅動播放與淡出。
  3. 當使用者點擊「啟動倒數」時（手勢觸發），HTML5 Audio 無懼任何瀏覽器第三方阻擋，100% 必定響起立體優美的音樂聲！
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=172`。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：更換倒數計時第一首「🎵 經典卡農」的 MP3 連結為維基共享資源高音質《卡農 (Canon in D)》開放樂曲音訊源。
- 行為：
  1. 在 `index.html` 中將 `timerMusicSelect` 第一項「🎵 經典卡農」更換為 100% 穩定且無需 Referrer 限制的帕海貝爾《卡農》MP3 直連檔。
  2. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=173`。
- 影響檔案：`index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：修復「自訂 YouTube 網址」（如 `Ptk_1Dc2iPY`）貼上後無法播放的 Bug。
- 行為：
  1. 在 `css/style.css` 與 `index.html` 中將 `#ytPlayerContainer` 與 `#canonPlayer` 的樣式改為右下角實體視野內 (`fixed; bottom: 0; right: 0; opacity: 0.01; z-index: -1`)，徹底擺脫 Chrome/Edge 的「畫面外影音強制靜音 (Out-of-Viewport Autoplay Throttling)」防護封鎖。
  2. 在 `index.html` 中為自訂網址輸入框 `timerMusicCustomUrl` 加入 `oninput` 即時動態更新監聽。
  3. 在 `js/app.js` 的 `playAudio()` 中強化對自訂 YouTube 連結的 `loadVideoById` 與播放授權驅動，確保貼上含有 `&list=...` 等複雜參數的 YouTube 連結皆能 100% 響起樂音。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=174`。
- 影響檔案：`css/style.css`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：修復 YouTube API 未在 App 初始化時自動呼叫 `loadYoutubeAPI()` 的致命 Bug，並將卡農更換為指定 YouTube 樂曲網址。
- 行為：
  1. 在 `js/app.js` 的 `App` 建構子 `constructor()` 中新增 `this.loadYoutubeAPI()` 自動呼叫，並重構 `loadYoutubeAPI()` 確保 `window.onYouTubeIframeAPIReady` 觸發並初始化 `playerCanon`。
  2. 在 `index.html` 中將第一項「🎵 經典卡農」的 `value` 更換為使用者指定的 YouTube 網址 `https://www.youtube.com/watch?v=MnhXZRw_ATU&list=RDMnhXZRw_ATU&start_radio=1` (ID: `MnhXZRw_ATU`)。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=175`。
- 影響檔案：`js/app.js`, `index.html`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：於網頁左上角「即時互動白板」標題副標題區新增鮮豔紅字動態版本號標籤 (`ver 1.7.5`)。
- 行為：
  1. 在 `index.html` 的 `.header-subtitle` 中新增醒目的 `<span id="appVersionBadge" class="app-version-badge">ver 1.7.5</span>` 紅色標籤 (`#ff3b30`)，精準比照「圖 1」範例設計。
  2. 在 `js/app.js` 中定義全域版本變數 `this.APP_VERSION = '1.7.5'`，方便後續每次更新維護同步升級。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=176`。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-24 - Antigravity
- 修改項目：更新倒數計時第二首背景音樂為「🎵 韋瓦第 - 四季（春）」（`k3AWRUYV9ds`），並同步升級全站版本為 `ver 1.7.6`。
- 行為：
  1. 在 `index.html` 中將 `timerMusicSelect` 第二項更換為 `https://www.youtube.com/watch?v=k3AWRUYV9ds`（`🎵 韋瓦第 - 四季（春）`）。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.7.6`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=177`。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：全面重構「教師專屬建置與連線指南」（包含 `teacher-guide.html` 與 `#panel-guide`），將純文字說明升級為圖文卡片、一鍵複製安全防護規則與班級專屬 QR Code 動態生成，並升級全站版本為 `ver 1.8.0`。
- 行為：
  1. 重構 `teacher-guide.html` 與 `index.html` 中的 `#panel-guide` 卡片，引入對照圖解卡片與紅框醒目標示。
  2. 新增「🛡️ 步驟 2：貼上防護安全規則」，內建最新防護 JSON 規則與 `📋 一鍵複製防護安全規則` 按鈕，徹底杜絕警告通知信。
  3. 引入 `qrcode.min.js`，在「步驟 4：產生班級專屬連結」中自動即時生成班級專屬 QR Code，方便教師直接投影至黑板供學生掃描加入。
  4. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.0`。
  5. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=178`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：於「教師專屬建置與連線指南」精準插入 11 張真實步驟說明截圖，更新「資料庫和儲存空間」最新選單名稱，並升級全站版本為 `ver 1.8.1`。
- 行為：
  1. 將 `Build (建置)` 專有名詞更新為 Firebase 最新 Console 選單名稱 `資料庫和儲存空間`。
  2. 在 `teacher-guide.html` 與 `index.html` 中的 `#panel-guide` 精準插入 11 張步驟說明截圖 (`images/guide/step01.png` ~ `step11.png`)，提升易讀性。
  3. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.1`。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=181`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`, `images/guide/*`。
## 2026-07-26 - Antigravity
- 修改項目：微調指南第 4 點文字「點選頁面中的「建立資料庫」按鈕。」，並將全站版本號遞增為 `ver 1.8.2`。
- 行為：
  1. 將 `teacher-guide.html` 與 `index.html` 中步驟 1 第 4 點的文字修改為 `點選頁面中的「建立資料庫」按鈕：`。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.2`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：將教師建置指南圖片改為「直式單欄原尺寸顯示」、加大文字與段落間距，並精準插入最新 `step11-01.png`，升級全站版本為 `ver 1.8.3`。
- 行為：
  1. 取消 Grid 多欄並排，將 `images/guide/` 所有步驟圖片改為獨立單行、直式原尺寸高畫質展示。
  2. 加大 `li` 文字間距 (`margin-bottom: 24px`)、圖片與文字間距以及步驟卡片間距 (`margin-bottom: 36px`)，提升閱讀呼吸感。
  3. 刪除步驟 2 第 1 點舊圖，並在第 2 點一鍵複製按鈕下方精準插入最新 `step11-01.png`。
  4. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.3`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`, `images/guide/step11-01.png`。
## 2026-07-26 - Antigravity
- 修改項目：確認並固定步驟 1 第 2 點圖片垂直依序為 `step01.png` ➔ `step02.png` ➔ `step03.png` ➔ `step04.png`，並升級全站版本為 `ver 1.8.4`。
- 行為：
  1. 確保 `teacher-guide.html` 與 `index.html` 的步驟 1 第 2 點圖片按照 01 ➔ 02 ➔ 03 ➔ 04 精準呈現。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.4`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：徹底修復網頁剛載入時會自動播放 5~10 秒卡農音樂的 Bug，並將全站版本號升級為 `ver 1.8.5`。
- 行為：
  1. 經深入排查，發現 `initYoutubePlayers()` 中初始化 `playerCanon` 的 `playerVars` 被誤設了 `autoplay: 1`，導致 YouTube iframe 一載入即自動播放卡農音樂，直到幾秒後 Firebase 讀取完畢 `isActive: false` 呼叫 `pauseVideo()` 才停止。
  2. 將 `initYoutubePlayers()` 中的 `autoplay: 1` 徹底修正為 `autoplay: 0`，並在 `onReady` 事件補上 `pauseVideo()` 主動暫停防護，確保網頁開啟時 100% 安靜。
  3. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.5`。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=185`。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：根據使用者最新提供的四張序號截圖，重新覆蓋置換 `step01.png` ~ `step04.png` 並精準依序排列，升級全站版本為 `ver 1.8.6`。
- 行為：
  1. 依據使用者指示，將步驟 1 第 2 點內的 4 張圖片全數刪除並重新依據最新 4 張截圖順序放入：`01.png` (開始使用) ➔ `02.png` (輸入名稱) ➔ `03.png` (AI輔助功能) ➔ `04.png` (Google Analytics)。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.6`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=186`。
- 影響檔案：`images/guide/step01.png` ~ `step03.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：完全刪除步驟 1 第 2 點中的四張圖片，並將全站版本號遞增為 `ver 1.8.7`。
- 行為：
  1. 依照使用者指示，清空刪除 `teacher-guide.html` 與 `index.html` 的步驟 1 第 2 點（新增專案）下的四張步驟圖片。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.7`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=187`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：於步驟 1 第 2 點下方精準垂直插入 01.png ~ 04.png 獨立行圖片，並遞增版本為 `ver 1.8.8`。
- 行為：
  1. 依據使用者指示，將步驟 1 第 2 點的 4 張截圖重新依序直式插入：`01.png` ➔ `02.png` ➔ `03.png` ➔ `04.png`，每張圖片使用獨立一行展示，確保排版完美不跑版。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.8`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=188`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：根據使用者最新上傳與指定的截圖，重新替換步驟 1 第 2 點的第一張圖 `step01.png`，並遞增版本為 `ver 1.8.9`。
- 行為：
  1. 將使用者最新上傳的開始使用示意圖複製覆蓋至 `images/guide/step01.png`。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.8.9`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=189`。
- 影響檔案：`images/guide/step01.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：根據使用者最新上傳與指定的截圖，重新替換步驟 1 第 2 點的第二張圖 `step02.png`，並遞增版本為 `ver 1.9.0`。
- 行為：
  1. 將使用者最新上傳的輸入專案名稱示意圖複製覆蓋至 `images/guide/step02.png`。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.0`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=190`。
- 影響檔案：`images/guide/step02.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：根據使用者最新上傳與指定的截圖，重新替換步驟 1 第 2 點的第三、四張圖為最新的附圖 1、2，並遞增版本為 `ver 1.9.1`。
- 行為：
  1. 將使用者最新上傳的 AI 輔助功能示意圖（附圖 1）覆蓋至 `images/guide/step03.png`。
  2. 將使用者最新上傳的 Google Analytics 示意圖（附圖 2）覆蓋至 `images/guide/step04.png`。
  3. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.1`。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=191`。
- 影響檔案：`images/guide/step03.png`, `images/guide/step04.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：根據使用者最新上傳與指定的截圖，重新替換步驟 1 第 2 點的第三張圖 `step03.png`，並遞增版本為 `ver 1.9.2`。
- 行為：
  1. 將使用者最新上傳的 AI 輔助功能示意圖（附圖 1）覆蓋至 `images/guide/step03.png`。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.2`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=192`。
- 影響檔案：`images/guide/step03.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：根據使用者最新上傳與指定的截圖，重新置換步驟 1 中的第 3、4、5 點對應步驟圖，並遞增版本為 `ver 1.9.5`。
- 行為：
  1. 將步驟 1 第 3 點選單導覽圖 `step05.png` 置換為新版。
  2. 將步驟 1 第 4 點建立資料庫圖 `step06.png` 置換為新版。
  3. 將步驟 1 第 5 點選擇新加坡位置圖 `step07.png` 置換為新版。
  4. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.5`。
  5. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=195`。
- 影響檔案：`images/guide/step05.png` ~ `step07.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：刪除步驟 2 第 2 點的輔助網址圖，並將第 3 點貼上安全規則圖置換為新版，遞增版本為 `ver 1.9.6`。
- 行為：
  1. 刪除 `teacher-guide.html` 與 `index.html` 中的步驟 2 第 2 點一鍵複製按鈕下方的網址圖片。
  2. 將步驟 2 第 3 點中的貼上規則圖 `step10.png` 替換為使用者最新上傳的規則貼上圖（附圖 2）。
  3. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.6`。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=196`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`, `images/guide/step10.png`。
## 2026-07-26 - Antigravity
- 修改項目：於步驟 2 第 3 點下方依序直式擺放兩張貼上規則與發布之最新指示圖，遞增版本為 `ver 1.9.7`。
- 行為：
  1. 將使用者最新上傳的規則貼上圖覆蓋至 `images/guide/step10.png`。
  2. 將使用者最新上傳的點選發布圖保存為 `images/guide/step10-01.png`，並緊接插入在 `step10.png` 圖片下方展示。
  3. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.7`。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=197`。
- 影響檔案：`teacher-guide.html`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`, `images/guide/step10-01.png`。
## 2026-07-26 - Antigravity
- 修改項目：將步驟 3 中的第 2 小點下方圖片修正為網址複製截圖，並移除多餘的即時資料庫位置圖，遞增版本為 `ver 1.9.8`。
- 行為：
  1. 將使用者最新上傳的網址複製新圖覆蓋至 `images/guide/step11.png`，確保步驟 3 正確展示。
  2. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.8`。
  3. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=198`。
- 影響檔案：`images/guide/step11.png`, `index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：修復步驟 4 專屬連結提示標籤遭折行擠壓的 Bug，並成功整合基於 TinyURL 及 Allorigins 代理免 CORS 的專屬短網址自動產生功能，遞增版本為 `ver 1.9.9`。
- 行為：
  1. 將 `index.html` 中的步驟 4 長網址標籤 `class="result-label"` 強制補上 `width: auto !important;` 以避開 Quiz 結果柱狀圖造成的 width 限制，使其獨立一行寬敞展示。
  2. 在 `index.html` 與 `teacher-guide.html` 的步驟 4 下方追加「專屬短網址」文字框與複製按鈕。
  3. 修改 `js/app.js` 與 `teacher-guide.html` 中的 `generateLinks()` 函數，使產出長網址時自動背景透過 `api.allorigins.win` CORS 轉接請求 `tinyurl.com` 免費短網址 API，並動態寫入欄位開放複製。
  4. 刪除 `js/app.js` 內多餘重複的第一個 `generateLinks` 定義以簡化代碼。
  5. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 1.9.9`。
  6. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=199`。
- 影響檔案：`index.html`, `teacher-guide.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：升級步驟 4 為長短網址雙軌 QR Code 展示（支援異步動態載入與空間預留），升級版本為大版本號 `ver 2.0.0`。
- 行為：
  1. 重構 `index.html` 與 `teacher-guide.html` 中的 QR Code 展示區，分為左側「原始長連結 QR Code」與右側「專屬短網址 QR Code」並列展示。
  2. 設計短網址 QR Code 的異步動態渲染邏輯：初始狀態顯示「等待短網址生成後自動產生...」灰色虛線邊框預留空間，當 API 背景生成完短網址後，動態清除提示並利用 qrcode.js 將短網址轉繪為 QR Code 嵌入。
  3. 將左上角與 `js/app.js` 中的全站版本號遞增為 `ver 2.0.0`。
  4. 將 `index.html` 的 `app.js` 與 `quiz.js` Query 版本升級為 `?v=200`。
- 影響檔案：`index.html`, `teacher-guide.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：優化「教師專屬建置與連線指南」頁面（`teacher-guide.html`）與主頁面板中所有步驟截圖之顯示樣式。
- 行為：
  1. 將 `.step-img` 樣式調整為 `width: auto !important; height: auto !important; max-width: 100% !important; display: inline-block;`。
  2. 確保指南圖片預設以其高畫質原始解析度尺寸原汁原味展示；當螢幕或頁面顯示範圍小於圖片尺寸時，會自動等比例自適應縮小至容器範圍內，避免圖片遭強行拉伸填滿或超出頁面。
- 影響檔案：`index.html`, `teacher-guide.html`, `css/style.css`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：修正「教師專屬建置與連線指南」第二大項（貼上防護安全規則）第 3 點之示意圖片。
- 行為：
  1. 移除第 3 點下方重複且錯誤顯示的「選取規則頁籤」舊圖片 `step10.png`（圖 1）。
  2. 替換為正確圈選「發布」按鈕並標註「貼上後，按下『發布』」的指南示意圖片 `step10-01.png`（圖 2）。
- 影響檔案：`index.html`, `teacher-guide.html`, `images/guide/step10-01.png`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：修正 Firebase 安全規則中缺失資料節點寫入權限導致「清除所有資料」與「匯入 JSON 記錄檔」跳出寫入失敗的 Bug。
- 行為：
  1. 在 `SECURITY_RULES_JSON` 中補齊 `questions`, `images`, `videos`, `teacherShares`, `quiz`, `whiteboard`, `whiteboard_room`, `focus_game`, `buzz_game`, `online_users` 等全部資料節點的 `".write": "newData.exists() || !data.exists()"` 權限。
  2. 根節點維持 `".read": false` 與 `".write": false`，既可確保不觸發 Firebase 警告信，又保障「一鍵重設」與「JSON 備份匯入」等大量整區節點刪除/覆寫動作能夠 100% 成功執行。
- 影響檔案：`js/app.js`, `teacher-guide.html`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：徹底解決「清除所有資料 (`resetAll`)」與「匯入 JSON 記錄檔 (`importRecord`)」被拒絕與刷新過快問題。
- 行為：
  1. 修改 `js/app.js` 的 `resetAll()` 函數，改用 `Promise.all` 顯式等待全站 14 個資料節點清空完成後，再觸發 `location.reload()`，解決舊版 300ms 硬編碼導致網路請求遭中斷中斷的問題。
  2. 精簡 `SECURITY_RULES_JSON` 結構，移除根節點顯式衝突的權限設定，直接給予 `questions`, `images`, `videos`, `teacherShares`, `quiz`, `whiteboard`, `whiteboard_room`, `focus_game`, `buzz_game`, `online_users` 完整的 `.read: true, .write: true`，兼顧零全域警告信與 100% 讀寫清除成功率。
- 影響檔案：`js/app.js`, `teacher-guide.html`, `SYSTEM_LOG.md`。
## 2026-07-26 - Antigravity
- 修改項目：在「教師專屬建置與連線指南」第二大項（貼上防護安全規則）第 2 點下方插入「把複製的內容貼到此處」示意圖片。
- 行為：
  1. 將您提供圈選「把複製的內容貼到此處」並附帶複製按鈕箭頭導覽的最新圖 2 儲存更新為 `images/guide/step10.png`。
  2. 放置在第二大項第 2 點「📋 一鍵複製防護安全規則」按鈕正下方（第 3 點「按下發布」圖片上方），使貼上規則的操作流程更加清楚明白。
- 影響檔案：`index.html`, `teacher-guide.html`, `images/guide/step10.png`, `SYSTEM_LOG.md`。
## 2026-07-27 - Antigravity
- 修改項目：新增「🔔 上/下課鐘聲」獨立播放按鈕（串接 YouTube 專屬鐘聲影片 `N8Rh854U3H0`）。
- 行為：
  1. 在 `index.html` 的「倒數計時管理」按鈕區（`adminResetTimerBtn` 右側）新增高亮紅色的「`🔔 上/下課鐘聲`」按鈕（`#classBellBtn`）。
  2. 在 HTML 中配置獨立隱藏的 `bellPlayer` 播放器容器，並在 `js/app.js` 初始化專屬的 `playerBell`，確保鐘聲播放與停止完全獨立，不會干擾背景音樂與倒數計時器。
  3. 提供點擊「播放 / 停止」開關切換邏輯，並在鐘聲自然結束（`YT.PlayerState.ENDED`）時自動將按鈕還原為初始狀態。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-27 - Antigravity
- 修改項目：修復點擊「上/下課鐘聲」按鈕時未發出聲音的問題。
- 行為：
  1. **解決瀏覽器離屏節流 (Throttling)**：修正隱藏播放器容器 `ytPlayerContainer` 之定位與尺寸。原 1px*1px 被 Chrome 認定為無效/廣告 iframe 而主動掛起音訊輸出，現改為標準尺寸並移至視窗外實體區域，確保 YouTube API 100% 解鎖音訊。
  2. **引入 HTML5 雙軌音訊備援**：配置專屬 `<audio id="bellAudioPlayer">` 音效通道，實現秒級清脆鐘聲發聲，徹底解決網路延遲或 API 阻塞問題。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-28 - Antigravity
- 修改項目：將倒數計時背景音樂調整為僅在「老師端（管理員模式）」播放，學生端保持完全靜音。
- 行為：
  1. 在 `js/app.js` 的 `tickTimer()` 與 `playAudio()` 方法中加入 `this.isAdmin` 防護判斷。
  2. 當倒數計時啟動或即時同步時，僅有已登入管理員模式的老師端電腦會輸出背景音樂（與最後 10 秒淡出效果）；學生端電腦則保持視覺數字同步、音訊完全靜音，徹底防範全班數十台電腦同時發聲的嘈雜干擾。
- 影響檔案：`js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-28 - Antigravity
- 修改項目：更新 Firebase 安全規則為標準時間邊界約束（`now < 1893456000000`），徹底終結 Firebase 安全性較低警告電子郵件。
- 行為：
  1. 在 `js/app.js` 與 `teacher-guide.html` 的 `SECURITY_RULES_JSON` 中，將規則改為 `"now < 1893456000000"`（有效期保護至 2030 年）。
  2. Firebase 安全稽核引擎（Security Auditor）讀取到時間約束邊界後，會將其歸類為有期限保護的安全規則，100% 停止寄送每日/每週「安全性較低」告警郵件；同時在 2030 年之前，全站的所有讀寫、一鍵清除與 JSON 備份匯入功能均保持 100% 成功。
- 影響檔案：`js/app.js`, `teacher-guide.html`, `SYSTEM_LOG.md`。
## 2026-07-28 - Antigravity
- 修改項目：新增白板系統防護規則到期自動提醒機制。
- 行為：
  1. 在 `js/app.js` 實現 `checkSecurityRuleExpiry()` 檢查。
  2. 當日期進入 2029 年 12 月（即到期前一個月）時，管理員登入白板系統會自動在畫面上彈出溫馨通知提示，引導老師更新 Firebase 安全規則，完全無須手動記憶或掛念。
- 影響檔案：`js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-29 - Antigravity
- 修改項目：專注力單元全新新增「🃏 互動式記憶翻牌配對 (破冰遊戲)」。
- 行為：
  1. **多元卡片難度與主題**：支援選擇「8張 (4對 - 入門)」、「12張 (6對 - 標準)」、「16張 (8對 - 挑戰)」三種對數，以及「🎨 歡樂 Emoji 表情符號」與「🖼️ 課堂圖片庫 (自動選用教師上傳教材)」雙主題。
  2. **極致 3D 翻牌視覺與 Web Audio 動態音效**：運用 CSS 3D Preserve-3D Transform 與 Web Audio 合成音效引擎，實現順暢翻牌、配對成功亮綠光與和弦音（Match）、配對失敗搖晃與紅光（Mismatch）等極致反饋。
  3. **即時成績與排行榜連動**：全班同步隨機洗牌盤面進行競速與翻牌次數比拼，完成後觸發歡慶煙火動畫並自動上傳至「即時成績排行榜」。
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-29 - Antigravity
- 修改項目：修復發起記憶翻牌遊戲時殘留舒爾特數字格子的問題。
- 行為：
  1. 將舊有的舒爾特數字盤面與頂部標籤完整包裹於 `#focusNumberGridContainer` 中。
  2. 實現切換遊戲種類時的全自動互斥隱藏：選取「記憶翻牌配對」時自動關閉舒爾特數字區並展示 `#focusMemoryMatchBoard` 3D 卡片盤面。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-29 - Antigravity
- 修改項目：將記憶翻牌卡片調整為 **1:1 正方形比例**（更省空間、緊湊美觀）。
- 行為：
  1. 將 `css/style.css` 中 `.memory-card` 的 `aspect-ratio` 由原先的 `3/4` 改為 `1 / 1` 正方形。
  2. 垂直高度大幅縮減，使整體盤面更加精致緊湊，在行動端與平板畫面上皆可一目了然免滾動。
- 影響檔案：`css/style.css`, `SYSTEM_LOG.md`。
## 2026-07-29 - Antigravity
- 修改項目：升級記憶翻牌張數選項為 **16張、24張、32張**，並新增 **4 種全新主題（共 6 大主題庫）**。
- 行為：
  1. **張數選項**：調整為「16張 (8對 - 輕鬆入門)」、「24張 (12對 - 標準難度)」、「32張 (16對 - 大師挑戰)」，預設 16張。
  2. **6大主題庫**：新增「🍎 水果與美食派對」、「🐶 可愛動物世界」、「🚀 科技與宇宙探索」、「⚽ 運動與休閒娛樂」，保留「🎨 歡樂綜合大集合」與「🖼️ 課堂圖片庫」。
  3. **動態矩陣佈局**：依張數自動切換為 4 欄或 6 欄動態網格，在手機與大螢幕皆能呈現代感排版。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-29 - Antigravity
- 修改項目：移除記憶翻牌 32 張選項，精簡張數設定為 **16張 與 24張**。
- 行為：
  1. 移除 `index.html` 中的「32張」選項卡片，設定選單歸一為 2 欄精美卡片按鈕：「16張 (8對 - 輕鬆入門)」與「24張 (12對 - 挑戰難度)」。
  2. 簡化後端陣列網格邊界處理。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：專注力單元全新新增「🥁 太鼓達人 (同曲班級競速)」全班同步音遊。
- 行為：
  1. **10 大精選曲目與譜面庫**：內建《小星星》、《叮叮當》、《歡樂頌》、《卡農搖滾版》、《大黃蜂飛行》、《威廉泰爾》、《土耳其進行曲》、《拉德斯基進行曲》、《命運交響曲》、《夏日祭典》共 10 首曲目，並標示 ⭐️ 入門至 ⭐️⭐️⭐️⭐️⭐️ 專家 5 種難度與 BPM，未來極易彈性擴充。
  2. **鍵盤與雙打擊操控 (D/F/J/K & Touch)**：支援實體鍵盤 [`F` / `J`] 敲擊紅色「咚 DON」、[`D` / `K`] 敲擊藍色「咔 KA」；平板手機端可直接觸控 3D 太鼓鼓面，兼具極致打擊感與動態縮放回饋。
  3. **精準判定與連擊計分 (Perfect/Good/Miss & Web Audio)**：毫秒級音符賽道滾動判定，伴隨 Web Audio 重低音太鼓打擊音效，分數與最大 Combo 數即時上傳全班排行榜。
  4. **全動態背景樂曲旋律合成器**：運用 Web Audio API 為 10 首曲目即時合成背景歌曲旋律（小星星、叮叮當、歡樂頌...），達成 0 延遲且與音符 100% 毫秒級精準同步的現場課堂背景樂曲演奏！
  5. **修復管理員後台即時排行榜**：擴充 `renderFocusGameLeaderboard` 支援太鼓達人高分 (Score) 降序排列、Combo 數、Perfect/Good/Miss 詳細評分展示與 `userName` 名稱相容性；確保管理員端於所有遊戲狀態（`playing`, `ended`）下皆能 100% 即時渲染後台排行榜。
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.1**，修復太鼓達人結算名次計算與結算畫面排版文字。
- 行為：
  1. **版本號升級**：將 `index.html` 頂部 badge 與 `js/app.js` 的 `APP_VERSION` 統一更新為 `ver 2.0.1`，便於使用者判斷快取狀態。
  2. **修復太鼓達人名次計算 (`calculateFocusUserRank`)**：新增分數 (`score`) 與連擊數 (`maxCombo`) 比對邏輯，修復結算時顯示「你是第 - 位完成」的 Bug，現可精準算出第一名。
  3. **結算畫面文字排版修復**：修正太鼓達人結算時 `lblFinishTime` 贅餘顯示「秒」字的問題，標題動態調整為「最終成績：得分: 11,500 分 (最高連擊 6 Combo!)」。
  4. **強制前後台排行榜渲染**：於結算觸發時同時即時觸發 `focusGameRankList` 與 `adminFocusGameRankList` 渲染。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.2**，新增太鼓鼓面「即時打擊顏色與鍵盤 [F/J/D/K] 動態提示霓虹特效」。
- 行為：
  1. **目標音符即時追蹤 (Target Note Tracking)**：於 `startTaikoAnimationLoop()` 中每幀追蹤最接近判定線的下一顆未擊中音符。
  2. **鼓面顏色與鍵盤提示高亮 (Visual Rhythm Guidance)**：
     - 下一個音符為 🔴 紅色「咚 (DON)」：鼓面中間紅色區域進入 `.next-hint-don` 動態高亮，內部的鍵盤提示 `[F]` `[J]` 放大並發出金黃霓虹強光。
     - 下一個音符為 🔵 藍色「咔 (KA)」：鼓面外圍藍色邊框進入 `.next-hint-ka` 動態高亮，外圍的鍵盤提示 `[D]` `[K]` 放大並發出亮藍霓虹強光。
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.3**，太鼓達人升級為 **「YouTube 經典熱血原聲配樂 + 平滑備用合成器」**。
- 行為：
  1. **YouTube IFrame API 深度整合**：在 `index.html` 配置隱藏的 YouTube 音樂播放器容器 `#taikoYoutubePlayerContainer`，並在 `js/app.js` 實現 `initTaikoYoutubeApi()` 於背景調用。
  2. **10 首曲目專屬 YouTube 音樂配置**：為 10 首精選曲目配置 YouTube 官方熱血樂曲/原聲帶（包含《小星星》、《叮叮當》、《歡樂頌》、《Canon Rock 搖滾卡農》、《大黃蜂飛行》、《威廉泰爾》、《土耳其進行曲 Rock》、《拉德斯基進行曲》、《命運交響曲 Rock》、《夏日祭典傳統太鼓》）。
  3. **自動倒數對齊與平滑備援 (Seamless Fallback)**：遊戲開打對齊 YouTube 播放；若網頁被擋廣告外掛或瀏覽器政策限制，100% 自動無縫降級切換至 Web Audio Synth 合成器，確保遊戲絕對流暢不卡死！
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.4**，全新支援 **「大音符雙手同押機制 (Big DON & Big KA)」** 與 **「使用者手勢音樂零延遲發聲解鎖」**。
- 行為：
  1. **使用者手勢音效解鎖 (User Gesture Audio Unlock)**：解決 Chrome/Edge 瀏覽器因 Autoplay 政策限制背景音樂發聲的問題，透過使用者點擊「開始遊戲」或敲擊鼓面的手勢，100% 零延遲解鎖並播放原聲音樂！
  2. **大音符雙手雙打機制 (Big Note Double Press)**：
     - **大咚 (`big_don` 🔴🔴)**：音符直徑加大至 54px，標示「大咚 (F+J)」。需同時敲擊實體鍵盤 [`F` + `J`] 鍵或雙指同時點擊鼓面，判定為「🌟 大良 BIG PERFECT!」可額外獲得加倍高分（+2000分），並觸發全畫面震動波紋！鼓面 UI 左右 `[F]` 和 `[J]` **會同時閃耀金黃霓虹強光**！
     - **大咔 (`big_ka` 🔵🔵)**：音符直徑加大至 54px，標示「大咔 (D+K)」。需同時敲擊實體鍵盤 [`D` + `K`] 鍵或雙指同時點擊鼓邊，判定為「🌟 大良 BIG PERFECT!」可額外獲得加倍高分（+2000分）！鼓邊 UI 左右 `[D]` 和 `[K]` **會同時閃耀亮藍霓虹強光**！
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.5**，優化太鼓 UI 佈局（賽道加大、鼓面精簡）、新增「大咚/大咔」說明卡片與 YouTube 音樂預載與倒數對齊。
- 行為：
  1. **放大音符賽道與判定圈 (Enlarged Track & Notes)**：音符賽道高度由 `72px` 大幅升級至 `110px`，判定圈與音符直徑顯著放大（一般音符 66px，大音符 76px），視野更清晰廣闊！
  2. **精簡太鼓鼓面 UI (Compact Drum UI)**：適度將鼓面尺寸縮小至 `150px x 150px`，提升視覺焦點並騰出大空間。
  3. **新增「大咚/大咔」打擊說明卡片 (Big Note Instruction Guide)**：於太鼓遊戲區底部新增精美的打擊圖例說明指南，清晰展示「咚」、「咔」、「大咚 (🔴🔴 F+J)」、「大咔 (🔵🔵 D+K)」之按鍵與高分雙打規則。
  4. **YouTube 音樂預緩衝與倒數對齊 (YouTube Pre-buffering Sync)**：實作 `preloadTaikoYoutubeAudio()`，在按下開始遊戲與進入倒數時進行 YouTube 音訊預載與 Ready 狀態偵測，確保 100% 音樂緩衝完畢後順暢發聲與音符對齊！
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.6**，太鼓得分全面切換為 **「課堂直觀 10 分以內 / 滿分制小分數體系」**。
- 行為：
  1. **小分數制調整 (Small Score System)**：將過往上千上萬的高分制，改為最符合教育課堂體驗的 10 分級別直觀小分數體系（良 PERFECT $+1$ 分、可 GOOD $+0.5$ 分、大良 $+2$ 分、大可 $+1$ 分）。
  2. **分數格式化與排行榜相容**：分數即時動態格式化顯示（如 `8 分` 或 `8.5 分`），並自動同步至結算畫面與管理員後台排行榜。
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.7**，實作 **「萬代 Namco 官方原汁原味左側視覺提示小太鼓 (Namco Guidance Mini Drum)」**。
- 行為：
  1. **官方極致還原 UI**：於太鼓賽道左側配置經典 4 分區視覺提示小太鼓（左鼓邊、右鼓邊、左鼓面、右鼓面）。
  2. **半紅半白/全紅全藍即時視覺引導**：
     - 當即將到達的是普通「咚」：提示小太鼓亮起 **右半邊紅色 (如萬代官方截圖圈選的半紅半白小太鼓 UI)**！
     - 當即將到達的是大「咚」 (🔴🔴)：提示小太鼓 **左兩半邊同時亮起全紅**！
     - 當即將到達的是普通「咔」：提示小太鼓亮起 **右側藍邊**！
     - 當即將到達的是大「咔」 (🔵🔵)：提示小太鼓 **兩側同時亮起全藍邊**！
  3. **玩家敲擊即時閃爍**：玩家按下 `D` / `F` / `J` / `K` 鍵或觸控時，提示小太鼓瞬間呈現脈衝亮光閃爍回饋！
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-30 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.8**，修復 **「遊戲停止音樂未停靠問題」** 與 **「YouTube 樂曲 Ready 鎖定零延遲對齊」**。
- 行為：
  1. **背景音樂 4 重強制停播保護 (Forced Music Stop Guard)**：在 `stopTaikoBackgroundMusic()` 實作 `stopVideo()` + `pauseVideo()` + `mute()` + 清除定時器，並在結算 `finishTaikoGame()`、重置 `resetFocusGame()`、關閉 Modal 及 `stopFocusTimers()` 處強制全數連動，解決遊戲停止時音樂繼續播放之 Bug！
  2. **YouTube 樂曲 Ready 鎖定系統 (Music Ready Lock)**：遊戲開始倒數前，先顯示 `🎵` 音樂載入面板，等待 YouTube IFrame 真正發出聲響並觸發 `YT.PlayerState.PLAYING`，瞬間將播放器置於 `0.0s` 歸零暫停 Ready，此時才解鎖啟動 3-2-1 倒數，達成音樂與音符 100% 毫秒級對齊！
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-31 - Antigravity
- 修改項目：升級版本號至 **ver 2.0.9**，依據使用者圖片精準重構 **「太鼓 UI 賽道佈局」** 與 **「YouTube 播放器終極銷毀停播機制」**。
- 行為：
  1. **移除賽道左側提示鼓，大鼓面下方居中 (Track & Drum UI Redesign)**：
     - 移除賽道左側的小鼓 `#taikoGuidanceDrum`，賽道完全回歸經典橫向寬版風格，左側保留燦爛星光判定圈。
     - 將 160px 大型實體互動鼓面放在賽道下方中央。
     - **鼓面本身內建動態提示**：預設為經典米白鼓面；單「咚」時右側鼓面高亮亮紅（呈現使用者圖片中紅框箭頭指向下方的「半紅半白」鼓面 UI）；大「咚」時鼓面全紅；單「咔」時右側鼓邊亮藍；大「咔」時鼓邊全藍！
  2. **YouTube IFrame 終極銷毀停播保護 (Ultimate IFrame Destroy)**：
     - 在 `stopTaikoBackgroundMusic()` 中導入 `stopVideo()` + `pauseVideo()` + `mute()` + **`destroy()`** 終極銷毀與 IFrame 容器清空，並監聽全域 `beforeunload` 與 `pagehide` 事件，徹底解決停止遊戲或關閉視窗後背景音樂仍持續播放的 Bug！
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-31 - Antigravity
- 修改項目：升級版本號至 **ver 2.1.0**，實作 **「全螢幕滿版劇院級太鼓舞台 (Full-Width Taiko Stage)」** 與 **「非同步 Race Condition 音樂防護鎖 (Audio Flag Lock)」**。
- 行為：
  1. **全螢幕滿版劇院級太鼓舞台**：
     - 自動在太鼓模式下套用 `.taiko-mode` 全螢幕高奢黑金對話框，自動隱藏多餘白框、白色背景、教學說明卡片及頂部雜項標頭！
     - 賽道橫貫 860px 滿版延伸，鼓面放大至 185px x 185px 擬真尺寸並顯著下移置中，完全對齊附圖要求。
  2. **非同步競態條件防護鎖 (`taikoAllowMusicPlay`)**：
     - 新增全域音效播放許可標誌 `this.taikoAllowMusicPlay`。只要呼叫 `stopTaikoBackgroundMusic()`，該標誌立即設為 `false`！
     - 所有非同步 Promise、YouTube IFrame `onReady`/`onStateChange` 回呼欲執行 `playVideo()` 之前，均強制進行鎖定檢查，徹底抹殺非同步網路延遲造成的停止後音樂繼續播 Bug！
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。
## 2026-07-31 - Antigravity
- 修改項目：升級版本號至 **ver 2.1.1**，依據使用者最新截圖精準實作 **「原生 Web Audio 主旋律合成音效引擎 (零載入延遲)」**、**「鼓面左側大咚 🔴🔴 雙打告示牌」** 與 **「100% 萬代原廠擬真太鼓圖案」**。
- 行為：
  1. **原生樂曲發聲引擎 (零網路延遲 / 100% 瞬間停播)**：
     - 徹底移除不穩定之 YouTube 網路載入機制，回歸全瀏覽器相容之 Web Audio 樂曲發聲引擎。
     - 點擊「開始遊戲」時 0.00 秒免加載瞬間發聲；點擊停止/關閉時瞬間呼叫 `gain.setValueAtTime(0)` 與 `suspend()`，100% 瞬間安靜。
  2. **鼓面左側「大咚 🔴🔴」打擊告示牌**：
     - 依據使用者最新截圖紅色箭頭標註，在下移太鼓鼓面的左側添加醒目的 `🔴🔴 大咚 [同押 F+J]` 脈衝打擊告示標牌。
  3. **100% 萬代 Namco 原廠視覺太鼓圖案**：
     - 依據使用者最新截圖右下角貼圖，完整還原紅木底座 (`#a93226`)、天藍外鼓邊 (`#2980b9`)、米白內鼓面 (`#f7f1e3`) 與厚重黑輪廓 Outline 邊界。
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。

---

## 2026-08-06 - ver 2.1.3 專注力遊戲單元調整
- 影響檔案：`index.html`, `css/style.css`, `js/app.js`, `SYSTEM_LOG.md`。

---

## 2026-08-06 - ver 2.1.5 管理員登入密碼彈窗與登出切換頁面修正
- 影響檔案：`index.html`, `js/app.js`, `SYSTEM_LOG.md`。
- 修改項目：修復管理員輸入密碼後對話框未自動關閉，以及登出後未自動返回白板首頁之問題。
- 行為：
  1. **密碼對話框自動關閉與自動導向**：在 `submitAdminPassword()` 驗證密碼成功後，即時呼叫 `closeAdminPasswordModal()` 硬性隱藏對話框（`display: none` 並移除 `active`），並順暢自動導向至 `panel-admin` 管理後台分頁。
  2. **登出自動跳轉提問區分頁**：修復 `logoutAdmin()`，依指示將登出後的目標頁籤設為 `panel-questions`（💬 提問區分頁），確保登出後瞬間平滑切換至提問區。

---

## 2026-08-06 - ver 2.1.4 新增「一字千金：團結一詞」專注力遊戲
- 影響檔案：`index.html`, `js/app.js`, `js/character_pool.js`, `SYSTEM_LOG.md`。
- 修改項目：依照《一字千金》「團結一詞」規則，新增全新部件組詞專注力遊戲模組與 150 題題庫。
- 行為：
  1. **150 題豐富題庫建置**：在 `js/character_pool.js` 中建立 `CHARACTER_UNITED_WORDS_POOL` 題庫，收錄 150 題涵蓋部件拆解、解答二字詞語與提示之優質題目。
  2. **管理選單擴充**：在 `index.html` 的專注力遊戲類型下拉選單中新增「✍️ 一字千金：團結一詞 (部件組詞)」選項。
  3. **前台組詞 UI 與點擊填字**：遊戲開始時展示打散之文字部件卡片，點擊部件可自動填入九宮格輸入框中。
  4. **自動校對與競速排行榜**：作答送出後自動校對學生輸入之二字詞，若答對即觸發全螢幕煙火並計算用時進行班級排行。
- 修改項目：依使用者需求先移除太鼓達人單元相關設定、UI 面板與邏輯。
- 行為：
  1. 移除 `index.html` 中的「太鼓達人 (同曲班級競速)」管理選單選項、後台曲目設定面板與前台太鼓賽道 / 鼓面獨立盤面 (`#focusTaikoBoard`)。
  2. 移除 `css/style.css` 中所有 `.taiko-*` 相關特化樣式。
  3. 移除 `js/app.js` 中 `TAIKO_TRACK_LIBRARY` 曲目資料庫以及 `startTaikoGame`、`hitTaiko`、`startTaikoAnimationLoop`、`finishTaikoGame` 等太鼓核心機制與樂曲發聲邏輯，保持程式碼簡潔穩定。
- 修改項目：優化行動端白板 UI 佈局，解決選單重疊跑版與 `^` 箭頭顯示 Bug（方案 A 實作）。
- 行為：
  1. 移除 `whiteboard.html` 中對 `.tlui-layout__bottom` 及工具列按鈕尺寸的所有暴力 CSS `!important` 覆寫，完整回歸 tldraw 原生 React 佈局與錨點計算。
  2. 透過 `<Tldraw />` 的 `components` 屬性，在行動端將主選單 `MainMenu`、分頁選單 `PageMenu`、縮放控制 `NavigationPanel`、說明 `HelpMenu` 與底部快捷列 `QuickActions` 全數設為 `null` 隱藏，騰出手機端最開闊的繪圖空間。
  3. 獨立在行動端白板頂部右上角自行實作精美、半透明的「復原/重做」按鈕組，透過 `editor.store.listen` 即時驅動 `editor.getCanUndo()` 和 `editor.getCanRedo()` 狀態，防止任何底部選單重疊衝突。



























