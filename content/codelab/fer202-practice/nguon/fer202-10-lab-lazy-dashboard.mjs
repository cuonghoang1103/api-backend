/**
 * FER202 · Chương 10 (Code splitting) — LAB 10: Admin Dashboard with lazy & Suspense.
 * Bám Exercise 23 (lazy loading User & Post) nhưng sâu hơn: tách theo route, Suspense đặt TRONG layout (navbar
 * không biến mất), giả lập mạng chậm, Suspense lồng nhau, Error Boundary cho chunk lỗi (tự reset khi đổi trang),
 * tải trước khi rê chuột/focus, lazy với named export, component tải theo yêu cầu (nút Help).
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const CSS = `/* src/index.css — đã cho */
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
.layout { display: grid; grid-template-columns: 200px 1fr; min-height: 100vh; }
.side { background: #0f172a; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.side a { color: #cbd5e1; text-decoration: none; padding: 6px 10px; border-radius: 8px; }
.side a.active { background: #1e293b; color: #fff; }
.main { padding: 20px; }
.loading { color: #64748b; font-style: italic; }
.error { color: #dc2626; }
button { cursor: pointer; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; }
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const LAZY = `// src/utils/lazyLoad.js — tiện ích cho code splitting
import { lazy } from 'react';

// Giả lập mạng chậm: chunk chỉ "tới" sau ms (dev server cục bộ quá nhanh, không thấy fallback)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function withDelay(factory, ms) {
  return () => Promise.all([factory(), delay(ms)]).then(([module]) => module);
}

// lazy + preload(): GHI NHỚ promise ⇒ tải trước khi rê chuột, lúc mở trang dùng lại đúng promise đó
export function lazyWithPreload(factory) {
  let promise = null;
  const load = () => {
    if (!promise) promise = factory();
    return promise;
  };
  const Component = lazy(load);
  Component.preload = load;
  return Component;
}
`;

const BOUNDARY = `// src/components/ErrorBoundary.js — chỉ CLASS component bắt được lỗi khi render (kể cả chunk lazy hỏng)
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  state = { error: null };

  // lỗi ở con ⇒ cập nhật state để lần render sau hiện giao diện dự phòng
  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // nơi gửi lỗi lên hệ thống theo dõi (Sentry…) — ở đây chỉ ghi lại
    console.warn('Chunk failed:', error.message, info.componentStack ? '' : '');
  }

  render() {
    if (this.state.error) {
      return (
        <div id="chunk-error" className="error">
          <p>Could not load this page.</p>
          <Link to="/" id="btn-home">Back to overview</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

const PAGES = {
  'src/pages/Overview.js': `// src/pages/Overview.js — trang chủ: tải NGAY (eager), không cần chờ
export default function Overview() {
  return (
    <section id="overview-page">
      <h1>Welcome back!</h1>
      <p>Pick a section on the left. Other pages are downloaded only when you open them.</p>
    </section>
  );
}
`,
  'src/pages/Reports.js': `// src/pages/Reports.js — trang lazy chứa một component lazy NỮA (Suspense lồng nhau)
import { Suspense, lazy } from 'react';
import { withDelay } from '../utils/lazyLoad';

const RevenueChart = lazy(withDelay(() => import('../components/RevenueChart'), 800));

export default function Reports() {
  return (
    <section id="reports-page">
      <h1 id="reports-title">Reports</h1>
      {/* fallback RIÊNG: tiêu đề trang hiện ngay, chỉ ô biểu đồ chờ */}
      <Suspense fallback={<p id="chart-loading" className="loading">Loading chart...</p>}>
        <RevenueChart />
      </Suspense>
    </section>
  );
}
`,
  'src/components/RevenueChart.js': `// src/components/RevenueChart.js — "nặng" (thư viện biểu đồ thật vài trăm KB) ⇒ tách riêng
const DATA = [['Jan', 120], ['Feb', 150], ['Mar', 180]];

export default function RevenueChart() {
  return (
    <figure id="chart">
      {DATA.map(([m, v]) => (
        <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 32 }}>{m}</span>
          <span style={{ display: 'inline-block', height: 14, width: v, background: '#38bdf8' }} />
          <span>{v}</span>
        </div>
      ))}
      <figcaption>Revenue chart: {DATA.map(([m, v]) => ´@{m} @{v}´).join(' · ')}</figcaption>
    </figure>
  );
}
`,
  'src/pages/Users.js': `// src/pages/Users.js — NAMED export (không có export default) ⇒ lazy phải đổi thành { default: … }
const USERS = ['Nguyen Van An', 'Tran Thi Binh', 'Le Hoang Cuong'];

export function UsersPage() {
  return (
    <section id="users-page">
      <h1>Users</h1>
      <ul>{USERS.map((u) => <li key={u} className="user">{u}</li>)}</ul>
    </section>
  );
}
`,
  'src/pages/Settings.js': `// src/pages/Settings.js
export default function Settings() {
  return (
    <section id="settings-page">
      <h1>Settings</h1>
      <label><input type="checkbox" defaultChecked /> Email notifications</label>
    </section>
  );
}
`,
  'src/components/HelpPanel.js': `// src/components/HelpPanel.js — chỉ tải khi người dùng bấm Help
export default function HelpPanel({ onClose }) {
  return (
    <aside id="help-panel">
      <h2>Help</h2>
      <p>Code splitting downloads each page only when it is needed.</p>
      <button type="button" id="btn-close-help" onClick={onClose}>Close</button>
    </aside>
  );
}
`,
};

const APP = `// src/App.js — lazy theo route, Suspense trong layout, ErrorBoundary, preload, help panel tải theo yêu cầu
import { Suspense, lazy, useState } from 'react';
import { NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Overview from './pages/Overview';
import ErrorBoundary from './components/ErrorBoundary';
import { lazyWithPreload, withDelay } from './utils/lazyLoad';

const PAGE_DELAY = 600;
const Reports = lazyWithPreload(withDelay(() => import('./pages/Reports'), PAGE_DELAY));
// named export ⇒ trả về object có khoá default
const Users = lazyWithPreload(withDelay(() => import('./pages/Users').then((m) => ({ default: m.UsersPage })), PAGE_DELAY));
const Settings = lazyWithPreload(withDelay(() => import('./pages/Settings'), PAGE_DELAY));
// chunk hỏng (mất mạng / bản deploy cũ đã bị xoá) ⇒ promise reject
const Broken = lazy(() => Promise.reject(new Error('ChunkLoadError: Loading chunk 7 failed')));
const HelpPanel = lazy(withDelay(() => import('./components/HelpPanel'), 500));

// rê chuột HOẶC focus (bàn phím) vào link ⇒ tải trước
const preload = (C) => ({ onMouseEnter: () => C.preload(), onFocus: () => C.preload() });

function Layout() {
  const location = useLocation();
  const [help, setHelp] = useState(false);
  return (
    <div className="layout">
      <nav className="side">
        <NavLink to="/" end id="nav-overview">Overview</NavLink>
        <NavLink to="/reports" id="nav-reports" {...preload(Reports)}>Reports</NavLink>
        <NavLink to="/users" id="nav-users" {...preload(Users)}>Users</NavLink>
        <NavLink to="/settings" id="nav-settings" {...preload(Settings)}>Settings</NavLink>
        <NavLink to="/broken" id="nav-broken">Broken page</NavLink>
        <button type="button" id="btn-help" onClick={() => setHelp(true)}>Help</button>
      </nav>
      <main className="main">
        {/* key = đường dẫn ⇒ đổi trang là ErrorBoundary mới (lỗi trang cũ không "dính" sang trang khác) */}
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<p id="page-loading" className="loading">Loading page...</p>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        {help && (
          <Suspense fallback={<p id="help-loading" className="loading">Loading help...</p>}>
            <HelpPanel onClose={() => setHelp(false)} />
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/broken" element={<Broken />} />
      </Route>
    </Routes>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_APP = `// src/App.js — STARTER: mọi trang import THẲNG (gói chung một bundle), chưa có fallback/ErrorBoundary
import { NavLink, Route, Routes } from 'react-router-dom';
import Overview from './pages/Overview';
import Reports from './pages/Reports';
import { UsersPage } from './pages/Users';
import Settings from './pages/Settings';

export default function App() {
  // TODO: lazy (+ withDelay, lazyWithPreload), Suspense trong layout (#page-loading), ErrorBoundary (key = pathname),
  //       route /broken, preload khi rê chuột/focus, Help panel lazy (#help-loading → #help-panel)
  return (
    <div className="layout">
      <nav className="side">
        <NavLink to="/" end id="nav-overview">Overview</NavLink>
        <NavLink to="/reports" id="nav-reports">Reports</NavLink>
        <NavLink to="/users" id="nav-users">Users</NavLink>
        <NavLink to="/settings" id="nav-settings">Settings</NavLink>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
`;
const S_LAZY = `// src/utils/lazyLoad.js — STARTER
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// TODO: withDelay(factory, ms) và lazyWithPreload(factory) (ghi nhớ promise, gắn .preload)
`;
const S_BOUNDARY = `// src/components/ErrorBoundary.js — STARTER
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  // TODO: static getDerivedStateFromError + giao diện #chunk-error ("Could not load this page." + #btn-home)
  render() {
    return this.props.children;
  }
}
`;
const S_REPORTS = PAGES['src/pages/Reports.js'].replace(/const RevenueChart[\s\S]*?\n\n/, "import RevenueChart from '../components/RevenueChart';\n\n").replace(/<Suspense[\s\S]*?<\/Suspense>/, '<RevenueChart /> {/* TODO: lazy + Suspense riêng (#chart-loading) */}').replace("import { Suspense, lazy } from 'react';\nimport { withDelay } from '../utils/lazyLoad';\n", '');

const INDEX = index({ router: true }).replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, ...PAGES };
const LOI_GIAI = { 'src/App.js': APP, 'src/utils/lazyLoad.js': LAZY, 'src/components/ErrorBoundary.js': BOUNDARY, ...CHUNG };
const KHOI_DAU = { 'src/App.js': S_APP, 'src/utils/lazyLoad.js': S_LAZY, 'src/components/ErrorBoundary.js': S_BOUNDARY, ...CHUNG, 'src/pages/Reports.js': S_REPORTS };

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms) => ({ hanhDong: 'cho', ms });
const KIEM = [
  // f1
  { nhom: 'f1', moTa: 'Overview is shown immediately at "/"', url: '/', kiem: 'ton-tai', selector: '#overview-page' },
  { nhom: 'f1', moTa: 'Reports page appears after loading', kiem: 'text', selector: '#reports-title', giaTri: 'Reports', truoc: [click('#nav-reports'), cho(900)] },
  { nhom: 'f1', moTa: 'Pages are loaded with React.lazy + dynamic import()', kiem: 'ma-nguon', tep: 'src/App.js', khop: "import\\(\\s*['\"]\\./pages/Reports['\"]\\s*\\)[\\s\\S]*import\\(\\s*['\"]\\./pages/Settings['\"]\\s*\\)" },
  { nhom: 'f1', an: true, moTa: 'Settings page loads too', kiem: 'ton-tai', selector: '#settings-page', truoc: [click('#nav-settings'), cho(900)] },
  { nhom: 'f1', an: true, moTa: 'Overview stays eager (no lazy for it)', kiem: 'ma-nguon', tep: 'src/App.js', khop: "import Overview from ['\"]\\./pages/Overview['\"]" },
  // f2
  { nhom: 'f2', moTa: 'Fallback #page-loading while the page downloads', kiem: 'text', selector: '#page-loading', giaTri: 'Loading page...', truoc: [click('#nav-users')] },
  { nhom: 'f2', moTa: 'The sidebar stays visible during loading (Suspense inside the layout)', kiem: 'so-luong', selector: '#page-loading, #nav-overview', giaTri: 2, truoc: [click('#nav-users')] },
  { nhom: 'f2', an: true, moTa: 'Fallback disappears once the page is ready', kiem: 'khong-ton-tai', selector: '#page-loading', truoc: [click('#nav-users'), cho(900)] },
  // f3
  { nhom: 'f3', moTa: 'Simulated network: still loading after 300 ms', kiem: 'ton-tai', selector: '#page-loading', choToiDa: 0, truoc: [click('#nav-settings'), cho(300)] },
  { nhom: 'f3', moTa: 'withDelay uses Promise.all with the import', kiem: 'ma-nguon', tep: 'src/utils/lazyLoad.js', khop: 'Promise\\.all\\(\\s*\\[\\s*factory\\(\\)' },
  // f4
  { nhom: 'f4', moTa: 'Reports title shows while the chart is still loading', kiem: 'so-luong', selector: '#reports-title, #chart-loading', giaTri: 2, choToiDa: 0, truoc: [click('#nav-reports'), cho(750)] },
  { nhom: 'f4', moTa: 'Chart appears after its own chunk', kiem: 'text', selector: '#chart figcaption', giaTri: 'Revenue chart: Jan 120 · Feb 150 · Mar 180', truoc: [click('#nav-reports'), cho(1700)] },
  { nhom: 'f4', an: true, moTa: 'Nested Suspense in Reports.js', kiem: 'ma-nguon', tep: 'src/pages/Reports.js', khop: '<Suspense[\\s\\S]*RevenueChart' },
  // f5
  { nhom: 'f5', moTa: 'Broken chunk ⇒ #chunk-error message', kiem: 'text', selector: '#chunk-error p', giaTri: 'Could not load this page.', truoc: [click('#nav-broken'), cho(300)] },
  { nhom: 'f5', moTa: 'The rest of the app keeps working (sidebar still there)', kiem: 'ton-tai', selector: '#nav-reports', truoc: [click('#nav-broken'), cho(300)] },
  { nhom: 'f5', moTa: 'Navigating away resets the boundary', kiem: 'so-luong', selector: '#overview-page, #chunk-error', giaTri: 1, truoc: [click('#nav-broken'), cho(300), click('#btn-home'), cho(200)] },
  { nhom: 'f5', an: true, moTa: 'ErrorBoundary is a class with getDerivedStateFromError', kiem: 'ma-nguon', tep: 'src/components/ErrorBoundary.js', khop: 'static\\s+getDerivedStateFromError' },
  // f6
  { nhom: 'f6', moTa: 'Focus (or hover) preloads: no fallback after a later click', kiem: 'khong-ton-tai', selector: '#page-loading', choToiDa: 0, truoc: [{ hanhDong: 'focus', selector: '#nav-settings' }, cho(900), click('#nav-settings'), cho(50)] },
  { nhom: 'f6', an: true, moTa: 'Preloaded page is shown right away', kiem: 'ton-tai', selector: '#settings-page', choToiDa: 0, truoc: [{ hanhDong: 'focus', selector: '#nav-settings' }, cho(900), click('#nav-settings'), cho(50)] },
  { nhom: 'f6', an: true, moTa: 'lazyWithPreload memoizes the promise', kiem: 'ma-nguon', tep: 'src/utils/lazyLoad.js', khop: '\\.preload\\s*=' },
  // f7
  { nhom: 'f7', moTa: 'Users page (named export) renders 3 users', kiem: 'so-luong', selector: '#users-page .user', giaTri: 3, truoc: [click('#nav-users'), cho(900)] },
  { nhom: 'f7', moTa: 'Named export mapped to { default }', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'default:\\s*m\\.UsersPage' },
  // f8
  { nhom: 'f8', moTa: 'Help panel is not loaded until needed', kiem: 'so-luong', selector: '#help-panel, #help-loading', giaTri: 0 },
  { nhom: 'f8', moTa: '#btn-help ⇒ #help-loading then #help-panel', kiem: 'ton-tai', selector: '#help-loading', truoc: [click('#btn-help')] },
  { nhom: 'f8', an: true, moTa: 'Help panel appears and can be closed', kiem: 'so-luong', selector: '#help-panel', giaTri: 0, truoc: [click('#btn-help'), cho(800), click('#btn-close-help')] },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 10: Admin Dashboard — code splitting with lazy & Suspense', vi: 'LAB 10: Bảng quản trị — tách mã với lazy & Suspense' },
  phu: { en: 'FER202 · Chapter 10 — Code Splitting · Suggested time: 90 minutes · Total: 10 marks', vi: 'FER202 · Chương 10 — Tách mã · Thời gian gợi ý: 90 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>The dashboard bundle has become heavy. Split it so the first screen loads fast: pages are downloaded only when visited (<code>React.lazy</code>), a loading <code>Suspense</code> fallback appears <b>inside</b> the layout, a nested Suspense keeps the page visible while a heavy chart loads, an <b>Error Boundary</b> catches chunks that fail to download, links <b>preload</b> their page on hover/focus, and a help panel is fetched on demand.</p>',
    vi: '<p>Bundle của bảng quản trị đã nặng. Hãy tách nó để màn đầu tải nhanh: mỗi trang chỉ tải khi được mở (<code>React.lazy</code>), fallback của <code>Suspense</code> hiện <b>bên trong</b> layout, một Suspense lồng giữ trang hiện trong lúc biểu đồ nặng còn tải, <b>Error Boundary</b> bắt chunk tải lỗi, link <b>tải trước</b> trang khi rê chuột/focus, và khung trợ giúp chỉ tải khi cần.</p>',
  },
  chucNangChinh: [{ en: 'Overview (eager) · Reports · Users · Settings (lazy) · Broken page · Help panel.', vi: 'Overview (tải ngay) · Reports · Users · Settings (lazy) · trang lỗi · khung Help.' }],
  yeuCauChung: [
    { en: 'Pages and components under <code>src/pages</code>, <code>src/components</code> are GIVEN — your work is in <code>App.js</code>, <code>utils/lazyLoad.js</code>, <code>ErrorBoundary.js</code> and the nested Suspense in <code>Reports.js</code>.', vi: 'Các trang/component trong <code>src/pages</code>, <code>src/components</code> ĐÃ CHO — bạn làm ở <code>App.js</code>, <code>utils/lazyLoad.js</code>, <code>ErrorBoundary.js</code> và Suspense lồng trong <code>Reports.js</code>.' },
    { en: 'Simulate network latency: every lazy page waits 600 ms, the chart 800 ms, the help panel 500 ms (use <code>withDelay</code>).', vi: 'Giả lập độ trễ mạng: mỗi trang lazy chờ 600 ms, biểu đồ 800 ms, khung help 500 ms (dùng <code>withDelay</code>).' },
  ],
  cayThuMuc: `
src/
├── utils/lazyLoad.js         # delay · withDelay · lazyWithPreload
├── components/
│   ├── ErrorBoundary.js      # class component
│   ├── RevenueChart.js       # given ("heavy")
│   └── HelpPanel.js          # given
├── pages/
│   ├── Overview.js           # given — eager
│   ├── Reports.js            # given + nested Suspense
│   ├── Users.js              # given — NAMED export UsersPage
│   └── Settings.js           # given
├── App.js                    # lazy routes + Layout
└── index.js`,
  wireframe: `
+------------------+--------------------------------------------------------+
| Overview         | Reports                                                |
|[Reports] (active)| Loading chart...          ← nested fallback (800 ms)   |
| Users            |                                                        |
| Settings         |   …then: Jan ████ 120 · Feb █████ 150 · Mar ██████ 180  |
| Broken page      |                                                        |
| [Help]           | (switching pages: "Loading page..." for 600 ms here,   |
|                  |  the sidebar never disappears)                         |
+------------------+--------------------------------------------------------+`,
  moHinh: {
    ten: 'Lazy modules',
    truong: [
      ['Reports / Settings', 'default export', { en: 'lazyWithPreload(withDelay(() => import(…), 600))', vi: 'lazyWithPreload(withDelay(() => import(…), 600))' }],
      ['Users', 'named export UsersPage', { en: 'map to { default: m.UsersPage }', vi: 'đổi thành { default: m.UsersPage }' }],
      ['RevenueChart', 'default export', { en: 'lazy inside Reports, 800 ms', vi: 'lazy bên trong Reports, 800 ms' }],
      ['Broken', '—', { en: 'factory rejects: ChunkLoadError', vi: 'factory reject: ChunkLoadError' }],
      ['HelpPanel', 'default export', { en: 'lazy, only after #btn-help, 500 ms', vi: 'lazy, chỉ sau khi bấm #btn-help, 500 ms' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Lazy routes', vi: 'Route lazy' }, diem: 1.5,
      yeuCau: [{ en: 'Routes <code>/</code> (Overview, eager), <code>/reports</code>, <code>/users</code>, <code>/settings</code> (lazy, dynamic <code>import()</code>), <code>/broken</code>, all inside a layout route with the sidebar (<code>#nav-overview</code>, <code>#nav-reports</code>, <code>#nav-users</code>, <code>#nav-settings</code>, <code>#nav-broken</code>, <code>#btn-help</code>).', vi: 'Route <code>/</code> (Overview, tải ngay), <code>/reports</code>, <code>/users</code>, <code>/settings</code> (lazy, <code>import()</code> động), <code>/broken</code>, đều nằm trong route layout có thanh bên (<code>#nav-overview</code>, <code>#nav-reports</code>, <code>#nav-users</code>, <code>#nav-settings</code>, <code>#nav-broken</code>, <code>#btn-help</code>).' }],
      hook: ['React.lazy', 'import()'],
    },
    {
      ten: { en: 'Suspense in the layout', vi: 'Suspense trong layout' }, diem: 1.5,
      yeuCau: [{ en: '<code>&lt;Suspense fallback={&lt;p id="page-loading"&gt;Loading page...&lt;/p&gt;}&gt;</code> wraps the <code>&lt;Outlet /&gt;</code> only — the sidebar never disappears.', vi: '<code>&lt;Suspense fallback={&lt;p id="page-loading"&gt;Loading page...&lt;/p&gt;}&gt;</code> chỉ bọc <code>&lt;Outlet /&gt;</code> — thanh bên không bao giờ biến mất.' }],
      hook: ['Suspense', 'Outlet'],
    },
    {
      ten: { en: 'Simulated latency', vi: 'Giả lập độ trễ' }, diem: 1,
      yeuCau: [{ en: '<code>withDelay(factory, ms)</code> = <code>() =&gt; Promise.all([factory(), delay(ms)]).then(([m]) =&gt; m)</code>; pages wait 600 ms.', vi: '<code>withDelay(factory, ms)</code> = <code>() =&gt; Promise.all([factory(), delay(ms)]).then(([m]) =&gt; m)</code>; mỗi trang chờ 600 ms.' }],
    },
    {
      ten: { en: 'Nested Suspense', vi: 'Suspense lồng nhau' }, diem: 1.5,
      yeuCau: [{ en: 'In <code>Reports.js</code>: lazy <code>RevenueChart</code> (800 ms) inside its own Suspense (<code>#chart-loading</code> <code>Loading chart...</code>) — <code>#reports-title</code> is visible meanwhile.', vi: 'Trong <code>Reports.js</code>: <code>RevenueChart</code> lazy (800 ms) nằm trong Suspense riêng (<code>#chart-loading</code> <code>Loading chart...</code>) — <code>#reports-title</code> hiện trong lúc chờ.' }],
      viDu: { en: 'click Reports → 600 ms "Loading page..." → "Reports" + "Loading chart..." → 800 ms → chart', vi: 'bấm Reports → 600 ms "Loading page..." → "Reports" + "Loading chart..." → 800 ms → biểu đồ' },
    },
    {
      ten: { en: 'Error boundary', vi: 'Error Boundary' }, diem: 1.5,
      yeuCau: [{ en: 'Class <code>ErrorBoundary</code> (<code>getDerivedStateFromError</code>) around the Suspense, <code>key={location.pathname}</code>; failure shows <code>#chunk-error</code> <code>Could not load this page.</code> + link <code>#btn-home</code> to <code>/</code>.', vi: 'Class <code>ErrorBoundary</code> (<code>getDerivedStateFromError</code>) bọc ngoài Suspense, <code>key={location.pathname}</code>; lỗi thì hiện <code>#chunk-error</code> <code>Could not load this page.</code> + link <code>#btn-home</code> về <code>/</code>.' }],
      hook: ['getDerivedStateFromError', 'componentDidCatch'],
    },
    {
      ten: { en: 'Preload on hover / focus', vi: 'Tải trước khi rê chuột / focus' }, diem: 1,
      yeuCau: [{ en: '<code>lazyWithPreload(factory)</code> memoizes the promise and exposes <code>.preload()</code>; sidebar links call it on <code>onMouseEnter</code> and <code>onFocus</code> — a preloaded page shows with no fallback.', vi: '<code>lazyWithPreload(factory)</code> ghi nhớ promise và có <code>.preload()</code>; link thanh bên gọi nó ở <code>onMouseEnter</code> và <code>onFocus</code> — trang đã tải trước hiện ngay không qua fallback.' }],
    },
    {
      ten: { en: 'Named export', vi: 'Named export' }, diem: 1,
      yeuCau: [{ en: '<code>Users.js</code> only has <code>export function UsersPage</code>: lazy-load it with <code>.then((m) =&gt; ({ default: m.UsersPage }))</code>.', vi: '<code>Users.js</code> chỉ có <code>export function UsersPage</code>: lazy bằng <code>.then((m) =&gt; ({ default: m.UsersPage }))</code>.' }],
    },
    {
      ten: { en: 'On-demand help panel', vi: 'Khung Help tải theo yêu cầu' }, diem: 1,
      yeuCau: [{ en: 'Nothing is loaded at start. <code>#btn-help</code> renders lazy <code>HelpPanel</code> (500 ms, fallback <code>#help-loading</code>); <code>#btn-close-help</code> closes it.', vi: 'Lúc đầu không tải gì. <code>#btn-help</code> vẽ <code>HelpPanel</code> lazy (500 ms, fallback <code>#help-loading</code>); <code>#btn-close-help</code> đóng lại.' }],
    },
  ],
  idBatBuoc: [
    ['#nav-overview · #nav-reports · #nav-users · #nav-settings · #nav-broken · #btn-help', { en: 'sidebar', vi: 'thanh bên' }],
    ['#page-loading · #chart-loading · #help-loading', { en: 'fallbacks', vi: 'fallback' }],
    ['#overview-page · #reports-page · #reports-title · #chart · #users-page · #settings-page · #help-panel', { en: 'content (given)', vi: 'nội dung (đã cho)' }],
    ['#chunk-error · #btn-home', { en: 'error boundary', vi: 'error boundary' }],
  ],
  truDiem: [
    { en: 'One Suspense around the whole app — the sidebar flashes away on every navigation.', vi: 'Một Suspense bọc cả app — thanh bên chớp mất mỗi lần chuyển trang.' },
    { en: '<code>lazy(() =&gt; import(\'./pages/Users\'))</code> on a named export — "Element type is invalid".', vi: '<code>lazy(() =&gt; import(\'./pages/Users\'))</code> với named export — lỗi "Element type is invalid".' },
    { en: 'Declaring <code>lazy()</code> INSIDE a component — a new component every render, state lost and endless loading.', vi: 'Khai <code>lazy()</code> BÊN TRONG component — mỗi lần render một component mới, mất state và tải mãi.' },
    { en: 'No error boundary: a failed chunk blanks the whole screen.', vi: 'Không có error boundary: một chunk lỗi làm trắng cả màn hình.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-10-lab-lazy-dashboard',
  ten: 'Lab 10 — Admin Dashboard (lazy & Suspense)',
  khoa: KHOA,
  baiHoc: 'fer202-10-1-lazy-suspense',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 10 — Admin Dashboard (lazy routes · Suspense · Error Boundary · preload)', vi: 'Lab 10 — Bảng quản trị (route lazy · Suspense · Error Boundary · tải trước)' },
      doKho: 'HARD',
      phut: 90,
      diem: 100,
      khaiNiem: ['code splitting', 'React.lazy', 'dynamic import', 'Suspense', 'nested Suspense', 'Error Boundary', 'preloading', 'named export lazy'],
      tienQuyet: ['React Router (layout route, Outlet)', 'Promise', 'class component'],
      the: ['fer202', 'lab', 'lazy', 'suspense'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'code splitting', vi: 'tách mã thành nhiều gói tải riêng' },
        { en: 'chunk', vi: 'một gói mã được tải riêng' },
        { en: 'bundle', vi: 'gói mã JavaScript của ứng dụng' },
        { en: 'dynamic import', vi: 'import() — tải module lúc chạy, trả về Promise' },
        { en: 'error boundary', vi: 'component bắt lỗi của cây con và hiện giao diện dự phòng' },
        { en: 'preload', vi: 'tải trước, trước khi người dùng thật sự cần' },
        { en: 'latency', vi: 'độ trễ mạng' },
        ...tn('fallback', 'rubric'),
      ],
      goiY: [
        'Khai mọi lazy ở CẤP MODULE (ngoài component). Users: lazy(() => import("./pages/Users").then(m => ({ default: m.UsersPage }))).',
        'Layout route: <Route element={<Layout/>}> bọc các route con; trong Layout: <ErrorBoundary key={location.pathname}><Suspense fallback={…}><Outlet/></Suspense></ErrorBoundary>.',
        'lazyWithPreload: let p = null; const load = () => (p ??= factory()); const C = lazy(load); C.preload = load; return C.',
        'Help: {help && <Suspense fallback={<p id="help-loading">…</p>}><HelpPanel onClose={…} /></Suspense>}.',
      ],
      loiHayGap: [
        'Gọi <code>lazy()</code> trong thân component ⇒ mỗi lần render tạo component mới ⇒ fallback nháy mãi, mất state.',
        'Quên Suspense ⇒ lỗi "A component suspended while responding to synchronous input".',
        'Đặt Suspense ở ngoài <code>&lt;BrowserRouter&gt;</code>/cả App ⇒ navbar biến mất mỗi lần đổi trang.',
        'Error Boundary viết bằng function component (hook không bắt được lỗi render).',
        'Error Boundary không có <code>key</code> ⇒ đã lỗi một lần là trang nào cũng hiện lỗi.',
        'Preload gọi <code>import()</code> MỚI thay vì dùng lại promise của lazy ⇒ mở trang vẫn chờ lại.',
      ],
      moTaNgan: 'Lab chương 10: tách mã bảng quản trị — lazy theo route, Suspense trong layout, độ trễ giả, Suspense lồng, Error Boundary, tải trước khi rê/focus, named export, khung Help tải theo yêu cầu.',
      giaiThich: '<p>Mỗi trang là một <code>lazy</code> khai ở cấp module, bọc <code>withDelay</code> để thấy rõ fallback. Suspense đặt quanh <code>&lt;Outlet /&gt;</code> trong layout nên chỉ vùng nội dung chờ, thanh bên giữ nguyên. Reports có Suspense riêng cho biểu đồ — tiêu đề hiện trước. <code>ErrorBoundary</code> (class, <code>getDerivedStateFromError</code>) bắt chunk lỗi; <code>key={location.pathname}</code> tạo boundary mới mỗi khi đổi trang. <code>lazyWithPreload</code> ghi nhớ promise: link gọi <code>preload()</code> khi rê chuột/focus, lúc mở trang <code>lazy</code> dùng lại đúng promise đã xong nên không qua fallback.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom'], url: '/', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: '/' },
      thamKhao: 'https://react.dev/reference/react/lazy',
    },
  ],
});
