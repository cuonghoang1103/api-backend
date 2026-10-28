/**
 * CodeLearn · F5 — ghi danh khoá học (không trùng, khách ⇒ đăng nhập trước, admin không ghi danh) + trang My Courses.
 */
import { doiDau } from './_chung.mjs';
import { B, DANG_NHAP, DB, banInF, bang, click, cho, dn, moduleF } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>Let students join courses. The detail page gets an <b>enrol box</b>: guests are sent to log in first (and come back), students enrol with one click, enrolled students see "Go to course", admins only see a note. Enrolling creates one row in <code>enrollments</code> with an empty progress array. A new protected page <code>/my-courses</code> lists the courses of the logged-in student using <code>_expand=course</code>.</p>
<h3>API calls</h3>${bang(['When', 'Request'], [
    ['open a detail page / My Courses (student)', '<code>GET /enrollments?userId=2&amp;_expand=course&amp;_sort=enrolledAt&amp;_order=desc</code>'],
    ['click Enroll — check first', '<code>GET /enrollments?userId=2&amp;courseId=4</code> (already there ⇒ do not post)'],
    ['click Enroll — create', '<code>POST /enrollments</code> <code>{ userId, courseId, enrolledAt: "yyyy-mm-dd", completedLessons: [] }</code>'],
  ])}
<h3>Edge cases</h3><ul><li>Double click / slow network ⇒ still exactly <b>one</b> enrolment (ignore the second click while the first is pending).</li><li>Log out, log in as someone else ⇒ the previous user's enrolments must not appear (reset the slice on <code>logout</code>).</li><li>A deleted course in <code>_expand</code> comes back <code>undefined</code> — do not crash.</li><li>No enrolments ⇒ <code>#no-enrollments</code> with a link to the catalogue.</li></ul>`,
  vi: `<p>Cho học viên ghi danh. Trang chi tiết có thêm <b>khối ghi danh</b>: khách bị đưa đi đăng nhập trước (rồi quay lại), học viên ghi danh bằng một cú bấm, người đã ghi danh thấy "Go to course", admin chỉ thấy một ghi chú. Ghi danh tạo một dòng trong <code>enrollments</code> với mảng tiến độ rỗng. Trang có bảo vệ mới <code>/my-courses</code> liệt kê khoá của học viên đang đăng nhập bằng <code>_expand=course</code>.</p>
<h3>Lời gọi API</h3>${bang(['Khi nào', 'Request'], [
    ['mở trang chi tiết / My Courses (học viên)', '<code>GET /enrollments?userId=2&amp;_expand=course&amp;_sort=enrolledAt&amp;_order=desc</code>'],
    ['bấm Enroll — kiểm trước', '<code>GET /enrollments?userId=2&amp;courseId=4</code> (đã có ⇒ không POST)'],
    ['bấm Enroll — tạo', '<code>POST /enrollments</code> <code>{ userId, courseId, enrolledAt: "yyyy-mm-dd", completedLessons: [] }</code>'],
  ])}
<h3>Trường hợp biên</h3><ul><li>Bấm đúp / mạng chậm ⇒ vẫn đúng <b>một</b> lượt ghi danh (bỏ qua cú bấm thứ hai khi lượt đầu đang chạy).</li><li>Đăng xuất rồi đăng nhập người khác ⇒ không được hiện khoá của người trước (đặt lại slice khi <code>logout</code>).</li><li>Khoá đã bị xoá thì <code>_expand</code> trả <code>undefined</code> — không được sập.</li><li>Chưa ghi danh khoá nào ⇒ <code>#no-enrollments</code> kèm link sang danh mục.</li></ul>`,
};

const BAN_IN = banInF({
  k: 5, phut: 90, moTa: MO_TA, bangDuLieu: ['enrollments'], soDong: 3,
  wireframe: `
/courses/4 — enrol box (#enroll-card)          /my-courses  (#my-courses-title "My Courses")
┌─────────────────────────────┐                ┌───────────────────────┐ ┌───────────────────────┐
│ 399.000 ₫      (#course-price)│                │ JavaScript Essentials │ │ React for Beginners   │ .my-course-title
│ guest  : [ Log in to enroll ]│ #enroll-btn    │ Enrolled on 10/09/2026│ │ Enrolled on 01/09/2026│ .my-course-enrolled
│ student: [   Enroll now     ]│ #enroll-btn    │ [Continue learning]   │ │ [Continue learning]   │ .btn-continue
│ enrolled:[  Go to course  ]  │ #continue-btn  └───────────────────────┘ └───────────────────────┘
│ admin  : "Admins manage …"   │ #admin-note    (none) ⇒ "You have not enrolled in any course yet." #no-enrollments
│ ✔ You are enrolled in …      │ #enroll-success
└─────────────────────────────┘`,
  chucNang: [
    { ten: { en: 'Enrol', vi: 'Ghi danh' }, diem: 3, yeuCau: [
      { en: 'Student, not enrolled ⇒ <code>#enroll-btn</code> "Enroll now" (disabled while sending). Success ⇒ the row is posted, the box switches to <code>#continue-btn</code> (link <code>/learn/:courseId</code>) and <code>#enroll-success</code> says "You are enrolled in &lt;title&gt;". Never two rows for the same user + course.', vi: 'Học viên chưa ghi danh ⇒ <code>#enroll-btn</code> "Enroll now" (khoá khi đang gửi). Thành công ⇒ POST, khối đổi sang <code>#continue-btn</code> (link <code>/learn/:courseId</code>) và <code>#enroll-success</code> ghi "You are enrolled in &lt;tên khoá&gt;". Không bao giờ hai dòng cho cùng người + khoá.' },
    ], hook: ['createAsyncThunk (condition)', 'unwrap()'], viDu: 'an@codelearn.vn on /courses/4 ⇒ POST /enrollments { userId: 2, courseId: 4, completedLessons: [] }' },
    { ten: { en: 'Guest, admin & already enrolled', vi: 'Khách, admin & đã ghi danh' }, diem: 2, yeuCau: [
      { en: 'Guest ⇒ <code>#enroll-btn</code> "Log in to enroll" → <code>/login</code> with <code>state.from</code> ⇒ back on the same course after login. Already enrolled ⇒ <code>#continue-btn</code>. Admin ⇒ <code>#admin-note</code>, no enrol button.', vi: 'Khách ⇒ <code>#enroll-btn</code> "Log in to enroll" → <code>/login</code> kèm <code>state.from</code> ⇒ đăng nhập xong quay lại đúng khoá. Đã ghi danh ⇒ <code>#continue-btn</code>. Admin ⇒ <code>#admin-note</code>, không có nút ghi danh.' },
    ] },
    { ten: { en: 'My Courses page', vi: 'Trang My Courses' }, diem: 3, yeuCau: [
      { en: 'Protected route <code>/my-courses</code>; navbar link <code>#nav-my-courses</code> for students. One <code>.my-course</code> card per enrolment, newest first: <code>.my-course-title</code>, <code>.my-course-enrolled</code> "Enrolled on dd/mm/yyyy", <code>.btn-continue</code> → <code>/learn/:courseId</code>. Empty ⇒ <code>#no-enrollments</code>.', vi: 'Route có bảo vệ <code>/my-courses</code>; link navbar <code>#nav-my-courses</code> cho học viên. Mỗi lượt ghi danh một thẻ <code>.my-course</code>, mới nhất trước: <code>.my-course-title</code>, <code>.my-course-enrolled</code> "Enrolled on dd/mm/yyyy", <code>.btn-continue</code> → <code>/learn/:courseId</code>. Rỗng ⇒ <code>#no-enrollments</code>.' },
    ], hook: ['_expand=course', 'ProtectedRoute'] },
    { ten: { en: 'Redux slice', vi: 'Slice Redux' }, diem: 2, yeuCau: [
      { en: '<code>features/enrollments/enrollmentsSlice.js</code>: <code>fetchMyEnrollments(userId)</code>, <code>enrollCourse({ userId, courseId })</code>, <code>{ items, status, error, enrollStatus }</code>, selector <code>selectEnrollmentByCourse</code>; <code>logout</code> resets it.', vi: '<code>features/enrollments/enrollmentsSlice.js</code>: <code>fetchMyEnrollments(userId)</code>, <code>enrollCourse({ userId, courseId })</code>, <code>{ items, status, error, enrollStatus }</code>, selector <code>selectEnrollmentByCourse</code>; <code>logout</code> đặt lại slice.' },
    ], hook: ['extraReducers', 'addCase(logout)'] },
  ],
  idBatBuoc: [
    ['#enroll-card #enroll-btn #continue-btn #enroll-success #enroll-error #admin-note', { en: 'enrol box on /courses/:id', vi: 'khối ghi danh ở /courses/:id' }],
    ['#nav-my-courses · #my-courses-title · .my-course#my-course-COURSEID .my-course-title .my-course-enrolled .btn-continue · #no-enrollments', { en: 'My Courses', vi: 'My Courses' }],
  ],
  truDiem: [
    { en: 'Checking "already enrolled" only in the UI ⇒ duplicates after a double click or with two tabs.', vi: 'Chỉ kiểm "đã ghi danh" trên giao diện ⇒ trùng khi bấm đúp hoặc mở hai tab.' },
    { en: 'Showing every enrolment of every user on My Courses (forgot <code>?userId=</code>).', vi: 'My Courses hiện mọi lượt ghi danh của mọi người (quên <code>?userId=</code>).' },
  ],
});

const KIEM = [
  // f1 — enrol
  { nhom: 'f1', moTa: 'Student enrols in course 4 ⇒ row posted with empty progress', url: '/courses/4', khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'enrollments', chat: true, chua: { userId: 2, courseId: 4, completedLessons: [] }, truoc: [cho(), click('#enroll-btn'), cho()] },
  { nhom: 'f1', moTa: 'After enrolling: success message + "Go to course"', url: '/courses/4', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#continue-btn, #enroll-success', mongDoi: ['Go to course', 'You are enrolled in Node.js & Express REST APIs'], truoc: [cho(), click('#enroll-btn'), cho()] },
  { nhom: 'f1', moTa: 'Not enrolled ⇒ "Enroll now"', url: '/courses/4', khoCucBo: dn(2), kiem: 'text', selector: '#enroll-btn', giaTri: 'Enroll now' },
  { nhom: 'f1', an: true, moTa: 'Double click ⇒ still one new enrolment (7 rows)', url: '/courses/4', khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'enrollments', doDai: 7, truoc: [cho(), click('#enroll-btn', 2), cho(600)] },
  // f2 — guest / admin / enrolled
  { nhom: 'f2', moTa: 'Guest sees "Log in to enroll" and is sent to /login', url: '/courses/3', kiem: 'duong-dan', giaTri: '/login', truoc: [cho(), click('#enroll-btn'), cho(200)] },
  { nhom: 'f2', moTa: 'Guest button text', url: '/courses/3', kiem: 'text', selector: '#enroll-btn', giaTri: 'Log in to enroll' },
  { nhom: 'f2', moTa: 'Already enrolled ⇒ "Go to course" → /learn/1', url: '/courses/1', khoCucBo: dn(2), kiem: 'thuoc-tinh', selector: '#continue-btn', thuocTinh: 'href', khop: '/learn/1$' },
  { nhom: 'f2', an: true, moTa: 'After logging in the guest is back on the same course', url: '/courses/4', kiem: 'duong-dan', giaTri: '/courses/4', truoc: [cho(), click('#enroll-btn'), cho(200), ...DANG_NHAP('an@codelearn.vn', '123456'), cho()] },
  { nhom: 'f2', an: true, moTa: 'Admin sees a note, no enrol button', url: '/courses/1', khoCucBo: dn(1), kiem: 'danh-sach-text', selector: '#admin-note, #enroll-btn, #continue-btn', mongDoi: ['Admins manage courses and cannot enrol.'] },
  // f3 — My Courses
  { nhom: 'f3', moTa: 'My Courses: the student’s courses, newest first', url: '/my-courses', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.my-course-title', mongDoi: ['JavaScript Essentials', 'React for Beginners'] },
  { nhom: 'f3', moTa: 'Enrolment dates as dd/mm/yyyy', url: '/my-courses', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.my-course-enrolled', mongDoi: ['Enrolled on 10/09/2026', 'Enrolled on 01/09/2026'] },
  { nhom: 'f3', moTa: 'No enrolments ⇒ #no-enrollments', url: '/my-courses', khoCucBo: dn(2), jsonServer: { base: B, db: { ...DB, enrollments: [] } }, kiem: 'ton-tai', selector: '#no-enrollments' },
  { nhom: 'f3', moTa: 'Guest opening /my-courses ⇒ /login', url: '/my-courses', kiem: 'duong-dan', giaTri: '/login' },
  { nhom: 'f3', an: true, moTa: 'Navbar: students get "My Courses", admins do not', url: '/', khoCucBo: dn(1), kiem: 'khong-ton-tai', selector: '#nav-my-courses' },
  { nhom: 'f3', an: true, moTa: 'New enrolment appears first on My Courses', url: '/courses/4', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.my-course-title', mongDoi: ['Node.js & Express REST APIs', 'JavaScript Essentials', 'React for Beginners'], truoc: [cho(), click('#enroll-btn'), cho(), click('#nav-my-courses'), cho()] },
  { nhom: 'f3', an: true, moTa: '"Continue learning" links to /learn/:courseId', url: '/my-courses', khoCucBo: dn(2), kiem: 'thuoc-tinh', selector: '#my-course-3 .btn-continue', thuocTinh: 'href', khop: '/learn/3$' },
  // f4 — redux
  { nhom: 'f4', moTa: 'enrollmentsSlice uses createAsyncThunk', kiem: 'ma-nguon', tep: 'src/features/enrollments/enrollmentsSlice.js', khop: 'createAsyncThunk\\([\\s\\S]*createAsyncThunk\\(' },
  { nhom: 'f4', moTa: 'Enrolments requested for this user with _expand=course', url: '/my-courses', khoCucBo: dn(2), kiem: 'goi-fetch', khop: 'GET .*/enrollments\\?(?=.*userId=2)(?=.*_expand=course)' },
  { nhom: 'f4', an: true, moTa: 'Slice is reset on logout', kiem: 'ma-nguon', tep: 'src/features/enrollments/enrollmentsSlice.js', khop: 'logout' },
];

export default doiDau(moduleF({
  k: 5, phut: 90, banIn: BAN_IN, kiem: KIEM, url: '/courses/4',
  baiHoc: 'fer202-12-2-thunk-middleware',
  khaiNiem: ['POST with json-server', 'idempotent create (check before insert)', 'createAsyncThunk condition', 'unwrap()', '_expand', 'reset slice on logout'],
  viDu: [{ input: 'Guest clicks "Log in to enroll" on /courses/4, logs in as an@codelearn.vn', output: 'back on /courses/4 with "Enroll now"', explanation: 'The enrol button sends state.from just like ProtectedRoute does.|||Nút ghi danh gửi state.from giống ProtectedRoute.' }],
  thuatNgu: [{ en: 'idempotent', vi: 'làm nhiều lần cũng chỉ ra một kết quả (không tạo trùng)' }, { en: '_expand', vi: 'json-server: gắn bản ghi CHA (theo <cha>Id) vào kết quả' }, { en: 'unwrap()', vi: 'biến kết quả thunk thành Promise: lỗi thì ném ra để try/catch' }],
  goiY: [
    'enrollApi: <code>getByUser</code> (<code>params: { userId, _expand: "course", _sort: "enrolledAt", _order: "desc" }</code>), <code>find(userId, courseId)</code>, <code>create(e)</code>. Slice: thêm <code>enrollments</code> vào store.',
    'Chống trùng hai lớp: (1) thunk hỏi <code>find</code> trước, có rồi thì trả bản cũ; (2) tham số thứ ba của createAsyncThunk: <code>{ condition: (_, { getState }) =&gt; getState().enrollments.enrollStatus !== "loading" }</code> ⇒ cú bấm thứ hai không chạy.',
    'Khối ghi danh: <code>user?.role === "admin"</code> ⇒ ghi chú; <code>enrollment</code> có ⇒ Link "Go to course"; còn lại Button — khách thì <code>navigate("/login", { state: { from: location } })</code>. Reducer: <code>builder.addCase(logout, () =&gt; initialState)</code>.',
  ],
  loiHayGap: [
    'Chỉ ẩn nút sau khi ghi danh ⇒ bấm đúp kịp gửi hai POST ⇒ hai dòng trùng, tiến độ chia đôi.',
    'Gửi <code>courseId</code> lấy từ <code>useParams()</code> (chuỗi "4") ⇒ db lưu "4", lọc <code>?courseId=4</code> vẫn khớp nhưng so <code>=== 4</code> ở client thì không. Dùng <code>course.id</code> (số).',
    'Lấy <code>GET /enrollments</code> (không lọc userId) rồi lọc ở client ⇒ lộ dữ liệu của người khác, chậm khi nhiều dòng.',
    'Không đặt lại slice khi đăng xuất ⇒ đăng nhập tài khoản khác vẫn thấy "Go to course" của người trước trong chốc lát.',
    'Dùng <code>new Date().toISOString()</code> cho <code>enrolledAt</code> rồi hiện bằng <code>toLocaleDateString()</code> ⇒ lệch ngày theo múi giờ; lưu "yyyy-mm-dd" theo giờ máy và định dạng bằng cắt chuỗi.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> The enrolments slice owns everything about "my courses": <code>fetchMyEnrollments</code> asks the server for this user only (<code>_expand=course</code> brings the course title), <code>enrollCourse</code> is idempotent — it checks <code>GET /enrollments?userId&amp;courseId</code> before posting — and its <code>condition</code> option drops a second dispatch while the first is pending. The detail page derives its button from <code>selectEnrollmentByCourse</code>; guests are routed to <code>/login</code> with <code>state.from</code>. <code>unwrap()</code> lets the page show a success or error message for this click only. A <code>logout</code> case resets the slice so nothing leaks between accounts.</p>',
    vi: '<p><b>Hướng giải.</b> Slice enrollments giữ mọi thứ về "khoá của tôi": <code>fetchMyEnrollments</code> chỉ hỏi máy chủ của đúng người này (<code>_expand=course</code> mang tên khoá về), <code>enrollCourse</code> không tạo trùng — hỏi <code>GET /enrollments?userId&amp;courseId</code> trước khi POST — và tuỳ chọn <code>condition</code> bỏ lượt dispatch thứ hai khi lượt đầu đang chạy. Trang chi tiết suy ra nút từ <code>selectEnrollmentByCourse</code>; khách được đưa sang <code>/login</code> kèm <code>state.from</code>. <code>unwrap()</code> cho trang hiện thông báo thành công/lỗi của đúng cú bấm này. Case <code>logout</code> đặt lại slice để không rò dữ liệu giữa các tài khoản.</p>',
  },
}));
