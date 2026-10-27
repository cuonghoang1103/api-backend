/**
 * SWT301 · 2.5 — Maintenance testing & the IEEE 829 high-level test plan (SWT2 slide 131–143, LO-2.4.1–2.4.2).
 */
import { doiDau, KHOA, hai, giai, lc, svg } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const KT = ['Modification', 'Migration', 'Retirement'];
const E1 = tinhDe({
  tieuDe: 'Maintenance 1 — Which trigger starts maintenance testing?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Maintenance testing is triggered by <b>modification</b> (enhancements, corrective and emergency fixes, environment changes, patches), <b>migration</b> (to another platform, including data conversion) or <b>retirement</b> (data archiving and restoring). Classify each LabBook event.</p>', vi: '<p>Kiểm thử bảo trì được kích hoạt bởi <b>modification</b> (nâng cấp, sửa lỗi thường/khẩn, đổi môi trường, bản vá), <b>migration</b> (sang nền tảng khác, kèm chuyển đổi dữ liệu) hoặc <b>retirement</b> (lưu trữ và khôi phục dữ liệu). Phân loại từng sự kiện của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Event → trigger', 'Sự kiện → tác nhân'),
    cot: [{ ma: 'e', ten: 'Event' }, { ma: 't', ten: 'Trigger', luaChon: KT }],
    hang: [
      'A hot-fix for DEF-31 is deployed on Friday night',
      'LabBook moves from an on-premise server to a cloud provider; all bookings are converted to the new database',
      'The old paper-based booking module is switched off; ten years of records must be archived and restorable',
      'PostgreSQL is upgraded from version 15 to 17 on the same server',
      'A new “exam week” rule limits bookings to 4 hours',
      'The legacy LabBook 1.x is replaced by 2.0; its data is imported into 2.0 and 1.x is decommissioned',
    ].map((e, i) => ({ ma: `r${i}`, o: { e } })),
    dapAn: { 'r0.t': KT[0], 'r1.t': KT[1], 'r2.t': KT[2], 'r3.t': KT[0], 'r4.t': KT[0], 'r5.t': KT[1] },
    giaiThich: giai('Fixes, upgrades of the environment and enhancements are modifications; moving to another platform with data conversion is migration; switching a system off with archiving is retirement. The 1.x → 2.0 case is migration (data moved into the new system); the retirement of 1.x would be tested separately.', 'Sửa lỗi, nâng cấp môi trường, thêm tính năng là modification; chuyển nền tảng kèm chuyển dữ liệu là migration; tắt hệ thống kèm lưu trữ là retirement. Trường hợp 1.x → 2.0 là migration (dữ liệu chuyển sang hệ mới); việc ngừng 1.x sẽ test riêng.'),
  }],
  goiY: ['Có chữ “convert/import data, new platform” ⇒ migration.', 'Nâng cấp CSDL/HĐH trên cùng máy = thay đổi môi trường ⇒ modification.'],
  loiHayGap: ['Gán nâng cấp PostgreSQL vào migration.', 'Quên rằng retirement cũng cần test (lưu trữ và khôi phục dữ liệu).'],
  giaiThich: '<p>Modification · Migration · Retirement · Modification · Modification · Migration.</p>',
  thuatNgu: [{ en: 'maintenance testing', vi: 'kiểm thử bảo trì' }, { en: 'hot-fix', vi: 'bản sửa khẩn' }, { en: 'decommission', vi: 'ngừng vận hành' }],
  khaiNiem: ['maintenance testing triggers'],
});

const DO_THI = svg({
  w: 600, h: 230, tieuDe: 'LabBook module dependencies',
  nut: [
    { id: 'ui', x: 300, y: 30, nhan: 'web-ui', hinh: 'hop', rong: 90 },
    { id: 'api', x: 300, y: 95, nhan: 'api', hinh: 'hop', rong: 70 },
    { id: 'bk', x: 160, y: 160, nhan: 'booking', hinh: 'hop', rong: 90 },
    { id: 'cn', x: 300, y: 160, nhan: 'cancel', hinh: 'hop', rong: 80 },
    { id: 'rp', x: 450, y: 160, nhan: 'report', hinh: 'hop', rong: 80 },
    { id: 'ml', x: 230, y: 215, nhan: 'mail', hinh: 'hop', rong: 70 },
    { id: 'db', x: 380, y: 215, nhan: 'repository', hinh: 'hop', rong: 100 },
  ],
  canh: [{ tu: 'ui', den: 'api' }, { tu: 'api', den: 'bk' }, { tu: 'api', den: 'cn' }, { tu: 'api', den: 'rp' }, { tu: 'bk', den: 'db' }, { tu: 'cn', den: 'bk' }, { tu: 'cn', den: 'ml' }, { tu: 'rp', den: 'db' }, { tu: 'bk', den: 'ml' }],
});
const E2 = jsDe({
  tieuDe: 'Maintenance 2 — Impact analysis on the dependency graph',
  doKho: 'MEDIUM', phut: 16,
  moTa: { en: `<p>Impact analysis asks: <i>what could this change affect?</i> A module is impacted by a change when it <b>depends</b> on the changed module, directly or through other modules.</p>${DO_THI}<p>Arrows mean “depends on / calls”. As data: <code>{ 'web-ui': ['api'], api: ['booking','cancel','report'], booking: ['repository','mail'], cancel: ['booking','mail'], report: ['repository'], mail: [], repository: [] }</code>.</p>
<p>Write <code>impacted(deps, changed)</code>: the changed modules <b>plus</b> every module that depends on one of them, directly or transitively — sorted A→Z.</p>`, vi: `<p>Phân tích tác động hỏi: <i>thay đổi này có thể ảnh hưởng tới đâu?</i> Một module bị ảnh hưởng khi nó <b>phụ thuộc</b> vào module bị đổi, trực tiếp hoặc qua module khác.</p>${DO_THI}<p>Mũi tên nghĩa là “phụ thuộc / gọi”. Dữ liệu như bản tiếng Anh.</p><p>Viết <code>impacted(deps, changed)</code>: các module bị đổi <b>cộng</b> mọi module phụ thuộc vào chúng, trực tiếp hay bắc cầu — sắp A→Z.</p>` },
  yeuCau: [{ en: 'The graph may contain a cycle — do not loop forever.', vi: 'Đồ thị có thể có chu trình — đừng lặp vô hạn.' }],
  viDu: [{ input: "impacted(DEPS, ['mail'])", output: "['api','booking','cancel','mail','web-ui']", explanation: 'booking and cancel call mail; api calls them; web-ui calls api. report is not impacted.|||booking, cancel gọi mail; api gọi chúng; web-ui gọi api. report không bị ảnh hưởng.' }],
  goiY: ['Đảo chiều đồ thị: với mỗi module m, ai gọi m?', 'BFS từ các module bị đổi theo chiều đảo, dùng Set “đã thăm” để chống chu trình.'],
  loiHayGap: ['Đi theo chiều thuận (những gì module bị đổi gọi tới) — đó là phụ thuộc của nó, không phải vùng bị ảnh hưởng.', 'Quên đưa chính module bị đổi vào kết quả.'],
  giaiThich: '<p>Reverse the edges and collect everything reachable from the changed modules. The result tells you where to run regression tests; how DEEP to test each impacted area then depends on risk (“it depends”).</p>',
  thuatNgu: [{ en: 'impact analysis', vi: 'phân tích tác động' }, { en: 'transitive', vi: 'bắc cầu' }, { en: 'dependency graph', vi: 'đồ thị phụ thuộc' }],
  khaiNiem: ['impact analysis'],
  tep: {
    'impact.js': [
      'function impacted(deps, changed) {\n  return [...changed];\n}\n',
      'function impacted(deps, changed) {\n  const callers = {};\n  for (const [m, list] of Object.entries(deps)) for (const d of list) (callers[d] = callers[d] || []).push(m);\n  const seen = new Set(changed);\n  const queue = [...changed];\n  while (queue.length) {\n    const x = queue.shift();\n    for (const c of callers[x] || []) if (!seen.has(c)) { seen.add(c); queue.push(c); }\n  }\n  return [...seen].sort();\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'change in mail', vi: 'đổi mail' }, () => { const D = { 'web-ui': ['api'], api: ['booking', 'cancel', 'report'], booking: ['repository', 'mail'], cancel: ['booking', 'mail'], report: ['repository'], mail: [], repository: [] }; const r = impacted(D, ['mail']); return JSON.stringify(r) === '["api","booking","cancel","mail","web-ui"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'change in repository impacts everything except mail', vi: 'đổi repository ảnh hưởng mọi thứ trừ mail' }, () => { const D = { 'web-ui': ['api'], api: ['booking', 'cancel', 'report'], booking: ['repository', 'mail'], cancel: ['booking', 'mail'], report: ['repository'], mail: [], repository: [] }; const r = impacted(D, ['repository']); return JSON.stringify(r) === '["api","booking","cancel","report","repository","web-ui"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'change in web-ui impacts only itself', vi: 'đổi web-ui chỉ ảnh hưởng chính nó' }, () => { const D = { 'web-ui': ['api'], api: ['booking'], booking: [] }; const r = impacted(D, ['web-ui']); return JSON.stringify(r) === '["web-ui"]' ? 'OK' : 'got ' + JSON.stringify(r) + ' — follow the callers, not the callees'; }),
    kiemTuy({ en: 'two changed modules, no duplicates', vi: 'hai module đổi, không trùng' }, () => { const D = { a: ['c'], b: ['c', 'd'], c: [], d: [] }; const r = impacted(D, ['c', 'd']); return JSON.stringify(r) === '["a","b","c","d"]' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'a dependency cycle does not hang', vi: 'chu trình phụ thuộc không treo' }, () => { const D = { a: ['b'], b: ['a'], c: ['a'] }; const r = impacted(D, ['a']); return JSON.stringify(r) === '["a","b","c"]' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const MUC = ['1 Test plan identifier', '2 Introduction', '3 Test items', '4 Features to be tested', '5 Features not to be tested', '6 Approach', '7 Item pass/fail criteria', '8 Suspension and resumption criteria', '9 Test deliverables', '10 Testing tasks', '11 Environmental needs', '12 Responsibilities', '13 Staffing and training needs', '14 Schedule', '15 Risks and contingencies', '16 Approvals'];
const E3 = tinhDe({
  tieuDe: 'Maintenance 3 — Fill the IEEE 829 test plan of LabBook 2.0',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>SWT2 ends with the 16-item IEEE 829 high-level test plan. Each sentence below comes from the test plan of the LabBook 2.0 migration. Put it in its section.</p>', vi: '<p>SWT2 kết thúc bằng test plan tổng thể IEEE 829 16 mục. Mỗi câu dưới đây lấy từ test plan đợt chuyển đổi LabBook 2.0. Đặt nó vào đúng mục.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Sentence → IEEE 829 section', 'Câu → mục IEEE 829'),
    cot: [{ ma: 's', ten: 'Sentence' }, { ma: 'm', ten: 'Section', luaChon: MUC }],
    hang: [
      'The admin usage report is not tested in this release because it is unchanged and will be retired in May',
      'Testing stops if more than 20% of the smoke tests fail on a build; it resumes when a new build passes the smoke suite',
      'Deliverables: test design specification, test cases, test logs, incident reports, test summary report',
      'If the cloud environment is late, we test on the old server and repeat the performance tests later',
      'Two testers need a one-day course on the new load-testing tool',
      'Test items: LabBook 2.0.0-rc1 (build 412) delivered through the CI pipeline, with its release notes',
      'Booking, cancellation and the data conversion of 2025–2026 bookings will be tested with EP, BVA and decision tables',
      'A test item passes when all its high-priority test cases pass and no Critical defect is open',
      'The head of the lab department and the test manager sign the plan',
      'A cloud test environment with production-like data, Chrome and Firefox, and the load-testing tool',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.m': MUC[4], 'r1.m': MUC[7], 'r2.m': MUC[8], 'r3.m': MUC[14], 'r4.m': MUC[12], 'r5.m': MUC[2], 'r6.m': MUC[5], 'r7.m': MUC[6], 'r8.m': MUC[15], 'r9.m': MUC[10] },
    giaiThich: giai('What is not tested and why = item 5; stop/restart = 8; document set = 9; contingency for a risk = 15; training = 13; versions and delivery = 3; activities and techniques = 6 (approach); pass rule per item = 7; sign-off = 16; hardware, software, tools = 11.', 'Không test gì và vì sao = mục 5; dừng/tiếp = 8; bộ tài liệu = 9; phương án cho rủi ro = 15; đào tạo = 13; phiên bản và bàn giao = 3; hoạt động và kỹ thuật = 6; luật đạt của từng hạng mục = 7; ký duyệt = 16; phần cứng, phần mềm, công cụ = 11.'),
  }],
  goiY: ['Câu có “không test… vì” ⇒ mục 5; “dừng… tiếp tục” ⇒ mục 8.', 'Kỹ thuật test (EP, BVA) thuộc Approach (mục 6), không phải mục 4.'],
  loiHayGap: ['Nhầm mục 7 (đạt/trượt của hạng mục) với mục 8 (tạm dừng/tiếp tục).', 'Đưa test case chi tiết vào test plan — chúng nằm ở đặc tả thiết kế/test case.'],
  giaiThich: '<p>5 · 8 · 9 · 15 · 13 · 3 · 6 · 7 · 16 · 11.</p>',
  thuatNgu: [{ en: 'suspension / resumption criteria', vi: 'tiêu chí tạm dừng / tiếp tục' }, { en: 'contingency', vi: 'phương án dự phòng' }, { en: 'test item transmittal', vi: 'bàn giao hạng mục test' }],
  khaiNiem: ['IEEE 829 test plan'],
});

const E4 = tinhDe({
  tieuDe: 'Maintenance 4 — Exam questions on maintenance testing',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Six FE-style questions on SWT2 slides 131–137: how maintenance testing differs from development testing, the role of impact analysis, testing with poor specifications and what a test plan contains.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT2 131–137: kiểm thử bảo trì khác kiểm thử phát triển thế nào, vai trò của phân tích tác động, test khi đặc tả kém và test plan chứa gì.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Maintenance testing is predominantly…', 'Kiểm thử bảo trì chủ yếu là…'), luaChon: lc(['a', 'acceptance testing'], ['b', 'regression testing (plus testing of the change itself)'], ['c', 'static analysis'], ['d', 'usability testing']), dapAn: ['b'], giaiThich: giai('Preserve what works while checking the change.', 'Giữ cái đang chạy tốt trong khi kiểm thay đổi.') },
    { ma: 'q2', de: hai('What is the role of impact analysis?', 'Vai trò của phân tích tác động là gì?'), luaChon: lc(['a', 'To fix defects'], ['b', 'To identify the intended consequences and possible side effects of a change and the areas to regression-test'], ['c', 'To write the test plan'], ['d', 'To measure performance']), dapAn: ['b'], giaiThich: giai('It can also help decide whether the change should be made at all.', 'Nó còn giúp quyết định có nên thay đổi hay không.') },
    { ma: 'q3', de: hai('Which makes impact analysis difficult?', 'Điều gì làm phân tích tác động khó?'), luaChon: lc(['a', 'Specifications are out of date or missing, test cases are not documented, traceability is not maintained'], ['b', 'Too many testers'], ['c', 'Automated tests'], ['d', 'Short release cycles only']), dapAn: ['a'], giaiThich: giai('Plus weak tool support, people without domain knowledge, little attention to maintainability.', 'Thêm: công cụ yếu, người thiếu hiểu biết nghiệp vụ, ít chú ý khả năng bảo trì.') },
    { ma: 'q4', de: hai('There is no specification for the changed system. What can be used as the regression baseline?', 'Hệ thống không có đặc tả. Có thể dùng gì làm mốc hồi quy?'), luaChon: lc(['a', 'Nothing — testing is impossible'], ['b', 'The current behaviour of the existing system (except for the change), user manuals and the knowledge of current users'], ['c', 'The developer’s opinion only'], ['d', 'A random sample']), dapAn: ['b'], giaiThich: giai('You can validate but not really verify; document your assumptions.', 'Có thể validate nhưng không thật sự verify; ghi lại giả định.') },
    { ma: 'q5', de: hai('How does maintenance testing typically differ from development testing (slide 132)?', 'Kiểm thử bảo trì khác kiểm thử phát triển thế nào (slide 132)?'), luaChon: lc(['a', 'It runs bottom-up with synthetic data'], ['b', 'It runs top-down, uses a live data profile, breadth tests for overall confidence and depth tests around the change'], ['c', 'It needs no planning'], ['d', 'It is only done by users']), dapAn: ['b'], giaiThich: giai('Different sequence, different test data, breadth + depth.', 'Thứ tự khác, dữ liệu khác, diện rộng + chiều sâu.') },
    { ma: 'q6', de: hai('What is NOT included in a high-level test plan?', 'Cái gì KHÔNG nằm trong test plan tổng thể?'), luaChon: lc(['a', 'Features not to be tested'], ['b', 'The detailed test cases with their steps and data'], ['c', 'Suspension and resumption criteria'], ['d', 'Risks and contingencies']), dapAn: ['b'], giaiThich: giai('Test cases live in the test design and test case specifications.', 'Test case nằm ở đặc tả thiết kế test và đặc tả test case.') },
  ],
  goiY: ['Bảo trì = thay đổi + hồi quy; phân tích tác động quyết định test bao nhiêu.', 'Test plan nói về phạm vi, cách tiếp cận, tiêu chí, nguồn lực — không chứa từng bước test.'],
  loiHayGap: ['Chọn “bottom-up” cho bảo trì — đó là thứ tự của phát triển.', 'Cho rằng không có đặc tả thì không test được gì.'],
  giaiThich: '<p>Answers: b · b · a · b · b · b.</p>',
  thuatNgu: [{ en: 'live data profile', vi: 'hồ sơ dữ liệu thật' }, { en: 'breadth / depth tests', vi: 'test diện rộng / chiều sâu' }],
  khaiNiem: ['maintenance testing', 'impact analysis'],
});

export default doiDau({
  slug: 'swt301-maintenance-test-plan',
  ten: '2.5 Maintenance testing and the high-level test plan',
  moTaModule: 'Ba tác nhân kiểm thử bảo trì, viết code phân tích tác động trên đồ thị phụ thuộc LabBook, điền test plan IEEE 829 16 mục cho đợt chuyển đổi LabBook 2.0, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-maintenance-test-plan',
  de: [E1, E2, E3, E4],
});
