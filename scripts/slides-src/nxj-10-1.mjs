/*DU_LIEU*/
const DU_LIEU = {
 "n10-1:file:dem.mjs": "// dem.mjs — hỏi API giả: mỗi URL đã bị gọi bao nhiêu lần (rồi xoá bộ đếm nếu có cờ --xoa)\nconst dem = await (await fetch('http://127.0.0.1:19385/dem')).json();\nfor (const [url, n] of Object.entries(dem).sort()) console.log(`${String(n).padStart(3)} lượt  ${url}`);\nif (process.argv.includes('--xoa')) await fetch('http://127.0.0.1:19385/dat-lai');\n",
 "n10-1:api": "$ curl -s 127.0.0.1:19385/khoa-hoc\n[{\"id\":1,\"ten\":\"React\"},{\"id\":2,\"ten\":\"Next.js\"},{\"id\":3,\"ten\":\"Node.js\"}]",
 "n10-1:file:src/app/khoa-hoc/page.tsx": "// app/khoa-hoc/page.tsx — một Server Component (đúng đoạn mã của bài, chỉ đổi URL sang API giả của lab)\ntype KhoaHoc = { id: number; ten: string };\n\nexport default async function KhoaHocPage() {\n  const res = await fetch('http://127.0.0.1:19385/khoa-hoc?ms=600');\n  const ds: KhoaHoc[] = await res.json();\n  return <DanhSach items={ds} />;\n}\n\nfunction DanhSach({ items }: { items: KhoaHoc[] }) {\n  return (\n    <ul id=\"ds\" className=\"list-disc p-4 pl-8 font-sans\">\n      {items.map((k) => <li key={k.id}>{k.ten}</li>)}\n    </ul>\n  );\n}\n",
 "n10-1:file:src/app/khoa-hoc-client/page.tsx": "'use client';\n// cách của Chương 5: tải dữ liệu TRONG trình duyệt bằng useEffect\nimport { useEffect, useState } from 'react';\n\ntype KhoaHoc = { id: number; ten: string };\n\nexport default function KhoaHocClient() {\n  const [ds, setDs] = useState<KhoaHoc[] | null>(null);\n  useEffect(() => {\n    let boQua = false;\n    fetch('http://127.0.0.1:19385/khoa-hoc?ms=600')\n      .then((r) => r.json())\n      .then((d) => { if (!boQua) setDs(d); });\n    return () => { boQua = true; };\n  }, []);\n  if (!ds) return <p id=\"tai\" className=\"p-4 font-sans\">Đang tải…</p>;\n  return (\n    <ul id=\"ds\" className=\"list-disc p-4 pl-8 font-sans\">\n      {ds.map((k) => <li key={k.id}>{k.ten}</li>)}\n    </ul>\n  );\n}\n",
 "n10-1:trang": "$ npm run build\n✓ Compiled successfully in 2.1s\nRoute (app)\n├ ○ /khoa-hoc\n└ ○ /khoa-hoc-client\n○  (Static)  prerendered as static content\n$ (log API giả — trong lúc npm run build)\n  [api] 21:34:29.127 GET /khoa-hoc · lượt #1 · chờ 0 ms\n  [api] 21:34:33.729 GET /khoa-hoc?ms=600 · lượt #1 · chờ 600 ms",
 "n10-1:file:ban/khoa-hoc-dong.tsx": "// app/khoa-hoc/page.tsx — thêm MỘT dòng: render theo từng request\nimport { connection } from 'next/server';\n\ntype KhoaHoc = { id: number; ten: string };\n\nexport default async function KhoaHocPage() {\n  await connection();                       // chờ có request thật rồi mới render (bài 10.2 nói kỹ)\n  const res = await fetch('http://127.0.0.1:19385/khoa-hoc?ms=600');\n  const ds: KhoaHoc[] = await res.json();\n  return <DanhSach items={ds} />;\n}\n\nfunction DanhSach({ items }: { items: KhoaHoc[] }) {\n  return (\n    <ul id=\"ds\" className=\"list-disc p-4 pl-8 font-sans\">\n      {items.map((k) => <li key={k.id}>{k.ten}</li>)}\n    </ul>\n  );\n}\n",
 "n10-1:file:src/app/trung/du-lieu.ts": "import axios from 'axios';\nimport { cache } from 'react';\n\nconst API = 'http://127.0.0.1:19385';\n\n// 1) fetch — Next.js tự gộp các lời gọi GET giống hệt trong MỘT lần render\nexport async function layBangFetch() {\n  return (await fetch(`${API}/nguoi-dung?qua=fetch`)).json();\n}\n\n// 2) axios — không đi qua fetch ⇒ không ai gộp (client CSDL như Prisma cũng vậy)\nexport async function layBangAxios() {\n  return (await axios.get(`${API}/nguoi-dung?qua=axios`)).data;\n}\n\n// 3) axios bọc trong cache() của React ⇒ gộp lại, chỉ trong một request\nexport const layBangCache = cache(async () => {\n  return (await axios.get(`${API}/nguoi-dung?qua=cache`)).data;\n});\n",
 "n10-1:file:src/app/trung/layout.tsx": "import { layBangFetch, layBangAxios, layBangCache } from './du-lieu';\n\nexport default async function TrungLayout({ children }: { children: React.ReactNode }) {\n  const [a] = await Promise.all([layBangFetch(), layBangAxios(), layBangCache()]);\n  return (\n    <section className=\"p-4 font-sans\">\n      <p>layout: xin chào {a.ten}</p>\n      {children}\n    </section>\n  );\n}\n",
 "n10-1:file:src/app/trung/page.tsx": "import { connection } from 'next/server';\nimport { layBangFetch, layBangAxios, layBangCache } from './du-lieu';\n\nasync function The({ so }: { so: number }) {\n  const [a] = await Promise.all([layBangFetch(), layBangAxios(), layBangCache()]);\n  return <p>thẻ {so}: {a.ten}</p>;\n}\n\nexport default async function TrungPage() {\n  await connection();\n  return (\n    <>\n      <The so={1} />\n      <The so={2} />\n    </>\n  );\n}\n",
 "n10-1:file:src/app/ho-so/noi-tiep/page.tsx": "import { connection } from 'next/server';\n\nconst lay = async (p: string) => (await fetch('http://127.0.0.1:19385' + p)).json();\n\nexport default async function NoiTiep() {\n  await connection();\n  const user = await lay('/nguoi-dung');               // 300 ms\n  const posts = await lay(`/bai-viet?u=${user.id}`);   // 300 ms — cần user.id\n  const stats = await lay(`/thong-ke?u=${user.id}`);   // 300 ms — cũng chỉ cần user.id\n  return <p className=\"p-4 font-sans\">{user.ten}: {posts.length} bài, {stats.binhLuan} bình luận</p>;\n}\n",
 "n10-1:file:src/app/ho-so/song-song/page.tsx": "import { connection } from 'next/server';\n\nconst lay = async (p: string) => (await fetch('http://127.0.0.1:19385' + p)).json();\n\nexport default async function SongSong() {\n  await connection();\n  const user = await lay('/nguoi-dung');               // 300 ms — hai cái sau cần nó\n  const [posts, stats] = await Promise.all([           // hai cái độc lập: chạy CÙNG LÚC\n    lay(`/bai-viet?u=${user.id}`),\n    lay(`/thong-ke?u=${user.id}`),\n  ]);\n  return <p className=\"p-4 font-sans\">{user.ten}: {posts.length} bài, {stats.binhLuan} bình luận</p>;\n}\n",
 "n10-1:dong": "$ npm run build\n✓ Compiled successfully in 519ms\nRoute (app)\n├ ƒ /ho-so/noi-tiep\n├ ƒ /ho-so/song-song\n├ ƒ /khoa-hoc\n├ ○ /khoa-hoc-client\n└ ƒ /trung\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n10-1:mo": "$ for i in 1 2 3; do curl -s -o /dev/null -w \"lần $i: %{time_total} s\\n\" localhost:19386/khoa-hoc; done\nlần 1: 0.660501 s\nlần 2: 0.611318 s\nlần 3: 0.612972 s\n$ curl -s localhost:19386/khoa-hoc | grep -o '<ul id=\"ds\".*</ul>'\n<ul id=\"ds\" class=\"list-disc p-4 pl-8 font-sans\"><li>React</li><li>Next.js</li><li>Node.js</li></ul>\n$ node dem.mjs --xoa\n  4 lượt  /khoa-hoc?ms=600",
 "n10-1:client": "$ for i in 1 2 3; do curl -s -o /dev/null -w \"lần $i: %{time_total} s\\n\" localhost:19386/khoa-hoc-client; done\nlần 1: 0.010531 s\nlần 2: 0.002567 s\nlần 3: 0.002066 s\n$ curl -s localhost:19386/khoa-hoc-client | grep -o '<p id=\"tai\"[^<]*</p>'\n<p id=\"tai\" class=\"p-4 font-sans\">Đang tải…</p>\n$ curl -s localhost:19386/khoa-hoc-client | grep -c '<li>'\n0\n$ node dem.mjs --xoa",
 "n10-1:trung": "$ curl localhost:3000/trung   (2 request — mỗi request: layout + 2 thẻ = 3 chỗ gọi mỗi kiểu)\n<p>layout: xin chào An</p>\n<p>thẻ 1: An</p>\n<p>thẻ 2: An</p>\n$ node dem.mjs --xoa\n  6 lượt  /nguoi-dung?qua=axios\n  2 lượt  /nguoi-dung?qua=cache\n  2 lượt  /nguoi-dung?qua=fetch",
 "n10-1:thac": "$ curl -s localhost:19386/ho-so/noi-tiep | grep -o '<p class[^/]*' | sed 's/<!-- -->//g; s/.*>//'\nAn: 2 bài, 15 bình luận<\n$ (log API giả — nối tiếp)\n  [api] 21:34:47.740 GET /nguoi-dung · lượt #1 · chờ 300 ms\n  [api] 21:34:48.044 GET /bai-viet?u=7 · lượt #1 · chờ 300 ms\n  [api] 21:34:48.346 GET /thong-ke?u=7 · lượt #1 · chờ 300 ms\n$ curl -s -o /dev/null localhost:19386/ho-so/song-song\n$ (log API giả — song song)\n  [api] 21:34:48.679 GET /nguoi-dung · lượt #2 · chờ 300 ms\n  [api] 21:34:48.983 GET /bai-viet?u=7 · lượt #2 · chờ 300 ms\n  [api] 21:34:48.983 GET /thong-ke?u=7 · lượt #2 · chờ 300 ms\n$ for p in noi-tiep song-song; do for i in 1 2 3; do curl -s -o /dev/null -w \"$p lần $i: %{time_total} s\\n\" localhost:19386/ho-so/$p; done; done\nnoi-tiep lần 1: 0.915194 s\nnoi-tiep lần 2: 0.915998 s\nnoi-tiep lần 3: 0.911808 s\nsong-song lần 1: 0.610796 s\nsong-song lần 2: 0.610415 s\nsong-song lần 3: 0.628488 s",
 "n10-1:file:src/app/api/khoa-hoc/route.ts": "// app/api/khoa-hoc/route.ts — một route API ngay trong app (Chương 11)\nexport async function GET() {\n  return Response.json([{ id: 1, ten: 'React' }, { id: 2, ten: 'Next.js' }]);\n}\n",
 "n10-1:file:src/app/vong/page.tsx": "// Server Component gọi route API của CHÍNH app này qua HTTP\nexport default async function Vong() {\n  const ds = await (await fetch('http://localhost:19386/api/khoa-hoc')).json();\n  return <ul>{ds.map((k: { id: number; ten: string }) => <li key={k.id}>{k.ten}</li>)}</ul>;\n}\n",
 "n10-1:vong": "$ npm run build   (trang /vong gọi route API của chính nó)\nError occurred prerendering page \"/vong\". Read more: https://nextjs.org/docs/messages/prerender-error\nTypeError: fetch failed\n  [cause]: AggregateError: \n    code: 'ECONNREFUSED',\n      Error: connect ECONNREFUSED ::1:19386",
 "n10-1:dung": "",
 "anh-nxj-10-1:server": {
  "url": "http://127.0.0.1:19386/khoa-hoc",
  "vp": [
   640,
   130
  ],
  "rect": {
   "#ds": [
    0,
    0,
    640,
    104
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19386/khoa-hoc",
    "ma": 200,
    "loai": "document",
    "kt": 6746
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/373pxjjsxieor.js",
    "ma": 200,
    "loai": "script",
    "kt": 181719
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "do": "{\"html\":613,\"api\":0}"
  }
 },
 "anh-nxj-10-1:server-tat-js": {
  "url": "http://127.0.0.1:19386/khoa-hoc",
  "vp": [
   640,
   130
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19386/khoa-hoc",
    "ma": 200,
    "loai": "document",
    "kt": 6746
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   }
  ],
  "console": []
 },
 "anh-nxj-10-1:client": {
  "url": "http://127.0.0.1:19386/khoa-hoc-client",
  "vp": [
   640,
   130
  ],
  "rect": {
   "#ds": [
    0,
    0,
    640,
    104
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19386/khoa-hoc-client",
    "ma": 200,
    "loai": "document",
    "kt": 7279
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/2e162_u-95o-0.js",
    "ma": 200,
    "loai": "script",
    "kt": 578
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/373pxjjsxieor.js",
    "ma": 200,
    "loai": "script",
    "kt": 181719
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19385/khoa-hoc?ms=600",
    "ma": 200,
    "loai": "fetch",
    "kt": 74
   }
  ],
  "console": [],
  "ketQua": {
   "do": "{\"html\":3,\"api\":[[46,651]]}"
  }
 },
 "anh-nxj-10-1:client-tat-js": {
  "url": "http://127.0.0.1:19386/khoa-hoc-client",
  "vp": [
   640,
   130
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19386/khoa-hoc-client",
    "ma": 200,
    "loai": "document",
    "kt": 7279
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/1w30zog-ad0lh.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14646
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   }
  ],
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, icards, gantt, path, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-10-1', code: 'NXJ 10.1', title: 'Fetch where the data lives: async Server Components', sub: 'Chapter 10 · Lesson 10.1' };
const O = (k) => { const v = DU_LIEU[`n10-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-10-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-10-1', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ app\//.test(l)).join('\n');            // bỏ dòng chú thích tên tệp ở đầu
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');                                          // bỏ chú thích cuối dòng
const KB = (n) => n.toLocaleString('en-US');

// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const BUILD1 = lay('trang', /^[┌├└○ƒ]/);
const LOG_BUILD = lay('trang', /ms=600/).trim().replace(/ · lượt.*$/gm, '');
const BUILD2 = lay('dong', /khoa-hoc|trung|ho-so|Static|Dynamic|Route/);
const T_MO = doan('mo', 'time_total'), T_CL = doan('client', 'time_total');
const TRUNG = doan('trung', 'node dem.mjs');
const so = (re) => Number((TRUNG.find((l) => re.test(l)) ?? '').trim().split(' ')[0]);
const N_FETCH = so(/qua=fetch/), N_AXIOS = so(/qua=axios/), N_CACHE = so(/qua=cache/);
const LOG_NOI = doan('thac', 'nối tiếp'), LOG_SONG = doan('thac', 'song song');
const ms = (l) => { const m = /(\d\d):(\d\d):(\d\d)\.(\d{3})/.exec(l); return ((+m[1] * 60 + +m[2]) * 60 + +m[3]) * 1000 + +m[4]; };
const moc = (ls) => { const a = ls.map(ms), t0 = a[0]; return a.map((x) => x - t0); };
const MN = moc(LOG_NOI), MS = moc(LOG_SONG);
const TG = doan('thac', 'for p in');
const tb = (p) => { const a = TG.filter((l) => l.startsWith(p)).map((l) => parseFloat(l.split(': ')[1])); return a.reduce((s, x) => s + x, 0) / a.length; };
const T_NOI = tb('noi-tiep'), T_SONG = tb('song-song');
const DO_SV = JSON.parse(AN('server').ketQua.do), DO_CL = JSON.parse(AN('client').ketQua.do);
const js = (k) => AN(k).mang.filter((m) => m.loai === 'script').reduce((s, m) => s + m.kt, 0);
if (!/○ \/khoa-hoc$/m.test(BUILD1) || !/ƒ \/khoa-hoc$/m.test(BUILD2) || !O('dong').includes('tsc: 0 lỗi')) throw new Error('bảng route 10.1 đổi');
if (N_FETCH !== 2 || N_AXIOS !== 6 || N_CACHE !== 2) throw new Error('số đo gộp 10.1 đổi');
if (!(T_NOI > 0.85 && T_SONG < 0.7) || MN[1] < 280 || MS[1] !== MS[2]) throw new Error('số đo thác nước 10.1 đổi');
if (DO_SV.api !== 0 || DO_CL.api.length !== 1 || !O('vong').includes('ECONNREFUSED') || !O('client').includes('Đang tải')) throw new Error('số đo trình duyệt 10.1 đổi');
const [AP0, AP1] = DO_CL.api[0];

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.1', t: 'Fetch where the data lives:<br>async Server Components', sub: 'Mark the component async and await the data in its body. Measured: when it runs, what the user sees, what gets deduplicated — and the waterfall',
    en: 'Lesson ten point one: fetch where the data lives. A Server Component can be async, so you await the data right in its body. We measure when it runs, what the user actually sees, which calls get deduplicated, and the waterfall trap.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The default way to load page data: <code>async</code> component + <code>await</code> — no <code>useEffect</code>, no loading flag</li>
    <li><b>When</b> that await runs: at <code>next build</code> for a static page, on every request for a dynamic one</li>
    <li>Measured in Chromium: server await vs the Chapter 5 client fetch — what the screen shows, and when</li>
    <li>Deduplication: which calls Next.js merges for you, and which it does not (<code>axios</code>, a DB client)</li>
    <li>The waterfall (sequential awaits) and the "call my own API route" trap — both measured</li></ul>`,
    en: 'Five takeaways: the default way to load page data is an async component that awaits; when that await runs — at build time for a static page, on every request for a dynamic one; measured in Chromium, server await versus the chapter five client fetch; which calls Next.js deduplicates and which it does not; and two traps, the waterfall and calling your own API route — both measured.' },
  { t: 'Chapter 5 vs now: what is in the HTML?', body: two(D(B('client-tat-js', { vp: 640, h: 110, w: 540, url: 'HTML of /khoa-hoc-client (JS off) — Chapter 5 way' }),
      box('Client fetch (useEffect)', 'The HTML holds only <b>"Đang tải…"</b> (loading). The list appears after JS downloads, runs the effect, and the browser calls the API: <b>three states</b> you must code — empty, loading, filled (+ the race guard of 5.5).', 'do2')),
    D(B('server-tat-js', { vp: 640, h: 110, w: 540, url: 'HTML of /khoa-hoc (JS off) — async Server Component' }),
      box('Server await', 'The HTML <b>already contains</b> the three courses. No effect, no <code>loading</code> flag, no race: <b>one state</b>. Content is there for SEO and the first paint.', 'xanh')), '') +
    cmp(['', 'Client fetch (Chapter 5)', 'async Server Component'], [
      ['States you code', 'empty → loading → filled (+ error, + race guard)', '<b>one</b>: the finished list'],
      ['Who calls the API', 'every visitor\'s browser (API public + CORS)', 'your server (the API can stay private)'],
    ], { hl: [0] }),
    en: 'Chapter five versus now, by looking at the HTML itself with JavaScript off. The client-fetch page sends only the word loading; the list appears after the JavaScript runs the effect and calls the API — three states to code. The async Server Component sends HTML that already contains the three courses: one state, ready for SEO and the first paint.' },
  { t: 'The lesson\'s code — and WHEN it runs', body: two(tsx(bo(F('src/app/khoa-hoc/page.tsx')), { sm: true, hl: [3, 4, 5, 6] }),
      D(tn(BUILD1 + '\n\n# API log, during npm run build:\n' + LOG_BUILD, { fs: 15, title: 'npm run build (real)' }),
        box('"Before the HTML is sent" = at build time here', 'Nothing in this page depends on the request, so Next.js renders it <b>once, during <code>next build</code></b> (○ Static): the API was called by the build. Later visitors get that HTML — the API is not called again (lesson 10.2 measures this).', 'lam')), 'r64'),
    en: 'This is the lesson code: an async component that awaits fetch, then renders the list. Build it and look at the API log: the request arrived during npm run build. The page does not depend on the request, so Next.js rendered it once at build time — the route is marked static. Before the HTML is sent here means at build time; later visitors get that HTML without calling the API again.' },
  { t: 'One line makes it run on every request', body: two(tsx(goc(bo(F('ban/khoa-hoc-dong.tsx'))).split('\n').slice(0, 11).join('\n'), { sm: true, hl: [1, 6] }),
      D(tn(lay('dong', /ƒ \/khoa-hoc$|Dynamic/) + '\n$ curl … /khoa-hoc  ×3   (API waits 600 ms)\n' + T_MO.join('\n'), { fs: 15, title: 'build + curl (real)' }),
        box('ƒ Dynamic: the server waits, then answers', `<code>await connection()</code> says "render per request". Each curl took ≈ <b>0.6 s</b> — the API delay.`, 'xanh')), 'r64') +
    tn('$ curl -s localhost:19386/khoa-hoc | grep -o \'<ul id="ds".*</ul>\'\n' + doan('mo', 'grep -o')[0], { fs: 15, title: 'the answer already contains the list (real)' }),
    en: 'One line makes it run on every request: await connection. Now the route is dynamic, marked f. Each curl takes about point six seconds — exactly the API delay — and the HTML that comes back already contains the list. The server waits, then answers with finished HTML.' },
  { t: 'Measured in Chromium: same wait, different screen', body: gantt([
      ['server: HTML (list inside)', 0, DO_SV.html, '#0070f3', `first byte at ${DO_SV.html} ms`],
      ['client: HTML ("Đang tải…")', 0, Math.max(DO_CL.html, 6), '#64748b', `${DO_CL.html} ms`],
      ['client: JS, then fetch → API', AP0, AP1, '#c2410c', `list at ${AP1} ms`],
    ], { w: 1110, rh: 54, nhan: 330, buoc: 100, max: 700 }) +
    two(box('Async Server Component', `The screen stays on the previous page / blank until <b>${DO_SV.html} ms</b>, then shows everything at once. The browser made <b>${DO_SV.api}</b> requests to the API. Long waits are fixed by <b>streaming</b> (10.4), not by going back to <code>useEffect</code>.`, 'lam'),
      box('Client fetch', `"Đang tải…" after ${DO_CL.html} ms, the list after <b>${AP1} ms</b> — about the same total. But the browser itself calls the API: it must be public + allow CORS, and the client chunk adds JS (+${KB(js('client') - js('server'))} B).`, 'cam'), ''),
    en: 'Measured in a real Chromium. The server version: the first byte arrives at about six hundred milliseconds, with the list inside — until then the screen shows nothing new. The client version: loading appears almost instantly, then the browser downloads JavaScript and calls the API itself; the list shows up at about six hundred fifty milliseconds. About the same total wait, different screen. The server version makes zero API calls from the browser; long waits are fixed by streaming in lesson ten point four, not by going back to useEffect.' },
  { t: 'When you still fetch on the client', body: icards([
      ['page', 'Initial page data → server', 'Whatever the page needs to render the first time: lists, a profile, an article. <code>await</code> it in a Server Component.'],
      ['pulse', 'Interaction-driven → client', 'Data that depends on what the user does after the page loaded: search-as-you-type, infinite scroll, live updates, anything tied to client state.'],
      ['loop', 'Better than a bare effect', 'For client data use a library — TanStack Query (Chapter 14) — instead of hand-written <code>useEffect</code> + race guard (5.5).'],
    ], 3) + box('The rule', '<b>Initial page data → server. Interaction-driven data → client.</b> Most pages need only the first; many need a little of both.', 'lam'),
    en: 'When do you still fetch on the client? The rule: initial page data goes to the server — lists, a profile, an article. Interaction-driven data goes to the client — search as you type, infinite scroll, live updates. And for that client data, a library like TanStack Query in chapter fourteen beats a hand-written effect with a race guard.' },
  { t: 'Deduplication, measured: fetch yes, axios no', body: two(tsx(goc(F('src/app/trung/du-lieu.ts')).split('\n').filter((l) => !/^\/\/ /.test(l.trim())).join('\n').replace(/\n{3,}/g, '\n\n'), { sm: true, hl: [6, 10, 14] }),
      D(cmp(['Called 3× per request (layout + 2 cards)', 'API hits, 2 requests'], [
        ['<code>fetch</code> GET, same URL', `<b>${N_FETCH}</b> — merged to 1 per request`],
        ['<code>axios</code> (not fetch)', `<b>${N_AXIOS}</b> — 3 per request`],
        ['<code>cache(axios…)</code> from React', `<b>${N_CACHE}</b> — merged again`],
      ], { hl: [1] }), box('Only fetch is merged automatically', 'Next.js memoizes identical <code>fetch</code> GETs during one render. A DB client (Prisma), <code>axios</code>, an SDK: <b>not</b> merged — wrap the function in React <code>cache()</code>. Scope: one request only.', 'do2')), 'r64'),
    en: 'Deduplication, measured. The same data is requested three times per request: in the layout and in two cards. With fetch, the API was hit twice for two requests — merged to one per request. With axios, six times — nothing merged. Wrapping the axios call in React cache brings it back to two. So only fetch is merged automatically; a database client like Prisma, axios or an SDK need React cache, and that merge lasts one request.' },
  { t: 'The waterfall: sequential awaits, measured', body: two(D(tsx(goc(F('src/app/ho-so/noi-tiep/page.tsx')).split('\n').slice(6, 9).join('\n').replace(/^  /gm, ''), { sm: true }),
      tsx(goc(F('src/app/ho-so/song-song/page.tsx')).split('\n').slice(6, 11).join('\n').replace(/^  /gm, ''), { sm: true, hl: [2] })),
    D(gantt([
      ['seq: user', MN[0], MN[0] + 300, '#64748b'], ['seq: posts(user.id)', MN[1], MN[1] + 300, '#c2410c'], ['seq: stats(user.id)', MN[2], MN[2] + 300, '#c2410c', `${Math.round(T_NOI * 1000)} ms`],
      ['par: user', MS[0], MS[0] + 300, '#64748b'], ['par: posts', MS[1], MS[1] + 300, '#1f8a3b'], ['par: stats', MS[2], MS[2] + 300, '#1f8a3b', `${Math.round(T_SONG * 1000)} ms`],
    ], { w: 560, nhan: 200, rh: 46, fs: 16, buoc: 300, max: 1000 }),
      box('Sum vs max', `Each API call waits 300 ms. Three awaits in a row: the page took <b>${T_NOI.toFixed(2)} s</b> (3 runs, average). Only <code>posts</code> and <code>stats</code> need <code>user</code> — start them together: <b>${T_SONG.toFixed(2)} s</b>.`, 'xanh')), ''),
    en: 'The waterfall, measured with an API that waits three hundred milliseconds per call. Three awaits in a row: the API log shows each call starting only after the previous one finished, and the page takes about point nine one seconds. Posts and stats only need the user, not each other — start them together with Promise all, and the page takes point six one. Sequential awaits cost the sum; parallel ones cost the slowest.' },
  { t: 'Talk to the data directly — not to your own API route', body: path([{ t: 'Server Component', s: 'already on the server' }, { t: 'HTTP to localhost', s: 'own process', mau: '#b91c1c', on: true }, { t: 'route.ts', s: 'same app' }, { t: 'DB / file', s: 'the data', mau: '#1f8a3b' }], { nhan: ['fetch', 'handler', 'query'], h: 104, fs: 18 }) +
    tsx(goc(F('src/app/vong/page.tsx')).split('\n').filter((l) => !l.startsWith('//')).join('\n')
      .replace('  return <ul>{ds.map(', '  return <ul>{ds.map(\n    ').replace(') => <li', ') =>\n      <li'), { sm: true, hl: [2] }) +
    tn(lay('vong', /Error occurred|fetch failed|ECONNREFUSED|connect/), { fs: 14, title: 'npm run build (real)' }) +
    box('Why it breaks, and the fix', 'At build time there is <b>no server listening</b> to answer it — the build fails. At runtime it works, but it is a network hop back into your own process. Call the function the route uses (or <code>db.course.findMany()</code>) directly.', 'do2'),
    en: 'Talk to the data directly, not to your own API route. A Server Component is already on the server; fetching your own route handler over HTTP is a hop back into your own process. Measured: the build fails while prerendering — fetch failed, connection refused — because no server is listening during the build. Call the function the route uses, or query the database directly.' },
  { t: 'Cheat sheet: loading data in a Server Component', body: cmp(['', 'What happens', 'Measured here'], [
      ['<code>await fetch()</code> in the body', 'HTML arrives with the data inside', 'curl: list in the HTML'],
      ['…on a page that does not depend on the request', 'runs once, at <code>next build</code> (○)', 'API hit during the build'],
      ['…with <code>await connection()</code>', 'runs on every request (ƒ)', '≈ 0.6 s = API delay'],
      ['same <code>fetch</code> GET 3× in one request', 'merged to 1', `${N_FETCH} hits / 2 requests`],
      ['<code>axios</code> / DB client 3×', 'NOT merged — use <code>cache()</code>', `${N_AXIOS} vs ${N_CACHE}`],
      ['independent awaits in a row', 'waterfall: sum of waits', `${T_NOI.toFixed(2)} s vs ${T_SONG.toFixed(2)} s`],
      ['fetch your own <code>/api</code> route', 'build fails (nobody listening)', 'ECONNREFUSED'],
    ], { hl: [4, 5] }),
    en: 'The cheat sheet. Await fetch in the body and the HTML arrives with the data. If the page does not depend on the request, that runs once at build time; with await connection it runs on every request. The same fetch three times in one request is merged to one; axios or a database client is not, unless you use cache. Independent awaits in a row cost the sum. And fetching your own API route breaks the build.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('async component', 'a Server Component that awaits data in its body'), kw('Server fetch', 'data fetched on the server before the HTML leaves'),
      kw('No effect needed', 'initial data without useEffect or a loading flag'), kw('Build-time render (○)', 'a page with no request data renders once, at next build'),
      kw('connection()', 'next/server: wait for a real request ⇒ render per request (ƒ)'), kw('Request memoization', 'identical fetch GETs in one render become one call'),
      kw('React cache()', 'memoize any async function (axios, Prisma) for one request'), kw('Waterfall', 'independent awaits in a row: total = sum'),
      kw('Promise.all', 'start independent calls together: total = slowest'), kw('Co-located data', 'fetch in the component that renders it'),
    ].join('')}</div>`,
    en: 'Key terms: async component; server fetch; no effect needed; build-time render; connection; request memoization; React cache; waterfall; Promise all; and co-located data.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write an ${c('async')} page that ${c('await')}s a ${c('fetch')}; build it: is it ○ or ƒ? Did your API get a request during the build?`,
      `Add ${c('await connection()')}; time it with ${c('curl -w "%{time_total}"')}`,
      `Call the same data in a layout and a page: count API hits with ${c('fetch')}, then with ${c('axios')}, then with ${c('cache()')}`,
      `Write three awaits in a row, time it, fix it with ${c('Promise.all')}`,
    ]), box('Keep these', `<ul><li>Initial data: <code>await</code> in a Server Component</li><li>Static page ⇒ the await ran at build time</li><li>Only <code>fetch</code> is merged; else <code>cache()</code></li><li>Independent awaits ⇒ <code>Promise.all</code></li><li>Never fetch your own <code>/api</code> from the server</li></ul>`, 'lam'), ''),
    en: 'Your turn: write an async page that awaits a fetch, build it and check whether it is static and whether your API was called during the build; add await connection and time it with curl; request the same data in a layout and a page and count API hits with fetch, axios and cache; then write three awaits in a row, time it, and fix it with Promise all. Keep: initial data is awaited in a Server Component; a static page awaited at build time; only fetch is merged; independent awaits go in Promise all; and never fetch your own API route from the server.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Data fetching, caching and revalidating', bai: '10.1' }, S);
