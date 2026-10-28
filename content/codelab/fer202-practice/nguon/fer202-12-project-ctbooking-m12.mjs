/**
 * FER202 · Dự án CT Booking — MỐC 12 (Chương 12 · Redux Toolkit): chuyển dữ liệu sang store, giữ API cũ bằng "mặt tiền".
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';
import { APP_M11, APP_M12, BOOKINGS, BOOKING_FORM_M8, LAZY_HELPERS, M5_FILES, M7_FILES, M8_FILES, M9_FILES, M11_FILES, M12_FILES, ROOM_PAGE_M11, banInMoc, DATA_MODULE, DOMAIN_MODULE } from './_ctbooking.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const M11_GIAI = {
  'src/data/seed.js': DATA_MODULE, 'src/domain/booking.js': DOMAIN_MODULE, ...M5_FILES, ...M7_FILES, ...M8_FILES, ...M9_FILES,
  'src/components/BookingForm.js': BOOKING_FORM_M8, 'src/utils/lazy.js': LAZY_HELPERS, ...M11_FILES, 'src/pages/RoomPage.js': ROOM_PAGE_M11,
};
const stub = (p, mo) => `// ${p} — STARTER\n// ${mo}\nexport {};\n`;
const KHOI = {
  ...M11_GIAI,
  'src/index.js': index({ bootstrap: true, router: true, redux: './store' }),
  'src/App.js': APP_M11.replace('// src/App.js — mốc 11: dữ liệu từ json-server — trạng thái tải / lỗi + thử lại trong layout', '// src/App.js — STARTER mốc 12 = lời giải mốc 11 (index.js đã bọc <Provider store={store}>)'),
  'src/store/index.js': "// src/store/index.js — STARTER\nimport { configureStore } from '@reduxjs/toolkit';\n\nexport const store = configureStore({ reducer: { placeholder: (s = {}) => s } });\n",
  'src/store/bookingsSlice.js': stub('src/store/bookingsSlice.js', 'fetchBookings · createBooking · cancelBooking (createAsyncThunk) + slice'),
  'src/store/studentSlice.js': stub('src/store/studentSlice.js', 'loggedIn · loggedOut; initialState từ localStorage "ctb-student"'),
  'src/store/selectors.js': stub('src/store/selectors.js', 'selectBusiestRoom (createSelector)'),
};
const GIAI = { ...M11_GIAI, ...M12_FILES, 'src/index.js': index({ bootstrap: true, router: true, redux: './store' }), 'src/App.js': APP_M12 };

const LOGIN = (name, code) => [nhap('#login-name', name), nhap('#login-code', code), { hanhDong: 'gui', selector: '#login-form' }];
const DAT = [cho(), ...LOGIN('Lan', 'HE180010'), click('#room-1 .btn-select'), cho(700), click('#room-page .slot:nth-child(2)'), nhap('#purpose', 'Study React'), { hanhDong: 'gui', selector: '#booking-form' }, cho(800)];

const KIEM = [
  { nhom: 'f1', moTa: 'Store with bookings and student slices', kiem: 'ma-nguon', tep: 'src/store/index.js', khop: 'configureStore\\([\\s\\S]*bookings\\s*:[\\s\\S]*student\\s*:' },
  { nhom: 'f1', moTa: 'Bookings load through a thunk', url: '/rooms', kiem: 'danh-sach-text', selector: '#summary, .room-count', mongDoi: ['3 rooms · 3 bookings today', '2 bookings today', '1 booking today', '0 bookings today'], truoc: [cho()] },
  { nhom: 'f1', an: true, moTa: 'createAsyncThunk for the three API calls', kiem: 'ma-nguon', tep: 'src/store/bookingsSlice.js', khop: '^(?=[\\s\\S]*createAsyncThunk\\([\'"]bookings/fetch)(?=[\\s\\S]*createAsyncThunk\\([\'"]bookings/create)(?=[\\s\\S]*createAsyncThunk\\([\'"]bookings/cancel)' },
  { nhom: 'f2', moTa: 'Booking still works end to end (POST via thunk)', url: '/rooms', kiem: 'danh-sach-text', selector: '#booking-success, .my-booking-text', mongDoi: ['Booked Room A1 11:00–12:00 for Lan', 'Room A1 · 11:00–12:00 (60 min)'], truoc: DAT },
  { nhom: 'f2', moTa: 'Server received it', url: '/rooms', kiem: 'du-lieu-server', bang: 'bookings', chua: { id: 4, student: 'HE180010' }, truoc: DAT },
  { nhom: 'f2', an: true, moTa: 'Failed POST rejects the unwrapped promise ⇒ error on the page', url: '/rooms', fetchGia: { 'POST http://localhost:9999/bookings': { status: 500, text: 'boom' } }, kiem: 'text', selector: '#save-error', giaTri: 'Could not save the booking, please try again', truoc: DAT },
  { nhom: 'f3', moTa: 'Cancel via thunk (DELETE)', url: '/my-bookings', kiem: 'du-lieu-server', bang: 'bookings', khongChua: { id: 1 }, truoc: [cho(), ...LOGIN('An', 'HE180001'), cho(700), click('.my-booking .btn-cancel'), cho()] },
  { nhom: 'f3', moTa: 'Load error + retry still work', url: '/rooms', jsonServer: { base: B, db: {} }, kiem: 'goi-fetch', khop: '/bookings$', min: 2, max: 2, truoc: [cho(), click('#retry'), cho()] },
  { nhom: 'f4', moTa: 'Memoized stats selector', url: '/rooms', kiem: 'text', selector: '#stats', giaTri: 'Busiest room: Room A1 (2 bookings)', truoc: [cho()] },
  { nhom: 'f4', moTa: 'Stats follow new bookings', url: '/rooms', kiem: 'text', selector: '#stats', giaTri: 'Busiest room: Room A1 (3 bookings)', truoc: DAT },
  { nhom: 'f4', an: true, moTa: 'createSelector used', kiem: 'ma-nguon', tep: 'src/store/selectors.js', khop: 'createSelector\\(' },
  { nhom: 'f5', moTa: 'Student in Redux, persisted outside the reducer', url: '/rooms', kiem: 'text', selector: '#current-student', giaTri: 'Lan (HE180010)', truoc: [cho(), ...LOGIN('Lan', 'HE180010'), { hanhDong: 'tai-lai' }, cho()] },
  { nhom: 'f5', moTa: 'Facade hooks keep old components unchanged (useSelector inside useBookings)', kiem: 'ma-nguon', tep: 'src/context/BookingContext.js', khop: 'export\\s+function\\s+useBookings[\\s\\S]*useSelector\\(' },
  { nhom: 'f5', an: true, moTa: 'No localStorage writes in reducers', kiem: 'ma-nguon', tep: 'src/store/studentSlice.js', khop: 'localStorage\\.setItem', phuDinh: true },
];

const BAN_IN = banInMoc({
  moc: 12, chuong: 12, phut: 120,
  en: 'Migrating to Redux Toolkit', vi: 'Chuyển sang Redux Toolkit',
  moTa: {
    en: '<p>The final milestone moves the app state into a <b>Redux Toolkit</b> store — the way a growing team would. Bookings become a slice with three <code>createAsyncThunk</code> calls (fetch, create, cancel) on the milestone-11 API; the student becomes a slice persisted with <code>store.subscribe</code>. Instead of rewriting every component, keep <code>useBookings()</code> and <code>useStudent()</code> as <b>facade hooks</b> backed by <code>useSelector</code>/<code>useDispatch</code> — the pages from earlier milestones keep working untouched. Add a memoized "busiest room" statistic.</p>',
    vi: '<p>Mốc cuối chuyển state của app vào store <b>Redux Toolkit</b> — đúng cách một nhóm đang lớn sẽ làm. Lượt đặt thành slice với ba <code>createAsyncThunk</code> (tải, tạo, huỷ) trên API mốc 11; sinh viên thành slice được lưu bằng <code>store.subscribe</code>. Thay vì viết lại mọi component, giữ <code>useBookings()</code> và <code>useStudent()</code> làm <b>hook mặt tiền</b> chạy bằng <code>useSelector</code>/<code>useDispatch</code> — các trang của mốc trước vẫn chạy nguyên vẹn. Thêm thống kê "phòng đông nhất" bằng selector có ghi nhớ.</p>',
  },
  cay: `
src/
├── store/
│   ├── index.js           # configureStore + subscribe (persist student)
│   ├── bookingsSlice.js   # fetchBookings · createBooking · cancelBooking
│   ├── studentSlice.js    # loggedIn · loggedOut
│   └── selectors.js       # selectBusiestRoom
├── context/BookingContext.js · StudentContext.js   # facade hooks over Redux
├── App.js                 # + #stats
└── index.js               # <Provider store={store}> (given)`,
  chucNang: [
    { ten: { en: 'Store & thunks', vi: 'Store & thunk' }, diem: 3, yeuCau: [{ en: '<code>configureStore({ bookings, student })</code>; bookings slice with <code>status/error/items</code> and three thunks handled in <code>extraReducers</code>.', vi: '<code>configureStore({ bookings, student })</code>; slice bookings có <code>status/error/items</code> và ba thunk xử lý trong <code>extraReducers</code>.' }] },
    { ten: { en: 'Facade hooks', vi: 'Hook mặt tiền' }, diem: 2.5, yeuCau: [{ en: '<code>useBookings()</code> returns the same shape as before using <code>useSelector</code> and <code>dispatch(thunk).unwrap()</code> for add/cancel; <code>useStudent()</code> likewise. Old pages unchanged.', vi: '<code>useBookings()</code> trả cùng hình dạng như trước bằng <code>useSelector</code> và <code>dispatch(thunk).unwrap()</code> cho thêm/huỷ; <code>useStudent()</code> tương tự. Trang cũ giữ nguyên.' }] },
    { ten: { en: 'Behaviour kept', vi: 'Giữ nguyên hành vi' }, diem: 2, yeuCau: [{ en: 'Load, book (POST), cancel (DELETE), error + retry and save errors behave exactly as in milestone 11.', vi: 'Tải, đặt (POST), huỷ (DELETE), lỗi + thử lại và lỗi lưu chạy y như mốc 11.' }] },
    { ten: { en: 'Memoized statistics', vi: 'Thống kê ghi nhớ' }, diem: 1.5, yeuCau: [{ en: '<code>#stats</code> <code>Busiest room: Room A1 (2 bookings)</code> from <code>createSelector</code>.', vi: '<code>#stats</code> <code>Busiest room: Room A1 (2 bookings)</code> từ <code>createSelector</code>.' }], viDu: 'after Lan books Room A1 ⇒ "Busiest room: Room A1 (3 bookings)"' },
    { ten: { en: 'Persistence outside reducers', vi: 'Lưu bền ngoài reducer' }, diem: 1, yeuCau: [{ en: 'Student restored from <code>ctb-student</code> (lazy initial state) and saved in <code>store.subscribe</code>.', vi: 'Sinh viên khôi phục từ <code>ctb-student</code> (initialState lười) và lưu trong <code>store.subscribe</code>.' }] },
  ],
  idBatBuoc: [['#stats', { en: 'new in milestone 12 (all earlier ids kept)', vi: 'mới ở mốc 12 (giữ mọi id cũ)' }]],
  truDiem: [{ en: 'Rewriting every component at once and breaking working pages.', vi: 'Viết lại mọi component một lượt và làm hỏng trang đang chạy.' }, { en: 'Calling the API in components and dispatching plain "set" actions — no loading/error lifecycle.', vi: 'Gọi API trong component rồi dispatch action "set" thường — mất vòng đời đang tải/lỗi.' }],
  nopBai: NOP_BAI,
});

export default doiDau({
  slug: 'fer202-12-project-ctbooking-m12',
  ten: 'CT Booking · Milestone 12 — Migrating to Redux Toolkit',
  khoa: KHOA,
  baiHoc: 'fer202-12-2-thunk-middleware',
  de: [
    {
      dangBai: 'project',
      tieuDe: { en: 'CT Booking · Milestone 12 — Redux Toolkit store, thunks and facade hooks', vi: 'CT Booking · Mốc 12 — Store Redux Toolkit, thunk và hook mặt tiền' },
      doKho: 'HARD', phut: 120, diem: 100,
      khaiNiem: ['configureStore', 'createAsyncThunk', 'unwrap()', 'facade / strangler migration', 'createSelector', 'store.subscribe'],
      tienQuyet: ['CT Booking · Milestone 11'],
      the: ['fer202', 'project', 'ct-booking', 'redux'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'facade', vi: 'mặt tiền: giữ giao diện cũ, thay phần bên trong' }, { en: 'unwrap', vi: 'biến kết quả thunk thành Promise ném lỗi khi rejected' }, ...tn('rubric')],
      goiY: ['useBookings(): const { items, status, error } = useSelector(s => s.bookings); addBooking: (b) => dispatch(createBooking(b)).unwrap().', 'store.subscribe(() => { … localStorage.setItem("ctb-student", …) })'],
      loiHayGap: ['Quên .unwrap() ⇒ RoomPage không bắt được lỗi POST (dispatch luôn resolve).', 'Giữ cả BookingProvider cũ với useReducer song song store ⇒ hai nguồn sự thật.'],
      moTaNgan: 'Dự án CT Booking mốc 12: chuyển sang Redux Toolkit — slice + 3 thunk, hook mặt tiền giữ nguyên component cũ, selector ghi nhớ "phòng đông nhất", lưu sinh viên bằng subscribe. Thang 10.',
      giaiThich: '<p>Dự án thật hiếm khi viết lại từ đầu. Hook mặt tiền giữ nguyên hợp đồng mà các component đang dùng, chỉ thay phần lõi bằng Redux — chuyển đổi an toàn, từng bước. <code>unwrap()</code> giữ được ngữ nghĩa "Promise ném lỗi" mà RoomPage mốc 11 dựa vào.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap', 'prop-types', 'react-router-dom', 'axios', '@reduxjs/toolkit', 'react-redux'], url: '/rooms', jsonServer: { base: B, db: { bookings: BOOKINGS } }, kiem: KIEM },
      khoiDau: KHOI,
      loiGiai: GIAI,
      demo: { tepChinh: 'src/index.js', url: '/rooms' },
    },
  ],
});
