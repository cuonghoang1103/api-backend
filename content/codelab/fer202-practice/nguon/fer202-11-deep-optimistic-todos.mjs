/**
 * FER202 · Chương 11 — DEEP LAB: Team Todos — HTTP client & optimistic UI (gọi API chuyên sâu).
 * Sâu hơn Lab 11: lớp http.js riêng (base URL từ .env, header Authorization, ApiError có status, đọc X-Total-Count),
 * phân trang "Load more" phía server, cập nhật LẠC QUAN có hoàn tác khi lỗi (sửa, thêm với id tạm), xoá có Undo
 * (trì hoãn request), cache kiểu stale-while-revalidate khi quay lại tab, lỗi + thử lại.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 250) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const TODOS = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: 'Task ' + (i + 1), done: i % 4 === 0 }));

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f8fafc; color: #0f172a; }
.tabs button.active { background: #2563eb; color: #fff; }
.todo { display: flex; gap: 8px; align-items: center; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
.todo.done .title { text-decoration: line-through; color: #64748b; } .todo.pending { opacity: .55; }
#toast { position: fixed; bottom: 16px; right: 16px; background: #b91c1c; color: #fff; padding: 8px 14px; border-radius: 8px; }
#undo-bar { background: #1e293b; color: #fff; padding: 6px 12px; border-radius: 8px; display: inline-flex; gap: 10px; }
#refreshing { font-size: 12px; color: #2563eb; margin-left: 8px; }
`;

const ENV = `REACT_APP_API_URL=http://localhost:9999
`;

const HTTP = `// src/api/http.js — MỘT lớp gọi HTTP cho cả app: base URL từ .env, token, lỗi có status, đọc tổng số
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:9999';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(method, path, body) {
  const headers = { Accept: 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = ´Bearer @{token}´;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!res.ok) throw new ApiError(res.status, ´HTTP @{res.status}´);
  const totalHeader = res.headers && res.headers.get ? res.headers.get('X-Total-Count') : null;
  const data = res.status === 204 ? null : await res.json();
  return { data, total: totalHeader === null ? null : Number(totalHeader) };
}

export const http = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  del: (path) => request('DELETE', path),
};
`;

const TODOS_API = `// src/api/todos.js — các lời gọi theo nghiệp vụ (component không tự dựng URL)
import { http } from './http';

export const PAGE_SIZE = 5;

export async function fetchTodos(page, limit = PAGE_SIZE) {
  const { data, total } = await http.get(´/todos?_sort=id&_order=desc&_page=@{page}&_limit=@{limit}´);
  return { items: data, total: total ?? data.length };
}

export const updateTodo = (id, patch) => http.patch(´/todos/@{id}´, patch).then((r) => r.data);
export const createTodo = (title) => http.post('/todos', { title, done: false }).then((r) => r.data);
export const deleteTodo = (id) => http.del(´/todos/@{id}´);
`;

const PAGE = `// src/components/TodosPage.js — lạc quan + hoàn tác, Load more, Undo khi xoá, cache stale-while-revalidate
import { useEffect, useRef, useState } from 'react';
import { PAGE_SIZE, createTodo, deleteTodo, fetchTodos, updateTodo } from '../api/todos';

let cache = null; // { items, total, page } — sống qua lần unmount/mount của trang (đổi tab)
const UNDO_MS = 1500;

export default function TodosPage() {
  const [items, setItems] = useState(cache?.items ?? []);
  const [total, setTotal] = useState(cache?.total ?? 0);
  const [page, setPage] = useState(cache?.page ?? 1);
  const [status, setStatus] = useState(cache ? 'ready' : 'loading');
  const [refreshing, setRefreshing] = useState(Boolean(cache));
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [title, setTitle] = useState('');
  const [undo, setUndo] = useState(null); // { item, index, timer }
  const [reload, setReload] = useState(0);
  const pagesRef = useRef(cache?.page ?? 1);

  // tải lần đầu / làm mới nền (stale-while-revalidate): có cache thì hiện ngay rồi lấy lại đủ số trang đã xem
  useEffect(() => {
    let ignore = false;
    const pages = pagesRef.current;
    fetchTodos(1, pages * PAGE_SIZE)
      .then(({ items: fresh, total: t }) => {
        if (ignore) return;
        setItems(fresh);
        setTotal(t);
        setStatus('ready');
      })
      .catch((err) => {
        if (ignore) return;
        if (!cache) setStatus('error');
        setError(´Could not load todos (@{err.message})´);
      })
      .finally(() => { if (!ignore) setRefreshing(false); });
    return () => { ignore = true; };
  }, [reload]);

  // ghi cache (bỏ các dòng còn đang chờ server)
  useEffect(() => {
    if (status === 'ready') cache = { items: items.filter((t) => !t.pending), total, page };
  }, [items, total, page, status]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const loadMore = async () => {
    const next = page + 1;
    const { items: more, total: t } = await fetchTodos(next);
    setItems((list) => [...list, ...more.filter((m) => !list.some((x) => x.id === m.id))]);
    setTotal(t);
    setPage(next);
    pagesRef.current = next;
  };

  // SỬA lạc quan: đổi ngay, lỗi thì trả lại
  const toggle = async (todo) => {
    const nextDone = !todo.done;
    setItems((list) => list.map((t) => (t.id === todo.id ? { ...t, done: nextDone } : t)));
    try {
      await updateTodo(todo.id, { done: nextDone });
    } catch {
      setItems((list) => list.map((t) => (t.id === todo.id ? { ...t, done: todo.done } : t)));
      setToast(´Could not update "@{todo.title}"´);
    }
  };

  // THÊM lạc quan: id tạm, thay bằng bản ghi server; lỗi thì gỡ
  const add = async (e) => {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    const tempId = ´tmp-@{Date.now()}´;
    setItems((list) => [{ id: tempId, title: text, done: false, pending: true }, ...list]);
    setTotal((t) => t + 1);
    setTitle('');
    try {
      const saved = await createTodo(text);
      setItems((list) => list.map((t) => (t.id === tempId ? saved : t)));
    } catch {
      setItems((list) => list.filter((t) => t.id !== tempId));
      setTotal((t) => t - 1);
      setToast(´Could not add "@{text}"´);
    }
  };

  // XOÁ có Undo: gỡ khỏi giao diện ngay, gửi DELETE sau UNDO_MS nếu không bị huỷ
  const remove = (todo) => {
    if (undo) clearTimeout(undo.timer);
    const index = items.findIndex((t) => t.id === todo.id);
    setItems((list) => list.filter((t) => t.id !== todo.id));
    setTotal((t) => t - 1);
    const timer = setTimeout(async () => {
      setUndo(null);
      try {
        await deleteTodo(todo.id);
      } catch {
        setItems((list) => [...list.slice(0, index), todo, ...list.slice(index)]);
        setTotal((t) => t + 1);
        setToast(´Could not delete "@{todo.title}"´);
      }
    }, UNDO_MS);
    setUndo({ item: todo, index, timer });
  };

  const undoDelete = () => {
    clearTimeout(undo.timer);
    setItems((list) => [...list.slice(0, undo.index), undo.item, ...list.slice(undo.index)]);
    setTotal((t) => t + 1);
    setUndo(null);
  };

  if (status === 'loading') return <p id="loading">Loading todos…</p>;
  if (status === 'error') {
    return (
      <div>
        <p id="load-error">{error}</p>
        <button id="retry" type="button" onClick={() => { setStatus('loading'); setReload((n) => n + 1); }}>Retry</button>
      </div>
    );
  }

  return (
    <section>
      <form id="new-form" onSubmit={add}>
        <input id="new-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
      <p>
        <span id="count">Showing {items.length} of {total}</span>
        {refreshing && <span id="refreshing">Updating…</span>}
      </p>
      <ul id="todos">
        {items.map((t) => (
          <li key={t.id} className={['todo', t.done ? 'done' : '', t.pending ? 'pending' : ''].filter(Boolean).join(' ')}>
            <input type="checkbox" className="toggle" checked={t.done} disabled={t.pending} onChange={() => toggle(t)} />
            <span className="title">{t.title}</span>
            <button type="button" className="delete" disabled={t.pending} onClick={() => remove(t)}>Delete</button>
          </li>
        ))}
      </ul>
      {items.length < total && <button id="load-more" type="button" onClick={loadMore}>Load more</button>}
      {undo && (
        <div id="undo-bar">
          <span>Deleted "{undo.item.title}"</span>
          <button id="undo" type="button" onClick={undoDelete}>Undo</button>
        </div>
      )}
      {toast && <div id="toast" role="alert">{toast}</div>}
    </section>
  );
}
`;

const APP = `// src/App.js — hai tab: rời tab Todos rồi quay lại ⇒ cache hiện ngay, làm mới chạy nền
import { useState } from 'react';
import TodosPage from './components/TodosPage';

export default function App() {
  const [tab, setTab] = useState('todos');
  return (
    <main>
      <h1>Team Todos</h1>
      <nav className="tabs">
        <button id="tab-todos" type="button" className={tab === 'todos' ? 'active' : ''} onClick={() => setTab('todos')}>Todos</button>{' '}
        <button id="tab-about" type="button" className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>About</button>
      </nav>
      {tab === 'todos' ? <TodosPage /> : <p id="about">A tiny app to practise optimistic UI.</p>}
    </main>
  );
}
`;

const S_PAGE = `// src/components/TodosPage.js — STARTER: chờ server rồi mới cập nhật, tải hết một lần, không xử lý lỗi
import { useEffect, useState } from 'react';

export default function TodosPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9999/todos').then((r) => r.json()).then(setItems);
  }, []);
  const toggle = async (t) => {
    await fetch('http://localhost:9999/todos/' + t.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done: !t.done }) });
    setItems(items.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
  };
  return (
    <ul id="todos">
      {items.map((t) => (
        <li key={t.id} className={t.done ? 'todo done' : 'todo'}>
          <input type="checkbox" className="toggle" checked={t.done} onChange={() => toggle(t)} />
          <span className="title">{t.title}</span>
        </li>
      ))}
    </ul>
  );
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, '.env': ENV, 'src/App.js': APP };
const LOI_GIAI = { 'src/api/http.js': HTTP, 'src/api/todos.js': TODOS_API, 'src/components/TodosPage.js': PAGE, ...CHUNG };
const KHOI_DAU = {
  'src/api/http.js': `// src/api/http.js — STARTER: viết request(method, path, body) + ApiError + http.get/post/patch/del
export const http = {};
export class ApiError extends Error {}
`,
  'src/api/todos.js': `// src/api/todos.js — STARTER: fetchTodos(page, limit) · updateTodo · createTodo · deleteTodo
export const PAGE_SIZE = 5;
`,
  'src/components/TodosPage.js': S_PAGE,
  ...CHUNG,
};

const CHAM = { base: B, db: { todos: TODOS }, treMs: 800 };
const SAU = cho(1100); // chờ lần tải đầu (treMs 800) xong

const KIEM = [
  // f1 http layer
  { nhom: 'f1', moTa: 'Base URL from .env', kiem: 'ma-nguon', tep: 'src/api/http.js', khop: 'process\\.env\\.REACT_APP_API_URL' },
  { nhom: 'f1', moTa: 'Bearer token header when a token is stored', kiem: 'ma-nguon', tep: 'src/api/http.js', khop: 'Authorization\\s*=\\s*´?[`\'"]?Bearer' },
  { nhom: 'f1', moTa: 'ApiError carries the HTTP status', kiem: 'ma-nguon', tep: 'src/api/http.js', khop: 'class\\s+ApiError\\s+extends\\s+Error[\\s\\S]*this\\.status\\s*=' },
  { nhom: 'f1', an: true, moTa: 'Components do not build URLs themselves', kiem: 'ma-nguon', tep: 'src/components/TodosPage.js', khop: 'fetch\\(|localhost:9999', phuDinh: true },
  // f2 pagination
  { nhom: 'f2', moTa: 'First page: 5 newest of 12', kiem: 'danh-sach-text', selector: '#count, .todo .title', mongDoi: ['Showing 5 of 12', 'Task 12', 'Task 11', 'Task 10', 'Task 9', 'Task 8'], truoc: [cho(300)] },
  { nhom: 'f2', moTa: 'Load more appends the next page', kiem: 'text', selector: '#count', giaTri: 'Showing 10 of 12', truoc: [cho(300), click('#load-more'), cho(300)] },
  { nhom: 'f2', moTa: 'Load more disappears at the end', kiem: 'khong-ton-tai', selector: '#load-more', truoc: [cho(300), click('#load-more'), cho(300), click('#load-more'), cho(300)] },
  { nhom: 'f2', an: true, moTa: 'Server-side paging (_page & _limit)', kiem: 'goi-fetch', khop: '/todos\\?.*_page=2.*_limit=5', truoc: [cho(300), click('#load-more'), cho(300)] },
  // f3 optimistic update + rollback
  { nhom: 'f3', moTa: 'Toggle shows immediately (before the server answers)', jsonServer: CHAM, kiem: 'ton-tai', selector: '.todo:nth-child(1).done', truoc: [SAU, click('.todo:nth-child(1) .toggle'), cho(100)] },
  { nhom: 'f3', moTa: 'Server receives the PATCH', kiem: 'du-lieu-server', bang: 'todos', chua: { id: 12, done: true }, chat: true, truoc: [cho(300), click('.todo:nth-child(1) .toggle'), cho(300)] },
  { nhom: 'f3', moTa: 'Failure rolls back and shows a toast', fetchGia: { 'PATCH http://localhost:9999/todos/12': { status: 500, text: 'boom' } }, kiem: 'danh-sach-text', selector: '.todo.done .title, #toast', mongDoi: ['Task 9', 'Could not update "Task 12"'], truoc: [cho(300), click('.todo:nth-child(1) .toggle'), cho(300)] },
  { nhom: 'f3', an: true, moTa: 'Rolled-back checkbox is unchecked again', fetchGia: { 'PATCH http://localhost:9999/todos/12': { status: 500, text: 'boom' } }, kiem: 'thuoc-tinh-js', selector: '.todo:nth-child(1) .toggle', thuocTinh: 'checked', giaTri: false, truoc: [cho(300), click('.todo:nth-child(1) .toggle'), cho(300)] },
  // f4 optimistic create
  { nhom: 'f4', moTa: 'New todo appears at once as pending', jsonServer: CHAM, kiem: 'danh-sach-text', selector: '.todo.pending .title, #count', mongDoi: ['Showing 6 of 13', 'Write report'], truoc: [SAU, nhap('#new-title', 'Write report'), { hanhDong: 'gui', selector: '#new-form' }, cho(100)] },
  { nhom: 'f4', moTa: 'Replaced by the server record (no longer pending)', kiem: 'danh-sach-text', selector: '.todo:nth-child(1) .title, .todo.pending', mongDoi: ['Write report'], truoc: [cho(300), nhap('#new-title', 'Write report'), { hanhDong: 'gui', selector: '#new-form' }, cho(300)] },
  { nhom: 'f4', moTa: 'Saved on the server', kiem: 'du-lieu-server', bang: 'todos', chua: { id: 13, title: 'Write report', done: false }, truoc: [cho(300), nhap('#new-title', 'Write report'), { hanhDong: 'gui', selector: '#new-form' }, cho(300)] },
  { nhom: 'f4', an: true, moTa: 'Failed create is removed with a toast', fetchGia: { 'POST http://localhost:9999/todos': { status: 500, text: 'boom' } }, kiem: 'danh-sach-text', selector: '#count, #toast', mongDoi: ['Showing 5 of 12', 'Could not add "Write report"'], truoc: [cho(300), nhap('#new-title', 'Write report'), { hanhDong: 'gui', selector: '#new-form' }, cho(300)] },
  // f5 delete with undo
  { nhom: 'f5', moTa: 'Delete hides the row and offers Undo', kiem: 'danh-sach-text', selector: '#undo-bar span, #count', mongDoi: ['Showing 4 of 11', 'Deleted "Task 12"'], truoc: [cho(300), click('.todo:nth-child(1) .delete')] },
  { nhom: 'f5', moTa: 'Undo restores the row and sends nothing', kiem: 'goi-fetch', khop: '^DELETE', min: 0, max: 0, truoc: [cho(300), click('.todo:nth-child(1) .delete'), click('#undo'), cho(1800)] },
  { nhom: 'f5', moTa: 'Without Undo the server record is deleted after the delay', kiem: 'du-lieu-server', bang: 'todos', khongChua: { id: 12 }, truoc: [cho(300), click('.todo:nth-child(1) .delete'), cho(1800)] },
  { nhom: 'f5', an: true, moTa: 'Restored row goes back to its place', kiem: 'danh-sach-text', selector: '.todo:nth-child(-n+2) .title', mongDoi: ['Task 12', 'Task 11'], truoc: [cho(300), click('.todo:nth-child(1) .delete'), click('#undo')] },
  // f6 stale-while-revalidate
  { nhom: 'f6', moTa: 'Returning to the tab shows cached data immediately', jsonServer: CHAM, kiem: 'danh-sach-text', selector: '#loading, #count', mongDoi: ['Showing 5 of 12'], truoc: [SAU, click('#tab-about'), click('#tab-todos'), cho(50)] },
  { nhom: 'f6', moTa: 'and revalidates in the background', jsonServer: CHAM, kiem: 'ton-tai', selector: '#refreshing', truoc: [SAU, click('#tab-about'), click('#tab-todos'), cho(50)] },
  { nhom: 'f6', an: true, moTa: 'Background refresh keeps loaded pages', kiem: 'text', selector: '#count', giaTri: 'Showing 10 of 12', truoc: [cho(300), click('#load-more'), cho(300), click('#tab-about'), click('#tab-todos'), cho(400)] },
  // f7 load error + retry
  { nhom: 'f7', moTa: 'Load error message with the status', jsonServer: { base: B, db: {} }, kiem: 'text', selector: '#load-error', giaTri: 'Could not load todos (HTTP 404)', truoc: [cho(300)] },
  { nhom: 'f7', moTa: 'Retry sends the request again', jsonServer: { base: B, db: {} }, kiem: 'goi-fetch', khop: '^GET .*/todos', min: 2, max: 2, truoc: [cho(300), click('#retry'), cho(300)] },
  { nhom: 'f7', an: true, moTa: 'Loading state first', jsonServer: CHAM, kiem: 'text', selector: '#loading', giaTri: 'Loading todos…' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 11: Team Todos — HTTP client layer & optimistic UI', vi: 'DEEP LAB 11: Team Todos — lớp HTTP client & giao diện lạc quan' },
  phu: { en: 'FER202 · Chapter 11 (deep) · Suggested time: 140 minutes · Total: 10 marks', vi: 'FER202 · Chương 11 (chuyên sâu) · Thời gian gợi ý: 140 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Real apps feel fast because they do not wait for the server. Build a todo list on json-server with a proper <b>HTTP layer</b> (<code>src/api/http.js</code>), server-side <b>"Load more"</b> pagination, <b>optimistic</b> toggling and creating that roll back with a toast when the server fails, deletion with a short <b>Undo</b> window before the request is sent, and a <b>stale-while-revalidate</b> cache so returning to the tab shows data instantly while it refreshes in the background.</p>',
    vi: '<p>Ứng dụng thật có cảm giác nhanh vì chúng không chờ server. Dựng danh sách việc trên json-server với <b>lớp HTTP</b> đàng hoàng (<code>src/api/http.js</code>), phân trang <b>"Load more"</b> phía server, bật/tắt và thêm mới <b>lạc quan</b> có hoàn tác kèm toast khi server lỗi, xoá có khoảng <b>Undo</b> ngắn trước khi gửi request, và cache <b>stale-while-revalidate</b> để quay lại tab là thấy dữ liệu ngay trong khi làm mới chạy nền.</p>',
  },
  chucNangChinh: [{ en: 'HTTP layer · Load more · optimistic update & create with rollback · delete with Undo · SWR cache · error + retry.', vi: 'Lớp HTTP · Load more · sửa & thêm lạc quan có hoàn tác · xoá có Undo · cache SWR · lỗi + thử lại.' }],
  yeuCauChung: [
    { en: 'Only <code>src/api/*</code> knows URLs; components call <code>fetchTodos / updateTodo / createTodo / deleteTodo</code>.', vi: 'Chỉ <code>src/api/*</code> biết URL; component gọi <code>fetchTodos / updateTodo / createTodo / deleteTodo</code>.' },
    { en: 'List order: newest first (<code>_sort=id&amp;_order=desc</code>), 5 per page, total from <code>X-Total-Count</code>.', vi: 'Thứ tự: mới nhất trước (<code>_sort=id&amp;_order=desc</code>), 5 mỗi trang, tổng lấy từ <code>X-Total-Count</code>.' },
  ],
  cayThuMuc: `
.env                         # REACT_APP_API_URL=http://localhost:9999 (given)
src/
├── api/
│   ├── http.js              # request · ApiError · http.get/post/patch/del
│   └── todos.js             # fetchTodos(page, limit) · updateTodo · createTodo · deleteTodo
├── components/TodosPage.js  # the whole feature
├── App.js                   # tabs Todos / About (given)
└── index.css (given)`,
  wireframe: `
+-------------------------------------------------------------+
| Team Todos      [Todos] [About]                             |
| [New todo                ] [Add]                            |
| Showing 5 of 12   Updating…                                 |
| [x] Task 12 (strikethrough)                      [Delete]   |
| [ ] Task 11                                      [Delete]   |
| …                                                           |
| [Load more]                                                 |
| | Deleted "Task 10"  [Undo] |              | Could not … |  |
+-------------------------------------------------------------+`,
  moHinh: {
    ten: 'todos (json-server)',
    truong: [
      ['id', 'number', { en: 'temporary id "tmp-…" while a create is pending', vi: 'id tạm "tmp-…" khi đang chờ tạo' }],
      ['title', 'string', ''],
      ['done', 'boolean', ''],
    ],
  },
  chucNang: [
    { ten: { en: 'HTTP layer', vi: 'Lớp HTTP' }, diem: 1.5, yeuCau: [{ en: '<code>request(method, path, body)</code>: base URL from <code>process.env.REACT_APP_API_URL</code>, JSON headers, <code>Authorization: Bearer &lt;token&gt;</code> when localStorage has <code>token</code>, non-2xx ⇒ <code>throw new ApiError(status, "HTTP 404")</code>, returns <code>{ data, total }</code> (from <code>X-Total-Count</code>).', vi: '<code>request(method, path, body)</code>: base URL từ <code>process.env.REACT_APP_API_URL</code>, header JSON, <code>Authorization: Bearer &lt;token&gt;</code> khi localStorage có <code>token</code>, không phải 2xx ⇒ <code>throw new ApiError(status, "HTTP 404")</code>, trả <code>{ data, total }</code> (từ <code>X-Total-Count</code>).' }] },
    { ten: { en: 'Load more', vi: 'Load more' }, diem: 1.5, yeuCau: [{ en: '<code>#count</code> <code>Showing 5 of 12</code>; <code>#load-more</code> fetches the next page and appends; hidden when everything is shown.', vi: '<code>#count</code> <code>Showing 5 of 12</code>; <code>#load-more</code> tải trang kế và nối thêm; ẩn khi đã hiện hết.' }] },
    { ten: { en: 'Optimistic update', vi: 'Sửa lạc quan' }, diem: 2, yeuCau: [{ en: '<code>.toggle</code> flips <code>.done</code> immediately, then PATCHes. On failure: restore the previous value and show <code>#toast</code> <code>Could not update "Task 12"</code>.', vi: '<code>.toggle</code> đổi <code>.done</code> ngay, rồi PATCH. Lỗi: trả giá trị cũ và hiện <code>#toast</code> <code>Could not update "Task 12"</code>.' }], viDu: { en: 'server answers 500 ⇒ checkbox jumps back, toast appears', vi: 'server trả 500 ⇒ ô chọn bật lại như cũ, hiện toast' } },
    { ten: { en: 'Optimistic create', vi: 'Thêm lạc quan' }, diem: 1.5, yeuCau: [{ en: '<code>#new-form</code> / <code>#new-title</code>: insert a <code>.pending</code> row with a temporary id at the top (count +1), replace it with the server record when the POST succeeds; on failure remove it and toast <code>Could not add "…"</code>.', vi: '<code>#new-form</code> / <code>#new-title</code>: chèn dòng <code>.pending</code> có id tạm lên đầu (đếm +1), thay bằng bản ghi server khi POST thành công; lỗi thì gỡ và toast <code>Could not add "…"</code>.' }] },
    { ten: { en: 'Delete with Undo', vi: 'Xoá có Undo' }, diem: 1.5, yeuCau: [{ en: '<code>.delete</code> removes the row at once and shows <code>#undo-bar</code> (<code>Deleted "Task 12"</code> + <code>#undo</code>) for 1.5 s; Undo puts it back in place and no request is sent; otherwise DELETE is sent when the time is up.', vi: '<code>.delete</code> gỡ dòng ngay và hiện <code>#undo-bar</code> (<code>Deleted "Task 12"</code> + <code>#undo</code>) trong 1,5 s; Undo đặt lại đúng chỗ và không gửi request; không thì gửi DELETE khi hết giờ.' }] },
    { ten: { en: 'Stale-while-revalidate', vi: 'Stale-while-revalidate' }, diem: 1, yeuCau: [{ en: 'A module-level cache keeps <code>{ items, total, page }</code>; returning from <code>#tab-about</code> renders cached rows instantly (no <code>#loading</code>) with <code>#refreshing</code> <code>Updating…</code> while all loaded pages are fetched again.', vi: 'Cache cấp module giữ <code>{ items, total, page }</code>; quay lại từ <code>#tab-about</code> vẽ ngay dữ liệu cache (không <code>#loading</code>) kèm <code>#refreshing</code> <code>Updating…</code> trong lúc tải lại đủ các trang đã xem.' }] },
    { ten: { en: 'Load error & retry', vi: 'Lỗi tải & thử lại' }, diem: 1, yeuCau: [{ en: '<code>#loading</code> <code>Loading todos…</code>; failure ⇒ <code>#load-error</code> <code>Could not load todos (HTTP 404)</code> + <code>#retry</code>.', vi: '<code>#loading</code> <code>Loading todos…</code>; lỗi ⇒ <code>#load-error</code> <code>Could not load todos (HTTP 404)</code> + <code>#retry</code>.' }] },
  ],
  idBatBuoc: [
    ['#tab-todos · #tab-about', { en: 'tabs (given)', vi: 'tab (có sẵn)' }],
    ['#new-form · #new-title · #count · #refreshing · #load-more', { en: 'list controls', vi: 'điều khiển danh sách' }],
    ['.todo(.done/.pending) · .toggle · .title · .delete', { en: 'rows', vi: 'dòng' }],
    ['#undo-bar · #undo · #toast · #loading · #load-error · #retry', { en: 'feedback', vi: 'phản hồi' }],
  ],
  truDiem: [
    { en: 'Waiting for the server before updating the checkbox (sluggish UI).', vi: 'Chờ server xong mới đổi ô chọn (giao diện ì).' },
    { en: 'Optimistic update without rollback — the screen lies after a failure.', vi: 'Cập nhật lạc quan mà không hoàn tác — màn hình "nói dối" sau khi lỗi.' },
    { en: 'Sending DELETE immediately and "undoing" with a POST — the record gets a new id.', vi: 'Gửi DELETE ngay rồi "hoàn tác" bằng POST — bản ghi có id mới.' },
    { en: '<code>fetch(\'http://localhost:9999/…\')</code> scattered in components.', vi: '<code>fetch(\'http://localhost:9999/…\')</code> rải trong component.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-11-deep-optimistic-todos',
  ten: 'Deep Lab 11 — Team Todos (HTTP layer · optimistic UI)',
  khoa: KHOA,
  baiHoc: 'fer202-11-2-axios-json-server',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 11 — Team Todos (HTTP layer · Load more · optimistic updates · Undo · SWR cache)', vi: 'Deep Lab 11 — Team Todos (lớp HTTP · Load more · cập nhật lạc quan · Undo · cache SWR)' },
      doKho: 'HARD',
      phut: 140,
      diem: 100,
      khaiNiem: ['API client layer', 'environment variables', 'server-side pagination', 'optimistic updates & rollback', 'temporary ids', 'delayed delete with undo', 'stale-while-revalidate'],
      tienQuyet: ['Lab 11 — Contact manager', '11.2 axios & json-server'],
      the: ['fer202', 'deep-lab', 'http', 'optimistic-ui'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'optimistic UI', vi: 'giao diện lạc quan: cập nhật trước, xác nhận với server sau' },
        { en: 'rollback', vi: 'hoàn tác về trạng thái trước khi lỗi' },
        { en: 'stale-while-revalidate', vi: 'hiện dữ liệu cũ ngay, lấy dữ liệu mới ở nền' },
        { en: 'temporary id', vi: 'id tạm cho bản ghi chưa được server tạo' },
        ...tn('rubric'),
      ],
      goiY: [
        'Lạc quan: lưu giá trị cũ trong biến (todo.done) TRƯỚC khi setItems; catch ⇒ setItems trả lại giá trị đó.',
        'Thêm: tempId = ´tmp-@{Date.now()}´; thành công ⇒ map thay dòng tempId bằng saved; lỗi ⇒ filter bỏ.',
        'Undo: setTimeout(DELETE, 1500) lưu timer trong state; Undo ⇒ clearTimeout + chèn lại ở index cũ.',
        'SWR: let cache = null ngoài component; useState(cache?.items ?? []); có cache ⇒ status "ready" + refreshing = true.',
      ],
      loiHayGap: [
        'Hoàn tác bằng cách đảo lại (<code>!done</code>) thay vì trả giá trị cũ ⇒ sai khi bấm hai lần liên tiếp.',
        'Dùng <code>items</code> từ closure trong catch ⇒ ghi đè mất các thay đổi khác xảy ra trong lúc chờ; dùng setState dạng hàm.',
        'Dòng tạm (pending) vẫn cho bấm Delete ⇒ gửi DELETE /todos/tmp-… lỗi 404.',
        'Ghi cache cả dòng pending ⇒ quay lại tab thấy dòng "ma".',
      ],
      moTaNgan: 'Deep lab chương 11: lớp http.js (.env, token, ApiError, X-Total-Count), Load more phía server, sửa/thêm lạc quan có hoàn tác + toast, xoá có Undo trì hoãn request, cache stale-while-revalidate, lỗi + thử lại. Thang 10.',
      giaiThich: '<p>Mọi URL nằm sau một lớp <code>http</code> duy nhất nên đổi server, thêm token hay xử lý lỗi chỉ sửa một chỗ. Cập nhật lạc quan = sửa state ngay, gửi request, và nếu thất bại thì <b>khôi phục giá trị đã lưu</b> (không "đảo lại") rồi báo người dùng. Xoá có Undo trì hoãn request thật thay vì xoá rồi tạo lại. Cache cấp module cho phép hiện dữ liệu ngay khi component mount lại, còn effect làm mới chạy nền — đúng mô hình mà SWR/React Query tự động hoá.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', jsonServer: { base: B, db: { todos: TODOS } }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
    },
  ],
});
