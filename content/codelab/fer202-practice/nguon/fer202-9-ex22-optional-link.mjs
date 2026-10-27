/**
 * FER202 · Exercise 22 — Optional params & Link: NavLink tuỳ biến class, tham số tuỳ chọn (:lang?), phân trang ?page=.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const R = { router: true };

const COURSES = `const COURSES = [
  { id: 1, title: 'React cơ bản', lang: 'vi' },
  { id: 2, title: 'React Router in Depth', lang: 'en' },
  { id: 3, title: 'Redux Toolkit thực chiến', lang: 'vi' },
  { id: 4, title: 'Testing React Apps', lang: 'en' },
  { id: 5, title: 'Hooks nâng cao', lang: 'vi' },
];`;

export default doiDau({
  slug: 'fer202-9-ex22-optional-link',
  ten: 'Exercise 22 — Optional params & Link',
  khoa: KHOA,
  baiHoc: 'fer202-9-ex22-optional-link',
  de: [
    reactNho({
      tieuDe: 'Link vs <a>, and NavLink with a className function',
      doKho: 'EASY', phut: 10, index: R,
      khaiNiem: ['Link', 'NavLink isActive', 'external links'], the: ['router', 'NavLink', 'exercise-22'],
      moTa: {
        en: '<p>Internal navigation must use <code>Link</code>/<code>NavLink</code> (no reload); links to OTHER sites stay plain <code>&lt;a&gt;</code>, opened in a new tab safely. Style the menu with a <code>className</code> <b>function</b> receiving <code>{ isActive }</code>, so the active item gets <code>nav-item current</code> instead of the default <code>active</code>.</p>',
        vi: '<p>Điều hướng nội bộ phải dùng <code>Link</code>/<code>NavLink</code> (không tải lại); link sang site KHÁC vẫn là <code>&lt;a&gt;</code> thường, mở tab mới an toàn. Tạo kiểu menu bằng <code>className</code> dạng <b>hàm</b> nhận <code>{ isActive }</code>, để mục đang mở có <code>nav-item current</code> thay vì <code>active</code> mặc định.</p>',
      },
      yeuCau: [
        { en: 'Menu: <code>#m-home</code> (<code>/</code>, end), <code>#m-docs</code> (<code>/docs</code>), <code>#m-faq</code> (<code>/faq</code>) — class <code>nav-item</code>, plus <code>current</code> when active. Pages: <code>h1</code> with Home/Docs/FAQ.', vi: 'Menu: <code>#m-home</code> (<code>/</code>, end), <code>#m-docs</code> (<code>/docs</code>), <code>#m-faq</code> (<code>/faq</code>) — class <code>nav-item</code>, thêm <code>current</code> khi đang mở. Trang: <code>h1</code> ghi Home/Docs/FAQ.' },
        { en: 'External <code>#m-github</code> → <code>https://github.com</code> with <code>target="_blank"</code> and <code>rel="noopener noreferrer"</code>.', vi: 'Link ngoài <code>#m-github</code> → <code>https://github.com</code> có <code>target="_blank"</code> và <code>rel="noopener noreferrer"</code>.' },
      ],
      viDu: [{ input: 'on /docs', output: '#m-docs class="nav-item current"', explanation: 'className={({ isActive }) => isActive ? "nav-item current" : "nav-item"}|||className={({ isActive }) => isActive ? "nav-item current" : "nav-item"}' }],
      goiY: ['const cls = ({ isActive }) => (isActive ? "nav-item current" : "nav-item");', '<NavLink to="/docs" id="m-docs" className={cls}>Docs</NavLink>'],
      loiHayGap: ['Dùng <code>Link</code> cho site ngoài ⇒ Router coi là đường dẫn nội bộ, ra "/https://github.com".', '<code>target="_blank"</code> thiếu <code>rel="noopener"</code> ⇒ trang mới truy cập được <code>window.opener</code>.'],
      thuatNgu: [{ en: 'internal / external link', vi: 'link trong app / link sang site khác' }],
      giaiThich: '<p><code>NavLink</code> nhận <code>className</code> (và <code>style</code>) dạng hàm, gọi với <code>{ isActive, isPending }</code> — tiện khi dùng CSS framework có tên class riêng.</p>',
      dau: `// src/App.js — STARTER
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <nav>
        <a href="/" id="m-home" className="nav-item">Home</a>
        <a href="/docs" id="m-docs" className="nav-item">Docs</a>
        <a href="/faq" id="m-faq" className="nav-item">FAQ</a>
        <a href="https://github.com" id="m-github">GitHub</a>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/docs" element={<h1>Docs</h1>} />
        <Route path="/faq" element={<h1>FAQ</h1>} />
      </Routes>
    </div>
  );
}
`,
      giai: `// src/App.js — NavLink cho link nội bộ (className dạng hàm), <a> an toàn cho link ngoài
import { NavLink, Route, Routes } from 'react-router-dom';

const cls = ({ isActive }) => (isActive ? 'nav-item current' : 'nav-item');

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/" end id="m-home" className={cls}>Home</NavLink>{' '}
        <NavLink to="/docs" id="m-docs" className={cls}>Docs</NavLink>{' '}
        <NavLink to="/faq" id="m-faq" className={cls}>FAQ</NavLink>{' '}
        <a href="https://github.com" id="m-github" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/docs" element={<h1>Docs</h1>} />
        <Route path="/faq" element={<h1>FAQ</h1>} />
      </Routes>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Click navigates without reload', kiem: 'danh-sach-text', selector: 'h1', mongDoi: ['FAQ'], truoc: [click('#m-faq')] },
        { moTa: 'Active item gets "current"', url: '/docs', kiem: 'thuoc-tinh', selector: '#m-docs', thuocTinh: 'class', giaTri: 'nav-item current' },
        { moTa: 'Home not current on /docs', url: '/docs', kiem: 'thuoc-tinh', selector: '#m-home', thuocTinh: 'class', giaTri: 'nav-item' },
        { moTa: 'External link is safe', kiem: 'thuoc-tinh', selector: '#m-github', thuocTinh: 'rel', khop: 'noopener' },
        { an: true, moTa: 'External link opens a new tab', kiem: 'thuoc-tinh', selector: '#m-github', thuocTinh: 'target', giaTri: '_blank' },
        { an: true, moTa: 'No reload', kiem: 'khong-tai-lai', truoc: [click('#m-docs')] },
      ],
    }),
    reactNho({
      tieuDe: 'Optional segment: /courses/:lang?',
      doKho: 'MEDIUM', phut: 12, index: R,
      khaiNiem: ['optional params', 'one route, two URLs', 'validating params'], the: ['router', 'useParams', 'exercise-22'],
      moTa: {
        en: '<p>React Router 6.5+ supports <b>optional segments</b>. One route <code>/courses/:lang?</code> serves both <code>/courses</code> (all courses) and <code>/courses/vi</code> or <code>/courses/en</code> (filtered). An unsupported language shows a message instead of an empty list.</p>',
        vi: '<p>React Router 6.5+ hỗ trợ <b>đoạn tuỳ chọn</b>. Một route <code>/courses/:lang?</code> phục vụ cả <code>/courses</code> (mọi khoá) lẫn <code>/courses/vi</code> hay <code>/courses/en</code> (đã lọc). Ngôn ngữ không hỗ trợ thì hiện thông báo thay vì danh sách rỗng.</p>',
      },
      yeuCau: [
        { en: 'One <code>&lt;Route path="/courses/:lang?"&gt;</code>. Items <code>li.course</code>; heading <code>#heading</code>: <code>All courses</code> / <code>Courses in vi</code>.', vi: 'Một <code>&lt;Route path="/courses/:lang?"&gt;</code>. Dòng <code>li.course</code>; tiêu đề <code>#heading</code>: <code>All courses</code> / <code>Courses in vi</code>.' },
        { en: 'Filter links <code>#f-all</code>, <code>#f-vi</code>, <code>#f-en</code> (NavLink, <code>end</code> on all). Unknown ⇒ <code>#bad-lang</code> <code>Language "fr" is not supported</code>.', vi: 'Link lọc <code>#f-all</code>, <code>#f-vi</code>, <code>#f-en</code> (NavLink, <code>end</code> cho cả ba). Lạ ⇒ <code>#bad-lang</code> <code>Language "fr" is not supported</code>.' },
      ],
      viDu: [{ input: '/courses/en', output: 'React Router in Depth, Testing React Apps', explanation: 'lang is undefined on /courses.|||Trên /courses thì lang là undefined.' }],
      goiY: ['<Route path="/courses/:lang?" element={<Courses />} />', 'const { lang } = useParams(); if (lang && !["vi", "en"].includes(lang)) …'],
      loiHayGap: ['Khai hai route <code>/courses</code> và <code>/courses/:lang</code> trỏ cùng component — chạy được nhưng thừa; đề yêu cầu một route.', 'Quên <code>end</code> trên <code>#f-all</code> ⇒ "All" sáng cả khi đang lọc.'],
      thuatNgu: [{ en: 'optional segment', vi: 'đoạn URL có thể có hoặc không (dấu ?)' }],
      giaiThich: '<p>Dấu <code>?</code> sau tham số khiến đoạn đó không bắt buộc; <code>useParams()</code> trả <code>undefined</code> khi URL không có nó. Luôn kiểm giá trị tham số — URL là dữ liệu người dùng gõ.</p>',
      dau: `// src/App.js — STARTER
import { Route, Routes } from 'react-router-dom';

${COURSES}

function Courses() {
  return <ul>{COURSES.map((c) => <li key={c.id} className="course">{c.title}</li>)}</ul>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/courses" element={<Courses />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — một route với đoạn tuỳ chọn :lang?
import { NavLink, Navigate, Route, Routes, useParams } from 'react-router-dom';

${COURSES}

const SUPPORTED = ['vi', 'en'];

function Courses() {
  const { lang } = useParams();
  const filters = (
    <nav>
      <NavLink to="/courses" end id="f-all">All</NavLink>{' '}
      <NavLink to="/courses/vi" end id="f-vi">VI</NavLink>{' '}
      <NavLink to="/courses/en" end id="f-en">EN</NavLink>
    </nav>
  );
  if (lang && !SUPPORTED.includes(lang)) {
    return (<div>{filters}<p id="bad-lang">Language "{lang}" is not supported</p></div>);
  }
  const shown = lang ? COURSES.filter((c) => c.lang === lang) : COURSES;
  return (
    <div>
      {filters}
      <h1 id="heading">{lang ? ´Courses in @{lang}´ : 'All courses'}</h1>
      <ul>{shown.map((c) => <li key={c.id} className="course">{c.title}</li>)}</ul>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/courses" replace />} />
      <Route path="/courses/:lang?" element={<Courses />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'All courses without the segment', url: '/courses', kiem: 'danh-sach-text', selector: '#heading', mongDoi: ['All courses'] },
        { moTa: 'Filtered by lang', url: '/courses/en', kiem: 'danh-sach-text', selector: 'li.course', mongDoi: ['React Router in Depth', 'Testing React Apps'] },
        { moTa: 'Filter link navigates', url: '/courses', kiem: 'duong-dan', giaTri: '/courses/vi', truoc: [click('#f-vi')] },
        { moTa: 'Unsupported language', url: '/courses/fr', kiem: 'text', selector: '#bad-lang', giaTri: 'Language "fr" is not supported' },
        { an: true, moTa: '"All" not active while filtering', url: '/courses/vi', kiem: 'khong-ton-tai', selector: '#f-all.active' },
        { an: true, moTa: 'One route with an optional segment', kiem: 'ma-nguon', khop: 'path=["\']/courses/:lang\\?["\']' },
      ],
    }),
    reactNho({
      tieuDe: 'Pagination with ?page= and Link',
      doKho: 'HARD', phut: 16, index: R,
      khaiNiem: ['query params with Link', 'clamping input', 'disabled navigation'], the: ['router', 'useSearchParams', 'exercise-22'],
      moTa: {
        en: '<p>Show 12 articles, <b>5 per page</b>. The page number lives in the URL (<code>/articles?page=2</code>) so it can be bookmarked. Pagination buttons are <code>Link</code>s built from the current page. Bad values (<code>page=abc</code>, <code>page=99</code>, <code>page=0</code>) are clamped to a valid page.</p>',
        vi: '<p>Hiện 12 bài viết, <b>5 bài/trang</b>. Số trang nằm trên URL (<code>/articles?page=2</code>) để lưu dấu trang được. Nút phân trang là <code>Link</code> tạo từ trang hiện tại. Giá trị sai (<code>page=abc</code>, <code>page=99</code>, <code>page=0</code>) được kẹp về trang hợp lệ.</p>',
      },
      yeuCau: [
        { en: 'Articles titled <code>Article 1</code> … <code>Article 12</code> in <code>li.article</code>; <code>#page-info</code> <code>Page 2 of 3</code>.', vi: 'Bài <code>Article 1</code> … <code>Article 12</code> trong <code>li.article</code>; <code>#page-info</code> <code>Page 2 of 3</code>.' },
        { en: '<code>#prev</code> / <code>#next</code> are Links to <code>?page=n±1</code>; on the first/last page render a <code>span</code> with the same id and class <code>disabled</code> instead. Number links <code>a.page-num</code> 1..3, current one has class <code>current</code>.', vi: '<code>#prev</code> / <code>#next</code> là Link tới <code>?page=n±1</code>; ở trang đầu/cuối vẽ <code>span</code> cùng id với class <code>disabled</code>. Link số <code>a.page-num</code> 1..3, trang hiện tại có class <code>current</code>.' },
      ],
      viDu: [{ input: '/articles?page=3', output: 'Article 11, Article 12 · Next disabled', explanation: 'slice((page - 1) * 5, page * 5)|||slice((page - 1) * 5, page * 5)' }],
      goiY: ['const raw = Number(params.get("page")); const page = Number.isInteger(raw) ? Math.min(Math.max(raw, 1), totalPages) : 1;', '<Link id="next" to={´?page=@{page + 1}´}>Next</Link>'],
      loiHayGap: ['Không kẹp ⇒ page=99 hiện danh sách trống, page=abc hiện "Page NaN".', 'Dùng <code>&lt;a href="?page=2"&gt;</code> ⇒ tải lại toàn trang.'],
      thuatNgu: [{ en: 'pagination', vi: 'phân trang' }, { en: 'clamp', vi: 'kẹp vào khoảng hợp lệ' }],
      giaiThich: '<p>Link với <code>to="?page=2"</code> là đường dẫn tương đối chỉ đổi query string. Trang hiện tại suy ra từ URL mỗi lần render, nên Back/Forward của trình duyệt và lưu dấu trang đều đúng.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const ARTICLES = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: 'Article ' + (i + 1) }));

function Articles() {
  const [page, setPage] = useState(1);
  const shown = ARTICLES.slice((page - 1) * 5, page * 5);
  return (
    <div>
      <ul>{shown.map((a) => <li key={a.id} className="article">{a.title}</li>)}</ul>
      <a id="next" href={'?page=' + (page + 1)} onClick={() => setPage(page + 1)}>Next</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/articles" replace />} />
      <Route path="/articles" element={<Articles />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — trang hiện tại suy ra từ ?page= (đã kẹp), nút phân trang là Link
import { Link, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

const ARTICLES = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: ´Article @{i + 1}´ }));
const PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(ARTICLES.length / PER_PAGE);

function Articles() {
  const [params] = useSearchParams();
  const raw = Number(params.get('page'));
  const page = Number.isInteger(raw) ? Math.min(Math.max(raw, 1), TOTAL_PAGES) : 1;
  const shown = ARTICLES.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <ul>{shown.map((a) => <li key={a.id} className="article">{a.title}</li>)}</ul>
      <p id="page-info">Page {page} of {TOTAL_PAGES}</p>
      <nav>
        {page > 1 ? <Link id="prev" to={´?page=@{page - 1}´}>Prev</Link> : <span id="prev" className="disabled">Prev</span>}{' '}
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
          <Link key={n} to={´?page=@{n}´} className={n === page ? 'page-num current' : 'page-num'}>{n}</Link>
        ))}{' '}
        {page < TOTAL_PAGES ? <Link id="next" to={´?page=@{page + 1}´}>Next</Link> : <span id="next" className="disabled">Next</span>}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/articles" replace />} />
      <Route path="/articles" element={<Articles />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Page from the URL', url: '/articles?page=3', kiem: 'danh-sach-text', selector: 'li.article', mongDoi: ['Article 11', 'Article 12'] },
        { moTa: 'Next link goes to page 2', url: '/articles', kiem: 'duong-dan', giaTri: '/articles?page=2', truoc: [click('#next')] },
        { moTa: 'Page info', url: '/articles?page=2', kiem: 'text', selector: '#page-info', giaTri: 'Page 2 of 3' },
        { moTa: 'Prev disabled on page 1', url: '/articles', kiem: 'ton-tai', selector: 'span#prev.disabled' },
        { an: true, moTa: 'Too big ⇒ last page', url: '/articles?page=99', kiem: 'text', selector: '#page-info', giaTri: 'Page 3 of 3' },
        { an: true, moTa: 'Garbage ⇒ first page', url: '/articles?page=abc', kiem: 'text', selector: '#page-info', giaTri: 'Page 1 of 3' },
        { an: true, moTa: 'Current number highlighted', url: '/articles?page=2', kiem: 'text', selector: 'a.page-num.current', giaTri: '2' },
        { an: true, moTa: 'No reload when paging', url: '/articles', kiem: 'khong-tai-lai', truoc: [click('#next', 2)] },
      ],
    }),
  ],
});
