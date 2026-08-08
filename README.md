# 即時互動白板 - 課堂互動系統

一個即時互動白板系統，支援課堂上的白板繪圖、提問、選擇題測驗和圖片分享功能。

---

## 🔗 Firebase 重要連結

| 項目 | 網址 |
|------|------|
| **專案管理後台** | https://console.firebase.google.com/project/opencode-whiteboard/overview |
| **上線網址** | https://harmonica80.github.io/interactive-whiteboard-2026/ |

---

## 功能特色

- **白板繪圖**：畫筆、橡皮擦、多種顏色、筆寬調整
- **即時提問**：學生可即時輸入問題，所有人可見
- **選擇題測驗**：老師出題，學生答題，即時統計結果
- **圖片分享**：支援拖曳或點擊上傳圖片
- **多人同步**：Firebase 即時同步，30-50 人同時使用

## 使用方式

### 1. 設定 Firebase

1. 前往 [Firebase](https://firebase.google.com/) 建立新專案
2. 啟用 **Realtime Database**
3. 設定資料庫規則（請至 Firebase Console -> Realtime Database -> 規則 貼上）：
```json
{
  "rules": {
    ".read": "now < 1893456000000",
    ".write": "now < 1893456000000"
  }
}
```
4. 取得專案設定，填入 `js/firebase-config.js`

### 2. 啟動應用程式

直接用瀏覽器開啟 `index.html` 即可使用。

或使用本地伺服器：
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve
```

## 開發與驗證

本專案以 Node.js 24 與 npm 管理開發依賴。首次在一般本機磁碟的工作副本執行：

```bash
npm ci
npm run dev
```

提交或部署前必須執行：

```bash
npm test
```

`npm test` 會先檢查實際白板入口 `whiteboard_v146.html` 的 ES module 語法，再以 Playwright 驗證 tldraw 初始化以及畫筆、圖形、箭頭、便條與文字工具。

> 若專案位於雲端同步磁碟，Windows 的檔案鎖可能影響 `node_modules` 安裝。請改在本機磁碟建立開發副本，再以 Git 同步變更。
### 3. 使用步驟

1. **設定暱稱**：在頁面頂部輸入您的暱稱
2. **使用白板**：選擇工具、顏色，開始繪圖
3. **提問**：在右側提問區輸入問題
4. **測驗**：老師建立測驗，學生點選答案
5. **分享圖片**：拖曳或點擊上傳圖片

## 檔案結構

```
interactive-whiteboard/
├── index.html              # 主頁面
├── css/
│   └── style.css           # 樣式
├── js/
│   ├── firebase-config.js  # Firebase 設定
│   ├── whiteboard.js       # 白板繪圖模組
│   ├── quiz.js             # 測驗模組
│   └── app.js              # 主程式
└── README.md               # 使用說明
```

## 技術棧

- HTML5 Canvas
- CSS3
- JavaScript (ES6+)
- Firebase Realtime Database

## 注意事項

- 首次使用需設定 Firebase 專案
- 免費方案有流量限制，大量使用需付費
- 建議使用現代瀏覽器（Chrome、Firefox、Edge）
- 雲端部署時需確保 Firebase 設定正確
