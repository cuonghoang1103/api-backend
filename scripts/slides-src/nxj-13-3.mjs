/*DU_LIEU*/
const DU_LIEU = {
 "n13-3:file:src/app/toi/page.tsx": "// app/toi/page.tsx — đoạn mã của bài (class= → className=)\nexport default function Trang() {\n  return (\n    <div id=\"the\" className=\"bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-6 text-2xl\">\n      Adapts to the theme\n    </div>\n  );\n}\n",
 "n13-3:mac-dinh": "$ npm run build 2>&1 | grep -E 'Compiled|/toi'\n✓ Compiled successfully in 5.3s\n└ ○ /toi\n$ python3 doc-css.py dark:bg-gray-900      # Tailwind 4 MẶC ĐỊNH: dark: = ?\ndark:bg-gray-900       ⇒ @media (prefers-color-scheme:dark) › .dark\\:bg-gray-900{background-color:var(--color-gray-900)}\ndark:text-white        ⇒ @media (prefers-color-scheme:dark) › .dark\\:text-white{color:var(--color-white)}\n$ Chromium: #the — máy sáng · máy sáng + <html class=\"dark\"> · máy tối (prefers-color-scheme)\ntoi-sang   · rgb(255, 255, 255) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased\"\ntoi-class  · rgb(255, 255, 255) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased dark\"\ntoi-he     · lab(8.11897 0.811279 -12.254) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased\"",
 "n13-3:class": "$ sed -i '' '1a @custom-variant dark (&:where(.dark, .dark *));' src/app/globals.css      # Tailwind 4: chiến lược CLASS\n@import \"tailwindcss\";\n@custom-variant dark (&:where(.dark, .dark *));\n$ npm run build 2>&1 | grep -E 'Compiled'\n✓ Compiled successfully in 534ms\n$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py dark:bg-gray-900\ndark:bg-gray-900       ⇒ .dark\\:bg-gray-900:where(.dark,.dark *){background-color:var(--color-gray-900)}\n$ node -e \"const d=require('$HOME/Documents/video-bai-giang/scratchpad/nxj/demo/out/anh-nxj-13-3.json'); for (const k of ['toi-class2','toi-he2']) console.log(k.padEnd(10), '·', d[k].ketQua.the)\"\ntoi-class2 · lab(8.11897 0.811279 -12.254) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased dark\"\ntoi-he2    · rgb(255, 255, 255) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased\"",
 "n13-3:file:src/app/nhay-effect/BatToi.tsx": "'use client';\n// app/nhay-effect/BatToi.tsx — BẪY: đọc localStorage trong useEffect (chạy SAU lần vẽ đầu)\nimport { useEffect } from 'react';\n\nexport function BatToi() {\n  useEffect(() => {\n    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');\n  }, []);\n  return null;\n}\n",
 "n13-3:file:src/app/nhay-effect/page.tsx": "import { BatToi } from './BatToi';\nexport default function Trang() {\n  return (\n    <div id=\"the\" className=\"min-h-screen bg-white p-6 text-2xl text-gray-900 dark:bg-gray-900 dark:text-white\">\n      <BatToi />useEffect\n    </div>\n  );\n}\n",
 "n13-3:file:src/app/nhay-script/page.tsx": "// app/nhay-script/page.tsx — ĐÚNG: script chặn chạy TRƯỚC lần vẽ đầu\nconst KICH_BAN = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;\n\nexport default function Trang() {\n  return (\n    <div id=\"the\" className=\"min-h-screen bg-white p-6 text-2xl text-gray-900 dark:bg-gray-900 dark:text-white\">\n      <script dangerouslySetInnerHTML={{ __html: KICH_BAN }} />inline script\n    </div>\n  );\n}\n",
 "n13-3:file:src/app/nt/layout.tsx": "// app/nt/layout.tsx — next-themes: lo script, localStorage, 3 trạng thái\nimport { ThemeProvider } from 'next-themes';\nexport default function Layout({ children }: LayoutProps<'/nt'>) {\n  return <ThemeProvider attribute=\"class\">{children}</ThemeProvider>;\n}\n",
 "n13-3:file:src/app/nt/page.tsx": "export default function Trang() {\n  return <div id=\"the\" className=\"min-h-screen bg-white p-6 text-2xl text-gray-900 dark:bg-gray-900 dark:text-white\">next-themes</div>;\n}\n",
 "n13-3:nhay": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/nhay|/nt'\n✓ Compiled successfully in 91ms\n├ ○ /nhay-effect\n├ ○ /nhay-script\n├ ○ /nt\n$ Chromium: localStorage theme=dark · tệp JS bị làm chậm 2 s · đo ở 600 ms và 3.600 ms sau khi mở\nnhay-effect  600ms   rgb(255, 255, 255)\nnhay-effect  sauChup rgb(255, 255, 255)\nnhay-effect  3600ms  lab(8.11897 0.811279 -12.254)\nnhay-script  600ms   lab(8.11897 0.811279 -12.254)\nnhay-script  sauChup lab(8.11897 0.811279 -12.254)\nnhay-script  3600ms  lab(8.11897 0.811279 -12.254)\nnhay-nt      600ms   lab(8.11897 0.811279 -12.254)\nnhay-nt      sauChup lab(8.11897 0.811279 -12.254)\nnhay-nt      3600ms  lab(8.11897 0.811279 -12.254)\n$ node -e \"const d=require('$HOME/Documents/video-bai-giang/scratchpad/nxj/demo/out/anh-nxj-13-3.json'); console.log('nt-system   ', '·', d['nt-system'].ketQua.the)\"\nnt-system    · lab(8.11897 0.811279 -12.254) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased dark\"",
 "n13-3:dev": "$ Chromium + next dev: console khi script đổi class của <html> trước khi React hydrate\ndev-script · 1 dòng lỗi/cảnh báo\n   error · A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component\ndev-nt · 2 dòng lỗi/cảnh báo\n   error · A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component\n   error · A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component\n$ sửa app/layout.tsx: <html … suppressHydrationWarning>\n22:    <html suppressHydrationWarning\n$ node -e \"const d=require('$HOME/Documents/video-bai-giang/scratchpad/nxj/demo/out/anh-nxj-13-3.json'); const c=d['dev-script2'].console.filter(x=>x.kieu!=='log'&&x.kieu!=='info'&&x.kieu!=='debug'); console.log('dev-script2 ·', c.length, 'dòng lỗi/cảnh báo'); for (const x of c) console.log('  ', x.kieu, '·', x.chu.split('\\n')[0].slice(0, 170))\"\ndev-script2 · 0 dòng lỗi/cảnh báo",
 "n13-3:kho": "$ grep -n 'darkMode' tailwind.config.ts\n9:  darkMode: \"class\",\n$ sed -n '68,73p' src/context/themeLogic.ts      # script chạy trước lần vẽ đầu của cuongthai.com\nexport const THEME_BOOT_SCRIPT =\n  \"try{var h=document.documentElement,p=localStorage.getItem('theme');\" +\n  \"if(p!=='light'&&p!=='system')p='dark';\" +\n  \"var r=p==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;\" +\n  \"h.classList.add(r==='light'?'light':'theme-dark');h.setAttribute('data-theme-pref',p)\" +\n  \"}catch(e){document.documentElement.classList.add('theme-dark')}\";\n$ grep -n 'suppressHydrationWarning' src/app/layout.tsx\n349:      suppressHydrationWarning\n351:      <body suppressHydrationWarning className=\"antialiased\">",
 "anh-nxj-13-3:toi-sang": {
  "url": "http://127.0.0.1:19395/toi",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "the": "rgb(255, 255, 255) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased\""
  }
 },
 "anh-nxj-13-3:toi-class": {
  "url": "http://127.0.0.1:19395/toi",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "the": "rgb(255, 255, 255) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased dark\""
  }
 },
 "anh-nxj-13-3:toi-he": {
  "url": "http://127.0.0.1:19395/toi",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "the": "lab(8.11897 0.811279 -12.254) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased\""
  }
 },
 "anh-nxj-13-3:toi-class2": {
  "url": "http://127.0.0.1:19395/toi",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "the": "lab(8.11897 0.811279 -12.254) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased dark\""
  }
 },
 "anh-nxj-13-3:toi-he2": {
  "url": "http://127.0.0.1:19395/toi",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "the": "rgb(255, 255, 255) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased\""
  }
 },
 "anh-nxj-13-3:nhay-effect-600": {
  "url": "http://127.0.0.1:19395/nhay-effect",
  "vp": [
   520,
   120
  ],
  "msChup": 19
 },
 "anh-nxj-13-3:nhay-effect": {
  "url": "http://127.0.0.1:19395/nhay-effect",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "600ms": "rgb(255, 255, 255)",
   "sauChup": "rgb(255, 255, 255)",
   "3600ms": "lab(8.11897 0.811279 -12.254)"
  }
 },
 "anh-nxj-13-3:nhay-script-600": {
  "url": "http://127.0.0.1:19395/nhay-script",
  "vp": [
   520,
   120
  ],
  "msChup": 7
 },
 "anh-nxj-13-3:nhay-script": {
  "url": "http://127.0.0.1:19395/nhay-script",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "600ms": "lab(8.11897 0.811279 -12.254)",
   "sauChup": "lab(8.11897 0.811279 -12.254)",
   "3600ms": "lab(8.11897 0.811279 -12.254)"
  }
 },
 "anh-nxj-13-3:nhay-nt-600": {
  "url": "http://127.0.0.1:19395/nt",
  "vp": [
   520,
   120
  ],
  "msChup": 17
 },
 "anh-nxj-13-3:nhay-nt": {
  "url": "http://127.0.0.1:19395/nt",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "600ms": "lab(8.11897 0.811279 -12.254)",
   "sauChup": "lab(8.11897 0.811279 -12.254)",
   "3600ms": "lab(8.11897 0.811279 -12.254)"
  }
 },
 "anh-nxj-13-3:nt-system": {
  "url": "http://127.0.0.1:19395/nt",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "the": "lab(8.11897 0.811279 -12.254) · html.class=\"T19VSG_variable _8Li5zG_variable h-full antialiased dark\""
  }
 },
 "anh-nxj-13-3:dev-script": {
  "url": "http://127.0.0.1:19396/nhay-script",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "error",
    "chu": "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\n%s%s https://react.dev/link/hydration-mismatch \n\n  ...\n    <HotReload globalError={[...]} webSocket={WebSocket} staticIndicatorState={{pathname:null, ...}}>\n      <AppDevOverlayErrorBoundary globalError={[...]}>\n        <ReplaySsrOnlyErrors>\n        <DevRootHTTPAccessFallbackBoundary>\n          <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>\n            <HTTPAccessFallbackErrorBoundary pathname=\"/nhay-script\" notFound={<NotAllowedRootHTTPFallbackError>} ...>\n              <RedirectBoundary>\n                <RedirectErrorBoundary router={{...}}>\n                  <Head>\n                  <__next_root_layout_boundary__>\n                    <SegmentViewNode type=\"layout\" pagePath=\"layout.tsx\">\n                      <SegmentTrieNode>\n                      <link>\n                      <script>\n                      <RootLayout>\n                        <html\n                          lang=\"en\"\n+                         className=\"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia...\"\n-                         className=\"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia...\"\n                        >\n                  ...\n"
   }
  ]
 },
 "anh-nxj-13-3:dev-nt": {
  "url": "http://127.0.0.1:19396/nt",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "error",
    "chu": "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\n%s%s https://react.dev/link/hydration-mismatch \n\n  ...\n    <HotReload globalError={[...]} webSocket={WebSocket} staticIndicatorState={{pathname:null, ...}}>\n      <AppDevOverlayErrorBoundary globalError={[...]}>\n        <ReplaySsrOnlyErrors>\n        <DevRootHTTPAccessFallbackBoundary>\n          <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>\n            <HTTPAccessFallbackErrorBoundary pathname=\"/nt\" notFound={<NotAllowedRootHTTPFallbackError>} ...>\n              <RedirectBoundary>\n                <RedirectErrorBoundary router={{...}}>\n                  <Head>\n                  <__next_root_layout_boundary__>\n                    <SegmentViewNode type=\"layout\" pagePath=\"layout.tsx\">\n                      <SegmentTrieNode>\n                      <link>\n                      <script>\n                      <RootLayout>\n                        <html\n                          lang=\"en\"\n+                         className=\"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia...\"\n-                         className=\"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia...\"\n-                         style={{color-scheme:\"light\"}}\n                        >\n                  ...\n"
   },
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "error",
    "chu": "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\n%s%s https://react.dev/link/hydration-mismatch \n\n  ...\n    <HotReload globalError={[...]} webSocket={WebSocket} staticIndicatorState={{pathname:null, ...}}>\n      <AppDevOverlayErrorBoundary globalError={[...]}>\n        <ReplaySsrOnlyErrors>\n        <DevRootHTTPAccessFallbackBoundary>\n          <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>\n            <HTTPAccessFallbackErrorBoundary pathname=\"/nt\" notFound={<NotAllowedRootHTTPFallbackError>} ...>\n              <RedirectBoundary>\n                <RedirectErrorBoundary router={{...}}>\n                  <Head>\n                  <__next_root_layout_boundary__>\n                    <SegmentViewNode type=\"layout\" pagePath=\"layout.tsx\">\n                      <SegmentTrieNode>\n                      <link>\n                      <script>\n                      <RootLayout>\n                        <html\n                          lang=\"en\"\n+                         className=\"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia...\"\n-                         className=\"geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia...\"\n-                         style={{color-scheme:\"dark\"}}\n                        >\n                  ...\n"
   }
  ]
 },
 "anh-nxj-13-3:dev-script2": {
  "url": "http://127.0.0.1:19396/nhay-script",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, css, tn, br, box, two, steps, kw, c, cmp, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-13-3', code: 'NXJ 13.3', title: 'Dark mode: the dark: variant and a no-flicker toggle', sub: 'Chapter 13 · Lesson 13.3' };
const O = (k) => { const v = DU_LIEU[`n13-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-13-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ app\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-13-3', ten, { vp: 520, ...o });

// ── số đo (n13-3 · Next.js 16.4.6 + Tailwind 4.3.3 · Chromium · next-themes 0.4.6)
const gon = (s) => s.replace(/T19VSG_variable _8Li5zG_variable h-full antialiased ?/, '').replace('html.class=""', 'html: no class').replace(/html\.class="(\w+)"/, 'html.$1');
const KQ = (k) => gon(A(k).ketQua.the);
const MD = doan('mac-dinh', 'doc-css.py dark:bg-gray-900'), CL = doan('class', 'doc-css.py dark:bg-gray-900');
const NH = doan('nhay', 'đo ở 600 ms');
const nh = (k, m) => NH.find((l) => l.startsWith(k) && l.includes(m)).split(/\s{2,}/).pop();
const DEV1 = doan('dev', 'console khi script'), DEV2 = O('dev').split('\n').filter((l) => l.startsWith('dev-script2'));
const KHO = O('kho');
const en_ = (l) => l.replace('dòng lỗi/cảnh báo', 'console errors/warnings');
const TRANG = 'rgb(255, 255, 255)';
if (!/prefers-color-scheme:dark/.test(MD[0]) || !/:where\(\.dark,\.dark \*\)/.test(CL[0])) throw new Error('biến thể dark đổi');
if (A('toi-class').ketQua.the.split(' · ')[0] !== TRANG || A('toi-he').ketQua.the.startsWith('rgb') || A('toi-class2').ketQua.the.startsWith('rgb') || !A('toi-he2').ketQua.the.startsWith(TRANG)) throw new Error('đo dark đổi');
if (nh('nhay-effect', '600ms') !== TRANG || nh('nhay-effect', '3600ms') === TRANG || nh('nhay-script', '600ms') === TRANG || nh('nhay-nt', '600ms') === TRANG) throw new Error('đo nháy đổi');
if (!/dev-script · 1 dòng/.test(DEV1[0]) || !/0 dòng/.test(DEV2[0])) throw new Error('hydrate đổi');
const SANG = TRANG, TOI = nh('nhay-script', '600ms');
const mau = (v) => (v === SANG ? 'white' : /^lab\(8\.1/.test(v) ? 'gray-900' : v);

const TOIF = bo(F('src/app/toi/page.tsx')).replace(' className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-6 text-2xl"', '\n      className="bg-white text-gray-900\n                 dark:bg-gray-900 dark:text-white p-6 text-2xl"');
const EFF = bo(F('src/app/nhay-effect/BatToi.tsx')).split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n').replace("if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');", "if (localStorage.getItem('theme') === 'dark')\n      document.documentElement.classList.add('dark');");
const SCR = bo(F('src/app/nhay-script/page.tsx')).split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n')
  .replace("const KICH_BAN = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;", "const KICH_BAN = `try{\n  if (localStorage.getItem('theme') === 'dark')\n    document.documentElement.classList.add('dark')\n}catch(e){}`;")
  .replace(' className="min-h-screen bg-white p-6 text-2xl text-gray-900 dark:bg-gray-900 dark:text-white"', ' className="… dark:bg-gray-900"')
  .replace('<script dangerouslySetInnerHTML={{ __html: KICH_BAN }} />inline script', '<script\n        dangerouslySetInnerHTML={{ __html: KICH_BAN }} />');
const NT = bo(F('src/app/nt/layout.tsx'));

export const S = [
  { cover: true, nhan: 'Chapter 13 · Lesson 13.3', t: 'Dark mode: the dark: variant<br>and a no-flicker toggle', sub: 'What dark: compiles to in Tailwind 4, how to switch it to a class, and the white flash — measured in Chromium with the page\'s JavaScript slowed down',
    en: 'Lesson thirteen point three: dark mode. We read what the dark variant compiles to in Tailwind four, switch it to a class, and then measure the white flash in Chromium, with the page\'s JavaScript deliberately slowed down.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>In Tailwind 4, <code>dark:</code> follows the <b>operating system</b> by default — a <code>dark</code> class does nothing</li>
    <li>One CSS line switches it to the class strategy (<code>darkMode: 'class'</code> in Tailwind 3)</li>
    <li>The flash: <code>useEffect</code> vs a blocking script vs next-themes, measured at 600 ms</li>
    <li>The hydration error the script causes, and <code>suppressHydrationWarning</code></li>
    <li>Three states — light, dark, system — and how cuongthai.com boots its theme</li></ul>`,
    en: 'Five takeaways: in Tailwind four, dark follows the operating system by default and a dark class does nothing; one CSS line switches to the class strategy; the flash, measured for useEffect, a blocking script and next-themes; the hydration error the script causes and its fix; and three states, plus how cuongthai.com boots its theme.' },
  { t: 'Tailwind 4 default: dark: = the operating system', body: two(D(tsx(TOIF, { sm: true, hl: [4] }), tn(['$ python3 doc-css.py dark:bg-gray-900 dark:text-white', ...MD].join('\n'), { fs: 13, wrap: 64, title: 'built CSS (real)' })),
    D(cmp(['Chromium', '#the background'], [['light OS', mau(A('toi-sang').ketQua.the.split(' · ')[0])], ['light OS + <code>&lt;html class="dark"&gt;</code>', `<b>${mau(A('toi-class').ketQua.the.split(' · ')[0])}</b>`], ['dark OS (<code>prefers-color-scheme</code>)', mau(A('toi-he').ketQua.the.split(' · ')[0])]]),
      box('Read it', 'Out of the box <code>dark:</code> is a <b>media query</b>. Adding <code>class="dark"</code> to <code>&lt;html&gt;</code> changed nothing — a toggle button cannot work yet.', 'do2')), 'r64'),
    en: 'Tailwind four\'s default: dark compiles to a media query, prefers-color-scheme dark. Measured: with a light operating system the card is white; adding class dark to html changes nothing; only a dark operating system turns it dark. So a toggle button cannot work yet.' },
  { t: 'Switch dark: to a class — one line of CSS', body: two(D(css('@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));', { sm: true, hl: [2] }), tn(['$ python3 doc-css.py dark:bg-gray-900', ...CL].join('\n'), { fs: 13, wrap: 64, title: 'built CSS (real)' }),
      tn(KHO.split('\n').slice(0, 2).join('\n'), { fs: 14, title: 'cuongthai.com — Tailwind 3 (real)' })),
    D(cmp(['Chromium', '#the background'], [['light OS + <code>&lt;html class="dark"&gt;</code>', `<b>${mau(A('toi-class2').ketQua.the.split(' · ')[0])}</b>`], ['dark OS, no class', `<b>${mau(A('toi-he2').ketQua.the.split(' · ')[0])}</b>`]]),
      box('Read it', 'Now <code>dark:</code> means "inside an element with class <code>dark</code>" — the OS setting no longer applies on its own. Tailwind 3 does the same with <code>darkMode: \'class\'</code> in <code>tailwind.config</code>; Tailwind 4 has no config file, so it is a CSS line.', 'xanh')), 'r64'),
    en: 'One line of CSS switches dark to a class: custom-variant dark, where dot dark or anything inside dot dark. Measured: class dark on html now turns the card dark, and the operating system alone no longer does. Tailwind three, which cuongthai.com runs, does the same with darkMode class in the config.' },
  { t: 'Why there is a flash', body: seq(['server', 'browser', 'your JS'], [[0, 1, 'HTML — the server cannot read localStorage'], [1, 1, 'first paint: no "dark" class ⇒ WHITE', '#c0392b'], [1, 2, 'download + run the bundle'], [2, 1, 'useEffect: add "dark" ⇒ page turns dark', '#c0392b', true]], { w: 1110, rh: 56, fs: 20, top: 56 })
    + two(box('The cause', 'The choice lives in <code>localStorage</code>, a browser thing. The server renders HTML without it. Anything that runs <b>after</b> the first paint — <code>useEffect</code> by definition — is too late.', 'do2'),
      box('The fix', 'A small <b>blocking</b> <code>&lt;script&gt;</code> inside the HTML runs while the page is being parsed, sets the class, and only then does the browser paint.', 'xanh'), ''),
    en: 'Why there is a flash. The theme choice lives in localStorage, which the server cannot read, so the HTML arrives without the dark class and the browser paints it white. Only after the JavaScript bundle downloads and runs does a useEffect add the class. The fix is a small blocking script inside the HTML that sets the class before the first paint.' },
  { t: 'Measured at 600 ms, with JavaScript slowed by 2 s', body: two(D(B('nhay-effect-600', { url: 'useEffect · 600 ms', h: 120, w: 520 }), B('nhay-script-600', { url: 'inline script · 600 ms', h: 120, w: 520 }), B('nhay-nt-600', { url: 'next-themes · 600 ms', h: 120, w: 520 })),
    D(cmp(['localStorage theme=dark', '600 ms', '3 600 ms'], [
        ['useEffect', `<b style="color:#c0392b">${mau(nh('nhay-effect', '600ms'))}</b>`, mau(nh('nhay-effect', '3600ms'))],
        ['inline script', mau(nh('nhay-script', '600ms')), mau(nh('nhay-script', '3600ms'))],
        ['next-themes', mau(nh('nhay-nt', '600ms')), mau(nh('nhay-nt', '3600ms'))],
      ]), box('How it was measured', 'Playwright delays every <code>/_next/static/chunks/*.js</code> by 2 s (a slow phone), opens the page, and reads <code>getComputedStyle</code> at 600 ms. The <code>useEffect</code> page is white until its JavaScript arrives — that is the flash.', 'lam')), ''),
    en: 'Measured. Playwright delays every JavaScript chunk by two seconds, like a slow phone, and reads the background six hundred milliseconds after opening. The useEffect page is white, then turns dark once its JavaScript arrives: that is the flash. The inline script and next-themes are already dark at six hundred milliseconds.' },
  { t: 'The two versions, side by side', body: two(D(tsx(EFF, { sm: true, hl: [5, 6, 7] }), box('Too late', 'Effects run <b>after</b> paint. A faster effect does not help.', 'do2')),
    D(tsx(SCR, { sm: true, hl: [1, 2, 3, 4, 9, 10] }), box('Before paint', 'The script is plain text in the HTML; the parser runs it before painting what follows. Wrap it in <code>try</code> — storage can be blocked.', 'xanh')), ''),
    en: 'The two versions. The effect version adds the class after paint, which is too late no matter how fast it runs. The script version is plain text in the HTML: the parser runs it before painting what comes after. Wrap it in try, because storage can be blocked.' },
  { t: 'The price: a hydration error, and its fix', body: two(D(tn([en_(DEV1[0]), ...DEV1.slice(1).map(en_).map((l) => l.trim().replace(/^error · /, 'error · ').slice(0, 150))].join('\n'), { fs: 13, wrap: 60, title: 'Chromium console · next dev (real)' }),
      tn(['$ (app/layout.tsx) <html suppressHydrationWarning …>', ...DEV2.map(en_)].join('\n'), { fs: 13, wrap: 60, title: 'after the fix (real)' })),
    D(box('Why', 'The script changed <code>&lt;html&gt;</code>\'s <code>class</code> before React hydrated, so the attribute React expected no longer matches: <em>"some attributes of the server rendered HTML didn\'t match"</em>. It is a console <b>error</b> in dev.', 'do2'),
      box('Fix', '<code>suppressHydrationWarning</code> on <code>&lt;html&gt;</code> — it silences attribute mismatches on that one element only. One of the few legitimate uses. next-themes needs it too (2 errors measured without it).', 'xanh')), ''),
    en: 'The price of the script: React finds that html\'s class changed before hydration and logs an error in dev, some attributes did not match. The fix is suppressHydrationWarning on the html element: it silences attribute mismatches for that one element only. After adding it, zero errors. next-themes needs the same attribute.' },
  { t: 'next-themes: the script, the storage, three states', body: two(D(tsx(NT, { sm: true, hl: [4] }), tn(['# Chromium · localStorage theme=system · OS dark', `nt-system · ${KQ('nt-system')}`].join('\n'), { fs: 14, wrap: 60, title: 'Chromium (real)' })),
    D(box('What it does for you', 'Injects the blocking script, stores the choice in <code>localStorage</code>, gives you <code>useTheme()</code> for a toggle, and supports <code>"system"</code> — measured: <code>theme=system</code> on a dark OS put <code>dark</code> on <code>&lt;html&gt;</code>.', 'xanh'),
      box('Remember', '<code>attribute="class"</code> so it matches the class variant, and <code>suppressHydrationWarning</code> on <code>&lt;html&gt;</code>.', 'lam')), 'r64'),
    en: 'next-themes does all of this: it injects the blocking script, stores the choice, gives you useTheme for a toggle, and supports system. Measured: with theme set to system on a dark operating system, it put the dark class on html. Use attribute class, and keep suppressHydrationWarning on html.' },
  { t: 'Three states, and how cuongthai.com boots its theme', body: two(D(tn(KHO.split('\n').slice(2).join('\n'), { fs: 13, wrap: 64, title: 'frontend/ (real)' })),
    D(cmp(['Stored choice', 'Applied to &lt;html&gt;'], [['<code>light</code>', '<code>light</code>'], ['<code>dark</code> (or unset)', '<code>theme-dark</code>'], ['<code>system</code>', 'by <code>prefers-color-scheme</code>']]),
      box('Read it', 'Three choices, but only two classes ever reach the page; "system" is resolved by the same blocking script before paint. And the dark class is called <code>theme-dark</code>, not <code>dark</code> — the reason is Lesson 13.4.', 'lam')), 'r64'),
    en: 'Three states: light, dark, and system, which most users actually want. cuongthai.com stores the choice and resolves system with prefers-color-scheme inside the same blocking script, and suppresses the hydration warning on html. Notice its dark class is called theme-dark, not dark; why is the next lesson.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('dark: variant', 'v4 default: prefers-color-scheme'), kw('@custom-variant', 'v4: dark: from a class'), kw("darkMode: 'class'", 'v3: the same, in the config'),
      kw('Flash (FOUC)', 'wrong theme before JS runs'), kw('Blocking script', 'runs before first paint'), kw('suppressHydrationWarning', 'on <html> only'),
      kw('next-themes', 'script + storage + useTheme'), kw('System', 'third state: follow the OS'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the dark variant; custom-variant; darkMode class in Tailwind three; the flash; the blocking script; suppressHydrationWarning; next-themes; and the system state.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Put ${c('dark:bg-gray-900')} on a card; add ${c('class="dark"')} to ${c('<html>')} in DevTools — nothing? Read the CSS`,
      `Add ${c('@custom-variant dark (&:where(.dark, .dark *));')} and try again`,
      `Toggle with ${c('useEffect')}; DevTools → Network → slow 3G: see the flash`,
      `Replace it with a blocking script (or next-themes) + ${c('suppressHydrationWarning')}`,
    ]), box('Keep these', `<ul><li>v4: dark: follows the OS until you add the class variant</li><li>Effects run after paint ⇒ flash</li><li>Blocking script sets the class first</li><li>suppressHydrationWarning on &lt;html&gt;</li><li>Three states: light · dark · system</li></ul>`, 'lam'), ''),
    en: 'Your turn: put a dark utility on a card and add class dark in DevTools — nothing, until you add the custom variant; build a useEffect toggle and see the flash on slow 3G; then replace it with a blocking script or next-themes plus suppressHydrationWarning. Keep: effects run after paint, so set the class with a blocking script.' },
];
export const slides = lamDeck({ chuong: 'Chapter 13 — Styling, Tailwind & theming', bai: '13.3' }, S);
