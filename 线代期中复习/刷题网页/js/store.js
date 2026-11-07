/* store.js — localStorage 封装（版本化键，读取全 try/catch 回退默认值） */
(function (root) {
  'use strict';
  var KEYS = {
    progress: 'lalg.progress.v1',
    wrongbook: 'lalg.wrongbook.v1',
    favorites: 'lalg.favorites.v1',
    paper: 'lalg.paper.v1',
    settings: 'lalg.settings.v1'
  };

  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 私密模式等 */ }
  }

  var Store = {
    getProgress: function () { return load(KEYS.progress, {}); },
    getWrongbook: function () { return load(KEYS.wrongbook, []); },
    getFavorites: function () { return load(KEYS.favorites, []); },
    getSettings: function () { return load(KEYS.settings, { showEn: true }); },
    saveSettings: function (s) { save(KEYS.settings, s); },

    // 提交判分后记录：进度 + 错题本（答对自动移出错题本）
    record: function (id, verdict) {
      var p = this.getProgress();
      var e = p[id] || { a: 0, c: 0, h: 0, w: 0, last: null, ts: 0 };
      e.a++;
      if (verdict === '对') e.c++; else if (verdict === '半对') e.h++; else e.w++;
      e.last = verdict; e.ts = Date.now();
      p[id] = e;
      save(KEYS.progress, p);
      var wb = this.getWrongbook();
      var i = wb.indexOf(id);
      if (verdict !== '对') { if (i === -1) wb.unshift(id); }
      else if (i !== -1) { wb.splice(i, 1); }
      save(KEYS.wrongbook, wb);
      return e;
    },

    toggleFavorite: function (id) {
      var favs = this.getFavorites();
      var i = favs.indexOf(id);
      if (i === -1) favs.unshift(id); else favs.splice(i, 1);
      save(KEYS.favorites, favs);
      return i === -1;
    },

    // 组卷会话（可续做）
    getPaper: function () { return load(KEYS.paper, null); },
    savePaper: function (p) { save(KEYS.paper, p); },
    clearPaper: function () { try { localStorage.removeItem(KEYS.paper); } catch (e) {} },

    resetAll: function () {
      try {
        for (var k in KEYS) localStorage.removeItem(KEYS[k]);
      } catch (e) {}
    },

    // 统计：按 topic 与 tier 的正确率（半对算 0.5）
    stats: function () {
      var p = this.getProgress();
      var byTopic = {}, byTier = {}, total = { a: 0, c: 0, h: 0 };
      var DATA = root.LA_DATA;
      for (var id in p) {
        var q = null;
        for (var i = 0; i < DATA.questions.length; i++) if (DATA.questions[i].id === id) { q = DATA.questions[i]; break; }
        if (!q) continue;
        var e = p[id];
        var t = byTopic[q.topic] || (byTopic[q.topic] = { a: 0, s: 0 });
        var r = byTier[q.tier] || (byTier[q.tier] = { a: 0, s: 0 });
        t.a++; r.a++;
        var sc = e.c + 0.5 * e.h;
        t.s += sc; r.s += sc;
        total.a++; total.c += e.c; total.h += e.h;
      }
      return { byTopic: byTopic, byTier: byTier, total: total };
    }
  };

  root.Store = Store;
})(typeof self !== 'undefined' ? self : this);
