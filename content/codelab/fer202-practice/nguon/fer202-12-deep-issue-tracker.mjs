/**
 * FER202 · Chương 12 — DEEP LAB: Issue Tracker (Redux Toolkit chuyên sâu).
 * Sâu hơn Lab 12: dữ liệu CHUẨN HOÁ bằng createEntityAdapter (ids + entities, sortComparer), selector của adapter,
 * createSelector nối quan hệ (assignee) và nhóm theo cột, thunk cập nhật LẠC QUAN với hoàn tác ở rejected (meta.arg),
 * createListenerMiddleware cho tác dụng phụ (nhật ký hoạt động, lưu bộ lọc) thay vì nhét vào component/reducer.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const USERS = [{ id: 1, name: 'An' }, { id: 2, name: 'Binh' }, { id: 3, name: 'Cuong' }];
const ISSUES = [
  { id: 1, key: 'CT-1', title: 'Login page', status: 'todo', assigneeId: 1, priority: 2 },
  { id: 2, key: 'CT-2', title: 'Fix 500 on save', status: 'doing', assigneeId: 2, priority: 1 },
  { id: 3, key: 'CT-3', title: 'Write tests', status: 'todo', assigneeId: 3, priority: 3 },
  { id: 4, key: 'CT-4', title: 'Deploy staging', status: 'done', assigneeId: 1, priority: 2 },
  { id: 5, key: 'CT-5', title: 'Review PR', status: 'doing', assigneeId: 1, priority: 2 },
];

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f1f5f9; color: #0f172a; }
.filters { display: flex; gap: 8px; margin-bottom: 12px; }
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.column { background: #e2e8f0; border-radius: 10px; padding: 10px; } .column h2 { font-size: 15px; margin: 0 0 8px; }
.card { background: #fff; border-radius: 8px; padding: 8px; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.card .key { font-weight: 700; margin-right: 6px; } .card .assignee { color: #475569; font-size: 13px; display: block; }
#error { color: #b91c1c; } #activity { font-size: 13px; color: #334155; }
`;

const API = `// src/app/api.js (đã cho)
const BASE = 'http://localhost:9999';
async function call(path, options) {
  const res = await fetch(BASE + path, options);
  if (!res.ok) throw new Error(´HTTP @{res.status}´);
  return res.json();
}
export const api = {
  issues: () => call('/issues'),
  users: () => call('/users'),
  patchIssue: (id, patch) => call(´/issues/@{id}´, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }),
};
`;

const ISSUES_SLICE = `// src/features/issues/issuesSlice.js — entity adapter + thunk cập nhật lạc quan
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/api';

export const NEXT = { todo: 'doing', doing: 'done' };

const adapter = createEntityAdapter({
  // thứ tự ổn định: ưu tiên cao (số nhỏ) trước, rồi theo id
  sortComparer: (a, b) => a.priority - b.priority || a.id - b.id,
});

export const fetchIssues = createAsyncThunk('issues/fetch', () => api.issues());

// arg = { id, from, to }: pending đổi ngay, rejected trả về "from"
export const moveIssue = createAsyncThunk('issues/move', ({ id, to }) => api.patchIssue(id, { status: to }));

const issuesSlice = createSlice({
  name: 'issues',
  initialState: adapter.getInitialState({ status: 'idle', error: null }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(moveIssue.pending, (state, action) => {
        const { id, to } = action.meta.arg;
        adapter.updateOne(state, { id, changes: { status: to } }); // lạc quan
        state.error = null;
      })
      .addCase(moveIssue.fulfilled, (state, action) => {
        adapter.upsertOne(state, action.payload);
      })
      .addCase(moveIssue.rejected, (state, action) => {
        const { id, from } = action.meta.arg;
        adapter.updateOne(state, { id, changes: { status: from } }); // hoàn tác
        state.error = ´Could not move @{state.entities[id]?.key}´;
      });
  },
});

export const { selectAll: selectAllIssues, selectById: selectIssueById, selectTotal: selectIssueCount } =
  adapter.getSelectors((state) => state.issues);

export default issuesSlice.reducer;
`;

const USERS_SLICE = `// src/features/users/usersSlice.js — người dùng cũng chuẩn hoá bằng adapter
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/api';

const adapter = createEntityAdapter();

export const fetchUsers = createAsyncThunk('users/fetch', () => api.users());

const usersSlice = createSlice({
  name: 'users',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      adapter.setAll(state, action.payload);
    });
  },
});

export const { selectAll: selectAllUsers, selectEntities: selectUserEntities } = adapter.getSelectors((state) => state.users);
export default usersSlice.reducer;
`;

const FILTERS_SLICE = `// src/features/filters/filtersSlice.js — bộ lọc (khôi phục từ localStorage khi khởi động)
import { createSlice } from '@reduxjs/toolkit';

export const DEFAULT_FILTERS = { assigneeId: 'all', text: '' };

export function loadFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem('filters'));
    return saved && typeof saved === 'object' ? { ...DEFAULT_FILTERS, ...saved } : DEFAULT_FILTERS;
  } catch {
    return DEFAULT_FILTERS;
  }
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: loadFilters,
  reducers: {
    assigneeChanged(state, action) { state.assigneeId = action.payload; },
    textChanged(state, action) { state.text = action.payload; },
    filtersCleared() { return DEFAULT_FILTERS; },
  },
});

export const { assigneeChanged, textChanged, filtersCleared } = filtersSlice.actions;
export default filtersSlice.reducer;
`;

const ACTIVITY_SLICE = `// src/features/activity/activitySlice.js — nhật ký (do listener ghi, không phải component)
import { createSlice } from '@reduxjs/toolkit';

const activitySlice = createSlice({
  name: 'activity',
  initialState: [],
  reducers: {
    activityAdded(state, action) {
      state.unshift(action.payload);
      if (state.length > 5) state.pop();
    },
  },
});

export const { activityAdded } = activitySlice.actions;
export default activitySlice.reducer;
`;

const SELECTORS = `// src/app/selectors.js — selector có ghi nhớ: lọc + nối tên người + nhóm theo cột
import { createSelector } from '@reduxjs/toolkit';
import { selectAllIssues } from '../features/issues/issuesSlice';
import { selectUserEntities } from '../features/users/usersSlice';

const selectFilters = (state) => state.filters;

export const selectVisibleIssues = createSelector([selectAllIssues, selectUserEntities, selectFilters], (issues, users, f) => {
  const text = f.text.trim().toLowerCase();
  return issues
    .filter((i) => f.assigneeId === 'all' || String(i.assigneeId) === String(f.assigneeId))
    .filter((i) => !text || i.title.toLowerCase().includes(text) || i.key.toLowerCase().includes(text))
    .map((i) => ({ ...i, assigneeName: users[i.assigneeId]?.name ?? 'Unassigned' }));
});

export const STATUSES = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

export const selectColumns = createSelector([selectVisibleIssues], (issues) =>
  STATUSES.map((s) => ({ ...s, issues: issues.filter((i) => i.status === s.id) })),
);
`;

const STORE = `// src/app/store.js — listener middleware cho tác dụng phụ: nhật ký hoạt động + lưu bộ lọc
import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import issuesReducer, { moveIssue } from '../features/issues/issuesSlice';
import usersReducer from '../features/users/usersSlice';
import filtersReducer, { assigneeChanged, filtersCleared, textChanged } from '../features/filters/filtersSlice';
import activityReducer, { activityAdded } from '../features/activity/activitySlice';

const listener = createListenerMiddleware();

// chuyển trạng thái thành công ⇒ ghi nhật ký
listener.startListening({
  actionCreator: moveIssue.fulfilled,
  effect: (action, api) => {
    const { from, to } = action.meta.arg;
    api.dispatch(activityAdded(´@{action.payload.key}: @{from} → @{to}´));
  },
});

// đổi bộ lọc ⇒ lưu localStorage (tác dụng phụ KHÔNG nằm trong reducer)
listener.startListening({
  matcher: isAnyOf(assigneeChanged, textChanged, filtersCleared),
  effect: (_action, api) => {
    localStorage.setItem('filters', JSON.stringify(api.getState().filters));
  },
});

export const store = configureStore({
  reducer: { issues: issuesReducer, users: usersReducer, filters: filtersReducer, activity: activityReducer },
  middleware: (getDefault) => getDefault().prepend(listener.middleware),
});
`;

const APP = `// src/App.js — bảng 3 cột đọc từ selector; nút chuyển trạng thái dispatch thunk lạc quan
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NEXT, fetchIssues, moveIssue, selectIssueCount } from './features/issues/issuesSlice';
import { fetchUsers, selectAllUsers } from './features/users/usersSlice';
import { assigneeChanged, filtersCleared, textChanged } from './features/filters/filtersSlice';
import { STATUSES, selectColumns } from './app/selectors';

const LABEL = Object.fromEntries(STATUSES.map((s) => [s.id, s.label]));

function Card({ issue }) {
  const dispatch = useDispatch();
  const to = NEXT[issue.status];
  return (
    <div className="card" data-key={issue.key}>
      <span className="key">{issue.key}</span>
      <span className="title">{issue.title}</span>
      <span className="assignee">{issue.assigneeName}</span>
      {to && (
        <button type="button" className="move-next" onClick={() => dispatch(moveIssue({ id: issue.id, from: issue.status, to }))}>
          → {LABEL[to]}
        </button>
      )}
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const total = useSelector(selectIssueCount);
  const users = useSelector(selectAllUsers);
  const filters = useSelector((s) => s.filters);
  const { status, error } = useSelector((s) => s.issues);
  const activity = useSelector((s) => s.activity);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchIssues());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') return <p id="loading">Loading issues…</p>;
  if (status === 'failed') return <p id="load-error">Could not load issues ({error})</p>;

  return (
    <main>
      <h1>CT Issues <small id="total">{total} issues</small></h1>
      <div className="filters">
        <select id="filter-assignee" value={filters.assigneeId} onChange={(e) => dispatch(assigneeChanged(e.target.value))}>
          <option value="all">Everyone</option>
          {users.map((u) => <option key={u.id} value={String(u.id)}>{u.name}</option>)}
        </select>
        <input id="filter-text" value={filters.text} onChange={(e) => dispatch(textChanged(e.target.value))} placeholder="Search" />
        <button id="clear-filters" type="button" onClick={() => dispatch(filtersCleared())}>Clear</button>
      </div>
      {error && <p id="error">{error}</p>}
      <div className="board">
        {columns.map((col) => (
          <section key={col.id} className="column" data-status={col.id}>
            <h2>{col.label} ({col.issues.length})</h2>
            {col.issues.map((i) => <Card key={i.id} issue={i} />)}
          </section>
        ))}
      </div>
      <ul id="activity">{activity.map((a, idx) => <li key={idx + a}>{a}</li>)}</ul>
    </main>
  );
}
`;

const S_APP = `// src/App.js — STARTER: mảng lồng trong một slice, lọc trong component, cập nhật chờ server
import { useEffect, useState } from 'react';

export default function App() {
  const [issues, setIssues] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9999/issues').then((r) => r.json()).then(setIssues);
  }, []);
  return (
    <main>
      <h1>CT Issues</h1>
      {issues.map((i) => <div key={i.id} className="card"><span className="key">{i.key}</span></div>)}
    </main>
  );
}
`;
const stub = (p, mo) => `// ${p} — STARTER
// ${mo}
export default function reducer(state = {}) {
  return state;
}
`;

const INDEX = index({ redux: './app/store' }).replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/app/api.js': API };
const LOI_GIAI = {
  'src/App.js': APP, 'src/app/store.js': STORE, 'src/app/selectors.js': SELECTORS,
  'src/features/issues/issuesSlice.js': ISSUES_SLICE, 'src/features/users/usersSlice.js': USERS_SLICE,
  'src/features/filters/filtersSlice.js': FILTERS_SLICE, 'src/features/activity/activitySlice.js': ACTIVITY_SLICE, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/app/store.js': `// src/app/store.js — STARTER
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({ reducer: { placeholder: (s = {}) => s } });
`,
  'src/app/selectors.js': `// src/app/selectors.js — STARTER: selectVisibleIssues · selectColumns (createSelector)
export {};
`,
  'src/features/issues/issuesSlice.js': stub('src/features/issues/issuesSlice.js', 'createEntityAdapter({ sortComparer }) · fetchIssues · moveIssue (lạc quan + hoàn tác) · selectors'),
  'src/features/users/usersSlice.js': stub('src/features/users/usersSlice.js', 'createEntityAdapter · fetchUsers · selectAllUsers · selectUserEntities'),
  'src/features/filters/filtersSlice.js': stub('src/features/filters/filtersSlice.js', 'assigneeChanged · textChanged · filtersCleared · initialState từ localStorage "filters"'),
  'src/features/activity/activitySlice.js': stub('src/features/activity/activitySlice.js', 'activityAdded (mới nhất trước, tối đa 5)'),
  ...CHUNG,
};

const KIEM = [
  // f1 normalized store
  { nhom: 'f1', moTa: 'Issues load into the store', kiem: 'text', selector: '#total', giaTri: '5 issues', truoc: [cho()] },
  { nhom: 'f1', moTa: 'Loading state first', jsonServer: { base: B, db: { issues: ISSUES, users: USERS }, treMs: 900 }, kiem: 'text', selector: '#loading', giaTri: 'Loading issues…' },
  { nhom: 'f1', an: true, moTa: 'createEntityAdapter with a sortComparer', kiem: 'ma-nguon', tep: 'src/features/issues/issuesSlice.js', khop: 'createEntityAdapter\\(\\s*\\{[\\s\\S]*sortComparer' },
  { nhom: 'f1', an: true, moTa: 'Adapter selectors exported', kiem: 'ma-nguon', tep: 'src/features/issues/issuesSlice.js', khop: 'getSelectors\\(' },
  // f2 columns
  { nhom: 'f2', moTa: 'Three columns with counts', kiem: 'danh-sach-text', selector: '.column h2', mongDoi: ['To do (2)', 'In progress (2)', 'Done (1)'], truoc: [cho()] },
  { nhom: 'f2', moTa: 'Cards sorted by priority within a column', kiem: 'danh-sach-text', selector: '.column[data-status="doing"] .card .key', mongDoi: ['CT-2', 'CT-5'], truoc: [cho()] },
  { nhom: 'f2', moTa: 'Assignee names joined from users', kiem: 'danh-sach-text', selector: '.column[data-status="todo"] .assignee', mongDoi: ['An', 'Cuong'], truoc: [cho()] },
  { nhom: 'f2', an: true, moTa: 'Done cards have no move button', kiem: 'khong-ton-tai', selector: '.column[data-status="done"] .move-next', truoc: [cho()] },
  // f3 optimistic move
  { nhom: 'f3', moTa: 'Move is optimistic (card jumps before the server answers)', jsonServer: { base: B, db: { issues: ISSUES, users: USERS }, treMs: 700 }, kiem: 'danh-sach-text', selector: '.column[data-status="doing"] .card .key', mongDoi: ['CT-2', 'CT-1', 'CT-5'], truoc: [cho(1000), click('.card[data-key="CT-1"] .move-next'), cho(100)] },
  { nhom: 'f3', moTa: 'Server updated', kiem: 'du-lieu-server', bang: 'issues', chua: { id: 1, status: 'doing' }, truoc: [cho(), click('.card[data-key="CT-1"] .move-next'), cho()] },
  { nhom: 'f3', moTa: 'Failure rolls the card back with an error', fetchGia: { 'PATCH http://localhost:9999/issues/1': { status: 500, text: 'boom' } }, kiem: 'danh-sach-text', selector: '#error, .column[data-status="todo"] .card .key', mongDoi: ['Could not move CT-1', 'CT-1', 'CT-3'], truoc: [cho(), click('.card[data-key="CT-1"] .move-next'), cho()] },
  { nhom: 'f3', an: true, moTa: 'Rollback uses meta.arg in the rejected case', kiem: 'ma-nguon', tep: 'src/features/issues/issuesSlice.js', khop: 'moveIssue\\.rejected[\\s\\S]*meta\\.arg' },
  // f4 filters + memoized selectors
  { nhom: 'f4', moTa: 'Filter by assignee', kiem: 'danh-sach-text', selector: '.card .key', mongDoi: ['CT-1', 'CT-5', 'CT-4'], truoc: [cho(), { hanhDong: 'doi', selector: '#filter-assignee', giaTri: '1' }] },
  { nhom: 'f4', moTa: 'Search by text', kiem: 'danh-sach-text', selector: '.card .key', mongDoi: ['CT-3'], truoc: [cho(), nhap('#filter-text', 'test')] },
  { nhom: 'f4', moTa: 'Column counts follow the filter', kiem: 'danh-sach-text', selector: '.column h2', mongDoi: ['To do (1)', 'In progress (1)', 'Done (1)'], truoc: [cho(), { hanhDong: 'doi', selector: '#filter-assignee', giaTri: '1' }] },
  { nhom: 'f4', an: true, moTa: 'createSelector used for visible issues', kiem: 'ma-nguon', tep: 'src/app/selectors.js', khop: 'createSelector\\(' },
  // f5 listener: activity
  { nhom: 'f5', moTa: 'Successful move logs an activity entry', kiem: 'danh-sach-text', selector: '#activity li', mongDoi: ['CT-1: todo → doing'], truoc: [cho(), click('.card[data-key="CT-1"] .move-next'), cho()] },
  { nhom: 'f5', moTa: 'Newest entry first', kiem: 'danh-sach-text', selector: '#activity li', mongDoi: ['CT-1: doing → done', 'CT-1: todo → doing'], truoc: [cho(), click('.card[data-key="CT-1"] .move-next'), cho(), click('.card[data-key="CT-1"] .move-next'), cho()] },
  { nhom: 'f5', an: true, moTa: 'Failed move logs nothing', fetchGia: { 'PATCH http://localhost:9999/issues/1': { status: 500, text: 'boom' } }, kiem: 'so-luong', selector: '#activity li', giaTri: 0, truoc: [cho(), click('.card[data-key="CT-1"] .move-next'), cho()] },
  { nhom: 'f5', an: true, moTa: 'Uses createListenerMiddleware', kiem: 'ma-nguon', tep: 'src/app/store.js', khop: 'createListenerMiddleware\\(\\)[\\s\\S]*startListening' },
  // f6 listener: persist filters
  { nhom: 'f6', moTa: 'Filters saved to localStorage', kiem: 'kho-cuc-bo', khoa: 'filters', khop: '^\\{"assigneeId":"2","text":""\\}$', truoc: [cho(), { hanhDong: 'doi', selector: '#filter-assignee', giaTri: '2' }] },
  { nhom: 'f6', moTa: 'Filters restored after reload', kiem: 'danh-sach-text', selector: '.card .key', mongDoi: ['CT-2'], truoc: [cho(), { hanhDong: 'doi', selector: '#filter-assignee', giaTri: '2' }, { hanhDong: 'tai-lai' }, cho()] },
  { nhom: 'f6', an: true, moTa: 'Clear resets and saves the defaults', kiem: 'kho-cuc-bo', khoa: 'filters', khop: '^\\{"assigneeId":"all","text":""\\}$', truoc: [cho(), nhap('#filter-text', 'x'), click('#clear-filters')] },
  { nhom: 'f6', an: true, moTa: 'No localStorage writes inside reducers', kiem: 'ma-nguon', tep: 'src/features/filters/filtersSlice.js', khop: 'localStorage\\.setItem', phuDinh: true },
  // f7 error state
  { nhom: 'f7', moTa: 'Load error', jsonServer: { base: B, db: { users: USERS } }, kiem: 'text', selector: '#load-error', giaTri: 'Could not load issues (HTTP 404)', truoc: [cho()] },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 12: Issue Tracker — Redux Toolkit in depth', vi: 'DEEP LAB 12: Theo dõi công việc — Redux Toolkit chuyên sâu' },
  phu: { en: 'FER202 · Chapter 12 (deep) · Suggested time: 140 minutes · Total: 10 marks', vi: 'FER202 · Chương 12 (chuyên sâu) · Thời gian gợi ý: 140 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>A three-column issue board (To do · In progress · Done) built the way large Redux apps are built: <b>normalised</b> data with <code>createEntityAdapter</code>, <b>memoised selectors</b> that join users and group issues into columns, an <b>optimistic</b> "move" thunk that rolls back from <code>meta.arg</code> when the server fails, and side effects — an activity log and saving filters — handled by <code>createListenerMiddleware</code> instead of components or reducers.</p>',
    vi: '<p>Bảng công việc ba cột (To do · In progress · Done) dựng theo cách các ứng dụng Redux lớn làm: dữ liệu <b>chuẩn hoá</b> bằng <code>createEntityAdapter</code>, <b>selector có ghi nhớ</b> nối tên người và nhóm công việc theo cột, thunk "chuyển cột" <b>lạc quan</b> hoàn tác từ <code>meta.arg</code> khi server lỗi, và tác dụng phụ — nhật ký hoạt động, lưu bộ lọc — do <code>createListenerMiddleware</code> lo thay vì component hay reducer.</p>',
  },
  chucNangChinh: [{ en: 'Entity adapters · board columns · optimistic move with rollback · filters + memoised selectors · listener activity log · persisted filters · error state.', vi: 'Entity adapter · cột bảng · chuyển cột lạc quan có hoàn tác · bộ lọc + selector ghi nhớ · nhật ký qua listener · lưu bộ lọc · trạng thái lỗi.' }],
  yeuCauChung: [
    { en: 'Slices: <code>issues</code>, <code>users</code> (both entity adapters), <code>filters</code>, <code>activity</code>. Given: <code>src/app/api.js</code>.', vi: 'Slice: <code>issues</code>, <code>users</code> (đều dùng entity adapter), <code>filters</code>, <code>activity</code>. Có sẵn: <code>src/app/api.js</code>.' },
    { en: 'No side effects in reducers; components only read selectors and dispatch.', vi: 'Không có tác dụng phụ trong reducer; component chỉ đọc selector và dispatch.' },
  ],
  cayThuMuc: `
src/
├── app/
│   ├── api.js               # (given)
│   ├── store.js             # configureStore + listener middleware
│   └── selectors.js         # selectVisibleIssues · selectColumns
├── features/
│   ├── issues/issuesSlice.js     # adapter · fetchIssues · moveIssue
│   ├── users/usersSlice.js       # adapter · fetchUsers
│   ├── filters/filtersSlice.js   # assigneeChanged · textChanged · filtersCleared
│   └── activity/activitySlice.js # activityAdded
├── App.js
└── index.css (given)`,
  wireframe: `
+----------------------------------------------------------------------+
| CT Issues  5 issues                                                   |
| [Everyone v] [Search      ] [Clear]                                   |
| +- To do (2) ------+ +- In progress (2) --+ +- Done (1) ---------+    |
| | CT-1 Login page  | | CT-2 Fix 500 …     | | CT-4 Deploy …      |    |
| | An   [→ In prog.]| | Binh   [→ Done]    | | An                 |    |
| | CT-3 Write tests | | CT-5 Review PR     | +--------------------+    |
| +------------------+ +--------------------+                           |
| • CT-1: todo → doing                                     (#activity)  |
+----------------------------------------------------------------------+`,
  moHinh: {
    ten: 'State shape',
    truong: [
      ['issues', '{ ids, entities, status, error }', { en: 'sorted by priority, then id', vi: 'sắp theo priority rồi id' }],
      ['users', '{ ids, entities }', ''],
      ['filters', "{ assigneeId: 'all' | '1'…, text }", { en: 'localStorage "filters"', vi: 'localStorage "filters"' }],
      ['activity', 'string[]', { en: 'newest first, max 5', vi: 'mới nhất trước, tối đa 5' }],
    ],
  },
  duLieuMau: JSON.stringify({ issues: ISSUES, users: USERS }, null, 1),
  chucNang: [
    { ten: { en: 'Normalised store', vi: 'Store chuẩn hoá' }, diem: 1.5, yeuCau: [{ en: '<code>createEntityAdapter({ sortComparer })</code> for issues (priority, then id) and users; <code>fetchIssues</code>/<code>fetchUsers</code> thunks; <code>#loading</code>; <code>#total</code> <code>5 issues</code> via <code>selectTotal</code>.', vi: '<code>createEntityAdapter({ sortComparer })</code> cho issues (priority, rồi id) và users; thunk <code>fetchIssues</code>/<code>fetchUsers</code>; <code>#loading</code>; <code>#total</code> <code>5 issues</code> qua <code>selectTotal</code>.' }] },
    { ten: { en: 'Board columns', vi: 'Các cột' }, diem: 1.5, yeuCau: [{ en: '<code>section.column[data-status]</code> × 3 with <code>h2</code> <code>To do (2)</code>; cards <code>.card[data-key]</code> with <code>.key</code>, <code>.title</code>, <code>.assignee</code> (name joined from users), <code>.move-next</code> (not in Done).', vi: '<code>section.column[data-status]</code> × 3 có <code>h2</code> <code>To do (2)</code>; thẻ <code>.card[data-key]</code> có <code>.key</code>, <code>.title</code>, <code>.assignee</code> (tên nối từ users), <code>.move-next</code> (không có ở Done).' }] },
    { ten: { en: 'Optimistic move', vi: 'Chuyển cột lạc quan' }, diem: 2, yeuCau: [{ en: '<code>moveIssue({ id, from, to })</code>: <code>pending</code> moves the card at once, <code>fulfilled</code> upserts the server copy, <code>rejected</code> restores <code>from</code> (read from <code>action.meta.arg</code>) and sets <code>#error</code> <code>Could not move CT-1</code>.', vi: '<code>moveIssue({ id, from, to })</code>: <code>pending</code> chuyển thẻ ngay, <code>fulfilled</code> upsert bản server, <code>rejected</code> trả về <code>from</code> (đọc từ <code>action.meta.arg</code>) và đặt <code>#error</code> <code>Could not move CT-1</code>.' }], viDu: { en: 'PATCH answers 500 ⇒ CT-1 goes back to To do and the error shows', vi: 'PATCH trả 500 ⇒ CT-1 quay lại To do và hiện lỗi' } },
    { ten: { en: 'Filters & memoised selectors', vi: 'Bộ lọc & selector ghi nhớ' }, diem: 1.5, yeuCau: [{ en: '<code>#filter-assignee</code> (Everyone / user), <code>#filter-text</code> (title or key), <code>#clear-filters</code>; <code>selectVisibleIssues</code> and <code>selectColumns</code> built with <code>createSelector</code>.', vi: '<code>#filter-assignee</code> (Everyone / người), <code>#filter-text</code> (tiêu đề hoặc key), <code>#clear-filters</code>; <code>selectVisibleIssues</code> và <code>selectColumns</code> dựng bằng <code>createSelector</code>.' }] },
    { ten: { en: 'Activity log via listener', vi: 'Nhật ký qua listener' }, diem: 1.5, yeuCau: [{ en: 'A listener on <code>moveIssue.fulfilled</code> dispatches <code>activityAdded("CT-1: todo → doing")</code>; <code>#activity li</code> newest first; failures log nothing.', vi: 'Listener trên <code>moveIssue.fulfilled</code> dispatch <code>activityAdded("CT-1: todo → doing")</code>; <code>#activity li</code> mới nhất trước; lỗi thì không ghi.' }] },
    { ten: { en: 'Persisted filters via listener', vi: 'Lưu bộ lọc qua listener' }, diem: 1, yeuCau: [{ en: 'A listener matching the three filter actions writes <code>filters</code> to localStorage; the slice\'s initial state reads it back (corrupted ⇒ defaults).', vi: 'Listener khớp ba action bộ lọc ghi <code>filters</code> vào localStorage; initialState của slice đọc lại (hỏng ⇒ mặc định).' }] },
    { ten: { en: 'Error state', vi: 'Trạng thái lỗi' }, diem: 1, yeuCau: [{ en: '<code>#load-error</code> <code>Could not load issues (HTTP 404)</code>.', vi: '<code>#load-error</code> <code>Could not load issues (HTTP 404)</code>.' }] },
  ],
  idBatBuoc: [
    ['#loading · #load-error · #total · #error', { en: 'status', vi: 'trạng thái' }],
    ['#filter-assignee · #filter-text · #clear-filters', { en: 'filters', vi: 'bộ lọc' }],
    ['.column[data-status] h2 · .card[data-key] .key .title .assignee .move-next', { en: 'board', vi: 'bảng' }],
    ['#activity li', { en: 'activity', vi: 'nhật ký' }],
  ],
  truDiem: [
    { en: 'Storing issues as a nested array per column — moving a card means editing two arrays.', vi: 'Lưu issue thành mảng lồng theo cột — chuyển thẻ phải sửa hai mảng.' },
    { en: 'Filtering inside <code>useSelector</code> without memoisation — new arrays every render.', vi: 'Lọc trong <code>useSelector</code> không ghi nhớ — mảng mới mỗi lần render.' },
    { en: 'Writing localStorage or dispatching from a reducer.', vi: 'Ghi localStorage hay dispatch trong reducer.' },
    { en: 'Rollback that guesses the old status instead of reading <code>meta.arg</code>.', vi: 'Hoàn tác bằng cách đoán trạng thái cũ thay vì đọc <code>meta.arg</code>.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-12-deep-issue-tracker',
  ten: 'Deep Lab 12 — Issue Tracker (entity adapter · listener middleware)',
  khoa: KHOA,
  baiHoc: 'fer202-12-1-redux-toolkit',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 12 — Issue Tracker (createEntityAdapter · createSelector · optimistic thunk · listener middleware)', vi: 'Deep Lab 12 — Theo dõi công việc (createEntityAdapter · createSelector · thunk lạc quan · listener middleware)' },
      doKho: 'HARD',
      phut: 140,
      diem: 100,
      khaiNiem: ['normalised state', 'createEntityAdapter', 'memoised selectors & joins', 'optimistic thunks', 'action.meta.arg', 'createListenerMiddleware', 'side effects outside reducers'],
      tienQuyet: ['Lab 12 — Redux bookstore', '12.2 Thunk & middleware'],
      the: ['fer202', 'deep-lab', 'redux', 'redux-toolkit'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'normalisation', vi: 'chuẩn hoá: lưu mỗi bản ghi một lần, tra theo id' },
        { en: 'entity adapter', vi: 'bộ hàm có sẵn quản lý { ids, entities }' },
        { en: 'listener middleware', vi: 'middleware chạy hiệu ứng khi gặp action phù hợp' },
        { en: 'meta.arg', vi: 'đối số gốc của thunk, có trong cả pending/fulfilled/rejected' },
        ...tn('rubric', 'persist'),
      ],
      goiY: [
        'const adapter = createEntityAdapter({ sortComparer: (a, b) => a.priority - b.priority || a.id - b.id }); initialState: adapter.getInitialState({ status: "idle", error: null }).',
        'moveIssue.pending: adapter.updateOne(state, { id, changes: { status: to } }); rejected: changes: { status: action.meta.arg.from }.',
        'selectColumns = createSelector([selectVisibleIssues], (issues) => STATUSES.map(s => ({ ...s, issues: issues.filter(i => i.status === s.id) }))).',
        'listener.startListening({ actionCreator: moveIssue.fulfilled, effect: (action, api) => api.dispatch(activityAdded(…)) }); middleware: getDefault().prepend(listener.middleware).',
      ],
      loiHayGap: [
        'Gọi <code>adapter.getSelectors()</code> không truyền hàm chọn nhánh ⇒ selector nhận cả state gốc và trả rỗng.',
        'Thêm <code>useSelector(state =&gt; state.issues.ids.map(...))</code> ⇒ mảng mới mỗi lần, cảnh báo của react-redux.',
        'Ghi nhật ký trong component sau <code>await dispatch(...)</code> ⇒ dễ quên trường hợp lỗi, nhân đôi khi nhiều nơi gọi.',
        'Dùng <code>concat(listener.middleware)</code> cũng được, nhưng thứ tự với thunk/serializable check nên có chủ đích.',
      ],
      moTaNgan: 'Deep lab chương 12: bảng công việc ba cột — createEntityAdapter (sortComparer), createSelector nối người + nhóm cột, thunk chuyển cột lạc quan hoàn tác từ meta.arg, createListenerMiddleware cho nhật ký và lưu bộ lọc. Thang 10.',
      giaiThich: '<p>Chuẩn hoá biến danh sách thành <code>{ ids, entities }</code>: chuyển cột chỉ là <code>updateOne</code> một bản ghi, cột được TÍNH bằng selector nên không bao giờ lệch. <code>createSelector</code> ghi nhớ kết quả lọc/nối nên component chỉ vẽ lại khi dữ liệu thật đổi. Thunk lạc quan dùng <code>meta.arg</code> — có trong cả ba action vòng đời — để biết trạng thái cũ mà hoàn tác. Listener middleware là chỗ chuẩn cho "khi X xảy ra thì làm Y": nhật ký và lưu bộ lọc không làm bẩn reducer hay component.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['@reduxjs/toolkit', 'react-redux'], jsonServer: { base: B, db: { issues: ISSUES, users: USERS } }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://redux-toolkit.js.org/api/createListenerMiddleware',
    },
  ],
});
