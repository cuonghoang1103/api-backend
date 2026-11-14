/*DU_LIEU*/
const DU_LIEU = {
 "n12-2:file:prisma/schema.prisma": "// prisma/schema.prisma — bài 12.2: Note có thêm body (form có title + body)\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\nmodel Note {\n  id    Int    @id @default(autoincrement())\n  title String\n  body  String @default(\"\")\n}\n",
 "n12-2:file:src/app/posts/new/page.tsx": "// app/posts/new/page.tsx — mã của bài + kiểu + hai import + kiểm (vẫn là Server Component, KHÔNG 'use client')\nimport { redirect } from 'next/navigation';\nimport { db } from '@/lib/db';\n\nexport default function NewPost() {\n  async function createPost(formData: FormData) {\n    'use server';\n    const title = formData.get('title');   // đọc theo name của input\n    const body = formData.get('body');\n    if (typeof title !== 'string' || !title.trim() || typeof body !== 'string') return;\n    console.log('[action] createPost:', title);\n    await db.note.create({ data: { title, body } });\n    redirect('/posts');                    // sang danh sách sau đó\n  }\n\n  return (\n    <form action={createPost} className=\"flex flex-col gap-2 p-4 text-xl\">\n      <input name=\"title\" className=\"border px-2\" placeholder=\"tiêu đề\" />\n      <textarea name=\"body\" className=\"border px-2\" placeholder=\"nội dung\" />\n      <button type=\"submit\" className=\"border px-3 bg-zinc-100\">Publish</button>\n    </form>\n  );\n}\n",
 "n12-2:bai": "$ npx tsc --noEmit      # đoạn mã của bài, chép nguyên\nposts/new/page.tsx(3,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.\nposts/new/page.tsx(7,11): error TS2304: Cannot find name 'db'.\nposts/new/page.tsx(8,5): error TS2304: Cannot find name 'redirect'.",
 "n12-2:file:src/app/posts/page.tsx": "// app/posts/page.tsx — danh sách (force-dynamic: chuyện cache để bài 12.3)\nimport Link from 'next/link';\nimport { db } from '@/lib/db';\n\nexport const dynamic = 'force-dynamic';\n\nexport default async function Posts() {\n  const notes = await db.note.findMany({ orderBy: { id: 'desc' }, take: 4 });\n  return (\n    <main className=\"p-4 text-xl\">\n      <h1 className=\"font-bold\">Bài viết</h1>\n      <ul id=\"ds\">{notes.map((n) => <li key={n.id}>#{n.id} {n.title}</li>)}</ul>\n      <Link href=\"/posts/new\" className=\"underline\">+ Viết bài</Link>\n    </main>\n  );\n}\n",
 "n12-2:file:src/app/posts/actions.ts": "'use server';\n// app/posts/actions.ts — action sửa bài: id tới qua .bind, formData theo sau\nimport { db } from '@/lib/db';\n\nexport async function updatePost(id: number, formData: FormData) {\n  const title = formData.get('title');\n  console.log('[bind] sửa id =', id, '· title =', title);\n  if (typeof title !== 'string') return;\n  await db.note.update({ where: { id }, data: { title } });\n}\n",
 "n12-2:file:src/app/posts/[id]/sua/page.tsx": "// app/posts/[id]/sua/page.tsx — truyền id thêm cho action: .bind (như bài) và closure (để so)\nimport { notFound } from 'next/navigation';\nimport { db } from '@/lib/db';\nimport { updatePost } from '../../actions';\n\nexport default async function Sua({ params }: PageProps<'/posts/[id]/sua'>) {\n  const { id } = await params;\n  const note = await db.note.findUnique({ where: { id: Number(id) } });\n  if (!note) notFound();\n  const noteId = note.id;\n\n  async function luuClosure(formData: FormData) {\n    'use server';\n    console.log('[closure] sửa id =', noteId, '· title =', formData.get('title'));\n  }\n\n  return (\n    <main className=\"flex flex-col gap-3 p-4 text-xl\">\n      <form id=\"bind\" action={updatePost.bind(null, note.id)} className=\"flex gap-2\">\n        <input name=\"title\" defaultValue={note.title} className=\"border px-2\" />\n        <button className=\"border px-3\">Lưu (bind)</button>\n      </form>\n      <form id=\"closure\" action={luuClosure} className=\"flex gap-2\">\n        <input name=\"title\" defaultValue={note.title} className=\"border px-2\" />\n        <button className=\"border px-3\">Lưu (closure)</button>\n      </form>\n    </main>\n  );\n}\n",
 "n12-2:file:src/app/truong/page.tsx": "// app/truong/page.tsx — FormData nhận được gì từ từng loại ô\nexport default function Truong() {\n  async function xem(formData: FormData) {\n    'use server';\n    for (const [k, v] of formData.entries())\n      if (!k.startsWith('$ACTION')) console.log(`[truong] ${k} =`, JSON.stringify(v), typeof v);\n    console.log('[truong] get(dongY) =', formData.get('dongY'), '· get(ghiChu) =', formData.get('ghiChu'));\n  }\n  return (\n    <form action={xem} className=\"flex flex-col gap-2 p-4 text-xl\">\n      <input name=\"title\" defaultValue=\"Bài A\" className=\"border px-2\" />\n      <input id=\"ghiChu\" defaultValue=\"ô này quên name\" className=\"border px-2\" />\n      <input name=\"tuoi\" type=\"number\" defaultValue={5} className=\"border px-2\" />\n      <label><input name=\"dongY\" type=\"checkbox\" /> đồng ý</label>\n      <select name=\"muc\" defaultValue=\"2\" className=\"border\"><option value=\"1\">Một</option><option value=\"2\">Hai</option></select>\n      <button className=\"border px-3\">Gửi</button>\n    </form>\n  );\n}\n",
 "n12-2:sua": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/posts|/truong|Static|Dynamic'\n✓ Compiled successfully in 4.0s\n├ ƒ /posts\n├ ƒ /posts/[id]/sua\n├ ○ /posts/new\n└ ○ /truong\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ curl -s localhost:3000/posts/new | grep -oE '<(form|input|textarea)[^>]*>'      # HTML máy chủ (chưa có JS)\n<form action=\"\" encType=\"multipart/form-data\" method=\"POST\">\n<input type=\"hidden\" name=\"$ACTION_ID_4010ec…\"/>\n<input placeholder=\"tiêu đề\" name=\"title\"/>\n<textarea name=\"body\" placeholder=\"nội dung\">",
 "n12-2:trinh-duyet": "$ Chromium: Publish có JS · Publish TẮT JS · /truong bấm Gửi — log next start\n[action] createPost: Bài có JS\n[action] createPost: Bài TẮT JS\n[truong] title = \"Bài A\" string\n[truong] tuoi = \"5\" string\n[truong] muc = \"2\" string\n[truong] get(dongY) = null · get(ghiChu) = null",
 "n12-2:khong-js": "$ ID=<id trong ô ẩn $ACTION_ID_>; curl -i -X POST localhost:3000/posts/new -F \"\\$ACTION_ID_$ID=\" -F title='Bài từ curl' -F body=x      # đúng thứ trình duyệt TẮT JS gửi\nHTTP/1.1 303 See Other\nLocation: /posts\n$ curl -s localhost:19392/posts | grep -oE '<li>[^<]*(<!-- -->[^<]*)*</li>' | sed 's/<!-- -->//g; s/<[^>]*>//g' | head -3\n#1015 Bài từ curl\n#1014 Bài TẮT JS\n#1013 Bài có JS",
 "n12-2:bind": "$ curl -s localhost:3000/posts/12/sua | grep -oE '<input type=\"hidden\"[^>]*>'      # form .bind và form closure, HTML máy chủ\n<form id=\"bind\">\n<input type=\"hidden\" name=\"$ACTION_REF_2\"/>\n<input type=\"hidden\" name=\"$ACTION_2:0\" value=\"{\"id\":\"60d158…\",\"bound\":\"$@1\"}\"/>\n<input type=\"hidden\" name=\"$ACTION_2:1\" value=\"[12]\"/>\n<form id=\"closure\">\n<input type=\"hidden\" name=\"$ACTION_REF_3\"/>\n<input type=\"hidden\" name=\"$ACTION_3:0\" value=\"{\"id\":\"60ee61…\",\"bound\":\"$@1\"}\"/>\n<input type=\"hidden\" name=\"$ACTION_3:1\" value=\"[\"$@2\"]\"/>\n<input type=\"hidden\" name=\"$ACTION_3:2\" value=\"\"XmNABhrmgMS0U4PR…\"\"/>\n$ node -e 'note 12, note 13 trước'\n#12 Ghi chú số 12 · #13 Ghi chú số 13\n$ curl -X POST localhost:3000/posts/12/sua   # gửi lại ĐÚNG form .bind của note 12, chỉ đổi ô ẩn \"[12]\" thành \"[13]\"\nHTTP 200\n$ node -e 'note 12, note 13 sau'\n#12 Ghi chú số 12 · #13 bị sửa trộm qua bind\n$ curl -X POST localhost:3000/posts/12/sua   # form closure: gửi lại nguyên khối mã hoá, rồi sửa 1 ký tự của nó\nHTTP 200   ← khối nguyên\nHTTP 500   ← khối bị sửa 1 ký tự\n$ grep '\\[bind\\]\\|\\[closure\\]\\|Cipher' (log next start)\n[bind] sửa id = 13 · title = bị sửa trộm qua bind\n[closure] sửa id = 12 · title = thử closure\n[Error: Cipher job failed]\n[Error: Cipher job failed]",
 "anh-nxj-12-2:js-truoc": {
  "url": "http://127.0.0.1:19392/posts/new",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-2:js": {
  "url": "http://127.0.0.1:19392/posts/new",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/posts/new",
    "ma": 200,
    "loai": "document",
    "kt": 8182
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0j-tmk5j8p08k.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15128
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0iumlkwknlbd6.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19392/posts/new",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "na": "4010ecf92d2787f80e8183e48981acf929f482c298",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryf6qT9wtBph7BXsCl",
    "ct": "text/x-component",
    "than": "------WebKitFormBoundaryf6qT9wtBph7BXsCl\r\nContent-Disposition: form-data; name=\"_1_$ACTION_ID_4010ecf92d2787f80e8183e48981acf929f482c298\"\r\n\r\n\r\n------WebKitFormBoundaryf6qT9wtBph7BXsCl\r\nContent-Disposition: form-data; name=\"_1_title\"\r\n\r\nBài có JS\r\n------WebKitFormBoundaryf6qT9wtBph7BXsCl\r\nContent-Dis",
    "ms": 723,
    "ve": 805
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3zt_16xndew4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 7862
   },
   {
    "url": "http://127.0.0.1:19392/posts/new?_rsc=pQ1of4f_wOzXz5Ba",
    "ma": 200,
    "loai": "fetch",
    "kt": 486
   },
   {
    "url": "http://127.0.0.1:19392/posts/new?_rsc=GA2-YDcLgXXz82mA",
    "ma": 200,
    "loai": "fetch",
    "kt": 3936
   }
  ],
  "console": [],
  "ketQua": {
   "sau": "{\"url\":\"/posts\",\"giu\":42,\"dieuHuong\":1}"
  }
 },
 "anh-nxj-12-2:khong-js-truoc": {
  "url": "http://127.0.0.1:19392/posts/new",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-2:khong-js": {
  "url": "http://127.0.0.1:19392/posts/new",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/posts/new",
    "ma": 200,
    "loai": "document",
    "kt": 8182
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0j-tmk5j8p08k.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15128
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19392/posts/new",
    "ma": 303,
    "loai": "document",
    "kt": 0,
    "pt": "POST",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundarywUARqHfdAoyRG3AC",
    "than": "------WebKitFormBoundarywUARqHfdAoyRG3AC\r\nContent-Disposition: form-data; name=\"$ACTION_ID_4010ecf92d2787f80e8183e48981acf929f482c298\"\r\n\r\n\r\n------WebKitFormBoundarywUARqHfdAoyRG3AC\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\nBài TẮT JS\r\n------WebKitFormBoundarywUARqHfdAoyRG3AC\r\nContent-Disposit",
    "ms": 631,
    "ve": 650
   },
   {
    "url": "http://127.0.0.1:19392/posts",
    "ma": 200,
    "loai": "document",
    "kt": 7733
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0j-tmk5j8p08k.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15128
   }
  ],
  "console": []
 },
 "anh-nxj-12-2:truong-truoc": {
  "url": "http://127.0.0.1:19392/truong",
  "vp": [
   760,
   340
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-2:truong": {
  "url": "http://127.0.0.1:19392/truong",
  "vp": [
   760,
   340
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/truong",
    "ma": 200,
    "loai": "document",
    "kt": 8321
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0j-tmk5j8p08k.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15128
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0iumlkwknlbd6.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19392/truong",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "na": "4082bd04492335c5c5d5b80c8b836717e4ab95202e",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundary0PdWUd1mBImOQ8RY",
    "ct": "text/x-component",
    "than": "------WebKitFormBoundary0PdWUd1mBImOQ8RY\r\nContent-Disposition: form-data; name=\"_1_$ACTION_ID_4082bd04492335c5c5d5b80c8b836717e4ab95202e\"\r\n\r\n\r\n------WebKitFormBoundary0PdWUd1mBImOQ8RY\r\nContent-Disposition: form-data; name=\"_1_title\"\r\n\r\nBài A\r\n------WebKitFormBoundary0PdWUd1mBImOQ8RY\r\nContent-Disposi",
    "ms": 653,
    "ve": 668
   }
  ],
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-12-2', code: 'NXJ 12.2', title: 'Forms that submit to a Server Action', sub: 'Chapter 12 · Lesson 12.2' };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-12-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const O = (k) => { const v = DU_LIEU[`n12-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-12-2', ten, { vp: 760, ...o });
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };

// đoạn mã của bài (bài web) — chép nguyên vào page.tsx: tsc đo ở khối "bai"
const BAI = `// app/posts/new/page.tsx — a Server Component
export default function NewPost() {
  async function createPost(formData) {
    'use server';
    const title = formData.get('title');
    const body  = formData.get('body');
    await db.post.create({ data: { title, body } });
    redirect('/posts');
  }
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="body" />
      <button type="submit">Publish</button>
    </form>
  );
}`;
// ── số đo
const TSC = dongs('bai', /error TS/);
const BUILD = dongs('sua', /^[├└┌] [○ƒ] \/(posts|truong)/);
const HTML = doan('sua', 'HTML máy chủ');
const LOG = dongs('trinh-duyet', /^\[(action|truong)\]/);
const TRUONG = LOG.filter((l) => /^\[truong\]/.test(l));
const CURL = doan('khong-js', 'curl -i');
const DS = doan('khong-js', "grep -oE '<li>");
const HID = doan('bind', 'form .bind và form closure');
const TRUOC = doan('bind', 'note 12, note 13 trước')[0], SAU = doan('bind', 'note 12, note 13 sau')[0];
const TAMPER = doan('bind', 'chỉ đổi ô ẩn')[0];
const CLO = doan('bind', 'form closure: gửi lại');
const BLOG = dongs('bind', /^\[(bind|closure)\]|Cipher/);
const mang = (k) => AN(k).mang || [];
const MJ = mang('js').filter((m) => m.pt === 'POST'), MK = mang('khong-js').filter((m) => m.loai === 'document');
const SAU_JS = JSON.parse(AN('js').ketQua.sau);
if (TSC.length !== 3 || !/TS7006/.test(TSC[0]) || !/'db'/.test(TSC[1]) || !/'redirect'/.test(TSC[2])) throw new Error('tsc bài đổi');
if (!/○ \/posts\/new/.test(BUILD.join('|'))) throw new Error('build đổi');
if (!HTML.some((l) => /ACTION_ID_/.test(l)) || !HTML.some((l) => /method="POST"/.test(l))) throw new Error('HTML form đổi');
if (!TRUONG.some((l) => /tuoi = "5" string/.test(l)) || !TRUONG.some((l) => /get\(dongY\) = null · get\(ghiChu\) = null/.test(l)) || TRUONG.some((l) => /ghiChu =/.test(l))) throw new Error('FormData đổi');
if (!/^HTTP\/1\.1 303/.test(CURL[0]) || !/^Location: \/posts/i.test(CURL[1])) throw new Error('curl 303 đổi');
if (MJ.length !== 1 || MJ[0].ct !== 'text/x-component' || SAU_JS.url !== '/posts' || SAU_JS.giu !== 42 || SAU_JS.dieuHuong !== 1) throw new Error('có JS đổi');
if (!MK.some((m) => m.pt === 'POST' && m.ma === 303) || !MK.some((m) => /\/posts$/.test(m.url) && m.ma === 200)) throw new Error('tắt JS đổi');
if (!/#13 bị sửa trộm/.test(SAU) || !/200/.test(TAMPER) || !/200.*nguyên/.test(CLO[0]) || !/500.*sửa/.test(CLO[1]) || !BLOG.some((l) => /\[bind\] sửa id = 13/.test(l))) throw new Error('bind/closure đổi');

const SUA_NEW = goc(bo(F('src/app/posts/new/page.tsx'))).replace(/ className="[^"]*"/g, '');
const SL = SUA_NEW.split('\n'), sa = SL.findIndex((l) => /async function createPost/.test(l));
const SUA_ACT = [...SL.filter((l) => /^import /.test(l)), '', ...SL.slice(sa, SL.findIndex((l, i) => i > sa && l === '  }') + 1).filter((l) => !/console\.log/.test(l)).map((l) => l.replace(/^  /, ''))]
  .join('\n').replace(" || typeof body !== 'string') return;", "\n      || typeof body !== 'string') return;");
const BAI_GON = BAI.split('\n').slice(0, 9).join('\n') + '\n  return ( <form action={createPost}> … </form> );\n}';
const ACT = goc(bo(F('src/app/posts/actions.ts')));
const SUA = goc(bo(F('src/app/posts/[id]/sua/page.tsx'))).replace(/ className="[^"]*"/g, '');
const SUL = SUA.split('\n');
const dedent = (ls) => { const m = Math.min(...ls.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length)); return ls.map((l) => l.slice(m)).join('\n'); };
const fb = SUL.findIndex((l) => /<form id="bind"/.test(l)), ca = SUL.findIndex((l) => /const noteId/.test(l));
const FORM_BIND = dedent(SUL.slice(fb, fb + 4));
const CLOSURE = dedent([SUL[ca], ...SUL.slice(ca + 2, SUL.findIndex((l, i) => i > ca + 2 && l === '  }') + 1)]).replace(", '· title =', formData.get('title'));", ', …);');
const SUA_FORM_CU = SUA.split('\n').filter((l) => /<form id=|<input name|<button|<\/form>|luuClosure\(formData|noteId = note|'use server'|console\.log\('\[closure/.test(l)).map((l) => l.replace(/^ {4,}/, '  ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 12 · Lesson 12.2', t: 'Forms that submit<br>to a Server Action', sub: '&lt;form action={fn}&gt;: the fields arrive as FormData. Measured: what the server sends before any JS, what FormData holds, the form with JS on and off, and whether a bound id is really hidden',
    en: 'Lesson twelve point two: forms that submit to a Server Action. Pass the action to a form, and the fields arrive on the server as FormData. We measure the HTML the server sends before any JavaScript, what FormData really holds, the same form with JavaScript on and off, and whether an id passed with bind is really hidden.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The lesson's form, compiled — three <code>tsc</code> errors, and the fixed page (still a Server Component)</li>
    <li>The HTML before any JS: a real <code>POST</code> form with a hidden action id</li>
    <li><code>FormData</code>: strings, and the fields that silently go missing</li>
    <li>JS on: one fetch, no reload · JS off: <code>303</code> and a full page — both work</li>
    <li><code>.bind(null, id)</code>: the id <b>is</b> in a hidden input — and it can be changed</li></ul>`,
    en: 'Five takeaways: the lesson\'s form compiled, with three tsc errors and the fixed page that stays a Server Component; the HTML before any JavaScript — a real POST form with a hidden action id; what FormData contains, and which fields silently go missing; JavaScript on means one fetch and no reload, off means a 303 and a full page, and both work; and bind — the id is in a hidden input, and it can be changed.' },
  { t: "The lesson's form, compiled: three tsc errors", body: two(D(tsx(BAI_GON, { sm: true, hl: [3, 7, 8] }),
      tn(['$ npx tsc --noEmit   # copied as written', ...TSC.map((l) => l.replace(/^posts\/new\/page\.tsx/, 'page.tsx'))].join('\n'), { fs: 13, wrap: 56, title: 'tsc (real)' })),
    D(tsx(SUA_ACT, { sm: true, hl: [1, 2, 4, 8] }),
      box('Fixes', '<code>formData: FormData</code> · import <code>db</code> and <code>redirect</code> (from <code>next/navigation</code>) · check both values are strings (TS2322, as in 12.1). Still no <code>\'use client\'</code>: a Server Component.', 'xanh')), ''),
    en: 'The lesson\'s form, compiled. Copied as written, tsc reports three errors: formData is implicitly any, and neither db nor redirect exists. Fix them: type FormData, import db, import redirect from next slash navigation, and check that both values are strings. The page stays a Server Component — no use client anywhere.' },
  { t: 'Before any JavaScript: what the server sends', body: two(D(tn(['$ npm run build', ...BUILD, '$ curl -s localhost:3000/posts/new | grep -oE \'<(form|input|textarea)…>\'', ...HTML].join('\n'), { fs: 14, wrap: 64, title: 'next build + curl (real)' })),
    D(box('Read it', 'The page is static (○), yet the HTML already holds a real form: <code>method="POST"</code>, <code>encType="multipart/form-data"</code>, an empty <code>action</code> (= this URL) and a hidden input named <code>$ACTION_ID_…</code>. A browser with no JavaScript knows everything it needs to submit.', 'xanh'),
      box('Why it matters', 'This is the difference from an <code>onSubmit</code> + <code>fetch</code> form (Lesson 4.3): without JS that form does nothing — or reloads the page with <code>?title=…</code> in the URL.', 'lam')), 'r64'),
    en: 'Before any JavaScript, what does the server send? The page is static, yet its HTML already holds a real form: method POST, multipart encoding, an empty action meaning this URL, and a hidden input named after the action id. A browser with no JavaScript knows everything it needs to submit — unlike an onSubmit and fetch form.' },
  { t: 'What FormData actually contains (measured)', body: two(D(B('truong-truoc', { url: 'localhost:3000/truong', h: 340, w: 520 })),
    D(tn(['$ (the action logs every entry of formData)', ...TRUONG].join('\n'), { fs: 14, wrap: 64, title: 'next start log (real)' }),
      cmp(['Field', 'in FormData'], [
        ['<code>name="tuoi" type="number"</code>', '<code>"5"</code> — a <b>string</b>'],
        ['checkbox, not ticked', 'absent — <code>get()</code> → <code>null</code>, not <code>false</code>'],
        ['input with <b>no</b> <code>name</code>', 'absent — <code>null</code>, though it shows text'],
        ['<code>&lt;select name="muc"&gt;</code>', 'the option <code>value</code>, <code>"2"</code>'],
      ])), 'r46'),
    en: 'What FormData actually contains. Every value is text: the number field arrives as the string five. An unticked checkbox is not false — it is absent, so get returns null. An input without a name is absent too, even though it visibly holds text. A select sends its option value. Convert and validate every field — chapter sixteen does it with Zod.' },
  { t: 'Progressive enhancement: JS on vs JS off', body: two(D(B('js-truoc', { url: 'localhost:3000/posts/new · JS on', h: 230, w: 540 }),
      cmp(['JS on (Chromium)', 'measured'], [
        ['request', `fetch <code>POST /posts/new</code> · ${MJ[0].ct}`],
        ['after <code>redirect(\'/posts\')</code>', `URL <code>${SAU_JS.url}</code>, no new page load`],
        ['<code>window.__giu</code> set before', `still <code>${SAU_JS.giu}</code> · navigation entries ${SAU_JS.dieuHuong}`],
      ])),
    D(B('khong-js-truoc', { url: 'localhost:3000/posts/new · JS off', h: 230, w: 540 }),
      cmp(['JS off (Chromium)', 'measured'], MK.map((m) => [m.pt ? `<code>${m.pt}</code> /posts/new` : `<code>GET</code> ${m.url.replace(/^https?:\/\/[^/]+/, '')}`, `document · <b>${m.ma}</b>`]))), ''),
    en: 'Progressive enhancement, measured on the same form. With JavaScript on, the submit is a fetch POST answered with an RSC stream; after redirect the URL is slash posts, a variable set before submitting is still there, and there is still one navigation entry — no page load. With JavaScript off, the browser does a document POST, gets a three oh three, and loads slash posts as a full page. Both work.' },
  { t: 'Without JavaScript, as curl sees it', body: two(D(tn([`$ curl -i -X POST localhost:3000/posts/new \\\n    -F '$ACTION_ID_<id>=' -F 'title=Bài từ curl' -F body=x`, ...CURL, '$ curl -s localhost:3000/posts   # the list', ...DS].join('\n'), { fs: 15, wrap: 64, title: 'curl (real)' })),
    D(seq(['browser (no JS)', 'Next.js', 'createPost'], [[0, 1, 'POST /posts/new (form fields)'], [1, 2, 'run the action'], [2, 1, "redirect('/posts')", '#1f8a3b', true], [1, 0, '303 See Other · Location: /posts', '#1f8a3b', true], [0, 1, 'GET /posts (a full page)']], { w: 520, rh: 46, fs: 15, top: 58 }),
      box('Read it', '<code>redirect()</code> becomes a plain HTTP <b>303</b> for a no-JS form: the browser follows it with a GET. With JS the same <code>redirect()</code> travels inside the RSC response instead. You write it once.', 'xanh')), 'r46'),
    en: 'Without JavaScript, as curl sees it. Posting the form fields with the hidden action id runs the action, and redirect becomes a plain three oh three See Other with location slash posts. The browser follows it with a GET for a full page. With JavaScript, the same redirect travels inside the RSC response. You write it once.' },
  { t: 'An extra argument: .bind(null, id)', body: tsx(ACT, { sm: true, hl: [4] }) + two(D(tsx(FORM_BIND, { sm: true, hl: [1] })), D(tsx(CLOSURE, { sm: true, hl: [1, 5] })), '') + box('How it works', '<code>.bind(null, note.id)</code> makes a new function whose <b>first</b> argument is fixed; the form then calls it with <code>formData</code> second. A closure — an inline action that uses <code>noteId</code> from the page — is the other way to pass data that is not a form field. Which one hides the id? Next slide.', 'lam'),
    en: 'An extra argument: bind. updatePost takes the id first and formData second; the form passes updatePost dot bind with null and the note id. The bound value arrives as the first argument. A closure — an inline action that uses a variable from the page — is the other way to give an action data that is not a form field.' },
  { t: 'Is a bound id hidden? Measured: no', body: two(D(tn(['$ curl -s localhost:3000/posts/12/sua   # the hidden inputs', ...HID].join('\n'), { fs: 13, wrap: 68, title: 'HTML of /posts/12/sua (real)' }),
      tn(['# before', TRUOC, '# resend the .bind form of note 12 with the hidden "[12]" changed to "[13]"', TAMPER, '# after', SAU, ...BLOG.slice(0, 1)].join('\n'), { fs: 13, wrap: 68, title: 'curl + database (real)' })),
    D(box('Read it', 'With <code>.bind</code> the id sits in plain sight: <code>$ACTION_…:1 = [12]</code>. Changing it to <code>[13]</code> made the action update <b>note 13</b> from the page of note 12.', 'do2'),
      tn(CLO.join('\n'), { fs: 13, wrap: 52, title: 'closure form, resent (real)' }),
      box('Closure', 'A variable captured by an inline action is <b>encrypted</b> into the page; one changed character ⇒ 500 (<code>Cipher job failed</code>). Still not a permission check — the same page can be replayed. Check ownership inside the action (12.5).', 'lam')), 'r64'),
    en: 'Is a bound id hidden? Measured: no. With bind, the id sits in a plain hidden input holding twelve. Resending the form with thirteen made the action update note thirteen from the page of note twelve. A closure variable is encrypted into the page — changing one character gives a five hundred — but it can still be replayed. Either way, check ownership inside the action, lesson twelve point five.' },
  { t: 'Traps: the field that is not there', body: icards([
      ['warn', 'An input with no <code>name</code>', 'Visible, typed into, and absent from <code>FormData</code> — the action reads <code>null</code> and your validation says "title is required". Check the <code>name</code> first.'],
      ['check', 'An unticked checkbox', 'Not <code>"false"</code>: the key is missing. Read it as <code>formData.get(\'dongY\') === \'on\'</code>.'],
      ['type', 'Numbers and dates', 'Text, always: <code>"5"</code>, <code>"2026-11-14"</code>. Convert and validate — Zod in Chapter 16.'],
      ['lock', 'Ids from the page', 'Hidden inputs and <code>.bind</code> values are editable. The server decides who may change what.'],
    ], 2),
    en: 'Traps: the field that is not there. An input without a name is visible and typed into, but absent from FormData, so your validation complains about a field the user can see. An unticked checkbox is a missing key, not false. Numbers and dates are always text. And ids from the page, hidden or bound, are editable: the server decides who may change what.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('form action', 'pass a Server Action to &lt;form&gt;'), kw('FormData', 'the named fields, all strings'),
      kw('formData.get', 'one field by name, or null'), kw('Progressive enhancement', 'works with JS off: POST + 303'),
      kw('redirect()', '303 without JS, inside the RSC with JS'), kw('.bind(null, id)', 'an extra first argument — editable'),
      kw('Closure capture', 'encrypted into the page'), kw('Server validation', 'every field, every time'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: form action; FormData; formData dot get; progressive enhancement; redirect, a three oh three without JavaScript; bind, an extra first argument that is editable; closure capture, encrypted into the page; and server validation of every field.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build ${c('/posts/new')} as a Server Component with ${c('<form action={createPost}>')}; fix the three ${c('tsc')} errors`,
      `${c('curl')} the page: find ${c('method="POST"')} and ${c('$ACTION_ID_')}`,
      `Turn JavaScript off in DevTools and submit — watch the ${c('303')}`,
      `Add a ${c('.bind(null, id)')} edit form; change the hidden ${c('[12]')} and see what the action receives`,
    ]), box('Keep these', `<ul><li>A form action works with JS off</li><li>FormData = named fields, all strings</li><li>No name / unticked ⇒ missing (null)</li><li><code>redirect()</code>: 303 or in-stream</li><li>Bound ids are visible — authorize on the server</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the new-post page as a Server Component and fix the three tsc errors; curl the page and find the POST form and the hidden action id; turn JavaScript off and submit, watching the three oh three; and add a bind edit form, change the hidden id and see what the action receives. Keep: a form action works with JavaScript off, FormData holds named fields as strings, a missing name or unticked box means null, redirect is a three oh three or travels in the stream, and bound ids are visible, so authorize on the server.' },
];
export const slides = lamDeck({ chuong: 'Chapter 12 — Server Actions', bai: '12.2' }, S);
