/**
 * SWT301 · DỰ ÁN LABBOOK — MỐC CHƯƠNG 7: bản 2.0.0-rc2 — lịch chạy theo rủi ro, defect report CHẠY ĐƯỢC cho các failure đã quan
 * sát (máy chấm tái hiện trên LabBook), quyết định go/no-go; kèm Góc phỏng vấn 7.
 */
import { doiDau, KHOA, hai, giai, lc, jsLit, bangHtml, kiemKhoa, NOP_BAI } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';
import { kiemKichBan, LABBOOK_API, DOT_BIEN_TICH_HOP } from './_labbook.mjs';

const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);

const FEAT = [['F1', 'Book a seat', 4, 5], ['F2', 'Cancel and waitlist promotion', 3, 5], ['F3', 'Weekly 6-hour limit', 3, 4], ['F4', 'Closing a lab', 2, 4], ['F5', 'Login and account lock', 2, 3], ['F6', 'Dark-mode colours', 1, 2]];
const TCS = [['TC-A', 'F5', 'Log in as a student', []], ['TC-B', 'F1', 'Book a free seat', ['TC-A']], ['TC-C', 'F2', 'Cancel and promote the waitlist', ['TC-B']], ['TC-D', 'F3', 'Reach and exceed the weekly limit', ['TC-B']], ['TC-E', 'F4', 'Manager closes a lab with bookings', ['TC-A']], ['TC-F', 'F6', 'Check dark-mode colours', []], ['TC-G', 'F5', 'Lock after 3 wrong passwords', []]];

const rep = (id, title, severity, priority, expected, actual, steps) => ({ id, title, severity, priority, version: '2.0.0-rc2', environment: 'Chrome 130, test server stg-3, seed data of the LabBook API', phase: 'System testing', expected, actual, description: title, precondition: 'Seed data; clock Mon 2026-11-02 08:00; build 2.0.0-rc2', steps });
const GIAI = [
  rep('DEF-201', 'A booking is answered 201 but is never stored (not in My bookings, not in the database)', 'Critical', 'High',
    'the booking appears in GET /api/bookings/me and in the bookings table', 'POST answers 201 BK0001, but /me and the table are empty', [
      book('student1', 'LAB01', '2026-11-04', 9, 1, { status: 201, body: { code: 'BK0001' } }),
      b('student1', 'GET /api/bookings/me', undefined, { status: 200, body: [{ code: 'BK0001' }] }),
      b('student1', 'GET /test/db/bookings', undefined, { status: 200, body: { length: 1 } }),
    ]),
  rep('DEF-202', 'Exceeding the weekly 6-hour limit returns 500 INTERNAL_ERROR instead of 422 WEEKLY_LIMIT', 'Medium', 'Medium',
    '422 { error: WEEKLY_LIMIT }', '500 { error: INTERNAL_ERROR }', [
      book('student1', 'LAB01', '2026-11-04', 9, 3, { status: 201 }),
      book('student1', 'LAB01', '2026-11-05', 9, 3, { status: 201 }),
      book('student1', 'LAB01', '2026-11-06', 9, 1, { status: 422, body: { error: 'WEEKLY_LIMIT' } }),
    ]),
  rep('DEF-203', 'Closing a lab cancels CONFIRMED bookings but leaves PENDING ones active', 'High', 'High',
    'both bookings of LAB02 become CANCELLED and both students are e-mailed', 'the PENDING booking BK0002 stays PENDING', [
      book('student1', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'CONFIRMED' } }),
      book('student2', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'PENDING' } }),
      b('manager', 'PATCH /api/labs/LAB02', { status: 'CLOSED' }, { status: 200, body: { cancelled: 2 } }),
      b('admin', 'GET /test/db/bookings', undefined, { status: 200, body: [{ code: 'BK0001', status: 'CANCELLED' }, { code: 'BK0002', status: 'CANCELLED' }] }),
    ]),
];

const DB = (ma) => DOT_BIEN_TICH_HOP.find((m) => m.ma === ma);
const kb = kiemKichBan({ bien: 'DEFECT_REPORTS', minCa: 3, can: [], nhomCauTruc: 'f2', dotBien: [DB('I2'), DB('I1'), DB('I5')], nhomDotBien: 'f2' });
const KIEM = [
  ...kiemKhoa([
    { moTa: { en: 'A — test priority of each feature (1 extensive · 2 broad · 3 cursory · 4 report bugs only)', vi: 'A — ưu tiên test từng tính năng (1 extensive · 2 broad · 3 cursory · 4 report bugs only)' }, bieuThuc: 'JSON.stringify(["F1","F2","F3","F4","F5","F6"].map(function (k) { return PLAN.priorities[k]; }))', chap: [JSON.stringify([1, 1, 2, 2, 3, 4])], nhom: 'f1' },
    { moTa: { en: 'A — execution order (priority + dependencies; report-only features get no test)', vi: 'A — thứ tự chạy (ưu tiên + phụ thuộc; tính năng report-only không có test)' }, bieuThuc: 'JSON.stringify(PLAN.order)', chap: [JSON.stringify(['TC-A', 'TC-B', 'TC-C', 'TC-D', 'TC-E', 'TC-G'])], nhom: 'f1' },
  ]),
  ...kb,
  kiemTuy({ en: 'B — every report has a real title, version 2.0.0-rc2, environment, valid severity and priority, expected ≠ actual', vi: 'B — mỗi report có tiêu đề thật, phiên bản 2.0.0-rc2, môi trường, severity/priority hợp lệ, mong đợi ≠ thực tế' }, () => {
    if (typeof DEFECT_REPORTS === 'undefined' || !Array.isArray(DEFECT_REPORTS)) return 'DEFECT_REPORTS is missing';
    const L = ['Critical', 'High', 'Medium', 'Low'];
    for (const r of DEFECT_REPORTS) {
      const ten = r.id || '?';
      if (String(r.title || '').length < 15) return ten + ': write a real title (symptom + condition)';
      if (r.version !== '2.0.0-rc2') return ten + ': version must be 2.0.0-rc2';
      if (!String(r.environment || '').trim()) return ten + ': environment is missing';
      if (L.indexOf(r.severity) < 0 || L.indexOf(r.priority) < 0) return ten + ': severity and priority must be Critical, High, Medium or Low';
      if (!String(r.expected || '').trim() || !String(r.actual || '').trim() || r.expected === r.actual) return ten + ': expected and actual results must both be written and differ';
    }
    return 'OK';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'B — the defect that loses bookings is rated Critical', vi: 'B — lỗi làm mất booking được đánh Critical' }, () => {
    const L = typeof DEFECT_REPORTS !== 'undefined' && Array.isArray(DEFECT_REPORTS) ? DEFECT_REPORTS : [];
    const r = L.find((x) => Array.isArray(x.steps) && x.steps.some((s) => /test\/db\/bookings|bookings\/me/.test(String(s.call))) && x.steps.filter((s) => /POST \/api\/bookings/.test(String(s.call))).length === 1);
    return r && r.severity === 'Critical' ? 'OK' : 'a booking that is confirmed to the student but never stored loses data for everybody — severity Critical';
  }, { nhom: 'f3', an: true }),
  ...kiemKhoa([
    { moTa: { en: 'C — release decision', vi: 'C — quyết định phát hành' }, bieuThuc: 'DECISION.decision', chap: ['NO-GO'], nhom: 'f3' },
    { moTa: { en: 'C — failed exit criterion', vi: 'C — tiêu chí ra không đạt' }, bieuThuc: 'DECISION.failedCriterion', chap: ['No open Critical or High defect'], nhom: 'f3' },
    { moTa: { en: 'C — who accepts residual risk if they still want to release', vi: 'C — ai chấp nhận rủi ro còn lại nếu vẫn muốn phát hành' }, bieuThuc: 'DECISION.riskAcceptedBy', chap: ['Stakeholders (product owner / business)'], nhom: 'f3' },
  ]),
];

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 7 — Release Candidate 2.0.0-rc2: Plan, Defect Reports, Decision',
  phu: { en: 'Running project · chapter 7 · risk-based order, executable defect reports, go/no-go · 10 marks', vi: 'Dự án xuyên suốt · chương 7 · thứ tự theo rủi ro, defect report chạy được, go/no-go · 10 điểm' },
  moTa: {
    en: `<p>You lead the system test of <b>LabBook 2.0.0-rc2</b>.</p>
<p><b>A. Risk-based plan.</b> Product risks rated on the 5-point scale (5 = very high); level = L × I; extent 15–25 extensive (test priority 1), 8–14 broad (2), 4–7 cursory (3), 1–3 report bugs only (4 — no planned test). Each test case takes the priority of its feature; order by priority, dependencies first, ties by id.</p>${bangHtml(['Feature', 'Name', 'Likelihood', 'Impact'], FEAT)}${bangHtml(['Test case', 'Feature', 'What', 'Depends on'], TCS.map(([a, f, w, d]) => [a, f, w, d.join(', ') || '—']))}
<p><b>B. Defect reports.</b> During the first cycle the team saw three failures: (1) a booking answered <i>201</i> did not appear in “My bookings”; (2) a booking over the weekly limit answered <i>500</i>; (3) after the manager closed a lab, a waitlisted booking was still active. Write one <b>executable defect report</b> per failure in <code>DEFECT_REPORTS</code>: the report fields plus <code>steps</code> whose <code>expect</code> is the <b>specified</b> behaviour. The grader runs every report on a correct LabBook (it must pass) and on the rc2 defects (it must fail there).</p>${LABBOOK_API.en}
<p><b>C. Decision.</b> Exit criterion of the plan: <i>no open Critical or High defect</i>. Decide go/no-go and say who can accept the residual risk if the business still wants to release.</p>`,
    vi: `<p>Bạn chủ trì system test của <b>LabBook 2.0.0-rc2</b>. <b>A.</b> Lập kế hoạch theo rủi ro: mức = L × I, độ sâu và ưu tiên test (1 extensive, 2 broad, 3 cursory, 4 report bugs only — không có test), rồi xếp thứ tự chạy theo ưu tiên + phụ thuộc. <b>B.</b> Viết một <b>defect report chạy được</b> cho mỗi failure đã thấy (booking 201 nhưng không có trong “My bookings”; vượt giới hạn tuần trả 500; đóng phòng mà booking chờ vẫn còn): các trường của report cộng <code>steps</code> với <code>expect</code> là hành vi ĐÚNG theo đặc tả. <b>C.</b> Quyết định go/no-go theo tiêu chí ra “không còn lỗi Critical hay High mở” và ai được chấp nhận rủi ro còn lại.</p>${LABBOOK_API.vi}`,
  },
  chucNangChinh: [
    { en: 'A. Feature priorities and the execution order.', vi: 'A. Ưu tiên từng tính năng và thứ tự chạy.' },
    { en: 'B. Three executable defect reports.', vi: 'B. Ba defect report chạy được.' },
    { en: 'C. The release decision.', vi: 'C. Quyết định phát hành.' },
  ],
  yeuCauChung: [{ en: 'A report whose expected result is the rc2 behaviour fails on the correct system — expected results come from the specification.', vi: 'Report lấy hành vi của rc2 làm kết quả mong đợi sẽ trượt trên hệ thống đúng — kết quả mong đợi lấy từ đặc tả.' }],
  cayThuMuc: `answers/
├── plan.js       ← const PLAN = { priorities: { F1: 1, … }, order: ['TC-…'] }
├── defects.js    ← const DEFECT_REPORTS = [ { id, title, severity, priority, version, environment, phase, expected, actual, description, precondition, steps } ]
└── decision.js   ← const DECISION = { decision, failedCriterion, riskAcceptedBy }`,
  moHinh: {
    ten: 'DECISION — allowed values',
    truong: [
      ['decision', 'string', { en: 'GO · NO-GO', vi: 'GO · NO-GO' }],
      ['failedCriterion', 'string', { en: 'No open Critical or High defect · All planned tests executed · None', vi: 'No open Critical or High defect · All planned tests executed · None' }],
      ['riskAcceptedBy', 'string', { en: 'The test team · Stakeholders (product owner / business) · The developers', vi: 'The test team · Stakeholders (product owner / business) · The developers' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Risk-based plan', vi: 'A. Kế hoạch theo rủi ro' }, diem: 3, yeuCau: [{ en: 'Priorities and the order.', vi: 'Ưu tiên và thứ tự.' }], hook: ['risk-based testing', 'test execution schedule'] },
    { ten: { en: 'B1. Reproducible reports', vi: 'B1. Report tái hiện được' }, diem: 4, yeuCau: [{ en: 'Valid structure; each report passes on the correct system and reproduces its rc2 failure.', vi: 'Cấu trúc hợp lệ; mỗi report đạt trên hệ thống đúng và tái hiện được failure của rc2.' }], hook: ['defect report'] },
    { ten: { en: 'B2–C. Report quality and decision', vi: 'B2–C. Chất lượng report và quyết định' }, diem: 3, yeuCau: [{ en: 'Fields, ratings, go/no-go.', vi: 'Các trường, đánh giá, go/no-go.' }], hook: ['exit criteria'] },
  ],
  idBatBuoc: [['PLAN', 'answers/plan.js'], ['DEFECT_REPORTS', 'answers/defects.js'], ['DECISION', 'answers/decision.js']],
  truDiem: [
    { en: 'Planning a test for F6 (report bugs only).', vi: 'Lập test cho F6 (report bugs only).' },
    { en: 'Checking only the 201 of the lost booking — the response is fine; the defect is that nothing was stored.', vi: 'Chỉ kiểm mã 201 của booking bị mất — câu trả lời đúng; lỗi là không lưu gì.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 7 — Talking about test management',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> Questions about planning, risk, reporting and defects — the topics a team lead uses to decide whether a junior tester can work without supervision.</p>', vi: '<p><b>Góc phỏng vấn.</b> Câu hỏi về kế hoạch, rủi ro, báo cáo và lỗi — chủ đề trưởng nhóm dùng để quyết định tester mới có làm việc độc lập được không.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“How do you prioritise when there is not enough time to test everything?”', '“Bạn ưu tiên thế nào khi không đủ thời gian test hết?”'), luaChon: lc(['a', '“I test the easiest features first.”'], ['b', '“By product risk — likelihood × impact with the business and developers — then I run the highest-risk tests first, respecting dependencies, and report what remains untested.”'], ['c', '“I ask for more time.”'], ['d', '“Alphabetically.”']), dapAn: ['b'], giaiThich: giai('Risk-based testing + execution schedule + transparency.', 'Risk-based testing + lịch thực thi + minh bạch.') },
    { ma: 'q2', de: hai('“What is the difference between severity and priority? Give an example.”', '“Severity khác priority thế nào? Cho ví dụ.”'), luaChon: lc(['a', '“They are the same.”'], ['b', '“Severity is the impact, priority the urgency. A crash in an unused export is high severity, low priority; the university name misspelled before the rector’s demo is low severity, high priority.”'], ['c', '“Priority is set by the tester.”'], ['d', '“Severity is about the UI.”']), dapAn: ['b'], giaiThich: giai('Definition + the two classic mismatch examples.', 'Định nghĩa + hai ví dụ lệch kinh điển.') },
    { ma: 'q3', de: hai('“The release date is fixed but a High defect is still open. What do you do?”', '“Ngày phát hành cố định nhưng còn lỗi High mở. Bạn làm gì?”'), luaChon: lc(['a', '“I lower it to Medium.”'], ['b', '“I report the facts and the residual risk clearly; the decision to release with the risk belongs to the stakeholders, not to me — and I propose mitigations such as a workaround or a hot-fix plan.”'], ['c', '“I block the release myself.”'], ['d', '“I say nothing.”']), dapAn: ['b'], giaiThich: giai('Integrity (code of ethics) + who accepts risk.', 'Chính trực (đạo đức nghề) + ai chấp nhận rủi ro.') },
    { ma: 'q4', de: hai('“What makes a good defect report?”', '“Một defect report tốt cần gì?”'), luaChon: lc(['a', '“A long description.”'], ['b', '“A precise title, the build and environment, minimal steps from a known state, expected vs actual, evidence, severity, and a reference to the test case — ideally reproducible by a script.”'], ['c', '“The name of the developer to blame.”'], ['d', '“Only a screenshot.”']), dapAn: ['b'], giaiThich: giai('The components of slide 93 — and the developer can reproduce it.', 'Các thành phần của slide 93 — và developer tái hiện được.') },
    { ma: 'q5', de: hai('“Which metric would you show the project manager every week?”', '“Bạn đưa quản lý dự án số đo nào mỗi tuần?”'), luaChon: lc(['a', '“The number of bugs per developer.”'], ['b', '“Execution progress vs plan, pass rate, open defects by severity, coverage of high-risk requirements — and a clear RAG status with the reason.”'], ['c', '“Lines of test code.”'], ['d', '“Nothing — they can read Jira.”']), dapAn: ['b'], giaiThich: giai('Metrics that support decisions, tailored to the audience.', 'Số đo phục vụ quyết định, theo người đọc.') },
  ],
  goiY: ['Nói theo rủi ro, số liệu và ai quyết định.', 'Không bao giờ hạ mức lỗi để kịp ngày.'],
  loiHayGap: ['Tự chặn phát hành thay vì báo rủi ro cho người có quyền quyết định.', 'Dùng số lỗi để đánh giá cá nhân developer.'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: [{ en: 'workaround', vi: 'cách làm tạm để tránh lỗi' }],
  khaiNiem: ['interview', 'test management'],
});

const GIAI_PLAN = "// Levels: F1 20, F2 15 (extensive → 1) · F3 12, F4 8 (broad → 2) · F5 6 (cursory → 3) · F6 2 (report bugs only → 4, no test).\n// Order: TC-A (needed by TC-B) → TC-B (1) → TC-C (1) → TC-D (2) → TC-E (2) → TC-G (3); TC-F is not planned.\nconst PLAN = {\n  priorities: { F1: 1, F2: 1, F3: 2, F4: 2, F5: 3, F6: 4 },\n  order: ['TC-A', 'TC-B', 'TC-C', 'TC-D', 'TC-E', 'TC-G'],\n};\n";
const GIAI_DECISION = "// DEF-201 is Critical and DEF-203 is High, both open → the exit criterion fails.\nconst DECISION = {\n  decision: 'NO-GO',\n  failedCriterion: 'No open Critical or High defect',\n  riskAcceptedBy: 'Stakeholders (product owner / business)',\n};\n";

export default doiDau({
  slug: 'swt301-7-project-labbook-rc-test-report',
  ten: 'LabBook Project 7 — Release Candidate: Plan, Defect Reports, Decision',
  moTaModule: 'Dự án LabBook — mốc chương 7: kế hoạch theo rủi ro (mức, ưu tiên, thứ tự chạy có phụ thuộc), ba defect report chạy được tái hiện failure của bản rc2 (mất booking, 500 thay 422, đóng phòng bỏ sót PENDING), quyết định go/no-go; kèm góc phỏng vấn 7.',
  khoa: KHOA,
  baiHoc: 'swt301-bug-lifecycle',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 7 — Release Candidate 2.0.0-rc2: Plan, Defect Reports, Decision',
      doKho: 'HARD', phut: 80, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: "steps: book LAB01 → GET /api/bookings/me expect [{ code: 'BK0001' }]", output: 'passes on the correct system · fails on rc2 (the booking was never stored)', explanation: 'An executable defect report reproduces the failure every time.|||Defect report chạy được tái hiện failure mọi lần.' }],
      khaiNiem: ['risk-based testing', 'test execution schedule', 'defect report', 'exit criteria'],
      tienQuyet: ['SWT301 chapter 7', 'LabBook API'],
      the: ['swt301', 'project', 'labbook', 'test-management'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'release candidate (rc)', vi: 'bản ứng viên phát hành' }, { en: 'executable defect report', vi: 'báo cáo lỗi chạy được' }, { en: 'go/no-go', vi: 'phát hành hay không' }],
      goiY: [
        'A: TC-B ưu tiên 1 nhưng cần TC-A (ưu tiên 3) chạy trước; TC-F thuộc F6 nên không lập test.',
        'B: failure (1) — kiểm cả GET /api/bookings/me và GET /test/db/bookings (body: { length: 1 }).',
        'B: failure (2) — 3 + 3 giờ rồi thêm 1 giờ cùng tuần ⇒ 422 WEEKLY_LIMIT.',
        'B: failure (3) — LAB02 có 1 chỗ: một CONFIRMED, một PENDING; đóng phòng; kiểm cả hai dòng trong CSDL.',
      ],
      loiHayGap: ['Lấy hành vi của rc2 làm expected.', 'Đánh Medium cho lỗi mất dữ liệu.', 'Quyết định GO vì “chỉ còn 2 lỗi”.'],
      moTaNgan: 'Mốc 7 dự án LabBook: kế hoạch theo rủi ro, defect report chạy được, go/no-go.',
      giaiThich: {
        en: '<p>Priorities 1, 1, 2, 2, 3, 4; order TC-A, TC-B, TC-C, TC-D, TC-E, TC-G. Three executable reports reproduce I2 (lost booking — Critical), I1 (500 instead of 422 — Medium) and I5 (closing leaves PENDING — High). Open Critical and High defects ⇒ NO-GO; only the stakeholders may accept the residual risk.</p>',
        vi: '<p>Ưu tiên 1, 1, 2, 2, 3, 4; thứ tự TC-A, TC-B, TC-C, TC-D, TC-E, TC-G. Ba report chạy được tái hiện I2 (mất booking — Critical), I1 (500 thay 422 — Medium), I5 (đóng phòng bỏ sót PENDING — High). Còn lỗi Critical và High mở ⇒ NO-GO; chỉ các bên liên quan mới chấp nhận được rủi ro còn lại.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/plan.js', 'answers/defects.js', 'answers/decision.js'], kiem: KIEM },
      khoiDau: {
        'answers/plan.js': "const PLAN = {\n  priorities: { F1: 0, F2: 0, F3: 0, F4: 0, F5: 0, F6: 0 },\n  order: [],\n};\n",
        'answers/defects.js': `// One executable report per observed failure. expect = the SPECIFIED behaviour.\nconst DEFECT_REPORTS = [\n${jsLit({ ...GIAI[1], steps: GIAI[1].steps.slice(0, 1) }, '  ').replace(/^/, '  ')},\n];\n`,
        'answers/decision.js': "const DECISION = { decision: '', failedCriterion: '', riskAcceptedBy: '' };\n",
      },
      loiGiai: {
        'answers/plan.js': GIAI_PLAN,
        'answers/defects.js': `// LabBook 2.0.0-rc2 — three executable defect reports.\nconst DEFECT_REPORTS = ${jsLit(GIAI)};\n`,
        'answers/decision.js': GIAI_DECISION,
      },
      thamKhao: 'https://istqb-glossary.page/defect-report/',
      boYeu: [
        { ten: 'chỉ kiểm mã 201', tep: { 'answers/defects.js': `const DEFECT_REPORTS = ${jsLit([{ ...GIAI[0], steps: GIAI[0].steps.slice(0, 1) }, GIAI[1], GIAI[2]])};\n` }, phaiTruot: ['B — the defect that loses bookings'] },
        { ten: 'lập test cho F6', tep: { 'answers/plan.js': GIAI_PLAN.replace("order: ['TC-A', 'TC-B', 'TC-C', 'TC-D', 'TC-E', 'TC-G']", "order: ['TC-A', 'TC-B', 'TC-C', 'TC-D', 'TC-E', 'TC-G', 'TC-F']") }, phaiTruot: ['A — execution order'] },
      ],
    },
    PHONG_VAN,
  ],
});
