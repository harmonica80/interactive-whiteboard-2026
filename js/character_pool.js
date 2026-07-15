// 一字千金易錯字庫 - 預先準備的 500 題超豐富題庫
const CHARACTER_TEST_POOL = [
  {
    "char": "熱",
    "zhuyin": "ㄖㄜˋ",
    "clue": "引起了（　）烈討論",
    "searchWord": "熱烈"
  },
  {
    "char": "尷",
    "zhuyin": "ㄍㄢ",
    "clue": "面十分（　）尬",
    "searchWord": "尷尬"
  },
  {
    "char": "尬",
    "zhuyin": "ㄍㄚˋ",
    "clue": "氣氛尷（　）",
    "searchWord": "尷尬"
  },
  {
    "char": "肺",
    "zhuyin": "ㄈㄟˋ",
    "clue": "發自（　）腑的真",
    "searchWord": "發自肺腑"
  },
  {
    "char": "冒",
    "zhuyin": "ㄇㄠˋ",
    "clue": "（　）著風雨",
    "searchWord": "冒著風雨"
  },
  {
    "char": "梁",
    "zhuyin": "ㄌㄧㄤˊ",
    "clue": "不能偷（　）換柱",
    "searchWord": "偷梁換柱"
  },
  {
    "char": "鼎",
    "zhuyin": "ㄉㄧㄥˇ",
    "clue": "謝大家（　）力相助",
    "searchWord": "鼎力相助"
  },
  {
    "char": "憋",
    "zhuyin": "ㄅㄧㄝ",
    "clue": "快要（　）不住笑",
    "searchWord": "憋不住"
  },
  {
    "char": "戳",
    "zhuyin": "ㄔㄨㄛ",
    "clue": "出，一（　）即破",
    "searchWord": "一戳即破"
  },
  {
    "char": "蒐",
    "zhuyin": "ㄙㄡ",
    "clue": "努力（　）集相關",
    "searchWord": "蒐集證據"
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "隱藏著（　）後黑手",
    "searchWord": "幕後黑手"
  },
  {
    "char": "慕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "數樂迷（　）名前來",
    "searchWord": "慕名前來"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "難以（　）明方向",
    "searchWord": "辨明方向"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "大賽中（　）才無礙",
    "searchWord": "辯才無礙"
  },
  {
    "char": "磬",
    "zhuyin": "ㄑㄧㄥˋ",
    "clue": "室如懸（　）",
    "searchWord": "室如懸磬"
  },
  {
    "char": "磐",
    "zhuyin": "ㄆㄢˊ",
    "clue": "情堅如（　）石，不",
    "searchWord": "堅如磐石"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "聲名狼（　）",
    "searchWord": "聲名狼藉"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "是一個（　）籍無名",
    "searchWord": "籍籍無名"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "再接再（　）",
    "searchWord": "再接再厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "極具鼓（　）作用",
    "searchWord": "鼓勵"
  },
  {
    "char": "輟",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "被迫（　）學做工",
    "searchWord": "輟學"
  },
  {
    "char": "綴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "空中點（　）著無數",
    "searchWord": "點綴"
  },
  {
    "char": "啜",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "落低聲（　）泣",
    "searchWord": "啜泣"
  },
  {
    "char": "緝",
    "zhuyin": "ㄑㄧˋ",
    "clue": "發布通（　）令追捕",
    "searchWord": "通緝"
  },
  {
    "char": "輯",
    "zhuyin": "ㄐㄧˊ",
    "clue": "本書的（　）排非常",
    "searchWord": "編輯"
  },
  {
    "char": "揖",
    "zhuyin": "ㄧ",
    "clue": "長輩作（　）行禮",
    "searchWord": "作揖"
  },
  {
    "char": "葺",
    "zhuyin": "ㄑㄧˋ",
    "clue": "需要修（　）",
    "searchWord": "修葺"
  },
  {
    "char": "戢",
    "zhuyin": "ㄐㄧˊ",
    "clue": "定偃兵（　）戈，恢",
    "searchWord": "偃兵戢戈"
  },
  {
    "char": "戈",
    "zhuyin": "ㄍㄜ",
    "clue": "偃武修（　），停戰",
    "searchWord": "偃武修戈"
  },
  {
    "char": "戌",
    "zhuyin": "ㄒㄩ",
    "clue": "酉、（　）、亥",
    "searchWord": "戌"
  },
  {
    "char": "戊",
    "zhuyin": "ㄨˋ",
    "clue": "丁、（　）",
    "searchWord": "戊"
  },
  {
    "char": "戍",
    "zhuyin": "ㄕㄨˋ",
    "clue": "邊疆防（　）",
    "searchWord": "防戍"
  },
  {
    "char": "戎",
    "zhuyin": "ㄖㄨㄥˊ",
    "clue": "投筆從（　），報效",
    "searchWord": "投筆從戎"
  },
  {
    "char": "冗",
    "zhuyin": "ㄖㄨㄥˇ",
    "clue": "得相當（　）長",
    "searchWord": "冗長"
  },
  {
    "char": "沈",
    "zhuyin": "ㄕㄣˇ",
    "clue": "引起了（　）默",
    "searchWord": "沈默"
  },
  {
    "char": "枕",
    "zhuyin": "ㄓㄣˇ",
    "clue": "可說是（　）戈待旦",
    "searchWord": "枕戈待旦"
  },
  {
    "char": "耽",
    "zhuyin": "ㄉㄢ",
    "clue": "玩只會（　）誤學業",
    "searchWord": "耽誤"
  },
  {
    "char": "眈",
    "zhuyin": "ㄉㄢ",
    "clue": "國虎視（　）（　）",
    "searchWord": "虎視眈眈"
  },
  {
    "char": "諂",
    "zhuyin": "ㄔㄢˇ",
    "clue": "他極力（　）媚巴結",
    "searchWord": "諂媚"
  },
  {
    "char": "陷",
    "zhuyin": "ㄒㄧㄢˋ",
    "clue": "沼中深（　），動彈",
    "searchWord": "深陷"
  },
  {
    "char": "焰",
    "zhuyin": "ㄧㄢˋ",
    "clue": "火的烈（　）沖天",
    "searchWord": "烈焰"
  },
  {
    "char": "掐",
    "zhuyin": "ㄑㄧㄚ",
    "clue": "緊張得（　）了自己",
    "searchWord": "掐"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "微小的（　）疵",
    "searchWord": "瑕疵"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "人，無（　）顧及娛",
    "searchWord": "無暇"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "不容（　）想",
    "searchWord": "暇想"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "潔白無（　），價值",
    "searchWord": "潔白無瑕"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "應接不（　）",
    "searchWord": "應接不暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "無窮的（　）思空間",
    "searchWord": "遐思"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "康大有（　）益",
    "searchWord": "裨益"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "題並無（　）補",
    "searchWord": "裨補"
  },
  {
    "char": "稗",
    "zhuyin": "ㄅㄞˋ",
    "clue": "讀野史（　）官",
    "searchWord": "稗官野史"
  },
  {
    "char": "碑",
    "zhuyin": "ㄅㄟ",
    "clue": "歷史古（　）已經被",
    "searchWord": "古碑"
  },
  {
    "char": "脾",
    "zhuyin": "ㄆㄧˊ",
    "clue": "他脾氣（　）氣暴躁",
    "searchWord": "脾氣"
  },
  {
    "char": "俾",
    "zhuyin": "ㄅㄧˋ",
    "clue": "出發，（　）便能按",
    "searchWord": "俾便"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "乾（　）的土地",
    "searchWord": "乾涸"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "他如（　）轍之鮒",
    "searchWord": "涸轍之鮒"
  },
  {
    "char": "錮",
    "zhuyin": "ㄍㄨˋ",
    "clue": "犯被禁（　）在狹窄",
    "searchWord": "禁錮"
  },
  {
    "char": "固",
    "zhuyin": "ㄍㄨˋ",
    "clue": "定要穩（　）",
    "searchWord": "穩固"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "完全枯（　）了",
    "searchWord": "枯涸"
  },
  {
    "char": "聒",
    "zhuyin": "ㄍㄨㄛ",
    "clue": "在樹上（　）（　）",
    "searchWord": "聒噪"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "活寧靜（　）適，令",
    "searchWord": "恬適"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "錯事卻（　）不知恥",
    "searchWord": "恬不知恥"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "風雨颳（　）得天昏",
    "searchWord": "颳風"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "對人刮（　）相看",
    "searchWord": "刮目相看"
  },
  {
    "char": "括",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "動包括（　）多項精",
    "searchWord": "包括"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "稍作小（　）",
    "searchWord": "小憩"
  },
  {
    "char": "憇",
    "zhuyin": "ㄑㄧˋ",
    "clue": "稍作小（　）",
    "searchWord": "小憩"
  },
  {
    "char": "契",
    "zhuyin": "ㄑㄧˋ",
    "clue": "雙方默（　）十足",
    "searchWord": "默契"
  },
  {
    "char": "潔",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "活作風（　）身自好",
    "searchWord": "潔身自好"
  },
  {
    "char": "劫",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "店不幸（　）後餘生",
    "searchWord": "劫後餘生"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "動作敏（　），一下",
    "searchWord": "敏捷"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "捷（　）報頻傳",
    "searchWord": "捷報"
  },
  {
    "char": "竭",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "必須竭（　）進全力",
    "searchWord": "竭盡全力"
  },
  {
    "char": "拮",
    "zhuyin": "ㄐㄧˊ",
    "clue": "頭十分（　）据，需",
    "searchWord": "拮据"
  },
  {
    "char": "据",
    "zhuyin": "ㄐㄩ",
    "clue": "十分拮（　），過得",
    "searchWord": "拮据"
  },
  {
    "char": "詰",
    "zhuyin": "ㄐㄧˊ",
    "clue": "上嚴厲（　）問嫌犯",
    "searchWord": "詰問"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "秋天是（　）子紅了",
    "searchWord": "橘子"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "新鮮的（　）汁酸甜",
    "searchWord": "橘汁"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "件非常（　）手、難",
    "searchWord": "棘手"
  },
  {
    "char": "辣",
    "zhuyin": "ㄌㄚˋ",
    "clue": "菜以麻（　）著稱",
    "searchWord": "麻辣"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "真偽難（　），需要",
    "searchWord": "真偽難辨"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "百般狡（　）也是無",
    "searchWord": "狡辯"
  },
  {
    "char": "辮",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "長長的（　）子，顯",
    "searchWord": "辮子"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "該如何（　）理，請",
    "searchWord": "辦理"
  },
  {
    "char": "瓣",
    "zhuyin": "ㄅㄢˋ",
    "clue": "玫瑰花（　）隨風飄",
    "searchWord": "花瓣"
  },
  {
    "char": "辧",
    "zhuyin": "ㄅㄢˋ",
    "clue": "該如何（　）理，請",
    "searchWord": "辦理"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "病人的（　）搏上",
    "searchWord": "脈搏"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "座山脈（　）綿延數",
    "searchWord": "山脈"
  },
  {
    "char": "博",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他博（　）古通今",
    "searchWord": "博古通今"
  },
  {
    "char": "搏",
    "zhuyin": "ㄅㄛˊ",
    "clue": "行生死（　）鬥",
    "searchWord": "搏鬥"
  },
  {
    "char": "膊",
    "zhuyin": "ㄅㄛˊ",
    "clue": "農夫赤（　）在烈日",
    "searchWord": "赤膊"
  },
  {
    "char": "駁",
    "zhuyin": "ㄅㄛˊ",
    "clue": "當場反（　）",
    "searchWord": "反駁"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "劇烈顛（　）",
    "searchWord": "顛簸"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "夫用簸（　）箕將穀",
    "searchWord": "簸箕"
  },
  {
    "char": "播",
    "zhuyin": "ㄅㄛ",
    "clue": "台正廣（　）著防災",
    "searchWord": "廣播"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "筆專款（　）付給受",
    "searchWord": "撥付"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "輕輕撥（　）琴弦",
    "searchWord": "撥琴"
  },
  {
    "char": "攀",
    "zhuyin": "ㄆㄢ",
    "clue": "壁向上（　）爬",
    "searchWord": "攀爬"
  },
  {
    "char": "樊",
    "zhuyin": "ㄈㄢˊ",
    "clue": "被關在（　）籠裡",
    "searchWord": "樊籠"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "貪（　）的人總",
    "searchWord": "貪婪"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "他用貪（　）的目光",
    "searchWord": "貪婪"
  },
  {
    "char": "焚",
    "zhuyin": "ㄈㄣˊ",
    "clue": "的大火（　）毀了整",
    "searchWord": "焚毀"
  },
  {
    "char": "梵",
    "zhuyin": "ㄈㄢˋ",
    "clue": "濃厚的（　）宇氣息",
    "searchWord": "梵宇"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "思維縝（　）密，天",
    "searchWord": "縝密"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "定要謹（　）",
    "searchWord": "謹慎"
  },
  {
    "char": "填",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "名表上（　）寫正確",
    "searchWord": "填寫"
  },
  {
    "char": "顛",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "人瘋瘋（　）（　）",
    "searchWord": "瘋瘋顛顛"
  },
  {
    "char": "巔",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "了人生（　）峰",
    "searchWord": "巔峰"
  },
  {
    "char": "癲",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他突然（　）癇發作",
    "searchWord": "癲癇"
  },
  {
    "char": "嗔",
    "zhuyin": "ㄔㄣ",
    "clue": "她面露（　）色，顯",
    "searchWord": "嗔色"
  },
  {
    "char": "瞋",
    "zhuyin": "ㄔㄣ",
    "clue": "他氣得（　）目結舌",
    "searchWord": "瞋目結舌"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "事宜審（　）",
    "searchWord": "審慎"
  },
  {
    "char": "鎮",
    "zhuyin": "ㄓㄣˋ",
    "clue": "示警以（　）壓暴亂",
    "searchWord": "鎮壓"
  },
  {
    "char": "震",
    "zhuyin": "ㄓㄣˋ",
    "clue": "大醜聞（　）驚了整",
    "searchWord": "震驚"
  },
  {
    "char": "賑",
    "zhuyin": "ㄓㄣˋ",
    "clue": "款開倉（　）災，濟",
    "searchWord": "賑災"
  },
  {
    "char": "振",
    "zhuyin": "ㄓㄣˋ",
    "clue": "精神，（　）作士氣",
    "searchWord": "振作"
  },
  {
    "char": "陣",
    "zhuyin": "ㄓㄣˋ",
    "clue": "傳來一（　）雷聲",
    "searchWord": "一陣"
  },
  {
    "char": "朕",
    "zhuyin": "ㄓㄣˋ",
    "clue": "自稱為（　）",
    "searchWord": "朕"
  },
  {
    "char": "疹",
    "zhuyin": "ㄓㄣˇ",
    "clue": "許多紅（　），奇癢",
    "searchWord": "紅疹"
  },
  {
    "char": "診",
    "zhuyin": "ㄓㄣˇ",
    "clue": "做詳細（　）斷",
    "searchWord": "診斷"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "校長嚴（　）地批評",
    "searchWord": "嚴厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "番鼓勵（　）志的話",
    "searchWord": "勵志"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "年老店（　）經滄桑",
    "searchWord": "歷經"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "歷史（　）史是不",
    "searchWord": "歷史"
  },
  {
    "char": "曆",
    "zhuyin": "ㄌㄧˋ",
    "clue": "上新日（　）",
    "searchWord": "日曆"
  },
  {
    "char": "靂",
    "zhuyin": "ㄌㄧˋ",
    "clue": "晴天霹（　）的消息",
    "searchWord": "霹靂"
  },
  {
    "char": "礪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "境中磨（　）意志",
    "searchWord": "磨礪"
  },
  {
    "char": "罹",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不幸（　）難的家",
    "searchWord": "罹難"
  },
  {
    "char": "離",
    "zhuyin": "ㄌㄧˊ",
    "clue": "的距離（　）非常遙",
    "searchWord": "距離"
  },
  {
    "char": "籬",
    "zhuyin": "ㄌㄧˊ",
    "clue": "矮的木（　）笆",
    "searchWord": "籬笆"
  },
  {
    "char": "釐",
    "zhuyin": "ㄌㄧˊ",
    "clue": "時，一（　）一毫都",
    "searchWord": "釐毫"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "一對璧（　）",
    "searchWord": "璧儷"
  },
  {
    "char": "荔",
    "zhuyin": "ㄌㄧˋ",
    "clue": "夏天的（　）枝甜美",
    "searchWord": "荔枝"
  },
  {
    "char": "麗",
    "zhuyin": "ㄌㄧˋ",
    "clue": "風景美（　）如畫",
    "searchWord": "美麗"
  },
  {
    "char": "莉",
    "zhuyin": "ㄌㄧˋ",
    "clue": "裡的茉（　）花正悄",
    "searchWord": "茉莉"
  },
  {
    "char": "例",
    "zhuyin": "ㄌㄧˋ",
    "clue": "按照慣（　），我們",
    "searchWord": "慣例"
  },
  {
    "char": "俐",
    "zhuyin": "ㄌㄧˋ",
    "clue": "非常伶（　）乖巧",
    "searchWord": "伶俐"
  },
  {
    "char": "櫪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老馬伏（　），志在",
    "searchWord": "老馬伏櫪"
  },
  {
    "char": "邐",
    "zhuyin": "ㄌㄧˇ",
    "clue": "風景迤（　），令人",
    "searchWord": "迤邐"
  },
  {
    "char": "蠡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "管窺蠡（　）的見解",
    "searchWord": "管窺蠡測"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這對伉（　）常攜手",
    "searchWord": "伉儷"
  },
  {
    "char": "灑",
    "zhuyin": "ㄙㄚˇ",
    "clue": "路面上（　）水除塵",
    "searchWord": "灑水"
  },
  {
    "char": "酒",
    "zhuyin": "ㄐㄧㄡˇ",
    "clue": "車不喝（　），喝酒",
    "searchWord": "酒精"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "萬眾（　）目的決",
    "searchWord": "矚目"
  },
  {
    "char": "屬",
    "zhuyin": "ㄕㄨˇ",
    "clue": "到底歸（　）於誰",
    "searchWord": "歸屬"
  },
  {
    "char": "囑",
    "zhuyin": "ㄓㄨˇ",
    "clue": "人的遺（　）",
    "searchWord": "遺囑"
  },
  {
    "char": "佇",
    "zhuyin": "ㄓㄨˋ",
    "clue": "在雨中（　）立許久",
    "searchWord": "佇立"
  },
  {
    "char": "貯",
    "zhuyin": "ㄓㄨˋ",
    "clue": "需要多（　）備一些",
    "searchWord": "貯備"
  },
  {
    "char": "駐",
    "zhuyin": "ㄓㄨˋ",
    "clue": "隊已進（　）邊防重",
    "searchWord": "進駐"
  },
  {
    "char": "助",
    "zhuyin": "ㄓㄨˋ",
    "clue": "互相幫（　）是美德",
    "searchWord": "幫助"
  },
  {
    "char": "蛀",
    "zhuyin": "ㄓㄨˋ",
    "clue": "容易長（　）牙",
    "searchWord": "蛀牙"
  },
  {
    "char": "築",
    "zhuyin": "ㄓㄨˊ",
    "clue": "在建築（　）工地上",
    "searchWord": "建築"
  },
  {
    "char": "逐",
    "zhuyin": "ㄓㄨˊ",
    "clue": "要隨波（　）流，失",
    "searchWord": "隨波逐流"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨˋ",
    "clue": "這本名（　）被翻譯",
    "searchWord": "名著"
  },
  {
    "char": "署",
    "zhuyin": "ㄕㄨˇ",
    "clue": "親自簽（　）",
    "searchWord": "簽署"
  },
  {
    "char": "曙",
    "zhuyin": "ㄕㄨˇ",
    "clue": "出一線（　）光",
    "searchWord": "曙光"
  },
  {
    "char": "薯",
    "zhuyin": "ㄕㄨˇ",
    "clue": "的馬鈴（　）條非常",
    "searchWord": "馬鈴薯"
  },
  {
    "char": "暑",
    "zhuyin": "ㄕㄨˇ",
    "clue": "漫長的（　）假是孩",
    "searchWord": "暑假"
  },
  {
    "char": "墅",
    "zhuyin": "ㄕㄨˋ",
    "clue": "度假別（　）",
    "searchWord": "別墅"
  },
  {
    "char": "塑",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這件泥（　）作品栩",
    "searchWord": "泥塑"
  },
  {
    "char": "宿",
    "zhuyin": "ㄙㄨˋ",
    "clue": "民宿寄（　）",
    "searchWord": "寄宿"
  },
  {
    "char": "素",
    "zhuyin": "ㄙㄨˋ",
    "clue": "穿著樸（　），不愛",
    "searchWord": "樸素"
  },
  {
    "char": "訴",
    "zhuyin": "ㄙㄨˋ",
    "clue": "民事訴（　）",
    "searchWord": "訴訟"
  },
  {
    "char": "溯",
    "zhuyin": "ㄙㄨˋ",
    "clue": "可以追（　）到百年",
    "searchWord": "追溯"
  },
  {
    "char": "夙",
    "zhuyin": "ㄙㄨˋ",
    "clue": "真是（　）夜匪懈",
    "searchWord": "夙夜匪懈"
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "clue": "十分嚴（　）",
    "searchWord": "嚴肅"
  },
  {
    "char": "簌",
    "zhuyin": "ㄙㄨˋ",
    "clue": "中發出（　）（　）",
    "searchWord": "簌簌"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "的速度（　）極快",
    "searchWord": "速度"
  },
  {
    "char": "橫",
    "zhuyin": "ㄕㄨ",
    "clue": "滄海一（　）微不足",
    "searchWord": "滄海一粟"
  },
  {
    "char": "蘇",
    "zhuyin": "ㄙㄨ",
    "clue": "萬物復（　）",
    "searchWord": "復蘇"
  },
  {
    "char": "酥",
    "zhuyin": "ㄙㄨ",
    "clue": "鳳梨酥（　）口感極",
    "searchWord": "鳳梨酥"
  },
  {
    "char": "俗",
    "zhuyin": "ㄙㄨˊ",
    "clue": "陳規陋（　）",
    "searchWord": "陋俗"
  },
  {
    "char": "悚",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "毛骨悚（　）",
    "searchWord": "毛骨悚然"
  },
  {
    "char": "聳",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "高聳（　）的大樓",
    "searchWord": "高聳"
  },
  {
    "char": "訟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "入了官（　）",
    "searchWord": "官訟"
  },
  {
    "char": "頌",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "為了歌（　）英雄的",
    "searchWord": "歌頌"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "自開車（　）我到火",
    "searchWord": "送行"
  },
  {
    "char": "宋",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這是（　）朝時期",
    "searchWord": "宋朝"
  },
  {
    "char": "誦",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "大聲朗（　）課文",
    "searchWord": "朗誦"
  },
  {
    "char": "松",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "棵古松（　）迎風挺",
    "searchWord": "古松"
  },
  {
    "char": "鬆",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "可以放（　）一下",
    "searchWord": "放鬆"
  },
  {
    "char": "嵩",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "尊稱為（　）山",
    "searchWord": "嵩山"
  },
  {
    "char": "慫",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "朋友的（　）恿下",
    "searchWord": "慫恿"
  },
  {
    "char": "懍",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "無不畏（　）遵命",
    "searchWord": "畏懍"
  },
  {
    "char": "凜",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "寒風（　）（　）",
    "searchWord": "寒風凜凜"
  },
  {
    "char": "鄰",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "不如近（　），鄰里",
    "searchWord": "近鄰"
  },
  {
    "char": "臨",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "貴賓光（　）指導",
    "searchWord": "光臨"
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "始森林（　）木茂密",
    "searchWord": "森林"
  },
  {
    "char": "淋",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "被大雨（　）得像隻",
    "searchWord": "淋雨"
  },
  {
    "char": "鱗",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "上的鱗（　）片在陽",
    "searchWord": "鱗片"
  },
  {
    "char": "麟",
    "zhuyin": "ㄌㄧˊ",
    "clue": "界鳳毛（　）角般的",
    "searchWord": "鳳毛麟角"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "萬不要（　）嗇",
    "searchWord": "吝嗇"
  },
  {
    "char": "玲",
    "zhuyin": "ㄌㄧˊ",
    "clue": "雕小巧（　）瓏，十",
    "searchWord": "玲瓏"
  },
  {
    "char": "伶",
    "zhuyin": "ㄌㄧˊ",
    "clue": "子口齒（　）俐，討",
    "searchWord": "伶俐"
  },
  {
    "char": "聆",
    "zhuyin": "ㄌㄧˊ",
    "clue": "靜靜地（　）聽鋼琴",
    "searchWord": "聆聽"
  },
  {
    "char": "齡",
    "zhuyin": "ㄌㄧˊ",
    "clue": "木的年（　）已超過",
    "searchWord": "年齡"
  },
  {
    "char": "羚",
    "zhuyin": "ㄌㄧˊ",
    "clue": "成群的（　）羊奔馳",
    "searchWord": "羚羊"
  },
  {
    "char": "零",
    "zhuyin": "ㄌㄧˊ",
    "clue": "剛好為（　）",
    "searchWord": "零錢"
  },
  {
    "char": "鈴",
    "zhuyin": "ㄌㄧˊ",
    "clue": "下課（　）聲響起",
    "searchWord": "鈴聲"
  },
  {
    "char": "凌",
    "zhuyin": "ㄌㄧˊ",
    "clue": "經常（　）侮弱小",
    "searchWord": "凌侮"
  },
  {
    "char": "陵",
    "zhuyin": "ㄌㄧˊ",
    "clue": "帝王的（　）寢遺址",
    "searchWord": "陵寢"
  },
  {
    "char": "綾",
    "zhuyin": "ㄌㄧˊ",
    "clue": "高級的（　）羅綢緞",
    "searchWord": "綾羅綢緞"
  },
  {
    "char": "嶺",
    "zhuyin": "ㄌㄧˇ",
    "clue": "重重山（　），終於",
    "searchWord": "山嶺"
  },
  {
    "char": "領",
    "zhuyin": "ㄌㄧˇ",
    "clue": "他帶（　）團隊建",
    "searchWord": "帶領"
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這條禁（　）自即日",
    "searchWord": "禁令"
  },
  {
    "char": "另",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "們必須（　）作打算",
    "searchWord": "另作打算"
  },
  {
    "char": "靈",
    "zhuyin": "ㄌㄧˊ",
    "clue": "真的很（　）驗",
    "searchWord": "靈驗"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "請不要（　）惜給予",
    "searchWord": "吝惜"
  },
  {
    "char": "濘",
    "zhuyin": "ㄋㄧㄥˋ",
    "clue": "山路泥（　）不堪",
    "searchWord": "泥濘"
  },
  {
    "char": "濘",
    "zhuyin": "ㄋㄧㄥˋ",
    "clue": "子在泥（　）的道路",
    "searchWord": "泥濘"
  },
  {
    "char": "寧",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "十分安（　）靜謐",
    "searchWord": "安寧"
  },
  {
    "char": "檸",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "新鮮的（　）檬紅茶",
    "searchWord": "檸檬"
  },
  {
    "char": "獰",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "徒面目（　）惡，令",
    "searchWord": "面目獰惡"
  },
  {
    "char": "凝",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "遇冷會（　）結成水",
    "searchWord": "凝聚"
  },
  {
    "char": "擬",
    "zhuyin": "ㄋㄧˇ",
    "clue": "正在草（　）新的防",
    "searchWord": "草擬"
  },
  {
    "char": "疑",
    "zhuyin": "ㄧˊ",
    "clue": "深表懷（　）",
    "searchWord": "懷疑"
  },
  {
    "char": "礙",
    "zhuyin": "ㄞˋ",
    "clue": "以免阻（　）交通",
    "searchWord": "阻礙"
  },
  {
    "char": "癡",
    "zhuyin": "ㄔ",
    "clue": "是個郵（　）",
    "searchWord": "郵癡"
  },
  {
    "char": "痴",
    "zhuyin": "ㄔ",
    "clue": "看他那（　）迷的模",
    "searchWord": "痴迷"
  },
  {
    "char": "嗤",
    "zhuyin": "ㄔ",
    "clue": "大家都（　）之以鼻",
    "searchWord": "嗤之以鼻"
  },
  {
    "char": "蚩",
    "zhuyin": "ㄔ",
    "clue": "帝曾與（　）尤大戰",
    "searchWord": "蚩尤"
  },
  {
    "char": "笞",
    "zhuyin": "ㄔ",
    "clue": "常用鞭（　）之刑處",
    "searchWord": "鞭笞"
  },
  {
    "char": "疵",
    "zhuyin": "ㄘ",
    "clue": "點小瑕（　），因而",
    "searchWord": "瑕疵"
  },
  {
    "char": "雌",
    "zhuyin": "ㄘ",
    "clue": "是隻（　）鳥",
    "searchWord": "雌鳥"
  },
  {
    "char": "茨",
    "zhuyin": "ㄘ",
    "clue": "茅（　）草屋是",
    "searchWord": "茅茨"
  },
  {
    "char": "慈",
    "zhuyin": "ㄘˊ",
    "clue": "（　）祥的母",
    "searchWord": "慈祥"
  },
  {
    "char": "磁",
    "zhuyin": "ㄘˊ",
    "clue": "（　）鐵具有",
    "searchWord": "磁鐵"
  },
  {
    "char": "詞",
    "zhuyin": "ㄘˊ",
    "clue": "的歌詞（　）寫得非",
    "searchWord": "歌詞"
  },
  {
    "char": "辭",
    "zhuyin": "ㄘˊ",
    "clue": "決定（　）去這份",
    "searchWord": "辭去"
  },
  {
    "char": "祠",
    "zhuyin": "ㄘˊ",
    "clue": "會到宗（　）祭拜祖",
    "searchWord": "宗祠"
  },
  {
    "char": "賜",
    "zhuyin": "ㄙˋ",
    "clue": "上天賞（　）我們豐",
    "searchWord": "賞賜"
  },
  {
    "char": "伺",
    "zhuyin": "ㄙˋ",
    "clue": "歹徒正（　）機而動",
    "searchWord": "伺機"
  },
  {
    "char": "肆",
    "zhuyin": "ㄙˋ",
    "clue": "場合大（　）宣嘩",
    "searchWord": "大肆"
  },
  {
    "char": "寺",
    "zhuyin": "ㄙˋ",
    "clue": "深山古（　）常年香",
    "searchWord": "古寺"
  },
  {
    "char": "嗣",
    "zhuyin": "ㄙˋ",
    "clue": "一的後（　）繼承人",
    "searchWord": "後嗣"
  },
  {
    "char": "飼",
    "zhuyin": "ㄙˋ",
    "clue": "的牧草（　）養牛群",
    "searchWord": "飼養"
  },
  {
    "char": "巳",
    "zhuyin": "ㄙˋ",
    "clue": "為辰、（　）、午",
    "searchWord": "巳"
  },
  {
    "char": "已",
    "zhuyin": "ㄧˇ",
    "clue": "件事情（　）經無可",
    "searchWord": "已經"
  },
  {
    "char": "己",
    "zhuyin": "ㄐㄧˇ",
    "clue": "定要克（　）復禮",
    "searchWord": "克己"
  },
  {
    "char": "導",
    "zhuyin": "ㄉㄠˇ",
    "clue": "這名導（　）遊非常",
    "searchWord": "導遊"
  },
  {
    "char": "倒",
    "zhuyin": "ㄉㄠˇ",
    "clue": "排山（　）海的力",
    "searchWord": "排山倒海"
  },
  {
    "char": "島",
    "zhuyin": "ㄉㄠˇ",
    "clue": "麗的寶（　）",
    "searchWord": "寶島"
  },
  {
    "char": "搗",
    "zhuyin": "ㄉㄠˇ",
    "clue": "上故意（　）蛋，被",
    "searchWord": "搗蛋"
  },
  {
    "char": "稻",
    "zhuyin": "ㄉㄠˋ",
    "clue": "黃色的（　）穗隨風",
    "searchWord": "稻穗"
  },
  {
    "char": "盜",
    "zhuyin": "ㄉㄠˋ",
    "clue": "遭遇強（　）",
    "searchWord": "強盜"
  },
  {
    "char": "道",
    "zhuyin": "ㄉㄠˋ",
    "clue": "要講道（　）義，不",
    "searchWord": "道義"
  },
  {
    "char": "悼",
    "zhuyin": "ㄉㄠˋ",
    "clue": "以哀（　）受難者",
    "searchWord": "哀悼"
  },
  {
    "char": "蹈",
    "zhuyin": "ㄉㄠˋ",
    "clue": "蕾舞，（　）步非常",
    "searchWord": "舞蹈"
  },
  {
    "char": "叨",
    "zhuyin": "ㄉㄠ",
    "clue": "總是嘮（　）個不停",
    "searchWord": "嘮叨"
  },
  {
    "char": "饕",
    "zhuyin": "ㄊㄠ",
    "clue": "是許多（　）餮食客",
    "searchWord": "饕餮"
  },
  {
    "char": "滔",
    "zhuyin": "ㄊㄠ",
    "clue": "河之水（　）（　）",
    "searchWord": "滔滔不絕"
  },
  {
    "char": "濤",
    "zhuyin": "ㄊㄠ",
    "clue": "了驚濤（　）駭浪",
    "searchWord": "驚濤駭浪"
  },
  {
    "char": "掏",
    "zhuyin": "ㄊㄠ",
    "clue": "口袋裡（　）出一張",
    "searchWord": "掏出"
  },
  {
    "char": "逃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "刻拔腿（　）跑",
    "searchWord": "逃跑"
  },
  {
    "char": "桃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "園裡的（　）花競相",
    "searchWord": "桃花"
  },
  {
    "char": "陶",
    "zhuyin": "ㄊㄠˊ",
    "clue": "件陶瓷（　）器是宋",
    "searchWord": "陶瓷"
  },
  {
    "char": "淘",
    "zhuyin": "ㄊㄠˊ",
    "clue": "孩非常（　）氣，常",
    "searchWord": "淘氣"
  },
  {
    "char": "討",
    "zhuyin": "ㄊㄠˇ",
    "clue": "深入探（　）",
    "searchWord": "探討"
  },
  {
    "char": "套",
    "zhuyin": "ㄊㄠˋ",
    "clue": "這套（　）西裝穿",
    "searchWord": "套裝"
  },
  {
    "char": "慟",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他哀（　）萬分",
    "searchWord": "哀慟"
  },
  {
    "char": "痛",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他頭（　）欲裂",
    "searchWord": "痛行"
  },
  {
    "char": "同",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "我們在（　）一個班",
    "searchWord": "同班"
  },
  {
    "char": "銅",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "這座青（　）雕像矗",
    "searchWord": "青銅"
  },
  {
    "char": "桐",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "五月油（　）花盛開",
    "searchWord": "油桐花"
  },
  {
    "char": "筒",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "進垃圾（　）裡",
    "searchWord": "垃圾筒"
  },
  {
    "char": "統",
    "zhuyin": "ㄊㄨㄥˇ",
    "clue": "致力於（　）籌全國",
    "searchWord": "統籌"
  },
  {
    "char": "通",
    "zhuyin": "ㄊㄨㄥ",
    "clue": "路四通（　）八達",
    "searchWord": "四通八達"
  },
  {
    "char": "贅",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "篇文章（　）字太多",
    "searchWord": "贅字"
  },
  {
    "char": "椎",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "致他脊（　）嚴重受",
    "searchWord": "脊椎"
  },
  {
    "char": "錐",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "生產圓（　）形的鋼",
    "searchWord": "圓錐"
  },
  {
    "char": "墜",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "夜空，（　）落在遙",
    "searchWord": "墜落"
  },
  {
    "char": "追",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "上奮力（　）捕搶匪",
    "searchWord": "追捕"
  },
  {
    "char": "拙",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "口齒笨（　），不擅",
    "searchWord": "笨拙"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "立刻著（　）手辦理",
    "searchWord": "著手"
  },
  {
    "char": "琢",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "精雕細（　）才能成",
    "searchWord": "精雕細琢"
  },
  {
    "char": "卓",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "取得了（　）越的成",
    "searchWord": "卓越"
  },
  {
    "char": "濯",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "不染，（　）清漣而",
    "searchWord": "濯清漣"
  },
  {
    "char": "灼",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "著真知（　）見",
    "searchWord": "真知灼見"
  },
  {
    "char": "酌",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "反覆斟（　）才能定",
    "searchWord": "斟酌"
  },
  {
    "char": "濁",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "十分混（　），不適",
    "searchWord": "混濁"
  },
  {
    "char": "抉",
    "zhuyin": "ㄐㄩㄝˊ",
    "clue": "的重大（　）擇",
    "searchWord": "抉擇"
  },
  {
    "char": "既",
    "zhuyin": "ㄐㄧˋ",
    "clue": "就要（　）往不咎",
    "searchWord": "既往不咎"
  },
  {
    "char": "躁",
    "zhuyin": "ㄗㄠˋ",
    "clue": "不可暴（　）",
    "searchWord": "暴躁"
  },
  {
    "char": "頃",
    "zhuyin": "ㄑㄧㄥˇ",
    "clue": "（　）刻之間",
    "searchWord": "頃刻"
  },
  {
    "char": "傾",
    "zhuyin": "ㄑㄧㄥ",
    "clue": "下得像（　）盆大雨",
    "searchWord": "傾盆大雨"
  },
  {
    "char": "韁",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "得像脫（　）野馬",
    "searchWord": "脫韁野馬"
  },
  {
    "char": "鰈",
    "zhuyin": "ㄉㄧㄝˊ",
    "clue": "他們鶼（　）情深",
    "searchWord": "鶼鰈情深"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "思慮（　）密",
    "searchWord": "縝密"
  },
  {
    "char": "蒂",
    "zhuyin": "ㄉㄧˋ",
    "clue": "經根深（　）固，很",
    "searchWord": "根深蒂固"
  },
  {
    "char": "懦",
    "zhuyin": "ㄋㄨㄛˋ",
    "clue": "絕不能（　）弱",
    "searchWord": "懦弱"
  },
  {
    "char": "顢",
    "zhuyin": "ㄇㄢˊ",
    "clue": "員辦事（　）頇，效",
    "searchWord": "顢頇"
  },
  {
    "char": "頇",
    "zhuyin": "ㄏㄢ",
    "clue": "他那顢（　）的作風",
    "searchWord": "顢頇"
  },
  {
    "char": "姍",
    "zhuyin": "ㄕㄢ",
    "clue": "小時才（　）（　）",
    "searchWord": "姍姍來遲"
  },
  {
    "char": "惴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "他終日（　）（　）",
    "searchWord": "惴惴不安"
  },
  {
    "char": "揣",
    "zhuyin": "ㄔㄨㄞˇ",
    "clue": "們難以（　）摩大師",
    "searchWord": "揣摩"
  },
  {
    "char": "馳",
    "zhuyin": "ㄔˊ",
    "clue": "路上風（　）電掣般",
    "searchWord": "風馳電掣"
  },
  {
    "char": "尷",
    "zhuyin": "ㄍㄢ",
    "clue": "面十分（　）尬",
    "searchWord": "尷尬"
  },
  {
    "char": "尬",
    "zhuyin": "ㄍㄚˋ",
    "clue": "氣氛尷（　）",
    "searchWord": "尷尬"
  },
  {
    "char": "肺",
    "zhuyin": "ㄈㄟˋ",
    "clue": "發自（　）腑的真",
    "searchWord": "發自肺腑"
  },
  {
    "char": "冒",
    "zhuyin": "ㄇㄠˋ",
    "clue": "（　）著風雨",
    "searchWord": "冒著風雨"
  },
  {
    "char": "梁",
    "zhuyin": "ㄌㄧㄤˊ",
    "clue": "不能偷（　）換柱",
    "searchWord": "偷梁換柱"
  },
  {
    "char": "鼎",
    "zhuyin": "ㄉㄧㄥˇ",
    "clue": "謝大家（　）力相助",
    "searchWord": "鼎力相助"
  },
  {
    "char": "憋",
    "zhuyin": "ㄅㄧㄝ",
    "clue": "快要（　）不住笑",
    "searchWord": "憋不住"
  },
  {
    "char": "戳",
    "zhuyin": "ㄔㄨㄛ",
    "clue": "出，一（　）即破",
    "searchWord": "一戳即破"
  },
  {
    "char": "蒐",
    "zhuyin": "ㄙㄡ",
    "clue": "努力（　）集相關",
    "searchWord": "蒐集證據"
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "隱藏著（　）後黑手",
    "searchWord": "幕後黑手"
  },
  {
    "char": "慕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "數樂迷（　）名前來",
    "searchWord": "慕名前來"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "難以（　）明方向",
    "searchWord": "辨明方向"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "大賽中（　）才無礙",
    "searchWord": "辯才無礙"
  },
  {
    "char": "磬",
    "zhuyin": "ㄑㄧㄥˋ",
    "clue": "室如懸（　）",
    "searchWord": "室如懸磬"
  },
  {
    "char": "磐",
    "zhuyin": "ㄆㄢˊ",
    "clue": "情堅如（　）石，不",
    "searchWord": "堅如磐石"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "聲名狼（　）",
    "searchWord": "聲名狼藉"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "是一個（　）籍無名",
    "searchWord": "籍籍無名"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "再接再（　）",
    "searchWord": "再接再厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "極具鼓（　）作用",
    "searchWord": "鼓勵"
  },
  {
    "char": "輟",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "被迫（　）學做工",
    "searchWord": "輟學"
  },
  {
    "char": "綴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "空中點（　）著無數",
    "searchWord": "點綴"
  },
  {
    "char": "啜",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "落低聲（　）泣",
    "searchWord": "啜泣"
  },
  {
    "char": "緝",
    "zhuyin": "ㄑㄧˋ",
    "clue": "發布通（　）令追捕",
    "searchWord": "通緝"
  },
  {
    "char": "輯",
    "zhuyin": "ㄐㄧˊ",
    "clue": "本書的（　）排非常",
    "searchWord": "編輯"
  },
  {
    "char": "揖",
    "zhuyin": "ㄧ",
    "clue": "長輩作（　）行禮",
    "searchWord": "作揖"
  },
  {
    "char": "葺",
    "zhuyin": "ㄑㄧˋ",
    "clue": "需要修（　）",
    "searchWord": "修葺"
  },
  {
    "char": "戢",
    "zhuyin": "ㄐㄧˊ",
    "clue": "定偃兵（　）戈，恢",
    "searchWord": "偃兵戢戈"
  },
  {
    "char": "戈",
    "zhuyin": "ㄍㄜ",
    "clue": "偃武修（　），停戰",
    "searchWord": "偃武修戈"
  },
  {
    "char": "戌",
    "zhuyin": "ㄒㄩ",
    "clue": "酉、（　）、亥",
    "searchWord": "戌"
  },
  {
    "char": "戊",
    "zhuyin": "ㄨˋ",
    "clue": "丁、（　）",
    "searchWord": "戊"
  },
  {
    "char": "戍",
    "zhuyin": "ㄕㄨˋ",
    "clue": "邊疆防（　）",
    "searchWord": "防戍"
  },
  {
    "char": "戎",
    "zhuyin": "ㄖㄨㄥˊ",
    "clue": "投筆從（　），報效",
    "searchWord": "投筆從戎"
  },
  {
    "char": "冗",
    "zhuyin": "ㄖㄨㄥˇ",
    "clue": "得相當（　）長",
    "searchWord": "冗長"
  },
  {
    "char": "沈",
    "zhuyin": "ㄕㄣˇ",
    "clue": "引起了（　）默",
    "searchWord": "沈默"
  },
  {
    "char": "枕",
    "zhuyin": "ㄓㄣˇ",
    "clue": "可說是（　）戈待旦",
    "searchWord": "枕戈待旦"
  },
  {
    "char": "耽",
    "zhuyin": "ㄉㄢ",
    "clue": "玩只會（　）誤學業",
    "searchWord": "耽誤"
  },
  {
    "char": "眈",
    "zhuyin": "ㄉㄢ",
    "clue": "國虎視（　）（　）",
    "searchWord": "虎視眈眈"
  },
  {
    "char": "諂",
    "zhuyin": "ㄔㄢˇ",
    "clue": "他極力（　）媚巴結",
    "searchWord": "諂媚"
  },
  {
    "char": "陷",
    "zhuyin": "ㄒㄧㄢˋ",
    "clue": "沼中深（　），動彈",
    "searchWord": "深陷"
  },
  {
    "char": "焰",
    "zhuyin": "ㄧㄢˋ",
    "clue": "火的烈（　）沖天",
    "searchWord": "烈焰"
  },
  {
    "char": "掐",
    "zhuyin": "ㄑㄧㄚ",
    "clue": "緊張得（　）了自己",
    "searchWord": "掐"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "微小的（　）疵",
    "searchWord": "瑕疵"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "人，無（　）顧及娛",
    "searchWord": "無暇"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "不容（　）想",
    "searchWord": "暇想"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "潔白無（　），價值",
    "searchWord": "潔白無瑕"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "應接不（　）",
    "searchWord": "應接不暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "無窮的（　）思空間",
    "searchWord": "遐思"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "康大有（　）益",
    "searchWord": "裨益"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "題並無（　）補",
    "searchWord": "裨補"
  },
  {
    "char": "稗",
    "zhuyin": "ㄅㄞˋ",
    "clue": "讀野史（　）官",
    "searchWord": "稗官野史"
  },
  {
    "char": "碑",
    "zhuyin": "ㄅㄟ",
    "clue": "歷史古（　）已經被",
    "searchWord": "古碑"
  },
  {
    "char": "脾",
    "zhuyin": "ㄆㄧˊ",
    "clue": "他脾氣（　）氣暴躁",
    "searchWord": "脾氣"
  },
  {
    "char": "俾",
    "zhuyin": "ㄅㄧˋ",
    "clue": "出發，（　）便能按",
    "searchWord": "俾便"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "乾（　）的土地",
    "searchWord": "乾涸"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "他如（　）轍之鮒",
    "searchWord": "涸轍之鮒"
  },
  {
    "char": "錮",
    "zhuyin": "ㄍㄨˋ",
    "clue": "犯被禁（　）在狹窄",
    "searchWord": "禁錮"
  },
  {
    "char": "固",
    "zhuyin": "ㄍㄨˋ",
    "clue": "定要穩（　）",
    "searchWord": "穩固"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "完全枯（　）了",
    "searchWord": "枯涸"
  },
  {
    "char": "聒",
    "zhuyin": "ㄍㄨㄛ",
    "clue": "在樹上（　）（　）",
    "searchWord": "聒噪"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "活寧靜（　）適，令",
    "searchWord": "恬適"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "錯事卻（　）不知恥",
    "searchWord": "恬不知恥"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "風雨颳（　）得天昏",
    "searchWord": "颳風"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "對人刮（　）相看",
    "searchWord": "刮目相看"
  },
  {
    "char": "括",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "動包括（　）多項精",
    "searchWord": "包括"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "稍作小（　）",
    "searchWord": "小憩"
  },
  {
    "char": "憇",
    "zhuyin": "ㄑㄧˋ",
    "clue": "稍作小（　）",
    "searchWord": "小憩"
  },
  {
    "char": "契",
    "zhuyin": "ㄑㄧˋ",
    "clue": "雙方默（　）十足",
    "searchWord": "默契"
  },
  {
    "char": "潔",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "活作風（　）身自好",
    "searchWord": "潔身自好"
  },
  {
    "char": "劫",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "店不幸（　）後餘生",
    "searchWord": "劫後餘生"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "動作敏（　），一下",
    "searchWord": "敏捷"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "捷（　）報頻傳",
    "searchWord": "捷報"
  },
  {
    "char": "竭",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "必須竭（　）進全力",
    "searchWord": "竭盡全力"
  },
  {
    "char": "拮",
    "zhuyin": "ㄐㄧˊ",
    "clue": "頭十分（　）据，需",
    "searchWord": "拮据"
  },
  {
    "char": "据",
    "zhuyin": "ㄐㄩ",
    "clue": "十分拮（　），過得",
    "searchWord": "拮据"
  },
  {
    "char": "詰",
    "zhuyin": "ㄐㄧˊ",
    "clue": "上嚴厲（　）問嫌犯",
    "searchWord": "詰問"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "秋天是（　）子紅了",
    "searchWord": "橘子"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "新鮮的（　）汁酸甜",
    "searchWord": "橘汁"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "件非常（　）手、難",
    "searchWord": "棘手"
  },
  {
    "char": "辣",
    "zhuyin": "ㄌㄚˋ",
    "clue": "菜以麻（　）著稱",
    "searchWord": "麻辣"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "真偽難（　），需要",
    "searchWord": "真偽難辨"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "百般狡（　）也是無",
    "searchWord": "狡辯"
  },
  {
    "char": "辮",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "長長的（　）子，顯",
    "searchWord": "辮子"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "該如何（　）理，請",
    "searchWord": "辦理"
  },
  {
    "char": "瓣",
    "zhuyin": "ㄅㄢˋ",
    "clue": "玫瑰花（　）隨風飄",
    "searchWord": "花瓣"
  },
  {
    "char": "辧",
    "zhuyin": "ㄅㄢˋ",
    "clue": "該如何（　）理，請",
    "searchWord": "辦理"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "病人的（　）搏上",
    "searchWord": "脈搏"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "座山脈（　）綿延數",
    "searchWord": "山脈"
  },
  {
    "char": "博",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他博（　）古通今",
    "searchWord": "博古通今"
  },
  {
    "char": "搏",
    "zhuyin": "ㄅㄛˊ",
    "clue": "行生死（　）鬥",
    "searchWord": "搏鬥"
  },
  {
    "char": "膊",
    "zhuyin": "ㄅㄛˊ",
    "clue": "農夫赤（　）在烈日",
    "searchWord": "赤膊"
  },
  {
    "char": "駁",
    "zhuyin": "ㄅㄛˊ",
    "clue": "當場反（　）",
    "searchWord": "反駁"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "劇烈顛（　）",
    "searchWord": "顛簸"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "夫用簸（　）箕將穀",
    "searchWord": "簸箕"
  },
  {
    "char": "播",
    "zhuyin": "ㄅㄛ",
    "clue": "台正廣（　）著防災",
    "searchWord": "廣播"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "筆專款（　）付給受",
    "searchWord": "撥付"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "輕輕撥（　）琴弦",
    "searchWord": "撥琴"
  },
  {
    "char": "攀",
    "zhuyin": "ㄆㄢ",
    "clue": "壁向上（　）爬",
    "searchWord": "攀爬"
  },
  {
    "char": "樊",
    "zhuyin": "ㄈㄢˊ",
    "clue": "被關在（　）籠裡",
    "searchWord": "樊籠"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "貪（　）的人總",
    "searchWord": "貪婪"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "他用貪（　）的目光",
    "searchWord": "貪婪"
  },
  {
    "char": "焚",
    "zhuyin": "ㄈㄣˊ",
    "clue": "的大火（　）毀了整",
    "searchWord": "焚毀"
  },
  {
    "char": "梵",
    "zhuyin": "ㄈㄢˋ",
    "clue": "濃厚的（　）宇氣息",
    "searchWord": "梵宇"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "思維縝（　）密，天",
    "searchWord": "縝密"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "定要謹（　）",
    "searchWord": "謹慎"
  },
  {
    "char": "填",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "名表上（　）寫正確",
    "searchWord": "填寫"
  },
  {
    "char": "顛",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "人瘋瘋（　）（　）",
    "searchWord": "瘋瘋顛顛"
  },
  {
    "char": "巔",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "了人生（　）峰",
    "searchWord": "巔峰"
  },
  {
    "char": "癲",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他突然（　）癇發作",
    "searchWord": "癲癇"
  },
  {
    "char": "嗔",
    "zhuyin": "ㄔㄣ",
    "clue": "她面露（　）色，顯",
    "searchWord": "嗔色"
  },
  {
    "char": "瞋",
    "zhuyin": "ㄔㄣ",
    "clue": "他氣得（　）目結舌",
    "searchWord": "瞋目結舌"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "事宜審（　）",
    "searchWord": "審慎"
  },
  {
    "char": "鎮",
    "zhuyin": "ㄓㄣˋ",
    "clue": "示警以（　）壓暴亂",
    "searchWord": "鎮壓"
  },
  {
    "char": "震",
    "zhuyin": "ㄓㄣˋ",
    "clue": "大醜聞（　）驚了整",
    "searchWord": "震驚"
  },
  {
    "char": "賑",
    "zhuyin": "ㄓㄣˋ",
    "clue": "款開倉（　）災，濟",
    "searchWord": "賑災"
  },
  {
    "char": "振",
    "zhuyin": "ㄓㄣˋ",
    "clue": "精神，（　）作士氣",
    "searchWord": "振作"
  },
  {
    "char": "陣",
    "zhuyin": "ㄓㄣˋ",
    "clue": "傳來一（　）雷聲",
    "searchWord": "一陣"
  },
  {
    "char": "朕",
    "zhuyin": "ㄓㄣˋ",
    "clue": "自稱為（　）",
    "searchWord": "朕"
  },
  {
    "char": "疹",
    "zhuyin": "ㄓㄣˇ",
    "clue": "許多紅（　），奇癢",
    "searchWord": "紅疹"
  },
  {
    "char": "診",
    "zhuyin": "ㄓㄣˇ",
    "clue": "做詳細（　）斷",
    "searchWord": "診斷"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "校長嚴（　）地批評",
    "searchWord": "嚴厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "番鼓勵（　）志的話",
    "searchWord": "勵志"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "年老店（　）經滄桑",
    "searchWord": "歷經"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "歷史（　）史是不",
    "searchWord": "歷史"
  },
  {
    "char": "曆",
    "zhuyin": "ㄌㄧˋ",
    "clue": "上新日（　）",
    "searchWord": "日曆"
  },
  {
    "char": "靂",
    "zhuyin": "ㄌㄧˋ",
    "clue": "晴天霹（　）的消息",
    "searchWord": "霹靂"
  },
  {
    "char": "礪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "境中磨（　）意志",
    "searchWord": "磨礪"
  },
  {
    "char": "罹",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不幸（　）難的家",
    "searchWord": "罹難"
  },
  {
    "char": "離",
    "zhuyin": "ㄌㄧˊ",
    "clue": "的距離（　）非常遙",
    "searchWord": "距離"
  },
  {
    "char": "籬",
    "zhuyin": "ㄌㄧˊ",
    "clue": "矮的木（　）笆",
    "searchWord": "籬笆"
  },
  {
    "char": "釐",
    "zhuyin": "ㄌㄧˊ",
    "clue": "時，一（　）一毫都",
    "searchWord": "釐毫"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "一對璧（　）",
    "searchWord": "璧儷"
  },
  {
    "char": "荔",
    "zhuyin": "ㄌㄧˋ",
    "clue": "夏天的（　）枝甜美",
    "searchWord": "荔枝"
  },
  {
    "char": "麗",
    "zhuyin": "ㄌㄧˋ",
    "clue": "風景美（　）如畫",
    "searchWord": "美麗"
  },
  {
    "char": "莉",
    "zhuyin": "ㄌㄧˋ",
    "clue": "裡的茉（　）花正悄",
    "searchWord": "茉莉"
  },
  {
    "char": "例",
    "zhuyin": "ㄌㄧˋ",
    "clue": "按照慣（　），我們",
    "searchWord": "慣例"
  },
  {
    "char": "俐",
    "zhuyin": "ㄌㄧˋ",
    "clue": "非常伶（　）乖巧",
    "searchWord": "伶俐"
  },
  {
    "char": "櫪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老馬伏（　），志在",
    "searchWord": "老馬伏櫪"
  },
  {
    "char": "邐",
    "zhuyin": "ㄌㄧˇ",
    "clue": "風景迤（　），令人",
    "searchWord": "迤邐"
  },
  {
    "char": "蠡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "管窺蠡（　）的見解",
    "searchWord": "管窺蠡測"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這對伉（　）常攜手",
    "searchWord": "伉儷"
  },
  {
    "char": "灑",
    "zhuyin": "ㄙㄚˇ",
    "clue": "路面上（　）水除塵",
    "searchWord": "灑水"
  },
  {
    "char": "酒",
    "zhuyin": "ㄐㄧㄡˇ",
    "clue": "車不喝（　），喝酒",
    "searchWord": "酒精"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "萬眾（　）目的決",
    "searchWord": "矚目"
  },
  {
    "char": "屬",
    "zhuyin": "ㄕㄨˇ",
    "clue": "到底歸（　）於誰",
    "searchWord": "歸屬"
  },
  {
    "char": "囑",
    "zhuyin": "ㄓㄨˇ",
    "clue": "人的遺（　）",
    "searchWord": "遺囑"
  },
  {
    "char": "佇",
    "zhuyin": "ㄓㄨˋ",
    "clue": "在雨中（　）立許久",
    "searchWord": "佇立"
  },
  {
    "char": "貯",
    "zhuyin": "ㄓㄨˋ",
    "clue": "需要多（　）備一些",
    "searchWord": "貯備"
  },
  {
    "char": "駐",
    "zhuyin": "ㄓㄨˋ",
    "clue": "隊已進（　）邊防重",
    "searchWord": "進駐"
  },
  {
    "char": "助",
    "zhuyin": "ㄓㄨˋ",
    "clue": "互相幫（　）是美德",
    "searchWord": "幫助"
  },
  {
    "char": "蛀",
    "zhuyin": "ㄓㄨˋ",
    "clue": "容易長（　）牙",
    "searchWord": "蛀牙"
  },
  {
    "char": "築",
    "zhuyin": "ㄓㄨˊ",
    "clue": "在建築（　）工地上",
    "searchWord": "建築"
  },
  {
    "char": "逐",
    "zhuyin": "ㄓㄨˊ",
    "clue": "要隨波（　）流，失",
    "searchWord": "隨波逐流"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨˋ",
    "clue": "這本名（　）被翻譯",
    "searchWord": "名著"
  },
  {
    "char": "署",
    "zhuyin": "ㄕㄨˇ",
    "clue": "親自簽（　）",
    "searchWord": "簽署"
  },
  {
    "char": "曙",
    "zhuyin": "ㄕㄨˇ",
    "clue": "出一線（　）光",
    "searchWord": "曙光"
  },
  {
    "char": "薯",
    "zhuyin": "ㄕㄨˇ",
    "clue": "的馬鈴（　）條非常",
    "searchWord": "馬鈴薯"
  },
  {
    "char": "暑",
    "zhuyin": "ㄕㄨˇ",
    "clue": "漫長的（　）假是孩",
    "searchWord": "暑假"
  },
  {
    "char": "墅",
    "zhuyin": "ㄕㄨˋ",
    "clue": "度假別（　）",
    "searchWord": "別墅"
  },
  {
    "char": "塑",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這件泥（　）作品栩",
    "searchWord": "泥塑"
  },
  {
    "char": "宿",
    "zhuyin": "ㄙㄨˋ",
    "clue": "民宿寄（　）",
    "searchWord": "寄宿"
  },
  {
    "char": "素",
    "zhuyin": "ㄙㄨˋ",
    "clue": "穿著樸（　），不愛",
    "searchWord": "樸素"
  },
  {
    "char": "訴",
    "zhuyin": "ㄙㄨˋ",
    "clue": "民事訴（　）",
    "searchWord": "訴訟"
  },
  {
    "char": "溯",
    "zhuyin": "ㄙㄨˋ",
    "clue": "可以追（　）到百年",
    "searchWord": "追溯"
  },
  {
    "char": "夙",
    "zhuyin": "ㄙㄨˋ",
    "clue": "真是（　）夜匪懈",
    "searchWord": "夙夜匪懈"
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "clue": "十分嚴（　）",
    "searchWord": "嚴肅"
  },
  {
    "char": "簌",
    "zhuyin": "ㄙㄨˋ",
    "clue": "中發出（　）（　）",
    "searchWord": "簌簌"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "的速度（　）極快",
    "searchWord": "速度"
  },
  {
    "char": "橫",
    "zhuyin": "ㄕㄨ",
    "clue": "滄海一（　）微不足",
    "searchWord": "滄海一粟"
  },
  {
    "char": "蘇",
    "zhuyin": "ㄙㄨ",
    "clue": "萬物復（　）",
    "searchWord": "復蘇"
  },
  {
    "char": "酥",
    "zhuyin": "ㄙㄨ",
    "clue": "鳳梨酥（　）口感極",
    "searchWord": "鳳梨酥"
  },
  {
    "char": "俗",
    "zhuyin": "ㄙㄨˊ",
    "clue": "陳規陋（　）",
    "searchWord": "陋俗"
  },
  {
    "char": "悚",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "毛骨悚（　）",
    "searchWord": "毛骨悚然"
  },
  {
    "char": "聳",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "高聳（　）的大樓",
    "searchWord": "高聳"
  },
  {
    "char": "訟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "入了官（　）",
    "searchWord": "官訟"
  },
  {
    "char": "頌",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "為了歌（　）英雄的",
    "searchWord": "歌頌"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "自開車（　）我到火",
    "searchWord": "送行"
  },
  {
    "char": "宋",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這是（　）朝時期",
    "searchWord": "宋朝"
  },
  {
    "char": "誦",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "大聲朗（　）課文",
    "searchWord": "朗誦"
  },
  {
    "char": "松",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "棵古松（　）迎風挺",
    "searchWord": "古松"
  },
  {
    "char": "鬆",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "可以放（　）一下",
    "searchWord": "放鬆"
  },
  {
    "char": "嵩",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "尊稱為（　）山",
    "searchWord": "嵩山"
  },
  {
    "char": "慫",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "朋友的（　）恿下",
    "searchWord": "慫恿"
  },
  {
    "char": "懍",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "無不畏（　）遵命",
    "searchWord": "畏懍"
  },
  {
    "char": "凜",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "寒風（　）（　）",
    "searchWord": "寒風凜凜"
  },
  {
    "char": "鄰",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "不如近（　），鄰里",
    "searchWord": "近鄰"
  },
  {
    "char": "臨",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "貴賓光（　）指導",
    "searchWord": "光臨"
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "始森林（　）木茂密",
    "searchWord": "森林"
  },
  {
    "char": "淋",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "被大雨（　）得像隻",
    "searchWord": "淋雨"
  },
  {
    "char": "鱗",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "上的鱗（　）片在陽",
    "searchWord": "鱗片"
  },
  {
    "char": "麟",
    "zhuyin": "ㄌㄧˊ",
    "clue": "界鳳毛（　）角般的",
    "searchWord": "鳳毛麟角"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "萬不要（　）嗇",
    "searchWord": "吝嗇"
  },
  {
    "char": "玲",
    "zhuyin": "ㄌㄧˊ",
    "clue": "雕小巧（　）瓏，十",
    "searchWord": "玲瓏"
  },
  {
    "char": "伶",
    "zhuyin": "ㄌㄧˊ",
    "clue": "子口齒（　）俐，討",
    "searchWord": "伶俐"
  },
  {
    "char": "聆",
    "zhuyin": "ㄌㄧˊ",
    "clue": "靜靜地（　）聽鋼琴",
    "searchWord": "聆聽"
  },
  {
    "char": "齡",
    "zhuyin": "ㄌㄧˊ",
    "clue": "木的年（　）已超過",
    "searchWord": "年齡"
  },
  {
    "char": "羚",
    "zhuyin": "ㄌㄧˊ",
    "clue": "成群的（　）羊奔馳",
    "searchWord": "羚羊"
  },
  {
    "char": "零",
    "zhuyin": "ㄌㄧˊ",
    "clue": "剛好為（　）",
    "searchWord": "零錢"
  },
  {
    "char": "鈴",
    "zhuyin": "ㄌㄧˊ",
    "clue": "下課（　）聲響起",
    "searchWord": "鈴聲"
  },
  {
    "char": "凌",
    "zhuyin": "ㄌㄧˊ",
    "clue": "經常（　）侮弱小",
    "searchWord": "凌侮"
  },
  {
    "char": "陵",
    "zhuyin": "ㄌㄧˊ",
    "clue": "帝王的（　）寢遺址",
    "searchWord": "陵寢"
  },
  {
    "char": "綾",
    "zhuyin": "ㄌㄧˊ",
    "clue": "高級的（　）羅綢緞",
    "searchWord": "綾羅綢緞"
  },
  {
    "char": "嶺",
    "zhuyin": "ㄌㄧˇ",
    "clue": "重重山（　），終於",
    "searchWord": "山嶺"
  },
  {
    "char": "領",
    "zhuyin": "ㄌㄧˇ",
    "clue": "他帶（　）團隊建",
    "searchWord": "帶領"
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這條禁（　）自即日",
    "searchWord": "禁令"
  }
];
