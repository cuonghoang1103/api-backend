/**
 * FER202 · Nâng cao A2 — Kiểm thử React: tự viết expect mini (JS), chọn truy vấn Testing Library, trắc nghiệm.
 */
import { doiDau, KHOA, jsNho, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });
const v = (...ds) => ds;

export default doiDau({
  slug: 'fer202-a2-1-testing',
  ten: '14.2 Testing React apps (advanced)',
  khoa: KHOA,
  baiHoc: 'fer202-a2-1-testing',
  de: [
    jsNho({
      tieuDe: 'Build a tiny expect() like Jest/Vitest',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['assertion', 'toBe vs toEqual', 'deep equality', 'test runner'], the: ['testing', 'javascript'],
      moTa: {
        en: '<p>Test runners are less magic than they look. Implement <code>expect(actual)</code> returning matchers <code>toBe(expected)</code> (uses <code>Object.is</code>), <code>toEqual(expected)</code> (deep equality for plain objects/arrays) and <code>toContain(item)</code> (arrays and strings). A failing matcher throws <code>Error("Expected 3 to be 4")</code> with <code>JSON.stringify</code> of both values. Then write <code>runTests(tests)</code> that runs <code>[{ name, fn }]</code> and returns <code>{ passed, failed: [names] }</code>.</p>',
        vi: '<p>Bộ chạy test không thần bí như vẻ ngoài. Cài <code>expect(actual)</code> trả matcher <code>toBe(expected)</code> (dùng <code>Object.is</code>), <code>toEqual(expected)</code> (so sâu object/mảng thường) và <code>toContain(item)</code> (mảng và chuỗi). Matcher sai thì ném <code>Error("Expected 3 to be 4")</code> với <code>JSON.stringify</code> hai giá trị. Rồi viết <code>runTests(tests)</code> chạy <code>[{ name, fn }]</code> và trả <code>{ passed, failed: [tên] }</code>.</p>',
      },
      yeuCau: [
        { en: 'Messages: <code>Expected X to be Y</code>, <code>Expected X to equal Y</code>, <code>Expected X to contain Y</code> (JSON of values).', vi: 'Thông điệp: <code>Expected X to be Y</code>, <code>Expected X to equal Y</code>, <code>Expected X to contain Y</code> (JSON của giá trị).' },
        { en: '<code>runTests</code> catches each test\'s error so one failure does not stop the others.', vi: '<code>runTests</code> bắt lỗi từng test để một test hỏng không chặn các test khác.' },
      ],
      viDu: [{ input: 'expect({ a: [1, 2] }).toEqual({ a: [1, 2] })', output: 'passes (no throw)', explanation: 'toBe would fail: two different objects.|||toBe sẽ trượt: hai object khác nhau.' }],
      goiY: ['function deepEqual(a, b) { if (Object.is(a, b)) return true; if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false; if (Array.isArray(a) !== Array.isArray(b)) return false; const ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k])); }', 'runTests: for (const t of tests) { try { t.fn(); passed++; } catch { failed.push(t.name); } }'],
      loiHayGap: ['Dùng <code>===</code> cho toBe ⇒ NaN không bằng NaN; Object.is xử lý đúng.', 'So JSON.stringify cho toEqual ⇒ sai khi thứ tự khoá khác nhau.'],
      thuatNgu: [{ en: 'assertion', vi: 'khẳng định: điều kiện phải đúng, sai thì test trượt' }, { en: 'matcher', vi: 'hàm so sánh như toBe/toEqual' }],
      giaiThich: '<p>Mỗi test là một hàm; test trượt = hàm ném lỗi. toBe so danh tính, toEqual so cấu trúc — đúng như Jest/Vitest mà Testing Library dùng.</p>',
      dau: `// main.js — STARTER
function expect(actual) {
  return {
    toBe: (expected) => actual === expected,
    toEqual: (expected) => JSON.stringify(actual) === JSON.stringify(expected),
  };
}

function runTests(tests) {
  tests.forEach((t) => t.fn());
  return { passed: tests.length, failed: [] };
}
`,
      giai: `// main.js — expect mini: matcher ném lỗi khi sai; runTests bắt lỗi từng test
const show = (v) => JSON.stringify(v);

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}

function expect(actual) {
  const fail = (verb, expected) => {
    throw new Error(´Expected @{show(actual)} @{verb} @{show(expected)}´);
  };
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) fail('to be', expected);
    },
    toEqual(expected) {
      if (!deepEqual(actual, expected)) fail('to equal', expected);
    },
    toContain(item) {
      const ok = Array.isArray(actual) ? actual.some((x) => Object.is(x, item)) : String(actual).includes(item);
      if (!ok) fail('to contain', item);
    },
  };
}

function runTests(tests) {
  let passed = 0;
  const failed = [];
  for (const t of tests) {
    try {
      t.fn();
      passed += 1;
    } catch {
      failed.push(t.name);
    }
  }
  return { passed, failed };
}
`,
      kiem: [
        { moTa: 'toBe passes silently', goi: 'expect(3).toBe(3)', mongDoi: { $js: 'undefined' } },
        { moTa: 'toBe failure message', goi: 'expect(3).toBe(4)', mongDoi: { loi: 'Error', thongDiep: '^Expected 3 to be 4$' } },
        { moTa: 'toEqual compares deeply', goi: '(() => { expect({ a: [1, { b: 2 }] }).toEqual({ a: [1, { b: 2 }] }); return "ok"; })()', mongDoi: 'ok' },
        { moTa: 'toEqual failure', goi: 'expect([1, 2]).toEqual([1, 3])', mongDoi: { loi: 'Error', thongDiep: '^Expected \\[1,2\\] to equal \\[1,3\\]$' } },
        { moTa: 'runTests summary', goi: 'runTests([{ name: "a", fn: () => expect(1).toBe(1) }, { name: "b", fn: () => expect("hi").toContain("x") }, { name: "c", fn: () => expect([1]).toContain(1) }])', mongDoi: { passed: 2, failed: ['b'] } },
        { an: true, moTa: 'toBe uses Object.is (NaN)', goi: '(() => { expect(NaN).toBe(NaN); return "ok"; })()', mongDoi: 'ok' },
        { an: true, moTa: 'toBe distinguishes objects', goi: 'expect({}).toBe({})', mongDoi: { loi: 'Error', thongDiep: '^Expected \\{\\} to be \\{\\}$' } },
        { an: true, moTa: 'Key order does not matter for toEqual', goi: '(() => { expect({ a: 1, b: 2 }).toEqual({ b: 2, a: 1 }); return "ok"; })()', mongDoi: 'ok' },
        { an: true, moTa: 'Array vs object are different', goi: 'expect([]).toEqual({})', mongDoi: { loi: 'Error' } },
      ],
    }),
    tinh({
      loai: 'table',
      tieuDe: 'Choose the Testing Library query',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['getByRole', 'getByLabelText', 'queryBy', 'findBy'], the: ['testing', 'table'],
      moTa: {
        en: '<p>React Testing Library recommends querying the page the way users find things. For each need write the best query: <code>getByRole</code>, <code>getByLabelText</code>, <code>getByText</code>, <code>queryByText</code> or <code>findByText</code>.</p>',
        vi: '<p>React Testing Library khuyên truy vấn trang theo cách người dùng tìm thứ họ cần. Với mỗi nhu cầu ghi truy vấn tốt nhất: <code>getByRole</code>, <code>getByLabelText</code>, <code>getByText</code>, <code>queryByText</code> hoặc <code>findByText</code>.</p>',
      },
      bang: [{
        ma: 'r', de: 'Best query',
        cot: [{ ma: 'need', ten: 'Need' }, { ma: 'query', ten: 'Query' }],
        hang: [
          { ma: 'btn', o: { need: 'Click the "Save" button' } },
          { ma: 'input', o: { need: 'Type into the input labelled "Email"' } },
          { ma: 'absent', o: { need: 'Assert that "Error" is NOT on the page' } },
          { ma: 'async', o: { need: 'Wait for "Loaded 3 users" that appears after a fetch' } },
          { ma: 'para', o: { need: 'Read a paragraph that says "Welcome back"' } },
        ],
        dapAn: { 'btn.query': 'getByRole', 'input.query': 'getByLabelText', 'absent.query': 'queryByText', 'async.query': 'findByText', 'para.query': 'getByText' },
        giaiThich: 'getBy* throws when missing, queryBy* returns null (for "not present"), findBy* waits (returns a Promise).|||getBy* ném lỗi khi thiếu, queryBy* trả null (để kiểm "không có"), findBy* chờ (trả Promise).',
      }],
      goiY: ['Thứ tự ưu tiên: role → label → text → test id.', 'Kiểm "không có" ⇒ queryBy…; đợi xuất hiện ⇒ findBy…'],
      loiHayGap: ['Dùng getByText để kiểm phần tử KHÔNG có ⇒ test ném lỗi trước cả khi expect.', 'Lạm dụng data-testid trong khi role/label có sẵn.'],
      giaiThich: '<p>Truy vấn theo role/label vừa kiểm chức năng vừa kiểm khả năng tiếp cận.</p>',
      thuatNgu: [{ en: 'accessible role', vi: 'vai trò trợ năng (button, textbox, heading…)' }],
    }),
    tinh({
      tieuDe: 'Testing React: concepts',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['unit vs integration', 'user-event', 'mocking APIs'], the: ['testing', 'quiz'],
      moTa: {
        en: '<p>Five questions on testing React apps with Vitest/Jest and React Testing Library: what to test, how to simulate users and how to deal with network requests.</p>',
        vi: '<p>Năm câu về kiểm thử app React với Vitest/Jest và React Testing Library: test cái gì, mô phỏng người dùng thế nào và xử lý request mạng ra sao.</p>',
      },
      goiY: ['Test hành vi người dùng thấy, không test chi tiết cài đặt.', 'Giả lập mạng (MSW) thay vì gọi server thật.'],
      loiHayGap: ['Kiểm state nội bộ của component.', 'Test phụ thuộc server thật ⇒ chập chờn.'],
      giaiThich: '<p>"The more your tests resemble the way your software is used, the more confidence they can give you."</p>',
      thuatNgu: [{ en: 'implementation detail', vi: 'chi tiết bên trong, người dùng không thấy' }],
      cauHoi: [
        q('t1', 'What should a component test check?', [['a', 'The internal state variable names'], ['b', 'What the user sees and can do (text, buttons, results after interaction)'], ['c', 'The number of hooks used'], ['d', 'CSS file size']], ['b'], 'Refactoring internals should not break good tests.|||Tái cấu trúc bên trong không nên làm hỏng test tốt.'),
        q('t2', 'Simulate typing and clicking like a real user:', [['a', '@testing-library/user-event'], ['b', 'setState directly'], ['c', 'document.write'], ['d', 'alert']], ['a'], 'await user.type(input, "Lan"); await user.click(button);|||await user.type(input, "Lan"); await user.click(button);'),
        q('t3', 'A component fetches users on mount. In tests you should…', [['a', 'call the real production API'], ['b', 'mock the network (e.g. MSW) and assert the rendered result with findBy…'], ['c', 'skip testing it'], ['d', 'use setTimeout(5000)']], ['b'], 'Deterministic data, no flaky network.|||Dữ liệu cố định, không lệ thuộc mạng.'),
        q('t4', 'Unit test vs integration test in a React app:', [['a', 'Same thing'], ['b', 'Unit tests a function or small component alone; integration tests several pieces working together (e.g. form + API + list)'], ['c', 'Integration tests only run in production'], ['d', 'Unit tests need a browser']], ['b'], 'The testing trophy favours integration tests for UIs.|||"Testing trophy" ưu tiên test tích hợp cho giao diện.'),
        q('t5', 'Which are good test-friendly habits? (choose all)', [['a', 'Pure functions for business logic (reducers, validators)'], ['b', 'Accessible labels on inputs'], ['c', 'Random ids in rendered text'], ['d', 'Small components with clear props']], [['a', 'b', 'd']], 'Random output makes assertions unstable.|||Kết quả ngẫu nhiên làm khẳng định không ổn định.', true),
      ],
    }),
  ],
});
