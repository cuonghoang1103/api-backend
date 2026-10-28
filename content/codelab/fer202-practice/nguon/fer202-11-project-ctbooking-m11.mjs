/**
 * FER202 · Dự án CT Booking — MỐC 11 (Chương 11 · HTTP): bookings lưu ở json-server qua axios; tải / lỗi / thử lại.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M10, APP_M11, BOOKINGS, BOOKING_FORM_M8, LAZY_HELPERS, M5_FILES, M7_FILES, M8_FILES, M9_FILES, M11_FILES, ROOM_PAGE_M11, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const BASE = {
  'src/index.js': index({ bootstrap: true, router: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE,
  ...M5_FILES, ...M7_FILES, ...M8_FILES, ...M9_FILES, 'src/components/BookingForm.js': BOOKING_FORM_M8, 'src/utils/lazy.js': LAZY_HELPERS, '.env': M11_FILES['.env'],
};
const KHOI = {
  ...BASE,
  'src/App.js': APP_M10.replace('// src/App.js — mốc 10: trang chi tiết + My bookings tải lười; Suspense TRONG layout; preload khi rê chuột/focus', '// src/App.js — STARTER mốc 11 = lời giải mốc 10; chuyển bookings sang json-server (http://localhost:9999/bookings)'),
  'src/api/client.js': '// src/api/client.js — STARTER: axios.create({ baseURL: process.env.REACT_APP_API_URL }) + bookingsApi.list / create / remove\nexport {};\n',
};
const GIAI = { ...BASE, ...M11_FILES, 'src/pages/RoomPage.js': ROOM_PAGE_M11, 'src/App.js': APP_M11 };

const LOGIN = (name, code) => [nhap('#login-name', name), nhap('#login-code', code), { hanhDong: 'gui', selector: '#login-form' }];
const DAT = [cho(), ...LOGIN('Lan', 'HE180010'), click('#room-1 .btn-select'), cho(700), click('#room-page .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }, cho(800)];

const KIEM = [
  { nhom: 'f1', moTa: 'Loading state while bookings are fetched', url: '/rooms', jsonServer: { base: B, db: { bookings: BOOKINGS }, treMs: 900 }, kiem: 'text', selector: '#bookings-loading', giaTri: 'Loading bookings…' },
  { nhom: 'f1', moTa: 'Bookings come from the server', url: '/rooms', kiem: 'danh-sach-text', selector: '#summary, .room-count', mongDoi: ['3 rooms · 3 bookings today', '2 bookings today', '1 booking today', '0 bookings today'], truoc: [cho()] },
  { nhom: 'f1', an: true, moTa: 'GET /bookings via the axios instance', url: '/rooms', kiem: 'goi-fetch', khop: '^GET http://localhost:9999/bookings$', truoc: [cho()] },
  { nhom: 'f2', moTa: 'Booking is POSTed with the server id', url: '/rooms', kiem: 'du-lieu-server', bang: 'bookings', chua: { id: 4, roomId: 1, student: 'HE180010', start: '11:00', end: '12:00', purpose: 'Study React' }, truoc: DAT },
  { nhom: 'f2', moTa: 'and shows in My bookings', url: '/rooms', kiem: 'danh-sach-text', selector: '#booking-success, .my-booking-text', mongDoi: ['Booked Room A1 11:00–12:00 for Lan', 'Room A1 · 11:00–12:00 (60 min)'], truoc: DAT },
  { nhom: 'f2', an: true, moTa: 'Failed POST keeps the user on the page with an error', url: '/rooms', fetchGia: { 'POST http://localhost:9999/bookings': { status: 500, text: 'boom' } }, kiem: 'danh-sach-text', selector: '#save-error, #room-title', mongDoi: ['Room A1', 'Could not save the booking, please try again'], truoc: DAT },
  { nhom: 'f3', moTa: 'Cancel sends DELETE', url: '/my-bookings', kiem: 'du-lieu-server', bang: 'bookings', khongChua: { id: 1 }, truoc: [cho(), ...LOGIN('An', 'HE180001'), cho(700), click('.my-booking .btn-cancel'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Cancelled booking disappears from the list', url: '/my-bookings', kiem: 'text', selector: '#my-bookings .card-body', giaTri: 'You have no bookings today', truoc: [cho(), ...LOGIN('An', 'HE180001'), cho(700), click('.my-booking .btn-cancel'), cho()] },
  { nhom: 'f4', moTa: 'Load error with retry', url: '/rooms', jsonServer: { base: B, db: {} }, kiem: 'danh-sach-text', selector: '#bookings-error, #retry', mongDoi: ['Could not load bookings (Request failed with status code 404)', 'Retry'], truoc: [cho()] },
  { nhom: 'f4', moTa: 'Retry fetches again', url: '/rooms', jsonServer: { base: B, db: {} }, kiem: 'goi-fetch', khop: '/bookings$', min: 2, max: 2, truoc: [cho(), click('#retry'), cho()] },
  { nhom: 'f5', moTa: 'Base URL from .env in one axios instance', kiem: 'ma-nguon', tep: 'src/api/client.js', khop: 'axios\\.create\\(\\s*\\{\\s*baseURL:\\s*process\\.env\\.REACT_APP_API_URL' },
  { nhom: 'f5', an: true, moTa: 'No more localStorage for bookings (server is the source of truth)', kiem: 'ma-nguon', tep: 'src/context/BookingContext.js', khop: 'localStorage', phuDinh: true },
];

const BAN_IN = banInMoc({
  moc: 11, chuong: 11, phut: 110,
  en: 'Bookings on a REST API', vi: 'Lượt đặt trên REST API',
  moTa: {
    en: '<p>Move bookings from localStorage to a real REST API (json-server at <code>http://localhost:9999/bookings</code>, rooms stay static). One axios instance reads its base URL from <code>.env</code>; the booking context loads with a loading/error state and a Retry button, creates bookings with <code>POST</code> (the server assigns the id) and cancels them with <code>DELETE</code>. A failed save keeps the user on the room page with an error.</p>',
    vi: '<p>Chuyển lượt đặt từ localStorage sang REST API thật (json-server ở <code>http://localhost:9999/bookings</code>, danh sách phòng vẫn tĩnh). Một axios instance đọc base URL từ <code>.env</code>; context lượt đặt tải dữ liệu có trạng thái đang tải/lỗi và nút Retry, tạo lượt bằng <code>POST</code> (server cấp id) và huỷ bằng <code>DELETE</code>. Lưu lỗi thì giữ người dùng ở trang phòng kèm thông báo.</p>',
  },
  cay: `
.env                            # REACT_APP_API_URL (given)
src/
├── api/client.js               # ← axios instance + bookingsApi
├── context/BookingContext.js   # reducer LOADING/LOADED/FAILED/ADD/CANCEL
├── pages/RoomPage.js           # async booking + #save-error
├── App.js                      # loading / error / retry
└── …`,
  chucNang: [
    { ten: { en: 'Load from the API', vi: 'Tải từ API' }, diem: 2.5, yeuCau: [{ en: '<code>GET /bookings</code> on start; <code>#bookings-loading</code> <code>Loading bookings…</code> meanwhile; pages render only when ready.', vi: '<code>GET /bookings</code> khi khởi động; trong lúc chờ hiện <code>#bookings-loading</code> <code>Loading bookings…</code>; trang chỉ vẽ khi sẵn sàng.' }] },
    { ten: { en: 'Create with POST', vi: 'Tạo bằng POST' }, diem: 3, yeuCau: [{ en: '<code>addBooking</code> POSTs, stores the server copy (with id) and resolves it; RoomPage awaits it, then navigates; on failure shows <code>#save-error</code> <code>Could not save the booking, please try again</code>.', vi: '<code>addBooking</code> POST, lưu bản server trả (có id) và trả về nó; RoomPage chờ rồi mới điều hướng; lỗi thì hiện <code>#save-error</code> <code>Could not save the booking, please try again</code>.' }], viDu: 'POST /bookings ⇒ { id: 4, … } ⇒ /my-bookings' },
    { ten: { en: 'Cancel with DELETE', vi: 'Huỷ bằng DELETE' }, diem: 2, yeuCau: [{ en: '<code>cancelBooking(id)</code> sends <code>DELETE /bookings/:id</code> then removes it from state.', vi: '<code>cancelBooking(id)</code> gửi <code>DELETE /bookings/:id</code> rồi mới bỏ khỏi state.' }] },
    { ten: { en: 'Error & retry', vi: 'Lỗi & thử lại' }, diem: 1.5, yeuCau: [{ en: '<code>#bookings-error</code> <code>Could not load bookings (…message…)</code> + <code>#retry</code>.', vi: '<code>#bookings-error</code> <code>Could not load bookings (…thông điệp…)</code> + <code>#retry</code>.' }] },
    { ten: { en: 'HTTP layer', vi: 'Lớp HTTP' }, diem: 1, yeuCau: [{ en: '<code>axios.create({ baseURL: process.env.REACT_APP_API_URL })</code> in <code>src/api/client.js</code>; no localStorage for bookings anymore.', vi: '<code>axios.create({ baseURL: process.env.REACT_APP_API_URL })</code> trong <code>src/api/client.js</code>; bỏ localStorage cho bookings.' }] },
  ],
  idBatBuoc: [['#bookings-loading · #bookings-error · #retry · #save-error', { en: 'new in milestone 11', vi: 'mới ở mốc 11' }]],
  truDiem: [{ en: 'Generating ids on the client (max + 1) — collides with other users.', vi: 'Tự tạo id ở client (max + 1) — trùng với người dùng khác.' }, { en: 'Navigating before the POST finishes.', vi: 'Điều hướng trước khi POST xong.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-11-project-ctbooking-m11',
  ten: 'CT Booking · Milestone 11 — Bookings on a REST API',
  khoa: KHOA,
  baiHoc: 'fer202-11-2-axios-json-server',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 11 — json-server API with axios (load · POST · DELETE · retry)', vi: 'CT Booking · Mốc 11 — API json-server với axios (tải · POST · DELETE · thử lại)' },
      doKho: 'HARD', phut: 110, diem: 100,
      khaiNiem: ['axios instance', 'environment variables', 'async context actions', 'loading/error states', 'server-generated ids'],
      tienQuyet: ['CT Booking · Milestone 10'],
      the: ['fer202', 'project', 'ct-booking', 'http', 'axios'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'source of truth', vi: 'nguồn sự thật — nơi dữ liệu chính thức nằm' }, ...tn('rubric')],
      goiY: ['bookingsApi.create = (b) => client.post("/bookings", b).then(r => r.data);', 'Provider: useReducer với LOADING/LOADED/FAILED/ADD/CANCEL; addBooking async: const saved = await bookingsApi.create(b); dispatch({ type: "ADD", booking: saved }); return saved;'],
      loiHayGap: ['Quên await trong RoomPage ⇒ navigate với saved là Promise.', 'Xoá khỏi state trước khi DELETE thành công rồi không hoàn tác khi lỗi.'],
      moTaNgan: 'Dự án CT Booking mốc 11: bookings trên json-server — axios instance từ .env, tải có loading/lỗi/thử lại, POST lấy id server, DELETE khi huỷ. Thang 10.',
      giaiThich: '<p>Khi dữ liệu nằm trên server, context trở thành "bộ nhớ đệm" của server: tải lúc đầu, cập nhật sau mỗi request thành công. Id do server cấp; giao diện chờ request xong mới điều hướng và giữ nguyên trang khi lỗi.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types', 'react-router-dom', 'axios'], url: '/rooms', jsonServer: { base: B, db: { bookings: BOOKINGS } }, kiem: KIEM },
      khoiDau: KHOI,
      loiGiai: GIAI,
      demo: { tepChinh: 'src/index.js', url: '/rooms' },
    },
  ],
});
