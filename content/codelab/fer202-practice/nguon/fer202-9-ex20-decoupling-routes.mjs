/**
 * FER202 · Exercise 20 — Decoupling routes: tách route ra tệp riêng theo tính năng và ghép lại.
 * Đề 1: mảng cấu hình route + useRoutes · Đề 2: mỗi tính năng tự khai báo <Route> của nó, App chỉ ghép.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector) => ({ hanhDong: 'click', selector });
const R = { router: true };

// ── tệp chung của đề 1 ──
const PAGES = {
  'src/pages/Home.js': `// src/pages/Home.js (cho sẵn)
export default function Home() {
  return <h1 id="page-home">Home</h1>;
}
`,
  'src/pages/BlogList.js': `// src/pages/BlogList.js (cho sẵn)
import { Link } from 'react-router-dom';

export const POSTS = [
  { slug: 'hello-react', title: 'Hello React' },
  { slug: 'routing-101', title: 'Routing 101' },
];

export default function BlogList() {
  return (
    <ul id="blog-list">
      {POSTS.map((p) => <li key={p.slug}><Link className="post-link" to={p.slug}>{p.title}</Link></li>)}
    </ul>
  );
}
`,
  'src/pages/BlogPost.js': `// src/pages/BlogPost.js (cho sẵn)
import { useParams } from 'react-router-dom';
import { POSTS } from './BlogList';

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);
  return post ? <h2 id="post-title">{post.title}</h2> : <p id="post-missing">Post not found</p>;
}
`,
  'src/pages/NotFound.js': `// src/pages/NotFound.js (cho sẵn)
export default function NotFound() {
  return <h1 id="page-404">Page not found</h1>;
}
`,
};

const LAYOUT = `// src/layouts/MainLayout.js — header + nav dùng chung, trang con vẽ vào <Outlet />
import { NavLink, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <header id="site-header">
        <NavLink to="/" end id="nav-home">Home</NavLink>{' '}
        <NavLink to="/blog" id="nav-blog">Blog</NavLink>
      </header>
      <main id="main">
        <Outlet />
      </main>
    </div>
  );
}
`;

const ROUTES = `// src/routes.js — MỌI route khai báo ở một chỗ, dạng mảng object
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'blog',
        children: [
          { index: true, element: <BlogList /> },
          { path: ':slug', element: <BlogPost /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
`;

// ── tệp của đề 2 ──
const SHOP_PAGES = `// src/features/shop/pages.js (cho sẵn)
export const ShopHome = () => <h1 id="shop-home">Shop</h1>;
export const Cart = () => <h1 id="cart">Your cart</h1>;
`;
const ADMIN_PAGES = `// src/features/admin/pages.js (cho sẵn)
import { NavLink, Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div id="admin">
      <h1 id="admin-title">Admin</h1>
      <NavLink to="products" id="admin-products">Products</NavLink>{' '}
      <NavLink to="orders" id="admin-orders">Orders</NavLink>
      <Outlet />
    </div>
  );
}
export const AdminHome = () => <p id="admin-home">Choose a section</p>;
export const AdminProducts = () => <p id="admin-products-page">Manage products</p>;
export const AdminOrders = () => <p id="admin-orders-page">Manage orders</p>;
`;
const SHOP_ROUTES = `// src/features/shop/shopRoutes.js — route của tính năng Shop
import { Route } from 'react-router-dom';
import { Cart, ShopHome } from './pages';

export const shopRoutes = (
  <>
    <Route path="/" element={<ShopHome />} />
    <Route path="/cart" element={<Cart />} />
  </>
);
`;
const ADMIN_ROUTES = `// src/features/admin/adminRoutes.js — route của tính năng Admin (lồng, có layout riêng)
import { Route } from 'react-router-dom';
import { AdminHome, AdminLayout, AdminOrders, AdminProducts } from './pages';

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminHome />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="orders" element={<AdminOrders />} />
  </Route>
);
`;

export default doiDau({
  slug: 'fer202-9-ex20-decoupling-routes',
  ten: 'Exercise 20 — Decoupling routes',
  khoa: KHOA,
  baiHoc: 'fer202-9-ex20-decoupling-routes',
  de: [
    reactNho({
      tieuDe: 'Route config in routes.js + useRoutes',
      doKho: 'MEDIUM', phut: 15, index: R,
      them: PAGES,
      themGiai: { 'src/routes.js': ROUTES, 'src/layouts/MainLayout.js': LAYOUT },
      themDau: {
        'src/routes.js': `// src/routes.js — STARTER: chuyển các route trong App.js sang đây (mảng object)
export const routes = [];
`,
        'src/layouts/MainLayout.js': `// src/layouts/MainLayout.js — STARTER: header + <Outlet />
export default function MainLayout() {
  return <header id="site-header">Header</header>;
}
`,
      },
      khaiNiem: ['route objects', 'useRoutes', 'layout route', 'nested children'], the: ['router', 'exercise-20'],
      moTa: {
        en: '<p>The starter declares every route inside <code>App.js</code>. Move them to <code>src/routes.js</code> as an array of route objects (<code>path</code>, <code>element</code>, <code>children</code>, <code>index</code>) and render them with <code>useRoutes(routes)</code>. A <code>MainLayout</code> (header + <code>&lt;Outlet /&gt;</code>) wraps every page.</p>',
        vi: '<p>Starter khai báo mọi route trong <code>App.js</code>. Chuyển chúng sang <code>src/routes.js</code> thành mảng object route (<code>path</code>, <code>element</code>, <code>children</code>, <code>index</code>) và vẽ bằng <code>useRoutes(routes)</code>. <code>MainLayout</code> (header + <code>&lt;Outlet /&gt;</code>) bọc mọi trang.</p>',
      },
      yeuCau: [
        { en: 'Routes: <code>/</code> Home, <code>/blog</code> list, <code>/blog/:slug</code> post, <code>*</code> 404 — all inside <code>MainLayout</code> (<code>#site-header</code>, <code>#nav-home</code>, <code>#nav-blog</code>, <code>#main</code>).', vi: 'Route: <code>/</code> Home, <code>/blog</code> danh sách, <code>/blog/:slug</code> bài viết, <code>*</code> 404 — tất cả nằm trong <code>MainLayout</code> (<code>#site-header</code>, <code>#nav-home</code>, <code>#nav-blog</code>, <code>#main</code>).' },
        { en: '<code>App.js</code> contains no <code>&lt;Route&gt;</code> — only <code>useRoutes(routes)</code>.', vi: '<code>App.js</code> không còn <code>&lt;Route&gt;</code> nào — chỉ <code>useRoutes(routes)</code>.' },
      ],
      viDu: [{ input: '/blog/routing-101', output: 'header + "Routing 101"', explanation: 'children of the layout route render inside its Outlet.|||children của route layout vẽ trong Outlet của nó.' }],
      goiY: ['export const routes = [{ path: "/", element: <MainLayout />, children: [{ index: true, element: <Home /> }, { path: "blog", children: [...] }, { path: "*", element: <NotFound /> }] }];', 'App: export default function App() { return useRoutes(routes); }'],
      loiHayGap: ['Đặt <code>path: "/blog"</code> (có /) trong children ⇒ thành đường dẫn tuyệt đối, dễ sai lồng.', 'Gọi <code>useRoutes</code> bên ngoài <code>BrowserRouter</code> ⇒ lỗi "useRoutes() may be used only in the context of a &lt;Router&gt;".'],
      thuatNgu: [{ en: 'route config', vi: 'cấu hình route dạng dữ liệu (mảng object)' }, { en: 'decoupling', vi: 'tách rời để mỗi phần độc lập' }],
      giaiThich: '<p>Route dạng dữ liệu nằm ở một tệp dễ đọc như "bản đồ" của app, dễ thêm/xoá và dùng lại (vd tạo menu từ cùng mảng). <code>useRoutes</code> làm đúng việc của <code>&lt;Routes&gt;</code> nhưng nhận mảng object.</p>',
      dau: `// src/App.js — STARTER: mọi route viết tay ở đây
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
`,
      giai: `// src/App.js — chỉ còn một dòng: vẽ mảng route
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';

export default function App() {
  return useRoutes(routes);
}
`,
      kiem: [
        { moTa: 'Home inside the layout', url: '/', kiem: 'danh-sach-text', selector: '#site-header, #main h1', mongDoi: ['Home Blog', 'Home'] },
        { moTa: 'Blog post route', url: '/blog/routing-101', kiem: 'text', selector: '#main #post-title', giaTri: 'Routing 101' },
        { moTa: 'Relative link from the list', url: '/blog', kiem: 'duong-dan', giaTri: '/blog/hello-react', truoc: [click('li:nth-child(1) .post-link')] },
        { moTa: '404 also inside the layout', url: '/nope', kiem: 'ton-tai', selector: '#main #page-404' },
        { an: true, moTa: 'App uses useRoutes', kiem: 'ma-nguon', khop: 'useRoutes\\(\\s*routes\\s*\\)' },
        { an: true, moTa: 'Route objects with children and index', kiem: 'ma-nguon', khop: 'children\\s*:[\\s\\S]*index\\s*:\\s*true' },
        { an: true, moTa: 'Blog link active on a post', url: '/blog/hello-react', kiem: 'ton-tai', selector: '#nav-blog.active' },
      ],
    }),
    reactNho({
      tieuDe: 'Feature route modules composed in App',
      doKho: 'MEDIUM', phut: 15, index: R,
      them: { 'src/features/shop/pages.js': SHOP_PAGES, 'src/features/admin/pages.js': ADMIN_PAGES },
      themGiai: { 'src/features/shop/shopRoutes.js': SHOP_ROUTES, 'src/features/admin/adminRoutes.js': ADMIN_ROUTES },
      themDau: {
        'src/features/shop/shopRoutes.js': `// src/features/shop/shopRoutes.js — STARTER: export const shopRoutes = (<>…</>);
export const shopRoutes = null;
`,
        'src/features/admin/adminRoutes.js': `// src/features/admin/adminRoutes.js — STARTER: export const adminRoutes = (<Route path="/admin" …>…</Route>);
export const adminRoutes = null;
`,
      },
      khaiNiem: ['feature folders', 'Route elements as values', 'composition'], the: ['router', 'exercise-20'],
      moTa: {
        en: '<p>In a bigger app each feature owns its routes. <code>shopRoutes.js</code> exports a fragment of <code>&lt;Route&gt;</code>s for <code>/</code> and <code>/cart</code>; <code>adminRoutes.js</code> exports a nested <code>/admin</code> route with its own layout. <code>App.js</code> only composes them and adds the 404.</p>',
        vi: '<p>App lớn thì mỗi tính năng tự giữ route của mình. <code>shopRoutes.js</code> export một fragment các <code>&lt;Route&gt;</code> cho <code>/</code> và <code>/cart</code>; <code>adminRoutes.js</code> export route lồng <code>/admin</code> có layout riêng. <code>App.js</code> chỉ ghép chúng lại và thêm 404.</p>',
      },
      yeuCau: [
        { en: 'Shop: <code>/</code> ⇒ <code>#shop-home</code>, <code>/cart</code> ⇒ <code>#cart</code>.', vi: 'Shop: <code>/</code> ⇒ <code>#shop-home</code>, <code>/cart</code> ⇒ <code>#cart</code>.' },
        { en: 'Admin (layout <code>AdminLayout</code> given): index ⇒ <code>#admin-home</code>, <code>products</code>, <code>orders</code>. Unknown ⇒ <code>#page-404</code>.', vi: 'Admin (đã có <code>AdminLayout</code>): index ⇒ <code>#admin-home</code>, <code>products</code>, <code>orders</code>. Lạ ⇒ <code>#page-404</code>.' },
      ],
      viDu: [{ input: '/admin/orders', output: 'Admin + Manage orders', explanation: 'App: <Routes>{shopRoutes}{adminRoutes}<Route path="*" … /></Routes>|||App: <Routes>{shopRoutes}{adminRoutes}<Route path="*" … /></Routes>' }],
      goiY: ['export const shopRoutes = (<><Route path="/" element={<ShopHome />} /><Route path="/cart" element={<Cart />} /></>);', 'Routes chấp nhận Route nằm trong Fragment.'],
      loiHayGap: ['Export một COMPONENT <code>ShopRoutes</code> rồi đặt <code>&lt;ShopRoutes /&gt;</code> trong <code>&lt;Routes&gt;</code> ⇒ lỗi "[ShopRoutes] is not a &lt;Route&gt; component" — phải export phần tử JSX, không phải component.', 'Quên import <code>Route</code> trong tệp route của tính năng.'],
      thuatNgu: [{ en: 'feature module', vi: 'thư mục gom mọi thứ của một tính năng' }],
      giaiThich: '<p>&lt;Routes&gt; chỉ nhận trực tiếp &lt;Route&gt; (hoặc Fragment chứa Route). Vì vậy tính năng export một GIÁ TRỊ JSX (<code>shopRoutes</code>), không phải component — App chèn giá trị đó như mọi biểu thức JSX khác.</p>',
      dau: `// src/App.js — STARTER
import { Route, Routes } from 'react-router-dom';
import { shopRoutes } from './features/shop/shopRoutes';
import { adminRoutes } from './features/admin/adminRoutes';

export default function App() {
  return (
    <Routes>
      {shopRoutes}
      {adminRoutes}
    </Routes>
  );
}
`,
      giai: `// src/App.js — chỉ ghép route của các tính năng + 404
import { Route, Routes } from 'react-router-dom';
import { shopRoutes } from './features/shop/shopRoutes';
import { adminRoutes } from './features/admin/adminRoutes';

const NotFound = () => <h1 id="page-404">Page not found</h1>;

export default function App() {
  return (
    <Routes>
      {shopRoutes}
      {adminRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Shop home', url: '/', kiem: 'ton-tai', selector: '#shop-home' },
        { moTa: 'Cart route', url: '/cart', kiem: 'text', selector: '#cart', giaTri: 'Your cart' },
        { moTa: 'Admin index inside the admin layout', url: '/admin', kiem: 'danh-sach-text', selector: '#admin-title, #admin-home', mongDoi: ['Admin', 'Choose a section'] },
        { moTa: 'Admin child via sidebar', url: '/admin', kiem: 'ton-tai', selector: '#admin #admin-orders-page', truoc: [click('#admin-orders')] },
        { an: true, moTa: '404', url: '/nothing', kiem: 'ton-tai', selector: '#page-404' },
        { an: true, moTa: 'adminRoutes is a JSX value', kiem: 'ma-nguon', khop: 'export\\s+const\\s+adminRoutes\\s*=\\s*\\(?\\s*<Route' },
      ],
    }),
  ],
});
