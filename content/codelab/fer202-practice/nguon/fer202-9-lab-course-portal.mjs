/**
 * FER202 · Chương 9 (React Router) — LAB 9: Online Course Portal.
 * Bám Exercise 20 (tách khai báo route), 21 (resource id trong route), 22 (tham số tuỳ chọn & Link) nhưng sâu
 * hơn: cấu hình route bằng mảng + useRoutes, query string (lọc/sắp), route lồng + Outlet + route index,
 * điều hướng bằng mã, tham số tuỳ chọn, route bảo vệ có quay về trang cũ sau đăng nhập, trang 404.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DATA = `// src/data/courses.js — đã cho
const courses = [
  { id: 'react-basics', title: 'React Basics', level: 'Beginner', instructor: 'An Nguyen', lessons: ['What is React?', 'JSX', 'Components', 'Props'] },
  { id: 'react-router', title: 'React Router in Depth', level: 'Intermediate', instructor: 'Binh Tran', lessons: ['Routes', 'Params', 'Nested routes'] },
  { id: 'redux-toolkit', title: 'Redux Toolkit', level: 'Advanced', instructor: 'An Nguyen', lessons: ['Store', 'Slices', 'Thunks'] },
  { id: 'js-es6', title: 'Modern JavaScript (ES6+)', level: 'Beginner', instructor: 'Chi Le', lessons: ['let & const', 'Arrow functions', 'Destructuring', 'Modules', 'Promises'] },
  { id: 'testing-react', title: 'Testing React Apps', level: 'Advanced', instructor: 'Binh Tran', lessons: ['Jest basics', 'React Testing Library'] },
  { id: 'css-layout', title: 'CSS Layout with Flexbox & Grid', level: 'Beginner', instructor: 'Chi Le', lessons: ['Flexbox', 'Grid', 'Responsive'] },
];

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
// "An Nguyen" ⇒ "an-nguyen" (dùng trên URL)
export const slugify = (name) => name.toLowerCase().trim().replace(/\\s+/g, '-');
export default courses;
`;

const CSS = `/* src/index.css — đã cho */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
.nav { display: flex; gap: 14px; align-items: center; padding: 12px 20px; background: #0f172a; }
.nav a { color: #cbd5e1; text-decoration: none; }
.nav a.active { color: #fff; font-weight: 700; border-bottom: 2px solid #38bdf8; }
.nav .spacer { flex: 1; }
.nav button { background: transparent; color: #cbd5e1; border: 1px solid #475569; border-radius: 6px; padding: 4px 10px; cursor: pointer; }
.page { max-width: 960px; margin: 0 auto; padding: 20px; }
.toolbar { display: flex; gap: 10px; margin-bottom: 12px; }
.toolbar select { padding: 6px 8px; border-radius: 8px; border: 1px solid #cbd5e1; }
.course-item { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 8px; }
.layout { display: grid; grid-template-columns: 220px 1fr; gap: 20px; }
.lesson-link { display: block; padding: 6px 10px; border-radius: 8px; color: #334155; text-decoration: none; }
.lesson-link.active { background: #e0f2fe; color: #0369a1; font-weight: 600; }
button { cursor: pointer; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; }
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const AUTH = `// src/auth.js — trạng thái đăng nhập dùng chung (Context nhỏ) + route bảo vệ
import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Chưa đăng nhập ⇒ sang /login, NHỚ trang đang muốn vào (state.from) để quay lại sau khi đăng nhập
export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
`;

const ROUTES = `// src/routes.js — KHAI BÁO ROUTE TÁCH RIÊNG (Exercise 20): một mảng cấu hình, App chỉ việc useRoutes(routes)
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseLayout from './pages/CourseLayout';
import CourseOverview from './pages/CourseOverview';
import LessonPage from './pages/LessonPage';
import Instructors from './pages/Instructors';
import Login from './pages/Login';
import MyCourses from './pages/MyCourses';
import NotFound from './pages/NotFound';
import { RequireAuth } from './auth';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/courses', element: <CourseList /> },
  {
    // route LỒNG: CourseLayout vẽ khung chung + <Outlet /> cho route con
    path: '/courses/:courseId',
    element: <CourseLayout />,
    children: [
      { index: true, element: <CourseOverview /> }, // /courses/:courseId
      { path: 'lessons/:lessonId', element: <LessonPage /> }, // /courses/:courseId/lessons/:lessonId
    ],
  },
  { path: '/instructors/:name?', element: <Instructors /> }, // :name? = tham số TUỲ CHỌN
  { path: '/login', element: <Login /> },
  { path: '/my-courses', element: <RequireAuth><MyCourses /></RequireAuth> },
  { path: '*', element: <NotFound /> },
];
`;

const NAVBAR = `// src/components/NavBar.js — NavLink tự thêm class "active"; "end" để "/" không sáng ở mọi trang
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <NavLink to="/" end id="nav-home">CT Academy</NavLink>
      <NavLink to="/courses" id="nav-courses">Courses</NavLink>
      <NavLink to="/instructors" id="nav-instructors">Instructors</NavLink>
      <NavLink to="/my-courses" id="nav-my">My courses</NavLink>
      <span className="spacer" />
      {user ? (
        <button type="button" id="btn-logout" onClick={() => { logout(); navigate('/'); }}>Logout ({user})</button>
      ) : (
        <NavLink to="/login" id="nav-login">Login</NavLink>
      )}
    </nav>
  );
}
`;

const APP = `// src/App.js — dùng cấu hình route ở routes.js
import { useRoutes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AuthProvider } from './auth';
import { routes } from './routes';

function Pages() {
  return useRoutes(routes); // trả về phần tử của route khớp URL hiện tại
}

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="page">
        <Pages />
      </main>
    </AuthProvider>
  );
}
`;

const HOME = `// src/pages/Home.js
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <h1 id="home-title">Welcome to CT Academy</h1>
      <p>Pick a course and start learning today.</p>
      <Link to="/courses" id="home-cta">Browse courses →</Link>
    </section>
  );
}
`;

const LIST = `// src/pages/CourseList.js — lọc + sắp xếp SỐNG TRÊN URL (?level=…&sort=…): chia sẻ link là thấy đúng
import { Link, useSearchParams } from 'react-router-dom';
import courses, { LEVELS } from '../data/courses';

export default function CourseList() {
  const [params, setParams] = useSearchParams();
  const level = params.get('level') || 'all';
  const sort = params.get('sort') || 'default';

  // đổi MỘT tham số, giữ nguyên tham số kia
  const setParam = (key, value, macDinh) => {
    const next = new URLSearchParams(params);
    if (value === macDinh) next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  let list = courses.filter((c) => level === 'all' || c.level === level);
  if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'lessons') list = [...list].sort((a, b) => b.lessons.length - a.lessons.length); // sort ổn định ⇒ bằng nhau giữ thứ tự

  return (
    <section>
      <h2>Courses</h2>
      <div className="toolbar">
        <select id="level" value={level} onChange={(e) => setParam('level', e.target.value, 'all')}>
          <option value="all">All levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select id="sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'default')}>
          <option value="default">Default order</option>
          <option value="title">Title (A → Z)</option>
          <option value="lessons">Most lessons</option>
        </select>
      </div>
      <p id="course-count">{list.length} courses</p>
      {list.map((c) => (
        <div key={c.id} className="course-item">
          <Link className="course-link" to={´/courses/@{c.id}´}>{c.title}</Link>
          <div className="course-meta">{c.level} · {c.lessons.length} lessons</div>
        </div>
      ))}
    </section>
  );
}
`;

const LAYOUT = `// src/pages/CourseLayout.js — khung chung của một khoá: tiêu đề + danh sách bài + <Outlet /> cho route con
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import courses from '../data/courses';

export default function CourseLayout() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div id="not-found">
        <h2>Course not found</h2>
        <Link to="/courses">← Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside>
        <h2 id="course-title">{course.title}</h2>
        <p id="course-meta">{course.level} · {course.instructor}</p>
        <nav id="lesson-list">
          {course.lessons.map((title, i) => (
            // đường dẫn TƯƠNG ĐỐI: "lessons/2" nối sau /courses/:courseId
            <NavLink key={title} to={´lessons/@{i + 1}´} className="lesson-link">{i + 1}. {title}</NavLink>
          ))}
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
`;

const OVERVIEW = `// src/pages/CourseOverview.js — route INDEX: /courses/:courseId
import { useNavigate, useParams } from 'react-router-dom';
import courses from '../data/courses';

export default function CourseOverview() {
  const { courseId } = useParams(); // route con đọc được tham số của route cha
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);
  return (
    <div id="course-overview">
      <p>This course has {course.lessons.length} lessons.</p>
      <button type="button" id="btn-start" onClick={() => navigate('lessons/1')}>Start learning</button>
    </div>
  );
}
`;

const LESSON = `// src/pages/LessonPage.js — /courses/:courseId/lessons/:lessonId + Prev/Next bằng useNavigate
import { useNavigate, useParams } from 'react-router-dom';
import courses from '../data/courses';

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);
  const n = Number(lessonId); // tham số route luôn là CHUỖI
  const title = course.lessons[n - 1];

  if (!Number.isInteger(n) || !title) return <p id="lesson-not-found">Lesson not found</p>;

  const go = (k) => navigate(´/courses/@{courseId}/lessons/@{k}´);
  return (
    <article>
      <h3 id="lesson-title">Lesson {n}: {title}</h3>
      <div id="lesson-nav">
        <button type="button" id="prev-lesson" disabled={n === 1} onClick={() => go(n - 1)}>← Previous</button>{' '}
        <button type="button" id="next-lesson" disabled={n === course.lessons.length} onClick={() => go(n + 1)}>Next →</button>
      </div>
    </article>
  );
}
`;

const INSTRUCTORS = `// src/pages/Instructors.js — /instructors và /instructors/:name (tham số TUỲ CHỌN)
import { Link, useParams } from 'react-router-dom';
import courses, { slugify } from '../data/courses';

export default function Instructors() {
  const { name } = useParams(); // undefined khi URL là /instructors
  const all = [...new Set(courses.map((c) => c.instructor))].sort();

  if (!name) {
    return (
      <section>
        <h2>Instructors</h2>
        <ul>
          {all.map((i) => (
            <li key={i}><Link className="instructor-link" to={´/instructors/@{slugify(i)}´}>{i}</Link></li>
          ))}
        </ul>
      </section>
    );
  }

  const real = all.find((i) => slugify(i) === name);
  if (!real) return <p id="instructor-not-found">Instructor not found</p>;
  return (
    <section>
      <h2 id="instructor-name">{real}</h2>
      <ul id="instructor-courses">
        {courses.filter((c) => c.instructor === real).map((c) => (
          <li key={c.id}><Link to={´/courses/@{c.id}´}>{c.title}</Link></li>
        ))}
      </ul>
      <Link to="/instructors">← All instructors</Link>
    </section>
  );
}
`;

const LOGIN = `// src/pages/Login.js — đăng nhập giả: xong thì QUAY LẠI trang bị chặn (location.state.from)
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    login(username.trim());
    // replace: nút Back không quay về trang đăng nhập nữa
    navigate(from ? from.pathname + (from.search || '') : '/my-courses', { replace: true });
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {from && <p id="login-reason">Please log in to continue.</p>}
      <input id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />{' '}
      <button type="submit">Login</button>
    </form>
  );
}
`;

const MY = `// src/pages/MyCourses.js — chỉ vào được khi đã đăng nhập (bọc bởi RequireAuth trong routes.js)
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import courses from '../data/courses';

export default function MyCourses() {
  const { user } = useAuth();
  return (
    <section>
      <h2 id="welcome">Welcome, {user}!</h2>
      <ul id="my-list">
        {courses.slice(0, 2).map((c) => (
          <li key={c.id}><Link to={´/courses/@{c.id}´}>{c.title}</Link></li>
        ))}
      </ul>
    </section>
  );
}
`;

const NOTFOUND = `// src/pages/NotFound.js — route "*": mọi URL không khớp
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section id="page-404">
      <h2>404 — Page not found</h2>
      <Link to="/">Go home</Link>
    </section>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const stub = (ten, ghiChu) => `// src/pages/${ten}.js — STARTER
// TODO: ${ghiChu}
export default function ${ten}() {
  return <p>${ten} — not implemented</p>;
}
`;
const S_ROUTES = `// src/routes.js — STARTER: khai báo MỌI route ở đây (mảng cấu hình) rồi App dùng useRoutes(routes)
import Home from './pages/Home';

export const routes = [
  { path: '/', element: <Home /> },
  // TODO: /courses · /courses/:courseId (lồng: index + lessons/:lessonId) · /instructors/:name? · /login · /my-courses (bảo vệ) · *
];
`;
const S_APP = `// src/App.js — STARTER
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AuthProvider } from './auth';
import Home from './pages/Home';

export default function App() {
  // TODO: thay <Routes> viết tay bằng useRoutes(routes) từ ./routes
  return (
    <AuthProvider>
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
`;
const S_AUTH = `// src/auth.js — STARTER
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function RequireAuth({ children }) {
  // TODO: chưa đăng nhập ⇒ <Navigate to="/login" replace state={{ from: location }} />
  return children;
}
`;
const S_NAVBAR = `// src/components/NavBar.js — STARTER (dùng <a> ⇒ tải lại cả trang!)
export default function NavBar() {
  // TODO: NavLink #nav-home (end) · #nav-courses · #nav-instructors · #nav-my · #nav-login / #btn-logout
  return (
    <nav className="nav">
      <a href="/" id="nav-home">CT Academy</a>
      <a href="/courses" id="nav-courses">Courses</a>
    </nav>
  );
}
`;

const INDEX = index({ router: true }).replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/courses.js': DATA, 'src/pages/Home.js': HOME };
const LOI_GIAI = {
  'src/routes.js': ROUTES, 'src/App.js': APP, 'src/auth.js': AUTH, 'src/components/NavBar.js': NAVBAR,
  'src/pages/CourseList.js': LIST, 'src/pages/CourseLayout.js': LAYOUT, 'src/pages/CourseOverview.js': OVERVIEW, 'src/pages/LessonPage.js': LESSON,
  'src/pages/Instructors.js': INSTRUCTORS, 'src/pages/Login.js': LOGIN, 'src/pages/MyCourses.js': MY, 'src/pages/NotFound.js': NOTFOUND, ...CHUNG,
};
const KHOI_DAU = {
  'src/routes.js': S_ROUTES, 'src/App.js': S_APP, 'src/auth.js': S_AUTH, 'src/components/NavBar.js': S_NAVBAR,
  'src/pages/CourseList.js': stub('CourseList', '#level + #sort trên URL (?level=&sort=), .course-item > .course-link, #course-count'),
  'src/pages/CourseLayout.js': stub('CourseLayout', '#course-title, #course-meta, #lesson-list (NavLink .lesson-link), <Outlet />, #not-found'),
  'src/pages/CourseOverview.js': stub('CourseOverview', '#course-overview + #btn-start ⇒ lessons/1'),
  'src/pages/LessonPage.js': stub('LessonPage', '#lesson-title "Lesson 2: JSX", #prev-lesson, #next-lesson, #lesson-not-found'),
  'src/pages/Instructors.js': stub('Instructors', '/instructors ⇒ .instructor-link; /instructors/:name ⇒ #instructor-name + #instructor-courses'),
  'src/pages/Login.js': stub('Login', '#login-form + #username; đăng nhập xong quay về location.state.from'),
  'src/pages/MyCourses.js': stub('MyCourses', '#welcome "Welcome, {user}!"'),
  'src/pages/NotFound.js': stub('NotFound', '#page-404'),
  ...CHUNG,
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const click = (selector) => ({ hanhDong: 'click', selector });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const DANG_NHAP = [{ hanhDong: 'nhap', selector: '#username', giaTri: 'cuong' }, { hanhDong: 'gui', selector: '#login-form' }];
const KIEM = [
  // f1
  { nhom: 'f1', moTa: 'Home page at "/"', url: '/', kiem: 'text', selector: '#home-title', giaTri: 'Welcome to CT Academy' },
  { nhom: 'f1', moTa: 'Navbar uses NavLink: #nav-courses is active on /courses', url: '/courses', kiem: 'ton-tai', selector: '#nav-courses.active' },
  { nhom: 'f1', moTa: '"/" link is not active on other pages (end)', url: '/courses', kiem: 'khong-ton-tai', selector: '#nav-home.active' },
  { nhom: 'f1', moTa: 'Unknown URL ⇒ #page-404', url: '/abc/xyz', kiem: 'ton-tai', selector: '#page-404' },
  { nhom: 'f1', an: true, moTa: 'Clicking a nav link changes route without reloading', url: '/', kiem: 'duong-dan', giaTri: '/courses', truoc: [click('#nav-courses')] },
  // f2
  { nhom: 'f2', moTa: '/courses lists 6 courses', url: '/courses', kiem: 'so-luong', selector: '.course-item', giaTri: 6 },
  { nhom: 'f2', moTa: '#level writes ?level= to the URL', url: '/courses', kiem: 'duong-dan', giaTri: '/courses?level=Beginner', truoc: [doi('#level', 'Beginner')] },
  { nhom: 'f2', moTa: '?level=Advanced&sort=title filters and sorts', url: '/courses?level=Advanced&sort=title', kiem: 'danh-sach-text', selector: '.course-link', mongDoi: ['Redux Toolkit', 'Testing React Apps'] },
  { nhom: 'f2', moTa: 'sort=lessons: most lessons first, ties keep data order', url: '/courses?sort=lessons', kiem: 'danh-sach-text', selector: '.course-link', mongDoi: ['Modern JavaScript (ES6+)', 'React Basics', 'React Router in Depth', 'Redux Toolkit', 'CSS Layout with Flexbox & Grid', 'Testing React Apps'] },
  { nhom: 'f2', an: true, moTa: 'Changing sort keeps the level parameter', url: '/courses?level=Beginner', kiem: 'duong-dan', khop: '^/courses\\?(level=Beginner&sort=title|sort=title&level=Beginner)$', truoc: [doi('#sort', 'title')] },
  { nhom: 'f2', an: true, moTa: 'Dropdowns are pre-selected from the URL', url: '/courses?level=Intermediate&sort=title', kiem: 'thuoc-tinh-js', selector: '#level', thuocTinh: 'value', giaTri: 'Intermediate' },
  // f3
  { nhom: 'f3', moTa: 'Course link goes to /courses/:courseId', url: '/courses', kiem: 'duong-dan', giaTri: '/courses/redux-toolkit', truoc: [click('a.course-link[href="/courses/redux-toolkit"]')] },
  { nhom: 'f3', moTa: 'Detail reads :courseId', url: '/courses/js-es6', kiem: 'danh-sach-text', selector: '#course-title, #course-meta', mongDoi: ['Modern JavaScript (ES6+)', 'Beginner · Chi Le'] },
  { nhom: 'f3', moTa: 'Unknown course ⇒ #not-found', url: '/courses/vue-basics', kiem: 'text', selector: '#not-found', khop: 'Course not found' },
  // f4
  { nhom: 'f4', moTa: 'Index route shows the overview', url: '/courses/react-basics', kiem: 'text', selector: '#course-overview', khop: 'This course has 4 lessons' },
  { nhom: 'f4', moTa: 'Child route renders inside the layout (Outlet)', url: '/courses/react-basics/lessons/2', kiem: 'danh-sach-text', selector: '#course-title, #lesson-title', mongDoi: ['React Basics', 'Lesson 2: JSX'] },
  { nhom: 'f4', moTa: 'Sidebar links are relative and highlight the current lesson', url: '/courses/react-basics/lessons/3', kiem: 'text', selector: '.lesson-link.active', giaTri: '3. Components' },
  { nhom: 'f4', an: true, moTa: 'Clicking a sidebar lesson changes only the child route', url: '/courses/react-router', kiem: 'duong-dan', giaTri: '/courses/react-router/lessons/2', truoc: [click('#lesson-list .lesson-link:nth-child(2)')] },
  { nhom: 'f4', an: true, moTa: 'Unknown lesson ⇒ #lesson-not-found', url: '/courses/react-basics/lessons/9', kiem: 'ton-tai', selector: '#lesson-not-found' },
  // f5
  { nhom: 'f5', moTa: '#btn-start opens lesson 1', url: '/courses/redux-toolkit', kiem: 'duong-dan', giaTri: '/courses/redux-toolkit/lessons/1', truoc: [click('#btn-start')] },
  { nhom: 'f5', moTa: 'Next goes to the next lesson', url: '/courses/react-basics/lessons/2', kiem: 'text', selector: '#lesson-title', giaTri: 'Lesson 3: Components', truoc: [click('#next-lesson')] },
  { nhom: 'f5', moTa: 'Previous is disabled on lesson 1, Next on the last', url: '/courses/testing-react/lessons/1', kiem: 'thuoc-tinh-js', selector: '#prev-lesson', thuocTinh: 'disabled', giaTri: true },
  { nhom: 'f5', an: true, moTa: 'Next is disabled on the last lesson', url: '/courses/testing-react/lessons/2', kiem: 'thuoc-tinh-js', selector: '#next-lesson', thuocTinh: 'disabled', giaTri: true },
  // f6
  { nhom: 'f6', moTa: '/instructors lists 3 instructors A → Z', url: '/instructors', kiem: 'danh-sach-text', selector: '.instructor-link', mongDoi: ['An Nguyen', 'Binh Tran', 'Chi Le'] },
  { nhom: 'f6', moTa: '/instructors/an-nguyen shows their courses', url: '/instructors/an-nguyen', kiem: 'danh-sach-text', selector: '#instructor-name, #instructor-courses li', mongDoi: ['An Nguyen', 'React Basics', 'Redux Toolkit'] },
  { nhom: 'f6', moTa: 'Route uses an OPTIONAL parameter', kiem: 'ma-nguon', khop: "/instructors/:name\\?" },
  { nhom: 'f6', an: true, moTa: 'Instructor link uses the slug', url: '/instructors', kiem: 'duong-dan', giaTri: '/instructors/chi-le', truoc: [click('li:nth-child(3) .instructor-link')] },
  { nhom: 'f6', an: true, moTa: 'Unknown instructor message', url: '/instructors/zed', kiem: 'ton-tai', selector: '#instructor-not-found' },
  // f7
  { nhom: 'f7', moTa: '/my-courses redirects to /login when logged out', url: '/my-courses', kiem: 'duong-dan', giaTri: '/login' },
  { nhom: 'f7', moTa: 'After login you are sent BACK to /my-courses', url: '/my-courses', kiem: 'duong-dan', giaTri: '/my-courses', truoc: DANG_NHAP },
  { nhom: 'f7', moTa: 'Welcome message with the username', url: '/my-courses', kiem: 'text', selector: '#welcome', giaTri: 'Welcome, cuong!', truoc: DANG_NHAP },
  { nhom: 'f7', an: true, moTa: 'Logout returns home and protects the page again', url: '/my-courses', kiem: 'duong-dan', giaTri: '/login', truoc: [...DANG_NHAP, click('#btn-logout'), click('#nav-my')] },
  { nhom: 'f7', an: true, moTa: 'Login page explains why (from state)', url: '/my-courses', kiem: 'ton-tai', selector: '#login-reason' },
  // f8
  { nhom: 'f8', moTa: 'Routes are declared in src/routes.js', kiem: 'ma-nguon', tep: 'src/routes.js', khop: "export\\s+(const|default)[\\s\\S]*path:\\s*['\"]/courses" },
  { nhom: 'f8', moTa: 'App renders them with useRoutes', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'useRoutes\\(' },
  { nhom: 'f8', an: true, moTa: 'Nested route config uses children + index', kiem: 'ma-nguon', tep: 'src/routes.js', khop: 'children:[\\s\\S]*index:\\s*true' },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 9: Online Course Portal — React Router v6', vi: 'LAB 9: Cổng khoá học trực tuyến — React Router v6' },
  phu: { en: 'FER202 · Chapter 9 — Routing · Suggested time: 110 minutes · Total: 10 marks', vi: 'FER202 · Chương 9 — Định tuyến · Thời gian gợi ý: 110 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Build the navigation of an e-learning site with <b>React Router v6</b>: a route table kept in its own module (<code>useRoutes</code>), filters stored in the <b>query string</b>, a <b>nested</b> course layout with an <code>&lt;Outlet /&gt;</code>, lesson navigation by code, an <b>optional</b> route parameter, a <b>protected</b> page that sends you back where you wanted to go after logging in, and a 404 page.</p>',
    vi: '<p>Làm phần điều hướng của một trang học trực tuyến bằng <b>React Router v6</b>: bảng route tách thành module riêng (<code>useRoutes</code>), bộ lọc lưu trên <b>query string</b>, khung khoá học <b>lồng</b> với <code>&lt;Outlet /&gt;</code>, chuyển bài bằng mã, tham số route <b>tuỳ chọn</b>, trang <b>bảo vệ</b> đưa bạn quay lại đúng chỗ sau khi đăng nhập, và trang 404.</p>',
  },
  chucNangChinh: [
    { en: 'Pages: Home, Courses, Course (overview + lessons), Instructors, Login, My courses, 404.', vi: 'Trang: Home, Courses, Course (tổng quan + bài học), Instructors, Login, My courses, 404.' },
  ],
  yeuCauChung: [
    { en: '<code>react-router-dom</code> v6; <code>index.js</code> already wraps the app in <code>BrowserRouter</code>.', vi: '<code>react-router-dom</code> v6; <code>index.js</code> đã bọc app bằng <code>BrowserRouter</code>.' },
    { en: 'Never use <code>&lt;a href&gt;</code> for internal links (full page reload) — use <code>Link</code>/<code>NavLink</code>/<code>navigate</code>.', vi: 'Không dùng <code>&lt;a href&gt;</code> cho link nội bộ (tải lại cả trang) — dùng <code>Link</code>/<code>NavLink</code>/<code>navigate</code>.' },
    { en: 'Route parameters are strings — convert before comparing with numbers.', vi: 'Tham số route là chuỗi — đổi kiểu trước khi so với số.' },
  ],
  cayThuMuc: `
src/
├── routes.js            # the whole route table (array) — used by useRoutes
├── auth.js              # AuthProvider · useAuth · RequireAuth
├── components/
│   └── NavBar.js
├── pages/
│   ├── Home.js            (given)
│   ├── CourseList.js      /courses?level=&sort=
│   ├── CourseLayout.js    /courses/:courseId  (+ <Outlet />)
│   ├── CourseOverview.js  index route
│   ├── LessonPage.js      lessons/:lessonId
│   ├── Instructors.js     /instructors/:name?
│   ├── Login.js           /login
│   ├── MyCourses.js       /my-courses (protected)
│   └── NotFound.js        *
├── data/courses.js      # given
├── App.js
└── index.js             # BrowserRouter (given)`,
  wireframe: `
+-----------------------------------------------------------------------------+
| CT Academy   Courses   Instructors   My courses                     Login   |
+-----------------------------------------------------------------------------+
| /courses?level=Beginner&sort=title                                          |
| [Beginner v] [Title (A → Z) v]     3 courses                                |
|  CSS Layout with Flexbox & Grid      Beginner · 3 lessons                   |
|  Modern JavaScript (ES6+)            Beginner · 5 lessons                   |
+-----------------------------------------------------------------------------+
| /courses/react-basics/lessons/2                                             |
| +- React Basics -------+  Lesson 2: JSX                                     |
| | Beginner · An Nguyen |  [← Previous] [Next →]                             |
| | 1. What is React?    |                                                    |
| |[2. JSX]   (active)   |                                                    |
| | 3. Components        |                                                    |
| +----------------------+                                                    |
+-----------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'Course (src/data/courses.js)',
    truong: [
      ['id', 'string (slug)', { en: 'used in the URL: /courses/react-basics', vi: 'dùng trên URL: /courses/react-basics' }],
      ['title', 'string', ''],
      ['level', "'Beginner' | 'Intermediate' | 'Advanced'", ''],
      ['instructor', 'string', { en: 'URL uses slugify(name): "An Nguyen" ⇒ an-nguyen', vi: 'URL dùng slugify(tên): "An Nguyen" ⇒ an-nguyen' }],
      ['lessons', 'string[]', { en: 'lesson N = lessons[N - 1]', vi: 'bài N = lessons[N - 1]' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Navbar, home & 404', vi: 'Navbar, trang chủ & 404' }, diem: 1,
      yeuCau: [
        { en: 'NavLinks <code>#nav-home</code> (<code>end</code>), <code>#nav-courses</code>, <code>#nav-instructors</code>, <code>#nav-my</code>; logged out ⇒ <code>#nav-login</code>, logged in ⇒ <code>#btn-logout</code>.', vi: 'NavLink <code>#nav-home</code> (<code>end</code>), <code>#nav-courses</code>, <code>#nav-instructors</code>, <code>#nav-my</code>; chưa đăng nhập ⇒ <code>#nav-login</code>, đã đăng nhập ⇒ <code>#btn-logout</code>.' },
        { en: '<code>/</code> shows <code>#home-title</code> <code>Welcome to CT Academy</code>; any unknown URL shows <code>#page-404</code>.', vi: '<code>/</code> hiện <code>#home-title</code> <code>Welcome to CT Academy</code>; URL lạ hiện <code>#page-404</code>.' },
      ],
      hook: ['NavLink', 'path="*"'],
    },
    {
      ten: { en: 'Course list with query parameters', vi: 'Danh sách khoá với query parameter' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#level</code> (All levels + 3 levels) and <code>#sort</code> (<code>default</code> · <code>title</code> A → Z · <code>lessons</code> most first) live in the URL: <code>/courses?level=Beginner&amp;sort=title</code>. Changing one keeps the other; the default value removes the parameter.', vi: '<code>#level</code> (All levels + 3 mức) và <code>#sort</code> (<code>default</code> · <code>title</code> A → Z · <code>lessons</code> nhiều bài trước) nằm trên URL: <code>/courses?level=Beginner&amp;sort=title</code>. Đổi một cái giữ cái kia; chọn giá trị mặc định thì bỏ tham số.' },
        { en: 'Each <code>.course-item</code> has a <code>.course-link</code> to <code>/courses/{id}</code>; <code>#course-count</code> reads <code>N courses</code>.', vi: 'Mỗi <code>.course-item</code> có <code>.course-link</code> tới <code>/courses/{id}</code>; <code>#course-count</code> ghi <code>N courses</code>.' },
      ],
      hook: ['useSearchParams'],
      viDu: { en: '/courses?level=Advanced&sort=title  ⇒  Redux Toolkit, Testing React Apps  (2 courses)', vi: '/courses?level=Advanced&sort=title  ⇒  Redux Toolkit, Testing React Apps  (2 courses)' },
    },
    {
      ten: { en: 'Course detail (route parameter)', vi: 'Chi tiết khoá (tham số route)' }, diem: 1.5,
      yeuCau: [
        { en: '<code>/courses/:courseId</code>: <code>#course-title</code>, <code>#course-meta</code> <code>Level · Instructor</code>.', vi: '<code>/courses/:courseId</code>: <code>#course-title</code>, <code>#course-meta</code> <code>Level · Instructor</code>.' },
        { en: 'Unknown id ⇒ <code>#not-found</code> <code>Course not found</code> with a link back.', vi: 'Id lạ ⇒ <code>#not-found</code> <code>Course not found</code> kèm link quay lại.' },
      ],
      hook: ['useParams'],
    },
    {
      ten: { en: 'Nested routes & Outlet', vi: 'Route lồng & Outlet' }, diem: 1.5,
      yeuCau: [
        { en: '<code>CourseLayout</code> renders the sidebar <code>#lesson-list</code> (NavLinks <code>.lesson-link</code> with <b>relative</b> paths <code>lessons/N</code>) and an <code>&lt;Outlet /&gt;</code>.', vi: '<code>CourseLayout</code> vẽ thanh bên <code>#lesson-list</code> (NavLink <code>.lesson-link</code> đường dẫn <b>tương đối</b> <code>lessons/N</code>) và <code>&lt;Outlet /&gt;</code>.' },
        { en: 'Index route ⇒ <code>#course-overview</code> <code>This course has N lessons.</code>; <code>lessons/:lessonId</code> ⇒ <code>#lesson-title</code> <code>Lesson 2: JSX</code>; unknown lesson ⇒ <code>#lesson-not-found</code>.', vi: 'Route index ⇒ <code>#course-overview</code> <code>This course has N lessons.</code>; <code>lessons/:lessonId</code> ⇒ <code>#lesson-title</code> <code>Lesson 2: JSX</code>; bài lạ ⇒ <code>#lesson-not-found</code>.' },
      ],
      hook: ['Outlet', 'index route'],
    },
    {
      ten: { en: 'Navigate by code', vi: 'Điều hướng bằng mã' }, diem: 1,
      yeuCau: [{ en: '<code>#btn-start</code> opens lesson 1; <code>#prev-lesson</code>/<code>#next-lesson</code> move between lessons and are disabled at the ends.', vi: '<code>#btn-start</code> mở bài 1; <code>#prev-lesson</code>/<code>#next-lesson</code> chuyển bài và bị vô hiệu ở hai đầu.' }],
      hook: ['useNavigate'],
    },
    {
      ten: { en: 'Optional parameter', vi: 'Tham số tuỳ chọn' }, diem: 1,
      yeuCau: [
        { en: 'ONE route <code>/instructors/:name?</code>. Without a name: <code>.instructor-link</code> list (A → Z) linking to <code>/instructors/{slug}</code>.', vi: 'MỘT route <code>/instructors/:name?</code>. Không có tên: danh sách <code>.instructor-link</code> (A → Z) trỏ tới <code>/instructors/{slug}</code>.' },
        { en: 'With a name: <code>#instructor-name</code> + <code>#instructor-courses li</code>; unknown ⇒ <code>#instructor-not-found</code>.', vi: 'Có tên: <code>#instructor-name</code> + <code>#instructor-courses li</code>; lạ ⇒ <code>#instructor-not-found</code>.' },
      ],
    },
    {
      ten: { en: 'Protected route', vi: 'Route bảo vệ' }, diem: 1.5,
      yeuCau: [
        { en: '<code>/my-courses</code> is wrapped in <code>RequireAuth</code>: logged out ⇒ <code>&lt;Navigate to="/login" replace state={{ from: location }} /&gt;</code>; the login page shows <code>#login-reason</code>.', vi: '<code>/my-courses</code> được bọc bởi <code>RequireAuth</code>: chưa đăng nhập ⇒ <code>&lt;Navigate to="/login" replace state={{ from: location }} /&gt;</code>; trang đăng nhập hiện <code>#login-reason</code>.' },
        { en: '<code>#login-form</code> + <code>#username</code>: after login go back to <code>from</code> (or <code>/my-courses</code>), <code>#welcome</code> <code>Welcome, {user}!</code>. Logout goes home.', vi: '<code>#login-form</code> + <code>#username</code>: đăng nhập xong quay lại <code>from</code> (hoặc <code>/my-courses</code>), <code>#welcome</code> <code>Welcome, {user}!</code>. Đăng xuất về trang chủ.' },
      ],
      hook: ['Navigate', 'useLocation', 'location.state'],
    },
    {
      ten: { en: 'Decoupled route table', vi: 'Tách khai báo route' }, diem: 1,
      yeuCau: [{ en: 'All routes in <code>src/routes.js</code> as an array (<code>children</code> + <code>index: true</code> for the nested ones); <code>App</code> renders <code>useRoutes(routes)</code>.', vi: 'Mọi route nằm trong <code>src/routes.js</code> dạng mảng (<code>children</code> + <code>index: true</code> cho route lồng); <code>App</code> dùng <code>useRoutes(routes)</code>.' }],
      hook: ['useRoutes'],
    },
  ],
  idBatBuoc: [
    ['#nav-home · #nav-courses · #nav-instructors · #nav-my · #nav-login · #btn-logout', { en: 'navbar', vi: 'navbar' }],
    ['#home-title · #page-404', { en: 'home / 404', vi: 'trang chủ / 404' }],
    ['#level · #sort · #course-count · .course-item · .course-link', { en: 'course list', vi: 'danh sách khoá' }],
    ['#course-title · #course-meta · #lesson-list · .lesson-link · #course-overview · #btn-start · #not-found', { en: 'course layout', vi: 'khung khoá học' }],
    ['#lesson-title · #prev-lesson · #next-lesson · #lesson-not-found', { en: 'lesson page', vi: 'trang bài học' }],
    ['.instructor-link · #instructor-name · #instructor-courses · #instructor-not-found', { en: 'instructors', vi: 'giảng viên' }],
    ['#login-form · #username · #login-reason · #welcome', { en: 'auth', vi: 'đăng nhập' }],
  ],
  truDiem: [
    { en: 'Internal links with <code>&lt;a href&gt;</code> — the app reloads and loses the logged-in user.', vi: 'Link nội bộ bằng <code>&lt;a href&gt;</code> — app tải lại và mất người dùng đã đăng nhập.' },
    { en: 'Two separate routes <code>/instructors</code> and <code>/instructors/:name</code> instead of one optional parameter.', vi: 'Hai route riêng <code>/instructors</code> và <code>/instructors/:name</code> thay vì một tham số tuỳ chọn.' },
    { en: 'Filters kept in <code>useState</code> — the URL never changes and links cannot be shared.', vi: 'Bộ lọc để trong <code>useState</code> — URL không đổi, không chia sẻ link được.' },
    { en: 'Forgetting <code>&lt;Outlet /&gt;</code> — child routes never appear.', vi: 'Quên <code>&lt;Outlet /&gt;</code> — route con không bao giờ hiện.' },
    { en: 'After login always going to <code>/</code> instead of the page the user wanted.', vi: 'Đăng nhập xong luôn về <code>/</code> thay vì trang người dùng muốn vào.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-9-lab-course-portal',
  ten: 'Lab 9 — Online Course Portal (React Router)',
  khoa: KHOA,
  baiHoc: 'fer202-9-1-router',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 9 — Online Course Portal (useRoutes · query params · nested routes · protected route)', vi: 'Lab 9 — Cổng khoá học (useRoutes · query params · route lồng · route bảo vệ)' },
      doKho: 'HARD',
      phut: 110,
      diem: 100,
      khaiNiem: ['useRoutes', 'NavLink', 'useSearchParams', 'useParams', 'nested routes', 'Outlet', 'index route', 'optional segment', 'useNavigate', 'protected route', 'location.state'],
      tienQuyet: ['components & props', 'useState', 'Context (cơ bản)'],
      the: ['fer202', 'lab', 'react-router'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'nested route / layout route', vi: 'route lồng / route khung dùng chung' },
        { en: 'index route', vi: 'route con mặc định (đúng URL của cha)' },
        { en: 'optional segment', vi: 'đoạn URL tuỳ chọn (:name?)' },
        { en: 'protected route', vi: 'route chỉ vào được khi đã đăng nhập' },
        { en: 'relative link', vi: 'link tương đối (nối sau URL của route cha)' },
        { en: 'slug', vi: 'chuỗi thân thiện URL (chữ thường, gạch nối)' },
        ...tn('routeParam', 'queryParam', 'redirect', 'rubric'),
      ],
      goiY: [
        'Viết routes.js trước: mảng { path, element, children? }; App: function Pages() { return useRoutes(routes); }.',
        'Query: const [params, setParams] = useSearchParams(); đổi một tham số bằng new URLSearchParams(params) rồi set/delete, cuối cùng setParams(next).',
        'Route lồng: { path: "/courses/:courseId", element: <CourseLayout/>, children: [{ index: true, element: <CourseOverview/> }, { path: "lessons/:lessonId", element: <LessonPage/> }] } và CourseLayout có <Outlet />.',
        'RequireAuth: if (!user) return <Navigate to="/login" replace state={{ from: location }} />; Login: navigate(location.state?.from?.pathname ?? "/my-courses", { replace: true }).',
      ],
      loiHayGap: [
        'Dùng <code>&lt;a href="/courses"&gt;</code> ⇒ tải lại toàn trang: mất state đăng nhập, mất điểm "không tải lại".',
        'NavLink "/" thiếu <code>end</code> ⇒ luôn sáng (vì mọi URL đều bắt đầu bằng "/").',
        'Link bài học viết tuyệt đối sai (<code>to="/lessons/2"</code>) thay vì tương đối <code>lessons/2</code> trong route lồng.',
        'So <code>lessonId === 2</code> (chuỗi so với số) ⇒ không bao giờ khớp.',
        'Đặt <code>useSearchParams</code> nhưng ghi đè cả object (<code>setParams({ sort })</code>) ⇒ mất <code>level</code>.',
        'Gọi <code>navigate()</code> ngay trong thân component (lúc render) thay vì dùng <code>&lt;Navigate /&gt;</code> hoặc trong handler/effect.',
      ],
      moTaNgan: 'Lab chương 9: cổng khoá học 8 chức năng — route tách module + useRoutes, query params, route lồng + Outlet, điều hướng bằng mã, tham số tuỳ chọn, route bảo vệ quay lại trang cũ.',
      giaiThich: '<p>Toàn bộ bảng route nằm trong <code>routes.js</code> (Exercise 20) nên App chỉ còn <code>useRoutes(routes)</code>. Bộ lọc/sắp xếp sống trên URL nhờ <code>useSearchParams</code> — mở link là thấy đúng kết quả. <code>CourseLayout</code> là route khung: phần chung (tiêu đề, danh sách bài) vẽ một lần, <code>&lt;Outlet /&gt;</code> hiện route con (index = tổng quan, <code>lessons/:lessonId</code> = bài). <code>/instructors/:name?</code> phục vụ cả danh sách lẫn một người. <code>RequireAuth</code> chặn bằng <code>&lt;Navigate&gt;</code> và gửi kèm <code>state.from</code>; Login đọc nó để quay lại, dùng <code>replace</code> để nút Back không kẹt ở trang đăng nhập.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom'], url: '/', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: '/courses' },
      thamKhao: 'https://reactrouter.com/en/6.26.2/hooks/use-routes',
    },
  ],
});
