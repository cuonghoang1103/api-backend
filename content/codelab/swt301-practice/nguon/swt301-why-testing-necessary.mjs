/**
 * SWT301 · 1.2 — Why is testing necessary? (SWT1 slide 32–52, LO-1.2.1–1.2.4): error/defect/failure, root cause, QA vs testing.
 */
import { doiDau, KHOA, hai, giai, lc, kiemKhoa, tn } from './_chung.mjs';
import { tinhDe, jsDe } from './_de.mjs';

const CHUOI = ['Root cause', 'Error (mistake)', 'Defect (fault, bug)', 'Failure', 'Effect'];
const E1 = tinhDe({
  tieuDe: 'Why testing 1 — Root cause, error, defect, failure or effect?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Every incident follows the chain <b>root cause → error (human mistake) → defect (in a work product) → failure (at run time) → effect (consequence)</b>. Classify each fact of this LabBook incident.</p>', vi: '<p>Mọi sự cố đi theo chuỗi <b>nguyên nhân gốc → error (sai sót của người) → defect (trong sản phẩm) → failure (khi chạy) → effect (hậu quả)</b>. Phân loại từng sự kiện trong sự cố LabBook này.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Place in the chain', 'Vị trí trong chuỗi'),
    cot: [{ ma: 'f', ten: 'Fact' }, { ma: 'k', ten: 'Kind', luaChon: CHUOI }],
    hang: [
      'The business analyst had never been told that students may book up to exactly 6 hours',
      'The analyst wrote “fewer than 6 hours per week” in the user story',
      'BookingService contains if (used + hours >= 6)',
      'On Monday a student with 4 booked hours is refused a 2-hour booking',
      'Forty students miss their lab practice and complain to the department',
    ].map((f, i) => ({ ma: `r${i}`, o: { f } })),
    dapAn: { 'r0.k': CHUOI[0], 'r1.k': CHUOI[1], 'r2.k': CHUOI[2], 'r3.k': CHUOI[3], 'r4.k': CHUOI[4] },
    giaiThich: giai('The missing knowledge is why the mistake happened (root cause); writing the wrong rule is the human error; the wrong condition in the code is the defect; the refused booking is the failure; missed classes and complaints are the effect.', 'Thiếu thông tin là lý do sai sót xảy ra (nguyên nhân gốc); viết sai luật là error; điều kiện sai trong mã là defect; bị từ chối đặt chỗ là failure; lỡ buổi học và khiếu nại là effect.'),
  }],
  goiY: ['Error là HÀNH ĐỘNG của con người; defect nằm TRONG sản phẩm; failure là sự kiện khi CHẠY.', 'Root cause trả lời “vì sao người đó mắc sai sót?”.'],
  loiHayGap: ['Gọi dòng mã sai là failure.', 'Gọi việc viết sai user story là defect — defect là thứ nằm trong user story/mã, còn việc viết sai là error.'],
  giaiThich: '<p>Root cause · Error · Defect · Failure · Effect.</p>',
  thuatNgu: tn('error', 'defect', 'failure', 'rootCause'),
  khaiNiem: ['error defect failure', 'root cause'],
});

const E2 = tinhDe({
  tieuDe: 'Why testing 2 — Testing, quality assurance and the cost of defects',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six questions on LO-1.2.1–1.2.4: why testing is necessary, how it relates to quality assurance and quality control, and where defects come from.</p>', vi: '<p>Sáu câu về LO-1.2.1–1.2.4: vì sao cần kiểm thử, quan hệ với đảm bảo chất lượng và kiểm soát chất lượng, và defect sinh ra từ đâu.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('What is the relationship between testing and quality assurance (QA)?', 'Quan hệ giữa kiểm thử và đảm bảo chất lượng (QA) là gì?'), luaChon: lc(['a', 'They are the same thing'], ['b', 'QA focuses on adherence to proper processes; testing is part of quality control, which focuses on the product'], ['c', 'Testing contains QA'], ['d', 'QA is done only by testers']), dapAn: ['b'], giaiThich: giai('Quality management = QA (process) + quality control (product activities, including testing).', 'Quản lý chất lượng = QA (quy trình) + QC (hoạt động trên sản phẩm, gồm kiểm thử).') },
    { ma: 'q2', de: hai('Which can be a source of a defect?', 'Đâu có thể là nguồn gốc của defect?'), luaChon: lc(['a', 'Only programmers’ mistakes in code'], ['b', 'Time pressure, human fallibility, complexity, miscommunication, new technologies, environmental conditions'], ['c', 'Only the testing tools'], ['d', 'Only the customer']), dapAn: ['b'], giaiThich: giai('Defects arise in requirements, design, code and documents for many reasons; environmental conditions (radiation, magnetism) can also cause failures by changing hardware conditions.', 'Defect sinh ra trong yêu cầu, thiết kế, mã, tài liệu vì nhiều lý do; điều kiện môi trường (bức xạ, từ trường) cũng gây failure.') },
    { ma: 'q3', de: hai('Can a failure happen without a defect in the software?', 'Failure có thể xảy ra mà phần mềm không có defect không?'), luaChon: lc(['a', 'No, never'], ['b', 'Yes — environmental conditions such as radiation or a faulty disk can cause failures'], ['c', 'Only in mobile apps'], ['d', 'Only during testing']), dapAn: ['b'], giaiThich: giai('The syllabus notes that environmental conditions can cause failures (not every unexpected result is a software defect — false positives also exist).', 'Syllabus nói điều kiện môi trường có thể gây failure (không phải kết quả lạ nào cũng là defect phần mềm — còn có dương tính giả).') },
    { ma: 'q4', de: hai('Why is a defect found by a user in production usually the most expensive?', 'Vì sao defect do người dùng phát hiện khi đã vận hành thường đắt nhất?'), luaChon: lc(['a', 'Users charge money for reports'], ['b', 'The fix must go through design, code, tests and release again, plus the business damage (data, reputation, support)'], ['c', 'Production servers are expensive'], ['d', 'It is not more expensive']), dapAn: ['b'], giaiThich: giai('The later a defect is found, the more work products and consequences are affected.', 'Defect phát hiện càng muộn càng nhiều sản phẩm và hậu quả bị ảnh hưởng.') },
    { ma: 'q5', de: hai('What is the main purpose of root-cause analysis?', 'Mục đích chính của phân tích nguyên nhân gốc là gì?'), luaChon: lc(['a', 'To find who is to blame'], ['b', 'To identify why defects happen so that process improvements prevent similar defects in future'], ['c', 'To fix the failing test'], ['d', 'To estimate the test effort']), dapAn: ['b'], giaiThich: giai('Root-cause analysis turns one defect into a process improvement — never a blame exercise.', 'Phân tích nguyên nhân gốc biến một lỗi thành cải tiến quy trình — không phải để đổ lỗi.') },
    { ma: 'q6', de: hai('Which is an example of testing contributing to success?', 'Ví dụ nào cho thấy kiểm thử góp phần thành công?'), luaChon: lc(['a', 'Testers write all the code'], ['b', 'Testers taking part in requirements reviews detect ambiguities before they become defects in code'], ['c', 'Testers decide the release date alone'], ['d', 'Testing slows the project']), dapAn: ['b'], giaiThich: giai('Early involvement in requirement reviews, design reviews, close work with developers and verification before release all reduce risk.', 'Tham gia sớm vào review yêu cầu, review thiết kế, làm việc sát với developer và kiểm tra trước phát hành đều giảm rủi ro.') },
  ],
  goiY: ['QA = quy trình; QC/kiểm thử = sản phẩm.', 'Failure có thể do môi trường, không chỉ do defect.'],
  loiHayGap: ['Coi QA và testing là một.', 'Dùng phân tích nguyên nhân gốc để tìm người có lỗi.'],
  giaiThich: '<p>Answers: b · b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'quality assurance (QA)', vi: 'đảm bảo chất lượng — tập trung vào quy trình' }, { en: 'quality control (QC)', vi: 'kiểm soát chất lượng — tập trung vào sản phẩm' }, ...tn('rootCause')],
  khaiNiem: ['quality assurance', 'cost of defects'],
});

/* E3 — phân tích một báo cáo sự cố (js) */
const SU_CO = `(1) LabBook went live on Monday at 07:00.
(2) The developer copied the time-zone code from an old project without reading the new SRS.
(3) The SRS says that the booking window is computed in Vietnam time (UTC+7).
(4) BookingService computes "today" with the server clock in UTC.
(5) Between 00:00 and 07:00 Vietnam time, students could not book any slot for that day.
(6) The lab manager received 25 complaint e-mails before 08:00.
(7) The team had no review step for configuration and time-zone code.
(8) The developer forgot to convert the server time to UTC+7.`;
const E3 = jsDe({
  tieuDe: 'Why testing 3 — Analyse an incident report (error, defect, failure, root cause, effect)',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: `<p>Read the incident report of LabBook’s first night in production. Each sentence has a number. Put the numbers in the right place of the chain; one sentence is only context.</p><pre>${SU_CO}</pre>`, vi: `<p>Đọc báo cáo sự cố đêm đầu LabBook chạy thật. Mỗi câu có số thứ tự. Xếp số vào đúng vị trí trong chuỗi; có một câu chỉ là bối cảnh.</p><pre>${SU_CO}</pre>` },
  yeuCau: [{ en: '<code>ANALYSIS = { rootCause: [..], error: [..], defect: [..], failure: [..], effect: [..], context: [..] }</code> — arrays of sentence numbers.', vi: '<code>ANALYSIS = { rootCause: [..], error: [..], defect: [..], failure: [..], effect: [..], context: [..] }</code> — mảng số câu.' }],
  viDu: [{ input: 'sentence (5)', output: 'failure', explanation: 'Observed at run time: bookings refused.|||Quan sát khi chạy: đặt chỗ bị từ chối.' }],
  goiY: ['Có hai nguyên nhân gốc: quy trình (không review mã múi giờ) và thói quen (chép mã cũ không đọc SRS).', 'Câu (3) là yêu cầu — chỉ là bối cảnh; câu (1) cũng là bối cảnh.'],
  loiHayGap: ['Xếp câu (4) vào error — đó là trạng thái của mã (defect).', 'Xếp câu (8) vào defect — "quên chuyển đổi" là hành động của người (error).'],
  giaiThich: '<p>Root causes 2 and 7 · error 8 · defect 4 · failure 5 · effect 6 · context 1 and 3.</p>',
  thuatNgu: tn('error', 'defect', 'failure', 'rootCause'),
  khaiNiem: ['error defect failure', 'root cause analysis'],
  tep: {
    'answer.js': [
      'const ANALYSIS = {\n  rootCause: [],\n  error: [],\n  defect: [],\n  failure: [5],\n  effect: [],\n  context: [],\n};\n',
      '// Chain: root cause (2, 7) → error (8) → defect (4) → failure (5) → effect (6). Sentences 1 and 3 are context.\nconst ANALYSIS = {\n  rootCause: [2, 7],\n  error: [8],\n  defect: [4],\n  failure: [5],\n  effect: [6],\n  context: [1, 3],\n};\n',
    ],
  },
  kiem: kiemKhoa([
    ['rootCause', ['2', '7'], 'root causes'], ['error', ['8'], 'error'], ['defect', ['4'], 'defect'], ['failure', ['5'], 'failure'], ['effect', ['6'], 'effect'], ['context', ['1', '3'], 'context'],
  ].map(([k, v, ten]) => ({ moTa: { en: `ANALYSIS.${k} — ${ten}`, vi: `ANALYSIS.${k} — ${ten}` }, bieuThuc: `(ANALYSIS.${k} || []).map(String)`, chap: [v], kieu: 'tap' }))),
});

const E4 = tinhDe({
  tieuDe: 'Why testing 4 — Errors, defects and failures: exam traps',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five short exam-style questions about the vocabulary of chapter 1 — the FE likes to swap the three words.</p>', vi: '<p>Năm câu ngắn kiểu đề thi về từ vựng chương 1 — đề FE hay đánh tráo ba chữ này.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A programmer types < instead of <=. This action is…', 'Lập trình viên gõ < thay vì <=. Hành động đó là…'), luaChon: lc(['a', 'a failure'], ['b', 'an error (mistake)'], ['c', 'a defect'], ['d', 'a root cause']), dapAn: ['b'], giaiThich: giai('The human action is the error; the resulting “<” in the code is the defect.', 'Hành động của người là error; dấu “<” sai nằm trong mã là defect.') },
    { ma: 'q2', de: hai('The wrong “<” stays in the code. It is…', 'Dấu “<” sai nằm lại trong mã. Nó là…'), luaChon: lc(['a', 'an error'], ['b', 'a defect'], ['c', 'a failure'], ['d', 'an effect']), dapAn: ['b'], giaiThich: giai('A defect (fault, bug) is an imperfection in a work product.', 'Defect (fault, bug) là khiếm khuyết trong sản phẩm.') },
    { ma: 'q3', de: hai('A defect in code that is never executed…', 'Defect trong đoạn mã không bao giờ được chạy…'), luaChon: lc(['a', 'always causes a failure'], ['b', 'may never cause a failure'], ['c', 'is not a defect'], ['d', 'is an error']), dapAn: ['b'], giaiThich: giai('A defect causes a failure only when the defective code is executed under the right conditions.', 'Defect chỉ gây failure khi đoạn mã lỗi được chạy trong điều kiện phù hợp.') },
    { ma: 'q4', de: hai('A test reports a failure, but analysis shows the test data was wrong. This is…', 'Test báo failure, nhưng phân tích cho thấy dữ liệu test sai. Đây là…'), luaChon: lc(['a', 'a false positive'], ['b', 'a false negative'], ['c', 'a root cause'], ['d', 'a regression']), dapAn: ['a'], giaiThich: giai('A false positive reports a defect that is not there; a false negative misses one that is.', 'Dương tính giả báo lỗi không có thật; âm tính giả bỏ sót lỗi có thật.') },
    { ma: 'q5', de: hai('Which word describes the consequence for users or the business?', 'Từ nào mô tả hậu quả với người dùng hay doanh nghiệp?'), luaChon: lc(['a', 'Effect'], ['b', 'Defect'], ['c', 'Error'], ['d', 'Root cause']), dapAn: ['a'], giaiThich: giai('Effects: complaints, money lost, reputation damage.', 'Effect: khiếu nại, mất tiền, mất uy tín.') },
  ],
  goiY: ['Người làm → error; nằm trong sản phẩm → defect; khi chạy → failure.', 'False positive = báo nhầm có lỗi.'],
  loiHayGap: ['Nhầm false positive với false negative.', 'Cho rằng mọi defect đều gây failure.'],
  giaiThich: '<p>Answers: b · b · b · a · a.</p>',
  thuatNgu: [...tn('error', 'defect', 'failure'), { en: 'false positive / false negative', vi: 'dương tính giả (báo nhầm có lỗi) / âm tính giả (bỏ sót lỗi)' }],
  khaiNiem: ['error defect failure'],
});

export default doiDau({
  slug: 'swt301-why-testing-necessary',
  ten: '1.2 Why is testing necessary? Error, defect, failure',
  moTaModule: 'Chuỗi nguyên nhân gốc → error → defect → failure → effect trên sự cố LabBook thật, phân tích báo cáo sự cố, quan hệ kiểm thử – QA – QC, chi phí lỗi, bẫy từ vựng của đề FE.',
  khoa: KHOA,
  baiHoc: 'swt301-why-testing-necessary',
  de: [E1, E2, E3, E4],
});
