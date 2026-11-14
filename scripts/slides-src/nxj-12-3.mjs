/*DU_LIEU*/
const DU_LIEU = {
 "n12-3:file:src/app/bai12-3/actions.ts": "'use server';\n// đoạn mã của bài, chép nguyên vào một tệp .ts\nimport { revalidatePath, revalidateTag } from 'next/cache';\n\nasync function createPost(formData) {\n  'use server';\n  await db.post.create({ data: { title: formData.get('title') } });\n\n  revalidatePath('/posts');     // the list route is now stale → refetch\n  // or, if the fetch was tagged:\n  revalidateTag('posts');       // every fetch tagged 'posts' is stale\n}\n",
 "n12-3:bai": "$ npx tsc --noEmit      # đoạn mã của bài, chép nguyên\nbai12-3/actions.ts(5,27): error TS7006: Parameter 'formData' implicitly has an 'any' type.\nbai12-3/actions.ts(7,9): error TS2304: Cannot find name 'db'.\nbai12-3/actions.ts(11,3): error TS2554: Expected 2 arguments, but got 1.",
 "n12-3:file:src/app/ds/khong/page.tsx": "// app/ds/khong/page.tsx — danh sách + form; action ghi rồi redirect, KHÔNG revalidate\nimport { redirect } from 'next/navigation';\nimport { db } from '@/lib/db';\n\nexport default async function Trang() {\n  const notes = await db.note.findMany({ orderBy: { id: 'desc' }, take: 3 });\n  async function them(formData: FormData) {\n    'use server';\n    const title = formData.get('title');\n    if (typeof title !== 'string' || !title.trim()) return;\n    await db.note.create({ data: { title } });\n    redirect('/ds/khong');\n  }\n  return (\n    <main className=\"p-4 text-xl\">\n      <p id=\"gio\">dựng lúc {new Date().toTimeString().slice(0, 8)}</p>\n      <form action={them} className=\"flex gap-2\"><input name=\"title\" className=\"border px-2\" /><button className=\"border px-3\">Thêm</button></form>\n      <ul id=\"ds\">{notes.map((n) => <li key={n.id}>#{n.id} {n.title}</li>)}</ul>\n    </main>\n  );\n}\n",
 "n12-3:file:src/app/ds/path/page.tsx": "// app/ds/path/page.tsx — y hệt, nhưng action gọi revalidatePath trước khi redirect\nimport { revalidatePath } from 'next/cache';\nimport { redirect } from 'next/navigation';\nimport { db } from '@/lib/db';\n\nexport default async function Trang() {\n  const notes = await db.note.findMany({ orderBy: { id: 'desc' }, take: 3 });\n  async function them(formData: FormData) {\n    'use server';\n    const title = formData.get('title');\n    if (typeof title !== 'string' || !title.trim()) return;\n    await db.note.create({ data: { title } });\n    revalidatePath('/ds/path');   // trang danh sách đã cũ ⇒ dựng lại\n    redirect('/ds/path');\n  }\n  return (\n    <main className=\"p-4 text-xl\">\n      <p id=\"gio\">dựng lúc {new Date().toTimeString().slice(0, 8)}</p>\n      <form action={them} className=\"flex gap-2\"><input name=\"title\" className=\"border px-2\" /><button className=\"border px-3\">Thêm</button></form>\n      <ul id=\"ds\">{notes.map((n) => <li key={n.id}>#{n.id} {n.title}</li>)}</ul>\n    </main>\n  );\n}\n",
 "n12-3:file:src/app/ds/bat/page.tsx": "// app/ds/bat/page.tsx — redirect() bị bọc trong try/catch\nimport { revalidatePath } from 'next/cache';\nimport { redirect } from 'next/navigation';\nimport { db } from '@/lib/db';\n\nexport default async function Trang() {\n  const notes = await db.note.findMany({ orderBy: { id: 'desc' }, take: 3 });\n  async function them(formData: FormData) {\n    'use server';\n    try {\n      await db.note.create({ data: { title: String(formData.get('title')) } });\n      revalidatePath('/ds/bat');\n      redirect('/ds/path');\n      console.log('[bat] dòng SAU redirect');\n    } catch (e) {\n      console.log('[bat] catch bắt được:', (e as Error).message);\n    }\n  }\n  return (\n    <main className=\"p-4 text-xl\">\n      <form action={them} className=\"flex gap-2\"><input name=\"title\" className=\"border px-2\" /><button className=\"border px-3\">Thêm</button></form>\n      <ul id=\"ds\">{notes.map((n) => <li key={n.id}>#{n.id} {n.title}</li>)}</ul>\n    </main>\n  );\n}\n",
 "n12-3:file:src/app/khoa/page.tsx": "// app/khoa/page.tsx — fetch có tag; action thêm khoá rồi revalidateTag(tag, 'max')\nimport { revalidateTag } from 'next/cache';\nimport { redirect } from 'next/navigation';\n\nconst API = 'http://127.0.0.1:19391';\n\nexport default async function Trang() {\n  const ds: { slug: string; ten: string }[] = await fetch(`${API}/courses`, { next: { tags: ['khoa-max'] } }).then((r) => r.json());\n  async function them(formData: FormData) {\n    'use server';\n    const ten = String(formData.get('ten'));\n    await fetch(`${API}/courses?slug=${encodeURIComponent(ten)}&ten=${encodeURIComponent(ten)}`, { method: 'POST' });\n    revalidateTag('khoa-max', 'max');\n    redirect('/khoa');\n  }\n  return (\n    <main className=\"p-4 text-xl\">\n      <form action={them} className=\"flex gap-2\"><input name=\"ten\" className=\"border px-2\" /><button className=\"border px-3\">Thêm khoá</button></form>\n      <p id=\"dem\">{ds.length} khoá: {ds.map((k) => k.ten).join(', ')}</p>\n    </main>\n  );\n}\n",
 "n12-3:file:src/app/khoa2/page.tsx": "// app/khoa2/page.tsx — y hệt, nhưng action dùng updateTag (Next.js 16, chỉ trong Server Action)\nimport { updateTag } from 'next/cache';\nimport { redirect } from 'next/navigation';\n\nconst API = 'http://127.0.0.1:19391';\n\nexport default async function Trang() {\n  const ds: { slug: string; ten: string }[] = await fetch(`${API}/courses`, { next: { tags: ['khoa-update'] } }).then((r) => r.json());\n  async function them(formData: FormData) {\n    'use server';\n    const ten = String(formData.get('ten'));\n    await fetch(`${API}/courses?slug=${encodeURIComponent(ten)}&ten=${encodeURIComponent(ten)}`, { method: 'POST' });\n    updateTag('khoa-update');\n    redirect('/khoa2');\n  }\n  return (\n    <main className=\"p-4 text-xl\">\n      <form action={them} className=\"flex gap-2\"><input name=\"ten\" className=\"border px-2\" /><button className=\"border px-3\">Thêm khoá</button></form>\n      <p id=\"dem\">{ds.length} khoá: {ds.map((k) => k.ten).join(', ')}</p>\n    </main>\n  );\n}\n",
 "n12-3:trang": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/ds|/khoa|Static|Dynamic'\n✓ Compiled successfully in 4.4s\n├ ○ /ds/bat\n├ ○ /ds/khong\n├ ○ /ds/path\n├ ○ /khoa\n└ ○ /khoa2\n○  (Static)  prerendered as static content\n$ curl /ds/khong · /ds/path — trước khi ghi (giờ dựng + 3 dòng đầu)\n/ds/khong · dựng lúc 05:47:28 · #13 Ghi chú số 13\n/ds/path · dựng lúc 05:47:28 · #13 Ghi chú số 13",
 "n12-3:trinh-duyet": "$ Chromium: Thêm ở /ds/khong · /ds/path · /ds/bat · /khoa (revalidateTag max) · /khoa2 (updateTag) — kết quả + log\nkhong  · \"{\\\"url\\\":\\\"/ds/khong\\\",\\\"dau\\\":\\\"#13 Ghi chú số 13\\\",\\\"gio\\\":\\\"dựng lúc 05:47:28\\\"}\"\npath   · \"{\\\"url\\\":\\\"/ds/path\\\",\\\"dau\\\":\\\"#1020 Ghi chú CÓ revalidatePath\\\",\\\"gio\\\":\\\"dựng lúc 05:47:38\\\"}\"\nbat    · \"{\\\"url\\\":\\\"/ds/bat\\\",\\\"dau\\\":\\\"#1021 redirect trong try\\\"}\"\nkhoa   · \"{\\\"url\\\":\\\"/khoa\\\",\\\"dem\\\":\\\"3 khoá: Next.js, Node.js, React\\\"}\"\nkhoa2  · \"{\\\"url\\\":\\\"/khoa2\\\",\\\"dem\\\":\\\"5 khoá: Next.js, Node.js, React, Docker, Redis\\\"}\"\n$ grep -aE '^\\[bat\\]' ~/.rtq-nxj/nen-c12s.log | tail -2\n[bat] catch bắt được: NEXT_REDIRECT",
 "n12-3:sau": "$ node -e 'đếm ghi chú trong CSDL' ; curl /ds/khong · /ds/path (tải lại sau khi ghi)\nCSDL · ghi chú mới nhất: #1021 redirect trong try\n$ for p in khong path; do echo \"/ds/$p · $(curl -s localhost:19392/ds/$p | grep -oE 'dựng lúc[^<]*(<!-- -->[^<]*)*' | head -1 | sed 's/<!-- -->//g') · $(curl -s localhost:19392/ds/$p | grep -oE '<li>[^<]*(<!-- -->[^<]*)*</li>' | head -1 | sed 's/<!-- -->//g; s/<[^>]*>//g')\"; done\n/ds/khong · dựng lúc 05:47:28 · #13 Ghi chú số 13\n/ds/path · dựng lúc 05:47:38 · #1020 Ghi chú CÓ revalidatePath\n$ curl /khoa · /khoa2 (tải lại sau khi ghi) — hai lần cách 1 giây\nlần 1 /khoa · 4 khoá: Next.js, Node.js, React, Docker\nlần 1 /khoa2 · 5 khoá: Next.js, Node.js, React, Docker, Redis\nlần 2 /khoa · 4 khoá: Next.js, Node.js, React, Docker\nlần 2 /khoa2 · 5 khoá: Next.js, Node.js, React, Docker, Redis",
 "n12-3:kho": "$ sed -n '1,30p' frontend/src/app/api/revalidate/route.ts (kho cuongthai.com) — phần kiểm khoá + gọi revalidate\n12: *     headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': SECRET },\n16: *   POST with secret header from server environment.\n21:const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? '';\n44:    // ── Auth: require secret token (prevents abuse) ─────────────────────────\n45:    const secret = request.headers.get('x-revalidate-secret') ?? '';\n46:    const envSecret = process.env.REVALIDATE_SECRET ?? '';\n48:    if (envSecret && secret !== envSecret) {\n50:        { success: false, message: 'Invalid revalidation secret' },",
 "anh-nxj-12-3:khong-truoc": {
  "url": "http://127.0.0.1:19392/ds/khong",
  "vp": [
   700,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-3:khong": {
  "url": "http://127.0.0.1:19392/ds/khong",
  "vp": [
   700,
   260
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "sau": "{\"url\":\"/ds/khong\",\"dau\":\"#13 Ghi chú số 13\",\"gio\":\"dựng lúc 05:47:28\"}"
  }
 },
 "anh-nxj-12-3:khong-f5": {
  "url": "http://127.0.0.1:19392/ds/khong",
  "vp": [
   700,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-3:path-truoc": {
  "url": "http://127.0.0.1:19392/ds/path",
  "vp": [
   700,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-3:path": {
  "url": "http://127.0.0.1:19392/ds/path",
  "vp": [
   700,
   260
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "sau": "{\"url\":\"/ds/path\",\"dau\":\"#1020 Ghi chú CÓ revalidatePath\",\"gio\":\"dựng lúc 05:47:38\"}"
  }
 },
 "anh-nxj-12-3:bat": {
  "url": "http://127.0.0.1:19392/ds/bat",
  "vp": [
   700,
   260
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "sau": "{\"url\":\"/ds/bat\",\"dau\":\"#1021 redirect trong try\"}"
  }
 },
 "anh-nxj-12-3:khoa-truoc": {
  "url": "http://127.0.0.1:19392/khoa",
  "vp": [
   700,
   200
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-3:khoa": {
  "url": "http://127.0.0.1:19392/khoa",
  "vp": [
   700,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "sau": "{\"url\":\"/khoa\",\"dem\":\"3 khoá: Next.js, Node.js, React\"}"
  }
 },
 "anh-nxj-12-3:khoa2-truoc": {
  "url": "http://127.0.0.1:19392/khoa2",
  "vp": [
   700,
   200
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-3:khoa2": {
  "url": "http://127.0.0.1:19392/khoa2",
  "vp": [
   700,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "sau": "{\"url\":\"/khoa2\",\"dem\":\"5 khoá: Next.js, Node.js, React, Docker, Redis\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, icards, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-12-3', code: 'NXJ 12.3', title: 'After the write: revalidate the cache', sub: 'Chapter 12 · Lesson 12.3' };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-12-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const O = (k) => { const v = DU_LIEU[`n12-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-12-3', ten, { vp: 700, ...o });
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };

// đoạn mã của bài (bài web) — chép nguyên vào .ts: tsc đo ở khối "bai"
const BAI = `import { revalidatePath, revalidateTag } from 'next/cache';

async function createPost(formData) {
  'use server';
  await db.post.create({ data: { title: formData.get('title') } });

  revalidatePath('/posts');     // the list route is now stale
  // or, if the fetch was tagged:
  revalidateTag('posts');       // every fetch tagged 'posts'
}`;
// ── số đo
const TSC = dongs('bai', /error TS/);
const BUILD = dongs('trang', /^[├└┌] [○ƒ] \/(ds|khoa)/);
const TRUOC = doan('trang', 'trước khi ghi');
const KQ = Object.fromEntries(doan('trinh-duyet', 'kết quả + log').filter((l) => / · /.test(l)).map((l) => { const [k, v] = l.split(/\s+·\s+/); return [k.trim(), JSON.parse(JSON.parse(v))]; }));
const BAT = dongs('trinh-duyet', /^\[bat\]/);
const CSDL = doan('sau', 'đếm ghi chú')[0];
const SAU = doan('sau', 'for p in khong path');
const KHOA = doan('sau', 'hai lần cách 1 giây');
const KHO = doan('kho', 'revalidate/route.ts');
if (TSC.length !== 3 || !/TS7006/.test(TSC[0]) || !/'db'/.test(TSC[1]) || !/TS2554: Expected 2 arguments, but got 1/.test(TSC[2])) throw new Error('tsc bài đổi');
if (BUILD.length !== 5 || BUILD.some((l) => !/○/.test(l))) throw new Error('build đổi');
const gio = (s) => (s.match(/dựng lúc ([0-9:]+)/) || [])[1];
if (KQ.khong.dau !== '#13 Ghi chú số 13' || gio(KQ.khong.gio) !== gio(TRUOC[0]) || !/revalidatePath/.test(KQ.path.dau) || gio(KQ.path.gio) === gio(TRUOC[1])) throw new Error('khong/path đổi');
if (KQ.bat.url !== '/ds/bat' || !BAT.some((l) => /NEXT_REDIRECT/.test(l)) || BAT.some((l) => /SAU redirect/.test(l))) throw new Error('bat đổi');
if (!/^3 khoá/.test(KQ.khoa.dem) || !/^5 khoá/.test(KQ.khoa2.dem) || !/lần 1 \/khoa · 4 khoá/.test(KHOA.join('|'))) throw new Error('khoa đổi');
if (!/ghi chú mới nhất/.test(CSDL) || !/khong .*#13/.test(SAU[0]) || !/path .*revalidatePath/.test(SAU[1])) throw new Error('sau đổi');
if (!KHO.some((l) => /envSecret && secret !== envSecret/.test(l))) throw new Error('kho đổi');

const PATH = goc(bo(F('src/app/ds/path/page.tsx')));
const PA = PATH.split('\n'), pa = PA.findIndex((l) => /async function them/.test(l));
const PATH_ACT = PA.slice(pa, PA.findIndex((l, i) => i > pa && l === '  }') + 1).map((l) => l.replace(/^  /, '')).join('\n');
const ACT_CUA = (p) => { const L = goc(bo(F(p))).split('\n'); const a = L.findIndex((l) => /async function them/.test(l));
  return L.slice(a, L.findIndex((l, i) => i > a && l === '  }') + 1).map((l) => l.replace(/^  /, '')).join('\n').replace(/\$\{API\}\/courses\?slug=.*?, \{ method: 'POST' \}/, "${API}/courses?…`, { method: 'POST' }"); };
const K1_ACT = ACT_CUA('src/app/khoa/page.tsx'), K2_ACT = ACT_CUA('src/app/khoa2/page.tsx');
if (!/revalidateTag\('khoa-max', 'max'\)/.test(K1_ACT) || !/updateTag\('khoa-update'\)/.test(K2_ACT)) throw new Error('mã khoa đổi');
const BAT_ACT = (() => { const L = goc(bo(F('src/app/ds/bat/page.tsx'))).split('\n'); const a = L.findIndex((l) => /async function them/.test(l)); return L.slice(a, L.findIndex((l, i) => i > a && l === '  }') + 1).map((l) => l.replace(/^  /, '')).join('\n').replace(/String\(formData\.get\('title'\)\)/, "String(…)"); })();

export const S = [
  { cover: true, nhan: 'Chapter 12 · Lesson 12.3', t: 'After the write:<br>revalidate the cache', sub: 'The row is in the database, the page still shows the old list. Measured: no revalidate vs revalidatePath, revalidateTag vs updateTag in Next.js 16, and redirect() inside try/catch',
    en: 'Lesson twelve point three: after the write, revalidate the cache. The row reaches the database, yet the page still shows the old list. We measure a write with no revalidation against revalidatePath, revalidateTag against updateTag in Next.js sixteen, and redirect inside a try-catch.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The lesson's code compiled — and the Next.js 16 change to <code>revalidateTag</code></li>
    <li>A write without revalidation: the database is right, the page is not</li>
    <li><code>revalidatePath</code>: the page is rebuilt on the spot</li>
    <li>Tags: <code>revalidateTag(tag, 'max')</code> serves the old list once; <code>updateTag</code> does not</li>
    <li><code>redirect()</code> throws — and a <code>try/catch</code> swallows it</li></ul>`,
    en: 'Five takeaways: the lesson\'s code compiled, and the Next.js sixteen change to revalidateTag; a write with no revalidation, where the database is right and the page is not; revalidatePath, which rebuilds the page on the spot; tags, where revalidateTag with max serves the old list once and updateTag does not; and redirect, which throws, so a try-catch swallows it.' },
  { t: "The lesson's code, compiled: TS2554 on revalidateTag", body: two(D(tsx(BAI, { sm: true, hl: [3, 9] }),
      tn(['$ npx tsc --noEmit   # copied into a .ts file', ...TSC.map((l) => l.replace(/^bai12-3\//, ''))].join('\n'), { fs: 13, wrap: 56, title: 'tsc (real) — Next.js 16.4.6' })),
    D(box('Read it', 'Besides the familiar <code>formData</code> any and missing <code>db</code>, Next.js 16 rejects the one-argument <code>revalidateTag(\'posts\')</code>: <b>Expected 2 arguments</b>. The second argument is a cache profile — <code>\'max\'</code> means stale-while-revalidate (Lesson 10.3).', 'do2'),
      box('Inside an action', 'For "show my own write right now", Next.js 16 adds <code>updateTag(tag)</code> — Server Actions only. Measured below: the two behave differently.', 'lam')), ''),
    en: 'The lesson\'s code, compiled. Besides formData being any and db missing, Next.js sixteen rejects revalidateTag with one argument: expected two arguments. The second is a cache profile, and max means stale-while-revalidate, as in lesson ten point three. For showing your own write immediately, Next.js sixteen adds updateTag, for Server Actions only.' },
  { t: 'A write without revalidation: the database moved, the page did not', body: two(D(B('khong-truoc', { url: 'localhost:3000/ds/khong', h: 260, w: 520 }),
      B('khong', { url: 'after "Thêm" → redirect(\'/ds/khong\')', h: 260, w: 520 })),
    D(tn(['$ npm run build', ...BUILD.slice(0, 3), '$ curl /ds/khong   # before', TRUOC[0], '# Chromium: add a note, the action redirects', `→ ${KQ.khong.gio} · first row ${KQ.khong.dau}`, '$ node -e "newest row in the database"', CSDL, '$ curl /ds/khong   # reload after the write', SAU[0]].join('\n'), { fs: 13, wrap: 64, title: 'build + Chromium + curl (real)' }),
      box('Read it', 'The page is static (○), rendered at build. The action wrote the row and redirected — and the list, its render time and every reload still show the build-time copy. Nothing failed; nobody told the cache.', 'do2')), 'r46'),
    en: 'A write without revalidation. The page is static, rendered at build. The action wrote the row and redirected, and the list still shows the build-time copy — same first row, same render time — and so does every reload, while the database already holds the new note. Nothing failed; nobody told the cache.' },
  { t: 'revalidatePath: the page is rebuilt on the spot', body: two(D(B('path', { url: 'after "Thêm" → revalidatePath + redirect', h: 260, w: 520 }),
      tsx(PATH_ACT, { sm: true, hl: [6] })),
    D(tn(['$ curl /ds/path   # before', TRUOC[1], '# Chromium: add a note, revalidatePath, redirect', `→ ${KQ.path.gio} · first row ${KQ.path.dau}`, '$ curl /ds/path   # reload', SAU[1]].join('\n'), { fs: 13, wrap: 60, title: 'Chromium + curl (real)' }),
      box('Read it', 'One line — <code>revalidatePath(\'/ds/path\')</code> before <code>redirect</code> — and the redirect lands on a <b>freshly rendered</b> page: the new row on top, a new render time, and every later request gets the new copy. For a dynamic route pass the pattern: <code>revalidatePath(\'/notes/[id]\', \'page\')</code>.', 'xanh')), 'r46'),
    en: 'revalidatePath: one line before redirect, and the redirect lands on a freshly rendered page — the new row on top, a new render time — and every later request gets the new copy. For a dynamic route, pass the route pattern and the word page.' },
  { t: 'Path or tag: which one to call', body: cmp(['', 'revalidatePath(\'/ds/path\')', 'revalidateTag(tag, \'max\') · updateTag(tag)'], [
      ['Marks stale', 'the cached render of one route (pattern for dynamic segments)', 'every <code>fetch</code> tagged <code>next: { tags: [tag] }</code>, wherever it is used'],
      ['Best when', 'you know the one URL that shows the data', 'the same data feeds several routes — a forgotten path stays stale silently'],
      ['Data from', 'anything: Prisma, fetch, a file', '<code>fetch</code> with tags (or <code>unstable_cache</code>)'],
      ['Next.js 16', 'same as before', 'one argument is a type error; <code>updateTag</code> = read your own write'],
    ]) + path([{ t: 'write', s: 'db / API' }, { t: 'revalidate', s: 'path or tag', on: true }, { t: 'redirect', s: 'or return' }, { t: 'fresh render', s: 'next request' }], { h: 150, nhan: ['then', 'then', 'serves'] }),
    en: 'Path or tag? revalidatePath marks one route\'s cached render stale; use the route pattern for dynamic segments. Tags mark every fetch carrying that tag, wherever it is used — better when the same data feeds several pages, because a forgotten path stays stale and nothing tells you. Tags need fetch with tags, and in Next.js sixteen take a second argument; updateTag reads your own write.' },
  { t: "Next.js 16: revalidateTag(tag, 'max') vs updateTag", body: two(D(tsx(K1_ACT, { sm: true, hl: [5] }), B('khoa', { url: "after: revalidateTag('khoa-max', 'max')", h: 80, w: 540 })),
    D(tsx(K2_ACT, { sm: true, hl: [5] }), B('khoa2', { url: "after: updateTag('khoa-update')", h: 80, w: 540 })), '') +
    two(tn(KHOA.join('\n'), { fs: 13, wrap: 64, title: 'curl, reloads after the write (real)' }), box('Read it', "<code>'max'</code> = stale-while-revalidate: the redirect still showed <b>3</b> courses, the next reload <b>4</b>. <code>updateTag</code> refetched before answering: the new list at once.", 'lam'), ''),
    en: 'Next.js sixteen, measured. Both actions add a course through the API and redirect back. With revalidateTag and max, the redirect still showed three courses — the old list, served while the new one is fetched in the background; the next reload showed four. With updateTag, the redirect showed the new list at once. In an action, use updateTag when the user must see their own write.' },
  { t: 'redirect() throws — a try/catch swallows it', body: two(D(tsx(BAT_ACT, { sm: true, hl: [5, 8] })),
    D(tn(['# Chromium: submit /ds/bat', `→ URL ${KQ.bat.url} · first row ${KQ.bat.dau}`, '$ grep "[bat]" (next start log)', ...BAT].join('\n'), { fs: 15, wrap: 56, title: 'Chromium + server log (real)' }),
      box('Read it', '<code>redirect()</code> works by <b>throwing</b> a special error (<code>NEXT_REDIRECT</code>). Inside <code>try</code> the <code>catch</code> caught it: no navigation, the URL stayed <code>/ds/bat</code>, and the line after <code>redirect</code> never ran. Call <code>redirect</code> <b>after</b> the <code>try/catch</code>, as the last line.', 'do2')), ''),
    en: 'redirect throws. It works by throwing a special error named NEXT_REDIRECT. Inside a try block, the catch caught it: no navigation, the URL stayed on the same page, and the line after redirect never ran. Put redirect after the try-catch, as the last line of the action.' },
  { t: 'cuongthai.com: revalidation through a guarded route', body: two(D(tn(['$ grep -nE "secret|REVALIDATE|revalidatePath\\(|revalidateTag\\(" frontend/src/app/api/revalidate/route.ts', ...KHO].join('\n'), { fs: 13, wrap: 74, title: "the course's own repo, Next.js 14.2 (real)" })),
    D(box('Read it', 'The site writes through its Express API, then asks Next.js to drop cached pages through <b>one Route Handler</b>, <code>/api/revalidate</code>, which calls <code>revalidatePath</code>/<code>revalidateTag</code> for whitelisted paths. That route is public, so it checks a secret header.', 'lam'),
      box('Fail closed', 'Look at line 48: <code>if (envSecret &amp;&amp; secret !== envSecret)</code> — when the variable is empty the check is <b>skipped</b>. A guard should refuse when its secret is missing, not wave everyone through. Same lesson as an action: the endpoint is public.', 'do2')), 'r64'),
    en: 'On this course\'s site, writes go through the Express API, which then asks Next.js to drop cached pages through one route handler that calls revalidatePath and revalidateTag for whitelisted paths. The route is public, so it checks a secret header — but when the variable is empty, the check is skipped. A guard should fail closed.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('revalidatePath', 'drop one route\'s cached render'), kw('revalidateTag(tag, profile)', 'drop tagged fetches; two arguments in 16'),
      kw('updateTag', 'read your own write — actions only'), kw("'max'", 'stale-while-revalidate: old once, then new'),
      kw('redirect()', 'throws NEXT_REDIRECT'), kw('Stale after write', 'database right, page old'),
      kw('Write → revalidate → redirect', 'the action pattern'), kw('Fail closed', 'a guard with no secret refuses'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: revalidatePath; revalidateTag with a profile, two arguments in sixteen; updateTag, read your own write; max, stale-while-revalidate; redirect, which throws; stale after write; the write, revalidate, redirect pattern; and failing closed.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a static list + an action that writes and ${c('redirect')}s; add a row and reload — still old?`,
      `Add ${c("revalidatePath('/your/list')")} before ${c('redirect')}; repeat`,
      `Tag a ${c('fetch')}; compare ${c("revalidateTag(tag, 'max')")} with ${c('updateTag(tag)')}`,
      `Wrap ${c('redirect()')} in ${c('try/catch')}, watch it stop working, then move it out`,
    ]), box('Keep these', `<ul><li>Every write must revalidate what shows it</li><li>One URL ⇒ path · shared data ⇒ tag</li><li>16: <code>revalidateTag</code> needs 2 args</li><li>Own write, now ⇒ <code>updateTag</code></li><li><code>redirect()</code> last, outside try/catch</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a static list and an action that writes and redirects, then add a row and reload; add revalidatePath before redirect and repeat; tag a fetch and compare revalidateTag with max against updateTag; and wrap redirect in a try-catch to watch it stop working. Keep: every write revalidates what shows it; one URL means path, shared data means tag; revalidateTag needs two arguments in sixteen; your own write right now means updateTag; and redirect goes last, outside try-catch.' },
];
export const slides = lamDeck({ chuong: 'Chapter 12 — Server Actions', bai: '12.3' }, S);
