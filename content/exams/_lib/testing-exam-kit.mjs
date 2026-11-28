/**
 * Bộ khuôn dùng chung cho các đề thi khoá Testing (/courses/testing): PT1–PT3, FE, PE.
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: dạng ống "EN|||VI" (prompt, option —
 * client tự tách bằng pickLang), hoặc dạng HTML hai khối `.ml-en` / `.ml-vi` (giải thích,
 * hướng dẫn). ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||` — mã JS trong đề có `||` thì
 * luôn bọc `code()`/`c()` và KHÔNG BAO GIỜ gõ ba dấu `|` liền nhau.
 *
 * Câu lập trình của khoá này KHÔNG bắt viết code nghiệp vụ — nó bắt VIẾT TEST, đúng tinh thần
 * cả khoá (Code Lab `testing-practice` chấm bằng đột biến). Mỗi câu cho sẵn:
 *   • một bộ chạy test thu gọn kiểu Vitest (`HARNESS`: test / test.each / expect … / spy), chạy
 *     được bằng `node` trần (CommonJS, không cài gì) — để `scripts/exam-check.mjs` chạy THẬT;
 *   • code thật lấy từ LabFlow Lite (`content/courses/testing/_labflow-lite/src`), chép sang
 *     CommonJS, và một hàm `build(mutant)` cài từng đột biến M1…Mn vào đúng một dòng;
 *   • phần cuối chấm: bộ test phải XANH với code thật (và mỗi test phải có ít nhất một
 *     khẳng định — như `requireAssertions: true` của khoá), rồi phải ĐỎ với từng đột biến.
 * Kết quả mong đợi = "real code: all green" + mọi đột biến "killed" — không phụ thuộc bạn viết
 * bao nhiêu test, nên lời giải mẫu chỉ là MỘT cách đạt.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline — cũng tự thoát (`a => b`, `x || y`…). */
export const c = (src) => `<code>${esc(src)}</code>`;

/** Một câu trắc nghiệm. `correct` là số hoặc mảng số (câu chọn nhiều đáp án). */
export const mcq = ({ prompt, options, correct, explanation, points = 1 }) => ({
  kind: 'MCQ',
  points,
  prompt,
  options: options.map((text) => ({ text })),
  correctIndexes: Array.isArray(correct) ? correct : [correct],
  explanation,
});

/** Rubric chung cho câu "viết bộ test" (PT làm tại chỗ). */
export const RUBRIC_TESTS = [
  {
    id: 'killed',
    criterion: B(
      'The suite is green on the real code and red on every planted mutant: the printed result matches the expected output line for line.',
      'Bộ test xanh với code thật và đỏ với mọi đột biến cài sẵn: kết quả in ra khớp từng dòng với kết quả mong đợi.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'assertions',
    criterion: B(
      'Every test asserts an exact expected value chosen from the requirement (boundaries on both sides, the error code or class, the stored state) — no <code>toBeTruthy</code> on objects, no expected value read back from the code or the spy itself.',
      'Mỗi test khẳng định một giá trị mong đợi CỤ THỂ lấy từ yêu cầu (hai phía của biên, mã lỗi hoặc lớp lỗi, trạng thái đã lưu) — không dùng <code>toBeTruthy</code> cho object, không lấy giá trị mong đợi từ chính code hay chính spy.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'readable',
    criterion: B(
      'Readable tests: one behaviour per test, names that say the rule and the case, tables (<code>test.each</code>) for many inputs; the given scaffold is untouched.',
      'Test dễ đọc: mỗi test một hành vi, tên nói rõ luật và ca, dùng bảng (<code>test.each</code>) khi nhiều đầu vào; giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Một câu lập trình làm ngay trong phòng thi. */
export const codeQ = ({ points, prompt, language = 'javascript', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_TESTS }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
});

/**
 * Bộ chạy test thu gọn kiểu Vitest — nằm trong phần "ĐỀ CHO SẴN" của mọi câu lập trình.
 * Hỗ trợ: test(name, fn) · test.each(rows)(name, fn) · expect(x).toBe/toEqual/toMatchObject/
 * toBeCloseTo/toHaveLength/toBeNull/toThrow · .not · await expect(p).rejects.toThrow/
 * toMatchObject · await expect(p).resolves.toBe/toEqual/toMatchObject · spy(impl) +
 * toHaveBeenCalledTimes/toHaveBeenCalledWith. Một test không gọi expect nào ⇒ ĐỎ ("no assertions").
 */
export const HARNESS = [
  '// Bộ chạy test thu gọn kiểu Vitest (chạy bằng node, không cài gì).',
  'function spy(impl = () => undefined) {',
  '  const f = (...args) => { f.calls.push(args); return f.impl(...args); };',
  '  f.calls = []; f.impl = impl; f.isSpy = true;',
  '  return f;',
  '}',
  'function makeExpect(counter) {',
  '  const show = (v) => { try { return JSON.stringify(v); } catch (e) { return String(v); } };',
  '  const eq = (a, b) => {',
  '    if (Object.is(a, b)) return true;',
  '    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();',
  "    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;",
  '    if (Array.isArray(a) !== Array.isArray(b)) return false;',
  '    const ka = Object.keys(a), kb = Object.keys(b);',
  '    return ka.length === kb.length && ka.every((k) => k in b && eq(a[k], b[k]));',
  '  };',
  '  const sub = (a, b) => {',
  "    if (!b || typeof b !== 'object' || b instanceof Date) return eq(a, b);",
  "    if (!a || typeof a !== 'object') return false;",
  '    return Object.keys(b).every((k) => sub(a[k], b[k]));',
  '  };',
  '  const errMatches = (err, want) => want === undefined ? true',
  "    : typeof want === 'string' ? String(err && err.message).includes(want)",
  '    : want instanceof RegExp ? want.test(String(err && err.message))',
  "    : typeof want === 'function' ? err instanceof want",
  '    : sub(err, want);',
  '  const settle = async (p) => { try { return { ok: true, v: await p }; } catch (e) { return { ok: false, e }; } };',
  '  function matchers(actual, neg) {',
  '    const check = (ok, msg) => { counter.n++; if (ok === neg) throw new Error((neg ? "not: " : "") + msg); };',
  '    return {',
  "      toBe: (v) => check(Object.is(actual, v), 'expected ' + show(actual) + ' to be ' + show(v)),",
  "      toEqual: (v) => check(eq(actual, v), 'expected ' + show(actual) + ' to equal ' + show(v)),",
  "      toMatchObject: (v) => check(sub(actual, v), 'expected ' + show(actual) + ' to match ' + show(v)),",
  "      toBeCloseTo: (v, d = 2) => check(Math.abs(actual - v) < Math.pow(10, -d) / 2, 'expected ' + actual + ' to be close to ' + v),",
  "      toHaveLength: (n) => check(actual != null && actual.length === n, 'expected length ' + n),",
  "      toBeNull: () => check(actual === null, 'expected ' + show(actual) + ' to be null'),",
  "      toHaveBeenCalledTimes: (n) => check(Boolean(actual && actual.isSpy) && actual.calls.length === n, 'expected spy to be called ' + n + ' time(s)'),",
  "      toHaveBeenCalledWith: (...args) => check(Boolean(actual && actual.isSpy) && actual.calls.some((c) => eq(c, args)), 'expected spy to be called with ' + show(args)),",
  '      toThrow: (want) => {',
  "        if (typeof actual !== 'function') { counter.n++; throw new Error('toThrow needs a function: expect(() => ...)'); }",
  '        let thrown = false, err;',
  '        try { actual(); } catch (e) { thrown = true; err = e; }',
  "        check(thrown && errMatches(err, want), 'expected function to throw ' + (want === undefined ? '' : String(want)));",
  '      },',
  '    };',
  '  }',
  '  return function expect(actual) {',
  '    const m = matchers(actual, false);',
  '    m.not = matchers(actual, true);',
  '    m.rejects = {',
  "      toThrow: async (want) => { const r = await settle(actual); counter.n++; if (r.ok || !errMatches(r.e, want)) throw new Error('expected promise to reject ' + (want === undefined ? '' : String(want))); },",
  "      toMatchObject: async (v) => { const r = await settle(actual); counter.n++; if (r.ok || !sub(r.e, v)) throw new Error('expected promise to reject with ' + show(v)); },",
  '    };',
  '    m.resolves = {',
  "      toBe: async (v) => { const r = await settle(actual); counter.n++; if (!r.ok || !Object.is(r.v, v)) throw new Error('expected promise to resolve to ' + show(v)); },",
  "      toEqual: async (v) => { const r = await settle(actual); counter.n++; if (!r.ok || !eq(r.v, v)) throw new Error('expected promise to resolve to ' + show(v)); },",
  "      toMatchObject: async (v) => { const r = await settle(actual); counter.n++; if (!r.ok || !sub(r.v, v)) throw new Error('expected promise to resolve to ' + show(v)); },",
  '    };',
  '    return m;',
  '  };',
  '}',
  'async function runSuite(suite, impl) {',
  '  const tests = [];',
  '  const test = (name, fn) => { tests.push({ name, fn }); };',
  '  test.each = (rows) => (name, fn) => rows.forEach((row, i) => {',
  '    const args = Array.isArray(row) ? row : [row];',
  "    tests.push({ name: name + ' #' + (i + 1), fn: () => fn(...args) });",
  '  });',
  '  const counter = { n: 0 };',
  '  suite(test, makeExpect(counter), impl);',
  '  const failed = [];',
  '  for (const t of tests) {',
  '    counter.n = 0;',
  '    try {',
  '      await t.fn();',
  "      if (counter.n === 0) throw new Error('no assertions (requireAssertions)');",
  "    } catch (e) { failed.push(t.name + ' — ' + (e && e.message)); }",
  '  }',
  '  return { total: tests.length, failed };',
  '}',
  'async function grade(suite, buildImpl, mutants) {',
  '  const real = await runSuite(suite, buildImpl(null));',
  "  if (real.total === 0) { console.log('real code: no tests'); return; }",
  '  if (real.failed.length) {',
  "    console.log('real code: ' + real.failed.length + ' failing test(s) — fix the tests first');",
  "    real.failed.forEach((f) => console.log('  x ' + f));",
  '    return;',
  '  }',
  "  console.log('real code: all green');",
  '  let killed = 0;',
  '  for (const m of mutants) {',
  '    const r = await runSuite(suite, buildImpl(m));',
  '    if (r.failed.length) killed++;',
  "    console.log(m + ': ' + (r.failed.length ? 'killed' : 'SURVIVED'));",
  '  }',
  "  console.log('mutants killed: ' + killed + '/' + mutants.length);",
  '}',
].join('\n');

export const MARK_GIVEN = '// ── ĐỀ CHO SẴN — KHÔNG SỬA ──────────────────────────────────────────';
export const MARK_SOLVE = '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY (chỉ viết test) ──────────────────────';

/**
 * Ghép starterCode: [đề cho sẵn: harness + code + build(mutant)] → [vùng viết: khung suite]
 * → [đề cho sẵn: lời gọi grade]. `mutants` là mảng tên 'M1'…; `params` là chuỗi phá cấu trúc
 * của tham số thứ ba của suite, vd '{ checkSlot }'.
 */
export function starter({ given, params, mutants }) {
  return [
    MARK_GIVEN,
    HARNESS,
    '',
    given.trim(),
    '',
    MARK_SOLVE,
    `function suite(test, expect, ${params}) {`,
    '  // Viết test của bạn ở đây — ví dụ:',
    "  // test('mô tả luật và ca', () => { expect(...).toEqual(...); });",
    '}',
    '',
    MARK_GIVEN,
    `grade(suite, build, ${JSON.stringify(mutants)});`,
    '',
  ].join('\n');
}

/** Kết quả mong đợi khi mọi đột biến bị diệt. */
export const allKilled = (mutants) =>
  ['real code: all green', ...mutants.map((m) => `${m}: killed`), `mutants killed: ${mutants.length}/${mutants.length}`].join('\n');

/** Hướng dẫn đầu đề cho một bài Progress Test. */
export const ptInstructions = (n, chaptersEn, chaptersVi) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers ${chaptersEn} of the Testing course (LabFlow Lite). It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Most are scenarios: a test, a log line or a CI result, and the question is what it really proves.</li>' +
  '<li><b>Writing tests</b> — you are given real LabFlow Lite code, a tiny Vitest-like runner and a few planted bugs (mutants). Write a suite that is green on the real code and red on every mutant. It is graded on the printed result and on the quality of your assertions.</li>' +
  '</ul>' +
  '<p>Read every snippet as a reviewer would: "is this test able to fail?" is the question behind half of this exam. You can flag a question and come back. The timer auto-submits when it ends; afterwards every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ ${chaptersVi} của khoá Testing (dự án LabFlow Lite). Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Phần lớn là tình huống: một test, một dòng log hay một kết quả CI, và câu hỏi là nó THẬT SỰ chứng minh điều gì.</li>' +
  '<li><b>Viết test</b> — đề cho sẵn code thật của LabFlow Lite, một bộ chạy test thu gọn kiểu Vitest và vài lỗi cài sẵn (đột biến). Viết một bộ test xanh với code thật và đỏ với mọi đột biến. Chấm theo kết quả in ra và theo chất lượng các khẳng định.</li>' +
  '</ul>' +
  '<p>Đọc mỗi đoạn mã như một người review: "test này có thể đỏ được không?" là câu hỏi đứng sau một nửa đề. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp; nộp xong mỗi câu đều có giải thích song ngữ.</p>' +
  '</div>';
