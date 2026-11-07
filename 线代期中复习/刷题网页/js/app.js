/* app.js — 刷题网页主逻辑：hash 路由 + 视图渲染 + KaTeX 逐卡渲染 + 判分交互
 * 依赖顺序：katex.min.js → data.js (LA_DATA) → grader.js (Grader) → store.js (Store) → app.js
 */
(function () {
  'use strict';
  var DATA = window.LA_DATA, Grader = window.Grader, Store = window.Store;
  var TOPICS = DATA.topics, TIERS = DATA.tiers;
  var app = document.getElementById('app');

  var state = {
    list: DATA.questions.slice(),       // 当前题目列表（受筛选/组卷控制）
    index: 0,                            // 当前题在 list 中的位置
    filters: { topic: 'all', tier: 'all' },
    quizInput: null,                     // 当前题的用户输入
    quizVerdict: null,                   // '对'|'半对'|'错'|null
    paper: null                          // 组卷会话 {questions:[id...], idx, results:{}}
  };

  /* ---------- 工具 ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function findQ(id) {
    for (var i = 0; i < DATA.questions.length; i++) if (DATA.questions[i].id === id) return DATA.questions[i];
    return null;
  }

  // 逐卡 KaTeX 渲染：把 \(...\) 与 $$...$$ 渲染进容器
  function renderMath(container) {
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (node) {
      var s = node.nodeValue;
      if (s.indexOf('\\(') === -1 && s.indexOf('$$') === -1) return;
      var frag = document.createDocumentFragment();
      var re = /\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)/g;
      var last = 0, m;
      while ((m = re.exec(s)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var tex = (m[1] !== undefined ? m[1] : m[2]).trim();
        var span = document.createElement('span');
        span.className = 'katex-inline';
        try {
          katex.render(tex, span, { throwOnError: false, strict: false, displayMode: m[1] !== undefined });
        } catch (e) { span.textContent = tex; }
        frag.appendChild(span);
        last = re.lastIndex;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function getProgress() { return Store.getProgress(); }
  function statusBadge(id) {
    var p = getProgress()[id];
    if (!p) return '';
    var cls = p.last === '对' ? 'st-ok' : (p.last === '半对' ? 'st-half' : 'st-bad');
    var icon = p.last === '对' ? '✓' : (p.last === '半对' ? '△' : '✗');
    return '<span class="badge ' + cls + '" title="共答 ' + p.a + ' 次">' + icon + ' ' + p.a + '</span>';
  }
  function isFav(id) { return Store.getFavorites().indexOf(id) !== -1; }

  /* ---------- 路由 ---------- */
  function parseRoute() {
    var h = location.hash || '#/home';
    var parts = h.replace(/^#\//, '').split('/');
    return { name: parts[0] || 'home', arg: parts[1] || null };
  }

  function router() {
    var r = parseRoute();
    state.quizInput = null; state.quizVerdict = null;
    if (r.name === 'quiz' && r.arg) return viewQuiz(r.arg);
    if (r.name === 'wrong') return viewWrong();
    if (r.name === 'fav') return viewFav();
    if (r.name === 'stats') return viewStats();
    if (r.name === 'paper') return viewPaperSetup();
    if (r.name === 'paperrun') return viewPaperRun();
    if (r.name === 'papersummary') return viewPaperSummary();
    return viewHome();
  }

  /* ---------- 视图：首页选题 ---------- */
  function viewHome() {
    var f = state.filters;
    app.innerHTML = '';
    var header = el('div', 'view-head');
    header.innerHTML = '<h1>📖 线代刷题</h1><p class="sub">共 ' + DATA.questions.length + ' 题 · 按知识点与难度筛选 · 答题记录自动保存</p>';
    app.appendChild(header);

    var chips = el('div', 'chips');
    var tchips = [['all', '全部']].concat(Object.keys(TOPICS).map(function (k) { return [k, TOPICS[k].cn]; }));
    tchips.forEach(function (c) {
      var b = el('button', 'chip' + (f.topic === c[0] ? ' on' : ''), esc(c[1]));
      b.onclick = function () { f.topic = c[0]; viewHome(); };
      chips.appendChild(b);
    });
    app.appendChild(chips);

    var chips2 = el('div', 'chips');
    [['all', '全部难度'], ['basic', '基础'], ['classic', '经典'], ['hard', '难题']].forEach(function (c) {
      var b = el('button', 'chip' + (f.tier === c[0] ? ' on' : ''), esc(c[1]));
      b.onclick = function () { f.tier = c[0]; viewHome(); };
      chips2.appendChild(b);
    });
    app.appendChild(chips2);

    var list = DATA.questions.filter(function (q) {
      return (f.topic === 'all' || q.topic === f.topic) && (f.tier === 'all' || q.tier === f.tier);
    });
    state.list = list;

    var count = el('p', 'count-note', '共 ' + list.length + ' 题');
    app.appendChild(count);

    var ul = el('div', 'q-list');
    list.forEach(function (q, i) {
      var card = el('div', 'q-card');
      var meta = '<span class="tag tag-topic">' + esc(TOPICS[q.topic].cn) + '</span>' +
        '<span class="tag tag-' + q.tier + '">' + esc(TIERS[q.tier]) + '</span>' +
        '<span class="tag tag-type">' + esc(typeCn(q.type)) + '</span>' +
        statusBadge(q.id) +
        (isFav(q.id) ? '<span class="star">⭐</span>' : '');
      var stem = (Store.getSettings().showEn ? q.stemEn : q.stemCn);
      card.innerHTML = '<div class="q-meta">' + meta + '</div><div class="q-stem">' + stem.slice(0, 140) + (stem.length > 140 ? '…' : '') + '</div>';
      card.onclick = function () {
        state.index = i;
        location.hash = '#/quiz/' + q.id;
      };
      ul.appendChild(card);
    });
    app.appendChild(ul);
    renderMath(app);

    var nav = navBar('home');
    app.appendChild(nav);
  }

  function typeCn(t) {
    return { single: '单选', multi: '多选', numeric: '填空', expression: '填空', judge: '判断' }[t] || t;
  }

  /* ---------- 视图：做题 ---------- */
  function viewQuiz(id) {
    var q = findQ(id);
    if (!q) { location.hash = '#/home'; return; }
    var settings = Store.getSettings();
    app.innerHTML = '';

    var head = el('div', 'view-head quiz-head');
    head.innerHTML =
      '<button class="back" data-nav="home">← 返回列表</button>' +
      '<div class="q-meta"><span class="tag tag-topic">' + esc(TOPICS[q.topic].cn) + '</span>' +
      '<span class="tag tag-' + q.tier + '">' + esc(TIERS[q.tier]) + '</span>' +
      '<span class="tag tag-type">' + esc(typeCn(q.type)) + '</span>' +
      '<span class="qid">' + q.id + '</span>' +
      '<button class="fav-btn" data-fav="' + q.id + '">' + (isFav(q.id) ? '⭐' : '☆') + '</button></div>';
    app.appendChild(head);

    // 中英切换
    var lang = el('div', 'lang-toggle');
    lang.innerHTML = '<button class="chip' + (settings.showEn ? ' on' : '') + '" data-lang="en">English 题干</button>' +
      '<button class="chip' + (!settings.showEn ? ' on' : '') + '" data-lang="cn">中文翻译</button>';
    app.appendChild(lang);

    var card = el('div', 'quiz-card');
    card.innerHTML = '<div class="stem">' + (settings.showEn ? q.stemEn : q.stemCn) + '</div>' +
      '<div class="stem-cn small">' + (settings.showEn ? q.stemCn : '') + '</div>';
    app.appendChild(card);

    // 作答区
    var ansArea = el('div', 'answer-area');
    ansArea.appendChild(buildInput(q));
    var submitBtn = el('button', 'btn primary submit', '提交答案');
    ansArea.appendChild(submitBtn);
    app.appendChild(ansArea);

    // 反馈区
    var feedback = el('div', 'feedback hidden');
    app.appendChild(feedback);

    submitBtn.onclick = function () {
      var input = collectInput(q);
      if (input === null) { feedback.className = 'feedback'; feedback.innerHTML = '<div class="banner banner-warn">⚠️ 请先作答</div>'; renderMath(feedback); return; }
      state.quizInput = input;
      state.quizVerdict = Grader.grade(q, input);
      Store.record(q.id, state.quizVerdict);
      showFeedback(q, feedback, ansArea);
    };

    // 事件绑定（返回 / 收藏 / 语言 / 键盘提交）
    head.querySelector('[data-nav]').onclick = function () { location.hash = '#/home'; };
    head.querySelector('[data-fav]').onclick = function () {
      var on = Store.toggleFavorite(q.id);
      this.textContent = on ? '⭐' : '☆';
    };
    lang.querySelectorAll('[data-lang]').forEach(function (b) {
      b.onclick = function () {
        Store.saveSettings({ showEn: b.dataset.lang === 'en' });
        viewQuiz(q.id);
      };
    });
    document.onkeydown = function (e) { if (e.key === 'Enter' && e.ctrlKey) submitBtn.click(); };

    // 上一题 / 下一题
    var navRow = el('div', 'quiz-nav');
    navRow.innerHTML = '<button class="btn" data-prev>← 上一题</button><span class="pos">' +
      (state.index + 1) + ' / ' + state.list.length + '</span><button class="btn" data-next>下一题 →</button>';
    navRow.querySelector('[data-prev]').onclick = function () { gotoNeighbor(-1); };
    navRow.querySelector('[data-next]').onclick = function () { gotoNeighbor(1); };
    app.appendChild(navRow);
    app.appendChild(navBar('quiz'));
    renderMath(app);
  }

  function gotoNeighbor(dir) {
    if (!state.list.length) return;
    var ni = state.index + dir;
    if (ni < 0 || ni >= state.list.length) return;
    state.index = ni;
    location.hash = '#/quiz/' + state.list[ni].id;
  }

  function buildInput(q) {
    var box = el('div', 'input-box');
    if (q.type === 'single' || q.type === 'multi') {
      q.options.forEach(function (o, i) {
        var label = el('label', 'opt');
        var letter = String.fromCharCode(65 + i);
        label.innerHTML = '<input type="' + (q.type === 'single' ? 'radio' : 'checkbox') + '" name="opt" value="' + letter + '">' +
          '<span class="opt-text">' + o + '</span>';
        box.appendChild(label);
      });
    } else if (q.type === 'judge') {
      box.innerHTML = '<label class="opt"><input type="radio" name="opt" value="true"><span class="opt-text">True（真）</span></label>' +
        '<label class="opt"><input type="radio" name="opt" value="false"><span class="opt-text">False（假）</span></label>';
    } else if (q.answer.type === 'matrix') {
      box.innerHTML = '<p class="small">矩阵输入格式：每行用分号分隔，如 <code>1 2; 3 4</code>（行列可换行写）</p>' +
        '<textarea class="text-input" rows="3" placeholder="1 2; 3 4"></textarea>';
    } else if (q.answer.type === 'vector') {
      box.innerHTML = '<p class="small">向量输入格式：分量用逗号或空格分隔，如 <code>1, -2, 3</code></p>' +
        '<input class="text-input" placeholder="如：1, -2, 3">';
    } else if (q.answer.type === 'expression') {
      box.innerHTML = '<p class="small">可输入分数、根号等表达式，如 <code>3/2</code>、<code>√(2)</code>、<code>2×10⁻⁵</code></p>' +
        '<input class="text-input" placeholder="如：3/2 或 √(2)">';
    } else {
      box.innerHTML = '<p class="small">可输入小数、分数或表达式，如 <code>0.5</code>、<code>3/2</code>、<code>√(2)</code></p>' +
        '<input class="text-input" placeholder="输入数值">';
    }
    return box;
  }

  function collectInput(q) {
    var box = app.querySelector('.input-box');
    if (q.type === 'single' || q.type === 'judge') {
      var r = box.querySelector('input[type="radio"]:checked');
      return r ? r.value : null;
    }
    if (q.type === 'multi') {
      var cs = box.querySelectorAll('input[type="checkbox"]:checked');
      if (!cs.length) return null;
      return Array.prototype.map.call(cs, function (c) { return c.value; });
    }
    var t = box.querySelector('.text-input');
    if (!t || !t.value.trim()) return null;
    return t.value.trim();
  }

  function showFeedback(q, fb, ansArea) {
    var v = state.quizVerdict;
    var cls = v === '对' ? 'banner-ok' : (v === '半对' ? 'banner-half' : 'banner-bad');
    var txt = v === '对' ? '✅ 回答正确！' : (v === '半对' ? '⚠️ 半对——部分正确，看看解析' : '❌ 回答错误');
    fb.className = 'feedback';
    fb.innerHTML = '<div class="banner ' + cls + '">' + txt + '</div>';
    if (v !== '对') {
      fb.innerHTML += '<div class="correct-show">正确答案：<b>' + esc(formatAnswerText(q)) + '</b></div>';
    }
    if (q.hintCn) fb.innerHTML += '<details class="hint"><summary>💡 提示</summary>' + q.hintCn + '</details>';
    fb.innerHTML += '<div class="solution"><b>解析：</b>' + q.solutionCn + '</div>';
    renderMath(fb);
    ansArea.querySelectorAll('input, textarea, button').forEach(function (i) { i.disabled = true; });
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatAnswerText(q) {
    var a = q.answer;
    if (a.type === 'choice') return '选项 ' + a.value;
    if (a.type === 'choices') return '选项 ' + a.value.join(', ');
    if (a.type === 'judge') return a.value ? 'True' : 'False';
    if (a.type === 'expression') return a.value;
    if (a.type === 'matrix') return a.value.map(function (r) { return r.join(' '); }).join(' ; ');
    if (a.type === 'vector') return '(' + a.value.join(', ') + ')';
    return String(a.value);
  }

  /* ---------- 视图：错题本 / 收藏 / 统计 ---------- */
  function viewWrong() {
    app.innerHTML = '';
    app.appendChild(el('div', 'view-head', '<h1>📝 错题本</h1><p class="sub">答错的题自动收录；重做答对后自动移出</p>'));
    var ids = Store.getWrongbook();
    if (!ids.length) {
      app.appendChild(el('div', 'empty', '🎉 错题本是空的，继续保持！'));
    } else {
      ids.forEach(function (id) {
        var q = findQ(id);
        if (!q) return;
        var p = getProgress()[id] || {};
        var card = el('div', 'q-card');
        card.innerHTML = '<div class="q-meta"><span class="tag tag-topic">' + esc(TOPICS[q.topic].cn) + '</span>' +
          '<span class="tag tag-' + q.tier + '">' + esc(TIERS[q.tier]) + '</span>' +
          '<span class="badge st-bad">✗ ' + (p.w || 0) + ' 次错</span></div>' +
          '<div class="q-stem">' + (q.stemCn || q.stemEn).slice(0, 120) + '…</div>';
        card.onclick = function () { location.hash = '#/quiz/' + id; };
        app.appendChild(card);
      });
    }
    app.appendChild(navBar('wrong'));
    renderMath(app);
  }

  function viewFav() {
    app.innerHTML = '';
    app.appendChild(el('div', 'view-head', '<h1>⭐ 收藏夹</h1><p class="sub">收藏的重点题目</p>'));
    var ids = Store.getFavorites();
    if (!ids.length) {
      app.appendChild(el('div', 'empty', '还没有收藏题目。做题页点 ☆ 即可收藏。'));
    } else {
      ids.forEach(function (id) {
        var q = findQ(id);
        if (!q) return;
        var card = el('div', 'q-card');
        card.innerHTML = '<div class="q-meta"><span class="tag tag-topic">' + esc(TOPICS[q.topic].cn) + '</span>' +
          '<span class="tag tag-' + q.tier + '">' + esc(TIERS[q.tier]) + '</span>' + statusBadge(id) + '</div>' +
          '<div class="q-stem">' + (q.stemCn || q.stemEn).slice(0, 120) + '…</div>';
        card.onclick = function () { location.hash = '#/quiz/' + id; };
        app.appendChild(card);
      });
    }
    app.appendChild(navBar('fav'));
    renderMath(app);
  }

  function viewStats() {
    app.innerHTML = '';
    app.appendChild(el('div', 'view-head', '<h1>📊 进度统计</h1><p class="sub">正确率 =（答对数 + 半对数×0.5）/ 答题数</p>'));
    var s = Store.stats();
    var total = s.total;
    var overall = total.a ? Math.round(100 * (total.c + 0.5 * total.h) / total.a) : 0;

    var card = el('div', 'stats-card');
    card.innerHTML = '<h2>总进度</h2>' +
      '<p>已答题数：<b>' + total.a + '</b> / ' + DATA.questions.length + '（答对 ' + total.c + '，半对 ' + total.h + '）</p>' +
      barHtml(overall, '总体正确率');
    app.appendChild(card);

    var cardT = el('div', 'stats-card');
    cardT.innerHTML = '<h2>按知识点</h2>';
    Object.keys(TOPICS).forEach(function (t) {
      var d = s.byTopic[t];
      if (!d) { cardT.innerHTML += '<p class="dim">' + esc(TOPICS[t].cn) + '：未作答</p>'; return; }
      var pct = Math.round(100 * d.s / d.a);
      cardT.innerHTML += '<p>' + esc(TOPICS[t].cn) + '（' + d.a + ' 题）</p>' + barHtml(pct);
    });
    app.appendChild(cardT);

    var cardR = el('div', 'stats-card');
    cardR.innerHTML = '<h2>按难度</h2>';
    Object.keys(TIERS).forEach(function (t) {
      var d = s.byTier[t];
      if (!d) { cardR.innerHTML += '<p class="dim">' + esc(TIERS[t]) + '：未作答</p>'; return; }
      var pct = Math.round(100 * d.s / d.a);
      cardR.innerHTML += '<p>' + esc(TIERS[t]) + '（' + d.a + ' 题）</p>' + barHtml(pct);
    });
    app.appendChild(cardR);

    var reset = el('button', 'btn danger', '清空全部记录');
    reset.onclick = function () {
      if (confirm('确定清空答题记录、错题本与收藏吗？')) { Store.resetAll(); viewStats(); }
    };
    app.appendChild(reset);
    app.appendChild(navBar('stats'));
  }

  function barHtml(pct, label) {
    var color = pct >= 80 ? '#4a7c59' : (pct >= 50 ? '#c9973f' : '#b5544f');
    return '<div class="bar-row">' + (label ? '<span class="bar-label">' + esc(label) + '</span>' : '') +
      '<div class="bar"><div class="bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
      '<span class="bar-pct">' + pct + '%</span></div>';
  }

  /* ---------- 视图：随机组卷 ---------- */
  function viewPaperSetup() {
    app.innerHTML = '';
    app.appendChild(el('div', 'view-head', '<h1>🎲 随机组卷</h1><p class="sub">按知识点/难度抽题，顺序作答模拟考试</p>'));
    var pending = Store.getPaper();
    if (pending && pending.questions && pending.idx < pending.questions.length) {
      var resume = el('div', 'box resume-box');
      resume.innerHTML = '<p>上次组卷未完成（进度 ' + (pending.idx) + '/' + pending.questions.length + '）</p>' +
        '<button class="btn primary" data-resume>继续做</button><button class="btn" data-discard>放弃</button>';
      app.appendChild(resume);
      resume.querySelector('[data-resume]').onclick = function () { location.hash = '#/paperrun'; };
      resume.querySelector('[data-discard]').onclick = function () { Store.clearPaper(); viewPaperSetup(); };
    }

    var form = el('div', 'box paper-form');
    form.innerHTML = '<h3>题数</h3>';
    app.appendChild(form);
    var cntRow = el('div', 'chips');
    [5, 10, 15, 20].forEach(function (n) {
      var b = el('button', 'chip' + (state.paperCount === n ? ' on' : ''), String(n));
      b.onclick = function () { state.paperCount = n; viewPaperSetup(); };
      cntRow.appendChild(b);
    });
    state.paperCount = state.paperCount || 10;
    form.appendChild(cntRow);

    form.innerHTML += '<h3>知识点（可多选，默认全部）</h3>';
    var tRow = el('div', 'chips');
    form.appendChild(tRow);
    state.paperTopics = state.paperTopics || null;
    var tc = [['all', '全部']].concat(Object.keys(TOPICS).map(function (k) { return [k, TOPICS[k].cn]; }));
    tc.forEach(function (c) {
      var b = el('button', 'chip' + ((state.paperTopics === null && c[0] === 'all') || (state.paperTopics && state.paperTopics.indexOf(c[0]) !== -1) ? ' on' : ''), esc(c[1]));
      b.onclick = function () {
        if (c[0] === 'all') state.paperTopics = null;
        else {
          state.paperTopics = state.paperTopics || [];
          var i = state.paperTopics.indexOf(c[0]);
          if (i === -1) state.paperTopics.push(c[0]); else state.paperTopics.splice(i, 1);
          if (!state.paperTopics.length) state.paperTopics = null;
        }
        viewPaperSetup();
      };
      tRow.appendChild(b);
    });

    form.innerHTML += '<h3>难度（可多选，默认全部）</h3>';
    var dRow = el('div', 'chips');
    form.appendChild(dRow);
    state.paperTiers = state.paperTiers || null;
    [['all', '全部'], ['basic', '基础'], ['classic', '经典'], ['hard', '难题']].forEach(function (c) {
      var b = el('button', 'chip' + ((state.paperTiers === null && c[0] === 'all') || (state.paperTiers && state.paperTiers.indexOf(c[0]) !== -1) ? ' on' : ''), esc(c[1]));
      b.onclick = function () {
        if (c[0] === 'all') state.paperTiers = null;
        else {
          state.paperTiers = state.paperTiers || [];
          var i = state.paperTiers.indexOf(c[0]);
          if (i === -1) state.paperTiers.push(c[0]); else state.paperTiers.splice(i, 1);
          if (!state.paperTiers.length) state.paperTiers = null;
        }
        viewPaperSetup();
      };
      dRow.appendChild(b);
    });

    var wrongToggle = el('label', 'opt');
    wrongToggle.innerHTML = '<input type="checkbox" id="preferWrong"' + (state.paperWrong ? ' checked' : '') + '><span class="opt-text">优先抽错题本中的题</span>';
    form.appendChild(wrongToggle);
    wrongToggle.querySelector('input').onchange = function () { state.paperWrong = this.checked; };

    var start = el('button', 'btn primary big', '开始组卷');
    form.appendChild(start);
    start.onclick = function () {
      var pool = DATA.questions.filter(function (q) {
        return (state.paperTopics === null || state.paperTopics.indexOf(q.topic) !== -1) &&
          (state.paperTiers === null || state.paperTiers.indexOf(q.tier) !== -1);
      });
      if (!pool.length) { alert('筛选条件下没有题目'); return; }
      var wrongIds = Store.getWrongbook();
      var picked = [];
      if (state.paperWrong && wrongIds.length) {
        wrongIds.forEach(function (id) {
          var q = findQ(id);
          if (q && pool.indexOf(q) !== -1 && picked.indexOf(id) === -1) picked.push(id);
        });
      }
      var rest = pool.map(function (q) { return q.id; }).filter(function (id) { return picked.indexOf(id) === -1; });
      // 洗牌
      for (var i = rest.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = rest[i]; rest[i] = rest[j]; rest[j] = t; }
      while (picked.length < state.paperCount && rest.length) picked.push(rest.shift());
      picked = picked.slice(0, state.paperCount);
      if (!picked.length) { alert('没有可抽的题'); return; }
      Store.savePaper({ questions: picked, idx: 0, results: {}, started: Date.now() });
      state.paper = Store.getPaper();
      location.hash = '#/paperrun';
    };

    app.appendChild(navBar('paper'));
  }

  function viewPaperRun() {
    var p = Store.getPaper();
    if (!p || p.idx >= p.questions.length) { location.hash = '#/papersummary'; return; }
    var q = findQ(p.questions[p.idx]);
    if (!q) { p.idx++; Store.savePaper(p); viewPaperRun(); return; }
    app.innerHTML = '';

    var head = el('div', 'view-head quiz-head');
    head.innerHTML = '<span class="tag tag-paper">🎲 组卷中</span><span class="pos">第 ' + (p.idx + 1) + ' / ' + p.questions.length + ' 题</span>' +
      '<button class="back" data-quit>退出组卷</button>';
    app.appendChild(head);
    head.querySelector('[data-quit]').onclick = function () { location.hash = '#/paper'; };

    var card = el('div', 'quiz-card');
    card.innerHTML = '<div class="q-meta"><span class="tag tag-topic">' + esc(TOPICS[q.topic].cn) + '</span>' +
      '<span class="tag tag-' + q.tier + '">' + esc(TIERS[q.tier]) + '</span><span class="qid">' + q.id + '</span></div>' +
      '<div class="stem">' + q.stemEn + '</div>';
    app.appendChild(card);

    var ansArea = el('div', 'answer-area');
    ansArea.appendChild(buildInput(q));
    var submitBtn = el('button', 'btn primary submit', '提交');
    ansArea.appendChild(submitBtn);
    app.appendChild(ansArea);
    var feedback = el('div', 'feedback hidden');
    app.appendChild(feedback);

    var answered = !!p.results[q.id];
    if (answered) {
      var r = p.results[q.id];
      disable(ansArea);
      feedback.className = 'feedback';
      var cls = r.v === '对' ? 'banner-ok' : (r.v === '半对' ? 'banner-half' : 'banner-bad');
      var txt = r.v === '对' ? '✅ 正确' : (r.v === '半对' ? '⚠️ 半对' : '❌ 错误');
      feedback.innerHTML = '<div class="banner ' + cls + '">' + txt + '</div>' +
        (r.v !== '对' ? '<div class="correct-show">正确答案：<b>' + esc(formatAnswerText(q)) + '</b></div>' : '') +
        '<div class="solution"><b>解析：</b>' + q.solutionCn + '</div>';
      renderMath(feedback);
    }

    var nextBtn = el('button', 'btn primary', answered ? '下一题 →' : '提交并看解析');
    app.appendChild(nextBtn);
    nextBtn.onclick = function () {
      if (!answered) {
        var input = collectInput(q);
        if (input === null) { feedback.className = 'feedback'; feedback.innerHTML = '<div class="banner banner-warn">⚠️ 请先作答</div>'; return; }
        var v = Grader.grade(q, input);
        p.results[q.id] = { v: v, input: input };
        Store.record(q.id, v);
        Store.savePaper(p);
        viewPaperRun();
        return;
      }
      p.idx++;
      Store.savePaper(p);
      if (p.idx >= p.questions.length) location.hash = '#/papersummary';
      else viewPaperRun();
    };
    app.appendChild(navBar('paper'));
    renderMath(app);
  }

  function disable(container) {
    container.querySelectorAll('input, textarea, button').forEach(function (i) { i.disabled = true; });
  }

  function viewPaperSummary() {
    var p = Store.getPaper();
    app.innerHTML = '';
    app.appendChild(el('div', 'view-head', '<h1>🎲 组卷总结</h1>'));
    if (!p || !p.questions.length) { app.appendChild(el('div', 'empty', '没有组卷记录')); app.appendChild(navBar('paper')); return; }
    var c = 0, h = 0, w = 0, undone = 0;
    p.questions.forEach(function (id) {
      var r = p.results[id];
      if (!r) { undone++; return; }
      if (r.v === '对') c++; else if (r.v === '半对') h++; else w++;
    });
    var done = c + h + w;
    var pct = done ? Math.round(100 * (c + 0.5 * h) / done) : 0;
    var card = el('div', 'stats-card');
    card.innerHTML = '<h2>成绩</h2><p>完成 <b>' + done + '</b> / ' + p.questions.length + ' 题（未做 ' + undone + '）</p>' +
      '<p>✅ 对 ' + c + ' · ⚠️ 半对 ' + h + ' · ❌ 错 ' + w + '</p>' + barHtml(pct, '正确率');
    app.appendChild(card);

    var detail = el('div', 'stats-card');
    detail.innerHTML = '<h2>逐题回顾</h2>';
    p.questions.forEach(function (id) {
      var q = findQ(id);
      var r = p.results[id];
      var icon = !r ? '⬜' : (r.v === '对' ? '✅' : (r.v === '半对' ? '⚠️' : '❌'));
      detail.innerHTML += '<p>' + icon + ' <b>' + id + '</b> · ' + esc(TOPICS[q.topic].cn) + ' / ' + esc(TIERS[q.tier]) + '</p>';
    });
    app.appendChild(detail);

    var again = el('button', 'btn primary', '再来一卷');
    again.onclick = function () { Store.clearPaper(); location.hash = '#/paper'; };
    app.appendChild(again);
    var back = el('button', 'btn', '回到选题');
    back.onclick = function () { Store.clearPaper(); location.hash = '#/home'; };
    app.appendChild(back);
    app.appendChild(navBar('paper'));
  }

  /* ---------- 底部导航 ---------- */
  function navBar(cur) {
    var nav = el('nav', 'bottom-nav');
    [['home', '📖', '选题'], ['paper', '🎲', '组卷'], ['wrong', '📝', '错题本'], ['fav', '⭐', '收藏'], ['stats', '📊', '统计']].forEach(function (t) {
      var a = el('a', 'nav-item' + (cur === t[0] ? ' on' : ''), '<span class="nav-icon">' + t[1] + '</span><span>' + t[2] + '</span>');
      a.href = '#/' + t[0];
      nav.appendChild(a);
    });
    return nav;
  }

  window.addEventListener('hashchange', router);
  router();
})();
