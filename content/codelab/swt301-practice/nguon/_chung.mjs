/**
 * SWT301 practice — PHẦN DÙNG CHUNG cho mọi module (tệp bắt đầu bằng "_" ⇒ bộ xuất bỏ qua).
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * Định dạng đề: content/codelab/README.md · đề lớn "bản in": content/codelab/_chung/deLon.mjs.
 *
 * Bốn KIỂU CHẤM của môn kiểm thử (đều chạy bằng máy chấm 'js' có sẵn — Worker, không thêm loại mới):
 *
 *  1. ĐỘT BIẾN (mutation) — người học VIẾT TEST (Jest-like: describe/test/expect/test.each/jest.fn) cho
 *     một hàm/lớp. Kiểm: (a) mọi test ĐẠT trên bản cài đặt ĐÚNG; (b) đủ số test; (c) mỗi BẢN ĐỘT BIẾN
 *     (mutant — bản cài đặt có lỗi cài sẵn) bị "giết": có ít nhất một test đạt trên bản đúng mà trượt
 *     trên mutant. Test yếu (chỉ một ca "happy path") để sống sót mutant ⇒ trượt. → kiemDotBien()
 *     Người học gọi hàm bằng TÊN TOÀN CỤC bên trong thân test; máy chấm tráo bản đúng/mutant vào tên đó.
 *  2. ĐỘ PHỦ (coverage) — người học đưa bộ dữ liệu test (UTCID); máy chấm chạy BẢN ĐÃ GẮN ĐO của mã
 *     (đánh dấu $s lệnh · $d quyết định · $c điều kiện) và đo statement / decision / condition / MC/DC,
 *     số ca tối thiểu, kết quả mong đợi THEO ĐẶC TẢ (không theo mã), loại N/A/B, P/F. → kiemPhu()
 *  3. TEST CASE HỘP ĐEN — người học viết test case (id, mô tả, tiền điều kiện, bước, dữ liệu, mong đợi)
 *     như template Report 5.x; máy chấm CHẠY dữ liệu của từng ca qua hệ thống tham chiếu ⇒ mong đợi phải
 *     khớp, rồi đo các "nhãn" đã phủ (thông báo lỗi, luật bảng quyết định, giá trị biên…). Chấp nhận
 *     MỌI lời giải hợp lệ, không ép một bảng cố định. → kiemTestCase()
 *  4. KHOÁ ĐÁP ÁN (review code, phân loại…) — người học liệt kê lỗi (dòng + loại) hoặc điền đối tượng;
 *     máy chấm so với khoá có nhiều đáp án chấp nhận. → kiemReview(), kiemKhoa()
 *  Bài lý thuyết: choice / order / table (tinh()).
 *
 * Dấu thay trong chuỗi code (doiDau): ´ ⇒ dấu huyền (backtick), @{ ⇒ ${.
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';

export { doiDau };
export const KHOA = 'software-testing';

/* ═══════════════════════════════════════ TESTKIT (Jest-like) ═══════════════════════════════════════
 * Nạp TRƯỚC tests.js (tepNap). Chỉ gán vào globalThis (không khai báo const/function cấp cao) để không
 * đụng tên của người học. __chayBo(gan) = chạy toàn bộ test đã đăng ký với các tên toàn cục `gan`.
 */
const KIT = String.raw`(function (G) {
  if (G.__KIT_DA_NAP__) return; G.__KIT_DA_NAP__ = true;
  var REG = G.__REG__ = [];
  var GOC = { ten: null, be: [], ae: [] };
  var CHONG = [GOC];
  function show(v) {
    if (typeof v === 'string') return JSON.stringify(v);
    if (typeof v === 'function') return '[Function]';
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (typeof v === 'number' && !isFinite(v)) return String(v);
    if (v === undefined) return 'undefined';
    try { var s = JSON.stringify(v); return s && s.length > 140 ? s.slice(0, 137) + '...' : s; } catch (e) { return String(v); }
  }
  function deepEq(a, b) {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (a instanceof Map && b instanceof Map) { if (a.size !== b.size) return false; var ok = true; a.forEach(function (v, k) { if (!b.has(k) || !deepEq(v, b.get(k))) ok = false; }); return ok; }
    if (a instanceof Set && b instanceof Set) { if (a.size !== b.size) return false; var ok2 = true; a.forEach(function (v) { if (!b.has(v)) ok2 = false; }); return ok2; }
    var ka = Object.keys(a).filter(function (k) { return a[k] !== undefined; });
    var kb = Object.keys(b).filter(function (k) { return b[k] !== undefined; });
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || !deepEq(a[ka[i]], b[ka[i]])) return false;
    return true;
  }
  function Loi(m) { var e = new Error(m); e.name = 'AssertionError'; return e; }
  function khopLoi(err, x) {
    if (x === undefined) return true;
    var msg = err && err.message !== undefined ? String(err.message) : String(err);
    if (typeof x === 'string') return msg.indexOf(x) >= 0;
    if (x instanceof RegExp) return x.test(msg);
    if (typeof x === 'function') return err instanceof x || (err && err.name === x.name);
    if (x && typeof x === 'object' && 'message' in x) return msg === String(x.message);
    return false;
  }
  function make(actual, neg) {
    var m = {};
    function chk(pass, msg) { if (!!pass === neg) throw Loi('expected ' + (neg ? 'NOT ' : '') + msg); }
    function laMock(f) { if (!f || !f.__laMock) throw Loi('this matcher needs a jest.fn() mock, got ' + show(f)); }
    m.toBe = function (e) { chk(Object.is(actual, e), show(actual) + ' to be ' + show(e)); };
    m.toEqual = m.toStrictEqual = function (e) { chk(deepEq(actual, e), show(actual) + ' to equal ' + show(e)); };
    m.toBeCloseTo = function (e, d) { d = d == null ? 2 : d; chk(typeof actual === 'number' && Math.abs(actual - e) < Math.pow(10, -d) / 2, show(actual) + ' to be close to ' + show(e)); };
    m.toBeTruthy = function () { chk(!!actual, show(actual) + ' to be truthy'); };
    m.toBeFalsy = function () { chk(!actual, show(actual) + ' to be falsy'); };
    m.toBeNull = function () { chk(actual === null, show(actual) + ' to be null'); };
    m.toBeUndefined = function () { chk(actual === undefined, show(actual) + ' to be undefined'); };
    m.toBeDefined = function () { chk(actual !== undefined, show(actual) + ' to be defined'); };
    m.toBeNaN = function () { chk(Number.isNaN(actual), show(actual) + ' to be NaN'); };
    m.toBeGreaterThan = function (n) { chk(actual > n, show(actual) + ' > ' + show(n)); };
    m.toBeGreaterThanOrEqual = function (n) { chk(actual >= n, show(actual) + ' >= ' + show(n)); };
    m.toBeLessThan = function (n) { chk(actual < n, show(actual) + ' < ' + show(n)); };
    m.toBeLessThanOrEqual = function (n) { chk(actual <= n, show(actual) + ' <= ' + show(n)); };
    m.toContain = function (x) { chk(actual != null && (typeof actual === 'string' ? actual.indexOf(x) >= 0 : Array.prototype.some.call(actual, function (y) { return Object.is(y, x); })), show(actual) + ' to contain ' + show(x)); };
    m.toContainEqual = function (x) { chk(actual != null && Array.prototype.some.call(actual, function (y) { return deepEq(y, x); }), show(actual) + ' to contain an item equal to ' + show(x)); };
    m.toHaveLength = function (n) { chk(actual != null && actual.length === n, show(actual) + ' to have length ' + n); };
    m.toMatch = function (r) { chk(typeof actual === 'string' && (r instanceof RegExp ? r.test(actual) : actual.indexOf(r) >= 0), show(actual) + ' to match ' + String(r)); };
    m.toHaveProperty = function (p, v) {
      var ds = Array.isArray(p) ? p : String(p).split('.'); var o = actual, co = true;
      for (var i = 0; i < ds.length; i++) { if (o == null || !(ds[i] in Object(o))) { co = false; break; } o = o[ds[i]]; }
      chk(co && (arguments.length < 2 || deepEq(o, v)), show(actual) + ' to have property ' + String(p) + (arguments.length < 2 ? '' : ' = ' + show(v)));
    };
    m.toThrow = m.toThrowError = function (x) {
      if (typeof actual !== 'function') throw Loi('toThrow() needs a function: write expect(() => fn(...)).toThrow()');
      var threw = false, err;
      try { actual(); } catch (e) { threw = true; err = e; }
      chk(threw && khopLoi(err, x), 'the function to throw' + (x === undefined ? '' : ' ' + (typeof x === 'function' ? x.name : show(x instanceof RegExp ? String(x) : x))) + (threw ? ' (it threw ' + show(err) + ')' : ' (it returned normally)'));
    };
    m.toHaveBeenCalled = function () { laMock(actual); chk(actual.mock.calls.length > 0, 'the mock to have been called'); };
    m.toHaveBeenCalledTimes = function (n) { laMock(actual); chk(actual.mock.calls.length === n, 'the mock to be called ' + n + ' time(s), it was called ' + actual.mock.calls.length); };
    m.toHaveBeenCalledWith = function () { laMock(actual); var a = Array.prototype.slice.call(arguments); chk(actual.mock.calls.some(function (c) { return deepEq(c, a); }), 'the mock to have been called with ' + show(a) + ' — calls: ' + show(actual.mock.calls)); };
    m.toHaveBeenLastCalledWith = function () { laMock(actual); var a = Array.prototype.slice.call(arguments); var c = actual.mock.calls[actual.mock.calls.length - 1]; chk(!!c && deepEq(c, a), 'the last call to be ' + show(a)); };
    return m;
  }
  function boc(p, neg, laTuChoi) {
    var mau = make(undefined, false), o = {};
    Object.keys(mau).forEach(function (k) {
      o[k] = function () {
        var args = arguments;
        return Promise.resolve(p).then(function (v) {
          if (laTuChoi) throw Loi('expected the promise to reject, it resolved with ' + show(v));
          return make(v, neg)[k].apply(null, args);
        }, function (e) {
          if (!laTuChoi) throw Loi('expected the promise to resolve, it rejected with ' + show(e));
          return make(k === 'toThrow' || k === 'toThrowError' ? function () { throw e; } : e, neg)[k].apply(null, args);
        });
      };
    });
    return o;
  }
  G.expect = function (actual) {
    G.__soExpect = (G.__soExpect || 0) + 1;
    var o = make(actual, false); o.not = make(actual, true);
    o.resolves = boc(actual, false, false); o.resolves.not = boc(actual, true, false);
    o.rejects = boc(actual, false, true); o.rejects.not = boc(actual, true, true);
    return o;
  };
  function fn(impl) {
    var f = function () {
      var args = Array.prototype.slice.call(arguments); f.mock.calls.push(args);
      try {
        var g = f.__mot.length ? f.__mot.shift() : f.__impl;
        var r = g ? g.apply(this, args) : f.__tra;
        f.mock.results.push({ type: 'return', value: r }); return r;
      } catch (e) { f.mock.results.push({ type: 'throw', value: e }); throw e; }
    };
    f.__laMock = true; f.mock = { calls: [], results: [] }; f.__impl = impl || null; f.__mot = []; f.__tra = undefined;
    f.mockReturnValue = function (v) { f.__impl = null; f.__tra = v; return f; };
    f.mockReturnValueOnce = function (v) { f.__mot.push(function () { return v; }); return f; };
    f.mockImplementation = function (g) { f.__impl = g; return f; };
    f.mockImplementationOnce = function (g) { f.__mot.push(g); return f; };
    f.mockResolvedValue = function (v) { f.__impl = function () { return Promise.resolve(v); }; return f; };
    f.mockRejectedValue = function (v) { f.__impl = function () { return Promise.reject(v); }; return f; };
    f.mockClear = f.mockReset = function () { f.mock.calls = []; f.mock.results = []; return f; };
    return f;
  }
  G.jest = { fn: fn, spyOn: function (obj, ten) { var goc = obj[ten]; var s = fn(function () { return goc.apply(this, arguments); }); obj[ten] = s; s.mockRestore = function () { obj[ten] = goc; }; return s; } };
  G.describe = function (ten, f) { var k = { ten: String(ten), be: [], ae: [] }; CHONG.push(k); try { f(); } finally { CHONG.pop(); } };
  G.beforeEach = function (f) { CHONG[CHONG.length - 1].be.push(f); };
  G.afterEach = function (f) { CHONG[CHONG.length - 1].ae.push(f); };
  G.test = G.it = function (ten, f) {
    if (typeof f !== 'function') throw new Error('test("' + ten + '") needs a function body');
    var duong = CHONG.slice(1).map(function (k) { return k.ten; }).concat([String(ten)]).join(' > ');
    REG.push({ ten: duong, fn: f, khung: CHONG.slice() });
  };
  function dinhDang(ten, args, i) {
    var j = 0;
    var s = String(ten).replace(/%[sdipjfo#%]/g, function (m) {
      if (m === '%%') return '%'; if (m === '%#') return String(i);
      var v = args[j++]; return m === '%p' || m === '%j' || m === '%o' ? show(v) : String(v);
    });
    if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) s = s.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, function (m, k) { return k in args[0] ? String(args[0][k]) : m; });
    return s;
  }
  G.test.each = G.it.each = function (rows) {
    return function (ten, f) {
      rows.forEach(function (r, i) {
        var args = Array.isArray(r) ? r : [r];
        G.test(dinhDang(ten, args, i), function () { return f.apply(null, args); });
      });
    };
  };
  G.test.skip = G.it.skip = function () {};
  G.describe.skip = function () {};
  /** Máy chấm: chạy mọi test đã đăng ký sau khi gán các tên toàn cục trong gan. */
  G.__chayBo = async function (gan) {
    for (var k in gan) G[k] = gan[k];
    var kq = { tong: REG.length, dat: [], truot: [] };
    for (var i = 0; i < REG.length; i++) {
      var t = REG[i]; G.__soExpect = 0;
      try {
        var be = [], ae = [];
        t.khung.forEach(function (fr) { be = be.concat(fr.be); ae = fr.ae.concat(ae); });
        for (var a = 0; a < be.length; a++) await be[a]();
        await t.fn();
        for (var b = 0; b < ae.length; b++) await ae[b]();
        if (!G.__soExpect) kq.truot.push({ ten: t.ten, loi: 'no expect() in this test', rong: true });
        else kq.dat.push(t.ten);
      } catch (e) {
        kq.truot.push({ ten: t.ten, loi: e && e.message !== undefined ? (e.name === 'AssertionError' ? '' : e.name + ': ') + e.message : String(e) });
      }
    }
    return kq;
  };
})(globalThis);`;

export const TESTKIT_JS = `/* lib/testkit.js — a tiny Jest-compatible test kit (describe · test/it · test.each · beforeEach/afterEach ·
 * expect(...).toBe/toEqual/toBeCloseTo/toThrow/toContain/toMatch/… · .not · .resolves/.rejects · jest.fn()).
 * Loaded BEFORE tests.js. DO NOT EDIT — the grader relies on it.
 * Bộ test nhỏ tương thích Jest, nạp trước tests.js. KHÔNG SỬA tệp này — máy chấm dùng nó.
 */
${KIT}
`;

/* ═══════════════════════════════ 1. ĐỘT BIẾN — kiemDotBien ═══════════════════════════════
 * o = {
 *   ten: ['calcFare'],               // tên toàn cục test gọi tới (hàm/lớp)
 *   dung: 'function calcFare(a){…}', // mã ĐÚNG (khai báo các tên ở trên)
 *   dotBien: [{ ma:'M1', moTa:'…', code:'function calcFare(a){…}', an?:true }],
 *   minTest: 4, nhom?: 'f1', nhomDotBien?: 'f2', anCo?: false
 * }
 */
const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v.en : v);
function implCode(code, ten) {
  return `(function () {\n${code}\nreturn { ${ten.map((t) => `${JSON.stringify(t)}: ${t}`).join(', ')} };\n})`;
}
function kiemBong(ten) {
  // Phát hiện người học tự khai báo lại (let/const/class) tên cần test ⇒ máy chấm không tráo được.
  return ten.map((t) => `if (typeof ${t} !== 'undefined' && ${t} !== globalThis[${JSON.stringify(t)}]) return 'tests.js must not declare ${t} itself (let/const/class/copy of the code) — call the global ${t} that the grader provides';`).join('\n');
}
export function kiemDotBien(o) {
  const { ten, dung, dotBien, minTest = 3, nhom, nhomDotBien } = o;
  const coKit = 'if (typeof __chayBo !== "function") return "lib/testkit.js is missing or was edited — restore it from the starter";';
  const dau = `const __KQ = await (async () => {\n${coKit}\nconst __DUNG = ${implCode(dung, ten)}();\n`;
  const kiem = [];
  kiem.push({
    moTa: { en: 'Every test passes against the CORRECT implementation (your expected values are right)', vi: 'Mọi test ĐẠT trên bản cài đặt ĐÚNG (giá trị mong đợi của bạn đúng)' },
    chuanBi: `${dau}const r = await __chayBo(__DUNG);\n${kiemBong(ten)}\nif (!r.tong) return 'No tests found — write test(...) blocks in tests.js';\nif (r.truot.length) return r.truot.length + ' of ' + r.tong + ' test(s) FAIL on the correct code: ' + r.truot.slice(0, 3).map(function (x) { return '"' + x.ten + '" — ' + x.loi; }).join(' | ');\nreturn 'OK';\n})();`,
    goi: '__KQ', mongDoi: 'OK', ...(nhom ? { nhom } : {}),
  });
  kiem.push({
    moTa: { en: `The suite has at least ${minTest} tests, each with at least one expect()`, vi: `Bộ test có ít nhất ${minTest} test, mỗi test có ít nhất một expect()` },
    chuanBi: `${dau}const r = await __chayBo(__DUNG);\nconst rong = r.truot.filter(function (x) { return x.rong; });\nif (rong.length) return 'test without any expect(): "' + rong[0].ten + '"';\nif (r.tong < ${minTest}) return 'only ' + r.tong + ' test(s) — write at least ${minTest}';\nreturn 'OK';\n})();`,
    goi: '__KQ', mongDoi: 'OK', ...(nhom ? { nhom } : {}),
  });
  for (const m of dotBien) {
    kiem.push({
      moTa: m.an
        ? { en: `Hidden mutant ${m.ma} is killed`, vi: `Mutant ẩn ${m.ma} bị giết` }
        : { en: `Kills mutant ${m.ma}: ${L(m.moTa)}`, vi: `Giết mutant ${m.ma}: ${m.moTa?.vi ?? L(m.moTa)}` },
      chuanBi: `${dau}const r1 = await __chayBo(__DUNG);\nif (!r1.dat.length) return 'no test passes on the correct code yet — fix your expected values first';\nconst __DB = ${implCode(m.code, ten)}();\nconst r2 = await __chayBo(__DB);\nconst chet = r1.dat.filter(function (t) { return r2.dat.indexOf(t) < 0; });\nreturn chet.length ? 'KILLED' : 'SURVIVED — all ' + r1.dat.length + ' passing test(s) also pass on this faulty version. Add a test that tells them apart.';\n})();`,
      goi: '__KQ', mongDoi: 'KILLED', ...(m.an ? { an: true } : {}), ...((nhomDotBien || nhom) ? { nhom: nhomDotBien || nhom } : {}),
    });
  }
  return kiem;
}

/* ═══════════════════════════════ 2. ĐỘ PHỦ — kiemPhu ═══════════════════════════════
 * Mã gắn đo: $s('S1'); trước mỗi lệnh · $d('D1', bieuThuc) quanh mỗi quyết định · $c('D1.A', dk) quanh mỗi
 * điều kiện con của quyết định ghép (giữ nguyên ngắn mạch như Java/JS). sach(code) = mã sạch để hiển thị
 * (cùng số dòng). Người học khai `const TESTS = [{ id, input: {...}, expected, type?, status? }]`.
 */
function boBoc(src, ten) {
  // $d('X', expr) / $c('X', expr) ⇒ expr  (quét ngoặc cân bằng, bỏ qua chuỗi)
  let out = '', i = 0;
  const mo = `$${ten}(`;
  while (i < src.length) {
    const j = src.indexOf(mo, i);
    if (j < 0) { out += src.slice(i); break; }
    out += src.slice(i, j);
    let k = j + mo.length, sau = 0, chuoi = null, phay = -1;
    for (; k < src.length; k++) {
      const ch = src[k];
      if (chuoi) { if (ch === '\\') { k++; continue; } if (ch === chuoi) chuoi = null; continue; }
      if (ch === "'" || ch === '"' || ch === '`') { chuoi = ch; continue; }
      if (ch === '(' || ch === '[' || ch === '{') sau++;
      else if (ch === ')' || ch === ']' || ch === '}') { if (sau === 0) break; sau--; }
      else if (ch === ',' && sau === 0 && phay < 0) phay = k;
    }
    out += boBoc(src.slice(phay + 1, k).replace(/^\s+/, ''), ten);
    i = k + 1;
  }
  return out;
}
export function sach(code) {
  return boBoc(boBoc(code.replace(/\$s\('[^']+'\);[ \t]*/g, ''), 'd'), 'c');
}
/** Danh sách id đánh dấu + dòng (1-based) trong mã sạch. */
export function moc(code) {
  const dong = code.split('\n');
  const tim = (re) => {
    const ds = [];
    dong.forEach((d, i) => { let m; const r = new RegExp(re, 'g'); while ((m = r.exec(d))) ds.push({ id: m[1], dong: i + 1 }); });
    return ds;
  };
  return { s: tim("\\$s\\('([^']+)'\\)"), d: tim("\\$d\\('([^']+)'"), c: tim("\\$c\\('([^']+)'") };
}
/** Mã sạch có số dòng (để in trong đề). */
export function danhSo(code, batDau = 1) {
  const ds = String(code).replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const w = String(ds.length + batDau - 1).length;
  return ds.map((d, i) => `${String(i + batDau).padStart(w, ' ')}  ${d}`).join('\n');
}

const COV_LIB = String.raw`
var __C = { s: {}, d: {}, c: {}, rec: {}, cur: {} };
function $s(id) { __C.s[id] = (__C.s[id] || 0) + 1; }
function $c(id, v) { v = !!v; var o = __C.c[id] || (__C.c[id] = { t: 0, f: 0 }); o[v ? 't' : 'f']++; __C.cur[id] = v; return v; }
function $d(id, v) {
  v = !!v; var o = __C.d[id] || (__C.d[id] = { t: 0, f: 0 }); o[v ? 't' : 'f']++;
  var vec = {}; for (var k in __C.cur) if (k.split('.')[0] === id) { vec[k] = __C.cur[k]; delete __C.cur[k]; }
  (__C.rec[id] || (__C.rec[id] = [])).push({ vec: vec, out: v }); return v;
}
function __mcdc(recs, conds) {
  var res = {};
  conds.forEach(function (c) {
    res[c] = (recs || []).some(function (r1) { return recs.some(function (r2) {
      if (r1.vec[c] === undefined || r2.vec[c] === undefined || r1.vec[c] === r2.vec[c] || r1.out === r2.out) return false;
      return conds.every(function (o) { return o === c || r1.vec[o] === undefined || r2.vec[o] === undefined || r1.vec[o] === r2.vec[o]; });
    }); });
  });
  return res;
}
function __chuan(v) { if (v && typeof v === 'object' && 'throws' in v) return 'throws ' + v.throws; return JSON.stringify(v); }
function __bang(a, b) {
  if (a && typeof a === 'object' && 'throws' in a) return !!(b && typeof b === 'object' && 'throws' in b) && String(a.throws) === String(b.throws);
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-9;
  if (typeof a === 'string' && typeof b === 'string') return a.trim().toLowerCase() === b.trim().toLowerCase();
  return JSON.stringify(a) === JSON.stringify(b);
}
function __goi(f, args) { try { return f.apply(null, args); } catch (e) { return { throws: e && e.name ? e.name : 'Error' }; } }
`;

/**
 * o = {
 *   code: 'function f(a,b){ $s("S1"); if ($d("D1", $c("D1.A", a>0) || $c("D1.B", b>0))) … }',
 *   ham: 'f', thamSo: ['a','b'], spec: 'function (a,b) { … }' (kết quả ĐÚNG theo đặc tả; mặc định = chính code),
 *   bien: 'TESTS',
 *   do: { lenh: true, nhanh: true, dieuKien: false, mcdc: ['D1'] | false, toiThieu: 5 | null, toiDa?: n,
 *         kyVong: true, loai: 'function (input) { return ["A"] }' | null, trangThai: true },
 *   nhom: { lenh:'f1', … } | 'f1',  an: { kyVong: true, … }
 * }
 */
export function kiemPhu(o) {
  const { code, ham, thamSo, bien = 'TESTS' } = o;
  const d = { lenh: true, nhanh: true, dieuKien: false, mcdc: false, toiThieu: null, toiDa: null, kyVong: true, loai: null, trangThai: false, ...(o.do || {}) };
  const m = moc(code);
  const sachCode = sach(code);
  const dongS = Object.fromEntries(m.s.map((x) => [x.id, x.dong]));
  const dongD = Object.fromEntries(m.d.map((x) => [x.id, x.dong]));
  const dongSach = sachCode.split('\n');
  const nhanD = Object.fromEntries(m.d.map((x) => [x.id, (dongSach[x.dong - 1] || '').trim().slice(0, 60)]));
  const dsC = m.c.map((x) => x.id);
  const condOf = (dd) => dsC.filter((c) => c.split('.')[0] === dd);
  const NH = (k) => (typeof o.nhom === 'string' ? o.nhom : o.nhom?.[k]);
  const AN = (k) => !!(o.an && o.an[k]);
  const dau = `${COV_LIB}
${code}
const __spec = ${o.spec || ham};
const __TS = ${JSON.stringify(thamSo)};
const __T = (typeof ${bien} !== 'undefined' && Array.isArray(${bien})) ? ${bien} : null;
const __KQ = (function () {
  if (!__T) return '${bien} is missing — declare: const ${bien} = [ { id: "UTCID01", input: { … }, expected: … }, … ]';
  if (!__T.length) return '${bien} is empty';
  for (var i = 0; i < __T.length; i++) {
    var t = __T[i];
    if (!t || typeof t !== 'object' || !t.input || typeof t.input !== 'object') return 'test #' + (i + 1) + ' needs an "input" object, e.g. { ' + __TS.map(function (p) { return p + ': …'; }).join(', ') + ' }';
    for (var j = 0; j < __TS.length; j++) if (!(__TS[j] in t.input)) return (t.id || 'test #' + (i + 1)) + ': input has no "' + __TS[j] + '"';
  }
  var args = __T.map(function (t) { return __TS.map(function (p) { return t.input[p]; }); });
  var thuc = args.map(function (a) { return __goi(${ham}, a); });
  var S = ${JSON.stringify(m.s.map((x) => x.id))}, D = ${JSON.stringify(m.d.map((x) => x.id))}, DS = ${JSON.stringify(dongS)}, DD = ${JSON.stringify(dongD)}, ND = ${JSON.stringify(nhanD)};
  function viec(k) {
`;
  const cuoi = `
  }
  return viec;
})();
`;
  const kiem = [];
  const them = (khoa, moTa, than) => kiem.push({
    moTa,
    chuanBi: `${dau}${than}${cuoi}`,
    goi: `typeof __KQ === 'string' ? __KQ : __KQ()`, mongDoi: 'OK',
    ...(NH(khoa) ? { nhom: NH(khoa) } : {}), ...(AN(khoa) ? { an: true } : {}),
  });
  if (d.lenh) them('lenh', { en: '100% statement coverage', vi: 'Phủ 100% câu lệnh (statement coverage)' }, `
    var thieu = S.filter(function (s) { return !__C.s[s]; });
    if (!thieu.length) return 'OK';
    return 'statement coverage ' + Math.round(100 * (S.length - thieu.length) / S.length) + '% — never executed: line ' + thieu.map(function (s) { return DS[s]; }).join(', line ');`);
  if (d.nhanh) them('nhanh', { en: '100% decision (branch) coverage — every decision both TRUE and FALSE', vi: 'Phủ 100% quyết định (nhánh) — mọi quyết định đều nhận cả TRUE lẫn FALSE' }, `
    var thieu = [];
    D.forEach(function (x) { var o = __C.d[x] || { t: 0, f: 0 }; if (!o.t) thieu.push('line ' + DD[x] + ' (' + ND[x] + ') never TRUE'); if (!o.f) thieu.push('line ' + DD[x] + ' (' + ND[x] + ') never FALSE'); });
    if (!thieu.length) return 'OK';
    return 'decision coverage ' + Math.round(100 * (2 * D.length - thieu.length) / (2 * D.length)) + '% — ' + thieu.join('; ');`);
  if (d.dieuKien) them('dieuKien', { en: '100% condition coverage — every atomic condition both TRUE and FALSE', vi: 'Phủ 100% điều kiện — mọi điều kiện con đều nhận cả TRUE lẫn FALSE' }, `
    var CC = ${JSON.stringify(dsC)}; var thieu = [];
    CC.forEach(function (x) { var o = __C.c[x] || { t: 0, f: 0 }; if (!o.t) thieu.push(x + ' never TRUE'); if (!o.f) thieu.push(x + ' never FALSE'); });
    return thieu.length ? 'condition coverage incomplete — ' + thieu.join('; ') : 'OK';`);
  if (d.mcdc) for (const dd of d.mcdc) {
    const cs = condOf(dd);
    them('mcdc', { en: `MC/DC for the compound decision on line ${dongD[dd]}: each condition shown to independently affect the outcome`, vi: `MC/DC cho quyết định ghép ở dòng ${dongD[dd]}: mỗi điều kiện được chứng minh tác động độc lập lên kết quả` }, `
    var r = __mcdc(__C.rec[${JSON.stringify(dd)}], ${JSON.stringify(cs)});
    var thieu = Object.keys(r).filter(function (c) { return !r[c]; });
    return thieu.length ? 'no independence pair yet for condition ' + thieu.join(', ') + ' (need two tests that differ only in it — other conditions equal or not evaluated — and give different outcomes)' : 'OK';`);
  }
  if (d.toiThieu) them('toiThieu', { en: `Minimal set: exactly the minimum number of test cases (no redundant ones)`, vi: `Bộ tối thiểu: đúng số ca tối thiểu (không ca thừa)` }, `
    if (__T.length > ${d.toiThieu}) return __T.length + ' test cases — the target can be reached with fewer. Remove the redundant ones.';
    if (__T.length < ${d.toiThieu}) return __T.length + ' test cases — not enough to satisfy every coverage criterion above.';
    return 'OK';`);
  if (d.toiDa) them('toiDa', { en: `No more than ${d.toiDa} test cases`, vi: `Không quá ${d.toiDa} ca` }, `
    return __T.length > ${d.toiDa} ? __T.length + ' test cases — at most ${d.toiDa} allowed' : 'OK';`);
  if (d.kyVong) them('kyVong', { en: 'Every "expected" value comes from the SPECIFICATION', vi: 'Mọi giá trị "expected" lấy từ ĐẶC TẢ' }, `
    var sai = [];
    __T.forEach(function (t, i) { var e = __goi(__spec, args[i]); if (!('expected' in t)) sai.push((t.id || '#' + (i + 1)) + ': missing "expected"'); else if (!__bang(t.expected, e)) sai.push((t.id || '#' + (i + 1)) + ': expected ' + __chuan(t.expected) + ' but the specification gives ' + __chuan(e)); });
    return sai.length ? sai.slice(0, 3).join(' | ') : 'OK';`);
  if (d.loai) them('loai', { en: 'Type column (N = Normal, A = Abnormal, B = Boundary) is right for every case', vi: 'Cột Type (N/A/B) đúng cho mọi ca' }, `
    var __loai = ${d.loai};
    var sai = [];
    __T.forEach(function (t, i) { var ok = __loai(t.input); if (ok.indexOf(String(t.type || '').toUpperCase()) < 0) sai.push((t.id || '#' + (i + 1)) + ': type ' + JSON.stringify(t.type) + ' — should be ' + ok.join(' or ')); });
    return sai.length ? sai.slice(0, 3).join(' | ') : 'OK';`);
  if (d.trangThai) them('trangThai', { en: 'Passed/Failed column matches what the CODE really returns versus the expected value', vi: 'Cột Passed/Failed khớp với kết quả THẬT của mã so với mong đợi' }, `
    var sai = [];
    __T.forEach(function (t, i) { var e = __goi(__spec, args[i]); var p = __bang(thuc[i], e) ? 'P' : 'F'; if (String(t.status || '').toUpperCase() !== p) sai.push((t.id || '#' + (i + 1)) + ': status ' + JSON.stringify(t.status) + ' — the code returns ' + __chuan(thuc[i]) + ', so it is ' + p); });
    return sai.length ? sai.slice(0, 3).join(' | ') : 'OK';`);
  return kiem;
}

/* ═══════════════════════════════ 3. TEST CASE HỘP ĐEN — kiemTestCase ═══════════════════════════════
 * o = {
 *   bien: 'TEST_CASES',
 *   heThong: 'function (data) { … return "thông báo/kết quả"; }',   // hệ thống tham chiếu theo đặc tả
 *   nhan: 'function (data, out) { return ["MSG_REQ_CODE", "R3", …]; }', // nhãn phủ của một ca
 *   truongData: ['bookingCode', …] (khoá phải có trong data — có thể '' để bỏ trống),
 *   khoi: [{ moTa:{en,vi}, can: [{ ma:'R1', ten:'…' }], nhom:'f6', an? }],
 *   nhomCauTruc: 'f5', nhomKyVong: 'f5', toiDa?: 40
 * }
 * Ca: { id, description, precondition, steps: [...], data: {...}, expected: '...' }
 */
const TC_LIB = String.raw`
function __n(s) { return String(s == null ? '' : s).toLowerCase().replace(/[\s,.]/g, '').replace(/["'“”]/g, ''); }
`;
export function kiemTestCase(o) {
  const { bien = 'TEST_CASES', heThong, nhan, truongData = [], khoi = [], toiDa = 60 } = o;
  const dau = `${TC_LIB}
const __HT = ${heThong};
const __NHAN = ${nhan || 'function () { return []; }'};
const __TRUONG = ${JSON.stringify(truongData)};
const __T = (typeof ${bien} !== 'undefined' && Array.isArray(${bien})) ? ${bien} : null;
const __KQ = (function () {
  if (!__T) return '${bien} is missing — declare: const ${bien} = [ { id, description, precondition, steps: [...], data: {...}, expected }, … ]';
  if (!__T.length) return '${bien} is empty';
  var loiCT = null;
  for (var i = 0; i < __T.length; i++) {
    var t = __T[i], ten = (t && t.id) || ('#' + (i + 1));
    if (!t || typeof t !== 'object') { loiCT = ten + ' is not an object'; break; }
    if (!t.data || typeof t.data !== 'object') { loiCT = ten + ': "data" object is missing'; break; }
    var thieu = __TRUONG.filter(function (k) { return !(k in t.data); });
    if (thieu.length) { loiCT = ten + ': data has no field ' + thieu.join(', ') + ' (use "" for an empty field)'; break; }
  }
  var thuc = loiCT ? [] : __T.map(function (t) { try { return String(__HT(t.data)); } catch (e) { return 'ERROR ' + e.message; } });
  var dung = loiCT ? [] : __T.map(function (t, i) { return __n(t.expected) !== '' && __n(t.expected) === __n(thuc[i]); });
  var phu = {};
  if (!loiCT) __T.forEach(function (t, i) { if (dung[i]) (__NHAN(t.data, thuc[i]) || []).forEach(function (x) { phu[x] = (phu[x] || []).concat([t.id || '#' + (i + 1)]); }); });
  function viec(k) {
    if (loiCT) return loiCT;
`;
  const cuoi = `
  }
  return viec;
})();
`;
  const kiem = [];
  const them = (moTa, than, ex = {}) => kiem.push({ moTa, chuanBi: `${dau}${than}${cuoi}`, goi: `typeof __KQ === 'string' ? __KQ : __KQ()`, mongDoi: 'OK', ...ex });
  them({ en: 'Every test case is complete: unique id, description, precondition, numbered steps, expected result', vi: 'Mọi ca đủ trường: id duy nhất, mô tả, tiền điều kiện, các bước, kết quả mong đợi' }, `
    var thay = {}, loi = [];
    __T.forEach(function (t, i) {
      var ten = t.id || ('#' + (i + 1));
      if (!t.id) loi.push('#' + (i + 1) + ': no id');
      else if (thay[t.id]) loi.push('duplicate id ' + t.id); thay[t.id] = 1;
      if (!String(t.description || '').trim()) loi.push(ten + ': empty description');
      if (!String(t.precondition || '').trim()) loi.push(ten + ': empty precondition');
      if (!Array.isArray(t.steps) || !t.steps.length) loi.push(ten + ': steps must be a non-empty array');
      if (!String(t.expected == null ? '' : t.expected).trim()) loi.push(ten + ': empty expected result');
    });
    if (__T.length > ${toiDa}) loi.push(__T.length + ' cases — keep it under ${toiDa} (no padding)');
    var trung = {}; __T.forEach(function (t) { var k = JSON.stringify(t.data); if (trung[k]) loi.push((t.id || '?') + ' repeats the data of ' + trung[k]); else trung[k] = t.id || '?'; });
    return loi.length ? loi.slice(0, 4).join(' | ') : 'OK';`, o.nhomCauTruc ? { nhom: o.nhomCauTruc } : {});
  them({ en: 'Every expected result matches the specification exactly (message text / computed amount)', vi: 'Mọi kết quả mong đợi khớp đặc tả (đúng chữ thông báo / đúng số tiền tính ra)' }, `
    var sai = [];
    __T.forEach(function (t, i) { if (!dung[i]) sai.push((t.id || '#' + (i + 1)) + ': expected "' + t.expected + '" — the specification gives "' + thuc[i] + '"'); });
    return sai.length ? sai.slice(0, 3).join(' | ') : 'OK';`, o.nhomKyVong ? { nhom: o.nhomKyVong } : {});
  for (const k of khoi) {
    const can = k.can.map((x) => (typeof x === 'string' ? { ma: x, ten: x } : x));
    if (k.tungMuc) {
      for (const c of can) {
        them({ en: `${L(k.moTa)} — ${c.ten}`, vi: `${k.moTa.vi ?? L(k.moTa)} — ${c.ten}` }, `
    return phu[${JSON.stringify(c.ma)}] ? 'OK' : 'not covered yet: ${c.ten.replace(/'/g, "\\'")} (a test case whose data hits it AND whose expected result is right)';`, { ...(k.nhom ? { nhom: k.nhom } : {}), ...(k.an ? { an: true } : {}) });
      }
    } else {
      them(k.moTa, `
    var CAN = ${JSON.stringify(can)};
    var thieu = CAN.filter(function (c) { return !phu[c.ma]; });
    return thieu.length ? 'not covered yet (' + (CAN.length - thieu.length) + '/' + CAN.length + '): ' + thieu.map(function (c) { return c.ten; }).join('; ') : 'OK';`, { ...(k.nhom ? { nhom: k.nhom } : {}), ...(k.an ? { an: true } : {}) });
    }
  }
  return kiem;
}

/* ═══════════════════════════════ 4. KHOÁ ĐÁP ÁN ═══════════════════════════════
 * kiemReview: ISSUES = [{ line, type, severity?, description, fix }]
 * khoa = [{ ma:'K1', dong:[4], loai:['LOGIC','BOUNDARY'], ten:'off-by-one in the loop', nang?:true }]
 * sai  = [{ dong:[7], loai:['SYNTAX'], ten:'…' }] — khẳng định SAI (vd coi & đơn là lỗi biên dịch)
 */
const LIB_KHOA = String.raw`
function __dongCua(x) { if (Array.isArray(x.lines)) return x.lines.map(Number); if (x.line != null) return String(x.line).split(/[^0-9]+/).filter(Boolean).map(Number); return []; }
function __hop(i, k) { var d = __dongCua(i); var t = String(i.type || '').toUpperCase().trim(); return d.some(function (n) { return k.dong.indexOf(n) >= 0; }) && (!k.loai || k.loai.indexOf(t) >= 0); }
// ghép cặp tối đa lỗi ↔ khoá: MỘT mục người học chỉ được tính cho MỘT lỗi thật
function __ghep(I, K) {
  var gan = {};
  function thu(i, tham) {
    for (var k = 0; k < K.length; k++) {
      if (tham[k] || !__hop(I[i], K[k])) continue;
      tham[k] = 1;
      if (gan[k] === undefined || thu(gan[k], tham)) { gan[k] = i; return true; }
    }
    return false;
  }
  for (var i = 0; i < I.length; i++) thu(i, {});
  return Object.keys(gan).map(function (k) { return K[k]; });
}
`;
export function kiemReview(o) {
  const { bien = 'ISSUES', khoa, sai = [], toiThieu = 8, nhom, nhomNang, nhomSua, loaiHopLe } = o;
  const dau = `${LIB_KHOA}
const __K = ${JSON.stringify(khoa)};
const __SAI = ${JSON.stringify(sai)};
const __LOAI = ${JSON.stringify(loaiHopLe || null)};
const __I = (typeof ${bien} !== 'undefined' && Array.isArray(${bien})) ? ${bien} : null;
const __KQ = (function () {
  if (!__I) return '${bien} is missing — declare: const ${bien} = [ { line: 4, type: "LOGIC", severity: "High", description: "…", fix: "…" }, … ]';
  var bad = __I.filter(function (x) { return !x || !__dongCua(x).length || !String(x.description || '').trim(); });
  if (bad.length) return 'every issue needs a line number and a description';
  if (__LOAI) { var lt = __I.filter(function (x) { return __LOAI.indexOf(String(x.type || '').toUpperCase().trim()) < 0; }); if (lt.length) return 'unknown type ' + JSON.stringify(lt[0].type) + ' — use one of ' + __LOAI.join(', '); }
  var timRa = __ghep(__I, __K);
  function viec(k) {
`;
  const cuoi = `
  }
  return viec;
})();
`;
  const kiem = [];
  const them = (moTa, than, ex = {}) => kiem.push({ moTa, chuanBi: `${dau}${than}${cuoi}`, goi: `typeof __KQ === 'string' ? __KQ : __KQ()`, mongDoi: 'OK', ...ex });
  for (let n = 2; n <= toiThieu; n += 2) {
    them({ en: `At least ${n} distinct real issues with the right line and type`, vi: `Ít nhất ${n} lỗi thật khác nhau, đúng dòng và đúng loại` }, `
    return timRa.length >= ${n} ? 'OK' : 'found ' + timRa.length + ' valid issue(s) — need ${n}. (An issue counts when its line AND type match a real defect.)';`, nhom ? { nhom } : {});
  }
  for (const k of khoa.filter((x) => x.nang)) {
    them({ en: `Finds the critical defect: ${k.ten}`, vi: `Tìm ra lỗi nghiêm trọng: ${k.tenVi || k.ten}` }, `
    return __I.some(function (i) { return __hop(i, __K.filter(function (x) { return x.ma === ${JSON.stringify(k.ma)}; })[0]); }) ? 'OK' : 'missed a critical defect (check the line(s) ${k.dong.join('/')})';`, { ...(nhomNang || nhom ? { nhom: nhomNang || nhom } : {}), ...(k.an ? { an: true } : {}) });
  }
  if (sai.length) them({ en: 'No false claims (legal code reported as an error)', vi: 'Không khẳng định sai (báo lỗi cho mã hợp lệ)' }, `
    var s = __SAI.filter(function (k) { return __I.some(function (i) { return __hop(i, k); }); });
    return s.length ? 'false claim: ' + s.map(function (k) { return k.ten; }).join('; ') : 'OK';`, (nhomSua || nhom) ? { nhom: nhomSua || nhom } : {});
  them({ en: 'Every issue has a concrete fix suggestion', vi: 'Mỗi lỗi có gợi ý sửa cụ thể' }, `
    var t = __I.filter(function (x) { return String(x.fix || '').trim().length < 6; });
    return t.length ? (t.length + ' issue(s) without a real fix (e.g. line ' + __dongCua(t[0]).join('/') + ')') : 'OK';`, (nhomSua || nhom) ? { nhom: nhomSua || nhom } : {});
  return kiem;
}

/**
 * kiemKhoa: so một đối tượng/mảng người học khai với khoá — mỗi mục một kiểm.
 * muc = [{ moTa:{en,vi}, bieuThuc:'ANSWERS.q1', chap: ['b'] | [[...]], kieu:'chuoi'|'tap'|'so'|'json', an?, nhom? }]
 *  - chuoi: so chuỗi (bỏ hoa/thường, khoảng trắng hai đầu) với một trong `chap`
 *  - tap:   mảng, so như TẬP (không thứ tự, bỏ hoa/thường) với một trong `chap` (mỗi phần tử của chap là một mảng)
 *  - so:    số (sai số `saiSo`)
 *  - json:  so sâu JSON
 */
export function kiemKhoa(muc, { goiY = '' } = {}) {
  return muc.map((m) => {
    const kieu = m.kieu || 'chuoi';
    return {
      moTa: m.moTa,
      chuanBi: `const __KQ = (function () {
  var v; try { v = (${m.bieuThuc}); } catch (e) { return '${m.bieuThuc.replace(/'/g, "\\'")} is not defined yet'; }
  if (v === undefined || v === null || v === '') return '${m.bieuThuc.replace(/'/g, "\\'")} is empty';
  var chap = ${JSON.stringify(m.chap)};
  var n = function (s) { return String(s).trim().toLowerCase().replace(/\\s+/g, ' '); };
  var ok;
  if (${JSON.stringify(kieu)} === 'tap') { if (!Array.isArray(v)) return 'expected an array'; var a = v.map(n).sort().join('|'); ok = chap.some(function (c) { return c.map(n).sort().join('|') === a; }); }
  else if (${JSON.stringify(kieu)} === 'so') { ok = chap.some(function (c) { return Math.abs(Number(v) - Number(c)) <= ${m.saiSo ?? 1e-9}; }); }
  else if (${JSON.stringify(kieu)} === 'json') { ok = chap.some(function (c) { return JSON.stringify(c) === JSON.stringify(v); }); }
  else ok = chap.some(function (c) { return n(c) === n(v); });
  return ok ? 'OK' : 'not right yet${m.goiY ? ` — ${m.goiY.replace(/'/g, "\\'")}` : goiY ? ` — ${goiY.replace(/'/g, "\\'")}` : ''}';
})();`,
      goi: '__KQ', mongDoi: 'OK',
      ...(m.nhom ? { nhom: m.nhom } : {}), ...(m.an ? { an: true } : {}),
    };
  });
}

/* ═══════════════════════════════ BÀI TĨNH (choice / order / table) ═══════════════════════════════ */
const chu = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
/** Câu song ngữ cho choice/order/table: EN đậm, VI nghiêng nhỏ ngay dưới. */
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
/** Giải thích song ngữ. */
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
/** Lựa chọn nhanh: ['a', 'nội dung'] … ⇒ [{ma, noiDung}] */
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));

export function tinh(q) {
  const loai = q.loai || 'choice';
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const tieu = typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en;
  const de = ds.map((c, i) => `${i + 1}. ${chu(c.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v.join(' / ') : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((c, i) => {
      const d = Array.isArray(c.dapAn) ? (Array.isArray(c.dapAn[0]) ? c.dapAn[0] : c.dapAn) : [c.dapAn];
      const muc = c.luaChon || c.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((x) => x.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(c.de)}\n   Answer: ${ten}\n   ${chu(c.giaiThich)}`;
    }).join('\n\n');
  }
  const tests = loai === 'table' ? { loai, bang: q.bang } : { loai, cauHoi: q.cauHoi };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  void _c; void _b; void _l;
  return {
    ngonNgu: 'text',
    yeuCau: q.yeuCau || [
      { en: 'Answer every question in the answer panel, then press <b>Submit</b>.', vi: 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.' },
      { en: 'All answers must be correct to get <b>Accepted</b>; the explanations appear after you submit.', vi: 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.' },
    ],
    viDu: q.viDu || [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }],
    ...rest,
    tests,
    khoiDau: { 'answers.md': `# ${tieu}\n\nAnswer in the answer panel (no code needed).\n\n${de}\n` },
    loiGiai: { 'answers.md': `# ${tieu} — answer key\n\n${dap}\n` },
  };
}

/* ═══════════════════════════════ SƠ ĐỒ SVG (in được, hai chế độ màu) ═══════════════════════════════
 * svg({ w, h, nut:[{ id, x, y, nhan, hinh:'tron'|'thoi'|'chu'|'tt'|'cuoi'|'dau'|'hop', r?, rong?, cao?, mau? }],
 *       canh:[{ tu, den, nhan?, cong?: px (cong sang phải theo chiều đi), nhanDx?, nhanDy?, net?: 'dut' }],
 *       chu:[{ x, y, nhan, co?, dam? }], tieuDe? })
 *  tron = nút CFG (vòng tròn số) · thoi = quyết định · chu = hộp lệnh/hoạt động · tt = trạng thái (bo góc)
 *  cuoi = trạng thái kết thúc (vòng đôi) · dau = điểm bắt đầu (chấm đen) · hop = hộp chữ nhật vuông góc
 */
const escX = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function svg({ w, h, nut = [], canh = [], chu: chuRoi = [], tieuDe = '' }) {
  const N = Object.fromEntries(nut.map((n) => [n.id, n]));
  const kt = (n) => {
    const r = n.r ?? 18;
    if (n.hinh === 'tron' || n.hinh === 'cuoi') return { k: 'tron', r };
    if (n.hinh === 'dau') return { k: 'tron', r: 8 };
    const rong = n.rong ?? Math.max(70, String(n.nhan).length * 7.2 + 20);
    const cao = n.cao ?? (n.hinh === 'thoi' ? 44 : 34);
    return { k: n.hinh === 'thoi' ? 'thoi' : 'hop', hw: rong / 2, hh: cao / 2 };
  };
  const bien = (n, tx, ty) => {
    // điểm trên viền của n theo hướng tới (tx,ty)
    const dx = tx - n.x, dy = ty - n.y, len = Math.hypot(dx, dy) || 1;
    const s = kt(n);
    if (s.k === 'tron') return [n.x + (dx / len) * s.r, n.y + (dy / len) * s.r];
    if (s.k === 'thoi') { const t = 1 / (Math.abs(dx) / s.hw + Math.abs(dy) / s.hh); return [n.x + dx * t, n.y + dy * t]; }
    const t = Math.min(Math.abs(dx) > 1e-9 ? s.hw / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-9 ? s.hh / Math.abs(dy) : Infinity);
    return [n.x + dx * t, n.y + dy * t];
  };
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;display:block;margin:8px auto" role="img" aria-label="${escX(tieuDe || 'diagram')}" font-family="Arial, Helvetica, sans-serif" font-size="12">`);
  out.push(`<defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1f2937"/></marker></defs>`);
  out.push(`<rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#ffffff" stroke="#d1d5db"/>`);
  if (tieuDe) out.push(`<text x="${w / 2}" y="18" text-anchor="middle" font-weight="700" fill="#111827">${escX(tieuDe)}</text>`);
  for (const c of canh) {
    const a = N[c.tu], b = N[c.den];
    if (!a || !b) throw new Error(`svg: cạnh ${c.tu}→${c.den} trỏ nút không có`);
    let d, lx, ly;
    if (c.tu === c.den) {
      // vòng tự lặp phía trên nút
      const s = kt(a); const top = a.y - (s.r ?? s.hh);
      d = `M${a.x - 8},${top} C${a.x - 30},${top - 40} ${a.x + 30},${top - 40} ${a.x + 8},${top}`;
      lx = a.x; ly = top - 34;
    } else if (c.cong) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const cx = mx + (-dy / len) * c.cong, cy = my + (dx / len) * c.cong;
      const [x1, y1] = bien(a, cx, cy), [x2, y2] = bien(b, cx, cy);
      d = `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
      lx = (x1 + 2 * cx + x2) / 4; ly = (y1 + 2 * cy + y2) / 4;
    } else if (c.qua) {
      // đường gấp khúc qua các điểm [[x,y],…]
      const ds = c.qua;
      const [x1, y1] = bien(a, ds[0][0], ds[0][1]);
      const [x2, y2] = bien(b, ds[ds.length - 1][0], ds[ds.length - 1][1]);
      d = `M${x1.toFixed(1)},${y1.toFixed(1)} ${ds.map(([x, y]) => `L${x},${y}`).join(' ')} L${x2.toFixed(1)},${y2.toFixed(1)}`;
      const g = ds[Math.floor((ds.length - 1) / 2)];
      lx = g[0]; ly = g[1];
    } else {
      const [x1, y1] = bien(a, b.x, b.y), [x2, y2] = bien(b, a.x, a.y);
      d = `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`;
      lx = (x1 + x2) / 2; ly = (y1 + y2) / 2;
    }
    out.push(`<path d="${d}" fill="none" stroke="#1f2937" stroke-width="1.4"${c.net === 'dut' ? ' stroke-dasharray="5 4"' : ''} marker-end="url(#mt)"/>`);
    if (c.nhan) {
      const x = lx + (c.nhanDx ?? 0), y = ly + (c.nhanDy ?? 0);
      const lw = String(c.nhan).length * 6.4 + 8;
      out.push(`<rect x="${(x - lw / 2).toFixed(1)}" y="${(y - 9).toFixed(1)}" width="${lw.toFixed(1)}" height="16" rx="3" fill="#ffffff" opacity="0.92"/>`);
      out.push(`<text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" fill="#7c2d12" font-size="11">${escX(c.nhan)}</text>`);
    }
  }
  for (const n of nut) {
    const s = kt(n);
    const fill = n.mau || (n.hinh === 'thoi' ? '#fef3c7' : n.hinh === 'tt' || n.hinh === 'cuoi' ? '#e0f2fe' : n.hinh === 'tron' ? '#f3f4f6' : '#eef2ff');
    if (n.hinh === 'dau') { out.push(`<circle cx="${n.x}" cy="${n.y}" r="8" fill="#111827"/>`); continue; }
    if (s.k === 'tron') {
      out.push(`<circle cx="${n.x}" cy="${n.y}" r="${s.r}" fill="${fill}" stroke="#1f2937" stroke-width="1.4"/>`);
      if (n.hinh === 'cuoi') out.push(`<circle cx="${n.x}" cy="${n.y}" r="${s.r - 4}" fill="none" stroke="#1f2937" stroke-width="1.2"/>`);
    } else if (s.k === 'thoi') {
      out.push(`<polygon points="${n.x},${n.y - s.hh} ${n.x + s.hw},${n.y} ${n.x},${n.y + s.hh} ${n.x - s.hw},${n.y}" fill="${fill}" stroke="#1f2937" stroke-width="1.4"/>`);
    } else {
      out.push(`<rect x="${n.x - s.hw}" y="${n.y - s.hh}" width="${s.hw * 2}" height="${s.hh * 2}" rx="${n.hinh === 'tt' ? 12 : n.hinh === 'hop' ? 0 : 5}" fill="${fill}" stroke="#1f2937" stroke-width="1.4"/>`);
    }
    const dong = String(n.nhan).split('\n');
    dong.forEach((t, i) => out.push(`<text x="${n.x}" y="${(n.y + 4 + (i - (dong.length - 1) / 2) * 14).toFixed(1)}" text-anchor="middle" fill="#111827"${n.dam !== false && s.k === 'tron' ? ' font-weight="700"' : ''}>${escX(t)}</text>`));
  }
  for (const t of chuRoi) out.push(`<text x="${t.x}" y="${t.y}" text-anchor="${t.neo || 'middle'}" fill="${t.mau || '#374151'}" font-size="${t.co || 12}"${t.dam ? ' font-weight="700"' : ''}>${escX(t.nhan)}</text>`);
  out.push('</svg>');
  return out.join('');
}

/** Bảng HTML nhanh: bangHtml(['A','B'], [['1','2'], …]) */
export function bangHtml(cot, hang) {
  return `<table><thead><tr>${cot.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${hang.map((h) => `<tr>${h.map((o) => `<td>${o}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
/** Khối mã có số dòng (đã escape). */
export const preSo = (code, batDau = 1) => `<pre>${escX(danhSo(code, batDau))}</pre>`;
export const preMa = (code) => `<pre>${escX(String(code).replace(/^\n/, '').replace(/\s+$/, ''))}</pre>`;

/* ═══════════════════════════════ THUẬT NGỮ CHUNG ═══════════════════════════════ */
export const TN = {
  testCase: { en: 'test case', vi: 'ca kiểm thử: điều kiện + dữ liệu + bước + kết quả mong đợi' },
  expected: { en: 'expected result', vi: 'kết quả mong đợi — lấy từ ĐẶC TẢ, không lấy từ mã' },
  actual: { en: 'actual result', vi: 'kết quả thực tế khi chạy' },
  spec: { en: 'specification', vi: 'đặc tả (tài liệu mô tả hành vi đúng)' },
  testBasis: { en: 'test basis', vi: 'cơ sở kiểm thử — tài liệu dùng để thiết kế test (đặc tả, mã, user story…)' },
  ep: { en: 'equivalence partitioning (EP)', vi: 'phân vùng tương đương — chia miền dữ liệu thành các vùng được xử lý như nhau' },
  bva: { en: 'boundary value analysis (BVA)', vi: 'phân tích giá trị biên — test ở mép các vùng' },
  partition: { en: 'partition / equivalence class', vi: 'vùng (lớp) tương đương' },
  boundary: { en: 'boundary value', vi: 'giá trị biên (min/max của một vùng có thứ tự)' },
  decisionTable: { en: 'decision table', vi: 'bảng quyết định — tổ hợp điều kiện ⇒ hành động' },
  stateTransition: { en: 'state transition testing', vi: 'kiểm thử chuyển trạng thái' },
  statement: { en: 'statement coverage', vi: 'độ phủ câu lệnh (C0)' },
  decision: { en: 'decision (branch) coverage', vi: 'độ phủ quyết định / nhánh (C1)' },
  condition: { en: 'condition coverage', vi: 'độ phủ điều kiện — mỗi điều kiện con nhận cả T và F' },
  mcdc: { en: 'MC/DC (modified condition/decision coverage)', vi: 'phủ điều kiện/quyết định sửa đổi — mỗi điều kiện tác động ĐỘC LẬP lên kết quả' },
  cfg: { en: 'control-flow graph (CFG)', vi: 'đồ thị luồng điều khiển' },
  cyclomatic: { en: 'cyclomatic complexity V(G)', vi: 'độ phức tạp chu trình = E − N + 2 = số quyết định + 1' },
  mutant: { en: 'mutant', vi: 'bản đột biến — bản mã cố ý cài một lỗi nhỏ để thử độ mạnh của bộ test' },
  kill: { en: 'kill a mutant', vi: '"giết" mutant — có test đạt trên mã đúng nhưng trượt trên mutant' },
  assertion: { en: 'assertion', vi: 'phép khẳng định (expect/assertEquals) — so thực tế với mong đợi' },
  aaa: { en: 'Arrange–Act–Assert (AAA)', vi: 'mẫu viết test 3 bước: chuẩn bị – gọi – khẳng định' },
  parameterized: { en: 'parameterized test', vi: 'test tham số hoá — một thân test, nhiều bộ dữ liệu (@ParameterizedTest / test.each)' },
  utcid: { en: 'UTCID', vi: 'mã ca unit test trong template FPT (UTCID01, UTCID02…) — mỗi ca một cột' },
  nab: { en: 'N / A / B', vi: 'loại ca: Normal (bình thường) / Abnormal (bất thường, lỗi) / Boundary (biên)' },
  precondition: { en: 'precondition', vi: 'tiền điều kiện — trạng thái phải có trước khi chạy ca' },
  defect: { en: 'defect (bug, fault)', vi: 'khiếm khuyết trong sản phẩm (mã, tài liệu)' },
  failure: { en: 'failure', vi: 'thất bại — hệ thống chạy sai quan sát được' },
  error: { en: 'error (mistake)', vi: 'lỗi của CON NGƯỜI dẫn tới defect' },
  rootCause: { en: 'root cause', vi: 'nguyên nhân gốc' },
  severity: { en: 'severity', vi: 'mức nghiêm trọng — ảnh hưởng của lỗi lên hệ thống' },
  priority: { en: 'priority', vi: 'độ ưu tiên — cần sửa gấp tới đâu (quyết định kinh doanh)' },
  regression: { en: 'regression testing', vi: 'kiểm thử hồi quy — kiểm phần không đổi vẫn chạy đúng sau thay đổi' },
  confirmation: { en: 'confirmation testing (re-testing)', vi: 'kiểm thử xác nhận — chạy lại ca đã fail sau khi sửa' },
  stub: { en: 'stub', vi: 'thành phần giả được GỌI tới (thay phần bên dưới)' },
  driver: { en: 'driver', vi: 'thành phần giả GỌI vào đối tượng test (thay phần bên trên)' },
  mock: { en: 'mock', vi: 'đối tượng giả ghi lại lời gọi để kiểm tương tác' },
  offByOne: { en: 'off-by-one error', vi: 'lỗi lệch một (dùng < thay vì <=, chạy thừa/thiếu một vòng)' },
  shortCircuit: { en: 'short-circuit evaluation', vi: 'đánh giá ngắn mạch — && / || dừng sớm khi đã biết kết quả' },
  oracle: { en: 'test oracle', vi: 'nguồn để biết kết quả đúng (đặc tả, hệ thống cũ, chuyên gia)' },
};
export const tn = (...ten) => ten.map((t) => {
  if (!TN[t]) throw new Error(`thuật ngữ lạ ${t}`);
  return TN[t];
});

/** Loại lỗi dùng trong danh sách review (ISSUES[].type). */
export const LOAI_LOI = ['LOGIC', 'BOUNDARY', 'CALCULATION', 'VALIDATION', 'EXCEPTION', 'DATA_TYPE', 'COMPILE', 'TEST_DATA', 'CONVENTION', 'PERFORMANCE', 'SECURITY', 'RESOURCE'];
export const LOAI_LOI_HTML = {
  en: '<code>LOGIC</code> wrong condition/flow · <code>BOUNDARY</code> off-by-one, &gt; vs &gt;= · <code>CALCULATION</code> wrong formula/unit · <code>VALIDATION</code> missing input check · <code>EXCEPTION</code> crash risk (NPE, index, divide by 0) · <code>DATA_TYPE</code> wrong type, integer division, overflow, double for money · <code>COMPILE</code> does not compile · <code>TEST_DATA</code> demo/test data breaks the spec · <code>CONVENTION</code> magic number, naming, formatting · <code>PERFORMANCE</code> · <code>SECURITY</code> · <code>RESOURCE</code> unclosed stream/connection',
  vi: '<code>LOGIC</code> sai điều kiện/luồng · <code>BOUNDARY</code> lệch một, &gt; với &gt;= · <code>CALCULATION</code> sai công thức/đơn vị · <code>VALIDATION</code> thiếu kiểm đầu vào · <code>EXCEPTION</code> nguy cơ văng lỗi (NPE, chỉ số, chia 0) · <code>DATA_TYPE</code> sai kiểu, chia nguyên, tràn số, double cho tiền · <code>COMPILE</code> không biên dịch được · <code>TEST_DATA</code> dữ liệu demo/test trái đặc tả · <code>CONVENTION</code> số ma thuật, đặt tên, định dạng · <code>PERFORMANCE</code> hiệu năng · <code>SECURITY</code> bảo mật · <code>RESOURCE</code> không đóng stream/kết nối',
};

/** Nộp bài chung cho đề lớn. */
export const NOP_BAI = {
  en: 'Write your answers in the answer files on the right (they mirror the official template: one JavaScript object per test case / issue). Press <b>Run</b> for the visible checks and <b>Submit</b> for full grading, hidden checks included. Your score per question appears in the rubric table.',
  vi: 'Viết câu trả lời vào các tệp bên phải (giống template chính thức: mỗi test case / lỗi là một object JavaScript). Bấm <b>Chạy thử</b> để chạy kiểm hiện, <b>Nộp</b> để chấm đủ (kể cả kiểm ẩn). Điểm từng câu hiện trong bảng thang điểm.',
};
