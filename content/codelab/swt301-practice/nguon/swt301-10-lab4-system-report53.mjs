/**
 * SWT301 · LUYỆN LAB 4 — System test, Report 5.3, trên LabBook.
 * Đề trường (cô giao 24/10): Report 5.3 — mỗi thành viên một WORKFLOW nghiệp vụ đầu-cuối của một vai trò (sheet riêng),
 * các ca gom theo scenario, chạy nhiều round, kèm Evidence; sheet Test Statistics dùng công thức có trừ N/A.
 * Sâu hơn: mọi ca chạy thật (hành trình nhiều vai trò), đo phủ theo luật nghiệp vụ, phải bắt 8 bản lỗi MỨC HỆ THỐNG.
 */
import { doiDau, KHOA, svg, jsLit, kiemKhoa, NOP_BAI, tn, bangHtml } from './_chung.mjs';
import { kiemKichBan, LABBOOK_API, DOT_BIEN_HE_THONG } from './_labbook.mjs';

const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const login = (email, password, expect) => ({ call: 'POST /api/auth/login', body: { email, password }, expect });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);
const huy = (as, code, expect) => b(as, `DELETE /api/bookings/${code}`, undefined, expect);
const me = (as, body) => b(as, 'GET /api/bookings/me', undefined, { status: 200, body });
const ca = (id, workflow, description, precondition, steps) => ({ id, workflow, description, precondition, steps });
const PRE = 'System running with seed data; clock Mon 2026-11-02 08:00';

const GIAI_DS = [
  ca('SB-1', 'StudentBooking', 'Verify the main journey: view labs, book a seat, see it in My Bookings, cancel it', PRE, [
    b('guest', 'GET /api/labs', undefined, { status: 200, body: { length: 3, 0: { code: 'LAB01', status: 'OPEN' } } }),
    book('student1', 'LAB01', '2026-11-04', 14, 2, { status: 201, body: { code: 'BK0001', status: 'CONFIRMED' } }),
    me('student1', { length: 1, 0: { code: 'BK0001', status: 'CONFIRMED' } }),
    huy('student1', 'BK0001', { status: 200, body: { status: 'CANCELLED' } }),
    me('student1', { 0: { code: 'BK0001', status: 'CANCELLED' } }),
  ]),
  ca('SB-2', 'StudentBooking', 'Verify that a booking for today must start at least one hour from now (08:00 rejected, 09:00 accepted)', PRE, [
    book('student1', 'LAB01', '2026-11-02', 8, 1, { status: 422, body: { error: 'TOO_SOON' } }),
    book('student1', 'LAB01', '2026-11-02', 9, 1, { status: 201, body: { status: 'CONFIRMED' } }),
  ]),
  ca('SB-3', 'StudentBooking', 'Verify the 14-day booking window (day 14 accepted, day 15 and yesterday rejected)', PRE, [
    book('student1', 'LAB01', '2026-11-16', 9, 1, { status: 201 }),
    book('student1', 'LAB01', '2026-11-17', 9, 1, { status: 422, body: { error: 'OUT_OF_WINDOW' } }),
    book('student1', 'LAB01', '2026-11-01', 9, 1, { status: 422, body: { error: 'OUT_OF_WINDOW' } }),
  ]),
  ca('SB-4', 'StudentBooking', 'Verify that a booking must end by 21:00 (18:00 + 3 h accepted, 19:00 + 3 h rejected)', PRE, [
    book('student1', 'LAB01', '2026-11-03', 18, 3, { status: 201 }),
    book('student2', 'LAB01', '2026-11-03', 19, 3, { status: 422, body: { error: 'AFTER_CLOSING' } }),
  ]),
  ca('SB-5', 'StudentBooking', 'Verify the 2-hour cancellation deadline (09:00 today too late, 10:00 today still allowed)', PRE, [
    book('student1', 'LAB01', '2026-11-02', 9, 1, { status: 201, body: { code: 'BK0001' } }),
    book('student1', 'LAB01', '2026-11-02', 10, 1, { status: 201, body: { code: 'BK0002' } }),
    huy('student1', 'BK0001', { status: 409, body: { error: 'TOO_LATE' } }),
    huy('student1', 'BK0002', { status: 200, body: { status: 'CANCELLED' } }),
  ]),
  ca('SB-6', 'StudentBooking', 'Verify that cancelled hours are not counted in the weekly 6-hour limit', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-04', 9, 3, { status: 201, body: { code: 'BK0002' } }),
    huy('student1', 'BK0002', { status: 200 }),
    book('student1', 'LAB01', '2026-11-05', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-06', 9, 1, { status: 422, body: { error: 'WEEKLY_LIMIT' } }),
  ]),
  ca('SB-7', 'StudentBooking', 'Verify that only the owner can cancel, and only once', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 1, { status: 201, body: { code: 'BK0001' } }),
    huy('student2', 'BK0001', { status: 403, body: { error: 'NOT_OWNER' } }),
    huy('student1', 'BK0001', { status: 200 }),
    huy('student1', 'BK0001', { status: 409, body: { error: 'ALREADY_CANCELLED' } }),
  ]),
  ca('WL-1', 'Waitlist', 'Verify that the waitlist is promoted first come, first served when the seat is released', PRE, [
    book('student1', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { code: 'BK0002', status: 'PENDING' } }),
    book('student3', 'LAB02', '2026-11-03', 10, 2, { status: 201, body: { code: 'BK0003', status: 'PENDING' } }),
    huy('student1', 'BK0001', { status: 200 }),
    me('student2', { 0: { code: 'BK0002', status: 'CONFIRMED' } }),
    me('student3', { 0: { code: 'BK0003', status: 'PENDING' } }),
  ]),
  ca('WL-2', 'Waitlist', 'Verify that the promoted student receives a "Booking confirmed" e-mail', PRE, [
    book('student1', 'LAB02', '2026-11-05', 15, 1, { status: 201 }),
    book('student2', 'LAB02', '2026-11-05', 15, 1, { status: 201, body: { status: 'PENDING' } }),
    huy('student1', 'BK0001', { status: 200 }),
    b('admin', 'GET /test/outbox', undefined, { status: 200, body: { length: 3, 1: { to: 'binh@fpt.edu.vn', subject: 'Added to waitlist' }, 2: { to: 'binh@fpt.edu.vn', subject: 'Booking confirmed' } } }),
  ]),
  ca('LC-1', 'LabClosure', 'Verify that closing a lab cancels the students’ bookings and blocks new ones', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 2, { status: 201 }),
    b('manager', 'PATCH /api/labs/LAB01', { status: 'CLOSED' }, { status: 200, body: { status: 'CLOSED', cancelled: 1 } }),
    me('student1', { 0: { status: 'CANCELLED' } }),
    book('student2', 'LAB01', '2026-11-04', 9, 1, { status: 409, body: { error: 'LAB_CLOSED' } }),
  ]),
  ca('LC-2', 'LabClosure', 'Verify that a lab re-opened by the manager accepts bookings again', PRE, [
    b('manager', 'PATCH /api/labs/LAB03', { status: 'OPEN' }, { status: 200, body: { status: 'OPEN' } }),
    b('guest', 'GET /api/labs', undefined, { status: 200, body: { 2: { code: 'LAB03', status: 'OPEN' } } }),
    book('student1', 'LAB03', '2026-11-03', 9, 1, { status: 201, body: { status: 'CONFIRMED' } }),
  ]),
  ca('LC-3', 'LabClosure', 'Verify that the lab closed in the seed data refuses bookings', PRE, [
    book('student1', 'LAB03', '2026-11-03', 9, 1, { status: 409, body: { error: 'LAB_CLOSED' } }),
  ]),
  ca('AS-1', 'AccountSecurity', 'Verify that an account locked by the admin loses its session at once and works again after unlock', PRE, [
    book('student1', 'LAB01', '2026-11-03', 9, 1, { status: 201 }),
    b('admin', 'POST /api/admin/users/an@fpt.edu.vn/lock', undefined, { status: 200, body: { locked: true } }),
    book('student1', 'LAB01', '2026-11-04', 9, 1, { status: 401, body: { error: 'UNAUTHENTICATED' } }),
    login('an@fpt.edu.vn', 'An@12345', { status: 423, body: { error: 'ACCOUNT_LOCKED' } }),
    b('admin', 'POST /api/admin/users/an@fpt.edu.vn/unlock', undefined, { status: 200, body: { locked: false } }),
    login('an@fpt.edu.vn', 'An@12345', { status: 200, body: { role: 'STUDENT' } }),
  ]),
  ca('AS-2', 'AccountSecurity', 'Verify that three wrong passwords lock the account until the admin unlocks it', PRE, [
    login('binh@fpt.edu.vn', 'x1', { status: 401 }),
    login('binh@fpt.edu.vn', 'x2', { status: 401 }),
    login('binh@fpt.edu.vn', 'x3', { status: 401 }),
    login('binh@fpt.edu.vn', 'Binh@123', { status: 423, body: { error: 'ACCOUNT_LOCKED' } }),
    b('admin', 'POST /api/admin/users/binh@fpt.edu.vn/unlock', undefined, { status: 200 }),
    login('binh@fpt.edu.vn', 'Binh@123', { status: 200 }),
  ]),
];

const G = (ma, ten, tenVi, nhom, an) => ({ ma, ten, tenVi, nhom, ...(an ? { an: true } : {}) });
const CAN = [
  G('GET /api/labs 200', 'StudentBooking — browse the labs', 'StudentBooking — xem danh sách phòng', 'f2'),
  G('POST /api/bookings 201 CONFIRMED', 'StudentBooking — a seat is booked', 'StudentBooking — đặt được chỗ', 'f2'),
  G('GET /api/bookings/me 200', 'StudentBooking — My Bookings is checked', 'StudentBooking — kiểm Booking của tôi', 'f2'),
  G('DELETE /api/bookings/:code 200 CANCELLED', 'StudentBooking — the booking is cancelled', 'StudentBooking — huỷ booking', 'f2'),
  G('POST /api/bookings 422 TOO_SOON', 'BR — less than 1 hour ahead is refused', 'BR — đặt chưa đủ 1 giờ trước bị từ chối', 'f2'),
  G('POST /api/bookings 422 OUT_OF_WINDOW', 'BR — the 14-day window', 'BR — cửa sổ 14 ngày', 'f2'),
  G('POST /api/bookings 422 AFTER_CLOSING', 'BR — must end by 21:00', 'BR — phải kết thúc trước 21:00', 'f2'),
  G('DELETE /api/bookings/:code 409 TOO_LATE', 'BR — the 2-hour cancellation deadline', 'BR — hạn huỷ 2 giờ', 'f2'),
  G('POST /api/bookings 422 WEEKLY_LIMIT', 'BR — the weekly 6-hour limit', 'BR — giới hạn 6 giờ/tuần', 'f2'),
  G('DELETE /api/bookings/:code 403 NOT_OWNER', 'BR — only the owner can cancel', 'BR — chỉ chủ booking được huỷ', 'f2'),
  G('DELETE /api/bookings/:code 409 ALREADY_CANCELLED', 'BR — a booking is cancelled once', 'BR — chỉ huỷ được một lần', 'f2'),
  G('POST /api/bookings 201 PENDING', 'Waitlist — a full lab waitlists the student', 'Waitlist — phòng đầy thì vào danh sách chờ', 'f3'),
  G('EVENT PROMOTE', 'Waitlist — promotion happens and is observed', 'Waitlist — có nâng hạng và quan sát được', 'f3'),
  G('GET /test/outbox 200', 'Waitlist — the student’s mailbox is checked', 'Waitlist — kiểm hộp thư của sinh viên', 'f3'),
  G('PATCH /api/labs/:lab 200 CLOSED', 'LabClosure — the manager closes a lab', 'LabClosure — quản lý đóng phòng', 'f4'),
  G('EVENT CASCADE', 'LabClosure — existing bookings are cancelled and observed', 'LabClosure — booking hiện có bị huỷ và quan sát được', 'f4'),
  G('POST /api/bookings 409 LAB_CLOSED', 'LabClosure — a closed lab refuses bookings', 'LabClosure — phòng đóng từ chối booking', 'f4'),
  G('PATCH /api/labs/:lab 200 OPEN', 'LabClosure — the manager re-opens a lab', 'LabClosure — quản lý mở lại phòng', 'f4'),
  G('POST /api/admin/users/:email/lock 200', 'AccountSecurity — the admin locks an account', 'AccountSecurity — admin khoá tài khoản', 'f5'),
  G('POST /api/admin/users/:email/unlock 200', 'AccountSecurity — the admin unlocks it', 'AccountSecurity — admin mở khoá', 'f5'),
  G('POST /api/bookings 401 UNAUTHENTICATED', 'AccountSecurity — an old session is rejected', 'AccountSecurity — phiên cũ bị từ chối', 'f5'),
  G('POST /api/auth/login 423 ACCOUNT_LOCKED', 'AccountSecurity — a locked account cannot log in', 'AccountSecurity — tài khoản bị khoá không đăng nhập được', 'f5'),
  G('EVENT LOCK', 'AccountSecurity — the lock is observed afterwards', 'AccountSecurity — việc khoá quan sát được sau đó', 'f5'),
];
const LUONG = ['StudentBooking', 'Waitlist', 'LabClosure', 'AccountSecurity'];
const KIEM_LUONG = {
  moTa: { en: 'Every case belongs to one workflow sheet (StudentBooking, Waitlist, LabClosure, AccountSecurity) and every sheet has at least 2 cases', vi: 'Mỗi ca thuộc một sheet workflow (StudentBooking, Waitlist, LabClosure, AccountSecurity) và mỗi sheet có ít nhất 2 ca' },
  chuanBi: `const __KQ = (function () {
  if (typeof TEST_CASES === 'undefined' || !Array.isArray(TEST_CASES)) return 'TEST_CASES is missing';
  var L = ${JSON.stringify(LUONG)}, dem = {};
  for (var i = 0; i < TEST_CASES.length; i++) {
    var w = TEST_CASES[i] && TEST_CASES[i].workflow;
    if (L.indexOf(w) < 0) return (TEST_CASES[i] && TEST_CASES[i].id || '#' + (i + 1)) + ': workflow must be one of ' + L.join(', ');
    dem[w] = (dem[w] || 0) + 1;
  }
  var it = L.filter(function (w) { return (dem[w] || 0) < 2; });
  return it.length ? 'sheet(s) with fewer than 2 cases: ' + it.join(', ') : 'OK';
})();`,
  goi: '__KQ', mongDoi: 'OK', nhom: 'f1',
};

const KIEM = [
  KIEM_LUONG,
  ...kiemKichBan({
    bien: 'TEST_CASES', minCa: 12, can: CAN, nhomCauTruc: 'f1',
    dotBien: DOT_BIEN_HE_THONG.map((m, i) => ({ ...m, an: i >= 5 })), nhomDotBien: 'f6',
  }),
  ...kiemKhoa([
    { moTa: { en: 'Statistics — Passed (latest round)', vi: 'Thống kê — Passed (round mới nhất)' }, bieuThuc: 'STATS.passed', chap: [32], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Failed', vi: 'Thống kê — Failed' }, bieuThuc: 'STATS.failed', chap: [2], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Pending', vi: 'Thống kê — Pending' }, bieuThuc: 'STATS.pending', chap: [2], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — N/A', vi: 'Thống kê — N/A' }, bieuThuc: 'STATS.na', chap: [4], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Number of test cases', vi: 'Thống kê — số test case' }, bieuThuc: 'STATS.total', chap: [40], kieu: 'so', nhom: 'f7' },
    { moTa: { en: 'Statistics — Test coverage % (2 decimals)', vi: 'Thống kê — Test coverage % (2 chữ số)' }, bieuThuc: 'STATS.testCoverage', chap: [94.44], kieu: 'so', saiSo: 0.006, nhom: 'f7', goiY: '(Passed + Failed) × 100 / (Total − N/A)' },
    { moTa: { en: 'Statistics — Test successful coverage % (2 decimals)', vi: 'Thống kê — Test successful coverage % (2 chữ số)' }, bieuThuc: 'STATS.successfulCoverage', chap: [88.89], kieu: 'so', saiSo: 0.006, nhom: 'f7' },
    { moTa: { en: 'Statistics — which round a final report should show', vi: 'Thống kê — báo cáo cuối nên lấy round nào' }, bieuThuc: 'STATS.reportRound', chap: [3], kieu: 'so', nhom: 'f7', an: true },
  ]),
];

const LUONG_SVG = svg({
  w: 660, h: 250, tieuDe: 'The four workflows (one sheet each) and the roles that drive them',
  nut: [
    { id: 'sv', x: 80, y: 70, hinh: 'hop', nhan: 'Student', rong: 100 },
    { id: 'ql', x: 80, y: 150, hinh: 'hop', nhan: 'Manager', rong: 100 },
    { id: 'ad', x: 80, y: 220, hinh: 'hop', nhan: 'Admin', rong: 100 },
    { id: 'sb', x: 330, y: 50, hinh: 'tt', nhan: 'SB · StudentBooking\nlogin → labs → book → my → cancel', rong: 270, cao: 42 },
    { id: 'wl', x: 330, y: 110, hinh: 'tt', nhan: 'WL · Waitlist\nfull lab → PENDING → promotion', rong: 270, cao: 42 },
    { id: 'lc', x: 330, y: 168, hinh: 'tt', nhan: 'LC · LabClosure\nclose → cascade → reopen', rong: 270, cao: 42 },
    { id: 'as', x: 330, y: 222, hinh: 'tt', nhan: 'AS · AccountSecurity\nlock → session dies → unlock', rong: 270, cao: 42 },
    { id: 'kq', x: 580, y: 135, hinh: 'hop', nhan: 'Report 5.3\n1 sheet / workflow', rong: 120, cao: 46 },
  ],
  canh: [
    { tu: 'sv', den: 'sb' }, { tu: 'sv', den: 'wl' }, { tu: 'ql', den: 'lc' }, { tu: 'ad', den: 'as' },
    { tu: 'sb', den: 'kq', net: 'dut' }, { tu: 'wl', den: 'kq', net: 'dut' }, { tu: 'lc', den: 'kq', net: 'dut' }, { tu: 'as', den: 'kq', net: 'dut' },
  ],
});
const BANG = bangHtml(['Workflow (sheet)', 'Cases', 'Round 3: Passed', 'Failed', 'Pending', 'N/A'], [
  ['StudentBooking', '16', '14', '1', '0', '1'], ['Waitlist', '8', '6', '1', '1', '0'], ['LabClosure', '10', '7', '0', '1', '2'], ['AccountSecurity', '6', '5', '0', '0', '1'],
]);

const BAN_IN = {
  tieuDe: 'Lab 4 Practice — System Test Report 5.3 on LabBook',
  phu: { en: 'SWT301 Lab 4 format (Report5.3_System Test) · four workflows, three roles · 8 system-level failures to catch · 10 marks', vi: 'Định dạng Lab 4 SWT301 (Report5.3_System Test) · bốn workflow, ba vai trò · 8 lỗi mức hệ thống phải bắt · 10 điểm' },
  moTa: {
    en: `<p>Lab 4 closes the chain unit (Lab 2, Report 5.1) → integration (Lab 3, Report 5.2) → <b>system</b> (Report 5.3). A system test case follows a <b>user’s whole journey</b> on the running system, often across several roles (a student books, the manager closes the lab, the student sees the cancellation), and its expected results come from the <b>SRS and business rules</b>, not from the architecture. One sheet per workflow, cases grouped by scenario, ids with the sheet prefix (SB-1, WL-1…).</p>
<p>Your cases are executed against LabBook and then against <b>8 faulty builds</b> that each break one business rule end-to-end (a locked user keeps working, the waitlist is promoted in the wrong order, a re-opened lab still refuses bookings…).</p>
${LUONG_SVG}
<h3>System under test — LabBook (functional contract)</h3>${LABBOOK_API.en}`,
    vi: `<p>Lab 4 khép chuỗi unit (Lab 2, Report 5.1) → integration (Lab 3, Report 5.2) → <b>system</b> (Report 5.3). Một test case hệ thống đi theo <b>trọn hành trình của người dùng</b> trên hệ thống đang chạy, thường qua nhiều vai trò (sinh viên đặt, quản lý đóng phòng, sinh viên thấy booking bị huỷ), và kết quả mong đợi lấy từ <b>SRS và luật nghiệp vụ</b>, không phải từ kiến trúc. Mỗi workflow một sheet, các ca gom theo scenario, id có tiền tố sheet (SB-1, WL-1…).</p>
<p>Các ca của bạn chạy trên LabBook rồi trên <b>8 bản build lỗi</b>, mỗi bản phá một luật nghiệp vụ từ đầu tới cuối (người bị khoá vẫn làm việc, danh sách chờ nâng sai thứ tự, phòng mở lại vẫn từ chối booking…).</p>
${LUONG_SVG}
<h3>Hệ thống được kiểm thử — LabBook (hợp đồng chức năng)</h3>${LABBOOK_API.vi}`,
  },
  chucNangChinh: [
    { en: 'Four workflow sheets: StudentBooking (SB), Waitlist (WL), LabClosure (LC), AccountSecurity (AS).', vi: 'Bốn sheet workflow: StudentBooking (SB), Waitlist (WL), LabClosure (LC), AccountSecurity (AS).' },
    { en: 'Every business rule of the contract has at least one case on each side (accepted / refused).', vi: 'Mỗi luật nghiệp vụ trong hợp đồng có ít nhất một ca ở mỗi phía (được nhận / bị từ chối).' },
    { en: 'Fill the Test Statistics sheet of Report 5.3.', vi: 'Điền sheet Test Statistics của Report 5.3.' },
  ],
  yeuCauChung: [
    { en: 'Each case starts from the seed data, clock Monday 2026-11-02 08:00; booking codes restart at BK0001 in every case.', vi: 'Mỗi ca bắt đầu từ dữ liệu mẫu, đồng hồ thứ Hai 2026-11-02 08:00; mã booking bắt đầu lại từ BK0001 trong mỗi ca.' },
    { en: 'Observe results the way a user can: responses, My Bookings, the lab list and the mailbox (<code>GET /test/outbox</code>).', vi: 'Quan sát kết quả như người dùng: phản hồi, Booking của tôi, danh sách phòng và hộp thư (<code>GET /test/outbox</code>).' },
    { en: 'Boundaries of business rules are tested on both sides inside ONE case (e.g. 09:00 accepted and 08:00 refused).', vi: 'Biên của luật nghiệp vụ test cả hai phía trong MỘT ca (vd 09:00 được, 08:00 bị từ chối).' },
  ],
  cayThuMuc: `answers/
├── system-tests.js   ← const TEST_CASES = [...]   (Report 5.3 — all four workflow sheets)
└── statistics.js     ← const STATS = {...}        (Test Statistics sheet)`,
  moHinh: {
    ten: 'TEST_CASES[i] — one row of a Report 5.3 workflow sheet',
    truong: [
      ['id', 'string', { en: 'sheet prefix + number: SB-1, WL-2, LC-1, AS-1…', vi: 'tiền tố sheet + số: SB-1, WL-2, LC-1, AS-1…' }],
      ['workflow', 'string', { en: 'StudentBooking | Waitlist | LabClosure | AccountSecurity', vi: 'StudentBooking | Waitlist | LabClosure | AccountSecurity' }],
      ['description · precondition', 'string', { en: '"Verify that …" · state before the journey', vi: '"Verify that …" · trạng thái trước hành trình' }],
      ['steps[j]', '{ as, call, body?, expect? }', { en: 'one user action and its expected result (partial match)', vi: 'một thao tác người dùng và kết quả mong đợi (so khớp một phần)' }],
      ['STATS', 'object', { en: '{ passed, failed, pending, na, total, testCoverage, successfulCoverage, reportRound }', vi: '{ passed, failed, pending, na, total, testCoverage, successfulCoverage, reportRound }' }],
    ],
  },
  duLieuMau: `{
  id: 'SB-5', workflow: 'StudentBooking',
  description: 'Verify the 2-hour cancellation deadline (09:00 today too late, 10:00 today still allowed)',
  precondition: 'System running with seed data; clock Mon 2026-11-02 08:00',
  steps: [
    { as: 'student1', call: 'POST /api/bookings', body: { labCode: 'LAB01', date: '2026-11-02', startHour: 9, duration: 1 }, expect: { status: 201 } },
    …
  ],
}`,
  chucNang: [
    {
      ten: { en: 'Report 5.3 sheets — complete and correct', vi: 'Các sheet Report 5.3 — đầy đủ và đúng' }, diem: 1.5,
      yeuCau: [
        { en: 'At least 12 cases, each in one of the four workflow sheets (≥ 2 per sheet), ids unique.', vi: 'Ít nhất 12 ca, mỗi ca thuộc một trong bốn sheet (≥ 2 ca mỗi sheet), id không trùng.' },
        { en: 'Every case PASSES on the correct build.', vi: 'Mọi ca ĐẠT trên bản build đúng.' },
      ],
      hook: ['Report5.3', 'workflow-based testing'],
    },
    {
      ten: { en: 'StudentBooking workflow + its business rules', vi: 'Workflow StudentBooking + luật nghiệp vụ' }, diem: 2,
      yeuCau: [
        { en: 'The happy journey (labs → book → My Bookings → cancel) and every rule: 1-hour lead time, 14-day window, end by 21:00, 2-hour cancellation deadline, weekly limit (cancelled hours excluded), owner-only, cancel once.', vi: 'Hành trình chính (phòng → đặt → Booking của tôi → huỷ) và mọi luật: đặt trước 1 giờ, cửa sổ 14 ngày, kết thúc trước 21:00, hạn huỷ 2 giờ, giới hạn tuần (không tính giờ đã huỷ), chỉ chủ được huỷ, huỷ một lần.' },
      ],
      hook: ['use-case testing', 'BVA on business rules'],
    },
    {
      ten: { en: 'Waitlist workflow', vi: 'Workflow Waitlist' }, diem: 1,
      yeuCau: [
        { en: 'A full lab waitlists; releasing the seat promotes the FIRST waiting student; the promoted student sees CONFIRMED and gets the e-mail; the next one stays PENDING.', vi: 'Phòng đầy thì vào danh sách chờ; nhả chỗ thì nâng người chờ ĐẦU TIÊN; người được nâng thấy CONFIRMED và nhận thư; người sau vẫn PENDING.' },
      ],
      hook: ['multi-actor scenario'],
    },
    {
      ten: { en: 'LabClosure workflow (Manager)', vi: 'Workflow LabClosure (Quản lý)' }, diem: 1.5,
      yeuCau: [
        { en: 'Closing cancels the students’ bookings (they see it) and refuses new ones; re-opening makes the lab bookable again.', vi: 'Đóng phòng huỷ booking của sinh viên (họ thấy được) và từ chối booking mới; mở lại thì đặt được lại.' },
      ],
      hook: ['state across roles'],
    },
    {
      ten: { en: 'AccountSecurity workflow (Admin)', vi: 'Workflow AccountSecurity (Admin)' }, diem: 1.5,
      yeuCau: [
        { en: 'A lock takes effect immediately (the user’s open session is rejected), a locked user cannot log in, unlock restores access; three wrong passwords also lock.', vi: 'Khoá có hiệu lực ngay (phiên đang mở bị từ chối), người bị khoá không đăng nhập được, mở khoá trả lại quyền; sai mật khẩu ba lần cũng khoá.' },
      ],
      hook: ['security testing'],
    },
    {
      ten: { en: 'Catch the system-level failures', vi: 'Bắt các lỗi mức hệ thống' }, diem: 1.5,
      yeuCau: [
        { en: 'Your cases run against 8 faulty builds (5 described, 3 hidden). One passing case that fails on a build catches it.', vi: 'Các ca của bạn chạy trên 8 bản build lỗi (5 bản có mô tả, 3 bản ẩn). Một ca đạt mà trượt trên bản lỗi là bắt được nó.' },
      ],
      hook: ['failure-based testing'],
    },
    {
      ten: { en: 'Test Statistics sheet', vi: 'Sheet Test Statistics' }, diem: 1,
      moTa: {
        en: `<p>Latest round of the four sheets:</p>${BANG}<p>Fill <code>STATS</code> with the totals, the two coverages of Report 5.3 (2 decimals) and the round number a FINAL report should show (the template links Round 1 by default).</p>`,
        vi: `<p>Round mới nhất của bốn sheet:</p>${BANG}<p>Điền <code>STATS</code> các tổng, hai tỉ lệ coverage của Report 5.3 (2 chữ số) và số round mà báo cáo CUỐI nên hiển thị (template mặc định trỏ Round 1).</p>`,
      },
      yeuCau: [
        { en: 'Test coverage = (Passed + Failed) × 100 / (Total − N/A); Test successful coverage = Passed × 100 / (Total − N/A).', vi: 'Test coverage = (Passed + Failed) × 100 / (Total − N/A); Test successful coverage = Passed × 100 / (Total − N/A).' },
      ],
      hook: ['test metrics'],
    },
  ],
  idBatBuoc: [
    ['TEST_CASES', { en: 'answers/system-tests.js', vi: 'answers/system-tests.js' }],
    ['STATS', { en: 'answers/statistics.js', vi: 'answers/statistics.js' }],
  ],
  truDiem: [
    { en: 'Integration-level cases (one API call, technical status only) presented as system tests — no journey, no second role.', vi: 'Ca mức tích hợp (một lời gọi API, chỉ status kỹ thuật) trình bày như test hệ thống — không có hành trình, không có vai trò thứ hai.' },
    { en: 'Only happy paths: half of the business rules have no “refused” case.', vi: 'Chỉ có đường thành công: một nửa luật nghiệp vụ không có ca “bị từ chối”.' },
    { en: 'Expected results that the user cannot observe (internal fields) — use what the SRS promises the user.', vi: 'Kết quả mong đợi người dùng không quan sát được (trường nội bộ) — dùng điều SRS hứa với người dùng.' },
  ],
  nopBai: NOP_BAI,
};

const DAU_TC = `// Report 5.3 — System Test. One object per test-case row; "workflow" = the sheet it belongs to.
// steps: { as: 'student1' | 'student2' | 'student3' | 'manager' | 'admin' | 'guest', call: 'METHOD /path', body?, expect?: { status, body } }
const TEST_CASES = [
${jsLit(GIAI_DS[0], '  ').replace(/^/, '  ')},
];
`;
const GIAI_TC = `// Report 5.3 — System Test: 4 workflow sheets, 14 cases, 3 roles.
const TEST_CASES = ${jsLit(GIAI_DS)};
`;
const DAU_ST = `// Test Statistics sheet (Report 5.3)
const STATS = {
  passed: 0, failed: 0, pending: 0, na: 0, total: 0,
  testCoverage: 0,        // (Passed + Failed) × 100 / (Total − N/A), 2 decimals
  successfulCoverage: 0,  // Passed × 100 / (Total − N/A), 2 decimals
  reportRound: 0,         // which round a FINAL report should show
};
`;
const GIAI_ST = `// Test Statistics sheet (Report 5.3) — Round 3 (the latest) of the four sheets. Applicable = 40 − 4 = 36.
const STATS = {
  passed: 32,                // 14 + 6 + 7 + 5
  failed: 2,                 // 1 + 1 + 0 + 0
  pending: 2,                // 0 + 1 + 1 + 0
  na: 4,                     // 1 + 0 + 2 + 1
  total: 40,                 // 16 + 8 + 10 + 6
  testCoverage: 94.44,       // 34 × 100 / 36
  successfulCoverage: 88.89, // 32 × 100 / 36
  reportRound: 3,            // a final report shows the LATEST round (link B8…E8, say so in Notes)
};
`;

export default doiDau({
  slug: 'swt301-10-lab4-system-report53',
  ten: 'Lab 4 Practice — System Test Report 5.3 (LabBook)',
  khoa: KHOA,
  baiHoc: 'swt301-lab4-de-bai',
  de: [
    {
      dangBai: 'lab',
      tieuDe: 'Lab 4 Practice — Report 5.3 System Test on LabBook',
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      ngonNgu: 'javascript',
      viDu: [{
        input: 'AS-1: student1 is logged in → admin locks an@fpt.edu.vn → student1 books again',
        output: '401 UNAUTHENTICATED, then login → 423 ACCOUNT_LOCKED; after unlock → login 200',
        explanation: 'A system test follows the user’s journey across roles; the faulty build S1 keeps the old session alive and is caught here.|||Test hệ thống đi theo hành trình qua nhiều vai trò; bản lỗi S1 giữ phiên cũ sống và bị bắt ở đây.',
      }],
      khaiNiem: ['system testing', 'workflow', 'business rule', 'Report 5.3', 'multi-role scenario', 'test statistics'],
      tienQuyet: ['SWT301 2.3 system & acceptance testing', 'Lab 4 — brief'],
      the: ['swt301', 'lab4', 'system-testing', 'report-5.3'],
      banIn: BAN_IN,
      thuatNgu: [
        ...tn('expected', 'precondition', 'regression'),
        { en: 'system testing', vi: 'kiểm thử hệ thống — kiểm cả hệ thống theo yêu cầu, như người dùng thấy' },
        { en: 'workflow / end-to-end', vi: 'luồng nghiệp vụ / đầu-cuối — chuỗi thao tác hoàn thành một việc của người dùng' },
        { en: 'business rule (BR)', vi: 'luật nghiệp vụ — ràng buộc của bài toán (hạn huỷ 2 giờ, 6 giờ/tuần…)' },
        { en: 'evidence', vi: 'bằng chứng chạy test (ảnh chụp kết quả) — cột Evidence của Report 5.3' },
        { en: 'round', vi: 'vòng chạy test (Round 1 chạy đủ, Round 2 chạy lại ca fail, Round 3 hồi quy)' },
        { en: 'session', vi: 'phiên làm việc (token) của người dùng sau khi đăng nhập' },
      ],
      goiY: [
        'Viết theo hành trình: mỗi ca kể một câu chuyện ngắn của MỘT người dùng (hoặc hai vai trò nối nhau) rồi kiểm điều người đó nhìn thấy (My Bookings, danh sách phòng, hộp thư).',
        'Mỗi luật nghiệp vụ: đặt cả hai phía biên trong cùng một ca — 08:00 bị từ chối / 09:00 được; ngày 16/11 được / 17/11 bị từ chối; 18h+3 được / 19h+3 bị từ chối.',
        'Bẫy hệ thống: khoá tài khoản khi người đó ĐANG đăng nhập (đặt chỗ trước rồi mới khoá) — lỗi "phiên cũ vẫn sống" chỉ lộ như vậy.',
        'Danh sách chờ cần BA sinh viên trên LAB02 (1 chỗ): người đầu CONFIRMED, hai người sau PENDING; nhả chỗ thì người thứ hai — không phải người thứ ba — được nâng.',
      ],
      loiHayGap: [
        'Khoá tài khoản rồi chỉ thử đăng nhập lại — bỏ sót lỗi phiên cũ vẫn hoạt động (S1).',
        'Kiểm giới hạn tuần nhưng không huỷ booking nào — lỗi "giờ đã huỷ vẫn bị tính" (S3) không lộ.',
        'Kiểm mở lại phòng bằng phản hồi PATCH 200 mà không đặt thử — bản S8 vẫn trả 200 OPEN.',
        'Dùng ngày ở tuần sau (09/11) khi đang muốn chạm giới hạn 6 giờ của tuần này.',
        'Thống kê lấy Round 1 cho báo cáo cuối — template mặc định trỏ Round 1, báo cáo cuối phải là round mới nhất.',
      ],
      moTaNgan: 'Luyện Lab 4 (Report 5.3): test hệ thống theo bốn workflow (StudentBooking, Waitlist, LabClosure, AccountSecurity) chạy thật trên LabBook, phủ mọi luật nghiệp vụ hai phía biên, bắt 8 lỗi mức hệ thống, điền thống kê có trừ N/A.',
      giaiThich: {
        en: `<p>The solution has one sheet per role-driven workflow. Each business rule appears with both outcomes inside one case (SB-2 09:00 vs 08:00, SB-3 day 14 vs 15, SB-4 18+3 vs 19+3, SB-5 10:00 vs 09:00), which is how system-level boundary testing reads in Report 5.3. The faulty builds are caught where a real user would notice: S1 (locked user keeps working) only by locking an account that is logged in (AS-1); S3 only by cancelling before re-booking (SB-6); S7 only with TWO waiting students (WL-1); S8 only by actually booking after re-opening (LC-2).</p>
<p>Statistics use the latest round and remove N/A: 34 × 100 / 36 = 94.44%, 32 × 100 / 36 = 88.89%.</p>`,
        vi: `<p>Lời giải có mỗi workflow theo vai trò một sheet. Mỗi luật nghiệp vụ xuất hiện với cả hai kết quả trong một ca (SB-2 09:00 vs 08:00, SB-3 ngày 14 vs 15, SB-4 18+3 vs 19+3, SB-5 10:00 vs 09:00) — đó là cách kiểm biên mức hệ thống trong Report 5.3. Các bản lỗi bị bắt đúng chỗ người dùng thật sẽ thấy: S1 (người bị khoá vẫn làm việc) chỉ lộ khi khoá một tài khoản đang đăng nhập (AS-1); S3 chỉ lộ khi huỷ rồi đặt lại (SB-6); S7 chỉ lộ khi có HAI người chờ (WL-1); S8 chỉ lộ khi đặt thử sau khi mở lại (LC-2).</p>
<p>Thống kê lấy round mới nhất và bỏ N/A: 34 × 100 / 36 = 94,44%, 32 × 100 / 36 = 88,89%.</p>`,
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/system-tests.js', 'answers/statistics.js'], kiem: KIEM },
      khoiDau: { 'answers/system-tests.js': DAU_TC, 'answers/statistics.js': DAU_ST },
      loiGiai: { 'answers/system-tests.js': GIAI_TC, 'answers/statistics.js': GIAI_ST },
      thamKhao: 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/',
      boYeu: [
        { ten: 'khoá rồi chỉ thử đăng nhập (không có phiên đang mở)', tep: { 'answers/system-tests.js': `const TEST_CASES = ${jsLit(GIAI_DS.map((c) => (c.id === 'AS-1' ? { ...c, steps: c.steps.filter((x, i) => i !== 0 && i !== 2) } : c)))};\n` }, phaiTruot: ['Detects faulty build S1'] },
        { ten: 'không có ca huỷ rồi đặt lại', tep: { 'answers/system-tests.js': `const TEST_CASES = ${jsLit(GIAI_DS.filter((c) => c.id !== 'SB-6'))};\n` }, phaiTruot: ['Detects faulty build S3'] },
        { ten: 'danh sách chờ chỉ một người', tep: { 'answers/system-tests.js': `const TEST_CASES = ${jsLit(GIAI_DS.map((c) => (c.id === 'WL-1' ? { ...c, steps: c.steps.filter((x, i) => i !== 2 && i !== 5) } : c)))};\n` } },
        { ten: 'thống kê lấy tổng làm mẫu số', tep: { 'answers/statistics.js': GIAI_ST.replace('94.44', '85.00').replace('88.89', '80.00') }, phaiTruot: ['Test coverage %'] },
      ],
    },
  ],
});
