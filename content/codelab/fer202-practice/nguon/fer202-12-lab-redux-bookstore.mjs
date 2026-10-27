/**
 * FER202 · Chương 12 (Flux & Redux) — LAB 12: Book Store with Redux Toolkit.
 * Bám Exercise 24 (intro Redux) + 25 (Redux Thunk: async + logger) nhưng sâu hơn: nhiều slice, createAsyncThunk
 * có pending/fulfilled/rejected, selector ghi nhớ (createSelector), middleware tự viết (logger + lưu giỏ),
 * preloadedState, thunk đọc getState và dispatch action khác, addMatcher ghi lịch sử action.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DB = {
  books: [
    { id: 1, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category: 'Programming', price: 29.99, stock: 5 },
    { id: 2, title: 'Refactoring UI', author: 'Adam Wathan', category: 'Design', price: 79, stock: 2 },
    { id: 3, title: 'The Lean Startup', author: 'Eric Ries', category: 'Business', price: 18.5, stock: 0 },
    { id: 4, title: "You Don't Know JS Yet", author: 'Kyle Simpson', category: 'Programming', price: 24.5, stock: 7 },
    { id: 5, title: "Don't Make Me Think", author: 'Steve Krug', category: 'Design', price: 32, stock: 4 },
    { id: 6, title: 'Zero to One', author: 'Peter Thiel', category: 'Business', price: 16.99, stock: 3 },
    { id: 7, title: 'Clean Architecture', author: 'Robert C. Martin', category: 'Programming', price: 34.99, stock: 1 },
    { id: 8, title: 'Hooked', author: 'Nir Eyal', category: 'Business', price: 21, stock: 6 },
  ],
  orders: [],
};
const DB_JSON = `${JSON.stringify(DB, null, 2)}\n`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const API = `// src/api.js
import axios from 'axios';

export const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });
`;

const BOOKS = `// src/features/books/booksSlice.js — dữ liệu từ máy chủ: createAsyncThunk lo 3 trạng thái pending/fulfilled/rejected
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const res = await api.get('/books');
  return res.data; // thành action.payload của books/fetchBooks/fulfilled
});

const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading'; // Immer: "sửa" state nháp ⇒ RTK tạo state mới bất biến
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default booksSlice.reducer;

// ── selectors ──
export const selectBooks = (state) => state.books.items;
export const selectBooksStatus = (state) => state.books.status;
export const selectCategories = createSelector([selectBooks], (books) => [...new Set(books.map((b) => b.category))].sort());
`;

const FILTERS = `// src/features/filters/filtersSlice.js — trạng thái giao diện dùng chung (tìm + thể loại)
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { selectBooks } from '../books/booksSlice';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { search: '', category: 'All' },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
  },
});

export const { setSearch, setCategory } = filtersSlice.actions;
export default filtersSlice.reducer;

// createSelector GHI NHỚ: chỉ lọc/sắp lại khi books hoặc filters đổi (useSelector gọi selector mỗi lần store đổi)
export const selectVisibleBooks = createSelector([selectBooks, (state) => state.filters], (books, { search, category }) => {
  const q = search.trim().toLowerCase();
  return books
    .filter((b) => (category === 'All' || b.category === category) && (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)))
    .sort((a, b) => a.title.localeCompare(b.title));
});
`;

const CART = `// src/features/cart/cartSlice.js — giỏ hàng: reducer + selector tính tổng
import { createSelector, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const book = action.payload;
      const line = state.items.find((i) => i.id === book.id);
      if (line) {
        if (line.quantity < line.stock) line.quantity += 1;
      } else if (book.stock > 0) {
        state.items.push({ id: book.id, title: book.title, price: book.price, stock: book.stock, quantity: 1 });
      }
    },
    increment(state, action) {
      const line = state.items.find((i) => i.id === action.payload);
      if (line && line.quantity < line.stock) line.quantity += 1;
    },
    decrement(state, action) {
      const line = state.items.find((i) => i.id === action.payload);
      if (!line) return;
      line.quantity -= 1;
      if (line.quantity === 0) state.items = state.items.filter((i) => i.id !== action.payload);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = createSelector([selectCartItems], (items) => items.reduce((n, i) => n + i.quantity, 0));
// làm tròn 2 chữ số: 29.99 + 24.5 = 54.489999… trong số thực
export const selectCartTotal = createSelector([selectCartItems], (items) => Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100);
`;

const ORDERS = `// src/features/orders/ordersSlice.js — thunk ĐỌC state (getState) và DISPATCH action của slice khác
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api';
import { clearCart, selectCartItems, selectCartTotal } from '../cart/cartSlice';

export const checkout = createAsyncThunk('orders/checkout', async (_, { getState, dispatch }) => {
  const state = getState();
  const order = {
    items: selectCartItems(state).map(({ id, title, price, quantity }) => ({ bookId: id, title, price, quantity })),
    total: selectCartTotal(state),
    createdAt: new Date().toISOString(),
  };
  const res = await api.post('/orders', order);
  dispatch(clearCart()); // giỏ chỉ được xoá khi máy chủ đã nhận đơn
  return res.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { status: 'idle', lastOrder: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;
      })
      .addCase(checkout.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Checkout failed';
      });
  },
});

export default ordersSlice.reducer;
`;

const HISTORY = `// src/features/history/historySlice.js — addMatcher: phản ứng với action của slice KHÁC theo điều kiện
import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
  name: 'history',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.startsWith('cart/'),
      (state, action) => [action.type, ...state].slice(0, 5), // trả về giá trị MỚI cũng được (thay vì sửa nháp)
    );
  },
});

export default historySlice.reducer;
`;

const MIDDLEWARE = `// src/app/middleware.js — middleware = store => next => action => …
// 1) logger: in mọi action (đúng định dạng đề yêu cầu)
export const logger = () => (next) => (action) => {
  console.log('[redux]', action.type);
  return next(action);
};

// 2) lưu giỏ: SAU khi reducer chạy (next), ghi state.cart vào localStorage
export const persistCart = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('cart/')) localStorage.setItem('cart', JSON.stringify(store.getState().cart));
  return result;
};

// đọc giỏ đã lưu cho preloadedState (hỏng/không có ⇒ undefined ⇒ dùng initialState của slice)
export function loadCart() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
`;

const STORE = `// src/app/store.js — MỘT store cho cả app
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import filtersReducer from '../features/filters/filtersSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import historyReducer from '../features/history/historySlice';
import { loadCart, logger, persistCart } from './middleware';

const savedCart = loadCart();

export const store = configureStore({
  reducer: { books: booksReducer, filters: filtersReducer, cart: cartReducer, orders: ordersReducer, history: historyReducer },
  preloadedState: savedCart ? { cart: savedCart } : undefined,
  // giữ middleware mặc định (có thunk) rồi nối thêm của mình
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, persistCart),
});
`;

const APP = `// src/App.js — component chỉ ĐỌC store bằng useSelector và GỬI lệnh bằng useDispatch
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, selectBooks, selectBooksStatus, selectCategories } from './features/books/booksSlice';
import { selectVisibleBooks, setCategory, setSearch } from './features/filters/filtersSlice';
import { addToCart, decrement, increment, removeFromCart, selectCartCount, selectCartItems, selectCartTotal } from './features/cart/cartSlice';
import { checkout } from './features/orders/ordersSlice';

const money = (n) => ´$@{n.toFixed(2)}´;

function BookList() {
  const dispatch = useDispatch();
  const status = useSelector(selectBooksStatus);
  const books = useSelector(selectVisibleBooks);
  const all = useSelector(selectBooks);
  const categories = useSelector(selectCategories);
  const { search, category } = useSelector((s) => s.filters);
  const cart = useSelector(selectCartItems);
  const qty = (id) => cart.find((i) => i.id === id)?.quantity ?? 0;

  if (status === 'loading' || status === 'idle') return <p id="status">Loading books...</p>;
  if (status === 'failed') return <p id="error" className="error">Failed to load books</p>;

  return (
    <section>
      <div className="toolbar">
        <input id="search" placeholder="Title or author..." value={search} onChange={(e) => dispatch(setSearch(e.target.value))} />
        <select id="category" value={category} onChange={(e) => dispatch(setCategory(e.target.value))}>
          <option value="All">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p id="book-count">Showing {books.length} of {all.length} books</p>
      <ul className="books">
        {books.map((b) => (
          <li key={b.id} id={´book-@{b.id}´} className="book-item">
            <b className="book-title">{b.title}</b> — {b.author} · {money(b.price)}
            <button type="button" className="btn-add" disabled={b.stock === 0 || qty(b.id) >= b.stock} onClick={() => dispatch(addToCart(b))}>
              {b.stock === 0 ? 'Out of stock' : 'Add'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CartPanel() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const orders = useSelector((s) => s.orders);
  return (
    <aside id="cart">
      <h2>Cart</h2>
      {items.map((i) => (
        <div key={i.id} id={´line-@{i.id}´} className="cart-line">
          {i.title}
          <button type="button" className="btn-dec" onClick={() => dispatch(decrement(i.id))}>−</button>
          <span className="line-qty">{i.quantity}</span>
          <button type="button" className="btn-inc" onClick={() => dispatch(increment(i.id))}>+</button>
          <button type="button" className="btn-remove" onClick={() => dispatch(removeFromCart(i.id))}>✕</button>
        </div>
      ))}
      <p id="cart-total">Total: {money(total)}</p>
      <button type="button" id="btn-checkout" disabled={items.length === 0 || orders.status === 'loading'} onClick={() => dispatch(checkout())}>
        Checkout
      </button>
      {orders.status === 'succeeded' && orders.lastOrder && <p id="order-success">Order #{orders.lastOrder.id} placed</p>}
      {orders.status === 'failed' && <p id="checkout-error" className="error">{orders.error}</p>}
    </aside>
  );
}

function History() {
  const history = useSelector((s) => s.history);
  return (
    <section>
      <h3>Recent cart actions</h3>
      <ol id="history">
        {history.map((t, i) => <li key={i}>{t}</li>)}
      </ol>
    </section>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const count = useSelector(selectCartCount);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="header">
        <h1>Redux Book Store</h1>
        <span id="cart-count">{count}</span>
      </header>
      <div className="layout">
        <BookList />
        <CartPanel />
      </div>
      <History />
    </div>
  );
}
`;

const CSS = `/* src/index.css — đã cho */
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
.app { max-width: 1000px; margin: 0 auto; padding: 20px; }
.header { display: flex; align-items: center; gap: 12px; }
#cart-count { background: #f59e0b; color: #fff; border-radius: 999px; padding: 2px 10px; font-weight: 700; }
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
.toolbar { display: flex; gap: 8px; }
.books { list-style: none; padding: 0; }
.book-item { display: flex; gap: 8px; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
.book-item button { margin-left: auto; }
#cart { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
.cart-line { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
.error { color: #dc2626; }
input, select, button { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; }
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_STORE = `// src/app/store.js — STARTER
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';

// TODO: thêm filters, cart, orders, history; preloadedState từ localStorage; middleware logger + persistCart
export const store = configureStore({
  reducer: { books: booksReducer },
});
`;
const S_BOOKS = `// src/features/books/booksSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

// TODO: export const fetchBooks = createAsyncThunk('books/fetchBooks', …) + extraReducers pending/fulfilled/rejected
const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
});

export const fetchBooks = () => ({ type: 'books/notImplemented' });
export default booksSlice.reducer;
export const selectBooks = (state) => state.books.items;
export const selectBooksStatus = (state) => state.books.status;
export const selectCategories = () => [];
`;
const S_FILTERS = `// src/features/filters/filtersSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({ name: 'filters', initialState: { search: '', category: 'All' }, reducers: {} });
// TODO: setSearch, setCategory + selectVisibleBooks (createSelector)
export const setSearch = () => ({ type: 'filters/todo' });
export const setCategory = () => ({ type: 'filters/todo' });
export const selectVisibleBooks = (state) => state.books.items;
export default filtersSlice.reducer;
`;
const S_CART = `// src/features/cart/cartSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({ name: 'cart', initialState: { items: [] }, reducers: {} });
// TODO: addToCart · increment · decrement · removeFromCart · clearCart + selectCartCount / selectCartTotal
export const addToCart = () => ({ type: 'cart/todo' });
export const increment = addToCart;
export const decrement = addToCart;
export const removeFromCart = addToCart;
export const clearCart = addToCart;
export const selectCartItems = (state) => (state.cart ? state.cart.items : []);
export const selectCartCount = () => 0;
export const selectCartTotal = () => 0;
export default cartSlice.reducer;
`;
const S_ORDERS = `// src/features/orders/ordersSlice.js — STARTER
// TODO: checkout = createAsyncThunk('orders/checkout', async (_, { getState, dispatch }) => …) + slice orders
export const checkout = () => ({ type: 'orders/todo' });
export default function ordersReducer(state = { status: 'idle', lastOrder: null, error: null }) {
  return state;
}
`;
const S_HISTORY = `// src/features/history/historySlice.js — STARTER
// TODO: slice "history" dùng addMatcher(action => action.type.startsWith('cart/'), …) giữ 5 action mới nhất
export default function historyReducer(state = []) {
  return state;
}
`;
const S_MW = `// src/app/middleware.js — STARTER
// TODO: logger (console.log('[redux]', action.type)) · persistCart (ghi state.cart vào localStorage "cart") · loadCart()
export const logger = () => (next) => (action) => next(action);
export const persistCart = () => (next) => (action) => next(action);
export const loadCart = () => undefined;
`;

const INDEX = index({ redux: './app/store' }).replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/api.js': API, '.env': 'REACT_APP_API_URL=http://localhost:9999\n', 'database.json': DB_JSON };
const LOI_GIAI = {
  'src/App.js': APP, 'src/app/store.js': STORE, 'src/app/middleware.js': MIDDLEWARE,
  'src/features/books/booksSlice.js': BOOKS, 'src/features/filters/filtersSlice.js': FILTERS, 'src/features/cart/cartSlice.js': CART,
  'src/features/orders/ordersSlice.js': ORDERS, 'src/features/history/historySlice.js': HISTORY, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': APP, 'src/app/store.js': S_STORE, 'src/app/middleware.js': S_MW,
  'src/features/books/booksSlice.js': S_BOOKS, 'src/features/filters/filtersSlice.js': S_FILTERS, 'src/features/cart/cartSlice.js': S_CART,
  'src/features/orders/ordersSlice.js': S_ORDERS, 'src/features/history/historySlice.js': S_HISTORY, ...CHUNG,
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const B = 'http://localhost:9999';
const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms = 200) => ({ hanhDong: 'cho', ms });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const TITLES = ['Clean Architecture', "Don't Make Me Think", 'Eloquent JavaScript', 'Hooked', 'Refactoring UI', 'The Lean Startup', "You Don't Know JS Yet", 'Zero to One'];
const HAI = [cho(120), click('#book-1 .btn-add'), click('#book-4 .btn-add')];
const KIEM = [
  // f1 — store
  { nhom: 'f1', moTa: 'configureStore with the five slices', kiem: 'ma-nguon', tep: 'src/app/store.js', khop: 'configureStore\\([\\s\\S]*books[\\s\\S]*filters[\\s\\S]*cart[\\s\\S]*orders[\\s\\S]*history' },
  { nhom: 'f1', moTa: 'Slices are created with createSlice', kiem: 'ma-nguon', tep: 'src/features/cart/cartSlice.js', khop: "createSlice\\(\\s*\\{\\s*name:\\s*['\"]cart['\"]" },
  { nhom: 'f1', moTa: 'App renders with the store (no JS error)', kiem: 'khong-loi-js' },
  // f2 — fetch thunk
  { nhom: 'f2', moTa: 'Pending ⇒ #status "Loading books..."', jsonServer: { base: B, db: DB, treMs: 1500 }, kiem: 'text', selector: '#status', giaTri: 'Loading books...' },
  { nhom: 'f2', moTa: 'Fulfilled ⇒ 8 books', kiem: 'so-luong', selector: '.book-item', giaTri: 8 },
  { nhom: 'f2', moTa: 'Rejected ⇒ #error "Failed to load books"', jsonServer: { base: B, db: { orders: [] } }, kiem: 'text', selector: '#error', giaTri: 'Failed to load books' },
  { nhom: 'f2', an: true, moTa: 'fetchBooks is a createAsyncThunk', kiem: 'ma-nguon', tep: 'src/features/books/booksSlice.js', khop: "createAsyncThunk\\(\\s*['\"]books/fetchBooks['\"]" },
  // f3 — filters + memoized selector
  { nhom: 'f3', moTa: 'Books sorted by title', kiem: 'danh-sach-text', selector: '.book-title', mongDoi: TITLES },
  { nhom: 'f3', moTa: 'Category list comes from the data', kiem: 'danh-sach-text', selector: '#category option', mongDoi: ['All categories', 'Business', 'Design', 'Programming'] },
  { nhom: 'f3', moTa: 'Search title OR author', kiem: 'danh-sach-text', selector: '.book-title', mongDoi: ['Clean Architecture'], truoc: [cho(120), nhap('#search', 'martin')] },
  { nhom: 'f3', moTa: 'Category "Design" ⇒ "Showing 2 of 8 books"', kiem: 'text', selector: '#book-count', giaTri: 'Showing 2 of 8 books', truoc: [cho(120), { hanhDong: 'doi', selector: '#category', giaTri: 'Design' }] },
  { nhom: 'f3', an: true, moTa: 'selectVisibleBooks uses createSelector', kiem: 'ma-nguon', tep: 'src/features/filters/filtersSlice.js', khop: 'selectVisibleBooks\\s*=\\s*createSelector\\(' },
  // f4 — cart slice
  { nhom: 'f4', moTa: 'Add ⇒ #cart-count 2 and a total of $54.49', kiem: 'danh-sach-text', selector: '#cart-count, #cart-total', mongDoi: ['2', 'Total: $54.49'], truoc: HAI },
  { nhom: 'f4', moTa: '+ and − change the quantity', kiem: 'text', selector: '#line-1 .line-qty', giaTri: '2', truoc: [...HAI, click('#line-1 .btn-inc'), click('#line-1 .btn-inc'), click('#line-1 .btn-dec')] },
  { nhom: 'f4', moTa: '✕ removes the line', kiem: 'so-luong', selector: '.cart-line', giaTri: 1, truoc: [...HAI, click('#line-4 .btn-remove')] },
  { nhom: 'f4', moTa: 'Stock limit: Clean Architecture (stock 1) cannot be added twice', kiem: 'text', selector: '#cart-count', giaTri: '1', truoc: [cho(120), click('#book-7 .btn-add'), click('#book-7 .btn-add')] },
  { nhom: 'f4', an: true, moTa: 'Out of stock book is disabled', kiem: 'thuoc-tinh-js', selector: '#book-3 .btn-add', thuocTinh: 'disabled', giaTri: true },
  { nhom: 'f4', an: true, moTa: '− at quantity 1 removes the line', kiem: 'so-luong', selector: '#line-1', giaTri: 0, truoc: [...HAI, click('#line-1 .btn-dec')] },
  // f5 — persist
  { nhom: 'f5', moTa: 'Cart saved to localStorage "cart"', kiem: 'kho-cuc-bo', khoa: 'cart', khop: '"items":\\[\\{"id":1', truoc: HAI },
  { nhom: 'f5', moTa: 'Cart restored after reload (preloadedState)', kiem: 'text', selector: '#cart-count', giaTri: '2', truoc: [...HAI, { hanhDong: 'tai-lai' }, cho()] },
  { nhom: 'f5', an: true, moTa: 'Corrupted saved cart does not crash the app', khoCucBo: { cart: '{oops' }, kiem: 'text', selector: '#cart-count', giaTri: '0' },
  // f6 — checkout thunk
  { nhom: 'f6', moTa: 'Checkout POSTs the order with the rounded total', kiem: 'du-lieu-server', bang: 'orders', chua: { total: 54.49 }, truoc: [...HAI, click('#btn-checkout'), cho(300)] },
  { nhom: 'f6', moTa: 'Success message and empty cart', kiem: 'danh-sach-text', selector: '#cart-count, #order-success', mongDoi: ['0', 'Order #1 placed'], truoc: [...HAI, click('#btn-checkout'), cho(300)] },
  { nhom: 'f6', moTa: 'Server error ⇒ #checkout-error, cart kept', fetchGia: { [`POST ${B}/orders`]: { status: 500, json: {} } }, kiem: 'danh-sach-text', selector: '#cart-count, #checkout-error', mongDoi: ['2', 'Checkout failed'], truoc: [...HAI, click('#btn-checkout'), cho(300)] },
  { nhom: 'f6', an: true, moTa: 'Order lines use bookId/title/price/quantity', kiem: 'du-lieu-server', bang: 'orders', chua: { items: [{ bookId: 1, title: 'Eloquent JavaScript', price: 29.99, quantity: 1 }, { bookId: 4, title: "You Don't Know JS Yet", price: 24.5, quantity: 1 }] }, truoc: [...HAI, click('#btn-checkout'), cho(300)] },
  { nhom: 'f6', an: true, moTa: 'checkout is a createAsyncThunk using getState', kiem: 'ma-nguon', tep: 'src/features/orders/ordersSlice.js', khop: 'createAsyncThunk\\([\\s\\S]*getState' },
  // f7 — history (addMatcher)
  { nhom: 'f7', moTa: '#history lists cart actions, newest first', kiem: 'danh-sach-text', selector: '#history li', mongDoi: ['cart/removeFromCart', 'cart/addToCart', 'cart/addToCart'], truoc: [...HAI, click('#line-1 .btn-remove')] },
  { nhom: 'f7', moTa: 'Only cart actions are recorded', kiem: 'so-luong', selector: '#history li', giaTri: 0, truoc: [cho(120), nhap('#search', 'a')] },
  { nhom: 'f7', an: true, moTa: 'At most 5 entries', kiem: 'so-luong', selector: '#history li', giaTri: 5, truoc: [...HAI, click('#line-1 .btn-inc'), click('#line-1 .btn-inc'), click('#line-1 .btn-dec'), click('#line-4 .btn-inc')] },
  { nhom: 'f7', an: true, moTa: 'Uses builder.addMatcher', kiem: 'ma-nguon', tep: 'src/features/history/historySlice.js', khop: 'addMatcher\\(' },
  // f8 — middleware
  { nhom: 'f8', moTa: 'Logger prints "[redux] <type>" for every action', kiem: 'console', mongDoi: ['[redux] books/fetchBooks/pending', '[redux] books/fetchBooks/fulfilled', '[redux] cart/addToCart'], truoc: [cho(150), click('#book-1 .btn-add')] },
  { nhom: 'f8', moTa: 'Middleware is added with getDefaultMiddleware().concat', kiem: 'ma-nguon', tep: 'src/app/store.js', khop: 'getDefaultMiddleware\\(\\)\\.concat\\(' },
  { nhom: 'f8', an: true, moTa: 'Middleware has the store => next => action shape', kiem: 'ma-nguon', tep: 'src/app/middleware.js', khop: '=>\\s*\\(?next\\)?\\s*=>\\s*\\(?action\\)?\\s*=>' },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 12: Book Store with Redux Toolkit', vi: 'LAB 12: Cửa hàng sách với Redux Toolkit' },
  phu: { en: 'FER202 · Chapter 12 — Flux & Redux · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 12 — Flux & Redux · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Rebuild a small book shop with <b>Redux Toolkit</b>. Server data comes in through <code>createAsyncThunk</code>; UI state (filters), the cart, orders and an action history are separate <b>slices</b>; derived data is read through <b>memoized selectors</b>; two <b>custom middlewares</b> log every action and save the cart; a <b>thunk</b> reads the state, posts the order and dispatches another slice\'s action.</p>',
    vi: '<p>Làm lại một cửa hàng sách nhỏ bằng <b>Redux Toolkit</b>. Dữ liệu máy chủ vào qua <code>createAsyncThunk</code>; trạng thái giao diện (bộ lọc), giỏ, đơn hàng và lịch sử action là các <b>slice</b> riêng; dữ liệu suy ra đọc qua <b>selector có ghi nhớ</b>; hai <b>middleware tự viết</b> in mọi action và lưu giỏ; một <b>thunk</b> đọc state, gửi đơn và dispatch action của slice khác.</p>',
  },
  chucNangChinh: [
    { en: 'Book list with search + category, cart with limits, checkout, recent-action history.', vi: 'Danh sách sách có tìm + thể loại, giỏ có giới hạn, thanh toán, lịch sử action gần đây.' },
  ],
  yeuCauChung: [
    { en: 'Redux Toolkit (<code>configureStore</code>, <code>createSlice</code>, <code>createAsyncThunk</code>, <code>createSelector</code>) + <code>react-redux</code> hooks. No component state for data that lives in the store.', vi: 'Redux Toolkit (<code>configureStore</code>, <code>createSlice</code>, <code>createAsyncThunk</code>, <code>createSelector</code>) + hook của <code>react-redux</code>. Không giữ trong component state những dữ liệu đã nằm trong store.' },
    { en: 'Action types must match exactly: <code>books/fetchBooks</code>, <code>cart/addToCart</code>, <code>cart/increment</code>, <code>cart/decrement</code>, <code>cart/removeFromCart</code>, <code>cart/clearCart</code>, <code>orders/checkout</code>.', vi: 'Tên action phải khớp chính xác: <code>books/fetchBooks</code>, <code>cart/addToCart</code>, <code>cart/increment</code>, <code>cart/decrement</code>, <code>cart/removeFromCart</code>, <code>cart/clearCart</code>, <code>orders/checkout</code>.' },
    { en: '<code>App.js</code> is given: it uses the selectors and actions exported by your slices.', vi: '<code>App.js</code> đã cho: nó dùng selector và action do các slice của bạn xuất ra.' },
  ],
  cayThuMuc: `
database.json                    # books (8), orders []
src/
├── app/
│   ├── store.js                 # configureStore + preloadedState + middleware
│   └── middleware.js            # logger · persistCart · loadCart
├── features/
│   ├── books/booksSlice.js      # fetchBooks thunk · selectBooks · selectCategories
│   ├── filters/filtersSlice.js  # setSearch · setCategory · selectVisibleBooks
│   ├── cart/cartSlice.js        # 5 reducers · selectCartCount · selectCartTotal
│   ├── orders/ordersSlice.js    # checkout thunk
│   └── history/historySlice.js  # addMatcher on cart/*
├── api.js                       # axios instance (given)
├── App.js                       # given — UI wired to the store
└── index.js                     # <Provider store={store}> (given)`,
  wireframe: `
+-------------------------------------------------------------------------+
| Redux Book Store  (2)                                                   |
| [Title or author...     ] [All categories v]      +- Cart ------------+ |
| Showing 8 of 8 books                               | Eloquent JS [-]1[+][x]
| Clean Architecture — Robert C. Martin · $34.99 [Add]| You Don't..[-]1[+][x]
| Don't Make Me Think — Steve Krug · $32.00     [Add]| Total: $54.49     | |
| The Lean Startup — Eric Ries · $18.50  [Out of stock]| [Checkout]       | |
| ...                                                | Order #1 placed   | |
|                                                    +-------------------+ |
| Recent cart actions: 1. cart/removeFromCart 2. cart/addToCart ...       |
+-------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'Redux state',
    truong: [
      ['books', "{ items: Book[], status: 'idle'|'loading'|'succeeded'|'failed', error }", ''],
      ['filters', "{ search: string, category: 'All' | string }", ''],
      ['cart', '{ items: { id, title, price, stock, quantity }[] }', { en: 'saved in localStorage "cart"', vi: 'lưu ở localStorage "cart"' }],
      ['orders', "{ status, lastOrder, error }", ''],
      ['history', 'string[] (≤ 5, newest first)', ''],
      ['Book (API)', '{ id, title, author, category, price (USD), stock }', ''],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Store & slices', vi: 'Store & slice' }, diem: 1,
      yeuCau: [{ en: '<code>configureStore</code> with reducers <code>books</code>, <code>filters</code>, <code>cart</code>, <code>orders</code>, <code>history</code>; each slice made with <code>createSlice</code>.', vi: '<code>configureStore</code> với reducer <code>books</code>, <code>filters</code>, <code>cart</code>, <code>orders</code>, <code>history</code>; mỗi slice tạo bằng <code>createSlice</code>.' }],
      hook: ['configureStore', 'createSlice'],
    },
    {
      ten: { en: 'Async thunk: load books', vi: 'Thunk bất đồng bộ: tải sách' }, diem: 1.5,
      yeuCau: [
        { en: '<code>fetchBooks = createAsyncThunk(\'books/fetchBooks\', …)</code> (<code>GET /books</code>); <code>extraReducers</code> handle pending / fulfilled / rejected (<code>status</code>, <code>items</code>, <code>error</code>).', vi: '<code>fetchBooks = createAsyncThunk(\'books/fetchBooks\', …)</code> (<code>GET /books</code>); <code>extraReducers</code> xử lý pending / fulfilled / rejected (<code>status</code>, <code>items</code>, <code>error</code>).' },
        { en: 'UI (given): <code>#status</code> while loading, <code>#error</code> on failure.', vi: 'Giao diện (đã cho): <code>#status</code> khi đang tải, <code>#error</code> khi lỗi.' },
      ],
      hook: ['createAsyncThunk', 'extraReducers'],
    },
    {
      ten: { en: 'Filters & memoized selectors', vi: 'Bộ lọc & selector ghi nhớ' }, diem: 1.5,
      yeuCau: [
        { en: '<code>setSearch</code>, <code>setCategory</code>; <code>selectCategories</code> (unique, A → Z) and <code>selectVisibleBooks</code> (title OR author contains, category, sorted by title) built with <code>createSelector</code>.', vi: '<code>setSearch</code>, <code>setCategory</code>; <code>selectCategories</code> (không trùng, A → Z) và <code>selectVisibleBooks</code> (tên HOẶC tác giả chứa, thể loại, sắp theo tên) dựng bằng <code>createSelector</code>.' },
      ],
      hook: ['createSelector', 'useSelector'],
      viDu: { en: 'search "martin" ⇒ Clean Architecture · category Design ⇒ Showing 2 of 8 books', vi: 'tìm "martin" ⇒ Clean Architecture · thể loại Design ⇒ Showing 2 of 8 books' },
    },
    {
      ten: { en: 'Cart slice', vi: 'Slice giỏ hàng' }, diem: 1.5,
      yeuCau: [
        { en: '<code>addToCart(book)</code>, <code>increment(id)</code>, <code>decrement(id)</code> (0 ⇒ remove), <code>removeFromCart(id)</code>, <code>clearCart()</code>. Quantity never exceeds <code>stock</code>; stock 0 cannot be added.', vi: '<code>addToCart(book)</code>, <code>increment(id)</code>, <code>decrement(id)</code> (về 0 ⇒ bỏ), <code>removeFromCart(id)</code>, <code>clearCart()</code>. Số lượng không vượt <code>stock</code>; stock 0 không thêm được.' },
        { en: '<code>selectCartCount</code> and <code>selectCartTotal</code> (rounded to 2 decimals).', vi: '<code>selectCartCount</code> và <code>selectCartTotal</code> (làm tròn 2 chữ số).' },
      ],
      hook: ['Immer (mutating syntax)'],
    },
    {
      ten: { en: 'Persist the cart', vi: 'Lưu bền giỏ' }, diem: 1,
      yeuCau: [{ en: 'Middleware <code>persistCart</code> writes <code>state.cart</code> to localStorage <code>cart</code> after every <code>cart/*</code> action; <code>loadCart()</code> feeds <code>preloadedState</code> (invalid JSON ⇒ ignore).', vi: 'Middleware <code>persistCart</code> ghi <code>state.cart</code> vào localStorage <code>cart</code> sau mỗi action <code>cart/*</code>; <code>loadCart()</code> cấp <code>preloadedState</code> (JSON hỏng ⇒ bỏ qua).' }],
      hook: ['middleware', 'preloadedState'], khoa: 'cart',
    },
    {
      ten: { en: 'Checkout thunk', vi: 'Thunk thanh toán' }, diem: 1.5,
      yeuCau: [
        { en: '<code>checkout = createAsyncThunk(\'orders/checkout\', async (_, { getState, dispatch }) => …)</code>: POST <code>{ items: [{ bookId, title, price, quantity }], total, createdAt }</code> to <code>/orders</code>, then <code>dispatch(clearCart())</code>.', vi: '<code>checkout = createAsyncThunk(\'orders/checkout\', async (_, { getState, dispatch }) => …)</code>: POST <code>{ items: [{ bookId, title, price, quantity }], total, createdAt }</code> tới <code>/orders</code>, rồi <code>dispatch(clearCart())</code>.' },
        { en: '<code>orders</code> slice: <code>status</code>, <code>lastOrder</code> (⇒ <code>Order #id placed</code>), error <code>Checkout failed</code> (cart kept).', vi: 'Slice <code>orders</code>: <code>status</code>, <code>lastOrder</code> (⇒ <code>Order #id placed</code>), lỗi <code>Checkout failed</code> (giữ giỏ).' },
      ],
      hook: ['thunkAPI.getState', 'thunkAPI.dispatch'],
    },
    {
      ten: { en: 'Action history (matcher)', vi: 'Lịch sử action (matcher)' }, diem: 1,
      yeuCau: [{ en: '<code>history</code> slice keeps the types of the last 5 <code>cart/*</code> actions, newest first, using <code>builder.addMatcher</code>.', vi: 'Slice <code>history</code> giữ tên 5 action <code>cart/*</code> gần nhất, mới nhất trước, dùng <code>builder.addMatcher</code>.' }],
      hook: ['addMatcher'],
    },
    {
      ten: { en: 'Logger middleware', vi: 'Middleware ghi log' }, diem: 1,
      yeuCau: [{ en: '<code>logger</code> prints <code>console.log(\'[redux]\', action.type)</code> for every action; add both middlewares with <code>getDefaultMiddleware().concat(…)</code> (keeps thunk).', vi: '<code>logger</code> in <code>console.log(\'[redux]\', action.type)</code> cho mọi action; thêm hai middleware bằng <code>getDefaultMiddleware().concat(…)</code> (giữ thunk).' }],
      hook: ['store => next => action'],
    },
  ],
  idBatBuoc: [
    ['#status · #error · #search · #category · #book-count · #book-{id}.book-item · .book-title · .btn-add', { en: 'book list (given App.js)', vi: 'danh sách sách (App.js đã cho)' }],
    ['#cart-count · #cart · #line-{id}.cart-line · .line-qty · .btn-inc · .btn-dec · .btn-remove · #cart-total', { en: 'cart', vi: 'giỏ' }],
    ['#btn-checkout · #order-success · #checkout-error · #history', { en: 'checkout + history', vi: 'thanh toán + lịch sử' }],
  ],
  truDiem: [
    { en: 'Replacing <code>middleware</code> with <code>[logger]</code> only — thunk disappears and <code>dispatch(fetchBooks())</code> throws.', vi: 'Gán <code>middleware: [logger]</code> — mất thunk, <code>dispatch(fetchBooks())</code> báo lỗi.' },
    { en: 'Calling the API inside a reducer (reducers must be pure).', vi: 'Gọi API trong reducer (reducer phải thuần).' },
    { en: 'Selector that builds a new array without <code>createSelector</code> — every store change re-renders the list.', vi: 'Selector tạo mảng mới mà không dùng <code>createSelector</code> — mỗi lần store đổi danh sách lại vẽ lại.' },
    { en: 'Clearing the cart before the POST succeeds — the order is lost on error.', vi: 'Xoá giỏ trước khi POST thành công — lỗi là mất đơn.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-12-lab-redux-bookstore',
  ten: 'Lab 12 — Book Store with Redux Toolkit',
  khoa: KHOA,
  baiHoc: 'fer202-12-1-redux-toolkit',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 12 — Book Store with Redux Toolkit (slices · async thunks · selectors · middleware)', vi: 'Lab 12 — Cửa hàng sách Redux Toolkit (slice · thunk · selector · middleware)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['configureStore', 'createSlice', 'createAsyncThunk', 'extraReducers', 'createSelector', 'middleware', 'preloadedState', 'addMatcher', 'useSelector', 'useDispatch'],
      tienQuyet: ['useEffect', 'axios', 'immutable update'],
      the: ['fer202', 'lab', 'redux', 'redux-toolkit'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'store', vi: 'kho trạng thái toàn cục duy nhất' },
        { en: 'slice', vi: 'một phần state + reducer + action của nó' },
        { en: 'thunk', vi: 'hàm dispatch được, chạy việc bất đồng bộ rồi dispatch tiếp' },
        { en: 'selector / memoized', vi: 'hàm đọc state / có ghi nhớ kết quả' },
        { en: 'middleware', vi: 'lớp chen giữa dispatch và reducer (log, lưu, gọi API…)' },
        { en: 'matcher', vi: 'điều kiện để một reducer bắt nhiều loại action' },
        { en: 'pure function', vi: 'hàm thuần — cùng đầu vào cùng kết quả, không tác dụng phụ' },
        ...tn('sideEffect', 'immutable', 'derived', 'persist', 'rubric'),
      ],
      goiY: [
        'App.js đã cho: đọc nó để biết mỗi slice phải XUẤT ra gì (selectBooks, setSearch, addToCart, checkout…).',
        'fetchBooks: createAsyncThunk("books/fetchBooks", async () => (await api.get("/books")).data); extraReducers: builder.addCase(fetchBooks.pending, …).addCase(…fulfilled…).addCase(…rejected…).',
        'Cart dùng Immer: line.quantity += 1 trong reducer là hợp lệ. Tổng: Math.round(sum * 100) / 100.',
        'Store: preloadedState: saved ? { cart: saved } : undefined; middleware: (gDM) => gDM().concat(logger, persistCart). History: builder.addMatcher(a => a.type.startsWith("cart/"), (s, a) => [a.type, ...s].slice(0, 5)).',
      ],
      loiHayGap: [
        '<code>middleware: [logger]</code> ghi đè mặc định ⇒ mất redux-thunk ⇒ "Actions must be plain objects".',
        'Vừa "sửa" nháp vừa <code>return</code> object mới trong cùng một reducer Immer ⇒ lỗi; chọn một trong hai.',
        'Gọi <code>api.get</code> trong reducer hoặc trong component rồi <code>dispatch(setBooks)</code> — mất trạng thái pending/rejected chuẩn.',
        '<code>useSelector(state =&gt; state.books.items.filter(…))</code> ⇒ mảng mới mỗi lần ⇒ render thừa (và cảnh báo của react-redux).',
        'Tổng tiền in <code>54.489999999</code> — quên làm tròn số thực.',
        'Lưu cả store vào localStorage (kể cả books/status) thay vì chỉ <code>cart</code>.',
      ],
      moTaNgan: 'Lab chương 12: cửa hàng sách Redux Toolkit — 5 slice, createAsyncThunk (tải + thanh toán), createSelector, middleware logger + lưu giỏ, preloadedState, addMatcher.',
      giaiThich: '<p>Mỗi phần state có slice riêng; dữ liệu máy chủ đi qua <code>createAsyncThunk</code> nên trạng thái loading/succeeded/failed là chuẩn và tách khỏi component. Dữ liệu suy ra (danh sách hiển thị, thể loại, số lượng, tổng) là selector <code>createSelector</code> — chỉ tính lại khi đầu vào đổi. Hai middleware nối sau middleware mặc định (để giữ thunk): <code>logger</code> in mọi action, <code>persistCart</code> ghi giỏ SAU khi reducer chạy; khi khởi động <code>loadCart</code> cấp <code>preloadedState</code>. Thunk <code>checkout</code> đọc state qua <code>getState</code>, POST đơn rồi mới <code>dispatch(clearCart())</code>; <code>history</code> dùng <code>addMatcher</code> để nghe mọi action <code>cart/*</code>.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['@reduxjs/toolkit', 'react-redux'], jsonServer: { base: B, db: DB }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://redux-toolkit.js.org/api/createAsyncThunk',
    },
  ],
});
