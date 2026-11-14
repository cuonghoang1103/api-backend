/*DU_LIEU*/
const DU_LIEU = {
 "n17-2:file:src/lib/slow-db.ts": "// lib/slow-db.ts — a \"database\" that takes 300 ms and counts every query\nconst g = globalThis as unknown as { __q?: number };\nexport async function slowDb(who: string) {\n  await new Promise((r) => setTimeout(r, 300));\n  g.__q = (g.__q ?? 0) + 1;\n  const at = new Date().toISOString().slice(11, 19);\n  console.log(`[db] query #${g.__q} for ${who} at ${at}`);\n  return { at, q: g.__q };\n}\n",
 "n17-2:file:src/app/s/plain/page.tsx": "// app/s/plain/page.tsx — nothing request-specific\nimport { slowDb } from '@/lib/slow-db';\nexport default async function P() { const d = await slowDb('plain'); return <p id=\"at\">plain · {d.at}</p>; }\n",
 "n17-2:file:src/app/s/cookie/page.tsx": "// app/s/cookie/page.tsx — reads a cookie\nimport { cookies } from 'next/headers';\nexport default async function P() { const theme = (await cookies()).get('theme')?.value ?? 'light'; return <p id=\"at\">cookie · theme={theme}</p>; }\n",
 "n17-2:file:src/app/s/header/page.tsx": "// app/s/header/page.tsx — reads a request header\nimport { headers } from 'next/headers';\nexport default async function P() { const ua = (await headers()).get('user-agent') ?? '?'; return <p id=\"at\">header · {ua.split('/')[0]}</p>; }\n",
 "n17-2:file:src/app/s/search/page.tsx": "// app/s/search/page.tsx — reads ?q=\nexport default async function P({ searchParams }: PageProps<'/s/search'>) { const { q } = await searchParams; return <p id=\"at\">search · q={String(q ?? '')}</p>; }\n",
 "n17-2:file:src/app/s/nostore/page.tsx": "// app/s/nostore/page.tsx — an uncached fetch\nexport default async function P() {\n  const d = await fetch('http://127.0.0.1:19323/', { cache: 'no-store' }).then((r) => r.json());\n  return <p id=\"at\">no-store · {d.at}</p>;\n}\n",
 "n17-2:file:src/app/s/fetch/page.tsx": "// app/s/fetch/page.tsx — a fetch with NO options (Next.js 15+: not cached by default)\nexport default async function P() {\n  const d = await fetch('http://127.0.0.1:19323/').then((r) => r.json());\n  return <p id=\"at\">fetch · {d.at}</p>;\n}\n",
 "n17-2:file:src/app/s/force/page.tsx": "// app/s/force/page.tsx — the explicit switch\nimport { slowDb } from '@/lib/slow-db';\nexport const dynamic = 'force-dynamic';\nexport default async function P() { const d = await slowDb('force'); return <p id=\"at\">force · {d.at}</p>; }\n",
 "n17-2:file:src/app/l/layout.tsx": "// app/l/layout.tsx — ONE shared layout reads a cookie (say, to show the user's name in a header)\nimport { cookies } from 'next/headers';\nexport default async function L({ children }: LayoutProps<'/l'>) {\n  const name = (await cookies()).get('name')?.value ?? 'guest';\n  return <div><header>hello, {name}</header>{children}</div>;\n}\n",
 "n17-2:file:src/app/l/about/page.tsx": "// app/l/about/page.tsx — a page that is the same for everyone\nexport default function About() { return <p id=\"at\">about us — the same text for every visitor</p>; }\n",
 "n17-2:file:src/app/l/terms/page.tsx": "// app/l/terms/page.tsx — another page that is the same for everyone\nexport default function Terms() { return <p id=\"at\">terms — the same text for every visitor</p>; }\n",
 "n17-2:file:src/app/sp/dong/page.tsx": "// app/sp/dong/page.tsx — product page, cart count read from a cookie on the SERVER\nimport { cookies } from 'next/headers';\nimport { slowDb } from '@/lib/slow-db';\nexport default async function SpDong() {\n  const cart = (await cookies()).get('cart')?.value ?? '0';\n  const p = await slowDb('product (dong)');\n  return <main className=\"p-4 text-lg\"><header id=\"cart\">🛒 {cart} in your cart</header><h1 className=\"font-bold\">Keyboard K2</h1><p id=\"at\">product loaded at {p.at}</p></main>;\n}\n",
 "n17-2:file:src/app/sp/CartCount.tsx": "'use client';\n// app/sp/CartCount.tsx — the ONLY personal piece, fetched by the browser\nimport { useEffect, useState } from 'react';\nexport function CartCount() {\n  const [n, setN] = useState<string | null>(null);\n  useEffect(() => { fetch('/api/cart').then((r) => r.json()).then((d) => setN(d.n)); }, []);\n  return <header id=\"cart\">🛒 {n ?? '…'} in your cart</header>;\n}\n",
 "n17-2:file:src/app/sp/tinh/page.tsx": "// app/sp/tinh/page.tsx — the same product page; static, with a client cart badge\nimport { slowDb } from '@/lib/slow-db';\nimport { CartCount } from '../CartCount';\nexport default async function SpTinh() {\n  const p = await slowDb('product (tinh)');\n  return <main className=\"p-4 text-lg\"><CartCount /><h1 className=\"font-bold\">Keyboard K2</h1><p id=\"at\">product loaded at {p.at}</p></main>;\n}\n",
 "n17-2:file:src/app/api/cart/route.ts": "// app/api/cart/route.ts — the personal number, per request\nimport { cookies } from 'next/headers';\nexport async function GET() { return Response.json({ n: (await cookies()).get('cart')?.value ?? '0' }); }\n",
 "n17-2:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|\\[db\\]|/s/|/l/|/sp/|/api/cart|rror|^○  \\(|^ƒ  \\(' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 3.9s\n[db] query #1 for plain at 08:07:20\n[db] query #2 for product (tinh) at 08:07:20\nƒ /api/cart\nƒ /l/about\nƒ /l/terms\nƒ /s/cookie\n○ /s/fetch\nƒ /s/force\nƒ /s/header\nƒ /s/nostore\n○ /s/plain\nƒ /s/search\nƒ /sp/dong\n○ /sp/tinh\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand",
 "n17-2:do": "# the default fetch: is the page fresh? (two requests, 2 s apart)\n$ for i in 1 2; do curl -s localhost:3000/s/fetch | grep -oE 'fetch · [0-9:]+'; sleep 2; done\nfetch · 08:07:20\nfetch · 08:07:20\n$ for i in 1 2; do curl -s localhost:3000/s/nostore | grep -oE 'no-store · [0-9:]+'; sleep 2; done\nno-store · 08:07:27\nno-store · 08:07:29\n# one cookie in a shared layout — the pages under it\n$ curl -s localhost:3000/l/about -H 'Cookie: name=An' | grep -oE 'hello, [A-Za-z]+'\nhello, An\n# the product page: cookie on the server vs a client badge (3 requests each)\n$ for p in dong tinh; do for i in 1 2 3; do curl -s localhost:3000/sp/$p -H 'Cookie: cart=3' -o p.html -w \"$p #$i %{time_starttransfer}s  \"; grep -oE '🛒 [0-9…]+' p.html; done; done\ndong #1 0.308752s  🛒 3\ndong #2 0.305528s  🛒 3\ndong #3 0.308709s  🛒 3\ntinh #1 0.009732s  🛒 …\ntinh #2 0.002277s  🛒 …\ntinh #3 0.001575s  🛒 …",
 "n17-2:nhatky": "▲ Next.js 16.4.6\n- Local:         http://127.0.0.1:19322\n- Network:       http://127.0.0.1:19322\n✓ Ready in 101ms\n\n✓ Running next.config.ts took 28ms\n[db] query #1 for product (dong) at 08:07:32\n[db] query #2 for product (dong) at 08:07:32\n[db] query #3 for product (dong) at 08:07:32",
 "n17-2:kho": "$ grep -nE \"cookies\\(\\)|headers\\(\\)\" src/app/layout.tsx | head -3; echo \"(root layout: $(grep -cE 'cookies\\(\\)|headers\\(\\)' src/app/layout.tsx) lần cookies()/headers())\"\n(root layout: 0 lần cookies()/headers())\n$ grep -rlE \"cookies\\(\\)|headers\\(\\)\" src/app --include=layout.tsx | sed 's/^/layout đọc request: /'\n$ grep -rlE \"^export const dynamic = 'force-dynamic'\" src/app | sed 's#src/app/##' | cut -d/ -f1 | sort | uniq -c | sort -rn | head -6\n   4 games\n   4 courses\n   4 api\n   3 tech-trends\n   3 repos\n   3 exam\n$ sed -n '30,36p' src/app/sitemap.ts\n// Render on-demand at RUNTIME (never build-time prerendered) so the dynamic\n// URLs are always fetched against the INTERNAL backend, which is reachable at\n// runtime but NOT during `npm run build`. This guarantees the sitemap always\n// carries the full URL set (never a static-only subset). The fetches below run\n// in parallel with a tight 3s timeout, so the live render stays fast (≤3s\n// worst-case) — which is what avoids Google Search Console's fetch timeout.\nexport const dynamic = 'force-dynamic'",
 "n17-2:dung": "",
 "n17-2:file:src/app/sp/CartServer.tsx": "// app/sp/CartServer.tsx — the personal piece as a SERVER component, reading the cookie itself\nimport { cookies } from 'next/headers';\nexport async function CartServer() {\n  const cart = (await cookies()).get('cart')?.value ?? '0';\n  return <header id=\"cart\">🛒 {cart} in your cart</header>;\n}\n",
 "n17-2:file:src/app/sp/sus/page.tsx": "// app/sp/sus/page.tsx — static product, the cookie read isolated in a child inside <Suspense>\nimport { Suspense } from 'react';\nimport { slowDb } from '@/lib/slow-db';\nimport { CartServer } from '../CartServer';\nexport default async function SpSus() {\n  const p = await slowDb('product (sus)');\n  return <main className=\"p-4 text-lg\"><Suspense fallback={<header>🛒 …</header>}><CartServer /></Suspense><h1 className=\"font-bold\">Keyboard K2</h1><p id=\"at\">product loaded at {p.at}</p></main>;\n}\n",
 "n17-2:sus": "# the web lesson's advice: isolate the cookie read in a child, inside Suspense — does the route stay static?\n$ npm run build 2>&1 | grep -E '\\[db\\]|/sp/|rror' | sed 's/^[┌├└] //'\n[db] query #1 for product (sus) at 08:18:38\n[db] query #2 for product (tinh) at 08:18:38\n[db] query #3 for plain at 08:18:38\nƒ /sp/dong\nƒ /sp/sus\n○ /sp/tinh\n$ for i in 1 2 3; do curl -s localhost:3000/sp/sus -H 'Cookie: cart=3' -o p.html -w \"sus #$i %{time_starttransfer}s  \"; grep -oE '🛒 [0-9…]+' p.html | head -1; done\nsus #1 0.334953s  🛒 …\nsus #2 0.308041s  🛒 …\nsus #3 0.308735s  🛒 …\n✓ Ready in 105ms\n\n✓ Running next.config.ts took 28ms\n[db] query #1 for product (sus) at 08:18:41\n[db] query #2 for product (sus) at 08:18:42\n[db] query #3 for product (sus) at 08:18:42"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n17-2 · lab c17 · Next.js 16.4.6 · next start 19322 + máy giờ 19323)
export const deck = { key: 'nxj-17-2', code: 'NXJ 17.2', title: 'Static vs dynamic in the App Router', sub: 'Chapter 17 · Lesson 17.2' };
const O = (k) => { const v = DU_LIEU[`n17-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };

const BUILD = doan('lab', 'npm run build');
const SYM = (r) => { const l = BUILD.find((x) => x.endsWith(' ' + r)); if (!l) throw new Error('không thấy route ' + r); return l[0]; };
const DB_BUILD = BUILD.filter((l) => l.startsWith('[db]'));
const FETCH = doan('do', '/s/fetch'), NOSTORE = doan('do', '/s/nostore'), LAYOUT = doan('do', '/l/about');
const SP = doan('do', 'for p in dong tinh').map((l) => l.match(/^(\w+) #(\d) ([\d.]+)s\s+(.*)$/)).filter(Boolean).map(([, p, i, s, kq]) => ({ p, i: +i, ms: Math.round(+s * 10000) / 10, kq }));
const MS = (p, i) => SP.find((b) => b.p === p && b.i === i).ms;
const LOG = O('nhatky').split('\n').filter((l) => l.startsWith('[db]'));
const KHO = O('kho').split('\n');
if (FETCH[0] !== FETCH[1] || NOSTORE[0] === NOSTORE[1]) throw new Error('đo fetch đổi');
const bo = (p) => F(p).split('\n').filter((l) => !l.startsWith('//')).join('\n');
const ROUTES = [
  ['/s/plain', 'nothing request-specific', 'plain'], ['/s/fetch', 'fetch() with no options', 'fetch'], ['/s/cookie', 'cookies()', 'cookie'], ['/s/header', 'headers()', 'header'],
  ['/s/search', 'searchParams', 'search'], ['/s/nostore', "fetch(…, { cache: 'no-store' })", 'nostore'], ['/s/force', "dynamic = 'force-dynamic'", 'force'],
];

const CHK = [['src/app/s/cookie/page.tsx', "get('theme')"], ['src/app/s/search/page.tsx', 'await searchParams'], ['src/app/s/nostore/page.tsx', "cache: 'no-store'"], ['src/app/s/fetch/page.tsx', "fetch('http://127.0.0.1:19323/').then"], ['src/app/l/layout.tsx', "get('name')"], ['src/app/sp/dong/page.tsx', "get('cart')"], ['src/app/sp/tinh/page.tsx', '<CartCount />'], ['src/app/sp/CartCount.tsx', "fetch('/api/cart')"]];
for (const [p, x] of CHK) if (!F(p).includes(x)) throw new Error('mã lab đổi: ' + p);
const H_COOKIE = "export default async function P() {\n  const c = await cookies();\n  const theme = c.get('theme')?.value;\n  return <p>cookie · theme={theme}</p>;\n}";
const H_SEARCH = "export default async function P(props) {\n  const { q } = await props.searchParams;\n  return <p>search · q={q}</p>;\n}";
const H_NOSTORE = "// app/s/nostore/page.tsx\nconst d = await fetch('http://127.0.0.1:19323/',\n  { cache: 'no-store' }).then((r) => r.json());";
const H_FETCH = "// app/s/fetch/page.tsx — no options\nconst d = await fetch('http://127.0.0.1:19323/')\n  .then((r) => r.json());";
const H_LAYOUT = "// app/l/layout.tsx\nexport default async function L({ children }) {\n  const c = await cookies();\n  const name = c.get('name')?.value ?? 'guest';\n  return <div><header>hello, {name}</header>\n    {children}</div>;\n}";
const H_ABOUT = "// app/l/about/page.tsx · app/l/terms/page.tsx\nexport default function About() {\n  return <p>about us — the same text …</p>;\n}";
const H_DONG = "// app/sp/dong/page.tsx\nexport default async function SpDong() {\n  const c = await cookies();\n  const cart = c.get('cart')?.value ?? '0';\n  const p = await slowDb('product (dong)');\n  return <main>\n    <header>🛒 {cart} in your cart</header>\n    <h1>Keyboard K2</h1> … {p.at}\n  </main>;\n}";
const H_TINH = "// app/sp/tinh/page.tsx\nexport default async function SpTinh() {\n  const p = await slowDb('product (tinh)');\n  return <main><CartCount /> … {p.at}</main>;\n}";
const H_CART = "'use client';   // app/sp/CartCount.tsx\nexport function CartCount() {\n  const [n, setN] = useState<string | null>(null);\n  useEffect(() => { fetch('/api/cart')\n    .then((r) => r.json()).then((d) => setN(d.n)); }, []);\n  return <header>🛒 {n ?? '…'} in your cart</header>;\n}";

const SUS_B = doan('sus', 'npm run build').filter((l) => /\/sp\//.test(l)).map((l) => l.replace(/^[┌├└] /, ''));
const SUS = doan('sus', 'for i in').map((l) => l.match(/^sus #(\d) ([\d.]+)s\s+(.*)$/)).filter(Boolean).map(([, i, x, kq]) => ({ i: +i, ms: Math.round(+x * 10000) / 10, kq }));
const SUS_LOG = O('sus').split('\n').filter((l) => /^\[db\] query #\d+ for product \(sus\) at/.test(l)).slice(-3);
if (!SUS_B.some((l) => l === 'ƒ /sp/sus')) throw new Error('sus đổi');
const H_SUS = "// app/sp/sus/page.tsx — the web lesson's advice\nconst p = await slowDb('product (sus)');\nreturn <main>\n  <Suspense fallback={<header>🛒 …</header>}>\n    <CartServer />   {/* reads cookies() */}\n  </Suspense>\n  <h1>Keyboard K2</h1> … {p.at}\n</main>;";

export const S = [
  { cover: true, nhan: 'Chapter 17 · Lesson 17.2', t: 'Static vs dynamic<br>in the App Router', sub: 'You never name the strategy — your code implies it. Seven switches measured in the build table, one layout that flips every page, and a product page 100× faster',
    en: 'Lesson seventeen point two: static versus dynamic in the App Router. You never name the strategy; your code implies it. We measure seven switches in the build table, one layout that flips every page, and a product page a hundred times faster.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Static by default; <b>one</b> request-specific call makes the route ƒ</li>
    <li>The switches: <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code>, <code>no-store</code>, <code>force-dynamic</code></li>
    <li>Trap: a fetch with <b>no options</b> stays ○ — its data is frozen at build</li>
    <li>Trap: one cookie in a shared <b>layout</b> flips every page under it</li>
    <li>Keep the page static, move the personal piece to the client: ${MS('dong', 2)} ms → ${MS('tinh', 2)} ms</li></ul>`,
    en: `Five takeaways. Static by default; one request-specific call makes the route dynamic. The switches: cookies, headers, searchParams, no-store and force-dynamic. A fetch with no options stays static, frozen at build. One cookie in a shared layout flips every page under it. And keeping the page static took a product page from ${MS('dong', 2)} to ${MS('tinh', 2)} milliseconds.` },
  { t: 'Seven routes, one build table', body: cmp(['route', 'what the page does', 'build (real)'], ROUTES.map(([r, w]) => [`<code>${r}</code>`, `<code>${w}</code>`, `<b style="color:${SYM(r) === '○' ? '#16a34a' : '#dc2626'}">${SYM(r)} ${SYM(r) === '○' ? 'static' : 'dynamic'}</b>`]), { hl: [1] })
    + box('Next.js reads what the route does', `Only <code>/s/plain</code> and <code>/s/fetch</code> stayed ○. Each other page touched something that only exists when a real visitor arrives — and became ƒ. Nobody wrote "SSR".`, 'lam'),
    en: 'Seven routes, one build table. Plain and the fetch with no options stayed static. Cookies, headers, searchParams, a no-store fetch and force-dynamic each made the route dynamic. Nobody wrote SSR anywhere: Next.js read what the route does.' },
  { t: 'The switches, in code', to: true, body: two(D(tsx(H_COOKIE, { hl: [2] }), tsx(H_SEARCH, { hl: [2] }), box('Also: headers()', '<code>(await headers()).get(\'user-agent\')</code> — the same effect: ƒ in the measured build.', 'lam')),
    D(tsx(H_NOSTORE, { hl: [3] }), tsx("export const dynamic = 'force-dynamic';   // /s/force", { hl: [1] }),
      box('Request-specific = unknown at build', 'A cookie, a header, the <code>?q=</code> of the URL, data that must be fresh every time — none of them exist while <code>npm run build</code> runs.', 'lam')), ''),
    en: 'The switches in code. Reading a cookie, reading searchParams, a fetch with cache no-store, and the explicit force-dynamic. What they share: none of them exist while npm run build runs. A cookie or a query string only exists when a visitor arrives.' },
  { t: 'Trap: a fetch with no options stays static', body: two(D(tsx(H_FETCH, { sm: true, hl: [2] }), tsx(H_NOSTORE, { sm: true, hl: [3] })),
    D(tn(['$ for i in 1 2; do curl -s …/s/fetch; sleep 2; done', ...FETCH, '$ for i in 1 2; do curl -s …/s/nostore; sleep 2; done', ...NOSTORE].join('\n'), { fs: 15, wrap: 52, title: 'curl (real) · a clock server on :19323' }),
      box('"Not cached" ≠ "fresh"', `Since Next.js 15 a plain <code>fetch</code> is not stored in the data cache — but the <b>route</b> is still prerendered. The time ${FETCH[0].split(' · ')[1]} was fetched <b>at build</b> and is served forever.`, 'do2')), ''),
    en: `Trap: a fetch with no options. Since Next.js fifteen it is not stored in the data cache, so many people expect fresh data. But the route is still prerendered: the time ${FETCH[0].split(' · ')[1]} was fetched at build and served on every request. With no-store, the time changes.` },
  { t: 'Trap: one cookie in a shared layout', body: two(D(tsx(H_LAYOUT, { sm: true, hl: [3, 4] }), tsx(H_ABOUT, { sm: true })),
    D(tn(['$ npm run build', ...BUILD.filter((l) => /\/l\//.test(l)), '$ curl -s localhost:3000/l/about -H "Cookie: name=An"', ...LAYOUT].join('\n'), { fs: 16, wrap: 52, title: 'build + curl (real)' }),
      box('A layout decides for everything beneath it', 'About and Terms are the same for every visitor — and both became ƒ. Nothing warns you; the pages still work, now rendered on every request.', 'do2')), ''),
    en: 'Trap: one cookie in a shared layout, to say hello with the user\'s name. About and Terms are the same for every visitor, yet both became dynamic. Nothing warns you. A layout\'s choice applies to every route beneath it, so read the build table after changing one.' },
  { t: 'Same product page, two shapes', body: two(D(tsx(H_DONG, { sm: true, hl: [3, 4] }), tn(BUILD.filter((l) => /\/sp\/|\/api\/cart/.test(l)).join('\n'), { fs: 15, title: 'next build (real)' })),
    D(tsx(H_TINH, { sm: true, hl: [4] }), tsx(H_CART, { sm: true, hl: [4] })), ''),
    en: 'The same product page in two shapes. Left: the cart count is read from a cookie on the server, so the whole page is dynamic. Right: the page stays static and only a small client badge fetches the count from an API route. The build: dong is dynamic, tinh is static.' },
  { t: `Measured: ${MS('dong', 2)} ms vs ${MS('tinh', 2)} ms`, body: two(D(meter([1, 2, 3].map((i) => [`dong #${i} (cookie on server)`, MS('dong', i), '#dc2626']).concat([1, 2, 3].map((i) => [`tinh #${i} (client badge)`, MS('tinh', i), '#16a34a'])), { don: 'ms to first byte', w: 560, nhan: 280, fs: 15 })),
    D(tn(['$ for p in dong tinh; do for i in 1 2 3; do curl … -H "Cookie: cart=3"; done; done', ...SP.map((b) => `${b.p} #${b.i}  ${b.ms} ms  ${b.kq}`), '# server log', ...LOG].join('\n'), { fs: 13, wrap: 60, title: 'curl + server log (real)' }),
      box('The price of one personal number', 'The dynamic page re-ran the 300 ms product query for every visitor just to print “3”. The static page sends a file; its HTML says <code>🛒 …</code> and the browser fills in the number.', 'xanh')), ''),
    en: `Measured: the dynamic page took about ${MS('dong', 2)} milliseconds every time and the server log shows the product query on every request. The static page: ${MS('tinh', 2)} milliseconds, no query. Its HTML shows three dots, and the browser fills in the number.` },
  { t: 'Trap: Suspense alone does not keep it static', body: two(D(tsx(H_SUS, { sm: true, hl: [4, 5] }), tn(['$ npm run build', ...SUS_B].join('\n'), { fs: 15, title: 'next build (real)' })),
    D(tn(['$ for i in 1 2 3; do curl …/sp/sus -H "Cookie: cart=3"; done', ...SUS.map((b) => `sus #${b.i}  ${b.ms} ms  ${b.kq}`), '# server log', ...SUS_LOG].join('\n'), { fs: 14, wrap: 56, title: 'curl + server log (real)' }),
      box('Without Cache Components, the route is still ƒ', `The cookie read sits in a child inside <code>&lt;Suspense&gt;</code> — the whole route still renders per request: ~${SUS[1].ms} ms, the product query every time. Suspense <b>streams</b>; it does not make the rest static. A static shell with dynamic holes needs <code>cacheComponents</code> (Partial Prerendering) — or a client badge.`, 'do2')), ''),
    en: `Trap: the common advice is to isolate the cookie read in a child inside Suspense. Measured on Next.js sixteen with default settings: the route is still dynamic, about ${SUS[1].ms} milliseconds, and the product query runs every time. Suspense streams; it does not make the rest static. That needs Cache Components, or a client badge.` },
  { t: 'Deciding per route — and verifying', body: two(steps([
      '<b>Who is the page for?</b> The same for everyone → static. Different per user → dynamic.',
      '<b>How fresh?</b> Minutes are fine → <code>revalidate</code> (ISR, 17.1). Right after a write → revalidate on demand (10.3).',
      '<b>Mixed?</b> Static page + a client badge (Suspense alone keeps it ƒ unless Cache Components is on).',
      '<b>Verify</b> in the build table — ○ or ƒ — after every change to a layout.',
    ]), box('Chapter 10, seen from here', 'Caching decisions <i>are</i> rendering decisions: <code>revalidate</code> keeps a route static (ISR); <code>no-store</code> or a cookie makes it dynamic (SSR). You chose strategies in Chapter 10 without the labels.', 'lam'), ''),
    en: 'Deciding per route. Who is the page for? The same for everyone, static; per user, dynamic. How fresh? Minutes are fine, revalidate; right after a write, revalidate on demand. Mixed pages: a client badge. And verify in the build table after every layout change.' },
  { t: 'cuongthai.com: where the switches are', body: two(D(tn(KHO.join('\n'), { fs: 12, wrap: 76, title: 'frontend/ (real)' })),
    D(box('The root layout reads nothing per request', 'No <code>cookies()</code> or <code>headers()</code> in any <code>layout.tsx</code> — so one layout cannot flip the whole site.', 'xanh'),
      box('force-dynamic, with a reason written down', '<code>sitemap.ts</code> forces dynamic because the backend is not reachable during <code>npm run build</code> — a build-time sitemap would carry only the static subset.', 'lam')), ''),
    en: 'cuongthai.com: no layout reads cookies or headers, so one layout cannot flip the whole site. Force-dynamic appears in about forty files; the sitemap explains why in a comment: the backend is not reachable during the build, so a static sitemap would miss most URLs.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🛍️', 'A shop page that says “Hi, An”', ['one cookie read ⇒ the whole page per request', 'every visitor waits for the product query']],
      neu: ['🧩', 'A teammate adds cookies() to the root layout?', ['every route turns ƒ — no warning, no error', 'measured: /l/about and /l/terms ⇒ ƒ']],
      xau: ['🎲', 'Random <code>?q=</code> on a searchParams page', ['each unique URL is a fresh render', 'a cheap way to skip caches and load the server']],
      phong: ['🛡️', 'Read the build table · keep personal bits small', ['a client badge for the personal part', 'CI: fail when a route you expect ○ turns ƒ']],
    }),
    en: 'Real life: a shop page that greets you by name reads a cookie, and the whole page renders per request. What if a teammate adds cookies to the root layout? Every route turns dynamic with no warning. An attacker can add random query strings to a searchParams page to skip caches. Prevent it: read the build table, keep personal parts small, and fail CI when a static route turns dynamic.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Static route ○', 'rendered at build'), kw('Dynamic route ƒ', 'rendered per request'), kw('Request-specific API', 'cookies · headers · searchParams'), kw("cache: 'no-store'", 'fresh every time ⇒ ƒ'),
      kw("dynamic = 'force-dynamic'", 'the explicit switch'), kw('Default fetch', 'not cached, but the route is prerendered'), kw('Layout scope', 'its choice covers every child'), kw('Personal fragment', 'a client badge'), kw('Suspense', 'streams — not static by itself'),
      kw('Build table', 'the only authoritative answer'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: a static route, rendered at build; a dynamic route, per request; the request-specific APIs; cache no-store; force-dynamic; the default fetch; layout scope; the personal fragment, a client badge; Suspense, which streams but is not static by itself; and the build table, the only authoritative answer.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Make seven pages like ${c('/s/*')}; predict ○ or ƒ, then run ${c('npm run build')}`,
      `Fetch a clock with no options and with ${c("cache: 'no-store'")}; curl twice`,
      `Read a cookie in a shared ${c('layout.tsx')}; watch its pages flip`,
      'Move a personal number into a client badge; compare time to first byte',
    ]), box('Keep these', `<ul><li>Static by default; one request API ⇒ ƒ</li><li>“Not cached” fetch ≠ fresh page</li><li>A layout decides for every child</li><li>The build table is the answer</li></ul>`, 'lam'), ''),
    en: 'Your turn: make seven pages and predict static or dynamic before building; fetch a clock with and without no-store; read a cookie in a shared layout and watch its pages flip; then move a personal number into a client badge and compare the first byte.' },
];
export const slides = lamDeck({ chuong: 'Chapter 17 — Rendering strategies and SEO', bai: '17.2' }, S);
