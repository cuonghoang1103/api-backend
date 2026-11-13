/*DU_LIEU*/
const DU_LIEU = {
 "n5-5:file:src/app/cuoc-dua/du-lieu.ts": "const TEN: Record<string, string> = { '1': 'An (người dùng 1)', '2': 'Bình (người dùng 2)' };\nconst TRE: Record<string, number> = { '1': 1200, '2': 200 };     // mạng thật: không ai hứa thứ tự\n\nexport async function layNguoiDung(id: string) {\n  await new Promise((r) => setTimeout(r, TRE[id] ?? 300));\n  return { id, name: TEN[id] ?? '?' };\n}\n",
 "n5-5:file:src/app/api/nguoi-dung/[id]/route.ts": "import { layNguoiDung } from '../../../cuoc-dua/du-lieu';\n\nexport async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  return Response.json(await layNguoiDung(id));\n}\n",
 "n5-5:file:src/app/cuoc-dua/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\ntype ND = { id: string; name: string };\nconst nhatKy: string[] = [];\n\nfunction NgayTho({ userId }: { userId: string }) {\n  const [user, setUser] = useState<ND | null>(null);\n  useEffect(() => {\n    fetch(`/api/nguoi-dung/${userId}`)\n      .then((r) => r.json())\n      .then((d: ND) => { nhatKy.push(`ngây thơ: về ${d.id}`); setUser(d); });   // ✗ ai về sau thắng\n  }, [userId]);\n  return <p>ngây thơ: <b id=\"u-ngay\">{user?.name ?? '…'}</b></p>;\n}\n\nfunction CoBoQua({ userId }: { userId: string }) {\n  const [user, setUser] = useState<ND | null>(null);\n  useEffect(() => {\n    let ignore = false;\n    fetch(`/api/nguoi-dung/${userId}`)\n      .then((r) => r.json())\n      .then((d: ND) => {\n        nhatKy.push(`ignore: về ${d.id}${ignore ? ' — bỏ qua' : ''}`);\n        if (!ignore) setUser(d);                    // ✓ chỉ áp nếu còn hiện hành\n      });\n    return () => { ignore = true; };                // cleanup đánh dấu fetch này đã cũ\n  }, [userId]);\n  return <p>cờ ignore: <b id=\"u-ignore\">{user?.name ?? '…'}</b></p>;\n}\n\nfunction CoHuy({ userId }: { userId: string }) {\n  const [user, setUser] = useState<ND | null>(null);\n  useEffect(() => {\n    const ctrl = new AbortController();\n    fetch(`/api/nguoi-dung/${userId}`, { signal: ctrl.signal })\n      .then((r) => r.json())\n      .then((d: ND) => { nhatKy.push(`abort: về ${d.id}`); setUser(d); })\n      .catch((e: Error) => { nhatKy.push(`abort: huỷ ${userId} (${e.name})`); });\n    return () => ctrl.abort();                      // ✓ huỷ hẳn request cũ\n  }, [userId]);\n  return <p>AbortController: <b id=\"u-abort\">{user?.name ?? '…'}</b></p>;\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __nhatKy: nhatKy });   // để đo\n\nexport default function CuocDua() {\n  const [userId, setUserId] = useState('1');\n  const [hien, setHien] = useState(false);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <p>userId = <b id=\"uid\">{userId}</b>{' '}\n        <button id=\"u1\" onClick={() => setUserId('1')} className=\"rounded border px-2\">người dùng 1 (chậm 1200 ms)</button>{' '}\n        <button id=\"u2\" onClick={() => setUserId('2')} className=\"rounded border px-2\">người dùng 2 (nhanh 200 ms)</button>{' '}\n        <button id=\"mo\" onClick={() => setHien(true)} className=\"rounded border px-2\">gắn</button></p>\n      {hien && <><NgayTho userId={userId} /><CoBoQua userId={userId} /><CoHuy userId={userId} /></>}\n    </div>\n  );\n}\n",
 "n5-5:file:src/app/cuoc-dua/sv/[id]/page.tsx": "import { layNguoiDung } from '../../du-lieu';\n\nexport default async function HoSoServer({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  const user = await layNguoiDung(id);              // chỉ await: không effect, không state loading, không đua\n  return <h1 id=\"sv\" className=\"p-6 font-sans text-2xl\">{user.name}</h1>;\n}\n",
 "n5-5:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/cuoc-dua && echo 'eslint: 0 lỗi'\neslint: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|cuoc-dua|nguoi-dung'\n✓ Compiled successfully in 682ms\n├ ƒ /api/nguoi-dung/[id]\n├ ○ /cuoc-dua\n├ ƒ /cuoc-dua/sv/[id]",
 "n5-5:mo": "$ curl -s localhost:19345/api/nguoi-dung/2\n{\"id\":\"2\",\"name\":\"Bình (người dùng 2)\"}\n$ curl -s -o /dev/null -w 'GET /api/nguoi-dung/1 → %{http_code} trong %{time_total} s\\n' localhost:19345/api/nguoi-dung/1\nGET /api/nguoi-dung/1 → 200 trong 1.206815 s\n$ curl -s localhost:19345/cuoc-dua/sv/2 | grep -o '<h1 id=\"sv\"[^<]*</h1>'\n<h1 id=\"sv\" class=\"p-6 font-sans text-2xl\">Bình (người dùng 2)</h1>\n$ curl -s -o /dev/null -w 'next dev GET /cuoc-dua → %{http_code}\\n' localhost:19344/cuoc-dua\nnext dev GET /cuoc-dua → 200",
 "n5-5:dung": "",
 "anh-nxj-5-5:cd-giua": {
  "url": "http://127.0.0.1:19345/cuoc-dua",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#uid": [
    94,
    27,
    12,
    23
   ],
   "#u1": [
    110,
    24,
    258,
    30
   ],
   "#u2": [
    24,
    54,
    261,
    30
   ],
   "#mo": [
    289,
    54,
    49,
    30
   ],
   "#u-ngay": [
    106,
    94,
    169,
    23
   ],
   "#u-ignore": [
    110,
    130,
    169,
    23
   ],
   "#u-abort": [
    160,
    166,
    13,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-5-5:cd-start": {
  "url": "http://127.0.0.1:19345/cuoc-dua",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#uid": [
    94,
    27,
    12,
    23
   ],
   "#u1": [
    110,
    24,
    258,
    30
   ],
   "#u2": [
    24,
    54,
    261,
    30
   ],
   "#mo": [
    289,
    54,
    49,
    30
   ],
   "#u-ngay": [
    106,
    94,
    149,
    23
   ],
   "#u-ignore": [
    110,
    130,
    169,
    23
   ],
   "#u-abort": [
    160,
    166,
    169,
    23
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19345/cuoc-dua",
    "ma": 200,
    "loai": "document",
    "kt": 7529
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/02g62o6aag9ez.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 21038
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/3m3_aw8eh459j.js",
    "ma": 200,
    "loai": "script",
    "kt": 1944
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19345/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19345/api/nguoi-dung/2",
    "ma": 200,
    "loai": "fetch",
    "kt": 44
   },
   {
    "url": "http://127.0.0.1:19345/api/nguoi-dung/2",
    "ma": 200,
    "loai": "fetch",
    "kt": 44
   },
   {
    "url": "http://127.0.0.1:19345/api/nguoi-dung/2",
    "ma": 200,
    "loai": "fetch",
    "kt": 44
   },
   {
    "url": "http://127.0.0.1:19345/api/nguoi-dung/1",
    "ma": 200,
    "loai": "fetch",
    "kt": 41
   },
   {
    "url": "http://127.0.0.1:19345/api/nguoi-dung/1",
    "ma": 200,
    "loai": "fetch",
    "kt": 41
   }
  ],
  "console": [],
  "ketQua": {
   "giua": {
    "ngay": "Bình (người dùng 2)",
    "ignore": "…",
    "abort": "…",
    "nhatKy": [
     "abort: huỷ 1 (AbortError)",
     "ngây thơ: về 2"
    ]
   },
   "cuoi": {
    "ngay": "An (người dùng 1)",
    "ignore": "Bình (người dùng 2)",
    "abort": "Bình (người dùng 2)",
    "nhatKy": [
     "abort: huỷ 1 (AbortError)",
     "ngây thơ: về 2",
     "ignore: về 2",
     "abort: về 2",
     "ngây thơ: về 1",
     "ignore: về 1 — bỏ qua"
    ]
   }
  }
 },
 "anh-nxj-5-5:cd-dev": {
  "url": "http://127.0.0.1:19344/cuoc-dua",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#uid": [
    94,
    27,
    8,
    23
   ],
   "#u1": [
    106,
    24,
    258,
    30
   ],
   "#u2": [
    24,
    54,
    261,
    30
   ],
   "#mo": [
    289,
    54,
    49,
    30
   ],
   "#u-ngay": [
    106,
    94,
    149,
    23
   ],
   "#u-ignore": [
    110,
    130,
    149,
    23
   ],
   "#u-abort": [
    160,
    166,
    149,
    23
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
   }
  ],
  "ketQua": {
   "lamNong": "nóng",
   "sau2_5s": {
    "ngay": "An (người dùng 1)",
    "ignore": "…",
    "abort": "…",
    "nhatKy": [
     "abort: huỷ 1 (AbortError)",
     "ngây thơ: về 1",
     "ignore: về 1 — bỏ qua"
    ]
   },
   "cuoi": {
    "ngay": "An (người dùng 1)",
    "ignore": "An (người dùng 1)",
    "abort": "An (người dùng 1)",
    "nhatKy": [
     "abort: huỷ 1 (AbortError)",
     "ngây thơ: về 1",
     "ignore: về 1 — bỏ qua",
     "ngây thơ: về 1",
     "ignore: về 1",
     "abort: về 1"
    ]
   }
  }
 },
 "anh-nxj-5-5:cd-sv": {
  "url": "http://127.0.0.1:19345/cuoc-dua/sv/2",
  "vp": [
   640,
   120
  ],
  "rect": {
   "#sv": [
    0,
    0,
    640,
    80
   ]
  },
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, seq, tiers } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-05-5', code: 'NXJ 5.5', title: 'Fetching data & the race', sub: 'Chapter 5 · Lesson 5.5' };
const O = (k) => { const v = DU_LIEU[`n5-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-5-5:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-05-5', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const ST = AN('cd-start').ketQua, DV = AN('cd-dev').ketQua.cuoi;
const P = O('file:src/app/cuoc-dua/page.tsx'), SV = O('file:src/app/cuoc-dua/sv/[id]/page.tsx'), TR = O('trang'), MO = O('mo');
for (const s of ['let ignore = false;', 'if (!ignore) setUser(d);', 'return () => { ignore = true; };', 'const ctrl = new AbortController();', 'return () => ctrl.abort();'])
  if (!P.includes(s)) throw new Error('cuoc-dua/page.tsx không có: ' + s);
if (!SV.includes('const user = await layNguoiDung(id);')) throw new Error('sv/[id] đổi');
const G = ST.giua, K = ST.cuoi;
if (G.ngay !== 'Bình (người dùng 2)' || K.ngay !== 'An (người dùng 1)' || K.ignore !== 'Bình (người dùng 2)' || K.abort !== 'Bình (người dùng 2)' || K.nhatKy[0] !== 'abort: huỷ 1 (AbortError)'
  || !K.nhatKy.includes('ignore: về 1 — bỏ qua') || DV.nhatKy.filter((x) => x === 'ngây thơ: về 1').length !== 2 || !DV.nhatKy.includes('ignore: về 1 — bỏ qua') || !DV.nhatKy.includes('abort: huỷ 1 (AbortError)'))
  throw new Error('số đo 5.5 đổi — xem lại slide');
const BUILD = TR.split('\n').filter((l) => /^(✓ Compiled|├ [○ƒ] \/(cuoc-dua|api))/.test(l));
const CURL = MO.split('\n').filter((l) => !l.includes('next dev')).map((l) => l.replace(/localhost:19345/g, 'localhost:3000'));
const tg = CURL.find((l) => l.startsWith('GET /api/nguoi-dung/1'));
if (BUILD.length !== 4 || !tg) throw new Error('build/curl đổi');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.5', t: 'Fetching data<br>& the race', sub: 'The most common effect hides a bug that only shows when responses arrive out of order — and in Next.js you often skip it entirely',
    en: 'Lesson five point five: fetching data, and the race. The most common effect people write is “fetch data when this component mounts or its id changes”. It works — and it hides a race that only shows when responses come back out of order. You must handle it; and in Next.js you will often not write this effect at all.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The naive fetch effect, and why it races — <b>measured</b>: the wrong profile on screen</li>
    <li>Fix 1: an <code>ignore</code> flag set by the cleanup — <b>measured</b></li>
    <li>Fix 2: <code>AbortController</code> — cancels the request itself, <b>measured</b></li>
    <li>Strict Mode's double run, handled by the same fix — <b>measured</b> in dev</li>
    <li>In Next.js: fetch on the server with a plain <code>await</code> — <b>measured</b> with curl</li></ul>`,
    en: 'Five takeaways: the naive fetch and why it races, measured with the wrong profile on screen; fix one, an ignore flag set by the cleanup; fix two, AbortController, which cancels the request itself; Strict Mode’s double run handled by the same fix, measured in dev; and in Next.js, fetching on the server with a plain await, measured with curl.' },
  { t: 'The naive version — and why it races', body: two(tsx(`function NgayTho({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(\`/api/nguoi-dung/\${userId}\`)
      .then((r) => r.json())
      .then((d) => setUser(d)); // ✗ last to ARRIVE wins
  }, [userId]);
}`, { sm: true, hl: [6] }),
      D(cmp(['Fake API (Route Handler, Ch 11)', 'delay'], [['<code>/api/nguoi-dung/1</code>', '1200 ms'], ['<code>/api/nguoi-dung/2</code>', '200 ms']]),
        tn(CURL.slice(0, 4).join('\n'), { fs: 14, wrap: 46, title: 'curl — next start' })), 'r64') +
    seq(['component', 'network'], [[0, 1, 'userId = 1 → fetch 1'], [0, 1, 'userId = 2 → fetch 2 (100 ms later)'], [1, 0, '200 ms: user 2 arrives → setUser(Bình)', '#15803d', true], [1, 0, '1200 ms: user 1 arrives → setUser(An) ✗', '#c0392b', true]], { rh: 32, fs: 16, top: 52 }),
    en: 'The naive version, and why it races. The effect fetches the user and sets state when the response arrives. Now userId goes from one to two quickly: two requests are in flight. Our fake API answers user one in twelve hundred milliseconds and user two in two hundred. User two arrives first and is shown; then user one arrives and overwrites it. The last response to arrive wins — not the last request sent.' },
  { t: 'Measured: the wrong profile, no error anywhere', body: two(D(B('cd-giua', { vp: 640, h: 200, w: 520, url: 'localhost:3000/cuoc-dua · 400 ms after the switch', mark: [[104, 90, 175, 30, '']] }),
      B('cd-start', { vp: 640, h: 200, w: 520, url: '2 s later — userId = 2', mark: [[90, 24, 20, 28, ''], [104, 90, 155, 30, '']] })),
      D(tn(['mount with userId = 1, switch to 2 after 100 ms', '', `at 400 ms   naive: ${G.ngay}`, `at 2 s      naive: ${K.ngay}`, `            ignore: ${K.ignore}`, `            abort:  ${K.abort}`].join('\n'), { fs: 15, title: 'measured — Chromium, next start' }),
        box('Invisible until it bites', 'The screen says userId = 2 and shows user 1. Both requests succeeded; the naive version was even right for a moment, then flipped. On localhost every response is fast and in order, so you never see it — on a real network the order is not guaranteed.', 'do2'))),
    en: 'Measured in a real browser. Mount with userId one, switch to two a hundred milliseconds later. At four hundred milliseconds the naive version correctly shows Bình. At two seconds it shows An — user one — while the page says userId equals two. No error anywhere: both requests succeeded. The ignore and abort versions show Bình.' },
  { t: 'Fix 1: an "ignore" flag in the cleanup', body: tsx(`useEffect(() => {
  let ignore = false;
  fetch(\`/api/nguoi-dung/\${userId}\`)
    .then((r) => r.json())
    .then((d) => {
      if (!ignore) setUser(d);     // only if still current
    });
  return () => { ignore = true; };  // the cleanup marks it stale
}, [userId]);`, { sm: true, hl: [2, 6, 8] }) + two(tn(['log (next start):', ...K.nhatKy.filter((x) => x.startsWith('ignore')).map((x) => '  ' + x)].join('\n'), { fs: 16, title: 'measured' }),
        steps([`userId changes ⇒ React runs the old effect's <b>cleanup first</b> (Lesson 5.2): its ${c('ignore')} becomes true`, 'the old response still arrives — but its check fails, so it is dropped', 'only the current request updates state']), 'r46'),
    en: 'Fix one: an ignore flag. Each run of the effect has its own local ignore, false at first. When userId changes, React runs the old effect’s cleanup first — Lesson five point two — which sets that run’s ignore to true. The old response still arrives, but its check fails and it is dropped. Measured: user two applied, user one arrived later and was skipped.' },
  { t: 'Fix 2: AbortController — cancel the request itself', body: tsx(`useEffect(() => {
  const ctrl = new AbortController();
  fetch(\`/api/nguoi-dung/\${userId}\`, { signal: ctrl.signal })
    .then((r) => r.json())
    .then((d) => setUser(d))
    .catch((e) => { /* AbortError when cancelled */ });
  return () => ctrl.abort();        // cancel the old request
}, [userId]);`, { sm: true, hl: [2, 3, 7] }) + two(tn(['log (next start):', ...K.nhatKy.filter((x) => x.startsWith('abort')).map((x) => '  ' + x)].join('\n'), { fs: 16, title: 'measured' }),
        cmp(['', 'ignore flag', 'AbortController'], [['old response', 'arrives, dropped', 'never arrives'], ['network / server work', 'still spent', 'request cancelled'], ['must handle', '—', '<code>AbortError</code> in <code>catch</code>']]), 'r46'),
    en: 'Fix two: AbortController. Pass its signal to fetch, and call abort in the cleanup. The old request is not just ignored — it is cancelled: measured, the log shows abort, cancelled one, AbortError, before user two arrived. The trade-off: you must catch the AbortError, which is how a cancelled fetch rejects.' },
  { t: 'Strict Mode\'s double run — handled by the same fix', body: two(cmp(['next dev, mount with userId = 1', 'what happened'], [
      ['naive', `<b>${DV.nhatKy.filter((x) => x.startsWith('ngây thơ')).length}</b> requests, both applied`],
      ['ignore flag', 'first run ignored (<code>— bỏ qua</code>), second applied'],
      ['AbortController', 'first run cancelled (<code>AbortError</code>), second applied'],
    ], { hl: [1, 2] }),
      D(tn(['log (next dev):', ...DV.nhatKy.map((x) => '  ' + x)].join('\n'), { fs: 15, title: 'measured — Chromium, next dev' }),
        box('A bonus of doing it right', 'Strict Mode ran mount → cleanup → mount (Lesson 5.3). The cleanup that protects you from the race also cleans up the first, simulated mount — no extra code.', 'xanh'))),
    en: 'Strict Mode’s double run, handled by the same fix. In next dev, mounting with userId one: the naive version fired two requests and applied both. The ignore version ignored the first run and applied the second. The abort version cancelled the first request. The same cleanup that protects you from the race also handles the simulated mount, for free.' },
  { t: 'In Next.js you often skip all of this', body: tsx(`// a Server Component — runs on the server
export default async function HoSoServer({ params }) {
  const { id } = await params;
  const user = await layNguoiDung(id);   // just await
  return <h1>{user.name}</h1>;
}`, { hl: [4] }) + two(tn(['$ npm run build', ...BUILD, '', ...CURL.slice(4)].join('\n'), { fs: 14, wrap: 60, title: 'next build + curl — the name is in the HTML' }),
        B('cd-sv', { vp: 640, h: 80, w: 520, url: 'localhost:3000/cuoc-dua/sv/2 · JavaScript OFF' })),
    en: 'In Next.js you often skip all of this. A Server Component — Chapters nine and ten — fetches on the server before the page is sent, with a plain await: no effect, no useState, no loading state to juggle, no race. Measured: the route is dynamic, and curl shows the name already inside the HTML; with JavaScript off it is still there.' },
  { t: 'When you still fetch in an effect', body: tiers([
      ['server', 'Page data on first load', 'Server Component + await (Ch 9–10) — the default in Next.js', '#15803d'],
      ['search', 'Data in response to interaction', 'search suggestions, infinite scroll — an effect with ignore / abort', '#0070f3'],
      ['layers', 'Lots of client-side fetching', 'TanStack Query (Ch 14) wraps the race, cache and retries for you', '#7c3aed'],
    ], { th: 80, gap: 24 }) + box('Trap: the race only shows on slow networks, and only sometimes', 'Every response on localhost comes back in two milliseconds and in order. Throttle DevTools to <b>Slow 3G</b> and type fast — the wrong results appear immediately. Then add the <code>ignore</code> flag or the abort signal.', 'do2'),
    en: 'When you still fetch in an effect. Page data on first load goes to a Server Component with await — the default in Next.js. Data that loads in response to interaction, like search suggestions or infinite scroll, still uses an effect with ignore or abort. Lots of client fetching: TanStack Query, Chapter fourteen. And remember: the race only shows on slow networks; throttle DevTools to Slow 3G and type fast.' },
  { t: 'Effects, in one paragraph — Chapter 5 recap', body: steps([
      '<b>An effect synchronises</b> an external system with your state; it runs after commit, never on the server (5.1)',
      '<b>It re-runs</b> when its dependencies change, and its cleanup runs first — before each re-run and on unmount (5.2)',
      '<b>In dev it runs twice</b> on mount to prove your cleanup is right (5.3)',
      '<b>Most effects you are tempted to write</b> are derived state, event logic — or data fetching that belongs on the server (5.4, 5.5)',
    ]) + box('Next: Chapter 6', 'The rest of the hooks: <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, <code>useReducer</code>, <code>useContext</code> — and writing your own hooks.', 'lam'),
    en: 'Effects in one paragraph. An effect synchronises an external system with your state; it runs after commit and never on the server. It re-runs when its dependencies change, cleanup first. In development it runs twice on mount to prove the cleanup. And most effects you are tempted to write are derived state, event logic, or data fetching that belongs on the server. Next, Chapter six: the rest of the hooks.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Race condition', 'two requests return out of order; the stale one wins'), kw('ignore flag', 'a boolean the cleanup sets to drop a stale response'),
      kw('AbortController', 'cancels an in-flight fetch from the cleanup'), kw('AbortError', 'how a cancelled fetch rejects — catch it'),
      kw('Loading / error state', 'what a client-side fetch must handle'), kw('Server-side fetch', 'await in a Server Component — no effect, no race'),
      kw('Route Handler', 'an API inside the app folder (Chapter 11)'), kw('Slow 3G', 'DevTools throttling that makes the race visible'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: race condition; ignore flag; AbortController; AbortError; loading and error state; server-side fetch; route handler; and Slow 3G.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Fetch in an effect keyed by a search term; throttle to Slow 3G, type fast, and watch an old response win',
      `Fix it with an ${c('ignore')} flag in the cleanup`,
      `Then with ${c('AbortController')} — catch the ${c('AbortError')}`,
      'Move the first-load fetch into a Server Component and curl the page',
    ]), box('Keep these', `<ul><li>The last response to ARRIVE wins — not the last sent</li><li>Cleanup sets <code>ignore</code> or calls <code>abort()</code></li><li>The same fix handles Strict Mode</li><li>Page data: fetch on the server</li></ul>`, 'lam'), ''),
    en: 'Your turn: fetch in an effect keyed by a search term, throttle to Slow 3G, type fast and watch an old response win; fix it with an ignore flag; then with AbortController, catching the AbortError; and move the first-load fetch into a Server Component and curl the page. Keep: the last response to arrive wins; the cleanup sets ignore or calls abort; the same fix handles Strict Mode; page data belongs on the server.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — Effects', bai: '5.5' }, S);
