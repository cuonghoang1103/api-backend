/**
 * FER202 · Exercise 14 — useContext (handout: ThemeProvider + useTheme; CartContext: danh sách món, xoá, tổng, làm rỗng).
 * Thêm: context ngôn ngữ (i18n) và context thông báo (toast) — hai mẫu context hay gặp ngoài đời.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms) => ({ hanhDong: 'cho', ms });

export default doiDau({
  slug: 'fer202-8-ex14-usecontext',
  ten: 'Exercise 14 — useContext',
  khoa: KHOA,
  baiHoc: 'fer202-8-ex14-usecontext',
  de: [
    reactNho({
      tieuDe: 'ThemeProvider and useTheme (light/dark)',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['createContext', 'Provider', 'custom hook', 'nearest provider'], the: ['hooks', 'useContext', 'exercise-14'],
      moTa: {
        en: '<p>Handout task 1. <code>ThemeProvider</code> stores <code>"light"</code> or <code>"dark"</code> and a <code>toggleTheme</code> function; <code>useTheme()</code> reads them. The page wrapper, a deeply nested <code>Card</code> and the toggle button all read the same theme — no props passed down.</p>',
        vi: '<p>Bài 1 của handout. <code>ThemeProvider</code> giữ <code>"light"</code> hoặc <code>"dark"</code> và hàm <code>toggleTheme</code>; <code>useTheme()</code> đọc chúng. Khung trang, một <code>Card</code> nằm sâu và nút đổi đều đọc cùng theme — không truyền props xuống.</p>',
      },
      yeuCau: [
        { en: 'Wrapper <code>#app</code> has class <code>light</code> or <code>dark</code>; <code>#btn-theme</code> reads <code>Switch to dark</code> / <code>Switch to light</code>.', vi: 'Khung <code>#app</code> có class <code>light</code> hoặc <code>dark</code>; <code>#btn-theme</code> ghi <code>Switch to dark</code> / <code>Switch to light</code>.' },
        { en: '<code>Layout → Sidebar → Card</code>: <code>.card-theme</code> shows <code>Current theme: dark</code>. A second <code>ThemeProvider initial="dark"</code> wraps <code>#preview</code>, whose card is always dark (nearest provider).', vi: '<code>Layout → Sidebar → Card</code>: <code>.card-theme</code> hiện <code>Current theme: dark</code>. Một <code>ThemeProvider initial="dark"</code> thứ hai bọc <code>#preview</code>, card trong đó luôn tối (provider gần nhất).' },
      ],
      viDu: [{ input: 'click Switch to dark', output: '#app.dark · Current theme: dark', explanation: 'All consumers of the outer provider update.|||Mọi nơi dùng provider ngoài đều cập nhật.' }],
      goiY: ['const ThemeContext = createContext(null); function ThemeProvider({ initial = "light", children }) { const [theme, setTheme] = useState(initial); … }', 'useTheme: const ctx = useContext(ThemeContext); if (!ctx) throw new Error(…); return ctx;'],
      loiHayGap: ['Truyền theme qua props Layout → Sidebar → Card (prop drilling) — đúng là điều Context giải quyết.', 'Dùng class <code>dark</code> của Tailwind/Bootstrap mà không có CSS ⇒ không thấy đổi; ở đây chỉ cần class đúng.'],
      thuatNgu: [{ en: 'consumer', vi: 'component đọc context' }],
      giaiThich: '<p>useContext tìm Provider GẦN NHẤT phía trên. Provider lồng nhau cho phép một vùng (bản xem trước) dùng theme riêng mà không ảnh hưởng phần còn lại.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function Card({ theme }) {
  return <div className="card-theme">Current theme: {theme}</div>;
}
function Sidebar({ theme }) { return <aside><Card theme={theme} /></aside>; }
function Layout({ theme }) { return <main><Sidebar theme={theme} /></main>; }

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div id="app">
      <button id="btn-theme" onClick={() => setTheme('dark')}>Switch</button>
      <Layout theme={theme} />
    </div>
  );
}
`,
      giai: `// src/App.js — ThemeProvider + useTheme; provider lồng cho vùng xem trước
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

function ThemeProvider({ initial = 'light', children }) {
  const [theme, setTheme] = useState(initial);
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

function Card() {
  const { theme } = useTheme();
  return <div className={´card-theme @{theme}´}>Current theme: {theme}</div>;
}
function Sidebar() { return <aside><Card /></aside>; }
function Layout() { return <main><Sidebar /></main>; }

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button id="btn-theme" type="button" onClick={toggleTheme}>
      {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
    </button>
  );
}

function Shell() {
  const { theme } = useTheme();
  return (
    <div id="app" className={theme}>
      <ThemeButton />
      <Layout />
      <section id="preview">
        <ThemeProvider initial="dark">
          <Card />
        </ThemeProvider>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
`,
      kiem: [
        { moTa: 'Light by default', kiem: 'ton-tai', selector: '#app.light' },
        { moTa: 'Toggle switches wrapper and label', kiem: 'danh-sach-text', selector: '#btn-theme, main .card-theme', mongDoi: ['Switch to light', 'Current theme: dark'], truoc: [click('#btn-theme')] },
        { moTa: 'Wrapper class becomes dark', kiem: 'ton-tai', selector: '#app.dark', truoc: [click('#btn-theme')] },
        { an: true, moTa: 'Preview uses the nearest provider', kiem: 'text', selector: '#preview .card-theme', giaTri: 'Current theme: dark', truoc: [click('#btn-theme', 2)] },
        { an: true, moTa: 'No theme prop drilling', kiem: 'ma-nguon', khop: '<(Layout|Sidebar|Card)\\s+theme=', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Cart with CartContext (handout tasks 2–3)',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['context with state + actions', 'derived total', 'conditional rendering'], the: ['hooks', 'useContext', 'exercise-14'],
      moTa: {
        en: '<p>Handout tasks 2–3: a list of dishes and a cart in different components, sharing <code>CartContext</code> (state with <code>useState</code>, actions <code>addToCart</code>, <code>removeFromCart</code>, <code>clearCart</code>). Each click adds one cart line — the same dish can appear twice.</p>',
        vi: '<p>Bài 2–3 của handout: danh sách món và giỏ hàng ở hai component khác nhau, dùng chung <code>CartContext</code> (state bằng <code>useState</code>, hành động <code>addToCart</code>, <code>removeFromCart</code>, <code>clearCart</code>). Mỗi lần bấm thêm một dòng — cùng món có thể xuất hiện hai lần.</p>',
      },
      yeuCau: [
        { en: 'Dishes: <code>Uthappizza 4.99</code>, <code>Zucchipakoda 1.99</code>, <code>Vadonut 1.99</code>, <code>ElaiCheese Cake 2.99</code>; buttons <code>.btn-add</code> in that order.', vi: 'Món: <code>Uthappizza 4.99</code>, <code>Zucchipakoda 1.99</code>, <code>Vadonut 1.99</code>, <code>ElaiCheese Cake 2.99</code>; nút <code>.btn-add</code> theo thứ tự đó.' },
        { en: 'Cart lines <code>li.cart-item</code> (<code>.name</code> + <code>.btn-remove</code>); <code>#cart-total</code> <code>Total: $6.98</code> (2 decimals); <code>#btn-clear</code>; empty ⇒ <code>#cart-empty</code> <code>Your cart is empty</code>; <code>#cart-count</code> in the header = number of lines.', vi: 'Dòng giỏ <code>li.cart-item</code> (<code>.name</code> + <code>.btn-remove</code>); <code>#cart-total</code> <code>Total: $6.98</code> (2 chữ số thập phân); <code>#btn-clear</code>; rỗng ⇒ <code>#cart-empty</code> <code>Your cart is empty</code>; <code>#cart-count</code> ở header = số dòng.' },
      ],
      viDu: [{ input: 'add Uthappizza, Zucchipakoda', output: 'Total: $6.98', explanation: '(4.99 + 1.99).toFixed(2)|||(4.99 + 1.99).toFixed(2)' }],
      goiY: ['addToCart: setItems((c) => [...c, { ...dish, cartId: Date.now() + Math.random() }])', 'Tổng: items.reduce((s, d) => s + d.price, 0).toFixed(2)'],
      loiHayGap: ['Xoá theo <code>id</code> của món ⇒ xoá mất cả hai dòng cùng món; cần mã dòng riêng (cartId).', 'Cộng số thực rồi in thẳng ⇒ 6.9799999…; dùng toFixed(2).'],
      thuatNgu: [{ en: 'cart line', vi: 'một dòng trong giỏ' }],
      giaiThich: '<p>Context cung cấp cả DỮ LIỆU lẫn HÀNH ĐỘNG; component chỉ gọi <code>addToCart(dish)</code> mà không cần biết state nằm đâu. Tổng tiền và số dòng là dữ liệu suy ra.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const DISHES = [
  { id: 0, name: 'Uthappizza', price: 4.99 },
  { id: 1, name: 'Zucchipakoda', price: 1.99 },
  { id: 2, name: 'Vadonut', price: 1.99 },
  { id: 3, name: 'ElaiCheese Cake', price: 2.99 },
];

function DishesList() {
  return <div>{DISHES.map((d) => <button key={d.id} className="btn-add">{d.name}</button>)}</div>;
}

function Cart() {
  return <p id="cart-empty">Your cart is empty</p>;
}

export default function App() {
  return (<div><DishesList /><Cart /></div>);
}
`,
      giai: `// src/App.js — CartContext giữ state + hành động; hai component dùng chung
import { createContext, useContext, useState } from 'react';

const DISHES = [
  { id: 0, name: 'Uthappizza', price: 4.99 },
  { id: 1, name: 'Zucchipakoda', price: 1.99 },
  { id: 2, name: 'Vadonut', price: 1.99 },
  { id: 3, name: 'ElaiCheese Cake', price: 2.99 },
];

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addToCart = (dish) => setItems((c) => [...c, { ...dish, cartId: Date.now() + Math.random() }]);
  const removeFromCart = (cartId) => setItems((c) => c.filter((d) => d.cartId !== cartId));
  const clearCart = () => setItems([]);
  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => useContext(CartContext);

function Header() {
  const { items } = useCart();
  return <header>Cart (<span id="cart-count">{items.length}</span>)</header>;
}

function DishesList() {
  const { addToCart } = useCart();
  return (
    <div>
      {DISHES.map((d) => (
        <div key={d.id}>
          <span>{d.name} — \${d.price}</span>
          <button type="button" className="btn-add" onClick={() => addToCart(d)}>Add to cart</button>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  if (items.length === 0) return <p id="cart-empty">Your cart is empty</p>;
  const total = items.reduce((s, d) => s + d.price, 0);
  return (
    <div>
      <ul>
        {items.map((d) => (
          <li key={d.cartId} className="cart-item">
            <span className="name">{d.name}</span>
            <button type="button" className="btn-remove" onClick={() => removeFromCart(d.cartId)}>Remove</button>
          </li>
        ))}
      </ul>
      <p id="cart-total">Total: \${total.toFixed(2)}</p>
      <button id="btn-clear" type="button" onClick={clearCart}>Clear cart</button>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <DishesList />
      <Cart />
    </CartProvider>
  );
}
`,
      kiem: [
        { moTa: 'Total with two decimals', kiem: 'text', selector: '#cart-total', giaTri: 'Total: $6.98', truoc: [click('div:nth-child(1) > .btn-add'), click('div:nth-child(2) > .btn-add')] },
        { moTa: 'Same dish twice = two lines', kiem: 'danh-sach-text', selector: 'li.cart-item .name', mongDoi: ['Vadonut', 'Vadonut'], truoc: [click('div:nth-child(3) > .btn-add', 2)] },
        { moTa: 'Header count follows', kiem: 'text', selector: '#cart-count', giaTri: '3', truoc: [click('div:nth-child(4) > .btn-add', 3)] },
        { moTa: 'Empty message at start', kiem: 'text', selector: '#cart-empty', giaTri: 'Your cart is empty' },
        { an: true, moTa: 'Remove deletes only that line', kiem: 'so-luong', selector: 'li.cart-item', giaTri: 1, truoc: [click('div:nth-child(3) > .btn-add', 2), click('li.cart-item:nth-child(1) .btn-remove')] },
        { an: true, moTa: 'Clear empties the cart', kiem: 'danh-sach-text', selector: '#cart-count, #cart-empty', mongDoi: ['0', 'Your cart is empty'], truoc: [click('div:nth-child(1) > .btn-add', 2), click('#btn-clear')] },
        { an: true, moTa: 'Uses a CartContext Provider', kiem: 'ma-nguon', khop: 'CartContext\\.Provider' },
      ],
    }),
    reactNho({
      tieuDe: 'Language context: a tiny i18n',
      doKho: 'MEDIUM', phut: 14,
      khaiNiem: ['context value as function', 'dictionary lookup', 'fallback'], the: ['hooks', 'useContext', 'exercise-14'],
      moTa: {
        en: '<p>Make the page bilingual. <code>LanguageProvider</code> keeps <code>lang</code> (<code>en</code>/<code>vi</code>) and provides <code>t(key)</code> that looks up a dictionary; unknown keys fall back to English, then to the key itself. The choice survives a reload (localStorage <code>lang</code>).</p>',
        vi: '<p>Làm trang song ngữ. <code>LanguageProvider</code> giữ <code>lang</code> (<code>en</code>/<code>vi</code>) và cung cấp <code>t(key)</code> tra từ điển; khoá không có thì lùi về tiếng Anh, rồi về chính khoá. Lựa chọn còn sau khi tải lại (localStorage <code>lang</code>).</p>',
      },
      yeuCau: [
        { en: 'Dictionary: <code>title</code> (Course list / Danh sách khoá học), <code>enroll</code> (Enroll / Đăng ký), <code>greeting</code> (Welcome back! / Chào mừng trở lại!), <code>footer</code> (en only: © CuongThai.com).', vi: 'Từ điển: <code>title</code> (Course list / Danh sách khoá học), <code>enroll</code> (Enroll / Đăng ký), <code>greeting</code> (Welcome back! / Chào mừng trở lại!), <code>footer</code> (chỉ có en: © CuongThai.com).' },
        { en: 'Elements <code>#title</code>, <code>#greeting</code>, <code>.btn-enroll</code> (×2), <code>#footer</code>, <code>#missing</code> (key <code>not.translated</code>); buttons <code>#lang-en</code>, <code>#lang-vi</code>.', vi: 'Phần tử <code>#title</code>, <code>#greeting</code>, <code>.btn-enroll</code> (×2), <code>#footer</code>, <code>#missing</code> (khoá <code>not.translated</code>); nút <code>#lang-en</code>, <code>#lang-vi</code>.' },
      ],
      viDu: [{ input: 'click VI', output: 'Danh sách khoá học · footer stays "© CuongThai.com"', explanation: 'Fallback chain: vi → en → key.|||Chuỗi lùi: vi → en → khoá.' }],
      goiY: ['const t = (key) => DICT[lang][key] ?? DICT.en[key] ?? key;', 'Khởi tạo lười: useState(() => localStorage.getItem("lang") || "en"); ghi lại trong useEffect.'],
      loiHayGap: ['Dùng <code>||</code> thay <code>??</code> ⇒ bản dịch chuỗi rỗng bị coi là thiếu (ở đây không sao, nhưng nên biết).', 'Mỗi component tự đọc localStorage ⇒ không đồng bộ khi đổi ngôn ngữ.'],
      thuatNgu: [{ en: 'i18n', vi: 'quốc tế hoá (internationalization: 18 chữ giữa i và n)' }, { en: 'fallback', vi: 'giá trị dự phòng' }],
      giaiThich: '<p>Giá trị context có thể là HÀM (<code>t</code>). Khi <code>lang</code> đổi, provider tạo hàm t mới ⇒ mọi nơi gọi t vẽ lại với ngôn ngữ mới.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  return (
    <div>
      <h1 id="title">Course list</h1>
      <p id="greeting">Welcome back!</p>
      <button className="btn-enroll">Enroll</button>
      <button className="btn-enroll">Enroll</button>
      <button id="lang-en">EN</button>
      <button id="lang-vi">VI</button>
      <p id="missing">not.translated</p>
      <footer id="footer">© CuongThai.com</footer>
    </div>
  );
}
`,
      giai: `// src/App.js — LanguageProvider cung cấp lang + t(key) có chuỗi lùi vi → en → key
import { createContext, useContext, useEffect, useState } from 'react';

const DICT = {
  en: { title: 'Course list', enroll: 'Enroll', greeting: 'Welcome back!', footer: '© CuongThai.com' },
  vi: { title: 'Danh sách khoá học', enroll: 'Đăng ký', greeting: 'Chào mừng trở lại!' },
};

const LanguageContext = createContext(null);

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (localStorage.getItem('lang') === 'vi' ? 'vi' : 'en'));
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);
  const t = (key) => DICT[lang][key] ?? DICT.en[key] ?? key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

const useLang = () => useContext(LanguageContext);

function CourseCard({ name }) {
  const { t } = useLang();
  return (
    <div>
      <span>{name}</span> <button type="button" className="btn-enroll">{t('enroll')}</button>
    </div>
  );
}

function Page() {
  const { t, setLang } = useLang();
  return (
    <div>
      <button id="lang-en" type="button" onClick={() => setLang('en')}>EN</button>
      <button id="lang-vi" type="button" onClick={() => setLang('vi')}>VI</button>
      <h1 id="title">{t('title')}</h1>
      <p id="greeting">{t('greeting')}</p>
      <CourseCard name="FER202" />
      <CourseCard name="SWT301" />
      <p id="missing">{t('not.translated')}</p>
      <footer id="footer">{t('footer')}</footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  );
}
`,
      kiem: [
        { moTa: 'Vietnamese texts', kiem: 'danh-sach-text', selector: '#title, #greeting, .btn-enroll', mongDoi: ['Danh sách khoá học', 'Chào mừng trở lại!', 'Đăng ký', 'Đăng ký'], truoc: [click('#lang-vi')] },
        { moTa: 'Falls back to English', kiem: 'text', selector: '#footer', giaTri: '© CuongThai.com', truoc: [click('#lang-vi')] },
        { moTa: 'Falls back to the key', kiem: 'text', selector: '#missing', giaTri: 'not.translated', truoc: [click('#lang-vi')] },
        { moTa: 'Back to English', kiem: 'text', selector: '#title', giaTri: 'Course list', truoc: [click('#lang-vi'), click('#lang-en')] },
        { an: true, moTa: 'Choice survives a reload', kiem: 'text', selector: '#greeting', giaTri: 'Chào mừng trở lại!', truoc: [click('#lang-vi'), { hanhDong: 'tai-lai' }] },
        { an: true, moTa: 'Uses a Provider', kiem: 'ma-nguon', khop: 'createContext\\([\\s\\S]*\\.Provider' },
      ],
    }),
    reactNho({
      tieuDe: 'Toast notifications through context',
      doKho: 'HARD', phut: 18,
      khaiNiem: ['context for actions', 'auto-dismiss with effect', 'list of timers'], the: ['hooks', 'useContext', 'useEffect'],
      moTa: {
        en: '<p>Any component should be able to call <code>showToast(message, type)</code> without knowing where toasts are drawn. <code>ToastProvider</code> renders a <code>#toasts</code> stack after its children; each toast disappears after <b>1500 ms</b> or when its × is clicked. Several toasts can be on screen at once.</p>',
        vi: '<p>Component nào cũng gọi được <code>showToast(message, type)</code> mà không cần biết toast vẽ ở đâu. <code>ToastProvider</code> vẽ chồng <code>#toasts</code> sau children; mỗi toast tự biến mất sau <b>1500 ms</b> hoặc khi bấm ×. Có thể nhiều toast cùng lúc.</p>',
      },
      yeuCau: [
        { en: 'Toast element <code>.toast.toast-success</code> / <code>.toast-error</code>, text in <code>.toast-text</code>, close button <code>.toast-close</code>.', vi: 'Phần tử toast <code>.toast.toast-success</code> / <code>.toast-error</code>, chữ trong <code>.toast-text</code>, nút đóng <code>.toast-close</code>.' },
        { en: 'Buttons in nested components: <code>#btn-save</code> ⇒ success <code>Saved!</code>; <code>#btn-fail</code> ⇒ error <code>Something went wrong</code>.', vi: 'Nút trong component lồng nhau: <code>#btn-save</code> ⇒ success <code>Saved!</code>; <code>#btn-fail</code> ⇒ error <code>Something went wrong</code>.' },
      ],
      viDu: [{ input: 'Save, Fail', output: 'two toasts; both gone after ~1.5 s', explanation: 'Each toast owns its own timer (cleared on unmount).|||Mỗi toast có hẹn giờ riêng (xoá khi unmount).' }],
      goiY: ['showToast = (message, type = "success") => setToasts((t) => [...t, { id: Date.now() + Math.random(), message, type }])', 'Component Toast: useEffect(() => { const id = setTimeout(() => onClose(toast.id), 1500); return () => clearTimeout(id); }, []);'],
      loiHayGap: ['Một setTimeout chung xoá "toast cuối" ⇒ xoá nhầm khi có nhiều toast.', 'Không clearTimeout khi đóng tay ⇒ hẹn giờ gọi setState trên toast đã mất.'],
      thuatNgu: [{ en: 'toast', vi: 'thông báo nhỏ hiện tạm rồi tự tắt' }],
      giaiThich: '<p>Context ở đây chủ yếu chuyển HÀNH ĐỘNG (showToast). Đặt effect hẹn giờ trong từng component Toast: mỗi toast tự quản thời gian sống, unmount thì cleanup huỷ hẹn giờ.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function SaveButton() {
  return <button id="btn-save" onClick={() => alert('Saved!')}>Save</button>;
}
function Toolbar() { return <div><SaveButton /><button id="btn-fail">Fail</button></div>; }

export default function App() {
  const [toasts] = useState([]);
  return (
    <div>
      <Toolbar />
      <div id="toasts">{toasts.map((t) => <div key={t.id} className="toast">{t.message}</div>)}</div>
    </div>
  );
}
`,
      giai: `// src/App.js — ToastProvider: showToast qua context, mỗi toast tự hẹn giờ biến mất
import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(null);

function Toast({ toast, onClose }) {
  useEffect(() => {
    const id = setTimeout(() => onClose(toast.id), 1500);
    return () => clearTimeout(id); // đóng tay / unmount ⇒ huỷ hẹn giờ
  }, [toast.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={´toast toast-@{toast.type}´}>
      <span className="toast-text">{toast.message}</span>
      <button type="button" className="toast-close" onClick={() => onClose(toast.id)}>×</button>
    </div>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') =>
    setToasts((t) => [...t, { id: Date.now() + Math.random(), message, type }]);
  const close = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toasts">
        {toasts.map((t) => <Toast key={t.id} toast={t} onClose={close} />)}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx.showToast;
}

function SaveButton() {
  const showToast = useToast();
  return <button id="btn-save" type="button" onClick={() => showToast('Saved!')}>Save</button>;
}

function Toolbar() {
  const showToast = useToast();
  return (
    <div>
      <SaveButton />
      <button id="btn-fail" type="button" onClick={() => showToast('Something went wrong', 'error')}>Fail</button>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Toolbar />
    </ToastProvider>
  );
}
`,
      kiem: [
        { moTa: 'Two toasts with types', kiem: 'danh-sach-text', selector: '.toast-success .toast-text, .toast-error .toast-text', mongDoi: ['Saved!', 'Something went wrong'], truoc: [click('#btn-save'), click('#btn-fail')] },
        { moTa: 'Auto-dismiss after 1.5 s', kiem: 'khong-ton-tai', selector: '.toast', truoc: [click('#btn-save'), cho(1900)] },
        { moTa: 'Close button removes only that toast', kiem: 'danh-sach-text', selector: '.toast-text', mongDoi: ['Something went wrong'], truoc: [click('#btn-save'), click('#btn-fail'), click('.toast:nth-child(1) .toast-close')] },
        { an: true, moTa: 'Each toast keeps its own timer', kiem: 'danh-sach-text', selector: '.toast-text', mongDoi: ['Something went wrong'], truoc: [click('#btn-save'), cho(900), click('#btn-fail'), cho(800)] },
        { an: true, moTa: 'No alert()', kiem: 'ma-nguon', khop: '\\balert\\(', phuDinh: true },
        { an: true, moTa: 'clearTimeout in a cleanup', kiem: 'ma-nguon', khop: 'return\\s*\\(\\)\\s*=>\\s*clearTimeout\\(' },
      ],
    }),
  ],
});
