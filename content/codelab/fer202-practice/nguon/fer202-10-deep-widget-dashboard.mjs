/**
 * FER202 · Chương 10 — DEEP LAB: Widget Dashboard (code splitting chuyên sâu).
 * Sâu hơn Lab 10: sổ đăng ký widget tải lười theo cấu hình (chỉ tải khi người dùng thêm), Suspense + Error Boundary
 * RIÊNG cho từng widget (một widget hỏng không kéo sập trang), thử lại tạo lazy mới, bố cục lưu localStorage,
 * chuyển tab bằng useTransition (giữ trang cũ thay vì nháy fallback), tải trước khi rê chuột/focus.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f1f5f9; color: #0f172a; }
.tabs { display: flex; gap: 6px; margin-bottom: 12px; align-items: center; } .tabs button.active { background: #2563eb; color: #fff; }
#tab-pending { font-size: 13px; color: #b45309; }
.toolbar { display: flex; gap: 8px; margin: 12px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.widget { background: #fff; border-radius: 10px; padding: 12px; box-shadow: 0 1px 2px rgba(0,0,0,.08); position: relative; }
.widget h3 { margin: 0 0 8px; font-size: 15px; } .widget .remove { position: absolute; top: 8px; right: 8px; }
.skeleton { height: 48px; border-radius: 6px; background: linear-gradient(90deg, #e2e8f0, #f8fafc, #e2e8f0); color: #64748b; padding: 4px; }
.widget-error { color: #b91c1c; }
`;

const DELAY = `// src/lazy/helpers.js — giả lập mạng chậm + lazy có preload (dùng chung một promise)
import { lazy } from 'react';

export const withDelay = (factory, ms) => () =>
  Promise.all([factory(), new Promise((r) => setTimeout(r, ms))]).then(([m]) => m);

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

const REGISTRY = `// src/widgets/registry.js — SỔ ĐĂNG KÝ: mỗi widget khai báo cách tải; component lazy tạo khi cần và được nhớ
import { lazy } from 'react';
import { withDelay } from '../lazy/helpers';

let stocksAttempts = 0; // giả lập mạng chập chờn: lần tải đầu của Stocks hỏng

export const REGISTRY = [
  { id: 'weather', title: 'Weather', load: withDelay(() => import('./Weather'), 500) },
  { id: 'todo', title: 'Todo', load: withDelay(() => import('./Todo'), 500) },
  {
    id: 'stocks',
    title: 'Stocks',
    load: () => {
      stocksAttempts += 1;
      if (stocksAttempts === 1) {
        return new Promise((_, reject) => setTimeout(() => reject(new Error('ChunkLoadError: stocks')), 300));
      }
      return withDelay(() => import('./Stocks'), 300)();
    },
  },
];

const cache = new Map(); // "id:attempt" ⇒ component lazy (tạo MỘT lần cho mỗi lần thử)

export function getWidget(id, attempt = 0) {
  const key = ´@{id}:@{attempt}´;
  if (!cache.has(key)) {
    const entry = REGISTRY.find((w) => w.id === id);
    cache.set(key, lazy(entry.load));
  }
  return cache.get(key);
}
`;

const WEATHER = `// src/widgets/Weather.js — widget tự tải dữ liệu khi được gắn
import { useEffect, useState } from 'react';

export default function Weather() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('http://localhost:9999/weather').then((r) => r.json()).then(setData);
  }, []);
  return <p className="weather">{data ? ´@{data.city} @{data.temp}°C´ : '…'}</p>;
}
`;
const TODO = `// src/widgets/Todo.js
export default function Todo() {
  return (
    <ul className="todo">
      <li>Review PR #42</li>
      <li>Write tests</li>
    </ul>
  );
}
`;
const STOCKS = `// src/widgets/Stocks.js
export default function Stocks() {
  return <p className="stocks">VNM 70,000 ▲</p>;
}
`;

const BOUNDARY = `// src/components/WidgetBoundary.js — Error Boundary (class) cho TỪNG widget
import { Component } from 'react';

export default class WidgetBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="widget-error">
          <p>Could not load {this.props.title}</p>
          <button type="button" className="retry" onClick={this.props.onRetry}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

const DASHBOARD = `// src/components/Dashboard.js — bố cục widget lưu localStorage; mỗi widget có Suspense + boundary riêng
import { Suspense, useEffect, useState } from 'react';
import { REGISTRY, getWidget } from '../widgets/registry';
import WidgetBoundary from './WidgetBoundary';

function readLayout() {
  try {
    const ids = JSON.parse(localStorage.getItem('layout'));
    return Array.isArray(ids) ? ids.filter((id) => REGISTRY.some((w) => w.id === id)) : ['todo'];
  } catch {
    return ['todo'];
  }
}

export default function Dashboard() {
  const [layout, setLayout] = useState(readLayout);
  const [attempts, setAttempts] = useState({}); // id ⇒ số lần thử lại

  useEffect(() => {
    localStorage.setItem('layout', JSON.stringify(layout));
  }, [layout]);

  const add = (id) => setLayout((l) => (l.includes(id) ? l : [...l, id]));
  const remove = (id) => setLayout((l) => l.filter((x) => x !== id));
  const retry = (id) => setAttempts((a) => ({ ...a, [id]: (a[id] ?? 0) + 1 }));

  return (
    <section>
      <div className="toolbar">
        {REGISTRY.map((w) => (
          <button key={w.id} id={´add-@{w.id}´} type="button" disabled={layout.includes(w.id)} onClick={() => add(w.id)}>+ {w.title}</button>
        ))}
      </div>
      <div className="grid" id="widgets">
        {layout.map((id) => {
          const meta = REGISTRY.find((w) => w.id === id);
          const attempt = attempts[id] ?? 0;
          const Widget = getWidget(id, attempt);
          return (
            <div key={id} className="widget" data-id={id}>
              <h3>{meta.title}</h3>
              <button type="button" className="remove" aria-label={´Remove @{meta.title}´} onClick={() => remove(id)}>×</button>
              <WidgetBoundary key={attempt} title={meta.title} onRetry={() => retry(id)}>
                <Suspense fallback={<div className="skeleton">Loading {meta.title}…</div>}>
                  <Widget />
                </Suspense>
              </WidgetBoundary>
            </div>
          );
        })}
      </div>
    </section>
  );
}
`;

const PAGES_FILES = {
  'src/pages/Overview.js': `// src/pages/Overview.js
import Dashboard from '../components/Dashboard';

export default function Overview() {
  return (
    <div id="overview-page">
      <h2>Overview</h2>
      <Dashboard />
    </div>
  );
}
`,
  'src/pages/Analytics.js': `// src/pages/Analytics.js
export default function Analytics() {
  return <div id="analytics-page"><h2>Analytics</h2><p>Visitors this week: 12,480</p></div>;
}
`,
  'src/pages/Settings.js': `// src/pages/Settings.js
export default function Settings() {
  return <div id="settings-page"><h2>Settings</h2><p>Theme: light</p></div>;
}
`,
};

const APP = `// src/App.js — tab tải lười; đổi tab trong startTransition để GIỮ trang cũ thay vì hiện fallback
import { Suspense, useState, useTransition } from 'react';
import { lazyWithPreload, withDelay } from './lazy/helpers';

const PAGES = {
  overview: { label: 'Overview', Component: lazyWithPreload(withDelay(() => import('./pages/Overview'), 600)) },
  analytics: { label: 'Analytics', Component: lazyWithPreload(withDelay(() => import('./pages/Analytics'), 600)) },
  settings: { label: 'Settings', Component: lazyWithPreload(withDelay(() => import('./pages/Settings'), 600)) },
};

export default function App() {
  const [tab, setTab] = useState('overview');
  const [isPending, startTransition] = useTransition();
  const Page = PAGES[tab].Component;

  return (
    <main>
      <h1>CT Widgets</h1>
      <nav className="tabs">
        {Object.entries(PAGES).map(([key, p]) => (
          <button
            key={key}
            id={´tab-@{key}´}
            type="button"
            className={key === tab ? 'active' : ''}
            onMouseEnter={p.Component.preload}
            onFocus={p.Component.preload}
            onClick={() => startTransition(() => setTab(key))}
          >
            {p.label}
          </button>
        ))}
        {isPending && <span id="tab-pending">Loading tab…</span>}
      </nav>
      <Suspense fallback={<p id="page-fallback">Loading page…</p>}>
        <Page />
      </Suspense>
    </main>
  );
}
`;

const S_APP = `// src/App.js — STARTER: import tĩnh mọi thứ, không Suspense, không lưu bố cục
import { useState } from 'react';
import Weather from './widgets/Weather';
import Todo from './widgets/Todo';

export default function App() {
  const [tab, setTab] = useState('overview');
  return (
    <main>
      <h1>CT Widgets</h1>
      <button id="tab-overview" onClick={() => setTab('overview')}>Overview</button>
      <button id="tab-analytics" onClick={() => setTab('analytics')}>Analytics</button>
      {tab === 'overview' && <div id="overview-page"><Weather /><Todo /></div>}
    </main>
  );
}
`;
const stub = (p, mo) => `// ${p} — STARTER
// ${mo}
export {};
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = {
  'src/index.js': INDEX, 'src/index.css': CSS, 'src/lazy/helpers.js': DELAY,
  'src/widgets/Weather.js': WEATHER, 'src/widgets/Todo.js': TODO, 'src/widgets/Stocks.js': STOCKS, ...PAGES_FILES,
};
const LOI_GIAI = {
  'src/App.js': APP, 'src/widgets/registry.js': REGISTRY, 'src/components/WidgetBoundary.js': BOUNDARY, 'src/components/Dashboard.js': DASHBOARD, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/widgets/registry.js': stub('src/widgets/registry.js', 'REGISTRY [{ id, title, load }] (stocks: lần đầu hỏng) + getWidget(id, attempt) nhớ component lazy'),
  'src/components/WidgetBoundary.js': stub('src/components/WidgetBoundary.js', 'class Error Boundary: .widget-error "Could not load Stocks" + .retry'),
  'src/components/Dashboard.js': `// src/components/Dashboard.js — STARTER
export default function Dashboard() {
  return null;
}
`,
  ...CHUNG,
};

const OPEN = cho(900); // trang Overview (600 ms) + widget mặc định (500 ms) đã tải xong
const KIEM = [
  // f1 registry & lazy
  { nhom: 'f1', moTa: 'Default layout shows the Todo widget', kiem: 'danh-sach-text', selector: '.widget h3', mongDoi: ['Todo'], truoc: [cho(1400)] },
  { nhom: 'f1', moTa: 'Adding a widget lazy-loads it', kiem: 'danh-sach-text', selector: '.widget[data-id="weather"] .weather', mongDoi: ['Hue 31°C'], truoc: [OPEN, click('#add-weather'), cho(900)] },
  { nhom: 'f1', an: true, moTa: 'Widgets come from a registry with load functions', kiem: 'ma-nguon', tep: 'src/widgets/registry.js', khop: 'REGISTRY\\s*=\\s*\\[[\\s\\S]*load\\s*:[\\s\\S]*import\\(' },
  { nhom: 'f1', an: true, moTa: 'Lazy components are cached (not created during render)', kiem: 'ma-nguon', tep: 'src/widgets/registry.js', khop: 'new Map\\([\\s\\S]*lazy\\(' },
  // f2 layout persistence
  { nhom: 'f2', moTa: 'Layout saved in localStorage "layout"', kiem: 'kho-cuc-bo', khoa: 'layout', khop: '^\\["todo","weather"\\]$', truoc: [OPEN, click('#add-weather')] },
  { nhom: 'f2', moTa: 'Layout restored after reload', kiem: 'danh-sach-text', selector: '.widget h3', mongDoi: ['Todo', 'Weather'], truoc: [OPEN, click('#add-weather'), { hanhDong: 'tai-lai' }, cho(1400)] },
  { nhom: 'f2', moTa: 'Remove a widget', kiem: 'danh-sach-text', selector: '.widget h3', mongDoi: ['Weather'], truoc: [OPEN, click('#add-weather'), click('.widget[data-id="todo"] .remove')] },
  { nhom: 'f2', an: true, moTa: 'Add button disabled when the widget is on the board', kiem: 'thuoc-tinh-js', selector: '#add-todo', thuocTinh: 'disabled', giaTri: true, truoc: [OPEN] },
  { nhom: 'f2', an: true, moTa: 'Corrupted layout falls back to the default', khoCucBo: { layout: '{bad' }, kiem: 'danh-sach-text', selector: '.widget h3', mongDoi: ['Todo'], truoc: [cho(1400)] },
  // f3 per-widget suspense
  { nhom: 'f3', moTa: 'A loading widget shows its own skeleton', kiem: 'text', selector: '.widget[data-id="weather"] .skeleton', giaTri: 'Loading Weather…', truoc: [OPEN, click('#add-weather')] },
  { nhom: 'f3', moTa: 'Other widgets stay visible meanwhile', kiem: 'so-luong', selector: '.widget[data-id="todo"] .todo li', giaTri: 2, truoc: [OPEN, click('#add-weather')] },
  // f4 error boundary per widget
  { nhom: 'f4', moTa: 'Failed widget shows an error in its own card', kiem: 'danh-sach-text', selector: '.widget[data-id="stocks"] .widget-error p, .widget[data-id="todo"] .todo li', mongDoi: ['Review PR #42', 'Write tests', 'Could not load Stocks'], truoc: [OPEN, click('#add-stocks'), cho(600)] },
  { nhom: 'f4', moTa: 'Retry loads it', kiem: 'text', selector: '.widget[data-id="stocks"] .stocks', giaTri: 'VNM 70,000 ▲', truoc: [OPEN, click('#add-stocks'), cho(600), click('.widget[data-id="stocks"] .retry'), cho(700)] },
  { nhom: 'f4', an: true, moTa: 'Boundary is a class with getDerivedStateFromError', kiem: 'ma-nguon', tep: 'src/components/WidgetBoundary.js', khop: 'class\\s+\\w+\\s+extends\\s+(React\\.)?Component[\\s\\S]*getDerivedStateFromError' },
  // f5 loaded only when needed
  { nhom: 'f5', moTa: 'Weather data not requested before the widget is added', kiem: 'goi-fetch', khop: '/weather', min: 0, max: 0, truoc: [cho(1400)] },
  { nhom: 'f5', an: true, moTa: 'Requested once after adding', kiem: 'goi-fetch', khop: '/weather', min: 1, max: 1, truoc: [OPEN, click('#add-weather'), cho(900)] },
  // f6 transition
  { nhom: 'f6', moTa: 'First load shows the page fallback', kiem: 'ton-tai', selector: '#page-fallback' },
  { nhom: 'f6', moTa: 'Switching tabs keeps the old page and shows a pending hint', kiem: 'danh-sach-text', selector: '#tab-pending, #overview-page h2, #page-fallback', mongDoi: ['Loading tab…', 'Overview'], truoc: [cho(1400), click('#tab-analytics')] },
  { nhom: 'f6', moTa: 'New page appears after loading', kiem: 'ton-tai', selector: '#analytics-page', truoc: [cho(1400), click('#tab-analytics'), cho(900)] },
  { nhom: 'f6', an: true, moTa: 'Uses useTransition', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'useTransition\\(\\)[\\s\\S]*startTransition\\(' },
  // f7 preload
  { nhom: 'f7', moTa: 'Preloaded tab opens without pending', kiem: 'danh-sach-text', selector: '#tab-pending, #settings-page h2', mongDoi: ['Settings'], truoc: [cho(1400), { hanhDong: 'focus', selector: '#tab-settings' }, cho(900), click('#tab-settings')] },
  { nhom: 'f7', an: true, moTa: 'preload wired to hover and focus', kiem: 'ma-nguon', tep: 'src/App.js', khop: '^(?=[\\s\\S]*onMouseEnter=\\{[^}]*preload)(?=[\\s\\S]*onFocus=\\{[^}]*preload)' },
  // f8 structure
  { nhom: 'f8', moTa: 'No static import of widgets or pages in App/Dashboard', kiem: 'ma-nguon', khop: 'import\\s+\\w+\\s+from\\s+[\'"]\\.(\\.)?/(widgets/(Weather|Todo|Stocks)|pages/\\w+)[\'"]', phuDinh: true, tep: 'src/App.js' },
  { nhom: 'f8', an: true, moTa: 'Dashboard does not import widgets statically', kiem: 'ma-nguon', tep: 'src/components/Dashboard.js', khop: 'from\\s+[\'"]\\.\\./widgets/(Weather|Todo|Stocks)', phuDinh: true },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 10: Widget Dashboard — code splitting in depth', vi: 'DEEP LAB 10: Bảng widget — chia mã chuyên sâu' },
  phu: { en: 'FER202 · Chapter 10 (deep) · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 10 (chuyên sâu) · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>A customisable dashboard where users add widgets from a catalogue. Widget code must download only when a widget is added, each widget gets its <b>own</b> loading skeleton and error boundary (one broken widget must not break the page), the layout is remembered, and switching between lazily loaded tabs uses <code>useTransition</code> so the current page stays visible instead of flashing a fallback. Tabs preload on hover/focus.</p>',
    vi: '<p>Bảng điều khiển tuỳ biến, người dùng thêm widget từ danh mục. Mã của widget chỉ được tải khi widget được thêm, mỗi widget có khung chờ và error boundary <b>riêng</b> (một widget hỏng không làm hỏng trang), bố cục được ghi nhớ, và chuyển giữa các tab tải lười dùng <code>useTransition</code> để trang hiện tại vẫn hiện thay vì nháy fallback. Tab được tải trước khi rê chuột/focus.</p>',
  },
  chucNangChinh: [{ en: 'Widget registry · persisted layout · per-widget Suspense & error boundary with retry · lazy data · transitions between tabs · preload.', vi: 'Sổ đăng ký widget · bố cục lưu lại · Suspense & error boundary từng widget có thử lại · dữ liệu tải lười · chuyển tab bằng transition · tải trước.' }],
  yeuCauChung: [
    { en: 'Widgets and pages are never imported statically from <code>App.js</code> or <code>Dashboard.js</code>; lazy components are created once (module level or a cache), never during render.', vi: 'Widget và trang không bao giờ được import tĩnh trong <code>App.js</code> hay <code>Dashboard.js</code>; component lazy được tạo một lần (cấp module hoặc cache), không tạo trong lúc render.' },
    { en: 'Given: <code>lazy/helpers.js</code> (<code>withDelay</code>, <code>lazyWithPreload</code>), the widgets and pages. json-server serves <code>GET /weather</code>.', vi: 'Có sẵn: <code>lazy/helpers.js</code> (<code>withDelay</code>, <code>lazyWithPreload</code>), các widget và trang. json-server phục vụ <code>GET /weather</code>.' },
  ],
  cayThuMuc: `
src/
├── lazy/helpers.js            # withDelay · lazyWithPreload (given)
├── widgets/
│   ├── registry.js            # REGISTRY + getWidget(id, attempt)
│   ├── Weather.js · Todo.js · Stocks.js   (given)
├── components/
│   ├── WidgetBoundary.js      # class error boundary + Retry
│   └── Dashboard.js           # layout, add/remove, per-widget Suspense
├── pages/Overview.js · Analytics.js · Settings.js   (given)
├── App.js                     # tabs + useTransition + preload
└── index.css (given)`,
  wireframe: `
+-----------------------------------------------------------------+
| CT Widgets                                                       |
| [Overview] [Analytics] [Settings]   Loading tab…                 |
| Overview                                                         |
| [+ Weather] [+ Todo (disabled)] [+ Stocks]                       |
| +-----------+  +-----------------+  +--------------------+       |
| | Todo    × |  | Weather       × |  | Stocks           × |       |
| | • Review… |  | ░░ Loading…  ░░ |  | Could not load     |       |
| | • Write…  |  |                 |  | Stocks   [Retry]   |       |
| +-----------+  +-----------------+  +--------------------+       |
+-----------------------------------------------------------------+`,
  moHinh: {
    ten: 'Registry & state',
    truong: [
      ['REGISTRY[i]', '{ id, title, load: () => Promise<module> }', { en: 'stocks fails on the first load', vi: 'stocks hỏng lần tải đầu' }],
      ['layout', 'string[] (widget ids)', { en: 'localStorage "layout", default ["todo"]', vi: 'localStorage "layout", mặc định ["todo"]' }],
      ['attempts', '{ [id]: number }', { en: 'new lazy + new boundary key on retry', vi: 'lazy mới + key boundary mới khi thử lại' }],
      ['tab', "'overview' | 'analytics' | 'settings'", { en: 'changed inside startTransition', vi: 'đổi trong startTransition' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Widget registry', vi: 'Sổ đăng ký widget' }, diem: 1.5, yeuCau: [{ en: '<code>REGISTRY</code> of <code>{ id, title, load }</code>; <code>getWidget(id, attempt)</code> returns a cached <code>lazy(load)</code>. Toolbar <code>#add-weather|todo|stocks</code>; cards <code>.widget[data-id]</code> with <code>h3</code> and <code>.remove</code>.', vi: '<code>REGISTRY</code> gồm <code>{ id, title, load }</code>; <code>getWidget(id, attempt)</code> trả <code>lazy(load)</code> đã được nhớ. Thanh công cụ <code>#add-weather|todo|stocks</code>; thẻ <code>.widget[data-id]</code> có <code>h3</code> và <code>.remove</code>.' }] },
    { ten: { en: 'Persisted layout', vi: 'Bố cục được lưu' }, diem: 1.5, yeuCau: [{ en: 'Layout = array of ids in localStorage <code>layout</code> (default <code>["todo"]</code>, corrupted ⇒ default); add (button disabled when present) and remove.', vi: 'Bố cục = mảng id trong localStorage <code>layout</code> (mặc định <code>["todo"]</code>, hỏng ⇒ mặc định); thêm (nút vô hiệu khi đã có) và xoá.' }], viDu: { en: 'add Weather ⇒ layout ["todo","weather"] ⇒ reload keeps both', vi: 'thêm Weather ⇒ layout ["todo","weather"] ⇒ tải lại vẫn còn cả hai' } },
    { ten: { en: 'Per-widget Suspense', vi: 'Suspense từng widget' }, diem: 1, yeuCau: [{ en: 'Each card wraps its widget in its own <code>Suspense</code> with <code>.skeleton</code> <code>Loading Weather…</code>; other cards stay visible.', vi: 'Mỗi thẻ bọc widget trong <code>Suspense</code> riêng với <code>.skeleton</code> <code>Loading Weather…</code>; thẻ khác vẫn hiện.' }] },
    { ten: { en: 'Per-widget error boundary', vi: 'Error boundary từng widget' }, diem: 1.5, yeuCau: [{ en: 'Class <code>WidgetBoundary</code> shows <code>.widget-error</code> <code>Could not load Stocks</code> + <code>.retry</code>; retry increments the attempt ⇒ new lazy component + new boundary key ⇒ the widget loads.', vi: 'Class <code>WidgetBoundary</code> hiện <code>.widget-error</code> <code>Could not load Stocks</code> + <code>.retry</code>; thử lại tăng attempt ⇒ component lazy mới + key boundary mới ⇒ widget tải được.' }] },
    { ten: { en: 'Load only when needed', vi: 'Chỉ tải khi cần' }, diem: 1, yeuCau: [{ en: 'Weather\'s code and its <code>GET /weather</code> run only after the widget is added.', vi: 'Mã của Weather và <code>GET /weather</code> chỉ chạy sau khi widget được thêm.' }] },
    { ten: { en: 'Tabs with useTransition', vi: 'Tab với useTransition' }, diem: 1.5, yeuCau: [{ en: 'Three lazy pages; the first load shows <code>#page-fallback</code>. Switching runs <code>setTab</code> inside <code>startTransition</code>: the current page stays, <code>#tab-pending</code> <code>Loading tab…</code> shows, no fallback flash.', vi: 'Ba trang tải lười; lần đầu hiện <code>#page-fallback</code>. Đổi tab chạy <code>setTab</code> trong <code>startTransition</code>: trang hiện tại vẫn giữ, hiện <code>#tab-pending</code> <code>Loading tab…</code>, không nháy fallback.' }] },
    { ten: { en: 'Preload tabs', vi: 'Tải trước tab' }, diem: 1, yeuCau: [{ en: '<code>#tab-overview|analytics|settings</code> call <code>Component.preload</code> on mouse enter and focus; a preloaded tab opens without the pending hint.', vi: '<code>#tab-overview|analytics|settings</code> gọi <code>Component.preload</code> khi rê chuột và focus; tab đã tải trước mở ngay không có dòng chờ.' }] },
    { ten: { en: 'Splitting discipline', vi: 'Kỷ luật chia mã' }, diem: 1, yeuCau: [{ en: 'No static imports of widgets/pages in <code>App.js</code>/<code>Dashboard.js</code>.', vi: 'Không import tĩnh widget/trang trong <code>App.js</code>/<code>Dashboard.js</code>.' }] },
  ],
  idBatBuoc: [
    ['#tab-overview · #tab-analytics · #tab-settings · #tab-pending · #page-fallback', { en: 'tabs', vi: 'tab' }],
    ['#overview-page · #analytics-page · #settings-page', { en: 'pages (given)', vi: 'trang (có sẵn)' }],
    ['#add-weather · #add-todo · #add-stocks · #widgets', { en: 'toolbar', vi: 'thanh công cụ' }],
    ['.widget[data-id] h3 · .remove · .skeleton · .widget-error · .retry', { en: 'widget card', vi: 'thẻ widget' }],
  ],
  truDiem: [
    { en: 'One Suspense around the whole grid — adding a widget blanks every widget.', vi: 'Một Suspense bọc cả lưới — thêm một widget làm trắng mọi widget.' },
    { en: 'Calling <code>lazy()</code> inside <code>map</code> during render — widgets reload on every render.', vi: 'Gọi <code>lazy()</code> trong <code>map</code> lúc render — widget tải lại mỗi lần render.' },
    { en: 'Retry that reuses the failed lazy component (it remembers the rejection).', vi: 'Thử lại mà dùng lại component lazy đã hỏng (nó nhớ lỗi cũ).' },
    { en: 'Tab switch without a transition — the page flashes "Loading page…".', vi: 'Đổi tab không dùng transition — trang nháy "Loading page…".' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-10-deep-widget-dashboard',
  ten: 'Deep Lab 10 — Widget Dashboard (lazy registry · transitions)',
  khoa: KHOA,
  baiHoc: 'fer202-10-1-lazy-suspense',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 10 — Widget Dashboard (lazy registry · per-widget boundaries · useTransition · preload)', vi: 'Deep Lab 10 — Bảng widget (sổ đăng ký lười · boundary từng widget · useTransition · tải trước)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['configuration-driven lazy loading', 'Suspense granularity', 'error boundaries per region', 'retrying failed chunks', 'useTransition with Suspense', 'preloading', 'persisted layout'],
      tienQuyet: ['Lab 10 — Lazy dashboard', '10.1 Lazy loading & Suspense'],
      the: ['fer202', 'deep-lab', 'lazy', 'suspense', 'transitions'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'registry', vi: 'sổ đăng ký: danh sách mô tả các thành phần có thể nạp' },
        { en: 'Suspense granularity', vi: 'độ mịn của Suspense: bọc to hay nhỏ' },
        { en: 'transition', vi: 'cập nhật "không gấp" — React giữ giao diện cũ trong lúc chờ' },
        { en: 'skeleton', vi: 'khung xương giả hình nội dung khi đang tải' },
        ...tn('rubric', 'persist'),
      ],
      goiY: [
        'getWidget(id, attempt): khoá cache = "id:attempt"; chưa có ⇒ cache.set(key, lazy(entry.load)).',
        'Mỗi thẻ: <WidgetBoundary key={attempt} onRetry={…}><Suspense fallback={<div className="skeleton">…</div>}><Widget/></Suspense></WidgetBoundary>.',
        'const [isPending, startTransition] = useTransition(); onClick={() => startTransition(() => setTab(key))}.',
        'Bố cục: useState(readLayout) đọc localStorage có try/catch; useEffect ghi lại khi layout đổi.',
      ],
      loiHayGap: [
        'Đặt Suspense NGOÀI WidgetBoundary và boundary ngoài cùng ⇒ lỗi một widget xoá cả lưới.',
        'Retry chỉ reset state boundary mà không đổi component lazy ⇒ lỗi lặp lại ngay.',
        'Dùng <code>setTab</code> thường ⇒ Suspense gần nhất hiện fallback, mất trang cũ.',
        'Lưu cả object widget (có hàm) vào localStorage ⇒ JSON.stringify bỏ mất hàm.',
      ],
      moTaNgan: 'Deep lab chương 10: bảng widget — sổ đăng ký widget tải lười theo cấu hình, Suspense + error boundary riêng từng widget có thử lại, bố cục lưu localStorage, đổi tab bằng useTransition, tải trước khi hover/focus. Thang 10.',
      giaiThich: '<p>Chia mã tốt là chia theo <b>điều người dùng làm</b>: widget chưa được thêm thì mã của nó chưa bao giờ tải. Đặt Suspense và error boundary ở mức TỪNG widget giới hạn "vùng ảnh hưởng" của việc chờ và của lỗi. <code>lazy</code> nhớ kết quả promise kể cả khi hỏng, nên thử lại cần component lazy mới (khoá cache theo lần thử) và boundary mới (đổi <code>key</code>). Với tab, <code>startTransition</code> đánh dấu việc đổi tab là không gấp: React giữ giao diện cũ cho tới khi trang mới sẵn sàng thay vì hiện fallback — trải nghiệm mượt hơn hẳn.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', jsonServer: { base: B, db: { weather: { city: 'Hue', temp: 31 } } }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators',
    },
  ],
});
