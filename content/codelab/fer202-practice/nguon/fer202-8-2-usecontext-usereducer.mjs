/**
 * FER202 · 8.2 — useContext & useReducer (bài luyện).
 * Dễ → khó: reducer thuần (JS) → useReducer có payload → AuthContext + custom hook → form bằng reducer →
 * Context + reducer (giỏ hàng chia sẻ cho nhiều component).
 */
import { doiDau, KHOA, jsNho, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });

export default doiDau({
  slug: 'fer202-8-2-usecontext-usereducer',
  ten: '8.2 useContext & useReducer',
  khoa: KHOA,
  baiHoc: 'fer202-8-2-usecontext-usereducer',
  de: [
    jsNho({
      tieuDe: 'A pure todos reducer',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['reducer', 'pure function', 'immutable update'], the: ['hooks', 'useReducer', 'javascript'],
      moTa: {
        en: '<p>Write <code>todosReducer(state, action)</code> for a todo list — the function you would pass to <code>useReducer</code>. It must be <b>pure</b>: never mutate <code>state</code>, always return a new array when something changes, and return the SAME state for unknown actions.</p>',
        vi: '<p>Viết <code>todosReducer(state, action)</code> cho danh sách việc — chính là hàm bạn truyền vào <code>useReducer</code>. Nó phải <b>thuần</b>: không sửa <code>state</code>, luôn trả mảng mới khi có thay đổi, và trả LẠI CHÍNH state khi gặp action lạ.</p>',
      },
      yeuCau: [
        { en: '<code>{type:"added", id, text}</code> appends <code>{id, text, done:false}</code>; <code>{type:"toggled", id}</code> flips <code>done</code>; <code>{type:"removed", id}</code> deletes.', vi: '<code>{type:"added", id, text}</code> thêm <code>{id, text, done:false}</code> vào cuối; <code>{type:"toggled", id}</code> đảo <code>done</code>; <code>{type:"removed", id}</code> xoá.' },
        { en: 'Blank text (after trim) ⇒ no change (same reference). Unknown type ⇒ return <code>state</code>.', vi: 'Text rỗng (sau trim) ⇒ không đổi (cùng tham chiếu). Type lạ ⇒ trả <code>state</code>.' },
      ],
      viDu: [{ input: 'todosReducer([], {type:"added", id:1, text:" Learn hooks "})', output: '[{ id: 1, text: "Learn hooks", done: false }]', explanation: 'Trim the text; the original [] is untouched.|||Cắt khoảng trắng; mảng [] gốc không bị đổi.' }],
      goiY: ['switch (action.type) { case "added": … return [...state, {…}]; case "toggled": return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t); … default: return state; }', 'removed: state.filter(t => t.id !== action.id)'],
      loiHayGap: ['<code>state.push(...)</code> rồi <code>return state</code> ⇒ cùng tham chiếu, React KHÔNG vẽ lại.', '<code>t.done = !t.done</code> trong map ⇒ sửa object cũ (đột biến ngầm).'],
      thuatNgu: [{ en: 'reducer', vi: 'hàm (state, action) ⇒ state mới' }, { en: 'action', vi: 'object mô tả "chuyện gì đã xảy ra"' }],
      giaiThich: '<p>Reducer gom mọi cách state thay đổi vào MỘT hàm thuần, dễ test như hàm thường (bài này máy chấm gọi trực tiếp). React so sánh tham chiếu: trả object/mảng mới ⇒ vẽ lại, trả state cũ ⇒ bỏ qua.</p>',
      dau: `// main.js — STARTER
function todosReducer(state, action) {
  if (action.type === 'added') {
    state.push({ id: action.id, text: action.text, done: false });
  }
  return state;
}
`,
      giai: `// main.js — reducer THUẦN: không đột biến, action lạ trả nguyên state
function todosReducer(state, action) {
  switch (action.type) {
    case 'added': {
      const text = String(action.text ?? '').trim();
      if (!text) return state; // không đổi ⇒ cùng tham chiếu
      return [...state, { id: action.id, text, done: false }];
    }
    case 'toggled':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'removed':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}
`,
      kiem: [
        { moTa: 'added appends a trimmed todo', goi: 'todosReducer([], { type: "added", id: 1, text: " Learn hooks " })', mongDoi: [{ id: 1, text: 'Learn hooks', done: false }] },
        { moTa: 'toggled flips done', goi: 'todosReducer([{ id: 1, text: "A", done: false }, { id: 2, text: "B", done: false }], { type: "toggled", id: 2 })', mongDoi: [{ id: 1, text: 'A', done: false }, { id: 2, text: 'B', done: true }] },
        { moTa: 'removed deletes by id', goi: 'todosReducer([{ id: 1, text: "A", done: false }, { id: 2, text: "B", done: true }], { type: "removed", id: 1 })', mongDoi: [{ id: 2, text: 'B', done: true }] },
        { moTa: 'Does not mutate the old state', goi: '(() => { const s = [{ id: 1, text: "A", done: false }]; todosReducer(s, { type: "toggled", id: 1 }); todosReducer(s, { type: "added", id: 2, text: "B" }); return s; })()', mongDoi: [{ id: 1, text: 'A', done: false }] },
        { an: true, moTa: 'Unknown action ⇒ same reference', goi: '(() => { const s = []; return todosReducer(s, { type: "weird" }) === s; })()', mongDoi: true },
        { an: true, moTa: 'Blank text ⇒ same reference', goi: '(() => { const s = []; return todosReducer(s, { type: "added", id: 3, text: "   " }) === s; })()', mongDoi: true },
        { an: true, moTa: 'toggled returns a new array', goi: '(() => { const s = [{ id: 1, text: "A", done: false }]; return todosReducer(s, { type: "toggled", id: 1 }) !== s; })()', mongDoi: true },
      ],
    }),
    reactNho({
      tieuDe: 'useReducer counter with a step payload',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['useReducer', 'dispatch', 'action payload'], the: ['hooks', 'useReducer'],
      moTa: {
        en: '<p>Rewrite a counter with <code>useReducer</code>. The step (1, 5 or 10) is chosen with a select and travels in the action <b>payload</b>. Count must stay between 0 and 100.</p>',
        vi: '<p>Viết lại bộ đếm bằng <code>useReducer</code>. Bước (1, 5 hoặc 10) chọn bằng select và đi theo <b>payload</b> của action. Số đếm phải nằm trong 0–100.</p>',
      },
      yeuCau: [
        { en: '<code>#count</code>, <code>#step</code> (select 1/5/10), <code>#inc</code>, <code>#dec</code>, <code>#reset</code>. Actions: <code>INCREMENT</code>/<code>DECREMENT</code> with <code>payload</code> = step, <code>RESET</code>.', vi: '<code>#count</code>, <code>#step</code> (select 1/5/10), <code>#inc</code>, <code>#dec</code>, <code>#reset</code>. Action: <code>INCREMENT</code>/<code>DECREMENT</code> có <code>payload</code> = bước, <code>RESET</code>.' },
        { en: 'Clamp to [0, 100] inside the reducer.', vi: 'Kẹp trong [0, 100] ngay trong reducer.' },
      ],
      viDu: [{ input: 'step 10, +10 ×11', output: '100', explanation: 'The 11th increment is clamped.|||Lần cộng thứ 11 bị kẹp lại.' }],
      goiY: ['function reducer(state, action) { switch (action.type) { case "INCREMENT": return { count: Math.min(100, state.count + action.payload) }; … } }', 'const [state, dispatch] = useReducer(reducer, { count: 0 }); onClick={() => dispatch({ type: "INCREMENT", payload: step })}'],
      loiHayGap: ['Giá trị select là CHUỖI ⇒ "0" + "5" = "05"; nhớ Number().', 'Kẹp ở component thay vì reducer ⇒ logic rải rác, dễ sót.'],
      thuatNgu: [{ en: 'payload', vi: 'dữ liệu kèm theo action' }, { en: 'dispatch', vi: 'gửi action tới reducer' }],
      giaiThich: '<p>Với useReducer, component chỉ <b>mô tả sự kiện</b> (dispatch action); mọi quy tắc (cộng bao nhiêu, kẹp biên) nằm trong reducer. Đây là mẫu bài Exercise 15 của trường.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  return (
    <div>
      <p id="count">{count}</p>
      <select id="step" value={step} onChange={(e) => setStep(e.target.value)}>
        <option value="1">1</option><option value="5">5</option><option value="10">10</option>
      </select>
      <button id="inc" onClick={() => setCount(count + step)}>+</button>
      <button id="dec" onClick={() => setCount(count - step)}>−</button>
      <button id="reset" onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
`,
      giai: `// src/App.js — useReducer: component dispatch, reducer giữ quy tắc
import { useReducer, useState } from 'react';

const initialState = { count: 0 };
const clamp = (n) => Math.max(0, Math.min(100, n));

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: clamp(state.count + action.payload) };
    case 'DECREMENT':
      return { count: clamp(state.count - action.payload) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(1);
  return (
    <div>
      <p id="count">{state.count}</p>
      <select id="step" value={step} onChange={(e) => setStep(Number(e.target.value))}>
        <option value="1">1</option><option value="5">5</option><option value="10">10</option>
      </select>
      <button id="inc" type="button" onClick={() => dispatch({ type: 'INCREMENT', payload: step })}>+</button>
      <button id="dec" type="button" onClick={() => dispatch({ type: 'DECREMENT', payload: step })}>−</button>
      <button id="reset" type="button" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Step 5 adds 5', kiem: 'text', selector: '#count', giaTri: '10', truoc: [{ hanhDong: 'doi', selector: '#step', giaTri: '5' }, click('#inc', 2)] },
        { moTa: 'Clamped at 100', kiem: 'text', selector: '#count', giaTri: '100', truoc: [{ hanhDong: 'doi', selector: '#step', giaTri: '10' }, click('#inc', 11)] },
        { moTa: 'Never below 0', kiem: 'text', selector: '#count', giaTri: '0', truoc: [click('#dec', 2)] },
        { an: true, moTa: 'Reset', kiem: 'text', selector: '#count', giaTri: '0', truoc: [click('#inc', 3), click('#reset')] },
        { an: true, moTa: 'Uses useReducer with INCREMENT + payload', kiem: 'ma-nguon', khop: 'useReducer\\([\\s\\S]*type:\\s*[\'"]INCREMENT[\'"]\\s*,\\s*payload' },
      ],
    }),
    reactNho({
      tieuDe: 'AuthContext with a safe useAuth hook',
      doKho: 'MEDIUM', phut: 14,
      khaiNiem: ['createContext', 'Provider value', 'custom hook guard'], the: ['hooks', 'useContext'],
      moTa: {
        en: '<p>Build <code>AuthProvider</code> holding the current user, with <code>login(name)</code> and <code>logout()</code>. Components read it through <code>useAuth()</code>, which <b>throws</b> <code>useAuth must be used inside AuthProvider</code> when there is no provider. A navbar and a login panel live in DIFFERENT components but share the user.</p>',
        vi: '<p>Dựng <code>AuthProvider</code> giữ người dùng hiện tại, có <code>login(name)</code> và <code>logout()</code>. Component đọc qua <code>useAuth()</code>, hook này <b>ném lỗi</b> <code>useAuth must be used inside AuthProvider</code> khi không có provider. Navbar và khung đăng nhập là các component KHÁC nhau nhưng dùng chung user.</p>',
      },
      yeuCau: [
        { en: 'Navbar <code>#greeting</code>: <code>Hello, Lan</code> or <code>Guest</code>; <code>#btn-logout</code> only when logged in.', vi: 'Navbar <code>#greeting</code>: <code>Hello, Lan</code> hoặc <code>Guest</code>; <code>#btn-logout</code> chỉ hiện khi đã đăng nhập.' },
        { en: 'LoginPanel: <code>#name</code> + <code>#btn-login</code> (ignore blank), hidden when logged in. Export <code>useAuth</code> for the hidden test.', vi: 'LoginPanel: <code>#name</code> + <code>#btn-login</code> (bỏ qua chuỗi rỗng), ẩn khi đã đăng nhập.' },
      ],
      viDu: [{ input: 'type "Lan", Login', output: 'Hello, Lan · login panel hidden', explanation: 'Both components re-render because they consume the same context.|||Cả hai component vẽ lại vì cùng dùng một context.' }],
      goiY: ['const AuthContext = createContext(null); function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }', 'Provider: const [user, setUser] = useState(null); value={{ user, login: (n) => setUser({ name: n }), logout: () => setUser(null) }}'],
      loiHayGap: ['Mỗi component tự <code>useState(user)</code> ⇒ hai bản sao không đồng bộ.', 'Để default context là object rỗng ⇒ dùng ngoài provider không báo lỗi, bug âm thầm.'],
      thuatNgu: [{ en: 'guard', vi: 'chốt kiểm điều kiện, báo lỗi sớm' }],
      giaiThich: '<p>Mặc định <code>null</code> + custom hook ném lỗi biến lỗi "quên bọc Provider" thành thông báo rõ ràng ngay lần render đầu, thay vì lỗi <code>cannot read properties of undefined</code> ở đâu đó sâu bên trong.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function Navbar() {
  const [user] = useState(null);
  return <nav><span id="greeting">{user ? 'Hello, ' + user.name : 'Guest'}</span></nav>;
}

function LoginPanel() {
  const [name, setName] = useState('');
  return (
    <div>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <button id="btn-login">Login</button>
    </div>
  );
}

export default function App() {
  return (<div><Navbar /><LoginPanel /></div>);
}
`,
      giai: `// src/App.js — một nguồn sự thật (AuthProvider), đọc qua useAuth có chốt kiểm
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (name) => setUser({ name });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <span id="greeting">{user ? ´Hello, @{user.name}´ : 'Guest'}</span>
      {user && <button id="btn-logout" type="button" onClick={logout}>Logout</button>}
    </nav>
  );
}

function LoginPanel() {
  const { user, login } = useAuth();
  const [name, setName] = useState('');
  if (user) return null;
  const submit = () => {
    if (name.trim()) login(name.trim());
  };
  return (
    <div id="login-panel">
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <button id="btn-login" type="button" onClick={submit}>Login</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <LoginPanel />
    </AuthProvider>
  );
}
`,
      kiem: [
        { moTa: 'Guest by default', kiem: 'text', selector: '#greeting', giaTri: 'Guest' },
        { moTa: 'Login updates the navbar', kiem: 'text', selector: '#greeting', giaTri: 'Hello, Lan', truoc: [nhap('#name', 'Lan'), click('#btn-login')] },
        { moTa: 'Login panel hidden after login', kiem: 'khong-ton-tai', selector: '#btn-login', truoc: [nhap('#name', 'Lan'), click('#btn-login')] },
        { moTa: 'Logout returns to Guest', kiem: 'text', selector: '#greeting', giaTri: 'Guest', truoc: [nhap('#name', 'Lan'), click('#btn-login'), click('#btn-logout')] },
        { an: true, moTa: 'Blank name ignored', kiem: 'text', selector: '#greeting', giaTri: 'Guest', truoc: [nhap('#name', '   '), click('#btn-login')] },
        { an: true, moTa: 'useAuth throws outside the provider', kiem: 'ma-nguon', khop: 'createContext\\(\\s*(null|undefined)?\\s*\\)[\\s\\S]*throw new Error\\(\\s*[\'"´]useAuth must be used inside AuthProvider' },
      ],
    }),
    reactNho({
      tieuDe: 'Form state with useReducer',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['useReducer for forms', 'computed field names', 'validation in reducer'], the: ['hooks', 'useReducer', 'forms'],
      moTa: {
        en: '<p>A sign-up form with three fields and a status. Instead of four <code>useState</code> calls, keep one object in <code>useReducer</code> with actions <code>FIELD_CHANGED</code> (<code>{name, value}</code>), <code>SUBMITTED</code> and <code>RESET</code>. Validation errors are calculated on submit inside the reducer.</p>',
        vi: '<p>Form đăng ký có ba ô và một trạng thái. Thay vì bốn lần <code>useState</code>, giữ một object trong <code>useReducer</code> với action <code>FIELD_CHANGED</code> (<code>{name, value}</code>), <code>SUBMITTED</code> và <code>RESET</code>. Lỗi kiểm hợp lệ tính lúc nộp, ngay trong reducer.</p>',
      },
      yeuCau: [
        { en: 'Inputs <code>name="username"</code> (≥ 3 chars), <code>name="email"</code> (contains <code>@</code>), <code>name="password"</code> (≥ 6 chars); ONE change handler for all three.', vi: 'Ô <code>name="username"</code> (≥ 3 ký tự), <code>name="email"</code> (có <code>@</code>), <code>name="password"</code> (≥ 6 ký tự); MỘT hàm onChange cho cả ba.' },
        { en: 'Submit (<code>#btn-submit</code>): errors in <code>.error</code> elements (messages: <code>Username too short</code>, <code>Invalid email</code>, <code>Password too short</code>); if none ⇒ <code>#status</code> <code>Welcome, &lt;username&gt;!</code>. <code>#btn-reset</code> clears everything.', vi: 'Nộp (<code>#btn-submit</code>): lỗi trong các phần tử <code>.error</code> (chữ: <code>Username too short</code>, <code>Invalid email</code>, <code>Password too short</code>); không lỗi ⇒ <code>#status</code> <code>Welcome, &lt;username&gt;!</code>. <code>#btn-reset</code> xoá hết.' },
      ],
      viDu: [{ input: 'username "ab", email "x", password "123456", submit', output: 'Username too short · Invalid email', explanation: 'Errors appear in field order.|||Lỗi hiện theo thứ tự ô.' }],
      goiY: ['dispatch({ type: "FIELD_CHANGED", name: e.target.name, value: e.target.value }) — reducer: { ...state, values: { ...state.values, [action.name]: action.value } }', 'SUBMITTED: tính errors = {}; nếu Object.keys(errors).length === 0 ⇒ status "success".'],
      loiHayGap: ['Viết ba handler riêng cho ba ô ⇒ lặp code; computed key <code>[name]</code> giải quyết.', 'Ghi đè cả <code>values</code> bằng một trường ⇒ mất hai ô kia.'],
      thuatNgu: [{ en: 'computed property name', vi: 'tên thuộc tính tính từ biến: { [name]: value }' }],
      giaiThich: '<p>Khi các mẩu state liên quan nhau (giá trị, lỗi, trạng thái nộp), một reducer giữ chúng nhất quán: mọi chuyển trạng thái đi qua một chỗ, dễ đọc và dễ test.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form>
      <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button id="btn-submit">Sign up</button>
    </form>
  );
}
`,
      giai: `// src/App.js — một reducer cho giá trị + lỗi + trạng thái
import { useReducer } from 'react';

const initialState = { values: { username: '', email: '', password: '' }, errors: {}, status: 'editing' };

function validate(v) {
  const errors = {};
  if (v.username.trim().length < 3) errors.username = 'Username too short';
  if (!v.email.includes('@')) errors.email = 'Invalid email';
  if (v.password.length < 6) errors.password = 'Password too short';
  return errors;
}

function reducer(state, action) {
  switch (action.type) {
    case 'FIELD_CHANGED':
      return { ...state, values: { ...state.values, [action.name]: action.value }, status: 'editing' };
    case 'SUBMITTED': {
      const errors = validate(state.values);
      return { ...state, errors, status: Object.keys(errors).length ? 'invalid' : 'success' };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const FIELDS = [
  { name: 'username', type: 'text' },
  { name: 'email', type: 'email' },
  { name: 'password', type: 'password' },
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onChange = (e) => dispatch({ type: 'FIELD_CHANGED', name: e.target.name, value: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMITTED' });
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      {FIELDS.map((f) => (
        <div key={f.name}>
          <input name={f.name} type={f.type} placeholder={f.name} value={state.values[f.name]} onChange={onChange} />
          {state.errors[f.name] && <small className="error">{state.errors[f.name]}</small>}
        </div>
      ))}
      <button id="btn-submit" type="submit">Sign up</button>
      <button id="btn-reset" type="button" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      {state.status === 'success' && <p id="status">Welcome, {state.values.username}!</p>}
    </form>
  );
}
`,
      kiem: [
        { moTa: 'Errors in field order', kiem: 'danh-sach-text', selector: '.error', mongDoi: ['Username too short', 'Invalid email'], truoc: [nhap('[name=username]', 'ab'), nhap('[name=email]', 'x'), nhap('[name=password]', '123456'), click('#btn-submit')] },
        { moTa: 'Valid form ⇒ welcome', kiem: 'text', selector: '#status', giaTri: 'Welcome, lan99!', truoc: [nhap('[name=username]', 'lan99'), nhap('[name=email]', 'lan@fpt.edu.vn'), nhap('[name=password]', 'secret1'), click('#btn-submit')] },
        { moTa: 'All three errors on empty submit', kiem: 'so-luong', selector: '.error', giaTri: 3, truoc: [click('#btn-submit')] },
        { an: true, moTa: 'Reset clears values and errors', kiem: 'so-luong', selector: '.error', giaTri: 0, truoc: [click('#btn-submit'), click('#btn-reset')] },
        { an: true, moTa: 'Reset clears the inputs', kiem: 'thuoc-tinh-js', selector: '[name=username]', thuocTinh: 'value', giaTri: '', truoc: [nhap('[name=username]', 'lan'), click('#btn-reset')] },
        { an: true, moTa: 'One reducer with FIELD_CHANGED and a computed key', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*useReducer\\()(?=[\\s\\S]*FIELD_CHANGED)[\\s\\S]*\\[\\s*action\\.name\\s*\\]' },
      ],
    }),
    reactNho({
      tieuDe: 'Context + reducer: a shared shopping cart',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['useReducer + Context', 'derived data', 'splitting components'], the: ['hooks', 'useContext', 'useReducer'],
      moTa: {
        en: '<p>The classic "Context + reducer" architecture: <code>CartProvider</code> owns <code>useReducer(cartReducer, [])</code> and exposes <code>{ items, dispatch }</code>. Three separate components use it: <b>Menu</b> (add dishes), <b>CartBadge</b> in the header (total quantity) and <b>CartPanel</b> (lines, remove, total, clear).</p>',
        vi: '<p>Kiến trúc kinh điển "Context + reducer": <code>CartProvider</code> giữ <code>useReducer(cartReducer, [])</code> và cung cấp <code>{ items, dispatch }</code>. Ba component riêng dùng nó: <b>Menu</b> (thêm món), <b>CartBadge</b> ở header (tổng số lượng) và <b>CartPanel</b> (dòng, xoá, tổng tiền, làm rỗng).</p>',
      },
      yeuCau: [
        { en: 'Dishes: Pho 45000, Banh mi 25000, Tra da 5000. Menu buttons <code>.btn-add</code> (in that order). Adding an existing dish increases its quantity.', vi: 'Món: Pho 45000, Banh mi 25000, Tra da 5000. Nút <code>.btn-add</code> theo thứ tự đó. Thêm món đã có ⇒ tăng số lượng.' },
        { en: '<code>#badge</code> = total quantity. Panel lines <code>li.line</code> text <code>Pho x2</code>; each has <code>.btn-remove</code> (−1, removes the line at 0). <code>#total</code> = <code>Total: 95,000</code> (en-US grouping). <code>#btn-clear</code>; empty ⇒ <code>#empty</code> <code>Cart is empty</code>.', vi: '<code>#badge</code> = tổng số lượng. Dòng <code>li.line</code> chữ <code>Pho x2</code>; mỗi dòng có <code>.btn-remove</code> (−1, về 0 thì bỏ dòng). <code>#total</code> = <code>Total: 95,000</code> (nhóm số kiểu en-US). <code>#btn-clear</code>; rỗng ⇒ <code>#empty</code> <code>Cart is empty</code>.' },
      ],
      viDu: [{ input: 'add Pho, Pho, Banh mi', output: 'badge 3 · Total: 115,000', explanation: 'Badge and total are DERIVED from items — never stored separately.|||Badge và tổng là dữ liệu SUY RA từ items — không lưu riêng.' }],
      goiY: ['case "ADD": const found = state.find(i => i.id === action.dish.id); return found ? state.map(i => i.id === found.id ? { ...i, qty: i.qty + 1 } : i) : [...state, { ...action.dish, qty: 1 }];', 'Tổng: items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString("en-US")'],
      loiHayGap: ['Lưu <code>total</code> thành state riêng ⇒ quên cập nhật khi xoá, số lệch.', 'Truyền <code>dispatch</code> qua props ba tầng thay vì lấy từ context.'],
      thuatNgu: [{ en: 'derived state', vi: 'dữ liệu tính ra từ state, không cần lưu' }],
      giaiThich: '<p>Context lo việc <b>chuyển</b> dữ liệu, reducer lo việc <b>đổi</b> dữ liệu. Ghép hai thứ là "Redux mini" có sẵn trong React — đủ cho app vừa phải, và là bước đệm trước Redux Toolkit ở chương 12.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const DISHES = [
  { id: 1, name: 'Pho', price: 45000 },
  { id: 2, name: 'Banh mi', price: 25000 },
  { id: 3, name: 'Tra da', price: 5000 },
];

function Menu({ onAdd }) {
  return <div>{DISHES.map((d) => <button key={d.id} className="btn-add" onClick={() => onAdd(d)}>{d.name}</button>)}</div>;
}

export default function App() {
  const [items, setItems] = useState([]);
  return (
    <div>
      <header>Cart <span id="badge">{items.length}</span></header>
      <Menu onAdd={(d) => setItems([...items, d])} />
    </div>
  );
}
`,
      giai: `// src/App.js — Context chuyển dữ liệu, reducer đổi dữ liệu
import { createContext, useContext, useReducer } from 'react';

const DISHES = [
  { id: 1, name: 'Pho', price: 45000 },
  { id: 2, name: 'Banh mi', price: 25000 },
  { id: 3, name: 'Tra da', price: 5000 },
];

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const found = state.find((i) => i.id === action.dish.id);
      if (found) return state.map((i) => (i.id === found.id ? { ...i, qty: i.qty + 1 } : i));
      return [...state, { ...action.dish, qty: 1 }];
    }
    case 'REMOVE_ONE':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>;
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

function CartBadge() {
  const { items } = useCart();
  const qty = items.reduce((s, i) => s + i.qty, 0); // suy ra, không lưu riêng
  return <span id="badge">{qty}</span>;
}

function Menu() {
  const { dispatch } = useCart();
  return (
    <div>
      {DISHES.map((d) => (
        <button key={d.id} type="button" className="btn-add" onClick={() => dispatch({ type: 'ADD', dish: d })}>{d.name}</button>
      ))}
    </div>
  );
}

function CartPanel() {
  const { items, dispatch } = useCart();
  if (items.length === 0) return <p id="empty">Cart is empty</p>;
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div>
      <ul>
        {items.map((i) => (
          <li key={i.id} className="line">
            <span>{i.name} x{i.qty}</span>
            <button type="button" className="btn-remove" onClick={() => dispatch({ type: 'REMOVE_ONE', id: i.id })}>−</button>
          </li>
        ))}
      </ul>
      <p id="total">Total: {total.toLocaleString('en-US')}</p>
      <button id="btn-clear" type="button" onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <header>Cart <CartBadge /></header>
      <Menu />
      <CartPanel />
    </CartProvider>
  );
}
`,
      kiem: [
        { moTa: 'Badge counts quantities', kiem: 'text', selector: '#badge', giaTri: '3', truoc: [click('.btn-add:nth-of-type(1)', 2), click('.btn-add:nth-of-type(2)')] },
        { moTa: 'Same dish merges into one line', kiem: 'danh-sach-text', selector: 'li.line > span', mongDoi: ['Pho x2', 'Banh mi x1'], truoc: [click('.btn-add:nth-of-type(1)', 2), click('.btn-add:nth-of-type(2)')] },
        { moTa: 'Total formatted', kiem: 'text', selector: '#total', giaTri: 'Total: 115,000', truoc: [click('.btn-add:nth-of-type(1)', 2), click('.btn-add:nth-of-type(2)')] },
        { moTa: 'Empty cart message', kiem: 'text', selector: '#empty', giaTri: 'Cart is empty' },
        { an: true, moTa: 'Remove one, line disappears at 0', kiem: 'danh-sach-text', selector: 'li.line > span', mongDoi: ['Pho x1'], truoc: [click('.btn-add:nth-of-type(1)', 2), click('.btn-add:nth-of-type(3)'), click('li.line:nth-of-type(1) .btn-remove'), click('li.line:nth-of-type(2) .btn-remove')] },
        { an: true, moTa: 'Clear empties the cart and the badge', kiem: 'danh-sach-text', selector: '#badge, #empty', mongDoi: ['0', 'Cart is empty'], truoc: [click('.btn-add:nth-of-type(3)', 3), click('#btn-clear')] },
        { an: true, moTa: 'Provider holds useReducer', kiem: 'ma-nguon', khop: 'useReducer\\(\\s*cartReducer[\\s\\S]*\\.Provider' },
      ],
    }),
  ],
});
