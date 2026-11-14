/*DU_LIEU*/
const DU_LIEU = {
 "n16-5:file:src/app/tai/bai.ts": "import { getCurrentUser } from '@/lib/current-user';\nasync function uploadAvatar(formData) {\n  'use server';\n  const user = await getCurrentUser();\n  if (!user) throw new Error('Not authenticated');               // authz\n  const file = formData.get('avatar');\n  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Wrong type');   // type\n  if (file.size > MAX_BYTES)         throw new Error('Too large');    // size\n  const key = `avatars/${user.id}/${crypto.randomUUID()}`;   // server-chosen path\n  await storage.put(key, file);\n  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });\n}\n",
 "n16-5:bai": "# the lesson's \"safe upload\" skeleton, exactly as written, in a .ts file\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/tai/bai.ts(2,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.\nsrc/app/tai/bai.ts(7,8): error TS2304: Cannot find name 'ALLOWED_TYPES'.\nsrc/app/tai/bai.ts(8,19): error TS2304: Cannot find name 'MAX_BYTES'.\nsrc/app/tai/bai.ts(10,9): error TS2552: Cannot find name 'storage'. Did you mean 'Storage'?\nsrc/app/tai/bai.ts(11,9): error TS2304: Cannot find name 'db'.",
 "n16-5:file:src/lib/s3.ts": "// lib/s3.ts — an S3 client for the lab's own MinIO (same API as R2/S3)\nimport { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';\nexport const BUCKET = 'nxj-lab';\nexport const s3 = new S3Client({\n  endpoint: process.env.S3_ENDPOINT ?? 'http://127.0.0.1:19319', region: 'auto', forcePathStyle: true,\n  credentials: { accessKeyId: process.env.S3_KEY ?? 'nxjlab', secretAccessKey: process.env.S3_SECRET ?? '<lab-secret>' },\n});\nexport async function ensureBucket() {\n  try { await s3.send(new HeadBucketCommand({ Bucket: BUCKET })); } catch { await s3.send(new CreateBucketCommand({ Bucket: BUCKET })); }\n}\n",
 "n16-5:file:src/lib/sniff.ts": "// lib/sniff.ts — the real type, from the first bytes (the \"magic numbers\"), not from the name\nconst SIGS: [string, string, number[]][] = [\n  ['image/jpeg', 'jpg', [0xff, 0xd8, 0xff]],\n  ['image/png', 'png', [0x89, 0x50, 0x4e, 0x47]],\n  ['image/gif', 'gif', [0x47, 0x49, 0x46, 0x38]],\n];\nexport function sniff(bytes: Uint8Array): { type: string; ext: string } | null {\n  for (const [type, ext, sig] of SIGS) if (sig.every((b, i) => bytes[i] === b)) return { type, ext };\n  return null;\n}\n",
 "n16-5:file:src/app/api/up-naive/route.ts": "// app/api/up-naive/route.ts — trusts the browser: its file name, its type, any size\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getCurrentUser } from '@/lib/current-user';\nimport { s3, BUCKET, ensureBucket } from '@/lib/s3';\nexport async function POST(req: Request) {\n  const user = await getCurrentUser();\n  const file = (await req.formData()).get('file') as File;\n  const key = `avatars/${user?.id}/${file.name}`;\n  await ensureBucket();\n  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));\n  return Response.json({ key, type: file.type, size: file.size });\n}\n",
 "n16-5:file:src/app/api/up-safe/route.ts": "// app/api/up-safe/route.ts — who · how big · what really · where (the server decides all four)\nimport { PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getCurrentUser } from '@/lib/current-user';\nimport { s3, BUCKET, ensureBucket } from '@/lib/s3';\nimport { sniff } from '@/lib/sniff';\n\nconst MAX_BYTES = 2 * 1024 * 1024;\nexport async function POST(req: Request) {\n  const user = await getCurrentUser();\n  if (!user) return Response.json({ error: 'not signed in' }, { status: 401 });                        // who\n  if (Number(req.headers.get('content-length')) > MAX_BYTES + 4096)\n    return Response.json({ error: 'too large (header)' }, { status: 413 });                              // how big — before reading\n  const file = (await req.formData()).get('file');\n  if (!(file instanceof File) || file.size > MAX_BYTES) return Response.json({ error: 'too large' }, { status: 413 });\n  const bytes = new Uint8Array(await file.arrayBuffer());\n  const real = sniff(bytes);\n  if (!real) return Response.json({ error: `not an image (declared ${file.type})` }, { status: 415 });  // what really\n  const key = `avatars/${user.id}/${crypto.randomUUID()}.${real.ext}`;                                   // where: the server's key\n  await ensureBucket();\n  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: real.type }));\n  return Response.json({ key, type: real.type, label: file.name });\n}\n",
 "n16-5:file:src/app/api/ls/route.ts": "// app/api/ls/route.ts — what is in the bucket under avatars/\nimport { ListObjectsV2Command } from '@aws-sdk/client-s3';\nimport { s3, BUCKET } from '@/lib/s3';\nexport const dynamic = 'force-dynamic';\nexport async function GET() {\n  const r = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'avatars/' }));\n  return new Response((r.Contents ?? []).map((o) => `${o.Key}  ${o.Size} B`).join('\\n') + '\\n');\n}\n",
 "n16-5:file:src/app/tai/Upload.tsx": "'use client';\n// app/tai/Upload.tsx — the UX layer: instant preview, progress, a disabled button\nimport { useState } from 'react';\n\nexport function Upload() {\n  const [preview, setPreview] = useState('');\n  const [file, setFile] = useState<File | null>(null);\n  const [busy, setBusy] = useState(false);\n  const [log, setLog] = useState<string[]>([]);\n  function send() {\n    if (!file || busy) return;\n    setBusy(true);\n    const xhr = new XMLHttpRequest();                      // fetch() has no upload progress; XHR does\n    xhr.upload.onprogress = (e) => setLog((l) => [...l, `${Math.round((e.loaded / e.total) * 100)}%`]);\n    xhr.onload = () => { setLog((l) => [...l, `${xhr.status} ${xhr.responseText}`]); setBusy(false); };\n    const fd = new FormData(); fd.set('file', file);\n    xhr.open('POST', '/api/up-safe'); xhr.send(fd);\n  }\n  return (\n    <main className=\"p-4 text-lg\">\n      <input id=\"f\" type=\"file\" accept=\"image/*\" onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); if (f) setPreview(URL.createObjectURL(f)); }} />\n      {preview && <img id=\"pv\" src={preview} alt=\"\" className=\"my-2 h-24\" />}\n      <button id=\"gui\" onClick={send} disabled={!file || busy} className=\"rounded border px-3 disabled:opacity-40\">{busy ? 'Uploading…' : 'Upload'}</button>\n      <p id=\"log\">{log.join(' · ')}</p>\n    </main>\n  );\n}\n",
 "n16-5:file:src/app/tai/page.tsx": "import { Upload } from './Upload';\nexport default function Page() { return <Upload />; }\n",
 "n16-5:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/tai|/api/(up-|ls)|rror'\n✓ Compiled successfully in 4.3s\n├ ƒ /api/ls\n├ ƒ /api/up-naive\n├ ƒ /api/up-safe\n└ ○ /tai",
 "n16-5:tan": "# 1 · the naive endpoint: the browser chooses the name, the type and the size\n$ curl -s -w 'HTTP %{http_code}' -F 'file=@evil.jpg;filename=../../config/app.json' localhost:3000/api/up-naive -H \"Cookie: token=$AN\"; grep XMinio server.log\nHTTP 500\nXMinioInvalidResourceName: Resource name contains bad components such as \"\n$ curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/up-naive -H \"Cookie: token=$AN\"     # an HTML page named .jpg\n{\"key\":\"avatars/1/evil.jpg\",\"type\":\"image/jpeg\",\"size\":65}\n$ curl -s -F 'file=@that.jpg;filename=me.jpg' localhost:3000/api/up-naive …   # twice, the same name\nobjects named me.jpg after two uploads: 1\n$ curl -s localhost:3000/api/ls\navatars/1/82d14948-c6bd-4730-9367-34f966207074.jpg  446280 B\navatars/1/anh-200kb.jpg  204800 B\navatars/1/evil.jpg  65 B\navatars/1/me.jpg  446280 B\n# what a ../ in a name does on a disk-backed store (path.join)\n$ node -e \"const p=require('path'); console.log(p.join('uploads/avatars/1', '../../config/app.json'))\"\nuploads/config/app.json",
 "n16-5:an": "# 2 · the safe endpoint: the server decides who, how big, what, where\n$ curl -s -o /dev/null -w '%{http_code}\\n' -F file=@that.jpg localhost:3000/api/up-safe            # no cookie\n401\n$ curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/up-safe -H \"Cookie: token=$AN\"\n{\"error\":\"not an image (declared image/jpeg)\"}\n$ curl -s -F file=@lon-6mb.jpg localhost:3000/api/up-safe -H \"Cookie: token=$AN\"\n{\"error\":\"too large (header)\"}\n$ curl -s -F 'file=@that.jpg;filename=../../config/app.json' localhost:3000/api/up-safe -H \"Cookie: token=$AN\"\n{\"key\":\"avatars/1/82d14948-c6bd-4730-9367-34f966207074.jpg\",\"type\":\"image/jpeg\",\"label\":\"../../config/app.json\"}",
 "n16-5:file:/Users/admin/.rtq-nxj/lab/c16/thu-ast.ts": "import { assertSafeUploadType } from '/Users/admin/Downloads/api-backend/src/storage/uploadService';\nfor (const [m, n] of [['text/html', 'page.html'], ['image/svg+xml', 'logo.svg'], ['image/jpeg', 'evil.jpg']] as const) {\n  try { assertSafeUploadType(m, n, 'images/avatars' as never); console.log(`${m.padEnd(14)} ${n.padEnd(10)} ⇒ accepted`); }\n  catch (e) { console.log(`${m.padEnd(14)} ${n.padEnd(10)} ⇒ ${(e as Error).message}`); }\n}\n",
 "n16-5:kho": "$ git log --format='%h %ad %s' --date=short -1 7d1df6e86\n7d1df6e86 2026-07-10 fix(security): enforce post/story visibility, media-cleanup ownership, upload MIME allowlist (P0)\n$ grep -n \"assertSafeUploadType(req.file.mimetype, req.file.originalname\" src/routes/upload.routes.ts | head -1\n91:      assertSafeUploadType(req.file.mimetype, req.file.originalname, bucket);\n$ npx tsx -e \"assertSafeUploadType(mimetype, originalname, 'images/avatars') for three uploads\"\ntext/html      page.html  ⇒ File type not allowed\nimage/svg+xml  logo.svg   ⇒ File type not allowed\nimage/jpeg     evil.jpg   ⇒ accepted",
 "n16-5:dung": "",
 "n16-5:byte": "$ head -c 4 that.jpg | xxd -p\nffd8ffdb\n$ head -c 4 evil.jpg | xxd -p\n3c68746d",
 "anh-nxj-16-5:ux-chon": {
  "url": "http://localhost:19321/tai",
  "vp": [
   640,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-16-5:ux": {
  "url": "http://localhost:19321/api/dem",
  "vp": [
   640,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19321/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 60
   },
   {
    "url": "http://localhost:19321/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 529,
    "ve": 536
   },
   {
    "url": "http://localhost:19321/tai",
    "ma": 200,
    "loai": "document",
    "kt": 7154
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/1364stb0liq13.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14811
   },
   {
    "url": "http://localhost:19321/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19321/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/29sra8soyrj-7.js",
    "ma": 200,
    "loai": "script",
    "kt": 1032
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19321/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "blob:http://localhost:19321/3be62861-0473-43f9-bfa7-884837bb9f72",
    "ma": 200,
    "loai": "image",
    "kt": 446280
   },
   {
    "url": "http://localhost:19321/api/up-safe",
    "ma": 200,
    "loai": "xhr",
    "kt": 99,
    "pt": "POST",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryGkA0fqnMkO7Uwdfr",
    "ct": "application/json",
    "than": "",
    "ms": 1600,
    "ve": 1644
   }
  ],
  "console": [],
  "ketQua": {
   "chọn ảnh ⇒ xem trước": "blob:http://localhost:19321/3be62861-047 · button disabled=false",
   "ngay sau khi bấm ⇒ disabled": "false · Upload",
   "tiến trình + kết quả ⇒": "100% · 200 {\"key\":\"avatars/1/f689ec36-754c-4629-9d5c-c6c0753c7dd0.jpg\",\"type\":\"image/jpeg\",\"label\":\"that.jpg\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, thucTe4 } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-16-5', code: 'NXJ 16.5', title: 'Upload UX, and the security you cannot skip', sub: 'Chapter 16 · Lesson 16.5' };
const O = (k) => { const v = DU_LIEU[`n16-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-16-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-16-5', ten, { vp: 640, ...o });

// ── số đo (n16-5 · lab c16 + MinIO riêng · Next.js 16.4.6 · next start 19321 · Chromium)
const TSE = O('bai').split('\n').filter((l) => /error TS/.test(l));
const N_DOT = doan('tan', 'config/app.json'), N_EVIL = doan('tan', "type=image/jpeg' localhost")[0], N_ME = doan('tan', 'twice')[0];
const LS = doan('tan', 'api/ls').filter((l) => /evil|me\.jpg/.test(l)), PJ = doan('tan', 'p.join(')[0];
const S_NO = doan('an', 'no cookie')[0], S_EVIL = doan('an', "type=image/jpeg' localhost")[0], S_BIG = doan('an', 'lon-6mb')[0], S_DOT = doan('an', 'config/app.json')[0];
const KHO = O('kho');
if (!/ffd8ff/.test(O('byte')) || !/3c68746d/.test(O('byte'))) throw new Error('byte đổi');
const UX = Object.values(A('ux').ketQua);
if (TSE.length !== 5 || N_DOT[0] !== 'HTTP 500' || !/XMinioInvalidResourceName/.test(N_DOT[1]) || !/"key":"avatars\/1\/evil\.jpg"/.test(N_EVIL) || !/: 1$/.test(N_ME) || PJ !== 'uploads/config/app.json') throw new Error('tan đổi');
if (S_NO !== '401' || !/not an image \(declared image\/jpeg\)/.test(S_EVIL) || !/too large/.test(S_BIG) || !/"key":"avatars\/1\/[0-9a-f-]{36}\.jpg".*"label":"\.\.\/\.\.\/config\/app\.json"/.test(S_DOT)) throw new Error('an đổi');
if (!/accepted$/.test(KHO.split('\n').find((l) => /evil\.jpg/.test(l)) || '')) throw new Error('kho đổi');
if (!/^blob:/.test(UX[0]) || !/^100% · 200/.test(UX[2])) throw new Error('ux đổi');

const SAFE = F('src/app/api/up-safe/route.ts').split('\n').filter((l) => !/^\/\/ app|^import/.test(l)).join('\n').trim()
  .replace(/ +\/\/ .*$/gm, '')
  .replace(/^(\s*)if \((.*)\) return (Response\.json\(.*)$/gm, '$1if ($2)\n$1  return $3')
  .replace("  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: real.type }));", "  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key,\n    Body: bytes, ContentType: real.type }));");
if (!/sniff\(bytes\)/.test(SAFE) || !/crypto\.randomUUID/.test(SAFE)) throw new Error('SAFE đổi');
const SNIFF = F('src/lib/sniff.ts').split('\n').filter((l) => !/^\/\/ lib/.test(l)).join('\n').replace('  for (const [type, ext, sig] of SIGS) if (sig.every((b, i) => bytes[i] === b)) return { type, ext };', '  for (const [type, ext, sig] of SIGS)\n    if (sig.every((b, i) => bytes[i] === b)) return { type, ext };');
if (!/sig\.every/.test(SNIFF)) throw new Error('SNIFF đổi');
const LESSON = `async function uploadAvatar(formData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const file = formData.get('avatar');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Wrong type');
  if (file.size > MAX_BYTES)         throw new Error('Too large');
  const key = \`avatars/\${user.id}/\${crypto.randomUUID()}\`;
  await storage.put(key, file);
  await db.user.update({ where: { id: user.id },
    data: { avatarKey: key } });
}`;
const UXC = F('src/app/tai/Upload.tsx');
if (!/xhr\.upload\.onprogress/.test(UXC) || !/createObjectURL/.test(UXC)) throw new Error('UX đổi');

export const S = [
  { cover: true, nhan: 'Chapter 16 · Lesson 16.5', t: 'Upload UX,<br>and the security<br>you cannot skip', sub: 'Preview, progress, a disabled button — then four server checks, each measured against a request that breaks it',
    en: 'Lesson sixteen point five: upload UX, and the security you cannot skip. Preview, progress and a disabled button; then four server checks, each measured against a request that breaks it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>UX: a <code>blob:</code> preview, upload progress (XHR), a button that cannot fire twice</li>
    <li><code>accept="image/*"</code> and client size checks are hints — <code>curl</code> ignores them</li>
    <li>Four server checks: <b>who</b>, <b>how big</b>, <b>what really</b> (bytes, not name), <b>where</b> (the server's key)</li>
    <li>Measured: an HTML page named <code>evil.jpg</code> passes a name/MIME check and fails a byte check</li>
    <li>Never use the browser's file name as the storage key</li></ul>`,
    en: 'Five takeaways: the UX layer, a blob preview, progress and a button that cannot fire twice; client hints are not checks; four server checks, who, how big, what really, and where; an HTML page named evil dot jpg passes a name check and fails a byte check; and never use the browser\'s file name as the key.' },
  { t: 'The UX layer', body: two(D(tsx(`// app/tai/Upload.tsx (excerpt)
const xhr = new XMLHttpRequest();   // fetch has no upload progress
xhr.upload.onprogress = (e) =>
  setLog((l) => [...l, \`\${Math.round((e.loaded / e.total) * 100)}%\`]);
<input type="file" accept="image/*"
  onChange={(e) => { … setPreview(URL.createObjectURL(f)); }} />
<button onClick={send} disabled={!file || busy}>…</button>`, { sm: true }),
      B('ux-chon', { url: 'localhost:3000/tai · that.jpg chosen', h: 150, w: 500 })),
    D(tn(['# Chromium (real)', `preview src: ${UX[0]}…`, `right after the click: disabled=${UX[1]}`, `log: ${UX[2].slice(0, 120)}…`].join('\n'), { fs: 13, wrap: 50, title: 'Chromium (real)' }),
      box('What you saw', 'A <code>blob:</code> preview, instantly. On localhost the 446 KB upload ended before we read the button: one progress event, 100%. <code>fetch</code> has no upload progress; XHR does.', 'lam')), ''),
    en: 'The UX layer. Choosing a file gives an instant blob preview. XMLHttpRequest reports upload progress, which fetch does not, and the button is disabled while sending. On localhost the upload finished almost instantly: one progress event at one hundred percent.' },
  { t: "The lesson's safe skeleton on Next.js 16.4.6", body: two(D(tsx(LESSON, { sm: true, hl: [4, 6, 7, 8] })),
    D(tn(['$ npx tsc --noEmit', ...TSE.map((l) => l.replace(/^src\/app\/tai\/bai\.ts/, 'bai.ts'))].join('\n'), { fs: 13, wrap: 50, title: 'tsc (real)' }),
      box('Right idea, two weak spots', 'It still needs types and real helpers. And <code>ALLOWED_TYPES.has(file.type)</code> checks the type the <b>browser declared</b> — the next slides send a lie and see who catches it.', 'lam')), 'r64'),
    en: 'The lesson\'s safe skeleton on Next.js sixteen: the right idea, five type errors. And it checks file dot type, the type the browser declared. Next, we send a lie and see which check catches it.' },
  { t: 'Measured: the naive endpoint trusts the browser', body: two(D(tn(["$ curl -F 'file=@evil.jpg;filename=../../config/app.json' …/api/up-naive", ...N_DOT, "$ curl -F 'file=@evil.jpg;type=image/jpeg' …/api/up-naive   # HTML named .jpg", N_EVIL, '$ curl … filename=me.jpg   # twice', N_ME, '$ curl …/api/ls', ...LS].join('\n'), { fs: 12, wrap: 60, title: 'curl (real)' })),
    D(box('The browser chose the name', 'MinIO refused the <code>..</code> key with a 500 — the user got a server error, not a message. A disk store does worse: <code>path.join(\'uploads/avatars/1\', \'../../config/app.json\')</code> = <code>' + PJ + '</code>.', 'do2'),
      box('…the type, and the overwrite', 'An HTML page labelled <code>image/jpeg</code> was stored as <code>evil.jpg</code>. Two uploads named <code>me.jpg</code> left one object: the second overwrote the first.', 'do2')), 'r56'),
    en: 'Measured: the naive endpoint trusts the browser. A file named dot dot slash config: MinIO refused the key, and the user got a 500; on a disk store path join walks out of the folder. An HTML page labelled image jpeg was stored. Two uploads with the same name left one object.' },
  { t: 'Four checks, in the server', body: two(D(tsx(SAFE, { sm: true })),
    D(icards([
      ['user', 'Who', 'signed in, allowed'],
      ['ruler', 'How big', 'header, then size'],
      ['search', 'What really', 'first bytes'],
      ['folder', 'Where', 'server-built key'],
    ], 1)), 'r64'),
    en: 'Four checks, in the server: who is uploading; how big, from the header before reading and then the real size; what it really is, from the first bytes; and where it lands, a key the server builds from the user id and a uuid. The original name is only a label.' },
  { t: 'Measured: the same attacks against the safe endpoint', body: two(D(tn(['$ curl -F file=@that.jpg …/api/up-safe            # no cookie', S_NO, "$ curl -F 'file=@evil.jpg;type=image/jpeg' …/api/up-safe", S_EVIL, '$ curl -F file=@lon-6mb.jpg …/api/up-safe', S_BIG, "$ curl -F 'file=@that.jpg;filename=../../config/app.json' …", S_DOT].join('\n'), { fs: 12, wrap: 60, title: 'curl (real)' })),
    D(box('Every lie stopped', 'No session: 401. A page that declares <code>image/jpeg</code> but starts with <code>&lt;html&gt;</code>: 415. Six megabytes: 413 from the header, before reading the body.', 'xanh'),
      box('The ../ name is harmless now', 'It became a label; the key is <code>avatars/1/&lt;uuid&gt;.jpg</code>, extension from the sniffed type.', 'xanh')), 'r56'),
    en: 'Measured: the same attacks against the safe endpoint. No session: 401. A page that declares image jpeg but starts with html: 415. Six megabytes: 413 from the header, before reading the body. The dot dot name is now only a label; the key is a uuid.' },
  { t: 'Sniffing: the first bytes tell the truth', body: two(D(tsx(SNIFF, { sm: true, hl: [2, 3, 4] })),
    D(tn(O('byte').replace(/^(3c68746d)$/m, '$1    # "<htm"'), { fs: 15, wrap: 36, title: 'the bytes (real files)' }),
      box('Name and MIME are attacker input', 'Both arrive in the request. The magic number is in the file itself. For more formats, the <code>file-type</code> package does the same, from a table of hundreds.', 'lam')), ''),
    en: 'Sniffing: the first bytes tell the truth. A JPEG starts with F F D 8 F F, a PNG with eight nine P N G. Our evil dot jpg starts with less-than h t m. The name and the declared type are attacker input; the magic number is in the file.' },
  { t: 'cuongthai.com: a denylist on name + MIME', body: two(D(tn(KHO, { fs: 13, wrap: 64, title: 'repo (real)' })),
    D(box('A real P0 fix (10 July 2026)', 'Uploads of active content (HTML, SVG, JS) are rejected by <code>assertSafeUploadType</code> — the security audit\'s fix.', 'xanh'),
      box('What it looks at', 'The declared <code>mimetype</code> and the <code>originalname</code> — never the bytes. <code>image/jpeg</code> + <code>evil.jpg</code> is accepted whatever is inside. The stored content type comes from the extension, so it is served as an image, not run as HTML — but a byte sniff would close the gap.', 'lam')), ''),
    en: 'cuongthai.com: a real security fix from the tenth of July rejects active content like HTML and SVG. It looks at the declared mime type and the file name, never the bytes, so image jpeg plus evil dot jpg is accepted whatever is inside. It is served as an image, but a byte sniff would close the gap.' },
  { t: 'Presigned uploads need the same four checks', body: steps([
      `<b>Who</b>: authenticate before signing — a URL handed to anyone is free storage for the internet`,
      `<b>How big</b>: sign the size (${c('ContentLength')} / a POST policy with ${c('content-length-range')}) — the client is not a control`,
      `<b>What</b>: after the upload, read the first bytes from storage and delete what is not an image`,
      `<b>Where</b>: the server picks the key, under the user's prefix (16.4: an edited key ⇒ ${c('SignatureDoesNotMatch')})`,
    ]) + box('16.4 had a gap', 'The lab\'s <code>/api/presign</code> signed for anyone, with any name. Fine for a demo; in production it is the first thing to fix.', 'do2'),
    en: 'Presigned uploads need the same four checks: authenticate before signing; sign the size; after the upload, read the first bytes from storage and delete what is not an image; and let the server pick the key. Our 16.4 presign route signed for anyone, a gap to fix in production.' },
  { t: "Not learning in a vacuum: real life, what if, the attacker", to: true, body: thucTe4({ doi: ["🪪", "ID photo, CV, profile picture", ["you pass an upload endpoint every day", "loan apps · job sites · social networks"]], neu: ["🧨", "Allow SVG or HTML as an avatar?", ["whoever opens the 'image' runs a stranger's script", "on your own domain"]], xau: ["🎣", "A fake sign-in page in your storage", ["a link with your real domain ⇒ phishing", "or overwrite other people's files"]], phong: ["🛡️", "Sniff bytes · server-built keys", ["Content-Type from the bytes, not the name", "scan: image extension, HTML content"]] }),
    en: "Real life: uploading an ID photo to an app, a CV to a job site, a profile picture — you pass an upload endpoint every day. What if a site accepts SVG or HTML as an avatar? Whoever opens that 'image' may run someone else's script, on your domain. An attacker hosts a fake sign-in page in your storage and sends a link with your real domain for phishing — or overwrites other people's files. Prevent it: sniff the bytes, server-built keys, content type from the bytes. Detect it: scan the bucket for image extensions whose content is HTML." },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('blob: preview', 'instant, local'), kw('upload.onprogress', 'XHR only'), kw('accept / size hint', 'UX, not security'), kw('Magic number', 'the first bytes'),
      kw('Sniffing', 'type from content'), kw('Server-chosen key', 'user id + uuid'), kw('Path traversal', '../ in a name'), kw('413 / 415', 'too large / wrong type'),
      kw('Label', 'the original name, as text'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: blob preview; upload onprogress; accept and size hints, UX not security; magic number; sniffing; the server-chosen key; path traversal; 413 and 415; and the original name kept only as a label.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add a ${c('blob:')} preview, XHR progress and a disabled button`,
      `${c('curl')} an HTML file as ${c('type=image/jpeg')} at your endpoint`,
      `Send ${c('filename=../../x')} — then build the key on the server`,
      `Sniff the first bytes; reject what is not an image (415)`,
    ]), box('Keep these', `<ul><li>Client checks are hints</li><li>Who · how big · what really · where</li><li>Bytes over names</li><li>The name is a label, never a path</li></ul>`, 'lam'), ''),
    en: 'Your turn: add a preview, progress and a disabled button; curl an HTML file labelled image jpeg; send a dot dot file name and build the key on the server instead; then sniff the first bytes and reject what is not an image.' },
];
export const slides = lamDeck({ chuong: 'Chapter 16 — Forms, validation, and file uploads', bai: '16.5' }, S);
