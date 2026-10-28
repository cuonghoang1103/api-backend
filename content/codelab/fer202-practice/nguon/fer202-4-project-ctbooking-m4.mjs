/**
 * FER202 · Dự án CT Booking — MỐC 4 (Chương 4 · Bootstrap): chuyển trang mốc 3 sang React-Bootstrap, lưới đáp ứng.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M3, APP_M4, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const CHUNG = { 'src/index.js': index({ bootstrap: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE };
const S_APP = APP_M3.replace('// src/App.js — mốc 3: hiển thị phòng + lịch hôm nay bằng JSX (chưa có state)', '// src/App.js — STARTER mốc 4 = lời giải mốc 3; hãy chuyển sang React-Bootstrap (index.js đã import bootstrap.min.css)');

const KIEM = [
  { nhom: 'f1', moTa: 'Primary navbar with brand and summary', kiem: 'danh-sach-text', selector: 'nav#app-nav.navbar.bg-primary #title, nav#app-nav #summary', mongDoi: ['CT Booking', '3 rooms · 3 bookings today'] },
  { nhom: 'f1', moTa: 'Content inside a Container', kiem: 'ton-tai', selector: '.container .row .room-card' },
  { nhom: 'f2', moTa: 'Responsive grid: col-12 col-md-6 col-lg-4', kiem: 'so-luong', selector: '.row > .col-12.col-md-6.col-lg-4 > .card.room-card', giaTri: 3 },
  { nhom: 'f2', an: true, moTa: 'Gutter utility on the row', kiem: 'ton-tai', selector: '.row.g-3' },
  { nhom: 'f3', moTa: 'Card title/subtitle classes', kiem: 'danh-sach-text', selector: '#room-2 .card-title, #room-2 .card-subtitle', mongDoi: ['Room A2', '6 seats · Floor 1'] },
  { nhom: 'f3', moTa: 'Feature badges', kiem: 'danh-sach-text', selector: '#room-2 .badge.bg-info.feature', mongDoi: ['Whiteboard', 'TV'] },
  { nhom: 'f4', moTa: 'Schedule as a flush list group', kiem: 'danh-sach-text', selector: '#room-1 .list-group.list-group-flush .list-group-item.booking-row', mongDoi: ['08:00–09:30 (90 min) · An · SWT301 review', '10:00–11:00 (60 min) · Binh · FER202 project'] },
  { nhom: 'f4', an: true, moTa: 'Empty room keeps its message', kiem: 'text', selector: '#room-3 .no-bookings', giaTri: 'No bookings yet' },
  { nhom: 'f5', moTa: 'First free slot as a success badge in the footer', kiem: 'danh-sach-text', selector: '.card-footer .badge.bg-success.first-free', mongDoi: ['First free slot: 09:30', 'First free slot: 08:00', 'First free slot: 08:00'] },
  { nhom: 'f5', an: true, moTa: 'Counts still correct', kiem: 'danh-sach-text', selector: '.room-count', mongDoi: ['2 bookings today', '1 booking today', '0 bookings today'] },
  { nhom: 'f6', moTa: 'Built with React-Bootstrap components, no inline styles', kiem: 'ma-nguon', tep: 'src/App.js', khop: '^(?=[\\s\\S]*from\\s+[\'"]react-bootstrap[\'"])(?=[\\s\\S]*<Card)(?=[\\s\\S]*<Col)(?![\\s\\S]*style=\\{\\{)' },
];

const BAN_IN = banInMoc({
  moc: 4, chuong: 4, phut: 60,
  en: 'Responsive layout with React-Bootstrap', vi: 'Bố cục đáp ứng với React-Bootstrap',
  moTa: {
    en: '<p>Same content as milestone 3, now with <b>React-Bootstrap</b>: a primary navbar, a responsive grid (1 column on phones, 2 on tablets, 3 on desktops), cards with badges, the schedule as a flush list group and the first free slot as a footer badge. Keep every class and id from milestone 3.</p>',
    vi: '<p>Cùng nội dung mốc 3, giờ dùng <b>React-Bootstrap</b>: navbar màu primary, lưới đáp ứng (1 cột trên điện thoại, 2 trên tablet, 3 trên máy tính), thẻ có badge, lịch là list group flush và ô trống đầu tiên là badge ở chân thẻ. Giữ mọi class và id của mốc 3.</p>',
  },
  cay: `
src/
├── data/seed.js · domain/booking.js   (given)
├── App.js                             # ← React-Bootstrap
└── index.js                           # imports bootstrap.min.css (given)`,
  chucNang: [
    { ten: { en: 'Navbar & container', vi: 'Navbar & container' }, diem: 2, yeuCau: [{ en: '<code>Navbar#app-nav bg="primary" variant="dark"</code> with <code>Navbar.Brand#title</code> and <code>Navbar.Text#summary</code>; content in a <code>Container</code>.', vi: '<code>Navbar#app-nav bg="primary" variant="dark"</code> có <code>Navbar.Brand#title</code> và <code>Navbar.Text#summary</code>; nội dung trong <code>Container</code>.' }] },
    { ten: { en: 'Responsive grid', vi: 'Lưới đáp ứng' }, diem: 2, yeuCau: [{ en: '<code>Row className="g-3"</code> + <code>Col xs={12} md={6} lg={4}</code>.', vi: '<code>Row className="g-3"</code> + <code>Col xs={12} md={6} lg={4}</code>.' }], viDu: 'phone 1 column · tablet 2 · desktop 3' },
    { ten: { en: 'Cards & badges', vi: 'Thẻ & badge' }, diem: 2, yeuCau: [{ en: '<code>Card.room-card</code> with <code>Card.Title.room-name</code>, <code>Card.Subtitle.room-meta</code>, <code>Badge bg="info".feature</code>.', vi: '<code>Card.room-card</code> có <code>Card.Title.room-name</code>, <code>Card.Subtitle.room-meta</code>, <code>Badge bg="info".feature</code>.' }] },
    { ten: { en: 'Schedule list group', vi: 'Lịch dạng list group' }, diem: 1.5, yeuCau: [{ en: '<code>ListGroup variant="flush".schedule</code> of <code>ListGroup.Item.booking-row</code>.', vi: '<code>ListGroup variant="flush".schedule</code> gồm <code>ListGroup.Item.booking-row</code>.' }] },
    { ten: { en: 'Footer badge', vi: 'Badge chân thẻ' }, diem: 1.5, yeuCau: [{ en: '<code>Card.Footer</code> with <code>Badge.first-free</code>: success when a slot is free, danger when fully booked.', vi: '<code>Card.Footer</code> có <code>Badge.first-free</code>: success khi còn ô, danger khi kín.' }] },
    { ten: { en: 'Bootstrap only', vi: 'Chỉ Bootstrap' }, diem: 1, yeuCau: [{ en: 'No inline style objects.', vi: 'Không dùng object style inline.' }] },
  ],
  idBatBuoc: [['#app-nav · #title · #summary · .room-card#room-<id> · .feature · .schedule .booking-row · .first-free · .room-count · .no-bookings', { en: 'kept from milestone 3', vi: 'giữ từ mốc 3' }]],
  truDiem: [{ en: 'Copying Bootstrap HTML with <code>class=</code>.', vi: 'Chép HTML Bootstrap với <code>class=</code>.' }, { en: 'Fixed widths that break on phones.', vi: 'Độ rộng cố định làm vỡ bố cục trên điện thoại.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-4-project-ctbooking-m4',
  ten: 'CT Booking · Milestone 4 — Responsive layout (React-Bootstrap)',
  khoa: KHOA,
  baiHoc: 'fer202-4-ex10-react-bootstrap',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 4 — Responsive layout with React-Bootstrap', vi: 'CT Booking · Mốc 4 — Bố cục đáp ứng với React-Bootstrap' },
      doKho: 'MEDIUM', phut: 60, diem: 100,
      khaiNiem: ['React-Bootstrap', 'responsive grid', 'Card', 'ListGroup', 'Badge'],
      tienQuyet: ['CT Booking · Milestone 3'],
      the: ['fer202', 'project', 'ct-booking', 'bootstrap'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'breakpoint', vi: 'mốc độ rộng màn hình' }, ...tn('rubric')],
      goiY: ['import { Badge, Card, Col, Container, ListGroup, Navbar, Row } from "react-bootstrap";', '<Row className="g-3">{ROOMS.map(room => <Col key={room.id} xs={12} md={6} lg={4}><Card className="room-card" id={…}>…</Card></Col>)}</Row>'],
      loiHayGap: ['Đặt key trên Card thay vì Col (phần tử ngoài cùng trong map).', 'Quên import CSS Bootstrap ⇒ component không có kiểu (index.js đã có sẵn).'],
      moTaNgan: 'Dự án CT Booking mốc 4: chuyển trang phòng sang React-Bootstrap — navbar, lưới 1/2/3 cột, Card + Badge, ListGroup, badge chân thẻ. Thang 10.',
      giaiThich: '<p>Dữ liệu và luật không đổi; chỉ lớp trình bày thay sang component Bootstrap. Giữ nguyên class/id cũ giúp mọi kiểm của mốc trước vẫn đúng — kỷ luật quan trọng khi làm dự án nhiều giai đoạn.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap'], kiem: KIEM },
      khoiDau: { 'src/App.js': S_APP, ...CHUNG },
      loiGiai: { 'src/App.js': APP_M4, ...CHUNG },
      demo: { tepChinh: 'src/index.js' },
    },
  ],
});
