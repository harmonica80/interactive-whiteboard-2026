// 一字千金易錯字庫 - 預先準備的 500 題超豐富題庫
const CHARACTER_TEST_POOL = [
  {
    "char": "熱",
    "zhuyin": "ㄖㄜˋ",
    "clue": "網路上引起了（　）烈討論。",
    "searchWord": "熱烈"
  },
  {
    "char": "尷",
    "zhuyin": "ㄍㄢ",
    "clue": "叫錯名字，場面十分（　）尬。",
    "searchWord": "尷尬"
  },
  {
    "char": "尬",
    "zhuyin": "ㄍㄚˋ",
    "clue": "台上忘詞，氣氛尷（　）。",
    "searchWord": "尷尬"
  },
  {
    "char": "肺",
    "zhuyin": "ㄈㄟˋ",
    "clue": "發自（　）腑的真心話。",
    "searchWord": "發自肺腑"
  },
  {
    "char": "冒",
    "zhuyin": "ㄇㄠˋ",
    "clue": "（　）著風雨前行。",
    "searchWord": "冒著風雨"
  },
  {
    "char": "梁",
    "zhuyin": "ㄌㄧㄤˊ",
    "clue": "做人絕不能偷（　）換柱。",
    "searchWord": "偷梁換柱"
  },
  {
    "char": "鼎",
    "zhuyin": "ㄉㄧㄥˇ",
    "clue": "感謝大家（　）力相助。",
    "searchWord": "鼎力相助"
  },
  {
    "char": "憋",
    "zhuyin": "ㄅㄧㄝ",
    "clue": "快要（　）不住笑了。",
    "searchWord": "憋不住"
  },
  {
    "char": "戳",
    "zhuyin": "ㄔㄨㄛ",
    "clue": "漏洞百出，一（　）即破。",
    "searchWord": "一戳即破"
  },
  {
    "char": "蒐",
    "zhuyin": "ㄙㄡ",
    "clue": "努力（　）集相關證據。",
    "searchWord": "蒐集證據"
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "案件背後隱藏著（　）後黑手。",
    "searchWord": "幕後黑手"
  },
  {
    "char": "慕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "吸引無數樂迷（　）名前來。",
    "searchWord": "慕名前來"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "視線模糊，難以（　）明方向。",
    "searchWord": "辨明方向"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "他在辯論大賽中（　）才無礙。",
    "searchWord": "辯才無礙"
  },
  {
    "char": "磬",
    "zhuyin": "ㄑㄧㄥˋ",
    "clue": "家境貧寒，真可說是室如懸（　）。",
    "searchWord": "室如懸磬"
  },
  {
    "char": "磐",
    "zhuyin": "ㄆㄢˊ",
    "clue": "感情堅如（　）石，不受挑撥。",
    "searchWord": "堅如磐石"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "他因行為不檢而聲名狼（　）。",
    "searchWord": "聲名狼藉"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "在政壇上他只是一個（　）籍無名的新人。",
    "searchWord": "籍籍無名"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "做學問一定要再接再（　）。",
    "searchWord": "再接再厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老師說的話極具鼓（　）作用。",
    "searchWord": "鼓勵"
  },
  {
    "char": "輟",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "他家境貧困，被迫（　）學做工。",
    "searchWord": "輟學"
  },
  {
    "char": "綴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "夜空中點（　）著無數亮麗的星星。",
    "searchWord": "點綴"
  },
  {
    "char": "啜",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "聽到壞消息，她躲在角落低聲（　）泣。",
    "searchWord": "啜泣"
  },
  {
    "char": "緝",
    "zhuyin": "ㄑㄧˋ",
    "clue": "警方發布通（　）令追捕這名逃犯。",
    "searchWord": "通緝"
  },
  {
    "char": "輯",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這本書的（　）排非常混亂，不易閱讀。",
    "searchWord": "編輯"
  },
  {
    "char": "揖",
    "zhuyin": "ㄧ",
    "clue": "見面時，他向長輩作（　）行禮。",
    "searchWord": "作揖"
  },
  {
    "char": "葺",
    "zhuyin": "ㄑㄧˋ",
    "clue": "這間老房子常年漏水，需要修（　）。",
    "searchWord": "修葺"
  },
  {
    "char": "戢",
    "zhuyin": "ㄐㄧˊ",
    "clue": "兩國決定偃兵（　）戈，恢復和平。",
    "searchWord": "偃兵戢戈"
  },
  {
    "char": "戈",
    "zhuyin": "ㄍㄜ",
    "clue": "兩國決定偃武修（　），停戰和談。",
    "searchWord": "偃武修戈"
  },
  {
    "char": "戌",
    "zhuyin": "ㄒㄩ",
    "clue": "地支順序為申、酉、（　）、亥。",
    "searchWord": "戌"
  },
  {
    "char": "戊",
    "zhuyin": "ㄨˋ",
    "clue": "天干順序為甲、乙、丙、丁、（　）。",
    "searchWord": "戊"
  },
  {
    "char": "戍",
    "zhuyin": "ㄕㄨˋ",
    "clue": "古代戰士奉命前往邊疆防（　）。",
    "searchWord": "防戍"
  },
  {
    "char": "戎",
    "zhuyin": "ㄖㄨㄥˊ",
    "clue": "將軍決定投筆從（　），報效國家。",
    "searchWord": "投筆從戎"
  },
  {
    "char": "冗",
    "zhuyin": "ㄖㄨㄥˇ",
    "clue": "這篇文章贅字太多，顯得相當（　）長。",
    "searchWord": "冗長"
  },
  {
    "char": "沈",
    "zhuyin": "開",
    "clue": "這起事件在社會上引起了（　）默。",
    "searchWord": "沈默"
  },
  {
    "char": "枕",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他們夫妻同甘共苦，可說是（　）戈待旦。",
    "searchWord": "枕戈待旦"
  },
  {
    "char": "耽",
    "zhuyin": "ㄉㄢ",
    "clue": "沉迷電玩只會（　）誤學業與人生。",
    "searchWord": "耽誤"
  },
  {
    "char": "眈",
    "zhuyin": "ㄉㄢ",
    "clue": "強國對弱國虎視（　）（　）。",
    "searchWord": "虎視眈眈"
  },
  {
    "char": "諂",
    "zhuyin": "ㄔㄢˇ",
    "clue": "他極力（　）媚巴結主管，真令人反感。",
    "searchWord": "諂媚"
  },
  {
    "char": "陷",
    "zhuyin": "ㄒㄧㄢˋ",
    "clue": "車子在泥沼中深（　），動彈不得。",
    "searchWord": "深陷"
  },
  {
    "char": "焰",
    "zhuyin": "ㄧㄢˋ",
    "clue": "大火的烈（　）沖天，景象駭人。",
    "searchWord": "烈焰"
  },
  {
    "char": "掐",
    "zhuyin": "ㄑㄧㄚ",
    "clue": "他緊張得（　）了自己大腿一下。",
    "searchWord": "掐"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這件瓷器美中不足，有一處微小的（　）疵。",
    "searchWord": "瑕疵"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "假日他忙著照料病人，無（　）顧及娛樂。",
    "searchWord": "無暇"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這件事情迫在眉睫，不容（　）想。",
    "searchWord": "暇想"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這塊美玉潔白無（　），價值連城。",
    "searchWord": "潔白無瑕"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "他忙得焦頭爛額，應接不（　）。",
    "searchWord": "應接不暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這首曲子留給人們無窮的（　）思空間。",
    "searchWord": "遐思"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "多運動對於健康大有（　）益。",
    "searchWord": "裨益"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "這對解決問題並無（　）補。",
    "searchWord": "裨補"
  },
  {
    "char": "稗",
    "zhuyin": "ㄅㄞˋ",
    "clue": "他最喜歡閱讀野史（　）官。",
    "searchWord": "稗官野史"
  },
  {
    "char": "碑",
    "zhuyin": "ㄅㄟ",
    "clue": "這塊歷史古（　）已經被風化得很嚴重。",
    "searchWord": "古碑"
  },
  {
    "char": "脾",
    "zhuyin": "ㄆㄧˊ",
    "clue": "他脾氣（　）氣暴躁，動不動就發火。",
    "searchWord": "脾氣"
  },
  {
    "char": "俾",
    "zhuyin": "ㄅㄧˋ",
    "clue": "請大家準時出發，（　）便能按時到達目的地。",
    "searchWord": "俾便"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "乾（　）的土地急需雨水滋潤。",
    "searchWord": "乾涸"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "面臨困難時，他如（　）轍之鮒般焦急。",
    "searchWord": "涸轍之鮒"
  },
  {
    "char": "錮",
    "zhuyin": "ㄍㄨˋ",
    "clue": "罪犯被禁（　）在狹窄的牢房裡。",
    "searchWord": "禁錮"
  },
  {
    "char": "固",
    "zhuyin": "ㄍㄨˋ",
    "clue": "做事情的基礎一定要穩（　）。",
    "searchWord": "穩固"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "烈日下，這口古井已經完全枯（　）了。",
    "searchWord": "枯涸"
  },
  {
    "char": "聒",
    "zhuyin": "ㄍㄨㄛ",
    "clue": "麻雀在樹上（　）（　）噪個不停，很吵人。",
    "searchWord": "聒噪"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "鄉村生活寧靜（　）適，令人嚮往。",
    "searchWord": "恬適"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "他做錯事卻（　）不知恥，真叫人氣憤。",
    "searchWord": "恬不知恥"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "這場暴風雨颳（　）得天昏地暗。",
    "searchWord": "颳風"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "我們做人做事一定要對人刮（　）相看。",
    "searchWord": "刮目相看"
  },
  {
    "char": "括",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "本次活動包括（　）多項精彩表演項目。",
    "searchWord": "包括"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "登山客在涼亭內稍作小（　）。",
    "searchWord": "小憩"
  },
  {
    "char": "憇",
    "zhuyin": "ㄑㄧˋ",
    "clue": "登山客在涼亭內稍作小（　）。",
    "searchWord": "小憩"
  },
  {
    "char": "契",
    "zhuyin": "ㄑㄧˋ",
    "clue": "雙方默（　）十足，配合同步。",
    "searchWord": "默契"
  },
  {
    "char": "潔",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他生活作風（　）身自好，不受利誘。",
    "searchWord": "潔身自好"
  },
  {
    "char": "劫",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "這家商店不幸（　）後餘生，重新開張。",
    "searchWord": "劫後餘生"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他的動作敏（　），一下就爬上了樹。",
    "searchWord": "敏捷"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "捷（　）報頻傳，全軍士氣大振。",
    "searchWord": "捷報"
  },
  {
    "char": "竭",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "我們必須竭（　）進全力來完成這項任務。",
    "searchWord": "竭盡全力"
  },
  {
    "char": "拮",
    "zhuyin": "ㄐㄧˊ",
    "clue": "最近他手頭十分（　）据，需要借錢度日。",
    "searchWord": "拮据"
  },
  {
    "char": "据",
    "zhuyin": "ㄐㄩ",
    "clue": "最近他手頭十分拮（　），過得很辛苦。",
    "searchWord": "拮据"
  },
  {
    "char": "詰",
    "zhuyin": "ㄐㄧˊ",
    "clue": "法官在法庭上嚴厲（　）問嫌犯。",
    "searchWord": "詰問"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "秋天是（　）子紅了的豐收季節。",
    "searchWord": "橘子"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "這杯新鮮的（　）汁酸甜可口。",
    "searchWord": "橘汁"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這是一件非常（　）手、難以處理的案件。",
    "searchWord": "棘手"
  },
  {
    "char": "辣",
    "zhuyin": "ㄌㄚˋ",
    "clue": "四川菜以麻（　）著稱，風味獨特。",
    "searchWord": "麻辣"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "真偽難（　），需要專業鑑定。",
    "searchWord": "真偽難辨"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "在事實面前，百般狡（　）也是無濟於事。",
    "searchWord": "狡辯"
  },
  {
    "char": "辮",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "她頭上綁著兩條長長的（　）子，顯得青春洋溢。",
    "searchWord": "辮子"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事情該如何（　）理，請長官指示。",
    "searchWord": "辦理"
  },
  {
    "char": "瓣",
    "zhuyin": "ㄅㄢˋ",
    "clue": "玫瑰花（　）隨風飄落，滿地芳香。",
    "searchWord": "花瓣"
  },
  {
    "char": "辧",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事情該如何（　）理，請長官指示。",
    "searchWord": "辦理"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "醫生的手指搭在病人的（　）搏上。",
    "searchWord": "脈搏"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "這座山脈（　）綿延數百公里。",
    "searchWord": "山脈"
  },
  {
    "char": "博",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他博（　）古通今，學問十分淵博。",
    "searchWord": "博古通今"
  },
  {
    "char": "搏",
    "zhuyin": "ㄅㄛˊ",
    "clue": "這隻獵豹正與獵物進行生死（　）鬥。",
    "searchWord": "搏鬥"
  },
  {
    "char": "膊",
    "zhuyin": "ㄅㄛˊ",
    "clue": "老農夫赤（　）在烈日下辛苦耕作。",
    "searchWord": "赤膊"
  },
  {
    "char": "駁",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他的論點漏洞百出，被對手當場反（　）。",
    "searchWord": "反駁"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "車子在崎嶇的山路上劇烈顛（　）。",
    "searchWord": "顛簸"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "農夫用簸（　）箕將穀物篩選乾淨。",
    "searchWord": "簸箕"
  },
  {
    "char": "播",
    "zhuyin": "ㄅㄛ",
    "clue": "電視台正廣（　）著防災即時警報。",
    "searchWord": "廣播"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "請把這筆專款（　）付給受災戶。",
    "searchWord": "撥付"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "他用手指輕輕撥（　）琴弦，樂聲悠揚。",
    "searchWord": "撥琴"
  },
  {
    "char": "攀",
    "zhuyin": "ㄆㄢ",
    "clue": "小常青藤沿著牆壁向上（　）爬。",
    "searchWord": "攀爬"
  },
  {
    "char": "樊",
    "zhuyin": "ㄈㄢˊ",
    "clue": "鳥兒被關在（　）籠裡，失去了自由。",
    "searchWord": "樊籠"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "貪（　）的人總是得寸進尺、不知滿足。",
    "searchWord": "貪婪"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "他用貪（　）的目光盯著那袋黃金。",
    "searchWord": "貪婪"
  },
  {
    "char": "焚",
    "zhuyin": "ㄈㄣˊ",
    "clue": "這場突如其來的大火（　）毀了整片森林。",
    "searchWord": "焚毀"
  },
  {
    "char": "梵",
    "zhuyin": "ㄈㄢˋ",
    "clue": "這裡的寺廟散發著濃厚的（　）宇氣息。",
    "searchWord": "梵宇"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他的計畫思維縝（　）密，天衣無縫。",
    "searchWord": "縝密"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "事關重大，做決定前一定要謹（　）。",
    "searchWord": "謹慎"
  },
  {
    "char": "填",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "請在報名表上（　）寫正確聯絡電話。",
    "searchWord": "填寫"
  },
  {
    "char": "顛",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "經歷這場浩劫，他整個人瘋瘋（　）（　）。",
    "searchWord": "瘋瘋顛顛"
  },
  {
    "char": "巔",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "經過艱苦努力，他終於攀登上了人生（　）峰。",
    "searchWord": "巔峰"
  },
  {
    "char": "癲",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他突然（　）癇發作，口吐白沫。",
    "searchWord": "癲癇"
  },
  {
    "char": "嗔",
    "zhuyin": "ㄔㄣ",
    "clue": "她面露（　）色，顯然對這安排很不滿。",
    "searchWord": "嗔色"
  },
  {
    "char": "瞋",
    "zhuyin": "ㄔㄣ",
    "clue": "他氣得（　）目結舌，一句話也說不出來。",
    "searchWord": "瞋目結舌"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "小心駛得萬年船，行事宜審（　）。",
    "searchWord": "審慎"
  },
  {
    "char": "鎮",
    "zhuyin": "ㄓㄣˋ",
    "clue": "警察鳴槍示警以（　）壓暴亂。",
    "searchWord": "鎮壓"
  },
  {
    "char": "震",
    "zhuyin": "ㄓㄣˋ",
    "clue": "這起大醜聞（　）驚了整個社會。",
    "searchWord": "震驚"
  },
  {
    "char": "賑",
    "zhuyin": "ㄓㄣˋ",
    "clue": "政府撥款開倉（　）災，濟助災民。",
    "searchWord": "賑災"
  },
  {
    "char": "振",
    "zhuyin": "ㄓㄣˋ",
    "clue": "我們必須打起精神，（　）作士氣。",
    "searchWord": "振作"
  },
  {
    "char": "陣",
    "zhuyin": "ㄓㄣˋ",
    "clue": "天空中突然傳來一（　）雷聲。",
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
    "clue": "他身上起了許多紅（　），奇癢無比。",
    "searchWord": "紅疹"
  },
  {
    "char": "診",
    "zhuyin": "ㄓㄣˇ",
    "clue": "醫生正在為病人做詳細（　）斷。",
    "searchWord": "診斷"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "校長嚴（　）地批評了犯錯的學生。",
    "searchWord": "嚴厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這番鼓勵（　）志的話，激發了他的鬥志。",
    "searchWord": "勵志"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這家百年老店（　）經滄桑，依然屹立不搖。",
    "searchWord": "歷經"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "歷史（　）史是不容抹滅的鏡子。",
    "searchWord": "歷史"
  },
  {
    "char": "曆",
    "zhuyin": "ㄌㄧˋ",
    "clue": "新年到了，家家戶戶換上新日（　）。",
    "searchWord": "日曆"
  },
  {
    "char": "靂",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這晴天霹（　）的消息，打擊了他。",
    "searchWord": "霹靂"
  },
  {
    "char": "礪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "我們要在艱苦的環境中磨（　）意志。",
    "searchWord": "磨礪"
  },
  {
    "char": "罹",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不幸（　）難的家屬在現場痛哭失聲。",
    "searchWord": "罹難"
  },
  {
    "char": "離",
    "zhuyin": "ㄌㄧˊ",
    "clue": "相隔兩地，兩人的距離（　）非常遙遠。",
    "searchWord": "距離"
  },
  {
    "char": "籬",
    "zhuyin": "ㄌㄧˊ",
    "clue": "小院子周圍圍著一圈矮矮的木（　）笆。",
    "searchWord": "籬笆"
  },
  {
    "char": "釐",
    "zhuyin": "ㄌㄧˊ",
    "clue": "做精密測量時，一（　）一毫都不能出錯。",
    "searchWord": "釐毫"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這對佳偶相得益彰，真是一對璧（　）。",
    "searchWord": "璧儷"
  },
  {
    "char": "荔",
    "zhuyin": "ㄌㄧˋ",
    "clue": "夏天的（　）枝甜美多汁，非常好吃。",
    "searchWord": "荔枝"
  },
  {
    "char": "麗",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這裡的風景美（　）如畫，賞心悅目。",
    "searchWord": "美麗"
  },
  {
    "char": "莉",
    "zhuyin": "ㄌㄧˋ",
    "clue": "庭院裡的茉（　）花正悄悄綻放。",
    "searchWord": "茉莉"
  },
  {
    "char": "例",
    "zhuyin": "ㄌㄧˋ",
    "clue": "按照慣（　），我們每年都會舉辦旅遊。",
    "searchWord": "慣例"
  },
  {
    "char": "俐",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這女孩做事非常伶（　）乖巧。",
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
    "clue": "沿途風景迤（　），令人目不暇給。",
    "searchWord": "迤邐"
  },
  {
    "char": "蠡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "管窺蠡（　）的見解，難免以偏概全。",
    "searchWord": "管窺蠡測"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "他們這對伉（　）常攜手出席公益活動。",
    "searchWord": "伉儷"
  },
  {
    "char": "灑",
    "zhuyin": "ㄙㄚˇ",
    "clue": "清潔工在路面上（　）水除塵。",
    "searchWord": "灑水"
  },
  {
    "char": "酒",
    "zhuyin": "ㄐㄧㄡˇ",
    "clue": "開車不喝（　），喝酒不開車。",
    "searchWord": "酒精"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "萬眾（　）目的決賽即將在今晚引爆。",
    "searchWord": "矚目"
  },
  {
    "char": "屬",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這件失物到底歸（　）於誰？",
    "searchWord": "歸屬"
  },
  {
    "char": "囑",
    "zhuyin": "ㄓㄨˇ",
    "clue": "臨終前，他留下了感人的遺（　）。",
    "searchWord": "遺囑"
  },
  {
    "char": "佇",
    "zhuyin": "ㄓㄨˋ",
    "clue": "他在雨中（　）立許久，默默流淚。",
    "searchWord": "佇立"
  },
  {
    "char": "貯",
    "zhuyin": "ㄓㄨˋ",
    "clue": "我們需要多（　）備一些防汛沙包。",
    "searchWord": "貯備"
  },
  {
    "char": "駐",
    "zhuyin": "ㄓㄨˋ",
    "clue": "大批軍隊已進（　）邊防重地。",
    "searchWord": "進駐"
  },
  {
    "char": "助",
    "zhuyin": "ㄓㄨˋ",
    "clue": "出門在外，互相幫（　）是美德。",
    "searchWord": "幫助"
  },
  {
    "char": "蛀",
    "zhuyin": "ㄓㄨˋ",
    "clue": "小孩子糖吃太多，容易長（　）牙。",
    "searchWord": "蛀牙"
  },
  {
    "char": "築",
    "zhuyin": "ㄓㄨˊ",
    "clue": "工程師正在建築（　）工地上巡視。",
    "searchWord": "建築"
  },
  {
    "char": "逐",
    "zhuyin": "ㄓㄨˊ",
    "clue": "我們一定要隨波（　）流，失去自我。",
    "searchWord": "隨波逐流"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨˋ",
    "clue": "這本名（　）被翻譯成多國語言。",
    "searchWord": "名著"
  },
  {
    "char": "署",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這份公文上需要局長親自簽（　）。",
    "searchWord": "簽署"
  },
  {
    "char": "曙",
    "zhuyin": "ㄕㄨˇ",
    "clue": "黑夜終將過去，東方已露出一線（　）光。",
    "searchWord": "曙光"
  },
  {
    "char": "薯",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這盤剛炸好的馬鈴（　）條非常酥脆。",
    "searchWord": "馬鈴薯"
  },
  {
    "char": "暑",
    "zhuyin": "ㄕㄨˇ",
    "clue": "漫長的（　）假是孩子們最快樂的時光。",
    "searchWord": "暑假"
  },
  {
    "char": "墅",
    "zhuyin": "ㄕㄨˋ",
    "clue": "他們在郊區買了一棟度假別（　）。",
    "searchWord": "別墅"
  },
  {
    "char": "塑",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這件泥（　）作品栩栩如生，技藝精湛。",
    "searchWord": "泥塑"
  },
  {
    "char": "宿",
    "zhuyin": "ㄙㄨˋ",
    "clue": "今晚我們決定在這家民宿寄（　）。",
    "searchWord": "寄宿"
  },
  {
    "char": "素",
    "zhuyin": "ㄙㄨˋ",
    "clue": "她平時穿著樸（　），不愛奢華。",
    "searchWord": "樸素"
  },
  {
    "char": "訴",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他向法庭提起了民事訴（　）。",
    "searchWord": "訴訟"
  },
  {
    "char": "溯",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這項歷史傳統可以追（　）到百年前。",
    "searchWord": "追溯"
  },
  {
    "char": "夙",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他終日奔波，真是（　）夜匪懈。",
    "searchWord": "夙夜匪懈"
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "clue": "大堂之上，氣氛十分嚴（　）。",
    "searchWord": "嚴肅"
  },
  {
    "char": "簌",
    "zhuyin": "ㄙㄨˋ",
    "clue": "落葉在風中發出（　）（　）的聲響。",
    "searchWord": "簌簌"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這輛跑車的速度（　）極快，非常危險。",
    "searchWord": "速度"
  },
  {
    "char": "粟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "我們滄海一（　）微不足道。",
    "searchWord": "滄海一粟"
  },
  {
    "char": "蘇",
    "zhuyin": "ㄙㄨ",
    "clue": "春天到了，大地萬物復（　）。",
    "searchWord": "復蘇"
  },
  {
    "char": "酥",
    "zhuyin": "ㄙㄨ",
    "clue": "這家糕餅店的鳳梨酥（　）口感極佳。",
    "searchWord": "鳳梨酥"
  },
  {
    "char": "俗",
    "zhuyin": "ㄙㄨˊ",
    "clue": "我們應該屏除 these 陳規陋（　）。",
    "searchWord": "陋俗"
  },
  {
    "char": "悚",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "這部恐怖電影的情節令人毛骨悚（　）。",
    "searchWord": "毛骨悚然"
  },
  {
    "char": "聳",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "高聳（　）的大樓直插雲霄。",
    "searchWord": "高聳"
  },
  {
    "char": "訟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "兩家公司因專利問題陷入了官（　）。",
    "searchWord": "官訟"
  },
  {
    "char": "頌",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這首詩是為了歌（　）英雄的功績。",
    "searchWord": "歌頌"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "爸爸親自開車（　）我到火車站。",
    "searchWord": "送行"
  },
  {
    "char": "宋",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這是（　）朝時期的青瓷花瓶。",
    "searchWord": "宋朝"
  },
  {
    "char": "誦",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "小學生正大聲朗（　）課文。",
    "searchWord": "朗誦"
  },
  {
    "char": "松",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "這棵古松（　）迎風挺立，顯得蒼勁。",
    "searchWord": "古松"
  },
  {
    "char": "鬆",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "工作完成了，他終於可以放（　）一下。",
    "searchWord": "放鬆"
  },
  {
    "char": "嵩",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "這座高山被尊稱為（　）山。",
    "searchWord": "嵩山"
  },
  {
    "char": "慫",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "在壞朋友的（　）恿下，他犯了錯。",
    "searchWord": "慫恿"
  },
  {
    "char": "懍",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "見到長官，部屬們無不畏（　）遵命。",
    "searchWord": "畏懍"
  },
  {
    "char": "凜",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "寒風（　）（　），路上行人稀少。",
    "searchWord": "寒風凜凜"
  },
  {
    "char": "鄰",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "遠親不如近（　），鄰里要和睦。",
    "searchWord": "近鄰"
  },
  {
    "char": "臨",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "歡迎各位貴賓光（　）指導。",
    "searchWord": "光臨"
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "這座原始森林（　）木茂密。",
    "searchWord": "森林"
  },
  {
    "char": "淋",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "他沒帶傘，被大雨（　）得像隻落湯雞。",
    "searchWord": "淋雨"
  },
  {
    "char": "鱗",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "魚身上的鱗（　）片在陽光下閃閃發光。",
    "searchWord": "鱗片"
  },
  {
    "char": "麟",
    "zhuyin": "ㄌㄧˊ",
    "clue": "他是業界鳳毛（　）角般的頂尖人才。",
    "searchWord": "鳳毛麟角"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "做公益要慷慨，千萬不要（　）嗇。",
    "searchWord": "吝嗇"
  },
  {
    "char": "玲",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這件玉雕小巧（　）瓏，十分精美。",
    "searchWord": "玲瓏"
  },
  {
    "char": "伶",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這孩子口齒（　）俐，討人喜歡。",
    "searchWord": "伶俐"
  },
  {
    "char": "聆",
    "zhuyin": "ㄌㄧˊ",
    "clue": "全場觀眾靜靜地（　）聽鋼琴演奏。",
    "searchWord": "聆聽"
  },
  {
    "char": "齡",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這棵老神木的年（　）已超過千年。",
    "searchWord": "年齡"
  },
  {
    "char": "羚",
    "zhuyin": "ㄌㄧˊ",
    "clue": "大草原上有成群的（　）羊奔馳。",
    "searchWord": "羚羊"
  },
  {
    "char": "零",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這筆帳目核對後，剛好為（　）。",
    "searchWord": "零錢"
  },
  {
    "char": "鈴",
    "zhuyin": "ㄌㄧˊ",
    "clue": "下課（　）聲響起，學生歡呼出教室。",
    "searchWord": "鈴聲"
  },
  {
    "char": "凌",
    "zhuyin": "ㄌㄧˊ",
    "clue": "他仗勢欺人，經常（　）侮弱小。",
    "searchWord": "凌侮"
  },
  {
    "char": "陵",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這是古代帝王的（　）寢遺址。",
    "searchWord": "陵寢"
  },
  {
    "char": "綾",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這件衣服是用高級的（　）羅綢緞製成。",
    "searchWord": "綾羅綢緞"
  },
  {
    "char": "嶺",
    "zhuyin": "ㄌㄧˇ",
    "clue": "我們翻越了重重山（　），終於到達目的地。",
    "searchWord": "山嶺"
  },
  {
    "char": "領",
    "zhuyin": "ㄌㄧˇ",
    "clue": "他帶（　）團隊建立了優勢。",
    "searchWord": "帶領"
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這條禁（　）自即日起正式實施。",
    "searchWord": "禁令"
  },
  {
    "char": "另",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這件事情我們必須（　）作打算。",
    "searchWord": "另作打算"
  },
  {
    "char": "靈",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這個方法非常有效，真的很（　）驗。",
    "searchWord": "靈驗"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "請不要（　）惜給予他人掌聲。",
    "searchWord": "吝惜"
  },
  {
    "char": "濘",
    "zhuyin": "ㄋㄧㄥˋ",
    "clue": "雨後的山路泥（　）不堪，極難行走。",
    "searchWord": "泥濘"
  },
  {
    "char": "濘",
    "zhuyin": "ㄋㄧㄥˋ",
    "clue": "車子在泥（　）的道路上打滑。",
    "searchWord": "泥濘"
  },
  {
    "char": "寧",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "鄉村的夜晚十分安（　）靜謐。",
    "searchWord": "安寧"
  },
  {
    "char": "檸",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "新鮮的（　）檬紅茶非常消暑。",
    "searchWord": "檸檬"
  },
  {
    "char": "獰",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "歹徒面目（　）惡，令人害怕。",
    "searchWord": "面目獰惡"
  },
  {
    "char": "凝",
    "zhuyin": "ㄋㄧㄥˊ",
    "clue": "水蒸氣遇冷會（　）結成水滴。",
    "searchWord": "凝聚"
  },
  {
    "char": "擬",
    "zhuyin": "ㄋㄧˇ",
    "clue": "政府正在草（　）新的防疫規範。",
    "searchWord": "草擬"
  },
  {
    "char": "疑",
    "zhuyin": "ㄧˊ",
    "clue": "對於他的說詞，我深表懷（　）。",
    "searchWord": "懷疑"
  },
  {
    "char": "礙",
    "zhuyin": "ㄞˋ",
    "clue": "請把雜物搬開，以免阻（　）交通。",
    "searchWord": "阻礙"
  },
  {
    "char": "癡",
    "zhuyin": "ㄔ",
    "clue": "他對集郵非常著迷，簡直是個郵（　）。",
    "searchWord": "郵癡"
  },
  {
    "char": "痴",
    "zhuyin": "ㄔ",
    "clue": "看他那（　）迷的模樣，真是無可救藥。",
    "searchWord": "痴迷"
  },
  {
    "char": "嗤",
    "zhuyin": "ㄔ",
    "clue": "對於這荒謬的說法，大家都（　）之以鼻。",
    "searchWord": "嗤之以鼻"
  },
  {
    "char": "蚩",
    "zhuyin": "ㄔ",
    "clue": "古代傳說中，黃帝曾與（　）尤大戰。",
    "searchWord": "蚩尤"
  },
  {
    "char": "笞",
    "zhuyin": "ㄔ",
    "clue": "古代法庭常用鞭（　）之刑處罰犯人。",
    "searchWord": "鞭笞"
  },
  {
    "char": "疵",
    "zhuyin": "ㄘ",
    "clue": "這件名牌衣服有一點小瑕（　），因而降價。",
    "searchWord": "瑕疵"
  },
  {
    "char": "雌",
    "zhuyin": "ㄘ",
    "clue": "這隻鳥的羽毛顏色較為暗淡，是隻（　）鳥。",
    "searchWord": "雌鳥"
  },
  {
    "char": "茨",
    "zhuyin": "ㄘ",
    "clue": "茅（　）草屋是古代貧寒人家的住所。",
    "searchWord": "茅茨"
  },
  {
    "char": "慈",
    "zhuyin": "ㄘˊ",
    "clue": "（　）祥的母親總是溫柔地看著我們。",
    "searchWord": "慈祥"
  },
  {
    "char": "磁",
    "zhuyin": "ㄘˊ",
    "clue": "（　）鐵具有吸引鐵質的物理特性。",
    "searchWord": "磁鐵"
  },
  {
    "char": "詞",
    "zhuyin": "ㄘˊ",
    "clue": "這首流行歌的歌詞（　）寫得非常感人。",
    "searchWord": "歌詞"
  },
  {
    "char": "辭",
    "zhuyin": "ㄘˊ",
    "clue": "他因志趣不合，決定（　）去這份工作。",
    "searchWord": "辭去"
  },
  {
    "char": "祠",
    "zhuyin": "ㄘˊ",
    "clue": "逢年過節，村民會到宗（　）祭拜祖先。",
    "searchWord": "宗祠"
  },
  {
    "char": "賜",
    "zhuyin": "ㄙˋ",
    "clue": "感謝上天賞（　）我們豐收的成果。",
    "searchWord": "賞賜"
  },
  {
    "char": "伺",
    "zhuyin": "ㄙˋ",
    "clue": "歹徒正（　）機而動，尋找作案目標。",
    "searchWord": "伺機"
  },
  {
    "char": "肆",
    "zhuyin": "ㄙˋ",
    "clue": "他在公眾場合大（　）宣嘩，非常失禮。",
    "searchWord": "大肆"
  },
  {
    "char": "寺",
    "zhuyin": "ㄙˋ",
    "clue": "這座深山古（　）常年香火鼎盛。",
    "searchWord": "古寺"
  },
  {
    "char": "嗣",
    "zhuyin": "ㄙˋ",
    "clue": "他是這家百年企業唯一的後（　）繼承人。",
    "searchWord": "後嗣"
  },
  {
    "char": "飼",
    "zhuyin": "ㄙˋ",
    "clue": "農夫用新鮮的牧草（　）養牛群。",
    "searchWord": "飼養"
  },
  {
    "char": "巳",
    "zhuyin": "ㄙˋ",
    "clue": "地支順序為辰、（　）、午、未。",
    "searchWord": "巳"
  },
  {
    "char": "已",
    "zhuyin": "ㄧˇ",
    "clue": "這件事情（　）經無可挽回了。",
    "searchWord": "已經"
  },
  {
    "char": "己",
    "zhuyin": "ㄐㄧˇ",
    "clue": "我們做人一定要克（　）復禮、嚴以律己。",
    "searchWord": "克己"
  },
  {
    "char": "導",
    "zhuyin": "ㄉㄠˇ",
    "clue": "這名導（　）遊非常有耐心，解說詳盡。",
    "searchWord": "導遊"
  },
  {
    "char": "倒",
    "zhuyin": "ㄉㄠˇ",
    "clue": "排山（　）海的力量是無法抵擋的。",
    "searchWord": "排山倒海"
  },
  {
    "char": "島",
    "zhuyin": "ㄉㄠˇ",
    "clue": "台灣是一座美麗的寶（　）。",
    "searchWord": "寶島"
  },
  {
    "char": "搗",
    "zhuyin": "ㄉㄠˇ",
    "clue": "他在課堂上故意（　）蛋，被老師處罰。",
    "searchWord": "搗蛋"
  },
  {
    "char": "稻",
    "zhuyin": "ㄉㄠˋ",
    "clue": "秋天一到，金黃色的（　）穗隨風搖擺。",
    "searchWord": "稻穗"
  },
  {
    "char": "盜",
    "zhuyin": "ㄉㄠˋ",
    "clue": "這家商店昨天夜裡不幸遭遇強（　）。",
    "searchWord": "強盜"
  },
  {
    "char": "道",
    "zhuyin": "ㄉㄠˋ",
    "clue": "做人要講道（　）義，不能忘恩負義。",
    "searchWord": "道義"
  },
  {
    "char": "悼",
    "zhuyin": "ㄉㄠˋ",
    "clue": "全體默哀一分鐘，以哀（　）受難者。",
    "searchWord": "哀悼"
  },
  {
    "char": "蹈",
    "zhuyin": "ㄉㄠˋ",
    "clue": "她從小學習芭蕾舞，（　）步非常優美。",
    "searchWord": "舞蹈"
  },
  {
    "char": "叨",
    "zhuyin": "ㄉㄠ",
    "clue": "老人家總是嘮（　）個不停，但充滿關愛。",
    "searchWord": "嘮叨"
  },
  {
    "char": "饕",
    "zhuyin": "ㄊㄠ",
    "clue": "這家餐廳是許多（　）餮食客的天堂。",
    "searchWord": "饕餮"
  },
  {
    "char": "滔",
    "zhuyin": "ㄊㄠ",
    "clue": "黃河之水（　）（　）不絕，氣勢磅礡。",
    "searchWord": "滔滔不絕"
  },
  {
    "char": "濤",
    "zhuyin": "ㄊㄠ",
    "clue": "狂風席捲，海面上捲起了驚濤（　）駭浪。",
    "searchWord": "驚濤駭浪"
  },
  {
    "char": "掏",
    "zhuyin": "ㄊㄠ",
    "clue": "他從口袋裡（　）出一張百元鈔票。",
    "searchWord": "掏出"
  },
  {
    "char": "逃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "小偷見狀不妙，立刻拔腿（　）跑。",
    "searchWord": "逃跑"
  },
  {
    "char": "桃",
    "zhuyin": "ㄊㄠˊ",
    "clue": "春天到了，花園裡的（　）花競相綻放。",
    "searchWord": "桃花"
  },
  {
    "char": "陶",
    "zhuyin": "ㄊㄠˊ",
    "clue": "這件陶瓷（　）器是宋代的藝術珍品。",
    "searchWord": "陶瓷"
  },
  {
    "char": "淘",
    "zhuyin": "ㄊㄠˊ",
    "clue": "這小男孩非常（　）氣，常讓人啼笑皆非。",
    "searchWord": "淘氣"
  },
  {
    "char": "討",
    "zhuyin": "ㄊㄠˇ",
    "clue": "這件事情值得我們深入探（　）。",
    "searchWord": "探討"
  },
  {
    "char": "套",
    "zhuyin": "ㄊㄠˋ",
    "clue": "這套（　）西裝穿在他身上非常合身。",
    "searchWord": "套裝"
  },
  {
    "char": "慟",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "聽到親人離世，他哀（　）萬分，泣不成聲。",
    "searchWord": "哀慟"
  },
  {
    "char": "痛",
    "zhuyin": "ㄊㄨㄥˋ",
    "clue": "他頭（　）欲裂，無法繼續工作。",
    "searchWord": "頭痛"
  },
  {
    "char": "同",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "我們在（　）一個班級上課，感情很好。",
    "searchWord": "同班"
  },
  {
    "char": "銅",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "這座青（　）雕像矗立在廣場中央。",
    "searchWord": "青銅"
  },
  {
    "char": "桐",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "五月油（　）花盛開，宛如白雪覆蓋。",
    "searchWord": "油桐花"
  },
  {
    "char": "筒",
    "zhuyin": "ㄊㄨㄥˊ",
    "clue": "請把垃圾丟進垃圾（　）裡。",
    "searchWord": "垃圾筒"
  },
  {
    "char": "統",
    "zhuyin": "ㄊㄨㄥˇ",
    "clue": "政府正致力於（　）籌全國的防疫資源。",
    "searchWord": "統籌"
  },
  {
    "char": "通",
    "zhuyin": "ㄊㄨㄥ",
    "clue": "這條道路四通（　）八達，交通極為便利。",
    "searchWord": "四通八達"
  },
  {
    "char": "贅",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "這篇文章（　）字太多，顯得不夠簡練。",
    "searchWord": "贅字"
  },
  {
    "char": "椎",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "這起車禍導致他脊（　）嚴重受損。",
    "searchWord": "脊椎"
  },
  {
    "char": "錐",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "這家工廠生產圓（　）形的鋼模。",
    "searchWord": "圓錐"
  },
  {
    "char": "墜",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "流星劃過夜空，（　）落在遙遠的山頭。",
    "searchWord": "墜落"
  },
  {
    "char": "追",
    "zhuyin": "ㄓㄨㄟ",
    "clue": "警察在大街上奮力（　）捕搶匪。",
    "searchWord": "追捕"
  },
  {
    "char": "拙",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "他口齒笨（　），不擅長言辭表達。",
    "searchWord": "笨拙"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "這件事情請立刻著（　）手辦理，不得延誤。",
    "searchWord": "著手"
  },
  {
    "char": "琢",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "這塊璞玉需要經過精雕細（　）才能成大器。",
    "searchWord": "精雕細琢"
  },
  {
    "char": "卓",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "他在醫學領域取得了（　）越的成就。",
    "searchWord": "卓越"
  },
  {
    "char": "濯",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "蓮花出淤泥而不染，（　）清漣而不妖。",
    "searchWord": "濯清漣"
  },
  {
    "char": "灼",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "他的眼神真誠，有著真知（　）見。",
    "searchWord": "真知灼見"
  },
  {
    "char": "酌",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "這項法案需要反覆斟（　）才能定案。",
    "searchWord": "斟酌"
  },
  {
    "char": "濁",
    "zhuyin": "ㄓㄨㄛˊ",
    "clue": "這條溪水十分混（　），不適合飲用。",
    "searchWord": "混濁"
  },
  {
    "char": "抉",
    "zhuyin": "ㄐㄩㄝˊ",
    "clue": "面臨人生的重大（　）擇。",
    "searchWord": "抉擇"
  },
  {
    "char": "既",
    "zhuyin": "ㄐㄧˋ",
    "clue": "既然犯了錯，就要（　）往不咎。",
    "searchWord": "既往不咎"
  },
  {
    "char": "躁",
    "zhuyin": "ㄗㄠˋ",
    "clue": "遇事要冷靜，千萬不可暴（　）。",
    "searchWord": "暴躁"
  },
  {
    "char": "頃",
    "zhuyin": "ㄑㄧㄥˇ",
    "clue": "（　）刻之間，天空便下起了暴雨。",
    "searchWord": "頃刻"
  },
  {
    "char": "傾",
    "zhuyin": "ㄑㄧㄥ",
    "clue": "午後雷雨下得像（　）盆大雨。",
    "searchWord": "傾盆大雨"
  },
  {
    "char": "韁",
    "zhuyin": "ㄐㄧㄤ",
    "clue": "這輛車失控得像脫（　）野馬。",
    "searchWord": "脫韁野馬"
  },
  {
    "char": "鰈",
    "zhuyin": "ㄉㄧㄝˊ",
    "clue": "看他們鶼（　）情深，真讓人羨慕。",
    "searchWord": "鶼鰈情深"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他做事條理分明、思慮（　）密。",
    "searchWord": "縝密"
  },
  {
    "char": "蒂",
    "zhuyin": "ㄉㄧˋ",
    "clue": "這個觀念已經根深（　）固，很難改變。",
    "searchWord": "根深蒂固"
  },
  {
    "char": "懦",
    "zhuyin": "ㄋㄨㄛˋ",
    "clue": "面對惡勢力，我們絕不能（　）弱。",
    "searchWord": "懦弱"
  },
  {
    "char": "顢",
    "zhuyin": "ㄇㄢˊ",
    "clue": "這個官員辦事（　）頇，效率極低。",
    "searchWord": "顢頇"
  },
  {
    "char": "頇",
    "zhuyin": "ㄏㄢ",
    "clue": "他那顢（　）的作風惹惱了許多市民。",
    "searchWord": "顢頇"
  },
  {
    "char": "姍",
    "zhuyin": "ㄕㄢ",
    "clue": "主角直到開演後半小時才（　）（　）來遲。",
    "searchWord": "姍姍來遲"
  },
  {
    "char": "惴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "自從犯了錯，他終日（　）（　）不安。",
    "searchWord": "惴惴不安"
  },
  {
    "char": "揣",
    "zhuyin": "ㄔㄨㄞˇ",
    "clue": "我們很難（　）摩大師真正的創作心思。",
    "searchWord": "揣摩"
  },
  {
    "char": "馳",
    "zhuyin": "ㄔˊ",
    "clue": "跑車在公路上風（　）電掣般開過。",
    "searchWord": "風馳電掣"
  },
  {
    "char": "尷",
    "zhuyin": "ㄍㄢ",
    "clue": "叫錯名字，場面十分（　）尬！",
    "searchWord": "尷尬"
  },
  {
    "char": "尬",
    "zhuyin": "ㄍㄚˋ",
    "clue": "台上忘詞，氣氛尷（　）！",
    "searchWord": "尷尬"
  },
  {
    "char": "肺",
    "zhuyin": "ㄈㄟˋ",
    "clue": "發自（　）腑的真心話！",
    "searchWord": "發自肺腑"
  },
  {
    "char": "冒",
    "zhuyin": "ㄇㄠˋ",
    "clue": "（　）著風雨前行！",
    "searchWord": "冒著風雨"
  },
  {
    "char": "梁",
    "zhuyin": "ㄌㄧㄤˊ",
    "clue": "做人絕不能偷（　）換柱！",
    "searchWord": "偷梁換柱"
  },
  {
    "char": "鼎",
    "zhuyin": "ㄉㄧㄥˇ",
    "clue": "感謝大家（　）力相助！",
    "searchWord": "鼎力相助"
  },
  {
    "char": "憋",
    "zhuyin": "ㄅㄧㄝ",
    "clue": "快要（　）不住笑了！",
    "searchWord": "憋不住"
  },
  {
    "char": "戳",
    "zhuyin": "ㄔㄨㄛ",
    "clue": "漏洞百出，一（　）即破！",
    "searchWord": "一戳即破"
  },
  {
    "char": "蒐",
    "zhuyin": "ㄙㄡ",
    "clue": "努力（　）集相關證據！",
    "searchWord": "蒐集證據"
  },
  {
    "char": "幕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "案件背後隱藏著（　）後黑手！",
    "searchWord": "幕後黑手"
  },
  {
    "char": "慕",
    "zhuyin": "ㄇㄨˋ",
    "clue": "吸引無數樂迷（　）名前來！",
    "searchWord": "慕名前來"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "視線模糊，難以（　）明方向！",
    "searchWord": "辨明方向"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "他在辯論大賽中（　）才無礙！",
    "searchWord": "辯才無礙"
  },
  {
    "char": "磬",
    "zhuyin": "ㄑㄧㄥˋ",
    "clue": "家境貧寒，真可說是室如懸（　）！",
    "searchWord": "室如懸磬"
  },
  {
    "char": "磐",
    "zhuyin": "ㄆㄢˊ",
    "clue": "感情堅如（　）石，不受挑撥！",
    "searchWord": "堅如磐石"
  },
  {
    "char": "藉",
    "zhuyin": "ㄐㄧˊ",
    "clue": "他因行為不檢而聲名狼（　）！",
    "searchWord": "聲名狼藉"
  },
  {
    "char": "籍",
    "zhuyin": "ㄐㄧˊ",
    "clue": "在政壇上他只是一個（　）籍無名的新人！",
    "searchWord": "籍籍無名"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "做學問一定要再接再（　）！",
    "searchWord": "再接再厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老師說的話極具鼓（　）作用！",
    "searchWord": "鼓勵"
  },
  {
    "char": "輟",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "他家境貧困，被迫（　）學做工！",
    "searchWord": "輟學"
  },
  {
    "char": "綴",
    "zhuyin": "ㄓㄨㄟˋ",
    "clue": "夜空中點（　）著無數亮麗的星星！",
    "searchWord": "點綴"
  },
  {
    "char": "啜",
    "zhuyin": "ㄔㄨㄛˋ",
    "clue": "聽到壞消息，她躲在角落低聲（　）泣！",
    "searchWord": "啜泣"
  },
  {
    "char": "緝",
    "zhuyin": "ㄑㄧˋ",
    "clue": "警方發布通（　）令追捕這名逃犯！",
    "searchWord": "通緝"
  },
  {
    "char": "輯",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這本書的（　）排非常混亂，不易閱讀！",
    "searchWord": "編輯"
  },
  {
    "char": "揖",
    "zhuyin": "ㄧ",
    "clue": "見面時，他向長輩作（　）行禮！",
    "searchWord": "作揖"
  },
  {
    "char": "葺",
    "zhuyin": "ㄑㄧˋ",
    "clue": "這間老房子常年漏水，需要修（　）！",
    "searchWord": "修葺"
  },
  {
    "char": "戢",
    "zhuyin": "ㄐㄧˊ",
    "clue": "兩國決定偃兵（　）戈，恢復和平！",
    "searchWord": "偃兵戢戈"
  },
  {
    "char": "戈",
    "zhuyin": "ㄍㄜ",
    "clue": "兩國決定偃武修（　），停戰和談！",
    "searchWord": "偃武修戈"
  },
  {
    "char": "戌",
    "zhuyin": "ㄒㄩ",
    "clue": "地支順序為申、酉、（　）、亥！",
    "searchWord": "戌"
  },
  {
    "char": "戊",
    "zhuyin": "ㄨˋ",
    "clue": "天干順序為甲、乙、丙、丁、（　）！",
    "searchWord": "戊"
  },
  {
    "char": "戍",
    "zhuyin": "ㄕㄨˋ",
    "clue": "古代戰士奉命前往邊疆防（　）！",
    "searchWord": "防戍"
  },
  {
    "char": "戎",
    "zhuyin": "ㄖㄨㄥˊ",
    "clue": "將軍決定投筆從（　），報效國家！",
    "searchWord": "投筆從戎"
  },
  {
    "char": "冗",
    "zhuyin": "ㄖㄨㄥˇ",
    "clue": "這篇文章贅字太多，顯得相當（　）長！",
    "searchWord": "冗長"
  },
  {
    "char": "沈",
    "zhuyin": "開",
    "clue": "這起事件在社會上引起了（　）默！",
    "searchWord": "沈默"
  },
  {
    "char": "枕",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他們夫妻同甘共苦，可說是（　）戈待旦！",
    "searchWord": "枕戈待旦"
  },
  {
    "char": "耽",
    "zhuyin": "ㄉㄢ",
    "clue": "沉迷電玩只會（　）誤學業與人生！",
    "searchWord": "耽誤"
  },
  {
    "char": "眈",
    "zhuyin": "ㄉㄢ",
    "clue": "強國對弱國虎視（　）（　）！",
    "searchWord": "虎視眈眈"
  },
  {
    "char": "諂",
    "zhuyin": "ㄔㄢˇ",
    "clue": "他極力（　）媚巴結主管，真令人反感！",
    "searchWord": "諂媚"
  },
  {
    "char": "陷",
    "zhuyin": "ㄒㄧㄢˋ",
    "clue": "車子在泥沼中深（　），動彈不得！",
    "searchWord": "深陷"
  },
  {
    "char": "焰",
    "zhuyin": "ㄧㄢˋ",
    "clue": "大火的烈（　）沖天，景象駭人！",
    "searchWord": "烈焰"
  },
  {
    "char": "掐",
    "zhuyin": "ㄑㄧㄚ",
    "clue": "他緊張得（　）了自己大腿一下！",
    "searchWord": "掐"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這件瓷器美中不足，有一處微小的（　）疵！",
    "searchWord": "瑕疵"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "假日他忙著照料病人，無（　）顧及娛樂！",
    "searchWord": "無暇"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這件事情迫在眉睫，不容（　）想！",
    "searchWord": "暇想"
  },
  {
    "char": "瑕",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這塊美玉潔白無（　），價值連城！",
    "searchWord": "潔白無瑕"
  },
  {
    "char": "暇",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "他忙得焦頭爛額，應接不（　）！",
    "searchWord": "應接不暇"
  },
  {
    "char": "遐",
    "zhuyin": "ㄒㄧㄚˊ",
    "clue": "這首曲子留給人們無窮的（　）思空間！",
    "searchWord": "遐思"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "多運動對於健康大有（　）益！",
    "searchWord": "裨益"
  },
  {
    "char": "裨",
    "zhuyin": "ㄅㄧˋ",
    "clue": "這對解決問題並無（　）補！",
    "searchWord": "裨補"
  },
  {
    "char": "稗",
    "zhuyin": "ㄅㄞˋ",
    "clue": "他最喜歡閱讀野史（　）官！",
    "searchWord": "稗官野史"
  },
  {
    "char": "碑",
    "zhuyin": "ㄅㄟ",
    "clue": "這塊歷史古（　）已經被風化得很嚴重！",
    "searchWord": "古碑"
  },
  {
    "char": "脾",
    "zhuyin": "ㄆㄧˊ",
    "clue": "他脾氣（　）氣暴躁，動不動就發火！",
    "searchWord": "脾氣"
  },
  {
    "char": "俾",
    "zhuyin": "ㄅㄧˋ",
    "clue": "請大家準時出發，（　）便能按時到達目的地！",
    "searchWord": "俾便"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "乾（　）的土地急需雨水滋潤！",
    "searchWord": "乾涸"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "面臨困難時，他如（　）轍之鮒般焦急！",
    "searchWord": "涸轍之鮒"
  },
  {
    "char": "錮",
    "zhuyin": "ㄍㄨˋ",
    "clue": "罪犯被禁（　）在狹窄的牢房裡！",
    "searchWord": "禁錮"
  },
  {
    "char": "固",
    "zhuyin": "ㄍㄨˋ",
    "clue": "做事情的基礎一定要穩（　）！",
    "searchWord": "穩固"
  },
  {
    "char": "涸",
    "zhuyin": "ㄏㄜˊ",
    "clue": "烈日下，這口古井已經完全枯（　）了！",
    "searchWord": "枯涸"
  },
  {
    "char": "聒",
    "zhuyin": "ㄍㄨㄛ",
    "clue": "麻雀在樹上（　）（　）噪個不停，很吵人！",
    "searchWord": "聒噪"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "鄉村生活寧靜（　）適，令人嚮往！",
    "searchWord": "恬適"
  },
  {
    "char": "恬",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "他做錯事卻（　）不知恥，真叫人氣憤！",
    "searchWord": "恬不知恥"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "這場暴風雨颳（　）得天昏地暗！",
    "searchWord": "颳風"
  },
  {
    "char": "刮",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "我們做人做事一定要對人刮（　）相看！",
    "searchWord": "刮目相看"
  },
  {
    "char": "括",
    "zhuyin": "ㄍㄨㄚ",
    "clue": "本次活動包括（　）多項精彩表演項目！",
    "searchWord": "包括"
  },
  {
    "char": "憩",
    "zhuyin": "ㄑㄧˋ",
    "clue": "登山客在涼亭內稍作小（　）！",
    "searchWord": "小憩"
  },
  {
    "char": "憇",
    "zhuyin": "ㄑㄧˋ",
    "clue": "登山客在涼亭內稍作小（　）！",
    "searchWord": "小憩"
  },
  {
    "char": "契",
    "zhuyin": "ㄑㄧˋ",
    "clue": "雙方默（　）十足，配合同步！",
    "searchWord": "默契"
  },
  {
    "char": "潔",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他生活作風（　）身自好，不受利誘！",
    "searchWord": "潔身自好"
  },
  {
    "char": "劫",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "這家商店不幸（　）後餘生，重新開張！",
    "searchWord": "劫後餘生"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "他的動作敏（　），一下就爬上了樹！",
    "searchWord": "敏捷"
  },
  {
    "char": "捷",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "捷（　）報頻傳，全軍士氣大振！",
    "searchWord": "捷報"
  },
  {
    "char": "竭",
    "zhuyin": "ㄐㄧㄝˊ",
    "clue": "我們必須竭（　）進全力來完成這項任務！",
    "searchWord": "竭盡全力"
  },
  {
    "char": "拮",
    "zhuyin": "ㄐㄧˊ",
    "clue": "最近他手頭十分（　）据，需要借錢度日！",
    "searchWord": "拮据"
  },
  {
    "char": "据",
    "zhuyin": "ㄐㄩ",
    "clue": "最近他手頭十分拮（　），過得很辛苦！",
    "searchWord": "拮据"
  },
  {
    "char": "詰",
    "zhuyin": "ㄐㄧˊ",
    "clue": "法官在法庭上嚴厲（　）問嫌犯！",
    "searchWord": "詰問"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "秋天是（　）子紅了的豐收季節！",
    "searchWord": "橘子"
  },
  {
    "char": "橘",
    "zhuyin": "ㄐㄩˊ",
    "clue": "這杯新鮮的（　）汁酸甜可口！",
    "searchWord": "橘汁"
  },
  {
    "char": "棘",
    "zhuyin": "ㄐㄧˊ",
    "clue": "這是一件非常（　）手、難以處理的案件！",
    "searchWord": "棘手"
  },
  {
    "char": "辣",
    "zhuyin": "ㄌㄚˋ",
    "clue": "四川菜以麻（　）著稱，風味獨特！",
    "searchWord": "麻辣"
  },
  {
    "char": "辨",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "真偽難（　），需要專業鑑定！",
    "searchWord": "真偽難辨"
  },
  {
    "char": "辯",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "在事實面前，百般狡（　）也是無濟於事！",
    "searchWord": "狡辯"
  },
  {
    "char": "辮",
    "zhuyin": "ㄅㄧㄢˋ",
    "clue": "她頭上綁著兩條長長的（　）子，顯得青春洋溢！",
    "searchWord": "辮子"
  },
  {
    "char": "辦",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事情該如何（　）理，請長官指示！",
    "searchWord": "辦理"
  },
  {
    "char": "瓣",
    "zhuyin": "ㄅㄢˋ",
    "clue": "玫瑰花（　）隨風飄落，滿地芳香！",
    "searchWord": "花瓣"
  },
  {
    "char": "辧",
    "zhuyin": "ㄅㄢˋ",
    "clue": "這件事情該如何（　）理，請長官指示！",
    "searchWord": "辦理"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "醫生的手指搭在病人的（　）搏上！",
    "searchWord": "脈搏"
  },
  {
    "char": "脈",
    "zhuyin": "ㄇㄞˋ",
    "clue": "這座山脈（　）綿延數百公里！",
    "searchWord": "山脈"
  },
  {
    "char": "博",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他博（　）古通今，學問十分淵博！",
    "searchWord": "博古通今"
  },
  {
    "char": "搏",
    "zhuyin": "ㄅㄛˊ",
    "clue": "這隻獵豹正與獵物進行生死（　）鬥！",
    "searchWord": "搏鬥"
  },
  {
    "char": "膊",
    "zhuyin": "ㄅㄛˊ",
    "clue": "老農夫赤（　）在烈日下辛苦耕作！",
    "searchWord": "赤膊"
  },
  {
    "char": "駁",
    "zhuyin": "ㄅㄛˊ",
    "clue": "他的論點漏洞百出，被對手當場反（　）！",
    "searchWord": "反駁"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "車子在崎嶇的山路上劇烈顛（　）！",
    "searchWord": "顛簸"
  },
  {
    "char": "簸",
    "zhuyin": "ㄅㄛˇ",
    "clue": "農夫用簸（　）箕將穀物篩選乾淨！",
    "searchWord": "簸箕"
  },
  {
    "char": "播",
    "zhuyin": "ㄅㄛ",
    "clue": "電視台正廣（　）著防災即時警報！",
    "searchWord": "廣播"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "請把這筆專款（　）付給受災戶！",
    "searchWord": "撥付"
  },
  {
    "char": "撥",
    "zhuyin": "ㄅㄛ",
    "clue": "他用手指輕輕撥（　）琴弦，樂聲悠揚！",
    "searchWord": "撥琴"
  },
  {
    "char": "攀",
    "zhuyin": "ㄆㄢ",
    "clue": "小常青藤沿著牆壁向上（　）爬！",
    "searchWord": "攀爬"
  },
  {
    "char": "樊",
    "zhuyin": "ㄈㄢˊ",
    "clue": "鳥兒被關在（　）籠裡，失去了自由！",
    "searchWord": "樊籠"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "貪（　）的人總是得寸進尺、不知滿足！",
    "searchWord": "貪婪"
  },
  {
    "char": "婪",
    "zhuyin": "ㄌㄢˊ",
    "clue": "他用貪（　）的目光盯著那袋黃金！",
    "searchWord": "貪婪"
  },
  {
    "char": "焚",
    "zhuyin": "ㄈㄣˊ",
    "clue": "這場突如其來的大火（　）毀了整片森林！",
    "searchWord": "焚毀"
  },
  {
    "char": "梵",
    "zhuyin": "ㄈㄢˋ",
    "clue": "這裡的寺廟散發著濃厚的（　）宇氣息！",
    "searchWord": "梵宇"
  },
  {
    "char": "縝",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他的計畫思維縝（　）密，天衣無縫！",
    "searchWord": "縝密"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "事關重大，做決定前一定要謹（　）！",
    "searchWord": "謹慎"
  },
  {
    "char": "填",
    "zhuyin": "ㄊㄧㄢˊ",
    "clue": "請在報名表上（　）寫正確聯絡電話！",
    "searchWord": "填寫"
  },
  {
    "char": "顛",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "經歷這場浩劫，他整個人瘋瘋（　）（　）！",
    "searchWord": "瘋瘋顛顛"
  },
  {
    "char": "巔",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "經過艱苦努力，他終於攀登上了人生（　）峰！",
    "searchWord": "巔峰"
  },
  {
    "char": "癲",
    "zhuyin": "ㄉㄧㄢ",
    "clue": "他突然（　）癇發作，口吐白沫！",
    "searchWord": "癲癇"
  },
  {
    "char": "嗔",
    "zhuyin": "ㄔㄣ",
    "clue": "她面露（　）色，顯然對這安排很不滿！",
    "searchWord": "嗔色"
  },
  {
    "char": "瞋",
    "zhuyin": "ㄔㄣ",
    "clue": "他氣得（　）目結舌，一句話也說不出來！",
    "searchWord": "瞋目結舌"
  },
  {
    "char": "慎",
    "zhuyin": "ㄕㄣˋ",
    "clue": "小心駛得萬年船，行事宜審（　）！",
    "searchWord": "審慎"
  },
  {
    "char": "鎮",
    "zhuyin": "ㄓㄣˋ",
    "clue": "警察鳴槍示警以（　）壓暴亂！",
    "searchWord": "鎮壓"
  },
  {
    "char": "震",
    "zhuyin": "ㄓㄣˋ",
    "clue": "這起大醜聞（　）驚了整個社會！",
    "searchWord": "震驚"
  },
  {
    "char": "賑",
    "zhuyin": "ㄓㄣˋ",
    "clue": "政府撥款開倉（　）災，濟助災民！",
    "searchWord": "賑災"
  },
  {
    "char": "振",
    "zhuyin": "ㄓㄣˋ",
    "clue": "我們必須打起精神，（　）作士氣！",
    "searchWord": "振作"
  },
  {
    "char": "陣",
    "zhuyin": "ㄓㄣˋ",
    "clue": "天空中突然傳來一（　）雷聲！",
    "searchWord": "一陣"
  },
  {
    "char": "朕",
    "zhuyin": "ㄓㄣˋ",
    "clue": "古代皇帝自稱為（　）！",
    "searchWord": "朕"
  },
  {
    "char": "疹",
    "zhuyin": "ㄓㄣˇ",
    "clue": "他身上起了許多紅（　），奇癢無比！",
    "searchWord": "紅疹"
  },
  {
    "char": "診",
    "zhuyin": "ㄓㄣˇ",
    "clue": "醫生正在為病人做詳細（　）斷！",
    "searchWord": "診斷"
  },
  {
    "char": "厲",
    "zhuyin": "ㄌㄧˋ",
    "clue": "校長嚴（　）地批評了犯錯的學生！",
    "searchWord": "嚴厲"
  },
  {
    "char": "勵",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這番鼓勵（　）志的話，激發了他的鬥志！",
    "searchWord": "勵志"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這家百年老店（　）經滄桑，依然屹立不搖！",
    "searchWord": "歷經"
  },
  {
    "char": "歷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "歷史（　）史是不容抹滅的鏡子！",
    "searchWord": "歷史"
  },
  {
    "char": "曆",
    "zhuyin": "ㄌㄧˋ",
    "clue": "新年到了，家家戶戶換上新日（　）！",
    "searchWord": "日曆"
  },
  {
    "char": "靂",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這晴天霹（　）的消息，打擊了他！",
    "searchWord": "霹靂"
  },
  {
    "char": "礪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "我們要在艱苦的環境中磨（　）意志！",
    "searchWord": "磨礪"
  },
  {
    "char": "罹",
    "zhuyin": "ㄌㄧˊ",
    "clue": "不幸（　）難的家屬在現場痛哭失聲！",
    "searchWord": "罹難"
  },
  {
    "char": "離",
    "zhuyin": "ㄌㄧˊ",
    "clue": "相隔兩地，兩人的距離（　）非常遙遠！",
    "searchWord": "距離"
  },
  {
    "char": "籬",
    "zhuyin": "ㄌㄧˊ",
    "clue": "小院子周圍圍著一圈矮矮的木（　）笆！",
    "searchWord": "籬笆"
  },
  {
    "char": "釐",
    "zhuyin": "ㄌㄧˊ",
    "clue": "做精密測量時，一（　）一毫都不能出錯！",
    "searchWord": "釐毫"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這對佳偶相得益彰，真是一對璧（　）！",
    "searchWord": "璧儷"
  },
  {
    "char": "荔",
    "zhuyin": "ㄌㄧˋ",
    "clue": "夏天的（　）枝甜美多汁，非常好吃！",
    "searchWord": "荔枝"
  },
  {
    "char": "麗",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這裡的風景美（　）如畫，賞心悅目！",
    "searchWord": "美麗"
  },
  {
    "char": "莉",
    "zhuyin": "ㄌㄧˋ",
    "clue": "庭院裡的茉（　）花正悄悄綻放！",
    "searchWord": "茉莉"
  },
  {
    "char": "例",
    "zhuyin": "ㄌㄧˋ",
    "clue": "按照慣（　），我們每年都會舉辦旅遊！",
    "searchWord": "慣例"
  },
  {
    "char": "俐",
    "zhuyin": "ㄌㄧˋ",
    "clue": "這女孩做事非常伶（　）乖巧！",
    "searchWord": "伶俐"
  },
  {
    "char": "櫪",
    "zhuyin": "ㄌㄧˋ",
    "clue": "老馬伏（　），志在千里！",
    "searchWord": "老馬伏櫪"
  },
  {
    "char": "邐",
    "zhuyin": "ㄌㄧˇ",
    "clue": "沿途風景迤（　），令人目不暇給！",
    "searchWord": "迤邐"
  },
  {
    "char": "蠡",
    "zhuyin": "ㄌㄧˇ",
    "clue": "管窺蠡（　）的見解，難免以偏概全！",
    "searchWord": "管窺蠡測"
  },
  {
    "char": "儷",
    "zhuyin": "ㄌㄧˋ",
    "clue": "他們這對伉（　）常攜手出席公益活動！",
    "searchWord": "伉儷"
  },
  {
    "char": "灑",
    "zhuyin": "ㄙㄚˇ",
    "clue": "清潔工在路面上（　）水除塵！",
    "searchWord": "灑水"
  },
  {
    "char": "酒",
    "zhuyin": "ㄐㄧㄡˇ",
    "clue": "開車不喝（　），喝酒不開車！",
    "searchWord": "酒精"
  },
  {
    "char": "矚",
    "zhuyin": "ㄓㄨˇ",
    "clue": "萬眾（　）目的決賽即將在今晚引爆！",
    "searchWord": "矚目"
  },
  {
    "char": "囑",
    "zhuyin": "ㄓㄨˇ",
    "clue": "臨終前，他留下了感人的遺（　）！",
    "searchWord": "遺囑"
  },
  {
    "char": "佇",
    "zhuyin": "ㄓㄨˋ",
    "clue": "他在雨中（　）立許久，默默流淚！",
    "searchWord": "佇立"
  },
  {
    "char": "貯",
    "zhuyin": "ㄓㄨˋ",
    "clue": "我們需要多（　）備一些防汛沙包！",
    "searchWord": "貯備"
  },
  {
    "char": "駐",
    "zhuyin": "ㄓㄨˋ",
    "clue": "大批軍隊已進（　）邊防重地！",
    "searchWord": "進駐"
  },
  {
    "char": "助",
    "zhuyin": "ㄓㄨˋ",
    "clue": "出門在外，互相幫（　）是美德！",
    "searchWord": "幫助"
  },
  {
    "char": "蛀",
    "zhuyin": "ㄓㄨˋ",
    "clue": "小孩子糖吃太多，容易長（　）牙！",
    "searchWord": "蛀牙"
  },
  {
    "char": "築",
    "zhuyin": "ㄓㄨˊ",
    "clue": "工程師正在建築（　）工地上巡視！",
    "searchWord": "建築"
  },
  {
    "char": "逐",
    "zhuyin": "ㄓㄨˊ",
    "clue": "我們一定要隨波（　）流，失去自我！",
    "searchWord": "隨波逐流"
  },
  {
    "char": "著",
    "zhuyin": "ㄓㄨˋ",
    "clue": "這本名（　）被翻譯成多國語言！",
    "searchWord": "名著"
  },
  {
    "char": "署",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這份公文上需要局長親自簽（　）！",
    "searchWord": "簽署"
  },
  {
    "char": "曙",
    "zhuyin": "ㄕㄨˇ",
    "clue": "黑夜終將過去，東方已露出一線（　）光！",
    "searchWord": "曙光"
  },
  {
    "char": "薯",
    "zhuyin": "ㄕㄨˇ",
    "clue": "這盤剛炸好的馬鈴（　）條非常酥脆！",
    "searchWord": "馬鈴薯"
  },
  {
    "char": "暑",
    "zhuyin": "ㄕㄨˇ",
    "clue": "漫長的（　）假是孩子們最快樂的時光！",
    "searchWord": "暑假"
  },
  {
    "char": "墅",
    "zhuyin": "ㄕㄨˋ",
    "clue": "他們在郊區買了一棟度假別（　）！",
    "searchWord": "別墅"
  },
  {
    "char": "塑",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這件泥（　）作品栩栩如生，技藝精湛！",
    "searchWord": "泥塑"
  },
  {
    "char": "宿",
    "zhuyin": "ㄙㄨˋ",
    "clue": "今晚我們決定在這家民宿寄（　）！",
    "searchWord": "寄宿"
  },
  {
    "char": "素",
    "zhuyin": "ㄙㄨˋ",
    "clue": "她平時穿著樸（　），不愛奢華！",
    "searchWord": "樸素"
  },
  {
    "char": "訴",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他向法庭提起了民事訴（　）！",
    "searchWord": "訴訟"
  },
  {
    "char": "溯",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這項歷史傳統可以追（　）到百年前！",
    "searchWord": "追溯"
  },
  {
    "char": "夙",
    "zhuyin": "ㄙㄨˋ",
    "clue": "他終日奔波，真是（　）夜匪懈！",
    "searchWord": "夙夜匪懈"
  },
  {
    "char": "肅",
    "zhuyin": "ㄙㄨˋ",
    "clue": "大堂之上，氣氛十分嚴（　）！",
    "searchWord": "嚴肅"
  },
  {
    "char": "簌",
    "zhuyin": "ㄙㄨˋ",
    "clue": "落葉在風中發出（　）（　）的聲響！",
    "searchWord": "簌簌"
  },
  {
    "char": "速",
    "zhuyin": "ㄙㄨˋ",
    "clue": "這輛跑車的速度（　）極快，非常危險！",
    "searchWord": "速度"
  },
  {
    "char": "粟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "我們滄海一（　）微不足道！",
    "searchWord": "滄海一粟"
  },
  {
    "char": "蘇",
    "zhuyin": "ㄙㄨ",
    "clue": "春天到了，大地萬物復（　）！",
    "searchWord": "復蘇"
  },
  {
    "char": "酥",
    "zhuyin": "ㄙㄨ",
    "clue": "這家糕餅店的鳳梨酥（　）口感極佳！",
    "searchWord": "鳳梨酥"
  },
  {
    "char": "俗",
    "zhuyin": "ㄙㄨˊ",
    "clue": "我們應該屏除 these 陳規陋（　）！",
    "searchWord": "陋俗"
  },
  {
    "char": "悚",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "這部恐怖電影的情節令人毛骨悚（　）！",
    "searchWord": "毛骨悚然"
  },
  {
    "char": "聳",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "高聳（　）的大樓直插雲霄！",
    "searchWord": "高聳"
  },
  {
    "char": "訟",
    "zhuyin": "ㄙㄨˋ",
    "clue": "兩家公司因專利問題陷入了官（　）！",
    "searchWord": "官訟"
  },
  {
    "char": "頌",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這首詩是為了歌（　）英雄的功績！",
    "searchWord": "歌頌"
  },
  {
    "char": "送",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "爸爸親自開車（　）我到火車站！",
    "searchWord": "送行"
  },
  {
    "char": "宋",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "這是（　）朝時期的青瓷花瓶！",
    "searchWord": "宋朝"
  },
  {
    "char": "誦",
    "zhuyin": "ㄙㄨㄥˋ",
    "clue": "小學生正大聲朗（　）課文！",
    "searchWord": "朗誦"
  },
  {
    "char": "松",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "這棵古松（　）迎風挺立，顯得蒼勁！",
    "searchWord": "古松"
  },
  {
    "char": "鬆",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "工作完成了，他終於可以放（　）一下！",
    "searchWord": "放鬆"
  },
  {
    "char": "嵩",
    "zhuyin": "ㄙㄨㄥ",
    "clue": "這座高山被尊稱為（　）山！",
    "searchWord": "嵩山"
  },
  {
    "char": "慫",
    "zhuyin": "ㄙㄨㄥˇ",
    "clue": "在壞朋友的（　）恿下，他犯了錯！",
    "searchWord": "慫恿"
  },
  {
    "char": "懍",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "見到長官，部屬們無不畏（　）遵命！",
    "searchWord": "畏懍"
  },
  {
    "char": "凜",
    "zhuyin": "ㄌㄧㄣˇ",
    "clue": "寒風（　）（　），路上行人稀少！",
    "searchWord": "寒風凜凜"
  },
  {
    "char": "鄰",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "遠親不如近（　），鄰里要和睦！",
    "searchWord": "近鄰"
  },
  {
    "char": "臨",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "歡迎各位貴賓光（　）指導！",
    "searchWord": "光臨"
  },
  {
    "char": "林",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "這座原始森林（　）木茂密！",
    "searchWord": "森林"
  },
  {
    "char": "淋",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "他沒帶傘，被大雨（　）得像隻落湯雞！",
    "searchWord": "淋雨"
  },
  {
    "char": "鱗",
    "zhuyin": "ㄌㄧㄣˊ",
    "clue": "魚身上的鱗（　）片在陽光下閃閃發光！",
    "searchWord": "鱗片"
  },
  {
    "char": "麟",
    "zhuyin": "ㄌㄧˊ",
    "clue": "他是業界鳳毛（　）角般的頂尖人才！",
    "searchWord": "鳳毛麟角"
  },
  {
    "char": "吝",
    "zhuyin": "ㄌㄧㄣˋ",
    "clue": "做公益要慷慨，千萬不要（　）嗇！",
    "searchWord": "吝嗇"
  },
  {
    "char": "玲",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這件玉雕小巧（　）瓏，十分精美！",
    "searchWord": "玲瓏"
  },
  {
    "char": "伶",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這孩子口齒（　）俐，討人喜歡！",
    "searchWord": "伶俐"
  },
  {
    "char": "聆",
    "zhuyin": "ㄌㄧˊ",
    "clue": "全場觀眾靜靜地（　）聽鋼琴演奏！",
    "searchWord": "聆聽"
  },
  {
    "char": "齡",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這棵老神木的年（　）已超過千年！",
    "searchWord": "年齡"
  },
  {
    "char": "羚",
    "zhuyin": "ㄌㄧˊ",
    "clue": "大草原上有成群的（　）羊奔馳！",
    "searchWord": "羚羊"
  },
  {
    "char": "零",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這筆帳目核對後，剛好為（　）！",
    "searchWord": "零錢"
  },
  {
    "char": "鈴",
    "zhuyin": "ㄌㄧˊ",
    "clue": "下課（　）聲響起，學生歡呼出教室！",
    "searchWord": "鈴聲"
  },
  {
    "char": "凌",
    "zhuyin": "ㄌㄧˊ",
    "clue": "他仗勢欺人，經常（　）侮弱小！",
    "searchWord": "凌侮"
  },
  {
    "char": "陵",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這是古代帝王的（　）寢遺址！",
    "searchWord": "陵寢"
  },
  {
    "char": "綾",
    "zhuyin": "ㄌㄧˊ",
    "clue": "這件衣服是用高級的（　）羅綢緞製成！",
    "searchWord": "綾羅綢緞"
  },
  {
    "char": "嶺",
    "zhuyin": "ㄌㄧˇ",
    "clue": "我們翻越了重重山（　），終於到達目的地！",
    "searchWord": "山嶺"
  },
  {
    "char": "領",
    "zhuyin": "ㄌㄧˇ",
    "clue": "他帶（　）團隊建立了優勢！",
    "searchWord": "帶領"
  },
  {
    "char": "令",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這條禁（　）自即日起正式實施！",
    "searchWord": "禁令"
  },
  {
    "char": "另",
    "zhuyin": "ㄌㄧㄥˋ",
    "clue": "這件事情我們必須（　）作打算！",
    "searchWord": "另作打算"
  }
];
