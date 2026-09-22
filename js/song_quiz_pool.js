/**
 * Song Quiz Default Pool (專注力測驗 - 聽歌搶答內建官方題庫)
 * 分類包含：古典音樂 (20首)、台灣五年級 (20首)、台灣六年級 (20首)、台灣七年級 (20首)、台灣八年級 (20首)、動漫神曲 (6首)、童謠兒歌 (6首)
 * 全數 112 首歌曲皆經由 YouTube 官方 API (oEmbed) 檢驗為有效且開放嵌入播放
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
  }
];

  global.DEFAULT_SONG_QUIZ_POOL = DEFAULT_SONG_QUIZ_POOL;
})(typeof window !== 'undefined' ? window : this);
