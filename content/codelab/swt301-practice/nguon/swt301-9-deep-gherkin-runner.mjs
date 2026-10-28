/**
 * SWT301 · DEEP LAB CHƯƠNG 9 — Tự viết lõi một công cụ BDD (kiểu Cucumber): đọc Gherkin (Feature, Background, Scenario,
 * Scenario Outline + Examples, Given/When/Then/And/But), khớp bước với định nghĩa có {int}/{string}, chạy với world riêng.
 */
import { doiDau, KHOA, NOP_BAI, preMa } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

const GIAI = `// Deep Lab 9 — the core of a BDD tool (what Cucumber does inside).
function createRunner() {
  const defs = [];

  function compile(pattern) {
    const types = [];
    let src = '';
    for (const part of pattern.split(/(\\{int\\}|\\{string\\})/)) {
      if (part === '{int}') { src += '(-?\\\\d+)'; types.push('int'); }
      else if (part === '{string}') { src += '"([^"]*)"'; types.push('string'); }
      else src += part.replace(/[.*+?^$()|[\\]\\\\{}]/g, '\\\\$&');
    }
    return { re: new RegExp('^' + src + '$'), types };
  }

  function step(pattern, fn) {
    defs.push({ ...compile(pattern), fn });
    return api;
  }

  function parse(text) {
    const lines = String(text).split('\\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const background = [];
    const scenarios = [];
    let cur = null;
    let inBackground = false;
    for (const line of lines) {
      if (/^Feature:/.test(line)) continue;
      if (/^Background:/.test(line)) { inBackground = true; cur = null; continue; }
      let m = /^Scenario Outline:\\s*(.*)$/.exec(line);
      if (m) { inBackground = false; cur = { name: m[1], steps: [], outline: true, rows: [] }; scenarios.push(cur); continue; }
      m = /^Scenario:\\s*(.*)$/.exec(line);
      if (m) { inBackground = false; cur = { name: m[1], steps: [], outline: false }; scenarios.push(cur); continue; }
      if (/^Examples:/.test(line)) continue;
      if (line.startsWith('|')) {
        if (cur && cur.outline) cur.rows.push(line.slice(1, -1).split('|').map((c) => c.trim()));
        continue;
      }
      m = /^(Given|When|Then|And|But)\\s+(.*)$/.exec(line);
      if (m) { (inBackground ? background : cur ? cur.steps : background).push(m[2]); }
    }
    const out = [];
    for (const s of scenarios) {
      if (!s.outline) { out.push({ name: s.name, steps: s.steps }); continue; }
      const [head, ...rows] = s.rows;
      rows.forEach((row, k) => {
        const fill = (t) => t.replace(/<([^>]+)>/g, (all, key) => { const i = head.indexOf(key); return i < 0 ? all : row[i]; });
        out.push({ name: s.name + ' (example ' + (k + 1) + ')', steps: s.steps.map(fill) });
      });
    }
    return { background, scenarios: out };
  }

  function run(text) {
    const { background, scenarios } = parse(text);
    const results = scenarios.map((sc) => {
      const world = {};
      for (const t of background.concat(sc.steps)) {
        let hit = null, args = null;
        for (const d of defs) {
          const m = d.re.exec(t);
          if (m) { hit = d; args = m.slice(1).map((v, i) => (d.types[i] === 'int' ? Number(v) : v)); break; }
        }
        if (!hit) return { name: sc.name, status: 'undefined', failedStep: t, error: null };
        try { hit.fn(world, ...args); } catch (e) { return { name: sc.name, status: 'failed', failedStep: t, error: String(e && e.message) }; }
      }
      return { name: sc.name, status: 'passed', failedStep: null, error: null };
    });
    const n = (s) => results.filter((r) => r.status === s).length;
    return { scenarios: results, passed: n('passed'), failed: n('failed'), undefined: n('undefined') };
  }

  const api = { step, run };
  return api;
}
`;

const DAU = `// Deep Lab 9 — implement createRunner() as described on the left.
function createRunner() {
  const defs = [];
  const api = {
    step(pattern, fn) { defs.push({ pattern, fn }); return api; },
    run(text) {
      return { scenarios: [], passed: 0, failed: 0, undefined: 0 };
    },
  };
  return api;
}
`;

/* Bộ định nghĩa bước dùng chung trong kiểm: một giỏ đặt chỗ nhỏ. */
const PRE = `const r = createRunner();
r.step('a lab with {int} seats', (w, n) => { w.seats = n; w.booked = 0; w.mail = []; });
r.step('{string} books a seat', (w, who) => { if (w.booked < w.seats) { w.booked++; w.last = 'CONFIRMED'; } else { w.last = 'PENDING'; } w.mail.push(who); });
r.step('the booking is {string}', (w, s) => { if (w.last !== s) throw new Error('expected ' + s + ' but was ' + w.last); });
r.step('{int} seats are taken', (w, n) => { if (w.booked !== n) throw new Error('expected ' + n + ' taken, got ' + w.booked); });
r.step('the total (in VND) is {int}', (w, n) => { w.total = n; });
r.step('the fee is {int}', (w, n) => { const fee = w.total >= 500000 ? 0 : 30000; if (fee !== n) throw new Error('fee ' + fee); });
r.step('{int} e-mails are sent', (w, n) => { if (w.mail.length !== n) throw new Error('mails ' + w.mail.length); });
const st = (x) => x.scenarios.map((s) => s.status[0]).join('');`;
const k = (en, vi, body, nhom, an) => kiemTuy({ en, vi }, new Function(`${PRE}\n${body}`), { nhom, ...(an ? { an: true } : {}) });
const F = (s) => JSON.stringify(s);

const KIEM = [
  k('f1 — two scenarios with Given/When/Then/And', 'f1 — hai kịch bản với Given/When/Then/And', `const x = r.run(${F(`Feature: Booking
  Scenario: free seat
    Given a lab with 1 seats
    When "An" books a seat
    Then the booking is "CONFIRMED"
    And 1 seats are taken
  Scenario: full lab
    Given a lab with 1 seats
    When "An" books a seat
    And "Binh" books a seat
    Then the booking is "PENDING"`)}); return st(x) === 'pp' && x.passed === 2 && x.scenarios[1].name === 'full lab' ? 'OK' : 'got ' + JSON.stringify(x);`, 'f1'),
  k('f1 — comments and blank lines are ignored; But is a step keyword', 'f1 — bỏ qua chú thích và dòng trống; But là từ khoá bước', `const x = r.run(${F(`# booking rules
Feature: x

  Scenario: s
    Given a lab with 2 seats
    # a comment
    When "An" books a seat
    But "Binh" books a seat
    Then 2 seats are taken`)}); return st(x) === 'p' ? 'OK' : 'got ' + JSON.stringify(x);`, 'f1'),
  k('f2 — {int} becomes a number and {string} a string without quotes', 'f2 — {int} thành số, {string} thành chuỗi không có nháy', `let seen = null; const q = createRunner(); q.step('{string} has {int} hours', (w, who, n) => { seen = [who, n, typeof n]; }); q.run('Scenario: s\\n Given "Chi An" has -3 hours'); return JSON.stringify(seen) === '["Chi An",-3,"number"]' ? 'OK' : 'got ' + JSON.stringify(seen);`, 'f2'),
  k('f2 — special characters in the pattern are matched literally', 'f2 — ký tự đặc biệt trong mẫu được khớp đúng chữ', `const x = r.run('Scenario: s\\n Given the total (in VND) is 499999\\n Then the fee is 30000'); return st(x) === 'p' ? 'OK' : 'got ' + JSON.stringify(x) + ' — escape ( ) in the pattern';`, 'f2'),
  k('f2 — the whole step must match, not a part of it', 'f2 — phải khớp cả bước, không chỉ một phần', `const x = r.run('Scenario: s\\n Given a lab with 2 seats today'); return st(x) === 'u' ? 'OK' : 'a step with extra words must be undefined, got ' + st(x);`, 'f2', true),
  k('f3 — Scenario Outline with Examples expands to one scenario per row', 'f3 — Scenario Outline với Examples sinh một kịch bản mỗi dòng', `const x = r.run(${F(`Feature: US-17 free shipping
  Scenario Outline: shipping fee
    Given the total (in VND) is <total>
    Then the fee is <fee>
    Examples:
      | total  | fee   |
      | 499999 | 30000 |
      | 500000 | 0     |
      | 500000 | 30000 |`)}); return st(x) === 'ppf' && x.scenarios.map((s) => s.name).join('|') === 'shipping fee (example 1)|shipping fee (example 2)|shipping fee (example 3)' ? 'OK' : 'got ' + JSON.stringify(x);`, 'f3'),
  k('f3 — Background steps run before every scenario', 'f3 — các bước Background chạy trước mọi kịch bản', `const x = r.run(${F(`Feature: f
  Background:
    Given a lab with 1 seats
  Scenario: one
    When "An" books a seat
    Then the booking is "CONFIRMED"
  Scenario: two
    When "Binh" books a seat
    Then the booking is "CONFIRMED"`)}); return st(x) === 'pp' ? 'OK' : 'got ' + JSON.stringify(x) + ' — each scenario must start from the Background on a fresh world';`, 'f3'),
  k('f3 — several Examples columns and placeholders inside quotes', 'f3 — nhiều cột Examples và tham số trong dấu nháy', `const x = r.run(${F(`Scenario Outline: o
  Given a lab with <n> seats
  When "<who>" books a seat
  Then the booking is "<status>"
  Examples:
    | n | who | status    |
    | 1 | An  | CONFIRMED |
    | 0 | Chi | PENDING   |`)}); return st(x) === 'pp' ? 'OK' : 'got ' + JSON.stringify(x);`, 'f3', true),
  k('f4 — a failing step fails the scenario and skips the rest', 'f4 — bước trượt làm kịch bản trượt và bỏ phần còn lại', `let after = false; r.step('nothing else runs', () => { after = true; }); const x = r.run('Scenario: s\\n Given a lab with 1 seats\\n Then 3 seats are taken\\n And nothing else runs'); return st(x) === 'f' && x.scenarios[0].failedStep === '3 seats are taken' && x.scenarios[0].error === 'expected 3 taken, got 0' && !after ? 'OK' : 'got ' + JSON.stringify(x) + ', later step ran: ' + after;`, 'f4'),
  k('f4 — a step without definition makes the scenario undefined', 'f4 — bước chưa có định nghĩa làm kịch bản undefined', `const x = r.run('Scenario: s\\n Given a lab with 1 seats\\n When the manager closes the lab'); return st(x) === 'u' && x.undefined === 1 && x.scenarios[0].failedStep === 'the manager closes the lab' ? 'OK' : 'got ' + JSON.stringify(x);`, 'f4'),
  k('f4 — every scenario gets a fresh world', 'f4 — mỗi kịch bản có world mới', `const x = r.run('Scenario: a\\n Given a lab with 1 seats\\n When "An" books a seat\\nScenario: b\\n Given a lab with 1 seats\\n Then 0 seats are taken'); return st(x) === 'pp' ? 'OK' : 'got ' + st(x);`, 'f4', true),
  k('f4 — the first matching definition wins; step() is chainable', 'f4 — định nghĩa khớp đầu tiên thắng; step() nối chuỗi được', `const q = createRunner(); let who = ''; q.step('a step', () => { who = 'first'; }).step('a step', () => { who = 'second'; }); const x = q.run('Scenario: s\\n Given a step'); return who === 'first' && st(x) === 'p' ? 'OK' : 'got ' + who;`, 'f4', true),
];

const BAN_IN = {
  tieuDe: 'Deep Lab 9 — Build the Core of a BDD Tool',
  phu: { en: 'Chapter 9 deep lab · Gherkin parsing, Cucumber-style step matching, Scenario Outline, Background · 10 marks', vi: 'Deep Lab chương 9 · đọc Gherkin, khớp bước kiểu Cucumber, Scenario Outline, Background · 10 điểm' },
  moTa: {
    en: `<p>BDD tools (Cucumber, SpecFlow, JBehave) turn Given/When/Then text into executable tests. Build the core: <code>createRunner()</code> returns <code>{ step(pattern, fn), run(featureText) }</code>.</p>
${preMa(`r.step('a lab with {int} seats', (world, n) => { … })      // {int} → number, {string} → "text" without quotes
r.run(\`Feature: Booking
  Background:
    Given a lab with 1 seats
  Scenario Outline: book
    When "<who>" books a seat
    Then the booking is "<status>"
    Examples:
      | who | status    |
      | An  | CONFIRMED |\`)
→ { scenarios: [ { name: 'book (example 1)', status: 'passed' | 'failed' | 'undefined', failedStep, error } ], passed, failed, undefined }`)}
<ul>
<li><b>Parsing</b>: trim lines; ignore blank lines and <code>#</code> comments and the <code>Feature:</code> line. <code>Background:</code> steps run before every scenario. <code>Scenario:</code> starts a scenario; <code>Scenario Outline:</code> + <code>Examples:</code> table (first row = header) expands into one scenario per data row named <code>name (example k)</code>, with every <code>&lt;column&gt;</code> replaced. Step lines start with Given, When, Then, And or But followed by a space; the keyword is dropped.</li>
<li><b>Matching</b>: a pattern matches the <b>whole</b> step text; <code>{int}</code> matches an optionally negative integer (passed as a number), <code>{string}</code> a double-quoted text (passed without quotes); every other character is literal. The first definition registered that matches wins. <code>step()</code> returns the runner (chainable).</li>
<li><b>Running</b>: each scenario gets a fresh <code>world = {}</code>. No matching definition → <code>undefined</code> (failedStep = that text, error null) and stop; an exception → <code>failed</code> with its message, stop.</li></ul>`,
    vi: `<p>Công cụ BDD (Cucumber, SpecFlow, JBehave) biến chữ Given/When/Then thành test chạy được. Dựng lõi: <code>createRunner()</code> trả <code>{ step(pattern, fn), run(featureText) }</code> với luật đọc Gherkin (Background, Scenario, Scenario Outline + Examples, Given/When/Then/And/But, bỏ chú thích), luật khớp (khớp cả bước, {int} thành số, {string} thành chuỗi không nháy, ký tự khác khớp đúng chữ, định nghĩa đăng ký trước thắng) và luật chạy (world mới mỗi kịch bản; thiếu định nghĩa ⇒ undefined; ngoại lệ ⇒ failed; dừng ở bước hỏng).</p>`,
  },
  chucNangChinh: [
    { en: 'f1 Parse features, scenarios and steps.', vi: 'f1 Đọc feature, kịch bản và bước.' },
    { en: 'f2 Cucumber expressions {int} and {string}.', vi: 'f2 Biểu thức Cucumber {int} và {string}.' },
    { en: 'f3 Scenario Outline + Examples, Background.', vi: 'f3 Scenario Outline + Examples, Background.' },
    { en: 'f4 Statuses: passed, failed, undefined; isolation.', vi: 'f4 Trạng thái: passed, failed, undefined; cô lập.' },
  ],
  yeuCauChung: [{ en: 'No external library. Patterns may contain characters that are special in regular expressions, such as ( ) . +', vi: 'Không dùng thư viện ngoài. Mẫu có thể chứa ký tự đặc biệt của regex như ( ) . +' }],
  cayThuMuc: `src/
└── gherkin-runner.js   ← function createRunner()`,
  moHinh: {
    ten: 'Gherkin keywords supported',
    truong: [
      ['Feature: · Background:', 'header', { en: 'name ignored · steps before every scenario', vi: 'bỏ tên · bước trước mọi kịch bản' }],
      ['Scenario: · Scenario Outline: · Examples:', 'blocks', { en: 'one scenario · one per Examples row', vi: 'một kịch bản · mỗi dòng Examples một kịch bản' }],
      ['Given · When · Then · And · But', 'step', { en: 'the keyword is not part of the matched text', vi: 'từ khoá không thuộc phần chữ được khớp' }],
    ],
  },
  chucNang: [
    { ten: { en: 'f1 Parsing', vi: 'f1 Đọc' }, diem: 2, yeuCau: [{ en: 'Two checks.', vi: 'Hai kiểm.' }], hook: ['BDD'] },
    { ten: { en: 'f2 Step matching', vi: 'f2 Khớp bước' }, diem: 3, yeuCau: [{ en: 'Three checks.', vi: 'Ba kiểm.' }], hook: ['Cucumber expressions'] },
    { ten: { en: 'f3 Outline and Background', vi: 'f3 Outline và Background' }, diem: 3, yeuCau: [{ en: 'Three checks.', vi: 'Ba kiểm.' }], hook: ['Scenario Outline'] },
    { ten: { en: 'f4 Results', vi: 'f4 Kết quả' }, diem: 2, yeuCau: [{ en: 'Four checks.', vi: 'Bốn kiểm.' }], hook: ['test execution'] },
  ],
  idBatBuoc: [['createRunner()', 'src/gherkin-runner.js']],
  truDiem: [
    { en: 'Building the regex without escaping — “the total (in VND) is {int}” then never matches.', vi: 'Dựng regex không escape — “the total (in VND) is {int}” sẽ không bao giờ khớp.' },
    { en: 'Sharing one world between scenarios — a scenario passes only because of the previous one.', vi: 'Dùng chung world giữa các kịch bản — kịch bản đạt chỉ nhờ kịch bản trước.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-9-deep-gherkin-runner',
  ten: 'Deep Lab 9 — Build the Core of a BDD Tool',
  moTaModule: 'Deep Lab chương 9: tự viết createRunner() kiểu Cucumber — đọc Gherkin (Background, Scenario, Scenario Outline + Examples, And/But, chú thích), khớp bước với {int}/{string} và ký tự đặc biệt, world mới mỗi kịch bản, trạng thái passed/failed/undefined.',
  khoa: KHOA,
  baiHoc: 'swt301-tdd-bdd',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 9 — Build the Core of a BDD Tool',
    doKho: 'HARD', phut: 120, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: "r.step('a lab with {int} seats', …); r.run('Scenario: s\\n Given a lab with 2 seats')", output: "{ scenarios: [{ name: 's', status: 'passed', failedStep: null, error: null }], passed: 1, failed: 0, undefined: 0 }", explanation: '{int} matched 2 and was passed as a number.|||{int} khớp 2 và được truyền dạng số.' }],
    khaiNiem: ['BDD', 'Gherkin', 'ATDD', 'test automation'],
    tienQuyet: ['SWT301 lesson 9.6', 'JavaScript regular expressions'],
    the: ['swt301', 'deep-lab', 'bdd'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'step definition', vi: 'định nghĩa bước — mã chạy cho một dòng Gherkin' }, { en: 'world', vi: 'ngữ cảnh dùng chung giữa các bước của một kịch bản' }, { en: 'Cucumber expression', vi: 'biểu thức khớp {int}, {string}' }],
    goiY: [
      'Tách mẫu theo /({int}|{string})/; escape phần chữ; ghép regex có ^ và $.',
      'Đọc theo dòng; giữ kịch bản hiện tại; dòng bắt đầu bằng | là dữ liệu Examples.',
      'Outline: thay <cột> bằng giá trị của dòng; tên “name (example k)”.',
      'Chạy: Background + các bước; dừng ở bước đầu tiên undefined hay failed.',
    ],
    loiHayGap: ['Quên escape dấu ngoặc của mẫu.', 'Khớp một phần chuỗi (thiếu ^ và $).', 'Không chạy lại Background cho mỗi kịch bản.'],
    moTaNgan: 'Deep Lab chương 9: lõi công cụ BDD.',
    giaiThich: {
      en: '<p>A BDD tool is a parser plus a matcher: Gherkin becomes a list of scenarios (outlines expanded), each step text is matched against compiled step definitions, and each scenario runs on its own world. That is why business people can read and review the tests while developers own the step code.</p>',
      vi: '<p>Công cụ BDD là một bộ đọc cộng một bộ khớp: Gherkin thành danh sách kịch bản (outline được mở rộng), mỗi bước được khớp với định nghĩa đã biên dịch, mỗi kịch bản chạy trên world riêng. Nhờ vậy người nghiệp vụ đọc và review được test, còn developer giữ mã của bước.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['src/gherkin-runner.js'], kiem: KIEM },
    khoiDau: { 'src/gherkin-runner.js': DAU },
    loiGiai: { 'src/gherkin-runner.js': GIAI },
    boYeu: [
      { ten: 'không escape mẫu', tep: { 'src/gherkin-runner.js': GIAI.replace("else src += part.replace(/[.*+?^$()|[\\]\\\\{}]/g, '\\\\$&');", 'else src += part;') }, phaiTruot: ['f2 — special characters'] },
      { ten: 'không chạy Background', tep: { 'src/gherkin-runner.js': GIAI.replace('for (const t of background.concat(sc.steps))', 'for (const t of sc.steps)') }, phaiTruot: ['f3 — Background steps'] },
    ],
  }],
});
