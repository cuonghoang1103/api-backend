/**
 * CodeLearn · F6 — trang học: học tiếp, nhúng YouTube, nội dung, đánh dấu hoàn thành (PATCH), tiến độ %, trước/sau.
 */
import { doiDau } from './_chung.mjs';
import { B, DB, banInF, bang, click, cho, dn, moduleF, taiLai } from './_codelearn.mjs';

const db1 = (doiE1 = {}, doiL1 = {}) => ({
  base: B,
  db: {
    ...DB,
    enrollments: DB.enrollments.map((e) => (e.id === 1 ? { ...e, ...doiE1 } : e)),
    lessons: DB.lessons.map((l) => (l.id === 1 ? { ...l, ...doiL1 } : l)),
  },
});

const MO_TA = {
  en: `<p>The heart of an LMS. <code>/learn/:courseId</code> sends the student to the lesson to <b>resume</b> (the first lesson, in course order, that is not completed yet); <code>/learn/:courseId/lessons/:lessonId</code> shows one lesson: the YouTube video, the notes, a sidebar with every chapter/lesson (✓ when done), Previous / Next, and a button that marks the lesson complete or incomplete. Progress is the <code>completedLessons</code> array of the student's enrolment — saved on the server, so it survives a reload and shows on My Courses.</p>
<h3>API calls</h3>${bang(['When', 'Request'], [
    ['open the page', 'course + curriculum (F4 thunk) and my enrolments (F5 thunk)'],
    ['mark complete / incomplete', '<code>PATCH /enrollments/:id</code> <code>{ completedLessons: [1, 2, 3, 4] }</code> — a NEW array, sorted, no duplicates'],
    ['My Courses %', 'lesson totals for the enrolled courses: <code>GET /lessons?courseId=1&amp;courseId=3</code>'],
  ])}
<h3>YouTube</h3><p><code>db.json</code> stores <b>watch</b> links (<code>https://www.youtube.com/watch?v=SqcY0GlETPk</code>, sometimes <code>https://youtu.be/…</code>). YouTube refuses to show those inside an <code>&lt;iframe&gt;</code>; the iframe needs <code>https://www.youtube.com/embed/SqcY0GlETPk</code>. Write <code>toEmbedUrl(url)</code>; an unknown link ⇒ <code>#no-video</code>.</p>
<h3>Edge cases</h3><ul><li>Not enrolled ⇒ <code>#not-enrolled</code> (typing the URL must not open the lesson); guest ⇒ <code>/login</code>.</li><li>A lesson id from another course ⇒ <code>#lesson-not-found</code>.</li><li>All lessons done ⇒ resume at the first lesson and show <code>#course-complete</code>.</li><li>Previous disabled on the first lesson, Next disabled on the last — across chapters.</li></ul>`,
  vi: `<p>Trái tim của một LMS. <code>/learn/:courseId</code> đưa học viên tới bài <b>học tiếp</b> (bài đầu tiên, theo thứ tự khoá, chưa hoàn thành); <code>/learn/:courseId/lessons/:lessonId</code> hiện một bài: video YouTube, nội dung, thanh bên có mọi chương/bài (✓ khi đã xong), Trước / Sau, và nút đánh dấu hoàn thành / chưa hoàn thành. Tiến độ là mảng <code>completedLessons</code> trong lượt ghi danh của học viên — lưu trên máy chủ nên tải lại trang vẫn còn và hiện ở My Courses.</p>
<h3>Lời gọi API</h3>${bang(['Khi nào', 'Request'], [
    ['mở trang', 'khoá + chương trình học (thunk F4) và lượt ghi danh của tôi (thunk F5)'],
    ['đánh dấu / bỏ đánh dấu', '<code>PATCH /enrollments/:id</code> <code>{ completedLessons: [1, 2, 3, 4] }</code> — mảng MỚI, tăng dần, không trùng'],
    ['% ở My Courses', 'tổng số bài của các khoá đã ghi danh: <code>GET /lessons?courseId=1&amp;courseId=3</code>'],
  ])}
<h3>YouTube</h3><p><code>db.json</code> lưu link <b>xem</b> (<code>https://www.youtube.com/watch?v=SqcY0GlETPk</code>, đôi khi <code>https://youtu.be/…</code>). YouTube từ chối hiện link đó trong <code>&lt;iframe&gt;</code>; iframe cần <code>https://www.youtube.com/embed/SqcY0GlETPk</code>. Viết <code>toEmbedUrl(url)</code>; link lạ ⇒ <code>#no-video</code>.</p>
<h3>Trường hợp biên</h3><ul><li>Chưa ghi danh ⇒ <code>#not-enrolled</code> (gõ thẳng URL cũng không mở được bài); khách ⇒ <code>/login</code>.</li><li>Id bài của khoá khác ⇒ <code>#lesson-not-found</code>.</li><li>Đã xong hết ⇒ học tiếp từ bài đầu và hiện <code>#course-complete</code>.</li><li>Nút Trước khoá ở bài đầu, Sau khoá ở bài cuối — tính xuyên chương.</li></ul>`,
};

const BAN_IN = banInF({
  k: 6, phut: 150, moTa: MO_TA, bangDuLieu: ['lessons', 'enrollments'], soDong: 2,
  wireframe: `
/learn/1/lessons/4
┌──────────────────────────┬───────────────────────────────────────────────┐
│ React for Beginners      │ Lesson 4 of 5                (#lesson-position)│
│ ███████████░░░░░░  60%   │ Props vs State                  (#lesson-title)│
│ 3/5 lessons completed (60%)│ ┌───────────────────────────────────────────┐ │
│        (#progress-text)  │ │   <iframe id="lesson-video"                │ │
│ CHAPTER 1: GETTING …     │ │    src="https://www.youtube.com/embed/…">  │ │
│  ✓ What is React?        │ └───────────────────────────────────────────┘ │
│  ✓ Create React App…     │ Props are read-only data …   (#lesson-content) │
│ CHAPTER 2: COMPONENTS …  │                                               │
│  ✓ JSX and components    │ [← Previous] [Mark as complete] [Next →]      │
│ ▶ Props vs State (active)│  #prev-lesson   #mark-complete   #next-lesson  │
│ CHAPTER 3: HOOKS …       │                                               │
│    useState and useEffect│  .lesson-link  (.done when completed)         │
└──────────────────────────┴───────────────────────────────────────────────┘`,
  chucNang: [
    { ten: { en: 'Access & resume', vi: 'Quyền vào & học tiếp' }, diem: 2, yeuCau: [
      { en: 'Protected routes <code>/learn/:courseId</code> and <code>/learn/:courseId/lessons/:lessonId</code>. Not enrolled ⇒ <code>#not-enrolled</code>. No lesson id ⇒ <code>&lt;Navigate replace&gt;</code> to the first unfinished lesson (all done ⇒ first lesson). Foreign lesson id ⇒ <code>#lesson-not-found</code>.', vi: 'Route có bảo vệ <code>/learn/:courseId</code> và <code>/learn/:courseId/lessons/:lessonId</code>. Chưa ghi danh ⇒ <code>#not-enrolled</code>. Không có id bài ⇒ <code>&lt;Navigate replace&gt;</code> tới bài đầu tiên chưa xong (xong hết ⇒ bài đầu). Id bài của khoá khác ⇒ <code>#lesson-not-found</code>.' },
    ], hook: ['useParams', 'Navigate'], viDu: 'an@codelearn.vn (done 1, 2, 3) opens /learn/1 ⇒ /learn/1/lessons/4' },
    { ten: { en: 'Lesson view', vi: 'Xem bài học' }, diem: 2.5, yeuCau: [
      { en: '<code>#lesson-title</code>, <code>#lesson-position</code> "Lesson N of M", <code>iframe#lesson-video</code> with the <b>embed</b> URL, <code>#lesson-content</code>; sidebar <code>#lesson-list</code> with every lesson as <code>.lesson-link</code> (class <code>done</code> + "✓" when completed, <code>active</code> for the current one); <code>#prev-lesson</code> / <code>#next-lesson</code> across chapters, disabled at the ends.', vi: '<code>#lesson-title</code>, <code>#lesson-position</code> "Lesson N of M", <code>iframe#lesson-video</code> dùng URL <b>embed</b>, <code>#lesson-content</code>; thanh bên <code>#lesson-list</code> liệt kê mọi bài dạng <code>.lesson-link</code> (class <code>done</code> + "✓" khi đã xong, <code>active</code> cho bài đang học); <code>#prev-lesson</code> / <code>#next-lesson</code> xuyên chương, khoá ở hai đầu.' },
    ], hook: ['useMemo (flat lesson list)'] },
    { ten: { en: 'Mark complete (PATCH)', vi: 'Đánh dấu hoàn thành (PATCH)' }, diem: 3, yeuCau: [
      { en: '<code>#mark-complete</code> toggles: "Mark as complete" ⇄ "Mark as incomplete"; thunk <code>toggleLessonComplete</code> PATCHes a new sorted array; <code>#progress-text</code> "D/T lessons completed (P%)" and <code>#progress-bar</code> (React-Bootstrap <code>ProgressBar</code>, label "P%") update; 100% ⇒ <code>#course-complete</code>.', vi: '<code>#mark-complete</code> bật/tắt: "Mark as complete" ⇄ "Mark as incomplete"; thunk <code>toggleLessonComplete</code> PATCH một mảng mới đã sắp; <code>#progress-text</code> "D/T lessons completed (P%)" và <code>#progress-bar</code> (React-Bootstrap <code>ProgressBar</code>, nhãn "P%") cập nhật; 100% ⇒ <code>#course-complete</code>.' },
    ], hook: ['createAsyncThunk', 'PATCH', 'ProgressBar'] },
    { ten: { en: 'Progress on My Courses', vi: 'Tiến độ ở My Courses' }, diem: 1.5, yeuCau: [
      { en: 'Each <code>.my-course</code> card shows <code>.my-course-progress</code> (ProgressBar, label "P%") from <code>completedLessons</code> and the course lesson total; P = round(done / total × 100), 0 when the course has no lessons.', vi: 'Mỗi thẻ <code>.my-course</code> hiện <code>.my-course-progress</code> (ProgressBar, nhãn "P%") tính từ <code>completedLessons</code> và tổng số bài của khoá; P = làm tròn(xong / tổng × 100), 0 khi khoá chưa có bài.' },
    ] },
    { ten: { en: 'Structure', vi: 'Cấu trúc' }, diem: 1, yeuCau: [
      { en: 'Pure helpers in <code>utils/learning.js</code>: <code>toEmbedUrl</code>, <code>calcProgress</code>, <code>resumeLesson</code>; API in <code>enrollApi.updateProgress</code>.', vi: 'Hàm thuần ở <code>utils/learning.js</code>: <code>toEmbedUrl</code>, <code>calcProgress</code>, <code>resumeLesson</code>; API ở <code>enrollApi.updateProgress</code>.' },
    ] },
  ],
  idBatBuoc: [
    ['#learn-course-title #progress-bar #progress-text #lesson-list .lesson-link#lesson-link-ID (.done .active)', { en: 'sidebar', vi: 'thanh bên' }],
    ['#lesson-position #lesson-title #lesson-video #no-video #lesson-content', { en: 'lesson', vi: 'bài học' }],
    ['#prev-lesson #mark-complete #next-lesson #course-complete', { en: 'actions', vi: 'thao tác' }],
    ['#not-enrolled #lesson-not-found #no-content', { en: 'guards / empty', vi: 'chặn / rỗng' }],
    ['.my-course-progress', { en: 'progress on My Courses', vi: 'tiến độ ở My Courses' }],
  ],
  truDiem: [
    { en: '<code>completedLessons.push(id)</code> on Redux state then PUT the whole enrolment (sends the expanded <code>course</code> back into db.json).', vi: '<code>completedLessons.push(id)</code> trên state Redux rồi PUT cả lượt ghi danh (ghi luôn <code>course</code> đã _expand vào db.json).' },
    { en: 'Progress kept only in React state or localStorage — wrong on another browser and lost on My Courses.', vi: 'Tiến độ chỉ ở state React hay localStorage — sai ở trình duyệt khác và không lên My Courses.' },
  ],
});

const L4 = '/learn/1/lessons/4';
const KIEM = [
  // f1 — access & resume
  { nhom: 'f1', moTa: '/learn/1 resumes at the first unfinished lesson', url: '/learn/1', khoCucBo: dn(2), kiem: 'duong-dan', giaTri: L4 },
  { nhom: 'f1', moTa: 'Not enrolled ⇒ #not-enrolled', url: '/learn/4', khoCucBo: dn(2), kiem: 'ton-tai', selector: '#not-enrolled' },
  { nhom: 'f1', an: true, moTa: 'Guest ⇒ /login', url: '/learn/1', kiem: 'duong-dan', giaTri: '/login' },
  { nhom: 'f1', an: true, moTa: 'Lesson of another course ⇒ #lesson-not-found', url: '/learn/1/lessons/9', khoCucBo: dn(2), kiem: 'ton-tai', selector: '#lesson-not-found' },
  { nhom: 'f1', an: true, moTa: 'All lessons done ⇒ resume at lesson 1', url: '/learn/1', khoCucBo: dn(2), jsonServer: db1({ completedLessons: [1, 2, 3, 4, 5] }), kiem: 'duong-dan', giaTri: '/learn/1/lessons/1' },
  // f2 — lesson view
  { nhom: 'f2', moTa: 'Title and position', url: L4, khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#lesson-position, #lesson-title', mongDoi: ['Lesson 4 of 5', 'Props vs State'] },
  { nhom: 'f2', moTa: 'YouTube watch link converted to /embed/', url: L4, khoCucBo: dn(2), kiem: 'thuoc-tinh', selector: '#lesson-video', thuocTinh: 'src', giaTri: 'https://www.youtube.com/embed/IYvD9oBCuJI' },
  { nhom: 'f2', moTa: 'Lesson notes', url: L4, khoCucBo: dn(2), kiem: 'text', selector: '#lesson-content', khop: 'read-only data passed from a parent' },
  { nhom: 'f2', moTa: 'Sidebar: 5 lessons, 3 marked done', url: L4, khoCucBo: dn(2), kiem: 'so-luong', selector: '.lesson-link.done', giaTri: 3 },
  { nhom: 'f2', moTa: 'Next goes to lesson 5 (next chapter)', url: L4, khoCucBo: dn(2), kiem: 'duong-dan', giaTri: '/learn/1/lessons/5', truoc: [cho(), click('#next-lesson'), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'Previous is disabled on the first lesson', url: '/learn/1/lessons/1', khoCucBo: dn(2), kiem: 'thuoc-tinh-js', selector: '#prev-lesson', thuocTinh: 'disabled', giaTri: true },
  { nhom: 'f2', an: true, moTa: 'youtu.be links work too', url: '/learn/1/lessons/1', khoCucBo: dn(2), jsonServer: db1({}, { videoUrl: 'https://youtu.be/SqcY0GlETPk' }), kiem: 'thuoc-tinh', selector: '#lesson-video', thuocTinh: 'src', giaTri: 'https://www.youtube.com/embed/SqcY0GlETPk' },
  { nhom: 'f2', an: true, moTa: 'Unknown video link ⇒ #no-video', url: '/learn/1/lessons/1', khoCucBo: dn(2), jsonServer: db1({}, { videoUrl: 'https://vimeo.com/123' }), kiem: 'ton-tai', selector: '#no-video' },
  // f3 — mark complete
  { nhom: 'f3', moTa: 'Mark complete ⇒ "4/5 lessons completed (80%)"', url: L4, khoCucBo: dn(2), kiem: 'text', selector: '#progress-text', giaTri: '4/5 lessons completed (80%)', truoc: [cho(), click('#mark-complete'), cho()] },
  { nhom: 'f3', moTa: 'Saved on the server as a sorted array', url: L4, khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'enrollments', chat: true, chua: { id: 1, completedLessons: [1, 2, 3, 4] }, truoc: [cho(), click('#mark-complete'), cho()] },
  { nhom: 'f3', moTa: 'Button flips to "Mark as incomplete"', url: L4, khoCucBo: dn(2), kiem: 'text', selector: '#mark-complete', giaTri: 'Mark as incomplete', truoc: [cho(), click('#mark-complete'), cho()] },
  { nhom: 'f3', moTa: 'Un-marking lesson 2 ⇒ [1, 3] and 40%', url: '/learn/1/lessons/2', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#progress-text, #mark-complete', mongDoi: ['2/5 lessons completed (40%)', 'Mark as complete'], truoc: [cho(), click('#mark-complete'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Un-marking is saved too', url: '/learn/1/lessons/2', khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'enrollments', chat: true, chua: { id: 1, completedLessons: [1, 3] }, truoc: [cho(), click('#mark-complete'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Progress survives a reload', url: L4, khoCucBo: dn(2), kiem: 'text', selector: '#progress-text', giaTri: '4/5 lessons completed (80%)', truoc: [cho(), click('#mark-complete'), cho(), taiLai, cho()] },
  { nhom: 'f3', an: true, moTa: 'Finishing the course shows #course-complete', url: L4, khoCucBo: dn(2), kiem: 'ton-tai', selector: '#course-complete', truoc: [cho(), click('#mark-complete'), cho(), click('#next-lesson'), cho(), click('#mark-complete'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Uses PATCH /enrollments/:id', url: L4, khoCucBo: dn(2), kiem: 'goi-fetch', khop: '^PATCH .*/enrollments/1$', truoc: [cho(), click('#mark-complete'), cho()] },
  // f4 — My Courses
  { nhom: 'f4', moTa: 'My Courses shows 0% and 60%', url: '/my-courses', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.my-course-progress', mongDoi: ['0%', '60%'] },
  { nhom: 'f4', moTa: 'Learn page progress bar label', url: L4, khoCucBo: dn(2), kiem: 'text', selector: '#progress-bar', giaTri: '60%' },
  // f5 — structure
  { nhom: 'f5', moTa: 'toEmbedUrl / calcProgress live in utils/learning.js', kiem: 'ma-nguon', tep: 'src/utils/learning.js', khop: '(?=[\\s\\S]*export\\s+function\\s+toEmbedUrl)(?=[\\s\\S]*export\\s+function\\s+calcProgress)' },
  { nhom: 'f5', an: true, moTa: 'LearnPage does not call axios directly', kiem: 'ma-nguon', tep: 'src/pages/LearnPage.js', khop: 'from\\s+[\'"]axios[\'"]', phuDinh: true },
];

export default doiDau(moduleF({
  k: 6, phut: 150, banIn: BAN_IN, kiem: KIEM, url: L4,
  baiHoc: 'fer202-8-1-usestate-useeffect',
  khaiNiem: ['nested data → flat list', 'Navigate replace (resume)', 'YouTube embed URL', 'PATCH partial update', 'immutable array update', 'derived progress %'],
  viDu: [{ input: 'an@codelearn.vn on /learn/1/lessons/4 clicks "Mark as complete"', output: 'PATCH /enrollments/1 { completedLessons: [1, 2, 3, 4] } · "4/5 lessons completed (80%)"', explanation: 'The new array is built from a Set, sorted, then saved; the UI updates from the server reply.|||Mảng mới dựng từ Set, sắp rồi lưu; giao diện cập nhật theo bản máy chủ trả về.' }],
  thuatNgu: [{ en: 'resume', vi: 'học tiếp từ chỗ dở' }, { en: 'embed URL', vi: 'đường dẫn dùng để nhúng (iframe)' }, { en: 'PATCH', vi: 'cập nhật MỘT PHẦN bản ghi (chỉ gửi trường đổi)' }],
  goiY: [
    'Dữ liệu: dùng lại <code>fetchCourseDetail</code> (F4) và <code>fetchMyEnrollments</code> (F5). Trải phẳng: <code>const lessons = useMemo(() =&gt; chapters.flatMap(ch =&gt; ch.lessons), [chapters])</code> ⇒ vị trí, Trước/Sau, % đều từ mảng này.',
    'Học tiếp: <code>if (!lessonId) return &lt;Navigate to={`/learn/${courseId}/lessons/${resume.id}`} replace /&gt;</code> với <code>resume = lessons.find(l =&gt; !done.includes(l.id)) ?? lessons[0]</code>. Nhớ chỉ quyết định khi CẢ hai dữ liệu đã tải xong và đúng khoá.',
    'Thunk toggle: <code>const s = new Set(e.completedLessons); s.has(id) ? s.delete(id) : s.add(id); return enrollApi.updateProgress(e.id, [...s].sort((a,b) =&gt; a-b))</code>; reducer fulfilled chỉ thay <code>completedLessons</code> của đúng lượt ghi danh (giữ <code>course</code>). YouTube: regex lấy 11 ký tự id sau <code>watch?v=</code> / <code>youtu.be/</code>.',
  ],
  loiHayGap: [
    'Nhúng thẳng link <code>watch?v=</code> vào iframe ⇒ khung đen "www.youtube.com refused to connect".',
    '<code>enrollment.completedLessons.push(id)</code> trên dữ liệu Redux ⇒ lỗi read-only (Immer) hoặc không re-render.',
    'PUT cả object lượt ghi danh lấy từ <code>_expand</code> ⇒ db.json bị ghi thêm trường <code>course</code> lồng nhau.',
    'Tính % bằng <code>completedLessons.length / lessons.length</code> mà không lọc bài còn trong khoá ⇒ &gt; 100% sau khi admin xoá bài.',
    'Chỉ ẩn link "Continue learning" mà không kiểm ghi danh trong LearnPage ⇒ gõ URL là học được khoá chưa đăng ký.',
    'Redirect "học tiếp" khi dữ liệu còn của khoá trang trước ⇒ nhảy sai bài; kiểm <code>detail.course.id === Number(courseId)</code>.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> The page reuses two thunks (course detail, my enrolments) and waits until both are loaded <i>for this course</i>. The nested curriculum is flattened once with <code>useMemo</code>; everything else — current index, Previous/Next, resume target, done count, percentage — is derived from that list and <code>completedLessons</code>. Guards come first (not enrolled, empty course, unknown lesson), then the resume redirect is rendered as <code>&lt;Navigate replace&gt;</code>. Toggling builds a new sorted array from a <code>Set</code> and PATCHes only that field; the reducer replaces the field on the matching enrolment, so My Courses (which also reads <code>totals</code> from <code>GET /lessons?courseId=…</code>) shows the same %. <code>toEmbedUrl</code> extracts the 11-character id from watch, short or embed links.</p>',
    vi: '<p><b>Hướng giải.</b> Trang dùng lại hai thunk (chi tiết khoá, lượt ghi danh của tôi) và chờ cả hai tải xong <i>đúng khoá này</i>. Chương trình học lồng nhau được trải phẳng một lần bằng <code>useMemo</code>; mọi thứ khác — vị trí bài, Trước/Sau, bài học tiếp, số bài xong, phần trăm — suy ra từ danh sách đó và <code>completedLessons</code>. Các lớp chặn đặt trước (chưa ghi danh, khoá rỗng, bài lạ), sau đó chuyển hướng học tiếp bằng cách render <code>&lt;Navigate replace&gt;</code>. Bật/tắt hoàn thành dựng mảng mới đã sắp từ một <code>Set</code> và chỉ PATCH trường đó; reducer thay đúng trường của lượt ghi danh tương ứng ⇒ My Courses (đọc thêm <code>totals</code> từ <code>GET /lessons?courseId=…</code>) hiện cùng một %. <code>toEmbedUrl</code> rút 11 ký tự id từ link watch, link ngắn hay link embed.</p>',
  },
}));
