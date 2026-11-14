/**
 * obj-01-1 — Object Storage · Chapter 1 · 1.1 "Creating the client: SDK v3" (deck video + web, 14/11/2026).
 * Bài web: os-1-1-client. Output THẬT (scratchpad/obj/demo/n1-1.txt · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0 · Node 22.23.3 · esbuild 0.25.10, Mac):
 * cài client-s3 + s3-request-presigner = 37 gói, node_modules 20 MB (bài web cũ "~450 KB" SAI); client-s3 unpacked 3.427.047 B; aws-sdk v2 unpacked 98.180.517 B + end-of-support;
 * gói chỉ S3Client + PutObjectCommand (esbuild minify) = 609.581 B, gzip 169.996 B; lazy init: import 70–79 ms, 0 lần dựng, thiếu cấu hình ⇒ lỗi, gọi 3 lần ⇒ dựng 1 lần;
 * region thiếu ⇒ "Region is missing", 'auto' và 'us-east-1' đều OK trên MinIO; forcePathStyle true ⇒ /bucket/key OK, false ⇒ bucket.localhost ⇒ MalformedXML;
 * checksum mặc định ⇒ URL PUT mang x-amz-checksum-crc32=AAAAAA==, WHEN_REQUIRED ⇒ không; GET không ký vào API endpoint ⇒ 403 AccessDenied, presign ⇒ 200;
 * r2.ts của kho nay 433 dòng (region: config.r2.region ← R2_REGION mặc định 'auto'; forcePathStyle false cho R2 thật, true cho sandbox/MinIO; checksum WHEN_REQUIRED);
 * env thật R2_PUBLIC_URL (bài web cũ ghi R2_PUBLIC_URL_BASE — grep 0).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-1:file:goi.mjs": "// Kích thước THẬT khi gói cho trình duyệt/serverless: chỉ import S3Client + PutObjectCommand (esbuild, minify, tree-shaking).\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nconsole.log(typeof S3Client, typeof PutObjectCommand);\n",
 "n1-1:cai": "$ npm i @aws-sdk/client-s3@3.1071.0 @aws-sdk/s3-request-presigner@3.1071.0 2>&1 | grep -E \"added|packages\"\nadded 37 packages, and audited 38 packages in 5s\n$ du -sh node_modules | cut -f1; ls node_modules/@aws-sdk | wc -l | tr -d ' '; ls node_modules/@smithy | wc -l | tr -d ' '\n 20M\n20\n9\n$ npm view @aws-sdk/client-s3@3.1071.0 dist.unpackedSize; npm view aws-sdk dist.unpackedSize; npm view aws-sdk deprecated 2>/dev/null | head -1\n3427047\n98180517\nThe AWS SDK for JavaScript (v2) has reached end-of-support, and no longer receives updates. Please migrate your code to use AWS SDK for JavaScript (v3). More info https://a.co/cUPnyil\n$ npx -y esbuild@0.25.10 goi.mjs --bundle --minify --platform=node --format=esm --outfile=goi.min.mjs --log-level=warning && wc -c < goi.min.mjs | tr -d ' ' && gzip -c goi.min.mjs | wc -c | tr -d ' '\n609581\n169996",
 "n1-1:file:r2-luoi.mjs": "// Lazy init kiểu kho (src/config/r2.ts): import module KHÔNG dựng client; chỉ lần gọi đầu mới kiểm cấu hình và dựng.\nimport { S3Client } from '@aws-sdk/client-s3';\nlet cached = null, soLanDung = 0;\nexport function getClient() {\n  if (!process.env.OBJ_ENDPOINT) throw new Error('Object storage is not configured. Set OBJ_ENDPOINT …');\n  if (cached) return cached;\n  soLanDung++;\n  cached = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\n  return cached;\n}\nexport const dem = () => soLanDung;\n",
 "n1-1:file:thu-luoi.mjs": "const t = performance.now();\nconst m = await import('./r2-luoi.mjs');\nconsole.log(`import xong sau ${(performance.now() - t).toFixed(0)} ms · đã dựng client: ${m.dem()} lần`);\ntry { m.getClient(); console.log(`gọi getClient(): OK · đã dựng ${m.dem()} lần`); } catch (e) { console.log(`gọi getClient(): ${e.message}`); }\nm.getClient?.length; try { m.getClient(); m.getClient(); console.log(`gọi thêm 2 lần: vẫn ${m.dem()} lần dựng`); } catch {}\n",
 "n1-1:luoi": "$ env -u OBJ_ENDPOINT node thu-luoi.mjs\nimport xong sau 79 ms · đã dựng client: 0 lần\ngọi getClient(): Object storage is not configured. Set OBJ_ENDPOINT …\n$ node thu-luoi.mjs\nimport xong sau 70 ms · đã dựng client: 0 lần\ngọi getClient(): OK · đã dựng 1 lần\ngọi thêm 2 lần: vẫn 1 lần dựng",
 "n1-1:file:kieu-url.mjs": "// forcePathStyle: true ⇒ http://host/bucket/key · false ⇒ http://bucket.host/key (virtual-hosted). Ký URL KHÔNG gọi mạng; rồi gọi thật.\nimport { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nfor (const forcePathStyle of [true, false]) {\n  const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle });\n  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: 'kieu-url', Key: 'a.txt' }), { expiresIn: 60 });\n  console.log(`forcePathStyle ${forcePathStyle}:  ${url.split('?')[0]}`);\n  try { await s3.send(new PutObjectCommand({ Bucket: 'kieu-url', Key: 'a.txt', Body: 'x' })); console.log('  PUT thật: OK'); }\n  catch (e) { console.log(`  PUT thật: ${e.name} ${e.code ?? e.cause?.code ?? ''}`.trimEnd()); }\n}\nprocess.exit(0);\n",
 "n1-1:kieu": "$ node kieu-url.mjs\nforcePathStyle true:  http://localhost:20200/kieu-url/a.txt\n  PUT thật: OK\nforcePathStyle false:  http://kieu-url.localhost:20200/a.txt\n  PUT thật: MalformedXML",
 "n1-1:kho": "$ # Cấu hình client THẬT của kho hôm nay (không đọc .env — chỉ đọc mã)\n$ cd ~/Downloads/api-backend && wc -l src/config/r2.ts && grep -nE \"^\\s+(region|forcePathStyle|requestChecksumCalculation|responseChecksumValidation|requestHandler):\" src/config/r2.ts\n     433 src/config/r2.ts\n50:      region: 'auto',\n53:      forcePathStyle: true,\n54:      requestChecksumCalculation: 'WHEN_REQUIRED',\n55:      responseChecksumValidation: 'WHEN_REQUIRED',\n56:      requestHandler: sandboxRequestHandler() as never,\n62:      region: config.r2.region, endpoint: config.r2.endpoint, forcePathStyle: true,\n71:    region: config.r2.region,\n82:    forcePathStyle: false,\n87:    requestChecksumCalculation: 'WHEN_REQUIRED',\n88:    responseChecksumValidation: 'WHEN_REQUIRED',\n$ cd ~/Downloads/api-backend && grep -nE \"^  R2_[A-Z_]+:\" src/config/env.ts | sed -E 's/: z\\..*//' && grep -c \"R2_PUBLIC_URL_BASE\" src/config/env.ts\n148:  R2_BUCKET_NAME\n149:  R2_PUBLIC_URL\n150:  R2_ENDPOINT_URL\n151:  R2_ACCESS_KEY_ID\n152:  R2_SECRET_ACCESS_KEY\n153:  R2_REGION\n0",
 "n1-1:file:vung.mjs": "// region là BẮT BUỘC với SDK v3: thiếu ⇒ lỗi ngay khi send. Rồi thử 'auto' (quy ước R2) và 'us-east-1' (mặc định MinIO/AWS) trên MinIO.\nimport { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';\nfor (const region of [undefined, 'auto', 'us-east-1']) {\n  const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, forcePathStyle: true, ...(region ? { region } : {}) });\n  try { const r = await s3.send(new ListBucketsCommand({})); console.log(`region ${region ?? '(không đặt)'}: OK · ${r.Buckets.length} bucket`); }\n  catch (e) { console.log(`region ${region ?? '(không đặt)'}: ${e.name} · ${e.message.split('\\n')[0].slice(0, 90)}`); }\n}\nprocess.exit(0);\n",
 "n1-1:vung": "$ env -u AWS_DEFAULT_REGION -u AWS_REGION node vung.mjs\nregion (không đặt): Error · Region is missing\nregion auto: OK · 2 bucket\nregion us-east-1: OK · 2 bucket",
 "n1-1:file:tong.mjs": "// requestChecksumCalculation: ký URL PUT (KHÔNG gọi mạng) với mặc định của SDK 3.1071 và với 'WHEN_REQUIRED' như kho — so tham số trong URL.\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nfor (const requestChecksumCalculation of [undefined, 'WHEN_REQUIRED']) {\n  const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true, ...(requestChecksumCalculation ? { requestChecksumCalculation } : {}) });\n  const url = new URL(await getSignedUrl(s3, new PutObjectCommand({ Bucket: 'anh-dai-dien', Key: 'thu.jpg', ContentType: 'image/jpeg' }), { expiresIn: 300 }));\n  const ck = [...url.searchParams].filter(([k]) => /checksum|sdk/i.test(k)).map(([k, v]) => `${k}=${v}`);\n  console.log(`${requestChecksumCalculation ?? 'mặc định (WHEN_SUPPORTED)'}: ${ck.length ? ck.join(' ') : '(không có tham số checksum)'}`);\n}\n",
 "n1-1:tong": "$ node tong.mjs\nmặc định (WHEN_SUPPORTED): x-amz-checksum-crc32=AAAAAA== x-amz-sdk-checksum-algorithm=CRC32\nWHEN_REQUIRED: (không có tham số checksum)",
 "n1-1:cong": "$ # API endpoint (có chữ ký) ≠ URL công khai (CDN). Gọi thẳng API endpoint KHÔNG ký thì sao?\n$ curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost:20200/cong-thu/a.txt\n403\n$ curl -s http://localhost:20200/cong-thu/a.txt | grep -oE \"<Code>[^<]+</Code>\"\n<Code>AccessDenied</Code>\n$ curl -s \"$(aws s3 presign s3://cong-thu/a.txt --expires-in 60)\"; echo\nxin chao\n$ cd ~/Downloads/api-backend && grep -nE \"^export function buildPublicUrl\" -A5 src/config/r2.ts | grep -E \"base|return\"\n396-  const base = config.r2.publicUrl || '';\n399-  return `${base}/${key.replace(/^\\/+/, '')}`;",
 "n1-1:dia": "$ du -sk node_modules | cut -f1\n20392"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, tsx, icards, cmp, box, two, steps, kw, c, flow, meter, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-01-1', code: 'OBJ 1.1', title: '1.1 — Creating the client: SDK v3', sub: 'Chapter 1 · Lesson 1.1' };
const O = (k) => { const v = DU_LIEU[`n1-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const CAI = O('cai'), LUOI = O('luoi'), KIEU = O('kieu'), VUNG = O('vung'), TONG = O('tong');
const KHO = O('kho').split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const CONG = O('cong').split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');

const LAZY = `// r2-luoi.mjs — the repo's pattern, cut down (src/config/r2.ts)
import { S3Client } from '@aws-sdk/client-s3';
let cached = null;
export function getClient() {
  if (!process.env.OBJ_ENDPOINT) throw new Error('Object storage is not configured…');
  if (cached) return cached;           // 2nd, 3rd… call: reuse
  cached = new S3Client({ endpoint: process.env.OBJ_ENDPOINT,
    region: 'us-east-1', forcePathStyle: true });
  return cached;                       // built on the FIRST call only
}`;

const REPO = `// src/config/r2.ts (433 lines today) — the real-R2 branch
cachedClient = new S3Client({
  region: config.r2.region,            // R2_REGION, default 'auto'
  endpoint: config.r2.endpoint,        // R2_ENDPOINT_URL (the API host)
  credentials: { accessKeyId: …, secretAccessKey: … },
  forcePathStyle: false,               // virtual-hosted on real R2
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});`;

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.1', t: 'Creating the client:<br>AWS SDK v3', sub: 'Install size, lazy init, and every option of the repo\'s real client — measured on MinIO',
    en: 'Lesson one point one: creating the client with AWS SDK version three. Install size, lazy initialisation, and each option of the repo\'s real client, measured on MinIO.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What SDK v3 "modular" really costs — measured, not guessed</li>
    <li>Lazy init: why the app boots with no storage credentials</li>
    <li>The four options of the repo's real <code>S3Client</code></li>
    <li><code>region</code>, <code>forcePathStyle</code>, checksum — each one run for real</li>
    <li>The six env variables, with their real names</li>
    <li>Why the API endpoint is never the public URL</li></ul>`,
    en: 'Takeaways: the real cost of SDK v3; lazy initialisation; the options of the repo\'s real client, each one run; the six environment variables with their real names; and why the API endpoint is never the public URL.' },
  { t: 'One package per service — measured install', body: tn(CAI.split('$ npx -y esbuild')[0].trim(), { fs: 15, wrap: 104 }) +
      two(box('v3: modular', `${c('@aws-sdk/client-s3')} for operations, ${c('@aws-sdk/s3-request-presigner')} for signed URLs. 37 packages land in node_modules (20 @aws-sdk/*, 9 @smithy/*): <b>20 MB</b> on disk.`, 'lam'),
        box('v2: one monolith, and dead', `${c('aws-sdk')} unpacked is <b>98 MB</b> and npm marks it <b>end-of-support</b> — no more updates. New code uses v3.`, 'do2')),
    en: 'Installing the two version three packages added thirty-seven packages, twenty megabytes on disk. The old version two package is ninety-eight megabytes unpacked and has reached end of support.' },
  { t: 'What actually ships — the "~450 KB" was wrong', body: meter([
      ['aws-sdk v2 (unpacked)', 98180517, '#c0392b'], ['node_modules (du -sk: 20,392 KB)', 20392*1024, '#94a3b8'],
      ['@aws-sdk/client-s3 (unpacked)', 3427047, '#94a3b8'], ['bundle: S3Client + PutObject', 609581, XANH, 'esbuild --minify'], ['same bundle, gzip', 169996, '#1f8a3b'],
    ], { don: 'B', log: true, nhan: 360, fs: 17 }) + tn('$ npx -y esbuild@0.25.10 goi.mjs --bundle --minify --platform=node … && wc -c < goi.min.mjs && gzip -c goi.min.mjs | wc -c\n' + CAI.split('\n').slice(-2).join('\n'), { fs: 15, wrap: 104 }) +
      box('Read it right', 'On a server, install size hardly matters. It matters when you bundle (serverless, edge, browser): import only the commands you use and tree-shaking keeps the bundle at ~610 KB, ~170 KB gzipped. The old lesson text said "~450 KB together" — no measurement gives that.', ''),
    en: 'What actually ships. Bundling only the client and the put command gave six hundred and ten kilobytes, one hundred seventy gzipped. node_modules is twenty megabytes, version two ninety-eight. The old figure of four hundred fifty kilobytes matches nothing we measured.' },
  { t: 'Lazy init — build the client on first use', body: tsx(LAZY, { sm: true, hl: [5, 6, 9] }) + two(tn(LUOI, { fs: 14, wrap: 60 }),
      box('Why the repo does this', 'Import costs nothing and needs no credentials: tests and a contributor\'s laptop boot without R2. The first real call checks the config and fails with a clear message.', 'xanh')),
    en: 'Lazy init: importing the module built zero clients. Calling it without configuration threw a clear error. With configuration, three calls built the client exactly once. That is why the app boots without storage credentials.' },
  { t: 'The repo\'s real client today', body: tsx(REPO, { sm: true, hl: [2, 7, 8] }) + two(tn(KHO.split('\n').slice(0, 12).join('\n').replace(/^\$ cd [^\n]*/, '$ grep -nE "region|forcePathStyle|…Checksum…|requestHandler" src/config/r2.ts'), { fs: 13, wrap: 64 }),
      box('Read the branches', `Three clients in one file: memory/dir sandbox (fake handler, no socket) and MinIO use ${c('forcePathStyle: true')}; real R2 uses ${c('false')}. The config check comes BEFORE the cache — the old lesson text had it the other way round.`, 'lam')),
    en: 'The repo\'s real client today, in a file of four hundred thirty-three lines: region comes from R2_REGION, defaulting to auto; forcePathStyle is false for real R2 and true for the sandbox and MinIO; checksums only when required.' },
  { t: 'region — required by the SDK, ignored by R2', body: tn(VUNG, { fs: 16, wrap: 104 }) +
      two(box('Measured', `No region at all ⇒ ${c('Region is missing')} on the very first ${c('send')}. ${c("'auto'")} and ${c("'us-east-1'")} both worked against MinIO.`, 'lam'),
        box('Why \'auto\'', 'R2 has no regions to choose; the SDK still signs every request with a region string. R2 documents "auto" (and accepts us-east-1 as an alias). The repo reads it from R2_REGION with default \'auto\'.', 'xanh')),
    en: 'region. With no region the SDK refused at the first send: region is missing. Both auto and us-east-1 worked on MinIO. R2 has no regions, but the signature needs a string, so the convention is auto.' },
  { t: 'forcePathStyle — two shapes of the same URL', body: flow([
      { t: 'path-style', s: 'host/bucket/key', mau: '#1f8a3b' }, { t: 'virtual-hosted', s: 'bucket.host/key', mau: '#2563eb' },
    ], { h: 120, fs: 22 }) + tn(KIEU, { fs: 16, wrap: 104 }) +
      two(box('Measured on MinIO', `${c('true')} ⇒ ${c('localhost:20200/kieu-url/a.txt')}: PUT OK. ${c('false')} ⇒ ${c('kieu-url.localhost:20200/a.txt')}: the request reaches MinIO but it reads "kieu-url" as no bucket ⇒ <b>MalformedXML</b>. Local MinIO must be path-style.`, 'do2'),
        box('In the repo', 'Real R2 (r2.cloudflarestorage.com) ⇒ forcePathStyle: false. Sandbox and MinIO ⇒ true (r2.ts lines 53 and 62). Same SDK, the endpoint decides.', 'lam')),
    en: 'forcePathStyle chooses between two shapes of URL: bucket in the path, or bucket in the host name. On MinIO, path style worked and virtual-hosted style failed with MalformedXML. The repo uses false for real R2 and true for MinIO.' },
  { t: 'requestChecksumCalculation — one line that saves every upload', giua: true, body: tn(TONG, { fs: 16, wrap: 104 }) +
      two(box('What we signed', 'A presigned PUT URL, no network call. With the SDK default (since 3.729) the URL carries a CRC32 of an EMPTY body: AAAAAA==. Any real file has another checksum.', 'do2'),
        box('The repo\'s fix (01/11/2026)', `${c("requestChecksumCalculation: 'WHEN_REQUIRED'")} — checksums only where the API demands them. Chapter 4 measures what a provider does with the wrong one.`, 'xanh')),
    en: 'requestChecksumCalculation. Signing a PUT URL with the default put a checksum of an empty body into the URL. With WHEN_REQUIRED, as in the repo, there is no checksum parameter. Chapter four measures the consequences.' },
  { t: 'The env variables — real names', body: cmp(['Variable', 'Holds', 'Used for'], [
      ['R2_BUCKET_NAME', 'cuongthai-media-storage', 'which bucket'],
      ['R2_ENDPOINT_URL', 'https://&lt;account&gt;.r2.cloudflarestorage.com', 'signed API calls (upload, delete)'],
      ['R2_ACCESS_KEY_ID / _SECRET_ACCESS_KEY', 'an R2 API token pair', 'signing — never in the browser'],
      ['R2_PUBLIC_URL', 'https://media.cuongthai.com', 'building public URLs (buildPublicUrl)'],
      ['R2_REGION', "'auto' (default)", 'the signature\'s region string'],
    ], { fs: 17 }) + two(box('Name check', `The old lesson text said ${c('R2_PUBLIC_URL_BASE')} — grep finds it 0 times. The real name is ${c('R2_PUBLIC_URL')}; config strips a trailing slash.`, 'do2'),
      box('Silent trap', `${c("const base = config.r2.publicUrl || ''")} — if R2_PUBLIC_URL is missing, buildPublicUrl returns "/images/…": a relative path, no error.`, '')),
    en: 'The environment variables, with their real names: bucket name, endpoint URL, the access key pair, the public URL, and the region. The old lesson text called it R2 public URL base; that name does not exist. And a missing public URL gives a relative path, silently.' },
  { t: 'Trap: the API endpoint is not the public URL', body: tn(CONG, { fs: 16, wrap: 104 }) + flow([
      { t: 'API endpoint', s: 'needs a signature · no CDN', mau: '#c0392b' }, { t: 'presigned URL', s: 'signature in the query', mau: '#c28a00' }, { t: 'public URL', s: 'custom domain via CDN', mau: '#1f8a3b' },
    ], { h: 120, fs: 21 }) + box('Measured', `Unsigned GET on the API endpoint ⇒ <b>403 AccessDenied</b>. The same object through a presigned URL ⇒ "xin chao". On R2 the API host also skips the CDN cache. Upload through the endpoint; serve through ${c('R2_PUBLIC_URL')}.`, 'lam'),
    en: 'The trap: using the API endpoint as a public URL. An unsigned GET to the endpoint returned four oh three, access denied. A presigned URL worked. Upload through the endpoint, serve through the public URL behind the CDN.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('AWS SDK v3', 'modular: one package per service'), kw('S3Client', 'configured connection; you .send() commands'), kw('Command', 'one operation: PutObjectCommand…'),
      kw('Lazy init', 'build the client on first use'), kw("region: 'auto'", 'required by the SDK, R2 has no regions'), kw('forcePathStyle', 'true = host/bucket/key · false = bucket.host/key'),
      kw('requestChecksumCalculation', "'WHEN_REQUIRED' = no empty-body checksum in signed URLs"), kw('API endpoint', 'signed calls, no CDN'), kw('Public URL', 'custom domain through the CDN'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: SDK v3, S3Client, command, lazy init, region auto, forcePathStyle, requestChecksumCalculation, and API endpoint versus public URL.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'npm i the two v3 packages; measure du -sh node_modules and a bundle with esbuild',
      `Write a lazy ${c('getClient()')}: import with no env ⇒ boots; first call builds; count the builds`,
      'Point it at local MinIO: try forcePathStyle true and false, and region missing',
      'Sign a PUT URL with and without WHEN_REQUIRED; GET the endpoint unsigned',
    ]), box('Keep these', '<ul><li>v3: 37 packages, bundle ~610 KB / ~170 KB gzip</li><li>Lazy init: check config, then cache</li><li>region required — R2 uses \'auto\'</li><li>MinIO: path-style · R2: virtual-hosted</li><li>Endpoint for signed calls, R2_PUBLIC_URL for serving</li></ul>', 'lam'), ''),
    en: 'Your turn: install and measure; write a lazy client and count how often it is built; try the URL styles and a missing region on MinIO; sign a PUT URL with and without WHEN_REQUIRED.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The S3 API', bai: '1.1 Creating the client' }, S);
