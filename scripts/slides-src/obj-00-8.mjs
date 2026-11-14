/**
 * obj-00-8 — Object Storage · Section 0 · Start here (1/2) "What object storage is, and why every app you use needs it" (deck video + web, 14/11/2026).
 * Bài web: os-0-0-bat-dau-tai-day. Output THẬT (scratchpad/obj/demo/n0-8.txt · MinIO RELEASE.2026-11-12 trong Docker · aws-cli 2.31.22 ·
 * @aws-sdk/client-s3 3.1071.0 · Node 22.23.3, Mac): PUT ảnh 608 B vào users/42/avatars/me.jpg, HEAD, GET lại giống từng byte, "đổi ảnh" = PUT cả tệp
 * cùng key ⇒ ETag đổi; hai server sau bộ cân tải: lưu ổ đĩa riêng ⇒ 5/10 lần GET 404, lưu bucket chung ⇒ 10/10 200; curl -I ảnh bìa khoá trên
 * media.cuongthai.com (server: cloudflare, cache-control immutable) vs cuongthai.com (nginx). Mã kho: src/config/r2.ts dòng 70–82 (S3Client region/endpoint).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-8:quay": "$ export AWS_ENDPOINT_URL=http://localhost:20200    # MinIO của khoá, chạy trong Docker — KHÔNG phải bucket thật\n$ aws s3 mb s3://anh-dai-dien\nmake_bucket: anh-dai-dien\n$ aws s3 cp me.jpg s3://anh-dai-dien/users/42/avatars/me.jpg\nupload: me.jpg -> s3://anh-dai-dien/users/42/avatars/me.jpg\n$ aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag}' --output text\n\"50c3808ca883b0fe6b0fa47c2dbd24c5\"\t608\timage/jpeg\n$ aws s3 cp s3://anh-dai-dien/users/42/avatars/me.jpg lay-lai.jpg && cmp me.jpg lay-lai.jpg && echo \"giống hệt từng byte\"\ngiống hệt từng byte\n$ aws s3 cp me-moi.jpg s3://anh-dai-dien/users/42/avatars/me.jpg    # \"đổi ảnh\" = gửi CẢ tệp mới cùng key\nupload: me-moi.jpg -> s3://anh-dai-dien/users/42/avatars/me.jpg\n$ aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag}' --output text\n\"1e4bb2b2b7efa6328064d362e4009e2f\"\t608\timage/jpeg\n$ aws s3 ls s3://anh-dai-dien --recursive\n2026-11-14 10:22:59        608 users/42/avatars/me.jpg\n$ aws s3 ls s3://anh-dai-dien/users/42/avatars/khong-co.jpg; echo \"exit $?\"\nexit 1",
 "n0-8:file:hai-may.mjs": "// Hai server app sau một bộ cân tải luân phiên. Kiểu A: lưu ảnh vào Ổ ĐĨA của chính server. Kiểu B: lưu vào object storage (MinIO).\nimport http from 'node:http';\nimport fs from 'node:fs';\nimport { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nconst KIEU = process.argv[2];                                   // 'dia' | 'kho'\nconst BUCKET = 'anh-dai-dien';\nfunction mayChu(ten, cong) {\n  const thuMuc = `./o-dia-${ten}`; fs.rmSync(thuMuc, { recursive: true, force: true }); fs.mkdirSync(thuMuc);\n  return new Promise((ok) => http.createServer(async (req, res) => {\n    const key = req.url.slice(1);                               // /users/42/avatars/me.jpg ⇒ users/42/avatars/me.jpg\n    try {\n      if (req.method === 'PUT') {\n        const than = Buffer.concat(await Array.fromAsync(req));\n        if (KIEU === 'dia') fs.writeFileSync(`${thuMuc}/${key.replaceAll('/', '_')}`, than);\n        else await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: than, ContentType: 'image/jpeg' }));\n        res.writeHead(201).end(`${ten} đã lưu`);\n      } else {\n        const than = KIEU === 'dia' ? fs.readFileSync(`${thuMuc}/${key.replaceAll('/', '_')}`)\n          : Buffer.from(await (await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))).Body.transformToByteArray());\n        res.writeHead(200, { 'x-may': ten }).end(than);\n      }\n    } catch { res.writeHead(404, { 'x-may': ten }).end(); }\n  }).listen(cong, ok));\n}\nawait mayChu('A', 20211); await mayChu('B', 20212);\nlet luot = 0;                                                    // bộ cân tải: A, B, A, B…\nawait new Promise((ok) => http.createServer((req, res) => {\n  const cong = luot++ % 2 === 0 ? 20211 : 20212;\n  req.pipe(http.request({ port: cong, path: req.url, method: req.method, headers: req.headers }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); }));\n}).listen(20210, ok));\nconst anh = fs.readFileSync('me.jpg');\nconst up = await fetch('http://localhost:20210/users/7/avatars/me.jpg', { method: 'PUT', body: anh });\nconsole.log(`PUT ảnh (${anh.length} B) → ${up.status} ${await up.text()}`);\nconst dem = { 200: 0, 404: 0 }, dong = [];\nfor (let i = 1; i <= 10; i++) {\n  const r = await fetch('http://localhost:20210/users/7/avatars/me.jpg'); await r.arrayBuffer();\n  dem[r.status]++; dong.push(`${r.status}(${r.headers.get('x-may')})`);\n}\nconsole.log(`10 lần GET: ${dong.join(' ')}`);\nconsole.log(`⇒ ${dem[200]} thấy ảnh · ${dem[404]} lỗi 404`);\nprocess.exit(0);\n",
 "n0-8:haimay": "$ # Kiểu A — mỗi server lưu ảnh vào ổ đĩa của CHÍNH NÓ (fs.writeFile)\n$ node hai-may.mjs dia\nPUT ảnh (608 B) → 201 A đã lưu\n10 lần GET: 404(B) 200(A) 404(B) 200(A) 404(B) 200(A) 404(B) 200(A) 404(B) 200(A)\n⇒ 5 thấy ảnh · 5 lỗi 404\n$ # Kiểu B — cả hai server lưu vào cùng một bucket (object storage)\n$ node hai-may.mjs kho\nPUT ảnh (608 B) → 201 A đã lưu\n10 lần GET: 200(B) 200(A) 200(B) 200(A) 200(B) 200(A) 200(B) 200(A) 200(B) 200(A)\n⇒ 10 thấy ảnh · 0 lỗi 404",
 "n0-8:cdn": "$ curl -sI \"https://media.cuongthai.com/images/course-covers/object-storage.png?v=4\"\nHTTP/2 200 \ncontent-type: image/png\ncontent-length: 192778\ncache-control: public, max-age=31536000, immutable\netag: \"1aa45d442648eaeb00d80278a602a79d\"\nserver: cloudflare\ncf-cache-status: DYNAMIC\n$ curl -sI https://cuongthai.com/ | grep -iE '^(HTTP/|server:|content-type:)'\nHTTP/2 200 \nserver: nginx/1.27.5\ncontent-type: text/html; charset=utf-8",
 "n0-8:doi": "$ # Cùng một mã SDK v3 — chỉ ENDPOINT khác nhau: MinIO của khoá ⇄ Cloudflare R2 của kho\n$ cd ~/Downloads/api-backend && sed -n '70,72p;82p' src/config/r2.ts\n  cachedClient = new S3Client({\n    region: config.r2.region,\n    endpoint: config.r2.endpoint,\n    forcePathStyle: false,\n$ cd ~/Downloads/api-backend && grep -nE \"^  R2_[A-Z_]+:\" src/config/env.ts\n148:  R2_BUCKET_NAME: z.string().optional().default(''),\n149:  R2_PUBLIC_URL: z.string().optional().default(''),\n150:  R2_ENDPOINT_URL: z.string().optional().default(''),\n151:  R2_ACCESS_KEY_ID: z.string().optional().default(''),\n152:  R2_SECRET_ACCESS_KEY: z.string().optional().default(''),\n153:  R2_REGION: z.string().optional().default('auto'),"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, flow, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-00-8', code: 'OBJ 0.8', title: 'Start here (1/2) — What object storage is, and why every app needs it', sub: 'Section 0 · Start here (1/2)' };
const O = (k) => { const v = DU_LIEU[`n0-8:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const QUAY = O('quay').split('\n').filter((l) => !/^\$ export|^\$ aws s3 ls|^2026-|^exit/.test(l)).map((l) => l.replace(/ --query '\{Size.*$/, ' …').replace(/ && cmp .*$/, ' && cmp …').replace(/ +# .*$/, '')).join('\n');
const HAI = O('haimay');
const so = (kieu) => { const k = HAI.split('$ node hai-may.mjs ' + kieu)[1]; return +(/⇒ (\d+) thấy ảnh/.exec(k)[1]); };
const DIA = so('dia'), KHO = so('kho');
const CDN = O('cdn');

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What object storage is,<br>and why every app needs it', sub: 'A left-luggage counter for files — run for real on a local MinIO, never the production bucket',
    en: 'Start here, part one: what object storage is, and why every app you use needs it. Everything in this lesson runs for real on a local MinIO.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Object storage as a left-luggage counter: object, key, bucket</li>
    <li>Upload, read back and "replace" a real avatar — on MinIO</li>
    <li>Why not the database, and why not the server's own disk</li>
    <li>Two servers behind a load balancer, measured: disk vs bucket</li>
    <li>The S3 API, Cloudflare R2, and where this site already uses it</li>
    <li>What the course covers, and what you will be able to do</li></ul>`,
    en: 'Six takeaways: the left-luggage picture of object, key and bucket; a real upload on MinIO; why not the database or the server disk; two servers measured; the S3 API and R2 on this very site; and the course map.' },
  { t: 'A left-luggage counter — for files', body: icards([
      ['box', 'The bag = an object', 'the whole file plus a few labels (type, size). You hand over the WHOLE bag.'],
      ['key', 'The ticket = a key', 'a name you choose, e.g. users/42/avatars/me.jpg — the only way to get the bag back.'],
      ['layers', 'The shelf = a bucket', 'a huge shared shelf run by the counter. You never walk behind the desk.'],
      ['warn', 'Counter rules', 'no swapping one shirt inside a bag; no browsing the shelves; the counter does not care what is inside.'],
    ], 2) + box('One sentence to keep', 'Object storage keeps <b>whole files</b> as objects, each found by a text <b>key</b>, inside a <b>bucket</b> — reachable over HTTP from anywhere.', 'lam'),
    en: 'A left-luggage counter for files. The bag is the object: the whole file plus a few labels. The ticket is the key, a name you choose. The shelf is the bucket. And the counter rules hold: you replace the whole bag, you never edit one shirt inside it.' },
  { t: 'Measured: one avatar, one key, on a real S3 server', body: tn(QUAY, { fs: 16, wrap: 100 }) +
      two(box('Get it back by its key', `${c('aws s3 cp')} back down: ${c('cmp')} says the bytes are identical. The "folders" in the key are just characters.`, 'xanh'),
        box('"Changing" the avatar = a whole new upload', 'Same key, new file: the ETag (content fingerprint) changed. There is no API to edit part of an object.', 'do2')),
    en: 'Measured on a local MinIO with the AWS CLI. We created a bucket, uploaded a six hundred and eight byte avatar under the key users slash forty-two slash avatars slash me dot jpg, read it back, and got identical bytes. Changing the avatar meant uploading a whole new file under the same key, and the ETag changed.' },
  { t: 'Why not the database, or the server\'s own disk?', body: icards([
      ['db', 'Not the database', 'built for small, structured, queryable rows. A 50 MB video makes it huge and slow, and backups painful. Keep the METADATA in the DB, the BYTES in storage.'],
      ['server', 'Not the server\'s disk', 'a second server cannot see it, the disk fills up, and a redeploy or crash can wipe it.'],
      ['map', 'Served fast, everywhere', 'a bucket plus a CDN serves the same image from an edge near each user — your app server spends no bandwidth on it.'],
    ], 3) + box('The rule most apps follow', `A row like ${c('avatar_key = users/42/avatars/me.jpg')} in the database, the bytes in the bucket. Section 0.2 builds this model.`, 'lam'),
    en: 'Why not the database? It is built for small structured rows; big files make it slow and make backups painful. Why not the server disk? Another server cannot see it, it fills up, and a redeploy can wipe it. The rule: metadata in the database, bytes in object storage.' },
  { t: 'Measured: two servers behind one load balancer', body: tn(HAI.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n'), { fs: 16, wrap: 100 }) +
      two(cmp(['Where each server saves the upload', '10 GETs found it', '404'], [['its own disk (fs.writeFile)', `<b>${DIA}</b>`, `<b>${10 - DIA}</b>`], ['one shared bucket (object storage)', `<b>${KHO}</b>`, `<b>${10 - KHO}</b>`]], { hl: [0] }),
        box('Why half the requests 404', `The upload landed on server A's disk. Every GET that the balancer sent to B asked a disk that never saw the file. With one bucket, both servers read the same object.`, 'do2'), 'r64'),
    en: 'Measured: two servers behind a round-robin load balancer. When each server saved the upload to its own disk, only five of ten requests found the avatar; the other five went to server B and got four oh four. When both servers saved to one bucket, ten of ten found it.' },
  { t: 'The S3 API, and Cloudflare R2', body: flow([
      { t: '2006', s: 'Amazon S3 launches' }, { t: 'its HTTP API', s: 'copied everywhere' }, { t: '"S3-compatible"', s: 'a standard, like USB' },
      { t: 'MinIO', s: 'this course (local)', mau: XANH }, { t: 'Cloudflare R2', s: 'this repo (production)', mau: XANH },
    ], { h: 128, fs: 20 }) + two(tn(O('doi').split('\n').filter((l) => !/^\$ #/.test(l)).join('\n'), { fs: 14, wrap: 64 }),
      box('Same code, different endpoint', `The repo talks to R2 through the AWS SDK with an ${c('endpoint')}. Point the same code at MinIO and every lesson runs on your laptop. R2's selling point: <b>no egress fee</b> — AWS lists about $0.09/GB; lesson 2.1 does the math.`, 'lam'), 'r64'),
    en: 'The S3 API: Amazon launched S3 in two thousand six, and its HTTP API became the standard that others copy, like USB. MinIO and Cloudflare R2 both speak it. The repo builds its client with an endpoint from the environment, so the same code runs against MinIO on your laptop. R2 charges nothing for egress; lesson two point one does the math.' },
  { t: 'You have already met it — on this site', body: two(tn(CDN, { fs: 15, wrap: 64 }),
      `<div>${box(c('media.cuongthai.com'), 'Every avatar, post image, course cover and track on this site is an object, served by Cloudflare (<code>server: cloudflare</code>) — not by the app server.', 'xanh')}${box(c('cuongthai.com'), 'The app itself answers from nginx on the VPS. Two hosts, two jobs: pages from the app, bytes from storage.', 'lam')}${box('immutable', `${c('cache-control: public, max-age=31536000, immutable')} — a file that never changes can be cached for a year. Chapter 3.`, '')}</div>`, 'r64'),
    en: 'You have already met it on this site. A course cover on media dot cuongthai dot com is answered by Cloudflare, with a one-year immutable cache header. The app pages come from nginx on the VPS. Two hosts, two jobs.' },
  { t: 'What the course covers', body: flow([
      { t: 'Sec 0', s: 'what it is' }, { t: 'Ch 1–2', s: 'S3 API · R2' }, { t: 'Ch 3–5', s: 'URLs · presign · CORS' },
      { t: 'Ch 6–7', s: 'lifecycle · cost' }, { t: 'Ch 8', s: 'S3 → R2' }, { t: 'Ch 9–10', s: 'diagnose · exam' },
    ], { h: 120, fs: 21 }) + icards([
      ['check', 'Upload and serve right', 'Content-Type, Cache-Control, CDN'],
      ['bolt', 'Browser uploads directly', 'presigned URLs + CORS'],
      ['shield', 'Cheap and safe', 'egress, private, signed, lifecycle'],
      ['search', 'Diagnose', '403, CORS preflight, stale cache'],
    ], 2) + box('One rule for the whole course', 'Every number was measured — on MinIO or on this repo\'s code. Never on the production bucket. If yours differs, yours wins.', 'lam'), to: true,
    en: 'The course map: section zero is what it is; chapters one and two the S3 API and R2; three to five URLs, presigned uploads and CORS; six and seven lifecycle and cost; eight migration; nine and ten diagnosis and the exam. You will upload and serve correctly, let browsers upload directly, keep it cheap and safe, and diagnose the classic failures.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Object storage', 'whole files as objects, by key, over HTTP'), kw('Object', 'the file + its metadata — the bag'), kw('Key', 'the text name, e.g. users/42/avatars/me.jpg — the ticket'),
      kw('Bucket', 'the container of objects — the shelf'), kw('S3 API', 'Amazon\'s storage API, now the de-facto standard'), kw('Cloudflare R2', 'S3-compatible, no egress fee — this repo'),
      kw('MinIO', 'an S3-compatible server you run locally — this course'), kw('CDN', 'edge caches near each user'), kw('Egress', 'bytes served out of storage'), kw('ETag', 'a fingerprint of the object\'s content'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: object storage; object, the bag; key, the ticket; bucket, the shelf; the S3 API; Cloudflare R2; MinIO, the local S3 server; CDN; egress; and ETag, the content fingerprint.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Open any image of an app you use in a new tab: is the host the app\'s own domain, or a storage/CDN host?',
      `Install Docker and the AWS CLI; start a local MinIO (${c('cgr.dev/chainguard/minio')}) — <b>${c('aws --version')}</b> must print a version`,
      'Upload one image under a key you choose, read it back, then "change" it — and watch the ETag',
      'Write one sentence: why serve images from a storage host and not the app server?',
    ]), box('Keep these', `<ul><li>Object = whole file, key = its name, bucket = the shelf</li><li>Replace, never edit part of an object</li><li>Metadata in the DB, bytes in the bucket</li><li>Own disk + 2 servers = ${10 - DIA}/10 GETs 404</li><li>Same SDK code: MinIO here, R2 in production</li></ul>`, 'lam'), ''),
    en: 'Your turn: find a real image on a storage host; install Docker and the AWS CLI and start a local MinIO; upload, read back and replace one image while watching the ETag; and write one sentence on why images live on a storage host. Keep: object, key, bucket; replace, never edit; metadata in the database; one disk per server breaks at two servers.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What object storage really is', bai: 'Start here 1/2' }, S);
