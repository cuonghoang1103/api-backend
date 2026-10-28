/**
 * SWT301 · 8.3 — Benefits & risks of test automation; capture/replay, data-driven, keyword-driven, model-based (SWT6 slide 36–47).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const LR = ['Potential benefit', 'Risk'];
const E1 = tinhDe({
  tieuDe: 'Automation 1 — Benefit or risk?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Slide 38 lists four potential benefits of tools; slides 39–40 list the risks. The word <i>potential</i> matters: benefits come only if the risks are managed. Classify each statement.</p>', vi: '<p>Slide 38 nêu bốn lợi ích tiềm năng; slide 39–40 nêu các rủi ro. Chữ <i>tiềm năng</i> là điểm chính: lợi ích chỉ đến khi quản lý được rủi ro. Phân loại từng phát biểu.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement → benefit or risk', 'Phát biểu → lợi ích hay rủi ro'),
    cot: [{ ma: 's', ten: 'Statement' }, { ma: 'k', ten: 'Kind', luaChon: LR }],
    hang: [
      'The 500 regression tests run every night without anyone typing the same data again',
      'Management expects the tool to halve the test effort in the first month',
      'Coverage is reported as a number produced by a tool, not someone’s impression',
      'The effort to maintain the UI scripts after every redesign was never estimated',
      'Tests are executed in the same order with the same data every time',
      'The vendor goes out of business and the tool is no longer supported',
      'Testers stop thinking and trust every green tick of the tool',
      'Progress, defect trends and performance are visible on a dashboard at any time',
      'The open-source project behind the tool is abandoned',
      'The tool is not compatible with the new version of the browser used in production',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': LR[0], 'r1.k': LR[1], 'r2.k': LR[0], 'r3.k': LR[1], 'r4.k': LR[0], 'r5.k': LR[1], 'r6.k': LR[1], 'r7.k': LR[0], 'r8.k': LR[1], 'r9.k': LR[1] },
    giaiThich: giai('Benefits: less repetitive work, consistency and repeatability, objective assessment, easy access to information. Risks: unrealistic expectations, underestimated effort (introduction, maintenance), over-reliance, vendor or open-source project ending, incompatibility with platforms, and more.', 'Lợi ích: bớt việc lặp, nhất quán và lặp lại được, đánh giá khách quan, dễ lấy thông tin. Rủi ro: kỳ vọng phi thực tế, đánh giá thấp công sức (đưa vào, bảo trì), phụ thuộc quá mức, nhà cung cấp hay dự án mã nguồn mở ngừng, không tương thích nền tảng…'),
  }],
  goiY: ['Bốn lợi ích: bớt lặp lại, nhất quán, khách quan, dễ lấy thông tin.', '“Kỳ vọng”, “chưa ước lượng”, “tin tuyệt đối”, “ngừng hỗ trợ” ⇒ rủi ro.'],
  loiHayGap: ['Coi kỳ vọng giảm một nửa công sức là lợi ích.', 'Quên rủi ro “phụ thuộc quá mức vào công cụ”.'],
  giaiThich: '<p>B · R · B · R · B · R · R · B · R · R.</p>',
  thuatNgu: [{ en: 'over-reliance', vi: 'phụ thuộc quá mức' }, { en: 'unrealistic expectations', vi: 'kỳ vọng phi thực tế' }],
  khaiNiem: ['benefits and risks of automation'],
});

const CACH = ['Capture/replay', 'Data-driven', 'Keyword-driven', 'Model-based'];
const E2 = tinhDe({
  tieuDe: 'Automation 2 — Which scripting approach?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Four approaches to test execution tools (slides 42–45). Name the approach in each LabBook situation.</p>', vi: '<p>Bốn cách dùng công cụ thực thi test (slide 42–45). Gọi tên cách làm trong từng tình huống LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Situation → approach', 'Tình huống → cách làm'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'a', ten: 'Approach', luaChon: CACH }],
    hang: [
      'A recorder saves every click of the tester into a linear script; it breaks when a button is renamed',
      'One login script reads 40 rows of e-mail, password and expected result from a spreadsheet',
      'Business testers write tests as rows “Login | student1”, “Book | LAB01 | 9 | 2”, “Check status | CONFIRMED”',
      'Testers draw the booking state diagram; the tool generates the test cases and expected results',
      'A new rule changes the steps of the booking scenario, not only its data; a non-programmer adds the new step without code',
      'The auditor wants an audit trail of the exploratory session the tester just did',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.a': CACH[0], 'r1.a': CACH[1], 'r2.a': CACH[2], 'r3.a': CACH[3], 'r4.a': CACH[2], 'r5.a': CACH[0] },
    giaiThich: giai('Recording = capture/replay (brittle, but an audit trail); same steps, many data rows = data-driven; action words + data = keyword-driven (non-programmers change steps); model → generated tests = model-based.', 'Ghi lại = capture/replay (dễ gãy, nhưng là vết kiểm toán); cùng bước, nhiều dòng dữ liệu = data-driven; từ khoá hành động + dữ liệu = keyword-driven (người không lập trình đổi được bước); mô hình → sinh test = model-based.'),
  }],
  goiY: ['Chỉ đổi dữ liệu ⇒ data-driven; đổi cả bước mà không viết code ⇒ keyword-driven.', 'Ghi lại thao tác ⇒ capture/replay.'],
  loiHayGap: ['Gán dòng 5 cho data-driven — data-driven chỉ đổi dữ liệu, không đổi bước.', 'Cho rằng capture/replay vô dụng — nó cho vết kiểm toán của phiên khám phá.'],
  giaiThich: '<p>Capture/replay · Data-driven · Keyword-driven · Model-based · Keyword-driven · Capture/replay.</p>',
  thuatNgu: [{ en: 'capture/replay', vi: 'ghi lại và phát lại' }, { en: 'data-driven', vi: 'hướng dữ liệu' }, { en: 'keyword-driven', vi: 'hướng từ khoá (action word)' }],
  khaiNiem: ['test execution tools'],
});

const E3 = jsDe({
  tieuDe: 'Automation 3 — Write a data-driven test runner',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>In data-driven testing one generic script reads many rows of inputs and expected results. Write <code>runDataDriven(fn, table)</code>: <code>table</code> is <code>[{ id, args: [...], expected }]</code>. For each row call <code>fn(...args)</code> and compare the result with <code>expected</code> using deep equality (compare <code>JSON.stringify</code> of both). If <code>expected</code> is the string <code>'THROWS'</code>, the row passes only if <code>fn</code> throws. An unexpected exception makes the row fail with actual <code>'THROWS: ' + message</code>.</p>
<p>Return <code>{ passed: [ids], failed: [{ id, expected, actual }] }</code> in table order.</p>`, vi: `<p>Kiểm thử hướng dữ liệu: một script chung đọc nhiều dòng đầu vào và kết quả mong đợi. Viết <code>runDataDriven(fn, table)</code> như bản tiếng Anh: so sánh sâu bằng <code>JSON.stringify</code>; <code>'THROWS'</code> nghĩa là phải ném lỗi; ngoại lệ ngoài dự kiến làm dòng trượt với actual <code>'THROWS: ' + message</code>. Trả <code>{ passed, failed }</code> theo thứ tự bảng.</p>` },
  yeuCau: [{ en: 'One row failing must not stop the others.', vi: 'Một dòng trượt không được dừng các dòng khác.' }],
  viDu: [{ input: "runDataDriven((h) => h * 60, [{ id: 'r1', args: [2], expected: 120 }, { id: 'r2', args: [3], expected: 200 }])", output: "{ passed: ['r1'], failed: [{ id: 'r2', expected: 200, actual: 180 }] }", explanation: 'The second row has a wrong expected result — the runner reports it.|||Dòng hai có kết quả mong đợi sai — runner báo nó.' }],
  goiY: ['try { actual = fn(...row.args) } catch (e) { … } cho từng dòng.', 'Dòng THROWS: đạt khi bắt được lỗi; nếu không ném thì trượt với actual là giá trị trả về.'],
  loiHayGap: ['So sánh object bằng === nên kết quả đúng vẫn trượt.', 'Để ngoại lệ của một dòng làm dừng cả bộ.'],
  giaiThich: '<p>This is the generic script of the data-driven approach: testers only add rows. JUnit 5 does the same with <code>@ParameterizedTest @CsvFileSource</code>.</p>',
  thuatNgu: [{ en: 'data table', vi: 'bảng dữ liệu test' }, { en: 'deep equality', vi: 'so sánh sâu' }],
  khaiNiem: ['data-driven testing'],
  tep: {
    'runner.js': [
      'function runDataDriven(fn, table) {\n  return { passed: [], failed: [] };\n}\n',
      `function runDataDriven(fn, table) {
  const passed = [];
  const failed = [];
  for (const row of table) {
    let actual;
    let threw = null;
    try { actual = fn(...row.args); } catch (e) { threw = e; }
    if (row.expected === 'THROWS') {
      if (threw) passed.push(row.id);
      else failed.push({ id: row.id, expected: 'THROWS', actual });
    } else if (threw) {
      failed.push({ id: row.id, expected: row.expected, actual: 'THROWS: ' + (threw && threw.message) });
    } else if (JSON.stringify(actual) === JSON.stringify(row.expected)) {
      passed.push(row.id);
    } else {
      failed.push({ id: row.id, expected: row.expected, actual });
    }
  }
  return { passed, failed };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = runDataDriven((h) => h * 60, [{ id: 'r1', args: [2], expected: 120 }, { id: 'r2', args: [3], expected: 200 }]); return JSON.stringify(r) === '{"passed":["r1"],"failed":[{"id":"r2","expected":200,"actual":180}]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'deep equality for objects', vi: 'so sánh sâu cho object' }, () => { const r = runDataDriven((a, b) => ({ sum: a + b, list: [a, b] }), [{ id: 'x', args: [1, 2], expected: { sum: 3, list: [1, 2] } }]); return JSON.stringify(r.passed) === '["x"]' ? 'OK' : 'equal objects must pass — got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'expected THROWS', vi: 'mong đợi THROWS' }, () => { const f = (h) => { if (h > 3) throw new Error('INVALID_HOURS'); return h; }; const r = runDataDriven(f, [{ id: 'a', args: [4], expected: 'THROWS' }, { id: 'b', args: [2], expected: 'THROWS' }]); return JSON.stringify(r) === '{"passed":["a"],"failed":[{"id":"b","expected":"THROWS","actual":2}]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'an unexpected exception fails the row, the run continues', vi: 'ngoại lệ ngoài dự kiến làm dòng trượt, vẫn chạy tiếp' }, () => { const f = (x) => { if (x === 0) throw new Error('boom'); return 10 / x; }; const r = runDataDriven(f, [{ id: 'z', args: [0], expected: 0 }, { id: 'y', args: [5], expected: 2 }]); return JSON.stringify(r) === '{"passed":["y"],"failed":[{"id":"z","expected":0,"actual":"THROWS: boom"}]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'empty table', vi: 'bảng rỗng' }, () => (JSON.stringify(runDataDriven(() => 1, [])) === '{"passed":[],"failed":[]}' ? 'OK' : 'expected empty lists'), { an: true }),
  ],
});

const E4 = jsDe({
  tieuDe: 'Automation 4 — Write a keyword-driven interpreter',
  doKho: 'HARD', phut: 20,
  moTa: { en: `<p>In keyword-driven testing, engineers implement <b>keywords</b> (action words) once; testers write tests as tables. Write <code>runKeywordTest(test, library)</code> and <code>runSuite(tests, library)</code>.</p>
<ul><li><code>test</code> = <code>{ id, rows: [[keyword, ...args], …] }</code>; <code>library</code> = <code>{ Keyword: (ctx, ...args) => … }</code>. Each test gets a fresh context object <code>ctx = {}</code> shared by its rows.</li>
<li>Rows run in order. A keyword that throws an error whose <code>name</code> is <code>'AssertionError'</code> makes the test <code>'FAIL'</code>; an unknown keyword gives <code>'ERROR'</code> with message <code>'UNKNOWN_KEYWORD ' + name</code>; any other exception gives <code>'ERROR'</code> with its message. The test stops at the first failing row.</li>
<li><code>runKeywordTest</code> returns <code>{ id, status: 'PASS' | 'FAIL' | 'ERROR', step, message }</code> — <code>step</code> is the 0-based index of the failing row (null on PASS), <code>message</code> null on PASS.</li>
<li><code>runSuite</code> returns <code>{ passed, failed, errors, results }</code> (counts + the list of results in order).</li></ul>`, vi: `<p>Kiểm thử hướng từ khoá: kỹ sư cài <b>từ khoá</b> (action word) một lần; tester viết test dạng bảng. Viết <code>runKeywordTest(test, library)</code> và <code>runSuite(tests, library)</code> như bản tiếng Anh: mỗi test có ngữ cảnh <code>ctx = {}</code> riêng; lỗi có name <code>AssertionError</code> ⇒ FAIL; từ khoá lạ ⇒ ERROR <code>UNKNOWN_KEYWORD …</code>; lỗi khác ⇒ ERROR; dừng ở dòng hỏng đầu tiên.</p>` },
  yeuCau: [{ en: 'Contexts must not leak between tests.', vi: 'Ngữ cảnh không được rò giữa các test.' }],
  viDu: [{ input: "runKeywordTest({ id: 'K1', rows: [['Book', 2], ['Book', 3], ['CheckHours', 5]] }, LIB)", output: "{ id: 'K1', status: 'PASS', step: null, message: null }", explanation: 'LIB.Book adds hours to ctx; LIB.CheckHours asserts the total.|||LIB.Book cộng giờ vào ctx; LIB.CheckHours kiểm tổng.' }],
  goiY: ['for (let i = 0; i < rows.length; i++) { const [k, ...args] = rows[i]; … library[k](ctx, ...args) }', 'Phân biệt FAIL (AssertionError) với ERROR (lỗi khác, từ khoá lạ).'],
  loiHayGap: ['Dùng chung một ctx cho mọi test.', 'Chạy tiếp sau dòng hỏng.'],
  giaiThich: '<p>The interpreter is the part engineers build once; afterwards testers write new tests — including new step sequences — without code. That is the main strength of keyword-driven testing; the keyword library is the upfront and maintenance cost.</p>',
  thuatNgu: [{ en: 'keyword library', vi: 'thư viện từ khoá' }, { en: 'interpreter', vi: 'bộ thông dịch' }],
  khaiNiem: ['keyword-driven testing'],
  tep: {
    'keywords.js': [
      "function runKeywordTest(test, library) {\n  return { id: test.id, status: 'PASS', step: null, message: null };\n}\n\nfunction runSuite(tests, library) {\n  return { passed: 0, failed: 0, errors: 0, results: [] };\n}\n",
      `function runKeywordTest(test, library) {
  const ctx = {};
  for (let i = 0; i < test.rows.length; i++) {
    const [name, ...args] = test.rows[i];
    const kw = Object.prototype.hasOwnProperty.call(library, name) ? library[name] : null;
    if (typeof kw !== 'function') return { id: test.id, status: 'ERROR', step: i, message: 'UNKNOWN_KEYWORD ' + name };
    try {
      kw(ctx, ...args);
    } catch (e) {
      const fail = e && e.name === 'AssertionError';
      return { id: test.id, status: fail ? 'FAIL' : 'ERROR', step: i, message: e && e.message };
    }
  }
  return { id: test.id, status: 'PASS', step: null, message: null };
}

function runSuite(tests, library) {
  const results = tests.map((t) => runKeywordTest(t, library));
  return {
    passed: results.filter((r) => r.status === 'PASS').length,
    failed: results.filter((r) => r.status === 'FAIL').length,
    errors: results.filter((r) => r.status === 'ERROR').length,
    results,
  };
}
`,
    ],
  },
  kiem: (() => {
    const LIB = "const AE = (m) => { const e = new Error(m); e.name = 'AssertionError'; return e; }; const LIB = { Book: (c, h) => { if (h > 3) throw new Error('INVALID_HOURS'); c.hours = (c.hours || 0) + h; }, CheckHours: (c, n) => { if ((c.hours || 0) !== n) throw AE('expected ' + n + ' hours, got ' + (c.hours || 0)); } };";
    const k = (moTa, body, ex) => kiemTuy(moTa, new Function(`${LIB}\n${body}`), ex);
    return [
      k({ en: 'a passing keyword test', vi: 'test từ khoá đạt' }, "const r = runKeywordTest({ id: 'K1', rows: [['Book', 2], ['Book', 3], ['CheckHours', 5]] }, LIB); return JSON.stringify(r) === JSON.stringify({ id: 'K1', status: 'PASS', step: null, message: null }) ? 'OK' : 'got ' + JSON.stringify(r);"),
      k({ en: 'an AssertionError makes the test FAIL at that step', vi: 'AssertionError làm test FAIL ở bước đó' }, "const r = runKeywordTest({ id: 'K2', rows: [['Book', 2], ['CheckHours', 3], ['Book', 1]] }, LIB); return r.status === 'FAIL' && r.step === 1 && r.message === 'expected 3 hours, got 2' ? 'OK' : 'got ' + JSON.stringify(r);"),
      k({ en: 'an unknown keyword is an ERROR', vi: 'từ khoá lạ là ERROR' }, "const r = runKeywordTest({ id: 'K3', rows: [['Book', 1], ['Cancel', 'BK1']] }, LIB); return r.status === 'ERROR' && r.step === 1 && r.message === 'UNKNOWN_KEYWORD Cancel' ? 'OK' : 'got ' + JSON.stringify(r);"),
      k({ en: 'another exception is an ERROR, not a FAIL', vi: 'ngoại lệ khác là ERROR, không phải FAIL' }, "const r = runKeywordTest({ id: 'K4', rows: [['Book', 5]] }, LIB); return r.status === 'ERROR' && r.step === 0 && r.message === 'INVALID_HOURS' ? 'OK' : 'got ' + JSON.stringify(r);"),
      k({ en: 'runSuite counts and contexts do not leak', vi: 'runSuite đếm đúng và ngữ cảnh không rò' }, "const s = runSuite([{ id: 'a', rows: [['Book', 2], ['CheckHours', 2]] }, { id: 'b', rows: [['CheckHours', 0]] }, { id: 'c', rows: [['Nope']] }, { id: 'd', rows: [['CheckHours', 9]] }], LIB); return s.passed === 2 && s.failed === 1 && s.errors === 1 && s.results.map((r) => r.id).join('') === 'abcd' ? 'OK' : 'got ' + JSON.stringify(s);"),
      k({ en: 'library keys inherited from Object are unknown keywords', vi: 'khoá kế thừa từ Object là từ khoá lạ' }, "const r = runKeywordTest({ id: 'K5', rows: [['toString']] }, LIB); return r.status === 'ERROR' && r.message === 'UNKNOWN_KEYWORD toString' ? 'OK' : 'got ' + JSON.stringify(r);", { an: true }),
      k({ en: 'an empty test passes', vi: 'test rỗng đạt' }, "const r = runKeywordTest({ id: 'E', rows: [] }, LIB); return r.status === 'PASS' ? 'OK' : 'got ' + JSON.stringify(r);", { an: true }),
    ];
  })(),
});

const E5 = tinhDe({
  tieuDe: 'Automation 5 — Special considerations (K1)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five FE-style questions on SWT6 slides 42–47: what each scripting approach needs, and the special considerations for test management tools.</p>', vi: '<p>Năm câu kiểu FE về slide SWT6 42–47: mỗi cách viết script cần gì và lưu ý đặc biệt cho công cụ quản lý test.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Why is capture/replay alone not a good automation strategy?', 'Vì sao chỉ capture/replay không phải chiến lược tự động hoá tốt?'), luaChon: lc(['a', 'It is too expensive to buy'], ['b', 'The recorded scripts are brittle, hard to maintain and contain no expected results unless added'], ['c', 'It cannot replay'], ['d', 'It needs a model']), dapAn: ['b'], giaiThich: giai('Scripts may be unstable when unexpected events occur.', 'Script dễ hỏng khi có sự kiện ngoài dự kiến.') },
    { ma: 'q2', de: hai('What is a key advantage of keyword-driven testing?', 'Ưu điểm chính của keyword-driven testing?'), luaChon: lc(['a', 'No upfront effort'], ['b', 'Testers who are not programmers can write tests using keywords, once the keywords have been implemented'], ['c', 'It needs no data'], ['d', 'It is the same as capture/replay']), dapAn: ['b'], giaiThich: giai('The keyword library is the upfront investment.', 'Thư viện từ khoá là khoản đầu tư ban đầu.') },
    { ma: 'q3', de: hai('Which is a special consideration for test management tools?', 'Đâu là lưu ý đặc biệt cho công cụ quản lý test?'), luaChon: lc(['a', 'They must be used alone'], ['b', 'They often need to interface with other tools or spreadsheets to produce useful information in the format the organisation needs'], ['c', 'They run tests'], ['d', 'They need no configuration']), dapAn: ['b'], giaiThich: giai('Integration with requirements, defects, CI and reporting.', 'Tích hợp với yêu cầu, lỗi, CI và báo cáo.') },
    { ma: 'q4', de: hai('A data-driven approach is most appropriate when…', 'Cách hướng dữ liệu hợp nhất khi…'), luaChon: lc(['a', 'the steps stay the same but many combinations of input data must be tested'], ['b', 'the steps change every week'], ['c', 'there is no data'], ['d', 'only one test is needed']), dapAn: ['a'], giaiThich: giai('Testers add rows; the script stays.', 'Tester thêm dòng; script giữ nguyên.') },
    { ma: 'q5', de: hai('Which skill does model-based testing require?', 'Model-based testing đòi kỹ năng gì?'), luaChon: lc(['a', 'None'], ['b', 'Modelling: the generated tests are only as good as the model'], ['c', 'Only recording'], ['d', 'Only SQL']), dapAn: ['b'], giaiThich: giai('A wrong model produces wrong tests.', 'Mô hình sai sinh test sai.') },
  ],
  goiY: ['Mỗi cách có một điểm yếu riêng.', 'Công cụ quản lý test cần tích hợp với công cụ khác.'],
  loiHayGap: ['Cho rằng keyword-driven không tốn công ban đầu.', 'Chọn data-driven khi các bước thay đổi.'],
  giaiThich: '<p>Answers: b · b · b · a · b.</p>',
  thuatNgu: [{ en: 'brittle', vi: 'dễ gãy' }],
  khaiNiem: ['test execution tools'],
});

export default doiDau({
  slug: 'swt301-tools-benefits-risks',
  ten: '8.3 Benefits and risks of test automation',
  moTaModule: 'Lợi ích và rủi ro của tự động hoá, bốn cách viết script (capture/replay, data-driven, keyword-driven, model-based), tự viết runner hướng dữ liệu và bộ thông dịch hướng từ khoá, lưu ý đặc biệt.',
  khoa: KHOA,
  baiHoc: 'swt301-tools-benefits-risks',
  de: [E1, E2, E3, E4, E5],
});
