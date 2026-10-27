/**
 * SWT301 · LAB CHƯƠNG 1 — Hồ sơ kiểm thử bản phát hành LabBook 1.4: A. phân tích sự cố (chuỗi lỗi) · B. việc → hoạt động
 * quy trình · C. ma trận truy vết, độ phủ, quyết định tiêu chí ra · D. nguyên tắc + đạo đức.
 */
import { doiDau, KHOA, kiemKhoa, bangHtml, NOP_BAI, tn } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

const SU_CO = [
  'The SRS v2 says a student may cancel free of charge until 2 hours before the start.',
  'The project wiki still linked SRS v1, and nobody was responsible for document versions.',
  'The developer implemented the 24-hour rule of SRS v1.',
  'CancelService contains: if (hoursBefore < 24) return TOO_LATE;',
  'Students cancelling 3 hours before the start receive 409 TOO_LATE.',
  'Seats stay blocked, 12 students on the waiting list cannot attend, and the lab is half empty on Friday.',
  'The test team found the problem in system testing on Thursday.',
];

const HD = ['Test planning', 'Test monitoring and control', 'Test analysis', 'Test design', 'Test implementation', 'Test execution', 'Test completion'];
const VIEC = [
  ['T1', 'Write the exit criteria of release 1.4: 100% of high-risk requirements covered, no open Critical defect', 0],
  ['T2', 'Review the cancellation user story and raise that “free of charge” is undefined for PENDING bookings', 2],
  ['T3', 'Define the test conditions “cancel ≥ 2 h before”, “cancel < 2 h before”, “cancel another student’s booking”', 2],
  ['T4', 'Apply boundary value analysis to the 2-hour rule: 1 h 59 min and 2 h 00 min', 3],
  ['T5', 'Order the Postman requests into a collection and create the accounts student1–3 in the test database', 4],
  ['T6', 'Run a smoke check that the test server and seed data are ready before the test cycle starts', 4],
  ['T7', 'Run the collection on build 1.4.0 and record pass/fail for each test case', 5],
  ['T8', 'Log defect DEF-31 with steps, expected and actual result', 5],
  ['T9', 'On Wednesday, notice that 62% of the tests are executed against 80% planned and move a tester to cancellation', 1],
  ['T10', 'After the release, archive the collection and test data and hold a lessons-learned meeting', 6],
  ['T11', 'Re-run the failed cancellation test on build 1.4.1', 5],
  ['T12', 'Identify the test data needed: a booking that starts exactly 2 hours after “now”', 3],
];

const REQ = [['R1', 'Log in', 'High'], ['R2', 'List labs', 'Low'], ['R3', 'Book a seat', 'High'], ['R4', 'Weekly limit (6 h)', 'High'], ['R5', 'Cancel a booking', 'High'], ['R6', 'Waiting-list promotion', 'High'], ['R7', 'Close a lab', 'Low'], ['R8', 'Admin usage report', 'Low']];
const MATRIX = { TC01: ['R1'], TC02: ['R1'], TC03: ['R2'], TC04: ['R3'], TC05: ['R3', 'R4'], TC06: ['R4'], TC07: ['R5'], TC08: ['R5', 'R6'], TC09: ['R7'], TC10: ['R3', 'R5'], TC11: ['R6'], TC12: ['R2', 'R7'] };
const RUN = { TC01: 'PASS', TC02: 'PASS', TC03: 'PASS', TC04: 'FAIL', TC05: 'PASS', TC06: 'PASS', TC07: 'FAIL', TC09: 'PASS', TC10: 'PASS' };
const LOI = [['DEF-29', 'Critical', 'Closed', 'TC04'], ['DEF-30', 'Major', 'Open', 'TC04'], ['DEF-31', 'Critical', 'Open', 'TC07']];

const NT = ['PRESENCE', 'EXHAUSTIVE', 'EARLY', 'CLUSTERING', 'PESTICIDE', 'CONTEXT', 'ABSENCE_OF_ERRORS'];
const DD = ['PUBLIC', 'CLIENT_AND_EMPLOYER', 'PRODUCT', 'JUDGMENT', 'MANAGEMENT', 'PROFESSION', 'COLLEAGUES', 'SELF'];

const KIEM = [
  ...kiemKhoa([
    ['rootCause', ['2']], ['error', ['3']], ['defect', ['4']], ['failure', ['5']], ['effect', ['6']], ['context', ['1', '7']],
  ].map(([k, v]) => ({ moTa: { en: `A — INCIDENT.${k}`, vi: `A — INCIDENT.${k}` }, bieuThuc: `(INCIDENT.${k} || []).map(String)`, chap: [v], kieu: 'tap', nhom: 'f1' }))),
  ...kiemKhoa(VIEC.map(([ma, , i]) => ({ moTa: { en: `B — activity of ${ma}`, vi: `B — hoạt động của ${ma}` }, bieuThuc: `TASKS.${ma}`, chap: [HD[i]], nhom: 'f2', ...(['T6', 'T11', 'T12'].includes(ma) ? { an: true } : {}) }))),
  ...kiemKhoa([
    { moTa: { en: 'C — requirement coverage by executed tests (%)', vi: 'C — độ phủ yêu cầu theo test đã chạy (%)' }, bieuThuc: 'TRACE.reqCoverage', chap: [75], kieu: 'so', saiSo: 0.006, nhom: 'f3', goiY: 'only test cases that were RUN count' },
    { moTa: { en: 'C — coverage of high-risk requirements (%)', vi: 'C — độ phủ yêu cầu rủi ro cao (%)' }, bieuThuc: 'TRACE.highRiskCoverage', chap: [80], kieu: 'so', saiSo: 0.006, nhom: 'f3' },
    { moTa: { en: 'C — requirements with no test case at all', vi: 'C — yêu cầu không có test case nào' }, bieuThuc: '(TRACE.untested || []).map(String)', chap: [['R8']], kieu: 'tap', nhom: 'f3' },
    { moTa: { en: 'C — test cases to re-run when R5 changes', vi: 'C — test case phải chạy lại khi R5 đổi' }, bieuThuc: '(TRACE.rerunForR5 || []).map(String)', chap: [['TC07', 'TC08', 'TC10']], kieu: 'tap', nhom: 'f3' },
    { moTa: { en: 'C — pass rate of executed tests (%)', vi: 'C — tỉ lệ đạt của test đã chạy (%)' }, bieuThuc: 'TRACE.passRate', chap: [77.78], kieu: 'so', saiSo: 0.006, nhom: 'f3' },
    { moTa: { en: 'C — release decision', vi: 'C — quyết định phát hành' }, bieuThuc: 'TRACE.decision', chap: ['NO-GO'], nhom: 'f3' },
    { moTa: { en: 'C — exit criteria that are not met', vi: 'C — tiêu chí ra chưa đạt' }, bieuThuc: '(TRACE.failedCriteria || []).map(String)', chap: [['HIGH_RISK_COVERAGE', 'OPEN_CRITICAL']], kieu: 'tap', nhom: 'f3', an: true },
  ]),
  ...kiemKhoa([
    ['S1', 'EXHAUSTIVE'], ['S2', 'CLUSTERING'], ['S3', 'PESTICIDE'], ['S4', 'PRESENCE'],
  ].map(([k, v]) => ({ moTa: { en: `D — principle of ${k}`, vi: `D — nguyên tắc của ${k}` }, bieuThuc: `PRINCIPLES.${k}`, chap: [v], nhom: 'f4' }))),
  ...kiemKhoa([
    ['E1', 'JUDGMENT'], ['E2', 'COLLEAGUES'],
  ].map(([k, v]) => ({ moTa: { en: `D — ethics principle of ${k}`, vi: `D — nguyên tắc đạo đức của ${k}` }, bieuThuc: `ETHICS.${k}`, chap: [v], nhom: 'f4' }))),
];

const BANG_REQ = bangHtml(['Req', 'Name', 'Risk'], REQ);
const BANG_TC = bangHtml(['Test case', 'Requirements', 'Result on 1.4.0'], Object.entries(MATRIX).map(([tc, r]) => [tc, r.join(', '), RUN[tc] || '<i>not run</i>']));
const BANG_LOI = bangHtml(['Defect', 'Severity', 'Status', 'Found by'], LOI);

const BAN_IN = {
  tieuDe: 'Lab 1 — Fundamentals of Testing: the Test File of LabBook 1.4',
  phu: { en: 'Chapter 1 lab · incident analysis, test process, traceability and exit criteria, principles and ethics · 10 marks', vi: 'Lab chương 1 · phân tích sự cố, quy trình test, truy vết và tiêu chí ra, nguyên tắc và đạo đức · 10 điểm' },
  moTa: {
    en: `<p>You are the tester of <b>LabBook release 1.4</b> (booking university lab seats). The test lead hands you the release file and asks four things before the go/no-go meeting.</p>
<p><b>A. Incident from release 1.3</b> — sentences numbered 1–${SU_CO.length}:</p><ol>${SU_CO.map((s) => `<li>${s}</li>`).join('')}</ol>
<p><b>B. Tasks of the 1.4 test cycle:</b></p><ul>${VIEC.map(([m, t]) => `<li><b>${m}</b> — ${t}</li>`).join('')}</ul>
<p><b>C. Requirements, traceability and results of build 1.4.0</b></p>${BANG_REQ}${BANG_TC}${BANG_LOI}
<p>Exit criteria (from T1): <b>100% of high-risk requirements covered by executed tests</b> and <b>no open Critical defect</b>. Requirement coverage counts a requirement when at least one <i>executed</i> test case (pass or fail) is linked to it.</p>
<p><b>D. Statements heard in the meeting</b></p><ul>
<li><b>S1</b> — “Before release, let’s test every combination of lab, date, start hour and duration.”</li>
<li><b>S2</b> — “Half of all open defects of the last three releases are in cancellation and waiting-list code, so we plan extra exploratory sessions there.”</li>
<li><b>S3</b> — “The 2025 regression suite still passes every night, yet students found three new bugs in the QR check-in.”</li>
<li><b>S4</b> — “All 9 executed tests on 1.4.1 passed, so the release has no defects.”</li>
<li><b>E1</b> — A vendor offers the tester a free laptop while she is evaluating the vendor’s test tool for the university.</li>
<li><b>E2</b> — A senior tester spends an afternoon showing the developers how to write boundary tests.</li></ul>`,
    vi: `<p>Bạn là tester của <b>LabBook bản 1.4</b> (đặt chỗ phòng lab). Trưởng nhóm test giao hồ sơ bản phát hành và hỏi bốn việc trước buổi họp go/no-go.</p>
<p><b>A. Sự cố của bản 1.3</b> — các câu đánh số 1–${SU_CO.length} (bản tiếng Anh ở trên): SRS v2 cho huỷ miễn phí tới 2 giờ trước giờ bắt đầu · wiki vẫn trỏ SRS v1, không ai phụ trách phiên bản tài liệu · developer cài luật 24 giờ của SRS v1 · CancelService chứa <code>if (hoursBefore &lt; 24) return TOO_LATE;</code> · sinh viên huỷ trước 3 giờ nhận 409 TOO_LATE · chỗ bị giữ, 12 sinh viên chờ không được học, phòng trống một nửa · nhóm test phát hiện ở system test thứ Năm.</p>
<p><b>B. Các việc của chu kỳ test 1.4</b> — xem danh sách T1–T12 ở trên (phạm vi + tiêu chí ra; review user story; điều kiện test; BVA; sắp collection + tạo tài khoản; smoke môi trường; chạy; ghi lỗi; theo dõi tiến độ; lưu trữ + bài học; chạy lại; xác định dữ liệu test).</p>
<p><b>C.</b> Bảng yêu cầu, ma trận truy vết, kết quả build 1.4.0 và danh sách lỗi ở trên. Tiêu chí ra: <b>phủ 100% yêu cầu rủi ro cao bằng test đã chạy</b> và <b>không còn lỗi Critical mở</b>. Một yêu cầu được tính là phủ khi có ít nhất một test case <i>đã chạy</i> (đạt hay trượt) nối với nó.</p>
<p><b>D.</b> Bốn câu S1–S4 (nguyên tắc) và hai tình huống E1–E2 (đạo đức) ở trên.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Place every sentence of the incident in the chain root cause → error → defect → failure → effect (or context).', vi: 'A. Xếp mỗi câu của sự cố vào chuỗi nguyên nhân gốc → error → defect → failure → effect (hoặc bối cảnh).' },
    { en: 'B. Name the test activity of each task T1–T12.', vi: 'B. Gọi tên hoạt động kiểm thử của mỗi việc T1–T12.' },
    { en: 'C. Coverage, gaps, impact analysis, pass rate and the go/no-go decision.', vi: 'C. Độ phủ, chỗ trống, phân tích ảnh hưởng, tỉ lệ đạt và quyết định go/no-go.' },
    { en: 'D. The principle behind S1–S4 and the ethics principle of E1–E2.', vi: 'D. Nguyên tắc đằng sau S1–S4 và nguyên tắc đạo đức của E1–E2.' },
  ],
  yeuCauChung: [{ en: 'Use exactly the allowed values listed in the data model (spelling matters, case does not).', vi: 'Dùng đúng giá trị cho phép trong mô hình dữ liệu (đúng chính tả, không phân biệt hoa thường).' }],
  cayThuMuc: `answers/
├── a-incident.js   ← const INCIDENT = { rootCause, error, defect, failure, effect, context }   (arrays of sentence numbers)
├── b-tasks.js      ← const TASKS = { T1: 'Test planning', … }
├── c-trace.js      ← const TRACE = { reqCoverage, highRiskCoverage, untested, rerunForR5, passRate, decision, failedCriteria }
└── d-principles.js ← const PRINCIPLES = { S1..S4 }; const ETHICS = { E1, E2 }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['TASKS.*', 'string', { en: HD.join(' · '), vi: HD.join(' · ') }],
      ['TRACE.decision · failedCriteria', 'string · string[]', { en: "'GO' | 'NO-GO' · 'HIGH_RISK_COVERAGE' | 'OPEN_CRITICAL'; percentages rounded to 2 decimals", vi: "'GO' | 'NO-GO' · 'HIGH_RISK_COVERAGE' | 'OPEN_CRITICAL'; phần trăm làm tròn 2 chữ số" }],
      ['PRINCIPLES.*', 'string', { en: NT.join(' · '), vi: NT.join(' · ') }],
      ['ETHICS.*', 'string', { en: DD.join(' · '), vi: DD.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Incident analysis', vi: 'A. Phân tích sự cố' }, diem: 2, yeuCau: [{ en: 'Every sentence in exactly one place of the chain.', vi: 'Mỗi câu đúng một vị trí trong chuỗi.' }], hook: ['error-defect-failure'] },
    { ten: { en: 'B. Test process', vi: 'B. Quy trình kiểm thử' }, diem: 3, yeuCau: [{ en: 'Activity of each of the 12 tasks (CTFL 2018 names).', vi: 'Hoạt động của từng việc trong 12 việc (tên theo CTFL 2018).' }], hook: ['test activities'] },
    { ten: { en: 'C. Traceability and exit criteria', vi: 'C. Truy vết và tiêu chí ra' }, diem: 3, yeuCau: [{ en: 'Coverage figures, the untested requirement, the impact of a change to R5, the pass rate and the decision with the failed criteria.', vi: 'Các số độ phủ, yêu cầu chưa có test, ảnh hưởng khi R5 đổi, tỉ lệ đạt và quyết định kèm tiêu chí chưa đạt.' }], hook: ['traceability', 'exit criteria'] },
    { ten: { en: 'D. Principles and ethics', vi: 'D. Nguyên tắc và đạo đức' }, diem: 2, yeuCau: [{ en: 'One principle per statement, one ethics principle per situation.', vi: 'Mỗi câu một nguyên tắc, mỗi tình huống một nguyên tắc đạo đức.' }], hook: ['seven principles', 'code of ethics'] },
  ],
  idBatBuoc: [['INCIDENT', 'answers/a-incident.js'], ['TASKS', 'answers/b-tasks.js'], ['TRACE', 'answers/c-trace.js'], ['PRINCIPLES · ETHICS', 'answers/d-principles.js']],
  truDiem: [
    { en: 'Counting all 12 test cases for coverage (87.5%) instead of the executed ones.', vi: 'Tính độ phủ trên cả 12 test case (87,5%) thay vì test đã chạy.' },
    { en: 'Answering GO because 77.78% of the executed tests pass — the pass rate is not an exit criterion here.', vi: 'Trả lời GO vì 77,78% test đã chạy đạt — tỉ lệ đạt không phải tiêu chí ra ở đây.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI = {
  'answers/a-incident.js': `// Chain: root cause 2 (no owner of document versions) → error 3 (implementing the old rule)
// → defect 4 (the wrong condition in the code) → failure 5 (409 at run time) → effect 6 (blocked seats).
const INCIDENT = {
  rootCause: [2],
  error: [3],
  defect: [4],
  failure: [5],
  effect: [6],
  context: [1, 7],
};
`,
  'answers/b-tasks.js': `const TASKS = {
${VIEC.map(([m, , i]) => `  ${m}: '${HD[i]}',`).join('\n')}
};
`,
  'answers/c-trace.js': `// Executed: TC01–TC07, TC09, TC10 (TC08, TC11, TC12 not run).
// Requirements touched by executed tests: R1 R2 R3 R4 R5 R7 → 6/8 = 75%.
// High risk: R1 R3 R4 R5 R6 → R6 is only linked to TC08/TC11 (not run) → 4/5 = 80%.
// R8 has no test case. R5 is linked to TC07, TC08, TC10. Pass rate 7/9 = 77.78%.
// Exit: high-risk coverage 80% < 100% and DEF-31 (Critical) is open → NO-GO.
const TRACE = {
  reqCoverage: 75,
  highRiskCoverage: 80,
  untested: ['R8'],
  rerunForR5: ['TC07', 'TC08', 'TC10'],
  passRate: 77.78,
  decision: 'NO-GO',
  failedCriteria: ['HIGH_RISK_COVERAGE', 'OPEN_CRITICAL'],
};
`,
  'answers/d-principles.js': `const PRINCIPLES = {
  S1: 'EXHAUSTIVE',  // every combination: exhaustive testing is impossible
  S2: 'CLUSTERING',  // defects cluster together
  S3: 'PESTICIDE',   // the same old tests stop finding new defects
  S4: 'PRESENCE',    // testing shows presence, not absence, of defects
};
const ETHICS = {
  E1: 'JUDGMENT',    // integrity and independence: decline gifts from a vendor under evaluation
  E2: 'COLLEAGUES',  // fair and supportive, promote cooperation with developers
};
`,
};

export default doiDau({
  slug: 'swt301-1-lab-fundamentals-release-file',
  ten: 'Lab 1 — Fundamentals: the Test File of LabBook 1.4',
  moTaModule: 'Lab chương 1: phân tích sự cố theo chuỗi lỗi, gọi tên hoạt động của 12 việc trong chu kỳ test, tính độ phủ yêu cầu/rủi ro cao từ ma trận truy vết, phân tích ảnh hưởng, quyết định go/no-go theo tiêu chí ra, nguyên tắc và đạo đức.',
  khoa: KHOA,
  baiHoc: 'swt301-test-process',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 1 — Fundamentals of Testing: the Test File of LabBook 1.4',
    doKho: 'HARD', phut: 60, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'sentence 4: CancelService contains if (hoursBefore < 24) return TOO_LATE;', output: 'defect', explanation: 'An imperfection in a work product (the code).|||Khiếm khuyết trong sản phẩm (mã).' }],
    khaiNiem: ['error defect failure', 'test process', 'traceability', 'exit criteria', 'seven principles', 'code of ethics'],
    tienQuyet: ['SWT301 chapter 1'],
    the: ['swt301', 'lab', 'fundamentals'],
    banIn: BAN_IN,
    thuatNgu: [...tn('error', 'defect', 'failure', 'rootCause'), { en: 'exit criteria', vi: 'tiêu chí ra' }, { en: 'go/no-go', vi: 'quyết định phát hành hay không' }, { en: 'traceability matrix', vi: 'ma trận truy vết' }, { en: 'pass rate', vi: 'tỉ lệ đạt' }],
    goiY: [
      'A: câu nào là HÀNH ĐỘNG của người (error), câu nào là thứ NẰM TRONG mã (defect), câu nào xảy ra KHI CHẠY (failure)?',
      'B: xác định dữ liệu test = design; tạo dữ liệu/kiểm môi trường sẵn sàng = implementation; chạy lại = execution.',
      'C: chỉ test ĐÃ CHẠY mới tính độ phủ; R6 chỉ nối với TC08 và TC11 (chưa chạy).',
    ],
    loiHayGap: ['Tính độ phủ trên mọi test case.', 'Cho rằng tỉ lệ đạt 77,78% quyết định go/no-go.', 'Xếp T9 vào planning — theo dõi và điều chỉnh là monitoring & control.'],
    moTaNgan: 'Lab chương 1: hồ sơ test bản LabBook 1.4.',
    giaiThich: {
      en: '<p><b>A.</b> root cause 2 · error 3 · defect 4 · failure 5 · effect 6 · context 1, 7. <b>B.</b> T1 planning · T2, T3 analysis · T4, T12 design · T5, T6 implementation · T7, T8, T11 execution · T9 monitoring & control · T10 completion. <b>C.</b> 75% · 80% · R8 · TC07/TC08/TC10 · 77.78% · NO-GO (high-risk coverage, open Critical). <b>D.</b> EXHAUSTIVE · CLUSTERING · PESTICIDE · PRESENCE · JUDGMENT · COLLEAGUES.</p>',
      vi: '<p><b>A.</b> gốc 2 · error 3 · defect 4 · failure 5 · effect 6 · bối cảnh 1, 7. <b>B.</b> T1 lập kế hoạch · T2, T3 phân tích · T4, T12 thiết kế · T5, T6 triển khai · T7, T8, T11 thực thi · T9 giám sát & kiểm soát · T10 hoàn tất. <b>C.</b> 75% · 80% · R8 · TC07/TC08/TC10 · 77,78% · NO-GO. <b>D.</b> như trên.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(GIAI), kiem: KIEM },
    khoiDau: {
      'answers/a-incident.js': 'const INCIDENT = {\n  rootCause: [],\n  error: [],\n  defect: [],\n  failure: [5],\n  effect: [],\n  context: [],\n};\n',
      'answers/b-tasks.js': `// ${HD.join(' | ')}\nconst TASKS = {\n  T1: 'Test planning',\n${VIEC.slice(1).map(([m]) => `  ${m}: '',`).join('\n')}\n};\n`,
      'answers/c-trace.js': "const TRACE = {\n  reqCoverage: 0,\n  highRiskCoverage: 0,\n  untested: [],\n  rerunForR5: [],\n  passRate: 0,\n  decision: '',\n  failedCriteria: [],\n};\n",
      'answers/d-principles.js': `// ${NT.join(' | ')}\nconst PRINCIPLES = { S1: '', S2: '', S3: '', S4: '' };\n// ${DD.join(' | ')}\nconst ETHICS = { E1: '', E2: '' };\n`,
    },
    loiGiai: GIAI,
    boYeu: [
      { ten: 'độ phủ trên mọi test case', tep: { 'answers/c-trace.js': GIAI['answers/c-trace.js'].replace('reqCoverage: 75', 'reqCoverage: 87.5').replace('highRiskCoverage: 80', 'highRiskCoverage: 100').replace("failedCriteria: ['HIGH_RISK_COVERAGE', 'OPEN_CRITICAL']", "failedCriteria: ['OPEN_CRITICAL']") }, phaiTruot: ['C — requirement coverage', 'C — coverage of high-risk'] },
      { ten: 'nhầm chuẩn bị với chạy', tep: { 'answers/b-tasks.js': GIAI['answers/b-tasks.js'].replace("T6: 'Test implementation'", "T6: 'Test execution'") }, phaiTruot: ['B — activity of T6'] },
    ],
  }],
});
