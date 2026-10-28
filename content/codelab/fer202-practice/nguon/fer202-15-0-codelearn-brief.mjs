/**
 * FER202 · Chương 15 — Assignment cuối kỳ "CodeLearn" (mini LMS): ĐỀ TỔNG (bản in cả dự án) + starter khung CRA
 * + live demo bản hoàn chỉnh. Bộ kiểm = kiểm tích hợp trên app HOÀN CHỈNH, chấm theo 11 chức năng (thang 10).
 * Từng chức năng có module riêng 15.1 … 15.11 (mỗi cái thang 10, làm dần).
 */
import { doiDau } from './_chung.mjs';
import {
  B, DANG_NHAP, DB, KHOA_CL, MO_HINH, NOP, SLUG_F, TEN_F, TRU_DIEM_CHUNG, YEU_CAU_CHUNG, bang, click, cho, dbKhac, dn, doi, gui, khoiDau, nhap,
  phienBan, tests, tnChung, uuTien, veCay,
} from './_codelearn.mjs';

// ═════════════════════════════════════ BẢN IN ═════════════════════════════════════
const CAY_GHI_CHU = {
  'db.json': 'users · categories · courses · chapters · lessons · questions · enrollments · results',
  '.env': 'REACT_APP_API_URL=http://localhost:9999',
  'package.json': 'scripts: start · server · dev (concurrently)',
  'src/api': 'axiosClient + one file per resource group',
  'src/app/store.js': 'configureStore + persist session (store.subscribe)',
  'src/features': 'one slice per feature',
  'src/components': 'reusable UI: Layout, AppNavbar, ProtectedRoute, CourseCard…',
  'src/pages': 'one component per route',
  'src/pages/admin': 'admin area (nested routes under /admin)',
  'src/utils': 'pure helpers: validation, formatting, filtering, stats',
};
const CAY = veCay(Object.keys(phienBan(11)), CAY_GHI_CHU);

const WIREFRAME = `
┌─ Navbar ─────────────────────────────────────────────────────────────────────┐
│ 💻 CodeLearn   Home  Courses  My Courses  My Progress  [Admin]   Hi, An [Log out]│
└──────────────────────────────────────────────────────────────────────────────┘
/courses                                     /courses/:id
┌──────────────────────────────────────┐     ┌──────────────────────────┬───────────┐
│ [Search……] [Category▾][Level▾][Price▾][Sort▾]│     │ React for Beginners      │ Free      │
│ 9 courses found                      │     │ Frontend · Beginner · by │[Enroll now]│
│ ┌──────┐ ┌──────┐ ┌──────┐           │     │ Curriculum 5 lessons·62m │           │
│ │ RB   │ │ TP   │ │ FM   │  cards    │     │ ┌Chapter 1: Getting…───┐ │           │
│ │title │ │title │ │title │  3 / row  │     │ │ ▶ What is React? 8 min│ │           │
│ │Free ▸│ │299k ▸│ │349k ▸│           │     │ └──────────────────────┘ │           │
│ └──────┘ └──────┘ └──────┘           │     └──────────────────────────┴───────────┘
│        « 1 [2] »  (6 per page)       │
└──────────────────────────────────────┘
/learn/:courseId/lessons/:lessonId           /quiz/:chapterId
┌───────────────┬──────────────────────┐     ┌──────────────────────────────────────┐
│ ████░░ 60%    │ Lesson 4 of 5        │     │ Quiz: Getting Started with React     │
│ 3/5 completed │ Props vs State       │     │ 1. What does JSX compile to?         │
│ Chapter 1     │ ┌──────────────────┐ │     │   ( ) HTML  (•) createElement  ( )…  │
│  ✓ What is…   │ │  YouTube iframe  │ │     │ 2. …                                 │
│  ✓ Create…    │ └──────────────────┘ │     │ [Submit answers]                     │
│  📝 Chapter quiz│ lesson content…     │     │ You scored 3/3 (100%) — Passed 🎉    │
│ Chapter 2 …   │[← Prev][Mark as complete][Next →]│ └──────────────────────────────────────┘
└───────────────┴──────────────────────┘
/admin/*  (sidebar: Courses · Quiz questions · Users · Statistics)
┌────────────┬─────────────────────────────────────────────────────────────────┐
│ Courses    │ Courses                                          [+ Add course] │
│ Questions  │ # Title            Category Level  Price  Students Status  ⋯    │
│ Users      │ 1 React for Beg…   Frontend Beg.   Free   3        Published [Edit][Curriculum][Delete]│
│ Statistics │ 10 MongoDB Basics  Database Beg.   149k   0        Draft     …  │
└────────────┴─────────────────────────────────────────────────────────────────┘`;

const VAI_TRO = bang(
  ['Role', 'Can do', 'Cannot do'],
  [
    ['<b>Guest</b>', 'Home, course list (filter/search/sort/paginate), course detail, register, log in', 'enrol, learn, quiz, progress, admin'],
    ['<b>Student</b>', 'everything a guest can + enrol, My Courses, learn lessons, mark complete, chapter quizzes, My Progress', 'admin pages (403), drafts (404)'],
    ['<b>Admin</b>', 'CRUD courses / chapters / lessons / quiz questions, manage users (lock, role, delete), statistics; sees drafts', 'enrol (admin view only); lock/demote/delete <i>own</i> account'],
  ],
);
const VAI_TRO_VI = bang(
  ['Vai trò', 'Được làm', 'Không được'],
  [
    ['<b>Khách</b>', 'Trang chủ, danh sách khoá (lọc/tìm/sắp/phân trang), chi tiết khoá, đăng ký tài khoản, đăng nhập', 'ghi danh, học, quiz, tiến độ, admin'],
    ['<b>Học viên</b>', 'mọi thứ của khách + ghi danh, My Courses, học bài, đánh dấu hoàn thành, quiz chương, My Progress', 'trang admin (403), khoá nháp (404)'],
    ['<b>Admin</b>', 'CRUD khoá / chương / bài / câu hỏi quiz, quản lý người dùng (khoá, đổi vai trò, xoá), thống kê; thấy bản nháp', 'ghi danh (chỉ xem); tự khoá / tự hạ quyền / tự xoá <i>chính mình</i>'],
  ],
);

const ROUTES = bang(
  ['Route', 'Page', 'Access', 'F'],
  [
    ['<code>/</code>', 'HomePage', 'all', '1'],
    ['<code>/courses</code>', 'CoursesPage (<code>?category&amp;level&amp;price&amp;q&amp;sort&amp;page</code>)', 'all', '3'],
    ['<code>/courses/:id</code>', 'CourseDetailPage', 'all (drafts: admin)', '4–5'],
    ['<code>/login</code> · <code>/register</code>', 'LoginPage · RegisterPage', 'guest', '2'],
    ['<code>/my-courses</code>', 'MyCoursesPage', 'logged in', '5'],
    ['<code>/learn/:courseId</code> · <code>/learn/:courseId/lessons/:lessonId</code>', 'LearnPage', 'enrolled student', '6'],
    ['<code>/quiz/:chapterId</code>', 'QuizPage', 'enrolled student', '7'],
    ['<code>/progress</code>', 'ProgressPage', 'logged in', '8'],
    ['<code>/admin/courses</code> · <code>/new</code> · <code>/:id/edit</code> · <code>/:id/curriculum</code>', 'Admin course pages', 'admin', '9'],
    ['<code>/admin/questions</code> · <code>/admin/users</code>', 'AdminQuestionsPage · AdminUsersPage', 'admin', '10'],
    ['<code>/admin/stats</code>', 'AdminStatsPage', 'admin', '11'],
    ['<code>*</code>', 'NotFoundPage (404)', 'all', '1'],
  ],
);

const TIEU_CHI = (vi) => bang(
  vi ? ['Tiêu chí (cách GV FPT chấm)', 'Tỉ trọng', 'Giảng viên nhìn gì'] : ['Criterion (how FPT lecturers grade)', 'Weight', 'What the lecturer looks at'],
  vi ? [
    ['Chức năng chạy đúng', '50%', 'demo từng chức năng theo kịch bản; dữ liệu đúng sau khi tải lại trang (json-server)'],
    ['Cấu trúc code', '15%', 'đúng cây thư mục; api/ tách khỏi component; component nhỏ, đặt tên rõ; không lặp code'],
    ['Dùng Redux', '10%', 'slice theo tính năng, createAsyncThunk có pending/fulfilled/rejected, selector, không sửa state trực tiếp'],
    ['Routing &amp; bảo vệ', '10%', 'route lồng, tham số URL, 404, chặn theo đăng nhập/vai trò, quay về trang cũ sau đăng nhập'],
    ['Giao diện / UX', '10%', 'React-Bootstrap gọn, đáp ứng; trạng thái đang tải / rỗng / lỗi; thông báo thành công'],
    ['Kiểm dữ liệu (validation)', '5%', 'lỗi theo từng ô, không gửi API khi dữ liệu sai, chặn trùng'],
  ] : [
    ['Functionality', '50%', 'each function demoed from a script; data correct after a reload (json-server)'],
    ['Code structure', '15%', 'required folder tree; api/ separated from components; small, well-named components; no copy-paste'],
    ['Redux usage', '10%', 'one slice per feature, createAsyncThunk with pending/fulfilled/rejected, selectors, no state mutation'],
    ['Routing &amp; protection', '10%', 'nested routes, URL params, 404, guard by login/role, return to the wanted page after login'],
    ['UI / UX', '10%', 'clean responsive React-Bootstrap; loading / empty / error states; success feedback'],
    ['Validation', '5%', 'field-level messages, no API call with invalid data, no duplicates'],
  ],
);

const TAI_KHOAN = bang(['Role', 'Email', 'Password'], [['admin', 'admin@codelearn.vn', 'admin123'], ['student', 'an@codelearn.vn', '123456'], ['student (locked)', 'cuong@codelearn.vn', '123456']]);

const MO_TA = {
  en: `<p><b>CodeLearn</b> is an online programming-course platform (a mini LMS). Students find courses by category, level and price, enrol, learn lesson by lesson (YouTube video + notes), take a quiz at the end of every chapter and follow their progress. Administrators have full CRUD over courses, chapters, lessons and quiz questions, manage users and see enrolment statistics. The app is a <b>Create React App</b> project using <b>React Router</b>, <b>Redux Toolkit</b>, <b>Axios</b> and <b>React-Bootstrap</b>, with <b>json-server 0.17.4</b> as a fake REST back end.</p>
<h3>User roles</h3>${VAI_TRO}
<h3>Routes</h3>${ROUTES}
<h3>How this assignment is built here</h3><p>The project is split into <b>11 functions</b>. Each one is a separate exercise in this chapter (15.1 → 15.11) with its own brief, auto-graded checks (10 marks) and hints; the starter of F<i>k</i> is the reference code of F<i>k−1</i>, so you build the app incrementally — exactly the order you would code it. <b>This page</b> is the whole-project brief: its checks grade the <b>finished</b> app across all 11 functions. Reference code unlocks only after you pass (Accepted).</p>
<h3>Grading criteria (lecturer view)</h3>${TIEU_CHI(false)}
<h3>Demo accounts</h3>${TAI_KHOAN}`,
  vi: `<p><b>CodeLearn</b> là nền tảng học lập trình trực tuyến (mini LMS). Học viên tìm khoá theo danh mục, cấp độ, giá; đăng ký; học từng bài (video YouTube + nội dung); làm quiz cuối mỗi chương và theo dõi tiến độ. Quản trị viên có CRUD đầy đủ khoá học, chương, bài học, câu hỏi quiz; quản lý người dùng và xem thống kê lượt đăng ký. Ứng dụng là dự án <b>Create React App</b> dùng <b>React Router</b>, <b>Redux Toolkit</b>, <b>Axios</b>, <b>React-Bootstrap</b>, với <b>json-server 0.17.4</b> làm back end REST giả.</p>
<h3>Vai trò người dùng</h3>${VAI_TRO_VI}
<h3>Các route</h3>${ROUTES}
<h3>Cách làm assignment này ở đây</h3><p>Dự án chia thành <b>11 chức năng</b>. Mỗi chức năng là một bài riêng trong chương này (15.1 → 15.11), có đề, bộ chấm tự động (thang 10) và gợi ý; starter của F<i>k</i> là lời giải F<i>k−1</i> ⇒ bạn dựng app từng bước — đúng thứ tự nên code. <b>Trang này</b> là đề tổng của cả dự án: bộ kiểm chấm app <b>hoàn chỉnh</b> trên cả 11 chức năng. Lời giải tham chiếu chỉ mở sau khi bạn đạt (Accepted).</p>
<h3>Tiêu chí chấm (góc nhìn giảng viên)</h3>${TIEU_CHI(true)}
<h3>Tài khoản demo</h3>${TAI_KHOAN}`,
};

const CN = (k, diem, en, vi, hook) => ({ ten: TEN_F[k], diem, yeuCau: [{ en, vi }], hook, ...(k === 3 ? { viDu: '/courses?category=1&level=Intermediate  ⇒  "1 course found" (TypeScript in Practice)' } : {}) });

const BAN_IN = {
  tieuDe: { en: 'CODELEARN — ONLINE PROGRAMMING COURSES (MINI LMS)', vi: 'CODELEARN — NỀN TẢNG HỌC LẬP TRÌNH TRỰC TUYẾN (MINI LMS)' },
  phu: {
    en: 'FER202 final assignment · ReactJS (CRA) · React Router · Redux Toolkit · Axios · React-Bootstrap · JSON Server · 11 functions · Total: 10 marks',
    vi: 'Assignment cuối kỳ FER202 · ReactJS (CRA) · React Router · Redux Toolkit · Axios · React-Bootstrap · JSON Server · 11 chức năng · Tổng: 10 điểm',
  },
  moTa: MO_TA,
  chucNangChinh: TEN_F.slice(1).map((t, i) => ({ en: `F${i + 1} — ${t.en}`, vi: `F${i + 1} — ${t.vi}` })),
  yeuCauChung: [
    { en: 'Create the project with <code>npx create-react-app codelearn</code>, then <code>npm i react@18 react-dom@18</code> (CRA now installs React 19 → peer-dependency conflicts) and <code>npm i react-router-dom@6 @reduxjs/toolkit react-redux axios react-bootstrap bootstrap</code>, <code>npm i -D json-server@0.17.4 concurrently</code>.', vi: 'Tạo dự án bằng <code>npx create-react-app codelearn</code>, rồi <code>npm i react@18 react-dom@18</code> (CRA giờ cài React 19 ⇒ xung đột peer) và <code>npm i react-router-dom@6 @reduxjs/toolkit react-redux axios react-bootstrap bootstrap</code>, <code>npm i -D json-server@0.17.4 concurrently</code>.' },
    { en: '<code>npm run dev</code> starts json-server (port 9999, <code>db.json</code>) and React (port 3000) together; <code>.env</code> holds <code>REACT_APP_API_URL</code> (restart <code>npm start</code> after editing it).', vi: '<code>npm run dev</code> chạy cùng lúc json-server (cổng 9999, <code>db.json</code>) và React (cổng 3000); <code>.env</code> chứa <code>REACT_APP_API_URL</code> (sửa .env thì chạy lại <code>npm start</code>).' },
    ...YEU_CAU_CHUNG,
    { en: 'Redux: one slice per feature (<code>auth</code>, <code>courses</code>, <code>enrollments</code>, <code>quiz</code>) with <code>createAsyncThunk</code>; page-local admin data may use component state + the api layer.', vi: 'Redux: mỗi tính năng một slice (<code>auth</code>, <code>courses</code>, <code>enrollments</code>, <code>quiz</code>) dùng <code>createAsyncThunk</code>; dữ liệu chỉ một trang admin dùng có thể để state component + tầng api.' },
  ],
  cayThuMuc: CAY,
  wireframe: WIREFRAME,
  moHinh: MO_HINH,
  duLieuMau: `{
  "courses": [{ "id": 1, "title": "React for Beginners", "categoryId": 1, "level": "Beginner", "price": 0,
                "instructor": "Hoang Cuong", "published": true, "createdAt": "2026-01-10", … }],
  "chapters": [{ "id": 1, "courseId": 1, "title": "Getting Started with React", "order": 1 }],
  "lessons": [{ "id": 1, "chapterId": 1, "courseId": 1, "order": 1, "title": "What is React?", "duration": 8,
                "videoUrl": "https://www.youtube.com/watch?v=SqcY0GlETPk", "content": "…" }],
  "questions": [{ "id": 1, "chapterId": 1, "courseId": 1, "content": "What does JSX compile to?",
                  "options": ["Plain HTML strings", "React.createElement() calls", "…", "…"], "answerIndex": 1 }],
  "enrollments": [{ "id": 1, "userId": 2, "courseId": 1, "enrolledAt": "2026-09-01", "completedLessons": [1, 2, 3] }],
  "results": [{ "id": 2, "userId": 2, "courseId": 1, "chapterId": 1, "score": 3, "total": 3, "percent": 100, "passed": true, … }]
}   // full seed (5 users · 4 categories · 10 courses · 8 chapters · 13 lessons · 13 questions · 6 enrolments · 4 results): db.json in the starter`,
  chucNang: [
    CN(1, 0.5, 'CRA + json-server 0.17.4 + concurrently scripts, <code>.env</code>, <code>axiosClient</code>; Layout (navbar, footer, <code>&lt;Outlet /&gt;</code>), Home, 404.', 'CRA + json-server 0.17.4 + script concurrently, <code>.env</code>, <code>axiosClient</code>; Layout (navbar, footer, <code>&lt;Outlet /&gt;</code>), trang chủ, 404.', ['Routes', 'Outlet', 'NavLink']),
    CN(2, 1, 'Login / register with validation, auth slice persisted in localStorage, protected + admin routes, return to the wanted page.', 'Đăng nhập / đăng ký có kiểm dữ liệu, slice auth lưu localStorage, route bảo vệ + route admin, quay lại trang định vào.', ['createAsyncThunk', 'Navigate', 'useLocation']),
    CN(3, 1.5, 'Published courses as cards; filter by category / level / price, search, sort, 6 per page — all kept in the URL.', 'Khoá đã xuất bản dạng thẻ; lọc danh mục / cấp độ / giá, tìm, sắp xếp, 6 khoá/trang — tất cả nằm trên URL.', ['useSearchParams', 'useMemo', 'useSelector']),
    CN(4, 0.75, 'Course detail with chapters ▸ lessons via <code>_embed</code>; drafts and unknown ids ⇒ "Course not found".', 'Chi tiết khoá với chương ▸ bài qua <code>_embed</code>; bản nháp và id lạ ⇒ "Course not found".', ['useParams', '_embed']),
    CN(5, 0.75, 'Enrol (no duplicates, guest ⇒ login first), My Courses with <code>_expand=course</code>.', 'Ghi danh (không trùng, khách ⇒ đăng nhập trước), My Courses với <code>_expand=course</code>.', ['_expand', 'unwrap()']),
    CN(6, 1.25, 'Learn page: resume lesson, YouTube embed, mark complete (PATCH), progress %, previous / next, enrolled only.', 'Trang học: học tiếp, nhúng YouTube, đánh dấu hoàn thành (PATCH), tiến độ %, trước / sau, chỉ người đã ghi danh.', ['PATCH', 'ProgressBar']),
    CN(7, 1.25, 'Chapter quiz: answer all, score ≥ 70% passes, review right/wrong + explanation, save to <code>results</code>, retake.', 'Quiz chương: trả lời hết, ≥ 70% là đạt, xem lại đúng/sai + giải thích, lưu vào <code>results</code>, làm lại.', ['answers map', 'POST /results']),
    CN(8, 0.5, 'My Progress: totals, per-course progress + best quiz, quiz history.', 'My Progress: số tổng, tiến độ từng khoá + quiz tốt nhất, lịch sử quiz.', ['derived data']),
    CN(9, 1.25, 'Admin CRUD courses (validated, unique title, no delete with students) + chapters / lessons per course.', 'Admin CRUD khoá học (kiểm dữ liệu, tên không trùng, không xoá khi đã có học viên) + chương / bài của từng khoá.', ['nested routes', 'controlled form']),
    CN(10, 0.75, 'Admin CRUD quiz questions (4 distinct options, one answer) + users (search, lock, role, delete; never yourself).', 'Admin CRUD câu hỏi quiz (4 phương án khác nhau, một đáp án) + người dùng (tìm, khoá, vai trò, xoá; không tự hại mình).', ['PUT / PATCH / DELETE']),
    CN(11, 0.5, 'Statistics: totals, revenue, pass rate, top courses, SVG bar charts by course / month / category.', 'Thống kê: số tổng, doanh thu, tỉ lệ đạt, top khoá, biểu đồ cột SVG theo khoá / tháng / danh mục.', ['reduce', 'SVG']),
  ],
  idBatBuoc: [
    ['#brand #nav-home #nav-courses #nav-my-courses #nav-progress #nav-admin #nav-login #nav-register #nav-user #logout-btn', { en: 'navbar (links appear by role)', vi: 'thanh điều hướng (link hiện theo vai trò)' }],
    ['#home-title · #not-found #back-home · #footer', { en: 'home, 404, footer', vi: 'trang chủ, 404, footer' }],
    ['#login-form #email #password #login-error · #register-form #fullName #confirmPassword #register-error · #&lt;field&gt;-error', { en: 'auth forms and field errors', vi: 'form đăng nhập/đăng ký và lỗi từng ô' }],
    ['#forbidden', { en: '403 for a non-admin on /admin/*', vi: '403 khi người không phải admin vào /admin/*' }],
    ['#search #filter-category #filter-level #filter-price #sort #clear-filters #result-count #no-results #pagination #page-N #courses-loading #courses-error #retry', { en: 'course list', vi: 'danh sách khoá' }],
    ['.course-card#course-ID .course-title .course-category .course-level .course-price .course-instructor .btn-detail', { en: 'course card', vi: 'thẻ khoá học' }],
    ['#course-title #course-meta #course-price #lesson-count .chapter .chapter-title .lesson-item #no-content #course-not-found', { en: 'course detail', vi: 'chi tiết khoá' }],
    ['#enroll-btn #continue-btn #enroll-success #admin-note · .my-course .my-course-title .my-course-progress .btn-continue #no-enrollments', { en: 'enrol + My Courses', vi: 'ghi danh + My Courses' }],
    ['#lesson-title #lesson-video #lesson-content #mark-complete #prev-lesson #next-lesson #progress-bar #progress-text .lesson-link(.done) #course-complete #not-enrolled .chapter-quiz', { en: 'learn page', vi: 'trang học' }],
    ['#quiz-title .question(.correct|.incorrect) #qQID-oN #submit-quiz #quiz-error #quiz-result #retake-quiz .explanation #no-questions', { en: 'quiz', vi: 'quiz' }],
    ['#stat-enrolled #stat-completed #stat-lessons #stat-quizzes #stat-avg .progress-row .quiz-row', { en: 'My Progress', vi: 'My Progress' }],
    ['#admin-courses-table .admin-course-row #add-course .btn-edit .btn-curriculum .btn-delete #admin-success #admin-error · #course-form #title … #save-course', { en: 'admin courses', vi: 'admin khoá học' }],
    ['#chapter-form #chapter-title #lesson-form #lesson-chapter #lesson-title #lesson-video #lesson-duration #lesson-content #save-lesson', { en: 'admin curriculum', vi: 'admin chương trình học' }],
    ['#q-course #q-chapter #question-form #q-content #q-option-0..3 #q-answer · #user-search .admin-user-row .btn-toggle-lock .btn-toggle-role .btn-delete-user', { en: 'admin questions + users', vi: 'admin câu hỏi + người dùng' }],
    ['#stat-courses #stat-students #stat-enrollments #stat-revenue #stat-pass-rate .popular-row #chart-popular #chart-months #chart-categories rect.bar', { en: 'admin statistics', vi: 'admin thống kê' }],
  ],
  truDiem: [
    { en: 'Using json-server 1.x: <code>_expand</code>/<code>_embed</code> silently stop working.', vi: 'Dùng json-server 1.x: <code>_expand</code>/<code>_embed</code> âm thầm không chạy.' },
    { en: 'Protecting pages only by hiding navbar links — typing the URL still opens them.', vi: 'Chỉ "bảo vệ" bằng cách ẩn link trên navbar — gõ thẳng URL vẫn vào được.' },
    { en: 'Progress or quiz results kept only in React state — gone after F5.', vi: 'Tiến độ / kết quả quiz chỉ nằm trong state React — bấm F5 là mất.' },
    ...TRU_DIEM_CHUNG,
  ],
  nopBai: NOP,
};

// ═════════════════════════════════════ BỘ KIỂM (app hoàn chỉnh) ═════════════════════════════════════
const KIEM = [
  // f1
  { nhom: 'f1', moTa: 'Home page renders inside the layout', url: '/', kiem: 'text', selector: '#home-title', giaTri: 'Learn to code with CodeLearn' },
  { nhom: 'f1', moTa: 'Unknown URL ⇒ 404 page', url: '/no-such-page', kiem: 'text', selector: '#not-found', khop: '404[\\s\\S]*Page not found' },
  { nhom: 'f1', moTa: 'package.json: json-server 0.17.4 + "dev" script with concurrently', kiem: 'ma-nguon', tep: 'package.json', khop: '"json-server":\\s*"[~^]?0\\.17\\.4"[\\s\\S]*"dev":\\s*"concurrently|"dev":\\s*"concurrently[\\s\\S]*"json-server":\\s*"[~^]?0\\.17\\.4"' },
  { nhom: 'f1', an: true, moTa: 'axiosClient reads REACT_APP_API_URL', kiem: 'ma-nguon', tep: 'src/api/axiosClient.js', khop: 'process\\.env\\.REACT_APP_API_URL' },
  // f2
  { nhom: 'f2', moTa: 'Student logs in ⇒ "Hi, Nguyen Van An" in the navbar', url: '/login', kiem: 'text', selector: '#nav-user', giaTri: 'Hi, Nguyen Van An', truoc: DANG_NHAP('an@codelearn.vn', '123456') },
  { nhom: 'f2', moTa: 'Wrong password ⇒ "Invalid email or password"', url: '/login', kiem: 'text', selector: '#login-error', giaTri: 'Invalid email or password', truoc: DANG_NHAP('an@codelearn.vn', 'wrong-pass') },
  { nhom: 'f2', moTa: 'Guest opening /my-courses is sent to /login', url: '/my-courses', kiem: 'duong-dan', giaTri: '/login' },
  { nhom: 'f2', an: true, moTa: 'Student opening /admin/courses sees 403', url: '/admin/courses', khoCucBo: dn(2), kiem: 'ton-tai', selector: '#forbidden' },
  // f3
  { nhom: 'f3', moTa: '9 published courses, 6 cards on page 1', url: '/courses', kiem: 'text', selector: '#result-count', giaTri: '9 courses found' },
  { nhom: 'f3', moTa: 'Category Frontend + level Intermediate ⇒ TypeScript in Practice', url: '/courses?category=1&level=Intermediate', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['TypeScript in Practice'] },
  { nhom: 'f3', moTa: 'Search "react" (any case) ⇒ the two React courses', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['Advanced React Patterns', 'React for Beginners'], truoc: [cho(), nhap('#search', 'REACT'), cho(200)] },
  { nhom: 'f3', an: true, moTa: 'Page 2 holds the 3 oldest courses', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['Advanced React Patterns', 'JavaScript Essentials', 'React for Beginners'], truoc: [cho(), click('#page-2'), cho(200)] },
  // f4
  { nhom: 'f4', moTa: 'Course 1: 3 chapters and 5 lessons', url: '/courses/1', kiem: 'danh-sach-text', selector: '.chapter-title', mongDoi: ['Chapter 1: Getting Started with React', 'Chapter 2: Components, Props & State', 'Chapter 3: Hooks in Practice'] },
  { nhom: 'f4', an: true, moTa: 'Draft course 10 ⇒ "Course not found" for guests', url: '/courses/10', kiem: 'text', selector: '#course-not-found', khop: 'Course not found' },
  // f5
  { nhom: 'f5', moTa: 'Student enrols in course 4 ⇒ saved on the server', url: '/courses/4', khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'enrollments', chua: { userId: 2, courseId: 4 }, truoc: [cho(), click('#enroll-btn'), cho()] },
  { nhom: 'f5', moTa: 'My Courses lists the student’s courses, newest first', url: '/my-courses', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.my-course-title', mongDoi: ['JavaScript Essentials', 'React for Beginners'] },
  // f6
  { nhom: 'f6', moTa: '/learn/1 resumes at the first unfinished lesson', url: '/learn/1', khoCucBo: dn(2), kiem: 'duong-dan', giaTri: '/learn/1/lessons/4' },
  { nhom: 'f6', moTa: 'Mark as complete ⇒ 4/5 lessons completed (80%)', url: '/learn/1/lessons/4', khoCucBo: dn(2), kiem: 'text', selector: '#progress-text', giaTri: '4/5 lessons completed (80%)', truoc: [cho(), click('#mark-complete'), cho()] },
  { nhom: 'f6', an: true, moTa: 'The video is a YouTube /embed/ iframe', url: '/learn/1/lessons/1', khoCucBo: dn(2), kiem: 'thuoc-tinh', selector: '#lesson-video', thuocTinh: 'src', giaTri: 'https://www.youtube.com/embed/SqcY0GlETPk' },
  // f7
  { nhom: 'f7', moTa: 'All correct ⇒ "You scored 3/3 (100%) — Passed"', url: '/quiz/1', khoCucBo: dn(2), kiem: 'text', selector: '#quiz-result', khop: '^You scored 3/3 \\(100%\\) — Passed', truoc: [cho(), click('#q1-o1'), click('#q2-o1'), click('#q3-o0'), gui('#quiz-form'), cho()] },
  { nhom: 'f7', moTa: 'Submitting with no answers is refused', url: '/quiz/1', khoCucBo: dn(2), kiem: 'text', selector: '#quiz-error', khop: 'answer all questions', truoc: [cho(), gui('#quiz-form'), cho(200)] },
  { nhom: 'f7', an: true, moTa: 'The attempt is saved in results', url: '/quiz/1', khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'results', chua: { id: 5, userId: 2, chapterId: 1, score: 2, total: 3, passed: false }, truoc: [cho(), click('#q1-o1'), click('#q2-o0'), click('#q3-o0'), gui('#quiz-form'), cho()] },
  // f8
  { nhom: 'f8', moTa: 'My Progress totals for Nguyen Van An', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#stat-enrolled, #stat-completed, #stat-lessons, #stat-quizzes, #stat-avg', mongDoi: ['2', '0', '3', '1', '67%'] },
  // f9
  { nhom: 'f9', moTa: 'Admin course table shows all 10 courses incl. the draft', url: '/admin/courses', khoCucBo: dn(1), kiem: 'so-luong', selector: '.admin-course-row', giaTri: 10 },
  {
    nhom: 'f9', moTa: 'Admin adds a valid course ⇒ POST with numeric price', url: '/admin/courses/new', khoCucBo: dn(1), kiem: 'du-lieu-server', bang: 'courses', chat: true, chua: { title: 'Vue 3 Crash Course', price: 259000, categoryId: 1 },
    truoc: [cho(), nhap('#title', 'Vue 3 Crash Course'), doi('#categoryId', '1'), doi('#level', 'Beginner'), nhap('#price', '259000'), nhap('#instructor', 'Hoang Cuong'), nhap('#description', 'Composition API, components and Pinia from zero.'), gui('#course-form'), cho()],
  },
  { nhom: 'f9', an: true, moTa: 'Empty form ⇒ title error, nothing posted', url: '/admin/courses/new', khoCucBo: dn(1), kiem: 'text', selector: '#title-error', giaTri: 'Title must be between 5 and 100 characters', truoc: [cho(), gui('#course-form'), cho(200)] },
  // f10
  { nhom: 'f10', moTa: 'Admin locks Tran Thi Binh ⇒ active:false on the server', url: '/admin/users', khoCucBo: dn(1), kiem: 'du-lieu-server', bang: 'users', chua: { id: 3, active: false }, truoc: [cho(), click('#admin-user-3 .btn-toggle-lock'), cho()] },
  {
    nhom: 'f10', an: true, moTa: 'Admin adds a question with a numeric answerIndex', url: '/admin/questions', khoCucBo: dn(1), kiem: 'du-lieu-server', bang: 'questions', chat: true, chua: { chapterId: 2, courseId: 1, answerIndex: 2 },
    truoc: [cho(), doi('#q-course', '1'), cho(), doi('#q-chapter', '2'), cho(), nhap('#q-content', 'Which hook stores state in a function component?'), nhap('#q-option-0', 'useEffect'), nhap('#q-option-1', 'useRef'), nhap('#q-option-2', 'useState'), nhap('#q-option-3', 'useMemo'), doi('#q-answer', '2'), gui('#question-form'), cho()],
  },
  // f11
  { nhom: 'f11', moTa: 'Statistics: courses, students, enrolments, revenue, pass rate', url: '/admin/stats', khoCucBo: dn(1), kiem: 'danh-sach-text', selector: '#stat-courses, #stat-students, #stat-enrollments, #stat-revenue, #stat-pass-rate', mongDoi: ['10', '4', '6', '598.000 ₫', '50%'] },
  { nhom: 'f11', an: true, moTa: 'Most popular courses table', url: '/admin/stats', khoCucBo: dn(1), kiem: 'danh-sach-text', selector: '.popular-title', mongDoi: ['React for Beginners', 'JavaScript Essentials', 'Node.js & Express REST APIs', 'SQL Server for Developers'] },
];

export default doiDau({
  slug: SLUG_F[0],
  ten: '15.0 CodeLearn — Assignment brief, starter & live demo',
  khoa: KHOA_CL,
  baiHoc: 'fer202-12-1-redux-toolkit',
  de: [{
    dangBai: 'project',
    tieuDe: { en: 'CodeLearn — Assignment brief (whole project, 11 functions)', vi: 'CodeLearn — Đề tổng assignment (cả dự án, 11 chức năng)' },
    doKho: 'HARD',
    phut: 900,
    diem: 100,
    khaiNiem: ['Create React App', 'React Router v6 nested + protected routes', 'Redux Toolkit slices + createAsyncThunk', 'Axios api layer + .env', 'json-server 0.17 _expand/_embed', 'React-Bootstrap'],
    tienQuyet: ['FER202 chapters 9–12 (Router, json-server/axios, Redux Toolkit)'],
    the: ['fer202', 'assignment', 'codelearn', 'project'],
    banIn: BAN_IN,
    viDu: [
      { input: 'Guest opens /courses?category=1&level=Intermediate', output: '1 course found — TypeScript in Practice', explanation: 'Filters live in the URL, so the filtered list can be bookmarked and shared.|||Bộ lọc nằm trên URL nên danh sách đã lọc lưu/chia sẻ được.' },
      { input: 'an@codelearn.vn opens /learn/1', output: 'redirect to /learn/1/lessons/4 · "3/5 lessons completed (60%)"', explanation: 'Lessons 1–3 are done, so the app resumes at lesson 4.|||Bài 1–3 đã xong nên app học tiếp ở bài 4.' },
    ],
    thuatNgu: [
      { en: 'LMS (learning management system)', vi: 'hệ thống quản lý học tập' },
      { en: 'curriculum', vi: 'chương trình học (chương ▸ bài)' },
      { en: 'draft / published', vi: 'bản nháp / đã xuất bản' },
      { en: '_embed / _expand', vi: 'json-server 0.17: nhúng bản ghi con / mở rộng bản ghi cha vào kết quả' },
      { en: 'incremental build', vi: 'dựng dần: mỗi chức năng bắt đầu từ kết quả chức năng trước' },
      ...tnChung,
    ],
    goiY: [
      'Đừng làm đề tổng trước — làm lần lượt 15.1 → 15.11 (mỗi bài một chức năng, có kiểm riêng). Quay lại trang này khi đã xong cả 11 để chấm tích hợp.',
      'Thứ tự an toàn: F1 khung + route → F2 auth (mọi chức năng sau cần user) → F3/F4 phần khách → F5–F8 phần học viên → F9–F11 admin.',
      'Mỗi lần thêm trang: thêm route trong App.js + id/class đúng bảng "Element ids" — máy chấm dựa vào chúng.',
    ],
    loiHayGap: [
      'Cài json-server bản mới nhất (1.x) — <code>_expand</code>/<code>_embed</code> không còn, F4/F5/F8 hỏng mà không báo lỗi. Dùng đúng <code>json-server@0.17.4</code>.',
      'CRA kéo React 19 ⇒ <code>npm install</code> báo ERESOLVE với thư viện cũ. Cài lại <code>react@18 react-dom@18</code> ngay sau khi tạo dự án.',
      'Sửa <code>.env</code> mà không khởi động lại <code>npm start</code> ⇒ <code>REACT_APP_API_URL</code> vẫn undefined, mọi lời gọi ra "http://localhost:3000/undefined/…".',
      'So <code>course.id === id</code> với <code>id</code> lấy từ <code>useParams()</code> (CHUỖI) ⇒ luôn false. Dùng <code>Number(id)</code>.',
      'Chỉ ẩn link Admin trên navbar mà không chặn route ⇒ học viên gõ /admin/courses vẫn vào được.',
    ],
    giaiThich: {
      en: '<p>The reference app is organised exactly like the required tree: <code>src/api</code> (one axios client, functions that return <code>response.data</code>), four Redux slices with <code>createAsyncThunk</code>, presentational components, one page per route and pure helpers in <code>src/utils</code> (validation, formatting, filtering, progress, quiz scoring, statistics). Every number on screen is <b>derived</b> from server data, so a reload never loses progress. Read the per-function references (15.1–15.11) for the reasoning behind each step.</p>',
      vi: '<p>App tham chiếu sắp đúng cây thư mục yêu cầu: <code>src/api</code> (một axios client, hàm trả <code>response.data</code>), bốn slice Redux với <code>createAsyncThunk</code>, component trình bày, mỗi route một trang và hàm thuần trong <code>src/utils</code> (kiểm dữ liệu, định dạng, lọc, tiến độ, chấm quiz, thống kê). Mọi con số trên màn hình đều <b>suy ra</b> từ dữ liệu máy chủ nên tải lại trang không mất tiến độ. Đọc lời giải từng chức năng (15.1–15.11) để thấy lý do của từng bước.</p>',
    },
    tests: tests(KIEM, { loiGiaiSauKhiDat: true }),
    khoiDau: uuTien(khoiDau(0), 0),
    loiGiai: uuTien(phienBan(11), 0),
    demo: { tepChinh: 'src/index.js', url: '/', jsonServer: { base: B, db: DB } },
  }],
});
void dbKhac;
