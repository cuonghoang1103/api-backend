/**
 * FER202 · Exercise 24 — Intro to Redux: các bước cài đặt, store nhiều slice, và phân biệt state toàn cục / cục bộ.
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich });

export default doiDau({
  slug: 'fer202-12-ex24-intro-redux',
  ten: 'Exercise 24 — Intro to Redux',
  khoa: KHOA,
  baiHoc: 'fer202-12-ex24-intro-redux',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'Order the steps to add Redux Toolkit to a React app',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['install', 'slice', 'store', 'Provider', 'hooks'], the: ['redux', 'order', 'exercise-24'],
      moTa: {
        en: '<p>Exercise 24 walks through adding Redux to an existing Vite/CRA app. Put the steps in the order you would actually do them — each step needs the previous one to exist.</p>',
        vi: '<p>Exercise 24 đi qua việc thêm Redux vào một app Vite/CRA sẵn có. Hãy xếp các bước theo đúng thứ tự bạn làm — mỗi bước cần bước trước đã có.</p>',
      },
      goiY: ['Store cần reducer của slice ⇒ slice trước store.', 'Hook chỉ chạy bên trong Provider.'],
      loiHayGap: ['Dùng useSelector trước khi bọc Provider ⇒ lỗi "could not find react-redux context value".', 'Cài gói <code>redux</code> cũ thay vì <code>@reduxjs/toolkit</code>.'],
      giaiThich: '<p>Cài gói → tạo slice → configureStore → bọc Provider ở index.js → dùng useSelector/useDispatch trong component.</p>',
      thuatNgu: [{ en: 'Provider', vi: 'component đưa store xuống cây React' }],
      cauHoi: [
        o('s1', 'Order the steps', [
          ['d', 'Wrap <code>&lt;App /&gt;</code> in <code>&lt;Provider store={store}&gt;</code> in index.js'],
          ['b', 'Create <code>counterSlice</code> with <code>createSlice</code>'],
          ['e', 'Read with <code>useSelector</code> and update with <code>useDispatch</code> in components'],
          ['a', 'Install: <code>npm install @reduxjs/toolkit react-redux</code>'],
          ['c', 'Create the store with <code>configureStore({ reducer: { counter: counterReducer } })</code>'],
        ], ['a', 'b', 'c', 'd', 'e'], 'Install → slice → store → Provider → hooks.|||Cài → slice → store → Provider → hook.'),
      ],
    }),
    reactNho({
      tieuDe: 'One store, two slices: theme and counter',
      doKho: 'MEDIUM', phut: 15, index: { redux: './app/store' },
      themGiai: {
        'src/features/theme/themeSlice.js': `// src/features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' },
  reducers: {
    toggled(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggled } = themeSlice.actions;
export const selectMode = (state) => state.theme.mode;
export default themeSlice.reducer;
`,
        'src/features/counter/counterSlice.js': `// src/features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented(state) {
      state.value += 1;
    },
  },
});

export const { incremented } = counterSlice.actions;
export const selectValue = (state) => state.counter.value;
export default counterSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js — mỗi slice một khoá trong state gốc
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    counter: counterReducer,
  },
});
`,
        'src/components/Header.js': `// src/components/Header.js — chỉ đọc theme
import { useDispatch, useSelector } from 'react-redux';
import { selectMode, toggled } from '../features/theme/themeSlice';

export default function Header() {
  const mode = useSelector(selectMode);
  const dispatch = useDispatch();
  return (
    <header id="header" className={mode}>
      <span id="mode">Mode: {mode}</span>
      <button id="toggle-theme" type="button" onClick={() => dispatch(toggled())}>Toggle theme</button>
    </header>
  );
}
`,
        'src/components/Counter.js': `// src/components/Counter.js — chỉ đọc counter
import { useDispatch, useSelector } from 'react-redux';
import { incremented, selectValue } from '../features/counter/counterSlice';

export default function Counter() {
  const value = useSelector(selectValue);
  const dispatch = useDispatch();
  return (
    <section>
      <p id="value">{value}</p>
      <button id="inc" type="button" onClick={() => dispatch(incremented())}>+1</button>
    </section>
  );
}
`,
      },
      themDau: {
        'src/features/theme/themeSlice.js': `// src/features/theme/themeSlice.js — STARTER: viết themeSlice (name "theme", { mode: "light" }, toggled)
export default (state = { mode: 'light' }) => state;
`,
        'src/features/counter/counterSlice.js': `// src/features/counter/counterSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { incremented(state) { state.value += 1; } },
});

export const { incremented } = counterSlice.actions;
export default counterSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js — STARTER: thêm reducer theme
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({ reducer: { counter: counterReducer } });
`,
        'src/components/Header.js': `// src/components/Header.js — STARTER (theme đang là state cục bộ!)
import { useState } from 'react';

export default function Header() {
  const [mode, setMode] = useState('light');
  return (
    <header id="header" className={mode}>
      <span id="mode">Mode: {mode}</span>
      <button id="toggle-theme" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>Toggle theme</button>
    </header>
  );
}
`,
        'src/components/Counter.js': `// src/components/Counter.js — STARTER
export default function Counter() {
  return <p id="value">0</p>;
}
`,
      },
      khaiNiem: ['combining slices', 'state shape', 'feature folders', 'components reading different slices'], the: ['redux', 'redux-toolkit', 'exercise-24'],
      moTa: {
        en: '<p>A real store has several slices. Add <code>themeSlice</code> (<code>{ mode: "light" }</code>, action <code>toggled</code>) next to <code>counterSlice</code> and combine them in <code>configureStore</code> as <code>theme</code> and <code>counter</code>. <code>Header</code> and <code>Counter</code> live in separate files and each reads only its own slice. A third component <code>Footer</code> (in App) shows both.</p>',
        vi: '<p>Store thật có nhiều slice. Thêm <code>themeSlice</code> (<code>{ mode: "light" }</code>, action <code>toggled</code>) cạnh <code>counterSlice</code> và ghép chúng trong <code>configureStore</code> với khoá <code>theme</code> và <code>counter</code>. <code>Header</code> và <code>Counter</code> nằm ở hai tệp riêng, mỗi cái chỉ đọc slice của mình. Component thứ ba <code>Footer</code> (trong App) hiện cả hai.</p>',
      },
      yeuCau: [
        { en: 'Header: <code>#header</code> with class = mode, <code>#mode</code> <code>Mode: dark</code>, <code>#toggle-theme</code>. Counter: <code>#value</code>, <code>#inc</code>.', vi: 'Header: <code>#header</code> có class = mode, <code>#mode</code> <code>Mode: dark</code>, <code>#toggle-theme</code>. Counter: <code>#value</code>, <code>#inc</code>.' },
        { en: 'Footer <code>#footer</code>: <code>dark · 2 clicks</code>.', vi: 'Footer <code>#footer</code>: <code>dark · 2 clicks</code>.' },
      ],
      viDu: [{ input: 'toggle, +1, +1', output: 'Footer: dark · 2 clicks', explanation: 'state = { theme: { mode }, counter: { value } }|||state = { theme: { mode }, counter: { value } }' }],
      goiY: ['configureStore({ reducer: { theme: themeReducer, counter: counterReducer } })', 'Footer: const mode = useSelector((s) => s.theme.mode); const value = useSelector((s) => s.counter.value);'],
      loiHayGap: ['Để theme trong useState của Header ⇒ Footer không biết theme.', 'Đặt tên khoá store khác tên trong selector (<code>themes</code> vs <code>theme</code>) ⇒ selector trả undefined.'],
      thuatNgu: [{ en: 'state shape', vi: 'cấu trúc object state gốc' }],
      giaiThich: '<p>Mỗi khoá trong <code>reducer</code> của configureStore là một nhánh của state gốc. Component chọn đúng nhánh mình cần bằng selector — đổi theme không làm Counter vẽ lại.</p>',
      dau: `// src/App.js — STARTER
import Header from './components/Header';
import Counter from './components/Counter';

export default function App() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  );
}
`,
      giai: `// src/App.js — ghép các component; Footer đọc hai slice
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Counter from './components/Counter';

function Footer() {
  const mode = useSelector((s) => s.theme.mode);
  const value = useSelector((s) => s.counter.value);
  return <footer id="footer">{mode} · {value} clicks</footer>;
}

export default function App() {
  return (
    <div>
      <Header />
      <Counter />
      <Footer />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Theme toggles via Redux', kiem: 'danh-sach-text', selector: '#mode', mongDoi: ['Mode: dark'], truoc: [click('#toggle-theme')] },
        { moTa: 'Header class follows', kiem: 'ton-tai', selector: '#header.dark', truoc: [click('#toggle-theme')] },
        { moTa: 'Counter works', kiem: 'text', selector: '#value', giaTri: '2', truoc: [click('#inc', 2)] },
        { moTa: 'Footer reads both slices', kiem: 'text', selector: '#footer', giaTri: 'dark · 2 clicks', truoc: [click('#toggle-theme'), click('#inc', 2)] },
        { an: true, moTa: 'Store combines theme and counter', kiem: 'ma-nguon', tep: 'src/app/store.js', khop: 'reducer\\s*:\\s*\\{[\\s\\S]*theme\\s*:[\\s\\S]*counter\\s*:' },
        { an: true, moTa: 'Header has no local theme state', kiem: 'ma-nguon', tep: 'src/components/Header.js', khop: 'useState', phuDinh: true },
      ],
    }),
    tinh({
      tieuDe: 'Redux state or local state?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['global vs local state', 'server cache', 'form state'], the: ['redux', 'quiz', 'exercise-24'],
      moTa: {
        en: '<p>Not everything belongs in Redux. For each piece of state choose where it should live. Ask: do several distant components need it? Must it survive navigation? Is it just UI detail of one component?</p>',
        vi: '<p>Không phải mọi thứ đều thuộc về Redux. Với mỗi mẩu state, chọn nơi nên đặt. Hãy hỏi: nhiều component ở xa nhau có cần không? Có phải giữ qua khi chuyển trang? Hay chỉ là chi tiết giao diện của một component?</p>',
      },
      goiY: ['Dùng ở nhiều nơi + sống lâu ⇒ store.', 'Chỉ một component quan tâm ⇒ useState.'],
      loiHayGap: ['Đưa mọi ô nhập vào Redux ⇒ dispatch mỗi phím gõ, code dài.', 'Giữ giỏ hàng trong state của một trang ⇒ đổi trang là mất.'],
      giaiThich: '<p>Redux cho state dùng chung và lâu dài (người dùng đăng nhập, giỏ hàng, theme). State tạm của một component (đang mở dropdown, chữ đang gõ) để cục bộ.</p>',
      thuatNgu: [{ en: 'global state', vi: 'state dùng chung toàn app' }, { en: 'local state', vi: 'state riêng của một component' }],
      cauHoi: [
        q('q1', 'The logged-in user (shown in navbar, used by guards and profile page)', [['a', 'Redux store'], ['b', 'Local useState']], ['a'], 'Many components, whole session.|||Nhiều component, suốt phiên.'),
        q('q2', 'Whether one dropdown menu is open', [['a', 'Redux store'], ['b', 'Local useState']], ['b'], 'Only that component cares.|||Chỉ component đó quan tâm.'),
        q('q3', 'Shopping cart lines', [['a', 'Redux store'], ['b', 'Local useState']], ['a'], 'Header badge, cart page and checkout all need them.|||Badge ở header, trang giỏ và thanh toán đều cần.'),
        q('q4', 'The text currently typed in a search box before submitting', [['a', 'Redux store'], ['b', 'Local useState']], ['b'], 'Put the SUBMITTED query in the store or URL if others need it.|||Chuỗi ĐÃ GỬI mới cần đưa vào store hoặc URL nếu nơi khác cần.'),
        q('q5', 'Light/dark theme chosen by the user', [['a', 'Redux store'], ['b', 'Local useState']], ['a'], 'Every component may style itself by it (Context also works).|||Mọi component có thể dựa vào nó để tạo kiểu (Context cũng được).'),
      ],
    }),
  ],
});
