/**
 * FER202 · Dự án CT Booking — MỐC 6 (Chương 6 · sự kiện & form): form đặt phòng, lỗi theo ô + luật nghiệp vụ mốc 2.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M5, APP_M6, BOOKING_FORM_M6, M5_FILES, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const gui = { hanhDong: 'gui', selector: '#booking-form' };
const CHUNG = { 'src/index.js': index({ bootstrap: true }), 'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE, ...M5_FILES };
const S_APP = APP_M5.replace('// src/App.js — mốc 5: chia component, state "phòng đang chọn" + "ô đang chọn"', '// src/App.js — STARTER mốc 6 = lời giải mốc 5; bookings thành state + thêm BookingForm');

const chon = (room, slotIdx) => [click(`#room-${room} .btn-select`), click(`#selected-panel .slot:nth-child(${slotIdx})`)];
const dien = (name, student, purpose, duration) => [nhap('#name', name), nhap('#student', student), ...(duration ? [{ hanhDong: 'doi', selector: '#duration', giaTri: duration }] : []), nhap('#purpose', purpose)];
const DAT_OK = [...chon(1, 2), ...dien('Lan', 'HE180010', 'Study React'), gui]; // 11:00, 60 phút

const KIEM = [
  { nhom: 'f1', moTa: 'Booking form appears with the selected room', kiem: 'text', selector: '#btn-book', giaTri: 'Book Room A1', truoc: [click('#room-1 .btn-select')] },
  { nhom: 'f1', moTa: 'Controlled select for duration (default 60)', kiem: 'thuoc-tinh-js', selector: '#duration', thuocTinh: 'value', giaTri: '60', truoc: [click('#room-1 .btn-select')] },
  { nhom: 'f2', moTa: 'Field errors on an empty submit', kiem: 'danh-sach-text', selector: '#booking-form .error', mongDoi: ['Choose a start time first', 'Name is required', 'Student code looks like HE180001', 'Purpose needs at least 5 characters'], truoc: [click('#room-1 .btn-select'), gui] },
  { nhom: 'f2', moTa: 'Student code format', kiem: 'text', selector: '#err-student', giaTri: 'Student code looks like HE180001', truoc: [...chon(1, 2), ...dien('Lan', 'he18', 'Study React'), gui] },
  { nhom: 'f2', an: true, moTa: 'No page reload on submit', kiem: 'khong-tai-lai', truoc: [click('#room-1 .btn-select'), gui] },
  { nhom: 'f3', moTa: 'Rule error from validateBooking: overlap', kiem: 'danh-sach-text', selector: '.rule-error', mongDoi: ['Overlaps with an existing booking'], truoc: [...chon(1, 1), ...dien('Lan', 'HE180010', 'Study React'), gui] },
  { nhom: 'f3', moTa: 'Rule error: opening hours', kiem: 'danh-sach-text', selector: '.rule-error', mongDoi: ['Outside opening hours (08:00–17:00)'], truoc: [click('#room-3 .btn-select'), click('#selected-panel .slot:last-child'), ...dien('Lan', 'HE180010', 'Study React', '60'), gui] },
  { nhom: 'f3', an: true, moTa: 'Form uses the domain rules', kiem: 'ma-nguon', tep: 'src/components/BookingForm.js', khop: 'validateBooking\\(' },
  { nhom: 'f4', moTa: 'Successful booking message', kiem: 'text', selector: '#booking-success', giaTri: 'Booked Room A1 11:00–12:00 for Lan', truoc: DAT_OK },
  { nhom: 'f4', moTa: 'Card and schedule update', kiem: 'danh-sach-text', selector: '#room-1 .room-count, #room-1 .booking-row:last-child', mongDoi: ['3 bookings today', '11:00–12:00 (60 min) · Lan · Study React'], truoc: DAT_OK },
  { nhom: 'f4', moTa: 'Summary counts the new booking', kiem: 'text', selector: '#summary', giaTri: '3 rooms · 4 bookings today', truoc: DAT_OK },
  { nhom: 'f4', an: true, moTa: 'Booked slots disappear from the picker', kiem: 'danh-sach-text', selector: '#selected-panel .slot:nth-child(-n+2)', mongDoi: ['09:30', '12:00'], truoc: DAT_OK },
  { nhom: 'f5', moTa: 'Form resets and slot clears after booking', kiem: 'danh-sach-text', selector: '#selected-slot', mongDoi: ['Choose a start time'], truoc: DAT_OK },
  { nhom: 'f5', an: true, moTa: 'Name input empty again', kiem: 'thuoc-tinh-js', selector: '#name', thuocTinh: 'value', giaTri: '', truoc: DAT_OK },
  { nhom: 'f5', an: true, moTa: 'One change handler using the input name', kiem: 'ma-nguon', tep: 'src/components/BookingForm.js', khop: '\\[\\s*e\\.target\\.name\\s*\\]' },
];

const BAN_IN = banInMoc({
  moc: 6, chuong: 6, phut: 100,
  en: 'Booking form', vi: 'Form đặt phòng',
  moTa: {
    en: '<p>Make CT Booking actually book. <code>bookings</code> becomes state in <code>App</code>; the selected panel gets a <code>BookingForm</code> (one state object, one change handler) that shows field errors, then checks the milestone-2 business rules with <code>validateBooking</code> before calling <code>onBook</code>. Cards, schedules, free slots and the summary update automatically because they are all computed from state.</p>',
    vi: '<p>Cho CT Booking đặt phòng thật. <code>bookings</code> thành state trong <code>App</code>; bảng chọn có thêm <code>BookingForm</code> (một state object, một handler) hiện lỗi theo ô, rồi kiểm luật nghiệp vụ mốc 2 bằng <code>validateBooking</code> trước khi gọi <code>onBook</code>. Thẻ, lịch, ô trống và dòng tóm tắt tự cập nhật vì đều tính từ state.</p>',
  },
  cay: `
src/
├── components/BookingForm.js   # ← new: fieldErrors + validateBooking
├── components/RoomCard.js · Schedule.js · SlotPicker.js   (milestone 5)
├── App.js                      # bookings state + onBook
└── data/ · domain/ (given)`,
  chucNang: [
    { ten: { en: 'Form fields', vi: 'Các ô nhập' }, diem: 1.5, yeuCau: [{ en: '<code>Form#booking-form noValidate</code>: <code>#name</code>, <code>#student</code>, <code>#duration</code> (30/60/90/120, default 60), <code>#purpose</code>, <code>#btn-book</code> <code>Book Room A1</code>.', vi: '<code>Form#booking-form noValidate</code>: <code>#name</code>, <code>#student</code>, <code>#duration</code> (30/60/90/120, mặc định 60), <code>#purpose</code>, <code>#btn-book</code> <code>Book Room A1</code>.' }] },
    { ten: { en: 'Field validation', vi: 'Kiểm từng ô' }, diem: 2, yeuCau: [{ en: '<code>#err-slot</code> <code>Choose a start time first</code>, <code>#err-name</code> <code>Name is required</code>, <code>#err-student</code> <code>Student code looks like HE180001</code> (2 capitals + 6 digits), <code>#err-purpose</code> <code>Purpose needs at least 5 characters</code>.', vi: '<code>#err-slot</code> <code>Choose a start time first</code>, <code>#err-name</code> <code>Name is required</code>, <code>#err-student</code> <code>Student code looks like HE180001</code> (2 chữ hoa + 6 số), <code>#err-purpose</code> <code>Purpose needs at least 5 characters</code>.' }] },
    { ten: { en: 'Business rules', vi: 'Luật nghiệp vụ' }, diem: 2, yeuCau: [{ en: 'End = start + duration; <code>validateBooking</code> messages shown as <code>.rule-error</code> (overlap, opening hours…); nothing is booked.', vi: 'Giờ kết thúc = bắt đầu + thời lượng; thông điệp của <code>validateBooking</code> hiện ở <code>.rule-error</code> (trùng giờ, giờ mở cửa…); không đặt gì.' }], viDu: 'Room A1, 09:30 + 60 min ⇒ "Overlaps with an existing booking"' },
    { ten: { en: 'Booking saved', vi: 'Đặt thành công' }, diem: 3, yeuCau: [{ en: 'New id = max + 1; <code>#booking-success</code> <code>Booked Room A1 11:00–12:00 for Lan</code>; counts, schedule, free slots and <code>#summary</code> update.', vi: 'Id mới = max + 1; <code>#booking-success</code> <code>Booked Room A1 11:00–12:00 for Lan</code>; số lượt, lịch, ô trống và <code>#summary</code> cập nhật.' }] },
    { ten: { en: 'Reset', vi: 'Làm mới' }, diem: 1.5, yeuCau: [{ en: 'After booking the form is empty again and the slot selection cleared.', vi: 'Sau khi đặt, form trống lại và ô đã chọn được xoá.' }] },
  ],
  idBatBuoc: [['#booking-form · #name · #student · #duration · #purpose · #btn-book · #err-* · .rule-error · #booking-success', { en: 'new in milestone 6', vi: 'mới ở mốc 6' }]],
  truDiem: [{ en: 'Duplicating the overlap rule inside the form instead of calling the domain.', vi: 'Viết lại luật trùng giờ trong form thay vì gọi lõi nghiệp vụ.' }, { en: 'Form without preventDefault — the page reloads and loses everything.', vi: 'Form thiếu preventDefault — trang tải lại, mất hết.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-6-project-ctbooking-m6',
  ten: 'CT Booking · Milestone 6 — Booking form',
  khoa: KHOA,
  baiHoc: 'fer202-6-1-events-forms',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 6 — Booking form with field and business validation', vi: 'CT Booking · Mốc 6 — Form đặt phòng có kiểm ô và kiểm nghiệp vụ' },
      doKho: 'HARD', phut: 100, diem: 100,
      khaiNiem: ['controlled form', 'single state object', 'field vs business validation', 'state updates propagate', 'preventDefault'],
      tienQuyet: ['CT Booking · Milestone 5'],
      the: ['fer202', 'project', 'ct-booking', 'forms'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'business validation', vi: 'kiểm theo luật nghiệp vụ (khác kiểm định dạng ô)' }, ...tn('rubric')],
      goiY: ['fieldErrors(values, slot) trả object lỗi; có lỗi ⇒ dừng; không ⇒ dựng booking rồi validateBooking(booking, bookings).', 'App: setBookings(list => [...list, { ...booking, id }]); mọi thứ khác tự tính lại.'],
      loiHayGap: ['Quên Number(values.duration) ⇒ addMinutes nhận chuỗi.', 'Đặt BookingForm không có key theo phòng ⇒ đổi phòng vẫn giữ chữ cũ (ở đây có thể chấp nhận, nhưng nên có chủ đích).'],
      moTaNgan: 'Dự án CT Booking mốc 6: form đặt phòng — một state object, lỗi theo ô, luật nghiệp vụ từ validateBooking, thêm lượt vào state, thẻ/lịch/ô trống tự cập nhật. Thang 10.',
      giaiThich: '<p>Hai tầng kiểm: định dạng từng ô (ở form) và luật nghiệp vụ (ở lõi mốc 2, dùng lại). Khi lượt mới vào state <code>bookings</code>, mọi thứ hiển thị đều được tính lại — không cần cập nhật tay từng chỗ.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types'], kiem: KIEM },
      khoiDau: { 'src/App.js': S_APP, 'src/components/BookingForm.js': `// src/components/BookingForm.js — STARTER\nexport default function BookingForm() {\n  return null;\n}\n`, ...CHUNG },
      loiGiai: { 'src/App.js': APP_M6, 'src/components/BookingForm.js': BOOKING_FORM_M6, ...CHUNG },
      demo: { tepChinh: 'src/index.js' },
    },
  ],
});
