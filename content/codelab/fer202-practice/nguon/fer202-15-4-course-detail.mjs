/**
 * CodeLearn · F4 — chi tiết khoá học: route /courses/:id, chương ▸ bài qua _embed, bản nháp / id lạ ⇒ không tìm thấy.
 */
import { doiDau } from './_chung.mjs';
import { B, DB, banInF, bang, click, cho, dn, moduleF } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>Each card's "View details" opens <code>/courses/:id</code>. Show the course information and its <b>curriculum</b>: chapters in <code>order</code>, each with its lessons in <code>order</code> and their durations, plus a total line. json-server 0.17 can nest children for you: <code>GET /chapters?courseId=1&amp;_embed=lessons</code> returns every chapter with a <code>lessons</code> array (child key <code>chapterId</code>).</p>
<h3>API calls</h3>${bang(['Request', 'Why'], [
    ['<code>GET /courses/:id</code>', 'course fields; 404 ⇒ not found'],
    ['<code>GET /chapters?courseId=:id&amp;_embed=lessons&amp;_sort=order</code>', 'chapters + nested lessons (sort the lessons yourself — <code>_embed</code> does not)'],
    ['<code>GET /categories</code> (or reuse the store)', 'category <b>name</b> — note: <code>_expand=category</code> needs a <code>categories</code> collection lookup that some json-server builds get wrong; a plain lookup is safer'],
  ])}
<h3>Edge cases</h3><ul><li>Unknown id (<code>/courses/99</code>) and <b>drafts</b> (<code>published:false</code>) ⇒ <code>#course-not-found</code> "Course not found." for everyone except an admin.</li><li>A course with no chapters ⇒ <code>#no-content</code> "Curriculum coming soon." and "0 lessons · 0 min".</li><li><code>useParams()</code> returns strings: <code>"1"</code>, not <code>1</code>.</li><li>Navigating from course 1 to course 2 must not flash course 1's data.</li></ul>`,
  vi: `<p>Nút "View details" của mỗi thẻ mở <code>/courses/:id</code>. Hiện thông tin khoá và <b>chương trình học</b>: các chương theo <code>order</code>, mỗi chương có các bài theo <code>order</code> kèm thời lượng, và một dòng tổng. json-server 0.17 lồng bản ghi con giúp bạn: <code>GET /chapters?courseId=1&amp;_embed=lessons</code> trả mỗi chương kèm mảng <code>lessons</code> (khoá con <code>chapterId</code>).</p>
<h3>Lời gọi API</h3>${bang(['Request', 'Để làm gì'], [
    ['<code>GET /courses/:id</code>', 'thông tin khoá; 404 ⇒ không tìm thấy'],
    ['<code>GET /chapters?courseId=:id&amp;_embed=lessons&amp;_sort=order</code>', 'các chương + bài lồng bên trong (tự sắp bài — <code>_embed</code> không sắp)'],
    ['<code>GET /categories</code> (hoặc dùng lại store)', '<b>tên</b> danh mục — tra bằng id cho chắc thay vì <code>_expand=category</code>'],
  ])}
<h3>Trường hợp biên</h3><ul><li>Id lạ (<code>/courses/99</code>) và <b>bản nháp</b> (<code>published:false</code>) ⇒ <code>#course-not-found</code> "Course not found." với mọi người trừ admin.</li><li>Khoá chưa có chương ⇒ <code>#no-content</code> "Curriculum coming soon." và "0 lessons · 0 min".</li><li><code>useParams()</code> trả chuỗi: <code>"1"</code>, không phải <code>1</code>.</li><li>Chuyển từ khoá 1 sang khoá 2 không được nháy dữ liệu khoá 1.</li></ul>`,
};

const BAN_IN = banInF({
  k: 4, phut: 75, moTa: MO_TA, bangDuLieu: ['chapters', 'lessons'], soDong: 3,
  wireframe: `
/courses/1
← All courses                                            (#back-to-courses)
┌───────────────────────────────────────────────┬─────────────────────┐
│ React for Beginners                (#course-title) │ Free  (#course-price)│
│ [Frontend] Beginner · by Hoang Cuong (#course-meta)│                     │
│ Build your first React apps…  (#course-description)│ (enrol box — F5)    │
│ Curriculum                                    │                     │
│ 5 lessons · 62 min                 (#lesson-count) │                     │
│ ┌ Chapter 1: Getting Started with React ──┐ .chapter / .chapter-title │
│ │ ▶ What is React?                  8 min │ .lesson-item             │
│ │ ▶ Create React App & project…    12 min │                          │
│ └─────────────────────────────────────────┘                          │
│ ┌ Chapter 2: Components, Props & State ───┐                          │
└───────────────────────────────────────────────┴─────────────────────┘`,
  chucNang: [
    { ten: { en: 'Route & course data', vi: 'Route & dữ liệu khoá' }, diem: 2.5, yeuCau: [
      { en: 'Route <code>/courses/:id</code> → <code>pages/CourseDetailPage.js</code>: <code>#course-title</code>, <code>#course-meta</code> (category name · level · "by" instructor), <code>#course-description</code>, <code>#course-price</code> (Free / "199.000 ₫").', vi: 'Route <code>/courses/:id</code> → <code>pages/CourseDetailPage.js</code>: <code>#course-title</code>, <code>#course-meta</code> (tên danh mục · cấp độ · "by" giảng viên), <code>#course-description</code>, <code>#course-price</code> (Free / "199.000 ₫").' },
    ], hook: ['useParams', 'useEffect'] },
    { ten: { en: 'Curriculum with _embed', vi: 'Chương trình học bằng _embed' }, diem: 3, yeuCau: [
      { en: 'One <code>.chapter#chapter-&lt;id&gt;</code> per chapter with <code>.chapter-title</code> "Chapter N: title" (N = position after sorting by <code>order</code>), lessons as <code>.lesson-item</code> sorted by <code>order</code> with "M min"; <code>#lesson-count</code> "X lessons · Y min".', vi: 'Mỗi chương một <code>.chapter#chapter-&lt;id&gt;</code> có <code>.chapter-title</code> "Chapter N: tên" (N = vị trí sau khi sắp theo <code>order</code>), bài là <code>.lesson-item</code> sắp theo <code>order</code> kèm "M min"; <code>#lesson-count</code> "X lessons · Y min".' },
    ], hook: ['_embed', 'reduce'], viDu: 'course 1 ⇒ "5 lessons · 62 min" · Chapter 1: Getting Started with React · Chapter 2: Components, Props & State · Chapter 3: Hooks in Practice' },
    { ten: { en: 'Not found, drafts & empty', vi: 'Không tìm thấy, bản nháp & rỗng' }, diem: 2, yeuCau: [
      { en: '404 or draft (non-admin) ⇒ <code>#course-not-found</code> "Course not found."; no chapters ⇒ <code>#no-content</code>; loading ⇒ spinner (no crash on <code>course === null</code>).', vi: '404 hoặc bản nháp (không phải admin) ⇒ <code>#course-not-found</code> "Course not found."; không có chương ⇒ <code>#no-content</code>; đang tải ⇒ spinner (không sập khi <code>course === null</code>).' },
    ] },
    { ten: { en: 'Redux & structure', vi: 'Redux & cấu trúc' }, diem: 1.5, yeuCau: [
      { en: '<code>coursesSlice</code>: thunk <code>fetchCourseDetail(id)</code> + <code>detail: { course, chapters, status, error }</code> (pending clears the old course; 404 ⇒ <code>rejectWithValue("notFound")</code>); API functions in <code>courseApi</code>.', vi: '<code>coursesSlice</code>: thunk <code>fetchCourseDetail(id)</code> + <code>detail: { course, chapters, status, error }</code> (pending xoá khoá cũ; 404 ⇒ <code>rejectWithValue("notFound")</code>); hàm API ở <code>courseApi</code>.' },
    ], hook: ['rejectWithValue'] },
    { ten: { en: 'Navigation', vi: 'Điều hướng' }, diem: 1, yeuCau: [
      { en: '<code>.btn-detail</code> on the list opens the page; <code>#back-to-courses</code> returns to <code>/courses</code>.', vi: '<code>.btn-detail</code> ở danh sách mở trang; <code>#back-to-courses</code> quay về <code>/courses</code>.' },
    ] },
  ],
  idBatBuoc: [
    ['#course-title #course-meta #course-description #course-price #enroll-card', { en: 'course information', vi: 'thông tin khoá' }],
    ['#lesson-count · .chapter#chapter-ID · .chapter-title · .lesson-item', { en: 'curriculum', vi: 'chương trình học' }],
    ['#course-not-found · #no-content · #back-to-courses', { en: 'states + back link', vi: 'trạng thái + link quay lại' }],
  ],
  truDiem: [
    { en: 'Fetching every lesson of the database and filtering in the browser instead of asking by course.', vi: 'Tải mọi bài học của CSDL rồi lọc ở trình duyệt thay vì hỏi theo khoá.' },
    { en: '<code>course.title</code> read before the data arrives ⇒ "Cannot read properties of null".', vi: 'Đọc <code>course.title</code> trước khi có dữ liệu ⇒ "Cannot read properties of null".' },
  ],
});

// db với chương/bài bị đảo thứ tự trong mảng — trang vẫn phải hiện theo "order"
const DAO = { base: B, db: { ...DB, chapters: [...DB.chapters].reverse(), lessons: [...DB.lessons].reverse() } };

const KIEM = [
  // f1 — route & data
  { nhom: 'f1', moTa: '"View details" opens /courses/9', url: '/courses', kiem: 'duong-dan', giaTri: '/courses/9', truoc: [cho(), click('#course-9 .btn-detail'), cho()] },
  { nhom: 'f1', moTa: 'Title, description and price of course 1', url: '/courses/1', kiem: 'danh-sach-text', selector: '#course-title, #course-description, #course-price', mongDoi: ['React for Beginners', DB.courses[0].description, 'Free'] },
  { nhom: 'f1', moTa: 'Meta line: category name · level · instructor', url: '/courses/1', kiem: 'text', selector: '#course-meta', khop: 'Frontend[\\s\\S]*Beginner[\\s\\S]*Hoang Cuong' },
  { nhom: 'f1', an: true, moTa: 'Paid course price "199.000 ₫"', url: '/courses/3', kiem: 'text', selector: '#course-price', giaTri: '199.000 ₫' },
  // f2 — curriculum
  { nhom: 'f2', moTa: '3 chapter titles in order', url: '/courses/1', kiem: 'danh-sach-text', selector: '.chapter-title', mongDoi: ['Chapter 1: Getting Started with React', 'Chapter 2: Components, Props & State', 'Chapter 3: Hooks in Practice'] },
  { nhom: 'f2', moTa: '5 lessons', url: '/courses/1', kiem: 'so-luong', selector: '.lesson-item', giaTri: 5 },
  { nhom: 'f2', moTa: 'Chapter 2 lists its lessons with durations', url: '/courses/1', kiem: 'text', selector: '#chapter-2', khop: 'JSX and components[\\s\\S]*15 min[\\s\\S]*Props vs State[\\s\\S]*14 min' },
  { nhom: 'f2', moTa: 'Total: "5 lessons · 62 min"', url: '/courses/1', kiem: 'text', selector: '#lesson-count', giaTri: '5 lessons · 62 min' },
  { nhom: 'f2', an: true, moTa: 'Sorted by "order" even when the server returns another order', url: '/courses/1', jsonServer: DAO, kiem: 'danh-sach-text', selector: '.chapter-title', mongDoi: ['Chapter 1: Getting Started with React', 'Chapter 2: Components, Props & State', 'Chapter 3: Hooks in Practice'] },
  { nhom: 'f2', an: true, moTa: 'Lessons inside a chapter sorted by "order"', url: '/courses/1', jsonServer: DAO, kiem: 'text', selector: '#chapter-1', khop: 'What is React\\?[\\s\\S]*Create React App' },
  { nhom: 'f2', an: true, moTa: 'Curriculum requested with _embed=lessons', url: '/courses/1', kiem: 'goi-fetch', khop: 'GET .*/chapters\\?.*_embed=lessons' },
  // f3 — not found / drafts / empty
  { nhom: 'f3', moTa: 'Unknown id ⇒ "Course not found."', url: '/courses/99', kiem: 'text', selector: '#course-not-found', khop: 'Course not found' },
  { nhom: 'f3', moTa: 'Course without chapters ⇒ "Curriculum coming soon."', url: '/courses/2', kiem: 'danh-sach-text', selector: '#lesson-count, #no-content', mongDoi: ['0 lessons · 0 min', 'Curriculum coming soon.'] },
  { nhom: 'f3', an: true, moTa: 'Draft course is hidden from guests', url: '/courses/10', kiem: 'ton-tai', selector: '#course-not-found' },
  { nhom: 'f3', an: true, moTa: 'An admin can preview a draft', url: '/courses/10', khoCucBo: dn(1), kiem: 'text', selector: '#course-title', giaTri: 'MongoDB Basics' },
  // f4 — redux & structure
  { nhom: 'f4', moTa: 'Detail loaded through a thunk in coursesSlice', kiem: 'ma-nguon', tep: 'src/features/courses/coursesSlice.js', khop: 'createAsyncThunk\\(\\s*[\'"]courses/[\\s\\S]*createAsyncThunk\\(\\s*[\'"]courses/' },
  { nhom: 'f4', moTa: 'Page uses useParams and has no axios import', kiem: 'ma-nguon', tep: 'src/pages/CourseDetailPage.js', khop: '^(?=[\\s\\S]*useParams)(?![\\s\\S]*from\\s+[\'"]axios[\'"])' },
  { nhom: 'f4', an: true, moTa: 'Switching course does not keep the old title', url: '/courses/1', kiem: 'text', selector: '#course-title', giaTri: 'JavaScript Essentials', truoc: [cho(), click('#back-to-courses'), cho(), click('#page-2'), cho(200), click('#course-3 .btn-detail'), cho()] },
  // f5 — navigation
  { nhom: 'f5', moTa: '"← All courses" goes back to /courses', url: '/courses/1', kiem: 'duong-dan', giaTri: '/courses', truoc: [cho(), click('#back-to-courses'), cho(200)] },
];

export default doiDau(moduleF({
  k: 4, phut: 75, doKho: 'MEDIUM', banIn: BAN_IN, kiem: KIEM, url: '/courses/1',
  baiHoc: 'fer202-9-ex21-resource-ids',
  khaiNiem: ['route parameter :id', 'json-server _embed', 'sorting nested data', 'not found vs draft', 'detail state in a slice'],
  viDu: [{ input: '/courses/2 (no chapters yet)', output: '"0 lessons · 0 min" + "Curriculum coming soon."', explanation: 'An empty curriculum is a normal state, not an error.|||Chưa có chương là trạng thái bình thường, không phải lỗi.' }],
  thuatNgu: [{ en: '_embed', vi: 'json-server: nhúng các bản ghi con (có khoá <cha>Id) vào kết quả' }, { en: 'draft', vi: 'bản nháp — chưa xuất bản' }, { en: 'route parameter', vi: 'phần động của đường dẫn (:id)' }],
  goiY: [
    'Thêm vào courseApi: <code>getCourse(id)</code> và <code>getCurriculum(courseId)</code> = <code>GET /chapters</code> với <code>params: { courseId, _embed: "lessons", _sort: "order" }</code>.',
    'Thunk: <code>Promise.all([getCourse(id), getCurriculum(id), getCategories()])</code>; trong <code>catch</code>: <code>if (err.response?.status === 404) return rejectWithValue("notFound")</code>. Bản nháp: <code>if (!course.published &amp;&amp; getState().auth.user?.role !== "admin") return rejectWithValue("notFound")</code>.',
    'Sắp: <code>chapters.slice().sort((a,b) =&gt; a.order - b.order).map(ch =&gt; ({ ...ch, lessons: ch.lessons.slice().sort(...) }))</code>. Tổng: <code>reduce</code> hai tầng. Trong pending đặt <code>detail.course = null</code> để không nháy khoá cũ.',
  ],
  loiHayGap: [
    'Quên rằng <code>useParams()</code> trả CHUỖI ⇒ <code>courses.find(c =&gt; c.id === id)</code> không bao giờ khớp.',
    '<code>useEffect(() =&gt; { … }, [])</code> thiếu <code>id</code> trong deps ⇒ đổi từ /courses/1 sang /courses/2 (cùng component) không tải lại.',
    'Hiện nguyên mảng <code>_embed</code> theo thứ tự máy chủ trả ⇒ chương/bài lộn xộn khi dữ liệu được thêm sau.',
    'Không chặn bản nháp ⇒ học viên gõ /courses/10 xem được khoá chưa xuất bản.',
    'Đọc <code>course.title</code> khi <code>course</code> còn null (lần render đầu) ⇒ màn trắng.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> <code>fetchCourseDetail</code> loads course, curriculum (<code>_embed=lessons</code>) and categories in parallel. A 404 or a draft (for non-admins) becomes <code>rejectWithValue("notFound")</code>, so the page has one clear "not found" branch. The thunk sorts chapters and their nested lessons by <code>order</code> on copies; <code>pending</code> resets <code>detail</code> so the previous course never flashes. The page renders loading → not found → data, computes the totals with <code>reduce</code>, and numbers chapters by their position.</p>',
    vi: '<p><b>Hướng giải.</b> <code>fetchCourseDetail</code> tải khoá, chương trình học (<code>_embed=lessons</code>) và danh mục song song. 404 hoặc bản nháp (người không phải admin) thành <code>rejectWithValue("notFound")</code> ⇒ trang có đúng một nhánh "không tìm thấy". Thunk sắp chương và bài lồng bên trong theo <code>order</code> trên bản sao; <code>pending</code> đặt lại <code>detail</code> để khoá trước không nháy. Trang vẽ đang tải → không tìm thấy → dữ liệu, tính tổng bằng <code>reduce</code> và đánh số chương theo vị trí.</p>',
  },
}));
