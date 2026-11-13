/*DU_LIEU*/
const DU_LIEU = {
 "n8-1:file:src/app/about/page.tsx": "// app/about/page.tsx\nexport default function AboutPage() {\n  return <h1>Về CuongThai</h1>;\n}\n",
 "n8-1:file:src/app/blog/page.tsx": "export default function BlogPage() {\n  return <h1>Blog</h1>;\n}\n",
 "n8-1:file:src/app/blog/latest/page.tsx": "export default function LatestPage() {\n  return <h1>Bài mới nhất</h1>;\n}\n",
 "n8-1:file:src/app/may-chu/page.tsx": "// Một trang bình thường — KHÔNG có 'use client' ⇒ Server Component\nconst BI_MAT = 'chuoi-nay-chi-o-may-chu-8-1';\n\nexport default function MayChu() {\n  console.log('[may-chu] render lúc', new Date().toISOString());\n  return <h1>Render ở máy chủ · chuỗi bí mật dài {BI_MAT.length} ký tự</h1>;\n}\n",
 "n8-1:trang": "$ find src/app -name '*.tsx' | sort\nsrc/app/about/page.tsx\nsrc/app/blog/latest/page.tsx\nsrc/app/blog/page.tsx\nsrc/app/layout.tsx\nsrc/app/may-chu/page.tsx\nsrc/app/page.tsx\n$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 19ms\n✓ Compiled successfully in 1652ms\n[may-chu] render lúc 2026-11-13T11:31:59.214Z\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /about\n├ ○ /blog\n├ ○ /blog/latest\n└ ○ /may-chu\n○  (Static)  prerendered as static content",
 "n8-1:bimat": "$ grep -rl 'chuoi-nay-chi-o-may-chu' .next/static | wc -l\n       0\n$ grep -rl 'chuoi-nay-chi-o-may-chu' .next/server | sed 's#.*/server/#.next/server/#' | sort\n.next/server/chunks/ssr/[root-of-the-server]__0f5vo0utu7we5._.js.map\n$ grep -o '<h1>[^/]*</h1>' .next/server/app/may-chu.html\n<h1>Render ở máy chủ · chuỗi bí mật dài <!-- -->27<!-- --> ký tự</h1>\n$ grep -c 'chuoi-nay-chi-o-may-chu' .next/server/app/may-chu.html\n0\n$ ls .next/server/app/*.html | sed 's#.next/server/app/##'\n_global-error.html\n_not-found.html\nabout.html\nblog.html\nindex.html\nmay-chu.html",
 "n8-1:mo": "$ for p in / /about /blog /blog/latest /contact; do curl -s -o /dev/null -w \"GET $p → %{http_code}\\n\" localhost:19368$p; done\nGET / → 200\nGET /about → 200\nGET /blog → 200\nGET /blog/latest → 200\nGET /contact → 404\n$ curl -s localhost:19368/about | grep -o '<h1>[^<]*</h1>'\n<h1>Về CuongThai</h1>\n$ for i in 1 2 3; do curl -s -o /dev/null localhost:19368/may-chu; done; echo 'đã gọi /may-chu 3 lần'\nđã gọi /may-chu 3 lần\n$ npx next start   (log máy chủ sau 3 lần gọi)\n▲ Next.js 16.4.6\n- Local:         http://127.0.0.1:19368\n- Network:       http://127.0.0.1:19368\n✓ Ready in 90ms\n\n✓ Running next.config.ts took 23ms",
 "n8-1:file:src/app/bay-state/page.tsx": "import { useState } from 'react';\n\nexport default function BayState() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Đã bấm {n} lần</button>;\n}\n",
 "n8-1:baystate": "$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 18ms\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./src/app/bay-state/page.tsx:1:10\nError: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `\"use client\"` directive.\n    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client\n> 1 | import { useState } from 'react';\n    |          ^^^^^^^^\n  2 |\n  3 | export default function BayState() {\n  4 |   const [n, setN] = useState(0);\nEcmascript file had an error\n    at ignore-listed frames",
 "n8-1:file:src/app/bay-window/page.tsx": "export default function BayWindow() {\n  const rong = window.innerWidth;\n  return <p>Cửa sổ rộng {rong}px</p>;\n}\n",
 "n8-1:baywindow": "$ npm run build\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 18ms\n✓ Compiled successfully in 259ms\n  Running TypeScript ...\n  Finished TypeScript in 908ms ...\n  Collecting page data using 9 workers ...\n  Generating static pages using 9 workers (0/9) ...\n[may-chu] render lúc 2026-11-13T11:31:45.935Z\nError occurred prerendering page \"/bay-window\". Read more: https://nextjs.org/docs/messages/prerender-error\nReferenceError: window is not defined\n    at <unknown> (src/app/bay-window/page.tsx:2:16)\n  1 | export default function BayWindow() {\n> 2 |   const rong = window.innerWidth;\n    |                ^\n  3 |   return <p>Cửa sổ rộng {rong}px</p>;\n  4 | }\n  5 | {\n  digest: '1403642045'\n}\nExport encountered an error on /bay-window/page: /bay-window, exiting the build.\n⨯ Next.js build worker exited with code: 1 and signal: null",
 "n8-1:thuc": "$ cd frontend/src/app && for f in page.tsx layout.tsx loading.tsx route.ts; do printf '%-12s %s\\n' \"$f\" \"$(find . -name $f | wc -l)\"; done\npage.tsx     347\nlayout.tsx   58\nloading.tsx  23\nroute.ts     30\n$ ls feed/page.tsx courses/page.tsx exam/page.tsx\ncourses/page.tsx\nexam/page.tsx\nfeed/page.tsx",
 "n8-1:dung": "",
 "anh-nxj-8-1:about": {
  "url": "http://127.0.0.1:19368/about",
  "vp": [
   640,
   200
  ],
  "rect": {
   "h1": [
    0,
    0,
    640,
    24
   ]
  },
  "console": []
 },
 "anh-nxj-8-1:latest": {
  "url": "http://127.0.0.1:19368/blog/latest",
  "vp": [
   640,
   200
  ],
  "rect": {
   "h1": [
    0,
    0,
    640,
    24
   ]
  },
  "console": []
 },
 "anh-nxj-8-1:maychu": {
  "url": "http://127.0.0.1:19368/may-chu",
  "vp": [
   640,
   200
  ],
  "rect": {
   "h1": [
    0,
    0,
    640,
    24
   ]
  },
  "console": []
 },
 "anh-nxj-8-1:contact": {
  "url": "http://127.0.0.1:19368/contact",
  "vp": [
   640,
   240
  ],
  "rect": {
   "h1": [
    179,
    96,
    69,
    49
   ]
  },
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, hub, tree } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-08-1', code: 'NXJ 8.1', title: 'From a React app to the Next.js framework', sub: 'Chapter 8 · Lesson 8.1' };
const O = (k) => { const v = DU_LIEU[`n8-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-8-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-08-1', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const TRANG = O('trang'), BIMAT = O('bimat'), MO = O('mo'), BST = O('baystate'), BWIN = O('baywindow'), THUC = O('thuc');
for (const [k, s] of [['trang', '├ ○ /blog/latest'], ['trang', '[may-chu] render lúc'], ['mo', 'GET /contact → 404'], ['mo', 'GET /about → 200'], ['baystate', 'only available in Client Components'],
  ['baywindow', 'ReferenceError: window is not defined'], ['thuc', 'page.tsx     347'], ['bimat', '<h1>Render ở máy chủ']])
  if (!O(k).includes(s)) throw new Error(`số đo 8.1 đổi: ${k} thiếu "${s}"`);
if (AN('maychu').console.length !== 0 || !/static \| wc -l\n\s+0/.test(BIMAT)) throw new Error('số đo máy chủ 8.1 đổi');
if (/\[may-chu\]/.test(MO)) throw new Error('next start KHÔNG được in [may-chu] (trang ○ render lúc build)');
const BANG = TRANG.slice(TRANG.indexOf('Route (app)'));
const SO = Object.fromEntries(lay('thuc', /^(page|layout|loading|route)\./).split('\n').map((l) => l.trim().split(/\s+/)));

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.1 · Stage 3 begins', t: 'From a React app to the Next.js framework', sub: 'React turns state into UI. Next.js adds the rest: routes from folders, a server that renders, and a build that knows your pages',
    en: 'Lesson eight point one, and the start of stage three: from a React app to the Next.js framework. Seven chapters of plain React taught you to turn state into UI. This chapter adds everything around it: routes from folders, a server that renders, and a build step that knows your pages.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Library vs framework: what React leaves to you, and what Next.js adds</li>
    <li>Two routers in Next.js — and why this course only teaches the App Router</li>
    <li>The one mental shift: a folder under <code>app/</code> is a route, <code>page.tsx</code> makes it reachable</li>
    <li>Server first: a page runs on the server — measured in the build log, the browser console and the bundle</li>
    <li>The trap of the client mindset: two real build errors, and the right fix</li></ul>`,
    en: 'Five takeaways: library versus framework; the two routers and why we only teach the App Router; the one mental shift — a folder is a route; server first, measured three ways; and the trap of carrying the client mindset into the App Router.' },
  { t: 'React is a library — it only turns state into UI', body: hub('React = UI', [
      ['map', 'Which URL → which screen?', 'routing: not React\'s job'], ['server', 'Render on a server first?', 'HTML first: not React\'s job'],
      ['db', 'Fetch, cache, refresh?', 'data life cycle: not React\'s job'], ['box', 'Bundle for production?', 'build: not React\'s job'],
    ], { h: 330 }) + box('A framework answers those four questions for you', 'You stop wiring a router, a server, a data layer and a build pipeline by hand — the framework decides, and you write components inside its conventions.', 'lam'),
    en: 'React is a library. It does one thing very well: turn state into UI. It says nothing about which URL shows which screen, how to render on a server and send HTML first, where and when to fetch and cache data, or how to bundle the app for production. Those four questions are what a framework answers.' },
  { t: 'What Next.js adds on top of React', body: icards([
      ['map', 'Routing from the file system', 'a folder is a URL segment — no route table to keep in sync (this chapter)'],
      ['server', 'A server that renders', 'components run on the server and send HTML — the default (Chapter 9)'],
      ['db', 'Data & cache', 'one place and a clear life cycle to fetch, cache and revalidate (Chapter 10)'],
      ['box', 'Build & deploy', '<code>next build</code> bundles, splits, optimises and decides per route (Chapter 20)'],
    ], 2) + box('You keep everything you learned', 'Components, props, state, hooks, effects, keys — unchanged. Next.js gives them a home: routing, a server and a build pipeline around them. Plus conventions instead of configuration: <code>page</code>, <code>layout</code>, <code>loading</code>, <code>error</code>, <code>not-found</code>.', 'xanh'),
    en: 'What Next.js adds: routing from the file system, so a folder is a URL segment; a server that renders components and sends HTML by default; one place to fetch, cache and revalidate data; and a build that bundles, splits and decides per route. Everything you learned about React stays the same — Next.js gives it a home.' },
  { t: 'Two routers, one winner: the App Router', body: cmp(['', 'Pages Router (old)', 'App Router (modern)'], [
      ['folder', '<code>pages/</code>', '<code>app/</code>'],
      ['a route is', 'every file in <code>pages/</code>', 'a folder with <code>page.tsx</code>'],
      ['Server Components', '—', 'the default'],
      ['nested layouts · streaming · Server Actions', '—', 'built in'],
      ['data fetching', '<code>getServerSideProps</code>, <code>getStaticProps</code>', '<code>async</code> components, <code>fetch</code> (Chapter 10)'],
    ], { hl: [2, 3] }) + two(box('This course = App Router only', 'A tutorial that puts files in <code>pages/</code> or uses <code>getServerSideProps</code> teaches the old model.', 'lam'),
      box('Measured in lesson 0.2', 'On Next.js 16.4.6, <code>getServerSideProps</code> inside <code>app/</code> is not ignored — <code>next build</code> fails: <i>"getServerSideProps" is not supported in app/</i>.', 'do2'), ''),
    en: 'Next.js has two routers for historical reasons. The old Pages Router lives in the pages folder; the modern App Router lives in the app folder and is where Server Components, nested layouts, streaming and Server Actions live. This whole course teaches the App Router. If a tutorial puts files in pages, or uses getServerSideProps, it teaches the old model — and in lesson zero point two that function inside app made the build fail.' },
  { t: 'The core idea: a folder is a route', body: two(tree(['src/app/', '  layout.tsx    // all pages', '*  page.tsx      // /', '  about/', '*    page.tsx    // /about', '  blog/', '*    page.tsx    // /blog', '    latest/', '*      page.tsx  // /blog/latest'], { fs: 21 }),
      D(tn(BANG, { fs: 18, title: 'npm run build — the route table (real)' }), box('No router config', 'No <code>&lt;Route path="/about"&gt;</code>, no route list. Want <code>/about</code>? Create <code>app/about/page.tsx</code>. URL and folder are one.', 'xanh')), 'r64'),
    en: 'The core idea of the App Router: a folder under app is a route segment, and a page file makes it reachable. The folder path becomes the URL path. There is no router configuration and no route list — the real build output on the right lists exactly the folders that contain a page file. Want slash about? Create app slash about slash page dot tsx.' },
  { t: 'Measured: the URLs that exist, and the one that does not', body: two(D(tn('$ curl -w "%{http_code}" :3000<path>\n' + lay('mo', /^GET /), { fs: 19, title: 'next start · curl (real)' }),
      box('/contact → 404', 'No folder, no page — Next.js answers with its built-in 404 page. Nothing to register, nothing to forget.', 'lam')),
      D(B('about', { vp: 640, h: 50, w: 460, url: 'localhost:3000/about' }), '<div style="height:8px"></div>', B('latest', { vp: 640, h: 50, w: 460, url: 'localhost:3000/blog/latest' }), '<div style="height:8px"></div>', B('contact', { vp: 640, h: 240, w: 460, url: 'localhost:3000/contact', mark: [[170, 90, 300, 60, '404']] })), 'r64'),
    en: 'Measured on next start: slash, about, blog and blog latest all answer two hundred; slash contact answers four oh four, because there is no folder for it. In Chromium, about shows its heading, blog latest shows its heading, and contact shows Next.js\'s built-in four oh four page. Nothing to register and nothing to forget.' },
  { t: 'The smallest possible page — and the root layout it lives in', body: two(D(tsx(O('file:src/app/about/page.tsx').trim(), { hl: [2] }),
      box('A page is a React component', 'The <b>default export</b> of <code>page.tsx</code>. Visit <code>/about</code> and it renders. Nothing else is required.', 'xanh')),
      D(tsx(`// src/app/layout.tsx (create-next-app 16.4.6, trimmed)
export const metadata: Metadata = {
  title: "Create Next App",
};
export default function RootLayout(
  { children }: LayoutProps<"/">
) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`, { sm: true, hl: [10] }), box('Every page renders inside it', '<code>{children}</code> is the active page. The root layout is required and owns <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> (lesson 8.3).', 'lam')), ''),
    en: 'The smallest possible page: a React component, exported by default from page dot tsx. That is all a route needs. Every page renders inside the root layout — the file create-next-app generated. It returns html and body, and the active page goes where it says children. Note the type: LayoutProps of slash, a helper Next.js 16 generates from your folders.' },
  { t: 'Server first — measured three ways', body: tsx(O('file:src/app/may-chu/page.tsx').trim().split('\n').slice(1).join('\n'), { sm: true, hl: [4] }) + two(
      tn(lay('trang', /\[may-chu\]/, /may-chu$/) + '\n' + lay('bimat', /static \| wc/, /^\s+0$/), { fs: 15, title: 'next build · bundle check (real)' }),
      cmp(['Where did it run?', 'measured'], [
        ['the log line', '<b>in <code>next build</code></b>, once'],
        ['browser console', `<b>${AN('maychu').console.length}</b> messages`],
        ['3 requests to next start', 'no new log line (○ HTML)'],
        ['secret in <code>.next/static</code>', '<b>0 files</b>'],
      ], { hl: [0, 3] }), '') +
      box('Why the log printed at build time', 'No <code>\'use client\'</code> ⇒ Server Component. The route is ○ static, so Next.js rendered it <b>once, during <code>next build</code></b>, and saved the HTML. A dynamic (ƒ) route would render on every request instead — Chapter 10.', 'lam'),
    en: 'Server first, measured three ways. This page has no use client, so it is a Server Component. Its log line printed during next build — once — not in the browser console, which stayed empty, and not on the three requests to next start, because the route is static and its HTML was built ahead of time. The secret string is in zero files of the browser bundle; the browser receives only the result.' },
  { t: 'React app vs Next.js app, side by side', body: cmp(['', 'React SPA (Vite, Chapters 1–7)', 'Next.js App Router'], [
      ['where a component runs', 'always in the browser', 'on the server by default; in the browser when marked'],
      ['routing', 'install a router, write a route table', 'folders under <code>app/</code>'],
      ['first HTML from the server', 'an empty shell + a script', 'the rendered page'],
      ['data', 'fetch in an effect (5.5)', 'fetch where the data lives (Chapter 10)'],
      ['build output', 'one bundle', 'per-route decisions: ○ static · ƒ dynamic'],
    ], { hl: [0, 2] }) + box('Same React, different home', 'Lesson 0 measured it: a small Next page sends a full HTML page first, a Vite SPA sends an empty shell — and the Next page still ships more JavaScript. Next.js wins first paint, not byte count.', 'lam'),
    en: 'A React single-page app and a Next.js app side by side. In the SPA every component runs in the browser, you wire a router yourself, and the first HTML is an empty shell. In the App Router components run on the server by default, folders are routes, the first HTML is the rendered page, and the build decides per route: static or dynamic.' },
  { t: 'This is how cuongthai.com is built', body: two(D(tn('$ find frontend/src/app -name <file> | wc -l\n' + lay('thuc', /^(page|layout|loading|route)\./), { fs: 19, title: 'cuongthai.com frontend (real)' }),
      tree(['frontend/src/app/', '  layout.tsx   // nav, auth, music', '  feed/', '*    page.tsx   // /feed', '  courses/', '    layout.tsx', '*    page.tsx   // /courses', '    [slug]/    // 8.5', '  exam/', '*    page.tsx   // /exam'], { fs: 19 })),
      box('Not a toy router', `<b>${SO['page.tsx']}</b> <code>page.tsx</code> files, <b>${SO['layout.tsx']}</b> layouts, <b>${SO['loading.tsx']}</b> loading screens, <b>${SO['route.ts']}</b> API route handlers — every page you have visited, including this lesson page, is a <code>page.tsx</code> in a folder of the same name, wrapped by layouts.`, 'xanh'), 'r64'),
    en: 'This is exactly how cuongthai.com is built. Its frontend app folder holds three hundred forty-seven page files, fifty-eight layouts, twenty-three loading screens and thirty API route handlers. Slash feed, slash courses, slash exam, even this lesson page: each one is a page dot tsx in a folder with the same name, wrapped by layouts. The App Router is the production router of the site you are learning on.' },
  { t: 'Pitfall: bringing the client mindset into the App Router', body: two(
      tsx(`// app/bay-state/page.tsx — no 'use client'
import { useState } from 'react';
const [n, setN] = useState(0);`, { sm: true, hl: [2] }),
      tsx(`// app/bay-window/page.tsx
const rong = window.innerWidth;
return <p>Cửa sổ rộng {rong}px</p>;`, { sm: true, hl: [2] }), '') +
      tn(lay('baystate', /^Error: You're importing/) + '\n\n' + lay('baywindow', /prerendering page/, /^ReferenceError/), { fs: 16, title: 'npm run build — two real failures' }) +
      box('The fix is not "use client" everywhere', 'That throws away the framework\'s main advantage. Find the part that really needs the browser — the button, the window size — and mark only that part. Chapter 9 is exactly this.', 'do2'),
    en: 'The pitfall: carrying the client mindset into the App Router. In a Vite app useState and window are always there. Here a page runs on the server, so the same code breaks the build: useState gives a compile error that says it only works in Client Components, and reading window gives window is not defined while prerendering. The fix is not use client on everything — mark only the part that truly needs the browser. That is chapter nine.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Library vs framework', 'React renders UI; Next.js decides routing, server, data, build'), kw('App Router', 'the modern router in app/ — the only one this course teaches'),
      kw('Pages Router', 'the old router in pages/'), kw('Route segment', 'one folder under app/ = one part of the URL'),
      kw('page.tsx', 'makes a segment reachable; its default export is the page'), kw('layout.tsx', 'wraps pages with shared UI (html/body at the root)'),
      kw('Root layout', 'the required top layout; every page renders in its {children}'), kw('Server first', 'App Router components run on the server by default'),
      kw('Convention over configuration', 'file names, not config, decide behaviour'), kw('○ Static', 'route prerendered to HTML at build time'),
    ].join('')}</div>`,
    en: 'Key terms: library versus framework; App Router and Pages Router; route segment; page dot tsx; layout dot tsx; root layout; server first; convention over configuration; and a static route, prerendered to HTML at build time.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Create ${c('app/about/page.tsx')} and ${c('app/blog/latest/page.tsx')}, run ${c('npm run build')} and read the route table`,
      `Open ${c('/about')}, ${c('/blog/latest')} and ${c('/contact')} — two pages and a 404, no router config`,
      `Add a ${c('console.log')} to a page: does it print in the browser, in ${c('next build')}, or on each request?`,
      `Import ${c('useState')} into a page without ${c("'use client'")} and read the build error`,
    ]), box('Keep these', `<ul><li>React = UI; Next.js = routing + server + data + build</li><li>App Router only (<code>app/</code>)</li><li>Folder = segment, <code>page.tsx</code> = reachable</li><li>Pages run on the server by default</li></ul>`, 'lam'), ''),
    en: 'Your turn: create two pages and read the route table; open them plus a missing URL; put a console log in a page and find where it prints; and import useState without use client to read the error yourself. Keep: React is UI, Next.js adds routing, server, data and build; App Router only; a folder is a segment and page dot tsx makes it reachable; pages run on the server by default.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — The App Router: routing by folders', bai: '8.1' }, S);
