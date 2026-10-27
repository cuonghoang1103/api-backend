/**
 * SWT301 · DỰ ÁN LABBOOK — MỐC CHƯƠNG 1: review test basis (user story LabBook 1.0) sớm, viết test condition có truy vết,
 * gọi tên hoạt động / sản phẩm / nguyên tắc; kèm Góc phỏng vấn 1.
 */
import { doiDau, KHOA, hai, giai, lc, kiemReview, kiemKhoa, preSo, NOP_BAI } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';

const STORY = `US1 Log in
  As a student, I want to log in with my FPT e-mail so that only students can book.
  AC1.1 Valid e-mail and password: the dashboard is shown.
  AC1.2 After several wrong passwords the account is locked.
US2 View labs
  As a student, I want to see all labs and their free seats.
  AC2.1 Labs are listed with name, capacity and free seats.
  AC2.2 The list loads quickly.
US3 Book a seat
  As a student, I want to book a seat in a lab for a time slot.
  AC3.1 Start hour 7-20, duration 1-3 hours.
  AC3.2 A booking must end by 21:00.
  AC3.3 When the lab is full, the booking is refused.
  AC3.4 When the lab is full, the student is put on the waiting list as PENDING.
US4 Weekly limit
  As the lab manager, I want to limit each student to 6 hours per week.
  AC4.1 A booking is refused if the student's total would exceed 6 hours.
  AC4.2 Cancelled bookings do not count.
US5 Cancel a booking
  As a student, I want to cancel my booking free of charge.
  AC5.1 A booking can be cancelled until 2 hours before the start.
  AC5.2 Cancelling a confirmed booking promotes the first pending student.
US6 Close a lab
  As the lab manager, I want to close a lab for maintenance.
  AC6.1 A closed lab cannot be booked.
  AC6.2 Lab supervisors can reopen the lab.
Glossary: week = Monday 00:00 to Sunday 23:59, Vietnam time.`;

const LOAI = ['AMBIGUOUS', 'CONTRADICTION', 'INCOMPLETE', 'UNTESTABLE', 'INCONSISTENT'];
const KHOA_LOI = [
  { ma: 'K1', dong: [4], loai: ['AMBIGUOUS', 'INCOMPLETE'], ten: '“several wrong passwords” — how many, and for how long is the account locked?', tenVi: '“vài lần sai mật khẩu” — bao nhiêu lần, khoá bao lâu?', nang: true },
  { ma: 'K2', dong: [13, 14], loai: ['CONTRADICTION'], ten: 'AC3.3 refuses a booking in a full lab, AC3.4 puts it on the waiting list', tenVi: 'AC3.3 từ chối khi phòng đầy, AC3.4 lại cho vào danh sách chờ', nang: true },
  { ma: 'K3', dong: [8], loai: ['UNTESTABLE', 'AMBIGUOUS'], ten: '“loads quickly” has no measurable criterion', tenVi: '“tải nhanh” không có tiêu chí đo được', nang: true },
  { ma: 'K4', dong: [20, 21], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: '“free of charge” — what happens after the 2-hour limit (refused or a fee)?', tenVi: '“miễn phí” — sau mốc 2 giờ thì sao (từ chối hay mất phí)?', nang: true },
  { ma: 'K5', dong: [17, 18], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: 'do PENDING (waiting-list) bookings count towards the 6 hours?', tenVi: 'booking PENDING (đang chờ) có tính vào 6 giờ không?' },
  { ma: 'K6', dong: [22], loai: ['AMBIGUOUS', 'INCOMPLETE'], ten: '“first pending student” — first by request time? same lab, same date and slot only?', tenVi: '“sinh viên chờ đầu tiên” — đầu tiên theo thời điểm đặt? chỉ cùng phòng, cùng ngày, cùng khung giờ?' },
  { ma: 'K7', dong: [26], loai: ['INCONSISTENT'], ten: '“lab supervisors” is not a defined role — US6 says lab manager', tenVi: '“lab supervisor” không phải vai đã định nghĩa — US6 nói lab manager' },
  { ma: 'K8', dong: [24, 25], loai: ['INCOMPLETE'], ten: 'what happens to existing bookings when a lab is closed?', tenVi: 'booking đã có thì sao khi đóng phòng?' },
  { ma: 'K9', dong: [10, 11], loai: ['INCOMPLETE'], ten: 'how far ahead may a student book (dates in the past, next semester)?', tenVi: 'được đặt trước bao xa (ngày quá khứ, kỳ sau)?' },
  { ma: 'K10', dong: [2, 3], loai: ['INCOMPLETE'], ten: 'no criterion for a wrong password or a non-FPT e-mail', tenVi: 'không có tiêu chí cho sai mật khẩu hay e-mail không phải FPT' },
  { ma: 'K11', dong: [6, 7], loai: ['AMBIGUOUS', 'INCOMPLETE'], ten: '“free seats” — free now, today, or for a chosen slot? closed labs listed?', tenVi: '“chỗ trống” — trống lúc này, hôm nay hay theo khung giờ chọn? có liệt kê phòng đóng?' },
];
const SAI = [
  { dong: [11, 12], loai: ['CONTRADICTION'], ten: 'AC3.1 and AC3.2 are compatible: start 20 + 1 h ends at 21:00; together they form one rule' },
  { dong: [27], loai: ['AMBIGUOUS', 'INCOMPLETE'], ten: '“week” is defined in the glossary (line 27)' },
];

const US = ['US1', 'US2', 'US3', 'US4', 'US5', 'US6'];
const KIEM = [
  ...kiemReview({ bien: 'ISSUES', khoa: KHOA_LOI, sai: SAI, toiThieu: 8, nhom: 'f1', loaiHopLe: LOAI }),
  kiemTuy({ en: 'B — CONDITIONS is a list of { id, story, text } with unique ids', vi: 'B — CONDITIONS là danh sách { id, story, text }, id không trùng' }, () => {
    if (typeof CONDITIONS === 'undefined' || !Array.isArray(CONDITIONS)) return 'declare const CONDITIONS = [ { id, story, text } ]';
    const bad = CONDITIONS.filter((c) => !c || !c.id || !c.story || String(c.text || '').trim().length < 10);
    if (bad.length) return 'every condition needs an id, a story and a text of at least 10 characters';
    return new Set(CONDITIONS.map((c) => String(c.id))).size === CONDITIONS.length ? 'OK' : 'condition ids must be unique';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — every story US1–US6 has at least one test condition (traceability)', vi: 'B — mỗi story US1–US6 có ít nhất một test condition (truy vết)' }, () => {
    const s = new Set((typeof CONDITIONS !== 'undefined' && Array.isArray(CONDITIONS) ? CONDITIONS : []).map((c) => String(c && c.story).toUpperCase()));
    const thieu = ['US1', 'US2', 'US3', 'US4', 'US5', 'US6'].filter((u) => !s.has(u));
    return thieu.length ? 'no test condition traces to ' + thieu.join(', ') : 'OK';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — at least 14 test conditions in total', vi: 'B — tổng cộng ít nhất 14 test condition' }, () => {
    const n = typeof CONDITIONS !== 'undefined' && Array.isArray(CONDITIONS) ? CONDITIONS.length : 0;
    return n >= 14 ? 'OK' : 'only ' + n + ' condition(s) — analyse each acceptance criterion, including the negative side';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — US3 and US4 get the most attention (≥ 3 conditions each: highest risk)', vi: 'B — US3 và US4 được chú ý nhất (≥ 3 condition mỗi story: rủi ro cao nhất)' }, () => {
    const L = typeof CONDITIONS !== 'undefined' && Array.isArray(CONDITIONS) ? CONDITIONS : [];
    const n = (u) => L.filter((c) => String(c && c.story).toUpperCase() === u).length;
    return n('US3') >= 3 && n('US4') >= 3 ? 'OK' : 'US3 has ' + n('US3') + ', US4 has ' + n('US4') + ' — booking rules and the weekly limit need ≥ 3 each';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — the weekly-limit conditions mention the boundary (exactly 6 hours)', vi: 'B — condition giới hạn tuần có nhắc biên (đúng 6 giờ)' }, () => {
    const L = typeof CONDITIONS !== 'undefined' && Array.isArray(CONDITIONS) ? CONDITIONS : [];
    return L.some((c) => String(c && c.story).toUpperCase() === 'US4' && /\b6\b|six/i.test(String(c.text)) && /exact|equal|=|boundary|reach/i.test(String(c.text))) ? 'OK' : 'add a US4 condition about reaching exactly 6 hours (the boundary of the limit)';
  }, { nhom: 'f2', an: true }),
  ...kiemKhoa([
    { moTa: { en: 'C — test activity of this milestone', vi: 'C — hoạt động kiểm thử của mốc này' }, bieuThuc: 'MILESTONE.activity', chap: ['Test analysis'], nhom: 'f3' },
    { moTa: { en: 'C — work product produced', vi: 'C — sản phẩm tạo ra' }, bieuThuc: 'MILESTONE.workProduct', chap: ['Test conditions'], nhom: 'f3' },
    { moTa: { en: 'C — principle shown by reviewing the stories before coding', vi: 'C — nguyên tắc thể hiện khi review story trước khi code' }, bieuThuc: 'MILESTONE.principle', chap: ['Early testing saves time and money'], nhom: 'f3' },
    { moTa: { en: 'C — static or dynamic testing?', vi: 'C — kiểm thử tĩnh hay động?' }, bieuThuc: 'MILESTONE.kind', chap: ['Static'], nhom: 'f3' },
  ]),
];

const GIAI_A = `// Review of the LabBook 1.0 user stories (test basis) — 11 issues.
const ISSUES = [
  { line: 4, type: 'AMBIGUOUS', severity: 'High', description: '“several wrong passwords”: how many attempts, and for how long is the account locked? Not testable as written.', fix: 'After 5 consecutive wrong passwords the account is locked for 15 minutes.' },
  { line: 13, type: 'CONTRADICTION', severity: 'High', description: 'AC3.3 refuses a booking when the lab is full, AC3.4 puts the student on the waiting list.', fix: 'Delete AC3.3 or state when each applies; keep the waiting list (PENDING).' },
  { line: 8, type: 'UNTESTABLE', severity: 'Medium', description: '“loads quickly” has no measurable criterion.', fix: 'The list is shown within 2 seconds for 95% of requests with 200 users.' },
  { line: 21, type: 'INCOMPLETE', severity: 'High', description: '“free of charge” suggests a fee later; the rule after the 2-hour limit is missing.', fix: 'Less than 2 hours before the start the cancellation is refused with TOO_LATE.' },
  { line: 17, type: 'INCOMPLETE', severity: 'Medium', description: 'Does a PENDING (waiting-list) booking count towards the 6 hours?', fix: 'Only CONFIRMED bookings count towards the weekly limit.' },
  { line: 22, type: 'AMBIGUOUS', severity: 'Medium', description: '“first pending student”: first by request time? Same lab, date and slot only?', fix: 'The earliest PENDING request for the same lab, date and slot is promoted.' },
  { line: 26, type: 'INCONSISTENT', severity: 'Low', description: '“lab supervisors” is not a role; US6 talks about the lab manager.', fix: 'The lab manager can reopen the lab.' },
  { line: 25, type: 'INCOMPLETE', severity: 'Medium', description: 'Existing bookings of a closed lab are not handled.', fix: 'Closing a lab cancels its future bookings and e-mails the students.' },
  { line: 11, type: 'INCOMPLETE', severity: 'Medium', description: 'No rule for past dates or how far ahead a student may book.', fix: 'Bookings are allowed from today up to 14 days ahead.' },
  { line: 3, type: 'INCOMPLETE', severity: 'Medium', description: 'Only the happy path is specified: wrong password and non-FPT e-mail are missing.', fix: 'Add: wrong password → error message; e-mail not ending in @fpt.edu.vn → refused.' },
  { line: 7, type: 'AMBIGUOUS', severity: 'Low', description: '“free seats” for which time? Are closed labs listed?', fix: 'Free seats for the selected date and slot; closed labs shown as CLOSED.' },
];
`;

const GIAI_B = `// Test conditions (test analysis) — each traces to one user story.
const CONDITIONS = [
  { id: 'TCO-01', story: 'US1', text: 'Log in with a valid FPT e-mail and the right password' },
  { id: 'TCO-02', story: 'US1', text: 'Log in with a wrong password (error, attempt counted)' },
  { id: 'TCO-03', story: 'US1', text: 'Account locking after the agreed number of wrong passwords' },
  { id: 'TCO-04', story: 'US1', text: 'Log in with an e-mail that is not an FPT address' },
  { id: 'TCO-05', story: 'US2', text: 'Lab list shows name, capacity and free seats of every lab' },
  { id: 'TCO-06', story: 'US2', text: 'Response time of the lab list against the agreed limit' },
  { id: 'TCO-07', story: 'US3', text: 'Start hour inside and outside 7-20 (boundaries 7 and 20)' },
  { id: 'TCO-08', story: 'US3', text: 'Duration inside and outside 1-3 hours' },
  { id: 'TCO-09', story: 'US3', text: 'Booking that would end after 21:00 is refused' },
  { id: 'TCO-10', story: 'US3', text: 'Booking a full lab puts the student on the waiting list as PENDING' },
  { id: 'TCO-11', story: 'US4', text: 'Weekly total below 6 hours is accepted' },
  { id: 'TCO-12', story: 'US4', text: 'Weekly total reaching exactly 6 hours is accepted (boundary)' },
  { id: 'TCO-13', story: 'US4', text: 'Weekly total above 6 hours is refused' },
  { id: 'TCO-14', story: 'US4', text: 'Cancelled bookings are not counted in the weekly total' },
  { id: 'TCO-15', story: 'US5', text: 'Cancel at least 2 hours before the start' },
  { id: 'TCO-16', story: 'US5', text: 'Cancel less than 2 hours before the start' },
  { id: 'TCO-17', story: 'US5', text: 'Cancelling a confirmed booking promotes the first pending student' },
  { id: 'TCO-18', story: 'US6', text: 'A closed lab cannot be booked' },
  { id: 'TCO-19', story: 'US6', text: 'The lab manager reopens a closed lab' },
];
`;

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 1 — Review the Test Basis and Write Test Conditions',
  phu: { en: 'Running project · chapter 1 · early testing on user stories · traceable test conditions · 10 marks', vi: 'Dự án xuyên suốt · chương 1 · test sớm trên user story · test condition có truy vết · 10 điểm' },
  moTa: {
    en: `<p>This is the first milestone of the <b>LabBook</b> running project, which you will test chapter after chapter until system testing (Lab 4 / Report 5.3). Coding has <b>not</b> started yet. The product owner sends the user stories of release 1.0 — your test basis. Before a single line of code exists, you review them and derive the test conditions.</p>${preSo(STORY)}`,
    vi: `<p>Đây là mốc đầu của dự án xuyên suốt <b>LabBook</b>, bạn sẽ kiểm thử nó qua từng chương tới system test (Lab 4 / Report 5.3). Chưa ai viết mã. Product owner gửi các user story của bản 1.0 — test basis của bạn. Trước khi có dòng mã nào, bạn review chúng và suy ra test condition.</p><p>Tóm tắt: US1 đăng nhập (khoá tài khoản sau “vài lần” sai) · US2 xem phòng (“tải nhanh”) · US3 đặt chỗ (giờ 7–20, 1–3 giờ, kết thúc trước 21:00, phòng đầy thì… hai tiêu chí) · US4 giới hạn 6 giờ/tuần · US5 huỷ “miễn phí” tới 2 giờ trước, nâng người chờ đầu tiên · US6 đóng/mở phòng · thuật ngữ “tuần”.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Review log of the stories: line, type, severity, description and a rewritten criterion as the fix.', vi: 'A. Nhật ký review story: dòng, loại, mức độ, mô tả và tiêu chí viết lại làm cách sửa.' },
    { en: 'B. Test conditions traced to the stories.', vi: 'B. Test condition truy vết về story.' },
    { en: 'C. Name the activity, the work product, the principle and the kind of testing.', vi: 'C. Gọi tên hoạt động, sản phẩm, nguyên tắc và loại kiểm thử.' },
  ],
  yeuCauChung: [{ en: 'A requirement defect is anything that would make two readers build or test different things: ambiguity, contradiction, a missing rule, an unmeasurable criterion, an inconsistent term.', vi: 'Lỗi yêu cầu là bất cứ thứ gì khiến hai người đọc xây hay test ra hai thứ khác nhau: mơ hồ, mâu thuẫn, thiếu luật, tiêu chí không đo được, thuật ngữ không nhất quán.' }],
  cayThuMuc: `answers/
├── review.js      ← const ISSUES = [ { line, type, severity, description, fix } ]
├── conditions.js  ← const CONDITIONS = [ { id, story: 'US1'…'US6', text } ]
└── milestone.js   ← const MILESTONE = { activity, workProduct, principle, kind }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['ISSUES[].type', 'string', { en: LOAI.join(' · '), vi: LOAI.join(' · ') }],
      ['MILESTONE.activity', 'string', { en: 'one of the 7 CTFL 2018 test activities', vi: 'một trong 7 hoạt động CTFL 2018' }],
      ['MILESTONE.principle', 'string', { en: 'the full name of one of the 7 principles', vi: 'tên đầy đủ của một trong 7 nguyên tắc' }],
      ['MILESTONE.kind', 'string', { en: 'Static · Dynamic', vi: 'Static · Dynamic' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Review of the stories', vi: 'A. Review story' }, diem: 5, yeuCau: [{ en: 'At least 8 real requirement defects including the four critical ones; no false claim; each fix is a rewritten, testable criterion.', vi: 'Ít nhất 8 lỗi yêu cầu thật gồm bốn lỗi nghiêm trọng; không khẳng định sai; mỗi cách sửa là một tiêu chí viết lại, test được.' }], hook: ['early testing', 'requirements review'] },
    { ten: { en: 'B. Test conditions', vi: 'B. Test condition' }, diem: 3, yeuCau: [{ en: '≥ 14 conditions, every story covered, ≥ 3 for US3 and US4, the weekly-limit boundary.', vi: '≥ 14 condition, phủ mọi story, ≥ 3 cho US3 và US4, có biên giới hạn tuần.' }], hook: ['test analysis', 'traceability'] },
    { ten: { en: 'C. Where we are in the process', vi: 'C. Ta đang ở đâu trong quy trình' }, diem: 2, yeuCau: [{ en: 'Activity, work product, principle, static/dynamic.', vi: 'Hoạt động, sản phẩm, nguyên tắc, tĩnh/động.' }], hook: ['test process'] },
  ],
  idBatBuoc: [['ISSUES', 'answers/review.js'], ['CONDITIONS', 'answers/conditions.js'], ['MILESTONE', 'answers/milestone.js']],
  truDiem: [
    { en: 'Calling AC3.1 and AC3.2 a contradiction — they combine into one rule.', vi: 'Gọi AC3.1 và AC3.2 là mâu thuẫn — chúng gộp thành một luật.' },
    { en: 'Reporting “week” as undefined — read the glossary.', vi: 'Báo “week” chưa định nghĩa — hãy đọc phần thuật ngữ.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 1 — Talking about testing fundamentals',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> Questions an interviewer asks a fresher QA or developer about the basics. Choose the answer that would impress — concrete, honest, linked to a project.</p>', vi: '<p><b>Góc phỏng vấn.</b> Câu người phỏng vấn hay hỏi QA/developer mới ra trường về kiến thức nền. Chọn câu trả lời gây ấn tượng — cụ thể, thật thà, gắn với dự án.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“What is the difference between QA and testing?”', '“QA khác testing thế nào?”'), luaChon: lc(['a', '“They are the same.”'], ['b', '“QA is about the process that prevents defects; testing is a quality-control activity that evaluates the product. In LabBook we did both: a review checklist for stories (process) and test cases (product).”'], ['c', '“QA is manual testing, testing is automation.”'], ['d', '“QA is done by managers.”']), dapAn: ['b'], giaiThich: giai('Definition + a concrete example.', 'Định nghĩa + ví dụ cụ thể.') },
    { ma: 'q2', de: hai('“A developer says your bug is ‘not a bug, works on my machine’. What do you do?”', '“Developer nói lỗi của bạn ‘không phải lỗi, máy tôi chạy được’. Bạn làm gì?”'), luaChon: lc(['a', 'Escalate to the manager immediately'], ['b', 'Stay factual: share exact steps, build, environment and logs, reproduce it together, and compare with the requirement'], ['c', 'Close the bug to avoid conflict'], ['d', 'Argue until they agree']), dapAn: ['b'], giaiThich: giai('Collaboration, not battles; facts and the requirement decide.', 'Hợp tác, không gây chiến; sự kiện và yêu cầu quyết định.') },
    { ma: 'q3', de: hai('“When do you stop testing?”', '“Khi nào bạn dừng test?”'), luaChon: lc(['a', '“When I find no more bugs.”'], ['b', '“When the exit criteria agreed in the plan are met — coverage of high-risk requirements, no open critical defects — or when the risk is accepted by the stakeholders.”'], ['c', '“When the deadline comes.”'], ['d', '“Never.”']), dapAn: ['b'], giaiThich: giai('Exhaustive testing is impossible; exit criteria and risk decide.', 'Không thể test vét cạn; tiêu chí ra và rủi ro quyết định.') },
    { ma: 'q4', de: hai('“Give an example of finding a defect early.”', '“Cho ví dụ về tìm lỗi sớm.”'), luaChon: lc(['a', '“I always find bugs early.”'], ['b', '“Reviewing LabBook’s stories I saw that a full lab was both refused and wait-listed. Fixing one sentence then saved a feature built twice.”'], ['c', '“Early testing is not possible in Agile.”'], ['d', '“I test after coding.”']), dapAn: ['b'], giaiThich: giai('Concrete story + impact, principle 3.', 'Câu chuyện cụ thể + tác động, nguyên tắc 3.') },
    { ma: 'q5', de: hai('“Can testing prove that software has no bugs?”', '“Testing có chứng minh được phần mềm hết lỗi không?”'), luaChon: lc(['a', '“Yes, with 100% coverage.”'], ['b', '“No. Testing shows the presence of defects and reduces the risk, but cannot prove absence — 100% code coverage still misses missing requirements.”'], ['c', '“Yes, with automation.”'], ['d', '“Only for small programs.”']), dapAn: ['b'], giaiThich: giai('Principle 1, with a reason that shows understanding.', 'Nguyên tắc 1, kèm lý do thể hiện hiểu sâu.') },
    { ma: 'q6', de: hai('“Why do you want to be a tester?”', '“Vì sao bạn muốn làm tester?”'), luaChon: lc(['a', '“Because I am not good at coding.”'], ['b', '“I enjoy asking ‘what could go wrong?’, I like protecting users, and I want to grow into automation and quality engineering — I have already practised it on LabBook.”'], ['c', '“Testing is easy.”'], ['d', '“I do not know.”']), dapAn: ['b'], giaiThich: giai('Curiosity, users, growth, evidence.', 'Tò mò, người dùng, phát triển, bằng chứng.') },
  ],
  goiY: ['Câu trả lời tốt = khái niệm đúng + ví dụ từ dự án.', 'Không bao giờ chê chính nghề test.'],
  loiHayGap: ['Trả lời bằng định nghĩa thuộc lòng không có ví dụ.', 'Đẩy xung đột lên quản lý ngay.'],
  giaiThich: '<p>All answers: b — specific, factual, project-based.</p>',
  thuatNgu: [{ en: 'fresher', vi: 'người mới ra trường' }, { en: 'escalate', vi: 'đẩy vấn đề lên cấp trên' }],
  khaiNiem: ['interview'],
});

export default doiDau({
  slug: 'swt301-1-project-labbook-test-basis',
  ten: 'LabBook Project 1 — Review the Test Basis and Write Test Conditions',
  moTaModule: 'Dự án LabBook — mốc chương 1: review user story bản 1.0 trước khi có mã (mơ hồ, mâu thuẫn, thiếu, không đo được; có bẫy), viết ≥ 14 test condition truy vết về story, gọi tên hoạt động/sản phẩm/nguyên tắc; kèm góc phỏng vấn 1.',
  khoa: KHOA,
  baiHoc: 'swt301-test-process',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 1 — Review the User Stories, then Write Test Conditions',
      doKho: 'HARD', phut: 60, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: 'line 8: AC2.2 The list loads quickly.', output: "{ line: 8, type: 'UNTESTABLE', fix: 'shown within 2 s for 95% of requests' }", explanation: 'No tester can decide pass or fail on “quickly”.|||Không tester nào quyết định đạt/trượt được với chữ “nhanh”.' }],
      khaiNiem: ['early testing', 'requirements review', 'test analysis', 'test conditions', 'traceability'],
      tienQuyet: ['SWT301 chapter 1'],
      the: ['swt301', 'project', 'labbook', 'test-analysis'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'test basis', vi: 'cơ sở kiểm thử' }, { en: 'test condition', vi: 'điều kiện kiểm thử' }, { en: 'acceptance criterion', vi: 'tiêu chí chấp nhận' }, { en: 'ambiguity', vi: 'sự mơ hồ' }, { en: 'testable', vi: 'kiểm thử được — có tiêu chí đạt/trượt rõ' }],
      goiY: [
        'A: với mỗi tiêu chí hỏi: hai tester có hiểu giống nhau không? có quyết định đạt/trượt được không? hai dòng có nói ngược nhau không? còn trường hợp nào chưa nói?',
        'B: mỗi tiêu chí chấp nhận cho ít nhất một condition; luật số (giờ, thời lượng, 6 giờ) cho cả phía hợp lệ, không hợp lệ và biên.',
        'C: suy ra test condition từ test basis là hoạt động nào? review trước khi có mã là tĩnh hay động?',
      ],
      loiHayGap: ['Báo AC3.1/AC3.2 mâu thuẫn.', 'Báo “week” chưa định nghĩa trong khi dòng 27 đã định nghĩa.', 'Viết test case chi tiết (dữ liệu, bước) thay vì test condition — đó là việc của bước design.'],
      moTaNgan: 'Mốc 1 dự án LabBook: review user story, viết test condition.',
      giaiThich: {
        en: '<p>Critical: line 4 (lockout undefined), 13–14 (full lab: refused vs waiting list), 8 (untestable “quickly”), 20–21 (after 2 h?). Others: PENDING and the weekly limit, “first pending”, lab supervisors, bookings of a closed lab, booking horizon, negative login cases, “free seats”. Test conditions are the output of <b>test analysis</b>; reviewing before code is <b>static</b> testing and shows that <b>early testing saves time and money</b>.</p>',
        vi: '<p>Nghiêm trọng: dòng 4, 13–14, 8, 20–21. Còn lại: PENDING và giới hạn tuần, “chờ đầu tiên”, lab supervisor, booking của phòng đóng, thời hạn đặt trước, đăng nhập sai, “chỗ trống”. Test condition là sản phẩm của <b>test analysis</b>; review trước khi có mã là kiểm thử <b>tĩnh</b> và thể hiện <b>test sớm tiết kiệm thời gian và tiền</b>.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/review.js', 'answers/conditions.js', 'answers/milestone.js'], kiem: KIEM },
      khoiDau: {
        'answers/review.js': `// type: ${LOAI.join(' | ')}\nconst ISSUES = [\n  { line: 8, type: 'UNTESTABLE', severity: 'Medium', description: '“loads quickly” cannot be measured.', fix: 'Shown within 2 seconds for 95% of requests.' },\n];\n`,
        'answers/conditions.js': "const CONDITIONS = [\n  { id: 'TCO-01', story: 'US1', text: 'Log in with a valid FPT e-mail and the right password' },\n];\n",
        'answers/milestone.js': "const MILESTONE = { activity: '', workProduct: '', principle: '', kind: '' };\n",
      },
      loiGiai: {
        'answers/review.js': GIAI_A,
        'answers/conditions.js': GIAI_B,
        'answers/milestone.js': "const MILESTONE = {\n  activity: 'Test analysis',\n  workProduct: 'Test conditions',\n  principle: 'Early testing saves time and money',\n  kind: 'Static',\n};\n",
      },
      thamKhao: 'https://istqb-glossary.page/test-condition/',
      boYeu: [
        { ten: 'báo nhầm mâu thuẫn AC3.1/3.2', tep: { 'answers/review.js': GIAI_A.replace("  { line: 11, type: 'INCOMPLETE'", "  { line: 12, type: 'CONTRADICTION', severity: 'High', description: 'AC3.1 and AC3.2 contradict.', fix: 'Remove AC3.2 completely.' },\n  { line: 11, type: 'INCOMPLETE'") }, phaiTruot: ['No false claims'] },
        { ten: 'bỏ sót US6', tep: { 'answers/conditions.js': GIAI_B.split('\n').filter((l) => !l.includes("'US6'")).join('\n') }, phaiTruot: ['every story US1–US6'] },
      ],
    },
    PHONG_VAN,
  ],
});
