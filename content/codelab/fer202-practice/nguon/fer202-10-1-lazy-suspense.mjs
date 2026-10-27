/**
 * FER202 · 10.1 — Code splitting: React.lazy + Suspense (bài luyện).
 * Dễ → khó: lazy một component theo yêu cầu → lazy theo route, Suspense trong layout → named export →
 * Error Boundary + "Try again" khi chunk tải hỏng.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms) => ({ hanhDong: 'cho', ms });
const R = { router: true };

const DELAY = `// src/utils/withDelay.js (cho sẵn) — giả lập mạng chậm để THẤY fallback (máy cục bộ tải quá nhanh)
export const withDelay = (factory, ms) => () =>
  Promise.all([factory(), new Promise((r) => setTimeout(r, ms))]).then(([module]) => module);
`;

export default doiDau({
  slug: 'fer202-10-1-lazy-suspense',
  ten: '10.1 Lazy loading & Suspense',
  khoa: KHOA,
  baiHoc: 'fer202-10-1-lazy-suspense',
  de: [
    reactNho({
      tieuDe: 'Load a heavy component only when needed',
      doKho: 'EASY', phut: 10,
      them: {
        'src/utils/withDelay.js': DELAY,
        'src/components/BigChart.js': `// src/components/BigChart.js (cho sẵn) — giả sử import một thư viện biểu đồ nặng 300 KB
export default function BigChart() {
  return <div id="chart">📈 Revenue chart (heavy library)</div>;
}
`,
      },
      khaiNiem: ['React.lazy', 'dynamic import()', 'Suspense fallback'], the: ['lazy', 'Suspense'],
      moTa: {
        en: '<p>The chart library is heavy but only some users open the chart. Load <code>BigChart</code> with <code>React.lazy(() =&gt; import(…))</code> so it lives in its own chunk, and show a fallback while it loads. Use the given <code>withDelay(factory, 600)</code> to simulate a slow network.</p>',
        vi: '<p>Thư viện biểu đồ nặng nhưng chỉ một số người mở biểu đồ. Tải <code>BigChart</code> bằng <code>React.lazy(() =&gt; import(…))</code> để nó nằm ở chunk riêng, và hiện fallback trong lúc tải. Dùng <code>withDelay(factory, 600)</code> có sẵn để giả lập mạng chậm.</p>',
      },
      yeuCau: [
        { en: '<code>#btn-chart</code> toggles the chart (<code>Show chart</code> / <code>Hide chart</code>). While loading: <code>#chart-loading</code> <code>Loading chart...</code>.', vi: '<code>#btn-chart</code> bật/tắt biểu đồ (<code>Show chart</code> / <code>Hide chart</code>). Đang tải: <code>#chart-loading</code> <code>Loading chart...</code>.' },
        { en: 'No static <code>import BigChart</code> anywhere — only the lazy one, declared at module top level.', vi: 'Không có <code>import BigChart</code> tĩnh ở đâu — chỉ có bản lazy, khai báo ở cấp đầu module.' },
      ],
      viDu: [{ input: 'click Show chart', output: 'Loading chart... → 📈 Revenue chart', explanation: 'The second time it is instant: the chunk is cached.|||Lần thứ hai hiện ngay: chunk đã được nhớ.' }],
      goiY: ["const BigChart = lazy(withDelay(() => import('./components/BigChart'), 600));", '<Suspense fallback={<p id="chart-loading">Loading chart...</p>}>{show && <BigChart />}</Suspense>'],
      loiHayGap: ['Gọi <code>lazy()</code> bên trong component ⇒ mỗi lần render tạo component mới, state bị xoá và tải lại.', 'Giữ dòng <code>import BigChart from …</code> ở đầu tệp ⇒ thư viện vẫn nằm trong bundle chính, lazy vô nghĩa.'],
      thuatNgu: [{ en: 'chunk', vi: 'một tệp JS tách riêng, tải khi cần' }, { en: 'code splitting', vi: 'chia mã thành nhiều phần tải theo nhu cầu' }],
      giaiThich: '<p><code>import()</code> động trả Promise của module; bundler (Vite/webpack) tách module đó thành chunk riêng. <code>lazy</code> biến Promise đó thành component; <code>Suspense</code> hiện fallback cho tới khi chunk về.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import BigChart from './components/BigChart';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button id="btn-chart" onClick={() => setShow(!show)}>Show chart</button>
      {show && <BigChart />}
    </div>
  );
}
`,
      giai: `// src/App.js — lazy ở cấp module + Suspense quanh chỗ dùng
import { Suspense, lazy, useState } from 'react';
import { withDelay } from './utils/withDelay';

const BigChart = lazy(withDelay(() => import('./components/BigChart'), 600));

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button id="btn-chart" type="button" onClick={() => setShow((s) => !s)}>{show ? 'Hide chart' : 'Show chart'}</button>
      <Suspense fallback={<p id="chart-loading">Loading chart...</p>}>
        {show && <BigChart />}
      </Suspense>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Fallback while loading', kiem: 'text', selector: '#chart-loading', giaTri: 'Loading chart...', truoc: [click('#btn-chart')] },
        { moTa: 'Chart appears after loading', kiem: 'ton-tai', selector: '#chart', truoc: [click('#btn-chart'), cho(900)] },
        { moTa: 'Not loaded before clicking', kiem: 'khong-ton-tai', selector: '#chart, #chart-loading' },
        { an: true, moTa: 'Button label toggles', kiem: 'text', selector: '#btn-chart', giaTri: 'Hide chart', truoc: [click('#btn-chart')] },
        { an: true, moTa: 'No static import of BigChart', kiem: 'ma-nguon', khop: 'import\\s+BigChart\\s+from', phuDinh: true },
        { an: true, moTa: 'lazy + dynamic import', kiem: 'ma-nguon', khop: 'lazy\\([\\s\\S]*import\\(\\s*[\'"]\\./components/BigChart' },
      ],
    }),
    reactNho({
      tieuDe: 'Lazy routes with Suspense inside the layout',
      doKho: 'MEDIUM', phut: 14, index: R,
      them: {
        'src/utils/withDelay.js': DELAY,
        'src/pages/Home.js': `// src/pages/Home.js (cho sẵn — trang chủ tải ngay)
export default function Home() { return <h1 id="home">Home</h1>; }
`,
        'src/pages/Reports.js': `// src/pages/Reports.js (cho sẵn)
export default function Reports() { return <h1 id="reports">Reports</h1>; }
`,
        'src/pages/Settings.js': `// src/pages/Settings.js (cho sẵn)
export default function Settings() { return <h1 id="settings">Settings</h1>; }
`,
      },
      khaiNiem: ['route-based splitting', 'Suspense placement', 'keeping the shell visible'], the: ['lazy', 'Suspense', 'router'],
      moTa: {
        en: '<p>Split by route: <code>Reports</code> and <code>Settings</code> are lazy, <code>Home</code> stays in the main bundle. Put <code>Suspense</code> <b>inside</b> the layout around the <code>Outlet</code>, so the navbar never disappears while a page chunk loads.</p>',
        vi: '<p>Chia theo route: <code>Reports</code> và <code>Settings</code> tải lười, <code>Home</code> nằm trong bundle chính. Đặt <code>Suspense</code> <b>bên trong</b> layout quanh <code>Outlet</code>, để navbar không bao giờ biến mất khi chunk của trang đang tải.</p>',
      },
      yeuCau: [
        { en: 'Layout: <code>#navbar</code> with NavLinks <code>#nav-home</code>, <code>#nav-reports</code>, <code>#nav-settings</code>; fallback <code>#page-loading</code> <code>Loading page...</code> inside <code>#page</code>.', vi: 'Layout: <code>#navbar</code> có NavLink <code>#nav-home</code>, <code>#nav-reports</code>, <code>#nav-settings</code>; fallback <code>#page-loading</code> <code>Loading page...</code> nằm trong <code>#page</code>.' },
        { en: 'Lazy pages use <code>withDelay(…, 600)</code>.', vi: 'Trang lười dùng <code>withDelay(…, 600)</code>.' },
      ],
      viDu: [{ input: 'click Reports', output: 'navbar stays · Loading page... → Reports', explanation: 'A Suspense ABOVE the layout would replace the whole screen with the fallback.|||Suspense đặt TRÊN layout sẽ thay cả màn hình bằng fallback.' }],
      goiY: ["const Reports = lazy(withDelay(() => import('./pages/Reports'), 600));", 'Layout: <nav …/><main id="page"><Suspense fallback={…}><Outlet /></Suspense></main>'],
      loiHayGap: ['Bọc Suspense quanh cả <code>&lt;Routes&gt;</code> ở App ⇒ navbar biến mất mỗi lần đổi trang.', 'Lazy luôn cả trang chủ ⇒ lần đầu vào thấy spinner không cần thiết.'],
      thuatNgu: [{ en: 'app shell', vi: 'khung app (navbar, sidebar) luôn hiện' }],
      giaiThich: '<p>Suspense hiện fallback ở chỗ GẦN NHẤT phía trên component đang chờ. Đặt nó quanh Outlet nghĩa là chỉ vùng nội dung chờ, khung app vẫn dùng được.</p>',
      dau: `// src/App.js — STARTER
import { Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Suspense fallback={<p id="page-loading">Loading page...</p>}>
      <nav id="navbar">
        <NavLink to="/" end id="nav-home">Home</NavLink>
        <NavLink to="/reports" id="nav-reports">Reports</NavLink>
        <NavLink to="/settings" id="nav-settings">Settings</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
`,
      giai: `// src/App.js — lazy theo route; Suspense quanh Outlet trong layout
import { Suspense, lazy } from 'react';
import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { withDelay } from './utils/withDelay';

const Reports = lazy(withDelay(() => import('./pages/Reports'), 600));
const Settings = lazy(withDelay(() => import('./pages/Settings'), 600));

function Layout() {
  return (
    <div>
      <nav id="navbar">
        <NavLink to="/" end id="nav-home">Home</NavLink>{' '}
        <NavLink to="/reports" id="nav-reports">Reports</NavLink>{' '}
        <NavLink to="/settings" id="nav-settings">Settings</NavLink>
      </nav>
      <main id="page">
        <Suspense fallback={<p id="page-loading">Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
`,
      kiem: [
        { moTa: 'Navbar stays while the page loads', kiem: 'danh-sach-text', selector: '#navbar, #page-loading', mongDoi: ['Home Reports Settings', 'Loading page...'], truoc: [click('#nav-reports')] },
        { moTa: 'Fallback is inside #page', kiem: 'ton-tai', selector: '#page #page-loading', truoc: [click('#nav-settings')] },
        { moTa: 'Page appears', kiem: 'ton-tai', selector: '#page #reports', truoc: [click('#nav-reports'), cho(900)] },
        { moTa: 'Home loads instantly', kiem: 'ton-tai', selector: '#home' },
        { an: true, moTa: 'Reports and Settings are lazy', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*lazy\\([\\s\\S]*import\\(\\s*[\'"]\\./pages/Reports)(?=[\\s\\S]*lazy\\([\\s\\S]*import\\(\\s*[\'"]\\./pages/Settings)' },
        { an: true, moTa: 'Home is not lazy', kiem: 'ma-nguon', khop: 'import\\(\\s*[\'"]\\./pages/Home', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Lazy-loading a named export',
      doKho: 'MEDIUM', phut: 10,
      them: {
        'src/utils/withDelay.js': DELAY,
        'src/components/editors.js': `// src/components/editors.js (cho sẵn) — module có NHIỀU export có tên, KHÔNG có default
export function MarkdownEditor() {
  return <textarea id="md-editor" defaultValue="# Hello" />;
}
export function CodeEditor() {
  return <pre id="code-editor">console.log('hi');</pre>;
}
`,
      },
      khaiNiem: ['lazy requires default export', 'mapping a named export', 'two components from one chunk'], the: ['lazy', 'Suspense'],
      moTa: {
        en: '<p><code>React.lazy</code> expects the module to have a <b>default</b> export. <code>editors.js</code> only has named exports (<code>MarkdownEditor</code>, <code>CodeEditor</code>). Map them: <code>import(…).then((m) =&gt; ({ default: m.MarkdownEditor }))</code>. A select chooses which editor to show.</p>',
        vi: '<p><code>React.lazy</code> cần module có export <b>default</b>. <code>editors.js</code> chỉ có export có tên (<code>MarkdownEditor</code>, <code>CodeEditor</code>). Ánh xạ lại: <code>import(…).then((m) =&gt; ({ default: m.MarkdownEditor }))</code>. Select chọn trình soạn thảo nào hiện.</p>',
      },
      yeuCau: [
        { en: '<code>#editor-type</code> select (<code>none</code> default, <code>markdown</code>, <code>code</code>). Fallback <code>#editor-loading</code> <code>Loading editor...</code>.', vi: 'Select <code>#editor-type</code> (<code>none</code> mặc định, <code>markdown</code>, <code>code</code>). Fallback <code>#editor-loading</code> <code>Loading editor...</code>.' },
        { en: 'Two lazy components from the same file, each with <code>withDelay(…, 500)</code>.', vi: 'Hai component lười từ cùng tệp, mỗi cái <code>withDelay(…, 500)</code>.' },
      ],
      viDu: [{ input: 'choose code', output: 'Loading editor... → console.log(\'hi\');', explanation: 'Without the mapping React throws: "Element type is invalid… got: undefined".|||Không ánh xạ thì React báo lỗi "Element type is invalid… got: undefined".' }],
      goiY: ["const CodeEditor = lazy(withDelay(() => import('./components/editors').then((m) => ({ default: m.CodeEditor })), 500));", 'Hai lazy cùng một tệp ⇒ bundler chỉ tạo MỘT chunk; lần tải thứ hai dùng lại.'],
      loiHayGap: ["<code>lazy(() =&gt; import('./components/editors'))</code> ⇒ module không có default, React báo lỗi kiểu phần tử.", 'Đổi tệp gốc sang export default chỉ để chiều lazy ⇒ phá chỗ khác đang import có tên.'],
      thuatNgu: [{ en: 'named export', vi: 'export có tên (export function X)' }],
      giaiThich: '<p>Hàm truyền vào <code>lazy</code> chỉ cần trả Promise của object có khoá <code>default</code> là component. <code>.then</code> cho phép tạo object đó từ bất kỳ export nào.</p>',
      dau: `// src/App.js — STARTER
import { Suspense, lazy, useState } from 'react';

const MarkdownEditor = lazy(() => import('./components/editors'));

export default function App() {
  const [type, setType] = useState('none');
  return (
    <div>
      <select id="editor-type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="none">None</option><option value="markdown">Markdown</option><option value="code">Code</option>
      </select>
      <Suspense fallback={<p id="editor-loading">Loading editor...</p>}>
        {type === 'markdown' && <MarkdownEditor />}
      </Suspense>
    </div>
  );
}
`,
      giai: `// src/App.js — lazy cho export có tên: ánh xạ về { default }
import { Suspense, lazy, useState } from 'react';
import { withDelay } from './utils/withDelay';

const MarkdownEditor = lazy(withDelay(() => import('./components/editors').then((m) => ({ default: m.MarkdownEditor })), 500));
const CodeEditor = lazy(withDelay(() => import('./components/editors').then((m) => ({ default: m.CodeEditor })), 500));

export default function App() {
  const [type, setType] = useState('none');
  return (
    <div>
      <select id="editor-type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="none">None</option>
        <option value="markdown">Markdown</option>
        <option value="code">Code</option>
      </select>
      <Suspense fallback={<p id="editor-loading">Loading editor...</p>}>
        {type === 'markdown' && <MarkdownEditor />}
        {type === 'code' && <CodeEditor />}
      </Suspense>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Markdown editor loads', kiem: 'ton-tai', selector: '#md-editor', truoc: [{ hanhDong: 'doi', selector: '#editor-type', giaTri: 'markdown' }, cho(800)] },
        { moTa: 'Code editor loads', kiem: 'text', selector: '#code-editor', giaTri: "console.log('hi');", truoc: [{ hanhDong: 'doi', selector: '#editor-type', giaTri: 'code' }, cho(800)] },
        { moTa: 'Fallback while loading', kiem: 'ton-tai', selector: '#editor-loading', truoc: [{ hanhDong: 'doi', selector: '#editor-type', giaTri: 'code' }] },
        { an: true, moTa: 'No JS errors', kiem: 'khong-loi-js', truoc: [{ hanhDong: 'doi', selector: '#editor-type', giaTri: 'markdown' }, cho(800)] },
        { an: true, moTa: 'Maps the named export to default', kiem: 'ma-nguon', khop: '\\.then\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>\\s*\\(\\s*\\{\\s*default\\s*:' },
      ],
    }),
    reactNho({
      tieuDe: 'Error Boundary with "Try again" for a failed chunk',
      doKho: 'HARD', phut: 20,
      them: {
        'src/api/loadReport.js': `// src/api/loadReport.js (cho sẵn) — giả lập mạng chập chờn: LẦN ĐẦU tải chunk hỏng, các lần sau thành công
let attempts = 0;

export function loadReport() {
  attempts += 1;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (attempts === 1) reject(new Error('ChunkLoadError: Loading chunk 3 failed'));
      else resolve(import('../components/Report'));
    }, 300);
  });
}
`,
        'src/components/Report.js': `// src/components/Report.js (cho sẵn)
export default function Report() {
  return <div id="report">Quarterly report</div>;
}
`,
      },
      khaiNiem: ['Error Boundary (class)', 'getDerivedStateFromError', 'lazy caches failures', 'retry'], the: ['lazy', 'error-boundary'],
      moTa: {
        en: '<p>Chunks can fail to download (offline, new deploy). Wrap the lazy <code>Report</code> in an <b>Error Boundary</b> — it must be a class component — that shows <code>Could not load the report.</code> and a <b>Try again</b> button. A rejected <code>lazy</code> remembers its failure, so retrying must create a NEW lazy component and reset the boundary.</p>',
        vi: '<p>Chunk có thể tải hỏng (mất mạng, vừa deploy bản mới). Bọc <code>Report</code> lười trong <b>Error Boundary</b> — bắt buộc là class component — hiện <code>Could not load the report.</code> và nút <b>Try again</b>. <code>lazy</code> đã thất bại thì nhớ luôn lỗi đó, nên thử lại phải tạo component lazy MỚI và reset boundary.</p>',
      },
      yeuCau: [
        { en: '<code>#btn-open</code> shows the report. Loading: <code>#report-loading</code>. Error: <code>#report-error</code> (text <code>Could not load the report.</code>) + <code>#btn-retry</code>.', vi: '<code>#btn-open</code> mở báo cáo. Đang tải: <code>#report-loading</code>. Lỗi: <code>#report-error</code> (chữ <code>Could not load the report.</code>) + <code>#btn-retry</code>.' },
        { en: 'The boundary accepts an <code>onRetry</code> prop; retrying shows the loading state again and then <code>#report</code>.', vi: 'Boundary nhận prop <code>onRetry</code>; thử lại thì hiện lại trạng thái tải rồi <code>#report</code>.' },
      ],
      viDu: [{ input: 'Open → (fails) → Try again', output: 'Loading... → Quarterly report', explanation: 'setReport(() => lazy(loadReport)) + a new key for the boundary.|||setReport(() => lazy(loadReport)) + key mới cho boundary.' }],
      goiY: ['class ReportBoundary extends Component { state = { error: null }; static getDerivedStateFromError(error) { return { error }; } render() { … } }', 'App: const [Report, setReport] = useState(() => lazy(loadReport)); const [attempt, setAttempt] = useState(0); retry = () => { setReport(() => lazy(loadReport)); setAttempt((a) => a + 1); } — <ReportBoundary key={attempt} …>'],
      loiHayGap: ['Viết boundary bằng function component + try/catch ⇒ không bắt được lỗi khi render; chỉ class có getDerivedStateFromError.', 'Chỉ reset state của boundary mà dùng lại lazy cũ ⇒ nó ném lại đúng lỗi cũ ngay lập tức.'],
      thuatNgu: [{ en: 'Error Boundary', vi: 'component bắt lỗi render của cây con và hiện giao diện dự phòng' }],
      giaiThich: '<p>Suspense xử lý trạng thái "đang chờ", Error Boundary xử lý trạng thái "hỏng". <code>lazy</code> lưu kết quả Promise (kể cả lỗi), nên muốn thử lại phải tạo lazy mới; đổi <code>key</code> của boundary để React dựng lại nó sạch lỗi.</p>',
      dau: `// src/App.js — STARTER
import { Suspense, lazy, useState } from 'react';
import { loadReport } from './api/loadReport';

const Report = lazy(loadReport);

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button id="btn-open" onClick={() => setOpen(true)}>Open report</button>
      {open && (
        <Suspense fallback={<p id="report-loading">Loading report...</p>}>
          <Report />
        </Suspense>
      )}
    </div>
  );
}
`,
      giai: `// src/App.js — Error Boundary (class) + thử lại bằng lazy mới và key mới
import { Component, Suspense, lazy, useState } from 'react';
import { loadReport } from './api/loadReport';

class ReportBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.warn('Report chunk failed:', error.message);
  }

  render() {
    if (this.state.error) {
      return (
        <div id="report-error">
          <p>Could not load the report.</p>
          <button id="btn-retry" type="button" onClick={this.props.onRetry}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [Report, setReport] = useState(() => lazy(loadReport));
  const [attempt, setAttempt] = useState(0);

  const retry = () => {
    setReport(() => lazy(loadReport)); // lazy mới ⇒ gọi lại loadReport
    setAttempt((a) => a + 1); // key mới ⇒ boundary sạch lỗi
  };

  return (
    <div>
      <button id="btn-open" type="button" onClick={() => setOpen(true)}>Open report</button>
      {open && (
        <ReportBoundary key={attempt} onRetry={retry}>
          <Suspense fallback={<p id="report-loading">Loading report...</p>}>
            <Report />
          </Suspense>
        </ReportBoundary>
      )}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'First load fails gracefully', kiem: 'text', selector: '#report-error p', giaTri: 'Could not load the report.', truoc: [click('#btn-open'), cho(600)] },
        { moTa: 'Try again shows loading', kiem: 'ton-tai', selector: '#report-loading', truoc: [click('#btn-open'), cho(600), click('#btn-retry')] },
        { moTa: 'Try again eventually shows the report', kiem: 'text', selector: '#report', giaTri: 'Quarterly report', truoc: [click('#btn-open'), cho(600), click('#btn-retry'), cho(700)] },
        { an: true, moTa: 'Loading first', kiem: 'ton-tai', selector: '#report-loading', truoc: [click('#btn-open')] },
        { an: true, moTa: 'Boundary is a class with getDerivedStateFromError', kiem: 'ma-nguon', khop: 'class\\s+\\w+\\s+extends\\s+(React\\.)?Component[\\s\\S]*static\\s+getDerivedStateFromError' },
      ],
    }),
  ],
});
