/**
 * FER202 · Exercise 21 — Resource ids: danh sách user ⇒ /users/:id ⇒ chi tiết đọc bằng useParams (+ fetch theo id).
 * Đề 2: sửa tài nguyên theo id (/users/:id/edit, PATCH, quay về trang chi tiết).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector) => ({ hanhDong: 'click', selector });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 150) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';
const R = { router: true };

const USERS = [
  { id: 1, name: 'Nguyen Van An', email: 'an@fpt.edu.vn', major: 'SE' },
  { id: 2, name: 'Tran Thi Binh', email: 'binh@fpt.edu.vn', major: 'AI' },
  { id: 3, name: 'Le Van Cuong', email: 'cuong@fpt.edu.vn', major: 'SE' },
];

export default doiDau({
  slug: 'fer202-9-ex21-resource-ids',
  ten: 'Exercise 21 — Resource ids',
  khoa: KHOA,
  baiHoc: 'fer202-9-ex21-resource-ids',
  de: [
    reactNho({
      tieuDe: 'Users list → /users/:id detail (fetch by id)',
      doKho: 'MEDIUM', phut: 15, index: R,
      jsonServer: { base: B, db: { users: USERS } },
      khaiNiem: ['useParams', 'fetch by id', 'effect depends on id', '404 from server'], the: ['router', 'useParams', 'exercise-21'],
      moTa: {
        en: '<p>The handout task, with a real API. <code>/users</code> lists users from <code>GET /users</code>; each links to <code>/users/:id</code>, which loads <code>GET /users/:id</code>. A <b>Next user</b> link goes to <code>/users/&lt;id+1&gt;</code> — the SAME component stays mounted, so the effect must depend on <code>id</code>. json-server answers 404 for unknown ids.</p>',
        vi: '<p>Bài của handout, với API thật. <code>/users</code> liệt kê user từ <code>GET /users</code>; mỗi dòng link tới <code>/users/:id</code>, trang này tải <code>GET /users/:id</code>. Link <b>Next user</b> sang <code>/users/&lt;id+1&gt;</code> — CÙNG component vẫn mount, nên effect phải phụ thuộc <code>id</code>. json-server trả 404 với id không có.</p>',
      },
      yeuCau: [
        { en: 'List: <code>a.user-link</code> (text = name). Detail: <code>#user-name</code>, <code>#user-email</code>, <code>#user-major</code> (<code>Major: SE</code>), <code>#next-user</code>, <code>#back</code> (to <code>/users</code>).', vi: 'Danh sách: <code>a.user-link</code> (chữ = tên). Chi tiết: <code>#user-name</code>, <code>#user-email</code>, <code>#user-major</code> (<code>Major: SE</code>), <code>#next-user</code>, <code>#back</code> (về <code>/users</code>).' },
        { en: 'Loading ⇒ <code>#loading</code>; HTTP 404 ⇒ <code>#not-found</code> <code>User 9 not found</code>.', vi: 'Đang tải ⇒ <code>#loading</code>; HTTP 404 ⇒ <code>#not-found</code> <code>User 9 not found</code>.' },
      ],
      viDu: [{ input: '/users/1 → Next user', output: 'URL /users/2 · Tran Thi Binh', explanation: 'useEffect(…, [id]) re-fetches when the param changes.|||useEffect(…, [id]) tải lại khi tham số đổi.' }],
      goiY: ['const { id } = useParams(); useEffect(() => { … fetch(´http://localhost:9999/users/@{id}´) … }, [id]);', 'if (res.status === 404) { setNotFound(true); return; }'],
      loiHayGap: ['Mảng phụ thuộc <code>[]</code> ⇒ bấm Next user, URL đổi mà nội dung vẫn là user cũ.', 'Tải cả danh sách rồi find ⇒ được, nhưng không đúng ý "resource id" (một request theo id) và chậm khi dữ liệu lớn.'],
      thuatNgu: [{ en: 'resource', vi: 'tài nguyên REST (một user, một bài viết…) có id riêng' }],
      giaiThich: '<p>React Router giữ nguyên component khi chỉ tham số đổi (<code>/users/1</code> → <code>/users/2</code>). State cũ còn đó; chỉ effect phụ thuộc <code>id</code> mới biết để tải lại.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('http://localhost:9999/users/' + id).then((r) => r.json()).then(setUser);
  }, []);
  if (!user) return null;
  return (
    <div>
      <h2 id="user-name">{user.name}</h2>
      <Link id="next-user" to={'/users/' + (id + 1)}>Next user</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — danh sách + chi tiết theo id; effect phụ thuộc [id]; xử lý 404
import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';

const API = 'http://localhost:9999/users';

function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(API).then((r) => r.json()).then(setUsers);
  }, []);
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}><Link className="user-link" to={´/users/@{u.id}´}>{u.name}</Link></li>
      ))}
    </ul>
  );
}

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    fetch(´@{API}/@{id}´).then(async (res) => {
      if (ignore) return;
      if (res.status === 404) { setStatus('notfound'); return; }
      const data = await res.json();
      if (!ignore) { setUser(data); setStatus('ok'); }
    });
    return () => { ignore = true; };
  }, [id]);

  if (status === 'loading') return <p id="loading">Loading...</p>;
  if (status === 'notfound') {
    return (
      <div>
        <p id="not-found">User {id} not found</p>
        <Link id="back" to="/users">Back</Link>
      </div>
    );
  }
  return (
    <div>
      <h2 id="user-name">{user.name}</h2>
      <p id="user-email">{user.email}</p>
      <p id="user-major">Major: {user.major}</p>
      <Link id="next-user" to={´/users/@{Number(id) + 1}´}>Next user</Link>{' '}
      <Link id="back" to="/users">Back</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'List from the API', url: '/users', kiem: 'danh-sach-text', selector: 'a.user-link', mongDoi: ['Nguyen Van An', 'Tran Thi Binh', 'Le Van Cuong'] },
        { moTa: 'Detail by id', url: '/users/3', kiem: 'danh-sach-text', selector: '#user-name, #user-email, #user-major', mongDoi: ['Le Van Cuong', 'cuong@fpt.edu.vn', 'Major: SE'] },
        { moTa: 'Next user re-fetches', url: '/users/1', kiem: 'text', selector: '#user-name', giaTri: 'Tran Thi Binh', truoc: [cho(), click('#next-user'), cho()] },
        { moTa: 'Unknown id ⇒ not found', url: '/users/9', kiem: 'text', selector: '#not-found', giaTri: 'User 9 not found' },
        { an: true, moTa: 'Next user URL is numeric (not "11")', url: '/users/1', kiem: 'duong-dan', giaTri: '/users/2', truoc: [cho(), click('#next-user')] },
        { an: true, moTa: 'Fetches the single resource', url: '/users/2', kiem: 'goi-fetch', khop: '/users/2$' },
        { an: true, moTa: 'Clicking a list item opens the detail', url: '/users', kiem: 'duong-dan', giaTri: '/users/2', truoc: [cho(), click('li:nth-child(2) .user-link')] },
      ],
    }),
    reactNho({
      tieuDe: 'Edit a resource: /users/:id/edit with PATCH',
      doKho: 'HARD', phut: 20, index: R,
      jsonServer: { base: B, db: { users: USERS } },
      khaiNiem: ['prefilled form', 'PATCH', 'navigate after save', 'nested resource route'], the: ['router', 'useParams', 'exercise-21'],
      moTa: {
        en: '<p>Extend the detail page with editing. <code>/users/:id</code> shows the user and an <b>Edit</b> link to <code>/users/:id/edit</code>. The edit page loads the same resource into a form, sends <code>PATCH /users/:id</code> with the changed fields, then navigates back to the detail page, which shows the new data.</p>',
        vi: '<p>Mở rộng trang chi tiết thêm phần sửa. <code>/users/:id</code> hiện user và link <b>Edit</b> tới <code>/users/:id/edit</code>. Trang sửa tải cùng tài nguyên vào form, gửi <code>PATCH /users/:id</code> với các trường đã đổi, rồi quay về trang chi tiết, nơi hiện dữ liệu mới.</p>',
      },
      yeuCau: [
        { en: 'Detail: <code>#user-name</code>, <code>#user-email</code>, <code>#edit</code>. Edit form <code>#edit-form</code> with <code>#name</code>, <code>#email</code> (prefilled), <code>#save</code>, <code>#cancel</code> (back to detail without saving).', vi: 'Chi tiết: <code>#user-name</code>, <code>#user-email</code>, <code>#edit</code>. Form sửa <code>#edit-form</code> có <code>#name</code>, <code>#email</code> (điền sẵn), <code>#save</code>, <code>#cancel</code> (về chi tiết, không lưu).' },
        { en: 'Validation: name ≥ 2 chars, email contains <code>@</code> ⇒ <code>#form-error</code> <code>Name and a valid email are required</code>, no request.', vi: 'Kiểm: tên ≥ 2 ký tự, email có <code>@</code> ⇒ <code>#form-error</code> <code>Name and a valid email are required</code>, không gửi request.' },
      ],
      viDu: [{ input: 'edit user 2 name → "Tran Thi Binh K18"', output: 'PATCH /users/2 · detail shows the new name', explanation: 'The detail page re-fetches when it mounts again after navigate.|||Trang chi tiết tải lại khi mount lại sau navigate.' }],
      goiY: ['await fetch(´…/users/@{id}´, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) }); navigate(´/users/@{id}´);', 'Form điền sẵn: useEffect tải user rồi setForm({ name: u.name, email: u.email }).'],
      loiHayGap: ['Dùng <code>defaultValue</code> trước khi dữ liệu về ⇒ ô trống mãi (defaultValue chỉ đọc một lần).', 'Navigate trước khi PATCH xong ⇒ trang chi tiết đọc dữ liệu cũ.'],
      thuatNgu: [{ en: 'PATCH', vi: 'sửa một phần tài nguyên (khác PUT là thay toàn bộ)' }],
      giaiThich: '<p>Đường dẫn <code>/users/:id/edit</code> mô tả rõ "sửa tài nguyên id". Đợi PATCH thành công rồi mới navigate; trang chi tiết mount lại sẽ GET dữ liệu mới.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('http://localhost:9999/users/' + id).then((r) => r.json()).then(setUser); }, [id]);
  if (!user) return null;
  return (<div><h2 id="user-name">{user.name}</h2><p id="user-email">{user.email}</p></div>);
}

export default function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — chi tiết + sửa theo id: form điền sẵn, PATCH, xong mới navigate
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const API = 'http://localhost:9999/users';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(´@{API}/@{id}´).then((r) => r.json()).then(setUser);
  }, [id]);
  if (!user) return <p id="loading">Loading...</p>;
  return (
    <div>
      <h2 id="user-name">{user.name}</h2>
      <p id="user-email">{user.email}</p>
      <Link id="edit" to="edit">Edit</Link>
    </div>
  );
}

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(´@{API}/@{id}´).then((r) => r.json()).then((u) => setForm({ name: u.name, email: u.email }));
  }, [id]);

  if (!form) return <p id="loading">Loading...</p>;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !form.email.includes('@')) {
      setError('Name and a valid email are required');
      return;
    }
    await fetch(´@{API}/@{id}´, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
    });
    navigate(´/users/@{id}´);
  };

  return (
    <form id="edit-form" onSubmit={submit}>
      <input id="name" name="name" value={form.name} onChange={onChange} />
      <input id="email" name="email" value={form.email} onChange={onChange} />
      {error && <p id="form-error">{error}</p>}
      <button id="save" type="submit">Save</button>
      <button id="cancel" type="button" onClick={() => navigate(´/users/@{id}´)}>Cancel</button>
    </form>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/users/:id/edit" element={<UserEdit />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Edit link opens the edit route', url: '/users/2', kiem: 'duong-dan', giaTri: '/users/2/edit', truoc: [cho(), click('#edit')] },
        { moTa: 'Form is prefilled', url: '/users/2/edit', kiem: 'thuoc-tinh-js', selector: '#name', thuocTinh: 'value', giaTri: 'Tran Thi Binh', truoc: [cho()] },
        { moTa: 'Save PATCHes the server', url: '/users/2/edit', kiem: 'du-lieu-server', bang: 'users', chua: { id: 2, name: 'Tran Thi Binh K18' }, truoc: [cho(), nhap('#name', 'Tran Thi Binh K18'), { hanhDong: 'gui', selector: '#edit-form' }, cho()] },
        { moTa: 'Back on the detail page with new data', url: '/users/2/edit', kiem: 'text', selector: '#user-name', giaTri: 'Tran Thi Binh K18', truoc: [cho(), nhap('#name', 'Tran Thi Binh K18'), { hanhDong: 'gui', selector: '#edit-form' }, cho(250)] },
        { an: true, moTa: 'Uses PATCH /users/2', url: '/users/2/edit', kiem: 'goi-fetch', khop: '^PATCH .*/users/2$', truoc: [cho(), nhap('#email', 'binh.k18@fpt.edu.vn'), { hanhDong: 'gui', selector: '#edit-form' }, cho()] },
        { an: true, moTa: 'Invalid email ⇒ error, no request', url: '/users/1/edit', kiem: 'goi-fetch', khop: '^PATCH', min: 0, max: 0, truoc: [cho(), nhap('#email', 'nope'), { hanhDong: 'gui', selector: '#edit-form' }] },
        { an: true, moTa: 'Error message', url: '/users/1/edit', kiem: 'text', selector: '#form-error', giaTri: 'Name and a valid email are required', truoc: [cho(), nhap('#name', 'A'), { hanhDong: 'gui', selector: '#edit-form' }] },
        { an: true, moTa: 'Cancel does not save', url: '/users/3/edit', kiem: 'du-lieu-server', bang: 'users', chua: { id: 3, name: 'Le Van Cuong' }, truoc: [cho(), nhap('#name', 'Changed'), click('#cancel'), cho()] },
      ],
    }),
  ],
});
