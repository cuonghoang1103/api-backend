/*DU_LIEU*/
const DU_LIEU = {
 "n9-1:file:src/data/khoa-hoc.json": "[\n  { \"id\": 1, \"ten\": \"React\", \"moTa\": \"component, *props*, state\" },\n  { \"id\": 2, \"ten\": \"Next.js\", \"moTa\": \"App Router, **Server Component**\" },\n  { \"id\": 3, \"ten\": \"Node.js\", \"moTa\": \"API, *Express*, Prisma\" }\n]\n",
 "n9-1:file:src/app/khoa-hoc/page.tsx": "import { readFile } from 'node:fs/promises';\nimport { marked } from 'marked';\n\nexport const dynamic = 'force-dynamic';   // render lại MỖI request (Chương 17) — để thấy log mỗi lần gọi\n\ntype KhoaHoc = { id: number; ten: string; moTa: string };\n\nexport default async function KhoaHocPage() {\n  const raw = await readFile(process.cwd() + '/src/data/khoa-hoc.json', 'utf8');   // đọc thẳng tệp trên máy chủ\n  const ds: KhoaHoc[] = JSON.parse(raw);\n  const khoa = process.env.KHOA_BI_MAT ?? '';                                        // biến bí mật: chỉ máy chủ thấy\n  console.log('[khoa-hoc] render trên máy chủ ·', ds.length, 'khoá · bí mật dài', khoa.length, '· dau-van-tay-ma-91');\n  return (\n    <ul id=\"ds\" className=\"list-disc p-4 pl-8 font-sans\">\n      {ds.map((k) => (\n        <li key={k.id} dangerouslySetInnerHTML={{ __html: marked.parseInline(`**${k.ten}** — ${k.moTa}`) as string }} />\n      ))}\n    </ul>\n  );\n}\n",
 "n9-1:file:src/app/trong/page.tsx": "export default function Trong() {\n  return <p className=\"p-4 font-sans\">Trang trống — không thư viện nào</p>;\n}\n",
 "n9-1:trang": "$ find src/app/khoa-hoc src/app/trong src/data -type f | sort\nsrc/app/khoa-hoc/page.tsx\nsrc/app/trong/page.tsx\nsrc/data/khoa-hoc.json\n$ npm run build\n✓ Compiled successfully in 2.3s\nRoute (app)\n├ ƒ /khoa-hoc\n└ ○ /trong\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n9-1:mo": "$ curl -s localhost:19379/khoa-hoc | grep -o '<ul id=\"ds\".*</ul>' | sed 's#<!-- -->##g'\n<ul id=\"ds\" class=\"list-disc p-4 pl-8 font-sans\"><li><strong>React</strong> — component, <em>props</em>, state</li><li><strong>Next.js</strong> — App Router, <strong>Server Component</strong></li><li><strong>Node.js</strong> — API, <em>Express</em>, Prisma</li></ul>\n$ for i in 1 2; do curl -s -o /dev/null localhost:19379/khoa-hoc; done; echo 'đã gọi thêm 2 lần'\nđã gọi thêm 2 lần",
 "n9-1:log": "$ npx next start   (log máy chủ: 3 lần curl + 2 lần Chromium mở /khoa-hoc)\n[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91\n[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91\n[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91\n[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91\n[khoa-hoc] render trên máy chủ · 3 khoá · bí mật dài 20 · dau-van-tay-ma-91",
 "n9-1:goi": "$ grep -rl 'dau-van-tay-ma-91' .next/static | wc -l | sed 's/^ */.next\\/static (gửi trình duyệt): /'\n.next/static (gửi trình duyệt): 0\n$ grep -rl 'dau-van-tay-ma-91' .next/server | wc -l | sed 's/^ */.next\\/server (chỉ máy chủ): /'\n.next/server (chỉ máy chủ): 2\n$ grep -rl 'markedjs' .next/static | wc -l | sed 's/^ */thư viện marked trong .next\\/static: /'\nthư viện marked trong .next/static: 0\n$ grep -rl 'bimat-chi-may-chu-91' .next | wc -l | sed 's/^ */giá trị KHOA_BI_MAT trong .next: /'\ngiá trị KHOA_BI_MAT trong .next: 0",
 "n9-1:rsc": "$ node rsc.mjs http://localhost:19379/khoa-hoc '\"ul\"'\nHTML 7282 byte · trong đó RSC payload 4642 byte\n8:[\"$\",\"ul\",null,{\"id\":\"ds\",\"className\":\"list-disc p-4 pl-8 font-sans\",\"children\":[[\"$\",\"li\",\"1\",{\"dangerouslySetInnerHTML\":{\"__html\":\"<strong>React</strong> — component, <em>props</em>, state\"}}],[\"$\",\"li\",\"2\",{\"dangerouslySetInnerHTML\":{\"__html\":\"<strong>Nex…\n$ curl -s localhost:19379/khoa-hoc | grep -c 'readFile\\|dau-van-tay-ma-91\\|bimat-chi'\n0",
 "n9-1:file:rsc.mjs": "// rsc.mjs <url> [regex] — tải HTML, tách RSC payload (các mẩu self.__next_f.push) và in số byte + những dòng payload khớp regex\nconst [url, re = '.'] = process.argv.slice(2);\nconst html = await (await fetch(url)).text();\nconst payload = [...html.matchAll(/self\\.__next_f\\.push\\((\\[.*?\\])\\)<\\/script>/g)].map((m) => JSON.parse(m[1])[1] ?? '').join('');\nconsole.log(`HTML ${html.length} byte · trong đó RSC payload ${payload.length} byte`);\nfor (const l of payload.split('\\n')) if (new RegExp(re).test(l)) console.log(l.length > 260 ? l.slice(0, 260) + '…' : l);\n",
 "n9-1:file:src/app/bay-bam/page.tsx": "export default function BayBam() {\n  return <button onClick={() => console.log('bấm')}>Bấm tôi</button>;\n}\n",
 "n9-1:file:src/app/bay-state/page.tsx": "import { useState } from 'react';\n\nexport default function BayState() {\n  const [n, setN] = useState(0);\n  return <p>{n}</p>;\n}\n",
 "n9-1:bay": "$ npm run build   (Server Component có onClick)\nError occurred prerendering page \"/bay-bam\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: Event handlers cannot be passed to Client Component props.\n  {onClick: function onClick, children: ...}\nIf you need interactivity, consider converting part of this to a Client Component.\nExport encountered an error on /bay-bam/page: /bay-bam, exiting the build.\n$ npm run build   (Server Component dùng useState)\n- Environments: .env.local\nError: Turbopack build failed with 1 error:\n./src/app/bay-state/page.tsx:1:10\nError: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `\"use client\"` directive.\n> 1 | import { useState } from 'react';\n    |          ^^^^^^^^\n  2 |\n  3 | export default function BayState() {\n  4 |   const [n, setN] = useState(0);\nEcmascript file had an error\n    at ignore-listed frames",
 "n9-1:dung": "",
 "anh-nxj-9-1:khoa-hoc": {
  "url": "http://127.0.0.1:19379/khoa-hoc",
  "vp": [
   640,
   150
  ],
  "rect": {
   "#ds": [
    0,
    0,
    640,
    104
   ],
   "#ds li:nth-child(2)": [
    32,
    40,
    592,
    24
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19379/khoa-hoc",
    "ma": 200,
    "loai": "document",
    "kt": 7294
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": []
 },
 "anh-nxj-9-1:tat-js": {
  "url": "http://127.0.0.1:19379/khoa-hoc",
  "vp": [
   640,
   150
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19379/khoa-hoc",
    "ma": 200,
    "loai": "document",
    "kt": 7294
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   }
  ],
  "console": []
 },
 "anh-nxj-9-1:trong": {
  "url": "http://127.0.0.1:19379/trong",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19379/trong",
    "ma": 200,
    "loai": "document",
    "kt": 6853
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   },
   {
    "url": "http://127.0.0.1:19379/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, icards, meter, seq, cay } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-09-1', code: 'NXJ 9.1', title: 'The default is a Server Component', sub: 'Chapter 9 · Lesson 9.1' };
const O = (k) => { const v = DU_LIEU[`n9-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-9-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-09-1', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const js = (k) => AN(k).mang.filter((m) => m.loai === 'script');
const JS_KH = js('khoa-hoc'), JS_TR = js('trong'), JS_OFF = js('tat-js');
const sum = (a) => a.reduce((s, m) => s + m.kt, 0);
const LOG = O('log').split('\n').filter((l) => l.startsWith('[khoa-hoc]'));
if (LOG.length !== 5 || AN('khoa-hoc').console.length !== 0) throw new Error('log 9.1 đổi');
if (sum(JS_KH) !== sum(JS_TR) || JS_OFF.length !== 0) throw new Error('số đo JS 9.1 đổi');
for (const [k, s] of [['goi', 'gửi trình duyệt): 0'], ['goi', 'chỉ máy chủ): 2'], ['goi', 'marked trong .next/static: 0'], ['goi', 'KHOA_BI_MAT trong .next: 0'], ['rsc', '8:["$","ul"'],
  ['bay', 'Event handlers cannot be passed to Client Component props'], ['bay', 'only available in Client Components'], ['trang', 'ƒ /khoa-hoc'], ['trang', 'tsc: 0 lỗi']])
  if (!O(k).includes(s)) throw new Error(`số đo 9.1 đổi: ${k} thiếu "${s}"`);
const RSC = O('rsc').split('\n');
const KB = (n) => n.toLocaleString('en-US');
const PAGE = O('file:src/app/khoa-hoc/page.tsx').trim();
// mã THẬT, chỉ bỏ chú thích cuối dòng + dòng type, ngắt dòng <li> dài cho vừa slide
const PAGE_GON = PAGE.split('\n').filter((l) => !/^type |^$/.test(l)).map((l) => l.replace(/\s+\/\/ .*$/, ''))
  .map((l) => l.replace('<li key={k.id} dangerouslySetInnerHTML={{ __html: marked.parseInline(`**${k.ten}** — ${k.moTa}`) as string }} />',
    '<li key={k.id} dangerouslySetInnerHTML={{\n          __html: marked.parseInline(`**${k.ten}** — ${k.moTa}`)\n            as string }} />')
    .replace("readFile(process.cwd() + ", "readFile(\n    process.cwd() + ").replace("console.log('[khoa-hoc] render trên máy chủ ·', ds.length, ", "console.log('[khoa-hoc] render trên máy chủ ·', ds.length,\n    ")).join('\n');
if (!PAGE_GON.includes('__html: marked.parseInline')) throw new Error('mã 9.1 đổi');

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.1', t: 'The default is a<br>Server Component', sub: 'Every page you wrote in Chapter 8 already ran on the server. Measured: where it runs, what reaches the browser — and what does not',
    en: 'Lesson nine point one: the default is a Server Component. Every page and layout you wrote in chapter eight already ran on the server. We measure where the code runs, what reaches the browser, and what never does.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>In <code>app/</code>, a component <b>without</b> a directive is a Server Component</li>
    <li>What "runs on the server" means, step by step — and an <code>async</code> component that reads a file and a secret</li>
    <li>Measured: where its <code>console.log</code> goes, which bytes reach the browser, and the <b>RSC payload</b></li>
    <li>The three wins: smaller bundle, data at the source, secrets stay secret</li>
    <li>The price: no state, no effects, no event handlers — and the exact errors you get</li></ul>`,
    en: 'Five takeaways: without a directive, a component in app is a Server Component; what running on the server means, with an async component that reads a file and a secret; measured — where its log goes, which bytes reach the browser, and the RSC payload; the three wins; and the price: no state, effects or event handlers, with the exact errors.' },
  { t: 'Classic React SPA vs the App Router default', body: cmp(['', 'Classic SPA (Vite, CRA)', 'App Router: Server Component (default)'], [
      ['Where the component code runs', 'in the <b>browser</b>, after the bundle downloads', 'on the <b>server</b>, before the response leaves'],
      ['Its JavaScript', 'shipped to every visitor', '<b>never</b> shipped — only its output'],
      ['Initial data', '<code>useEffect</code> + fetch + a loading spinner', '<code>await</code> right in the component body'],
      ['A secret key in the code', 'visible to anyone (it is in the bundle)', 'stays on the server'],
      ['State, effects, <code>onClick</code>', 'yes — that is all it does', '<b>no</b> — that needs a Client Component (9.2)'],
    ], { hl: [1] }) + box('The surprise', 'Nothing in the file says "server". There is no import, no flag: <b>no <code>\'use client\'</code> ⇒ Server Component</b>. Every <code>page.tsx</code> and <code>layout.tsx</code> of Chapter 8 was one.', 'lam'),
    en: 'Classic React SPA versus the App Router default. In a Vite app the component code runs in the browser after the bundle downloads; a Server Component runs on the server before the response leaves, and only its output travels. Initial data comes from await instead of an effect and a spinner. A secret stays on the server. The price: no state, effects or onClick. And nothing in the file says server — no directive means Server Component.' },
  { t: 'What "runs on the server" actually means', body: two(steps([
      'A request arrives for <code>/khoa-hoc</code>. Next.js runs the Server Component <b>on the server</b>',
      'It can <code>await</code> data right there — a file, a DB query, a fetch — before rendering',
      'It renders to HTML. The browser receives finished markup, not a bundle to run',
      'The component\'s code never leaves. Zero bytes of it in the browser',
    ]), seq(['Browser', 'Next.js server', 'file / DB'], [
      [0, 1, 'GET /khoa-hoc'], [1, 1, 'run KhoaHocPage()', '#0070f3'], [1, 2, 'await readFile(…)'], [2, 1, '3 courses', '#1f8a3b', true],
      [1, 1, 'render → HTML + RSC', '#0070f3'], [1, 0, 'HTML (list already inside)', '#1f8a3b'],
    ], { w: 540, rh: 58, fs: 16 }), ''),
    en: 'What runs on the server actually means. A request arrives; Next.js runs the Server Component on the server. It can await data right there — a file, a database query, a fetch — before rendering. It renders to HTML, so the browser receives finished markup. And the component code itself never leaves the server.' },
  { t: 'An async Server Component: file + secret + a library', body: two(tsx(PAGE_GON, { sm: true, hl: [5, 8, 9] }),
      D(box('async + await in the body', 'A Server Component can be an <code>async function</code>. It reads <code>src/data/khoa-hoc.json</code> with <code>fs</code>, reads <code>process.env.KHOA_BI_MAT</code>, and formats Markdown with the <code>marked</code> library.', 'lam'),
        tn(lay('trang', /^(Route|├|└|ƒ  |○  )/) + '\n' + lay('trang', /tsc: 0/), { fs: 15, title: 'npm run build (real)' }),
        box('ƒ = Dynamic', '<code>force-dynamic</code> renders it on <b>every</b> request (Chapter 17) — so each render shows up in the server log.', 'xanh')), 'r64'),
    en: 'Here is a real async Server Component. It awaits readFile on a JSON file, reads a secret environment variable, and formats Markdown with the marked library. We mark it force-dynamic so it renders on every request; the build lists it as an f — dynamic — route, and tsc reports no errors.' },
  { t: 'Measured: where does its console.log go?', body: tn(`$ npx next start   (3 × curl + 2 × Chromium)\n` + LOG.join('\n'), { fs: 17, title: 'server terminal — next start (real)' }) +
      two(D(box('Server terminal: one line per render', `${LOG.length} requests ⇒ <b>${LOG.length}</b> lines. The secret was read (length 20) — its value is printed nowhere.`, 'xanh'),
        box('Browser console: 0 lines', `Chromium opened the page twice: <b>${AN('khoa-hoc').console.length}</b> console messages. The component never ran there.`, 'lam')),
      B('khoa-hoc', { vp: 640, h: 120, w: 540, url: 'localhost:3000/khoa-hoc  ·  DevTools Console: empty' }), ''),
    en: 'Where does its console log go? We hit the page three times with curl and opened it twice in Chromium: the server terminal shows five lines, one per render. The browser console shows zero messages. The component never ran in the browser.' },
  { t: 'Measured: what reaches the browser', body: two(tn(O('goi').split('\n').filter((l) => !l.startsWith('$ ')).join('\n'), { fs: 17, title: 'grep the build output (real)' }) +
      box('Code stays on the server', 'A string that exists only in the component\'s code: in <code>.next/server</code>, never in <code>.next/static</code> (the folder the browser downloads from). The <code>marked</code> library and the secret value: nowhere in the browser files.', 'xanh'),
      D(meter([['/trong — empty page', sum(JS_TR), '#64748b'], ['/khoa-hoc — fs + marked + secret', sum(JS_KH), '#0070f3', 'identical']], { w: 540, nhan: 250, don: 'B', fs: 15 }),
        box(`JavaScript downloaded: ${KB(sum(JS_KH))} B, both`, `${JS_KH.length} script files for each page: that is React + the Next.js runtime. Using <code>marked</code> on the server added <b>0 bytes</b>.`, 'lam')), ''),
    en: 'What reaches the browser? We grep the build. A fingerprint string that lives only in the component code is in dot next slash server, never in dot next slash static. The marked library and the secret value are nowhere in the browser files. And the JavaScript downloaded by the page is identical to an empty page: four hundred fifty-seven thousand bytes, React plus the runtime. Using marked on the server added zero.' },
  { t: 'What does travel: HTML + the RSC payload', body: tn(RSC.filter((l) => !l.startsWith('$ ')).join('\n'), { fs: 15, title: 'node rsc.mjs /khoa-hoc · grep readFile|secret (real)' }) +
      two(D(box('RSC payload', 'Inside the HTML, Next.js also inlines the <b>rendered tree</b> as data — <code>["$","ul",…]</code>, the same list, already formatted. React in the browser uses it to stitch the page together and for later navigations.', 'lam'),
        box('Not code', '<code>readFile</code>, the fingerprint, the secret: <b>0</b> matches in the HTML. Only results cross the wire.', 'xanh')),
      B('tat-js', { vp: 640, h: 120, w: 520, url: 'JavaScript OFF — localhost:3000/khoa-hoc' }), ''),
    en: 'So what does travel? The HTML, and inside it the RSC payload — the rendered tree as data: a ul with the three items, already formatted. React in the browser uses it to stitch the page and for later navigations. Not code: readFile, the fingerprint and the secret have zero matches. With JavaScript turned off the list is still there — it is in the HTML.' },
  { t: 'Three things a Server Component gives you', body: icards([
      ['box', 'Smaller bundle', 'Component code (and libraries used only there) never downloads. Measured: <code>marked</code> on the server = +0 B in the browser.'],
      ['db', 'Data at the source', 'The <code>await</code> happens on the server, next to the data: no client round-trip, no loading spinner for the first data.'],
      ['key', 'Secrets stay secret', 'API keys and DB credentials live in code the browser never sees. Contrast the <code>NEXT_PUBLIC_</code> trap — lesson 20.2.'],
    ], 3) + box('One component, three wins — for free', 'You did nothing to get them: it is the default. The skill of this chapter is not to throw them away by accident.', 'lam'),
    en: 'Three things a Server Component gives you. A smaller bundle: its code and the libraries used only there never download. Data at the source: the await happens next to the data, with no spinner for the first data. And secrets stay secret — contrast the NEXT_PUBLIC trap in lesson twenty point two. You get all three for free, because it is the default.' },
  { t: 'The price, measured: no interactivity here', body: two(tsx(O('file:src/app/bay-bam/page.tsx').trim(), { sm: true, hl: [2] }),
      tsx(O('file:src/app/bay-state/page.tsx').trim().split('\n').slice(0, 4).join('\n'), { sm: true, hl: [1] }), 'r64') +
      tn(lay('bay', /Event handlers|onClick|If you need/), { fs: 15, title: 'npm run build — onClick in a Server Component (real)' }) +
      tn(lay('bay', /You're importing/), { fs: 15, title: 'npm run build — useState in a Server Component (real)' }) +
      box('Why', 'The component ran once on the server and is gone: nothing live in the browser to hold state or answer a click. Chapters 3–7 need a <b>Client Component</b> (next lesson).', 'do2'),
    en: 'The price, measured. A button with onClick inside a Server Component: the build fails while prerendering — event handlers cannot be passed to Client Component props; if you need interactivity, convert part of it to a Client Component. useState fails even earlier, at compile time: this API is only available in Client Components. The reason: the component ran once on the server and is gone.' },
  { t: 'Can and cannot — the cheat sheet', body: cmp(['', 'Server Component', 'Why'], [
      ['<code>async</code> / <code>await</code> in the body', '✓', 'it runs once, before the response'],
      ['<code>fs</code>, a DB client, <code>process.env</code> secrets', '✓', 'the code stays on the server'],
      ['a heavy library (markdown, dates)', '✓ — costs the user 0 B', 'only its output travels'],
      ['<code>useState</code>, <code>useEffect</code>, <code>useRef</code>', '✗ compile error', 'no second render, nothing to keep'],
      ['<code>onClick</code>, <code>onChange</code>', '✗ build/prerender error', 'a function cannot be sent as HTML'],
      ['<code>window</code>, <code>localStorage</code>', '✗', 'there is no browser on the server'],
    ], { hl: [3, 4] }),
    en: 'The cheat sheet. A Server Component can await in its body, use fs, a database client and secrets, and use heavy libraries at zero cost to the user. It cannot use useState, useEffect or useRef — a compile error; nor onClick or onChange — a build error; nor window or localStorage, because there is no browser on the server.' },
  { t: 'Pitfall: \'use client\' just to silence an error', body: two(D(tsx(`'use client';                 // added "to make the error go away"
import { marked } from 'marked';   // ← now in the browser bundle
import { db } from '@/lib/db';     // ← cannot compile for the browser
import { format } from 'date-fns'; // ← in the bundle too

export default function Page() { /* … */ }`, { sm: true, hl: [1] }), cay({ t: "page.tsx + 'use client'", s: 'the boundary', mau: '#c2410c' }, [
        { t: 'marked', s: '→ browser bundle', mau: '#c2410c' }, { t: 'date-fns', s: '→ browser bundle', mau: '#c2410c' }, { t: '@/lib/db', s: '✗ will not compile', mau: '#b91c1c' }], { w: 640, h: 230 }),
        '<div class="cap">illustration — measured for real in 9.3 (import rules) and 9.5 (bundle size)</div>'),
      D(box('It spreads downward', 'The directive marks a <b>boundary</b>: everything this file imports joins the client bundle. One button that needed <code>onClick</code> drags the markdown renderer, the date library, the chart… into the browser.', 'do2'),
        box('The fix (9.2 → 9.5)', 'Keep the page on the server. Pull the interactive bit out into its own small Client Component. We measure the bundle difference in 9.5.', 'xanh')), ''),
    en: 'The pitfall: adding use client to a whole page just to silence an error. The directive is a boundary that spreads downward — everything the file imports joins the client bundle: the markdown renderer, the date library, the chart — and a database import no longer compiles at all. Keep the page on the server and pull the interactive bit into its own small Client Component; we measure the difference in lesson nine point five.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Server Component', 'the default in app/; runs on the server, ships no JS of its own'), kw('No directive', 'no \'use client\' at the top ⇒ Server Component'),
      kw('async component', 'a Server Component may be an async function'), kw('Direct data access', 'await a file, a DB, a fetch; read server secrets'),
      kw('Zero client JS', 'its code never enters the browser bundle'), kw('RSC payload', 'the rendered tree, serialized, inlined in the HTML'),
      kw('No hooks / handlers', 'useState, useEffect, onClick need a Client Component'), kw('RSC', 'React Server Components — the model under the App Router'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Server Component; no directive; async component; direct data access; zero client JavaScript; RSC payload; no hooks or handlers; and RSC, React Server Components.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write an ${c('async')} page in ${c('app/')} that reads a JSON file with ${c('fs')} and renders it`,
      `Add a ${c('console.log')}: run ${c('next start')}, find it in the terminal — and not in DevTools`,
      `Grep ${c('.next/static')} for a string from your component: 0 files`,
      `Add ${c('useState')}, then an ${c('onClick')}: read both errors`,
    ]), box('Keep these', `<ul><li>No directive ⇒ Server Component</li><li>It may <code>await</code>; it reads files and secrets</li><li>Only its output travels (HTML + RSC payload)</li><li>No state, effects or handlers here</li></ul>`, 'lam'), ''),
    en: 'Your turn: write an async page that reads a JSON file and renders it; add a console log and find it in the server terminal, not in DevTools; grep dot next slash static for a string from your component; then add useState and an onClick and read both errors. Keep: no directive means Server Component; it may await, read files and secrets; only its output travels; no state, effects or handlers here.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Server Components vs Client Components', bai: '9.1' }, S);
