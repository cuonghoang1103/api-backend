/**
 * FER202 · 12.2 — Thunk & middleware (bài luyện).
 * Dễ → khó: thunk viết tay (start/success/failure) → createAsyncThunk + extraReducers + condition →
 * middleware logger tự viết → thunk dùng getState + rejectWithValue (đặt hàng).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms = 200) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';
const RX = { redux: './app/store' };
const TV = ['axios'];

const USERS = [{ id: 1, name: 'Leanne Graham' }, { id: 2, name: 'Ervin Howell' }, { id: 3, name: 'Clementine Bauch' }];

const storeVoi = (ten, duongDan) => `// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import ${ten}Reducer from '${duongDan}';

export const store = configureStore({ reducer: { ${ten}: ${ten}Reducer } });
`;

export default doiDau({
  slug: 'fer202-12-2-thunk-middleware',
  ten: '12.2 Thunk & middleware',
  khoa: KHOA,
  baiHoc: 'fer202-12-2-thunk-middleware',
  de: [
    reactNho({
      tieuDe: 'A hand-written thunk: start, success, failure',
      doKho: 'MEDIUM', phut: 15, index: RX, thuVien: TV,
      jsonServer: { base: B, db: { users: USERS } },
      them: { 'src/app/store.js': storeVoi('users', '../features/users/usersSlice') },
      themGiai: {
        'src/features/users/usersSlice.js': `// src/features/users/usersSlice.js — ba action đồng bộ + một thunk viết tay
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    fetchStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchSucceeded(state, action) {
      state.status = 'succeeded';
      state.items = action.payload;
    },
    fetchFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { fetchStarted, fetchSucceeded, fetchFailed } = usersSlice.actions;

// thunk = hàm trả về HÀM nhận (dispatch, getState); redux-thunk (có sẵn trong configureStore) gọi nó
export const fetchUsers = () => async (dispatch) => {
  dispatch(fetchStarted());
  try {
    const res = await axios.get('http://localhost:9999/users');
    dispatch(fetchSucceeded(res.data));
  } catch (err) {
    dispatch(fetchFailed(err.message));
  }
};

export default usersSlice.reducer;
`,
      },
      themDau: {
        'src/features/users/usersSlice.js': `// src/features/users/usersSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
});

export const fetchUsers = () => ({ type: 'users/fetch' });
export default usersSlice.reducer;
`,
      },
      khaiNiem: ['thunk', 'redux-thunk', 'start/success/failure actions', 'status field'], the: ['redux', 'thunk', 'exercise-25'],
      moTa: {
        en: '<p>Reducers must be pure, so API calls go into a <b>thunk</b>: a function that returns <code>async (dispatch) =&gt; { … }</code>. <code>configureStore</code> already includes redux-thunk. Write <code>fetchUsers()</code> that dispatches <code>fetchStarted</code>, then <code>fetchSucceeded(users)</code> or <code>fetchFailed(message)</code>, and a slice that keeps <code>{ items, status, error }</code>.</p>',
        vi: '<p>Reducer phải thuần, nên lời gọi API nằm trong <b>thunk</b>: hàm trả về <code>async (dispatch) =&gt; { … }</code>. <code>configureStore</code> đã có sẵn redux-thunk. Viết <code>fetchUsers()</code> dispatch <code>fetchStarted</code>, rồi <code>fetchSucceeded(users)</code> hoặc <code>fetchFailed(message)</code>, và slice giữ <code>{ items, status, error }</code>.</p>',
      },
      yeuCau: [
        { en: 'Button <code>#load</code> dispatches <code>fetchUsers()</code>. <code>#status</code> shows the status text (<code>idle</code>/<code>loading</code>/<code>succeeded</code>/<code>failed</code>).', vi: 'Nút <code>#load</code> dispatch <code>fetchUsers()</code>. <code>#status</code> hiện chuỗi trạng thái (<code>idle</code>/<code>loading</code>/<code>succeeded</code>/<code>failed</code>).' },
        { en: 'Users in <code>li.user</code>; error in <code>#error</code> (axios message).', vi: 'User trong <code>li.user</code>; lỗi trong <code>#error</code> (message của axios).' },
      ],
      viDu: [{ input: 'click Load', output: 'idle → loading → succeeded · 3 users', explanation: 'Three plain actions describe the life of one request.|||Ba action thường mô tả vòng đời một request.' }],
      goiY: ['export const fetchUsers = () => async (dispatch) => { dispatch(fetchStarted()); try { const res = await axios.get(url); dispatch(fetchSucceeded(res.data)); } catch (e) { dispatch(fetchFailed(e.message)); } };', 'App: const { items, status, error } = useSelector((s) => s.users);'],
      loiHayGap: ['Gọi axios bên trong reducer ⇒ reducer không thuần, Redux báo lỗi hoặc state không đổi.', 'Quên <code>dispatch(fetchUsers())</code> (thiếu ngoặc) ⇒ thunk không chạy.'],
      thuatNgu: [{ en: 'thunk', vi: 'hàm trì hoãn: dispatch một hàm thay vì object' }, { en: 'side effect', vi: 'tác dụng phụ (gọi mạng, ghi storage…)' }],
      giaiThich: '<p>redux-thunk là middleware: nếu action là HÀM thì gọi nó với dispatch/getState thay vì chuyển tới reducer. Nhờ vậy logic bất đồng bộ sống cạnh slice mà reducer vẫn thuần.</p>',
      dau: `// src/App.js — STARTER
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';

export default function App() {
  const { items, status } = useSelector((s) => s.users);
  const dispatch = useDispatch();
  return (
    <div>
      <button id="load" onClick={() => dispatch(fetchUsers)}>Load users</button>
      <p id="status">{status}</p>
      <ul>{items.map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — dispatch thunk; giao diện chỉ đọc status/items/error từ store
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';

export default function App() {
  const { items, status, error } = useSelector((s) => s.users);
  const dispatch = useDispatch();
  return (
    <div>
      <button id="load" type="button" onClick={() => dispatch(fetchUsers())}>Load users</button>
      <p id="status">{status}</p>
      {error && <p id="error">{error}</p>}
      <ul>{items.map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Idle before loading', kiem: 'text', selector: '#status', giaTri: 'idle' },
        { moTa: 'Loading while waiting', jsonServer: { base: B, db: { users: USERS }, treMs: 1200 }, kiem: 'text', selector: '#status', giaTri: 'loading', truoc: [click('#load')] },
        { moTa: 'Users loaded', kiem: 'danh-sach-text', selector: 'li.user, #status', mongDoi: ['succeeded', 'Leanne Graham', 'Ervin Howell', 'Clementine Bauch'], truoc: [click('#load'), cho()] },
        { moTa: 'Failure path', jsonServer: { base: B, db: {} }, kiem: 'danh-sach-text', selector: '#status, #error', mongDoi: ['failed', 'Request failed with status code 404'], truoc: [click('#load'), cho()] },
        { an: true, moTa: 'Thunk returns a function using dispatch', kiem: 'ma-nguon', tep: 'src/features/users/usersSlice.js', khop: 'fetchUsers\\s*=\\s*\\(\\)\\s*=>\\s*async\\s*\\(\\s*dispatch' },
      ],
    }),
    reactNho({
      tieuDe: 'createAsyncThunk + extraReducers + condition',
      doKho: 'MEDIUM', phut: 15, index: RX, thuVien: TV,
      jsonServer: { base: B, db: { users: USERS } },
      them: { 'src/app/store.js': storeVoi('users', '../features/users/usersSlice') },
      themGiai: {
        'src/features/users/usersSlice.js': `// src/features/users/usersSlice.js — createAsyncThunk sinh pending/fulfilled/rejected
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const res = await axios.get('http://localhost:9999/users');
    return res.data; // ⇒ action.payload của fulfilled
  },
  {
    // đã tải hoặc đang tải ⇒ không gửi request nữa
    condition: (_, { getState }) => getState().users.status === 'idle' || getState().users.status === 'failed',
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
`,
      },
      themDau: {
        'src/features/users/usersSlice.js': `// src/features/users/usersSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    loaded(state, action) { state.items = action.payload; },
  },
});

export const fetchUsers = () => async (dispatch) => {
  const res = await axios.get('http://localhost:9999/users');
  dispatch(usersSlice.actions.loaded(res.data));
};
export default usersSlice.reducer;
`,
      },
      khaiNiem: ['createAsyncThunk', 'pending/fulfilled/rejected', 'builder.addCase', 'condition'], the: ['redux', 'thunk', 'exercise-25'],
      moTa: {
        en: '<p>Same feature, Redux Toolkit style. <code>createAsyncThunk("users/fetchUsers", payloadCreator)</code> dispatches <code>pending</code>, <code>fulfilled</code> or <code>rejected</code> for you; handle them in <code>extraReducers</code> with <code>builder.addCase</code>. Add a <code>condition</code> option so the request is skipped when users are already loading or loaded.</p>',
        vi: '<p>Cùng tính năng, theo kiểu Redux Toolkit. <code>createAsyncThunk("users/fetchUsers", payloadCreator)</code> tự dispatch <code>pending</code>, <code>fulfilled</code> hoặc <code>rejected</code>; xử lý chúng trong <code>extraReducers</code> bằng <code>builder.addCase</code>. Thêm tuỳ chọn <code>condition</code> để bỏ qua request khi user đang tải hoặc đã tải.</p>',
      },
      yeuCau: [
        { en: 'Two components each dispatch <code>fetchUsers()</code> on mount: <code>UserList</code> (<code>li.user</code>) and <code>UserCount</code> (<code>#user-count</code> <code>3 users</code>). Only ONE request may be sent.', vi: 'Hai component đều dispatch <code>fetchUsers()</code> khi mount: <code>UserList</code> (<code>li.user</code>) và <code>UserCount</code> (<code>#user-count</code> <code>3 users</code>). Chỉ được gửi MỘT request.' },
        { en: '<code>#status</code> shows the status; a <code>#retry</code> button appears when failed.', vi: '<code>#status</code> hiện trạng thái; nút <code>#retry</code> hiện khi lỗi.' },
      ],
      viDu: [{ input: 'app mounts', output: 'GET /users once · 3 users', explanation: 'condition returns false for the second dispatch, so nothing is sent.|||condition trả false ở lần dispatch thứ hai nên không gửi gì.' }],
      goiY: ['createAsyncThunk("users/fetchUsers", async () => (await axios.get(url)).data, { condition: (_, { getState }) => getState().users.status === "idle" })', 'extraReducers: (builder) => { builder.addCase(fetchUsers.pending, …).addCase(fetchUsers.fulfilled, …).addCase(fetchUsers.rejected, …); }'],
      loiHayGap: ['Đặt case pending/fulfilled trong <code>reducers</code> (không phải extraReducers) ⇒ chúng thành action MỚI tên khác, không bao giờ khớp.', 'Lỗi của rejected nằm ở <code>action.error.message</code>, không phải <code>action.payload</code> (trừ khi dùng rejectWithValue).'],
      thuatNgu: [{ en: 'lifecycle actions', vi: 'ba action vòng đời: pending, fulfilled, rejected' }],
      giaiThich: '<p>createAsyncThunk chuẩn hoá ba action vòng đời và tên của chúng (<code>users/fetchUsers/pending</code>…). <code>condition</code> chạy trước — trả false thì thunk không làm gì, tránh gọi trùng khi nhiều component cùng cần dữ liệu.</p>',
      dau: `// src/App.js — STARTER
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';

function UserList() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.users);
  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);
  return <ul>{items.map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>;
}

export default function App() {
  return <UserList />;
}
`,
      giai: `// src/App.js — hai component cùng dispatch; condition chặn request thứ hai
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';

function UserList() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  return <ul>{items.map((u) => <li key={u.id} className="user">{u.name}</li>)}</ul>;
}

function UserCount() {
  const dispatch = useDispatch();
  const count = useSelector((s) => s.users.items.length);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  return <p id="user-count">{count} users</p>;
}

function Status() {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.users);
  return (
    <div>
      <p id="status">{status}</p>
      {status === 'failed' && <button id="retry" type="button" onClick={() => dispatch(fetchUsers())}>Retry</button>}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Status />
      <UserCount />
      <UserList />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Users loaded', kiem: 'danh-sach-text', selector: 'li.user', mongDoi: ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch'], truoc: [cho()] },
        { moTa: 'Count component', kiem: 'text', selector: '#user-count', giaTri: '3 users', truoc: [cho()] },
        { moTa: 'Only one request', kiem: 'goi-fetch', khop: '/users', min: 1, max: 1, truoc: [cho(400)] },
        { moTa: 'Status succeeded', kiem: 'text', selector: '#status', giaTri: 'succeeded', truoc: [cho()] },
        { an: true, moTa: 'Failure shows Retry', jsonServer: { base: B, db: {} }, kiem: 'danh-sach-text', selector: '#status, #retry', mongDoi: ['failed', 'Retry'], truoc: [cho()] },
        { an: true, moTa: 'createAsyncThunk + extraReducers', kiem: 'ma-nguon', tep: 'src/features/users/usersSlice.js', khop: '^(?=[\\s\\S]*createAsyncThunk\\()(?=[\\s\\S]*extraReducers)(?=[\\s\\S]*addCase\\(\\s*fetchUsers\\.pending)' },
      ],
    }),
    reactNho({
      tieuDe: 'Write a logger middleware',
      doKho: 'MEDIUM', phut: 12, index: RX,
      themGiai: {
        'src/app/logger.js': `// src/app/logger.js — middleware: store => next => action
export const logger = (store) => (next) => (action) => {
  console.log(´[action] @{action.type}´);
  const result = next(action); // chuyển tiếp tới middleware sau / reducer
  console.log(´[state] @{JSON.stringify(store.getState())}´);
  return result;
};
`,
        'src/app/store.js': `// src/app/store.js — NỐI logger SAU middleware mặc định (giữ redux-thunk)
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { logger } from './logger';

export const store = configureStore({
  reducer: { counter: counterReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
`,
      },
      themDau: {
        'src/app/logger.js': `// src/app/logger.js — STARTER
export const logger = () => {};
`,
        'src/app/store.js': `// src/app/store.js — STARTER
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({ reducer: { counter: counterReducer } });
`,
      },
      them: {
        'src/features/counter/counterSlice.js': `// src/features/counter/counterSlice.js (cho sẵn)
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    addAsync: (state, action) => { state.value += action.payload; },
  },
});

export const { increment, addAsync } = counterSlice.actions;
// thunk nhỏ để kiểm logger vẫn chạy cùng redux-thunk
export const incrementLater = () => (dispatch) => {
  setTimeout(() => dispatch(addAsync(10)), 100);
};
export default counterSlice.reducer;
`,
      },
      khaiNiem: ['middleware signature', 'next(action)', 'getDefaultMiddleware', 'order of middleware'], the: ['redux', 'middleware', 'exercise-25'],
      moTa: {
        en: '<p>Middleware sits between <code>dispatch</code> and the reducer. Write <code>logger</code> with the curried signature <code>store =&gt; next =&gt; action =&gt; …</code>: log <code>[action] &lt;type&gt;</code>, call <code>next(action)</code>, then log <code>[state] &lt;JSON of the whole state&gt;</code>. Add it with <code>getDefaultMiddleware().concat(logger)</code> so thunks still work.</p>',
        vi: '<p>Middleware nằm giữa <code>dispatch</code> và reducer. Viết <code>logger</code> theo chữ ký lồng <code>store =&gt; next =&gt; action =&gt; …</code>: in <code>[action] &lt;type&gt;</code>, gọi <code>next(action)</code>, rồi in <code>[state] &lt;JSON toàn bộ state&gt;</code>. Thêm bằng <code>getDefaultMiddleware().concat(logger)</code> để thunk vẫn chạy.</p>',
      },
      yeuCau: [
        { en: 'App: <code>#value</code>, <code>#inc</code> (<code>increment()</code>), <code>#later</code> (dispatches the given thunk <code>incrementLater()</code>).', vi: 'App: <code>#value</code>, <code>#inc</code> (<code>increment()</code>), <code>#later</code> (dispatch thunk có sẵn <code>incrementLater()</code>).' },
        { en: 'Thunks (functions) pass through redux-thunk BEFORE your logger, so only plain actions are logged.', vi: 'Thunk (hàm) đi qua redux-thunk TRƯỚC logger, nên chỉ action thường được in.' },
      ],
      viDu: [{ input: 'click +', output: '[action] counter/increment · [state] {"counter":{"value":1}}', explanation: 'The state is logged AFTER next(action) — the reducer has run.|||State in ra SAU next(action) — reducer đã chạy.' }],
      goiY: ['export const logger = (store) => (next) => (action) => { console.log(´[action] @{action.type}´); const result = next(action); console.log(´[state] @{JSON.stringify(store.getState())}´); return result; };', 'middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)'],
      loiHayGap: ['<code>middleware: [logger]</code> ⇒ thay luôn mặc định, mất redux-thunk ⇒ "Actions must be plain objects".', 'Quên <code>return next(action)</code> ⇒ action không tới reducer, state đứng yên.'],
      thuatNgu: [{ en: 'middleware', vi: 'lớp chen giữa dispatch và reducer' }, { en: 'currying', vi: 'hàm nhận từng tham số một, trả về hàm' }],
      giaiThich: '<p>Mỗi middleware nhận <code>next</code> (middleware kế tiếp). Thứ tự quan trọng: thunk đứng trước nên hàm bị chặn ở đó, chỉ object action tới được logger. Đây là chỗ đặt mọi thứ "cắt ngang": log, lưu storage, phân tích.</p>',
      dau: `// src/App.js — STARTER
import { useDispatch, useSelector } from 'react-redux';
import { increment, incrementLater } from './features/counter/counterSlice';

export default function App() {
  const value = useSelector((s) => s.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <p id="value">{value}</p>
      <button id="inc" onClick={() => dispatch(increment())}>+</button>
      <button id="later" onClick={() => dispatch(incrementLater())}>+10 later</button>
    </div>
  );
}
`,
      giai: `// src/App.js — giao diện không đổi; logger nằm trong store
import { useDispatch, useSelector } from 'react-redux';
import { increment, incrementLater } from './features/counter/counterSlice';

export default function App() {
  const value = useSelector((s) => s.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <p id="value">{value}</p>
      <button id="inc" type="button" onClick={() => dispatch(increment())}>+</button>
      <button id="later" type="button" onClick={() => dispatch(incrementLater())}>+10 later</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Logs action then state', kiem: 'console', mongDoi: ['[action] counter/increment', '[state] {"counter":{"value":1}}'], truoc: [click('#inc')] },
        { moTa: 'Reducer still runs', kiem: 'text', selector: '#value', giaTri: '2', truoc: [click('#inc', 2)] },
        { moTa: 'Thunks still work (default middleware kept)', kiem: 'text', selector: '#value', giaTri: '10', truoc: [click('#later'), cho(300)] },
        { an: true, moTa: 'Thunk itself is not logged, its plain action is', kiem: 'console', mongDoi: ['[action] counter/addAsync', '[state] {"counter":{"value":10}}'], truoc: [click('#later'), cho(300)] },
        { an: true, moTa: 'Uses getDefaultMiddleware().concat', kiem: 'ma-nguon', tep: 'src/app/store.js', khop: 'getDefaultMiddleware\\(\\)\\s*\\.concat\\(\\s*logger' },
      ],
    }),
    reactNho({
      tieuDe: 'placeOrder thunk: getState, POST, rejectWithValue',
      doKho: 'HARD', phut: 22, index: RX, thuVien: TV,
      jsonServer: { base: B, db: { orders: [] } },
      them: {
        'src/app/store.js': `// src/app/store.js (cho sẵn)
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({ reducer: { cart: cartReducer } });
`,
      },
      themGiai: {
        'src/features/cart/cartSlice.js': `// src/features/cart/cartSlice.js — giỏ + thunk đặt hàng đọc state bằng getState
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const placeOrder = createAsyncThunk('cart/placeOrder', async (customer, { getState, rejectWithValue }) => {
  const { lines } = getState().cart;
  if (lines.length === 0) return rejectWithValue('Your cart is empty');
  if (!customer.trim()) return rejectWithValue('Customer name is required');
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  try {
    const res = await axios.post('http://localhost:9999/orders', { customer: customer.trim(), lines, total });
    return res.data; // đơn vừa tạo (có id)
  } catch (err) {
    return rejectWithValue(´Order failed (@{err.response ? err.response.status : 'network'})´);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { lines: [], status: 'idle', error: null, lastOrderId: null },
  reducers: {
    added(state, action) {
      const p = action.payload;
      const line = state.lines.find((l) => l.id === p.id);
      if (line) line.qty += 1;
      else state.lines.push({ ...p, qty: 1 });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrderId = action.payload.id;
        state.lines = []; // đặt xong ⇒ làm rỗng giỏ
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { added } = cartSlice.actions;
export default cartSlice.reducer;
`,
      },
      themDau: {
        'src/features/cart/cartSlice.js': `// src/features/cart/cartSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { lines: [], status: 'idle', error: null, lastOrderId: null },
  reducers: {
    added(state, action) { state.lines.push({ ...action.payload, qty: 1 }); },
  },
});

export const placeOrder = (customer) => async () => {
  await axios.post('http://localhost:9999/orders', { customer });
};
export const { added } = cartSlice.actions;
export default cartSlice.reducer;
`,
      },
      khaiNiem: ['thunkAPI.getState', 'rejectWithValue', 'clearing state on success', 'error payloads'], the: ['redux', 'thunk'],
      moTa: {
        en: '<p>Checkout as an async thunk. <code>placeOrder(customer)</code> reads the cart with <code>getState()</code>, validates (empty cart, missing name) with <code>rejectWithValue(message)</code>, then <code>POST /orders</code> with <code>{ customer, lines, total }</code>. On success the cart is emptied and the new order id is shown; on failure a friendly message comes from <code>action.payload</code>.</p>',
        vi: '<p>Thanh toán bằng async thunk. <code>placeOrder(customer)</code> đọc giỏ bằng <code>getState()</code>, kiểm hợp lệ (giỏ rỗng, thiếu tên) bằng <code>rejectWithValue(message)</code>, rồi <code>POST /orders</code> với <code>{ customer, lines, total }</code>. Thành công thì làm rỗng giỏ và hiện id đơn mới; thất bại thì thông báo thân thiện lấy từ <code>action.payload</code>.</p>',
      },
      yeuCau: [
        { en: 'Products (given): Pen 15000, Notebook 32000 — <code>.btn-add</code>. <code>#customer</code>, <code>#checkout</code> (disabled while loading), <code>#lines-count</code>.', vi: 'Sản phẩm (đã cho): Pen 15000, Notebook 32000 — <code>.btn-add</code>. <code>#customer</code>, <code>#checkout</code> (vô hiệu khi đang tải), <code>#lines-count</code>.' },
        { en: '<code>#order-ok</code> <code>Order #1 placed</code>; <code>#order-error</code> with the rejectWithValue message (<code>Your cart is empty</code>, <code>Customer name is required</code>, <code>Order failed (500)</code>).', vi: '<code>#order-ok</code> <code>Order #1 placed</code>; <code>#order-error</code> với thông điệp rejectWithValue (<code>Your cart is empty</code>, <code>Customer name is required</code>, <code>Order failed (500)</code>).' },
      ],
      viDu: [{ input: 'add Pen ×2, Notebook; customer Lan; checkout', output: 'POST total 62000 · Order #1 placed · cart empty', explanation: 'The thunk reads lines from the store, not from component props.|||Thunk đọc các dòng từ store, không lấy từ props của component.' }],
      goiY: ['createAsyncThunk("cart/placeOrder", async (customer, { getState, rejectWithValue }) => { const { lines } = getState().cart; if (!lines.length) return rejectWithValue("Your cart is empty"); … })', 'rejected: state.error = action.payload ?? action.error.message;'],
      loiHayGap: ['<code>throw new Error("Your cart is empty")</code> ⇒ được, nhưng thông điệp nằm ở action.error và bị chuẩn hoá; rejectWithValue cho payload tuỳ ý.', 'Làm rỗng giỏ TRƯỚC khi POST xong ⇒ lỗi mạng làm mất giỏ của khách.'],
      thuatNgu: [{ en: 'thunkAPI', vi: 'tham số thứ hai của payloadCreator: dispatch, getState, rejectWithValue…' }],
      giaiThich: '<p>Thunk là nơi đúng cho quy trình nhiều bước có đọc state + gọi mạng. <code>rejectWithValue</code> biến lỗi nghiệp vụ thành payload có kiểm soát; reducer <code>fulfilled</code> chỉ xoá giỏ khi server đã xác nhận.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { added, placeOrder } from './features/cart/cartSlice';

const PRODUCTS = [{ id: 1, name: 'Pen', price: 15000 }, { id: 2, name: 'Notebook', price: 32000 }];

export default function App() {
  const { lines } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState('');
  return (
    <div>
      {PRODUCTS.map((p) => <button key={p.id} className="btn-add" onClick={() => dispatch(added(p))}>{p.name}</button>)}
      <p id="lines-count">{lines.length}</p>
      <input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
      <button id="checkout" onClick={() => dispatch(placeOrder(customer))}>Checkout</button>
    </div>
  );
}
`,
      giai: `// src/App.js — dispatch thunk đặt hàng; hiện kết quả/lỗi từ store
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { added, placeOrder } from './features/cart/cartSlice';

const PRODUCTS = [{ id: 1, name: 'Pen', price: 15000 }, { id: 2, name: 'Notebook', price: 32000 }];

export default function App() {
  const { lines, status, error, lastOrderId } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState('');

  return (
    <div>
      {PRODUCTS.map((p) => (
        <button key={p.id} type="button" className="btn-add" onClick={() => dispatch(added(p))}>{p.name}</button>
      ))}
      <p id="lines-count">{lines.length}</p>
      <input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer name" />
      <button id="checkout" type="button" disabled={status === 'loading'} onClick={() => dispatch(placeOrder(customer))}>Checkout</button>
      {status === 'succeeded' && <p id="order-ok">Order #{lastOrderId} placed</p>}
      {status === 'failed' && <p id="order-error">{error}</p>}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Order POSTed with lines and total', kiem: 'du-lieu-server', bang: 'orders', chua: { customer: 'Lan', total: 62000 }, truoc: [click('.btn-add:nth-child(1)', 2), click('.btn-add:nth-child(2)'), { hanhDong: 'nhap', selector: '#customer', giaTri: 'Lan' }, click('#checkout'), cho()] },
        { moTa: 'Success message and empty cart', kiem: 'danh-sach-text', selector: '#lines-count, #order-ok', mongDoi: ['0', 'Order #1 placed'], truoc: [click('.btn-add:nth-child(1)'), { hanhDong: 'nhap', selector: '#customer', giaTri: 'Lan' }, click('#checkout'), cho()] },
        { moTa: 'Empty cart ⇒ rejectWithValue message', kiem: 'text', selector: '#order-error', giaTri: 'Your cart is empty', truoc: [{ hanhDong: 'nhap', selector: '#customer', giaTri: 'Lan' }, click('#checkout'), cho()] },
        { moTa: 'Missing name', kiem: 'text', selector: '#order-error', giaTri: 'Customer name is required', truoc: [click('.btn-add:nth-child(1)'), click('#checkout'), cho()] },
        { an: true, moTa: 'Server error ⇒ friendly message, cart kept', jsonServer: { base: B, db: {} }, kiem: 'danh-sach-text', selector: '#lines-count, #order-error', mongDoi: ['1', 'Order failed (404)'], truoc: [click('.btn-add:nth-child(1)'), { hanhDong: 'nhap', selector: '#customer', giaTri: 'Lan' }, click('#checkout'), cho()] },
        { an: true, moTa: 'No POST when validation fails', kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [click('#checkout'), cho()] },
        { an: true, moTa: 'Checkout disabled while loading', jsonServer: { base: B, db: { orders: [] }, treMs: 1000 }, kiem: 'thuoc-tinh-js', selector: '#checkout', thuocTinh: 'disabled', giaTri: true, truoc: [click('.btn-add:nth-child(1)'), { hanhDong: 'nhap', selector: '#customer', giaTri: 'Lan' }, click('#checkout')] },
        { an: true, moTa: 'Uses getState + rejectWithValue', kiem: 'ma-nguon', tep: 'src/features/cart/cartSlice.js', khop: '^(?=[\\s\\S]*getState\\(\\))(?=[\\s\\S]*rejectWithValue\\()' },
      ],
    }),
  ],
});
