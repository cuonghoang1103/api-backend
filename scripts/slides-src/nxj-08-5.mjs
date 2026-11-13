/*DU_LIEU*/
const DU_LIEU = {
 "n8-5:file:src/app/(marketing)/layout.tsx": "import type { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n  title: { template: '%s — CuongThai', default: 'CuongThai' },   // trang con chỉ cần ghi đè phần %s\n  description: 'Học Next.js, Node.js và hơn thế.',\n};\n\nexport default function MarketingLayout({ children }: { children: React.ReactNode }) {\n  return <div className=\"p-4 font-sans\"><p id=\"vo\">🎨 vỏ marketing</p>{children}</div>;\n}\n",
 "n8-5:file:src/app/(marketing)/gioi-thieu/page.tsx": "export const metadata = { title: 'Giới thiệu' };\n\nexport default function GioiThieu() {\n  return <h1>Giới thiệu</h1>;\n}\n",
 "n8-5:file:src/app/(marketing)/bai/[slug]/page.tsx": "import type { Metadata } from 'next';\n\nconst cham = (ms: number) => new Promise((r) => setTimeout(r, ms));\nasync function getBai(slug: string) { await cham(300); return { title: 'Bài: ' + slug }; }   // giả lập đọc CSDL 300 ms\n\nexport async function generateMetadata({ params }: PageProps<'/bai/[slug]'>): Promise<Metadata> {\n  const { slug } = await params;\n  const bai = await getBai(slug);\n  return { title: bai.title };\n}\n\nexport default async function Bai({ params }: PageProps<'/bai/[slug]'>) {\n  const { slug } = await params;            // ví dụ \"hello\"\n  return <article id=\"bai\">Bài: {slug}</article>;\n}\n",
 "n8-5:file:src/app/(ung-dung)/layout.tsx": "export default function AppLayout({ children }: { children: React.ReactNode }) {\n  return <div className=\"p-4 font-sans\"><p id=\"vo\">📱 vỏ ứng dụng</p>{children}</div>;\n}\n",
 "n8-5:file:src/app/(ung-dung)/bang-tin/page.tsx": "export default function BangTin() {\n  return <h1>Bảng tin</h1>;\n}\n",
 "n8-5:file:src/app/_components/page.tsx": "export default function KhongPhaiRoute() {\n  return <h1>Thư mục bắt đầu bằng _ — bị loại khỏi định tuyến</h1>;\n}\n",
 "n8-5:trang": "$ find 'src/app/(marketing)' 'src/app/(ung-dung)' src/app/_components -type f | sort\nsrc/app/_components/page.tsx\nsrc/app/(marketing)/bai/[slug]/page.tsx\nsrc/app/(marketing)/gioi-thieu/page.tsx\nsrc/app/(marketing)/layout.tsx\nsrc/app/(ung-dung)/bang-tin/page.tsx\nsrc/app/(ung-dung)/layout.tsx\n$ npm run build\n✓ Compiled successfully in 2.5s\nRoute (app)\n├ ƒ /bai/[slug]\n├ ○ /bang-tin\n├ ○ /gioi-thieu\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand",
 "n8-5:mo": "$ for p in /gioi-thieu /bang-tin '/(marketing)/gioi-thieu' /marketing/gioi-thieu /_components /bai/hello; do curl -s -o /dev/null -w \"GET $p → %{http_code}\\n\" \"localhost:19378$p\"; done\nGET /gioi-thieu → 200\nGET /bang-tin → 200\nGET /(marketing)/gioi-thieu → 404\nGET /marketing/gioi-thieu → 404\nGET /_components → 404\nGET /bai/hello → 200\n$ curl -s localhost:19378/gioi-thieu | grep -o '<title>[^<]*</title>\\|<meta name=\"description\"[^>]*>'\n<title>Giới thiệu — CuongThai</title>\n<meta name=\"description\" content=\"Học Next.js, Node.js và hơn thế.\"/>\n$ curl -s localhost:19378/bai/hello | grep -o '<title>[^<]*</title>\\|<article[^>]*>[^<]*<!-- -->[^<]*</article>' | sed 's/<!-- -->//'\n<article id=\"bai\">Bài: hello</article>\n<title>Bài: hello — CuongThai</title>\n$ curl -s 'localhost:19378/bai/xin-ch%C3%A0o' | grep -o '<article[^>]*>.*</article>' | sed 's/<!-- -->//'\n<article id=\"bai\">Bài: xin-ch%C3%A0o</article>\n$ for ua in 'curl/8' 'facebookexternalhit/1.1'; do curl -s -A \"$ua\" localhost:19378/bai/hello | python3 -c \"import sys; h=sys.stdin.read(); t=h.find('<title'); e=h.find('</head>'); print('$ua'.ljust(26), '→ <title> TRONG <head>' if -1 < t < e else '→ <title> nằm SAU </head> (truyền sau)')\"; done\ncurl/8                     → <title> nằm SAU </head> (truyền sau)\nfacebookexternalhit/1.1    → <title> TRONG <head>",
 "n8-5:file:src/app/(marketing)/trung/page.tsx": "export default function TrungA() { return <h1>trung · marketing</h1>; }\n",
 "n8-5:file:src/app/(ung-dung)/trung/page.tsx": "export default function TrungB() { return <h1>trung · ứng dụng</h1>; }\n",
 "n8-5:baytrung": "$ npm run build\n> Build error occurred\nError: Turbopack build failed with 1 error:\nError: You cannot have two parallel pages that resolve to the same path. Please check /(marketing)/trung and /(ung-dung).",
 "n8-5:file:src/app/(marketing)/bai-cu/[slug]/page.tsx": "export default function BaiCu({ params }: PageProps<'/bai-cu/[slug]'>) {\n  return <article>Bài: {params.slug}</article>;      // kiểu Next 14: đọc params không await\n}\n",
 "n8-5:bayawait": "$ npx tsc --noEmit 2>&1 | grep -E 'bai-cu' | sed 's#.*src/app#src/app#' | head -3\nsrc/app/(marketing)/bai-cu/[slug]/page.tsx(2,32): error TS2339: Property 'slug' does not exist on type 'Promise<{ slug: string; }>'.",
 "n8-5:file:src/app/(marketing)/may-khach/page.tsx": "'use client';\nexport const metadata = { title: 'Trang có use client' };\n\nexport default function MayKhach() {\n  return <h1>Trang có use client</h1>;\n}\n",
 "n8-5:bayclient": "$ npm run build\nError: Turbopack build failed with 1 error:\n./src/app/(marketing)/may-khach/page.tsx:2:14\nError: You are attempting to export \"metadata\" from a component marked with \"use client\", which is disallowed. \"metadata\" must be resolved on the server before the page component is rendered. Keep your page as a Server Component and move Client Component logic to a separate file. Read more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#why-generatemetadata-is-server-component-only\n> 2 | export const metadata = { title: 'Trang có use client' };\n    ./src/app/(marketing)/may-khach/page.tsx [Client Component Browser]\n    ./src/app/(marketing)/may-khach/page.tsx [Server Component]",
 "n8-5:thuc": "$ ls -d frontend/src/app/\\(*\\) frontend/src/app/\\(auth\\)/*\n(auth)\n(auth)/login\n(auth)/register\n$ find frontend/src/app -type d -name '[[]*' | wc -l\n61\n$ grep -rl \"generateMetadata\" frontend/src/app | wc -l\n24",
 "n8-5:dung": "",
 "n8-5:dau": "$ curl -s 'localhost:19378/bai/xin-ch%C3%A0o' | grep -o '<title>[^<]*</title>\\|<article[^>]*>.*</article>' | sed 's/<!-- -->//'\n<article id=\"bai\">Bài: xin-ch%C3%A0o</article>\n<title>Bài: xin-chào — CuongThai</title>",
 "anh-nxj-8-5:gioi-thieu": {
  "url": "http://127.0.0.1:19378/gioi-thieu",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "title": "Giới thiệu — CuongThai"
  }
 },
 "anh-nxj-8-5:bang-tin": {
  "url": "http://127.0.0.1:19378/bang-tin",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "title": "Create Next App"
  }
 },
 "anh-nxj-8-5:bai-hello": {
  "url": "http://127.0.0.1:19378/bai/hello",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "title": "Bài: hello — CuongThai"
  }
 },
 "anh-nxj-8-5:bai-dau": {
  "url": "http://127.0.0.1:19378/bai/xin-ch%C3%A0o",
  "vp": [
   640,
   120
  ],
  "rect": {
   "#bai": [
    16,
    40,
    608,
    24
   ]
  },
  "console": [],
  "ketQua": {
   "title": "Bài: xin-chào — CuongThai",
   "path": "/bai/xin-ch%C3%A0o"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-08-5', code: 'NXJ 8.5', title: 'Route groups, dynamic segments and metadata', sub: 'Chapter 8 · Lesson 8.5' };
const O = (k) => { const v = DU_LIEU[`n8-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-8-5:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-08-5', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const F = (p) => O('file:src/app/' + p).trim();
for (const [k, s] of [['mo', 'GET /(marketing)/gioi-thieu → 404'], ['mo', 'GET /_components → 404'], ['mo', '<title>Giới thiệu — CuongThai</title>'], ['mo', 'Bài: xin-ch%C3%A0o'],
  ['mo', 'curl/8                     → <title> nằm SAU </head>'], ['mo', 'facebookexternalhit/1.1    → <title> TRONG <head>'], ['dau', '<title>Bài: xin-chào — CuongThai</title>'],
  ['baytrung', 'two parallel pages that resolve to the same path'], ['bayawait', "Property 'slug' does not exist on type 'Promise"], ['bayclient', 'export "metadata" from a component marked with "use client"'],
  ['trang', 'ƒ /bai/[slug]'], ['thuc', '(auth)/login']])
  if (!O(k).includes(s)) throw new Error(`số đo 8.5 đổi: ${k} thiếu "${s}"`);
if (AN('bang-tin').ketQua.title !== 'Create Next App' || AN('gioi-thieu').ketQua.title !== 'Giới thiệu — CuongThai') throw new Error('title 8.5 đổi');
const SODONG = lay('thuc', /^\d+$/).split('\n');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.5', t: 'Route groups,<br>dynamic segments, metadata', sub: 'Organise without changing URLs, one folder for many pages, and the title and SEO tags of every route — with the surprises we measured',
    en: 'Lesson eight point five: route groups, dynamic segments and metadata. How to organise files without changing URLs, one folder for many pages, and the title and SEO tags of every route — plus three surprises we measured.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Route groups <code>(name)</code>: share a layout, keep the name out of the URL</li>
    <li>Private folders <code>_name</code>, and the build error when two groups collide</li>
    <li>Dynamic segments <code>[slug]</code>: <code>params</code> is a Promise — and accented URLs arrive encoded</li>
    <li>Metadata: <code>export const metadata</code>, title templates, <code>generateMetadata</code></li>
    <li>Streaming metadata: browsers and bots see a different &lt;head&gt;</li></ul>`,
    en: 'Five takeaways: route groups that share a layout without changing the URL; private folders, and the error when two groups collide; dynamic segments, where params is a Promise and accented URLs arrive encoded; metadata with title templates and generateMetadata; and streaming metadata — browsers and bots see a different head.' },
  { t: 'Route groups: folders in parentheses', body: two(tree(['src/app/', '  (marketing)/', '*    layout.tsx       // marketing shell', '    gioi-thieu/', '      page.tsx       // → /gioi-thieu', '    bai/[slug]/', '      page.tsx       // → /bai/:slug', '  (ung-dung)/', '*    layout.tsx       // a DIFFERENT shell', '    bang-tin/', '      page.tsx       // → /bang-tin'], { fs: 19 }),
      D(tn(lay('mo', /^GET \/(gioi|bang|\(market|market)/), { fs: 17, title: 'next start · curl (real)' }), B('gioi-thieu', { vp: 640, h: 70, w: 520, url: 'localhost:3000/gioi-thieu' }), '<div style="height:8px"></div>', B('bang-tin', { vp: 640, h: 70, w: 520, url: 'localhost:3000/bang-tin' })), '') +
      box('Organise, share a layout — never in the URL', 'The name in parentheses is dropped from the address: <code>/(marketing)/gioi-thieu</code> and <code>/marketing/gioi-thieu</code> are both 404. Two groups, two shells, clean top-level URLs.', 'xanh'),
    en: 'Route groups: a folder whose name is in parentheses. It organises files and can own a layout, but its name is dropped from the URL. Measured: slash gioi-thieu answers two hundred with the marketing shell, slash bang-tin with the app shell, and both slash parenthesis marketing and slash marketing are four oh four. Two groups, two shells, clean URLs.' },
  { t: 'Two tools that look alike, doing opposite jobs', body: cmp(['', '<code>(marketing)</code> — route group', '<code>_components</code> — private folder'], [
      ['in the URL?', 'no — the name is dropped', 'no — the whole folder is excluded'],
      ['its pages routable?', '<b>yes</b>: /gioi-thieu', '<b>no</b>: even a page.tsx inside → 404'],
      ['typical use', 'share a layout between sibling sections', 'keep components next to the route that uses them'],
    ], { hl: [1] }) + two(tn(lay('mo', /_components/), { fs: 18, title: 'curl (real)' }), tn(lay('trang', /Route \(app\)/, /^[├└┌] /), { fs: 17, title: 'npm run build — no ( ) and no _components' }), ''),
    en: 'Two tools that look alike but do opposite jobs. Parentheses make a route group: the name is dropped but its pages are routable. An underscore makes a private folder: the whole folder is excluded from routing — we even put a page file inside underscore components and it answered four oh four, and the build\'s route table does not list it.' },
  { t: 'Pitfall: two groups resolve to the same URL', body: tree(['src/app/', '  (marketing)/', '*    trung/page.tsx   // → /trung', '  (ung-dung)/', '*    trung/page.tsx   // → /trung  (again!)'], { fs: 22 }) +
      tn(lay('baytrung', /^Error: You cannot/), { fs: 17, title: 'npm run build (real)' }) +
      two(box('Why', 'Group names are stripped, so both folders become <code>/trung</code>. The build stops; on a big tree it takes a while to find the pair.', 'do2'),
        box('Avoid it', 'Groups share layouts between siblings — they are not namespaces. Two different pages need two different URLs. Name a group after the layout it shares, e.g. <code>(with-sidebar)</code>.', 'xanh'), ''),
    en: 'The pitfall: two groups that resolve to the same URL. Marketing slash trung and ung-dung slash trung both become slash trung, because group names are stripped. The build stops: you cannot have two parallel pages that resolve to the same path. Groups share a layout between siblings; they are not namespaces. Name them after the layout they share.' },
  { t: 'Dynamic segments: one folder, many pages', body: two(tsx(`// app/(marketing)/bai/[slug]/page.tsx
export default async function Bai(
  { params }: PageProps<'/bai/[slug]'>
) {
  const { slug } = await params;  // "hello"
  return <article>Bài: {slug}</article>;
}`, { hl: [5] }), D(tn(lay('mo', /^GET \/bai/) + '\n' + lay('mo', /^<article id="bai">Bài: hello/), { fs: 18, title: 'curl /bai/hello (real)' }),
      tn(lay('trang', /\/bai\/\[slug\]/, /Dynamic/), { fs: 17, title: 'npm run build (real)' }),
      box('[slug] = a placeholder', 'Square brackets mark the dynamic part; the name inside is the key you read from <code>params</code>. That is how <code>/courses/nextjs</code> and <code>/courses/nodejs</code> are one file. ƒ: rendered per request (Chapter 11 pre-renders them).', 'lam')), ''),
    en: 'Dynamic segments: one folder, many pages. A folder named slug in square brackets matches any value at that position and hands it to the page through params. Measured: slash bai slash hello renders "Bài: hello". The build marks it with f — rendered on demand. That is how slash courses slash nextjs and slash courses slash nodejs are one file.' },
  { t: 'params is a Promise — await it', body: tsx(F('(marketing)/bai/[slug]/page.tsx').split('\n').slice(11).join('\n'), { hl: [2] }) + tsx(`// the Next.js 14 way — params read without await
export default function BaiCu({ params }) {
  return <article>Bài: {params.slug}</article>;
}`, { hl: [3] }) + tn(lay('bayawait', /TS2339/).replace(/^src\/app\/\(marketing\)\//, ''), { fs: 16, title: 'npx tsc --noEmit (real)' }) +
      two(box('Since Next.js 15', '<code>params</code> (and <code>searchParams</code>) are Promises. TypeScript catches the old style; in plain JavaScript <code>params.slug</code> is just <code>undefined</code>.', 'do2'),
        box('Old tutorials', 'Most examples online read <code>params.slug</code> directly. Add <code>await</code>, make the component <code>async</code>.', 'lam'), ''),
    en: 'params is a Promise — await it. Since Next.js fifteen, params and searchParams are Promises. We pasted the old style, reading params dot slug without await: TypeScript stopped it — property slug does not exist on type Promise. In plain JavaScript there is no error at all; the value is simply undefined. Old tutorials read it directly, so add await and make the component async.' },
  { t: 'Surprise 1: an accented URL arrives encoded', body: two(D(tn('$ curl localhost:3000/bai/xin-ch%C3%A0o\n' + lay('dau', /<article/, /<title>/), { fs: 18, title: 'next start (real)' }),
      B('bai-dau', { vp: 640, h: 80, w: 540, url: 'localhost:3000/bai/xin-chào', mark: [[16, 40, 220, 24, '']] })),
      cmp(['Who reads params', 'got'], [['the page', '<code>xin-ch%C3%A0o</code> — still encoded'], ['generateMetadata', '<code>xin-chào</code> — decoded']], { hl: [0] }), '') +
      two(box('Fix', 'Decode before you use it: <code>const slug = decodeURIComponent((await params).slug)</code> — then look up the database with the real string.', 'xanh'),
        box('Why it matters here', 'cuongthai.com has slugs with Vietnamese letters (lesson 4.3 of this course is <code>nextjs-4-3-form-thật</code>). Measured on Next.js 16.4.6 — re-check after upgrades.', 'lam'), ''),
    en: 'Surprise number one: an accented URL. We requested slash bai slash xin-chào. The page received the slug still percent-encoded — x-i-n dash c-h percent C3 percent A0 o — while generateMetadata received the decoded "xin-chào", so the tab title and the page disagree. Decode it before using it. This matters on cuongthai dot com, whose slugs contain Vietnamese letters.' },
  { t: 'Metadata: title and SEO from the route', body: two(D(tsx(`// (marketing)/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s — CuongThai',
    default: 'CuongThai',
  },
  description: 'Học Next.js, Node.js…',
};`, { sm: true, hl: [4] }), tsx(`// (marketing)/gioi-thieu/page.tsx
export const metadata = { title: 'Giới thiệu' };`, { sm: true })),
      D(tn(lay('mo', /<title>Giới thiệu/, /<meta name="description"/).replace('" content=', '"\n      content='), { fs: 16, title: 'curl /gioi-thieu (real)' }),
        cmp(['Route', 'document.title (Chromium)'], [['/gioi-thieu', AN('gioi-thieu').ketQua.title], ['/bai/hello', AN('bai-hello').ketQua.title], ['/bang-tin', `<b>${AN('bang-tin').ketQua.title}</b>`]], { hl: [2] })), '') +
      box('Merged down the tree', 'A child only overrides what it needs: the page sets <code>"Giới thiệu"</code>, the group layout\'s template adds <code>" — CuongThai"</code>. <code>/bang-tin</code> sits in the other group — no template there, so it inherits the root layout\'s "Create Next App". Export metadata from a <b>Server Component</b> (page or layout).', 'lam'),
    en: 'Metadata: the title and SEO tags of a route. The marketing layout exports a title template and a description; the page only sets "Giới thiệu". Next.js merges them down the tree: the HTML has the title "Giới thiệu — CuongThai" and the description. But slash bang-tin lives in the other group, so it inherited the root layout\'s title, "Create Next App" — easy to miss.' },
  { t: 'generateMetadata: a title that depends on data', body: two(tsx(`export async function generateMetadata(
  { params }: PageProps<'/bai/[slug]'>
): Promise<Metadata> {
  const { slug } = await params;
  const bai = await getBai(slug); // 300 ms
  return { title: bai.title };
}`, { hl: [4, 5, 6] }),
      D(tn(lay('mo', /<title>Bài: hello/), { fs: 18, title: 'curl /bai/hello (real)' }),
        box('Async, receives params', 'Fetch what you need (here a fake 300 ms database read) and return the metadata. A request for the same data in the page is deduplicated (Chapter 10).', 'xanh'),
        box('Where people look first', 'A shared link showing the wrong title, image or destination → check that route\'s <code>metadata</code> / <code>generateMetadata</code>. cuongthai.com once had a Messenger share link pointing to "/" because the Open Graph URL in metadata was wrong.', 'lam')), ''),
    en: 'generateMetadata, for a title that depends on data. It is async, receives params, can fetch — here a fake three-hundred millisecond database read — and returns the metadata: the title became "Bài: hello — CuongThai". When a shared link shows the wrong title, image or destination, this is the first place to look; cuongthai dot com once shared Messenger links that pointed to the home page because of a wrong Open Graph URL.' },
  { t: 'Surprise 2: streaming metadata — bots and browsers differ', body: tn(lay('mo', /→ <title>/), { fs: 19, title: 'next start · /bai/hello with two User-Agents (real)' }) +
      two(box('What happens', 'For a dynamic route with a slow <code>generateMetadata</code>, Next.js does not hold the page back: it sends <code>&lt;head&gt;</code> first and <b>streams</b> the &lt;title&gt; later. Browsers run JavaScript and move it into place.', 'lam'),
        box('Bots that only read HTML', 'Crawlers such as <code>facebookexternalhit</code> are on a built-in list: for them Next.js waits and puts the &lt;title&gt; <b>inside</b> &lt;head&gt;. Test share previews with the bot\'s User-Agent, not with your browser.', 'xanh'), '') +
      box('Chapter 17', 'SEO, Open Graph images and how search engines read this — in depth.', ''),
    en: 'Surprise number two: streaming metadata. We fetched the same dynamic page with two user agents. With curl\'s user agent the title came after the closing head tag — Next.js streamed it later so the page is not held back. With facebookexternalhit, a bot on Next.js\'s list, the title was inside the head. So test share previews with the bot\'s user agent. Chapter seventeen goes deeper.' },
  { t: 'Pitfall: metadata in a "use client" page', body: tsx(F('(marketing)/may-khach/page.tsx').split('\n').slice(0, 2).join('\n'), { hl: [2] }) +
      tn(lay('bayclient', /^Error: You are attempting/).replace(/ Read more:.*/, ''), { fs: 16, title: 'npm run build (real)' }) +
      two(box('Why', 'Metadata goes into the HTML &lt;head&gt;, produced on the server before the page renders. A Client Component cannot be the source of it.', 'lam'),
        box('Fix', 'Keep the page a Server Component that exports <code>metadata</code>; move the interactive part into a separate Client Component file.', 'xanh'), ''),
    en: 'A pitfall: exporting metadata from a page marked use client. The build refuses: metadata must be resolved on the server before the page component is rendered. The fix is the same pattern as before — keep the page on the server, export metadata there, and move the interactive part into its own Client Component file.' },
  { t: 'On cuongthai.com', body: two(D(tn(lay('thuc', /^\(auth\)/), { fs: 19, title: 'route group in frontend/src/app (real)' }),
      tn(`dynamic folders [..]   ${SODONG[0]}\nfiles with generateMetadata   ${SODONG[1]}`, { fs: 19, title: 'counts (real)' })),
      D(box('(auth)', '<code>/login</code> and <code>/register</code> share one auth layout; the word "auth" never appears in the URL.', 'xanh'),
        box('[slug] everywhere', `${SODONG[0]} dynamic folders — <code>/courses/[slug]</code>, <code>/exam/[examId]</code>… — and ${SODONG[1]} routes build their title from data with <code>generateMetadata</code>.`, 'lam')), ''),
    en: `On cuongthai dot com: one route group, parenthesis auth, holds slash login and slash register under a shared layout, and the word auth never appears in the URL. There are ${SODONG[0]} dynamic folders — courses slash slug, exam slash exam id and so on — and ${SODONG[1]} routes build their title from data with generateMetadata.` },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Route group (name)', 'organises routes and shares a layout; not in the URL'), kw('Private folder _name', 'excluded from routing entirely'),
      kw('Dynamic segment [slug]', 'one folder matching many URL values'), kw('params', 'a Promise of the dynamic values — await it'),
      kw('metadata', 'static title/description exported from a page or layout'), kw('Title template', '"%s — CuongThai": children fill in %s'),
      kw('generateMetadata', 'async metadata computed from params and data'), kw('Streaming metadata', 'title sent after &lt;head&gt; for browsers; inside it for bots'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: route group; private folder; dynamic segment; params; metadata; title template; generateMetadata; and streaming metadata.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Create ${c('(marketing)')} with its own layout; confirm the name never appears in the URL`,
      `Add ${c('[slug]/page.tsx')}, ${c('await params')}, and open an accented slug — then fix it with ${c('decodeURIComponent')}`,
      `Export ${c('metadata')} with a title template; check ${c('<title>')} with curl`,
      `Add ${c('generateMetadata')}; curl it with and without ${c('-A facebookexternalhit/1.1')}`,
    ]), box('Keep these', `<ul><li>(group) = organise, not URL</li><li>_folder = out of routing</li><li><code>await params</code>; decode accented slugs</li><li>Metadata from Server Components; test shares as a bot</li></ul>`, 'lam'), ''),
    en: 'Your turn: create a marketing group with its own layout and confirm the URL; add a slug page, await params and open an accented slug, then fix it; export metadata with a template and check the title with curl; and add generateMetadata and curl it as a normal client and as facebookexternalhit. Keep: groups organise, they are not URLs; underscore folders are out of routing; await params and decode accents; metadata comes from Server Components.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — The App Router: routing by folders', bai: '8.5' }, S);
