/**
 * FER202 · Dự án CT Booking — MỐC 8 (Chương 8 · Hooks): useReducer, lưu localStorage, custom hook useFreeSlots, useRef focus.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M7, APP_M8, BOOKING_FORM_M6, BOOKING_FORM_M8, M5_FILES, M7_FILES, M8_FILES, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const BASE = { 'src/index.js': index({ bootstrap: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE, ...M5_FILES };
const KHOI = {
  ...BASE, ...M7_FILES, 'src/components/BookingForm.js': BOOKING_FORM_M6,
  'src/App.js': APP_M7.replace('// src/App.js — mốc 7: Provider bọc app; component đọc bookings/student từ Context', '// src/App.js — STARTER mốc 8 = lời giải mốc 7'),
  'src/hooks/useFreeSlots.js': '// src/hooks/useFreeSlots.js — STARTER\nexport function useFreeSlots() {\n  return [];\n}\n',
};
const GIAI = { ...BASE, ...M7_FILES, ...M8_FILES, 'src/components/BookingForm.js': BOOKING_FORM_M8, 'src/App.js': APP_M8 };

const LOGIN = (name, code) => [nhap('#login-name', name), nhap('#login-code', code), { hanhDong: 'gui', selector: '#login-form' }];
const DAT = [...LOGIN('Lan', 'HE180010'), click('#room-1 .btn-select'), click('#selected-panel .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }];

const KIEM = [
  { nhom: 'f1', moTa: 'Bookings survive a reload', kiem: 'text', selector: '#summary', giaTri: '3 rooms · 4 bookings today', truoc: [...DAT, { hanhDong: 'tai-lai' }] },
  { nhom: 'f1', moTa: 'Saved under "ctb-bookings"', kiem: 'kho-cuc-bo', khoa: 'ctb-bookings', khop: '"purpose":"Study React"', truoc: DAT },
  { nhom: 'f1', moTa: 'Cancellation survives a reload', kiem: 'danh-sach-text', selector: '#room-1 .room-count', mongDoi: ['1 booking today'], truoc: [...LOGIN('An', 'HE180001'), click('.my-booking .btn-cancel'), { hanhDong: 'tai-lai' }] },
  { nhom: 'f1', an: true, moTa: 'Corrupted storage falls back to the seed data', khoCucBo: { 'ctb-bookings': '{oops' }, kiem: 'text', selector: '#summary', giaTri: '3 rooms · 3 bookings today' },
  { nhom: 'f2', moTa: 'Student stays logged in after reload', kiem: 'text', selector: '#current-student', giaTri: 'Lan (HE180010)', truoc: [...LOGIN('Lan', 'HE180010'), { hanhDong: 'tai-lai' }] },
  { nhom: 'f2', an: true, moTa: 'Logout clears the stored student', kiem: 'kho-cuc-bo', khoa: 'ctb-student', tonTai: false, truoc: [...LOGIN('Lan', 'HE180010'), click('#logout')] },
  { nhom: 'f3', moTa: 'Reducer with ADD and CANCEL', kiem: 'ma-nguon', tep: 'src/context/BookingContext.js', khop: '^(?=[\\s\\S]*useReducer\\()(?=[\\s\\S]*case\\s+[\'"]ADD[\'"])(?=[\\s\\S]*case\\s+[\'"]CANCEL[\'"])' },
  { nhom: 'f3', an: true, moTa: 'Lazy init reads localStorage once', kiem: 'ma-nguon', tep: 'src/context/BookingContext.js', khop: 'useReducer\\(\\s*bookingsReducer\\s*,\\s*undefined\\s*,\\s*\\w+\\s*\\)' },
  { nhom: 'f4', moTa: 'Custom hook useFreeSlots (useMemo)', kiem: 'ma-nguon', tep: 'src/hooks/useFreeSlots.js', khop: 'export\\s+function\\s+useFreeSlots[\\s\\S]*useMemo\\(' },
  { nhom: 'f4', moTa: 'Slot picker fed by the hook', kiem: 'danh-sach-text', selector: '#selected-panel .slot:nth-child(-n+3)', mongDoi: ['09:30', '11:00', '11:30'], truoc: [click('#room-1 .btn-select')] },
  { nhom: 'f4', an: true, moTa: 'App uses the hook', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'useFreeSlots\\(' },
  { nhom: 'f5', moTa: 'Choosing a slot focuses Purpose', kiem: 'focus', selector: '#purpose', truoc: [click('#room-1 .btn-select'), click('#selected-panel .slot:nth-child(2)')] },
  { nhom: 'f5', an: true, moTa: 'Focus uses a ref', kiem: 'ma-nguon', tep: 'src/components/BookingForm.js', khop: 'useRef\\([\\s\\S]*\\.current\\.focus\\(\\)' },
];

const BAN_IN = banInMoc({
  moc: 8, chuong: 8, phut: 90,
  en: 'Hooks: reducer, persistence, custom hook, refs', vi: 'Hook: reducer, lưu bền, custom hook, ref',
  moTa: {
    en: '<p>Make CT Booking feel like a real app: bookings move to <code>useReducer</code> (actions <code>ADD</code>/<code>CANCEL</code>) and are saved to localStorage so a reload keeps them; the logged-in student is remembered too; free slots come from a custom hook <code>useFreeSlots(roomId)</code>; and choosing a time slot moves keyboard focus to the Purpose field.</p>',
    vi: '<p>Cho CT Booking giống ứng dụng thật: bookings chuyển sang <code>useReducer</code> (action <code>ADD</code>/<code>CANCEL</code>) và được lưu localStorage nên tải lại vẫn còn; sinh viên đăng nhập cũng được nhớ; ô trống lấy từ custom hook <code>useFreeSlots(roomId)</code>; và chọn giờ xong thì con trỏ nhảy sang ô Purpose.</p>',
  },
  cay: `
src/
├── context/BookingContext.js   # bookingsReducer + lazy init + save "ctb-bookings"
├── context/StudentContext.js   # save "ctb-student"
├── hooks/useFreeSlots.js       # ← new
├── components/BookingForm.js   # useRef focus
└── …                           (milestones 5–7)`,
  chucNang: [
    { ten: { en: 'Persisted bookings', vi: 'Lưu bền lượt đặt' }, diem: 3, yeuCau: [{ en: 'Lazy reducer init from localStorage <code>ctb-bookings</code> (corrupted ⇒ seed), saved in an effect after every change.', vi: 'Khởi tạo reducer lười từ localStorage <code>ctb-bookings</code> (hỏng ⇒ dữ liệu mẫu), lưu trong effect sau mỗi thay đổi.' }], viDu: 'book, reload ⇒ "3 rooms · 4 bookings today"' },
    { ten: { en: 'Remembered student', vi: 'Nhớ sinh viên' }, diem: 1.5, yeuCau: [{ en: 'Student stored in <code>ctb-student</code>; logout removes it.', vi: 'Sinh viên lưu ở <code>ctb-student</code>; đăng xuất thì xoá.' }] },
    { ten: { en: 'useReducer', vi: 'useReducer' }, diem: 2, yeuCau: [{ en: 'Exported pure <code>bookingsReducer</code> with <code>ADD</code> and <code>CANCEL</code>.', vi: 'Export <code>bookingsReducer</code> thuần với <code>ADD</code> và <code>CANCEL</code>.' }] },
    { ten: { en: 'Custom hook', vi: 'Custom hook' }, diem: 2, yeuCau: [{ en: '<code>useFreeSlots(roomId)</code> reads bookings from context and memoizes <code>freeSlots</code>; used by the slot picker.', vi: '<code>useFreeSlots(roomId)</code> đọc bookings từ context và memo <code>freeSlots</code>; bảng chọn ô dùng nó.' }] },
    { ten: { en: 'Focus management', vi: 'Quản lý focus' }, diem: 1.5, yeuCau: [{ en: 'When a slot is chosen, <code>#purpose</code> receives focus (ref + effect on <code>slot</code>).', vi: 'Khi chọn một ô giờ, <code>#purpose</code> nhận focus (ref + effect theo <code>slot</code>).' }] },
  ],
  idBatBuoc: [['localStorage: ctb-bookings · ctb-student', { en: 'storage keys', vi: 'khoá lưu' }]],
  truDiem: [{ en: 'Reading localStorage on every render instead of a lazy initializer.', vi: 'Đọc localStorage mỗi lần render thay vì khởi tạo lười.' }, { en: 'Writing storage inside the reducer.', vi: 'Ghi storage trong reducer.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-8-project-ctbooking-m8',
  ten: 'CT Booking · Milestone 8 — Hooks: reducer, persistence, custom hook',
  khoa: KHOA,
  baiHoc: 'fer202-8-2-usecontext-usereducer',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 8 — useReducer, persistence, useFreeSlots and focus', vi: 'CT Booking · Mốc 8 — useReducer, lưu bền, useFreeSlots và focus' },
      doKho: 'HARD', phut: 90, diem: 100,
      khaiNiem: ['useReducer', 'lazy initialization', 'localStorage persistence', 'custom hooks', 'useMemo', 'useRef focus'],
      tienQuyet: ['CT Booking · Milestone 7'],
      the: ['fer202', 'project', 'ct-booking', 'hooks'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'lazy initializer', vi: 'hàm khởi tạo chạy một lần' }, ...tn('persist', 'rubric')],
      goiY: ['useReducer(bookingsReducer, undefined, loadBookings) + useEffect(() => localStorage.setItem(KEY, JSON.stringify(bookings)), [bookings]).', 'BookingForm: const purposeRef = useRef(null); useEffect(() => { if (slot) purposeRef.current.focus(); }, [slot]).'],
      loiHayGap: ['Quên try/catch khi JSON.parse ⇒ dữ liệu hỏng làm trắng trang.', 'useMemo thiếu bookings trong phụ thuộc ⇒ đặt xong ô vẫn hiện trống.'],
      moTaNgan: 'Dự án CT Booking mốc 8: reducer ADD/CANCEL, lưu bookings + sinh viên vào localStorage, custom hook useFreeSlots, focus bằng useRef. Thang 10.',
      giaiThich: '<p>Reducer gom các thay đổi về một hàm thuần dễ test; khởi tạo lười đọc storage đúng một lần; effect lưu lại sau mỗi lần đổi. Custom hook gói "đọc context + tính + ghi nhớ" để component chỉ gọi một dòng.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types'], kiem: KIEM },
      khoiDau: KHOI,
      loiGiai: GIAI,
      demo: { tepChinh: 'src/index.js' },
    },
  ],
});
