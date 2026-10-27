/**
 * FER202 · Chương 7 (Props patterns & Context) — LAB 7: Team Dashboard (theme · i18n · auth).
 * Bám bài 7.1 (prop drilling & Context API) + 7.2 (children & render props) nhưng sâu hơn: ba Context độc lập
 * có custom hook + lưu bền, từ điển song ngữ có dự phòng, chặn theo vai trò bằng component bọc, component
 * render props tổng quát, children-as-function, ghép Provider và ghi nhớ value.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DATA = `// src/data.js — đã cho
export const MEMBERS = [
  { id: 1, name: 'Nguyen Van An', role: 'Developer' },
  { id: 2, name: 'Tran Thi Binh', role: 'Designer' },
  { id: 3, name: 'Le Hoang Cuong', role: 'Developer' },
  { id: 4, name: 'Pham Minh Duc', role: 'Tester' },
  { id: 5, name: 'Vo Lan', role: 'Designer' },
];

export const FAQ = [
  { id: 1, q: 'What is Context?', a: 'A way to pass data through the tree without props.' },
  { id: 2, q: 'When should I use it?', a: 'For global data: theme, language, current user.' },
  { id: 3, q: 'Does it replace Redux?', a: 'Not always — Redux adds tooling and middleware.' },
];

export const USERS = {
  admin: { name: 'Cuong', role: 'admin' },
  viewer: { name: 'Lan', role: 'viewer' },
};

export const DICTIONARY = {
  en: {
    title: 'Team Dashboard', greeting: 'Hello', guest: 'Guest', members: 'Members', search: 'Search members...',
    empty: 'No members found', admin: 'Admin panel', adminsOnly: 'Admins only', faq: 'FAQ', signedInAs: 'Signed in as',
    logout: 'Log out', footer: 'Made with React Context',
  },
  vi: {
    title: 'Bảng điều khiển nhóm', greeting: 'Xin chào', guest: 'Khách', members: 'Thành viên', search: 'Tìm thành viên...',
    empty: 'Không tìm thấy thành viên', admin: 'Khu quản trị', adminsOnly: 'Chỉ dành cho quản trị viên', faq: 'Hỏi đáp',
    signedInAs: 'Đăng nhập với', logout: 'Đăng xuất',
  },
};
`;

const CSS = `/* src/index.css — đã cho */
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.app { min-height: 100vh; padding: 20px; background: #f8fafc; color: #0f172a; }
.app.theme-dark { background: #0f172a; color: #e2e8f0; }
.header, .toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.header h1 { margin: 0 auto 0 0; font-size: 22px; }
.card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; margin: 14px 0; }
.theme-dark .card { border-color: #334155; }
button, select, input { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid #cbd5e1; }
.member { padding: 6px 0; border-bottom: 1px dashed #cbd5e1; }
.faq-q { cursor: pointer; font-weight: 600; background: none; border: 0; padding: 4px 0; color: inherit; }
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const THEME = `// src/context/ThemeContext.js — Context + Provider + custom hook; value ghi nhớ bằng useMemo
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => localStorage.setItem('theme', theme), [theme]);
  // useMemo: object value chỉ tạo mới khi theme đổi ⇒ component dùng context không render thừa
  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
`;

const LANG = `// src/context/LanguageContext.js — i18n tối giản: t(key) tra từ điển, thiếu thì lùi về tiếng Anh, thiếu nữa thì trả key
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DICTIONARY } from '../data';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  useEffect(() => localStorage.setItem('lang', lang), [lang]);
  const t = useCallback((key) => DICTIONARY[lang]?.[key] ?? DICTIONARY.en[key] ?? key, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
`;

const AUTH = `// src/context/AuthContext.js — người dùng hiện tại + component bọc chặn theo vai trò
import { createContext, useContext, useMemo, useState } from 'react';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// Chỉ vẽ children khi đúng vai trò — tái dùng được ở mọi chỗ (thay vì if rải rác)
export function RequireRole({ role, children }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  if (user?.role !== role) return <p id="no-access">{t('adminsOnly')}</p>;
  return children;
}
`;

const PROVIDERS = `// src/context/AppProviders.js — gom các Provider về MỘT chỗ (thứ tự: Auth cần Language nên nằm trong)
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
`;

const DATALIST = `// src/components/DataList.js — RENDER PROPS: DataList lo lọc/khoá/rỗng, NƠI DÙNG quyết định vẽ mỗi mục ra sao
export default function DataList({ items, getKey = (x) => x.id, renderItem, renderEmpty }) {
  if (items.length === 0) return renderEmpty ? renderEmpty() : null;
  return <ul className="data-list">{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}
`;

const TOGGLE = `// src/components/Toggle.js — CHILDREN LÀ HÀM: Toggle giữ state, children nhận { on, toggle } để tự vẽ
import { useState } from 'react';

export default function Toggle({ initial = false, children }) {
  const [on, setOn] = useState(initial);
  return children({ on, toggle: () => setOn((v) => !v) });
}
`;

const USERMENU = `// src/components/UserMenu.js — nằm SÂU trong cây (App → Header → Toolbar → UserMenu) nhưng đọc thẳng Context
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { USERS } from '../data';

export default function UserMenu() {
  const { user, login, logout } = useAuth();
  const { t } = useLanguage();
  if (!user) {
    return (
      <>
        <button type="button" id="login-admin" onClick={() => login(USERS.admin)}>Login as admin</button>
        <button type="button" id="login-viewer" onClick={() => login(USERS.viewer)}>Login as viewer</button>
      </>
    );
  }
  return (
    <>
      <span id="user-badge">{t('signedInAs')} {user.name} ({user.role})</span>
      <button type="button" id="logout" onClick={logout}>{t('logout')}</button>
    </>
  );
}
`;

const HEADER = `// src/components/Header.js — KHÔNG nhận props về theme/ngôn ngữ/người dùng: mỗi con tự lấy từ Context
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import UserMenu from './UserMenu';

function Toolbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  return (
    <div className="toolbar">
      <select id="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
      <button type="button" id="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
      <UserMenu />
    </div>
  );
}

export default function Header() {
  const { t } = useLanguage();
  return (
    <header className="header">
      <h1 id="title">{t('title')}</h1>
      <Toolbar />
    </header>
  );
}
`;

const APP = `// src/App.js
import { useState } from 'react';
import AppProviders from './context/AppProviders';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { RequireRole, useAuth } from './context/AuthContext';
import Header from './components/Header';
import DataList from './components/DataList';
import Toggle from './components/Toggle';
import { FAQ, MEMBERS } from './data';

function Dashboard() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const members = MEMBERS.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className={´app theme-@{theme}´}>
      <Header />
      <p id="greeting">{t('greeting')}, {user ? user.name : t('guest')}!</p>

      <section className="card">
        <h2>{t('members')}</h2>
        <input id="member-search" placeholder={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
        <DataList
          items={members}
          renderItem={(m) => <div className="member">{m.name} — <i>{m.role}</i></div>}
          renderEmpty={() => <p id="empty">{t('empty')}</p>}
        />
      </section>

      <section className="card">
        <h2>{t('admin')}</h2>
        <RequireRole role="admin">
          <div id="admin-panel">You can manage {MEMBERS.length} members here.</div>
        </RequireRole>
      </section>

      <section className="card" id="faq">
        <h2>{t('faq')}</h2>
        {FAQ.map((f) => (
          <Toggle key={f.id}>
            {({ on, toggle }) => (
              <div className="faq-item">
                <button type="button" className="faq-q" aria-expanded={on} onClick={toggle}>{on ? '▾' : '▸'} {f.q}</button>
                {on && <p className="faq-a">{f.a}</p>}
              </div>
            )}
          </Toggle>
        ))}
      </section>

      <footer id="footer">{t('footer')}</footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_APP = `// src/App.js — STARTER: mọi thứ truyền bằng props qua nhiều tầng (prop drilling) và chưa làm gì
import { FAQ, MEMBERS } from './data';

export default function App() {
  // TODO: AppProviders (Theme, Language, Auth) + Dashboard đọc Context; DataList (render props); Toggle (children là hàm)
  return (
    <div className="app theme-light">
      <h1 id="title">Team Dashboard</h1>
      <p id="greeting">Hello, Guest!</p>
      <ul>{MEMBERS.map((m) => <li key={m.id} className="member">{m.name}</li>)}</ul>
      <section id="faq">{FAQ.map((f) => <p key={f.id} className="faq-q">{f.q}</p>)}</section>
    </div>
  );
}
`;
const S = (ten, ghiChu, ma) => `// ${ten} — STARTER
// TODO: ${ghiChu}
${ma}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data.js': DATA };
const LOI_GIAI = {
  'src/App.js': APP, 'src/context/ThemeContext.js': THEME, 'src/context/LanguageContext.js': LANG, 'src/context/AuthContext.js': AUTH,
  'src/context/AppProviders.js': PROVIDERS, 'src/components/Header.js': HEADER, 'src/components/UserMenu.js': USERMENU,
  'src/components/DataList.js': DATALIST, 'src/components/Toggle.js': TOGGLE, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/context/ThemeContext.js': S('src/context/ThemeContext.js', 'ThemeProvider + useTheme (theme lưu localStorage "theme")', 'export function ThemeProvider({ children }) {\n  return children;\n}\nexport const useTheme = () => ({ theme: \'light\', toggleTheme: () => {} });'),
  'src/context/LanguageContext.js': S('src/context/LanguageContext.js', 'LanguageProvider + useLanguage: { lang, setLang, t } (t lùi về tiếng Anh, rồi về key)', 'export function LanguageProvider({ children }) {\n  return children;\n}\nexport const useLanguage = () => ({ lang: \'en\', setLang: () => {}, t: (k) => k });'),
  'src/context/AuthContext.js': S('src/context/AuthContext.js', 'AuthProvider + useAuth + RequireRole', 'export function AuthProvider({ children }) {\n  return children;\n}\nexport const useAuth = () => ({ user: null, login: () => {}, logout: () => {} });\nexport function RequireRole({ children }) {\n  return children;\n}'),
  'src/context/AppProviders.js': S('src/context/AppProviders.js', 'bọc ThemeProvider > LanguageProvider > AuthProvider', 'export default function AppProviders({ children }) {\n  return children;\n}'),
  'src/components/Header.js': S('src/components/Header.js', '#title + Toolbar (#lang-select, #theme-toggle, UserMenu)', 'export default function Header() {\n  return null;\n}'),
  'src/components/UserMenu.js': S('src/components/UserMenu.js', '#login-admin / #login-viewer / #user-badge / #logout', 'export default function UserMenu() {\n  return null;\n}'),
  'src/components/DataList.js': S('src/components/DataList.js', 'render props: items, renderItem, renderEmpty, getKey', 'export default function DataList() {\n  return null;\n}'),
  'src/components/Toggle.js': S('src/components/Toggle.js', 'children là HÀM nhận { on, toggle }', 'export default function Toggle() {\n  return null;\n}'),
  ...CHUNG,
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const click = (selector) => ({ hanhDong: 'click', selector });
const VI = { hanhDong: 'doi', selector: '#lang-select', giaTri: 'vi' };
const KIEM = [
  // f1 theme
  { nhom: 'f1', moTa: 'Starts in light mode (.app.theme-light)', kiem: 'ton-tai', selector: '.app.theme-light' },
  { nhom: 'f1', moTa: '#theme-toggle switches to dark', kiem: 'ton-tai', selector: '.app.theme-dark', truoc: [click('#theme-toggle')] },
  { nhom: 'f1', moTa: 'Theme is saved and restored after reload', kiem: 'ton-tai', selector: '.app.theme-dark', truoc: [click('#theme-toggle'), { hanhDong: 'tai-lai' }] },
  { nhom: 'f1', an: true, moTa: 'Saved under localStorage "theme"', kiem: 'kho-cuc-bo', khoa: 'theme', khop: '^dark$', truoc: [click('#theme-toggle')] },
  // f2 language
  { nhom: 'f2', moTa: 'English by default', kiem: 'danh-sach-text', selector: '#title, #greeting', mongDoi: ['Team Dashboard', 'Hello, Guest!'] },
  { nhom: 'f2', moTa: 'Switching to vi translates the whole page', kiem: 'danh-sach-text', selector: '#title, #greeting', mongDoi: ['Bảng điều khiển nhóm', 'Xin chào, Khách!'], truoc: [VI] },
  { nhom: 'f2', moTa: 'Missing Vietnamese text falls back to English', kiem: 'text', selector: '#footer', giaTri: 'Made with React Context', truoc: [VI] },
  { nhom: 'f2', moTa: 'Language survives a reload (localStorage "lang")', kiem: 'text', selector: '#title', giaTri: 'Bảng điều khiển nhóm', truoc: [VI, { hanhDong: 'tai-lai' }] },
  { nhom: 'f2', an: true, moTa: 'Placeholder is translated too', kiem: 'thuoc-tinh', selector: '#member-search', thuocTinh: 'placeholder', giaTri: 'Tìm thành viên...', truoc: [VI] },
  { nhom: 'f2', an: true, moTa: 'Unknown key is shown as the key itself', kiem: 'ma-nguon', tep: 'src/context/LanguageContext.js', khop: '\\?\\?\\s*key|\\|\\|\\s*key' },
  // f3 auth + role
  { nhom: 'f3', moTa: 'Login as admin shows the badge', kiem: 'text', selector: '#user-badge', giaTri: 'Signed in as Cuong (admin)', truoc: [click('#login-admin')] },
  { nhom: 'f3', moTa: 'Admin sees #admin-panel', kiem: 'ton-tai', selector: '#admin-panel', truoc: [click('#login-admin')] },
  { nhom: 'f3', moTa: 'Viewer sees #no-access instead', kiem: 'danh-sach-text', selector: '#admin-panel, #no-access', mongDoi: ['Admins only'], truoc: [click('#login-viewer')] },
  { nhom: 'f3', moTa: 'Greeting uses the user name', kiem: 'text', selector: '#greeting', giaTri: 'Hello, Lan!', truoc: [click('#login-viewer')] },
  { nhom: 'f3', an: true, moTa: 'Logout hides the admin panel again', kiem: 'khong-ton-tai', selector: '#admin-panel', truoc: [click('#login-admin'), click('#logout')] },
  { nhom: 'f3', an: true, moTa: 'Badge is translated (vi)', kiem: 'text', selector: '#user-badge', giaTri: 'Đăng nhập với Cuong (admin)', truoc: [VI, click('#login-admin')] },
  // f4 render props
  { nhom: 'f4', moTa: 'DataList renders 5 .member items', kiem: 'so-luong', selector: '.data-list .member', giaTri: 5 },
  { nhom: 'f4', moTa: 'renderItem decides the markup', kiem: 'text', selector: '.member', khop: '^Nguyen Van An — Developer$', tatCa: false },
  { nhom: 'f4', moTa: 'Search filters; nothing left ⇒ renderEmpty', kiem: 'text', selector: '#empty', giaTri: 'No members found', truoc: [{ hanhDong: 'nhap', selector: '#member-search', giaTri: 'zzz' }] },
  { nhom: 'f4', an: true, moTa: 'DataList takes renderItem / renderEmpty props', kiem: 'ma-nguon', tep: 'src/components/DataList.js', khop: 'renderItem\\([\\s\\S]*renderEmpty|renderEmpty[\\s\\S]*renderItem\\(' },
  { nhom: 'f4', an: true, moTa: 'Empty message follows the language', kiem: 'text', selector: '#empty', giaTri: 'Không tìm thấy thành viên', truoc: [VI, { hanhDong: 'nhap', selector: '#member-search', giaTri: 'zzz' }] },
  // f5 children as function
  { nhom: 'f5', moTa: 'Answers hidden at first', kiem: 'so-luong', selector: '.faq-a', giaTri: 0 },
  { nhom: 'f5', moTa: 'Clicking a question shows only its answer', kiem: 'danh-sach-text', selector: '.faq-a', mongDoi: ['For global data: theme, language, current user.'], truoc: [{ hanhDong: 'click', selector: '.faq-item:nth-child(3) .faq-q' }] },
  { nhom: 'f5', an: true, moTa: 'Toggle calls children as a function', kiem: 'ma-nguon', tep: 'src/components/Toggle.js', khop: 'children\\(\\s*\\{' },
  // f6 no prop drilling
  { nhom: 'f6', moTa: 'UserMenu reads the user from context', kiem: 'ma-nguon', tep: 'src/components/UserMenu.js', khop: 'useAuth\\(\\)' },
  { nhom: 'f6', moTa: 'Header receives no theme/lang/user props', kiem: 'ma-nguon', tep: 'src/components/Header.js', khop: 'function Header\\(\\s*\\)' },
  { nhom: 'f6', an: true, moTa: 'Hooks throw outside their provider', kiem: 'ma-nguon', tep: 'src/context/AuthContext.js', khop: 'throw new Error' },
  // f7 providers + memo
  { nhom: 'f7', moTa: 'AppProviders composes the three providers', kiem: 'ma-nguon', tep: 'src/context/AppProviders.js', khop: 'ThemeProvider[\\s\\S]*LanguageProvider[\\s\\S]*AuthProvider' },
  { nhom: 'f7', moTa: 'Context values are memoized', kiem: 'ma-nguon', tep: 'src/context/ThemeContext.js', khop: 'useMemo\\(' },
  { nhom: 'f7', an: true, moTa: 'Language value memoized too', kiem: 'ma-nguon', tep: 'src/context/LanguageContext.js', khop: 'useMemo\\(' },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 7: Team Dashboard — Context API & reusable component patterns', vi: 'LAB 7: Bảng điều khiển nhóm — Context API & mẫu component tái sử dụng' },
  phu: { en: 'FER202 · Chapter 7 — Props patterns & Context · Suggested time: 100 minutes · Total: 10 marks', vi: 'FER202 · Chương 7 — Mẫu props & Context · Thời gian gợi ý: 100 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>A team dashboard needs three pieces of <b>global</b> data — theme, language and the signed-in user — that many components deep in the tree must read. Instead of passing props through every level (<i>prop drilling</i>), create three <b>Contexts</b> with custom hooks, persist the preferences, translate the UI with a small <code>t()</code> function, guard an admin section by role, and practise two reuse patterns: <b>render props</b> and <b>children as a function</b>.</p>',
    vi: '<p>Bảng điều khiển nhóm cần ba dữ liệu <b>toàn cục</b> — giao diện, ngôn ngữ và người đang đăng nhập — mà nhiều component nằm sâu phải đọc. Thay vì truyền props qua mọi tầng (<i>prop drilling</i>), hãy tạo ba <b>Context</b> có custom hook, lưu lựa chọn, dịch giao diện bằng hàm <code>t()</code> nhỏ, chặn khu quản trị theo vai trò, và luyện hai mẫu tái sử dụng: <b>render props</b> và <b>children là hàm</b>.</p>',
  },
  chucNangChinh: [{ en: 'Theme · language · auth contexts, role guard, member list (render props), FAQ (children as function).', vi: 'Context theme · ngôn ngữ · đăng nhập, chặn theo vai trò, danh sách thành viên (render props), FAQ (children là hàm).' }],
  yeuCauChung: [
    { en: 'Each Context in its own file under <code>src/context/</code> with a Provider and a custom hook (<code>useTheme</code>, <code>useLanguage</code>, <code>useAuth</code>) that throws when used outside its provider.', vi: 'Mỗi Context một tệp trong <code>src/context/</code>, có Provider và custom hook (<code>useTheme</code>, <code>useLanguage</code>, <code>useAuth</code>) báo lỗi khi dùng ngoài Provider.' },
    { en: 'Memoize every context <code>value</code> with <code>useMemo</code>.', vi: 'Ghi nhớ mọi <code>value</code> của Context bằng <code>useMemo</code>.' },
    { en: '<code>Header</code> takes <b>no props</b>; its children read what they need from Context.', vi: '<code>Header</code> <b>không nhận props</b>; các con tự đọc thứ mình cần từ Context.' },
  ],
  cayThuMuc: `
src/
├── context/
│   ├── ThemeContext.js      # ThemeProvider · useTheme
│   ├── LanguageContext.js   # LanguageProvider · useLanguage { lang, setLang, t }
│   ├── AuthContext.js       # AuthProvider · useAuth · RequireRole
│   └── AppProviders.js      # Theme > Language > Auth
├── components/
│   ├── Header.js            # title + Toolbar (language, theme, UserMenu)
│   ├── UserMenu.js          # login buttons / badge / logout
│   ├── DataList.js          # render props
│   └── Toggle.js            # children as a function
├── data.js                  # MEMBERS, FAQ, USERS, DICTIONARY (given)
├── App.js
└── index.js`,
  wireframe: `
+----------------------------------------------------------------------------+
| Team Dashboard        [English v] [🌙] [Login as admin] [Login as viewer]  |
| Hello, Guest!                                                              |
| +- Members ---------------------------------------------------------+     |
| | [Search members...      ]                                         |     |
| | Nguyen Van An — Developer                                         |     |
| | Tran Thi Binh — Designer   ...                                    |     |
| +-------------------------------------------------------------------+     |
| +- Admin panel ----------+  +- FAQ ------------------------------+        |
| | Admins only            |  | ▸ What is Context?                 |        |
| +------------------------+  | ▾ When should I use it?            |        |
|                             |   For global data: theme, ...      |        |
|                             +------------------------------------+        |
| Made with React Context                                                    |
+----------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'Context values',
    truong: [
      ['ThemeContext', "{ theme: 'light' | 'dark', toggleTheme }", { en: 'localStorage "theme"', vi: 'localStorage "theme"' }],
      ['LanguageContext', "{ lang: 'en' | 'vi', setLang, t(key) }", { en: 'localStorage "lang"; t: current ⇒ en ⇒ key', vi: 'localStorage "lang"; t: ngôn ngữ hiện tại ⇒ en ⇒ key' }],
      ['AuthContext', '{ user: { name, role } | null, login(user), logout() }', { en: 'not persisted', vi: 'không lưu bền' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Theme context', vi: 'Context giao diện' }, diem: 1.5,
      yeuCau: [{ en: 'Root <code>.app.theme-light</code> / <code>.app.theme-dark</code>; <code>#theme-toggle</code> switches; saved in localStorage <code>theme</code> and restored on load.', vi: 'Gốc <code>.app.theme-light</code> / <code>.app.theme-dark</code>; <code>#theme-toggle</code> đổi; lưu localStorage <code>theme</code> và khôi phục khi mở lại.' }],
      hook: ['createContext', 'useContext', 'useMemo'], khoa: 'theme',
    },
    {
      ten: { en: 'Language context (i18n)', vi: 'Context ngôn ngữ (i18n)' }, diem: 2,
      yeuCau: [
        { en: '<code>#lang-select</code> (<code>en</code>/<code>vi</code>); every visible text goes through <code>t(key)</code> from <code>DICTIONARY</code>: <code>#title</code>, <code>#greeting</code> (<code>Hello, Guest!</code>), headings, placeholder, messages.', vi: '<code>#lang-select</code> (<code>en</code>/<code>vi</code>); mọi chữ hiển thị đi qua <code>t(key)</code> từ <code>DICTIONARY</code>: <code>#title</code>, <code>#greeting</code> (<code>Hello, Guest!</code>), tiêu đề, placeholder, thông báo.' },
        { en: 'Missing in the current language ⇒ English; missing everywhere ⇒ the key itself. Saved in localStorage <code>lang</code>.', vi: 'Thiếu ở ngôn ngữ hiện tại ⇒ tiếng Anh; thiếu ở mọi nơi ⇒ chính key. Lưu localStorage <code>lang</code>.' },
      ],
      viDu: { en: 'vi ⇒ "Xin chào, Khách!" · footer (no vi entry) ⇒ "Made with React Context"', vi: 'vi ⇒ "Xin chào, Khách!" · footer (không có bản vi) ⇒ "Made with React Context"' },
      khoa: 'lang',
    },
    {
      ten: { en: 'Auth context & role guard', vi: 'Context đăng nhập & chặn vai trò' }, diem: 2,
      yeuCau: [
        { en: '<code>#login-admin</code> / <code>#login-viewer</code> sign in as <code>USERS.admin</code> / <code>USERS.viewer</code>; then <code>#user-badge</code> <code>Signed in as Cuong (admin)</code> and <code>#logout</code>.', vi: '<code>#login-admin</code> / <code>#login-viewer</code> đăng nhập bằng <code>USERS.admin</code> / <code>USERS.viewer</code>; sau đó <code>#user-badge</code> <code>Signed in as Cuong (admin)</code> và <code>#logout</code>.' },
        { en: '<code>&lt;RequireRole role="admin"&gt;</code> renders its children (<code>#admin-panel</code>) only for admins, otherwise <code>#no-access</code> (<code>t(\'adminsOnly\')</code>).', vi: '<code>&lt;RequireRole role="admin"&gt;</code> chỉ vẽ children (<code>#admin-panel</code>) cho admin, còn lại <code>#no-access</code> (<code>t(\'adminsOnly\')</code>).' },
      ],
    },
    {
      ten: { en: 'Render props: DataList', vi: 'Render props: DataList' }, diem: 1.5,
      yeuCau: [{ en: '<code>&lt;DataList items renderItem renderEmpty getKey /&gt;</code> renders a <code>ul.data-list</code>; the dashboard decides the item markup (<code>.member</code> <code>Name — Role</code>) and the empty state (<code>#empty</code>). <code>#member-search</code> filters by name.', vi: '<code>&lt;DataList items renderItem renderEmpty getKey /&gt;</code> vẽ <code>ul.data-list</code>; dashboard quyết định cách vẽ mục (<code>.member</code> <code>Tên — Vai trò</code>) và trạng thái rỗng (<code>#empty</code>). <code>#member-search</code> lọc theo tên.' }],
    },
    {
      ten: { en: 'Children as a function: Toggle', vi: 'Children là hàm: Toggle' }, diem: 1,
      yeuCau: [{ en: '<code>&lt;Toggle&gt;{({ on, toggle }) =&gt; …}&lt;/Toggle&gt;</code> owns the open/closed state; each FAQ <code>.faq-item</code> has a <code>.faq-q</code> button and shows <code>.faq-a</code> only when open.', vi: '<code>&lt;Toggle&gt;{({ on, toggle }) =&gt; …}&lt;/Toggle&gt;</code> giữ state mở/đóng; mỗi FAQ <code>.faq-item</code> có nút <code>.faq-q</code> và chỉ hiện <code>.faq-a</code> khi mở.' }],
    },
    {
      ten: { en: 'No prop drilling', vi: 'Không prop drilling' }, diem: 1,
      yeuCau: [{ en: '<code>Header()</code> has no parameters; <code>UserMenu</code> (3 levels deep) calls <code>useAuth()</code> itself. Hooks throw outside their provider.', vi: '<code>Header()</code> không có tham số; <code>UserMenu</code> (sâu 3 tầng) tự gọi <code>useAuth()</code>. Hook báo lỗi khi dùng ngoài Provider.' }],
    },
    {
      ten: { en: 'Provider composition & memo', vi: 'Ghép Provider & ghi nhớ' }, diem: 1,
      yeuCau: [{ en: '<code>AppProviders</code> nests Theme &gt; Language &gt; Auth (Auth uses <code>t</code>); context values wrapped in <code>useMemo</code>.', vi: '<code>AppProviders</code> lồng Theme &gt; Language &gt; Auth (Auth dùng <code>t</code>); value của Context bọc <code>useMemo</code>.' }],
    },
  ],
  idBatBuoc: [
    ['.app.theme-light / .theme-dark · #theme-toggle · #lang-select', { en: 'preferences', vi: 'tuỳ chọn' }],
    ['#title · #greeting · #footer', { en: 'translated texts', vi: 'chữ được dịch' }],
    ['#login-admin · #login-viewer · #user-badge · #logout · #admin-panel · #no-access', { en: 'auth', vi: 'đăng nhập' }],
    ['#member-search · .data-list · .member · #empty', { en: 'members', vi: 'thành viên' }],
    ['.faq-item · .faq-q · .faq-a', { en: 'FAQ', vi: 'hỏi đáp' }],
  ],
  truDiem: [
    { en: 'Passing <code>theme</code>, <code>t</code> and <code>user</code> down as props through Header → Toolbar → UserMenu.', vi: 'Truyền <code>theme</code>, <code>t</code>, <code>user</code> qua props Header → Toolbar → UserMenu.' },
    { en: 'One giant context for everything — every change re-renders every consumer.', vi: 'Một Context khổng lồ chứa mọi thứ — đổi gì cũng vẽ lại mọi nơi dùng.' },
    { en: 'Hard-coded English strings left in components.', vi: 'Còn chữ tiếng Anh viết cứng trong component.' },
    { en: '<code>value={{ … }}</code> created inline without <code>useMemo</code>.', vi: '<code>value={{ … }}</code> tạo mới mỗi lần render, không <code>useMemo</code>.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-7-lab-team-dashboard',
  ten: 'Lab 7 — Team Dashboard (Context · render props)',
  khoa: KHOA,
  baiHoc: 'fer202-7-1-context',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 7 — Team Dashboard (theme · i18n · auth contexts · render props)', vi: 'Lab 7 — Bảng điều khiển nhóm (Context theme · i18n · auth · render props)' },
      doKho: 'HARD',
      phut: 100,
      diem: 100,
      khaiNiem: ['Context API', 'custom hooks', 'prop drilling', 'Provider composition', 'useMemo for context value', 'render props', 'children as a function', 'i18n fallback'],
      tienQuyet: ['props & children', 'useState / useEffect'],
      the: ['fer202', 'lab', 'context', 'render-props'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'prop drilling', vi: 'truyền props xuyên nhiều tầng chỉ để chuyền tay' },
        { en: 'provider / consumer', vi: 'nơi cung cấp / nơi đọc giá trị Context' },
        { en: 'render props', vi: 'truyền HÀM vẽ qua props để component dùng lại logic' },
        { en: 'children as a function', vi: 'children là một hàm nhận dữ liệu và trả JSX' },
        { en: 'i18n (internationalization)', vi: 'đa ngôn ngữ hoá' },
        { en: 'fallback', vi: 'giá trị dự phòng khi thiếu' },
        { en: 'role-based access', vi: 'phân quyền theo vai trò' },
        ...tn('persist', 'rubric'),
      ],
      goiY: [
        'Mỗi Context: const X = createContext(null); Provider giữ state + value = useMemo(...); hook useX() { const c = useContext(X); if (!c) throw …; return c; }.',
        't = useCallback(key => DICTIONARY[lang]?.[key] ?? DICTIONARY.en[key] ?? key, [lang]).',
        'RequireRole: const { user } = useAuth(); return user?.role === role ? children : <p id="no-access">{t("adminsOnly")}</p>.',
        'DataList: if (!items.length) return renderEmpty(); return <ul className="data-list">{items.map(i => <li key={getKey(i)}>{renderItem(i)}</li>)}</ul>. Toggle: return children({ on, toggle }).',
      ],
      loiHayGap: [
        '<code>useContext(ThemeContext)</code> ở component KHÔNG nằm trong Provider ⇒ nhận giá trị mặc định (null) ⇒ lỗi "cannot read properties of null".',
        'Đặt AuthProvider NGOÀI LanguageProvider trong khi RequireRole dùng <code>t</code> ⇒ hook ngôn ngữ báo lỗi.',
        'Truyền <code>value={{ theme, toggleTheme }}</code> tạo object mới mỗi lần render ⇒ mọi consumer vẽ lại.',
        'Render props gọi <code>renderItem</code> nhưng quên <code>key</code> cho phần tử bọc ngoài.',
        'Toggle viết <code>return &lt;&gt;{children}&lt;/&gt;</code> trong khi children là HÀM ⇒ React báo "Functions are not valid as a React child".',
      ],
      moTaNgan: 'Lab chương 7: ba Context (theme, ngôn ngữ có dự phòng, đăng nhập + chặn vai trò), custom hook, ghép Provider, render props và children-as-function. Thang 10.',
      giaiThich: '<p>Ba mối quan tâm toàn cục được tách thành ba Context nhỏ — đổi ngôn ngữ không làm vẽ lại phần chỉ dùng theme. Mỗi Context có custom hook kiểm Provider và value được <code>useMemo</code>. <code>t()</code> tra theo thứ tự ngôn ngữ hiện tại → tiếng Anh → chính key. <code>RequireRole</code> đóng gói luật phân quyền thành component bọc dùng lại được. <code>DataList</code> (render props) giữ phần chung (rỗng, key, khung danh sách) còn nơi dùng quyết định cách vẽ; <code>Toggle</code> giữ state mở/đóng và giao cho children-hàm cách hiển thị.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/learn/passing-data-deeply-with-context',
    },
  ],
});
