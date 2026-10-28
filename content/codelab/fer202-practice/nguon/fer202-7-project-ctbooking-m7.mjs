/**
 * FER202 · Dự án CT Booking — MỐC 7 (Chương 7 · Context): BookingContext + StudentContext, đăng nhập, "My bookings".
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M6, APP_M7, BOOKING_FORM_M6, M5_FILES, M7_FILES, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const CHUNG = { 'src/index.js': index({ bootstrap: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE, ...M5_FILES, 'src/components/BookingForm.js': BOOKING_FORM_M6 };
const S_APP = APP_M6.replace('// src/App.js — mốc 6: bookings thành state; form đặt phòng thêm lượt mới (cập nhật thẻ, lịch, ô trống)', '// src/App.js — STARTER mốc 7 = lời giải mốc 6; chuyển bookings vào BookingContext, thêm StudentContext + My bookings');
const stubF = (p, mo) => `// ${p} — STARTER\n// ${mo}\nexport {};\n`;

const LOGIN = (name, code) => [nhap('#login-name', name), nhap('#login-code', code), { hanhDong: 'gui', selector: '#login-form' }];
const AN = LOGIN('An', 'HE180001');
const DAT = [click('#room-1 .btn-select'), click('#selected-panel .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }];

const KIEM = [
  { nhom: 'f1', moTa: 'Logged out: login form + hint', kiem: 'danh-sach-text', selector: '#login, #my-bookings', mongDoi: ['Log in', 'Log in to see your bookings'] },
  { nhom: 'f1', moTa: 'Login shows the student in the navbar', kiem: 'text', selector: '#current-student', giaTri: 'An (HE180001)', truoc: AN },
  { nhom: 'f1', moTa: 'Logout', kiem: 'ton-tai', selector: '#login-form', truoc: [...AN, click('#logout')] },
  { nhom: 'f1', an: true, moTa: 'Invalid code does not log in', kiem: 'khong-ton-tai', selector: '#current-student', truoc: LOGIN('An', 'abc') },
  { nhom: 'f2', moTa: 'My bookings lists the student\'s own bookings', kiem: 'danh-sach-text', selector: '.my-booking-text', mongDoi: ['Room A1 · 08:00–09:30 (90 min)'], truoc: AN },
  { nhom: 'f2', moTa: 'Student without bookings', kiem: 'text', selector: '#my-bookings .card-body', giaTri: 'You have no bookings today', truoc: LOGIN('Lan', 'HE180010') },
  { nhom: 'f3', moTa: 'Booking form is prefilled from the student', kiem: 'thuoc-tinh-js', selector: '#student', thuocTinh: 'value', giaTri: 'HE180010', truoc: [...LOGIN('Lan', 'HE180010'), click('#room-1 .btn-select')] },
  { nhom: 'f3', moTa: 'New booking appears in My bookings', kiem: 'danh-sach-text', selector: '.my-booking-text', mongDoi: ['Room A1 · 11:00–12:00 (60 min)'], truoc: [...LOGIN('Lan', 'HE180010'), ...DAT] },
  { nhom: 'f4', moTa: 'Cancel removes it everywhere', kiem: 'danh-sach-text', selector: '#room-1 .room-count, #summary', mongDoi: ['3 rooms · 2 bookings today', '1 booking today'], truoc: [...AN, click('.my-booking .btn-cancel')] },
  { nhom: 'f4', an: true, moTa: 'Cancelled booking leaves the schedule', kiem: 'danh-sach-text', selector: '#room-1 .booking-row', mongDoi: ['10:00–11:00 (60 min) · Binh · FER202 project'], truoc: [...AN, click('.my-booking .btn-cancel')] },
  { nhom: 'f5', moTa: 'BookingContext with a guarded hook', kiem: 'ma-nguon', tep: 'src/context/BookingContext.js', khop: 'createContext\\([\\s\\S]*throw new Error\\([\'"]useBookings must be used inside BookingProvider' },
  { nhom: 'f5', moTa: 'Context value memoized', kiem: 'ma-nguon', tep: 'src/context/BookingContext.js', khop: 'useMemo\\(' },
  { nhom: 'f5', an: true, moTa: 'MyBookings reads both contexts (no props)', kiem: 'ma-nguon', tep: 'src/components/MyBookings.js', khop: '^(?=[\\s\\S]*useBookings\\(\\))(?=[\\s\\S]*useStudent\\(\\))(?=[\\s\\S]*function\\s+MyBookings\\s*\\(\\s*\\))' },
];

const BAN_IN = banInMoc({
  moc: 7, chuong: 7, phut: 100,
  en: 'Shared state with Context', vi: 'State dùng chung bằng Context',
  moTa: {
    en: '<p>More screens need the bookings and the current student, so move them into <b>Context</b>. <code>BookingProvider</code> owns the bookings and exposes <code>addBooking</code>/<code>cancelBooking</code>; <code>StudentProvider</code> holds who is logged in. A quick login in the navbar, a prefilled booking form and a <b>My bookings</b> panel with cancel all read from context — no prop drilling.</p>',
    vi: '<p>Nhiều màn hình cần danh sách lượt đặt và sinh viên hiện tại, nên chuyển chúng vào <b>Context</b>. <code>BookingProvider</code> giữ bookings và cung cấp <code>addBooking</code>/<code>cancelBooking</code>; <code>StudentProvider</code> giữ người đăng nhập. Đăng nhập nhanh trên navbar, form đặt phòng điền sẵn và bảng <b>My bookings</b> có huỷ đều đọc từ context — không truyền props nhiều tầng.</p>',
  },
  cay: `
src/
├── context/BookingContext.js    # BookingProvider · useBookings
├── context/StudentContext.js    # StudentProvider · useStudent
├── components/StudentArea.js    # login form / student + logout
├── components/MyBookings.js     # own bookings + cancel
├── components/…                 (milestones 5–6)
└── App.js                       # providers + Shell`,
  chucNang: [
    { ten: { en: 'Student login', vi: 'Đăng nhập sinh viên' }, diem: 2, yeuCau: [{ en: '<code>#login-form</code> (<code>#login-name</code>, <code>#login-code</code> valid code only, <code>#login</code>) ⇒ <code>#current-student</code> <code>An (HE180001)</code> + <code>#logout</code>.', vi: '<code>#login-form</code> (<code>#login-name</code>, <code>#login-code</code> chỉ nhận mã hợp lệ, <code>#login</code>) ⇒ <code>#current-student</code> <code>An (HE180001)</code> + <code>#logout</code>.' }] },
    { ten: { en: 'My bookings', vi: 'Lượt của tôi' }, diem: 2, yeuCau: [{ en: '<code>#my-bookings</code>: logged out ⇒ <code>Log in to see your bookings</code>; else <code>.my-booking</code> rows <code>.my-booking-text</code> <code>Room A1 · 08:00–09:30 (90 min)</code> or <code>You have no bookings today</code>.', vi: '<code>#my-bookings</code>: chưa đăng nhập ⇒ <code>Log in to see your bookings</code>; ngược lại dòng <code>.my-booking</code> có <code>.my-booking-text</code> <code>Room A1 · 08:00–09:30 (90 min)</code> hoặc <code>You have no bookings today</code>.' }] },
    { ten: { en: 'Prefilled booking', vi: 'Đặt phòng điền sẵn' }, diem: 2, yeuCau: [{ en: 'When logged in, <code>#name</code> and <code>#student</code> start with the student\'s data; the new booking shows up in My bookings.', vi: 'Khi đã đăng nhập, <code>#name</code> và <code>#student</code> điền sẵn dữ liệu sinh viên; lượt mới hiện trong My bookings.' }], viDu: 'Lan (HE180010) books Room A1 11:00 ⇒ "Room A1 · 11:00–12:00 (60 min)"' },
    { ten: { en: 'Cancel', vi: 'Huỷ' }, diem: 2, yeuCau: [{ en: '<code>.btn-cancel</code> calls <code>cancelBooking(id)</code>; cards, schedule and summary update.', vi: '<code>.btn-cancel</code> gọi <code>cancelBooking(id)</code>; thẻ, lịch và dòng tóm tắt cập nhật.' }] },
    { ten: { en: 'Context quality', vi: 'Chất lượng Context' }, diem: 2, yeuCau: [{ en: 'Guarded hooks (<code>useBookings must be used inside BookingProvider</code>), memoized values, components read context instead of props.', vi: 'Hook có chốt (<code>useBookings must be used inside BookingProvider</code>), value được memo, component đọc context thay vì props.' }] },
  ],
  idBatBuoc: [['#login-form · #login-name · #login-code · #login · #current-student · #logout · #my-bookings · .my-booking · .my-booking-text · .btn-cancel', { en: 'new in milestone 7', vi: 'mới ở mốc 7' }]],
  truDiem: [{ en: 'Passing bookings and student through App → Shell → panels as props.', vi: 'Truyền bookings và student qua App → Shell → các bảng bằng props.' }, { en: 'Letting a student cancel other people\'s bookings.', vi: 'Cho sinh viên huỷ lượt của người khác.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-7-project-ctbooking-m7',
  ten: 'CT Booking · Milestone 7 — Shared state with Context',
  khoa: KHOA,
  baiHoc: 'fer202-7-1-context',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 7 — Booking & student contexts, My bookings', vi: 'CT Booking · Mốc 7 — Context lượt đặt & sinh viên, My bookings' },
      doKho: 'HARD', phut: 100, diem: 100,
      khaiNiem: ['Context providers', 'custom context hooks', 'memoized context values', 'derived per-user data'],
      tienQuyet: ['CT Booking · Milestone 6'],
      the: ['fer202', 'project', 'ct-booking', 'context'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'provider', vi: 'component cung cấp giá trị context' }, ...tn('rubric')],
      goiY: ['BookingProvider: useState(BOOKINGS); value = useMemo(() => ({ bookings, addBooking, cancelBooking }), [bookings]).', 'BookingForm nhận initial={{ name, student }} và key theo phòng + sinh viên để khởi tạo lại.'],
      loiHayGap: ['Gọi useBookings trong App — nơi chính nó render Provider ⇒ lỗi "must be used inside" (tách Shell).', 'addBooking tính id trong updater rồi trả biến chưa gán.'],
      moTaNgan: 'Dự án CT Booking mốc 7: BookingContext + StudentContext, đăng nhập nhanh, form điền sẵn, My bookings có huỷ. Thang 10.',
      giaiThich: '<p>Khi nhiều nhánh cây cần cùng dữ liệu, Context thay cho chuỗi props. Provider giữ state và hành động; các component (navbar, form, My bookings) tự lấy thứ mình cần. Tách <code>Shell</code> khỏi <code>App</code> vì hook context phải nằm DƯỚI Provider.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types'], kiem: KIEM },
      khoiDau: {
        'src/App.js': S_APP,
        'src/context/BookingContext.js': stubF('src/context/BookingContext.js', 'BookingProvider · useBookings'),
        'src/context/StudentContext.js': stubF('src/context/StudentContext.js', 'StudentProvider · useStudent'),
        'src/components/StudentArea.js': stubF('src/components/StudentArea.js', '#login-form / #student + #logout'),
        'src/components/MyBookings.js': stubF('src/components/MyBookings.js', '#my-bookings · .my-booking · .btn-cancel'),
        ...CHUNG,
      },
      loiGiai: { 'src/App.js': APP_M7, ...M7_FILES, ...CHUNG },
      demo: { tepChinh: 'src/index.js' },
    },
  ],
});
