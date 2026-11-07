// ============ 多账号存储 ============
// localStorage 键：
//   pt_accounts         账号列表 [{id, name, created}]
//   pt_active_account   当前账号 id
//   pt_mistakes_<id>    某账号的错题本 {"z": 错误次数, ...}
//   pt_test_type        测试模式 'go' | 'plus' | 'pro'（错题复习沿用）
// file:// 下 localStorage 在 Chrome/Edge 可用；若被禁用则降级为内存模式

const ACCOUNTS_KEY = 'pt_accounts';
const ACTIVE_KEY = 'pt_active_account';
const MISTAKES_PREFIX = 'pt_mistakes_';
const TEST_TYPE_KEY = 'pt_test_type';

let accounts = loadAccounts();      // [{id, name, created}]
let activeId = loadActiveId();      // 当前账号 id 或 null
let mistakeMap = loadMistakes();    // 当前账号的错题本
let testType = loadTestType();      // 'go' | 'plus' | 'pro'

// ---------- 账号列表 ----------

function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a) => a && typeof a.id === 'string' && typeof a.name === 'string');
  } catch (e) {
    return [];
  }
}

function saveAccounts() {
  try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); } catch (e) { /* 内存模式 */ }
}

function accountById(id) {
  return accounts.find((a) => a.id === id) || null;
}

function activeAccount() {
  return accountById(activeId);
}

// ---------- 当前账号 id ----------

function loadActiveId() {
  try { return localStorage.getItem(ACTIVE_KEY) || null; } catch (e) { return null; }
}

function saveActiveId() {
  try {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch (e) { /* 内存模式 */ }
}

// ---------- 账号操作 ----------

function createAccount(name) {
  const acc = {
    id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name,
    created: Date.now()
  };
  accounts.push(acc);
  saveAccounts();
  activeId = acc.id;
  saveActiveId();
  mistakeMap = {};        // 新账号错题本为空
  saveMistakes();
  return acc;
}

function switchAccount(id) {
  if (!accountById(id)) return false;
  if (activeId === id) return true;
  activeId = id;
  saveActiveId();
  mistakeMap = loadMistakes();
  return true;
}

// 删除账号及其错题本；若删的是当前账号，自动切到列表第一个（或置空）
function deleteAccount(id) {
  const i = accounts.findIndex((a) => a.id === id);
  if (i < 0) return;
  accounts.splice(i, 1);
  saveAccounts();
  try { localStorage.removeItem(MISTAKES_PREFIX + id); } catch (e) { /* 忽略 */ }
  if (activeId === id) {
    activeId = accounts.length ? accounts[0].id : null;
    saveActiveId();
    mistakeMap = loadMistakes();
  }
}

// ---------- 测试模式 ----------

function loadTestType() {
  try {
    const v = localStorage.getItem(TEST_TYPE_KEY);
    return (v === 'go' || v === 'plus' || v === 'pro') ? v : 'go';
  } catch (e) {
    return 'go';
  }
}

function saveTestType() {
  try { localStorage.setItem(TEST_TYPE_KEY, testType); } catch (e) { /* 内存模式 */ }
}

// ---------- 错题本（当前账号） ----------

function mistakesKey(id) { return MISTAKES_PREFIX + id; }

function loadMistakes() {
  if (!activeId) return {};
  try {
    const raw = localStorage.getItem(mistakesKey(activeId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const map = {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const k in parsed) {
        const z = Number(k);
        if (Number.isInteger(z) && z >= 1 && z <= 118 && Number.isFinite(parsed[k])) {
          map[z] = parsed[k];
        }
      }
    }
    return map;
  } catch (e) {
    return {};
  }
}

function saveMistakes() {
  if (!activeId) return;
  try { localStorage.setItem(mistakesKey(activeId), JSON.stringify(mistakeMap)); } catch (e) { /* 内存模式 */ }
}

// 答错：次数 +1（同元素不新建词条）
function recordMistake(z) {
  mistakeMap[z] = (mistakeMap[z] || 0) + 1;
  saveMistakes();
}

// 复习答对：删除词条
function removeMistake(z) {
  if (z in mistakeMap) {
    delete mistakeMap[z];
    saveMistakes();
  }
}

// 当前账号全部错误次数之和（顶栏徽标）
function mistakeTotal() {
  let n = 0;
  for (const k in mistakeMap) n += mistakeMap[k];
  return n;
}

// 任意账号的错误总次数（账号管理页展示用）
function mistakeTotalOf(id) {
  try {
    const raw = localStorage.getItem(mistakesKey(id));
    if (!raw) return 0;
    const m = JSON.parse(raw);
    let n = 0;
    if (m && typeof m === 'object') {
      for (const k in m) n += Number(m[k]) || 0;
    }
    return n;
  } catch (e) {
    return 0;
  }
}
