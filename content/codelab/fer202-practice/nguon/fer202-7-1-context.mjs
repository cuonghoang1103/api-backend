/**
 * FER202 · 7.1 — Prop drilling & the Context API (bài luyện React).
 * Dễ → khó: bỏ prop drilling → giá trị mặc định khi thiếu Provider → theme + custom hook → Provider lồng (Section/
 * Heading) → giỏ hàng dùng chung giữa hai component anh em.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });

export default doiDau({
  slug: 'fer202-7-1-context',
  ten: '7.1 Prop drilling & the Context API',
  khoa: KHOA,
  baiHoc: 'fer202-7-1-context',
  de: [
    reactNho({
      tieuDe: 'Remove prop drilling with createContext and useContext',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['prop drilling', 'createContext', 'Provider', 'useContext'], the: ['context'],
      moTa: {
        en: '<p>The starter passes <code>user</code> through <code>Layout</code> → <code>Sidebar</code> → <code>UserInfo</code>, although only <code>UserInfo</code> uses it. Provide it once with a Context and read it where it is needed.</p>',
        vi: '<p>Starter truyền <code>user</code> qua <code>Layout</code> → <code>Sidebar</code> → <code>UserInfo</code>, dù chỉ <code>UserInfo</code> dùng. Cung cấp nó một lần bằng Context và đọc ở đúng chỗ cần.</p>',
      },
      yeuCau: [
        { en: '<code>UserContext = createContext(null)</code>; App wraps <code>Layout</code> in <code>&lt;UserContext.Provider value={user}&gt;</code>.', vi: '<code>UserContext = createContext(null)</code>; App bọc <code>Layout</code> bằng <code>&lt;UserContext.Provider value={user}&gt;</code>.' },
        { en: '<code>Layout</code> and <code>Sidebar</code> take no <code>user</code> prop; <code>UserInfo</code> calls <code>useContext(UserContext)</code>. Output unchanged: <code>#user-info</code> "Lan · admin".', vi: '<code>Layout</code> và <code>Sidebar</code> không nhận prop <code>user</code>; <code>UserInfo</code> gọi <code>useContext(UserContext)</code>. Kết quả không đổi: <code>#user-info</code> "Lan · admin".' },
      ],
      viDu: [{ input: 'App → Layout → Sidebar → UserInfo', output: 'only App and UserInfo know about user', explanation: 'Middle components no longer pass data they do not use.|||Component ở giữa không phải chuyền dữ liệu chúng không dùng.' }],
      goiY: ["import { createContext, useContext } from 'react'; const UserContext = createContext(null);", 'function UserInfo() { const user = useContext(UserContext); … }'],
      loiHayGap: ['Gọi <code>useContext</code> ở component nằm NGOÀI Provider ⇒ nhận giá trị mặc định (null).', 'Quên <code>.Provider</code>: <code>&lt;UserContext value=…&gt;</code> chỉ hợp lệ ở React 19.'],
      thuatNgu: [{ en: 'prop drilling', vi: 'chuyền props qua nhiều tầng không dùng tới' }],
      giaiThich: '<p>Context như một "kênh phát": Provider phát giá trị, mọi component bên dưới (bất kể sâu bao nhiêu) bắt bằng <code>useContext</code>. Các tầng giữa không còn phải biết về <code>user</code>.</p>',
      dau: `// src/App.js — STARTER: prop drilling qua hai tầng không dùng tới user
function UserInfo({ user }) {
  return <p id="user-info">{user.name} · {user.role}</p>;
}
function Sidebar({ user }) {
  return <aside className="sidebar"><UserInfo user={user} /></aside>;
}
function Layout({ user }) {
  return <div className="layout"><Sidebar user={user} /><main>Content</main></div>;
}

export default function App() {
  const user = { name: 'Lan', role: 'admin' };
  return <Layout user={user} />;
}
`,
      giai: `// src/App.js — Provider phát user một lần; chỉ UserInfo đọc nó
import { createContext, useContext } from 'react';

const UserContext = createContext(null);

function UserInfo() {
  const user = useContext(UserContext);
  return <p id="user-info">{user.name} · {user.role}</p>;
}
function Sidebar() {
  return <aside className="sidebar"><UserInfo /></aside>;
}
function Layout() {
  return <div className="layout"><Sidebar /><main>Content</main></div>;
}

export default function App() {
  const user = { name: 'Lan', role: 'admin' };
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}
`,
      kiem: [
        { moTa: 'Output unchanged', kiem: 'text', selector: '#user-info', giaTri: 'Lan · admin' },
        { moTa: 'Uses createContext + useContext', kiem: 'ma-nguon', khop: 'createContext\\([\\s\\S]*useContext\\(' },
        { moTa: 'Middle components take no user prop', kiem: 'ma-nguon', khop: 'function\\s+(Sidebar|Layout)\\s*\\(\\s*\\{\\s*user', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Default value when there is no Provider',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['context default value', 'nearest provider'], the: ['context'],
      moTa: {
        en: '<p>A context\'s default value (the argument of <code>createContext</code>) is used only when there is NO matching Provider above. Show the same <code>Price</code> component twice: once outside any provider (default currency VND) and once inside a provider set to USD.</p>',
        vi: '<p>Giá trị mặc định của context (đối số của <code>createContext</code>) chỉ dùng khi KHÔNG có Provider nào phía trên. Hiển thị cùng component <code>Price</code> hai lần: một lần ngoài mọi provider (mặc định VND), một lần trong provider đặt USD.</p>',
      },
      yeuCau: [
        { en: '<code>CurrencyContext = createContext({ code: \'VND\', rate: 1 })</code>.', vi: '<code>CurrencyContext = createContext({ code: \'VND\', rate: 1 })</code>.' },
        { en: '<code>Price({ vnd })</code> shows <code>value code</code>: outside ⇒ <code>#price-a</code> "250000 VND"; inside a provider <code>{ code: \'USD\', rate: 1 / 25000 }</code> ⇒ <code>#price-b</code> "10.00 USD".', vi: '<code>Price({ vnd })</code> hiện <code>giá_trị mã</code>: ngoài ⇒ <code>#price-a</code> "250000 VND"; trong provider <code>{ code: \'USD\', rate: 1 / 25000 }</code> ⇒ <code>#price-b</code> "10.00 USD".' },
      ],
      viDu: [{ input: 'no Provider above', output: 'default value is used', explanation: 'The default is NOT applied when a Provider passes value={undefined}.|||Mặc định KHÔNG áp khi Provider truyền value={undefined}.' }],
      goiY: ["const { code, rate } = useContext(CurrencyContext); const amount = vnd * rate;", "code === 'VND' ? amount : amount.toFixed(2)"],
      loiHayGap: ['Nghĩ mặc định áp cả khi Provider có value undefined — không.', 'Đặt Provider ở App nên cả hai Price đều nhận USD.'],
      thuatNgu: [{ en: 'nearest provider', vi: 'Provider gần nhất phía trên' }],
      giaiThich: '<p><code>useContext</code> tìm Provider GẦN NHẤT phía trên; không có thì dùng giá trị mặc định. Nhờ vậy component vẫn chạy khi dùng riêng lẻ (ví dụ trong test).</p>',
      dau: `// src/App.js — STARTER
function Price({ vnd }) {
  return <span>{vnd} VND</span>;
}

export default function App() {
  return (
    <div>
      <p id="price-a"><Price vnd={250000} /></p>
      <p id="price-b"><Price vnd={250000} /></p>
    </div>
  );
}
`,
      giai: `// src/App.js — không có Provider phía trên ⇒ dùng giá trị mặc định của createContext
import { createContext, useContext } from 'react';

const CurrencyContext = createContext({ code: 'VND', rate: 1 });

function Price({ vnd }) {
  const { code, rate } = useContext(CurrencyContext);
  const amount = vnd * rate;
  return <span>{code === 'VND' ? amount : amount.toFixed(2)} {code}</span>;
}

export default function App() {
  return (
    <div>
      <p id="price-a"><Price vnd={250000} /></p>
      <CurrencyContext.Provider value={{ code: 'USD', rate: 1 / 25000 }}>
        <p id="price-b"><Price vnd={250000} /></p>
      </CurrencyContext.Provider>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Outside any provider ⇒ default VND', kiem: 'text', selector: '#price-a', giaTri: '250000 VND' },
        { moTa: 'Inside the USD provider', kiem: 'text', selector: '#price-b', giaTri: '10.00 USD' },
        { moTa: 'Default value passed to createContext', kiem: 'ma-nguon', khop: "createContext\\(\\s*\\{\\s*code:\\s*['\"]VND['\"]" },
      ],
    }),
    reactNho({
      tieuDe: 'Theme provider with a custom hook',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Provider with state', 'custom hook', 'useMemo value', 'error outside provider'], the: ['context', 'hooks'],
      moTa: {
        en: '<p>Exercise 14 style: a <code>ThemeProvider</code> that owns the state and a toggle, and a <code>useTheme()</code> hook that every component uses. Themed boxes read colours from the context — no props passed.</p>',
        vi: '<p>Kiểu Exercise 14: <code>ThemeProvider</code> giữ state và hàm đổi, hook <code>useTheme()</code> cho mọi component dùng. Các khung có màu đọc màu từ context — không truyền props.</p>',
      },
      yeuCau: [
        { en: '<code>THEMES = { light: { fg: \'#000000\', bg: \'#eeeeee\' }, dark: { fg: \'#ffffff\', bg: \'#222222\' } }</code>; provider value <code>{ name, colors, toggle }</code>.', vi: '<code>THEMES = { light: { fg: \'#000000\', bg: \'#eeeeee\' }, dark: { fg: \'#ffffff\', bg: \'#222222\' } }</code>; value của provider <code>{ name, colors, toggle }</code>.' },
        { en: '<code>#toggle</code> switches; <code>.box</code> elements use inline <code>color</code>/<code>background</code> from the theme; <code>#theme-name</code> shows the name; <code>useTheme</code> throws outside the provider.', vi: '<code>#toggle</code> đổi theme; các <code>.box</code> dùng <code>color</code>/<code>background</code> inline từ theme; <code>#theme-name</code> hiện tên; <code>useTheme</code> báo lỗi khi ngoài provider.' },
      ],
      viDu: [{ input: 'click toggle', output: 'boxes become white on #222', explanation: 'Every consumer re-renders with the new value.|||Mọi nơi dùng đều vẽ lại với giá trị mới.' }],
      goiY: ['const value = useMemo(() => ({ name, colors: THEMES[name], toggle: () => setName(n => (n === "light" ? "dark" : "light")) }), [name]);', 'export function useTheme() { const ctx = useContext(ThemeContext); if (!ctx) throw new Error("useTheme must be used inside ThemeProvider"); return ctx; }'],
      loiHayGap: ['Đặt state theme trong component con ⇒ chỉ con đó đổi màu.', 'Không memo value ⇒ object mới mỗi lần provider render.'],
      thuatNgu: [{ en: 'custom hook', vi: 'hàm use… tự viết gom logic dùng lại' }],
      giaiThich: '<p>Provider giữ state và phát cả giá trị lẫn hàm đổi. Custom hook giấu chi tiết <code>useContext</code> + kiểm thiếu Provider, nên component chỉ viết <code>const { colors, toggle } = useTheme()</code>.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function Box({ text }) {
  return <div className="box">{text}</div>;
}

export default function App() {
  const [name, setName] = useState('light');
  return (
    <div>
      <button id="toggle" onClick={() => setName(name === 'light' ? 'dark' : 'light')}>Toggle</button>
      <p id="theme-name">{name}</p>
      <Box text="Header" />
      <Box text="Body" />
    </div>
  );
}
`,
      giai: `// src/App.js — Provider giữ state + toggle; useTheme() là cửa duy nhất để đọc
import { createContext, useContext, useMemo, useState } from 'react';

const THEMES = {
  light: { fg: '#000000', bg: '#eeeeee' },
  dark: { fg: '#ffffff', bg: '#222222' },
};
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [name, setName] = useState('light');
  const value = useMemo(
    () => ({ name, colors: THEMES[name], toggle: () => setName((n) => (n === 'light' ? 'dark' : 'light')) }),
    [name],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

function Box({ text }) {
  const { colors } = useTheme();
  return <div className="box" style={{ color: colors.fg, background: colors.bg, padding: 8 }}>{text}</div>;
}

function Toolbar() {
  const { name, toggle } = useTheme();
  return (
    <div>
      <button id="toggle" type="button" onClick={toggle}>Toggle</button>
      <p id="theme-name">{name}</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toolbar />
      <Box text="Header" />
      <Box text="Body" />
    </ThemeProvider>
  );
}
`,
      kiem: [
        { moTa: 'Light colours at start', kiem: 'css', selector: '.box', thuocTinh: 'background-color', giaTri: 'rgb(238, 238, 238)' },
        { moTa: 'Toggle switches every box to dark', kiem: 'css', selector: '.box', thuocTinh: 'color', giaTri: 'rgb(255, 255, 255)', truoc: [click('#toggle')] },
        { moTa: '#theme-name follows', kiem: 'text', selector: '#theme-name', giaTri: 'dark', truoc: [click('#toggle')] },
        { an: true, moTa: 'useTheme guards against a missing provider', kiem: 'ma-nguon', khop: 'function\\s+useTheme[\\s\\S]*throw new Error' },
        { an: true, moTa: 'Provider value is memoized', kiem: 'ma-nguon', khop: 'useMemo\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'Nested providers: automatic heading levels',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['nested providers', 'reading and re-providing', 'dynamic tag'], the: ['context'],
      moTa: {
        en: '<p>Each <code>Section</code> reads the current level from <code>LevelContext</code> and provides <code>level + 1</code> to its children. <code>Heading</code> renders <code>h1</code>…<code>h6</code> from the level — so headings are never "jumped" by hand.</p>',
        vi: '<p>Mỗi <code>Section</code> đọc cấp hiện tại từ <code>LevelContext</code> và cung cấp <code>level + 1</code> cho con. <code>Heading</code> vẽ <code>h1</code>…<code>h6</code> theo cấp — không bao giờ phải tự chọn cấp tiêu đề.</p>',
      },
      yeuCau: [
        { en: '<code>LevelContext = createContext(0)</code>; <code>Section</code> wraps children in <code>&lt;section&gt;</code> and a provider with <code>level + 1</code>.', vi: '<code>LevelContext = createContext(0)</code>; <code>Section</code> bọc children trong <code>&lt;section&gt;</code> và provider với <code>level + 1</code>.' },
        { en: '<code>Heading</code> renders <code>h{level}</code> (max 6). The given App nests three levels.', vi: '<code>Heading</code> vẽ <code>h{level}</code> (tối đa 6). App đã cho lồng ba cấp.' },
      ],
      viDu: [{ input: '<Section><Heading>A</Heading><Section><Heading>B</Heading></Section></Section>', output: '<h1>A</h1> … <h2>B</h2>', explanation: 'Inner providers override outer ones.|||Provider bên trong ghi đè provider bên ngoài.' }],
      goiY: ['function Section({ children }) { const level = useContext(LevelContext); return <section><LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider></section>; }', "function Heading({ children }) { const Tag = 'h' + Math.min(useContext(LevelContext), 6); return <Tag>{children}</Tag>; }"],
      loiHayGap: ['Truyền <code>level</code> qua props ở mọi Section ⇒ dễ sai khi chuyển đoạn văn sang chỗ khác.', 'Tên biến thẻ viết thường (<code>const tag = \'h2\'; &lt;tag&gt;</code>) ⇒ React coi là thẻ "tag".'],
      thuatNgu: [{ en: 'override', vi: 'ghi đè' }],
      giaiThich: '<p>Một component vừa đọc context vừa cung cấp giá trị mới cho cây con của nó. Đây là ví dụ kinh điển trong tài liệu React: cấu trúc lồng tự sinh cấp tiêu đề đúng.</p>',
      dau: `// src/App.js — STARTER
function Section({ children }) {
  return <section>{children}</section>;
}
function Heading({ children }) {
  return <h1>{children}</h1>;
}

export default function App() {
  return (
    <Section>
      <Heading>Front-end</Heading>
      <Section>
        <Heading>React</Heading>
        <Section>
          <Heading>Hooks</Heading>
          <Heading>Context</Heading>
        </Section>
      </Section>
      <Section>
        <Heading>Tools</Heading>
      </Section>
    </Section>
  );
}
`,
      giai: `// src/App.js — Section đọc cấp hiện tại rồi cung cấp cấp + 1 cho cây con
import { createContext, useContext } from 'react';

const LevelContext = createContext(0);

function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section>
      <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
    </section>
  );
}

function Heading({ children }) {
  const level = Math.min(Math.max(useContext(LevelContext), 1), 6);
  const Tag = ´h@{level}´; // tên biến VIẾT HOA để JSX hiểu là thẻ động
  return <Tag>{children}</Tag>;
}

export default function App() {
  return (
    <Section>
      <Heading>Front-end</Heading>
      <Section>
        <Heading>React</Heading>
        <Section>
          <Heading>Hooks</Heading>
          <Heading>Context</Heading>
        </Section>
      </Section>
      <Section>
        <Heading>Tools</Heading>
      </Section>
    </Section>
  );
}
`,
      kiem: [
        { moTa: 'Levels follow nesting', kiem: 'danh-sach-text', selector: 'h1, h2, h3', mongDoi: ['Front-end', 'React', 'Hooks', 'Context', 'Tools'] },
        { moTa: 'Exactly one h1', kiem: 'so-luong', selector: 'h1', giaTri: 1 },
        { moTa: 'Hooks and Context are h3', kiem: 'danh-sach-text', selector: 'h3', mongDoi: ['Hooks', 'Context'] },
        { an: true, moTa: 'Tools is h2', kiem: 'danh-sach-text', selector: 'h2', mongDoi: ['React', 'Tools'] },
      ],
    }),
    reactNho({
      tieuDe: 'Shared cart context between siblings',
      doKho: 'HARD', phut: 18,
      khaiNiem: ['context with actions', 'siblings sharing state', 'derived totals', 'memoized value'], the: ['context', 'state'],
      moTa: {
        en: '<p><code>ProductList</code> and <code>CartSummary</code> are siblings — neither is the parent of the other. Put the cart in a <code>CartProvider</code> that exposes <code>items</code>, <code>add(product)</code>, <code>remove(id)</code> and the derived <code>count</code>/<code>total</code>.</p>',
        vi: '<p><code>ProductList</code> và <code>CartSummary</code> là anh em — không cái nào là cha của cái kia. Đặt giỏ hàng trong <code>CartProvider</code>, cung cấp <code>items</code>, <code>add(product)</code>, <code>remove(id)</code> và <code>count</code>/<code>total</code> suy ra.</p>',
      },
      yeuCau: [
        { en: '<code>.add</code> buttons in <code>#products</code>; adding the same product again increases its quantity.', vi: 'Nút <code>.add</code> trong <code>#products</code>; thêm lại cùng sản phẩm thì tăng số lượng.' },
        { en: '<code>#cart</code> lists <code>li.line</code> "Pen × 2"; each has <code>.remove</code> (removes one unit); <code>#cart-total</code> "3 items · 35,000 VND".', vi: '<code>#cart</code> liệt kê <code>li.line</code> "Pen × 2"; mỗi dòng có <code>.remove</code> (bớt một cái); <code>#cart-total</code> "3 items · 35,000 VND".' },
      ],
      viDu: [{ input: 'add Pen, Pen, Notebook', output: 'Pen × 2 · Notebook × 1 · 3 items · 35,000 VND', explanation: 'Pen 5,000 · Notebook 25,000.|||Pen 5,000 · Notebook 25,000.' }],
      goiY: ['add: setItems(list => list.some(i => i.id === p.id) ? list.map(…qty + 1) : [...list, { ...p, qty: 1 }]).', 'remove: map qty − 1 rồi filter qty > 0.'],
      loiHayGap: ['Giữ giỏ trong ProductList ⇒ CartSummary (anh em) không đọc được.', 'Lưu count/total trong state ⇒ phải nhớ cập nhật ở cả add lẫn remove.'],
      thuatNgu: [{ en: 'siblings', vi: 'component anh em (cùng cha)' }],
      giaiThich: '<p>Khi hai nhánh xa nhau cần cùng dữ liệu, Context (hoặc nâng state lên cha chung) là lời giải. Provider phát cả dữ liệu lẫn hành động; tổng/số lượng tính từ <code>items</code> trong <code>useMemo</code>.</p>',
      dau: `// src/App.js — STARTER
const PRODUCTS = [
  { id: 1, name: 'Pen', price: 5000 },
  { id: 2, name: 'Notebook', price: 25000 },
  { id: 3, name: 'Ruler', price: 8000 },
];

function ProductList() {
  return <ul id="products">{PRODUCTS.map((p) => <li key={p.id}>{p.name} <button className="add">Add</button></li>)}</ul>;
}
function CartSummary() {
  return <div id="cart"><p id="cart-total">0 items · 0 VND</p></div>;
}

export default function App() {
  return (
    <div>
      <ProductList />
      <CartSummary />
    </div>
  );
}
`,
      giai: `// src/App.js — CartProvider ở cha chung; hai component anh em đọc cùng một giỏ qua useCart()
import { createContext, useContext, useMemo, useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Pen', price: 5000 },
  { id: 2, name: 'Notebook', price: 25000 },
  { id: 3, name: 'Ruler', price: 8000 },
];
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const value = useMemo(() => {
    const add = (p) =>
      setItems((list) => (list.some((i) => i.id === p.id)
        ? list.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...list, { ...p, qty: 1 }]));
    const remove = (id) =>
      setItems((list) => list.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0));
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, add, remove, count, total };
  }, [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const useCart = () => useContext(CartContext);

function ProductList() {
  const { add } = useCart();
  return (
    <ul id="products">
      {PRODUCTS.map((p) => (
        <li key={p.id}>{p.name} <button type="button" className="add" onClick={() => add(p)}>Add</button></li>
      ))}
    </ul>
  );
}

function CartSummary() {
  const { items, remove, count, total } = useCart();
  return (
    <div id="cart">
      <ul>
        {items.map((i) => (
          <li key={i.id} className="line">
            <span className="line-text">{i.name} × {i.qty}</span>
            <button type="button" className="remove" onClick={() => remove(i.id)}>−</button>
          </li>
        ))}
      </ul>
      <p id="cart-total">{count} items · {total.toLocaleString('en-US')} VND</p>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ProductList />
      <CartSummary />
    </CartProvider>
  );
}
`,
      kiem: [
        { moTa: 'Adding the same product increases quantity', kiem: 'danh-sach-text', selector: '.line-text', mongDoi: ['Pen × 2', 'Notebook × 1'], truoc: [click('#products li:nth-child(1) .add', 2), click('#products li:nth-child(2) .add')] },
        { moTa: 'Totals are derived', kiem: 'text', selector: '#cart-total', giaTri: '3 items · 35,000 VND', truoc: [click('#products li:nth-child(1) .add', 2), click('#products li:nth-child(2) .add')] },
        { moTa: 'Remove takes one unit away', kiem: 'danh-sach-text', selector: '.line-text', mongDoi: ['Pen × 1'], truoc: [click('#products li:nth-child(1) .add', 2), click('.line .remove')] },
        { an: true, moTa: 'Last unit removed ⇒ line disappears', kiem: 'so-luong', selector: '.line', giaTri: 0, truoc: [click('#products li:nth-child(3) .add'), click('.line .remove')] },
        { an: true, moTa: 'Context used by both siblings', kiem: 'ma-nguon', khop: 'function ProductList[\\s\\S]*useCart\\(\\)[\\s\\S]*function CartSummary[\\s\\S]*useCart\\(\\)' },
      ],
    }),
  ],
});
