/* app.js — 线代词典：搜索（EN/CN 双通道）+ 主题分组折叠 + 中英标题切换 + KaTeX */
(function () {
  'use strict';
  var DATA = window.GLOSS_DATA;
  var TOPICS = DATA.topics, TERMS = DATA.terms;
  var app = document.getElementById('app');

  var state = { query: '', enFirst: true, collapsed: {} };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderMath(container) {
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (node) {
      var s = node.nodeValue;
      if (s.indexOf('\\(') === -1) return;
      var frag = document.createDocumentFragment();
      var re = /\\\(([\s\S]+?)\\\)/g;
      var last = 0, m;
      while ((m = re.exec(s)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var span = document.createElement('span');
        try { katex.render(m[1].trim(), span, { throwOnError: false, strict: false }); }
        catch (e) { span.textContent = m[1]; }
        frag.appendChild(span);
        last = re.lastIndex;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  // 高亮命中（en 或 cn 子串，忽略大小写）
  function hl(text, q) {
    var out = esc(text);
    if (!q) return out;
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return out;
    return out.slice(0, i) + '<span class="hit">' + out.slice(i, i + q.length) + '</span>' + out.slice(i + q.length);
  }

  function matches(term, q) {
    if (!q) return true;
    var lq = q.toLowerCase();
    return term.en.toLowerCase().indexOf(lq) !== -1 || term.cn.toLowerCase().indexOf(lq) !== -1 ||
      (term.defCn || '').toLowerCase().indexOf(lq) !== -1;
  }

  function render() {
    app.innerHTML = '';
    var header = document.createElement('header');
    header.innerHTML = '<h1>📚 线代词典</h1><p class="sub">Linear Algebra Dictionary · ' + TERMS.length + ' 词条 · 中英对照</p>';
    app.appendChild(header);

    // 搜索框
    var sb = document.createElement('div');
    sb.className = 'search-box';
    sb.innerHTML = '<input class="search-input" placeholder="搜索英文或中文，如 eigen、零空间、det…">' +
      '<p class="search-hint">支持英文 / 中文 / 定义全文搜索</p>';
    app.appendChild(sb);
    var input = sb.querySelector('input');
    input.value = state.query;
    var timer = null;
    input.oninput = function () { clearTimeout(timer); timer = setTimeout(function () { state.query = input.value.trim(); renderBody(); }, 180); };

    // 中英切换
    var lt = document.createElement('div');
    lt.className = 'lang-toggle';
    lt.innerHTML = '<button class="chip' + (state.enFirst ? ' on' : '') + '" data-lang="en">英文在前</button>' +
      '<button class="chip' + (!state.enFirst ? ' on' : '') + '" data-lang="cn">中文在前</button>';
    app.appendChild(lt);
    lt.querySelectorAll('[data-lang]').forEach(function (b) {
      b.onclick = function () { state.enFirst = b.dataset.lang === 'en'; render(); };
    });

    // 主题 chips 跳转
    var tc = document.createElement('div');
    tc.className = 'topic-chips';
    tc.appendChild(chipBtn('全部', function () { document.getElementById('g-all') && document.getElementById('g-all').scrollIntoView({ behavior: 'smooth' }); }));
    Object.keys(TOPICS).forEach(function (t) {
      tc.appendChild(chipBtn(TOPICS[t].cn, function () {
        var g = document.getElementById('g-' + t);
        if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
    });
    app.appendChild(tc);

    renderBody();
    renderMath(app);
  }

  function chipBtn(text, onclick) {
    var b = document.createElement('button');
    b.className = 'chip';
    b.textContent = text;
    b.onclick = onclick;
    return b;
  }

  function renderBody() {
    var old = app.querySelector('.groups');
    if (old) old.remove();
    var groups = document.createElement('div');
    groups.className = 'groups';
    app.appendChild(groups);

    var q = state.query;
    var any = false;
    Object.keys(TOPICS).forEach(function (t) {
      var terms = TERMS.filter(function (x) { return x.topic === t && matches(x, q); });
      if (!terms.length) return;
      any = true;
      var g = document.createElement('section');
      g.className = 'group';
      g.id = 'g-' + t;
      var head = document.createElement('div');
      head.className = 'group-head' + (state.collapsed[t] ? ' collapsed' : '');
      head.innerHTML = '<span>🔹 ' + esc(TOPICS[t].cn) + ' <span class="count">' + esc(TOPICS[t].en) + ' · ' + terms.length + ' 词条</span></span><span>▾</span>';
      head.onclick = function () {
        state.collapsed[t] = !state.collapsed[t];
        head.classList.toggle('collapsed', state.collapsed[t]);
      };
      g.appendChild(head);
      var list = document.createElement('div');
      list.className = 'term-list';
      terms.forEach(function (term) {
        var card = document.createElement('div');
        card.className = 'term';
        var title = state.enFirst
          ? '<span class="title-en">' + hl(term.en, q) + '</span><span class="title-cn">' + hl(term.cn, q) + '</span>'
          : '<span class="title-en">' + hl(term.cn, q) + '</span><span class="title-cn">' + hl(term.en, q) + '</span>';
        card.innerHTML = '<div>' + title + '</div>' +
          '<div class="def">' + term.defCn + '</div>' +
          (term.noteCn ? '<div class="note">💡 ' + term.noteCn + '</div>' : '');
        list.appendChild(card);
      });
      g.appendChild(list);
      groups.appendChild(g);
    });
    if (!any) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = '没有匹配「' + q + '」的词条，试试其他关键词。';
      groups.appendChild(empty);
    }
    renderMath(groups);
  }

  render();
})();
