/**
 * FER202 · LAB BỔ SUNG (21/11/2026) — lấp khoảng trống lab đã soát trong docs/du-an-xuyen-suot-khoa.md §7:
 * Ch2 ES6 (0 lab) · Ch3 JSX (1) · Ch7 props & Context (0) · Ch12 Redux (2) · A2 Kiểm thử (0) · A3 TS & Next (0).
 * Mỗi chương thêm 2 lab: mục tiêu → cài đặt → code cho sẵn → nhiệm vụ → bẫy → "Đạt khi" → tự kiểm → lời giải (ẩn, cuối bài).
 *
 * MỌI đoạn code trong CODE đã CHẠY THẬT trước khi đưa vào đây (node 26 · react 18.3 · RTK 2 · vitest 2 + jsdom ·
 * @testing-library/react 16 · json-server 0.17.4 · TypeScript 5 strict · Next.js 15.5 `next build` + `next start`).
 * Kèm phép thử ngược: bản làm sai (class/for, `count && …`, nới kiểu Level, đổi biên < 3) làm bài tự kiểm ĐỎ.
 * CODE do script dựng chép nguyên văn từ thư mục đã chạy — sửa code thì sửa cả bản chạy thử rồi dựng lại.
 * Ghép vào FER202.mjs bằng `...labThem.ch2` (ngay sau phần bổ sung của chương, trước mốc dự án + quiz). Slug mới, không đụng slug cũ.
 */
import { bi } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const LAB_JS = `/code-lab/javascript${REF}`;
const LAB_REACT = `/code-lab/react${REF}`;
const LAB_FER = `/code-lab/fer202-practice${REF}`;   // track FER202 Practice — lab chấm tự động theo chương

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (s, lang = 'javascript') => `<pre><code class="language-${lang}">${esc(String(s).trim())}</code></pre>`;
const tep = (name, s, lang) => `<p><b>📄 <code>${name}</code></b></p>\n${pre(s, lang)}`;

const CODE = {
 "l21_sol": "// courses.mjs — Lab 2.1 SOLUTION (pure ES6, no React yet)\nexport const courses = [\n  { id: 1, title: 'React Basics', price: 299000, tags: ['react', 'jsx'], level: 'beginner' },\n  { id: 2, title: 'Redux Toolkit', price: 499000, tags: ['redux'], level: 'intermediate' },\n  { id: 3, title: 'Next.js App Router', price: 0, tags: ['next', 'react'], level: 'advanced' },\n];\n\nexport const formatPrice = (vnd) =>\n  vnd === 0 ? 'Free' : `${vnd.toLocaleString('vi-VN')} ₫`;\n\nexport const describe = ({ title, level, price }) =>\n  `${title} (${level}) — ${formatPrice(price)}`;\n\nexport const nextId = (list) => Math.max(0, ...list.map((c) => c.id)) + 1;\n\nexport const addCourse = (list, course) => [...list, { ...course, id: nextId(list) }];\n\nexport const updateCourse = (list, id, patch) =>\n  list.map((c) => (c.id === id ? { ...c, ...patch } : c));\n\nexport const removeCourse = (list, id) => list.filter((c) => c.id !== id);\n\nexport const byTag = (list, tag) => list.filter(({ tags }) => tags.includes(tag));\n\nexport const totalPrice = (list) => list.reduce((sum, { price }) => sum + price, 0);",
 "l21_check": "// check.mjs — run: node check.mjs   (every line must print PASS)\nimport assert from 'node:assert/strict';\nimport * as L from './courses.mjs';\n\nconst t = (name, fn) => { try { fn(); console.log('PASS', name); } catch (e) { console.log('FAIL', name, '—', e.message); process.exitCode = 1; } };\nconst snapshot = JSON.stringify(L.courses);\n\nt('formatPrice', () => { assert.equal(L.formatPrice(0), 'Free'); assert.equal(L.formatPrice(299000), '299.000 ₫'); });\nt('describe', () => assert.equal(L.describe(L.courses[1]), 'Redux Toolkit (intermediate) — 499.000 ₫'));\nt('addCourse', () => {\n  const out = L.addCourse(L.courses, { title: 'TS', price: 100000, tags: ['ts'], level: 'beginner' });\n  assert.equal(out.length, 4); assert.equal(out[3].id, 4); assert.notEqual(out, L.courses);\n});\nt('updateCourse', () => {\n  const out = L.updateCourse(L.courses, 2, { price: 399000 });\n  assert.equal(out[1].price, 399000); assert.equal(out[1].title, 'Redux Toolkit');\n  assert.notEqual(out[1], L.courses[1]); assert.equal(out[0], L.courses[0]);\n});\nt('removeCourse', () => assert.deepEqual(L.removeCourse(L.courses, 1).map((c) => c.id), [2, 3]));\nt('byTag', () => assert.deepEqual(L.byTag(L.courses, 'react').map((c) => c.id), [1, 3]));\nt('totalPrice', () => assert.equal(L.totalPrice(L.courses), 798000));\nt('nextId on empty list', () => assert.equal(L.nextId([]), 1));\nt('original array untouched', () => assert.equal(JSON.stringify(L.courses), snapshot));",
 "l22_api": "// fakeApi.mjs — GIVEN (do not edit): a tiny fake server with 300 ms latency\nconst DB = {\n  '/courses': [{ id: 1, title: 'React Basics' }, { id: 2, title: 'Redux Toolkit' }],\n  '/teachers': [{ id: 10, name: 'Ms. Lan' }],\n};\nexport function fakeFetch(url) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (url in DB) resolve({ ok: true, status: 200, json: async () => structuredClone(DB[url]) });\n      else if (url === '/crash') reject(new TypeError('Failed to fetch'));\n      else resolve({ ok: false, status: 404, json: async () => ({ message: 'Not found' }) });\n    }, 300);\n  });\n}",
 "l22_sol": "// solution.mjs — Lab 2.2 SOLUTION\nimport { fakeFetch } from './fakeApi.mjs';\n\n// 1) fetch does NOT reject on 404 — turn !ok into an Error yourself\nexport async function getJson(url) {\n  const res = await fakeFetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);\n  return res.json();\n}\n\n// 2) Two independent requests ⇒ run them in PARALLEL\nexport async function loadHome() {\n  const [courses, teachers] = await Promise.all([getJson('/courses'), getJson('/teachers')]);\n  return { courses, teachers };\n}\n\n// 3) Never let the screen crash: return a fallback + an error message\nexport async function safeGet(url, fallback = []) {\n  try {\n    return { data: await getJson(url), error: null };\n  } catch (e) {\n    return { data: fallback, error: e.message };\n  }\n}\n\n// 4) Same thing with .then/.catch chaining (what the slides show first)\nexport const getTitles = () =>\n  getJson('/courses').then((list) => list.map(({ title }) => title)).catch(() => []);",
 "l22_check": "// check.mjs — run: node check.mjs\nimport assert from 'node:assert/strict';\nimport * as S from './solution.mjs';\nconst t = async (name, fn) => { try { await fn(); console.log('PASS', name); } catch (e) { console.log('FAIL', name, '—', e.message); process.exitCode = 1; } };\n\nawait t('getJson ok', async () => assert.equal((await S.getJson('/courses')).length, 2));\nawait t('getJson 404 rejects', () => assert.rejects(S.getJson('/nope'), /HTTP 404/));\nawait t('loadHome runs in parallel (< 500 ms)', async () => {\n  const t0 = Date.now(); const r = await S.loadHome(); const ms = Date.now() - t0;\n  assert.equal(r.teachers[0].name, 'Ms. Lan'); assert.ok(ms < 500, `took ${ms} ms — did you await them one by one?`);\n});\nawait t('safeGet 404 → fallback', async () => assert.deepEqual(await S.safeGet('/nope'), { data: [], error: 'HTTP 404 at /nope' }));\nawait t('safeGet network error → fallback', async () => assert.equal((await S.safeGet('/crash')).error, 'Failed to fetch'));\nawait t('getTitles', async () => assert.deepEqual(await S.getTitles(), ['React Basics', 'Redux Toolkit']));",
 "l31_card": "// src/components/CourseCard.jsx — Lab 3.1 SOLUTION\nexport default function CourseCard({ course, onEnroll }) {\n  const { title, image, seats, soldOut } = course;\n  return (\n    <div className=\"card\" style={{ width: '18rem', marginTop: 8 }}>\n      {/* course card */}\n      <img src={image} alt={title} className=\"card-img-top\" />\n      <div className=\"card-body\">\n        <h5 className=\"card-title\">{title}</h5>\n        <label htmlFor={`qty-${course.id}`}>Seats</label>\n        <input id={`qty-${course.id}`} type=\"number\" value={seats} readOnly />\n        <button className=\"btn btn-primary\" onClick={() => onEnroll(course.id)} disabled={soldOut}>\n          Enroll\n        </button>\n      </div>\n    </div>\n  );\n}",
 "l31_list": "// src/components/CourseList.jsx — Lab 3.1 SOLUTION\nimport CourseCard from './CourseCard.jsx';\n\nexport default function CourseList({ courses, onEnroll }) {\n  return (\n    <div className=\"d-flex gap-3 flex-wrap\">\n      {courses.map((c) => (\n        <CourseCard key={c.id} course={c} onEnroll={onEnroll} />\n      ))}\n    </div>\n  );\n}",
 "l31_test": "// lab31.test.jsx — self-check (npx vitest run)\nimport { render, screen, fireEvent, cleanup } from '@testing-library/react';\nimport { test, expect, vi, afterEach } from 'vitest';\nimport CourseList from './CourseList.jsx';\n\nconst data = [\n  { id: 1, title: 'React Basics', image: 'react.png', seats: 1, soldOut: false },\n  { id: 2, title: 'Redux Toolkit', image: 'redux.png', seats: 0, soldOut: true },\n];\nconst errors = vi.spyOn(console, 'error');\nafterEach(() => { cleanup(); errors.mockClear(); });\n\ntest('renders one card per course, no React warnings', () => {\n  const { container } = render(<CourseList courses={data} onEnroll={() => {}} />);\n  expect(container.querySelectorAll('.card')).toHaveLength(2);\n  expect(container.querySelector('.card').getAttribute('style')).toBe('width: 18rem; margin-top: 8px;');\n  expect(screen.getAllByLabelText('Seats')).toHaveLength(2);   // htmlFor wired\n  expect(errors).not.toHaveBeenCalled();                        // no key / class / for warnings\n});\n\ntest('button calls onEnroll with the id and respects soldOut', () => {\n  const onEnroll = vi.fn();\n  render(<CourseList courses={data} onEnroll={onEnroll} />);\n  const [b1, b2] = screen.getAllByRole('button', { name: 'Enroll' });\n  fireEvent.click(b1);\n  expect(onEnroll).toHaveBeenCalledWith(1);\n  expect(b2.disabled).toBe(true);\n});",
 "l32_sol": "// src/components/EnrollPanel.jsx — Lab 3.2 SOLUTION\nimport { Fragment } from 'react';\n\nexport default function EnrollPanel({ course, cartCount, lessons }) {\n  // 1) early return while data is missing\n  if (!course) return <p className=\"text-muted\">Loading…</p>;\n\n  // 2) <> … </> groups siblings without an extra <div>\n  return (\n    <>\n      <h2>\n        {course.title}\n        {/* 3) && — show only when true */}\n        {course.isNew && <span className=\"badge bg-success ms-2\">NEW</span>}\n      </h2>\n      {/* 4) ternary — choose between two outputs */}\n      <p>{course.seats > 0 ? `${course.seats} seats left` : 'Sold out'}</p>\n      {/* 5) compare explicitly: `cartCount && …` would print \"0\" */}\n      {cartCount > 0 && <p className=\"cart\">In cart: {cartCount}</p>}\n      <dl>\n        {lessons.map((l) => (\n          // 6) a list of fragments needs <Fragment key>, the short <> cannot take a key\n          <Fragment key={l.id}>\n            <dt>{l.title}</dt>\n            <dd>{l.minutes} min</dd>\n          </Fragment>\n        ))}\n      </dl>\n    </>\n  );\n}",
 "l32_test": "// lab32.test.jsx — self-check (npx vitest run)\nimport { render, cleanup } from '@testing-library/react';\nimport { test, expect, vi, afterEach } from 'vitest';\nimport EnrollPanel from './EnrollPanel.jsx';\n\nconst errors = vi.spyOn(console, 'error');\nafterEach(() => { cleanup(); errors.mockClear(); });\nconst course = { title: 'React Basics', isNew: true, seats: 0 };\nconst lessons = [{ id: 1, title: 'JSX', minutes: 12 }, { id: 2, title: 'Props', minutes: 15 }];\n\ntest('loading state', () => {\n  const { container } = render(<EnrollPanel course={null} cartCount={0} lessons={[]} />);\n  expect(container.textContent).toBe('Loading…');\n});\ntest('sold out + NEW badge, and the \"0\" trap is gone', () => {\n  const { container } = render(<EnrollPanel course={course} cartCount={0} lessons={lessons} />);\n  expect(container.textContent).toContain('Sold out');\n  expect(container.querySelector('.badge').textContent).toBe('NEW');\n  expect(container.querySelector('.cart')).toBeNull();\n  expect(container.textContent).not.toMatch(/Sold out0|^0|0$/);\n});\ntest('no wrapper div, dt/dd pairs, no key warning', () => {\n  const { container } = render(<EnrollPanel course={{ ...course, seats: 3 }} cartCount={2} lessons={lessons} />);\n  expect(container.firstChild.tagName).toBe('H2');\n  expect(container.querySelectorAll('dl > dt')).toHaveLength(2);\n  expect(container.querySelector('dl').innerHTML).toBe('<dt>JSX</dt><dd>12 min</dd><dt>Props</dt><dd>15 min</dd>');\n  expect(container.textContent).toContain('3 seats left');\n  expect(container.querySelector('.cart').textContent).toBe('In cart: 2');\n  expect(errors).not.toHaveBeenCalled();\n});",
 "l71_start": "// src/App.jsx — GIVEN starter (prop drilling): cart props travel through Layout and Main\n//                that never use them. Your job: remove every cart prop from Layout/Main.\nimport { useState } from 'react';\n\nconst PRODUCTS = [\n  { id: 1, title: 'React Basics', price: 300 },\n  { id: 2, title: 'Redux Toolkit', price: 500 },\n];\n\nfunction Header({ count }) { return <header>Cart: {count} item(s)</header>; }\nfunction ProductList({ onAdd }) {\n  return <ul>{PRODUCTS.map((p) => <li key={p.id}>{p.title} <button onClick={() => onAdd(p)}>Add {p.title}</button></li>)}</ul>;\n}\nfunction Main({ onAdd }) { return <main><ProductList onAdd={onAdd} /></main>; }          // only passes it on\nfunction Layout({ count, onAdd }) { return <><Header count={count} /><Main onAdd={onAdd} /></>; } // only passes it on\n\nexport default function App() {\n  const [items, setItems] = useState([]);\n  const add = (p) => setItems([...items, p]);\n  return <Layout count={items.length} onAdd={add} />;\n}",
 "l71_ctx": "// src/context/CartContext.jsx — Lab 7.1 SOLUTION\nimport { createContext, useContext, useState } from 'react';\n\nconst CartContext = createContext(null);\n\nexport function CartProvider({ children }) {\n  const [items, setItems] = useState([]);          // [{ id, title, price, qty }]\n\n  const add = (p) =>\n    setItems((prev) =>\n      prev.some((i) => i.id === p.id)\n        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))\n        : [...prev, { ...p, qty: 1 }]\n    );\n  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));\n  const count = items.reduce((n, i) => n + i.qty, 0);\n  const total = items.reduce((s, i) => s + i.qty * i.price, 0);\n\n  return (\n    <CartContext.Provider value={{ items, add, remove, count, total }}>\n      {children}\n    </CartContext.Provider>\n  );\n}\n\nexport function useCart() {\n  const ctx = useContext(CartContext);\n  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');\n  return ctx;\n}",
 "l71_app": "// src/App.jsx — Lab 7.1 SOLUTION: Header and ProductList no longer receive cart props\nimport { CartProvider, useCart } from './CartContext.jsx';\n\nconst PRODUCTS = [\n  { id: 1, title: 'React Basics', price: 300 },\n  { id: 2, title: 'Redux Toolkit', price: 500 },\n];\n\nexport function Header() {\n  const { count, total } = useCart();\n  return <header>Cart: {count} item(s) — {total} k₫</header>;\n}\n\nexport function ProductList() {\n  const { add } = useCart();\n  return (\n    <ul>\n      {PRODUCTS.map((p) => (\n        <li key={p.id}>\n          {p.title} <button onClick={() => add(p)}>Add {p.title}</button>\n        </li>\n      ))}\n    </ul>\n  );\n}\n\nexport function CartPanel() {\n  const { items, remove } = useCart();\n  if (items.length === 0) return <p>Your cart is empty.</p>;\n  return (\n    <ol>\n      {items.map((i) => (\n        <li key={i.id}>\n          {i.title} × {i.qty} <button onClick={() => remove(i.id)}>Remove {i.title}</button>\n        </li>\n      ))}\n    </ol>\n  );\n}\n\nexport default function App() {\n  return (\n    <CartProvider>\n      <Header />\n      <ProductList />\n      <CartPanel />\n    </CartProvider>\n  );\n}",
 "l71_test": "// lab71.test.jsx — self-check (npx vitest run)\nimport { render, screen, fireEvent, cleanup } from '@testing-library/react';\nimport { test, expect, vi, afterEach } from 'vitest';\nimport App, { Header } from './App.jsx';\nafterEach(cleanup);\n\ntest('adding twice increases qty, header updates without props', () => {\n  render(<App />);\n  fireEvent.click(screen.getByText('Add React Basics'));\n  fireEvent.click(screen.getByText('Add React Basics'));\n  fireEvent.click(screen.getByText('Add Redux Toolkit'));\n  expect(screen.getByRole('banner').textContent).toBe('Cart: 3 item(s) — 1100 k₫');\n  expect(screen.getByText(/React Basics × 2/)).toBeTruthy();\n});\ntest('remove works and empty message comes back', () => {\n  render(<App />);\n  fireEvent.click(screen.getByText('Add Redux Toolkit'));\n  fireEvent.click(screen.getByText('Remove Redux Toolkit'));\n  expect(screen.getByText('Your cart is empty.')).toBeTruthy();\n  expect(screen.getByRole('banner').textContent).toBe('Cart: 0 item(s) — 0 k₫');\n});\ntest('using the hook outside the provider throws a clear error', () => {\n  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});\n  expect(() => render(<Header />)).toThrow('useCart must be used inside <CartProvider>');\n  spy.mockRestore();\n});",
 "l72_panel": "// src/components/Panel.jsx — Lab 7.2 SOLUTION (children + named \"slots\")\nexport default function Panel({ title, actions, footer, children }) {\n  return (\n    <section className=\"card\">\n      <div className=\"card-header d-flex justify-content-between\">\n        <h3>{title}</h3>\n        {actions && <div className=\"actions\">{actions}</div>}\n      </div>\n      <div className=\"card-body\">{children}</div>\n      {footer && <div className=\"card-footer\">{footer}</div>}\n    </section>\n  );\n}",
 "l72_list": "// src/components/DataList.jsx — Lab 7.2 SOLUTION (render prop + default props)\nexport default function DataList({ items, renderItem, empty = 'No data.', getKey = (x) => x.id }) {\n  if (items.length === 0) return <p className=\"empty\">{empty}</p>;\n  return <ul>{items.map((it, i) => <li key={getKey(it)}>{renderItem(it, i)}</li>)}</ul>;\n}",
 "l72_test": "// lab72.test.jsx — self-check (npx vitest run)\nimport { render, cleanup } from '@testing-library/react';\nimport { test, expect, vi, afterEach } from 'vitest';\nimport Panel from './Panel.jsx';\nimport DataList from './DataList.jsx';\nconst errors = vi.spyOn(console, 'error');\nafterEach(() => { cleanup(); errors.mockClear(); });\n\nconst books = [{ id: 'b1', title: 'Clean Code', stock: 0 }, { id: 'b2', title: 'Refactoring', stock: 4 }];\n\ntest('Panel puts children in the body and only renders slots that were passed', () => {\n  const { container } = render(<Panel title=\"Books\"><p>Hello</p></Panel>);\n  expect(container.querySelector('.card-body').innerHTML).toBe('<p>Hello</p>');\n  expect(container.querySelector('.card-footer')).toBeNull();\n  expect(container.querySelector('.actions')).toBeNull();\n});\ntest('the SAME DataList renders two different looks via renderItem', () => {\n  const a = render(<DataList items={books} renderItem={(b) => b.title} />);\n  expect(a.container.textContent).toBe('Clean CodeRefactoring');\n  cleanup();\n  const b = render(<DataList items={books} renderItem={(x, i) => <b>{i + 1}. {x.title} ({x.stock > 0 ? 'in stock' : 'out'})</b>} />);\n  expect(b.container.querySelectorAll('li b')[0].textContent).toBe('1. Clean Code (out)');\n  expect(errors).not.toHaveBeenCalled();\n});\ntest('empty list → default message, custom message overrides', () => {\n  expect(render(<DataList items={[]} renderItem={() => null} />).container.textContent).toBe('No data.');\n  cleanup();\n  expect(render(<DataList items={[]} renderItem={() => null} empty=\"No books yet\" />).container.textContent).toBe('No books yet');\n});\ntest('composition: a DataList inside a Panel with a footer slot', () => {\n  const { container } = render(\n    <Panel title=\"Library\" footer={<small>{books.length} books</small>} actions={<button>Add</button>}>\n      <DataList items={books} renderItem={(b) => b.title} />\n    </Panel>\n  );\n  expect(container.querySelectorAll('.card-body li')).toHaveLength(2);\n  expect(container.querySelector('.card-footer').textContent).toBe('2 books');\n});",
 "l121_slice": "// src/features/cart/cartSlice.js — Lab 12.1 SOLUTION\nimport { createSlice, createSelector } from '@reduxjs/toolkit';\n\nconst cartSlice = createSlice({\n  name: 'cart',\n  initialState: { items: [], coupon: null },     // items: [{ id, title, price, qty }]\n  reducers: {\n    addItem(state, action) {\n      const found = state.items.find((i) => i.id === action.payload.id);\n      if (found) found.qty += 1;                    // Immer: \"mutating\" a draft is safe here\n      else state.items.push({ ...action.payload, qty: 1 });\n    },\n    changeQty(state, action) {\n      const { id, qty } = action.payload;\n      if (qty <= 0) state.items = state.items.filter((i) => i.id !== id);\n      else state.items.find((i) => i.id === id).qty = qty;\n    },\n    removeItem(state, action) {\n      state.items = state.items.filter((i) => i.id !== action.payload);\n    },\n    applyCoupon: {\n      reducer(state, action) { state.coupon = action.payload; },\n      prepare(code) { return { payload: code.trim().toUpperCase() }; },\n    },\n    clearCart() {\n      return { items: [], coupon: null };          // returning a new state also works\n    },\n  },\n});\n\nexport const { addItem, changeQty, removeItem, applyCoupon, clearCart } = cartSlice.actions;\nexport default cartSlice.reducer;\n\n// selectors — components read DERIVED data, never recompute it themselves\nexport const selectItems = (state) => state.cart.items;\nexport const selectCount = (state) => state.cart.items.reduce((n, i) => n + i.qty, 0);\nexport const selectSubtotal = createSelector([selectItems], (items) =>\n  items.reduce((s, i) => s + i.qty * i.price, 0)\n);\nexport const selectTotal = createSelector(\n  [selectSubtotal, (state) => state.cart.coupon],\n  (sub, coupon) => (coupon === 'FER202' ? Math.round(sub * 0.9) : sub)\n);",
 "l121_store": "// src/app/store.js — Lab 12.1 SOLUTION\nimport { configureStore } from '@reduxjs/toolkit';\nimport cartReducer from './cartSlice.js';\nexport const makeStore = () => configureStore({ reducer: { cart: cartReducer } });",
 "l121_check": "// check.mjs — run: node check.mjs (no React needed: a store is plain JS)\nimport assert from 'node:assert/strict';\nimport { makeStore } from './store.js';\nimport * as C from './cartSlice.js';\nconst t = (name, fn) => { try { fn(); console.log('PASS', name); } catch (e) { console.log('FAIL', name, '—', e.message); process.exitCode = 1; } };\n\nconst store = makeStore();\nconst before = store.getState();\nstore.dispatch(C.addItem({ id: 1, title: 'React Basics', price: 300 }));\nstore.dispatch(C.addItem({ id: 1, title: 'React Basics', price: 300 }));\nstore.dispatch(C.addItem({ id: 2, title: 'Redux Toolkit', price: 500 }));\nt('addItem twice → qty 2', () => assert.equal(C.selectItems(store.getState())[0].qty, 2));\nt('count & subtotal', () => { assert.equal(C.selectCount(store.getState()), 3); assert.equal(C.selectSubtotal(store.getState()), 1100); });\nt('old state object was not mutated', () => assert.equal(before.cart.items.length, 0));\nstore.dispatch(C.applyCoupon('  fer202 '));\nt('prepare() normalises the coupon', () => assert.equal(store.getState().cart.coupon, 'FER202'));\nt('total applies 10% off', () => assert.equal(C.selectTotal(store.getState()), 990));\nconst s1 = store.getState();\nt('memoised selector returns the same value for the same state', () => assert.equal(C.selectSubtotal(s1), C.selectSubtotal(s1)));\nstore.dispatch(C.changeQty({ id: 2, qty: 0 }));\nt('qty 0 removes the line', () => assert.deepEqual(C.selectItems(store.getState()).map((i) => i.id), [1]));\nstore.dispatch(C.removeItem(1));\nt('removeItem', () => assert.equal(C.selectCount(store.getState()), 0));\nstore.dispatch(C.addItem({ id: 3, title: 'TS', price: 100 }));\nstore.dispatch(C.clearCart());\nt('clearCart', () => assert.deepEqual(store.getState().cart, { items: [], coupon: null }));\nt('action type naming', () => assert.equal(C.addItem.type, 'cart/addItem'));",
 "l122_db": "{\n  \"books\": [\n    { \"id\": 1, \"title\": \"Clean Code\", \"author\": \"Robert C. Martin\", \"available\": true },\n    { \"id\": 2, \"title\": \"Refactoring\", \"author\": \"Martin Fowler\", \"available\": false }\n  ]\n}",
 "l122_slice": "// src/features/books/booksSlice.js — Lab 12.2 SOLUTION\nimport { createSlice, createAsyncThunk } from '@reduxjs/toolkit';\nimport axios from 'axios';\n\nconst API = 'http://localhost:9999/books';   // in Vite: import.meta.env.VITE_API_URL\n\nexport const fetchBooks = createAsyncThunk('books/fetchAll', async () => {\n  const res = await axios.get(API);\n  return res.data;                                     // → action.payload\n});\n\nexport const addBook = createAsyncThunk('books/add', async (book) => {\n  const res = await axios.post(API, book);\n  return res.data;                                     // json-server returns the saved record (with id)\n});\n\nexport const toggleAvailable = createAsyncThunk('books/toggle', async (book) => {\n  const res = await axios.patch(`${API}/${book.id}`, { available: !book.available });\n  return res.data;\n});\n\nexport const deleteBook = createAsyncThunk('books/delete', async (id, { rejectWithValue }) => {\n  try {\n    await axios.delete(`${API}/${id}`);\n    return id;\n  } catch (e) {\n    return rejectWithValue(e.response?.status === 404 ? 'Book not found' : e.message);\n  }\n});\n\nconst booksSlice = createSlice({\n  name: 'books',\n  initialState: { items: [], status: 'idle', error: null },   // idle | loading | succeeded | failed\n  reducers: {},\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchBooks.pending, (s) => { s.status = 'loading'; s.error = null; })\n      .addCase(fetchBooks.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })\n      .addCase(fetchBooks.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })\n      .addCase(addBook.fulfilled, (s, a) => { s.items.push(a.payload); })\n      .addCase(toggleAvailable.fulfilled, (s, a) => {\n        const i = s.items.findIndex((b) => b.id === a.payload.id);\n        if (i !== -1) s.items[i] = a.payload;\n      })\n      .addCase(deleteBook.fulfilled, (s, a) => { s.items = s.items.filter((b) => b.id !== a.payload); })\n      .addCase(deleteBook.rejected, (s, a) => { s.error = a.payload; });\n  },\n});\n\nexport default booksSlice.reducer;\nexport const selectAvailable = (state) => state.books.items.filter((b) => b.available);",
 "l122_check": "// check.mjs — start json-server first:  npx json-server --watch db.json --port 9999\n// then:  node check.mjs\nimport assert from 'node:assert/strict';\nimport { configureStore } from '@reduxjs/toolkit';\nimport books, * as B from './booksSlice.js';\nconst t = async (name, fn) => { try { await fn(); console.log('PASS', name); } catch (e) { console.log('FAIL', name, '—', e.message); process.exitCode = 1; } };\n\nconst store = configureStore({ reducer: { books } });\nconst p = store.dispatch(B.fetchBooks());\nawait t('status is \"loading\" while the request is in flight', () => assert.equal(store.getState().books.status, 'loading'));\nawait p;\nawait t('fetchBooks → succeeded + 2 items', () => { assert.equal(store.getState().books.status, 'succeeded'); assert.equal(store.getState().books.items.length, 2); });\nawait t('addBook gets an id from the server', async () => {\n  const r = await store.dispatch(B.addBook({ title: 'You Don\\'t Know JS', author: 'Kyle Simpson', available: true }));\n  assert.equal(r.meta.requestStatus, 'fulfilled'); assert.ok(r.payload.id);\n});\nawait t('toggleAvailable uses PATCH and keeps the other fields', async () => {\n  const b2 = store.getState().books.items.find((b) => b.id === 2);\n  await store.dispatch(B.toggleAvailable(b2));\n  const now = store.getState().books.items.find((b) => b.id === 2);\n  assert.equal(now.available, true); assert.equal(now.title, 'Refactoring');\n});\nawait t('selectAvailable', () => assert.equal(B.selectAvailable(store.getState()).length, 3));\nawait t('deleteBook removes it on the server too', async () => {\n  await store.dispatch(B.deleteBook(1));\n  assert.ok(!store.getState().books.items.some((b) => b.id === 1));\n  const again = await fetch('http://localhost:9999/books/1');\n  assert.equal(again.status, 404);\n});\nawait t('deleting a missing id → rejected with a readable message', async () => {\n  const r = await store.dispatch(B.deleteBook(999));\n  assert.equal(r.meta.requestStatus, 'rejected'); assert.equal(store.getState().books.error, 'Book not found');\n});",
 "a21_src": "// src/utils/validate.js — GIVEN code under test (Lab A2.1)\nexport function validateBook(f) {\n  const e = {};\n  const title = (f.title ?? '').trim();\n  if (!title) e.title = 'Title is required.';\n  else if (title.length < 3) e.title = 'Title must have at least 3 characters.';\n\n  const year = String(f.year ?? '').trim();\n  if (!/^\\d{4}$/.test(year)) e.year = 'Year must be 4 digits.';\n  else if (Number(year) > new Date().getFullYear()) e.year = 'Year cannot be in the future.';\n\n  if (!f.category) e.category = 'Please choose a category.';\n  return e;                      // {} = valid\n}\n\nexport function cartTotal(items, coupon) {\n  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);\n  return coupon === 'FER202' ? Math.round(sub * 0.9) : sub;\n}",
 "a21_test": "// src/utils/validate.test.js — Lab A2.1 SOLUTION (works in Vitest and Jest: same describe/it/expect API)\nimport { describe, it, expect, vi, afterEach } from 'vitest';   // Jest: delete this line\nimport { validateBook, cartTotal } from './validate.js';\n\nconst ok = { title: 'Clean Code', year: '2008', category: 'Programming' };\n\ndescribe('validateBook', () => {\n  afterEach(() => vi.useRealTimers());\n\n  it('returns {} for a valid form', () => {\n    expect(validateBook(ok)).toEqual({});\n  });\n  it('requires a title — spaces only count as empty', () => {\n    expect(validateBook({ ...ok, title: '   ' }).title).toBe('Title is required.');\n  });\n  it('rejects titles shorter than 3 characters (boundary 2 vs 3)', () => {\n    expect(validateBook({ ...ok, title: 'JS' }).title).toMatch(/at least 3/);\n    expect(validateBook({ ...ok, title: 'C++' }).title).toBeUndefined();\n  });\n  it.each(['99', '20O8', '', '12345'])('rejects year %j', (year) => {\n    expect(validateBook({ ...ok, year }).year).toBe('Year must be 4 digits.');\n  });\n  it('rejects a future year — time is frozen so the test never goes stale', () => {\n    vi.useFakeTimers();\n    vi.setSystemTime(new Date('2026-11-21'));\n    expect(validateBook({ ...ok, year: '2027' }).year).toBe('Year cannot be in the future.');\n    expect(validateBook({ ...ok, year: '2026' }).year).toBeUndefined();\n  });\n  it('reports several errors at once', () => {\n    expect(Object.keys(validateBook({}))).toEqual(['title', 'year', 'category']);\n  });\n});\n\ndescribe('cartTotal', () => {\n  const items = [{ price: 300, qty: 2 }, { price: 500, qty: 1 }];\n  it('sums price × qty', () => expect(cartTotal(items)).toBe(1100));\n  it('empty cart is 0', () => expect(cartTotal([])).toBe(0));\n  it('coupon FER202 takes 10% off and rounds', () => expect(cartTotal([{ price: 333, qty: 1 }], 'FER202')).toBe(300));\n  it('unknown coupon changes nothing', () => expect(cartTotal(items, 'fer202')).toBe(1100));\n});",
 "a22_cfg": "// vite.config.js (or vitest.config.js) — Lab A2.2 setup\nimport { defineConfig } from 'vitest/config';\nexport default defineConfig({\n  esbuild: { jsx: 'automatic' },          // with @vitejs/plugin-react you can drop this line\n  test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.js' },\n});",
 "a22_setup": "// src/setupTests.js — adds toBeInTheDocument(), toBeDisabled()… to expect\nimport '@testing-library/jest-dom/vitest';",
 "a22_comp": "// src/components/BookSearch.jsx — GIVEN component under test (Lab A2.2)\nimport { useEffect, useState } from 'react';\n\nexport default function BookSearch({ api = 'http://localhost:9999/books' }) {\n  const [books, setBooks] = useState([]);\n  const [q, setQ] = useState('');\n  const [error, setError] = useState('');\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(api)\n      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })\n      .then(setBooks)\n      .catch((e) => setError(e.message))\n      .finally(() => setLoading(false));\n  }, [api]);\n\n  const remove = (b) => {\n    if (!window.confirm(`Delete \"${b.title}\"?`)) return;\n    setBooks((prev) => prev.filter((x) => x.id !== b.id));\n  };\n\n  const shown = books.filter((b) => b.title.toLowerCase().includes(q.trim().toLowerCase()));\n  if (loading) return <p>Loading…</p>;\n  if (error) return <p role=\"alert\">Could not load books: {error}</p>;\n  return (\n    <div>\n      <label htmlFor=\"q\">Search</label>\n      <input id=\"q\" value={q} onChange={(e) => setQ(e.target.value)} />\n      {shown.length === 0 ? <p>No books found.</p> : (\n        <ul>\n          {shown.map((b) => (\n            <li key={b.id}>{b.title} <button onClick={() => remove(b)}>Delete {b.title}</button></li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}",
 "a22_test": "// src/components/BookSearch.test.jsx — Lab A2.2 SOLUTION\nimport { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport BookSearch from './BookSearch.jsx';\n\nconst BOOKS = [{ id: 1, title: 'Clean Code' }, { id: 2, title: 'Refactoring' }, { id: 3, title: 'Clean Architecture' }];\nconst okResponse = (data) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });\n\nbeforeEach(() => { vi.stubGlobal('fetch', vi.fn(() => okResponse(BOOKS))); });\nafterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });\n\ntest('shows Loading… first, then the list (findBy waits for async UI)', async () => {\n  render(<BookSearch />);\n  expect(screen.getByText('Loading…')).toBeInTheDocument();\n  expect(await screen.findByText('Clean Code')).toBeInTheDocument();\n  expect(screen.getAllByRole('listitem')).toHaveLength(3);\n  expect(fetch).toHaveBeenCalledWith('http://localhost:9999/books');\n});\n\ntest('typing filters the list, case-insensitive', async () => {\n  const user = userEvent.setup();\n  render(<BookSearch />);\n  await user.type(await screen.findByLabelText('Search'), '  CLEAN ');\n  expect(screen.getAllByRole('listitem')).toHaveLength(2);\n  expect(screen.queryByText('Refactoring')).not.toBeInTheDocument();   // queryBy: returns null, does not throw\n  await user.clear(screen.getByLabelText('Search'));\n  await user.type(screen.getByLabelText('Search'), 'zzz');\n  expect(screen.getByText('No books found.')).toBeInTheDocument();\n});\n\ntest('delete asks for confirmation: Cancel keeps it, OK removes it', async () => {\n  const user = userEvent.setup();\n  const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);\n  render(<BookSearch />);\n  const btn = await screen.findByRole('button', { name: 'Delete Refactoring' });\n  await user.click(btn);\n  expect(screen.getByText('Refactoring')).toBeInTheDocument();\n  await user.click(btn);\n  expect(confirm).toHaveBeenLastCalledWith('Delete \"Refactoring\"?');\n  expect(screen.queryByText('Refactoring')).not.toBeInTheDocument();\n});\n\ntest('HTTP 500 shows an alert instead of crashing', async () => {\n  fetch.mockImplementationOnce(() => Promise.resolve({ ok: false, status: 500 }));\n  render(<BookSearch />);\n  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load books: HTTP 500');\n});",
 "a31_types": "// src/types.ts — Lab A3.1 SOLUTION\nexport type Level = 'beginner' | 'intermediate' | 'advanced';      // union: only these 3 strings\n\nexport interface Course {\n  id: number;\n  title: string;\n  price: number;\n  level: Level;\n  tags: string[];\n  teacher?: string;                                                  // optional\n}",
 "a31_card": "// src/components/CourseCard.tsx — Lab A3.1 SOLUTION\nimport type { Course } from './types';\n\ninterface CourseCardProps {\n  course: Course;\n  onEnroll: (id: number) => void;\n  highlight?: boolean;\n}\n\nexport default function CourseCard({ course, onEnroll, highlight = false }: CourseCardProps) {\n  return (\n    <div className={highlight ? 'card border-primary' : 'card'}>\n      <h5>{course.title}</h5>\n      <p>{course.teacher ?? 'TBA'} · {course.level}</p>\n      <button onClick={() => onEnroll(course.id)}>Enroll</button>\n    </div>\n  );\n}",
 "a31_list": "// src/components/DataList.tsx — Lab A3.1 SOLUTION: one generic list for ANY item type\nimport type { ReactNode } from 'react';\n\ninterface DataListProps<T> {\n  items: T[];\n  getKey: (item: T) => string | number;\n  renderItem: (item: T) => ReactNode;\n}\n\nexport default function DataList<T>({ items, getKey, renderItem }: DataListProps<T>) {\n  return <ul>{items.map((it) => <li key={getKey(it)}>{renderItem(it)}</li>)}</ul>;\n}",
 "a31_page": "// src/pages/CoursePage.tsx — Lab A3.1 SOLUTION: typed state + typed events\nimport { useState, type ChangeEvent, type FormEvent } from 'react';\nimport type { Course, Level } from './types';\nimport CourseCard from './CourseCard';\nimport DataList from './DataList';\n\nconst LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];\n\nexport default function CoursePage({ initial }: { initial: Course[] }) {\n  const [courses, setCourses] = useState<Course[]>(initial);\n  const [level, setLevel] = useState<Level | ''>('');\n  const [selected, setSelected] = useState<Course | null>(null);\n\n  const onLevel = (e: ChangeEvent<HTMLSelectElement>) => setLevel(e.target.value as Level | '');\n  const onSubmit = (e: FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    setCourses((prev) => [...prev, { id: Date.now(), title: 'New course', price: 0, level: 'beginner', tags: [] }]);\n  };\n  const shown = level ? courses.filter((c) => c.level === level) : courses;\n\n  return (\n    <form onSubmit={onSubmit}>\n      <select value={level} onChange={onLevel}>\n        <option value=\"\">All levels</option>\n        {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}\n      </select>\n      <DataList items={shown} getKey={(c) => c.id}\n        renderItem={(c) => <CourseCard course={c} onEnroll={(id) => setSelected(courses.find((x) => x.id === id) ?? null)} />} />\n      <p>Selected: {selected?.title ?? 'none'}</p>\n      <button type=\"submit\">Add</button>\n    </form>\n  );\n}",
 "a31_mistakes": "// src/mistakes.tsx — every line below MUST be a compile error. If tsc says\n// \"Unused '@ts-expect-error' directive\", your types are too loose.\nimport CourseCard from './CourseCard';\nimport DataList from './DataList';\nimport type { Course } from './types';\n\nconst c: Course = { id: 1, title: 'React', price: 0, level: 'beginner', tags: [] };\n// @ts-expect-error — level must be one of the 3 Level strings\nconst bad: Course = { ...c, level: 'expert' };\n// @ts-expect-error — price is a number, not a string\nconst bad2: Course = { ...c, price: '0' };\n// @ts-expect-error — onEnroll is required\nconst e1 = <CourseCard course={c} />;\n// @ts-expect-error — onEnroll receives a number id\nconst e2 = <CourseCard course={c} onEnroll={(id: string) => id} />;\n// @ts-expect-error — T is inferred as Course, so .name does not exist\nconst e3 = <DataList items={[c]} getKey={(x) => x.id} renderItem={(x) => x.name} />;\nexport { bad, bad2, e1, e2, e3 };",
 "a31_tsconfig": "{ \"compilerOptions\": { \"target\": \"ES2020\", \"module\": \"ESNext\", \"moduleResolution\": \"bundler\", \"jsx\": \"react-jsx\",\n  \"strict\": true, \"noEmit\": true, \"skipLibCheck\": true, \"lib\": [\"ES2020\", \"DOM\"] }, \"include\": [\"src\"] }",
 "a32_data": "// lib/courses.ts — Lab A3.2: data source (later: fetch from json-server / a real API)\nexport interface Course { id: number; title: string; level: 'beginner' | 'intermediate' | 'advanced'; lessons: number }\n\nconst COURSES: Course[] = [\n  { id: 1, title: 'React Basics', level: 'beginner', lessons: 12 },\n  { id: 2, title: 'Redux Toolkit', level: 'intermediate', lessons: 8 },\n  { id: 3, title: 'Next.js App Router', level: 'advanced', lessons: 10 },\n];\n\nexport async function getCourses(): Promise<Course[]> { return COURSES; }\nexport async function getCourse(id: number): Promise<Course | undefined> { return COURSES.find((c) => c.id === id); }",
 "a32_layout": "// app/layout.tsx — wraps EVERY page (header stays, page content changes)\nimport Link from 'next/link';\nimport type { ReactNode } from 'react';\n\nexport const metadata = { title: 'CT Courses', description: 'Lab A3.2 — Next.js App Router' };\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <nav>\n          <Link href=\"/\">Home</Link> · <Link href=\"/courses\">Courses</Link>\n        </nav>\n        <main>{children}</main>\n      </body>\n    </html>\n  );\n}",
 "a32_home": "// app/page.tsx — URL \"/\"\nexport default function HomePage() {\n  return <h1>Welcome to CT Courses</h1>;\n}",
 "a32_list": "// app/courses/page.tsx — URL \"/courses\" (a SERVER component: async, no useState/useEffect needed)\nimport Link from 'next/link';\nimport { getCourses } from '@/lib/courses';\n\nexport default async function CoursesPage() {\n  const courses = await getCourses();\n  return (\n    <ul>\n      {courses.map((c) => (\n        <li key={c.id}>\n          <Link href={`/courses/${c.id}`}>{c.title}</Link> — {c.level}\n        </li>\n      ))}\n    </ul>\n  );\n}",
 "a32_detail": "// app/courses/[id]/page.tsx — URL \"/courses/:id\" (dynamic segment = the folder name in [ ])\nimport { notFound } from 'next/navigation';\nimport { getCourse, getCourses } from '@/lib/courses';\nimport LikeButton from '@/components/LikeButton';\n\n// Next 15: params is a Promise — await it\nexport default async function CourseDetail({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  const course = await getCourse(Number(id));\n  if (!course) notFound();                 // renders app/not-found.tsx with HTTP 404\n\n  return (\n    <article>\n      <h1>{course.title}</h1>\n      <p>{course.lessons} lessons · {course.level}</p>\n      <LikeButton />\n    </article>\n  );\n}\n\n// optional: pre-render /courses/1, /courses/2, /courses/3 at build time (SSG)\nexport async function generateStaticParams() {\n  return (await getCourses()).map((c) => ({ id: String(c.id) }));\n}",
 "a32_nf": "// app/not-found.tsx — shown by notFound() and for unknown URLs\nimport Link from 'next/link';\nexport default function NotFound() {\n  return <><h1>404 — Course not found</h1><Link href=\"/courses\">Back to courses</Link></>;\n}",
 "a32_like": "'use client';\n// components/LikeButton.tsx — a CLIENT component: needed for useState / onClick\nimport { useState } from 'react';\n\nexport default function LikeButton() {\n  const [likes, setLikes] = useState(0);\n  return <button onClick={() => setLikes((n) => n + 1)}>👍 {likes}</button>;\n}"
};

const H = {
  en: { setup: '🧰 Set up', given: '📦 Given code (starter)', tasks: '📝 Tasks', pass: '✅ Pass when (“Đạt khi”)', check: '🧪 Self-check', run: 'Run', sol: '🔒 Model solution — open only after you have tried (and the self-check is green or you are truly stuck for 20 minutes)', why: '★ Why this lab', practice: 'Practise more', go: 'PRACTICE →' },
  vi: { setup: '🧰 Cài đặt', given: '📦 Code cho sẵn (khung)', tasks: '📝 Nhiệm vụ', pass: '✅ Đạt khi', check: '🧪 Tự kiểm', run: 'Chạy', sol: '🔒 Lời giải mẫu — chỉ mở sau khi đã tự làm (tự kiểm xanh, hoặc bí thật sự quá 20 phút)', why: '★ Vì sao có lab này', practice: 'Luyện thêm', go: 'LUYỆN TẬP →' },
};

/** One lab lesson. Every text field is [en, vi]; code fields are [fileName, code, lang]. */
function lab(d) {
  const side = (k) => {
    const i = k === 'en' ? 0 : 1;
    const h = H[k];
    const parts = [
      `<span class="eyebrow">${d.eyebrow[i]}</span>`,
      `<h2>${d.h2[i]}</h2>`,
      `<p class="lead">${d.goal[i]}</p>`,
    ];
    if (d.setup) parts.push(`<h3>${h.setup}</h3>`, d.setupNote ? `<p>${d.setupNote[i]}</p>` : '', pre(d.setup, 'bash'));
    if (d.given?.length) parts.push(`<h3>${h.given}</h3>`, d.givenNote ? `<p>${d.givenNote[i]}</p>` : '', ...d.given.map(([f, c, l]) => tep(f, c, l)));
    parts.push(`<h3>${h.tasks}</h3>`, `<ol>${d.tasks.map((t) => `<li>${t[i]}</li>`).join('')}</ol>`);
    if (d.pitfall) parts.push(`<div class="pitfall">${d.pitfall[i]}</div>`);
    parts.push(`<h3>${h.pass}</h3>`, `<ul>${d.pass.map((t) => `<li>${t[i]}</li>`).join('')}</ul>`);
    if (d.check) {
      parts.push(`<h3>${h.check}</h3>`, `<p>${d.check.note[i]}</p>`, ...d.check.files.map(([f, c, l]) => tep(f, c, l)));
      if (d.check.run) parts.push(`<p><b>${h.run}:</b></p>`, pre(d.check.run, 'bash'), d.check.expect ? `<div class="out">${d.check.expect[i]}</div>` : '');
    }
    if (d.why) parts.push(`<div class="callout"><span class="badge">${h.why}</span> ${d.why[i]}</div>`);
    parts.push(`<details><summary>${h.sol}</summary>\n${d.solution.map(([f, c, l]) => tep(f, c, l)).join('\n')}${d.solutionNote ? `<p>${d.solutionNote[i]}</p>` : ''}\n</details>`);
    parts.push(`<div class="di-toi"><a class="link-card codelab" href="${d.codelab || LAB_REACT}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">${h.practice}</span><span class="lc-sub">${d.codelabSub ? d.codelabSub[i] : 'Code Lab'}</span></span><span class="lc-cta">${h.go}</span></a></div>`);
    return parts.filter(Boolean).join('\n');
  };
  return { title: d.title, slug: d.slug, type: 'EXERCISE', description: d.description, content: bi(side('en'), side('vi')) };
}

const VITEST_SETUP = `# inside your Vite React project (npm create vite@latest my-app -- --template react)
npm i -D vitest jsdom @testing-library/react
# vite.config.js → add:   test: { environment: 'jsdom' }
npx vitest run`;
const VITEST_NOTE = [
  'The self-check is an automated test. You meet testing properly in Advanced A2 — here you only need to copy the file next to your component and run it. No test setup? Check the “Pass when” list by hand in the browser instead (F12 → Console must stay clean).',
  'Bài tự kiểm là một bài test tự động. Kiểm thử học kỹ ở Nâng cao A2 — ở đây chỉ cần chép tệp cạnh component rồi chạy. Chưa cài được test? Tự soát danh sách "Đạt khi" bằng mắt trên trình duyệt (F12 → Console phải sạch).',
];

/* ══════════════════════════════ CHƯƠNG 2 — ES6 ══════════════════════════════ */
const L21 = lab({
  title: 'Lab 2.1 — ES6 data toolkit: destructuring, spread, arrow functions & modules|||Lab 2.1 — Bộ hàm dữ liệu ES6: destructuring, spread, arrow function & module',
  slug: 'fer202-2-lab1-es6-data-toolkit',
  description: 'Viết bộ hàm xử lý danh sách khoá học bằng ES6 thuần (không React): định dạng giá, thêm/sửa/xoá KHÔNG biến đổi mảng gốc, lọc theo tag, tính tổng — tự kiểm bằng node check.mjs.',
  eyebrow: ['Chapter 2 · Lab 2.1 · ES6 in plain Node', 'Chương 2 · Lab 2.1 · ES6 chạy bằng Node'],
  h2: ['ES6 data toolkit — the functions every React list needs', 'Bộ hàm dữ liệu ES6 — những hàm mọi danh sách React đều cần'],
  goal: [
    '<b>Goal:</b> write the seven small functions you will later call from React components (add / update / remove an item <em>without mutating</em> the array, filter, total, format). Pure JavaScript, run with Node — so you practise ES6 without JSX getting in the way.',
    '<b>Mục tiêu:</b> viết bảy hàm nhỏ mà sau này component React sẽ gọi (thêm / sửa / xoá phần tử <em>không biến đổi</em> mảng gốc, lọc, tính tổng, định dạng). JavaScript thuần, chạy bằng Node — luyện ES6 mà chưa vướng JSX.',
  ],
  setup: `mkdir lab2-1 && cd lab2-1
npm init -y && npm pkg set type=module     # lets Node run import/export
# create courses.mjs (your code) and check.mjs (the self-check below)
node check.mjs`,
  given: [['courses.mjs (starter)', `export const courses = [
  { id: 1, title: 'React Basics', price: 299000, tags: ['react', 'jsx'], level: 'beginner' },
  { id: 2, title: 'Redux Toolkit', price: 499000, tags: ['redux'], level: 'intermediate' },
  { id: 3, title: 'Next.js App Router', price: 0, tags: ['next', 'react'], level: 'advanced' },
];

export const formatPrice = (vnd) => { /* TODO 0 → 'Free', 299000 → '299.000 ₫' */ };
export const describe = (course) => { /* TODO destructure { title, level, price } */ };
export const nextId = (list) => { /* TODO max id + 1, empty list → 1 */ };
export const addCourse = (list, course) => { /* TODO new array, new id */ };
export const updateCourse = (list, id, patch) => { /* TODO map + spread */ };
export const removeCourse = (list, id) => { /* TODO filter */ };
export const byTag = (list, tag) => { /* TODO */ };
export const totalPrice = (list) => { /* TODO reduce */ };`, 'javascript']],
  tasks: [
    ['<code>formatPrice</code>: <code>0</code> → <code>"Free"</code>, otherwise a template literal with <code>toLocaleString("vi-VN")</code> + <code>" ₫"</code>.', '<code>formatPrice</code>: <code>0</code> → <code>"Free"</code>, còn lại dùng template literal với <code>toLocaleString("vi-VN")</code> + <code>" ₫"</code>.'],
    ['<code>describe</code>: destructure the parameter directly: <code>({ title, level, price }) =&gt; …</code> → <code>"Redux Toolkit (intermediate) — 499.000 ₫"</code>.', '<code>describe</code>: destructure ngay ở tham số: <code>({ title, level, price }) =&gt; …</code> → <code>"Redux Toolkit (intermediate) — 499.000 ₫"</code>.'],
    ['<code>nextId</code>: <code>Math.max(0, ...list.map(c =&gt; c.id)) + 1</code> — the spread turns the array into arguments; the <code>0</code> handles an empty list.', '<code>nextId</code>: <code>Math.max(0, ...list.map(c =&gt; c.id)) + 1</code> — spread biến mảng thành đối số; số <code>0</code> lo trường hợp mảng rỗng.'],
    ['<code>addCourse</code> / <code>updateCourse</code> / <code>removeCourse</code>: return a NEW array every time (<code>[...list, x]</code>, <code>map</code> + <code>{ ...c, ...patch }</code>, <code>filter</code>). Never <code>push</code>, <code>splice</code> or assign <code>c.price = …</code>.', '<code>addCourse</code> / <code>updateCourse</code> / <code>removeCourse</code>: lần nào cũng trả mảng MỚI (<code>[...list, x]</code>, <code>map</code> + <code>{ ...c, ...patch }</code>, <code>filter</code>). Cấm <code>push</code>, <code>splice</code> hay gán <code>c.price = …</code>.'],
    ['<code>byTag</code> with <code>filter</code> + <code>includes</code>; <code>totalPrice</code> with <code>reduce</code> (start value <code>0</code>).', '<code>byTag</code> bằng <code>filter</code> + <code>includes</code>; <code>totalPrice</code> bằng <code>reduce</code> (giá trị đầu <code>0</code>).'],
  ],
  pitfall: [
    '<b>Trap:</b> <code>updateCourse</code> must change only the matching object. Untouched items should keep the <em>same reference</em> (React skips them), the edited one must be a <em>new</em> object (React sees the change). The self-check tests both.',
    '<b>Bẫy:</b> <code>updateCourse</code> chỉ được đổi đúng object khớp id. Phần tử không đổi phải giữ <em>nguyên tham chiếu</em> (React bỏ qua chúng), phần tử bị sửa phải là object <em>mới</em> (React thấy thay đổi). Bài tự kiểm thử cả hai.',
  ],
  pass: [
    ['<code>node check.mjs</code> prints 9 × <code>PASS</code>, no <code>FAIL</code>.', '<code>node check.mjs</code> in đủ 9 dòng <code>PASS</code>, không có <code>FAIL</code>.'],
    ['The last check “original array untouched” is green — no function mutates <code>courses</code>.', 'Dòng cuối "original array untouched" xanh — không hàm nào biến đổi <code>courses</code>.'],
    ['No <code>var</code>, no <code>function</code> keyword, no <code>for</code> loop in your file (arrow functions + array methods only).', 'Trong tệp không còn <code>var</code>, không từ khoá <code>function</code>, không vòng <code>for</code> (chỉ arrow function + method mảng).'],
  ],
  check: { note: ['Save as <code>check.mjs</code> next to <code>courses.mjs</code>.', 'Lưu thành <code>check.mjs</code> cạnh <code>courses.mjs</code>.'], files: [['check.mjs', CODE.l21_check, 'javascript']], run: 'node check.mjs', expect: ['9 lines: PASS formatPrice … PASS original array untouched', '9 dòng: PASS formatPrice … PASS original array untouched'] },
  why: ['These are exactly the state updates of Chapter 5 and the reducers of Chapter 12 — <code>[...list, x]</code>, <code>map</code>-replace, <code>filter</code>-remove. Get them right here, in Node, and the React version is just “call setState with it”.', 'Đây chính là các cập nhật state của Chương 5 và reducer của Chương 12 — <code>[...list, x]</code>, thay bằng <code>map</code>, xoá bằng <code>filter</code>. Làm đúng ở Node trước, sang React chỉ còn là "đưa nó vào setState".'],
  solution: [['courses.mjs', CODE.l21_sol, 'javascript']],
  codelab: LAB_FER, codelabSub: ['Code Lab → FER202 Practice → Chapter 2 lab “ES6 toolkit” (auto-graded).', 'Code Lab → FER202 Practice → lab Chương 2 “ES6 toolkit” (chấm tự động).'],
});

const L22 = lab({
  title: 'Lab 2.2 — Promises & async/await against a fake API|||Lab 2.2 — Promise & async/await với một API giả',
  slug: 'fer202-2-lab2-async-await',
  description: 'Gọi một API giả có độ trễ: biến 404 thành lỗi (fetch không tự reject), chạy song song bằng Promise.all, bắt lỗi bằng try/catch để màn hình không sập, viết lại bằng .then/.catch — tự kiểm bằng node check.mjs (có đo thời gian).',
  eyebrow: ['Chapter 2 · Lab 2.2 · async JavaScript', 'Chương 2 · Lab 2.2 · JavaScript bất đồng bộ'],
  h2: ['Promises & async/await — before React ever calls an API', 'Promise & async/await — trước khi React gọi API thật'],
  goal: [
    '<b>Goal:</b> master the four async moves the PE uses every time: <code>await</code> a request, treat a non-OK status as an error, run independent requests in parallel, and fall back gracefully. <code>fakeApi.mjs</code> behaves like <code>fetch</code> (300 ms delay, resolves even for 404, rejects only on network failure).',
    '<b>Mục tiêu:</b> thuần thục bốn động tác bất đồng bộ mà đề PE lần nào cũng dùng: <code>await</code> một request, coi status không OK là lỗi, chạy các request độc lập song song, và lùi về giá trị dự phòng êm. <code>fakeApi.mjs</code> cư xử y như <code>fetch</code> (trễ 300 ms, 404 vẫn resolve, chỉ reject khi lỗi mạng).',
  ],
  setup: `mkdir lab2-2 && cd lab2-2
npm init -y && npm pkg set type=module
# create fakeApi.mjs (given), solution.mjs (yours), check.mjs (self-check)
node check.mjs`,
  given: [['fakeApi.mjs (do not edit)', CODE.l22_api, 'javascript'], ['solution.mjs (starter)', `import { fakeFetch } from './fakeApi.mjs';

export async function getJson(url) { /* TODO await, throw on !res.ok, return res.json() */ }
export async function loadHome() { /* TODO /courses + /teachers IN PARALLEL → { courses, teachers } */ }
export async function safeGet(url, fallback = []) { /* TODO try/catch → { data, error } */ }
export const getTitles = () => { /* TODO same as getJson('/courses') but with .then/.catch, → titles */ };`, 'javascript']],
  tasks: [
    ['<code>getJson(url)</code>: <code>await fakeFetch(url)</code>; if <code>!res.ok</code> throw <code>new Error(`HTTP ${res.status} at ${url}`)</code>; otherwise return <code>res.json()</code>.', '<code>getJson(url)</code>: <code>await fakeFetch(url)</code>; nếu <code>!res.ok</code> thì ném <code>new Error(`HTTP ${res.status} at ${url}`)</code>; ngược lại trả <code>res.json()</code>.'],
    ['<code>loadHome()</code>: start both requests at once with <code>Promise.all</code> and destructure the result array. The check fails if it takes ≥ 500 ms (two sequential awaits take ~600 ms).', '<code>loadHome()</code>: khởi động hai request cùng lúc bằng <code>Promise.all</code> rồi destructure mảng kết quả. Tự kiểm báo FAIL nếu mất ≥ 500 ms (hai lần await nối tiếp mất ~600 ms).'],
    ['<code>safeGet(url, fallback)</code>: never throws — returns <code>{ data, error: null }</code> or <code>{ data: fallback, error: e.message }</code> for both a 404 and a network error.', '<code>safeGet(url, fallback)</code>: không bao giờ ném lỗi — trả <code>{ data, error: null }</code> hoặc <code>{ data: fallback, error: e.message }</code> cho cả 404 lẫn lỗi mạng.'],
    ['<code>getTitles()</code>: the same request written as a <code>.then().then().catch()</code> chain (the form the slides show first) returning <code>["React Basics", "Redux Toolkit"]</code>.', '<code>getTitles()</code>: cùng request đó viết dạng chuỗi <code>.then().then().catch()</code> (dạng slide trình bày trước) trả <code>["React Basics", "Redux Toolkit"]</code>.'],
  ],
  pitfall: [
    '<b>Classic FE question:</b> “Does <code>fetch</code> reject on HTTP 404?” — <b>No.</b> It rejects only when the request cannot be made (network down, CORS). A 404/500 still <em>resolves</em> with <code>res.ok === false</code>. Axios is different: it rejects on any non-2xx.',
    '<b>Câu FE kinh điển:</b> "<code>fetch</code> có reject khi HTTP 404 không?" — <b>Không.</b> Nó chỉ reject khi không gửi được request (mất mạng, CORS). 404/500 vẫn <em>resolve</em> với <code>res.ok === false</code>. Axios thì khác: reject với mọi status ngoài 2xx.',
  ],
  pass: [
    ['<code>node check.mjs</code> prints 6 × <code>PASS</code>.', '<code>node check.mjs</code> in đủ 6 dòng <code>PASS</code>.'],
    ['“loadHome runs in parallel” is green (&lt; 500 ms).', 'Dòng "loadHome runs in parallel" xanh (&lt; 500 ms).'],
    ['You can explain in one sentence why <code>safeGet</code> needs <code>try/catch</code> but <code>getTitles</code> needs <code>.catch</code>.', 'Bạn giải thích được trong một câu vì sao <code>safeGet</code> cần <code>try/catch</code> còn <code>getTitles</code> cần <code>.catch</code>.'],
  ],
  check: { note: ['Save as <code>check.mjs</code>. It uses top-level <code>await</code>, which works in <code>.mjs</code> modules.', 'Lưu thành <code>check.mjs</code>. Tệp dùng <code>await</code> ở cấp cao nhất — chạy được trong module <code>.mjs</code>.'], files: [['check.mjs', CODE.l22_check, 'javascript']], run: 'node check.mjs' },
  why: ['Chapter 11 replaces <code>fakeFetch</code> with real <code>fetch</code>/axios and json-server — the code stays the same. The <code>{ data, error }</code> shape is what your components will put into <code>useState</code>.', 'Chương 11 chỉ thay <code>fakeFetch</code> bằng <code>fetch</code>/axios thật và json-server — code giữ nguyên. Dạng <code>{ data, error }</code> chính là thứ component của bạn sẽ đưa vào <code>useState</code>.'],
  solution: [['solution.mjs', CODE.l22_sol, 'javascript']],
  codelab: LAB_JS, codelabSub: ['Async JavaScript on Code Lab.', 'JavaScript bất đồng bộ trên Code Lab.'],
});

/* ══════════════════════════════ CHƯƠNG 3 — JSX ══════════════════════════════ */
const L31 = lab({
  title: 'Lab 3.1 — From HTML to JSX: a course card list without a single warning|||Lab 3.1 — Từ HTML sang JSX: danh sách thẻ khoá học không một cảnh báo',
  slug: 'fer202-3-lab1-html-to-jsx',
  description: 'Chuyển một khối HTML Bootstrap thật sang JSX (className, htmlFor, style object, thẻ tự đóng, readOnly, onClick), tách thành CourseCard + CourseList dùng map và key — tự kiểm bằng test: không còn cảnh báo nào trong Console.',
  eyebrow: ['Chapter 3 · Lab 3.1 · JSX rules', 'Chương 3 · Lab 3.1 · Luật JSX'],
  h2: ['HTML → JSX, then data → a list of cards', 'HTML → JSX, rồi dữ liệu → danh sách thẻ'],
  goal: [
    '<b>Goal:</b> the FE loves “How would you correctly convert the following HTML code to JSX?”. Here you do it for real on a Bootstrap card, then turn one card into a list driven by data.',
    '<b>Mục tiêu:</b> đề FE rất hay hỏi "Chuyển đoạn HTML sau sang JSX thế nào cho đúng?". Ở đây bạn làm thật trên một thẻ Bootstrap, rồi biến một thẻ thành cả danh sách chạy theo dữ liệu.',
  ],
  setup: `npm create vite@latest lab3-1 -- --template react
cd lab3-1 && npm install && npm i bootstrap
# main.jsx: import 'bootstrap/dist/css/bootstrap.min.css';
npm run dev`,
  given: [['card.html (convert this)', `<!-- course card -->
<div class="card" style="width: 18rem; margin-top: 8px">
  <img src="react.png" alt="React Basics" class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">React Basics</h5>
    <label for="qty">Seats</label>
    <input id="qty" type="number" value="1" readonly>
    <button class="btn btn-primary" onclick="enroll(1)" disabled>Enroll</button>
  </div>
</div>`, 'html']],
  tasks: [
    ['Create <code>src/components/CourseCard.jsx</code> that receives <code>{ course, onEnroll }</code> and renders the card above with data from <code>course</code> (<code>title</code>, <code>image</code>, <code>seats</code>, <code>soldOut</code>).', 'Tạo <code>src/components/CourseCard.jsx</code> nhận <code>{ course, onEnroll }</code> và vẽ đúng thẻ trên bằng dữ liệu của <code>course</code> (<code>title</code>, <code>image</code>, <code>seats</code>, <code>soldOut</code>).'],
    ['Fix every HTML-ism: <code>class</code>→<code>className</code>, <code>for</code>→<code>htmlFor</code>, the style string → an object <code>{{ width: "18rem", marginTop: 8 }}</code>, <code>&lt;img&gt;</code>/<code>&lt;input&gt;</code> self-closed, <code>readonly</code>→<code>readOnly</code>, <code>onclick="…"</code>→<code>onClick={() =&gt; onEnroll(course.id)}</code>, the HTML comment → <code>{/* … */}</code>.', 'Sửa hết "thói HTML": <code>class</code>→<code>className</code>, <code>for</code>→<code>htmlFor</code>, chuỗi style → object <code>{{ width: "18rem", marginTop: 8 }}</code>, <code>&lt;img&gt;</code>/<code>&lt;input&gt;</code> tự đóng, <code>readonly</code>→<code>readOnly</code>, <code>onclick="…"</code>→<code>onClick={() =&gt; onEnroll(course.id)}</code>, comment HTML → <code>{/* … */}</code>.'],
    ['<code>id</code>s must be unique on the page: use <code>{`qty-${course.id}`}</code> for both the input <code>id</code> and the label <code>htmlFor</code>.', '<code>id</code> phải duy nhất trên trang: dùng <code>{`qty-${course.id}`}</code> cho cả <code>id</code> của input và <code>htmlFor</code> của label.'],
    ['<code>disabled={course.soldOut}</code> — a boolean, not the string <code>"disabled"</code>.', '<code>disabled={course.soldOut}</code> — một boolean, không phải chuỗi <code>"disabled"</code>.'],
    ['Create <code>CourseList.jsx</code> that maps an array of courses to <code>&lt;CourseCard key={c.id} … /&gt;</code> and render it in <code>App.jsx</code> with 3 courses (one sold out).', 'Tạo <code>CourseList.jsx</code> map mảng khoá học thành <code>&lt;CourseCard key={c.id} … /&gt;</code> và đặt vào <code>App.jsx</code> với 3 khoá (một khoá hết chỗ).'],
  ],
  pitfall: [
    '<b>Trap:</b> <code>style="width: 18rem"</code> pasted as a string crashes the page (“The style prop expects a mapping from style properties to values”). Numbers in a style object mean pixels: <code>marginTop: 8</code> → <code>8px</code>.',
    '<b>Bẫy:</b> dán nguyên <code>style="width: 18rem"</code> dạng chuỗi là trang sập ("The style prop expects a mapping from style properties to values"). Số trong object style hiểu là pixel: <code>marginTop: 8</code> → <code>8px</code>.',
  ],
  pass: [
    ['F12 → Console shows <b>no</b> warning: no “Invalid DOM property `class`”, no “`for`”, no “Each child in a list should have a unique key”.', 'F12 → Console <b>không</b> có cảnh báo nào: không "Invalid DOM property `class`", không "`for`", không "Each child in a list should have a unique key".'],
    ['Clicking a label focuses its own input (htmlFor + unique id work).', 'Bấm vào nhãn thì con trỏ nhảy vào đúng ô của nó (htmlFor + id duy nhất chạy đúng).'],
    ['The sold-out card’s button is disabled; the others call <code>onEnroll</code> with their id (log it).', 'Nút của thẻ hết chỗ bị khoá; các thẻ khác gọi <code>onEnroll</code> với đúng id (in ra để thấy).'],
    ['The self-check test passes (2 tests).', 'Bài test tự kiểm xanh (2 test).'],
  ],
  check: { note: VITEST_NOTE, files: [['src/components/lab31.test.jsx', CODE.l31_test, 'javascript']], run: VITEST_SETUP },
  why: ['Every PE starts by turning a mock-up into JSX; one stray <code>class</code> or missing <code>key</code> is a lost point and a console full of red the examiner sees first.', 'Đề PE nào cũng mở đầu bằng việc biến một bản vẽ thành JSX; sót một <code>class</code> hay thiếu <code>key</code> là mất điểm và một Console đỏ lòm mà người chấm nhìn thấy đầu tiên.'],
  solution: [['src/components/CourseCard.jsx', CODE.l31_card, 'javascript'], ['src/components/CourseList.jsx', CODE.l31_list, 'javascript']],
  codelab: LAB_FER, codelabSub: ['Code Lab → FER202 Practice → Chapter 3 lab “Report card” (auto-graded).', 'Code Lab → FER202 Practice → lab Chương 3 “Report card” (chấm tự động).'],
});

const L32 = lab({
  title: 'Lab 3.2 — Conditional rendering & fragments: loading, sold-out, badges and the “0” trap|||Lab 3.2 — Render có điều kiện & fragment: đang tải, hết chỗ, huy hiệu và bẫy số "0"',
  slug: 'fer202-3-lab2-conditional-fragments',
  description: 'Một component dùng đủ 4 cách render có điều kiện (return sớm, &&, toán tử ba ngôi, so sánh tường minh để tránh in ra "0") và Fragment có key trong danh sách — tự kiểm bằng test, có phép thử bẫy "0".',
  eyebrow: ['Chapter 3 · Lab 3.2 · conditional rendering', 'Chương 3 · Lab 3.2 · Render có điều kiện'],
  h2: ['Four ways to say “show this only if…” — and the one that prints 0', 'Bốn cách nói "chỉ hiện khi…" — và cách in ra số 0'],
  goal: [
    '<b>Goal:</b> build <code>EnrollPanel</code>, a component whose output depends on its props: a loading state, a NEW badge, “x seats left / Sold out”, an optional cart line, and a list of <code>&lt;dt&gt;/&lt;dd&gt;</code> pairs that needs keyed fragments.',
    '<b>Mục tiêu:</b> dựng <code>EnrollPanel</code>, một component mà kết quả hiển thị phụ thuộc props: trạng thái đang tải, huy hiệu NEW, "còn x chỗ / Hết chỗ", dòng giỏ hàng tuỳ có, và danh sách cặp <code>&lt;dt&gt;/&lt;dd&gt;</code> cần fragment có key.',
  ],
  setup: 'Reuse the Vite project from Lab 3.1 (or npm create vite@latest lab3-2 -- --template react).',
  given: [['props you receive', `<EnrollPanel
  course={null | { title: 'React Basics', isNew: true, seats: 0 }}
  cartCount={0}
  lessons={[{ id: 1, title: 'JSX', minutes: 12 }, { id: 2, title: 'Props', minutes: 15 }]}
/>`, 'javascript']],
  tasks: [
    ['<code>course</code> is <code>null</code> → return <code>&lt;p className="text-muted"&gt;Loading…&lt;/p&gt;</code> (early return).', '<code>course</code> là <code>null</code> → trả <code>&lt;p className="text-muted"&gt;Loading…&lt;/p&gt;</code> (return sớm).'],
    ['Otherwise return a fragment <code>&lt;&gt;…&lt;/&gt;</code> (no wrapper <code>&lt;div&gt;</code>): an <code>&lt;h2&gt;</code> with the title and, only when <code>isNew</code>, a <code>&lt;span className="badge …"&gt;NEW&lt;/span&gt;</code>.', 'Ngược lại trả một fragment <code>&lt;&gt;…&lt;/&gt;</code> (không bọc <code>&lt;div&gt;</code>): một <code>&lt;h2&gt;</code> có tiêu đề và — chỉ khi <code>isNew</code> — <code>&lt;span className="badge …"&gt;NEW&lt;/span&gt;</code>.'],
    ['A <code>&lt;p&gt;</code> with a ternary: <code>"3 seats left"</code> or <code>"Sold out"</code>.', 'Một <code>&lt;p&gt;</code> dùng toán tử ba ngôi: <code>"3 seats left"</code> hoặc <code>"Sold out"</code>.'],
    ['<code>&lt;p className="cart"&gt;In cart: N&lt;/p&gt;</code> only when <code>cartCount</code> is above 0 — write the condition so that <code>cartCount = 0</code> renders <b>nothing</b>.', '<code>&lt;p className="cart"&gt;In cart: N&lt;/p&gt;</code> chỉ khi <code>cartCount</code> lớn hơn 0 — viết điều kiện sao cho <code>cartCount = 0</code> <b>không hiện gì</b>.'],
    ['A <code>&lt;dl&gt;</code> whose children are <code>&lt;dt&gt;title&lt;/dt&gt;&lt;dd&gt;N min&lt;/dd&gt;</code> pairs — use <code>&lt;Fragment key={l.id}&gt;</code> (the short <code>&lt;&gt;</code> cannot take a key).', 'Một <code>&lt;dl&gt;</code> chứa các cặp <code>&lt;dt&gt;tên&lt;/dt&gt;&lt;dd&gt;N min&lt;/dd&gt;</code> — dùng <code>&lt;Fragment key={l.id}&gt;</code> (dạng ngắn <code>&lt;&gt;</code> không nhận key).'],
  ],
  pitfall: [
    '<b>The “0” trap:</b> <code>{cartCount &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> renders the text <b>0</b> when <code>cartCount</code> is 0, because <code>&amp;&amp;</code> returns its left side and React prints numbers. Write <code>{cartCount &gt; 0 &amp;&amp; …}</code>. <b>Second trap (found while testing this lab):</b> a <code>{/* comment */}</code> written on the same line after a tag, separated by spaces, leaves a text node of spaces in the DOM — put JSX comments on their own line.',
    '<b>Bẫy "0":</b> <code>{cartCount &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> in ra chữ <b>0</b> khi <code>cartCount</code> bằng 0, vì <code>&amp;&amp;</code> trả về vế trái và React in số ra màn hình. Viết <code>{cartCount &gt; 0 &amp;&amp; …}</code>. <b>Bẫy thứ hai (gặp khi chạy thử lab này):</b> <code>{/* comment */}</code> viết cùng dòng sau một thẻ, cách bằng dấu cách, để lại một nút chữ toàn dấu cách trong DOM — đặt comment JSX trên dòng riêng.',
  ],
  pass: [
    ['With <code>course={null}</code> the page shows only “Loading…”.', 'Với <code>course={null}</code> trang chỉ hiện "Loading…".'],
    ['With <code>cartCount={0}</code> no stray “0” appears anywhere; with <code>cartCount={2}</code> you see “In cart: 2”.', 'Với <code>cartCount={0}</code> không có chữ "0" lạc nào; với <code>cartCount={2}</code> thấy "In cart: 2".'],
    ['DevTools → Elements: the first child of the panel is the <code>&lt;h2&gt;</code> (no wrapper div), and <code>&lt;dl&gt;</code> contains only <code>dt/dd</code> pairs.', 'DevTools → Elements: con đầu tiên là <code>&lt;h2&gt;</code> (không có div bọc), và <code>&lt;dl&gt;</code> chỉ chứa các cặp <code>dt/dd</code>.'],
    ['No key warning in the Console; the self-check passes (3 tests).', 'Console không có cảnh báo key; bài tự kiểm xanh (3 test).'],
  ],
  check: { note: VITEST_NOTE, files: [['src/components/lab32.test.jsx', CODE.l32_test, 'javascript']], run: VITEST_SETUP },
  why: ['“How can you conditionally render content in JSX?” appeared in 5 different real FE papers. In the PE, “show ‘No results’ when the filter is empty” and “show the badge only when…” are graded line items.', '"How can you conditionally render content in JSX?" xuất hiện ở 5 đề FE thật khác nhau. Trong PE, "hiện ‘No results’ khi lọc rỗng" và "chỉ hiện huy hiệu khi…" là các dòng chấm điểm riêng.'],
  solution: [['src/components/EnrollPanel.jsx', CODE.l32_sol, 'javascript']],
  codelabSub: ['Conditional rendering on Code Lab.', 'Render có điều kiện trên Code Lab.'],
});

/* ═════════════════════════ CHƯƠNG 7 — PROPS & CONTEXT ═════════════════════════ */
const L71 = lab({
  title: 'Lab 7.1 — Kill the prop drilling: a cart with Context + a custom hook|||Lab 7.1 — Diệt prop drilling: giỏ hàng bằng Context + custom hook',
  slug: 'fer202-7-lab1-context-cart',
  description: 'Refactor một app truyền props xuyên 3 tầng sang CartContext + CartProvider + hook useCart (báo lỗi rõ khi dùng ngoài Provider); thêm/xoá/gộp số lượng, đếm và tính tổng — tự kiểm bằng 3 test.',
  eyebrow: ['Chapter 7 · Lab 7.1 · Context API', 'Chương 7 · Lab 7.1 · Context API'],
  h2: ['From prop drilling to Context', 'Từ prop drilling sang Context'],
  goal: [
    '<b>Goal:</b> the starter passes <code>count</code> and <code>onAdd</code> through <code>Layout</code> and <code>Main</code>, which never use them. Move the cart into a Context so any component can read it directly — the exact pattern of the PE “cart with Context” question (Exam 10, Question 2).',
    '<b>Mục tiêu:</b> code khung truyền <code>count</code> và <code>onAdd</code> xuyên qua <code>Layout</code> và <code>Main</code> — hai component không hề dùng chúng. Đưa giỏ hàng vào Context để component nào cũng đọc thẳng được — đúng dạng câu "giỏ hàng bằng Context" của đề PE (Đề 10, Câu 2).',
  ],
  setup: `npm create vite@latest lab7-1 -- --template react
cd lab7-1 && npm install && npm run dev`,
  given: [['src/App.jsx (starter — works, but drills props)', CODE.l71_start, 'javascript']],
  tasks: [
    ['Create <code>src/context/CartContext.jsx</code>: <code>createContext(null)</code>, a <code>CartProvider</code> holding <code>items</code> in <code>useState</code>, and <code>value={{ items, add, remove, count, total }}</code>.', 'Tạo <code>src/context/CartContext.jsx</code>: <code>createContext(null)</code>, một <code>CartProvider</code> giữ <code>items</code> bằng <code>useState</code>, và <code>value={{ items, add, remove, count, total }}</code>.'],
    ['<code>add(p)</code>: if the product is already in the cart increase <code>qty</code>, otherwise append <code>{ ...p, qty: 1 }</code>. Use the functional form <code>setItems(prev =&gt; …)</code>.', '<code>add(p)</code>: sản phẩm đã có thì tăng <code>qty</code>, chưa có thì thêm <code>{ ...p, qty: 1 }</code>. Dùng dạng hàm <code>setItems(prev =&gt; …)</code>.'],
    ['<code>count</code> and <code>total</code> are <b>derived</b> with <code>reduce</code> — do not store them in state.', '<code>count</code> và <code>total</code> là giá trị <b>suy ra</b> bằng <code>reduce</code> — đừng lưu chúng vào state.'],
    ['Export a custom hook <code>useCart()</code> that calls <code>useContext</code> and throws <code>"useCart must be used inside &lt;CartProvider&gt;"</code> when the value is <code>null</code>.', 'Export custom hook <code>useCart()</code> gọi <code>useContext</code> và ném lỗi <code>"useCart must be used inside &lt;CartProvider&gt;"</code> khi giá trị là <code>null</code>.'],
    ['Rewrite <code>App.jsx</code>: <code>Header</code> shows <code>Cart: {count} item(s) — {total} k₫</code>, <code>ProductList</code> calls <code>add</code>, a new <code>CartPanel</code> lists items with a Remove button and “Your cart is empty.” when empty. <code>Layout</code>/<code>Main</code> receive <b>no</b> cart props.', 'Viết lại <code>App.jsx</code>: <code>Header</code> hiện <code>Cart: {count} item(s) — {total} k₫</code>, <code>ProductList</code> gọi <code>add</code>, thêm <code>CartPanel</code> liệt kê món kèm nút Remove và "Your cart is empty." khi rỗng. <code>Layout</code>/<code>Main</code> <b>không</b> nhận prop giỏ hàng nào.'],
  ],
  pitfall: [
    '<b>FE favourite:</b> “What happens if a component consumes a context that has not been provided?” — it gets the <em>default value</em> passed to <code>createContext</code> (here <code>null</code>), no error by itself. That silent <code>null</code> is why the custom hook throws a clear message instead.',
    '<b>Câu FE hay ra:</b> "Điều gì xảy ra nếu component dùng một context chưa được Provider bọc?" — nó nhận <em>giá trị mặc định</em> truyền cho <code>createContext</code> (ở đây là <code>null</code>), bản thân không báo lỗi. Chính cái <code>null</code> im lặng đó là lý do custom hook ném một thông báo rõ ràng.',
  ],
  pass: [
    ['Add React Basics twice + Redux Toolkit once → header reads <code>Cart: 3 item(s) — 1100 k₫</code> and the panel shows <code>React Basics × 2</code>.', 'Thêm React Basics hai lần + Redux Toolkit một lần → header hiện <code>Cart: 3 item(s) — 1100 k₫</code> và bảng giỏ có <code>React Basics × 2</code>.'],
    ['Removing the last item brings back “Your cart is empty.”.', 'Xoá món cuối thì hiện lại "Your cart is empty.".'],
    ['<code>grep -n "count\\|onAdd" src/App.jsx</code> finds no prop passed to <code>Layout</code> or <code>Main</code>.', '<code>grep -n "count\\|onAdd" src/App.jsx</code> không còn prop nào truyền vào <code>Layout</code> hay <code>Main</code>.'],
    ['The self-check passes (3 tests), including the error outside the Provider.', 'Bài tự kiểm xanh (3 test), kể cả lỗi khi dùng ngoài Provider.'],
  ],
  check: { note: VITEST_NOTE, files: [['src/lab71.test.jsx', CODE.l71_test, 'javascript']], run: VITEST_SETUP },
  why: ['Context is how real apps share the logged-in user, theme, language and cart. It is also Milestone 7 of your course project.', 'Context là cách app thật chia sẻ người đăng nhập, theme, ngôn ngữ và giỏ hàng. Đây cũng là Mốc 7 của dự án khoá học.'],
  solution: [['src/context/CartContext.jsx', CODE.l71_ctx, 'javascript'], ['src/App.jsx', CODE.l71_app, 'javascript']],
  solutionNote: ['In the solution all components live in App.jsx and import from <code>./CartContext.jsx</code> to keep the listing short; in your project put the context in <code>src/context/</code> and fix the import path.', 'Trong lời giải mọi component nằm chung App.jsx và import từ <code>./CartContext.jsx</code> cho gọn; trong dự án của bạn đặt context ở <code>src/context/</code> và sửa đường dẫn import.'],
  codelab: LAB_FER, codelabSub: ['Code Lab → FER202 Practice → Chapter 7 lab “Team dashboard” (auto-graded).', 'Code Lab → FER202 Practice → lab Chương 7 “Team dashboard” (chấm tự động).'],
});

const L72 = lab({
  title: 'Lab 7.2 — Reusable components: children, named slots & render props|||Lab 7.2 — Component tái sử dụng: children, "khe" đặt tên & render props',
  slug: 'fer202-7-lab2-composition-render-props',
  description: 'Dựng Panel (children + khe title/actions/footer chỉ vẽ khi có) và DataList (render prop renderItem + giá trị mặc định empty/getKey), ghép chúng để một component hiển thị hai kiểu khác nhau — tự kiểm bằng 4 test.',
  eyebrow: ['Chapter 7 · Lab 7.2 · composition', 'Chương 7 · Lab 7.2 · Ghép component'],
  h2: ['One component, many looks: children and render props', 'Một component, nhiều dáng: children và render props'],
  goal: [
    '<b>Goal:</b> stop copy-pasting the same card and list markup. Build two generic components and reuse them for books, courses, lecturers… — the same shapes your project will need on every page.',
    '<b>Mục tiêu:</b> thôi chép-dán cùng một khung thẻ và danh sách. Dựng hai component chung rồi dùng lại cho sách, khoá học, giảng viên… — đúng những khung mà dự án của bạn trang nào cũng cần.',
  ],
  setup: 'Reuse any Vite React project (npm create vite@latest lab7-2 -- --template react).',
  tasks: [
    ['<code>Panel({ title, actions, footer, children })</code>: a Bootstrap <code>.card</code> with the title in <code>.card-header</code>, <code>children</code> in <code>.card-body</code>, and <code>.actions</code> / <code>.card-footer</code> rendered <b>only if</b> those props were passed.', '<code>Panel({ title, actions, footer, children })</code>: một <code>.card</code> Bootstrap, tiêu đề ở <code>.card-header</code>, <code>children</code> ở <code>.card-body</code>, còn <code>.actions</code> / <code>.card-footer</code> <b>chỉ vẽ khi</b> có truyền prop đó.'],
    ['<code>DataList({ items, renderItem, empty = "No data.", getKey = (x) =&gt; x.id })</code>: renders <code>&lt;ul&gt;</code> with <code>&lt;li key={getKey(it)}&gt;{renderItem(it, i)}&lt;/li&gt;</code>, or <code>&lt;p className="empty"&gt;{empty}&lt;/p&gt;</code> when the list is empty.', '<code>DataList({ items, renderItem, empty = "No data.", getKey = (x) =&gt; x.id })</code>: vẽ <code>&lt;ul&gt;</code> với <code>&lt;li key={getKey(it)}&gt;{renderItem(it, i)}&lt;/li&gt;</code>, hoặc <code>&lt;p className="empty"&gt;{empty}&lt;/p&gt;</code> khi mảng rỗng.'],
    ['In <code>App.jsx</code> render the same books twice with two different <code>renderItem</code> functions: titles only, and <code>"1. Clean Code (out)"</code> with a stock label.', 'Trong <code>App.jsx</code> vẽ cùng danh sách sách hai lần với hai hàm <code>renderItem</code> khác nhau: chỉ tên, và <code>"1. Clean Code (out)"</code> kèm nhãn tồn kho.'],
    ['Compose: a <code>DataList</code> inside a <code>Panel</code> with <code>footer={&lt;small&gt;2 books&lt;/small&gt;}</code> and <code>actions={&lt;button&gt;Add&lt;/button&gt;}</code>.', 'Ghép: một <code>DataList</code> bên trong <code>Panel</code> với <code>footer={&lt;small&gt;2 books&lt;/small&gt;}</code> và <code>actions={&lt;button&gt;Add&lt;/button&gt;}</code>.'],
  ],
  pitfall: [
    '<b>Trap:</b> default values in destructuring (<code>empty = "No data."</code>) replace the old <code>Component.defaultProps</code> — React 19 removed <code>defaultProps</code> for function components, so FE questions about “default values for props in React 18” expect this answer.',
    '<b>Bẫy:</b> giá trị mặc định trong destructuring (<code>empty = "No data."</code>) thay cho <code>Component.defaultProps</code> cũ — React 19 đã bỏ <code>defaultProps</code> cho function component, nên câu FE về "giá trị mặc định của props trong React 18" mong đáp án này.',
  ],
  pass: [
    ['A <code>Panel</code> without <code>footer</code> renders no <code>.card-footer</code> element at all (check in DevTools).', '<code>Panel</code> không truyền <code>footer</code> thì không có phần tử <code>.card-footer</code> nào (soát trong DevTools).'],
    ['The same <code>DataList</code> shows two different looks without changing its code.', 'Cùng một <code>DataList</code> hiện hai kiểu khác nhau mà không sửa code của nó.'],
    ['An empty list shows “No data.”, or your custom <code>empty</code> text.', 'Danh sách rỗng hiện "No data." hoặc chữ <code>empty</code> bạn truyền.'],
    ['The self-check passes (4 tests) with no key warning.', 'Bài tự kiểm xanh (4 test), không có cảnh báo key.'],
  ],
  check: { note: VITEST_NOTE, files: [['src/components/lab72.test.jsx', CODE.l72_test, 'javascript']], run: VITEST_SETUP },
  solution: [['src/components/Panel.jsx', CODE.l72_panel, 'javascript'], ['src/components/DataList.jsx', CODE.l72_list, 'javascript']],
  codelabSub: ['Component patterns on Code Lab.', 'Mẫu component trên Code Lab.'],
});

/* ═════════════════════════════ CHƯƠNG 12 — REDUX ═════════════════════════════ */
const L121 = lab({
  title: 'Lab 12.1 — A cart slice with Redux Toolkit: reducers, prepare callbacks & memoised selectors|||Lab 12.1 — Slice giỏ hàng bằng Redux Toolkit: reducer, prepare & selector ghi nhớ',
  slug: 'fer202-12-lab1-cart-slice-selectors',
  description: 'Viết cartSlice (addItem gộp số lượng, changeQty về 0 thì xoá, removeItem, applyCoupon có prepare, clearCart) + selector suy ra (count, subtotal, total có mã giảm giá) bằng createSelector — chạy store bằng Node, tự kiểm 10 dòng.',
  eyebrow: ['Chapter 12 · Lab 12.1 · Redux Toolkit', 'Chương 12 · Lab 12.1 · Redux Toolkit'],
  h2: ['A real cart slice — and why components read selectors', 'Một slice giỏ hàng thật — và vì sao component đọc qua selector'],
  goal: [
    '<b>Goal:</b> go beyond the counter of Exercise 24. A Redux store is plain JavaScript, so you can build and test it in Node before any React component exists — then <code>useSelector(selectTotal)</code> is all the UI needs.',
    '<b>Mục tiêu:</b> vượt qua bộ đếm của Exercise 24. Store Redux là JavaScript thuần, nên dựng và thử được bằng Node trước khi có component React nào — sau đó UI chỉ cần <code>useSelector(selectTotal)</code>.',
  ],
  setup: `mkdir lab12-1 && cd lab12-1
npm init -y && npm pkg set type=module
npm i @reduxjs/toolkit
# create cartSlice.js, store.js, check.mjs  → node check.mjs`,
  given: [['store.js (given)', CODE.l121_store, 'javascript']],
  tasks: [
    ['<code>createSlice({ name: "cart", initialState: { items: [], coupon: null }, reducers: {…} })</code>.', '<code>createSlice({ name: "cart", initialState: { items: [], coupon: null }, reducers: {…} })</code>.'],
    ['<code>addItem(product)</code>: same id → <code>qty += 1</code>, otherwise push <code>{ ...product, qty: 1 }</code>. Writing “mutations” is fine inside RTK reducers (Immer).', '<code>addItem(product)</code>: trùng id → <code>qty += 1</code>, chưa có → push <code>{ ...product, qty: 1 }</code>. Viết kiểu "sửa trực tiếp" là hợp lệ trong reducer RTK (Immer).'],
    ['<code>changeQty({ id, qty })</code>: <code>qty &lt;= 0</code> removes the line. <code>removeItem(id)</code>. <code>clearCart()</code> returns a fresh initial state.', '<code>changeQty({ id, qty })</code>: <code>qty &lt;= 0</code> thì xoá dòng. <code>removeItem(id)</code>. <code>clearCart()</code> trả về state ban đầu mới.'],
    ['<code>applyCoupon</code> with a <code>prepare(code)</code> callback that trims and upper-cases, so <code>applyCoupon("  fer202 ")</code> stores <code>"FER202"</code>.', '<code>applyCoupon</code> có callback <code>prepare(code)</code> cắt khoảng trắng và viết hoa, để <code>applyCoupon("  fer202 ")</code> lưu <code>"FER202"</code>.'],
    ['Selectors: <code>selectItems</code>, <code>selectCount</code>, <code>selectSubtotal</code> and <code>selectTotal</code> (10% off for <code>FER202</code>, rounded) — the last two with <code>createSelector</code>.', 'Selector: <code>selectItems</code>, <code>selectCount</code>, <code>selectSubtotal</code> và <code>selectTotal</code> (giảm 10% với <code>FER202</code>, làm tròn) — hai cái cuối dùng <code>createSelector</code>.'],
  ],
  pitfall: [
    '<b>Trap:</b> inside an Immer reducer either <em>mutate the draft</em> or <em>return a new value</em> — never both. <code>state.items.push(x); return state;</code> happens to work, but <code>state.items = []; return { … }</code> throws “An immer producer returned a new value <em>and</em> modified its draft”.',
    '<b>Bẫy:</b> trong reducer Immer chỉ chọn một: <em>sửa bản nháp</em> hoặc <em>trả giá trị mới</em> — đừng làm cả hai. <code>state.items.push(x); return state;</code> tình cờ vẫn chạy, nhưng <code>state.items = []; return { … }</code> sẽ ném lỗi "An immer producer returned a new value <em>and</em> modified its draft".',
  ],
  pass: [
    ['<code>node check.mjs</code> prints 10 × <code>PASS</code>.', '<code>node check.mjs</code> in đủ 10 dòng <code>PASS</code>.'],
    ['“old state object was not mutated” is green — the state you read before dispatching is unchanged.', 'Dòng "old state object was not mutated" xanh — state đọc trước khi dispatch vẫn y nguyên.'],
    ['<code>addItem.type === "cart/addItem"</code> — you can explain where that string comes from.', '<code>addItem.type === "cart/addItem"</code> — bạn giải thích được chuỗi đó sinh ra từ đâu.'],
  ],
  check: { note: ['Save as <code>check.mjs</code>.', 'Lưu thành <code>check.mjs</code>.'], files: [['check.mjs', CODE.l121_check, 'javascript']], run: 'node check.mjs' },
  why: ['FE: “Which of the following statements about Redux selectors is true?” (4 papers). A selector keeps the derived-data formula in ONE place; <code>createSelector</code> recomputes only when its inputs change.', 'FE: "Which of the following statements about Redux selectors is true?" (4 đề). Selector giữ công thức tính dữ liệu suy ra ở MỘT chỗ; <code>createSelector</code> chỉ tính lại khi đầu vào đổi.'],
  solution: [['cartSlice.js', CODE.l121_slice, 'javascript']],
  codelabSub: ['Redux on Code Lab.', 'Redux trên Code Lab.'],
});

const L122 = lab({
  title: 'Lab 12.2 — createAsyncThunk + json-server: a library catalogue with loading/error state|||Lab 12.2 — createAsyncThunk + json-server: danh mục thư viện có trạng thái đang tải/lỗi',
  slug: 'fer202-12-lab2-async-thunk-json-server',
  description: 'Bốn thunk axios (GET, POST, PATCH, DELETE) trên json-server thật cổng 9999, trạng thái idle/loading/succeeded/failed trong extraReducers, rejectWithValue cho thông báo lỗi dễ đọc — tự kiểm 7 dòng gọi server thật.',
  eyebrow: ['Chapter 12 · Lab 12.2 · async Redux', 'Chương 12 · Lab 12.2 · Redux bất đồng bộ'],
  h2: ['Async Redux against a real REST server', 'Redux bất đồng bộ với một REST server thật'],
  goal: [
    '<b>Goal:</b> move API calls out of components into thunks: fetch, add, toggle (PATCH) and delete books on json-server, with a <code>status</code> the UI can turn into a spinner or an alert.',
    '<b>Mục tiêu:</b> chuyển lời gọi API ra khỏi component vào thunk: tải, thêm, bật/tắt (PATCH) và xoá sách trên json-server, kèm <code>status</code> để UI biến thành vòng quay chờ hoặc thông báo lỗi.',
  ],
  setup: `mkdir lab12-2 && cd lab12-2
npm init -y && npm pkg set type=module
npm i @reduxjs/toolkit axios
npm i -D json-server@0.17.4
npx json-server --watch db.json --port 9999      # terminal 1 (keep it running)
node check.mjs                                     # terminal 2`,
  given: [['db.json', CODE.l122_db, 'json']],
  tasks: [
    ['<code>fetchBooks</code>: <code>createAsyncThunk("books/fetchAll", async () =&gt; (await axios.get(API)).data)</code>.', '<code>fetchBooks</code>: <code>createAsyncThunk("books/fetchAll", async () =&gt; (await axios.get(API)).data)</code>.'],
    ['<code>addBook(book)</code> with POST (json-server returns the saved record with its new <code>id</code>); <code>toggleAvailable(book)</code> with <b>PATCH</b> <code>{ available: !book.available }</code>.', '<code>addBook(book)</code> bằng POST (json-server trả về bản ghi đã lưu kèm <code>id</code> mới); <code>toggleAvailable(book)</code> bằng <b>PATCH</b> <code>{ available: !book.available }</code>.'],
    ['<code>deleteBook(id)</code>: on a 404 call <code>rejectWithValue("Book not found")</code> so the reducer gets a readable message.', '<code>deleteBook(id)</code>: gặp 404 thì gọi <code>rejectWithValue("Book not found")</code> để reducer nhận được thông báo dễ đọc.'],
    ['<code>initialState: { items: [], status: "idle", error: null }</code>; in <code>extraReducers</code> handle <code>pending</code>/<code>fulfilled</code>/<code>rejected</code> of <code>fetchBooks</code> and the <code>fulfilled</code> case of the other three.', '<code>initialState: { items: [], status: "idle", error: null }</code>; trong <code>extraReducers</code> xử lý <code>pending</code>/<code>fulfilled</code>/<code>rejected</code> của <code>fetchBooks</code> và nhánh <code>fulfilled</code> của ba thunk còn lại.'],
    ['Export <code>selectAvailable</code>. (Optional) wire it into a React page: <code>useEffect(() =&gt; { dispatch(fetchBooks()) }, [dispatch])</code>, a spinner while <code>status === "loading"</code>.', 'Export <code>selectAvailable</code>. (Tuỳ chọn) nối vào một trang React: <code>useEffect(() =&gt; { dispatch(fetchBooks()) }, [dispatch])</code>, hiện vòng chờ khi <code>status === "loading"</code>.'],
  ],
  pitfall: [
    '<b>Trap:</b> PUT replaces the <em>whole</em> record — <code>axios.put(url, { available: true })</code> deletes the title and author on json-server. Use PATCH for a partial update. And <code>check.mjs</code> really writes to <code>db.json</code>: keep a copy (<code>cp db.json db.orig.json</code>) to reset between runs.',
    '<b>Bẫy:</b> PUT thay <em>cả</em> bản ghi — <code>axios.put(url, { available: true })</code> làm mất title và author trên json-server. Sửa một phần thì dùng PATCH. Và <code>check.mjs</code> ghi thật vào <code>db.json</code>: giữ một bản sao (<code>cp db.json db.orig.json</code>) để khôi phục giữa các lần chạy.',
  ],
  pass: [
    ['With json-server running, <code>node check.mjs</code> prints 7 × <code>PASS</code> (start from the original <code>db.json</code>).', 'Khi json-server đang chạy, <code>node check.mjs</code> in đủ 7 dòng <code>PASS</code> (chạy với <code>db.json</code> gốc).'],
    ['After the run, <code>db.json</code> shows book 2 with <code>"available": true</code> and still its title — PATCH, not PUT.', 'Chạy xong, <code>db.json</code> có sách 2 với <code>"available": true</code> mà vẫn còn tên — đúng PATCH, không phải PUT.'],
    ['Stop json-server and run again: “fetchBooks” turns into a <code>failed</code> status, not a crash.', 'Tắt json-server rồi chạy lại: "fetchBooks" chuyển sang <code>failed</code>, không sập chương trình.'],
  ],
  check: { note: ['Save as <code>check.mjs</code> next to <code>booksSlice.js</code>.', 'Lưu thành <code>check.mjs</code> cạnh <code>booksSlice.js</code>.'], files: [['check.mjs', CODE.l122_check, 'javascript']], run: 'node check.mjs' },
  why: ['Thunks are where the PE-style data logic lives once an app uses Redux: components only <code>dispatch</code> and <code>useSelector</code>. It is Milestone 12 of your project.', 'Khi app dùng Redux, logic dữ liệu kiểu PE nằm ở thunk: component chỉ còn <code>dispatch</code> và <code>useSelector</code>. Đây là Mốc 12 của dự án.'],
  solution: [['booksSlice.js', CODE.l122_slice, 'javascript']],
  codelab: LAB_FER, codelabSub: ['Code Lab → FER202 Practice → Chapter 12 lab “Redux bookstore” (auto-graded).', 'Code Lab → FER202 Practice → lab Chương 12 “Redux bookstore” (chấm tự động).'],
});

/* ═════════════════════════════ NÂNG CAO A2 — KIỂM THỬ ═════════════════════════════ */
const LA21 = lab({
  title: 'Lab A2.1 — Unit tests for validation & cart logic (Vitest/Jest), with a mutation check|||Lab A2.1 — Unit test cho hàm kiểm lỗi & giỏ hàng (Vitest/Jest), có phép thử "cài lỗi"',
  slug: 'fer202-a2-lab1-unit-tests',
  description: 'Viết ≥ 10 unit test cho validateBook (biên 2/3 ký tự, it.each cho năm sai, đóng băng thời gian để test "năm tương lai" không hết hạn) và cartTotal; rồi cố ý cài lỗi vào code để chứng minh bộ test bắt được.',
  eyebrow: ['Advanced A2 · Lab A2.1 · unit testing', 'Nâng cao A2 · Lab A2.1 · Unit test'],
  h2: ['Test the rules before you test the screen', 'Kiểm luật trước khi kiểm màn hình'],
  goal: [
    '<b>Goal:</b> the validation rules of an 11.5-style form are pure functions — the cheapest, fastest thing to test. Write the tests, then <em>break the code on purpose</em> and watch a test turn red: that is how you know your tests are worth anything.',
    '<b>Mục tiêu:</b> luật kiểm lỗi của form kiểu bài 11.5 là hàm thuần — thứ rẻ nhất, nhanh nhất để test. Viết test, rồi <em>cố ý làm hỏng code</em> và nhìn một test chuyển đỏ: đó là cách biết bộ test của bạn có giá trị.',
  ],
  setup: `# in your Vite React project
npm i -D vitest
npx vitest            # watch mode; or: npx vitest run
# Jest instead (Create React App): the same test file works — just remove the "from 'vitest'" import line`,
  given: [['src/utils/validate.js (code under test)', CODE.a21_src, 'javascript']],
  tasks: [
    ['Create <code>src/utils/validate.test.js</code> with two <code>describe</code> blocks: <code>validateBook</code> and <code>cartTotal</code>.', 'Tạo <code>src/utils/validate.test.js</code> với hai khối <code>describe</code>: <code>validateBook</code> và <code>cartTotal</code>.'],
    ['Valid form → <code>toEqual({})</code> (not <code>toBe</code> — objects are compared by reference with <code>toBe</code>).', 'Form hợp lệ → <code>toEqual({})</code> (không dùng <code>toBe</code> — <code>toBe</code> so object theo tham chiếu).'],
    ['Boundary values: title <code>"JS"</code> (2 chars) fails, <code>"C++"</code> (3) passes; spaces-only counts as empty.', 'Giá trị biên: tiêu đề <code>"JS"</code> (2 ký tự) lỗi, <code>"C++"</code> (3) qua; chỉ có dấu cách coi là rỗng.'],
    ['<code>it.each(["99", "20O8", "", "12345"])</code> for invalid years (note the letter O in <code>"20O8"</code>).', '<code>it.each(["99", "20O8", "", "12345"])</code> cho các năm sai (để ý chữ O trong <code>"20O8"</code>).'],
    ['“Future year”: freeze the clock with <code>vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-21"))</code> so the test still means the same thing next year (Jest: <code>jest.useFakeTimers().setSystemTime(…)</code>).', '"Năm tương lai": đóng băng đồng hồ bằng <code>vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-21"))</code> để sang năm test vẫn đúng nghĩa (Jest: <code>jest.useFakeTimers().setSystemTime(…)</code>).'],
    ['<code>cartTotal</code>: normal sum, empty cart, coupon with rounding (<code>333 → 300</code>), wrong-case coupon ignored.', '<code>cartTotal</code>: tổng thường, giỏ rỗng, mã giảm có làm tròn (<code>333 → 300</code>), mã sai hoa/thường bị bỏ qua.'],
    ['<b>Mutation check:</b> change <code>title.length &lt; 3</code> to <code>&lt; 2</code> in <code>validate.js</code>, run the tests, confirm at least one fails, then undo.', '<b>Phép thử cài lỗi:</b> đổi <code>title.length &lt; 3</code> thành <code>&lt; 2</code> trong <code>validate.js</code>, chạy test, xác nhận ít nhất một test đỏ, rồi trả lại.'],
  ],
  pass: [
    ['<code>npx vitest run</code> → at least 10 tests, all green (the model solution has 13).', '<code>npx vitest run</code> → ít nhất 10 test, tất cả xanh (lời giải mẫu có 13).'],
    ['The mutation in task 7 makes ≥ 1 test red; reverting makes all green again.', 'Lỗi cài ở nhiệm vụ 7 làm ≥ 1 test đỏ; trả lại thì xanh hết.'],
    ['No test depends on today’s date.', 'Không test nào phụ thuộc ngày hôm nay.'],
  ],
  why: ['FE asks about Jest/RTL vocabulary (describe, it/test, expect, matchers, mocks); the defence panel asks “how do you know your validation works?”. A green test file is the strongest answer.', 'Đề FE hỏi từ vựng Jest/RTL (describe, it/test, expect, matcher, mock); hội đồng bảo vệ hỏi "sao em biết phần kiểm lỗi chạy đúng?". Một tệp test xanh là câu trả lời mạnh nhất.'],
  solution: [['src/utils/validate.test.js', CODE.a21_test, 'javascript']],
  codelabSub: ['JavaScript functions to test on Code Lab.', 'Hàm JavaScript để luyện test trên Code Lab.'],
});

const LA22 = lab({
  title: 'Lab A2.2 — Component tests with React Testing Library: async data, search, confirmed delete|||Lab A2.2 — Test component bằng React Testing Library: dữ liệu bất đồng bộ, tìm kiếm, xoá có xác nhận',
  slug: 'fer202-a2-lab2-rtl-component',
  description: 'Test một component tải dữ liệu bằng fetch: giả lập fetch (vi.stubGlobal), đợi giao diện bằng findBy, gõ tìm bằng userEvent, phân biệt getBy/queryBy, giả lập window.confirm Huỷ/OK, và nhánh lỗi HTTP 500 — 4 test, có cấu hình jest-dom.',
  eyebrow: ['Advanced A2 · Lab A2.2 · React Testing Library', 'Nâng cao A2 · Lab A2.2 · React Testing Library'],
  h2: ['Test what the user sees: loading, typing, clicking', 'Test thứ người dùng thấy: đang tải, gõ, bấm'],
  goal: [
    '<b>Goal:</b> test the kind of component you write in every PE — fetch on mount, a search box, a delete button with <code>window.confirm</code> — without a server and without peeking at state.',
    '<b>Mục tiêu:</b> test đúng loại component bạn viết trong mọi đề PE — tải dữ liệu khi mount, ô tìm kiếm, nút xoá có <code>window.confirm</code> — mà không cần server và không nhìn trộm state.',
  ],
  setup: `npm i -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
# vite.config.js (or vitest.config.js) + src/setupTests.js below
npx vitest run`,
  given: [['vitest.config.js', CODE.a22_cfg, 'javascript'], ['src/setupTests.js', CODE.a22_setup, 'javascript'], ['src/components/BookSearch.jsx (component under test)', CODE.a22_comp, 'javascript']],
  tasks: [
    ['In <code>beforeEach</code>, replace the global <code>fetch</code> with <code>vi.fn()</code> returning <code>{ ok: true, json: () =&gt; Promise.resolve(BOOKS) }</code>; undo it in <code>afterEach</code>.', 'Trong <code>beforeEach</code>, thay <code>fetch</code> toàn cục bằng <code>vi.fn()</code> trả <code>{ ok: true, json: () =&gt; Promise.resolve(BOOKS) }</code>; trả lại trong <code>afterEach</code>.'],
    ['Test 1: “Loading…” is there synchronously (<code>getByText</code>), the list appears later (<code>await findByText</code>), 3 <code>listitem</code>s, and <code>fetch</code> was called with the right URL.', 'Test 1: "Loading…" có ngay (<code>getByText</code>), danh sách xuất hiện sau (<code>await findByText</code>), có 3 <code>listitem</code>, và <code>fetch</code> được gọi đúng URL.'],
    ['Test 2: <code>userEvent.type</code> <code>"  CLEAN "</code> into the box labelled Search → 2 items; assert Refactoring is gone with <code>queryByText(…)).not.toBeInTheDocument()</code>; typing <code>zzz</code> shows “No books found.”.', 'Test 2: <code>userEvent.type</code> <code>"  CLEAN "</code> vào ô có nhãn Search → còn 2 mục; khẳng định Refactoring đã biến mất bằng <code>queryByText(…)).not.toBeInTheDocument()</code>; gõ <code>zzz</code> hiện "No books found.".'],
    ['Test 3: <code>vi.spyOn(window, "confirm")</code> returning <code>false</code> then <code>true</code>: the first click keeps the book, the second removes it.', 'Test 3: <code>vi.spyOn(window, "confirm")</code> trả <code>false</code> rồi <code>true</code>: lần bấm đầu sách còn, lần hai thì mất.'],
    ['Test 4: make <code>fetch</code> resolve <code>{ ok: false, status: 500 }</code> once → an element with role <code>alert</code> reads “Could not load books: HTTP 500”.', 'Test 4: cho <code>fetch</code> trả <code>{ ok: false, status: 500 }</code> một lần → phần tử role <code>alert</code> hiện "Could not load books: HTTP 500".'],
  ],
  pitfall: [
    '<b>getBy vs queryBy vs findBy:</b> <code>getBy</code> throws if missing (use to assert presence), <code>queryBy</code> returns <code>null</code> (use to assert absence), <code>findBy</code> returns a promise that waits (use for anything that appears after a fetch). Using <code>getBy</code> for the list right after <code>render</code> fails, because the data has not arrived yet.',
    '<b>getBy, queryBy, findBy:</b> <code>getBy</code> ném lỗi khi không thấy (dùng để khẳng định CÓ), <code>queryBy</code> trả <code>null</code> (dùng để khẳng định KHÔNG CÓ), <code>findBy</code> trả promise biết chờ (dùng cho thứ hiện ra sau khi fetch). Dùng <code>getBy</code> tìm danh sách ngay sau <code>render</code> sẽ hỏng, vì dữ liệu chưa về.',
  ],
  pass: [
    ['<code>npx vitest run</code> → 4 tests green, no “not wrapped in act(…)” warning.', '<code>npx vitest run</code> → 4 test xanh, không có cảnh báo "not wrapped in act(…)".'],
    ['No real network request (the tests pass with json-server stopped).', 'Không có request mạng thật (tắt json-server test vẫn xanh).'],
    ['Queries use role / label / text — no <code>container.querySelector</code>, no <code>data-testid</code>.', 'Truy vấn bằng role / label / text — không <code>container.querySelector</code>, không <code>data-testid</code>.'],
  ],
  solution: [['src/components/BookSearch.test.jsx', CODE.a22_test, 'javascript']],
  codelabSub: ['React on Code Lab.', 'React trên Code Lab.'],
});

/* ═════════════════════════ NÂNG CAO A3 — TYPESCRIPT & NEXT.JS ═════════════════════════ */
const LA31 = lab({
  title: 'Lab A3.1 — Type your React app: props interfaces, union types, typed state & a generic list|||Lab A3.1 — Gắn kiểu cho app React: interface props, union type, state có kiểu & danh sách generic',
  slug: 'fer202-a3-lab1-typescript-props-state',
  description: 'Chuyển CourseCard/DataList/CoursePage sang .tsx: interface Course, union Level, prop tuỳ chọn, useState<Course[]>, ChangeEvent/FormEvent, component generic DataList<T>; tự kiểm bằng tệp mistakes.tsx — mọi dòng sai phải bị tsc bắt (@ts-expect-error).',
  eyebrow: ['Advanced A3 · Lab A3.1 · TypeScript + React', 'Nâng cao A3 · Lab A3.1 · TypeScript + React'],
  h2: ['Let the compiler catch your prop mistakes', 'Để trình biên dịch bắt lỗi props giúp bạn'],
  goal: [
    '<b>Goal:</b> type a small course page so that a wrong level string, a price as text, a missing <code>onEnroll</code> or a typo in <code>renderItem</code> fails <em>before</em> the app runs.',
    '<b>Mục tiêu:</b> gắn kiểu cho một trang khoá học nhỏ, để chuỗi level sai, giá viết dạng chữ, thiếu <code>onEnroll</code> hay gõ nhầm trong <code>renderItem</code> đều bị bắt <em>trước khi</em> app chạy.',
  ],
  setup: `npm create vite@latest lab-a3-1 -- --template react-ts
cd lab-a3-1 && npm install
npx tsc --noEmit -p tsconfig.app.json     # Vite react-ts template; prints nothing when everything type-checks`,
  tasks: [
    ['<code>src/types.ts</code>: <code>type Level = "beginner" | "intermediate" | "advanced"</code> and <code>interface Course { id; title; price; level: Level; tags: string[]; teacher?: string }</code>.', '<code>src/types.ts</code>: <code>type Level = "beginner" | "intermediate" | "advanced"</code> và <code>interface Course { id; title; price; level: Level; tags: string[]; teacher?: string }</code>.'],
    ['<code>CourseCard.tsx</code>: <code>interface CourseCardProps { course: Course; onEnroll: (id: number) =&gt; void; highlight?: boolean }</code>, default <code>highlight = false</code>, show <code>course.teacher ?? "TBA"</code>.', '<code>CourseCard.tsx</code>: <code>interface CourseCardProps { course: Course; onEnroll: (id: number) =&gt; void; highlight?: boolean }</code>, mặc định <code>highlight = false</code>, hiện <code>course.teacher ?? "TBA"</code>.'],
    ['<code>DataList.tsx</code>: a <b>generic</b> component <code>function DataList&lt;T&gt;({ items, getKey, renderItem }: DataListProps&lt;T&gt;)</code> — T is inferred from <code>items</code>.', '<code>DataList.tsx</code>: component <b>generic</b> <code>function DataList&lt;T&gt;({ items, getKey, renderItem }: DataListProps&lt;T&gt;)</code> — T được suy ra từ <code>items</code>.'],
    ['<code>CoursePage.tsx</code>: <code>useState&lt;Course[]&gt;</code>, <code>useState&lt;Level | ""&gt;</code>, <code>useState&lt;Course | null&gt;</code>; handlers typed <code>ChangeEvent&lt;HTMLSelectElement&gt;</code> and <code>FormEvent&lt;HTMLFormElement&gt;</code>.', '<code>CoursePage.tsx</code>: <code>useState&lt;Course[]&gt;</code>, <code>useState&lt;Level | ""&gt;</code>, <code>useState&lt;Course | null&gt;</code>; handler có kiểu <code>ChangeEvent&lt;HTMLSelectElement&gt;</code> và <code>FormEvent&lt;HTMLFormElement&gt;</code>.'],
    ['Copy <code>src/mistakes.tsx</code> (self-check) and run <code>tsc</code>.', 'Chép <code>src/mistakes.tsx</code> (tự kiểm) rồi chạy <code>tsc</code>.'],
  ],
  pitfall: [
    '<b>Trap:</b> <code>useState([])</code> without a type argument infers <code>never[]</code> in strict mode — every later <code>setCourses([...prev, course])</code> then errors. Give empty arrays and <code>null</code> initial values an explicit type: <code>useState&lt;Course[]&gt;([])</code>.',
    '<b>Bẫy:</b> <code>useState([])</code> không ghi kiểu thì ở chế độ strict bị suy ra <code>never[]</code> — mọi lệnh <code>setCourses([...prev, course])</code> sau đó đều báo lỗi. Mảng rỗng và giá trị đầu <code>null</code> phải ghi kiểu rõ: <code>useState&lt;Course[]&gt;([])</code>.',
  ],
  pass: [
    ['<code>tsc</code> exits with no output (exit code 0) <b>including</b> <code>mistakes.tsx</code>.', '<code>tsc</code> kết thúc không in gì (mã thoát 0) <b>kể cả</b> với <code>mistakes.tsx</code>.'],
    ['Loosen <code>Level</code> to <code>string</code> → tsc reports “Unused @ts-expect-error directive” — proof that the union type was doing work. Undo.', 'Nới <code>Level</code> thành <code>string</code> → tsc báo "Unused @ts-expect-error directive" — bằng chứng union type đang làm việc. Trả lại.'],
    ['No <code>any</code> anywhere in your files.', 'Không có <code>any</code> nào trong các tệp của bạn.'],
  ],
  check: { note: ['Every line marked <code>@ts-expect-error</code> MUST be a type error. If your types are too loose, tsc complains that the directive is unused.', 'Mọi dòng đánh dấu <code>@ts-expect-error</code> BẮT BUỘC phải là lỗi kiểu. Kiểu của bạn lỏng quá thì tsc kêu chỉ thị đó thừa.'], files: [['src/mistakes.tsx', CODE.a31_mistakes, 'typescript'], ['tsconfig.json (stand-alone check, strict)', CODE.a31_tsconfig, 'json']], run: 'npx tsc --noEmit -p tsconfig.app.json   # or with the stand-alone file: npx tsc -p tsconfig.json' },
  solution: [['src/types.ts', CODE.a31_types, 'typescript'], ['src/CourseCard.tsx', CODE.a31_card, 'typescript'], ['src/DataList.tsx', CODE.a31_list, 'typescript'], ['src/CoursePage.tsx', CODE.a31_page, 'typescript']],
  solutionNote: ['The solution files sit side by side in <code>src/</code> (imports like <code>./types</code>); move them into folders in your project and fix the paths.', 'Các tệp lời giải nằm cạnh nhau trong <code>src/</code> (import kiểu <code>./types</code>); trong dự án hãy xếp vào thư mục và sửa đường dẫn.'],
  codelab: `/code-lab/typescript${REF}`, codelabSub: ['TypeScript on Code Lab.', 'TypeScript trên Code Lab.'],
});

const LA32 = lab({
  title: 'Lab A3.2 — Next.js App Router: file-based routes, a dynamic [id] page, notFound() & a client component|||Lab A3.2 — Next.js App Router: route theo thư mục, trang động [id], notFound() & client component',
  slug: 'fer202-a3-lab2-nextjs-app-router',
  description: 'Dựng mini catalog bằng Next.js 15: layout chung, /courses là server component async, /courses/[id] với params là Promise (await), notFound() trả HTTP 404, generateStaticParams (SSG), nút Like là client component ("use client") — kiểm bằng next build + curl mã trạng thái.',
  eyebrow: ['Advanced A3 · Lab A3.2 · Next.js', 'Nâng cao A3 · Lab A3.2 · Next.js'],
  h2: ['React Router vs Next.js: the folder IS the route', 'React Router và Next.js: thư mục CHÍNH LÀ route'],
  goal: [
    '<b>Goal:</b> rebuild the course list + course detail you did with React Router (Chapter 9) in Next.js, and see what changes: no <code>&lt;Routes&gt;</code>, data loaded on the server, real 404 status codes, pre-rendered HTML.',
    '<b>Mục tiêu:</b> dựng lại trang danh sách + chi tiết khoá học từng làm bằng React Router (Chương 9) bằng Next.js, và thấy cái gì đổi: không còn <code>&lt;Routes&gt;</code>, dữ liệu tải ở server, mã 404 thật, HTML dựng sẵn.',
  ],
  setup: `npx create-next-app@15 lab-a3-2 --ts --app --eslint --no-tailwind --no-src-dir --no-turbopack --import-alias "@/*"
cd lab-a3-2
npm run dev        # http://localhost:3000`,
  tasks: [
    ['<code>lib/courses.ts</code>: a <code>Course</code> interface and two async functions <code>getCourses()</code> / <code>getCourse(id)</code> (later they can <code>fetch</code> your json-server).', '<code>lib/courses.ts</code>: interface <code>Course</code> và hai hàm async <code>getCourses()</code> / <code>getCourse(id)</code> (sau này có thể <code>fetch</code> json-server của bạn).'],
    ['<code>app/layout.tsx</code>: a <code>&lt;nav&gt;</code> with <code>next/link</code> to <code>/</code> and <code>/courses</code> around <code>{children}</code>; <code>app/page.tsx</code>: a welcome <code>&lt;h1&gt;</code>.', '<code>app/layout.tsx</code>: một <code>&lt;nav&gt;</code> dùng <code>next/link</code> tới <code>/</code> và <code>/courses</code> bao quanh <code>{children}</code>; <code>app/page.tsx</code>: một <code>&lt;h1&gt;</code> chào mừng.'],
    ['<code>app/courses/page.tsx</code>: an <b>async server component</b> that awaits <code>getCourses()</code> and links each title to <code>/courses/{id}</code>.', '<code>app/courses/page.tsx</code>: một <b>server component async</b> await <code>getCourses()</code> và gắn link mỗi tên tới <code>/courses/{id}</code>.'],
    ['<code>app/courses/[id]/page.tsx</code>: <code>const { id } = await params</code> (Next 15 passes <code>params</code> as a Promise), <code>notFound()</code> when the course does not exist, plus <code>generateStaticParams()</code>.', '<code>app/courses/[id]/page.tsx</code>: <code>const { id } = await params</code> (Next 15 truyền <code>params</code> dạng Promise), gọi <code>notFound()</code> khi không có khoá, thêm <code>generateStaticParams()</code>.'],
    ['<code>app/not-found.tsx</code>, and <code>components/LikeButton.tsx</code> starting with <code>"use client"</code> (it uses <code>useState</code> + <code>onClick</code>) placed on the detail page.', '<code>app/not-found.tsx</code>, và <code>components/LikeButton.tsx</code> mở đầu bằng <code>"use client"</code> (vì dùng <code>useState</code> + <code>onClick</code>) đặt trên trang chi tiết.'],
  ],
  pitfall: [
    '<b>Trap:</b> calling <code>useState</code> in a file without <code>"use client"</code> fails the build (“useState only works in Client Components”). In the App Router every component is a <em>server</em> component by default; add the directive only to the small interactive leaves, not to whole pages.',
    '<b>Bẫy:</b> gọi <code>useState</code> trong tệp không có <code>"use client"</code> thì build hỏng ("useState only works in Client Components"). Ở App Router mọi component mặc định là <em>server</em> component; chỉ thêm chỉ thị cho các lá nhỏ có tương tác, đừng thêm cho cả trang.',
  ],
  pass: [
    ['<code>npm run build</code> succeeds and its route table lists <code>/courses/[id]</code> as ● SSG with <code>/courses/1</code>, <code>/2</code>, <code>/3</code>.', '<code>npm run build</code> thành công và bảng route ghi <code>/courses/[id]</code> là ● SSG với <code>/courses/1</code>, <code>/2</code>, <code>/3</code>.'],
    ['After <code>npm start</code>: <code>/</code>, <code>/courses</code>, <code>/courses/2</code> return 200; <code>/courses/99</code> returns <b>404</b> and shows your not-found page.', 'Sau <code>npm start</code>: <code>/</code>, <code>/courses</code>, <code>/courses/2</code> trả 200; <code>/courses/99</code> trả <b>404</b> và hiện trang not-found của bạn.'],
    ['The Like button counts up on the detail page; View Source of <code>/courses</code> already contains the course titles (server-rendered).', 'Nút Like đếm lên trên trang chi tiết; View Source của <code>/courses</code> đã chứa sẵn tên khoá học (render ở server).'],
  ],
  check: { note: ['Build, start, then ask each URL for its status code:', 'Build, chạy, rồi hỏi mã trạng thái từng URL:'], files: [], run: `npm run build && npm start &
for u in / /courses /courses/2 /courses/99; do echo "$u $(curl -s -o /dev/null -w '%{http_code}' localhost:3000$u)"; done
# expected: 200 200 200 404`, expect: ['/ 200 · /courses 200 · /courses/2 200 · /courses/99 404', '/ 200 · /courses 200 · /courses/2 200 · /courses/99 404'] },
  why: ['FE: “In Next.js, what mechanism primarily determines the routes?” (file system), “What are the key features of Next.js?” (8 papers), “How do you create a dynamic route?” — this lab answers all three with your own hands.', 'FE: "Trong Next.js, cơ chế nào quyết định route?" (hệ thống tệp), "Các tính năng chính của Next.js?" (8 đề), "Tạo route động thế nào?" — lab này trả lời cả ba bằng chính tay bạn.'],
  solution: [['lib/courses.ts', CODE.a32_data, 'typescript'], ['app/layout.tsx', CODE.a32_layout, 'typescript'], ['app/page.tsx', CODE.a32_home, 'typescript'], ['app/courses/page.tsx', CODE.a32_list, 'typescript'], ['app/courses/[id]/page.tsx', CODE.a32_detail, 'typescript'], ['app/not-found.tsx', CODE.a32_nf, 'typescript'], ['components/LikeButton.tsx', CODE.a32_like, 'typescript']],
  codelabSub: ['React on Code Lab.', 'React trên Code Lab.'],
});

export default {
  ch2: [L21, L22],
  ch3: [L31, L32],
  ch7: [L71, L72],
  ch12: [L121, L122],
  a2: [LA21, LA22],
  a3: [LA31, LA32],
};
