
(function(){
  const PATCH_VERSION = '20260421-v14-funmax';
  const OLD_RENDER = window.renderApp;
  const DATA13 = window.GAOKAO_V13_DATA || { corpus: [] };
  const WRITING_PROMPTS = (typeof DATA !== 'undefined' && Array.isArray(DATA.writingPrompts)) ? DATA.writingPrompts : [];
  const STORY_GAMES = [
  {
    "id": "kidnap-labour",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "进阶",
    "title": "劫匪审问局",
    "category": "写作机制",
    "scene": "assets/games/scene_robber_labour.svg",
    "type": "input",
    "prompt": "漫画里的劫匪说：\n“我又不是天生要抢，是谁把我卷成了只认钱和绩效的工具？”\n请用作文语言回答他为什么会走到这一步。",
    "placeholder": "最好写出：核心机制 + 原因链 + 做法目的",
    "rubric": [
      {
        "label": "命中核心机制",
        "any": [
          "劳动异化"
        ]
      },
      {
        "label": "命中原因链",
        "any": [
          "绩效",
          "KPI",
          "工具",
          "价值单一",
          "内卷",
          "分工",
          "优绩主义"
        ]
      },
      {
        "label": "命中做法目的",
        "any": [
          "打破单一价值",
          "价值锚点",
          "兴趣",
          "摆脱工具化",
          "拓展价值"
        ]
      }
    ],
    "passScore": 2,
    "explanation": "这类情境要优先判断为“劳动异化”。当绩效、KPI、单一成功标准和工具理性不断加压，人会被压成只剩“有用/没用”的工具，关系也会功利化。作文里不能只喊大词，最好把“为什么会这样”与“要如何摆脱”一起写出来。",
    "coach": "先别只说“社会有问题”，先把“绩效/KPI/工具化”的链条说完整。",
    "note": "这是漫画化课堂情境，用来帮助学生记住机制，不是现实暴力模拟。"
  },
  {
    "id": "kpi-cage",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "基础",
    "title": "KPI牢笼局",
    "category": "写作机制",
    "scene": "assets/games/scene_kpi_cage.svg",
    "type": "choice",
    "prompt": "某班一切都被“排名、分数、绩效”统治，同学之间只剩互相利用。第一判断最该落在哪个机制？",
    "options": [
      "劳动异化：人被单一评价和工具理性压成了分数机器",
      "算法规训：只要一上网就会被推荐内容洗脑",
      "个体化：只是因为大家都不爱说话",
      "纯属个人品德问题，和结构没有关系"
    ],
    "answer": 0,
    "explanation": "看到“绩效、排名、把人当工具、价值单一”这类词，起笔优先切“劳动异化”最稳。先说机制，再说它如何让关系功利化、精神紧绷，最后再补做法。",
    "coach": "题目里只要出现‘工具人 / 分数机器 / KPI压顶’，先想劳动异化。"
  },
  {
    "id": "algo-court",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "基础",
    "title": "热搜法庭",
    "category": "写作机制",
    "scene": "assets/games/scene_algorithm_court.svg",
    "type": "choice",
    "prompt": "同一条热搜下面，所有人越刷越愤怒、越看越确信自己对。最该优先说出的机制是：",
    "options": [
      "算法规训 / 信息茧房",
      "单纯因为年轻人脾气差",
      "只是修辞手法用错了",
      "全部归因于个人道德败坏"
    ],
    "answer": 0,
    "explanation": "先抓算法规训最稳：平台以个性化推荐持续投喂同温层内容，削弱跨处境理解，催化情绪对立和观点极化。",
    "coach": "别停在“大家都很冲动”，继续追问是谁把注意力结构塑造成这样的。"
  },
  {
    "id": "cyber-family",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "进阶",
    "title": "赛博亲属站",
    "category": "写作机制",
    "scene": "assets/games/scene_cyber_family.svg",
    "type": "input",
    "prompt": "学生说：\n“现实亲戚只会问成绩，可赛博爷爷奶奶至少会安慰我。”\n请用作文语言解释：为什么这种‘线上寻亲、线下断亲’会出现？",
    "placeholder": "最好写出：个体化/附近消失 + 原因链 + 重建附近",
    "rubric": [
      {
        "label": "命中核心机制",
        "any": [
          "个体化",
          "附近",
          "附近消失",
          "原子化"
        ]
      },
      {
        "label": "命中原因链",
        "any": [
          "城市化",
          "人口流动",
          "次级群体",
          "断亲",
          "情感需求模块化",
          "稳定支持网络",
          "现实支持网络"
        ]
      },
      {
        "label": "命中做法目的",
        "any": [
          "重建附近",
          "生活秩序",
          "线下连接",
          "现实连接",
          "支持网络"
        ]
      }
    ],
    "passScore": 2,
    "explanation": "这类材料优先切“个体化 / 附近消失”。高流动生活削弱稳定支持网络，现实关系变薄，人的情感需求被模块化，才会把安慰外包给赛博亲属。写作时最后最好推到‘重建附近’。",
    "coach": "不要只写‘亲戚不好’，要继续追问为什么现实支持网络会变薄。"
  },
  {
    "id": "nearby-island",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "基础",
    "title": "楼道失联案",
    "category": "写作机制",
    "scene": "assets/games/scene_neighborhood_void.svg",
    "type": "choice",
    "prompt": "大家住得很近，却彼此不认识；有人线上高强度围观宏大叙事，线下却没有稳定支持网络。最该优先概括为：",
    "options": [
      "个体化 / 附近的消失",
      "纯粹是大家懒得社交",
      "只需要多背几篇范文",
      "这是词义误用问题"
    ],
    "answer": 0,
    "explanation": "这类材料优先从个体化与“附近的消失”切入：人口流动、生活加速与原子化处境，削弱了现实支持网络与次级群体。",
    "coach": "作文里要继续往“重建附近、重建生活秩序”上推。"
  },
  {
    "id": "first-cut",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "提升",
    "title": "作文第一刀",
    "category": "写作机制",
    "scene": "assets/games/scene_first_cut.svg",
    "type": "choice",
    "prompt": "材料关键词是“热搜、推荐、越刷越怒、信息茧房、观点极化”。写作时第一刀最稳切在哪里？",
    "options": [
      "算法规训：先把平台如何塑造注意力和情绪结构说清",
      "劳动异化：一上来就只谈KPI和工具理性",
      "个体化：一上来只谈人口流动和楼道陌生化",
      "直接写‘青年要理性’，不必分析机制"
    ],
    "answer": 0,
    "explanation": "面对“平台推荐、信息茧房、情绪对立”类材料，优先切算法规训最稳。先把结构说清，再谈协作、审美、注意力主权等做法。",
    "coach": "第一刀要贴材料关键词，不能拿顺手的大词乱切。"
  },
  {
    "id": "sequence-labour-first",
    "family": "story",
    "familyLabel": "剧情闯关",
    "difficulty": "提升",
    "title": "顺序排兵局",
    "category": "写作机制",
    "scene": "assets/games/scene_sequence_map.svg",
    "type": "choice",
    "prompt": "材料核心是“KPI、内卷、把人当工具”，同时提到短视频加剧情绪对立、线下关系变薄。分论点顺序最稳的一项是：",
    "options": [
      "先劳动异化，再算法规训，最后重建附近/修复现实连接",
      "先个体化，再算法规训，最后再回头谈KPI",
      "先算法规训，再古诗文背诵，最后随便升华",
      "三种机制都不必分析，只写个人努力"
    ],
    "answer": 0,
    "explanation": "当材料首先落在“KPI、绩效、把人当工具、价值单一”时，优先切劳动异化；随后再补算法规训怎样放大情绪与冲突，最后落到重建附近或拓展价值，递进会更稳。",
    "coach": "排序要看材料主问题，不是把三个机制机械并排。"
  }
];
  const LANGUAGE_GAMES = [
  {
    "id": "grammar-surgery",
    "family": "language",
    "familyLabel": "语言游乐场",
    "difficulty": "基础",
    "title": "病句手术台",
    "category": "语言文字运用",
    "scene": "assets/games/scene_grammar_surgery.svg",
    "type": "choice",
    "prompt": "哪一句没有语病？",
    "options": [
      "通过建立错因标签，使学生能够更快定位问题。",
      "是否先做问答题，是减少现代文误判的有效办法。",
      "这套训练不只强调答案，更强调方法是否能迁移。",
      "在逐段概括的基础上判断人物、情节、主题，是文学类文本较稳的路径之一。"
    ],
    "answer": 3,
    "explanation": "D 正确。A 主语残缺；B 两面对一面；C “强调……是否……”表达不稳。病句题最稳的起手永远是：先找“谁做什么”。",
    "coach": "语言题不是听起来顺就行，先还原句子主干。"
  },
  {
    "id": "punct-bomb",
    "family": "language",
    "familyLabel": "语言游乐场",
    "difficulty": "基础",
    "title": "标点拆弹局",
    "category": "语言文字运用",
    "scene": "assets/games/scene_punctuation_bomb.svg",
    "type": "choice",
    "prompt": "下列句子中分号使用最恰当的一项是：",
    "options": [
      "要把材料看懂；先抓对象、范围、逻辑、态度四个点。",
      "现代文阅读Ⅰ先做问答题；做完后再回头核对选择题。",
      "标点要先看功能；再看停顿长短。",
      "他今天整理了错题、规则卡、写作提纲；复盘笔记也补全了。"
    ],
    "answer": 3,
    "explanation": "D 最稳。前一分句内部已有顿号列举，两并列分句之间用分号，层级最清楚。",
    "coach": "标点题不要只看停顿长短，要看层级和包孕关系。"
  },
  {
    "id": "coherence-bridge",
    "family": "language",
    "familyLabel": "语言游乐场",
    "difficulty": "基础",
    "title": "衔接搭桥局",
    "category": "语言文字运用",
    "scene": "assets/games/scene_coherence_bridge.svg",
    "type": "choice",
    "prompt": "把下列句子填入横线处，最恰当的一项是：\n真正有效的复盘，不是把答案再抄一遍，________，最后回到同类题验证新规则。",
    "options": [
      "而是先命名错误，再提炼规则",
      "而是提炼规则，再去命名错误",
      "所以应该先看答案，再直接做同类题",
      "并且只要记住结论就足够了"
    ],
    "answer": 0,
    "explanation": "后文紧接“最后回到同类题验证新规则”，说明横线处应先写“命名错误”与“提炼规则”两个前置动作，A 的顺序最顺。",
    "coach": "衔接题先看动作链：先、再、最后。"
  },
  {
    "id": "rhetoric-masquerade",
    "family": "language",
    "familyLabel": "语言游乐场",
    "difficulty": "提升",
    "title": "修辞伪装舞会",
    "category": "语言文字运用",
    "scene": "assets/games/scene_rhetoric_masquerade.svg",
    "type": "choice",
    "prompt": "句子“我像一颗被KPI拧紧的螺丝钉”中，“螺丝钉”的主要修辞作用是：",
    "options": [
      "借喻：直接借“螺丝钉”写人被工具化",
      "借代：用相关事物代替本体，没有比喻色彩",
      "用典：借历史故事表达现实处境",
      "引用：直接引用前人名句来证明观点"
    ],
    "answer": 0,
    "explanation": "这里不是简单代称，而是把“人”直接说成“螺丝钉”，突出被工具化、可替换的处境，更接近借喻。",
    "coach": "分不清借喻和借代时，先问：这里有没有明显的“像成了另一个东西”的比喻感。"
  },
  {
    "id": "idiom-maze",
    "family": "language",
    "familyLabel": "语言游乐场",
    "difficulty": "基础",
    "title": "成语迷宫",
    "category": "语言文字运用",
    "scene": "assets/games/scene_idiom_maze.svg",
    "type": "choice",
    "prompt": "为了从根上解决“只抄答案不复盘”的问题，下列成语最贴切的一项是：",
    "options": [
      "釜底抽薪",
      "背水一战",
      "东山再起",
      "亡羊补牢"
    ],
    "answer": 0,
    "explanation": "“釜底抽薪”比喻从根本上解决问题，最适合形容直接追问误判原因、重建规则。其余成语都偏离了“从根上解决”的意思。",
    "coach": "成语题先逐字翻译，再看语境对象。"
  },
  {
    "id": "word-pitch",
    "family": "language",
    "familyLabel": "语言游乐场",
    "difficulty": "基础",
    "title": "词语快投台",
    "category": "语言文字运用",
    "scene": "assets/games/scene_word_pitch.svg",
    "type": "choice",
    "prompt": "依次填入下列横线处的词语，最恰当的一项是：\n①科学家在月背探测中不断________新的地下结构信息。\n②写作时不能只会空喊观点，还要把观点准确________出来。",
    "options": [
      "发明 / 表演",
      "发现 / 表达",
      "发表 / 表明",
      "发扬 / 表述"
    ],
    "answer": 1,
    "explanation": "“发现”对应原本客观存在但此前未被认识的内容；“表达”强调把自己的意思说出来。词语辨析先看动作对象，再看语境搭配。",
    "coach": "别只看脸熟，先问这个动作到底是‘创造、找到、说出’里的哪一种。"
  }
];
  const BOSS_GAMES = [
  {
    "id": "opening-er",
    "family": "boss",
    "familyLabel": "写作Boss",
    "difficulty": "提升",
    "title": "开头急救室",
    "category": "写作组织",
    "scene": "assets/games/scene_opening_er.svg",
    "type": "choice",
    "prompt": "材料涉及“短视频刷屏、热搜吵架、KPI焦虑”。下列哪一段开头最稳？",
    "options": [
      "现代社会问题很多，我们应当努力成长，成为更好的自己。",
      "表面看是热搜争吵和焦虑蔓延，深层却是算法规训与劳动异化交叠：前者塑造注意力，后者压缩人的价值，于是写作不能只劝冷静，更要回到机制与做法。",
      "古人早就说过‘修身齐家治国平天下’，所以今天也不用分析平台和绩效。",
      "只要少玩手机、多做题，一切问题就会自然消失。"
    ],
    "answer": 1,
    "explanation": "最稳的开头要做到三件事：先点出现实困境，再诊断深层机制，最后把后文的论证目的交代出来。B 完整体现了这种写法。",
    "coach": "好开头不是空喊态度，而是把“困境—机制—做法目的”一起带出来。"
  },
  {
    "id": "structure-boss",
    "family": "boss",
    "familyLabel": "写作Boss",
    "difficulty": "进阶",
    "title": "结构导航Boss",
    "category": "写作组织",
    "scene": "assets/games/scene_structure_boss.svg",
    "type": "choice",
    "prompt": "材料写“断亲、赛博亲属、现实支持网络变薄”。下列结构最稳的一项是：",
    "options": [
      "先个体化 / 附近消失，再写算法如何把情感需求模块化，最后补劳动异化怎样压缩真实交往空间，并落到重建附近",
      "先劳动异化，再直接夸赞网络万能，不必解释现实关系为什么变薄",
      "先背名言，再平铺三个分论点，谁先谁后都无所谓",
      "只写年轻人太脆弱，不必追问社会结构"
    ],
    "answer": 0,
    "explanation": "这类材料首先指向个体化与“附近的消失”，随后可以继续分析算法规训与劳动异化怎样加重这种处境，最后落到“重建附近”，递进会更稳。",
    "coach": "结构排序要跟着材料主矛盾走，不是把三个机制机械并排。"
  },
  {
    "id": "reflection-valve",
    "family": "boss",
    "familyLabel": "写作Boss",
    "difficulty": "提升",
    "title": "结尾反思阀",
    "category": "写作组织",
    "scene": "assets/games/scene_reflection_valve.svg",
    "type": "choice",
    "prompt": "一篇文章已经论证“要重建附近”。下列哪一句结尾最有反身性、最不容易写死？",
    "options": [
      "所以只要回到线下，一切问题都会彻底解决。",
      "因此我们只要完全拒绝互联网，就能重新获得意义感。",
      "当然，线下附近也可能被商业化，线上连接也未必天然虚假；真正重要的是让关系重新承接具体生活，而不是把任何一种连接绝对化。",
      "总之，附近最重要，别的都不重要。"
    ],
    "answer": 2,
    "explanation": "好结尾要有“反身性提醒”：既不把线下浪漫化，也不把线上妖魔化，而是把真正的问题落在‘关系能否承接生活’上。",
    "coach": "结尾不是喊口号，而是给前文装上“限位器”。"
  },
  {
    "id": "title-workshop",
    "family": "boss",
    "familyLabel": "写作Boss",
    "difficulty": "基础",
    "title": "标题工坊",
    "category": "写作组织",
    "scene": "assets/games/scene_title_workshop.svg",
    "type": "choice",
    "prompt": "如果材料核心是“高连接时代里的断亲、漂泊和情感模块化”，下列标题最稳的一项是：",
    "options": [
      "今天心情一般",
      "重建附近，是为了重新安放自己",
      "努力学习最重要",
      "一切问题都来自手机"
    ],
    "answer": 1,
    "explanation": "好标题既要贴材料，又要带出论证方向。‘重建附近，是为了重新安放自己’既点出问题，也暗示解决路径与价值落点。",
    "coach": "标题最好既能扣材料，又能悄悄亮出你的主张。"
  }
];
  const MECHANISMS = [
  {
    "id": "labor",
    "title": "劳动异化",
    "cue": "先手关键词：KPI、绩效、工具人、价值单一、内卷",
    "cause": "优绩主义、精密分工与单一评价把人压进工具理性。",
    "effect": "关系功利化、精神压力增大、人的价值被压缩成‘有用/没用’。",
    "move": "写作时可落到：打破单一价值评价，以兴趣/意义感重新锚定个体。"
  },
  {
    "id": "algo",
    "title": "算法规训",
    "cue": "先手关键词：推荐、热搜、信息茧房、越刷越怒、观点极化",
    "cause": "平台推荐和数据画像不断塑造人的注意力结构与信息入口。",
    "effect": "情绪激化、理解变窄、协作能力下降，提问和判断也会被外包。",
    "move": "写作时可落到：夺回注意力，提升审美与协作能力，不把判断权交给系统。"
  },
  {
    "id": "nearby",
    "title": "个体化 / 附近消失",
    "cue": "先手关键词：断亲、漂泊、赛博亲属、楼道陌生、现实支持网络变薄",
    "cause": "城市化、人口流动与高流动生活削弱了稳定次级群体和现实支持。",
    "effect": "线下关系原子化，情感需求被模块化，个体更难安放意义感。",
    "move": "写作时可落到：重建附近，重建能承接具体生活的连接和秩序。"
  }
];
  const POSITIVE_LINES = ["命中机制", "这刀切得准", "拿下这一关", "劫匪沉默了", "这波过关"];

  function h(str){
    if(typeof escapeHtml === 'function') return escapeHtml(str);
    return String(str == null ? '' : str).replace(/[&<>"']/g, function(s){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s];
    });
  }
  function saveOnly(){ if(typeof saveState === 'function') saveState(); }
  function saveRender(){ if(typeof saveState === 'function') saveState(); renderApp(); }
  function sampleUnique(list, count){
    const arr = Array.isArray(list) ? list.slice() : [];
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr.slice(0, Math.max(0, Math.min(count, arr.length)));
  }
  function uniqueBy(list, keyFn){
    const seen = new Set();
    const out = [];
    (list || []).forEach(function(item){
      const key = keyFn(item);
      if(seen.has(key)) return;
      seen.add(key);
      out.push(item);
    });
    return out;
  }
  function allGames(){ return STORY_GAMES.concat(LANGUAGE_GAMES, BOSS_GAMES); }
  function gameById(id){ return allGames().find(function(item){ return item.id === id; }) || null; }
  function plans(){
    if(DATA13 && Array.isArray(DATA13.corpus) && DATA13.corpus.length) return DATA13.corpus;
    if(window.classroomData && Array.isArray(window.classroomData.plans)) return window.classroomData.plans;
    return [];
  }
  function findText(id){
    const list = plans();
    return list.find(function(item){ return (item.slug || item.id || item.title) === id; }) || null;
  }
  function mechanismById(id){ return MECHANISMS.find(function(item){ return item.id === id; }) || null; }
  function mechanismByTitle(title){ return MECHANISMS.find(function(item){ return item.title === title; }) || null; }
  function modules(){ return ['all'].concat(uniqueBy(plans(), function(item){ return item.module || '未分组'; }).map(function(item){ return item.module || '未分组'; })); }
  function genres(){ return ['all'].concat(uniqueBy(plans(), function(item){ return item.genre || '未分类'; }).map(function(item){ return item.genre || '未分类'; })); }

  function ensureStyle(){
    if(document.getElementById('gaokao-v14-fun-style')) return;
    const style = document.createElement('style');
    style.id = 'gaokao-v14-fun-style';
    style.textContent = `
      .v14-tab-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
      .v14-tab{border:1px solid var(--line);background:#fff;color:var(--text);padding:10px 14px;border-radius:999px;cursor:pointer;font:inherit}
      .v14-tab.active{background:var(--primary);border-color:var(--primary);color:#fff}
      .v14-grid-tight{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
      .v14-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
      .v14-grid-main{display:grid;grid-template-columns:1.05fr .95fr;gap:20px}
      @media(max-width:1120px){.v14-grid-tight,.v14-grid-3,.v14-grid-main{grid-template-columns:1fr}}
      .v14-card{border:1px solid var(--line);background:#fff;border-radius:22px;padding:16px;box-shadow:var(--shadow)}
      .v14-badges{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .v14-pass{display:inline-flex;align-items:center;padding:7px 12px;border-radius:999px;border:1px solid #d8e8fb;background:#eef5ff;color:var(--primary);font-size:12px;font-weight:700}
      .v14-pass.ok{background:#ecfdf3;border-color:#93e2ae;color:#1d5b35}
      .v14-scene{display:block;width:100%;height:auto;border-radius:18px;border:1px solid var(--line);background:#fff;margin-top:14px}
      .v14-options{display:flex;flex-direction:column;gap:10px;margin-top:10px}
      .v14-option{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px 14px;cursor:pointer;font:inherit;color:inherit}
      .v14-option.correct{background:var(--good);border-color:var(--good-line)}
      .v14-option.wrong{background:var(--bad);border-color:var(--bad-line)}
      .v14-option:hover{background:#f8fbff}
      .v14-option-code{width:30px;height:30px;border-radius:999px;border:1px solid #cfd8e3;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
      .v14-note{font-size:12px;line-height:1.75;color:var(--muted)}
      .v14-chip{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#f8fbff;border:1px solid #d8e8fb;color:var(--primary);font-size:12px;font-weight:600}
      .v14-chip.warn{background:#fff8e6;border-color:#f0c95d;color:#8a5a00}
      .v14-history{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
      .v14-history-item{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:#f8fafc;border:1px solid var(--line);font-size:12px;color:var(--muted)}
      .v14-number-wrap{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
      .v14-number-ball{width:56px;height:56px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#123a64;color:#fff;font-weight:700;font-size:20px;box-shadow:0 8px 20px rgba(18,58,100,.18)}
      .v14-score-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px}
      @media(max-width:980px){.v14-score-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      .v14-score-grid .stat{background:#fff;border:1px solid var(--line);border-radius:20px;padding:14px;text-align:center}
      .v14-score-grid .stat strong{display:block;font-size:24px}
      .v14-mini-title{font-size:13px;color:var(--muted);margin-bottom:8px}
      .v14-pack-item{border:1px solid var(--line);background:#fff;border-radius:18px;padding:14px}
      .v14-pack-item h4{margin:0 0 8px;font-size:16px}
      .v14-highlight{border:1px solid #d8e8fb;background:#eef5ff;border-radius:18px;padding:14px}
      .v14-dashboard-card{margin-top:18px}
      .v14-float-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
      .v14-kv{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      @media(max-width:980px){.v14-kv{grid-template-columns:1fr}}
      .v14-kv .block{height:100%}
      .v14-pack-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}
      @media(max-width:1120px){.v14-pack-grid{grid-template-columns:1fr}}
      .v14-missing{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
      .v14-missing span{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#fff8e6;border:1px solid #f0c95d;color:#8a5a00;font-size:12px}
      .v14-tab-panel{margin-top:18px}
      .v14-hero-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
    `;
    document.head.appendChild(style);
  }

  function ensureV14(){
    if(!state.v14 || typeof state.v14 !== 'object') state.v14 = {};
    const v = state.v14;
    if(typeof v.gameTab !== 'string') v.gameTab = 'story';
    if(!v.records || typeof v.records !== 'object') v.records = {};
    if(!v.inputs || typeof v.inputs !== 'object') v.inputs = {};
    if(typeof v.randomMin !== 'number' || !isFinite(v.randomMin)) v.randomMin = 1;
    if(typeof v.randomMax !== 'number' || !isFinite(v.randomMax)) v.randomMax = 60;
    if(typeof v.randomCount !== 'number' || !isFinite(v.randomCount)) v.randomCount = 1;
    if(typeof v.randomExclude !== 'string') v.randomExclude = '';
    if(typeof v.randomNoRepeat !== 'boolean') v.randomNoRepeat = false;
    if(!Array.isArray(v.remainingPool)) v.remainingPool = [];
    if(!Array.isArray(v.lastNumbers)) v.lastNumbers = [];
    if(!Array.isArray(v.drawHistory)) v.drawHistory = [];
    if(typeof v.textModule !== 'string') v.textModule = 'all';
    if(typeof v.textGenre !== 'string') v.textGenre = 'all';
    if(typeof v.textCount !== 'number' || !isFinite(v.textCount)) v.textCount = 1;
    if(typeof v.maskAuthor !== 'boolean') v.maskAuthor = false;
    if(!Array.isArray(v.lastTexts)) v.lastTexts = [];
    if(typeof v.lastMechanismId !== 'string') v.lastMechanismId = '';
    if(typeof v.dailyMode !== 'string') v.dailyMode = 'balanced';
    if(!v.dailyPack || typeof v.dailyPack !== 'object') v.dailyPack = null;
    if(typeof v.focusGameId !== 'string') v.focusGameId = '';
  }

  function optionLetter(index){ return String.fromCharCode(65 + index); }

  function setField(field, value){
    ensureV14();
    const numberFields = { randomMin:1, randomMax:60, randomCount:1, textCount:1 };
    if(Object.prototype.hasOwnProperty.call(numberFields, field)){
      const raw = Number(value);
      state.v14[field] = isFinite(raw) ? Math.max(1, Math.floor(raw)) : numberFields[field];
    } else if(field === 'randomNoRepeat' || field === 'maskAuthor'){
      state.v14[field] = !!value;
      if(field === 'randomNoRepeat' && !value) state.v14.remainingPool = [];
    } else {
      state.v14[field] = value;
    }
    saveRender();
  }

  function setGameTab(tab){ ensureV14(); state.v14.gameTab = tab; saveRender(); }

  function historyPush(kind, text){
    ensureV14();
    state.v14.drawHistory.unshift({
      kind: kind,
      text: text,
      at: new Date().toLocaleTimeString('zh-CN', { hour12:false })
    });
    state.v14.drawHistory = state.v14.drawHistory.slice(0, 10);
  }

  function parseExcludeList(value, min, max){
    return Array.from(new Set(String(value || '')
      .split(/[^0-9]+/)
      .map(function(item){ return Number(item); })
      .filter(function(num){ return isFinite(num) && num >= min && num <= max; })));
  }

  function buildPool(min, max, excludeSet){
    const out = [];
    for(let i = min; i <= max; i += 1){
      if(excludeSet.has(i)) continue;
      out.push(i);
    }
    return out;
  }

  function drawNumbers(){
    ensureV14();
    const min = Math.max(1, Number(state.v14.randomMin) || 1);
    const max = Math.max(min, Number(state.v14.randomMax) || 60);
    const count = Math.max(1, Number(state.v14.randomCount) || 1);
    const exclude = new Set(parseExcludeList(state.v14.randomExclude, min, max));
    let pool = [];
    if(state.v14.randomNoRepeat){
      const currentPool = (state.v14.remainingPool || []).filter(function(num){ return num >= min && num <= max && !exclude.has(num); });
      pool = currentPool.length ? currentPool : buildPool(min, max, exclude);
      if(pool.length < count){
        alert('不重复号码池剩余数量不够，请先重置号码池或减少抽取个数。');
        return;
      }
      state.v14.remainingPool = pool.slice();
    } else {
      pool = buildPool(min, max, exclude);
      if(pool.length < count){
        alert('当前范围减去排除号码后，已经不够抽这么多了。');
        return;
      }
    }
    const picks = sampleUnique(pool, count).sort(function(a,b){ return a-b; });
    state.v14.lastNumbers = picks;
    if(state.v14.randomNoRepeat){
      const picked = new Set(picks);
      state.v14.remainingPool = pool.filter(function(num){ return !picked.has(num); });
    }
    historyPush('抽号', picks.join('、'));
    saveRender();
  }

  function resetNumberPool(){
    ensureV14();
    state.v14.remainingPool = [];
    state.v14.lastNumbers = [];
    saveRender();
  }

  function filteredTextPool(){
    ensureV14();
    return plans().filter(function(item){
      const mod = item.module || '未分组';
      const genre = item.genre || '未分类';
      if(state.v14.textModule !== 'all' && mod !== state.v14.textModule) return false;
      if(state.v14.textGenre !== 'all' && genre !== state.v14.textGenre) return false;
      return true;
    });
  }

  function drawTexts(){
    ensureV14();
    const list = filteredTextPool();
    if(!list.length){
      alert('当前筛选条件下没有可抽文本。');
      return;
    }
    const count = Math.max(1, Math.min(list.length, Number(state.v14.textCount) || 1));
    const picks = sampleUnique(list, count).map(function(item){ return item.slug || item.id || item.title; });
    state.v14.lastTexts = picks;
    historyPush('抽篇', picks.map(function(id){ const text = findText(id); return text ? text.title : id; }).join(' / '));
    saveRender();
  }

  function drawMechanism(){
    ensureV14();
    const pick = sampleUnique(MECHANISMS, 1)[0];
    state.v14.lastMechanismId = pick ? pick.id : '';
    if(pick) historyPush('抽机制', pick.title);
    saveRender();
  }

  function makePack(mode){
    ensureV14();
    const textPool = filteredTextPool();
    if(!textPool.length){
      alert('当前筛选条件下没有可用于生成副本的文本。');
      return;
    }
    const storyCount = mode === 'writing' ? 2 : 1;
    const langCount = mode === 'language' ? 2 : 1;
    const storyIds = sampleUnique(STORY_GAMES, storyCount).map(function(item){ return item.id; });
    const languageIds = sampleUnique(LANGUAGE_GAMES, langCount).map(function(item){ return item.id; });
    const boss = sampleUnique(BOSS_GAMES, 1)[0];
    const mechanism = sampleUnique(MECHANISMS, 1)[0];
    const text = sampleUnique(textPool, 1)[0];
    const writing = WRITING_PROMPTS.length ? sampleUnique(WRITING_PROMPTS, 1)[0] : null;
    let guide = '先做 1 个剧情机制题，再做 1 个语言题，最后打一只写作 Boss。';
    if(mode === 'writing') guide = '写作模式：优先打 2 个剧情机制题，再做 1 只写作 Boss，并结合抽出的文本和材料口头搭结构。';
    if(mode === 'language') guide = '语言模式：优先打 2 个语言题，再补 1 个剧情题，练“概念—表达”切换。';
    state.v14.dailyPack = {
      mode: mode,
      createdAt: new Date().toLocaleString('zh-CN', { hour12:false }),
      storyIds: storyIds,
      languageIds: languageIds,
      bossId: boss ? boss.id : '',
      mechanismId: mechanism ? mechanism.id : '',
      textId: text ? (text.slug || text.id || text.title) : '',
      writingId: writing ? writing.id : '',
      guide: guide
    };
    historyPush('副本', (mode === 'balanced' ? '均衡副本' : (mode === 'writing' ? '写作副本' : '语言副本')));
    saveRender();
  }

  function openDailyPack(){
    ensureV14();
    state.v14.gameTab = 'daily';
    state.activeView = 'games';
    saveRender();
  }

  function recordFor(id){
    ensureV14();
    if(!state.v14.records[id]){
      state.v14.records[id] = {
        attempts: 0,
        correct: false,
        choice: null,
        input: '',
        score: 0,
        total: 0,
        matched: [],
        missing: []
      };
    }
    return state.v14.records[id];
  }

  function setGameInput(id, value){
    ensureV14();
    state.v14.inputs[id] = value;
    saveOnly();
  }

  function currentGameInput(id){
    ensureV14();
    return state.v14.inputs[id] || '';
  }

  function normalizeInput(text){
    return String(text || '')
      .replace(/[，。！？；：、“”‘’（）()\[\]{}<>\s]/g, '')
      .replace(/kpi/gi, 'KPI');
  }

  function evaluateInputGame(game, rawText){
    const text = normalizeInput(rawText);
    const rubric = Array.isArray(game.rubric) ? game.rubric : [];
    const matched = [];
    const missing = [];
    rubric.forEach(function(rule){
      const ok = (rule.any || []).some(function(keyword){
        return text.indexOf(String(keyword).replace(/\s+/g,'')) > -1;
      });
      if(ok) matched.push(rule.label);
      else missing.push(rule.label);
    });
    const score = matched.length;
    const total = rubric.length;
    const passScore = Math.max(1, Number(game.passScore) || total);
    return {
      score: score,
      total: total,
      matched: matched,
      missing: missing,
      correct: score >= passScore
    };
  }

  function submitInputGame(id){
    const game = gameById(id);
    if(!game) return;
    const rec = recordFor(id);
    const raw = String(currentGameInput(id) || '').trim();
    const result = evaluateInputGame(game, raw);
    rec.attempts += 1;
    rec.input = raw;
    rec.score = result.score;
    rec.total = result.total;
    rec.matched = result.matched;
    rec.missing = result.missing;
    rec.correct = result.correct;
    saveRender();
  }

  function answerChoiceGame(id, index){
    const game = gameById(id);
    if(!game) return;
    const rec = recordFor(id);
    rec.attempts += 1;
    rec.choice = index;
    rec.correct = index === game.answer;
    saveRender();
  }

  function resetGame(id){
    ensureV14();
    delete state.v14.records[id];
    delete state.v14.inputs[id];
    saveRender();
  }

  function scoreSummary(){
    const all = allGames();
    const recs = state.v14.records || {};
    const totalDone = all.filter(function(game){ return recs[game.id] && recs[game.id].correct; }).length;
    const storyDone = STORY_GAMES.filter(function(game){ return recs[game.id] && recs[game.id].correct; }).length;
    const languageDone = LANGUAGE_GAMES.filter(function(game){ return recs[game.id] && recs[game.id].correct; }).length;
    const bossDone = BOSS_GAMES.filter(function(game){ return recs[game.id] && recs[game.id].correct; }).length;
    return {
      total: all.length,
      totalDone: totalDone,
      storyTotal: STORY_GAMES.length,
      storyDone: storyDone,
      languageTotal: LANGUAGE_GAMES.length,
      languageDone: languageDone,
      bossTotal: BOSS_GAMES.length,
      bossDone: bossDone
    };
  }

  function randomPositive(){ return POSITIVE_LINES[Math.floor(Math.random() * POSITIVE_LINES.length)] || '过关'; }

  function renderInputResult(game, rec){
    if(!rec.attempts) return '';
    return `
      <div class="block ${rec.correct ? 'good' : 'warn'}" style="margin-top:14px">
        <strong>${rec.correct ? randomPositive() : '还差一点'}</strong>
        <div class="preview-box" style="margin-top:8px">你的命中点：${rec.matched && rec.matched.length ? rec.matched.join('、') : '暂无明显命中'}\n推荐解析：${h(game.explanation || '')}</div>
        ${rec.missing && rec.missing.length ? `<div class="v14-missing">${rec.missing.map(function(item){ return `<span>${h(item)}</span>`; }).join('')}</div>` : ''}
        ${game.coach ? `<div class="v14-note" style="margin-top:8px">${h(game.coach)}</div>` : ''}
        ${game.note ? `<div class="v14-note" style="margin-top:6px">${h(game.note)}</div>` : ''}
      </div>`;
  }

  function renderChoiceResult(game, rec){
    if(!rec.attempts) return '';
    return `
      <div class="block ${rec.correct ? 'good' : 'warn'}" style="margin-top:14px">
        <strong>${rec.correct ? randomPositive() : '解析'}</strong>
        <div class="preview-box" style="margin-top:8px">正确答案：${optionLetter(game.answer)}. ${h(game.options[game.answer])}\n${h(game.explanation || '')}</div>
        ${game.coach ? `<div class="v14-note" style="margin-top:8px">${h(game.coach)}</div>` : ''}
        ${game.note ? `<div class="v14-note" style="margin-top:6px">${h(game.note)}</div>` : ''}
      </div>`;
  }

  function renderGameCard(game){
    const rec = recordFor(game.id);
    return `
      <div class="v14-card" id="game-${game.id}">
        <div class="space-between">
          <div class="v14-badges">
            <span class="badge">${h(game.category)}</span>
            <span class="badge">${h(game.difficulty)}</span>
            <span class="badge">${h(game.familyLabel)}</span>
          </div>
          <span class="v14-pass ${rec.correct ? 'ok' : ''}">${rec.correct ? '已通关' : '待挑战'}</span>
        </div>
        <h3 style="margin-top:12px">${h(game.title)}</h3>
        <img class="v14-scene" src="${h(game.scene)}" alt="${h(game.title)}">
        <div class="q-stem" style="font-size:16px;white-space:pre-line">${h(game.prompt)}</div>
        ${game.type === 'input' ? `
          <textarea class="textarea compact" placeholder="${h(game.placeholder || '请输入答案')}" oninput="v14SetGameInput('${game.id}', this.value)">${h(currentGameInput(game.id))}</textarea>
          <div class="row" style="margin-top:12px">
            <button class="btn" onclick="v14SubmitInputGame('${game.id}')">提交答案</button>
            <button class="btn secondary" onclick="v14ResetGame('${game.id}')">重置</button>
          </div>
          ${renderInputResult(game, rec)}
        ` : `
          <div class="v14-options">
            ${game.options.map(function(option, index){
              let cls = 'v14-option';
              if(rec.attempts){
                if(index === game.answer) cls += ' correct';
                else if(index === rec.choice) cls += ' wrong';
              }
              return `
                <button class="${cls}" onclick="v14AnswerChoiceGame('${game.id}', ${index})">
                  <span class="v14-option-code">${optionLetter(index)}</span>
                  <span>${h(option)}</span>
                </button>`;
            }).join('')}
          </div>
          <div class="row" style="margin-top:12px"><button class="btn secondary" onclick="v14ResetGame('${game.id}')">重置</button></div>
          ${renderChoiceResult(game, rec)}
        `}
      </div>`;
  }

  function renderPackCard(pack){
    if(!pack) return `<div class="block warn">还没有生成今日副本，先去“随机抽取”里扭一组，或者直接点下面的按钮。</div>`;
    const text = findText(pack.textId);
    const mechanism = mechanismById(pack.mechanismId);
    const writing = WRITING_PROMPTS.find(function(item){ return item.id === pack.writingId; }) || null;
    return `
      <div class="card">
        <div class="space-between">
          <div>
            <h3>今日副本</h3>
            <div class="subtitle">${h(pack.guide || '')}</div>
          </div>
          <span class="v14-chip">${h(pack.createdAt || '')}</span>
        </div>
        <div class="v14-pack-grid">
          <div class="v14-pack-item">
            <h4>文本</h4>
            <div class="small">${text ? h(text.module || '') : '—'}</div>
            <div style="margin-top:8px;font-weight:700">${text ? h(text.title) : '—'}</div>
            <div class="small" style="margin-top:6px">${text && !state.v14.maskAuthor ? h(text.author || '佚名') : '作者已隐藏'}</div>
          </div>
          <div class="v14-pack-item">
            <h4>机制</h4>
            <div style="font-weight:700">${mechanism ? h(mechanism.title) : '—'}</div>
            <div class="small" style="margin-top:8px">${mechanism ? h(mechanism.cue) : '—'}</div>
          </div>
          <div class="v14-pack-item">
            <h4>材料</h4>
            <div style="font-weight:700">${writing ? h(writing.title || writing.source) : '—'}</div>
            <div class="small" style="margin-top:8px">${writing ? h((writing.pain || '').slice(0, 46)) : '—'}</div>
          </div>
        </div>
        <div class="v14-float-actions">
          <button class="btn" onclick="v14MakePack('${h(pack.mode || 'balanced')}')">重抽这一模式</button>
          <a class="btn secondary" href="./random.html">回随机中心</a>
        </div>
      </div>`;
  }

  function renderGamesHub(){
    ensureStyle();
    ensureV14();
    const score = scoreSummary();
    const pack = state.v14.dailyPack;
    const tabs = [
      { id:'story', label:'剧情闯关' },
      { id:'language', label:'语言游乐场' },
      { id:'boss', label:'写作Boss' },
      { id:'daily', label:'今日副本' }
    ];
    let content = '';
    if(state.v14.gameTab === 'story') content = `<div class="v14-grid-tight">${STORY_GAMES.map(renderGameCard).join('')}</div>`;
    else if(state.v14.gameTab === 'language') content = `<div class="v14-grid-tight">${LANGUAGE_GAMES.map(renderGameCard).join('')}</div>`;
    else if(state.v14.gameTab === 'boss') content = `<div class="v14-grid-tight">${BOSS_GAMES.map(renderGameCard).join('')}</div>`;
    else {
      const storyCards = (pack && pack.storyIds ? pack.storyIds.map(gameById).filter(Boolean) : []);
      const languageCards = (pack && pack.languageIds ? pack.languageIds.map(gameById).filter(Boolean) : []);
      const bossCard = pack && pack.bossId ? gameById(pack.bossId) : null;
      content = `
        ${renderPackCard(pack)}
        <div class="v14-float-actions">
          <button class="btn" onclick="v14MakePack('balanced')">均衡副本</button>
          <button class="btn secondary" onclick="v14MakePack('writing')">写作副本</button>
          <button class="btn secondary" onclick="v14MakePack('language')">语言副本</button>
        </div>
        <div class="v14-tab-panel">
          ${storyCards.length ? `<h3>剧情关卡</h3><div class="v14-grid-tight" style="margin-top:14px">${storyCards.map(renderGameCard).join('')}</div>` : ''}
          ${languageCards.length ? `<h3 style="margin-top:22px">语言关卡</h3><div class="v14-grid-tight" style="margin-top:14px">${languageCards.map(renderGameCard).join('')}</div>` : ''}
          ${bossCard ? `<h3 style="margin-top:22px">Boss 关</h3><div class="v14-grid-tight" style="margin-top:14px">${renderGameCard(bossCard)}</div>` : ''}
        </div>`;
    }
    return `
      ${renderHero('趣味互动游戏：把写作机制和语言文字玩成“能过关”的东西', '这版不再只是几道孤零零的小题，而是整合成“剧情闯关 + 语言游乐场 + 写作 Boss + 今日随机副本”。你点名要的“劫匪回答劳动异化机制”，已经从单关升级成整组机制训练。', [
        '总关卡 ' + score.total + ' 关',
        '剧情 ' + score.storyDone + '/' + score.storyTotal,
        '语言 ' + score.languageDone + '/' + score.languageTotal,
        'Boss ' + score.bossDone + '/' + score.bossTotal
      ])}
      <div class="v14-hero-links">
        <a class="btn" href="./random.html">去随机中心扭副本</a>
        <button class="btn secondary" onclick="v14SetGameTab('daily')">直接看今日副本</button>
      </div>
      <div class="v14-score-grid">
        <div class="stat"><strong>${score.totalDone}</strong><span>已通关</span></div>
        <div class="stat"><strong>${score.total - score.totalDone}</strong><span>待挑战</span></div>
        <div class="stat"><strong>${score.storyTotal}</strong><span>剧情关卡</span></div>
        <div class="stat"><strong>${score.languageTotal + score.bossTotal}</strong><span>语言 + Boss</span></div>
      </div>
      <div class="block warn" style="margin-top:18px">说明：全部画面都是漫画化课堂情境，目标是帮助学生记机制、记路径、记表达，不是现实暴力模拟。</div>
      <div class="v14-tab-row">
        ${tabs.map(function(tab){ return `<button class="v14-tab ${state.v14.gameTab === tab.id ? 'active' : ''}" onclick="v14SetGameTab('${tab.id}')">${tab.label}</button>`; }).join('')}
      </div>
      <div class="v14-tab-panel">${content}</div>`;
  }

  function renderTextList(){
    const list = filteredTextPool();
    if(!list.length) return '<div class="block warn">当前筛选条件下没有文本。</div>';
    return `<ul class="list">${state.v14.lastTexts.map(function(id){
      const text = findText(id);
      if(!text) return '';
      const meta = [text.module || '', state.v14.maskAuthor ? '作者已隐藏' : (text.author || '佚名'), text.genre || ''].filter(Boolean).join(' · ');
      return `<li><strong>${h(text.title)}</strong><br><span class="small">${h(meta)}</span><br><span class="small">${h(text.themeLabel || '')}</span></li>`;
    }).join('') || '<li>还没有抽篇。</li>'}</ul>`;
  }

  function renderMechanismCard(){
    const item = mechanismById(state.v14.lastMechanismId);
    if(!item) return '<div class="block warn">还没抽机制，点一下按钮就会给你一张“先手判断卡”。</div>';
    return `
      <div class="v14-kv">
        <div class="block teal"><strong>${h(item.title)}</strong><div class="preview-box" style="margin-top:8px">${h(item.cue)}</div></div>
        <div class="block"><strong>为什么会这样</strong><div class="preview-box" style="margin-top:8px">${h(item.cause)}</div></div>
        <div class="block good"><strong>写作时怎么落</strong><div class="preview-box" style="margin-top:8px">${h(item.move)}</div></div>
      </div>`;
  }

  function renderRandomHub(){
    ensureStyle();
    ensureV14();
    const pool = filteredTextPool();
    const pack = state.v14.dailyPack;
    const mechanism = mechanismById(state.v14.lastMechanismId);
    const modulesList = modules();
    const genresList = genres();
    return `
      ${renderHero('随机中心：抽号、抽篇、抽机制、扭副本，一页打通', '这版把“随机抽数或者类似功能”彻底做实：不仅能抽号，还能按模块/体裁抽文本、抽写作机制、扭出当天的剧情副本。', [
        '抽号范围 ' + state.v14.randomMin + '-' + state.v14.randomMax,
        '当前文本池 ' + pool.length + ' 篇',
        '抽题方式：课堂可直接点用',
        pack ? ('已有副本 ' + (pack.mode === 'balanced' ? '均衡' : (pack.mode === 'writing' ? '写作' : '语言'))) : '还未生成副本'
      ])}
      <div class="v14-grid-tight">
        <div class="card">
          <h3>高级抽号器</h3>
          <div class="subtitle">支持最小值、最大值、抽取个数、排除号码、不重复号码池。</div>
          <div class="row" style="margin-top:12px">
            <input class="input" style="max-width:120px" type="number" min="1" value="${h(state.v14.randomMin)}" oninput="v14SetField('randomMin', this.value)">
            <input class="input" style="max-width:120px" type="number" min="1" value="${h(state.v14.randomMax)}" oninput="v14SetField('randomMax', this.value)">
            <input class="input" style="max-width:120px" type="number" min="1" value="${h(state.v14.randomCount)}" oninput="v14SetField('randomCount', this.value)">
          </div>
          <div class="row" style="margin-top:12px">
            <input class="input" placeholder="排除号码，如 1,13,26" value="${h(state.v14.randomExclude || '')}" oninput="v14SetField('randomExclude', this.value)">
          </div>
          <div class="row" style="margin-top:12px">
            <label class="v14-chip"><input type="checkbox" ${state.v14.randomNoRepeat ? 'checked' : ''} onchange="v14SetField('randomNoRepeat', this.checked)" style="margin-right:8px">不重复号码池</label>
          </div>
          <div class="v14-float-actions">
            <button class="btn" onclick="v14DrawNumbers()">开始抽号</button>
            <button class="btn secondary" onclick="v14ResetNumberPool()">重置号码池</button>
          </div>
          <div class="v14-number-wrap">${state.v14.lastNumbers.map(function(num){ return `<span class="v14-number-ball">${num}</span>`; }).join('') || '<span class="small">还没抽号。</span>'}</div>
          ${state.v14.randomNoRepeat ? `<div class="small" style="margin-top:10px">剩余不重复号码：${(state.v14.remainingPool || []).length}</div>` : ''}
        </div>

        <div class="card">
          <h3>按模块 / 体裁抽篇</h3>
          <div class="subtitle">可隐藏作者，适合背诵点名、课堂速测、当天复盘对象抽取。</div>
          <div class="row" style="margin-top:12px">
            <select class="input" style="max-width:220px" onchange="v14SetField('textModule', this.value)">
              ${modulesList.map(function(item){ return `<option value="${h(item)}" ${state.v14.textModule === item ? 'selected' : ''}>${h(item === 'all' ? '全部模块' : item)}</option>`; }).join('')}
            </select>
            <select class="input" style="max-width:220px" onchange="v14SetField('textGenre', this.value)">
              ${genresList.map(function(item){ return `<option value="${h(item)}" ${state.v14.textGenre === item ? 'selected' : ''}>${h(item === 'all' ? '全部体裁' : item)}</option>`; }).join('')}
            </select>
            <input class="input" style="max-width:120px" type="number" min="1" value="${h(state.v14.textCount)}" oninput="v14SetField('textCount', this.value)">
          </div>
          <div class="row" style="margin-top:12px">
            <label class="v14-chip"><input type="checkbox" ${state.v14.maskAuthor ? 'checked' : ''} onchange="v14SetField('maskAuthor', this.checked)" style="margin-right:8px">隐藏作者</label>
          </div>
          <div class="v14-float-actions">
            <button class="btn" onclick="v14DrawTexts()">随机抽篇</button>
            <button class="btn secondary" onclick="switchView('coverageplus')">去全量配题</button>
          </div>
          <div style="margin-top:12px">${renderTextList()}</div>
        </div>
      </div>

      <div class="v14-grid-tight" style="margin-top:20px">
        <div class="card">
          <h3>抽写作机制</h3>
          <div class="subtitle">适合课前 30 秒定主刀：先判断是劳动异化、算法规训，还是个体化 / 附近消失。</div>
          <div class="v14-float-actions">
            <button class="btn" onclick="v14DrawMechanism()">抽一张机制卡</button>
            <a class="btn secondary" href="./writing.html">去写作强化</a>
          </div>
          <div style="margin-top:14px">${renderMechanismCard()}</div>
        </div>

        <div class="card">
          <h3>今日副本生成器</h3>
          <div class="subtitle">一键扭出“文本 + 机制 + 互动关卡 + 写作 Boss + 材料”。</div>
          <div class="v14-float-actions">
            <button class="btn" onclick="v14MakePack('balanced')">均衡副本</button>
            <button class="btn secondary" onclick="v14MakePack('writing')">写作副本</button>
            <button class="btn secondary" onclick="v14MakePack('language')">语言副本</button>
          </div>
          ${pack ? `
            <div class="v14-highlight" style="margin-top:14px">
              <strong>${pack.mode === 'balanced' ? '均衡副本' : (pack.mode === 'writing' ? '写作副本' : '语言副本')}</strong>
              <div class="preview-box" style="margin-top:8px">${h(pack.guide || '')}</div>
              <div class="small" style="margin-top:8px">${h(pack.createdAt || '')}</div>
            </div>
            <div class="v14-float-actions">
              <button class="btn" onclick="v14OpenDailyPack()">进入今日副本</button>
              <a class="btn secondary" href="./games.html">只去游戏页</a>
            </div>
          ` : '<div class="block warn" style="margin-top:14px">还没有扭副本，先点上面的按钮。</div>'}
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <div class="space-between">
          <div>
            <h3>最近抽取记录</h3>
            <div class="subtitle">课堂上临时抽号、抽篇、抽机制时，不会一下子丢失。</div>
          </div>
          <button class="pill" onclick="v14ClearHistory()">清空记录</button>
        </div>
        <div class="v14-history">${(state.v14.drawHistory || []).map(function(item){ return `<span class="v14-history-item"><strong>${h(item.kind)}</strong><span>${h(item.text)}</span><span>${h(item.at)}</span></span>`; }).join('') || '<span class="small">还没有抽取记录。</span>'}</div>
      </div>`;
  }

  function clearHistory(){
    ensureV14();
    state.v14.drawHistory = [];
    saveRender();
  }

  function injectDashboardNote(){
    if(state.activeView !== 'dashboard') return;
    const app = document.getElementById('app');
    if(!app || document.getElementById('v14-dashboard-fun-card')) return;
    const card = document.createElement('section');
    card.id = 'v14-dashboard-fun-card';
    card.className = 'card v14-dashboard-card';
    card.innerHTML = `
      <div class="space-between">
        <div>
          <h3>趣味互动层已强化</h3>
          <div class="subtitle">高考系统现在把“随机抽数、随机副本、剧情闯关、语言游乐场、写作 Boss”都接到了一层里，课堂可以直接点用。</div>
        </div>
        <span class="v14-chip">v14 趣味互动版</span>
      </div>
      <div class="v14-float-actions">
        <a class="btn" href="./games.html">去趣味互动游戏</a>
        <a class="btn secondary" href="./random.html">去随机中心</a>
      </div>`;
    app.appendChild(card);
  }

  function maybeScrollToFocusGame(){
    if(!state.v14 || !state.v14.focusGameId) return;
    const target = document.getElementById('game-' + state.v14.focusGameId);
    if(target){
      target.scrollIntoView({ behavior:'smooth', block:'start' });
      state.v14.focusGameId = '';
      saveOnly();
    }
  }

  function renderAppV14(){
    ensureStyle();
    ensureV14();
    VIEW_LABELS.games = '趣味互动游戏';
    VIEW_LABELS.random = '随机中心';
    const view = state.activeView || 'dashboard';
    if(view === 'games' || view === 'random'){
      if(typeof renderSidebar === 'function') renderSidebar();
      const app = document.getElementById('app');
      app.innerHTML = view === 'games' ? renderGamesHub() : renderRandomHub();
      document.body.classList.toggle('focus-mode', !!state.focusMode);
      setTimeout(maybeScrollToFocusGame, 50);
      return;
    }
    OLD_RENDER();
    injectDashboardNote();
  }

  window.v14SetField = setField;
  window.v14DrawNumbers = drawNumbers;
  window.v14ResetNumberPool = resetNumberPool;
  window.v14DrawTexts = drawTexts;
  window.v14DrawMechanism = drawMechanism;
  window.v14MakePack = makePack;
  window.v14OpenDailyPack = openDailyPack;
  window.v14ClearHistory = clearHistory;
  window.v14SetGameTab = setGameTab;
  window.v14SetGameInput = setGameInput;
  window.v14SubmitInputGame = submitInputGame;
  window.v14AnswerChoiceGame = answerChoiceGame;
  window.v14ResetGame = resetGame;

  window.renderApp = renderAppV14;
  renderApp = renderAppV14;
})();
