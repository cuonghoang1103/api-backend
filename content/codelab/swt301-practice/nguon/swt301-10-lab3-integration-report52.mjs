/**
 * SWT301 · LUYỆN LAB 3 — Integration test, Report 5.2, trên hệ thống LabBook (giống LabFlow Demo của nhóm).
 * Đề trường: viết Report 5.2 (mỗi module một sheet, mỗi dòng một test case: mô tả · các bước · kết quả mong đợi ·
 * tiền điều kiện · Round 1–3) cho các luồng API ↔ security ↔ service ↔ DB ↔ hệ thống ngoài.
 * Sâu hơn trường: mỗi test case CHẠY THẬT trên LabBook (đúng ⇒ mọi kết quả mong đợi phải khớp), bị đo phủ theo
 * điểm tích hợp, và phải bắt được 9 bản lỗi TÍCH HỢP (interface fault) — kèm phần thống kê Report 5.2.
 */
import { doiDau, KHOA, svg, svgTuanTu, jsLit, kiemKhoa, NOP_BAI, tn, bangHtml } from './_chung.mjs';
import { kiemKichBan, LABBOOK_API, DOT_BIEN_TICH_HOP } from './_labbook.mjs';

const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const login = (email, password, expect) => ({ call: 'POST /api/auth/login', body: { email, password }, expect });
const DB = (body) => b('admin', 'GET /test/db/bookings', undefined, { status: 200, body });
const MAIL = (body) => b('admin', 'GET /test/outbox', undefined, { status: 200, body });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);
const ca = (id, description, precondition, steps) => ({ id, description, precondition, steps });
const PRE = 'Seed data loaded (5 accounts, LAB01–LAB03, no booking); clock 2026-11-02 08:00';

const GIAI_DS = [
  ca('IT-01', 'Verify that login with valid credentials returns a token and the STUDENT role', PRE, [
    login('an@fpt.edu.vn', 'An@12345', { status: 200, body: { role: 'STUDENT' } }),
  ]),
  ca('IT-02', 'Verify that the 3rd consecutive wrong password locks the account (auth service ↔ users table)', PRE, [
    login('an@fpt.edu.vn', 'wrong-1', { status: 401, body: { error: 'AUTH_INVALID' } }),
    login('an@fpt.edu.vn', 'wrong-2', { status: 401, body: { error: 'AUTH_INVALID' } }),
    login('an@fpt.edu.vn', 'wrong-3', { status: 401, body: { error: 'AUTH_INVALID' } }),
    login('an@fpt.edu.vn', 'An@12345', { status: 423, body: { error: 'ACCOUNT_LOCKED' } }),
  ]),
  ca('IT-03', 'Verify that a successful login resets the failure counter', PRE, [
    login('an@fpt.edu.vn', 'wrong-1', { status: 401 }),
    login('an@fpt.edu.vn', 'wrong-2', { status: 401 }),
    login('an@fpt.edu.vn', 'An@12345', { status: 200 }),
    login('an@fpt.edu.vn', 'wrong-3', { status: 401 }),
    login('an@fpt.edu.vn', 'An@12345', { status: 200, body: { role: 'STUDENT' } }),
  ]),
  ca('IT-04', 'Verify that a confirmed booking is saved in the bookings table and a confirmation e-mail is sent', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 2, { status: 201, body: { code: 'BK0001', status: 'CONFIRMED' } }),
    DB({ length: 1, 0: { code: 'BK0001', email: 'an@fpt.edu.vn', labCode: 'LAB01', status: 'CONFIRMED' } }),
    MAIL({ length: 1, 0: { to: 'an@fpt.edu.vn', subject: 'Booking confirmed', ref: 'BK0001' } }),
  ]),
  ca('IT-05', 'Verify that a full lab puts the next student on the waitlist (PENDING) and e-mails "Added to waitlist"', PRE, [
    book('student1', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { code: 'BK0002', status: 'PENDING' } }),
    MAIL({ length: 2, 1: { to: 'binh@fpt.edu.vn', subject: 'Added to waitlist' } }),
  ]),
  ca('IT-06', 'Verify that the API rejects invalid input and missing/wrong credentials before reaching the service', PRE, [
    book('student1', 'LAB01', '2026-11-03', 22, 1, { status: 400, body: { error: 'VALIDATION', field: 'startHour' } }),
    book('guest', 'LAB01', '2026-11-03', 9, 1, { status: 401, body: { error: 'UNAUTHENTICATED' } }),
    book('manager', 'LAB01', '2026-11-03', 9, 1, { status: 403, body: { error: 'FORBIDDEN' } }),
    DB({ length: 0 }),
  ]),
  ca('IT-07', 'Verify that an unknown lab code is reported as 404 by the lab repository', PRE, [
    book('student1', 'LAB99', '2026-11-03', 9, 1, { status: 404, body: { error: 'LAB_NOT_FOUND' } }),
  ]),
  ca('IT-08', 'Verify that a student cannot hold two overlapping bookings in different labs', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 2, { status: 201 }),
    book('student1', 'LAB02', '2026-11-03', 10, 2, { status: 409, body: { error: 'OVERLAP' } }),
  ]),
  ca('IT-09', 'Verify that the weekly 6-hour limit from the service is returned as 422 WEEKLY_LIMIT', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-04', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-05', 9, 1, { status: 422, body: { error: 'WEEKLY_LIMIT' } }),
  ]),
  ca('IT-10', 'Verify that GET /api/bookings/me returns only the caller’s bookings', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 1, { status: 201 }),
    book('student2', 'LAB01', '2026-11-03', 9, 1, { status: 201 }),
    b('student1', 'GET /api/bookings/me', undefined, { status: 200, body: { length: 1, 0: { email: 'an@fpt.edu.vn' } } }),
  ]),
  ca('IT-11', 'Verify that cancelling a confirmed booking updates the database, promotes the waitlist and e-mails the promoted student', PRE, [
    book('student1', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { code: 'BK0001', status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { code: 'BK0002', status: 'PENDING' } }),
    b('student1', 'DELETE /api/bookings/BK0001', undefined, { status: 200, body: { status: 'CANCELLED' } }),
    DB({ 0: { code: 'BK0001', status: 'CANCELLED' }, 1: { code: 'BK0002', status: 'CONFIRMED' } }),
    MAIL({ length: 3, 2: { to: 'binh@fpt.edu.vn', subject: 'Booking confirmed', ref: 'BK0002' } }),
  ]),
  ca('IT-12', 'Verify that closing a lab cancels its confirmed AND pending bookings and e-mails every student', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB01', '2026-11-03', 9, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student3', 'LAB01', '2026-11-03', 9, 2, { status: 201, body: { status: 'PENDING' } }),
    b('manager', 'PATCH /api/labs/LAB01', { status: 'CLOSED' }, { status: 200, body: { status: 'CLOSED', cancelled: 3 } }),
    DB({ 0: { status: 'CANCELLED' }, 1: { status: 'CANCELLED' }, 2: { status: 'CANCELLED' } }),
    MAIL({ length: 6, 5: { to: 'chi@fpt.edu.vn', subject: 'Lab closed - booking cancelled' } }),
  ]),
  ca('IT-13', 'Verify that a STUDENT token is refused by the lab-management endpoint', PRE, [
    b('student1', 'PATCH /api/labs/LAB01', { status: 'CLOSED' }, { status: 403, body: { error: 'FORBIDDEN' } }),
  ]),
];

const G = (ma, ten, tenVi, nhom, an) => ({ ma, ten, tenVi, nhom, ...(an ? { an: true } : {}) });
const CAN = [
  G('POST /api/auth/login 200', 'login succeeds (auth service ↔ token)', 'đăng nhập thành công (auth service ↔ token)', 'f2'),
  G('POST /api/auth/login 401 AUTH_INVALID', 'wrong password → 401', 'sai mật khẩu → 401', 'f2'),
  G('POST /api/auth/login 423 ACCOUNT_LOCKED', 'locked account → 423', 'tài khoản bị khoá → 423', 'f2'),
  G('EVENT LOCK', 'the lock is written and checked afterwards', 'việc khoá được ghi và kiểm lại sau đó', 'f2'),
  G('POST /api/bookings 401 UNAUTHENTICATED', 'no token → 401 at the security filter', 'không token → 401 ở bộ lọc bảo mật', 'f2'),
  G('POST /api/bookings 403 FORBIDDEN', 'wrong role → 403', 'sai vai trò → 403', 'f2'),
  G('POST /api/bookings 201 CONFIRMED', 'booking created as CONFIRMED', 'tạo booking CONFIRMED', 'f3'),
  G('POST /api/bookings 201 PENDING', 'booking created as PENDING (lab full)', 'tạo booking PENDING (phòng đầy)', 'f3'),
  G('POST /api/bookings 400 VALIDATION', 'validation error mapped to 400', 'lỗi kiểm hợp lệ ra 400', 'f3'),
  G('POST /api/bookings 404 LAB_NOT_FOUND', 'repository lookup → 404', 'tra repository → 404', 'f3'),
  G('POST /api/bookings 409 OVERLAP', 'service rule → 409 OVERLAP', 'luật service → 409 OVERLAP', 'f3'),
  G('POST /api/bookings 422 WEEKLY_LIMIT', 'service rule → 422 WEEKLY_LIMIT', 'luật service → 422 WEEKLY_LIMIT', 'f3'),
  G('GET /test/db/bookings 200', 'the database row is checked directly', 'kiểm thẳng dòng trong CSDL', 'f3'),
  G('GET /test/outbox 200', 'the e-mail sent to the mail service is checked', 'kiểm thư đã gửi sang dịch vụ thư', 'f3'),
  G('GET /api/bookings/me 200', 'the "my bookings" query is checked', 'kiểm truy vấn "booking của tôi"', 'f3'),
  G('DELETE /api/bookings/:code 200 CANCELLED', 'cancellation succeeds', 'huỷ thành công', 'f4'),
  G('EVENT PROMOTE', 'a waitlist promotion happens and is verified', 'có nâng hạng danh sách chờ và được kiểm', 'f4'),
  G('PATCH /api/labs/:lab 200 CLOSED', 'manager closes a lab', 'quản lý đóng phòng', 'f5'),
  G('PATCH /api/labs/:lab 403 FORBIDDEN', 'a non-manager is refused', 'người không phải quản lý bị từ chối', 'f5'),
  G('EVENT CASCADE', 'the close cascades to bookings and is verified', 'đóng phòng lan sang booking và được kiểm', 'f5'),
];

const KIEM = [
  ...kiemKichBan({
    bien: 'TEST_CASES', minCa: 10, can: CAN, nhomCauTruc: 'f1',
    dotBien: DOT_BIEN_TICH_HOP.map((m, i) => ({ ...m, an: i >= 6 })), nhomDotBien: 'f6',
  }),
  ...kiemKhoa([
    { moTa: { en: 'Statistics — Sub total Passed', vi: 'Thống kê — tổng Passed' }, bieuThuc: 'STATS.passed', chap: [16], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Sub total Failed', vi: 'Thống kê — tổng Failed' }, bieuThuc: 'STATS.failed', chap: [3], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Sub total Pending', vi: 'Thống kê — tổng Pending' }, bieuThuc: 'STATS.pending', chap: [2], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Sub total N/A', vi: 'Thống kê — tổng N/A' }, bieuThuc: 'STATS.na', chap: [4], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Number of test cases', vi: 'Thống kê — số test case' }, bieuThuc: 'STATS.total', chap: [25], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Test coverage % (2 decimals)', vi: 'Thống kê — Test coverage % (2 chữ số)' }, bieuThuc: 'STATS.testCoverage', chap: [90.48], kieu: 'so', saiSo: 0.006, nhom: 'f7', goiY: 'N/A is removed from the denominator: (P + F) × 100 / (Total − N/A)' },
    { moTa: { en: 'Statistics — Test successful coverage % (2 decimals)', vi: 'Thống kê — Test successful coverage % (2 chữ số)' }, bieuThuc: 'STATS.successfulCoverage', chap: [76.19], kieu: 'so', saiSo: 0.006, nhom: 'f7' },
    { moTa: { en: 'Template bug — the column Round 2 must count', vi: 'Lỗi template — cột mà Round 2 phải đếm' }, bieuThuc: 'STATS.round2Column', chap: ['I'], nhom: 'f7', an: true },
  ]),
];

const KIEN_TRUC = svg({
  w: 640, h: 300, tieuDe: 'LabBook — components and the integration points under test',
  nut: [
    { id: 'c', x: 80, y: 150, hinh: 'hop', nhan: 'Test client\n(Postman / tests)', rong: 120, cao: 50 },
    { id: 'f', x: 250, y: 70, hinh: 'chu', nhan: 'Security filter\n(token, role)', rong: 130, cao: 46 },
    { id: 'a', x: 250, y: 170, hinh: 'chu', nhan: 'REST controllers\n(status mapping)', rong: 130, cao: 46 },
    { id: 's', x: 420, y: 170, hinh: 'chu', nhan: 'Booking / Auth /\nLab services', rong: 130, cao: 46 },
    { id: 'r', x: 570, y: 110, hinh: 'hop', nhan: 'Repository\n+ database', rong: 110, cao: 46 },
    { id: 'm', x: 570, y: 240, hinh: 'hop', nhan: 'Mail service\n(outbox)', rong: 110, cao: 46 },
  ],
  canh: [
    { tu: 'c', den: 'f', nhan: 'HTTP' }, { tu: 'f', den: 'a', nhan: '①' }, { tu: 'a', den: 's', nhan: '②' },
    { tu: 's', den: 'r', nhan: '③' }, { tu: 's', den: 'm', nhan: '④' },
  ],
  chu: [{ x: 320, y: 285, nhan: '① authentication/authorisation  ② error → status mapping  ③ persistence & queries  ④ notifications', co: 11 }],
});
const TUAN_TU = svgTuanTu({
  tieuDe: 'Sequence — DELETE /api/bookings/BK0001 with a waitlist (case IT-11)',
  ben: ['Client', 'Security', 'Controller', 'BookingService', 'Repository', 'MailService'],
  rong: 112,
  tin: [
    { tu: 0, den: 1, nhan: 'DELETE + token' }, { tu: 1, den: 2, nhan: 'user = an' }, { tu: 2, den: 3, nhan: 'cancel(BK0001)' },
    { tu: 3, den: 4, nhan: 'save CANCELLED' }, { tu: 3, den: 4, nhan: 'find PENDING' }, { tu: 3, den: 4, nhan: 'save CONFIRMED' },
    { tu: 3, den: 5, nhan: 'send(binh)' }, { tu: 2, den: 0, nhan: '200 CANCELLED', tra: true },
  ],
});
const BANG_THONG_KE = bangHtml(['Feature (sheet)', 'Cases', 'Passed', 'Failed', 'Pending', 'N/A'], [
  ['Authentication', '8', '6', '1', '1', '0'], ['Booking', '12', '8', '2', '0', '2'], ['Notification', '5', '2', '0', '1', '2'],
]);

const BAN_IN = {
  tieuDe: 'Lab 3 Practice — Integration Test Report 5.2 on LabBook',
  phu: { en: 'SWT301 Lab 3 format (Report5.2_Integration Test) · executable test cases · 9 interface faults to catch · 10 marks', vi: 'Định dạng Lab 3 SWT301 (Report5.2_Integration Test) · test case chạy thật · 9 lỗi giao tiếp phải bắt · 10 điểm' },
  moTa: {
    en: `<p>Your team’s Lab 3 is <b>Report 5.2 — Integration Test</b>: one sheet per module, one row per test case (description · procedure · expected results · pre-conditions · Round 1–3). It checks that the PARTS of the system talk to each other correctly — security filter ↔ controllers ↔ services ↔ repository/database ↔ external services — not that a single method computes the right value (that was Lab 2) and not the end-user journey (that is Lab 4).</p>
<p>Here the system is <b>LabBook</b>, the same kind of lab-booking system as your LabFlow Demo. Every test case you write is <b>executed</b>: each step is an API call made by an actor, and its <code>expect</code> is your <i>Expected Result</i>. A case is correct when all its expectations hold on the correct build. The grader then runs your cases against <b>9 faulty builds</b>, each with one classic interface fault (wrong error mapping, data not persisted, missing role check, event not published…). Good integration tests catch them; tests that only look at the HTTP status do not.</p>
${KIEN_TRUC}
<h3>System under test — API contract</h3>${LABBOOK_API.en}
${TUAN_TU}`,
    vi: `<p>Lab 3 của nhóm là <b>Report 5.2 — Integration Test</b>: mỗi module một sheet, mỗi dòng một test case (mô tả · các bước · kết quả mong đợi · tiền điều kiện · Round 1–3). Nó kiểm các PHẦN của hệ thống nói chuyện với nhau đúng — bộ lọc bảo mật ↔ controller ↔ service ↔ repository/CSDL ↔ dịch vụ ngoài — không phải một hàm tính đúng (đó là Lab 2) và không phải hành trình người dùng (đó là Lab 4).</p>
<p>Ở đây hệ thống là <b>LabBook</b>, cùng kiểu hệ thống đặt phòng lab như LabFlow Demo. Mỗi test case bạn viết được <b>chạy thật</b>: mỗi bước là một lời gọi API do một actor thực hiện, và <code>expect</code> chính là <i>Expected Result</i>. Ca đúng khi mọi kỳ vọng đều khớp trên bản build đúng. Sau đó máy chấm chạy các ca của bạn trên <b>9 bản build lỗi</b>, mỗi bản một lỗi giao tiếp kinh điển (đổi mã lỗi sai, không lưu dữ liệu, thiếu kiểm vai trò, không phát sự kiện…). Test tích hợp tốt bắt được chúng; test chỉ nhìn status HTTP thì không.</p>
${KIEN_TRUC}
<h3>Hệ thống được kiểm thử — hợp đồng API</h3>${LABBOOK_API.vi}
${TUAN_TU}`,
  },
  chucNangChinh: [
    { en: 'Write the Report 5.2 sheet for the Authentication, Booking and Lab-management modules as executable test cases.', vi: 'Viết sheet Report 5.2 cho các module Authentication, Booking và Lab management dưới dạng test case chạy được.' },
    { en: 'Cover every integration point ①–④ and verify side effects in the database and the mail service, not only HTTP statuses.', vi: 'Phủ mọi điểm tích hợp ①–④ và kiểm hiệu ứng phụ trong CSDL và dịch vụ thư, không chỉ status HTTP.' },
    { en: 'Fill the Test Statistics sheet with the Report 5.2 formulas.', vi: 'Điền sheet Test Statistics bằng công thức của Report 5.2.' },
  ],
  yeuCauChung: [
    { en: 'Each case is independent: it starts from the seed data (no booking, clock 08:00 on 2026-11-02). Booking codes are BK0001, BK0002… in the order they are created INSIDE the case.', vi: 'Mỗi ca độc lập: bắt đầu từ dữ liệu mẫu (chưa có booking, đồng hồ 08:00 ngày 2026-11-02). Mã booking là BK0001, BK0002… theo thứ tự tạo TRONG ca đó.' },
    { en: '<code>expect</code> matches partially: only the keys you write are compared (arrays by index, or <code>length</code>). Write enough to prove the integration, e.g. the status in the database row.', vi: '<code>expect</code> so khớp một phần: chỉ so các khoá bạn ghi (mảng theo chỉ số, hoặc <code>length</code>). Ghi đủ để chứng minh tích hợp, vd trạng thái của dòng trong CSDL.' },
    { en: 'Use <code>GET /test/db/bookings</code> and <code>GET /test/outbox</code> (any actor) to check the database and the mail service.', vi: 'Dùng <code>GET /test/db/bookings</code> và <code>GET /test/outbox</code> (actor nào cũng được) để kiểm CSDL và dịch vụ thư.' },
  ],
  cayThuMuc: `answers/
├── integration-tests.js   ← const TEST_CASES = [...]   (Report 5.2 — one object per test-case row)
└── statistics.js          ← const STATS = {...}        (Test Statistics sheet)`,
  moHinh: {
    ten: 'TEST_CASES[i] — one row of the Report 5.2 sheet',
    truong: [
      ['id', 'string', { en: 'Test Case ID, e.g. "IT-01"', vi: 'Test Case ID, vd "IT-01"' }],
      ['description', 'string', { en: 'Test Case Description — "Verify that …"', vi: 'Test Case Description — "Verify that …"' }],
      ['precondition', 'string', { en: 'Pre-conditions', vi: 'Pre-conditions' }],
      ['steps[j].as', 'string', { en: 'actor: student1 · student2 · student3 · manager · admin · guest (omit for login calls)', vi: 'actor: student1 · student2 · student3 · manager · admin · guest (bỏ trống với lệnh login)' }],
      ['steps[j].call · body', 'string · object', { en: 'Test Case Procedure: "POST /api/bookings" + request body', vi: 'Test Case Procedure: "POST /api/bookings" + body gửi đi' }],
      ['steps[j].expect', '{ status, body }', { en: 'Expected Results of that step (partial match)', vi: 'Expected Results của bước đó (so khớp một phần)' }],
      ['STATS', 'object', { en: '{ passed, failed, pending, na, total, testCoverage, successfulCoverage, round2Column }', vi: '{ passed, failed, pending, na, total, testCoverage, successfulCoverage, round2Column }' }],
    ],
  },
  duLieuMau: `{
  id: 'IT-04', description: 'Verify that a confirmed booking is saved in the bookings table and an e-mail is sent',
  precondition: 'Seed data loaded; clock 2026-11-02 08:00',
  steps: [
    { as: 'student1', call: 'POST /api/bookings', body: { labCode: 'LAB01', date: '2026-11-03', startHour: 9, duration: 2 },
      expect: { status: 201, body: { code: 'BK0001', status: 'CONFIRMED' } } },
    { as: 'admin', call: 'GET /test/db/bookings', expect: { status: 200, body: { length: 1, 0: { code: 'BK0001', status: 'CONFIRMED' } } } },
  ],
}`,
  chucNang: [
    {
      ten: { en: 'Report 5.2 sheet — complete and correct', vi: 'Sheet Report 5.2 — đầy đủ và đúng' }, diem: 1.5,
      yeuCau: [
        { en: 'At least 10 test cases, unique ids, description, precondition, steps.', vi: 'Ít nhất 10 test case, id không trùng, có mô tả, tiền điều kiện, các bước.' },
        { en: 'Every case PASSES on the correct build — an expected result that disagrees with the contract is a wrong test case.', vi: 'Mọi ca ĐẠT trên bản build đúng — kết quả mong đợi trái hợp đồng API là test case sai.' },
      ],
      hook: ['Report5.2', 'test procedure'],
    },
    {
      ten: { en: 'Authentication ↔ security filter ↔ users table', vi: 'Authentication ↔ bộ lọc bảo mật ↔ bảng users' }, diem: 1.5,
      yeuCau: [
        { en: 'Login success; wrong password; the 3rd failure locks the account (and the lock is observed afterwards); a successful login resets the counter.', vi: 'Đăng nhập đúng; sai mật khẩu; sai lần 3 khoá tài khoản (và quan sát được việc khoá sau đó); đăng nhập đúng đặt lại bộ đếm.' },
        { en: 'A protected endpoint without a token (401) and with the wrong role (403).', vi: 'Endpoint cần đăng nhập khi không có token (401) và sai vai trò (403).' },
      ],
      hook: ['integration point ①'],
    },
    {
      ten: { en: 'Booking: controller ↔ service ↔ repository ↔ mail', vi: 'Booking: controller ↔ service ↔ repository ↔ mail' }, diem: 2,
      yeuCau: [
        { en: 'CONFIRMED and PENDING creation, a validation error, an unknown lab, an overlap and the weekly limit — each with the exact status and error code.', vi: 'Tạo CONFIRMED và PENDING, lỗi kiểm hợp lệ, phòng không tồn tại, trùng giờ và giới hạn tuần — mỗi ca đúng status và mã lỗi.' },
        { en: 'Prove persistence (database row) and notification (outbox), and that “my bookings” returns only the caller’s rows.', vi: 'Chứng minh dữ liệu được lưu (dòng CSDL), thư được gửi (outbox), và “booking của tôi” chỉ trả của chính người gọi.' },
      ],
      hook: ['integration points ② ③ ④'],
    },
    {
      ten: { en: 'Cancellation and waitlist promotion', vi: 'Huỷ và nâng hạng danh sách chờ' }, diem: 1.5,
      yeuCau: [
        { en: 'Cancel a CONFIRMED booking that has a waitlist; check the old row is CANCELLED, the pending one is CONFIRMED, and the promoted student got an e-mail.', vi: 'Huỷ một booking CONFIRMED có danh sách chờ; kiểm dòng cũ là CANCELLED, dòng chờ thành CONFIRMED, và sinh viên được nâng nhận thư.' },
      ],
      hook: ['event-driven integration'],
    },
    {
      ten: { en: 'Lab management cascade', vi: 'Đóng phòng lan truyền' }, diem: 1,
      yeuCau: [
        { en: 'The manager closes a lab that has CONFIRMED and PENDING bookings: every one is cancelled and every student is e-mailed. A student cannot call the endpoint.', vi: 'Quản lý đóng một phòng có booking CONFIRMED và PENDING: tất cả bị huỷ và mọi sinh viên nhận thư. Sinh viên không gọi được endpoint này.' },
      ],
      hook: ['cascade', 'authorisation'],
    },
    {
      ten: { en: 'Catch the interface faults', vi: 'Bắt các lỗi giao tiếp' }, diem: 1.5,
      yeuCau: [
        { en: 'Your cases run against 9 faulty builds (6 described in the checks, 3 hidden). A fault is caught when one of your passing cases fails on it.', vi: 'Các ca của bạn chạy trên 9 bản build lỗi (6 bản có mô tả, 3 bản ẩn). Lỗi bị bắt khi một ca đạt của bạn trượt trên bản đó.' },
      ],
      hook: ['fault-based testing'],
    },
    {
      ten: { en: 'Test Statistics sheet', vi: 'Sheet Test Statistics' }, diem: 1,
      moTa: {
        en: `<p>Round 1 results of a Report 5.2 file:</p>${BANG_THONG_KE}<p>Fill <code>STATS</code>: the sub totals, the number of test cases, <b>Test coverage</b> and <b>Test successful coverage</b> with the Report 5.2 formulas (2 decimals), and the column that the Round 2 counters SHOULD count in the template (the empty template wrongly counts Round 1’s column F; Round 2 results are in column I, Round 3 in column L).</p>`,
        vi: `<p>Kết quả Round 1 của một tệp Report 5.2:</p>${BANG_THONG_KE}<p>Điền <code>STATS</code>: các tổng, số test case, <b>Test coverage</b> và <b>Test successful coverage</b> theo công thức Report 5.2 (2 chữ số thập phân), và cột mà bộ đếm Round 2 LẼ RA phải đếm trong template (template trống đếm nhầm cột F của Round 1; kết quả Round 2 ở cột I, Round 3 ở cột L).</p>`,
      },
      yeuCau: [
        { en: 'Test coverage = (Passed + Failed) × 100 / (Total − N/A). Test successful coverage = Passed × 100 / (Total − N/A).', vi: 'Test coverage = (Passed + Failed) × 100 / (Total − N/A). Test successful coverage = Passed × 100 / (Total − N/A).' },
      ],
      hook: ['test metrics'],
    },
  ],
  idBatBuoc: [
    ['TEST_CASES', { en: 'answers/integration-tests.js', vi: 'answers/integration-tests.js' }],
    ['STATS', { en: 'answers/statistics.js', vi: 'answers/statistics.js' }],
  ],
  truDiem: [
    { en: 'Checking only the HTTP status: “201” does not prove the row was saved or the e-mail sent (builds I2, I4 and I6 return the right status).', vi: 'Chỉ kiểm status HTTP: “201” không chứng minh dòng đã lưu hay thư đã gửi (bản I2, I4, I6 trả đúng status).' },
    { en: 'One giant case that tests everything — the first failure hides the rest and the sheet cannot show which interface broke.', vi: 'Một ca khổng lồ kiểm mọi thứ — lỗi đầu tiên che phần còn lại và sheet không cho thấy giao tiếp nào hỏng.' },
    { en: 'Unit-level cases (a single validation rule) presented as integration tests — that is Report 5.1.', vi: 'Ca mức unit (một luật kiểm hợp lệ) trình bày như test tích hợp — đó là Report 5.1.' },
    { en: 'Forgetting to remove N/A from the denominator of the coverage formulas.', vi: 'Quên bỏ N/A khỏi mẫu số của công thức coverage.' },
  ],
  nopBai: NOP_BAI,
};

const DAU_TC = `// Report 5.2 — Integration Test. One object per test-case row. Every case starts from the seed data.
// steps: { as: 'student1' | 'student2' | 'student3' | 'manager' | 'admin' | 'guest', call: 'METHOD /path', body?, expect?: { status, body } }
const TEST_CASES = [
${jsLit(GIAI_DS[0], '  ').replace(/^/, '  ')},
];
`;
const GIAI_TC = `// Report 5.2 — Integration Test (Authentication · Booking · Lab management). 13 cases.
// Each case proves one integration: security filter ↔ controller ↔ service ↔ repository/DB ↔ mail service.
const TEST_CASES = ${jsLit(GIAI_DS)};
`;
const DAU_ST = `// Test Statistics sheet (Report 5.2) — Round 1 figures of the table in the brief.
const STATS = {
  passed: 0,
  failed: 0,
  pending: 0,
  na: 0,
  total: 0,
  testCoverage: 0,          // (Passed + Failed) × 100 / (Total − N/A), 2 decimals
  successfulCoverage: 0,    // Passed × 100 / (Total − N/A), 2 decimals
  round2Column: '',         // the column the Round 2 counters must count
};
`;
const GIAI_ST = `// Test Statistics sheet (Report 5.2): sub totals of the three features.
// Applicable cases = 25 − 4 N/A = 21.
const STATS = {
  passed: 16,               // 6 + 8 + 2
  failed: 3,                // 1 + 2 + 0
  pending: 2,               // 1 + 0 + 1
  na: 4,                    // 0 + 2 + 2
  total: 25,                // 8 + 12 + 5
  testCoverage: 90.48,      // (16 + 3) × 100 / 21 = 90.476…
  successfulCoverage: 76.19, // 16 × 100 / 21 = 76.190…
  round2Column: 'I',        // Round 1 = F, Round 2 = I, Round 3 = L
};
`;

export default doiDau({
  slug: 'swt301-10-lab3-integration-report52',
  ten: 'Lab 3 Practice — Integration Test Report 5.2 (LabBook)',
  khoa: KHOA,
  baiHoc: 'swt301-lab3-report-templates',
  de: [
    {
      dangBai: 'lab',
      tieuDe: 'Lab 3 Practice — Report 5.2 Integration Test on LabBook',
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      ngonNgu: 'javascript',
      viDu: [{
        input: 'student1 cancels BK0001 (CONFIRMED, LAB02) while student2 waits with BK0002 (PENDING)',
        output: 'DELETE → 200 CANCELLED · DB: BK0001 CANCELLED, BK0002 CONFIRMED · outbox[2] = { to: binh@fpt.edu.vn, subject: "Booking confirmed" }',
        explanation: 'One action, four components checked: controller (status), service (promotion), repository (rows), mail service (e-mail).|||Một thao tác, kiểm bốn thành phần: controller (status), service (nâng hạng), repository (các dòng), dịch vụ thư (thư).',
      }],
      khaiNiem: ['integration testing', 'component integration testing', 'interface fault', 'Report 5.2', 'test hook', 'side effects', 'test statistics'],
      tienQuyet: ['SWT301 2.2 test levels', 'Lab 3 — report templates'],
      the: ['swt301', 'lab3', 'integration-testing', 'report-5.2'],
      banIn: BAN_IN,
      thuatNgu: [
        ...tn('stub', 'driver', 'regression', 'expected', 'precondition'),
        { en: 'integration testing', vi: 'kiểm thử tích hợp — kiểm giao tiếp giữa các thành phần/hệ thống' },
        { en: 'interface fault', vi: 'lỗi giao tiếp — mỗi phần đúng riêng nhưng nối với nhau sai (sai mã lỗi, sai trường, không lưu…)' },
        { en: 'side effect', vi: 'hiệu ứng phụ — thay đổi trong CSDL, thư gửi đi… ngoài giá trị trả về' },
        { en: 'test hook', vi: 'cửa riêng của môi trường test để nhìn vào CSDL / hộp thư' },
        { en: 'cascade', vi: 'lan truyền — thao tác ở bảng này kéo theo thay đổi ở bảng khác' },
        { en: 'waitlist / promote', vi: 'danh sách chờ / nâng hạng lên CONFIRMED' },
        { en: 'test coverage (Report 5.x)', vi: 'tỉ lệ ca đã chạy = (P + F) × 100 / (Total − N/A) — KHÔNG phải độ phủ mã' },
      ],
      goiY: [
        'Vẽ lại sơ đồ thành phần: mỗi mũi tên ①–④ cần ít nhất một ca chứng minh nó hoạt động. Ca tốt = gọi API rồi KIỂM HIỆU ỨNG ở phía bên kia (dòng CSDL, thư).',
        'Status 201 chưa đủ: thêm bước GET /test/db/bookings (kiểm dòng đã lưu, trạng thái) và GET /test/outbox (kiểm thư: to, subject, ref).',
        'Danh sách chờ: LAB02 chỉ có 1 chỗ — student1 đặt trước (CONFIRMED), student2 đặt cùng giờ (PENDING); student1 huỷ BK0001 ⇒ BK0002 phải thành CONFIRMED và binh nhận "Booking confirmed".',
        'Đóng phòng: LAB01 có 2 chỗ — ba sinh viên đặt cùng giờ ⇒ 2 CONFIRMED + 1 PENDING; manager PATCH LAB01 CLOSED ⇒ cancelled: 3 và ba thư.',
      ],
      loiHayGap: [
        'Chỉ ghi <code>expect: { status: 200 }</code> cho lệnh huỷ — bản build chỉ sửa bản sao (I6) vẫn trả 200 CANCELLED nên lọt; phải đọc lại dòng trong CSDL.',
        'Viết ca "lỗi tuần" nhưng đặt các booking ở hai tuần khác nhau (09/11 là tuần sau) — không chạm giới hạn 6 giờ.',
        'Kỳ vọng mã booking sai: mỗi ca chạy trên hệ thống MỚI nên booking đầu tiên của ca luôn là BK0001.',
        'Thống kê: chia cho Total thay vì Total − N/A (đó là công thức của Report 5.1).',
      ],
      moTaNgan: 'Luyện Lab 3 (Report 5.2): viết test case tích hợp chạy thật trên LabBook — kiểm bộ lọc bảo mật, controller, service, CSDL và dịch vụ thư; bắt 9 lỗi giao tiếp; điền sheet thống kê.',
      giaiThich: {
        en: `<p>An integration test case is judged by the <b>interface it proves</b>. IT-04 does not stop at “201”: it reads the database row and the outbox, so a build that forgets to save (I2) or to notify fails. IT-11 is the richest case: one cancellation touches four components (controller → service → repository twice → mail service) and checks each of them. IT-12 checks the cascade on CONFIRMED <i>and</i> PENDING rows (I5). Role checks (IT-06, IT-13) catch a mis-configured security filter (I3); IT-03 catches the failure counter that is never reset (I9).</p>
<p>Statistics: applicable cases = 25 − 4 = 21 ⇒ coverage = 19 × 100 / 21 = 90.48%, successful = 16 × 100 / 21 = 76.19%.</p>
<pre>// The same case as a Spring Boot integration test (MockMvc + real service + H2)
@Test
void cancelPromotesWaitlist() throws Exception {
    String an = login("an@fpt.edu.vn", "An@12345"), binh = login("binh@fpt.edu.vn", "Binh@123");
    book(an, "LAB02", "2026-11-03", 10, 2).andExpect(jsonPath("$.status").value("CONFIRMED"));
    book(binh, "LAB02", "2026-11-03", 10, 2).andExpect(jsonPath("$.status").value("PENDING"));
    mvc.perform(delete("/api/bookings/BK0001").header("Authorization", "Bearer " + an))
       .andExpect(status().isOk());
    assertEquals("CONFIRMED", bookingRepo.findByCode("BK0002").getStatus());   // ③ repository
    verify(mailService).send(eq("binh@fpt.edu.vn"), eq("Booking confirmed"), any()); // ④ mail
}</pre>`,
        vi: `<p>Một test case tích hợp được đánh giá bằng <b>giao tiếp mà nó chứng minh</b>. IT-04 không dừng ở “201”: nó đọc dòng CSDL và outbox, nên bản build quên lưu (I2) hay quên gửi thư sẽ trượt. IT-11 giàu nhất: một lần huỷ chạm bốn thành phần (controller → service → repository hai lần → dịch vụ thư) và kiểm từng cái. IT-12 kiểm lan truyền trên dòng CONFIRMED <i>và</i> PENDING (I5). Các ca kiểm vai trò (IT-06, IT-13) bắt bộ lọc bảo mật cấu hình sai (I3); IT-03 bắt bộ đếm sai không được đặt lại (I9).</p>
<p>Thống kê: số ca áp dụng = 25 − 4 = 21 ⇒ coverage = 19 × 100 / 21 = 90,48%, successful = 16 × 100 / 21 = 76,19%.</p>`,
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/integration-tests.js', 'answers/statistics.js'], kiem: KIEM },
      khoiDau: { 'answers/integration-tests.js': DAU_TC, 'answers/statistics.js': DAU_ST },
      loiGiai: { 'answers/integration-tests.js': GIAI_TC, 'answers/statistics.js': GIAI_ST },
      thamKhao: 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/',
      boYeu: [
        { ten: 'chỉ kiểm status (bỏ mọi bước GET kiểm CSDL/thư/danh sách)', tep: { 'answers/integration-tests.js': `const TEST_CASES = ${jsLit(GIAI_DS.map((c) => ({ ...c, steps: c.steps.filter((x) => !/^GET /.test(x.call)) })))};\n` }, phaiTruot: ['Detects faulty build I6', 'Covers: the database row is checked directly'] },
        { ten: 'không có ca danh sách chờ', tep: { 'answers/integration-tests.js': GIAI_TC.replace(/\n {2}\{\n {4}id: 'IT-11'[\s\S]*?\n {2}\},/, '').replace(/\n {2}\{\n {4}id: 'IT-05'[\s\S]*?\n {2}\},/, '') }, phaiTruot: ['Covers: a waitlist promotion happens and is verified', 'Detects faulty build I4'] },
        { ten: 'thống kê chia cho Total', tep: { 'answers/statistics.js': GIAI_ST.replace('testCoverage: 90.48', 'testCoverage: 76.00').replace('successfulCoverage: 76.19', 'successfulCoverage: 64.00') }, phaiTruot: ['Test coverage %'] },
      ],
    },
  ],
});
