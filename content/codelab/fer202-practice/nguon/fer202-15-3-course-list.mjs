/**
 * CodeLearn · F3 — danh sách khoá học: Redux thunk, lọc danh mục/cấp độ/giá, tìm, sắp xếp, phân trang, tham số URL.
 */
import { doiDau } from './_chung.mjs';
import { B, DB, banInF, bang, click, cho, doi, moduleF, nhap } from './_codelearn.mjs';

const T = (...ds) => ds;
const PAGE1 = T('TypeScript in Practice', 'Flutter Mobile Apps', 'PostgreSQL Performance Tuning', 'SQL Server for Developers', 'Spring Boot Fundamentals', 'Node.js & Express REST APIs');

const MO_TA = {
  en: `<p>Replace the Courses placeholder with the real catalogue. Load the <b>published</b> courses and the categories through a Redux thunk, show them as React-Bootstrap cards (3 per row on desktop), and let the visitor narrow the list: category, level, price (free / paid), a search box (title or instructor), a sort order and pages of <b>6</b>. All of that state lives in the <b>URL query string</b>, so <code>/courses?category=1&amp;level=Intermediate</code> can be bookmarked and the Back button works.</p>
<h3>API calls</h3>${bang(['When', 'Request'], [['page opens (once)', '<code>GET /courses?published=true</code> + <code>GET /categories</code> in parallel (<code>Promise.all</code>)']])}
<p>Filtering, search, sort and paging may be done on the client (the list is small) — they must be <b>derived</b> from the loaded list + URL, not stored as extra state.</p>
<h3>URL parameters</h3>${bang(['Param', 'Values', 'Default'], [['<code>category</code>', 'category id', 'all'], ['<code>level</code>', 'Beginner · Intermediate · Advanced', 'all'], ['<code>price</code>', '<code>free</code> (price 0) · <code>paid</code> (price &gt; 0)', 'all'], ['<code>q</code>', 'text, trimmed, case-insensitive, in title or instructor', '—'], ['<code>sort</code>', '<code>newest</code> (createdAt desc) · <code>price-asc</code> · <code>price-desc</code> · <code>title</code> (A→Z)', 'newest'], ['<code>page</code>', '1, 2, … (clamped to the last page)', '1']])}
<h3>Edge cases</h3><ul><li>Changing any filter, the search or the sort goes back to page 1.</li><li>No match ⇒ <code>#no-results</code>; draft courses never appear; <code>?page=99</code> shows the last page.</li><li>Server down ⇒ <code>#courses-error</code> with a <code>#retry</code> button; slow server ⇒ <code>#courses-loading</code>.</li></ul>`,
  vi: `<p>Thay trang Courses giữ chỗ bằng danh mục thật. Tải các khoá <b>đã xuất bản</b> và danh mục qua thunk Redux, hiện dạng thẻ React-Bootstrap (3 thẻ/hàng trên máy tính), cho người xem thu hẹp danh sách: danh mục, cấp độ, giá (miễn phí / trả phí), ô tìm (tên khoá hoặc giảng viên), thứ tự sắp và trang <b>6</b> khoá. Mọi trạng thái đó nằm trên <b>query string của URL</b> ⇒ <code>/courses?category=1&amp;level=Intermediate</code> lưu được, nút Back chạy đúng.</p>
<h3>Lời gọi API</h3>${bang(['Khi nào', 'Request'], [['mở trang (một lần)', '<code>GET /courses?published=true</code> + <code>GET /categories</code> song song (<code>Promise.all</code>)']])}
<p>Lọc, tìm, sắp, phân trang làm ở client cũng được (danh sách nhỏ) — nhưng phải <b>suy ra</b> từ danh sách đã tải + URL, không lưu thành state riêng.</p>
<h3>Tham số URL</h3>${bang(['Tham số', 'Giá trị', 'Mặc định'], [['<code>category</code>', 'id danh mục', 'tất cả'], ['<code>level</code>', 'Beginner · Intermediate · Advanced', 'tất cả'], ['<code>price</code>', '<code>free</code> (giá 0) · <code>paid</code> (giá &gt; 0)', 'tất cả'], ['<code>q</code>', 'chữ, bỏ khoảng trắng hai đầu, không phân biệt hoa/thường, trong tên khoá hoặc giảng viên', '—'], ['<code>sort</code>', '<code>newest</code> (createdAt giảm) · <code>price-asc</code> · <code>price-desc</code> · <code>title</code> (A→Z)', 'newest'], ['<code>page</code>', '1, 2, … (kẹp về trang cuối)', '1']])}
<h3>Trường hợp biên</h3><ul><li>Đổi bộ lọc, ô tìm hay thứ tự sắp ⇒ về trang 1.</li><li>Không khớp ⇒ <code>#no-results</code>; khoá nháp không bao giờ hiện; <code>?page=99</code> hiện trang cuối.</li><li>Máy chủ chết ⇒ <code>#courses-error</code> có nút <code>#retry</code>; máy chủ chậm ⇒ <code>#courses-loading</code>.</li></ul>`,
};

const BAN_IN = banInF({
  k: 3, phut: 150, moTa: MO_TA, bangDuLieu: ['categories', 'courses'], soDong: 4,
  wireframe: `
/courses?category=1&sort=price-asc
┌──────────────────────────────────────────────────────────────────────────┐
│ Courses                                                                  │
│ ┌ Search ─────────────┐ ┌Category▾┐ ┌Level▾┐ ┌Price▾┐ ┌Sort by▾────────┐ │
│ │ title or instructor │ │Frontend │ │ All  │ │ All  │ │Price: low→high │ │
│ └─────────────────────┘ └─────────┘ └──────┘ └──────┘ └────────────────┘ │
│                                                          Clear filters   │
│ 4 courses found                                         (#result-count)  │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                       │
│ │     RB       │ │     JE       │ │     TP       │   .course-card        │
│ │[Frontend][Beginner]           │ │              │   .course-category    │
│ │React for Beg…│ │JavaScript E… │ │TypeScript i… │   .course-title       │
│ │by Hoang Cuong│ │by Tran Minh  │ │by Tran Minh  │   .course-instructor  │
│ │Free [View ▸] │ │199.000 ₫ [▸] │ │299.000 ₫ [▸] │   .course-price .btn-detail │
│ └──────────────┘ └──────────────┘ └──────────────┘                       │
│                 ‹  1  2  ›            (#pagination, #page-1, #page-2)    │
└──────────────────────────────────────────────────────────────────────────┘`,
  chucNang: [
    { ten: { en: 'Load with Redux', vi: 'Tải bằng Redux' }, diem: 2, yeuCau: [
      { en: '<code>features/courses/coursesSlice.js</code>: thunk <code>fetchCatalog</code> (courses + categories), state <code>{ items, categories, status, error }</code>; add <code>courses</code> to the store. The page reads with <code>useSelector</code> and fetches once (<code>status === "idle"</code>).', vi: '<code>features/courses/coursesSlice.js</code>: thunk <code>fetchCatalog</code> (courses + categories), state <code>{ items, categories, status, error }</code>; thêm <code>courses</code> vào store. Trang đọc bằng <code>useSelector</code> và chỉ tải một lần (<code>status === "idle"</code>).' },
      { en: 'Loading ⇒ <code>#courses-loading</code>; failure ⇒ <code>#courses-error</code> + <code>#retry</code> (dispatches again).', vi: 'Đang tải ⇒ <code>#courses-loading</code>; lỗi ⇒ <code>#courses-error</code> + <code>#retry</code> (dispatch lại).' },
    ], hook: ['createAsyncThunk', 'useSelector', 'useDispatch'] },
    { ten: { en: 'Course card', vi: 'Thẻ khoá học' }, diem: 1.5, yeuCau: [
      { en: '<code>components/CourseCard.js</code>: <code>.course-card#course-&lt;id&gt;</code> with <code>.course-title</code>, <code>.course-category</code> (category <b>name</b>), <code>.course-level</code>, <code>.course-instructor</code> "by …", <code>.course-price</code> ("Free" or "199.000 ₫"), <code>.btn-detail</code> link to <code>/courses/:id</code>.', vi: '<code>components/CourseCard.js</code>: <code>.course-card#course-&lt;id&gt;</code> có <code>.course-title</code>, <code>.course-category</code> (<b>tên</b> danh mục), <code>.course-level</code>, <code>.course-instructor</code> "by …", <code>.course-price</code> ("Free" hoặc "199.000 ₫"), link <code>.btn-detail</code> tới <code>/courses/:id</code>.' },
    ], hook: ['Card', 'Badge'] },
    { ten: { en: 'Filters', vi: 'Bộ lọc' }, diem: 2.5, yeuCau: [
      { en: '<code>#filter-category</code> (option values = category ids), <code>#filter-level</code>, <code>#filter-price</code> (<code>""</code>/<code>free</code>/<code>paid</code>) combine with AND; <code>#clear-filters</code> resets everything; <code>#result-count</code> "N courses found" ("1 course found").', vi: '<code>#filter-category</code> (value = id danh mục), <code>#filter-level</code>, <code>#filter-price</code> (<code>""</code>/<code>free</code>/<code>paid</code>) kết hợp kiểu VÀ; <code>#clear-filters</code> xoá hết; <code>#result-count</code> "N courses found" ("1 course found").' },
    ], hook: ['useSearchParams'] },
    { ten: { en: 'Search & sort', vi: 'Tìm & sắp xếp' }, diem: 2, yeuCau: [
      { en: '<code>#search</code>: trimmed, case-insensitive, matches title OR instructor. <code>#sort</code> values <code>newest</code> · <code>price-asc</code> · <code>price-desc</code> · <code>title</code>; sort a <b>copy</b>.', vi: '<code>#search</code>: bỏ khoảng trắng hai đầu, không phân biệt hoa/thường, khớp tên khoá HOẶC giảng viên. <code>#sort</code> giá trị <code>newest</code> · <code>price-asc</code> · <code>price-desc</code> · <code>title</code>; sắp trên <b>bản sao</b>.' },
    ], hook: ['useMemo'], viDu: 'search "  REACT " ⇒ Advanced React Patterns, React for Beginners' },
    { ten: { en: 'Pagination & URL', vi: 'Phân trang & URL' }, diem: 2, yeuCau: [
      { en: '6 per page; <code>#pagination</code> (React-Bootstrap) with <code>#page-1</code>, <code>#page-2</code>… shown only when there is more than one page; filters/search/sort/page are read from and written to the URL; any filter change ⇒ page 1.', vi: '6 khoá/trang; <code>#pagination</code> (React-Bootstrap) với <code>#page-1</code>, <code>#page-2</code>… chỉ hiện khi có hơn một trang; bộ lọc/tìm/sắp/trang đọc và ghi trên URL; đổi bộ lọc ⇒ về trang 1.' },
    ], hook: ['Pagination'] },
  ],
  idBatBuoc: [
    ['#courses-title · #result-count · #no-results', { en: 'page heading, count, empty state', vi: 'tiêu đề, số kết quả, trạng thái rỗng' }],
    ['#search #filter-category #filter-level #filter-price #sort #clear-filters', { en: 'filter bar', vi: 'thanh lọc' }],
    ['.course-card#course-ID .course-title .course-category .course-level .course-instructor .course-price .btn-detail', { en: 'course card', vi: 'thẻ khoá học' }],
    ['#pagination #page-N', { en: 'pager (id on each Pagination.Item)', vi: 'phân trang (id trên từng Pagination.Item)' }],
    ['#courses-loading · #courses-error · #retry', { en: 'loading / error states', vi: 'trạng thái đang tải / lỗi' }],
  ],
  truDiem: [
    { en: 'Filtered list kept in its own state and updated in a useEffect — out of sync, extra renders.', vi: 'Danh sách đã lọc giữ trong state riêng, cập nhật bằng useEffect — lệch dữ liệu, render thừa.' },
    { en: '<code>list.sort()</code> directly on the Redux array (throws: state is frozen).', vi: '<code>list.sort()</code> thẳng trên mảng Redux (lỗi: state bị đóng băng).' },
    { en: 'Category shown as its id ("1") instead of its name.', vi: 'Hiện id danh mục ("1") thay vì tên.' },
  ],
});

const KHONG_COURSES = { base: B, db: { ...DB, courses: undefined } };
const KIEM = [
  // f1 — load with redux
  { nhom: 'f1', moTa: '"9 courses found" — published only', url: '/courses', kiem: 'text', selector: '#result-count', giaTri: '9 courses found' },
  { nhom: 'f1', moTa: 'Newest first, 6 cards on page 1', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: PAGE1 },
  { nhom: 'f1', moTa: 'Spinner while the server is slow', url: '/courses', jsonServer: { base: B, db: DB, treMs: 1500 }, kiem: 'ton-tai', selector: '#courses-loading' },
  { nhom: 'f1', moTa: 'Server error ⇒ #courses-error; Retry calls the API again', url: '/courses', jsonServer: KHONG_COURSES, kiem: 'goi-fetch', khop: 'GET .*/courses', min: 2, truoc: [cho(), click('#retry'), cho()] },
  { nhom: 'f1', an: true, moTa: 'Error message shown', url: '/courses', jsonServer: KHONG_COURSES, kiem: 'ton-tai', selector: '#courses-error' },
  { nhom: 'f1', an: true, moTa: 'Slice uses createAsyncThunk; page uses useSelector', kiem: 'ma-nguon', khop: '(?=[\\s\\S]*createAsyncThunk\\(\\s*[\'"]courses/)', tep: 'src/features/courses/coursesSlice.js' },
  { nhom: 'f1', an: true, moTa: 'Page reads the store with useSelector (no axios in the page)', kiem: 'ma-nguon', tep: 'src/pages/CoursesPage.js', khop: '^(?=[\\s\\S]*useSelector)(?![\\s\\S]*from\\s+[\'"]axios[\'"])' },
  // f2 — card
  { nhom: 'f2', moTa: 'Card #course-9 shows category name, level, instructor and price', url: '/courses', kiem: 'text', selector: '#course-9', khop: 'Frontend[\\s\\S]*Intermediate[\\s\\S]*TypeScript in Practice[\\s\\S]*by Tran Minh[\\s\\S]*299\\.000 ₫' },
  { nhom: 'f2', moTa: 'Prices: "Free" or "199.000 ₫"', url: '/courses', kiem: 'danh-sach-text', selector: '.course-price', mongDoi: ['299.000 ₫', '349.000 ₫', '549.000 ₫', 'Free', '449.000 ₫', '399.000 ₫'] },
  { nhom: 'f2', an: true, moTa: '"View details" links to /courses/:id', url: '/courses', kiem: 'thuoc-tinh', selector: '#course-9 .btn-detail', thuocTinh: 'href', khop: '/courses/9$' },
  // f3 — filters
  { nhom: 'f3', moTa: 'Category Frontend', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['TypeScript in Practice', 'Advanced React Patterns', 'JavaScript Essentials', 'React for Beginners'], truoc: [cho(), doi('#filter-category', '1'), cho(200)] },
  { nhom: 'f3', moTa: 'Level Beginner', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['SQL Server for Developers', 'JavaScript Essentials', 'React for Beginners'], truoc: [cho(), doi('#filter-level', 'Beginner'), cho(200)] },
  { nhom: 'f3', moTa: 'Free courses only', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['SQL Server for Developers', 'React for Beginners'], truoc: [cho(), doi('#filter-price', 'free'), cho(200)] },
  { nhom: 'f3', moTa: 'Filters combine: Database + paid ⇒ 1 course (draft excluded)', url: '/courses', kiem: 'danh-sach-text', selector: '#result-count, .course-title', mongDoi: ['1 course found', 'PostgreSQL Performance Tuning'], truoc: [cho(), doi('#filter-category', '3'), cho(100), doi('#filter-price', 'paid'), cho(200)] },
  { nhom: 'f3', an: true, moTa: 'Clear filters ⇒ all 9 again', url: '/courses?category=3&level=Advanced', kiem: 'text', selector: '#result-count', giaTri: '9 courses found', truoc: [cho(), click('#clear-filters'), cho(200)] },
  { nhom: 'f3', an: true, moTa: 'No match ⇒ #no-results', url: '/courses', kiem: 'ton-tai', selector: '#no-results', truoc: [cho(), doi('#filter-category', '4'), cho(100), doi('#filter-price', 'free'), cho(200)] },
  // f4 — search & sort
  { nhom: 'f4', moTa: 'Search "  REACT " (trim + any case)', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['Advanced React Patterns', 'React for Beginners'], truoc: [cho(), nhap('#search', '  REACT '), cho(200)] },
  { nhom: 'f4', moTa: 'Search matches the instructor too', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['PostgreSQL Performance Tuning', 'SQL Server for Developers'], truoc: [cho(), nhap('#search', 'pham thu'), cho(200)] },
  { nhom: 'f4', moTa: 'Sort price low → high', url: '/courses', kiem: 'danh-sach-text', selector: '.course-price', mongDoi: ['Free', 'Free', '199.000 ₫', '299.000 ₫', '349.000 ₫', '399.000 ₫'], truoc: [cho(), doi('#sort', 'price-asc'), cho(200)] },
  { nhom: 'f4', an: true, moTa: 'Sort price high → low', url: '/courses', kiem: 'danh-sach-text', selector: '.course-price', mongDoi: ['549.000 ₫', '499.000 ₫', '449.000 ₫', '399.000 ₫', '349.000 ₫', '299.000 ₫'], truoc: [cho(), doi('#sort', 'price-desc'), cho(200)] },
  { nhom: 'f4', an: true, moTa: 'Sort title A → Z', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['Advanced React Patterns', 'Flutter Mobile Apps', 'JavaScript Essentials', 'Node.js & Express REST APIs', 'PostgreSQL Performance Tuning', 'React for Beginners'], truoc: [cho(), doi('#sort', 'title'), cho(200)] },
  // f5 — pagination & URL
  { nhom: 'f5', moTa: 'Page 2 shows the 3 oldest courses', url: '/courses', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['Advanced React Patterns', 'JavaScript Essentials', 'React for Beginners'], truoc: [cho(), click('#page-2'), cho(200)] },
  { nhom: 'f5', moTa: 'Filters are read from the URL', url: '/courses?category=3&sort=price-desc', kiem: 'danh-sach-text', selector: '.course-title', mongDoi: ['PostgreSQL Performance Tuning', 'SQL Server for Developers'] },
  { nhom: 'f5', moTa: 'Changing a filter writes the URL and resets the page', url: '/courses?page=2', kiem: 'duong-dan', giaTri: '/courses?category=1', truoc: [cho(), doi('#filter-category', '1'), cho(200)] },
  { nhom: 'f5', an: true, moTa: 'No pager when everything fits on one page', url: '/courses?category=1', kiem: 'khong-ton-tai', selector: '#pagination' },
  { nhom: 'f5', an: true, moTa: '?page=99 is clamped to the last page', url: '/courses?page=99', kiem: 'so-luong', selector: '.course-card', giaTri: 3 },
];

export default doiDau(moduleF({
  k: 3, phut: 150, banIn: BAN_IN, kiem: KIEM, url: '/courses',
  baiHoc: 'fer202-11-2-axios-json-server',
  khaiNiem: ['createAsyncThunk + Promise.all', 'derived data (useMemo)', 'useSearchParams', 'filter / search / sort / paginate', 'loading / error / empty states'],
  viDu: [{ input: '/courses?category=3&sort=price-desc', output: 'PostgreSQL Performance Tuning (549.000 ₫), SQL Server for Developers (Free)', explanation: 'Draft MongoDB Basics is not published, so it never appears.|||MongoDB Basics là bản nháp nên không bao giờ hiện.' }],
  thuatNgu: [{ en: 'query string', vi: 'phần sau dấu ? của URL' }, { en: 'derived state', vi: 'giá trị tính ra từ state có sẵn — không lưu riêng' }, { en: 'pagination', vi: 'phân trang' }, { en: 'clamp', vi: 'kẹp giá trị về trong khoảng hợp lệ' }],
  goiY: [
    'Làm theo lớp: courseApi (2 hàm) → coursesSlice (fetchCatalog + 3 case) → store thêm <code>courses</code> → CourseCard → CoursesPage hiện 9 thẻ → thêm lọc → tìm/sắp → phân trang.',
    'Đọc bộ lọc: <code>const [sp, setSp] = useSearchParams(); const category = sp.get("category") ?? "";</code>. Ghi: tạo <code>new URLSearchParams(sp)</code>, <code>set</code>/<code>delete</code>, xoá <code>page</code> khi đổi bộ lọc, rồi <code>setSp(next, { replace: true })</code>.',
    'Danh sách hiển thị là một chuỗi: <code>items.filter(cat).filter(level).filter(price).filter(search).slice().sort(cmp)</code> trong <code>useMemo</code>; rồi <code>slice((page-1)*6, page*6)</code>. <code>categoryId</code> là SỐ, giá trị trên URL là CHUỖI ⇒ <code>String(c.categoryId) === category</code>.',
  ],
  loiHayGap: [
    'So <code>c.categoryId === sp.get("category")</code> (số với chuỗi) ⇒ lọc ra rỗng.',
    'Gọi <code>items.sort(…)</code> trên mảng lấy từ Redux ⇒ "Cannot assign to read only property" (Immer đóng băng state). Sắp trên <code>items.slice()</code>.',
    'Lưu <code>filteredCourses</code> vào state rồi cập nhật trong useEffect ⇒ nháy giao diện, dễ lệch; danh sách lọc là giá trị SUY RA.',
    'Đổi bộ lọc mà không về trang 1 ⇒ đang ở trang 2, lọc còn 2 khoá ⇒ trang trắng.',
    'Gọi <code>dispatch(fetchCatalog())</code> trong useEffect không điều kiện và không deps ⇒ vòng lặp gọi API vô hạn.',
    'Tìm kiếm không <code>trim()</code> / không <code>toLowerCase()</code> cả hai phía ⇒ "React " hay "react" không ra kết quả.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> <code>fetchCatalog</code> loads published courses and categories together with <code>Promise.all</code>; the slice records <code>status</code> so the page fetches only while <code>idle</code> and can show loading, error (+ retry) and data. The page never stores the filtered list: it reads the filters from <code>useSearchParams</code>, builds the visible list in <code>useMemo</code> with pure helpers in <code>utils/courseQuery.js</code> (<code>applyCourseQuery</code>, <code>paginate</code>) and writes changes back to the URL with <code>replace</code>, deleting <code>page</code> whenever a filter changes. Keeping state in the URL gives bookmarkable, shareable lists and a working Back button for free.</p>',
    vi: '<p><b>Hướng giải.</b> <code>fetchCatalog</code> tải khoá đã xuất bản và danh mục cùng lúc bằng <code>Promise.all</code>; slice ghi <code>status</code> để trang chỉ tải khi <code>idle</code> và hiện được đang tải, lỗi (+ thử lại), dữ liệu. Trang không lưu danh sách đã lọc: đọc bộ lọc từ <code>useSearchParams</code>, dựng danh sách hiển thị trong <code>useMemo</code> bằng hàm thuần ở <code>utils/courseQuery.js</code> (<code>applyCourseQuery</code>, <code>paginate</code>) và ghi ngược lên URL với <code>replace</code>, xoá <code>page</code> mỗi khi đổi bộ lọc. Giữ trạng thái trên URL ⇒ danh sách lưu/chia sẻ được, nút Back chạy đúng mà không tốn thêm code.</p>',
  },
}));
