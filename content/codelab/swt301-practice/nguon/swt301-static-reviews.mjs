/**
 * SWT301 · 3.2 — The review process and roles (SWT3 slide 21–53, LO-3.2.1 K2 · LO-3.2.2 K1) + một buổi review yêu cầu thật.
 */
import { doiDau, KHOA, hai, giai, lc, tn, kiemReview, preSo } from './_chung.mjs';
import { tinhDe, jsDe } from './_de.mjs';

const HD = ['Planning', 'Initiate review', 'Individual review', 'Issue communication and analysis', 'Fixing and reporting'];
const E1 = tinhDe({
  tieuDe: 'Reviews 1 — Order the five activities of the review process',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>ISTQB CTFL 2018 describes the work-product review process as five activities, from planning the review to reporting its results. Put them in the order in which they happen (SWT3 slide 24).</p>', vi: '<p>ISTQB CTFL 2018 mô tả quy trình review sản phẩm gồm năm hoạt động, từ lập kế hoạch review tới báo cáo kết quả. Sắp chúng theo đúng thứ tự diễn ra (SWT3 slide 24).</p>' },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('Review process — first to last', 'Quy trình review — từ đầu tới cuối'), muc: lc(['c', HD[2]], ['e', HD[4]], ['a', HD[0]], ['d', HD[3]], ['b', HD[1]]), dapAn: ['a', 'b', 'c', 'd', 'e'], giaiThich: giai('Planning → Initiate review (kick-off) → Individual review (preparation) → Issue communication and analysis → Fixing and reporting.', 'Lập kế hoạch → Khởi động review (kick-off) → Review cá nhân (chuẩn bị) → Trao đổi và phân tích vấn đề → Sửa và báo cáo.') }],
  goiY: ['Không thể review khi chưa ai nhận tài liệu (initiate).', 'Họp bàn lỗi diễn ra SAU khi mỗi người đã tự đọc.'],
  loiHayGap: ['Đặt "Individual review" trước "Initiate review".', 'Gộp "Fixing and reporting" vào buổi họp.'],
  giaiThich: '<p>Planning → Initiate review → Individual review → Issue communication and analysis → Fixing and reporting.</p>',
  thuatNgu: [{ en: 'kick-off', vi: 'buổi khởi động — phát tài liệu, giải thích mục tiêu' }, { en: 'entry / exit criteria', vi: 'tiêu chí vào / ra' }],
  khaiNiem: ['review process'],
});

const E2 = tinhDe({
  tieuDe: 'Reviews 2 — In which activity does each task happen?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>The exam’s favourite shape: “task X happens in which activity?”. Map every task to its activity of the CTFL 2018 review process.</p>', vi: '<p>Dạng câu đề thi thích nhất: “việc X diễn ra ở hoạt động nào?”. Ghép mỗi việc vào hoạt động của quy trình review CTFL 2018.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Activity of each task', 'Hoạt động của từng việc'),
    cot: [{ ma: 't', ten: 'Task' }, { ma: 'a', ten: 'Activity', luaChon: HD }],
    hang: [
      'Defining the scope, purpose and the work products to review',
      'Estimating effort and timeframe; selecting people and allocating roles',
      'Checking entry criteria (for more formal review types)',
      'Distributing the work product and other material',
      'Explaining the scope, objectives, process and roles to the participants',
      'Reviewing all or part of the work product; noting potential defects, recommendations and questions',
      'Communicating identified potential defects (e.g. in a review meeting)',
      'Analysing potential defects, assigning ownership and status to them',
      'Evaluating the review findings against the exit criteria to make a review decision',
      'Creating defect reports for findings that require changes',
      'Fixing defects in the work product (typically by the author)',
      'Gathering metrics and accepting the work product when the exit criteria are reached',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.a': HD[0], 'r1.a': HD[0], 'r2.a': HD[0], 'r3.a': HD[1], 'r4.a': HD[1], 'r5.a': HD[2], 'r6.a': HD[3], 'r7.a': HD[3], 'r8.a': HD[3], 'r9.a': HD[4], 'r10.a': HD[4], 'r11.a': HD[4] },
    giaiThich: giai('Planning: scope, effort, roles, entry check. Initiate: distribute and explain. Individual review: read and note. Issue communication and analysis: communicate, analyse, own, evaluate vs exit criteria. Fixing and reporting: defect reports, fixing, metrics, acceptance.', 'Lập kế hoạch: phạm vi, công sức, vai trò, kiểm tiêu chí vào. Khởi động: phát và giải thích. Review cá nhân: đọc và ghi chú. Trao đổi & phân tích: báo, phân tích, giao chủ, so tiêu chí ra. Sửa & báo cáo: báo cáo lỗi, sửa, số liệu, chấp nhận.'),
  }],
  goiY: ['Tiêu chí VÀO kiểm ở Planning; tiêu chí RA đánh giá ở Issue communication and analysis, chấp nhận ở Fixing and reporting.', '"Ghi nhận lỗi tiềm năng" là việc cá nhân; "phân tích, giao chủ" là việc chung.'],
  loiHayGap: ['Đặt "kiểm tra tiêu chí vào" ở Initiate review.', 'Đặt "viết defect report" ở Individual review.'],
  giaiThich: '<p>Planning ×3 · Initiate ×2 · Individual ×1 · Issue communication and analysis ×3 · Fixing and reporting ×3.</p>',
  thuatNgu: [{ en: 'review meeting', vi: 'buổi họp review' }],
  khaiNiem: ['review process'],
});

const VT = ['Author', 'Management', 'Facilitator (moderator)', 'Review leader', 'Reviewer', 'Scribe (recorder)'];
const E3 = tinhDe({
  tieuDe: 'Reviews 3 — Who is responsible? The six roles of a formal review',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>A formal review has six roles. Match each responsibility to its role (one role can have several responsibilities).</p>', vi: '<p>Review chính thức có sáu vai trò. Ghép mỗi trách nhiệm với vai trò (một vai có thể nhiều trách nhiệm).</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Role of each responsibility', 'Vai trò của từng trách nhiệm'),
    cot: [{ ma: 't', ten: 'Responsibility' }, { ma: 'r', ten: 'Role', luaChon: VT }],
    hang: [
      'Creates the work product under review and fixes its defects',
      'Decides on the execution of reviews; allocates staff, budget and time',
      'Monitors the ongoing cost-effectiveness of reviews and makes control decisions',
      'Ensures review meetings run effectively; mediates between viewpoints',
      'Takes overall responsibility; decides who is involved and organises when and where',
      'Identifies potential defects in the work product from their own perspective',
      'Collates potential defects found during individual review',
      'Records new defects, open points and decisions during the review meeting',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.r': VT[0], 'r1.r': VT[1], 'r2.r': VT[1], 'r3.r': VT[2], 'r4.r': VT[3], 'r5.r': VT[4], 'r6.r': VT[5], 'r7.r': VT[5] },
    giaiThich: giai('Author creates and fixes; management funds and monitors; facilitator runs the meeting (success often depends on them); review leader is overall responsible and organises; reviewers find defects; scribe collates and records.', 'Tác giả tạo và sửa; quản lý cấp nguồn lực và giám sát; facilitator điều phối buổi họp (thành bại thường phụ thuộc họ); review leader chịu trách nhiệm chung và tổ chức; reviewer tìm lỗi; scribe tổng hợp và ghi chép.'),
  }],
  goiY: ['"Điều phối buổi họp, hoà giải" = facilitator; "quyết định ai tham gia, khi nào, ở đâu" = review leader.', 'Scribe vừa tổng hợp lỗi từ review cá nhân vừa ghi biên bản họp.'],
  loiHayGap: ['Nhầm facilitator với review leader.', 'Cho rằng author ghi biên bản.'],
  giaiThich: '<p>Author · Management · Management · Facilitator · Review leader · Reviewer · Scribe · Scribe.</p>',
  thuatNgu: [{ en: 'facilitator (moderator)', vi: 'người điều phối buổi review' }, { en: 'scribe (recorder)', vi: 'thư ký ghi biên bản' }],
  khaiNiem: ['review roles'],
});

const E4 = tinhDe({
  tieuDe: 'Reviews 4 — Process and roles, exam style',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Five ISTQB-style questions mixing the process and the roles — including the classic traps (“which activity checks the exit criteria?”, “can the author be the scribe?”).</p>', vi: '<p>Năm câu kiểu ISTQB trộn quy trình và vai trò — gồm các bẫy kinh điển (“hoạt động nào kiểm tiêu chí ra?”, “tác giả làm scribe được không?”).</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('In which activity are the review findings evaluated against the exit criteria to make a review decision?', 'Ở hoạt động nào các phát hiện review được so với tiêu chí ra để quyết định?'), luaChon: lc(['a', 'Planning'], ['b', 'Individual review'], ['c', 'Issue communication and analysis'], ['d', 'Fixing and reporting']), dapAn: ['c'], giaiThich: giai('Evaluating findings vs exit criteria is part of issue communication and analysis; checking that exit criteria are MET and accepting the product happen in fixing and reporting.', 'So phát hiện với tiêu chí ra thuộc trao đổi & phân tích; kiểm tiêu chí ra đã ĐẠT và chấp nhận sản phẩm nằm ở sửa & báo cáo.') },
    { ma: 'q2', de: hai('Which role is usually responsible for fixing the defects found in the work product?', 'Vai trò nào thường sửa các lỗi tìm thấy trong sản phẩm?'), luaChon: lc(['a', 'Reviewer'], ['b', 'Author'], ['c', 'Scribe'], ['d', 'Management']), dapAn: ['b'], giaiThich: giai('The author owns the work product and does the rework.', 'Tác giả sở hữu sản phẩm và làm lại phần sửa.') },
    { ma: 'q3', de: hai('In an inspection, who must NOT act as the facilitator (moderator)?', 'Trong inspection, ai KHÔNG được làm facilitator?'), luaChon: lc(['a', 'A trained moderator'], ['b', 'The author'], ['c', 'A senior tester'], ['d', 'A quality engineer']), dapAn: ['b'], giaiThich: giai('Inspections are led by a trained facilitator who is not the author, so the process stays objective.', 'Inspection do facilitator được đào tạo dẫn và không phải tác giả, để quy trình khách quan.') },
    { ma: 'q4', de: hai('What is done during the initiate-review activity?', 'Hoạt động initiate review làm gì?'), luaChon: lc(['a', 'Fixing defects'], ['b', 'Distributing the work product and explaining the scope, objectives, process, roles and work products; answering questions'], ['c', 'Writing the review report'], ['d', 'Defining entry criteria']), dapAn: ['b'], giaiThich: giai('Initiate review = the kick-off: material out, purpose explained, questions answered.', 'Initiate review = buổi kick-off: phát tài liệu, giải thích mục đích, trả lời câu hỏi.') },
    { ma: 'q5', de: hai('According to the slides, the success of a review often depends most on…', 'Theo slide, thành công của buổi review thường phụ thuộc nhiều nhất vào…'), luaChon: lc(['a', 'the scribe'], ['b', 'the facilitator (moderator)'], ['c', 'the number of pages'], ['d', 'the review tool']), dapAn: ['b'], giaiThich: giai('The syllabus: “the success of the review often depends on the facilitator”.', 'Syllabus: “thành công của review thường phụ thuộc vào facilitator”.') },
  ],
  goiY: ['Tiêu chí ra: ĐÁNH GIÁ ở issue communication and analysis; CHẤP NHẬN ở fixing and reporting.', 'Facilitator ≠ tác giả trong inspection.'],
  loiHayGap: ['Chọn Planning cho câu tiêu chí ra.', 'Cho rằng reviewer sửa lỗi.'],
  giaiThich: '<p>Answers: c · b · b · b · b.</p>',
  thuatNgu: [{ en: 'inspection', vi: 'thanh tra — loại review chính quy nhất' }],
  khaiNiem: ['review process', 'review roles'],
});

/* E5 — review một đặc tả thật */
const SRS = `R1   The system shall let a student book a seat in a lab.
R2   A booking lasts between 1 and 3 hours.
R3   Bookings must be made at least 1 hour and at most 2 weeks in advance.
R4   The system shall respond quickly.
R5   When a lab is full, the student is added to the waitlist.
R6   When a confirmed booking is cancelled, the waitlist is promoted.
R7   A student may book at most 6 hours per calendar week.
R8   Students can cancel their bookings.
R9   Bookings are confirmed by e-mail.
R10  A lab can be closed by the administrator.
R11  Closed labs cannot be booked, except by staff.
R12  The booking date must be after today.`;
const LOAI_YC = ['AMBIGUOUS', 'INCOMPLETE', 'INCONSISTENT', 'UNTESTABLE', 'INCORRECT', 'REDUNDANT'];
const E5 = jsDe({
  tieuDe: 'Reviews 5 — Review the LabBook requirements and log the issues',
  doKho: 'HARD', phut: 20,
  moTa: { en: `<p>You are a reviewer in the individual-review activity of a LabBook requirements review. Read the 12 requirements and log every potential defect: the requirement number, its type, a description and a suggested fix. Two requirements are fine — logging them is a false positive.</p>${preSo(SRS)}<p>Types: <code>${LOAI_YC.join('</code> · <code>')}</code>.</p>`, vi: `<p>Bạn là reviewer trong bước review cá nhân của buổi review yêu cầu LabBook. Đọc 12 yêu cầu và ghi mọi lỗi tiềm năng: số hiệu yêu cầu, loại, mô tả và gợi ý sửa. Có hai yêu cầu không có lỗi — ghi chúng là báo nhầm.</p>${preSo(SRS)}<p>Loại: <code>${LOAI_YC.join('</code> · <code>')}</code>.</p>` },
  yeuCau: [
    { en: '<code>ISSUES = [{ line: 4, type: "UNTESTABLE", description, fix }]</code> — <code>line</code> = requirement number; for a conflict between two requirements give both, e.g. <code>"3,12"</code>.', vi: '<code>ISSUES = [{ line: 4, type: "UNTESTABLE", description, fix }]</code> — <code>line</code> = số hiệu yêu cầu; mâu thuẫn giữa hai yêu cầu thì ghi cả hai, vd <code>"3,12"</code>.' },
    { en: 'Find at least 6 real issues, including the three critical ones; every issue with a concrete fix.', vi: 'Tìm ít nhất 6 lỗi thật, gồm ba lỗi nghiêm trọng; mỗi lỗi có cách sửa cụ thể.' },
  ],
  viDu: [{ input: '{ line: 4, type: "UNTESTABLE", description: "“quickly” is not measurable" }', output: 'counts as the critical issue on R4', explanation: 'Fix: “95% of booking requests answer within 2 seconds with 200 concurrent users”.|||Sửa: “95% yêu cầu đặt chỗ trả lời trong 2 giây với 200 người dùng đồng thời”.' }],
  goiY: ['Đọc từng câu với câu hỏi: đo được không? đủ chưa (ai, khi nào, bao nhiêu)? có câu nào khác nói ngược lại không?', 'R3 cho phép đặt trong ngày (trước 1 giờ) nhưng R12 cấm ngày hôm nay — mâu thuẫn.'],
  loiHayGap: ['Báo R1 và R7 có lỗi chỉ vì “chung chung” — chúng rõ và kiểm được.', 'Ghi "R4 sai" mà không đề xuất con số đo được.', 'Bỏ sót mâu thuẫn vì chỉ đọc từng câu riêng lẻ.'],
  giaiThich: '<p>R4 untestable (“quickly”); R6 incomplete (order of promotion? FIFO?); R3/R12 inconsistent (same-day booking); R2 ambiguous (whole hours?); R5 incomplete (when is a lab “full”: seats per hour?); R10/R11 inconsistent/ambiguous (administrator vs “staff”, undefined); R9 incomplete (which events send e-mails?); R8 incomplete (cancellation deadline?).</p>',
  thuatNgu: [{ en: 'ambiguous', vi: 'mơ hồ — hiểu được nhiều cách' }, { en: 'untestable', vi: 'không kiểm được — không có tiêu chí đo' }, { en: 'inconsistent', vi: 'mâu thuẫn' }, { en: 'incomplete', vi: 'thiếu thông tin' }],
  khaiNiem: ['review', 'requirements review'],
  tep: {
    'answer.js': [
      "// One object per potential defect. line = requirement number (\"3,12\" for a conflict).\n// type: AMBIGUOUS | INCOMPLETE | INCONSISTENT | UNTESTABLE | INCORRECT | REDUNDANT\nconst ISSUES = [\n  { line: 4, type: 'UNTESTABLE', description: '“quickly” cannot be measured.', fix: 'State a measurable target, e.g. 95% of requests within 2 s.' },\n];\n",
      `// Review log — 8 issues; R1 and R7 are fine.
const ISSUES = [
  { line: 4, type: 'UNTESTABLE', description: '“Respond quickly” has no measurable criterion.', fix: '95% of booking requests answered within 2 s with 200 concurrent users.' },
  { line: 6, type: 'INCOMPLETE', description: 'How is the waitlist promoted — first come first served? Several people at once? Are they notified?', fix: 'Promote waiting bookings of that lab and day first come first served while seats are free; e-mail each promoted student.' },
  { line: '3,12', type: 'INCONSISTENT', description: 'R3 allows a booking today (1 hour ahead) but R12 forbids today.', fix: 'Delete R12 or change it to “the booking start must be at least 1 hour after now”.' },
  { line: 2, type: 'AMBIGUOUS', description: 'Can a booking last 1.5 hours? Whole hours only? Must it end before closing time?', fix: 'A booking lasts 1, 2 or 3 whole hours and must end by 21:00.' },
  { line: 5, type: 'INCOMPLETE', description: '“Full” is not defined (seats per lab? per hour?) and the waitlist has no limit or status.', fix: 'A lab is full for an hour when the CONFIRMED bookings covering it equal its seats; the new booking gets status PENDING.' },
  { line: '10,11', type: 'INCONSISTENT', description: 'R10 says the administrator closes labs, R11 mentions “staff” — who are they, and may they book closed labs?', fix: 'Define the roles (Manager closes labs) and remove the exception or define it precisely.' },
  { line: 9, type: 'INCOMPLETE', description: 'Which events send an e-mail (confirmed, waitlisted, promoted, cancelled)?', fix: 'List the e-mail events and their subjects.' },
  { line: 8, type: 'INCOMPLETE', description: 'No cancellation deadline: can a booking be cancelled after it started?', fix: 'A booking can be cancelled until 2 hours before its start.' },
];
`,
    ],
  },
  kiem: kiemReview({
    bien: 'ISSUES', toiThieu: 6, loaiHopLe: LOAI_YC,
    khoa: [
      { ma: 'K1', dong: [4], loai: ['UNTESTABLE', 'AMBIGUOUS'], ten: 'R4 “respond quickly” is not measurable', tenVi: 'R4 “phản hồi nhanh” không đo được', nang: true },
      { ma: 'K2', dong: [6], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: 'R6 does not say how the waitlist is promoted', tenVi: 'R6 không nói nâng hạng danh sách chờ thế nào', nang: true },
      { ma: 'K3', dong: [3, 12], loai: ['INCONSISTENT', 'INCORRECT'], ten: 'R3 and R12 contradict each other about same-day bookings', tenVi: 'R3 và R12 mâu thuẫn về đặt trong ngày', nang: true },
      { ma: 'K4', dong: [2], loai: ['AMBIGUOUS', 'INCOMPLETE'], ten: 'R2 whole hours?' },
      { ma: 'K5', dong: [5], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: 'R5 “full” undefined' },
      { ma: 'K6', dong: [10, 11], loai: ['INCONSISTENT', 'AMBIGUOUS'], ten: 'R10/R11 administrator vs staff' },
      { ma: 'K7', dong: [9], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: 'R9 which e-mail events' },
      { ma: 'K8', dong: [8], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: 'R8 no cancellation deadline' },
    ],
    sai: [
      { dong: [1], loai: LOAI_YC, ten: 'R1 is clear and testable' },
      { dong: [7], loai: LOAI_YC, ten: 'R7 is clear and testable' },
    ],
  }),
});

export default doiDau({
  slug: 'swt301-static-reviews',
  ten: '3.2 Review process & roles',
  moTaModule: 'Quy trình review năm hoạt động (sắp thứ tự, ghép việc ↔ hoạt động), sáu vai trò, câu hỏi kiểu đề thi, và một buổi review cá nhân thật trên 12 yêu cầu LabBook (lỗi mơ hồ, thiếu, mâu thuẫn, không kiểm được; có bẫy báo nhầm).',
  khoa: KHOA,
  baiHoc: 'swt301-static-reviews',
  de: [E1, E2, E3, E4, E5],
});
