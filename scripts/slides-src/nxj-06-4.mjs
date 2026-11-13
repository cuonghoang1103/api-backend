/*DU_LIEU*/
const DU_LIEU = {
 "n6-4:file:src/lib/auth.tsx": "'use client';\nimport { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';\n\ntype Auth = { user: string; logout: () => void };\nconst AuthCtx = createContext<Auth | undefined>(undefined);\n\nexport function useAuth() {\n  const v = useContext(AuthCtx);\n  if (!v) throw new Error('useAuth phải nằm trong <AuthProvider>');\n  return v;                                              // từ đây v là Auth, hết undefined\n}\n\nexport function AuthLiteral({ children }: { children: ReactNode }) {\n  const [q, setQ] = useState('');\n  const logout = useCallback(() => {}, []);\n  return (\n    <AuthCtx value={{ user: 'An', logout }}>             {/* ✗ object mới mỗi lần render */}\n      <input id=\"q-lit\" value={q} onChange={(e) => setQ(e.target.value)} placeholder=\"gõ ở provider (viết thẳng)\" className=\"rounded border px-1\" />\n      {children}\n    </AuthCtx>\n  );\n}\n\nexport function AuthMemo({ children }: { children: ReactNode }) {\n  const [q, setQ] = useState('');\n  const logout = useCallback(() => {}, []);\n  const value = useMemo(() => ({ user: 'An', logout }), [logout]);   // ✓ cùng object khi không đổi\n  return (\n    <AuthCtx value={value}>\n      <input id=\"q-memo\" value={q} onChange={(e) => setQ(e.target.value)} placeholder=\"gõ ở provider (useMemo)\" className=\"rounded border px-1\" />\n      {children}\n    </AuthCtx>\n  );\n}\n",
 "n6-4:file:src/app/ngu-canh/page.tsx": "'use client';\nimport { createContext, memo, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';\nimport { AuthLiteral, AuthMemo, useAuth } from '@/lib/auth';\n\nconst render: Record<string, number> = {};\nfunction useDemRender(ten: string) {                      // đếm lần render đã commit\n  useEffect(() => { render[ten] = (render[ten] ?? 0) + 1; });\n}\n\n// 1 — chép NGUYÊN đoạn mã của bài web\nconst ThemeContext = createContext('light');\nfunction App() {\n  const [theme, setTheme] = useState('dark');\n  return (\n    <ThemeContext.Provider value={theme}>\n      <Page />              // Page and everything under it can read theme\n    </ThemeContext.Provider>\n  );\n}\nfunction Page() { return <DeepButton />; }\nfunction DeepButton() {\n  const theme = useContext(ThemeContext);   // reads 'dark', however deep\n  return <button className={theme}>Click</button>;\n}\n\n// 2 — React 19: <Ctx value> (không cần .Provider); context đi vòng qua tầng giữa\nconst Theme = createContext<'sáng' | 'tối'>('sáng');\nconst TangGiua = memo(function TangGiua() {\n  useDemRender('tangGiua');\n  return <span className=\"pl-2\">tầng giữa → <NutSau /></span>;\n});\nfunction NutSau() {\n  const t = useContext(Theme);\n  useDemRender('nutSau');\n  return <b id=\"nut-sau\">{t}</b>;\n}\nfunction ThemeDemo() {\n  const [t, setT] = useState<'sáng' | 'tối'>('sáng');\n  return (\n    <Theme value={t}>\n      <p><button id=\"doi-theme\" onClick={() => setT(t === 'sáng' ? 'tối' : 'sáng')} className=\"rounded border px-2\">đổi theme</button><TangGiua /></p>\n    </Theme>\n  );\n}\n\n// 3 — giá trị provider: object viết thẳng vs useMemo\nfunction TenNguoiDung({ ten }: { ten: string }) {\n  const { user } = useAuth();\n  useDemRender(ten);\n  return <b className=\"px-2\">{user}</b>;\n}\n\n// 4 — một provider gộp theme + giỏ hàng, hay tách hai\ntype Gop = { theme: string; gio: number; them: () => void };\nconst GopCtx = createContext<Gop>({ theme: 'sáng', gio: 0, them: () => {} });\nfunction GopProvider({ children }: { children: ReactNode }) {\n  const [gio, setGio] = useState(0);\n  const value = useMemo(() => ({ theme: 'sáng', gio, them: () => setGio((g) => g + 1) }), [gio]);\n  return <GopCtx value={value}>{children}</GopCtx>;\n}\nfunction ThemeGop() { const { theme } = useContext(GopCtx); useDemRender('themeGop'); return <span>{theme}</span>; }\nfunction GioGop() { const { gio, them } = useContext(GopCtx); return <button id=\"gio-gop\" onClick={them} className=\"rounded border px-2\">giỏ: {gio}</button>; }\n\nconst ThemeCtx = createContext('sáng');\nconst GioCtx = createContext({ gio: 0, them: () => {} });\nfunction TachProvider({ children }: { children: ReactNode }) {\n  const [gio, setGio] = useState(0);\n  const gioV = useMemo(() => ({ gio, them: () => setGio((g) => g + 1) }), [gio]);\n  return <ThemeCtx value=\"sáng\"><GioCtx value={gioV}>{children}</GioCtx></ThemeCtx>;\n}\nfunction ThemeTach() { const theme = useContext(ThemeCtx); useDemRender('themeTach'); return <span>{theme}</span>; }\nfunction GioTach() { const { gio, them } = useContext(GioCtx); return <button id=\"gio-tach\" onClick={them} className=\"rounded border px-2\">giỏ: {gio}</button>; }\n\nif (typeof window !== 'undefined') Object.assign(window, { __render: render });   // để đo\n\nexport default function NguCanh() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <div id=\"web\" className=\"rounded border p-2\"><App /></div>\n      <ThemeDemo />\n      <AuthLiteral><span>viết thẳng:<TenNguoiDung ten=\"lit\" /></span></AuthLiteral>\n      <AuthMemo><span>useMemo:<TenNguoiDung ten=\"memo\" /></span></AuthMemo>\n      <GopProvider><p>gộp: theme <ThemeGop /> · <GioGop /></p></GopProvider>\n      <TachProvider><p>tách: theme <ThemeTach /> · <GioTach /></p></TachProvider>\n    </div>\n  );\n}\n",
 "n6-4:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|ngu-canh'\n✓ Compiled successfully in 1046ms\n├ ○ /ngu-canh\n$ npx eslint -f json src/app/ngu-canh/page.tsx | node tom-eslint.cjs\n13:17 warn  @typescript-eslint/no-unused-vars — 'setTheme' is assigned a value but never used.\n16:15 error react/jsx-no-comment-textnodes — Comments inside children section of tag should be placed inside braces",
 "n6-4:file:src/app/ngu-canh/thieu/page.tsx": "'use client';\nimport { useAuth } from '@/lib/auth';\n\nexport default function Thieu() {\n  const { user } = useAuth();                             // ✗ không có AuthProvider bên trên\n  return <p>{user}</p>;\n}\n",
 "n6-4:thieu": "$ npm run build 2>&1 | grep -E 'Error occurred|useAuth phải|Export encountered|Next.js build worker'\nError occurred prerendering page \"/ngu-canh/thieu\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: useAuth phải nằm trong <AuthProvider>\n>  9 |   if (!v) throw new Error('useAuth phải nằm trong <AuthProvider>');\nExport encountered an error on /ngu-canh/thieu/page: /ngu-canh/thieu, exiting the build.\n⨯ Next.js build worker exited with code: 1 and signal: null",
 "n6-4:file:src/app/ngu-canh/sv/page.tsx": "import { createContext, useContext } from 'react';      // ✗ Server Component (không 'use client')\n\nconst Ctx = createContext('sáng');\nexport default function Sv() {\n  const t = useContext(Ctx);\n  return <p>{t}</p>;\n}\n",
 "n6-4:sv": "$ npm run build 2>&1 | grep -vE '^\\s*$' | sed -n '/rror/,+6p' | head -14\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./src/app/ngu-canh/sv/page.tsx:1:10\nError: You're importing a module that depends on `createContext` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `\"use client\"` directive.\n    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client\n> 1 | import { createContext, useContext } from 'react';      // ✗ Server Component (không 'use c...\n    |          ^^^^^^^^^^^^^\nEcmascript file had an error\n    at ignore-listed frames\n$ npm run build 2>&1 | grep -E 'Compiled|ngu-canh'\n✓ Compiled successfully in 441ms\n├ ○ /ngu-canh",
 "n6-4:mo": "$ curl -s -o /dev/null -w 'next start GET /ngu-canh → %{http_code}\\n' localhost:19354/ngu-canh\nnext start GET /ngu-canh → 200",
 "n6-4:dung": "",
 "anh-nxj-6-4:nc-dau": {
  "url": "http://127.0.0.1:19354/ngu-canh",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#web": [
    24,
    24,
    592,
    46
   ],
   "#nut-sau": [
    238,
    81,
    43,
    23
   ],
   "#q-lit": [
    24,
    116,
    237,
    30
   ],
   "#q-memo": [
    24,
    154,
    237,
    30
   ],
   "#gio-gop": [
    176,
    192,
    65,
    30
   ],
   "#gio-tach": [
    181,
    230,
    65,
    30
   ],
   "#doi-theme": [
    24,
    78,
    101,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-4:nc-sau": {
  "url": "http://127.0.0.1:19354/ngu-canh",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#web": [
    24,
    24,
    592,
    46
   ],
   "#nut-sau": [
    238,
    81,
    24,
    23
   ],
   "#q-lit": [
    24,
    116,
    237,
    30
   ],
   "#q-memo": [
    24,
    154,
    237,
    30
   ],
   "#gio-gop": [
    176,
    192,
    64,
    30
   ],
   "#gio-tach": [
    181,
    230,
    64,
    30
   ],
   "#doi-theme": [
    24,
    78,
    101,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-4:nc-start": {
  "url": "http://127.0.0.1:19354/ngu-canh",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#web": [
    24,
    24,
    592,
    46
   ],
   "#nut-sau": [
    238,
    81,
    24,
    23
   ],
   "#q-lit": [
    24,
    116,
    237,
    30
   ],
   "#q-memo": [
    24,
    154,
    237,
    30
   ],
   "#gio-gop": [
    176,
    192,
    64,
    30
   ],
   "#gio-tach": [
    181,
    230,
    64,
    30
   ],
   "#doi-theme": [
    24,
    78,
    101,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "web": "Click              // Page and everything under it can read theme",
   "r0": {
    "nutSau": 1,
    "tangGiua": 1,
    "lit": 1,
    "memo": 1,
    "themeGop": 1,
    "themeTach": 1
   },
   "theme": "tối",
   "r1": {
    "nutSau": 2,
    "tangGiua": 1,
    "lit": 1,
    "memo": 1,
    "themeGop": 1,
    "themeTach": 1
   },
   "r2": {
    "nutSau": 2,
    "tangGiua": 1,
    "lit": 4,
    "memo": 1,
    "themeGop": 1,
    "themeTach": 1
   },
   "r3": {
    "nutSau": 2,
    "tangGiua": 1,
    "lit": 4,
    "memo": 1,
    "themeGop": 1,
    "themeTach": 1
   },
   "r4": {
    "nutSau": 2,
    "tangGiua": 1,
    "lit": 4,
    "memo": 1,
    "themeGop": 4,
    "themeTach": 1
   }
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, path, br, tiers, zm } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-06-4', code: 'NXJ 6.4', title: 'useContext: data without prop drilling', sub: 'Chapter 6 · Lesson 6.4' };
const O = (k) => { const v = DU_LIEU[`n6-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-6-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-06-4', ten, o);
const K = AN('nc-start').ketQua;
const P = O('file:src/app/ngu-canh/page.tsx'), AU = O('file:src/lib/auth.tsx');
for (const s of ['<Page />              // Page and everything under it can read theme', 'const TangGiua = memo(', '<Theme value={t}>', "const value = useMemo(() => ({ theme: 'sáng', gio, them: () => setGio((g) => g + 1) }), [gio]);"])
  if (!P.includes(s)) throw new Error('ngu-canh/page.tsx không có: ' + s);
for (const s of ['const AuthCtx = createContext<Auth | undefined>(undefined);', "if (!v) throw new Error('useAuth phải nằm trong <AuthProvider>');", "<AuthCtx value={{ user: 'An', logout }}>", "const value = useMemo(() => ({ user: 'An', logout }), [logout]);"])
  if (!AU.includes(s)) throw new Error('auth.tsx không có: ' + s);
const r1 = K.r1, r2 = K.r2, r3 = K.r3, r4 = K.r4;
if (K.web !== 'Click              // Page and everything under it can read theme' || K.theme !== 'tối' || r1.nutSau !== 2 || r1.tangGiua !== 1 || r2.lit !== 4 || r3.memo !== 1 || r4.themeGop !== 4 || r4.themeTach !== 1)
  throw new Error('số đo 6.4 đổi — xem lại slide');
const TR = O('trang'), ESL = TR.slice(TR.indexOf('$ npx eslint')).trim(), TH = O('thieu').trim(), SV = O('sv');
if (!/16:15 error react\/jsx-no-comment-textnodes/.test(ESL) || !/Error: useAuth phải nằm trong <AuthProvider>/.test(TH) || !/This API is only available in Client Components/.test(SV)) throw new Error('lỗi 6.4 đổi');
const SV1 = SV.split('\n').filter((l) => /Build error occurred|^\.\/src|You're importing/.test(l)).join('\n');
if (SV1.split('\n').length !== 3) throw new Error('SV1 6.4');

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.4', t: 'useContext: data without<br>prop drilling', sub: 'Hand a value to a whole subtree without threading it through every layer',
    en: 'Lesson six point four: useContext. Lifting state up is right until the state has to travel through many components that do not use it, only to pass it down — prop drilling. useContext lets any component in a subtree read a value directly, however deep, without passing it as a prop at every level.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Prop drilling, and the three steps of context: create · provide · read (and React 19's <code>&lt;Ctx value&gt;</code>)</li>
    <li>A bug in this lesson's own snippet: a <code>//</code> comment between JSX tags is <b>text</b> — measured</li>
    <li>Context skips the middle layers — and re-renders every consumer — <b>measured</b></li>
    <li><code>createContext&lt;T | undefined&gt;</code> + a hook that throws · what context is (not) for</li>
    <li>Two costs, measured: an object literal value, one provider for fast and slow data · and Next.js: context is client-only</li></ul>`,
    en: 'Five takeaways: prop drilling and the three steps of context; a bug in this lesson\'s own snippet, measured; how context skips the middle and re-renders consumers, measured; creating context with undefined and a throwing hook; and two measured costs, plus the Next.js rule that context is client-only.' },
  { t: 'Prop drilling — and the shortcut', body: path([{ t: 'App', s: 'owns user' }, { t: 'Layout', s: 'passes user', mau: '#c0392b' }, { t: 'Sidebar', s: 'passes user', mau: '#c0392b' }, { t: 'Avatar', s: 'reads user', on: true }], { h: 130, fs: 22, nhan: ['user', 'user', 'user'] }) +
      path([{ t: 'AuthProvider', s: 'value = user', on: true }, { t: 'Layout', s: 'knows nothing' }, { t: 'Sidebar', s: 'knows nothing' }, { t: 'Avatar', s: 'useAuth()', on: true }], { h: 130, fs: 22 }) +
      two(box('Prop drilling', 'Layout and Sidebar take a prop they never use, only to forward it. Rename it once and you edit four files.', 'do2'),
        box('Context', 'The provider makes the value available to its whole subtree; the deep component reads the <b>nearest</b> provider above it directly.', 'xanh'), ''),
    en: 'Prop drilling: App owns the user, Layout and Sidebar receive a prop they never use, only to forward it to Avatar. Context is the shortcut: a provider makes the value available to its whole subtree, and Avatar reads the nearest provider above it directly; the layers in between know nothing about it.' },
  { t: 'Three steps: create · provide · read', body: two(tsx(`// 1 · create a context (with a default)
const ThemeContext = createContext('light');

// 2 · provide: a value for everything inside
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>        {/* React 19 */}
      <Page />  {/* Page and everything under it */}
    </ThemeContext>
  );
}

// 3 · read it, however deep — no props in between
function DeepButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}`, { sm: true, hl: [2, 8, 16] }), D(box('React 19', `<code>&lt;ThemeContext value&gt;</code> works as the provider; <code>&lt;ThemeContext.Provider&gt;</code> still works too (this lab ran both on React 19.3).`, 'lam'),
      box('Nearest provider wins', 'A consumer reads the closest provider above it. With no provider at all it gets the default passed to <code>createContext</code>.', 'xanh'),
      box('When the value changes', 'Every component that reads this context re-renders.', '')), 'r64'),
    en: 'Three steps. Create a context with a default. Provide it: everything inside the provider can read the value — in React nineteen you can write the context itself as the provider. Read it with useContext, however deep, with no props in between. A consumer reads the nearest provider above it, and re-renders when its value changes.' },
  { t: 'A bug in this lesson\'s snippet: // between JSX tags is TEXT', body: two(D(tsx(`<ThemeContext.Provider value={theme}>
  <Page />              // Page and everything under it can read theme
</ThemeContext.Provider>`, { sm: true, hl: [2] }), B('nc-dau', { vp: 640, h: 80, w: 640, url: 'localhost:3000/ngu-canh · the snippet, copied as written', mark: [[24, 24, 592, 46, 'rendered text']] }),
      tn(ESL, { fs: 14, wrap: 80, title: 'npx eslint' })), D(cmp(['Measured', 'value'], [['text inside #web', `<code>${K.web.replace(/ {2,}/g, ' ')}</code>`], ['tsc · next build', 'green — no error at all']], { hl: [0] }),
      box('Fix', 'Inside JSX children, a comment must be in braces: <code>{/* Page and everything under it */}</code>. The lesson has been corrected.', 'xanh')), 'r64'),
    en: 'A bug in this lesson\'s own snippet, measured. Between JSX tags, double-slash is not a comment: it is text. Copied as written, the page shows the button and then the words "slash slash Page and everything under it can read theme". tsc and next build were green; only ESLint\'s jsx-no-comment-textnodes rule caught it. Inside JSX, write the comment in braces.' },
  { t: 'Context skips the middle — measured', body: two(tsx(`const TangGiua = memo(function TangGiua() {
  return <span>middle → <NutSau /></span>;
});
function NutSau() {
  const t = useContext(Theme);   // reads the context
  return <b>{t}</b>;
}
<Theme value={t}>
  <button onClick={() => setT(…)}>đổi theme</button>
  <TangGiua />
</Theme>`, { sm: true, hl: [1, 5] }), D(cmp(['Click "đổi theme" once', 'renders'], [['memo middle layer', `<b>${r1.tangGiua}</b> (did not re-render)`], ['deep consumer', `<b>${r1.nutSau}</b> → now "${K.theme}"`]], { hl: [1] }),
      box('Straight past memo', 'The middle layer is memoised and its props did not change, so it was skipped. The consumer still re-rendered: a context change reaches every consumer directly.', 'lam')), 'r64') +
      tiers([['layers', 'Provider value changes', 'sáng → tối', '#0070f3'], ['box', 'memo middle: props equal ⇒ skipped', `${r1.tangGiua} render`, '#64748b'], ['eye', 'useContext consumer ⇒ re-renders', `${r1.nutSau} renders`, '#1f8a3b']], { th: 40, gap: 16 }),
    en: 'Context skips the middle, measured. The middle layer is wrapped in memo; the deep component reads the theme. One click on change theme: the middle layer did not re-render, still one render, and the consumer re-rendered — two — showing "tối". A context change reaches every consumer directly, straight past memo.' },
  { t: 'What context is for — and what it is not for', body: cmp(['', 'Good fit', 'Poor fit'], [
      ['What', 'app-wide, slow-changing values many components need: theme, current user, locale, a toast API', 'high-frequency state (a value changing every keystroke); passing something one or two levels'],
      ['Why', 'distribution: get a value to where it is needed', 'every consumer re-renders on every change; plain props are simpler'],
      ['Pair it with', 'useReducer or a store holds and updates the state', 'Zustand (Chapter 14) for heavy, frequently updated global state'],
    ], { hl: [0] }) + box('How cuongthai.com does it', 'Context for the good-fit cases only: the auth/user context, the theme provider, and the Notes editor\'s own <code>NotesThemeProvider</code> (light/dark/brown). Fast-changing feature state lives in Zustand stores — exactly to avoid re-rendering half the tree on every update.', 'lam'),
    en: 'What context is for. Good fit: app-wide, slow-changing values that many components need — theme, current user, language, a toast API. Poor fit: state that changes every keystroke, or passing something one or two levels. Context solves distribution, not state management; pair it with useReducer or a store. cuongthai.com uses it for auth, theme and the Notes theme, and Zustand for fast feature state.' },
  { t: 'Create it with undefined + a hook that throws', body: two(zm(tsx(`type Auth = { user: string; logout: () => void };
const AuthCtx = createContext<Auth | undefined>(undefined);

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth phải nằm trong <AuthProvider>');
  return v;   // from here on v is Auth, not undefined
}`, { sm: true, hl: [2, 6] }), 0.92), D(tn(TH, { fs: 13, wrap: 56, title: 'npm run build — a page using useAuth() with no provider' }),
      box('Why throw?', 'A silent default (<code>undefined</code>) would crash later, somewhere confusing. The throw fails loudly at the exact spot — here at build time, while prerendering — and narrows the type: after it, <code>v</code> is <code>Auth</code>.', 'xanh')), 'r64'),
    en: 'Create the context with undefined, and a hook that throws when there is no provider. Measured: a page that called useAuth with no provider above it failed next build while prerendering, with our exact message. A silent default would crash later somewhere confusing. And after the throw, TypeScript knows v is an Auth, not undefined.' },
  { t: 'Trap: an object literal as the provider value — measured', body: two(tsx(`// ✗ a new object every time the provider renders
<AuthCtx value={{ user: 'An', logout }}>

// ✓ the same object while user/logout are unchanged
const value = useMemo(
  () => ({ user: 'An', logout }), [logout]);
<AuthCtx value={value}>`, { hl: [2, 5, 6] }), D(cmp(['Type "abc" in the provider\'s own input', 'consumer renders'], [['value={{ … }}', `<b>${r2.lit}</b> (1 + 3 keystrokes) ✗`], ['value={useMemo(…)}', `<b>${r3.memo}</b> ✓`]], { hl: [0] }),
      box('Why', 'Typing re-renders the provider component. A literal is a <b>new object</b> each time, so React sees a changed value and re-renders every consumer — although user and logout are identical.', 'do2')), 'r64') +
      box('One of the few places memoisation is never premature', 'Near the app root that is the whole tree, on every keystroke in an unrelated input. The fix is mechanical: <code>useMemo(() =&gt; ({ user, logout }), [user, logout])</code>.', 'lam'),
    en: 'The trap: an object literal as the provider value, measured. The provider has its own input. Typing three letters with value written as a literal re-rendered the consumer three extra times — four renders — although user and logout never changed. With the value in useMemo: one render. This is one of the few places memoisation is never premature.' },
  { t: 'Split contexts by how fast they change — measured', body: two(tsx(`// ✗ one provider: theme (rare) + cart (often)
<GopCtx value={{ theme, gio, them }}>

// ✓ two providers
<ThemeCtx value="sáng">
  <GioCtx value={{ gio, them }}>{children}</GioCtx>
</ThemeCtx>`, { hl: [2, 5, 6] }), D(cmp(['3 clicks "giỏ" (cart)', 'theme-only consumer renders'], [['one combined provider', `<b>${r4.themeGop}</b> ✗`], ['split providers', `<b>${r4.themeTach}</b> ✓`]], { hl: [0] }),
      box('Read one field, re-render for all', 'The theme-only consumer reads <code>theme</code>, which never changed — but its context value is the whole object, and the cart changed it.', 'do2')), 'r64') +
      icards([['layers', 'Theme', 'changes twice a year'], ['box', 'Cart', 'changes every click'], ['cut', 'Different speeds ⇒ different providers', 'consumers subscribe only to what they read']], 3),
    en: 'Split contexts by how fast they change, measured. One provider holding both the theme and the cart: three clicks on the cart re-rendered a component that reads only the theme — four renders. Two providers: one render. A theme that changes twice a year and a cart that changes every click do not belong in the same provider.' },
  { t: 'Next.js: context is client-only', body: tn(SV1, { fs: 14, wrap: 110, title: 'npm run build — useContext in a Server Component' }) + two(tsx(`// app/providers.tsx
'use client';
export function Providers({ children }) {
  return <AuthProvider><ThemeProvider>
    {children}
  </ThemeProvider></AuthProvider>;
}

// app/layout.tsx (a Server Component)
<body><Providers>{children}</Providers></body>`, { sm: true, hl: [2, 10] }), D(box('Why', 'A Server Component runs once on the server and never re-renders, so there is nothing to subscribe to a context. <code>createContext</code>/<code>useContext</code> are only for Client Components.', 'lam'),
      box('The pattern', 'One client <code>Providers</code> component wraps <code>{children}</code> in the root layout. The pages inside can still be Server Components — Chapter 9.', 'xanh')), 'r64'),
    en: 'In Next.js, context is client-only. A Server Component that imports createContext fails the build: "This API is only available in Client Components." A Server Component never re-renders, so there is nothing to subscribe. The pattern: one client Providers component wraps the children in the root layout, and the pages inside can stay Server Components — chapter nine.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Context', 'a way to share a value with a subtree without prop drilling'), kw('Provider', 'wraps the subtree and supplies the value (&lt;Ctx value&gt; in React 19)'),
      kw('useContext', 'reads the nearest provider\'s value'), kw('Prop drilling', 'passing a prop through layers that do not use it'),
      kw('Consumer re-renders', 'a value change re-renders every consumer'), kw('Good fit', 'global, slow-changing data: theme, locale, current user'),
      kw('Memoised value', 'useMemo the provider value so it keeps its identity'), kw('Client-only', 'context needs "use client" in Next.js'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: context; provider; useContext; prop drilling; consumer re-renders; good fit; a memoised value; and client-only.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Create a ${c('ThemeContext')}, provide it, and read it deep down with ${c('useContext')} (comments in JSX: ${c('{/* … */}')})`,
      'Count renders: change the provider value and see every consumer re-render, while a memo middle layer stays put',
      `Write ${c('useAuth()')} that throws without a provider; give the provider value a ${c('useMemo')}`,
      'Explain why context is for global, slow-changing data — and split a fast value into its own provider',
    ]), box('Keep these', `<ul><li>Context distributes; it does not manage state</li><li>Every consumer re-renders on a change</li><li>useMemo the value; split by speed</li><li>Client-only in Next.js — a Providers wrapper</li></ul>`, 'lam'), ''),
    en: 'Your turn: create, provide and read a theme context; count renders when the value changes; write a useAuth hook that throws, and memoise the provider value; and explain why context is for global, slow data. Keep: context distributes, every consumer re-renders, memoise the value and split by speed, and in Next.js it is client-only.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — The hooks toolbox', bai: '6.4' }, S);
