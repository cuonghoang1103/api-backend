/**
 * FER202 · Dự án CT Booking — MỐC 2 (Chương 2 · ES6): lõi nghiệp vụ thuần JavaScript.
 * Mọi mốc sau dùng lại đúng tệp này (đổi thành ES module ở mốc 3).
 */
import { doiDau, KHOA, tn } from './_chung.mjs';
import { banInMoc, DATA_SCRIPT, DOMAIN_SCRIPT } from './_ctbooking.mjs';

const DAU = `// booking.js — STARTER: lõi nghiệp vụ CT Booking (giữ đúng tên hàm)
const OPEN = '08:00';
const CLOSE = '17:00';
const MAX_MINUTES = 120;

function toMinutes(time) {}
function toTime(minutes) {}
function overlaps(a, b) {}
function validateBooking(booking, existing = []) {}
function freeSlots(roomId, bookings, step = 30) {}
function countByRoom(bookings) {}
function sortBookings(list) {}
function formatRange(booking) {}
function addMinutes(time, minutes) {}
`;

const KIEM = [
  // f1 time helpers
  { nhom: 'f1', moTa: 'toMinutes / toTime', goi: '[toMinutes("08:30"), toTime(510), toTime(1020)]', mongDoi: [510, '08:30', '17:00'] },
  { nhom: 'f1', moTa: 'addMinutes', goi: '[addMinutes("09:30", 60), addMinutes("16:30", 30)]', mongDoi: ['10:30', '17:00'] },
  { nhom: 'f1', an: true, moTa: 'Leading zeros', goi: 'toTime(65)', mongDoi: '01:05' },
  // f2 overlaps
  { nhom: 'f2', moTa: 'Overlapping ranges', goi: 'overlaps({ start: "08:00", end: "09:30" }, { start: "09:00", end: "10:00" })', mongDoi: true },
  { nhom: 'f2', moTa: 'Touching ranges do not overlap', goi: 'overlaps({ start: "08:00", end: "09:30" }, { start: "09:30", end: "10:00" })', mongDoi: false },
  { nhom: 'f2', an: true, moTa: 'One inside the other', goi: 'overlaps({ start: "10:00", end: "12:00" }, { start: "10:30", end: "11:00" })', mongDoi: true },
  // f3 validateBooking
  { nhom: 'f3', moTa: 'Valid booking ⇒ no errors', goi: 'validateBooking({ roomId: 1, start: "11:00", end: "12:30" }, BOOKINGS)', mongDoi: [] },
  { nhom: 'f3', moTa: 'Overlap in the same room', goi: 'validateBooking({ roomId: 1, start: "09:00", end: "10:00" }, BOOKINGS)', mongDoi: ['Overlaps with an existing booking'] },
  { nhom: 'f3', moTa: 'Several rules at once', goi: 'validateBooking({ roomId: 3, start: "16:00", end: "18:30" }, BOOKINGS)', mongDoi: ['Outside opening hours (08:00–17:00)', 'Maximum 2 hours per booking'] },
  { nhom: 'f3', an: true, moTa: 'Start after end', goi: 'validateBooking({ roomId: 3, start: "10:00", end: "09:00" }, [])', mongDoi: ['Start must be before end'] },
  { nhom: 'f3', an: true, moTa: 'Other rooms and the booking itself are ignored', goi: '[validateBooking({ roomId: 3, start: "09:00", end: "10:00" }, BOOKINGS), validateBooking({ id: 1, roomId: 1, start: "08:00", end: "09:00" }, BOOKINGS)]', mongDoi: [[], []] },
  // f4 freeSlots
  { nhom: 'f4', moTa: 'Free 30-minute slots of Room A1', goi: 'freeSlots(1, BOOKINGS).slice(0, 4)', mongDoi: ['09:30', '11:00', '11:30', '12:00'] },
  { nhom: 'f4', moTa: 'Counts', goi: '[freeSlots(1, BOOKINGS).length, freeSlots(2, BOOKINGS).length, freeSlots(3, BOOKINGS).length]', mongDoi: [13, 15, 18] },
  { nhom: 'f4', an: true, moTa: 'Custom step of 60 minutes', goi: 'freeSlots(2, BOOKINGS, 60)', mongDoi: ['08:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
  // f5 countByRoom + sortBookings
  { nhom: 'f5', moTa: 'countByRoom with reduce', goi: 'countByRoom(BOOKINGS)', mongDoi: { 1: 2, 2: 1 } },
  { nhom: 'f5', moTa: 'sortBookings sorts a copy by room then start', goi: 'sortBookings([BOOKINGS[2], BOOKINGS[1], BOOKINGS[0]]).map((b) => b.id)', mongDoi: [1, 2, 3] },
  { nhom: 'f5', an: true, moTa: 'Input array untouched', chuanBi: 'const input = [BOOKINGS[2], BOOKINGS[0]]; sortBookings(input);', goi: 'input.map((b) => b.id)', mongDoi: [3, 1] },
  // f6 formatRange
  { nhom: 'f6', moTa: 'formatRange with duration', goi: 'BOOKINGS.map(formatRange)', mongDoi: ['08:00–09:30 (90 min)', '10:00–11:00 (60 min)', '09:00–10:30 (90 min)'] },
  { nhom: 'f6', an: true, moTa: 'Destructured parameter + template literal', kiem: 'ma-nguon', tep: 'booking.js', khop: 'function\\s+formatRange\\s*\\(\\s*\\{\\s*start\\s*,\\s*end\\s*\\}' },
  { nhom: 'f6', an: true, moTa: 'No var', kiem: 'ma-nguon', tep: 'booking.js', khop: '\\bvar\\s', phuDinh: true },
];

const BAN_IN = banInMoc({
  moc: 2, chuong: 2, phut: 90,
  en: 'Booking rules in pure JavaScript', vi: 'Luật đặt phòng bằng JavaScript thuần',
  moTa: {
    en: '<p><b>CT Booking</b> lets FPT students book group-study rooms in the library for today. Every later milestone (JSX, Bootstrap, components, forms, Context, hooks, Router, lazy loading, HTTP, Redux) builds on the rules you write now, so they must be <b>pure functions</b> that never change their inputs. Rooms open 08:00–17:00, a booking lasts at most 2 hours, and two bookings of the same room may not overlap (touching is fine: 09:30–10:00 after 08:00–09:30).</p>',
    vi: '<p><b>CT Booking</b> cho sinh viên FPT đặt phòng học nhóm ở thư viện trong ngày. Mọi mốc sau (JSX, Bootstrap, component, form, Context, hook, Router, tải lười, HTTP, Redux) đều dùng lại các luật bạn viết bây giờ, nên chúng phải là <b>hàm thuần</b> không sửa dữ liệu vào. Phòng mở 08:00–17:00, mỗi lượt tối đa 2 giờ, hai lượt cùng phòng không được chồng giờ (chạm nhau thì được: 09:30–10:00 sau 08:00–09:30).</p>',
  },
  cay: `
data.js      # ROOMS, BOOKINGS (given)
booking.js   # toMinutes · toTime · addMinutes · overlaps · validateBooking · freeSlots · countByRoom · sortBookings · formatRange`,
  chucNang: [
    { ten: { en: 'Time helpers', vi: 'Hàm thời gian' }, diem: 1, yeuCau: [{ en: '<code>toMinutes("08:30") = 510</code>, <code>toTime(510) = "08:30"</code> (leading zeros), <code>addMinutes("09:30", 60) = "10:30"</code>.', vi: '<code>toMinutes("08:30") = 510</code>, <code>toTime(510) = "08:30"</code> (có số 0 đầu), <code>addMinutes("09:30", 60) = "10:30"</code>.' }] },
    { ten: { en: 'Overlap rule', vi: 'Luật chồng giờ' }, diem: 1.5, yeuCau: [{ en: '<code>overlaps(a, b)</code> for half-open ranges [start, end): touching ranges do NOT overlap.', vi: '<code>overlaps(a, b)</code> cho khoảng nửa mở [start, end): chạm nhau thì KHÔNG chồng.' }], viDu: 'overlaps(08:00–09:30, 09:30–10:00)  ⇒  false' },
    { ten: { en: 'Validation', vi: 'Kiểm hợp lệ' }, diem: 2.5, yeuCau: [{ en: '<code>validateBooking(b, existing)</code> ⇒ array of messages in this order: <code>Start must be before end</code>, <code>Outside opening hours (08:00–17:00)</code>, <code>Maximum 2 hours per booking</code>, <code>Overlaps with an existing booking</code> (same room, different id).', vi: '<code>validateBooking(b, existing)</code> ⇒ mảng thông điệp theo thứ tự: <code>Start must be before end</code>, <code>Outside opening hours (08:00–17:00)</code>, <code>Maximum 2 hours per booking</code>, <code>Overlaps with an existing booking</code> (cùng phòng, khác id).' }] },
    { ten: { en: 'Free slots', vi: 'Ô trống' }, diem: 2, yeuCau: [{ en: '<code>freeSlots(roomId, bookings, step = 30)</code> ⇒ start times of every free <code>step</code>-minute slot between 08:00 and 17:00.', vi: '<code>freeSlots(roomId, bookings, step = 30)</code> ⇒ giờ bắt đầu của mọi ô trống dài <code>step</code> phút trong 08:00–17:00.' }] },
    { ten: { en: 'reduce & sorting a copy', vi: 'reduce & sắp bản sao' }, diem: 2, yeuCau: [{ en: '<code>countByRoom</code> ⇒ <code>{ roomId: count }</code> with <code>reduce</code>; <code>sortBookings</code> ⇒ new array by room then start.', vi: '<code>countByRoom</code> ⇒ <code>{ roomId: số lượng }</code> bằng <code>reduce</code>; <code>sortBookings</code> ⇒ mảng mới theo phòng rồi giờ bắt đầu.' }] },
    { ten: { en: 'Formatting', vi: 'Định dạng' }, diem: 1, yeuCau: [{ en: '<code>formatRange({ start, end })</code> ⇒ <code>08:00–09:30 (90 min)</code> (destructured parameter, template literal).', vi: '<code>formatRange({ start, end })</code> ⇒ <code>08:00–09:30 (90 min)</code> (tham số destructuring, template literal).' }] },
  ],
  idBatBuoc: [['toMinutes · toTime · addMinutes · overlaps · validateBooking · freeSlots · countByRoom · sortBookings · formatRange', { en: 'function names the grader calls', vi: 'tên hàm máy chấm gọi' }]],
  truDiem: [
    { en: 'Comparing times as strings without padding (<code>"9:00" &gt; "10:00"</code> is true!).', vi: 'So giờ dạng chuỗi không có số 0 đầu (<code>"9:00" &gt; "10:00"</code> là true!).' },
    { en: '<code>&lt;=</code> in the overlap test — back-to-back bookings become impossible.', vi: 'Dùng <code>&lt;=</code> trong phép so chồng giờ — hai lượt liền nhau không đặt được.' },
    { en: '<code>list.sort()</code> on the argument.', vi: '<code>list.sort()</code> trên tham số.' },
  ],
  nopBai: { en: 'Write <code>booking.js</code>; the grader loads <code>data.js</code> then <code>booking.js</code> and calls the functions.', vi: 'Viết <code>booking.js</code>; máy chấm nạp <code>data.js</code> rồi <code>booking.js</code> và gọi các hàm.' },
});

export default doiDau({
  slug: 'fer202-2-project-ctbooking-m2',
  ten: 'CT Booking · Milestone 2 — Booking rules (ES6)',
  khoa: KHOA,
  baiHoc: 'fer202-2-2-destructuring-spread-modules',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 2 — Booking rules in pure JavaScript', vi: 'CT Booking · Mốc 2 — Luật đặt phòng bằng JavaScript thuần' },
      doKho: 'MEDIUM', phut: 90, diem: 100,
      khaiNiem: ['pure functions', 'destructuring', 'template literals', 'reduce', 'sorting a copy', 'half-open intervals'],
      tienQuyet: ['Lab 2 — Student Data Toolkit'],
      the: ['fer202', 'project', 'ct-booking', 'es6'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'half-open interval', vi: 'khoảng nửa mở [đầu, cuối): gồm điểm đầu, không gồm điểm cuối' }, { en: 'business rule', vi: 'luật nghiệp vụ' }, ...tn('immutable', 'rubric')],
      goiY: [
        'Đổi mọi giờ sang phút rồi so sánh số — đừng so chuỗi.',
        'freeSlots: for (let t = toMinutes(OPEN); t + step <= toMinutes(CLOSE); t += step) { … nếu không overlaps với booking nào của phòng ⇒ push }.',
        'validateBooking: mỗi luật một if, push đúng thông điệp, giữ thứ tự.',
      ],
      loiHayGap: [
        'Quên padStart ⇒ "8:0" thay vì "08:00".',
        'So trùng giờ với cả booking của phòng khác.',
        'countByRoom sửa trực tiếp object tích luỹ rồi trả lại tham chiếu dùng chung ở lần gọi sau.',
      ],
      moTaNgan: 'Dự án CT Booking mốc 2: lõi nghiệp vụ thuần — giờ ↔ phút, chồng giờ nửa mở, kiểm hợp lệ 4 luật, ô trống, đếm bằng reduce, sắp bản sao, định dạng. Thang 10.',
      giaiThich: '<p>Lõi nghiệp vụ tách khỏi giao diện là nền của cả dự án: các mốc sau chỉ việc gọi những hàm này. Đổi giờ ra phút biến mọi so sánh thành so số; khoảng nửa mở <code>[start, end)</code> cho phép hai lượt nối tiếp nhau. Mọi hàm trả giá trị mới nên dùng an toàn với state của React ở các mốc sau.</p>',
      tests: { loai: 'js', phienBan: 1, tepChinh: 'booking.js', tepNap: ['data.js', 'booking.js'], kiem: KIEM },
      khoiDau: { 'booking.js': DAU, 'data.js': DATA_SCRIPT },
      loiGiai: { 'booking.js': DOMAIN_SCRIPT, 'data.js': DATA_SCRIPT },
    },
  ],
});
