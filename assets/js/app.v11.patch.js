
(function(){
  const PATCH_VERSION = 'v11';
  const EXTRA_MEMES = [{"id": "meme-qx", "title": "不积跬步，你还想一步登天？", "tag": "劝学 / 积累类", "related": "适合《劝学》《论语十二章》《师说》等“积累—坚持—成德”导入。", "explain": "先让学生用现代口语解释这句吐槽，再回到“积累、坚持、方法”三件事上。", "usage": "导入 / 方法提醒 / 默写后复盘", "target": "背诵篇目 / 学习观", "src": "assets/memes/meme_qx.svg", "keys": ["劝学", "论语", "师说", "答司马谏议书"]}, {"id": "meme-shishuo-plus", "title": "《师说》社会风气加强版", "tag": "师说 / 风气批评", "related": "适合《师说》与论学类文言文中的“身份焦虑—从师风气”导入。", "explain": "配合“位卑则足羞，官盛则近谀”一起用，先说现实口语，再回原文。", "usage": "导入 / 文意理解 / 社会风气讨论", "target": "《师说》", "src": "assets/memes/meme_shishuo_plus.svg", "keys": ["师说"]}, {"id": "meme-mengyou", "title": "安能摧眉折腰事权贵", "tag": "李白 / 人格自由", "related": "适合《梦游天姥吟留别》《将进酒》等“高压现实—精神反击”导入。", "explain": "先让学生用一句现代话翻译这个情绪，再回到尾句的主旨落点。", "usage": "导入 / 结句主旨 / 人格讨论", "target": "李白类篇目", "src": "assets/memes/meme_mengyou.svg", "keys": ["梦游天姥吟留别", "将进酒"]}, {"id": "meme-pipa-plus", "title": "同是天涯沦落人", "tag": "琵琶行 / 共情", "related": "适合《琵琶行》《声声慢》《项脊轩志》等“情绪共振”导入。", "explain": "用来打开“我为什么会被这一句击中”的共情入口，再回文本证据。", "usage": "导入 / 情感落点 / 共情写作", "target": "身世感与共情篇目", "src": "assets/memes/meme_pipa_plus.svg", "keys": ["琵琶行", "声声慢", "项脊轩志"]}, {"id": "meme-liuguo", "title": "以地事秦，越送越亏", "tag": "六国论 / 史论", "related": "适合《六国论》《过秦论》《五代史伶官传序》等史论文导入。", "explain": "先让学生说清这张图的现实逻辑，再回到“赂秦而力亏”的论证链。", "usage": "导入 / 论证链条 / 史论迁移", "target": "史论文", "src": "assets/memes/meme_liuguo.svg", "keys": ["六国论", "过秦论", "五代史伶官传"]}, {"id": "meme-efanggong", "title": "后人哀之而不鉴之", "tag": "阿房宫赋 / 借古讽今", "related": "适合《阿房宫赋》《桂枝香·金陵怀古》等“借古警今”导入。", "explain": "先让学生说“为什么后人老是重复前人的坑”，再回到赋的讽喻锋芒。", "usage": "导入 / 结尾升华 / 现实映照", "target": "借古讽今篇目", "src": "assets/memes/meme_efanggong.svg", "keys": ["阿房宫赋", "桂枝香·金陵怀古"]}, {"id": "meme-chenqing", "title": "臣无祖母，无以至今日", "tag": "陈情表 / 情理并举", "related": "适合《陈情表》《项脊轩志》等“亲情—责任—处境”导入。", "explain": "先让学生口语化复述，再分析为什么这类文章总是“先情后理、以情动人”。", "usage": "导入 / 情理关系 / 文言迁移", "target": "《陈情表》", "src": "assets/memes/meme_chenqing.svg", "keys": ["陈情表", "项脊轩志"]}, {"id": "meme-changting", "title": "晓来谁染霜林醉", "tag": "长亭送别 / 景情联动", "related": "适合《长亭送别》《扬州慢》《登高》等“景先入、情后落”导入。", "explain": "先抓画面色调和天气，再转到“景物为什么会替情绪说话”。", "usage": "导入 / 景情关系 / 戏曲词曲", "target": "景情联动篇目", "src": "assets/memes/meme_changting.svg", "keys": ["长亭送别", "扬州慢", "登高"]}, {"id": "meme-chaotianzi", "title": "曲儿小，腔儿大", "tag": "朝天子 / 讽刺", "related": "适合《朝天子·咏喇叭》以及讽刺类作品导入。", "explain": "先让学生说“表面写器物，实际在骂谁”，再回到夸张、反讽和批判对象。", "usage": "导入 / 讽刺对象 / 散曲阅读", "target": "《朝天子·咏喇叭》", "src": "assets/memes/meme_chaotianzi.svg", "keys": ["朝天子·咏喇叭"]}];
  const GAME_BANK = [
    {
      id:'kidnap-labour',
      type:'input',
      title:'劫匪审问局',
      category:'写作机制',
      scene:'assets/games/scene_robber_labour.svg',
      prompt:'漫画里的劫匪说：\n“我又不是天生要抢，是谁把我卷成了只认钱和绩效的工具？”\n请用作文语言回答他为什么会走到这一步。',
      placeholder:'请输入你的判断，例如：这是劳动异化……',
      keywords:['劳动异化','工具理性','绩效','KPI','价值单一','内卷'],
      explanation:'参考说法：这是劳动异化机制的外化。精密分工、绩效考核与单一成功标准把人推入工具化竞争，人的关系、价值和行动都被压缩成“有用/没用”，于是极端逐利逻辑开始冒头。',
      note:'这是漫画化情境，用来帮助学生记住“劳动异化”而不是为任何现实暴力开脱。'
    },
    {
      id:'algo-court',
      type:'choice',
      title:'算法法庭',
      category:'写作机制',
      scene:'assets/games/scene_algorithm_court.svg',
      prompt:'同一条热搜下面，所有人越刷越愤怒、越看越确信自己对。最该优先说出的机制是：',
      options:['算法规训 / 信息茧房','单纯因为年轻人脾气差','只是修辞手法用错了','全部归因于个人道德败坏'],
      answer:0,
      explanation:'先抓算法规训最稳：平台以个性化推荐持续投喂同温层内容，削弱跨处境理解，催化情绪对立和观点极化。',
      note:'答题时不要停在“大家都很冲动”，要继续追问是谁把注意力和信息结构塑造成这样的。'
    },
    {
      id:'nearby-island',
      type:'choice',
      title:'城市孤岛',
      category:'写作机制',
      scene:'assets/games/scene_neighborhood_void.svg',
      prompt:'大家住得很近，却彼此不认识；有人线上高强度围观宏大叙事，线下却没有稳定支持网络。最该优先概括为：',
      options:['个体化 / 附近的消失','纯粹是大家懒得社交','只需要多背几篇范文','这是词义误用问题'],
      answer:0,
      explanation:'这类材料优先从个体化与“附近的消失”切入：人口流动、生活加速与原子化处境，削弱了现实支持网络与次级群体。',
      note:'作文里要继续往“重建附近、重建生活秩序”上推。'
    },
    {
      id:'grammar-surgery',
      type:'choice',
      title:'病句手术台',
      category:'语言文字运用',
      scene:'assets/games/scene_grammar_surgery.svg',
      prompt:'哪一句没有语病？',
      options:[
        '通过建立错因标签，使学生能够更快定位问题。',
        '是否先做问答题，是减少现代文误判的有效办法。',
        '这套训练不只强调答案，更强调方法是否能迁移。',
        '在逐段概括的基础上判断人物、情节、主题，是文学类文本较稳的路径之一。'
      ],
      answer:3,
      explanation:'D 正确。A 主语残缺；B 两面对一面；C “强调……是否……”表达不稳。病句题最稳的起手永远是：先找“谁做什么”。',
      note:'语言题不是听起来顺就行，先还原句子主干。'
    },
    {
      id:'punct-bomb',
      type:'choice',
      title:'标点拆弹局',
      category:'语言文字运用',
      scene:'assets/games/scene_punctuation_bomb.svg',
      prompt:'下列句子中分号使用最恰当的一项是：',
      options:[
        '要把材料看懂；先抓对象、范围、逻辑、态度四个点。',
        '现代文阅读Ⅰ先做问答题；做完后再回头核对选择题。',
        '标点要先看功能；再看停顿长短。',
        '他今天整理了错题、规则卡、写作提纲；复盘笔记也补全了。'
      ],
      answer:3,
      explanation:'D 最稳。前一分句内部已有顿号列举，两并列分句之间用分号，层级最清楚。',
      note:'标点题不要只看停顿长短，要看层级和包孕关系。'
    }
  ];
  const MECHANISM_BANK = [
    {id:'labor', title:'劳动异化', desc:'精密分工、绩效/KPI、工具理性与单一价值标准把人推入竞争与工具化关系。'},
    {id:'algo', title:'算法规训', desc:'个性化推荐、信息茧房和平台逻辑塑造注意力结构，催化极化与情绪对立。'},
    {id:'nearby', title:'个体化 / 附近消失', desc:'高流动生活削弱现实支持网络，个体容易走向原子化与宏大叙事依附。'}
  ];
  const GAME_SUCCESS_TEXT = ['过关','命中','拿下'];
  let pendingMemeFile = null;

  function h(str){
    if(typeof escapeHtml === 'function') return escapeHtml(str);
    return String(str == null ? '' : str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
  function cleanAuthor(v){ return String(v || '佚名').replace(/^\(+/, '').replace(/\)+$/, '').trim() || '佚名'; }
  function cleanLine(v){ return String(v || '').replace(/\[[^\]]+\]/g,'').replace(/（[^）]*）/g,'').replace(/\s+/g,' ').trim(); }
  function allPlans(){ return (window.classroomData && Array.isArray(window.classroomData.plans)) ? window.classroomData.plans : []; }
  function ensurePatchStyle(){
    if(document.getElementById('gaokao-v11-patch-style')) return;
    const style = document.createElement('style');
    style.id = 'gaokao-v11-patch-style';
    style.textContent = `
      .v11-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
      .v11-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
      .v11-grid-main{display:grid;grid-template-columns:minmax(320px,.88fr) minmax(0,1.12fr);gap:20px}
      @media(max-width:1120px){.v11-grid-2,.v11-grid-3,.v11-grid-main{grid-template-columns:1fr}}
      .v11-list{display:flex;flex-direction:column;gap:10px;max-height:920px;overflow:auto;padding-right:4px;margin-top:14px}
      .v11-item{border:1px solid var(--line);background:#fff;border-radius:18px;padding:14px;cursor:pointer;text-align:left}
      .v11-item.active{border-color:var(--primary);background:#f8fbff}
      .v11-badge{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#eef5ff;border:1px solid #d8e8fb;color:var(--primary);font-size:12px;font-weight:600}
      .v11-badge.warn{background:#fff8e6;border-color:#f0c95d;color:#8a5a00}
      .v11-badge.good{background:#ecfdf3;border-color:#93e2ae;color:#1d5b35}
      .v11-badge.ghost{background:#f8fafc;border-color:#e6edf5;color:#62748a}
      .v11-small{font-size:13px;color:var(--muted);line-height:1.75}
      .v11-question-card{border:1px solid var(--line);background:#fff;border-radius:20px;padding:16px;margin-top:14px}
      .v11-option{display:flex;gap:10px;width:100%;text-align:left;background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin-top:10px;cursor:pointer;font:inherit;color:inherit}
      .v11-option:hover{background:#f8fbff}
      .v11-option.correct{background:var(--good);border-color:var(--good-line)}
      .v11-option.wrong{background:var(--bad);border-color:var(--bad-line)}
      .v11-meme-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:16px}
      @media(max-width:1120px){.v11-meme-grid{grid-template-columns:1fr}}
      .v11-meme-card{border:1px solid var(--line);background:#fff;border-radius:20px;padding:14px}
      .v11-meme-card img{display:block;width:100%;height:240px;object-fit:contain;background:#fff;border:1px solid var(--line);border-radius:16px}
      .v11-note{font-size:12px;color:var(--muted);line-height:1.7}
      .v11-number-wrap{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
      .v11-number-ball{width:54px;height:54px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#123a64;color:#fff;font-weight:700;font-size:20px;box-shadow:0 8px 20px rgba(18,58,100,.18)}
      .v11-scene{width:100%;height:auto;border-radius:18px;border:1px solid var(--line);display:block;background:#fff}
      .v11-kv{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px}
      @media(max-width:980px){.v11-kv{grid-template-columns:repeat(2,minmax(0,1fr))}}
      .v11-kv .stat{background:#fff;border:1px solid var(--line);border-radius:20px;padding:14px;text-align:center}
      .v11-kv .stat strong{display:block;font-size:24px}
      .v11-random-card{border:1px solid var(--line);background:#fff;border-radius:20px;padding:16px}
      .v11-game-card{border:1px solid var(--line);background:#fff;border-radius:22px;padding:16px}
      .v11-score{display:inline-flex;align-items:center;padding:7px 12px;border-radius:999px;background:#eef5ff;color:var(--primary);font-size:12px;font-weight:700;border:1px solid #d8e8fb}
      .v11-link-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--text);cursor:pointer;text-decoration:none;font:inherit}
      .v11-link-btn:hover{background:#f8fbff}
      .v11-item .meta,.v11-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
      .v11-coverline{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:8px}
      .teacher-meme-grid,.recite-meme-grid{display:none !important;}
    `;
    document.head.appendChild(style);
  }
  function ensurePatchState(){
    ensurePatchStyle();
    if(!state.v11 || typeof state.v11 !== 'object'){
      state.v11 = {};
    }
    const v = state.v11;
    if(!v.selectedTextId && allPlans()[0]) v.selectedTextId = allPlans()[0].id;
    if(typeof v.mapQuery !== 'string') v.mapQuery = '';
    if(typeof v.mapModule !== 'string') v.mapModule = 'all';
    if(typeof v.mapGenre !== 'string') v.mapGenre = 'all';
    if(typeof v.mapOnlyUncovered !== 'boolean') v.mapOnlyUncovered = false;
    if(!v.mapResponses || typeof v.mapResponses !== 'object') v.mapResponses = {};
    if(typeof v.memeQuery !== 'string') v.memeQuery = '';
    if(typeof v.memeTag !== 'string') v.memeTag = 'all';
    if(!Array.isArray(v.userMemes)) v.userMemes = [];
    if(!v.random || typeof v.random !== 'object') v.random = { max:60, count:1, numbers:[], texts:[], combo:null, micro:[] };
    if(!v.games || typeof v.games !== 'object') v.games = { records:{}, inputs:{} };
    if(typeof v.dashboardHint !== 'string') v.dashboardHint = '';
  }
  function saveAndRender(){ saveState(); renderApp(); }
  function sampleUnique(list, count){
    const arr = list.slice();
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.max(0, Math.min(count, arr.length)));
  }
  function uniqueBy(list, keyFn){
    const seen = new Set();
    const out = [];
    list.forEach(item => {
      const key = keyFn(item);
      if(seen.has(key)) return;
      seen.add(key);
      out.push(item);
    });
    return out;
  }
  function slugify(text){ return String(text || '').replace(/[^\w\u4e00-\u9fa5]+/g,'-'); }
  function builtInMemes(){
    const base = (window.classroomData && Array.isArray(window.classroomData.memeImages)) ? window.classroomData.memeImages : [];
    const map = {};
    base.forEach(item => { map[item.id] = Object.assign({source:'系统内置'}, item); });
    EXTRA_MEMES.forEach(item => { map[item.id] = Object.assign({source:'系统内置'}, map[item.id] || {}, item); });
    return Object.values(map);
  }
  function allMemes(){
    ensurePatchState();
    return builtInMemes().concat((state.v11.userMemes || []).map(item => Object.assign({source:'用户上传'}, item)));
  }
  const linkedQuestionCache = {};
  function planMethodBundle(plan){
    const genre = String(plan.genre || '');
    if(genre === '戏曲'){
      return {
        stem:`分析《${plan.title}》时，最该优先抓住哪组信息？`,
        options:[
          '先看舞台场景、景物调度和唱词怎样把情绪一层层推高。',
          '只翻译字面意思，不必回到人物动作和舞台感。',
          '先背术语模板，再把所有作品都写成同一套答案。',
          '只追作者逸事，不看文本推进。'
        ],
        answer:0,
        analysis:`《${plan.title}》是${genre}，最稳的是先看景—情—人怎样协同推进，再落到${plan.themeLabel}。`
      };
    }
    if(genre === '古文'){
      return {
        stem:`阅读《${plan.title}》时，最该优先抓住哪组信息？`,
        options:[
          '先看语境、关键句和情理/论证推进，再组织答案。',
          '遇到不会的字就跳过去，尽量靠大意糊住。',
          '只记作者朝代，不看句法和逻辑关系。',
          '先把所有句子硬翻成白话，再不管结构。'
        ],
        answer:0,
        analysis:`古文最稳的动作仍是“语境—关键词—关系链”，这样才能把${plan.themeLabel || '主旨'}说清。`
      };
    }
    if(genre === '辞赋'){
      return {
        stem:`理解《${plan.title}》时，最该优先留意什么？`,
        options:[
          '铺陈对象、夸饰/对照和结尾议论怎样一起把主旨顶出来。',
          '只记押韵，不必看结构转换。',
          '把它当成现代散文直接顺读，不追问文体特点。',
          '先把典故全背下来，再不管论旨。'
        ],
        answer:0,
        analysis:`辞赋类文本的关键是看铺陈、对照和议论怎样共同服务${plan.themeLabel || '主旨'}。`
      };
    }
    return {
      stem:`分析《${plan.title}》时，最稳的起手动作是：`,
      options:[
        '先抓意象/画面、转折句和结句，再落到情感落点。',
        '只翻译字面意思，不看景情关系。',
        '先把作者轶事背熟，文本细读可以后置。',
        '只写手法名称，不解释它怎样服务情感。'
      ],
      answer:0,
      analysis:`这类作品最稳的路径是先抓画面、转折和结句，再把${plan.emotion || '情感'}说实。`
    };
  }
  function createLinkedQuestions(plan, idx){
    if(linkedQuestionCache[plan.id]) return linkedQuestionCache[plan.id];
    const plans = allPlans();
    const genrePeers = plans.filter(p => p.id !== plan.id && p.genre === plan.genre);
    const themeCorrect = `${cleanLine(plan.themeLabel || '')}：${cleanLine(plan.themeDesc || '')}`;
    const themeWrong = uniqueBy(sampleUnique(genrePeers, 12).map(p => ({ value:`${cleanLine(p.themeLabel || '')}：${cleanLine(p.themeDesc || '')}`, title:p.title })), x => x.value).filter(x => x.value !== themeCorrect).slice(0,3).map(x => x.value);
    while(themeWrong.length < 3){ themeWrong.push(`围绕“${plan.title}”的主题偏移项 ${themeWrong.length + 1}`); }
    const themeOptions = sampleUnique([{text:themeCorrect, ok:true}].concat(themeWrong.map(t => ({text:t, ok:false}))), 4);
    const themeAnswer = themeOptions.findIndex(x => x.ok);

    const selfLines = (plan.contentLines || []).map(cleanLine).filter(Boolean);
    const correctLine = selfLines[(idx || 0) % Math.max(1, selfLines.length)] || cleanLine(plan.quote || plan.title);
    const linePool = [];
    sampleUnique(plans.filter(p => p.id !== plan.id && p.genre === plan.genre), 20).forEach(p => {
      (p.contentLines || []).map(cleanLine).filter(Boolean).slice(0,2).forEach(line => linePool.push({line, title:p.title}));
    });
    const lineWrong = uniqueBy(linePool, x => x.line).filter(x => x.line !== correctLine).slice(0,3).map(x => x.line);
    while(lineWrong.length < 3){ lineWrong.push(`这句并不出自《${plan.title}》`); }
    const lineOptions = sampleUnique([{text:correctLine, ok:true}].concat(lineWrong.map(t => ({text:t, ok:false}))), 4);
    const lineAnswer = lineOptions.findIndex(x => x.ok);

    const method = planMethodBundle(plan);
    const out = [
      {
        id:`${slugify(plan.id)}-theme`,
        stem:`《${plan.title}》的核心主题最贴近哪一项？`,
        options:themeOptions.map(x => x.text),
        answer:themeAnswer,
        analysis:`正确落点应回到“${themeCorrect}”。不要把别的篇目的情感标签借过来。`
      },
      {
        id:`${slugify(plan.id)}-line`,
        stem:`下列哪一句最可能出自《${plan.title}》？`,
        options:lineOptions.map(x => x.text),
        answer:lineAnswer,
        analysis:`先抓名句气口和意象群，比死记标题更稳。该篇最能帮助识别的一句是：${correctLine}`
      },
      {
        id:`${slugify(plan.id)}-method`,
        stem:method.stem,
        options:method.options,
        answer:method.answer,
        analysis:method.analysis
      }
    ];
    linkedQuestionCache[plan.id] = out;
    return out;
  }
  function coverageRows(){
    return allPlans().map((plan, idx) => ({ plan, questions:createLinkedQuestions(plan, idx), covered:createLinkedQuestions(plan, idx).length > 0 }));
  }
  function coverageStats(){
    const rows = coverageRows();
    const covered = rows.filter(r => r.covered).length;
    const linked = rows.reduce((sum, r) => sum + r.questions.length, 0);
    return { total:rows.length, covered, uncovered:rows.length - covered, linked };
  }
  function visibleCoverageRows(){
    ensurePatchState();
    const q = (state.v11.mapQuery || '').trim().toLowerCase();
    return coverageRows().filter(row => {
      if(state.v11.mapModule !== 'all' && row.plan.module !== state.v11.mapModule) return false;
      if(state.v11.mapGenre !== 'all' && row.plan.genre !== state.v11.mapGenre) return false;
      if(state.v11.mapOnlyUncovered && row.covered) return false;
      if(!q) return true;
      const hay = `${row.plan.title} ${cleanAuthor(row.plan.author)} ${row.plan.module} ${row.plan.themeLabel} ${row.plan.themeDesc}`.toLowerCase();
      return hay.includes(q);
    });
  }
  function currentCoverageRow(){
    const rows = visibleCoverageRows();
    let row = rows.find(r => r.plan.id === state.v11.selectedTextId);
    if(!row) row = rows[0] || coverageRows()[0] || null;
    if(row) state.v11.selectedTextId = row.plan.id;
    return row;
  }
  function moduleOptions(){
    const mods = ['all'].concat(uniqueBy(allPlans(), p => p.module).map(p => p.module));
    return mods;
  }
  function genreOptions(){
    const genres = ['all'].concat(uniqueBy(allPlans(), p => p.genre).map(p => p.genre));
    return genres;
  }
  function responseFor(qid){ ensurePatchState(); return state.v11.mapResponses[qid]; }
  function answerLinkedQuestion(qid, idx){ ensurePatchState(); state.v11.mapResponses[qid] = idx; saveAndRender(); }
  function resetLinkedQuestion(qid){ ensurePatchState(); delete state.v11.mapResponses[qid]; saveAndRender(); }
  function renderLinkedQuestionCard(q){
    const choice = responseFor(q.id);
    const answered = Number.isInteger(choice);
    return `
      <div class="v11-question-card">
        <div class="small">配套微题</div>
        <div class="q-stem" style="font-size:16px">${h(q.stem)}</div>
        ${q.options.map((opt, i) => `
          <button class="v11-option ${answered ? (i === q.answer ? 'correct' : (i === choice ? 'wrong' : '')) : ''}" onclick="v11AnswerLinkedQuestion('${q.id}', ${i})">
            <span class="opt-code">${String.fromCharCode(65+i)}</span>
            <span>${h(opt)}</span>
          </button>`).join('')}
        ${answered ? `
          <div class="block ${choice === q.answer ? 'good' : 'warn'}" style="margin-top:12px">
            <strong>${choice === q.answer ? GAME_SUCCESS_TEXT[Math.floor(Math.random()*GAME_SUCCESS_TEXT.length)] : '参考解析'}</strong>
            <div class="preview-box" style="margin-top:8px">正确答案：${String.fromCharCode(65+q.answer)}. ${h(q.options[q.answer])}\n${h(q.analysis)}</div>
          </div>
          <div class="row" style="margin-top:10px"><button class="btn secondary" onclick="v11ResetLinkedQuestion('${q.id}')">重做这一题</button></div>
        ` : ''}
      </div>`;
  }
  function renderTextMap(){
    ensurePatchState();
    const stats = coverageStats();
    const rows = visibleCoverageRows();
    const current = currentCoverageRow();
    const plan = current ? current.plan : null;
    return `
      ${renderHero('文本题目映射：先把 61 篇全部配上题', '这页专门用来核对“所有文本是否都有对应题目”。当前版本已为每篇文本补上 3 道配套微题：主题识别、名句识别、方法起手。', [`已覆盖 ${stats.covered}/${stats.total} 篇`, `配套微题 ${stats.linked} 道`, `当前筛选 ${rows.length} 篇`, '支持随机抽篇与直接作答'])}
      <div class="card">
        <div class="space-between"><div><h3>覆盖总表</h3><div class="subtitle">凡是出现在背诵/课堂文本里的篇目，这里都能看到是否已经配题。当前这版是 61/61 全覆盖。</div></div><a class="v11-link-btn" href="./text_question_audit.csv" download>下载核对表 CSV</a></div>
        <div class="v11-kv">
          <div class="stat"><strong>${stats.total}</strong><span>文本总数</span></div>
          <div class="stat"><strong>${stats.covered}</strong><span>已配题</span></div>
          <div class="stat"><strong>${stats.linked}</strong><span>微题总数</span></div>
          <div class="stat"><strong>${stats.uncovered}</strong><span>未覆盖</span></div>
        </div>
      </div>
      <div class="v11-grid-main">
        <div class="card sticky-card">
          <div class="space-between"><div><h3>文本列表</h3><div class="subtitle">先筛模块/文体，再点进单篇看对应题。</div></div><span class="count-badge">${rows.length}</span></div>
          <div class="v11-toolbar"><input class="input" placeholder="搜标题 / 作者 / 主题" value="${h(state.v11.mapQuery || '')}" oninput="v11SetMapField('mapQuery', this.value)"></div>
          <div class="v11-toolbar">${moduleOptions().map(mod => `<button class="pill ${state.v11.mapModule===mod?'active':''}" onclick="v11SetMapField('mapModule','${mod}')">${h(mod==='all'?'全部模块':mod)}</button>`).join('')}</div>
          <div class="v11-toolbar">${genreOptions().map(genre => `<button class="pill small ${state.v11.mapGenre===genre?'active':''}" onclick="v11SetMapField('mapGenre','${genre}')">${h(genre==='all'?'全部文体':genre)}</button>`).join('')}<button class="pill small ${state.v11.mapOnlyUncovered?'active':''}" onclick="v11ToggleMapOnlyUncovered()">只看未覆盖</button></div>
          <div class="v11-list">
            ${rows.length ? rows.map(row => `
              <button class="v11-item ${state.v11.selectedTextId===row.plan.id?'active':''}" onclick="v11SelectText('${row.plan.id}')">
                <strong>${h(row.plan.title)}</strong>
                <div class="v11-small" style="margin-top:6px">${h(cleanAuthor(row.plan.author))} · ${h(row.plan.module)} · ${h(row.plan.genre)}</div>
                <div class="meta">
                  <span class="v11-badge ${row.covered?'good':'warn'}">${row.covered?'已配题':'待补题'}</span>
                  <span class="v11-badge ghost">${row.questions.length} 道</span>
                  <span class="v11-badge ghost">${h(row.plan.themeLabel || '')}</span>
                </div>
              </button>`).join('') : '<div class="block warn">当前筛选下没有文本。</div>'}
          </div>
        </div>
        <div class="card">
          ${plan ? `
            <div class="space-between"><div><h3>${h(plan.title)}</h3><div class="subtitle">${h(cleanAuthor(plan.author))} · ${h(plan.module)} · ${h(plan.genre)}</div></div><div class="row"><button class="pill" onclick="switchView('recite');gaokaoReciteSelect('${plan.id}')">去背诵页</button><button class="pill" onclick="v11DrawTexts(1,'${plan.id}')">随机抽这篇</button></div></div>
            <div class="grid-2" style="margin-top:14px">
              <div class="block teal"><strong>主题一句话</strong><div class="preview-box" style="margin-top:8px">${h(plan.themeLabel || '')}：${h(plan.themeDesc || '')}</div></div>
              <div class="block purple"><strong>情感落点</strong><div class="preview-box" style="margin-top:8px">${h(plan.emotion || '')}</div></div>
            </div>
            <div class="block" style="margin-top:14px"><strong>文本抓手</strong><div class="preview-box" style="margin-top:8px">${h(cleanLine(plan.quote || (plan.contentLines || []).slice(0,2).join(' / ')))}</div></div>
            <div class="block good" style="margin-top:14px"><strong>本篇核对结论</strong><div class="preview-box" style="margin-top:8px">已为《${h(plan.title)}》生成 ${current.questions.length} 道配套微题，覆盖“主题—名句—方法”三种起手动作。</div></div>
            ${current.questions.map(renderLinkedQuestionCard).join('')}
          ` : '<div class="block warn">暂无当前文本。</div>'}
        </div>
      </div>`;
  }
  function memeTagOptions(){
    const tags = uniqueBy(allMemes().map(item => ({tag:item.tag || '未分类'})), x => x.tag).map(x => x.tag);
    return ['all'].concat(tags);
  }
  function visibleMemes(){
    ensurePatchState();
    const q = (state.v11.memeQuery || '').trim().toLowerCase();
    return allMemes().filter(item => {
      if(state.v11.memeTag !== 'all' && (item.tag || '未分类') !== state.v11.memeTag) return false;
      if(!q) return true;
      const hay = `${item.title} ${item.tag} ${item.related || ''} ${item.explain || ''} ${item.usage || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }
  function renderMemeHub(){
    ensurePatchState();
    const built = builtInMemes().length;
    const user = (state.v11.userMemes || []).length;
    const list = visibleMemes();
    return `
      ${renderHero('梗图总库：统一上传、统一展示，不再穿插到别的项目里', '从这版开始，梗图集中放在这里：你可以上传自己的图、筛选标签、导出清单；背诵页和课堂页不再内嵌梗图卡片。', [`系统内置 ${built} 张`, `用户上传 ${user} 张`, `当前展示 ${list.length} 张`, '支持本地持久化'])}
      <div class="v11-grid-2">
        <div class="card">
          <h3>上传到集中库</h3>
          <div class="subtitle">静态站点不能把图片传到服务器，所以这里默认保存在当前浏览器；建议重要素材顺手导出备份。</div>
          <div class="v11-toolbar" style="margin-top:14px"><input id="v11MemeTitle" class="input" placeholder="梗图标题"></div>
          <div class="v11-toolbar"><input id="v11MemeTag" class="input" placeholder="标签，例如：师说 / 写作 / 语言运用"></div>
          <div class="v11-toolbar"><textarea id="v11MemeRelated" class="textarea compact" placeholder="关联篇目 / 用途 / 导入说明"></textarea></div>
          <div class="v11-toolbar"><textarea id="v11MemeExplain" class="textarea compact" placeholder="补充说明（可选）"></textarea></div>
          <div class="v11-toolbar"><input id="v11MemeFile" type="file" accept="image/*" onchange="v11CaptureMemeFile(event)"></div>
          <div class="row" style="margin-top:12px"><button class="btn" onclick="v11CreateMeme()">上传进集中库</button><button class="btn secondary" onclick="v11ExportMemes()">导出上传清单</button><button class="btn danger" onclick="v11ClearUploadedMemes()">清空我上传的图</button></div>
          <div class="block warn" style="margin-top:14px">上传说明：图片会压缩后保存在当前浏览器。若你要换设备或换浏览器，请先导出备份。</div>
        </div>
        <div class="card">
          <div class="space-between"><div><h3>筛选与展示</h3><div class="subtitle">这里只做集中展示，不再把梗图散在课堂页和背诵页里。</div></div><span class="count-badge">${list.length}</span></div>
          <div class="v11-toolbar"><input class="input" placeholder="搜标题 / 标签 / 用途" value="${h(state.v11.memeQuery || '')}" oninput="v11SetMemeField('memeQuery', this.value)"></div>
          <div class="v11-toolbar">${memeTagOptions().map(tag => `<button class="pill ${state.v11.memeTag===tag?'active':''}" onclick="v11SetMemeField('memeTag','${tag}')">${h(tag==='all'?'全部标签':tag)}</button>`).join('')}</div>
          <div class="block teal" style="margin-top:14px"><strong>集中化变更</strong><div class="preview-box" style="margin-top:8px">这版已把梗图展示集中到本页；课堂页的“梗图库”入口被移除，背诵页内嵌梗图区也被清掉。</div></div>
        </div>
      </div>
      <div class="card">
        <div class="space-between"><div><h3>梗图卡片</h3><div class="subtitle">点击“打开大图”可单独看图；上传图片可直接在这里核对。</div></div><span class="v11-score">总计 ${built+user} 张</span></div>
        <div class="v11-meme-grid">
          ${list.map(item => `
            <div class="v11-meme-card">
              <img src="${h(item.src)}" alt="${h(item.title)}">
              <div class="meta" style="margin-top:10px"><span class="v11-badge">${h(item.tag || '未分类')}</span><span class="v11-badge ghost">${h(item.source || '系统内置')}</span></div>
              <h3 style="margin-top:10px">${h(item.title)}</h3>
              <div class="v11-small">${h(item.related || '')}</div>
              <div class="v11-note" style="margin-top:8px">${h(item.explain || '')}</div>
              <div class="row" style="margin-top:12px"><button class="btn secondary" onclick="window.open('${h(item.src)}','_blank')">打开大图</button>${item.source==='用户上传' ? `<button class="btn danger" onclick="v11DeleteMeme('${item.id}')">删除</button>` : ''}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }
  function drawNumbers(){
    ensurePatchState();
    const max = Math.max(1, Number(state.v11.random.max) || 60);
    const count = Math.max(1, Math.min(max, Number(state.v11.random.count) || 1));
    const pool = Array.from({length:max}, (_,i)=>i+1);
    state.v11.random.numbers = sampleUnique(pool, count);
    saveAndRender();
  }
  function microQuestionPool(){
    return coverageRows().flatMap(row => row.questions.map(q => ({ plan:row.plan, question:q })));
  }
  function drawTexts(count, fixedId){
    ensurePatchState();
    let list = allPlans();
    if(fixedId){
      const target = list.find(p => p.id === fixedId);
      list = target ? [target] : list;
    }
    state.v11.random.texts = sampleUnique(list, count || 1).map(p => ({ id:p.id }));
    saveAndRender();
  }
  function drawMicro(count){
    ensurePatchState();
    state.v11.random.micro = sampleUnique(microQuestionPool(), count || 3).map(item => ({ planId:item.plan.id, qid:item.question.id }));
    saveAndRender();
  }
  function drawCombo(){
    ensurePatchState();
    const plan = sampleUnique(allPlans(), 1)[0] || null;
    const mechanism = sampleUnique(MECHANISM_BANK, 1)[0] || null;
    const writing = (DATA.writingPrompts && DATA.writingPrompts.length) ? sampleUnique(DATA.writingPrompts, 1)[0] : null;
    const meme = sampleUnique(allMemes(), 1)[0] || null;
    state.v11.random.combo = {
      planId: plan ? plan.id : '',
      mechanismId: mechanism ? mechanism.id : '',
      writingId: writing ? writing.id : '',
      memeId: meme ? meme.id : ''
    };
    saveAndRender();
  }
  function findPlan(id){ return allPlans().find(p => p.id === id) || null; }
  function findMicro(qid){
    for(const row of coverageRows()){
      const q = row.questions.find(item => item.id === qid);
      if(q) return { plan:row.plan, question:q };
    }
    return null;
  }
  function renderRandomHub(){
    ensurePatchState();
    const r = state.v11.random;
    const comboPlan = r.combo ? findPlan(r.combo.planId) : null;
    const comboMechanism = r.combo ? MECHANISM_BANK.find(x => x.id === r.combo.mechanismId) : null;
    const comboWriting = r.combo && DATA.writingPrompts ? DATA.writingPrompts.find(x => x.id === r.combo.writingId) : null;
    const comboMeme = r.combo ? allMemes().find(x => x.id === r.combo.memeId) : null;
    return `
      ${renderHero('随机抽取：抽号、抽篇、抽题、抽机制都放一起', '适合课堂点名、晚自习扭蛋、当天任务快速生成。你要的“随机抽数或者类似功能”已经单独做成一页。', [`当前抽号上限 ${r.max || 60}`, `抽取个数 ${r.count || 1}`, `已抽文本 ${r.texts ? r.texts.length : 0} 篇`, '适合课堂即时调用'])}
      <div class="v11-grid-3">
        <div class="v11-random-card">
          <h3>随机抽号器</h3>
          <div class="subtitle">可以按班级人数抽 1 个或多个号，适合课堂点名。</div>
          <div class="row" style="margin-top:12px"><input class="input" style="max-width:160px" type="number" min="1" value="${h(r.max || 60)}" oninput="v11SetRandomField('max', this.value)"><input class="input" style="max-width:160px" type="number" min="1" value="${h(r.count || 1)}" oninput="v11SetRandomField('count', this.value)"></div>
          <div class="row" style="margin-top:12px"><button class="btn" onclick="v11DrawNumbers()">开始抽号</button></div>
          <div class="v11-number-wrap">${(r.numbers || []).map(n => `<span class="v11-number-ball">${n}</span>`).join('') || '<span class="small">还没抽号。</span>'}</div>
        </div>
        <div class="v11-random-card">
          <h3>随机抽篇</h3>
          <div class="subtitle">抽背诵篇、抽课堂篇、抽今天的复盘对象都很方便。</div>
          <div class="row" style="margin-top:12px"><button class="btn" onclick="v11DrawTexts(1)">抽 1 篇</button><button class="btn secondary" onclick="v11DrawTexts(3)">抽 3 篇</button><button class="btn secondary" onclick="v11DrawTexts(5)">抽 5 篇</button></div>
          <ul class="list" style="margin-top:12px">${(r.texts || []).map(item => { const plan = findPlan(item.id); return plan ? `<li><strong>${h(plan.title)}</strong><br><span class="small">${h(cleanAuthor(plan.author))} · ${h(plan.module)} · ${h(plan.themeLabel || '')}</span></li>` : ''; }).join('') || '<li>还没抽篇。</li>'}</ul>
        </div>
        <div class="v11-random-card">
          <h3>随机抽微题</h3>
          <div class="subtitle">从“文本配套微题”里随机抽几道，适合课前/课后快测。</div>
          <div class="row" style="margin-top:12px"><button class="btn" onclick="v11DrawMicro(1)">抽 1 题</button><button class="btn secondary" onclick="v11DrawMicro(3)">抽 3 题</button></div>
          <ul class="list" style="margin-top:12px">${(r.micro || []).map(item => { const found = findMicro(item.qid); return found ? `<li><strong>${h(found.plan.title)}</strong><br><span class="small">${h(found.question.stem)}</span></li>` : ''; }).join('') || '<li>还没抽题。</li>'}</ul>
        </div>
      </div>
      <div class="card">
        <div class="space-between"><div><h3>今日扭蛋组合</h3><div class="subtitle">一键抽出“1 篇文本 + 1 个写作机制 + 1 道作文材料 + 1 张梗图”。</div></div><button class="pill" onclick="v11DrawCombo()">重新抽一组</button></div>
        ${r.combo ? `
          <div class="v11-grid-2" style="margin-top:16px">
            <div class="block teal"><strong>今天的文本</strong><div class="preview-box" style="margin-top:8px">${comboPlan ? h(comboPlan.title + '｜' + cleanAuthor(comboPlan.author)) : '—'}</div></div>
            <div class="block purple"><strong>今天的机制</strong><div class="preview-box" style="margin-top:8px">${comboMechanism ? h(comboMechanism.title + '：' + comboMechanism.desc) : '—'}</div></div>
            <div class="block"><strong>今天的作文材料</strong><div class="preview-box" style="margin-top:8px">${comboWriting ? h(comboWriting.title || comboWriting.id) : '—'}</div></div>
            <div class="block good"><strong>今天的梗图</strong><div class="preview-box" style="margin-top:8px">${comboMeme ? h(comboMeme.title + '｜' + (comboMeme.tag || '')) : '—'}</div></div>
          </div>` : '<div class="block warn" style="margin-top:16px">还没抽组合，点右上角按钮即可。</div>'}
      </div>`;
  }
  function gameRecord(id){ ensurePatchState(); if(!state.v11.games.records[id]) state.v11.games.records[id] = { attempts:0, correct:false, choice:null, input:'' }; return state.v11.games.records[id]; }
  function gameInput(id){ ensurePatchState(); return state.v11.games.inputs[id] || ''; }
  function setGameInput(id, value){ ensurePatchState(); state.v11.games.inputs[id] = value; saveState(); }
  function submitGameInput(id){
    const game = GAME_BANK.find(x => x.id === id); if(!game) return;
    const rec = gameRecord(id);
    const value = String(gameInput(id) || '').trim();
    rec.attempts += 1;
    rec.input = value;
    rec.correct = game.keywords.some(k => value.includes(k));
    saveAndRender();
  }
  function answerGameChoice(id, idx){
    const game = GAME_BANK.find(x => x.id === id); if(!game) return;
    const rec = gameRecord(id);
    rec.attempts += 1;
    rec.choice = idx;
    rec.correct = idx === game.answer;
    saveAndRender();
  }
  function resetGame(id){ ensurePatchState(); delete state.v11.games.records[id]; delete state.v11.games.inputs[id]; saveAndRender(); }
  function gameScore(){
    ensurePatchState();
    const recs = state.v11.games.records || {};
    const done = Object.values(recs).filter(x => x && x.correct).length;
    return { total:GAME_BANK.length, done };
  }
  function renderGameCard(game){
    const rec = gameRecord(game.id);
    return `
      <div class="v11-game-card">
        <div class="space-between"><div><h3>${h(game.title)}</h3><div class="subtitle">${h(game.category)}</div></div><span class="v11-score">${rec.correct ? '已通关' : '未通关'}</span></div>
        <img class="v11-scene" src="${h(game.scene)}" alt="${h(game.title)}" style="margin-top:14px">
        <div class="q-stem" style="font-size:16px">${h(game.prompt)}</div>
        ${game.type === 'input' ? `
          <textarea class="textarea compact" placeholder="${h(game.placeholder || '请输入答案') }" oninput="v11SetGameInput('${game.id}', this.value)">${h(gameInput(game.id))}</textarea>
          <div class="row" style="margin-top:12px"><button class="btn" onclick="v11SubmitGameInput('${game.id}')">提交答案</button><button class="btn secondary" onclick="v11ResetGame('${game.id}')">重置</button></div>
        ` : `
          ${game.options.map((opt, idx) => `
            <button class="v11-option ${rec.attempts ? (idx===game.answer ? 'correct' : (idx===rec.choice ? 'wrong' : '')) : ''}" onclick="v11AnswerGameChoice('${game.id}', ${idx})">
              <span class="opt-code">${String.fromCharCode(65+idx)}</span><span>${h(opt)}</span>
            </button>`).join('')}
          <div class="row" style="margin-top:12px"><button class="btn secondary" onclick="v11ResetGame('${game.id}')">重置</button></div>
        `}
        ${rec.attempts ? `
          <div class="block ${rec.correct ? 'good' : 'warn'}" style="margin-top:14px"><strong>${rec.correct ? '答对了' : '解析'}</strong><div class="preview-box" style="margin-top:8px">${game.type === 'choice' ? `正确答案：${String.fromCharCode(65+game.answer)}. ${h(game.options[game.answer])}\n` : ''}${h(game.explanation || '')}</div><div class="v11-note" style="margin-top:8px">${h(game.note || '')}</div></div>
        ` : ''}
      </div>`;
  }
  function renderGamesLab(){
    const score = gameScore();
    return `
      ${renderHero('游戏实验室：用剧情图和快测，把写作机制与语言文字玩明白', '这里专门放“好玩但不乱”的训练：写作机制用漫画情境记，语言文字用快测局拆。你说的“劫匪绑架画面 → 回答劳动异化机制”，我已经做成第一关。', [`已通关 ${score.done}/${score.total} 关`, '写作机制 + 语言运用混合', '所有图片独立放在 assets/games/'])}
      <div class="block warn">说明：这里的剧情图全部是漫画化课堂情境，用来帮助学生记住概念，不是现实暴力模拟。</div>
      <div class="v11-grid-2" style="margin-top:20px">
        ${GAME_BANK.map(renderGameCard).join('')}
      </div>`;
  }
  async function readFileAsDataURL(file){
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  async function compressImage(file){
    if(!file) return '';
    if(file.type === 'image/svg+xml') return await readFileAsDataURL(file);
    const raw = await readFileAsDataURL(file);
    if(file.size < 420000) return raw;
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 1600;
        const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = raw;
    });
  }
  function captureMemeFile(event){
    const file = event.target && event.target.files ? event.target.files[0] : null;
    pendingMemeFile = file || null;
    if(typeof showToast === 'function') showToast(file ? `已载入：${file.name}` : '未选择图片');
  }
  async function createMeme(){
    ensurePatchState();
    const title = (document.getElementById('v11MemeTitle') || {}).value || '';
    const tag = (document.getElementById('v11MemeTag') || {}).value || '未分类';
    const related = (document.getElementById('v11MemeRelated') || {}).value || '';
    const explain = (document.getElementById('v11MemeExplain') || {}).value || '';
    if(!title.trim()) return alert('先写标题');
    if(!pendingMemeFile) return alert('先选图片');
    const src = await compressImage(pendingMemeFile);
    state.v11.userMemes.unshift({
      id:'user-meme-' + Date.now(),
      title:title.trim(),
      tag:tag.trim() || '未分类',
      related:related.trim(),
      explain:explain.trim(),
      src,
      createdAt:new Date().toISOString()
    });
    pendingMemeFile = null;
    ['v11MemeTitle','v11MemeTag','v11MemeRelated','v11MemeExplain','v11MemeFile'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
    saveAndRender();
    if(typeof showToast === 'function') showToast('已上传到梗图总库');
  }
  function deleteMeme(id){
    ensurePatchState();
    state.v11.userMemes = (state.v11.userMemes || []).filter(item => item.id !== id);
    saveAndRender();
  }
  function clearUploadedMemes(){
    if(!confirm('确定清空你上传的梗图吗？')) return;
    ensurePatchState();
    state.v11.userMemes = [];
    saveAndRender();
  }
  function exportMemes(){
    ensurePatchState();
    exportJson('gaokao_meme_library_user_uploads.json', state.v11.userMemes || []);
    if(typeof showToast === 'function') showToast('已导出上传清单');
  }
  function setMapField(field, value){ ensurePatchState(); state.v11[field] = value; saveAndRender(); }
  function setMemeField(field, value){ ensurePatchState(); state.v11[field] = value; saveAndRender(); }
  function setRandomField(field, value){ ensurePatchState(); state.v11.random[field] = Number(value) || value; saveAndRender(); }
  function toggleMapOnlyUncovered(){ ensurePatchState(); state.v11.mapOnlyUncovered = !state.v11.mapOnlyUncovered; saveAndRender(); }
  function selectText(id){ ensurePatchState(); state.v11.selectedTextId = id; saveAndRender(); }
  function renderEnhancedDashboard(){
    const cov = coverageStats();
    const memeCount = allMemes().length;
    const score = gameScore();
    return `
      ${renderHero('高考系统 v11：先把文本—题目—梗图—随机—游戏这五件事彻底理顺', '这版重点修了你刚刚点名的问题：所有文本是否有配题、梗图是否集中、能否随机抽数/抽篇、能否用更好玩的方式练写作机制和语言文字。', [`文本全覆盖 ${cov.covered}/${cov.total}`, `梗图总库 ${memeCount} 张`, `配套微题 ${cov.linked} 道`, `游戏通关 ${score.done}/${score.total}`])}
      ${typeof renderStatsCards === 'function' ? renderStatsCards() : ''}
      <section class="v11-grid-3">
        <div class="card"><h3>文本题目映射</h3><div class="subtitle">61 篇文本全部补上 3 道配套微题，直接核对“有没有题”。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="switchView('textmap')">去核对</button></div></div>
        <div class="card"><h3>梗图总库</h3><div class="subtitle">梗图从其他页面里抽出来，改成单独入口，可上传、可筛选、可导出。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="switchView('memeshub')">去总库</button></div></div>
        <div class="card"><h3>随机 + 游戏</h3><div class="subtitle">课堂抽号、抽篇、抽题，以及“劫匪审问局”等游戏化训练都在独立入口。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="switchView('random')">去随机抽取</button><button class="btn secondary" onclick="switchView('games')">去游戏实验室</button></div></div>
      </section>
      ${typeof window.renderReciteDashboardCard === 'function' ? window.renderReciteDashboardCard() : ''}`;
  }

  function patchExistingViews(){
    if(typeof window.renderRecitePanel === 'function' && !window.renderRecitePanel.__v11patched){
      const original = window.renderRecitePanel;
      window.renderRecitePanel = function(){
        let html = original();
        html = html.replace(/<section>\s*<h4>梗图放置位<\/h4>[\s\S]*?<\/section>/, '');
        html = html.replace('5｜梗图复盘', '5｜迁移复盘');
        html = html.replace('把一句梗翻成一句答题术语，背诵和阅读理解共用一套语言。', '把一句课堂结论翻成一句答题术语，让背诵和阅读理解共用一套语言。');
        return html;
      };
      window.renderRecitePanel.__v11patched = true;
    }
    if(typeof window.renderClassroomPanel === 'function' && !window.renderClassroomPanel.__v11patched){
      const original = window.renderClassroomPanel;
      window.renderClassroomPanel = function(){
        if(state.classroomTab === 'memes') state.classroomTab = 'plans';
        let html = original();
        html = html.replace(/<button class="pill[^"]*" onclick="gaokaoSetClassroomTab\('memes'\)">梗图库<\/button>/, '');
        return html;
      };
      window.renderClassroomPanel.__v11patched = true;
    }
    if(typeof window.gaokaoSetClassroomTab === 'function'){
      const originalSetTab = window.gaokaoSetClassroomTab;
      window.gaokaoSetClassroomTab = function(tab){
        if(tab === 'memes'){
          switchView('memeshub');
          if(typeof showToast === 'function') showToast('梗图已统一放到“梗图总库”');
          return;
        }
        return originalSetTab(tab);
      };
    }
  }
  function reorderViews(){
    const ordered = {
      dashboard:'总览',
      recite:'背诵中枢',
      textmap:'文本题目映射',
      practice:'分题自测',
      writing:'写作强化',
      memeshub:'梗图总库',
      random:'随机抽取',
      games:'游戏实验室',
      knowledge:'方法库',
      paper:'整卷模式',
      classroom:'课堂教学',
      teacher:'教师工具',
      review:'复盘中心'
    };
    Object.keys(VIEW_LABELS).forEach(k => delete VIEW_LABELS[k]);
    Object.assign(VIEW_LABELS, ordered);
  }
  function patchedRenderApp(){
    ensurePatchState();
    patchExistingViews();
    reorderViews();
    if(typeof window.tpInjectCustomData === 'function') window.tpInjectCustomData();
    if(typeof renderSidebar === 'function') renderSidebar();
    const app = document.getElementById('app');
    const view = state.activeView || 'dashboard';
    let html = '';
    if(view === 'textmap') html = renderTextMap();
    else if(view === 'memeshub') html = renderMemeHub();
    else if(view === 'random') html = renderRandomHub();
    else if(view === 'games') html = renderGamesLab();
    else if(view === 'classroom' && typeof window.renderClassroomPanel === 'function') html = window.renderClassroomPanel();
    else if(view === 'teacher') html = `${typeof window.renderTaskDashboardPanel === 'function' ? window.renderTaskDashboardPanel() : ''}${typeof window.renderTeacherPlusPanel === 'function' ? window.renderTeacherPlusPanel() : ''}`;
    else if(view === 'recite' && typeof window.renderRecitePanel === 'function') html = window.renderRecitePanel();
    else if(view === 'knowledge') html = renderKnowledge();
    else if(view === 'practice') html = renderPractice();
    else if(view === 'paper') html = renderPaper();
    else if(view === 'writing') html = renderWriting();
    else if(view === 'review') html = renderReview();
    else html = renderEnhancedDashboard();
    app.innerHTML = html;
    document.body.classList.toggle('focus-mode', !!state.focusMode);
    if(view === 'paper') refreshPaperTimer();
    if(view === 'writing') refreshWritingLive(state.writingId);
    setTimeout(() => { if(typeof window.tpHydrateMediaPreviews === 'function') window.tpHydrateMediaPreviews(); }, 0);
  }

  window.v11SetMapField = setMapField;
  window.v11ToggleMapOnlyUncovered = toggleMapOnlyUncovered;
  window.v11SelectText = selectText;
  window.v11AnswerLinkedQuestion = answerLinkedQuestion;
  window.v11ResetLinkedQuestion = resetLinkedQuestion;
  window.v11SetMemeField = setMemeField;
  window.v11CaptureMemeFile = captureMemeFile;
  window.v11CreateMeme = createMeme;
  window.v11DeleteMeme = deleteMeme;
  window.v11ClearUploadedMemes = clearUploadedMemes;
  window.v11ExportMemes = exportMemes;
  window.v11SetRandomField = setRandomField;
  window.v11DrawNumbers = drawNumbers;
  window.v11DrawTexts = drawTexts;
  window.v11DrawMicro = drawMicro;
  window.v11DrawCombo = drawCombo;
  window.v11SetGameInput = setGameInput;
  window.v11SubmitGameInput = submitGameInput;
  window.v11AnswerGameChoice = answerGameChoice;
  window.v11ResetGame = resetGame;

  renderApp = patchedRenderApp;
  window.renderApp = renderApp;
  if(document.readyState !== 'loading') renderApp();
  else document.addEventListener('DOMContentLoaded', () => renderApp(), { once:true });
})();
