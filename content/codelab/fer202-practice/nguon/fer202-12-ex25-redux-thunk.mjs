/**
 * FER202 · Exercise 25 — Redux Thunk & middleware: đường đi của action qua middleware, tìm kiếm bằng async thunk
 * (bỏ phản hồi cũ bằng requestId), và trắc nghiệm trách nhiệm reducer / thunk / middleware.
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 200) => ({ hanhDong: 'cho', ms });
const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich });
const B = 'http://localhost:9999';

const PRODUCTS = [
  { id: 1, name: 'React Handbook' }, { id: 2, name: 'Redux Essentials' }, { id: 3, name: 'React Router Guide' },
  { id: 4, name: 'Node.js Basics' }, { id: 5, name: 'TypeScript Deep Dive' },
];

export default doiDau({
  slug: 'fer202-12-ex25-redux-thunk',
  ten: 'Exercise 25 — Redux Thunk & middleware',
  khoa: KHOA,
  baiHoc: 'fer202-12-ex25-redux-thunk',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'The journey of a dispatched thunk',
      doKho: 'MEDIUM', phut: 6,
      khaiNiem: ['middleware chain', 'thunk', 'reducer', 'subscribers'], the: ['redux', 'order', 'exercise-25'],
      moTa: {
        en: '<p>A component calls <code>dispatch(fetchUsers())</code> where <code>fetchUsers</code> is a thunk that dispatches <code>users/loaded</code> after the request. The store uses <code>getDefaultMiddleware().concat(logger)</code>. Order what happens.</p>',
        vi: '<p>Component gọi <code>dispatch(fetchUsers())</code> với <code>fetchUsers</code> là thunk dispatch <code>users/loaded</code> sau khi request xong. Store dùng <code>getDefaultMiddleware().concat(logger)</code>. Hãy xếp những gì xảy ra theo thứ tự.</p>',
      },
      goiY: ['Thunk middleware đứng trước logger.', 'Subscriber (react-redux) chạy sau khi reducer trả state mới.'],
      loiHayGap: ['Nghĩ logger in ra cả hàm thunk.', 'Nghĩ reducer chạy trước khi request xong.'],
      giaiThich: '<p>dispatch(hàm) → thunk middleware gọi hàm → request → dispatch(object) → logger → reducer → react-redux vẽ lại.</p>',
      thuatNgu: [{ en: 'middleware chain', vi: 'chuỗi middleware nối nhau bằng next' }],
      cauHoi: [
        o('j1', 'Order the steps', [
          ['d', 'The thunk dispatches <code>{ type: "users/loaded", payload }</code>; the logger prints it'],
          ['a', 'The thunk middleware sees a FUNCTION and calls it with (dispatch, getState)'],
          ['f', 'react-redux notices the new state and re-renders components using that slice'],
          ['c', 'The request finishes'],
          ['b', 'The thunk starts the HTTP request'],
          ['e', 'The users reducer returns the new state'],
        ], ['a', 'b', 'c', 'd', 'e', 'f'], 'Function → thunk calls it → request → plain action through logger → reducer → UI.|||Hàm → thunk gọi nó → request → action thường qua logger → reducer → giao diện.'),
      ],
    }),
    reactNho({
      tieuDe: 'Search with an async thunk that ignores stale responses',
      doKho: 'HARD', phut: 20, index: { redux: './app/store' }, thuVien: ['axios'],
      jsonServer: { base: B, db: { products: PRODUCTS } },
      them: {
        'src/app/store.js': `// src/app/store.js (cho sẵn)
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({ reducer: { search: searchReducer } });
`,
      },
      themGiai: {
        'src/features/search/searchSlice.js': `// src/features/search/searchSlice.js — chỉ nhận kết quả của request MỚI NHẤT (so meta.requestId)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchProducts = createAsyncThunk('search/searchProducts', async (query) => {
  const res = await axios.get('http://localhost:9999/products', { params: { q: query } });
  return res.data;
});

const searchSlice = createSlice({
  name: 'search',
  initialState: { query: '', results: [], status: 'idle', currentRequestId: null },
  reducers: {
    cleared(state) {
      state.query = '';
      state.results = [];
      state.status = 'idle';
      state.currentRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state, action) => {
        state.query = action.meta.arg;
        state.status = 'loading';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return; // phản hồi cũ ⇒ bỏ
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return;
        state.status = 'failed';
      });
  },
});

export const { cleared } = searchSlice.actions;
export default searchSlice.reducer;
`,
      },
      themDau: {
        'src/features/search/searchSlice.js': `// src/features/search/searchSlice.js — STARTER
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchProducts = createAsyncThunk('search/searchProducts', async (query) => {
  const res = await axios.get('http://localhost:9999/products', { params: { q: query } });
  return res.data;
});

const searchSlice = createSlice({
  name: 'search',
  initialState: { query: '', results: [], status: 'idle', currentRequestId: null },
  reducers: { cleared(state) { state.results = []; } },
  extraReducers: (builder) => {
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.results = action.payload;
    });
  },
});

export const { cleared } = searchSlice.actions;
export default searchSlice.reducer;
`,
      },
      khaiNiem: ['action.meta.requestId', 'action.meta.arg', 'race conditions in Redux', 'debounced dispatch'], the: ['redux', 'thunk', 'exercise-25'],
      moTa: {
        en: '<p>Search-as-you-type through Redux. Each keystroke (after a 300 ms debounce in the component) dispatches <code>searchProducts(query)</code>. Responses can arrive out of order, so the slice stores <code>currentRequestId</code> from <code>pending</code> and ignores <code>fulfilled</code>/<code>rejected</code> actions whose <code>meta.requestId</code> is not the latest.</p>',
        vi: '<p>Tìm khi gõ qua Redux. Mỗi lần gõ (sau debounce 300 ms trong component) dispatch <code>searchProducts(query)</code>. Phản hồi có thể về sai thứ tự, nên slice lưu <code>currentRequestId</code> lúc <code>pending</code> và bỏ qua <code>fulfilled</code>/<code>rejected</code> có <code>meta.requestId</code> không phải mới nhất.</p>',
      },
      yeuCau: [
        { en: '<code>#q</code> input; empty ⇒ dispatch <code>cleared()</code> instead. Results <code>li.result</code>; <code>#status</code>; <code>#summary</code> <code>2 results for "router"</code> (only when succeeded).', vi: 'Ô <code>#q</code>; rỗng ⇒ dispatch <code>cleared()</code>. Kết quả <code>li.result</code>; <code>#status</code>; <code>#summary</code> <code>2 results for "router"</code> (chỉ khi succeeded).' },
        { en: 'Debounce in the component with <code>setTimeout</code> + cleanup; fast typing ⇒ one request.', vi: 'Debounce trong component bằng <code>setTimeout</code> + cleanup; gõ nhanh ⇒ một request.' },
      ],
      viDu: [{ input: 'type "react"', output: 'React Handbook, React Router Guide', explanation: 'json-server q search is case-insensitive.|||q của json-server không phân biệt hoa thường.' }],
      goiY: ['pending: state.currentRequestId = action.meta.requestId; fulfilled: if (action.meta.requestId !== state.currentRequestId) return;', 'Component: useEffect(() => { if (!q.trim()) { dispatch(cleared()); return; } const id = setTimeout(() => dispatch(searchProducts(q.trim())), 300); return () => clearTimeout(id); }, [q, dispatch]);'],
      loiHayGap: ['Ghi kết quả ở mọi fulfilled ⇒ gõ "re" rồi "react", phản hồi chậm của "re" đè lên.', 'Dispatch mỗi phím không debounce ⇒ hàng loạt request.'],
      thuatNgu: [{ en: 'requestId', vi: 'mã duy nhất createAsyncThunk gắn cho mỗi lần gọi' }],
      giaiThich: '<p>createAsyncThunk gắn <code>meta.requestId</code> và <code>meta.arg</code> cho cả ba action vòng đời của một lần gọi. Lưu id của lần mới nhất lúc pending là cách gọn nhất để chỉ nhận phản hồi đúng.</p>',
      dau: `// src/App.js — STARTER
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from './features/search/searchSlice';

export default function App() {
  const { results } = useSelector((s) => s.search);
  const dispatch = useDispatch();
  return (
    <div>
      <input id="q" onChange={(e) => dispatch(searchProducts(e.target.value))} />
      <ul>{results.map((p) => <li key={p.id} className="result">{p.name}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — debounce trong component, kết quả + trạng thái từ store
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cleared, searchProducts } from './features/search/searchSlice';

export default function App() {
  const { results, status, query } = useSelector((s) => s.search);
  const dispatch = useDispatch();
  const [q, setQ] = useState('');

  useEffect(() => {
    const text = q.trim();
    if (!text) {
      dispatch(cleared());
      return undefined;
    }
    const id = setTimeout(() => dispatch(searchProducts(text)), 300);
    return () => clearTimeout(id);
  }, [q, dispatch]);

  return (
    <div>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" />
      <p id="status">{status}</p>
      {status === 'succeeded' && <p id="summary">{results.length} results for "{query}"</p>}
      <ul>{results.map((p) => <li key={p.id} className="result">{p.name}</li>)}</ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Search results', kiem: 'danh-sach-text', selector: 'li.result', mongDoi: ['React Handbook', 'React Router Guide'], truoc: [nhap('#q', 'react'), cho(600)] },
        { moTa: 'Summary text', kiem: 'text', selector: '#summary', giaTri: '2 results for "react"', truoc: [nhap('#q', 'react'), cho(600)] },
        { moTa: 'Debounced: one request for fast typing', kiem: 'goi-fetch', khop: '/products\\?q=', min: 1, max: 1, truoc: [nhap('#q', 'r'), nhap('#q', 're'), nhap('#q', 'red'), nhap('#q', 'redux'), cho(600)] },
        { moTa: 'Clearing empties results', kiem: 'danh-sach-text', selector: 'li.result, #status', mongDoi: ['idle'], truoc: [nhap('#q', 'react'), cho(600), nhap('#q', ''), cho(100)] },
        { an: true, moTa: 'Stale response is ignored while the newer one is pending', jsonServer: { base: B, db: { products: PRODUCTS }, treMs: 500 }, kiem: 'so-luong', selector: 'li.result', giaTri: 0, truoc: [nhap('#q', 'react'), cho(350), nhap('#q', 'typescript'), cho(520)] },
        { an: true, moTa: 'Newest response wins', jsonServer: { base: B, db: { products: PRODUCTS }, treMs: 500 }, kiem: 'danh-sach-text', selector: 'li.result', mongDoi: ['TypeScript Deep Dive'], truoc: [nhap('#q', 'react'), cho(350), nhap('#q', 'typescript'), cho(1200)] },
        { an: true, moTa: 'Slice compares meta.requestId', kiem: 'ma-nguon', tep: 'src/features/search/searchSlice.js', khop: 'meta\\.requestId[\\s\\S]*meta\\.requestId' },
      ],
    }),
    tinh({
      tieuDe: 'Reducer, thunk or middleware?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['pure reducers', 'async logic', 'cross-cutting concerns'], the: ['redux', 'quiz', 'exercise-25'],
      moTa: {
        en: '<p>Each piece of logic has one right home in a Redux app. Reducers compute the next state purely; thunks orchestrate async work for ONE feature; middleware handles concerns that apply to EVERY action. Choose the home for each case.</p>',
        vi: '<p>Mỗi mẩu logic có một chỗ đúng trong app Redux. Reducer tính state kế tiếp một cách thuần; thunk điều phối việc bất đồng bộ của MỘT tính năng; middleware lo các việc áp dụng cho MỌI action. Chọn chỗ cho từng trường hợp.</p>',
      },
      goiY: ['Có gọi mạng / setTimeout ⇒ không phải reducer.', 'Áp dụng cho mọi action ⇒ middleware.'],
      loiHayGap: ['Gọi API trong reducer.', 'Viết middleware riêng cho một màn hình — thunk là đủ.'],
      giaiThich: '<p>Reducer: thuần, đồng bộ. Thunk: quy trình bất đồng bộ của một tính năng. Middleware: log, lưu storage, báo lỗi, phân tích — cắt ngang mọi action.</p>',
      thuatNgu: [{ en: 'cross-cutting concern', vi: 'việc cắt ngang nhiều phần (log, lưu, đo)' }],
      cauHoi: [
        q('q1', 'Add an item to the cart array', [['a', 'Reducer'], ['b', 'Thunk'], ['c', 'Middleware']], ['a'], 'Pure state change.|||Đổi state thuần.'),
        q('q2', 'Load products from the API, then select the first one', [['a', 'Reducer'], ['b', 'Thunk'], ['c', 'Middleware']], ['b'], 'Async workflow for one feature.|||Quy trình bất đồng bộ của một tính năng.'),
        q('q3', 'Print every action type in development', [['a', 'Reducer'], ['b', 'Thunk'], ['c', 'Middleware']], ['c'], 'Applies to all actions.|||Áp dụng cho mọi action.'),
        q('q4', 'Save the cart to localStorage after any cart/* action', [['a', 'Reducer'], ['b', 'Thunk'], ['c', 'Middleware']], ['c'], 'A side effect reacting to many actions (or store.subscribe).|||Tác dụng phụ phản ứng với nhiều action (hoặc store.subscribe).'),
        q('q5', 'Compute the new score when an answer is selected', [['a', 'Reducer'], ['b', 'Thunk'], ['c', 'Middleware']], ['a'], 'Derived from state + action, synchronous.|||Tính từ state + action, đồng bộ.'),
      ],
    }),
  ],
});
