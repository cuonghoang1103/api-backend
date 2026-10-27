/**
 * FER202 · 9.1 — React Router v6 (bài luyện). src/index.js bọc <BrowserRouter> (máy chấm đổi sang MemoryRouter;
 * `url` = đường dẫn mở đầu, kiểm `duong-dan` = URL hiện tại).
 * Dễ → khó: Routes + NavLink + 404 → :id → route lồng + Outlet → useNavigate (luồng thanh toán) → useSearchParams.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const R = { router: true };
const RR = ['react-router-dom'];

const PRODUCTS = `const PRODUCTS = [
  { id: 1, name: 'iPhone 15', category: 'phone', price: 22990000 },
  { id: 2, name: 'Galaxy S24', category: 'phone', price: 19990000 },
  { id: 3, name: 'MacBook Air M3', category: 'laptop', price: 27990000 },
  { id: 4, name: 'ThinkPad X1', category: 'laptop', price: 32990000 },
  { id: 5, name: 'AirPods Pro', category: 'audio', price: 5990000 },
];`;

export default doiDau({
  slug: 'fer202-9-1-router',
  ten: '9.1 React Router',
  khoa: KHOA,
  baiHoc: 'fer202-9-1-router',
  de: [
    reactNho({
      tieuDe: 'Routes, NavLink and a 404 page',
      doKho: 'EASY', phut: 10, index: R, thuVien: RR,
      khaiNiem: ['Routes/Route', 'NavLink active', 'catch-all route'], the: ['router', 'react-router'],
      moTa: {
        en: '<p>A three-page site: Home (<code>/</code>), About (<code>/about</code>), Contact (<code>/contact</code>), plus a 404 page for any other URL. The starter uses <code>&lt;a href&gt;</code>, which reloads the whole app on every click — replace it with <code>NavLink</code> so the active link is highlighted and navigation stays client-side.</p>',
        vi: '<p>Site ba trang: Home (<code>/</code>), About (<code>/about</code>), Contact (<code>/contact</code>), thêm trang 404 cho mọi URL khác. Starter dùng <code>&lt;a href&gt;</code>, mỗi lần bấm tải lại cả app — thay bằng <code>NavLink</code> để link đang mở được tô sáng và điều hướng chạy phía client.</p>',
      },
      yeuCau: [
        { en: 'Headings <code>#page-home</code> (Home), <code>#page-about</code> (About us), <code>#page-contact</code> (Contact), <code>#page-404</code> (Page not found).', vi: 'Tiêu đề <code>#page-home</code> (Home), <code>#page-about</code> (About us), <code>#page-contact</code> (Contact), <code>#page-404</code> (Page not found).' },
        { en: 'Nav links <code>#nav-home</code> (with <code>end</code>), <code>#nav-about</code>, <code>#nav-contact</code>; the active one has class <code>active</code>.', vi: 'Link <code>#nav-home</code> (có <code>end</code>), <code>#nav-about</code>, <code>#nav-contact</code>; link đang mở có class <code>active</code>.' },
      ],
      viDu: [{ input: 'URL /abc', output: 'Page not found', explanation: '<Route path="*"> matches anything not matched before.|||<Route path="*"> khớp mọi thứ chưa khớp route nào.' }],
      goiY: ['<Routes><Route path="/" element={<Home />} /> … <Route path="*" element={<NotFound />} /></Routes>', '<NavLink to="/" end id="nav-home">Home</NavLink> — thiếu end thì "/" luôn active.'],
      loiHayGap: ['Dùng <code>&lt;a href&gt;</code> ⇒ tải lại trang, mất state.', 'Quên <code>end</code> trên link "/" ⇒ Home sáng ở mọi trang.'],
      thuatNgu: [{ en: 'client-side routing', vi: 'đổi trang bằng JavaScript, không tải lại từ server' }],
      giaiThich: '<p><code>BrowserRouter</code> (trong index.js) theo dõi URL; <code>Routes</code> chọn route khớp nhất; <code>NavLink</code> tự gắn class <code>active</code> khi đường dẫn khớp.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  return (
    <div>
      <nav>
        <a href="/" id="nav-home">Home</a>
        <a href="/about" id="nav-about">About</a>
        <a href="/contact" id="nav-contact">Contact</a>
      </nav>
      <h1 id="page-home">Home</h1>
    </div>
  );
}
`,
      giai: `// src/App.js — Routes + NavLink + route 404
import { NavLink, Route, Routes } from 'react-router-dom';

const Home = () => <h1 id="page-home">Home</h1>;
const About = () => <h1 id="page-about">About us</h1>;
const Contact = () => <h1 id="page-contact">Contact</h1>;
const NotFound = () => <h1 id="page-404">Page not found</h1>;

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/" end id="nav-home">Home</NavLink>{' '}
        <NavLink to="/about" id="nav-about">About</NavLink>{' '}
        <NavLink to="/contact" id="nav-contact">Contact</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
`,
      kiem: [
        { moTa: '/about shows About', url: '/about', kiem: 'text', selector: '#page-about', giaTri: 'About us' },
        { moTa: 'Unknown URL ⇒ 404', url: '/abc/xyz', kiem: 'text', selector: '#page-404', giaTri: 'Page not found' },
        { moTa: 'Clicking a link navigates', kiem: 'duong-dan', giaTri: '/contact', truoc: [click('#nav-contact')] },
        { moTa: 'Active link highlighted', url: '/contact', kiem: 'ton-tai', selector: '#nav-contact.active' },
        { an: true, moTa: 'Home link not active on /about (end)', url: '/about', kiem: 'khong-ton-tai', selector: '#nav-home.active' },
        { an: true, moTa: 'No full reload on navigation', kiem: 'khong-tai-lai', truoc: [click('#nav-about')] },
      ],
    }),
    reactNho({
      tieuDe: 'Route parameters: product detail by id',
      doKho: 'MEDIUM', phut: 12, index: R, thuVien: RR,
      khaiNiem: ['useParams', 'string params', 'not-found state'], the: ['router', 'useParams'],
      moTa: {
        en: '<p>A list at <code>/products</code> links to <code>/products/:id</code>. The detail page reads <code>id</code> with <code>useParams</code> — remember it is a <b>string</b> — and finds the product. An unknown id shows a friendly message with a link back.</p>',
        vi: '<p>Danh sách ở <code>/products</code> link tới <code>/products/:id</code>. Trang chi tiết đọc <code>id</code> bằng <code>useParams</code> — nhớ nó là <b>chuỗi</b> — rồi tìm sản phẩm. Id không tồn tại hiện thông báo thân thiện kèm link quay lại.</p>',
      },
      yeuCau: [
        { en: 'List: <code>a.product-link</code> per product (text = name). <code>/</code> redirects to <code>/products</code> (<code>&lt;Navigate replace&gt;</code>).', vi: 'Danh sách: mỗi sản phẩm một <code>a.product-link</code> (chữ = tên). <code>/</code> chuyển hướng tới <code>/products</code> (<code>&lt;Navigate replace&gt;</code>).' },
        { en: 'Detail: <code>#product-name</code>, <code>#product-price</code> <code>22,990,000 ₫</code>; not found ⇒ <code>#not-found</code> <code>Product #99 not found</code> + <code>#back</code> link to the list.', vi: 'Chi tiết: <code>#product-name</code>, <code>#product-price</code> <code>22,990,000 ₫</code>; không có ⇒ <code>#not-found</code> <code>Product #99 not found</code> + link <code>#back</code> về danh sách.' },
      ],
      viDu: [{ input: '/products/3', output: 'MacBook Air M3 · 27,990,000 ₫', explanation: 'PRODUCTS.find(p => p.id === Number(id))|||PRODUCTS.find(p => p.id === Number(id))' }],
      goiY: ['const { id } = useParams(); const product = PRODUCTS.find((p) => p.id === Number(id));', '<Route path="/" element={<Navigate to="/products" replace />} />'],
      loiHayGap: ['So sánh <code>p.id === id</code> (số với chuỗi) ⇒ luôn không tìm thấy.', 'Không xử lý id lạ ⇒ đọc <code>product.name</code> của undefined, trắng trang.'],
      thuatNgu: [{ en: 'route parameter', vi: 'đoạn động trong URL, vd :id' }],
      giaiThich: '<p>Mọi tham số URL đều là chuỗi. Đổi sang số trước khi so sánh, và luôn có nhánh "không tìm thấy" — người dùng có thể gõ URL bất kỳ.</p>',
      dau: `// src/App.js — STARTER
import { Route, Routes, useParams } from 'react-router-dom';

${PRODUCTS}

function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  return <h1 id="product-name">{product.name}</h1>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — useParams (chuỗi ⇒ số), nhánh không tìm thấy, Navigate chuyển hướng
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';

${PRODUCTS}

const vnd = (n) => n.toLocaleString('en-US') + ' ₫';

function ProductList() {
  return (
    <ul>
      {PRODUCTS.map((p) => (
        <li key={p.id}><Link className="product-link" to={´/products/@{p.id}´}>{p.name}</Link></li>
      ))}
    </ul>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) {
    return (
      <div>
        <p id="not-found">Product #{id} not found</p>
        <Link id="back" to="/products">Back to products</Link>
      </div>
    );
  }
  return (
    <div>
      <h1 id="product-name">{product.name}</h1>
      <p id="product-price">{vnd(product.price)}</p>
      <Link id="back" to="/products">Back to products</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Detail by id', url: '/products/3', kiem: 'danh-sach-text', selector: '#product-name, #product-price', mongDoi: ['MacBook Air M3', '27,990,000 ₫'] },
        { moTa: 'Unknown id', url: '/products/99', kiem: 'text', selector: '#not-found', giaTri: 'Product #99 not found' },
        { moTa: 'Clicking a product opens its page', url: '/products', kiem: 'duong-dan', giaTri: '/products/2', truoc: [click('li:nth-child(2) .product-link')] },
        { moTa: '/ redirects to /products', url: '/', kiem: 'so-luong', selector: '.product-link', giaTri: 5 },
        { an: true, moTa: 'Back link returns to the list', url: '/products/99', kiem: 'duong-dan', giaTri: '/products', truoc: [click('#back')] },
        { an: true, moTa: 'Redirect replaces the URL', url: '/', kiem: 'duong-dan', giaTri: '/products' },
      ],
    }),
    reactNho({
      tieuDe: 'Nested routes: a dashboard layout with Outlet',
      doKho: 'MEDIUM', phut: 14, index: R, thuVien: RR,
      khaiNiem: ['nested Route', 'Outlet', 'index route', 'relative links'], the: ['router', 'Outlet'],
      moTa: {
        en: '<p>A dashboard at <code>/dashboard</code> whose sidebar and title stay on screen while the content area changes: <b>Overview</b> (index route), <b>Orders</b> (<code>orders</code>) and <b>Settings</b> (<code>settings</code>). The layout renders <code>&lt;Outlet /&gt;</code> where the child page goes.</p>',
        vi: '<p>Dashboard ở <code>/dashboard</code> có thanh bên và tiêu đề luôn hiện, chỉ vùng nội dung đổi: <b>Overview</b> (index route), <b>Orders</b> (<code>orders</code>) và <b>Settings</b> (<code>settings</code>). Layout vẽ <code>&lt;Outlet /&gt;</code> ở chỗ trang con xuất hiện.</p>',
      },
      yeuCau: [
        { en: 'Layout: <code>#dash-title</code> <code>Admin dashboard</code> + sidebar NavLinks <code>#side-overview</code> (end), <code>#side-orders</code>, <code>#side-settings</code> + <code>#content</code> wrapping the Outlet.', vi: 'Layout: <code>#dash-title</code> <code>Admin dashboard</code> + NavLink thanh bên <code>#side-overview</code> (end), <code>#side-orders</code>, <code>#side-settings</code> + <code>#content</code> bọc Outlet.' },
        { en: 'Children: <code>#overview</code> (Overview), <code>#orders</code> (Orders), <code>#settings</code> (Settings). Use relative paths in the child routes and links.', vi: 'Trang con: <code>#overview</code> (Overview), <code>#orders</code> (Orders), <code>#settings</code> (Settings). Dùng đường dẫn tương đối trong route con và link.' },
      ],
      viDu: [{ input: '/dashboard/orders', output: 'Admin dashboard + Orders', explanation: 'The parent element renders, and the child appears in its Outlet.|||Phần tử cha được vẽ, phần tử con xuất hiện trong Outlet của cha.' }],
      goiY: ['<Route path="/dashboard" element={<DashboardLayout />}><Route index element={<Overview />} /><Route path="orders" element={<Orders />} /> …</Route>', 'Trong layout: <NavLink to="orders">, <NavLink to="." end> cho Overview.'],
      loiHayGap: ['Quên <code>&lt;Outlet /&gt;</code> ⇒ URL đổi nhưng nội dung con không hiện.', 'Viết route con bắt đầu bằng "/" (<code>path="/orders"</code>) ⇒ thành route tuyệt đối, lỗi lồng.'],
      thuatNgu: [{ en: 'index route', vi: 'route con mặc định khi URL đúng bằng route cha' }, { en: 'Outlet', vi: 'chỗ trống trong layout để vẽ route con' }],
      giaiThich: '<p>Route lồng ghép URL: <code>/dashboard</code> + <code>orders</code>. Layout cha luôn được vẽ, route con khớp được vẽ vào Outlet — đó là cách giữ thanh bên, header không bị dựng lại.</p>',
      dau: `// src/App.js — STARTER
import { Route, Routes } from 'react-router-dom';

const Overview = () => <h2 id="overview">Overview</h2>;
const Orders = () => <h2 id="orders">Orders</h2>;
const Settings = () => <h2 id="settings">Settings</h2>;

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Overview />} />
      <Route path="/dashboard/orders" element={<Orders />} />
      <Route path="/dashboard/settings" element={<Settings />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — layout + Outlet, index route, đường dẫn tương đối
import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';

const Overview = () => <h2 id="overview">Overview</h2>;
const Orders = () => <h2 id="orders">Orders</h2>;
const Settings = () => <h2 id="settings">Settings</h2>;

function DashboardLayout() {
  return (
    <div>
      <h1 id="dash-title">Admin dashboard</h1>
      <aside>
        <NavLink to="." end id="side-overview">Overview</NavLink>{' '}
        <NavLink to="orders" id="side-orders">Orders</NavLink>{' '}
        <NavLink to="settings" id="side-settings">Settings</NavLink>
      </aside>
      <section id="content">
        <Outlet />
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Index route inside the layout', url: '/dashboard', kiem: 'danh-sach-text', selector: '#dash-title, #content h2', mongDoi: ['Admin dashboard', 'Overview'] },
        { moTa: 'Child route renders in the Outlet', url: '/dashboard/orders', kiem: 'ton-tai', selector: '#content #orders' },
        { moTa: 'Sidebar link navigates', url: '/dashboard', kiem: 'duong-dan', giaTri: '/dashboard/settings', truoc: [click('#side-settings')] },
        { moTa: 'Layout stays while content changes', url: '/dashboard/settings', kiem: 'text', selector: '#dash-title', giaTri: 'Admin dashboard' },
        { an: true, moTa: 'Overview link active only on the index', url: '/dashboard/orders', kiem: 'khong-ton-tai', selector: '#side-overview.active' },
        { an: true, moTa: 'Uses <Outlet />', kiem: 'ma-nguon', khop: '<Outlet\\s*/>' },
      ],
    }),
    reactNho({
      tieuDe: 'useNavigate: a checkout flow',
      doKho: 'MEDIUM', phut: 15, index: R, thuVien: RR,
      khaiNiem: ['useNavigate', 'navigate with replace', 'navigate(-1)', 'location state'], the: ['router', 'useNavigate'],
      moTa: {
        en: '<p>Programmatic navigation. On <code>/checkout</code> the user fills a name and presses <b>Place order</b>; after validation, go to <code>/orders/1001</code> with <code>replace: true</code> (so Back does not return to a submitted form) and pass the customer name in <code>state</code>. The confirmation page has a <b>Continue shopping</b> button to <code>/</code>.</p>',
        vi: '<p>Điều hướng bằng mã. Ở <code>/checkout</code> người dùng nhập tên rồi bấm <b>Place order</b>; hợp lệ thì sang <code>/orders/1001</code> với <code>replace: true</code> (để Back không quay lại form đã gửi) và truyền tên khách qua <code>state</code>. Trang xác nhận có nút <b>Continue shopping</b> về <code>/</code>.</p>',
      },
      yeuCau: [
        { en: 'Home <code>/</code>: <code>#shop</code> + <code>#go-checkout</code> (Link). Checkout: form <code>#checkout-form</code>, <code>#customer</code>, error <code>#error</code> <code>Please enter your name</code> when blank; <code>#cancel</code> calls <code>navigate(-1)</code>.', vi: 'Home <code>/</code>: <code>#shop</code> + <code>#go-checkout</code> (Link). Checkout: form <code>#checkout-form</code>, <code>#customer</code>, lỗi <code>#error</code> <code>Please enter your name</code> khi trống; <code>#cancel</code> gọi <code>navigate(-1)</code>.' },
        { en: 'Confirmation <code>/orders/:orderId</code>: <code>#confirm</code> <code>Thank you, Lan! Order #1001 is confirmed.</code> (name from <code>location.state</code>; missing ⇒ <code>customer</code>); <code>#continue</code>.', vi: 'Xác nhận <code>/orders/:orderId</code>: <code>#confirm</code> <code>Thank you, Lan! Order #1001 is confirmed.</code> (tên lấy từ <code>location.state</code>; thiếu ⇒ <code>customer</code>); <code>#continue</code>.' },
      ],
      viDu: [{ input: 'type Lan, Place order', output: 'URL /orders/1001 · Thank you, Lan! …', explanation: 'navigate("/orders/1001", { replace: true, state: { name } })|||navigate("/orders/1001", { replace: true, state: { name } })' }],
      goiY: ['const navigate = useNavigate(); … navigate(´/orders/1001´, { replace: true, state: { name } });', 'Trang xác nhận: const { orderId } = useParams(); const { state } = useLocation(); const name = state?.name ?? "customer";'],
      loiHayGap: ['Gọi <code>navigate()</code> ngay trong thân component (không trong sự kiện/effect) ⇒ React cảnh báo, vòng lặp.', 'Dùng <code>window.location.href = …</code> ⇒ tải lại toàn trang, mất state.'],
      thuatNgu: [{ en: 'programmatic navigation', vi: 'chuyển trang bằng code sau một hành động' }, { en: 'history entry', vi: 'một mục trong lịch sử trình duyệt' }],
      giaiThich: '<p><code>Link</code> cho điều hướng người dùng bấm; <code>useNavigate</code> cho điều hướng SAU một việc (gửi form, đăng nhập). <code>replace</code> thay mục lịch sử hiện tại thay vì thêm mới.</p>',
      dau: `// src/App.js — STARTER
import { Link, Route, Routes } from 'react-router-dom';

function Checkout() {
  return (
    <form id="checkout-form" onSubmit={() => { window.location.href = '/orders/1001'; }}>
      <input id="customer" />
      <button type="submit">Place order</button>
    </form>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div id="shop"><Link id="go-checkout" to="/checkout">Checkout</Link></div>} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — useNavigate sau khi gửi form (replace + state), navigate(-1) để huỷ
import { useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

function Shop() {
  return (
    <div id="shop">
      <h1>Shop</h1>
      <Link id="go-checkout" to="/checkout">Checkout</Link>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    navigate('/orders/1001', { replace: true, state: { name: name.trim() } });
  };

  return (
    <form id="checkout-form" onSubmit={submit}>
      <input id="customer" value={name} onChange={(e) => setName(e.target.value)} />
      {error && <p id="error">{error}</p>}
      <button type="submit">Place order</button>
      <button id="cancel" type="button" onClick={() => navigate(-1)}>Cancel</button>
    </form>
  );
}

function Confirmation() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name ?? 'customer';
  return (
    <div>
      <p id="confirm">Thank you, {name}! Order #{orderId} is confirmed.</p>
      <button id="continue" type="button" onClick={() => navigate('/')}>Continue shopping</button>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders/:orderId" element={<Confirmation />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Valid order navigates to the confirmation', url: '/checkout', kiem: 'duong-dan', giaTri: '/orders/1001', truoc: [nhap('#customer', 'Lan'), { hanhDong: 'gui', selector: '#checkout-form' }] },
        { moTa: 'Name passed in state', url: '/checkout', kiem: 'text', selector: '#confirm', giaTri: 'Thank you, Lan! Order #1001 is confirmed.', truoc: [nhap('#customer', 'Lan'), { hanhDong: 'gui', selector: '#checkout-form' }] },
        { moTa: 'Blank name ⇒ error, stays on checkout', url: '/checkout', kiem: 'text', selector: '#error', giaTri: 'Please enter your name', truoc: [{ hanhDong: 'gui', selector: '#checkout-form' }] },
        { moTa: 'Direct visit without state', url: '/orders/2002', kiem: 'text', selector: '#confirm', giaTri: 'Thank you, customer! Order #2002 is confirmed.' },
        { an: true, moTa: 'Cancel goes back', url: '/', kiem: 'duong-dan', giaTri: '/', truoc: [click('#go-checkout'), click('#cancel')] },
        { an: true, moTa: 'Continue shopping returns home', url: '/orders/1', kiem: 'ton-tai', selector: '#shop', truoc: [click('#continue')] },
        { an: true, moTa: 'replace: true is used', kiem: 'ma-nguon', khop: 'navigate\\([^)]*replace:\\s*true' },
        { an: true, moTa: 'No full page reload', url: '/checkout', kiem: 'khong-tai-lai', truoc: [nhap('#customer', 'Lan'), { hanhDong: 'gui', selector: '#checkout-form' }] },
      ],
    }),
    reactNho({
      tieuDe: 'useSearchParams: filters that live in the URL',
      doKho: 'HARD', phut: 18, index: R, thuVien: RR,
      khaiNiem: ['useSearchParams', 'URL as state', 'default values', 'shareable links'], the: ['router', 'useSearchParams'],
      moTa: {
        en: '<p>Put the product filters in the <b>query string</b> instead of component state, so the link can be shared and survives a reload: <code>/products?category=laptop&amp;sort=price-desc</code>. Default values are NOT written into the URL (choosing "all" removes <code>category</code>).</p>',
        vi: '<p>Đưa bộ lọc sản phẩm vào <b>query string</b> thay vì state của component, để link chia sẻ được và còn sau khi tải lại: <code>/products?category=laptop&amp;sort=price-desc</code>. Giá trị mặc định KHÔNG ghi vào URL (chọn "all" thì bỏ <code>category</code>).</p>',
      },
      yeuCau: [
        { en: '<code>#category</code> select (all/phone/laptop/audio) and <code>#sort</code> select (<code>name</code> default, <code>price-asc</code>, <code>price-desc</code>), both controlled by the URL.', vi: 'Select <code>#category</code> (all/phone/laptop/audio) và select <code>#sort</code> (<code>name</code> mặc định, <code>price-asc</code>, <code>price-desc</code>), cả hai lấy giá trị từ URL.' },
        { en: 'Rows <code>li.product</code> (text = name), <code>#count</code> <code>2 products</code>. Unknown category in the URL ⇒ 0 products, no crash.', vi: 'Dòng <code>li.product</code> (chữ = tên), <code>#count</code> <code>2 products</code>. Category lạ trên URL ⇒ 0 sản phẩm, không lỗi.' },
      ],
      viDu: [{ input: 'choose laptop, then price high → low', output: 'URL ?category=laptop&sort=price-desc · ThinkPad X1, MacBook Air M3', explanation: 'setSearchParams creates a new history entry; the list is derived from the URL.|||setSearchParams tạo mục lịch sử mới; danh sách tính từ URL.' }],
      goiY: ['const [params, setParams] = useSearchParams(); const category = params.get("category") ?? "all";', 'Đổi: const next = new URLSearchParams(params); value === "all" ? next.delete("category") : next.set("category", value); setParams(next);'],
      loiHayGap: ['Giữ bộ lọc trong useState ⇒ tải lại / chia sẻ link mất bộ lọc.', 'Gọi <code>setSearchParams({ category })</code> ⇒ xoá mất <code>sort</code> đang có.'],
      thuatNgu: [{ en: 'query string', vi: 'phần sau dấu ? của URL' }, { en: 'source of truth', vi: 'nguồn sự thật duy nhất' }],
      giaiThich: '<p>Khi URL là nguồn sự thật, component chỉ ĐỌC từ URL và GHI vào URL; danh sách là dữ liệu suy ra. Nút Back của trình duyệt tự động thành "huỷ bộ lọc vừa chọn".</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

${PRODUCTS}

function Products() {
  const [category, setCategory] = useState('all');
  const shown = PRODUCTS.filter((p) => category === 'all' || p.category === category);
  return (
    <div>
      <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option><option value="phone">Phone</option><option value="laptop">Laptop</option><option value="audio">Audio</option>
      </select>
      <ul>{shown.map((p) => <li key={p.id} className="product">{p.name}</li>)}</ul>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — bộ lọc sống trên URL (useSearchParams); danh sách suy ra từ URL
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

${PRODUCTS}

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const sort = SORTERS[params.get('sort')] ? params.get('sort') : 'name';

  const update = (key, value, defaultValue) => {
    const next = new URLSearchParams(params);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const shown = PRODUCTS
    .filter((p) => category === 'all' || p.category === category)
    .sort(SORTERS[sort]);

  return (
    <div>
      <select id="category" value={category} onChange={(e) => update('category', e.target.value, 'all')}>
        <option value="all">All</option>
        <option value="phone">Phone</option>
        <option value="laptop">Laptop</option>
        <option value="audio">Audio</option>
      </select>
      <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value, 'name')}>
        <option value="name">Name</option>
        <option value="price-asc">Price: low → high</option>
        <option value="price-desc">Price: high → low</option>
      </select>
      <p id="count">{shown.length} products</p>
      <ul>{shown.map((p) => <li key={p.id} className="product">{p.name}</li>)}</ul>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Reads filters from the URL', url: '/products?category=laptop&sort=price-desc', kiem: 'danh-sach-text', selector: 'li.product', mongDoi: ['ThinkPad X1', 'MacBook Air M3'] },
        { moTa: 'Selecting writes to the URL', url: '/products', kiem: 'duong-dan', giaTri: '/products?category=phone&sort=price-asc', truoc: [{ hanhDong: 'doi', selector: '#category', giaTri: 'phone' }, { hanhDong: 'doi', selector: '#sort', giaTri: 'price-asc' }] },
        { moTa: 'Count text', url: '/products?category=phone', kiem: 'text', selector: '#count', giaTri: '2 products' },
        { moTa: 'Default sort by name', url: '/products', kiem: 'danh-sach-text', selector: 'li.product', mongDoi: ['AirPods Pro', 'Galaxy S24', 'iPhone 15', 'MacBook Air M3', 'ThinkPad X1'] },
        { an: true, moTa: 'Choosing "all" removes the param but keeps sort', url: '/products?category=audio&sort=price-desc', kiem: 'duong-dan', giaTri: '/products?sort=price-desc', truoc: [{ hanhDong: 'doi', selector: '#category', giaTri: 'all' }] },
        { an: true, moTa: 'Survives a reload', url: '/products', kiem: 'danh-sach-text', selector: 'li.product', mongDoi: ['AirPods Pro'], truoc: [{ hanhDong: 'doi', selector: '#category', giaTri: 'audio' }, { hanhDong: 'tai-lai' }] },
        { an: true, moTa: 'Unknown category ⇒ 0, no crash', url: '/products?category=tv', kiem: 'text', selector: '#count', giaTri: '0 products' },
        { an: true, moTa: 'Unknown sort falls back to name', url: '/products?sort=weird', kiem: 'thuoc-tinh-js', selector: '#sort', thuocTinh: 'value', giaTri: 'name' },
        { an: true, moTa: 'Uses useSearchParams', kiem: 'ma-nguon', khop: 'useSearchParams\\(' },
      ],
    }),
  ],
});
