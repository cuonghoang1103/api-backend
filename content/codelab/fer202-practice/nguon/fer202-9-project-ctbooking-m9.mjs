/**
 * FER202 · Dự án CT Booking — MỐC 9 (Chương 9 · React Router): tách trang /rooms, /rooms/:id, /my-bookings, 404.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M8, APP_M9, BOOKING_FORM_M8, M5_FILES, M7_FILES, M8_FILES, M9_FILES, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const BASE = { 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE, ...M5_FILES, ...M7_FILES, ...M8_FILES, 'src/components/BookingForm.js': BOOKING_FORM_M8 };
const stub = (ten) => `// src/pages/${ten}.js — STARTER\nexport default function ${ten}() {\n  return null;\n}\n`;
const KHOI = {
  ...BASE, 'src/index.js': index({ bootstrap: true, router: true }),
  'src/App.js': APP_M8.replace('// src/App.js — mốc 8: dùng custom hook useFreeSlots cho bảng chọn ô', '// src/App.js — STARTER mốc 9 = lời giải mốc 8 (index.js đã bọc BrowserRouter); tách thành các trang + Routes'),
  'src/pages/RoomsPage.js': stub('RoomsPage'), 'src/pages/RoomPage.js': stub('RoomPage'), 'src/pages/MyBookingsPage.js': stub('MyBookingsPage'),
};
const GIAI = { ...BASE, 'src/index.js': index({ bootstrap: true, router: true }), ...M9_FILES, 'src/App.js': APP_M9 };

const LOGIN = (name, code) => [nhap('#login-name', name), nhap('#login-code', code), { hanhDong: 'gui', selector: '#login-form' }];
const DAT = [...LOGIN('Lan', 'HE180010'), click('#selected-slot ~ * #purpose, #room-page .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }];

const KIEM = [
  { nhom: 'f1', moTa: '"/" redirects to /rooms', url: '/', kiem: 'duong-dan', giaTri: '/rooms' },
  { nhom: 'f1', moTa: 'Rooms page lists the cards', url: '/rooms', kiem: 'so-luong', selector: '.room-card', giaTri: 3 },
  { nhom: 'f1', moTa: 'Navbar links with active state', url: '/my-bookings', kiem: 'ton-tai', selector: '#nav-my.active' },
  { nhom: 'f1', an: true, moTa: 'Unknown URL ⇒ 404 page inside the layout', url: '/abc', kiem: 'danh-sach-text', selector: '#title, #page-404', mongDoi: ['CT Booking', 'Page not found'] },
  { nhom: 'f2', moTa: 'Book button navigates to /rooms/:id', url: '/rooms', kiem: 'duong-dan', giaTri: '/rooms/2', truoc: [click('#room-2 .btn-select')] },
  { nhom: 'f2', moTa: 'Room page reads :id', url: '/rooms/2', kiem: 'danh-sach-text', selector: '#room-title, #room-page .slot:nth-child(-n+2)', mongDoi: ['Room A2', '08:00', '08:30'] },
  { nhom: 'f2', moTa: 'Unknown room id', url: '/rooms/9', kiem: 'text', selector: '#not-found', giaTri: 'Room not found' },
  { nhom: 'f2', an: true, moTa: 'Back link to the list', url: '/rooms/9', kiem: 'duong-dan', giaTri: '/rooms', truoc: [click('#back-to-rooms')] },
  { nhom: 'f3', moTa: 'Booking navigates to My bookings with a message', url: '/rooms/1', kiem: 'danh-sach-text', selector: '#booking-success, .my-booking-text', mongDoi: ['Booked Room A1 11:00–12:00 for Lan', 'Room A1 · 11:00–12:00 (60 min)'], truoc: [...LOGIN('Lan', 'HE180010'), click('#room-page .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }] },
  { nhom: 'f3', moTa: 'URL after booking', url: '/rooms/1', kiem: 'duong-dan', giaTri: '/my-bookings', truoc: [...LOGIN('Lan', 'HE180010'), click('#room-page .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }] },
  { nhom: 'f3', an: true, moTa: 'Message comes from location.state (gone on a fresh visit)', url: '/my-bookings', kiem: 'khong-ton-tai', selector: '#booking-success' },
  { nhom: 'f4', moTa: 'Pages in src/pages with useParams / useNavigate', kiem: 'ma-nguon', tep: 'src/pages/RoomPage.js', khop: '^(?=[\\s\\S]*useParams\\(\\))(?=[\\s\\S]*useNavigate\\(\\))' },
  { nhom: 'f4', an: true, moTa: 'Bookings still persisted across reload on any route', url: '/rooms/1', kiem: 'text', selector: '#summary', giaTri: '3 rooms · 4 bookings today', truoc: [...LOGIN('Lan', 'HE180010'), click('#room-page .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }, { hanhDong: 'tai-lai' }] },
];
void DAT;

const BAN_IN = banInMoc({
  moc: 9, chuong: 9, phut: 100,
  en: 'Pages with React Router', vi: 'Trang với React Router',
  moTa: {
    en: '<p>Give every screen its own URL. <code>/rooms</code> shows the grid, the card button opens <code>/rooms/:id</code> (schedule, slot picker and booking form for that room), a successful booking navigates to <code>/my-bookings</code> carrying a message in <code>location.state</code>, and unknown URLs show a 404 inside the layout. The "selected room" state of milestone 5 is replaced by the URL.</p>',
    vi: '<p>Cho mỗi màn hình một URL riêng. <code>/rooms</code> hiện lưới phòng, nút trên thẻ mở <code>/rooms/:id</code> (lịch, chọn giờ và form đặt của phòng đó), đặt thành công thì sang <code>/my-bookings</code> kèm thông báo trong <code>location.state</code>, URL lạ hiện trang 404 bên trong layout. State "phòng đang chọn" của mốc 5 được thay bằng URL.</p>',
  },
  cay: `
src/
├── pages/RoomsPage.js       # /rooms
├── pages/RoomPage.js        # /rooms/:id
├── pages/MyBookingsPage.js  # /my-bookings
├── App.js                   # navbar (NavLink) + Routes
├── index.js                 # BrowserRouter (given)
└── …                        (milestones 5–8)`,
  chucNang: [
    { ten: { en: 'Routes & layout', vi: 'Route & layout' }, diem: 2, yeuCau: [{ en: '<code>/</code> ⇒ <code>/rooms</code>; navbar NavLinks <code>#nav-rooms</code>, <code>#nav-my</code> (active class); <code>*</code> ⇒ <code>#page-404</code>.', vi: '<code>/</code> ⇒ <code>/rooms</code>; NavLink <code>#nav-rooms</code>, <code>#nav-my</code> (class active); <code>*</code> ⇒ <code>#page-404</code>.' }] },
    { ten: { en: 'Room page', vi: 'Trang phòng' }, diem: 3, yeuCau: [{ en: '<code>/rooms/:id</code> (<code>useParams</code>, number conversion): <code>#room-page</code>, <code>#room-title</code>, schedule, slot picker, booking form; unknown id ⇒ <code>#not-found</code> + <code>#back-to-rooms</code>.', vi: '<code>/rooms/:id</code> (<code>useParams</code>, đổi sang số): <code>#room-page</code>, <code>#room-title</code>, lịch, chọn giờ, form đặt; id lạ ⇒ <code>#not-found</code> + <code>#back-to-rooms</code>.' }] },
    { ten: { en: 'Navigate after booking', vi: 'Điều hướng sau khi đặt' }, diem: 3, yeuCau: [{ en: '<code>navigate("/my-bookings", { state: { message } })</code>; <code>#booking-success</code> shown only when arriving with that state.', vi: '<code>navigate("/my-bookings", { state: { message } })</code>; <code>#booking-success</code> chỉ hiện khi tới kèm state đó.' }], viDu: 'book Room A1 11:00 ⇒ /my-bookings · "Booked Room A1 11:00–12:00 for Lan"' },
    { ten: { en: 'Structure', vi: 'Cấu trúc' }, diem: 2, yeuCau: [{ en: 'One component per page in <code>src/pages</code>; persistence from milestone 8 still works on every route.', vi: 'Mỗi trang một component trong <code>src/pages</code>; lưu bền của mốc 8 vẫn chạy ở mọi route.' }] },
  ],
  idBatBuoc: [['#nav-rooms · #nav-my · #room-page · #room-title · #not-found · #back-to-rooms · #page-404', { en: 'new in milestone 9', vi: 'mới ở mốc 9' }]],
  truDiem: [{ en: '<code>&lt;a href&gt;</code> links reloading the app.', vi: 'Link <code>&lt;a href&gt;</code> làm tải lại app.' }, { en: 'Comparing <code>r.id === id</code> (number vs string).', vi: 'So <code>r.id === id</code> (số với chuỗi).' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-9-project-ctbooking-m9',
  ten: 'CT Booking · Milestone 9 — Pages with React Router',
  khoa: KHOA,
  baiHoc: 'fer202-9-1-router',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 9 — Routes, room pages and navigation after booking', vi: 'CT Booking · Mốc 9 — Route, trang phòng và điều hướng sau khi đặt' },
      doKho: 'HARD', phut: 100, diem: 100,
      khaiNiem: ['Routes', 'useParams', 'useNavigate with state', 'NavLink', '404'],
      tienQuyet: ['CT Booking · Milestone 8'],
      the: ['fer202', 'project', 'ct-booking', 'router'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'location state', vi: 'dữ liệu đi kèm một lần điều hướng' }, ...tn('rubric')],
      goiY: ['RoomsPage: onSelect={(id) => navigate(´/rooms/@{id}´)}.', 'RoomPage: const room = ROOMS.find(r => r.id === Number(id)); book ⇒ navigate("/my-bookings", { state: { message } }).'],
      loiHayGap: ['Giữ lại state selectedRoomId song song với URL ⇒ hai nguồn sự thật.', 'Đặt Routes ngoài Container/navbar ⇒ mất layout ở trang 404.'],
      moTaNgan: 'Dự án CT Booking mốc 9: React Router — /rooms, /rooms/:id, /my-bookings, 404, NavLink, navigate kèm state sau khi đặt. Thang 10.',
      giaiThich: '<p>URL thay cho state "đang chọn": chia sẻ link /rooms/2 là mở đúng phòng. Thông báo một lần đi qua <code>location.state</code> nên tải lại hay vào thẳng trang sẽ không hiện lại.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types', 'react-router-dom'], url: '/rooms', kiem: KIEM },
      khoiDau: KHOI,
      loiGiai: GIAI,
      demo: { tepChinh: 'src/index.js', url: '/rooms' },
    },
  ],
});
