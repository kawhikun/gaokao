
(function(){
  const DATA13 = window.GAOKAO_V13_DATA || {stats:{},corpus:[],microBank:[],resources:[],gallery:[]};
  const OLD_RENDER = window.renderApp;
  function h(str){ if(typeof escapeHtml === 'function') return escapeHtml(str); return String(str==null?'':str).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
  function ensureV13(){
    if(!state.v13 || typeof state.v13 !== 'object') state.v13 = {};
    const v = state.v13;
    if(typeof v.coverageQuery !== 'string') v.coverageQuery = '';
    if(typeof v.coverageModule !== 'string') v.coverageModule = 'all';
    if(typeof v.coverageGenre !== 'string') v.coverageGenre = 'all';
    if(typeof v.coverageSelected !== 'string') v.coverageSelected = (DATA13.corpus[0] && DATA13.corpus[0].slug) || '';
    if(!v.answers || typeof v.answers !== 'object') v.answers = {};
    if(typeof v.resourceSource !== 'string') v.resourceSource = 'all';
    if(typeof v.resourceQuery !== 'string') v.resourceQuery = '';
    if(typeof v.galleryGroup !== 'string') v.galleryGroup = 'all';
  }
  function saveRender(){ if(typeof saveState==='function') saveState(); renderApp(); }
  function coverageRows(){
    ensureV13();
    const q = (state.v13.coverageQuery || '').trim();
    return DATA13.corpus.filter(item => {
      if(state.v13.coverageModule !== 'all' && item.module !== state.v13.coverageModule) return false;
      if(state.v13.coverageGenre !== 'all' && item.genre !== state.v13.coverageGenre) return false;
      if(q){ const hay = [item.title,item.author,item.module,item.background,item.themeLabel].join(' '); if(hay.indexOf(q) === -1) return false; }
      return true;
    });
  }
  function selectedCorpus(){
    ensureV13();
    const rows = coverageRows();
    return rows.find(x => x.slug === state.v13.coverageSelected) || rows[0] || DATA13.corpus[0] || null;
  }
  function microFor(slug){ return DATA13.microBank.filter(x => x.textId === slug); }
  function answerMicro(id, idx){ ensureV13(); const q = DATA13.microBank.find(x => x.id===id); if(!q) return; state.v13.answers[id] = idx; if(typeof saveState==='function') saveState(); renderApp(); }
  function setCoverageField(field,val){ ensureV13(); state.v13[field]=val; if(field!=='coverageSelected'){ const rows = coverageRows(); if(!rows.find(x=>x.slug===state.v13.coverageSelected)) state.v13.coverageSelected = (rows[0]&&rows[0].slug)||''; } saveRender(); }
  function renderCoverage(){
    ensureV13();
    const rows = coverageRows();
    const sel = selectedCorpus();
    const qs = sel ? microFor(sel.slug) : [];
    const modules = ['all'].concat(Array.from(new Set(DATA13.corpus.map(x=>x.module))));
    const genres = ['all'].concat(Array.from(new Set(DATA13.corpus.map(x=>x.genre))));
    const answered = Object.keys(state.v13.answers||{}).length;
    const body = `
      <section class="card hero">
        <div class="badge">全量配题中心</div>
        <h2 style="margin:12px 0 8px">61 篇文本 + 305 道升级微题</h2>
        <p class="muted">这里是独立于原“文本题目映射”的加强版：每篇 5 题，专门用来严查“有没有题、题够不够、能不能直接练”。</p>
        <div class="kv" style="margin-top:16px"><div class="stat"><strong>${DATA13.stats.texts||0}</strong><div class="small">文本总数</div></div><div class="stat"><strong>${DATA13.stats.microQuestions||0}</strong><div class="small">升级微题</div></div><div class="stat"><strong>${rows.length}</strong><div class="small">当前可见文本</div></div><div class="stat"><strong>${answered}</strong><div class="small">已作答题数</div></div></div>
        <div class="row" style="margin-top:14px"><a class="btn primary" href="./text-map.html">回原文本题目映射</a><a class="btn" href="./resources.html">去资料总库</a><a class="btn" href="./gallery.html">去板书图库</a></div>
      </section>
      <section class="grid2" style="padding:18px">
        <div class="card">
          <div class="row"><input placeholder="搜篇目 / 作者 / 模块 / 主旨" value="${h(state.v13.coverageQuery||'')}" oninput="v13SetCoverageField('coverageQuery',this.value)"></div>
          <div class="row" style="margin-top:12px">${modules.map(m=>`<button class="btn ${state.v13.coverageModule===m?'primary':''}" onclick="v13SetCoverageField('coverageModule','${h(m)}')">${h(m==='all'?'全部模块':m)}</button>`).join('')}</div>
          <div class="row" style="margin-top:12px">${genres.map(g=>`<button class="btn ${state.v13.coverageGenre===g?'primary':''}" onclick="v13SetCoverageField('coverageGenre','${h(g)}')">${h(g==='all'?'全部体裁':g)}</button>`).join('')}</div>
          <div style="max-height:980px;overflow:auto;margin-top:14px;display:flex;flex-direction:column;gap:10px">${rows.map((item,idx)=>`<button class="option ${sel&&sel.slug===item.slug?'correct':''}" onclick="v13SetCoverageField('coverageSelected','${item.slug}')"><strong>${idx+1}. ${h(item.title)}</strong><div class="small">${h(item.module)} · ${h(item.author||'佚名')} · ${h(item.genre)}</div><div class="small">${h(item.themeLabel||'')}</div></button>`).join('')}</div>
        </div>
        <div class="card">${sel ? `
            <div class="row"><span class="badge">${h(sel.module)}</span><span class="badge">${h(sel.genre)}</span><span class="badge">${h(sel.author||'佚名')}</span></div>
            <h3 style="margin-top:12px">${h(sel.title)}</h3>
            <div class="preview" style="margin-top:12px"><strong>写作背景</strong>\n${h(sel.background||'暂无背景说明。')}</div>
            <div class="preview" style="margin-top:12px"><strong>原文片段</strong>\n${h((sel.contentLines||[]).slice(0,10).join('\n'))}</div>
            <div class="small" style="margin-top:10px">主旨标签：${h(sel.themeLabel||'')}｜情感落点：${h(sel.emotion||'')}</div>
            ${qs.map((q,qi)=>{ const chosen = state.v13.answers[q.id]; return `<div class="card" style="margin-top:14px;padding:16px;border-radius:18px"><div class="small">${h(q.kind)}</div><div style="font-size:18px;line-height:1.85;margin-top:6px">${h(q.stem)}</div>${q.options.map((opt,idx)=>{ let cls='option'; if(chosen===idx) cls += ' active'; if(chosen!=null && idx===q.answer) cls += ' correct'; if(chosen!=null && chosen===idx && idx!==q.answer) cls += ' wrong'; return `<button class="${cls}" onclick="v13AnswerMicro('${q.id}',${idx})">${String.fromCharCode(65+idx)}. ${h(opt)}</button>`; }).join('')}<div class="preview" style="margin-top:12px"><strong>解析</strong>\n${h(q.analysis)}</div></div>`; }).join('')}
          ` : '<div class="preview">当前筛选下没有可显示的文本。</div>'}</div>
      </section>`;
    return body;
  }
  function resourceRows(){
    ensureV13();
    const q = (state.v13.resourceQuery||'').trim();
    return DATA13.resources.filter(item=>{
      if(state.v13.resourceSource!=='all' && item.source!==state.v13.resourceSource) return false;
      if(q){ const hay = [item.source,item.title,item.content].join(' '); if(hay.indexOf(q)===-1) return false; }
      return true;
    });
  }
  function renderResources(){
    ensureV13();
    const rows = resourceRows();
    const sources = ['all'].concat(Array.from(new Set(DATA13.resources.map(x=>x.source))));
    return `
      <section class="card hero"><div class="badge">资料总库</div><h2 style="margin:12px 0 8px">把你上传的速通资料做成可检索资料墙</h2><p class="muted">来源于现代文阅读 1/2、古代诗文阅读、写作和首课口子。现在不再只躺在 docx 里，能直接搜、直接翻。</p><div class="kv" style="margin-top:16px"><div class="stat"><strong>${DATA13.stats.resources||0}</strong><div class="small">资料卡片</div></div><div class="stat"><strong>${rows.length}</strong><div class="small">当前可见</div></div><div class="stat"><strong>${sources.length-1}</strong><div class="small">来源类型</div></div><div class="stat"><strong>${(state.v13.resourceQuery||'').trim()?'已检索':'全部'}</strong><div class="small">检索状态</div></div></div><div class="row" style="margin-top:14px"><a class="btn primary" href="./coverage-plus.html">去全量配题</a><a class="btn" href="./gallery.html">去板书图库</a></div></section>
      <section class="wrap"><div class="card"><div class="row"><input placeholder="搜标题 / 内容 / 来源" value="${h(state.v13.resourceQuery||'')}" oninput="v13SetCoverageField('resourceQuery',this.value)"></div><div class="row" style="margin-top:12px">${sources.map(s=>`<button class="btn ${state.v13.resourceSource===s?'primary':''}" onclick="v13SetCoverageField('resourceSource','${h(s)}')">${h(s==='all'?'全部来源':s)}</button>`).join('')}</div><div class="grid2" style="margin-top:16px">${rows.map(item=>`<div class="card"><div class="row"><span class="badge">${h(item.source)}</span></div><h3 style="margin-top:12px">${h(item.title)}</h3><div class="preview" style="margin-top:12px">${h(item.content)}</div></div>`).join('')}</div></div></section>`;
  }
  function renderGallery(){
    ensureV13();
    const groups = ['all'].concat(Array.from(new Set(DATA13.gallery.map(x=>x.group))));
    const rows = DATA13.gallery.filter(item=> state.v13.galleryGroup==='all' || item.group===state.v13.galleryGroup);
    return `
      <section class="card hero"><div class="badge">板书图库</div><h2 style="margin:12px 0 8px">把 7z 里的课件图统一收口到一页</h2><p class="muted">这里单独放板书图、读图截图和课件素材，不穿插到别的训练页里，避免页面越做越乱。</p><div class="kv" style="margin-top:16px"><div class="stat"><strong>${DATA13.stats.gallery||0}</strong><div class="small">图片总数</div></div><div class="stat"><strong>${groups.length-1}</strong><div class="small">分组</div></div><div class="stat"><strong>${rows.length}</strong><div class="small">当前可见</div></div><div class="stat"><strong>独立页</strong><div class="small">不混放</div></div></div><div class="row" style="margin-top:14px"><a class="btn primary" href="./meme-library.html">去梗图总库</a><a class="btn" href="./resources.html">去资料总库</a></div></section>
      <section class="wrap"><div class="card"><div class="row">${groups.map(g=>`<button class="btn ${state.v13.galleryGroup===g?'primary':''}" onclick="v13SetCoverageField('galleryGroup','${h(g)}')">${h(g==='all'?'全部分组':g)}</button>`).join('')}</div><div class="grid3" style="margin-top:16px">${rows.map(item=>`<div class="card img-card"><div class="small">${h(item.group)}</div><h3 style="margin-top:6px">${h(item.title)}</h3><img src="${h(item.src)}" alt="${h(item.title)}"><div class="row" style="margin-top:12px"><a class="btn" href="${h(item.src)}" target="_blank">打开大图</a></div></div>`).join('')}</div></div></section>`;
  }
  function reorder(){
    const ordered = {
      dashboard:'总览',
      recite:'背诵中枢',
      textmap:'文本题目映射',
      coverageplus:'全量配题',
      practice:'分题自测',
      writing:'写作强化',
      resources:'资料总库',
      memeshub:'梗图总库',
      gallery:'板书图库',
      random:'随机抽取',
      games:'游戏实验室',
      knowledge:'方法库',
      paper:'整卷模式',
      classroom:'课堂教学',
      teacher:'教师工具',
      review:'复盘中心'
    };
    Object.keys(VIEW_LABELS).forEach(k=>delete VIEW_LABELS[k]);
    Object.assign(VIEW_LABELS, ordered);
  }
  function injectDashboardCards(){
    const app = document.getElementById('app');
    if(!app || state.activeView!=='dashboard' || app.dataset.v13Cards==='1') return;
    const host = document.createElement('div');
    host.className = 'grid-3';
    host.style.marginTop = '18px';
    host.innerHTML = `
      <div class="card"><h3>全量配题</h3><div class="subtitle">61 篇文本 × 每篇 5 题，单独检查是否真的“篇篇有题”。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="switchView('coverageplus')">进入</button></div></div>
      <div class="card"><h3>资料总库</h3><div class="subtitle">把现代文、古诗文、写作、首课口子的 docx 全部拆成可搜资料卡。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="switchView('resources')">进入</button></div></div>
      <div class="card"><h3>板书图库</h3><div class="subtitle">把 7z 里的板书图和课件图单独归档，不与梗图混放。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="switchView('gallery')">进入</button></div></div>`;
    app.appendChild(host);
    app.dataset.v13Cards='1';
  }
  function renderAppV13(){
    ensureV13();
    reorder();
    const view = state.activeView || 'dashboard';
    if(view==='coverageplus' || view==='resources' || view==='gallery'){
      if(typeof renderSidebar==='function') renderSidebar();
      const app = document.getElementById('app');
      if(view==='coverageplus') app.innerHTML = renderCoverage();
      else if(view==='resources') app.innerHTML = renderResources();
      else app.innerHTML = renderGallery();
      document.body.classList.toggle('focus-mode', !!state.focusMode);
      return;
    }
    OLD_RENDER();
    injectDashboardCards();
  }
  window.v13SetCoverageField = setCoverageField;
  window.v13AnswerMicro = answerMicro;
  window.renderApp = renderAppV13;
  renderApp = renderAppV13;
})();
