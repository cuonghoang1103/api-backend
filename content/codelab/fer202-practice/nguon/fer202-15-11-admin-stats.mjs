/**
 * CodeLearn · F11 — Admin: thống kê (5 chỉ số, top khoá phổ biến, biểu đồ cột SVG theo khoá / tháng / danh mục).
 */
import { doiDau } from './_chung.mjs';
import { B, DB, banInF, bang, click, cho, dn, moduleF } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>The last screen gives the admin numbers: totals, an estimated revenue, the quiz pass rate, the most popular courses and three bar charts. No chart library is needed — a bar chart is a few <code>&lt;rect&gt;</code> elements in an inline <b>SVG</b> whose heights are proportional to the values. All numbers are computed in the browser from the raw collections with <b>pure functions</b> (<code>utils/stats.js</code>), so nothing is hard-coded and the page is right for any data.</p>
<h3>API calls</h3><p><code>GET /users</code>, <code>GET /courses</code>, <code>GET /enrollments</code>, <code>GET /results</code>, <code>GET /categories</code> — in parallel with <code>Promise.all</code>; <code>#refresh-stats</code> loads again.</p>
<h3>Definitions</h3>${bang(['Id', 'Value'], [
    ['<code>#stat-courses</code> (+ <code>#stat-published</code> "N published")', 'all courses (drafts included)'],
    ['<code>#stat-students</code>', 'users with role <code>student</code> (locked ones included)'],
    ['<code>#stat-enrollments</code>', 'number of enrolments'],
    ['<code>#stat-revenue</code>', 'Σ price of the course of every enrolment, formatted "598.000 ₫" (free = 0)'],
    ['<code>#stat-pass-rate</code>', 'passed attempts ÷ all attempts, rounded, "50%" (no attempts ⇒ 0%)'],
    ['popular courses', 'courses with ≥ 1 enrolment, most enrolments first, ties by title A→Z, top 5'],
    ['enrolments per month', 'group by <code>enrolledAt.slice(0, 7)</code>, oldest first, label "09/2026"'],
    ['enrolments per category', 'every category (0 included), in category order'],
  ])}
<h3>Bar chart (component <code>BarChart</code>)</h3><p>Props <code>{ id, title, data: [{ label, value }] }</code>; renders <code>&lt;svg id={id}&gt;</code> with, for each item, <code>rect.bar</code> (height = <code>Math.round(value / max × 150)</code>, so the biggest bar is 150), <code>text.bar-value</code> and <code>text.bar-label</code>. All values 0 ⇒ no division by zero.</p>`,
  vi: `<p>Màn hình cuối cho admin các con số: tổng, doanh thu ước tính, tỉ lệ đạt quiz, các khoá phổ biến nhất và ba biểu đồ cột. Không cần thư viện biểu đồ — biểu đồ cột chỉ là vài phần tử <code>&lt;rect&gt;</code> trong một <b>SVG</b> nội tuyến, chiều cao tỉ lệ với giá trị. Mọi con số tính ở trình duyệt từ các bảng thô bằng <b>hàm thuần</b> (<code>utils/stats.js</code>) ⇒ không viết cứng số nào, dữ liệu nào trang cũng đúng.</p>
<h3>Lời gọi API</h3><p><code>GET /users</code>, <code>GET /courses</code>, <code>GET /enrollments</code>, <code>GET /results</code>, <code>GET /categories</code> — song song bằng <code>Promise.all</code>; <code>#refresh-stats</code> tải lại.</p>
<h3>Định nghĩa</h3>${bang(['Id', 'Giá trị'], [
    ['<code>#stat-courses</code> (+ <code>#stat-published</code> "N published")', 'mọi khoá (kể cả nháp)'],
    ['<code>#stat-students</code>', 'người có role <code>student</code> (kể cả bị khoá)'],
    ['<code>#stat-enrollments</code>', 'số lượt ghi danh'],
    ['<code>#stat-revenue</code>', 'Σ giá khoá của từng lượt ghi danh, định dạng "598.000 ₫" (miễn phí = 0)'],
    ['<code>#stat-pass-rate</code>', 'lượt đạt ÷ mọi lượt làm quiz, làm tròn, "50%" (chưa có lượt nào ⇒ 0%)'],
    ['khoá phổ biến', 'khoá có ≥ 1 lượt ghi danh, nhiều nhất trước, hoà thì theo tên A→Z, lấy 5'],
    ['ghi danh theo tháng', 'gom theo <code>enrolledAt.slice(0, 7)</code>, tháng cũ trước, nhãn "09/2026"'],
    ['ghi danh theo danh mục', 'mọi danh mục (kể cả 0), theo thứ tự danh mục'],
  ])}
<h3>Biểu đồ cột (component <code>BarChart</code>)</h3><p>Props <code>{ id, title, data: [{ label, value }] }</code>; vẽ <code>&lt;svg id={id}&gt;</code>, mỗi mục có <code>rect.bar</code> (cao = <code>Math.round(value / max × 150)</code> ⇒ cột lớn nhất cao 150), <code>text.bar-value</code> và <code>text.bar-label</code>. Toàn giá trị 0 ⇒ không chia cho 0.</p>`,
};

const BAN_IN = banInF({
  k: 11, phut: 90, moTa: MO_TA,
  wireframe: `
/admin/stats                                                    [Refresh] (#refresh-stats)
┌──────────┐┌──────────┐┌────────────┐┌────────────────┐┌──────────────┐
│Courses 10││Students 4││Enrolments 6││Revenue 598.000 ₫││Pass rate 50% │
│9 published│└──────────┘└────────────┘└────────────────┘└──────────────┘
Most popular courses (#popular-table)        Enrolments per month (#chart-months)
│1│React for Beginners          │3│          ▇▇▇▇  4
│2│JavaScript Essentials        │1│          ▇▇▇▇        ▇▇  2
│3│Node.js & Express REST APIs  │1│         09/2026     10/2026
│4│SQL Server for Developers    │1│        Enrolments per category (#chart-categories)
 #chart-popular:  ▇▇▇ 3   ▇ 1   ▇ 1   ▇ 1   Frontend 4 · Backend 1 · Database 1 · Mobile 0
                  #1      #2    #3    #4     (rect.bar · text.bar-value · text.bar-label)`,
  chucNang: [
    { ten: { en: 'Summary numbers', vi: 'Các chỉ số tổng' }, diem: 3, yeuCau: [
      { en: 'Route <code>/admin/stats</code> (sidebar <code>#admin-nav-stats</code>): <code>#stat-courses</code>, <code>#stat-published</code>, <code>#stat-students</code>, <code>#stat-enrollments</code>, <code>#stat-revenue</code>, <code>#stat-pass-rate</code> — each id on the element whose text is the value.', vi: 'Route <code>/admin/stats</code> (sidebar <code>#admin-nav-stats</code>): <code>#stat-courses</code>, <code>#stat-published</code>, <code>#stat-students</code>, <code>#stat-enrollments</code>, <code>#stat-revenue</code>, <code>#stat-pass-rate</code> — id đặt trên phần tử có chữ là giá trị.' },
    ], hook: ['Promise.all', 'reduce'], viDu: 'seed ⇒ 10 · 4 · 6 · 598.000 ₫ · 50%' },
    { ten: { en: 'Most popular courses', vi: 'Khoá phổ biến nhất' }, diem: 2.5, yeuCau: [
      { en: '<code>#popular-table</code> rows <code>tr.popular-row</code> with <code>.popular-title</code> and <code>.popular-count</code>, sorted as defined; none ⇒ <code>#no-popular</code>.', vi: '<code>#popular-table</code> có dòng <code>tr.popular-row</code> gồm <code>.popular-title</code> và <code>.popular-count</code>, sắp như định nghĩa; không có ⇒ <code>#no-popular</code>.' },
    ], hook: ['sort with tie-break'] },
    { ten: { en: 'SVG bar charts', vi: 'Biểu đồ cột SVG' }, diem: 3, yeuCau: [
      { en: '<code>components/BarChart.js</code> used three times: <code>#chart-popular</code> (popular courses, labels "#1"…), <code>#chart-months</code>, <code>#chart-categories</code>.', vi: '<code>components/BarChart.js</code> dùng ba lần: <code>#chart-popular</code> (khoá phổ biến, nhãn "#1"…), <code>#chart-months</code>, <code>#chart-categories</code>.' },
    ], hook: ['SVG rect', 'reusable component'] },
    { ten: { en: 'Access, refresh & pure functions', vi: 'Quyền, làm mới & hàm thuần' }, diem: 1.5, yeuCau: [
      { en: 'Admin only (student ⇒ 403); <code>#refresh-stats</code> reloads; calculations in <code>utils/stats.js › computeStats(data)</code> (no numbers hard-coded — the grader runs it on other data too).', vi: 'Chỉ admin (học viên ⇒ 403); <code>#refresh-stats</code> tải lại; phép tính ở <code>utils/stats.js › computeStats(data)</code> (không viết cứng số — máy chấm chạy cả với dữ liệu khác).' },
    ] },
  ],
  idBatBuoc: [
    ['#admin-nav-stats #admin-stats-title #refresh-stats #stats-error', { en: 'page', vi: 'trang' }],
    ['#stat-courses #stat-published #stat-students #stat-enrollments #stat-revenue #stat-pass-rate', { en: 'value elements', vi: 'phần tử giá trị' }],
    ['#popular-table tr.popular-row .popular-title .popular-count #no-popular', { en: 'popular courses', vi: 'khoá phổ biến' }],
    ['svg#chart-popular · svg#chart-months · svg#chart-categories — rect.bar text.bar-value text.bar-label', { en: 'charts', vi: 'biểu đồ' }],
  ],
  truDiem: [
    { en: 'Typing the expected numbers into JSX (fails as soon as data changes).', vi: 'Gõ thẳng con số vào JSX (sai ngay khi dữ liệu đổi).' },
    { en: 'Importing a heavy chart library for three bar charts.', vi: 'Nạp cả thư viện biểu đồ nặng chỉ cho ba biểu đồ cột.' },
  ],
});

const A = dn(1);
// dữ liệu khác: thêm 2 lượt ghi danh khoá 7 (549.000 ₫) tháng 11 + 1 lượt quiz đạt
const KHAC = {
  base: B,
  db: {
    ...DB,
    enrollments: [...DB.enrollments, { id: 7, userId: 3, courseId: 7, enrolledAt: '2026-11-02', completedLessons: [] }, { id: 8, userId: 5, courseId: 7, enrolledAt: '2026-11-05', completedLessons: [] }],
    results: [...DB.results, { id: 5, userId: 5, courseId: 1, chapterId: 1, score: 3, total: 3, percent: 100, passed: true, answers: [1, 1, 0], submittedAt: '2026-10-10T10:00:00.000Z' }],
  },
};
const S = '/admin/stats';
const KIEM = [
  // f1 — totals
  { nhom: 'f1', moTa: 'Courses, students, enrolments, revenue, pass rate', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '#stat-courses, #stat-students, #stat-enrollments, #stat-revenue, #stat-pass-rate', mongDoi: ['10', '4', '6', '598.000 ₫', '50%'] },
  { nhom: 'f1', moTa: 'Published count', url: S, khoCucBo: A, kiem: 'text', selector: '#stat-published', giaTri: '9 published' },
  { nhom: 'f1', moTa: 'Numbers follow the data (no hard-coding)', url: S, khoCucBo: A, jsonServer: KHAC, kiem: 'danh-sach-text', selector: '#stat-courses, #stat-students, #stat-enrollments, #stat-revenue, #stat-pass-rate', mongDoi: ['10', '4', '8', '1.696.000 ₫', '60%'] },
  // f2 — popular
  { nhom: 'f2', moTa: 'Popular courses: most enrolments first, ties A → Z', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '.popular-title', mongDoi: ['React for Beginners', 'JavaScript Essentials', 'Node.js & Express REST APIs', 'SQL Server for Developers'] },
  { nhom: 'f2', moTa: 'Enrolment counts', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '.popular-count', mongDoi: ['3', '1', '1', '1'] },
  { nhom: 'f2', an: true, moTa: 'Top 5 with other data', url: S, khoCucBo: A, jsonServer: KHAC, kiem: 'danh-sach-text', selector: '.popular-title', mongDoi: ['React for Beginners', 'PostgreSQL Performance Tuning', 'JavaScript Essentials', 'Node.js & Express REST APIs', 'SQL Server for Developers'] },
  { nhom: 'f2', an: true, moTa: 'No enrolments ⇒ #no-popular', url: S, khoCucBo: A, jsonServer: { base: B, db: { ...DB, enrollments: [] } }, kiem: 'ton-tai', selector: '#no-popular' },
  // f3 — charts
  { nhom: 'f3', moTa: 'Popular chart: one bar per course', url: S, khoCucBo: A, kiem: 'so-luong', selector: '#chart-popular rect.bar', giaTri: 4 },
  { nhom: 'f3', moTa: 'Popular chart values', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '#chart-popular .bar-value', mongDoi: ['3', '1', '1', '1'] },
  { nhom: 'f3', moTa: 'Tallest bar is 150 high', url: S, khoCucBo: A, kiem: 'thuoc-tinh', selector: '#chart-popular rect.bar', thuocTinh: 'height', giaTri: '150', tatCa: false },
  { nhom: 'f3', moTa: 'Bars are proportional (1 of 3 ⇒ 50)', url: S, khoCucBo: A, kiem: 'thuoc-tinh', selector: '#chart-popular rect.bar', thuocTinh: 'height', giaTri: '50', tatCa: false },
  { nhom: 'f3', moTa: 'Months chart labels', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '#chart-months .bar-label', mongDoi: ['09/2026', '10/2026'] },
  { nhom: 'f3', an: true, moTa: 'Months chart values', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '#chart-months .bar-value', mongDoi: ['4', '2'] },
  { nhom: 'f3', an: true, moTa: 'Category chart: all categories incl. 0', url: S, khoCucBo: A, kiem: 'danh-sach-text', selector: '#chart-categories .bar-label, #chart-categories .bar-value', mongDoi: ['4', 'Frontend', '1', 'Backend', '1', 'Database', '0', 'Mobile'] },
  { nhom: 'f3', an: true, moTa: 'A new month appears with other data', url: S, khoCucBo: A, jsonServer: KHAC, kiem: 'danh-sach-text', selector: '#chart-months .bar-label', mongDoi: ['09/2026', '10/2026', '11/2026'] },
  // f4 — access, refresh, structure
  { nhom: 'f4', moTa: 'Students get 403', url: S, khoCucBo: dn(2), kiem: 'ton-tai', selector: '#forbidden' },
  { nhom: 'f4', moTa: 'Sidebar "Statistics" opens the page', url: '/admin/courses', khoCucBo: A, kiem: 'duong-dan', giaTri: S, truoc: [cho(), click('#admin-nav-stats'), cho()] },
  { nhom: 'f4', an: true, moTa: 'Refresh loads the data again', url: S, khoCucBo: A, kiem: 'goi-fetch', khop: 'GET .*/enrollments$', min: 2, truoc: [cho(), click('#refresh-stats'), cho()] },
  { nhom: 'f4', an: true, moTa: 'computeStats exported from utils/stats.js', kiem: 'ma-nguon', tep: 'src/utils/stats.js', khop: 'export\\s+function\\s+computeStats' },
];

export default doiDau(moduleF({
  k: 11, phut: 90, banIn: BAN_IN, kiem: KIEM, url: S,
  baiHoc: 'fer202-4-1-bootstrap',
  khaiNiem: ['Promise.all', 'reduce / group by', 'sort with tie-break', 'inline SVG chart', 'reusable component', 'pure functions'],
  viDu: [{ input: 'Two extra enrolments in course 7 (549.000 ₫) in November', output: 'Enrolments 8 · Revenue 1.696.000 ₫ · months 09/2026, 10/2026, 11/2026', explanation: 'Everything is recomputed from the collections.|||Mọi thứ tính lại từ các bảng dữ liệu.' }],
  thuatNgu: [{ en: 'group by', vi: 'gom nhóm theo một khoá rồi đếm' }, { en: 'tie-break', vi: 'luật phụ khi hai mục bằng nhau' }, { en: 'SVG', vi: 'ảnh vector viết bằng thẻ (rect, text…) ngay trong JSX' }],
  goiY: [
    'Tải: <code>const [users, courses, enrollments, results, categories] = await Promise.all([...])</code>, rồi <code>setStats(computeStats({ ... }))</code>. Viết <code>computeStats</code> trước, thử bằng <code>console.log</code> với seed (phải ra 10 · 4 · 6 · 598000 · 50).',
    'Đếm theo khoá: <code>const n = {}; enrollments.forEach(e =&gt; n[e.courseId] = (n[e.courseId] ?? 0) + 1)</code>. Phổ biến: <code>courses.map(...).filter(c =&gt; c.count &gt; 0).sort((a, b) =&gt; b.count - a.count || a.title.localeCompare(b.title)).slice(0, 5)</code>.',
    'BarChart: <code>const max = Math.max(1, ...data.map(d =&gt; d.value))</code>; mỗi mục <code>&lt;rect className="bar" height={Math.round(d.value / max * 150)} y={170 - h} …/&gt;</code> + hai <code>&lt;text&gt;</code>. Doanh thu: <code>formatPrice</code> của F3.',
  ],
  loiHayGap: [
    'Viết cứng số liệu của seed vào trang ⇒ dữ liệu đổi là sai (máy chấm chạy cả với dữ liệu khác).',
    '<code>Math.max(...[])</code> = -Infinity / chia cho max = 0 ⇒ chiều cao NaN, SVG không hiện.',
    'Sắp khoá phổ biến không có luật hoà ⇒ thứ tự các khoá cùng số lượt đổi theo dữ liệu, khó kiểm.',
    'Tính doanh thu bằng tổng giá của MỌI khoá thay vì theo từng lượt ghi danh.',
    'Gom theo tháng bằng <code>new Date(e.enrolledAt).getMonth()</code> ⇒ lệch múi giờ và quên năm; cắt chuỗi <code>slice(0, 7)</code>.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> The page loads five collections in parallel and hands them to one pure function, <code>computeStats</code>, which returns plain numbers and arrays: totals, revenue (price of the course of each enrolment), pass rate, top 5 popular courses (count desc, title asc), enrolments per month (string slice ⇒ no time-zone surprises) and per category. Because the page only renders that object, the same code is right for any database — the grader checks it with a second data set. <code>BarChart</code> is a small reusable component: it scales every value against the maximum (at least 1) and draws a <code>rect.bar</code> plus value and label texts in an SVG viewBox.</p>',
    vi: '<p><b>Hướng giải.</b> Trang tải năm bảng song song rồi giao cho một hàm thuần <code>computeStats</code>, trả về số và mảng thuần: các tổng, doanh thu (giá khoá của từng lượt ghi danh), tỉ lệ đạt, top 5 khoá phổ biến (lượt giảm dần, tên tăng dần), ghi danh theo tháng (cắt chuỗi ⇒ không lệch múi giờ) và theo danh mục. Vì trang chỉ vẽ object đó nên cùng một mã đúng với mọi CSDL — máy chấm kiểm thêm bằng bộ dữ liệu thứ hai. <code>BarChart</code> là component nhỏ dùng lại được: chia mỗi giá trị theo giá trị lớn nhất (ít nhất 1) và vẽ <code>rect.bar</code> kèm chữ giá trị và nhãn trong một SVG có viewBox.</p>',
  },
}));
