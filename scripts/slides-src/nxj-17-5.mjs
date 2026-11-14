/*DU_LIEU*/
const DU_LIEU = {
 "n17-5:file:src/app/api/anh/route.ts": "// app/api/anh/route.ts — serves the hero image after a delay (a slow image, like a big photo on 4G)\nimport { readFile } from 'node:fs/promises';\nexport async function GET(req: Request) {\n  const ms = Number(new URL(req.url).searchParams.get('ms') ?? 0);\n  await new Promise((r) => setTimeout(r, ms));\n  return new Response(await readFile('public/hero.png'), { headers: { 'content-type': 'image/png', 'cache-control': 'no-store' } });\n}\n",
 "n17-5:file:src/app/cwv/cls-xau/page.tsx": "// app/cwv/cls-xau/page.tsx — an image with NO width/height above the text\nexport default function P() {\n  return (\n    <main className=\"p-4\">\n      <img src=\"/api/anh?ms=800\" alt=\"hero\" style={{ width: '100%' }} />\n      <h1 className=\"text-2xl font-bold\">Lesson 17.5</h1>\n      <p id=\"txt\">Tap the button below to start the quiz.</p>\n      <button id=\"nut\" className=\"rounded border px-3\">Start</button>\n    </main>\n  );\n}\n",
 "n17-5:file:src/app/cwv/cls-tot/page.tsx": "// app/cwv/cls-tot/page.tsx — the same image WITH width/height: the browser reserves the space\nexport default function P() {\n  return (\n    <main className=\"p-4\">\n      <img src=\"/api/anh?ms=800\" alt=\"hero\" width={1200} height={630} style={{ width: '100%', height: 'auto' }} />\n      <h1 className=\"text-2xl font-bold\">Lesson 17.5</h1>\n      <p id=\"txt\">Tap the button below to start the quiz.</p>\n      <button id=\"nut\" className=\"rounded border px-3\">Start</button>\n    </main>\n  );\n}\n",
 "n17-5:file:src/app/cwv/inp-xau/page.tsx": "'use client';\n// app/cwv/inp-xau/page.tsx — the click handler does 300 ms of work BEFORE the screen can update\nimport { useState } from 'react';\nfunction heavy(ms: number) { const end = performance.now() + ms; let x = 0; while (performance.now() < end) x++; return x; }\nexport default function P() {\n  const [msg, setMsg] = useState('');\n  return <main className=\"p-4\"><button id=\"nut\" className=\"rounded border px-3\" onClick={() => { heavy(300); setMsg('saved ✓'); }}>Save</button><p id=\"msg\">{msg}</p></main>;\n}\n",
 "n17-5:file:src/app/cwv/inp-tot/page.tsx": "'use client';\n// app/cwv/inp-tot/page.tsx — update the screen first, do the heavy work after the next paint\nimport { useState } from 'react';\nfunction heavy(ms: number) { const end = performance.now() + ms; let x = 0; while (performance.now() < end) x++; return x; }\nexport default function P() {\n  const [msg, setMsg] = useState('');\n  return <main className=\"p-4\"><button id=\"nut\" className=\"rounded border px-3\" onClick={() => { setMsg('saving…'); setTimeout(() => { heavy(300); setMsg('saved ✓'); }, 0); }}>Save</button><p id=\"msg\">{msg}</p></main>;\n}\n",
 "n17-5:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/cwv/|rror|Warning' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 4.4s\n○ /cwv/cls-tot\n○ /cwv/cls-xau\n○ /cwv/inp-tot\n○ /cwv/inp-xau",
 "n17-5:kho": "$ grep -rln \"<img \" src --include=*.tsx | wc -l | sed 's/^ */tệp .tsx có <img: /'\ntệp .tsx có <img: 141\n$ grep -rn \"<img \" src --include=*.tsx | grep -vE \"width=|height=\" | wc -l | sed 's/^ */dòng <img không width\\/height trên cùng dòng: /'\ndòng <img không width/height trên cùng dòng: 176\n$ grep -rln \"next/image\" src | wc -l | sed 's/^ */tệp dùng next\\/image: /'\ntệp dùng next/image: 31\n$ grep -rln \"useReportWebVitals\" src/app src/components src/lib 2>/dev/null | wc -l | sed 's/^ */tệp gọi useReportWebVitals: /'\ntệp gọi useReportWebVitals: 0",
 "n17-5:dung": "",
 "anh-nxj-17-5:cls-xau": {
  "url": "http://localhost:19322/cwv/cls-xau",
  "vp": [
   640,
   400
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19322/cwv/cls-xau",
    "ma": 200,
    "loai": "document",
    "kt": 7946
   },
   {
    "url": "http://localhost:19322/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3gkekdfo3gboy.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14948
   },
   {
    "url": "http://localhost:19322/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19322/api/anh?ms=800",
    "ma": 200,
    "loai": "image",
    "kt": 24053
   }
  ],
  "console": [],
  "ketQua": {
   "cls-xau ⇒": "LCP 872 ms · CLS 0.137 (1 shift)"
  }
 },
 "anh-nxj-17-5:cls-tot": {
  "url": "http://localhost:19322/cwv/cls-tot",
  "vp": [
   640,
   400
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19322/cwv/cls-tot",
    "ma": 200,
    "loai": "document",
    "kt": 8034
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3gkekdfo3gboy.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14948
   },
   {
    "url": "http://localhost:19322/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19322/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19322/api/anh?ms=800",
    "ma": 200,
    "loai": "image",
    "kt": 24053
   }
  ],
  "console": [],
  "ketQua": {
   "cls-tot ⇒": "LCP 824 ms · CLS 0.000 (0 shift)"
  }
 },
 "anh-nxj-17-5:inp-xau": {
  "url": "http://localhost:19322/cwv/inp-xau",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "inp-xau ⇒": "INP ≈ 360 ms · msg: saved ✓"
  }
 },
 "anh-nxj-17-5:inp-tot": {
  "url": "http://localhost:19322/cwv/inp-tot",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "inp-tot ⇒": "INP ≈ 48 ms · msg: saved ✓"
  }
 },
 "anh-nxj-17-5:prod": {
  "url": "https://cuongthai.com/courses/nextjs",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "console": [
   {
    "kieu": "warning",
    "chu": "The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. https://developer.chrome.com/blog/autoplay/#web_audio"
   }
  ],
  "ketQua": {
   "cuongthai.com/courses/nextjs ⇒": "LCP 2620 ms · CLS 0.006 (2 shift)"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n17-5 · lab c17 · Next.js 16.4.6 · next start 19322 · Chromium + PerformanceObserver · prod cuongthai.com)
export const deck = { key: 'nxj-17-5', code: 'NXJ 17.5', title: 'Core Web Vitals', sub: 'Chapter 17 · Lesson 17.5' };
const O = (k) => { const v = DU_LIEU[`n17-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-17-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return Object.values(v.ketQua)[0]; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-17-5', ten, { vp: 640, ...o });
const so = (s, re) => +s.match(re)[1];
const CX = A('cls-xau'), CT = A('cls-tot'), IX = A('inp-xau'), IT = A('inp-tot'), PR = A('prod');
const CLS_X = so(CX, /CLS ([\d.]+)/), CLS_T = so(CT, /CLS ([\d.]+)/), LCP_X = so(CX, /LCP (\d+)/), LCP_T = so(CT, /LCP (\d+)/);
const INP_X = so(IX, /INP ≈ (\d+)/), INP_T = so(IT, /INP ≈ (\d+)/), LCP_P = so(PR, /LCP (\d+)/), CLS_P = so(PR, /CLS ([\d.]+)/);
const BUILD = O('lab').split('\n').filter((l) => /^[┌├└]? ?[○ƒ] \/cwv/.test(l)).map((l) => l.replace(/^[┌├└] /, ''));
const KHO = O('kho').split('\n');
if (!/width=\{1200\} height=\{630\}/.test(O('file:src/app/cwv/cls-tot/page.tsx')) || !/heavy\(300\); setMsg/.test(O('file:src/app/cwv/inp-xau/page.tsx'))) throw new Error('mã lab đổi');
const H_X = "// app/cwv/cls-xau/page.tsx — no width/height\n<img src=\"/api/anh?ms=800\" alt=\"hero\"\n     style={{ width: '100%' }} />\n<h1>Lesson 17.5</h1>\n<p>Tap the button below…</p>\n<button>Start</button>";
const H_T = "// app/cwv/cls-tot/page.tsx — the same image, sized\n<img src=\"/api/anh?ms=800\" alt=\"hero\"\n     width={1200} height={630}\n     style={{ width: '100%', height: 'auto' }} />";
const H_IX = "// inp-xau — 300 ms of work BEFORE the screen updates\nonClick={() => {\n  heavy(300);\n  setMsg('saved ✓');\n}}";
const H_IT = "// inp-tot — paint first, heavy work after\nonClick={() => {\n  setMsg('saving…');\n  setTimeout(() => {\n    heavy(300); setMsg('saved ✓');\n  }, 0);\n}}";
const OBS = "new PerformanceObserver((l) => {\n  for (const e of l.getEntries())\n    if (!e.hadRecentInput) cls += e.value;\n}).observe({ type: 'layout-shift', buffered: true });";

export const S = [
  { cover: true, nhan: 'Chapter 17 · Lesson 17.5', t: 'Core Web Vitals:<br>how Google<br>measures “good”', sub: 'LCP, CLS and INP measured in a real browser: an image without a size, a click handler that blocks, and cuongthai.com itself',
    en: 'Lesson seventeen point five: Core Web Vitals, how Google measures good. We measure LCP, CLS and INP in a real browser: an image without a size, a click handler that blocks, and cuongthai.com itself.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three numbers, three feelings: <b>LCP</b> loaded? · <b>CLS</b> jumped? · <b>INP</b> laggy?</li>
    <li>An image with no size: CLS <b>${CLS_X}</b> — with <code>width</code>/<code>height</code>: <b>${CLS_T}</b></li>
    <li>300 ms of work in a click handler: INP ≈ <b>${INP_X} ms</b> — paint first: ≈ <b>${INP_T} ms</b></li>
    <li>You can read all three yourself with <code>PerformanceObserver</code></li>
    <li>Lab numbers ≠ field numbers: Google ranks on <b>real users</b></li></ul>`,
    en: `Five takeaways. Three numbers, three feelings: loaded, jumped, laggy. An image with no size gave a layout shift of ${CLS_X}; with a size, ${CLS_T}. Three hundred milliseconds of work in a click handler gave an INP of about ${INP_X} milliseconds; painting first, about ${INP_T}. You can read them yourself. And Google ranks on real users, not your laptop.` },
  { t: 'Three numbers, three feelings', body: icards([
      ['eye', 'LCP — Largest Contentful Paint', '“Did it load?” Time until the biggest visible element is painted. <b>Good ≤ 2.5 s</b>.'],
      ['layers', 'CLS — Cumulative Layout Shift', '“Did it jump?” How much visible content moved unexpectedly. <b>Good ≤ 0.1</b>.'],
      ['bolt', 'INP — Interaction to Next Paint', '“Is it laggy?” Time from a click or tap to the next frame. <b>Good ≤ 200 ms</b>.'],
    ], 3) + box('Why numbers', '“Make it faster” is vague. “LCP under 2.5 s, no layout shift, INP under 200 ms” is a task you can measure — and part of how Google ranks pages.', 'lam'),
    en: 'Three numbers, three feelings. LCP: did the main thing load? Good is under two and a half seconds. CLS: did the page jump? Good is under zero point one. INP: when I tap, how fast does it answer? Good is under two hundred milliseconds.' },
  { t: 'The lab: a slow image, with and without a size', to: true, body: two(D(tsx(H_X, { hl: [2, 3] })), D(tsx(H_T, { hl: [3] }), tsx(OBS, { sm: true }),
      box('Measured in the page itself', 'A <code>PerformanceObserver</code> collects every layout shift and the LCP entry — the same numbers Chrome reports.', 'lam')), ''),
    en: 'The lab: the same page twice, with an image that arrives after eight hundred milliseconds. Left, the image has no width or height. Right, it has width and height. A PerformanceObserver in the page collects every layout shift and the LCP.' },
  { t: `Measured: CLS ${CLS_X} vs ${CLS_T}`, body: two(D(meter([['no size · CLS × 1000', Math.round(CLS_X * 1000), '#dc2626'], ['width/height · CLS × 1000', Math.round(CLS_T * 1000), '#16a34a'], ['no size · LCP (ms)', LCP_X, '#64748b'], ['width/height · LCP (ms)', LCP_T, '#64748b']], { don: '', w: 560, nhan: 260, fs: 16 }),
      tn([`cls-xau ⇒ ${CX}`, `cls-tot ⇒ ${CT}`].join('\n'), { fs: 15, wrap: 56, title: 'Chromium · PerformanceObserver (real)' })),
    D(B('cls-xau', { url: 'localhost:3000/cwv/cls-xau · after the image', h: 400, w: 400 }),
      box('The text was laid out, then shoved down', `No size ⇒ 0 px reserved; the image arrives and everything below moves: CLS ${CLS_X} (limit 0.1). With width/height: 0 shifts. LCP is about the same (${LCP_X} vs ${LCP_T} ms) — CLS is movement, not speed.`, 'do2')), ''),
    en: `Measured: without a size, one layout shift with a score of ${CLS_X}, over the limit of zero point one. With width and height, zero shifts. The LCP is about the same in both, around eight hundred milliseconds: CLS is about movement, not speed.` },
  { t: `INP: ${INP_X} ms vs ${INP_T} ms`, to: true, body: two(D(tsx(H_IX, { hl: [3] }), tsx(H_IT, { hl: [3, 4] })),
    D(tn([`inp-xau ⇒ ${IX}`, `inp-tot ⇒ ${IT}`].join('\n'), { fs: 15, wrap: 56, title: 'Chromium · event timing (real)' }),
      meter([['work before paint', INP_X, '#dc2626'], ['paint first', INP_T, '#16a34a']], { don: 'ms (INP)', w: 520, nhan: 200, fs: 16 }),
      box('The click waits for your JavaScript', 'The browser cannot paint the next frame until the handler returns. Show feedback first, move heavy work after the paint (or to the server, or a worker).', 'do2')), ''),
    en: `INP. The bad handler does three hundred milliseconds of work before updating the screen: about ${INP_X} milliseconds from click to paint. The good one shows saving first and does the work after the next paint: about ${INP_T}. The click waits for your JavaScript.` },
  { t: 'What moves each number — the toolbox', body: steps([
      '<b>LCP</b> — HTML from the server (17.1), the main image found early and small (18.2), fonts that do not block (18.4)',
      '<b>CLS</b> — every image, video, ad and embed reserves its space: <code>width</code>/<code>height</code> or <code>next/image</code>',
      '<b>INP</b> — less JavaScript on the client (Server Components, 18.3) and no long work inside handlers',
      '<b>Measure</b> — DevTools Performance / Lighthouse for the lab, real users for the field',
    ]) + box('This chapter gives the scoreboard; Chapter 18 is the toolbox', 'Each later lesson moves one of these three numbers — and measures it.', 'lam'),
    en: 'What moves each number. LCP: HTML from the server, the main image found early and small, fonts that do not block. CLS: every image and embed reserves its space. INP: less client JavaScript and no long work inside handlers. Chapter eighteen is the toolbox.' },
  { t: 'Lab data vs field data', body: two(D(B('prod', { url: 'cuongthai.com/courses/nextjs · Chromium on the course Mac', vp: 1280, h: 800, w: 520 }), tn(`cuongthai.com/courses/nextjs ⇒ ${PR}`, { fs: 14, wrap: 56, title: 'Chromium · PerformanceObserver (real)' })),
    D(box('Lab: one machine, one run', `On the course Mac, a fast network: LCP ${LCP_P} ms — already above 2.5 s — CLS ${CLS_P}. Useful to compare before/after, not to predict users.`, 'lam'),
      box('Field: real users, the 75th percentile', 'Google ranks on data collected from real Chrome users (CrUX): the value that 75% of visits beat, on their phones and networks. A perfect lab score with bad field data means your users have slower devices than you.', 'do2')), ''),
    en: `Lab data versus field data. On the course Mac, cuongthai.com's course page reached an LCP of ${LCP_P} milliseconds, already over two and a half seconds, with almost no layout shift. That is one machine. Google ranks on real Chrome users, the seventy-fifth percentile, on their phones and networks.` },
  { t: 'cuongthai.com: where the numbers come from', body: two(D(tn(KHO.join('\n'), { fs: 13, wrap: 64, title: 'frontend/ (real)' })),
    D(box('Images', 'Many <code>&lt;img&gt;</code> tags do not carry width/height on the same line (a rough grep — some are sized by CSS). Every one without reserved space is a CLS risk.', 'lam'),
      box('No field measurement yet', '<code>useReportWebVitals</code> is not called anywhere: the site cannot see its own users\' LCP/CLS/INP — only Search Console can.', 'do2')), ''),
    en: 'cuongthai.com: many img tags do not carry a width and height on the same line; each one without reserved space is a layout-shift risk. And useReportWebVitals is not called anywhere, so the site does not collect its own users\' numbers.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📱', 'You tap “Pay” and the page jumps', ['a banner loads above, the button moves', 'you tap something else — that is CLS']],
      neu: ['⏳', 'A handler freezes the page for 300 ms?', [`measured: INP ≈ ${INP_X} ms`, 'users tap again ⇒ double orders']],
      xau: ['🎯', 'A late banner as a trap', ['shifts an “Allow” / “Buy” under your finger', 'accidental clicks on ads or permissions']],
      phong: ['🛡️', 'Reserve space · paint first · measure', ['width/height or next/image for every media', 'useReportWebVitals: numbers from real users']],
    }),
    en: 'Real life: you tap Pay and the page jumps because a banner loaded above; you tap something else. What if a handler freezes the page? Users tap again and order twice. Some pages use a late banner as a trap, shifting an Allow or Buy button under your finger. Prevent it: reserve space, paint first, and measure real users.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Core Web Vitals', 'LCP · CLS · INP'), kw('LCP', '≤ 2.5 s · the main thing painted'), kw('CLS', '≤ 0.1 · unexpected movement'), kw('INP', '≤ 200 ms · click to next paint'),
      kw('Reserved space', 'width/height, next/image'), kw('Long task', 'JavaScript that blocks the paint'), kw('PerformanceObserver', 'read the metrics in the page'), kw('Lab vs field', 'your machine vs real users (p75)'),
      kw('useReportWebVitals', 'send real numbers home'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Core Web Vitals; LCP; CLS; INP; reserved space; the long task; PerformanceObserver; lab versus field data; and useReportWebVitals.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Load an image with no size after 800 ms; read CLS with a ${c('PerformanceObserver')}`,
      `Add ${c('width')}/${c('height')}; measure again`,
      'Put 300 ms of work in a click handler; read the event duration; then paint first',
      'Open your own site in DevTools → Performance: LCP, CLS, INP',
    ]), box('Keep these', `<ul><li>LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms</li><li>Every media reserves its space</li><li>Feedback first, heavy work after</li><li>Google ranks on real users</li></ul>`, 'lam'), ''),
    en: 'Your turn: load an image with no size and read the layout shift; add a width and height and measure again; put work in a click handler and read its duration, then paint first; and open your own site in the Performance panel.' },
];
export const slides = lamDeck({ chuong: 'Chapter 17 — Rendering strategies and SEO', bai: '17.5' }, S);
