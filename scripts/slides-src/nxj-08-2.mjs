/*DU_LIEU*/
const DU_LIEU = {
 "n8-2:file:src/app/dashboard/layout.tsx": "export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {\n  return (\n    <div className=\"flex gap-4 p-4 font-sans\">\n      <nav className=\"w-44 rounded border p-2\">📊 Menu dashboard</nav>\n      <main className=\"flex-1 rounded border p-2\">{children}</main>\n    </div>\n  );\n}\n",
 "n8-2:file:src/app/dashboard/page.tsx": "import Chart from './Chart';\nimport { cham } from './utils';\n\nlet lan = 0, lanLoi = 0;                              // đếm lần render ở máy chủ (để đo)\n\nexport default async function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {\n  const { loi } = await searchParams;                 // đọc query ⇒ route động (ƒ)\n  lan++;\n  console.log(`[dashboard] render #${lan}${loi ? ' ?loi' : ''}`);\n  await cham(1500);                                   // giả lập số liệu về chậm 1,5 s\n  if (loi && ++lanLoi % 2 === 1) throw new Error('Không tải được số liệu (máy chủ)');  // lỗi lần 1, 3, 5…\n  return <><h1>Bảng điều khiển · lần {lan}</h1><Chart /></>;\n}\n",
 "n8-2:file:src/app/dashboard/Chart.tsx": "export default function Chart() {\n  return <p>📈 Biểu đồ — chỉ là component, không phải route</p>;\n}\n",
 "n8-2:file:src/app/dashboard/utils.ts": "export const cham = (ms: number) => new Promise((r) => setTimeout(r, ms));\n",
 "n8-2:file:src/app/dashboard/loading.tsx": "export default function Loading() {\n  return <p>⏳ Đang tải số liệu…</p>;\n}\n",
 "n8-2:file:src/app/dashboard/error.tsx": "'use client';                                         // ranh giới lỗi BẮT BUỘC là Client Component\n\nexport default function Error({ error, reset, retry }: { error: Error & { digest?: string }; reset: () => void; retry: () => void }) {\n  return (\n    <div>\n      <p id=\"loi\">⚠️ {error.message}</p>\n      <p id=\"digest\">digest: {error.digest ?? '—'}</p>\n      <button id=\"reset\" onClick={() => reset()} className=\"mr-2 rounded border px-2\">reset()</button>\n      <button id=\"retry\" onClick={() => retry()} className=\"rounded border px-2\">retry()</button>\n    </div>\n  );\n}\n",
 "n8-2:file:src/app/dashboard/not-found.tsx": "export default function NotFound() {\n  return <p>🔎 Không có mục này trong dashboard</p>;\n}\n",
 "n8-2:file:src/app/dashboard/khong-co/page.tsx": "import { notFound } from 'next/navigation';\n\nexport default function KhongCo() {\n  notFound();                                         // ⇒ not-found.tsx gần nhất\n}\n",
 "n8-2:file:src/app/dashboard/settings/Settings.tsx": "export default function Settings() {\n  return <form>⚙️ Cài đặt đầy đủ — nhưng không có page.tsx</form>;\n}\n",
 "n8-2:trang": "$ find src/app/dashboard | sort\nsrc/app/dashboard\nsrc/app/dashboard/Chart.tsx\nsrc/app/dashboard/error.tsx\nsrc/app/dashboard/khong-co\nsrc/app/dashboard/khong-co/page.tsx\nsrc/app/dashboard/layout.tsx\nsrc/app/dashboard/loading.tsx\nsrc/app/dashboard/not-found.tsx\nsrc/app/dashboard/page.tsx\nsrc/app/dashboard/settings\nsrc/app/dashboard/settings/layout.tsx\nsrc/app/dashboard/settings/Settings.tsx\nsrc/app/dashboard/utils.ts\n$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 19ms\n✓ Compiled successfully in 2.2s\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /about\n├ ○ /blog\n├ ○ /blog/latest\n├ ƒ /dashboard\n├ ○ /dashboard/khong-co\n└ ○ /may-chu\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand",
 "n8-2:mo": "$ for p in /dashboard /dashboard/Chart /dashboard/utils /dashboard/settings /dashboard/khong-co /dashboard/xyz; do curl -s -o /dev/null -w \"GET $p → %{http_code}\\n\" localhost:19370$p; done\nGET /dashboard → 200\nGET /dashboard/Chart → 404\nGET /dashboard/utils → 404\nGET /dashboard/settings → 404\nGET /dashboard/khong-co → 404\nGET /dashboard/xyz → 404\n$ curl -s localhost:19370/dashboard/khong-co | grep -o '<nav[^>]*>[^<]*</nav>\\|<template data-dgst=\"[^\"]*\"></template><p>[^<]*</p>'\n<nav class=\"w-44 rounded border p-2\">📊 Menu dashboard</nav>\n<template data-dgst=\"NEXT_HTTP_ERROR_FALLBACK;404\"></template><p>⏳ Đang tải số liệu…</p>\n$ curl -s localhost:19370/dashboard/xyz | grep -o '<p>🔎[^<]*</p>\\|<nav[^>]*>[^<]*</nav>\\|<h2[^>]*>[^<]*</h2>'\n<h2 style=\"font-size:14px;font-weight:400;line-height:49px;margin:0\">This page could not be found.</h2>\n$ curl -s -o /dev/null -w 'byte đầu tiên sau %{time_starttransfer}s · xong sau %{time_total}s\\n' localhost:19370/dashboard\nbyte đầu tiên sau 0.011115s · xong sau 1.510366s\n$ curl -s localhost:19370/dashboard | grep -o 'Đang tải số liệu…\\|Bảng điều khiển · lần <!-- -->[0-9]*' | uniq\nĐang tải số liệu…\nBảng điều khiển · lần <!-- -->3",
 "n8-2:file:src/app/dashboard/settings/layout.tsx": "export default function SettingsLayout({ children }: { children: React.ReactNode }) {\n  return <section className=\"rounded border p-2\">⚙️ Khung cài đặt{children}</section>;\n}\n",
 "n8-2:dev": "$ curl -s -o /dev/null -w 'next dev GET /dashboard → %{http_code}\\n' localhost:19371/dashboard\nnext dev GET /dashboard → 200",
 "n8-2:dung": "",
 "n8-2:baysuc": "$ head -3 src/app/dashboard/error.tsx\n\nexport default function Error({ error, reset, retry }: { error: Error & { digest?: string }; reset: () => void; retry: () => void }) {\n  return (\n$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 22ms\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./src/app/dashboard/error.tsx:2:1\nError: src/app/dashboard/error.tsx must be a Client Component. Add the \"use client\" directive the top of the file to resolve this issue.\n    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client\n   1 |\n>  2 | export default function Error({ error, reset, retry }: { error: Error & { digest?: string ...\n     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n>  3 |   return (\n     | ^^^^^^^^^^\n>  4 |     <div>\n     | ^^^^^^^^^\n>  5 |       <p id=\"loi\">⚠️ {error.message}</p>\n     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n>  6 |       <p id=\"digest\">digest: {error.digest ?? '—'}</p>\n     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n>  7 |       <button id=\"reset\" onClick={() => reset()} className=\"mr-2 rounded border px-2\">rese...\n     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n>  8 |       <button id=\"retry\" onClick={() => retry()} className=\"rounded border px-2\">retry()</...\n     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
 "n8-2:file:src/app/khong-mac-dinh/page.tsx": "export function TrangThieu() {\n  return <h1>Trang quên chữ default</h1>;\n}\n",
 "n8-2:bayexport": "$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 19ms\n✓ Compiled successfully in 544ms\n  Running TypeScript ...\n.next/types/validator.ts(133,31): error TS2344: Type 'typeof import(\"/Users/admin/.rtq-nxj/lab/c8/my-app/src/app/khong-mac-dinh/page\")' does not satisfy the constraint 'AppPageConfig<\"/khong-mac-dinh\">'.\nFailed to type check.",
 "n8-2:bayexportdev": "$ curl -s -o /dev/null -w 'next dev GET /khong-mac-dinh → %{http_code}\\n' localhost:19372/khong-mac-dinh\nnext dev GET /khong-mac-dinh → 500\n(log next dev)\n\n✓ Running next.config.ts took 27ms\n\n⨯ Error: The default export is not a React Component in \"/khong-mac-dinh/page\"\n    at ignore-listed frames\n⨯ Error: The default export is not a React Component in \"/khong-mac-dinh/page\"\n    at ignore-listed frames {\n  page: '/khong-mac-dinh'\n}",
 "n8-2:logloi": "$ npx next start   (log máy chủ: tải ?loi=1 → bấm reset() → bấm retry())\n[dashboard] render #5 ?loi\n⨯ Error: Không tải được số liệu (máy chủ)\n  digest: '2406462482'\n[dashboard] render #6 ?loi",
 "n8-2:thuc": "$ cd frontend/src/app && for f in loading.tsx error.tsx global-error.tsx not-found.tsx; do printf '%-17s %s\\n' \"$f\" \"$(find . -name $f | wc -l)\"; done\nloading.tsx       23\nerror.tsx         2\nglobal-error.tsx  1\nnot-found.tsx     0\n$ curl -s -o /tmp/nxj-ct404.html -w 'GET https://cuongthai.com/khong-co-trang-nay → %{http_code}\\n' https://cuongthai.com/khong-co-trang-nay; grep -o '<h2[^>]*>[^<]*</h2>' /tmp/nxj-ct404.html | head -1\nGET https://cuongthai.com/khong-co-trang-nay → 404\n<h2 style=\"font-size:14px;font-weight:400;line-height:49px;margin:0\">This page could not be found.</h2>",
 "anh-nxj-8-2:dt-tai": {
  "url": "http://127.0.0.1:19370/dashboard",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    42
   ],
   "main": [
    208,
    16,
    416,
    42
   ]
  },
  "console": []
 },
 "anh-nxj-8-2:dt-xong": {
  "url": "http://127.0.0.1:19370/about",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    66
   ],
   "main": [
    208,
    16,
    416,
    66
   ]
  },
  "console": []
 },
 "anh-nxj-8-2:kc-js": {
  "url": "http://127.0.0.1:19370/dashboard/khong-co",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    42
   ],
   "main": [
    208,
    16,
    416,
    42
   ]
  },
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   }
  ]
 },
 "anh-nxj-8-2:kc-nojs": {
  "url": "http://127.0.0.1:19370/dashboard/khong-co",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    42
   ],
   "main": [
    208,
    16,
    416,
    42
   ]
  },
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   }
  ]
 },
 "anh-nxj-8-2:xyz": {
  "url": "http://127.0.0.1:19370/dashboard/xyz",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   }
  ]
 },
 "anh-nxj-8-2:loi-start": {
  "url": "http://127.0.0.1:19370/dashboard?loi=1",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    164
   ],
   "main": [
    208,
    16,
    416,
    164
   ],
   "#reset": [
    217,
    145,
    64,
    26
   ],
   "#retry": [
    289,
    145,
    61,
    26
   ]
  },
  "console": [
   {
    "kieu": "error",
    "chu": "Error: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ]
 },
 "anh-nxj-8-2:loi-reset": {
  "url": "http://127.0.0.1:19370/dashboard?loi=1",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    164
   ],
   "main": [
    208,
    16,
    416,
    164
   ],
   "#reset": [
    217,
    145,
    64,
    26
   ],
   "#retry": [
    289,
    145,
    61,
    26
   ]
  },
  "console": [
   {
    "kieu": "error",
    "chu": "Error: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "error",
    "chu": "Error: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ]
 },
 "anh-nxj-8-2:loi-retry": {
  "url": "http://127.0.0.1:19370/dashboard?loi=1",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    66
   ],
   "main": [
    208,
    16,
    416,
    66
   ],
   "#reset": null,
   "#retry": null
  },
  "console": [
   {
    "kieu": "error",
    "chu": "Error: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "error",
    "chu": "Error: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "pageerror",
    "chu": "Minified React error #419; visit https://react.dev/errors/419 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ],
  "ketQua": {
   "msg": "⚠️ Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
   "digest": "digest: 2406462482",
   "sauReset": "⚠️ Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.\n\ndigest: 2406462482\n\nreset()retry()",
   "sauRetry": "Bảng điều khiển · lần 6\n\n📈 Biểu đồ — chỉ là component, không phải route"
  }
 },
 "anh-nxj-8-2:loi-dev": {
  "url": "http://127.0.0.1:19371/dashboard?loi=1",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    176,
    92
   ],
   "main": [
    208,
    16,
    416,
    92
   ]
  },
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
    "kieu": "log",
    "chu": "%c%s%c [dashboard] render #2 ?loi background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px  Server  "
   },
   {
    "kieu": "error",
    "chu": "%o\n\n%s Error: Không tải được số liệu (máy chủ)\n    at DashboardPage (about://React/Server/file:///Users/admin/.rtq-nxj/lab/c8/my-app/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__06gj_vtqmy8fx._.js?14:46:42)\n    at resolveErrorDev (http://127.0.0.1:19371/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_164kp-67asdr9._.js:2029:150)\n    at processFullStringRow (http://127.0.0.1:19371/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_164kp-67asdr9._.js:2548:29)\n    at processFullBinaryRow (http://127.0.0.1:19371/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_164kp-67asdr9._.js:2507:9)\n    at processBinaryChunk (http://127.0.0.1:19371/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_164kp-67asdr9._.js:2614:221)\n    at progress (http://127.0.0.1:19371/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_164kp-67asdr9._.js:2801:13) The above error occurred in the <DashboardPage> component. It was handled by the <ErrorBoundaryHandler> error boundary."
   }
  ],
  "ketQua": {
   "msg": "⚠️ Không tải được số liệu (máy chủ)"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, tree } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-08-2', code: 'NXJ 8.2', title: 'Special files: page, layout, loading, error', sub: 'Chapter 8 · Lesson 8.2' };
const O = (k) => { const v = DU_LIEU[`n8-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-8-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-08-2', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const F = (p) => O('file:src/app/' + p).trim();
const MO = O('mo'), R = AN('loi-retry').ketQua, DEV = AN('loi-dev').ketQua;
for (const [k, s] of [['trang', 'ƒ /dashboard'], ['mo', 'GET /dashboard/Chart → 404'], ['mo', 'GET /dashboard/settings → 404'], ['mo', 'GET /dashboard/khong-co → 404'], ['mo', 'NEXT_HTTP_ERROR_FALLBACK;404'],
  ['mo', 'This page could not be found.'], ['mo', 'Đang tải số liệu…'], ['baysuc', 'must be a Client Component'], ['bayexport', 'does not satisfy the constraint'], ['bayexportdev', '→ 500'],
  ['bayexportdev', 'The default export is not a React Component'], ['logloi', 'render #6 ?loi'], ['thuc', 'not-found.tsx     0']])
  if (!O(k).includes(s)) throw new Error(`số đo 8.2 đổi: ${k} thiếu "${s}"`);
if (!/Minified React error #441/.test(R.msg) || !/Minified React error #441/.test(R.sauReset) || !/Bảng điều khiển · lần 6/.test(R.sauRetry) || DEV.msg !== '⚠️ Không tải được số liệu (máy chủ)') throw new Error('số đo lỗi 8.2 đổi');
const TG = MO.match(/byte đầu tiên sau ([\d.]+)s · xong sau ([\d.]+)s/); if (!TG) throw new Error('thiếu thời gian');
const TTFB = (+TG[1] * 1000).toFixed(0), TONG = (+TG[2]).toFixed(1);
const DG = R.digest.replace('digest: ', '');
if (!O('logloi').includes(DG)) throw new Error('digest log ≠ digest trình duyệt');

const nest = (tang) => tang.reduceRight((trong, [ten, mo, mau]) => `<div style="border:3px solid ${mau};border-radius:14px;padding:10px 14px 12px;background:${mau}12;margin-top:6px"><div style="font:800 21px Arial;color:${mau}">${ten}</div><div style="font:17px Arial;color:#475569;margin-bottom:6px">${mo}</div>${trong}</div>`, '');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.2', t: 'Special files:<br>page, layout, loading, error', sub: 'Reserved file names, each one a behaviour you would otherwise wire by hand — and what Next.js 16 really does when you get them wrong',
    en: 'Lesson eight point two: the special files — page, layout, loading, error and not-found. Each reserved name is a behaviour you would otherwise wire by hand. And we measure what Next.js sixteen really does when you get them wrong.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The reserved names in a route folder, and what each one does</li>
    <li>A folder without <code>page.tsx</code> is not a route — colocation, measured</li>
    <li>How the files stack at one URL: layout → error → loading → page</li>
    <li><code>loading.tsx</code> streams; <code>error.tsx</code> hides messages in production; <code>retry()</code> vs <code>reset()</code></li>
    <li>Where <code>not-found.tsx</code> applies — and the mistakes that are louder than the lesson claimed</li></ul>`,
    en: 'Five takeaways: the reserved names; a folder without a page is not a route; how the files stack at one URL; loading streams, error hides messages in production, and retry versus reset; and where not-found applies, plus mistakes that turn out to be loud, not silent.' },
  { t: 'Inside a route folder, some file names are reserved', body: icards([
      ['page', 'page.tsx', 'the UI of this route; without it the folder is not reachable'],
      ['layers', 'layout.tsx', 'shared wrapper for this segment and everything below; stays mounted (8.3)'],
      ['clock', 'loading.tsx', 'shown while the segment loads — an automatic Suspense boundary'],
      ['warn', 'error.tsx', 'error boundary for the segment — must be a Client Component'],
      ['search', 'not-found.tsx', 'UI for <code>notFound()</code> in this segment'],
      ['plug', 'route.ts', 'an API endpoint instead of a page (Chapter 11)'],
    ], 3) + box('You never import them', 'Next.js finds each file by its <b>name</b> and puts it in the right place in the tree. Everything else in the folder is ignored by the router.', 'lam'),
    en: 'Inside a route folder some names are reserved. Page is the UI of the route. Layout is a shared wrapper that stays mounted. Loading is shown while the segment loads. Error is an error boundary and must be a Client Component. Not-found is the UI for notFound. Route is an API endpoint instead of a page. You never import them — Next.js finds each one by name.' },
  { t: 'A folder without page.tsx is not a route — measured', body: two(tree(['src/app/dashboard/', '*  page.tsx        // /dashboard', '  layout.tsx', '  loading.tsx', '  error.tsx', '  not-found.tsx', '  Chart.tsx       // just a component', '  utils.ts        // just a helper', '  khong-co/', '    page.tsx      // calls notFound()', '  settings/', '    layout.tsx    // no page.tsx!', '    Settings.tsx'], { fs: 19 }),
      D(tn(lay('mo', /^GET /), { fs: 19, title: 'next start · curl (real)' }), box('Colocation', 'Components, helpers, styles, tests can live next to the route that uses them. Only <code>page.tsx</code> (or <code>route.ts</code>) makes a URL. <code>settings/</code> has a layout and a full component — and still answers 404.', 'xanh')), 'r64'),
    en: 'A folder without page dot tsx is not a route, measured. Chart dot tsx and utils dot ts sit in the dashboard folder: both URLs answer four oh four. The settings folder even has a layout and a complete component — still four oh four, because there is no page. Keeping helpers next to the route is called colocation, and the router simply ignores them.' },
  { t: 'How the files stack at one URL', body: two(nest([
      ['layout.tsx', 'the frame: nav, shell — stays on screen', '#0070f3'], ['error.tsx', 'error boundary: replaces what is inside on a throw', '#c0392b'],
      ['loading.tsx', '= &lt;Suspense fallback&gt; while the page waits', '#c28a00'], ['page.tsx', 'the content of the slot', '#1f8a3b'],
    ]), steps([
      'layout.tsx renders the frame (nav, shell)',
      'while the page\'s data is on its way, loading.tsx shows in the layout\'s slot',
      'if the page throws, error.tsx takes the slot — the layout stays',
      'on success, page.tsx fills the slot',
    ]), ''),
    en: 'At one URL Next.js nests the files from the outside in: the layout wraps the error boundary, which wraps the loading boundary, which wraps the page. So the layout renders the frame; while data is on its way, loading shows in the slot; if the page throws, error takes the slot and the layout stays; on success the page fills the slot.' },
  { t: 'loading.tsx = an automatic Suspense boundary — measured', body: two(D(tsx(F('dashboard/loading.tsx'), { sm: true }), tsx(`// dashboard/page.tsx (excerpt)
export default async function DashboardPage(…) {
  await cham(1500);   // data arrives after 1.5 s
  return <h1>Bảng điều khiển · lần {lan}</h1>;
}`, { sm: true, hl: [3] }),
      tn('$ curl … /dashboard\n' + lay('mo', /byte đầu tiên/, /^Đang tải số liệu…$/, /^Bảng điều khiển/), { fs: 17, title: 'next start · curl /dashboard (real)' })),
      D(B('dt-tai', { vp: 640, h: 100, w: 520, url: 'localhost:3000/dashboard · +0.5 s' }), '<div style="height:10px"></div>', B('dt-xong', { vp: 640, h: 100, w: 520, url: 'localhost:3000/dashboard · +2.7 s' }),
        box('One response, two parts', `First byte after <b>${TTFB} ms</b>, end after <b>${TONG} s</b>. The same HTML carries the fallback first and the page later — streaming (Chapter 10).`, 'xanh')), ''),
    en: `Loading dot tsx is an automatic Suspense boundary, measured. The page waits one and a half seconds for its data. curl received the first byte after about ${TTFB} milliseconds and the end after ${TONG} seconds — and that one HTML response contains both the loading text and the finished page. In Chromium the menu and the loading text appear at once; the content replaces it when it arrives.` },
  { t: 'error.tsx must be a Client Component — the build says so', body: tsx(`'use client';   // an error boundary MUST be a Client Component
export default function Error({ error, reset, retry }) { … }`, { hl: [1] }) +
      tn(lay('baysuc', /^\.\/src\/app\/dashboard\/error\.tsx/, /^Error: src\/app/), { fs: 17, title: 'npm run build without \'use client\' (real)' }) +
      two(box('Why it must run in the browser', 'An error boundary catches errors while React renders on the client and offers a button to try again. That needs client JavaScript (Chapter 9).', 'lam'),
        box('Not silent', 'Forgetting <code>\'use client\'</code> does not just "fail to work" — <code>next build</code> refuses, and names the file and the fix.', 'do2'), ''),
    en: 'Error dot tsx must be a Client Component. We deleted use client and built: the build refused with a clear message — must be a Client Component, add the use client directive. An error boundary catches errors while React renders in the browser and offers a retry button, which needs client JavaScript. So forgetting it is not silent; the build names the file and the fix.' },
  { t: 'An error in production: the message is hidden on purpose', body: two(D(B('loi-start', { vp: 640, h: 200, w: 540, url: 'next start · /dashboard?loi=1' })), D(B('loi-dev', { vp: 640, h: 110, w: 540, url: 'next dev · /dashboard?loi=1' }),
      tn(O('logloi').split('\n').slice(1, 4).join('\n'), { fs: 16, title: 'server log of next start (real)' })), '') +
      box('Match by digest', `In production a Server Component error reaches the browser as a generic React message and a <b>digest</b> (${DG}). The real message is only in the server log — with the same digest. Never show <code>error.message</code> as if it were the cause.`, 'lam'),
    en: 'An error in production. The page threw "Không tải được số liệu". On next start the browser only got a generic minified React message and a digest number; under next dev it got the real message. That is deliberate: server error messages can leak secrets. The real message is in the server log with the same digest — that is how you match a user\'s report to the cause.' },
  { t: 'retry() re-fetches; reset() only re-renders — measured', body: two(tsx(`'use client';
export default function Error({ error, reset, retry }) {
  return <>
    <p>⚠️ {error.message}</p>
    <button onClick={() => reset()}>reset()</button>
    <button onClick={() => retry()}>retry()</button>
  </>;
}`, { sm: true, hl: [5, 6] }), cmp(['', 'after click (2.5 s)', 'server render?'], [
      ['<code>reset()</code>', '<b>still the error</b> (same digest)', 'no new log line'],
      ['<code>retry()</code>', '"Bảng điều khiển · lần 6"', '<b>render #6</b> in the log'],
    ], { hl: [1] }), '') + tn(O('logloi').split('\n').slice(1).join('\n'), { fs: 16, title: 'server log of next start: load ?loi=1 → reset() → retry() (real)' }) + two(box('Next.js 16', '<code>retry</code> arrived in 16.2 (as <code>unstable_retry</code>) and is stable since 16.3. It re-fetches the segment from the server and re-renders it.', 'xanh'),
      box('Older tutorials (and Next 14/15)', 'Only have <code>reset()</code>: clears the error state and re-renders <i>without</i> re-fetching. A Server Component that failed stays failed.', 'do2'), ''),
    en: 'Retry versus reset, measured. The page fails on odd attempts. Clicking reset waited two and a half seconds: still the error, and the server log shows no new render. Clicking retry: the server rendered again — render number six — and the content came back. Retry arrived in Next sixteen point two and is stable since sixteen point three. Older tutorials only have reset, which does not re-fetch.' },
  { t: 'not-found.tsx: notFound() vs a URL that matches nothing', body: two(D(tsx(`import { notFound } from 'next/navigation';
export default function KhongCo() {
  notFound();   // ⇒ nearest not-found.tsx
}`, { sm: true, hl: [3] }), B('kc-js', { vp: 640, h: 80, w: 520, url: 'localhost:3000/dashboard/khong-co · 404' })),
      D(B('xyz', { vp: 640, h: 200, w: 480, url: 'localhost:3000/dashboard/xyz · 404' }), box('Unmatched URL ⇒ the ROOT 404', '<code>/dashboard/xyz</code> matches no folder, so the dashboard layout and its <code>not-found.tsx</code> never run — Next.js shows the root 404.', 'lam')), '') +
      box('Rule', 'A nested <code>not-found.tsx</code> answers <code>notFound()</code> calls <b>inside its segment</b>, inside its layout. URLs that match no route go to <code>app/not-found.tsx</code> (or the built-in page).', 'xanh'),
    en: 'Not-found: two different cases. A page that calls notFound renders the nearest not-found file inside the dashboard layout — menu on the left, our message on the right, status four oh four. But slash dashboard slash xyz matches no folder at all, so the dashboard layout and its not-found never run: Next.js shows the root four oh four page. A nested not-found only answers notFound calls inside its segment.' },
  { t: 'Pitfall: notFound() under loading.tsx', body: tn('$ curl -s localhost:3000/dashboard/khong-co | grep …\n' + lay('mo', /^<nav/, /^<template data-dgst/), { fs: 17, title: 'curl /dashboard/khong-co — the HTML (real)' }) +
      two(D(box('What the HTML really contains', 'Because <code>loading.tsx</code> wraps the page, the 404 is sent as a marker (<code>NEXT_HTTP_ERROR_FALLBACK;404</code>) plus the <b>loading fallback</b>. The not-found UI is drawn by client JavaScript.', 'lam'),
        box('Status is still 404', 'Crawlers get the right code; a user without JavaScript sees "Đang tải số liệu…" for ever. Chapter 10 explains why streaming does this.', 'do2')),
        D(B('kc-js', { vp: 640, h: 80, w: 500, url: 'JavaScript on' }), '<div style="height:12px"></div>', B('kc-nojs', { vp: 640, h: 80, w: 500, url: 'JavaScript off' })), ''),
    en: 'A pitfall we found while measuring. Under a loading boundary, the HTML for the notFound page does not contain our not-found message. It contains a marker for the four oh four plus the loading fallback, and client JavaScript draws the message. With JavaScript on, you see the message; with it off, "Đang tải số liệu" stays for ever. The status code is still four oh four.' },
  { t: 'Pitfall: the two "silent" mistakes — one is not silent', body: cmp(['Mistake', 'next build', 'next dev'], [
      ['folder has components but no <code>page.tsx</code>', 'builds — the URL is simply <b>404</b>', '404'],
      ['<code>page.tsx</code> without <code>export default</code>', '<b>fails</b> at type check (TS2344: not an <code>AppPageConfig</code>)', '<b>500</b> — "The default export is not a React Component"'],
      ['<code>error.tsx</code> without <code>\'use client\'</code>', '<b>fails</b>: "must be a Client Component"', 'error overlay'],
    ], { hl: [0] }) + tn(lay('bayexport', /error TS2344/).replace(/\/Users\/admin\/\.rtq-nxj\/lab\/c8\/my-app/, '…') + '\n' + lay('bayexportdev', /→ 500/) + '\n' + lay('bayexportdev', /default export is not/).split('\n')[0], { fs: 16, title: 'page.tsx without export default — measured on Next.js 16.4.6' }) +
      box('When a route 404s and the files look right', 'Check the two things the router actually reads: is the file named <code>page</code>, and does it have a <b>default</b> export? Only the first is truly silent.', 'lam'),
    en: 'The lesson called both mistakes silent — measured, only one is. A folder with components but no page builds fine and the URL is simply four oh four. A page without export default fails: next build stops at the type check, and next dev answers five hundred with "The default export is not a React Component". So when a route four-oh-fours, check the file name first; that is the truly silent one.' },
  { t: 'On cuongthai.com', body: two(tn('$ find frontend/src/app -name <file> | wc -l\n' + lay('thuc', /^(loading|error|global-error|not-found)/), { fs: 19, title: 'frontend/src/app (real)' }), tn('$ curl https://cuongthai.com/khong-co-trang-nay\n' + lay('thuc', /→ 404/).replace('GET https://cuongthai.com/khong-co-trang-nay', 'status') + '\n' + lay('thuc', /<h2/).replace(/<h2[^>]*>/, '<h2>'), { fs: 16, title: 'production (real)' }), '') +
      box('What the numbers say', '23 segments show a loading screen while data arrives. Only 2 segments have their own error boundary, plus a <code>global-error.tsx</code> for the root layout. With <b>no</b> <code>not-found.tsx</code>, a missing URL shows Next.js\'s built-in 404 — exactly what the production check returned.', 'lam') +
      box('Both error boundaries call reset()', 'cuongthai.com runs Next.js 14.2, which has no <code>retry()</code>. On Next.js 16 the measured difference matters: a "Try again" button that only calls <code>reset()</code> does not re-fetch a failed Server Component.', 'do2'),
    en: 'On cuongthai.com: twenty-three loading files, two error boundaries plus one global error for the root layout, and zero not-found files. So a URL that does not exist shows Next.js\'s built-in four oh four — and that is exactly what a request to production returned.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Special file', 'a reserved file name that Next.js handles itself'), kw('page.tsx', 'the UI of the route; the only file that makes a URL'),
      kw('layout.tsx', 'shared wrapper that stays mounted'), kw('loading.tsx', 'automatic Suspense fallback while the segment loads'),
      kw('error.tsx', 'error boundary of the segment — a Client Component'), kw('retry() / reset()', 're-fetch + re-render / re-render only'),
      kw('digest', 'the id that links a hidden production error to the server log'), kw('not-found.tsx', 'UI for notFound() in its segment'),
      kw('Colocation', 'keeping a route\'s helpers next to it — ignored by the router'),
    ].join('')}</div>`,
    en: 'Key terms: special file; page; layout; loading; error; retry and reset; digest; not-found; and colocation.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `In a route folder add ${c('page.tsx')}, ${c('loading.tsx')} and ${c('error.tsx')}; slow the page with an ${c('await')} and watch the fallback`,
      `Throw in the page: compare the message on ${c('next dev')} and ${c('next start')}, and find the digest in the server log`,
      `Wire a button to ${c('retry()')} and another to ${c('reset()')} — which one recovers?`,
      `Add ${c('not-found.tsx')}, call ${c('notFound()')}, then visit a URL that matches nothing`,
    ]), box('Keep these', `<ul><li>Only <code>page</code> makes a URL</li><li>layout → error → loading → page</li><li>Production hides error messages: use the digest</li><li><code>retry()</code> re-fetches, <code>reset()</code> does not</li></ul>`, 'lam'), ''),
    en: 'Your turn: add page, loading and error to a folder and slow the page down; throw and compare the message in dev and in production, then find the digest in the log; wire one button to retry and one to reset and see which recovers; and call notFound, then visit a URL that matches nothing. Keep: only page makes a URL; the stacking order; production hides messages; retry re-fetches, reset does not.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — The App Router: routing by folders', bai: '8.2' }, S);
