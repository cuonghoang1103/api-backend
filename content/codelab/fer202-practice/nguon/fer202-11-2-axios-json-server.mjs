/**
 * FER202 · 11.2 — axios + json-server (CRUD trong React). json-server giả ở http://localhost:9999 (có trạng thái:
 * POST/PUT/PATCH/DELETE đổi dữ liệu thật; lọc, _sort/_order, _page/_limit, q, X-Total-Count).
 * Dễ → khó: GET + loading/error → POST từ form → PATCH/DELETE (confirm) → axios.create + params + phân trang.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 150) => ({ hanhDong: 'cho', ms });
const gui = (selector) => ({ hanhDong: 'gui', selector });
const B = 'http://localhost:9999';
const AX = ['axios'];

const TASKS = [
  { id: 1, title: 'Read Slot 19 slides', done: true },
  { id: 2, title: 'Install json-server', done: false },
  { id: 3, title: 'Write AxiosDemo', done: false },
];

const BOOKS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ['Clean Code', 'Refactoring', 'You Don\'t Know JS', 'Eloquent JavaScript', 'The Pragmatic Programmer', 'Design Patterns',
    'Learning React', 'Fullstack React', 'Head First Java', 'Effective Java', 'Grokking Algorithms', 'Introduction to Algorithms'][i],
  year: [2008, 1999, 2014, 2011, 1999, 1994, 2020, 2017, 2005, 2018, 2016, 2009][i],
}));

export default doiDau({
  slug: 'fer202-11-2-axios-json-server',
  ten: '11.2 axios & json-server',
  khoa: KHOA,
  baiHoc: 'fer202-11-2-axios-json-server',
  de: [
    reactNho({
      tieuDe: 'axios.get in useEffect with loading and error',
      doKho: 'EASY', phut: 10, thuVien: AX,
      jsonServer: { base: B, db: { tasks: TASKS } },
      khaiNiem: ['axios.get', 'res.data', 'axios rejects on 4xx/5xx'], the: ['axios', 'json-server'],
      moTa: {
        en: '<p>Load <code>GET http://localhost:9999/tasks</code> with <b>axios</b>. Unlike fetch, axios parses JSON for you (<code>res.data</code>) and <b>rejects</b> for any non-2xx status, so one <code>try/catch</code> covers both network and HTTP errors.</p>',
        vi: '<p>Tải <code>GET http://localhost:9999/tasks</code> bằng <b>axios</b>. Khác fetch, axios tự parse JSON (<code>res.data</code>) và <b>reject</b> với mọi mã không phải 2xx, nên một <code>try/catch</code> bắt được cả lỗi mạng lẫn lỗi HTTP.</p>',
      },
      yeuCau: [
        { en: '<code>#loading</code> <code>Loading...</code> while waiting; tasks in <code>li.task</code>; a done task has class <code>done</code>.', vi: '<code>#loading</code> <code>Loading...</code> khi chờ; việc trong <code>li.task</code>; việc xong có class <code>done</code>.' },
        { en: 'Error ⇒ <code>#error</code> <code>Error: Request failed with status code 404</code> (use the axios error message).', vi: 'Lỗi ⇒ <code>#error</code> <code>Error: Request failed with status code 404</code> (dùng message của lỗi axios).' },
      ],
      viDu: [{ input: 'server has 3 tasks', output: '3 li.task, the first with class done', explanation: 'const res = await axios.get(url); setTasks(res.data);|||const res = await axios.get(url); setTasks(res.data);' }],
      goiY: ["import axios from 'axios'; useEffect(() => { (async () => { try { const res = await axios.get('http://localhost:9999/tasks'); setTasks(res.data); } catch (err) { setError(err.message); } finally { setLoading(false); } })(); }, []);", 'className={t.done ? "task done" : "task"}'],
      loiHayGap: ['Gọi <code>res.json()</code> với axios ⇒ không có hàm đó; dữ liệu đã nằm ở <code>res.data</code>.', 'Đặt <code>setTasks(res)</code> ⇒ lưu cả object phản hồi, map lỗi.'],
      thuatNgu: [{ en: 'HTTP client', vi: 'thư viện gửi request HTTP' }],
      giaiThich: '<p>axios gói sẵn những việc phải tự làm với fetch: parse JSON, ném lỗi khi status xấu, đặt header JSON khi gửi dữ liệu. Vòng đời loading → data/error vẫn do bạn quản lý bằng state.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:9999/tasks').then((res) => setTasks(res));
  }, []);
  return <ul>{tasks.map((t) => <li key={t.id} className="task">{t.title}</li>)}</ul>;
}
`,
      giai: `// src/App.js — axios.get + loading/error; dữ liệu ở res.data
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:9999/tasks');
        setTasks(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p id="loading">Loading...</p>;
  if (error) return <p id="error">Error: {error}</p>;
  return (
    <ul>
      {tasks.map((t) => <li key={t.id} className={t.done ? 'task done' : 'task'}>{t.title}</li>)}
    </ul>
  );
}
`,
      kiem: [
        { moTa: 'Tasks listed', kiem: 'danh-sach-text', selector: 'li.task', mongDoi: ['Read Slot 19 slides', 'Install json-server', 'Write AxiosDemo'] },
        { moTa: 'Done class', kiem: 'so-luong', selector: 'li.task.done', giaTri: 1 },
        { moTa: 'Loading shown', jsonServer: { base: B, db: { tasks: TASKS }, treMs: 1200 }, kiem: 'text', selector: '#loading', giaTri: 'Loading...' },
        { moTa: 'Error message from axios', jsonServer: { base: B, db: {} }, kiem: 'text', selector: '#error', giaTri: 'Error: Request failed with status code 404' },
        { an: true, moTa: 'Uses axios.get', kiem: 'ma-nguon', khop: 'axios\\.get\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'axios.post from a form',
      doKho: 'MEDIUM', phut: 14, thuVien: AX,
      jsonServer: { base: B, db: { tasks: TASKS } },
      khaiNiem: ['axios.post', 'server-generated id', 'updating local state from the response'], the: ['axios', 'json-server', 'forms'],
      moTa: {
        en: '<p>Add tasks. On submit, <code>POST /tasks</code> with <code>{ title, done: false }</code>; json-server returns the created object WITH its new <code>id</code>. Append <code>res.data</code> to the list (no second GET), clear the input, and disable the button while the request is in flight.</p>',
        vi: '<p>Thêm việc. Khi gửi form, <code>POST /tasks</code> với <code>{ title, done: false }</code>; json-server trả object vừa tạo KÈM <code>id</code> mới. Nối <code>res.data</code> vào danh sách (không GET lại), xoá ô nhập, và vô hiệu nút trong lúc request đang chạy.</p>',
      },
      yeuCau: [
        { en: 'Form <code>#task-form</code>, input <code>#title</code> (trimmed, blank ⇒ <code>#form-error</code> <code>Title is required</code>, no request), button <code>#btn-add</code>.', vi: 'Form <code>#task-form</code>, ô <code>#title</code> (cắt khoảng trắng, rỗng ⇒ <code>#form-error</code> <code>Title is required</code>, không gửi), nút <code>#btn-add</code>.' },
        { en: 'List <code>li.task</code>, count <code>#count</code> <code>4 tasks</code>.', vi: 'Danh sách <code>li.task</code>, đếm <code>#count</code> <code>4 tasks</code>.' },
      ],
      viDu: [{ input: 'add "Deploy to VPS"', output: 'POST body { title: "Deploy to VPS", done: false } · 4 tasks', explanation: 'setTasks((t) => [...t, res.data])|||setTasks((t) => [...t, res.data])' }],
      goiY: ["const res = await axios.post('http://localhost:9999/tasks', { title: title.trim(), done: false }); setTasks((t) => [...t, res.data]);", 'const [saving, setSaving] = useState(false); <button disabled={saving}>'],
      loiHayGap: ['Tự tạo <code>id: tasks.length + 1</code> ⇒ trùng id với server khi đã có xoá.', 'Gửi <code>JSON.stringify(data)</code> rồi lại để axios stringify ⇒ server nhận chuỗi lồng chuỗi.'],
      thuatNgu: [{ en: 'request body', vi: 'dữ liệu gửi kèm request' }],
      giaiThich: '<p>Server là nguồn sự thật cho id. Dùng chính object server trả về giúp state khớp với database mà không cần GET lại cả danh sách.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  useEffect(() => { axios.get('http://localhost:9999/tasks').then((r) => setTasks(r.data)); }, []);
  const add = () => {
    setTasks([...tasks, { id: tasks.length + 1, title, done: false }]);
  };
  return (
    <form id="task-form">
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button id="btn-add" onClick={add}>Add</button>
      <ul>{tasks.map((t) => <li key={t.id} className="task">{t.title}</li>)}</ul>
    </form>
  );
}
`,
      giai: `// src/App.js — axios.post rồi nối object server trả về (có id thật)
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:9999/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(API).then((res) => setTasks(res.data));
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError('Title is required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await axios.post(API, { title: t, done: false });
      setTasks((list) => [...list, res.data]);
      setTitle('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="task-form" onSubmit={add}>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button id="btn-add" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add'}</button>
      {error && <p id="form-error">{error}</p>}
      <p id="count">{tasks.length} tasks</p>
      <ul>{tasks.map((t) => <li key={t.id} className="task">{t.title}</li>)}</ul>
    </form>
  );
}
`,
      kiem: [
        { moTa: 'POST creates the task on the server', kiem: 'du-lieu-server', bang: 'tasks', chua: { title: 'Deploy to VPS', done: false }, truoc: [cho(), nhap('#title', '  Deploy to VPS '), gui('#task-form'), cho()] },
        { moTa: 'New task appears with the server id', kiem: 'danh-sach-text', selector: 'li.task:last-child, #count', mongDoi: ['4 tasks', 'Deploy to VPS'], truoc: [cho(), nhap('#title', 'Deploy to VPS'), gui('#task-form'), cho()] },
        { moTa: 'Blank title ⇒ error, no POST', kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [cho(), nhap('#title', '   '), gui('#task-form'), cho()] },
        { moTa: 'Input cleared', kiem: 'thuoc-tinh-js', selector: '#title', thuocTinh: 'value', giaTri: '', truoc: [cho(), nhap('#title', 'X'), gui('#task-form'), cho()] },
        { an: true, moTa: 'Error message text', kiem: 'text', selector: '#form-error', giaTri: 'Title is required', truoc: [cho(), gui('#task-form')] },
        { an: true, moTa: 'Button disabled while saving', jsonServer: { base: B, db: { tasks: TASKS }, treMs: 800 }, kiem: 'thuoc-tinh-js', selector: '#btn-add', thuocTinh: 'disabled', giaTri: true, truoc: [cho(1000), nhap('#title', 'Slow'), gui('#task-form')] },
        { an: true, moTa: 'POST body', kiem: 'goi-fetch', khop: '^POST .*/tasks$', than: { title: 'Deploy', done: false }, chat: true, truoc: [cho(), nhap('#title', 'Deploy'), gui('#task-form'), cho()] },
      ],
    }),
    reactNho({
      tieuDe: 'PATCH to toggle and DELETE with confirm',
      doKho: 'MEDIUM', phut: 15, thuVien: AX,
      jsonServer: { base: B, db: { tasks: TASKS } },
      khaiNiem: ['axios.patch', 'axios.delete', 'confirm before destructive actions'], the: ['axios', 'json-server', 'CRUD'],
      moTa: {
        en: '<p>Finish the CRUD. A checkbox toggles <code>done</code> with <code>PATCH /tasks/:id</code> (only the changed field); a Delete button asks <code>window.confirm("Delete this task?")</code> and then sends <code>DELETE /tasks/:id</code>. Update local state only after the server succeeds.</p>',
        vi: '<p>Hoàn tất CRUD. Ô chọn đổi <code>done</code> bằng <code>PATCH /tasks/:id</code> (chỉ trường thay đổi); nút Delete hỏi <code>window.confirm("Delete this task?")</code> rồi mới gửi <code>DELETE /tasks/:id</code>. Chỉ cập nhật state sau khi server thành công.</p>',
      },
      yeuCau: [
        { en: 'Rows <code>li.task</code> with id <code>task-&lt;id&gt;</code>, checkbox <code>.toggle</code>, button <code>.btn-delete</code>, title in <code>.title</code>; done rows have class <code>done</code>.', vi: 'Dòng <code>li.task</code> có id <code>task-&lt;id&gt;</code>, ô chọn <code>.toggle</code>, nút <code>.btn-delete</code>, tiêu đề trong <code>.title</code>; dòng xong có class <code>done</code>.' },
        { en: '<code>#remaining</code> <code>2 left</code> (not done).', vi: '<code>#remaining</code> <code>2 left</code> (chưa xong).' },
      ],
      viDu: [{ input: 'tick task 2', output: 'PATCH /tasks/2 { done: true } · 1 left', explanation: 'PATCH sends only the field you change; PUT would replace the whole object.|||PATCH chỉ gửi trường thay đổi; PUT thay cả object.' }],
      goiY: ["const res = await axios.patch(´@{API}/@{t.id}´, { done: !t.done }); setTasks((l) => l.map((x) => (x.id === t.id ? res.data : x)));", "if (!window.confirm('Delete this task?')) return; await axios.delete(´@{API}/@{id}´); setTasks((l) => l.filter((x) => x.id !== id));"],
      loiHayGap: ['Dùng <code>put</code> mà chỉ gửi <code>{ done }</code> ⇒ json-server thay cả object, MẤT title.', 'Xoá trên giao diện trước, request lỗi sau ⇒ giao diện và server lệch nhau.'],
      thuatNgu: [{ en: 'destructive action', vi: 'thao tác phá huỷ (xoá) — cần xác nhận' }],
      giaiThich: '<p>Ánh xạ REST: GET đọc, POST tạo, PATCH sửa một phần, PUT thay toàn bộ, DELETE xoá. Với thao tác xoá luôn hỏi lại người dùng.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:9999/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { axios.get(API).then((r) => setTasks(r.data)); }, []);
  const toggle = (t) => axios.put(API + '/' + t.id, { done: !t.done });
  const remove = (id) => setTasks(tasks.filter((t) => t.id !== id));
  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id} id={'task-' + t.id} className="task">
          <input type="checkbox" className="toggle" checked={t.done} onChange={() => toggle(t)} />
          <span className="title">{t.title}</span>
          <button className="btn-delete" onClick={() => remove(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
`,
      giai: `// src/App.js — PATCH để đổi một trường, DELETE sau khi confirm; state cập nhật SAU khi server thành công
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:9999/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(API).then((res) => setTasks(res.data));
  }, []);

  const toggle = async (task) => {
    const res = await axios.patch(´@{API}/@{task.id}´, { done: !task.done });
    setTasks((list) => list.map((t) => (t.id === task.id ? res.data : t)));
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await axios.delete(´@{API}/@{id}´);
    setTasks((list) => list.filter((t) => t.id !== id));
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div>
      <p id="remaining">{remaining} left</p>
      <ul>
        {tasks.map((t) => (
          <li key={t.id} id={´task-@{t.id}´} className={t.done ? 'task done' : 'task'}>
            <input type="checkbox" className="toggle" checked={t.done} onChange={() => toggle(t)} />
            <span className="title">{t.title}</span>
            <button type="button" className="btn-delete" onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Toggle PATCHes only done (title kept)', kiem: 'du-lieu-server', bang: 'tasks', chua: { id: 2, title: 'Install json-server', done: true }, truoc: [cho(), click('#task-2 .toggle'), cho()] },
        { moTa: 'Row gets class done and counter updates', kiem: 'danh-sach-text', selector: '#remaining', mongDoi: ['1 left'], truoc: [cho(), click('#task-2 .toggle'), cho()] },
        { moTa: 'Delete (confirmed) removes on the server', kiem: 'du-lieu-server', bang: 'tasks', khongChua: { id: 3 }, truoc: [cho(), click('#task-3 .btn-delete'), cho()] },
        { moTa: 'Delete removes the row', kiem: 'so-luong', selector: 'li.task', giaTri: 2, truoc: [cho(), click('#task-3 .btn-delete'), cho()] },
        { an: true, moTa: 'Cancelled confirm ⇒ no DELETE', confirm: false, kiem: 'goi-fetch', khop: '^DELETE', min: 0, max: 0, truoc: [cho(), click('#task-1 .btn-delete'), cho()] },
        { an: true, moTa: 'Uses PATCH, not PUT', kiem: 'goi-fetch', khop: '^PATCH .*/tasks/1$', truoc: [cho(), click('#task-1 .toggle'), cho()] },
        { an: true, moTa: 'Done row has class', kiem: 'ton-tai', selector: '#task-2.done', truoc: [cho(), click('#task-2 .toggle'), cho()] },
      ],
    }),
    reactNho({
      tieuDe: 'axios.create, query params and server-side pagination',
      doKho: 'HARD', phut: 20, thuVien: AX,
      jsonServer: { base: B, db: { books: BOOKS } },
      khaiNiem: ['axios instance', 'params object', 'json-server _page/_limit/_sort/_order/q', 'X-Total-Count'], the: ['axios', 'json-server'],
      moTa: {
        en: '<p>Let the <b>server</b> do the work. Create <code>const api = axios.create({ baseURL: "http://localhost:9999" })</code> and request <code>api.get("/books", { params })</code> with json-server query params: search <code>q</code>, sort <code>_sort=year&amp;_order=desc</code>, pagination <code>_page</code> + <code>_limit=5</code>. The total comes from the <code>x-total-count</code> response header.</p>',
        vi: '<p>Để <b>server</b> làm việc. Tạo <code>const api = axios.create({ baseURL: "http://localhost:9999" })</code> và gọi <code>api.get("/books", { params })</code> với tham số của json-server: tìm <code>q</code>, sắp xếp <code>_sort=year&amp;_order=desc</code>, phân trang <code>_page</code> + <code>_limit=5</code>. Tổng số lấy từ header phản hồi <code>x-total-count</code>.</p>',
      },
      yeuCau: [
        { en: '<code>#search</code> (resets to page 1), <code>#sort</code> select (<code>title</code> asc default, <code>year-desc</code>), <code>#prev</code>/<code>#next</code> (disabled at the ends), <code>#page-info</code> <code>Page 1 of 3 (12 books)</code>.', vi: '<code>#search</code> (về trang 1), select <code>#sort</code> (<code>title</code> tăng dần mặc định, <code>year-desc</code>), <code>#prev</code>/<code>#next</code> (vô hiệu ở hai đầu), <code>#page-info</code> <code>Page 1 of 3 (12 books)</code>.' },
        { en: 'Rows <code>li.book</code> text <code>Title (year)</code>. Re-fetch whenever search/sort/page changes (one effect).', vi: 'Dòng <code>li.book</code> chữ <code>Tên (năm)</code>. Tải lại khi search/sort/page đổi (một effect).' },
      ],
      viDu: [{ input: 'sort year-desc, page 1', output: 'Learning React (2020), Effective Java (2018), …', explanation: 'GET /books?_sort=year&_order=desc&_page=1&_limit=5|||GET /books?_sort=year&_order=desc&_page=1&_limit=5' }],
      goiY: ['const params = { _page: page, _limit: 5, _sort: sort === "year-desc" ? "year" : "title", _order: sort === "year-desc" ? "desc" : "asc" }; if (q.trim()) params.q = q.trim();', 'const total = Number(res.headers["x-total-count"]); const pages = Math.max(1, Math.ceil(total / 5));'],
      loiHayGap: ['Tải hết 12 cuốn rồi cắt ở client ⇒ đúng kết quả nhưng sai yêu cầu; dữ liệu thật có thể hàng nghìn dòng.', 'Đổi ô tìm mà không về trang 1 ⇒ đang ở trang 3 thì kết quả tìm (1 trang) hiện rỗng.'],
      thuatNgu: [{ en: 'server-side pagination', vi: 'phân trang ở server: chỉ tải trang đang xem' }, { en: 'axios instance', vi: 'bản axios có cấu hình chung (baseURL, header…)' }],
      giaiThich: '<p><code>params</code> được axios ghép thành query string. json-server hiểu <code>_page/_limit/_sort/_order/q</code> và trả tổng số bản ghi trong header <code>X-Total-Count</code> — đúng mẫu API phân trang ngoài đời.</p>',
      dau: `// src/App.js — STARTER
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    axios.get('http://localhost:9999/books').then((r) => setBooks(r.data.slice((page - 1) * 5, page * 5)));
  }, []);
  return (
    <div>
      <ul>{books.map((b) => <li key={b.id} className="book">{b.title} ({b.year})</li>)}</ul>
      <button id="next" onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
`,
      giai: `// src/App.js — axios instance + params của json-server; tổng số từ header x-total-count
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:9999' });
const LIMIT = 5;

export default function App() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('title');

  useEffect(() => {
    let ignore = false;
    const params = {
      _page: page,
      _limit: LIMIT,
      _sort: sort === 'year-desc' ? 'year' : 'title',
      _order: sort === 'year-desc' ? 'desc' : 'asc',
    };
    if (q.trim()) params.q = q.trim();
    api.get('/books', { params }).then((res) => {
      if (ignore) return;
      setBooks(res.data);
      setTotal(Number(res.headers['x-total-count']) || 0);
    });
    return () => { ignore = true; };
  }, [page, q, sort]);

  const pages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div>
      <input id="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search books" />
      <select id="sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
        <option value="title">Title A → Z</option>
        <option value="year-desc">Newest first</option>
      </select>
      <ul>{books.map((b) => <li key={b.id} className="book">{b.title} ({b.year})</li>)}</ul>
      <p id="page-info">Page {page} of {pages} ({total} books)</p>
      <button id="prev" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
      <button id="next" type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'First page sorted by title', kiem: 'danh-sach-text', selector: 'li.book', mongDoi: ['Clean Code (2008)', 'Design Patterns (1994)', 'Effective Java (2018)', 'Eloquent JavaScript (2011)', 'Fullstack React (2017)'], truoc: [cho(200)] },
        { moTa: 'Page info from X-Total-Count', kiem: 'text', selector: '#page-info', giaTri: 'Page 1 of 3 (12 books)', truoc: [cho(200)] },
        { moTa: 'Newest first', kiem: 'danh-sach-text', selector: 'li.book:nth-child(-n+2)', mongDoi: ['Learning React (2020)', 'Effective Java (2018)'], truoc: [cho(200), { hanhDong: 'doi', selector: '#sort', giaTri: 'year-desc' }, cho(200)] },
        { moTa: 'Next page requested from the server', kiem: 'goi-fetch', khop: '/books\\?.*_page=2', truoc: [cho(200), click('#next'), cho(200)] },
        { an: true, moTa: 'Search resets to page 1', kiem: 'danh-sach-text', selector: 'li.book, #page-info', mongDoi: ['Fullstack React (2017)', 'Learning React (2020)', 'Page 1 of 1 (2 books)'], truoc: [cho(200), click('#next'), cho(200), nhap('#search', 'react'), cho(250)] },
        { an: true, moTa: 'Last page: Next disabled', kiem: 'thuoc-tinh-js', selector: '#next', thuocTinh: 'disabled', giaTri: true, truoc: [cho(200), click('#next'), cho(200), click('#next'), cho(200)] },
        { an: true, moTa: 'Uses axios.create with baseURL', kiem: 'ma-nguon', khop: 'axios\\.create\\(\\s*\\{\\s*baseURL' },
        { an: true, moTa: 'Only 5 rows per request (server pagination)', kiem: 'goi-fetch', khop: '_limit=5', truoc: [cho(200)] },
      ],
    }),
  ],
});
