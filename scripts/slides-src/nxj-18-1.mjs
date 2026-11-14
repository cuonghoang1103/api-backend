/*DU_LIEU*/
const DU_LIEU = {
 "n18-1:file:src/app/cham/page.tsx": "// app/cham/page.tsx — an ordinary blog post: one photo straight from the camera + one client widget\nimport Rows from './Rows';\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      <h1 className=\"text-2xl font-bold\">A weekend in Da Lat</h1>\n      <img id=\"hero\" src=\"/dalat.jpg\" alt=\"Da Lat\" width={4000} height={3000} style={{ width: '100%', height: 'auto' }} />\n      <p>Photo uploaded straight from the camera.</p>\n      <Rows />\n    </main>\n  );\n}\n",
 "n18-1:file:src/app/cham/Rows.tsx": "'use client';\n// app/cham/Rows.tsx — a client widget: highlights a snippet (imports highlight.js) and shows/hides 3000 rows on click\nimport { useState } from 'react';\nimport hljs from 'highlight.js';\nexport default function Rows() {\n  const [n, setN] = useState(0);\n  const code = hljs.highlightAuto('const total = items.reduce((s, x) => s + x, 0);').value;\n  return (\n    <section>\n      <pre dangerouslySetInnerHTML={{ __html: code }} />\n      <button id=\"nut\" className=\"rounded border px-3\" onClick={() => setN(n ? 0 : 3000)}>Show / hide 3000 rows</button>\n      {Array.from({ length: n }, (_, i) => <div key={i}>row {i}</div>)}\n    </section>\n  );\n}\n",
 "n18-1:lab": "$ ls -la public/dalat.jpg | awk '{print $5, $9}'\n4547569 public/dalat.jpg\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -vE '^$|^> |Collecting|Generating|Finalizing|Creating an optimized|Running TypeScript|Linting' | sed 's/^[┌├└] //'\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 19ms\n✓ Compiled successfully in 4.1s\n  Finished TypeScript in 1331ms ...\nRoute (app)\n○ /\n○ /_not-found\nƒ /api/dem\nƒ /api/login\nƒ /api/logout\nƒ /api/me\nƒ /api/posts\nƒ /api/posts/[id]\nƒ /api/steal\n○ /cham\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ ls .next/diagnostics/\nbuild-diagnostics.json\nframework.json\nroute-bundle-stats.json\n$ node -e \"…route-bundle-stats.json…\"   # First Load JS per route, uncompressed + gzip\n/cham   1392 KB JS · gzip 434 KB · 6 chunks\n/        462 KB JS · gzip 137 KB · 6 chunks\n$ curl -s -o /dev/null -w 'start /cham %{http_code}\\n' http://127.0.0.1:19324/cham; curl -s --retry 20 --retry-connrefused --retry-delay 1 -o /dev/null -w 'dev   /cham %{http_code}\\n' http://127.0.0.1:19325/cham\nstart /cham 200\ndev   /cham 200",
 "n18-1:do": "$ npx lighthouse http://localhost:3000/cham --only-categories=performance   # next start\nPerformance 53/100 (mobile, Lighthouse 12.8.2)\nFCP 0.8 s · LCP 26.1 s · TBT 980 ms · CLS 0\nTotal size was 4,940 KiB\n  ▸ Improve image delivery — Est savings of 4,416 KiB\n  ▸ Reduce unused JavaScript — Est savings of 53 KiB\n  ▸ Render blocking requests — Est savings of 130 ms\n$ npx lighthouse http://localhost:3001/cham --only-categories=performance   # next dev (same code)\nPerformance 51/100 (mobile, Lighthouse 12.8.2)\nFCP 0.8 s · LCP 28.8 s · TBT 1,230 ms · CLS 0\nTotal size was 5,714 KiB\n  ▸ Improve image delivery — Est savings of 4,416 KiB\n  ▸ Reduce JavaScript execution time — 1.7 s\n  ▸ Reduce unused JavaScript — Est savings of 324 KiB\n  ▸ Render blocking requests — Est savings of 140 ms",
 "n18-1:kho": "$ npx lighthouse https://cuongthai.com/courses/nextjs --only-categories=performance\nPerformance 47/100 (mobile, Lighthouse 12.8.2)\nFCP 1.7 s · LCP 11.2 s · TBT 1,200 ms · CLS 0\nTotal size was 1,798 KiB\n  ▸ Improve image delivery — Est savings of 247 KiB\n  ▸ Reduce JavaScript execution time — 1.8 s\n  ▸ Reduce unused JavaScript — Est savings of 356 KiB\n  ▸ Render blocking requests — Est savings of 380 ms",
 "n18-1:dung": "",
 "anh-nxj-18-1:start-trang": {
  "url": "http://localhost:19324/cham",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-18-1:start": {
  "url": "http://localhost:19324/cham",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19324/cham",
    "ma": 200,
    "loai": "document",
    "kt": 8094
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/3qtewdmhjdbq5.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15040
   },
   {
    "url": "http://localhost:19324/dalat.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19324/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19324/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19324/_next/static/chunks/1-xtdrpu9zrnc.js",
    "ma": 200,
    "loai": "script",
    "kt": 967953
   }
  ],
  "console": [],
  "ketQua": {
   "start ⇒ tải": "JS 6 files · 435 KB over the wire · 1,392 KB unpacked",
   "start ⇒ bấm": "click → paint, 3 clicks (show · hide · show 3000 rows): 96 · 32 ms"
  }
 },
 "anh-nxj-18-1:dev-trang": {
  "url": "http://localhost:19325/cham",
  "vp": [
   1280,
   800
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
   }
  ]
 },
 "anh-nxj-18-1:dev": {
  "url": "http://localhost:19325/cham",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19325/cham",
    "ma": 200,
    "loai": "document",
    "kt": 14219
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/%5Broot-of-the-server%5D__1jw7kl0uo37a8._.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 19284
   },
   {
    "url": "http://localhost:19325/dalat.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_0fb9-gqu7_t97._.js",
    "ma": 200,
    "loai": "script",
    "kt": 600
   },
   {
    "url": "http://localhost:19325/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19325/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_compiled_react-dom_0grqycjrj6mju._.js",
    "ma": 200,
    "loai": "script",
    "kt": 3769
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/1q96_modules_next_dist_compiled_react-dom_cjs_react-dom_development_1sqry0_53krp4.js",
    "ma": 200,
    "loai": "script",
    "kt": 16685
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_164kp-67asdr9._.js",
    "ma": 200,
    "loai": "script",
    "kt": 180538
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_compiled_1amofcmz--cdp._.js",
    "ma": 200,
    "loai": "script",
    "kt": 144350
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_%40swc_helpers_cjs_1r9vbqwj2323d._.js",
    "ma": 200,
    "loai": "script",
    "kt": 1990
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_05y3oi5z9mc_3._.js",
    "ma": 200,
    "loai": "script",
    "kt": 169034
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/_1anvha4rlo79g._.js",
    "ma": 200,
    "loai": "script",
    "kt": 1089
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/_0bzwrbdi9463d._.js",
    "ma": 200,
    "loai": "script",
    "kt": 748
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/turbopack-_11q0wbt2n0d9y._.js",
    "ma": 200,
    "loai": "script",
    "kt": 112011
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_20wefz_f1k6jn._.js",
    "ma": 200,
    "loai": "script",
    "kt": 61865
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/1daa_next_dist_compiled_react-dom_cjs_react-dom-client_development_0mp0cp_t-ezj9.js",
    "ma": 200,
    "loai": "script",
    "kt": 1051902
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_highlight_js_lib_languages_mathematica_1q61kpo7ltwvg.js",
    "ma": 200,
    "loai": "script",
    "kt": 163253
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_highlight_js_es_index_0_kodyrrtew82.js",
    "ma": 200,
    "loai": "script",
    "kt": 999
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_compiled_next-devtools_index_090k2jmam7qwg.js",
    "ma": 200,
    "loai": "script",
    "kt": 886621
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_highlight_js_lib_1qe-vou54o49r._.js",
    "ma": 200,
    "loai": "script",
    "kt": 111424
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_compiled_react_0qox21c46arid._.js",
    "ma": 200,
    "loai": "script",
    "kt": 13129
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_next_dist_client_1165-soo5tfpf._.js",
    "ma": 200,
    "loai": "script",
    "kt": 899426
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/src_app_cham_Rows_tsx_1-vojphaodusk._.js",
    "ma": 200,
    "loai": "script",
    "kt": 4273
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/node_modules_highlight_js_lib_languages_1l82cd2ktdw39._.js",
    "ma": 200,
    "loai": "script",
    "kt": 1567181
   },
   {
    "url": "http://localhost:19325/_next/static/chunks/%5Bturbopack%5D_browser_dev_hmr-client_hmr-client_ts_1mojsayzyj2p6._.js",
    "ma": 200,
    "loai": "script",
    "kt": 16525
   }
  ],
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   }
  ],
  "ketQua": {
   "dev ⇒ tải": "JS 21 files · 1,206 KB over the wire · 5,281 KB unpacked",
   "dev ⇒ bấm": "click → paint, 3 clicks (show · hide · show 3000 rows): 152 · 16 · 96 ms"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n18-1 · lab c18 · Next.js 16.4.6 · next start 19324 / next dev 19325 · Chromium + Lighthouse 12.8.2 · prod cuongthai.com)
export const deck = { key: 'nxj-18-1', code: 'NXJ 18.1', title: 'Measure first', sub: 'Chapter 18 · Lesson 18.1' };
const O = (k) => { const v = DU_LIEU[`n18-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-18-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-18-1', ten, { vp: 1280, ...o });
const kq = (k, s) => AN(k).ketQua[`${k} ⇒ ${s}`];
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const KB = (b) => Math.round(b / 1024).toLocaleString('en-US');
const BUILD = doan('lab', 'npm run build').filter((l) => !/^\s*(✓ Running|Finished)/.test(l));
const STATS = doan('lab', 'route-bundle-stats.json…');
const so = (s, re) => +s.match(re)[1].replace(/,/g, '');
const JS_CHAM = so(STATS.find((l) => l.startsWith('/cham')), /([\d,]+) KB JS/), JS_GOC = so(STATS.find((l) => l.startsWith('/ ')), /([\d,]+) KB JS/);
const GZ_CHAM = so(STATS.find((l) => l.startsWith('/cham')), /gzip ([\d,]+) KB/);
const LH_S = doan('do', '3000/cham'), LH_D = doan('do', '3001/cham'), LH_P = doan('kho', 'cuongthai.com');
const diem = (ds) => so(ds[0], /Performance (\d+)/), lcp = (ds) => ds[1].match(/LCP ([\d.]+ s)/)[1], tbt = (ds) => ds[1].match(/TBT ([\d,]+ ms)/)[1];
const MANG = [...AN('start').mang].sort((a, b) => b.kt - a.kt);
const ANH = MANG.find((e) => e.loai === 'image'), HLJS = MANG.find((e) => e.loai === 'script');
const TAI_S = kq('start', 'tải'), TAI_D = kq('dev', 'tải');
const BAM = (k) => so(kq(k, 'bấm'), /: (\d+)/);
const BS = BAM('start'), BD = BAM('dev');
const JSW = (s) => so(s, /· ([\d,]+) KB over the wire/), JSF = (s) => so(s, /JS (\d+) files/);
if (!/hljs\.highlightAuto/.test(O('file:src/app/cham/Rows.tsx')) || !/dalat\.jpg/.test(O('file:src/app/cham/page.tsx'))) throw new Error('mã lab đổi');
const P_PAGE = "// app/cham/page.tsx — an ordinary blog post\nimport Rows from './Rows';\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      <h1>A weekend in Da Lat</h1>\n      <img src=\"/dalat.jpg\" alt=\"Da Lat\"\n           width={4000} height={3000}\n           style={{ width: '100%', height: 'auto' }} />\n      <p>Photo uploaded straight from the camera.</p>\n      <Rows />\n    </main>\n  );\n}";
const P_ROWS = "'use client';\n// app/cham/Rows.tsx — a client widget\nimport hljs from 'highlight.js';\nexport default function Rows() {\n  const [n, setN] = useState(0);\n  const code = hljs.highlightAuto('…').value;\n  return (/* <pre> + button + n rows */);\n}";
const ten = (u) => u.replace(/^https?:\/\/[^/]+/, '').replace(/^\/_next\/static\/(chunks|media)\//, '…/').slice(0, 34);

export const S = [
  { cover: true, nhan: 'Chapter 18 · Lesson 18.1', t: 'What makes<br>a page slow<br>(and measure first)', sub: 'One ordinary blog post, measured three ways: the Network tab, the build’s own numbers, and Lighthouse — in a build, not in dev',
    en: 'Lesson eighteen point one: what makes a page slow, and why you measure first. One ordinary blog post, measured three ways: the Network tab, the build’s own numbers, and Lighthouse, on a production build.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Slow pages mostly come from two places: <b>heavy images</b> and <b>too much JavaScript</b></li>
    <li>The Network tab sorted by size: one photo was <b>${KB(ANH.kt)} KB</b> of a ${KB(MANG.reduce((s, e) => s + e.kt, 0))} KB page</li>
    <li>Next.js 16 no longer prints “First Load JS” — read <code>.next/diagnostics/route-bundle-stats.json</code></li>
    <li>Lighthouse names the culprit: <b>${diem(LH_S)}/100</b>, LCP <b>${lcp(LH_S)}</b> on a simulated phone</li>
    <li>Never measure on <code>next dev</code>: ${JSF(TAI_D)} JS files vs ${JSF(TAI_S)}, a click ${BD} ms vs ${BS} ms</li></ul>`,
    en: `Five takeaways. Slow pages mostly come from heavy images and too much JavaScript. Sorted by size, one photo was ${KB(ANH.kt)} kilobytes of the page. Next.js sixteen no longer prints First Load JS, so you read a diagnostics file. Lighthouse names the culprit. And never measure on the dev server.` },
  { t: 'Two places a slow page comes from', body: icards([
      ['box', 'Heavy images', 'A photo straight from a camera is several megabytes. On mobile data it dominates the download — and it is often the LCP element (17.5).'],
      ['code', 'Too much JavaScript', 'Every kilobyte must be downloaded, parsed and run before clicks feel instant. That package is the <b>bundle</b>.'],
    ], 2) + box('What is a “bundle”?', '<code>next build</code> packs your many source files (and every library you import) into a few compressed <code>.js</code> files the browser downloads. Smaller bundle = less to download and run.', 'lam')
    + box('The rule that saves you from guessing', 'Performance intuition is often wrong. Measure the built app first, then change <b>one</b> thing.', 'do2'),
    en: 'A slow page usually comes from two places. Heavy images: a camera photo is several megabytes. And too much JavaScript: every kilobyte must be downloaded, parsed and run. That package of JavaScript is the bundle. The rule: measure first.' },
  { t: 'The lab: an ordinary blog post', to: true, body: two(D(tsx(P_PAGE, { hl: [7, 8] })), D(tsx(P_ROWS, { hl: [3, 6] }),
      box('Nothing looks wrong', `The photo was uploaded as-is (${KB(ANH.kt)} KB, 4000 × 3000). The widget imports <code>highlight.js</code> to colour one line. Both compile, build and render fine.`, 'lam')), ''),
    en: 'The lab: an ordinary blog post. One photo uploaded straight from the camera, four thousand by three thousand pixels. And a small client widget that imports highlight.js to colour one line of code. Nothing looks wrong: it compiles, builds and renders.' },
  { t: 'The Network tab, sorted by size', body: two(D(B('start-trang', { url: 'localhost:3000/cham · next start', h: 620, w: 430 })),
    D(meter(MANG.slice(0, 5).map((e) => [ten(e.url), Math.round(e.kt / 1024), e.loai === 'image' ? '#dc2626' : e.loai === 'script' ? '#ea580c' : '#64748b']), { don: 'KB', w: 560, nhan: 250, fs: 16 }),
      box('One file is the whole story', `<code>dalat.jpg</code> ${KB(ANH.kt)} KB · the biggest JS chunk ${KB(HLJS.kt)} KB (it is highlight.js with every language). Everything else is small.`, 'do2'),
      box('How to read it yourself', 'DevTools → <b>Network</b> → Disable cache → reload → click the <b>Size</b> column header. Big rows first.', 'lam')), 'r46'),
    en: `The Network tab, sorted by size. The photo alone is ${KB(ANH.kt)} kilobytes. The biggest JavaScript chunk, about ${KB(HLJS.kt)} kilobytes, is highlight.js with every language. Everything else is small. Often one file is the whole story.` },
  { t: 'next build: the size column is gone', body: two(D(tn(['$ npm run build', ...BUILD].join('\n'), { fs: 13, wrap: 60, title: 'next build — Next.js 16.4.6 (real)' })),
    D(tn(['$ ls .next/diagnostics/', ...doan('lab', 'ls .next/diagnostics'), '$ node -e "…route-bundle-stats.json…"', ...STATS].join('\n'), { fs: 14, wrap: 58, title: 'the numbers moved here (real)' }),
      meter([['/ (starter page)', JS_GOC, '#64748b'], ['/cham (our post)', JS_CHAM, '#ea580c']], { don: 'KB JS', w: 520, nhan: 190, fs: 16 }),
      box('Older tutorials say “read First Load JS”', `Next.js 16 prints only ○/ƒ. The per-route size is in <code>route-bundle-stats.json</code>: /cham ships ${KB(JS_CHAM * 1024)} KB (${GZ_CHAM} KB gzip), three times the starter page.`, 'do2')), 'r46'),
    en: `next build in Next.js sixteen prints only the route table, no size column. The per-route JavaScript now lives in a diagnostics file: our post ships about ${JS_CHAM} kilobytes, three times the starter page.` },
  { t: `Lighthouse on the build: ${diem(LH_S)}/100`, to: true, body: two(D(tn(['$ npx lighthouse http://localhost:3000/cham --only-categories=performance', ...LH_S].join('\n'), { fs: 15, wrap: 62, title: 'Lighthouse 12.8.2 — simulated mid-range phone, slow 4G (real)' })),
    D(box('It names the culprit', `<b>Improve image delivery</b> — the photo. <b>Total Blocking Time</b> ${tbt(LH_S)} — JavaScript keeping the main thread busy. LCP <b>${lcp(LH_S)}</b>: the photo is the largest element.`, 'do2'),
      box('Where to find it', 'Chrome DevTools → <b>Lighthouse</b> tab → Analyze page load. Or <code>npx lighthouse &lt;url&gt;</code>. Run it on <code>next build &amp;&amp; next start</code>.', 'lam')), 'r64'),
    en: `Lighthouse on the production build scores ${diem(LH_S)} out of a hundred on a simulated mid-range phone. Its top item: improve image delivery, the photo. LCP is ${lcp(LH_S)}, and Total Blocking Time ${tbt(LH_S)}, from JavaScript.` },
  { t: 'Why never measure on next dev', to: true, body: two(D(meter([
      ['JS files · start', JSF(TAI_S), '#16a34a'], ['JS files · dev', JSF(TAI_D), '#dc2626'],
      ['JS over the wire (KB) · start', JSW(TAI_S), '#16a34a'], ['JS over the wire (KB) · dev', JSW(TAI_D), '#dc2626'],
      ['click → 3000 rows (ms) · start', BS, '#16a34a'], ['click → 3000 rows (ms) · dev', BD, '#dc2626'],
    ], { don: '', w: 560, nhan: 290, fs: 16 })),
    D(tn([`start ⇒ ${TAI_S.replace(' over the wire', ' gzip')}`, `dev   ⇒ ${TAI_D.replace(' over the wire', ' gzip')}`, `start ⇒ first click ${BS} ms`, `dev   ⇒ first click ${BD} ms`].join('\n'), { fs: 15, wrap: 60, title: 'Chromium · same code, same machine (real)' }),
      box('Dev is wrong in both directions', 'Unminified code, React’s development build, extra dev-tool chunks: things look slower than they are — and caches can hide real problems. Write code in dev; <b>measure the build</b>.', 'do2')), 'r46') + box('Lighthouse sees it too (same page, same machine)', `next start: <b>${diem(LH_S)}/100</b>, LCP ${lcp(LH_S)}, TBT ${tbt(LH_S)} · next dev: <b>${diem(LH_D)}/100</b>, LCP ${lcp(LH_D)}, TBT ${tbt(LH_D)} — the dev numbers describe a page nobody visits.`, 'lam'),
    en: `Why never measure on the dev server. Same code, same machine: dev ships ${JSF(TAI_D)} JavaScript files instead of ${JSF(TAI_S)}, about ${JSW(TAI_D)} kilobytes over the wire instead of ${JSW(TAI_S)}, and a click takes ${BD} milliseconds instead of ${BS}. Measure the build.` },
  { t: 'The measure-first loop', body: steps([
      '<b>Build</b> — <code>next build &amp;&amp; next start</code>; never dev numbers',
      '<b>Read the build</b> — <code>route-bundle-stats.json</code>: a route much heavier than its neighbours is where to look',
      '<b>Network + Lighthouse</b> — sort by size; read the top items, they name the file',
      '<b>Change ONE thing, rebuild, compare</b> — two changes at once and you cannot tell which helped; keep the numbers in the commit message',
    ]) + box('Next lessons fix exactly what we found', '18.2 the photo (next/image) · 18.3 the JavaScript (dynamic import, shared imports) · 18.4 fonts · 18.5 measuring honestly.', 'lam'),
    en: 'The measure-first loop. Build and start, never dev. Read the per-route sizes. Sort the Network tab and run Lighthouse. Then change one thing, rebuild and compare, and keep the numbers in the commit message.' },
  { t: 'cuongthai.com, measured the same way', body: two(D(tn(['$ npx lighthouse https://cuongthai.com/courses/nextjs --only-categories=performance', ...LH_P].join('\n'), { fs: 15, wrap: 62, title: 'Lighthouse 12.8.2 — on the course Mac (real)' })),
    D(box('A real site, not a toy', `The course page scores <b>${diem(LH_P)}/100</b> on a simulated phone: LCP ${lcp(LH_P)}, TBT ${tbt(LH_P)}. Here the top items are JavaScript, not one photo.`, 'do2'),
      box('One run, one machine', 'Lighthouse simulates a phone on slow 4G; the score moves a few points between runs. Compare before/after on the same machine — 18.5 measures this honestly.', 'lam')), 'r64'),
    en: `cuongthai.com measured the same way: the course page scores ${diem(LH_P)} on a simulated phone, LCP ${lcp(LH_P)}. Here the top items are JavaScript execution and unused JavaScript, not one photo. One run on one machine: compare before and after, not absolute numbers.` },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📱', 'A blog on 4G at the bus stop', ['a 4.7 MB photo = seconds of a blank space', 'the reader leaves before it arrives']],
      neu: ['❓', 'What if you “optimise” without measuring?', ['an afternoon memoising components', 'while the real cost was one photo']],
      xau: ['🕵️', 'Heavy pages are cheap to attack', ['a bot fetching your 4.7 MB photo in a loop', 'burns your bandwidth bill, slows real users']],
      phong: ['🛡️', 'Measure, set a budget, watch it', ['Lighthouse + route-bundle-stats per release', 'a budget (e.g. JS per route) that fails CI']],
    }),
    en: 'Real life: a reader on 4G at a bus stop waits seconds for a huge photo and leaves. What if you optimise without measuring? You spend an afternoon on the wrong thing. An attacker can fetch your heaviest file in a loop to burn your bandwidth. Measure, set a budget, and watch it every release.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Bundle', 'the packed JavaScript a page ships'), kw('Measure first', 'numbers before changes'), kw('route-bundle-stats.json', 'per-route JS size (Next.js 16)'), kw('Network tab', 'every file, sort by size'),
      kw('Lighthouse', 'lab score + named culprits'), kw('Total Blocking Time', 'JS keeping the main thread busy'), kw('next dev vs next start', 'never measure dev'), kw('Bottleneck', 'the one cost that dominates'),
      kw('Performance budget', 'a limit that fails the build'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the bundle; measure first; route-bundle-stats; the Network tab; Lighthouse; Total Blocking Time; dev versus start; the bottleneck; and a performance budget.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add a page with a camera photo and a widget that imports a big library`,
      `${c('next build')}, then read ${c('.next/diagnostics/route-bundle-stats.json')} for that route`,
      `${c('next start')}; DevTools → Network → sort by size; then the Lighthouse tab`,
      'Open the same page on next dev and compare the JS files and one click',
    ]), box('Keep these', `<ul><li>Images and JavaScript first</li><li>Measure the build, never dev</li><li>Next.js 16: sizes are in route-bundle-stats.json</li><li>Change one thing, then compare</li></ul>`, 'lam'), ''),
    en: 'Your turn: add a page with a camera photo and a big library; build and read route-bundle-stats; start the app, sort the Network tab and run Lighthouse; then open the same page on dev and compare.' },
];
export const slides = lamDeck({ chuong: 'Chapter 18 — Performance: images, JavaScript and fonts', bai: '18.1' }, S);
