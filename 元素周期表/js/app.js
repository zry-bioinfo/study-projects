// ============ 元素周期表学习工具 — 主逻辑 ============

(function () {
  'use strict';

  // ---------- 全局状态 ----------
  const state = {
    view: 'table',        // table | test | mistakes | accounts | create
    mode: 'normal',       // normal | review
    phase: 'question',    // question | correct | wrong
    current: null,        // 当前题目元素
    givenType: null,      // plus 模式：给定的要素 'name' | 'z' | 'pos'
    lastZ: null,          // 防止连续两次出同一题
    pool: [],             // 复习模式题目池
    popupCell: null,      // 小窗当前锚定的元素格
    advanceTimer: null    // 唯一的自动跳转定时器
  };

  const BY_Z = {};
  ELEMENTS.forEach((el) => { BY_Z[el.z] = el; });

  const BLOCK_LABEL = { s: 's 区', d: 'd 区', ds: 'ds 区', p: 'p 区', f: 'f 区' };

  // 罗马数字族序（第 8–10 族同属 VIII）
  const CN_NUM = ['一', '二', '三', '四', '五', '六', '七'];
  const GROUP_ROMAN = ['IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIII', 'VIII', 'VIII',
                       'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'];
  const GROUP_ROMAN_OPTIONS = ['IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIII',
                               'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'];
  const periodText = (p) => '第' + CN_NUM[p - 1] + '周期';
  const groupText = (el) => el.block === 'f'
    ? (el.period === 6 ? '镧系' : '锕系')
    : GROUP_ROMAN[el.group - 1] + '族';
  const posText = (el) => periodText(el.period) + ' ' + GROUP_ROMAN[el.group - 1] + '族';

  const $ = (id) => document.getElementById(id);
  const isMobile = () => window.matchMedia('(max-width: 640px)').matches;

  // ============ 主表渲染 ============

  function renderTable() {
    // 族表头（罗马数字版）：IA IIA IIIB IVB VB VIB VIIB | VIII（占三列）| IB IIB IIIA IVA VA VIA VIIA VIIIA
    const GROUP_HEADER = [
      ['IA', 1], ['IIA', 2], ['IIIB', 3], ['IVB', 4], ['VB', 5], ['VIB', 6], ['VIIB', 7],
      ['VIII', 8, 3],
      ['IB', 11], ['IIB', 12], ['IIIA', 13], ['IVA', 14], ['VA', 15], ['VIA', 16], ['VIIA', 17], ['VIIIA', 18]
    ];
    let header = '';
    for (const [label, col, span] of GROUP_HEADER) {
      header += '<div style="grid-column:' + col + (span ? ' / span ' + span : '') + '">' + label + '</div>';
    }
    $('group-header').innerHTML = header;

    // 元素格：主表 col=group row=period；f 区另起两行（row 9 镧系 / row 10 锕系，row 8 为空隙）
    let html = '';
    for (const el of ELEMENTS) {
      let col, row;
      if (el.block === 'f') {
        row = el.period === 6 ? 9 : 10;
        col = el.period === 6 ? el.z - 54 : el.z - 86;
      } else {
        col = el.group;
        row = el.period;
      }
      html +=
        '<button type="button" class="cell block-' + el.block + '" data-z="' + el.z + '"' +
        ' style="grid-column:' + col + ';grid-row:' + row + '"' +
        ' aria-label="' + el.zh + ' ' + el.en + '">' +
        '<span class="z">' + el.z + '</span>' +
        '<span class="sym">' + el.symbol + '</span>' +
        '<span class="zh">' + el.zh + '</span>' +
        '<span class="en">' + el.en + '</span>' +
        '<span class="mass">' + el.mass + '</span>' +
        '</button>';
    }
    // 镧系 / 锕系占位格（不可点击）
    html += '<div class="placeholder" style="grid-column:3;grid-row:6">57–71<br>镧系</div>';
    html += '<div class="placeholder" style="grid-column:3;grid-row:7">89–103<br>锕系</div>';
    $('periodic-table').innerHTML = html;
  }

  // ============ 详情小窗 ============

  function renderPopupContent(el) {
    const pos = el.block === 'f'
      ? (el.period === 6 ? '第六周期 · 镧系' : '第七周期 · 锕系')
      : periodText(el.period) + ' · ' + GROUP_ROMAN[el.group - 1] + '族';
    $('popup-content').innerHTML =
      '<div class="popup-head">' +
        '<div class="popup-title"><span class="zh">' + el.zh + '</span>' +
        '<span class="en">' + el.en + '</span></div>' +
        '<div class="popup-ipa"><button type="button" class="btn-play" id="btn-play" aria-label="播放发音">🔊</button>' +
        '<span>' + el.ipa + '</span></div>' +
      '</div>' +
      '<div class="popup-facts">' +
        '<div class="fact"><span class="k">符号</span><span class="v">' + el.symbol + '</span></div>' +
        '<div class="fact"><span class="k">原子序数</span><span class="v">' + el.z + '</span></div>' +
        '<div class="fact"><span class="k">相对原子质量</span><span class="v">' + el.mass + '</span></div>' +
      '</div>' +
      '<div class="popup-section"><h4>周期 · 族 · 区</h4><p>' + pos + '（' + BLOCK_LABEL[el.block] + '）</p></div>' +
      '<div class="popup-section"><h4>常用化合价</h4><p>' + el.ox + '</p></div>' +
      '<div class="popup-section"><h4>常见化合物</h4><p>' + el.compounds + '</p></div>' +
      '<div class="popup-section"><h4>元素性质</h4><p>' + el.prop + '</p></div>';
    $('btn-play').addEventListener('click', () => playPronunciation(el));
  }

  function openPopup(el, cellEl) {
    // 高亮当前格
    const prev = document.querySelector('.cell.current');
    if (prev) prev.classList.remove('current');
    cellEl.classList.add('current');
    state.popupCell = cellEl;

    renderPopupContent(el);
    const popup = $('popup');
    popup.hidden = false;
    popup.classList.remove('shown');
    popup.classList.add('measuring');
    popup.classList.toggle('centered', isMobile());
    const rect = cellEl.getBoundingClientRect();
    positionPopup(rect, popup.offsetWidth, popup.offsetHeight);
    popup.classList.remove('measuring');
    requestAnimationFrame(() => popup.classList.add('shown'));

    playPronunciation(el); // 打开即自动发音（处于点击手势内，符合自动播放策略）
  }

  function positionPopup(rect, w, h) {
    const popup = $('popup');
    if (isMobile()) {
      popup.style.left = '50%';
      popup.style.top = '50%';
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = rect.left + rect.width / 2 - w / 2;
    let top = rect.bottom + 12;                    // 默认在元素下方
    if (top + h > vh - 10) {
      top = rect.top - 12 - h;                     // 越下界 → 翻转到上方
      if (top < 10) top = 10;                      // 仍越界 → 贴顶边
    }
    left = Math.min(Math.max(left, 10), vw - w - 10);
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  function repositionPopup() {
    const popup = $('popup');
    if (popup.hidden || !state.popupCell) return;
    if (isMobile()) {
      // 窗口缩到移动断点 → 切居中模式
      popup.classList.add('centered');
      positionPopup(null, 0, 0);
      return;
    }
    popup.classList.remove('centered');
    const rect = state.popupCell.getBoundingClientRect();
    positionPopup(rect, popup.offsetWidth, popup.offsetHeight);
  }

  function closePopup() {
    const popup = $('popup');
    if (popup.hidden) return;
    popup.hidden = true;
    popup.classList.remove('shown');
    const cur = document.querySelector('.cell.current');
    if (cur) cur.classList.remove('current');
    state.popupCell = null;
    stopAudio();
  }

  // ============ 发音（有道在线 TTS → 浏览器语音兜底） ============

  let audioToken = 0;

  function playPronunciation(el) {
    audioToken++;
    const token = audioToken;
    try { speechSynthesis.cancel(); } catch (e) { /* 部分环境无此 API */ }
    const tts = $('tts');
    tts.pause();
    tts.onerror = null;

    let fellBack = false;
    const fallback = () => {
      if (fellBack || token !== audioToken) return;  // 防止双播 / 过期回调
      fellBack = true;
      try {
        const u = new SpeechSynthesisUtterance(el.en);
        u.lang = 'en-US';
        u.rate = 0.9;
        speechSynthesis.speak(u);
      } catch (e) { /* 静默降级 */ }
    };

    tts.onerror = fallback;
    tts.src = 'https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(el.en) + '&type=2';
    tts.play().catch(fallback);
  }

  function stopAudio() {
    audioToken++;
    try { speechSynthesis.cancel(); } catch (e) { /* 忽略 */ }
    const tts = $('tts');
    tts.pause();
    tts.onerror = null;
  }

  // ============ 视图切换 ============

  function showView(name) {
    state.view = name;
    // 清理上一个视图的残留
    if (state.advanceTimer) { clearTimeout(state.advanceTimer); state.advanceTimer = null; }
    stopAudio();
    closePopup();

    // 首次建号页锁定：隐藏导航，防未建号进入其他页面
    document.body.classList.toggle('locked', name === 'create');

    document.querySelectorAll('.nav-btn').forEach((b) =>
      b.classList.toggle('active', b.dataset.view === name));
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    $('view-' + name).classList.add('active');
  }

  function schedule(ms, fn) {
    if (state.advanceTimer) clearTimeout(state.advanceTimer);
    state.advanceTimer = setTimeout(fn, ms);
  }

  // ============ 测试状态机（go / plus / pro） ============

  function updateBanner() {
    const b = $('test-banner');
    b.textContent = testType + (state.mode === 'review' ? ' 错题复习' : ' 随机测试');
    b.classList.toggle('review', state.mode === 'review');
  }

  function hideAllInputs() {
    ['go-inputs', 'plus-inputs', 'pos-field', 'pro-inputs'].forEach((id) => { $(id).hidden = true; });
  }

  function setInputsDisabled(flag) {
    ['in-en', 'in-sym', 'p-en', 'p-sym', 'p-z', 'pro-cfg'].forEach((id) => { $(id).disabled = flag; });
    $('pos-period').disabled = flag;
    $('pos-group').disabled = flag;
    $('btn-submit').disabled = flag;
  }

  function resetPosBlanks() {
    $('pos-period').textContent = '＿';
    $('pos-group').textContent = '＿';
  }

  // 按题型与给定要素渲染题目（三种模式互不干扰，只显示各自的题面与输入区）
  function renderQuestion() {
    const el = state.current;
    hideAllInputs();
    closePosOptions();
    resetPosBlanks();
    const zh = $('q-zh');
    zh.classList.remove('q-wide');
    $('q-period').textContent = '';
    $('q-group').textContent = '';

    if (testType === 'go') {
      // 只给中文名，上下显示位置；输入：元素符号 + 英文名
      $('q-period').textContent = periodText(el.period);
      zh.textContent = el.zh;
      $('q-group').textContent = groupText(el);
      $('go-inputs').hidden = false;
      $('in-sym').value = '';
      $('in-en').value = '';
    } else if (testType === 'plus') {
      // 不出现中文名；三要素随机给其一，只显示另外两个输入区
      zh.classList.add('q-wide');
      $('plus-names-wrap').hidden = true;
      $('plus-z-wrap').hidden = true;
      if (state.givenType === 'name') {
        zh.textContent = el.en;
        $('q-group').textContent = el.symbol;
        $('plus-z-wrap').hidden = false;      // 输入：原子序数
        $('pos-field').hidden = false;        // 输入：元素位置
      } else if (state.givenType === 'z') {
        zh.textContent = String(el.z);
        $('plus-names-wrap').hidden = false;  // 输入：英文名 + 符号
        $('pos-field').hidden = false;        // 输入：元素位置
      } else {
        zh.textContent = posText(el);
        $('plus-names-wrap').hidden = false;  // 输入：英文名 + 符号
        $('plus-z-wrap').hidden = false;      // 输入：原子序数
      }
      $('plus-inputs').hidden = false;
      $('p-en').value = '';
      $('p-sym').value = '';
      $('p-z').value = '';
    } else {
      // pro：给中文名 + 英文名；输入：元素位置 + 电子排布式
      zh.textContent = el.zh;
      $('q-group').textContent = el.en;
      $('pos-field').hidden = false;
      $('pro-inputs').hidden = false;
      $('pro-cfg').value = '';
    }
  }

  // 消息态（错题本为空 / 全部掌握）：只显示文字，收起所有输入
  function setQMessage(text) {
    $('q-zh').textContent = text;
    $('q-zh').classList.remove('q-wide');
    $('q-period').textContent = '';
    $('q-group').textContent = '';
    hideAllInputs();
    setInputsDisabled(true);
    $('btn-skip').hidden = true;
  }

  function startTest(mode) {
    state.mode = mode;
    state.phase = 'question';
    state.current = null;
    state.givenType = null;
    state.pool = [];
    if (state.advanceTimer) { clearTimeout(state.advanceTimer); state.advanceTimer = null; }

    document.querySelectorAll('.type-btn').forEach((x) =>
      x.classList.toggle('active', x.dataset.type === testType));
    $('feedback').className = 'feedback';
    $('feedback').textContent = '';
    $('btn-skip').hidden = true;

    if (mode === 'review') {
      state.pool = Object.keys(mistakeMap).map(Number);
      if (state.pool.length === 0) {
        updateBanner();
        setQMessage('错题本为空');
        showFeedback('err', '错题本还没有错题，先去测试页练习吧');
        schedule(2000, () => showView('mistakes'));
        return;
      }
    }
    updateBanner();
    next();
  }

  function next() {
    if (state.advanceTimer) { clearTimeout(state.advanceTimer); state.advanceTimer = null; }

    if (state.mode === 'review') {
      state.pool = state.pool.filter((z) => z in mistakeMap); // 答对的已从错题本删除
      if (state.pool.length === 0) {
        updateBanner();
        setQMessage('🎉');
        showFeedback('ok', '全部掌握！错题本已清空');
        schedule(2000, () => showView('mistakes'));
        return;
      }
      $('test-banner').textContent = testType + ' 错题复习 · 剩余 ' + state.pool.length + ' 题';
      $('test-banner').classList.add('review');
    }

    const source = state.mode === 'review' ? state.pool : null;
    const pick = () => source
      ? source[Math.floor(Math.random() * source.length)]
      : 1 + Math.floor(Math.random() * ELEMENTS.length);

    let z, guard = 0;
    if (testType === 'plus') {
      // 位置作为给定要素时须能唯一确定元素：f 区共用 IIIB、VIII 占三列都不行
      const eligible = (el) => el.block !== 'f' && (el.group < 8 || el.group > 10);
      const canGivePos = !source || source.some((zz) => eligible(BY_Z[zz]));
      const types = canGivePos ? ['name', 'z', 'pos'] : ['name', 'z'];
      state.givenType = types[Math.floor(Math.random() * types.length)];
      if (state.givenType === 'pos') {
        do { z = pick(); } while ((!eligible(BY_Z[z]) || z === state.lastZ) && ++guard < 500);
      } else {
        do { z = pick(); } while (z === state.lastZ && (source ? source.length > 1 : true) && ++guard < 20);
      }
    } else {
      do { z = pick(); } while (z === state.lastZ && (source ? source.length > 1 : true) && ++guard < 20);
    }

    state.lastZ = z;
    state.current = BY_Z[z];
    state.phase = 'question';

    renderQuestion();
    setInputsDisabled(false);
    $('feedback').className = 'feedback';
    $('feedback').textContent = '';
    $('btn-skip').hidden = true;

    // 聚焦第一个可见输入框
    const visible = (el) => el && !el.closest('[hidden]') && !el.disabled;
    const first = ['in-sym', 'in-en', 'p-en', 'p-z', 'pro-cfg'].map($).find(visible);
    if (first) first.focus();
  }

  function showFeedback(cls, text) {
    const fb = $('feedback');
    fb.className = 'feedback ' + cls;
    fb.textContent = text;
  }

  // ---------- 判定 ----------

  function submit() {
    if (state.phase !== 'question' || !state.current) return;
    if (testType === 'go') submitGo();
    else if (testType === 'plus') submitPlus();
    else submitPro();
  }

  function handleResult(isOk, wrongText) {
    state.phase = isOk ? 'correct' : 'wrong';
    setInputsDisabled(true);
    closePosOptions();
    $('btn-skip').hidden = false;
    if (isOk) {
      showFeedback('ok', '正确 ✓');
      if (state.mode === 'review') {
        removeMistake(state.current.z);  // 复习答对 → 错题本自动删除词条
        updateBadge();
      }
      schedule(1000, next);
    } else {
      recordMistake(state.current.z);    // 答错 → 计入错题本（重复错误只累加次数）
      updateBadge();
      showFeedback('err', wrongText);
      schedule(3000, next);
    }
  }

  function submitGo() {
    const enIn = $('in-en').value.trim().toLowerCase();
    const symIn = $('in-sym').value.trim().toLowerCase();
    if (!enIn && !symIn) return;

    const el = state.current;
    const enOk = enIn === el.en.toLowerCase() ||
      (el.altEn && el.altEn.some((a) => a.toLowerCase() === enIn));
    const symOk = symIn === el.symbol.toLowerCase();
    handleResult(enOk && symOk, '错误 · 正确答案：' + el.en + ' / ' + el.symbol);
  }

  function submitPlus() {
    const el = state.current;
    const t = state.givenType;
    const enIn = $('p-en').value.trim().toLowerCase();
    const symIn = $('p-sym').value.trim().toLowerCase();
    const zIn = $('p-z').value.trim();
    const filled = [enIn, symIn, zIn,
      $('pos-period').textContent !== '＿', $('pos-group').textContent !== '＿']
      .filter(Boolean).length;
    if (filled === 0) return;

    let ok = true;
    if (t !== 'name') {
      ok = ok && (enIn === el.en.toLowerCase() ||
        (el.altEn && el.altEn.some((a) => a.toLowerCase() === enIn)));
      ok = ok && symIn === el.symbol.toLowerCase();
    }
    if (t !== 'z') ok = ok && Number(zIn) === el.z;
    if (t !== 'pos') {
      ok = ok && $('pos-period').textContent === CN_NUM[el.period - 1] &&
                 $('pos-group').textContent === GROUP_ROMAN[el.group - 1];
    }
    handleResult(ok, '错误 · 正确答案：' + el.en + '（' + el.symbol + '） · 原子序数 ' + el.z + ' · ' + posText(el));
  }

  // 电子排布式解析：忽略书写顺序与空格，按亚层电子数对比
  const SUP_MAP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

  function parseCfg(str) {
    const map = {};
    const s = String(str).toLowerCase().replace(/\s+/g, '');
    // 指数 = 上标字符或普通数字；普通数字后若紧跟 s/p/d/f（下一亚层）则不算指数
    const re = /([1-9])([spdf])((?:[⁰¹²³⁴⁵⁶⁷⁸⁹]|[0-9](?![spdf]))+)/g;
    let m;
    while ((m = re.exec(s))) {
      const digits = m[3].split('').map((c) => (SUP_MAP[c] !== undefined ? SUP_MAP[c] : c)).join('');
      const n = parseInt(digits, 10);
      if (n > 0) map[m[1] + m[2]] = (map[m[1] + m[2]] || 0) + n;
    }
    return map;
  }

  function cfgEqual(a, b) {
    const A = parseCfg(a);
    const B = parseCfg(b);
    if (!Object.keys(A).length || !Object.keys(B).length) return false;
    const keys = new Set(Object.keys(A).concat(Object.keys(B)));
    for (const k of keys) {
      if ((A[k] || 0) !== (B[k] || 0)) return false;
    }
    return true;
  }

  function submitPro() {
    const el = state.current;
    const cfgIn = $('pro-cfg').value.trim();
    const posDone = $('pos-period').textContent !== '＿' || $('pos-group').textContent !== '＿';
    if (!cfgIn && !posDone) return;
    const ok = cfgEqual(cfgIn, el.cfg) &&
      $('pos-period').textContent === CN_NUM[el.period - 1] &&
      $('pos-group').textContent === GROUP_ROMAN[el.group - 1];
    handleResult(ok, '错误 · 正确答案：' + posText(el) + ' · ' + el.cfg);
  }

  function skip() {
    if (state.phase !== 'question') next();
  }

  // ---------- plus：位置选项填空 ----------

  let posOpen = null; // 'period' | 'group'

  function togglePosOptions(kind) {
    if (state.phase !== 'question') return;
    const panel = $('pos-options');
    if (posOpen === kind) { closePosOptions(); return; }
    posOpen = kind;
    const opts = kind === 'period' ? CN_NUM : GROUP_ROMAN_OPTIONS;
    panel.innerHTML = opts.map((o) =>
      '<button type="button" class="pos-option" data-value="' + o + '">' + o + '</button>').join('');
    panel.hidden = false;
  }

  function closePosOptions() {
    posOpen = null;
    $('pos-options').hidden = true;
  }

  // 两个空格都填好后，若其余要素也已填完 → 自动判定（仅 plus）
  function maybeAutoSubmit() {
    if (state.phase !== 'question' || testType !== 'plus') return;
    if ($('pos-period').textContent === '＿' || $('pos-group').textContent === '＿') return;
    const visible = (el) => el && !el.closest('[hidden]') && !el.disabled;
    const empty = ['p-en', 'p-sym', 'p-z'].map($).filter(visible).some((i) => !i.value.trim());
    if (empty) return;
    submitPlus();
  }

  // ============ 错题本 ============

  function renderMistakes() {
    const keys = Object.keys(mistakeMap).map(Number).sort((a, b) => a - b);
    $('mistake-total').textContent =
      '共 ' + keys.length + ' 个错题词条 · 总错误 ' + mistakeTotal() + ' 次';
    $('mistake-empty').hidden = keys.length > 0;

    const list = $('mistake-list');
    list.innerHTML = '';
    for (const z of keys) {
      const el = BY_Z[z];
      const row = document.createElement('div');
      row.className = 'mistake-row';
      row.innerHTML =
        '<div class="mistake-chip block-' + el.block + '">' + el.symbol + '</div>' +
        '<div class="mistake-names">' +
        '<div class="zh">' + el.zh + '（' + el.symbol + '）</div>' +
        '<div class="en">' + el.en + '</div>' +
        '</div>' +
        '<span class="mistake-count">错误 ×' + mistakeMap[z] + '</span>';
      list.appendChild(row);
    }
  }

  function updateBadge() {
    const total = mistakeTotal();
    const badge = $('badge');
    badge.hidden = total === 0;
    badge.textContent = total;
  }

  // ============ 账号系统 ============

  function updateAccountUI() {
    const el = $('account-name');
    const acc = activeAccount();
    el.hidden = !acc;
    el.textContent = acc ? '👤 ' + acc.name : '';
  }

  function validateAccountName(raw) {
    const name = raw.trim();
    if (!name) return '账号名称不能为空';
    if (accounts.some((a) => a.name === name)) return '该名称已存在，请换一个';
    return null; // 合法
  }

  // 进入主界面（已有账号）
  function enterApp() {
    updateAccountUI();
    updateBadge();
    renderMistakes();
    showView('table');
  }

  function createFromCreateView() {
    const input = $('create-name');
    const err = validateAccountName(input.value);
    if (err) { $('create-error').textContent = err; return; }
    $('create-error').textContent = '';
    createAccount(input.value.trim());
    input.value = '';
    enterApp();
  }

  function createFromAccountsView() {
    const input = $('new-account-name');
    const err = validateAccountName(input.value);
    if (err) { $('account-error').textContent = err; return; }
    $('account-error').textContent = '';
    createAccount(input.value.trim());
    input.value = '';
    updateAccountUI();
    updateBadge();
    renderAccounts();
  }

  function renderAccounts() {
    const list = $('account-list');
    list.innerHTML = '';
    for (const a of accounts) {
      const isCurrent = a.id === activeId;
      const total = mistakeTotalOf(a.id);
      const created = new Date(a.created);
      const dateStr = created.getFullYear() + '-' +
        String(created.getMonth() + 1).padStart(2, '0') + '-' +
        String(created.getDate()).padStart(2, '0');
      const row = document.createElement('div');
      row.className = 'account-row';
      row.innerHTML =
        '<div class="account-info">' +
          '<div class="name">' + a.name + (isCurrent ? '<span class="account-current">当前账号</span>' : '') + '</div>' +
          '<div class="meta">创建于 ' + dateStr + ' · 错题总次数 ' + total + '</div>' +
        '</div>' +
        '<div class="account-actions">' +
          (isCurrent ? '' :
            '<button type="button" class="btn btn-outline btn-sm" data-action="switch" data-id="' + a.id + '">切换</button>') +
          '<button type="button" class="btn btn-outline btn-sm" data-action="delete" data-id="' + a.id + '">删除</button>' +
        '</div>';
      list.appendChild(row);
    }
  }

  // 账号列表事件：切换 / 删除（两段确认）
  $('account-list').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.action === 'switch') {
      if (id !== activeId && switchAccount(id)) {
        updateAccountUI();
        updateBadge();
        renderMistakes();
        renderAccounts();
      }
    } else if (btn.dataset.action === 'delete') {
      if (btn.dataset.confirm === '1') {
        deleteAccount(id);
        updateAccountUI();
        updateBadge();
        renderAccounts();
        renderMistakes();
        if (!activeId) {
          // 账号全部删除 → 回到首次建号页
          $('account-error').textContent = '';
          showView('create');
        }
      } else {
        // 第一次点击 → 变为确认态，3 秒未确认自动还原
        btn.dataset.confirm = '1';
        btn.textContent = '确认删除';
        btn.classList.add('btn-danger');
        setTimeout(() => {
          if (btn.isConnected) {
            delete btn.dataset.confirm;
            btn.textContent = '删除';
            btn.classList.remove('btn-danger');
          }
        }, 3000);
      }
    }
  });

  // ============ 事件绑定 ============

  // 点击元素格 → 打开小窗（事件委托）
  $('periodic-table').addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    openPopup(BY_Z[Number(cell.dataset.z)], cell);
  });

  // 点击小窗外部 → 关闭（小窗内部与元素格除外）；位置选项面板同理收起
  document.addEventListener('click', (e) => {
    if (posOpen && !e.target.closest('#pos-options') && !e.target.closest('.pos-blank')) {
      closePosOptions();
    }
    const popup = $('popup');
    if (popup.hidden) return;
    if (popup.contains(e.target) || e.target.closest('.cell')) return;
    closePopup();
  });

  // Esc 关闭小窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  // 滚动 / 窗口变化时小窗跟随锚定元素
  window.addEventListener('scroll', repositionPopup, true);
  window.addEventListener('resize', repositionPopup);

  $('popup-close').addEventListener('click', closePopup);

  // 顶部导航
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const view = b.dataset.view;
      if (view === 'test') {
        state.mode = 'normal';
        showView('test');
        startTest('normal');
      } else {
        showView(view);
        if (view === 'mistakes') renderMistakes();
        if (view === 'accounts') renderAccounts();
      }
    });
  });

  // 账号创建
  $('btn-confirm-create').addEventListener('click', createFromCreateView);
  $('btn-create-account').addEventListener('click', createFromAccountsView);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing) return;
    if (state.view === 'create' && e.target === $('create-name')) createFromCreateView();
    else if (state.view === 'accounts' && e.target === $('new-account-name')) createFromAccountsView();
  });

  // 测试页
  $('btn-submit').addEventListener('click', submit);
  $('btn-skip').addEventListener('click', skip);
  $('btn-exit').addEventListener('click', () =>
    showView(state.mode === 'review' ? 'mistakes' : 'table'));

  // 测试模式切换（go / plus / pro），切换即按新模式重启当前会话
  document.querySelectorAll('.type-btn').forEach((b) => {
    b.addEventListener('click', () => {
      if (b.dataset.type === testType) return;
      testType = b.dataset.type;
      saveTestType();
      if (state.view === 'test') startTest(state.mode);
    });
  });

  // plus：位置空格点击 → 弹出选项
  $('pos-period').addEventListener('click', () => togglePosOptions('period'));
  $('pos-group').addEventListener('click', () => togglePosOptions('group'));
  $('pos-options').addEventListener('click', (e) => {
    const btn = e.target.closest('.pos-option');
    if (!btn) return;
    const blank = posOpen === 'period' ? $('pos-period') : $('pos-group');
    blank.textContent = btn.dataset.value;
    closePosOptions();
    maybeAutoSubmit();
  });

  // 空格已填好时，其余要素一填完就自动判定
  ['p-en', 'p-sym', 'p-z'].forEach((id) => {
    $(id).addEventListener('input', maybeAutoSubmit);
  });

  // pro：上标输入面板（在光标处插入字符）
  function insertChar(c) {
    const ta = $('pro-cfg');
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + c + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + c.length;
    ta.focus();
  }
  ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁺', '⁻'].forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sup-btn';
    b.textContent = c;
    b.dataset.char = c;
    $('sup-pad').appendChild(b);
  });
  $('sup-pad').addEventListener('click', (e) => {
    const b = e.target.closest('.sup-btn');
    if (!b) return;
    insertChar(b.dataset.char);
  });
  // 回车提交 / 反馈阶段回车跳下一题（isComposing：中文输入法确认选词的回车不触发）
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing || state.view !== 'test') return;
    if (state.phase === 'question') {
      const t = e.target;
      const isAnswerInput = ['in-en', 'in-sym', 'p-en', 'p-sym', 'p-z'].includes(t.id);
      if (t === $('btn-submit') || isAnswerInput) submit();
    } else {
      next();
    }
  });

  // 错题本
  $('btn-review').addEventListener('click', () => {
    state.mode = 'review';
    showView('test');
    startTest('review');
  });

  // ============ 初始化 ============

  renderTable();

  // 同步测试模式选择按钮（记忆上次选择）
  document.querySelectorAll('.type-btn').forEach((x) =>
    x.classList.toggle('active', x.dataset.type === testType));

  // 账号门控：无有效当前账号时，回退到第一个账号；一个账号都没有 → 首次建号页
  if (activeAccount()) {
    enterApp();
  } else if (accounts.length) {
    switchAccount(accounts[0].id);
    enterApp();
  } else {
    showView('create');
  }
})();
