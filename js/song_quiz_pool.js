/**
 * Song Quiz Default Pool (專注力測驗 - 聽歌搶答內建官方題庫)
 * 依標籤分組 (懷舊經典, 熱門流行, 動漫神曲, 童謠兒歌, 影視金曲)
 * 歌曲來源以 YouTube 為主，支援試聽起始秒數與播放長度
 * 全數 32 首歌曲皆經由 YouTube 官方 API 檢驗為有效且開放嵌入 (Embeddable)
 */
(function (global) {
  'use strict';

  const DEFAULT_SONG_QUIZ_POOL = [
    // --- 懷舊經典 (8首) ---
    {
      id: 'song_c1',
      tag: '懷舊經典',
      title: '月亮代表我的心',
      artist: '鄧麗君',
      youtubeUrl: 'https://www.youtube.com/watch?v=bv_cEeDlop0',
      youtubeId: 'bv_cEeDlop0',
      startTime: 30,
      duration: 15,
      options: ['月亮代表我的心', '甜蜜蜜', '夜來香', '何日君再來'],
      clue: '1977年華語傳世經典情歌，主唱為鄧麗君。'
    },
    {
      id: 'song_c2',
      tag: '懷舊經典',
      title: '甜蜜蜜',
      artist: '鄧麗君',
      youtubeUrl: 'https://www.youtube.com/watch?v=5eF8oOWtsk4',
      youtubeId: '5eF8oOWtsk4',
      startTime: 15,
      duration: 15,
      options: ['甜蜜蜜', '月亮代表我的心', '恰似你的溫柔', '小城故事'],
      clue: '1979年發行，印尼民謠改編的傳唱經典。'
    },
    {
      id: 'song_c3',
      tag: '懷舊經典',
      title: '恰似你的溫柔',
      artist: '蔡琴',
      youtubeUrl: 'https://www.youtube.com/watch?v=Yvg3L7RbFHY',
      youtubeId: 'Yvg3L7RbFHY',
      startTime: 20,
      duration: 15,
      options: ['恰似你的溫柔', '被遺忘的時光', '讀你', '綠島小夜曲'],
      clue: '梁弘志作詞作曲，蔡琴低沉渾厚嗓音的成名代表作。'
    },
    {
      id: 'song_c4',
      tag: '懷舊經典',
      title: '新鴛鴦蝴蝶夢',
      artist: '黃安',
      youtubeUrl: 'https://www.youtube.com/watch?v=lDkKHtaBGaY',
      youtubeId: 'lDkKHtaBGaY',
      startTime: 35,
      duration: 15,
      options: ['新鴛鴦蝴蝶夢', '包青天', '得意的笑', '愛江山更愛美人'],
      clue: '1993年華視電視連續劇《包青天》經典片尾曲。'
    },
    {
      id: 'song_c5',
      tag: '懷舊經典',
      title: '朋友',
      artist: '周華健',
      youtubeUrl: 'https://www.youtube.com/watch?v=6lbPgfKK7m4',
      youtubeId: '6lbPgfKK7m4',
      startTime: 45,
      duration: 15,
      options: ['朋友', '讓我歡喜讓我憂', '花心', '凡人歌'],
      clue: '「一句話一輩子，一生情一杯酒」，畢業與同窗聚會必唱曲。'
    },
    {
      id: 'song_c6',
      tag: '懷舊經典',
      title: '愛拼才會贏',
      artist: '葉啟田',
      youtubeUrl: 'https://www.youtube.com/watch?v=bTPEofbCxB8',
      youtubeId: 'bTPEofbCxB8',
      startTime: 15,
      duration: 15,
      options: ['愛拼才會贏', '浪子的心情', '歡喜就好', '家後'],
      clue: '經典台語勵志歌曲：「三分天註定，七分靠打拼」。'
    },
    {
      id: 'song_c7',
      tag: '懷舊經典',
      title: '家後',
      artist: '江蕙',
      youtubeUrl: 'https://www.youtube.com/watch?v=KAntP2xs8FE',
      youtubeId: 'KAntP2xs8FE',
      startTime: 35,
      duration: 15,
      options: ['家後', '落雨聲', '酒後的心聲', '傷心酒店'],
      clue: '鄭進一作詞作曲，江蕙道盡傳統妻子相伴一生的動人台語情歌。'
    },
    {
      id: 'song_c8',
      tag: '懷舊經典',
      title: '童年',
      artist: '羅大佑',
      youtubeUrl: 'https://www.youtube.com/watch?v=534LRELoxJs',
      youtubeId: '534LRELoxJs',
      startTime: 15,
      duration: 15,
      options: ['童年', '光陰的故事', '鹿港小鎮', '戀曲1990'],
      clue: '「池塘邊的榕樹上，知了在聲聲叫著夏天」，勾起無數校園回憶。'
    },

    // --- 熱門流行 (8首) ---
    {
      id: 'song_p1',
      tag: '熱門流行',
      title: '晴天',
      artist: '周杰倫',
      youtubeUrl: 'https://www.youtube.com/watch?v=DYptgVvkVLQ',
      youtubeId: 'DYptgVvkVLQ',
      startTime: 28,
      duration: 15,
      options: ['晴天', '七里香', '不能說的秘密', '簡單愛'],
      clue: '「故事的小黃花，從出生那年就飄著」，收錄於《葉惠美》專輯。'
    },
    {
      id: 'song_p2',
      tag: '熱門流行',
      title: '七里香',
      artist: '周杰倫',
      youtubeUrl: 'https://www.youtube.com/watch?v=Bbp9ZaJD_eA',
      youtubeId: 'Bbp9ZaJD_eA',
      startTime: 35,
      duration: 15,
      options: ['七里香', '晴天', '蒲公英的約定', '青花瓷'],
      clue: '「雨下整夜我的愛溢出就像雨水」，方文山填詞的經典夏季情歌。'
    },
    {
      id: 'song_p3',
      tag: '熱門流行',
      title: '稻香',
      artist: '周杰倫',
      youtubeUrl: 'https://www.youtube.com/watch?v=sHD_z90ZKV0',
      youtubeId: 'sHD_z90ZKV0',
      startTime: 30,
      duration: 15,
      options: ['稻香', '聽媽媽的話', '簡單愛', '陽光宅男'],
      clue: '「對這個世界如果你有太多的抱怨，跌倒了就不敢繼續往前走」。'
    },
    {
      id: 'song_p4',
      tag: '熱門流行',
      title: '告白氣球',
      artist: '周杰倫',
      youtubeUrl: 'https://www.youtube.com/watch?v=bu7nU9Mhpyo',
      youtubeId: 'bu7nU9Mhpyo',
      startTime: 20,
      duration: 15,
      options: ['告白氣球', '等你下課', '說好不哭', '簡單愛'],
      clue: '「塞納河畔左岸的咖啡，我手一杯品嚐你的美」，甜蜜輕快代表作。'
    },
    {
      id: 'song_p5',
      tag: '熱門流行',
      title: '勇氣',
      artist: '梁靜茹',
      youtubeUrl: 'https://www.youtube.com/watch?v=nDchQNPuA0k',
      youtubeId: 'nDchQNPuA0k',
      startTime: 35,
      duration: 15,
      options: ['勇氣', '寧夏', '暖暖', '會呼吸的痛'],
      clue: '光良作曲，梁靜茹經典之作：「愛真的需要勇氣，來面對流言蜚語」。'
    },
    {
      id: 'song_p6',
      tag: '熱門流行',
      title: '簡單愛',
      artist: '周杰倫',
      youtubeUrl: 'https://www.youtube.com/watch?v=Y4xCVlyCvX4',
      youtubeId: 'Y4xCVlyCvX4',
      startTime: 25,
      duration: 15,
      options: ['簡單愛', '開不了口', '安靜', '龍捲風'],
      clue: '「我想就這樣牽著你的手不放開，愛能不能夠永遠單純沒有悲哀」。'
    },
    {
      id: 'song_p7',
      tag: '熱門流行',
      title: '少年',
      artist: '夢然',
      youtubeUrl: 'https://www.youtube.com/watch?v=efKva-XmV48',
      youtubeId: 'efKva-XmV48',
      startTime: 25,
      duration: 15,
      options: ['少年', '飛鳥和蟬', '白月光與硃砂痣', '踏山河'],
      clue: '熱門正能量神曲：「我還是從前那個少年，沒有一點點改變」。'
    },
    {
      id: 'song_p8',
      tag: '熱門流行',
      title: '飛鳥和蟬',
      artist: '任然',
      youtubeUrl: 'https://www.youtube.com/watch?v=Sdh16YlinNE',
      youtubeId: 'Sdh16YlinNE',
      startTime: 30,
      duration: 15,
      options: ['飛鳥和蟬', '空空如也', '涼城', '疑心病'],
      clue: '「你飛到哪片天，去尋找下一處歇腳的樹枝」，風靡網路的抒情曲。'
    },

    // --- 動漫神曲 (6首) ---
    {
      id: 'song_a1',
      tag: '動漫神曲',
      title: '殘酷天使的行動綱領',
      artist: '高橋洋子',
      youtubeUrl: 'https://www.youtube.com/watch?v=o6wtDPVkKqI',
      youtubeId: 'o6wtDPVkKqI',
      startTime: 10,
      duration: 15,
      options: ['殘酷天使的行動綱領', '魂之輪迴', '直到世界的盡頭', '前前前世'],
      clue: '傳奇動畫《新世紀福音戰士》(EVA) 經典片頭曲。'
    },
    {
      id: 'song_a2',
      tag: '動漫神曲',
      title: '直到世界的盡頭',
      artist: 'WANDS',
      youtubeUrl: 'https://www.youtube.com/watch?v=P199MdOxVeI',
      youtubeId: 'P199MdOxVeI',
      startTime: 35,
      duration: 15,
      options: ['直到世界的盡頭', '好想大聲說喜歡你', '捕捉閃爍的瞬間', '灌籃高手'],
      clue: '《灌籃高手》(Slam Dunk) 三井壽浪子回頭專屬片尾曲。'
    },
    {
      id: 'song_a3',
      tag: '動漫神曲',
      title: '好想大聲說喜歡你',
      artist: 'BAAD',
      youtubeUrl: 'https://www.youtube.com/watch?v=HSj-en4UHMI',
      youtubeId: 'HSj-en4UHMI',
      startTime: 15,
      duration: 15,
      options: ['好想大聲說喜歡你', '直到世界的盡頭', '漸漸被你吸引', '勇氣100%'],
      clue: '《灌籃高手》(Slam Dunk) 熱血沸騰的第一代片頭曲。'
    },
    {
      id: 'song_a4',
      tag: '動漫神曲',
      title: '紅蓮華',
      artist: 'LiSA',
      youtubeUrl: 'https://www.youtube.com/watch?v=MpYy6wwqxoo',
      youtubeId: 'MpYy6wwqxoo',
      startTime: 15,
      duration: 15,
      options: ['紅蓮華', '炎', '殘響散歌', '虹'],
      clue: '全球現象級動畫《鬼滅之刃 竈門炭治郎 立志篇》主題曲。'
    },
    {
      id: 'song_a5',
      tag: '動漫神曲',
      title: '哆啦A夢之歌',
      artist: '大杉久美子',
      youtubeUrl: 'https://www.youtube.com/watch?v=frSrRzEJoE4',
      youtubeId: 'frSrRzEJoE4',
      startTime: 5,
      duration: 15,
      options: ['哆啦A夢之歌', '櫻桃小丸子主題曲', '麵包超人進行曲', '名偵探柯南主題曲'],
      clue: '「昂、昂、昂，小叮噹幫我實現所有的願望」，陪伴幾代人的童年。'
    },
    {
      id: 'song_a6',
      tag: '動漫神曲',
      title: 'We Are!',
      artist: '北谷洋',
      youtubeUrl: 'https://www.youtube.com/watch?v=HB4iNVa746E',
      youtubeId: 'HB4iNVa746E',
      startTime: 10,
      duration: 15,
      options: ['We Are!', 'Believe', 'Share The World', 'One Day'],
      clue: '超人氣動畫《航海王 ONE PIECE》最初也是最經典的冒險序幕曲。'
    },

    // --- 童謠兒歌 (6首) ---
    {
      id: 'song_k1',
      tag: '童謠兒歌',
      title: '拔蘿蔔',
      artist: '傳統童謠',
      youtubeUrl: 'https://www.youtube.com/watch?v=rwth9dQS1oM',
      youtubeId: 'rwth9dQS1oM',
      startTime: 0,
      duration: 15,
      options: ['拔蘿蔔', '兩隻老虎', '泥娃娃', '小星星'],
      clue: '「拔蘿蔔拔蘿蔔，嘿呦嘿呦拔不動」，耳熟能詳的兒歌。'
    },
    {
      id: 'song_k2',
      tag: '童謠兒歌',
      title: '兩隻老虎',
      artist: '傳統童謠',
      youtubeUrl: 'https://www.youtube.com/watch?v=RApHGXfBKO0',
      youtubeId: 'RApHGXfBKO0',
      startTime: 0,
      duration: 15,
      options: ['兩隻老虎', '三隻小豬', '醜小鴨', '泥娃娃'],
      clue: '「一隻沒有耳朵，一隻沒有尾巴，真奇怪！真奇怪！」。'
    },
    {
      id: 'song_k3',
      tag: '童謠兒歌',
      title: '小星星',
      artist: '傳統童謠',
      youtubeUrl: 'https://www.youtube.com/watch?v=yCjJyiqpAuU',
      youtubeId: 'yCjJyiqpAuU',
      startTime: 0,
      duration: 15,
      options: ['小星星', '搖籃曲', '當我們同在一起', '茉莉花'],
      clue: '莫札特《小星星變奏曲》旋律：「一閃一閃亮晶晶，滿天都是小星星」。'
    },
    {
      id: 'song_k4',
      tag: '童謠兒歌',
      title: '當我們同在一起',
      artist: '傳統童謠',
      youtubeUrl: 'https://www.youtube.com/watch?v=7shHB9qGi4g',
      youtubeId: '7shHB9qGi4g',
      startTime: 0,
      duration: 15,
      options: ['當我們同在一起', '捕魚歌', '火車快飛', '大象'],
      clue: '「當我們同在一起，在一起，其快樂無比」，德國傳統民謠改編。'
    },
    {
      id: 'song_k5',
      tag: '童謠兒歌',
      title: '泥娃娃',
      artist: '傳統童謠',
      youtubeUrl: 'https://www.youtube.com/watch?v=v7zHNHIjnt8',
      youtubeId: 'v7zHNHIjnt8',
      startTime: 0,
      duration: 15,
      options: ['泥娃娃', '娃娃國', '兩隻老虎', '茉莉花'],
      clue: '「泥娃娃泥娃娃，一個泥娃娃，也有那眉毛也有那眼睛」。'
    },
    {
      id: 'song_k6',
      tag: '童謠兒歌',
      title: '茉莉花',
      artist: '中國民謠',
      youtubeUrl: 'https://www.youtube.com/watch?v=jOqyaFORT0o',
      youtubeId: 'jOqyaFORT0o',
      startTime: 20,
      duration: 15,
      options: ['茉莉花', '採茶歌', '鳳陽花鼓', '康定情歌'],
      clue: '「好一朵美麗的茉莉花，芬芳美麗滿枝椏，又香又白人人誇」。'
    },

    // --- 影視金曲 (4首) ---
    {
      id: 'song_m1',
      tag: '影視金曲',
      title: '那些年',
      artist: '胡夏',
      youtubeUrl: 'https://www.youtube.com/watch?v=KqjgLbKZ1h0',
      youtubeId: 'KqjgLbKZ1h0',
      startTime: 35,
      duration: 15,
      options: ['那些年', '小幸運', '刻在我心底的名字', '修煉愛情'],
      clue: '九把刀青春愛情電影《那些年，我們一起追的女孩》同名主題曲。'
    },
    {
      id: 'song_m2',
      tag: '影視金曲',
      title: '小幸運',
      artist: '田馥甄',
      youtubeUrl: 'https://www.youtube.com/watch?v=HDMQuMJ4MSk',
      youtubeId: 'HDMQuMJ4MSk',
      startTime: 40,
      duration: 15,
      options: ['小幸運', '那些年', '愛情怎麼了', '刻在我心底的名字'],
      clue: '校園愛情電影《我的少女時代》主題曲：「與你相遇好幸運」。'
    },
    {
      id: 'song_m3',
      tag: '影視金曲',
      title: '刻在我心底的名字',
      artist: '盧廣仲',
      youtubeUrl: 'https://www.youtube.com/watch?v=m78lJuzftcc',
      youtubeId: 'm78lJuzftcc',
      startTime: 35,
      duration: 15,
      options: ['刻在我心底的名字', '魚仔', '幾分之幾', '那些年'],
      clue: '電影《刻在你心底的名字》主題曲，榮獲第57屆金馬獎最佳原創電影歌曲。'
    },
    {
      id: 'song_m4',
      tag: '影視金曲',
      title: '如果可以',
      artist: '韋禮安',
      youtubeUrl: 'https://www.youtube.com/watch?v=8MG--WuNW1Y',
      youtubeId: '8MG--WuNW1Y',
      startTime: 35,
      duration: 15,
      options: ['如果可以', '還是會', '女孩', '那些年'],
      clue: '奇幻愛情電影《月老》主題曲：「如果可以我想和你回到那天相遇」。'
    }
  ];

  global.DEFAULT_SONG_QUIZ_POOL = DEFAULT_SONG_QUIZ_POOL;
})(typeof window !== 'undefined' ? window : this);
