(function(){
  const BUILD_TAG = '20260422-v15';
  const SITE_ID = 'gaokao';
  const SESSION_KEY = 'frz_gaokao_auth_session_v15';
  const CLOUD_STATUS_KEY = 'frz_gaokao_cloud_status_v15';
  const WRITING_RUBRIC = [
    { key:'score_a', label:'审题与立意', max:12, desc:'是否扣准材料对象、范围、主矛盾，中心论点是否明确。' },
    { key:'score_b', label:'内容与任务', max:12, desc:'是否回应材料任务，观点、例证、问题意识是否够完整。' },
    { key:'score_c', label:'结构与层次', max:12, desc:'标题、开头、分论点、结尾是否形成清晰递进。' },
    { key:'score_d', label:'分析与论证', max:12, desc:'是否写出原因链、做法目的与反身性，而不是只喊口号。' },
    { key:'score_e', label:'语言与表达', max:12, desc:'表达是否准确、连贯、克制，有没有明显病句和空转。' }
  ];
  const AUTH_STATE = {
    accountsMeta: null,
    session: null,
    cloudConfig: { enabled:false, endpoint:'', pullPath:'/state', pushPath:'/state', method:'PUT', debounceMs:1200, timeoutMs:10000, siteId:SITE_ID },
    cloudLoaded: false,
    syncPending: false,
    syncTimer: null,
    lastSyncAt: 0,
    lastSyncError: ''
  };

  function textToBytes(text){ return new TextEncoder().encode(String(text || '')); }
  function bytesToHex(bytes){ return Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join(''); }
  function bytesToB64(bytes){ let s=''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s); }
  function b64ToBytes(b64){ const bin = atob(String(b64 || '')); const out = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i); return out; }
  function escapeText(v){ return String(v == null ? '' : v); }
  function normalizeUsername(value){ return String(value || '').trim().toLowerCase(); }
  function buildVersionedUrl(path){ const sep = path.includes('?') ? '&' : '?'; return `${path}${sep}v=${BUILD_TAG}&ts=${Date.now()}`; }
  function parseTimeValue(value){ if(!value) return 0; const ts = new Date(value).getTime(); return Number.isFinite(ts) ? ts : 0; }
  function showMiniToast(msg){ try{ if(typeof showToast === 'function') showToast(msg); }catch(err){} }
  async function sha256HexText(text){ const digest = await crypto.subtle.digest('SHA-256', textToBytes(text)); return bytesToHex(new Uint8Array(digest)); }
  async function sha256HexBytes(bytes){ const digest = await crypto.subtle.digest('SHA-256', bytes); return bytesToHex(new Uint8Array(digest)); }
  async function deriveAuthMaterial(usernameNormalized, password, authSaltB64, iterations, accountNonce){
    const secret = `${password}::${usernameNormalized}::${accountNonce}`;
    const key = await crypto.subtle.importKey('raw', textToBytes(secret), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:b64ToBytes(authSaltB64), iterations:Number(iterations || 360000), hash:'SHA-256' }, key, 64 * 8);
    return new Uint8Array(bits);
  }
  function questionById(qid){ return typeof QUESTION_LOOKUP !== 'undefined' ? QUESTION_LOOKUP[qid] : null; }
  function registerQuestion(bankKey, item){
    if(!DATA || !DATA.banks || !DATA.banks[bankKey]) return;
    if(questionById(item.id)) return;
    DATA.banks[bankKey].items.push(item);
    const q = Object.assign({}, item, { bankKey, bankTitle: DATA.banks[bankKey].title, orderInBank: DATA.banks[bankKey].items.length });
    ALL_QUESTIONS.push(q);
    QUESTION_LOOKUP[q.id] = q;
  }
  function patchQuestion(qid, patch){ const q = questionById(qid); if(q) Object.assign(q, patch); }
  function weightByTotal(total){
    if(total >= 12) return [3,3,2,2,2];
    if(total === 10) return [3,2,2,2,1];
    if(total === 8) return [2,2,2,1,1];
    if(total === 6) return [2,1,1,1,1];
    if(total === 5) return [1,1,1,1,1];
    return [2,2,2,1,1];
  }
  function detectRubricType(q){
    const text = `${q.prompt || ''} ${q.stem || ''}`;
    if(/翻译/.test(text)) return 'translation';
    if(/拟.*问题|问题/.test(text) && /递进|围绕/.test(text)) return 'question_set';
    if(/赏析|鉴赏|意象|情感/.test(text)) return 'poetry';
    if(/比较|相似/.test(text)) return 'compare';
    if(q.bankKey === 'modern1') return 'modern1';
    if(q.bankKey === 'modern2') return 'modern2';
    if(q.bankKey === 'language') return 'language';
    if(q.bankKey === 'classical') return 'classical';
    return 'generic';
  }
  function rubricLabels(type){
    const base = {
      generic:['扣准题干对象与问法','关键信息基本完整','分点与结构较清楚','能把原因/作用/认识展开','表述准确、术语妥帖'],
      language:['扣准语用任务和输出格式','关键信息或修改点找全','分点/问句层次清楚','能说明改法或设计理由','表达简明、无明显病句'],
      modern1:['扣准论点、对象与设问方向','观点/论据/论证信息提取得当','分点顺序贴合题干','能解释逻辑、效果或思路','语言克制准确，不空转'],
      modern2:['扣准人物/情节/主题的分析方向','文本事实和关键细节抓取得当','分点结构清楚，有主次','能说明作用、意蕴与表达效果','表述准确，不脱离文本'],
      classical:['扣准语境与作答任务','实词/句式/信息点抓取得当','译句/概括分层清楚','能把语境补全到位','表达通顺准确'],
      translation:['扣准句意与语境对象','关键词义基本落实','句式和省略补全较好','整体译意连贯','语言通顺规范'],
      poetry:['扣准题材、意象与设问','关键诗句与意象提取得当','分点结构清楚','能说明手法如何服务情感','表述准确，不只贴标签'],
      compare:['比较对象和维度扣得准','双方信息抓取得当','分点并列清楚','能写出异同背后的原因或作用','表达规范、避免混淆'],
      question_set:['扣准核心话题与命题边界','问题覆盖关键信息','递进关系清楚','每一问都能触发有效分析','问句表达简明规范']
    };
    return base[type] || base.generic;
  }
  function buildFiveDimRubric(q){
    const oldTotal = (q.scoring || []).reduce((sum, item) => sum + Number(item.points || 0), 0) || Number(q.points || 8) || 8;
    const weights = weightByTotal(oldTotal);
    const labels = rubricLabels(detectRubricType(q));
    return labels.map((label, idx) => ({ points: weights[idx], label: `【${WRITING_RUBRIC[idx].label.replace('与','/')}】${label}` })).filter(item => Number(item.points || 0) > 0);
  }
  function patchAllSubjectiveRubrics(){
    ALL_QUESTIONS.forEach(q => {
      if(q.type !== 'subjective') return;
      q.difficulty = '提升';
      q.scoring = buildFiveDimRubric(q);
      if(!Array.isArray(q.traps)) q.traps = [];
      ['答案格式不贴题','只贴标签不分析'].forEach(tag => { if(!q.traps.includes(tag)) q.traps.push(tag); });
    });
  }
  function installObjectiveHardMode(){
    const hard = {
      'basic-punc-01': {
        difficulty:'提升',
        stem:'下列句子中分号使用最恰当的一项是（ ）。',
        options:[
          '先做问答题，再做选择题；因为这样更容易定位材料观点。',
          '作者先写江面上炸弹坠落、水柱腾起；又写难民逆江而上、队伍西行。',
          '判断选项时不仅要看对象、范围、逻辑；还要看语气和程度是否一致。',
          '他把错题分成“偷换对象”“范围扩大”“因果强加”三类；她则把同类题按文本体裁再分一遍。'
        ],
        answer:3,
        analysis:'D 前后是结构相当的并列分句，前一分句内部已有较复杂停顿，使用分号最能分层。A 是因果承接，B、C 更适合用逗号连接，不必强行拉开分号层级。',
        traps:['把分号只当“停顿更长的逗号”','忽视分句内部是否已有复杂停顿'],
        hints:['分号最稳的环境，是并列分句内部已经有较复杂停顿。','先判断前后关系是不是并列，而不是只看语气。']
      },
      'basic-word-01': {
        difficulty:'提升',
        stem:'依次填入下列横线处的词语，最恰当的一项是（ ）。\n①研究团队在月壤样本中不断________新的矿物信息。\n②真正成熟的论证，不只是把观点摆出来，还要把观点层层________出来。',
        options:['发现 / 阐释','发掘 / 表白','发明 / 呈现','发表 / 说明'],
        answer:0,
        analysis:'第一空说“信息”，最稳的是“发现”；第二空强调把观点一步步说深，说“阐释”最贴切。其余搭配要么对象不当，要么语体不合。',
        traps:['只看近义词外形，不看搭配对象','把“信息”误当可直接“发明”的事物'],
        hints:['先区分第一空是“找到已有之物”还是“创造新事物”。','第二空要体现层层展开。']
      },
      'basic-idiom-01': {
        difficulty:'提升',
        stem:'下列对成语使用的判断，最恰当的一项是（ ）。',
        options:[
          '面对反复出现的同类误判，他不再头痛医头，而是釜底抽薪，直接改掉自己的审题顺序。',
          '作者只用一个生活细节就带出整段情绪，可谓一蹴而就。',
          '把并列与递进都看成结构优势，说明他在论证分析上左右逢源。',
          '题干还没看全就急着下结论，这种做法可算未雨绸缪。'
        ],
        answer:0,
        analysis:'A 的“釜底抽薪”强调从根本上解决问题，用来写从改流程入手最贴切。B 把创作完成得快误当“一蹴而就”；C“左右逢源”褒义失当；D“未雨绸缪”与冒进误判相反。',
        traps:['只记成语大概语气，不核对本义','褒贬色彩和语境方向不一致'],
        hints:['先把成语翻译成白话，再放回句子。','警惕“看起来都像好词”的误导。']
      },
      'basic-grammar-01': {
        difficulty:'提升',
        stem:'下列句子中没有语病的一项是（ ）。',
        options:[
          '通过给每道题补上错因标签，使复盘不再停留在“知道答案”。',
          '把观点能否落实到材料之中，是区分空泛议论和有效分析的关键。',
          '学生既要概括文本事实，也要在此基础上分析其背后的逻辑，这样答案才不会空转。',
          '围绕同一则材料展开多角度追问，能够防止不把作文写成口号。'
        ],
        answer:2,
        analysis:'C 主干完整，逻辑顺畅。A 滥用“通过……使……”导致主语残缺；B“把……是……”结构杂糅；D 否定不当。',
        traps:['没有先压缩主干','只凭耳感判断'],
        hints:['先问“这句话是谁在干什么”。','留意“通过……使……”“把……是……”等高频警报。']
      },
      'basic-seq-01': {
        difficulty:'提升',
        stem:'把下列句子填入横线处，衔接最恰当的一项是（ ）。\n真正有效的复盘，不是把错题和答案各抄一遍，________，再回到同类题验证规则是否可靠。',
        options:[
          '而是先定位误判发生在哪一环，再提炼可迁移的判断标准',
          '而是先提炼通用规则，再回头分辨自己错在哪一环',
          '所以只要把解析背熟，下一次通常就不会再错',
          '并且先扩大刷题量，再考虑方法是否稳定'
        ],
        answer:0,
        analysis:'后文已有“再回到同类题验证”，横线处应先完成“定位错误—提炼规则”这两个前置动作。A 顺序最稳，B 把“找错因”放在“立规则”之后，逻辑倒置。',
        traps:['只看句子顺口不看动作链','忽视“先—再—最后”的时间顺序'],
        hints:['先找句中的步骤信号词。','复盘不是直接记答案，而是先定位失误。']
      },
      'basic-rhetoric-01': {
        difficulty:'提升',
        stem:'下列对修辞和表达方式的判断，正确的一项是（ ）。',
        options:[
          '“算法把人推回熟悉立场”把“算法”人格化，主要运用了借代。',
          '“疲惫像没电的手机一样迅速关机”把人的状态比作手机电量，属于明喻。',
          '“楼道里静得只剩下手机屏幕的蓝光”把视觉写成听觉，属于通感。',
          '“喜鹊登梅”中“梅”与“眉”谐音，因此属于引用。'
        ],
        answer:1,
        analysis:'B 以“像……一样”直接比喻人的疲惫状态，属于明喻。A 是拟人而非借代；C 并非感官转写；D 属谐音双关，不是引用。',
        traps:['把拟人、借代、通感混为一谈','只认术语，不看句中到底发生了什么'],
        hints:['先判断有没有“把A直接说成B”或“像B一样”的结构。','通感要有感官之间的转移。']
      },
      'lang-2025-q19': {
        difficulty:'提升',
        stem:'填入横线处的句子，衔接最恰当的一项是（ ）。',
        options:[
          '网络空间中的谐音双关更加常见，一些“谐音梗”甚至进一步进入线下日常表达。',
          '网络空间中的谐音双关更加常见，一些线下日常表达甚至源自网络“谐音梗”。',
          '谐音双关在网络空间更为活跃，一些“谐音梗”还会反向进入大众日常表达。',
          '谐音双关在网络空间更为活跃，一些大众日常表达还会反向进入网络“谐音梗”。'
        ],
        answer:2,
        analysis:'C 最好地承接了“网络空间”这一对象，同时用“反向进入大众日常表达”点明由网络扩散到现实的路径。A、B 语义接近但衔接力度稍弱，D 方向颠倒。',
        traps:['只看近义替换，不看承接对象和传播方向','忽视“网络→大众表达”的路径'],
        hints:['先看前句最后落在哪里，再选最顺的承接对象。','注意传播方向不能写反。']
      },
      'lang-2025-q20': {
        difficulty:'提升',
        stem:'若原句想突出“被多套规则同时牵扯，一时不知道先按哪一套做”，下列词语中不恰当的一项是（ ）。',
        options:['无所适从','不知所措','手足无措','茫然若失'],
        answer:3,
        analysis:'“茫然若失”更偏失落、怅惘，不突出“多套规则同时牵扯而不知先从何处着手”的意味；其余三项都能较好体现一时不知如何应对。',
        traps:['近义词情绪色彩不分','不看语境要求强调“多种规则并置”'],
        hints:['区分“慌乱”与“无所遵循”的差别。','题干强调的不是心情空落，而是行动选择失序。']
      },
      'modern1-2025-q1': {
        difficulty:'提升',
        stem:'下列对原文相关内容的理解和分析，正确的一项是（ ）',
        options:[
          '材料把阴雨、过肥与烈日勤浇并列为致腐原因，意在说明根部腐烂主要取决于天气而不是管理方式。',
          '问三和问十四都先顺着常识或表层经验发问，再由回答者纠正“看似有理”的认识。',
          '问八“尚有三端”和问十五“尚有一端”都只是对前文种植步骤的补充，没有转入更深层的辨析。',
          '材料的整体结构先谈栽花技术，后谈固定栽植后的养护常识，两部分界限泾渭分明、互不交叉。'
        ],
        answer:1,
        analysis:'B 扣住了材料“先顺常识发问、再予纠偏”的论证方式。A 把管理原因偷换成天气决定；C、D 都把材料后段的辨析性内容缩减为单纯步骤补充。',
        traps:['把条件偷换成决定因素','把补充性辨析误判为简单罗列'],
        hints:['注意材料是不是在“顺常识—纠偏”。','判断结构时别把后半段的辨析写扁。']
      },
      'modern1-2024-q2': {
        difficulty:'提升',
        stem:'下列对材料相关内容的理解和分析，不正确的一项是（ ）',
        options:[
          '土星5号体型庞大，主要因为从发射到近月阶段都需要携带逃逸塔、指令舱和登月舱等整套装置共同前进。',
          '鹰号飞过预定区域后仍继续寻找更合适地点，材料强调的是着陆过程中的临机处置，而非慌乱失控。',
          '嫦娥三号和玉兔一号的成功着陆、巡视，被材料视作我国后续月面探测继续推进的重要基础。',
          '玉兔二号带回的新资料，使人类对月背地质环境的认识比以往更进一步。'
        ],
        answer:0,
        analysis:'A 把“逃逸塔”等装置一直带到近月阶段说得过满，属于范围扩大。B、C、D 都能与材料表述对应。',
        traps:['把某一阶段携带的装置误说成全程随行','把“阶段性存在”扩大为“全过程存在”'],
        hints:['航天材料里要特别注意阶段边界。','“一直”“全程”这类词最容易出错。']
      },
      'modern2-2025-q6': {
        difficulty:'提升',
        stem:'下列对文本相关内容和艺术特色的分析鉴赏，正确的一项是（ ）',
        options:[
          '开头把长江东流与难民西行、炸弹下坠与水柱腾起并置，镜头切换迅速，战时压迫感因此被具体化。',
          '“江水像条怒龙”主要象征难民终将反击的力量，因此整段获得了鲜明的英雄化色彩。',
          '寒风、阳光、彩虹在文中都被稳定写成希望意象，所以全文基调始终向上。',
          '老舍在文本二中最终离开武汉，说明他已完全认同“离开”这一选择，不再存在任何犹疑。'
        ],
        answer:0,
        analysis:'A 既抓住了并置镜头，也抓住了战时压迫感的形成方式。B、C、D 都把复杂情绪和多层含义说得过满、过直。',
        traps:['把氛围描写过度英雄化','把复杂情绪判断成单一向上'],
        hints:['先看文本是不是“并置两个方向/动作”。','文学分析最忌把情绪写成单线条。']
      },
      'modern2-2024-q6': {
        difficulty:'提升',
        stem:'下列对文本相关内容的理解，正确的一项是（ ）',
        options:[
          '“两个她”一实一虚，直接说明叶桃性格跳脱多变，让陈千里始终无法判断她的真实想法。',
          '叶桃反复提到南京小吃，说明她已经摆脱地下工作的紧张状态，开始沉浸于市民式享乐。',
          '她把橘红糕扔到一边，是因为私人情绪凌驾于任务要求之上，暴露出组织纪律上的松动。',
          '“现在她可以说了”与此前的沉默形成对照，突出了地下工作者在不同处境中对信息分寸的严格把控。'
        ],
        answer:3,
        analysis:'D 扣住了地下工作情境中的“信息分寸”。A、B、C 都把人物复杂心理和行为动机简单化、道德化了。',
        traps:['把叙事视角误判为人物性格定论','把紧张情境中的行为道德化'],
        hints:['注意“之前不能说”与“现在可以说”的条件变化。','不要把复杂情境简化成情绪失控。']
      },
      'classical-2025-q10': {
        difficulty:'提升',
        stem:'下列断句组合中，最符合文意的一项是（ ）',
        options:[
          '夫鲁国A有患者B君臣父子C皆被其辱D祸E及众庶F妇人G独安H所避乎！——选 A C F',
          '夫鲁国A有患者B君臣父子C皆被其辱D祸E及众庶F妇人G独安H所避乎！——选 B D F',
          '夫鲁国A有患者B君臣父子C皆被其辱D祸E及众庶F妇人G独安H所避乎！——选 C E G',
          '夫鲁国A有患者B君臣父子C皆被其辱D祸E及众庶F妇人G独安H所避乎！——选 B F G'
        ],
        answer:1,
        analysis:'按意群看，“有患者”为一层，“皆被其辱”为一层，“祸及众庶”为一层，“妇人独安所避乎”单独成句，B 最顺。',
        traps:['只凭语感乱断','忽视固定句法和反问句整体'],
        hints:['先找主谓宾，再看反问句结尾是否完整。','“独安所避乎”不要拆散。']
      },
      'classical-2024-q11': {
        difficulty:'提升',
        stem:'下列对材料中加点词语及相关内容的解说，不正确的一项是（ ）',
        options:[
          '“燕”同“宴”，并可直接说与成语“新婚燕尔”中的“燕”意义完全相同，均指宴饮之乐。',
          '“怪”在句中是意动用法，与《师说》“不耻相师”的“耻”一样，都可理解为“以……为……”。',
          '“为寿”指向尊长举杯祝福，其礼仪内涵与《鸿门宴》“奉卮酒为寿”相近。',
          '“式”同“轼”，指扶轼致敬，与《周亚夫军细柳》“改容式车”中的“式”相同。'
        ],
        answer:0,
        analysis:'A 把两处“燕”机械等同，属于偷换。B、C、D 都能与课内文化常识互证。',
        traps:['见到通假字就急着套成语','忽视具体语境与成语固定义差别'],
        hints:['成语迁移要“可参照”，不是“可生搬硬套”。','文化常识题也要看所在语境。']
      },
      'poetry-2025-q15': {
        difficulty:'提升',
        stem:'下列对这首诗的理解和赏析，不正确的一项是（ ）',
        options:[
          '首联入题较快，在点出所咏之砚的同时，也把友人题诗这一赠答情境带了出来。',
          '诗人从名称、颜色、产地环境等方面写砚，咏物之中已暗伏对友人的评价。',
          '友人馈砚又题诗，使诗里“物”与“人”两层线索彼此照应，感念之情因而更深。',
          '“洗处无瑕”说明这方砚先前只是表面覆有尘垢，一经清洗便完全恢复本色。'
        ],
        answer:3,
        analysis:'D 把“洗处无瑕”说成单纯“表面脏污”过实、过浅。A、B、C 都较好抓住了咏物与赠答的双线结构。',
        traps:['把含蓄写法实化成字面说明','忽视咏物与写人的双层关系'],
        hints:['咏物诗常常不只写“物”本身。','“洗处无瑕”要联系整首的托物意味。']
      },
      'poetry-2024-q15': {
        difficulty:'提升',
        stem:'下列对这首诗的理解和赏析，不正确的一项是（ ）',
        options:[
          '雨后景色并未自动带来闲适，开篇的“不寐”已经透露出诗人心绪难平。',
          '次句所写城头传角，使夜色中平添军旅紧张感，与辛词“梦回吹角连营”在氛围上有可通之处。',
          '“阶前虫语”直接打断了诗人的登高望远，因此诗歌由宏阔骤然转为琐碎，只能视作偶然性的情绪中断。',
          '颈联通过江水、星空等物象拉开时空尺度，使苍茫寂寥的境界感进一步扩展。'
        ],
        answer:2,
        analysis:'C 把“阶前虫语”的作用说成单纯偶然中断，低估了它在情绪收束和境界转折中的意味。A、B、D 都能从诗句中找到依据。',
        traps:['把诗歌转折机械理解为“被打断”','忽视细小物象在情绪收束中的作用'],
        hints:['末句的虫语不是闲笔。','看它是否参与了由外向内的情绪回落。']
      }
    };
    Object.entries(hard).forEach(([qid, patch]) => patchQuestion(qid, patch));
  }
  function addOriginalQuestions(){
    registerQuestion('language', {
      id:'lang-2026-orig-q24',
      type:'subjective',
      sourceType:'original',
      source:'原创·高迷惑语用',
      difficulty:'提升',
      subtype:'压缩与评述',
      prompt:'请把下面这段话压缩成两句话：第一句概括现实处境，第二句指出其深层机制。总字数不超过55字。',
      answerShell:['第1句先概括表层现象，不展开评论。','第2句点出机制，用“本质上/深层看/背后是”转入。'],
      fullPassage:'材料：一些年轻人在绩效考核、平台排名和持续比较中越来越不愿主动联络亲友。他们表面上只是“懒得联系”，但实际上，时间被切碎、交往被工具化、人的价值被单一指标衡量，才让关系越来越像“额外成本”。',
      fullPassageMode:'full_text',
      referenceAnswer:[
        '示例一：一些年轻人在绩效与排名压力下日渐减少与亲友的主动联系。其背后是劳动异化挤压了时间与情感，把关系也推向了工具化。',
        '示例二：青年“断联”表面是社交退缩，实则是指标化生活把时间切碎、把交往成本化。'
      ],
      methodPath:['先抽表层现象，再抽深层机制。','第二句不要重复第一句，而要回答“为什么会这样”。','压缩题要保留关键词，不要另起话题。'],
      hints:['先找材料中的“表面—实质”结构。','第二句最稳的进入方式是“其背后是……”。'],
      traps:['答案格式不贴题','只写表层不写机制','把机制写成空泛价值判断']
    });
    registerQuestion('modern1', {
      id:'modern1-2026-orig-q4',
      type:'subjective',
      sourceType:'original',
      source:'原创·算法规训材料',
      difficulty:'提升',
      subtype:'观点概括与分析',
      prompt:'结合材料，概括“算法规训”为何既改变了信息接受方式，也改变了公共表达方式。',
      answerShell:['先写信息接受如何被定向、筛选、收窄。','再写公共表达如何因立场固化而走向情绪化。','最后点明二者之间的因果勾连。'],
      fullPassage:'材料：平台会根据用户停留时长、点击偏好和互动历史，不断向其推送更容易继续停留的信息。起初，用户只是觉得“内容越来越懂我”；但久而久之，接触面被悄悄收窄，对不同处境的理解能力也随之下降。当争议话题出现时，人们更容易把不同意见理解为对自身立场的冒犯，于是表达迅速滑向情绪化、标签化和群体对立。',
      fullPassageMode:'full_text',
      referenceAnswer:[
        '算法规训首先通过定向推送收窄了用户的信息接触面，使人更难接触舒适圈外的内容。其次，信息来源的单一化又削弱了对他人处境的理解能力，争议出现时，人们更容易把不同意见当成立场冒犯，公共表达于是滑向情绪化、标签化和对立化。',
        '也可概括为：它先改变“看见什么”，再改变“怎样说话”；前者收窄认知边界，后者加剧情绪对撞。'
      ],
      methodPath:['现代文问答先概括观点，再组织因果。','先写“信息接受”这一层，再写“公共表达”这一层。','最后别忘记写两层之间如何连起来。'],
      hints:['材料中有明显的“起初—久而久之—当……时”结构。','不要把“表达方式改变”只写成“大家吵起来了”，要写原因。'],
      traps:['只摘事实不概括观点','只写结果不写机制','两层内容写成并列堆砌']
    });
    registerQuestion('modern2', {
      id:'modern2-2026-orig-q9',
      type:'subjective',
      sourceType:'original',
      source:'原创·文学类片段',
      difficulty:'提升',
      subtype:'物象作用',
      prompt:'文中多次写到“电梯门开了又合”，这一反复出现的细节有何作用？请结合全文分点分析。',
      answerShell:['先写它在情节上怎样形成等待、停顿或节奏感。','再写它如何映照人物处境或心理。','最后写它怎样把个人经验推向更广阔的现实背景。'],
      fullPassage:'楼道里很安静，只有电梯每隔一会儿“叮”地一声。她抱着快递盒站在门口，听见电梯门开了，又合；开了，又合，却没有人真正停在这一层。她本来想给母亲回个电话，手指在通讯录上悬了很久，又慢慢退回去。楼下外卖员催单的电话响个不停，群聊里同事还在转发新的绩效排名。电梯门第三次打开时，她忽然觉得这声音像某种礼貌而冷淡的询问——问她要不要下去，问她还回不回去，问她是不是已经习惯把“稍后再说”当成生活本身。',
      fullPassageMode:'full_text',
      referenceAnswer:[
        '其一，反复写电梯门开合，形成了一种悬而未决的节奏，使“等电话、等回应、等自己做决定”的情境被具体化。其二，这一机械重复的动作映照出人物犹疑、退缩而又被不断催逼的心理状态。其三，电梯作为城市生活中的日常装置，把个体的迟疑与绩效压力、亲缘疏离等更广阔的现实处境勾连起来，使片段具有了超出个人私事的社会意味。'
      ],
      methodPath:['文学类先抓反复出现的细节。','再从情节—人物—主题三层展开。','不要只说“渲染气氛”，要写渲染了什么。'],
      hints:['“开了又合”首先是节奏问题。','它为什么总是“没有人真正停在这一层”？'],
      traps:['只写氛围不写人物','只写人物不写现实意味','答案格式不贴题']
    });
    DATA.writingPrompts.push({
      id:'writing-2026-orig-kpi',
      source:'2026 原创押题',
      title:'当评价系统成为生活底色',
      material:'材料一：一些学校和企业倾向于用可量化指标判断一个人的“价值”，例如排名、绩效、曝光、点击、转化。\n材料二：有人说，指标能提高效率；也有人担心，若一切都只剩可比较的数据，人会逐渐把自己和他人都看成可替换的工具。\n以上材料引发了你怎样的联想与思考？',
      topicType:'效率与人的关系',
      pain:'当排名、绩效与可量化结果不断前移时，效率逻辑可能挤压人的情感、兴趣与关系。',
      causeChain:['劳动异化：评价单一化，使人把自身价值绑在外部指标上。','算法规训：平台化比较与实时反馈加剧了持续自我监控。','个体化竞争：人在“只能靠自己证明自己”的焦虑中更易把关系成本化。'],
      thesis:'效率工具本应服务人的发展，而不是反过来规定人的全部价值；真正成熟的社会，应让指标回到辅助判断的位置，让人重新拥有多元的价值坐标。',
      bullets:['先承认指标的必要性：复杂社会确需某种可比、可管、可执行的标准。','再指出问题：当指标从工具滑向唯一尺度，人会把自己和他人都工具化。','接着写破局：以多元价值、关系修复和主体性恢复来抵抗单一评价。','最后反思：反对“唯指标”并不等于反对规则，而是反对规则吞没人。'],
      titleOptions:['别让指标替人活着','让效率回到工具的位置','当评价系统成为生活底色'],
      checklist:['有没有先承认指标的必要性，再展开批评？','有没有把“问题”写到人的情感、关系与主体性上？','有没有提出可操作的多元价值重建路径？','结尾是否避免把反指标写成反规则？']
    });
    try{
      if(typeof WRITING_LOOKUP !== 'undefined') WRITING_LOOKUP['writing-2026-orig-kpi'] = DATA.writingPrompts[DATA.writingPrompts.length - 1];
    }catch(err){}
  }
  function relabelWritingRubricDom(){
    const totalEl = document.getElementById('writingScoreTotal');
    if(!totalEl) return;
    const firstInput = document.querySelector('input[oninput*="score_a"]') || document.querySelector('.grid-3 .block input[type="number"]');
    if(!firstInput) return;
    const scoreGrid = firstInput.closest('.grid-3');
    if(!scoreGrid) return;
    const labels = Array.from(scoreGrid.querySelectorAll('.block > strong'));
    const inputs = Array.from(scoreGrid.querySelectorAll('.block input[type="number"]'));
    WRITING_RUBRIC.forEach((item, idx) => {
      const strong = labels[idx];
      const input = inputs[idx];
      if(strong) strong.textContent = `${item.label}（${item.max}）`;
      if(input){
        input.max = String(item.max);
        input.placeholder = item.desc;
        if(!input.dataset.frzRubricBound){
          input.addEventListener('input', () => {
            const num = Math.max(0, Math.min(item.max, Number(input.value || 0) || 0));
            if(String(num) !== String(input.value)) input.value = String(num);
          });
          input.dataset.frzRubricBound = '1';
        }
      }
      if(strong && !strong.nextElementSibling?.classList?.contains('frz-rubric-desc')){
        const div = document.createElement('div');
        div.className = 'small frz-rubric-desc';
        div.style.marginTop = '6px';
        div.textContent = item.desc;
        strong.parentNode.insertBefore(div, strong.nextSibling);
      }
    });
    let bandEl = document.getElementById('writingBandLabel');
    if(!bandEl && totalEl.parentNode){
      bandEl = document.createElement('div');
      bandEl.id = 'writingBandLabel';
      bandEl.className = 'small';
      bandEl.style.marginTop = '8px';
      totalEl.parentNode.appendChild(bandEl);
    }
    if(bandEl){
      const total = Number(totalEl.textContent || 0) || 0;
      bandEl.textContent = `站内档位：${total >= 54 ? 'A 档' : total >= 48 ? 'B+ 档' : total >= 42 ? 'B 档' : total >= 36 ? 'C 档' : 'D 档'}`;
    }
  }
  function enhancePaperWritingDom(){
    const section = document.getElementById('paper-section-writing');
    if(!section) return;
    const preset = PAPER_LOOKUP[state.paperPreset] || DATA.paperPresets[0];
    const session = getPaperSession(preset.id);
    if(!session.writing || typeof session.writing !== 'object') session.writing = { title:'', outline:'', score:0 };
    WRITING_RUBRIC.forEach(item => {
      if(typeof session.writing[item.key] !== 'number') session.writing[item.key] = 0;
    });
    const oldBox = Array.from(section.querySelectorAll('.block')).find(x => x.textContent && x.textContent.includes('写作计分'));
    if(!oldBox) return;
    oldBox.innerHTML = `<strong>五维作文评分（60 分）</strong><div class="subtitle" style="margin-top:8px">按高考作文常见评分维度拆成五项，系统自动汇总到本卷总分。</div>${WRITING_RUBRIC.map(item => `<label class="block" style="margin-top:12px"><strong>${item.label}</strong><div class="small" style="margin-top:6px">${item.desc}</div><input class="input frz-paper-writing-score" data-key="${item.key}" type="number" min="0" max="${item.max}" value="${escapeHtml(session.writing[item.key] || 0)}"></label>`).join('')}<div class="small" style="margin-top:10px">当前合计：<strong id="paperWritingRubricTotal">${WRITING_RUBRIC.reduce((s,item)=>s+(Number(session.writing[item.key]||0)||0),0)}</strong>/60</div>`;
    oldBox.querySelectorAll('.frz-paper-writing-score').forEach(input => {
      if(input.dataset.bound) return;
      input.dataset.bound = '1';
      input.addEventListener('input', () => {
        const key = input.getAttribute('data-key');
        const conf = WRITING_RUBRIC.find(x => x.key === key);
        const max = conf ? conf.max : 12;
        const value = Math.max(0, Math.min(max, Number(input.value || 0) || 0));
        if(String(value) !== String(input.value)) input.value = String(value);
        session.writing[key] = value;
        session.writing.score = WRITING_RUBRIC.reduce((s, item) => s + (Number(session.writing[item.key] || 0) || 0), 0);
        saveState();
        const totalEl = document.getElementById('paperWritingRubricTotal');
        if(totalEl) totalEl.textContent = String(session.writing.score);
        const row = Array.from(document.querySelectorAll('table tbody tr')).find(tr => tr.children[0] && tr.children[0].textContent === '写作');
        if(row && row.children[1]) row.children[1].textContent = `${session.writing.score || 0}/60`;
      });
    });
  }
  function decorateSidebarAuth(){
    const brand = document.querySelector('.brand');
    if(!brand) return;
    let box = document.getElementById('frz-auth-summary');
    if(!box){
      box = document.createElement('div');
      box.id = 'frz-auth-summary';
      box.className = 'block';
      box.style.marginTop = '12px';
      brand.appendChild(box);
    }
    const sync = AUTH_STATE.lastSyncError ? `云同步：${AUTH_STATE.lastSyncError}` : (AUTH_STATE.lastSyncAt ? `云同步：${new Date(AUTH_STATE.lastSyncAt).toLocaleString('zh-CN', {hour12:false})}` : '云同步：未连接');
    box.innerHTML = AUTH_STATE.session ? `<strong>账号已登录</strong><div class="small" style="margin-top:8px">${escapeText(AUTH_STATE.session.usernameDisplay || AUTH_STATE.session.usernameNormalized)}</div><div class="small" style="margin-top:4px">${sync}</div><div class="toolbar" style="margin-top:10px"><button class="btn secondary" type="button" id="frzLogoutBtn">退出登录</button><button class="btn secondary" type="button" id="frzPullBtn">拉取云端</button></div>` : `<strong>会员模式已开启</strong><div class="small" style="margin-top:8px">请先登录后再使用整站数据保存与云同步。</div>`;
    const logoutBtn = document.getElementById('frzLogoutBtn');
    if(logoutBtn) logoutBtn.onclick = logoutNow;
    const pullBtn = document.getElementById('frzPullBtn');
    if(pullBtn) pullBtn.onclick = async () => {
      const ok = await cloudPull();
      showMiniToast(ok ? '已拉取云端最新数据' : '当前未连接云端');
    };
  }
  function installPatchStyles(){
    if(document.getElementById('frz-gaokao-v15-style')) return;
    const style = document.createElement('style');
    style.id = 'frz-gaokao-v15-style';
    style.textContent = `
      .frz-auth-overlay{position:fixed;inset:0;background:rgba(12,18,30,.62);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px;z-index:12000}
      .frz-auth-panel{width:min(560px,100%);background:#fff;border:1px solid #dbe6f4;border-radius:28px;box-shadow:0 30px 90px rgba(0,0,0,.18);padding:24px}
      .frz-auth-panel h2{margin:0;font-size:28px;line-height:1.25}
      .frz-auth-panel p{margin:10px 0 0;color:#62748a;line-height:1.8}
      .frz-auth-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
      .frz-auth-badges{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
      .frz-auth-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:#eef5ff;border:1px solid #d8e8fb;color:#123a64;font-size:12px;font-weight:600}
      .frz-auth-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
      .frz-auth-status{margin-top:12px;font-size:13px;color:#62748a;line-height:1.7}
    `;
    document.head.appendChild(style);
  }
  function injectAuthShell(){
    if(document.getElementById('frzAuthOverlay')) return;
    installPatchStyles();
    const overlay = document.createElement('div');
    overlay.id = 'frzAuthOverlay';
    overlay.className = 'frz-auth-overlay';
    overlay.innerHTML = `
      <div class="frz-auth-panel">
        <h2>高考系统 v15 · 会员密码版</h2>
        <p>这一版已经把高迷惑题、原创问答、五维评分和云同步脚手架一起接进来了。请输入账号和密码后进入系统。</p>
        <div class="frz-auth-badges"><span class="frz-auth-badge">选择题高迷惑</span><span class="frz-auth-badge">问答/作文五维评分</span><span class="frz-auth-badge">云同步可接入</span></div>
        <div class="frz-auth-row">
          <input class="input" id="frzAuthUser" placeholder="账号">
          <input class="input" id="frzAuthPass" type="password" placeholder="密码">
        </div>
        <div class="frz-auth-actions">
          <button class="btn" type="button" id="frzAuthLoginBtn">登录进入</button>
          <button class="btn secondary" type="button" id="frzAuthRefreshBtn">重新读取账号</button>
        </div>
        <div class="frz-auth-status" id="frzAuthStatus">正在读取账号库……</div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('frzAuthLoginBtn').onclick = loginNow;
    document.getElementById('frzAuthRefreshBtn').onclick = async () => { await loadAccountLibrary(true); await tryAutoLogin(); };
    ['frzAuthUser','frzAuthPass'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.addEventListener('keydown', e => { if(e.key === 'Enter') loginNow(); });
    });
  }
  function setAuthStatus(text){ const el = document.getElementById('frzAuthStatus'); if(el) el.textContent = text; }
  function showAuthGate(text){ const el = document.getElementById('frzAuthOverlay'); if(el) el.style.display = 'flex'; if(text) setAuthStatus(text); }
  function hideAuthGate(){ const el = document.getElementById('frzAuthOverlay'); if(el) el.style.display = 'none'; }
  function saveSession(session){ localStorage.setItem(SESSION_KEY, JSON.stringify(session)); AUTH_STATE.session = session; }
  function loadSession(){ try{ const raw = localStorage.getItem(SESSION_KEY); if(!raw) return null; const s = JSON.parse(raw); if(!s || Number(s.expiresAt || 0) < Date.now()) return null; return s; }catch(err){ return null; } }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); AUTH_STATE.session = null; }
  function getAccountStatus(account){
    if(!account) return { ok:false, message:'账号不存在。' };
    if(account.enabled === false) return { ok:false, message:'账号已停用，请联系维护者。' };
    const now = Date.now();
    const start = parseTimeValue(account.notBefore); if(start && now < start) return { ok:false, message:'账号尚未生效。' };
    const end = parseTimeValue(account.expiresAt); if(end && now > end) return { ok:false, message:'账号已到期。' };
    return { ok:true, message:'' };
  }
  async function loadCloudConfig(){
    if(AUTH_STATE.cloudLoaded) return AUTH_STATE.cloudConfig;
    AUTH_STATE.cloudLoaded = true;
    try{
      const resp = await fetch(buildVersionedUrl('./cloud-sync.config.json'), { cache:'no-store' });
      if(resp.ok){
        const data = await resp.json();
        AUTH_STATE.cloudConfig = Object.assign({}, AUTH_STATE.cloudConfig, data || {});
      }
    }catch(err){}
    return AUTH_STATE.cloudConfig;
  }
  async function loadAccountLibrary(force){
    if(AUTH_STATE.accountsMeta && !force) return AUTH_STATE.accountsMeta;
    setAuthStatus('正在读取 accounts.json ……');
    try{
      const resp = await fetch(buildVersionedUrl('./accounts.json'), { cache:'no-store' });
      if(!resp.ok) throw new Error('未检测到 accounts.json');
      const meta = await resp.json();
      if(!meta || !Array.isArray(meta.accounts)) throw new Error('accounts.json 格式不正确');
      AUTH_STATE.accountsMeta = meta;
      setAuthStatus(`账号库已加载：${meta.accounts.length} 个账号可用。`);
      return meta;
    }catch(err){
      AUTH_STATE.accountsMeta = null;
      setAuthStatus('未读取到有效的 accounts.json，请确认根目录已上传账号文件。');
      return null;
    }
  }
  async function findAccountByLogin(usernameNormalized){
    if(!AUTH_STATE.accountsMeta || !Array.isArray(AUTH_STATE.accountsMeta.accounts)) return { account:null, status:null };
    for(const account of AUTH_STATE.accountsMeta.accounts){
      const loginHash = await sha256HexText(`${usernameNormalized}::${account.loginSalt}`);
      if(loginHash !== account.loginHash) continue;
      return { account, status:getAccountStatus(account) };
    }
    return { account:null, status:null };
  }
  async function verifyAccount(account, usernameNormalized, password){
    const material = await deriveAuthMaterial(usernameNormalized, password, account.authSalt, account.iterations, account.accountNonce);
    const verifyKey = material.slice(0, 32);
    const verifyHash = await sha256HexBytes(verifyKey);
    if(verifyHash !== account.verifyHash) return null;
    return { syncToken: bytesToB64(verifyKey) };
  }
  async function cloudHeaders(){
    return {
      'Content-Type':'application/json',
      'x-frz-site-id': SITE_ID,
      'x-frz-account-id': AUTH_STATE.session.accountId,
      'x-frz-sync-token': AUTH_STATE.session.syncToken
    };
  }
  async function cloudPull(){
    const cfg = await loadCloudConfig();
    if(!cfg.enabled || !cfg.endpoint || !AUTH_STATE.session) return false;
    try{
      const url = `${cfg.endpoint.replace(/\/$/, '')}${cfg.pullPath || '/state'}?site=${encodeURIComponent(cfg.siteId || SITE_ID)}&account=${encodeURIComponent(AUTH_STATE.session.accountId)}`;
      const resp = await fetch(url, { method:'GET', headers: await cloudHeaders(), cache:'no-store' });
      if(resp.status === 404) return false;
      if(!resp.ok) throw new Error(`云端拉取失败：${resp.status}`);
      const payload = await resp.json();
      if(payload && payload.state && typeof hydrateState === 'function'){
        state = hydrateState(payload.state);
        if(typeof saveState === 'function') saveState();
        if(typeof renderApp === 'function') renderApp();
      }
      AUTH_STATE.lastSyncAt = Date.now();
      AUTH_STATE.lastSyncError = '';
      localStorage.setItem(CLOUD_STATUS_KEY, JSON.stringify({ at:AUTH_STATE.lastSyncAt, error:'' }));
      decorateSidebarAuth();
      return true;
    }catch(err){
      AUTH_STATE.lastSyncError = err && err.message ? err.message : '拉取失败';
      localStorage.setItem(CLOUD_STATUS_KEY, JSON.stringify({ at:AUTH_STATE.lastSyncAt || 0, error:AUTH_STATE.lastSyncError }));
      decorateSidebarAuth();
      return false;
    }
  }
  async function cloudPushNow(){
    const cfg = await loadCloudConfig();
    if(!cfg.enabled || !cfg.endpoint || !AUTH_STATE.session) return false;
    try{
      const url = `${cfg.endpoint.replace(/\/$/, '')}${cfg.pushPath || '/state'}`;
      const resp = await fetch(url, {
        method: cfg.method || 'PUT',
        headers: await cloudHeaders(),
        body: JSON.stringify({ siteId: cfg.siteId || SITE_ID, accountId: AUTH_STATE.session.accountId, updatedAt:new Date().toISOString(), state })
      });
      if(!resp.ok) throw new Error(`云端保存失败：${resp.status}`);
      AUTH_STATE.lastSyncAt = Date.now();
      AUTH_STATE.lastSyncError = '';
      localStorage.setItem(CLOUD_STATUS_KEY, JSON.stringify({ at:AUTH_STATE.lastSyncAt, error:'' }));
      decorateSidebarAuth();
      return true;
    }catch(err){
      AUTH_STATE.lastSyncError = err && err.message ? err.message : '保存失败';
      localStorage.setItem(CLOUD_STATUS_KEY, JSON.stringify({ at:AUTH_STATE.lastSyncAt || 0, error:AUTH_STATE.lastSyncError }));
      decorateSidebarAuth();
      return false;
    }
  }
  function scheduleCloudPush(){
    clearTimeout(AUTH_STATE.syncTimer);
    AUTH_STATE.syncTimer = setTimeout(() => { cloudPushNow(); }, Number(AUTH_STATE.cloudConfig.debounceMs || 1200));
  }
  async function loginNow(){
    if(!AUTH_STATE.accountsMeta) await loadAccountLibrary(true);
    const userEl = document.getElementById('frzAuthUser');
    const passEl = document.getElementById('frzAuthPass');
    const usernameDisplay = (userEl && userEl.value || '').trim();
    const password = (passEl && passEl.value || '').trim();
    const usernameNormalized = normalizeUsername(usernameDisplay);
    if(!usernameNormalized || !password){ setAuthStatus('请输入账号和密码。'); return; }
    setAuthStatus('正在验证账号……');
    const match = await findAccountByLogin(usernameNormalized);
    if(!match.account){ setAuthStatus('账号或密码不正确。'); return; }
    if(!match.status || !match.status.ok){ setAuthStatus(match.status ? match.status.message : '账号不可用。'); return; }
    const verified = await verifyAccount(match.account, usernameNormalized, password);
    if(!verified){ setAuthStatus('账号或密码不正确。'); return; }
    saveSession({ accountId: match.account.accountId, usernameDisplay, usernameNormalized, syncToken: verified.syncToken, expiresAt: Date.now() + 12 * 60 * 60 * 1000 });
    await loadCloudConfig();
    await cloudPull();
    hideAuthGate();
    decorateSidebarAuth();
    if(typeof renderApp === 'function') renderApp();
    showMiniToast('登录成功');
  }
  async function tryAutoLogin(){
    const session = loadSession();
    if(!session) return false;
    AUTH_STATE.session = session;
    await loadCloudConfig();
    await cloudPull();
    hideAuthGate();
    decorateSidebarAuth();
    return true;
  }
  function logoutNow(){ clearSession(); showAuthGate('已退出，请重新登录。'); decorateSidebarAuth(); }
  function patchSaveStateForCloud(){
    const originalSaveState = saveState;
    saveState = function(){
      originalSaveState();
      if(AUTH_STATE.session) scheduleCloudPush();
    };
    window.saveState = saveState;
  }
  function enhanceAfterRender(){
    try{ relabelWritingRubricDom(); }catch(err){}
    try{ enhancePaperWritingDom(); }catch(err){}
    try{ decorateSidebarAuth(); }catch(err){}
  }
  function wrapRenderApp(){
    const originalRenderApp = renderApp;
    renderApp = function(){
      const result = originalRenderApp();
      setTimeout(enhanceAfterRender, 0);
      return result;
    };
    window.renderApp = renderApp;
  }
  function patchWritingFieldClamp(){
    const originalUpdateWritingField = updateWritingField;
    updateWritingField = function(promptId, field, value){
      const conf = WRITING_RUBRIC.find(x => x.key === field);
      let nextValue = value;
      if(conf){ nextValue = String(Math.max(0, Math.min(conf.max, Number(value || 0) || 0))); }
      return originalUpdateWritingField(promptId, field, nextValue);
    };
    window.updateWritingField = updateWritingField;
  }
  function restoreCloudStatus(){
    try{
      const raw = localStorage.getItem(CLOUD_STATUS_KEY);
      if(!raw) return;
      const parsed = JSON.parse(raw);
      AUTH_STATE.lastSyncAt = Number(parsed.at || 0);
      AUTH_STATE.lastSyncError = parsed.error || '';
    }catch(err){}
  }

  patchSaveStateForCloud();
  patchWritingFieldClamp();
  installObjectiveHardMode();
  addOriginalQuestions();
  patchAllSubjectiveRubrics();
  wrapRenderApp();
  injectAuthShell();
  restoreCloudStatus();
  loadAccountLibrary(false).then(() => tryAutoLogin()).then(() => { if(!AUTH_STATE.session) showAuthGate(document.getElementById('frzAuthStatus')?.textContent || '请先登录。'); });
  window.FRZ_AUTH_GAOKAO = { state: AUTH_STATE, pull: cloudPull, push: cloudPushNow, logout: logoutNow };
})();
