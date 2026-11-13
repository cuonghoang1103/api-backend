/*DU_LIEU*/
const DU_LIEU = {
 "n9-2:file:src/app/dem/Counter.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Counter() {\n  const [n, setN] = useState(0);\n  console.log('[Counter] render · n =', n, '· van-tay-client-92', typeof window === 'undefined' ? '· ở MÁY CHỦ' : '· ở TRÌNH DUYỆT');\n  return <button id=\"dem\" className=\"rounded border px-3 py-1\" onClick={() => setN(n + 1)}>Đếm: {n}</button>;\n}\n",
 "n9-2:file:src/app/dem/page.tsx": "import Counter from './Counter';\n\nexport default function TrangDem() {\n  console.log('[dem/page] render · van-tay-server-92');\n  return (\n    <main className=\"space-y-2 p-4 font-sans\">\n      <h1>Trang server, một nút client</h1>\n      <Counter />\n    </main>\n  );\n}\n",
 "n9-2:trang": "$ find src/app/dem -type f | sort\nsrc/app/dem/Counter.tsx\nsrc/app/dem/page.tsx\n$ npm run build\n✓ Compiled successfully in 2.4s\n[dem/page] render · van-tay-server-92\n[Counter] render · n = 0 · van-tay-client-92 · ở MÁY CHỦ\nRoute (app)\n├ ○ /dem\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ grep -rl 'van-tay-client-92' .next/static | wc -l | sed 's/^ */Counter (use client) trong .next\\/static: /'\nCounter (use client) trong .next/static: 1\n$ grep -rl 'van-tay-server-92' .next/static | wc -l | sed 's/^ */page (server) trong .next\\/static: /'\npage (server) trong .next/static: 0",
 "n9-2:mo": "$ curl -s localhost:19380/dem | grep -o '<button id=\"dem\"[^>]*>[^<]*<!-- -->[^<]*</button>' | sed 's#<!-- -->##'\n<button id=\"dem\" class=\"rounded border px-3 py-1\">Đếm: 0</button>",
 "n9-2:dung": "",
 "n9-2:file:src/app/vi-tri/Nut.tsx": "import { useState } from 'react';\n'use client';\n\nexport default function Nut() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}\n",
 "n9-2:file:src/app/vi-tri/page.tsx": "import Nut from './Nut';\n\nexport default function Trang() {\n  return <Nut />;\n}\n",
 "n9-2:vitri": "$ npm run build   ('use client' nằm SAU import)\n./src/app/vi-tri/Nut.tsx:2:1\n./src/app/vi-tri/Nut.tsx:1:10\nError: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `\"use client\"` directive.\n$ npm run build   (chú thích TRƯỚC 'use client')\n✓ Compiled successfully in 334ms\n└ ○ /vi-tri",
 "n9-2:file:src/app/ls/TuyChon.tsx": "'use client';\n\nexport default function TuyChon() {\n  const theme = localStorage.getItem('theme') ?? 'sáng';   // đọc ngay trong thân component\n  return <p id=\"theme\">Giao diện: {theme}</p>;\n}\n",
 "n9-2:file:src/app/ls/page.tsx": "import TuyChon from './TuyChon';\n\nexport default function Trang() {\n  return <main className=\"p-4 font-sans\"><TuyChon /></main>;\n}\n",
 "n9-2:file:src/app/ls-vao/page.tsx": "import Link from 'next/link';\n\nexport default function Vao() {\n  return <main className=\"p-4 font-sans\"><Link id=\"vao\" href=\"/ls\">Sang trang /ls bằng Link</Link></main>;\n}\n",
 "n9-2:ls": "$ npm run build   (localStorage trong thân Client Component)\nError occurred prerendering page \"/ls\". Read more: https://nextjs.org/docs/messages/prerender-error\nReferenceError: localStorage is not defined\n> 4 |   const theme = localStorage.getItem('theme') ?? 'sáng';   // đọc ngay trong thân component\nExport encountered an error on /ls/page: /ls, exiting the build.",
 "n9-2:lsdev": "$ curl -s -o /dev/null -w 'tải thẳng /ls (next dev): HTTP %{http_code}\\n' localhost:19381/ls\ntải thẳng /ls (next dev): HTTP 500\n$ tr -d '\\000' < ~/.rtq-nxj/nen-c92d.log | grep -a -E 'localStorage is not defined' | head -1 | sed 's/^ *//'\n⨯ ReferenceError: localStorage is not defined",
 "n9-2:lsdevdung": "",
 "n9-2:lsdung": "$ npm run build   (localStorage dời vào useEffect)\n✓ Compiled successfully in 272ms\nRoute (app)\n├ ○ /ls\n├ ○ /ls-vao",
 "n9-2:mo2": "$ curl -s localhost:19380/ls | grep -o '<p id=\"theme\">[^/]*</p>' | sed 's#<!-- -->##'\n<p id=\"theme\">Giao diện: sáng</p>",
 "n9-2:dung2": "",
 "n9-2:file:src/app/ls/TuyChon.sua.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nexport default function TuyChon() {\n  const [theme, setTheme] = useState('sáng');                       // lần vẽ đầu: giá trị mặc định (máy chủ cũng vẽ được)\n  useEffect(() => setTheme(localStorage.getItem('theme') ?? 'sáng'), []);   // chỉ chạy ở trình duyệt, SAU hydrate\n  return <p id=\"theme\">Giao diện: {theme}</p>;\n}\n",
 "anh-nxj-9-2:dem-0": {
  "url": "http://127.0.0.1:19380/dem",
  "vp": [
   640,
   150
  ],
  "rect": {
   "#dem": [
    16,
    48,
    79,
    34
   ],
   "h1": [
    16,
    16,
    608,
    24
   ]
  },
  "console": [
   {
    "kieu": "log",
    "chu": "[Counter] render · n = 0 · van-tay-client-92 · ở TRÌNH DUYỆT"
   }
  ]
 },
 "anh-nxj-9-2:dem": {
  "url": "http://127.0.0.1:19380/dem",
  "vp": [
   640,
   150
  ],
  "rect": {
   "#dem": [
    16,
    48,
    79,
    34
   ],
   "h1": [
    16,
    16,
    608,
    24
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19380/dem",
    "ma": 200,
    "loai": "document",
    "kt": 7284
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/3nz6zd_qbxywk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15047
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/3d4h_wnlfty5a.js",
    "ma": 200,
    "loai": "script",
    "kt": 433
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   }
  ],
  "console": [
   {
    "kieu": "log",
    "chu": "[Counter] render · n = 0 · van-tay-client-92 · ở TRÌNH DUYỆT"
   },
   {
    "kieu": "log",
    "chu": "[Counter] render · n = 1 · van-tay-client-92 · ở TRÌNH DUYỆT"
   },
   {
    "kieu": "log",
    "chu": "[Counter] render · n = 2 · van-tay-client-92 · ở TRÌNH DUYỆT"
   },
   {
    "kieu": "log",
    "chu": "[Counter] render · n = 3 · van-tay-client-92 · ở TRÌNH DUYỆT"
   }
  ],
  "ketQua": {
   "sauBam": "Đếm: 3"
  }
 },
 "anh-nxj-9-2:dem-tat-js": {
  "url": "http://127.0.0.1:19380/dem",
  "vp": [
   640,
   150
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19380/dem",
    "ma": 200,
    "loai": "document",
    "kt": 7284
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/3nz6zd_qbxywk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15047
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   }
  ],
  "console": [],
  "ketQua": {
   "sauBam": "Đếm: 0"
  }
 },
 "anh-nxj-9-2:trong2": {
  "url": "http://127.0.0.1:19380/trong",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19380/trong",
    "ma": 200,
    "loai": "document",
    "kt": 6853
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/3nz6zd_qbxywk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15047
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   },
   {
    "url": "http://127.0.0.1:19380/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": []
 },
 "anh-nxj-9-2:ls-dh": {
  "url": "http://127.0.0.1:19381/ls-vao",
  "vp": [
   640,
   150
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
  ],
  "ketQua": {
   "sauLink": "/ls · Giao diện: sáng"
  }
 },
 "anh-nxj-9-2:ls-thang": {
  "url": "http://127.0.0.1:19381/ls",
  "vp": [
   1000,
   560
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
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
 },
 "anh-nxj-9-2:ls-sau": {
  "url": "http://127.0.0.1:19380/ls",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "dau": "Giao diện: sáng",
   "sauReload": "Giao diện: tối"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, three, steps, kw, c, cmp, br, meter, tiers, flow } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-09-2', code: 'NXJ 9.2', title: "'use client': opting into the browser", sub: 'Chapter 9 · Lesson 9.2' };
const O = (k) => { const v = DU_LIEU[`n9-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-9-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-09-2', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const js = (k) => AN(k).mang.filter((m) => m.loai === 'script');
const sum = (a) => a.reduce((s, m) => s + m.kt, 0);
const JD = js('dem'), JT = js('trong2');
const tenT = new Set(JT.map((m) => m.url.split('/').pop()));
const THEM = JD.filter((m) => !tenT.has(m.url.split('/').pop()));
const CON = AN('dem').console.map((m) => m.chu);
if (THEM.length !== 1 || sum(JD) - sum(JT) !== THEM[0].kt || AN('dem').ketQua.sauBam !== 'Đếm: 3' || AN('dem-tat-js').ketQua.sauBam !== 'Đếm: 0' || js('dem-tat-js').length !== 0) throw new Error('số đo dem 9.2 đổi');
if (CON.length !== 4 || !CON.every((x) => x.includes('ở TRÌNH DUYỆT'))) throw new Error('console 9.2 đổi');
if (AN('ls-dh').ketQua.sauLink !== '/ls · Giao diện: sáng' || AN('ls-sau').ketQua.dau !== 'Giao diện: sáng' || AN('ls-sau').ketQua.sauReload !== 'Giao diện: tối') throw new Error('số đo ls 9.2 đổi');
for (const [k, s] of [['trang', '[Counter] render · n = 0 · van-tay-client-92 · ở MÁY CHỦ'], ['trang', 'trong .next/static: 1'], ['trang', 'page (server) trong .next/static: 0'], ['mo', 'Đếm: 0</button>'],
  ['vitri', "You're importing a module that depends on `useState`"], ['vitri', '✓ Compiled successfully'], ['ls', 'ReferenceError: localStorage is not defined'], ['lsdev', 'HTTP 500'], ['lsdung', '○ /ls'], ['mo2', 'Giao diện: sáng']])
  if (!O(k).includes(s)) throw new Error(`số đo 9.2 đổi: ${k} thiếu "${s}"`);
const KB = (n) => n.toLocaleString('en-US');
const CTR = O('file:src/app/dem/Counter.tsx').trim();
// mã THẬT, chỉ bỏ chú thích cuối dòng (tiếng Việt) cho vừa slide
const goc = (src) => src.trim().split('\n').map((l) => l.replace(/\s+\/\/ .*$/, '')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.2', t: "'use client':<br>opting into the browser", sub: 'One line brings back state, effects and events. Measured: it still renders on the server, what it ships, and the two ways to place it wrong',
    en: 'Lesson nine point two: use client — opting a component into the browser. One line brings back state, effects and events. We measure that it still renders on the server, exactly what it ships, and two ways to get it wrong.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>'use client'</code> at the top of a file brings back <code>useState</code>, effects and <code>onClick</code></li>
    <li>Measured: a Client Component <b>still renders on the server</b> first, then hydrates</li>
    <li>Measured: what it adds to the browser — one chunk, a few hundred bytes</li>
    <li>Who can do what, and the rule of thumb: remember, respond, or touch the browser?</li>
    <li>The directive is a <b>boundary</b>; it must be the first statement; and the <code>localStorage</code> trap</li></ul>`,
    en: 'Five takeaways: use client brings back state, effects and onClick; measured — a Client Component still renders on the server first, then hydrates; measured — what it adds to the browser; who can do what, with a rule of thumb; and the directive as a boundary, its position, and the localStorage trap.' },
  { t: 'When you need interactivity, opt in', body: tsx(CTR.replace(/^  console\.log.*\n/m, '').replace(' onClick={', '\n    onClick={'), { hl: [1, 5, 6, 7] }) +
      three(box('One line, at the very top', '<code>\'use client\'</code> must be the <b>first statement</b> of the file — before every import. Comments may come before it.', 'lam'),
        box('What you get back', 'This component — and the code it pulls in — is bundled and runs in the browser like classic React: <code>useState</code>, effects, <code>onClick</code>, <code>window</code> (after hydration).', 'xanh'),
        box('What it does NOT mean', '"Runs only in the browser". It means "this code is <b>allowed</b> in the browser". The next slide measures it on the server.', 'do2')),
    en: 'When you need interactivity, opt in. One line at the very top of the file — use client — and this component is bundled and runs in the browser like classic React: useState, effects, onClick. The directive must be the first statement, before every import; comments may come first. And it does not mean runs only in the browser. It means this code is allowed in the browser.' },
  { t: 'Measured: it still renders on the server', body: two(D(tn(lay('trang', /Compiled|\[dem\/page\]|\[Counter\]/), { fs: 15, wrap: 62, title: 'npm run build — console.log of BOTH components (real)' }),
      tn(lay('mo', /button/), { fs: 15, wrap: 62, title: 'curl /dem — the HTML (real)' }),
      box('It ran during the build', 'The <code>console.log</code> inside <code>Counter</code> printed <b>during <code>next build</code></b>, with <code>typeof window === "undefined"</code>. The HTML already contains <code>Đếm: 0</code>.', 'lam')),
      tiers([['server', 'render page + Counter', '', '#0070f3'], ['page', 'HTML: &lt;button&gt; Đếm: 0', '', '#1f8a3b'], ['code', `JS chunk: ${KB(THEM[0].kt)} B`, '', '#b85a2b'],
        ['bolt', 'hydrate: attach onClick', '', '#7c3aed'], ['pulse', 'click ×3 → re-render', '', '#7c3aed']], { w: 440, th: 56, gap: 20 }), 'r64'),
    en: 'Measured: a Client Component still renders on the server. Our Counter logs on every render. During next build, its log printed on the server — window was undefined — and the HTML from curl already contains the button with count zero. Then the browser downloads its small chunk, hydrates — attaches onClick to the existing button — and clicks re-render it there.' },
  { t: 'Measured: then it lives in the browser', body: two(D(B('dem', { vp: 640, h: 150, w: 540, url: 'localhost:3000/dem — after 3 clicks' }),
      tn(CON.join('\n'), { fs: 14, title: 'Chromium DevTools console (real)' })),
      D(B('dem-tat-js', { vp: 640, h: 150, w: 540, url: 'JavaScript OFF — after 3 clicks' }),
        box('Hydration = "make it alive"', `With JavaScript <b>on</b>: 4 renders in the browser (n = 0 at hydration, then 1, 2, 3) — <b>${AN('dem').ketQua.sauBam}</b>. With JavaScript <b>off</b>: the same button from the HTML, but clicks do nothing — <b>${AN('dem-tat-js').ketQua.sauBam}</b>.`, 'lam')), '') +
      flow([{ t: 'server HTML', s: 'button visible: Đếm: 0', mau: '#1f8a3b' }, { t: `JS chunk ${KB(THEM[0].kt)} B`, s: 'Counter code arrives', mau: '#b85a2b' },
        { t: 'hydrate', s: 'React attaches onClick', mau: '#7c3aed' }, { t: 'click ×3', s: 'Đếm: 3 (in the browser)', mau: '#0070f3' }], { h: 120, fs: 18 }),
    en: 'Then it lives in the browser. With JavaScript on, the console shows four renders in the browser: n equals zero at hydration, then one, two, three. With JavaScript off, the server HTML still shows the button, but clicking does nothing: it stays at zero. That is hydration — making server HTML alive.' },
  { t: 'Measured: what the directive ships', body: two(tn(lay('trang', /trong \.next\/static/), { fs: 17, title: 'grep a string from each component (real)' }) +
      box('Only the client side ships', 'A string from <code>Counter</code> is in <b>1</b> file under <code>.next/static</code>; the string from the server page is in <b>0</b>. The page stays a Server Component.', 'xanh'),
      D(meter([['/trong — no client code', sum(JT), '#64748b'], ['/dem — page + Counter', sum(JD), '#0070f3', `+${KB(THEM[0].kt)} B`]], { w: 540, nhan: 230, don: 'B', fs: 15 }),
        box(`+1 file, +${KB(THEM[0].kt)} B`, `Chromium downloaded ${JD.length} scripts for <code>/dem</code> vs ${JT.length} for an empty page: the extra one is the Counter chunk. A <i>small</i> leaf costs a few hundred bytes — what you import into it is what gets expensive (9.5).`, 'lam')), ''),
    en: 'What does the directive ship? A string from Counter is in one browser file; the string from the server page is in none — the page stays on the server. Chromium downloaded one extra script for this page: the Counter chunk, four hundred thirty-three bytes. A small leaf is cheap; what you import into it is what gets expensive — lesson nine point five.' },
  { t: 'Who can do what', body: cmp(['', 'What', 'Example'], [
      ['Server Component only', '<code>async/await</code> in the body; DB and file system; secret keys; server-only libraries. Ships 0 JS', 'a course list that queries the DB'],
      ['Client Component only', '<code>useState</code>, <code>useEffect</code>, <code>useRef</code>; <code>onClick</code>, <code>onChange</code>; <code>window</code>, <code>localStorage</code>; <code>useRouter</code>, <code>usePathname</code>', 'the ♥ favourite button in each row'],
      ['Both', 'render JSX, receive props, render other components, compose — most UI looks the same in both', 'a card, a heading'],
      ['The default', 'no directive = Server Component. Add <code>\'use client\'</code> only where interactivity is really needed', '—'],
    ], { hl: [1] }),
    en: 'Who can do what. Only a Server Component: async in the body, the database and file system, secret keys, server-only libraries — zero JavaScript. Only a Client Component: state, effects, refs, event handlers, browser APIs and client hooks like useRouter. Both: render JSX, take props, compose. And the default is server — add use client only where interactivity is really needed.' },
  { t: 'A rule of thumb', body: flow([
      { t: 'Does this piece…', s: 'look at one component', mau: '#475569' }, { t: 'remember something?', s: 'state that changes', mau: '#0070f3' },
      { t: 'respond to the user?', s: 'onClick, onChange', mau: '#0070f3' }, { t: 'touch the browser?', s: 'window, localStorage', mau: '#0070f3' },
    ], { h: 150, fs: 19 }) + two(box('Any yes ⇒ Client Component', 'Mark the <b>smallest</b> component that needs it: the ♥ button, the search box, the tab bar.', 'lam'),
      box('All no ⇒ leave it on the server', 'It only fetches data and renders markup: the course list, the article, the footer.', 'xanh'), '') +
      box('The habit that "works" but wastes', 'Pasting <code>\'use client\'</code> at the top of every file compiles and runs — and quietly turns the app back into one client bundle. Lesson 9.5 measures the cost.', 'do2'),
    en: 'A rule of thumb. Ask of each piece: does it remember something, respond to the user, or touch the browser? Any yes — make the smallest such component a Client Component, like the favourite button. All no — leave it on the server, like the course list. And beware the habit of pasting use client everywhere: it works, and it quietly turns the app back into one client bundle.' },
  { t: 'What the directive actually marks: a boundary', body: steps([
      '<b>An entry point.</b> <code>\'use client\'</code> says "from here down is client code". It does not say "browser only"',
      '<b>Client Components still render on the server</b> — once, for the first HTML (measured: the build log). <code>window</code> is undefined in that pass',
      '<b>Inherited through imports.</b> Every module a client file imports joins the client bundle (9.3 measures it)',
      '<b>NOT inherited through children.</b> A Server Component passed as <code>children</code> stays on the server — the escape hatch of 9.3',
    ]),
    en: 'What the directive actually marks: a boundary, not a location. It is an entry point: from here down is client code. Client Components still render on the server once, for the first HTML — window is undefined there. The boundary is inherited through imports: every module a client file imports joins the bundle. And it is not inherited through children — the escape hatch of the next lesson.' },
  { t: 'Measured: it must be the first statement', body: two(D(tsx(O('file:src/app/vi-tri/Nut.tsx').trim().split('\n').slice(0, 5).join('\n'), { sm: true, hl: [2] }),
      tn(lay('vitri', /^\.\/src.*1:10|You're importing/), { fs: 15, wrap: 60, title: "npm run build — 'use client' AFTER an import (real)" })),
      D(tsx(`// Nút đếm — chú thích ở trên vẫn được\n'use client';\nimport { useState } from 'react';\n…`, { sm: true, hl: [2] }),
        tn(lay('vitri', /Compiled/) + '\n' + lay('vitri', /vi-tri$/), { fs: 15, wrap: 60, title: "npm run build — comment BEFORE the directive (real)" }),
        box('Why', 'After an import, <code>\'use client\'</code> is just a string expression — not a directive. The file stays a Server Component, so <code>useState</code> fails. Comments do not count as statements.', 'lam')), ''),
    en: 'Measured: the directive must be the first statement. We put use client after the import: it is then just a string, not a directive, the file stays a Server Component, and the build fails on useState. With only a comment above it, the build compiles. Comments do not count; imports do.' },
  { t: "Pitfall, measured: localStorage in the component body", body: two(D(tsx(goc(O('file:src/app/ls/TuyChon.tsx')), { sm: true, hl: [4] }),
      tn(lay('ls', /Error occurred|ReferenceError/), { fs: 15, wrap: 60, title: 'npm run build (real)' }),
      tn(lay('lsdev', /HTTP|ReferenceError/), { fs: 15, wrap: 60, title: 'next dev — load /ls directly (real)' })),
      D(B('ls-dh', { vp: 640, h: 90, w: 520, url: 'next dev — /ls reached via <Link>' }),
        box('Fine in dev navigation, fatal on build', `Navigating with a Link renders it in the browser only: <b>${AN('ls-dh').ketQua.sauLink.split(' · ')[1]}</b>. Loading the URL directly runs the server pass: HTTP 500 (dev shows "1 Issue" and recovers on the client); <code>next build</code> refuses.`, 'do2')), ''),
    en: 'The pitfall, measured: reading localStorage in the component body. In dev, reaching the page with a Link works — it renders in the browser. Loading the URL directly runs the server pass: localStorage is not defined, HTTP five hundred, and dev quietly recovers on the client with a one-issue badge. Next build refuses outright: localStorage is not defined while prerendering.' },
  { t: 'The fix: browser-only code after hydration', body: two(tsx(goc(O('file:src/app/ls/TuyChon.sua.tsx')).replace('useEffect(() => ', 'useEffect(() =>\n    '), { sm: true, hl: [5, 6, 7] }),
      D(tn(lay('lsdung', /Compiled|\/ls$/) + '\n' + lay('mo2', /theme/), { fs: 15, wrap: 60, title: 'npm run build · curl /ls (real)' }),
        B('ls-sau', { vp: 640, h: 70, w: 520, url: 'localStorage theme = "tối" — after reload' }),
        box('Two-pass render', `The server (and the first browser render) show the default <b>${AN('ls-sau').ketQua.dau}</b>; the effect then reads the real value — <b>${AN('ls-sau').ketQua.sauReload}</b>. Browser-only APIs go in an effect or an event handler. A value needed on the first paint must come from the server (a cookie — Chapter 15).`, 'xanh')), 'r64'),
    en: 'The fix: move browser-only code after hydration. Start with a default the server can render, and read localStorage in an effect, which only runs in the browser. The build passes; the HTML says light; after the effect runs, the page shows the stored value, dark. If a value is needed on the very first paint, read it on the server — for example from a cookie, chapter fifteen.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw("'use client'", 'directive at the top of a file: the client boundary'), kw('Client Component', 'bundled for the browser; may use state, effects, handlers'),
      kw('Hydration', 'React attaches to the server HTML and makes it interactive'), kw('Server pass', 'Client Components also render once on the server'),
      kw('Boundary', 'from this file down, imports become client code'), kw('Directive position', 'first statement; comments may precede it'),
      kw('Ships JS', 'a Client Component adds a chunk to the bundle'), kw('Two-pass render', 'default first, browser value after an effect'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: use client; Client Component; hydration; the server pass; boundary; directive position; ships JavaScript; and two-pass render.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write a ${c('Counter')} with ${c("'use client'")}; add a ${c('console.log')} — find it in the build output AND in DevTools`,
      `${c('curl')} the page: the button is already in the HTML. Turn JavaScript off: it no longer counts`,
      `Grep ${c('.next/static')} for a string from the client file and from the page`,
      `Read ${c('localStorage')} in the body, run ${c('next build')}; then move it into ${c('useEffect')}`,
    ]), box('Keep these', `<ul><li><code>'use client'</code> = first statement; it marks a boundary</li><li>Client Components render on the server too, then hydrate</li><li>Each one ships JS — keep them small</li><li>Browser APIs only in effects / handlers</li></ul>`, 'lam'), ''),
    en: 'Your turn: write a Counter with use client and a console log, and find the log both in the build output and in DevTools; curl the page and see the button already in the HTML, then turn JavaScript off; grep the static folder; and read localStorage in the body, build, then move it into an effect. Keep: use client is the first statement and marks a boundary; Client Components render on the server too, then hydrate; each ships JavaScript; browser APIs only in effects or handlers.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Server Components vs Client Components', bai: '9.2' }, S);
