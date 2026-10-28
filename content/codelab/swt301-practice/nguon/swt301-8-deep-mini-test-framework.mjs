/**
 * SWT301 · DEEP LAB CHƯƠNG 8 — Tự viết một unit test framework mini (kiểu JUnit/Jest): describe lồng nhau, test, beforeEach/afterEach
 * đúng thứ tự, expect với toBe/toEqual/toThrow/.not, runner cô lập lỗi. Hiểu công cụ (D) quan trọng nhất từ bên trong.
 */
import { doiDau, KHOA, NOP_BAI, preMa } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

const GIAI = `// Deep Lab 8 — a mini unit-test framework (what JUnit / Jest do inside).
function createFramework() {
  const root = { name: null, parent: null, tests: [], children: [], before: [], after: [] };
  let current = root;

  function describe(name, fn) {
    const suite = { name, parent: current, tests: [], children: [], before: [], after: [] };
    current.children.push(suite);
    current.tests.push({ suite });           // keep declaration order between tests and suites
    const saved = current;
    current = suite;
    try { fn(); } finally { current = saved; }
  }
  function test(name, fn) { current.tests.push({ name, fn }); }
  function beforeEach(fn) { current.before.push(fn); }
  function afterEach(fn) { current.after.push(fn); }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return Number.isNaN(a) && Number.isNaN(b);
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
  }
  const show = (v) => { try { return JSON.stringify(v); } catch (e) { return String(v); } };

  function matchers(actual, negate) {
    const check = (ok, msg) => { if (negate ? ok : !ok) throw new Error((negate ? 'not: ' : '') + msg); };
    return {
      toBe(expected) { check(Object.is(actual, expected), 'expected ' + show(expected) + ' but got ' + show(actual)); },
      toEqual(expected) { check(deepEqual(actual, expected), 'expected ' + show(expected) + ' to equal ' + show(actual)); },
      toThrow(expected) {
        if (typeof actual !== 'function') throw new Error('toThrow needs a function');
        let thrown = null;
        try { actual(); } catch (e) { thrown = e; }
        let ok = thrown !== null;
        if (ok && typeof expected === 'string') ok = String(thrown && thrown.message).includes(expected);
        else if (ok && typeof expected === 'function') ok = thrown instanceof expected;
        check(ok, 'expected the function to throw' + (expected ? ' ' + (expected.name || show(expected)) : ''));
      },
    };
  }
  function expect(actual) {
    const m = matchers(actual, false);
    m.not = matchers(actual, true);
    return m;
  }

  function chain(suite) { const out = []; for (let s = suite; s; s = s.parent) out.unshift(s); return out; }

  function run() {
    const results = [];
    function walk(suite) {
      for (const item of suite.tests) {
        if (item.suite) { walk(item.suite); continue; }
        const suites = chain(suite);
        const name = suites.map((s) => s.name).filter((n) => n !== null).concat(item.name).join(' > ');
        let error = null;
        try {
          for (const s of suites) for (const h of s.before) h();
          item.fn();
        } catch (e) { error = e; }
        for (const s of suites.slice().reverse()) for (const h of s.after) {
          try { h(); } catch (e) { if (!error) error = e; }
        }
        results.push({ name, status: error ? 'failed' : 'passed', error: error ? String(error && error.message) : null });
      }
    }
    walk(root);
    return { passed: results.filter((r) => r.status === 'passed').length, failed: results.filter((r) => r.status === 'failed').length, results };
  }

  return { describe, test, beforeEach, afterEach, expect, run };
}
`;

const DAU = `// Deep Lab 8 — implement createFramework() as described on the left.
function createFramework() {
  const tests = [];
  return {
    describe(name, fn) { fn(); },
    test(name, fn) { tests.push({ name, fn }); },
    beforeEach(fn) {},
    afterEach(fn) {},
    expect(actual) {
      return { toBe(e) { if (actual !== e) throw new Error('not equal'); }, toEqual() {}, toThrow() {}, not: { toBe() {}, toEqual() {}, toThrow() {} } };
    },
    run() {
      const results = tests.map((t) => { try { t.fn(); return { name: t.name, status: 'passed', error: null }; } catch (e) { return { name: t.name, status: 'failed', error: e.message }; } });
      return { passed: results.filter((r) => r.status === 'passed').length, failed: results.filter((r) => r.status === 'failed').length, results };
    },
  };
}
`;

const k = (en, vi, body, nhom, an) => kiemTuy({ en, vi }, new Function(`const fw = createFramework(); const { describe, test, beforeEach, afterEach, expect } = fw; const st = (r) => r.results.map((x) => x.status[0]).join('');\n${body}`), { nhom, ...(an ? { an: true } : {}) });
const KIEM = [
  /* f1 — expect */
  k('f1 — toBe passes and fails correctly', 'f1 — toBe đạt và trượt đúng', "test('a', () => expect(1 + 1).toBe(2)); test('b', () => expect('6').toBe(6)); const r = fw.run(); return st(r) === 'pf' ? 'OK' : 'expected passed, failed — got ' + JSON.stringify(r.results);", 'f1'),
  k('f1 — toEqual compares deeply (key order does not matter, arrays do)', 'f1 — toEqual so sâu (thứ tự khoá không quan trọng, mảng thì có)', "test('a', () => expect({ a: 1, b: [1, { c: 2 }] }).toEqual({ b: [1, { c: 2 }], a: 1 })); test('b', () => expect([1, 2]).toEqual([2, 1])); test('c', () => expect({ a: 1 }).toEqual({ a: 1, b: 2 })); const r = fw.run(); return st(r) === 'pff' ? 'OK' : 'got ' + st(r);", 'f1'),
  k('f1 — toThrow with no argument, a message part and an error class', 'f1 — toThrow không đối số, một phần message và một lớp lỗi', "const boom = () => { throw new RangeError('INVALID_HOURS'); }; test('a', () => expect(boom).toThrow()); test('b', () => expect(boom).toThrow('HOURS')); test('c', () => expect(boom).toThrow(RangeError)); test('d', () => expect(boom).toThrow(TypeError)); test('e', () => expect(() => 1).toThrow()); test('f', () => expect(boom).toThrow('DAYS')); const r = fw.run(); return st(r) === 'pppfff' ? 'OK' : 'got ' + st(r);", 'f1'),
  k('f1 — .not inverts every matcher', 'f1 — .not đảo mọi matcher', "test('a', () => expect(1).not.toBe(2)); test('b', () => expect([1]).not.toEqual([1])); test('c', () => expect(() => 1).not.toThrow()); test('d', () => expect(() => { throw new Error('x'); }).not.toThrow()); const r = fw.run(); return st(r) === 'pfpf' ? 'OK' : 'got ' + st(r);", 'f1'),
  k('f1 — toBe uses identity (two equal objects are not the same)', 'f1 — toBe so đồng nhất (hai object bằng nhau không phải là một)', "const o = { a: 1 }; test('a', () => expect(o).toBe(o)); test('b', () => expect({ a: 1 }).toBe({ a: 1 })); test('c', () => expect(NaN).toBe(NaN)); const r = fw.run(); return st(r) === 'pfp' ? 'OK' : 'got ' + st(r) + ' (NaN is NaN with Object.is)';", 'f1', true),
  /* f2 — đăng ký, chạy, tên */
  k('f2 — run reports counts and results in declaration order', 'f2 — run báo số lượng và kết quả theo thứ tự khai báo', "test('one', () => {}); test('two', () => { throw new Error('bad'); }); test('three', () => {}); const r = fw.run(); return r.passed === 2 && r.failed === 1 && r.results.map((x) => x.name).join(',') === 'one,two,three' && r.results[1].error === 'bad' && r.results[0].error === null ? 'OK' : 'got ' + JSON.stringify(r);", 'f2'),
  k('f2 — nested describe names are joined with " > "', 'f2 — tên describe lồng nhau nối bằng " > "', "describe('Booking', () => { test('a', () => {}); describe('cancel', () => { test('b', () => {}); }); test('c', () => {}); }); test('d', () => {}); const r = fw.run(); return r.results.map((x) => x.name).join('|') === 'Booking > a|Booking > cancel > b|Booking > c|d' ? 'OK' : 'got ' + r.results.map((x) => x.name).join('|');", 'f2'),
  k('f2 — a failing test does not stop the others', 'f2 — một test trượt không dừng các test khác', "test('a', () => expect(1).toBe(2)); test('b', () => { null.x; }); test('c', () => expect(3).toBe(3)); const r = fw.run(); return st(r) === 'ffp' ? 'OK' : 'got ' + st(r);", 'f2', true),
  /* f3 — hooks */
  k('f3 — beforeEach runs before every test of its describe, outer first', 'f3 — beforeEach chạy trước mọi test của describe, ngoài trước', "const log = []; beforeEach(() => log.push('root')); describe('S', () => { beforeEach(() => log.push('S')); test('t1', () => log.push('t1')); describe('N', () => { beforeEach(() => log.push('N')); test('t2', () => log.push('t2')); }); }); test('t3', () => log.push('t3')); fw.run(); return log.join(',') === 'root,S,t1,root,S,N,t2,root,t3' ? 'OK' : 'got ' + log.join(',');", 'f3'),
  k('f3 — afterEach runs after every test, inner first, even when the test failed', 'f3 — afterEach chạy sau mọi test, trong trước, kể cả khi test trượt', "const log = []; afterEach(() => log.push('A-root')); describe('S', () => { afterEach(() => log.push('A-S')); test('t1', () => { log.push('t1'); throw new Error('x'); }); }); const r = fw.run(); return log.join(',') === 't1,A-S,A-root' && st(r) === 'f' ? 'OK' : 'got ' + log.join(',');", 'f3'),
  k('f3 — a fresh fixture per test thanks to beforeEach', 'f3 — mỗi test có fixture mới nhờ beforeEach', "let list; beforeEach(() => { list = []; }); test('a', () => { list.push(1); expect(list.length).toBe(1); }); test('b', () => { list.push(2); expect(list).toEqual([2]); }); const r = fw.run(); return st(r) === 'pp' ? 'OK' : 'got ' + st(r);", 'f3'),
  k('f3 — a failing beforeEach fails the test without running its body', 'f3 — beforeEach lỗi làm test trượt và không chạy thân test', "let ran = false; describe('S', () => { beforeEach(() => { throw new Error('setup broke'); }); test('t', () => { ran = true; }); }); const r = fw.run(); return st(r) === 'f' && !ran && r.results[0].error === 'setup broke' ? 'OK' : 'got ' + JSON.stringify(r) + ', body ran: ' + ran;", 'f3', true),
  k('f3 — hooks of a sibling describe do not apply', 'f3 — hook của describe anh em không áp dụng', "const log = []; describe('A', () => { beforeEach(() => log.push('A')); test('a', () => {}); }); describe('B', () => { test('b', () => log.push('b')); }); fw.run(); return log.join(',') === 'A,b' ? 'OK' : 'got ' + log.join(',');", 'f3', true),
  /* f4 — robustness */
  k('f4 — an error thrown by afterEach fails a passing test', 'f4 — lỗi trong afterEach làm test đang đạt thành trượt', "afterEach(() => { throw new Error('cleanup failed'); }); test('t', () => {}); const r = fw.run(); return st(r) === 'f' && r.results[0].error === 'cleanup failed' ? 'OK' : 'got ' + JSON.stringify(r);", 'f4'),
  k('f4 — two frameworks do not share tests', 'f4 — hai framework không dùng chung test', "const other = createFramework(); other.test('x', () => {}); test('y', () => {}); const r = fw.run(); return r.results.length === 1 && r.results[0].name === 'y' ? 'OK' : 'got ' + JSON.stringify(r);", 'f4', true),
  k('f4 — run can be called twice with the same result', 'f4 — gọi run hai lần cho cùng kết quả', "let n = 0; beforeEach(() => { n = 0; }); test('t', () => { n++; expect(n).toBe(1); }); const a = st(fw.run()); const b = st(fw.run()); return a === 'p' && b === 'p' ? 'OK' : 'got ' + a + ' then ' + b;", 'f4', true),
];

const BAN_IN = {
  tieuDe: 'Deep Lab 8 — Build Your Own Unit Test Framework',
  phu: { en: 'Chapter 8 deep lab · a (D) tool from the inside: suites, hooks, matchers, isolated failures · 10 marks', vi: 'Deep Lab chương 8 · một công cụ (D) nhìn từ bên trong: suite, hook, matcher, cô lập lỗi · 10 điểm' },
  moTa: {
    en: `<p>Unit test frameworks (JUnit, NUnit, Jest) are the most used developer test tools — group 4 of the classification. Build a small one, to understand exactly what <code>@BeforeEach</code>, <code>assertEquals</code> and <code>assertThrows</code> do.</p>
${preMa(`const fw = createFramework();
fw.describe(name, fn)        // suites can be nested; fn registers tests and hooks
fw.test(name, fn)            // fn is synchronous
fw.beforeEach(fn) / fw.afterEach(fn)
fw.expect(actual).toBe(v) | .toEqual(v) | .toThrow(expected?) ; fw.expect(actual).not.<matcher>
fw.run()  →  { passed, failed, results: [ { name: 'Suite > Inner > test', status: 'passed' | 'failed', error } ] }`)}
<ul>
<li><b>toBe</b> uses <code>Object.is</code>; <b>toEqual</b> compares deeply (arrays in order, objects with any key order, arrays ≠ objects); <b>toThrow</b> receives a function and passes if it throws — with a string argument the message must contain it, with a class the error must be an instance of it. <b>.not</b> inverts. A failing matcher throws an <code>Error</code>.</li>
<li><b>run</b> executes tests in declaration order (tests and nested suites interleaved as written). For each test: every <code>beforeEach</code> from the outermost suite inwards, then the test, then every <code>afterEach</code> from the innermost outwards — afterEach hooks run even if the test (or a beforeEach) failed. If a beforeEach throws, the test body is not run. Any exception fails the test; <code>error</code> is the message of the first exception (null when passed).</li>
<li>Hooks apply to the tests of their suite and its nested suites only. Tests never stop the run; frameworks never share state; <code>run()</code> can be called again.</li></ul>`,
    vi: `<p>Unit test framework (JUnit, NUnit, Jest) là công cụ test được developer dùng nhiều nhất — nhóm 4 của cách phân loại. Tự dựng một cái nhỏ để hiểu chính xác <code>@BeforeEach</code>, <code>assertEquals</code>, <code>assertThrows</code> làm gì. API và luật như bản tiếng Anh: toBe dùng Object.is, toEqual so sâu, toThrow nhận hàm (chuỗi = một phần message, lớp = instanceof), .not đảo; run chạy theo thứ tự khai báo, beforeEach từ ngoài vào, afterEach từ trong ra và vẫn chạy khi test trượt, beforeEach lỗi thì không chạy thân test; hook chỉ áp cho suite của nó và suite con; một test trượt không dừng cả bộ.</p>`,
  },
  chucNangChinh: [
    { en: 'f1 Matchers: toBe, toEqual, toThrow, .not.', vi: 'f1 Matcher: toBe, toEqual, toThrow, .not.' },
    { en: 'f2 Registration, nested names, results.', vi: 'f2 Đăng ký, tên lồng nhau, kết quả.' },
    { en: 'f3 beforeEach / afterEach order and scope.', vi: 'f3 Thứ tự và phạm vi beforeEach / afterEach.' },
    { en: 'f4 Robustness: failing hooks, isolation, re-run.', vi: 'f4 Bền vững: hook lỗi, cô lập, chạy lại.' },
  ],
  yeuCauChung: [{ en: 'No async support is required. Do not use the global test/expect of the grader — everything must come from your createFramework().', vi: 'Không cần hỗ trợ bất đồng bộ. Không dùng test/expect toàn cục của máy chấm — mọi thứ phải đến từ createFramework() của bạn.' }],
  cayThuMuc: `src/
└── mini-framework.js   ← function createFramework()`,
  moHinh: {
    ten: 'JUnit 5 ↔ your framework',
    truong: [
      ['@Nested class', 'describe(name, fn)', { en: 'a suite inside a suite', vi: 'suite trong suite' }],
      ['@BeforeEach / @AfterEach', 'beforeEach / afterEach', { en: 'outer first / inner first', vi: 'ngoài trước / trong trước' }],
      ['assertEquals / assertSame / assertThrows', 'toEqual / toBe / toThrow', { en: 'deep equality / identity / exception', vi: 'bằng nhau sâu / đồng nhất / ngoại lệ' }],
    ],
  },
  chucNang: [
    { ten: { en: 'f1 Matchers', vi: 'f1 Matcher' }, diem: 3, yeuCau: [{ en: 'Five checks.', vi: 'Năm kiểm.' }], hook: ['unit test framework'] },
    { ten: { en: 'f2 Runner', vi: 'f2 Runner' }, diem: 2, yeuCau: [{ en: 'Three checks.', vi: 'Ba kiểm.' }], hook: ['test execution'] },
    { ten: { en: 'f3 Hooks', vi: 'f3 Hook' }, diem: 3, yeuCau: [{ en: 'Five checks.', vi: 'Năm kiểm.' }], hook: ['fixtures'] },
    { ten: { en: 'f4 Robustness', vi: 'f4 Bền vững' }, diem: 2, yeuCau: [{ en: 'Three checks.', vi: 'Ba kiểm.' }], hook: ['test isolation'] },
  ],
  idBatBuoc: [['createFramework()', 'src/mini-framework.js']],
  truDiem: [
    { en: 'Skipping afterEach when a test fails — resources leak into the next test.', vi: 'Bỏ afterEach khi test trượt — tài nguyên rò sang test sau.' },
    { en: 'Module-level arrays of tests — two frameworks (or two runs) then share state.', vi: 'Mảng test ở cấp module — hai framework (hay hai lần chạy) dùng chung trạng thái.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-8-deep-mini-test-framework',
  ten: 'Deep Lab 8 — Build Your Own Unit Test Framework',
  moTaModule: 'Deep Lab chương 8: tự viết createFramework() — describe lồng nhau, test, beforeEach/afterEach đúng thứ tự và phạm vi, expect toBe/toEqual/toThrow/.not, runner cô lập lỗi, chạy lại được; đối chiếu JUnit 5.',
  khoa: KHOA,
  baiHoc: 'swt301-junit-hands-on',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 8 — Build Your Own Unit Test Framework',
    doKho: 'HARD', phut: 120, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: "describe('Booking', () => { beforeEach(...); test('cancel', ...) }); fw.run()", output: "{ passed: 1, failed: 0, results: [{ name: 'Booking > cancel', status: 'passed', error: null }] }", explanation: 'Nested names, hooks and results like a real framework.|||Tên lồng nhau, hook và kết quả như framework thật.' }],
    khaiNiem: ['unit test framework', 'test fixtures', 'assertions'],
    tienQuyet: ['SWT301 lesson 8.5', 'JavaScript closures'],
    the: ['swt301', 'deep-lab', 'test-framework'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'matcher / assertion', vi: 'hàm khẳng định' }, { en: 'hook', vi: 'hàm móc chạy trước/sau test' }, { en: 'suite', vi: 'nhóm test' }, { en: 'Object.is', vi: 'so đồng nhất (NaN bằng NaN)' }],
    goiY: [
      'Lưu cây suite: mỗi suite có tests (theo thứ tự, gồm cả suite con), before, after, parent.',
      'run: đi cây; với mỗi test lấy chuỗi suite từ gốc tới nó: before từ ngoài vào, after từ trong ra.',
      'Bọc thân test trong try/catch; afterEach mỗi cái một try/catch riêng.',
      'expect(x).not = matchers(x, true): cùng hàm kiểm, đảo điều kiện.',
    ],
    loiHayGap: ['Chạy afterEach theo thứ tự ngoài trước.', 'Áp hook của suite anh em.', 'toEqual so bằng JSON.stringify nên phụ thuộc thứ tự khoá.'],
    moTaNgan: 'Deep Lab chương 8: tự viết unit test framework.',
    giaiThich: {
      en: '<p>A framework is a tree of suites plus a runner: hooks are collected along the path from the root to the test, before-hooks outside-in, after-hooks inside-out and always executed; matchers throw on failure; the runner catches every exception so one test never stops the others. JUnit 5 and Jest do exactly this (plus async, reporting and parallelism).</p>',
      vi: '<p>Framework là một cây suite cộng một runner: hook gom theo đường từ gốc tới test, before từ ngoài vào, after từ trong ra và luôn chạy; matcher ném lỗi khi trượt; runner bắt mọi ngoại lệ để một test không dừng các test khác. JUnit 5 và Jest làm đúng như vậy (cộng bất đồng bộ, báo cáo và chạy song song).</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['src/mini-framework.js'], kiem: KIEM },
    khoiDau: { 'src/mini-framework.js': DAU },
    loiGiai: { 'src/mini-framework.js': GIAI },
    boYeu: [
      { ten: 'afterEach ngoài trước', tep: { 'src/mini-framework.js': GIAI.replace('for (const s of suites.slice().reverse()) for (const h of s.after)', 'for (const s of suites) for (const h of s.after)') }, phaiTruot: ['f3 — afterEach runs after every test'] },
      { ten: 'toEqual bằng JSON.stringify', tep: { 'src/mini-framework.js': GIAI.replace('toEqual(expected) { check(deepEqual(actual, expected)', 'toEqual(expected) { check(JSON.stringify(actual) === JSON.stringify(expected)') }, phaiTruot: ['f1 — toEqual compares deeply'] },
    ],
  }],
});
