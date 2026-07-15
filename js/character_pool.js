// 一字千金易錯字庫 - 預先準備的 500 題超豐富題庫
const CHARACTER_TEST_POOL = [
  {
    "char": "足",
    "zhuyin": "ㄗㄨˊ",
    "clue": "畫蛇添（　）",
    "searchWord": "畫蛇添足"
  },
  {
    "char": "兔",
    "zhuyin": "ㄊㄨˋ",
    "clue": "守株待（　）",
    "searchWord": "守株待兔"
  },
  {
    "char": "牢",
    "zhuyin": "ㄌㄠˊ",
    "clue": "亡羊補（　）",
    "searchWord": "亡羊補牢"
  },
  {
    "char": "盾",
    "zhuyin": "ㄉㄨㄣˋ",
    "clue": "自相矛（　）",
    "searchWord": "自相矛盾"
  },
  {
    "char": "劍",
    "zhuyin": "ㄐㄧㄢˋ",
    "clue": "刻舟求（　）",
    "searchWord": "刻舟求劍"
  },
  {
    "char": "威",
    "zhuyin": "ㄨㄟ",
    "clue": "狐假虎（　）",
    "searchWord": "狐假虎威"
  },
  {
    "char": "鳥",
    "zhuyin": "ㄋㄧㄠˇ",
    "clue": "驚弓之（　）",
    "searchWord": "驚弓之鳥"
  },
  {
    "char": "蛙",
    "zhuyin": "ㄨㄚ",
    "clue": "井底之（　）",
    "searchWord": "井底之蛙"
  },
  {
    "char": "雕",
    "zhuyin": "ㄉㄧㄠ",
    "clue": "一箭雙（　）",
    "searchWord": "一箭雙雕"
  },
  {
    "char": "廢",
    "zhuyin": "ㄈㄟˋ",
    "clue": "半途而（　）",
    "searchWord": "半途而廢"
  },
  {
    "char": "形",
    "zhuyin": "ㄒㄧㄥˊ",
    "clue": "得意忘（　）",
    "searchWord": "得意忘形"
  },
  {
    "char": "琴",
    "zhuyin": "ㄑㄧㄣˊ",
    "clue": "對牛彈（　）",
    "searchWord": "對牛彈琴"
  },
  {
    "char": "動",
    "zhuyin": "ㄉㄨㄥˋ",
    "clue": "風吹草（　）",
    "searchWord": "風吹草動"
  },
  {
    "char": "語",
    "zhuyin": "ㄩˇ",
    "clue": "花言巧（　）",
    "searchWord": "花言巧語"
  },
  {
    "char": "飢",
    "zhuyin": "ㄐㄧ",
    "clue": "畫餅充（　）",
    "searchWord": "畫餅充飢"
  },
  {
    "char": "寧",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "雞犬不（　）",
    "searchWord": "雞犬不寧"
  },
  {
    "char": "非",
    "zhuyin": "ㄈㄟ",
    "clue": "口是心（　）",
    "searchWord": "口是心非"
  },
  {
    "char": "石",
    "zhuyin": "ㄕˊ",
    "clue": "落井下（　）",
    "searchWord": "落井下石"
  },
  {
    "char": "長",
    "zhuyin": "ㄓㄤˇ",
    "clue": "揠苗助（　）",
    "searchWord": "揠苗助長"
  },
  {
    "char": "水",
    "zhuyin": "ㄕㄨㄟˇ",
    "clue": "如魚得（　）",
    "searchWord": "如魚得水"
  },
  {
    "char": "出",
    "zhuyin": "ㄔㄨ",
    "clue": "水落石（　）",
    "searchWord": "水落石出"
  },
  {
    "char": "苦",
    "zhuyin": "ㄎㄨˇ",
    "clue": "同甘共（　）",
    "searchWord": "同甘共苦"
  },
  {
    "char": "趙",
    "zhuyin": "ㄓㄠˋ",
    "clue": "完璧歸（　）",
    "searchWord": "完璧歸趙"
  },
  {
    "char": "炭",
    "zhuyin": "ㄊㄢˋ",
    "clue": "雪中送（　）",
    "searchWord": "雪中送炭"
  },
  {
    "char": "馬",
    "zhuyin": "ㄇㄚˇ",
    "clue": "指鹿為（　）",
    "searchWord": "指鹿為馬"
  },
  {
    "char": "兵",
    "zhuyin": "ㄅㄧㄥ",
    "clue": "紙上談（　）",
    "searchWord": "紙上談兵"
  },
  {
    "char": "四",
    "zhuyin": "ㄙˋ",
    "clue": "朝三暮（　）",
    "searchWord": "朝三暮四"
  },
  {
    "char": "棄",
    "zhuyin": "ㄑㄧˋ",
    "clue": "自暴自（　）",
    "searchWord": "自暴自棄"
  },
  {
    "char": "煉",
    "zhuyin": "ㄌㄧㄢˋ",
    "clue": "千錘百（　）",
    "searchWord": "千錘百煉"
  },
  {
    "char": "分",
    "zhuyin": "ㄈㄣ",
    "clue": "入木三（　）",
    "searchWord": "入木三分"
  },
  {
    "char": "一",
    "zhuyin": "ㄧ",
    "clue": "百裡挑（　）",
    "searchWord": "百裡挑一"
  },
  {
    "char": "竹",
    "zhuyin": "ㄓㄨˊ",
    "clue": "胸有成（　）",
    "searchWord": "胸有成竹"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "不速之（　）",
    "searchWord": "不速之客"
  },
  {
    "char": "求",
    "zhuyin": "ㄑㄧㄡˊ",
    "clue": "供不應（　）",
    "searchWord": "供不應求"
  },
  {
    "char": "本",
    "zhuyin": "ㄅㄣˇ",
    "clue": "忘恩負（　）",
    "searchWord": "忘恩負義"
  },
  {
    "char": "神",
    "zhuyin": "ㄕㄣˊ",
    "clue": "聚精會（　）",
    "searchWord": "聚精會神"
  },
  {
    "char": "日",
    "zhuyin": "ㄖㄧˋ",
    "clue": "重見天（　）",
    "searchWord": "重見天日"
  },
  {
    "char": "一",
    "zhuyin": "ㄧ",
    "clue": "千篇一（　）",
    "searchWord": "千篇一律"
  },
  {
    "char": "名",
    "zhuyin": "ㄇㄧㄥˊ",
    "clue": "莫名其（　）",
    "searchWord": "莫名其妙"
  },
  {
    "char": "風",
    "zhuyin": "ㄈㄥ",
    "clue": "兩袖清（　）",
    "searchWord": "兩袖清風"
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "clue": "東山再（　）",
    "searchWord": "東山再起"
  },
  {
    "char": "海",
    "zhuyin": "ㄏㄞˇ",
    "clue": "石沉大（　）",
    "searchWord": "石沉大海"
  },
  {
    "char": "人",
    "zhuyin": "ㄖㄣˊ",
    "clue": "助人為（　）",
    "searchWord": "助人為樂"
  },
  {
    "char": "天",
    "zhuyin": "ㄊㄧㄢ",
    "clue": "怨天尤（　）",
    "searchWord": "怨天尤人"
  },
  {
    "char": "地",
    "zhuyin": "ㄉㄧˋ",
    "clue": "頂天立（　）",
    "searchWord": "頂天立地"
  },
  {
    "char": "口",
    "zhuyin": "ㄎㄡˇ",
    "clue": "啞口無（　）",
    "searchWord": "啞口無言"
  },
  {
    "char": "意",
    "zhuyin": "ㄧˋ",
    "clue": "三心二（　）",
    "searchWord": "三心二意"
  },
  {
    "char": "心",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "粗心大（　）",
    "searchWord": "粗心大意"
  },
  {
    "char": "日",
    "zhuyin": "ㄖㄧˋ",
    "clue": "日新月（　）",
    "searchWord": "日新月異"
  },
  {
    "char": "雷",
    "zhuyin": "ㄌㄟˊ",
    "clue": "如雷貫（　）",
    "searchWord": "如雷貫耳"
  },
  {
    "char": "熱",
    "zhuyin": "ㄖㄜˋ",
    "clue": "網路上引起（　）烈討論。",
    "searchWord": "熱烈"
  },
  {
    "char": "尷",
    "zhuyin": "ㄍㄢ",
    "clue": "場面顯得十分（　）尬。",
    "searchWord": "尷尬"
  },
  {
    "char": "尬",
    "zhuyin": "ㄍㄚˋ",
    "clue": "忘詞導致氣氛尷（　）。",
    "searchWord": "尷尬"
  },
  {
    "char": "肺",
    "zhuyin": "ㄈㄟˋ",
    "clue": "這是發自（　）腑的真心話。",
    "searchWord": "發自肺腑"
  },
  {
    "char": "冒",
    "zhuyin": "ㄇㄠˋ",
    "clue": "我們（　）著雨前行。",
    "searchWord": "冒著"
  },
  {
    "char": "梁",
    "zhuyin": "ㄌㄧㄤˊ",
    "clue": "做人不能偷（　）換柱。",
    "searchWord": "偷梁換柱"
  },
  {
    "char": "鼎",
    "zhuyin": "ㄉㄧㄥˇ",
    "clue": "感謝您的（　）力相助。",
    "searchWord": "鼎力相助"
  },
  {
    "char": "憋",
    "zhuyin": "ㄅㄧㄝ",
    "clue": "他快要（　）不住笑了。",
    "searchWord": "憋不住"
  },
  {
    "char": "戳",
    "zhuyin": "ㄔㄨㄛ",
    "clue": "這個泡沫一（　）即破。",
    "searchWord": "一戳即破"
  },
  {
    "char": "蒐",
    "zhuyin": "ㄙㄡ",
    "clue": "警方努力（　）集證據。",
    "searchWord": "蒐集"
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "找出事件的（　）後黑手。",
    "searchWord": "幕後黑手"
  },
  {
    "char": "慕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "許多人（　）名前來參觀。",
    "searchWord": "慕名"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "霧太大，難以（　）明方向。",
    "searchWord": "辨明"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "他在大會上（　）才無礙。",
    "searchWord": "辯才無礙"
  },
  {
    "char": "磬",
    "zhuyin": "ㄑㄧㄥˋ",
    "clue": "他家境貧如懸（　）。",
    "searchWord": "室如懸磬"
  },
  {
    "char": "磐",
    "zhuyin": "ㄆㄢˊ",
    "clue": "感情堅如（　）石。",
    "searchWord": "堅如磐石"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這使他聲名狼（　）。",
    "searchWord": "聲名狼藉"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "在政壇上他只是一個（　）籍無名的人。",
    "searchWord": "籍籍無名"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "做事一定要再接再（　）。",
    "searchWord": "再接再厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這句話極具鼓（　）作用。",
    "searchWord": "鼓勵"
  },
  {
    "char": "輟",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "他因貧困而（　）學。",
    "searchWord": "輟學"
  },
  {
    "char": "綴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "天空點（　）著星星。",
    "searchWord": "點綴"
  },
  {
    "char": "啜",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "她躲在角落低聲（　）泣。",
    "searchWord": "啜泣"
  },
  {
    "char": "緝",
    "zhuyin": "ㄑㄧˋ",
    "clue": "警方發布通（　）令。",
    "searchWord": "通緝"
  },
  {
    "char": "輯",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這本書的（　）排很好。",
    "searchWord": "編輯"
  },
  {
    "char": "揖",
    "zhuyin": "ㄧ",
    "clue": "他向長輩作（　）行禮。",
    "searchWord": "作揖"
  },
  {
    "char": "葺",
    "zhuyin": "ㄑㄧˋ",
    "clue": "老屋需要修（　）防漏。",
    "searchWord": "修葺"
  },
  {
    "char": "戢",
    "zhuyin": "ㄐㄧˊ",
    "clue": "兩國偃兵（　）戈。",
    "searchWord": "偃兵戢戈"
  },
  {
    "char": "戈",
    "zhuyin": "ㄍㄜ",
    "clue": "兩國偃武修（　）。",
    "searchWord": "偃武修戈"
  },
  {
    "char": "戌",
    "zhuyin": "ㄒㄩ",
    "clue": "地支順序有（　）字。",
    "searchWord": "戌"
  },
  {
    "char": "戊",
    "zhuyin": "ㄨˋ",
    "clue": "天干順序有（　）字。",
    "searchWord": "戊"
  },
  {
    "char": "戍",
    "zhuyin": "ㄕㄨˋ",
    "clue": "戰士前往邊防（　）守。",
    "searchWord": "防戍"
  },
  {
    "char": "戎",
    "zhuyin": "ㄖㄨㄥˊ",
    "clue": "將軍決定投筆從（　）。",
    "searchWord": "投筆從戎"
  },
  {
    "char": "冗",
    "zhuyin": "ㄖㄨㄥˇ",
    "clue": "文章顯得相當（　）長。",
    "searchWord": "冗長"
  },
  {
    "char": "沈",
    "zhuyin": "ㄕㄣˇ",
    "clue": "現場陷入一片（　）默。",
    "searchWord": "沈默"
  },
  {
    "char": "枕",
    "zhuyin": "ㄓㄣˇ",
    "clue": "將士們（　）戈待旦。",
    "searchWord": "枕戈待旦"
  },
  {
    "char": "耽",
    "zhuyin": "ㄉㄢ",
    "clue": "沉迷電玩會（　）誤學業。",
    "searchWord": "耽誤"
  },
  {
    "char": "眈",
    "zhuyin": "ㄉㄢ",
    "clue": "強國虎視（　）（　）。",
    "searchWord": "虎視眈眈"
  },
  {
    "char": "諂",
    "zhuyin": "ㄔㄢˇ",
    "clue": "他極力（　）媚主管。",
    "searchWord": "諂媚"
  },
  {
    "char": "陷",
    "zhuyin": "ㄒㄧㄢˋ",
    "clue": "車子在泥沼中深（　）。",
    "searchWord": "深陷"
  },
  {
    "char": "焰",
    "zhuyin": "ㄧㄢˋ",
    "clue": "大火的烈（　）沖天。",
    "searchWord": "烈焰"
  },
  {
    "char": "掐",
    "zhuyin": "ㄑㄧㄚ",
    "clue": "他（　）了自己大腿一下。",
    "searchWord": "掐"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "瓷器有一處（　）疵。",
    "searchWord": "瑕疵"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "他忙得無（　）顧及娛樂。",
    "searchWord": "無暇"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這引發無限（　）想。",
    "searchWord": "暇想"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這塊美玉潔白無（　）。",
    "searchWord": "潔白無瑕"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "顧客多到應接不（　）。",
    "searchWord": "應接不暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這留給人（　）思空間。",
    "searchWord": "遐思"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "多運動大有（　）益。",
    "searchWord": "裨益"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "這對大局毫無（　）補。",
    "searchWord": "裨補"
  },
  {
    "char": "稗",
    "zhuyin": "ㄅㄞˋ",
    "clue": "他愛看野史（　）官。",
    "searchWord": "稗官野史"
  },
  {
    "char": "碑",
    "zhuyin": "ㄅㄟ",
    "clue": "古（　）已經被風化。",
    "searchWord": "古碑"
  },
  {
    "char": "脾",
    "zhuyin": "ㄆㄧˊ",
    "clue": "他的（　）氣很暴躁。",
    "searchWord": "脾氣"
  },
  {
    "char": "俾",
    "zhuyin": "ㄅㄧˋ",
    "clue": "請準時出發（　）便抵達。",
    "searchWord": "俾便"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "土地十分乾（　）。",
    "searchWord": "乾涸"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "他如（　）轍之鮒。",
    "searchWord": "涸轍之鮒"
  },
  {
    "char": "錮",
    "zhuyin": "ㄍㄨˋ",
    "clue": "他被禁（　）在牢房中。",
    "searchWord": "禁錮"
  },
  {
    "char": "固",
    "zhuyin": "ㄍㄨˋ",
    "clue": "做事情的基礎穩（　）。",
    "searchWord": "穩固"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "水井已完全枯（　）。",
    "searchWord": "枯涸"
  },
  {
    "char": "聒",
    "zhuyin": "ㄍㄨㄛ",
    "clue": "鳥在樹上（　）噪。",
    "searchWord": "聒噪"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "鄉村生活寧靜（　）適。",
    "searchWord": "恬適"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "他居然（　）不知恥。",
    "searchWord": "恬不知恥"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "外面正（　）著大風。",
    "searchWord": "颳風"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "大家對他（　）目相看。",
    "searchWord": "刮目相看"
  },
  {
    "char": "括",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "活動包（　）多項表演。",
    "searchWord": "包括"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "我們在涼亭小（　）。",
    "searchWord": "小憩"
  },
  {
    "char": "憇",
    "zhuyin": "ㄑㄧˋ",
    "clue": "我們在涼亭小（　）。",
    "searchWord": "小憩"
  },
  {
    "char": "契",
    "zhuyin": "ㄑㄧˋ",
    "clue": "雙方合作默（　）十足。",
    "searchWord": "默契"
  },
  {
    "char": "潔",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他做事（　）身自好。",
    "searchWord": "潔身自好"
  },
  {
    "char": "劫",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他是（　）後餘生的倖存者。",
    "searchWord": "劫後餘生"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他的反應很敏（　）。",
    "searchWord": "敏捷"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "前線（　）報頻傳。",
    "searchWord": "捷報"
  },
  {
    "char": "竭",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "我會（　）盡全力完成。",
    "searchWord": "竭盡全力"
  },
  {
    "char": "拮",
    "zhuyin": "ㄐㄧˊ",
    "clue": "他最近生活（　）据。",
    "searchWord": "拮据"
  },
  {
    "char": "据",
    "zhuyin": "ㄐㄩ",
    "clue": "他最近生活拮（　）。",
    "searchWord": "拮据"
  },
  {
    "char": "詰",
    "zhuyin": "ㄐㄧˊ",
    "clue": "法官在法庭上（　）問嫌犯。",
    "searchWord": "詰問"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "秋天到了（　）子紅了。",
    "searchWord": "橘子"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "這杯（　）汁酸甜可口。",
    "searchWord": "橘汁"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這是一件（　）手的事。",
    "searchWord": "棘手"
  },
  {
    "char": "辣",
    "zhuyin": "ㄌㄚˋ",
    "clue": "四川菜以麻（　）著稱。",
    "searchWord": "麻辣"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "真偽十分難（　）。",
    "searchWord": "真偽難辨"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "不要百般狡（　）。",
    "searchWord": "狡辯"
  },
  {
    "char": "辮",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "她綁著長（　）子。",
    "searchWord": "辮子"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事立刻（　）理。",
    "searchWord": "辦理"
  },
  {
    "char": "瓣",
    "zhuyin": "ㄅㄢˋ",
    "clue": "玫瑰花（　）隨風飄落。",
    "searchWord": "花瓣"
  },
  {
    "char": "辧",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事立刻（　）理。",
    "searchWord": "辦理"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "醫生在診（　）搏。",
    "searchWord": "脈搏"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "這座山（　）綿延極廣。",
    "searchWord": "山脈"
  },
  {
    "char": "博",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他學問十分淵（　）。",
    "searchWord": "淵博"
  },
  {
    "char": "搏",
    "zhuyin": "ㄅㄛˊ",
    "clue": "豹正在與獵物（　）鬥。",
    "searchWord": "搏鬥"
  },
  {
    "char": "膊",
    "zhuyin": "ㄅㄛˊ",
    "clue": "農夫赤（　）下田。",
    "searchWord": "赤膊"
  },
  {
    "char": "駁",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他的論點被反（　）。",
    "searchWord": "反駁"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "車在山路上顛（　）。",
    "searchWord": "顛簸"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "用（　）箕篩選穀物。",
    "searchWord": "簸箕"
  },
  {
    "char": "播",
    "zhuyin": "ㄅㄛ",
    "clue": "電台正廣（　）警報。",
    "searchWord": "廣播"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "把專款（　）付受災戶。",
    "searchWord": "撥付"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "他用手指輕（　）琴弦。",
    "searchWord": "撥琴"
  },
  {
    "char": "攀",
    "zhuyin": "ㄆㄢ",
    "clue": "藤蔓沿著牆（　）爬。",
    "searchWord": "攀爬"
  },
  {
    "char": "樊",
    "zhuyin": "ㄈㄢˊ",
    "clue": "鳥被關在（　）籠中。",
    "searchWord": "樊籠"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "他露出貪（　）的目光。",
    "searchWord": "貪婪"
  },
  {
    "char": "焚",
    "zhuyin": "ㄈㄣˊ",
    "clue": "大火（　）毀了整片森林。",
    "searchWord": "焚毀"
  },
  {
    "char": "梵",
    "zhuyin": "ㄈㄢˋ",
    "clue": "這裡充滿（　）宇氣息。",
    "searchWord": "梵宇"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "做事思慮（　）密。",
    "searchWord": "縝密"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "行事一定要謹（　）。",
    "searchWord": "謹慎"
  },
  {
    "char": "填",
    "zhuyin": "ℊㄧㄢˊ",
    "clue": "請（　）寫正確聯絡電話。",
    "searchWord": "填寫"
  },
  {
    "char": "顛",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他整個人瘋瘋（　）（　）。",
    "searchWord": "瘋瘋顛顛"
  },
  {
    "char": "巔",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "登上人生的（　）峰。",
    "searchWord": "巔峰"
  },
  {
    "char": "癲",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他突然（　）癇發作。",
    "searchWord": "癲癇"
  },
  {
    "char": "嗔",
    "zhuyin": "ㄔㄣ",
    "clue": "她面露（　）色表示不滿。",
    "searchWord": "嗔色"
  },
  {
    "char": "瞋",
    "zhuyin": "ㄔㄣ",
    "clue": "他氣得（　）目結舌。",
    "searchWord": "瞋目結舌"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "做人行事宜審（　）。",
    "searchWord": "審慎"
  },
  {
    "char": "鎮",
    "zhuyin": "ㄓㄣˋ",
    "clue": "警察開槍（　）壓暴動。",
    "searchWord": "鎮壓"
  },
  {
    "char": "震",
    "zhuyin": "ㄓㄣˋ",
    "clue": "這起大醜聞（　）驚社會。",
    "searchWord": "震驚"
  },
  {
    "char": "賑",
    "zhuyin": "ㄓㄣˋ",
    "clue": "政府撥款開倉（　）災。",
    "searchWord": "賑災"
  },
  {
    "char": "振",
    "zhuyin": "ㄓㄣˋ",
    "clue": "我們必須（　）作士氣。",
    "searchWord": "振作"
  },
  {
    "char": "陣",
    "zhuyin": "ㄓㄣˋ",
    "clue": "天空中傳來一（　）雷聲。",
    "searchWord": "一陣"
  },
  {
    "char": "朕",
    "zhuyin": "ㄓㄣˋ",
    "clue": "古代皇帝自稱為（　）。",
    "searchWord": "朕"
  },
  {
    "char": "疹",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他身上起了紅（　）。",
    "searchWord": "紅疹"
  },
  {
    "char": "診",
    "zhuyin": "ㄓㄣˇ",
    "clue": "醫生做詳細（　）斷。",
    "searchWord": "診斷"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老師嚴（　）地批評學生。",
    "searchWord": "嚴厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這是一本（　）志的好書。",
    "searchWord": "勵志"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這家百年老店（　）經滄桑。",
    "searchWord": "歷經"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "（　）史是不容忘記的。",
    "searchWord": "歷史"
  },
  {
    "char": "曆",
    "zhuyin": "ㄌㄧˋ",
    "clue": "新年換上新日（　）。",
    "searchWord": "日曆"
  },
  {
    "char": "靂",
    "zhuyin": "ㄌㄧˋ",
    "clue": "晴天霹（　）的消息。",
    "searchWord": "霹靂"
  },
  {
    "char": "礪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "在艱苦中磨（　）意志。",
    "searchWord": "磨礪"
  },
  {
    "char": "罹",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不幸（　）難者眾多。",
    "searchWord": "罹難"
  },
  {
    "char": "離",
    "zhuyin": "ㄌㄧˊ",
    "clue": "兩地距（　）遙遠。",
    "searchWord": "距離"
  },
  {
    "char": "籬",
    "zhuyin": "ㄌㄧˊ",
    "clue": "院子圍著木（　）笆。",
    "searchWord": "籬笆"
  },
  {
    "char": "釐",
    "zhuyin": "ㄌㄧˊ",
    "clue": "量度要分（　）不差。",
    "searchWord": "釐毫"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "真是一對璧（　）佳偶。",
    "searchWord": "璧儷"
  },
  {
    "char": "荔",
    "zhuyin": "ㄌㄧˋ",
    "clue": "（　）枝甜美多汁。",
    "searchWord": "荔枝"
  },
  {
    "char": "麗",
    "zhuyin": "ㄌㄧˋ",
    "clue": "風景美（　）如畫。",
    "searchWord": "美麗"
  },
  {
    "char": "莉",
    "zhuyin": "ㄌㄧˋ",
    "clue": "茉（　）花悄悄綻放。",
    "searchWord": "茉莉"
  },
  {
    "char": "例",
    "zhuyin": "ㄌㄧˋ",
    "clue": "按慣（　）舉辦旅遊。",
    "searchWord": "慣例"
  },
  {
    "char": "俐",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這女孩做事伶（　）。",
    "searchWord": "伶俐"
  },
  {
    "char": "櫪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老馬伏（　），志在千里。",
    "searchWord": "老馬伏櫪"
  },
  {
    "char": "邐",
    "zhuyin": "ㄌㄧˇ",
    "clue": "沿途風景迤（　）。",
    "searchWord": "迤邐"
  },
  {
    "char": "蠡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "管窺（　）測的見解。",
    "searchWord": "管窺蠡測"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "伉（　）攜手出席活動。",
    "searchWord": "伉儷"
  },
  {
    "char": "灑",
    "zhuyin": "ㄙㄚˇ",
    "clue": "清潔工在路面（　）水。",
    "searchWord": "灑水"
  },
  {
    "char": "酒",
    "zhuyin": "ㄐㄧㄡˇ",
    "clue": "開車不喝（　）。",
    "searchWord": "酒精"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "萬眾（　）目的決賽。",
    "searchWord": "矚目"
  },
  {
    "char": "屬",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這件失物歸（　）於誰？",
    "searchWord": "歸屬"
  },
  {
    "char": "囑",
    "zhuyin": "ㄓㄨˇ",
    "clue": "他留下感人的遺（　）。",
    "searchWord": "遺囑"
  },
  {
    "char": "佇",
    "zhuyin": "ㄓㄨˋ",
    "clue": "他在雨中（　）立許久。",
    "searchWord": "佇立"
  },
  {
    "char": "貯",
    "zhuyin": "ㄓㄨˋ",
    "clue": "多（　）備防汛沙包。",
    "searchWord": "貯備"
  },
  {
    "char": "駐",
    "zhuyin": "ㄓㄨˋ",
    "clue": "軍隊已進（　）邊防。",
    "searchWord": "進駐"
  },
  {
    "char": "助",
    "zhuyin": "ㄓㄨˋ",
    "clue": "互相幫（　）是美德.。",
    "searchWord": "幫助"
  },
  {
    "char": "蛀",
    "zhuyin": "ㄓㄨˋ",
    "clue": "糖吃多容易長（　）牙。",
    "searchWord": "蛀牙"
  },
  {
    "char": "築",
    "zhuyin": "ㄓㄨˊ",
    "clue": "工人正在建（　）大樓。",
    "searchWord": "建築"
  },
  {
    "char": "逐",
    "zhuyin": "ㄓㄨˊ",
    "clue": "不能隨波（　）流。",
    "searchWord": "隨波逐流"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨˋ",
    "clue": "這本名（　）譯成多國語。",
    "searchWord": "名著"
  },
  {
    "char": "署",
    "zhuyin": "ㄕㄨˇ",
    "clue": "公文需要局長簽（　）。",
    "searchWord": "簽署"
  },
  {
    "char": "曙",
    "zhuyin": "ㄕㄨˇ",
    "clue": "天空露出一線（　）光。",
    "searchWord": "曙光"
  },
  {
    "char": "薯",
    "zhuyin": "ㄕㄨˇ",
    "clue": "炸馬鈴（　）條非常香。",
    "searchWord": "馬鈴薯"
  },
  {
    "char": "暑",
    "zhuyin": "ㄕㄨˇ",
    "clue": "漫長（　）假是快樂時光。",
    "searchWord": "暑假"
  },
  {
    "char": "墅",
    "zhuyin": "ㄕㄨˋ",
    "clue": "買了一棟度假別（　）。",
    "searchWord": "別墅"
  },
  {
    "char": "塑",
    "zhuyin": "ㄙㄨˋ",
    "clue": "泥（　）作品栩栩如生。",
    "searchWord": "泥塑"
  },
  {
    "char": "宿",
    "zhuyin": "ㄙㄨˋ",
    "clue": "今晚在民宿寄（　）。",
    "searchWord": "寄宿"
  },
  {
    "char": "素",
    "zhuyin": "ㄙㄨˋ",
    "clue": "她平時穿著樸（　）。",
    "searchWord": "樸素"
  },
  {
    "char": "訴",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他提起民事訴（　）。",
    "searchWord": "訴訟"
  },
  {
    "char": "溯",
    "zhuyin": "ㄙㄨˋ",
    "clue": "傳統可追（　）到百年前。",
    "searchWord": "追溯"
  },
  {
    "char": "夙",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他終日（　）夜匪懈。",
    "searchWord": "夙夜匪懈"
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "clue": "大堂氣氛十分嚴（　）。",
    "searchWord": "嚴肅"
  },
  {
    "char": "簌",
    "zhuyin": "ㄙㄨˋ",
    "clue": "落葉發出（　）（　）聲。",
    "searchWord": "簌簌"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "車子的（　）度極快。",
    "searchWord": "速度"
  },
  {
    "char": "粟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "人如滄海一（　）。",
    "searchWord": "滄海一粟"
  },
  {
    "char": "蘇",
    "zhuyin": "ㄙㄨ",
    "clue": "春天萬物復（　）。",
    "searchWord": "復蘇"
  },
  {
    "char": "酥",
    "zhuyin": "ㄙㄨ",
    "clue": "鳳梨（　）口感極佳。",
    "searchWord": "鳳梨酥"
  },
  {
    "char": "俗",
    "zhuyin": "ㄙㄨˊ",
    "clue": "屏除陳規陋（　）。",
    "searchWord": "陋俗"
  },
  {
    "char": "悚",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "情節令人毛骨（　）然。",
    "searchWord": "毛骨悚然"
  },
  {
    "char": "聳",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "高（　）的大樓直插雲霄。",
    "searchWord": "高聳"
  },
  {
    "char": "訟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "兩家陷入官（　）。",
    "searchWord": "官訟"
  },
  {
    "char": "頌",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這首詩歌（　）英雄。",
    "searchWord": "歌頌"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "爸爸開車（　）我到車站。",
    "searchWord": "送行"
  },
  {
    "char": "宋",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這是（　）朝時期的花瓶。",
    "searchWord": "宋朝"
  },
  {
    "char": "誦",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "學生正大聲朗（　）。",
    "searchWord": "朗誦"
  },
  {
    "char": "松",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "古（　）迎風挺立。",
    "searchWord": "古松"
  },
  {
    "char": "鬆",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "工作完了可以放（　）。",
    "searchWord": "放鬆"
  },
  {
    "char": "嵩",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "這座山尊稱為（　）山。",
    "searchWord": "嵩山"
  },
  {
    "char": "慫",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "受朋友（　）手犯了錯。",
    "searchWord": "慫恿"
  },
  {
    "char": "懍",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "眾人畏（　）遵命。",
    "searchWord": "畏懍"
  },
  {
    "char": "凜",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "寒風（　）（　）街上無人。",
    "searchWord": "寒風凜凜"
  },
  {
    "char": "鄰",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "遠親不如近（　）。",
    "searchWord": "近鄰"
  },
  {
    "char": "臨",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "歡迎貴賓光（　）指導。",
    "searchWord": "光臨"
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "原始森（　）樹木茂密。",
    "searchWord": "森林"
  },
  {
    "char": "淋",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "他被大雨（　）濕了。",
    "searchWord": "淋雨"
  },
  {
    "char": "鱗",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "魚身上的（　）片發光。",
    "searchWord": "鱗片"
  },
  {
    "char": "麟",
    "zhuyin": "ㄌㄧˊ",
    "clue": "鳳毛（　）角的人才。",
    "searchWord": "鳳毛麟角"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "做公益不要（　）嗇。",
    "searchWord": "吝嗇"
  },
  {
    "char": "玲",
    "zhuyin": "ㄌㄧˊ",
    "clue": "玉雕小巧（　）瓏。",
    "searchWord": "玲瓏"
  },
  {
    "char": "伶",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這孩子口齒（　）俐。",
    "searchWord": "伶俐"
  },
  {
    "char": "聆",
    "zhuyin": "ㄌㄧˊ",
    "clue": "大家靜靜（　）聽音樂。",
    "searchWord": "聆聽"
  },
  {
    "char": "齡",
    "zhuyin": "ㄌㄧˊ",
    "clue": "神木的年（　）已千年。",
    "searchWord": "年齡"
  },
  {
    "char": "羚",
    "zhuyin": "ㄌㄧˊ",
    "clue": "草原上有（　）羊奔馳。",
    "searchWord": "羚羊"
  },
  {
    "char": "零",
    "zhuyin": "ㄌㄧˊ",
    "clue": "核對後帳目為（　）。",
    "searchWord": "零錢"
  },
  {
    "char": "鈴",
    "zhuyin": "ㄌㄧˊ",
    "clue": "下課（　）聲響起。",
    "searchWord": "鈴聲"
  },
  {
    "char": "凌",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不要（　）侮弱小。",
    "searchWord": "凌侮"
  },
  {
    "char": "陵",
    "zhuyin": "ㄌㄧˊ",
    "clue": "古代帝王（　）寢遺址。",
    "searchWord": "陵寢"
  },
  {
    "char": "綾",
    "zhuyin": "ㄌㄧˊ",
    "clue": "衣服是用（　）羅綢緞製成。",
    "searchWord": "綾羅綢緞"
  },
  {
    "char": "嶺",
    "zhuyin": "ㄌㄧˇ",
    "clue": "翻越重重山（　）。",
    "searchWord": "山嶺"
  },
  {
    "char": "領",
    "zhuyin": "ㄌㄧˇ",
    "clue": "他帶（　）團隊前行。",
    "searchWord": "帶領"
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "禁（　）今日正式實施。",
    "searchWord": "禁令"
  },
  {
    "char": "另",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這件事要（　）作打算。",
    "searchWord": "另作打算"
  },
  {
    "char": "靈",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這個方法很（　）驗。",
    "searchWord": "靈驗"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "不要（　）惜給掌聲。",
    "searchWord": "吝惜"
  },
  {
    "char": "濘",
    "zhuyin": "ㄋㄧㄥˋ",
    "clue": "車在泥（　）中打滑。",
    "searchWord": "泥濘"
  },
  {
    "char": "寧",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "夜晚十分安（　）。",
    "searchWord": "安寧"
  },
  {
    "char": "檸",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "新鮮的（　）檬紅茶。",
    "searchWord": "檸檬"
  },
  {
    "char": "獰",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "歹徒面目（　）惡。",
    "searchWord": "面目獰惡"
  },
  {
    "char": "凝",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "水汽（　）結成水滴。",
    "searchWord": "凝聚"
  },
  {
    "char": "擬",
    "zhuyin": "ㄋㄧˇ",
    "clue": "政府草（　）新規範。",
    "searchWord": "草擬"
  },
  {
    "char": "疑",
    "zhuyin": "ㄧˊ",
    "clue": "我表示懷（　）。",
    "searchWord": "懷疑"
  },
  {
    "char": "礙",
    "zhuyin": "ㄞˋ",
    "clue": "以免阻（　）交通。",
    "searchWord": "阻礙"
  },
  {
    "char": "癡",
    "zhuyin": "ㄔ",
    "clue": "他是一個郵（　）。",
    "searchWord": "郵癡"
  },
  {
    "char": "痴",
    "zhuyin": "ㄔ",
    "clue": "看他（　）迷的模樣。",
    "searchWord": "痴迷"
  },
  {
    "char": "嗤",
    "zhuyin": "ㄔ",
    "clue": "大家（　）之以鼻。",
    "searchWord": "嗤之以鼻"
  },
  {
    "char": "蚩",
    "zhuyin": "ㄔ",
    "clue": "黃帝與（　）尤大戰。",
    "searchWord": "蚩尤"
  },
  {
    "char": "笞",
    "zhuyin": "ㄔ",
    "clue": "法庭用鞭（　）之刑。",
    "searchWord": "鞭笞"
  },
  {
    "char": "疵",
    "zhuyin": "ㄘ",
    "clue": "衣服有小瑕（　）。",
    "searchWord": "瑕疵"
  },
  {
    "char": "雌",
    "zhuyin": "ㄘ",
    "clue": "這是一隻（　）鳥。",
    "searchWord": "雌鳥"
  },
  {
    "char": "茨",
    "zhuyin": "ㄘ",
    "clue": "茅（　）草屋是住所。",
    "searchWord": "茅茨"
  },
  {
    "char": "慈",
    "zhuyin": "ㄘˊ",
    "clue": "（　）祥的母親看著我。",
    "searchWord": "慈祥"
  },
  {
    "char": "磁",
    "zhuyin": "ㄘˊ",
    "clue": "（　）鐵能吸引鐵。",
    "searchWord": "磁鐵"
  },
  {
    "char": "詞",
    "zhuyin": "ㄘˊ",
    "clue": "（　）寫得非常感人。",
    "searchWord": "歌詞"
  },
  {
    "char": "辭",
    "zhuyin": "ㄘˊ",
    "clue": "決定（　）去工作。",
    "searchWord": "辭去"
  },
  {
    "char": "祠",
    "zhuyin": "ㄘˊ",
    "clue": "到宗（　）祭拜祖先。",
    "searchWord": "宗祠"
  },
  {
    "char": "賜",
    "zhuyin": "ㄙˋ",
    "clue": "感謝上天賞（　）。",
    "searchWord": "賞賜"
  },
  {
    "char": "伺",
    "zhuyin": "ㄙˋ",
    "clue": "歹徒（　）機而動。",
    "searchWord": "伺機"
  },
  {
    "char": "肆",
    "zhuyin": "ㄙˋ",
    "clue": "大（　）宣傳此事。",
    "searchWord": "大肆"
  },
  {
    "char": "寺",
    "zhuyin": "ㄙˋ",
    "clue": "深山古（　）香火旺。",
    "searchWord": "古寺"
  },
  {
    "char": "嗣",
    "zhuyin": "ㄙˋ",
    "clue": "他是唯一的後（　）。",
    "searchWord": "後嗣"
  },
  {
    "char": "飼",
    "zhuyin": "ㄙˋ",
    "clue": "用牧草（　）養牛群。",
    "searchWord": "飼養"
  },
  {
    "char": "巳",
    "zhuyin": "ㄙˋ",
    "clue": "地支有（　）字。",
    "searchWord": "巳"
  },
  {
    "char": "已",
    "zhuyin": "ㄧˇ",
    "clue": "事情（　）經無可挽回。",
    "searchWord": "已經"
  },
  {
    "char": "己",
    "zhuyin": "ㄐㄧˇ",
    "clue": "做人要克（　）復禮。",
    "searchWord": "克己"
  },
  {
    "char": "導",
    "zhuyin": "ㄉㄠˇ",
    "clue": "（　）遊解說詳盡。",
    "searchWord": "導遊"
  },
  {
    "char": "倒",
    "zhuyin": "ㄉㄠˇ",
    "clue": "排山（　）海的力量。",
    "searchWord": "排山倒海"
  },
  {
    "char": "島",
    "zhuyin": "ㄉㄠˇ",
    "clue": "台灣是寶（　）。",
    "searchWord": "寶島"
  },
  {
    "char": "搗",
    "zhuyin": "ㄉㄠˇ",
    "clue": "在課堂上（　）蛋。",
    "searchWord": "搗蛋"
  },
  {
    "char": "稻",
    "zhuyin": "ㄉㄠˋ",
    "clue": "金黃的（　）穗擺動。",
    "searchWord": "稻穗"
  },
  {
    "char": "盜",
    "zhuyin": "ㄉㄠˋ",
    "clue": "遭遇強（　）搶劫。",
    "searchWord": "強盜"
  },
  {
    "char": "道",
    "zhuyin": "ㄉㄠˋ",
    "clue": "做人講（　）義。",
    "searchWord": "道義"
  },
  {
    "char": "悼",
    "zhuyin": "ㄉㄠˋ",
    "clue": "哀（　）受難者。",
    "searchWord": "哀悼"
  },
  {
    "char": "蹈",
    "zhuyin": "ㄉㄠˋ",
    "clue": "她的舞（　）優美。",
    "searchWord": "舞蹈"
  },
  {
    "char": "叨",
    "zhuyin": "ㄉㄠ",
    "clue": "嘮（　）個不停。",
    "searchWord": "嘮叨"
  },
  {
    "char": "饕",
    "zhuyin": "ㄊㄠ",
    "clue": "許多（　）餮食客。",
    "searchWord": "饕餮"
  },
  {
    "char": "滔",
    "zhuyin": "ㄊㄠ",
    "clue": "黃河之水（　）（　）不絕。",
    "searchWord": "滔滔不絕"
  },
  {
    "char": "濤",
    "zhuyin": "ㄊㄠ",
    "clue": "驚（　）駭浪的場面。",
    "searchWord": "驚濤駭浪"
  },
  {
    "char": "掏",
    "zhuyin": "ㄊㄠ",
    "clue": "（　）出百元鈔票。",
    "searchWord": "掏出"
  },
  {
    "char": "逃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "小偷拔腿（　）跑。",
    "searchWord": "逃跑"
  },
  {
    "char": "桃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "花園裡（　）花盛開。",
    "searchWord": "桃花"
  },
  {
    "char": "陶",
    "zhuyin": "ㄊㄠˊ",
    "clue": "這件（　）瓷是藝術品。",
    "searchWord": "陶瓷"
  },
  {
    "char": "淘",
    "zhuyin": "ㄊㄠˊ",
    "clue": "男孩很（　）氣。",
    "searchWord": "淘氣"
  },
  {
    "char": "討",
    "zhuyin": "ㄊㄠˇ",
    "clue": "深入探（　）問題。",
    "searchWord": "探討"
  },
  {
    "char": "套",
    "zhuyin": "ㄊㄠˋ",
    "clue": "這（　）西裝很合身。",
    "searchWord": "套裝"
  },
  {
    "char": "慟",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他哀（　）萬分。",
    "searchWord": "哀慟"
  },
  {
    "char": "痛",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他頭（　）欲裂。",
    "searchWord": "頭痛"
  },
  {
    "char": "同",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "我們在（　）班上課。",
    "searchWord": "同班"
  },
  {
    "char": "銅",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "青（　）雕像很莊嚴。",
    "searchWord": "青銅"
  },
  {
    "char": "桐",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "油（　）花盛開。",
    "searchWord": "油桐花"
  },
  {
    "char": "筒",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "丟進垃圾（　）中。",
    "searchWord": "垃圾筒"
  },
  {
    "char": "統",
    "zhuyin": "ㄊㄨㄥˇ",
    "clue": "（　）籌防疫資源。",
    "searchWord": "統籌"
  },
  {
    "char": "通",
    "zhuyin": "ㄊㄨㄥ",
    "clue": "四（　）八達的交通。",
    "searchWord": "四通八達"
  },
  {
    "char": "贅",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "文章（　）字太多。",
    "searchWord": "贅字"
  },
  {
    "char": "椎",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "他的脊（　）受損。",
    "searchWord": "脊椎"
  },
  {
    "char": "錐",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "生產圓（　）形鋼模。",
    "searchWord": "圓錐"
  },
  {
    "char": "墜",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "流星（　）落山頭。",
    "searchWord": "墜落"
  },
  {
    "char": "追",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "警察（　）捕搶匪。",
    "searchWord": "追捕"
  },
  {
    "char": "拙",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "口齒笨（　）。",
    "searchWord": "笨拙"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "立刻（　）手辦理。",
    "searchWord": "著手"
  },
  {
    "char": "琢",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "精雕細（　）出美玉。",
    "searchWord": "精雕細琢"
  },
  {
    "char": "卓",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "取得（　）越成就。",
    "searchWord": "卓越"
  },
  {
    "char": "濯",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "出淤泥而（　）清漣。",
    "searchWord": "濯清漣"
  },
  {
    "char": "灼",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "發表真知（　）見。",
    "searchWord": "真知灼見"
  },
  {
    "char": "酌",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "反覆斟（　）決定。",
    "searchWord": "斟酌"
  },
  {
    "char": "濁",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "溪水十分混（　）。",
    "searchWord": "混濁"
  },
  {
    "char": "抉",
    "zhuyin": "ㄐㄩㄝˊ",
    "clue": "面臨人生的（　）擇。",
    "searchWord": "抉擇"
  },
  {
    "char": "既",
    "zhuyin": "ㄐㄧˋ",
    "clue": "（　）往不咎的態度。",
    "searchWord": "既往不咎"
  },
  {
    "char": "躁",
    "zhuyin": "ㄗㄠˋ",
    "clue": "千萬不要暴（　）。",
    "searchWord": "暴躁"
  },
  {
    "char": "頃",
    "zhuyin": "ㄑㄧㄥˇ",
    "clue": "（　）刻之間下起暴雨。",
    "searchWord": "頃刻"
  },
  {
    "char": "傾",
    "zhuyin": "ㄑㄧㄥ",
    "clue": "下起（　）盆大雨。",
    "searchWord": "傾盆大雨"
  },
  {
    "char": "韁",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "宛如脫（　）野馬。",
    "searchWord": "脫韁野馬"
  },
  {
    "char": "鰈",
    "zhuyin": "ㄉㄧㄝˊ",
    "clue": "他們鶼（　）情深。",
    "searchWord": "鶼鰈情深"
  },
  {
    "char": "蒂",
    "zhuyin": "ㄉㄧˋ",
    "clue": "觀念根深（　）固。",
    "searchWord": "根深蒂固"
  },
  {
    "char": "懦",
    "zhuyin": "ㄋㄨㄛˋ",
    "clue": "絕不能軟（　）。",
    "searchWord": "懦弱"
  },
  {
    "char": "顢",
    "zhuyin": "ㄇㄢˊ",
    "clue": "官員辦事（　）頇。",
    "searchWord": "顢頇"
  },
  {
    "char": "頇",
    "zhuyin": "ㄏㄢ",
    "clue": "辦事顢（　）惹怒大眾。",
    "searchWord": "顢頇"
  },
  {
    "char": "姍",
    "zhuyin": "ㄕㄢ",
    "clue": "主角（　）（　）來遲。",
    "searchWord": "姍姍來遲"
  },
  {
    "char": "惴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "他整天（　）（　）不安。",
    "searchWord": "惴惴不安"
  },
  {
    "char": "揣",
    "zhuyin": "ㄔㄨㄞˇ",
    "clue": "難以（　）摩大師心思。",
    "searchWord": "揣摩"
  },
  {
    "char": "馳",
    "zhuyin": "ㄔˊ",
    "clue": "跑車風（　）電掣。",
    "searchWord": "風馳電掣"
  },
  {
    "char": "畫",
    "zhuyin": "ㄏㄨㄚˋ",
    "clue": "（　）蛇添足",
    "searchWord": "畫蛇添足"
  },
  {
    "char": "守",
    "zhuyin": "ㄕㄡˇ",
    "clue": "（　）株待兔",
    "searchWord": "守株待兔"
  },
  {
    "char": "補",
    "zhuyin": "ㄅㄨˇ",
    "clue": "亡羊（　）牢十分要緊。",
    "searchWord": "亡羊補牢"
  },
  {
    "char": "矛",
    "zhuyin": "ㄇㄠˊ",
    "clue": "自相（　）盾",
    "searchWord": "自相矛盾"
  },
  {
    "char": "求",
    "zhuyin": "ㄑㄧㄡˊ",
    "clue": "刻舟（　）劍",
    "searchWord": "刻舟求劍"
  },
  {
    "char": "假",
    "zhuyin": "ㄐㄧㄚˇ",
    "clue": "狐（　）虎威",
    "searchWord": "狐假虎威"
  },
  {
    "char": "之",
    "zhuyin": "ㄓ",
    "clue": "驚弓（　）鳥",
    "searchWord": "驚弓之鳥"
  },
  {
    "char": "之",
    "zhuyin": "ㄓ",
    "clue": "井底（　）蛙",
    "searchWord": "井底之蛙"
  },
  {
    "char": "雙",
    "zhuyin": "ㄕㄨㄤ",
    "clue": "一箭（　）雕",
    "searchWord": "一箭雙雕"
  },
  {
    "char": "途",
    "zhuyin": "ㄊㄨˊ",
    "clue": "半（　）而廢",
    "searchWord": "半途而廢"
  },
  {
    "char": "忘",
    "zhuyin": "ㄨㄤˋ",
    "clue": "得意（　）形",
    "searchWord": "得意忘形"
  },
  {
    "char": "彈",
    "zhuyin": "ㄉㄢˋ",
    "clue": "對牛（　）琴",
    "searchWord": "對牛彈琴"
  },
  {
    "char": "吹",
    "zhuyin": "ㄔㄨㄟ",
    "clue": "風（　）草動",
    "searchWord": "風吹草動"
  },
  {
    "char": "言",
    "zhuyin": "ㄧㄢˊ",
    "clue": "花（　）巧語",
    "searchWord": "花言巧語"
  },
  {
    "char": "充",
    "zhuyin": "ㄔㄨㄥ",
    "clue": "畫餅（　）飢",
    "searchWord": "畫餅充飢"
  },
  {
    "char": "犬",
    "zhuyin": "ㄑㄩㄢˇ",
    "clue": "雞（　）不寧",
    "searchWord": "雞犬不寧"
  },
  {
    "char": "是",
    "zhuyin": "ㄕˋ",
    "clue": "口（　）心非",
    "searchWord": "口是心非"
  },
  {
    "char": "下",
    "zhuyin": "ㄒㄧㄚˋ",
    "clue": "落井（　）石",
    "searchWord": "落井下石"
  },
  {
    "char": "苗",
    "zhuyin": "ㄇㄧㄠˊ",
    "clue": "揠（　）助長",
    "searchWord": "揠苗助長"
  },
  {
    "char": "魚",
    "zhuyin": "ㄩˊ",
    "clue": "如（　）得水",
    "searchWord": "如魚得水"
  },
  {
    "char": "落",
    "zhuyin": "ㄌㄨㄛˋ",
    "clue": "水（　）石出",
    "searchWord": "水落石出"
  },
  {
    "char": "共",
    "zhuyin": "ㄍㄨㄥˋ",
    "clue": "同甘（　）苦",
    "searchWord": "同甘共苦"
  },
  {
    "char": "歸",
    "zhuyin": "ㄍㄨㄟ",
    "clue": "完璧（　）趙",
    "searchWord": "完璧歸趙"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "雪中（　）炭",
    "searchWord": "雪中送炭"
  },
  {
    "char": "鹿",
    "zhuyin": "ㄌㄨˋ",
    "clue": "指（　）為馬",
    "searchWord": "指鹿為馬"
  },
  {
    "char": "上",
    "zhuyin": "ㄕㄤˋ",
    "clue": "紙（　）談兵",
    "searchWord": "紙上談兵"
  },
  {
    "char": "三",
    "zhuyin": "ㄙㄢ",
    "clue": "朝（　）暮四",
    "searchWord": "朝三暮四"
  },
  {
    "char": "暴",
    "zhuyin": "ㄅㄠˋ",
    "clue": "自（　）自棄",
    "searchWord": "自暴自棄"
  },
  {
    "char": "錘",
    "zhuyin": "ㄔㄨㄟˊ",
    "clue": "千（　）百煉",
    "searchWord": "千錘百煉"
  },
  {
    "char": "木",
    "zhuyin": "ㄇㄨˋ",
    "clue": "入（　）三分",
    "searchWord": "入木三分"
  },
  {
    "char": "裡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "百（　）挑一",
    "searchWord": "百裡挑一"
  },
  {
    "char": "有",
    "zhuyin": "ㄧㄡˇ",
    "clue": "胸（　）成竹",
    "searchWord": "胸有成竹"
  },
  {
    "char": "客",
    "zhuyin": "ㄎㄜˋ",
    "clue": "不速之（　）",
    "searchWord": "不速之客"
  },
  {
    "char": "應",
    "zhuyin": "ㄧㄥˋ",
    "clue": "供不（　）求",
    "searchWord": "供不應求"
  },
  {
    "char": "義",
    "zhuyin": "ㄧˋ",
    "clue": "忘恩負（　）",
    "searchWord": "忘恩負義"
  },
  {
    "char": "會",
    "zhuyin": "ㄏㄨㄟˋ",
    "clue": "聚精（　）神",
    "searchWord": "聚精會神"
  },
  {
    "char": "見",
    "zhuyin": "ㄐㄧㄢˋ",
    "clue": "重（　）天日",
    "searchWord": "重見天日"
  },
  {
    "char": "&",
    "zhuyin": "ㄆㄧㄢ",
    "clue": "千（　）一律",
    "searchWord": "千篇一律"
  },
  {
    "char": "其",
    "zhuyin": "ㄑㄧˊ",
    "clue": "莫名（　）妙",
    "searchWord": "莫名其妙"
  },
  {
    "char": "袖",
    "zhuyin": "ㄒㄧㄡˋ",
    "clue": "兩（　）清風",
    "searchWord": "兩袖清風"
  },
  {
    "char": "再",
    "zhuyin": "ㄗㄞˋ",
    "clue": "東山（　）起",
    "searchWord": "東山再起"
  },
  {
    "char": "沉",
    "zhuyin": "ㄔㄣˊ",
    "clue": "石（　）大海",
    "searchWord": "石沉大海"
  },
  {
    "char": "為",
    "zhuyin": "ㄨㄟˊ",
    "clue": "助人（　）樂",
    "searchWord": "助人為樂"
  },
  {
    "char": "尤",
    "zhuyin": "ㄧㄡˊ",
    "clue": "怨天（　）人",
    "searchWord": "怨天尤人"
  },
  {
    "char": "立",
    "zhuyin": "ㄌㄧˋ",
    "clue": "頂天（　）地",
    "searchWord": "頂天立地"
  },
  {
    "char": "無",
    "zhuyin": "ㄨˊ",
    "clue": "啞口（　）言",
    "searchWord": "啞口無言"
  },
  {
    "char": "心",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "三（　）二意",
    "searchWord": "三心二意"
  },
  {
    "char": "大",
    "zhuyin": "ㄉㄚˋ",
    "clue": "粗心（　）意",
    "searchWord": "粗心大意"
  },
  {
    "char": "新",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "日（　）月異",
    "searchWord": "日新月異"
  },
  {
    "char": "貫",
    "zhuyin": "ㄍㄨㄢˋ",
    "clue": "如雷（　）耳",
    "searchWord": "如雷貫耳"
  },
  {
    "char": "喧",
    "zhuyin": "ㄒㄨㄢ",
    "clue": "請勿大聲（　）嘩。",
    "searchWord": "喧嘩"
  },
  {
    "char": "寒",
    "zhuyin": "ㄏㄢˊ",
    "clue": "見面（　）暄幾句。",
    "searchWord": "寒暄"
  },
  {
    "char": "暄",
    "zhuyin": "ㄒㄨㄢ",
    "clue": "見面寒（　）幾句。",
    "searchWord": "寒暄"
  },
  {
    "char": "券",
    "zhuyin": "ㄑㄩㄢˋ",
    "clue": "入場（　）已售完。",
    "searchWord": "入場券"
  },
  {
    "char": "卷",
    "zhuyin": "ㄐㄩㄢˋ",
    "clue": "手不釋（　）讀好書。",
    "searchWord": "手不釋卷"
  },
  {
    "char": "卷",
    "zhuyin": "ㄐㄩㄢˋ",
    "clue": "這張試（　）非常簡單。",
    "searchWord": "試卷"
  },
  {
    "char": "券",
    "zhuyin": "ㄑㄩㄢˋ",
    "clue": "使用優待（　）可打折。",
    "searchWord": "優待券"
  },
  {
    "char": "馨",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "享受溫（　）家庭生活。",
    "searchWord": "溫馨"
  },
  {
    "char": "馨",
    "zhuyin": "ㄒㄧㄣ",
    "clue": "花園裡（　）香四溢。",
    "searchWord": "馨香"
  },
  {
    "char": "轄",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "他的管（　）區域廣闊。",
    "searchWord": "管轄"
  },
  {
    "char": "艙",
    "zhuyin": "ㄘㄤ",
    "clue": "飛機客（　）很安靜。",
    "searchWord": "客艙"
  },
  {
    "char": "艙",
    "zhuyin": "ㄘㄤ",
    "clue": "把行李放進貨（　）。",
    "searchWord": "貨艙"
  },
  {
    "char": "僵",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "談判（　）持不下。",
    "searchWord": "僵持"
  },
  {
    "char": "僵",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "天冷肌肉容易（　）硬。",
    "searchWord": "僵硬"
  },
  {
    "char": "槳",
    "zhuyin": "ㄐㄧㄤˇ",
    "clue": "雙手划（　）前進。",
    "searchWord": "划槳"
  },
  {
    "char": "瞞",
    "zhuyin": "ㄇㄢˊ",
    "clue": "不能隱（　）事實真相。",
    "searchWord": "隱瞞"
  },
  {
    "char": "瞞",
    "zhuyin": "ㄇㄢˊ",
    "clue": "欺（　）是錯誤的行為。",
    "searchWord": "欺瞞"
  },
  {
    "char": "崇",
    "zhuyin": "ㄔㄨㄥˊ",
    "clue": "有著（　）高的理想。",
    "searchWord": "崇高"
  },
  {
    "char": "崇",
    "zhuyin": "ㄔㄨㄥˊ",
    "clue": "大家十分推（　）他。",
    "searchWord": "推崇"
  },
  {
    "char": "竣",
    "zhuyin": "ㄐㄩㄣˋ",
    "clue": "工程已完（　）驗收。",
    "searchWord": "完竣"
  },
  {
    "char": "毅",
    "zhuyin": "ㄧˋ",
    "clue": "做事要有恆心和毅（　）。",
    "searchWord": "毅力"
  },
  {
    "char": "毅",
    "zhuyin": "ㄧˋ",
    "clue": "（　）然決然地做出決定。",
    "searchWord": "毅然決然"
  },
  {
    "char": "瞻",
    "zhuyin": "ㄓㄢ",
    "clue": "高瞻遠（　）的眼光。",
    "searchWord": "高瞻遠矚"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "高瞻遠（　）的眼光。",
    "searchWord": "高瞻遠矚"
  },
  {
    "char": "緻",
    "zhuyin": "ㄓˋ",
    "clue": "這件刺繡非常精（　）。",
    "searchWord": "精緻"
  },
  {
    "char": "製",
    "zhuyin": "ㄓˋ",
    "clue": "這款手機是台灣（　）造。",
    "searchWord": "台灣製造"
  },
  {
    "char": "質",
    "zhuyin": "ㄓˊ",
    "clue": "這家餐廳的服務品（　）很好。",
    "searchWord": "品質"
  },
  {
    "char": "執",
    "zhuyin": "ㄓˊ",
    "clue": "（　）迷不悟的態度。",
    "searchWord": "執迷不悟"
  },
  {
    "char": "執",
    "zhuyin": "ㄓˊ",
    "clue": "（　）子之手，與子偕老。",
    "searchWord": "執子之手"
  },
  {
    "char": "摯",
    "zhuyin": "ㄓˋ",
    "clue": "他是我的真（　）好友。",
    "searchWord": "真摯"
  },
  {
    "char": "置",
    "zhuyin": "ㄓˋ",
    "clue": "對這件事置（　）不理。",
    "searchWord": "置之不理"
  },
  {
    "char": "置",
    "zhuyin": "ㄓˋ",
    "clue": "（　）之死地而後生。",
    "searchWord": "置之死地"
  },
  {
    "char": "稚",
    "zhuyin": "ㄓˋ",
    "clue": "他的想法太過（　）嫩。",
    "searchWord": "稚嫩"
  },
  {
    "char": "致",
    "zhuyin": "ㄓˋ",
    "clue": "向大家（　）上最誠摯謝意。",
    "searchWord": "致謝"
  },
  {
    "char": "秩",
    "zhuyin": "ㄓˋ",
    "clue": "維護會場（　）序。",
    "searchWord": "秩序"
  },
  {
    "char": "志",
    "zhuyin": "ㄓˋ",
    "clue": "人各有（　）不能強求。",
    "searchWord": "人各有志"
  },
  {
    "char": "滯",
    "zhuyin": "ㄓˋ",
    "clue": "商品（　）銷庫存嚴重。",
    "searchWord": "滯銷"
  },
  {
    "char": "智",
    "zhuyin": "ㄓˋ",
    "clue": "這是一個（　）慧的選擇。",
    "searchWord": "智慧"
  },
  {
    "char": "幟",
    "zhuyin": "ㄓˋ",
    "clue": "獨樹一（　）的風格。",
    "searchWord": "獨樹一幟"
  },
  {
    "char": "治",
    "zhuyin": "ㄓˋ",
    "clue": "生病要及時醫（　）。",
    "searchWord": "醫治"
  },
  {
    "char": "帙",
    "zhuyin": "ㄓˋ",
    "clue": "這部巨著共分十（　）。",
    "searchWord": "帙"
  },
  {
    "char": "櫛",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "整天（　）風沐雨很辛苦。",
    "searchWord": "櫛風沐雨"
  },
  {
    "char": "疾",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）惡如仇的性格。",
    "searchWord": "疾惡如仇"
  },
  {
    "char": "忌",
    "zhuyin": "ㄐㄧˋ",
    "clue": "肆無忌（　）的行為。",
    "searchWord": "肆無忌憚"
  },
  {
    "char": "憚",
    "zhuyin": "ㄉㄢˋ",
    "clue": "肆無忌（　）的行為。",
    "searchWord": "肆無忌憚"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "披荊斬（　）開闢道路。",
    "searchWord": "披荊斬棘"
  },
  {
    "char": "即",
    "zhuyin": "ㄐㄧˊ",
    "clue": "若（　）若離的關係。",
    "searchWord": "若即若離"
  },
  {
    "char": "及",
    "zhuyin": "ㄐㄧˊ",
    "clue": "後悔莫（　）的決定。",
    "searchWord": "後悔莫及"
  },
  {
    "char": "急",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）功近利的作風。",
    "searchWord": "急功近利"
  },
  {
    "char": "吉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "趨（　）避凶的本能。",
    "searchWord": "趨吉避凶"
  },
  {
    "char": "脊",
    "zhuyin": "ㄐㄧˇ",
    "clue": "凍得（　）背發涼。",
    "searchWord": "脊背"
  },
  {
    "char": "嫉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）賢妒能的心態。",
    "searchWord": "嫉賢妒能"
  },
  {
    "char": "集",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）思廣益以求良策。",
    "searchWord": "集思廣益"
  },
  {
    "char": "寂",
    "zhuyin": "ㄐㄧˋ",
    "clue": "耐得住（　）寞才能成功。",
    "searchWord": "寂寞"
  },
  {
    "char": "ㄐㄧˋ",
    "clue": "百年大（　）教育為本。",
    "searchWord": "百年大計"
  },
  {
    "char": "季",
    "zhuyin": "ㄐㄧˋ",
    "clue": "一年四季（　）的變化。",
    "searchWord": "四季"
  },
  {
    "char": "冀",
    "zhuyin": "ㄐㄧˋ",
    "clue": "寄（　）厚望的眼神。",
    "searchWord": "寄予厚望"
  },
  {
    "char": "既",
    "zhuyin": "ㄐㄧˋ",
    "clue": "（　）得利益者的阻礙。",
    "searchWord": "既得利益"
  },
  {
    "char": "祭",
    "zhuyin": "ㄐㄧˋ",
    "clue": "村民舉行（　）祀典禮。",
    "searchWord": "祭祀"
  },
  {
    "char": "技",
    "zhuyin": "ㄐㄧˋ",
    "clue": "黔驢（　）窮的尷尬局面。",
    "searchWord": "黔驢技窮"
  },
  {
    "char": "繼",
    "zhuyin": "ㄐㄧˋ",
    "clue": "前仆後（　）地奮鬥。",
    "searchWord": "前仆後繼"
  },
  {
    "char": "績",
    "zhuyin": "ㄐㄧˋ",
    "clue": "創下輝煌的戰（　）。",
    "searchWord": "戰績"
  },
  {
    "char": "寄",
    "zhuyin": "ㄐㄧˋ",
    "clue": "將信（　）給遠方的朋友。",
    "searchWord": "寄信"
  },
  {
    "char": "跡",
    "zhuyin": "ㄐㄧˋ",
    "clue": "消聲匿（　）的隱士。",
    "searchWord": "消聲匿跡"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）題發揮的行為。",
    "searchWord": "藉題發揮"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "保留原來的國（　）。",
    "searchWord": "國籍"
  },
  {
    "char": "羈",
    "zhuyin": "ㄐㄧ",
    "clue": "不受 any 羈（　）的自由。",
    "searchWord": "羈絆"
  },
  {
    "char": "基",
    "zhuyin": "ㄐㄧ",
    "clue": "奠定良好的（　）礎。",
    "searchWord": "基礎"
  },
  {
    "char": "機",
    "zhuyin": "ㄐㄧ",
    "clue": "把握難得的時（　）。",
    "searchWord": "時機"
  },
  {
    "char": "積",
    "zhuyin": "ㄐㄧ",
    "clue": "日（　）月累的成果。",
    "searchWord": "日積月累"
  },
  {
    "char": "極",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）樂世界的傳說。",
    "searchWord": "極樂世界"
  },
  {
    "char": "吉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "（　）人天相的祝福。",
    "searchWord": "吉人天相"
  },
  {
    "char": "及",
    "zhuyin": "ㄐㄧˊ",
    "clue": "及時雨（　）下得很及時。",
    "searchWord": "及時雨"
  },
  {
    "char": "幾",
    "zhuyin": "ㄐㄧˇ",
    "clue": "（　）乎快完成了。",
    "searchWord": "幾乎"
  },
  {
    "char": "記",
    "zhuyin": "ㄐㄧˋ",
    "clue": "好好（　）住這堂課。",
    "searchWord": "記住"
  },
  {
    "char": "忌",
    "zhuyin": "ㄐㄧˋ",
    "clue": "切（　）急躁行事。",
    "searchWord": "切忌"
  },
  {
    "char": "牛",
    "zhuyin": "ㄋㄧㄡˊ",
    "clue": "對（　）彈琴是白費力氣。",
    "searchWord": "對牛彈琴"
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "clue": "這座（　）林樹木茂密。",
    "searchWord": "山林"
  },
  {
    "char": "水",
    "zhuyin": "ㄕㄨㄟˇ",
    "clue": "這杯（　）非常純淨。",
    "searchWord": "純淨水"
  },
  {
    "char": "天",
    "zhuyin": "ㄊㄧㄢ",
    "clue": "今天的（　）氣真好。",
    "searchWord": "天氣"
  },
  {
    "char": "地",
    "zhuyin": "ㄉㄧˋ",
    "clue": "這片（　）板很乾淨。",
    "searchWord": "地板"
  },
  {
    "char": "人",
    "zhuyin": "ㄖㄣˊ",
    "clue": "他是個好（　）。",
    "searchWord": "好人"
  },
  {
    "char": "學",
    "zhuyin": "ㄒㄩㄝˊ",
    "clue": "他是個熱愛（　）習的人。",
    "searchWord": "學習"
  },
  {
    "char": "校",
    "zhuyin": "ㄒㄧㄠˋ",
    "clue": "這所學（　）非常美麗。",
    "searchWord": "學校"
  },
  {
    "char": "師",
    "zhuyin": "ㄕ",
    "clue": "他是一位優秀的老（　）。",
    "searchWord": "老師"
  },
  {
    "char": "友",
    "zhuyin": "ㄧㄡˇ",
    "clue": "他是值得信賴的朋（　）。",
    "searchWord": "朋友"
  },
  {
    "char": "愛",
    "zhuyin": "ㄞˋ",
    "clue": "媽媽很（　）我。",
    "searchWord": "愛護"
  },
  {
    "char": "家",
    "zhuyin": "ㄐㄧ合",
    "clue": "這是我溫暖的（　）。",
    "searchWord": "家庭"
  },
  {
    "char": "鄉",
    "zhuyin": "ㄒㄧㄤ",
    "clue": "美麗的故（　）在南方。",
    "searchWord": "故鄉"
  },
  {
    "char": "路",
    "zhuyin": "ㄌㄨˋ",
    "clue": "這條（　）非常平坦。",
    "searchWord": "道路"
  },
  {
    "char": "車",
    "zhuyin": "ㄔㄜ",
    "clue": "路上的（　）輛很多。",
    "searchWord": "車輛"
  },
  {
    "char": "書",
    "zhuyin": "ㄕㄨ",
    "clue": "這本（　）內容很精彩。",
    "searchWord": "書籍"
  },
  {
    "char": "筆",
    "zhuyin": "ㄅㄧˇ",
    "clue": "這支（　）寫字很順暢。",
    "searchWord": "鉛筆"
  },
  {
    "char": "紙",
    "zhuyin": "ㄓˇ",
    "clue": "請在一張（　）上寫字。",
    "searchWord": "白紙"
  },
  {
    "char": "字",
    "zhuyin": "ㄗˋ",
    "clue": "他的（　）體很端正。",
    "searchWord": "字體"
  },
  {
    "char": "話",
    "zhuyin": "ㄏㄨㄚˋ",
    "clue": "他說的（　）非常有道理。",
    "searchWord": "說話"
  },
  {
    "char": "歌",
    "zhuyin": "ㄍㄜ",
    "clue": "這首（　）曲非常動聽。",
    "searchWord": "歌曲"
  },
  {
    "char": "圖",
    "zhuyin": "ㄊㄨˊ",
    "clue": "這幅（　）畫色彩鮮艷。",
    "searchWord": "圖畫"
  },
  {
    "char": "影",
    "zhuyin": "ㄧㄥˇ",
    "clue": "這部電（　）非常感人。",
    "searchWord": "電影"
  },
  {
    "char": "音",
    "zhuyin": "ㄧㄣ",
    "clue": "這首樂曲的（　）色優美。",
    "searchWord": "音樂"
  },
  {
    "char": "色",
    "zhuyin": "ㄙㄜˋ",
    "clue": "這件衣服的顏（　）很鮮艷。",
    "searchWord": "顏色"
  },
  {
    "char": "花",
    "zhuyin": "ㄏㄨㄚ",
    "clue": "花園裡的（　）朵盛開。",
    "searchWord": "花朵"
  },
  {
    "char": "草",
    "zhuyin": "ㄘㄠˇ",
    "clue": "綠油油的（　）地。",
    "searchWord": "草地"
  },
  {
    "char": "木",
    "zhuyin": "ㄇㄨˋ",
    "clue": "森林裡的樹（　）很高大。",
    "searchWord": "樹木"
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "clue": "這座高（　）雄偉壯麗。",
    "searchWord": "高山"
  },
  {
    "char": "河",
    "zhuyin": "ㄏㄜˊ",
    "clue": "這條（　）流非常清澈。",
    "searchWord": "河流"
  },
  {
    "char": "海",
    "zhuyin": "ㄏㄞˇ",
    "clue": "遼闊的大（　）無邊無際。",
    "searchWord": "大海"
  }
];


// 一字千金字字珠璣題庫 - 預先準備的 100 題超豐富題庫
const CHARACTER_CROSSWORD_POOL = [
  {
    "char": "海",
    "zhuyin": "ㄏㄞˇ",
    "searchWord": "海馬",
    "surrounding": [
      {
        "char": "腦",
        "pos": "before"
      },
      {
        "char": "外",
        "pos": "before"
      },
      {
        "char": "馬",
        "pos": "after"
      },
      {
        "char": "女",
        "pos": "after"
      }
    ]
  },
  {
    "char": "機",
    "zhuyin": "ㄐㄧ",
    "searchWord": "機會",
    "surrounding": [
      {
        "char": "手",
        "pos": "before"
      },
      {
        "char": "飛",
        "pos": "before"
      },
      {
        "char": "車",
        "pos": "after"
      },
      {
        "char": "會",
        "pos": "after"
      }
    ]
  },
  {
    "char": "天",
    "zhuyin": "ㄊㄧㄢ",
    "searchWord": "天空",
    "surrounding": [
      {
        "char": "今",
        "pos": "before"
      },
      {
        "char": "明",
        "pos": "before"
      },
      {
        "char": "氣",
        "pos": "after"
      },
      {
        "char": "空",
        "pos": "after"
      }
    ]
  },
  {
    "char": "風",
    "zhuyin": "ㄈㄥ",
    "searchWord": "風景",
    "surrounding": [
      {
        "char": "颱",
        "pos": "before"
      },
      {
        "char": "微",
        "pos": "before"
      },
      {
        "char": "雨",
        "pos": "after"
      },
      {
        "char": "景",
        "pos": "after"
      }
    ]
  },
  {
    "char": "心",
    "zhuyin": "ㄒㄧㄣ",
    "searchWord": "心理",
    "surrounding": [
      {
        "char": "開",
        "pos": "before"
      },
      {
        "char": "粗",
        "pos": "before"
      },
      {
        "char": "臟",
        "pos": "after"
      },
      {
        "char": "理",
        "pos": "after"
      }
    ]
  },
  {
    "char": "花",
    "zhuyin": "ㄏㄨㄚ",
    "searchWord": "花園",
    "surrounding": [
      {
        "char": "開",
        "pos": "before"
      },
      {
        "char": "鮮",
        "pos": "before"
      },
      {
        "char": "園",
        "pos": "after"
      },
      {
        "char": "朵",
        "pos": "after"
      }
    ]
  },
  {
    "char": "水",
    "zhuyin": "ㄕㄨㄟˇ",
    "searchWord": "水果",
    "surrounding": [
      {
        "char": "汽",
        "pos": "before"
      },
      {
        "char": "雨",
        "pos": "before"
      },
      {
        "char": "果",
        "pos": "after"
      },
      {
        "char": "庫",
        "pos": "after"
      }
    ]
  },
  {
    "char": "車",
    "zhuyin": "ㄔㄜ",
    "searchWord": "車站",
    "surrounding": [
      {
        "char": "汽",
        "pos": "before"
      },
      {
        "char": "火",
        "pos": "before"
      },
      {
        "char": "站",
        "pos": "after"
      },
      {
        "char": "禍",
        "pos": "after"
      }
    ]
  },
  {
    "char": "人",
    "zhuyin": "ㄖㄣˊ",
    "searchWord": "人口",
    "surrounding": [
      {
        "char": "男",
        "pos": "before"
      },
      {
        "char": "女",
        "pos": "before"
      },
      {
        "char": "群",
        "pos": "after"
      },
      {
        "char": "口",
        "pos": "after"
      }
    ]
  },
  {
    "char": "山",
    "zhuyin": "ㄕㄢ",
    "searchWord": "山路",
    "surrounding": [
      {
        "char": "高",
        "pos": "before"
      },
      {
        "char": "爬",
        "pos": "before"
      },
      {
        "char": "谷",
        "pos": "after"
      },
      {
        "char": "路",
        "pos": "after"
      }
    ]
  },
  {
    "char": "生",
    "zhuyin": "ㄕㄥ",
    "searchWord": "生日",
    "surrounding": [
      {
        "char": "學",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "活",
        "pos": "after"
      },
      {
        "char": "日",
        "pos": "after"
      }
    ]
  },
  {
    "char": "氣",
    "zhuyin": "ㄑㄧˋ",
    "searchWord": "氣球",
    "surrounding": [
      {
        "char": "空",
        "pos": "before"
      },
      {
        "char": "天",
        "pos": "before"
      },
      {
        "char": "溫",
        "pos": "after"
      },
      {
        "char": "球",
        "pos": "after"
      }
    ]
  },
  {
    "char": "力",
    "zhuyin": "ㄌㄧˋ",
    "searchWord": "力氣",
    "surrounding": [
      {
        "char": "用",
        "pos": "before"
      },
      {
        "char": "動",
        "pos": "before"
      },
      {
        "char": "量",
        "pos": "after"
      },
      {
        "char": "氣",
        "pos": "after"
      }
    ]
  },
  {
    "char": "工",
    "zhuyin": "ㄍㄨㄥ",
    "searchWord": "工作",
    "surrounding": [
      {
        "char": "員",
        "pos": "before"
      },
      {
        "char": "手",
        "pos": "before"
      },
      {
        "char": "作",
        "pos": "after"
      },
      {
        "char": "廠",
        "pos": "after"
      }
    ]
  },
  {
    "char": "作",
    "zhuyin": "ㄗㄨㄛˋ",
    "searchWord": "作品",
    "surrounding": [
      {
        "char": "工",
        "pos": "before"
      },
      {
        "char": "寫",
        "pos": "before"
      },
      {
        "char": "品",
        "pos": "after"
      },
      {
        "char": "業",
        "pos": "after"
      }
    ]
  },
  {
    "char": "用",
    "zhuyin": "ㄩㄥˋ",
    "searchWord": "用途",
    "surrounding": [
      {
        "char": "使",
        "pos": "before"
      },
      {
        "char": "利",
        "pos": "before"
      },
      {
        "char": "功",
        "pos": "after"
      },
      {
        "char": "途",
        "pos": "after"
      }
    ]
  },
  {
    "char": "動",
    "zhuyin": "ㄉㄨㄥˋ",
    "searchWord": "動物",
    "surrounding": [
      {
        "char": "運",
        "pos": "before"
      },
      {
        "char": "活",
        "pos": "before"
      },
      {
        "char": "作",
        "pos": "after"
      },
      {
        "char": "物",
        "pos": "after"
      }
    ]
  },
  {
    "char": "物",
    "zhuyin": "ㄨˋ",
    "searchWord": "物價",
    "surrounding": [
      {
        "char": "動",
        "pos": "before"
      },
      {
        "char": "植",
        "pos": "before"
      },
      {
        "char": "品",
        "pos": "after"
      },
      {
        "char": "價",
        "pos": "after"
      }
    ]
  },
  {
    "char": "品",
    "zhuyin": "ㄆㄧㄣˇ",
    "searchWord": "品牌",
    "surrounding": [
      {
        "char": "商",
        "pos": "before"
      },
      {
        "char": "產",
        "pos": "before"
      },
      {
        "char": "質",
        "pos": "after"
      },
      {
        "char": "牌",
        "pos": "after"
      }
    ]
  },
  {
    "char": "家",
    "zhuyin": "ㄐㄧㄚ",
    "searchWord": "家庭",
    "surrounding": [
      {
        "char": "回",
        "pos": "before"
      },
      {
        "char": "國",
        "pos": "before"
      },
      {
        "char": "庭",
        "pos": "after"
      },
      {
        "char": "長",
        "pos": "after"
      }
    ]
  },
  {
    "char": "國",
    "zhuyin": "ㄍㄨㄛˊ",
    "searchWord": "國旗",
    "surrounding": [
      {
        "char": "英",
        "pos": "before"
      },
      {
        "char": "美",
        "pos": "before"
      },
      {
        "char": "家",
        "pos": "after"
      },
      {
        "char": "旗",
        "pos": "after"
      }
    ]
  },
  {
    "char": "民",
    "zhuyin": "ㄇㄧㄣˊ",
    "searchWord": "民意",
    "surrounding": [
      {
        "char": "居",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "族",
        "pos": "after"
      },
      {
        "char": "意",
        "pos": "after"
      }
    ]
  },
  {
    "char": "意",
    "zhuyin": "ㄧˋ",
    "searchWord": "意義",
    "surrounding": [
      {
        "char": "注",
        "pos": "before"
      },
      {
        "char": "同",
        "pos": "before"
      },
      {
        "char": "見",
        "pos": "after"
      },
      {
        "char": "義",
        "pos": "after"
      }
    ]
  },
  {
    "char": "理",
    "zhuyin": "ㄌㄧˇ",
    "searchWord": "理解",
    "surrounding": [
      {
        "char": "合",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "before"
      },
      {
        "char": "由",
        "pos": "after"
      },
      {
        "char": "解",
        "pos": "after"
      }
    ]
  },
  {
    "char": "學",
    "zhuyin": "ㄒㄩㄝˊ",
    "searchWord": "學校",
    "surrounding": [
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "小",
        "pos": "before"
      },
      {
        "char": "生",
        "pos": "after"
      },
      {
        "char": "校",
        "pos": "after"
      }
    ]
  },
  {
    "char": "校",
    "zhuyin": "ㄒㄧㄠˋ",
    "searchWord": "校車",
    "surrounding": [
      {
        "char": "學",
        "pos": "before"
      },
      {
        "char": "母",
        "pos": "before"
      },
      {
        "char": "長",
        "pos": "after"
      },
      {
        "char": "車",
        "pos": "after"
      }
    ]
  },
  {
    "char": "書",
    "zhuyin": "ㄕㄨ",
    "searchWord": "書包",
    "surrounding": [
      {
        "char": "讀",
        "pos": "before"
      },
      {
        "char": "看",
        "pos": "before"
      },
      {
        "char": "籍",
        "pos": "after"
      },
      {
        "char": "包",
        "pos": "after"
      }
    ]
  },
  {
    "char": "包",
    "zhuyin": "ㄅㄠ",
    "searchWord": "包裝",
    "surrounding": [
      {
        "char": "書",
        "pos": "before"
      },
      {
        "char": "皮",
        "pos": "before"
      },
      {
        "char": "子",
        "pos": "after"
      },
      {
        "char": "裝",
        "pos": "after"
      }
    ]
  },
  {
    "char": "子",
    "zhuyin": "ㄗˇ",
    "searchWord": "子女",
    "surrounding": [
      {
        "char": "桌",
        "pos": "before"
      },
      {
        "char": "椅",
        "pos": "before"
      },
      {
        "char": "彈",
        "pos": "after"
      },
      {
        "char": "女",
        "pos": "after"
      }
    ]
  },
  {
    "char": "女",
    "zhuyin": "ㄋㄩˇ",
    "searchWord": "女神",
    "surrounding": [
      {
        "char": "男",
        "pos": "before"
      },
      {
        "char": "婦",
        "pos": "before"
      },
      {
        "char": "兒",
        "pos": "after"
      },
      {
        "char": "神",
        "pos": "after"
      }
    ]
  },
  {
    "char": "兒",
    "zhuyin": "ㄦˊ",
    "searchWord": "兒歌",
    "surrounding": [
      {
        "char": "女",
        "pos": "before"
      },
      {
        "char": "幼",
        "pos": "before"
      },
      {
        "char": "童",
        "pos": "after"
      },
      {
        "char": "歌",
        "pos": "after"
      }
    ]
  },
  {
    "char": "童",
    "zhuyin": "ㄊㄨㄥˊ",
    "searchWord": "童年",
    "surrounding": [
      {
        "char": "兒",
        "pos": "before"
      },
      {
        "char": "神",
        "pos": "before"
      },
      {
        "char": "話",
        "pos": "after"
      },
      {
        "char": "年",
        "pos": "after"
      }
    ]
  },
  {
    "char": "年",
    "zhuyin": "ㄋㄧㄢˊ",
    "searchWord": "年輕",
    "surrounding": [
      {
        "char": "今",
        "pos": "before"
      },
      {
        "char": "明",
        "pos": "before"
      },
      {
        "char": "齡",
        "pos": "after"
      },
      {
        "char": "輕",
        "pos": "after"
      }
    ]
  },
  {
    "char": "輕",
    "zhuyin": "ㄑㄧㄥ",
    "searchWord": "輕易",
    "surrounding": [
      {
        "char": "年",
        "pos": "before"
      },
      {
        "char": "減",
        "pos": "before"
      },
      {
        "char": "快",
        "pos": "after"
      },
      {
        "char": "易",
        "pos": "after"
      }
    ]
  },
  {
    "char": "微",
    "zhuyin": "ㄨㄟˊ",
    "searchWord": "微風",
    "surrounding": [
      {
        "char": "輕",
        "pos": "before"
      },
      {
        "char": "細",
        "pos": "before"
      },
      {
        "char": "笑",
        "pos": "after"
      },
      {
        "char": "風",
        "pos": "after"
      }
    ]
  },
  {
    "char": "笑",
    "zhuyin": "ㄒㄧㄠˋ",
    "searchWord": "笑臉",
    "surrounding": [
      {
        "char": "微",
        "pos": "before"
      },
      {
        "char": "玩",
        "pos": "before"
      },
      {
        "char": "話",
        "pos": "after"
      },
      {
        "char": "臉",
        "pos": "after"
      }
    ]
  },
  {
    "char": "話",
    "zhuyin": "ㄏㄨㄚˋ",
    "searchWord": "話劇",
    "surrounding": [
      {
        "char": "說",
        "pos": "before"
      },
      {
        "char": "笑",
        "pos": "before"
      },
      {
        "char": "題",
        "pos": "after"
      },
      {
        "char": "劇",
        "pos": "after"
      }
    ]
  },
  {
    "char": "題",
    "zhuyin": "ㄊㄧˊ",
    "searchWord": "題庫",
    "surrounding": [
      {
        "char": "問",
        "pos": "before"
      },
      {
        "char": "標",
        "pos": "before"
      },
      {
        "char": "目",
        "pos": "after"
      },
      {
        "char": "庫",
        "pos": "after"
      }
    ]
  },
  {
    "char": "問",
    "zhuyin": "ㄨㄣˋ",
    "searchWord": "問候",
    "surrounding": [
      {
        "char": "提",
        "pos": "before"
      },
      {
        "char": "詢",
        "pos": "before"
      },
      {
        "char": "題",
        "pos": "after"
      },
      {
        "char": "候",
        "pos": "after"
      }
    ]
  },
  {
    "char": "候",
    "zhuyin": "ㄏㄡˋ",
    "searchWord": "候選",
    "surrounding": [
      {
        "char": "時",
        "pos": "before"
      },
      {
        "char": "氣",
        "pos": "before"
      },
      {
        "char": "車",
        "pos": "after"
      },
      {
        "char": "選",
        "pos": "after"
      }
    ]
  },
  {
    "char": "選",
    "zhuyin": "ㄒㄩㄢˇ",
    "searchWord": "選舉",
    "surrounding": [
      {
        "char": "挑",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "before"
      },
      {
        "char": "擇",
        "pos": "after"
      },
      {
        "char": "舉",
        "pos": "after"
      }
    ]
  },
  {
    "char": "擇",
    "zhuyin": "ㄗㄜˊ",
    "searchWord": "擇期",
    "surrounding": [
      {
        "char": "選",
        "pos": "before"
      },
      {
        "char": "抉",
        "pos": "before"
      },
      {
        "char": "優",
        "pos": "after"
      },
      {
        "char": "期",
        "pos": "after"
      }
    ]
  },
  {
    "char": "期",
    "zhuyin": "ㄑㄧˊ",
    "searchWord": "期待",
    "surrounding": [
      {
        "char": "學",
        "pos": "before"
      },
      {
        "char": "過",
        "pos": "before"
      },
      {
        "char": "限",
        "pos": "after"
      },
      {
        "char": "待",
        "pos": "after"
      }
    ]
  },
  {
    "char": "待",
    "zhuyin": "ㄉㄞˋ",
    "searchWord": "待客",
    "surrounding": [
      {
        "char": "期",
        "pos": "before"
      },
      {
        "char": "對",
        "pos": "before"
      },
      {
        "char": "遇",
        "pos": "after"
      },
      {
        "char": "客",
        "pos": "after"
      }
    ]
  },
  {
    "char": "客",
    "zhuyin": "ㄎㄜˋ",
    "searchWord": "客廳",
    "surrounding": [
      {
        "char": "顧",
        "pos": "before"
      },
      {
        "char": "遊",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "after"
      },
      {
        "char": "廳",
        "pos": "after"
      }
    ]
  },
  {
    "char": "廳",
    "zhuyin": "ㄊㄧㄥ",
    "searchWord": "廳舍",
    "surrounding": [
      {
        "char": "客",
        "pos": "before"
      },
      {
        "char": "大",
        "pos": "before"
      },
      {
        "char": "長",
        "pos": "after"
      },
      {
        "char": "舍",
        "pos": "after"
      }
    ]
  },
  {
    "char": "長",
    "zhuyin": "ㄓㄤˇ",
    "searchWord": "長輩",
    "surrounding": [
      {
        "char": "家",
        "pos": "before"
      },
      {
        "char": "校",
        "pos": "before"
      },
      {
        "char": "度",
        "pos": "after"
      },
      {
        "char": "輩",
        "pos": "after"
      }
    ]
  },
  {
    "char": "輩",
    "zhuyin": "ㄅㄟˋ",
    "searchWord": "輩出",
    "surrounding": [
      {
        "char": "長",
        "pos": "before"
      },
      {
        "char": "前",
        "pos": "before"
      },
      {
        "char": "分",
        "pos": "after"
      },
      {
        "char": "出",
        "pos": "after"
      }
    ]
  },
  {
    "char": "出",
    "zhuyin": "ㄔㄨ",
    "searchWord": "出口",
    "surrounding": [
      {
        "char": "進",
        "pos": "before"
      },
      {
        "char": "突",
        "pos": "before"
      },
      {
        "char": "發",
        "pos": "after"
      },
      {
        "char": "口",
        "pos": "after"
      }
    ]
  },
  {
    "char": "口",
    "zhuyin": "ㄎㄡˇ",
    "searchWord": "口哨",
    "surrounding": [
      {
        "char": "出",
        "pos": "before"
      },
      {
        "char": "進",
        "pos": "before"
      },
      {
        "char": "味",
        "pos": "after"
      },
      {
        "char": "哨",
        "pos": "after"
      }
    ]
  },
  {
    "char": "味",
    "zhuyin": "ㄨㄟˋ",
    "searchWord": "味精",
    "surrounding": [
      {
        "char": "口",
        "pos": "before"
      },
      {
        "char": "氣",
        "pos": "before"
      },
      {
        "char": "道",
        "pos": "after"
      },
      {
        "char": "精",
        "pos": "after"
      }
    ]
  },
  {
    "char": "道",
    "zhuyin": "ㄉㄠˋ",
    "searchWord": "道理",
    "surrounding": [
      {
        "char": "味",
        "pos": "before"
      },
      {
        "char": "知",
        "pos": "before"
      },
      {
        "char": "路",
        "pos": "after"
      },
      {
        "char": "理",
        "pos": "after"
      }
    ]
  },
  {
    "char": "理",
    "zhuyin": "ㄌㄧˇ",
    "searchWord": "理髮",
    "surrounding": [
      {
        "char": "道",
        "pos": "before"
      },
      {
        "char": "合",
        "pos": "before"
      },
      {
        "char": "事",
        "pos": "after"
      },
      {
        "char": "髮",
        "pos": "after"
      }
    ]
  },
  {
    "char": "髮",
    "zhuyin": "ㄈㄚˇ",
    "searchWord": "髮夾",
    "surrounding": [
      {
        "char": "理",
        "pos": "before"
      },
      {
        "char": "洗",
        "pos": "before"
      },
      {
        "char": "型",
        "pos": "after"
      },
      {
        "char": "夾",
        "pos": "after"
      }
    ]
  },
  {
    "char": "型",
    "zhuyin": "ㄒㄧㄥˊ",
    "searchWord": "型號",
    "surrounding": [
      {
        "char": "髮",
        "pos": "before"
      },
      {
        "char": "模",
        "pos": "before"
      },
      {
        "char": "態",
        "pos": "after"
      },
      {
        "char": "號",
        "pos": "after"
      }
    ]
  },
  {
    "char": "號",
    "zhuyin": "ㄏㄠˋ",
    "searchWord": "號召",
    "surrounding": [
      {
        "char": "型",
        "pos": "before"
      },
      {
        "char": "記",
        "pos": "before"
      },
      {
        "char": "碼",
        "pos": "after"
      },
      {
        "char": "召",
        "pos": "after"
      }
    ]
  },
  {
    "char": "碼",
    "zhuyin": "ㄇㄚˇ",
    "searchWord": "碼表",
    "surrounding": [
      {
        "char": "密",
        "pos": "before"
      },
      {
        "char": "號",
        "pos": "before"
      },
      {
        "char": "頭",
        "pos": "after"
      },
      {
        "char": "表",
        "pos": "after"
      }
    ]
  },
  {
    "char": "頭",
    "zhuyin": "ㄊㄡˊ",
    "searchWord": "頭髮",
    "surrounding": [
      {
        "char": "碼",
        "pos": "before"
      },
      {
        "char": "起",
        "pos": "before"
      },
      {
        "char": "痛",
        "pos": "after"
      },
      {
        "char": "髮",
        "pos": "after"
      }
    ]
  },
  {
    "char": "痛",
    "zhuyin": "ㄊㄨㄥˋ",
    "searchWord": "痛快",
    "surrounding": [
      {
        "char": "頭",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "before"
      },
      {
        "char": "苦",
        "pos": "after"
      },
      {
        "char": "快",
        "pos": "after"
      }
    ]
  },
  {
    "char": "快",
    "zhuyin": "ㄎㄨㄞˋ",
    "searchWord": "快速",
    "surrounding": [
      {
        "char": "痛",
        "pos": "before"
      },
      {
        "char": "輕",
        "pos": "before"
      },
      {
        "char": "樂",
        "pos": "after"
      },
      {
        "char": "速",
        "pos": "after"
      }
    ]
  },
  {
    "char": "樂",
    "zhuyin": "ㄌㄜˋ",
    "searchWord": "樂園",
    "surrounding": [
      {
        "char": "快",
        "pos": "before"
      },
      {
        "char": "音",
        "pos": "before"
      },
      {
        "char": "趣",
        "pos": "after"
      },
      {
        "char": "園",
        "pos": "after"
      }
    ]
  },
  {
    "char": "趣",
    "zhuyin": "ㄑㄩˋ",
    "searchWord": "趣事",
    "surrounding": [
      {
        "char": "樂",
        "pos": "before"
      },
      {
        "char": "興",
        "pos": "before"
      },
      {
        "char": "味",
        "pos": "after"
      },
      {
        "char": "事",
        "pos": "after"
      }
    ]
  },
  {
    "char": "事",
    "zhuyin": "ㄕˋ",
    "searchWord": "事務",
    "surrounding": [
      {
        "char": "趣",
        "pos": "before"
      },
      {
        "char": "故",
        "pos": "before"
      },
      {
        "char": "情",
        "pos": "after"
      },
      {
        "char": "務",
        "pos": "after"
      }
    ]
  },
  {
    "char": "故",
    "zhuyin": "ㄍㄨˋ",
    "searchWord": "故人",
    "surrounding": [
      {
        "char": "事",
        "pos": "before"
      },
      {
        "char": "變",
        "pos": "before"
      },
      {
        "char": "鄉",
        "pos": "after"
      },
      {
        "char": "人",
        "pos": "after"
      }
    ]
  },
  {
    "char": "鄉",
    "zhuyin": "ㄒㄧㄤ",
    "searchWord": "鄉親",
    "surrounding": [
      {
        "char": "故",
        "pos": "before"
      },
      {
        "char": "家",
        "pos": "before"
      },
      {
        "char": "村",
        "pos": "after"
      },
      {
        "char": "親",
        "pos": "after"
      }
    ]
  },
  {
    "char": "村",
    "zhuyin": "ㄘㄨㄣ",
    "searchWord": "村長",
    "surrounding": [
      {
        "char": "鄉",
        "pos": "before"
      },
      {
        "char": "農",
        "pos": "before"
      },
      {
        "char": "莊",
        "pos": "after"
      },
      {
        "char": "長",
        "pos": "after"
      }
    ]
  },
  {
    "char": "莊",
    "zhuyin": "ㄓㄨㄤ",
    "searchWord": "莊重",
    "surrounding": [
      {
        "char": "村",
        "pos": "before"
      },
      {
        "char": "山",
        "pos": "before"
      },
      {
        "char": "嚴",
        "pos": "after"
      },
      {
        "char": "重",
        "pos": "after"
      }
    ]
  },
  {
    "char": "嚴",
    "zhuyin": "ㄧㄢˊ",
    "searchWord": "嚴肅",
    "surrounding": [
      {
        "char": "莊",
        "pos": "before"
      },
      {
        "char": "尊",
        "pos": "before"
      },
      {
        "char": "格",
        "pos": "after"
      },
      {
        "char": "肅",
        "pos": "after"
      }
    ]
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "searchWord": "肅殺",
    "surrounding": [
      {
        "char": "整",
        "pos": "before"
      },
      {
        "char": "嚴",
        "pos": "before"
      },
      {
        "char": "靜",
        "pos": "after"
      },
      {
        "char": "立",
        "pos": "after"
      }
    ]
  },
  {
    "char": "立",
    "zhuyin": "ㄌㄧˋ",
    "searchWord": "立場",
    "surrounding": [
      {
        "char": "肅",
        "pos": "before"
      },
      {
        "char": "起",
        "pos": "before"
      },
      {
        "char": "刻",
        "pos": "after"
      },
      {
        "char": "場",
        "pos": "after"
      }
    ]
  },
  {
    "char": "刻",
    "zhuyin": "ㄎㄜˋ",
    "searchWord": "刻度",
    "surrounding": [
      {
        "char": "立",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "before"
      },
      {
        "char": "苦",
        "pos": "after"
      },
      {
        "char": "度",
        "pos": "after"
      }
    ]
  },
  {
    "char": "苦",
    "zhuyin": "ㄎㄨˇ",
    "searchWord": "苦笑",
    "surrounding": [
      {
        "char": "刻",
        "pos": "before"
      },
      {
        "char": "辛",
        "pos": "before"
      },
      {
        "char": "悶",
        "pos": "after"
      },
      {
        "char": "笑",
        "pos": "after"
      }
    ]
  },
  {
    "char": "笑",
    "zhuyin": "ㄒㄧㄠˋ",
    "searchWord": "笑柄",
    "surrounding": [
      {
        "char": "苦",
        "pos": "before"
      },
      {
        "char": "微",
        "pos": "before"
      },
      {
        "char": "料",
        "pos": "after"
      },
      {
        "char": "柄",
        "pos": "after"
      }
    ]
  },
  {
    "char": "料",
    "zhuyin": "ㄌㄧㄠˋ",
    "searchWord": "料想",
    "surrounding": [
      {
        "char": "笑",
        "pos": "before"
      },
      {
        "char": "材",
        "pos": "before"
      },
      {
        "char": "理",
        "pos": "after"
      },
      {
        "char": "想",
        "pos": "after"
      }
    ]
  },
  {
    "char": "材",
    "zhuyin": "ㄘㄞˊ",
    "searchWord": "材料",
    "surrounding": [
      {
        "char": "木",
        "pos": "before"
      },
      {
        "char": "題",
        "pos": "before"
      },
      {
        "char": "質",
        "pos": "after"
      },
      {
        "char": "料",
        "pos": "after"
      }
    ]
  },
  {
    "char": "質",
    "zhuyin": "ㄓˊ",
    "searchWord": "質問",
    "surrounding": [
      {
        "char": "材",
        "pos": "before"
      },
      {
        "char": "品",
        "pos": "before"
      },
      {
        "char": "量",
        "pos": "after"
      },
      {
        "char": "問",
        "pos": "after"
      }
    ]
  },
  {
    "char": "量",
    "zhuyin": "ㄌㄧㄤˋ",
    "searchWord": "量杯",
    "surrounding": [
      {
        "char": "質",
        "pos": "before"
      },
      {
        "char": "力",
        "pos": "before"
      },
      {
        "char": "度",
        "pos": "after"
      },
      {
        "char": "杯",
        "pos": "after"
      }
    ]
  },
  {
    "char": "杯",
    "zhuyin": "ㄅㄟ",
    "searchWord": "杯麵",
    "surrounding": [
      {
        "char": "量",
        "pos": "before"
      },
      {
        "char": "茶",
        "pos": "before"
      },
      {
        "char": "子",
        "pos": "after"
      },
      {
        "char": "麵",
        "pos": "after"
      }
    ]
  },
  {
    "char": "茶",
    "zhuyin": "ㄔㄚˊ",
    "searchWord": "茶壺",
    "surrounding": [
      {
        "char": "紅",
        "pos": "before"
      },
      {
        "char": "綠",
        "pos": "before"
      },
      {
        "char": "葉",
        "pos": "after"
      },
      {
        "char": "壺",
        "pos": "after"
      }
    ]
  },
  {
    "char": "葉",
    "zhuyin": "ㄧㄝˋ",
    "searchWord": "葉綠",
    "surrounding": [
      {
        "char": "茶",
        "pos": "before"
      },
      {
        "char": "落",
        "pos": "before"
      },
      {
        "char": "片",
        "pos": "after"
      },
      {
        "char": "綠",
        "pos": "after"
      }
    ]
  },
  {
    "char": "落",
    "zhuyin": "ㄌㄨㄛˋ",
    "searchWord": "落幕",
    "surrounding": [
      {
        "char": "降",
        "pos": "before"
      },
      {
        "char": "下",
        "pos": "before"
      },
      {
        "char": "地",
        "pos": "after"
      },
      {
        "char": "幕",
        "pos": "after"
      }
    ]
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "searchWord": "幕僚",
    "surrounding": [
      {
        "char": "落",
        "pos": "before"
      },
      {
        "char": "開",
        "pos": "before"
      },
      {
        "char": "後",
        "pos": "after"
      },
      {
        "char": "僚",
        "pos": "after"
      }
    ]
  },
  {
    "char": "後",
    "zhuyin": "ㄏㄡˋ",
    "searchWord": "後代",
    "surrounding": [
      {
        "char": "幕",
        "pos": "before"
      },
      {
        "char": "背",
        "pos": "before"
      },
      {
        "char": "悔",
        "pos": "after"
      },
      {
        "char": "代",
        "pos": "after"
      }
    ]
  },
  {
    "char": "代",
    "zhuyin": "ㄉㄞˋ",
    "searchWord": "代價",
    "surrounding": [
      {
        "char": "後",
        "pos": "before"
      },
      {
        "char": "時",
        "pos": "before"
      },
      {
        "char": "表",
        "pos": "after"
      },
      {
        "char": "價",
        "pos": "after"
      }
    ]
  },
  {
    "char": "表",
    "zhuyin": "ㄅㄧㄠˇ",
    "searchWord": "表示",
    "surrounding": [
      {
        "char": "代",
        "pos": "before"
      },
      {
        "char": "圖",
        "pos": "before"
      },
      {
        "char": "情",
        "pos": "after"
      },
      {
        "char": "示",
        "pos": "after"
      }
    ]
  },
  {
    "char": "示",
    "zhuyin": "ㄕˋ",
    "searchWord": "示弱",
    "surrounding": [
      {
        "char": "表",
        "pos": "before"
      },
      {
        "char": "警",
        "pos": "before"
      },
      {
        "char": "範",
        "pos": "after"
      },
      {
        "char": "弱",
        "pos": "after"
      }
    ]
  },
  {
    "char": "弱",
    "zhuyin": "ㄖㄨㄛˋ",
    "searchWord": "弱小",
    "surrounding": [
      {
        "char": "示",
        "pos": "before"
      },
      {
        "char": "懦",
        "pos": "before"
      },
      {
        "char": "點",
        "pos": "after"
      },
      {
        "char": "小",
        "pos": "after"
      }
    ]
  },
  {
    "char": "點",
    "zhuyin": "ㄉㄧㄢˇ",
    "searchWord": "點頭",
    "surrounding": [
      {
        "char": "弱",
        "pos": "before"
      },
      {
        "char": "特",
        "pos": "before"
      },
      {
        "char": "心",
        "pos": "after"
      },
      {
        "char": "頭",
        "pos": "after"
      }
    ]
  },
  {
    "char": "特",
    "zhuyin": "ㄊㄜˋ",
    "searchWord": "特權",
    "surrounding": [
      {
        "char": "獨",
        "pos": "before"
      },
      {
        "char": "奇",
        "pos": "before"
      },
      {
        "char": "色",
        "pos": "after"
      },
      {
        "char": "權",
        "pos": "after"
      }
    ]
  },
  {
    "char": "色",
    "zhuyin": "ㄙㄜˋ",
    "searchWord": "色調",
    "surrounding": [
      {
        "char": "特",
        "pos": "before"
      },
      {
        "char": "顏",
        "pos": "before"
      },
      {
        "char": "彩",
        "pos": "after"
      },
      {
        "char": "調",
        "pos": "after"
      }
    ]
  },
  {
    "char": "彩",
    "zhuyin": "ㄘㄞˇ",
    "searchWord": "彩券",
    "surrounding": [
      {
        "char": "色",
        "pos": "before"
      },
      {
        "char": "光",
        "pos": "before"
      },
      {
        "char": "虹",
        "pos": "after"
      },
      {
        "char": "券",
        "pos": "after"
      }
    ]
  },
  {
    "char": "虹",
    "zhuyin": "ㄏㄨㄥˊ",
    "searchWord": "虹膜",
    "surrounding": [
      {
        "char": "彩",
        "pos": "before"
      },
      {
        "char": "霓",
        "pos": "before"
      },
      {
        "char": "吸",
        "pos": "after"
      },
      {
        "char": "膜",
        "pos": "after"
      }
    ]
  },
  {
    "char": "膜",
    "zhuyin": "ㄇㄛˊ",
    "searchWord": "膜片",
    "surrounding": [
      {
        "char": "虹",
        "pos": "before"
      },
      {
        "char": "耳",
        "pos": "before"
      },
      {
        "char": "拜",
        "pos": "after"
      },
      {
        "char": "片",
        "pos": "after"
      }
    ]
  },
  {
    "char": "拜",
    "zhuyin": "ㄅㄞˋ",
    "searchWord": "拜託",
    "surrounding": [
      {
        "char": "膜",
        "pos": "before"
      },
      {
        "char": "禮",
        "pos": "before"
      },
      {
        "char": "訪",
        "pos": "after"
      },
      {
        "char": "託",
        "pos": "after"
      }
    ]
  },
  {
    "char": "訪",
    "zhuyin": "ㄈㄤˇ",
    "searchWord": "訪談",
    "surrounding": [
      {
        "char": "拜",
        "pos": "before"
      },
      {
        "char": "採",
        "pos": "before"
      },
      {
        "char": "問",
        "pos": "after"
      },
      {
        "char": "談",
        "pos": "after"
      }
    ]
  },
  {
    "char": "談",
    "zhuyin": "ㄊㄢˊ",
    "searchWord": "談話",
    "surrounding": [
      {
        "char": "訪",
        "pos": "before"
      },
      {
        "char": "交",
        "pos": "before"
      },
      {
        "char": "判",
        "pos": "after"
      },
      {
        "char": "話",
        "pos": "after"
      }
    ]
  },
  {
    "char": "氣",
    "zhuyin": "ㄑㄧˋ",
    "searchWord": "氣味",
    "surrounding": [
      {
        "char": "客",
        "pos": "before"
      },
      {
        "char": "生",
        "pos": "before"
      },
      {
        "char": "息",
        "pos": "after"
      },
      {
        "char": "味",
        "pos": "after"
      }
    ]
  },
  {
    "char": "生",
    "zhuyin": "ㄕㄥ",
    "searchWord": "生效",
    "surrounding": [
      {
        "char": "發",
        "pos": "before"
      },
      {
        "char": "產",
        "pos": "before"
      },
      {
        "char": "命",
        "pos": "after"
      },
      {
        "char": "效",
        "pos": "after"
      }
    ]
  },
  {
    "char": "命",
    "zhuyin": "ㄇㄧㄥˋ",
    "searchWord": "命令",
    "surrounding": [
      {
        "char": "生",
        "pos": "before"
      },
      {
        "char": "救",
        "pos": "before"
      },
      {
        "char": "運",
        "pos": "after"
      },
      {
        "char": "令",
        "pos": "after"
      }
    ]
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "searchWord": "令牌",
    "surrounding": [
      {
        "char": "命",
        "pos": "before"
      },
      {
        "char": "禁",
        "pos": "before"
      },
      {
        "char": "人",
        "pos": "after"
      },
      {
        "char": "牌",
        "pos": "after"
      }
    ]
  }
];
