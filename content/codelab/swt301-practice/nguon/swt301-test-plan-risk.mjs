/**
 * SWT301 · 7.2 — Test planning & estimation (SWT5 slide 25–58, LO-5.2.1–5.2.6): strategies, entry/exit, execution schedule (K3), estimation.
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const CL = ['Analytical', 'Model-based', 'Methodical', 'Process-compliant', 'Directed (consultative)', 'Regression-averse', 'Reactive'];
const E1 = tinhDe({
  tieuDe: 'Planning 1 — Which of the seven test strategies?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>A test strategy says where tests come from. Match each LabBook decision to one of the seven strategy types (analytical, model-based, methodical, process/standard-compliant, directed, regression-averse, reactive).</p>', vi: '<p>Chiến lược test cho biết test lấy từ đâu. Ghép mỗi quyết định của LabBook với một trong bảy loại chiến lược.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Decision → strategy', 'Quyết định → chiến lược'),
    cot: [{ ma: 'd', ten: 'Decision' }, { ma: 's', ten: 'Strategy', luaChon: CL }],
    hang: [
      'Test effort is distributed according to a product-risk analysis of each feature',
      'Tests are derived from the state diagram of a booking and from the business-process model of semester set-up',
      'Every release is checked against the ISO/IEC 25010 quality characteristics, one by one',
      'The team follows ISO/IEC/IEEE 29119 because the university contract requires it',
      'The security consultant decides which attacks must be tested',
      'All passing tests of previous releases are automated and re-run on every build',
      'No tests are designed in advance for the beta; testers explore it as soon as it is deployed',
    ].map((d, i) => ({ ma: `r${i}`, o: { d } })),
    dapAn: Object.fromEntries(CL.map((c, i) => [`r${i}.s`, c])),
    giaiThich: giai('Risk analysis = analytical; models = model-based; a predefined list = methodical; external standard = process-compliant; expert advice = directed; avoiding regression = regression-averse; reacting to the delivered system = reactive.', 'Phân tích rủi ro = analytical; mô hình = model-based; danh sách định sẵn = methodical; chuẩn bên ngoài = process-compliant; lời khuyên chuyên gia = directed; tránh hồi quy = regression-averse; phản ứng với hệ thống đã giao = reactive.'),
  }],
  goiY: ['“Theo danh sách có sẵn” ⇒ methodical; “theo chuẩn bắt buộc” ⇒ process-compliant.', 'Exploratory là ví dụ điển hình của reactive.'],
  loiHayGap: ['Nhầm methodical với process-compliant.', 'Gán risk-based cho directed.'],
  giaiThich: '<p>Analytical · Model-based · Methodical · Process-compliant · Directed · Regression-averse · Reactive.</p>',
  thuatNgu: [{ en: 'test strategy', vi: 'chiến lược test' }, { en: 'test approach', vi: 'cách tiếp cận test — chiến lược áp vào một dự án' }],
  khaiNiem: ['test strategies'],
});

const E2 = tinhDe({
  tieuDe: 'Planning 2 — Entry or exit criterion?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Entry criteria (definition of ready) say when a test activity may start; exit criteria (definition of done) say when it may stop. Classify each criterion of the LabBook system-test plan.</p>', vi: '<p>Entry criteria (definition of ready) cho biết khi nào một hoạt động test được bắt đầu; exit criteria (definition of done) cho biết khi nào được dừng. Phân loại từng tiêu chí trong kế hoạch system test LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Criterion → kind', 'Tiêu chí → loại'),
    cot: [{ ma: 'c', ten: 'Criterion' }, { ma: 'k', ten: 'Kind', luaChon: ['Entry criterion', 'Exit criterion'] }],
    hang: [
      'The test environment and the seed data are available and the smoke test passes',
      'All planned tests have been run and 100% of high-risk requirements are covered',
      'The test items have passed component and integration testing',
      'No open Critical or Major defect; the number of open Minor defects is below 10',
      'Testable requirements and user stories are available',
      'The estimated residual risk has been accepted by the product owner',
      'The test tools are installed and licensed',
    ].map((c, i) => ({ ma: `r${i}`, o: { c } })),
    dapAn: { 'r0.k': 'Entry criterion', 'r1.k': 'Exit criterion', 'r2.k': 'Entry criterion', 'r3.k': 'Exit criterion', 'r4.k': 'Entry criterion', 'r5.k': 'Exit criterion', 'r6.k': 'Entry criterion' },
    giaiThich: giai('Entry: availability of environment, data, tools, testable requirements, test items that met the exit criteria of the previous level. Exit: planned tests executed, coverage reached, defects below limits, residual risk evaluated, budget/time.', 'Entry: có môi trường, dữ liệu, công cụ, yêu cầu test được, hạng mục đã qua tiêu chí ra của cấp trước. Exit: chạy xong test dự kiến, đạt độ phủ, lỗi dưới ngưỡng, đã đánh giá rủi ro còn lại, ngân sách/thời gian.'),
  }],
  goiY: ['“Có sẵn / sẵn sàng” ⇒ entry; “đã chạy / đã phủ / còn lại” ⇒ exit.', 'Hạng mục đã qua cấp trước là tiêu chí VÀO của cấp này.'],
  loiHayGap: ['Gán “đã qua integration testing” cho exit.', 'Gán rủi ro còn lại được chấp nhận cho entry.'],
  giaiThich: '<p>Entry · Exit · Entry · Exit · Entry · Exit · Entry.</p>',
  thuatNgu: [{ en: 'entry criteria (definition of ready)', vi: 'tiêu chí vào' }, { en: 'exit criteria (definition of done)', vi: 'tiêu chí ra' }, { en: 'residual risk', vi: 'rủi ro còn lại' }],
  khaiNiem: ['entry and exit criteria'],
});

const E3 = jsDe({
  tieuDe: 'Planning 3 — Build the test execution schedule (K3)',
  doKho: 'HARD', phut: 18,
  moTa: { en: `<p>LO-5.2.4 (K3) — the rule of slide 40, word for word: <i>“Ideally, test cases are ordered by their priority levels. If a test case with a higher priority depends on a test case with a lower priority, the lower-priority test case must be executed first.”</i></p>
<p>Write <code>schedule(tests)</code>. Each test is <code>{ id, priority, dependsOn: [ids] }</code> where priority <b>1 is the highest</b>. Return the ids in execution order: at each step choose, among the tests whose dependencies have all been executed, the one with the highest priority (smallest number); ties by id A→Z. If some tests can never run (cyclic or missing dependency), return <code>null</code>.</p>`, vi: `<p>LO-5.2.4 (K3) — luật của slide 40: <i>“Lý tưởng là sắp test case theo mức ưu tiên. Nếu test case ưu tiên cao phụ thuộc test case ưu tiên thấp hơn, test case ưu tiên thấp phải chạy trước.”</i></p>
<p>Viết <code>schedule(tests)</code>. Mỗi test là <code>{ id, priority, dependsOn: [ids] }</code>, priority <b>1 là cao nhất</b>. Trả các id theo thứ tự chạy: mỗi bước chọn, trong các test đã chạy xong mọi phụ thuộc, test ưu tiên cao nhất (số nhỏ nhất); bằng nhau thì theo id A→Z. Nếu có test không bao giờ chạy được (phụ thuộc vòng hoặc phụ thuộc không tồn tại) thì trả <code>null</code>.</p>` },
  yeuCau: [{ en: 'Do not modify the input.', vi: 'Không sửa đầu vào.' }],
  viDu: [{ input: "schedule([{id:'TC1',priority:2,dependsOn:[]},{id:'TC2',priority:1,dependsOn:['TC3']},{id:'TC3',priority:3,dependsOn:[]}])", output: "['TC1','TC3','TC2']", explanation: 'TC2 (priority 1) waits for TC3; TC1 (priority 2) is the best test available first.|||TC2 (ưu tiên 1) phải chờ TC3; lúc đầu TC1 (ưu tiên 2) là test tốt nhất đang chạy được.' }],
  goiY: ['Giữ tập “đã chạy”; mỗi vòng lọc các test chưa chạy có mọi dependsOn trong tập đó.', 'Sắp ứng viên theo (priority, id) và lấy phần tử đầu.', 'Không còn ứng viên mà vẫn còn test ⇒ null.'],
  loiHayGap: ['Sắp một lần theo priority rồi “đẩy” phụ thuộc lên trước — có thể chạy sớm một test ưu tiên thấp chưa cần.', 'Lặp vô hạn khi có phụ thuộc vòng.'],
  giaiThich: '<p>A greedy topological order: always run the highest-priority test that is ready. This is exactly how exam questions on slide 41–44 are solved by hand.</p>',
  thuatNgu: [{ en: 'test execution schedule', vi: 'lịch thực thi test' }, { en: 'dependency', vi: 'phụ thuộc kỹ thuật hoặc logic' }],
  khaiNiem: ['test execution schedule'],
  tep: {
    'schedule.js': [
      'function schedule(tests) {\n  return tests.map((t) => t.id);\n}\n',
      `function schedule(tests) {
  const done = new Set();
  const order = [];
  const rest = tests.slice();
  while (rest.length) {
    const ready = rest.filter((t) => (t.dependsOn || []).every((d) => done.has(d)));
    if (!ready.length) return null;
    ready.sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const next = ready[0];
    order.push(next.id);
    done.add(next.id);
    rest.splice(rest.indexOf(next), 1);
  }
  return order;
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = schedule([{ id: 'TC1', priority: 2, dependsOn: [] }, { id: 'TC2', priority: 1, dependsOn: ['TC3'] }, { id: 'TC3', priority: 3, dependsOn: [] }]); return JSON.stringify(r) === '["TC1","TC3","TC2"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'no dependencies: pure priority, ties by id', vi: 'không phụ thuộc: theo ưu tiên, bằng nhau theo id' }, () => { const r = schedule([{ id: 'B', priority: 2, dependsOn: [] }, { id: 'A', priority: 2, dependsOn: [] }, { id: 'C', priority: 1, dependsOn: [] }]); return JSON.stringify(r) === '["C","A","B"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'a chain of dependencies', vi: 'chuỗi phụ thuộc' }, () => { const r = schedule([{ id: 'T4', priority: 1, dependsOn: ['T3'] }, { id: 'T3', priority: 3, dependsOn: ['T2'] }, { id: 'T2', priority: 3, dependsOn: [] }, { id: 'T1', priority: 2, dependsOn: [] }]); return JSON.stringify(r) === '["T1","T2","T3","T4"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'slide-style exam question (LabBook login → book → cancel)', vi: 'câu kiểu slide (đăng nhập → đặt → huỷ)' }, () => { const r = schedule([{ id: 'TC-cancel', priority: 1, dependsOn: ['TC-book'] }, { id: 'TC-report', priority: 3, dependsOn: [] }, { id: 'TC-book', priority: 2, dependsOn: ['TC-login'] }, { id: 'TC-login', priority: 3, dependsOn: [] }, { id: 'TC-search', priority: 2, dependsOn: [] }]); return JSON.stringify(r) === '["TC-search","TC-login","TC-book","TC-cancel","TC-report"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'cyclic or missing dependency ⇒ null', vi: 'phụ thuộc vòng hoặc thiếu ⇒ null' }, () => { const a = schedule([{ id: 'X', priority: 1, dependsOn: ['Y'] }, { id: 'Y', priority: 2, dependsOn: ['X'] }]); const b = schedule([{ id: 'X', priority: 1, dependsOn: ['Z'] }]); return a === null && b === null ? 'OK' : 'got ' + JSON.stringify(a) + ' and ' + JSON.stringify(b); }, { an: true }),
    kiemTuy({ en: 'input is not modified', vi: 'không sửa đầu vào' }, () => { const t = [{ id: 'B', priority: 1, dependsOn: [] }, { id: 'A', priority: 2, dependsOn: ['B'] }]; const k = JSON.stringify(t); schedule(t); return JSON.stringify(t) === k ? 'OK' : 'the input array was modified'; }, { an: true }),
  ],
});

const E4 = jsDe({
  tieuDe: 'Planning 4 — Estimate the test effort: metrics-based and three-point',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>LO-5.2.6 distinguishes <b>metrics-based</b> estimation (from historical data) and <b>expert-based</b> estimation (Wideband Delphi, planning poker, three-point). Write:</p>
<ol><li><code>metricsBased(history, newCases)</code> — <code>history</code> is <code>[{ cases, hours }]</code> of past releases. Hours per case = Σhours ÷ Σcases; return newCases × that, rounded to 1 decimal.</li>
<li><code>threePoint(a, m, b)</code> — optimistic, most likely, pessimistic. Return <code>{ estimate: (a + 4m + b) / 6, sd: (b − a) / 6 }</code>, both rounded to 2 decimals.</li>
<li><code>withRetests(hours, cycles, retestRatio)</code> — the 2023 deck’s warning: an estimate must include several fix-and-retest cycles. Each extra cycle costs <code>retestRatio</code> × the first run. Return hours × (1 + cycles × retestRatio), rounded to 1 decimal.</li></ol>`, vi: `<p>LO-5.2.6 phân biệt ước lượng <b>dựa số liệu</b> (từ dữ liệu lịch sử) và <b>dựa chuyên gia</b> (Wideband Delphi, planning poker, ba điểm). Viết ba hàm như bản tiếng Anh: <code>metricsBased</code> (giờ/test case lịch sử × số case mới, làm tròn 1 chữ số), <code>threePoint</code> ((a + 4m + b)/6 và (b − a)/6, làm tròn 2 chữ số), <code>withRetests</code> (cộng các chu kỳ sửa–test lại, mỗi chu kỳ tốn retestRatio × lần chạy đầu, làm tròn 1 chữ số).</p>` },
  yeuCau: [{ en: 'Round with <code>Math.round(x * 10) / 10</code> or <code>Math.round(x * 100) / 100</code> at the end only.', vi: 'Làm tròn bằng <code>Math.round(x * 10) / 10</code> hoặc <code>Math.round(x * 100) / 100</code>, chỉ ở cuối.' }],
  viDu: [
    { input: 'metricsBased([{cases:120,hours:60},{cases:80,hours:44}], 150)', output: '78', explanation: '104 h ÷ 200 cases = 0.52 h/case × 150.|||104 giờ ÷ 200 case = 0,52 giờ/case × 150.' },
    { input: 'threePoint(20, 30, 52)', output: '{ estimate: 32, sd: 5.33 }', explanation: '(20 + 120 + 52) ÷ 6 = 32.|||(20 + 120 + 52) ÷ 6 = 32.' },
  ],
  goiY: ['metricsBased: cộng tổng giờ và tổng case trước, rồi mới chia (không lấy trung bình của các tỉ lệ).', 'withRetests(78, 2, 0.3) = 78 × 1.6 = 124.8.'],
  loiHayGap: ['Lấy trung bình các tỉ lệ giờ/case của từng bản (trọng số sai).', 'Dùng (a + m + b)/3 thay cho trọng số PERT.'],
  giaiThich: '<p>Metrics-based estimation scales history; three-point (PERT) weights the most likely value four times; the 2023 deck reminds you that the first run is never the last — budget the fix-and-retest cycles from history too.</p>',
  thuatNgu: [{ en: 'metrics-based estimation', vi: 'ước lượng dựa số liệu' }, { en: 'expert-based estimation', vi: 'ước lượng dựa chuyên gia' }, { en: 'three-point estimation', vi: 'ước lượng ba điểm (PERT)' }, { en: 'Wideband Delphi', vi: 'chuyên gia ước lượng độc lập rồi hội tụ' }],
  khaiNiem: ['test estimation'],
  tep: {
    'estimate.js': [
      'function metricsBased(history, newCases) {\n  return 0;\n}\n\nfunction threePoint(a, m, b) {\n  return { estimate: 0, sd: 0 };\n}\n\nfunction withRetests(hours, cycles, retestRatio) {\n  return hours;\n}\n',
      'function metricsBased(history, newCases) {\n  const h = history.reduce((s, x) => s + x.hours, 0);\n  const c = history.reduce((s, x) => s + x.cases, 0);\n  return Math.round((newCases * h / c) * 10) / 10;\n}\n\nfunction threePoint(a, m, b) {\n  const r2 = (x) => Math.round(x * 100) / 100;\n  return { estimate: r2((a + 4 * m + b) / 6), sd: r2((b - a) / 6) };\n}\n\nfunction withRetests(hours, cycles, retestRatio) {\n  return Math.round(hours * (1 + cycles * retestRatio) * 10) / 10;\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'metricsBased — the example', vi: 'metricsBased — ví dụ' }, () => { const v = metricsBased([{ cases: 120, hours: 60 }, { cases: 80, hours: 44 }], 150); return v === 78 ? 'OK' : 'expected 78, got ' + v; }),
    kiemTuy({ en: 'metricsBased — weighted, not an average of ratios', vi: 'metricsBased — có trọng số, không lấy trung bình tỉ lệ' }, () => { const v = metricsBased([{ cases: 10, hours: 10 }, { cases: 90, hours: 45 }], 100); return v === 55 ? 'OK' : 'expected 55 (55 h / 100 cases), got ' + v; }),
    kiemTuy({ en: 'threePoint — the example', vi: 'threePoint — ví dụ' }, () => { const v = threePoint(20, 30, 52); return v && v.estimate === 32 && v.sd === 5.33 ? 'OK' : 'got ' + JSON.stringify(v); }),
    kiemTuy({ en: 'withRetests', vi: 'withRetests' }, () => { const v = withRetests(78, 2, 0.3); const w = withRetests(40, 0, 0.5); return v === 124.8 && w === 40 ? 'OK' : 'got ' + v + ' and ' + w; }),
    kiemTuy({ en: 'threePoint — rounding', vi: 'threePoint — làm tròn' }, () => { const v = threePoint(3, 5, 10); return v && v.estimate === 5.5 && v.sd === 1.17 ? 'OK' : 'got ' + JSON.stringify(v); }, { an: true }),
    kiemTuy({ en: 'metricsBased — rounding to 1 decimal', vi: 'metricsBased — làm tròn 1 chữ số' }, () => { const v = metricsBased([{ cases: 30, hours: 10 }], 7); return v === 2.3 ? 'OK' : 'expected 2.3, got ' + v; }, { an: true }),
  ],
});

const E5 = tinhDe({
  tieuDe: 'Planning 5 — Test plan, effort factors and estimation (exam)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six FE-style questions on SWT5 slides 25–58: what a test plan contains and how it changes, the factors that influence test effort and the two families of estimation techniques.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT5 25–58: test plan chứa gì và thay đổi ra sao, các yếu tố ảnh hưởng công sức test và hai họ kỹ thuật ước lượng.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which statement about the test plan is TRUE?', 'Phát biểu nào về test plan là ĐÚNG?'), luaChon: lc(['a', 'It is written once and never changed'], ['b', 'It is a continuous activity: feedback from test activities is used to update it'], ['c', 'It contains the detailed test cases'], ['d', 'Only the customer may change it']), dapAn: ['b'], giaiThich: giai('Planning is influenced by policy, strategy, lifecycle, scope, risks, constraints… and evolves.', 'Lập kế hoạch chịu ảnh hưởng của chính sách, chiến lược, vòng đời, phạm vi, rủi ro, ràng buộc… và thay đổi dần.') },
    { ma: 'q2', de: hai('Which is a PRODUCT characteristic that influences test effort?', 'Đâu là đặc điểm SẢN PHẨM ảnh hưởng công sức test?'), luaChon: lc(['a', 'The skills of the team'], ['b', 'The complexity of the product domain and the quality of the test basis'], ['c', 'Time pressure'], ['d', 'The test results']), dapAn: ['b'], giaiThich: giai('Factor groups: product, development process, people, test results.', 'Nhóm yếu tố: sản phẩm, quy trình phát triển, con người, kết quả test.') },
    { ma: 'q3', de: hai('Which is a TEST RESULTS factor?', 'Đâu là yếu tố KẾT QUẢ TEST?'), luaChon: lc(['a', 'The number and severity of defects found and the amount of rework required'], ['b', 'The tools used'], ['c', 'Team cohesion'], ['d', 'Legal requirements']), dapAn: ['a'], giaiThich: giai('More defects ⇒ more retests and regression.', 'Nhiều lỗi ⇒ nhiều test lại và hồi quy.') },
    { ma: 'q4', de: hai('Burndown charts and defect removal models from past projects are examples of…', 'Biểu đồ burndown và mô hình loại bỏ lỗi từ dự án trước là ví dụ của…'), luaChon: lc(['a', 'expert-based estimation'], ['b', 'metrics-based estimation'], ['c', 'exploratory testing'], ['d', 'risk analysis']), dapAn: ['b'], giaiThich: giai('Planning poker and Wideband Delphi are expert-based.', 'Planning poker và Wideband Delphi là dựa chuyên gia.') },
    { ma: 'q5', de: hai('Planning poker in an Agile team is…', 'Planning poker trong nhóm Agile là…'), luaChon: lc(['a', 'a metrics-based technique'], ['b', 'an expert-based technique'], ['c', 'a test strategy'], ['d', 'an exit criterion']), dapAn: ['b'], giaiThich: giai('Team members estimate based on experience and converge.', 'Thành viên ước lượng theo kinh nghiệm rồi hội tụ.') },
    { ma: 'q6', de: hai('Why should an estimate include fix-and-retest cycles (2023 deck)?', 'Vì sao ước lượng phải tính các chu kỳ sửa–test lại (bộ slide 2023)?'), luaChon: lc(['a', 'Because tests always pass the first time'], ['b', 'Because failures found in the first run lead to fixes, confirmation tests and regression runs that also take time'], ['c', 'Because managers like large numbers'], ['d', 'They should not']), dapAn: ['b'], giaiThich: giai('History tells how many cycles to expect.', 'Số liệu cũ cho biết cần dự trù bao nhiêu chu kỳ.') },
  ],
  goiY: ['Bốn nhóm yếu tố: sản phẩm, quy trình, con người, kết quả test.', 'Số liệu lịch sử ⇒ metrics-based; ý kiến người ⇒ expert-based.'],
  loiHayGap: ['Cho rằng test plan cố định.', 'Xếp planning poker vào metrics-based vì có con số.'],
  giaiThich: '<p>Answers: b · b · a · b · b · b.</p>',
  thuatNgu: [{ en: 'burndown chart', vi: 'biểu đồ công việc còn lại' }, { en: 'planning poker', vi: 'ước lượng bằng bài theo nhóm' }],
  khaiNiem: ['test planning', 'test estimation'],
});

export default doiDau({
  slug: 'swt301-test-plan-risk',
  ten: '7.2 Test planning and estimation',
  moTaModule: 'Bảy chiến lược test, entry/exit criteria, viết code lập lịch thực thi theo ưu tiên + phụ thuộc (K3), ước lượng dựa số liệu, ba điểm và chu kỳ test lại, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-test-plan-risk',
  de: [E1, E2, E3, E4, E5],
});
