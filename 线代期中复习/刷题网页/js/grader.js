/* grader.js — 判分模块（UMD：浏览器 window.Grader / Node require）
 * 语义照搬物理刷题APP：数值容差、多选三态（对/半对/错）、表达式白名单求值；
 * 线代新增：矩阵/向量逐元素判分。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Grader = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

  // 输入解析：清洗 → ×10ⁿ → 白名单求值。失败返回 null。
  function parseNumber(raw) {
    if (raw === null || raw === undefined) return null;
    if (typeof raw === 'number') return raw;
    var t = String(raw).trim();
    if (!t) return null;
    t = t.replace(/[,，\s]/g, '');                       // 去逗号/空格
    t = t.replace(/[×*]10([⁻⁺]?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, function (_, sign, digs) {
      return 'e' + (sign === '⁻' ? '-' : '') + digs.split('').map(function (c) { return SUP[c]; }).join('');
    });
    t = t.replace(/[−–—]/g, '-').replace(/π/g, 'Math.PI').replace(/√\s*\(/g, 'Math.sqrt(').replace(/√/g, 'Math.sqrt(');
    var body = t.replace(/Math\.PI/g, '').replace(/Math\.sqrt/g, '');
    if (!/^[0-9+\-*/^().eE]*$/.test(body)) return null;  // 白名单
    try {
      var v = new Function('Math', 'return (' + t + ');')(Math);
      return (typeof v === 'number' && isFinite(v)) ? v : null;
    } catch (e) { return null; }
  }

  // 数值比较：相等或 |u−r| ≤ max(abs, rel·max(|u|,|r|))
  function numericMatch(u, r, tol) {
    var na = parseNumber(u), nb = parseNumber(r);
    if (na === null || nb === null) return false;
    if (na === nb) return true;
    var t = tol || { abs: 0.03, rel: 0.015 };
    var diff = Math.abs(na - nb), maxV = Math.max(Math.abs(na), Math.abs(nb));
    if (diff <= t.abs) return true;
    if (maxV > 0 && diff / maxV <= t.rel) return true;
    return false;
  }

  // 拆分用户输入：矩阵行用 ; 或换行，元素用空格/逗号；向量用空格/逗号
  function parseList(input) {
    var s = String(input || '').trim();
    var rows = s.split(/[;\n]+/);
    var mat = rows.map(function (r) {
      var parts = r.trim().split(/[\s,，]+/).filter(function (x) { return x.length > 0; });
      return parts.map(parseNumber);
    });
    if (mat.some(function (r) { return r.some(function (v) { return v === null; }); })) return null;
    return mat; // 二维数组（单行即向量）
  }

  function elementGrade(matU, matA, tol) {
    var ok = 0, total = 0;
    for (var i = 0; i < matA.length; i++) {
      for (var j = 0; j < matA[i].length; j++) {
        total++;
        if (i < matU.length && j < matU[i].length && numericMatch(matU[i][j], matA[i][j], tol)) ok++;
      }
    }
    if (total === 0) return '错';
    if (ok === total) return '对';
    if (ok / total >= 0.5) return '半对';
    return '错';
  }

  // 主入口：grade(question, userInput) → '对' | '半对' | '错'
  function grade(q, input) {
    var a = q.answer, tol = (a && a.tolerance) || { abs: 0.03, rel: 0.015 };
    if (q.type === 'single') {
      return String(input).trim().toUpperCase() === String(a.value) ? '对' : '错';
    }
    if (q.type === 'judge') {
      var b = String(input).trim().toLowerCase();
      var expect = a.value === true;
      if (b === 'true' || b === 't' || b === '对' || b === '真' || b === '正确') return expect ? '对' : '错';
      if (b === 'false' || b === 'f' || b === '错' || b === '假') return expect ? '错' : '对';
      return '错';
    }
    if (q.type === 'multi') {
      var sel = Array.isArray(input) ? input.map(function (x) { return String(x).trim().toUpperCase(); }) : [];
      var ans = (a.value || []).map(function (x) { return String(x).toUpperCase(); });
      var anyWrong = sel.some(function (x) { return ans.indexOf(x) === -1; });
      if (sel.length === 0 || anyWrong) return '错';
      if (sel.length === ans.length) return '对';
      return '半对';
    }
    // numeric / expression
    if (a.type === 'number') {
      return numericMatch(input, a.value, tol) ? '对' : '错';
    }
    if (a.type === 'expression') {
      var num = parseNumber(input);
      if (num === null) return '错';
      return numericMatch(num, a.eval, tol) ? '对' : '错';
    }
    if (a.type === 'vector' || a.type === 'matrix') {
      var matU = parseList(input);
      if (!matU) return '错';
      var matA = a.type === 'vector' ? [a.value] : a.value;
      // 用户可能把矩阵写成一行，也可能写成多行
      var flatU = [].concat.apply([], matU);
      var flatA = [].concat.apply([], matA);
      if (matU.length !== matA.length || matU[0].length !== matA[0].length) {
        // 形状不符但元素全对 → 半对
        var flatOk = 0;
        for (var i = 0; i < flatA.length; i++) if (numericMatch(flatU[i], flatA[i], tol)) flatOk++;
        if (flatOk === flatA.length) return '半对';
        return '错';
      }
      return elementGrade(matU, matA, tol);
    }
    return '错';
  }

  var Grader = { parseNumber: parseNumber, numericMatch: numericMatch, grade: grade };

  // 内置断言（Node 下可跑：node grader.js）
  if (typeof module !== 'undefined' && module.exports && require.main === module) {
    var asserts = [];
    function T(name, cond) { asserts.push([name, cond]); }
    T('解析 ×10⁻⁵', Math.abs(Grader.parseNumber('2×10⁻⁵') - 0.00002) < 1e-12);
    T('解析 √(2)', Math.abs(Grader.parseNumber('√(2)') - Math.SQRT2) < 1e-12);
    T('解析 3/4', Grader.parseNumber('3/4') === 0.75);
    T('解析 π', Math.abs(Grader.parseNumber('π') - Math.PI) < 1e-12);
    T('解析 1,234.5', Grader.parseNumber('1,234.5') === 1234.5);
    T('拒绝非法串', Grader.parseNumber('alert(1)') === null);
    T('容差边界 0.03', Grader.numericMatch('1.02', 1.0) === true);
    T('容差边界 1.5%', Grader.numericMatch('98.5', 100) === true);
    T('容差拒绝 2%', Grader.numericMatch('102', 100) === false);
    T('容差拒绝 0.05', Grader.numericMatch('0.05', 0) === false);
    T('多选全对', Grader.grade({ type: 'multi', answer: { type: 'choices', value: ['A', 'C'] } }, ['A', 'C']) === '对');
    T('多选半对', Grader.grade({ type: 'multi', answer: { type: 'choices', value: ['A', 'C'] } }, ['A']) === '半对');
    T('多选有错选', Grader.grade({ type: 'multi', answer: { type: 'choices', value: ['A', 'C'] } }, ['A', 'B']) === '错');
    T('单选', Grader.grade({ type: 'single', answer: { type: 'choice', value: 'B' } }, 'b') === '对');
    T('矩阵全对', Grader.grade({ type: 'numeric', answer: { type: 'matrix', value: [[1, 2], [3, 4]], tolerance: { abs: 0.03, rel: 0.015 } } }, '1 2; 3 4') === '对');
    T('矩阵半对', Grader.grade({ type: 'numeric', answer: { type: 'matrix', value: [[1, 2], [3, 4]], tolerance: { abs: 0.03, rel: 0.015 } } }, '1 2; 3 5') === '半对');
    T('矩阵错', Grader.grade({ type: 'numeric', answer: { type: 'matrix', value: [[1, 2], [3, 4]], tolerance: { abs: 0.03, rel: 0.015 } } }, '9 9; 9 9') === '错');
    T('向量', Grader.grade({ type: 'numeric', answer: { type: 'vector', value: [1, -2, 3], tolerance: { abs: 0.03, rel: 0.015 } } }, '1, -2, 3') === '对');
    T('判断 true', Grader.grade({ type: 'judge', answer: { type: 'judge', value: true } }, 'true') === '对');
    var failed = asserts.filter(function (a) { return !a[1]; });
    failed.forEach(function (a) { console.log('FAIL:', a[0]); });
    console.log(failed.length === 0 ? 'ALL ' + asserts.length + ' grader asserts PASS' : failed.length + ' FAILED');
  }

  return Grader;
});
