// 成語與佳句名言典故專注力選擇題題庫
// 每筆題目均提供：中讀網優先導讀連結、原典全文連結與延伸介紹連結。
(function (global) {
  const poetryRows = `
滿江紅·寫懷|岳飛|宋|八千里路雲和月，三十功名塵與土。
滿江紅·寫懷|岳飛|宋|莫等閒、白了少年頭，空悲切！
定風波·莫聽穿林打葉聲|蘇軾|宋|回首向來蕭瑟處，歸去，也無風雨也無晴。
水調歌頭·明月幾時有|蘇軾|宋|人有悲歡離合，月有陰晴圓缺，此事古難全。
江城子·乙卯正月二十日夜記夢|蘇軾|宋|十年生死兩茫茫，不思量，自難忘。
蝶戀花·佇倚危樓風細細|柳永|宋|衣帶漸寬終不悔，為伊消得人憔悴。
青玉案·元夕|辛棄疾|宋|眾裡尋他千百度。驀然回首，那人卻在，燈火闌珊處。
終南別業|王維|唐|行到水窮處，坐看雲起時。
和子由澠池懷舊|蘇軾|宋|人生到處知何似，應似飛鴻踏雪泥。
念奴嬌·赤壁懷古|蘇軾|宋|大江東去，浪淘盡，千古風流人物。
早發白帝城|李白|唐|兩岸猿聲啼不住，輕舟已過萬重山。
斷句|蘇麟|宋|近水樓台先得月，向陽花木易為春。
遊山西村|陸游|宋|山重水複疑無路，柳暗花明又一村。
題西林壁|蘇軾|宋|不識廬山真面目，只緣身在此山中。
摸魚兒·雁丘詞|元好問|金|問世間，情為何物，直教生死相許？
無題·昨夜星辰昨夜風|李商隱|唐|身無彩鳳雙飛翼，心有靈犀一點通。
離思五首·其四|元稹|唐|曾經滄海難為水，除卻巫山不是雲。
鵲橋仙·纖雲弄巧|秦觀|宋|兩情若是久長時，又豈在朝朝暮暮。
相思|王維|唐|紅豆生南國，春來發幾枝。願君多采擷，此物最相思。
無題·相見時難別亦難|李商隱|唐|春蠶到死絲方盡，蠟炬成灰淚始乾。
月夜憶舍弟|杜甫|唐|露從今夜白，月是故鄉明。
登樂遊原|李商隱|唐|夕陽無限好，只是近黃昏。
虞美人·春花秋月何時了|李煜|南唐|春花秋月何時了？往事知多少。
虞美人·春花秋月何時了|李煜|南唐|雕欄玉砌應猶在，只是朱顏改。
九月九日憶山東兄弟|王維|唐|獨在異鄉為異客，每逢佳節倍思親。
代悲白頭翁|劉希夷|唐|年年歲歲花相似，歲歲年年人不同。
天淨沙·秋思|馬致遠|元|枯藤老樹昏鴉，小橋流水人家，古道西風瘦馬。
黃鶴樓|崔顥|唐|日暮鄉關何處是？煙波江上使人愁。
滕王閣序|王勃|唐|落霞與孤鶩齊飛，秋水共長天一色。
楓橋夜泊|張繼|唐|姑蘇城外寒山寺，夜半鐘聲到客船。
琵琶行|白居易|唐|同是天涯淪落人，相逢何必曾相識！
送杜少府之任蜀州|王勃|唐|海內存知己，天涯若比鄰。
白雪歌送武判官歸京|岑參|唐|忽如一夜春風來，千樹萬樹梨花開。
登鸛雀樓|王之渙|唐|欲窮千里目，更上一層樓。
賦得古原草送別|白居易|唐|野火燒不盡，春風吹又生。
靜夜思|李白|唐|舉頭望明月，低頭思故鄉。
遊子吟|孟郊|唐|慈母手中線，遊子身上衣。
憫農二首·其二|李紳|唐|誰知盤中飱，粒粒皆辛苦。
黃鶴樓|崔顥|唐|晴川歷歷漢陽樹，芳草萋萋鸚鵡洲。
水調歌頭·明月幾時有|蘇軾|宋|但願人長久，千里共嬋娟。
相見歡·無言獨上西樓|李煜|南唐|剪不斷，理還亂，是離愁。
中庸|子思|先秦|好學近乎知，力行近乎仁，知恥近乎勇。
中庸|子思|先秦|凡事豫則立，不豫則廢。
中庸|子思|先秦|擇善固執。
易經·乾卦|周文王|先秦|上九：亢龍有悔。
易經·乾卦|周文王|先秦|初九：潛龍勿用。
易經·乾卦|周文王|先秦|九五：飛龍在天，利見大人。`.trim().split('\n').map((line) => {
    const [title, author, dynasty, quote] = line.split('|')
    return { title, author, dynasty, quote, label: `${author}－〈${title}〉` }
  })

  const idiomRows = `
完璧歸趙|藺相如|《戰國策·趙策》|藺相如奉命把和氏璧完整帶回趙國。
負荊請罪|廉頗|《史記·廉頗藺相如列傳》|廉頗背著荊條向藺相如請罪。
紙上談兵|趙括|《史記·廉頗藺相如列傳》|趙括只會談論兵法，實戰卻失敗。
圍魏救趙|孫臏|《史記·孫子吳起列傳》|孫臏攻魏都以解趙國之圍。
臥薪嘗膽|勾踐|《史記·越王勾踐世家》|勾踐忍辱復國，以苦勵志。
一鼓作氣|曹劌|《左傳·莊公十年》|曹劌主張趁士氣最盛時進攻。
退避三舍|晉文公|《左傳·僖公二十三年》|晉文公為守信而退兵三舍。
東山再起|謝安|《晉書·謝安傳》|謝安隱居東山後再度出仕。
指鹿為馬|趙高|《史記·秦始皇本紀》|趙高以鹿稱馬試探群臣。
破釜沉舟|項羽|《史記·項羽本紀》|項羽破鍋沉船以示決一死戰。
背水一戰|韓信|《史記·淮陰侯列傳》|韓信背靠河水布陣，逼軍死戰。
四面楚歌|項羽|《史記·項羽本紀》|項羽被楚歌包圍，軍心潰散。
約法三章|劉邦|《史記·高祖本紀》|劉邦入關後與百姓約定三條法令。
暗度陳倉|韓信|《史記·高祖本紀》|漢軍明修棧道，暗中出兵陳倉。
鴻門宴|項羽、劉邦|《史記·項羽本紀》|項羽宴請劉邦，范增圖謀除之未果。
樂不思蜀|劉禪|《三國志·蜀書·後主傳》|劉禪在魏國不思念故國蜀漢。
三顧茅廬|劉備|《三國志·蜀書·諸葛亮傳》|劉備三次拜訪諸葛亮。
草船借箭|諸葛亮|《三國演義》|諸葛亮借濃霧草船取得箭矢。
望梅止渴|曹操|《世說新語·假譎》|曹操以梅子故事鼓舞士兵前進。
鞠躬盡瘁|諸葛亮|《後出師表》|諸葛亮為蜀漢盡力至死。
刮目相看|呂蒙|《三國志·吳書·呂蒙傳》|呂蒙勤學後使魯肅另眼相看。
胸有成竹|文與可|《文與可畫篔簹谷偃竹記》|文與可畫竹前已成竹於胸。
入木三分|王羲之|《書斷》|王羲之書寫的筆力滲入木板三分。
東施效顰|東施|《莊子·天運》|東施模仿西施皺眉反而更難看。
邯鄲學步|壽陵少年|《莊子·秋水》|少年學邯鄲步法，最後連原步法也忘了。
井底之蛙|井蛙|《莊子·秋水》|井蛙受限井口，見識狹小。
守株待兔|宋人農夫|《韓非子·五蠹》|農夫守著樹樁等待兔子再撞死。
刻舟求劍|楚人|《呂氏春秋·察今》|楚人在船上刻記號尋找掉入水中的劍。
掩耳盜鈴|盜鈴者|《呂氏春秋·自知》|偷鈴者摀住耳朵，以為別人聽不見。
畫蛇添足|楚國舍人|《戰國策·齊策》|畫蛇比賽時有人多畫腳而失酒。
亡羊補牢|牧羊人|《戰國策·楚策》|羊失後修補羊圈，仍不算晚。
杯弓蛇影|樂廣|《晉書·樂廣傳》|客人把杯中弓影誤認為蛇而生病。
狐假虎威|狐狸|《戰國策·楚策》|狐狸借老虎威勢嚇退百獸。
買櫝還珠|鄭人|《韓非子·外儲說左上》|買者只要華麗盒子，退還珍珠。
南轅北轍|魏王|《戰國策·魏策》|想到南方卻駕車往北走。
破鏡重圓|徐德言|《本事詩·情感》|徐德言與公主以破鏡為記，終能重逢。
盲人摸象|眾盲人|《大般涅槃經》|眾盲各摸象一部而各執一見。
毛遂自薦|毛遂|《史記·平原君虞卿列傳》|毛遂主動請纓隨平原君出使。
程門立雪|楊時、游酢|《宋史·楊時傳》|二人冒雪在程頤門外等候請益。
鑿壁偷光|匡衡|《西京雜記》|匡衡鑿牆借鄰家燈光讀書。
懸梁刺股|孫敬、蘇秦|《太平御覽》|二人以懸髮與刺股自勵讀書。
高山流水|伯牙、子期|《列子·湯問》|伯牙琴音由鍾子期聽懂。
伯樂相馬|伯樂|《韓非子·說林上》|伯樂善於辨識千里馬。
班門弄斧|魯班|《王氏之言》|在魯班門前賣弄斧技，比喻不自量力。
螳臂當車|螳螂|《莊子·人間世》|螳螂舉臂想阻擋車輪。
濫竽充數|南郭先生|《韓非子·內儲說上》|南郭先生混在樂隊中湊數。
世外桃源|陶淵明|《桃花源記》|漁人發現與世隔絕的理想村落。
不恥下問|孔圉|《論語·公冶長》|孔圉不以向不如自己者請教為恥。
出類拔萃|孔子|《孟子·公孫丑上》|孟子稱孔子出於同類而高於群眾。
一鳴驚人|楚莊王|《韓非子·喻老》|楚莊王以三年不鳴後一鳴驚人自比。
亢龍有悔|周文王|《易經·乾卦》|龍飛得過高而有悔恨，比喻居高位而不知進退。
潛龍勿用|周文王|《易經·乾卦》|龍潛伏在深水不施展作為，比喻隱忍蓄勢不可妄動。
飛龍在天|周文王|《易經·乾卦》|巨龍騰飛在天空，比喻帝王在位或事業達巔峰。`.trim().split('\n').map((line) => {
    const [idiom, person, origin, story] = line.split('|')
    return { idiom, person, origin, story, label: `${person}－${idiom}` }
  })

  function hash(text) {
    let value = 0
    for (let i = 0; i < text.length; i++) value = ((value << 5) - value) + text.charCodeAt(i) | 0
    return Math.abs(value)
  }

  function stableOptions(correct, candidates, seed) {
    const seen = new Set([correct])
    const distractors = candidates
      .filter((item) => item !== correct && !seen.has(item))
      .sort((a, b) => (hash(`${seed}:${a}`) - hash(`${seed}:${b}`)))
      .slice(0, 3)
    const options = [correct, ...distractors]
    return options.sort((a, b) => hash(`${seed}:option:${a}`) - hash(`${seed}:option:${b}`))
  }

  function linksFor(keyword, original, readcDirectUrl) {
    const readcSearch = `https://readc.info/?s=${encodeURIComponent(keyword)}`
    return {
      readcKeyword: keyword,
      readcUrl: readcDirectUrl || readcSearch,
      fullTextUrl: `https://zh.wikisource.org/w/index.php?search=${encodeURIComponent(original)}&title=Special%3ASearch`,
      introUrl: `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(keyword)}&title=Special%3ASearch`
    }
  }

  const poetryLabels = poetryRows.map((item) => item.label)
  const poetryAuthors = [...new Set(poetryRows.map((item) => item.author))]
  const idiomPeople = [...new Set(idiomRows.map((item) => item.person))]
  const personPromptOverrides = {
    '東施效顰': '有人盲目模仿西施皺眉，結果反而更難看；典故主角是？',
    '毛遂自薦': '平原君的一名食客主動請纓，隨使團出使；典故主角是？',
    '伯樂相馬': '古人善於辨識千里馬，後用以比喻善於發掘人才者；典故主角是？',
    '亢龍有悔': '「亢龍有悔」出自《易經·乾卦》，傳統記載《易經》六十四卦卦爻辭作者是？',
    '潛龍勿用': '「潛龍勿用」出自《易經·乾卦》，傳統記載《易經》六十四卦卦爻辭作者是？',
    '飛龍在天': '「飛龍在天」出自《易經·乾卦》，傳統記載《易經》六十四卦卦爻辭作者是？'
  }
  const idiomOrigins = [...new Set(idiomRows.map((item) => item.origin))]
  const pool = []

  poetryRows.forEach((item, index) => {
    const workSearchTitle = item.title.split('·')[0]
    const reference = linksFor(workSearchTitle, workSearchTitle, item.title === '將進酒' ? 'https://readc.info/poem/drink/' : '')
    const sourceOptions = stableOptions(item.label, poetryLabels, `poetry-source-${index}`)
    pool.push({
      id: `poetry-source-${index + 1}`,
      category: '名句典故',
      prompt: `「${item.quote}」是出自？`,
      options: sourceOptions,
      correctOption: item.label,
      explanation: `這句出自${item.dynasty}代${item.author}〈${item.title}〉。`,
      work: `${item.author}〈${item.title}〉`,
      quote: item.quote,
      reference
    })
    pool.push({
      id: `poetry-author-${index + 1}`,
      category: '名句典故',
      prompt: `「${item.quote}」的作者是？`,
      options: stableOptions(item.author, poetryAuthors, `poetry-author-${index}`),
      correctOption: item.author,
      explanation: `「${item.quote}」出自${item.dynasty}代${item.author}〈${item.title}〉。`,
      work: `${item.author}〈${item.title}〉`,
      quote: item.quote,
      reference
    })
  })

  idiomRows.forEach((item, index) => {
    const reference = linksFor(item.idiom, item.origin)
    pool.push({
      id: `idiom-person-${index + 1}`,
      category: '成語典故',
      prompt: personPromptOverrides[item.idiom] || `成語「${item.idiom}」的典故主角是？`,
      options: stableOptions(item.person, idiomPeople, `idiom-person-${index}`),
      correctOption: item.person,
      explanation: `${item.story}典故常見出處為${item.origin}。`,
      work: `${item.idiom}典故`,
      quote: item.story,
      reference
    })
    pool.push({
      id: `idiom-origin-${index + 1}`,
      category: '成語典故',
      prompt: `成語「${item.idiom}」最常見的典故出處是？`,
      options: stableOptions(item.origin, idiomOrigins, `idiom-origin-${index}`),
      correctOption: item.origin,
      explanation: `${item.idiom}：${item.story}`, 
      work: `${item.idiom}典故`,
      quote: item.story,
      reference
    })
  })

  const quizPool = pool.slice(0, 200)
  global.CLASSICS_QUIZ_POOL = Object.freeze(quizPool)
  global.createClassicsQuizQuestions = function createClassicsQuizQuestions(count, customPool = null) {
    const activePool = (customPool && Array.isArray(customPool) && customPool.length > 0)
      ? customPool
      : ((global.focusQB && typeof global.focusQB.getPool === 'function') ? global.focusQB.getPool('classicsQuiz') : quizPool);
    
    // Normalize custom items so they have correctOption and reference
    const normalized = activePool.map((item, idx) => {
      const workSearchTitle = (item.title || item.work || '').split('·')[0];
      const correctOption = item.correctOption || item.answer;
      const options = item.options || [correctOption, '李白', '杜甫', '蘇軾'];
      const reference = item.reference || {
        readcKeyword: workSearchTitle,
        readcUrl: item.links?.sinoreading || `https://www.google.com/search?q=${encodeURIComponent(workSearchTitle + ' 中讀網')}`,
        fullTextUrl: item.links?.wikisource || `https://zh.wikisource.org/wiki/${encodeURIComponent(workSearchTitle)}`,
        introUrl: item.links?.wikipedia || `https://zh.wikipedia.org/wiki/${encodeURIComponent(workSearchTitle)}`
      };
      return {
        id: item.id || `custom-classics-${idx + 1}`,
        category: item.category || '成語與佳句名言典故',
        prompt: item.prompt || `「${item.quote || item.title}」的作者／出處是？`,
        options,
        correctOption,
        explanation: item.explanation || item.fullPoem || `正解為：${correctOption}`,
        work: item.work || item.title || '',
        quote: item.quote || item.title || '',
        reference
      };
    });

    const amount = Math.max(1, Math.min(normalized.length, Number(count) || 5));
    const shuffled = [...normalized];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, amount);
  }
})(window)
