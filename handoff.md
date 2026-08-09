# tldraw 即時互動白板錯誤檢測交接報告

> 檢測角色：唯讀檢測人員
>
> 檢測日期：2026-08-08
>
> 檢測目標：釐清線上 tldraw 白板出現 `Something's gone wrong` 與 `Cannot read properties of undefined (reading 'typeName')` 的原因，提供後續 Antigravity 修正依據。
>
> 本次沒有修改任何程式碼，也沒有清除或寫入 Firebase 資料。

## 1. 檢測範圍與結果

- 線上入口：<https://harmonica80.github.io/interactive-whiteboard-2026/>
- 線上 iframe 實際載入：`whiteboard_v146.html?v=600`
- 線上 iframe 與工作區 `whiteboard_v146.html` 的 SHA-256 相同，表示目前診斷對應到實際上線的白板檔案。
- 線上白板固定載入：
  - `tldraw@2.4.5`
  - `react@18.3.1`
  - `react-dom@18.3.1`
  - `@tldraw/tlschema@2.4.5`
  - `@tldraw/store@2.4.5`
- 使用者提供的錯誤 stack 位於 `@tldraw/tlschema@2.4.5` 的 `Xt`，接著經由 `Qt -> store.validateRecord -> store.put` 觸發。
- 已透過唯讀 HTTP 檢查線上 HTML、CDN 模組與 Firebase 白板快照。
- 因瀏覽器互動連線在本次檢測環境初始化時中斷，沒有把「點擊哪一個工具」重新操作到完全相同的畫面；因此下文會把已證實項目與待重現項目分開，不把推測當成已重現事實。

## 2. 已確認的主要問題

### 2.1 線上版本仍使用已知會觸發 `Xt` 的 tldraw 2.4.5

線上 `whiteboard_v146.html` 第 122 行的 import map 使用：

```text
https://esm.sh/tldraw@2.4.5?external=react,react-dom&deps=react@18.3.1,react-dom@18.3.1
```

錯誤 stack 也明確指向 `@tldraw/tlschema@2.4.5`。

在實際取得的 tldraw 2.4.5 CDN 模組中，`Xt` 的實作等同於：

```js
function Xt(record) {
  record.typeName === 'asset' && ...
}
```

它沒有先判斷 `record` 是否為 `undefined` 或 `null`。同一版本的 `Qt` validation handler 會把驗證失敗的 `record` 傳給 `Xt`，因此只要原始驗證流程收到未定義 record，原本的驗證錯誤就會被第二個 `typeName` TypeError 蓋掉，最後顯示 tldraw 的全頁錯誤畫面。

### 2.2 `checkValidation: false` 目前是無效的修復方式

`whiteboard_v146.html` 第 150-153 行目前建立 store：

```js
createTLStore({
  shapeUtils: defaultShapeUtils || [],
  checkValidation: false
})
```

但 tldraw 2.4.5 實際的 `createTLStore` 實作只會把 `shapeUtils` 等資料建立成 schema，再呼叫 `new Store(...)`；它沒有讀取 `checkValidation` 這個參數。因此目前程式碼看起來像是「已關閉驗證」，實際上並沒有關閉，仍會走到 tldraw 2.4.5 的原生 `onValidationFailure: Qt`。

這是目前 `SYSTEM_LOG.md` 中「已透過 `checkValidation: false` 解決」與實際套件行為不一致的關鍵。後續不可再把這個參數當成已完成的防護。

### 2.3 原始的 validation failure 來源仍被錯誤畫面遮住

錯誤畫面顯示的是：

```text
TypeError: Cannot read properties of undefined (reading 'typeName')
```

這不是最初的 schema 驗證原因，而是 tldraw 2.4.5 的 validation failure handler 在處理錯誤資料時再次崩潰。必須先修正或攔截這個錯誤處理鏈，才能看到真正是哪一個 record、哪一個工具操作或哪一次快照載入產生了不合法資料。

## 3. 已檢查的資料同步路徑

### 3.1 Firebase 快照目前看起來是有效的

已唯讀檢查：

```text
https://opencode-whiteboard-default-rtdb.asia-southeast1.firebasedatabase.app/whiteboard_room.json
```

檢查當下的 `whiteboard_room.data` 可正常解析，包含 `document` 與 `session`；目前 document store 中的 record 都有 `typeName`：

- `document:document` → `typeName: document`
- `page:page` → `typeName: page`
- 兩筆文字 shape → `typeName: shape`, `type: text`
- 兩筆文字 shape 的 `props.font` 都是 `sans`

因此在檢測時間點，不能直接判定「Firebase 目前儲存的快照已經損壞」。但這不排除以下情況：

- 其他用戶在檢查前後寫入過不完整快照。
- 舊版本曾經寫入過不同 schema 的資料。
- 錯誤發生在某個工具的即時建立 record 流程，而不是載入目前這筆快照。
- 多人同時寫入時，某個短暫中間狀態被送入 iframe。

### 3.2 快照載入目前缺少防護

父頁 `js/app.js`：

- 第 5411-5427 行：收到 Firebase `whiteboard_room` 後直接 `JSON.parse(val.data)`，再以 `postMessage` 傳入 iframe。
- 第 5461-5472 行：白板 ready 後再次直接解析並傳入快照。
- 第 5421 行與第 5466 行都沒有檢查 snapshot 結構、schema 版本、record 是否為空值。

iframe `whiteboard_v146.html`：

- 第 549-554 行直接執行 `loadSnapshot(editorInstance.store, data.snapshot)`。
- 沒有在 `loadSnapshot` 前檢查 `document.store` 是否為物件，也沒有逐筆確認 record 的 `id`、`typeName`、`type`、必要欄位是否存在。

這條路徑會讓任何舊快照、部分寫入快照或其他版本產生的 record 直接進入 tldraw schema validator。

## 4. 需特別檢查的自訂圖片流程

`whiteboard_v146.html` 第 169-225 行與第 231-320 行自行處理圖片拖放與剪貼簿貼上，手動呼叫：

- `editor.createAssets(...)`
- `editor.createShapes(...)`

雖然目前傳入的 asset 有 `typeName: 'asset'`、`meta` 等欄位，shape 由 tldraw API 補足預設欄位的可能性也很高，但這是另一條自訂寫入 store 的路徑，應列為重現測試重點。尤其要檢查：

- `FileReader` 或 `Image.onload` 失敗時是否仍會執行後續寫入。
- 圖片尺寸是否為有限且大於 0 的數字。
- asset 建立成功但 shape 建立失敗時，是否留下孤立 asset。
- tldraw 原生 external content handler 與全域 `paste` handler 是否同時處理同一個事件。

這一項目前是「待重現的次要候選來源」，不是已證實的唯一根因。

## 5. 根因判定

### 高信心判定

1. 線上使用 tldraw 2.4.5，該版本的 `tlschema` validation error handler 對 `undefined` record 沒有防護。
2. 目前程式以 `checkValidation: false` 宣稱關閉驗證，但 tldraw 2.4.5 的 `createTLStore` 不會處理這個選項，因此防護實際未生效。
3. 某個 store 寫入或快照載入流程正在把不完整或未定義 record 送進 validation；tldraw 的 `Xt` 又把原始原因遮蔽成 `typeName` TypeError。

### 尚未能在本次檢測中唯一定位的部分

目前無法僅靠線上現存快照判定不完整 record 是由哪個動作產生。需要後續在瀏覽器中重新測試並保留第一個 validation failure 的 record 與操作步驟，優先分辨：

1. 進入白板並載入 Firebase 快照時發生。
2. 新增文字、畫筆、箭頭、矩形或便利貼時發生。
3. 貼上或拖放圖片時發生。
4. 多人同步收到別人的快照時發生。

## 6. 給 Antigravity 的修正順序

請依下列順序處理，不要只在錯誤畫面外包一層 catch：

### P0：先消除已知的 2.4.5 觸發鏈

1. 先將 tldraw 版本固定到已實際測試穩定的版本。`SYSTEM_LOG.md` 曾記錄切換到 `tldraw@2.1.4` 後可避開 2.4.5 的 `Xt` 問題；可先以 2.1.4 作為回退驗證版本，或選擇經完整回歸測試的新版本。
2. 同時鎖定 React 與 React DOM 的單一版本，避免 CDN 動態依賴再次載入另一份 React。
3. 不要再把 `checkValidation: false` 當作有效修復；若要保留此欄位，必須先由實際套件 API 證明它有作用。

### P1：保留原始 validation 原因並防止錯誤畫面

1. 對 schema validation failure 做真正的安全處理：先記錄 phase、record、recordBefore 與原始 error，再避免 tldraw 的 redaction handler 對 `undefined` 直接讀取 `typeName`。
2. 不要靜默吞掉所有 validation error；要能指出是哪個 record 不合法，否則資料問題會繼續被寫回 Firebase。
3. 對 `loadSnapshot` 加入失敗回復：無效快照應被拒絕並回到空白白板或最近一份有效快照，不應讓整個 ErrorBoundary 顯示全頁崩潰。

### P1：在 Firebase 邊界做快照驗證

在 `js/app.js` 的兩個遠端快照入口（約第 5421、5466 行）與 iframe 的 `loadSnapshot` 入口，至少驗證：

- `data` 是合法 JSON。
- snapshot 含有預期的 `document.store` 結構。
- 每個 record 是非 null 物件。
- 每個 record 有字串 `id` 與 `typeName`。
- `shape` 有字串 `type`、`parentId`、`index` 及必要的幾何欄位。
- `asset` 有正確的 `id`、`type`、`props` 與 `meta`。
- 快照不含 `undefined`、null record 或不認識的 record type。

驗證失敗時應拒絕載入並記錄原因，不要把原始壞資料重新寫回 `whiteboard_room`。

### P2：整理圖片貼上流程

1. 優先使用 tldraw 官方 external content API，避免同一個 clipboard event 同時由原生 handler 與自訂全域 handler 處理。
2. 若必須手動建立 asset/shape，改由 tldraw 的 record factory/API 補全欄位，不要依賴手寫的部分 record 恰好被自動補全。
3. 加入圖片尺寸、資料 URL、asset 建立與 shape 建立的逐步 log，便於確認是否是圖片流程引發 validation failure。

## 7. 修正完成後的驗證矩陣

Antigravity 修正後必須重新測試並記錄每一項結果：

1. 空白白板首次進入。
2. 建立文字、畫筆、箭頭、矩形、橢圓、便利貼。
3. Ctrl+V 貼上圖片。
4. 拖放圖片。
5. 重新整理頁面並從 Firebase 載入既有快照。
6. 兩個以上瀏覽器分別繪圖並同步。
7. 讀取含有舊資料的 `whiteboard_room`。
8. 模擬無效 JSON、缺少 `typeName`、null record 與未知 record type，確認頁面不再顯示全頁 `Something's gone wrong`。
9. 桌面版與行動版各測一次。

驗證標準：Console 不再出現 `Cannot read properties of undefined (reading 'typeName')`，且任何不合法快照都只能被拒絕、隔離或回復，不得造成 tldraw ErrorBoundary 全頁崩潰。

## 8. 結論

目前最可能的問題不是單純 Firebase 網路錯誤，而是「tldraw 2.4.5 的 validation handler 缺少 undefined 防護」加上「程式誤以為 `checkValidation:false` 已關閉驗證」的組合。當某個即時寫入或快照載入產生不完整 record 時，tldraw 原本應回報的 schema 錯誤被 `Xt` 二次崩潰遮蔽，才會看到圖中的通用錯誤畫面。

第一優先應回退或更換已驗證穩定的 tldraw 版本，並同時對 Firebase 快照與自訂圖片寫入加上結構驗證；完成後再用上述矩陣找出實際產生不完整 record 的操作來源。

---

# 2026-08-08 15:01:52 (UTC+08:00)｜線上版本 v1.6.0／iframe v900／tldraw 2.1.4

## 本次檢測結果

### 檢測對象

- 線上入口：https://harmonica80.github.io/interactive-whiteboard-2026/
- 主頁最後部署時間：2026-08-08 06:44:07 GMT（台北時間 14:44:07）
- 主頁 iframe：`whiteboard_v146.html?v=900`
- 白板 UI 版本：`v1.6.0`
- tldraw：`2.1.4`
- React／React DOM：`18.3.1`

### 使用者現象

- 開啟 tldraw 白板後持續顯示「正在載入 tldraw 互動白板...」。
- 白板沒有正常 mount，無法使用繪圖工具。

### 已確認的直接原因

目前線上 `whiteboard_v146.html` 的 `App()` 仍保留：

```js
if (store) {
  tldrawProps.store = store;
}
```

但整份線上 `whiteboard_v146.html` 沒有任何 `const store`、`let store` 或 `var store` 宣告。因此 React 執行 `App()` 時會在該行拋出：

```text
ReferenceError: store is not defined
```

`root.render(React.createElement(App))` 因此中斷，`handleMount()` 不會執行，`window.editorInstanceRef` 也不會被設定，tldraw 便永遠停留在初始 loading 畫面。

這是本次「一直載入」的直接且高信心根因。它不同於上一版 tldraw 2.4.5 的 validation 問題；本次在 Firebase 快照載入前，App 就已在 render 階段停止。

### 已確認已部署的修正

- tldraw 已由 `2.4.5` 切換至 `2.1.4`。
- iframe cache version 已由 `v600` 更新至 `v900`。
- 已加入 `sanitizeSnapshot()`，在 `loadSnapshot()` 前過濾缺少 `id` 或 `typeName` 的 record。
- 已加入安全版 `onValidationFailure` 記錄器。

上述方向正確，但移除 `createTLStore` 後遺留了 `store` 使用點，導致這些防護根本尚未有機會執行。

## 本次建議

### P0：移除或正確宣告 `store`

目前較安全的最小修正：

1. 在 `whiteboard_v146.html` 刪除 `if (store) { ... }` 整段。
2. 在 `whiteboard.html` 搜尋並同步刪除相同殘留引用。
3. 不要在未建立 store 的情況下傳入 `tldrawProps.store`。

若確實需要自訂 store，則必須在 `App()` 內使用 tldraw 2.1.4 相容 API 明確建立它；不可只保留條件判斷。

### P1：部署後初始化驗證

修正並部署後確認：

1. iframe 不再停留 loading。
2. Console 出現 `tldraw initialized successfully!`。
3. Console 不出現 `ReferenceError: store is not defined`。
4. tldraw 工具列、畫布與 undo／redo 控制器正常出現。
5. 有 Firebase 快照與沒有 Firebase 快照時都能進入白板。
6. 新增文字、畫筆、圖片後不會重新卡住。

### P2：保留兩份檔案一致

`index.html` 目前實際載入 `whiteboard_v146.html`，但 `whiteboard.html` 仍是可能的替代入口。兩份檔案都應搜尋確認：

- 沒有未宣告的 `store` 引用。
- tldraw 版本與 React 版本一致。
- 兩份檔案都保留相同的 snapshot sanitizer 與安全錯誤處理。

## 本次結論

本次 tldraw 2.1.4 已避開上一版 2.4.5 的 validation handler 問題，但清理自訂 store 時漏刪 `if (store)`。這個未宣告變數使 React App 在 render 階段停止，正是目前白板一直載入的原因。

修正優先級：

1. 移除或正確宣告 `store`。
2. 同步修正 `whiteboard.html` 與 `whiteboard_v146.html`。
3. 重新部署並確認 `tldraw initialized successfully!`。
4. 再進行快照、多人同步與圖片貼上回歸測試。

---

# 2026-08-08 15:24:21 (UTC+08:00)｜線上主頁 v2.4.3／iframe v999／tldraw 2.1.4

## 本次檢測結果

### 實際瀏覽器重現

本次使用實際 Chromium 載入線上頁面並等待 12 秒，結果如下：

- 主頁 HTTP status：`200`
- iframe readyState：`complete`
- iframe 最終畫面：8 秒初始化救援畫面「白板正在完成初始化...」
- `window.editorInstanceRef`：`false`
- tldraw 沒有完成 mount
- Firebase 或頁面 HTML 載入本身不是主要阻塞點

瀏覽器取得的第一個白板 page error 是：

```text
SyntaxError: The requested module 'tldraw' does not provide an export named 'getSnapshot'
```

這正是目前截圖所顯示救援畫面的直接原因。

### 已確認的線上程式

目前線上 `whiteboard_v146.html` 仍有：

```js
import { Tldraw, getSnapshot, loadSnapshot } from 'tldraw';
```

同一份檔案目前使用：

- tldraw `2.1.4`
- React `18.3.1`
- iframe cache version `v999`
- 主頁版本標記 `v2.4.3`

已檢查 tldraw `2.1.4` CDN bundle：tldraw 根模組沒有 `getSnapshot` named export，也沒有可供目前這種方式使用的 `loadSnapshot` named export。這使 ES module 在執行白板程式前就直接失敗，`root.render(...)` 不會執行。

## 根因判定

### P0：tldraw 版本與快照 API 使用方式不相容

Antigravity 將版本從 `2.4.5` 改成 `2.1.4`，但保留了原本 2.4.5 版本的 named import：

```js
getSnapshot
loadSnapshot
```

在 tldraw `2.1.4` 中，快照操作是 store instance method，而不是目前程式引用的 tldraw named export。2.1.4 的 store API 包含：

```js
editor.store.getSnapshot()
editor.store.loadSnapshot(snapshot)
```

因此目前錯誤發生在 module linkage 階段，早於 React render、`handleMount()`、Firebase 快照載入與 sanitizer。

### 與上一個問題的關係

上一個未宣告的 `store` 殘留已經從目前線上版本移除；目前卡住的原因已經變成新的 API 相容性問題。8 秒救援畫面本身運作正常，它只是把 module import 失敗後的 loading 畫面替換成提示畫面。

## 本次建議

### P0：修正 import 與快照呼叫方式

建議在 tldraw `2.1.4` 下：

1. 移除 `getSnapshot` 與 `loadSnapshot` 的 named import。
2. `getTldrawSnapshot` 改用 `editorInstance.store.getSnapshot(...)`。
3. `LOAD_TLDRAW_SNAPSHOT` 改用 `editorInstance.store.loadSnapshot(...)`。
4. 確認傳入 store method 的資料格式是 2.1.4 需要的 `{ store, schema }`，不可直接把舊版的完整 `{ document, session }` 外層物件傳入。

### P0：同步修正 snapshot 格式契約

目前既有 Firebase 快照是舊流程使用的外層格式，概念上類似：

```js
{
  document: { store: {...}, schema: {...} },
  session: { store: {...}, schema: {...} }
}
```

而 tldraw 2.1.4 的 `editor.store.getSnapshot()` 回傳的是 store-level snapshot，概念上是：

```js
{
  store: {...},
  schema: {...}
}
```

所以不能只把 import 改掉就結束。應明確選擇並統一一種格式：

- 建議 Firebase 的白板同步只保存 document snapshot；
- 寫入時使用 `editor.store.getSnapshot('document')` 或確認預設 scope 的結果；
- 載入時先取出正確的 document snapshot，再呼叫 `editor.store.loadSnapshot(documentSnapshot)`；
- `sanitizeSnapshot()` 也要同時支援或明確拒絕舊格式，避免把合法的 2.1.4 `{ store, schema }` 誤判為無效。

### P1：重新驗證 module 初始化

修正部署後必須用瀏覽器確認：

1. Console 不再出現 `does not provide an export named 'getSnapshot'`。
2. Console 不再出現 `does not provide an export named 'loadSnapshot'`。
3. Console 出現 `tldraw initialized successfully!`。
4. `window.editorInstanceRef` 變成 truthy。
5. 8 秒救援畫面不再出現。
6. 白板工具列與畫布正常顯示。

### P1：避免只靠 cache version 判斷修正成功

目前 `v999` 已確實載入最新 HTML，但 cache version 只會更新 URL，不會修正錯誤的 ES module import。每次部署後都要查看 Console 的第一個 `pageerror`，不能只確認 iframe URL 已變成新版本。

## 本次結論

目前畫面仍停在初始化救援畫面的真正原因是：線上已切換至 tldraw `2.1.4`，但白板程式仍使用 tldraw `2.4.5` 時期的 `getSnapshot`／`loadSnapshot` named import。由於 module import 在執行前失敗，React 與 tldraw 完全沒有開始初始化。

本次修正優先級：

1. 移除不存在的 named exports。
2. 改用 `editor.store.getSnapshot()` 與 `editor.store.loadSnapshot()`。
3. 統一 Firebase snapshot 格式與 sanitizer 的輸入格式。
4. 重新用瀏覽器確認 Console、`editorInstanceRef`、工具列與白板畫面。

---

# 檢測紀錄：2026-08-08 16:01:02（UTC+08:00）｜線上版本 2.5.0

## 檢測範圍

- 線上主頁：`https://harmonica80.github.io/interactive-whiteboard-2026/`
- 主頁版本標示：`ver 2.5.0`
- 白板 iframe：`whiteboard_v146.html?v=1000`
- iframe 內 tldraw 版本：`2.1.4`
- 檢測方式：唯讀開啟白板、檢查初始化狀態、Console 錯誤、快照結構與工具按鈕 DOM。
- 本次未繪圖、未建立圖形、未點擊會改變白板內容的工具，避免觸發 Firebase 寫入或污染共享白板資料。因此「任一工具」的實際操作錯誤未以寫入型操作再次觸發；以下已確認的快照錯誤是工具錯誤的高可信前置原因。

## 檢測結果

### 1. 白板初始化：通過

- `tldraw initialized successfully!` 已出現。
- `window.editorInstanceRef` 為有效物件。
- iframe 顯示 `Page 1`、`100%`、`v1.6.0`。
- tldraw 工具按鈕已渲染，包含選取、手掌、畫筆、橡皮擦、箭頭、文字、便條、圖片、矩形等工具。
- v2.5.0 的 `tldraw` 匯入已改為 `import { Tldraw } from 'tldraw'`，先前 v2.4.3 的 `getSnapshot/loadSnapshot` named export 問題已排除。

### 2. 遠端快照載入：失敗，可重現

Console 實際錯誤：

```text
Failed to load tldraw snapshot safely:
TypeError: Cannot read properties of undefined (reading 'schemaVersion')
```

錯誤發生於：

```text
@tldraw/store@2.1.4 -> migrateStoreSnapshot -> loadSnapshot
whiteboard_v146.html?v=1000:614
```

此錯誤不是頁面無法啟動；它是在 tldraw 已建立完成後，主頁把 Firebase 的既有白板快照送入 iframe 時發生。

### 3. 根因判定：快照外層格式仍不符合 tldraw 2.1.4 Store API

目前線上程式碼的 `sanitizeSnapshot()` 有兩個分支：

- 原生格式：`{ store: {...}, schema: {...} }`
- 舊雙層格式：`{ document: { store: {...} }, session: {...} }`

但舊雙層分支最後回傳的是：

```js
{
  ...snapshot,
  document: {
    ...snapshot.document,
    store: cleanStore
  }
}
```

接著 `LOAD_TLDRAW_SNAPSHOT` 無論收到哪一種格式，都直接執行：

```js
editorInstance.store.loadSnapshot(cleanSnapshot)
```

tldraw `2.1.4` 的 `editor.store.loadSnapshot()` 需要的是 Store-level 快照，亦即最外層必須有：

```js
{
  store: {...},
  schema: {...}
}
```

當它收到仍帶有 `document` 的舊包裝時，最外層沒有 `schema`，所以在讀取 `schema.schemaVersion` 時拋出 `undefined` 錯誤。這也解釋了為何白板能開啟，但任何後續工具操作容易被使用者感覺成「工具一用就錯」：初始遠端狀態其實尚未成功載入，且同步流程已進入錯誤狀態。

## 修正建議給 Antigravity

1. 在呼叫 `editor.store.loadSnapshot()` 前，統一轉換成 tldraw `2.1.4` 的 Store-level 格式；舊格式應傳入 `snapshot.document`（前提是其中真的包含 `store` 與 `schema`），不可把含有 `document/session` 的外層物件直接傳給 `store.loadSnapshot()`。
2. `sanitizeSnapshot()` 必須同時驗證 `snapshot.store` 與 `snapshot.schema` 存在，並確認 `snapshot.schema.schemaVersion` 可讀；不符合時應回傳 `null`，讓程式跳過載入並保留乾淨白板，而不是把錯誤格式送進 tldraw。
3. 檢查主頁/Firebase 寫入端：應保存 `editor.store.getSnapshot()` 回傳的 `{ store, schema }`，不要再包成 `{ document, session }` 後直接回傳給 iframe。
4. 對 Firebase 既有舊資料建立一次性格式轉換：將舊資料的有效 `document` 快照轉為 Store-level 快照；若舊資料沒有完整 `schema`，應先跳過該筆資料並建立乾淨快照，不要直接呼叫 `loadSnapshot()`。
5. 修正後的驗收條件：重新整理後 Console 不得再出現 `schemaVersion` 錯誤；切換選取、畫筆、文字、矩形、箭頭、便條、橡皮擦等工具時，不能出現 tldraw validation/store error；建立一個測試圖形後重新整理，圖形可正常保存與載入。

## 結論

本次檢測判定：**v2.5.0 的啟動問題已改善，但快照格式相容性問題尚未修正完成。** 目前最優先修正項目是 `sanitizeSnapshot()` 與 Firebase 快照資料的格式統一；在此問題排除前，不建議再針對各個工具個別加防護，因為工具錯誤很可能是同一個遠端快照/Store 狀態錯誤的連鎖結果。

---

# 檢測紀錄：2026-08-08 16:22:04（UTC+08:00）｜線上版本 2.5.1

## 檢測範圍

- 線上主頁：`https://harmonica80.github.io/interactive-whiteboard-2026/`
- 主頁版本標示：`ver 2.5.1`
- 白板 iframe：`whiteboard_v146.html?v=1100`
- iframe 內 tldraw 版本：`2.1.4`
- 檢測方式：讀取線上原始碼、檢查 Console、切換工具狀態，並在不連接主頁/Firebase 的獨立白板頁面做暫時記憶體內操作。
- 所有建立圖形的操作均在獨立頁面內完成，未寫入線上白板或 Firebase；程式碼與遠端資料均未修改。

## 檢測結果

### 1. 載入與工具選擇：通過

- 主頁 v2.5.1 已正常載入。
- iframe v1100 已正常初始化，`window.editorInstanceRef` 有效。
- 選取、手掌、畫筆、橡皮擦、箭頭、文字、便條、矩形等工具按鈕均可被選取。
- 因此目前不是工具列無法顯示或工具按鈕完全失效。

### 2. 非文字工具建立圖形：失敗，可在獨立頁面重現

在不連接 Firebase 的獨立 `whiteboard_v146.html?v=1100` 中，逐一測試建立內容：

| 工具 | 結果 | Console / Page Error |
|---|---|---|
| 畫筆 | 建立失敗，shape 數量為 0 | `Cannot read properties of undefined (reading 'typeName')` |
| 矩形 | 建立失敗，shape 數量為 0 | 同上 |
| 箭頭 | 建立失敗，shape 數量為 0 | 同上 |
| 便條 | 建立失敗，shape 數量為 0 | 同上 |
| 文字 | 可以建立文字 shape | 之後同步流程另發生 `ReferenceError: getSnapshot is not defined` |

非文字工具的錯誤堆疊仍在 tldraw `2.1.4`：

```text
TypeError: Cannot read properties of undefined (reading 'typeName')
at @tldraw/tlschema@2.1.4
at @tldraw/store@2.1.4 validateRecord
at @tldraw/editor@2.1.4
```

### 3. 主要根因：beforeCreateHandler 對非目標 shape 隱式回傳 undefined

目前 v2.5.1 線上程式碼在 `handleMount()` 中註冊：

```js
editor.sideEffects.registerBeforeCreateHandler('shape', (shape) => {
  if (shape.type === 'text' && shape.props && shape.props.font === 'draw') {
    return {
      ...shape,
      props: {
        ...shape.props,
        font: 'sans'
      }
    };
  }
});
```

這個 handler 只有在文字且字型為 `draw` 時回傳 shape；畫筆、矩形、箭頭、便條等其他 shape 路徑沒有 `return shape`，因此會把 `undefined` 傳回 tldraw Store。接著 Store 進行 validation 時讀取 `typeName`，便產生目前的錯誤。

這也精確解釋了「文字可以用、其餘工具都錯」：文字分支會回傳一個有效的修改後 shape，其他 shape 分支則沒有回傳有效 record。

目前 asset handler 也有相同風險：

```js
editor.sideEffects.registerBeforeCreateHandler('asset', (asset) => {
  if (asset && !asset.typeName) {
    return {
      ...asset,
      typeName: 'asset'
    };
  }
});
```

當 asset 已有 `typeName` 時同樣沒有回傳原始 asset，圖片/檔案工具可能因此遇到相同問題。

tldraw 官方 `StoreBeforeCreateHandler` 契約要求 handler 回傳要建立的 record；未修改時應回傳原始 record。參考：`https://tldraw.dev/reference/store/StoreBeforeCreateHandler`

### 4. 次要根因：文字建立後同步仍引用不存在的 getSnapshot

目前 v2.5.1 只匯入：

```js
import { Tldraw } from 'tldraw';
```

但在 document listener 中仍執行：

```js
const snapshot = getSnapshot(editor.store);
```

`getSnapshot` 沒有宣告，也沒有從 tldraw 匯入。實際測試文字建立後 Console 出現：

```text
Failed to capture local tldraw change:
ReferenceError: getSnapshot is not defined
```

因此文字雖然能建立在本地畫面，仍無法正常保存/同步至 Firebase。

### 5. 快照載入問題仍未完全排除

在主頁連接 Firebase 的版本中，初始遠端快照目前仍出現：

```text
Error migrating store Incompatible schema?
Failed to load tldraw snapshot safely:
Error: Failed to migrate snapshot: migration-error
```

錯誤發生於：

```text
whiteboard_v146.html?v=1100:611
editorInstance.store.loadSnapshot(cleanSnapshot)
```

v2.5.1 雖已將舊快照轉成 `{ store, schema }` 外層格式，但仍優先採用遠端 `rawSchema`：

```js
schema: rawSchema || fallbackSchema
```

若 Firebase 中的舊 schema 與目前 tldraw 2.1.4 不相容，仍會進入 migration-error。這是獨立於工具建立錯誤的另一個問題。

## 修正建議給 Antigravity

### P0：先修正所有 beforeCreateHandler 的回傳值

- `shape` handler 的非文字分支必須回傳原始 `shape`。
- `asset` handler 的已具備 `typeName` 分支必須回傳原始 `asset`。
- 不要讓任何正常建立流程隱式回傳 `undefined`。
- 修正後驗收：在乾淨頁面分別建立畫筆、矩形、箭頭、便條、文字、圖片；Console 不得再出現 `typeName` 錯誤，且每個操作都應產生 shape/asset。

### P0：修正同步端的 getSnapshot 呼叫

- 使用 tldraw 2.1.4 實際存在的 Store API：`editor.store.getSnapshot()`。
- 確認所有 `TLDRAW_LOCAL_CHANGE`、匯出與保存流程都使用同一種 `{ store, schema }` 格式。
- 文字建立後重新整理，文字必須仍然存在，且不得出現 `getSnapshot is not defined`。

### P1：再處理 Firebase 舊快照 migration

- 不要無條件採用不相容的遠端 `rawSchema`。
- 驗證 `schema.schemaVersion`、`storeVersion` 與 `recordVersions` 是否為 tldraw 2.1.4 可接受格式。
- 對不相容資料採取明確策略：轉換成 2.1.4 格式，或安全跳過該筆資料並載入乾淨白板。
- 驗收時確認重新整理、另一個瀏覽器開啟、建立圖形後重新整理，均不再出現 `migration-error`。

## 結論

本次判定：**v2.5.1 的「只有文字可用」問題已找到直接根因：shape/asset 的 before-create handler 在未修改的分支回傳 undefined，導致 tldraw validation 讀取 undefined.typeName。**

此外，文字同步仍有 `getSnapshot is not defined`，Firebase 舊快照仍有 `migration-error`；三項都修正後，才算完成白板功能修復。

---

# Terra 檢測紀錄：2026-08-08 16:41:44（UTC+08:00）｜使用者稱 2.5.2；實際線上版本 2.6.0

## 檢測範圍與版本核對

- 本次依使用者要求，已使用 `gpt-5.6-terra` 進行唯讀程式碼檢視；另以隔離瀏覽器驗證載入結果。
- 使用者回報為 2.5.2，但檢測當下線上主頁實際顯示 `ver 2.6.0`。
- 白板 iframe 實際 URL：`whiteboard_v146.html?v=2000`。
- iframe 仍使用 tldraw `2.1.4`。

## 檢測結果：白板無法初始化，與截圖一致

隔離頁面直接載入 `whiteboard_v146.html?v=2000` 後，8 秒內沒有建立 `window.editorInstanceRef`，工具按鈕也沒有渲染；畫面轉為「白板正在完成初始化…」的重新載入提示。

Console/Page Error 實際為：

```text
SyntaxError: Unexpected token 'catch'
```

這是 JavaScript 模組的語法錯誤，因此 tldraw 尚未 import / render，畫面中的 `Something's gone wrong` 不是某一個工具的個別錯誤，而是白板初始化程式完全未執行。

## 直接根因：同步 listener 的舊程式碼重複殘留

線上 `whiteboard_v146.html?v=2000` 的 document listener 在第 465–488 行已有一段完整且新版的 `editor.store.listen(...)`。但其後第 489–499 行又殘留一段不完整的舊程式碼：

```js
}, { scope: 'document' });
          window.parent.postMessage({
            type: 'TLDRAW_LOCAL_CHANGE',
            snapshot: snapshot
          }, '*');
        }
      } catch (err) {
```

此區塊在沒有對應 `try` 的情況下出現 `catch`，所以 ES module parser 在 HTML 第 494 行（module 第 351 行）停止，拋出 `Unexpected token 'catch'`。

## 與 2.5.1 問題的關係

Terra 的靜態檢視確認，v2.5.1 的三項已知問題在目前線上 2.6.0 原始碼中已經修正：

1. `beforeCreateHandler` 的非文字 shape 現在有 `return shape`；asset 也有 `return asset`。
2. 本地同步已改為 `editor.store.getSnapshot()`，沒有未宣告的裸 `getSnapshot`。
3. `sanitizeSnapshot()` 已有新／舊快照格式與 schema fallback。

但上述修正被後續誤貼的重複 listener 程式碼造成的語法錯誤完全阻斷，故目前無法驗證工具與 Firebase 同步的實際行為。

## 修正建議給 Antigravity

### P0：移除重複且不完整的 listener 尾段

1. 保留第 465–488 行的新版 `editor.store.listen(...)`。
2. 刪除緊接在其後的殘留區塊（目前線上 HTML 第 489–499 行），直到「通知父視窗已準備就緒」註解前為止。
3. 不要留下孤立的 `catch`、`}, 300)`、或第二個 `}, { scope: 'document' })`。

### P0：部署前先做語法驗證

對 iframe 的 `<script type="module">` 執行 ES module syntax check；只要出現 `Unexpected token`，不得部署。這一關能立即攔截本次錯誤。

### P1：修正後驗收

1. 直接開啟 `whiteboard_v146.html` 後，`window.editorInstanceRef` 必須存在，工具按鈕可見。
2. Console 不得出現 `SyntaxError`、`typeName`、`getSnapshot is not defined`。
3. 在隔離頁面建立畫筆、矩形、箭頭、便條、文字，均須建立 shape。
4. 再測主頁 Firebase 場景，確認不再出現 snapshot `migration-error`，且跨重新整理可保存內容。

## 結論

本次畫面問題的直接原因是 **v2.6.0 iframe 模組內殘留的重複同步程式碼造成 `Unexpected token 'catch'` 語法錯誤**。請先修正此 P0 語法錯誤；在白板能初始化前，無法對工具功能做有效驗收。

---

# 複檢紀錄：2026-08-08 16:45:00（UTC+08:00）｜線上版本 2.6.0

## 複檢結論

使用者截圖中的「白板正在完成初始化…」已重新在目前線上版本完整重現。這不是網路慢、Firebase 回應慢或 tldraw 工具個別故障；白板 iframe 的 JavaScript 模組有語法錯誤，導致整個 tldraw 程式根本沒有執行。

## 本次實測證據

- 主頁版本：`ver 2.6.0`
- iframe：`whiteboard_v146.html?v=2000`
- 直接載入 iframe 並等待 9 秒後：
  - `window.editorInstanceRef === false`
  - 工具按鈕數量為 `0`
  - 畫面文字為「白板正在完成初始化…／重新載入白板」
- Console / Page Error：

```text
SyntaxError: Unexpected token 'catch'
```

- 對線上 `<script type="module">` 做 ES module syntax check，同樣在 module 第 351 行失敗：

```text
[stdin]:351
} catch (err) {
  ^^^^^
SyntaxError: Unexpected token 'catch'
```

## 根因位置

線上 `whiteboard_v146.html?v=2000` 的新版 document listener 已在 HTML 第 465–488 行正確結束：

```js
editor.store.listen((entry) => {
  // ...
}, { scope: 'document' });
```

但 HTML 第 489–499 行又緊接著殘留一段舊版、且不完整的同步程式碼。它包含孤立的 `catch (err)`、`}, 300)` 與第二個 listener 結尾，沒有相對應的 `try` 或函式開頭。因此瀏覽器在 parse module 時立即中止。

## 給 Antigravity 的唯一 P0 修正

刪除 `whiteboard_v146.html` 中完整 listener 結束後的重複殘留區塊：目前線上 HTML 第 489–499 行，從第二次 `window.parent.postMessage({` 開始，到第二次 `}, { scope: 'document' });` 結束。保留第 465–488 行的新版 listener，並讓下一行直接接「通知父視窗已準備就緒」註解。

## 修正後必做驗收

1. 對 iframe 的 module 執行語法檢查，必須無 `Unexpected token`。
2. 載入 9 秒內 `window.editorInstanceRef` 必須存在，且工具按鈕大於 0。
3. 畫面不可再顯示「白板正在完成初始化…」。
4. 再依序測試畫筆、矩形、箭頭、便條、文字與 Firebase 同步；此步驟必須在 P0 語法錯誤消失後才有意義。

## 結論

本次複檢與前次判定一致：**目前線上 v2.6.0 尚未修正，初始化失敗的直接原因仍是 `Unexpected token 'catch'`。** 重新載入按鈕無法解決此問題，因為每次載入都會下載同一段無法解析的 JavaScript。

---

# 接手修改紀錄：2026-08-08 23:08:33（UTC+08:00）｜本機版本 2.6.1（尚未部署）

## 本次工作範圍

自本節起由 Codex 接手修正與驗證，不再僅進行檢測。修改均保留在本機工作區，尚未提交、推送或部署至 GitHub Pages。

## 已修正的根因

- 檔案：`whiteboard_v146.html`
- 問題：有效的 tldraw document listener 結束後，仍殘留一段重複且不完整的 `TLDRAW_LOCAL_CHANGE` 監聽程式；其中的 `catch` 沒有對應可解析的 `try` 區塊。
- 影響：瀏覽器載入模組時會發生 `SyntaxError: Unexpected token 'catch'`，因此白板無法初始化，落入「白板正在完成初始化…」的備援畫面。
- 修正：移除該段殘留的重複程式，只保留前方完整且有效的 document listener。

## 版本與快取更新

- 主程式版本：`js/app.js` 的 `APP_VERSION` 從 `2.6.0` 更新為 `2.6.1`。
- 主頁版本標示：`index.html` 更新為 `ver 2.6.1`。
- iframe 快取參數：`whiteboard_v146.html?v=2000` 更新為 `v=2001`（初始 iframe 與 DOM 載入後重設位置皆已同步更新）。
- 內嵌白板標示：`whiteboard_v146.html` 從 `v1.6.0` 更新為 `v1.6.1`。
- 版本日誌：已在 `SYSTEM_LOG.md` 補上繁體中文的 2.6.1 紀錄。

## 建置與測試環境

- 安裝可攜式 Node.js `v24.19.0` 與 npm `v11.17.0`：`C:\Users\harmo\AppData\Local\interactive-whiteboard-devtools\node-v24.19.0-win-x64`。
- 建立本機開發副本：`C:\Users\harmo\AppData\Local\interactive-whiteboard-dev`。
- 原 Google Drive 工作目錄安裝相依套件時曾受同步鎖定影響（pnpm `EISDIR`、npm `EBADF`）；後續開發、安裝與測試應優先在上述本機副本進行，再將已驗證變更同步回專案工作區。
- 新增 `package.json`、`package-lock.json` 與以下指令：
  - `npm run dev`：本機啟動靜態網站。
  - `npm run check:syntax`：檢查目前實際由 iframe 載入的 `whiteboard_v146.html` 內嵌 module 語法。
  - `npm run test:smoke`：以 Playwright 驗證白板初始化及工具互動。
  - `npm test`：依序執行語法與 smoke 測試。
- 新增 GitHub Actions：`.github/workflows/whiteboard-check.yml`，於推送與 Pull Request 執行相同測試。
- 新增 `.gitignore`，忽略 `node_modules`、Playwright 報告及測試結果；README 已補上本機驗證步驟。

## 自動化測試結果

在本機開發副本以乾淨安裝（`npm ci`）完成測試：

- `npm run check:syntax`：通過（`whiteboard_v146.html`）。
- Playwright smoke test：4 / 4 通過。
  - tldraw 初始化時無頁面錯誤。
  - 可建立手繪圖形。
  - 可建立幾何圖形與箭頭。
  - 可建立便利貼與文字。

## 新增或調整的檔案

- 已修改：`whiteboard_v146.html`、`index.html`、`js/app.js`、`README.md`、`SYSTEM_LOG.md`。
- 已新增：`package.json`、`package-lock.json`、`playwright.config.mjs`、`scripts/check-whiteboard-syntax.mjs`、`tests/whiteboard.spec.mjs`、`.github/workflows/whiteboard-check.yml`、`.gitignore`。

## 交付／部署狀態與後續建議

- 本機修正與測試已完成，但尚未執行 Git commit、push 或 GitHub Pages 部署；線上網站目前仍是 2.6.0，尚未包含本節的 2.6.1 修正。
- 後續接手者應先檢閱工作區變更，再於取得部署授權後依序執行：`npm ci`、`npm test`、提交 Git 變更、推送 `main`，最後待 GitHub Pages 發布完成後重新在正式網址測試。
- `whiteboard.html` 為非目前 iframe 使用的舊版檔案；本次語法檢查與 smoke test 只針對正式入口 `whiteboard_v146.html`，避免舊檔案的歷史問題干擾現行發布驗證。

---

# 快捷鍵檢測與修正：2026-08-08 23:30:29（UTC+08:00）｜本機版本 2.6.2（尚未部署）

## 回報項目

- 白板放大／縮小：Ctrl + 滑鼠滾輪。
- 白板平移：按住空白鍵拖曳，或以滑鼠中鍵拖曳。

## 檢測結果

- 在本機 2.6.1 的白板直接頁面，Ctrl + 滾輪可改變 camera 縮放值；空白鍵拖曳與中鍵拖曳均可改變 camera 座標。
- 在主頁開啟「互動白板」分頁後的 iframe 實際情境，三種操作也均可重現成功，外層頁面沒有攔截這些事件。
- 因此未能在自動化環境重現「完全無法操作」的情況；可能與使用者瀏覽器焦點、快取，或線上尚未部署本機修正版本有關。線上網站仍未包含 2.6.1／2.6.2 的本機變更。

## 已採取的防護修正

- 檔案：`whiteboard_v146.html`。
- 將原先依賴 tldraw 套件預設值的導覽行為改為明確設定：
  - `spacebarPanning: true`：按住空白鍵可平移。
  - `camera.isLocked: false`：相機允許移動。
  - `camera.wheelBehavior: 'zoom'`：滾輪縮放。
  - `camera.panSpeed: 1`、`camera.zoomSpeed: 1`：固定標準操作速度。
- 將版本更新為 2.6.2，並把 iframe 快取參數更新為 `v=2002`；內嵌白板標示為 v1.6.2。

## 新增自動化驗證

- 檔案：`tests/whiteboard.spec.mjs`。
- 新增 Ctrl + 滑鼠滾輪縮放測試。
- 新增空白鍵拖曳與中鍵拖曳平移測試。
- 新增主頁 iframe 情境測試，涵蓋 Ctrl + 滾輪、空白鍵拖曳與中鍵拖曳。
- 本機以乾淨相依環境執行 `npm test`：語法檢查通過，Playwright 7 / 7 通過。

## 後續部署驗收

1. 取得部署授權後，先執行 `npm ci` 與 `npm test`。
2. 提交並推送 2.6.2 變更，等待 GitHub Pages 發布。
3. 在正式網址完成硬重新整理後，點擊一次白板畫布以取得焦點，再測試 Ctrl + 滾輪、空白鍵拖曳與中鍵拖曳。
4. 若仍只在特定瀏覽器失效，記錄瀏覽器名稱、版本、作業系統及是否使用觸控板，據此補上該環境的事件紀錄。

---

# 快捷鍵二次修正：2026-08-08 23:44:02（UTC+08:00）｜本機版本 2.6.3（尚未部署）

## 使用者回報與前次修正的結論

使用者以實際開啟檔案的方式測試後，回報 2.6.2 仍無法使用 Ctrl + 滑鼠滾輪、空白鍵拖曳與中鍵拖曳。先前 2.6.2 僅明確宣告 tldraw 的設定，但仍會交由套件內部的快捷鍵處理，因此不能視為已解決。

## 本次實作

- 檔案：`whiteboard_v146.html`。
- 在白板掛載完成後新增 capture-phase 原生輸入處理，於 tldraw 內部事件之前執行。
- Ctrl + 滑鼠滾輪：攔截事件、停止瀏覽器預設縮放，直接呼叫 `editor.zoomIn()` / `editor.zoomOut()`。
- 空白鍵 + 左鍵拖曳：以 `editor.setCamera()` 直接平移；文字輸入欄與 contenteditable 編輯器不會啟用此攔截，避免空白鍵無法輸入。
- 中鍵拖曳：以相同的 `editor.setCamera()` 路徑直接平移，並阻止瀏覽器的中鍵自動捲動。
- 視窗失焦、pointerup、pointercancel 時清除暫存平移狀態，避免快捷鍵卡住。
- 版本升級：主頁／`APP_VERSION` 為 2.6.3，iframe cache 為 `v=2003`，白板標示為 v1.6.3。

## 驗證結果與限制

- `npm test`：7 / 7 通過；語法檢查通過。
- 新增的測試不僅檢查縮放與相機座標變化，也驗證新事件處理的診斷計數：Ctrl+滾輪、空白鍵平移、中鍵平移皆至少被捕捉一次。
- 本機桌面層級的實體滑鼠／鍵盤測試工具受系統沙箱服務阻擋，無法由 Codex 直接模擬硬體輸入；因此部署後仍必須由使用者在目標瀏覽器進行一次實體驗收。

## 後續部署驗收

1. 先執行 `npm ci` 與 `npm test`。
2. 提交並推送 2.6.3，等待 GitHub Pages 發布。
3. 在正式網址完成硬重新整理，確認標示為 `ver 2.6.3`，再點擊白板畫布後測試三種操作。
4. 若仍無效，請提供瀏覽器名稱與版本、作業系統、滑鼠或觸控板型號，以及是否使用瀏覽器外掛；此時應針對該裝置的原生輸入事件再做專項除錯。

---

# 平移手型游標修正：2026-08-09（UTC+08:00）｜本機版本 2.6.4（尚未部署）

## 使用者回報

按住空白鍵或滑鼠中鍵時，游標仍維持箭頭，缺少平移模式的可見回饋。

## 已完成修正

- 檔案：`whiteboard_v146.html`。
- 新增 `.whiteboard-pan-ready`：按住空白鍵後，白板及其畫布子元素一律顯示 `grab` 抓取手游標。
- 新增 `.whiteboard-panning`：空白鍵拖曳或中鍵拖曳期間，一律顯示 `grabbing` 抓住手游標。
- 平移結束、取消、視窗失焦或放開空白鍵時，會立即移除相對應狀態，游標恢復原工具的樣式。
- 版本升級：2.6.4、iframe cache `v=2004`、內嵌白板 v1.6.4。

## 驗證結果

- `npm test` 通過，Playwright 7 / 7 通過。
- 測試明確驗證：空白鍵按下時 `.tl-canvas` 的計算後游標為 `grab`；空白鍵／中鍵拖曳期間為 `grabbing`；放開後不再保有拖曳狀態。
- 已在白板直接頁面與主頁 iframe 情境完成驗證。

## 部署狀態

尚未提交、推送或部署。正式網站仍未包含本機 2.6.4 的變更；部署後需確認主頁顯示 `ver 2.6.4` 再進行實體滑鼠驗收。

---

# 唐詩宋詞・成語典故專注力測驗：2026-08-09 22:34:43 +08:00｜本機版本 2.7.0（尚未部署）

## 使用者需求

新增「唐詩宋詞成語典故」專注力測驗單元：至少三至四個選項、可用刪去法增加答對機會、生成 200 題；作答後需列出正解、完整詩詞／原典及介紹連結，優先使用中讀網。

## 已完成修改

- index.html：專注力遊戲類型新增「📜 唐詩宋詞・成語典故（選擇題）」；教師可選每局 3、5 或 10 題。
- js/classics_quiz_pool.js：新增 200 題固定四選一題庫（唐詩宋詞 102 題、成語典故 98 題）。教師端開局時隨機抽題並同步，所有參與者會收到同一組題目。
- js/classics_quiz.js：新增選擇題互動、每題一次的「刪去法提示」（排除一個錯誤選項、加計 5 秒）、作答後即時顯示正解與逐題複習頁。
- 題目來源連結策略：中讀網優先導讀連結（「將進酒」使用已確認的直接文章；其他題目使用中讀網站內搜尋）；另提供維基文庫全文／原典搜尋與維基百科延伸介紹搜尋。介面明確標示「中讀網導讀（優先搜尋）」，避免將搜尋結果誤稱為逐題已驗證的直接文章。
- js/app.js：接入開局抽題、倒數說明、遊戲啟動、完成複習與排行榜；排行榜先依答對題數、再依耗時排序。
- tests/classics-quiz.spec.mjs：新增瀏覽器驗證，覆蓋題庫數量、四選一、三種連結、設定區塊、刪去法、作答回饋與三個閱讀連結。
- 版本升級：主頁、APP_VERSION、package.json、package-lock.json 更新為 2.7.0；新 JS 檔案 cache version 為 v=201。

## 驗證結果

- npm test：8 / 8 通過。
- 新測驗驗證：200 題、每題 4 個選項、正解必位於選項中、每題均具有中讀網／原典全文／延伸介紹連結。
- 瀏覽器互動驗證：啟動題目、使用刪去法、選擇正解後顯示回饋與 3 個連結均通過。
- 既有白板回歸：初始化、繪圖、幾何、箭頭、便條、文字、Ctrl + 滾輪縮放、空白鍵／中鍵平移均通過。

## 後續接手／部署建議

1. 提交並推送本機 2.7.0 變更後，等待 GitHub Pages 發布。
2. 正式站硬重新整理，確認頁首顯示 ver 2.7.0。
3. 以管理員身分發起 3 題測驗，確認學生端可作答、提示會排除一個錯誤選項、完成後可開啟三種閱讀連結。
4. 若要把「中讀網優先搜尋」全部升級成每題的精確文章 URL，需逐題人工核對中讀網實際文章後再替換；目前未將未驗證的 URL 偽裝成直接文章。

## 部署狀態

尚未提交、推送或部署；正式網站仍不含本機 2.7.0 變更。
---

## 題庫品質修正：2026-08-09 23:02:00 +08:00｜本機版本 2.7.1（尚未部署）

### 問題與原因

使用者回報部分詩詞題的題幹已直接給出作品名，選項再以「作者－同一作品名」作答；部分成語人物題也在人物後重複顯示題幹成語。這會讓答案直接重複題幹，降低測驗意義。

### 已完成修正

- 詩詞第二題型全部改為「作品資訊 → 選出正確詩句」；正解是詩句，不會重複題幹的作者或作品名。
- 成語人物題全部改為純人物姓名選項，不再使用「人物－成語」格式。
- 成語本身包含主角人名的 3 題（東施效顰、毛遂自薦、伯樂相馬），改用不含人名的故事敘述題幹。
- 自動測試新增題庫規則：每題必須有 4 個選項、正解必在選項中、題幹不得包含正解文字。
- 版本升級為 2.7.1；題庫及主程式 cache version 更新為 v=202。

### 檢查結果

- 全部 200 題通過：題幹不含正解文字，正解均位於四個選項內。
- 題型分布：唐詩宋詞 102 題、成語典故 98 題。
- npm test：Playwright 8 / 8 通過。
- 白板 iframe 測試另加入測試專用的遊戲遮罩隔離，避免 Firebase 的遠端遊戲狀態遮住白板操作；不影響正式產品行為。

### 部署狀態

尚未提交、推送或部署；正式網站仍不含本機 2.7.1 變更。
---

## 詩詞題型與中讀網搜尋修正：2026-08-09 23:19:54 +08:00｜本機版本 2.7.2（尚未部署）

### 使用者回報

使用者希望唐詩宋詞題目一律採用「名句／詞句 → 作者或作品」的形式，不採用「作品資訊 → 選詩句」的反向題型；另指出中讀網連結難以找到內容，要求搜尋關鍵字以詩或詞名稱為主。

### 已完成修正

- 移除所有「作品資訊 → 選詩句」的詩詞題。
- 保留名句出處題：「名句」是出自？選項為作者－作品。
- 第二種詩詞題改為：「名句」的作者是？選項為作者姓名。
- 因此全部唐詩宋詞題的題幹均從名句／詞句開始，符合使用者提供的圖 1 格式。
- 中讀網搜尋與全文／介紹搜尋統一以作品主名稱為關鍵字。以水調歌頭·明月幾時有為例，實際搜尋字串為「水調歌頭」。
- 中讀網連結文字會顯示目前帶入的搜尋字詞，方便使用者辨識。
- 測試新增兩條規則：所有詩詞題題幹必以引號名句開頭；詩詞中讀網關鍵字不得包含詞牌副題。

### 檢查結果

- 200 題全部通過：四選一、正解位於選項內、題幹不含正解文字。
- 102 題唐詩宋詞均為名句出題；98 題成語典故維持既有無洩漏題幹規則。
- npm test：Playwright 8 / 8 通過。

### 部署狀態

尚未提交、推送或部署；正式網站仍不含本機 2.7.2 變更。