/**
 * CodeLearn · F10 — Admin: CRUD câu hỏi quiz (chọn khoá ▸ chương, 4 phương án khác nhau, một đáp án)
 * + quản lý người dùng (tìm, khoá/mở, đổi vai trò, xoá kèm dữ liệu; không tự hại chính mình).
 */
import { doiDau } from './_chung.mjs';
import { DANG_NHAP, banInF, bang, click, cho, dn, doi, gui, moduleF, nhap } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>Two more admin pages. <b>Quiz questions</b>: choose a course, then one of its chapters, then list, add, edit and delete that chapter's questions; every question has exactly 4 different options and one correct answer. <b>Users</b>: list everybody with role, status and number of enrolments, search by name or email, lock / unlock, switch role, delete — but an admin can never lock, demote or delete <b>their own</b> account (otherwise the last admin can lock everybody out).</p>
<h3>API calls</h3>${bang(['Page', 'Requests'], [
    ['questions', '<code>GET /courses</code> · <code>GET /chapters?courseId=</code> · <code>GET /questions?chapterId=</code> · <code>POST /questions</code> · <code>PUT /questions/:id</code> · <code>DELETE /questions/:id</code>'],
    ['users', '<code>GET /users</code> + <code>GET /enrollments</code> · <code>PATCH /users/:id</code> <code>{ active }</code> or <code>{ role }</code> · delete: the user\'s enrolments + results, then <code>DELETE /users/:id</code>'],
  ])}
<h3>Validation (question form)</h3>${bang(['Field', 'Rule', 'Message'], [
    ['<code>#q-content</code>', '≥ 10 chars', 'Question must be at least 10 characters (<code>#q-content-error</code>)'],
    ['<code>#q-option-0</code> … <code>#q-option-3</code>', 'all filled; all different (trimmed, case-insensitive)', 'All 4 options are required · Options must be different (<code>#q-options-error</code>)'],
    ['<code>#q-answer</code>', 'required (values 0–3)', 'Please choose the correct answer (<code>#q-answer-error</code>)'],
  ])}
<p>Save <code>answerIndex</code> as a <b>number</b> and <code>options</code> as an array of 4 trimmed strings — F7 compares <code>chosen === answerIndex</code>.</p>
<h3>Edge cases</h3><ul><li>No chapter chosen ⇒ <code>#choose-chapter</code>; chapter without questions ⇒ <code>#no-questions-admin</code>.</li><li>Changing the course resets the chapter and the list.</li><li>A locked user cannot log in any more (F2 rule) — test it end to end.</li><li>Deleting a user also deletes their enrolments and quiz results (no orphan rows); always confirm first.</li></ul>`,
  vi: `<p>Thêm hai trang admin. <b>Câu hỏi quiz</b>: chọn khoá, rồi một chương của khoá, rồi liệt kê, thêm, sửa, xoá câu hỏi của chương đó; mỗi câu có đúng 4 phương án khác nhau và một đáp án đúng. <b>Người dùng</b>: liệt kê mọi người kèm vai trò, trạng thái, số lượt ghi danh; tìm theo tên hoặc email; khoá / mở khoá; đổi vai trò; xoá — nhưng admin không bao giờ được khoá, hạ quyền hay xoá <b>chính tài khoản mình</b> (không thì admin cuối cùng tự khoá cửa mọi người).</p>
<h3>Lời gọi API</h3>${bang(['Trang', 'Request'], [
    ['câu hỏi', '<code>GET /courses</code> · <code>GET /chapters?courseId=</code> · <code>GET /questions?chapterId=</code> · <code>POST /questions</code> · <code>PUT /questions/:id</code> · <code>DELETE /questions/:id</code>'],
    ['người dùng', '<code>GET /users</code> + <code>GET /enrollments</code> · <code>PATCH /users/:id</code> <code>{ active }</code> hoặc <code>{ role }</code> · xoá: lượt ghi danh + kết quả quiz của người đó, rồi <code>DELETE /users/:id</code>'],
  ])}
<h3>Kiểm dữ liệu (form câu hỏi)</h3>${bang(['Ô', 'Luật', 'Thông điệp'], [
    ['<code>#q-content</code>', '≥ 10 ký tự', 'Question must be at least 10 characters (<code>#q-content-error</code>)'],
    ['<code>#q-option-0</code> … <code>#q-option-3</code>', 'đủ 4 ô; khác nhau (sau trim, không phân biệt hoa/thường)', 'All 4 options are required · Options must be different (<code>#q-options-error</code>)'],
    ['<code>#q-answer</code>', 'bắt buộc (giá trị 0–3)', 'Please choose the correct answer (<code>#q-answer-error</code>)'],
  ])}
<p>Lưu <code>answerIndex</code> dạng <b>số</b> và <code>options</code> là mảng 4 chuỗi đã trim — F7 so <code>chosen === answerIndex</code>.</p>
<h3>Trường hợp biên</h3><ul><li>Chưa chọn chương ⇒ <code>#choose-chapter</code>; chương chưa có câu hỏi ⇒ <code>#no-questions-admin</code>.</li><li>Đổi khoá ⇒ đặt lại chương và danh sách.</li><li>Người bị khoá không đăng nhập được nữa (luật F2) — thử trọn vòng.</li><li>Xoá người dùng thì xoá luôn lượt ghi danh và kết quả quiz của họ (không để dòng mồ côi); luôn hỏi xác nhận trước.</li></ul>`,
};

const BAN_IN = banInF({
  k: 10, phut: 120, moTa: MO_TA, bangDuLieu: ['questions'], soDong: 2,
  wireframe: `
/admin/questions                                     /admin/users
[React for Beginners ▾] (#q-course)                   [Search by name or email____] (#user-search)
[Chapter 1: Getting Started… ▾] (#q-chapter)          Name            Email               Role    Status  Enrolled  Actions
┌ #questions-table ─────────────────┐┌ Add a question ┐  Admin CodeLearn (you) admin@…     admin   Active  0   [Lock][Make student][Delete] (disabled)
│1 What does JSX…│B. React.create… ││ Question [___] │  Tran Thi Binh   binh@…           student Active  2   [Lock][Make admin][Delete]
│   [Edit][Delete]                   ││ Option A [___] │  Le Van Cuong    cuong@…          student Locked  0   [Unlock]…
└────────────────────────────────────┘│ … Option D     │  tr.admin-user-row#admin-user-ID  .admin-user-name/-email/-role/-status/-enrolled
 tr.admin-question-row .admin-question-answer │ Correct [▾]   │  .btn-toggle-lock .btn-toggle-role .btn-delete-user
                                       │ [Add question] │
                                       └────────────────┘`,
  chucNang: [
    { ten: { en: 'Question list', vi: 'Danh sách câu hỏi' }, diem: 1.5, yeuCau: [
      { en: 'Route <code>/admin/questions</code> (sidebar <code>#admin-nav-questions</code>): <code>#q-course</code> (all courses) and <code>#q-chapter</code> (chapters of that course, "Chapter N: title"); <code>#questions-table</code> rows <code>tr.admin-question-row#admin-question-&lt;id&gt;</code> with <code>.admin-question-content</code> and <code>.admin-question-answer</code> "B. option text".', vi: 'Route <code>/admin/questions</code> (sidebar <code>#admin-nav-questions</code>): <code>#q-course</code> (mọi khoá) và <code>#q-chapter</code> (chương của khoá đó, "Chapter N: tên"); <code>#questions-table</code> có dòng <code>tr.admin-question-row#admin-question-&lt;id&gt;</code> gồm <code>.admin-question-content</code> và <code>.admin-question-answer</code> "B. nội dung phương án".' },
    ], hook: ['dependent selects', 'useEffect([courseId])'] },
    { ten: { en: 'Add / edit question + validation', vi: 'Thêm / sửa câu hỏi + kiểm' }, diem: 3, yeuCau: [
      { en: '<code>#question-form</code> (<code>#q-content</code>, <code>#q-option-0..3</code>, <code>#q-answer</code>, <code>#q-explanation</code>, <code>#save-question</code>); <code>.btn-edit-question</code> fills the form, saving PUTs the full question; <code>#question-success</code> after saving; the list reloads.', vi: '<code>#question-form</code> (<code>#q-content</code>, <code>#q-option-0..3</code>, <code>#q-answer</code>, <code>#q-explanation</code>, <code>#save-question</code>); <code>.btn-edit-question</code> điền form, lưu thì PUT đủ câu hỏi; <code>#question-success</code> sau khi lưu; danh sách tải lại.' },
    ], viDu: 'POST /questions { chapterId: 2, courseId: 1, content, options: ["useEffect","useRef","useState","useMemo"], answerIndex: 2 }' },
    { ten: { en: 'Delete question', vi: 'Xoá câu hỏi' }, diem: 1, yeuCau: [
      { en: '<code>.btn-delete-question</code> ⇒ confirm ⇒ <code>DELETE /questions/:id</code>; Cancel ⇒ nothing.', vi: '<code>.btn-delete-question</code> ⇒ xác nhận ⇒ <code>DELETE /questions/:id</code>; Huỷ ⇒ không làm gì.' },
    ] },
    { ten: { en: 'Users list & search', vi: 'Danh sách & tìm người dùng' }, diem: 1.5, yeuCau: [
      { en: 'Route <code>/admin/users</code> (sidebar <code>#admin-nav-users</code>): <code>#users-table</code>, one <code>tr.admin-user-row#admin-user-&lt;id&gt;</code> per user with <code>.admin-user-name</code>, <code>.admin-user-email</code>, <code>.admin-user-role</code>, <code>.admin-user-status</code> (Active/Locked), <code>.admin-user-enrolled</code>; <code>#user-search</code> filters by name or email (case-insensitive).', vi: 'Route <code>/admin/users</code> (sidebar <code>#admin-nav-users</code>): <code>#users-table</code>, mỗi người một <code>tr.admin-user-row#admin-user-&lt;id&gt;</code> có <code>.admin-user-name</code>, <code>.admin-user-email</code>, <code>.admin-user-role</code>, <code>.admin-user-status</code> (Active/Locked), <code>.admin-user-enrolled</code>; <code>#user-search</code> lọc theo tên hoặc email (không phân biệt hoa/thường).' },
    ] },
    { ten: { en: 'Lock, role & delete users', vi: 'Khoá, vai trò & xoá người dùng' }, diem: 3, yeuCau: [
      { en: '<code>.btn-toggle-lock</code> "Lock"/"Unlock" (PATCH <code>active</code>), <code>.btn-toggle-role</code> "Make admin"/"Make student" (PATCH <code>role</code>), <code>.btn-delete-user</code> (confirm; deletes enrolments + results first). All three are <b>disabled on the current admin\'s own row</b>. Update the row from the server reply; messages in <code>#users-success</code> / <code>#users-error</code>.', vi: '<code>.btn-toggle-lock</code> "Lock"/"Unlock" (PATCH <code>active</code>), <code>.btn-toggle-role</code> "Make admin"/"Make student" (PATCH <code>role</code>), <code>.btn-delete-user</code> (xác nhận; xoá lượt ghi danh + kết quả trước). Cả ba <b>bị khoá ở dòng của chính admin đang đăng nhập</b>. Cập nhật dòng theo bản máy chủ trả về; thông báo ở <code>#users-success</code> / <code>#users-error</code>.' },
    ], hook: ['PATCH', 'useMemo (search)'] },
  ],
  idBatBuoc: [
    ['#admin-nav-questions #admin-nav-users', { en: 'sidebar links', vi: 'link sidebar' }],
    ['#q-course #q-chapter #choose-chapter #no-questions-admin #questions-table tr.admin-question-row .admin-question-content .admin-question-answer .btn-edit-question .btn-delete-question', { en: 'question list', vi: 'danh sách câu hỏi' }],
    ['#question-form #q-content #q-option-0 … #q-option-3 #q-answer #q-explanation #save-question #cancel-question #question-success · #q-content-error #q-options-error #q-answer-error', { en: 'question form', vi: 'form câu hỏi' }],
    ['#user-search #users-table tr.admin-user-row#admin-user-ID .admin-user-name .admin-user-email .admin-user-role .admin-user-status .admin-user-enrolled', { en: 'users table', vi: 'bảng người dùng' }],
    ['.btn-toggle-lock .btn-toggle-role .btn-delete-user #users-success #users-error', { en: 'user actions', vi: 'thao tác người dùng' }],
  ],
  truDiem: [
    { en: 'Saving <code>answerIndex</code> as "2" (string) — every quiz answer is then marked wrong.', vi: 'Lưu <code>answerIndex</code> là "2" (chuỗi) — quiz chấm câu nào cũng sai.' },
    { en: 'Admin can lock or delete themselves.', vi: 'Admin tự khoá hoặc tự xoá được chính mình.' },
    { en: 'Reloading the whole page (<code>window.location.reload()</code>) after every action.', vi: 'Tải lại cả trang (<code>window.location.reload()</code>) sau mỗi thao tác.' },
  ],
});

const A = dn(1);
const CHON = (course, chapter) => [cho(), doi('#q-course', course), cho(), doi('#q-chapter', chapter), cho()];
const DIEN_CAU = [nhap('#q-content', 'Which hook stores state in a function component?'), nhap('#q-option-0', 'useEffect'), nhap('#q-option-1', 'useRef'), nhap('#q-option-2', 'useState'), nhap('#q-option-3', 'useMemo'), doi('#q-answer', '2')];

const KIEM = [
  // f1 — question list
  { nhom: 'f1', moTa: 'Course 1 ▸ chapter 1 lists 3 questions', url: '/admin/questions', khoCucBo: A, kiem: 'so-luong', selector: '.admin-question-row', giaTri: 3, truoc: CHON('1', '1') },
  { nhom: 'f1', moTa: 'Correct answer column "B. …"', url: '/admin/questions', khoCucBo: A, kiem: 'danh-sach-text', selector: '.admin-question-answer', mongDoi: ['B. React.createElement() calls', 'B. npx create-react-app my-app', 'A. src/index.js'], truoc: CHON('1', '1') },
  { nhom: 'f1', an: true, moTa: 'Nothing chosen ⇒ #choose-chapter', url: '/admin/questions', khoCucBo: A, kiem: 'ton-tai', selector: '#choose-chapter' },
  { nhom: 'f1', an: true, moTa: 'Chapter without questions ⇒ #no-questions-admin', url: '/admin/questions', khoCucBo: A, kiem: 'ton-tai', selector: '#no-questions-admin', truoc: CHON('3', '5') },
  // f2 — add / edit + validation
  { nhom: 'f2', moTa: 'Valid question ⇒ POST with numeric answerIndex and 4 options', url: '/admin/questions', khoCucBo: A, kiem: 'du-lieu-server', bang: 'questions', chat: true, chua: { chapterId: 2, courseId: 1, answerIndex: 2, options: ['useEffect', 'useRef', 'useState', 'useMemo'] }, truoc: [...CHON('1', '2'), ...DIEN_CAU, gui('#question-form'), cho()] },
  { nhom: 'f2', moTa: 'Empty form ⇒ three messages', url: '/admin/questions', khoCucBo: A, kiem: 'danh-sach-text', selector: '#q-content-error, #q-options-error, #q-answer-error', mongDoi: ['Question must be at least 10 characters', 'All 4 options are required', 'Please choose the correct answer'], truoc: [...CHON('1', '2'), gui('#question-form'), cho(200)] },
  { nhom: 'f2', moTa: 'The new question appears in the table', url: '/admin/questions', khoCucBo: A, kiem: 'so-luong', selector: '.admin-question-row', giaTri: 4, truoc: [...CHON('1', '2'), ...DIEN_CAU, gui('#question-form'), cho()] },
  { nhom: 'f2', an: true, moTa: 'Duplicate options refused', url: '/admin/questions', khoCucBo: A, kiem: 'text', selector: '#q-options-error', giaTri: 'Options must be different', truoc: [...CHON('1', '2'), ...DIEN_CAU, nhap('#q-option-3', ' USEREF '), gui('#question-form'), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'Editing question 1 keeps its options (PUT full object)', url: '/admin/questions', khoCucBo: A, kiem: 'du-lieu-server', bang: 'questions', chat: true, chua: { id: 1, content: 'What does JSX compile to in React?', answerIndex: 1, options: ['Plain HTML strings', 'React.createElement() calls', 'Web Components', 'CSS-in-JS objects'] }, truoc: [...CHON('1', '1'), click('#admin-question-1 .btn-edit-question'), cho(100), nhap('#q-content', 'What does JSX compile to in React?'), gui('#question-form'), cho()] },
  // f3 — delete question
  { nhom: 'f3', moTa: 'Delete question 2', url: '/admin/questions', khoCucBo: A, kiem: 'du-lieu-server', bang: 'questions', khongChua: { id: 2 }, truoc: [...CHON('1', '1'), click('#admin-question-2 .btn-delete-question'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Cancel ⇒ nothing deleted', url: '/admin/questions', khoCucBo: A, confirm: false, kiem: 'du-lieu-server', bang: 'questions', doDai: 13, truoc: [...CHON('1', '1'), click('#admin-question-2 .btn-delete-question'), cho()] },
  // f4 — users list & search
  { nhom: 'f4', moTa: '5 users, Le Van Cuong is Locked', url: '/admin/users', khoCucBo: A, kiem: 'danh-sach-text', selector: '.admin-user-status', mongDoi: ['Active', 'Active', 'Active', 'Locked', 'Active'] },
  { nhom: 'f4', moTa: 'Search "BINH" (case-insensitive)', url: '/admin/users', khoCucBo: A, kiem: 'danh-sach-text', selector: '.admin-user-email', mongDoi: ['binh@codelearn.vn'], truoc: [cho(), nhap('#user-search', 'BINH'), cho(200)] },
  { nhom: 'f4', an: true, moTa: 'Enrolment count per user', url: '/admin/users', khoCucBo: A, kiem: 'danh-sach-text', selector: '.admin-user-enrolled', mongDoi: ['0', '2', '2', '0', '2'] },
  // f5 — lock / role / delete
  { nhom: 'f5', moTa: 'Lock Tran Thi Binh ⇒ active:false, button becomes "Unlock"', url: '/admin/users', khoCucBo: A, kiem: 'text', selector: '#admin-user-3 .btn-toggle-lock', giaTri: 'Unlock', truoc: [cho(), click('#admin-user-3 .btn-toggle-lock'), cho()] },
  { nhom: 'f5', moTa: 'Lock is saved on the server', url: '/admin/users', khoCucBo: A, kiem: 'du-lieu-server', bang: 'users', chat: true, chua: { id: 3, active: false }, truoc: [cho(), click('#admin-user-3 .btn-toggle-lock'), cho()] },
  { nhom: 'f5', moTa: 'Make Pham Minh Duc an admin', url: '/admin/users', khoCucBo: A, kiem: 'du-lieu-server', bang: 'users', chua: { id: 5, role: 'admin' }, truoc: [cho(), click('#admin-user-5 .btn-toggle-role'), cho()] },
  { nhom: 'f5', moTa: 'Own row: lock / role / delete disabled', url: '/admin/users', khoCucBo: A, kiem: 'thuoc-tinh-js', selector: '#admin-user-1 .btn-toggle-lock, #admin-user-1 .btn-toggle-role, #admin-user-1 .btn-delete-user', thuocTinh: 'disabled', giaTri: true },
  { nhom: 'f5', an: true, moTa: 'Deleting a user removes them and their enrolments', url: '/admin/users', khoCucBo: A, kiem: 'du-lieu-server', bang: 'enrollments', khongChua: { userId: 5 }, truoc: [cho(), click('#admin-user-5 .btn-delete-user'), cho()] },
  { nhom: 'f5', an: true, moTa: '… and the user row itself', url: '/admin/users', khoCucBo: A, kiem: 'du-lieu-server', bang: 'users', khongChua: { id: 5 }, truoc: [cho(), click('#admin-user-5 .btn-delete-user'), cho()] },
  { nhom: 'f5', an: true, moTa: 'A locked user can no longer log in', url: '/admin/users', khoCucBo: A, kiem: 'text', selector: '#login-error', khop: 'locked', truoc: [cho(), click('#admin-user-3 .btn-toggle-lock'), cho(), click('#logout-btn'), cho(200), click('#nav-login'), ...DANG_NHAP('binh@codelearn.vn', '123456')] },
];

export default doiDau(moduleF({
  k: 10, phut: 120, banIn: BAN_IN, kiem: KIEM, url: '/admin/questions',
  baiHoc: 'fer202-11-2-axios-json-server',
  khaiNiem: ['dependent selects', 'array fields in a controlled form', 'PUT vs PATCH', 'immutable row update', 'self-protection rule', 'cascade delete'],
  viDu: [{ input: 'Admin clicks "Lock" on Tran Thi Binh, logs out, logs in as binh@codelearn.vn', output: '#login-error "Your account has been locked. Please contact the admin."', explanation: 'PATCH /users/3 { active: false } — the F2 login thunk already rejects inactive users.|||PATCH /users/3 { active: false } — thunk đăng nhập F2 đã từ chối tài khoản không active.' }],
  thuatNgu: [{ en: 'dependent dropdown', vi: 'ô chọn phụ thuộc (chương theo khoá)' }, { en: 'PUT / PATCH', vi: 'thay cả bản ghi / sửa một phần' }, { en: 'self-lockout', vi: 'tự khoá chính mình ra ngoài' }],
  goiY: [
    'Questions page: state <code>courseId</code>, <code>chapterId</code>, <code>questions</code>; một useEffect theo <code>courseId</code> tải chương (và đặt <code>chapterId</code> về ""), một useEffect theo <code>chapterId</code> tải câu hỏi.',
    'Form có mảng: <code>options: ["", "", "", ""]</code>; đổi ô i: <code>setForm(f =&gt; ({ ...f, options: f.options.map((o, j) =&gt; j === i ? value : o) }))</code>. Kiểm trùng: <code>new Set(options.map(o =&gt; o.trim().toLowerCase())).size &lt; 4</code>. Gửi <code>answerIndex: Number(form.answer)</code>.',
    'Users: <code>const isMe = u.id === currentUser.id</code> ⇒ <code>disabled={isMe}</code> cho cả ba nút. Sau PATCH thay đúng một dòng: <code>setUsers(list =&gt; list.map(u =&gt; u.id === saved.id ? saved : u))</code>. Xoá: <code>Promise.allSettled</code> các lượt ghi danh + kết quả rồi <code>DELETE /users/:id</code>.',
  ],
  loiHayGap: [
    'Lấy <code>e.target.value</code> của select đáp án rồi gửi thẳng ⇒ <code>answerIndex: "2"</code>; quiz F7 so <code>===</code> nên câu đó luôn sai.',
    'Sửa mảng options tại chỗ (<code>form.options[i] = v; setForm(form)</code>) ⇒ React không re-render vì cùng tham chiếu.',
    'Đổi khoá mà không đặt lại chương ⇒ vẫn hiện câu hỏi của chương thuộc khoá cũ.',
    'PATCH với cả object câu hỏi kèm <code>id</code> — được, nhưng PUT thiếu <code>options</code> sẽ xoá mất phương án.',
    'Cho admin tự khoá mình ⇒ đăng xuất xong không ai vào được trang admin nữa.',
    'Xoá user mà để lại enrollments/results ⇒ thống kê F11 đếm cả học viên không còn tồn tại.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> Both pages keep page-only data in component state and talk to json-server through <code>quizApi</code>, <code>authApi</code> and <code>enrollApi</code>. The questions page chains two effects (course ⇒ chapters, chapter ⇒ questions) and resets the dependent state when its parent changes. The form holds the four options as an array updated immutably; the pure <code>validateQuestion</code> checks length, empties and duplicates; the payload converts <code>answerIndex</code> to a number. Editing sends the full object with PUT. The users page derives the visible rows from a search string with <code>useMemo</code>, updates one row from each PATCH reply, deletes children before the user, and disables every destructive action on the logged-in admin\'s own row — a rule a lecturer always tries during the defence.</p>',
    vi: '<p><b>Hướng giải.</b> Hai trang giữ dữ liệu chỉ-mình-dùng trong state component và gọi json-server qua <code>quizApi</code>, <code>authApi</code>, <code>enrollApi</code>. Trang câu hỏi nối hai effect (khoá ⇒ chương, chương ⇒ câu hỏi) và đặt lại state phụ thuộc khi cha đổi. Form giữ bốn phương án dạng mảng, cập nhật bất biến; hàm thuần <code>validateQuestion</code> kiểm độ dài, ô trống và trùng; payload đổi <code>answerIndex</code> sang số. Sửa thì PUT đủ object. Trang người dùng suy ra dòng hiển thị từ chuỗi tìm bằng <code>useMemo</code>, cập nhật đúng một dòng theo bản PATCH trả về, xoá dữ liệu con trước rồi mới xoá user, và khoá mọi thao tác nguy hiểm trên dòng của chính admin đang đăng nhập — luật mà GV luôn thử khi bảo vệ.</p>',
  },
}));
