/**
 * Song Quiz Default Pool (專注力測驗 - 聽歌搶答內建官方題庫)
 * 分類包含：古典音樂 (40首)、台灣五年級 (40首)、台灣六年級 (40首)、台灣七年級 (40首)、台灣八年級 (40首)、台灣九年級 (40首)、動漫神曲 (40首)、童謠兒歌 (40首)
 * 全數 320 首歌曲皆經由 YouTube 官方 API (oEmbed) 檢驗為有效且開放嵌入播放
 */
(function (global) {
  'use strict';

  const DEFAULT_SONG_QUIZ_POOL = [
  {
    "id": "classical_1",
    "tag": "古典音樂",
    "title": "給愛麗絲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=wfF0zHeU3Zs",
    "youtubeId": "wfF0zHeU3Zs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "給愛麗絲",
      "月光奏鳴曲",
      "悲愴奏鳴曲",
      "歡樂頌"
    ],
    "clue": "貝多芬經典鋼琴小品 (WoO 59)，旋律優美流暢，亦為台灣垃圾車最著名的播放旋律之一。"
  },
  {
    "id": "classical_2",
    "tag": "古典音樂",
    "title": "命運交響曲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=jv2WJMVPQi8",
    "youtubeId": "jv2WJMVPQi8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "命運交響曲",
      "英雄交響曲",
      "田園交響曲",
      "合唱交響曲"
    ],
    "clue": "第5號交響曲第1樂章，開頭著名的「短短短長」四音動機象徵「命運敲門的聲音」。"
  },
  {
    "id": "classical_3",
    "tag": "古典音樂",
    "title": "歡樂頌",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Wod-MudLNPA",
    "youtubeId": "Wod-MudLNPA",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歡樂頌",
      "英雄交響曲",
      "合唱交響曲",
      "給愛麗絲"
    ],
    "clue": "出自貝多芬《第9號交響曲》終樂章，歌詞取自席勒詩作，象徵四海之內皆兄弟的大同精神。"
  },
  {
    "id": "classical_4",
    "tag": "古典音樂",
    "title": "小夜曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=vG_FBIbGuvg",
    "youtubeId": "vG_FBIbGuvg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小夜曲",
      "土耳其進行曲",
      "魔笛序曲",
      "費加洛婚禮"
    ],
    "clue": "莫札特《第13號弦樂小夜曲》(K. 525)，明亮輕快的旋律是古典弦樂合奏的最高代表。"
  },
  {
    "id": "classical_5",
    "tag": "古典音樂",
    "title": "土耳其進行曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=quxTnEEETbo",
    "youtubeId": "quxTnEEETbo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "土耳其進行曲",
      "小夜曲",
      "給愛麗絲",
      "大黃蜂的飛行"
    ],
    "clue": "出自莫札特《第11號鋼琴奏鳴曲》第三樂章，節奏明快活潑，模仿奧斯曼軍樂隊的風格。"
  },
  {
    "id": "classical_6",
    "tag": "古典音樂",
    "title": "魔笛 - 夜后詠嘆調",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=uMGFztZLsxE",
    "youtubeId": "uMGFztZLsxE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "魔笛 - 夜后詠嘆調",
      "卡門 - 哈巴奈拉舞曲",
      "塞維亞理髮師",
      "茶花女 - 飲酒歌"
    ],
    "clue": "莫札特歌劇《魔笛》中最經典的花腔女高音段落，以驚人的高音域與跳音聞名於世。"
  },
  {
    "id": "classical_7",
    "tag": "古典音樂",
    "title": "天鵝湖",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=9rJoB7y6Ncs",
    "youtubeId": "9rJoB7y6Ncs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天鵝湖",
      "胡桃鉗",
      "睡美人",
      "羅密歐與茱麗葉"
    ],
    "clue": "柴可夫斯基三大芭蕾舞劇之一，雙簧管奏出的淒美主旋律道盡奧傑塔公主與王子的動人故事。"
  },
  {
    "id": "classical_8",
    "tag": "古典音樂",
    "title": "胡桃鉗 - 糖梅仙子之舞",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=gFjveJ5sgeQ",
    "youtubeId": "gFjveJ5sgeQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "胡桃鉗 - 糖梅仙子之舞",
      "天鵝湖",
      "睡美人",
      "花之圓舞曲"
    ],
    "clue": "柴可夫斯基《胡桃鉗》中最富童話色彩的片段，率先採用鋼片琴 (Celesta) 營造水晶般夢幻音色。"
  },
  {
    "id": "classical_9",
    "tag": "古典音樂",
    "title": "四季 - 春",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeUrl": "https://www.youtube.com/watch?v=GRxofEmo3HA",
    "youtubeId": "GRxofEmo3HA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "四季 - 春",
      "四季 - 冬",
      "水上音樂",
      "皇家煙火"
    ],
    "clue": "巴洛克名家韋瓦第最著名的協奏曲，開頭燦爛明快的合奏描繪萬物復甦、鳥兒歌唱的春天景象。"
  },
  {
    "id": "classical_10",
    "tag": "古典音樂",
    "title": "G弦上的詠嘆調",
    "artist": "巴哈 (J. S. Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=pzlw6fUux4o",
    "youtubeId": "pzlw6fUux4o",
    "startTime": 0,
    "duration": 60,
    "options": [
      "G弦上的詠嘆調",
      "耶穌，世人仰望的喜悅",
      "布蘭登堡協奏曲",
      "郭德堡變奏曲"
    ],
    "clue": "改編自巴哈《第3號管弦樂組曲》，莊嚴抒情、冥想沉靜的旋律撫慰人心。"
  },
  {
    "id": "classical_11",
    "tag": "古典音樂",
    "title": "D小調觸技曲與賦格",
    "artist": "巴哈 (J. S. Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ho9rZjlsyYY",
    "youtubeId": "ho9rZjlsyYY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "D小調觸技曲與賦格",
      "G弦上的詠嘆調",
      "平均律鋼琴曲集",
      "布蘭登堡協奏曲"
    ],
    "clue": "巴哈最具震撼力的管風琴曲，宏偉壯麗的音響常出現在各類經典電影與戲劇場景中。"
  },
  {
    "id": "classical_12",
    "tag": "古典音樂",
    "title": "夜曲 Op.9 No.2",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=9E6b3swbnWg",
    "youtubeId": "9E6b3swbnWg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "夜曲 Op.9 No.2",
      "月光奏鳴曲",
      "愛之夢",
      "小狗圓舞曲"
    ],
    "clue": "「鋼琴詩人」蕭邦流傳最廣的夜曲，如月光傾瀉般典雅優柔，浪漫主義鋼琴名作。"
  },
  {
    "id": "classical_13",
    "tag": "古典音樂",
    "title": "小狗圓舞曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=JUTEjt8Iorc",
    "youtubeId": "JUTEjt8Iorc",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小狗圓舞曲",
      "華麗大圓舞曲",
      "軍隊波蘭舞曲",
      "夜曲"
    ],
    "clue": "降D大調圓舞曲 (Op. 64 No. 1)，相傳描寫小狗追著自己尾巴打轉時的逗趣情景。"
  },
  {
    "id": "classical_14",
    "tag": "古典音樂",
    "title": "月光",
    "artist": "德布西 (Debussy)",
    "youtubeUrl": "https://www.youtube.com/watch?v=WNcsUNKlAKw",
    "youtubeId": "WNcsUNKlAKw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "月光",
      "棕髮少女",
      "牧神的午後",
      "沉沒的教堂"
    ],
    "clue": "出自印象派大師德布西《貝加馬斯克組曲》，朦朧光影與詩意氛圍的傳世鋼琴篇章。"
  },
  {
    "id": "classical_15",
    "tag": "古典音樂",
    "title": "藍色多瑙河",
    "artist": "約翰·史特勞斯二世 (Johann Strauss II)",
    "youtubeUrl": "https://www.youtube.com/watch?v=32fMNpLsvRY",
    "youtubeId": "32fMNpLsvRY",
    "startTime": 60,
    "duration": 60,
    "options": [
      "藍色多瑙河",
      "春之聲圓舞曲",
      "皇帝圓舞曲",
      "維也納森林的故事"
    ],
    "clue": "「圓舞曲之王」約翰·史特勞斯代表作，被譽為奧地利的第二國歌，旋律波瀾壯闊。"
  },
  {
    "id": "classical_16",
    "tag": "古典音樂",
    "title": "拉德茨基進行曲",
    "artist": "老約翰·史特勞斯 (Johann Strauss I)",
    "youtubeUrl": "https://www.youtube.com/watch?v=M13e1M76SqM",
    "youtubeId": "M13e1M76SqM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "拉德茨基進行曲",
      "藍色多瑙河",
      "威風凜凜進行曲",
      "雙頭鷹進行曲"
    ],
    "clue": "維也納新年音樂會每年的壓軸安可曲，觀眾皆會隨音樂節拍熱烈拍手應和。"
  },
  {
    "id": "classical_17",
    "tag": "古典音樂",
    "title": "威風凜凜進行曲",
    "artist": "艾爾加 (Elgar)",
    "youtubeUrl": "https://www.youtube.com/watch?v=moL4MkJ-aLk",
    "youtubeId": "moL4MkJ-aLk",
    "startTime": 20,
    "duration": 60,
    "options": [
      "威風凜凜進行曲",
      "拉德茨基進行曲",
      "威廉泰爾序曲",
      "行星組曲"
    ],
    "clue": "艾爾加《第1號威風凜凜進行曲》，中段莊嚴頌歌被譽為英國第二國歌，亦常作為畢業典禮進行曲。"
  },
  {
    "id": "classical_18",
    "tag": "古典音樂",
    "title": "威廉泰爾序曲",
    "artist": "羅西尼 (Rossini)",
    "youtubeUrl": "https://www.youtube.com/watch?v=c7O91GDWGPU",
    "youtubeId": "c7O91GDWGPU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "威廉泰爾序曲",
      "輕騎兵序曲",
      "1812序曲",
      "卡門序曲"
    ],
    "clue": "羅西尼歌劇《威廉·泰爾》序曲終段，萬馬奔騰的急板象徵瑞士勇士英勇作戰。"
  },
  {
    "id": "classical_19",
    "tag": "古典音樂",
    "title": "匈牙利舞曲第5號",
    "artist": "布拉姆斯 (Brahms)",
    "youtubeUrl": "https://www.youtube.com/watch?v=3X9LvC9WkkQ",
    "youtubeId": "3X9LvC9WkkQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "匈牙利舞曲第5號",
      "斯拉夫舞曲",
      "大學慶典序曲",
      "搖籃曲"
    ],
    "clue": "融合吉普賽熱情節奏與匈牙利查爾達斯舞曲風格，速度變換極具戲劇張力。"
  },
  {
    "id": "classical_20",
    "tag": "古典音樂",
    "title": "康康舞曲",
    "artist": "奧芬巴哈 (Offenbach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4Diu2N8TGKA",
    "youtubeId": "4Diu2N8TGKA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "康康舞曲",
      "劍舞",
      "卡門序曲",
      "大黃蜂的飛行"
    ],
    "clue": "出自喜歌劇《地獄中的奧菲歐》，熱情奔放、踢腿歡慶的旋律聞名全球。"
  },
  {
    "id": "classical_21",
    "tag": "古典音樂",
    "title": "月光奏鳴曲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4Tr0otuiQuU",
    "youtubeId": "4Tr0otuiQuU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "月光奏鳴曲",
      "熱情奏鳴曲",
      "悲愴奏鳴曲",
      "告別奏鳴曲"
    ],
    "clue": "貝多芬第14號鋼琴奏鳴曲第1樂章，詩人雷爾斯塔布形容其如「琉森湖月光蕩漾的微光」。"
  },
  {
    "id": "classical_22",
    "tag": "古典音樂",
    "title": "悲愴奏鳴曲",
    "artist": "貝多芬 (Beethoven)",
    "youtubeUrl": "https://www.youtube.com/watch?v=vGq3-Fi_zQY",
    "youtubeId": "vGq3-Fi_zQY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "悲愴奏鳴曲",
      "月光奏鳴曲",
      "華德斯坦奏鳴曲",
      "暴風雨奏鳴曲"
    ],
    "clue": "貝多芬第8號鋼琴奏鳴曲第2樂章 (Adagio cantabile)，旋律極為深情溫柔。"
  },
  {
    "id": "classical_23",
    "tag": "古典音樂",
    "title": "胡桃鉗 - 俄羅斯舞曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=z2ISRMSIyX8",
    "youtubeId": "z2ISRMSIyX8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "胡桃鉗 - 俄羅斯舞曲",
      "胡桃鉗 - 蘆笛之舞",
      "花之圓舞曲",
      "天鵝湖"
    ],
    "clue": "芭蕾舞劇《胡桃鉗》中節奏明快、充滿旋轉與跳躍活力的特雷帕克 (Trepak) 舞曲。"
  },
  {
    "id": "classical_24",
    "tag": "古典音樂",
    "title": "1812序曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=VbxgYlcNxE8",
    "youtubeId": "VbxgYlcNxE8",
    "startTime": 20,
    "duration": 60,
    "options": [
      "1812序曲",
      "羅密歐與茱麗葉幻想序曲",
      "天鵝湖序曲",
      "義大利隨想曲"
    ],
    "clue": "為紀念1812年俄法戰爭而作，樂曲高潮動用了真正的加農砲聲與教堂鐘聲慶祝勝利。"
  },
  {
    "id": "classical_25",
    "tag": "古典音樂",
    "title": "天鵝湖 - 四小天鵝舞曲",
    "artist": "柴可夫斯基 (Tchaikovsky)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Xd2nTXsivHs",
    "youtubeId": "Xd2nTXsivHs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天鵝湖 - 四小天鵝舞曲",
      "胡桃鉗 - 糖梅仙子",
      "睡美人圓舞曲",
      "吉賽兒"
    ],
    "clue": "《天鵝湖》第2幕最膾炙人口的輕快四重奏，四位芭蕾舞者手挽著手同步跳躍。"
  },
  {
    "id": "classical_26",
    "tag": "古典音樂",
    "title": "四季 - 冬",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZPdk5GaIDjo",
    "youtubeId": "ZPdk5GaIDjo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "四季 - 冬",
      "四季 - 春",
      "四季 - 夏",
      "四季 - 秋"
    ],
    "clue": "韋瓦第《四季》協奏曲「冬」第1樂章，快速拉奏的琴音生動描摹在刺骨冰雪中瑟瑟發抖之景。"
  },
  {
    "id": "classical_27",
    "tag": "古典音樂",
    "title": "四季 - 夏 (急板)",
    "artist": "韋瓦第 (Vivaldi)",
    "youtubeUrl": "https://www.youtube.com/watch?v=g65oWFMSoK0",
    "youtubeId": "g65oWFMSoK0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "四季 - 夏 (急板)",
      "四季 - 春",
      "四季 - 秋",
      "四季 - 冬"
    ],
    "clue": "韋瓦第《四季》協奏曲「夏」第3樂章，狂暴的弦樂暴風雨傾盆而下，戲劇張力極強。"
  },
  {
    "id": "classical_28",
    "tag": "古典音樂",
    "title": "小步舞曲",
    "artist": "巴哈 (Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=p1gGxpitLO8",
    "youtubeId": "p1gGxpitLO8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小步舞曲",
      "G弦上的詠嘆調",
      "布蘭登堡協奏曲",
      "聖母頌"
    ],
    "clue": "選自《安娜·瑪格達蓮娜·巴哈的筆記本》，旋律優雅輕快，為鋼琴初學必彈名作。"
  },
  {
    "id": "classical_29",
    "tag": "古典音樂",
    "title": "耶穌，世人仰望的喜悅",
    "artist": "巴哈 (Bach)",
    "youtubeUrl": "https://www.youtube.com/watch?v=oduhc96kTlw",
    "youtubeId": "oduhc96kTlw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "耶穌，世人仰望的喜悅",
      "D小調觸技曲",
      "G弦上的詠嘆調",
      "賦格的藝術"
    ],
    "clue": "巴哈第147號清唱套曲中著名的聖詠，流暢起伏的三連音帶來無比溫暖與心靈平靜。"
  },
  {
    "id": "classical_30",
    "tag": "古典音樂",
    "title": "第40號交響曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=BJPmYURJk4c",
    "youtubeId": "BJPmYURJk4c",
    "startTime": 0,
    "duration": 60,
    "options": [
      "第40號交響曲",
      "第41號交響曲 (朱庇特)",
      "第39號交響曲",
      "小夜曲"
    ],
    "clue": "莫札特G小調第40號交響曲 (K.550) 開頭，哀愁而優美的短調弦樂急速奔馳。"
  },
  {
    "id": "classical_31",
    "tag": "古典音樂",
    "title": "費加洛婚禮序曲",
    "artist": "莫札特 (Mozart)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ikQNFqVkNNc",
    "youtubeId": "ikQNFqVkNNc",
    "startTime": 0,
    "duration": 60,
    "options": [
      "費加洛婚禮序曲",
      "魔笛序曲",
      "唐·喬望尼序曲",
      "後宮誘逃序曲"
    ],
    "clue": "莫札特著名歌劇序曲，整首樂曲節奏明快、生動活潑，充滿歡樂與幽默氣氛。"
  },
  {
    "id": "classical_32",
    "tag": "古典音樂",
    "title": "英雄波蘭舞曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=p_iI1J0bALE",
    "youtubeId": "p_iI1J0bALE",
    "startTime": 10,
    "duration": 60,
    "options": [
      "英雄波蘭舞曲",
      "軍隊波蘭舞曲",
      "小狗圓舞曲",
      "革命練習曲"
    ],
    "clue": "蕭邦降A大調第6號波蘭舞曲 (Op.53)，宏偉莊嚴的音型展現波蘭民族的英雄氣概。"
  },
  {
    "id": "classical_33",
    "tag": "古典音樂",
    "title": "雨滴前奏曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=R2d2spnXyLA",
    "youtubeId": "R2d2spnXyLA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "雨滴前奏曲",
      "離別曲",
      "黑鍵練習曲",
      "華麗大圓舞曲"
    ],
    "clue": "降D大調第15號前奏曲 (Op.28 No.15)，持續敲擊的降A單音宛如窗外規律滴落的雨點。"
  },
  {
    "id": "classical_34",
    "tag": "古典音樂",
    "title": "幻想即興曲",
    "artist": "蕭邦 (Chopin)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Gus4dnQuiGk",
    "youtubeId": "Gus4dnQuiGk",
    "startTime": 0,
    "duration": 60,
    "options": [
      "幻想即興曲",
      "夜曲",
      "英雄波蘭舞曲",
      "平靜的行板"
    ],
    "clue": "升C小調第4號即興曲 (Op.66)，右手四連音對上左手三連音的交錯奔馳，旋律極為動人。"
  },
  {
    "id": "classical_35",
    "tag": "古典音樂",
    "title": "鱒魚五重奏",
    "artist": "舒伯特 (Schubert)",
    "youtubeUrl": "https://www.youtube.com/watch?v=HwbWvGtaZGo",
    "youtubeId": "HwbWvGtaZGo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鱒魚五重奏",
      "未完成交響曲",
      "魔王",
      "死神與少女"
    ],
    "clue": "舒伯特A大調鋼琴五重奏 (D.667) 第4樂章，以其藝術歌曲《鱒魚》之旋律作為變奏主題。"
  },
  {
    "id": "classical_36",
    "tag": "古典音樂",
    "title": "聖母頌",
    "artist": "舒伯特 (Schubert)",
    "youtubeUrl": "https://www.youtube.com/watch?v=2H5rusicEnc",
    "youtubeId": "2H5rusicEnc",
    "startTime": 0,
    "duration": 60,
    "options": [
      "聖母頌",
      "小夜曲",
      "野玫瑰",
      "菩提樹"
    ],
    "clue": "舒伯特經典藝術歌曲 (D.839)，虔誠安詳的旋律傳達聖潔慈悲的力量。"
  },
  {
    "id": "classical_37",
    "tag": "古典音樂",
    "title": "棕髮少女",
    "artist": "德布西 (Debussy)",
    "youtubeUrl": "https://www.youtube.com/watch?v=jGSZPRk6aXA",
    "youtubeId": "jGSZPRk6aXA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "棕髮少女",
      "月光",
      "亞麻色頭髮的少女",
      "牧神的午後"
    ],
    "clue": "選自德布西《前奏曲集》第1冊第8首，優雅柔和的五聲音階展現純真恬靜的少女氣息。"
  },
  {
    "id": "classical_38",
    "tag": "古典音樂",
    "title": "新世界交響曲 (念故鄉)",
    "artist": "德弗札克 (Dvořák)",
    "youtubeUrl": "https://www.youtube.com/watch?v=ASlch7R1Zvo",
    "youtubeId": "ASlch7R1Zvo",
    "startTime": 30,
    "duration": 60,
    "options": [
      "新世界交響曲 (念故鄉)",
      "大提琴協奏曲",
      "斯拉夫舞曲",
      "狂歡節序曲"
    ],
    "clue": "德弗札克第9號交響曲第2樂章，英國管奏出充滿鄉愁的悠揚旋律，中文填詞為〈念故鄉〉。"
  },
  {
    "id": "classical_39",
    "tag": "古典音樂",
    "title": "卡門 - 鬥牛士之歌",
    "artist": "比才 (Bizet)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4DNGMoMNLRY",
    "youtubeId": "4DNGMoMNLRY",
    "startTime": 10,
    "duration": 60,
    "options": [
      "卡門 - 鬥牛士之歌",
      "卡門 - 哈巴奈拉舞曲",
      "阿萊城的姑娘",
      "塞維亞的理髮師"
    ],
    "clue": "比才歌劇《卡門》第2幕，鬥牛士埃斯卡米諾昂首步入酒館時高唱的威武進行曲。"
  },
  {
    "id": "classical_40",
    "tag": "古典音樂",
    "title": "行星組曲 - 木星 (歡樂之神)",
    "artist": "霍斯特 (Holst)",
    "youtubeUrl": "https://www.youtube.com/watch?v=3aXsQQ-ueBk",
    "youtubeId": "3aXsQQ-ueBk",
    "startTime": 20,
    "duration": 60,
    "options": [
      "行星組曲 - 木星 (歡樂之神)",
      "行星組曲 - 火星",
      "波麗露",
      "展覽會之畫"
    ],
    "clue": "英國作曲家霍斯特代表作，中段莊嚴神聖的旋律亦被填詞為英國著名愛國歌曲。"
  },
  {
    "id": "tw_grade5_1",
    "tag": "台灣五年級",
    "title": "月亮代表我的心",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=bv_cEeDlop0",
    "youtubeId": "bv_cEeDlop0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "月亮代表我的心",
      "甜蜜蜜",
      "夜來香",
      "何日君再來"
    ],
    "clue": "1977年華語傳世經典情歌，主唱為鄧麗君。"
  },
  {
    "id": "tw_grade5_2",
    "tag": "台灣五年級",
    "title": "甜蜜蜜",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=5eF8oOWtsk4",
    "youtubeId": "5eF8oOWtsk4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "甜蜜蜜",
      "月亮代表我的心",
      "恰似你的溫柔",
      "小城故事"
    ],
    "clue": "1979年發行，印尼民謠改編的傳唱經典。"
  },
  {
    "id": "tw_grade5_3",
    "tag": "台灣五年級",
    "title": "小城故事",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=Bgi5f_0atGE",
    "youtubeId": "Bgi5f_0atGE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "小城故事",
      "甜蜜蜜",
      "月亮代表我的心",
      "千言萬語"
    ],
    "clue": "同名電影主題曲，莊奴作詞、翁清溪作曲，歌頌溫馨純樸的小城風光。"
  },
  {
    "id": "tw_grade5_4",
    "tag": "台灣五年級",
    "title": "恰似你的溫柔",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=Yvg3L7RbFHY",
    "youtubeId": "Yvg3L7RbFHY",
    "startTime": 20,
    "duration": 60,
    "options": [
      "恰似你的溫柔",
      "被遺忘的時光",
      "讀你",
      "綠島小夜曲"
    ],
    "clue": "梁弘志作詞作曲，蔡琴低沉渾厚嗓音的成名代表作。"
  },
  {
    "id": "tw_grade5_5",
    "tag": "台灣五年級",
    "title": "被遺忘的時光",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=0OhHf7FfdC0",
    "youtubeId": "0OhHf7FfdC0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "被遺忘的時光",
      "恰似你的溫柔",
      "最後一夜",
      "讀你"
    ],
    "clue": "「是誰在敲打我窗，是誰在撩動琴弦」，電影《無間道》經典名曲。"
  },
  {
    "id": "tw_grade5_6",
    "tag": "台灣五年級",
    "title": "外婆的澎湖灣",
    "artist": "潘安邦",
    "youtubeUrl": "https://www.youtube.com/watch?v=oqeC2vbrfsQ",
    "youtubeId": "oqeC2vbrfsQ",
    "startTime": 10,
    "duration": 60,
    "options": [
      "外婆的澎湖灣",
      "鄉間的小路",
      "踏浪",
      "聚散兩依依"
    ],
    "clue": "葉佳修為潘安邦量身創作，描繪澎湖童年與外婆溫馨祖孫情的民歌代表。"
  },
  {
    "id": "tw_grade5_7",
    "tag": "台灣五年級",
    "title": "鄉間的小路",
    "artist": "葉佳修",
    "youtubeUrl": "https://www.youtube.com/watch?v=abBnysri-XI",
    "youtubeId": "abBnysri-XI",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鄉間的小路",
      "外婆的澎湖灣",
      "赤足走在田埂上",
      "爸爸的草鞋"
    ],
    "clue": "「走在鄉間的小路上，暮歸的老牛是我同伴」，校園民歌鄉土情懷經典。"
  },
  {
    "id": "tw_grade5_8",
    "tag": "台灣五年級",
    "title": "橄欖樹",
    "artist": "齊豫",
    "youtubeUrl": "https://www.youtube.com/watch?v=LZb8fJZFhlo",
    "youtubeId": "LZb8fJZFhlo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "橄欖樹",
      "歡顏",
      "夢田",
      "走在雨中"
    ],
    "clue": "三毛作詞、李泰祥作曲，「不要問我從哪裡來，我的故鄉在遠方」。"
  },
  {
    "id": "tw_grade5_9",
    "tag": "台灣五年級",
    "title": "童年",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=534LRELoxJs",
    "youtubeId": "534LRELoxJs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "童年",
      "光陰的故事",
      "鹿港小鎮",
      "戀曲1990"
    ],
    "clue": "「池塘邊的榕樹上，知了在聲聲叫著夏天」，勾起無數人的純真童年。"
  },
  {
    "id": "tw_grade5_10",
    "tag": "台灣五年級",
    "title": "光陰的故事",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=6rP9gV2YMJs",
    "youtubeId": "6rP9gV2YMJs",
    "startTime": 20,
    "duration": 60,
    "options": [
      "光陰的故事",
      "童年",
      "閃亮的日子",
      "野百合也有春天"
    ],
    "clue": "「流水它帶走光陰的故事改變了一個人」，台灣校園民歌邁入成熟的里程碑。"
  },
  {
    "id": "tw_grade5_11",
    "tag": "台灣五年級",
    "title": "鹿港小鎮",
    "artist": "羅大佑",
    "youtubeUrl": "https://www.youtube.com/watch?v=Xgjny7YFMD4",
    "youtubeId": "Xgjny7YFMD4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "鹿港小鎮",
      "戀曲1980",
      "童年",
      "之乎者也"
    ],
    "clue": "「台北不是我的家，我的家鄉沒有霓虹燈」，震撼華語樂壇的批判搖滾先河。"
  },
  {
    "id": "tw_grade5_12",
    "tag": "台灣五年級",
    "title": "龍的傳人",
    "artist": "李建復",
    "youtubeUrl": "https://www.youtube.com/watch?v=L8kLPuBSruc",
    "youtubeId": "L8kLPuBSruc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "龍的傳人",
      "曠野寄情",
      "歸去來兮",
      "中華民國頌"
    ],
    "clue": "侯德健作詞作曲，「古老的東方有一條龍，它的名字就叫中國」。"
  },
  {
    "id": "tw_grade5_13",
    "tag": "台灣五年級",
    "title": "捉泥鰍",
    "artist": "包美聖",
    "youtubeUrl": "https://www.youtube.com/watch?v=AdbqRQfaOz8",
    "youtubeId": "AdbqRQfaOz8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "捉泥鰍",
      "看我聽我",
      "小茉莉",
      "蘭花草"
    ],
    "clue": "「天天同歌同歡笑，捉泥鰍捉泥鰍」，純真歡快的校園民歌代表作。"
  },
  {
    "id": "tw_grade5_14",
    "tag": "台灣五年級",
    "title": "阿美阿美",
    "artist": "王夢麟",
    "youtubeUrl": "https://www.youtube.com/watch?v=NoY2m1iSTsw",
    "youtubeId": "NoY2m1iSTsw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "阿美阿美",
      "木棉道",
      "雨中即景",
      "七月涼山"
    ],
    "clue": "王夢麟幽默詼諧的校園民歌：「阿美阿美幾時辦嫁妝，我說阿美呀人老珠黃」。"
  },
  {
    "id": "tw_grade5_15",
    "tag": "台灣五年級",
    "title": "三月裡的小雨",
    "artist": "劉文正",
    "youtubeUrl": "https://www.youtube.com/watch?v=67fJktZWFQ8",
    "youtubeId": "67fJktZWFQ8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "三月裡的小雨",
      "諾言",
      "熱線你和我",
      "遲到"
    ],
    "clue": "巨星劉文正1981年經典代表作，「三月裡的小雨淅瀝瀝下個不停」。"
  },
  {
    "id": "tw_grade5_16",
    "tag": "台灣五年級",
    "title": "掌聲響起",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=_q794pPonKY",
    "youtubeId": "_q794pPonKY",
    "startTime": 30,
    "duration": 60,
    "options": [
      "掌聲響起",
      "祝你幸福",
      "敲敲門",
      "流水年華"
    ],
    "clue": "「帽子歌后」鳳飛飛傳唱半世紀的心聲名曲：「孤獨站在這舞台，聽到掌聲響起來」。"
  },
  {
    "id": "tw_grade5_17",
    "tag": "台灣五年級",
    "title": "祝你幸福",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=AIcWy2GMhtA",
    "youtubeId": "AIcWy2GMhtA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "祝你幸福",
      "掌聲響起",
      "月朦朧鳥朦朧",
      "枫葉情"
    ],
    "clue": "鳳飛飛出道成名曲：「人生的旅途有甘有苦，要有堅強意志，祝你幸福」。"
  },
  {
    "id": "tw_grade5_18",
    "tag": "台灣五年級",
    "title": "熱情的沙漠",
    "artist": "歐陽菲菲",
    "youtubeUrl": "https://www.youtube.com/watch?v=PwmwtCQEcJ0",
    "youtubeId": "PwmwtCQEcJ0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "熱情的沙漠",
      "逝去的愛",
      "愛的路上我和你",
      "嚮往"
    ],
    "clue": "歐陽菲菲動感爆發力經典：「我的熱情，好像一把火，燃燒了整個沙漠」。"
  },
  {
    "id": "tw_grade5_19",
    "tag": "台灣五年級",
    "title": "就在今夜",
    "artist": "丘丘合唱團",
    "youtubeUrl": "https://www.youtube.com/watch?v=NUPOUgQxHHU",
    "youtubeId": "NUPOUgQxHHU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "就在今夜",
      "河堤上的傻瓜",
      "為何夢見他",
      "摇滾同學會"
    ],
    "clue": "娃娃金智娟沙啞狂野嗓音，打破校園民歌平靜、開啟台灣流行搖滾新時代。"
  },
  {
    "id": "tw_grade5_20",
    "tag": "台灣五年級",
    "title": "一剪梅",
    "artist": "費玉清",
    "youtubeUrl": "https://www.youtube.com/watch?v=VKq2flvS7dw",
    "youtubeId": "VKq2flvS7dw",
    "startTime": 20,
    "duration": 60,
    "options": [
      "一剪梅",
      "晚安曲",
      "夢駝鈴",
      "千里之外"
    ],
    "clue": "「真情像草原廣闊，層層風雨不能阻隔」，費玉清清亮嗓音紅遍海內外。"
  },
  {
    "id": "tw_grade5_21",
    "tag": "台灣五年級",
    "title": "我只在乎你",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=LE6vRCpcbb8",
    "youtubeId": "LE6vRCpcbb8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我只在乎你",
      "月亮代表我的心",
      "甜蜜蜜",
      "何日君再來"
    ],
    "clue": "鄧麗君1987年經典傳世名作，「任時光匆匆流去，我只在乎你」。"
  },
  {
    "id": "tw_grade5_22",
    "tag": "台灣五年級",
    "title": "千言萬語",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=fKKrtdgD5vQ",
    "youtubeId": "fKKrtdgD5vQ",
    "startTime": 10,
    "duration": 60,
    "options": [
      "千言萬語",
      "小城故事",
      "海韻",
      "原鄉人"
    ],
    "clue": "電影《彩雲飛》插曲，「不知道為了什麼，憂愁它圍繞著我」。"
  },
  {
    "id": "tw_grade5_23",
    "tag": "台灣五年級",
    "title": "何日君再來",
    "artist": "鄧麗君",
    "youtubeUrl": "https://www.youtube.com/watch?v=7guSDkKIpX0",
    "youtubeId": "7guSDkKIpX0",
    "startTime": 10,
    "duration": 60,
    "options": [
      "何日君再來",
      "夜來香",
      "月亮代表我的心",
      "小城故事"
    ],
    "clue": "華語流行經典，「好花不常開，好景不常在，愁堆解笑眉，淚灑相思帶」。"
  },
  {
    "id": "tw_grade5_24",
    "tag": "台灣五年級",
    "title": "流水年華",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=0B7EH-cYnfo",
    "youtubeId": "0B7EH-cYnfo",
    "startTime": 10,
    "duration": 60,
    "options": [
      "流水年華",
      "掌聲響起",
      "祝你幸福",
      "敲敲門"
    ],
    "clue": "帽子歌后鳳飛飛經典名曲，「朦朧的街燈，靜靜的躺在小雨中」。"
  },
  {
    "id": "tw_grade5_25",
    "tag": "台灣五年級",
    "title": "追夢人",
    "artist": "鳳飛飛",
    "youtubeUrl": "https://www.youtube.com/watch?v=JvQkhr3CWsI",
    "youtubeId": "JvQkhr3CWsI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "追夢人",
      "掌聲響起",
      "心肝寶貝",
      "月朦朧鳥朦朧"
    ],
    "clue": "羅大佑作詞作曲，電視劇《雪山飛狐》片尾曲，「讓流浪的足跡在荒漠裡寫下永久的回憶」。"
  },
  {
    "id": "tw_grade5_26",
    "tag": "台灣五年級",
    "title": "讀你",
    "artist": "蔡琴",
    "youtubeUrl": "https://www.youtube.com/watch?v=CAtivvxfA_8",
    "youtubeId": "CAtivvxfA_8",
    "startTime": 10,
    "duration": 60,
    "options": [
      "讀你",
      "恰似你的溫柔",
      "被遺忘的時光",
      "最後一夜"
    ],
    "clue": "梁弘志作詞作曲，「讀你千遍也不厭倦，讀你的感覺像三月」。"
  },
  {
    "id": "tw_grade5_27",
    "tag": "台灣五年級",
    "title": "晚安曲",
    "artist": "費玉清",
    "youtubeUrl": "https://www.youtube.com/watch?v=xrBzx1WjD7I",
    "youtubeId": "xrBzx1WjD7I",
    "startTime": 10,
    "duration": 60,
    "options": [
      "晚安曲",
      "一剪梅",
      "中華民國頌",
      "夢駝鈴"
    ],
    "clue": "劉家昌作詞作曲，全台百貨公司與各機關學校每日打烊閉館的經典代表播音。"
  },
  {
    "id": "tw_grade5_28",
    "tag": "台灣五年級",
    "title": "中華民國頌",
    "artist": "費玉清",
    "youtubeUrl": "https://www.youtube.com/watch?v=0FIBbXgOJFg",
    "youtubeId": "0FIBbXgOJFg",
    "startTime": 10,
    "duration": 60,
    "options": [
      "中華民國頌",
      "一剪梅",
      "國恩家慶",
      "梅花"
    ],
    "clue": "劉家昌作詞作曲，慷慨激昂傳唱數十載的經典愛國歌曲。"
  },
  {
    "id": "tw_grade5_29",
    "tag": "台灣五年級",
    "title": "歡顏",
    "artist": "齊豫",
    "youtubeUrl": "https://www.youtube.com/watch?v=QctMbIWIgoc",
    "youtubeId": "QctMbIWIgoc",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歡顏",
      "橄欖樹",
      "走在雨中",
      "你是我所有的回憶"
    ],
    "clue": "電影《歡顏》同名主題曲，齊豫空靈縹緲的嗓音令人難以忘懷。"
  },
  {
    "id": "tw_grade5_30",
    "tag": "台灣五年級",
    "title": "歸去來兮",
    "artist": "李建復",
    "youtubeUrl": "https://www.youtube.com/watch?v=ldoHPkultPI",
    "youtubeId": "ldoHPkultPI",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歸去來兮",
      "龍的傳人",
      "曠野寄情",
      "柴拉可汗"
    ],
    "clue": "侯德健作詞作曲，台灣校園民歌時期的著名抒情史詩名篇。"
  },
  {
    "id": "tw_grade5_31",
    "tag": "台灣五年級",
    "title": "看我！聽我！",
    "artist": "包美聖",
    "youtubeUrl": "https://www.youtube.com/watch?v=g1O1PQlCh-g",
    "youtubeId": "g1O1PQlCh-g",
    "startTime": 10,
    "duration": 60,
    "options": [
      "看我！聽我！",
      "捉泥鰍",
      "小雨中的回憶",
      "秋蟬"
    ],
    "clue": "邱晨詞曲，校園民歌代表作，「看看我，聽聽我，我從山中來，帶著蘭花草」。"
  },
  {
    "id": "tw_grade5_32",
    "tag": "台灣五年級",
    "title": "歸人沙城",
    "artist": "施孝榮",
    "youtubeUrl": "https://www.youtube.com/watch?v=ruUo9axPFJE",
    "youtubeId": "ruUo9axPFJE",
    "startTime": 10,
    "duration": 60,
    "options": [
      "歸人沙城",
      "拜訪春天",
      "中華之愛",
      "俠客"
    ],
    "clue": "陳輝雄詞曲，施孝榮渾厚豪邁的嗓音唱出塞外大漠的滄桑與堅毅。"
  },
  {
    "id": "tw_grade5_33",
    "tag": "台灣五年級",
    "title": "雨中即景",
    "artist": "王夢麟",
    "youtubeUrl": "https://www.youtube.com/watch?v=IzQj1L_ORxI",
    "youtubeId": "IzQj1L_ORxI",
    "startTime": 10,
    "duration": 60,
    "options": [
      "雨中即景",
      "木棉道",
      "阿美阿美",
      "廟會"
    ],
    "clue": "王夢麟自作自唱，「嘩啦啦啦下雨了，大家快點跑」，生動描摹下雨天眾生相。"
  },
  {
    "id": "tw_grade5_34",
    "tag": "台灣五年級",
    "title": "木棉道",
    "artist": "王夢麟",
    "youtubeUrl": "https://www.youtube.com/watch?v=eAKXYUJk7O4",
    "youtubeId": "eAKXYUJk7O4",
    "startTime": 10,
    "duration": 60,
    "options": [
      "木棉道",
      "雨中即景",
      "七月涼山",
      "奔放奔放"
    ],
    "clue": "馬兆駿作曲、洪光達作詞，「紅紅的花開滿了木棉道，長長的街好像在燃燒」。"
  },
  {
    "id": "tw_grade5_35",
    "tag": "台灣五年級",
    "title": "踏著夕陽歸去",
    "artist": "葉佳修",
    "youtubeUrl": "https://www.youtube.com/watch?v=jXhssuHC5h4",
    "youtubeId": "jXhssuHC5h4",
    "startTime": 10,
    "duration": 60,
    "options": [
      "踏著夕陽歸去",
      "鄉間的小路",
      "外婆的澎湖灣",
      "流浪者的獨白"
    ],
    "clue": "葉佳修鄉村田園風格代表作，「遠遠的街燈明了，好像閃著無數的明星」。"
  },
  {
    "id": "tw_grade5_36",
    "tag": "台灣五年級",
    "title": "蘭花草",
    "artist": "劉文正",
    "youtubeUrl": "https://www.youtube.com/watch?v=1tblJoVfQ3A",
    "youtubeId": "1tblJoVfQ3A",
    "startTime": 10,
    "duration": 60,
    "options": [
      "蘭花草",
      "三月裡的小雨",
      "諾言",
      "熱線你和我"
    ],
    "clue": "改編自胡適詩作，「我從山中來，帶著蘭花草，種在小園中，希望花開早」。"
  },
  {
    "id": "tw_grade5_37",
    "tag": "台灣五年級",
    "title": "諾言",
    "artist": "劉文正",
    "youtubeUrl": "https://www.youtube.com/watch?v=ssK7r4yIGVw",
    "youtubeId": "ssK7r4yIGVw",
    "startTime": 10,
    "duration": 60,
    "options": [
      "諾言",
      "三月裡的小雨",
      "閃亮的日子",
      "沉思"
    ],
    "clue": "孫儀作詞、劉家昌作曲，巨星劉文正早期轟動全台的成名抒情金曲。"
  },
  {
    "id": "tw_grade5_38",
    "tag": "台灣五年級",
    "title": "逝去的愛",
    "artist": "歐陽菲菲",
    "youtubeUrl": "https://www.youtube.com/watch?v=eYZTOlS5SIM",
    "youtubeId": "eYZTOlS5SIM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "逝去的愛",
      "熱情的沙漠",
      "愛的路上我和你",
      "感恩的心"
    ],
    "clue": "Love is over，歐陽菲菲以渾厚動人的歌喉紅遍台日兩地的流行金曲。"
  },
  {
    "id": "tw_grade5_39",
    "tag": "台灣五年級",
    "title": "酒矸倘賣無",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=HhO7NqVLLFc",
    "youtubeId": "HhO7NqVLLFc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "酒矸倘賣無",
      "一樣的月光",
      "請跟我來",
      "親愛的小孩"
    ],
    "clue": "電影《搭錯車》主題曲，侯德健作詞作曲，蘇芮震撼人心的靈魂嘶吼。"
  },
  {
    "id": "tw_grade5_40",
    "tag": "台灣五年級",
    "title": "一樣的月光",
    "artist": "蘇芮",
    "youtubeUrl": "https://www.youtube.com/watch?v=dqcoG9LUzgE",
    "youtubeId": "dqcoG9LUzgE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "一樣的月光",
      "酒矸倘賣無",
      "跟著感覺走",
      "牽手"
    ],
    "clue": "吳念真、羅大佑作詞、李壽全作曲，「什麼時候兒時玩伴都離我遠去」。"
  },
  {
    "id": "tw_grade6_1",
    "tag": "台灣六年級",
    "title": "青蘋果樂園",
    "artist": "小虎隊",
    "youtubeUrl": "https://www.youtube.com/watch?v=UPFeAndsDRQ",
    "youtubeId": "UPFeAndsDRQ",
    "startTime": 20,
    "duration": 60,
    "options": [
      "青蘋果樂園",
      "紅蜻蜓",
      "蝴蝶飛呀",
      "愛"
    ],
    "clue": "小虎隊出道成名曲，「週末午夜別徘徊，快到蘋果樂園來」引爆全台追星狂潮。"
  },
  {
    "id": "tw_grade6_2",
    "tag": "台灣六年級",
    "title": "紅蜻蜓",
    "artist": "小虎隊",
    "youtubeUrl": "https://www.youtube.com/watch?v=NbSf07Zr3ow",
    "youtubeId": "NbSf07Zr3ow",
    "startTime": 20,
    "duration": 60,
    "options": [
      "紅蜻蜓",
      "青蘋果樂園",
      "星光依舊燦爛",
      "放心去飛"
    ],
    "clue": "「飛呀，飛呀，看那紅色蜻蜓飛在藍天綠草的上方」，無數六年級生的成長印記。"
  },
  {
    "id": "tw_grade6_3",
    "tag": "台灣六年級",
    "title": "吻別",
    "artist": "張學友",
    "youtubeUrl": "https://www.youtube.com/watch?v=mIF-nn_y2_8",
    "youtubeId": "mIF-nn_y2_8",
    "startTime": 30,
    "duration": 60,
    "options": [
      "吻別",
      "一千個傷心的理由",
      "情網",
      "祝福"
    ],
    "clue": "歌神張學友1993年巔峰之作，「我和你吻別在無人的街」，創下華語唱片銷售奇蹟。"
  },
  {
    "id": "tw_grade6_4",
    "tag": "台灣六年級",
    "title": "一千個傷心的理由",
    "artist": "張學友",
    "youtubeUrl": "https://www.youtube.com/watch?v=Yl9sIjmaZP8",
    "youtubeId": "Yl9sIjmaZP8",
    "startTime": 25,
    "duration": 60,
    "options": [
      "一千個傷心的理由",
      "吻別",
      "心如刀割",
      "忘記你我做不到"
    ],
    "clue": "張學友抒情傳唱金曲，「一千個傷心的理由，最後我的愛情在故事裡慢慢陳舊」。"
  },
  {
    "id": "tw_grade6_5",
    "tag": "台灣六年級",
    "title": "忘情水",
    "artist": "劉德華",
    "youtubeUrl": "https://www.youtube.com/watch?v=pKoeIPTlTDI",
    "youtubeId": "pKoeIPTlTDI",
    "startTime": 30,
    "duration": 60,
    "options": [
      "忘情水",
      "謝謝你的愛",
      "冰雨",
      "天意"
    ],
    "clue": "劉德華華語代表名曲，「給我一杯忘情水，換我一生不傷悲」。"
  },
  {
    "id": "tw_grade6_6",
    "tag": "台灣六年級",
    "title": "我的未來不是夢",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=lTxZmhAoSGU",
    "youtubeId": "lTxZmhAoSGU",
    "startTime": 30,
    "duration": 60,
    "options": [
      "我的未來不是夢",
      "天天想你",
      "大海",
      "口是心非"
    ],
    "clue": "張雨生高亢清澈的嗓音，激勵幾代年輕人堅持理想的熱血國歌。"
  },
  {
    "id": "tw_grade6_7",
    "tag": "台灣六年級",
    "title": "天天想你",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=qSslpWSSTLg",
    "youtubeId": "qSslpWSSTLg",
    "startTime": 25,
    "duration": 60,
    "options": [
      "天天想你",
      "我的未來不是夢",
      "帶我去月球",
      "大海"
    ],
    "clue": "張雨生首張個人專輯同名主打歌，「天天想你，天天問自己，到什麼時候才能告訴你」。"
  },
  {
    "id": "tw_grade6_8",
    "tag": "台灣六年級",
    "title": "朋友",
    "artist": "周華健",
    "youtubeUrl": "https://www.youtube.com/watch?v=6lbPgfKK7m4",
    "youtubeId": "6lbPgfKK7m4",
    "startTime": 45,
    "duration": 60,
    "options": [
      "朋友",
      "讓我歡喜讓我憂",
      "花心",
      "凡人歌"
    ],
    "clue": "「一句話一輩子，一生情一杯酒」，畢業與同窗聚會必唱曲。"
  },
  {
    "id": "tw_grade6_9",
    "tag": "台灣六年級",
    "title": "花心",
    "artist": "周華健",
    "youtubeUrl": "https://www.youtube.com/watch?v=IZ8-K3YPVN0",
    "youtubeId": "IZ8-K3YPVN0",
    "startTime": 20,
    "duration": 60,
    "options": [
      "花心",
      "朋友",
      "愛相隨",
      "風雨無阻"
    ],
    "clue": "周華健1993年紅遍大街小巷的代表作，「花的心藏在蕊中，空把花期都錯過」。"
  },
  {
    "id": "tw_grade6_10",
    "tag": "台灣六年級",
    "title": "新鴛鴦蝴蝶夢",
    "artist": "黃安",
    "youtubeUrl": "https://www.youtube.com/watch?v=lDkKHtaBGaY",
    "youtubeId": "lDkKHtaBGaY",
    "startTime": 35,
    "duration": 60,
    "options": [
      "新鴛鴦蝴蝶夢",
      "包青天",
      "得意的笑",
      "愛江山更愛美人"
    ],
    "clue": "1993年華視電視連續劇《包青天》經典片尾曲。"
  },
  {
    "id": "tw_grade6_11",
    "tag": "台灣六年級",
    "title": "愛拼才會贏",
    "artist": "葉啟田",
    "youtubeUrl": "https://www.youtube.com/watch?v=bTPEofbCxB8",
    "youtubeId": "bTPEofbCxB8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愛拼才會贏",
      "浪子的心情",
      "歡喜就好",
      "家後"
    ],
    "clue": "經典台語勵志歌曲：「三分天註定，七分靠打拼」。"
  },
  {
    "id": "tw_grade6_12",
    "tag": "台灣六年級",
    "title": "家後",
    "artist": "江蕙",
    "youtubeUrl": "https://www.youtube.com/watch?v=KAntP2xs8FE",
    "youtubeId": "KAntP2xs8FE",
    "startTime": 35,
    "duration": 60,
    "options": [
      "家後",
      "落雨聲",
      "酒後的心聲",
      "傷心酒店"
    ],
    "clue": "鄭進一作詞作曲，江蕙道盡傳統妻子相伴一生的動人台語情歌。"
  },
  {
    "id": "tw_grade6_13",
    "tag": "台灣六年級",
    "title": "浪人情歌",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=OPkqtboFFYI",
    "youtubeId": "OPkqtboFFYI",
    "startTime": 25,
    "duration": 60,
    "options": [
      "浪人情歌",
      "挪威的森林",
      "愛你一萬年",
      "樹枝孤鳥"
    ],
    "clue": "「不要再想妳，不要再愛妳，讓時間悄悄的飛逝」，伍佰經典台式搖滾。"
  },
  {
    "id": "tw_grade6_14",
    "tag": "台灣六年級",
    "title": "挪威的森林",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=gPpZJlE0Ca8",
    "youtubeId": "gPpZJlE0Ca8",
    "startTime": 30,
    "duration": 60,
    "options": [
      "挪威的森林",
      "浪人情歌",
      "淚橋",
      "白鴿"
    ],
    "clue": "「讓我將妳心兒摘下，試著將它慢慢融化」，伍佰最著名的代表作之一。"
  },
  {
    "id": "tw_grade6_15",
    "tag": "台灣六年級",
    "title": "愛如潮水",
    "artist": "張信哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=lt2ZK19_Utw",
    "youtubeId": "lt2ZK19_Utw",
    "startTime": 35,
    "duration": 60,
    "options": [
      "愛如潮水",
      "過火",
      "別怕我傷心",
      "白月光"
    ],
    "clue": "李宗盛詞曲、情歌王子張信哲深情演繹，「既然愛了就不後悔，再多的苦我也願意背」。"
  },
  {
    "id": "tw_grade6_16",
    "tag": "台灣六年級",
    "title": "姐妹",
    "artist": "張惠妹",
    "youtubeUrl": "https://www.youtube.com/watch?v=OO60xtWjLRw",
    "youtubeId": "OO60xtWjLRw",
    "startTime": 20,
    "duration": 60,
    "options": [
      "姐妹",
      "聽海",
      "解脫",
      "原來你什麼都不要"
    ],
    "clue": "張雨生打造、阿妹出道震撼華語樂壇的神專主打，原住民高亢清麗的合聲引領風騷。"
  },
  {
    "id": "tw_grade6_17",
    "tag": "台灣六年級",
    "title": "聽海",
    "artist": "張惠妹",
    "youtubeUrl": "https://www.youtube.com/watch?v=mLk61pfiHQ0",
    "youtubeId": "mLk61pfiHQ0",
    "startTime": 35,
    "duration": 60,
    "options": [
      "聽海",
      "姐妹",
      "我可以抱你嗎",
      "剪愛"
    ],
    "clue": "「聽海哭的聲音，這片海未免也太多情」，KTV不敗情歌之王。"
  },
  {
    "id": "tw_grade6_18",
    "tag": "台灣六年級",
    "title": "心太軟",
    "artist": "任賢齊",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZSWeurc1yMw",
    "youtubeId": "ZSWeurc1yMw",
    "startTime": 30,
    "duration": 60,
    "options": [
      "心太軟",
      "對面的女孩看過來",
      "傷心太平洋",
      "浪花一朵朵"
    ],
    "clue": "小蟲詞曲，紅遍兩岸三地傳唱神話：「你總是心太軟，心太軟，把所有問題都自己扛」。"
  },
  {
    "id": "tw_grade6_19",
    "tag": "台灣六年級",
    "title": "對面的女孩看過來",
    "artist": "任賢齊",
    "youtubeUrl": "https://www.youtube.com/watch?v=6aosRlnxg9I",
    "youtubeId": "6aosRlnxg9I",
    "startTime": 15,
    "duration": 60,
    "options": [
      "對面的女孩看過來",
      "心太軟",
      "春天花會開",
      "浪花一朵朵"
    ],
    "clue": "阿牛創作、任賢齊歡樂演繹的校園把妹神曲：「對面的女孩看過來，看過來，看過來」。"
  },
  {
    "id": "tw_grade6_20",
    "tag": "台灣六年級",
    "title": "向前走",
    "artist": "林強",
    "youtubeUrl": "https://www.youtube.com/watch?v=gD14iiXq7Xw",
    "youtubeId": "gD14iiXq7Xw",
    "startTime": 25,
    "duration": 60,
    "options": [
      "向前走",
      "春風少年兄",
      "黑輪伯仔",
      "愛拼才會贏"
    ],
    "clue": "「火車漸漸在起頭，再會吧！向前走！」引領台灣新台語搖滾浪潮的革命之作。"
  },
  {
    "id": "tw_grade6_21",
    "tag": "台灣六年級",
    "title": "祝福",
    "artist": "張學友",
    "youtubeUrl": "https://www.youtube.com/watch?v=R4qQpZ2PQ1c",
    "youtubeId": "R4qQpZ2PQ1c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "祝福",
      "吻別",
      "一千個傷心的理由",
      "每天愛你多一些"
    ],
    "clue": "華語歌壇畢業與告別第一神曲，「朋友我永遠祝福你」。"
  },
  {
    "id": "tw_grade6_22",
    "tag": "台灣六年級",
    "title": "謝謝你的愛",
    "artist": "劉德華",
    "youtubeUrl": "https://www.youtube.com/watch?v=cMvj_8eoJ8Q",
    "youtubeId": "cMvj_8eoJ8Q",
    "startTime": 15,
    "duration": 60,
    "options": [
      "謝謝你的愛",
      "忘情水",
      "天意",
      "冰雨"
    ],
    "clue": "四大天王劉德華狂銷全亞洲的抒情金曲，「是不宜遲的愛，是不知所措的感慨」。"
  },
  {
    "id": "tw_grade6_23",
    "tag": "台灣六年級",
    "title": "對你愛不完",
    "artist": "郭富城",
    "youtubeUrl": "https://www.youtube.com/watch?v=IIxWKLnaOkc",
    "youtubeId": "IIxWKLnaOkc",
    "startTime": 10,
    "duration": 60,
    "options": [
      "對你愛不完",
      "狂野之城",
      "我是不是該安靜的走開",
      "愛的呼喚"
    ],
    "clue": "郭富城招牌手勢動感神曲，「對你愛愛愛不完，我可以天天月月年年到永遠」。"
  },
  {
    "id": "tw_grade6_24",
    "tag": "台灣六年級",
    "title": "今夜你會不會來",
    "artist": "黎明",
    "youtubeUrl": "https://www.youtube.com/watch?v=eUL6rkTAPhY",
    "youtubeId": "eUL6rkTAPhY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "今夜你會不會來",
      "情深說話未曾講",
      "夏日傾情",
      "深秋的黎明"
    ],
    "clue": "黎明紅遍兩岸三地的經典情歌，「今夜你會不會來，你的愛還在不在」。"
  },
  {
    "id": "tw_grade6_25",
    "tag": "台灣六年級",
    "title": "新年快樂",
    "artist": "小虎隊 / 憂歡派對",
    "youtubeUrl": "https://www.youtube.com/watch?v=I_8UQnG95lk",
    "youtubeId": "I_8UQnG95lk",
    "startTime": 10,
    "duration": 60,
    "options": [
      "新年快樂",
      "青蘋果樂園",
      "紅蜻蜓",
      "逍遙遊"
    ],
    "clue": "小虎隊與憂歡派對合唱，逢年過節大街小巷必播的經典旋律。"
  },
  {
    "id": "tw_grade6_26",
    "tag": "台灣六年級",
    "title": "不是每個戀曲都有美好回憶",
    "artist": "林志穎",
    "youtubeUrl": "https://www.youtube.com/watch?v=UAmjOHiye1s",
    "youtubeId": "UAmjOHiye1s",
    "startTime": 10,
    "duration": 60,
    "options": [
      "不是每個戀曲都有美好回憶",
      "十七歲的雨季",
      "今年夏天",
      "戲夢"
    ],
    "clue": "小旋風林志穎出道成名曲，熱力四射的舞步席捲各大校園。"
  },
  {
    "id": "tw_grade6_27",
    "tag": "台灣六年級",
    "title": "大海",
    "artist": "張雨生",
    "youtubeUrl": "https://www.youtube.com/watch?v=EXaLvBGqQww",
    "youtubeId": "EXaLvBGqQww",
    "startTime": 20,
    "duration": 60,
    "options": [
      "大海",
      "我的未來不是夢",
      "天天想你",
      "口是心非"
    ],
    "clue": "音樂魔術師張雨生高亢嘹亮的傳世名作，「如果大海能夠喚回曾經的愛」。"
  },
  {
    "id": "tw_grade6_28",
    "tag": "台灣六年級",
    "title": "讓我歡喜讓我憂",
    "artist": "周華健",
    "youtubeUrl": "https://www.youtube.com/watch?v=vqTXMw9zdto",
    "youtubeId": "vqTXMw9zdto",
    "startTime": 15,
    "duration": 60,
    "options": [
      "讓我歡喜讓我憂",
      "朋友",
      "花心",
      "愛相隨"
    ],
    "clue": "國民歌王周華健翻唱自恰克與飛鳥的抒情經典，「愛到盡頭，覆水難收」。"
  },
  {
    "id": "tw_grade6_29",
    "tag": "台灣六年級",
    "title": "愛情的盡頭",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=zzlC6ma-SYQ",
    "youtubeId": "zzlC6ma-SYQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愛情的盡頭",
      "浪人情歌",
      "挪威的森林",
      "最後的溫柔"
    ],
    "clue": "伍佰經典搖滾情歌，「若這不是宿命，難道這就是愛情的盡頭」。"
  },
  {
    "id": "tw_grade6_30",
    "tag": "台灣六年級",
    "title": "樹枝孤鳥",
    "artist": "伍佰 & China Blue",
    "youtubeUrl": "https://www.youtube.com/watch?v=ObSPLQ-1fJI",
    "youtubeId": "ObSPLQ-1fJI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "樹枝孤鳥",
      "空襲警報",
      "煞到你",
      "返去故鄉"
    ],
    "clue": "金曲獎最佳流行音樂演唱唱片獎，台語搖滾劃時代前衛鉅作。"
  },
  {
    "id": "tw_grade6_31",
    "tag": "台灣六年級",
    "title": "原來你什麼都不要",
    "artist": "張惠妹",
    "youtubeUrl": "https://www.youtube.com/watch?v=rT4FqOwn-rs",
    "youtubeId": "rT4FqOwn-rs",
    "startTime": 20,
    "duration": 60,
    "options": [
      "原來你什麼都不要",
      "姐妹",
      "聽海",
      "解脫"
    ],
    "clue": "阿妹張惠妹出道首張專輯《姐妹》中催人淚下的抒情大作。"
  },
  {
    "id": "tw_grade6_32",
    "tag": "台灣六年級",
    "title": "領悟",
    "artist": "辛曉琪",
    "youtubeUrl": "https://www.youtube.com/watch?v=RhfUGpEp9to",
    "youtubeId": "RhfUGpEp9to",
    "startTime": 20,
    "duration": 60,
    "options": [
      "領悟",
      "味道",
      "承認",
      "深情難了"
    ],
    "clue": "李宗盛詞曲創作，辛曉琪痛徹心扉的真情演繹，「多麼痛的領悟」。"
  },
  {
    "id": "tw_grade6_33",
    "tag": "台灣六年級",
    "title": "如果雲知道",
    "artist": "許茹芸",
    "youtubeUrl": "https://www.youtube.com/watch?v=DOcb1-SD4Eo",
    "youtubeId": "DOcb1-SD4Eo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "如果雲知道",
      "淚海",
      "獨角戲",
      "日光機場"
    ],
    "clue": "芸式唱腔代表作，「如果雲知道，逃不開糾纏的牢」。"
  },
  {
    "id": "tw_grade6_34",
    "tag": "台灣六年級",
    "title": "新不了情",
    "artist": "萬芳",
    "youtubeUrl": "https://www.youtube.com/watch?v=Dw-R85AcN_w",
    "youtubeId": "Dw-R85AcN_w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "新不了情",
      "割愛",
      "猜心",
      "碧海情天"
    ],
    "clue": "爾冬陞同名電影主題曲，萬芳細膩悠揚的嗓音唱出深情愛意。"
  },
  {
    "id": "tw_grade6_35",
    "tag": "台灣六年級",
    "title": "Lemon Tree",
    "artist": "蘇慧倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=HfdEk5RbzrA",
    "youtubeId": "HfdEk5RbzrA",
    "startTime": 10,
    "duration": 60,
    "options": [
      "Lemon Tree",
      "鴨子",
      "傻瓜",
      "被動"
    ],
    "clue": "滾石唱片玉女歌手蘇慧倫翻唱自 Fool's Garden，俏皮輕快的夏日檸檬樹。"
  },
  {
    "id": "tw_grade6_36",
    "tag": "台灣六年級",
    "title": "傷心太平洋",
    "artist": "任賢齊",
    "youtubeUrl": "https://www.youtube.com/watch?v=nsHfeiGrFqo",
    "youtubeId": "nsHfeiGrFqo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "傷心太平洋",
      "心太軟",
      "對面的女孩看過來",
      "春天花會開"
    ],
    "clue": "電視劇《神鵰俠侶》片尾曲，「一波還未平息，一波又來侵襲」。"
  },
  {
    "id": "tw_grade6_37",
    "tag": "台灣六年級",
    "title": "大約在冬季",
    "artist": "齊秦",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZYkxIi8H13w",
    "youtubeId": "ZYkxIi8H13w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "大約在冬季",
      "狼",
      "外面的世界",
      "原來的我"
    ],
    "clue": "齊秦創作僅花15分鐘卻風靡華人世界近四十載的浪漫冬季戀歌。"
  },
  {
    "id": "tw_grade6_38",
    "tag": "台灣六年級",
    "title": "夢醒時分",
    "artist": "陳淑樺",
    "youtubeUrl": "https://www.youtube.com/watch?v=nku5zFMZAdU",
    "youtubeId": "nku5zFMZAdU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "夢醒時分",
      "問",
      "滾滾紅塵",
      "明明白白我的心"
    ],
    "clue": "李宗盛詞曲，台灣流行音樂史上第一張銷量突破百萬張的傳奇專輯主打歌。"
  },
  {
    "id": "tw_grade6_39",
    "tag": "台灣六年級",
    "title": "酒後的心聲",
    "artist": "江蕙",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y1H22SMnS5M",
    "youtubeId": "Y1H22SMnS5M",
    "startTime": 15,
    "duration": 60,
    "options": [
      "酒後的心聲",
      "家後",
      "落雨聲",
      "傷心酒店"
    ],
    "clue": "台語天后江蕙創下三百萬張驚人銷售紀錄的劃時代台語歌后名作。"
  },
  {
    "id": "tw_grade6_40",
    "tag": "台灣六年級",
    "title": "傷心酒店",
    "artist": "江蕙 / 施文彬",
    "youtubeUrl": "https://www.youtube.com/watch?v=Jl0CAEZn9II",
    "youtubeId": "Jl0CAEZn9II",
    "startTime": 15,
    "duration": 60,
    "options": [
      "傷心酒店",
      "家後",
      "酒後的心聲",
      "雲中月圓"
    ],
    "clue": "江蕙與施文彬合唱，全台卡拉OK點播榜多年不墜的經典對唱曲。"
  },
  {
    "id": "tw_grade7_1",
    "tag": "台灣七年級",
    "title": "晴天",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=DYptgVvkVLQ",
    "youtubeId": "DYptgVvkVLQ",
    "startTime": 28,
    "duration": 60,
    "options": [
      "晴天",
      "七里香",
      "不能說的秘密",
      "簡單愛"
    ],
    "clue": "「故事的小黃花，從出生那年就飄著」，收錄於《葉惠美》專輯。"
  },
  {
    "id": "tw_grade7_2",
    "tag": "台灣七年級",
    "title": "七里香",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=Bbp9ZaJD_eA",
    "youtubeId": "Bbp9ZaJD_eA",
    "startTime": 35,
    "duration": 60,
    "options": [
      "七里香",
      "晴天",
      "蒲公英的約定",
      "青花瓷"
    ],
    "clue": "「雨下整夜我的愛溢出就像雨水」，方文山填詞的經典夏季情歌。"
  },
  {
    "id": "tw_grade7_3",
    "tag": "台灣七年級",
    "title": "稻香",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=sHD_z90ZKV0",
    "youtubeId": "sHD_z90ZKV0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "稻香",
      "聽媽媽的話",
      "簡單愛",
      "陽光宅男"
    ],
    "clue": "「對這個世界如果你有太多的抱怨，跌倒了就不敢繼續往前走」。"
  },
  {
    "id": "tw_grade7_4",
    "tag": "台灣七年級",
    "title": "青花瓷",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=Z8Mqw0b9ADs",
    "youtubeId": "Z8Mqw0b9ADs",
    "startTime": 25,
    "duration": 60,
    "options": [
      "青花瓷",
      "千里之外",
      "東風破",
      "菊花台"
    ],
    "clue": "「天青色等煙雨，而我在等你」，中國風流行歌曲的巔峰極致之作。"
  },
  {
    "id": "tw_grade7_5",
    "tag": "台灣七年級",
    "title": "簡單愛",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y4xCVlyCvX4",
    "youtubeId": "Y4xCVlyCvX4",
    "startTime": 25,
    "duration": 60,
    "options": [
      "簡單愛",
      "開不了口",
      "安靜",
      "龍捲風"
    ],
    "clue": "「我想就這樣牽著你的手不放開，愛能不能夠永遠單純沒有悲哀」。"
  },
  {
    "id": "tw_grade7_6",
    "tag": "台灣七年級",
    "title": "倒帶",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=cB7DIIG0ykk",
    "youtubeId": "cB7DIIG0ykk",
    "startTime": 35,
    "duration": 60,
    "options": [
      "倒帶",
      "天空",
      "檸檬草的味道",
      "假裝"
    ],
    "clue": "周杰倫譜曲、方文山作詞，蔡依林最受歡迎的抒情搖滾情歌。"
  },
  {
    "id": "tw_grade7_7",
    "tag": "台灣七年級",
    "title": "看我72變",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=B94n5Lbj4aw",
    "youtubeId": "B94n5Lbj4aw",
    "startTime": 20,
    "duration": 60,
    "options": [
      "看我72變",
      "舞孃",
      "愛情36計",
      "野蠻遊戲"
    ],
    "clue": "「今天的新鮮，改變的季節，美麗極限愛漂亮沒有終點」，蔡依林轉型唱跳天后奠基作。"
  },
  {
    "id": "tw_grade7_8",
    "tag": "台灣七年級",
    "title": "日不落",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=1GA8z-Wliew",
    "youtubeId": "1GA8z-Wliew",
    "startTime": 20,
    "duration": 60,
    "options": [
      "日不落",
      "舞孃",
      "特務J",
      "馬德里不思議"
    ],
    "clue": "「天空的霧來得漫不經心，河水對岸的常春藤爬滿了廊柱」，輕快甜蜜的國民舞曲。"
  },
  {
    "id": "tw_grade7_9",
    "tag": "台灣七年級",
    "title": "Super Star",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=gr5fNKK2FaA",
    "youtubeId": "gr5fNKK2FaA",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Super Star",
      "波斯貓",
      "戀人未滿",
      "美麗新世界"
    ],
    "clue": "女子天團 S.H.E 搖滾轉型經典，「你是電，你是光，你是唯一的神話」。"
  },
  {
    "id": "tw_grade7_10",
    "tag": "台灣七年級",
    "title": "戀人未滿",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=jL6D7rqk4SQ",
    "youtubeId": "jL6D7rqk4SQ",
    "startTime": 25,
    "duration": 60,
    "options": [
      "戀人未滿",
      "熱帶雨林",
      "美麗新世界",
      "Super Star"
    ],
    "clue": "S.H.E 出道第一首成名代表作：「再靠近一點點，就讓你牽手，再勇敢一點點，我就跟你走」。"
  },
  {
    "id": "tw_grade7_11",
    "tag": "台灣七年級",
    "title": "我難過",
    "artist": "5566",
    "youtubeUrl": "https://www.youtube.com/watch?v=2l4X4lGP_Zk",
    "youtubeId": "2l4X4lGP_Zk",
    "startTime": 35,
    "duration": 60,
    "options": [
      "我難過",
      "無所謂",
      "挑撥",
      "守候"
    ],
    "clue": "偶像劇《MVP情人》片尾曲，被網友封為台灣七年級「神曲」：「我難過的是，放棄你放棄愛」。"
  },
  {
    "id": "tw_grade7_12",
    "tag": "台灣七年級",
    "title": "志明與春嬌",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=5VUUGZ1-nlY",
    "youtubeId": "5VUUGZ1-nlY",
    "startTime": 30,
    "duration": 60,
    "options": [
      "志明與春嬌",
      "軋車",
      "憨人",
      "溫柔"
    ],
    "clue": "「我跟你最好就到這，你對我已經沒感覺」，五月天首張創作專輯掀起全台風潮。"
  },
  {
    "id": "tw_grade7_13",
    "tag": "台灣七年級",
    "title": "溫柔",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=nWb_X3ZJQjw",
    "youtubeId": "nWb_X3ZJQjw",
    "startTime": 35,
    "duration": 60,
    "options": [
      "溫柔",
      "擁抱",
      "知足",
      "純真"
    ],
    "clue": "「不知不覺不情不願又到巷子口」，阿信經典口白：「這是我能給你的，最後的溫柔」。"
  },
  {
    "id": "tw_grade7_14",
    "tag": "台灣七年級",
    "title": "天黑黑",
    "artist": "孫燕姿",
    "youtubeUrl": "https://www.youtube.com/watch?v=zi8z6RPYGV0",
    "youtubeId": "zi8z6RPYGV0",
    "startTime": 20,
    "duration": 60,
    "options": [
      "天黑黑",
      "我要的幸福",
      "綠光",
      "風箏"
    ],
    "clue": "取樣閩南童謠「天黑黑，要落雨」，孫燕姿出道一鳴驚人奪下金曲最佳新人。"
  },
  {
    "id": "tw_grade7_15",
    "tag": "台灣七年級",
    "title": "綠光",
    "artist": "孫燕姿",
    "youtubeUrl": "https://www.youtube.com/watch?v=pztQtHvZkRc",
    "youtubeId": "pztQtHvZkRc",
    "startTime": 25,
    "duration": 60,
    "options": [
      "綠光",
      "天黑黑",
      "開始懂了",
      "神奇"
    ],
    "clue": "愛爾蘭踢踏舞節奏與輕快饒舌：「期待著一個幸運，和一個衝擊，多麼奇妙的際遇」。"
  },
  {
    "id": "tw_grade7_16",
    "tag": "台灣七年級",
    "title": "勇氣",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=nDchQNPuA0k",
    "youtubeId": "nDchQNPuA0k",
    "startTime": 35,
    "duration": 60,
    "options": [
      "勇氣",
      "寧夏",
      "暖暖",
      "會呼吸的痛"
    ],
    "clue": "光良作曲，梁靜茹經典之作：「愛真的需要勇氣，來面對流言蜚語」。"
  },
  {
    "id": "tw_grade7_17",
    "tag": "台灣七年級",
    "title": "寧夏",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=MmtVl9CssYE",
    "youtubeId": "MmtVl9CssYE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "寧夏",
      "暖暖",
      "小手拉大手",
      "燕尾蝶"
    ],
    "clue": "「寧靜的夏天，天空中繁星點點」，李正帆詞曲、夏日小清新純樸代表。"
  },
  {
    "id": "tw_grade7_18",
    "tag": "台灣七年級",
    "title": "愛你",
    "artist": "王心凌",
    "youtubeUrl": "https://www.youtube.com/watch?v=NAODcPQcy9U",
    "youtubeId": "NAODcPQcy9U",
    "startTime": 25,
    "duration": 60,
    "options": [
      "愛你",
      "睫毛彎彎",
      "第一次愛的人",
      "Honey"
    ],
    "clue": "甜蜜教主王心凌制服熱舞招牌歌：「Oh baby 情話多說一點，想我就多看一眼」。"
  },
  {
    "id": "tw_grade7_19",
    "tag": "台灣七年級",
    "title": "曖昧",
    "artist": "楊丞琳",
    "youtubeUrl": "https://www.youtube.com/watch?v=mebzXfWi87E",
    "youtubeId": "mebzXfWi87E",
    "startTime": 30,
    "duration": 60,
    "options": [
      "曖昧",
      "帶我走",
      "雨愛",
      "過敏"
    ],
    "clue": "偶像劇《惡魔在身邊》片尾曲，「曖昧讓人受盡委屈，找不到相愛的證據」。"
  },
  {
    "id": "tw_grade7_20",
    "tag": "台灣七年級",
    "title": "Lydia",
    "artist": "F.I.R. 飛兒樂團",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZOHsd6Zk7DM",
    "youtubeId": "ZOHsd6Zk7DM",
    "startTime": 30,
    "duration": 60,
    "options": [
      "Lydia",
      "我們的愛",
      "Fly Away",
      "千年之戀"
    ],
    "clue": "電視劇《鬥魚》片尾曲，古典弦樂交織狂野搖滾，主唱 Faye 唱腔極具穿透力。"
  },
  {
    "id": "tw_grade7_21",
    "tag": "台灣七年級",
    "title": "安靜",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=1hI-7vj2FhE",
    "youtubeId": "1hI-7vj2FhE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "安靜",
      "晴天",
      "簡單愛",
      "黑色幽默"
    ],
    "clue": "周杰倫《范特西》專輯自作詞曲名作，「希望他是真的比我還要愛你」。"
  },
  {
    "id": "tw_grade7_22",
    "tag": "台灣七年級",
    "title": "開不了口",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=H7hpK6cm-6k",
    "youtubeId": "H7hpK6cm-6k",
    "startTime": 15,
    "duration": 60,
    "options": [
      "開不了口",
      "簡單愛",
      "安靜",
      "半島鐵盒"
    ],
    "clue": "「就是開不了口讓她知道，我一定會呵護著你」，抒情R&B巔峰之作。"
  },
  {
    "id": "tw_grade7_23",
    "tag": "台灣七年級",
    "title": "說愛你",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=_Y_mlCbfn_Y",
    "youtubeId": "_Y_mlCbfn_Y",
    "startTime": 15,
    "duration": 60,
    "options": [
      "說愛你",
      "看我72變",
      "倒帶",
      "日不落"
    ],
    "clue": "蔡依林轉型代表作，周杰倫作曲，「我的改變因為你，說愛你」。"
  },
  {
    "id": "tw_grade7_24",
    "tag": "台灣七年級",
    "title": "舞孃",
    "artist": "蔡依林",
    "youtubeUrl": "https://www.youtube.com/watch?v=0EN3MnGEBXk",
    "youtubeId": "0EN3MnGEBXk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "舞孃",
      "看我72變",
      "日不落",
      "Play我呸"
    ],
    "clue": "蔡依林榮獲金曲歌后的動感力作，「旋轉 跳躍 我閉著眼」。"
  },
  {
    "id": "tw_grade7_25",
    "tag": "台灣七年級",
    "title": "波斯貓",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=wpq30k3cYFY",
    "youtubeId": "wpq30k3cYFY",
    "startTime": 10,
    "duration": 60,
    "options": [
      "波斯貓",
      "Super Star",
      "戀人未滿",
      "美麗新世界"
    ],
    "clue": "融入古典名曲《波斯市場》旋律，S.H.E俏皮活潑的異國風名曲。"
  },
  {
    "id": "tw_grade7_26",
    "tag": "台灣七年級",
    "title": "美麗新世界",
    "artist": "S.H.E",
    "youtubeUrl": "https://www.youtube.com/watch?v=QDiSck_imgw",
    "youtubeId": "QDiSck_imgw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "美麗新世界",
      "Super Star",
      "戀人未滿",
      "熱帶雨林"
    ],
    "clue": "電子舞曲風格，S.H.E唱出對青春未來無限憧憬的美好新世界。"
  },
  {
    "id": "tw_grade7_27",
    "tag": "台灣七年級",
    "title": "憨人",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=1j_mpwKmlJg",
    "youtubeId": "1j_mpwKmlJg",
    "startTime": 20,
    "duration": 60,
    "options": [
      "憨人",
      "志明與春嬌",
      "溫柔",
      "終結孤單"
    ],
    "clue": "五月天台語搖滾精神象徵，「我有我的路，我有我的夢」。"
  },
  {
    "id": "tw_grade7_28",
    "tag": "台灣七年級",
    "title": "知足",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=_o0oeyCtoFA",
    "youtubeId": "_o0oeyCtoFA",
    "startTime": 20,
    "duration": 60,
    "options": [
      "知足",
      "溫柔",
      "擁抱",
      "倔強"
    ],
    "clue": "五月天最溫柔真摯的抒情代表作，「怎麼去擁有 一道彩虹」。"
  },
  {
    "id": "tw_grade7_29",
    "tag": "台灣七年級",
    "title": "倔強",
    "artist": "五月天",
    "youtubeUrl": "https://www.youtube.com/watch?v=R2s-H_crYkc",
    "youtubeId": "R2s-H_crYkc",
    "startTime": 20,
    "duration": 60,
    "options": [
      "倔強",
      "知足",
      "派對動物",
      "離開地球表面"
    ],
    "clue": "「我和我最後的倔強，握緊雙手絕對不放」，鼓勵無數年輕人的青春神曲。"
  },
  {
    "id": "tw_grade7_30",
    "tag": "台灣七年級",
    "title": "遇見",
    "artist": "孫燕姿",
    "youtubeUrl": "https://www.youtube.com/watch?v=WObbdwgB41c",
    "youtubeId": "WObbdwgB41c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "遇見",
      "天黑黑",
      "綠光",
      "開始懂了"
    ],
    "clue": "幾米繪本改編電影《向左走·向右走》主題曲，孫燕姿傳唱度極高的經典。"
  },
  {
    "id": "tw_grade7_31",
    "tag": "台灣七年級",
    "title": "暖暖",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=0ffLURMclcM",
    "youtubeId": "0ffLURMclcM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "暖暖",
      "勇氣",
      "寧夏",
      "可惜不是你"
    ],
    "clue": "情歌天后梁靜茹溫暖甜蜜名曲，「我想說其實你很好，你自己卻不知道」。"
  },
  {
    "id": "tw_grade7_32",
    "tag": "台灣七年級",
    "title": "崇拜",
    "artist": "梁靜茹",
    "youtubeUrl": "https://www.youtube.com/watch?v=KKRqKsjqySI",
    "youtubeId": "KKRqKsjqySI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "崇拜",
      "可惜不是你",
      "情歌",
      "會呼吸的痛"
    ],
    "clue": "「我存在在你的存在」，梁靜茹極富感染力與空靈感的金曲代表作。"
  },
  {
    "id": "tw_grade7_33",
    "tag": "台灣七年級",
    "title": "睫毛彎彎",
    "artist": "王心凌",
    "youtubeUrl": "https://www.youtube.com/watch?v=FzKO6WZN5b4",
    "youtubeId": "FzKO6WZN5b4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "睫毛彎彎",
      "愛你",
      "第一次愛的人",
      "當你"
    ],
    "clue": "甜蜜教主王心凌結合東方笛聲與舞曲節奏的超洗腦名曲。"
  },
  {
    "id": "tw_grade7_34",
    "tag": "台灣七年級",
    "title": "雨愛",
    "artist": "楊丞琳",
    "youtubeUrl": "https://www.youtube.com/watch?v=oec9R5ypf-o",
    "youtubeId": "oec9R5ypf-o",
    "startTime": 20,
    "duration": 60,
    "options": [
      "雨愛",
      "曖昧",
      "理想情人",
      "帶我走"
    ],
    "clue": "偶像劇《海派甜心》片尾曲，「雨愛的秘密，能一直延續」。"
  },
  {
    "id": "tw_grade7_35",
    "tag": "台灣七年級",
    "title": "我們的愛",
    "artist": "飛兒樂團 F.I.R.",
    "youtubeUrl": "https://www.youtube.com/watch?v=88D2-J_pk7A",
    "youtubeId": "88D2-J_pk7A",
    "startTime": 20,
    "duration": 60,
    "options": [
      "我們的愛",
      "Lydia",
      "千年之戀",
      "月牙灣"
    ],
    "clue": "F.I.R.同名出道專輯超強抒情名作，「我們的愛，過了就不再回來」。"
  },
  {
    "id": "tw_grade7_36",
    "tag": "台灣七年級",
    "title": "愛的主打歌",
    "artist": "蕭亞軒",
    "youtubeUrl": "https://www.youtube.com/watch?v=EHMm_ElRvMA",
    "youtubeId": "EHMm_ElRvMA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愛的主打歌",
      "最熟悉的陌生人",
      "Cappuccino",
      "表白"
    ],
    "clue": "亞洲舞曲天后蕭亞軒唱跳代表作，「我在唱什麼，什麼都覺得，你在看著我」。"
  },
  {
    "id": "tw_grade7_37",
    "tag": "台灣七年級",
    "title": "精舞門",
    "artist": "羅志祥",
    "youtubeUrl": "https://www.youtube.com/watch?v=3WAgjt-cDQg",
    "youtubeId": "3WAgjt-cDQg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "精舞門",
      "愛轉角",
      "鬧翻天",
      "愛投羅網"
    ],
    "clue": "亞洲舞王羅志祥經典椅子舞代表作，「I wanna know 你行不行」。"
  },
  {
    "id": "tw_grade7_38",
    "tag": "台灣七年級",
    "title": "放手",
    "artist": "Energy",
    "youtubeUrl": "https://www.youtube.com/watch?v=v-9IGzCMNks",
    "youtubeId": "v-9IGzCMNks",
    "startTime": 15,
    "duration": 60,
    "options": [
      "放手",
      "多愛我一天",
      "Come On",
      "某年某月某一天"
    ],
    "clue": "台灣最殺唱跳男團 Energy 超經典成名作，「都跟我無關，全部都放手」。"
  },
  {
    "id": "tw_grade7_39",
    "tag": "台灣七年級",
    "title": "麻吉",
    "artist": "麻吉 MACHI",
    "youtubeUrl": "https://www.youtube.com/watch?v=mCtF2pQSZuQ",
    "youtubeId": "mCtF2pQSZuQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "麻吉",
      "Jump 2003",
      "爽",
      "甜蜜蜜"
    ],
    "clue": "黃立成帶領的 MACHI 嘻哈饒舌名曲，「我們是麻吉，你是我的兄弟」。"
  },
  {
    "id": "tw_grade7_40",
    "tag": "台灣七年級",
    "title": "童話",
    "artist": "光良",
    "youtubeUrl": "https://www.youtube.com/watch?v=bBcp_ljCBGU",
    "youtubeId": "bBcp_ljCBGU",
    "startTime": 20,
    "duration": 60,
    "options": [
      "童話",
      "第一次",
      "約定",
      "勇氣"
    ],
    "clue": "光良紅遍全球華人圈的鋼琴抒情神曲，「我願變成童話裡，你愛的那個天使」。"
  },
  {
    "id": "tw_grade8_1",
    "tag": "台灣八年級",
    "title": "如果可以",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=8MG--WuNW1Y",
    "youtubeId": "8MG--WuNW1Y",
    "startTime": 35,
    "duration": 60,
    "options": [
      "如果可以",
      "還是會",
      "女孩",
      "那些年"
    ],
    "clue": "奇幻愛情電影《月老》主題曲：「如果可以我想和你回到那天相遇」。"
  },
  {
    "id": "tw_grade8_2",
    "tag": "台灣八年級",
    "title": "那些年",
    "artist": "胡夏",
    "youtubeUrl": "https://www.youtube.com/watch?v=KqjgLbKZ1h0",
    "youtubeId": "KqjgLbKZ1h0",
    "startTime": 35,
    "duration": 60,
    "options": [
      "那些年",
      "小幸運",
      "刻在我心底的名字",
      "修煉愛情"
    ],
    "clue": "九把刀青春愛情電影《那些年，我們一起追的女孩》同名主題曲。"
  },
  {
    "id": "tw_grade8_3",
    "tag": "台灣八年級",
    "title": "小幸運",
    "artist": "田馥甄",
    "youtubeUrl": "https://www.youtube.com/watch?v=HDMQuMJ4MSk",
    "youtubeId": "HDMQuMJ4MSk",
    "startTime": 40,
    "duration": 60,
    "options": [
      "小幸運",
      "那些年",
      "愛情怎麼了",
      "刻在我心底的名字"
    ],
    "clue": "校園愛情電影《我的少女時代》主題曲：「與你相遇好幸運」。"
  },
  {
    "id": "tw_grade8_4",
    "tag": "台灣八年級",
    "title": "刻在我心底的名字",
    "artist": "盧廣仲",
    "youtubeUrl": "https://www.youtube.com/watch?v=m78lJuzftcc",
    "youtubeId": "m78lJuzftcc",
    "startTime": 35,
    "duration": 60,
    "options": [
      "刻在我心底的名字",
      "魚仔",
      "幾分之幾",
      "那些年"
    ],
    "clue": "電影《刻在你心底的名字》主題曲，榮獲第57屆金馬獎最佳原創電影歌曲。"
  },
  {
    "id": "tw_grade8_5",
    "tag": "台灣八年級",
    "title": "光年之外",
    "artist": "鄧紫棋",
    "youtubeUrl": "https://www.youtube.com/watch?v=T4SimnaiktU",
    "youtubeId": "T4SimnaiktU",
    "startTime": 30,
    "duration": 60,
    "options": [
      "光年之外",
      "泡沫",
      "倒數",
      "再見"
    ],
    "clue": "電影《太空潛航者》中文主題曲，YouTube破2.7億觀看人次的史詩情歌。"
  },
  {
    "id": "tw_grade8_6",
    "tag": "台灣八年級",
    "title": "以後別做朋友",
    "artist": "周興哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=Ew4VvF0DPMc",
    "youtubeId": "Ew4VvF0DPMc",
    "startTime": 35,
    "duration": 60,
    "options": [
      "以後別做朋友",
      "怎麼了",
      "你，好不好？",
      "如果雨之後"
    ],
    "clue": "電視劇《16個夏天》片尾曲，「以後別做朋友，朋友不能牽手」，情歌王子成名曲。"
  },
  {
    "id": "tw_grade8_7",
    "tag": "台灣八年級",
    "title": "怎麼了",
    "artist": "周興哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y2ge3KrdeWs",
    "youtubeId": "Y2ge3KrdeWs",
    "startTime": 35,
    "duration": 60,
    "options": [
      "怎麼了",
      "以後別做朋友",
      "如果雨之後",
      "如果可以"
    ],
    "clue": "「你說藍色是你最愛的顏色，你說如果沒有愛整個人生都黑了」，傳唱全網。"
  },
  {
    "id": "tw_grade8_8",
    "tag": "台灣八年級",
    "title": "披星戴月的想你",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=VpwAq7hiij0",
    "youtubeId": "VpwAq7hiij0",
    "startTime": 30,
    "duration": 60,
    "options": [
      "披星戴月的想你",
      "愛人錯過",
      "在這座城市遺失了你",
      "好不容易"
    ],
    "clue": "「我會披星戴月的想你，我會奮不顧身地前進」，新世代樂團告五人成名作。"
  },
  {
    "id": "tw_grade8_9",
    "tag": "台灣八年級",
    "title": "愛人錯過",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=6D79CYTxvOM",
    "youtubeId": "6D79CYTxvOM",
    "startTime": 30,
    "duration": 60,
    "options": [
      "愛人錯過",
      "披星戴月的想你",
      "帶我去找夜生活",
      "紅"
    ],
    "clue": "「你瞧你，撞到我，也不道歉」，洗腦旋律在各社群短影音掀起翻唱熱潮。"
  },
  {
    "id": "tw_grade8_10",
    "tag": "台灣八年級",
    "title": "浪子回頭",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=x3bDhtuC5yk",
    "youtubeId": "x3bDhtuC5yk",
    "startTime": 30,
    "duration": 60,
    "options": [
      "浪子回頭",
      "浪流連",
      "愛情你比我想的閣較偉大",
      "日常"
    ],
    "clue": "「菸一支一支一支地點，酒一杯一杯一杯地乾」，新台語獨立搖滾現象級神曲。"
  },
  {
    "id": "tw_grade8_11",
    "tag": "台灣八年級",
    "title": "愛情你比我想的閣較偉大",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=0rp3pP2Xwhs",
    "youtubeId": "0rp3pP2Xwhs",
    "startTime": 20,
    "duration": 60,
    "options": [
      "愛情你比我想的閣較偉大",
      "浪子回頭",
      "浪流連",
      "這款自作多情"
    ],
    "clue": "電影《當男人戀愛時》主題曲，「愛你愛甲白目眉」，節奏熱血直白。"
  },
  {
    "id": "tw_grade8_12",
    "tag": "台灣八年級",
    "title": "Without You",
    "artist": "高爾宣 OSN",
    "youtubeUrl": "https://www.youtube.com/watch?v=HQDDlgGy2hg",
    "youtubeId": "HQDDlgGy2hg",
    "startTime": 25,
    "duration": 60,
    "options": [
      "Without You",
      "So Boy",
      "Old Me",
      "Why You Gonna Lie"
    ],
    "clue": "嘻哈饒舌新生代高爾宣爆紅之作：「I can't live without you, baby」。"
  },
  {
    "id": "tw_grade8_13",
    "tag": "台灣八年級",
    "title": "幹大事",
    "artist": "頑童MJ116",
    "youtubeUrl": "https://www.youtube.com/watch?v=COS0pHrCi0k",
    "youtubeId": "COS0pHrCi0k",
    "startTime": 20,
    "duration": 60,
    "options": [
      "幹大事",
      "辣台妹",
      "走跳",
      "少年董"
    ],
    "clue": "「我們這是頑童你知道的，幹大事我幹大的」，華語嘻哈天團震撼現場的派對國歌。"
  },
  {
    "id": "tw_grade8_14",
    "tag": "台灣八年級",
    "title": "癡情的男子漢",
    "artist": "玖壹壹",
    "youtubeUrl": "https://www.youtube.com/watch?v=UdnSKw0wI8I",
    "youtubeId": "UdnSKw0wI8I",
    "startTime": 20,
    "duration": 60,
    "options": [
      "癡情的男子漢",
      "打鐵",
      "9453",
      "下輩子"
    ],
    "clue": "本土天團玖壹壹接地氣洗腦歌：「我是愛你愛你愛到不怕死，代誌要按怎處理」。"
  },
  {
    "id": "tw_grade8_15",
    "tag": "台灣八年級",
    "title": "想見你想見你想見你",
    "artist": "八三夭 831",
    "youtubeUrl": "https://www.youtube.com/watch?v=4iRupuNet3Q",
    "youtubeId": "4iRupuNet3Q",
    "startTime": 35,
    "duration": 60,
    "options": [
      "想見你想見你想見你",
      "最後的8/31",
      "東區東區",
      "致青春"
    ],
    "clue": "奇幻穿越愛情神劇《想見你》片尾曲，「想見你，只想見你，未來過去，我只想見你」。"
  },
  {
    "id": "tw_grade8_16",
    "tag": "台灣八年級",
    "title": "行星",
    "artist": "理想混蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=Zn8M6mcGNoo",
    "youtubeId": "Zn8M6mcGNoo",
    "startTime": 25,
    "duration": 60,
    "options": [
      "行星",
      "不是因為天氣晴朗才愛你",
      "愚者",
      "滯留鋒"
    ],
    "clue": "新銳獨立民謠樂團療癒之作：「沒關係，我就這樣遠遠看著你，在軌道裡默默守護你」。"
  },
  {
    "id": "tw_grade8_17",
    "tag": "台灣八年級",
    "title": "告白氣球",
    "artist": "周杰倫",
    "youtubeUrl": "https://www.youtube.com/watch?v=bu7nU9Mhpyo",
    "youtubeId": "bu7nU9Mhpyo",
    "startTime": 20,
    "duration": 60,
    "options": [
      "告白氣球",
      "等你下課",
      "說好不哭",
      "簡單愛"
    ],
    "clue": "「塞納河畔左岸的咖啡，我手一杯品嚐你的美」，甜蜜輕快代表作。"
  },
  {
    "id": "tw_grade8_18",
    "tag": "台灣八年級",
    "title": "少年",
    "artist": "夢然",
    "youtubeUrl": "https://www.youtube.com/watch?v=efKva-XmV48",
    "youtubeId": "efKva-XmV48",
    "startTime": 25,
    "duration": 60,
    "options": [
      "少年",
      "飛鳥和蟬",
      "白月光與硃砂痣",
      "踏山河"
    ],
    "clue": "熱門正能量神曲：「我還是從前那個少年，沒有一點點改變」。"
  },
  {
    "id": "tw_grade8_19",
    "tag": "台灣八年級",
    "title": "飛鳥和蟬",
    "artist": "任然",
    "youtubeUrl": "https://www.youtube.com/watch?v=Sdh16YlinNE",
    "youtubeId": "Sdh16YlinNE",
    "startTime": 30,
    "duration": 60,
    "options": [
      "飛鳥和蟬",
      "空空如也",
      "涼城",
      "疑心病"
    ],
    "clue": "「你飛到哪片天，去尋找下一處歇腳的樹枝」，風靡網路的抒情曲。"
  },
  {
    "id": "tw_grade8_20",
    "tag": "台灣八年級",
    "title": "是什麼讓我遇見這樣的你",
    "artist": "白安",
    "youtubeUrl": "https://www.youtube.com/watch?v=aVmZpcrQBU4",
    "youtubeId": "aVmZpcrQBU4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "是什麼讓我遇見這樣的你",
      "麥田捕手",
      "我只想在乎我在乎的",
      "安慰"
    ],
    "clue": "白安獨特咬字與清新唱腔：「是什麼讓我遇見這樣的你，是什麼讓我不再懷疑自己」。"
  },
  {
    "id": "tw_grade8_21",
    "tag": "台灣八年級",
    "title": "還是會",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=eGNqW9sybyU",
    "youtubeId": "eGNqW9sybyU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "還是會",
      "如果可以",
      "女孩",
      "因為愛"
    ],
    "clue": "偶像劇《我可能不會愛你》插曲，韋禮安陽光清新的抒情代表。"
  },
  {
    "id": "tw_grade8_22",
    "tag": "台灣八年級",
    "title": "女孩",
    "artist": "韋禮安",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZPALMaXLfIw",
    "youtubeId": "ZPALMaXLfIw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "女孩",
      "如果可以",
      "還是會",
      "慢慢等"
    ],
    "clue": "韋禮安輕快洗腦的浪漫放閃神曲，「女孩，我的故事因為你而展開」。"
  },
  {
    "id": "tw_grade8_23",
    "tag": "台灣八年級",
    "title": "魚仔",
    "artist": "盧廣仲",
    "youtubeUrl": "https://www.youtube.com/watch?v=ybfWYpYhTQQ",
    "youtubeId": "ybfWYpYhTQQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魚仔",
      "刻在我心底的名字",
      "幾分之幾",
      "早安晨之美"
    ],
    "clue": "電視劇《花甲男孩轉大人》主題曲，榮獲金曲獎年度歌曲與最佳作曲人獎。"
  },
  {
    "id": "tw_grade8_24",
    "tag": "台灣八年級",
    "title": "魔鬼中的天使",
    "artist": "田馥甄",
    "youtubeUrl": "https://www.youtube.com/watch?v=na_xv5iFt2Y",
    "youtubeId": "na_xv5iFt2Y",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魔鬼中的天使",
      "小幸運",
      "寂寞寂寞就好",
      "你就不要想起我"
    ],
    "clue": "田馥甄冷豔空靈嗓音演繹愛情的糾葛與矛盾。"
  },
  {
    "id": "tw_grade8_25",
    "tag": "台灣八年級",
    "title": "不醉不會",
    "artist": "田馥甄",
    "youtubeUrl": "https://www.youtube.com/watch?v=7gQxgKaiPzk",
    "youtubeId": "7gQxgKaiPzk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "不醉不會",
      "小幸運",
      "愛著愛著就永遠",
      "日常"
    ],
    "clue": "陳珊妮詞曲創作，微醺迷幻風格的流行金曲。"
  },
  {
    "id": "tw_grade8_26",
    "tag": "台灣八年級",
    "title": "泡沫",
    "artist": "鄧紫棋",
    "youtubeUrl": "https://www.youtube.com/watch?v=CQEXldyfGGM",
    "youtubeId": "CQEXldyfGGM",
    "startTime": 20,
    "duration": 60,
    "options": [
      "泡沫",
      "光年之外",
      "來自天堂的魔鬼",
      "句號"
    ],
    "clue": "鄧紫棋於《我是歌手》震撼全場的成名抒情史詩名作。"
  },
  {
    "id": "tw_grade8_27",
    "tag": "台灣八年級",
    "title": "你，好不好？",
    "artist": "周興哲",
    "youtubeUrl": "https://www.youtube.com/watch?v=wSBXfzgqHtE",
    "youtubeId": "wSBXfzgqHtE",
    "startTime": 20,
    "duration": 60,
    "options": [
      "你，好不好？",
      "以後別做朋友",
      "怎麼了",
      "如果雨之後"
    ],
    "clue": "周興哲破億觀看次數的經典抒情情歌，「能不能繼續，對我哭對我笑對我好」。"
  },
  {
    "id": "tw_grade8_28",
    "tag": "台灣八年級",
    "title": "在這座城市遺失了你",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=fiDZGZMN9wE",
    "youtubeId": "fiDZGZMN9wE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "在這座城市遺失了你",
      "披星戴月的想你",
      "愛人錯過",
      "好不容易"
    ],
    "clue": "告五人收錄於《運氣來得若有似無》，痛徹心扉的失戀城市謳歌。"
  },
  {
    "id": "tw_grade8_29",
    "tag": "台灣八年級",
    "title": "日常與浪漫",
    "artist": "茄子蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=_vGN_dFtAQI",
    "youtubeId": "_vGN_dFtAQI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "日常與浪漫",
      "浪子回頭",
      "浪流連",
      "這款自作多情"
    ],
    "clue": "茄子蛋樂團以濃郁台味搖滾唱出小人物的浪漫。"
  },
  {
    "id": "tw_grade8_30",
    "tag": "台灣八年級",
    "title": "So Bad",
    "artist": "高爾宣",
    "youtubeUrl": "https://www.youtube.com/watch?v=kTNNPbVFNHQ",
    "youtubeId": "kTNNPbVFNHQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "So Bad",
      "Without You",
      "最後一次",
      "Benz Booty"
    ],
    "clue": "高爾宣 OSN 抓耳旋律與真摯說唱交織的千禧嘻哈佳作。"
  },
  {
    "id": "tw_grade8_31",
    "tag": "台灣八年級",
    "title": "辣台妹",
    "artist": "頑童MJ116",
    "youtubeUrl": "https://www.youtube.com/watch?v=zJx6v_APhWA",
    "youtubeId": "zJx6v_APhWA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "辣台妹",
      "幹大事",
      "少年董",
      "走跳"
    ],
    "clue": "頑童MJ116風靡全台各大夜店與派對的熱門嘻哈代表作。"
  },
  {
    "id": "tw_grade8_32",
    "tag": "台灣八年級",
    "title": "下輩子",
    "artist": "玖壹壹",
    "youtubeUrl": "https://www.youtube.com/watch?v=f2u9F-IT9wY",
    "youtubeId": "f2u9F-IT9wY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "下輩子",
      "癡情的男子漢",
      "打鐵",
      "9453"
    ],
    "clue": "台客電音嘻哈天團玖壹壹深情真摯的台語抒情神曲。"
  },
  {
    "id": "tw_grade8_33",
    "tag": "台灣八年級",
    "title": "東區東區",
    "artist": "八三夭",
    "youtubeUrl": "https://www.youtube.com/watch?v=qVKLNfbpCZ0",
    "youtubeId": "qVKLNfbpCZ0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "東區東區",
      "想見你想見你想見你",
      "最後的831",
      "致青春"
    ],
    "clue": "八三夭熱血狂歡的搖滾舞曲，台北東區派對標誌性神曲。"
  },
  {
    "id": "tw_grade8_34",
    "tag": "台灣八年級",
    "title": "島嶼天光",
    "artist": "滅火器",
    "youtubeUrl": "https://www.youtube.com/watch?v=iV8JDbtXZm4",
    "youtubeId": "iV8JDbtXZm4",
    "startTime": 20,
    "duration": 60,
    "options": [
      "島嶼天光",
      "長途夜車",
      "海上的人",
      "晚安台灣"
    ],
    "clue": "滅火器樂團榮獲第26屆金曲獎最佳年度歌曲的時代之歌。"
  },
  {
    "id": "tw_grade8_35",
    "tag": "台灣八年級",
    "title": "指望",
    "artist": "郁可唯",
    "youtubeUrl": "https://www.youtube.com/watch?v=04VXfavbeDs",
    "youtubeId": "04VXfavbeDs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "指望",
      "時間煮雨",
      "路過人間",
      "遠方"
    ],
    "clue": "偶像劇《犀利人妻》插曲，「怕後悔的那麼倔強，怕面對的那麼絕望」。"
  },
  {
    "id": "tw_grade8_36",
    "tag": "台灣八年級",
    "title": "燃點",
    "artist": "胡夏",
    "youtubeUrl": "https://www.youtube.com/watch?v=aNFCc2Y3g_A",
    "youtubeId": "aNFCc2Y3g_A",
    "startTime": 15,
    "duration": 60,
    "options": [
      "燃點",
      "那些年",
      "愛夏",
      "知否知否"
    ],
    "clue": "胡夏清澈深情的嗓音，「點燃你給我的所有溫暖」。"
  },
  {
    "id": "tw_grade8_37",
    "tag": "台灣八年級",
    "title": "我有我自己",
    "artist": "閻奕格",
    "youtubeUrl": "https://www.youtube.com/watch?v=TZLzLR2PwP4",
    "youtubeId": "TZLzLR2PwP4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我有我自己",
      "也可以",
      "愛上現在的我",
      "讓一切重來"
    ],
    "clue": "閻奕格沉潛多年後重新出發的堅定自我宣言。"
  },
  {
    "id": "tw_grade8_38",
    "tag": "台灣八年級",
    "title": "Forever Young",
    "artist": "艾怡良",
    "youtubeUrl": "https://www.youtube.com/watch?v=rFj6azCUYrU",
    "youtubeId": "rFj6azCUYrU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Forever Young",
      "寂寞無害",
      "玻璃心",
      "我不知道愛是什麼"
    ],
    "clue": "艾怡良作詞作曲，榮獲金曲獎最佳作曲人獎的深情之作。"
  },
  {
    "id": "tw_grade8_39",
    "tag": "台灣八年級",
    "title": "孤獨的總和",
    "artist": "吳汶芳",
    "youtubeUrl": "https://www.youtube.com/watch?v=90xQdZ4WmLA",
    "youtubeId": "90xQdZ4WmLA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "孤獨的總和",
      "不讀不回",
      "心之所向",
      "我何必"
    ],
    "clue": "吳汶芳自彈自唱成名曲，「如果我不曾走過這一遍，生命中還有多少苦和甜」。"
  },
  {
    "id": "tw_grade8_40",
    "tag": "台灣八年級",
    "title": "藍色的你",
    "artist": "宇宙人",
    "youtubeUrl": "https://www.youtube.com/watch?v=nL_VoX0ZR0E",
    "youtubeId": "nL_VoX0ZR0E",
    "startTime": 15,
    "duration": 60,
    "options": [
      "藍色的你",
      "如果我們還在一起",
      "那你呢",
      "一起去跑步"
    ],
    "clue": "宇宙人樂團療癒系海洋風金曲，榮獲金曲獎最佳樂團獎之作。"
  },
  {
    "id": "tw_grade9_1",
    "tag": "台灣九年級",
    "title": "不是因為天氣晴朗才愛你",
    "artist": "理想混蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=9_068Ekk_fs",
    "youtubeId": "9_068Ekk_fs",
    "startTime": 10,
    "duration": 60,
    "options": [
      "不是因為天氣晴朗才愛你",
      "行星",
      "愚者",
      "離開的一路上"
    ],
    "clue": "理想混蛋主唱雞丁創作，全台高中大學吉他社必練、社群破億翻唱的校園純愛神曲。"
  },
  {
    "id": "tw_grade9_2",
    "tag": "台灣九年級",
    "title": "帶我去找夜生活",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=W9Fq1HC_5hg",
    "youtubeId": "W9Fq1HC_5hg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "帶我去找夜生活",
      "愛人錯過",
      "披星戴月的想你",
      "唯一"
    ],
    "clue": "告五人迷幻浪漫風格代表，「形形色色 尋尋覓覓，帶我去找夜生活」。"
  },
  {
    "id": "tw_grade9_3",
    "tag": "台灣九年級",
    "title": "唯一",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=vxucCfcMFCk",
    "youtubeId": "vxucCfcMFCk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "唯一",
      "好不容易",
      "紅",
      "在這座城市遺失了你"
    ],
    "clue": "告五人深情鋼琴抒情名曲，「你真的那樣愛我嗎？是不是我太貪心了」。"
  },
  {
    "id": "tw_grade9_4",
    "tag": "台灣九年級",
    "title": "好不容易",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=caxiOmSWWEM",
    "youtubeId": "caxiOmSWWEM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "好不容易",
      "唯一",
      "愛人錯過",
      "新世界"
    ],
    "clue": "懸疑劇《華燈初上》片尾曲，「我的心 這次真的受傷了，好不容易」。"
  },
  {
    "id": "tw_grade9_5",
    "tag": "台灣九年級",
    "title": "紅",
    "artist": "告五人",
    "youtubeUrl": "https://www.youtube.com/watch?v=9WEYFqCUze8",
    "youtubeId": "9WEYFqCUze8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "紅",
      "帶我去找夜生活",
      "愛人錯過",
      "法蘭西多士"
    ],
    "clue": "告五人抒情力作，MV由謝盈萱主演，充滿情緒渲染力。"
  },
  {
    "id": "tw_grade9_6",
    "tag": "台灣九年級",
    "title": "捲菸",
    "artist": "美秀集團",
    "youtubeUrl": "https://www.youtube.com/watch?v=S4JLJVVjevI",
    "youtubeId": "S4JLJVVjevI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "捲菸",
      "擋一根",
      "我要你愛",
      "米兒"
    ],
    "clue": "美秀集團賽博台客代表作，YouTube點閱破千萬的九年級獨立樂團神曲。"
  },
  {
    "id": "tw_grade9_7",
    "tag": "台灣九年級",
    "title": "擋一根",
    "artist": "美秀集團",
    "youtubeUrl": "https://www.youtube.com/watch?v=3_GFxZ9xA7o",
    "youtubeId": "3_GFxZ9xA7o",
    "startTime": 15,
    "duration": 60,
    "options": [
      "擋一根",
      "捲菸",
      "我要你愛",
      "電火王"
    ],
    "clue": "美秀集團經典復古台語搖滾，「借我擋一根，免得等一下心頭悶」。"
  },
  {
    "id": "tw_grade9_8",
    "tag": "台灣九年級",
    "title": "我要你愛",
    "artist": "美秀集團",
    "youtubeUrl": "https://www.youtube.com/watch?v=ouQwJj1V2pE",
    "youtubeId": "ouQwJj1V2pE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我要你愛",
      "捲菸",
      "擋一根",
      "金光閃閃"
    ],
    "clue": "美秀集團動感復古的熱烈求愛電音搖滾。"
  },
  {
    "id": "tw_grade9_9",
    "tag": "台灣九年級",
    "title": "想和你看五月的晚霞",
    "artist": "陳華",
    "youtubeUrl": "https://www.youtube.com/watch?v=ljd9ISixsWo",
    "youtubeId": "ljd9ISixsWo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "想和你看五月的晚霞",
      "與我無關",
      "無敵浪漫",
      "想太多"
    ],
    "clue": "陳華爆紅神曲，蟬聯各大串流榜冠軍，「想和你看五月的晚霞，六月日落，七月蒸發」。"
  },
  {
    "id": "tw_grade9_10",
    "tag": "台灣九年級",
    "title": "在加納共和國離婚",
    "artist": "菲道爾 / 大穎",
    "youtubeUrl": "https://www.youtube.com/watch?v=wlSvIL-H1GQ",
    "youtubeId": "wlSvIL-H1GQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "在加納共和國離婚",
      "阿拉斯加海灣",
      "友誼長存",
      "能遇見，就很不錯了"
    ],
    "clue": "「你還愛我嗎？你懂我嗎？」洗捲各大社群平台的虐心合唱神曲。"
  },
  {
    "id": "tw_grade9_11",
    "tag": "台灣九年級",
    "title": "阿拉斯加海灣",
    "artist": "菲道爾",
    "youtubeUrl": "https://www.youtube.com/watch?v=kU0oHbP4ZDk",
    "youtubeId": "kU0oHbP4ZDk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "阿拉斯加海灣",
      "在加納共和國離婚",
      "早點回家",
      "能遇見"
    ],
    "clue": "菲道爾溫柔感傷的爆紅名作，「上天啊，難道你看不出我很愛她」。"
  },
  {
    "id": "tw_grade9_12",
    "tag": "台灣九年級",
    "title": "我會等",
    "artist": "承桓",
    "youtubeUrl": "https://www.youtube.com/watch?v=wukVNyIrtMc",
    "youtubeId": "wukVNyIrtMc",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我會等",
      "想和你看五月的晚霞",
      "飛鳥和蟬",
      "白月光與硃砂痣"
    ],
    "clue": "「我會等枯樹生出新芽，等大雪覆蓋這座城池」，社群短影音超人氣治癒勵志曲。"
  },
  {
    "id": "tw_grade9_13",
    "tag": "台灣九年級",
    "title": "失重前幸福",
    "artist": "艾薇",
    "youtubeUrl": "https://www.youtube.com/watch?v=dZlT8K_Woo0",
    "youtubeId": "dZlT8K_Woo0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "失重前幸福",
      "甘室人生",
      "絕美",
      "悲傷的五個步驟"
    ],
    "clue": "大馬歌手艾薇高亢爆發力的金曲入圍代表作。"
  },
  {
    "id": "tw_grade9_14",
    "tag": "台灣九年級",
    "title": "Crush On You",
    "artist": "李浩瑋 Howard Lee",
    "youtubeUrl": "https://www.youtube.com/watch?v=YGzrowrKkw4",
    "youtubeId": "YGzrowrKkw4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Crush On You",
      "窩囊廢",
      "Blame",
      "Silver linen"
    ],
    "clue": "新世代獨立唱作人李浩瑋空靈R&B慵懶名曲。"
  },
  {
    "id": "tw_grade9_15",
    "tag": "台灣九年級",
    "title": "小紫吐司",
    "artist": "芒果醬 Mango Jump",
    "youtubeUrl": "https://www.youtube.com/watch?v=gCa2L_mC3w8",
    "youtubeId": "gCa2L_mC3w8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "小紫吐司",
      "芒狗狗",
      "夏夜晚風",
      "再見五月天"
    ],
    "clue": "芒果醬 Mango Jump 搞怪熱血的青春樂團代表作。"
  },
  {
    "id": "tw_grade9_16",
    "tag": "台灣九年級",
    "title": "芒狗狗",
    "artist": "芒果醬 Mango Jump",
    "youtubeUrl": "https://www.youtube.com/watch?v=_PAbZ6OZenY",
    "youtubeId": "_PAbZ6OZenY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "芒狗狗",
      "小紫吐司",
      "團寵",
      "心跳"
    ],
    "clue": "芒果醬極具辨識度的陽光無厘頭風格。"
  },
  {
    "id": "tw_grade9_17",
    "tag": "台灣九年級",
    "title": "能不能和我留在台北",
    "artist": "冰球樂團 icyball",
    "youtubeUrl": "https://www.youtube.com/watch?v=aT_wAEeR4vg",
    "youtubeId": "aT_wAEeR4vg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "能不能和我留在台北",
      "醉後喜歡我",
      "愛手藝",
      "搖擺大叔"
    ],
    "clue": "icyball 冰球樂團復古 City Pop 風潮的代表作，「能不能和我留在台北陪我失眠」。"
  },
  {
    "id": "tw_grade9_18",
    "tag": "台灣九年級",
    "title": "醉後喜歡我",
    "artist": "冰球樂團 icyball",
    "youtubeUrl": "https://www.youtube.com/watch?v=3OHT350Acj4",
    "youtubeId": "3OHT350Acj4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "醉後喜歡我",
      "能不能和我留在台北",
      "Bad Boy",
      "愛手藝"
    ],
    "clue": "冰球樂團迷幻微醺的摩登都市浪漫之作。"
  },
  {
    "id": "tw_grade9_19",
    "tag": "台灣九年級",
    "title": "我想和你一起",
    "artist": "溫蒂漫步 Wendy Wander",
    "youtubeUrl": "https://www.youtube.com/watch?v=ltFNlTWDgU8",
    "youtubeId": "ltFNlTWDgU8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我想和你一起",
      "艾菲爾",
      "Spring",
      "Lullaby"
    ],
    "clue": "溫蒂漫步Dream Pop迷幻民謠代表作，「我想和你一起看海」。"
  },
  {
    "id": "tw_grade9_20",
    "tag": "台灣九年級",
    "title": "針對與對峙",
    "artist": "持修",
    "youtubeUrl": "https://www.youtube.com/watch?v=NeNq5RFYubc",
    "youtubeId": "NeNq5RFYubc",
    "startTime": 15,
    "duration": 60,
    "options": [
      "針對與對峙",
      "Imma Get A New One",
      "正想著你呢",
      "根本不是我對手"
    ],
    "clue": "金曲新人持修兼具二次元與流行美學的創作神曲。"
  },
  {
    "id": "tw_grade9_21",
    "tag": "台灣九年級",
    "title": "不介意",
    "artist": "鶴 The Crane",
    "youtubeUrl": "https://www.youtube.com/watch?v=9fmGhdlf4fs",
    "youtubeId": "9fmGhdlf4fs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "不介意",
      "拉麵公子",
      "Natural Ability",
      "Unique Design"
    ],
    "clue": "鶴 The Crane 慵懶爵士R&B的當代都會風格佳作。"
  },
  {
    "id": "tw_grade9_22",
    "tag": "台灣九年級",
    "title": "我的愛人",
    "artist": "柏霖 PoLin",
    "youtubeUrl": "https://www.youtube.com/watch?v=g9BqoGxlkc0",
    "youtubeId": "g9BqoGxlkc0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "我的愛人",
      "啼笑皆非",
      "流浪的船",
      "安好"
    ],
    "clue": "影集《火神的眼淚》插曲，聲林之王冠軍柏霖充滿戲劇張力的靈魂情歌。"
  },
  {
    "id": "tw_grade9_23",
    "tag": "台灣九年級",
    "title": "COLORFUL",
    "artist": "婁峻碩 SHOU",
    "youtubeUrl": "https://www.youtube.com/watch?v=c4_qKyFuL0Y",
    "youtubeId": "c4_qKyFuL0Y",
    "startTime": 15,
    "duration": 60,
    "options": [
      "COLORFUL",
      "NEVER LAND",
      "Blue Sky",
      "AIRPLANE"
    ],
    "clue": "五堅情成員婁峻碩紅遍校園的甜蜜輕快嘻哈神曲。"
  },
  {
    "id": "tw_grade9_24",
    "tag": "台灣九年級",
    "title": "NEVER LAND",
    "artist": "婁峻碩 SHOU",
    "youtubeUrl": "https://www.youtube.com/watch?v=76Z48A6pqRw",
    "youtubeId": "76Z48A6pqRw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "NEVER LAND",
      "COLORFUL",
      "SOFA",
      "WE GO"
    ],
    "clue": "婁峻碩熱血追夢的潮流饒舌之作。"
  },
  {
    "id": "tw_grade9_25",
    "tag": "台灣九年級",
    "title": "長大",
    "artist": "派偉俊",
    "youtubeUrl": "https://www.youtube.com/watch?v=zMHO-CLxzGE",
    "youtubeId": "zMHO-CLxzGE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "長大",
      "3%",
      "最後一次心碎",
      "蝴蝶"
    ],
    "clue": "派偉俊唱出九年級世代面對成長煩惱的流行共鳴。"
  },
  {
    "id": "tw_grade9_26",
    "tag": "台灣九年級",
    "title": "Seaside",
    "artist": "壞特 ?te",
    "youtubeUrl": "https://www.youtube.com/watch?v=XTFxc5HPuvE",
    "youtubeId": "XTFxc5HPuvE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Seaside",
      "Cazzo",
      "Santa Baby",
      "睡不著"
    ],
    "clue": "金曲最佳新人壞特神秘慵懶的Lo-fi Chill Hop海風名作。"
  },
  {
    "id": "tw_grade9_27",
    "tag": "台灣九年級",
    "title": "50元的浪漫",
    "artist": "潮州土狗",
    "youtubeUrl": "https://www.youtube.com/watch?v=mjl2qabfSNs",
    "youtubeId": "mjl2qabfSNs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "50元的浪漫",
      "反毒大使",
      "現主時",
      "看你看我"
    ],
    "clue": "潮州土狗以幽默詼諧的超接地氣風格引爆青年社群。"
  },
  {
    "id": "tw_grade9_28",
    "tag": "台灣九年級",
    "title": "未接來電",
    "artist": "莫宰羊",
    "youtubeUrl": "https://www.youtube.com/watch?v=NXId3_EEGKY",
    "youtubeId": "NXId3_EEGKY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "未接來電",
      "健康快樂",
      "水作的",
      "魚"
    ],
    "clue": "莫宰羊以獨特Auto-tune唱腔與詩意歌詞開創的新生代說唱名曲。"
  },
  {
    "id": "tw_grade9_29",
    "tag": "台灣九年級",
    "title": "CHANGE",
    "artist": "瘦子 E.SO",
    "youtubeUrl": "https://www.youtube.com/watch?v=HTRQ0n4yjfs",
    "youtubeId": "HTRQ0n4yjfs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "CHANGE",
      "伯父",
      "太陽",
      "WAIT"
    ],
    "clue": "頑童瘦子單飛個人首張專輯《靈魂出竅》的成熟內斂主打。"
  },
  {
    "id": "tw_grade9_30",
    "tag": "台灣九年級",
    "title": "伯父",
    "artist": "瘦子 E.SO",
    "youtubeUrl": "https://www.youtube.com/watch?v=EcKUVuOifTg",
    "youtubeId": "EcKUVuOifTg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "伯父",
      "CHANGE",
      "Hello Beautiful",
      "她沒在看你"
    ],
    "clue": "瘦子以幽默視角寫出面對女友父親的心情，風靡新世代。"
  },
  {
    "id": "tw_grade9_31",
    "tag": "台灣九年級",
    "title": "能火",
    "artist": "熊仔",
    "youtubeUrl": "https://www.youtube.com/watch?v=_SoARWAcMU8",
    "youtubeId": "_SoARWAcMU8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "能火",
      "買榜",
      "信",
      "才子"
    ],
    "clue": "熊仔奪得金曲獎最佳華語專輯的饒舌巔峰霸氣之作。"
  },
  {
    "id": "tw_grade9_32",
    "tag": "台灣九年級",
    "title": "愚者",
    "artist": "理想混蛋",
    "youtubeUrl": "https://www.youtube.com/watch?v=FYNNLjn-CuI",
    "youtubeId": "FYNNLjn-CuI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "愚者",
      "不是因為天氣晴朗才愛你",
      "行星",
      "平衡木"
    ],
    "clue": "理想混蛋首張專輯同名核心概念曲，勇往直前的愚者精神。"
  },
  {
    "id": "tw_grade9_33",
    "tag": "台灣九年級",
    "title": "魚",
    "artist": "怕胖團",
    "youtubeUrl": "https://www.youtube.com/watch?v=Dnz-BTz9eDU",
    "youtubeId": "Dnz-BTz9eDU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魚",
      "媽媽的筆記本",
      "當你在想我的時候",
      "魚在哪裡"
    ],
    "clue": "怕胖團溫暖深情的龐克抒情，「你是一隻魚，水裡的魚」。"
  },
  {
    "id": "tw_grade9_34",
    "tag": "台灣九年級",
    "title": "暗流",
    "artist": "拍謝少年",
    "youtubeUrl": "https://www.youtube.com/watch?v=Roxj9OR6ufk",
    "youtubeId": "Roxj9OR6ufk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "暗流",
      "兄弟沒夢不應該",
      "百百人生",
      "出巡"
    ],
    "clue": "拍謝少年融合傳統台灣意象與後搖滾氣息的動人器樂搖滾。"
  },
  {
    "id": "tw_grade9_35",
    "tag": "台灣九年級",
    "title": "長途夜車",
    "artist": "滅火器",
    "youtubeUrl": "https://www.youtube.com/watch?v=TAgVVc5hAiE",
    "youtubeId": "TAgVVc5hAiE",
    "startTime": 15,
    "duration": 60,
    "options": [
      "長途夜車",
      "島嶼天光",
      "海上的人",
      "自信勇敢咱的名"
    ],
    "clue": "寫給所有離鄉背井打拚年輕人的催淚深夜歸途之歌。"
  },
  {
    "id": "tw_grade9_36",
    "tag": "台灣九年級",
    "title": "若思念便思念",
    "artist": "脆樂團 Crispy",
    "youtubeUrl": "https://www.youtube.com/watch?v=YKkhXC86EhA",
    "youtubeId": "YKkhXC86EhA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "若思念便思念",
      "愛情的模樣",
      "100分",
      "編織星空的人"
    ],
    "clue": "雙主唱男女對唱民謠，入圍金曲獎最佳演唱組合。"
  },
  {
    "id": "tw_grade9_37",
    "tag": "台灣九年級",
    "title": "彼個所在",
    "artist": "魏如萱",
    "youtubeUrl": "https://www.youtube.com/watch?v=86wypSCXK9M",
    "youtubeId": "86wypSCXK9M",
    "startTime": 15,
    "duration": 60,
    "options": [
      "彼個所在",
      "你啊你啊",
      "泡泡",
      "買你"
    ],
    "clue": "魏如萱以國台英粵四種語言交織而成的感人思念安魂曲。"
  },
  {
    "id": "tw_grade9_38",
    "tag": "台灣九年級",
    "title": "買榜",
    "artist": "吳卓源 / 熊仔",
    "youtubeUrl": "https://www.youtube.com/watch?v=W-H6v6b1hu4",
    "youtubeId": "W-H6v6b1hu4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "買榜",
      "台北夜空下",
      "撥接",
      "你是不是有點動心"
    ],
    "clue": "鄉民老婆 Julia 吳卓源與熊仔合作，風靡千禧新世代的R&B神曲。"
  },
  {
    "id": "tw_grade9_39",
    "tag": "台灣九年級",
    "title": "Millions of Years Apart",
    "artist": "恐龍的皮 The Dinosaur's Skin",
    "youtubeUrl": "https://www.youtube.com/watch?v=UwKDv80VnPo",
    "youtubeId": "UwKDv80VnPo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Millions of Years Apart",
      "All My Friends Are Dead",
      "Triassic Love",
      "Brontosaurus"
    ],
    "clue": "恐龍的皮帶有復古Lo-fi色彩與侏儸紀浪漫的九年級超人氣樂團。"
  },
  {
    "id": "tw_grade9_40",
    "tag": "台灣九年級",
    "title": "你終究也想成為沒有秘密的極限",
    "artist": "傻子與白痴",
    "youtubeUrl": "https://www.youtube.com/watch?v=g9dWCal7nEM",
    "youtubeId": "g9dWCal7nEM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "你終究也想成為沒有秘密的極限",
      "象牙舟",
      "OY",
      "夜行動物館"
    ],
    "clue": "傻子與白痴主唱蔡維澤極具深度的獨立搖滾當代之作。"
  },
  {
    "id": "anime_1",
    "tag": "動漫神曲",
    "title": "殘酷天使的行動綱領",
    "artist": "高橋洋子",
    "youtubeUrl": "https://www.youtube.com/watch?v=o6wtDPVkKqI",
    "youtubeId": "o6wtDPVkKqI",
    "startTime": 10,
    "duration": 60,
    "options": [
      "殘酷天使的行動綱領",
      "魂之輪迴",
      "直到世界的盡頭",
      "前前前世"
    ],
    "clue": "傳奇動畫《新世紀福音戰士》(EVA) 經典片頭曲。"
  },
  {
    "id": "anime_2",
    "tag": "動漫神曲",
    "title": "直到世界的盡頭",
    "artist": "WANDS",
    "youtubeUrl": "https://www.youtube.com/watch?v=P199MdOxVeI",
    "youtubeId": "P199MdOxVeI",
    "startTime": 35,
    "duration": 60,
    "options": [
      "直到世界的盡頭",
      "好想大聲說喜歡你",
      "捕捉閃爍的瞬間",
      "灌籃高手"
    ],
    "clue": "《灌籃高手》(Slam Dunk) 三井壽浪子回頭專屬片尾曲。"
  },
  {
    "id": "anime_3",
    "tag": "動漫神曲",
    "title": "好想大聲說喜歡你",
    "artist": "BAAD",
    "youtubeUrl": "https://www.youtube.com/watch?v=HSj-en4UHMI",
    "youtubeId": "HSj-en4UHMI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "好想大聲說喜歡你",
      "直到世界的盡頭",
      "漸漸被你吸引",
      "勇氣100%"
    ],
    "clue": "《灌籃高手》(Slam Dunk) 熱血沸騰的第一代片頭曲。"
  },
  {
    "id": "anime_4",
    "tag": "動漫神曲",
    "title": "紅蓮華",
    "artist": "LiSA",
    "youtubeUrl": "https://www.youtube.com/watch?v=MpYy6wwqxoo",
    "youtubeId": "MpYy6wwqxoo",
    "startTime": 15,
    "duration": 60,
    "options": [
      "紅蓮華",
      "炎",
      "殘響散歌",
      "虹"
    ],
    "clue": "全球現象級動畫《鬼滅之刃 竈門炭治郎 立志篇》主題曲。"
  },
  {
    "id": "anime_5",
    "tag": "動漫神曲",
    "title": "哆啦A夢之歌",
    "artist": "大杉久美子",
    "youtubeUrl": "https://www.youtube.com/watch?v=frSrRzEJoE4",
    "youtubeId": "frSrRzEJoE4",
    "startTime": 5,
    "duration": 60,
    "options": [
      "哆啦A夢之歌",
      "櫻桃小丸子主題曲",
      "麵包超人進行曲",
      "名偵探柯南主題曲"
    ],
    "clue": "「昂、昂、昂，小叮噹幫我實現所有的願望」，陪伴幾代人的童年。"
  },
  {
    "id": "anime_6",
    "tag": "動漫神曲",
    "title": "We Are!",
    "artist": "北谷洋",
    "youtubeUrl": "https://www.youtube.com/watch?v=HB4iNVa746E",
    "youtubeId": "HB4iNVa746E",
    "startTime": 10,
    "duration": 60,
    "options": [
      "We Are!",
      "Believe",
      "Share The World",
      "One Day"
    ],
    "clue": "超人氣動畫《航海王 ONE PIECE》最初也是最經典的冒險序幕曲。"
  },
  {
    "id": "anime_7",
    "tag": "動漫神曲",
    "title": "炎",
    "artist": "LiSA",
    "youtubeUrl": "https://www.youtube.com/watch?v=4DxL6IKmXx4",
    "youtubeId": "4DxL6IKmXx4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "炎",
      "紅蓮華",
      "殘響散歌",
      "虹"
    ],
    "clue": "《鬼滅之刃劇場版 無限列車篇》主題曲，大哥沒有輸的熱淚感動。"
  },
  {
    "id": "anime_8",
    "tag": "動漫神曲",
    "title": "殘響散歌",
    "artist": "Aimer",
    "youtubeUrl": "https://www.youtube.com/watch?v=tLQLa6lM3Us",
    "youtubeId": "tLQLa6lM3Us",
    "startTime": 15,
    "duration": 60,
    "options": [
      "殘響散歌",
      "紅蓮華",
      "炎",
      "朝が来る"
    ],
    "clue": "《鬼滅之刃 遊郭篇》片頭曲，Aimer極具張力的沙啞嗓音與華麗疾速旋律。"
  },
  {
    "id": "anime_9",
    "tag": "動漫神曲",
    "title": "Idol",
    "artist": "YOASOBI",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZRtdQ81jPUQ",
    "youtubeId": "ZRtdQ81jPUQ",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Idol",
      "群青",
      "夜に駆ける",
      "怪物"
    ],
    "clue": "動畫《我推的孩子》超人氣主題曲，席捲全球各大告示牌排行榜冠軍。"
  },
  {
    "id": "anime_10",
    "tag": "動漫神曲",
    "title": "群青",
    "artist": "YOASOBI",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y4nEEZwckuU",
    "youtubeId": "Y4nEEZwckuU",
    "startTime": 15,
    "duration": 60,
    "options": [
      "群青",
      "Idol",
      "夜に駆ける",
      "三原色"
    ],
    "clue": "靈感來自漫畫《藍色時期》，激勵無數追夢者的青春合唱之作。"
  },
  {
    "id": "anime_11",
    "tag": "動漫神曲",
    "title": "向夜晚奔去",
    "artist": "YOASOBI",
    "youtubeUrl": "https://www.youtube.com/watch?v=by4SYYWlhEs",
    "youtubeId": "by4SYYWlhEs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "向夜晚奔去",
      "群青",
      "怪物",
      "優しい彗星"
    ],
    "clue": "YOASOBI出道爆紅代表作《夜に駆ける》，串流播放突破數億次的成名曲。"
  },
  {
    "id": "anime_12",
    "tag": "動漫神曲",
    "title": "Lemon",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=SX_ViT4Ra7k",
    "youtubeId": "SX_ViT4Ra7k",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Lemon",
      "Peace Sign",
      "KICK BACK",
      "Paprika"
    ],
    "clue": "日劇《法醫女王》(Unnatural) 主題曲，米津玄師點閱破8億次的平成傳奇神曲。"
  },
  {
    "id": "anime_13",
    "tag": "動漫神曲",
    "title": "Peace Sign",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=9aJVr5tTTWk",
    "youtubeId": "9aJVr5tTTWk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Peace Sign",
      "Lemon",
      "KICK BACK",
      "打上花火"
    ],
    "clue": "熱血動畫《我的英雄學院》第2期片頭曲，象徵堅定邁向未來的和平象徵。"
  },
  {
    "id": "anime_14",
    "tag": "動漫神曲",
    "title": "KICK BACK",
    "artist": "米津玄師",
    "youtubeUrl": "https://www.youtube.com/watch?v=M2cckDmNLMI",
    "youtubeId": "M2cckDmNLMI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "KICK BACK",
      "Lemon",
      "Peace Sign",
      "死神"
    ],
    "clue": "動畫《鏈鋸人》熱血狂躁的片頭曲，常田大希參與編曲與演奏。"
  },
  {
    "id": "anime_15",
    "tag": "動漫神曲",
    "title": "前前前世",
    "artist": "RADWIMPS",
    "youtubeUrl": "https://www.youtube.com/watch?v=PDSkFeMVNFs",
    "youtubeId": "PDSkFeMVNFs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "前前前世",
      "Sparkle",
      "Grand Escape",
      "愛にできることはまだあるかい"
    ],
    "clue": "新海誠現象級動畫電影《你的名字》主題曲，疾馳而過的青春命運羈絆。"
  },
  {
    "id": "anime_16",
    "tag": "動漫神曲",
    "title": "Sparkle (火花)",
    "artist": "RADWIMPS",
    "youtubeUrl": "https://www.youtube.com/watch?v=a2GujJZfXpg",
    "youtubeId": "a2GujJZfXpg",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Sparkle (火花)",
      "前前前世",
      "夢燈籠",
      "什麼都沒有"
    ],
    "clue": "《你的名字》彗星墜落高潮片段插曲，鋼琴琶音如流星雨般璀璨灑落。"
  },
  {
    "id": "anime_17",
    "tag": "動漫神曲",
    "title": "Butter-Fly",
    "artist": "和田光司",
    "youtubeUrl": "https://www.youtube.com/watch?v=YAxNwRb93xk",
    "youtubeId": "YAxNwRb93xk",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Butter-Fly",
      "Target",
      "Brave Heart",
      "Seven"
    ],
    "clue": "《數碼寶貝大冒險》經典片頭曲，不死蝶和田光司燃燒生命的童年熱血回憶。"
  },
  {
    "id": "anime_18",
    "tag": "動漫神曲",
    "title": "魂之輪迴",
    "artist": "高橋洋子",
    "youtubeUrl": "https://www.youtube.com/watch?v=Wl7IW7OiaHc",
    "youtubeId": "Wl7IW7OiaHc",
    "startTime": 15,
    "duration": 60,
    "options": [
      "魂之輪迴",
      "殘酷天使的行動綱領",
      "THANATOS",
      "Komm, süsser Tod"
    ],
    "clue": "《新世紀福音戰士劇場版：死與新生》主題曲，莊嚴神聖的靈魂歸宿之歌。"
  },
  {
    "id": "anime_19",
    "tag": "動漫神曲",
    "title": "CHA-LA HEAD-CHA-LA",
    "artist": "影山浩宣",
    "youtubeUrl": "https://www.youtube.com/watch?v=dIPi7Knz6Bs",
    "youtubeId": "dIPi7Knz6Bs",
    "startTime": 15,
    "duration": 60,
    "options": [
      "CHA-LA HEAD-CHA-LA",
      "WE GOTTA POWER",
      "摩訶不思議大冒險",
      "漸漸被你吸引"
    ],
    "clue": "《七龍珠Z》第一代片頭曲，「發射龜派氣功」的全球共通熱血童年旋律。"
  },
  {
    "id": "anime_20",
    "tag": "動漫神曲",
    "title": "漸漸被你吸引",
    "artist": "FIELD OF VIEW",
    "youtubeUrl": "https://www.youtube.com/watch?v=f7Z3b_vSjS8",
    "youtubeId": "f7Z3b_vSjS8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "漸漸被你吸引",
      "CHA-LA HEAD-CHA-LA",
      "直到世界的盡頭",
      "好想大聲說喜歡你"
    ],
    "clue": "《七龍珠GT》片頭曲，坂井泉水 (ZARD) 作詞的動漫金曲。"
  },
  {
    "id": "anime_21",
    "tag": "動漫神曲",
    "title": "One Last Kiss",
    "artist": "宇多田光",
    "youtubeUrl": "https://www.youtube.com/watch?v=0Uhh62MUEic",
    "youtubeId": "0Uhh62MUEic",
    "startTime": 15,
    "duration": 60,
    "options": [
      "One Last Kiss",
      "Beautiful World",
      "Sakura Drops",
      "First Love"
    ],
    "clue": "電影《福音戰士新劇場版：終》主題曲，宇多田光細膩溫柔的告別之作。"
  },
  {
    "id": "anime_22",
    "tag": "動漫神曲",
    "title": "Cry Baby",
    "artist": "Official鬍子男dism",
    "youtubeUrl": "https://www.youtube.com/watch?v=O1bhZgkC4Gw",
    "youtubeId": "O1bhZgkC4Gw",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Cry Baby",
      "Mixed Nuts",
      "Pretender",
      "I LOVE..."
    ],
    "clue": "動畫《東京復仇者》片頭曲，連續轉調的超高難度硬核流行搖滾。"
  },
  {
    "id": "anime_23",
    "tag": "動漫神曲",
    "title": "Mixed Nuts",
    "artist": "Official鬍子男dism",
    "youtubeUrl": "https://www.youtube.com/watch?v=CbH2F0kXgTY",
    "youtubeId": "CbH2F0kXgTY",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Mixed Nuts",
      "Cry Baby",
      "喜劇",
      "色彩"
    ],
    "clue": "現象級喜劇動畫《SPY×FAMILY 間諜家家酒》第1季片頭曲。"
  },
  {
    "id": "anime_24",
    "tag": "動漫神曲",
    "title": "喜劇",
    "artist": "星野源",
    "youtubeUrl": "https://www.youtube.com/watch?v=D_Oyplmhhv0",
    "youtubeId": "D_Oyplmhhv0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "喜劇",
      "Mixed Nuts",
      "戀",
      "SUN"
    ],
    "clue": "動畫《SPY×FAMILY 間諜家家酒》片尾曲，描繪佛傑一家溫馨家庭日常。"
  },
  {
    "id": "anime_25",
    "tag": "動漫神曲",
    "title": "迴迴奇譚",
    "artist": "Eve",
    "youtubeUrl": "https://www.youtube.com/watch?v=1tk1pqwrOys",
    "youtubeId": "1tk1pqwrOys",
    "startTime": 15,
    "duration": 60,
    "options": [
      "迴迴奇譚",
      "一途",
      "SPECIALZ",
      "蒼のワルツ"
    ],
    "clue": "超人氣動畫《咒術迴戰》第1季片頭曲，疾速切分節奏與黑暗奇幻風格。"
  },
  {
    "id": "anime_26",
    "tag": "動漫神曲",
    "title": "一途",
    "artist": "King Gnu",
    "youtubeUrl": "https://www.youtube.com/watch?v=hm1na9R2uYA",
    "youtubeId": "hm1na9R2uYA",
    "startTime": 15,
    "duration": 60,
    "options": [
      "一途",
      "SPECIALZ",
      "白日",
      "逆夢"
    ],
    "clue": "《劇場版 咒術迴戰 0》主題曲，乙骨憂太與里香純愛詛咒的爆發疾馳之作。"
  },
  {
    "id": "anime_27",
    "tag": "動漫神曲",
    "title": "SPECIALZ",
    "artist": "King Gnu",
    "youtubeUrl": "https://www.youtube.com/watch?v=fhzKLBZJC3w",
    "youtubeId": "fhzKLBZJC3w",
    "startTime": 15,
    "duration": 60,
    "options": [
      "SPECIALZ",
      "一途",
      "白日",
      "雨燦々"
    ],
    "clue": "《咒術迴戰 澀谷事變》片頭曲，「You are my special」洗腦全世界。"
  },
  {
    "id": "anime_28",
    "tag": "動漫神曲",
    "title": "目標是寶可夢大師",
    "artist": "松本梨香",
    "youtubeUrl": "https://www.youtube.com/watch?v=kbsRaNXfsew",
    "youtubeId": "kbsRaNXfsew",
    "startTime": 15,
    "duration": 60,
    "options": [
      "目標是寶可夢大師",
      "151",
      "競逐者",
      "微笑的向日葵"
    ],
    "clue": "《精靈寶可夢》初代片頭曲，「哪怕火中水中草叢中」小智與皮卡丘的冒險起點。"
  },
  {
    "id": "anime_29",
    "tag": "動漫神曲",
    "title": "Sugar Song and Bitter Step",
    "artist": "UNISON SQUARE GARDEN",
    "youtubeUrl": "https://www.youtube.com/watch?v=3exsRhw3xt8",
    "youtubeId": "3exsRhw3xt8",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Sugar Song and Bitter Step",
      "Hello, world!",
      "Catch up, latency",
      "オリオンをなぞる"
    ],
    "clue": "動畫《血界戰線》ED名曲，片尾全員歡樂起舞的經典跳舞動畫。"
  },
  {
    "id": "anime_30",
    "tag": "動漫神曲",
    "title": "GO!!!",
    "artist": "FLOW",
    "youtubeUrl": "https://www.youtube.com/watch?v=AE4b9jO1uB4",
    "youtubeId": "AE4b9jO1uB4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "GO!!!",
      "青鳥",
      "Sign",
      "遙か彼方"
    ],
    "clue": "經典動漫《火影忍者》第4期片頭曲，「We are Fighting Dreamers」熱血澎湃。"
  },
  {
    "id": "anime_31",
    "tag": "動漫神曲",
    "title": "青鳥",
    "artist": "生物股長 (Ikimonogakari)",
    "youtubeUrl": "https://www.youtube.com/watch?v=KpsJWFuVTdI",
    "youtubeId": "KpsJWFuVTdI",
    "startTime": 15,
    "duration": 60,
    "options": [
      "青鳥",
      "螢之光",
      "SAKURA",
      "YELL"
    ],
    "clue": "《火影忍者疾風傳》片頭曲，「飛翔之際，說好了就絕不回頭」，動漫傳世名曲。"
  },
  {
    "id": "anime_32",
    "tag": "動漫神曲",
    "title": "Silhouette",
    "artist": "KANA-BOON",
    "youtubeUrl": "https://www.youtube.com/watch?v=dlFA0Zq1k2A",
    "youtubeId": "dlFA0Zq1k2A",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Silhouette",
      "青鳥",
      "GO!!!",
      "Baton Road"
    ],
    "clue": "《火影忍者疾風傳》第16期片頭曲，旋律節奏感極強，全球火影迷無人不曉。"
  },
  {
    "id": "anime_33",
    "tag": "動漫神曲",
    "title": "曇天",
    "artist": "DOES",
    "youtubeUrl": "https://www.youtube.com/watch?v=n5TG3Fxzft0",
    "youtubeId": "n5TG3Fxzft0",
    "startTime": 15,
    "duration": 60,
    "options": [
      "曇天",
      "修羅",
      "Some Like It Hot!!",
      "桃源鄉Alien"
    ],
    "clue": "《銀魂》經典片頭曲，DOES直率痛快的日系搖滾描寫陰霾天色下的熱血戰鬥。"
  },
  {
    "id": "anime_34",
    "tag": "動漫神曲",
    "title": "Some Like It Hot!! (武士之心)",
    "artist": "SPYAIR",
    "youtubeUrl": "https://www.youtube.com/watch?v=yDDBaQnd9Ls",
    "youtubeId": "yDDBaQnd9Ls",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Some Like It Hot!! (武士之心)",
      "現狀破壞",
      "曇天",
      "櫻滿月"
    ],
    "clue": "《銀魂》第17期片尾曲，SPYAIR最具代表性的燃系動漫名曲。"
  },
  {
    "id": "anime_35",
    "tag": "動漫神曲",
    "title": "secret base ～你給我的東西～",
    "artist": "茅野愛衣 / 戶松遙 / 早見沙織",
    "youtubeUrl": "https://www.youtube.com/watch?v=-nQ0teDhO6c",
    "youtubeId": "-nQ0teDhO6c",
    "startTime": 15,
    "duration": 60,
    "options": [
      "secret base ～你給我的東西～",
      "青鳥",
      "一番の宝物",
      "小小手心"
    ],
    "clue": "《未聞花名》(我們仍未知道那天所看見的花名) 片尾催淚神曲，「找到你了，面麻」。"
  },
  {
    "id": "anime_36",
    "tag": "動漫神曲",
    "title": "你不知道的故事",
    "artist": "supercell",
    "youtubeUrl": "https://www.youtube.com/watch?v=jpV5jeFlt_E",
    "youtubeId": "jpV5jeFlt_E",
    "startTime": 15,
    "duration": 60,
    "options": [
      "你不知道的故事",
      "戀愛循環",
      "Connect",
      "白金Disco"
    ],
    "clue": "《化物話》片尾曲，以夏季大三角天鵝座為背景的青春天文告白神曲。"
  },
  {
    "id": "anime_37",
    "tag": "動漫神曲",
    "title": "Connect",
    "artist": "ClariS",
    "youtubeUrl": "https://www.youtube.com/watch?v=CS2kMYu4UtM",
    "youtubeId": "CS2kMYu4UtM",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Connect",
      "Magia",
      "Luminous",
      "Colorful"
    ],
    "clue": "《魔法少女小圓》片頭曲，看似純真魔法少女實則隱含曉美焰輪迴宿命的經典名作。"
  },
  {
    "id": "anime_38",
    "tag": "動漫神曲",
    "title": "紅蓮的弓矢",
    "artist": "Linked Horizon",
    "youtubeUrl": "https://www.youtube.com/watch?v=CID-sYQNCew",
    "youtubeId": "CID-sYQNCew",
    "startTime": 15,
    "duration": 60,
    "options": [
      "紅蓮的弓矢",
      "心臟撒撒給油",
      "美麗而殘酷的世界",
      "惡魔之子"
    ],
    "clue": "《進擊的巨人》初代片頭曲，「那一天，人類回想起了被巨人支配的恐懼」。"
  },
  {
    "id": "anime_39",
    "tag": "動漫神曲",
    "title": "Mela!",
    "artist": "綠黃色社會",
    "youtubeUrl": "https://www.youtube.com/watch?v=aRDURmIYBZ4",
    "youtubeId": "aRDURmIYBZ4",
    "startTime": 15,
    "duration": 60,
    "options": [
      "Mela!",
      "Shout Baby",
      "Character",
      "花になって"
    ],
    "clue": "綠黃色社會元氣爆發的超人氣流行代表作，各大校園管樂團與動漫活動必唱。"
  },
  {
    "id": "anime_40",
    "tag": "動漫神曲",
    "title": "鄰家的龍貓",
    "artist": "井上杏美",
    "youtubeUrl": "https://www.youtube.com/watch?v=0Wv3Ya9nskA",
    "youtubeId": "0Wv3Ya9nskA",
    "startTime": 10,
    "duration": 60,
    "options": [
      "鄰家的龍貓",
      "風之谷",
      "天空之城 (伴隨著你)",
      "散步"
    ],
    "clue": "吉卜力工作室宮崎駿名作《龍貓》主題曲，全世界孩子耳熟能詳的森林精靈之歌。"
  },
  {
    "id": "kids_1",
    "tag": "童謠兒歌",
    "title": "拔蘿蔔",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=rwth9dQS1oM",
    "youtubeId": "rwth9dQS1oM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "拔蘿蔔",
      "兩隻老虎",
      "泥娃娃",
      "小星星"
    ],
    "clue": "「拔蘿蔔拔蘿蔔，嘿呦嘿呦拔不動」，耳熟能詳的兒歌。"
  },
  {
    "id": "kids_2",
    "tag": "童謠兒歌",
    "title": "兩隻老虎",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=RApHGXfBKO0",
    "youtubeId": "RApHGXfBKO0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "兩隻老虎",
      "三隻小豬",
      "醜小鴨",
      "泥娃娃"
    ],
    "clue": "「一隻沒有耳朵，一隻沒有尾巴，真奇怪！真奇怪！」。"
  },
  {
    "id": "kids_3",
    "tag": "童謠兒歌",
    "title": "小星星",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=yCjJyiqpAuU",
    "youtubeId": "yCjJyiqpAuU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小星星",
      "搖籃曲",
      "當我們同在一起",
      "茉莉花"
    ],
    "clue": "莫札特《小星星變奏曲》旋律：「一閃一閃亮晶晶，滿天都是小星星」。"
  },
  {
    "id": "kids_4",
    "tag": "童謠兒歌",
    "title": "當我們同在一起",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=7shHB9qGi4g",
    "youtubeId": "7shHB9qGi4g",
    "startTime": 0,
    "duration": 60,
    "options": [
      "當我們同在一起",
      "捕魚歌",
      "火車快飛",
      "大象"
    ],
    "clue": "「當我們同在一起，在一起，其快樂無比」，德國傳統民謠改編。"
  },
  {
    "id": "kids_5",
    "tag": "童謠兒歌",
    "title": "泥娃娃",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=v7zHNHIjnt8",
    "youtubeId": "v7zHNHIjnt8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "泥娃娃",
      "娃娃國",
      "兩隻老虎",
      "茉莉花"
    ],
    "clue": "「泥娃娃泥娃娃，一個泥娃娃，也有那眉毛也有那眼睛」。"
  },
  {
    "id": "kids_6",
    "tag": "童謠兒歌",
    "title": "茉莉花",
    "artist": "中國民謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=jOqyaFORT0o",
    "youtubeId": "jOqyaFORT0o",
    "startTime": 20,
    "duration": 60,
    "options": [
      "茉莉花",
      "採茶歌",
      "鳳陽花鼓",
      "康定情歌"
    ],
    "clue": "「好一朵美麗的茉莉花，芬芳美麗滿枝椏，又香又白人人誇」。"
  },
  {
    "id": "kids_7",
    "tag": "童謠兒歌",
    "title": "火車快飛",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=Cz92K_f1Jy8",
    "youtubeId": "Cz92K_f1Jy8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "火車快飛",
      "造飛機",
      "捕魚歌",
      "拔蘿蔔"
    ],
    "clue": "「火車快飛，火車快飛，穿過高山，越過小溪，不知跑了幾百里」。"
  },
  {
    "id": "kids_8",
    "tag": "童謠兒歌",
    "title": "大象",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=TXGjZN_frO4",
    "youtubeId": "TXGjZN_frO4",
    "startTime": 0,
    "duration": 60,
    "options": [
      "大象",
      "小星星",
      "兩隻老虎",
      "拔蘿蔔"
    ],
    "clue": "「大象大象，你的鼻子怎麼那麼長？媽媽說鼻子長才是漂亮」。"
  },
  {
    "id": "kids_9",
    "tag": "童謠兒歌",
    "title": "造飛機",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=Vk0K6WAPAB0",
    "youtubeId": "Vk0K6WAPAB0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "造飛機",
      "火車快飛",
      "大象",
      "泥娃娃"
    ],
    "clue": "「造飛機造飛機來到青草地，蹲下去蹲下去我做飛機翼」。"
  },
  {
    "id": "kids_10",
    "tag": "童謠兒歌",
    "title": "捕魚歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=JLp1a-oo6aA",
    "youtubeId": "JLp1a-oo6aA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "捕魚歌",
      "當我們同在一起",
      "拔蘿蔔",
      "小毛驢"
    ],
    "clue": "「白浪滔滔我不怕，撐起舵兒往前划，撒網下水到魚家，捕條大魚笑哈哈」。"
  },
  {
    "id": "kids_11",
    "tag": "童謠兒歌",
    "title": "娃娃國",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=h9iYhgzIc80",
    "youtubeId": "h9iYhgzIc80",
    "startTime": 0,
    "duration": 60,
    "options": [
      "娃娃國",
      "泥娃娃",
      "妹妹背著洋娃娃",
      "拔蘿蔔"
    ],
    "clue": "「娃娃國，娃娃兵，金髮藍眼睛；娃娃國王鬍子長，騎著木馬打勝仗」。"
  },
  {
    "id": "kids_12",
    "tag": "童謠兒歌",
    "title": "妹妹背著洋娃娃",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=APJTpYsue1o",
    "youtubeId": "APJTpYsue1o",
    "startTime": 0,
    "duration": 60,
    "options": [
      "妹妹背著洋娃娃",
      "娃娃國",
      "泥娃娃",
      "小星星"
    ],
    "clue": "「妹妹背著洋娃娃，走到花園去看花，娃娃哭了叫媽媽，樹上小鳥笑哈哈」。"
  },
  {
    "id": "kids_13",
    "tag": "童謠兒歌",
    "title": "小毛驢",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=qXIFsEGF4Gg",
    "youtubeId": "qXIFsEGF4Gg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小毛驢",
      "拔蘿蔔",
      "大象",
      "三隻小豬"
    ],
    "clue": "「我有一隻小毛驢我從來也不騎，有一天我心血來潮騎著去趕集」。"
  },
  {
    "id": "kids_14",
    "tag": "童謠兒歌",
    "title": "三隻小豬",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=c3IteJjJz5c",
    "youtubeId": "c3IteJjJz5c",
    "startTime": 0,
    "duration": 60,
    "options": [
      "三隻小豬",
      "小毛驢",
      "拔蘿蔔",
      "大野狼"
    ],
    "clue": "敘述三隻小豬蓋稻草屋、木頭屋與磚頭屋對抗大野狼的著名寓言兒歌。"
  },
  {
    "id": "kids_15",
    "tag": "童謠兒歌",
    "title": "頭兒肩膀膝蓋腳",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=5-PCV5rVv8o",
    "youtubeId": "5-PCV5rVv8o",
    "startTime": 0,
    "duration": 60,
    "options": [
      "頭兒肩膀膝蓋腳",
      "握緊雙手又張開",
      "刷牙歌",
      "跳繩歌"
    ],
    "clue": "帶動唱第一神曲，「頭兒肩膀膝蓋腳，膝蓋腳，眼睛鼻子耳朵嘴」。"
  },
  {
    "id": "kids_16",
    "tag": "童謠兒歌",
    "title": "伊比呀呀",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=GgsI5OVKH6M",
    "youtubeId": "GgsI5OVKH6M",
    "startTime": 0,
    "duration": 60,
    "options": [
      "伊比呀呀",
      "當我們同在一起",
      "拔蘿蔔",
      "倫敦鐵橋垮下來"
    ],
    "clue": "「伊比呀呀伊比伊比呀，伊比呀呀伊比伊比呀」，歡樂的互動團康律動曲。"
  },
  {
    "id": "kids_17",
    "tag": "童謠兒歌",
    "title": "倫敦鐵橋垮下來",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=qnhvTx0AAfM",
    "youtubeId": "qnhvTx0AAfM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "倫敦鐵橋垮下來",
      "王老先生有塊地",
      "瑪莉有隻小綿羊",
      "小星星"
    ],
    "clue": "英國傳統童謠，「倫敦鐵橋垮下來，垮下來，垮下來，倫敦鐵橋垮下來，就要垮下來」。"
  },
  {
    "id": "kids_18",
    "tag": "童謠兒歌",
    "title": "王老先生有塊地",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=9wOp20L2t54",
    "youtubeId": "9wOp20L2t54",
    "startTime": 0,
    "duration": 60,
    "options": [
      "王老先生有塊地",
      "瑪莉有隻小綿羊",
      "倫敦鐵橋垮下來",
      "拔蘿蔔"
    ],
    "clue": "「王老先生有塊地呀，咿呀咿呀呦，他在田邊養小鴨呀，咿呀咿呀呦，呱呱」。"
  },
  {
    "id": "kids_19",
    "tag": "童謠兒歌",
    "title": "瑪莉有隻小綿羊",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=3ans1AEVaVY",
    "youtubeId": "3ans1AEVaVY",
    "startTime": 0,
    "duration": 60,
    "options": [
      "瑪莉有隻小綿羊",
      "王老先生有塊地",
      "醜小鴨",
      "小蜜蜂"
    ],
    "clue": "「瑪莉有隻小綿羊，小綿羊，小綿羊，牠的毛色白如雪」。"
  },
  {
    "id": "kids_20",
    "tag": "童謠兒歌",
    "title": "醜小鴨",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=cIXEuLMDLy0",
    "youtubeId": "cIXEuLMDLy0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "醜小鴨",
      "大象",
      "造飛機",
      "春神來了"
    ],
    "clue": "「咕咕咕，醜小鴨，呱呱呱，長大變成白天鵝」。"
  },
  {
    "id": "kids_21",
    "tag": "童謠兒歌",
    "title": "小蜜蜂",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=8Eox6Cnlcpk",
    "youtubeId": "8Eox6Cnlcpk",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小蜜蜂",
      "蝴蝶",
      "春神來了",
      "小星星"
    ],
    "clue": "「嗡嗡嗡，嗡嗡嗡，大家一起作工，來匆匆，去匆匆，做工趣味濃」。"
  },
  {
    "id": "kids_22",
    "tag": "童謠兒歌",
    "title": "春神來了",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=WEGJwdIXeL0",
    "youtubeId": "WEGJwdIXeL0",
    "startTime": 0,
    "duration": 60,
    "options": [
      "春神來了",
      "蝴蝶",
      "小蜜蜂",
      "茉莉花"
    ],
    "clue": "「春神來了怎知道？美麗的花兒朵朵開，紅的花綠的草，大地換新袍」。"
  },
  {
    "id": "kids_23",
    "tag": "童謠兒歌",
    "title": "蝴蝶",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=qMc5wSIsYc8",
    "youtubeId": "qMc5wSIsYc8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "蝴蝶",
      "小蜜蜂",
      "春神來了",
      "小毛驢"
    ],
    "clue": "「蝴蝶蝴蝶生的真美麗，頭戴著金絲身穿花花衣，你飛在花叢裡，好像在跳舞」。"
  },
  {
    "id": "kids_24",
    "tag": "童謠兒歌",
    "title": "西北雨直直落",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=rvzZZ9np9DI",
    "youtubeId": "rvzZZ9np9DI",
    "startTime": 0,
    "duration": 60,
    "options": [
      "西北雨直直落",
      "丟丟銅仔",
      "點仔膠",
      "天黑黑要落雨"
    ],
    "clue": "經典台灣本土念謠，「西北雨直直落，鯽仔魚欲娶某，鮕呆兄打鑼鼓」。"
  },
  {
    "id": "kids_25",
    "tag": "童謠兒歌",
    "title": "丟丟銅仔",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=baRAM0RVhn8",
    "youtubeId": "baRAM0RVhn8",
    "startTime": 0,
    "duration": 60,
    "options": [
      "丟丟銅仔",
      "西北雨直直落",
      "點仔膠",
      "火車快飛"
    ],
    "clue": "宜蘭民謠，火車穿過隧道時水滴落在鐵軌上的清脆聲音「火車行到伊都，阿末伊都丟」。"
  },
  {
    "id": "kids_26",
    "tag": "童謠兒歌",
    "title": "點仔膠",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=bIWLCS7EWhI",
    "youtubeId": "bIWLCS7EWhI",
    "startTime": 0,
    "duration": 60,
    "options": [
      "點仔膠",
      "西北雨直直落",
      "丟丟銅仔",
      "虎姑婆"
    ],
    "clue": "「點仔膠，黏著腳，叫阿爸，買豬腳，豬腳箍，滾爛爛，餓鬼囝仔流嘴涎」。"
  },
  {
    "id": "kids_27",
    "tag": "童謠兒歌",
    "title": "虎姑婆",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=7-gk5pO1g-I",
    "youtubeId": "7-gk5pO1g-I",
    "startTime": 0,
    "duration": 60,
    "options": [
      "虎姑婆",
      "泥娃娃",
      "拔蘿蔔",
      "點仔膠"
    ],
    "clue": "台灣傳說改編，「好孩子不要哭，虎姑婆會來咬耳朵」。"
  },
  {
    "id": "kids_28",
    "tag": "童謠兒歌",
    "title": "天黑黑要落雨",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=ZOCqUC9a7wM",
    "youtubeId": "ZOCqUC9a7wM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "天黑黑要落雨",
      "西北雨直直落",
      "拔蘿蔔",
      "丟丟銅仔"
    ],
    "clue": "「天黑黑，要落雨，阿公仔舉鋤頭要掘芋，掘啊掘，掘著一尾旋鰡鼓」。"
  },
  {
    "id": "kids_29",
    "tag": "童謠兒歌",
    "title": "白鷺鷥",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=mh_2JA6sh64",
    "youtubeId": "mh_2JA6sh64",
    "startTime": 0,
    "duration": 60,
    "options": [
      "白鷺鷥",
      "大象",
      "蝴蝶",
      "小蜜蜂"
    ],
    "clue": "「白鷺鷥，車畚箕，車到溝仔墘，跋一倒，抾著二仙錢」。"
  },
  {
    "id": "kids_30",
    "tag": "童謠兒歌",
    "title": "十個印第安小朋友",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=1oUXG01bP0M",
    "youtubeId": "1oUXG01bP0M",
    "startTime": 0,
    "duration": 60,
    "options": [
      "十個印第安小朋友",
      "小星星",
      "頭兒肩膀膝蓋腳",
      "當我們同在一起"
    ],
    "clue": "「一個、兩個、三個印第安，四個、五個、六個印第安，七個、八個、九個印第安，十個印第安小朋友」。"
  },
  {
    "id": "kids_31",
    "tag": "童謠兒歌",
    "title": "刷牙歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=4cOR6Bkc6zQ",
    "youtubeId": "4cOR6Bkc6zQ",
    "startTime": 0,
    "duration": 60,
    "options": [
      "刷牙歌",
      "頭兒肩膀膝蓋腳",
      "洗澡歌",
      "造飛機"
    ],
    "clue": "生活常規養成兒歌，「上上下下，左左右右，前前後後，刷得乾乾淨淨」。"
  },
  {
    "id": "kids_32",
    "tag": "童謠兒歌",
    "title": "握緊雙手又張開",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=BR539vcmTeg",
    "youtubeId": "BR539vcmTeg",
    "startTime": 0,
    "duration": 60,
    "options": [
      "握緊雙手又張開",
      "頭兒肩膀膝蓋腳",
      "當我們同在一起",
      "拔蘿蔔"
    ],
    "clue": "幼兒律動兒歌，「握緊雙手又張開，拍拍手呀放腿上」。"
  },
  {
    "id": "kids_33",
    "tag": "童謠兒歌",
    "title": "跳繩歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=wyRVBKaBW6Y",
    "youtubeId": "wyRVBKaBW6Y",
    "startTime": 0,
    "duration": 60,
    "options": [
      "跳繩歌",
      "點仔膠",
      "拔蘿蔔",
      "捉泥鰍"
    ],
    "clue": "「小皮球，香蕉油，滿地開花二十一，二五六，二五七，二八二九三十一」。"
  },
  {
    "id": "kids_34",
    "tag": "童謠兒歌",
    "title": "生日快樂歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=C0aECv8soHo",
    "youtubeId": "C0aECv8soHo",
    "startTime": 0,
    "duration": 60,
    "options": [
      "生日快樂歌",
      "祝你幸福",
      "新年快樂",
      "當我們同在一起"
    ],
    "clue": "全世界傳唱率最高的慶祝歌，「祝你生日快樂，祝你生日快樂」。"
  },
  {
    "id": "kids_35",
    "tag": "童謠兒歌",
    "title": "虹彩妹妹",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=RrRaf0jcNgw",
    "youtubeId": "RrRaf0jcNgw",
    "startTime": 0,
    "duration": 60,
    "options": [
      "虹彩妹妹",
      "茉莉花",
      "鳳陽花鼓",
      "康定情歌"
    ],
    "clue": "綏遠民謠改編，「虹彩妹妹嗯哎嗨呦，長得好那麼嗯哎嗨呦」。"
  },
  {
    "id": "kids_36",
    "tag": "童謠兒歌",
    "title": "鳳陽花鼓",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=C6txEhXXkJs",
    "youtubeId": "C6txEhXXkJs",
    "startTime": 0,
    "duration": 60,
    "options": [
      "鳳陽花鼓",
      "虹彩妹妹",
      "茉莉花",
      "康定情歌"
    ],
    "clue": "「左手鑼，右手鼓，手拿著鑼鼓來唱歌，別的歌兒我也不會唱，只會唱個鳳陽歌」。"
  },
  {
    "id": "kids_37",
    "tag": "童謠兒歌",
    "title": "康定情歌",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=K6VhJlESchM",
    "youtubeId": "K6VhJlESchM",
    "startTime": 0,
    "duration": 60,
    "options": [
      "康定情歌",
      "鳳陽花鼓",
      "茉莉花",
      "拔蘿蔔"
    ],
    "clue": "「跑馬溜溜的山上，一朵溜溜的雲喲，端端溜溜的照在，康定溜溜的城喲」。"
  },
  {
    "id": "kids_38",
    "tag": "童謠兒歌",
    "title": "大拇指在哪裡",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=BIYea2-WeYA",
    "youtubeId": "BIYea2-WeYA",
    "startTime": 0,
    "duration": 60,
    "options": [
      "大拇指在哪裡",
      "頭兒肩膀膝蓋腳",
      "握緊雙手又張開",
      "刷牙歌"
    ],
    "clue": "「大拇指在哪裡，大拇指在哪裡，我在這裡，我在這裡」。"
  },
  {
    "id": "kids_39",
    "tag": "童謠兒歌",
    "title": "小天使",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=LG_JSMsL9YU",
    "youtubeId": "LG_JSMsL9YU",
    "startTime": 0,
    "duration": 60,
    "options": [
      "小天使",
      "無敵鐵金剛",
      "小甜甜",
      "小蜜蜂"
    ],
    "clue": "《阿爾卑斯山的少女》台灣中文主題曲，「高山上的小木屋，住著一個小女孩」。"
  },
  {
    "id": "kids_40",
    "tag": "童謠兒歌",
    "title": "無敵鐵金剛",
    "artist": "傳統童謠",
    "youtubeUrl": "https://www.youtube.com/watch?v=Kq0SQF12R2Q",
    "youtubeId": "Kq0SQF12R2Q",
    "startTime": 0,
    "duration": 60,
    "options": [
      "無敵鐵金剛",
      "小天使",
      "科學小飛俠",
      "哆啦A夢之歌"
    ],
    "clue": "「無敵鐵金剛，無敵鐵金剛，無敵鐵～金～剛！指揮艇組合！」。"
  }
];

  global.DEFAULT_SONG_QUIZ_POOL = DEFAULT_SONG_QUIZ_POOL;
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
