/**
 * FER202 · Chương 2 — DEEP LAB: Utility Library (JavaScript nâng cao cho React).
 * Sâu hơn Lab 2: closure (memoize LRU, once), hàm bậc cao (pipe, curry), hẹn giờ (debounce/throttle — đồng hồ ẢO),
 * class + EventEmitter, so sâu, cây đệ quy, giới hạn đồng thời (async pool), thử lại có lùi theo hàm mũ.
 * Đây là những thứ React và các thư viện quanh nó (lodash, redux, react-query) làm bên dưới.
 */
import { doiDau, KHOA, tn } from './_chung.mjs';

const DAU = `// utils.js — STARTER: viết đủ các hàm theo đề (giữ đúng tên)

function pipe(...fns) {}
function curry(fn) {}
function memoize(fn, { maxSize = 100, key = (...args) => JSON.stringify(args) } = {}) {}
function once(fn) {}
function debounce(fn, ms) {}
function throttle(fn, ms) {}
class EventEmitter {}
function isEqual(a, b) {}
function buildTree(rows) {}
function flattenTree(nodes) {}
async function asyncPool(limit, items, worker) {}
async function retry(task, { retries = 3, baseMs = 100 } = {}) {}
`;

const GIAI = `// utils.js — thư viện tiện ích: closure, hàm bậc cao, hẹn giờ, class, đệ quy, bất đồng bộ có kiểm soát

// ── f1. Hàm bậc cao: pipe & curry ─────────────────────────────────────────────
// pipe(f, g, h)(x) = h(g(f(x))) — đọc từ trái sang phải như một dây chuyền
function pipe(...fns) {
  return (input) => fns.reduce((value, fn) => fn(value), input);
}

// curry(add3)(1)(2)(3) = curry(add3)(1, 2)(3) = add3(1, 2, 3)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

// ── f2. Closure: memoize có giới hạn (LRU) + once ─────────────────────────────
function memoize(fn, { maxSize = 100, key = (...args) => JSON.stringify(args) } = {}) {
  const cache = new Map(); // Map giữ thứ tự chèn ⇒ phần tử đầu là phần tử ít dùng gần đây nhất
  function memoized(...args) {
    const k = key(...args);
    if (cache.has(k)) {
      const value = cache.get(k);
      cache.delete(k); // đưa lên "mới dùng nhất"
      cache.set(k, value);
      return value;
    }
    const value = fn(...args);
    cache.set(k, value);
    if (cache.size > maxSize) cache.delete(cache.keys().next().value); // bỏ cái cũ nhất
    return value;
  }
  memoized.cache = cache;
  return memoized;
}

function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

// ── f3. Hẹn giờ: debounce & throttle ─────────────────────────────────────────
// debounce: chỉ chạy SAU KHI ngừng gọi ms mili-giây (ô tìm kiếm)
function debounce(fn, ms) {
  let timer = null;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  }
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}

// throttle: chạy NGAY lần đầu, rồi tối đa một lần mỗi ms (cuộn trang); lần gọi cuối trong cửa sổ được chạy bù
function throttle(fn, ms) {
  let last = -Infinity;
  let timer = null;
  let pendingArgs = null;
  return function throttled(...args) {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else {
      pendingArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          last = Date.now();
          timer = null;
          fn(...pendingArgs);
          pendingArgs = null;
        }, remaining);
      }
    }
  };
}

// ── f4. Class: EventEmitter ─────────────────────────────────────────────────
class EventEmitter {
  #listeners = new Map(); // trường riêng tư

  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(listener);
    return () => this.off(event, listener); // trả hàm huỷ đăng ký (như useEffect cleanup)
  }

  off(event, listener) {
    const list = this.#listeners.get(event);
    if (!list) return;
    const i = list.indexOf(listener);
    if (i >= 0) list.splice(i, 1);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list || list.length === 0) return false;
    [...list].forEach((l) => l(...args)); // bản sao: listener tự gỡ trong lúc emit vẫn an toàn
    return true;
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.length ?? 0;
  }
}

// ── f5. So sâu (như React so props? KHÔNG — React so NÔNG; đây là toEqual của test) ──
function isEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && isEqual(a[k], b[k]));
}

// ── f6. Đệ quy: dựng cây bình luận từ danh sách phẳng và trải phẳng lại ────────
function buildTree(rows) {
  const byId = new Map(rows.map((r) => [r.id, { ...r, children: [] }]));
  const roots = [];
  for (const r of rows) {
    const node = byId.get(r.id);
    const parent = r.parentId == null ? null : byId.get(r.parentId);
    if (parent) parent.children.push(node);
    else roots.push(node); // cha không tồn tại ⇒ coi như gốc
  }
  return roots;
}

function flattenTree(nodes, depth = 0) {
  return nodes.flatMap((n) => [{ id: n.id, depth }, ...flattenTree(n.children ?? [], depth + 1)]);
}

// ── f7. Giới hạn đồng thời: chạy tối đa limit việc cùng lúc, giữ thứ tự kết quả ──
async function asyncPool(limit, items, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function lane() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  const lanes = Array.from({ length: Math.min(limit, items.length) }, lane);
  await Promise.all(lanes);
  return results;
}

// ── f8. Thử lại với lùi theo hàm mũ: đợi base, 2·base, 4·base… ─────────────────
async function retry(task, { retries = 3, baseMs = 100 } = {}) {
  let attempt = 0;
  for (;;) {
    try {
      return await task(attempt);
    } catch (err) {
      if (attempt >= retries || err?.retryable === false) throw err;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt));
      attempt += 1;
    }
  }
}
`;

const KIEM = [
  // f1 pipe & curry
  { nhom: 'f1', moTa: 'pipe runs left to right', goi: 'pipe((x) => x + 1, (x) => x * 2, String)(3)', mongDoi: '8' },
  { nhom: 'f1', moTa: 'pipe with no functions returns the input', goi: 'pipe()(42)', mongDoi: 42 },
  { nhom: 'f1', moTa: 'curry accepts arguments in any grouping', chuanBi: 'const add3 = curry((a, b, c) => a + b + c);', goi: '[add3(1)(2)(3), add3(1, 2)(3), add3(1)(2, 3), add3(1, 2, 3)]', mongDoi: [6, 6, 6, 6] },
  { nhom: 'f1', an: true, moTa: 'Partially applied functions are reusable', chuanBi: 'const mul = curry((a, b) => a * b); const double = mul(2);', goi: '[double(5), double(7)]', mongDoi: [10, 14] },
  // f2 memoize & once
  { nhom: 'f2', moTa: 'memoize caches by arguments', chuanBi: 'let calls = 0; const sq = memoize((n) => { calls++; return n * n; }); sq(4); sq(4); sq(5);', goi: 'calls', mongDoi: 2 },
  { nhom: 'f2', moTa: 'LRU: least recently used entry is evicted', chuanBi: 'let calls = 0; const f = memoize((n) => { calls++; return n; }, { maxSize: 2 }); f(1); f(2); f(1); f(3); f(1); f(2);', goi: 'calls', mongDoi: 4 },
  { nhom: 'f2', moTa: 'Custom key function', chuanBi: "let calls = 0; const byId = memoize((u) => { calls++; return u.name.toUpperCase(); }, { key: (u) => u.id }); byId({ id: 1, name: 'an' }); byId({ id: 1, name: 'an' });", goi: 'calls', mongDoi: 1 },
  { nhom: 'f2', an: true, moTa: 'once runs a single time and returns the first result', chuanBi: 'let n = 0; const init = once((x) => { n++; return x * 10; });', goi: '[init(1), init(2), n]', mongDoi: [10, 10, 1] },
  // f3 debounce & throttle
  { nhom: 'f3', moTa: 'debounce fires once after calls stop', chuanBi: "const seen = []; const d = debounce((q) => seen.push(q), 300); d('r'); await wait(100); d('re'); await wait(100); d('react'); await wait(350);", goi: 'seen', mongDoi: ['react'] },
  { nhom: 'f3', moTa: 'debounce.cancel prevents the call', chuanBi: "const seen = []; const d = debounce((q) => seen.push(q), 300); d('x'); d.cancel(); await wait(400);", goi: 'seen', mongDoi: [] },
  { nhom: 'f3', moTa: 'throttle: immediate first call, at most once per window, trailing call', chuanBi: 'const seen = []; const t = throttle((v) => seen.push([v, Date.now() % 100000]), 100); const t0 = Date.now() % 100000; t(1); t(2); t(3); await wait(150); t(4); await wait(300);', goi: 'seen.map(([v, at]) => [v, at - t0])', mongDoi: [[1, 0], [3, 100], [4, 200]] },
  { nhom: 'f3', an: true, moTa: 'throttle after a quiet period runs immediately', chuanBi: 'const seen = []; const t = throttle((v) => seen.push(v), 100); t(1); await wait(500); t(2);', goi: 'seen', mongDoi: [1, 2] },
  // f4 EventEmitter
  { nhom: 'f4', moTa: 'on + emit with arguments', chuanBi: "const e = new EventEmitter(); const got = []; e.on('msg', (a, b) => got.push(a + b)); e.emit('msg', 'hi ', 'there');", goi: 'got', mongDoi: ['hi there'] },
  { nhom: 'f4', moTa: 'on returns an unsubscribe function', chuanBi: "const e = new EventEmitter(); let n = 0; const off = e.on('tick', () => n++); e.emit('tick'); off(); e.emit('tick');", goi: '[n, e.listenerCount("tick")]', mongDoi: [1, 0] },
  { nhom: 'f4', moTa: 'once fires a single time', chuanBi: "const e = new EventEmitter(); let n = 0; e.once('ready', () => n++); e.emit('ready'); e.emit('ready');", goi: 'n', mongDoi: 1 },
  { nhom: 'f4', an: true, moTa: 'emit returns whether anyone listened', chuanBi: "const e = new EventEmitter(); e.on('a', () => {});", goi: '[e.emit("a"), e.emit("b")]', mongDoi: [true, false] },
  { nhom: 'f4', an: true, moTa: 'Listeners are private (#field)', kiem: 'ma-nguon', tep: 'utils.js', khop: '#\\w+\\s*=\\s*new Map' },
  // f5 isEqual
  { nhom: 'f5', moTa: 'Deep equality of nested data', goi: 'isEqual({ a: [1, { b: 2 }], c: "x" }, { c: "x", a: [1, { b: 2 }] })', mongDoi: true },
  { nhom: 'f5', moTa: 'Detects a nested difference', goi: 'isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] })', mongDoi: false },
  { nhom: 'f5', an: true, moTa: 'Edge cases: NaN, Dates, array vs object, extra keys', goi: '[isEqual(NaN, NaN), isEqual(new Date(5), new Date(5)), isEqual([], {}), isEqual({ a: 1 }, { a: 1, b: undefined })]', mongDoi: [true, true, false, false] },
  // f6 trees
  { nhom: 'f6', moTa: 'buildTree nests comments by parentId', goi: 'buildTree([{ id: 1, parentId: null, text: "A" }, { id: 2, parentId: 1, text: "B" }, { id: 3, parentId: 1, text: "C" }, { id: 4, parentId: 2, text: "D" }]).map((n) => [n.text, n.children.map((c) => [c.text, c.children.map((g) => g.text)])])', mongDoi: [['A', [['B', ['D']], ['C', []]]]] },
  { nhom: 'f6', moTa: 'flattenTree gives depth-first order with depth', goi: 'flattenTree(buildTree([{ id: 1, parentId: null }, { id: 2, parentId: 1 }, { id: 3, parentId: null }, { id: 4, parentId: 2 }]))', mongDoi: [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 4, depth: 2 }, { id: 3, depth: 0 }] },
  { nhom: 'f6', an: true, moTa: 'Input rows are not mutated; orphans become roots', chuanBi: 'const rows = [{ id: 1, parentId: 99 }]; const roots = buildTree(rows);', goi: '[roots.length, "children" in rows[0]]', mongDoi: [1, false] },
  // f7 asyncPool
  { nhom: 'f7', moTa: 'Results keep input order', goi: 'await asyncPool(2, [300, 100, 200], (ms) => wait(ms).then(() => ms))', mongDoi: [300, 100, 200] },
  { nhom: 'f7', moTa: 'Never more than limit at once', chuanBi: 'let running = 0, peak = 0; await asyncPool(2, [1, 2, 3, 4, 5], async () => { running++; peak = Math.max(peak, running); await wait(50); running--; });', goi: 'peak', mongDoi: 2 },
  { nhom: 'f7', moTa: 'Total time ≈ 2 lanes (5 × 100 ms, limit 2 ⇒ 300 ms)', chuanBi: 'const t0 = Date.now(); await asyncPool(2, [1, 2, 3, 4, 5], () => wait(100));', goi: 'Date.now() - t0', mongDoi: 300 },
  { nhom: 'f7', an: true, moTa: 'Empty input resolves to []', goi: 'await asyncPool(3, [], () => 1)', mongDoi: [] },
  // f8 retry
  { nhom: 'f8', moTa: 'Retries until success', chuanBi: 'let n = 0; const value = await retry(async () => { n++; if (n < 3) throw new Error("flaky"); return "ok"; }, { baseMs: 10 });', goi: '[value, n]', mongDoi: ['ok', 3] },
  { nhom: 'f8', moTa: 'Exponential back-off: 100 + 200 + 400 ms', chuanBi: 'const t0 = Date.now(); try { await retry(async () => { throw new Error("down"); }, { retries: 3, baseMs: 100 }); } catch (e) {}', goi: 'Date.now() - t0', mongDoi: 700 },
  { nhom: 'f8', moTa: 'Gives up with the last error', goi: 'await retry(async (attempt) => { throw new Error("fail #" + attempt); }, { retries: 2, baseMs: 1 })', mongDoi: { loi: 'Error', thongDiep: '^fail #2$' } },
  { nhom: 'f8', an: true, moTa: 'Non-retryable errors stop immediately', chuanBi: 'let n = 0; try { await retry(async () => { n++; const e = new Error("bad request"); e.retryable = false; throw e; }); } catch (e) {}', goi: 'n', mongDoi: 1 },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 2: Utility Library — closures, higher-order functions, timers, classes and async control', vi: 'DEEP LAB 2: Thư viện tiện ích — closure, hàm bậc cao, hẹn giờ, class và điều khiển bất đồng bộ' },
  phu: { en: 'FER202 · Chapter 2 (deep) · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 2 (chuyên sâu) · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>React developers use utilities like these every day — <code>debounce</code> for search boxes, <code>memoize</code> for expensive selectors, event emitters for sockets, retry for flaky APIs — usually from a library. In this deep lab you write them yourself in one file, <code>utils.js</code>. Each one is a small lesson in closures, higher-order functions, timers or asynchronous control. Timers in the grader are <b>virtual</b>, so 300 ms is measured exactly.</p>',
    vi: '<p>Lập trình viên React dùng các tiện ích này hằng ngày — <code>debounce</code> cho ô tìm kiếm, <code>memoize</code> cho selector tốn kém, event emitter cho socket, retry cho API chập chờn — thường lấy từ thư viện. Trong deep lab này bạn tự viết chúng trong một tệp <code>utils.js</code>. Mỗi hàm là một bài học nhỏ về closure, hàm bậc cao, hẹn giờ hoặc điều khiển bất đồng bộ. Hẹn giờ trong máy chấm là <b>ảo</b>, nên 300 ms được đo chính xác.</p>',
  },
  chucNangChinh: [{ en: '12 utilities + 1 class in <code>utils.js</code>, 8 graded features.', vi: '12 tiện ích + 1 class trong <code>utils.js</code>, 8 chức năng chấm điểm.' }],
  yeuCauChung: [
    { en: 'No libraries; plain modern JavaScript (<code>const</code>/<code>let</code>, arrow functions, rest/spread, classes with private fields).', vi: 'Không dùng thư viện; JavaScript hiện đại thuần (<code>const</code>/<code>let</code>, arrow function, rest/spread, class có trường riêng tư).' },
    { en: 'Never mutate inputs. The grader loads <code>utils.js</code> as a plain script and calls the functions by name; a helper <code>wait(ms)</code> is available in checks only.', vi: 'Không sửa dữ liệu vào. Máy chấm nạp <code>utils.js</code> như script thường và gọi hàm theo tên; hàm phụ <code>wait(ms)</code> chỉ có trong phần kiểm.' },
  ],
  cayThuMuc: `
utils.js   # pipe · curry · memoize · once · debounce · throttle · EventEmitter
           # isEqual · buildTree · flattenTree · asyncPool · retry`,
  moHinh: {
    ten: 'Signatures',
    truong: [
      ['pipe(...fns)(x) / curry(fn)', 'function', { en: 'left-to-right composition / partial application by fn.length', vi: 'ghép trái→phải / áp dụng từng phần theo fn.length' }],
      ['memoize(fn, { maxSize, key })', 'function + .cache', { en: 'LRU eviction', vi: 'loại bỏ theo LRU' }],
      ['debounce(fn, ms) / throttle(fn, ms)', 'function', { en: 'debounced.cancel()', vi: 'debounced.cancel()' }],
      ['new EventEmitter()', 'on / off / once / emit / listenerCount', { en: 'on() returns unsubscribe', vi: 'on() trả hàm huỷ' }],
      ['buildTree(rows) / flattenTree(nodes)', '{ ...row, children } / { id, depth }', { en: 'rows: { id, parentId }', vi: 'rows: { id, parentId }' }],
      ['asyncPool(limit, items, worker) / retry(task, { retries, baseMs })', 'Promise', { en: 'order kept / back-off base·2^n', vi: 'giữ thứ tự / lùi base·2^n' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Higher-order functions: pipe & curry', vi: 'Hàm bậc cao: pipe & curry' }, diem: 1,
      yeuCau: [{ en: '<code>pipe(f, g, h)(x) === h(g(f(x)))</code>; <code>pipe()(x) === x</code>. <code>curry(fn)</code> collects arguments until <code>fn.length</code> are given, in any grouping.', vi: '<code>pipe(f, g, h)(x) === h(g(f(x)))</code>; <code>pipe()(x) === x</code>. <code>curry(fn)</code> gom đối số tới khi đủ <code>fn.length</code>, nhóm kiểu gì cũng được.' }],
      viDu: 'curry((a, b, c) => a + b + c)(1)(2, 3)  ⇒  6' },
    { ten: { en: 'Closures: memoize (LRU) & once', vi: 'Closure: memoize (LRU) & once' }, diem: 1.5,
      yeuCau: [{ en: '<code>memoize(fn, { maxSize = 100, key })</code> caches results; when full, evicts the <b>least recently used</b> entry (a hit refreshes it). <code>once(fn)</code> calls fn the first time and returns that result forever.', vi: '<code>memoize(fn, { maxSize = 100, key })</code> nhớ kết quả; đầy thì bỏ phần tử <b>lâu không dùng nhất</b> (trúng cache thì làm mới). <code>once(fn)</code> gọi fn lần đầu và trả mãi kết quả đó.' }] },
    { ten: { en: 'Timers: debounce & throttle', vi: 'Hẹn giờ: debounce & throttle' }, diem: 1.5,
      yeuCau: [{ en: '<code>debounce</code> runs only after <code>ms</code> of silence, with the latest arguments; <code>.cancel()</code>. <code>throttle</code> runs immediately, then at most once per <code>ms</code>; the last call inside a window runs at the end of it.', vi: '<code>debounce</code> chỉ chạy sau <code>ms</code> yên lặng, với đối số mới nhất; có <code>.cancel()</code>. <code>throttle</code> chạy ngay, rồi tối đa một lần mỗi <code>ms</code>; lần gọi cuối trong cửa sổ được chạy bù khi hết cửa sổ.' }],
      viDu: 'throttle 100 ms: calls at 0, 0, 0, 150 ⇒ runs at 0 (1), 100 (3), 200 (4)' },
    { ten: { en: 'Class: EventEmitter', vi: 'Class: EventEmitter' }, diem: 1.5,
      yeuCau: [{ en: '<code>on(event, fn)</code> returns an unsubscribe function; <code>off</code>, <code>once</code>, <code>emit(event, ...args)</code> (returns whether listeners existed), <code>listenerCount</code>. Store listeners in a <b>private field</b>.', vi: '<code>on(event, fn)</code> trả hàm huỷ đăng ký; <code>off</code>, <code>once</code>, <code>emit(event, ...args)</code> (trả có listener hay không), <code>listenerCount</code>. Lưu listener trong <b>trường riêng tư</b>.' }] },
    { ten: { en: 'Deep equality', vi: 'So sánh sâu' }, diem: 1,
      yeuCau: [{ en: '<code>isEqual(a, b)</code> for primitives (<code>Object.is</code>), Dates, arrays and plain objects (key order irrelevant).', vi: '<code>isEqual(a, b)</code> cho kiểu nguyên thuỷ (<code>Object.is</code>), Date, mảng và object thường (thứ tự khoá không quan trọng).' }] },
    { ten: { en: 'Recursion: comment tree', vi: 'Đệ quy: cây bình luận' }, diem: 1,
      yeuCau: [{ en: '<code>buildTree(rows)</code> ⇒ roots with nested <code>children</code> (copies — inputs untouched; unknown parent ⇒ root). <code>flattenTree(nodes)</code> ⇒ depth-first <code>[{ id, depth }]</code> (for an indented list).', vi: '<code>buildTree(rows)</code> ⇒ các gốc có <code>children</code> lồng (bản sao — không sửa đầu vào; cha không có ⇒ thành gốc). <code>flattenTree(nodes)</code> ⇒ duyệt sâu <code>[{ id, depth }]</code> (để vẽ danh sách thụt lề).' }] },
    { ten: { en: 'Concurrency limit: asyncPool', vi: 'Giới hạn đồng thời: asyncPool' }, diem: 1.5,
      yeuCau: [{ en: '<code>asyncPool(limit, items, worker)</code> runs at most <code>limit</code> workers at a time and resolves to results in input order.', vi: '<code>asyncPool(limit, items, worker)</code> chạy tối đa <code>limit</code> việc cùng lúc và trả kết quả theo thứ tự đầu vào.' }],
      viDu: 'limit 2, five 100 ms jobs  ⇒  300 ms total' },
    { ten: { en: 'Retry with exponential back-off', vi: 'Thử lại với lùi theo hàm mũ' }, diem: 1,
      yeuCau: [{ en: '<code>retry(task, { retries = 3, baseMs = 100 })</code> calls <code>task(attempt)</code>; on failure waits <code>baseMs · 2^attempt</code> and tries again, up to <code>retries</code> extra attempts; errors with <code>retryable === false</code> are thrown at once.', vi: '<code>retry(task, { retries = 3, baseMs = 100 })</code> gọi <code>task(attempt)</code>; lỗi thì đợi <code>baseMs · 2^attempt</code> rồi thử lại, tối đa <code>retries</code> lần thêm; lỗi có <code>retryable === false</code> ném ngay.' }] },
  ],
  truDiem: [
    { en: 'A global variable shared by every debounced function — two search boxes cancel each other.', vi: 'Một biến toàn cục dùng chung cho mọi hàm debounce — hai ô tìm kiếm huỷ lẫn nhau.' },
    { en: '<code>JSON.stringify(a) === JSON.stringify(b)</code> as deep equality — fails on key order and Dates.', vi: '<code>JSON.stringify(a) === JSON.stringify(b)</code> làm so sâu — sai khi thứ tự khoá khác và với Date.' },
    { en: 'asyncPool that starts everything with <code>Promise.all(items.map(worker))</code> — no limit at all.', vi: 'asyncPool khởi chạy tất cả bằng <code>Promise.all(items.map(worker))</code> — không giới hạn gì.' },
    { en: 'An unbounded memo cache — memory grows forever in a long-running page.', vi: 'Cache memo không giới hạn — bộ nhớ tăng mãi trong trang chạy lâu.' },
  ],
  nopBai: {
    en: 'Write <code>utils.js</code> in the editor. <b>Run</b> = sample checks, <b>Submit</b> = all checks. Timers are virtual: <code>wait(300)</code> in a check advances the fake clock by exactly 300 ms.',
    vi: 'Viết <code>utils.js</code> trong editor. <b>Chạy thử</b> = kiểm mẫu, <b>Nộp</b> = mọi kiểm. Hẹn giờ là ảo: <code>wait(300)</code> trong phần kiểm đẩy đồng hồ giả đúng 300 ms.',
  },
};

const WAIT = `// wait.js — hàm phụ cho PHẦN KIỂM (đã cho, không nộp)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
`;

export default doiDau({
  slug: 'fer202-2-deep-utility-library',
  ten: 'Deep Lab 2 — Utility Library (closures · timers · async control)',
  khoa: KHOA,
  baiHoc: 'fer202-2-2-destructuring-spread-modules',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 2 — Utility Library (memoize · debounce · EventEmitter · asyncPool · retry)', vi: 'Deep Lab 2 — Thư viện tiện ích (memoize · debounce · EventEmitter · asyncPool · retry)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['closures', 'higher-order functions', 'currying', 'LRU cache', 'debounce / throttle', 'classes & private fields', 'recursion', 'concurrency limits', 'exponential back-off'],
      tienQuyet: ['Lab 2 — Student Data Toolkit', 'Promise / async-await'],
      the: ['fer202', 'deep-lab', 'javascript', 'es6'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'closure', vi: 'hàm "nhớ" biến của phạm vi nơi nó được tạo' },
        { en: 'higher-order function', vi: 'hàm nhận hoặc trả về hàm' },
        { en: 'currying', vi: 'biến hàm nhiều đối số thành chuỗi hàm một/vài đối số' },
        { en: 'LRU (least recently used)', vi: 'bỏ phần tử lâu không dùng nhất khi đầy' },
        { en: 'debounce / throttle', vi: 'chờ ngừng gọi rồi chạy / chạy tối đa một lần mỗi khoảng' },
        { en: 'private field (#x)', vi: 'trường riêng tư của class, bên ngoài không đọc được' },
        { en: 'back-off', vi: 'giãn dần thời gian giữa các lần thử lại' },
        ...tn('immutable'),
      ],
      goiY: [
        'Closure: biến khai báo trong hàm ngoài (timer, cache, called) sống tiếp trong hàm được trả về — mỗi lần gọi debounce(...) có biến RIÊNG.',
        'LRU với Map: trúng ⇒ delete rồi set lại (lên cuối); đầy ⇒ xoá cache.keys().next().value (phần tử đầu).',
        'throttle: nhớ thời điểm chạy cuối (Date.now()); trong cửa sổ thì lưu đối số mới nhất và hẹn một setTimeout cho phần còn lại của cửa sổ.',
        'asyncPool: tạo limit "làn" async, mỗi làn lặp lấy chỉ số kế tiếp (next++) cho tới hết; await Promise.all(lanes).',
      ],
      loiHayGap: [
        'curry dùng <code>args.length === fn.length</code> nhưng quên trường hợp truyền nhiều hơn một đối số mỗi lần.',
        'memoize với khoá là chính object ⇒ hai object giống nội dung vẫn trượt cache; cần hàm key.',
        'debounce gọi <code>fn</code> với đối số của lần gọi ĐẦU thay vì lần cuối.',
        'EventEmitter.emit duyệt trực tiếp mảng listener trong khi <code>once</code> tự gỡ ⇒ bỏ sót listener kế tiếp.',
        'retry đợi cố định thay vì nhân đôi, hoặc thử lại vô hạn.',
      ],
      moTaNgan: 'Deep lab chương 2: tự viết pipe/curry, memoize LRU, once, debounce/throttle (đồng hồ ảo), EventEmitter có trường riêng tư, isEqual, cây đệ quy, asyncPool giới hạn đồng thời, retry lùi theo hàm mũ.',
      giaiThich: '<p>Mọi tiện ích đều dựa trên <b>closure</b>: biến <code>timer</code>, <code>cache</code>, <code>called</code> nằm trong phạm vi hàm ngoài và sống cùng hàm trả về. <code>Map</code> giữ thứ tự chèn nên làm LRU chỉ cần xoá rồi chèn lại. debounce và throttle khác nhau ở câu hỏi "chạy khi nào": sau khi yên lặng, hay đều đặn tối đa một lần mỗi khoảng. asyncPool dùng mô hình "làn": mỗi làn là một vòng lặp async lấy việc kế tiếp, nên số việc chạy cùng lúc không bao giờ vượt <code>limit</code> và kết quả ghi đúng chỉ số. retry nhân đôi thời gian chờ mỗi lần để không dội thêm tải lên server đang gặp sự cố.</p>',
      tests: { loai: 'js', phienBan: 1, tepChinh: 'utils.js', tepNap: ['wait.js', 'utils.js'], kiem: KIEM },
      khoiDau: { 'utils.js': DAU, 'wait.js': WAIT },
      loiGiai: { 'utils.js': GIAI, 'wait.js': WAIT },
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    },
  ],
});
