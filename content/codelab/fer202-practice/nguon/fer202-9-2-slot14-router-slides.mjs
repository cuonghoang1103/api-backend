/**
 * FER202 · 9.2 — Slide check: React Router (Slot 14). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-9-2-slot14-router-slides',
  ten: '9.2 Slide check — React Router',
  khoa: KHOA,
  baiHoc: 'fer202-9-2-slot14-router-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: SPA routing with react-router-dom v6',
      doKho: 'EASY', phut: 14,
      khaiNiem: ['SPA', 'BrowserRouter', 'Routes', 'params', 'Outlet', 'useNavigate'], the: ['router', 'quiz'],
      moTa: {
        en: '<p>Twelve questions on Slot 14: client vs server routing, setting up react-router-dom v6, declaring routes, nested routes with Outlet, params, optional params and navigation hooks.</p>',
        vi: '<p>Mười hai câu về Slot 14: định tuyến phía client và server, cài react-router-dom v6, khai báo route, route lồng với Outlet, tham số, tham số tuỳ chọn và hook điều hướng.</p>',
      },
      goiY: ['v6: Routes thay Switch, element thay component, useNavigate thay useHistory.', 'Tham số URL luôn là chuỗi.'],
      loiHayGap: ['Trả lời theo cú pháp v5 (Switch, exact, component=).', 'Nhầm Link (người dùng bấm) với useNavigate (điều hướng bằng mã).'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'SPA', vi: 'ứng dụng một trang: tải một lần, đổi nội dung bằng JavaScript' }],
      cauHoi: [
        q('q1', 'In a single-page application, changing the URL…', [['a', 'always downloads a new HTML page from the server'], ['b', 'is handled in the browser by the router, which swaps components without a full reload'], ['c', 'restarts React'], ['d', 'is impossible']], ['b'], 'The server sends index.html once; the router maps URLs to components.|||Server gửi index.html một lần; router ánh xạ URL sang component.'),
        q('q2', 'Install command for the web router?', [['a', '<code>npm i react-router</code> only'], ['b', '<code>npm i react-router-dom</code>'], ['c', '<code>npm i router</code>'], ['d', '<code>npm i @react/router</code>']], ['b'], 'react-router-dom includes the DOM bindings (BrowserRouter, Link…).|||react-router-dom có phần cho DOM (BrowserRouter, Link…).'),
        q('q3', 'Where is <code>&lt;BrowserRouter&gt;</code> usually placed?', [['a', 'Around each page'], ['b', 'Once, around the whole app (index.js)'], ['c', 'Inside every Link'], ['d', 'In the public folder']], ['b'], 'Everything using router hooks must be inside it.|||Mọi thứ dùng hook của router phải nằm bên trong nó.'),
        q('q4', 'v6 replaced <code>&lt;Switch&gt;</code> with…', [['a', '<code>&lt;Routes&gt;</code>'], ['b', '<code>&lt;Router&gt;</code>'], ['c', '<code>&lt;Case&gt;</code>'], ['d', '<code>&lt;Pages&gt;</code>']], ['a'], 'And component={X} became element={<X />}.|||Và component={X} thành element={<X />}.'),
        q('q5', 'Which path matches every URL not matched by other routes?', [['a', '<code>/</code>'], ['b', '<code>*</code>'], ['c', '<code>404</code>'], ['d', '<code>/all</code>']], ['b'], 'Use it for a Not Found page.|||Dùng cho trang Not Found.'),
        q('q6', 'Read <code>:id</code> from <code>/products/:id</code>:', [['a', '<code>useParams()</code>'], ['b', '<code>useLocation().id</code>'], ['c', '<code>props.id</code>'], ['d', '<code>useSearchParams()</code>']], ['a'], 'const { id } = useParams(); — a string.|||const { id } = useParams(); — là chuỗi.'),
        q('q7', 'What renders the matching child route inside a parent layout?', [['a', '<code>&lt;Outlet /&gt;</code>'], ['b', '<code>&lt;Children /&gt;</code>'], ['c', '<code>&lt;Slot /&gt;</code>'], ['d', '<code>props.children</code> only']], ['a'], 'Nested routes render into the parent\'s Outlet.|||Route lồng vẽ vào Outlet của cha.'),
        q('q8', 'An index route…', [['a', 'renders when the URL exactly matches the parent path'], ['b', 'is the 404 page'], ['c', 'is the first route in the file'], ['d', 'must be called /index']], ['a'], '<Route index element={<Overview />} />|||<Route index element={<Overview />} />'),
        q('q9', 'Navigate to /login after logout (in an event handler):', [['a', '<code>const navigate = useNavigate(); navigate("/login")</code>'], ['b', '<code>window.location = "/login"</code> (recommended)'], ['c', '<code>useHistory().push("/login")</code> in v6'], ['d', '<code>&lt;Link to="/login" /&gt;</code> inside the handler']], ['a'], 'useHistory is v5; window.location reloads the whole app.|||useHistory là v5; window.location tải lại cả app.'),
        q('q10', '<code>/users/:id?</code> means…', [['a', 'id is required'], ['b', 'the id segment is optional (v6.5+)'], ['c', 'a query string'], ['d', 'a regular expression']], ['b'], 'Both /users and /users/3 match.|||Cả /users lẫn /users/3 đều khớp.'),
        q('q11', 'Advantages of NavLink over Link? (choose all)', [['a', 'Adds an active class/state when its path matches'], ['b', 'Accepts className/style functions with { isActive }'], ['c', 'Makes requests to the server'], ['d', 'Supports <code>end</code> to match exactly']], [['a', 'b', 'd']], 'Otherwise it is a Link.|||Ngoài ra nó giống hệt Link.', true),
        q('q12', 'Why split routes into separate files per feature?', [['a', 'It is required by React'], ['b', 'Each feature owns its routes, App only composes them — easier to maintain large apps'], ['c', 'It makes the bundle bigger'], ['d', 'Routes cannot live in App.js']], ['b'], 'Exercise 20: decoupling routes.|||Exercise 20: tách route.'),
      ],
    }),
  ],
});
