/**
 * SWR302 · LAB 7 — Requirements management: a change request in LibraNet (Wiegers Ch.27–29).
 * A. sơ đồ trạng thái Change Request · B. phân tích ảnh hưởng bằng RTM + ước lượng công · C. trạng thái yêu cầu + số đo ·
 * D. chính sách kiểm soát thay đổi · E. bốn hướng truy vết, phần tử mồ côi.
 */
import { CU_PHAP, tn, kiemKhoa, bangHtml } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';
import { kiemState } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const RTM = [
  ['LB-03', 'Search the catalogue', 'D-Catalog', 'CatalogSearch', 'TC-27'],
  ['LB-05', 'Borrow a book', 'D-LoanFlow', 'LoanService', 'TC-21'],
  ['LB-07', 'Loan period by member type (14 days for everyone)', 'D-LoanPolicy', 'LoanService, PolicyConfig', 'TC-22, TC-23'],
  ['LB-09', 'Renew a loan (at most 2 renewals, each adds one loan period)', 'D-LoanPolicy', 'LoanService', 'TC-23, TC-24'],
  ['LB-11', 'Reserve a book that is on loan', '—', '—', '—'],
  ['LB-12', 'Overdue fine of 5,000 VND per day after the due date', 'D-FineRules', 'FineCalculator', 'TC-25'],
  ['LB-15', 'Due-date reminder 2 days before the due date', 'D-Reminder', 'ReminderJob', 'TC-26'],
  ['—', '(no requirement)', '—', '—', 'TC-28'],
];
const CONG = { requirement: 2, design: 3, code: 4, test: 1 };
const DAP_B = {
  modify: ['LB-07'], reverify: ['LB-05', 'LB-09'], design: ['D-LoanPolicy'], code: ['LoanService', 'PolicyConfig'], tests: ['TC-21', 'TC-22', 'TC-23', 'TC-24'],
};
const GIO = DAP_B.modify.length * CONG.requirement + DAP_B.design.length * CONG.design + DAP_B.code.length * CONG.code + DAP_B.tests.length * CONG.test;

const TT = [['Proposed', 4], ['Approved', 10], ['Implemented', 12], ['Verified', 11], ['Deleted', 2], ['Rejected', 1]];
const HOAT = TT.filter(([t]) => !['Deleted', 'Rejected'].includes(t)).reduce((s, [, n]) => s + n, 0);
const PCT_VERIFIED = (11 / HOAT) * 100, PCT_DONE = ((12 + 11) / HOAT) * 100;
const SU_KIEN = [
  ['E1', 'The CCB accepted LB-40 for release 2.', 'Approved'],
  ['E2', 'The code of LB-31 was merged and passed code review.', 'Implemented'],
  ['E3', 'LB-22 passed its system tests.', 'Verified'],
  ['E4', 'The sponsor dropped LB-35 after it had been approved.', 'Deleted'],
  ['E5', 'The CCB decided not to accept LB-41.', 'Rejected'],
  ['E6', 'A librarian suggested LB-42 yesterday.', 'Proposed'],
];
const CHINH_SACH = [
  ['P1', 'All requirement changes follow the change control process; a request not submitted through it is not considered.', 'TRUE'],
  ['P2', 'A developer may implement an unapproved change if it takes less than one hour.', 'FALSE'],
  ['P3', 'Submitting a change request guarantees that the change will be made.', 'FALSE'],
  ['P4', 'The rationale of every approval and every rejection is recorded.', 'TRUE'],
  ['P5', 'Impact analysis is needed only for large changes.', 'FALSE'],
  ['P6', 'The change database is visible to all stakeholders.', 'TRUE'],
];
const HUONG = ['FORWARD_TO_REQUIREMENTS', 'BACKWARD_FROM_REQUIREMENTS', 'FORWARD_FROM_REQUIREMENTS', 'BACKWARD_TO_REQUIREMENTS'];
const VET = [
  ['T1', 'From LB-07 to TC-22 and TC-23, to check that the requirement is tested.', 'FORWARD_FROM_REQUIREMENTS'],
  ['T2', 'From the code module FineCalculator back to LB-12, to know why the module exists.', 'BACKWARD_TO_REQUIREMENTS'],
  ['T3', 'From the business objective "halve the number of books returned late" to LB-12 and LB-15.', 'FORWARD_TO_REQUIREMENTS'],
  ['T4', 'From LB-15 back to the interview with the head librarian where it came from.', 'BACKWARD_FROM_REQUIREMENTS'],
];

const GIAI_CR = `
stateDiagram-v2
  [*] --> Submitted : change request submitted
  state "Change Made" as ChangeMade
  Submitted --> Evaluated : evaluator completes impact analysis
  Submitted --> Canceled : originator withdraws request
  Evaluated --> Approved : CCB decides [benefit outweighs impact]
  Evaluated --> Rejected : CCB decides [impact outweighs benefit] / record rationale
  Evaluated --> Canceled : originator withdraws request
  Approved --> ChangeMade : modifier updates affected work products
  Approved --> Canceled : change no longer needed
  ChangeMade --> Verified : verifier confirms the change [all affected tests pass]
  ChangeMade --> Approved : verification fails [defects found]
  Verified --> Closed : change installed in the release / notify originator
  Rejected --> [*]
  Closed --> [*]
  Canceled --> [*]
`;

const KIEM = [
  ...kiemState({
    bien: 'CR_STATES', tenDoiTuong: 'the change request', nhom: { cuPhap: 'f1', thanhPhan: 'f2', chuyen: 'f2' }, toiThieu: 7, guardToiThieu: 2,
    st: [
      { ten: 'Submitted', khop: ['submit'] }, { ten: 'Evaluated', khop: ['evaluat'] }, { ten: 'Approved', khop: ['approv'] },
      { ten: 'Rejected', khop: ['reject'] }, { ten: 'Change Made', khop: ['made|implemented|done|changed'] }, { ten: 'Verified', khop: ['verif'] },
      { ten: 'Closed', khop: ['clos'] }, { ten: 'Canceled', khop: ['cancel|withdrawn'] },
    ],
    ch: [
      { ten: 'evaluated → approved by the CCB', tenVi: 'evaluated → approved do CCB', tu: ['evaluat'], den: ['approv'], suKien: ['ccb|board|decid|approv'] },
      { ten: 'evaluated → rejected by the CCB', tenVi: 'evaluated → rejected do CCB', tu: ['evaluat'], den: ['reject'], suKien: ['ccb|board|decid|reject'] },
      { ten: 'submitted → evaluated after impact analysis', tenVi: 'submitted → evaluated sau phân tích ảnh hưởng', tu: ['submit'], den: ['evaluat'], suKien: ['impact|analy|evaluat'] },
      { ten: 'change made → verified', tenVi: 'change made → verified', tu: ['made|implemented|done|changed'], den: ['verif'] },
      { ten: 'verified → closed', tenVi: 'verified → closed', tu: ['verif'], den: ['clos'] },
      { ten: 'a request can be canceled before it is made', tenVi: 'yêu cầu có thể bị huỷ trước khi thực hiện', tu: ['submit|evaluat|approv'], den: ['cancel|withdrawn'] },
    ],
  }),
  ...kiemKhoa([
    { moTa: { en: 'B — requirements to modify', vi: 'B — yêu cầu phải sửa' }, bieuThuc: '(IMPACT.modify || []).map(String)', chap: [DAP_B.modify], kieu: 'tap', nhom: 'f3' },
    { moTa: { en: 'B — other requirements to re-verify (they share design, code or tests with the changed one)', vi: 'B — yêu cầu khác phải kiểm lại (dùng chung thiết kế, mã hoặc test với yêu cầu bị sửa)' }, bieuThuc: '(IMPACT.reverify || []).map(String)', chap: [DAP_B.reverify], kieu: 'tap', nhom: 'f3', goiY: 'follow every artifact of LB-07 and see which other requirements point to it' },
    { moTa: { en: 'B — design elements to update', vi: 'B — phần tử thiết kế phải cập nhật' }, bieuThuc: '(IMPACT.design || []).map(String)', chap: [DAP_B.design], kieu: 'tap', nhom: 'f3' },
    { moTa: { en: 'B — code modules to change', vi: 'B — module mã phải sửa' }, bieuThuc: '(IMPACT.code || []).map(String)', chap: [DAP_B.code], kieu: 'tap', nhom: 'f3' },
    { moTa: { en: 'B — test cases to update or re-run', vi: 'B — test case phải sửa hoặc chạy lại' }, bieuThuc: '(IMPACT.tests || []).map(String)', chap: [DAP_B.tests], kieu: 'tap', nhom: 'f3', an: true },
    { moTa: { en: 'B — estimated effort of the change (hours)', vi: 'B — công ước lượng của thay đổi (giờ)' }, bieuThuc: 'IMPACT.hours', chap: [GIO], kieu: 'so', saiSo: 0, nhom: 'f3', an: true },
    { moTa: { en: 'C — % of active requirements verified', vi: 'C — % yêu cầu đang hiệu lực đã verified' }, bieuThuc: 'STATUS_REPORT.pctVerified', chap: [PCT_VERIFIED], kieu: 'so', saiSo: 0.06, nhom: 'f4', goiY: 'Deleted and Rejected requirements are not active' },
    { moTa: { en: 'C — % of active requirements implemented or verified', vi: 'C — % yêu cầu đang hiệu lực đã implemented hoặc verified' }, bieuThuc: 'STATUS_REPORT.pctImplementedOrVerified', chap: [PCT_DONE], kieu: 'so', saiSo: 0.06, nhom: 'f4' },
  ]),
  ...kiemBang('STATUS_EVENTS', Object.fromEntries(SU_KIEN.map((x) => [x[0], x[2]])), { nhom: 'f4', ten: (k) => `C — status after ${k}`, tenVi: (k) => `C — trạng thái sau ${k}`, an: ['E4'] }),
  ...kiemBang('POLICY', Object.fromEntries(CHINH_SACH.map((x) => [x[0], x[2]])), { nhom: 'f5', ten: (k) => `D — change control policy ${k}`, tenVi: (k) => `D — chính sách kiểm soát thay đổi ${k}` }),
  ...kiemBang('TRACE_DIRECTIONS', Object.fromEntries(VET.map((x) => [x[0], x[2]])), { nhom: 'f6', ten: (k) => `E — direction of ${k}`, tenVi: (k) => `E — hướng của ${k}` }),
  ...kiemKhoa([
    { moTa: { en: 'E — requirement with no downstream trace (a gap)', vi: 'E — yêu cầu không có liên kết xuống (lỗ hổng)' }, bieuThuc: '(ORPHANS.requirementsWithoutTests || []).map(String)', chap: [['LB-11']], kieu: 'tap', nhom: 'f6' },
    { moTa: { en: 'E — test with no requirement (an orphan)', vi: 'E — test không có yêu cầu (mồ côi)' }, bieuThuc: '(ORPHANS.testsWithoutRequirement || []).map(String)', chap: [['TC-28']], kieu: 'tap', nhom: 'f6' },
  ]),
];

const TEP = {
  'answers/a-cr-states.js': [`// A. Life of a change request (Mermaid stateDiagram-v2).\nconst CR_STATES = ´\nstateDiagram-v2\n  [*] --> Submitted\n  Submitted --> Closed : close\n  Closed --> [*]\n´;\n`, `// A. Wiegers Ch.28: Submitted → Evaluated → Approved/Rejected → Change Made → Verified → Closed, Canceled from the early states.\nconst CR_STATES = ´${GIAI_CR.replace(/\s+$/, '')}\n´;\n`],
  'answers/b-impact.js': [
    "// B. Impact analysis of CR-018 with the RTM; effort with the unit costs given.\nconst IMPACT = { modify: [], reverify: [], design: [], code: [], tests: [], hours: 0 };\n",
    `// B. LB-07 → D-LoanPolicy, LoanService, PolicyConfig, TC-22, TC-23. LB-09 shares D-LoanPolicy/LoanService/TC-23; LB-05 shares LoanService.\n// Tests of LB-05, LB-07, LB-09: TC-21..TC-24. Hours = 1×${CONG.requirement} + 1×${CONG.design} + 2×${CONG.code} + 4×${CONG.test} = ${GIO}.\nconst IMPACT = { modify: ['LB-07'], reverify: ['LB-05', 'LB-09'], design: ['D-LoanPolicy'], code: ['LoanService', 'PolicyConfig'], tests: ['TC-21', 'TC-22', 'TC-23', 'TC-24'], hours: ${GIO} };\n`,
  ],
  'answers/c-status.js': [
    `// C. Proposed | Approved | Implemented | Verified | Deleted | Rejected — percentages to 2 decimals.\nconst STATUS_REPORT = { pctVerified: 0, pctImplementedOrVerified: 0 };\n${objTrong('STATUS_EVENTS', Object.fromEntries(SU_KIEN.map((x) => [x[0], ''])))}`,
    `// C. Active = ${HOAT} (Deleted and Rejected excluded); verified 11 → ${PCT_VERIFIED.toFixed(2)}%; implemented + verified 23 → ${PCT_DONE.toFixed(2)}%.\nconst STATUS_REPORT = { pctVerified: ${PCT_VERIFIED.toFixed(2)}, pctImplementedOrVerified: ${PCT_DONE.toFixed(2)} };\n${objDong('STATUS_EVENTS', Object.fromEntries(SU_KIEN.map((x) => [x[0], x[2]])))}`,
  ],
  'answers/d-policy.js': [`// D. TRUE | FALSE\n${objTrong('POLICY', Object.fromEntries(CHINH_SACH.map((x) => [x[0], ''])))}`, `// D. Wiegers Ch.28 change control policy.\n${objDong('POLICY', Object.fromEntries(CHINH_SACH.map((x) => [x[0], x[2]])))}`],
  'answers/e-trace.js': [
    `// E. ${HUONG.join(' | ')}\n${objTrong('TRACE_DIRECTIONS', Object.fromEntries(VET.map((x) => [x[0], ''])))}const ORPHANS = { requirementsWithoutTests: [], testsWithoutRequirement: [] };\n`,
    `// E. Wiegers Fig. 29-1: forward to / backward from requirements (sources); forward from / backward to requirements (downstream).\n${objDong('TRACE_DIRECTIONS', Object.fromEntries(VET.map((x) => [x[0], x[2]])))}const ORPHANS = { requirementsWithoutTests: ['LB-11'], testsWithoutRequirement: ['TC-28'] };\n`,
  ],
};

export default deLon({
  slug: 'swr302-7-lab-change-control-libranet',
  ten: 'Lab 7 — Requirements Management: a Change Request in LibraNet',
  moTaModule: 'Lab chương 7: máy trạng thái Change Request (Submitted → Evaluated → Approved/Rejected → Change Made → Verified → Closed, Canceled), phân tích ảnh hưởng bằng RTM và ước lượng giờ công, trạng thái yêu cầu và tỉ lệ, chính sách kiểm soát thay đổi, bốn hướng truy vết và phần tử mồ côi.',
  baiHoc: 'swr302-7-1-change-control',
  tieuDe: 'Lab 7 — Requirements Management: a Change Request in LibraNet',
  phu: { en: 'Chapter 7 lab · change request lifecycle, impact analysis with the RTM, requirement status, change control policy, traceability · 10 marks', vi: 'Lab chương 7 · vòng đời change request, phân tích ảnh hưởng bằng RTM, trạng thái yêu cầu, chính sách kiểm soát thay đổi, truy vết · 10 điểm' },
  moTa: {
    en: `<p><b>LibraNet</b> runs the university library. Its SRS 1.0 is baselined and the CCB meets every Friday. The graduate school submits <b>CR-018</b>: "Postgraduate students get a 21-day loan period; undergraduates keep 14 days."</p>
<p><b>A.</b> Model the life of a change request, as described in Wiegers Ch.28.</p>
<p><b>B. The requirements traceability matrix</b>:</p>${bangHtml(['Req', 'Requirement', 'Design', 'Code', 'Tests'], RTM)}
<p>Unit effort: modify a requirement ${CONG.requirement} h · update a design element ${CONG.design} h · change a code module ${CONG.code} h · update or re-run a test case ${CONG.test} h.</p>
<p><b>C. Status of the 40 requirements today</b>: ${TT.map(([t, n]) => `${t} ${n}`).join(' · ')}. Events:</p><ul>${SU_KIEN.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>D. Draft change control policy</b> — keep or reject each statement:</p><ul>${CHINH_SACH.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>E. Trace links used this week</b>:</p><ul>${VET.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`,
    vi: `<p><b>LibraNet</b> vận hành thư viện trường. SRS 1.0 đã baseline và CCB họp mỗi thứ Sáu. Phòng sau đại học gửi <b>CR-018</b>: "Học viên sau đại học được mượn 21 ngày; sinh viên đại học giữ 14 ngày."</p>
<p><b>A.</b> Mô hình hoá đời sống một change request theo Wiegers Ch.28. <b>B.</b> Dùng RTM (bảng ở bản tiếng Anh) phân tích ảnh hưởng của CR-018 và ước lượng giờ công. <b>C.</b> Trạng thái 40 yêu cầu và sáu sự kiện E1–E6. <b>D.</b> Sáu phát biểu chính sách P1–P6: đúng hay sai? <b>E.</b> Bốn liên kết truy vết T1–T4: hướng nào? Yêu cầu không có test, test không có yêu cầu.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Change request state machine.', vi: 'A. Máy trạng thái change request.' },
    { en: 'B. Impact analysis of CR-018 and its effort.', vi: 'B. Phân tích ảnh hưởng CR-018 và công.' },
    { en: 'C. Requirement status and status metrics.', vi: 'C. Trạng thái yêu cầu và số đo.' },
    { en: 'D. Change control policy.', vi: 'D. Chính sách kiểm soát thay đổi.' },
    { en: 'E. Traceability directions and orphans.', vi: 'E. Hướng truy vết và phần tử mồ côi.' },
  ],
  yeuCauChung: [{ en: 'Use the IDs of the matrix exactly (LB-07, D-LoanPolicy, LoanService, TC-22…).', vi: 'Dùng đúng mã trong ma trận (LB-07, D-LoanPolicy, LoanService, TC-22…).' }],
  cayThuMuc: `answers/
├── a-cr-states.js   ← const CR_STATES = ´stateDiagram-v2 …´
├── b-impact.js      ← const IMPACT = { modify, reverify, design, code, tests, hours }
├── c-status.js      ← const STATUS_REPORT = { pctVerified, pctImplementedOrVerified }; const STATUS_EVENTS = { E1: '…' }
├── d-policy.js      ← const POLICY = { P1: 'TRUE' | 'FALSE', … }
└── e-trace.js       ← const TRACE_DIRECTIONS = { T1: '…' }; const ORPHANS = { requirementsWithoutTests, testsWithoutRequirement }`,
  moHinh: {
    ten: 'Answer records',
    truong: [
      ['CR_STATES', 'string', CU_PHAP.state],
      ['IMPACT', 'object', { en: 'arrays of IDs + hours (number)', vi: 'mảng mã + số giờ' }],
      ['STATUS_EVENTS.*', 'string', { en: 'Proposed · Approved · Implemented · Verified · Deleted · Rejected', vi: 'Proposed · Approved · Implemented · Verified · Deleted · Rejected' }],
      ['TRACE_DIRECTIONS.*', 'string', { en: HUONG.join(' · '), vi: HUONG.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1. State machine notation', vi: 'A1. Ký pháp máy trạng thái' }, diem: 1, moTa: CU_PHAP.state, yeuCau: [{ en: 'Initial/final, labelled transitions, reachable states, conditions as states.', vi: 'Đầu/cuối, chuyển có nhãn, trạng thái tới được, tình trạng làm trạng thái.' }], hook: ['state-transition diagram'] },
    { ten: { en: 'A2. Change request lifecycle', vi: 'A2. Vòng đời change request' }, diem: 2, yeuCau: [{ en: 'The states and transitions of Wiegers Ch.28; the CCB decision as guarded transitions.', vi: 'Trạng thái và chuyển của Wiegers Ch.28; quyết định của CCB là chuyển có guard.' }], hook: ['CCB'] },
    { ten: { en: 'B. Impact analysis', vi: 'B. Phân tích ảnh hưởng' }, diem: 3, yeuCau: [{ en: 'Everything the change touches, found through the RTM, and its effort.', vi: 'Mọi thứ thay đổi chạm tới, tìm qua RTM, và công.' }], hook: ['impact analysis', 'RTM'] },
    { ten: { en: 'C. Requirement status', vi: 'C. Trạng thái yêu cầu' }, diem: 1.5, yeuCau: [{ en: 'Status values and status metrics over the active requirements.', vi: 'Giá trị trạng thái và số đo trên yêu cầu đang hiệu lực.' }], hook: ['requirement attributes'] },
    { ten: { en: 'D. Change control policy', vi: 'D. Chính sách kiểm soát thay đổi' }, diem: 1, yeuCau: [{ en: 'Which statements belong in the policy.', vi: 'Phát biểu nào thuộc chính sách.' }], hook: ['change control'] },
    { ten: { en: 'E. Traceability', vi: 'E. Truy vết' }, diem: 1.5, yeuCau: [{ en: 'Four directions; gaps and orphans.', vi: 'Bốn hướng; lỗ hổng và mồ côi.' }], hook: ['traceability'] },
  ],
  idBatBuoc: [['CR_STATES', 'answers/a-cr-states.js'], ['IMPACT', 'answers/b-impact.js'], ['STATUS_REPORT · STATUS_EVENTS', 'answers/c-status.js'], ['POLICY', 'answers/d-policy.js'], ['TRACE_DIRECTIONS · ORPHANS', 'answers/e-trace.js']],
  truDiem: [
    { en: 'Impact limited to LB-07: LB-09 renews "one loan period" and LB-05 shares LoanService — both must be re-verified.', vi: 'Chỉ coi LB-07 bị ảnh hưởng: LB-09 gia hạn "một kỳ mượn" và LB-05 dùng chung LoanService — cả hai phải kiểm lại.' },
    { en: 'Counting Deleted and Rejected requirements in the percentages.', vi: 'Tính cả yêu cầu Deleted và Rejected vào tỉ lệ.' },
    { en: 'A CR lifecycle without Rejected or Canceled — only the happy path.', vi: 'Vòng đời CR không có Rejected hay Canceled — chỉ đường thuận.' },
  ],
  goiY: [
    'B: đi theo hàng LB-07 lấy mọi thiết kế/mã/test của nó, rồi hỏi "yêu cầu nào KHÁC cũng trỏ tới các thứ đó?".',
    `C: hiệu lực = Proposed + Approved + Implemented + Verified = ${HOAT}.`,
    'E: "forward/backward" nhìn theo chiều mũi tên; "to/from requirements" cho biết yêu cầu là đích hay là gốc.',
  ],
  loiHayGap: [
    'Quên PolicyConfig khi sửa mã — LB-07 trỏ tới hai module.',
    'Nhầm Deleted (đã duyệt rồi bị bỏ) với Rejected (CCB không duyệt).',
    'Coi TC-28 là lỗi của test — nó có thể là một yêu cầu bị quên viết; truy vết ngược để hỏi.',
  ],
  giaiThich: {
    en: `<p><b>A.</b> Wiegers' change request states with the CCB decision as two guarded transitions out of Evaluated, and Canceled reachable while the change has not been made. <b>B.</b> Modify LB-07; re-verify LB-05 and LB-09; update D-LoanPolicy; change LoanService and PolicyConfig; update or re-run TC-21…TC-24; ${GIO} hours. <b>C.</b> ${PCT_VERIFIED.toFixed(2)}% verified, ${PCT_DONE.toFixed(2)}% implemented or verified (over ${HOAT} active). <b>D.</b> P1, P4, P6 true; P2, P3, P5 false. <b>E.</b> T1 forward from · T2 backward to · T3 forward to · T4 backward from; LB-11 has no downstream trace, TC-28 traces to nothing.</p>${khoiThamChieu('state', GIAI_CR, 'Change request lifecycle (Wiegers Ch.28)', { __dau: [60, 90], Submitted: [190, 200], Canceled: [190, 400], Evaluated: [420, 200], Rejected: [420, 400], Approved: [640, 200], ChangeMade: [860, 200], Verified: [860, 400], Closed: [640, 400] })}`,
    vi: `<p><b>A.</b> Các trạng thái change request của Wiegers, quyết định của CCB là hai chuyển có guard rời Evaluated, Canceled tới được khi thay đổi chưa được làm. <b>B.</b> Sửa LB-07; kiểm lại LB-05 và LB-09; cập nhật D-LoanPolicy; sửa LoanService và PolicyConfig; sửa hoặc chạy lại TC-21…TC-24; ${GIO} giờ. <b>C.</b> ${PCT_VERIFIED.toFixed(2)}% verified, ${PCT_DONE.toFixed(2)}% implemented hoặc verified (trên ${HOAT} yêu cầu hiệu lực). <b>D.</b> P1, P4, P6 đúng; P2, P3, P5 sai. <b>E.</b> T1 forward from · T2 backward to · T3 forward to · T4 backward from; LB-11 không có liên kết xuống, TC-28 không truy về đâu.</p>${khoiThamChieu('state', GIAI_CR, 'Change request lifecycle (Wiegers Ch.28)', { __dau: [60, 90], Submitted: [190, 200], Canceled: [190, 400], Evaluated: [420, 200], Rejected: [420, 400], Approved: [640, 200], ChangeMade: [860, 200], Verified: [860, 400], Closed: [640, 400] })}`,
  },
  khaiNiem: ['change control', 'CCB', 'impact analysis', 'requirement status', 'traceability'],
  tienQuyet: ['SWR302 lessons 7.1–7.8 (requirements management)'],
  thuatNgu: [...tn('baseline', 'ccb', 'impactAnalysis', 'rtm'), { en: 'orphan', vi: 'phần tử mồ côi — test/mã không truy về yêu cầu nào' }, { en: 'forward / backward traceability', vi: 'truy vết xuôi (từ yêu cầu xuống) / ngược (từ dưới lên yêu cầu)' }],
  moTaNgan: 'Lab chương 7: LibraNet — vòng đời CR, phân tích ảnh hưởng, trạng thái, chính sách, truy vết.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'ảnh hưởng chỉ LB-07, tính tỉ lệ trên 40', tep: { 'answers/b-impact.js': "const IMPACT = { modify: ['LB-07'], reverify: [], design: ['D-LoanPolicy'], code: ['LoanService'], tests: ['TC-22'], hours: 10 };\n", 'answers/c-status.js': `const STATUS_REPORT = { pctVerified: 27.5, pctImplementedOrVerified: 57.5 };\n${objDong('STATUS_EVENTS', Object.fromEntries(SU_KIEN.map((x) => [x[0], x[2]])))}` }, phaiTruot: ['other requirements to re-verify', 'code modules to change', '% of active requirements verified'] },
    { ten: 'vòng đời CR chỉ đường thuận', tep: { 'answers/a-cr-states.js': 'const CR_STATES = `\nstateDiagram-v2\n  [*] --> Submitted\n  Submitted --> Approved : approve\n  Approved --> Closed : implement\n  Closed --> [*]\n`;\n' }, phaiTruot: ['key states of the case', 'evaluated → rejected'] },
  ],
});
