/*DU_LIEU*/
const DU_LIEU = {
 "n9-5:file:src/data/bai-viet.json": "[\n  { \"id\": 1, \"tieuDe\": \"Server Component là gì\", \"ngay\": \"2026-11-10\", \"thich\": 12, \"noiDung\": \"Mặc định **chạy ở máy chủ**.\\n\\n```ts\\nconst ds = await db.post.findMany();\\n```\" },\n  { \"id\": 2, \"tieuDe\": \"use client đặt ở đâu\", \"ngay\": \"2026-11-11\", \"thich\": 7, \"noiDung\": \"Đẩy xuống **lá** nhỏ nhất.\\n\\n```tsx\\n'use client';\\nexport default function Nut() {}\\n```\" },\n  { \"id\": 3, \"tieuDe\": \"Props qua ranh giới\", \"ngay\": \"2026-11-12\", \"thich\": 3, \"noiDung\": \"Chỉ truyền *dữ liệu thuần*.\\n\\n```ts\\n<LikeButton postId={p.id} />\\n```\" }\n]\n",
 "n9-5:file:src/components/LikeButton.tsx": "'use client';\nimport { useState } from 'react';\n\n// LÁ client nhỏ: chỉ phần cần tương tác\nexport default function LikeButton({ postId, count }: { postId: number; count: number }) {\n  const [n, setN] = useState(count);\n  return <button id={'like-' + postId} className=\"rounded border px-2\" onClick={() => setN(n + 1)}>♥ {n}</button>;\n}\n",
 "n9-5:file:src/app/feed-a/page.tsx": "'use client';   // ✗ cả trang thành client \"cho hook chạy\"\nimport { useState } from 'react';\nimport { marked } from 'marked';\nimport hljs from 'highlight.js';\nimport { format } from 'date-fns';\nimport baiViet from '@/data/bai-viet.json';\n\nmarked.use({ renderer: { code: ({ text, lang }) => `<pre><code>${hljs.highlight(text, { language: lang || 'plaintext' }).value}</code></pre>` } });\n\nfunction Thich({ id, so }: { id: number; so: number }) {\n  const [n, setN] = useState(so);\n  return <button id={'like-' + id} className=\"rounded border px-2\" onClick={() => setN(n + 1)}>♥ {n}</button>;\n}\n\nexport default function FeedA() {\n  return (\n    <section className=\"space-y-3 p-4 font-sans\">\n      {baiViet.map((p) => (\n        <article key={p.id} className=\"rounded border p-2\">\n          <h2 className=\"font-bold\">{p.tieuDe} · {format(new Date(p.ngay), 'dd/MM/yyyy')}</h2>\n          <div dangerouslySetInnerHTML={{ __html: marked.parse(p.noiDung) as string }} />\n          <Thich id={p.id} so={p.thich} />\n        </article>\n      ))}\n    </section>\n  );\n}\n",
 "n9-5:file:src/app/feed-b/page.tsx": "// ✓ trang ở MÁY CHỦ — chỉ LikeButton là client\nimport { marked } from 'marked';\nimport hljs from 'highlight.js';\nimport { format } from 'date-fns';\nimport baiViet from '@/data/bai-viet.json';\nimport LikeButton from '@/components/LikeButton';\n\nmarked.use({ renderer: { code: ({ text, lang }) => `<pre><code>${hljs.highlight(text, { language: lang || 'plaintext' }).value}</code></pre>` } });\n\nexport default function FeedB() {\n  return (\n    <section className=\"space-y-3 p-4 font-sans\">\n      {baiViet.map((p) => (\n        <article key={p.id} className=\"rounded border p-2\">\n          <h2 className=\"font-bold\">{p.tieuDe} · {format(new Date(p.ngay), 'dd/MM/yyyy')}</h2>\n          <div dangerouslySetInnerHTML={{ __html: marked.parse(p.noiDung) as string }} />\n          <LikeButton postId={p.id} count={p.thich} />\n        </article>\n      ))}\n    </section>\n  );\n}\n",
 "n9-5:trang": "$ diff <(sed 1d src/app/feed-a/page.tsx) <(sed 1d src/app/feed-b/page.tsx) | grep -c '^[<>]' | sed 's/^/số dòng khác nhau giữa hai trang (bỏ dòng 1): /'\nsố dòng khác nhau giữa hai trang (bỏ dòng 1): 11\n$ npm run build\n✓ Compiled successfully in 2.7s\nRoute (app)\n├ ○ /feed-a\n├ ○ /feed-b\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ ls .next/diagnostics\nbuild-diagnostics.json\nframework.json\nroute-bundle-stats.json\n$ node -e \"for (const r of require('./.next/diagnostics/route-bundle-stats.json')) if (/feed/.test(r.route)) console.log(r.route.padEnd(8), r.firstLoadUncompressedJsBytes.toLocaleString('en-US'), 'B JS lần tải đầu (chưa nén)')\"\n/feed-a  1,493,185 B JS lần tải đầu (chưa nén)\n/feed-b  457,427 B JS lần tải đầu (chưa nén)",
 "n9-5:mo": "$ for r in feed-a feed-b; do printf \"/%s HTML: \" $r; curl -s localhost:19384/$r | wc -c | tr -d ' '; done\n/feed-a HTML: 8683\n/feed-b HTML: 10833\n$ f=$(grep -l highlightAuto .next/static/chunks/*.js)   # chunk nào chứa highlight.js?\nsố chunk chứa highlight.js: 1\nchunk đó — chưa nén: 1036115 B · gzip qua mạng: 329096 B",
 "n9-5:dung": "",
 "n9-5:file:src/app/chep95/page.tsx": "import LikeButton from '@/components/LikeButton';\n\n// chép đúng hình dạng đoạn mã FeedPage của bài web (getPosts thay bằng dữ liệu tại chỗ)\nasync function getPosts() {\n  return [{ id: 1, title: 'Bài một', body: 'Nội dung một', likes: 3 }];\n}\n\nexport default async function FeedPage() {\n  const posts = await getPosts();\n  return (\n    <section>\n      {posts.map(p => (\n        <article key={p.id}>\n          <h2>{p.title}</h2>\n          <p>{p.body}</p>\n          <LikeButton postId={p.id} count={p.likes} />   // lá CLIENT nhỏ xíu\n        </article>\n      ))}\n    </section>\n  );\n}\n",
 "n9-5:chep": "$ npm run build\n✓ Compiled successfully in 782ms\n├ ○ /chep95",
 "n9-5:chepmo": "$ curl -s localhost:19384/chep95 | grep -o '♥ <!-- -->3</button>[^<]*</article>' | sed 's#<!-- -->##g'\n♥ 3</button>   // lá CLIENT nhỏ xíu</article>\n$ npx eslint src/app/chep95/page.tsx 2>&1 | grep -E 'error|problem' | sed 's#.*/c9/##'\n  16:55  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes\n✖ 1 problem (1 error, 0 warnings)",
 "n9-5:chepdung": "",
 "n9-5:thuc": "$ find frontend/src/app -name page.tsx | wc -l   ·   …có 'use client' ở dòng đầu\npage.tsx: 347 · có use client ở đầu: 262\n$ sed -n '38,40p;56,60p' frontend/src/hooks/useDaDangNhap.ts\nexport function useDaDangNhap(): TrangThaiDangNhap {\n  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);\n  const user = useAuthStore((s) => s.user);\n\n  return {\n    daDangNhap: (isAuthenticated && user != null) || luuTru,\n    sanSang: mounted,\n  };",
 "anh-nxj-9-5:feed-a": {
  "url": "http://127.0.0.1:19384/feed-a",
  "vp": [
   640,
   460
  ],
  "rect": {
   "#like-1": [
    25,
    97,
    48,
    26
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19384/feed-a",
    "ma": 200,
    "loai": "document",
    "kt": 8683
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/2u219_dq1-vtc.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15915
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/429r25bd6q5v2.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/2vtmgecm2zhog.js",
    "ma": 200,
    "loai": "script",
    "kt": 1036115
   }
  ],
  "console": [],
  "ketQua": {
   "sauBam": "♥ 13"
  }
 },
 "anh-nxj-9-5:feed-b": {
  "url": "http://127.0.0.1:19384/feed-b",
  "vp": [
   640,
   460
  ],
  "rect": {
   "#like-1": [
    25,
    97,
    48,
    26
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19384/feed-b",
    "ma": 200,
    "loai": "document",
    "kt": 10833
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/2u219_dq1-vtc.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15915
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/2fferul52_-t6.js",
    "ma": 200,
    "loai": "script",
    "kt": 357
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/429r25bd6q5v2.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19384/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "sauBam": "♥ 13"
  }
 },
 "anh-nxj-9-5:chep": {
  "url": "http://127.0.0.1:19384/chep95",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, br, meter, cay, flow, cmp } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-09-5', code: 'NXJ 9.5', title: 'Where to put the boundary in practice', sub: 'Chapter 9 · Lesson 9.5' };
const O = (k) => { const v = DU_LIEU[`n9-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-9-5:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-09-5', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const goc = (src) => src.trim().split('\n').filter((l) => !/^\s*\/\//.test(l)).map((l) => l.replace(/\s+\/\/ .*$/, '')).join('\n');
const js = (k) => AN(k).mang.filter((m) => m.loai === 'script');
const sum = (a) => a.reduce((s, m) => s + m.kt, 0);
const JA = js('feed-a'), JB = js('feed-b');
const KB = (n) => n.toLocaleString('en-US');
const CHUNK = O('mo').match(/chưa nén: (\d+) B · gzip qua mạng: (\d+) B/);
if (sum(JA) !== 1493185 || sum(JB) !== 457427 || AN('feed-a').ketQua.sauBam !== '♥ 13' || AN('feed-b').ketQua.sauBam !== '♥ 13' || !CHUNK) throw new Error('số đo feed 9.5 đổi');
for (const [k, s] of [['trang', '/feed-a  1,493,185 B'], ['trang', '/feed-b  457,427 B'], ['trang', 'route-bundle-stats.json'], ['chepmo', '// lá CLIENT nhỏ xíu</article>'], ['chepmo', 'react/jsx-no-comment-textnodes'],
  ['thuc', 'page.tsx: 347 · có use client ở đầu: 262'], ['thuc', '|| luuTru']])
  if (!O(k).includes(s)) throw new Error(`số đo 9.5 đổi: ${k} thiếu "${s}"`);
if (/First Load|kB/.test(O('trang'))) throw new Error('build in First Load JS? kiểm lại');
const LEAF = JB.find((m) => !JA.some((a) => a.url.split('/').pop() === m.url.split('/').pop()));
const FEEDB = goc(O('file:src/app/feed-b/page.tsx')).split('\n').filter((l) => !/^marked\.use/.test(l)).join('\n').replace(/\n\n\n/g, '\n\n')
  .replace('<div dangerouslySetInnerHTML={{ __html: marked.parse(p.noiDung) as string }} />', '<div dangerouslySetInnerHTML={{\n            __html: marked.parse(p.noiDung) as string }} />')
  .replace('<h2 className="font-bold">{p.tieuDe} · ', '<h2 className="font-bold">\n            {p.tieuDe} ·\n            ');
const LIKE = goc(O('file:src/components/LikeButton.tsx')).replace("({ postId, count }: { postId: number; count: number })", "({ postId, count }: {\n  postId: number; count: number;\n})").replace(' className="rounded border px-2" onClick=', '\n    onClick=');

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.5', t: 'Where to put the boundary<br>in practice', sub: 'A server trunk with small client leaves. Measured: one directive, +1 MB of JavaScript — and the hydration seam that once froze two pages of cuongthai.com',
    en: 'Lesson nine point five: where to put the boundary in practice. A server trunk with small client leaves. We measure one directive adding a megabyte of JavaScript, and look at the hydration seam that once froze two pages of cuongthai dot com.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The shape to memorise: a Server Component page, tiny Client Component leaves</li>
    <li>Measured: the <b>same</b> feed with the boundary at the top vs at the leaf — the JavaScript difference</li>
    <li>Where Next.js 16 keeps the per-route size now that <code>next build</code> no longer prints it</li>
    <li>Hydration, the seam — and a real cuongthai.com bug where a page waited forever on a flag</li>
    <li>A four-step way to decide, and the "boundary by file" trap</li></ul>`,
    en: 'Five takeaways: the shape to memorise — a server page with tiny client leaves; measured, the same feed with the boundary at the top versus at the leaf; where Next.js sixteen keeps the per-route size; hydration as the seam, with a real cuongthai bug; and a four-step way to decide, plus the boundary-by-file trap.' },
  { t: 'Push the client boundary down to the leaves', body: two(tsx(FEEDB, { sm: true, hl: [5] }),
      D(tsx(LIKE, { sm: true, hl: [1] }),
        box('The ideal shape', 'A <b>server trunk</b> — the big, data-heavy page — with <b>client leaves</b>: only <code>LikeButton</code>, a few lines, is a Client Component. Not a client trunk with everything inside.', 'xanh')), 'r64'),
    en: 'Push the client boundary down to the leaves. The feed page is a Server Component: it reads the posts, renders Markdown with marked, highlights code with highlight dot js and formats dates with date-fns. Only LikeButton, a few lines, is a Client Component. A server trunk with client leaves — not a client trunk with everything inside.' },
  { t: 'Measured: the same feed, two boundaries', body: two(D(B('feed-a', { vp: 640, h: 300, w: 400, url: "/feed-a — 'use client' on the page" })), D(B('feed-b', { vp: 640, h: 300, w: 400, url: '/feed-b — client only at LikeButton' })), '') +
      meter([['/feed-a — page is client', sum(JA), '#c2410c', `${JA.length} scripts`], ['/feed-b — leaf is client', sum(JB), '#1f8a3b', `${JB.length} scripts`]], { w: 1110, nhan: 300, don: 'B', fs: 17 }) +
      box(`One directive: +${KB(sum(JA) - sum(JB))} B`, `Both pages look the same and both like buttons work (${AN('feed-a').ketQua.sauBam} after a click). The difference is one chunk: marked + highlight.js + date-fns + the posts — <b>${KB(+CHUNK[1])} B</b>, still <b>${KB(+CHUNK[2])} B</b> gzipped over the wire. The leaf chunk of /feed-b: <b>${KB(LEAF.kt)} B</b>.`, 'do2'),
    en: 'Measured: the same feed, two boundaries. Both pages look identical and both like buttons work. Feed A, with use client on the page, downloads one point four nine million bytes of JavaScript; feed B, with the boundary at the leaf, four hundred fifty-seven thousand. One directive added just over a million bytes — about three hundred twenty-nine kilobytes gzipped. Feed B\'s leaf chunk: three hundred fifty-seven bytes.' },
  { t: 'Where to read the number in Next.js 16', body: two(D(tn(lay('trang', /^(Route|├|└|○  |ƒ  )/), { fs: 16, title: 'npm run build — Next.js 16.4.6 (real)' }),
      box('No "First Load JS" column', 'Older guides (and this lesson\'s text, before) say <code>next build</code> prints First Load JS per route. 16.4.6 prints only ○ / ƒ.', 'do2')),
      D(tn(lay('trang', /diagnostics|json|feed/), { fs: 15, wrap: 56, title: '.next/diagnostics/route-bundle-stats.json (real)' }),
        box('Where it went', '<code>next build</code> writes <code>.next/diagnostics/route-bundle-stats.json</code>: <code>firstLoadUncompressedJsBytes</code> per route — the same numbers Chromium downloaded. <code>next analyze</code> opens a visual explorer.', 'xanh')), ''),
    en: 'Where do you read that number in Next.js sixteen? The build output no longer has a First Load JS column — only the route table. The numbers moved to a file: dot next slash diagnostics slash route-bundle-stats dot json, with the first-load JavaScript bytes per route — exactly what Chromium downloaded. And next analyze opens a visual explorer.' },
  { t: 'Do and avoid', body: two(D(cay({ t: 'FeedB page.tsx', s: 'Server — fetch, marked, hljs, date-fns', mau: '#1f8a3b' }, [
      { t: 'article ×3', s: 'Server', mau: '#1f8a3b' }, { t: 'h2 + body', s: 'Server', mau: '#1f8a3b' }, { t: 'LikeButton', s: "'use client' — 357 B", mau: '#0070f3' }], { w: 540, h: 250 }),
      '<div class="cap">the tree of /feed-b — only one leaf crosses into the browser</div>'),
      D(box('Do', 'Fetch in Server Components. Make each interactive widget its own client leaf. Pass plain data down as props (9.4).', 'xanh'),
        box('Avoid', 'A <code>\'use client\'</code> at the top of a page "so hooks work" — it turns the page <b>and everything it imports</b> into client code (feed-a: +1 MB).', 'do2')), ''),
    en: 'Do and avoid. Do: fetch in Server Components, make each interactive widget its own client leaf, pass plain data down. Avoid: use client at the top of a page so hooks work — it turns the page and everything it imports into client code. In feed B only one leaf, the like button, crosses into the browser.' },
  { t: "Pitfall measured in the lesson's snippet", body: two(tsx(goc(O('file:src/app/chep95/page.tsx')).split('\n').slice(6).join('\n').replace('<LikeButton postId={p.id} count={p.likes} />', '<LikeButton postId={p.id} count={p.likes} />   // lá CLIENT nhỏ xíu'), { sm: true, hl: [8] }),
      D(B('chep', { vp: 640, h: 110, w: 320, url: '/chep95' }),
        tn(lay('chepmo', /lá CLIENT/) + '\n' + lay('chepmo', /jsx-no-comment/), { fs: 13, wrap: 38, title: 'curl · eslint (real)' })), 'r73') +
      box('Text, not a comment', 'Between JSX tags, <code>// …</code> is rendered — next to every like button. TypeScript and the build are happy; only ESLint complains. Write <code>{/* … */}</code>.', 'do2'),
    en: 'A pitfall measured in this lesson\'s own snippet: the comment after LikeButton, inside the article. Between JSX tags, double-slash is text: it shows up next to the like button in every post. Build and TypeScript are happy; only ESLint complains. Write curly braces with slash-star.' },
  { t: 'Hydration: the seam where server and client meet', body: flow([
      { t: 'server renders', s: 'HTML of the client leaf', mau: '#1f8a3b' }, { t: 'browser shows it', s: 'not interactive yet', mau: '#475569' },
      { t: 'JS chunk arrives', s: 'the leaf code', mau: '#b85a2b' }, { t: 'hydrate', s: 'first client render must MATCH', mau: '#7c3aed' },
    ], { h: 116, fs: 18 }) + two(box('Mismatch', 'If the first client render differs from the server HTML (time, random, <code>localStorage</code>…), React reports a hydration mismatch (lesson 2.4 measured one).', 'do2'),
      box('The quieter failure', 'A component that hides <b>everything</b> behind a "am I ready?" flag can show nothing at all — forever — on the day that flag never flips. No error in the console.', 'lam'), '') +
      cmp(['At the seam', 'Typical cause', 'What you see'], [
        ['Mismatch', '<code>Math.random()</code>, <code>Date.now()</code>, <code>localStorage</code> read during render', 'dev: "Hydration failed…" · prod: React #418 (measured in 2.4)'],
        ['Stuck flag', 'the whole page gated on a store\'s <code>isHydrated</code>', 'a login prompt or spinner forever, 0 console errors (next slide)'],
        ['The fix', 'first render = what the server rendered; read browser state in an effect', 'the two-pass render of 9.2 — a <code>mounted</code> flag'],
      ], { hl: [1] }),
    en: 'Hydration is the seam where server and client meet. The server renders the client leaf\'s HTML, the browser shows it, the leaf\'s code arrives, and React hydrates — its first render must match the server HTML. If it differs, you get a mismatch. The quieter failure: a component that hides everything behind a ready flag can show nothing, forever, the day the flag never flips.' },
  { t: 'A real cuongthai.com incident (13/09/2026)', body: two(D(box('Symptom', '<code>/wallet</code> and <code>/llm-key</code> showed "Đăng nhập để…" to a user who <b>was</b> logged in — the navbar above showed their avatar. No error, no warning; waiting did not help.', 'do2'),
      box('Cause', 'Both pages were gated on <code>useAuthStore().isAuthenticated</code>. <code>zustand/persist</code> restores <code>localStorage</code> asynchronously, and <code>onRehydrateStorage</code> may <b>never</b> flip <code>isHydrated</code>.', 'lam')),
      D(tn(O('thuc').split('\n').filter((l) => !l.startsWith('$ ') && !/page\.tsx:/.test(l)).join('\n'), { fs: 15, title: 'frontend/src/hooks/useDaDangNhap.ts — the fix (real excerpt)' }),
        box('The fix', 'Do not trust one flag: track a local <code>mounted</code> state (first render matches the server) and also read the stored auth directly. Give the UI an escape hatch.', 'xanh')), ''),
    en: 'A real incident on cuongthai dot com, thirteenth of September twenty twenty-six. The wallet and LLM-key pages told a logged-in user to log in, while the navbar above showed their avatar — no error at all. Both pages were gated on one store flag that zustand persist restores asynchronously, and sometimes never flips. The fix: a local mounted state so the first render matches the server, plus reading the stored auth directly.' },
  { t: 'Deciding where the boundary goes', body: steps([
      '<b>Start with everything on the server.</b> It is the default and the cheapest choice for users; move something only when forced to',
      '<b>Find what truly needs the browser:</b> state that changes on interaction, an event handler, a browser API, a DOM-touching library — nothing else qualifies',
      '<b>Mark the SMALLEST component that needs it:</b> a like button, a search box, a tab bar — not the page, not its layout',
      `<b>Then check the bundle:</b> ${c('.next/diagnostics/route-bundle-stats.json')} after ${c('next build')}, or DevTools Network. A route that jumped means something crossed`,
    ]) + box('Rule of thumb', 'Caught yourself adding <code>\'use client\'</code> to a page or a layout? Stop and ask whether only one child needs it. Nine times in ten, it does.', 'lam'),
    en: 'Deciding where the boundary goes, in four steps. Start with everything on the server. Find what truly needs the browser: interactive state, an event handler, a browser API, a DOM library. Mark the smallest component that needs it — the button, not the page. Then check the bundle in route-bundle-stats or DevTools. And if you catch yourself adding use client to a page or layout, ask whether only one child needs it.' },
  { t: 'Pitfall: a boundary drawn by file, not by responsibility', body: two(D(box('The temptation', 'Mark a whole <code>components/ui</code> folder client because half of it is interactive. From then on every import from it joins the bundle — the purely decorative card and label too — and nothing in the code shows the cost.', 'do2'),
      box('The measurable check', `Compare the route size before and after a change. Here, one directive moved a route from <b>${KB(sum(JB))}</b> to <b>${KB(sum(JA))}</b> B. The usual fix is splitting one file into two.`, 'xanh')),
      D(tn(lay('thuc', /page\.tsx:/), { fs: 16, title: 'cuongthai.com frontend — an observation (real)' }),
        box('Not a bug — a place to look', 'Most pages of this very site start with <code>\'use client\'</code> (262 of 347). Each one is a candidate for this lesson\'s question: does the whole page need it, or one leaf?', 'lam')), ''),
    en: 'The pitfall: a boundary drawn by file, not by responsibility — marking a whole UI folder client because half of it is interactive. The check is measurable: compare the route size before and after. And a real observation: on cuongthai dot com, two hundred sixty-two of three hundred forty-seven pages start with use client. Not bugs — candidates for exactly this question.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Boundary placement', "where 'use client' sits in the tree"), kw('Push down', 'keep client code in small leaves, not whole pages'),
      kw('Client island', 'a small interactive piece in a server page'), kw('Server default', 'everything is server unless it needs interactivity'),
      kw('First-load JS', 'JavaScript a route downloads on first visit'), kw('route-bundle-stats.json', 'where Next 16 writes it per route'),
      kw('Hydration seam', 'first client render must match the server HTML'), kw('Escape hatch', 'never gate a whole page on one flag'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: boundary placement; push down; client island; server default; first-load JavaScript; route-bundle-stats; the hydration seam; and an escape hatch.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Take a page that is fully ${c("'use client'")}; move the directive down to the one interactive leaf`,
      `Build before and after; compare ${c('firstLoadUncompressedJsBytes')} for that route`,
      'Open DevTools Network on both versions: count the scripts and their sizes',
      `Find a component gated on a single "ready" flag and give it an escape hatch`,
    ]), box('Keep these', `<ul><li>Server trunk, client leaves</li><li>One directive can cost a megabyte</li><li>Measure: route-bundle-stats / Network</li><li>Hydration: first render must match; never wait on one flag</li></ul>`, 'lam'), ''),
    en: 'Your turn: take a fully client page and move the directive down to its interactive leaf; build before and after and compare the first-load bytes; open DevTools Network on both; and find a component gated on a single ready flag and give it an escape hatch. Keep: a server trunk with client leaves; one directive can cost a megabyte; measure it; and at the hydration seam, never wait on one flag.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Server Components vs Client Components', bai: '9.5' }, S);
