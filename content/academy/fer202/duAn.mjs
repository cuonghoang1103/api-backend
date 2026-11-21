/**
 * FER202 · DỰ ÁN XUYÊN SUỐT KHOÁ (thí điểm, soạn 21/11/2026).
 * Hợp đồng dữ liệu: docs/du-an-hop-dong.md (v1) · đặc tả trải nghiệm: docs/du-an-xuyen-suot-khoa.md.
 *
 * Xuất ra:
 *   duAn       — khối `duAn` cấp gốc của FER202.mjs (gioiThieu · deTai ≥5 · tuChon · moc · baoVe)
 *   mocBai     — { ch1: [bài mốc], …, ch12: […], a2: […] } — bài EXERCISE `mocDuAn: N`, slug = duAn.moc[i].slug,
 *                ghép vào cuối chương, TRƯỚC quiz chương. Nội dung bài sinh từ duAn.moc + bảng "đề tài của bạn ⇒ phần này"
 *                + khung giao diện/khung code mẫu (KHÔNG phải lời giải trọn).
 *   baoVeBai   — bài `fer202-bao-ve-du-an` (EXERCISE, baoVeDuAn: true) — hoàn thiện + phòng bảo vệ AI
 *   moiDangKy  — đoạn HTML song ngữ nối vào cuối bài 0.1 (bài đó mang cờ dangKyDuAn: true)
 *
 * Cách chấm bám đúng FER202 ở trường: Assignment 15% (app React nhỏ hoàn chỉnh, bảo vệ) + PE 20% (thi thực hành 85',
 * json-server + Router + form kiểm lỗi + CRUD, có vấn đáp/sửa code tại chỗ — xem mục "Đề PE Fall26", V9–V10).
 * Mốc viết CHUNG cho mọi đề tài ("danh sách sách/khoá học/lịch hẹn… của đề tài bạn").
 */
import { bi } from './_slides.mjs';

const KHOA = '/courses/front-end-web-development-with-react/learn?lessonSlug=';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (s, lang = 'javascript') => `<pre><code class="language-${lang}">${esc(String(s).trim())}</code></pre>`;
const L = (s) => s.split('|||');           // 'EN|||VI' → [en, vi]

/* ═══════════════════════════════ GIỚI THIỆU ═══════════════════════════════ */
const GIOI_THIEU_EN = `<h3>🎯 The course project — one real React app, built chapter by chapter</h3>
<p>From the very first lesson you pick <b>one project</b> (or propose your own) and grow it with exactly what each chapter teaches. When you reach the last lesson you do not start an assignment from zero — you <b>finish and defend</b> an app you already know line by line.</p>
<h4>When you finish this course you can build</h4>
<ul>
  <li>A <b>React single-page app</b> (Vite) with 4–8 pages, a shared layout and a responsive <b>React-Bootstrap</b> UI.</li>
  <li><b>React Router</b> navigation: list → detail page <code>/items/:id</code>, filters in the URL, protected pages, a 404 page.</li>
  <li>Full <b>CRUD against a REST API</b> (json-server, then any real backend) with axios/fetch, loading and error states.</li>
  <li><b>Forms with validation</b> (controlled inputs, one change handler, field messages), confirmed delete, bulk PATCH — exactly the PE question shapes.</li>
  <li>Shared state with <b>Context</b> and <b>Redux Toolkit</b> (slices, selectors, async thunks), plus custom hooks.</li>
  <li>Bonus: lazy-loaded pages, a few <b>tests</b> (Vitest + React Testing Library) and a deployed demo link for your CV.</li>
</ul>
<h4>Why one project instead of many small exercises?</h4>
<p>The labs train each skill in isolation; the project trains the thing the PE and the assignment actually grade — <b>putting the skills together</b> in one codebase you understand. Retakers in particular fail not on syntax but on wiring (where does this state live? why does the list not refresh after POST?). Thirteen milestones make you wire it thirteen times.</p>
<h4>How it is graded — like the real assignment + PE</h4>
<ul>
  <li><b>Milestones (after every chapter):</b> a short required list + optional extras + a “Pass when” checklist. You submit a repo/commit link and a screenshot and tick it done.</li>
  <li><b>Final defence:</b> a 10-point rubric (features 3 · correct React 2 · data &amp; API 1.5 · UI/UX 1 · code &amp; Git 1 · oral Q&amp;A + live change 1.5) and a panel-style oral exam about <em>your</em> code — “explain the data flow”, “why PATCH here?”, “add a field: where do you change it?” — just like the V10 Q&amp;A of the Fall26 PE.</li>
</ul>
<p>Pick from the suggested topics below (each has a chapter-by-chapter map), or propose your own — the AI reviewer checks that it covers the course and is the right size.</p>`;

const GIOI_THIEU_VI = `<h3>🎯 Dự án xuyên suốt khoá — một app React thật, xây dần từng chương</h3>
<p>Ngay từ bài đầu bạn chọn <b>một đề tài</b> (hoặc tự đề xuất) rồi nuôi lớn nó bằng đúng kiến thức của từng chương. Tới bài cuối bạn không bắt đầu assignment từ số 0 — bạn <b>hoàn thiện và bảo vệ</b> một app mà bạn đã hiểu tới từng dòng.</p>
<h4>Học xong khoá này bạn làm được</h4>
<ul>
  <li>Một <b>React SPA</b> (Vite) 4–8 trang, layout chung, giao diện <b>React-Bootstrap</b> co giãn theo màn hình.</li>
  <li>Điều hướng bằng <b>React Router</b>: danh sách → trang chi tiết <code>/items/:id</code>, bộ lọc nằm trên URL, trang cần đăng nhập, trang 404.</li>
  <li><b>CRUD trọn vẹn với REST API</b> (json-server, sau đó là backend thật bất kỳ) bằng axios/fetch, có trạng thái đang tải và lỗi.</li>
  <li><b>Form có kiểm lỗi</b> (input có kiểm soát, một hàm handleChange, thông báo theo từng ô), xoá có xác nhận, PATCH hàng loạt — đúng các dạng câu của đề PE.</li>
  <li>State dùng chung bằng <b>Context</b> và <b>Redux Toolkit</b> (slice, selector, async thunk), cùng custom hook.</li>
  <li>Thêm điểm: trang tải lười (lazy), vài <b>bài test</b> (Vitest + React Testing Library) và một link demo đã deploy để đưa vào CV.</li>
</ul>
<h4>Vì sao một dự án thay vì nhiều bài nhỏ?</h4>
<p>Lab luyện từng kỹ năng riêng lẻ; dự án luyện đúng thứ mà PE và assignment chấm — <b>ghép các kỹ năng lại</b> trong một codebase mình hiểu. Người thi lại thường không trượt vì cú pháp mà vì phần nối dây (state này nằm ở đâu? sao POST xong danh sách không cập nhật?). Mười ba mốc bắt bạn nối dây mười ba lần.</p>
<h4>Chấm thế nào — giống assignment + PE thật</h4>
<ul>
  <li><b>Mốc (sau mỗi chương):</b> vài yêu cầu bắt buộc + phần nâng cao tuỳ chọn + danh sách "Đạt khi". Bạn nộp link repo/commit và ảnh chụp, rồi đánh dấu xong.</li>
  <li><b>Bảo vệ cuối khoá:</b> rubric 10 điểm (chức năng 3 · dùng React đúng 2 · dữ liệu &amp; API 1,5 · giao diện 1 · code &amp; Git 1 · vấn đáp + sửa code tại chỗ 1,5) và một buổi hỏi đáp kiểu hội đồng về <em>chính code của bạn</em> — "giải thích luồng dữ liệu", "vì sao dùng PATCH ở đây?", "thêm một trường thì sửa ở đâu?" — y như phần V10 Hỏi–đáp của đề PE Fall26.</li>
</ul>
<p>Chọn một đề tài gợi ý bên dưới (đề nào cũng có bảng "chương nào làm phần nào"), hoặc tự đề xuất — AI sẽ xét đề tài có phủ đủ kiến thức khoá và vừa sức không.</p>`;

/* ═══════════════════════════════ ĐỀ TÀI ═══════════════════════════════ */
// banDoChuong: moc 1…13 → phần của ĐỀ TÀI NÀY mà mốc đó xây
const deTai = [
  {
    slug: 'web-ban-khoa-hoc',
    ten: 'Online course marketplace (like cuongthai.com Courses)|||Web bán khoá học trực tuyến (kiểu cuongthai.com Courses)',
    moTa: 'A catalogue of programming courses with categories, a course detail page with its lesson outline, a cart and a simple checkout, plus an admin area to manage courses. Students browse and enrol; the admin adds, edits and hides courses.|||Danh mục khoá học lập trình theo chủ đề, trang chi tiết khoá có đề cương bài học, giỏ hàng và thanh toán giả, cùng khu quản trị để quản lý khoá học. Học viên xem và đăng ký; admin thêm, sửa, ẩn khoá học.',
    doKho: 2,
    tinhNang: [
      'Course list with category filter, keyword search and sort by price/rating|||Danh sách khoá học: lọc theo chủ đề, tìm theo từ khoá, sắp theo giá/đánh giá',
      'Course detail /courses/:id with lesson outline (Accordion) and teacher|||Trang chi tiết /courses/:id có đề cương bài học (Accordion) và giảng viên',
      'Cart with quantity-free items, total, coupon code (Context → Redux)|||Giỏ hàng (mỗi khoá một suất), tổng tiền, mã giảm giá (Context → Redux)',
      'Fake checkout creating an order (POST /orders) and an order history page|||Thanh toán giả tạo đơn (POST /orders) và trang lịch sử đơn',
      'Fake login (users in db.json) and a "My courses" page|||Đăng nhập giả (users trong db.json) và trang "Khoá học của tôi"',
      'Admin: create/edit course form with validation, hide/show (PATCH), delete with confirm|||Admin: form thêm/sửa khoá học có kiểm lỗi, ẩn/hiện (PATCH), xoá có xác nhận',
      'Bulk action: publish several selected courses at once|||Thao tác hàng loạt: xuất bản nhiều khoá đã chọn một lần',
      'Wishlist saved in localStorage|||Danh sách yêu thích lưu ở localStorage',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Repo, Vite app, db.json with categories, courses, lessons, users|||Repo, app Vite, db.json có categories, courses, lessons, users' },
      { moc: 2, dung: 'formatPrice, filterByCategory, sortCourses, cart helpers|||formatPrice, lọc theo chủ đề, sắp khoá học, hàm giỏ hàng' },
      { moc: 3, dung: 'Static home: course cards from seed data, "NEW"/"FREE" badges|||Trang chủ tĩnh: thẻ khoá học từ dữ liệu mẫu, huy hiệu "NEW"/"FREE"' },
      { moc: 4, dung: 'Navbar, responsive course grid, footer|||Navbar, lưới khoá học co giãn, footer' },
      { moc: 5, dung: 'CourseCard/CourseList with props + PropTypes, add/remove in a local list|||CourseCard/CourseList có props + PropTypes, thêm/xoá trong danh sách cục bộ' },
      { moc: 6, dung: 'Search box, category select, sort buttons, course form|||Ô tìm kiếm, chọn chủ đề, nút sắp xếp, form khoá học' },
      { moc: 7, dung: 'CartContext + useCart; header badge shows cart count|||CartContext + useCart; huy hiệu header hiện số món' },
      { moc: 8, dung: 'useReducer cart, wishlist in localStorage (useEffect), useDebounce search|||Giỏ hàng useReducer, yêu thích lưu localStorage (useEffect), tìm kiếm useDebounce' },
      { moc: 9, dung: '/courses, /courses/:id, /cart, /orders, /admin, 404|||/courses, /courses/:id, /cart, /orders, /admin, 404' },
      { moc: 10, dung: 'Lazy-load the admin area and the order history|||Tải lười khu admin và lịch sử đơn' },
      { moc: 11, dung: 'Courses CRUD on json-server, checkout POST /orders, bulk publish (PATCH)|||CRUD khoá học trên json-server, thanh toán POST /orders, xuất bản hàng loạt (PATCH)' },
      { moc: 12, dung: 'cartSlice + coursesSlice (createAsyncThunk), selectors for totals|||cartSlice + coursesSlice (createAsyncThunk), selector tính tổng' },
      { moc: 13, dung: 'Tests for cart totals and the course form, deploy demo|||Test tổng giỏ hàng và form khoá học, deploy demo' },
    ],
    thamKhaoThat: ['cuongthai.com — Courses section|||cuongthai.com — mục Courses', 'Udemy|||Udemy', 'Coursera|||Coursera', 'F8 (fullstack.edu.vn)|||F8 (fullstack.edu.vn)'],
    anh: null,
  },
  {
    slug: 'quan-ly-thu-vien',
    ten: 'Library management|||Quản lý thư viện',
    moTa: 'Librarians manage books, categories and members; members search the catalogue and borrow or return books. The app tracks due dates and shows overdue loans.|||Thủ thư quản lý sách, thể loại và bạn đọc; bạn đọc tra cứu danh mục, mượn và trả sách. App theo dõi hạn trả và báo các lượt mượn quá hạn.',
    doKho: 2,
    tinhNang: [
      'Book catalogue: search by title/author, filter by category and availability|||Danh mục sách: tìm theo tên/tác giả, lọc theo thể loại và còn/hết',
      'Book detail /books/:id with copies available and borrowing history|||Chi tiết /books/:id: số bản còn và lịch sử mượn',
      'Borrow / return (POST /loans, PATCH returned) with due date = today + 14 days|||Mượn / trả (POST /loans, PATCH đã trả) với hạn trả = hôm nay + 14 ngày',
      'Overdue list with dates formatted dd/MM/yyyy and a red badge|||Danh sách quá hạn, ngày định dạng dd/MM/yyyy, huy hiệu đỏ',
      'Members CRUD with a validated form (email, phone, student ID pattern)|||CRUD bạn đọc với form kiểm lỗi (email, số điện thoại, mẫu mã sinh viên)',
      'Librarian vs member role (fake login) — members cannot edit books|||Vai thủ thư và bạn đọc (đăng nhập giả) — bạn đọc không sửa được sách',
      'Statistics: most borrowed books, loans per month (simple table)|||Thống kê: sách mượn nhiều nhất, lượt mượn theo tháng (bảng đơn giản)',
    ],
    banDoChuong: [
      { moc: 1, dung: 'db.json with books, categories, members, loans|||db.json có books, categories, members, loans' },
      { moc: 2, dung: 'dueDate(today, 14), isOverdue, formatDate dd/MM/yyyy|||dueDate(hôm nay, 14), isOverdue, formatDate dd/MM/yyyy' },
      { moc: 3, dung: 'Book table with "Available"/"Out" badges|||Bảng sách có huy hiệu "Available"/"Out"' },
      { moc: 4, dung: 'Navbar, book cards grid, member table|||Navbar, lưới thẻ sách, bảng bạn đọc' },
      { moc: 5, dung: 'BookRow/BookTable components, add/remove a book locally|||Component BookRow/BookTable, thêm/xoá sách cục bộ' },
      { moc: 6, dung: 'Search + category filter, member form|||Tìm kiếm + lọc thể loại, form bạn đọc' },
      { moc: 7, dung: 'AuthContext (current user + role)|||AuthContext (người dùng hiện tại + vai)' },
      { moc: 8, dung: 'useReducer for the borrow cart, useEffect to load overdue count|||useReducer cho giỏ mượn, useEffect đếm số quá hạn' },
      { moc: 9, dung: '/books, /books/:id, /members, /loans, /login, 404|||/books, /books/:id, /members, /loans, /login, 404' },
      { moc: 10, dung: 'Lazy statistics page|||Trang thống kê tải lười' },
      { moc: 11, dung: 'Loans: POST + PATCH returned; members CRUD with validation|||Lượt mượn: POST + PATCH đã trả; CRUD bạn đọc có kiểm lỗi' },
      { moc: 12, dung: 'loansSlice with createAsyncThunk, selectOverdue|||loansSlice dùng createAsyncThunk, selectOverdue' },
      { moc: 13, dung: 'Unit tests for dueDate/isOverdue, RTL test for the member form|||Unit test dueDate/isOverdue, RTL test form bạn đọc' },
    ],
    thamKhaoThat: ['Koha (open-source library system)|||Koha (hệ thống thư viện mã nguồn mở)', 'Goodreads|||Goodreads', 'The FPT University library portal|||Cổng thư viện Đại học FPT'],
    anh: null,
  },
  {
    slug: 'dat-lich-phong-kham',
    ten: 'Clinic appointment booking|||Đặt lịch khám phòng khám',
    moTa: 'Patients choose a specialty, a doctor and a free time slot, then book an appointment; reception confirms, reschedules or cancels. A doctor sees today’s schedule. The tricky part is slot logic: no double booking, no past slots.|||Bệnh nhân chọn chuyên khoa, bác sĩ và khung giờ còn trống rồi đặt lịch; lễ tân xác nhận, dời hoặc huỷ. Bác sĩ xem lịch khám hôm nay. Phần khó là logic khung giờ: không đặt trùng, không đặt giờ đã qua.',
    doKho: 3,
    tinhNang: [
      'Specialty → doctor → date → free slot wizard (multi-step form)|||Chọn chuyên khoa → bác sĩ → ngày → khung giờ trống (form nhiều bước)',
      'Free slots computed from working hours minus booked appointments|||Khung giờ trống = giờ làm việc trừ các lịch đã đặt',
      'Validation: phone, date not in the past, symptom note ≥ 10 characters|||Kiểm lỗi: số điện thoại, ngày không ở quá khứ, mô tả triệu chứng ≥ 10 ký tự',
      'Appointment status: PENDING → CONFIRMED / CANCELLED (PATCH)|||Trạng thái lịch hẹn: PENDING → CONFIRMED / CANCELLED (PATCH)',
      'Doctor detail /doctors/:id with rating and schedule|||Chi tiết bác sĩ /doctors/:id có đánh giá và lịch làm việc',
      'Reception dashboard: filter by date/status, bulk confirm|||Bảng lễ tân: lọc theo ngày/trạng thái, xác nhận hàng loạt',
      'Patient "My appointments" with cancel (confirm dialog)|||"Lịch hẹn của tôi" của bệnh nhân, huỷ có hộp xác nhận',
      'Reschedule = choose a new free slot (PATCH date/time)|||Dời lịch = chọn khung giờ trống mới (PATCH ngày/giờ)',
    ],
    banDoChuong: [
      { moc: 1, dung: 'db.json with specialties, doctors, appointments, patients|||db.json có specialties, doctors, appointments, patients' },
      { moc: 2, dung: 'freeSlots(workingHours, booked), isPast, formatTime|||freeSlots(giờ làm, đã đặt), isPast, formatTime' },
      { moc: 3, dung: 'Doctor cards, status badges with conditional colours|||Thẻ bác sĩ, huy hiệu trạng thái đổi màu theo điều kiện' },
      { moc: 4, dung: 'Navbar, doctor grid, booking form layout|||Navbar, lưới bác sĩ, bố cục form đặt lịch' },
      { moc: 5, dung: 'DoctorCard/SlotPicker components, choose a slot in state|||Component DoctorCard/SlotPicker, chọn khung giờ lưu trong state' },
      { moc: 6, dung: 'Multi-step booking form with Next/Back and per-step validation|||Form đặt lịch nhiều bước có Tiếp/Quay lại và kiểm lỗi từng bước' },
      { moc: 7, dung: 'BookingContext shared by the wizard steps|||BookingContext dùng chung cho các bước' },
      { moc: 8, dung: 'useReducer for the wizard, useEffect to reload free slots when the date changes|||useReducer cho các bước, useEffect tải lại giờ trống khi đổi ngày' },
      { moc: 9, dung: '/doctors, /doctors/:id, /book, /my-appointments, /reception|||/doctors, /doctors/:id, /book, /my-appointments, /reception' },
      { moc: 10, dung: 'Lazy reception dashboard|||Bảng lễ tân tải lười' },
      { moc: 11, dung: 'POST appointment, PATCH status, bulk confirm, double-booking check on the server data|||POST lịch hẹn, PATCH trạng thái, xác nhận hàng loạt, kiểm đặt trùng trên dữ liệu server' },
      { moc: 12, dung: 'appointmentsSlice + selectors by status/date|||appointmentsSlice + selector theo trạng thái/ngày' },
      { moc: 13, dung: 'Unit tests for freeSlots (edge: lunch break, past slots)|||Unit test freeSlots (biên: nghỉ trưa, giờ đã qua)' },
    ],
    thamKhaoThat: ['Medlatec / Vinmec online booking|||Đặt lịch online của Medlatec / Vinmec', 'BookingCare (Vietnam)|||BookingCare', 'Zocdoc|||Zocdoc'],
    anh: null,
  },
  {
    slug: 'shop-sneaker',
    ten: 'Sneaker shop|||Shop giày sneaker',
    moTa: 'An online sneaker store with brands, sizes and stock, a cart and orders, and an admin to manage products and mark "hot" items. Close to the SU26 PE "Sneaker Collection", so it doubles as PE practice.|||Cửa hàng sneaker trực tuyến có thương hiệu, size và tồn kho, giỏ hàng và đơn hàng, cùng trang admin quản lý sản phẩm và đánh dấu hàng "hot". Gần đề PE SU26 "Sneaker Collection" nên vừa làm dự án vừa luyện PE.',
    doKho: 2,
    tinhNang: [
      'Product grid with brand/category filter, price range and "hot" toggle|||Lưới sản phẩm: lọc thương hiệu/loại, khoảng giá và công tắc "hot"',
      'Product detail /sneakers/:id with size picker (out-of-stock sizes disabled)|||Chi tiết /sneakers/:id có chọn size (size hết hàng bị khoá)',
      'Cart with size + quantity, stock limit, total|||Giỏ hàng theo size + số lượng, chặn vượt tồn kho, tổng tiền',
      'Admin product form: name ≥ 2 chars, brand ≥ 2 words, price integer ≤ 3 digits, valid image URL (PE-style rules)|||Form sản phẩm admin: tên ≥ 2 ký tự, thương hiệu ≥ 2 từ, giá nguyên ≤ 3 chữ số, URL ảnh hợp lệ (luật kiểu PE)',
      'Mark several products as hot at once (bulk PATCH)|||Đánh dấu "hot" nhiều sản phẩm một lần (PATCH hàng loạt)',
      'Order history with dates dd/MM/yyyy and status|||Lịch sử đơn, ngày dd/MM/yyyy và trạng thái',
      'Sort by price/newest; pagination or "Load more"|||Sắp theo giá/mới nhất; phân trang hoặc "Xem thêm"',
    ],
    banDoChuong: [
      { moc: 1, dung: 'db.json with brands, sneakers (sizes + stock), orders|||db.json có brands, sneakers (size + tồn kho), orders' },
      { moc: 2, dung: 'inStockSizes, priceRange filter, cart add/merge helpers|||inStockSizes, lọc khoảng giá, hàm thêm/gộp giỏ hàng' },
      { moc: 3, dung: 'Product cards with "HOT"/"SOLD OUT" badges|||Thẻ sản phẩm có huy hiệu "HOT"/"SOLD OUT"' },
      { moc: 4, dung: 'Navbar with cart icon, responsive grid, filter sidebar|||Navbar có biểu tượng giỏ, lưới co giãn, cột lọc' },
      { moc: 5, dung: 'SneakerCard/SizePicker with props + PropTypes|||SneakerCard/SizePicker có props + PropTypes' },
      { moc: 6, dung: 'Filter controls, admin product form (controlled)|||Bộ lọc, form sản phẩm admin (có kiểm soát)' },
      { moc: 7, dung: 'CartContext|||CartContext' },
      { moc: 8, dung: 'useReducer cart, persist cart (useEffect + localStorage)|||Giỏ hàng useReducer, lưu giỏ (useEffect + localStorage)' },
      { moc: 9, dung: '/sneakers, /sneakers/:id, /cart, /orders, /admin, filters in ?query|||/sneakers, /sneakers/:id, /cart, /orders, /admin, bộ lọc trong ?query' },
      { moc: 10, dung: 'Lazy admin area|||Khu admin tải lười' },
      { moc: 11, dung: 'Products CRUD, bulk "hot" PATCH, POST /orders|||CRUD sản phẩm, PATCH "hot" hàng loạt, POST /orders' },
      { moc: 12, dung: 'cartSlice + productsSlice|||cartSlice + productsSlice' },
      { moc: 13, dung: 'Tests for the PE-style validation rules|||Test các luật kiểm lỗi kiểu PE' },
    ],
    thamKhaoThat: ['Nike / Adidas web stores|||Web Nike / Adidas', 'StockX|||StockX', 'Shopee / Tiki product pages|||Trang sản phẩm Shopee / Tiki'],
    anh: null,
  },
  {
    slug: 'giang-vien-mon-hoc',
    ten: 'Lecturer workload & subject curriculum (like the Fall26 PE)|||Quản lý giảng viên – môn học (giống đề PE Fall26)',
    moTa: 'A department tool: lecturers, subjects and teaching assignments. Show each lecturer’s workload (total slots) with filters, a subject curriculum by semester, and assign/unassign subjects in bulk. The closest topic to the real Fall26 PE — the best choice if your retake is soon.|||Công cụ cho bộ môn: giảng viên, môn học và phân công giảng dạy. Hiện khối lượng giảng của từng giảng viên (tổng số slot) kèm bộ lọc, khung chương trình theo kỳ, và gán/bỏ gán môn hàng loạt. Đề tài sát đề PE Fall26 thật nhất — chọn đề này nếu sắp thi lại.',
    doKho: 1,
    tinhNang: [
      'Lecturer list with total workload = sum of assigned subjects’ slots (reduce)|||Danh sách giảng viên với tổng khối lượng = tổng slot các môn được gán (reduce)',
      'Filter by department and by "overloaded" (> limit) via useSearchParams|||Lọc theo bộ môn và "quá tải" (> giới hạn) bằng useSearchParams',
      'Lecturer detail /lecturers/:id with an Accordion of assigned subjects|||Chi tiết /lecturers/:id với Accordion các môn được gán',
      'Subject curriculum grouped by semester, with prerequisites|||Khung chương trình gom theo kỳ, có môn tiên quyết',
      'Assign several selected subjects to a lecturer at once (bulk PATCH, for…of + await)|||Gán nhiều môn đã chọn cho một giảng viên một lần (PATCH hàng loạt, for…of + await)',
      'Lecturer form with validation (email @fpt.edu.vn, slots 1–30)|||Form giảng viên có kiểm lỗi (email @fpt.edu.vn, số slot 1–30)',
      'Delete an assignment with confirm; success alert after saving|||Xoá phân công có xác nhận; thông báo thành công sau khi lưu',
    ],
    banDoChuong: [
      { moc: 1, dung: 'db.json with departments, lecturers, subjects, assignments (ids as foreign keys)|||db.json có departments, lecturers, subjects, assignments (id làm khoá ngoại)' },
      { moc: 2, dung: 'workloadOf(lecturerId), groupBySemester, isOverloaded|||workloadOf(lecturerId), groupBySemester, isOverloaded' },
      { moc: 3, dung: 'Lecturer table with "Overloaded" badge|||Bảng giảng viên có huy hiệu "Overloaded"' },
      { moc: 4, dung: 'Navbar, Table + Card layout, filter row|||Navbar, bố cục Table + Card, hàng bộ lọc' },
      { moc: 5, dung: 'LecturerRow/SubjectList components with PropTypes|||Component LecturerRow/SubjectList có PropTypes' },
      { moc: 6, dung: 'Department select, checkbox selection of subjects|||Chọn bộ môn, tick chọn nhiều môn' },
      { moc: 7, dung: 'DataContext holding lecturers/subjects for all pages|||DataContext giữ lecturers/subjects cho mọi trang' },
      { moc: 8, dung: 'useEffect loads data, useReducer for the selection set|||useEffect tải dữ liệu, useReducer cho tập đang chọn' },
      { moc: 9, dung: '/lecturers, /lecturers/:id, /subjects, ?department=SE|||/lecturers, /lecturers/:id, /subjects, ?department=SE' },
      { moc: 10, dung: 'Lazy curriculum page|||Trang khung chương trình tải lười' },
      { moc: 11, dung: 'Exactly the PE: axios + json-server port 9999, bulk PATCH, validated form|||Đúng dạng PE: axios + json-server cổng 9999, PATCH hàng loạt, form kiểm lỗi' },
      { moc: 12, dung: 'lecturersSlice with selectWorkload selector|||lecturersSlice với selector selectWorkload' },
      { moc: 13, dung: 'Tests for workloadOf and the lecturer form|||Test workloadOf và form giảng viên' },
    ],
    thamKhaoThat: ['FPT University FAP / FLM (schedule & curriculum)|||FAP / FLM của Đại học FPT (lịch và khung chương trình)', 'University timetable systems (e.g. UniTime)|||Hệ thống xếp lịch đại học (vd UniTime)'],
    anh: null,
  },
  {
    slug: 'quan-ly-cong-viec-nhom',
    ten: 'Team task board (Kanban, like Trello / CT Work)|||Quản lý công việc nhóm (bảng Kanban, kiểu Trello / CT Work)',
    moTa: 'Project boards with columns To do / In progress / Review / Done, task cards with assignee, priority and due date, comments and a "my tasks" view. Good for students who want a portfolio app similar to tools used at work.|||Bảng dự án với các cột To do / In progress / Review / Done, thẻ công việc có người làm, độ ưu tiên và hạn, bình luận và chế độ xem "việc của tôi". Hợp với bạn muốn một app portfolio giống công cụ dùng khi đi làm.',
    doKho: 3,
    tinhNang: [
      'Boards list and board page with 4 status columns|||Danh sách bảng và trang bảng có 4 cột trạng thái',
      'Task card: title, assignee avatar, priority colour, due date (overdue in red)|||Thẻ việc: tiêu đề, ảnh người làm, màu độ ưu tiên, hạn (quá hạn tô đỏ)',
      'Move a task between columns (buttons or drag & drop) = PATCH status|||Chuyển việc giữa các cột (nút hoặc kéo thả) = PATCH status',
      'Task detail /boards/:boardId/tasks/:taskId with comments|||Chi tiết /boards/:boardId/tasks/:taskId có bình luận',
      'Create/edit task form with validation; delete with confirm|||Form tạo/sửa việc có kiểm lỗi; xoá có xác nhận',
      'Filters: assignee, priority, "only overdue" (in the URL)|||Bộ lọc: người làm, độ ưu tiên, "chỉ quá hạn" (nằm trên URL)',
      '"My tasks" across boards for the logged-in member|||"Việc của tôi" trên mọi bảng cho thành viên đang đăng nhập',
      'Bulk: move all Review tasks to Done|||Hàng loạt: chuyển mọi việc ở Review sang Done',
    ],
    banDoChuong: [
      { moc: 1, dung: 'db.json with boards, tasks, members, comments|||db.json có boards, tasks, members, comments' },
      { moc: 2, dung: 'groupByStatus, isOverdue, sortByPriority|||groupByStatus, isOverdue, sortByPriority' },
      { moc: 3, dung: 'Static board: 4 columns rendered from data, empty-column text|||Bảng tĩnh: 4 cột vẽ từ dữ liệu, chữ báo cột rỗng' },
      { moc: 4, dung: 'Responsive columns (stack on mobile), task Card|||Cột co giãn (xếp dọc trên điện thoại), Card công việc' },
      { moc: 5, dung: 'Column/TaskCard components, move a task in local state|||Component Column/TaskCard, chuyển việc trong state cục bộ' },
      { moc: 6, dung: 'Task form, filter bar, move buttons with parameters|||Form công việc, thanh lọc, nút chuyển có tham số' },
      { moc: 7, dung: 'AuthContext (current member) + BoardContext|||AuthContext (thành viên hiện tại) + BoardContext' },
      { moc: 8, dung: 'useReducer for board state (MOVE/ADD/REMOVE actions)|||useReducer cho bảng (action MOVE/ADD/REMOVE)' },
      { moc: 9, dung: 'Nested routes /boards/:boardId/tasks/:taskId with Outlet|||Route lồng /boards/:boardId/tasks/:taskId với Outlet' },
      { moc: 10, dung: 'Lazy task detail panel|||Bảng chi tiết công việc tải lười' },
      { moc: 11, dung: 'Tasks CRUD, PATCH status, comments POST, bulk Review→Done|||CRUD công việc, PATCH status, POST bình luận, Review→Done hàng loạt' },
      { moc: 12, dung: 'tasksSlice with thunks + selectByStatus|||tasksSlice có thunk + selectByStatus' },
      { moc: 13, dung: 'Reducer unit tests, RTL test moving a card|||Unit test reducer, RTL test chuyển thẻ' },
    ],
    thamKhaoThat: ['Trello|||Trello', 'Jira|||Jira', 'CT Work on cuongthai.com|||CT Work trên cuongthai.com', 'GitHub Projects|||GitHub Projects'],
    anh: null,
  },
  {
    slug: 'diem-danh-lop-hoc',
    ten: 'Class attendance system (like the SP26 PE)|||Hệ thống điểm danh lớp học (giống đề PE SP26)',
    moTa: 'Teachers open a class session and mark each student present, late or absent; students see their attendance rate and get a warning above 20% absence. Small and very PE-like — a safe choice for a retake.|||Giảng viên mở buổi học và điểm danh từng sinh viên có mặt, đi muộn hoặc vắng; sinh viên xem tỉ lệ chuyên cần và bị cảnh báo khi vắng quá 20%. Gọn và rất giống PE — lựa chọn an toàn khi thi lại.',
    doKho: 1,
    tinhNang: [
      'Classes and sessions list; session detail /sessions/:id|||Danh sách lớp và buổi học; chi tiết buổi /sessions/:id',
      'Mark all students in one form (radio Present/Late/Absent) and save with bulk PATCH|||Điểm danh cả lớp trong một form (radio Có mặt/Muộn/Vắng) và lưu bằng PATCH hàng loạt',
      'Attendance rate per student (reduce) with a red badge above 20% absence|||Tỉ lệ chuyên cần mỗi sinh viên (reduce), huy hiệu đỏ khi vắng quá 20%',
      'Filter students by class and by "at risk"|||Lọc sinh viên theo lớp và theo "có nguy cơ cấm thi"',
      'Student form with validation (student ID pattern SE123456, email)|||Form sinh viên có kiểm lỗi (mẫu mã SE123456, email)',
      'Teacher vs student view (fake login)|||Giao diện giảng viên và sinh viên (đăng nhập giả)',
    ],
    banDoChuong: [
      { moc: 1, dung: 'db.json with classes, students, sessions, attendances|||db.json có classes, students, sessions, attendances' },
      { moc: 2, dung: 'absenceRate(studentId), isAtRisk, formatDate|||absenceRate(studentId), isAtRisk, formatDate' },
      { moc: 3, dung: 'Student table with conditional badges|||Bảng sinh viên có huy hiệu theo điều kiện' },
      { moc: 4, dung: 'Navbar, class cards, attendance table layout|||Navbar, thẻ lớp, bố cục bảng điểm danh' },
      { moc: 5, dung: 'StudentRow with props; change one status in state|||StudentRow có props; đổi trạng thái một em trong state' },
      { moc: 6, dung: 'Radio groups for the whole class, "mark all present" button|||Nhóm radio cho cả lớp, nút "tất cả có mặt"' },
      { moc: 7, dung: 'AuthContext (teacher/student)|||AuthContext (giảng viên/sinh viên)' },
      { moc: 8, dung: 'useReducer for the attendance sheet, useEffect loads a session|||useReducer cho bảng điểm danh, useEffect tải buổi học' },
      { moc: 9, dung: '/classes, /sessions/:id, /students/:id, ?class=SE1801|||/classes, /sessions/:id, /students/:id, ?class=SE1801' },
      { moc: 10, dung: 'Lazy report page|||Trang báo cáo tải lười' },
      { moc: 11, dung: 'Bulk PATCH attendances, student CRUD with validation|||PATCH điểm danh hàng loạt, CRUD sinh viên có kiểm lỗi' },
      { moc: 12, dung: 'attendanceSlice + selectAtRisk|||attendanceSlice + selectAtRisk' },
      { moc: 13, dung: 'Tests for absenceRate (0 sessions, exactly 20%)|||Test absenceRate (0 buổi, đúng 20%)' },
    ],
    thamKhaoThat: ['FPT University FAP attendance|||Điểm danh trên FAP Đại học FPT', 'Google Classroom|||Google Classroom', 'MS Teams attendance reports|||Báo cáo điểm danh MS Teams'],
    anh: null,
  },
];

/* ═══════════════════════════════ ĐỀ TÀI TỰ CHỌN ═══════════════════════════════ */
const tuChon = {
  yeuCauToiThieu: [
    'At least 4 pages with React Router, including a list page and a detail page /resource/:id|||Ít nhất 4 trang dùng React Router, trong đó có trang danh sách và trang chi tiết /resource/:id',
    'At least 2 related resources in db.json linked by an id (e.g. books.categoryId → categories.id)|||Ít nhất 2 tài nguyên trong db.json nối với nhau bằng id (vd books.categoryId → categories.id)',
    'Full CRUD on at least one resource through a REST API (json-server is enough) with loading and error states|||CRUD trọn vẹn cho ít nhất một tài nguyên qua REST API (json-server là đủ), có trạng thái đang tải và lỗi',
    'At least one form with ≥ 4 fields and real validation rules shown next to each field|||Ít nhất một form có ≥ 4 ô và luật kiểm lỗi thật, báo lỗi cạnh từng ô',
    'Search + filter + sort on a list; at least one filter kept in the URL query|||Tìm kiếm + lọc + sắp xếp trên một danh sách; ít nhất một bộ lọc nằm trên query của URL',
    'State shared across pages with Context or Redux Toolkit (cart, current user, selection…)|||State dùng chung giữa các trang bằng Context hoặc Redux Toolkit (giỏ hàng, người đăng nhập, mục đang chọn…)',
    'A destructive action with confirmation and one bulk update (several PATCH requests)|||Một thao tác phá huỷ có xác nhận và một cập nhật hàng loạt (nhiều request PATCH)',
    'Front-end only: no backend code required beyond json-server; no real payments or real personal data|||Chỉ front-end: không cần viết backend ngoài json-server; không thanh toán thật, không dữ liệu cá nhân thật',
  ],
  goiYQuyMo: 'Right size = one person, about 6–8 weeks part-time, 4–8 pages, 3–5 resources, 6–12 features. Too small: a single list or a to-do app (does not exercise Router + API + shared state together). Too big: real-time chat, payments, maps, AI features, a full social network — keep those as optional extras after Milestone 13. If it looks like a copy of a YouTube tutorial, change the domain and the rules so the logic is your own.|||Vừa sức = một người, khoảng 6–8 tuần làm song song việc học, 4–8 trang, 3–5 tài nguyên, 6–12 tính năng. Quá nhỏ: chỉ một danh sách hay app to-do (không luyện được Router + API + state dùng chung cùng lúc). Quá to: chat thời gian thực, thanh toán, bản đồ, tính năng AI, cả một mạng xã hội — để chúng làm phần thêm sau Mốc 13. Nếu trông giống bản sao một video hướng dẫn trên YouTube, hãy đổi lĩnh vực và luật nghiệp vụ để phần logic là của chính bạn.',
};

/* ═══════════════════════════════ MỐC ═══════════════════════════════ */
const NOP = ['repo', 'anh'];
const moc = [
  {
    so: 1, slug: 'fer202-moc-1', sauChuong: 'Chapter 1 — Overview & Setup|||Chương 1 — Tổng quan & cài đặt',
    ten: 'Project skeleton: repo, Vite app, json-server data|||Khung dự án: repo, app Vite, dữ liệu json-server',
    yeuCau: [
      'Create a Vite React app named after your topic and push it to a new GitHub repository (public or shared with your mentor).|||Tạo app React bằng Vite đặt tên theo đề tài và đẩy lên một repo GitHub mới (công khai hoặc chia sẻ cho người kèm).',
      'Write README.md: topic, target users, 6–12 features as a checklist, how to run (npm install, npm run dev, json-server command).|||Viết README.md: đề tài, người dùng, 6–12 tính năng dạng checklist, cách chạy (npm install, npm run dev, lệnh json-server).',
      'Create db.json for YOUR topic: ≥ 2 related resources (one has an id field pointing to the other), ≥ 8 realistic records in the main one.|||Tạo db.json cho ĐỀ TÀI CỦA BẠN: ≥ 2 tài nguyên có quan hệ (một bên có trường id trỏ sang bên kia), tài nguyên chính ≥ 8 bản ghi giống thật.',
      'Install json-server 0.17 as a dev dependency and add an npm script "server" that serves db.json on port 9999.|||Cài json-server 0.17 làm dev dependency và thêm npm script "server" phục vụ db.json ở cổng 9999.',
      'Create the folders src/components, src/pages, src/services, src/utils (empty files with a comment are fine).|||Tạo các thư mục src/components, src/pages, src/services, src/utils (tệp rỗng có một dòng chú thích là được).',
    ],
    nangCao: [
      'Add .gitignore check: node_modules and .env are not committed.|||Kiểm .gitignore: node_modules và .env không bị commit.',
      'Draw a 1-page sketch of your main screens (paper photo or Figma) and put it in /docs.|||Vẽ phác 1 trang các màn hình chính (ảnh chụp giấy hoặc Figma) và để trong /docs.',
    ],
    datKhi: [
      'npm run dev opens the default page on http://localhost:5173 and npm run server answers http://localhost:9999/<resource> with your JSON.|||npm run dev mở trang mặc định ở http://localhost:5173 và npm run server trả JSON của bạn ở http://localhost:9999/<resource>.',
      'GET /<child>?<parentId>=1 (e.g. /books?categoryId=1) returns only the matching records.|||GET /<con>?<idCha>=1 (vd /books?categoryId=1) chỉ trả các bản ghi khớp.',
      'The repo has ≥ 2 commits with meaningful messages and no node_modules folder.|||Repo có ≥ 2 commit với thông điệp có nghĩa và không có thư mục node_modules.',
    ],
    goiY: [
      'Tier 1: npm create vite@latest <name> -- --template react, then git init, git add ., git commit -m "init".|||Tầng 1: npm create vite@latest <tên> -- --template react, rồi git init, git add ., git commit -m "init".',
      'Tier 2: in package.json "scripts": { "server": "json-server --watch db.json --port 9999" }.|||Tầng 2: trong package.json "scripts": { "server": "json-server --watch db.json --port 9999" }.',
      'Tier 3: model data like the PE files: every record has an "id"; relations are plain ids, not nested objects.|||Tầng 3: thiết kế dữ liệu giống tệp đề PE: mọi bản ghi có "id"; quan hệ là id trơn, không lồng object.',
    ],
    nop: NOP,
  },
  {
    so: 2, slug: 'fer202-moc-2', sauChuong: 'Chapter 2 — ES6 for React|||Chương 2 — ES6 cho React',
    ten: 'Data layer in plain ES6: seed data + pure helper functions|||Lớp dữ liệu bằng ES6 thuần: dữ liệu mẫu + hàm thuần',
    yeuCau: [
      'Export a copy of your main records from src/data/seed.js (ES module, named exports).|||Export một bản dữ liệu chính từ src/data/seed.js (ES module, named export).',
      'In src/utils/ write ≥ 6 pure helpers your app will need: format (price/date), filter, sort (with a comparator, on a copy), add/update/remove an item immutably, and one domain rule (e.g. isOverdue, workloadOf, freeSlots).|||Trong src/utils/ viết ≥ 6 hàm thuần app sẽ cần: định dạng (giá/ngày), lọc, sắp xếp (có comparator, trên bản sao), thêm/sửa/xoá phần tử không biến đổi mảng, và một luật nghiệp vụ (vd isOverdue, workloadOf, freeSlots).',
      'Use destructuring, spread, arrow functions, template literals and default parameters; no var.|||Dùng destructuring, spread, arrow function, template literal và tham số mặc định; không var.',
      'Write src/utils/check.mjs that imports the helpers and prints PASS/FAIL for each (like Lab 2.1).|||Viết src/utils/check.mjs import các hàm rồi in PASS/FAIL cho từng hàm (như Lab 2.1).',
    ],
    nangCao: [
      'An async helper that simulates loading with a Promise + setTimeout and a fallback on error (like Lab 2.2).|||Một hàm async giả lập việc tải bằng Promise + setTimeout và có giá trị dự phòng khi lỗi (như Lab 2.2).',
    ],
    datKhi: [
      'node src/utils/check.mjs prints only PASS lines.|||node src/utils/check.mjs chỉ in dòng PASS.',
      'A check proves the original seed array is unchanged after add/update/remove/sort.|||Có phép kiểm chứng minh mảng dữ liệu gốc không đổi sau thêm/sửa/xoá/sắp xếp.',
      'Your domain rule handles an edge case (empty list, 0, a boundary date) and the check covers it.|||Luật nghiệp vụ xử lý được một trường hợp biên (mảng rỗng, số 0, ngày ở biên) và có phép kiểm cho nó.',
    ],
    goiY: [
      'Tier 1: start from the Lab 2.1 function list and rename for your domain (courses → books/appointments/tasks).|||Tầng 1: bắt đầu từ danh sách hàm của Lab 2.1 rồi đổi tên theo lĩnh vực (courses → books/appointments/tasks).',
      'Tier 2: sort must not mutate: [...list].sort((a, b) => a.price - b.price).|||Tầng 2: sắp xếp không được biến đổi mảng: [...list].sort((a, b) => a.price - b.price).',
      'Tier 3: dates — compare "YYYY-MM-DD" strings or Date objects, never "dd/MM/yyyy" strings; format only for display.|||Tầng 3: ngày — so sánh chuỗi "YYYY-MM-DD" hoặc Date, không so chuỗi "dd/MM/yyyy"; chỉ định dạng khi hiển thị.',
    ],
    nop: NOP,
  },
  {
    so: 3, slug: 'fer202-moc-3', sauChuong: 'Chapter 3 — JSX & Rendering|||Chương 3 — JSX & Render',
    ten: 'First real screen in JSX: the main list from seed data|||Màn hình thật đầu tiên bằng JSX: danh sách chính từ dữ liệu mẫu',
    yeuCau: [
      'Render the main list of your topic (courses/books/doctors/tasks…) from seed.js with map() and a stable key (the id).|||Vẽ danh sách chính của đề tài (khoá học/sách/bác sĩ/công việc…) từ seed.js bằng map() với key ổn định (id).',
      'Split into ≥ 3 components: a header, an item component, a list component.|||Tách thành ≥ 3 component: header, component một mục, component danh sách.',
      'Use conditional rendering at least 3 ways: an empty-state message, a badge shown only when a flag is true, a ternary label.|||Dùng render có điều kiện ít nhất 3 cách: chữ báo danh sách rỗng, huy hiệu chỉ hiện khi cờ true, nhãn dùng toán tử ba ngôi.',
      'Use a Fragment where a wrapper <div> would break the layout (table rows, dt/dd…).|||Dùng Fragment ở chỗ thẻ <div> bọc sẽ làm hỏng bố cục (hàng bảng, dt/dd…).',
    ],
    nangCao: [
      'Show a second derived view (e.g. "Top 3 cheapest", "Due this week") computed with filter/sort from the same data.|||Hiện thêm một khối suy ra (vd "3 khoá rẻ nhất", "Đến hạn tuần này") tính bằng filter/sort từ cùng dữ liệu.',
    ],
    datKhi: [
      'The browser Console has no warning (no missing key, no class/for).|||Console trình duyệt không có cảnh báo nào (không thiếu key, không class/for).',
      'Temporarily setting the list to [] shows your empty-state message, not a blank page.|||Tạm đặt danh sách thành [] thì hiện chữ báo rỗng, không phải trang trắng.',
      'No number 0 leaks into the UI from a "count && …" expression.|||Không có số 0 lạc ra giao diện từ biểu thức "count && …".',
    ],
    goiY: [
      'Tier 1: Lab 3.1 shows the HTML → JSX conversion rules; Lab 3.2 the four conditional patterns.|||Tầng 1: Lab 3.1 có luật chuyển HTML → JSX; Lab 3.2 có bốn mẫu render có điều kiện.',
      'Tier 2: the key belongs on the element returned by map(), not inside the child component.|||Tầng 2: key đặt trên phần tử mà map() trả về, không đặt bên trong component con.',
    ],
    nop: NOP,
  },
  {
    so: 4, slug: 'fer202-moc-4', sauChuong: 'Chapter 4 — Bootstrap & React-Bootstrap|||Chương 4 — Bootstrap & React-Bootstrap',
    ten: 'Responsive layout with React-Bootstrap|||Bố cục co giãn bằng React-Bootstrap',
    yeuCau: [
      'Install bootstrap + react-bootstrap and import bootstrap.min.css once in main.jsx.|||Cài bootstrap + react-bootstrap và import bootstrap.min.css đúng một lần trong main.jsx.',
      'A Navbar with your app name and links (Nav.Link for now; real routes come in Milestone 9) that collapses on mobile.|||Một Navbar có tên app và các link (tạm dùng Nav.Link; route thật ở Mốc 9) thu gọn được trên điện thoại.',
      'Show the main list as Cards in a grid: 1 per row on phones, 2 on tablets, 3–4 on desktop (Row/Col xs/md/lg).|||Hiện danh sách chính thành Card trong lưới: 1 thẻ/hàng trên điện thoại, 2 trên máy tính bảng, 3–4 trên desktop (Row/Col xs/md/lg).',
      'Build the static layout of your main form page with Form.Group/Form.Label/Form.Control/Form.Select (no logic yet) and a footer.|||Dựng bố cục tĩnh của trang form chính bằng Form.Group/Form.Label/Form.Control/Form.Select (chưa có logic) và một footer.',
    ],
    nangCao: [
      'One extra component that fits your topic: Accordion (lesson outline), Modal (confirm), Badge/Alert, Table striped hover.|||Một component thêm hợp đề tài: Accordion (đề cương), Modal (xác nhận), Badge/Alert, Table striped hover.',
    ],
    datKhi: [
      'DevTools → device toolbar at 375 px: no horizontal scroll, cards stack in one column, the navbar shows a toggle.|||DevTools → chế độ thiết bị 375 px: không cuộn ngang, thẻ xếp một cột, navbar có nút thu gọn.',
      'At ≥ 992 px the grid shows the number of columns you chose.|||Ở ≥ 992 px lưới hiện đúng số cột bạn chọn.',
      'Every form control has a visible label linked with controlId/htmlFor.|||Mọi ô nhập có nhãn hiển thị nối bằng controlId/htmlFor.',
    ],
    goiY: [
      'Tier 1: <Row><Col xs={12} md={6} lg={4}>…</Col></Row> — 12 columns per row.|||Tầng 1: <Row><Col xs={12} md={6} lg={4}>…</Col></Row> — mỗi hàng 12 cột.',
      'Tier 2: <Form.Group controlId="title"> links the label and the control for you.|||Tầng 2: <Form.Group controlId="title"> tự nối nhãn với ô nhập.',
    ],
    nop: NOP,
  },
  {
    so: 5, slug: 'fer202-moc-5', sauChuong: 'Chapter 5 — Components & State|||Chương 5 — Component & State',
    ten: 'State: add, remove and edit items in your list|||State: thêm, xoá và sửa mục trong danh sách',
    yeuCau: [
      'Move the list into useState (initial value = seed data) in the page component that owns it.|||Đưa danh sách vào useState (giá trị đầu = dữ liệu mẫu) ở component trang sở hữu nó.',
      'Add, remove and edit (e.g. toggle a flag, change a status) items of YOUR topic using your immutable helpers from Milestone 2.|||Thêm, xoá và sửa (vd bật/tắt một cờ, đổi trạng thái) mục của ĐỀ TÀI BẠN bằng các hàm bất biến của Mốc 2.',
      'Pass data down with props and callbacks up (onRemove(id), onToggle(id)); child components do not hold a copy of the list.|||Truyền dữ liệu xuống bằng props và callback lên (onRemove(id), onToggle(id)); component con không giữ bản sao danh sách.',
      'Declare PropTypes for every component that receives props (shape for the item, func for callbacks, isRequired where needed).|||Khai PropTypes cho mọi component nhận props (shape cho mục, func cho callback, isRequired chỗ cần).',
    ],
    nangCao: [
      'A live counter/total derived from state (number of items, total price, overdue count) — computed, not stored.|||Một bộ đếm/tổng suy ra từ state (số mục, tổng tiền, số quá hạn) — tính ra, không lưu.',
    ],
    datKhi: [
      'Adding, removing and editing update the screen immediately and the derived total stays correct.|||Thêm, xoá, sửa đều cập nhật màn hình ngay và tổng suy ra luôn đúng.',
      'Passing a wrong prop type (e.g. a string id) shows a PropTypes warning in the Console.|||Truyền sai kiểu prop (vd id là chuỗi) thì Console hiện cảnh báo PropTypes.',
      'No state update mutates the array (no push/splice/direct assignment on state).|||Không lệnh cập nhật state nào biến đổi mảng (không push/splice/gán trực tiếp trên state).',
    ],
    goiY: [
      'Tier 1: setItems(prev => removeItem(prev, id)) — the functional form always sees the latest list.|||Tầng 1: setItems(prev => removeItem(prev, id)) — dạng hàm luôn thấy danh sách mới nhất.',
      'Tier 2: the component that owns the state is the lowest common parent of everything that reads it.|||Tầng 2: component sở hữu state là cha chung thấp nhất của mọi chỗ đọc nó.',
    ],
    nop: NOP,
  },
  {
    so: 6, slug: 'fer202-moc-6', sauChuong: 'Chapter 6 — Event Handling|||Chương 6 — Xử lý sự kiện',
    ten: 'Events & forms: create/edit form, search, filter and sort controls|||Sự kiện & form: form tạo/sửa, ô tìm, bộ lọc và sắp xếp',
    yeuCau: [
      'A controlled create/edit form for your main resource with ≥ 4 fields (text, number or date, select, checkbox/switch) held in ONE state object and ONE handleChange using the input name.|||Một form tạo/sửa có kiểm soát cho tài nguyên chính với ≥ 4 ô (chữ, số hoặc ngày, select, checkbox/switch) giữ trong MỘT object state và MỘT handleChange dựa vào name của ô.',
      'onSubmit calls e.preventDefault(), adds or updates the item in state and resets the form.|||onSubmit gọi e.preventDefault(), thêm hoặc cập nhật mục trong state rồi xoá trắng form.',
      'A search box (case-insensitive, trims spaces), a filter select and a sort control that combine together.|||Một ô tìm (không phân biệt hoa thường, bỏ khoảng trắng thừa), một select lọc và một nút/ô sắp xếp kết hợp được với nhau.',
      'At least one handler receives a parameter correctly: onClick={() => onEdit(item.id)}.|||Ít nhất một handler nhận tham số đúng cách: onClick={() => onEdit(item.id)}.',
    ],
    nangCao: [
      'Basic validation messages under each field (required, minimum length) — full rules come in Milestone 11.|||Thông báo kiểm lỗi cơ bản dưới từng ô (bắt buộc, độ dài tối thiểu) — luật đầy đủ ở Mốc 11.',
      '"Edit" fills the same form with the item’s values (one form for create and edit).|||Nút "Sửa" đổ giá trị của mục vào chính form đó (một form cho cả tạo và sửa).',
    ],
    datKhi: [
      'Submitting does not reload the page; the new item appears and the form is empty again.|||Bấm lưu không tải lại trang; mục mới xuất hiện và form trống lại.',
      'Search "  ABC " finds the same results as "abc"; search + filter + sort work at the same time.|||Tìm "  ABC " ra cùng kết quả với "abc"; tìm + lọc + sắp xếp chạy cùng lúc.',
      'The checkbox/switch value is a boolean in state (read e.target.checked, not value).|||Giá trị checkbox/switch trong state là boolean (đọc e.target.checked, không đọc value).',
    ],
    goiY: [
      'Tier 1: const { name, value, type, checked } = e.target; setForm({ ...form, [name]: type === "checkbox" ? checked : value }).|||Tầng 1: const { name, value, type, checked } = e.target; setForm({ ...form, [name]: type === "checkbox" ? checked : value }).',
      'Tier 2: keep the raw list in state and DERIVE the shown list (filter → sort) during render; never overwrite the list with the filtered one.|||Tầng 2: giữ danh sách gốc trong state và SUY RA danh sách hiển thị (filter → sort) lúc render; đừng ghi đè danh sách gốc bằng danh sách đã lọc.',
      'Tier 3: onClick={onEdit(item.id)} calls it immediately during render — wrap it in an arrow function.|||Tầng 3: onClick={onEdit(item.id)} gọi ngay lúc render — phải bọc trong arrow function.',
    ],
    nop: NOP,
  },
  {
    so: 7, slug: 'fer202-moc-7', sauChuong: 'Chapter 7 — Props patterns & Context|||Chương 7 — Mẫu props & Context',
    ten: 'Shared state with Context + a reusable layout|||State dùng chung bằng Context + layout tái sử dụng',
    yeuCau: [
      'Create one Context that your topic really needs across pages: cart, current user/role, favourites, or the booking in progress.|||Tạo một Context mà đề tài thật sự cần dùng giữa các trang: giỏ hàng, người dùng/vai hiện tại, yêu thích, hoặc lịch đang đặt dở.',
      'A Provider component + a custom hook (useCart/useAuth…) that throws a clear error outside the Provider.|||Một component Provider + một custom hook (useCart/useAuth…) báo lỗi rõ khi dùng ngoài Provider.',
      'Remove every prop that was only "passed through" to reach a deep component.|||Bỏ mọi prop chỉ để "chuyền tay" tới component sâu bên dưới.',
      'A Layout/Panel component that uses children (and optional named slots like footer) on at least 2 screens.|||Một component Layout/Panel dùng children (và khe đặt tên tuỳ chọn như footer) trên ít nhất 2 màn hình.',
    ],
    nangCao: [
      'A fake login page that sets the current user in an AuthContext; hide admin buttons for normal users.|||Trang đăng nhập giả đặt người dùng hiện tại vào AuthContext; ẩn nút admin với người dùng thường.',
      'A theme (light/dark) switch through Context.|||Công tắc giao diện sáng/tối qua Context.',
    ],
    datKhi: [
      'The header (or another far-away component) shows live context data without receiving it as a prop.|||Header (hoặc một component ở xa) hiện dữ liệu context theo thời gian thực mà không nhận qua prop.',
      'Rendering a consumer outside the Provider shows your error message.|||Vẽ component dùng context ngoài Provider thì hiện thông báo lỗi của bạn.',
      'You can name which state stays local and which moved to Context, and why.|||Bạn nói được state nào giữ cục bộ, state nào chuyển lên Context, và vì sao.',
    ],
    goiY: [
      'Tier 1: Lab 7.1 is a complete cart Context to compare against.|||Tầng 1: Lab 7.1 là một Context giỏ hàng trọn vẹn để đối chiếu.',
      'Tier 2: do not put everything in Context — form inputs and UI toggles stay local.|||Tầng 2: đừng nhét mọi thứ vào Context — ô nhập của form và công tắc giao diện giữ cục bộ.',
    ],
    nop: NOP,
  },
  {
    so: 8, slug: 'fer202-moc-8', sauChuong: 'Chapter 8 — Hooks|||Chương 8 — Hooks',
    ten: 'Hooks: effects, a reducer and your own custom hook|||Hooks: effect, reducer và custom hook của riêng bạn',
    yeuCau: [
      'Replace the most complex useState of your app (cart, board, booking wizard, attendance sheet) with useReducer and named actions (ADD, REMOVE, UPDATE…).|||Thay useState phức tạp nhất của app (giỏ hàng, bảng việc, form đặt lịch, bảng điểm danh) bằng useReducer với action có tên (ADD, REMOVE, UPDATE…).',
      'useEffect #1: persist something to localStorage and load it on start (cart, favourites, last filter).|||useEffect #1: lưu một thứ vào localStorage và nạp lại khi mở app (giỏ hàng, yêu thích, bộ lọc gần nhất).',
      'useEffect #2: a side effect with a correct dependency array (document.title with the item count, reload data when a filter changes).|||useEffect #2: một side effect với mảng phụ thuộc đúng (document.title có số mục, tải lại dữ liệu khi đổi bộ lọc).',
      'One custom hook in src/hooks/ (useLocalStorage, useDebounce, useFilter…) used by a page.|||Một custom hook trong src/hooks/ (useLocalStorage, useDebounce, useFilter…) được một trang dùng.',
    ],
    nangCao: [
      'An effect with cleanup (setInterval countdown, event listener) and proof that it is cleaned up when leaving the page.|||Một effect có cleanup (đếm ngược setInterval, event listener) và chứng minh được nó dọn khi rời trang.',
    ],
    datKhi: [
      'Reload the page: the persisted data is still there.|||Tải lại trang: dữ liệu đã lưu vẫn còn.',
      'The reducer is a pure function (no fetch, no Date.now(), no mutation) with a default case returning state.|||Reducer là hàm thuần (không fetch, không Date.now(), không biến đổi) có nhánh default trả về state.',
      'No "Maximum update depth exceeded" and no effect that runs on every render without reason.|||Không có lỗi "Maximum update depth exceeded" và không effect nào chạy mọi lần render vô cớ.',
    ],
    goiY: [
      'Tier 1: const [state, dispatch] = useReducer(reducer, initial, init) — the 3rd argument can read localStorage once.|||Tầng 1: const [state, dispatch] = useReducer(reducer, initial, init) — đối số thứ 3 đọc localStorage được đúng một lần.',
      'Tier 2: useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]).|||Tầng 2: useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]).',
    ],
    nop: NOP,
  },
  {
    so: 9, slug: 'fer202-moc-9', sauChuong: 'Chapter 9 — Routing with React Router|||Chương 9 — Routing với React Router',
    ten: 'Pages and navigation: list → detail, nested layout, 404|||Trang và điều hướng: danh sách → chi tiết, layout lồng, 404',
    yeuCau: [
      'Install react-router-dom and declare ≥ 4 routes in one place (BrowserRouter + Routes + Route), including a 404 route path="*".|||Cài react-router-dom và khai ≥ 4 route ở một chỗ (BrowserRouter + Routes + Route), có route 404 path="*".',
      'A detail page /<resource>/:id that reads useParams(), finds the item (compare as strings or convert with Number) and shows "Not found" for a wrong id.|||Trang chi tiết /<resource>/:id đọc useParams(), tìm mục (so sánh dạng chuỗi hoặc đổi bằng Number) và báo "Not found" khi id sai.',
      'Navbar links become NavLink (active style); list items link to their detail page with Link.|||Link trên navbar thành NavLink (có kiểu đang chọn); mỗi mục trong danh sách nối tới trang chi tiết bằng Link.',
      'After saving the form, navigate back to the list with useNavigate().|||Lưu form xong thì quay về danh sách bằng useNavigate().',
      'A shared layout route with <Outlet /> (navbar + footer stay, the page changes).|||Một route layout dùng chung với <Outlet /> (navbar + footer giữ nguyên, trang đổi).',
    ],
    nangCao: [
      'Keep one filter in the URL with useSearchParams (e.g. ?category=2&sort=price) so a filtered list can be shared/bookmarked.|||Đưa một bộ lọc lên URL bằng useSearchParams (vd ?category=2&sort=price) để danh sách đã lọc chia sẻ/lưu dấu được.',
      'A protected route that redirects to /login when there is no user (Navigate).|||Một route bảo vệ chuyển về /login khi chưa có người dùng (Navigate).',
    ],
    datKhi: [
      'Typing /<resource>/<an existing id> directly in the address bar opens the right detail page; a wrong id shows your not-found message; a random URL shows the 404 page.|||Gõ thẳng /<resource>/<id có thật> vào thanh địa chỉ mở đúng trang chi tiết; id sai hiện thông báo không tìm thấy; URL bất kỳ hiện trang 404.',
      'Clicking links never reloads the whole page (no <a href> for internal links).|||Bấm link không bao giờ tải lại cả trang (không dùng <a href> cho link nội bộ).',
      'Back/Forward buttons of the browser work as users expect.|||Nút Lùi/Tiến của trình duyệt chạy đúng như người dùng mong.',
    ],
    goiY: [
      'Tier 1: useParams() always returns strings — items.find(x => String(x.id) === id).|||Tầng 1: useParams() luôn trả chuỗi — items.find(x => String(x.id) === id).',
      'Tier 2: put the route list in src/routes/AppRoutes.jsx (Exercise 20 "decoupling route declarations").|||Tầng 2: đặt danh sách route trong src/routes/AppRoutes.jsx (Exercise 20 "decoupling route declarations").',
    ],
    nop: NOP,
  },
  {
    so: 10, slug: 'fer202-moc-10', sauChuong: 'Chapter 10 — Code Splitting|||Chương 10 — Tách code',
    ten: 'Lazy-load the heavy pages|||Tải lười các trang nặng',
    yeuCau: [
      'Turn ≥ 2 rarely used pages (admin, statistics, detail panel) into React.lazy(() => import(...)) components.|||Biến ≥ 2 trang ít dùng (admin, thống kê, bảng chi tiết) thành component React.lazy(() => import(...)).',
      'Wrap them in <Suspense fallback={…}> with a visible loading indicator (Spinner).|||Bọc chúng trong <Suspense fallback={…}> có chỉ báo đang tải nhìn thấy được (Spinner).',
      'Make sure each lazy module has a default export (or map a named export to default).|||Đảm bảo mỗi module lazy có default export (hoặc đổi named export thành default).',
    ],
    nangCao: [
      'An error boundary around the lazy routes that shows "Could not load this page — retry" when a chunk fails.|||Một error boundary quanh các route lazy, hiện "Không tải được trang — thử lại" khi chunk lỗi.',
    ],
    datKhi: [
      'npm run build lists separate JS chunks for the lazy pages.|||npm run build liệt kê các chunk JS riêng cho trang lazy.',
      'DevTools → Network (Slow 3G): the lazy page’s chunk is requested only when you open it, and the fallback is visible meanwhile.|||DevTools → Network (Slow 3G): chunk của trang lazy chỉ được tải khi mở trang đó, và trong lúc chờ thấy fallback.',
    ],
    goiY: [
      'Tier 1: const AdminPage = lazy(() => import("./pages/AdminPage.jsx")) at the top level of the file, never inside a component.|||Tầng 1: const AdminPage = lazy(() => import("./pages/AdminPage.jsx")) ở cấp cao nhất của tệp, không bao giờ đặt trong component.',
    ],
    nop: NOP,
  },
  {
    so: 11, slug: 'fer202-moc-11', sauChuong: 'Chapter 11 — Client-Server Communication|||Chương 11 — Giao tiếp Client-Server',
    ten: 'Real data: json-server CRUD, validated form, confirmed delete, bulk PATCH|||Dữ liệu thật: CRUD json-server, form kiểm lỗi, xoá có xác nhận, PATCH hàng loạt',
    yeuCau: [
      'Replace seed data with requests to json-server through one service file (src/services/api.js) using axios or fetch; base URL from .env (VITE_API_URL).|||Thay dữ liệu mẫu bằng request tới json-server qua một tệp service (src/services/api.js) dùng axios hoặc fetch; base URL lấy từ .env (VITE_API_URL).',
      'Every screen that loads data shows loading, error and empty states.|||Mọi màn hình tải dữ liệu đều có trạng thái đang tải, lỗi và rỗng.',
      'Create (POST), edit (PUT with the full object or PATCH with changed fields) and delete (DELETE after window.confirm or a Modal) your main resource.|||Tạo (POST), sửa (PUT gửi đủ object hoặc PATCH chỉ trường đổi) và xoá (DELETE sau window.confirm hoặc Modal) tài nguyên chính.',
      'Form validation with ≥ 4 real rules for YOUR topic, messages under each field (isInvalid + Form.Control.Feedback), submit blocked while invalid, success Alert after saving.|||Kiểm lỗi form với ≥ 4 luật thật của ĐỀ TÀI BẠN, thông báo dưới từng ô (isInvalid + Form.Control.Feedback), chặn gửi khi còn lỗi, Alert thành công sau khi lưu.',
      'One bulk action: select several items (checkboxes) and PATCH them all, then refresh the list once (like lesson 11.5).|||Một thao tác hàng loạt: tick chọn nhiều mục và PATCH tất cả, rồi làm mới danh sách một lần (như bài 11.5).',
      'Show related data by id (e.g. category name next to a book) by loading both resources.|||Hiện dữ liệu liên quan theo id (vd tên thể loại cạnh sách) bằng cách tải cả hai tài nguyên.',
    ],
    nangCao: [
      'Server-side filter with query params (GET /books?categoryId=2&_sort=title).|||Lọc phía server bằng query (GET /books?categoryId=2&_sort=title).',
      'Optimistic update with rollback when the request fails.|||Cập nhật lạc quan, lỗi thì trả lại như cũ.',
    ],
    datKhi: [
      'Stop json-server: the app shows an error message instead of crashing; start it again and reload: data comes back.|||Tắt json-server: app hiện thông báo lỗi chứ không sập; bật lại và tải lại: dữ liệu về.',
      'After POST/PATCH/DELETE, db.json on disk changed accordingly and the list on screen matches it without a manual reload.|||Sau POST/PATCH/DELETE, tệp db.json trên đĩa đổi tương ứng và danh sách trên màn hình khớp mà không cần tải lại tay.',
      'Editing one field with PATCH (or PUT with the full object) never wipes other fields.|||Sửa một trường bằng PATCH (hoặc PUT gửi đủ object) không làm mất các trường khác.',
      'Cancel in the confirm dialog keeps the item; each validation rule can be triggered and its message shown.|||Bấm Huỷ ở hộp xác nhận thì mục còn nguyên; luật kiểm lỗi nào cũng kích hoạt được và hiện đúng thông báo.',
      'The bulk PATCH waits for all requests (for…of + await or Promise.all) before showing success.|||PATCH hàng loạt đợi xong mọi request (for…of + await hoặc Promise.all) rồi mới báo thành công.',
    ],
    goiY: [
      'Tier 1: lesson 11.5 is the reference for validation, .env, confirm and bulk PATCH.|||Tầng 1: bài 11.5 là mẫu đối chiếu cho kiểm lỗi, .env, xác nhận và PATCH hàng loạt.',
      'Tier 2: fetch does not reject on 404 — check res.ok; axios rejects on non-2xx and gives res.data.|||Tầng 2: fetch không reject khi 404 — phải kiểm res.ok; axios reject với status ngoài 2xx và trả res.data.',
      'Tier 3: Vite reads only variables prefixed VITE_; restart npm run dev after editing .env.|||Tầng 3: Vite chỉ đọc biến có tiền tố VITE_; sửa .env xong phải chạy lại npm run dev.',
    ],
    nop: NOP,
  },
  {
    so: 12, slug: 'fer202-moc-12', sauChuong: 'Chapter 12 — Flux Architecture & Redux|||Chương 12 — Kiến trúc Flux & Redux',
    ten: 'Redux Toolkit for one feature: slice, selectors, async thunks|||Redux Toolkit cho một tính năng: slice, selector, async thunk',
    yeuCau: [
      'Install @reduxjs/toolkit + react-redux, configureStore in src/app/store.js and wrap the app in <Provider store={store}>.|||Cài @reduxjs/toolkit + react-redux, configureStore trong src/app/store.js và bọc app trong <Provider store={store}>.',
      'Move ONE feature to a slice (the cart, the main resource list, the board…) with ≥ 3 reducers.|||Chuyển MỘT tính năng sang slice (giỏ hàng, danh sách tài nguyên chính, bảng việc…) với ≥ 3 reducer.',
      'Load its data with createAsyncThunk and handle pending/fulfilled/rejected in extraReducers (status + error).|||Tải dữ liệu của nó bằng createAsyncThunk và xử lý pending/fulfilled/rejected trong extraReducers (status + error).',
      'Components read data only through selectors (useSelector(selectX)) and change it only with dispatch.|||Component chỉ đọc dữ liệu qua selector (useSelector(selectX)) và chỉ đổi bằng dispatch.',
    ],
    nangCao: [
      'A memoised selector with createSelector for a derived value (total, overdue list, workload).|||Một selector ghi nhớ bằng createSelector cho giá trị suy ra (tổng, danh sách quá hạn, khối lượng).',
      'Redux DevTools screenshot showing the action log of one user flow.|||Ảnh Redux DevTools cho thấy chuỗi action của một luồng thao tác.',
    ],
    datKhi: [
      'The moved feature works exactly as before (no regression), and its old Context/useState code is deleted.|||Tính năng đã chuyển chạy y như trước (không hỏng gì), và code Context/useState cũ của nó đã xoá.',
      'Reducers contain no API call; the thunk does.|||Reducer không chứa lời gọi API nào; thunk mới gọi.',
      'You can draw the flow: UI → dispatch(thunk) → API → fulfilled → reducer → store → useSelector → UI.|||Bạn vẽ được luồng: UI → dispatch(thunk) → API → fulfilled → reducer → store → useSelector → UI.',
    ],
    goiY: [
      'Tier 1: Lab 12.1 (slice + selectors) and Lab 12.2 (thunks on json-server) are the templates.|||Tầng 1: Lab 12.1 (slice + selector) và Lab 12.2 (thunk với json-server) là khuôn mẫu.',
      'Tier 2: keep Context for things Redux does not need to own (theme), do not migrate everything.|||Tầng 2: giữ Context cho thứ Redux không cần nắm (theme), đừng chuyển hết.',
    ],
    nop: NOP,
  },
  {
    so: 13, slug: 'fer202-moc-13', sauChuong: 'Advanced A1–A2 — Performance & Testing|||Nâng cao A1–A2 — Hiệu năng & Kiểm thử',
    ten: 'Quality pass: tests, performance check, README and a live demo|||Vòng chất lượng: test, soát hiệu năng, README và demo chạy thật',
    yeuCau: [
      'Set up Vitest (or Jest) and write ≥ 5 unit tests for your utils/validation/reducer, including edge cases.|||Cài Vitest (hoặc Jest) và viết ≥ 5 unit test cho utils/kiểm lỗi/reducer, có trường hợp biên.',
      'Write ≥ 2 component tests with React Testing Library (render a page with mocked data, interact, assert what the user sees).|||Viết ≥ 2 test component bằng React Testing Library (vẽ một trang với dữ liệu giả, thao tác, khẳng định thứ người dùng thấy).',
      'React DevTools Profiler: find one unnecessary re-render and fix it with React.memo/useMemo/useCallback — or explain why none was worth fixing.|||React DevTools Profiler: tìm một lần render thừa và sửa bằng React.memo/useMemo/useCallback — hoặc giải thích vì sao không đáng sửa.',
      'Final README: screenshots, feature checklist (ticked), how to run app + json-server, test command, known limitations.|||README cuối: ảnh chụp, checklist tính năng (đã tick), cách chạy app + json-server, lệnh test, giới hạn đã biết.',
      'Deploy the front-end (Vercel/Netlify/GitHub Pages) with a demo data mode, or record a 3–5 minute demo video.|||Deploy front-end (Vercel/Netlify/GitHub Pages) kèm chế độ dữ liệu demo, hoặc quay video demo 3–5 phút.',
    ],
    nangCao: [
      'Convert one feature to TypeScript (Advanced A3, Lab A3.1).|||Chuyển một tính năng sang TypeScript (Nâng cao A3, Lab A3.1).',
      'Rebuild the list + detail pages in Next.js App Router as a comparison branch (Lab A3.2).|||Dựng lại trang danh sách + chi tiết bằng Next.js App Router ở một nhánh để so sánh (Lab A3.2).',
    ],
    datKhi: [
      'npx vitest run (or npm test) is green with ≥ 7 tests; breaking one rule on purpose turns a test red.|||npx vitest run (hoặc npm test) xanh với ≥ 7 test; cố ý làm hỏng một luật thì có test đỏ.',
      'A classmate can clone the repo and run it from the README alone in under 5 minutes.|||Một bạn cùng lớp clone repo và chạy được chỉ nhờ README trong dưới 5 phút.',
      'The demo link/video shows the main user flow end to end.|||Link/video demo cho thấy trọn luồng chính từ đầu tới cuối.',
    ],
    goiY: [
      'Tier 1: Lab A2.1 (unit tests) and Lab A2.2 (RTL with mocked fetch) are copyable patterns.|||Tầng 1: Lab A2.1 (unit test) và Lab A2.2 (RTL với fetch giả) là mẫu chép theo được.',
      'Tier 2: json-server does not run on static hosting — ship a demo mode (seed data) or use a hosted mock API, and say so in the README.|||Tầng 2: json-server không chạy được trên hosting tĩnh — làm chế độ demo (dữ liệu mẫu) hoặc dùng mock API có sẵn, và ghi rõ trong README.',
    ],
    nop: ['repo', 'demo', 'anh'],
  },
];

/* ═══════════════════════════════ BẢO VỆ ═══════════════════════════════ */
const baoVe = {
  rubric: [
    { tieuChi: 'Features & completeness|||Chức năng & mức hoàn thiện', diem: 3, moTa: 'All required milestone items work in the demo: list/detail/CRUD/filter/form/shared state; no crash on the main flow; extras count only after the basics.|||Mọi yêu cầu bắt buộc của các mốc chạy được khi demo: danh sách/chi tiết/CRUD/lọc/form/state dùng chung; luồng chính không sập; phần thêm chỉ tính khi phần cơ bản đã đủ.' },
    { tieuChi: 'Correct React|||Dùng React đúng', diem: 2, moTa: 'State lives in the right place, no mutation, derived data computed not stored, correct keys, effects with correct dependencies, Router/Context/Redux used where they fit.|||State đặt đúng chỗ, không biến đổi state, dữ liệu suy ra được tính chứ không lưu, key đúng, effect có phụ thuộc đúng, Router/Context/Redux dùng đúng nơi cần.' },
    { tieuChi: 'Data & API|||Dữ liệu & API', diem: 1.5, moTa: 'REST calls in a service layer, correct HTTP methods (PATCH vs PUT), loading/error/empty states, validation rules that match the domain, confirmed delete, bulk update awaited.|||Lời gọi REST nằm ở lớp service, dùng đúng phương thức HTTP (PATCH hay PUT), có trạng thái đang tải/lỗi/rỗng, luật kiểm lỗi hợp nghiệp vụ, xoá có xác nhận, cập nhật hàng loạt có chờ xong.' },
    { tieuChi: 'UI & UX|||Giao diện & trải nghiệm', diem: 1, moTa: 'Responsive at 375 px and desktop, consistent React-Bootstrap components, readable messages, no console errors.|||Co giãn đúng ở 375 px và desktop, component React-Bootstrap nhất quán, thông báo dễ hiểu, Console không lỗi.' },
    { tieuChi: 'Code quality & Git|||Chất lượng code & Git', diem: 1, moTa: 'Clear folders and names, small components, README that runs, steady commit history across the milestones (not one giant commit), tests present.|||Thư mục và tên rõ ràng, component nhỏ, README chạy theo được, lịch sử commit đều qua các mốc (không phải một commit khổng lồ), có test.' },
    { tieuChi: 'Oral defence & live change|||Vấn đáp & sửa code tại chỗ', diem: 1.5, moTa: 'Explains own code and data flow in own words, answers "what if" questions, makes a small requested change live in ≤ 10 minutes, honest about what was copied or AI-assisted.|||Giải thích code và luồng dữ liệu bằng lời của mình, trả lời được câu "nếu đổi…", sửa một thay đổi nhỏ theo yêu cầu ngay tại chỗ trong ≤ 10 phút, trung thực về phần đã chép hay nhờ AI.' },
  ],
  cauHoiMau: [
    'Walk us through what happens, file by file, from opening the list page to the data appearing on screen.|||Hãy dẫn chúng tôi đi qua từng tệp: từ lúc mở trang danh sách tới lúc dữ liệu hiện lên màn hình.',
    'Where does the state of your main list live, and why there and not in the child component?|||State của danh sách chính nằm ở đâu, vì sao đặt ở đó mà không đặt ở component con?',
    'Why does this useEffect have exactly these dependencies? What happens if I delete the array? If I leave it empty?|||Vì sao useEffect này có đúng các phụ thuộc này? Xoá mảng phụ thuộc thì sao? Để mảng rỗng thì sao?',
    'Why do you use PATCH here and not PUT? Show me what would be lost with PUT.|||Vì sao chỗ này dùng PATCH mà không dùng PUT? Chỉ cho tôi thấy dùng PUT sẽ mất gì.',
    'fetch returns a 404 — does your code go to .then or .catch? Show me where you handle it.|||fetch trả 404 — code của em chạy vào .then hay .catch? Chỉ chỗ em xử lý nó.',
    'Your bulk update sends several requests. How do you know all of them finished before you show "Success"?|||Cập nhật hàng loạt gửi nhiều request. Làm sao em biết tất cả xong rồi mới báo "Thành công"?',
    'Add a new required field (for example "phone" or "duration") to the main resource. List every file you would change, then do it.|||Thêm một trường bắt buộc mới (vd "phone" hay "duration") cho tài nguyên chính. Liệt kê mọi tệp sẽ sửa, rồi sửa luôn.',
    'Change one validation rule live (for example the minimum length from 2 to 5). Where is it, and what message changes?|||Sửa một luật kiểm lỗi ngay tại chỗ (vd độ dài tối thiểu từ 2 lên 5). Nó nằm ở đâu, thông báo nào đổi theo?',
    'Why is this list key the id and not the index? Show a bug the index would cause.|||Vì sao key của danh sách này là id mà không phải index? Chỉ ra một lỗi mà index sẽ gây ra.',
    'useParams gives you "3". Your data has id 3. Why might find() return undefined, and how did you avoid it?|||useParams trả "3". Dữ liệu có id là 3. Vì sao find() có thể trả undefined, và em tránh nó thế nào?',
    'What happens when the user opens /items/999 or a random URL? Show it.|||Người dùng mở /items/999 hoặc một URL bất kỳ thì sao? Mở cho tôi xem.',
    'Why did you put this data in Context (or Redux) instead of passing props? Would it still work with props?|||Vì sao em đưa dữ liệu này vào Context (hoặc Redux) thay vì truyền props? Dùng props thì có chạy không?',
    'Explain the Redux flow when I click this button: which action, which reducer, how does the component re-render?|||Giải thích luồng Redux khi tôi bấm nút này: action nào, reducer nào, component vẽ lại thế nào?',
    'Why can a reducer not call the API? Where is your API call for this feature?|||Vì sao reducer không được gọi API? Lời gọi API của tính năng này nằm ở đâu?',
    'How is your search case-insensitive and does it ignore extra spaces? Show the exact line.|||Ô tìm của em không phân biệt hoa thường và bỏ khoảng trắng thừa thế nào? Chỉ đúng dòng đó.',
    'Your filtered list: is it stored in state or computed? What breaks if you store it?|||Danh sách đã lọc của em được lưu trong state hay tính ra? Lưu nó thì hỏng chỗ nào?',
    'Which pages are lazy-loaded and how can you prove the chunk loads only when needed?|||Trang nào được tải lười, và em chứng minh chunk chỉ tải khi cần bằng cách nào?',
    'Stop json-server now. What does the user see? Is that acceptable?|||Tắt json-server ngay bây giờ. Người dùng thấy gì? Như vậy có chấp nhận được không?',
    'Where is the API base URL configured? What would you change to point the app at a real backend?|||Base URL của API cấu hình ở đâu? Muốn trỏ app sang backend thật thì sửa gì?',
    'Show one test you wrote. If I break the code it protects, which test turns red?|||Cho tôi xem một test em viết. Nếu tôi làm hỏng đoạn code nó bảo vệ, test nào đỏ?',
    'The customer now wants items sorted by newest by default. Make the change.|||Khách hàng muốn mặc định sắp theo mới nhất. Sửa đi.',
    'Which part of this project was hardest for you, and what did you try before it worked?|||Phần nào của dự án khó nhất với em, và em đã thử những gì trước khi nó chạy được?',
    'Which parts did you copy from a tutorial or write with an AI assistant? Explain one of those lines as if you wrote it.|||Phần nào em chép từ hướng dẫn hoặc viết cùng trợ lý AI? Giải thích một dòng trong đó như thể chính em viết.',
    'If two users edit the same record at the same time with your app, what happens? How would you detect it?|||Nếu hai người cùng sửa một bản ghi bằng app của em cùng lúc thì sao? Em sẽ phát hiện thế nào?',
  ],
  chuanBi: [
    'git clone into an empty folder → npm install → npm run server → npm run dev works from the README alone.|||git clone vào thư mục trống → npm install → npm run server → npm run dev chạy được chỉ theo README.',
    'db.json reset to clean demo data (keep a copy, e.g. db.sample.json).|||db.json đưa về dữ liệu demo sạch (giữ một bản sao, vd db.sample.json).',
    'The main flow rehearsed in 3 minutes: list → filter → detail → create with a validation error → fix → save → edit → delete with confirm → bulk action.|||Tập trước luồng chính trong 3 phút: danh sách → lọc → chi tiết → tạo bị lỗi kiểm → sửa → lưu → sửa mục → xoá có xác nhận → thao tác hàng loạt.',
    'Console clean (no red, no key/PropTypes warnings) on every page.|||Console sạch (không đỏ, không cảnh báo key/PropTypes) ở mọi trang.',
    'All tests green: npx vitest run (or npm test).|||Mọi test xanh: npx vitest run (hoặc npm test).',
    'You can draw the folder structure and the data flow of one feature on paper without looking.|||Bạn vẽ được cấu trúc thư mục và luồng dữ liệu của một tính năng ra giấy mà không nhìn code.',
    'Practise 3 live changes: add a field, change a validation rule, change the default sort.|||Tập trước 3 thay đổi tại chỗ: thêm một trường, đổi một luật kiểm lỗi, đổi kiểu sắp xếp mặc định.',
    'Re-read the V10 Q&A of the Fall26 PE and answer the sample questions above out loud.|||Xem lại V10 Hỏi–đáp của đề PE Fall26 và trả lời to các câu mẫu ở trên.',
    'Know what each dependency in package.json is for; remove the ones you do not use.|||Biết mỗi dependency trong package.json để làm gì; gỡ những cái không dùng.',
    'Prepare an honest answer about what you copied or wrote with AI — and be able to explain it line by line.|||Chuẩn bị câu trả lời trung thực về phần đã chép hay viết cùng AI — và giải thích được từng dòng của nó.',
  ],
};

export const duAn = { version: 1, gioiThieu: `${GIOI_THIEU_EN}|||${GIOI_THIEU_VI}`, deTai, tuChon, moc, baoVe };

/* ═════════════════════ KHUNG GIAO DIỆN & KHUNG CODE MẪU CHO TỪNG MỐC ═════════════════════
 * Chỉ là KHUNG: tên tệp, cấu trúc, chữ ký hàm, chỗ TODO — không phải lời giải trọn. Ví dụ dùng đề tài thư viện;
 * thay tên tài nguyên theo đề tài của bạn. */
const DEMO = {
  1: { khung: `my-library/
├─ db.json                 ← { "categories": [...], "books": [... "categoryId": 1 ...] }
├─ package.json            ← "scripts": { "dev": "vite", "server": "json-server --watch db.json --port 9999" }
├─ README.md               ← topic · users · feature checklist · how to run
└─ src/
   ├─ components/  pages/  services/  utils/
   ├─ App.jsx
   └─ main.jsx`, code: `{
  "categories": [ { "id": 1, "name": "Programming" }, { "id": 2, "name": "Business" } ],
  "books": [
    { "id": 1, "title": "Clean Code", "author": "Robert C. Martin", "categoryId": 1, "year": 2008, "available": true }
    /* TODO: ≥ 8 realistic records for YOUR topic */
  ]
}`, lang: 'json' },
  2: { code: `// src/utils/books.js — signatures only, the bodies are yours
export const formatDate = (iso) => { /* "2026-11-21" → "21/11/2026" */ };
export const searchBooks = (list, q) => { /* trim + toLowerCase on both sides */ };
export const sortBy = (list, key, dir = 'asc') => { /* copy first: [...list].sort(…) */ };
export const addBook = (list, book) => { /* new array, new id */ };
export const updateBook = (list, id, patch) => { /* map + spread */ };
export const removeBook = (list, id) => { /* filter */ };
export const isOverdue = (loan, today) => { /* your domain rule + an edge case */ };` },
  3: { khung: `┌───────────────────────────────────────────┐
│  📚 My Library                             │  ← <Header />
├───────────────────────────────────────────┤
│  Clean Code — R. C. Martin   [Available]   │  ← <BookItem /> × n  (map + key)
│  Refactoring — M. Fowler     [Out]         │
│  …                                         │
│  (empty) "No books yet."                   │  ← empty state
└───────────────────────────────────────────┘` },
  4: { khung: `desktop ≥ 992px                          phone 375px
┌──────────────────────────────────┐     ┌──────────────┐
│ Logo  Books  Members  Loans   ☰  │     │ Logo       ☰ │
├──────────┬──────────┬────────────┤     ├──────────────┤
│  Card    │  Card    │  Card      │     │  Card        │
│  Card    │  Card    │  Card      │     │  Card        │
├──────────┴──────────┴────────────┤     │  Card        │
│ footer                           │     │ footer       │
└──────────────────────────────────┘     └──────────────┘
<Col xs={12} md={6} lg={4}>`, code: `<Navbar expand="md" bg="dark" data-bs-theme="dark">
  <Container>
    <Navbar.Brand>My Library</Navbar.Brand>
    <Navbar.Toggle aria-controls="main-nav" />
    <Navbar.Collapse id="main-nav">{/* TODO Nav.Link × 3 */}</Navbar.Collapse>
  </Container>
</Navbar>` },
  5: { code: `// src/pages/BooksPage.jsx — the page OWNS the list
const [books, setBooks] = useState(seedBooks);
const handleRemove = (id) => setBooks((prev) => /* TODO your helper */ prev);
const handleToggle = (id) => setBooks((prev) => /* TODO flip "available" */ prev);
const availableCount = /* TODO derived from books, not stored */ 0;

return <BookList books={books} onRemove={handleRemove} onToggle={handleToggle} />;

// src/components/BookList.jsx
BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired, title: PropTypes.string.isRequired })).isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};` },
  6: { khung: `[ Search… ________ ] [ Category ▾ ] [ Sort: Title ▴ ]
──────────────────────────────────────────────
Title    [______________]
Author   [______________]
Year     [____]          Category [ ▾ ]
[x] Available
                      [ Cancel ] [ Save ]`, code: `const EMPTY = { title: '', author: '', year: '', categoryId: '', available: true };
const [form, setForm] = useState(EMPTY);
const handleChange = (e) => { /* ONE handler for every field (name / checked) */ };
const handleSubmit = (e) => { e.preventDefault(); /* add or update, then setForm(EMPTY) */ };

const shown = /* derive: search → filter → sort, from books + q + category + sort */ books;` },
  7: { code: `// src/context/AuthContext.jsx
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);           // { id, name, role }
  /* TODO login(name), logout() */
  return <AuthContext.Provider value={{ user /* , login, logout */ }}>{children}</AuthContext.Provider>;
}
export function useAuth() { /* useContext + throw outside the Provider */ }

// main.jsx:  <AuthProvider><App /></AuthProvider>` },
  8: { code: `function loansReducer(state, action) {
  switch (action.type) {
    case 'ADD':    /* return a new array */
    case 'RETURN': /* map: returned = true */
    case 'REMOVE': /* filter */
    default: return state;
  }
}
const [loans, dispatch] = useReducer(loansReducer, [], () => JSON.parse(localStorage.getItem('loans') ?? '[]'));
useEffect(() => { /* save loans */ }, [loans]);

// src/hooks/useDebounce.js
export function useDebounce(value, ms = 300) { /* useState + useEffect with setTimeout + cleanup */ }` },
  9: { khung: `/                → redirect to /books
/books           → list (+ ?category=2&sort=title)
/books/:id       → detail  ("Book not found" for a wrong id)
/books/new       → form (create)       /books/:id/edit → form (edit)
/members  /loans /login
*                → 404 page
All of them inside <Route element={<Layout />}> … <Outlet /> …`, code: `<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Navigate to="/books" replace />} />
    <Route path="/books" element={<BooksPage />} />
    <Route path="/books/:id" element={<BookDetail />} />
    {/* TODO new, edit, members, loans, login */}
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>` },
  10: { code: `const StatsPage = lazy(() => import('./pages/StatsPage.jsx'));      // top level, default export
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

<Suspense fallback={<Spinner animation="border" />}>
  <Routes>{/* … <Route path="/stats" element={<StatsPage />} /> … */}</Routes>
</Suspense>` },
  11: { code: `// src/services/api.js — the ONLY file that knows URLs
import axios from 'axios';
const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });   // .env: VITE_API_URL=http://localhost:9999

export const getBooks = () => http.get('/books').then((r) => r.data);
export const createBook = (b) => { /* POST */ };
export const patchBook = (id, changes) => { /* PATCH /books/:id */ };
export const deleteBook = (id) => { /* DELETE */ };
export async function markUnavailable(ids) {
  /* for (const id of ids) await patchBook(id, { available: false });   — or Promise.all */
}

// page: const [status, setStatus] = useState('loading');  // loading | ready | error
// form: errors = validate(form); <Form.Control isInvalid={!!errors.title} /> <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>` },
  12: { code: `// src/features/books/booksSlice.js
export const fetchBooks = createAsyncThunk('books/fetchAll', async () => /* api.getBooks() */ []);
const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], status: 'idle', error: null },
  reducers: { /* TODO ≥ 3, e.g. setFilter, toggleSelected, clearSelected */ },
  extraReducers: (b) => { /* pending / fulfilled / rejected */ },
});
export const selectBooks = (s) => s.books.items;
// component: const books = useSelector(selectBooks); const dispatch = useDispatch();
// useEffect(() => { dispatch(fetchBooks()); }, [dispatch]);` },
  13: { code: `src/
├─ utils/books.test.js            ← ≥ 5 unit tests (edge cases!)
├─ features/books/booksSlice.test.js
└─ pages/BooksPage.test.jsx       ← RTL: mock fetch/axios, findByText, userEvent

README.md
## Screenshots   ## Features (ticked)   ## Run   ## Test   ## Known limitations
Demo: https://<your-app>.vercel.app  (demo data mode — json-server does not run on static hosting)` },
};

/* ═══════════════════════════════ DỰNG BÀI MỐC ═══════════════════════════════ */
const ul = (arr, i) => `<ul>${arr.map((s) => `<li>${esc(L(s)[i] ?? L(s)[0])}</li>`).join('')}</ul>`;
const ol = (arr, i) => `<ol>${arr.map((s) => `<li>${esc(L(s)[i] ?? L(s)[0])}</li>`).join('')}</ol>`;

function mapTable(so, i) {
  const head = i === 0 ? ['Topic', 'What this milestone builds in it'] : ['Đề tài', 'Mốc này xây phần nào'];
  const rows = deTai.map((d) => {
    const m = d.banDoChuong.find((x) => x.moc === so);
    return `<tr><td>${esc(L(d.ten)[i])}</td><td>${m ? esc(L(m.dung)[i]) : '—'}</td></tr>`;
  }).join('');
  return `<div style="overflow-x:auto"><table><thead><tr><th>${head[0]}</th><th>${head[1]}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

const TXT = {
  en: { eyebrow: (n, c) => `Course project · Milestone ${n} of ${moc.length} · after ${c}`, req: '📌 Required', adv: '⭐ Optional extras', pass: '✅ Pass when', hint: '💡 Hints (open tier by tier)', map: '🗺 What it means for each suggested topic', demo: '🧩 Sample skeleton (a frame to start from — not a solution)', submit: '📤 Submit', submitTxt: (nop) => `Submit ${nop.map((x) => ({ repo: 'the link to your repo/commit', demo: 'a demo link or video', anh: 'a screenshot' }[x])).join(', ')} in the box below, add a short note (what was hard, what you skipped), then mark the milestone done.`, own: 'Own topic? Apply each requirement to your resources — the AI reviewer of your topic already checked that it fits.', tier: 'Tier' },
  vi: { eyebrow: (n, c) => `Dự án khoá học · Mốc ${n}/${moc.length} · sau ${c}`, req: '📌 Bắt buộc', adv: '⭐ Nâng cao (tuỳ chọn)', pass: '✅ Đạt khi', hint: '💡 Gợi ý (mở dần từng tầng)', map: '🗺 Mốc này với từng đề tài gợi ý', demo: '🧩 Khung mẫu (khung để bắt đầu — không phải lời giải)', submit: '📤 Nộp bài', submitTxt: (nop) => `Nộp ${nop.map((x) => ({ repo: 'link repo/commit', demo: 'link demo hoặc video', anh: 'ảnh chụp màn hình' }[x])).join(', ')} ở ô bên dưới, ghi chú ngắn (chỗ khó, phần bỏ qua), rồi đánh dấu xong mốc.`, own: 'Đề tài tự chọn? Áp từng yêu cầu vào tài nguyên của bạn — AI đã xét đề tài của bạn phủ đủ các mốc này.', tier: 'Tầng' },
};

function mocContent(m) {
  const side = (i) => {
    const k = i === 0 ? 'en' : 'vi';
    const t = TXT[k];
    const d = DEMO[m.so] || {};
    const hints = m.goiY.map((g, j) => `<details><summary>${t.tier} ${j + 1}</summary><p>${esc(L(g)[i].replace(/^Tier \d+: |^Tầng \d+: /, ''))}</p></details>`).join('\n');
    return [
      `<span class="eyebrow">${esc(t.eyebrow(m.so, L(m.sauChuong)[i]))}</span>`,
      `<h2>${esc(L(m.ten)[i])}</h2>`,
      `<p class="lead">${i === 0 ? 'Apply what this chapter taught to <b>your</b> project. Everything below is written for every topic — read “list” as your books, courses, appointments or tasks.' : 'Áp đúng kiến thức chương vừa học vào dự án <b>của bạn</b>. Mọi yêu cầu dưới đây viết chung cho mọi đề tài — "danh sách" là sách, khoá học, lịch hẹn hay công việc của bạn.'}</p>`,
      `<h3>${t.req}</h3>`, ol(m.yeuCau, i),
      m.nangCao?.length ? `<h3>${t.adv}</h3>${ul(m.nangCao, i)}` : '',
      `<h3>${t.pass}</h3>`, ul(m.datKhi, i),
      `<h3>${t.demo}</h3>`,
      d.khung ? pre(d.khung, 'plaintext') : '',
      d.code ? pre(d.code, d.lang || 'javascript') : '',
      `<h3>${t.hint}</h3>`, hints,
      `<h3>${t.map}</h3>`, mapTable(m.so, i), `<p><i>${t.own}</i></p>`,
      `<h3>${t.submit}</h3>`, `<p>${t.submitTxt(m.nop)}</p>`,
    ].filter(Boolean).join('\n');
  };
  return bi(side(0), side(1));
}

const mocLesson = (m) => ({
  title: `🛠 Project milestone ${m.so} — ${L(m.ten)[0]}|||🛠 Mốc dự án ${m.so} — ${L(m.ten)[1]}`,
  slug: m.slug,
  type: 'EXERCISE',
  mocDuAn: m.so,
  description: `Mốc dự án ${m.so}/${moc.length}: ${L(m.ten)[1]}. Áp kiến thức ${L(m.sauChuong)[1]} vào đề tài đã chọn — yêu cầu bắt buộc, nâng cao, "Đạt khi", khung mẫu, gợi ý theo tầng, nộp link repo + ảnh.`,
  content: mocContent(m),
});

const CHUONG = { 1: 'ch1', 2: 'ch2', 3: 'ch3', 4: 'ch4', 5: 'ch5', 6: 'ch6', 7: 'ch7', 8: 'ch8', 9: 'ch9', 10: 'ch10', 11: 'ch11', 12: 'ch12', 13: 'a2' };
export const mocBai = Object.fromEntries(moc.map((m) => [CHUONG[m.so], [mocLesson(m)]]));

/* ═══════════════════════════════ BÀI BẢO VỆ ═══════════════════════════════ */
function baoVeContent() {
  const side = (i) => {
    const rubric = `<div style="overflow-x:auto"><table><thead><tr><th>${i === 0 ? 'Criterion' : 'Tiêu chí'}</th><th>${i === 0 ? 'Points' : 'Điểm'}</th><th>${i === 0 ? 'What the panel looks for' : 'Hội đồng nhìn vào'}</th></tr></thead><tbody>${baoVe.rubric.map((r) => `<tr><td>${esc(L(r.tieuChi)[i])}</td><td>${String(r.diem).replace('.', i === 0 ? '.' : ',')}</td><td>${esc(L(r.moTa)[i])}</td></tr>`).join('')}<tr><td><b>${i === 0 ? 'Total' : 'Tổng'}</b></td><td><b>10</b></td><td></td></tr></tbody></table></div>`;
    return [
      `<span class="eyebrow">${i === 0 ? 'Course project · Final step' : 'Dự án khoá học · Bước cuối'}</span>`,
      `<h2>${i === 0 ? '🎓 Finish & defend your project' : '🎓 Hoàn thiện & bảo vệ dự án'}</h2>`,
      `<p class="lead">${i === 0 ? 'Thirteen milestones later your app is almost done. This lesson is the last mile: close the gaps, rehearse, then face a panel-style oral defence about <b>your own code</b> — the same shape as the FER202 assignment defence and the oral part of the PE.' : 'Sau mười ba mốc, app của bạn gần xong. Bài này là chặng cuối: lấp chỗ thiếu, tập dượt, rồi vào buổi vấn đáp kiểu hội đồng về <b>chính code của bạn</b> — đúng dạng bảo vệ assignment FER202 và phần vấn đáp của PE.'}</p>`,
      `<h3>${i === 0 ? '1 · Finish — the submission checklist' : '1 · Hoàn thiện — checklist nộp bài'}</h3>`,
      ul(baoVe.chuanBi, i),
      `<h3>${i === 0 ? '2 · How you are graded (10 points)' : '2 · Chấm thế nào (10 điểm)'}</h3>`, rubric,
      `<div class="callout">${i === 0 ? 'Below 5/10 or unable to explain your own code ⇒ “Needs work”: fix the weakest rubric line and book another session. Features you cannot explain are counted as not done.' : 'Dưới 5/10 hoặc không giải thích được code của mình ⇒ "Cần làm thêm": sửa dòng rubric yếu nhất rồi đặt buổi khác. Tính năng không giải thích được thì tính là chưa làm.'}</div>`,
      `<h3>${i === 0 ? `3 · Questions the panel often asks (${baoVe.cauHoiMau.length})` : `3 · Câu hội đồng hay hỏi (${baoVe.cauHoiMau.length})`}</h3>`,
      `<p>${i === 0 ? 'Answer each out loud, pointing at the exact file and line. They follow the V10 “Oral defence Q&amp;A” of the Fall26 PE: data flow, why this API/hook, “what if the requirement changes”, and how you worked.' : 'Trả lời to từng câu, chỉ đúng tệp và dòng. Chúng theo V10 "Hỏi–đáp vấn đáp" của đề PE Fall26: luồng dữ liệu, vì sao chọn API/hook này, "nếu yêu cầu đổi thì sao", và cách bạn đã làm.'}</p>`,
      ol(baoVe.cauHoiMau, i),
      `<h3>${i === 0 ? '4 · The AI defence room' : '4 · Phòng bảo vệ AI'}</h3>`,
      `<p>${i === 0 ? 'Below this lesson: submit your repo + demo, then start a defence session. The AI panel reads your topic, your milestone notes and your README, asks 8–12 questions like the ones above (including one live change), scores you on the rubric and gives concrete feedback. Practise as many times as your daily limit allows; the best session is kept.' : 'Dưới bài này: nộp repo + demo, rồi bắt đầu một phiên bảo vệ. Hội đồng AI đọc đề tài, ghi chú các mốc và README của bạn, hỏi 8–12 câu giống các câu trên (có một yêu cầu sửa code tại chỗ), chấm theo rubric và trả nhận xét cụ thể. Luyện bao nhiêu lần tuỳ hạn mức mỗi ngày; giữ phiên tốt nhất.'}</p>`,
      `<div class="callout ok">${i === 0 ? 'Honesty rule: say which parts came from a tutorial or an AI assistant. Using help is allowed — not understanding the code you submit is not.' : 'Luật trung thực: nói rõ phần nào lấy từ hướng dẫn hay trợ lý AI. Được phép nhờ trợ giúp — không được phép nộp code mà mình không hiểu.'}</div>`,
      `<div class="di-toi"><a class="link-card" href="${KHOA}fer202-pefa26-10-hoi-dap"><span class="lc-ico">🎙️</span><span class="lc-body"><span class="lc-title">${i === 0 ? 'PE Fall26 · V10 — Oral defence Q&amp;A' : 'Đề PE Fall26 · V10 — Hỏi–đáp vấn đáp'}</span><span class="lc-sub">${i === 0 ? 'Watch how the panel questions a solution.' : 'Xem hội đồng hỏi một bài làm thế nào.'}</span></span><span class="lc-cta">${i === 0 ? 'WATCH →' : 'XEM →'}</span></a></div>`,
    ].join('\n');
  };
  return bi(side(0), side(1));
}

export const baoVeBai = {
  title: '🎓 Course project — finish & defend (rubric, panel questions, AI defence room)|||🎓 Dự án cuối khoá — hoàn thiện & bảo vệ (rubric, câu hội đồng, phòng bảo vệ AI)',
  slug: 'fer202-bao-ve-du-an',
  type: 'EXERCISE',
  baoVeDuAn: true,
  description: 'Bước cuối của dự án xuyên suốt khoá: checklist nộp (README, chạy được, demo, test), rubric 10 điểm, 24 câu hội đồng hay hỏi kiểu V10 PE Fall26, và phòng bảo vệ AI chấm theo rubric.',
  content: baoVeContent(),
};

/* ═════════════════════ LỜI MỜI ĐĂNG KÝ (nối vào cuối bài 0.1) ═════════════════════ */
export const moiDangKy = '\n' + bi(
  `<h3>🎯 Your course project starts today</h3>
<p>Instead of a pile of disconnected exercises, you will build <b>one real React app</b> through the whole course — a course marketplace like cuongthai.com, a library, a clinic booking app, a sneaker shop, a lecturer–subject manager like the Fall26 PE, a team task board, an attendance system… or your own idea. After every chapter a <b>🛠 Project milestone</b> lesson tells you exactly what to add with what you just learned; at the end you finish it and <b>defend</b> it like the real assignment, with a 10-point rubric.</p>
<p><b>Register your course project topic below.</b></p>`,
  `<h3>🎯 Dự án cuối khoá bắt đầu từ hôm nay</h3>
<p>Thay vì một đống bài tập rời rạc, bạn sẽ xây <b>một app React thật</b> suốt cả khoá — web bán khoá học kiểu cuongthai.com, quản lý thư viện, đặt lịch phòng khám, shop sneaker, quản lý giảng viên – môn học như đề PE Fall26, bảng công việc nhóm, điểm danh lớp học… hoặc ý tưởng của riêng bạn. Sau mỗi chương có một bài <b>🛠 Mốc dự án</b> nói rõ cần thêm gì bằng kiến thức vừa học; cuối khoá bạn hoàn thiện và <b>bảo vệ</b> nó như assignment thật, chấm theo rubric 10 điểm.</p>
<p><b>Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.</b></p>`,
) + '\n';
