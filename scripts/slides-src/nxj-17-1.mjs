/*DU_LIEU*/
const DU_LIEU = {
 "n17-1:file:src/lib/slow-db.ts": "// lib/slow-db.ts — a \"database\" that takes 300 ms and counts every query\nconst g = globalThis as unknown as { __q?: number };\nexport async function slowDb(who: string) {\n  await new Promise((r) => setTimeout(r, 300));\n  g.__q = (g.__q ?? 0) + 1;\n  const at = new Date().toISOString().slice(11, 19);\n  console.log(`[db] query #${g.__q} for ${who} at ${at}`);\n  return { at, q: g.__q };\n}\n",
 "n17-1:file:src/app/r/ssg/page.tsx": "// app/r/ssg/page.tsx — nothing request-specific ⇒ rendered ONCE, at build\nimport { slowDb } from '@/lib/slow-db';\nexport default async function Ssg() {\n  const d = await slowDb('ssg');\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">SSG</h1><p id=\"at\">rendered at {d.at}</p></main>;\n}\n",
 "n17-1:file:src/app/r/isr/page.tsx": "// app/r/isr/page.tsx — static, but re-rendered at most every 10 s\nimport { slowDb } from '@/lib/slow-db';\nexport const revalidate = 10;\nexport default async function Isr() {\n  const d = await slowDb('isr');\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">ISR</h1><p id=\"at\">rendered at {d.at}</p></main>;\n}\n",
 "n17-1:file:src/app/r/ssr/page.tsx": "// app/r/ssr/page.tsx — connection() says \"this needs the request\" ⇒ rendered on EVERY request\nimport { connection } from 'next/server';\nimport { slowDb } from '@/lib/slow-db';\nexport default async function Ssr() {\n  await connection();\n  const d = await slowDb('ssr');\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">SSR</h1><p id=\"at\">rendered at {d.at}</p></main>;\n}\n",
 "n17-1:file:src/app/api/gio/route.ts": "// app/api/gio/route.ts — the JSON endpoint the CSR page calls from the browser\nimport { connection } from 'next/server';\nimport { slowDb } from '@/lib/slow-db';\nexport async function GET() {\n  await connection();\n  return Response.json(await slowDb('csr'));\n}\n",
 "n17-1:file:src/app/r/csr/page.tsx": "'use client';\n// app/r/csr/page.tsx — the server sends a shell; the BROWSER fetches and fills it in\nimport { useEffect, useState } from 'react';\nexport default function Csr() {\n  const [at, setAt] = useState<string | null>(null);\n  useEffect(() => { fetch('/api/gio').then((r) => r.json()).then((d) => setAt(d.at)); }, []);\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">CSR</h1><p id=\"at\">{at ? `rendered at ${at}` : 'loading…'}</p></main>;\n}\n",
 "n17-1:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n# the build log: which pages queried the database DURING the build?\n$ npm run build 2>&1 | grep -E 'Compiled|\\[db\\]|/r/|/api/gio|Revalidate|rror|○|ƒ  \\(' | grep -vE '/api/(dem|login|logout|me|posts|steal)'\n✓ Compiled successfully in 3.5s\n[db] query #1 for isr at 07:53:37\n[db] query #2 for ssg at 07:53:37\nRoute (app)          Revalidate  Expire\n┌ ○ /\n├ ○ /_not-found\n├ ƒ /api/gio\n├ ○ /r/csr\n├ ○ /r/isr                  10s      1y\n├ ○ /r/ssg\n└ ƒ /r/ssr\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand",
 "n17-1:bon": "# the same page, four ways — two requests each, 2 s apart\n$ for p in ssg isr ssr csr; do for i in 1 2; do curl -s localhost:3000/r/$p -o page.html -w \"$p #$i  %{time_starttransfer}s  \"; sed 's/<!-- -->//g' page.html | grep -oE 'rendered at [0-9:]+|loading…'; sleep 2; done; done\nssg #1  0.019930s  rendered at 07:53:37\nssg #2  0.002867s  rendered at 07:53:37\nisr #1  0.005800s  rendered at 07:53:37\nisr #2  0.003368s  rendered at 07:53:37\nssr #1  0.325652s  rendered at 07:53:49\nssr #2  0.306961s  rendered at 07:53:51\ncsr #1  0.006832s  loading…\ncsr #2  0.002299s  loading…\n$ curl -sI localhost:3000/r/ssg | grep -iE 'x-nextjs-cache|cache-control'\nx-nextjs-cache: HIT\nCache-Control: s-maxage=31536000\n$ curl -sI localhost:3000/r/ssr | grep -iE 'x-nextjs-cache|cache-control'\nCache-Control: private, no-cache, no-store, max-age=0, must-revalidate",
 "n17-1:isr": "# ISR: what does the visitor right AFTER the 10-second window get?\n$ for i in 1 2 3 4; do echo -n \"now $(date -u +%T)  \"; curl -si localhost:3000/r/isr | sed 's/<!-- -->//g' | grep -oiE 'x-nextjs-cache: [A-Z]+|rendered at [0-9:]+' | paste -sd' ' -; sleep $([ $i = 2 ] && echo 11 || echo 1); done\nnow 07:53:58  x-nextjs-cache: STALE rendered at 07:53:37\nnow 07:53:59  x-nextjs-cache: HIT rendered at 07:53:58\nnow 07:54:10  x-nextjs-cache: STALE rendered at 07:53:58\nnow 07:54:11  x-nextjs-cache: HIT rendered at 07:54:10",
 "n17-1:nhatky": "▲ Next.js 16.4.6\n- Local:         http://127.0.0.1:19322\n- Network:       http://127.0.0.1:19322\n✓ Ready in 95ms\n\n✓ Running next.config.ts took 23ms\n[db] query #1 for ssr at 07:53:49\n[db] query #2 for ssr at 07:53:51\n[db] query #3 for ssr at 07:53:58\n[db] query #4 for isr at 07:53:58\n[db] query #5 for isr at 07:54:10\n[db] query #6 for csr at 07:54:16\n[db] query #7 for ssr at 07:54:21",
 "n17-1:kho": "$ grep -rlE \"^export const revalidate\" src/app | wc -l | sed 's/^ */tệp có export const revalidate: /'\ntệp có export const revalidate: 4\n$ grep -rnE \"^export const revalidate\" src/app | sed 's/;$//'\nsrc/app/verify-otp/page.tsx:8:export const revalidate = 0\nsrc/app/download/ct-work/page.tsx:15:export const revalidate = 300\nsrc/app/download/page.tsx:31:export const revalidate = 300\nsrc/app/forgot-password/page.tsx:6:export const revalidate = 0\n$ grep -rlE \"^export const dynamic = 'force-dynamic'\" src/app | wc -l | sed 's/^ */tệp có force-dynamic: /'\ntệp có force-dynamic: 39\n$ find src/app -name page.tsx | wc -l | sed 's/^ */page.tsx: /'\npage.tsx: 348\n$ for f in $(find src/app -name page.tsx); do head -c 40 \"$f\" | grep -q \"use client\" && echo \"$f\"; done | wc -l | sed 's/^ */page.tsx mở đầu bằng use client: /'\npage.tsx mở đầu bằng use client: 261\n$ curl -s -o /dev/null -w 'cuongthai.com/courses/nextjs  HTTP %{http_code}  %{size_download} byte  %{time_starttransfer}s\\n' https://cuongthai.com/courses/nextjs\ncuongthai.com/courses/nextjs  HTTP 200  85114 byte  0.283143s\n$ curl -sI https://cuongthai.com/courses/nextjs | grep -iE '^cache-control|^x-nextjs-cache|^x-nextjs-prerender' | tr -d '\\r'\ncache-control: no-cache, no-store, must-revalidate",
 "n17-1:dung": "",
 "anh-nxj-17-1:csr-js": {
  "url": "http://localhost:19322/r/csr",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19322/r/csr",
    "ma": 200,
    "loai": "document",
    "kt": 7781
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3rp76omac5-f8.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14751
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
    "url": "http://localhost:19322/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/456ambcqcs8l-.js",
    "ma": 200,
    "loai": "script",
    "kt": 493
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
    "url": "http://localhost:19322/api/gio",
    "ma": 200,
    "loai": "fetch",
    "kt": 23
   }
  ],
  "console": [],
  "ketQua": {
   "CSR, JS bật ⇒": "rendered at 07:54:16"
  }
 },
 "anh-nxj-17-1:csr-nojs": {
  "url": "http://localhost:19322/r/csr",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19322/r/csr",
    "ma": 200,
    "loai": "document",
    "kt": 7781
   },
   {
    "url": "http://localhost:19322/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3rp76omac5-f8.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14751
   },
   {
    "url": "http://localhost:19322/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   }
  ],
  "console": [],
  "ketQua": {
   "CSR, JS tắt ⇒": "loading…"
  }
 },
 "anh-nxj-17-1:ssr-nojs": {
  "url": "http://localhost:19322/r/ssr",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19322/r/ssr",
    "ma": 200,
    "loai": "document",
    "kt": 7201
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3rp76omac5-f8.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14751
   },
   {
    "url": "http://localhost:19322/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19322/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   }
  ],
  "console": [],
  "ketQua": {
   "SSR, JS tắt ⇒": "rendered at 07:54:21"
  }
 },
 "anh-nxj-17-1:ssg-nojs": {
  "url": "http://localhost:19322/r/ssg",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19322/r/ssg",
    "ma": 200,
    "loai": "document",
    "kt": 7538
   },
   {
    "url": "http://localhost:19322/_next/static/chunks/3rp76omac5-f8.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14751
   },
   {
    "url": "http://localhost:19322/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19322/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   }
  ],
  "console": [],
  "ketQua": {
   "SSG, JS tắt ⇒": "rendered at 07:53:37"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n17-1 · lab c17 · Next.js 16.4.6 · next start 19322 · Chromium)
export const deck = { key: 'nxj-17-1', code: 'NXJ 17.1', title: 'Four ways a page gets made', sub: 'Chapter 17 · Lesson 17.1' };
const O = (k) => { const v = DU_LIEU[`n17-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-17-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim().split('\n').slice(1).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-17-1', ten, { vp: 640, ...o });

const BUILD = O('lab').split('\n').filter((l) => /^\[db\]|Route \(app\)|[○ƒ] \/r\/|ƒ \/api\/gio|^[○ƒ]  \(/.test(l)).map((l) => l.replace(/^[┌├└] /, ''));
const BUILD_DB = BUILD.filter((l) => l.startsWith('[db]'));
const BON = doan('bon', 'for p in').map((l) => l.match(/^(\w+) #(\d)\s+([\d.]+)s\s+(.*)$/)).filter(Boolean).map(([, p, i, s, kq]) => ({ p, i: +i, ms: Math.round(+s * 10000) / 10, kq }));
const MS = (p, i) => BON.find((b) => b.p === p && b.i === i).ms;
const KQ = (p, i) => BON.find((b) => b.p === p && b.i === i).kq;
const H_SSG = doan('bon', '/r/ssg | grep'), H_SSR = doan('bon', '/r/ssr | grep');
const ISR = doan('isr', 'for i in');
const LOG = O('nhatky').split('\n').filter((l) => l.startsWith('[db]'));
const KHO = O('kho').split('\n');
const kho = (dau) => { const i = KHO.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); return KHO[i + 1]; };
const N_PAGE = +kho('-name page.tsx | wc').match(/\d+/)[0], N_CLIENT = +kho('use client" && echo').match(/\d+/)[0], N_DYN = +kho('force-dynamic').match(/\d+/)[0];
const CSR_JS = A('csr-js').ketQua, CSR_NO = A('csr-nojs').ketQua, SSR_NO = A('ssr-nojs').ketQua;
const SSG_SRC = F('src/app/r/ssg/page.tsx'), ISR_SRC = F('src/app/r/isr/page.tsx'), SSR_SRC = F('src/app/r/ssr/page.tsx'), CSR_SRC = F('src/app/r/csr/page.tsx');
const DB_SRC = F('src/lib/slow-db.ts');
if (!/STALE/.test(ISR.join(' ')) || !/HIT/.test(ISR.join(' '))) throw new Error('isr đổi');

if (!/setTimeout\(r, 300\)/.test(DB_SRC) || !/slowDb\('ssg'\)/.test(SSG_SRC) || !/revalidate = 10/.test(ISR_SRC) || !/await connection\(\)/.test(SSR_SRC) || !/fetch\('\/api\/gio'\)/.test(CSR_SRC)) throw new Error('mã lab đổi');
const DB_HIEN = "// lib/slow-db.ts — 300 ms, counts every query\nexport async function slowDb(who: string) {\n  await new Promise((r) => setTimeout(r, 300));\n  g.__q = (g.__q ?? 0) + 1;\n  console.log(`[db] query #${g.__q} for ${who}`);\n  return { at /* HH:MM:SS */, q: g.__q };\n}";
const SSG_HIEN = "// app/r/ssg/page.tsx — nothing request-specific\nexport default async function Ssg() {\n  const d = await slowDb('ssg');\n  return <p>rendered at {d.at}</p>;\n}";

export const S = [
  { cover: true, nhan: 'Chapter 17 · Lesson 17.1', t: 'Four ways<br>a page<br>gets made', sub: 'CSR, SSR, SSG, ISR — the same page built four ways, measured: build log, first byte, the database counter, and what a browser without JavaScript sees',
    en: 'Lesson seventeen point one: four ways a page gets made. CSR, SSR, SSG and ISR. We build the same page four ways and measure the build log, the first byte, the database counter, and what a browser without JavaScript sees.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Rendering = turning components into <b>HTML</b>; the question is <b>where</b> and <b>when</b></li>
    <li>SSG and ISR query the database <b>during the build</b>; SSR on <b>every</b> request</li>
    <li>Measured first byte: ${MS('ssg', 2)} ms static vs ${MS('ssr', 2)} ms per request</li>
    <li>A CSR page ships <code>loading…</code> — no JavaScript, no content</li>
    <li>ISR is not a timer: the first visitor after the window gets the <b>old</b> page</li></ul>`,
    en: `Five takeaways. Rendering turns components into HTML; the question is where and when. SSG and ISR query the database during the build, SSR on every request. Measured first byte: ${MS('ssg', 2)} milliseconds static against ${MS('ssr', 2)} per request. A CSR page ships loading. And ISR is not a timer.` },
  { t: 'A kitchen: four ways to serve the same dish', body: icards([
      ['eye', 'CSR — the diner cooks', 'The server sends an empty plate + a recipe (JavaScript). The browser cooks. A search engine may see the empty plate.'],
      ['server', 'SSR — cooked to order', 'A fresh plate for <b>every</b> request. Always current; the kitchen works for every visitor.'],
      ['box', 'SSG — cooked ahead', 'Cooked once at <b>build</b>, the same plate for everyone. Fastest, cheapest — a snapshot.'],
      ['loop', 'ISR — ahead, re-cooked on demand', 'Like SSG, but after N seconds the <b>next order</b> triggers a re-cook. That diner still gets the old plate.'],
    ], 2) + box('Three things the choice decides', '<b>Speed</b> of the first byte · <b>freshness</b> of the data · <b>findability</b>: a crawler reads the HTML it receives (lesson 17.3).', 'lam'),
    en: 'A kitchen. CSR: the diner cooks; the server sends an empty plate and a recipe. SSR: cooked to order for every request. SSG: cooked ahead at build, one plate for everyone. ISR: cooked ahead, and after N seconds the next order triggers a re-cook. The choice decides speed, freshness and findability.' },
  { t: 'One page, four ways — the lab', to: true, body: two(D(tsx(DB_HIEN, { sm: true, hl: [5] }), tsx(SSG_HIEN, { sm: true, hl: [3] }), box('One line differs per page', 'The same body everywhere; only <code>revalidate</code>, <code>connection()</code> or <code>\'use client\'</code> changes — and with it the build symbol, the timing and the HTML.', 'lam')),
    D(tsx("// app/r/isr/page.tsx — the same body as SSG, plus:\nexport const revalidate = 10;", { sm: true, hl: [2] }), tsx("// app/r/ssr/page.tsx — the same body, plus:\nawait connection();   // 'this needs the request'", { sm: true, hl: [2] }),
      tsx("'use client';   // app/r/csr/page.tsx\nuseEffect(() => { fetch('/api/gio')… }, []);\n// first HTML: 'loading…'", { sm: true, hl: [2] })), ''),
    en: 'The lab: a fake database that takes three hundred milliseconds and counts every query. SSG: nothing request-specific. ISR: the same page with revalidate equals ten. SSR: connection says this needs the request. CSR: a client component that fetches from the browser.' },
  { t: 'The build log: who queried the database at build time?', body: two(D(tn(['$ npm run build', ...BUILD].join('\n'), { fs: 15, wrap: 56, title: 'next build (real)' })),
    D(box('SSG and ISR ran during the build', `The log shows <b>${BUILD_DB.length}</b> queries <i>before any visitor</i> — for <code>isr</code> and <code>ssg</code>. Their HTML is stored, ready to serve.`, 'xanh'),
      box('○ static · ƒ dynamic', '<code>/r/ssr</code> and <code>/api/gio</code> are ƒ. <code>/r/isr</code> is ○ with <b>Revalidate 10s</b>. <code>/r/csr</code> is ○ too: its <i>shell</i> is static.', 'lam')), 'r46'),
    en: `The build log. Before any visitor arrives, the database was queried ${BUILD_DB.length} times: for ISR and SSG. Their HTML is stored. SSR and the API route are marked dynamic. ISR is static with revalidate ten seconds. And the CSR page is static too: only its shell.` },
  { t: 'Measured: two requests each, 2 s apart', body: two(D(meter([['SSG #2', MS('ssg', 2), '#16a34a'], ['ISR #2', MS('isr', 2), '#16a34a'], ['CSR #2 (shell only)', MS('csr', 2), '#94a3b8'], ['SSR #1', MS('ssr', 1), '#dc2626'], ['SSR #2', MS('ssr', 2), '#dc2626']], { don: 'ms to first byte', w: 560, nhan: 230, fs: 16 })),
    D(tn(['$ for p in ssg isr ssr csr; do … curl …; done', ...BON.map((b) => `${b.p} #${b.i}  ${b.ms} ms  ${b.kq}`)].join('\n'), { fs: 14, wrap: 52, title: 'curl (real)' }),
      box('Where the 300 ms goes', `SSR waits for the database on <b>every</b> request — and the time changes (${KQ('ssr', 1).slice(12)} → ${KQ('ssr', 2).slice(12)}). SSG/ISR send a stored file.`, 'do2')), ''),
    en: `Measured, two requests each. SSG and ISR answer in about ${MS('ssg', 2)} milliseconds with the build-time stamp. SSR takes ${MS('ssr', 2)}: it waits for the database on every request, and the time changes. CSR answers fast too, but only with a shell that says loading.` },
  { t: 'CSR: the HTML says “loading…”', body: two(D(`<div style="margin-bottom:10px">${B('csr-js', { url: 'localhost:3000/r/csr · JavaScript on', h: 100, w: 520 })}</div>`, `<div style="margin-bottom:10px">${B('csr-nojs', { url: 'localhost:3000/r/csr · JavaScript off', h: 100, w: 520 })}</div>`, B('ssr-nojs', { url: 'localhost:3000/r/ssr · JavaScript off', h: 100, w: 520 })),
    D(tn([`CSR, JS on   ⇒ ${Object.values(CSR_JS)[0]}   (GET /r/csr + fetch /api/gio)`, `CSR, JS off  ⇒ ${Object.values(CSR_NO)[0]}`, `SSR, JS off  ⇒ ${Object.values(SSR_NO)[0]}`, `curl /r/csr  ⇒ ${KQ('csr', 1)}`].join('\n'), { fs: 14, wrap: 56, title: 'Chromium + curl (real)' }),
      box('Content arrives in a second trip', 'The browser downloads the shell, runs JavaScript, then fetches the data. Whoever does not run JavaScript — a crawler, a link preview, a slow phone mid-load — sees <code>loading…</code>.', 'do2')), ''),
    en: 'CSR: with JavaScript on, the browser fetches the data and shows the time. With JavaScript off, it stays on loading. The SSR page shows the time even with JavaScript off, because the HTML already contains it. curl, like a crawler, sees only loading.' },
  { t: 'ISR is not a timer: stale-while-revalidate', body: two(D(tn(['$ for i in 1 2 3 4; do curl -si localhost:3000/r/isr …; done', ...ISR].join('\n'), { fs: 14, wrap: 60, title: 'curl (real) · revalidate = 10' }),
      steps([`Request after the window ⇒ <b>STALE</b>: the <i>old</i> page, instantly`, 'Next.js re-renders behind it (one database query)', 'The next request ⇒ <b>HIT</b> with the new page'])),
    D(box('Nothing happens on a quiet site', 'No visitor, no re-render: the 10 s is a <i>minimum age</i>, not a schedule. The stamp jumps only when someone asks.', 'lam'),
      box('Who gets old data?', 'Exactly one visitor per window — the one who triggers the rebuild. Fine for a blog list, wrong for a bank balance.', 'do2')), ''),
    en: 'ISR is not a timer. The first request after the window gets STALE: the old page, instantly, while Next.js re-renders behind it. The next request gets HIT with the new page. With no visitors nothing happens: ten seconds is a minimum age, not a schedule.' },
  { t: 'The server log: who hit the database?', body: two(D(tn(['$ next start   # after the build', ...LOG].join('\n'), { fs: 15, wrap: 56, title: 'server log (real)' })),
    D(box('SSR: one query per visit', `${LOG.filter((l) => /for ssr/.test(l)).length} SSR queries — one for every request we made, including the <code>curl -I</code>. A thousand visitors, a thousand queries.`, 'do2'),
      box('ISR: one per window', `${LOG.filter((l) => /for isr/.test(l)).length} ISR queries — only the two stale requests rebuilt it. SSG: <b>0</b> after the build.`, 'xanh'),
      box('CSR: one per browser', 'The query moved to <code>/api/gio</code>, called once per page view — the cost is still there, just later.', 'lam')), ''),
    en: 'The server log after the build. SSR queried the database for every request, including the head request. ISR only twice, once per stale window. SSG, zero. CSR moved its query to the API route, once per page view: the cost is still there, just later.' },
  { t: 'The headers tell you what you got', body: two(D(tn(['$ curl -sI localhost:3000/r/ssg | grep -iE "x-nextjs-cache|cache-control"', ...H_SSG, '$ curl -sI localhost:3000/r/ssr | grep -iE "x-nextjs-cache|cache-control"', ...H_SSR].join('\n'), { fs: 15, wrap: 60, title: 'curl -I (real)' })),
    D(box('Static: a year in shared caches', '<code>s-maxage=31536000</code> lets a CDN keep the file; <code>x-nextjs-cache: HIT</code> means Next.js served the stored copy.', 'xanh'),
      box('Dynamic: never cache', '<code>private, no-cache, no-store</code> — every visitor goes to your server, every time.', 'do2')), ''),
    en: 'The headers tell you what you got. The static page: s-maxage of a year, so a CDN may keep it, and x-nextjs-cache HIT. The dynamic page: private, no-cache, no-store; every visitor goes to your server every time.' },
  { t: 'Choosing — with the numbers from this lab', body: cmp(['', 'SSG', 'ISR (10 s)', 'SSR', 'CSR'], [
      ['first byte', `${MS('ssg', 2)} ms`, `${MS('isr', 2)} ms`, `${MS('ssr', 2)} ms`, `${MS('csr', 2)} ms + JS + fetch`],
      ['DB queries', 'build only', '1 per window', '1 per visit', '1 per page view (API)'],
      ['freshness', 'last deploy', '≤ 10 s + 1 stale visit', 'always', 'always'],
      ['HTML has content', 'yes', 'yes', 'yes', 'no — “loading…”'],
      ['use for', 'docs, landing', 'blog list, catalogue', 'per-user, fast-moving', 'behind login, live widgets'],
    ], { hl: [0, 3] }) + box('You rarely pick by name', 'In the App Router your code implies the strategy: a request API (<code>cookies()</code>, <code>connection()</code>, <code>searchParams</code>) makes the route ƒ; <code>revalidate</code> makes it ISR. The build table is the check — lesson 17.2.', 'lam'),
    en: 'Choosing, with the numbers from this lab. SSG for docs and landing pages, ISR for a blog list, SSR for per-user pages, CSR behind a login or for live widgets. You rarely pick by name: your code implies it, and the build table is the check. That is the next lesson.' },
  { t: 'cuongthai.com: mostly client pages', body: two(D(tn(KHO.join('\n'), { fs: 12, wrap: 70, title: 'frontend/ + production (real)' })),
    D(box(`${N_CLIENT} of ${N_PAGE} pages start with 'use client'`, `About ${Math.round(N_CLIENT / N_PAGE * 100)}%: the page is a client component, so its first HTML carries little data — the browser fetches from the Express API.`, 'lam'),
      box('Four revalidate exports', 'Two pages use <code>revalidate = 300</code> (ISR, 5 minutes: <code>/download</code>); two use <code>0</code>, which simply means dynamic. And <b>' + N_DYN + '</b> files force dynamic.', 'lam'),
      box('nginx overrides the header', 'Production answers <code>no-store</code> even for static pages — nginx rewrites <code>Cache-Control</code> (the 23/08 note in the repo).', 'do2')), ''),
    en: `cuongthai.com: ${N_CLIENT} of ${N_PAGE} page files start with use client, so most first HTML carries little data. Two pages use revalidate three hundred, ISR for five minutes; two use zero, which just means dynamic; ${N_DYN} files force dynamic. And production answers no-store: nginx rewrites the header.` },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🎟️', 'Exam results day on the school portal', ['thousands refresh the same page at once', 'SSR: one database query per refresh']],
      neu: ['📰', 'A price page on ISR with a long window?', ['one visitor per window sees the old price', 'fine for news, risky for stock or money']],
      xau: ['🌊', 'Hammering an SSR page with requests', ['every request costs a database query', 'a cheap way to slow the whole site']],
      phong: ['🛡️', 'Static where possible + rate limits', ['serve the same-for-everyone page as a file', 'watch DB queries per minute, add a CDN']],
    }),
    en: 'Real life: on exam results day thousands refresh the same school portal page; with SSR each refresh is a database query. What if a price page uses ISR with a long window? One visitor per window sees the old price. An attacker can hammer an SSR page, because every request costs a query. Prevent it: serve same-for-everyone pages statically, rate-limit, watch queries per minute.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Rendering', 'components → HTML'), kw('CSR', 'the browser builds it'), kw('SSR', 'per request, on the server'), kw('SSG', 'once, at build'),
      kw('ISR', 'static + revalidate N s'), kw('Stale-while-revalidate', 'old page now, new one next'), kw('○ / ƒ', 'static / dynamic in the build'), kw('x-nextjs-cache', 'HIT · STALE'),
      kw('Time to first byte', 'how long until HTML starts'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: rendering; CSR, the browser builds it; SSR, per request; SSG, once at build; ISR, static plus revalidate; stale-while-revalidate; the static and dynamic symbols of the build; the x-nextjs-cache header; and time to first byte.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build one page four ways: plain, ${c('revalidate = 10')}, ${c('await connection()')}, ${c("'use client'")} + fetch`,
      `Run ${c('npm run build')}: find the database lines and the ○ / ƒ symbols`,
      `curl each twice: first byte, the stamp, ${c('x-nextjs-cache')}`,
      'Turn JavaScript off: which pages still show the data?',
    ]), box('Keep these', `<ul><li>Static = work done at build, served as a file</li><li>SSR = the work on every request</li><li>ISR = static, rebuilt by the first visitor after the window</li><li>CSR = an empty shell until JavaScript runs</li></ul>`, 'lam'), ''),
    en: 'Your turn: build one page four ways, run the build and find the database lines and the symbols, curl each page twice and read the stamp and the cache header, then turn JavaScript off and see which pages still show the data.' },
];
export const slides = lamDeck({ chuong: 'Chapter 17 — Rendering strategies and SEO', bai: '17.1' }, S);
