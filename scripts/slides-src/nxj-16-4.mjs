/*DU_LIEU*/
const DU_LIEU = {
 "n16-4:file:src/app/up/bai.ts": "async function uploadAvatar(formData) {\n  'use server';\n  const file = formData.get('avatar');            // a File object\n  const key = `avatars/${user.id}/${file.name}`;\n  await storage.put(key, file);                    // upload to R2/S3\n  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });\n}\n",
 "n16-4:bai": "# the lesson's server half, exactly as written, in a .ts file\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/up/bai.ts(1,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.\nsrc/app/up/bai.ts(4,26): error TS2304: Cannot find name 'user'.\nsrc/app/up/bai.ts(5,9): error TS2552: Cannot find name 'storage'. Did you mean 'Storage'?\nsrc/app/up/bai.ts(6,9): error TS2304: Cannot find name 'db'.\nsrc/app/up/bai.ts(6,39): error TS2304: Cannot find name 'user'.",
 "n16-4:file:src/lib/s3.ts": "// lib/s3.ts — an S3 client for the lab's own MinIO (same API as R2/S3)\nimport { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';\nexport const BUCKET = 'nxj-lab';\nexport const s3 = new S3Client({\n  endpoint: process.env.S3_ENDPOINT ?? 'http://127.0.0.1:19319', region: 'auto', forcePathStyle: true,\n  credentials: { accessKeyId: process.env.S3_KEY ?? 'nxjlab', secretAccessKey: process.env.S3_SECRET ?? '<lab-secret>' },\n});\nexport async function ensureBucket() {\n  try { await s3.send(new HeadBucketCommand({ Bucket: BUCKET })); } catch { await s3.send(new CreateBucketCommand({ Bucket: BUCKET })); }\n}\nconst g = globalThis as unknown as { __avatar?: Map<number, string> };\nexport const avatarKeys = (g.__avatar ??= new Map<number, string>());   // the \"database\": user id → object key\nexport const mb = (n: number) => `${(n / 1048576).toFixed(1)} MB`;\n",
 "n16-4:file:src/app/up/actions.ts": "'use server';\n// app/up/actions.ts — way 1: the file goes THROUGH the server (Server Action)\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\nimport { revalidatePath } from 'next/cache';\nimport { getCurrentUser } from '@/lib/current-user';\nimport { s3, BUCKET, ensureBucket, avatarKeys, mb } from '@/lib/s3';\n\nexport async function uploadAvatar(formData: FormData) {\n  const user = await getCurrentUser();\n  const file = formData.get('avatar');\n  if (!user || !(file instanceof File)) return;\n  const key = `avatars/${user.id}/${file.name}`;\n  await ensureBucket();\n  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));\n  avatarKeys.set(user.id, key);                    // the database keeps the KEY, not the bytes\n  console.log(`[action] ${file.name} ${file.size} B ${file.type} → ${key}`);\n  revalidatePath('/up');\n}\n",
 "n16-4:file:src/app/up/page.tsx": "// app/up/page.tsx — a form that carries a file\nimport { getCurrentUser } from '@/lib/current-user';\nimport { avatarKeys } from '@/lib/s3';\nimport { uploadAvatar } from './actions';\nexport const dynamic = 'force-dynamic';\nexport default async function Up() {\n  const user = await getCurrentUser();\n  return (\n    <main className=\"p-4 text-lg\">\n      <form action={uploadAvatar} className=\"flex gap-2\">\n        <input id=\"f\" type=\"file\" name=\"avatar\" accept=\"image/*\" />\n        <button id=\"gui\" className=\"rounded border px-3\">Upload</button>\n      </form>\n      <p id=\"key\">saved key: {user ? avatarKeys.get(user.id) ?? '—' : 'not signed in'}</p>\n    </main>\n  );\n}\n",
 "n16-4:file:src/app/api/upload/route.ts": "// app/api/upload/route.ts — way 1 again, as a Route Handler (so curl can send big files)\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\nimport { s3, BUCKET, ensureBucket, mb } from '@/lib/s3';\n\nexport async function POST(req: Request) {\n  const before = process.memoryUsage().rss;\n  const form = await req.formData();                       // the whole body is read here\n  const file = form.get('file');\n  if (!(file instanceof File)) return Response.json({ error: 'no file' }, { status: 400 });\n  const body = Buffer.from(await file.arrayBuffer());\n  const peak = process.memoryUsage().rss;\n  const key = `uploads/${crypto.randomUUID()}-${file.name}`;\n  await ensureBucket();\n  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: file.type }));\n  return Response.json({ key, size: file.size, rss: `${mb(before)} → ${mb(peak)}` });\n}\n",
 "n16-4:file:src/app/api/presign/route.ts": "// app/api/presign/route.ts — way 2: the server only SIGNS; the browser uploads straight to storage\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nimport { s3, BUCKET, ensureBucket, mb } from '@/lib/s3';\n\nexport async function POST(req: Request) {\n  const { name, type, exp = 60 } = await req.json();\n  const key = `uploads/${crypto.randomUUID()}-${name}`;\n  await ensureBucket();\n  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: type }), { expiresIn: exp });\n  return Response.json({ key, url, rss: mb(process.memoryUsage().rss) });\n}\n",
 "n16-4:file:src/app/api/obj/route.ts": "// app/api/obj/route.ts — what is stored under a key?\nimport { HeadObjectCommand } from '@aws-sdk/client-s3';\nimport { s3, BUCKET } from '@/lib/s3';\nexport async function GET(req: Request) {\n  const key = new URL(req.url).searchParams.get('key')!;\n  const h = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));\n  return Response.json({ key, bytes: h.ContentLength, type: h.ContentType });\n}\n",
 "n16-4:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/up|/api/(upload|presign|obj)|rror'\n✓ Compiled successfully in 4.5s\n├ ƒ /api/obj\n├ ƒ /api/presign\n├ ƒ /api/upload\n└ ƒ /up",
 "n16-4:qua": "# way 1 — through the server (Route Handler + FormData)\n$ curl -s -F file=@anh-200kb.jpg localhost:3000/api/upload\n{\"key\":\"uploads/32ed7314-9d4f-48f4-b80d-5eaa3f55a750-anh-200kb.jpg\",\"size\":204800,\"rss\":\"121.2 MB → 121.8 MB\"}\n$ curl -s -F file=@video-40mb.mp4 localhost:3000/api/upload\n{\"key\":\"uploads/896ea12d-8151-4a20-ac17-35bef6e14e67-video-40mb.mp4\",\"size\":41943040,\"rss\":\"124.0 MB → 343.7 MB\"}",
 "n16-4:ky": "# way 2 — a presigned URL: the server signs, the bytes go straight to storage\n$ curl -s -X POST localhost:3000/api/presign -d '{\"name\":\"video-40mb.mp4\",\"type\":\"video/mp4\"}'\n{\"key\":\"uploads/6879b4b7-cabe-4f90-948a-82a9d2a5f6ce-video-40mb.mp4\",\"rss\":\"344.0 MB\"}\nurl: http://127.0.0.1:19319/nxj-lab/uploads/6879b4b7-cabe-4…?X-Amz-Algorithm&X-Amz-Content-Sha256&X-Amz-Credential&X-Amz-Date&X-Amz-Expires&X-Amz-Signature&X-Amz-SignedHeaders&x-amz-checksum-crc32&x-amz-sdk-checksum-algorithm&x-id\n$ curl -s -o /dev/null -w '%{http_code}\\n' -X PUT -H 'content-type: video/mp4' --upload-file video-40mb.mp4 \"$URL\"\n200\n$ curl -s \"localhost:3000/api/obj?key=$KEY\"\n{\"key\":\"uploads/6879b4b7-cabe-4f90-948a-82a9d2a5f6ce-video-40mb.mp4\",\"bytes\":41943040,\"type\":\"video/mp4\"}\n# someone edits the key inside the signed URL\n$ curl -s -X PUT --upload-file anh-200kb.jpg \"${URL/video-40mb/evil}\" | grep -o '<Code>[^<]*'\nSignatureDoesNotMatch\n# a URL signed for 5 seconds, used after 6\n$ sleep 6\n$ curl -s -X PUT --upload-file anh-200kb.jpg \"$URL5\" | grep -oE '<(Code|Message)>[^<]*'\nAccessDenied\nRequest has expired",
 "n16-4:file:thu-blob.ts": "const CDN = 'https://media.cuongthai.com';\nconst naive = (v: string) => `${CDN}/${v}`;\nconst fixed = (v: string) => (v.startsWith('blob:') || v.startsWith('data:') || /^https?:\\/\\//.test(v) ? v : `${CDN}/${v}`);\nfor (const v of ['avatars/1/me.jpg', 'blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0e11', 'data:image/png;base64,iVBORw0KGgo=']) {\n  console.log('in:   ', v.slice(0, 60));\n  console.log('naive:', naive(v).slice(0, 72));\n  console.log('fixed:', fixed(v).slice(0, 72));\n}\n",
 "n16-4:blob": "# the cuongthai.com bug: a CDN prefix glued onto a local preview URL\n$ npx tsx thu-blob.ts\nin:    avatars/1/me.jpg\nnaive: https://media.cuongthai.com/avatars/1/me.jpg\nfixed: https://media.cuongthai.com/avatars/1/me.jpg\nin:    blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0\nnaive: https://media.cuongthai.com/blob:http://localhost:3000/7c1e9a52-0b6d-4e1\nfixed: blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0e11\nin:    data:image/png;base64,iVBORw0KGgo=\nnaive: https://media.cuongthai.com/data:image/png;base64,iVBORw0KGgo=\nfixed: data:image/png;base64,iVBORw0KGgo=",
 "n16-4:kho": "$ sed -n '219,220p' frontend/src/lib/utils.ts\n  if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;\n  if (au.startsWith('blob:') || au.startsWith('data:')) return au;\n$ git log --format='%h %ad %s' --date=short -S\"lp.startsWith('blob:')\" -- frontend/src/lib/utils.ts | tail -1\n4448f4d14 2026-07-02 fix(media+auth): stop blob: URLs hitting R2 (400) + silent session refresh\n$ grep -rln \"multer\" src/routes | wc -l | sed 's/^ */tệp route dùng multer: /'\ntệp route dùng multer: 31\n$ grep -rn \"multer.memoryStorage()\" src/routes | wc -l | sed 's/^ */multer.memoryStorage(): /'\nmulter.memoryStorage(): 40\n$ grep -rln \"getSignedUploadUrl\" src | grep -v test | grep -v \"config/r2.ts\" | wc -l | sed 's/^ */tệp gọi getSignedUploadUrl: /'\ntệp gọi getSignedUploadUrl: 7",
 "n16-4:nhatky": "[action] anh-200kb.jpg 204800 B image/jpeg → avatars/1/anh-200kb.jpg\n[api] verifyJwt #3\n[api] db.user.findUnique #3\n[api] POST /api/login #2\n[api] verifyJwt #4\n[api] db.user.findUnique #4\n⨯ Error: Body exceeded 1 MB limit.\nTo configure the body size limit for Server Actions, see: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit\n    at ignore-listed frames {\n  statusCode: 413,\n  digest: '3845138429'\n}",
 "n16-4:dung": "",
 "anh-nxj-16-4:act-chon": {
  "url": "http://localhost:19320/up",
  "vp": [
   640,
   140
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-16-4:act-200kb": {
  "url": "http://localhost:19320/api/dem",
  "vp": [
   640,
   140
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19320/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 2
   },
   {
    "url": "http://localhost:19320/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 534,
    "ve": 550
   },
   {
    "url": "http://localhost:19320/up",
    "ma": 200,
    "loai": "document",
    "kt": 7261
   },
   {
    "url": "http://localhost:19320/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/01l8f-mw9jwx4.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14686
   },
   {
    "url": "http://localhost:19320/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19320/up",
    "ma": 200,
    "loai": "fetch",
    "kt": 4067,
    "pt": "POST",
    "na": "4046ebe189392e7deb84dd123aee56dddee4b3610d",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryhkd5Fc2GpykK7Zuf",
    "ct": "text/x-component",
    "than": "",
    "ms": 1238,
    "ve": 1294
   }
  ],
  "console": [],
  "ketQua": {
   "Server Action, ảnh 200 KB ⇒": "saved key: avatars/1/anh-200kb.jpg"
  }
 },
 "anh-nxj-16-4:act-2mb": {
  "url": "http://localhost:19320/api/dem",
  "vp": [
   640,
   140
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19320/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 58
   },
   {
    "url": "http://localhost:19320/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 513,
    "ve": 518
   },
   {
    "url": "http://localhost:19320/up",
    "ma": 200,
    "loai": "document",
    "kt": 7301
   },
   {
    "url": "http://localhost:19320/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/01l8f-mw9jwx4.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14686
   },
   {
    "url": "http://localhost:19320/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19320/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "Server Action, ảnh 2 MB ⇒": "Upload\n\nsaved key: avatars/1/anh-200kb.jpg"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, path, meter, thucTe4 } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-16-4', code: 'NXJ 16.4', title: 'File uploads: from the browser to storage', sub: 'Chapter 16 · Lesson 16.4' };
const O = (k) => { const v = DU_LIEU[`n16-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-16-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-16-4', ten, { vp: 640, ...o });
const KQ = (k) => Object.values(A(k).ketQua)[0];

// ── số đo (n16-4 · lab c16 + MinIO riêng 127.0.0.1:19319 · @aws-sdk/client-s3 3.1169.0 · Next.js 16.4.6 · next start 19320 · Chromium)
const TSE = O('bai').split('\n').filter((l) => /error TS/.test(l));
const Q1 = JSON.parse(doan('qua', 'anh-200kb')[0]), Q2 = JSON.parse(doan('qua', 'video-40mb')[0]);
const rss = (s) => s.split(' → ').map((x) => parseFloat(x));
const [b1, p1] = rss(Q1.rss), [b2, p2] = rss(Q2.rss);
const PS = doan('ky', 'api/presign'), PUT = doan('ky', '--upload-file video-40mb')[0], HEAD = JSON.parse(doan('ky', 'api/obj')[0]);
const EVIL = doan('ky', 'evil')[0], LATE = doan('ky', 'URL5');
const LOG = O('nhatky').split('\n').filter((l) => /\[action\]|Body exceeded|statusCode: 413/.test(l)).map((l) => l.trim());
const BLOB = O('blob').split('\n').filter((l) => /^(in|naive|fixed):/.test(l));
const KHO = O('kho');
const A1 = KQ('act-200kb'), A2 = KQ('act-2mb');
if (TSE.length !== 5) throw new Error('bai đổi');
if (Q2.size !== 41943040 || !(p2 - b2 > 150)) throw new Error('qua đổi');
if (PUT !== '200' || HEAD.bytes !== 41943040 || EVIL !== 'SignatureDoesNotMatch' || LATE.join() !== 'AccessDenied,Request has expired') throw new Error('ky đổi');
if (!/avatars\/1\/anh-200kb\.jpg/.test(A1) || !/saved key: avatars\/1\/anh-200kb\.jpg/.test(A2) || !LOG.some((l) => /Body exceeded 1 MB limit/.test(l))) throw new Error('action đổi');
if (!BLOB.some((l) => /naive: https:\/\/media\.cuongthai\.com\/blob:/.test(l))) throw new Error('blob đổi');

const LESSON = `async function uploadAvatar(formData) {
  'use server';
  const file = formData.get('avatar');  // a File object
  const key = \`avatars/\${user.id}/\${file.name}\`;
  await storage.put(key, file);                    // upload to R2/S3
  await db.user.update({ where: { id: user.id },
    data: { avatarKey: key } });
}`;
const ACT = F('src/app/up/actions.ts').split('\n').filter((l) => !/^\/\/ app|console\.log|^import|^'use server'/.test(l)).join('\n').trim()
  .replace('  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));', '  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key,\n    Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));').replace(/ +\/\/ .*$/gm, '');
const PRESIGN = F('src/app/api/presign/route.ts').split('\n').filter((l) => !/^\/\/ app|^import/.test(l)).join('\n').trim()
  .replace("  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: type }), { expiresIn: exp });", "  const url = await getSignedUrl(s3,\n    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: type }),\n    { expiresIn: exp });");
if (!/avatarKeys\.set/.test(ACT) || !/expiresIn: exp/.test(PRESIGN)) throw new Error('mã đổi');

export const S = [
  { cover: true, nhan: 'Chapter 16 · Lesson 16.4', t: 'File uploads:<br>from the browser<br>to storage', sub: 'Bytes to object storage, a key in the database — measured on a real S3 API: memory per upload, the Server Action limit, and presigned URLs',
    en: 'Lesson sixteen point four: file uploads, from the browser to storage. The bytes go to object storage, a key goes to the database. Measured on a real S3 API: memory per upload, the Server Action limit, and presigned URLs.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Bytes → object storage (S3, R2); the database keeps the <b>key</b></li>
    <li>Way 1, through your server: a 40 MB file took the process from ${b2} to <b>${p2} MB</b></li>
    <li>A Server Action refuses a 2 MB file: <code>Body exceeded 1 MB limit</code> (413) — and the user sees nothing</li>
    <li>Way 2, a presigned URL: the browser PUTs straight to storage; a changed key or a late upload is refused</li>
    <li>A real cuongthai.com bug: a CDN prefix glued onto <code>blob:</code></li></ul>`,
    en: 'Five takeaways: bytes go to object storage and the database keeps the key; through your server, a forty megabyte file took the process past three hundred megabytes; a Server Action refuses a two megabyte file and the user sees nothing; a presigned URL lets the browser upload straight to storage; and a real bug with blob URLs.' },
  { t: 'Where a file should go', body: path([
      { t: 'browser', s: '<input type="file">' }, { t: 'object storage', s: 'S3 · R2 · MinIO', on: true }, { t: 'database', s: 'avatarKey: "avatars/1/…"' }, { t: 'page', s: 'CDN URL from the key' },
    ], { nhan: ['bytes', 'key', 'key → URL'] }) + cmp(['Place', 'Verdict', 'Why'], [
      ['A database column', 'no', 'every backup and query carries the bytes'],
      ['The app server\'s disk', 'no', 'a container is replaced on every deploy; a second instance cannot see the file'],
      ['Object storage', '<b>yes</b>', 'durable, cheap, served by a CDN, outlives deploys'],
    ]) + box('Store the key, build the URL', 'The row says <code>avatars/1/me.jpg</code>; a helper adds the CDN host when the page renders. Move to another CDN domain and not a single row changes.', 'xanh'),
    en: 'Where a file should go: the bytes to object storage, S3 or R2, and only a key into the database; the page turns the key into a CDN URL. Not a database column, not the app server\'s disk, which is replaced on every deploy.' },
  { t: "The lesson's code on Next.js 16.4.6", body: two(D(tsx(LESSON, { sm: true, hl: [1, 4, 5, 6, 7] }), box('A sketch, not a program', '<code>user</code>, <code>storage</code> and <code>db</code> are never defined; <code>formData</code> has no type. Next: the version that runs against a real S3 API (a local MinIO).', 'lam')),
    D(tn(['$ npx tsc --noEmit', ...TSE.map((l) => l.replace(/^src\/app\/up\/bai\.ts/, 'bai.ts'))].join('\n'), { fs: 13, wrap: 46, title: 'tsc (real)' })), 'r64') + icards([['user', 'user → getCurrentUser()', 'the session helper of 15.4'], ['cloud', 'storage → an S3 client', '<code>@aws-sdk/client-s3</code> · R2 · MinIO'], ['layers', 'db → your data layer', 'store the key, not the bytes']], 3),
    en: 'The lesson\'s code on Next.js sixteen: five type errors. user, storage and db are never defined, and formData has no type. It is a sketch. Next comes the version that runs against a real S3 API, a local MinIO.' },
  { t: 'Way 1: through your server (Server Action)', body: two(D(tsx(ACT, { sm: true, hl: [5, 7, 8, 10] })),
    D(B('act-chon', { url: 'localhost:3000/up · anh-200kb.jpg chosen', h: 70, w: 380 }),
      tn([`# Chromium (real), click Upload with a 200 KB image`, A1, '# server log', ...LOG.filter((l) => /\[action\]/.test(l))].join('\n'), { fs: 12, wrap: 40, title: 'Chromium + next start (real)' }),
      box('The database keeps the key', '<code>avatars/1/anh-200kb.jpg</code> — the bytes live in the bucket. Swap the CDN domain later and no row changes.', 'xanh')), 'r64'),
    en: 'Way one: through your server. The Server Action reads the File from FormData, checks the session, puts the bytes in the bucket, and keeps only the key. Measured with a two hundred kilobyte image: the key is saved.' },
  { t: 'Measured: a 2 MB file and a Server Action', body: two(D(tn(['# the same form, a 2 MB image (real)', `page after the click: ${A2.replace(/\n+/g, ' · ')}`, '# server log', ...LOG.filter((l) => /Body exceeded|413/.test(l))].join('\n'), { fs: 14, wrap: 56, title: 'Chromium + next start (real)' })),
    D(box('A 1 MB default', 'Server Actions refuse bodies over <b>1 MB</b> unless you raise <code>serverActions.bodySizeLimit</code> in <code>next.config</code>.', 'lam'),
      box('A silent failure', 'The server logs a 413; the page shows the <b>old</b> key and no error. Users try again, or think it worked.', 'do2'),
      box('Raising the limit is not the fix', 'It moves the problem into memory (next slide). Big files should not pass through the process at all.', 'xanh')), ''),
    en: 'Measured: a two megabyte image through the same Server Action. The server logs: body exceeded one megabyte limit, status 413. The page still shows the old key and no error at all. Raising the limit only moves the problem into memory.' },
  { t: 'Measured: what a 40 MB upload costs the server', body: two(D(meter([['before (200 KB file)', b1, '#64748b'], ['while reading 200 KB', p1, '#64748b'], ['before (40 MB file)', b2, '#64748b'], ['while reading 40 MB', p2, '#dc2626']], { don: 'MB RSS', w: 560, nhan: 250, fs: 16 }),
      tn(['$ curl -s -F file=@anh-200kb.jpg localhost:3000/api/upload', doan('qua', 'anh-200kb')[0], '$ curl -s -F file=@video-40mb.mp4 localhost:3000/api/upload', doan('qua', 'video-40mb')[0]].join('\n'), { fs: 12, wrap: 64, title: 'curl (real)' })),
    D(box('About ' + Math.round(p2 - b2) + ' MB for one 40 MB file', '<code>req.formData()</code> buffers the whole body, then <code>arrayBuffer()</code> copies it again. A few uploads at once on a small VPS and the process is killed.', 'do2'),
      box('Serverless is stricter', 'Platforms cap the request body (Vercel documents 4.5 MB) — the failure is a 413, never "file too big".', 'lam')), ''),
    en: `Measured: what a forty megabyte upload costs the server. Reading it through a route handler took the process from ${b2} to ${p2} megabytes, about ${Math.round(p2 - b2)} for one file. Formdata buffers the body and arrayBuffer copies it again.` },
  { t: 'Way 2: a presigned URL — the server only signs', body: two(D(tsx(PRESIGN, { sm: true, hl: [5, 6, 7] }),
      tn(['$ curl -s -X POST localhost:3000/api/presign -d \'{"name":"video-40mb.mp4",…}\'', ...PS].join('\n'), { fs: 12, wrap: 54, title: 'curl (real)' })),
    D(tn(['$ curl -X PUT --upload-file video-40mb.mp4 "$URL"', PUT, '$ curl "localhost:3000/api/obj?key=$KEY"', JSON.stringify(HEAD)].join('\n'), { fs: 13, wrap: 44, title: 'curl → storage (real)' }),
      box('The bytes skip your server', 'The 40 MB went from the client to the storage endpoint (<code>:19319</code>); Next.js only produced a short signed string.', 'xanh')), ''),
    en: 'Way two: a presigned URL. The server signs a PUT for one key, valid sixty seconds, and returns it. The client uploads forty megabytes straight to storage: 200, and the object is there with the full size. The bytes never pass through Next.js.' },
  { t: 'What the signature protects', body: two(D(tn(['# someone edits the key inside the signed URL', '$ curl -X PUT --upload-file anh-200kb.jpg "${URL/video-40mb/evil}"', EVIL, '# a URL signed for 5 s, used after 6 s', ...['$ curl -X PUT --upload-file anh-200kb.jpg "$URL5"', ...LATE]].join('\n'), { fs: 14, wrap: 56, title: 'curl → storage (real)' })),
    D(box('One key, one method, a short life', 'The signature covers the bucket, the key, the method and the expiry. Change any of them: <code>SignatureDoesNotMatch</code>. Too late: <code>Request has expired</code>.', 'xanh'),
      box('Still record the key', 'Storage accepts the bytes; your database must still learn the key — confirm after the upload (16.5 checks what was really uploaded).', 'lam')), ''),
    en: 'What the signature protects: editing the key inside the URL gives SignatureDoesNotMatch; a URL signed for five seconds used after six gives request has expired. One key, one method, a short life. You still record the key in your database.' },
  { t: 'A real cuongthai.com bug: blob: + CDN prefix', body: two(D(tn(['$ npx tsx thu-blob.ts', ...BLOB].join('\n'), { fs: 13, wrap: 60, title: 'tsx (real)' })),
    D(box('What happened', 'An optimistic preview of a chosen file is a <code>blob:</code> or <code>data:</code> URL. A helper glued the CDN base onto every value ⇒ <code>https://…/blob:…</code> ⇒ 400, broken previews.', 'do2'),
      box('The fix (in the repo since 2 July 2026)', '<code>if (lp.startsWith(\'blob:\') || lp.startsWith(\'data:\')) return lp;</code> — only bare storage keys get the prefix.', 'xanh')), ''),
    en: 'A real cuongthai.com bug: an optimistic preview of a chosen file is a blob or data URL, already renderable. A helper glued the CDN base onto every value, producing an https URL with blob inside, and a 400. The fix returns blob and data URLs untouched.' },
  { t: 'cuongthai.com: both ways, in one backend', body: two(D(tn(KHO, { fs: 13, wrap: 64, title: 'repo (real)' })),
    D(box('Through the server: multer in memory', '31 route files use multer, 40 times with <code>memoryStorage()</code> — each with a <code>fileSize</code> limit (5–30 MB). Fine for avatars, voice notes, documents.', 'lam'),
      box('Presigned for the big ones', '7 files call <code>getSignedUploadUrl</code>: the browser uploads straight to R2. The database keeps keys; a helper builds the CDN URL.', 'xanh')), ''),
    en: 'cuongthai.com uses both ways. Thirty-one route files use multer in memory, each with a size limit, fine for small files. Seven files call getSignedUploadUrl for direct uploads to R2. The database keeps keys, and the blob fix is in the repo since the second of July.' },
  { t: "Not learning in a vacuum: real life, what if, the attacker", to: true, body: thucTe4({ doi: ["🎓", "The whole class submits at the deadline", ["new avatar · PDF and video assignments", "many large files at once"]], neu: ["💥", "100 videos of 40 MB through the server?", ["measured: +220 MB of memory per file", "deadline ⇒ out of RAM, process killed"]], xau: ["🏴‍☠️", "A presign route that skips auth", ["anyone can ask for an upload URL", "your bucket becomes free hosting"]], phong: ["🛡️", "Authenticate before signing", ["short expiry · server-chosen keys", "watch for unusual bucket growth"]] }),
    en: "Real life: changing a profile picture, or the whole class submitting assignments to the school system minutes before the deadline. What if 100 students upload a 40 MB video through the server at once? At ~220 MB of memory per file, the server runs out of RAM at the deadline. Attackers look for presign routes that do not check the caller and turn your bucket into free hosting for their files. Detect unusual bucket growth and strange keys. Prevent it: authenticate before signing, short expiry, server-chosen keys." },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Object storage', 'S3 · R2 · MinIO'), kw('Object key', 'what the database keeps'), kw('FormData upload', 'through your server'), kw('bodySizeLimit', '1 MB for Server Actions'),
      kw('RSS', 'process memory'), kw('Presigned URL', 'signed, short-lived'), kw('SignatureDoesNotMatch', 'URL was edited'), kw('blob: / data: URL', 'local preview, never prefix'),
      kw('CDN URL', 'built from the key'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: object storage; the object key; a FormData upload through your server; the Server Action body size limit; RSS, process memory; presigned URL; SignatureDoesNotMatch; blob and data URLs; and the CDN URL built from a key.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run a local MinIO; upload a file through a Route Handler and print ${c('process.memoryUsage().rss')}`,
      `Send a 2 MB file to a Server Action — read the server log`,
      `Add ${c('/api/presign')}; PUT a big file with ${c('curl --upload-file')}`,
      `Edit the key in the URL, and wait past ${c('expiresIn')} — read the errors`,
    ]), box('Keep these', `<ul><li>Bytes to storage, key to the database</li><li>Small files may pass through; big files go direct</li><li>Server Actions stop at 1 MB, silently</li><li>Never prefix blob: or data:</li></ul>`, 'lam'), ''),
    en: 'Your turn: run a local MinIO and upload through a route handler while printing memory; send two megabytes to a Server Action; add a presign route and upload directly; then edit the key and wait past the expiry.' },
];
export const slides = lamDeck({ chuong: 'Chapter 16 — Forms, validation, and file uploads', bai: '16.4' }, S);
