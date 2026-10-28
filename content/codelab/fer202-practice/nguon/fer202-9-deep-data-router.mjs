/**
 * FER202 · Chương 9 — DEEP LAB: Course Catalog với Data Router (React Router 6.4+ chuyên sâu).
 * Sâu hơn Lab 9: createBrowserRouter + RouterProvider, loader tải dữ liệu TRƯỚC khi vẽ, action xử lý <Form method="post">,
 * redirect, errorElement + 404 bằng Response, useActionData cho lỗi form, useFetcher cập nhật tại chỗ không điều hướng,
 * useNavigation cho trạng thái chờ toàn cục, tìm kiếm bằng <Form> GET (URL là nguồn sự thật).
 */
import { doiDau, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const gui = (selector) => ({ hanhDong: 'gui', selector });
const B = 'http://localhost:9999';

const COURSES = [
  { id: 1, title: 'React Basics', code: 'FER202', published: true },
  { id: 2, title: 'Software Testing', code: 'SWT301', published: false },
  { id: 3, title: 'Software Requirements', code: 'SWR302', published: true },
];

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; color: #0f172a; background: #f8fafc; }
.layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
nav.sidebar { background: #1e293b; color: #fff; padding: 16px; } nav.sidebar a { color: #cbd5e1; display: block; padding: 4px 0; }
nav.sidebar a.active { color: #fff; font-weight: 700; }
main { padding: 20px 28px; position: relative; }
#global-spinner { position: absolute; top: 8px; right: 16px; background: #fde68a; padding: 2px 10px; border-radius: 999px; font-size: 13px; }
.course-item a { color: #2563eb; } .error { color: #dc2626; font-size: 13px; }
label { display: block; margin-top: 8px; } input { padding: 6px 8px; }
.badge { padding: 2px 8px; border-radius: 999px; background: #e2e8f0; } .badge.published { background: #bbf7d0; }
`;

const API = `// src/api.js — gọi json-server; lỗi HTTP ném Response để errorElement đọc được status
const BASE = 'http://localhost:9999/courses';

async function call(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Response(res.statusText || 'Error', { status: res.status });
  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export const listCourses = (q) => call(q ? ´@{BASE}?q=@{encodeURIComponent(q)}´ : BASE);
export const getCourse = (id) => call(´@{BASE}/@{id}´);
export const createCourse = (data) => call(BASE, json('POST', data));
export const updateCourse = (id, data) => call(´@{BASE}/@{id}´, json('PATCH', data));
export const deleteCourse = (id) => call(´@{BASE}/@{id}´, { method: 'DELETE' });
`;

const ROOT = `// src/routes/Root.js — layout chung + trạng thái chờ toàn cục + lỗi gốc
import { NavLink, Outlet, useNavigation, useRouteError } from 'react-router-dom';

export default function Root() {
  const navigation = useNavigation();
  return (
    <div className="layout">
      <nav className="sidebar" id="sidebar">
        <h2>CT Catalog</h2>
        <NavLink to="/courses" end id="nav-courses">All courses</NavLink>
        <NavLink to="/courses/new" id="nav-new">+ New course</NavLink>
      </nav>
      <main>
        {navigation.state !== 'idle' && <span id="global-spinner">Loading…</span>}
        <Outlet />
      </main>
    </div>
  );
}

export function RootError() {
  const error = useRouteError();
  return <p id="root-error">Something went wrong: {error?.status ?? ''} {error?.statusText ?? error?.message}</p>;
}
`;

const LIST = `// src/routes/Courses.js — loader đọc ?q từ URL; tìm kiếm bằng <Form> GET (không cần state)
import { Form, Link, useLoaderData } from 'react-router-dom';
import { listCourses } from '../api';

export async function coursesLoader({ request }) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  const courses = await listCourses(q.trim());
  return { courses, q };
}

export default function Courses() {
  const { courses, q } = useLoaderData();
  return (
    <section>
      <h1>Courses</h1>
      <Form id="search-form" role="search">
        <input id="q" name="q" defaultValue={q} key={q} placeholder="Search courses" />
        <button type="submit">Search</button>
      </Form>
      {courses.length === 0 ? (
        <p id="no-courses">No courses found</p>
      ) : (
        <ul id="course-list">
          {courses.map((c) => (
            <li key={c.id} className="course-item">
              <Link to={´/courses/@{c.id}´}>{c.title}</Link> <small>{c.code}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
`;

const DETAIL = `// src/routes/Course.js — loader theo :id, action của chính route (bật/tắt xuất bản qua useFetcher), errorElement 404
import { Form, Link, isRouteErrorResponse, useFetcher, useLoaderData, useRouteError } from 'react-router-dom';
import { getCourse, updateCourse } from '../api';

export async function courseLoader({ params }) {
  return getCourse(params.id); // 404 ⇒ ném Response ⇒ errorElement
}

export async function courseAction({ request, params }) {
  const form = await request.formData();
  if (form.get('intent') === 'toggle') {
    return updateCourse(params.id, { published: form.get('published') === 'true' });
  }
  return null;
}

export default function Course() {
  const course = useLoaderData();
  const fetcher = useFetcher();
  // cập nhật lạc quan: đang gửi thì hiện luôn giá trị sắp có
  const published = fetcher.formData ? fetcher.formData.get('published') === 'true' : course.published;

  return (
    <article>
      <h1 id="course-title">{course.title}</h1>
      <p id="course-code">{course.code}</p>
      <span id="course-status" className={published ? 'badge published' : 'badge'}>{published ? 'Published' : 'Draft'}</span>
      <fetcher.Form method="post" id="toggle-form">
        <input type="hidden" name="published" value={String(!published)} />
        <button id="btn-toggle" type="submit" name="intent" value="toggle">{published ? 'Unpublish' : 'Publish'}</button>
      </fetcher.Form>
      <p>
        <Link id="edit-link" to="edit">Edit</Link>
      </p>
      <Form
        method="post"
        action="destroy"
        id="delete-form"
        onSubmit={(e) => {
          if (!window.confirm('Delete this course?')) e.preventDefault();
        }}
      >
        <button id="btn-delete" type="submit">Delete</button>
      </Form>
    </article>
  );
}

export function CourseError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div>
        <p id="not-found">Course not found</p>
        <Link to="/courses" id="back-to-list">Back to courses</Link>
      </div>
    );
  }
  throw error; // lỗi khác ⇒ để errorElement phía trên xử lý
}
`;

const NEW = `// src/routes/NewCourse.js — <Form method="post"> + action kiểm hợp lệ, trả lỗi (useActionData) hoặc redirect
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createCourse } from '../api';

export function validateCourse({ title, code }) {
  const errors = {};
  if (title.trim().length < 3) errors.title = 'Title is too short';
  if (!/^[A-Z]{3}\\d{3}$/.test(code.trim())) errors.code = 'Code must look like FER202';
  return errors;
}

export async function newCourseAction({ request }) {
  const form = await request.formData();
  const data = { title: String(form.get('title') ?? ''), code: String(form.get('code') ?? '') };
  const errors = validateCourse(data);
  if (Object.keys(errors).length > 0) return { errors, values: data };
  const created = await createCourse({ title: data.title.trim(), code: data.code.trim(), published: false });
  return redirect(´/courses/@{created.id}´);
}

export default function NewCourse() {
  const result = useActionData();
  const navigation = useNavigation();
  const errors = result?.errors ?? {};
  return (
    <section>
      <h1>New course</h1>
      <Form method="post" id="course-form" noValidate>
        <label>Title <input id="title" name="title" defaultValue={result?.values?.title ?? ''} /></label>
        {errors.title && <p className="error" id="err-title">{errors.title}</p>}
        <label>Code <input id="code" name="code" defaultValue={result?.values?.code ?? ''} /></label>
        {errors.code && <p className="error" id="err-code">{errors.code}</p>}
        <button id="btn-create" type="submit" disabled={navigation.state === 'submitting'}>Create</button>
      </Form>
    </section>
  );
}
`;

const EDIT = `// src/routes/EditCourse.js — dùng lại loader chi tiết; action PATCH rồi redirect về trang chi tiết
import { Form, redirect, useLoaderData } from 'react-router-dom';
import { updateCourse } from '../api';

export async function editCourseAction({ request, params }) {
  const form = await request.formData();
  await updateCourse(params.id, { title: String(form.get('title')).trim(), code: String(form.get('code')).trim() });
  return redirect(´/courses/@{params.id}´);
}

export default function EditCourse() {
  const course = useLoaderData();
  return (
    <section>
      <h1>Edit {course.code}</h1>
      <Form method="post" id="edit-form">
        <label>Title <input id="title" name="title" defaultValue={course.title} /></label>
        <label>Code <input id="code" name="code" defaultValue={course.code} /></label>
        <button id="btn-save" type="submit">Save</button>
      </Form>
    </section>
  );
}
`;

const DESTROY = `// src/routes/destroy.js — route chỉ có action (không có giao diện)
import { redirect } from 'react-router-dom';
import { deleteCourse } from '../api';

export async function destroyAction({ params }) {
  await deleteCourse(params.id);
  return redirect('/courses');
}
`;

const ROUTER = `// src/router.js — cấu hình data router: loader/action/errorElement gắn vào từng route
import { createBrowserRouter, redirect } from 'react-router-dom';
import Root, { RootError } from './routes/Root';
import Courses, { coursesLoader } from './routes/Courses';
import Course, { CourseError, courseAction, courseLoader } from './routes/Course';
import NewCourse, { newCourseAction } from './routes/NewCourse';
import EditCourse, { editCourseAction } from './routes/EditCourse';
import { destroyAction } from './routes/destroy';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <RootError />,
    children: [
      { index: true, loader: () => redirect('/courses') },
      { path: 'courses', element: <Courses />, loader: coursesLoader },
      { path: 'courses/new', element: <NewCourse />, action: newCourseAction },
      {
        path: 'courses/:id',
        element: <Course />,
        loader: courseLoader,
        action: courseAction,
        errorElement: <CourseError />,
      },
      { path: 'courses/:id/edit', element: <EditCourse />, loader: courseLoader, action: editCourseAction },
      { path: 'courses/:id/destroy', action: destroyAction },
    ],
  },
]);
`;

const INDEX = `// src/index.js — RouterProvider thay cho <BrowserRouter><App/></BrowserRouter>
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
`;

const S_INDEX = `// src/index.js — STARTER: BrowserRouter cổ điển
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
`;
const S_APP = `// src/App.js — STARTER: tải dữ liệu bằng useEffect trong component (chậm một nhịp, không có loader/action)
import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9999/courses').then((r) => r.json()).then(setCourses);
  }, []);
  return <ul id="course-list">{courses.map((c) => <li key={c.id} className="course-item"><Link to={'/courses/' + c.id}>{c.title}</Link></li>)}</ul>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/courses" element={<Courses />} />
    </Routes>
  );
}
`;
const stub = (path, mo) => `// ${path} — STARTER
// ${mo}
export {};
`;

const CHUNG = { 'src/index.css': CSS, 'src/api.js': API };
const LOI_GIAI = {
  'src/index.js': INDEX, 'src/router.js': ROUTER, 'src/routes/Root.js': ROOT, 'src/routes/Courses.js': LIST,
  'src/routes/Course.js': DETAIL, 'src/routes/NewCourse.js': NEW, 'src/routes/EditCourse.js': EDIT, 'src/routes/destroy.js': DESTROY, ...CHUNG,
};
const KHOI_DAU = {
  'src/index.js': S_INDEX, 'src/App.js': S_APP,
  'src/router.js': stub('src/router.js', 'createBrowserRouter([...]) với loader / action / errorElement'),
  'src/routes/Root.js': stub('src/routes/Root.js', 'layout + NavLink #nav-courses #nav-new + Outlet + #global-spinner (useNavigation) + RootError'),
  'src/routes/Courses.js': stub('src/routes/Courses.js', 'coursesLoader (đọc ?q) + <Form id="search-form"> + .course-item'),
  'src/routes/Course.js': stub('src/routes/Course.js', 'courseLoader · courseAction (intent toggle) · useFetcher · #delete-form · CourseError (404)'),
  'src/routes/NewCourse.js': stub('src/routes/NewCourse.js', 'newCourseAction (validate ⇒ { errors } hoặc redirect) · <Form method="post" id="course-form">'),
  'src/routes/EditCourse.js': stub('src/routes/EditCourse.js', 'editCourseAction (PATCH ⇒ redirect) · <Form id="edit-form">'),
  'src/routes/destroy.js': stub('src/routes/destroy.js', 'destroyAction (DELETE ⇒ redirect("/courses"))'),
  ...CHUNG,
};

const KIEM = [
  // f1 data router + layout
  { nhom: 'f1', moTa: '"/" redirects to /courses (loader redirect)', url: '/', kiem: 'duong-dan', giaTri: '/courses', truoc: [cho()] },
  { nhom: 'f1', moTa: 'Layout with sidebar links', url: '/courses', kiem: 'danh-sach-text', selector: '#sidebar a', mongDoi: ['All courses', '+ New course'], truoc: [cho()] },
  { nhom: 'f1', an: true, moTa: 'createBrowserRouter + RouterProvider', kiem: 'ma-nguon', tep: 'src/router.js', khop: 'createBrowserRouter\\(' },
  // f2 list loader + search
  { nhom: 'f2', moTa: 'List comes from the loader', url: '/courses', kiem: 'danh-sach-text', selector: '.course-item a', mongDoi: ['React Basics', 'Software Testing', 'Software Requirements'], truoc: [cho()] },
  { nhom: 'f2', moTa: 'GET <Form> puts the query in the URL', url: '/courses', kiem: 'duong-dan', giaTri: '/courses?q=testing', truoc: [cho(), nhap('#q', 'testing'), gui('#search-form'), cho()] },
  { nhom: 'f2', moTa: 'Filtered by the server', url: '/courses?q=react', kiem: 'danh-sach-text', selector: '.course-item a', mongDoi: ['React Basics'], truoc: [cho()] },
  { nhom: 'f2', an: true, moTa: 'Search box shows the query from the URL', url: '/courses?q=react', kiem: 'thuoc-tinh-js', selector: '#q', thuocTinh: 'value', giaTri: 'react', truoc: [cho()] },
  { nhom: 'f2', an: true, moTa: 'Loader reads request.url', kiem: 'ma-nguon', tep: 'src/routes/Courses.js', khop: 'new URL\\(\\s*request\\.url\\s*\\)' },
  // f3 detail + 404
  { nhom: 'f3', moTa: 'Detail from the loader', url: '/courses/2', kiem: 'danh-sach-text', selector: '#course-title, #course-code, #course-status', mongDoi: ['Software Testing', 'SWT301', 'Draft'], truoc: [cho()] },
  { nhom: 'f3', moTa: 'Clicking a course navigates', url: '/courses', kiem: 'duong-dan', giaTri: '/courses/3', truoc: [cho(), click('.course-item:nth-child(3) a'), cho()] },
  { nhom: 'f3', moTa: 'Unknown id ⇒ route errorElement, layout kept', url: '/courses/99', kiem: 'danh-sach-text', selector: '#sidebar h2, #not-found', mongDoi: ['CT Catalog', 'Course not found'], truoc: [cho()] },
  { nhom: 'f3', an: true, moTa: 'Loader throws a Response for errors', kiem: 'ma-nguon', tep: 'src/api.js', khop: 'throw new Response\\(' },
  // f4 create action
  { nhom: 'f4', moTa: 'Invalid data ⇒ action errors via useActionData', url: '/courses/new', kiem: 'danh-sach-text', selector: '.error', mongDoi: ['Title is too short', 'Code must look like FER202'], truoc: [cho(), nhap('#title', 'AB'), nhap('#code', 'fer'), gui('#course-form'), cho()] },
  { nhom: 'f4', moTa: 'Values kept after errors, URL unchanged', url: '/courses/new', kiem: 'duong-dan', giaTri: '/courses/new', truoc: [cho(), nhap('#title', 'AB'), gui('#course-form'), cho()] },
  { nhom: 'f4', moTa: 'Valid ⇒ POST then redirect to the new course', url: '/courses/new', kiem: 'duong-dan', giaTri: '/courses/4', truoc: [cho(), nhap('#title', 'Web Design'), nhap('#code', 'WED201'), gui('#course-form'), cho(500)] },
  { nhom: 'f4', moTa: 'Created on the server as draft', url: '/courses/new', kiem: 'du-lieu-server', bang: 'courses', chua: { title: 'Web Design', code: 'WED201', published: false }, truoc: [cho(), nhap('#title', 'Web Design'), nhap('#code', 'WED201'), gui('#course-form'), cho(500)] },
  { nhom: 'f4', an: true, moTa: 'Entered title kept after an error', url: '/courses/new', kiem: 'thuoc-tinh-js', selector: '#title', thuocTinh: 'value', giaTri: 'Web Design', truoc: [cho(), nhap('#title', 'Web Design'), nhap('#code', 'x'), gui('#course-form'), cho()] },
  // f5 edit
  { nhom: 'f5', moTa: 'Edit form prefilled by the loader', url: '/courses/2/edit', kiem: 'thuoc-tinh-js', selector: '#title', thuocTinh: 'value', giaTri: 'Software Testing', truoc: [cho()] },
  { nhom: 'f5', moTa: 'Save PATCHes and redirects to the detail page', url: '/courses/2/edit', kiem: 'danh-sach-text', selector: '#course-title', mongDoi: ['Software Testing K19'], truoc: [cho(), nhap('#title', 'Software Testing K19'), gui('#edit-form'), cho(600)] },
  { nhom: 'f5', an: true, moTa: 'Uses PATCH', url: '/courses/2/edit', kiem: 'goi-fetch', khop: '^PATCH .*/courses/2$', truoc: [cho(), gui('#edit-form'), cho(500)] },
  // f6 delete
  { nhom: 'f6', moTa: 'Delete (confirmed) removes and goes back to the list', url: '/courses/3', kiem: 'danh-sach-text', selector: '.course-item a', mongDoi: ['React Basics', 'Software Testing'], truoc: [cho(), gui('#delete-form'), cho(600)] },
  { nhom: 'f6', moTa: 'Server record deleted', url: '/courses/3', kiem: 'du-lieu-server', bang: 'courses', khongChua: { id: 3 }, truoc: [cho(), gui('#delete-form'), cho(600)] },
  { nhom: 'f6', an: true, moTa: 'Cancelled confirm ⇒ nothing deleted', url: '/courses/3', confirm: false, kiem: 'goi-fetch', khop: '^DELETE', min: 0, max: 0, truoc: [cho(), gui('#delete-form'), cho(400)] },
  // f7 fetcher
  { nhom: 'f7', moTa: 'Publish via fetcher updates the status', url: '/courses/2', kiem: 'text', selector: '#course-status', giaTri: 'Published', truoc: [cho(), click('#btn-toggle'), cho(600)] },
  { nhom: 'f7', moTa: 'Fetcher does not navigate', url: '/courses/2', kiem: 'duong-dan', giaTri: '/courses/2', truoc: [cho(), click('#btn-toggle'), cho(600)] },
  { nhom: 'f7', moTa: 'Saved on the server', url: '/courses/2', kiem: 'du-lieu-server', bang: 'courses', chua: { id: 2, published: true }, chat: true, truoc: [cho(), click('#btn-toggle'), cho(600)] },
  { nhom: 'f7', an: true, moTa: 'Uses useFetcher', kiem: 'ma-nguon', tep: 'src/routes/Course.js', khop: 'useFetcher\\(\\)' },
  // f8 pending UI
  { nhom: 'f8', moTa: 'Global spinner while the next loader runs', url: '/courses', jsonServer: { base: B, db: { courses: COURSES }, treMs: 900 }, kiem: 'ton-tai', selector: '#global-spinner', truoc: [cho(1200), click('.course-item:nth-child(1) a'), cho(200)] },
  { nhom: 'f8', an: true, moTa: 'Spinner gone when idle', url: '/courses', kiem: 'khong-ton-tai', selector: '#global-spinner', truoc: [cho()] },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 9: Course Catalog — React Router data APIs (loaders · actions · fetchers)', vi: 'DEEP LAB 9: Danh mục khoá học — API dữ liệu của React Router (loader · action · fetcher)' },
  phu: { en: 'FER202 · Chapter 9 (deep) · Suggested time: 140 minutes · Total: 10 marks', vi: 'FER202 · Chương 9 (chuyên sâu) · Thời gian gợi ý: 140 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Since version 6.4 React Router can load and mutate data itself. Rebuild a course catalog with <code>createBrowserRouter</code>: every page gets its data from a <b>loader</b> before it renders, forms post to <b>actions</b> that validate, call the API and <code>redirect</code>, a missing course shows a route <b>errorElement</b>, publishing toggles in place with a <b>fetcher</b> (no navigation), and a global spinner follows <code>useNavigation()</code>. No <code>useEffect</code> for data, no form state.</p>',
    vi: '<p>Từ bản 6.4 React Router tự tải và thay đổi dữ liệu. Dựng lại danh mục khoá học bằng <code>createBrowserRouter</code>: mỗi trang lấy dữ liệu từ <b>loader</b> trước khi vẽ, form gửi tới <b>action</b> để kiểm hợp lệ, gọi API rồi <code>redirect</code>, khoá học không tồn tại hiện <b>errorElement</b> của route, xuất bản bật/tắt tại chỗ bằng <b>fetcher</b> (không điều hướng), và vòng chờ toàn cục theo <code>useNavigation()</code>. Không dùng <code>useEffect</code> để lấy dữ liệu, không giữ state cho form.</p>',
  },
  chucNangChinh: [{ en: 'Data router · list loader + GET search · detail loader + 404 · create/edit/delete actions · fetcher toggle · pending UI.', vi: 'Data router · loader danh sách + tìm GET · loader chi tiết + 404 · action tạo/sửa/xoá · fetcher bật/tắt · giao diện chờ.' }],
  yeuCauChung: [
    { en: 'json-server at <code>http://localhost:9999/courses</code>; all calls in <code>src/api.js</code>, which throws a <code>Response</code> for non-2xx statuses.', vi: 'json-server ở <code>http://localhost:9999/courses</code>; mọi lời gọi trong <code>src/api.js</code>, ném <code>Response</code> khi mã không phải 2xx.' },
    { en: 'Use <code>&lt;Form&gt;</code> from react-router-dom (not a plain <code>&lt;form&gt;</code> with onSubmit + fetch).', vi: 'Dùng <code>&lt;Form&gt;</code> của react-router-dom (không dùng <code>&lt;form&gt;</code> thường + onSubmit + fetch).' },
  ],
  cayThuMuc: `
src/
├── api.js                  # listCourses · getCourse · createCourse · updateCourse · deleteCourse
├── router.js               # createBrowserRouter([...])
├── routes/
│   ├── Root.js             # layout · #global-spinner · RootError
│   ├── Courses.js          # coursesLoader · search Form
│   ├── Course.js           # courseLoader · courseAction · fetcher · CourseError
│   ├── NewCourse.js        # newCourseAction · validateCourse
│   ├── EditCourse.js       # editCourseAction
│   └── destroy.js          # destroyAction
├── index.js                # <RouterProvider router={router} />
└── index.css (given)`,
  wireframe: `
+---------------+--------------------------------------------------+
| CT Catalog    |                                    [Loading…]    |
| All courses   | Courses                                          |
| + New course  | [Search courses        ] [Search]                |
|               | • React Basics  FER202                           |
|               | • Software Testing  SWT301                       |
|               | -------- /courses/2 --------                     |
|               | Software Testing   SWT301   (Draft) [Publish]    |
|               | Edit                         [Delete]            |
+---------------+--------------------------------------------------+`,
  moHinh: {
    ten: 'Routes',
    truong: [
      ['/', 'index loader ⇒ redirect("/courses")', ''],
      ['/courses', 'loader: list (?q=)', { en: 'GET Form search', vi: 'tìm bằng Form GET' }],
      ['/courses/new', 'action: validate ⇒ { errors, values } | POST + redirect', ''],
      ['/courses/:id', 'loader: one course · action: intent=toggle (PATCH) · errorElement', { en: '404 ⇒ "Course not found"', vi: '404 ⇒ "Course not found"' }],
      ['/courses/:id/edit', 'loader (reuse) · action: PATCH + redirect', ''],
      ['/courses/:id/destroy', 'action: DELETE + redirect("/courses")', { en: 'no element', vi: 'không có giao diện' }],
    ],
  },
  duLieuMau: JSON.stringify({ courses: COURSES }, null, 1),
  chucNang: [
    { ten: { en: 'Data router & layout', vi: 'Data router & layout' }, diem: 1, yeuCau: [{ en: '<code>createBrowserRouter</code> + <code>RouterProvider</code>; root layout with <code>#sidebar</code> (<code>#nav-courses</code>, <code>#nav-new</code>) and <code>&lt;Outlet /&gt;</code>; <code>/</code> redirects to <code>/courses</code> in an index loader.', vi: '<code>createBrowserRouter</code> + <code>RouterProvider</code>; layout gốc có <code>#sidebar</code> (<code>#nav-courses</code>, <code>#nav-new</code>) và <code>&lt;Outlet /&gt;</code>; <code>/</code> chuyển tới <code>/courses</code> bằng index loader.' }] },
    { ten: { en: 'List loader & GET search', vi: 'Loader danh sách & tìm GET' }, diem: 1.5, yeuCau: [{ en: '<code>coursesLoader</code> reads <code>q</code> from <code>request.url</code> and calls <code>GET /courses?q=</code>. <code>&lt;Form id="search-form"&gt;</code> with <code>#q</code> (default value from the loader); rows <code>.course-item a</code>; <code>#no-courses</code>.', vi: '<code>coursesLoader</code> đọc <code>q</code> từ <code>request.url</code> và gọi <code>GET /courses?q=</code>. <code>&lt;Form id="search-form"&gt;</code> có <code>#q</code> (giá trị mặc định từ loader); dòng <code>.course-item a</code>; <code>#no-courses</code>.' }], viDu: { en: 'submit "testing" ⇒ URL /courses?q=testing ⇒ Software Testing', vi: 'gửi "testing" ⇒ URL /courses?q=testing ⇒ Software Testing' } },
    { ten: { en: 'Detail loader & 404', vi: 'Loader chi tiết & 404' }, diem: 1.5, yeuCau: [{ en: '<code>#course-title</code>, <code>#course-code</code>, <code>#course-status</code> (<code>Published</code>/<code>Draft</code>). Unknown id ⇒ the route\'s <code>errorElement</code> shows <code>#not-found</code> <code>Course not found</code> while the layout stays.', vi: '<code>#course-title</code>, <code>#course-code</code>, <code>#course-status</code> (<code>Published</code>/<code>Draft</code>). Id lạ ⇒ <code>errorElement</code> của route hiện <code>#not-found</code> <code>Course not found</code>, layout vẫn giữ.' }] },
    { ten: { en: 'Create action', vi: 'Action tạo mới' }, diem: 1.5, yeuCau: [{ en: '<code>&lt;Form method="post" id="course-form"&gt;</code> (<code>#title</code>, <code>#code</code>). Action returns <code>{ errors, values }</code> (<code>#err-title</code> <code>Title is too short</code>, <code>#err-code</code> <code>Code must look like FER202</code>) or POSTs <code>{ title, code, published: false }</code> and redirects to <code>/courses/:newId</code>.', vi: '<code>&lt;Form method="post" id="course-form"&gt;</code> (<code>#title</code>, <code>#code</code>). Action trả <code>{ errors, values }</code> (<code>#err-title</code> <code>Title is too short</code>, <code>#err-code</code> <code>Code must look like FER202</code>) hoặc POST <code>{ title, code, published: false }</code> rồi chuyển tới <code>/courses/:idMới</code>.' }] },
    { ten: { en: 'Edit action', vi: 'Action sửa' }, diem: 1, yeuCau: [{ en: '<code>/courses/:id/edit</code> reuses the detail loader; <code>#edit-form</code> submits <code>PATCH</code> and redirects back to the detail.', vi: '<code>/courses/:id/edit</code> dùng lại loader chi tiết; <code>#edit-form</code> gửi <code>PATCH</code> rồi quay về trang chi tiết.' }] },
    { ten: { en: 'Delete action', vi: 'Action xoá' }, diem: 1, yeuCau: [{ en: '<code>&lt;Form method="post" action="destroy" id="delete-form"&gt;</code>; cancelled <code>confirm()</code> prevents submission; the action DELETEs and redirects to <code>/courses</code>.', vi: '<code>&lt;Form method="post" action="destroy" id="delete-form"&gt;</code>; huỷ <code>confirm()</code> thì không gửi; action DELETE rồi chuyển về <code>/courses</code>.' }] },
    { ten: { en: 'Fetcher toggle', vi: 'Bật/tắt bằng fetcher' }, diem: 1.5, yeuCau: [{ en: '<code>&lt;fetcher.Form method="post"&gt;</code> with <code>#btn-toggle</code> (<code>intent=toggle</code>) PATCHes <code>published</code> through the detail route\'s action; the page does not navigate and the status updates (optimistically via <code>fetcher.formData</code>).', vi: '<code>&lt;fetcher.Form method="post"&gt;</code> với <code>#btn-toggle</code> (<code>intent=toggle</code>) PATCH <code>published</code> qua action của route chi tiết; trang không điều hướng và trạng thái cập nhật (lạc quan qua <code>fetcher.formData</code>).' }] },
    { ten: { en: 'Pending UI', vi: 'Giao diện chờ' }, diem: 1, yeuCau: [{ en: '<code>#global-spinner</code> while <code>useNavigation().state !== \'idle\'</code>.', vi: '<code>#global-spinner</code> khi <code>useNavigation().state !== \'idle\'</code>.' }] },
  ],
  idBatBuoc: [
    ['#sidebar · #nav-courses · #nav-new · #global-spinner', { en: 'layout', vi: 'layout' }],
    ['#search-form · #q · .course-item a · #no-courses', { en: 'list', vi: 'danh sách' }],
    ['#course-title · #course-code · #course-status · #btn-toggle · #edit-link · #delete-form · #not-found', { en: 'detail', vi: 'chi tiết' }],
    ['#course-form · #title · #code · #err-title · #err-code · #edit-form', { en: 'forms', vi: 'form' }],
  ],
  truDiem: [
    { en: '<code>useEffect</code> + <code>useState</code> to fetch data in route components (waterfalls, flashes of empty UI).', vi: '<code>useEffect</code> + <code>useState</code> để lấy dữ liệu trong component route (thác request, nháy giao diện rỗng).' },
    { en: 'Plain <code>&lt;form onSubmit&gt;</code> + <code>fetch</code> + <code>navigate()</code> instead of actions.', vi: '<code>&lt;form onSubmit&gt;</code> thường + <code>fetch</code> + <code>navigate()</code> thay cho action.' },
    { en: 'One global <code>errorElement</code> only — a 404 wipes out the whole layout.', vi: 'Chỉ một <code>errorElement</code> gốc — 404 xoá luôn cả layout.' },
    { en: 'Toggling with a navigation form — the page jumps and the history grows.', vi: 'Bật/tắt bằng form điều hướng — trang nhảy và lịch sử dài thêm.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-9-deep-data-router',
  ten: 'Deep Lab 9 — Course Catalog (React Router loaders · actions · fetchers)',
  khoa: KHOA,
  baiHoc: 'fer202-9-1-router',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 9 — Course Catalog with the Data Router (loaders · actions · errorElement · useFetcher)', vi: 'Deep Lab 9 — Danh mục khoá học với Data Router (loader · action · errorElement · useFetcher)' },
      doKho: 'HARD',
      phut: 140,
      diem: 100,
      khaiNiem: ['createBrowserRouter', 'loaders', 'actions & redirect', 'errorElement & Response', 'useActionData', 'useFetcher', 'useNavigation', 'GET forms'],
      tienQuyet: ['Lab 9 — Course portal', 'Exercise 21 — Resource ids'],
      the: ['fer202', 'deep-lab', 'react-router', 'data-router'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'loader', vi: 'hàm tải dữ liệu của route, chạy TRƯỚC khi vẽ' },
        { en: 'action', vi: 'hàm xử lý form gửi tới route (POST/PATCH/DELETE)' },
        { en: 'fetcher', vi: 'gọi loader/action mà không điều hướng' },
        { en: 'revalidation', vi: 'router tự chạy lại loader sau mỗi action' },
        { en: 'error boundary (errorElement)', vi: 'giao diện thay thế khi route lỗi' },
        ...tn('rubric'),
      ],
      goiY: [
        'Loader: export async function coursesLoader({ request }) { const q = new URL(request.url).searchParams.get("q") ?? ""; return { courses: await listCourses(q), q }; }',
        'Action: const form = await request.formData(); kiểm ⇒ return { errors, values } (useActionData đọc) hoặc return redirect(´/courses/@{id}´).',
        '404: api ném new Response("", { status: 404 }); route có errorElement: <CourseError/> dùng isRouteErrorResponse(error) && error.status === 404.',
        'Fetcher: const fetcher = useFetcher(); <fetcher.Form method="post"><input type="hidden" name="published" …/><button name="intent" value="toggle">…',
      ],
      loiHayGap: [
        'Đặt route "courses/new" SAU "courses/:id" và nghĩ nó bị nuốt — React Router xếp hạng route tĩnh cao hơn, nhưng đừng đặt tên id là "new".',
        'Quên <code>return</code> trước <code>redirect(...)</code> trong action ⇒ không chuyển trang.',
        'Dùng <code>value</code> (không phải <code>defaultValue</code>) cho ô trong &lt;Form&gt; mà không có state ⇒ ô không gõ được.',
        'Ô tìm kiếm thiếu <code>key={q}</code> ⇒ quay lại trang trước, ô vẫn giữ chữ cũ.',
      ],
      moTaNgan: 'Deep lab chương 9: data router — loader (danh sách + tìm GET, chi tiết), action tạo/sửa/xoá có kiểm hợp lệ + redirect, errorElement 404, useFetcher bật/tắt tại chỗ, useNavigation vòng chờ, trên json-server. Thang 10.',
      giaiThich: '<p>Data router đưa việc <b>tải</b> và <b>đổi</b> dữ liệu lên tầng route: loader chạy trước khi component vẽ (không còn màn hình rỗng rồi mới có dữ liệu), action nhận <code>FormData</code> của <code>&lt;Form&gt;</code> và quyết định trả lỗi hay <code>redirect</code>. Sau mỗi action router tự chạy lại loader nên giao diện luôn khớp server mà không cần state thủ công. Lỗi ném ra từ loader (kể cả <code>Response</code> 404) được <code>errorElement</code> gần nhất bắt, nên layout vẫn còn. Fetcher dùng chung cơ chế action nhưng không điều hướng — đúng cho thao tác tại chỗ như bật/tắt xuất bản.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom'], url: '/courses', jsonServer: { base: B, db: { courses: COURSES } }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://reactrouter.com/en/6.26.2/start/tutorial',
    },
  ],
});
