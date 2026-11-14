/**
 * obj-02-2 — Object Storage · Chapter 2 · 2.2 "R2 quirks: region auto, path style, headers" (deck video + web, 14/11/2026).
 * Bài web: os-2-2-quirks. Output THẬT (scratchpad/obj/demo/n2-2.txt · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0 · Node 22.23.3, Mac) + trang tương thích S3 của R2
 * (developers.cloudflare.com/r2/api/s3/api, đọc 14/11/2026) — KHÔNG gửi request nào tới R2: ký URL offline cho endpoint DẠNG R2 (tài khoản giả 0123…): pathStyle false ⇒
 * bucket.<acct>.r2.cloudflarestorage.com/key, true ⇒ <acct>.r2…/bucket/key, chữ ký mang vùng auto/us-east-1; R2 docs: '' và us-east-1 là bí danh của auto (bài cũ "us-east-1 SAI" ⇒ sai);
 * header trên dây + MinIO: STANDARD_IA/GLACIER ⇒ InvalidStorageClass, RequestPayer OK, Tagging OK, SSE aws:kms ⇒ NotImplemented 501, SSE-C ⇒ InvalidRequest 400 (MinIO cần TLS);
 * R2 docs PutObject: ✅ Storage Class STANDARD + STANDARD_IA · ❌ SSE(-KMS) · ✅ SSE-C · ❌ Request Payer · ❌ Tagging · ❌ Object Locking (bài cũ "R2 chỉ STANDARD", "không SSE-C" ⇒ sai);
 * kho: 0 chỗ dùng các header đó trong src/config, src/storage, upload.service.ts; URL công khai = `${base}/${key}` (r2.ts:399) — không bucket, không endpoint.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-2:file:url.mjs": "// Ký URL (KHÔNG gọi mạng) cho một endpoint DẠNG R2 với forcePathStyle true/false và region auto/us-east-1 — xem hình dạng URL và vùng trong chữ ký.\n// Endpoint là chuỗi ví dụ (tài khoản 0123…), không có thật — không request nào được gửi.\nimport { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst endpoint = 'https://0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com';\nfor (const [forcePathStyle, region] of [[false, 'auto'], [true, 'auto'], [false, 'us-east-1']]) {\n  const s3 = new S3Client({ endpoint, region, forcePathStyle, credentials: { accessKeyId: 'VIDU', secretAccessKey: 'vidu' } });\n  const u = new URL(await getSignedUrl(s3, new GetObjectCommand({ Bucket: 'cuongthai-media-storage', Key: 'images/avatar/u42/a.jpg' }), { expiresIn: 60 }));\n  console.log(`pathStyle ${String(forcePathStyle).padEnd(5)} region ${region.padEnd(9)} ⇒ ${u.host}${u.pathname}`);\n  console.log(`   chữ ký cho vùng: ${u.searchParams.get('X-Amz-Credential').split('/')[2]}`);\n}\n",
 "n2-2:url": "$ node url.mjs\npathStyle false region auto      ⇒ cuongthai-media-storage.0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/images/avatar/u42/a.jpg\n   chữ ký cho vùng: auto\npathStyle true  region auto      ⇒ 0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/cuongthai-media-storage/images/avatar/u42/a.jpg\n   chữ ký cho vùng: auto\npathStyle false region us-east-1 ⇒ cuongthai-media-storage.0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com/images/avatar/u42/a.jpg\n   chữ ký cho vùng: us-east-1\n$ # URL công khai của kho: KHÔNG có tên bucket, cũng không có endpoint — đó là tên miền riêng trỏ vào bucket\n$ cd ~/Downloads/api-backend && grep -n \"return \\`\\${base}/\" src/config/r2.ts\n399:  return `${base}/${key.replace(/^\\/+/, '')}`;",
 "n2-2:file:header.mjs": "// Header \"lạ\" của S3 trên dây: StorageClass, RequestPayer, Tagging, SSE-KMS, SSE-C. Middleware chép header SDK thật sự gửi; rồi xem MinIO (KHÔNG phải R2) trả gì.\nimport { S3Client, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';\nimport { createHash } from 'node:crypto';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true, maxAttempts: 1 });\nlet gui = [];\ns3.middlewareStack.add((next) => async (args) => { gui = Object.keys(args.request.headers).filter((h) => /^x-amz-(storage|request-payer|tagging|server-side)/.test(h)); return next(args); }, { step: 'finalizeRequest' });\ntry { await s3.send(new CreateBucketCommand({ Bucket: 'la-header' })); } catch {}\nconst khoa = Buffer.alloc(32, 7);\nconst thu = async (nhan, them) => {\n  try { await s3.send(new PutObjectCommand({ Bucket: 'la-header', Key: 'a.txt', Body: 'x', ...them })); console.log(`${nhan.padEnd(26)} gửi [${gui.join(', ')}] ⇒ MinIO: OK`); }\n  catch (e) { console.log(`${nhan.padEnd(26)} gửi [${gui.join(', ')}] ⇒ MinIO: ${e.name} ${e.$metadata?.httpStatusCode ?? ''}`); }\n};\nawait thu(\"StorageClass 'STANDARD_IA'\", { StorageClass: 'STANDARD_IA' });\nawait thu(\"StorageClass 'GLACIER'\", { StorageClass: 'GLACIER' });\nawait thu(\"RequestPayer 'requester'\", { RequestPayer: 'requester' });\nawait thu(\"Tagging 'nguon=app'\", { Tagging: 'nguon=app' });\nawait thu(\"SSE 'aws:kms'\", { ServerSideEncryption: 'aws:kms' });\nawait thu('SSE-C (khoá của bạn)', { SSECustomerAlgorithm: 'AES256', SSECustomerKey: khoa, SSECustomerKeyMD5: createHash('md5').update(khoa).digest('base64') });\n",
 "n2-2:header": "$ node header.mjs\nStorageClass 'STANDARD_IA' gửi [x-amz-storage-class] ⇒ MinIO: InvalidStorageClass 400\nStorageClass 'GLACIER'     gửi [x-amz-storage-class] ⇒ MinIO: InvalidStorageClass 400\nRequestPayer 'requester'   gửi [x-amz-request-payer] ⇒ MinIO: OK\nTagging 'nguon=app'        gửi [x-amz-tagging] ⇒ MinIO: OK\nSSE 'aws:kms'              gửi [x-amz-server-side-encryption] ⇒ MinIO: NotImplemented 501\nSSE-C (khoá của bạn)       gửi [x-amz-server-side-encryption-customer-algorithm, x-amz-server-side-encryption-customer-key, x-amz-server-side-encryption-customer-key-md5] ⇒ MinIO: InvalidRequest 400",
 "n2-2:doc": "$ # Trang tương thích S3 của R2 (developers.cloudflare.com/r2/api/s3/api, đọc 14/11/2026) — trích đúng dòng:\n$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -E \"^When using the S3 API, the region\" | cut -c1-200\nWhen using the S3 API, the region for an R2 bucket is `auto`. For compatibility with tools that do not allow you to specify a region, an empty value and `us-east-1` will alias to the `auto` region.\n$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -E \"^\\| ✅ \\[PutObject \" | grep -oE \"(✅|❌) (Storage Class|SSE-C|SSE|Request Payer|Tagging|Object Locking|STANDARD\\\\\\\\_IA|STANDARD)\" | tr '\\n' ' '; echo\n✅ Storage Class ✅ STANDARD ✅ STANDARD\\_IA ❌ SSE ✅ SSE-C ❌ Request Payer ❌ Tagging ❌ Object Locking \n$ cd ~/Downloads/api-backend && grep -rnE \"(StorageClass|RequestPayer|Tagging|ServerSideEncryption|SSECustomer[A-Za-z]*)\\s*:\" src/config src/storage src/services/upload.service.ts | grep -vc \"\\.test\\.\"\n0"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, flow, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-02-2', code: 'OBJ 2.2', title: '2.2 — R2 quirks: region auto, path style, headers', sub: 'Chapter 2 · Lesson 2.2' };
const O = (k) => { const v = DU_LIEU[`n2-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const URL_ = O('url'), HEAD = O('header'), DOC = O('doc');
const [URL1, URL2] = URL_.split('$ # URL công khai');
const DOCL = DOC.split('\n');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.2', t: 'R2 quirks:<br>region auto, path style, headers', sub: 'Compatible is not identical — checked against Cloudflare\'s own compatibility table, signed offline, run on MinIO',
    en: 'Lesson two point two: R2 quirks — region auto, path style and headers. Checked against Cloudflare\'s compatibility table, signed offline, and run on MinIO.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Region on R2: what <code>'auto'</code> really means — and why <code>us-east-1</code> works too</li>
    <li>Two URL shapes for the same R2 object, signed without a network call</li>
    <li>Why the custom domain has nothing to do with <code>forcePathStyle</code></li>
    <li>Which S3 headers R2 supports today — from its own table</li>
    <li>Why a passing test on MinIO proves nothing about R2 headers</li></ul>`,
    en: 'Takeaways: what region auto really means; two URL shapes for one R2 object; why the custom domain is unrelated to forcePathStyle; which S3 headers R2 supports today; and why MinIO cannot vouch for R2.' },
  { t: 'Quirk 1 — region: \'auto\' (and its aliases)', body: tn(DOCL.slice(0, 3).join('\n'), { fs: 16, wrap: 104 }) + two(
      box('What the docs say', `R2 buckets live in region ${c("'auto'")}. For tools that cannot set a region, an empty value and ${c("'us-east-1'")} are <b>aliases of auto</b>. The old lesson text marked us-east-1 as WRONG — it works, it is just less explicit.`, 'lam'),
      box('What we measured (1.1)', `No region at all ⇒ the SDK refuses before sending: ${c('Region is missing')}. The repo reads ${c('R2_REGION')} with default ${c("'auto'")} — say what you mean.`, 'xanh')),
    en: 'Quirk one, region. Cloudflare\'s docs: R2 buckets are in region auto, and an empty value or us-east-1 are aliases of auto. So us-east-1 is not wrong, just less explicit. What fails is no region at all.' },
  { t: 'Quirk 2 — two shapes of the same R2 URL', body: tn(URL1.trim(), { fs: 15, wrap: 108 }) + flow([
      { t: 'virtual-hosted', s: 'bucket.&lt;account&gt;.r2.cloudflarestorage.com/key', mau: '#2563eb' }, { t: 'path-style', s: '&lt;account&gt;.r2.cloudflarestorage.com/bucket/key', mau: '#1f8a3b' },
    ], { h: 96, fs: 19 }) + box('Signed offline', 'No request sent: getSignedUrl only builds and signs. The region is written INTO the signature. R2 documents both styles; the repo uses virtual-hosted for R2, path-style for MinIO (1.1).', 'lam'),
    en: 'Quirk two: the same R2 object has two URL shapes. Signed offline, without a request: virtual-hosted puts the bucket in the host name, path style puts it in the path. The region you pick is written into the signature.' },
  { t: 'The custom domain is a different road', body: tn(URL2 ? ('$ # URL công khai' + URL2).trim() : '', { fs: 16, wrap: 108 }) + flow([
      { t: 'browser', s: 'GET media.cuongthai.com/&lt;key&gt;' }, { t: 'Cloudflare CDN', s: 'custom domain → bucket', mau: XANH }, { t: 'R2 bucket', s: 'no signature, public' },
    ], { h: 120, fs: 20 }) + two(box('Correction', 'The old lesson text said a custom domain "requires" virtual-hosted style and path-style "cannot map" one. The SDK setting only shapes SIGNED API URLs; the public URL has neither bucket nor endpoint — the domain itself points at the bucket.', 'do2'),
      box('In the repo', `${c('buildPublicUrl(key)')} = ${c('${R2_PUBLIC_URL}/${key}')} (r2.ts:399). Uploads go to the endpoint with a signature; reads go to the custom domain through the CDN.`, 'xanh')),
    en: 'The custom domain is a different road. The public URL is the custom domain plus the key, with no bucket and no endpoint; the domain itself points at the bucket through the CDN. The SDK\'s path style setting only shapes signed API URLs, so it has nothing to do with the custom domain.' },
  { t: 'Quirk 3 — headers: what R2 supports today', body: tn('$ curl -s …/r2/api/s3/api/index.md | grep "| ✅ [PutObject " | grep -oE "(✅|❌) …"\n' + DOCL[4], { fs: 15, wrap: 108 }) + cmp(['S3 feature (header)', 'R2 PutObject (docs, 14/11/2026)', 'old lesson text'], [
      ['storage class (x-amz-storage-class)', '✅ STANDARD, ✅ STANDARD_IA (Infrequent Access)', '"only STANDARD" ✗'],
      ['SSE-KMS (x-amz-server-side-encryption)', '❌ not supported — data is always encrypted at rest', '✓'],
      ['SSE-C (your own key)', '✅ supported', '"no SSE-C" ✗'],
      ['requester pays (x-amz-request-payer)', '❌', '✓'], ['tagging (x-amz-tagging)', '❌', 'not mentioned'], ['object lock headers', '❌', '✓'],
    ], { fs: 15 }) + box('Read carefully', 'The table says unsupported — not "accepted and silently ignored" as the old text claimed. Only a test on R2 itself (a staging bucket) tells you: error or no-op.', ''),
    en: 'Quirk three, headers, from Cloudflare\'s own table today: R2 supports storage classes STANDARD and STANDARD_IA, and customer-provided keys, SSE-C. It does not support SSE-KMS, requester pays, tagging or object lock headers. The old text was wrong on two lines, and "silently ignored" is not what the table says.' },
  { t: 'Same SDK, different server, different answers', body: tn(HEAD.replace(/x-amz-server-side-encryption-customer-[a-z0-9-]+(, )?/g, (m, p) => (p ? '' : 'x-amz-sse-c-…')), { fs: 14, wrap: 116 }) + cmp(['header', 'MinIO (measured)', 'R2 (docs)'], [
      ['StorageClass STANDARD_IA', '❌ InvalidStorageClass', '✅'], ['RequestPayer', '✅ accepted', '❌'], ['Tagging', '✅ accepted', '❌'],
      ['SSE aws:kms', '❌ 501 NotImplemented', '❌'], ['SSE-C', '❌ 400 (MinIO wants TLS)', '✅'],
    ], { fs: 15 }) + box('Lesson', 'MinIO and R2 disagree on 4 of 5 lines. MinIO is perfect for S3 basics — a feature that depends on a quirky header must be tested on the real provider.', 'do2'),
    en: 'Same SDK, different server, different answers. The middleware shows the header really sent. MinIO rejected STANDARD_IA but accepted tagging and requester pays; R2\'s table says the opposite on four of five lines. Test quirky headers on the real provider.' },
  { t: 'Audit: does this repo use any of them?', body: tn(DOCL.slice(5).join('\n'), { fs: 16, wrap: 96 }) + icards([
      ['key', '0 quirky headers', 'No StorageClass, RequestPayer, Tagging, SSE or SSE-C in src/config, src/storage or upload.service.ts — nothing can silently change meaning after a move.'],
      ['box', 'What it does send', 'Content-Type, Cache-Control, Content-Disposition (1.2) — all ✅ on R2 per the table.'],
      ['page', 'ETag', 'Same format on R2 and S3: MD5 for one PUT, "…-N" for multipart (measured on MinIO in 0.2 and 1.3).'],
    ], 3) + box('Do the same before you migrate', 'grep your storage code for StorageClass, RequestPayer, Tagging, ServerSideEncryption, SSECustomer…; check every hit against the table.', 'lam'),
    en: 'Audit. The repo\'s storage code uses none of these headers, only Content-Type, Cache-Control and Content-Disposition, which R2 supports. Run the same grep over your code before a migration, and check every hit against the table.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw("region 'auto'", 'R2\'s region; "" and us-east-1 are aliases'), kw('Virtual-hosted', 'bucket.&lt;account&gt;.r2.cloudflarestorage.com/key'),
      kw('Path-style', '&lt;account&gt;.r2.cloudflarestorage.com/bucket/key'), kw('Custom domain', 'public URL → bucket via the CDN; no bucket in the URL'), kw('STANDARD_IA', 'R2 Infrequent Access storage class'),
      kw('SSE-C', 'encryption with your own key — supported on R2'), kw('SSE-KMS', 'AWS key management — not on R2'), kw('Compatibility table', 'developers.cloudflare.com/r2/api/s3/api'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: region auto, credential scope, virtual-hosted and path style, custom domain, STANDARD_IA, SSE-C, SSE-KMS, and the compatibility table.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Sign a GET URL for an R2-shaped endpoint with both URL styles and both regions — no network needed',
      'Read the region line and the PutObject row of the R2 compatibility table yourself',
      'Send StorageClass, RequestPayer, Tagging, SSE and SSE-C to MinIO with a header-logging middleware',
      'grep your own storage code for quirky headers',
    ]), box('Keep these', '<ul><li>R2 region = auto ("" / us-east-1 alias)</li><li>Path vs virtual-hosted: API URLs only</li><li>Custom domain: no bucket, no signature</li><li>R2: ✅ STANDARD_IA, ✅ SSE-C, ❌ SSE-KMS, ❌ tagging</li><li>MinIO ≠ R2 for quirky headers</li></ul>', 'lam'), ''),
    en: 'Your turn: sign URLs for an R2-shaped endpoint, read the compatibility table yourself, send the quirky headers to MinIO, and grep your own code.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — R2 specifics', bai: '2.2 R2 quirks' }, S);
