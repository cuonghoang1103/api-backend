/*DU_LIEU*/
const DU_LIEU = {
 "n12-1:file:src/app/ghi-chu/page.tsx": "// app/ghi-chu/page.tsx — Server Component + Server Action viết NGAY TRONG nó (sửa 2: kiểm title là chuỗi)\nimport { db } from '@/lib/db';\nimport { NutCham } from './NutCham';\n\nasync function createPost(formData: FormData) {\n  'use server';\n  const DAU = 'chuoi-chi-o-may-chu-12-1';   // chuỗi để tìm trong .next\n  const title = formData.get('title');      // FormDataEntryValue | null\n  if (typeof title !== 'string' || !title.trim()) return;\n  console.log('[action] createPost ở MÁY CHỦ:', title, DAU);\n  await db.note.create({ data: { title } });\n}\n\nexport default async function Trang() {\n  const notes = await db.note.findMany({ orderBy: { id: 'asc' } });\n  return (\n    <main className=\"p-4 text-xl\">\n      <form action={createPost} className=\"flex gap-2\">\n        <input name=\"title\" className=\"border px-2\" placeholder=\"tiêu đề\" />\n        <button className=\"border px-3 bg-zinc-100\">Lưu</button>\n      </form>\n      <ul id=\"ds\" className=\"mt-3\">{notes.map((n) => <li key={n.id}>#{n.id} {n.title}</li>)}</ul>\n      <NutCham />\n    </main>\n  );\n}\n",
 "n12-1:file:src/lib/db.ts": "// lib/db.ts — client Prisma dùng chung (SQLite của phòng thí nghiệm, bảng Note)\nimport { PrismaClient } from '@prisma/client';\nexport const db = new PrismaClient();\n",
 "n12-1:bai": "$ npx tsc --noEmit      # đoạn mã của bài, chép nguyên\nghi-chu/page.tsx(2,27): error TS7006: Parameter 'formData' implicitly has an 'any' type.\nghi-chu/page.tsx(5,9): error TS2304: Cannot find name 'db'.\n$ npx tsc --noEmit      # sửa 1: FormData + db\nghi-chu/page.tsx(7,34): error TS2322: Type 'FormDataEntryValue | null' is not assignable to type 'string'.\n  Type 'null' is not assignable to type 'string'.",
 "n12-1:file:src/app/ghi-chu/actions.ts": "'use server';\n// app/ghi-chu/actions.ts — cả tệp là Server Action (chỉ thị ở ĐẦU TỆP)\nimport { db } from '@/lib/db';\n\nconst gio = () => new Date().toTimeString().slice(0, 8) + '.' + String(Date.now() % 1000).padStart(3, '0');\n\nexport async function themTuNut(title: string) {\n  console.log(`[action] themTuNut ${gio()} · title = ${title}`);\n  const n = await db.note.create({ data: { title } });\n  return n.id;\n}\n\nexport async function cham(lan: number) {\n  console.log(`[action] cham #${lan} BẮT ĐẦU ${gio()}`);\n  await new Promise((r) => setTimeout(r, 1000));\n  console.log(`[action] cham #${lan} XONG    ${gio()}`);\n  return lan;\n}\n\nexport async function nhanGi(x: unknown) {\n  console.log('[action] nhanGi nhận:', Object.prototype.toString.call(x), x instanceof Date ? x.toISOString() : String(x));\n  return 'ok';\n}\n\nexport async function khongAiGoi() {\n  console.log('[action] không component nào import hàm này');\n}\n",
 "n12-1:file:src/app/ghi-chu/NutCham.tsx": "'use client';\n// app/ghi-chu/NutCham.tsx — gọi action từ mã client, như một hàm async bình thường\nimport { useRef, useState } from 'react';\nimport { themTuNut, cham, nhanGi } from './actions';\n\nexport function NutCham() {\n  const [kq, setKq] = useState('');\n  const lan = useRef(0);\n\n  async function them() {\n    const id = await themTuNut('từ nút bấm');   // một lời gọi hàm = một POST\n    setKq('id mới: ' + id);\n  }\n  async function goiCham() {\n    const i = ++lan.current;\n    console.log('[trình duyệt] gọi cham', i);\n    setKq('xong #' + (await cham(i)));\n  }\n  async function guiDate() {\n    setKq('Date: ' + (await nhanGi(new Date('2026-11-14T05:00:00Z'))));\n  }\n  async function guiHam() {\n    try { await nhanGi((() => 1) as unknown); }\n    catch (e) { setKq('lỗi: ' + (e as Error).message); }\n  }\n  return (\n    <div className=\"mt-3 flex flex-wrap gap-2\">\n      <button id=\"them\" className=\"border px-3\" onClick={them}>Thêm từ nút</button>\n      <button id=\"cham\" className=\"border px-3\" onClick={goiCham}>Gọi chậm</button>\n      <button id=\"ngay\" className=\"border px-3\" onClick={guiDate}>Gửi Date</button>\n      <button id=\"ham\" className=\"border px-3\" onClick={guiHam}>Gửi hàm</button>\n      <span id=\"kq\" className=\"w-full text-lg\">{kq}</span>\n    </div>\n  );\n}\n",
 "n12-1:may-chu": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|ghi-chu|Static|Dynamic'\n✓ Compiled successfully in 8.3s\n└ ○ /ghi-chu\n○  (Static)  prerendered as static content\n$ node -e 'in id các action trong .next/server/server-reference-manifest.json'\n40796bdc2b832cf22b7d098e49ef674bee2c008b3c · $$RSC_SERVER_ACTION_0 · app/ghi-chu/page\n408b561d9fd37b6d2182f4e7de1cbab663465a65cd · themTuNut · app/ghi-chu/page\n40cad8597f63cd28683552554537f431b81699255c · cham · app/ghi-chu/page\n40cb024931779e4051e385f6346c9092b46f15535f · nhanGi · app/ghi-chu/page\n$ grep -rl 'chuoi-chi-o-may-chu-12-1' .next/static | wc -l      # thân hàm action có xuống trình duyệt không?\nthân action trong .next/static (gửi xuống trình duyệt): 0\nthân action trong .next/server: 2\n$ grep id của từng action trong .next/static\n$$RSC_SERVER_ACTION_0 · id trong .next/static: 0 tệp\nthemTuNut · id trong .next/static: 1 tệp\ncham · id trong .next/static: 1 tệp\nnhanGi · id trong .next/static: 1 tệp\n$ curl -s localhost:3000/ghi-chu | grep -o 'name=\"\\$ACTION_ID_[0-9a-f]*\"'      # HTML máy chủ\nname=\"$ACTION_ID_40796b…\"",
 "n12-1:curl": "$ ID=<id của themTuNut>; curl -X POST localhost:3000/ghi-chu -H \"Next-Action: $ID\" -H 'content-type: text/plain' -d '[\"curl gọi thẳng, không bấm nút\"]'\nHTTP 200 · text/x-component\n:\"$@1\",\"q\":\"\",\"i\":false,\"b\":\"A15lGcm2KxiP7YuS2YxJF\"}\n1:1010\n$ grep '\\[action\\]' (log next start)\n[action] themTuNut 05:19:12.128 · title = curl gọi thẳng, không bấm nút",
 "n12-1:trinh-duyet": "$ Chromium: bấm Lưu (form) · bấm \"Thêm từ nút\" · bấm \"Gọi chậm\" 3 lần liền — log next start\n[action] themTuNut 05:19:12.128 · title = curl gọi thẳng, không bấm nút\n[action] createPost ở MÁY CHỦ: Bài từ form chuoi-chi-o-may-chu-12-1\n[action] themTuNut 05:19:16.242 · title = từ nút bấm\n[action] cham #1 BẮT ĐẦU 05:19:19.052\n[action] cham #1 XONG    05:19:20.055\n[action] cham #2 BẮT ĐẦU 05:19:20.061\n[action] cham #2 XONG    05:19:21.063\n[action] cham #3 BẮT ĐẦU 05:19:21.068\n[action] cham #3 XONG    05:19:22.070\n[action] nhanGi nhận: [object Date] 2026-11-14T05:00:00.000Z",
 "n12-1:build2": "$ node -e 'id trước' ; npm run build ; node -e 'id sau'      # build lại, KHÔNG sửa mã\nbuild 1: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177\nbuild 2: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177\nid GIỐNG nhau\n$ rm -rf .next && npm run build ; node -e 'id sau'      # xoá .next rồi build lại, mã vẫn y nguyên\ntrước: 40796bdc2b83 408b561d9fd3 40cad8597f63 40cb02493177\nsau:   40497f3e5569 40c0233e0650 40f4c1c18ed8 40f570838177\nid KHÁC nhau",
 "n12-1:file:src/app/ghi-chu/Sai.tsx": "'use client';\n// app/ghi-chu/Sai.tsx — thử viết action NGAY TRONG một Client Component\nexport function Sai() {\n  async function xoa() {\n    'use server';\n    console.log('xoá');\n  }\n  return <button onClick={() => xoa()}>Xoá</button>;\n}\n",
 "n12-1:file:src/app/sai/page.tsx": "import { Sai } from '../ghi-chu/Sai';\nexport default function Trang() { return <Sai />; }\n",
 "n12-1:trong-client": "$ npm run build      # 'use server' bên trong một tệp 'use client'\n./src/app/ghi-chu/Sai.tsx:5:5\nError: It is not allowed to define inline \"use server\" annotated Server Actions in Client Components.\nTo use Server Actions in a Client Component, you can either export them from a separate file with \"use server\" at the top, or pass them down through props from a Server Component.",
 "n12-1:kho": "$ grep -rlE \"'use server'\" frontend/src | wc -l      # kho cuongthai.com\ntệp có 'use server' trong frontend/src: 0\n$ grep -rn \"revalidatePath\\|revalidateTag\" frontend/src | cut -c1-90\napp/api/revalidate/route.ts:19:import { revalidatePath, revalidateTag } from 'next/cache';\napp/api/revalidate/route.ts:75:      revalidatePath(path);\napp/api/revalidate/route.ts:82:      revalidateTag(tag);",
 "n12-1:loi-ham": "$ grep 'Cannot access' (log next start — lần bấm \"Gửi hàm\")\nError: Cannot access toString on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.",
 "anh-nxj-12-1:form-truoc": {
  "url": "http://127.0.0.1:19392/ghi-chu",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-1:form": {
  "url": "http://127.0.0.1:19392/ghi-chu",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "document",
    "kt": 8571
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/43s1y5metmw8y.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15007
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
    "url": "http://127.0.0.1:19392/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
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
    "url": "http://127.0.0.1:19392/_next/static/chunks/0cqpysq8y8-ze.js",
    "ma": 200,
    "loai": "script",
    "kt": 1811
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "fetch",
    "kt": 74,
    "pt": "POST",
    "na": "40796bdc2b832cf22b7d098e49ef674bee2c008b3c",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryGvil7z9fxrQnEw9c",
    "ct": "text/x-component",
    "than": "------WebKitFormBoundaryGvil7z9fxrQnEw9c\r\nContent-Disposition: form-data; name=\"_1_$ACTION_ID_40796bdc2b832cf22b7d098e49ef674bee2c008b3c\"\r\n\r\n\r\n------WebKitFormBoundaryGvil7z9fxrQnEw9c\r\nContent-Disposition: form-data; name=\"_1_title\"\r\n\r\nBài từ form\r\n------WebKitFormBoundaryGvil7z9fxrQnEw9c\r\nContent-D",
    "ms": 648,
    "ve": 657
   }
  ],
  "console": []
 },
 "anh-nxj-12-1:nut": {
  "url": "http://127.0.0.1:19392/ghi-chu",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "document",
    "kt": 8571
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/43s1y5metmw8y.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15007
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
    "url": "http://127.0.0.1:19392/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0cqpysq8y8-ze.js",
    "ma": 200,
    "loai": "script",
    "kt": 1811
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "fetch",
    "kt": 66,
    "pt": "POST",
    "na": "408b561d9fd37b6d2182f4e7de1cbab663465a65cd",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[\"từ nút bấm\"]",
    "ms": 553,
    "ve": 558
   }
  ],
  "console": []
 },
 "anh-nxj-12-1:cham": {
  "url": "http://127.0.0.1:19392/ghi-chu",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "document",
    "kt": 8571
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/43s1y5metmw8y.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15007
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
    "url": "http://127.0.0.1:19392/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
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
    "url": "http://127.0.0.1:19392/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0cqpysq8y8-ze.js",
    "ma": 200,
    "loai": "script",
    "kt": 1811
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "na": "40cad8597f63cd28683552554537f431b81699255c",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[1]",
    "ms": 558,
    "ve": 1565
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "fetch",
    "kt": 63,
    "pt": "POST",
    "na": "40cad8597f63cd28683552554537f431b81699255c",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[2]",
    "ms": 1566,
    "ve": 2574
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "na": "40cad8597f63cd28683552554537f431b81699255c",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[3]",
    "ms": 2574,
    "ve": 3580
   }
  ],
  "console": [
   {
    "kieu": "log",
    "chu": "[trình duyệt] gọi cham 1"
   },
   {
    "kieu": "log",
    "chu": "[trình duyệt] gọi cham 2"
   },
   {
    "kieu": "log",
    "chu": "[trình duyệt] gọi cham 3"
   }
  ]
 },
 "anh-nxj-12-1:tham-so": {
  "url": "http://127.0.0.1:19392/ghi-chu",
  "vp": [
   760,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "document",
    "kt": 8571
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/43s1y5metmw8y.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15007
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
    "url": "http://127.0.0.1:19392/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0cqpysq8y8-ze.js",
    "ma": 200,
    "loai": "script",
    "kt": 1811
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://127.0.0.1:19392/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 200,
    "loai": "fetch",
    "kt": 66,
    "pt": "POST",
    "na": "40cb024931779e4051e385f6346c9092b46f15535f",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[\"$D2026-11-14T05:00:00.000Z\"]",
    "ms": 552,
    "ve": 555
   },
   {
    "url": "http://127.0.0.1:19392/ghi-chu",
    "ma": 500,
    "loai": "fetch",
    "kt": 85,
    "pt": "POST",
    "na": "40cb024931779e4051e385f6346c9092b46f15535f",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[\"$T\"]",
    "ms": 1799,
    "ve": 1807
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree, icards, seq, gantt } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-12-1', code: 'NXJ 12.1', title: 'What a Server Action is', sub: 'Chapter 12 · Lesson 12.1' };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-12-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const O = (k) => { const v = DU_LIEU[`n12-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-12-1', ten, { vp: 760, ...o });
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };

// đoạn mã của bài (bài web, khối 'use server') — chép nguyên: tsc đo ở khối "bai"
const BAI = `// A Server Action — note the directive
// INSIDE the function
async function createPost(formData) {
  'use server';
  const title = formData.get('title');
  await db.post.create({ data: { title } });
}`;
// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const TSC1 = doan('bai', 'chép nguyên');
const TSC2 = doan('bai', 'sửa 1');
const MAN = doan('may-chu', 'server-reference-manifest');
const BODY = dongs('may-chu', /^thân action/);
const IDS = dongs('may-chu', / · id trong \.next\/static/);
const HTML_ID = dongs('may-chu', /ACTION_ID_/)[0];
const BUILD = dongs('may-chu', /^[├└┌] [○ƒ] \/ghi-chu/)[0];
const CURL = doan('curl', 'Next-Action');
const CURL_LOG = dongs('curl', /^\[action\] themTuNut/);
const LOG = dongs('trinh-duyet', /^\[action\]/);
const B2 = dongs('build2', /^build [12]:|^trước:|^sau:|^id (GIỐNG|KHÁC)/);
const SAI = dongs('trong-client', /Sai\.tsx|not allowed|To use Server Actions/);
const KHO = dongs('kho', /use server|revalidate/);
const mang = (k) => (AN(k).mang || []).filter((m) => m.pt === 'POST');
const MF = mang('form'), MN = mang('nut'), MC = mang('cham'), MT = mang('tham-so');
if (TSC1.length !== 2 || !/TS7006/.test(TSC1[0]) || !/TS2304/.test(TSC1[1])) throw new Error('tsc bài đổi');
if (!/TS2322.*FormDataEntryValue \| null/.test(TSC2[0])) throw new Error('tsc sửa 1 đổi');
if (MAN.length !== 4 || MAN.some((l) => /khongAiGoi/.test(l))) throw new Error('manifest đổi');
if (!/static.*: 0$/.test(BODY[0]) || /: 0$/.test(BODY[1])) throw new Error('thân action đổi');
if (!/\$\$RSC_SERVER_ACTION_0.*: 0 tệp/.test(IDS.join('|')) || !/themTuNut.*: 1 tệp/.test(IDS.join('|'))) throw new Error('id trong static đổi');
if (!/^HTTP 200 · text\/x-component/.test(CURL[0]) || !CURL_LOG.length) throw new Error('curl đổi');
if (MF.length !== 1 || !/multipart\/form-data/.test(MF[0].ctq) || MN.length !== 1 || MN[0].ctq !== 'text/plain;charset=UTF-8') throw new Error('mạng form/nút đổi');
if (MC.length !== 3 || !(MC[1].ms >= MC[0].ve - 2 && MC[2].ms >= MC[1].ve - 2)) throw new Error('3 lần gọi chậm không nối đuôi');
if (MT.length !== 2 || !/\$D2026/.test(MT[0].than) || MT[1].than !== '["$T"]' || MT[1].ma !== 500) throw new Error('tham số đổi');
if (!/GIỐNG/.test(B2[2]) || !/KHÁC/.test(B2[5])) throw new Error('id build đổi');
if (!SAI.some((l) => /not allowed to define inline "use server"/.test(l))) throw new Error('lỗi client inline đổi');
const ms = (n) => `${n} ms`;
const ACTIONS = bo(F('src/app/ghi-chu/actions.ts')).split('\n').filter((l, i, a) => !/^\s*$/.test(l) || (a[i - 1] && a[i - 1].trim())).join('\n');
const PAGE = bo(F('src/app/ghi-chu/page.tsx'));
const PL = PAGE.split('\n'), pa = PL.findIndex((l) => l.startsWith('async function createPost'));
const PAGE_ACT = goc(PL.slice(pa, PL.findIndex((l, i) => i > pa && l === '}') + 1).join('\n'));
const PAGE_GON = PAGE_ACT.split('\n').filter((l) => !/DAU/.test(l)).join('\n');   // bỏ 2 dòng chỉ để đo (chuỗi dò + log)
const NUT = bo(F('src/app/ghi-chu/NutCham.tsx')).split('\n'), na = NUT.findIndex((l) => /async function them\(\)/.test(l));
const NUT_THEM = goc([NUT.find((l) => /^import \{ themTuNut/.test(l)), '', ...NUT.slice(na, na + 4).map((l) => l.replace(/^  /, '')), '', NUT.find((l) => /id="them"/.test(l)).trim().replace(/ className="[^"]*"/, '')].join('\n'));
const LOI_HAM = dongs('loi-ham', /Cannot access/)[0];
const short = (id) => id.slice(0, 6) + '…';

export const S = [
  { cover: true, nhan: 'Chapter 12 · Lesson 12.1', t: 'What a Server Action is', sub: "'use server': a function that runs on the server, called like a local function. Measured: what reaches the browser, the POST it makes, one call at a time, and a curl that skips your UI",
    en: 'Lesson twelve point one: what a Server Action is. A function marked use server runs on the server, yet you call it like a local function. We measure what actually reaches the browser, the POST request it makes, how calls queue one at a time, and a curl that skips your interface entirely.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Writing data: a route + <code>fetch</code> by hand vs one <code>'use server'</code> function</li>
    <li>Where the directive goes — and the one place it is a build error</li>
    <li>The lesson's code compiled: three <code>tsc</code> errors on the way to a typed action</li>
    <li>What the browser gets: an <b>id</b>, never the function body</li>
    <li>The real request: a <code>POST</code> with a <code>Next-Action</code> header — one at a time, serialized arguments, callable by curl</li></ul>`,
    en: 'Five takeaways: writing data by hand with a route and fetch, versus one use server function; where the directive goes and the one place it breaks the build; the lesson\'s code compiled, three tsc errors on the way to a typed action; what the browser receives — an id, never the body; and the real request — a POST with a Next-Action header, sent one at a time, with serialized arguments, and callable by curl.' },
  { t: 'Writing data: the classic way vs a Server Action', body: two(D(seq(['browser', 'route.ts', 'database'], [[0, 1, "fetch('/api/notes', { method, headers, body })"], [1, 1, 'await request.json() · validate'], [1, 2, 'db.note.create()'], [1, 0, 'Response.json(note)', '#1f8a3b', true], [0, 0, 'res.json() · setState']], { w: 600, rh: 46, fs: 15, top: 58 }),
      box('Classic (Lesson 11.3)', 'Write a <code>route.ts</code>, keep the URL and method in sync with a <code>fetch</code>, serialize the body to JSON, parse it again on the server, then update the screen yourself.', '')),
    D(seq(['browser', 'Next.js', 'action body'], [[0, 1, 'createPost(formData)  →  POST'], [1, 2, 'look up the id · run it'], [2, 1, 'return value', '#1f8a3b', true], [1, 0, 'text/x-component', '#1f8a3b', true]], { w: 420, rh: 46, fs: 15, top: 58 }),
      box('Server Action', 'One <code>async</code> function marked <code>\'use server\'</code>. Pass it to <code>&lt;form action&gt;</code> or call it from client code — Next.js makes the request, routes it to the function and sends back the result.', 'xanh')), 'r64'),
    en: 'Writing data, the classic way: write a route dot ts, keep its URL and method in sync with a fetch, serialize the body to JSON, parse it on the server, then update the screen yourself. A Server Action is one async function marked use server. Hand it to a form or call it from client code, and Next.js makes the request, finds the function and returns its result.' },
  { t: "'use server': where the directive goes", body: two(D(tree(['src/app/ghi-chu/', '*  page.tsx      // inline action', "*  actions.ts    // 'use server' on top", "   NutCham.tsx   // 'use client', imports it", "   Sai.tsx       // client + inline ✗"], { fs: 17 }),
      tsx(PAGE_GON, { sm: true, hl: [2] })),
    D(box('Two legal places', '<b>Inside a function</b> in a Server Component (the lesson\'s form), or <b>at the top of a file</b> — every exported <code>async</code> function in it becomes an action. It is the mirror of <code>\'use client\'</code>: that one sends a component to the browser; this one keeps a function on the server.', 'lam'),
      tn(['$ npm run build   # inline \'use server\' in a client file', ...SAI].join('\n'), { fs: 12, wrap: 58, title: 'next build (real)' })), 'r64'),
    en: 'Where the directive goes. Inside a function in a Server Component, like the lesson\'s form, or at the top of a file, where every exported async function becomes an action. It mirrors use client: that one sends a component to the browser, this one keeps a function on the server. One illegal place: an inline use server inside a client file — the build stops and tells you to move it to its own file.' },
  { t: "The lesson's code, compiled: three tsc errors", body: two(D(tsx(BAI, { sm: true, hl: [3, 6] }),
      tn(['$ npx tsc --noEmit   # the lesson\'s code, as written', ...TSC1, '$ npx tsc --noEmit   # fix 1: formData: FormData, a real db', ...TSC2].join('\n'), { fs: 13, wrap: 56, title: 'tsc (real)' })),
    D(tsx(PAGE_GON, { sm: true, hl: [1, 3, 4] }),
      box('Three fixes', '<code>formData: FormData</code> (TS7006) · a real <code>db</code>, Prisma on SQLite (TS2304) · <code>formData.get()</code> is <code>FormDataEntryValue | null</code>, not a string (TS2322): check it before writing. Then <code>tsc</code>: 0 errors.', 'xanh'),
      box('Why it matters', 'A field can be missing (<code>null</code>) or a file (<code>File</code>): the types force you to handle both before Prisma sees the value. Real validation of every field comes in 12.5 and Chapter 16.', 'lam')), ''),
    en: 'The lesson\'s code, compiled. As written, tsc reports TS seven oh oh six, formData implicitly any, and TS two three oh four, cannot find db. Fix both, and a third appears: TS two three two two — formData dot get returns a FormDataEntryValue or null, not a string. Check the value before writing it; then tsc reports zero errors.' },
  { t: 'What reaches the browser: an id, never the body', body: two(D(tn(['$ (ids in .next/server/server-reference-manifest.json)', ...MAN.map((l) => l.replace(/^([0-9a-f]{12})[0-9a-f]+/, '$1…')), '$ grep -rl "<a string inside createPost>" .next/static · .next/server', ...BODY, '$ grep each id in .next/static', ...IDS, `$ curl -s localhost:3000/ghi-chu | grep -o '$ACTION_ID_…'`, HTML_ID].join('\n'), { fs: 13, wrap: 74, title: 'next build + grep (real)' })),
    D(box('Read it', 'The body of <code>createPost</code> exists only under <code>.next/server</code> — <b>0</b> files in <code>.next/static</code>. The browser gets an <b>id</b>: in the JS bundle for actions imported by client code (<code>themTuNut</code>, <code>cham</code>), in the page HTML as <code>$ACTION_ID_…</code> for the inline form action. <code>khongAiGoi</code>, exported but never imported, got <b>no id at all</b>.', 'xanh'),
      box('So', 'The database query and any secret inside the action stay on the server — exactly like a Server Component\'s code (Lesson 9.1). What travels is a <b>reference</b>.', 'lam')), 'r64'),
    en: 'What reaches the browser. The body of createPost lives only under dot next slash server: zero files in the static folder. The browser receives an id — in the JavaScript bundle for actions imported by client code, and in the page HTML as a hidden input for the inline form action. An export nobody imports got no id at all. So the query and any secret stay on the server; what travels is a reference.' },
  { t: 'Two ways to call it — the real request (Chromium)', body: two(D(B('form-truoc', { url: 'localhost:3000/ghi-chu', h: 150, w: 450 }),
      tsx(NUT_THEM, { sm: true, hl: [3] })),
    D(cmp(['Network', 'form submit', 'themTuNut() call'], [
        ['Request', `${MF[0].pt} /ghi-chu`, `${MN[0].pt} /ghi-chu`],
        ['Next-Action', short(MF[0].na), short(MN[0].na)],
        ['Sends', 'multipart/form-data', MN[0].ctq.replace(';charset=UTF-8', '')],
        ['Body', '<code>_1_title=Bài từ form</code>', `<code>${MN[0].than}</code>`],
        ['Answer', MF[0].ct, MN[0].ct],
      ]),
      box('Read it', 'Both are a <b>POST to the current URL</b> with the action id in a <code>Next-Action</code> header — no route, no URL you wrote. The answer is an RSC stream, not JSON.', 'xanh')), 'r46'),
    en: 'Two ways to call it, measured in Chromium. Submitting the form and clicking a button that calls themTuNut both produce a POST to the current page, with the action id in a Next-Action header. The form sends multipart form data; the client call sends its arguments as text. The response is an RSC stream, text slash x-component, not JSON.' },
  { t: 'Calls from the client run one at a time', body: gantt(MC.map((m, i) => [`cham(${i + 1}) · POST`, m.ms, m.ve, ['#0070f3', '#b85a2b', '#1f8a3b'][i], `${ms(m.ve - m.ms)}`]), { w: 1110, rh: 50, nhan: 230, buoc: 500, don: '', max: Math.ceil((MC[2].ve + 200) / 500) * 500 }) +
    two(tn(LOG.filter((l) => /cham/.test(l)).join('\n'), { fs: 15, title: 'server log (real) — 3 clicks, 60 ms apart' }),
      box('Read it', 'Three clicks 60 ms apart produced three POSTs that did <b>not</b> overlap: the second left the browser only when the first answered (~1 s each). Client-called actions are queued and sent one by one — fine for a save button, a bad fit for fetching data (use a Server Component for reads).', 'lam')),
    en: 'Calls from the client run one at a time. Three clicks sixty milliseconds apart produced three POSTs that never overlapped: the second left the browser only when the first answered, about a second each. Client-called actions are queued and sent one by one. That suits a save button; for reading data, use a Server Component.' },
  { t: 'It is a network call: arguments must serialize', body: two(D(B('tham-so', { url: 'localhost:3000/ghi-chu', h: 300, w: 450 }),
      cmp(['Argument', 'sent as', 'server'], [
        ["<code>'từ nút bấm'</code>", `<code>${MN[0].than}</code>`, 'a string'],
        ['<code>new Date(…)</code>', `<code>${MT[0].than.replace('.000Z', '…')}</code>`, '<code>[object Date]</code> ✓'],
        ['<code>() =&gt; 1</code>', `<code>${MT[1].than}</code>`, `<b>${MT[1].ma}</b> error`],
      ])),
    D(tn(LOI_HAM, { fs: 14, wrap: 64, title: 'next start log (real) — the function argument' }),
      box('Read it', 'Arguments are encoded like Chapter 9\'s props, in the other direction: a <code>Date</code> arrives as a <code>Date</code>, a function arrives as an opaque reference the server cannot call — the action fails with 500 and the browser shows only a minified error (#441). Pass data, not behaviour.', 'do2')), 'r46'),
    en: 'It is a network call, so arguments must serialize. A string arrives as a string. A Date is encoded with a dollar-D prefix and arrives as a real Date. A function is sent as an opaque temporary reference: the server cannot call it, the action fails with five hundred, and the browser sees only minified error four forty-one. Pass data, not behaviour.' },
  { t: 'A public endpoint: curl it without your UI', body: two(D(tn([`$ curl -X POST localhost:3000/ghi-chu \\\n    -H "Next-Action: <id of themTuNut>" \\\n    -H 'content-type: text/plain;charset=UTF-8' \\\n    -d '["curl gọi thẳng, không bấm nút"]'`, ...CURL].join('\n'), { fs: 15, wrap: 60, title: 'curl (real)' }),
      tn(CURL_LOG.join('\n'), { fs: 15, wrap: 60, title: 'next start log (real)' })),
    D(box('Read it', 'No browser, no button, no form: one <code>curl</code> with the id and the action ran and wrote a row — the response even carries its return value (the new id). The id is not a secret: it sits in the page HTML or the JS bundle for anyone to read.', 'do2'),
      box('So', 'Every action needs the checks of any endpoint: <b>who</b> is calling, <b>may</b> they touch this record, is the <b>input</b> valid. Lesson 12.5 measures each one.', 'lam')), 'r64'),
    en: 'A public endpoint. With no browser, no button and no form, one curl carrying the id ran the action and wrote a row, and the response even carried its return value. The id is not a secret — it sits in the page HTML or the JavaScript bundle. So every action needs the checks of any endpoint: who is calling, may they touch this record, and is the input valid. Lesson twelve point five measures each one.' },
  { t: 'Action ids: who gets one, and when they change', body: two(D(tn(['$ npm run build   # code unchanged, .next kept', ...B2.slice(0, 3), '$ rm -rf .next && npm run build   # code unchanged', ...B2.slice(3)].join('\n'), { fs: 15, wrap: 70, title: 'two rebuilds (real)' }),
      tsx(ACTIONS.split('\n').filter((l) => /^export async function|^'use server'/.test(l)).join('\n'), { sm: true })),
    D(icards([
      ['check', 'Only what is used', 'Of the four exports in <code>actions.ts</code>, the one no component imports (<code>khongAiGoi</code>) got no id: Next.js 16 drops unused actions.'],
      ['loop', 'Stable per build cache', 'Rebuilding with <code>.next</code> kept the same ids; deleting <code>.next</code> produced new ones for identical code.'],
      ['warn', 'Never hard-code one', 'An id is a build artifact, not an API — a client from an older deploy can hold a stale id (Lesson 20.4 on stale builds).'],
    ], 1)), 'r64'),
    en: 'Action ids: who gets one and when they change. Of the four exports in actions dot ts, the one no component imports got no id — Next.js sixteen drops unused actions. Rebuilding with the build folder kept the same ids; deleting it produced new ids for identical code. An id is a build artifact, not an API: never hard-code one.' },
  { t: 'cuongthai.com: zero Server Actions — and why', body: two(D(tn(['$ grep -rlE "\'use server\'" frontend/src | wc -l   # this course\'s own site, Next.js 14.2', ...KHO].join('\n'), { fs: 14, wrap: 78, title: 'the course\'s own repo (real)' }),
      seq(['browser', 'Next.js', 'Express API'], [[0, 2, 'POST /api/v1/… (axios)'], [2, 2, 'auth + write'], [2, 1, 'POST /api/revalidate', '#1f8a3b'], [1, 1, 'revalidatePath / revalidateTag', '#1f8a3b']], { w: 600, rh: 44, fs: 15, top: 58 })),
    D(box('Read it', 'The site writes through a separate <b>Express</b> backend (<code>/api/v1</code>) shared by the web, the desktop app and the CLI — so a Next.js-only function would serve one client of three. Cache refresh goes through one Route Handler, <code>/api/revalidate</code>.', 'lam'),
      box('When actions fit', 'The database belongs to the Next.js app and the form is yours: Server Actions remove the route, the fetch and the JSON. Several clients share one API: keep the API and call it.', 'xanh')), 'r64'),
    en: 'On this course\'s own site there are zero Server Actions. It writes through a separate Express backend shared by the web, the desktop app and the command-line tool, so a Next.js-only function would serve one client of three; cache refresh goes through a single route handler. Server Actions fit when the database belongs to the Next.js app and the form is yours.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Server Action', "an async function marked 'use server'"), kw("'use server'", 'inside a function, or at the top of a file'),
      kw('Mutation', 'a write: create, update, delete'), kw('Action id', 'what the browser holds instead of the code'),
      kw('Next-Action header', 'the POST that runs the action'), kw('text/x-component', 'the RSC stream it answers with'),
      kw('One at a time', 'client calls are queued'), kw('Public endpoint', 'callable by curl: secure it (12.5)'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Server Action; the use server directive; mutation; the action id; the Next-Action header; text slash x-component; calls queued one at a time; and the action as a public endpoint.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write ${c("'use server'")} inside a Server Component's function; pass it to ${c('<form action>')}; check the log is on the <b>server</b>`,
      `Copy the lesson's code into a ${c('.tsx')}; fix the three ${c('tsc')} errors`,
      `Build, then ${c('grep')} a string from the action body in ${c('.next/static')} (expect 0)`,
      `Open DevTools → Network, submit, find the ${c('Next-Action')} header; replay it with ${c('curl')}`,
    ]), box('Keep these', `<ul><li>An action = a server function + an id</li><li>The body never reaches the browser</li><li>Calling it = a POST to the current URL</li><li>Arguments serialize; calls queue</li><li>Anyone can call it — secure it</li></ul>`, 'lam'), ''),
    en: 'Your turn: write use server inside a Server Component function and hand it to a form, then confirm the log appears on the server; copy the lesson\'s code into a tsx file and fix the three tsc errors; build and grep the static folder for a string from the action body; and find the Next-Action header in DevTools, then replay it with curl. Keep: an action is a server function plus an id, the body never reaches the browser, calling it is a POST, arguments serialize and calls queue, and anyone can call it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 12 — Server Actions', bai: '12.1' }, S);
