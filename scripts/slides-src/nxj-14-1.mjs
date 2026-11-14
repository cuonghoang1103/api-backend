/*DU_LIEU*/
const DU_LIEU = {
 "n14-1:file:src/app/sai/bai.tsx": "'use client';\n// app/sai/bai.tsx — đoạn mã của bài, chép nguyên rồi bọc vào một component\nimport { useEffect, useState } from 'react';\n\nexport function DanhSachCuaBai() {\n  const [posts, setPosts] = useState([]);\n  useEffect(() => { fetch('/api/posts').then(r => r.json()).then(setPosts); }, []);\n  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}\n",
 "n14-1:bai": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/sai/bai.tsx(8,43): error TS2339: Property 'id' does not exist on type 'never'.\nsrc/app/sai/bai.tsx(8,50): error TS2339: Property 'title' does not exist on type 'never'.\n$ sửa: useState<Post[]>([])  (Post = { id: number; title: string })\ntsc: 0 lỗi",
 "n14-1:file:src/app/sai/DemBai.tsx": "'use client';\n// app/sai/DemBai.tsx — ô đếm ở đầu trang: TỰ fetch, TỰ giữ bản sao của mình\nimport { useEffect, useState } from 'react';\nimport type { Post } from '@/lib/kho';\n\nexport function DemBai() {\n  const [posts, setPosts] = useState<Post[]>([]);\n  useEffect(() => { fetch('/api/posts').then((r) => r.json()).then(setPosts); }, []);\n  return <p id=\"dem\" className=\"font-bold\">{posts.length} bài</p>;\n}\n",
 "n14-1:file:src/app/sai/DanhSach.tsx": "'use client';\n// app/sai/DanhSach.tsx — danh sách + ô thêm: một bản sao THỨ HAI, sửa tay sau khi ghi\nimport { useEffect, useState } from 'react';\nimport type { Post } from '@/lib/kho';\n\nexport function DanhSach() {\n  const [posts, setPosts] = useState<Post[]>([]);\n  const [title, setTitle] = useState('');\n  useEffect(() => { fetch('/api/posts').then((r) => r.json()).then(setPosts); }, []);\n\n  async function them() {\n    const r = await fetch('/api/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title }) });\n    const moi: Post = await r.json();\n    setPosts([...posts, moi]);          // chỉ bản sao NÀY được cập nhật\n  }\n  return (\n    <div>\n      <ul id=\"ds\">{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n      <input id=\"moi\" value={title} onChange={(e) => setTitle(e.target.value)} className=\"border px-2\" />\n      <button id=\"them\" onClick={them} className=\"ml-2 rounded bg-black px-3 text-white\">Thêm</button>\n    </div>\n  );\n}\n",
 "n14-1:file:src/app/sai/page.tsx": "// app/sai/page.tsx — hai component, mỗi cái một bản sao dữ liệu máy chủ\nimport { DemBai } from './DemBai';\nimport { DanhSach } from './DanhSach';\n\nexport default function Trang() {\n  return <main className=\"p-4 text-lg\"><DemBai /><DanhSach /></main>;\n}\n",
 "n14-1:file:src/app/dung/page.tsx": "// app/dung/page.tsx — Server Component: đọc NGUỒN một lần, ô đếm và danh sách cùng một lần đọc\nimport { revalidatePath } from 'next/cache';\nimport { kho } from '@/lib/kho';\n\nexport const dynamic = 'force-dynamic';\n\nasync function them(formData: FormData) {\n  'use server';\n  const title = String(formData.get('title') ?? '').trim();\n  if (title) kho.posts.push({ id: kho.nextId++, title });\n  revalidatePath('/dung');\n}\n\nexport default async function Trang() {\n  const posts = kho.posts;              // thực tế: await db.post.findMany()\n  return (\n    <main className=\"p-4 text-lg\">\n      <p id=\"dem\" className=\"font-bold\">{posts.length} bài</p>\n      <ul id=\"ds\">{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n      <form action={them}>\n        <input id=\"moi\" name=\"title\" className=\"border px-2\" />\n        <button id=\"them\" className=\"ml-2 rounded bg-black px-3 text-white\">Thêm</button>\n      </form>\n    </main>\n  );\n}\n",
 "n14-1:haibansao": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/sai|/dung'\n✓ Compiled successfully in 3.2s\n├ ƒ /dung\n└ ○ /sai\n$ curl HTML ban đầu: bao nhiêu <li>, ô đếm ghi gì?\n/sai   · <li> trong HTML: 0 · ô đếm: 0 bài\n/dung  · <li> trong HTML: 3 · ô đếm: 3 bài\n$ Chromium /sai: mở trang · thêm \"Zustand\" · một tab khác thêm \"Tab khác\" (curl POST) · quay lại tab (focus)\n1 mở        · 3 bài · danh sách 3 dòng (Học Next.js, Server Component, Cache)\n2 thêm      · 3 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)\n3 tab khác  · 3 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)\n4 F5        · 5 bài · danh sách 5 dòng (Học Next.js, Server Component, Cache, Zustand, Tab khác)\nrequest tới /api/posts: GET 200, GET 200, POST 201, GET 200, GET 200\n$ curl -s 127.0.0.1:19398/api/dem; echo\n{\"GET /api/posts\":4,\"POST /api/posts\":2}\n$ Chromium /dung: cùng ba bước\n1 mở        · 3 bài · danh sách 3 dòng (Học Next.js, Server Component, Cache)\n2 thêm      · 4 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)\n3 tab khác  · 4 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)\n4 F5        · 5 bài · danh sách 5 dòng (Học Next.js, Server Component, Cache, Zustand, Tab khác)\nrequest tới /api/posts: 0 · request trang: GET 200, POST 200, GET 200\n$ curl -s 127.0.0.1:19398/api/dem; echo\n{\"POST /api/posts\":1}",
 "n14-1:kho": "$ grep -E '\"(zustand|@tanstack/react-query|next|react)\"' package.json\n    \"@tanstack/react-query\": \"^5.101.0\",\n    \"next\": \"^14.2.15\",\n    \"react\": \"^18.3.1\",\n    \"zustand\": \"^4.5.5\"\n$ grep -rlE \"from 'zustand'\" src | wc -l | sed 's/^ */tệp dùng zustand: /'; grep -rl \"@tanstack/react-query\" src | wc -l | sed 's/^ */tệp dùng @tanstack\\/react-query: /'\ntệp dùng zustand: 32\ntệp dùng @tanstack/react-query: 323\n$ grep -nE \"products: MOCK_PRODUCTS|fetchProducts: async|name: 'shop-products-storage'|partialize\" src/store/productStore.ts\n35:      products: MOCK_PRODUCTS,\n40:      fetchProducts: async () => {\n109:      name: 'shop-products-storage',\n111:      partialize: (state) => ({ products: state.products }),",
 "anh-nxj-14-1:sai-mo": {
  "url": "http://127.0.0.1:19398/sai",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-1:sai-them": {
  "url": "http://127.0.0.1:19398/sai",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-1:sai-tab": {
  "url": "http://127.0.0.1:19398/sai",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-1:sai": {
  "url": "http://127.0.0.1:19398/sai",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/sai",
    "ma": 200,
    "loai": "document",
    "kt": 7339
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/06tkv_zota-68.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14948
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1c1w_tyghb6bp.js",
    "ma": 200,
    "loai": "script",
    "kt": 1082
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 201,
    "loai": "fetch",
    "kt": 26,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"title\":\"Zustand\"}",
    "ms": 1730,
    "ve": 2038
   },
   {
    "url": "http://127.0.0.1:19398/sai",
    "ma": 200,
    "loai": "document",
    "kt": 7339
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/06tkv_zota-68.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14948
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1c1w_tyghb6bp.js",
    "ma": 200,
    "loai": "script",
    "kt": 1082
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 151
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 151
   }
  ],
  "console": [],
  "ketQua": {
   "1 mở": "3 bài · danh sách 3 dòng (Học Next.js, Server Component, Cache)",
   "2 thêm": "3 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)",
   "3 tab khác": "3 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)",
   "4 F5": "5 bài · danh sách 5 dòng (Học Next.js, Server Component, Cache, Zustand, Tab khác)"
  }
 },
 "anh-nxj-14-1:dung-mo": {
  "url": "http://127.0.0.1:19398/dung",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-1:dung-them": {
  "url": "http://127.0.0.1:19398/dung",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-1:dung-tab": {
  "url": "http://127.0.0.1:19398/dung",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-1:dung": {
  "url": "http://127.0.0.1:19398/dung",
  "vp": [
   520,
   250
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/dung",
    "ma": 200,
    "loai": "document",
    "kt": 7547
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/06tkv_zota-68.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14948
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/dung",
    "ma": 200,
    "loai": "fetch",
    "kt": 4263,
    "pt": "POST",
    "na": "40f73360e2d831da8e967f42cde30c4141ab7e987f",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryGXOZa8cHCGl6fwi1",
    "ct": "text/x-component",
    "than": "------WebKitFormBoundaryGXOZa8cHCGl6fwi1\r\nContent-Disposition: form-data; name=\"_1_$ACTION_ID_40f73360e2d831da8e967f42cde30c4141ab7e987f\"\r\n\r\n\r\n------WebKitFormBoundaryGXOZa8cHCGl6fwi1\r\nContent-Disposition: form-data; name=\"_1_title\"\r\n\r\nZustand\r\n------WebKitFormBoundaryGXOZa8cHCGl6fwi1\r\nContent-Dispo",
    "ms": 1058,
    "ve": 1067
   },
   {
    "url": "http://127.0.0.1:19398/dung",
    "ma": 200,
    "loai": "document",
    "kt": 7679
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/06tkv_zota-68.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14948
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   }
  ],
  "console": [],
  "ketQua": {
   "1 mở": "3 bài · danh sách 3 dòng (Học Next.js, Server Component, Cache)",
   "2 thêm": "4 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)",
   "3 tab khác": "4 bài · danh sách 4 dòng (Học Next.js, Server Component, Cache, Zustand)",
   "4 F5": "5 bài · danh sách 5 dòng (Học Next.js, Server Component, Cache, Zustand, Tab khác)"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-14-1', code: 'NXJ 14.1', title: 'Two kinds of state (and the mistake of mixing them)', sub: 'Chapter 14 · Lesson 14.1' };
const O = (k) => { const v = DU_LIEU[`n14-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-14-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-14-1', ten, { vp: 520, ...o });

// ── số đo (n14-1 · Next.js 16.4.6 · React 19.3.0 · next start · Chromium)
const TSC = doan('bai', 'tsc --noEmit'), TSC2 = doan('bai', 'sửa:');
const BUILD = doan('haibansao', 'npm run build'), HTML = doan('haibansao', 'curl HTML');
const SAI = A('sai'), DUNG = A('dung');
const KQ = (x) => Object.values(x.ketQua).map((v) => v.split(' (')[0]);
const ks = KQ(SAI), kd = KQ(DUNG);
const req = SAI.mang.filter((x) => x.url.includes('/api/posts')).map((x) => (x.pt || 'GET') + ' ' + x.ma);
const KHO = O('kho').replace(/tệp dùng /g, 'files using ').replace(/sed 's\/\^ \*\/files using [^']*'/g, (m) => m);
if (!/TS2339: Property 'id' does not exist on type 'never'/.test(TSC.join('\n')) || !/0 lỗi/.test(TSC2.join(''))) throw new Error('tsc đổi');
if (!/○ \/sai/.test(BUILD.join('\n')) || !/ƒ \/dung/.test(BUILD.join('\n'))) throw new Error('build đổi');
if (!/^3 bài · danh sách 4/.test(ks[1]) || !/^3 bài · danh sách 4/.test(ks[2]) || !/^5 bài · danh sách 5/.test(ks[3]) || !/^4 bài · danh sách 4/.test(kd[1])) throw new Error('đo trình duyệt đổi');
if (!/<li> trong HTML: 0 · ô đếm: 0 bài/.test(HTML[0]) || !/<li> trong HTML: 3 · ô đếm: 3 bài/.test(HTML[1])) throw new Error('HTML đổi');
const vi2en = (s) => s.replace(' bài', ' posts').replace('danh sách', 'list').replace(' dòng', ' rows');
const BUOC = ['open', 'add "Zustand"', 'another tab adds a post', 'F5'];

const tach = (s) => s.replace(/^(\s*)useEffect\(\(\) => \{ (fetch\(.*\)); \}, \[\]\);$/m, (_, k, f) => `${k}useEffect(() => {\n${k}  ${f};\n${k}}, []);`);
const DS = tach(bo(F('src/app/sai/DanhSach.tsx')).split('\n').filter((l) => l.trim() && !/^\s*(<input|<button|<\/div>|<div>|return \(|\);|import)/.test(l) && l !== "'use client';").join('\n')).replace("{ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title }) }", "{ method: 'POST', … }").replace('      <ul id="ds">', '  return <ul id="ds">').replace('</ul>', '</ul>;').replace('// chỉ bản sao NÀY được cập nhật', '// only THIS copy is updated').replace('const r = await fetch', 'const r = await\n      fetch');
const DEM = tach(bo(F('src/app/sai/DemBai.tsx')).split('\n').filter((l) => l.trim() && !/^import/.test(l) && l !== "'use client';").join('\n')).replace(' className="font-bold"', '');
if (/\/\/ .*[ạ-ỹđ]/i.test(DS + DEM)) throw new Error('còn chú thích Việt trong mã');

export const S = [
  { cover: true, nhan: 'Chapter 14 · Lesson 14.1', t: 'Two kinds of state<br>(and the mistake of mixing them)', sub: 'Client state you own, server state you only copy — measured on a real page where two copies of the same list disagree',
    en: 'Lesson fourteen point one: two kinds of state, and the mistake of mixing them. State you own on the client, and server state you only hold a copy of — measured on a real page where two copies of the same list disagree.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Client state</b>: owned by the browser — a tab, a modal, a draft</li>
    <li><b>Server state</b>: a <i>copy</i> of remote data — it can be stale the moment you read it</li>
    <li>The classic mistake: server data in <code>useState</code> — two copies that disagree, measured</li>
    <li>What a client-fetched page sends in its HTML: nothing</li>
    <li>The toolbox: Server Components, TanStack Query, Zustand, Context, the URL</li></ul>`,
    en: 'Five takeaways: client state, owned by the browser; server state, a copy that can be stale; the classic mistake of server data in useState, with two copies that disagree, measured; what a client-fetched page sends in its HTML; and the toolbox for this chapter.' },
  { t: 'Not all "state" is the same thing', body: cmp(['', 'Client (UI) state', 'Server state'], [
      ['Examples', 'open tab, modal visible, form draft, theme, selected filter', 'list of posts, current user, a product, a price'],
      ['Who owns it', '<b>the browser</b> — nobody else can change it', '<b>the server</b> — you hold a copy'],
      ['Can it change without you?', 'no', '<b>yes</b> — another tab, another user, a job'],
      ['Losing it costs', 'nothing', 'nothing — but a <b>stale copy</b> costs a wrong screen'],
      ['Its real problem', 'sharing it between components', '<b>caching</b>: fetch, dedupe, refresh, retry, staleness'],
    ]) + box('Ask one question', 'Where does the truth live? In the browser ⇒ client state. Anywhere else ⇒ you are holding a copy.', 'xanh'),
    en: 'Not all state is the same thing. Client state is owned by the browser: a tab, a modal, a draft; nobody else can change it. Server state lives on the server; you only hold a copy, it can change without you, and its real problem is caching. One question sorts them: where does the truth live?' },
  { t: "The lesson's classic mistake — and what tsc says", body: two(D(tsx(bo(F('src/app/sai/bai.tsx')), { sm: true, hl: [6, 7] }), tn(['$ npx tsc --noEmit', ...TSC].join('\n'), { fs: 13, wrap: 64, title: 'tsc (real)' })),
    D(box('useState([]) is never[]', 'An empty array literal gives TypeScript nothing to infer: the state type is <code>never[]</code>, so <code>p.id</code> is <code>TS2339</code>. Give it the shape: <code>useState&lt;Post[]&gt;([])</code>.', 'do2'),
      box('The real problem is not the type', 'Even typed, this component now owns a <b>copy</b> of server data — and hand-rolls loading, errors, caching, refetching and staleness. Every component that needs the list does it again.', 'lam')), 'r64'),
    en: 'The lesson\'s classic mistake, typed into a tsx file: useState with an empty array is never array, so p dot id is TS two three three nine. Give it the shape, Post array. But the type is not the real problem: this component now owns a copy of server data, and hand-rolls loading, errors, caching and staleness.' },
  { t: 'Two components, two copies of the same list', body: two(D(tsx(DEM, { sm: true, hl: [3] }), tsx(DS, { sm: true, hl: [4, 12] })),
    D(B('sai-mo', { url: 'localhost:3000/sai · open', h: 200, w: 370 }), B('sai-them', { url: 'after adding "Zustand"', h: 200, w: 370, mark: [[12, 18, 60, 28, ''], [12, 128, 96, 28, '']] }))),
    en: 'Two components on one page, each with its own copy. The counter fetches the list and keeps it. The list fetches it again and keeps it too. After adding Zustand, only the list\'s copy is updated by hand: the list shows four rows, the counter still says three posts.' },
  { t: 'Measured: /sai (two copies) vs /dung (one server read)', body: cmp(['Step', '/sai — two useState copies', '/dung — Server Component'],
      BUOC.map((b, i) => [b, (i === 1 || i === 2 ? '<b style="color:#c0392b">' : '') + vi2en(ks[i]) + (i === 1 || i === 2 ? ' ✗</b>' : ''), vi2en(kd[i])]))
    + two(tn(['# Chromium · requests to /api/posts while on /sai', req.join(' · '), '$ curl /api/dem   # the server\'s own count', ...doan('haibansao', 'curl -s 127.0.0.1:19398/api/dem').slice(0, 1)].join('\n'), { fs: 13, wrap: 60, title: 'network + server (real)' }),
      box('Read it', 'Two copies ⇒ two GETs per load, and they <b>disagree</b> after a write. Neither notices a write from another tab until F5. On <code>/dung</code> the counter and the list come from one read, so they cannot disagree.', 'do2'), 'r64'),
    en: 'Measured. On the page with two copies, after adding a post the counter says three and the list shows four. Another tab adds a post: neither copy notices. Only F5 brings both to five. Every load costs two GET requests. On the Server Component page, the counter and the list come from one read: they never disagree.' },
  { t: 'Server state is a cache problem', body: icards([
      ['loop', 'Fetching', 'when to load, when to load again'],
      ['merge', 'Deduplication', 'two components asking at once ⇒ one request'],
      ['clock', 'Staleness', 'how old may the copy be before you refresh it?'],
      ['bolt', 'Refetch', 'on focus, on reconnect, after a write'],
      ['warn', 'Errors & retries', 'a failed request, retried with backoff'],
      ['flag', 'Loading states', 'first load vs background refresh'],
    ], 3) + box('None of those is what useState is for', 'useState holds a value you own. Put a copy of remote data in it and you have built a cache — without invalidation, dedupe, retries or a staleness rule. That is the root of most "my data is stale" bugs.', 'do2'),
    en: 'Server state is a cache problem: fetching, deduplication, staleness, refetching, errors and retries, loading states. None of those is what useState is for. Put a copy of remote data in it and you have built a cache with no invalidation, no dedupe and no staleness rule.' },
  { t: 'What the HTML carries: client fetch vs Server Component', body: two(D(tn(['$ npm run build', ...BUILD, '$ curl the first HTML of each page', ...HTML.map((l) => l.replace('trong HTML', 'in HTML').replace('ô đếm', 'counter'))].join('\n'), { fs: 14, wrap: 64, title: 'next build + curl (real)' })),
    D(box('/sai — fetched in useEffect', 'The page is static (○) and its HTML has <b>0</b> rows and "0 posts". The data arrives only after JavaScript runs and calls <code>/api/posts</code> — twice.', 'do2'),
      box('/dung — read on the server', 'Dynamic (ƒ): the HTML already has <b>3</b> rows and "3 posts". The browser calls <code>/api/posts</code> zero times; a write goes through a Server Action and <code>revalidatePath</code> (Chapter 12).', 'xanh')), 'r64'),
    en: 'What the HTML carries. The page that fetches in useEffect is static, and its HTML has zero rows and says zero posts; data arrives only after JavaScript runs. The Server Component page is dynamic, and its HTML already has three rows. The browser never calls the API; writes go through a Server Action.' },
  { t: 'The toolbox for this chapter', body: icards([
      ['server', '1 · Server Component', 'Initial page data, read on the server (Chapter 10). Often you need nothing else.'],
      ['db', '2 · TanStack Query', 'Server data the <b>client</b> must fetch: after an interaction, polling, load more (14.3–14.4).'],
      ['box', '3 · Zustand', 'Global <b>client</b> UI state shared by distant components, no prop drilling (14.2).'],
      ['link', '4 · Context · the URL', 'Slow app-wide values (auth, theme) · shareable view state: filter, page (14.5).'],
    ], 2) + box('The skill', 'Not "which library is best" — match the <b>kind</b> of state to the tool. Server data ⇒ a cache tool (Server Component or TanStack Query). Client state ⇒ useState, then a store only if it is truly shared.', 'xanh'),
    en: 'The toolbox for this chapter: Server Components for initial page data; TanStack Query for server data fetched on the client; Zustand for global client UI state; Context for slow app-wide values and the URL for shareable view state. The skill is matching the kind of state to the tool.' },
  { t: 'cuongthai.com: both kinds, and one store holding the wrong kind', body: two(D(tn(KHO, { fs: 13, wrap: 64, title: 'frontend/ (real)' })),
    D(box('Both tools in use', '32 files use Zustand stores, 323 use TanStack Query — Next.js 14 with zustand 4 and react-query 5.', 'lam'),
      box('The trap, in production code', '<code>productStore</code> keeps the <b>product list</b> — server data — in a Zustand store, starts from mock data, and persists it to <code>localStorage</code> (<code>shop-products-storage</code>). Every visitor carries their own copy until <code>fetchProducts</code> replaces it.', 'do2')), 'r64'),
    en: 'cuongthai.com uses both: thirty-two files use Zustand stores and three hundred twenty-three use TanStack Query. And one store holds the wrong kind: productStore keeps the product list, which is server data, in a Zustand store, starts from mock data and persists it to localStorage, so each visitor carries a copy until fetchProducts replaces it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Client state', 'UI the browser owns'), kw('Server state', 'a copy of remote data'), kw('Source of truth', 'where the real value lives'),
      kw('Staleness', 'the copy is older than the truth'), kw('Ownership', 'the server owns server data'), kw('Mixing mistake', 'fetched data in useState'),
      kw('never[]', 'useState([]) with no type'), kw('Cache problem', 'fetch, dedupe, refresh, retry'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: client state; server state; source of truth; staleness; ownership; the mixing mistake; never array, from useState with an empty array; and the cache problem.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `List every piece of state on one page; label it ${c('client')} or ${c('server')}`,
      `Build ${c('/sai')}: two components fetching the same list; add a row and watch them disagree`,
      `Rebuild it as a Server Component; check the first HTML with ${c('curl')}`,
      `Write your rule: server data never lives in ${c('useState')} as if you owned it`,
    ]), box('Keep these', `<ul><li>Ask where the truth lives</li><li>Server state = a copy = a cache</li><li>Two copies disagree after a write</li><li>Server Component first; a cache tool when the client must fetch</li></ul>`, 'lam'), ''),
    en: 'Your turn: label every piece of state on one page; build the two-copy page and watch it disagree; rebuild it as a Server Component and check the first HTML with curl; and write your rule. Keep: ask where the truth lives; server state is a copy, which means a cache.' },
];
export const slides = lamDeck({ chuong: 'Chapter 14 — State management: client and server state', bai: '14.1' }, S);
