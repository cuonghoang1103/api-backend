/**
 * SWT301 · LAB CHƯƠNG 7 — Quản lý test bản LabBook 2.1: A. lịch thực thi (K3) · B. phân tích rủi ro · C. báo cáo tiến độ +
 * hành động kiểm soát · D. defect report (K3) + severity/priority.
 */
import { doiDau, KHOA, kiemKhoa, bangHtml, NOP_BAI } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

const TC = [['T1', 'Log in as a student', 2, []], ['T2', 'Search labs by building', 3, []], ['T3', 'Book a seat', 1, ['T1']], ['T4', 'Cancel a booking', 1, ['T3']], ['T5', 'Waitlist promotion', 2, ['T3']], ['T6', 'Admin usage report', 3, ['T1']], ['T7', 'Lock an account after 3 failures', 2, ['T1']], ['T8', 'Manager closes a lab', 1, []]];
const RR = [['R1', 'The weekly limit counts cancelled bookings', 3, 4], ['R2', 'A student can see other students’ bookings', 2, 5], ['R3', 'Booking at 07:00 on Monday takes more than 3 s', 4, 4], ['R4', 'Waitlist promotion picks the wrong student', 3, 5], ['R5', 'Dark-mode colours are wrong', 2, 1], ['R6', 'The confirmation e-mail is delayed', 2, 3]];
const PR = [['PR1', 'The load-test server is shared with another project'], ['PR2', 'Only one tester knows the payment module']];
const EXT = ['extensive', 'broad', 'cursory', 'report bugs only'];
const HD = ['Re-prioritise tests', 'Change the test execution schedule', 'Re-evaluate the exit criteria with stakeholders', 'Add resources / ask for a fix'];
const SP = ['High severity · High priority', 'High severity · Low priority', 'Low severity · High priority', 'Low severity · Low priority'];

const KIEM = [
  ...kiemKhoa([{ moTa: { en: 'A — test execution schedule (priority + dependencies)', vi: 'A — lịch thực thi (ưu tiên + phụ thuộc)' }, bieuThuc: 'JSON.stringify(SCHEDULE)', chap: [JSON.stringify(['T8', 'T1', 'T3', 'T4', 'T5', 'T7', 'T2', 'T6'])], nhom: 'f1', goiY: 'each step: among the READY tests pick the highest priority (1 = highest), ties by id' }]),
  kiemTuy({ en: 'A — the first three tests', vi: 'A — ba test đầu' }, () => (Array.isArray(SCHEDULE) && SCHEDULE.slice(0, 3).join(',') === 'T8,T1,T3' ? 'OK' : 'the first three are not right yet — T3 (priority 1) needs T1 first')),
  ...kiemKhoa([
    ...RR.map(([id, , l, i]) => ({ moTa: { en: `B — level of ${id}`, vi: `B — mức rủi ro ${id}` }, bieuThuc: `RISK.levels.${id}`, chap: [l * i], kieu: 'so', nhom: 'f2' })),
    { moTa: { en: 'B — extent of testing per risk', vi: 'B — độ sâu kiểm thử từng rủi ro' }, bieuThuc: 'JSON.stringify(["R1","R2","R3","R4","R5","R6"].map(function (k) { return String(RISK.extents[k]).toLowerCase(); }))', chap: [JSON.stringify(['broad', 'broad', 'extensive', 'extensive', 'report bugs only', 'cursory'])], nhom: 'f2' },
    { moTa: { en: 'B — product risks in test order (highest level first; ties: higher impact)', vi: 'B — rủi ro sản phẩm theo thứ tự test (mức cao trước; bằng nhau: tác động cao trước)' }, bieuThuc: 'JSON.stringify(RISK.order)', chap: [JSON.stringify(['R3', 'R4', 'R1', 'R2', 'R6', 'R5'])], nhom: 'f2' },
    { moTa: { en: 'B — which statements are project risks', vi: 'B — câu nào là rủi ro dự án' }, bieuThuc: '(RISK.projectRisks || []).map(String)', chap: [['PR1', 'PR2']], kieu: 'tap', nhom: 'f2', an: true },
  ]),
  ...kiemKhoa([
    ['executedPct', 45.83], ['expectedPct', 62.5], ['passRate', 80], ['ddp', 95], ['density', 3.2],
  ].map(([k, v]) => ({ moTa: { en: `C — ${k}`, vi: `C — ${k}` }, bieuThuc: `MONITOR.${k}`, chap: [v], kieu: 'so', saiSo: 0.006, nhom: 'f3' }))),
  ...kiemKhoa([
    { moTa: { en: 'C — status (RED / AMBER / GREEN)', vi: 'C — trạng thái (RED / AMBER / GREEN)' }, bieuThuc: 'MONITOR.status', chap: ['RED'], nhom: 'f3' },
    { moTa: { en: 'C — control action', vi: 'C — hành động kiểm soát' }, bieuThuc: 'MONITOR.action', chap: [HD[3]], nhom: 'f3' },
  ]),
  kiemTuy({ en: 'D — report identification, version, environment, phase, reference', vi: 'D — định danh, phiên bản, môi trường, giai đoạn, tham chiếu' }, () => (typeof REPORT === 'object' && /\d/.test(String(REPORT.id)) && String(REPORT.title).length >= 15 && REPORT.version === '2.1.0' && /firefox/i.test(REPORT.environment) && /stg-1/i.test(REPORT.environment) && /^system testing$/i.test(String(REPORT.phase).trim()) && Array.isArray(REPORT.references) && REPORT.references.includes('ST-31') ? 'OK' : 'id, a real title, version 2.1.0, Firefox + stg-1, phase System testing and reference ST-31 are required'), { nhom: 'f4' }),
  kiemTuy({ en: 'D — steps, expected and actual', vi: 'D — các bước, mong đợi, thực tế' }, () => (Array.isArray(REPORT.steps) && REPORT.steps.length >= 3 && /cancelled/i.test(REPORT.expected) && /pending/i.test(REPORT.actual) && /lab closed/i.test(REPORT.expected) ? 'OK' : '≥ 3 steps; expected: CANCELLED + the “Lab closed” e-mail; actual: stays PENDING'), { nhom: 'f4' }),
  kiemTuy({ en: 'D — severity, priority, status', vi: 'D — severity, priority, trạng thái' }, () => { const L = ['Critical', 'High', 'Medium', 'Low']; return L.includes(REPORT.severity) && L.includes(REPORT.priority) && REPORT.status === 'New' ? 'OK' : 'severity/priority in Critical, High, Medium, Low; status New'; }, { nhom: 'f4' }),
  ...kiemKhoa([['D1', SP[1]], ['D2', SP[2]]].map(([k, v]) => ({ moTa: { en: `D — rating of ${k}`, vi: `D — đánh giá ${k}` }, bieuThuc: `RATINGS.${k}`, chap: [v], nhom: 'f4' }))),
];

const BAN_IN = {
  tieuDe: 'Lab 7 — Test Management of LabBook 2.1',
  phu: { en: 'Chapter 7 lab · execution schedule (K3), risk analysis, monitoring & control, defect report (K3) · 10 marks', vi: 'Lab chương 7 · lịch thực thi (K3), phân tích rủi ro, giám sát & kiểm soát, defect report (K3) · 10 điểm' },
  moTa: {
    en: `<p>You are the test lead of <b>LabBook 2.1</b>.</p>
<p><b>A. Test execution schedule.</b> Priority 1 = highest. Rule of slide 40: order by priority, but a test that another test depends on runs first; ties by id.</p>${bangHtml(['Test', 'Feature', 'Priority', 'Depends on'], TC.map(([a, b, c, d]) => [a, b, c, d.join(', ') || '—']))}
<p><b>B. Risk analysis</b> on the 5-point scale (5 = very high); level = L × I; extent: 15–25 extensive, 8–14 broad, 4–7 cursory, 1–3 report bugs only.</p>${bangHtml(['Risk', 'Description', 'Likelihood', 'Impact'], RR)}<p>Also in the risk workshop: ${PR.map(([a, b]) => `<b>${a}</b> ${b}`).join(' · ')}.</p>
<p><b>C. Weekly snapshot.</b> 240 tests planned, 150 should have run by now, 110 executed (88 passed, 18 failed, 4 blocked). 64 defects so far in 20 KLOC; one Critical defect (DEF-61) is open and blocks 30 cancellation tests. Release 2.0 had 95 defects found by testing and 5 found by users after release (use these two numbers for DDP). Status rule: RED if an open Critical exists or execution is more than 20 points behind plan; AMBER if behind at all or pass rate &lt; 90; otherwise GREEN.</p>
<p><b>D. Defect report.</b> System test case <b>ST-31</b> on build <b>2.1.0</b> (Firefox 131, test server <i>stg-1</i>): student2 has a PENDING booking BK0007 for LAB01 on 2026-11-05; the manager closes LAB01. Expected: BK0007 becomes CANCELLED and student2 receives “Lab closed - booking cancelled”. Actual: BK0007 stays PENDING, no e-mail (3 of 3 runs). Also rate: <b>D1</b> the never-used “export to XML” admin feature crashes the server · <b>D2</b> the university name is misspelled on the login page the day before the rector’s demo.</p>`,
    vi: `<p>Bạn là trưởng nhóm test của <b>LabBook 2.1</b>. <b>A.</b> Lập lịch thực thi theo luật slide 40 cho bảng tám test (ưu tiên 1 cao nhất). <b>B.</b> Phân tích rủi ro thang 5 điểm (5 = rất cao), mức = L × I, độ sâu: 15–25 extensive, 8–14 broad, 4–7 cursory, 1–3 report bugs only; xác định câu nào là rủi ro dự án. <b>C.</b> Tính các số của bản chụp tuần (240 dự kiến, 150 lẽ ra đã chạy, 110 đã chạy: 88 đạt, 18 trượt, 4 bị chặn; 64 lỗi trên 20 KLOC; DEF-61 Critical còn mở chặn 30 test huỷ; bản 2.0: 95 lỗi do test tìm, 5 lỗi người dùng tìm sau phát hành), trạng thái và hành động kiểm soát. <b>D.</b> Viết defect report cho ST-31 trên build 2.1.0 (Firefox 131, stg-1) và đánh giá D1, D2.</p>`,
  },
  chucNangChinh: [
    { en: 'A. The order of the 8 tests.', vi: 'A. Thứ tự 8 test.' },
    { en: 'B. Risk levels, extents, test order, project risks.', vi: 'B. Mức rủi ro, độ sâu, thứ tự test, rủi ro dự án.' },
    { en: 'C. Progress figures, status and control action.', vi: 'C. Số tiến độ, trạng thái và hành động kiểm soát.' },
    { en: 'D. A complete defect report and two severity/priority ratings.', vi: 'D. Một defect report đầy đủ và hai đánh giá severity/priority.' },
  ],
  yeuCauChung: [{ en: 'Percentages are rounded to 2 decimals.', vi: 'Phần trăm làm tròn 2 chữ số.' }],
  cayThuMuc: `answers/
├── a-schedule.js   ← const SCHEDULE = ['T8', …]
├── b-risk.js       ← const RISK = { levels: { R1: … }, extents: { R1: … }, order: [...], projectRisks: [...] }
├── c-monitor.js    ← const MONITOR = { executedPct, expectedPct, passRate, ddp, density, status, action }
└── d-defects.js    ← const REPORT = { id, title, version, environment, phase, steps, expected, actual, severity, priority, status, references }; const RATINGS = { D1, D2 }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['RISK.extents.*', 'string', { en: EXT.join(' · '), vi: EXT.join(' · ') }],
      ['MONITOR.action', 'string', { en: HD.join(' · '), vi: HD.join(' · ') }],
      ['RATINGS.*', 'string', { en: SP.join(' · '), vi: SP.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Execution schedule', vi: 'A. Lịch thực thi' }, diem: 2, yeuCau: [{ en: 'Priority + dependencies (K3).', vi: 'Ưu tiên + phụ thuộc (K3).' }], hook: ['test execution schedule'] },
    { ten: { en: 'B. Risk analysis', vi: 'B. Phân tích rủi ro' }, diem: 2.5, yeuCau: [{ en: 'Levels, extents, order, project risks.', vi: 'Mức, độ sâu, thứ tự, rủi ro dự án.' }], hook: ['risk-based testing'] },
    { ten: { en: 'C. Monitoring and control', vi: 'C. Giám sát và kiểm soát' }, diem: 2.5, yeuCau: [{ en: 'Five figures, status, action.', vi: 'Năm con số, trạng thái, hành động.' }], hook: ['test monitoring'] },
    { ten: { en: 'D. Defect management', vi: 'D. Quản lý lỗi' }, diem: 3, yeuCau: [{ en: 'A K3 defect report and two ratings.', vi: 'Một defect report K3 và hai đánh giá.' }], hook: ['defect report'] },
  ],
  idBatBuoc: [['SCHEDULE', 'answers/a-schedule.js'], ['RISK', 'answers/b-risk.js'], ['MONITOR', 'answers/c-monitor.js'], ['REPORT · RATINGS', 'answers/d-defects.js']],
  truDiem: [
    { en: 'Running T3 before T1 because it has priority 1 — the dependency comes first.', vi: 'Chạy T3 trước T1 vì ưu tiên 1 — phụ thuộc phải chạy trước.' },
    { en: 'Calling the snapshot AMBER because it is “only” 16.67 points behind — the open Critical makes it RED.', vi: 'Gọi bản chụp là AMBER vì “chỉ” chậm 16,67 điểm — lỗi Critical còn mở làm nó RED.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI = {
  'answers/a-schedule.js': `// Ready at start: T1(2) T2(3) T8(1) → T8. Then T1 → unlocks T3, T6, T7. T3(1) → unlocks T4, T5.
// T4(1), then T5(2) and T7(2) (tie by id), then T2(3) and T6(3).
const SCHEDULE = ['T8', 'T1', 'T3', 'T4', 'T5', 'T7', 'T2', 'T6'];
`,
  'answers/b-risk.js': `const RISK = {
  levels: { R1: 12, R2: 10, R3: 16, R4: 15, R5: 2, R6: 6 },
  extents: { R1: 'broad', R2: 'broad', R3: 'extensive', R4: 'extensive', R5: 'report bugs only', R6: 'cursory' },
  order: ['R3', 'R4', 'R1', 'R2', 'R6', 'R5'],
  projectRisks: ['PR1', 'PR2'],
};
`,
  'answers/c-monitor.js': `// executed 110/240 = 45.83 %, expected 150/240 = 62.5 % (16.67 points behind);
// pass rate 88/110 = 80 %; DDP 95/(95+5) = 95 %; density 64/20 = 3.2 per KLOC.
// An open Critical defect → RED. It blocks 30 tests → ask for a fix (and resources).
const MONITOR = {
  executedPct: 45.83,
  expectedPct: 62.5,
  passRate: 80,
  ddp: 95,
  density: 3.2,
  status: 'RED',
  action: 'Add resources / ask for a fix',
};
`,
  'answers/d-defects.js': `const REPORT = {
  id: 'DEF-74',
  title: 'Closing a lab leaves its PENDING bookings active (no cancellation, no e-mail)',
  date: '2026-11-04',
  author: 'Test lead, LabBook test team',
  testItem: 'LabBook lab-management service',
  version: '2.1.0',
  environment: 'Firefox 131, test server stg-1, seed data D7',
  phase: 'System testing',
  steps: [
    'As student1 and student3 book LAB01 on 2026-11-05 at 09:00 (both CONFIRMED: LAB01 has 2 seats)',
    'As student2 book LAB01 on 2026-11-05 at 09:00 → BK0007 is PENDING',
    'As manager close LAB01 (PATCH /api/labs/LAB01 { status: CLOSED })',
    'Check BK0007 in the database and the outbox of student2',
  ],
  expected: 'BK0007 becomes CANCELLED and student2 receives "Lab closed - booking cancelled"',
  actual: 'BK0007 stays PENDING and no e-mail is sent (3 of 3 runs)',
  severity: 'High',
  priority: 'High',
  status: 'New',
  references: ['ST-31', 'SRS: PATCH /api/labs closes CONFIRMED and PENDING bookings'],
};
const RATINGS = {
  D1: 'High severity · Low priority',
  D2: 'Low severity · High priority',
};
`,
};

export default doiDau({
  slug: 'swt301-7-lab-test-management-release21',
  ten: 'Lab 7 — Test Management of LabBook 2.1',
  moTaModule: 'Lab chương 7: lập lịch thực thi 8 test theo ưu tiên + phụ thuộc (K3), phân tích rủi ro L × I và độ sâu kiểm thử, số liệu tuần (tiến độ, tỉ lệ đạt, DDP, mật độ) + trạng thái và hành động kiểm soát, defect report K3 + severity/priority.',
  khoa: KHOA,
  baiHoc: 'swt301-bug-lifecycle',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 7 — Test Management of LabBook 2.1',
    doKho: 'HARD', phut: 75, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'R3 — likelihood 4, impact 4', output: 'level 16 → extensive', explanation: 'L × I, then the band.|||L × I rồi tra khoảng.' }],
    khaiNiem: ['test execution schedule', 'risk-based testing', 'test monitoring', 'test control', 'defect report'],
    tienQuyet: ['SWT301 chapter 7'],
    the: ['swt301', 'lab', 'test-management'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'execution schedule', vi: 'lịch thực thi' }, { en: 'DDP', vi: 'tỉ lệ lỗi phát hiện trước phát hành' }, { en: 'defect density', vi: 'mật độ lỗi' }, { en: 'RAG status', vi: 'trạng thái đỏ/vàng/xanh' }],
    goiY: [
      'A: mỗi bước chỉ xét test đã sẵn sàng (mọi phụ thuộc đã chạy).',
      'B: bằng mức thì tác động cao hơn đứng trước; PR1, PR2 nói về nguồn lực ⇒ rủi ro dự án.',
      'C: executedPct = 110/240; expectedPct = 150/240; DDP chỉ dùng 95 và 5.',
      'D: báo cáo cần phiên bản, môi trường, giai đoạn, bước, mong đợi/thực tế, severity, priority, trạng thái, tham chiếu.',
    ],
    loiHayGap: ['Đặt T3 trước T1.', 'Tính DDP bằng 64 lỗi hiện tại.', 'Thiếu tham chiếu ST-31 trong report.'],
    moTaNgan: 'Lab chương 7: quản lý test bản LabBook 2.1.',
    giaiThich: {
      en: '<p><b>A.</b> T8, T1, T3, T4, T5, T7, T2, T6. <b>B.</b> 12, 10, 16, 15, 2, 6 → broad, broad, extensive, extensive, report bugs only, cursory; order R3, R4, R1, R2, R6, R5; project risks PR1, PR2. <b>C.</b> 45.83 · 62.5 · 80 · 95 · 3.2 · RED · ask for a fix. <b>D.</b> A complete report referencing ST-31 on 2.1.0; D1 high severity/low priority; D2 low severity/high priority.</p>',
      vi: '<p>Xem đáp án từng phần ở bản tiếng Anh.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(GIAI), kiem: KIEM.map((k) => (k.nhom ? k : { ...k, nhom: 'f1' })) },
    khoiDau: {
      'answers/a-schedule.js': "const SCHEDULE = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];\n",
      'answers/b-risk.js': `// extents: ${EXT.join(' | ')}\nconst RISK = {\n  levels: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0 },\n  extents: { R1: '', R2: '', R3: '', R4: '', R5: '', R6: '' },\n  order: [],\n  projectRisks: [],\n};\n`,
      'answers/c-monitor.js': `// action: ${HD.join(' | ')}\nconst MONITOR = { executedPct: 0, expectedPct: 0, passRate: 0, ddp: 0, density: 0, status: '', action: '' };\n`,
      'answers/d-defects.js': `const REPORT = {\n  id: '', title: '', date: '', author: '', testItem: '', version: '', environment: '', phase: '',\n  steps: [], expected: '', actual: '', severity: '', priority: '', status: '', references: [],\n};\n// ${SP.join(' | ')}\nconst RATINGS = { D1: '', D2: '' };\n`,
    },
    loiGiai: GIAI,
    boYeu: [
      { ten: 'xếp lịch chỉ theo ưu tiên', tep: { 'answers/a-schedule.js': "const SCHEDULE = ['T3', 'T4', 'T8', 'T1', 'T5', 'T7', 'T2', 'T6'];\n" }, phaiTruot: ['A — test execution schedule'] },
      { ten: 'bỏ qua Critical còn mở', tep: { 'answers/c-monitor.js': GIAI['answers/c-monitor.js'].replace("status: 'RED'", "status: 'AMBER'") }, phaiTruot: ['C — status'] },
    ],
  }],
});
