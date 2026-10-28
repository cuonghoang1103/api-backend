/**
 * FER202 · Assignment cuối kỳ "CodeLearn" (mini LMS) — phần DÙNG CHUNG của chương 15 (tệp "_" ⇒ bộ xuất bỏ qua).
 * ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
 * Mã nguồn tham chiếu viết MỘT lần dưới dạng tệp thật trong `_codelearn/` (public/ + src/), có ĐÁNH DẤU theo chức
 * năng — bộ tiền xử lý ở đây cắt ra phiên bản sau mỗi chức năng F0 (khung) … F11 (hoàn chỉnh):
 *   //@from F6        (dòng đầu tệp) tệp chỉ có từ F6
 *   //#F6 … //#end    khối chỉ có khi đã làm tới F6 (k ≥ 6)
 *   //#<F6 … //#end   khối chỉ có TRƯỚC F6 (k < 6) — bản giữ chỗ bị F6 thay
 * Dòng chỉ thị bị xoá khỏi đầu ra. Starter của Fk = lời giải F(k−1) + tệp khung (stub) của các tệp mới ở Fk.
 *
 * Toàn vẹn (chủ web dùng làm bài nộp thật, muốn "làm dần"): testsJson.loiGiaiSauKhiDat ⇒ máy chủ chỉ trả lời giải
 * sau khi người học Nộp đạt 100%; testsJson.khoiDauSauKhiDat = module trước ⇒ starter (= lời giải bước trước) chỉ mở
 * khi đã đạt bước trước (xem src/services/codeLab.practice.ts › chotLoiGiai).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = path.join(path.dirname(fileURLToPath(import.meta.url)), '_codelearn');
export const B = 'http://localhost:9999';
export const KHOA_CL = 'front-end-web-development-with-react';

// ═══════════════════════════════════════ db.json (seed) ═══════════════════════════════════════
const yt = (id) => `https://www.youtube.com/watch?v=${id}`;
export const DB = {
  users: [
    { id: 1, fullName: 'Admin CodeLearn', email: 'admin@codelearn.vn', password: 'admin123', role: 'admin', active: true, createdAt: '2026-01-01' },
    { id: 2, fullName: 'Nguyen Van An', email: 'an@codelearn.vn', password: '123456', role: 'student', active: true, createdAt: '2026-08-20' },
    { id: 3, fullName: 'Tran Thi Binh', email: 'binh@codelearn.vn', password: '123456', role: 'student', active: true, createdAt: '2026-08-25' },
    { id: 4, fullName: 'Le Van Cuong', email: 'cuong@codelearn.vn', password: '123456', role: 'student', active: false, createdAt: '2026-09-01' },
    { id: 5, fullName: 'Pham Minh Duc', email: 'duc@codelearn.vn', password: '123456', role: 'student', active: true, createdAt: '2026-09-28' },
  ],
  categories: [
    { id: 1, name: 'Frontend' },
    { id: 2, name: 'Backend' },
    { id: 3, name: 'Database' },
    { id: 4, name: 'Mobile' },
  ],
  courses: [
    { id: 1, title: 'React for Beginners', categoryId: 1, level: 'Beginner', price: 0, instructor: 'Hoang Cuong', thumbnail: '', published: true, createdAt: '2026-01-10', description: 'Build your first React apps: JSX, components, props, state and the most used hooks — step by step.' },
    { id: 2, title: 'Advanced React Patterns', categoryId: 1, level: 'Advanced', price: 499000, instructor: 'Hoang Cuong', thumbnail: '', published: true, createdAt: '2026-03-05', description: 'Compound components, render props, custom hooks and performance patterns used in large React codebases.' },
    { id: 3, title: 'JavaScript Essentials', categoryId: 1, level: 'Beginner', price: 199000, instructor: 'Tran Minh', thumbnail: '', published: true, createdAt: '2026-02-01', description: 'The JavaScript you need before React: variables, types, functions, arrays and objects.' },
    { id: 4, title: 'Node.js & Express REST APIs', categoryId: 2, level: 'Intermediate', price: 399000, instructor: 'Le Quang', thumbnail: '', published: true, createdAt: '2026-04-12', description: 'Design and build REST APIs with Express: routing, middleware, validation and JSON responses.' },
    { id: 5, title: 'Spring Boot Fundamentals', categoryId: 2, level: 'Intermediate', price: 449000, instructor: 'Nguyen Hai', thumbnail: '', published: true, createdAt: '2026-05-20', description: 'Create production-ready Java back ends with Spring Boot, Spring Web and Spring Data JPA.' },
    { id: 6, title: 'SQL Server for Developers', categoryId: 3, level: 'Beginner', price: 0, instructor: 'Pham Thu', thumbnail: '', published: true, createdAt: '2026-06-01', description: 'Write correct SELECT queries, filter, sort and join tables in Microsoft SQL Server.' },
    { id: 7, title: 'PostgreSQL Performance Tuning', categoryId: 3, level: 'Advanced', price: 549000, instructor: 'Pham Thu', thumbnail: '', published: true, createdAt: '2026-07-15', description: 'Read query plans, design indexes and tune PostgreSQL for real workloads.' },
    { id: 8, title: 'Flutter Mobile Apps', categoryId: 4, level: 'Intermediate', price: 349000, instructor: 'Vo Thanh', thumbnail: '', published: true, createdAt: '2026-08-08', description: 'Build cross-platform mobile apps with Flutter widgets, navigation and state management.' },
    { id: 9, title: 'TypeScript in Practice', categoryId: 1, level: 'Intermediate', price: 299000, instructor: 'Tran Minh', thumbnail: '', published: true, createdAt: '2026-09-01', description: 'Add types to real projects: interfaces, generics, narrowing and typing React components.' },
    { id: 10, title: 'MongoDB Basics', categoryId: 3, level: 'Beginner', price: 149000, instructor: 'Le Quang', thumbnail: '', published: false, createdAt: '2026-10-01', description: 'Documents, collections and queries in MongoDB — draft course, not published yet.' },
  ],
  chapters: [
    { id: 1, courseId: 1, title: 'Getting Started with React', order: 1 },
    { id: 2, courseId: 1, title: 'Components, Props & State', order: 2 },
    { id: 3, courseId: 1, title: 'Hooks in Practice', order: 3 },
    { id: 4, courseId: 3, title: 'Variables & Types', order: 1 },
    { id: 5, courseId: 3, title: 'Functions & Arrays', order: 2 },
    { id: 6, courseId: 4, title: 'Express Basics', order: 1 },
    { id: 7, courseId: 4, title: 'REST & JSON', order: 2 },
    { id: 8, courseId: 6, title: 'SELECT Fundamentals', order: 1 },
  ],
  lessons: [
    { id: 1, chapterId: 1, courseId: 1, order: 1, title: 'What is React?', duration: 8, videoUrl: yt('SqcY0GlETPk'), content: 'React is a JavaScript library for building user interfaces from small, reusable components.\nIn this lesson you see how a React app is just a tree of components that turn data into UI.' },
    { id: 2, chapterId: 1, courseId: 1, order: 2, title: 'Create React App & project structure', duration: 12, videoUrl: yt('bMknfKXIFA8'), content: 'Create the project with npx create-react-app, then walk through public/index.html, src/index.js and src/App.js.\nRun it with npm start on http://localhost:3000.' },
    { id: 3, chapterId: 2, courseId: 1, order: 1, title: 'JSX and components', duration: 15, videoUrl: yt('w7ejDZ8SWv8'), content: 'JSX looks like HTML but compiles to React.createElement calls.\nA component is a function that returns JSX; its name must start with a capital letter.' },
    { id: 4, chapterId: 2, courseId: 1, order: 2, title: 'Props vs State', duration: 14, videoUrl: yt('IYvD9oBCuJI'), content: 'Props are read-only data passed from a parent; state is data a component owns and changes with its setter.\nChanging state re-renders the component.' },
    { id: 5, chapterId: 3, courseId: 1, order: 1, title: 'useState and useEffect', duration: 13, videoUrl: yt('O6P86uwfdR0'), content: 'useState stores a value between renders; useEffect runs side effects such as fetching data after the component renders.\nAlways list the values the effect uses in its dependency array.' },
    { id: 6, chapterId: 4, courseId: 3, order: 1, title: 'let, const and var', duration: 10, videoUrl: yt('hdI2bqOjy3c'), content: 'Prefer const, use let when a variable must be reassigned, and avoid var (function scope, hoisting surprises).' },
    { id: 7, chapterId: 4, courseId: 3, order: 2, title: 'Primitive types', duration: 11, videoUrl: yt('PkZNo7MFNFg'), content: 'string, number, boolean, null, undefined, bigint and symbol — and why typeof null is "object".' },
    { id: 8, chapterId: 5, courseId: 3, order: 1, title: 'Arrow functions and array methods', duration: 16, videoUrl: yt('R8rmfD9Y5-c'), content: 'Write short callbacks with arrow functions and transform data with map, filter and reduce without mutating the original array.' },
    { id: 9, chapterId: 6, courseId: 4, order: 1, title: 'Your first Express server', duration: 14, videoUrl: yt('fBNz5xF-Kx4'), content: 'Install express, create an app and call app.listen(3000). Add a GET route that returns JSON.' },
    { id: 10, chapterId: 6, courseId: 4, order: 2, title: 'Routing & middleware', duration: 18, videoUrl: yt('L72fhGm1tfE'), content: 'Split routes with express.Router and write middleware with (req, res, next) for logging and validation.' },
    { id: 11, chapterId: 7, courseId: 4, order: 1, title: 'Building a REST API', duration: 20, videoUrl: yt('pKd0Rpw7O48'), content: 'Map CRUD to HTTP: GET /items, POST /items, PUT /items/:id, DELETE /items/:id — with the right status codes.' },
    { id: 12, chapterId: 8, courseId: 6, order: 1, title: 'SELECT, WHERE, ORDER BY', duration: 15, videoUrl: yt('HXV3zeQKqGY'), content: 'Choose columns with SELECT, filter rows with WHERE and sort the result with ORDER BY.' },
    { id: 13, chapterId: 8, courseId: 6, order: 2, title: 'JOIN in practice', duration: 17, videoUrl: yt('9yeOJ0ZMUYw'), content: 'Combine rows of related tables with INNER JOIN and LEFT JOIN on their keys.' },
  ],
  questions: [
    { id: 1, chapterId: 1, courseId: 1, content: 'What does JSX compile to?', options: ['Plain HTML strings', 'React.createElement() calls', 'Web Components', 'CSS-in-JS objects'], answerIndex: 1, explanation: 'The build tool turns every JSX tag into a React.createElement (or jsx()) call that returns a plain object describing the UI.' },
    { id: 2, chapterId: 1, courseId: 1, content: 'Which command creates a new React app with Create React App?', options: ['npm create-react-app my-app', 'npx create-react-app my-app', 'npm init react my-app', 'npx react-new my-app'], answerIndex: 1, explanation: 'npx downloads and runs create-react-app once, without installing it globally.' },
    { id: 3, chapterId: 1, courseId: 1, content: 'Which file renders <App /> into #root in a CRA project?', options: ['src/index.js', 'public/manifest.json', 'src/App.css', 'package.json'], answerIndex: 0, explanation: 'src/index.js calls ReactDOM.createRoot(document.getElementById("root")).render(<App />).' },
    { id: 4, chapterId: 2, courseId: 1, content: 'Props are…', options: ['mutable data owned by the child', 'read-only data passed from parent to child', 'global variables', 'the same thing as state'], answerIndex: 1, explanation: 'A component must never change its props; the parent owns that data.' },
    { id: 5, chapterId: 2, courseId: 1, content: 'Why must you never mutate state directly (state.items.push(x))?', options: ['It is slower', 'React compares references, so the same array means no re-render', 'It throws an error', 'It deletes the state'], answerIndex: 1, explanation: 'Create a new array/object (spread, map, filter) so React sees a new reference and re-renders.' },
    { id: 6, chapterId: 2, courseId: 1, content: 'Where should state shared by two sibling components live?', options: ['In each sibling separately', 'In their closest common parent (lift state up)', 'In localStorage', 'In a CSS file'], answerIndex: 1, explanation: 'Lifting state up gives one source of truth; the siblings receive it via props.' },
    { id: 7, chapterId: 3, courseId: 1, content: 'When does useEffect(fn, []) run?', options: ['Before every render', 'After the first render only', 'On every state change', 'Never'], answerIndex: 1, explanation: 'An empty dependency array means "after mount" (twice in development StrictMode).' },
    { id: 8, chapterId: 3, courseId: 1, content: 'What is wrong with calling a hook inside an if statement?', options: ['Nothing', 'Hooks must be called in the same order on every render', 'Hooks only work in class components', 'It makes the app slower'], answerIndex: 1, explanation: 'React matches hook state by call order, so hooks must sit at the top level of the component.' },
    { id: 9, chapterId: 4, courseId: 3, content: 'Which keyword declares a variable that cannot be reassigned?', options: ['var', 'let', 'const', 'static'], answerIndex: 2, explanation: 'const prevents reassignment (the object it points to can still change).' },
    { id: 10, chapterId: 4, courseId: 3, content: 'What is typeof null in JavaScript?', options: ['"null"', '"object"', '"undefined"', '"number"'], answerIndex: 1, explanation: 'A historic bug kept for compatibility: typeof null === "object".' },
    { id: 11, chapterId: 4, courseId: 3, content: 'Which value is NOT falsy?', options: ['0', '"" (empty string)', '"0"', 'NaN'], answerIndex: 2, explanation: 'Any non-empty string, including "0", is truthy.' },
    { id: 12, chapterId: 6, courseId: 4, content: 'Which method starts an Express server on a port?', options: ['app.run(3000)', 'app.listen(3000)', 'app.start(3000)', 'express.serve(3000)'], answerIndex: 1, explanation: 'app.listen(port, callback) opens the HTTP server.' },
    { id: 13, chapterId: 6, courseId: 4, content: 'What does an Express middleware function receive?', options: ['(req, res, next)', '(state, action)', '(props)', '(event)'], answerIndex: 0, explanation: 'Middleware gets the request, the response and next() to pass control on.' },
  ],
  enrollments: [
    { id: 1, userId: 2, courseId: 1, enrolledAt: '2026-09-01', completedLessons: [1, 2, 3] },
    { id: 2, userId: 2, courseId: 3, enrolledAt: '2026-09-10', completedLessons: [] },
    { id: 3, userId: 3, courseId: 1, enrolledAt: '2026-09-12', completedLessons: [1] },
    { id: 4, userId: 3, courseId: 4, enrolledAt: '2026-09-15', completedLessons: [9, 10, 11] },
    { id: 5, userId: 5, courseId: 1, enrolledAt: '2026-10-01', completedLessons: [] },
    { id: 6, userId: 5, courseId: 6, enrolledAt: '2026-10-03', completedLessons: [12] },
  ],
  results: [
    { id: 1, userId: 2, courseId: 1, chapterId: 1, score: 2, total: 3, percent: 67, passed: false, answers: [1, 0, 0], submittedAt: '2026-09-05T09:00:00.000Z' },
    { id: 2, userId: 2, courseId: 1, chapterId: 1, score: 3, total: 3, percent: 100, passed: true, answers: [1, 1, 0], submittedAt: '2026-09-06T10:30:00.000Z' },
    { id: 3, userId: 3, courseId: 4, chapterId: 6, score: 2, total: 2, percent: 100, passed: true, answers: [1, 0], submittedAt: '2026-09-20T14:00:00.000Z' },
    { id: 4, userId: 2, courseId: 3, chapterId: 4, score: 1, total: 3, percent: 33, passed: false, answers: [2, 0, 0], submittedAt: '2026-09-12T08:15:00.000Z' },
  ],
};
export const DB_JSON = `${JSON.stringify(DB, null, 2)}\n`;
/** db với vài bảng thay/bớt — cho kiểm cần dữ liệu khác (vd bảng rỗng, máy chủ lỗi). */
export const dbKhac = (doi) => ({ ...JSON.parse(JSON.stringify(DB)), ...doi });

// ═══════════════════════════════════════ tệp cấu hình (F0) ═══════════════════════════════════════
export const PACKAGE_JSON = `${JSON.stringify({
  name: 'codelearn',
  version: '0.1.0',
  private: true,
  dependencies: {
    '@reduxjs/toolkit': '^2.2.7',
    axios: '^1.7.7',
    bootstrap: '^5.3.3',
    react: '^18.3.1',
    'react-bootstrap': '^2.10.5',
    'react-dom': '^18.3.1',
    'react-redux': '^9.1.2',
    'react-router-dom': '^6.26.2',
    'react-scripts': '5.0.1',
  },
  devDependencies: {
    concurrently: '^9.0.1',
    'json-server': '0.17.4',
  },
  scripts: {
    start: 'react-scripts start',
    build: 'react-scripts build',
    server: 'json-server --watch db.json --port 9999',
    dev: 'concurrently -n api,web -c blue,green "npm run server" "npm start"',
  },
  eslintConfig: { extends: ['react-app'] },
  browserslist: { production: ['>0.2%', 'not dead', 'not op_mini all'], development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'] },
}, null, 2)}\n`;
export const ENV = 'REACT_APP_API_URL=http://localhost:9999\n';

export const README = `# CodeLearn — mini LMS (FER202 final assignment)

ReactJS (Create React App) · React Router 6 · Redux Toolkit · Axios · React-Bootstrap · json-server 0.17.4

## Run

\`\`\`bash
npm install              # React 18 is pinned: CRA now installs React 19 by default (peer conflicts)
npm run dev              # json-server :9999 + React :3000 together (concurrently)
\`\`\`

Or in two terminals: \`npm run server\` and \`npm start\`. Restart \`npm start\` after editing \`.env\`.

## Demo accounts (db.json)

| Role    | Email               | Password |
|---------|---------------------|----------|
| admin   | admin@codelearn.vn  | admin123 |
| student | an@codelearn.vn     | 123456   |
| locked  | cuong@codelearn.vn  | 123456   |

json-server is not a real auth server: passwords are plain text in db.json — for learning only.
`;

// ═══════════════════════════════════════ bộ tiền xử lý ═══════════════════════════════════════
function docCay(thuMuc, goc = thuMuc) {
  const out = [];
  for (const ten of fs.readdirSync(thuMuc).sort()) {
    const p = path.join(thuMuc, ten);
    if (fs.statSync(p).isDirectory()) out.push(...docCay(p, goc));
    else out.push(path.relative(goc, p).split(path.sep).join('/'));
  }
  return out;
}
const TEP = docCay(GOC).map((ten) => {
  const src = fs.readFileSync(path.join(GOC, ten), 'utf8');
  const m = /^\/\/@from F(\d+)\s*$/m.exec(src.split('\n')[0]);
  return { ten, src, tu: m ? Number(m[1]) : 0 };
});

/** Cắt một tệp ở mức k (0..11). */
function cat(src, k, ten) {
  const ra = [];
  const ngan = []; // ngăn xếp: true = đang giữ
  for (const dong of src.split('\n')) {
    const t = dong.trim();
    let m;
    if (/^\/\/@from F\d+$/.test(t)) continue;
    if ((m = /^\/\/#(<)?F(\d+)$/.exec(t))) { ngan.push(m[1] ? k < Number(m[2]) : k >= Number(m[2])); continue; }
    if (t === '//#end') { if (!ngan.length) throw new Error(`${ten}: //#end thừa`); ngan.pop(); continue; }
    if (t.startsWith('//#') || t.startsWith('//@')) throw new Error(`${ten}: chỉ thị lạ "${t}"`);
    if (ngan.every(Boolean)) ra.push(dong);
  }
  if (ngan.length) throw new Error(`${ten}: thiếu //#end`);
  return `${ra.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\s+$/, '')}\n`;
}

const CHUNG = { 'package.json': PACKAGE_JSON, '.env': ENV, 'db.json': DB_JSON, 'README.md': README };

/** Lời giải sau chức năng k (k = 0: khung starter của cả dự án). */
export function phienBan(k) {
  const out = { ...CHUNG };
  for (const t of TEP) if (k >= t.tu) out[t.ten] = cat(t.src, k, t.ten);
  return out;
}

/** Gợi ý trong tệp khung (stub) — tệp mới của chức năng k. */
const GOI_Y_STUB = {
  'src/api/authApi.js': 'findByEmail(email), create(user) — each returns response.data',
  'src/features/auth/authSlice.js': "login / register (createAsyncThunk), logout; initialState.user read from localStorage 'codelearn_user'; export STORAGE_KEY, selectUser",
  'src/components/ProtectedRoute.js': 'guest ⇒ <Navigate to="/login" state={{ from: location }} replace />; wrong role ⇒ #forbidden (403); else children ?? <Outlet />',
  'src/utils/validators.js': 'validateLogin(form), validateRegister(form) ⇒ { field: message } (empty object = valid)',
  'src/utils/format.js': 'todayISO() ⇒ "yyyy-mm-dd" in local time',
  'src/api/courseApi.js': 'getCategories(), getPublishedCourses() (GET /courses?published=true)',
  'src/features/courses/coursesSlice.js': 'fetchCatalog thunk (courses + categories, Promise.all); state { items, categories, status, error }',
  'src/utils/courseQuery.js': 'readFilters(searchParams), applyCourseQuery(courses, filters), paginate(list, page, size = 6)',
  'src/components/CourseCard.js': 'one .course-card (props: course, categoryName)',
  'src/components/CourseFilters.js': '#search, #filter-category, #filter-level, #filter-price, #sort, #clear-filters',
  'src/api/enrollApi.js': 'getByUser(userId) with _expand=course, find(userId, courseId), create(enrollment)',
  'src/features/enrollments/enrollmentsSlice.js': 'fetchMyEnrollments, enrollCourse (no duplicates, ignore a second click); reset on logout',
  'src/utils/learning.js': 'toEmbedUrl(url), calcProgress(done, total), resumeLesson(lessons, completedLessons)',
  'src/api/quizApi.js': 'getChapter(id), getQuestions(chapterId), saveResult(result)',
  'src/features/quiz/quizSlice.js': 'fetchQuiz, answerSelected, submitQuiz (score + POST /results), retakeQuiz',
  'src/utils/stats.js': 'computeStats({ users, courses, enrollments, results, categories })',
  'src/components/BarChart.js': 'SVG bar chart: one rect.bar per item, height proportional to value',
};

/** Starter của chức năng k (1..11) = lời giải k−1 + tệp khung của tệp MỚI ở k. */
export function khoiDau(k) {
  if (k <= 0) return phienBan(0);
  const out = phienBan(k - 1);
  for (const t of TEP.filter((x) => x.tu === k)) {
    const ten = t.ten.split('/').pop().replace(/\.js$/, '');
    if (t.ten.startsWith('src/pages/')) {
      out[t.ten] = `// ${t.ten} — STARTER (F${k}): build this page — see the brief.\n// Route + ids/classes: section "Element ids / classes" of the brief.\n\nexport default function ${ten}() {\n  return <h2>${ten} — not implemented yet</h2>;\n}\n`;
    } else {
      out[t.ten] = `// ${t.ten} — STARTER (F${k})\n// ${GOI_Y_STUB[t.ten] ?? 'see the brief'}\n\nexport {};\n`;
    }
  }
  return out;
}

/** Danh sách tệp MỚI / ĐỔI của chức năng k (để vẽ cây thư mục trong đề). */
export function tepDoi(k) {
  const truoc = phienBan(k - 1);
  const sau = phienBan(k);
  return Object.keys(sau).filter((t) => truoc[t] !== sau[t]).map((t) => [t, truoc[t] == null ? 'NEW' : 'EDIT']);
}

/** Sắp tệp: tệp MỚI của bước k trước, rồi tệp SỬA, rồi phần còn lại (editor mở tệp đầu tiên). */
export function uuTien(map, k) {
  const doi = k >= 1 ? tepDoi(k) : [['src/App.js', 'EDIT']];
  const dau = [...doi.filter(([, l]) => l === 'NEW'), ...doi.filter(([, l]) => l === 'EDIT')].map(([t]) => t).filter((t) => t in map);
  return Object.fromEntries([...dau, ...Object.keys(map).filter((t) => !dau.includes(t))].map((t) => [t, map[t]]));
}

/** Cây thư mục chữ từ danh sách đường dẫn (ghi chú tuỳ chọn). */
export function veCay(ds, ghiChu = {}) {
  const goc = {};
  for (const p of ds) {
    let n = goc;
    for (const phan of p.split('/')) n = n[phan] ??= {};
  }
  const dong = ['codelearn/'];
  const ve = (n, tien, duong) => {
    const ten = Object.keys(n).sort((a, b) => (Object.keys(n[a]).length ? 0 : 1) - (Object.keys(n[b]).length ? 0 : 1) || a.localeCompare(b));
    ten.forEach((t, i) => {
      const cuoi = i === ten.length - 1;
      const day = duong ? `${duong}/${t}` : t;
      const la = !Object.keys(n[t]).length;
      dong.push(`${tien}${cuoi ? '└── ' : '├── '}${t}${la ? '' : '/'}${ghiChu[day] ? `   # ${ghiChu[day]}` : ''}`);
      if (!la) ve(n[t], `${tien}${cuoi ? '    ' : '│   '}`, day);
    });
  };
  ve(goc, '', '');
  return dong.join('\n');
}

// ═══════════════════════════════════════ trợ giúp bộ kiểm ═══════════════════════════════════════
export const TV = ['react-router-dom', 'react-bootstrap', 'bootstrap', 'axios', '@reduxjs/toolkit', 'react-redux'];
const an = ({ password, ...u }) => u; // eslint-disable-line no-unused-vars
export const USER = Object.fromEntries(DB.users.map((u) => [u.id, an(u)]));
/** localStorage giả đã đăng nhập sẵn người dùng id. */
export const dn = (id) => ({ codelearn_user: JSON.stringify(USER[id]) });
export const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
export const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
export const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
export const gui = (selector) => ({ hanhDong: 'gui', selector });
export const cho = (ms = 400) => ({ hanhDong: 'cho', ms });
export const taiLai = { hanhDong: 'tai-lai' };
export const DANG_NHAP = (email, mk) => [cho(200), nhap('#email', email), nhap('#password', mk), gui('#login-form'), cho(500)];

/** tests React chung: thư viện + json-server giả với seed. */
export const tests = (kiem, extra = {}) => ({ loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: TV, url: '/', jsonServer: { base: B, db: DB }, kiem, ...extra });

// ═══════════════════════════════════════ đề: phần dùng chung ═══════════════════════════════════════
export const MO_HINH = {
  ten: 'db.json — 8 collections (json-server 0.17.4, port 9999)',
  truong: [
    ['users', '{ id, fullName, email, password, role: "admin" | "student", active: boolean, createdAt }', { en: 'email stored lower-case and unique · <code>active:false</code> = locked (cannot log in)', vi: 'email lưu chữ thường, không trùng · <code>active:false</code> = bị khoá (không đăng nhập được)' }],
    ['categories', '{ id, name }', { en: 'Frontend · Backend · Database · Mobile', vi: 'Frontend · Backend · Database · Mobile' }],
    ['courses', '{ id, title, categoryId → categories, level, price, instructor, description, thumbnail, published, createdAt }', { en: 'level ∈ Beginner/Intermediate/Advanced · price in VND (0 = Free) · <code>published:false</code> = draft (admin only)', vi: 'level ∈ Beginner/Intermediate/Advanced · price tính bằng VND (0 = Free) · <code>published:false</code> = bản nháp (chỉ admin thấy)' }],
    ['chapters', '{ id, courseId → courses, title, order }', { en: 'shown sorted by <code>order</code> as "Chapter 1, 2…"', vi: 'hiện theo <code>order</code>, đánh số "Chapter 1, 2…"' }],
    ['lessons', '{ id, chapterId → chapters, courseId → courses, title, order, duration (min), videoUrl, content }', { en: '<code>videoUrl</code> is a YouTube <b>watch</b> link — convert to <code>/embed/&lt;id&gt;</code> for the iframe', vi: '<code>videoUrl</code> là link YouTube dạng <b>watch</b> — phải đổi sang <code>/embed/&lt;id&gt;</code> để nhúng iframe' }],
    ['questions', '{ id, chapterId → chapters, courseId → courses, content, options: string[4], answerIndex: 0..3, explanation }', { en: 'one chapter quiz = all questions of that chapter', vi: 'quiz một chương = mọi câu hỏi của chương đó' }],
    ['enrollments', '{ id, userId → users, courseId → courses, enrolledAt, completedLessons: number[] }', { en: 'progress lives here (ids of completed lessons, sorted, no duplicates)', vi: 'tiến độ nằm ở đây (id các bài đã xong, tăng dần, không trùng)' }],
    ['results', '{ id, userId, courseId, chapterId → chapters, score, total, percent, passed, answers: number[], submittedAt }', { en: 'one row per quiz attempt · pass mark 70%', vi: 'mỗi lượt làm quiz một dòng · đạt khi ≥ 70%' }],
  ],
};

export const NOP = {
  en: 'Work in the editor (files on the right) or download the starter, then <code>npm install</code> and <code>npm run dev</code> (json-server :9999 + React :3000) and paste your files back. Press <b>Run</b> for the sample checks and <b>Submit</b> for full grading (hidden checks included). The reference solution of this step unlocks after an <b>Accepted</b> submission.',
  vi: 'Làm thẳng trong editor (tệp bên phải) hoặc tải starter về, <code>npm install</code> rồi <code>npm run dev</code> (json-server :9999 + React :3000), xong dán lại tệp. <b>Chạy thử</b> = kiểm mẫu, <b>Nộp</b> = chấm đủ (cả kiểm ẩn). Lời giải tham chiếu của bước này chỉ mở sau một lượt Nộp <b>Accepted</b>.',
};

export const YEU_CAU_CHUNG = [
  { en: 'Create React App (React 18), React Router v6, Redux Toolkit, Axios, React-Bootstrap; json-server <b>0.17.4</b> on port 9999 (1.x dropped <code>_expand</code>/<code>_embed</code>).', vi: 'Create React App (React 18), React Router v6, Redux Toolkit, Axios, React-Bootstrap; json-server <b>0.17.4</b> cổng 9999 (bản 1.x bỏ <code>_expand</code>/<code>_embed</code>).' },
  { en: 'Every HTTP call goes through <code>src/api/*.js</code> (one <code>axiosClient</code> with <code>baseURL: process.env.REACT_APP_API_URL</code>); each API function returns <code>response.data</code> itself — do not rely on interceptors (the auto-grader’s axios does not run them).', vi: 'Mọi lời gọi HTTP đi qua <code>src/api/*.js</code> (một <code>axiosClient</code> với <code>baseURL: process.env.REACT_APP_API_URL</code>); mỗi hàm API tự trả <code>response.data</code> — đừng dựa vào interceptor (axios của máy chấm không chạy interceptor).' },
  { en: 'Keep the ids/classes printed in the brief — the auto-grader uses them. Components never call axios directly.', vi: 'Giữ đúng id/class in trong đề — máy chấm dùng chúng. Component không gọi axios trực tiếp.' },
];

export const TRU_DIEM_CHUNG = [
  { en: 'Hard-coded <code>http://localhost:9999</code> in components instead of the <code>.env</code> variable.', vi: 'Viết cứng <code>http://localhost:9999</code> trong component thay vì biến <code>.env</code>.' },
  { en: 'Mutating Redux/React state, or writing localStorage inside a reducer.', vi: 'Sửa trực tiếp state Redux/React, hoặc ghi localStorage trong reducer.' },
  { en: 'App crashes (white screen) on an empty list, an unknown id or a server error.', vi: 'App sập (màn trắng) khi danh sách rỗng, id không tồn tại hoặc máy chủ lỗi.' },
];

export const tnChung = [
  { en: 'slice', vi: 'một "lát" state Redux kèm reducer + action của một tính năng (createSlice)' },
  { en: 'thunk (createAsyncThunk)', vi: 'action bất đồng bộ: gọi API rồi tự dispatch pending / fulfilled / rejected' },
  { en: 'protected route', vi: 'route có bảo vệ: chưa đăng nhập / sai vai trò thì không vào được' },
  { en: 'enrollment', vi: 'lượt đăng ký học một khoá' },
];

// ═══════════════════════════════════════ bản in một chức năng Fk ═══════════════════════════════════════
export const TEN_F = [
  null,
  { en: 'Setup, layout, routing & 404', vi: 'Cài đặt, layout, routing & 404' },
  { en: 'Login, register & protected routes', vi: 'Đăng nhập, đăng ký & route có bảo vệ' },
  { en: 'Course list: filter, search, sort, paginate', vi: 'Danh sách khoá học: lọc, tìm, sắp, phân trang' },
  { en: 'Course detail & curriculum', vi: 'Chi tiết khoá học & chương trình học' },
  { en: 'Enroll & My Courses', vi: 'Đăng ký học & Khoá học của tôi' },
  { en: 'Learn page, mark complete & progress', vi: 'Trang học, đánh dấu hoàn thành & tiến độ' },
  { en: 'Chapter quiz', vi: 'Quiz cuối chương' },
  { en: 'My Progress dashboard', vi: 'Bảng tiến độ của tôi' },
  { en: 'Admin: courses, chapters & lessons', vi: 'Admin: khoá học, chương & bài học' },
  { en: 'Admin: quiz questions & users', vi: 'Admin: câu hỏi quiz & người dùng' },
  { en: 'Admin statistics', vi: 'Admin: thống kê' },
];
export const SLUG_F = [
  'fer202-15-0-codelearn-brief',
  'fer202-15-1-setup-routing',
  'fer202-15-2-auth-roles',
  'fer202-15-3-course-list',
  'fer202-15-4-course-detail',
  'fer202-15-5-enroll-my-courses',
  'fer202-15-6-learn-progress',
  'fer202-15-7-chapter-quiz',
  'fer202-15-8-progress-dashboard',
  'fer202-15-9-admin-courses',
  'fer202-15-10-admin-questions-users',
  'fer202-15-11-admin-stats',
];

/** Bảng HTML nhỏ (đề là HTML — dùng cho "API calls", "Routes"…). hang = [[ô, ô…]] (ô là HTML). */
export const bang = (cot, hang) => `<table><thead><tr>${cot.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${hang.map((h) => `<tr>${h.map((o) => `<td>${o}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

/**
 * Bản in của chức năng k. o = { k, phut, moTa:{en,vi} (HTML: mục tiêu, route, API, edge case), chucNang[] (tổng 10),
 * idBatBuoc[], truDiem[], wireframe?, bangDuLieu?: ['users', …] (trích seed liên quan) }
 */
export function banInF(o) {
  const doi = Object.fromEntries(tepDoi(o.k).map(([t, loai]) => [t, loai === 'NEW' ? `NEW in F${o.k}` : `EDIT in F${o.k}`]));
  const cay = veCay(Object.keys(phienBan(o.k)).filter((t) => !t.startsWith('public/') || t === 'public/index.html'), doi);
  const trich = (o.bangDuLieu ?? []).map((b) => `"${b}": ${JSON.stringify(DB[b].slice(0, o.soDong ?? 3), null, 2).replace(/\n/g, '\n  ')}${DB[b].length > (o.soDong ?? 3) ? ` /* … ${DB[b].length} rows in db.json */` : ''}`).join(',\n');
  return {
    tieuDe: { en: `CODELEARN · F${o.k} — ${TEN_F[o.k].en.toUpperCase()}`, vi: `CODELEARN · F${o.k} — ${TEN_F[o.k].vi.toUpperCase()}` },
    phu: {
      en: `FER202 final assignment (mini LMS) · Function ${o.k} of 11 · Starter = reference of F${o.k - 1}${o.k === 1 ? ' (project skeleton)' : ''} · Suggested time: ${o.phut} minutes · Total: 10 marks`,
      vi: `Assignment cuối kỳ FER202 (mini LMS) · Chức năng ${o.k}/11 · Starter = lời giải F${o.k - 1}${o.k === 1 ? ' (khung dự án)' : ''} · Thời gian gợi ý: ${o.phut} phút · Tổng: 10 điểm`,
    },
    moTa: o.moTa,
    chucNangChinh: [{ en: o.chucNang.map((c) => c.ten.en).join(' · '), vi: o.chucNang.map((c) => c.ten.vi).join(' · ') }],
    yeuCauChung: [
      { en: `Continue from your own F${o.k - 1} code (or the starter, which is the F${o.k - 1} reference). Files marked NEW/EDIT in the tree are the ones this step touches.`, vi: `Làm tiếp trên code F${o.k - 1} của chính bạn (hoặc starter = lời giải F${o.k - 1}). Tệp đánh dấu NEW/EDIT trong cây là tệp bước này đụng tới.` },
      ...YEU_CAU_CHUNG,
      ...(o.yeuCauThem ?? []),
    ],
    cayThuMuc: cay,
    ...(o.wireframe ? { wireframe: o.wireframe } : {}),
    moHinh: o.moHinh ?? MO_HINH,
    ...(trich ? { duLieuMau: `{\n${trich}\n}` } : {}),
    chucNang: o.chucNang,
    idBatBuoc: o.idBatBuoc,
    truDiem: [...o.truDiem, ...TRU_DIEM_CHUNG],
    nopBai: NOP,
  };
}

/**
 * Một module chức năng Fk: de[0] = đề lớn (project). o = { k, phut, banIn, kiem, goiY[], loiHayGap[], giaiThich{en,vi},
 * khaiNiem[], thuatNgu[], viDu?, baiHoc, url?, demo? }
 */
export function moduleF(o) {
  const tj = tests(o.kiem, {
    url: o.url ?? '/',
    // Toàn vẹn: lời giải chỉ mở sau khi Nộp đạt 100%; starter (= lời giải bước trước) mở khi đã đạt bước trước
    loiGiaiSauKhiDat: true,
    ...(o.k >= 2 ? { khoiDauSauKhiDat: SLUG_F[o.k - 1] } : {}),
  });
  return {
    slug: SLUG_F[o.k],
    ten: `15.${o.k} F${o.k} — ${TEN_F[o.k].en}`,
    khoa: KHOA_CL,
    baiHoc: o.baiHoc,
    de: [{
      dangBai: 'project',
      tieuDe: { en: `CodeLearn · F${o.k} — ${TEN_F[o.k].en}`, vi: `CodeLearn · F${o.k} — ${TEN_F[o.k].vi}` },
      doKho: o.doKho ?? 'HARD',
      phut: o.phut,
      diem: 100,
      khaiNiem: o.khaiNiem,
      tienQuyet: o.k > 1 ? [`CodeLearn · F${o.k - 1}`] : ['FER202 chapters 9–12 (Router, json-server, Redux)'],
      the: ['fer202', 'assignment', 'codelearn', `f${o.k}`],
      banIn: o.banIn,
      viDu: o.viDu,
      thuatNgu: [...(o.thuatNgu ?? []), ...tnChung],
      goiY: o.goiY,
      loiHayGap: o.loiHayGap,
      giaiThich: o.giaiThich,
      moTaNgan: o.moTaNgan,
      tests: tj,
      khoiDau: uuTien(khoiDau(o.k), o.k),
      loiGiai: uuTien(phienBan(o.k), o.k),
      ...(o.demo ? { demo: o.demo } : {}),
    }],
  };
}
