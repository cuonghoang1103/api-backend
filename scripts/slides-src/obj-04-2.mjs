/**
 * obj-04-2 — Object Storage · Chapter 4 · 2 "The SigV4 signableHeaders XSS bug" (deck video + web, 14/11/2026).
 * Bài web: os-4-2-sigv4-bug. Output THẬT (scratchpad/obj/demo/n4-2.txt · Node 22.23.3 · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0 · nginx 1.27 "CDN" mô phỏng, Mac) + Chromium thật (anh.mjs):
 * chỉ ký host ⇒ X-Amz-SignedHeaders=host ⇒ PUT text/html 200 ⇒ qua CDN Content-Type: text/html ⇒ Chromium chạy script trên origin của CDN;
 * ký content-type ⇒ content-type;host ⇒ text/html 403, không gửi type 403, "video/mp4; charset=utf-8" 403, video/mp4 200; ['content-type'] và ['host','content-type'] ⇒ CÙNG chữ ký;
 * client mặc định SDK 3.1071 ⇒ URL mang x-amz-checksum-crc32=AAAAAA== (= CRC32 của thân RỖNG; tệp thật A4gwDQ==) — MinIO bỏ qua (200, không lưu checksum);
 * ký content-length 2048 ⇒ 2048 B 200, 150 MiB 403; Metadata ⇒ x-amz-meta-user-id=42 trong query, sửa ⇒ từ chối; route ký "theo loại người dùng xin" ⇒ text/html được ký + phục vụ HTML; lọc trước khi ký ⇒ 400.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-2:file:ky-put.mjs": "// ky-put.mjs <key> <content-type> <kiểu> — ký URL PUT cho bucket media-ch3 (bucket mà \"CDN\" mô phỏng ở cổng 20202 phục vụ công khai).\n//   host  : BẢN LỖI — không truyền signableHeaders ⇒ SigV4 chỉ ký host (như kho TRƯỚC commit 60e28eafd, 28/07/2026)\n//   ct    : BẢN VÁ của kho (src/config/r2.ts:158) — signableHeaders: new Set(['content-type'])\n//   goc   : bản vá NHƯNG client để mặc định checksum của SDK ≥ 3.729 (không có requestChecksumCalculation: 'WHEN_REQUIRED')\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst [key, ct, kieu = 'ct'] = process.argv.slice(2);\nconst chung = { endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true };\nconst s3 = new S3Client(kieu === 'goc' ? chung : { ...chung, requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED' });\nconst cmd = new PutObjectCommand({ Bucket: 'media-ch3', Key: key, ContentType: ct });\nconsole.log(await getSignedUrl(s3, cmd, { expiresIn: 3600, ...(kieu === 'host' ? {} : { signableHeaders: new Set(['content-type']) }) }));\n",
 "n4-2:file:put.sh": "# put.sh <url> <content-type> <tệp> — PUT như trình duyệt, in mã HTTP + <Code> nếu lỗi\nr=$(curl -s -o body.bin -w '%{http_code}' -X PUT --data-binary @\"$3\" ${2:+-H \"Content-Type: $2\"} \"$1\"); echo \"PUT Content-Type: ${2:-(không gửi)} ⇒ HTTP $r $(grep -o '<Code>[^<]*</Code>' body.bin)\"\n",
 "n4-2:file:mau.html": "<!doctype html><meta charset=\"utf-8\"><title>video.mp4</title><h1 id=\"h\">🎬 video.mp4</h1>\n<script>document.getElementById('h').textContent = '⚠️ Script của kẻ lạ đang chạy trên ' + location.origin; document.title = 'XSS';</script>\n",
 "n4-2:loi": "$ # 1. Người dùng thật xin URL để tải VIDEO lên (máy chủ ký với video/mp4) — BẢN LỖI chỉ ký host\n$ u=$(node ky-put.mjs video/u42/…-loi.mp4 video/mp4 host); echo $u | grep -o X-Amz-SignedHeaders=…\nX-Amz-SignedHeaders=host\n$ # 2. Nhưng PUT một trang HTML vào đúng URL đó\n$ bash put.sh \"$(cat u-loi.txt)\" text/html mau.html\nPUT Content-Type: text/html ⇒ HTTP 200 \n$ # 3. Qua \"CDN\" (tên miền media mô phỏng): object trả về là gì?\n$ curl -sD - -o /dev/null localhost:20202/video/u42/…-loi.mp4 | grep -iE '^HTTP|^content-type'\nHTTP/1.1 200 OK\nContent-Type: text/html",
 "n4-2:va": "$ # BẢN VÁ: ký content-type ⇒ SignedHeaders có content-type\n$ u=$(node ky-put.mjs video/u42/…-va.mp4 video/mp4 ct); echo $u | grep -o X-Amz-SignedHeaders=…\nX-Amz-SignedHeaders=content-type%3Bhost\n$ bash put.sh \"$(cat u-va.txt)\" text/html mau.html\nPUT Content-Type: text/html ⇒ HTTP 403 <Code>SignatureDoesNotMatch</Code>\n$ bash put.sh \"$(cat u-va.txt)\" \"\" mau.html\nPUT Content-Type: (không gửi) ⇒ HTTP 403 <Code>SignatureDoesNotMatch</Code>\n$ bash put.sh \"$(cat u-va.txt)\" 'video/mp4; charset=utf-8' mau.html\nPUT Content-Type: video/mp4; charset=utf-8 ⇒ HTTP 403 <Code>SignatureDoesNotMatch</Code>\n$ head -c 2048 /dev/urandom > that.mp4; bash put.sh \"$(cat u-va.txt)\" video/mp4 that.mp4\nPUT Content-Type: video/mp4 ⇒ HTTP 200 \n$ # Bài web cũ ghi new Set(['host', 'content-type']); kho ghi new Set(['content-type']) — so hai URL ký cùng một giây\n$ node -e \"… cùng signingDate, signableHeaders ['content-type'] rồi ['host','content-type'] …\"\n[\"content-type\"]           content-type;host 5e05c7b6e6f05f92…\n[\"host\",\"content-type\"]    content-type;host 5e05c7b6e6f05f92…",
 "n4-2:checksum": "$ # Client ĐỂ MẶC ĐỊNH (SDK 3.1071 ≥ 3.729): URL ký sẵn mang theo gì?\n$ u=$(node ky-put.mjs video/u42/…-ck.mp4 video/mp4 goc); echo $u | grep -oE 'x-amz-(checksum|sdk)…'\nx-amz-checksum-crc32=AAAAAA%3D%3D\nx-amz-sdk-checksum-algorithm=CRC32\n$ bash put.sh \"$(cat u-ck.txt)\" video/mp4 that.mp4; grep -o '<Message>[^<]*</Message>' body.bin\nPUT Content-Type: video/mp4 ⇒ HTTP 200 \n$ node -e \"… zlib.crc32(thân rỗng) · zlib.crc32(that.mp4), in base64 …\"\nCRC32 thân RỖNG              = AAAAAA==\nCRC32 that.mp4 (2048 byte)   = MaTh8g==\n$ aws s3api head-object --bucket media-ch3 --key video/u42/…-ck.mp4 --checksum-mode ENABLED --query …\n{\"ContentLength\":2048,\"ChecksumCRC32\":null}\n$ # Client như kho (r2.ts:83–88: requestChecksumCalculation 'WHEN_REQUIRED')\n$ u=$(node ky-put.mjs video/u42/…-ck2.mp4 video/mp4 ct); echo $u | grep -oE 'x-amz-(checksum|sdk)…'; bash put.sh \"$u\" video/mp4 that.mp4\n(không có tham số checksum)\nPUT Content-Type: video/mp4 ⇒ HTTP 200 ",
 "n4-2:file:ky-them.mjs": "// ky-them.mjs — chữ ký còn khoá được gì nữa? content-length (đúng kích thước đã khai) và x-amz-meta-* (metadata).\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' });\nconst [kieu, key] = process.argv.slice(2);\nconst cmd = kieu === 'len'\n  ? new PutObjectCommand({ Bucket: 'media-ch3', Key: key, ContentType: 'video/mp4', ContentLength: 2048 })\n  : new PutObjectCommand({ Bucket: 'media-ch3', Key: key, ContentType: 'video/mp4', Metadata: { 'user-id': '42' } });\nconsole.log(await getSignedUrl(s3, cmd, { expiresIn: 3600, signableHeaders: new Set(kieu === 'len' ? ['content-type', 'content-length'] : ['content-type']) }));\n",
 "n4-2:them": "$ # Khoá kích thước: khai 2048 byte lúc ký\n$ u=$(node ky-them.mjs len video/u42/…-len.mp4); …; bash put.sh \"$u\" video/mp4 that.mp4; bash put.sh \"$u\" video/mp4 to.bin   # 2048 B rồi 150 MiB\nX-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost\nPUT Content-Type: video/mp4 ⇒ HTTP 200 \nPUT Content-Type: video/mp4 ⇒ HTTP 403 <Code>SignatureDoesNotMatch</Code>\n$ # Metadata: SDK đưa x-amz-meta-* vào chuỗi truy vấn của URL (đã ký)\n$ u=$(node ky-them.mjs meta video/u42/…-meta.mp4); …; bash put.sh \"$u\" video/mp4 that.mp4; aws s3api head-object … --query Metadata\nx-amz-meta-user-id=42\nPUT Content-Type: video/mp4 ⇒ HTTP 200 \n{\"user-id\":\"42\"}\n$ curl -X PUT --data-binary @that.mp4 -H 'x-amz-meta-user-id: 7' \"${u/user-id=42/user-id=7}\"\nsửa user-id=42 ⇒ 7 trong URL ⇒ HTTP 400 <Code>AccessDenied</Code>",
 "n4-2:file:xin-url.mjs": "// xin-url.mjs <content-type do NGƯỜI DÙNG khai> [--loc] — một route ký URL \"theo loại người dùng xin\" (KHÔNG lọc loại).\n// --loc ⇒ thêm bước lọc như assertSafeUploadType của kho (src/storage/uploadService.ts:337 — DANGEROUS_MIME + họ loại theo thư mục).\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' });\nconst NGUY_HIEM = new Set(['text/html', 'application/xhtml+xml', 'image/svg+xml', 'text/xml', 'application/xml', 'text/javascript', 'application/javascript', 'application/x-javascript']);\nconst [ct, loc] = process.argv.slice(2);\nconst mime = ct.toLowerCase().split(';')[0].trim();\nif (loc && (NGUY_HIEM.has(mime) || !/^(image|video|audio)\\/|^application\\/pdf$/.test(mime))) { console.log(JSON.stringify({ status: 400, code: 'UNSAFE_FILE_TYPE', ct })); process.exit(0); }\nconst key = `user-files/u7/${Date.now()}-tep`;\nconsole.log(JSON.stringify({ key, uploadUrl: await getSignedUrl(s3, new PutObjectCommand({ Bucket: 'media-ch3', Key: key, ContentType: ct }), { expiresIn: 600, signableHeaders: new Set(['content-type']) }) }));\n",
 "n4-2:xau": "$ # Kẻ xấu KHAI THẲNG text/html lúc xin URL — route ký đúng loại đó, chữ ký vẫn \"đúng\"\n$ r=$(node xin-url.mjs text/html); bash put.sh \"<uploadUrl>\" text/html mau.html; curl -sD - -o /dev/null localhost:20202/<key> | grep …\nPUT Content-Type: text/html ⇒ HTTP 200 \nHTTP/1.1 200 OK\nContent-Type: text/html\n$ # Có bước lọc loại TRƯỚC khi ký\n$ for t in text/html image/svg+xml 'TEXT/HTML; charset=utf-8' video/mp4; do node xin-url.mjs \"$t\" --loc; done\nxin text/html ⇒ {\"status\":400,\"code\":\"UNSAFE_FILE_TYPE\",\"ct\":\"text/html\"}\nxin image/svg+xml ⇒ {\"status\":400,\"code\":\"UNSAFE_FILE_TYPE\",\"ct\":\"image/svg+xml\"}\nxin TEXT/HTML; charset=utf-8 ⇒ {\"status\":400,\"code\":\"UNSAFE_FILE_TYPE\",\"ct\":\"TEXT/HTML; charset=utf-8\"}\nxin video/mp4 ⇒ {\"key\":\"user-files/u7/1794642976195-tep\",\"uploadUrl\":\"http://localhost:20200/media-ch3/use"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, ts, br, hx, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-04-2', code: 'OBJ 4.2', title: '4.2 — The SigV4 signableHeaders XSS bug', sub: 'Chapter 4 · Lesson 4.2' };
const O = (k) => { const v = DU_LIEU[`n4-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const LOI = bo(O('loi'));
const VA = bo(O('va'));
const [VA1, VA2] = [VA.split('$ node -e')[0].trim(), '$ node -e' + VA.split('$ node -e')[1]];
const CK = bo(O('checksum'));
const THEM = bo(O('them'));
const XAU = bo(O('xau')).replace(/("uploadUrl":"http:\/\/localhost:20200\/media-ch3\/use).*/, '$1…');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.2', t: 'The SigV4 signableHeaders<br>XSS bug', sub: 'A presigned PUT that signs only host, an HTML page under a video key — reproduced, fixed, and the two traps next to it',
    en: 'Chapter four, lesson two: the SigV4 signableHeaders bug. A presigned PUT that signs only the host, an HTML page under a video key: reproduced, fixed, and the two traps right next to it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What a presigned PUT really signs — and what it does not</li>
    <li>The attack, reproduced: HTML served from the media domain</li>
    <li>This repo's fix, measured: four PUTs, one 200</li>
    <li>The checksum trap of SDK ≥ 3.729</li>
    <li>Pinning is not validating: allow-list before you sign</li></ul>`,
    en: 'Takeaways: what a presigned PUT really signs; the attack, reproduced; this repo\'s fix, measured; the checksum trap of newer SDKs; and why pinning is not validating.' },
  { t: 'The vulnerable code — what the signature covers', body: ts(`// VULNERABLE — what this repo had before commit 60e28eafd (28/07/2026)
const cmd = new PutObjectCommand({ Bucket, Key: key, ContentType: 'video/mp4' });
const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
// X-Amz-SignedHeaders=host  ⇒ ContentType above is only a DEFAULT, not a promise`, { fs: 17 }) + cmp(['part of the request', 'signed by default?', 'can the uploader change it?'], [
      ['method (PUT) + bucket + key', '✅ always', 'no ⇒ SignatureDoesNotMatch (3.3)'],
      ['expiry (X-Amz-Expires)', '✅ always', 'no'],
      ['Host header', '✅ always', 'no'],
      ['<b>Content-Type header</b>', '<b>❌ only if listed in signableHeaders</b>', '<b>yes — any value</b>'],
      ['Content-Length (size)', '❌ only if listed', 'yes — measured in 4.1: 150 MiB into a 5 MB URL'],
    ], { fs: 17, hl: [3] }) + box('Why', 'SigV4 signs a <i>canonical request</i>: method, path, query, and the headers named in <code>X-Amz-SignedHeaders</code>. A header that is not named is not checked.', 'lam'),
    en: 'The vulnerable code. The command says video slash mp4, but the URL signs only the host. SigV4 signs a canonical request: the method, the path, the query, and only the headers that are named. Content type and size are not named, so the uploader can change them.' },
  { t: 'Measured: the attack, end to end', body: tn(LOI, { fs: 14, wrap: 120 }) + br('obj-04-2', 'xss', { url: 'localhost:20202/video/u42/…-loi.mp4  (the "CDN", like media.cuongthai.com)', h: 130, w: 1110 }) +
      `<div class="cap">Real Chromium: the "video" is an HTML page and its script runs on the media origin.</div>` +
      two(box('What the server approved', 'A key ending in <code>.mp4</code> and <code>ContentType: \'video/mp4\'</code> on the command. It believed that was the type.', 'lam'),
        box('What the bucket stored', 'Whatever the PUT said: <code>text/html</code>. The bucket checks only the signed parts — the type was not one of them.', 'do2')),
    en: 'Measured end to end. The server signed for video, the URL lists only host. A PUT with text slash html and a script gets two hundred. Through the CDN the object comes back as text slash html, and a real Chromium runs the script on the media origin.' },
  { t: 'Why HTML on the media domain is a real problem', body: two(box('What the attacker gets', '<ul><li>A page on <b>your</b> domain: a fake login on <code>media.yoursite.com</code> looks trusted.</li><li>Script on a sibling subdomain of the site: it can set cookies for the parent domain (cookie tossing) and read anything the media origin can.</li><li>A link that passes chat and email filters, because the domain is yours.</li></ul>', 'do2'),
      box('You have met the defence', '<ul><li>GitHub serves raw user files from <code>raw.githubusercontent.com</code>, not <code>github.com</code>.</li><li>Google Drive previews come from <code>googleusercontent.com</code>.</li><li>Both: user bytes live on a separate domain, so even HTML there cannot touch the main site.</li></ul>', 'lam')) +
      box('In this repo', 'Uploads land in one bucket served at <code>media.cuongthai.com</code>; the multipart path rejects HTML/SVG/JS with <code>assertSafeUploadType</code> (uploadService.ts:337). The presigned video path accepts only <code>video/*</code> before it signs. Every presigned route needs a gate like that in front of the signature.', ''),
    en: 'Why it matters. HTML on your media domain is a phishing page on a trusted name, a script on a sibling subdomain, and a link that passes filters. GitHub and Google serve user files from separate domains for exactly this reason.' },
  { t: 'The fix — this repo\'s real code', body: ts(`// src/config/r2.ts:158 — real code (the old text cited r2.ts:117 and ['host', 'content-type'])
export async function getSignedUploadUrl(key: string, contentType: string, expiresInSeconds = 3600) {
  const cmd = new PutObjectCommand({ Bucket: config.r2.bucketName, Key: key, ContentType: contentType });
  return sandboxReachable(key, await getSignedUrl(getR2Client(), cmd, {
    expiresIn: expiresInSeconds,
    signableHeaders: new Set(['content-type']),     // pins the type; host is always signed
  }));
}`, { fs: 16 }) + tn(VA2, { fs: 14, wrap: 120 }) + box('Same URL either way', 'With the same signing time, <code>[\'content-type\']</code> and <code>[\'host\', \'content-type\']</code> give the same SignedHeaders and the same signature — host is always in. The same fix is inlined in <code>hub.routes.ts</code> (Hub presign).', 'lam'),
    en: 'The fix, this repo\'s real code: one option, signable headers with content type. The old text cited another line and listed host as well. Measured: both sets give the identical signature, because host is always signed.' },
  { t: 'Measured: one URL, four PUTs', body: tn(VA1, { fs: 15, wrap: 112 }) + cmp(['PUT with Content-Type', 'answer', 'lesson'], [
      ['text/html', '403 SignatureDoesNotMatch', 'the attack is dead'],
      ['(none sent)', '403', 'a missing header is a different value'],
      ['video/mp4; charset=utf-8', '403', 'exact string — some libraries append a charset'],
      ['video/mp4', '200', 'the client must send the signed value byte for byte'],
    ], { fs: 17, hl: [0, 3] }),
    en: 'One URL, four PUTs. HTML: four hundred three. No content type at all: four hundred three. Video with a charset appended: also four hundred three, because the comparison is the exact string. Only video slash mp4, exactly as signed, gets two hundred.' },
  { t: 'The client half: send exactly what was signed', body: ts(`// frontend/src/lib/api.ts:415 — filesApi.uploadVideoDirect (real code)
const presign = await api.post('/files/upload/presign-r2', {
  filename: file.name, contentType: file.type, size: file.size,   // the type the server will sign
});
const xhr = new XMLHttpRequest();
xhr.open('PUT', uploadUrl);
xhr.setRequestHeader('Content-Type', file.type);   // the SAME value the server signed
xhr.send(file);                                     // raw bytes, not FormData`, { fs: 16 }) + hx([
      ['POST', '/files/upload/presign-r2  { "contentType": "video/mp4", … }', 'what the server signs'],
      ['PUT', '…/video/u42/….mp4?…X-Amz-SignedHeaders=content-type%3Bhost…', 'the URL names the header'],
      ['PUT', 'Content-Type: video/mp4', 'byte-for-byte the same'],
    ], { fs: 15 }) + two(box('Why XHR, not the API client', 'The PUT goes to another origin with no auth header; XHR gives upload progress. Sending <code>FormData</code> would change the type to <code>multipart/form-data</code> ⇒ 403.', 'lam'),
      box('Debugging a 403 here', 'Compare three strings: the <code>contentType</code> sent to presign, <code>X-Amz-SignedHeaders</code> in the URL, and the Content-Type in the browser\'s Network tab. One differs.', '')),
    en: 'The client half, real code: the browser sends the same file type to presign and as the PUT header, and sends raw bytes. FormData would change the type and break the signature. Debugging a four hundred three means comparing three strings.' },
  { t: 'Trap two: the checksum the SDK signs for you', body: tn(CK, { fs: 13, wrap: 132 }) + two(box('What happened', 'Since SDK 3.729 the default is <code>WHEN_SUPPORTED</code>: a presigned PUT carries <code>x-amz-checksum-crc32=AAAAAA==</code> — the CRC32 of an <b>empty</b> body, computed at signing time. The real file is <code>A4gwDQ==</code>.', 'do2'),
      box('MinIO vs a strict provider', 'MinIO ignored it: 200, and no checksum stored. A provider that verifies it rejects every real file. This repo sets <code>requestChecksumCalculation: \'WHEN_REQUIRED\'</code> (r2.ts:83–88) ⇒ no checksum parameter.', 'lam')),
    en: 'Trap two: the checksum. Newer SDKs put a CRC32 into the presigned URL, computed for an empty body. MinIO ignores it, a provider that checks it rejects every real file. This repo turns it off with when required.' },
  { t: 'What else can a signature pin?', body: tn(THEM, { fs: 13, wrap: 132 }) + cmp(['pin', 'how', 'measured'], [
      ['content-length (size)', 'ContentLength + signableHeaders content-length', '2,048 B ⇒ 200 · 150 MiB ⇒ 403'],
      ['x-amz-meta-* (metadata)', 'Metadata on the command — the SDK hoists it into the signed query', 'user-id=42 stored · edited to 7 ⇒ refused'],
      ['a size RANGE', 'presigned POST with content-length-range', 'Node.js course 10.2 (400 EntityTooLarge)'],
    ], { fs: 16 }),
    en: 'What else can a signature pin? The exact size, by signing content length: two thousand forty-eight bytes pass, one hundred fifty megabytes fail. Metadata, which the SDK moves into the signed query. And for a size range, a presigned POST.' },
  { t: 'The attacker\'s other door: pinning is not validating', body: tn(XAU, { fs: 13, wrap: 132 }) + two(box('What went wrong', 'A route that signs <b>whatever type the client declares</b>: the attacker simply asks for <code>text/html</code>. The signature is perfect — it pins the attacker\'s choice.', 'do2'),
      box('Defend in depth', '<ul><li>Allow-list the type <b>before</b> signing (lower-case, strip <code>; params</code>), like <code>assertSafeUploadType</code>.</li><li>Serve user files from a separate domain, or with <code>Content-Disposition: attachment</code>.</li><li>Test the wrong type on purpose in your suite.</li></ul>', 'lam')),
    en: 'The other door. A route that signs whatever type the client declares: ask for text slash html and the signature pins the attacker\'s choice perfectly. Allow-list before signing, serve user files from a separate domain or as attachments, and test the wrong type on purpose.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('SigV4', 'AWS signature version 4'), kw('Canonical request', 'what is actually hashed and signed'), kw('X-Amz-SignedHeaders', 'read it to audit a URL'),
      kw('signableHeaders', 'SDK option: headers to sign'), kw('Stored XSS', 'saved script served to visitors'), kw('Default vs pinned', 'ContentType alone is a default'),
      kw('WHEN_REQUIRED', 'no empty-body checksum in the URL'), kw('content-length pin', 'exact size or 403'), kw('Allow-list before signing', 'validate, then pin'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: SigV4, canonical request, X-Amz-SignedHeaders, signable headers, stored XSS, default versus pinned, when required, the content-length pin, and allow-list before signing.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Sign a PUT without signableHeaders; PUT text/html; open it in a browser',
      'Add signableHeaders: [\'content-type\']; repeat — expect 403',
      'Try no Content-Type and "; charset=utf-8": read the &lt;Code&gt;',
      'Print a URL from a default client: find x-amz-checksum-crc32',
      'Write the allow-list that runs before signing',
    ]), box('Keep these', '<ul><li>Unlisted headers are not checked</li><li>Sign content-type; send it byte for byte</li><li>WHEN_REQUIRED for presigned PUTs</li><li>Pin size with content-length or POST</li><li>Validate the type before you sign it</li></ul>', 'lam'), ''),
    en: 'Your turn: reproduce the attack, apply the fix, break it with a charset, find the checksum parameter, and write the allow-list.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Presigned upload security', bai: '4.2 signableHeaders' }, S);
