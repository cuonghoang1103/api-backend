/**
 * SWT301 · 1.4 — The test process (SWT1 slide 73–98, LO-1.4.1–1.4.4): 7 activity groups, tasks, work products, traceability.
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const HD = ['Test planning', 'Test monitoring and control', 'Test analysis', 'Test design', 'Test implementation', 'Test execution', 'Test completion'];

const E1 = tinhDe({
  tieuDe: 'Test process 1 — Put the seven activity groups in order',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>SWT1 slide 77 shows the seven activity groups on one arrow. Put them in order. (In practice they overlap and iterate, and monitoring & control runs during the whole project — but the exam asks for this order.)</p>', vi: '<p>Slide SWT1 77 vẽ bảy nhóm hoạt động trên một mũi tên. Sắp chúng theo thứ tự. (Thực tế chúng chồng lấn, lặp lại, và giám sát & kiểm soát chạy suốt dự án — nhưng đề thi hỏi thứ tự này.)</p>' },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('The test process — first to last', 'Quy trình kiểm thử — từ đầu tới cuối'), muc: lc(['e', HD[4]], ['c', HD[2]], ['g', HD[6]], ['a', HD[0]], ['f', HD[5]], ['b', HD[1]], ['d', HD[3]]), dapAn: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], giaiThich: giai('Planning → Monitoring & control → Analysis (what) → Design (how) → Implementation (ready?) → Execution (run) → Completion (learn, hand over).', 'Lập kế hoạch → Giám sát & kiểm soát → Phân tích (test gì) → Thiết kế (test thế nào) → Triển khai (sẵn sàng?) → Thực thi (chạy) → Hoàn tất (rút kinh nghiệm, bàn giao).') }],
  goiY: ['Analysis trả lời “test CÁI GÌ”, design trả lời “test THẾ NÀO”.', 'Implementation = chuẩn bị mọi thứ để chạy; execution = chạy.'],
  loiHayGap: ['Đặt design trước analysis.', 'Nhầm implementation (chuẩn bị) với execution (chạy).'],
  giaiThich: '<p>a → b → c → d → e → f → g.</p>',
  thuatNgu: [{ en: 'test activity', vi: 'hoạt động kiểm thử' }],
  khaiNiem: ['test process'],
});

const E2 = tinhDe({
  tieuDe: 'Test process 2 — In which activity does each task happen?',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>The exam’s favourite question shape: “task X belongs to which activity?”. Map each LabBook task to its activity group (CTFL 2018).</p>', vi: '<p>Dạng câu đề thích nhất: “việc X thuộc hoạt động nào?”. Ghép mỗi việc của LabBook với nhóm hoạt động của nó (CTFL 2018).</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Task → activity', 'Việc → hoạt động'),
    cot: [{ ma: 't', ten: 'Task' }, { ma: 'h', ten: 'Activity', luaChon: HD }],
    hang: [
      'Decide that booking and cancellation are in scope and the admin report is not; set the exit criteria',
      'Compare the number of executed tests with the plan every Friday and move a tester to the booking module',
      'Read the booking user stories, find that “week” is ambiguous, and write the test condition “weekly limit of 6 hours”',
      'Apply boundary value analysis to the weekly limit and write test cases with inputs 5, 6 and 7 hours',
      'Create the test accounts student1–3, load LAB01–LAB03 into the test database and group the cases into a smoke suite',
      'Run the smoke suite on build 1.4, compare actual with expected results and log a defect for TC-07',
      'Check that all defect reports are closed or deferred, archive the test suite and hold a lessons-learned meeting',
      'Re-run TC-07 and the booking regression suite on build 1.5',
      'Identify that a second browser must be installed in the test environment (design of the environment)',
      'Evaluate the exit criteria and send the test progress report to the product owner',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.h': HD[0], 'r1.h': HD[1], 'r2.h': HD[2], 'r3.h': HD[3], 'r4.h': HD[4], 'r5.h': HD[5], 'r6.h': HD[6], 'r7.h': HD[5], 'r8.h': HD[3], 'r9.h': HD[1] },
    giaiThich: giai('Scope + exit criteria = planning; comparing with plan, corrective action, evaluating exit criteria, progress reports = monitoring & control; analysing the test basis and test conditions = analysis; test cases and identifying environment/data needs = design; preparing data, environment and suites = implementation; running, comparing, logging defects, retest and regression = execution; closing defects, archiving, lessons learned = completion.', 'Phạm vi + tiêu chí ra = lập kế hoạch; so với kế hoạch, hành động khắc phục, đánh giá tiêu chí ra, báo cáo tiến độ = giám sát & kiểm soát; phân tích test basis và test condition = phân tích; test case và xác định nhu cầu môi trường/dữ liệu = thiết kế; chuẩn bị dữ liệu, môi trường, suite = triển khai; chạy, so sánh, ghi lỗi, test lại, hồi quy = thực thi; đóng lỗi, lưu trữ, bài học = hoàn tất.'),
  }],
  goiY: ['XÁC ĐỊNH nhu cầu môi trường/dữ liệu = design; DỰNG môi trường, nạp dữ liệu = implementation.', 'Confirmation testing và regression testing nằm trong execution.'],
  loiHayGap: ['Xếp “đánh giá tiêu chí ra” vào completion (đó là quy trình 5 bước cũ: evaluating exit criteria & reporting).', 'Xếp “tìm defect trong user story” vào design.'],
  giaiThich: '<p>Planning · M&C · Analysis · Design · Implementation · Execution · Completion · Execution · Design · M&C.</p>',
  thuatNgu: [{ en: 'test basis', vi: 'cơ sở kiểm thử — tài liệu/tri thức để suy ra test' }, { en: 'test condition', vi: 'điều kiện kiểm thử — một khía cạnh cần test' }, { en: 'exit criteria', vi: 'tiêu chí ra — điều kiện để coi là xong' }, { en: 'smoke suite', vi: 'bộ test khói — kiểm nhanh các chức năng chính' }],
  khaiNiem: ['test process', 'test activities'],
});

const SP = ['Test plan', 'Test progress report', 'Test conditions', 'Test cases', 'Test procedures and test suites', 'Test logs and defect reports', 'Test summary report and archived testware'];
const E3 = tinhDe({
  tieuDe: 'Test process 3 — Which activity produces each work product?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>LO-1.4.3: differentiate the work products. For each activity, pick the work product it typically produces.</p>', vi: '<p>LO-1.4.3: phân biệt sản phẩm công việc. Với mỗi hoạt động, chọn sản phẩm điển hình nó tạo ra.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Activity → main work product', 'Hoạt động → sản phẩm chính'),
    cot: [{ ma: 'h', ten: 'Activity' }, { ma: 's', ten: 'Work product', luaChon: SP }],
    hang: HD.map((h, i) => ({ ma: `r${i}`, o: { h } })),
    dapAn: Object.fromEntries(HD.map((_, i) => [`r${i}.s`, SP[i]])),
    giaiThich: giai('Plan → progress reports → conditions (and charters) → cases (and test data needs) → procedures, suites, execution schedule → logs, status, defect reports → summary report, change requests, archived testware.', 'Kế hoạch → báo cáo tiến độ → điều kiện (và charter) → test case (và nhu cầu dữ liệu) → thủ tục, suite, lịch thực thi → nhật ký, trạng thái, báo cáo lỗi → báo cáo tổng kết, change request, testware lưu trữ.'),
  }],
  goiY: ['Mỗi sản phẩm khớp đúng một hoạt động.', 'Test procedure (thứ tự bước chạy) thuộc implementation, không phải design.'],
  loiHayGap: ['Xếp test procedure vào design.', 'Xếp test summary report vào monitoring & control — nó CŨNG có thể xuất hiện ở đó, nhưng sản phẩm đặc trưng của completion là summary report + testware lưu trữ.'],
  giaiThich: '<p>Rows map in order: plan, progress report, conditions, cases, procedures/suites, logs/defects, summary/archive.</p>',
  thuatNgu: [{ en: 'test procedure', vi: 'thủ tục kiểm thử — chuỗi test case theo thứ tự thực thi' }, { en: 'testware', vi: 'mọi sản phẩm của việc kiểm thử (case, dữ liệu, script…)' }, { en: 'test charter', vi: 'hiến chương — mục tiêu cho một phiên test thăm dò' }],
  khaiNiem: ['test work products'],
});

/* E4 — truy vết + độ phủ test basis (slide 75–76) */
const E4 = jsDe({
  tieuDe: 'Test process 4 — Traceability: requirement coverage and impact analysis',
  doKho: 'MEDIUM', phut: 18,
  moTa: { en: `<p>LO-1.4.4: traceability between the test basis and test work products lets you measure coverage, find gaps and analyse the impact of a change. Slide 76 computes requirement coverage as <i>requirements touched by executed tests ÷ all requirements</i>.</p>
<p>A traceability matrix is an object <code>{ testCaseId: [requirementIds] }</code>. Write three functions:</p>
<ol>
<li><code>coverage(requirements, matrix, executed)</code> — percentage (0–100, rounded to 2 decimals) of <code>requirements</code> that are linked to at least one test case in <code>executed</code> (an array of test-case ids). Links to unknown requirements are ignored. No requirements ⇒ 100.</li>
<li><code>untested(requirements, matrix)</code> — requirement ids (in the order of <code>requirements</code>) not linked to <b>any</b> test case.</li>
<li><code>impacted(matrix, changedRequirement)</code> — test-case ids (sorted A→Z) that must be re-run when that requirement changes.</li>
</ol>`, vi: `<p>LO-1.4.4: truy vết giữa test basis và sản phẩm kiểm thử giúp đo độ phủ, tìm chỗ trống và phân tích ảnh hưởng của thay đổi. Slide 76 tính độ phủ yêu cầu = <i>số yêu cầu được test đã chạy chạm tới ÷ tổng số yêu cầu</i>.</p>
<p>Ma trận truy vết là object <code>{ maTestCase: [maYeuCau] }</code>. Viết ba hàm:</p>
<ol>
<li><code>coverage(requirements, matrix, executed)</code> — phần trăm (0–100, làm tròn 2 chữ số) số <code>requirements</code> được nối với ít nhất một test case trong <code>executed</code>. Liên kết tới yêu cầu lạ bị bỏ qua. Không có yêu cầu ⇒ 100.</li>
<li><code>untested(requirements, matrix)</code> — các mã yêu cầu (theo thứ tự <code>requirements</code>) KHÔNG nối với test case nào.</li>
<li><code>impacted(matrix, changedRequirement)</code> — các mã test case (sắp A→Z) phải chạy lại khi yêu cầu đó đổi.</li>
</ol>` },
  yeuCau: [
    { en: 'Round with <code>Math.round(x * 100) / 100</code>.', vi: 'Làm tròn bằng <code>Math.round(x * 100) / 100</code>.' },
    { en: 'Do not count a requirement twice when two executed tests cover it.', vi: 'Không đếm một yêu cầu hai lần khi hai test đã chạy cùng phủ nó.' },
  ],
  viDu: [
    { input: "coverage(['R1','R2','R3','R4'], { TC1:['R1'], TC2:['R1','R2'], TC3:['R4'] }, ['TC1','TC2'])", output: '50', explanation: 'R1 and R2 touched by executed tests: 2/4.|||R1, R2 được test đã chạy chạm tới: 2/4.' },
    { input: "untested(['R1','R2','R3','R4'], { TC1:['R1'], TC2:['R1','R2'], TC3:['R4'] })", output: "['R3']", explanation: 'R3 has no test case at all — a gap in test analysis.|||R3 không có test case nào — lỗ hổng của bước phân tích.' },
  ],
  goiY: ['Dùng Set cho các yêu cầu đã phủ.', 'impacted: lọc Object.keys(matrix) theo matrix[tc].includes(req), rồi sort.'],
  loiHayGap: ['Tính độ phủ trên mọi test case thay vì chỉ test đã CHẠY.', 'Đếm cả yêu cầu lạ không có trong danh sách nên vượt 100%.', 'Trả 0 khi không có yêu cầu nào.'],
  giaiThich: '<p>Traceability supports coverage evaluation, impact analysis of changes, audits and understandable status reports — all four uses listed on the slide.</p>',
  thuatNgu: [{ en: 'traceability', vi: 'truy vết — liên kết hai chiều giữa yêu cầu và test' }, { en: 'impact analysis', vi: 'phân tích ảnh hưởng của thay đổi' }, { en: 'requirement coverage', vi: 'độ phủ yêu cầu' }],
  khaiNiem: ['traceability', 'coverage'],
  tep: {
    'trace.js': [
      'function coverage(requirements, matrix, executed) {\n  return 0;\n}\n\nfunction untested(requirements, matrix) {\n  return [];\n}\n\nfunction impacted(matrix, changedRequirement) {\n  return [];\n}\n',
      'function coverage(requirements, matrix, executed) {\n  if (requirements.length === 0) return 100;\n  const known = new Set(requirements);\n  const hit = new Set();\n  for (const tc of executed) for (const r of matrix[tc] || []) if (known.has(r)) hit.add(r);\n  return Math.round((hit.size / known.size) * 100 * 100) / 100;\n}\n\nfunction untested(requirements, matrix) {\n  const linked = new Set(Object.values(matrix).flat());\n  return requirements.filter((r) => !linked.has(r));\n}\n\nfunction impacted(matrix, changedRequirement) {\n  return Object.keys(matrix).filter((tc) => (matrix[tc] || []).includes(changedRequirement)).sort();\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'coverage — the example (50%)', vi: 'coverage — ví dụ (50%)' }, () => { const v = coverage(['R1', 'R2', 'R3', 'R4'], { TC1: ['R1'], TC2: ['R1', 'R2'], TC3: ['R4'] }, ['TC1', 'TC2']); return v === 50 ? 'OK' : 'expected 50, got ' + v; }),
    kiemTuy({ en: 'coverage — slide 76 numbers (9 of 12 requirements)', vi: 'coverage — số của slide 76 (9/12 yêu cầu)' }, () => { const R = Array.from({ length: 12 }, (_, i) => 'R' + (i + 1)); const M = {}; for (let i = 1; i <= 9; i++) M['T' + i] = ['R' + i]; M.T10 = ['R10']; const v = coverage(R, M, Object.keys(M).slice(0, 9)); return v === 75 ? 'OK' : 'expected 75, got ' + v; }),
    kiemTuy({ en: 'coverage — rounding and duplicates', vi: 'coverage — làm tròn và trùng lặp' }, () => { const v = coverage(['A', 'B', 'C'], { t1: ['A'], t2: ['A'] }, ['t1', 't2']); return v === 33.33 ? 'OK' : 'A is covered once: 1/3 = 33.33, got ' + v; }),
    kiemTuy({ en: 'coverage — unknown requirements and empty list', vi: 'coverage — yêu cầu lạ và danh sách rỗng' }, () => { const v = coverage(['A'], { t1: ['A', 'Z'] }, ['t1']); const e = coverage([], { t1: ['A'] }, ['t1']); return v === 100 && e === 100 ? 'OK' : 'Z is not a requirement (expect 100), and no requirements ⇒ 100; got ' + v + ' and ' + e; }, { an: true }),
    kiemTuy({ en: 'untested — gaps in order', vi: 'untested — chỗ trống theo thứ tự' }, () => { const v = untested(['R3', 'R1', 'R2', 'R4'], { TC1: ['R1'], TC3: ['R4'] }); return JSON.stringify(v) === '["R3","R2"]' ? 'OK' : 'expected ["R3","R2"], got ' + JSON.stringify(v); }),
    kiemTuy({ en: 'impacted — tests to re-run, sorted', vi: 'impacted — test cần chạy lại, đã sắp' }, () => { const v = impacted({ TC9: ['R2'], TC1: ['R1'], TC2: ['R1', 'R2'], TC10: ['R2'] }, 'R2'); return JSON.stringify(v) === '["TC10","TC2","TC9"]' ? 'OK' : 'expected ["TC10","TC2","TC9"] (string sort), got ' + JSON.stringify(v); }),
    kiemTuy({ en: 'impacted — requirement with no tests', vi: 'impacted — yêu cầu không có test' }, () => { const v = impacted({ TC1: ['R1'] }, 'R7'); return Array.isArray(v) && v.length === 0 ? 'OK' : 'expected []'; }, { an: true }),
  ],
});

const E5 = tinhDe({
  tieuDe: 'Test process 5 — Context, the old 5-step process and exam questions',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six questions: what shapes a test process (LO-1.4.1), how the CTFL 2011 five-step process maps to the 2018 activities, and the slide-16 style questions.</p>', vi: '<p>Sáu câu: điều gì định hình quy trình test (LO-1.4.1), quy trình 5 bước CTFL 2011 quy đổi thế nào sang hoạt động 2018, và câu hỏi kiểu slide 16.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is a contextual factor that influences an organisation’s test process?', 'Đâu là yếu tố ngữ cảnh ảnh hưởng quy trình test của tổ chức?'), luaChon: lc(['a', 'The colour of the user interface'], ['b', 'The software development lifecycle model and the project methodologies'], ['c', 'The name of the test manager'], ['d', 'The programming language’s keywords']), dapAn: ['b'], giaiThich: giai('Lifecycle model, test levels and types, product and project risks, business domain, operational constraints (budget, time, complexity, contracts), organisational policies, required standards.', 'Mô hình vòng đời, cấp và loại test, rủi ro sản phẩm/dự án, lĩnh vực, ràng buộc vận hành (ngân sách, thời gian, độ phức tạp, hợp đồng), chính sách tổ chức, chuẩn bắt buộc.') },
    { ma: 'q2', de: hai('In the CTFL 2011 five-step process, “evaluating exit criteria and reporting” corresponds in CTFL 2018 mainly to…', 'Trong quy trình 5 bước CTFL 2011, “đánh giá tiêu chí ra và báo cáo” tương ứng CTFL 2018 chủ yếu với…'), luaChon: lc(['a', 'Test completion'], ['b', 'Test monitoring and control'], ['c', 'Test analysis'], ['d', 'Test execution']), dapAn: ['b'], giaiThich: giai('Evaluating exit criteria now sits inside monitoring and control; “closure” became completion.', 'Đánh giá tiêu chí ra nay nằm trong giám sát và kiểm soát; “closure” thành completion.') },
    { ma: 'q3', de: hai('Which activity answers the question “what to test?”', 'Hoạt động nào trả lời câu “test cái gì?”'), luaChon: lc(['a', 'Test planning'], ['b', 'Test analysis'], ['c', 'Test design'], ['d', 'Test implementation']), dapAn: ['b'], giaiThich: giai('Analysis identifies testable features and defines test conditions; design answers “how”.', 'Phân tích xác định đặc tính test được và định nghĩa test condition; thiết kế trả lời “như thế nào”.') },
    { ma: 'q4', de: hai('Which task is part of test implementation?', 'Việc nào thuộc test implementation?'), luaChon: lc(['a', 'Defining the exit criteria'], ['b', 'Creating test suites from test procedures and arranging them in a test execution schedule'], ['c', 'Prioritising test conditions'], ['d', 'Archiving testware']), dapAn: ['b'], giaiThich: giai('Implementation builds procedures, suites, the execution schedule, the environment and the data.', 'Triển khai dựng thủ tục, suite, lịch thực thi, môi trường và dữ liệu.') },
    { ma: 'q5', de: hai('Which is a benefit of good traceability?', 'Đâu là lợi ích của truy vết tốt?'), luaChon: lc(['a', 'It removes the need for test design'], ['b', 'Analysing the impact of changes and making testing auditable'], ['c', 'It guarantees 100% coverage'], ['d', 'It reduces the number of requirements']), dapAn: ['b'], giaiThich: giai('Plus: evaluating coverage, meeting IT governance criteria, understandable progress reports.', 'Ngoài ra: đánh giá độ phủ, đáp ứng tiêu chí quản trị CNTT, báo cáo tiến độ dễ hiểu.') },
    { ma: 'q6', de: hai('In an Agile project, which statement about the test activities is TRUE?', 'Trong dự án Agile, phát biểu nào về các hoạt động test là ĐÚNG?'), luaChon: lc(['a', 'They are not needed'], ['b', 'Analysis, design, implementation and execution happen in every iteration, overlapping each other'], ['c', 'They must be strictly sequential'], ['d', 'Only execution is done']), dapAn: ['b'], giaiThich: giai('The groups exist in every lifecycle; in Agile they iterate within each sprint.', 'Các nhóm có trong mọi vòng đời; với Agile chúng lặp trong mỗi sprint.') },
  ],
  goiY: ['Nhớ bảng quy đổi: closure = completion; evaluating exit criteria ⇒ monitoring & control.', 'Analysis = what, design = how.'],
  loiHayGap: ['Chọn completion cho câu 2.', 'Cho rằng Agile không có quy trình test.'],
  giaiThich: '<p>Answers: b · b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'test execution schedule', vi: 'lịch thực thi test' }],
  khaiNiem: ['test process', 'traceability'],
});

export default doiDau({
  slug: 'swt301-test-process',
  ten: '1.4 The test process: activities, tasks and work products',
  moTaModule: 'Bảy nhóm hoạt động kiểm thử theo thứ tự, ghép việc ↔ hoạt động ↔ sản phẩm trên dự án LabBook, viết ma trận truy vết tính độ phủ yêu cầu và phân tích ảnh hưởng, quy đổi quy trình 5 bước cũ.',
  khoa: KHOA,
  baiHoc: 'swt301-test-process',
  de: [E1, E2, E3, E4, E5],
});
