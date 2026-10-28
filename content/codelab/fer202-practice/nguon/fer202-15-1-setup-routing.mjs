/**
 * CodeLearn · F1 — cài đặt CRA + json-server, layout chung, routing, trang 404. Starter = khung dự án (F0).
 */
import { doiDau } from './_chung.mjs';
import { banInF, bang, click, cho, moduleF } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>Turn the CRA skeleton into a routed single-page app. The skeleton already holds <code>package.json</code> (scripts <code>start</code>, <code>server</code>, <code>dev</code>), <code>db.json</code>, <code>.env</code> and <code>src/api/axiosClient.js</code> — <b>check them</b>, run <code>npm run dev</code>, and open <code>http://localhost:9999/courses</code> to see json-server answer. Then build the shell every later function plugs into: one <b>Layout</b> route (navbar + <code>&lt;Outlet /&gt;</code> + footer), the Home page, a placeholder Courses page and a catch-all 404.</p>
<h3>Routes after F1</h3>${bang(['Path', 'Element'], [['<code>/</code>', 'HomePage (inside Layout)'], ['<code>/courses</code>', 'CoursesPage — placeholder, replaced in F3'], ['<code>*</code>', 'NotFoundPage (404)']])}
<h3>Edge cases</h3><ul><li>Any unknown path, at any depth (<code>/abc</code>, <code>/courses/x/y</code>), shows the 404 page <i>inside</i> the layout (navbar still visible).</li><li>"Home" is active only on <code>/</code> — not on every page (<code>end</code>).</li></ul>`,
  vi: `<p>Biến khung CRA thành ứng dụng một trang có định tuyến. Khung đã có <code>package.json</code> (script <code>start</code>, <code>server</code>, <code>dev</code>), <code>db.json</code>, <code>.env</code> và <code>src/api/axiosClient.js</code> — <b>kiểm lại chúng</b>, chạy <code>npm run dev</code>, mở <code>http://localhost:9999/courses</code> để thấy json-server trả lời. Sau đó dựng "bộ khung" mà mọi chức năng sau cắm vào: một route <b>Layout</b> (navbar + <code>&lt;Outlet /&gt;</code> + footer), trang chủ, trang Courses giữ chỗ và route 404 bắt mọi đường dẫn còn lại.</p>
<h3>Route sau F1</h3>${bang(['Đường dẫn', 'Element'], [['<code>/</code>', 'HomePage (trong Layout)'], ['<code>/courses</code>', 'CoursesPage — giữ chỗ, F3 thay'], ['<code>*</code>', 'NotFoundPage (404)']])}
<h3>Trường hợp biên</h3><ul><li>Mọi đường dẫn lạ, ở mọi độ sâu (<code>/abc</code>, <code>/courses/x/y</code>), hiện trang 404 <i>bên trong</i> layout (vẫn thấy navbar).</li><li>"Home" chỉ active ở <code>/</code> — không active ở mọi trang (<code>end</code>).</li></ul>`,
};

const BAN_IN = banInF({
  k: 1, phut: 60, moTa: MO_TA,
  wireframe: `
┌─ Navbar (bg dark) ──────────────────────────────────────────┐
│ 💻 CodeLearn    Home   Courses                              │
└─────────────────────────────────────────────────────────────┘
┌─ <main> = <Outlet /> ───────────────────────────────────────┐
│        Learn to code with CodeLearn          (#home-title)  │
│        [ Browse courses ]                    (#browse-btn)  │
│   🎬 Video lessons   📝 Chapter quizzes   📈 Track progress  │
└─────────────────────────────────────────────────────────────┘
  © 2026 CodeLearn — FER202 final assignment         (#footer)

/anything-else ⇒   404 · Page not found · [Back to home]`,
  chucNang: [
    { ten: { en: 'Project setup', vi: 'Cài đặt dự án' }, diem: 2, yeuCau: [
      { en: '<code>json-server</code> pinned to <b>0.17.4</b>; scripts <code>server</code> = <code>json-server --watch db.json --port 9999</code> and <code>dev</code> = <code>concurrently</code> running server + start.', vi: '<code>json-server</code> ghim đúng <b>0.17.4</b>; script <code>server</code> = <code>json-server --watch db.json --port 9999</code> và <code>dev</code> = <code>concurrently</code> chạy server + start.' },
      { en: '<code>.env</code>: <code>REACT_APP_API_URL=http://localhost:9999</code>; <code>axiosClient</code> uses it as <code>baseURL</code>. React 18.', vi: '<code>.env</code>: <code>REACT_APP_API_URL=http://localhost:9999</code>; <code>axiosClient</code> dùng nó làm <code>baseURL</code>. React 18.' },
    ], hook: ['concurrently', 'process.env'] },
    { ten: { en: 'Layout', vi: 'Layout chung' }, diem: 2.5, yeuCau: [
      { en: '<code>components/Layout.js</code>: <code>AppNavbar</code> + <code>&lt;Container as="main" id="main"&gt;&lt;Outlet /&gt;</code> + <code>&lt;footer id="footer"&gt;</code> containing "© 2026 CodeLearn".', vi: '<code>components/Layout.js</code>: <code>AppNavbar</code> + <code>&lt;Container as="main" id="main"&gt;&lt;Outlet /&gt;</code> + <code>&lt;footer id="footer"&gt;</code> có chữ "© 2026 CodeLearn".' },
      { en: '<code>components/AppNavbar.js</code> (React-Bootstrap <code>Navbar</code>): brand <code>#brand</code> "CodeLearn" linking to <code>/</code>; <code>#nav-home</code>, <code>#nav-courses</code> as <code>NavLink</code>.', vi: '<code>components/AppNavbar.js</code> (React-Bootstrap <code>Navbar</code>): brand <code>#brand</code> "CodeLearn" trỏ <code>/</code>; <code>#nav-home</code>, <code>#nav-courses</code> là <code>NavLink</code>.' },
    ], hook: ['Outlet', 'Navbar', 'NavLink'] },
    { ten: { en: 'Routes & navigation', vi: 'Route & điều hướng' }, diem: 2.5, yeuCau: [
      { en: 'All routes declared in <code>App.js</code> under one layout route: <code>/</code> HomePage (<code>#home-title</code> "Learn to code with CodeLearn", <code>#browse-btn</code> → <code>/courses</code>), <code>/courses</code> CoursesPage (<code>#courses-title</code> "Courses").', vi: 'Mọi route khai trong <code>App.js</code> dưới một route layout: <code>/</code> HomePage (<code>#home-title</code> "Learn to code with CodeLearn", <code>#browse-btn</code> → <code>/courses</code>), <code>/courses</code> CoursesPage (<code>#courses-title</code> "Courses").' },
      { en: 'The current link gets the <code>active</code> class; Home uses <code>end</code>. No full page reloads (no <code>&lt;a href&gt;</code> for internal links).', vi: 'Link trang hiện tại có class <code>active</code>; Home dùng <code>end</code>. Không tải lại cả trang (không dùng <code>&lt;a href&gt;</code> cho link nội bộ).' },
    ], hook: ['Routes', 'Route', 'Link'], viDu: 'click #nav-courses ⇒ URL /courses, #nav-courses has class "active", #nav-home does not' },
    { ten: { en: '404 page', vi: 'Trang 404' }, diem: 2, yeuCau: [
      { en: '<code>&lt;Route path="*"&gt;</code> LAST, inside the layout: <code>#not-found</code> shows "404" and "Page not found" and a <code>#back-home</code> link to <code>/</code>.', vi: '<code>&lt;Route path="*"&gt;</code> đặt CUỐI, trong layout: <code>#not-found</code> hiện "404", "Page not found" và link <code>#back-home</code> về <code>/</code>.' },
    ], hook: ['path="*"'] },
    { ten: { en: 'Code structure', vi: 'Cấu trúc code' }, diem: 1, yeuCau: [
      { en: 'Pages in <code>src/pages</code>, reusable parts in <code>src/components</code>; <code>index.js</code> keeps <code>&lt;Provider&gt;</code> + <code>&lt;BrowserRouter&gt;</code>.', vi: 'Trang ở <code>src/pages</code>, phần dùng lại ở <code>src/components</code>; <code>index.js</code> giữ <code>&lt;Provider&gt;</code> + <code>&lt;BrowserRouter&gt;</code>.' },
    ] },
  ],
  idBatBuoc: [
    ['#brand · #nav-home · #nav-courses', { en: 'navbar', vi: 'thanh điều hướng' }],
    ['#main · #footer', { en: 'layout', vi: 'layout' }],
    ['#home-title · #browse-btn', { en: 'home page', vi: 'trang chủ' }],
    ['#courses-title', { en: 'courses page (placeholder)', vi: 'trang khoá học (giữ chỗ)' }],
    ['#not-found · #back-home', { en: '404 page', vi: 'trang 404' }],
  ],
  truDiem: [
    { en: 'Navbar copied into every page instead of one layout route.', vi: 'Chép navbar vào từng trang thay vì một route layout.' },
    { en: '<code>path="*"</code> placed first (or outside the layout) — it swallows real routes or loses the navbar.', vi: '<code>path="*"</code> đặt đầu (hoặc ngoài layout) — nuốt route thật hoặc mất navbar.' },
  ],
});

const KIEM = [
  // f1 — setup
  { nhom: 'f1', moTa: 'json-server pinned to 0.17.4', kiem: 'ma-nguon', tep: 'package.json', khop: '"json-server":\\s*"[~^]?0\\.17\\.4"' },
  { nhom: 'f1', moTa: '"server" runs json-server on db.json port 9999; "dev" uses concurrently', kiem: 'ma-nguon', tep: 'package.json', khop: '(?=[\\s\\S]*"server":\\s*"json-server[^"]*db\\.json[^"]*--port 9999)(?=[\\s\\S]*"dev":\\s*"concurrently)' },
  { nhom: 'f1', moTa: '.env defines REACT_APP_API_URL and axiosClient uses it', kiem: 'ma-nguon', tep: 'src/api/axiosClient.js', khop: 'baseURL:\\s*process\\.env\\.REACT_APP_API_URL' },
  { nhom: 'f1', an: true, moTa: 'React 18 in package.json', kiem: 'ma-nguon', tep: 'package.json', khop: '"react":\\s*"[~^]?18\\.' },
  // f2 — layout
  { nhom: 'f2', moTa: 'Navbar brand "CodeLearn" and two links', url: '/', kiem: 'danh-sach-text', selector: '#nav-home, #nav-courses', mongDoi: ['Home', 'Courses'] },
  { nhom: 'f2', moTa: 'Brand shows CodeLearn', url: '/', kiem: 'text', selector: '#brand', khop: 'CodeLearn' },
  { nhom: 'f2', moTa: 'Page content is rendered inside <main id="main"> (Outlet)', url: '/', kiem: 'ton-tai', selector: '#main #home-title' },
  { nhom: 'f2', moTa: 'Footer on every page', url: '/courses', kiem: 'text', selector: '#footer', khop: '© 2026 CodeLearn' },
  { nhom: 'f2', an: true, moTa: 'Layout uses <Outlet />', kiem: 'ma-nguon', tep: 'src/components/Layout.js', khop: '<Outlet\\s*/>' },
  // f3 — routes
  { nhom: 'f3', moTa: 'Home page title', url: '/', kiem: 'text', selector: '#home-title', giaTri: 'Learn to code with CodeLearn' },
  { nhom: 'f3', moTa: 'Clicking Courses opens /courses', url: '/', kiem: 'duong-dan', giaTri: '/courses', truoc: [cho(200), click('#nav-courses'), cho(200)] },
  { nhom: 'f3', moTa: 'Courses page renders its title', url: '/courses', kiem: 'text', selector: '#courses-title', giaTri: 'Courses' },
  { nhom: 'f3', moTa: 'Active link: #nav-courses is active on /courses', url: '/courses', kiem: 'thuoc-tinh', selector: '#nav-courses', thuocTinh: 'class', khop: '\\bactive\\b' },
  { nhom: 'f3', an: true, moTa: 'Home link is NOT active on /courses (end)', url: '/courses', kiem: 'thuoc-tinh', selector: '#nav-home', thuocTinh: 'class', khop: '^(?![\\s\\S]*\\bactive\\b)' },
  { nhom: 'f3', an: true, moTa: '"Browse courses" button goes to /courses', url: '/', kiem: 'duong-dan', giaTri: '/courses', truoc: [cho(200), click('#browse-btn'), cho(200)] },
  // f4 — 404
  { nhom: 'f4', moTa: 'Unknown URL ⇒ 404 + "Page not found"', url: '/no-such-page', kiem: 'text', selector: '#not-found', khop: '404[\\s\\S]*Page not found' },
  { nhom: 'f4', moTa: '404 page keeps the navbar (inside the layout)', url: '/no-such-page', kiem: 'ton-tai', selector: '#nav-home' },
  { nhom: 'f4', moTa: '"Back to home" returns to /', url: '/no-such-page', kiem: 'duong-dan', giaTri: '/', truoc: [cho(200), click('#back-home'), cho(200)] },
  { nhom: 'f4', an: true, moTa: 'Deep unknown URL /courses/x/y ⇒ 404', url: '/courses/x/y', kiem: 'ton-tai', selector: '#not-found' },
  // f5 — structure
  { nhom: 'f5', moTa: 'Routes declared with <Routes>, catch-all path="*"', kiem: 'ma-nguon', tep: 'src/App.js', khop: '(?=[\\s\\S]*<Routes>)(?=[\\s\\S]*path="\\*")' },
  { nhom: 'f5', an: true, moTa: 'No <a href="/…"> for internal navigation in the navbar', kiem: 'ma-nguon', tep: 'src/components/AppNavbar.js', khop: '<a\\s[^>]*href="/', phuDinh: true },
];

export default doiDau(moduleF({
  k: 1, phut: 60, doKho: 'MEDIUM', banIn: BAN_IN, kiem: KIEM, url: '/',
  baiHoc: 'fer202-9-1-router',
  khaiNiem: ['CRA project setup', 'json-server 0.17.4 + concurrently', '.env + REACT_APP_*', 'layout route + <Outlet />', 'NavLink active', 'catch-all 404'],
  viDu: [{ input: 'Open /abc', output: 'Navbar + "404 · Page not found" + Back to home', explanation: 'path="*" is the last child of the layout route.|||path="*" là con cuối của route layout.' }],
  thuatNgu: [{ en: 'layout route', vi: 'route không có path, chỉ bọc khung chung quanh các route con' }, { en: 'Outlet', vi: 'chỗ route con được vẽ vào bên trong layout' }, { en: 'catch-all route', vi: 'route path="*" bắt mọi đường dẫn còn lại (404)' }],
  goiY: [
    'Chạy thử trước: <code>npm run dev</code> rồi mở http://localhost:9999/courses — thấy JSON là json-server + db.json ổn. Nếu thấy lỗi "concurrently: command not found" ⇒ chưa <code>npm install</code>.',
    'Layout là một route KHÔNG có path: <code>&lt;Route element={&lt;Layout /&gt;}&gt; … &lt;/Route&gt;</code>; trong Layout đặt <code>&lt;Outlet /&gt;</code> chỗ nội dung trang.',
    'React-Bootstrap + Router: <code>&lt;Nav.Link as={NavLink} to="/" end id="nav-home"&gt;</code>. Route 404: <code>&lt;Route path="*" element={&lt;NotFoundPage /&gt;} /&gt;</code> là con CUỐI của route layout.',
  ],
  loiHayGap: [
    'Cài <code>json-server</code> không ghi phiên bản ⇒ ra 1.x, sau này <code>_expand</code>/<code>_embed</code> (F4, F5, F8) không chạy. Ghim <code>"json-server": "0.17.4"</code>.',
    'Dùng <code>&lt;a href="/courses"&gt;</code> trong navbar ⇒ mỗi lần bấm tải lại CẢ trang (mất state Redux). Dùng <code>Link</code>/<code>NavLink</code>.',
    'Quên <code>end</code> ở link Home ⇒ "Home" sáng ở mọi trang vì mọi đường dẫn đều bắt đầu bằng "/".',
    'Đặt <code>path="*"</code> ngoài route Layout ⇒ trang 404 không có navbar; đặt trước các route khác trong v5 (Switch) thì nuốt hết — v6 xếp theo độ khớp nhưng vẫn nên để cuối cho dễ đọc.',
    'Gõ <code>REACT_APP_API_URL</code> vào .env khi <code>npm start</code> đang chạy mà không khởi động lại ⇒ biến vẫn undefined.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> <code>App.js</code> has one layout route (no path) whose element is <code>Layout</code>; every page is its child, so the navbar and footer are written once and pages render into <code>&lt;Outlet /&gt;</code>. <code>NavLink</code> adds <code>active</code> automatically; <code>end</code> keeps Home from matching every path. The catch-all <code>path="*"</code> is the last child of the layout, so the 404 still shows the navbar. Setup stays in config files: json-server is pinned to 0.17.4 because later functions rely on <code>_embed</code>/<code>_expand</code>, and the API address lives only in <code>.env</code> → <code>axiosClient</code>.</p>',
    vi: '<p><b>Hướng giải.</b> <code>App.js</code> có một route layout (không path) với element <code>Layout</code>; mọi trang là con của nó ⇒ navbar/footer viết một lần, trang vẽ vào <code>&lt;Outlet /&gt;</code>. <code>NavLink</code> tự gắn <code>active</code>; <code>end</code> giữ cho Home không khớp mọi đường dẫn. Route <code>path="*"</code> là con cuối của layout nên 404 vẫn có navbar. Cấu hình nằm ở tệp cấu hình: ghim json-server 0.17.4 vì các chức năng sau dựa vào <code>_embed</code>/<code>_expand</code>; địa chỉ API chỉ ở <code>.env</code> → <code>axiosClient</code>.</p>',
  },
}));
