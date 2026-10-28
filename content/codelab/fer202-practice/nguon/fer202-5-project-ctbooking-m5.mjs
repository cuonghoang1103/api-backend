/**
 * FER202 · Dự án CT Booking — MỐC 5 (Chương 5 · component, props, state): tách component + PropTypes, chọn phòng/ô.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M4, APP_M5, M5_FILES, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const CHUNG = { 'src/index.js': index({ bootstrap: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE };
const S_APP = APP_M4.replace('// src/App.js — mốc 4: cùng dữ liệu, giao diện React-Bootstrap đáp ứng', '// src/App.js — STARTER mốc 5 = lời giải mốc 4; tách RoomCard / Schedule / SlotPicker và thêm state chọn phòng + ô');
const stub = (ten) => `// src/components/${ten}.js — STARTER
export default function ${ten}() {
  return null;
}
`;

const KIEM = [
  { nhom: 'f1', moTa: 'Cards still render (now via RoomCard)', kiem: 'danh-sach-text', selector: '.room-card .room-name', mongDoi: ['Room A1', 'Room A2', 'Room B1'] },
  { nhom: 'f1', moTa: 'App renders <RoomCard> with props', kiem: 'ma-nguon', tep: 'src/App.js', khop: '<RoomCard[\\s\\S]*room=\\{[\\s\\S]*onSelect=\\{' },
  { nhom: 'f1', an: true, moTa: 'Schedule extracted', kiem: 'danh-sach-text', selector: '#room-1 .schedule .booking-row', mongDoi: ['08:00–09:30 (90 min) · An · SWT301 review', '10:00–11:00 (60 min) · Binh · FER202 project'] },
  { nhom: 'f2', moTa: 'Selecting a room highlights its card', kiem: 'ton-tai', selector: '#room-2.selected', truoc: [click('#room-2 .btn-select')] },
  { nhom: 'f2', moTa: 'Selected panel shows the room', kiem: 'text', selector: '#selected-room', giaTri: 'Selected: Room A2', truoc: [click('#room-2 .btn-select')] },
  { nhom: 'f2', moTa: 'Only one card selected at a time', kiem: 'so-luong', selector: '.room-card.selected', giaTri: 1, truoc: [click('#room-2 .btn-select'), click('#room-3 .btn-select')] },
  { nhom: 'f2', an: true, moTa: 'No panel before selecting', kiem: 'khong-ton-tai', selector: '#selected-panel' },
  { nhom: 'f3', moTa: 'Slot picker lists the room\'s free slots', kiem: 'danh-sach-text', selector: '#selected-panel .slot:nth-child(-n+3)', mongDoi: ['09:30', '11:00', '11:30'], truoc: [click('#room-1 .btn-select')] },
  { nhom: 'f3', moTa: 'Choosing a slot (controlled)', kiem: 'danh-sach-text', selector: '.slot.active, #selected-slot', mongDoi: ['11:00', 'Selected slot: 11:00–11:30'], truoc: [click('#room-1 .btn-select'), click('#selected-panel .slot:nth-child(2)')] },
  { nhom: 'f3', moTa: 'Changing room resets the slot', kiem: 'text', selector: '#selected-slot', giaTri: 'Choose a start time', truoc: [click('#room-1 .btn-select'), click('#selected-panel .slot:nth-child(2)'), click('#room-2 .btn-select')] },
  { nhom: 'f3', an: true, moTa: 'Clear selection hides the panel', kiem: 'khong-ton-tai', selector: '#selected-panel, .room-card.selected', truoc: [click('#room-1 .btn-select'), click('#clear-selection')] },
  { nhom: 'f4', moTa: 'RoomCard declares PropTypes with a room shape', kiem: 'ma-nguon', tep: 'src/components/RoomCard.js', khop: 'RoomCard\\.propTypes\\s*=[\\s\\S]*PropTypes\\.shape\\(' },
  { nhom: 'f4', an: true, moTa: 'SlotPicker is controlled (no own state)', kiem: 'ma-nguon', tep: 'src/components/SlotPicker.js', khop: 'useState', phuDinh: true },
  { nhom: 'f4', an: true, moTa: 'SlotPicker PropTypes', kiem: 'ma-nguon', tep: 'src/components/SlotPicker.js', khop: 'SlotPicker\\.propTypes' },
];

const BAN_IN = banInMoc({
  moc: 5, chuong: 5, phut: 90,
  en: 'Components, props and selection state', vi: 'Component, props và state chọn',
  moTa: {
    en: '<p>Split the page into reusable components with documented props (<code>RoomCard</code>, <code>Schedule</code>, <code>SlotPicker</code>), then add the first interaction: selecting a room and a 30-minute start slot. The state lives in <code>App</code>; children only receive values and callbacks.</p>',
    vi: '<p>Tách trang thành component dùng lại có props được mô tả (<code>RoomCard</code>, <code>Schedule</code>, <code>SlotPicker</code>), rồi thêm tương tác đầu tiên: chọn phòng và một ô bắt đầu 30 phút. State nằm ở <code>App</code>; component con chỉ nhận giá trị và callback.</p>',
  },
  cay: `
src/
├── components/
│   ├── RoomCard.js     # props: room, bookings, freeCount, firstFree, selected, onSelect
│   ├── Schedule.js     # props: bookings
│   └── SlotPicker.js   # props: slots, value, onChange (controlled)
├── App.js              # state: selectedRoomId, selectedSlot
└── data/ · domain/     (given)`,
  chucNang: [
    { ten: { en: 'Component split', vi: 'Tách component' }, diem: 2.5, yeuCau: [{ en: '<code>RoomCard</code> renders one card (and uses <code>Schedule</code>); App maps rooms to <code>&lt;RoomCard … onSelect={…} /&gt;</code>. Output identical to milestone 4.', vi: '<code>RoomCard</code> vẽ một thẻ (dùng <code>Schedule</code>); App map phòng thành <code>&lt;RoomCard … onSelect={…} /&gt;</code>. Kết quả giống mốc 4.' }] },
    { ten: { en: 'Room selection', vi: 'Chọn phòng' }, diem: 2.5, yeuCau: [{ en: '<code>.btn-select</code> in each card; selected card gets class <code>selected</code>; <code>#selected-panel</code> with <code>#selected-room</code> <code>Selected: Room A2</code>; <code>#clear-selection</code>.', vi: '<code>.btn-select</code> ở mỗi thẻ; thẻ được chọn có class <code>selected</code>; <code>#selected-panel</code> với <code>#selected-room</code> <code>Selected: Room A2</code>; <code>#clear-selection</code>.' }] },
    { ten: { en: 'Controlled slot picker', vi: 'Chọn ô (điều khiển)' }, diem: 3, yeuCau: [{ en: '<code>SlotPicker</code> shows <code>.slot</code> buttons for the room\'s free slots; the chosen one is <code>.active</code>; <code>#selected-slot</code> <code>Selected slot: 11:00–11:30</code> or <code>Choose a start time</code>. Changing room clears the slot.', vi: '<code>SlotPicker</code> hiện nút <code>.slot</code> cho các ô trống của phòng; ô đang chọn có <code>.active</code>; <code>#selected-slot</code> <code>Selected slot: 11:00–11:30</code> hoặc <code>Choose a start time</code>. Đổi phòng thì xoá ô đã chọn.' }], viDu: 'Room A1 → click 11:00 ⇒ "Selected slot: 11:00–11:30"' },
    { ten: { en: 'PropTypes', vi: 'PropTypes' }, diem: 2, yeuCau: [{ en: 'All three components declare PropTypes (<code>shape</code> for room, <code>arrayOf</code> for lists); SlotPicker keeps no state.', vi: 'Cả ba component khai PropTypes (<code>shape</code> cho room, <code>arrayOf</code> cho danh sách); SlotPicker không giữ state.' }] },
  ],
  idBatBuoc: [['.btn-select · .room-card.selected · #selected-panel · #selected-room · .slot(.active) · #selected-slot · #clear-selection', { en: 'new in milestone 5', vi: 'mới ở mốc 5' }]],
  truDiem: [{ en: 'Each RoomCard keeping its own "selected" state — two cards can be selected.', vi: 'Mỗi RoomCard tự giữ state "selected" — hai thẻ cùng được chọn.' }, { en: 'Slot left from the previous room after switching.', vi: 'Ô của phòng trước còn sót khi đổi phòng.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-5-project-ctbooking-m5',
  ten: 'CT Booking · Milestone 5 — Components, props & selection',
  khoa: KHOA,
  baiHoc: 'fer202-5-1-components-props',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 5 — Components, props and selection state', vi: 'CT Booking · Mốc 5 — Component, props và state chọn' },
      doKho: 'MEDIUM', phut: 90, diem: 100,
      khaiNiem: ['component extraction', 'props & callbacks', 'lifting state up', 'controlled components', 'PropTypes'],
      tienQuyet: ['CT Booking · Milestone 4'],
      the: ['fer202', 'project', 'ct-booking', 'components'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'lifting state up', vi: 'đưa state lên component cha chung' }, ...tn('rubric')],
      goiY: ['const [selectedRoomId, setSelectedRoomId] = useState(null); RoomCard nhận selected={room.id === selectedRoomId}.', 'selectRoom(id) đặt cả setSelectedSlot(null).'],
      loiHayGap: ['Truyền onSelect={selectRoom(room.id)} (gọi ngay khi render) thay vì để RoomCard gọi onSelect(room.id).', 'SlotPicker tự useState(value) ⇒ lệch với cha.'],
      moTaNgan: 'Dự án CT Booking mốc 5: tách RoomCard/Schedule/SlotPicker có PropTypes, state chọn phòng và ô ở App, SlotPicker điều khiển. Thang 10.',
      giaiThich: '<p>State chọn nằm ở cha chung (App) vì cả thẻ phòng lẫn bảng chọn ô cần nó. Component con nhận dữ liệu qua props và báo sự kiện qua callback — một nguồn sự thật, không bao giờ lệch.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types'], kiem: KIEM },
      khoiDau: { 'src/App.js': S_APP, 'src/components/RoomCard.js': stub('RoomCard'), 'src/components/Schedule.js': stub('Schedule'), 'src/components/SlotPicker.js': stub('SlotPicker'), ...CHUNG },
      loiGiai: { 'src/App.js': APP_M5, ...M5_FILES, ...CHUNG },
      demo: { tepChinh: 'src/index.js' },
    },
  ],
});
