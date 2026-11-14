/**
 * obj-01-2 — Object Storage · Chapter 1 · 1.2 "Four basic operations: Put, Get, Head, Delete" (deck video + web, 14/11/2026).
 * Bài web: os-1-2-ops. Output THẬT (scratchpad/obj/demo/n1-2.txt · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0 · Node 22.23.3, Mac):
 * PUT có type ⇒ image/svg+xml + Cache-Control; PUT KHÔNG type qua SDK ⇒ application/octet-stream, không Cache-Control; PUT đè ⇒ thay NGUYÊN object (41 B, ETag mới,
 * Cache-Control MẤT); GET Body = ChecksumStream, transformToString OK, đọc lần hai ⇒ "The stream has already been transformed.", transformToByteArray Uint8Array;
 * mã cũ của bài web Buffer.concat(reader.read()) ⇒ TypeError; HEAD 5 MB: 0 byte thân, 6,8 ms vs GET 5.242.880 byte 90,5 ms; key thiếu: Head ⇒ NotFound 404, Get ⇒ NoSuchKey 404;
 * DeleteObject key không có ⇒ 204; DeleteObjects [a, b, ma] ⇒ Deleted liệt kê CẢ ma.jpg, Errors 0 (bài web cũ "check Deleted để biết chính xác" SAI); Quiet ⇒ Deleted 0;
 * 1.001 key ⇒ MalformedXML 400, 1.000 ⇒ 200; lỗi: NoSuchBucket 404 · SignatureDoesNotMatch 403 · InvalidAccessKeyId 403 · máy chủ tắt ⇒ AggregateError ECONNREFUSED.
 * Kho: GetObjectCommand ở 11 tệp (bài web cũ "kho KHÔNG dùng getObject" SAI); deleteObjects Quiet: true, không đọc res.Errors.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-2:file:s3.mjs": "import { S3Client } from '@aws-sdk/client-s3';\nexport const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nexport const B = 'bon-lenh';\n",
 "n1-2:file:put.mjs": "// PutObject: CÓ và KHÔNG có ContentType/CacheControl; PUT đè cùng key ⇒ thay NGUYÊN object (ETag + độ dài mới).\nimport { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nconst xem = async (k) => { const h = await s3.send(new HeadObjectCommand({ Bucket: B, Key: k }));\n  console.log(`  HEAD ${k}: ${h.ContentType} · ${h.CacheControl ?? '(không có Cache-Control)'} · ${h.ContentLength} B · ETag ${h.ETag}`); };\nconst anh = Buffer.from('<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"4\" height=\"4\"/>');\nlet r = await s3.send(new PutObjectCommand({ Bucket: B, Key: 'co-type.svg', Body: anh, ContentType: 'image/svg+xml', CacheControl: 'public, max-age=31536000, immutable' }));\nconsole.log(`PUT co-type.svg ⇒ HTTP ${r.$metadata.httpStatusCode} · ETag ${r.ETag}`); await xem('co-type.svg');\nr = await s3.send(new PutObjectCommand({ Bucket: B, Key: 'khong-type.svg', Body: anh }));\nconsole.log(`PUT khong-type.svg (không ContentType) ⇒ HTTP ${r.$metadata.httpStatusCode}`); await xem('khong-type.svg');\nr = await s3.send(new PutObjectCommand({ Bucket: B, Key: 'co-type.svg', Body: Buffer.from('<svg xmlns=\"http://www.w3.org/2000/svg\"/>'), ContentType: 'image/svg+xml' }));\nconsole.log('PUT đè co-type.svg (thân mới, quên CacheControl):'); await xem('co-type.svg');\n",
 "n1-2:put": "$ node put.mjs\nPUT co-type.svg ⇒ HTTP 200 · ETag \"b1a2b128b82fdd9dee8b3233b250721c\"\n  HEAD co-type.svg: image/svg+xml · public, max-age=31536000, immutable · 62 B · ETag \"b1a2b128b82fdd9dee8b3233b250721c\"\nPUT khong-type.svg (không ContentType) ⇒ HTTP 200\n  HEAD khong-type.svg: application/octet-stream · (không có Cache-Control) · 62 B · ETag \"b1a2b128b82fdd9dee8b3233b250721c\"\nPUT đè co-type.svg (thân mới, quên CacheControl):\n  HEAD co-type.svg: image/svg+xml · (không có Cache-Control) · 41 B · ETag \"46661d6d65debc63884004fed6e37e5c\"\n$ curl -s -D - -o /dev/null \"$(aws s3 presign s3://bon-lenh/khong-type.svg)\" | grep -iE \"^content-(type|disposition)\"\nContent-Type: application/octet-stream",
 "n1-2:file:get.mjs": "// GetObject: Body là stream — đọc bằng helper; đọc LẦN HAI thì sao; và đoạn mã cũ của bài web (Buffer.concat(reader.read())) chạy ra gì.\nimport { GetObjectCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nconst lay = () => s3.send(new GetObjectCommand({ Bucket: B, Key: 'co-type.svg' }));\nlet r = await lay();\nconsole.log(`Body: ${r.Body.constructor.name} · ContentType ${r.ContentType} · ContentLength ${r.ContentLength}`);\nconsole.log(`transformToString(): ${await r.Body.transformToString()}`);\ntry { await r.Body.transformToString(); } catch (e) { console.log(`đọc lần hai: ${e.name}: ${e.message}`); }\nr = await lay();\nconst bytes = await r.Body.transformToByteArray();\nconsole.log(`transformToByteArray(): ${bytes.constructor.name} ${bytes.byteLength} byte ⇒ Buffer.from(...) dùng được`);\nr = await lay();\ntry { const buf = Buffer.concat(await r.Body.transformToWebStream().getReader().read()); console.log(`mã cũ: ${buf.length}`); }\ncatch (e) { console.log(`mã cũ của bài web: ${e.name}: ${e.message.split('\\n')[0]}`); }\n",
 "n1-2:get": "$ node get.mjs\nBody: ChecksumStream · ContentType image/svg+xml · ContentLength 41\ntransformToString(): <svg xmlns=\"http://www.w3.org/2000/svg\"/>\nđọc lần hai: Error: The stream has already been transformed.\ntransformToByteArray(): Uint8Array 41 byte ⇒ Buffer.from(...) dùng được\nmã cũ của bài web: TypeError: The \"list\" argument must be an instance of Array. Received an instance of Object",
 "n1-2:file:head.mjs": "// HeadObject vs GetObject trên object 5 MB: byte đi qua dây và thời gian; key không tồn tại: tên lỗi của từng lệnh.\nimport { PutObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nawait s3.send(new PutObjectCommand({ Bucket: B, Key: 'to-5mb.bin', Body: Buffer.alloc(5 * 1024 * 1024, 7), ContentType: 'application/octet-stream' }));\nfor (const [ten, Lenh] of [['HEAD', HeadObjectCommand], ['GET ', GetObjectCommand]]) {\n  const t = performance.now();\n  const r = await s3.send(new Lenh({ Bucket: B, Key: 'to-5mb.bin' }));\n  const n = r.Body ? (await r.Body.transformToByteArray()).byteLength : 0;\n  console.log(`${ten} to-5mb.bin: ContentLength ${r.ContentLength} · byte thân đã nhận ${n} · ${(performance.now() - t).toFixed(1)} ms`);\n}\nfor (const [ten, Lenh] of [['HeadObject', HeadObjectCommand], ['GetObject', GetObjectCommand]]) {\n  try { await s3.send(new Lenh({ Bucket: B, Key: 'khong-co.jpg' })); }\n  catch (e) { console.log(`${ten} key không có ⇒ err.name = ${e.name} · HTTP ${e.$metadata?.httpStatusCode}`); }\n}\n",
 "n1-2:head": "$ node head.mjs\nHEAD to-5mb.bin: ContentLength 5242880 · byte thân đã nhận 0 · 6.8 ms\nGET  to-5mb.bin: ContentLength 5242880 · byte thân đã nhận 5242880 · 90.5 ms\nHeadObject key không có ⇒ err.name = NotFound · HTTP 404\nGetObject key không có ⇒ err.name = NoSuchKey · HTTP 404",
 "n1-2:file:xoa.mjs": "// DeleteObject key không tồn tại; DeleteObjects 3 key (2 có, 1 không) — mảng Deleted báo gì; Quiet: true; 1.001 key một lượt.\nimport { PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';\nimport { s3, B } from './s3.mjs';\nlet r = await s3.send(new DeleteObjectCommand({ Bucket: B, Key: 'chua-tung-co.jpg' }));\nconsole.log(`DeleteObject key KHÔNG tồn tại ⇒ HTTP ${r.$metadata.httpStatusCode} (không lỗi)`);\nfor (const k of ['a.jpg', 'b.jpg']) await s3.send(new PutObjectCommand({ Bucket: B, Key: k, Body: 'x' }));\nr = await s3.send(new DeleteObjectsCommand({ Bucket: B, Delete: { Objects: ['a.jpg', 'b.jpg', 'ma.jpg'].map((Key) => ({ Key })) } }));\nconsole.log(`DeleteObjects [a.jpg, b.jpg, ma.jpg] ⇒ HTTP ${r.$metadata.httpStatusCode} · Deleted: ${r.Deleted.map((d) => d.Key).join(', ')} · Errors: ${r.Errors?.length ?? 0}`);\nr = await s3.send(new DeleteObjectsCommand({ Bucket: B, Delete: { Objects: [{ Key: 'c.jpg' }], Quiet: true } }));\nconsole.log(`Quiet: true ⇒ HTTP ${r.$metadata.httpStatusCode} · Deleted: ${r.Deleted?.length ?? 0} mục · Errors: ${r.Errors?.length ?? 0}`);\ntry { await s3.send(new DeleteObjectsCommand({ Bucket: B, Delete: { Objects: Array.from({ length: 1001 }, (_, i) => ({ Key: `k${i}` })) } })); console.log('1.001 key: OK'); }\ncatch (e) { console.log(`1.001 key một lượt ⇒ ${e.name} · HTTP ${e.$metadata?.httpStatusCode}`); }\nr = await s3.send(new DeleteObjectsCommand({ Bucket: B, Delete: { Objects: Array.from({ length: 1000 }, (_, i) => ({ Key: `k${i}` })) } }));\nconsole.log(`1.000 key một lượt ⇒ HTTP ${r.$metadata.httpStatusCode} · Deleted ${r.Deleted.length}`);\n",
 "n1-2:xoa": "$ node xoa.mjs\nDeleteObject key KHÔNG tồn tại ⇒ HTTP 204 (không lỗi)\nDeleteObjects [a.jpg, b.jpg, ma.jpg] ⇒ HTTP 200 · Deleted: a.jpg, b.jpg, ma.jpg · Errors: 0\nQuiet: true ⇒ HTTP 200 · Deleted: 0 mục · Errors: 0\n1.001 key một lượt ⇒ MalformedXML · HTTP 400\n1.000 key một lượt ⇒ HTTP 200 · Deleted 1000",
 "n1-2:file:loi.mjs": "// err.name + err.$metadata.httpStatusCode của các lỗi hay gặp: bucket không có, sai secret, sai access key, máy chủ tắt (cổng không ai nghe).\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nconst thu = async (nhan, cau, Bucket = 'bon-lenh') => {\n  const s3 = new S3Client({ region: 'us-east-1', forcePathStyle: true, endpoint: process.env.OBJ_ENDPOINT, maxAttempts: 1, ...cau });\n  try { await s3.send(new PutObjectCommand({ Bucket, Key: 'x.txt', Body: 'x' })); console.log(`${nhan}: OK`); }\n  catch (e) { console.log(`${nhan}: err.name = ${e.name} · HTTP ${e.$metadata?.httpStatusCode ?? '—'}${e.code ? ' · code ' + e.code : ''}`); }\n};\nawait thu('bucket không tồn tại', {}, 'khong-co-bucket');\nawait thu('sai secret key', { credentials: { accessKeyId: process.env.OBJ_ACCESS_KEY, secretAccessKey: 'sai-' + process.env.OBJ_SECRET_KEY } });\nawait thu('sai access key', { credentials: { accessKeyId: 'KHONGCO', secretAccessKey: process.env.OBJ_SECRET_KEY } });\nawait thu('máy chủ tắt (cổng 20299)', { endpoint: 'http://localhost:20299' });\n",
 "n1-2:loi": "$ node loi.mjs\nbucket không tồn tại: err.name = NoSuchBucket · HTTP 404\nsai secret key: err.name = SignatureDoesNotMatch · HTTP 403\nsai access key: err.name = InvalidAccessKeyId · HTTP 403\nmáy chủ tắt (cổng 20299): err.name = AggregateError · HTTP — · code ECONNREFUSED",
 "n1-2:kho": "$ # Bốn lệnh trong tệp cấu hình R2 của kho (đọc mã, không chạy)\n$ cd ~/Downloads/api-backend && grep -nE \"^export async function (putObject|headObject|getObjectText|getObjectBytes|deleteObject|deleteObjects|objectExists)\\(\" src/config/r2.ts\n110:export async function putObject(\n180:export async function headObject(\n201:export async function getObjectText(key: string, maxBytes = 512 * 1024): Promise<string | null> {\n217:export async function getObjectBytes(key: string, maxBytes = 4 * 1024 * 1024): Promise<Buffer | null> {\n237:export async function deleteObject(key: string): Promise<void> {\n252:export async function deleteObjects(keys: string[]): Promise<void> {\n280:export async function objectExists(key: string): Promise<boolean> {\n$ cd ~/Downloads/api-backend && grep -nE \"Quiet: true|contentDisposition\\?: string|transformToByteArray|catch \\{\" src/config/r2.ts | head -8\n115:  contentDisposition?: string,\n192:  } catch {\n208:  } catch {\n223:    const bytes = await res.Body?.transformToByteArray();\n226:  } catch {\n268:        Quiet: true,\n291:  } catch {\n430:  } catch {\n$ cd ~/Downloads/api-backend && grep -rln \"GetObjectCommand\" src | grep -v \"\\.test\\.\" | wc -l | tr -d ' '\n11"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, tsx, icards, cmp, box, two, steps, kw, c, meter, hx, XANH } from './_obj-chung.mjs';
import { vsd } from './_ts-chung.mjs';

export const deck = { key: 'obj-01-2', code: 'OBJ 1.2', title: '1.2 — Four basic operations: Put, Get, Head, Delete', sub: 'Chapter 1 · Lesson 1.2' };
const O = (k) => { const v = DU_LIEU[`n1-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const PUT = O('put'), GET = O('get'), HEAD = O('head'), XOA = O('xoa'), LOI = O('loi');
const KHO = O('kho').split('\n').filter((l) => !/^\$ #/.test(l)).map((l) => l.replace('cd ~/Downloads/api-backend && ', '')).join('\n');

const PUTMA = `// src/config/r2.ts — putObject (today: 5 parameters)
export async function putObject(key, body, contentType,
  cacheControl = 'public, max-age=31536000, immutable',
  contentDisposition?) {
  const res = await getR2Client().send(new PutObjectCommand({
    Bucket: config.r2.bucketName, Key: key, Body: body,
    ContentType: contentType, CacheControl: cacheControl,
    ...(contentDisposition ? { ContentDisposition: contentDisposition } : {}),
  }));
  return { key, url: buildPublicUrl(key), etag: res.ETag };
}`;

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.2', t: 'Four basic operations:<br>Put, Get, Head, Delete', sub: 'Each one run on MinIO — with the status codes, error names and traps you will meet',
    en: 'Lesson one point two: the four basic operations, put, get, head and delete. Each one run on MinIO, with real status codes, error names and traps.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four operations on the wire — real requests and status codes</li>
    <li>PutObject replaces the WHOLE object, metadata included</li>
    <li>Reading a GetObject body — once, and the right way</li>
    <li>HeadObject: metadata for 0 body bytes</li>
    <li>Delete is silent — and what <code>Deleted</code> really tells you</li>
    <li>The error names you will catch</li></ul>`,
    en: 'Takeaways: the four operations on the wire; PutObject replaces the whole object; reading a GetObject body once and correctly; HeadObject for zero body bytes; silent deletes; and the error names you will catch.' },
  { t: 'Four operations, on the wire', body: icards([
      ['upload', 'PutObject', 'create OR replace the whole object'], ['download', 'GetObject', 'body as a stream + headers'],
      ['eye', 'HeadObject', 'headers only — no body'], ['trash', 'DeleteObject(s)', 'one key, or up to 1,000 per call'],
    ], 4) + hx([
      ['PUT', '/bon-lenh/co-type.svg   Content-Type: image/svg+xml', 'create / replace'], ['200', 'ETag: "b1a2b128b82fdd9dee8b3233b250721c"', 'stored'],
      ['HEAD', '/bon-lenh/to-5mb.bin', 'metadata only'], ['200', 'Content-Length: 5242880   (0 body bytes sent)', '6.8 ms'],
      ['GET', '/bon-lenh/to-5mb.bin', 'the bytes'], ['200', '5,242,880 body bytes', '90.5 ms'],
      ['HEAD', '/bon-lenh/khong-co.jpg', 'missing key'], ['404', 'err.name = NotFound', 'HEAD has no body to explain'],
      ['GET', '/bon-lenh/khong-co.jpg', 'missing key'], ['404', 'err.name = NoSuchKey', 'XML error body'],
      ['DELETE', '/bon-lenh/chua-tung-co.jpg', 'never existed'], ['204', 'no error', 'idempotent'],
    ], { fs: 16 }),
    en: 'Four operations on the wire, all measured: PUT returns two hundred and an ETag; HEAD returns the length without a body; GET returns the bytes; a missing key gives four oh four, named NotFound for HEAD and NoSuchKey for GET; and a delete of a key that never existed returns two oh four.' },
  { t: 'PutObject — the repo\'s helper, and what it stores', body: tsx(PUTMA, { sm: true, hl: [7, 8] }) + tn(PUT, { fs: 13, wrap: 120 }),
    en: 'PutObject. The repo\'s helper today takes five parameters, including an optional Content-Disposition. With a content type and cache control, HEAD shows both. Without a content type the SDK stored application octet-stream and no cache control.' },
  { t: 'PUT replaces the WHOLE object — metadata too', body: two(cmp(['', 'co-type.svg 1st PUT', 'after 2nd PUT'], [
        ['Content-Type', 'image/svg+xml', 'image/svg+xml (sent again)'], ['Cache-Control', 'public, max-age=31536000…', '<b>(gone)</b>'], ['Length', '62 B', '41 B'], ['ETag', 'b1a2b128…', '46661d6d…'],
      ], { fs: 17, hl: [1] }),
      box('No merge, no patch', 'The second PUT forgot Cache-Control, so the object lost it. S3 never merges headers or bytes: every PUT writes data and metadata from scratch. Always send every header you need.', 'do2')) +
      two(box('Missing Content-Type', `SDK v3 ⇒ <b>application/octet-stream</b>; aws-cli in 0.2 ⇒ binary/octet-stream. Either way ${c('curl -D -')} shows the browser a generic file — it downloads instead of displaying, and ${c('<audio>/<video>')} refuse it.`, ''),
        box('The repo\'s defence', `${c('putObject(key, body, contentType, …)')} makes the type a REQUIRED parameter and defaults Cache-Control to one year, immutable.`, 'xanh')),
    en: 'PUT replaces the whole object, metadata included. The second PUT forgot cache control and the object lost it. Nothing is merged. And a missing content type means a generic binary file that the browser downloads instead of showing; the repo makes the type a required parameter.' },
  { t: 'GetObject — the body is a stream you read ONCE', giua: true, body: tn(GET, { fs: 15, wrap: 104 }) + vsd(
      tsx(`// old lesson text ⇒ TypeError
const buf = Buffer.concat(await res.Body
  .transformToWebStream().getReader().read());
// read() gives { value, done }, not an array`, { sm: true }),
      tsx(`// the repo (getObjectBytes)
const bytes = await res.Body
  .transformToByteArray();
const buf = Buffer.from(bytes);`, { sm: true })),
    en: 'GetObject. The body is a stream that can be read once: a second transformToString threw "the stream has already been transformed". The old lesson code threw a TypeError, because read returns an object, not an array. The repo uses transformToByteArray, then Buffer.from.' },
  { t: 'Does the repo use GetObject? Yes — 11 files', body: tn(KHO.split('\n').filter((l) => !/^(110|180|237|252|280|115|192|208|226|268|291|430):/.test(l)).join('\n'), { fs: 15, wrap: 104 }) +
      two(box('Correction', 'The old lesson text said the repo never calls GetObject server-side. grep finds GetObjectCommand in 11 non-test files: music, exports, AI reading uploaded files, previews.', 'do2'),
        box('How it reads safely', `${c('getObjectText(key, 512 KB)')} and ${c('getObjectBytes(key, 4 MB)')} check ContentLength against a cap BEFORE reading, and return null on any error. Public images still go through the CDN.`, 'lam')),
    en: 'Does the repo use GetObject? Yes: eleven non-test files. The old lesson text said it never did. Its two readers check the content length against a cap before reading, and return null on any error.' },
  { t: 'HeadObject — metadata for zero body bytes', giua: true, body: tn(HEAD, { fs: 17, wrap: 104 }) + meter([
      ['HEAD 5 MB object', 6.8, '#1f8a3b', '0 body bytes'], ['GET 5 MB object', 90.5, '#c0392b', '5 MB body'],
    ], { don: 'ms', nhan: 260, rh: 56, fs: 21 }) + box('Use it to', `check existence and size before a download or a confirm step — the repo's ${c('headObject')} verifies a presigned upload really landed (Chapter 4). Catch ${c("err.name === 'NotFound'")} for HEAD, ${c("'NoSuchKey'")} for GET.`, 'lam'),
    en: 'HeadObject on a five megabyte object sent zero body bytes and took under seven milliseconds; GET moved all five megabytes in ninety milliseconds. Remember the two names for a missing key: NotFound for HEAD, NoSuchKey for GET.' },
  { t: 'Delete is silent — and Deleted lies a little', body: tn(XOA, { fs: 15, wrap: 104 }) +
      two(box('Measured', `${c('ma.jpg')} never existed, yet it is listed in <b>Deleted</b> with 0 Errors. So "Deleted.length" does NOT tell you how many objects really existed (the old lesson text said it did). With ${c('Quiet: true')} even that list is empty.`, 'do2'),
        box('Limits', `1,000 keys per DeleteObjects: 1,001 ⇒ <b>MalformedXML 400</b>, 1,000 ⇒ 200. Need the real count? HEAD or LIST before deleting — or trust your database, which knows the keys (0.2).`, 'lam')),
    en: 'Delete is silent. Deleting a key that never existed returned two oh four. In a batch, the missing key was still listed as deleted, so the Deleted array does not count real objects. Quiet mode empties it. One thousand keys per call; one thousand and one is MalformedXML.' },
  { t: 'Errors you will catch — real names', body: tn(LOI, { fs: 15, wrap: 104 }) + cmp(['err.name', 'HTTP', 'Usually means', 'Do'], [
      ['NoSuchBucket', '404', 'wrong R2_BUCKET_NAME / environment', 'fix config, do not retry'],
      ['SignatureDoesNotMatch', '403', 'wrong secret (or clock skew)', 'fix credentials'],
      ['InvalidAccessKeyId', '403', 'wrong or deleted access key', 'rotate / fix (Chapter 2.3)'],
      ['AggregateError · ECONNREFUSED', '—', 'endpoint unreachable', 'retry with backoff, alert'],
      ['NotFound / NoSuchKey', '404', 'key missing', 'often fine: treat as absent'],
    ], { fs: 16 }) + box('Log both', `${c('err.name')} and ${c('err.$metadata.httpStatusCode')} — the name tells you what, the status tells you whether a retry can help. (The old lesson\'s ${c('RequestTimeoutException')} is not what a dead endpoint gives.)`, ''),
    en: 'Errors with real names: NoSuchBucket, SignatureDoesNotMatch for a wrong secret, InvalidAccessKeyId for a wrong key, and a connection refused when the server is down. Log the name and the status code together.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('PutObject', 'create or REPLACE the whole object'), kw('GetObject', 'body stream + headers; read once'), kw('HeadObject', 'headers only, 0 body bytes'),
      kw('DeleteObject', '204 even if the key never existed'), kw('DeleteObjects', '≤ 1,000 keys; Deleted lists missing keys too'), kw('Quiet', 'batch delete returns only errors'),
      kw('transformToByteArray', 'read the body into bytes, once'), kw('NotFound / NoSuchKey', 'missing key for HEAD / GET'), kw('ContentType', 'MIME type stored with the object'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: PutObject, GetObject, HeadObject, DeleteObject and DeleteObjects, Quiet, transformToByteArray, NotFound versus NoSuchKey, and ContentType.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'PUT a file with ContentType + CacheControl, PUT it again without CacheControl: HEAD both times',
      'GET it and read the body twice — catch the error; then use transformToByteArray',
      'HEAD vs GET on a 5 MB object: count body bytes and time',
      'DeleteObjects 3 keys, one missing: read Deleted and Errors; try 1,001 keys',
    ]), box('Keep these', '<ul><li>PUT replaces data AND metadata</li><li>No ContentType ⇒ octet-stream</li><li>Body: read once, transformToByteArray</li><li>HEAD: 0 body bytes · NotFound vs NoSuchKey</li><li>Delete is silent; Deleted ≠ existed</li></ul>', 'lam'), ''),
    en: 'Your turn: PUT twice and watch metadata vanish; read a body twice; compare HEAD and GET; and batch delete with one missing key and with one thousand and one keys.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The S3 API', bai: '1.2 Four basic operations' }, S);
