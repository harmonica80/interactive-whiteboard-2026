// 唐詩宋詞與成語典故專注力選擇題題庫（200 題）
// 每筆題目均提供：中讀網優先導讀連結、原典全文連結與延伸介紹連結。
(function (global) {
  const poetryRows = `
將進酒|李白|唐|天生我材必有用，千金散盡還復來。
靜夜思|李白|唐|舉頭望明月，低頭思故鄉。
早發白帝城|李白|唐|兩岸猿聲啼不住，輕舟已過萬重山。
望廬山瀑布|李白|唐|飛流直下三千尺，疑是銀河落九天。
行路難|李白|唐|長風破浪會有時，直掛雲帆濟滄海。
黃鶴樓送孟浩然之廣陵|李白|唐|孤帆遠影碧山盡，唯見長江天際流。
送友人|李白|唐|浮雲遊子意，落日故人情。
蜀道難|李白|唐|蜀道之難，難於上青天。
春望|杜甫|唐|感時花濺淚，恨別鳥驚心。
登高|杜甫|唐|無邊落木蕭蕭下，不盡長江滾滾來。
絕句|杜甫|唐|兩個黃鸝鳴翠柳，一行白鷺上青天。
望岳|杜甫|唐|會當凌絕頂，一覽眾山小。
茅屋為秋風所破歌|杜甫|唐|安得廣廈千萬間，大庇天下寒士俱歡顏。
聞官軍收河南河北|杜甫|唐|白日放歌須縱酒，青春作伴好還鄉。
鹿柴|王維|唐|空山不見人，但聞人語響。
山居秋暝|王維|唐|明月松間照，清泉石上流。
送元二使安西|王維|唐|勸君更盡一杯酒，西出陽關無故人。
九月九日憶山東兄弟|王維|唐|獨在異鄉為異客，每逢佳節倍思親。
竹里館|王維|唐|深林人不知，明月來相照。
春曉|孟浩然|唐|春眠不覺曉，處處聞啼鳥。
過故人莊|孟浩然|唐|待到重陽日，還來就菊花。
賦得古原草送別|白居易|唐|野火燒不盡，春風吹又生。
琵琶行|白居易|唐|同是天涯淪落人，相逢何必曾相識。
錢塘湖春行|白居易|唐|亂花漸欲迷人眼，淺草才能沒馬蹄。
清明|杜牧|唐|清明時節雨紛紛，路上行人欲斷魂。
山行|杜牧|唐|停車坐愛楓林晚，霜葉紅於二月花。
赤壁|杜牧|唐|東風不與周郎便，銅雀春深鎖二喬。
無題|李商隱|唐|春蠶到死絲方盡，蠟炬成灰淚始乾。
夜雨寄北|李商隱|唐|何當共剪西窗燭，卻話巴山夜雨時。
出塞|王昌齡|唐|但使龍城飛將在，不教胡馬度陰山。
芙蓉樓送辛漸|王昌齡|唐|洛陽親友如相問，一片冰心在玉壺。
白雪歌送武判官歸京|岑參|唐|忽如一夜春風來，千樹萬樹梨花開。
詠柳|賀知章|唐|不知細葉誰裁出，二月春風似剪刀。
烏衣巷|劉禹錫|唐|舊時王謝堂前燕，飛入尋常百姓家。
酬樂天揚州初逢席上見贈|劉禹錫|唐|沉舟側畔千帆過，病樹前頭萬木春。
早春呈水部張十八員外|韓愈|唐|天街小雨潤如酥，草色遙看近卻無。
水調歌頭·明月幾時有|蘇軾|宋|但願人長久，千里共嬋娟。
念奴嬌·赤壁懷古|蘇軾|宋|大江東去，浪淘盡，千古風流人物。
江城子·密州出獵|蘇軾|宋|會挽雕弓如滿月，西北望，射天狼。
定風波·莫聽穿林打葉聲|蘇軾|宋|回首向來蕭瑟處，歸去，也無風雨也無晴。
如夢令·常記溪亭日暮|李清照|宋|爭渡，爭渡，驚起一灘鷗鷺。
聲聲慢·尋尋覓覓|李清照|宋|這次第，怎一個愁字了得！
一剪梅·紅藕香殘玉簟秋|李清照|宋|花自飄零水自流，一種相思，兩處閒愁。
武陵春·風住塵香花已盡|李清照|宋|物是人非事事休，欲語淚先流。
青玉案·元夕|辛棄疾|宋|眾裡尋他千百度，驀然回首，那人卻在燈火闌珊處。
破陣子·為陳同甫賦壯詞以寄之|辛棄疾|宋|醉裡挑燈看劍，夢回吹角連營。
西江月·夜行黃沙道中|辛棄疾|宋|稻花香裡說豐年，聽取蛙聲一片。
永遇樂·京口北固亭懷古|辛棄疾|宋|千古江山，英雄無覓孫仲謀處。
滿江紅·寫懷|岳飛|宋|莫等閒，白了少年頭，空悲切。
雨霖鈴·寒蟬淒切|柳永|宋|今宵酒醒何處？楊柳岸，曉風殘月。
望海潮·東南形勝|柳永|宋|有三秋桂子，十里荷花。`.trim().split('\n').map((line) => {
    const [title, author, dynasty, quote] = line.split('|')
    return { title, author, dynasty, quote, label: `${author}－${title}` }
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
一鳴驚人|楚莊王|《韓非子·喻老》|楚莊王以三年不鳴後一鳴驚人自比。`.trim().split('\n').map((line) => {
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
    '伯樂相馬': '古人善於辨識千里馬，後用以比喻善於發掘人才者；典故主角是？'
  }
  const idiomOrigins = [...new Set(idiomRows.map((item) => item.origin))]
  const pool = []

  poetryRows.forEach((item, index) => {
    const workSearchTitle = item.title.split('·')[0]
    const reference = linksFor(workSearchTitle, workSearchTitle, item.title === '將進酒' ? 'https://readc.info/poem/drink/' : '')
    const sourceOptions = stableOptions(item.label, poetryLabels, `poetry-source-${index}`)
    pool.push({
      id: `poetry-source-${index + 1}`,
      category: '唐詩宋詞',
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
      category: '唐詩宋詞',
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
        category: item.category || '唐詩宋詞・成語典故',
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
