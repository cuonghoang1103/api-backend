/**
 * CodeLearn · F9 — Admin: CRUD khoá học (form kiểm dữ liệu, tên không trùng, không xoá khoá đã có học viên)
 * + chương & bài học của từng khoá (route lồng dưới /admin).
 */
import { doiDau } from './_chung.mjs';
import { banInF, bang, click, cho, dn, doi, gui, moduleF, nhap } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>The admin area becomes real: a sidebar layout with nested routes, a table of <b>all</b> courses (drafts included), one form for both <b>create</b> and <b>edit</b>, a guarded <b>delete</b>, and a curriculum page per course to manage its chapters and lessons. All writes go to json-server; after saving, the public catalogue must show the change (mark it stale).</p>
<h3>Routes (nested under <code>/admin</code>, admin only)</h3>${bang(['Path', 'Page'], [['<code>/admin</code>', 'redirect to <code>/admin/courses</code> (index route)'], ['<code>/admin/courses</code>', 'AdminCoursesPage'], ['<code>/admin/courses/new</code> · <code>/admin/courses/:id/edit</code>', 'CourseFormPage (one component)'], ['<code>/admin/courses/:id/curriculum</code>', 'CurriculumPage']])}
<h3>API calls</h3>${bang(['Action', 'Request'], [
    ['list', '<code>GET /courses</code> (all) + <code>GET /categories</code> + <code>GET /enrollments</code> (student counts)'],
    ['create / edit', '<code>POST /courses</code> · <code>PATCH /courses/:id</code> — <code>categoryId</code>, <code>price</code> as <b>numbers</b>, <code>published</code> boolean, <code>createdAt</code> on create'],
    ['delete', '<code>GET /enrollments?courseId=</code> (any ⇒ refuse) → delete lessons/questions/chapters of the course → <code>DELETE /courses/:id</code>'],
    ['curriculum', '<code>GET /chapters?courseId=&amp;_embed=lessons</code> · <code>POST /chapters</code> · <code>DELETE /chapters/:id</code> · <code>POST /lessons</code> · <code>PATCH /lessons/:id</code> · <code>DELETE /lessons/:id</code>'],
  ])}
<h3>Validation (course form)</h3>${bang(['Field', 'Rule', 'Message (in <code>#&lt;field&gt;-error</code>)'], [
    ['title', '5–100 chars after trim; unique (case-insensitive, except itself)', 'Title must be between 5 and 100 characters · A course with this title already exists'],
    ['categoryId · level', 'required', 'Please choose a category · Please choose a level'],
    ['price', 'required; whole number 0 … 10,000,000', 'Price is required · Price must be a whole number between 0 and 10,000,000'],
    ['instructor', 'required', 'Instructor is required'],
    ['description', '≥ 20 chars', 'Description must be at least 20 characters'],
    ['thumbnail', 'optional; if given starts with http:// or https://', 'Thumbnail must be a valid http(s) URL'],
  ])}
<h3>Validation (curriculum)</h3><ul><li>Chapter title ≥ 3 chars and not already in the course ⇒ <code>#chapter-title-error</code>; new chapter <code>order</code> = max + 1.</li><li>Lesson: chapter required · title ≥ 3 · YouTube link (watch / youtu.be / embed) · duration whole 1–300 · content ≥ 10 ⇒ <code>#lesson-chapter-error</code>, <code>#lesson-title-error</code>, <code>#lesson-video-error</code>, <code>#lesson-duration-error</code>, <code>#lesson-content-error</code>; new lesson <code>order</code> = max in its chapter + 1.</li></ul>
<h3>Business rules &amp; edge cases</h3><ul><li>A course with enrolled students cannot be deleted: <code>#admin-error</code> "Cannot delete "…": N students are enrolled. Unpublish it instead." — nothing is removed.</li><li>Every delete asks <code>window.confirm</code>; Cancel ⇒ nothing happens.</li><li>Unknown id on the edit form ⇒ <code>#form-not-found</code>.</li></ul>`,
  vi: `<p>Khu quản trị thành thật: bố cục có sidebar với route lồng, bảng <b>mọi</b> khoá (cả bản nháp), một form dùng cho cả <b>thêm</b> và <b>sửa</b>, <b>xoá</b> có điều kiện, và trang chương trình học của từng khoá để quản lý chương và bài. Mọi thao tác ghi vào json-server; lưu xong thì danh mục công khai phải thấy thay đổi (đánh dấu dữ liệu cũ).</p>
<h3>Route (lồng dưới <code>/admin</code>, chỉ admin)</h3>${bang(['Đường dẫn', 'Trang'], [['<code>/admin</code>', 'chuyển sang <code>/admin/courses</code> (route index)'], ['<code>/admin/courses</code>', 'AdminCoursesPage'], ['<code>/admin/courses/new</code> · <code>/admin/courses/:id/edit</code>', 'CourseFormPage (một component)'], ['<code>/admin/courses/:id/curriculum</code>', 'CurriculumPage']])}
<h3>Lời gọi API</h3>${bang(['Việc', 'Request'], [
    ['danh sách', '<code>GET /courses</code> (tất cả) + <code>GET /categories</code> + <code>GET /enrollments</code> (đếm học viên)'],
    ['thêm / sửa', '<code>POST /courses</code> · <code>PATCH /courses/:id</code> — <code>categoryId</code>, <code>price</code> là <b>số</b>, <code>published</code> boolean, <code>createdAt</code> khi thêm'],
    ['xoá', '<code>GET /enrollments?courseId=</code> (có ⇒ từ chối) → xoá bài/câu hỏi/chương của khoá → <code>DELETE /courses/:id</code>'],
    ['chương trình học', '<code>GET /chapters?courseId=&amp;_embed=lessons</code> · <code>POST /chapters</code> · <code>DELETE /chapters/:id</code> · <code>POST /lessons</code> · <code>PATCH /lessons/:id</code> · <code>DELETE /lessons/:id</code>'],
  ])}
<h3>Kiểm dữ liệu (form khoá học)</h3>${bang(['Ô', 'Luật', 'Thông điệp (ở <code>#&lt;tên ô&gt;-error</code>)'], [
    ['title', '5–100 ký tự sau trim; không trùng (không phân biệt hoa/thường, trừ chính nó)', 'Title must be between 5 and 100 characters · A course with this title already exists'],
    ['categoryId · level', 'bắt buộc', 'Please choose a category · Please choose a level'],
    ['price', 'bắt buộc; số nguyên 0 … 10.000.000', 'Price is required · Price must be a whole number between 0 and 10,000,000'],
    ['instructor', 'bắt buộc', 'Instructor is required'],
    ['description', '≥ 20 ký tự', 'Description must be at least 20 characters'],
    ['thumbnail', 'tuỳ chọn; có thì bắt đầu bằng http:// hoặc https://', 'Thumbnail must be a valid http(s) URL'],
  ])}
<h3>Kiểm dữ liệu (chương trình học)</h3><ul><li>Tên chương ≥ 3 ký tự và chưa có trong khoá ⇒ <code>#chapter-title-error</code>; <code>order</code> chương mới = lớn nhất + 1.</li><li>Bài: bắt buộc chọn chương · tên ≥ 3 · link YouTube (watch / youtu.be / embed) · thời lượng nguyên 1–300 · nội dung ≥ 10 ⇒ <code>#lesson-chapter-error</code>, <code>#lesson-title-error</code>, <code>#lesson-video-error</code>, <code>#lesson-duration-error</code>, <code>#lesson-content-error</code>; <code>order</code> bài mới = lớn nhất trong chương + 1.</li></ul>
<h3>Luật nghiệp vụ &amp; trường hợp biên</h3><ul><li>Khoá đã có học viên thì không xoá được: <code>#admin-error</code> "Cannot delete "…": N students are enrolled. Unpublish it instead." — không xoá gì.</li><li>Mọi thao tác xoá hỏi <code>window.confirm</code>; bấm Huỷ ⇒ không làm gì.</li><li>Id lạ ở form sửa ⇒ <code>#form-not-found</code>.</li></ul>`,
};

const BAN_IN = banInF({
  k: 9, phut: 180, moTa: MO_TA,
  wireframe: `
/admin/courses                                                     [+ Add course] (#add-course)
┌──────────┬───────────────────────────────────────────────────────────────────────────────────┐
│ ADMIN    │ ✔ Course "Vue 3 Crash Course" was saved.                         (#admin-success)│
│ Courses  │ # Title              Category Level   Price     Students Status    Actions       │
│(#admin-nav-courses)│ 1 React for Beginners Frontend Beginner Free   3  Published [Edit][Curriculum][Delete]│
│          │ 10 MongoDB Basics    Database Beginner 149.000 ₫ 0 Draft     .btn-edit .btn-curriculum .btn-delete│
└──────────┴───────────────────────────────────────────────────────────────────────────────────┘
/admin/courses/new  &  /admin/courses/2/edit (#course-form)
 Title [__________]  Category [— Choose —▾]  Level [— Choose —▾]  Price (VND, 0 = free) [____]
 Instructor [______]  Description [________________]  Thumbnail URL [______]  [x] Published
 [Save course] (#save-course)  [Cancel]
/admin/courses/1/curriculum (#curriculum-title "Curriculum — React for Beginners")
 ┌ Chapter 1: Getting Started with React     [Delete] ┐   ┌ Add a lesson (#lesson-form) ───────┐
 │ What is React? · 8 min        [Edit] [Delete]      │   │ Chapter [▾] Title [___]             │
 └────────────────────────────────────────────────────┘   │ YouTube URL [___] Duration [__]     │
 [New chapter title______] [Add chapter] (#chapter-form)  │ Content [_____]   [Add lesson]      │`,
  chucNang: [
    { ten: { en: 'Admin layout & course table', vi: 'Bố cục admin & bảng khoá' }, diem: 1.5, yeuCau: [
      { en: '<code>AdminLayout</code>: sidebar (<code>#admin-nav-courses</code>) + <code>&lt;Outlet /&gt;</code>; index route ⇒ <code>/admin/courses</code>. <code>#admin-courses-table</code>: one <code>tr.admin-course-row#admin-course-&lt;id&gt;</code> per course with <code>.admin-course-title</code>, <code>.admin-course-price</code>, <code>.admin-course-students</code> (enrolment count), <code>.badge-status</code> Published/Draft, <code>.btn-edit</code>, <code>.btn-curriculum</code>, <code>.btn-delete</code>.', vi: '<code>AdminLayout</code>: sidebar (<code>#admin-nav-courses</code>) + <code>&lt;Outlet /&gt;</code>; route index ⇒ <code>/admin/courses</code>. <code>#admin-courses-table</code>: mỗi khoá một <code>tr.admin-course-row#admin-course-&lt;id&gt;</code> có <code>.admin-course-title</code>, <code>.admin-course-price</code>, <code>.admin-course-students</code> (số lượt ghi danh), <code>.badge-status</code> Published/Draft, <code>.btn-edit</code>, <code>.btn-curriculum</code>, <code>.btn-delete</code>.' },
    ], hook: ['index route', 'Navigate', 'Table'] },
    { ten: { en: 'Create course + validation', vi: 'Thêm khoá + kiểm dữ liệu' }, diem: 3, yeuCau: [
      { en: '<code>#course-form</code> with <code>#title</code>, <code>#categoryId</code>, <code>#level</code>, <code>#price</code>, <code>#instructor</code>, <code>#description</code>, <code>#thumbnail</code>, <code>#published</code> (switch), <code>#save-course</code>; rules in the table; invalid ⇒ no request. Saved ⇒ back to <code>/admin/courses</code> with <code>#admin-success</code> "Course "…" was saved.".', vi: '<code>#course-form</code> có <code>#title</code>, <code>#categoryId</code>, <code>#level</code>, <code>#price</code>, <code>#instructor</code>, <code>#description</code>, <code>#thumbnail</code>, <code>#published</code> (switch), <code>#save-course</code>; luật theo bảng; sai ⇒ không gửi request. Lưu xong ⇒ về <code>/admin/courses</code> kèm <code>#admin-success</code> "Course "…" was saved.".' },
    ], hook: ['controlled form', 'createAsyncThunk', 'navigate(…, { state })'], viDu: 'empty submit ⇒ 6 messages, 0 requests · "Vue 3 Crash Course", Frontend, Beginner, 259000 ⇒ POST /courses { price: 259000 (number) }' },
    { ten: { en: 'Edit course', vi: 'Sửa khoá' }, diem: 2, yeuCau: [
      { en: 'Same component on <code>/admin/courses/:id/edit</code>, fields pre-filled (numbers turned into strings for the inputs); saving PATCHes the course; its own title does not count as a duplicate; unknown id ⇒ <code>#form-not-found</code>.', vi: 'Cùng component ở <code>/admin/courses/:id/edit</code>, các ô điền sẵn (số đổi thành chuỗi cho ô nhập); lưu thì PATCH khoá; tên của chính nó không bị coi là trùng; id lạ ⇒ <code>#form-not-found</code>.' },
    ], hook: ['useParams', 'useEffect (prefill)'] },
    { ten: { en: 'Delete with a business rule', vi: 'Xoá có luật nghiệp vụ' }, diem: 1.5, yeuCau: [
      { en: '<code>.btn-delete</code> ⇒ <code>window.confirm</code>; courses with students are refused (<code>#admin-error</code>); otherwise the course and its chapters, lessons and questions are deleted and the row disappears.', vi: '<code>.btn-delete</code> ⇒ <code>window.confirm</code>; khoá đã có học viên bị từ chối (<code>#admin-error</code>); còn lại thì xoá khoá cùng chương, bài, câu hỏi của nó và dòng biến mất.' },
    ], hook: ['rejectWithValue', 'Promise.allSettled'] },
    { ten: { en: 'Chapters & lessons', vi: 'Chương & bài học' }, diem: 2, yeuCau: [
      { en: '<code>CurriculumPage</code>: <code>#curriculum-title</code>, <code>.admin-chapter#admin-chapter-&lt;id&gt;</code> (<code>.btn-delete-chapter</code>), <code>.admin-lesson#admin-lesson-&lt;id&gt;</code> (<code>.btn-edit-lesson</code>, <code>.btn-delete-lesson</code>), <code>#chapter-form</code> (<code>#chapter-title</code>, <code>#add-chapter</code>), <code>#lesson-form</code> (<code>#lesson-chapter</code>, <code>#lesson-title</code>, <code>#lesson-video</code>, <code>#lesson-duration</code>, <code>#lesson-content</code>, <code>#save-lesson</code>); <code>#curriculum-success</code> after each change.', vi: '<code>CurriculumPage</code>: <code>#curriculum-title</code>, <code>.admin-chapter#admin-chapter-&lt;id&gt;</code> (<code>.btn-delete-chapter</code>), <code>.admin-lesson#admin-lesson-&lt;id&gt;</code> (<code>.btn-edit-lesson</code>, <code>.btn-delete-lesson</code>), <code>#chapter-form</code> (<code>#chapter-title</code>, <code>#add-chapter</code>), <code>#lesson-form</code> (<code>#lesson-chapter</code>, <code>#lesson-title</code>, <code>#lesson-video</code>, <code>#lesson-duration</code>, <code>#lesson-content</code>, <code>#save-lesson</code>); <code>#curriculum-success</code> sau mỗi thay đổi.' },
    ] },
  ],
  idBatBuoc: [
    ['#admin-nav-courses · #admin-courses-title #add-course #admin-success #admin-error', { en: 'admin course list', vi: 'danh sách khoá (admin)' }],
    ['#admin-courses-table tr.admin-course-row#admin-course-ID .admin-course-title .admin-course-price .admin-course-students .badge-status .btn-edit .btn-curriculum .btn-delete', { en: 'table row', vi: 'dòng bảng' }],
    ['#course-form #title #categoryId #level #price #instructor #description #thumbnail #published #save-course #cancel-course #form-not-found · #&lt;field&gt;-error', { en: 'course form', vi: 'form khoá học' }],
    ['#curriculum-title #curriculum-success #no-chapters .admin-chapter .btn-delete-chapter .admin-lesson .btn-edit-lesson .btn-delete-lesson', { en: 'curriculum lists', vi: 'danh sách chương trình học' }],
    ['#chapter-form #chapter-title #chapter-title-error #add-chapter · #lesson-form #lesson-chapter #lesson-title #lesson-video #lesson-duration #lesson-content #save-lesson #cancel-edit · #lesson-*-error', { en: 'curriculum forms', vi: 'form chương trình học' }],
  ],
  truDiem: [
    { en: 'Price / categoryId saved as strings ("259000") — sorting by price and filtering by category break.', vi: 'Lưu price / categoryId dạng chuỗi ("259000") — sắp theo giá và lọc danh mục hỏng.' },
    { en: 'Two separate components for Add and Edit with copy-pasted validation.', vi: 'Hai component Thêm và Sửa riêng, chép nguyên phần kiểm dữ liệu.' },
    { en: 'Deleting without confirmation, or leaving orphan chapters/lessons behind.', vi: 'Xoá không hỏi xác nhận, hoặc để lại chương/bài mồ côi.' },
  ],
});

const A = dn(1);
const DIEN_KHOA = (title = 'Vue 3 Crash Course') => [cho(), nhap('#title', title), doi('#categoryId', '1'), doi('#level', 'Beginner'), nhap('#price', '259000'), nhap('#instructor', 'Hoang Cuong'), nhap('#description', 'Composition API, components and Pinia from zero.')];
const THEM_BAI = (video) => [cho(), doi('#lesson-chapter', '3'), nhap('#lesson-title', 'useRef and focus'), nhap('#lesson-video', video), nhap('#lesson-duration', '12'), nhap('#lesson-content', 'Keep a mutable value between renders and focus an input.'), gui('#lesson-form'), cho()];
const LOI6 = ['Title must be between 5 and 100 characters', 'Please choose a category', 'Please choose a level', 'Price is required', 'Instructor is required', 'Description must be at least 20 characters'];

const KIEM = [
  // f1 — layout & table
  { nhom: 'f1', moTa: '/admin redirects to /admin/courses', url: '/admin', khoCucBo: A, kiem: 'duong-dan', giaTri: '/admin/courses' },
  { nhom: 'f1', moTa: 'All 10 courses, drafts included', url: '/admin/courses', khoCucBo: A, kiem: 'so-luong', selector: '.admin-course-row', giaTri: 10 },
  { nhom: 'f1', moTa: 'Draft badge and student count', url: '/admin/courses', khoCucBo: A, kiem: 'danh-sach-text', selector: '#admin-course-1 .admin-course-students, #admin-course-10 .badge-status', mongDoi: ['3', 'Draft'] },
  { nhom: 'f1', an: true, moTa: 'Sidebar link + Outlet layout', url: '/admin/courses', khoCucBo: A, kiem: 'thuoc-tinh', selector: '#admin-nav-courses', thuocTinh: 'class', khop: '\\bactive\\b' },
  // f2 — create + validation
  { nhom: 'f2', moTa: 'Valid course ⇒ POST with numbers and boolean', url: '/admin/courses/new', khoCucBo: A, kiem: 'du-lieu-server', bang: 'courses', chat: true, chua: { title: 'Vue 3 Crash Course', categoryId: 1, level: 'Beginner', price: 259000, published: true }, truoc: [...DIEN_KHOA(), gui('#course-form'), cho()] },
  { nhom: 'f2', moTa: 'After saving: back on the list with a success message', url: '/admin/courses/new', khoCucBo: A, kiem: 'text', selector: '#admin-success', khop: 'Vue 3 Crash Course.*saved', truoc: [...DIEN_KHOA(), gui('#course-form'), cho()] },
  { nhom: 'f2', moTa: 'Empty form ⇒ 6 field messages', url: '/admin/courses/new', khoCucBo: A, kiem: 'danh-sach-text', selector: '#title-error, #categoryId-error, #level-error, #price-error, #instructor-error, #description-error', mongDoi: LOI6, truoc: [cho(), gui('#course-form'), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'Empty form ⇒ no POST', url: '/admin/courses/new', khoCucBo: A, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [cho(), gui('#course-form'), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'Duplicate title (any case/spaces) refused', url: '/admin/courses/new', khoCucBo: A, kiem: 'text', selector: '#title-error', giaTri: 'A course with this title already exists', truoc: [...DIEN_KHOA('  react for BEGINNERS '), gui('#course-form'), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'Price 12.5 and an ftp thumbnail are rejected', url: '/admin/courses/new', khoCucBo: A, kiem: 'danh-sach-text', selector: '#price-error, #thumbnail-error', mongDoi: ['Price must be a whole number between 0 and 10,000,000', 'Thumbnail must be a valid http(s) URL'], truoc: [...DIEN_KHOA(), nhap('#price', '12.5'), nhap('#thumbnail', 'ftp://img/x.png'), gui('#course-form'), cho(200)] },
  // f3 — edit
  { nhom: 'f3', moTa: 'Edit form is pre-filled', url: '/admin/courses/2/edit', khoCucBo: A, kiem: 'thuoc-tinh-js', selector: '#title', thuocTinh: 'value', giaTri: 'Advanced React Patterns' },
  { nhom: 'f3', moTa: 'Changing the price PATCHes a number (own title allowed)', url: '/admin/courses/2/edit', khoCucBo: A, kiem: 'du-lieu-server', bang: 'courses', chat: true, chua: { id: 2, title: 'Advanced React Patterns', price: 450000, createdAt: '2026-03-05' }, truoc: [cho(), nhap('#price', '450000'), gui('#course-form'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Unpublishing a course', url: '/admin/courses/9/edit', khoCucBo: A, kiem: 'du-lieu-server', bang: 'courses', chat: true, chua: { id: 9, published: false }, truoc: [cho(), { hanhDong: 'chon-o', selector: '#published', giaTri: false }, gui('#course-form'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Unknown id ⇒ #form-not-found', url: '/admin/courses/99/edit', khoCucBo: A, kiem: 'ton-tai', selector: '#form-not-found' },
  // f4 — delete
  { nhom: 'f4', moTa: 'Deleting the draft course (no students)', url: '/admin/courses', khoCucBo: A, kiem: 'du-lieu-server', bang: 'courses', khongChua: { id: 10 }, truoc: [cho(), click('#admin-course-10 .btn-delete'), cho()] },
  { nhom: 'f4', moTa: 'Course with students cannot be deleted', url: '/admin/courses', khoCucBo: A, kiem: 'text', selector: '#admin-error', khop: 'Cannot delete.*3 students are enrolled', truoc: [cho(), click('#admin-course-1 .btn-delete'), cho()] },
  { nhom: 'f4', an: true, moTa: '… and it is still on the server', url: '/admin/courses', khoCucBo: A, kiem: 'du-lieu-server', bang: 'courses', chua: { id: 1 }, truoc: [cho(), click('#admin-course-1 .btn-delete'), cho()] },
  { nhom: 'f4', an: true, moTa: 'Cancel in the confirm dialog ⇒ nothing deleted', url: '/admin/courses', khoCucBo: A, confirm: false, kiem: 'du-lieu-server', bang: 'courses', doDai: 10, truoc: [cho(), click('#admin-course-10 .btn-delete'), cho()] },
  // f5 — curriculum
  { nhom: 'f5', moTa: 'Add the first chapter to course 2 (order 1)', url: '/admin/courses/2/curriculum', khoCucBo: A, kiem: 'du-lieu-server', bang: 'chapters', chat: true, chua: { courseId: 2, title: 'Render Props', order: 1 }, truoc: [cho(), nhap('#chapter-title', 'Render Props'), gui('#chapter-form'), cho()] },
  { nhom: 'f5', moTa: 'Non-YouTube video link refused', url: '/admin/courses/1/curriculum', khoCucBo: A, kiem: 'text', selector: '#lesson-video-error', khop: 'YouTube', truoc: THEM_BAI('https://vimeo.com/76979871') },
  { nhom: 'f5', moTa: 'Valid lesson saved at the end of its chapter', url: '/admin/courses/1/curriculum', khoCucBo: A, kiem: 'du-lieu-server', bang: 'lessons', chat: true, chua: { chapterId: 3, courseId: 1, order: 2, duration: 12, title: 'useRef and focus' }, truoc: THEM_BAI('https://youtu.be/O6P86uwfdR0') },
  { nhom: 'f5', an: true, moTa: 'Chapter title too short / duplicate', url: '/admin/courses/1/curriculum', khoCucBo: A, kiem: 'text', selector: '#chapter-title-error', giaTri: 'This chapter already exists', truoc: [cho(), nhap('#chapter-title', 'hooks in practice'), gui('#chapter-form'), cho(200)] },
  { nhom: 'f5', an: true, moTa: 'Deleting a lesson', url: '/admin/courses/1/curriculum', khoCucBo: A, kiem: 'du-lieu-server', bang: 'lessons', khongChua: { id: 5 }, truoc: [cho(), click('#admin-lesson-5 .btn-delete-lesson'), cho()] },
  { nhom: 'f5', an: true, moTa: 'Editing a lesson (PATCH)', url: '/admin/courses/1/curriculum', khoCucBo: A, kiem: 'du-lieu-server', bang: 'lessons', chat: true, chua: { id: 1, title: 'What is React? (updated)', order: 1 }, truoc: [cho(), click('#admin-lesson-1 .btn-edit-lesson'), cho(100), nhap('#lesson-title', 'What is React? (updated)'), gui('#lesson-form'), cho()] },
];

export default doiDau(moduleF({
  k: 9, phut: 180, banIn: BAN_IN, kiem: KIEM, url: '/admin/courses',
  baiHoc: 'fer202-6-1-events-forms',
  khaiNiem: ['nested admin routes + index route', 'one form for create & edit', 'field validation', 'POST / PATCH / DELETE', 'business rule before delete', 'cascade delete', 'invalidate cached list'],
  viDu: [{ input: 'Admin clicks Delete on "React for Beginners"', output: '#admin-error — Cannot delete "React for Beginners": 3 students are enrolled. Unpublish it instead.', explanation: 'The thunk asks GET /enrollments?courseId=1 first and rejects with a message.|||Thunk hỏi GET /enrollments?courseId=1 trước rồi từ chối kèm thông điệp.' }],
  thuatNgu: [{ en: 'CRUD', vi: 'Create · Read · Update · Delete' }, { en: 'index route', vi: 'route con mặc định của route cha (không có path)' }, { en: 'cascade delete', vi: 'xoá kéo theo bản ghi con' }, { en: 'invalidate', vi: 'đánh dấu dữ liệu đã cũ để lần sau tải lại' }],
  goiY: [
    'Route: <code>&lt;Route path="/admin" element={&lt;ProtectedRoute role="admin"&gt;&lt;AdminLayout /&gt;&lt;/ProtectedRoute&gt;}&gt;</code> chứa <code>&lt;Route index element={&lt;Navigate to="courses" replace /&gt;} /&gt;</code>, <code>courses</code>, <code>courses/new</code>, <code>courses/:id/edit</code>, <code>courses/:id/curriculum</code>.',
    'Một form: <code>const isEdit = Boolean(useParams().id)</code>; useEffect tải danh mục + mọi khoá (để kiểm trùng) và điền sẵn khi sửa. <code>validateCourse(form, allCourses, editingId)</code> trả object lỗi; rỗng mới dispatch <code>createCourse</code> / <code>updateCourse</code> rồi <code>.unwrap()</code> và <code>navigate("/admin/courses", { state: { flash } })</code>.',
    'Xoá: thunk <code>deleteCourse</code> đếm <code>GET /enrollments?courseId=</code> ⇒ &gt; 0 thì <code>rejectWithValue("Cannot delete …")</code>; không thì xoá bài, câu hỏi, chương (<code>Promise.allSettled</code>) rồi khoá. Sau thêm/sửa/xoá đặt <code>state.status = "idle"</code> cho danh mục công khai để /courses tải lại.',
  ],
  loiHayGap: [
    'Gửi <code>price: form.price</code> (chuỗi từ ô nhập) ⇒ db có "259000" và sắp theo giá ra sai (chuỗi so theo ký tự).',
    'Kiểm trùng tên mà quên loại chính nó khi sửa ⇒ không lưu lại được khoá với tên cũ.',
    'Dùng PUT với object thiếu trường ⇒ mất <code>createdAt</code>/<code>thumbnail</code>; PATCH chỉ gửi trường đổi, hoặc PUT đủ trường.',
    'Xoá khoá mà để lại chương/bài/câu hỏi ⇒ dữ liệu mồ côi (json-server 0.17 có tự dọn theo khoá ngoại, nhưng đừng dựa vào điều đó).',
    'Không hỏi <code>window.confirm</code> trước khi xoá; hoặc gọi API trước rồi mới hỏi.',
    'Thêm khoá xong quay về /courses vẫn thấy danh sách cũ ⇒ quên đánh dấu catalog là cũ (<code>status = "idle"</code>).',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> The admin area is a nested route tree: <code>ProtectedRoute role="admin"</code> wraps <code>AdminLayout</code> (sidebar + <code>Outlet</code>) and an index route redirects to <code>courses</code>. The course list uses a separate <code>admin</code> branch of the courses slice (all courses + student counts) so the public catalogue is untouched; create/update/delete thunks update that branch and set the catalogue back to <code>idle</code>. <code>CourseFormPage</code> serves both URLs: it loads categories and all courses, pre-fills on edit, validates with the pure <code>validateCourse</code> (duplicate check excludes its own id), converts types before sending, and navigates back with a flash message in <code>location.state</code>. <code>deleteCourse</code> enforces the business rule on the server data before touching anything, then removes children and the course. The curriculum page keeps its data local (only it needs it), reloads the tree after each change and computes new <code>order</code> values as max + 1.</p>',
    vi: '<p><b>Hướng giải.</b> Khu admin là một cây route lồng: <code>ProtectedRoute role="admin"</code> bọc <code>AdminLayout</code> (sidebar + <code>Outlet</code>), route index chuyển sang <code>courses</code>. Danh sách khoá dùng nhánh <code>admin</code> riêng trong slice courses (mọi khoá + số học viên) nên danh mục công khai không bị đụng; thunk thêm/sửa/xoá cập nhật nhánh đó và đặt danh mục về <code>idle</code>. <code>CourseFormPage</code> phục vụ cả hai URL: tải danh mục và mọi khoá, điền sẵn khi sửa, kiểm bằng hàm thuần <code>validateCourse</code> (kiểm trùng bỏ qua id của chính nó), đổi kiểu trước khi gửi, rồi quay về kèm thông báo trong <code>location.state</code>. <code>deleteCourse</code> áp luật nghiệp vụ trên dữ liệu máy chủ trước khi xoá gì, rồi xoá con và khoá. Trang chương trình học giữ dữ liệu cục bộ (chỉ nó cần), tải lại cây sau mỗi thay đổi và tính <code>order</code> mới = lớn nhất + 1.</p>',
  },
}));
