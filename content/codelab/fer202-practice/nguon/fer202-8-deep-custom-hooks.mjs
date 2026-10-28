/**
 * FER202 · Chương 8 — DEEP LAB: Custom Hooks Library + Crypto Watchlist (Hooks chuyên sâu).
 * Sâu hơn Lab 8: tự viết bộ custom hook dùng lại — useFetch (cache dùng chung + refetch + bỏ phản hồi cũ),
 * useDebounce, useInterval (ref giữ callback mới nhất, delay null = dừng), usePrevious, useLocalStorage,
 * useOnClickOutside — rồi ghép thành một ứng dụng chạy với json-server.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 250) => ({ hanhDong: 'cho', ms });
const B = 'http://localhost:9999';

const COINS = [
  { id: 1, symbol: 'BTC', name: 'Bitcoin', price: 68000 },
  { id: 2, symbol: 'ETH', name: 'Ethereum', price: 3500 },
  { id: 3, symbol: 'BNB', name: 'BNB', price: 590 },
  { id: 4, symbol: 'SOL', name: 'Solana', price: 150 },
  { id: 5, symbol: 'WBTC', name: 'Wrapped Bitcoin', price: 67900 },
];

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #0f172a; color: #e2e8f0; }
.card { background: #1e293b; border-radius: 12px; padding: 14px 18px; margin-bottom: 14px; }
.toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
input[type=text] { padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: inherit; }
.coin { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #334155; }
.fav-btn { background: none; border: 0; color: #64748b; font-size: 18px; cursor: pointer; } .fav-btn.fav { color: #facc15; }
.up { color: #4ade80; } .down { color: #f87171; }
.menu-wrap { position: relative; } #menu { position: absolute; top: 28px; left: 0; background: #334155; padding: 6px; border-radius: 8px; list-style: none; margin: 0; min-width: 140px; }
button { cursor: pointer; }
`;

const USE_FETCH = `// src/hooks/useFetch.js — GET có cache DÙNG CHUNG theo URL, refetch, và bỏ phản hồi cũ
import { useCallback, useEffect, useState } from 'react';

const cache = new Map(); // url ⇒ Promise<data> (hai component cùng URL dùng chung MỘT request)

function load(url, force) {
  if (force || !cache.has(url)) {
    const p = fetch(url).then((res) => {
      if (!res.ok) throw new Error(´HTTP @{res.status}´);
      return res.json();
    });
    cache.set(url, p);
    p.catch(() => cache.delete(url)); // lỗi thì không giữ trong cache
  }
  return cache.get(url);
}

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: Boolean(url), error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }
    let ignore = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    load(url, version > 0)
      .then((data) => { if (!ignore) setState({ data, loading: false, error: null }); })
      .catch((err) => { if (!ignore) setState({ data: null, loading: false, error: err.message }); });
    return () => { ignore = true; };
  }, [url, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, refetch };
}
`;

const USE_DEBOUNCE = `// src/hooks/useDebounce.js — giá trị "trễ": chỉ đổi khi value đứng yên delay ms
import { useEffect, useState } from 'react';

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
`;

const USE_INTERVAL = `// src/hooks/useInterval.js — setInterval theo kiểu khai báo; callback mới nhất luôn được gọi; delay null = dừng
import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback; // cập nhật mỗi render, KHÔNG khởi động lại interval
  }, [callback]);

  useEffect(() => {
    if (delay === null) return undefined;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
`;

const USE_PREVIOUS = `// src/hooks/usePrevious.js — giá trị của lần render trước
import { useEffect, useRef } from 'react';

export function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
`;

const USE_LS = `// src/hooks/useLocalStorage.js — giống useState nhưng còn sau khi tải lại
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
`;

const USE_OUTSIDE = `// src/hooks/useOnClickOutside.js — gọi handler khi bấm RA NGOÀI phần tử ref
import { useEffect, useRef } from 'react';

export function useOnClickOutside(ref, handler) {
  const saved = useRef(handler);
  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) saved.current(e);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [ref]);
}
`;

const APP = `// src/App.js — ghép các custom hook thành ứng dụng watchlist
import { useRef, useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { useDebounce } from './hooks/useDebounce';
import { useInterval } from './hooks/useInterval';
import { usePrevious } from './hooks/usePrevious';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useOnClickOutside } from './hooks/useOnClickOutside';

const API = 'http://localhost:9999/coins';
const usd = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Thanh tin dùng CÙNG URL với danh sách ⇒ cache ⇒ chỉ một request
function Ticker() {
  const { data } = useFetch(API);
  return <p id="ticker">{data ? data.map((c) => c.symbol).join(' · ') : '…'}</p>;
}

function PriceTracker() {
  const [price, setPrice] = useState(68000);
  const prev = usePrevious(price);
  const change = prev === undefined ? 0 : ((price - prev) / prev) * 100;
  return (
    <div className="card" id="tracker">
      <span id="btc-price">BTC {usd(price)}</span>{' '}
      <span id="price-change" className={change > 0 ? 'up' : change < 0 ? 'down' : ''}>
        {change === 0 ? '—' : ´@{change > 0 ? '▲' : '▼'} @{Math.abs(change).toFixed(2)}%´}
      </span>{' '}
      <button id="tick-up" type="button" onClick={() => setPrice((p) => Math.round(p * 1.01 * 100) / 100)}>+1%</button>{' '}
      <button id="tick-down" type="button" onClick={() => setPrice((p) => Math.round(p * 0.98 * 100) / 100)}>−2%</button>
    </div>
  );
}

function Menu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  return (
    <div className="menu-wrap" ref={ref}>
      <button id="menu-btn" type="button" onClick={() => setOpen((o) => !o)}>Sort ▾</button>
      {open && (
        <ul id="menu">
          <li><button id="menu-name" type="button">By name</button></li>
          <li><button id="menu-price" type="button">By price</button></li>
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const q = useDebounce(query.trim(), 400);
  const url = q ? ´@{API}?q=@{encodeURIComponent(q)}´ : API;
  const { data, loading, error, refetch } = useFetch(url);
  const [auto, setAuto] = useState(false);
  const [refreshes, setRefreshes] = useState(0);
  const [favs, setFavs] = useLocalStorage('favs', []);

  useInterval(() => {
    refetch();
    setRefreshes((n) => n + 1);
  }, auto ? 1000 : null);

  const toggleFav = (symbol) =>
    setFavs((list) => (list.includes(symbol) ? list.filter((s) => s !== symbol) : [...list, symbol]));

  return (
    <main>
      <h1 id="title">Crypto Watchlist</h1>
      <Ticker />
      <div className="card toolbar">
        <input id="search" type="text" placeholder="Search coins" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label><input id="auto-refresh" type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto refresh</label>
        <span id="refreshes">Refreshed {refreshes} times</span>
        <Menu />
      </div>
      <div className="card">
        {loading && !data && <p id="loading">Loading...</p>}
        {error && <p id="error">Error: {error}</p>}
        {data && data.length === 0 && <p id="no-results">No coins match "{q}"</p>}
        {data && data.map((c) => (
          <div key={c.id} className="coin">
            <span className="symbol">{c.symbol}</span>
            <span className="name">{c.name}</span>
            <span className="price">{usd(c.price)}</span>
            <button type="button" className={favs.includes(c.symbol) ? 'fav-btn fav' : 'fav-btn'} aria-label={´Favourite @{c.symbol}´} onClick={() => toggleFav(c.symbol)}>★</button>
          </div>
        ))}
        <p id="fav-count">{favs.length} favourites</p>
      </div>
      <PriceTracker />
    </main>
  );
}
`;

const S_APP = `// src/App.js — STARTER: mọi thứ viết thẳng trong component, gọi API mỗi phím gõ, không cache
import { useEffect, useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    fetch('http://localhost:9999/coins' + (query ? '?q=' + query : '')).then((r) => r.json()).then(setCoins);
  }, [query]);
  return (
    <main>
      <h1 id="title">Crypto Watchlist</h1>
      <input id="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      {coins.map((c) => <div key={c.id} className="coin"><span className="symbol">{c.symbol}</span></div>)}
    </main>
  );
}
`;
const stubHook = (ten) => `// src/hooks/${ten}.js — STARTER
export function ${ten}() {
  return undefined;
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS };
const HOOKS = {
  'src/hooks/useFetch.js': USE_FETCH, 'src/hooks/useDebounce.js': USE_DEBOUNCE, 'src/hooks/useInterval.js': USE_INTERVAL,
  'src/hooks/usePrevious.js': USE_PREVIOUS, 'src/hooks/useLocalStorage.js': USE_LS, 'src/hooks/useOnClickOutside.js': USE_OUTSIDE,
};
const LOI_GIAI = { 'src/App.js': APP, ...HOOKS, ...CHUNG };
const KHOI_DAU = {
  'src/App.js': S_APP,
  ...Object.fromEntries(Object.keys(HOOKS).map((p) => [p, stubHook(p.split('/').pop().replace('.js', ''))])),
  ...CHUNG,
};

const KIEM = [
  // f1 useFetch basic
  { nhom: 'f1', moTa: 'Coins loaded through useFetch', kiem: 'danh-sach-text', selector: '.coin .symbol', mongDoi: ['BTC', 'ETH', 'BNB', 'SOL', 'WBTC'], truoc: [cho()] },
  { nhom: 'f1', moTa: 'Loading state', jsonServer: { base: B, db: { coins: COINS }, treMs: 1200 }, kiem: 'text', selector: '#loading', giaTri: 'Loading...' },
  { nhom: 'f1', moTa: 'Error state (HTTP 404)', jsonServer: { base: B, db: {} }, kiem: 'text', selector: '#error', giaTri: 'Error: HTTP 404', truoc: [cho()] },
  { nhom: 'f1', an: true, moTa: 'Prices formatted in USD', kiem: 'danh-sach-text', selector: '.coin:first-child .price', mongDoi: ['$68,000.00'], truoc: [cho()] },
  // f2 shared cache
  { nhom: 'f2', moTa: 'Ticker and list share one request', kiem: 'goi-fetch', khop: '/coins$', min: 1, max: 1, truoc: [cho(400)] },
  { nhom: 'f2', moTa: 'Ticker shows symbols', kiem: 'text', selector: '#ticker', giaTri: 'BTC · ETH · BNB · SOL · WBTC', truoc: [cho()] },
  { nhom: 'f2', an: true, moTa: 'Cache lives in the hook module', kiem: 'ma-nguon', tep: 'src/hooks/useFetch.js', khop: 'new Map\\(' },
  // f3 debounce search
  { nhom: 'f3', moTa: 'Debounced search: one request for fast typing', kiem: 'goi-fetch', khop: '/coins\\?q=', min: 1, max: 1, truoc: [cho(), nhap('#search', 'b'), nhap('#search', 'bi'), nhap('#search', 'bit'), cho(700)] },
  { nhom: 'f3', moTa: 'Search results from the server', kiem: 'danh-sach-text', selector: '.coin .symbol', mongDoi: ['BTC', 'WBTC'], truoc: [cho(), nhap('#search', 'bitcoin'), cho(700)] },
  { nhom: 'f3', moTa: 'No results message', kiem: 'text', selector: '#no-results', giaTri: 'No coins match "doge"', truoc: [cho(), nhap('#search', 'doge'), cho(700)] },
  { nhom: 'f3', an: true, moTa: 'Nothing requested before the delay', kiem: 'goi-fetch', khop: '/coins\\?q=', min: 0, max: 0, truoc: [cho(), nhap('#search', 'eth'), cho(150)] },
  // f4 interval
  { nhom: 'f4', moTa: 'Auto refresh re-fetches every second', kiem: 'goi-fetch', khop: '/coins$', min: 3, truoc: [cho(), { hanhDong: 'chon-o', selector: '#auto-refresh' }, cho(2300)] },
  { nhom: 'f4', moTa: 'Refresh counter uses the latest state (no stale closure)', kiem: 'text', selector: '#refreshes', giaTri: 'Refreshed 2 times', truoc: [cho(), { hanhDong: 'chon-o', selector: '#auto-refresh' }, cho(2300)] },
  { nhom: 'f4', moTa: 'Unchecking stops the interval', kiem: 'text', selector: '#refreshes', giaTri: 'Refreshed 1 times', truoc: [cho(), { hanhDong: 'chon-o', selector: '#auto-refresh' }, cho(1300), { hanhDong: 'chon-o', selector: '#auto-refresh', giaTri: false }, cho(1500)] },
  { nhom: 'f4', an: true, moTa: 'useInterval keeps the callback in a ref', kiem: 'ma-nguon', tep: 'src/hooks/useInterval.js', khop: 'useRef\\([\\s\\S]*\\.current\\s*=\\s*callback[\\s\\S]*setInterval\\(' },
  // f5 usePrevious
  { nhom: 'f5', moTa: 'Price change shows ▲ percent', kiem: 'text', selector: '#price-change', giaTri: '▲ 1.00%', truoc: [click('#tick-up')] },
  { nhom: 'f5', moTa: 'Price going down shows ▼ with class down', kiem: 'danh-sach-text', selector: '#price-change.down', mongDoi: ['▼ 2.00%'], truoc: [click('#tick-up'), click('#tick-down')] },
  { nhom: 'f5', an: true, moTa: 'No change on first render', kiem: 'text', selector: '#price-change', giaTri: '—' },
  // f6 favourites persisted
  { nhom: 'f6', moTa: 'Favourites toggle and persist', kiem: 'danh-sach-text', selector: '.coin .fav-btn.fav, #fav-count', mongDoi: ['★', '★', '2 favourites'], truoc: [cho(), click('.coin:nth-child(1) .fav-btn'), click('.coin:nth-child(4) .fav-btn'), { hanhDong: 'tai-lai' }, cho()] },
  { nhom: 'f6', moTa: 'Saved as JSON array "favs"', kiem: 'kho-cuc-bo', khoa: 'favs', khop: '^\\["ETH"\\]$', truoc: [cho(), click('.coin:nth-child(2) .fav-btn')] },
  { nhom: 'f6', an: true, moTa: 'Toggling twice removes', kiem: 'text', selector: '#fav-count', giaTri: '0 favourites', truoc: [cho(), click('.coin:nth-child(2) .fav-btn', 2)] },
  // f7 click outside
  { nhom: 'f7', moTa: 'Menu opens', kiem: 'ton-tai', selector: '#menu', truoc: [click('#menu-btn')] },
  { nhom: 'f7', moTa: 'Click outside closes it', kiem: 'khong-ton-tai', selector: '#menu', truoc: [click('#menu-btn'), click('#title')] },
  { nhom: 'f7', moTa: 'Click inside keeps it open', kiem: 'ton-tai', selector: '#menu', truoc: [click('#menu-btn'), click('#menu-name')] },
  // f8 hooks structure
  { nhom: 'f8', moTa: 'Each hook in src/hooks and named use…', kiem: 'ma-nguon', tep: 'src/hooks/useDebounce.js', khop: 'export\\s+function\\s+useDebounce\\s*\\([\\s\\S]*clearTimeout' },
  { nhom: 'f8', an: true, moTa: 'useOnClickOutside removes its listener', kiem: 'ma-nguon', tep: 'src/hooks/useOnClickOutside.js', khop: 'removeEventListener\\(' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 8: Custom Hooks Library — Crypto Watchlist', vi: 'DEEP LAB 8: Thư viện Custom Hook — Crypto Watchlist' },
  phu: { en: 'FER202 · Chapter 8 (deep) · Suggested time: 130 minutes · Total: 10 marks', vi: 'FER202 · Chương 8 (chuyên sâu) · Thời gian gợi ý: 130 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Professional React code is mostly <b>custom hooks</b>. Write six of them in <code>src/hooks/</code> and build a watchlist on top: <code>useFetch</code> with a shared cache and <code>refetch</code>, <code>useDebounce</code> for search, <code>useInterval</code> for auto refresh (the famous "callback in a ref" pattern), <code>usePrevious</code> for price arrows, <code>useLocalStorage</code> for favourites and <code>useOnClickOutside</code> for a dropdown. The API is json-server at <code>http://localhost:9999/coins</code> (supports <code>?q=</code> full-text search).</p>',
    vi: '<p>Code React chuyên nghiệp chủ yếu là <b>custom hook</b>. Viết sáu hook trong <code>src/hooks/</code> và dựng watchlist trên đó: <code>useFetch</code> có cache dùng chung và <code>refetch</code>, <code>useDebounce</code> cho ô tìm, <code>useInterval</code> cho tự làm mới (mẫu "callback trong ref" nổi tiếng), <code>usePrevious</code> cho mũi tên giá, <code>useLocalStorage</code> cho mục yêu thích và <code>useOnClickOutside</code> cho menu thả. API là json-server ở <code>http://localhost:9999/coins</code> (hỗ trợ tìm toàn văn <code>?q=</code>).</p>',
  },
  chucNangChinh: [{ en: '6 custom hooks + one app: fetch with cache, debounced search, auto refresh, price arrows, favourites, dropdown.', vi: '6 custom hook + một ứng dụng: fetch có cache, tìm có debounce, tự làm mới, mũi tên giá, yêu thích, menu thả.' }],
  yeuCauChung: [
    { en: 'One hook per file in <code>src/hooks/</code>, named export, name starts with <code>use</code>; every subscription/timer cleaned up.', vi: 'Mỗi hook một tệp trong <code>src/hooks/</code>, export có tên, tên bắt đầu bằng <code>use</code>; mọi đăng ký/hẹn giờ đều được dọn.' },
    { en: 'Run <code>npx json-server --watch db.json --port 9999</code> with a <code>coins</code> collection locally; the grader provides one.', vi: 'Trên máy chạy <code>npx json-server --watch db.json --port 9999</code> với bảng <code>coins</code>; máy chấm có sẵn.' },
  ],
  cayThuMuc: `
src/
├── hooks/
│   ├── useFetch.js          # { data, loading, error, refetch } + shared cache
│   ├── useDebounce.js
│   ├── useInterval.js       # (callback, delay | null)
│   ├── usePrevious.js
│   ├── useLocalStorage.js
│   └── useOnClickOutside.js
├── App.js                   # Ticker · toolbar · list · PriceTracker · Menu
└── index.css (given)`,
  wireframe: `
+------------------------------------------------------------------+
| Crypto Watchlist                                                  |
| BTC · ETH · BNB · SOL · WBTC                          (#ticker)   |
| [Search coins    ]  [x] Auto refresh  Refreshed 2 times  [Sort ▾] |
| BTC   Bitcoin          $68,000.00                          ★      |
| ETH   Ethereum          $3,500.00                          ☆      |
| …                                              2 favourites       |
| BTC $68,680.00   ▲ 1.00%   [+1%] [−2%]                (#tracker) |
+------------------------------------------------------------------+`,
  moHinh: {
    ten: 'coins (json-server)',
    truong: [
      ['id', 'number', ''],
      ['symbol', 'string', { en: 'BTC, ETH, …', vi: 'BTC, ETH, …' }],
      ['name', 'string', ''],
      ['price', 'number (USD)', { en: 'shown as $68,000.00', vi: 'hiển thị $68,000.00' }],
    ],
  },
  duLieuMau: JSON.stringify({ coins: COINS }, null, 1),
  chucNang: [
    { ten: { en: 'useFetch', vi: 'useFetch' }, diem: 1.5, yeuCau: [{ en: '<code>useFetch(url)</code> ⇒ <code>{ data, loading, error, refetch }</code>; non-2xx ⇒ <code>error = "HTTP 404"</code>; outdated responses ignored. UI: <code>#loading</code>, <code>#error</code> <code>Error: HTTP 404</code>, rows <code>.coin</code> (<code>.symbol .name .price</code> <code>$68,000.00</code>).', vi: '<code>useFetch(url)</code> ⇒ <code>{ data, loading, error, refetch }</code>; không phải 2xx ⇒ <code>error = "HTTP 404"</code>; bỏ phản hồi cũ. Giao diện: <code>#loading</code>, <code>#error</code> <code>Error: HTTP 404</code>, dòng <code>.coin</code> (<code>.symbol .name .price</code> <code>$68,000.00</code>).' }] },
    { ten: { en: 'Shared cache', vi: 'Cache dùng chung' }, diem: 1.5, yeuCau: [{ en: 'A module-level <code>Map</code> url ⇒ promise: the <code>#ticker</code> component and the list use the same URL and trigger only <b>one</b> request; <code>refetch()</code> bypasses the cache.', vi: '<code>Map</code> cấp module url ⇒ promise: component <code>#ticker</code> và danh sách dùng cùng URL và chỉ gây <b>một</b> request; <code>refetch()</code> bỏ qua cache.' }] },
    { ten: { en: 'Debounced search', vi: 'Tìm kiếm có debounce' }, diem: 1.5, yeuCau: [{ en: '<code>#search</code> + <code>useDebounce(value, 400)</code> ⇒ <code>GET /coins?q=…</code> only after typing stops; <code>#no-results</code> <code>No coins match "doge"</code>.', vi: '<code>#search</code> + <code>useDebounce(value, 400)</code> ⇒ <code>GET /coins?q=…</code> chỉ sau khi ngừng gõ; <code>#no-results</code> <code>No coins match "doge"</code>.' }], viDu: { en: 'type b, bi, bit quickly ⇒ one request /coins?q=bit', vi: 'gõ nhanh b, bi, bit ⇒ một request /coins?q=bit' } },
    { ten: { en: 'useInterval auto refresh', vi: 'useInterval tự làm mới' }, diem: 1.5, yeuCau: [{ en: '<code>#auto-refresh</code> on ⇒ <code>useInterval(cb, 1000)</code> calls <code>refetch</code> and increments <code>#refreshes</code> (<code>Refreshed 2 times</code>); off ⇒ delay <code>null</code> stops it. The callback is kept in a ref so the interval is not restarted every render.', vi: '<code>#auto-refresh</code> bật ⇒ <code>useInterval(cb, 1000)</code> gọi <code>refetch</code> và tăng <code>#refreshes</code> (<code>Refreshed 2 times</code>); tắt ⇒ delay <code>null</code> dừng. Callback giữ trong ref để interval không khởi động lại mỗi render.' }] },
    { ten: { en: 'usePrevious price arrows', vi: 'usePrevious mũi tên giá' }, diem: 1, yeuCau: [{ en: '<code>#tracker</code>: <code>#tick-up</code> (+1%), <code>#tick-down</code> (−2%); <code>#price-change</code> <code>▲ 1.00%</code> (class <code>up</code>) / <code>▼ 2.00%</code> (class <code>down</code>) vs the previous render; <code>—</code> at first.', vi: '<code>#tracker</code>: <code>#tick-up</code> (+1%), <code>#tick-down</code> (−2%); <code>#price-change</code> <code>▲ 1.00%</code> (class <code>up</code>) / <code>▼ 2.00%</code> (class <code>down</code>) so với lần render trước; <code>—</code> lúc đầu.' }] },
    { ten: { en: 'Favourites with useLocalStorage', vi: 'Yêu thích với useLocalStorage' }, diem: 1, yeuCau: [{ en: '<code>.fav-btn</code> toggles <code>.fav</code>; stored as a JSON array of symbols in <code>favs</code>; <code>#fav-count</code>.', vi: '<code>.fav-btn</code> bật/tắt <code>.fav</code>; lưu mảng JSON các symbol ở <code>favs</code>; <code>#fav-count</code>.' }] },
    { ten: { en: 'Dropdown with useOnClickOutside', vi: 'Menu thả với useOnClickOutside' }, diem: 1, yeuCau: [{ en: '<code>#menu-btn</code> toggles <code>#menu</code>; a click anywhere outside the menu wrapper closes it; clicks inside keep it open.', vi: '<code>#menu-btn</code> bật/tắt <code>#menu</code>; bấm bất kỳ đâu ngoài khung menu thì đóng; bấm bên trong giữ nguyên.' }] },
    { ten: { en: 'Hook hygiene', vi: 'Hook sạch' }, diem: 0.5, yeuCau: [{ en: 'Named <code>use…</code>, one per file, listeners and timers removed in cleanups.', vi: 'Tên <code>use…</code>, mỗi tệp một hook, listener và hẹn giờ được gỡ trong cleanup.' }] },
  ],
  idBatBuoc: [
    ['#title · #ticker · #search · #auto-refresh · #refreshes', { en: 'toolbar', vi: 'thanh công cụ' }],
    ['#loading · #error · #no-results · .coin .symbol .name .price .fav-btn(.fav) · #fav-count', { en: 'list', vi: 'danh sách' }],
    ['#tracker · #btc-price · #price-change(.up/.down) · #tick-up · #tick-down', { en: 'tracker', vi: 'theo dõi giá' }],
    ['#menu-btn · #menu · #menu-name · #menu-price', { en: 'dropdown', vi: 'menu' }],
  ],
  truDiem: [
    { en: 'Fetching on every keystroke (no debounce).', vi: 'Gọi API mỗi phím gõ (không debounce).' },
    { en: '<code>setInterval</code> in an effect depending on the callback — the interval restarts every render and never fires.', vi: '<code>setInterval</code> trong effect phụ thuộc callback — interval khởi động lại mỗi render và không bao giờ chạy.' },
    { en: '<code>setRefreshes(refreshes + 1)</code> inside the interval — stuck at 1 (stale closure).', vi: '<code>setRefreshes(refreshes + 1)</code> trong interval — kẹt ở 1 (closure cũ).' },
    { en: 'Document listener never removed.', vi: 'Listener trên document không bao giờ được gỡ.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-8-deep-custom-hooks',
  ten: 'Deep Lab 8 — Custom Hooks Library (Crypto Watchlist)',
  khoa: KHOA,
  baiHoc: 'fer202-8-1-usestate-useeffect',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 8 — Custom Hooks Library (useFetch cache · useDebounce · useInterval · usePrevious · useOnClickOutside)', vi: 'Deep Lab 8 — Thư viện Custom Hook (useFetch có cache · useDebounce · useInterval · usePrevious · useOnClickOutside)' },
      doKho: 'HARD',
      phut: 130,
      diem: 100,
      khaiNiem: ['custom hooks', 'request cache & deduplication', 'debounced values', 'declarative intervals', 'refs for latest callbacks', 'previous values', 'click outside'],
      tienQuyet: ['Lab 8 — Movie hooks', '8.1 useState & useEffect'],
      the: ['fer202', 'deep-lab', 'hooks', 'custom-hooks'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'deduplication', vi: 'gộp các request trùng thành một' },
        { en: 'stale closure', vi: 'hàm nhìn thấy giá trị cũ của lần render trước' },
        { en: 'latest ref pattern', vi: 'giữ callback mới nhất trong ref để effect không phải chạy lại' },
        { en: 'debounced value', vi: 'giá trị chỉ cập nhật khi nguồn đứng yên một lúc' },
        ...tn('rubric', 'persist'),
      ],
      goiY: [
        'Cache theo URL: lưu PROMISE (không lưu dữ liệu) ⇒ hai component gọi cùng lúc vẫn dùng chung một request.',
        'useInterval: savedCallback = useRef(cb); effect 1 cập nhật savedCallback.current = cb; effect 2 [delay] tạo setInterval(() => savedCallback.current(), delay).',
        'useDebounce: effect [value, delay] đặt setTimeout cập nhật state, cleanup clearTimeout.',
        'useOnClickOutside: document.addEventListener("click", …) và kiểm ref.current.contains(e.target).',
      ],
      loiHayGap: [
        'Lưu data (không phải promise) vào cache ⇒ hai component mount cùng lúc vẫn gửi hai request.',
        'Cho callback vào mảng phụ thuộc của effect setInterval ⇒ interval bị xoá/tạo lại mỗi render.',
        'useDebounce trả về hàm thay vì giá trị ⇒ khó dùng với useFetch(url).',
        'Quên cleanup listener ⇒ mở/đóng menu nhiều lần thì handler nhân lên.',
      ],
      moTaNgan: 'Deep lab chương 8: sáu custom hook (useFetch cache dùng chung + refetch, useDebounce, useInterval mẫu ref, usePrevious, useLocalStorage, useOnClickOutside) ghép thành Crypto Watchlist trên json-server. Thang 10.',
      giaiThich: '<p>Custom hook đóng gói <b>logic có state</b>, không đóng gói giao diện. <code>useFetch</code> lưu <i>promise</i> theo URL để các component cùng cần dữ liệu dùng chung một request (ý tưởng cốt lõi của SWR/React Query). <code>useInterval</code> giữ callback trong ref nên interval chỉ tạo lại khi <code>delay</code> đổi, và luôn gọi phiên bản mới nhất của callback — không còn closure cũ. <code>useDebounce</code> biến chuỗi đang gõ thành giá trị "đứng yên", và vì URL chỉ đổi khi giá trị đó đổi nên số request giảm hẳn.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', jsonServer: { base: B, db: { coins: COINS } }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://overreacted.io/making-setinterval-declarative-with-react-hooks/',
    },
  ],
});
