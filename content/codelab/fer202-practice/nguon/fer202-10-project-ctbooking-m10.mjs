/**
 * FER202 · Dự án CT Booking — MỐC 10 (Chương 10 · lazy & Suspense): tách chunk trang chi tiết và My bookings.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M9, APP_M10, BOOKING_FORM_M8, LAZY_HELPERS, M5_FILES, M7_FILES, M8_FILES, M9_FILES, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms) => ({ hanhDong: 'cho', ms });
const BASE = {
  'src/index.js': index({ bootstrap: true, router: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE,
  ...M5_FILES, ...M7_FILES, ...M8_FILES, ...M9_FILES, 'src/components/BookingForm.js': BOOKING_FORM_M8, 'src/utils/lazy.js': LAZY_HELPERS,
};
const KHOI = { ...BASE, 'src/App.js': APP_M9.replace('// src/App.js — mốc 9: React Router — layout (navbar) + các trang', '// src/App.js — STARTER mốc 10 = lời giải mốc 9; tải lười RoomPage + MyBookingsPage (src/utils/lazy.js đã cho)') };
const GIAI = { ...BASE, 'src/App.js': APP_M10 };

const KIEM = [
  { nhom: 'f1', moTa: 'Rooms page (initial route) renders without a fallback', url: '/rooms', kiem: 'danh-sach-text', selector: '#page-loading, .room-card .room-name', mongDoi: ['Room A1', 'Room A2', 'Room B1'] },
  { nhom: 'f1', moTa: 'Opening a room shows the fallback first', url: '/rooms', kiem: 'text', selector: '#page-loading', giaTri: 'Loading page…', truoc: [click('#room-1 .btn-select')] },
  { nhom: 'f1', moTa: 'then the lazy room page', url: '/rooms', kiem: 'text', selector: '#room-title', giaTri: 'Room A1', truoc: [click('#room-1 .btn-select'), cho(700)] },
  { nhom: 'f2', moTa: 'Navbar stays visible while a chunk loads (Suspense inside the layout)', url: '/rooms', kiem: 'danh-sach-text', selector: '#title, #page-loading', mongDoi: ['CT Booking', 'Loading page…'], truoc: [click('#nav-my')] },
  { nhom: 'f2', an: true, moTa: 'Deep link to a lazy page works', url: '/my-bookings', kiem: 'ton-tai', selector: '#my-bookings', truoc: [cho(700)] },
  { nhom: 'f3', moTa: 'Preloaded My bookings opens without the fallback', url: '/rooms', kiem: 'danh-sach-text', selector: '#page-loading, #my-bookings', mongDoi: ['Log in to see your bookings'], truoc: [{ hanhDong: 'focus', selector: '#nav-my' }, cho(700), click('#nav-my')] },
  { nhom: 'f3', an: true, moTa: 'preload wired on hover and focus', kiem: 'ma-nguon', tep: 'src/App.js', khop: '^(?=[\\s\\S]*onMouseEnter=\\{\\s*MyBookingsPage\\.preload)(?=[\\s\\S]*onFocus=\\{\\s*MyBookingsPage\\.preload)' },
  { nhom: 'f4', moTa: 'No static imports of the lazy pages', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'import\\s+(RoomPage|MyBookingsPage)\\s+from', phuDinh: true },
  { nhom: 'f4', moTa: 'Rooms page stays eager', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'import\\s+RoomsPage\\s+from\\s+[\'"]\\./pages/RoomsPage[\'"]' },
  { nhom: 'f4', an: true, moTa: 'Dynamic imports for the two pages', kiem: 'ma-nguon', tep: 'src/App.js', khop: '^(?=[\\s\\S]*import\\(\\s*[\'"]\\./pages/RoomPage)(?=[\\s\\S]*import\\(\\s*[\'"]\\./pages/MyBookingsPage)' },
];

const BAN_IN = banInMoc({
  moc: 10, chuong: 10, phut: 60,
  en: 'Code splitting the pages', vi: 'Chia mã theo trang',
  moTa: {
    en: '<p>Most visitors only look at the room list. Keep <code>RoomsPage</code> in the main bundle and load <code>RoomPage</code> and <code>MyBookingsPage</code> lazily (a 400 ms delay helper is given so you can see it). Put <code>Suspense</code> inside the layout so the navbar never disappears, and preload <i>My bookings</i> when the user hovers or focuses its link.</p>',
    vi: '<p>Phần lớn người dùng chỉ xem danh sách phòng. Giữ <code>RoomsPage</code> trong bundle chính, tải lười <code>RoomPage</code> và <code>MyBookingsPage</code> (có sẵn hàm trễ 400 ms để thấy rõ). Đặt <code>Suspense</code> trong layout để navbar không bao giờ biến mất, và tải trước <i>My bookings</i> khi người dùng rê chuột hoặc focus vào link.</p>',
  },
  cay: `
src/
├── utils/lazy.js     # withDelay · lazyWithPreload (given)
├── App.js            # lazy pages + Suspense in the layout + preload
└── …                 (milestones 5–9)`,
  chucNang: [
    { ten: { en: 'Lazy pages', vi: 'Trang tải lười' }, diem: 3, yeuCau: [{ en: '<code>RoomPage</code>, <code>MyBookingsPage</code> via <code>lazyWithPreload(withDelay(() =&gt; import(…), 400))</code>; RoomsPage imported normally.', vi: '<code>RoomPage</code>, <code>MyBookingsPage</code> qua <code>lazyWithPreload(withDelay(() =&gt; import(…), 400))</code>; RoomsPage import bình thường.' }] },
    { ten: { en: 'Suspense in the layout', vi: 'Suspense trong layout' }, diem: 3, yeuCau: [{ en: '<code>&lt;Suspense fallback={&lt;p id="page-loading"&gt;Loading page…&lt;/p&gt;}&gt;</code> around <code>&lt;Routes&gt;</code>, inside the Container (navbar outside).', vi: '<code>&lt;Suspense fallback={&lt;p id="page-loading"&gt;Loading page…&lt;/p&gt;}&gt;</code> bọc <code>&lt;Routes&gt;</code>, trong Container (navbar nằm ngoài).' }], viDu: 'click "Book" ⇒ navbar + "Loading page…" ⇒ room page' },
    { ten: { en: 'Preload', vi: 'Tải trước' }, diem: 2, yeuCau: [{ en: '<code>#nav-my</code> calls <code>MyBookingsPage.preload</code> on mouse enter and focus.', vi: '<code>#nav-my</code> gọi <code>MyBookingsPage.preload</code> khi rê chuột và focus.' }] },
    { ten: { en: 'Bundle discipline', vi: 'Kỷ luật bundle' }, diem: 2, yeuCau: [{ en: 'No static import of the lazy pages anywhere in App.', vi: 'Không import tĩnh trang tải lười ở App.' }] },
  ],
  idBatBuoc: [['#page-loading', { en: 'new in milestone 10', vi: 'mới ở mốc 10' }]],
  truDiem: [{ en: 'Suspense around the whole app — the navbar flashes away.', vi: 'Suspense bọc cả app — navbar nháy biến mất.' }, { en: 'Lazy-loading the first page too — an extra spinner on every visit.', vi: 'Tải lười cả trang đầu — thêm vòng chờ ở mọi lần vào.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-10-project-ctbooking-m10',
  ten: 'CT Booking · Milestone 10 — Code splitting the pages',
  khoa: KHOA,
  baiHoc: 'fer202-10-1-lazy-suspense',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 10 — Lazy pages, Suspense in the layout, preload', vi: 'CT Booking · Mốc 10 — Trang tải lười, Suspense trong layout, tải trước' },
      doKho: 'MEDIUM', phut: 60, diem: 100,
      khaiNiem: ['React.lazy', 'Suspense placement', 'route-based splitting', 'preloading'],
      tienQuyet: ['CT Booking · Milestone 9'],
      the: ['fer202', 'project', 'ct-booking', 'lazy'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'chunk', vi: 'tệp JS tách riêng' }, ...tn('rubric')],
      goiY: ['const RoomPage = lazyWithPreload(withDelay(() => import("./pages/RoomPage"), 400));', '<Container><Suspense fallback={…}><Routes>…</Routes></Suspense></Container>'],
      loiHayGap: ['Giữ dòng import RoomPage tĩnh cũ ⇒ không chia được chunk.', 'Đặt Suspense ngoài Shell ⇒ navbar biến mất khi tải.'],
      moTaNgan: 'Dự án CT Booking mốc 10: tải lười trang phòng và My bookings, Suspense trong layout, tải trước khi hover/focus. Thang 10.',
      giaiThich: '<p>Chia theo route: trang mở đầu nằm sẵn, trang chi tiết tải khi cần. Suspense đặt quanh vùng nội dung để khung app vẫn dùng được; preload tận dụng khoảng thời gian rê chuột tới khi bấm.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types', 'react-router-dom'], url: '/rooms', kiem: KIEM },
      khoiDau: KHOI,
      loiGiai: GIAI,
      demo: { tepChinh: 'src/index.js', url: '/rooms' },
    },
  ],
});
