// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDTPE7lFa86CMq0wd6eWDJZ6t_spH2W26k",
  authDomain: "opencode-whiteboard.firebaseapp.com",
  databaseURL: "https://opencode-whiteboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "opencode-whiteboard",
  storageBucket: "opencode-whiteboard.firebasestorage.app",
  messagingSenderId: "473141473085",
  appId: "1:473141473085:web:091f760eb2ab737f385f54"
};

// 支援透過 URL 參數動態載入自訂的 Firebase Database URL (供不同老師分流使用，無需重新架站)
const urlParams = new URLSearchParams(window.location.search);
const customDbUrl = urlParams.get('dbUrl');

if (customDbUrl) {
  // 如果 URL 帶有 dbUrl 參數，覆蓋預設的 databaseURL
  firebaseConfig.databaseURL = decodeURIComponent(customDbUrl);
}

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 取得資料庫與儲存體引用
const db = firebase.database();
let storage = null; // 免費版 Spark 方案不支援 Storage，設為 null 以直接啟用本地壓縮資料庫備用方案
