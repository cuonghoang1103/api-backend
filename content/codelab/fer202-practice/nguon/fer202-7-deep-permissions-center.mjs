/**
 * FER202 · Chương 7 — DEEP LAB: Permissions & Notifications Center (Context chuyên sâu).
 * Sâu hơn Lab 7: Context + useReducer, TÁCH context state/dispatch để component chỉ gửi action không vẽ lại,
 * ma trận quyền suy ra từ vai trò, component <Can> + HOC withPermission, cờ tính năng có Provider lồng ghi đè
 * (gộp với cha), lưu vai trò vào localStorage.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f8fafc; color: #0f172a; }
header { display: flex; align-items: center; gap: 12px; background: #1e293b; color: #fff; padding: 10px 16px; border-radius: 10px; }
header .spacer { flex: 1; }
.bell { position: relative; } #bell-count { background: #ef4444; border-radius: 999px; padding: 0 7px; font-size: 12px; }
section { background: #fff; border-radius: 10px; padding: 14px 16px; margin-top: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.notification { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; } .notification.unread { font-weight: 600; }
button { cursor: pointer; } .muted { color: #64748b; }
`;

const AUTH = `// src/context/AuthContext.js — useReducer + HAI context: state và dispatch tách riêng
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const AuthStateContext = createContext(null);
const AuthDispatchContext = createContext(null);

const ROLES = ['admin', 'editor', 'viewer'];

function authReducer(state, action) {
  switch (action.type) {
    case 'login':
      return { user: { name: action.name }, role: state.role };
    case 'logout':
      return { user: null, role: 'viewer' };
    case 'switchRole':
      return ROLES.includes(action.role) ? { ...state, role: action.role } : state;
    default:
      return state;
  }
}

function init() {
  const saved = localStorage.getItem('role');
  return { user: { name: 'Lan' }, role: ROLES.includes(saved) ? saved : 'viewer' };
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, init);

  useEffect(() => {
    localStorage.setItem('role', state.role);
  }, [state.role]);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthStateContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function useAuthDispatch() {
  const ctx = useContext(AuthDispatchContext);
  if (!ctx) throw new Error('useAuthDispatch must be used inside AuthProvider');
  return ctx;
}

export { ROLES };
// useMemo không cần cho value ở đây: state từ useReducer đã ổn định khi không đổi, dispatch luôn ổn định
export const __memo = useMemo;
`;

const PERMS = `// src/context/permissions.js — ma trận quyền: vai trò ⇒ danh sách quyền (dữ liệu, không if lồng)
import { useAuth } from './AuthContext';

export const PERMISSIONS = {
  admin: ['orders:view', 'orders:edit', 'orders:delete', 'reports:view'],
  editor: ['orders:view', 'orders:edit'],
  viewer: ['orders:view'],
};

export function usePermission(permission) {
  const { role } = useAuth();
  return (PERMISSIONS[role] ?? []).includes(permission);
}

// <Can do="orders:delete" fallback={…}>…</Can>
export function Can({ do: permission, fallback = null, children }) {
  return usePermission(permission) ? children : fallback;
}

// HOC: bọc một component, chỉ vẽ nó khi có quyền
export function withPermission(Component, permission, Fallback = () => null) {
  function Guarded(props) {
    return usePermission(permission) ? <Component {...props} /> : <Fallback {...props} />;
  }
  Guarded.displayName = ´withPermission(@{Component.displayName || Component.name || 'Component'})´;
  return Guarded;
}
`;

const FLAGS = `// src/context/FeatureFlags.js — Provider lồng GỘP cờ của cha với phần ghi đè
import { createContext, useContext, useMemo } from 'react';

const FlagsContext = createContext({});

export function FeatureFlagsProvider({ flags = {}, children }) {
  const parent = useContext(FlagsContext);
  const value = useMemo(() => ({ ...parent, ...flags }), [parent, flags]);
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

export function useFlag(name) {
  return Boolean(useContext(FlagsContext)[name]);
}
`;

const NOTI = `// src/context/Notifications.js — reducer + state/dispatch tách riêng
import { createContext, useContext, useReducer } from 'react';

const StateCtx = createContext(null);
const DispatchCtx = createContext(null);

let nextId = 1;

function reducer(state, action) {
  switch (action.type) {
    case 'push':
      return [{ id: nextId++, text: action.text, read: false }, ...state];
    case 'dismiss':
      return state.filter((n) => n.id !== action.id);
    case 'markAllRead':
      return state.map((n) => (n.read ? n : { ...n, read: true }));
    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  return (
    <DispatchCtx.Provider value={dispatch}>
      <StateCtx.Provider value={items}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider');
  return ctx;
}

export function useNotificationsDispatch() {
  const ctx = useContext(DispatchCtx);
  if (!ctx) throw new Error('useNotificationsDispatch must be used inside NotificationsProvider');
  return ctx;
}
`;

const APP = `// src/App.js — ghép Provider và các phần giao diện
import { memo, useRef } from 'react';
import { AuthProvider, ROLES, useAuth, useAuthDispatch } from './context/AuthContext';
import { Can, withPermission } from './context/permissions';
import { FeatureFlagsProvider, useFlag } from './context/FeatureFlags';
import { NotificationsProvider, useNotifications, useNotificationsDispatch } from './context/Notifications';

const ROOT_FLAGS = { newCheckout: false, darkMode: true };
const BETA_FLAGS = { newCheckout: true };

function Bell() {
  const items = useNotifications();
  const unread = items.filter((n) => !n.read).length;
  return <span className="bell">🔔 <span id="bell-count">{unread}</span></span>;
}

function RoleSwitcher() {
  const { role } = useAuth();
  const dispatch = useAuthDispatch();
  return (
    <select id="role-select" value={role} onChange={(e) => dispatch({ type: 'switchRole', role: e.target.value })}>
      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
    </select>
  );
}

function Header() {
  const { user, role } = useAuth();
  return (
    <header>
      <strong>CT Ops</strong>
      <span id="who">{user ? ´@{user.name} (@{role})´ : 'Guest'}</span>
      <span className="spacer" />
      <RoleSwitcher />
      <Bell />
    </header>
  );
}

function OrdersPanel() {
  return (
    <section id="orders">
      <h2>Order #1001</h2>
      <Can do="orders:edit" fallback={<p id="read-only" className="muted">Read-only access</p>}>
        <button id="btn-edit-order" type="button">Edit</button>
      </Can>{' '}
      <Can do="orders:delete">
        <button id="btn-delete-order" type="button">Delete</button>
      </Can>
    </section>
  );
}

function Reports() {
  return <section id="reports"><h2>Reports</h2><p>Revenue this month: 1,740,000 ₫</p></section>;
}
const GuardedReports = withPermission(Reports, 'reports:view', () => <p id="no-reports" className="muted">Reports are for admins</p>);

function Checkout({ id }) {
  const isNew = useFlag('newCheckout');
  return <p id={id}>{isNew ? 'New checkout' : 'Classic checkout'}</p>;
}

// Composer chỉ dùng dispatch ⇒ không vẽ lại khi danh sách thông báo đổi (nhờ tách context + memo)
const Composer = memo(function Composer() {
  const dispatch = useNotificationsDispatch();
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div>
      <button id="notify-order" type="button" onClick={() => dispatch({ type: 'push', text: 'New order #1002' })}>Notify order</button>{' '}
      <button id="notify-stock" type="button" onClick={() => dispatch({ type: 'push', text: 'Low stock: Mouse' })}>Notify stock</button>{' '}
      <button id="mark-read" type="button" onClick={() => dispatch({ type: 'markAllRead' })}>Mark all read</button>
      <p id="composer-renders" className="muted">Composer renders: {renders.current}</p>
    </div>
  );
});

function NotificationList() {
  const items = useNotifications();
  const dispatch = useNotificationsDispatch();
  if (items.length === 0) return <p id="no-notifications" className="muted">No notifications</p>;
  return (
    <ul id="notifications">
      {items.map((n) => (
        <li key={n.id} className={n.read ? 'notification' : 'notification unread'}>
          <span className="text">{n.text}</span>
          <button type="button" className="dismiss" onClick={() => dispatch({ type: 'dismiss', id: n.id })}>×</button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FeatureFlagsProvider flags={ROOT_FLAGS}>
        <NotificationsProvider>
          <Header />
          <OrdersPanel />
          <GuardedReports />
          <section id="checkout">
            <Checkout id="checkout-main" />
            <div id="beta-area">
              <FeatureFlagsProvider flags={BETA_FLAGS}>
                <Checkout id="checkout-beta" />
                <DarkModeLabel />
              </FeatureFlagsProvider>
            </div>
          </section>
          <section id="notify">
            <Composer />
            <NotificationList />
          </section>
        </NotificationsProvider>
      </FeatureFlagsProvider>
    </AuthProvider>
  );
}

function DarkModeLabel() {
  return <p id="beta-dark">{useFlag('darkMode') ? 'Dark mode on' : 'Dark mode off'}</p>;
}
`;

// AUTH dùng __memo chỉ để không cảnh báo import thừa — bỏ đi cho gọn
const AUTH_GON = AUTH.replace("import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';", "import { createContext, useContext, useEffect, useReducer } from 'react';")
  .replace("// useMemo không cần cho value ở đây: state từ useReducer đã ổn định khi không đổi, dispatch luôn ổn định\nexport const __memo = useMemo;\n", "// value không cần useMemo: state của useReducer chỉ đổi tham chiếu khi thật sự đổi, dispatch luôn ổn định\n");

const S_APP = `// src/App.js — STARTER: vai trò truyền qua props, không có Context, không có thông báo
import { useState } from 'react';

function Header({ role, setRole }) {
  return (
    <header>
      <span id="who">Lan ({role})</span>
      <select id="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
        <option>admin</option><option>editor</option><option>viewer</option>
      </select>
    </header>
  );
}

export default function App() {
  const [role, setRole] = useState('viewer');
  return <Header role={role} setRole={setRole} />;
}
`;
const stubCtx = (ten, mo) => `// src/context/${ten}.js — STARTER
// ${mo}
export {};
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS };
const LOI_GIAI = {
  'src/App.js': APP, 'src/context/AuthContext.js': AUTH_GON, 'src/context/permissions.js': PERMS,
  'src/context/FeatureFlags.js': FLAGS, 'src/context/Notifications.js': NOTI, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/context/AuthContext.js': stubCtx('AuthContext', 'AuthProvider (useReducer: login/logout/switchRole) · useAuth · useAuthDispatch · ROLES · lưu localStorage "role"'),
  'src/context/permissions.js': stubCtx('permissions', 'PERMISSIONS · usePermission · <Can do fallback> · withPermission(Component, permission, Fallback)'),
  'src/context/FeatureFlags.js': stubCtx('FeatureFlags', 'FeatureFlagsProvider (gộp cờ của Provider cha) · useFlag(name)'),
  'src/context/Notifications.js': stubCtx('Notifications', 'NotificationsProvider (reducer push/dismiss/markAllRead) · useNotifications · useNotificationsDispatch'),
  ...CHUNG,
};

const KIEM = [
  // f1 auth reducer + header
  { nhom: 'f1', moTa: 'Header reads the user and role from context', kiem: 'text', selector: '#who', giaTri: 'Lan (viewer)' },
  { nhom: 'f1', moTa: 'Switching role dispatches to the reducer', kiem: 'text', selector: '#who', giaTri: 'Lan (editor)', truoc: [doi('#role-select', 'editor')] },
  { nhom: 'f1', an: true, moTa: 'Auth uses useReducer with separate state/dispatch contexts', kiem: 'ma-nguon', tep: 'src/context/AuthContext.js', khop: '^(?=[\\s\\S]*useReducer\\()(?=[\\s\\S]*AuthDispatchContext\\.Provider)(?=[\\s\\S]*AuthStateContext\\.Provider)' },
  // f2 permission matrix + <Can>
  { nhom: 'f2', moTa: 'Viewer: read-only, no edit/delete', kiem: 'danh-sach-text', selector: '#orders #read-only, #orders button', mongDoi: ['Read-only access'] },
  { nhom: 'f2', moTa: 'Editor: edit but not delete', kiem: 'danh-sach-text', selector: '#orders button', mongDoi: ['Edit'], truoc: [doi('#role-select', 'editor')] },
  { nhom: 'f2', moTa: 'Admin: edit and delete', kiem: 'danh-sach-text', selector: '#orders button', mongDoi: ['Edit', 'Delete'], truoc: [doi('#role-select', 'admin')] },
  { nhom: 'f2', an: true, moTa: 'Permissions are a data matrix', kiem: 'ma-nguon', tep: 'src/context/permissions.js', khop: 'admin\\s*:\\s*\\[[\\s\\S]*editor\\s*:\\s*\\[[\\s\\S]*viewer\\s*:\\s*\\[' },
  // f3 HOC
  { nhom: 'f3', moTa: 'HOC shows the fallback without permission', kiem: 'text', selector: '#no-reports', giaTri: 'Reports are for admins' },
  { nhom: 'f3', moTa: 'HOC renders the component for admins', kiem: 'danh-sach-text', selector: '#reports h2, #no-reports', mongDoi: ['Reports'], truoc: [doi('#role-select', 'admin')] },
  { nhom: 'f3', an: true, moTa: 'withPermission returns a component with a displayName', kiem: 'ma-nguon', tep: 'src/context/permissions.js', khop: 'function\\s+withPermission\\s*\\([\\s\\S]*displayName' },
  // f4 feature flags
  { nhom: 'f4', moTa: 'Root flags: classic checkout outside the beta area', kiem: 'text', selector: '#checkout-main', giaTri: 'Classic checkout' },
  { nhom: 'f4', moTa: 'Nested provider overrides one flag', kiem: 'text', selector: '#checkout-beta', giaTri: 'New checkout' },
  { nhom: 'f4', moTa: 'Nested provider keeps the parent\'s other flags (merge)', kiem: 'text', selector: '#beta-dark', giaTri: 'Dark mode on' },
  // f5 notifications
  { nhom: 'f5', moTa: 'Pushing notifications updates the bell', kiem: 'danh-sach-text', selector: '#bell-count, .notification .text', mongDoi: ['2', 'Low stock: Mouse', 'New order #1002'], truoc: [click('#notify-order'), click('#notify-stock')] },
  { nhom: 'f5', moTa: 'Mark all read clears the badge', kiem: 'danh-sach-text', selector: '#bell-count, .notification.unread', mongDoi: ['0'], truoc: [click('#notify-order'), click('#notify-stock'), click('#mark-read')] },
  { nhom: 'f5', moTa: 'Dismiss removes one notification', kiem: 'danh-sach-text', selector: '.notification .text', mongDoi: ['New order #1002'], truoc: [click('#notify-order'), click('#notify-stock'), click('.notification:nth-child(1) .dismiss')] },
  { nhom: 'f5', an: true, moTa: 'Empty state', kiem: 'text', selector: '#no-notifications', giaTri: 'No notifications' },
  // f6 split contexts
  { nhom: 'f6', moTa: 'Composer does not re-render when the list changes', kiem: 'text', selector: '#composer-renders', giaTri: 'Composer renders: 1', truoc: [click('#notify-order'), click('#notify-stock'), click('#mark-read')] },
  { nhom: 'f6', an: true, moTa: 'Notifications use separate state and dispatch contexts', kiem: 'ma-nguon', tep: 'src/context/Notifications.js', khop: '^(?=[\\s\\S]*DispatchCtx\\.Provider)(?=[\\s\\S]*StateCtx\\.Provider)|^(?=[\\s\\S]*Dispatch\\w*\\.Provider)(?=[\\s\\S]*State\\w*\\.Provider)' },
  // f7 persistence
  { nhom: 'f7', moTa: 'Role survives a reload', kiem: 'text', selector: '#who', giaTri: 'Lan (admin)', truoc: [doi('#role-select', 'admin'), { hanhDong: 'tai-lai' }] },
  { nhom: 'f7', moTa: 'Saved under localStorage "role"', kiem: 'kho-cuc-bo', khoa: 'role', khop: '^editor$', truoc: [doi('#role-select', 'editor')] },
  { nhom: 'f7', an: true, moTa: 'Invalid saved role falls back to viewer', khoCucBo: { role: 'superuser' }, kiem: 'text', selector: '#who', giaTri: 'Lan (viewer)' },
  // f8 hooks guard
  { nhom: 'f8', moTa: 'Auth hooks throw outside their provider', kiem: 'ma-nguon', tep: 'src/context/AuthContext.js', khop: 'throw new Error\\([\'"]useAuth must be used inside AuthProvider' },
  { nhom: 'f8', an: true, moTa: 'Flags value memoized', kiem: 'ma-nguon', tep: 'src/context/FeatureFlags.js', khop: 'useMemo\\(' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 7: Permissions & Notifications Center — Context in depth', vi: 'DEEP LAB 7: Trung tâm phân quyền & thông báo — Context chuyên sâu' },
  phu: { en: 'FER202 · Chapter 7 (deep) · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 7 (chuyên sâu) · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>An operations console where what you can see depends on your <b>role</b>, some features are behind <b>feature flags</b>, and a <b>notification centre</b> is shared across the page. You will combine Context with <code>useReducer</code>, split state and dispatch into two contexts so components that only send actions never re-render, derive permissions from a role matrix, wrap components with a <code>&lt;Can&gt;</code> component and a higher-order component, and build a flag provider that can be <b>nested to override</b> flags for one part of the tree.</p>',
    vi: '<p>Bảng điều khiển vận hành nơi thứ bạn thấy phụ thuộc <b>vai trò</b>, một số tính năng nằm sau <b>cờ tính năng</b>, và <b>trung tâm thông báo</b> dùng chung cả trang. Bạn sẽ kết hợp Context với <code>useReducer</code>, tách state và dispatch thành hai context để component chỉ gửi action không bao giờ vẽ lại, suy quyền từ ma trận vai trò, bọc component bằng <code>&lt;Can&gt;</code> và một HOC, và dựng provider cờ có thể <b>lồng để ghi đè</b> cờ cho một nhánh cây.</p>',
  },
  chucNangChinh: [{ en: 'Auth reducer · role-based UI with &lt;Can&gt; · HOC guard · nested feature flags · notification centre · split contexts · persisted role.', vi: 'Reducer đăng nhập · giao diện theo vai trò với &lt;Can&gt; · HOC chặn quyền · cờ tính năng lồng nhau · trung tâm thông báo · tách context · lưu vai trò.' }],
  yeuCauChung: [
    { en: 'Contexts live in <code>src/context/</code>; every <code>useX()</code> hook throws <code>"useX must be used inside XProvider"</code> outside its provider.', vi: 'Context nằm trong <code>src/context/</code>; mọi hook <code>useX()</code> ném <code>"useX must be used inside XProvider"</code> khi ở ngoài provider.' },
    { en: 'No prop drilling of role, flags or notifications.', vi: 'Không truyền vai trò, cờ hay thông báo qua props nhiều tầng.' },
  ],
  cayThuMuc: `
src/
├── context/
│   ├── AuthContext.js      # AuthProvider · useAuth · useAuthDispatch · ROLES
│   ├── permissions.js      # PERMISSIONS · usePermission · Can · withPermission
│   ├── FeatureFlags.js     # FeatureFlagsProvider (nestable) · useFlag
│   └── Notifications.js    # NotificationsProvider · useNotifications · useNotificationsDispatch
├── App.js                  # Header · OrdersPanel · Reports (guarded) · Checkout · Composer · NotificationList
└── index.css (given)`,
  wireframe: `
+--------------------------------------------------------------------+
| CT Ops   Lan (editor)                     [editor v]   🔔 2        |
+--------------------------------------------------------------------+
| Order #1001        [Edit]  ([Delete] admin only)                   |
| Reports are for admins            (admin ⇒ Reports panel)          |
| Classic checkout                                                   |
|   beta area: New checkout · Dark mode on                           |
| [Notify order] [Notify stock] [Mark all read]  Composer renders: 1 |
|   • Low stock: Mouse                                       [×]     |
|   • New order #1002                                        [×]     |
+--------------------------------------------------------------------+`,
  moHinh: {
    ten: 'Contexts',
    truong: [
      ['AuthState', "{ user: { name } | null, role: 'admin' | 'editor' | 'viewer' }", { en: 'actions: login · logout · switchRole; role in localStorage "role"', vi: 'action: login · logout · switchRole; role lưu localStorage "role"' }],
      ['PERMISSIONS', '{ [role]: string[] }', { en: 'admin: view/edit/delete orders + reports; editor: view/edit; viewer: view', vi: 'admin: xem/sửa/xoá đơn + báo cáo; editor: xem/sửa; viewer: xem' }],
      ['Flags', '{ [flag]: boolean }', { en: 'nested provider = { ...parent, ...flags }', vi: 'provider lồng = { ...cha, ...flags }' }],
      ['Notification', '{ id, text, read }', { en: 'newest first; actions push · dismiss · markAllRead', vi: 'mới nhất trước; action push · dismiss · markAllRead' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Auth with useReducer', vi: 'Đăng nhập bằng useReducer' }, diem: 1.5, yeuCau: [{ en: '<code>AuthProvider</code> = <code>useReducer</code> (<code>login</code>, <code>logout</code>, <code>switchRole</code>) with state and dispatch in two contexts. <code>#who</code> <code>Lan (viewer)</code>; <code>#role-select</code> switches role.', vi: '<code>AuthProvider</code> = <code>useReducer</code> (<code>login</code>, <code>logout</code>, <code>switchRole</code>) với state và dispatch ở hai context. <code>#who</code> <code>Lan (viewer)</code>; <code>#role-select</code> đổi vai trò.' }] },
    { ten: { en: 'Permission matrix & &lt;Can&gt;', vi: 'Ma trận quyền & &lt;Can&gt;' }, diem: 1.5, yeuCau: [{ en: '<code>&lt;Can do="orders:edit" fallback={…}&gt;</code> renders <code>#btn-edit-order</code> (editor, admin) or <code>#read-only</code>; <code>#btn-delete-order</code> only for admin.', vi: '<code>&lt;Can do="orders:edit" fallback={…}&gt;</code> vẽ <code>#btn-edit-order</code> (editor, admin) hoặc <code>#read-only</code>; <code>#btn-delete-order</code> chỉ cho admin.' }], viDu: { en: 'editor ⇒ [Edit] only · admin ⇒ [Edit] [Delete]', vi: 'editor ⇒ chỉ [Edit] · admin ⇒ [Edit] [Delete]' } },
    { ten: { en: 'Higher-order component', vi: 'Higher-order component' }, diem: 1, yeuCau: [{ en: '<code>withPermission(Reports, \'reports:view\', Fallback)</code> ⇒ <code>#reports</code> for admins, otherwise <code>#no-reports</code> <code>Reports are for admins</code>; set a <code>displayName</code>.', vi: '<code>withPermission(Reports, \'reports:view\', Fallback)</code> ⇒ <code>#reports</code> cho admin, còn lại <code>#no-reports</code> <code>Reports are for admins</code>; đặt <code>displayName</code>.' }] },
    { ten: { en: 'Nested feature flags', vi: 'Cờ tính năng lồng nhau' }, diem: 1.5, yeuCau: [{ en: 'Root <code>{ newCheckout: false, darkMode: true }</code>; inside <code>#beta-area</code> a nested provider with <code>{ newCheckout: true }</code>. <code>#checkout-main</code> <code>Classic checkout</code>, <code>#checkout-beta</code> <code>New checkout</code>, <code>#beta-dark</code> <code>Dark mode on</code> (inherited).', vi: 'Gốc <code>{ newCheckout: false, darkMode: true }</code>; trong <code>#beta-area</code> có provider lồng <code>{ newCheckout: true }</code>. <code>#checkout-main</code> <code>Classic checkout</code>, <code>#checkout-beta</code> <code>New checkout</code>, <code>#beta-dark</code> <code>Dark mode on</code> (kế thừa).' }] },
    { ten: { en: 'Notification centre', vi: 'Trung tâm thông báo' }, diem: 1.5, yeuCau: [{ en: '<code>#notify-order</code>/<code>#notify-stock</code> push (newest first), <code>#mark-read</code>, <code>.notification(.unread) .text .dismiss</code>, <code>#bell-count</code> = unread in the header, <code>#no-notifications</code> when empty.', vi: '<code>#notify-order</code>/<code>#notify-stock</code> thêm (mới nhất trước), <code>#mark-read</code>, <code>.notification(.unread) .text .dismiss</code>, <code>#bell-count</code> = số chưa đọc ở header, <code>#no-notifications</code> khi rỗng.' }] },
    { ten: { en: 'Split contexts avoid re-renders', vi: 'Tách context để tránh vẽ lại' }, diem: 1, yeuCau: [{ en: 'The memoized <code>Composer</code> uses only the dispatch context; <code>#composer-renders</code> stays <code>Composer renders: 1</code> while notifications change.', vi: '<code>Composer</code> (memo) chỉ dùng context dispatch; <code>#composer-renders</code> giữ <code>Composer renders: 1</code> khi danh sách thông báo đổi.' }] },
    { ten: { en: 'Persisted role', vi: 'Lưu vai trò' }, diem: 1, yeuCau: [{ en: 'Role saved in localStorage <code>role</code> and restored (lazy init of the reducer); an unknown saved value falls back to <code>viewer</code>.', vi: 'Vai trò lưu localStorage <code>role</code> và khôi phục (khởi tạo lười của reducer); giá trị lưu lạ thì về <code>viewer</code>.' }] },
    { ten: { en: 'Guarded hooks & memo', vi: 'Hook có chốt & memo' }, diem: 1, yeuCau: [{ en: 'Hooks throw outside their providers; the flags value is memoized.', vi: 'Hook báo lỗi khi ngoài provider; value của cờ được memo.' }] },
  ],
  idBatBuoc: [
    ['#who · #role-select · #bell-count', { en: 'header', vi: 'header' }],
    ['#orders · #btn-edit-order · #btn-delete-order · #read-only', { en: 'orders', vi: 'đơn hàng' }],
    ['#reports · #no-reports', { en: 'reports', vi: 'báo cáo' }],
    ['#checkout-main · #beta-area · #checkout-beta · #beta-dark', { en: 'flags', vi: 'cờ' }],
    ['#notify-order · #notify-stock · #mark-read · #composer-renders · .notification .text .dismiss · #no-notifications', { en: 'notifications', vi: 'thông báo' }],
  ],
  truDiem: [
    { en: '<code>if (role === \'admin\' || role === \'editor\')</code> scattered through components instead of one permission matrix.', vi: '<code>if (role === \'admin\' || role === \'editor\')</code> rải khắp component thay vì một ma trận quyền.' },
    { en: 'One context holding both state and dispatch — every button re-renders on every notification.', vi: 'Một context chứa cả state lẫn dispatch — mọi nút vẽ lại với mọi thông báo.' },
    { en: 'Nested flag provider that REPLACES the parent flags (dark mode disappears in the beta area).', vi: 'Provider cờ lồng THAY THẾ cờ của cha (dark mode mất trong vùng beta).' },
    { en: 'Hiding the Delete button with CSS only.', vi: 'Chỉ ẩn nút Delete bằng CSS.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-7-deep-permissions-center',
  ten: 'Deep Lab 7 — Permissions & Notifications Center (Context in depth)',
  khoa: KHOA,
  baiHoc: 'fer202-7-1-context',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 7 — Permissions & Notifications Center (reducer + split contexts · <Can> · HOC · nested flags)', vi: 'Deep Lab 7 — Trung tâm phân quyền & thông báo (reducer + tách context · <Can> · HOC · cờ lồng)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['Context + useReducer', 'split state/dispatch contexts', 'role-based access control', 'higher-order components', 'nested providers', 'feature flags', 'lazy reducer init'],
      tienQuyet: ['Lab 7 — Team Dashboard', '8.2 useContext & useReducer'],
      the: ['fer202', 'deep-lab', 'context', 'useReducer'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'RBAC (role-based access control)', vi: 'phân quyền theo vai trò' },
        { en: 'feature flag', vi: 'cờ bật/tắt tính năng không cần deploy lại' },
        { en: 'HOC', vi: 'hàm nhận component, trả component mới' },
        { en: 'dispatch context', vi: 'context chỉ chứa hàm dispatch (không bao giờ đổi)' },
        ...tn('rubric', 'persist'),
      ],
      goiY: [
        'Tách context: <DispatchCtx.Provider value={dispatch}><StateCtx.Provider value={state}>…; component chỉ cần gửi action thì useContext(DispatchCtx) — dispatch không bao giờ đổi nên nó không vẽ lại.',
        'usePermission(p) = (PERMISSIONS[role] ?? []).includes(p); <Can> trả children hoặc fallback.',
        'Provider lồng: const parent = useContext(FlagsContext); value = useMemo(() => ({ ...parent, ...flags }), [parent, flags]).',
        'useReducer(reducer, undefined, init) với init đọc localStorage; useEffect ghi lại khi role đổi.',
      ],
      loiHayGap: [
        'Dùng <code>createContext(null)</code> cho cờ rồi lồng Provider ⇒ cha null, spread vẫn chạy nhưng useFlag ngoài Provider lỗi; mặc định <code>{}</code> cho cờ là hợp lý.',
        'Component Composer dùng <code>useNotifications()</code> chỉ để lấy dispatch ⇒ vẽ lại mỗi lần danh sách đổi.',
        'HOC tạo component mới BÊN TRONG render ⇒ mỗi lần render là component khác, state bị xoá.',
        'Truyền <code>flags</code> bằng object literal trong JSX ⇒ value mới mỗi render (ở đây dùng hằng ngoài component).',
      ],
      moTaNgan: 'Deep lab chương 7: Context + useReducer, tách state/dispatch, ma trận quyền với <Can> và HOC withPermission, cờ tính năng lồng có gộp, trung tâm thông báo, lưu vai trò. Thang 10.',
      giaiThich: '<p>Mỗi mối quan tâm là một provider nhỏ. Reducer gom mọi thay đổi trạng thái đăng nhập và thông báo; tách <b>state</b> và <b>dispatch</b> ra hai context là mẫu tối ưu của chính đội React: dispatch không bao giờ đổi nên component chỉ gửi action (Composer) không vẽ lại. Quyền là <b>dữ liệu</b> (ma trận) — thêm vai trò mới không phải sửa component; <code>&lt;Can&gt;</code> và HOC chỉ là hai cách đóng gói cùng một câu hỏi <code>usePermission</code>. Provider cờ đọc giá trị của provider cha rồi ghi đè một phần, nên vùng beta có tính năng mới mà vẫn kế thừa phần còn lại.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/learn/scaling-up-with-reducer-and-context',
    },
  ],
});
