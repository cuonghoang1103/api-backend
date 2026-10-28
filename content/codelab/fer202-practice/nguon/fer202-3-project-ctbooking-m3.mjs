/**
 * FER202 · Dự án CT Booking — MỐC 3 (Chương 3 · JSX): hiển thị phòng và lịch hôm nay từ dữ liệu + lõi nghiệp vụ mốc 2.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M3, banInMoc, CSS, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE };

const S_APP = `// src/App.js — STARTER mốc 3: lõi nghiệp vụ mốc 2 đã có ở src/domain/booking.js (dạng ES module)
import { ROOMS } from './data/seed';

export default function App() {
  return (
    <main>
      <h1 id="title">CT Booking</h1>
      <p>{ROOMS.length} rooms</p>
    </main>
  );
}
`;

const R = (n) => `#room-${n}`;
const KIEM = [
  { nhom: 'f1', moTa: 'Title and summary', kiem: 'danh-sach-text', selector: '#title, #summary', mongDoi: ['CT Booking', '3 rooms · 3 bookings today'] },
  { nhom: 'f1', moTa: 'One card per room', kiem: 'danh-sach-text', selector: '.room-card .room-name', mongDoi: ['Room A1', 'Room A2', 'Room B1'] },
  { nhom: 'f1', an: true, moTa: 'Card ids', kiem: 'so-luong', selector: '#room-1, #room-2, #room-3', giaTri: 3 },
  { nhom: 'f2', moTa: 'Meta line', kiem: 'text', selector: `${R(2)} .room-meta`, giaTri: '6 seats · Floor 1' },
  { nhom: 'f2', moTa: 'Feature badges', kiem: 'danh-sach-text', selector: `${R(2)} .feature`, mongDoi: ['Whiteboard', 'TV'] },
  { nhom: 'f3', moTa: 'Booking counts with singular/plural', kiem: 'danh-sach-text', selector: '.room-count', mongDoi: ['2 bookings today', '1 booking today', '0 bookings today'] },
  { nhom: 'f3', moTa: 'Schedule rows use formatRange', kiem: 'danh-sach-text', selector: `${R(1)} .booking-row`, mongDoi: ['08:00–09:30 (90 min) · An · SWT301 review', '10:00–11:00 (60 min) · Binh · FER202 project'] },
  { nhom: 'f3', an: true, moTa: 'Uses the domain functions (no copy of the rules in App)', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'from\\s+[\'"]\\./domain/booking[\'"]' },
  { nhom: 'f4', moTa: 'Empty room message (and no empty list)', kiem: 'danh-sach-text', selector: `${R(3)} .no-bookings, ${R(3)} .schedule`, mongDoi: ['No bookings yet'] },
  { nhom: 'f4', moTa: 'First free slot per room', kiem: 'danh-sach-text', selector: '.first-free', mongDoi: ['First free slot: 09:30', 'First free slot: 08:00', 'First free slot: 08:00'] },
  { nhom: 'f4', an: true, moTa: 'Fully booked branch exists', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'Fully booked' },
  { nhom: 'f5', moTa: 'Lists rendered with map + key', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'ROOMS\\.map\\([\\s\\S]*key=\\{\\s*room\\.id\\s*\\}' },
  { nhom: 'f5', an: true, moTa: 'className, not class', kiem: 'ma-nguon', tep: 'src/App.js', khop: '\\sclass=', phuDinh: true },
];

const BAN_IN = banInMoc({
  moc: 3, chuong: 3, phut: 75,
  en: 'Today\'s rooms in JSX', vi: 'Phòng hôm nay bằng JSX',
  moTa: {
    en: '<p>Turn the data and the milestone-2 rules into a read-only page. No state yet: everything on screen is computed during render from <code>ROOMS</code>, <code>BOOKINGS</code> and the domain functions (now an ES module in <code>src/domain/booking.js</code>).</p>',
    vi: '<p>Biến dữ liệu và luật của mốc 2 thành trang chỉ đọc. Chưa có state: mọi thứ trên màn hình được tính lúc render từ <code>ROOMS</code>, <code>BOOKINGS</code> và các hàm nghiệp vụ (giờ là ES module ở <code>src/domain/booking.js</code>).</p>',
  },
  cay: `
src/
├── data/seed.js          # ROOMS, BOOKINGS (given)
├── domain/booking.js     # milestone 2 (exported)
├── App.js                # ← this milestone
├── index.css (given)
└── index.js`,
  wireframe: `
CT Booking
3 rooms · 3 bookings today
+---------------------------+ +---------------------------+ +-------------------------+
| Room A1                   | | Room A2                   | | Room B1                 |
| 4 seats · Floor 1         | | 6 seats · Floor 1         | | 8 seats · Floor 2       |
| (TV)                      | | (Whiteboard) (TV)         | | (Whiteboard)            |
| 2 bookings today          | | 1 booking today           | | 0 bookings today        |
| 08:00–09:30 (90 min) · An | | 09:00–10:30 (90 min) · …  | | No bookings yet         |
| First free slot: 09:30    | | First free slot: 08:00    | | First free slot: 08:00  |
+---------------------------+ +---------------------------+ +-------------------------+`,
  chucNang: [
    { ten: { en: 'Page & room cards', vi: 'Trang & thẻ phòng' }, diem: 2, yeuCau: [{ en: '<code>#title</code> <code>CT Booking</code>, <code>#summary</code> <code>3 rooms · 3 bookings today</code>, <code>article.room-card#room-&lt;id&gt;</code> with <code>.room-name</code>.', vi: '<code>#title</code> <code>CT Booking</code>, <code>#summary</code> <code>3 rooms · 3 bookings today</code>, <code>article.room-card#room-&lt;id&gt;</code> có <code>.room-name</code>.' }] },
    { ten: { en: 'Room details', vi: 'Chi tiết phòng' }, diem: 1.5, yeuCau: [{ en: '<code>.room-meta</code> <code>6 seats · Floor 1</code>; one <code>.feature</code> badge per feature.', vi: '<code>.room-meta</code> <code>6 seats · Floor 1</code>; mỗi tiện ích một badge <code>.feature</code>.' }] },
    { ten: { en: 'Counts & schedule', vi: 'Số lượt & lịch' }, diem: 2.5, yeuCau: [{ en: '<code>.room-count</code> <code>1 booking today</code> / <code>2 bookings today</code> (from <code>countByRoom</code>); <code>ul.schedule li.booking-row</code> sorted, text <code>formatRange(b) · name · purpose</code>.', vi: '<code>.room-count</code> <code>1 booking today</code> / <code>2 bookings today</code> (từ <code>countByRoom</code>); <code>ul.schedule li.booking-row</code> đã sắp, chữ <code>formatRange(b) · tên · mục đích</code>.' }], viDu: '08:00–09:30 (90 min) · An · SWT301 review' },
    { ten: { en: 'Conditional parts', vi: 'Phần có điều kiện' }, diem: 2, yeuCau: [{ en: 'No bookings ⇒ <code>.no-bookings</code> <code>No bookings yet</code> (no empty list). <code>.first-free</code> <code>First free slot: 09:30</code> or <code>Fully booked</code>.', vi: 'Không có lượt ⇒ <code>.no-bookings</code> <code>No bookings yet</code> (không vẽ danh sách rỗng). <code>.first-free</code> <code>First free slot: 09:30</code> hoặc <code>Fully booked</code>.' }] },
    { ten: { en: 'JSX hygiene', vi: 'JSX sạch' }, diem: 2, yeuCau: [{ en: '<code>map</code> with stable keys, <code>className</code>, rules imported from the domain module.', vi: '<code>map</code> với key ổn định, <code>className</code>, luật import từ module nghiệp vụ.' }] },
  ],
  idBatBuoc: [
    ['#title · #summary · .room-card#room-<id> · .room-name · .room-meta · .feature', { en: 'cards', vi: 'thẻ' }],
    ['.room-count · .schedule .booking-row · .no-bookings · .first-free', { en: 'schedule', vi: 'lịch' }],
  ],
  truDiem: [
    { en: 'Re-implementing the overlap/free-slot logic inside App.', vi: 'Viết lại luật chồng giờ/ô trống trong App.' },
    { en: '<code>{list.length &amp;&amp; …}</code> printing a stray 0.', vi: '<code>{list.length &amp;&amp; …}</code> in ra số 0 lạc lõng.' },
  ],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-3-project-ctbooking-m3',
  ten: 'CT Booking · Milestone 3 — Today\'s rooms (JSX)',
  khoa: KHOA,
  baiHoc: 'fer202-3-2-fragments-conditional',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 3 — Today\'s rooms in JSX', vi: 'CT Booking · Mốc 3 — Phòng hôm nay bằng JSX' },
      doKho: 'MEDIUM', phut: 75, diem: 100,
      khaiNiem: ['JSX expressions', 'lists & keys', 'conditional rendering', 'ES modules', 'derived values'],
      tienQuyet: ['CT Booking · Milestone 2'],
      the: ['fer202', 'project', 'ct-booking', 'jsx'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'read-only view', vi: 'giao diện chỉ hiển thị, chưa tương tác' }, ...tn('rubric')],
      goiY: ['const counts = countByRoom(BOOKINGS); trong map: const n = counts[room.id] ?? 0;', 'Lịch của phòng: sortBookings(BOOKINGS).filter(b => b.roomId === room.id).'],
      loiHayGap: ['Quên ?? 0 ⇒ Room B1 hiện "undefined bookings today".', 'Dùng index làm key cho thẻ phòng.'],
      moTaNgan: 'Dự án CT Booking mốc 3: trang chỉ đọc bằng JSX — thẻ phòng, tiện ích, số lượt (số ít/nhiều), lịch sắp xếp, trạng thái rỗng, ô trống đầu tiên. Thang 10.',
      giaiThich: '<p>Giao diện là hàm của dữ liệu: App không tự tính luật mà gọi lõi nghiệp vụ mốc 2. Nhánh rỗng và số ít/số nhiều là điều kiện JSX bình thường; key ổn định là id của phòng và booking.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: { 'src/App.js': S_APP, ...CHUNG },
      loiGiai: { 'src/App.js': APP_M3, ...CHUNG },
      demo: { tepChinh: 'src/index.js' },
    },
  ],
});
