/*DU_LIEU*/
const DU_LIEU = {
 "n11-3:file:app/api/ngau-nhien/route.js": "// cùng route \"câu nói ngẫu nhiên\" — trên Next.js 14.2.35\nconst CAU = ['Đo, đừng đoán', 'Cache là bản sao', 'Server trước, client sau', 'Kiểm chuỗi trước'];\nexport async function GET() {\n  return Response.json({ cau: CAU[Math.floor(Math.random() * CAU.length)], luc: new Date().toISOString().slice(11, 23) });\n}\n",
 "n11-3:v14": "$ npx next --version\nNext.js v14.2.35\n$ npm run build 2>&1 | grep -E '/api/ngau-nhien|Static|Dynamic'\n─ ○ /api/ngau-nhien                       0 B                0 B\n○  (Static)  prerendered as static content\n$ for i in 1 2; do curl localhost:3000/api/ngau-nhien; sleep 1; done      # Next.js 14\n/api/ngau-nhien (14) · {\"cau\":\"Server trước, client sau\",\"luc\":\"17:55:02.582\"}\n/api/ngau-nhien (14) · {\"cau\":\"Server trước, client sau\",\"luc\":\"17:55:02.582\"}",
 "n11-3:kho": "$ find frontend/src/app -name route.ts | wc -l      # kho cuongthai.com (Next.js 14.2)\n30\n$ find . -name route.ts | sed 's|^\\./||; s|/route.ts$||' | sort | head -30\napi/admin/music/upload\napi/admin/users/nextauth\napi/ai-templates/search\napi/auth/[...nextauth]\napi/auth/admin-check\napi/auth/login\napi/auth/logout\napi/auth/oauth/token\napi/auth/refresh\napi/auth/register\napi/auth/sync\napi/chat\napi/index-url\napi/music/history\napi/music/upload\napi/revalidate\napi/v1/[[...path]]\napi/v1/courses/activate-code\napi/v1/files/upload\napi/v1/files/upload/signed-url\napi/v1/music/admin/upload\napi/v1/music/admin/upload/audio/raw\napi/v1/orders\napi/v1/profile/session\napi/v1/social/media/signed-url\ncli/install.ps1\ncli/install.sh\ntech-trends/rss.xml\nuploads/[...path]\nvoice/rss.xml\n$ for f in $(find frontend/src/app -name route.ts); do …; done      # mọi route có GET: khai dynamic chưa? đọc request không?\napi/admin/users/nextauth             —                        function GET(request: NextRequest)\napi/ai-templates/search              dynamic = 'force-static'   function GET()\napi/auth/admin-check                 —                        function GET(request: NextRequest)\napi/index-url                        dynamic = 'force-dynamic'  function GET()\napi/music/history                    dynamic = 'force-dynamic'  function GET(request: NextRequest)\napi/revalidate                       dynamic = 'force-dynamic'  function GET(request: NextRequest)\napi/v1/[[...path]]                   —                        function GET(request: NextRequest)\napi/v1/files/upload/signed-url       —                        function GET(request: NextRequest)\napi/v1/profile/session               —                        function GET(request: NextRequest)\napi/v1/social/media/signed-url       —                        function GET(request: NextRequest)\ncli/install.ps1                      dynamic = 'force-static'   function GET()\ncli/install.sh                       dynamic = 'force-static'   function GET()\ntech-trends/rss.xml                  dynamic = 'force-dynamic'  function GET()\nuploads/[...path]                    dynamic = 'force-dynamic'  \nvoice/rss.xml                        dynamic = 'force-dynamic'  function GET()",
 "n11-3:file:src/app/api/health/route.ts": "// app/api/health/route.ts  →  GET /api/health   (đúng đoạn mã của bài)\nexport async function GET() {\n  return Response.json({ ok: true });\n}\n",
 "n11-3:file:src/app/api/posts/route.ts": "// app/api/posts/route.ts  →  POST /api/posts   (mã của bài + kiểu + Prisma thật của phòng thí nghiệm)\nimport { PrismaClient } from '@prisma/client';\nconst db = new PrismaClient();\n\nexport async function POST(request: Request) {\n  const body = await request.json();\n  const post = await db.note.create({ data: body });   // bài dùng db.post — lab có bảng Note\n  return Response.json(post, { status: 201 });\n}\n",
 "n11-3:bai": "$ npx tsc --noEmit      # hai đoạn mã của bài, chép nguyên vào route.ts\napi/posts/route.ts(2,28): error TS7006: Parameter 'request' implicitly has an 'any' type.\napi/posts/route.ts(4,22): error TS2304: Cannot find name 'db'.",
 "n11-3:file:src/app/api/ngau-nhien/route.ts": "// app/api/ngau-nhien/route.ts — \"câu nói ngẫu nhiên\": GET không đọc gì từ request\nconst CAU = ['Đo, đừng đoán', 'Cache là bản sao', 'Server trước, client sau', 'Kiểm chuỗi trước'];\nexport async function GET() {\n  return Response.json({ cau: CAU[Math.floor(Math.random() * CAU.length)], luc: new Date().toISOString().slice(11, 23) });\n}\n",
 "n11-3:file:src/app/api/ngau-nhien-tinh/route.ts": "// cùng mã, nhưng CHỦ ĐỘNG xin cache: tính một lần lúc build\nexport const dynamic = 'force-static';\nconst CAU = ['Đo, đừng đoán', 'Cache là bản sao', 'Server trước, client sau', 'Kiểm chuỗi trước'];\nexport async function GET() {\n  return Response.json({ cau: CAU[Math.floor(Math.random() * CAU.length)], luc: new Date().toISOString().slice(11, 23) });\n}\n",
 "n11-3:trang": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/api|Static|Dynamic'\n✓ Compiled successfully in 1672ms\n├ ƒ /api/health\n├ ƒ /api/ngau-nhien\n├ ○ /api/ngau-nhien-tinh\n└ ƒ /api/posts\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ curl -s -i localhost:19390/api/health | grep -iE '^HTTP|^content-type|^\\{'\nHTTP/1.1 200 OK\ncontent-type: application/json\n{\"ok\":true}\n$ for p in ngau-nhien ngau-nhien ngau-nhien-tinh ngau-nhien-tinh; do curl localhost:3000/api/$p; sleep 1; done\n/api/ngau-nhien · {\"cau\":\"Cache là bản sao\",\"luc\":\"17:57:34.688\"}\n/api/ngau-nhien · {\"cau\":\"Cache là bản sao\",\"luc\":\"17:57:35.711\"}\n/api/ngau-nhien-tinh · {\"cau\":\"Server trước, client sau\",\"luc\":\"17:57:30.486\"}\n/api/ngau-nhien-tinh · {\"cau\":\"Server trước, client sau\",\"luc\":\"17:57:30.486\"}",
 "n11-3:post": "$ curl -X POST localhost:3000/api/posts -d '{\"title\":\"Bài mới\"}'\n{\"id\":21,\"title\":\"Bài mới\"}   ← HTTP 201\n$ curl -X POST localhost:3000/api/posts -d '{\"id\":999,\"title\":\"tôi tự chọn id\"}'\n{\"id\":999,\"title\":\"tôi tự chọn id\"}   ← HTTP 201\n$ curl -X POST localhost:3000/api/posts -d '{\"id\":13,\"title\":\"đè?\"}'\nHTTP 500\n$ curl -X POST localhost:3000/api/posts -d '{\"title\":\"x\",\"laAdmin\":true}'\nHTTP 500\n$ grep -E 'Unique constraint|Unknown argument' (log next start)\nUnique constraint failed on the fields: (`id`)\nUnknown argument `laAdmin`\n$ curl -X DELETE / HEAD / OPTIONS localhost:3000/api/health\nDELETE  → 405\nHEAD    → 200\nOPTIONS → 204 · allow: GET, HEAD, OPTIONS",
 "n11-3:file:src/app/trung/page.tsx": "export default function Trang() { return <p>trang</p>; }\n",
 "n11-3:file:src/app/trung/route.ts": "export async function GET() { return Response.json({ la: 'route' }); }\n",
 "n11-3:trung": "$ npm run build      # app/trung/ có CẢ page.tsx LẪN route.ts\nError: Turbopack build failed with 1 error:\nError: An issue occurred while preparing your Next.js app\nConflicting route and page at /trung: route at /trung/route and page at /trung/page",
 "n11-3:file:api11.mjs": "// api11.mjs — API giả Chương 11 (node api11.mjs 19391). Mỗi request in MỘT dòng log có mili-giây.\n// GET /courses · GET /courses/<slug> · POST /courses?slug=&ten= · GET /thoi-tiet (CẦN header x-api-key đúng — giả lập API trả phí của bên thứ ba) · GET /dem\nimport http from 'node:http';\nconst PORT = Number(process.argv[2] ?? 19391);\nconst KHOA = [{ slug: 'nextjs', ten: 'Next.js' }, { slug: 'nodejs', ten: 'Node.js' }, { slug: 'react', ten: 'React' }];\nconst KHOA_API = process.env.KHOA_API ?? '';\nlet dem = {};\nconst gio = () => new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');\nhttp.createServer((req, res) => {\n  const u = new URL(req.url, 'http://x'), p = u.pathname;\n  const tra = (o, ma = 200) => { res.writeHead(ma, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };\n  if (p === '/dem') return tra(dem);\n  dem[p] = (dem[p] ?? 0) + 1;\n  console.log(`[api] ${gio()} ${req.method} ${req.url}${p === '/thoi-tiet' ? ` · khoá ${req.headers['x-api-key'] === KHOA_API ? 'ĐÚNG' : 'SAI/thiếu'}` : ''}`);\n  if (p === '/thoi-tiet') return req.headers['x-api-key'] === KHOA_API ? tra({ thanhPho: 'Hà Nội', doC: 21 }) : tra({ loi: 'thiếu hoặc sai x-api-key' }, 401);\n  if (req.method === 'POST' && p === '/courses') { KHOA.push({ slug: u.searchParams.get('slug'), ten: u.searchParams.get('ten') }); return tra({ them: u.searchParams.get('slug') }); }\n  if (p === '/courses') return tra(KHOA);\n  const m = /^\\/courses\\/([^/]+)$/.exec(p);\n  if (m) { const k = KHOA.find((x) => x.slug === m[1]); return k ? tra({ ...k, luc: gio() }) : tra({ loi: 'không có' }, 404); }\n  tra({ loi: 'không có' }, 404);\n}).listen(PORT, '127.0.0.1', () => console.log(`[api] nghe ở http://127.0.0.1:${PORT}`));\n",
 "n11-3:file:.env.local": "# khoá GIẢ của phòng thí nghiệm — KHÔNG có tiền tố NEXT_PUBLIC_ ⇒ chỉ máy chủ đọc được\nTHOI_TIET_KEY=khoa-gia-cua-lab\n",
 "n11-3:file:src/app/api/thoi-tiet/route.ts": "// app/api/thoi-tiet/route.ts — proxy GIẤU KHOÁ: trình duyệt gọi route này, route gọi API bên ngoài kèm khoá\nexport async function GET() {\n  const r = await fetch('http://127.0.0.1:19391/thoi-tiet', {\n    headers: { 'x-api-key': process.env.THOI_TIET_KEY! },   // khoá chỉ nằm ở máy chủ\n    cache: 'no-store',\n  });\n  return Response.json(await r.json(), { status: r.status });\n}\n",
 "n11-3:file:src/app/thoi-tiet/page.tsx": "'use client';\n// trang client: gọi route của CHÍNH MÌNH, không biết khoá\nimport { useEffect, useState } from 'react';\n\nexport default function ThoiTiet() {\n  const [d, setD] = useState<{ thanhPho?: string; doC?: number } | null>(null);\n  useEffect(() => { fetch('/api/thoi-tiet').then((r) => r.json()).then(setD); }, []);\n  return <p id=\"kq\" className=\"p-4 text-2xl\">{d ? `${d.thanhPho}: ${d.doC}°C` : 'Đang tải…'}</p>;\n}\n",
 "n11-3:khoa": "$ npm run build 2>&1 | grep -E '/api/thoi-tiet|/thoi-tiet'\n├ ƒ /api/thoi-tiet\n└ ○ /thoi-tiet\n$ curl -s localhost:19390/api/thoi-tiet; echo '   ← qua route của mình'\n{\"thanhPho\":\"Hà Nội\",\"doC\":21}   ← qua route của mình\n$ curl -s 127.0.0.1:19391/thoi-tiet; echo '   ← gọi thẳng API ngoài, không khoá'\n{\"loi\":\"thiếu hoặc sai x-api-key\"}   ← gọi thẳng API ngoài, không khoá\n$ grep -rl \"$THOI_TIET_KEY\" .next/static | wc -l\nkhoá trong .next/static (gửi xuống trình duyệt): 0\n$ grep -rl \"$THOI_TIET_KEY\" .next/server | wc -l\nkhoá trong .next/server: 0\n[api] 01:04:31.479 GET /thoi-tiet · khoá ĐÚNG\n[api] 01:04:31.502 GET /thoi-tiet · khoá SAI/thiếu",
 "n11-3:file:prisma/schema.prisma": "// prisma/schema.prisma — bài 11.3: id tự tăng (người gọi API KHÔNG cần gửi id)\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\nmodel Note {\n  id    Int    @id @default(autoincrement())\n  title String\n}\n",
 "anh-nxj-11-3:health": {
  "url": "http://127.0.0.1:19390/api/health",
  "vp": [
   640,
   130
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-11-3:thoi-tiet": {
  "url": "http://127.0.0.1:19390/thoi-tiet",
  "vp": [
   640,
   130
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19390/thoi-tiet",
    "ma": 200,
    "loai": "document",
    "kt": 7266
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/24u_do1h08l0n.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14721
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/3ipuppj5hlb__.js",
    "ma": 200,
    "loai": "script",
    "kt": 420
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19390/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19390/api/thoi-tiet",
    "ma": 200,
    "loai": "fetch",
    "kt": 33
   }
  ],
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-11-3', code: 'NXJ 11.3', title: 'Route Handlers: an API in the app folder', sub: 'Chapter 11 · Lesson 11.3' };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-11-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const O = (k) => { const v = DU_LIEU[`n11-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-11-3', ten, { vp: 640, ...o });
const F = (p) => O(`file:${p}`).trim();
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l) && !/^# /.test(l)).join('\n');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };

// đoạn mã của bài (bài web, khối đầu) — chép nguyên: tsc đo ở khối "bai"
const BAI = `// app/api/health/route.ts  →  GET /api/health
export async function GET() {
  return Response.json({ ok: true });
}
// app/api/posts/route.ts  →  POST /api/posts
export async function POST(request) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return Response.json(post, { status: 201 });
}`;
// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const TSC = dongs('bai', /error TS/);
const B16 = dongs('trang', /^[├└┌] [○ƒ] \/api/);
const HEALTH = doan('trang', 'api/health | grep');
const NGAU = dongs('trang', /^\/api\/ngau-nhien/);
const POST = dongs('post', /HTTP \d{3}/);
const PLOG = dongs('post', /Unique constraint|Unknown argument/);
const METH = dongs('post', /^(DELETE|HEAD|OPTIONS)/);
const TRUNG = dongs('trung', /Conflicting route and page/);
const V14 = dongs('v14', /^─ ○ \/api|^\/api\/ngau-nhien \(14\)/);
const VER14 = dongs('v14', /^Next\.js v14/)[0];
const KHOA = dongs('khoa', /←|khoá trong|\[api\]/).map((l) => l.trim());
const KHO_N = doan('kho', 'wc -l')[0];
const KHO_GET = doan('kho', "for f in $(find").map((l) => l.replace(/\s+function GET.*$/, (m) => m.replace('function ', '')));
if (TSC.length !== 2 || !/TS7006/.test(TSC[0]) || !/TS2304/.test(TSC[1])) throw new Error('tsc bài đổi');
if (B16.join() !== '├ ƒ /api/health,├ ƒ /api/ngau-nhien,├ ○ /api/ngau-nhien-tinh,└ ƒ /api/posts') throw new Error('bảng build 16 đổi');
const j = (l) => JSON.parse(l.split(' · ').slice(1).join(' · '));
if (j(NGAU[0]).luc === j(NGAU[1]).luc || j(NGAU[2]).luc !== j(NGAU[3]).luc) throw new Error('ngẫu nhiên 16 đổi');
const v14 = V14.filter((l) => /\(14\)/.test(l)).map((l) => JSON.parse(l.split(' · ').slice(1).join(' · ')));
if (!V14.some((l) => /○ \/api\/ngau-nhien/.test(l)) || v14.length !== 2 || v14[0].luc !== v14[1].luc) throw new Error('ngẫu nhiên 14 đổi');
if (!/201/.test(POST[0]) || !/"id":999.*201/.test(POST[1]) || !/500/.test(POST[2]) || !/500/.test(POST[3]) || PLOG.length !== 2) throw new Error('POST đổi');
if (METH.join('|') !== 'DELETE  → 405|HEAD    → 200|OPTIONS → 204 · allow: GET, HEAD, OPTIONS') throw new Error('phương thức đổi');
if (!KHOA.some((l) => /static.*: 0$/.test(l)) || !KHOA.some((l) => /SAI\/thiếu/.test(l))) throw new Error('proxy đổi');

const POSTS = goc(bo(F('src/app/api/posts/route.ts')));
const NGAU_SRC = goc(bo(F('src/app/api/ngau-nhien/route.ts'))).replace('return Response.json({ cau: CAU[Math.floor(Math.random() * CAU.length)], luc:', 'return Response.json({\n    cau: CAU[Math.floor(Math.random() * CAU.length)],\n    luc:');
const TT = goc(bo(F('src/app/api/thoi-tiet/route.ts'))).replace("'http://127.0.0.1:19391/thoi-tiet'", "PAID_API + '/thoi-tiet'").replace('return Response.json(await r.json(), { status: r.status });', 'return Response.json(await r.json(),\n    { status: r.status });');

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.3', t: 'Route Handlers:<br>an API in the app folder', sub: 'route.ts exports GET, POST… and returns a Response. Measured: the methods you did not write, GET caching in 16 vs 14, a body straight into the database, and a key-hiding proxy',
    en: 'Lesson eleven point three: Route Handlers. A route dot ts file exports functions named after HTTP methods and returns a Response. We measure the methods you did not write, GET caching on Next.js sixteen versus fourteen, a request body straight into the database, and a proxy that hides an API key.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>route.ts</code>: a folder that answers with data — and the lesson's code, compiled</li>
    <li>Methods you did not export: 405, plus a free <code>HEAD</code> and <code>OPTIONS</code></li>
    <li>Is a <code>GET</code> handler cached? <b>Next.js 16: no</b> · Next.js 14: yes — measured on both</li>
    <li><code>request.json()</code> straight into <code>create()</code>: the caller picks the id</li>
    <li>The key-hiding proxy, and Route Handler vs Server Action</li></ul>`,
    en: 'Five takeaways: route dot ts as a folder that answers with data, and the lesson\'s code compiled; methods you did not export; whether a GET handler is cached — no on Next.js sixteen, yes on fourteen, measured on both; a request body straight into create, which lets the caller pick the id; and the key-hiding proxy, plus Route Handler versus Server Action.' },
  { t: 'A folder can be an endpoint instead of a page', body: two(D(tree(['src/app/api/', '  health/', '*    route.ts        // GET /api/health', '  posts/', '*    route.ts        // POST /api/posts', '  thoi-tiet/', '*    route.ts        // a key-hiding proxy'], { fs: 19 }),
      tn(['$ curl -i localhost:3000/api/health', ...HEALTH].join('\n'), { fs: 17, title: 'next start + curl (real)' })),
    D(seq(['caller', 'route.ts', 'data'], [[0, 1, 'GET /api/health'], [1, 1, 'GET()'], [1, 0, 'Response.json({ ok: true })', '#1f8a3b', true]], { w: 540, rh: 44, fs: 16, top: 56 }),
      box('page.tsx vs route.ts', 'The folder path is the URL, exactly like pages. A <code>page.tsx</code> returns <b>UI</b>; a <code>route.ts</code> returns a <b>Response</b> — JSON, a file, an RSS feed. You export functions named after HTTP methods; each gets a web-standard <code>Request</code>.', 'lam')), 'r64'),
    en: 'A folder can be an endpoint instead of a page. The folder path is the URL, exactly like pages, but route dot ts returns a Response instead of UI. You export functions named after HTTP methods, each receives a standard Request. Measured: curl gets two hundred, application JSON, and ok true.' },
  { t: 'The lesson\'s code, compiled: TS7006 and TS2304', body: two(D(tsx(BAI, { sm: true, hl: [6, 8] }),
      tn(['$ npx tsc --noEmit', ...TSC.map((l) => l.replace(/^src\/app\//, ''))].join('\n'), { fs: 14, wrap: 64, title: 'tsc (real) — the lesson\'s code in route.ts' })),
    D(tsx(POSTS, { sm: true, hl: [4, 6] }),
      box('Two fixes', 'Type the parameter: <code>request: Request</code>. And <code>db</code> must exist — here a real Prisma client on the lab\'s SQLite (<code>Note</code> instead of <code>post</code>). Then <code>tsc</code>: 0 errors.', 'xanh')), 'r64'),
    en: 'The lesson\'s code, copied into route dot ts: tsc reports TS seven oh oh six, parameter request implicitly has an any type, and TS two three oh four, cannot find name db. Two fixes: type the parameter as Request, and create the database client — here a real Prisma client on the lab\'s SQLite.' },
  { t: 'Measured: the methods you did not write', body: two(D(tn(['$ curl -X DELETE / HEAD / OPTIONS …/api/health', ...METH].join('\n'), { fs: 16, title: 'next start + curl (real)' }),
      box('Read it', 'The file exports only <code>GET</code>. <code>DELETE</code> ⇒ <b>405 Method Not Allowed</b>, automatically. <code>HEAD</code> answers 200 (Next derives it from GET). <code>OPTIONS</code> answers 204 with <code>Allow: GET, HEAD, OPTIONS</code>.', 'xanh')),
    cmp(['You export', 'Request', 'Next.js answers'], [
      ['<code>GET</code>', 'GET', '200 · your Response'], ['—', 'HEAD', '200 · same headers, no body'], ['—', 'OPTIONS', '204 · Allow header'], ['—', 'DELETE / POST / PUT', '<b>405</b>'],
    ]), 'r64'),
    en: 'The methods you did not write. The health file exports only GET. A DELETE gets four oh five, method not allowed, automatically. HEAD answers two hundred, derived from GET, and OPTIONS answers two oh four with an Allow header listing GET, HEAD and OPTIONS.' },
  { t: 'Is a GET handler cached? Next.js 16 vs 14 (measured)', body: tsx(NGAU_SRC, { sm: true }) + two(D(tn(['$ npm run build   # Next.js 16.4.6', ...B16, '$ curl /api/ngau-nhien ×2 · /api/ngau-nhien-tinh ×2', ...NGAU].join('\n'), { fs: 12, wrap: 78, title: 'Next.js 16.4.6 (real)' })),
    D(tn([`$ npx next --version · npm run build`, VER14, ...V14].join('\n'), { fs: 12, wrap: 64, title: 'the same file on Next.js 14.2.35 (real)' }),
      box('Read it', '<b>16</b>: a bare <code>GET</code> is <b>ƒ</b> — a new quote and time on every call; caching is opt-in (<code>dynamic = \'force-static\'</code> ⇒ ○, frozen). <b>14</b>: the same file is <b>○</b>, built once — same body forever. The lesson\'s trap is the 14 default.', 'do2')), 'r64'),
    en: 'Is a GET handler cached? It depends on the version, so we measured both. On Next.js sixteen, a bare GET is dynamic: a new random quote and a new time on every call; caching is opt-in with force-static, which builds it once. On fourteen point two, the very same file is static: built once, the same body forever. The lesson\'s trap describes the fourteen default.' },
  { t: 'POST: request.json() straight into the database', body: two(D(tn(POST.map((l) => l.replace(/\s+← /, '  ← ')).map((l, i) => ['$ POST {"title":"Bài mới"}', '$ POST {"id":999,"title":"tôi tự chọn id"}', '$ POST {"id":13,"title":"đè?"}', '$ POST {"title":"x","laAdmin":true}'][i] + '\n' + l).join('\n'), { fs: 15, title: 'curl -X POST /api/posts (real)' }),
      tn(PLOG.join('\n'), { fs: 15, title: 'server log (real)' })),
    D(box('Measured', 'Passing the whole body to <code>create({ data: body })</code> lets the <b>caller</b> decide the columns: it chose id <b>999</b> (201), collided with id 13 (<b>500</b> · unique constraint), and sent an unknown field (<b>500</b>). A 500 for bad input is your bug, not theirs.', 'do2'),
      box('Fix', 'Pick the fields you accept and validate them: <code>create({ data: { title: body.title } })</code>, or a schema with Zod (Chapter 16). Answer bad input with <b>400</b>.', 'xanh')), 'r64'),
    en: 'POST, with the request body passed straight to create. The caller decides the columns: it chose id nine nine nine and got two oh one, collided with id thirteen and got a five hundred for a unique constraint, and sent an unknown field — another five hundred. Pick the fields you accept, validate them, and answer bad input with four hundred.' },
  { t: 'page.tsx + route.ts in one folder: build error', body: two(D(tree(['src/app/trung/', '*  page.tsx     // UI', '*  route.ts     // a Response'], { fs: 22 }),
      tn(['$ npm run build', ...TRUNG].join('\n'), { fs: 16, wrap: 56, title: 'next build (real)' })),
    D(box('Why', 'One URL, one answer: a folder serves <b>either</b> HTML (<code>page.tsx</code>) <b>or</b> a Response (<code>route.ts</code>). Put the API under <code>app/api/…</code> and the page where users browse.', 'lam'),
      box('Same rule as 11.1', 'Two files claiming one URL is a build error, never a silent winner — read the build output.', '')), 'r64'),
    en: 'A folder cannot have both page dot tsx and route dot ts: next build fails with conflicting route and page. One URL, one answer — HTML or a Response. Put the API under app slash api and the pages where users browse.' },
  { t: 'When you actually need a Route Handler', body: icards([
      ['plug', 'Webhooks', 'Stripe, GitHub, a payment gateway need a URL to POST to — a real, public endpoint.'],
      ['page', 'Non-HTML', 'JSON for outside callers, an RSS feed, a file, an install script — with the right <code>Content-Type</code>.'],
      ['key', 'A key-hiding proxy', 'The browser needs data from a paid API; the key stays on the server.'],
      ['link', 'A client fetch target', 'A Client Component that fetches on interaction needs a URL to fetch from.'],
    ], 2) + box('Not for your own pages', 'A Server Component can query the database directly. Calling your own route from it is a network hop to your own process — and at build time nothing is listening (Lesson 10.1, measured: ECONNREFUSED).', 'do2'),
    en: 'When do you actually need one? Webhooks, because a third party needs a URL to POST to. Non-HTML responses: JSON for outside callers, an RSS feed, a file. A key-hiding proxy. And a target for a Client Component to fetch from. Not for your own pages: a Server Component queries the database directly — calling your own route fails at build, as lesson ten point one measured.' },
  { t: 'The key-hiding proxy, measured', body: two(D(tsx(TT, { sm: true, hl: [3] }),
      tn(KHOA.join('\n'), { fs: 13, wrap: 58, title: 'curl + grep + fake third-party API log (real)' })),
    D(B('thoi-tiet', { url: 'localhost:3000/thoi-tiet', h: 70, w: 520 }),
      cmp(['Network (real)', 'type', 'size'], AN('thoi-tiet').mang.filter((m) => /thoi-tiet/.test(m.url) || /19391/.test(m.url)).map((m) => [m.url.replace('http://127.0.0.1:19390', ''), m.loai, m.kt > 999 ? `${(m.kt / 1000).toFixed(1)} kB` : `${m.kt} B`]).concat([[`to :19391 (paid API)`, '—', `${AN('thoi-tiet').mang.filter((m) => /19391/.test(m.url)).length} req`]])),
      box('Read it', 'The browser calls <b>your</b> <code>/api/thoi-tiet</code>; the handler adds <code>x-api-key</code> from <code>process.env</code> (no <code>NEXT_PUBLIC_</code>). Direct call without the key: <b>401</b>. The key is in <b>0</b> files under <code>.next/static</code> — it never reaches the browser. Chromium: the only fetch goes to <code>/api/thoi-tiet</code>.', 'xanh')), ''),
    en: 'The key-hiding proxy, measured. The client page fetches its own slash api slash thoi-tiet; the handler calls the paid API with the key from process dot env. A direct call without the key gets four oh one. The key appears in zero files under dot next slash static, so it never reaches the browser, and Chromium\'s network tab shows a single request, to our own route.' },
  { t: 'Route Handler vs Server Action', body: cmp(['', 'Route Handler (this lesson)', 'Server Action (Chapter 12)'], [
      ['Who calls it', 'anyone with the URL: curl, a webhook, a mobile app, your client code', 'your own React — a form or a button, like a function'],
      ['Has a URL you wire up', 'yes — <code>app/api/…/route.ts</code>', 'no — Next.js wires it'],
      ['Typical use', 'webhooks, external clients, proxies, non-HTML', 'form submits and mutations from your UI'],
      ['Shared truth', 'a <b>public</b> endpoint: validate and authorize inside', 'also a public endpoint under the hood (12.5)'],
    ]) + box('Rule of thumb', '<b>Need a URL</b> ⇒ Route Handler. <b>Mutating from your own form</b> ⇒ Server Action.', 'lam'),
    en: 'Route Handler versus Server Action. Both run on the server; the difference is the caller. A Route Handler has a URL that anyone can hit — curl, a webhook, a mobile app. A Server Action is called from your own React like a function. Rule of thumb: need a URL, Route Handler; mutating from your own form, Server Action. Either way, validate and authorize inside.' },
  { t: 'cuongthai.com: every GET states its caching', body: two(tn([`$ find frontend/src/app -name route.ts | wc -l`, KHO_N, '$ (every route with a GET: its dynamic setting · its signature)', ...KHO_GET.map((l) => l.replace('request: NextRequest', 'req').replace(/ {3,}/g, '  '))].join('\n'), { fs: 13, wrap: 90, title: 'the course\'s own repo, Next.js 14.2 (real)' }),
    D(box('Read it', `${KHO_N} <code>route.ts</code>. Every <code>GET()</code> with no input states its mode — RSS feeds <code>force-dynamic</code>, install scripts <code>force-static</code>; the rest read <code>request</code>, which makes them dynamic on 14 too. Upgrading to 15+ changes nothing for them.`, 'xanh'),
      box('A real bug', 'A frontend proxy once forwarded to a backend <code>/auth/refresh</code> that did not exist — every call failed though the cookie was present. A proxy is only as correct as the URL it forwards to: check the downstream route exists.', 'do2')), 'r64'),
    en: 'On this course\'s own site there are thirty route dot ts files. Every GET with no input states its mode explicitly — the RSS feeds are force-dynamic, the install scripts are force-static — and the rest read the request, which makes them dynamic even on fourteen. So upgrading changes nothing for them. And a real bug: a proxy once forwarded to a backend refresh route that did not exist.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Route Handler', 'route.ts exporting GET, POST…'), kw('Request / Response', 'the web-standard objects in and out'),
      kw('405', 'a method you did not export'), kw('HEAD · OPTIONS', 'answered for you'),
      kw('force-static', 'opt a GET into build-time caching (16)'), kw('Mass assignment', 'body straight into create(): the caller picks columns'),
      kw('Key-hiding proxy', 'the secret stays in process.env'), kw('vs Server Action', 'URL for anyone vs function for your UI'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Route Handler; Request and Response; four oh five; HEAD and OPTIONS answered for you; force-static; mass assignment; the key-hiding proxy; and Route Handler versus Server Action.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Create ${c('app/api/health/route.ts')} with a typed ${c('GET')}; ${c('curl -i')} it, then ${c('-X DELETE')} and ${c('-X OPTIONS')}`,
      `Build: is it ○ or ƒ? Add ${c("dynamic = 'force-static'")} and compare two calls`,
      `Add a ${c('POST')} that echoes ${c('await request.json()')}; then accept only the fields you need`,
      `Put the key of a fake API in ${c('.env.local')}, proxy it, ${c('grep')} ${c('.next/static')} for it`,
    ]), box('Keep these', `<ul><li><code>route.ts</code> = a Response, not UI</li><li>Not exported ⇒ 405; HEAD/OPTIONS free</li><li>16: GET is live; caching is opt-in</li><li>Never <code>create({ data: body })</code></li><li>Need a URL ⇒ Route Handler</li></ul>`, 'lam'), ''),
    en: 'Your turn: create a typed health GET and curl it, then try DELETE and OPTIONS; build and read the symbol, then add force-static and compare; add a POST that echoes the body and then accept only the fields you need; and proxy a fake API with its key in dot env dot local, then grep the static folder for it. Keep: a route returns a Response; not exported means four oh five; on sixteen GET is live; never pass the body straight to create; need a URL, use a Route Handler.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Advanced routing', bai: '11.3' }, S);
