/**
 * obj-03-3 — Object Storage · Chapter 3 · 3 "Signed URLs for private objects" (deck video + web, 14/11/2026).
 * Bài web: os-3-3-signed. Output THẬT (scratchpad/obj/demo/n3-3.txt · Node 22.23.3 · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0, Mac):
 * URL 5 s ⇒ 200, không chữ ký 403, 6 s sau 403 "Request has expired", sửa lesson-3 ⇒ lesson-4 ⇒ 403 SignatureDoesNotMatch; 604800 s ký được, 604801 ⇒ lỗi SDK;
 * getSignedDownloadUrl (r2.ts:322, mặc định 300 s — bài cũ ghi 600) + filename ⇒ Content-Disposition; tên tiếng Việt bị làm sạch thành "___thi_cu_i_k___b_n_2_.pdf";
 * getSignedReadUrl (r2.ts:350): gọi 10:05/10:20/10:29 ⇒ CÙNG chữ ký (ký 10:00, hết 11:30), 10:31 ⇒ chữ ký mới; route kiểm quyền: 401/403/200, 438 byte qua máy chủ
 * vs proxy 5.243.319 byte; URL lộ ⇒ người lạ 200 tới khi hết hạn, Credential chỉ lộ access key ID; Range 0-99 ⇒ 206.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-3:file:ky.mjs": "// Ký một GET cho object RIÊNG TƯ (bucket không công khai trên cổng API), sống expiresIn giây — như getSignedDownloadUrl của kho (r2.ts:322).\nimport { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true,\n  requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED' });\nconst [key, giay] = [process.argv[2], Number(process.argv[3] ?? 300)];\nconsole.log(await getSignedUrl(s3, new GetObjectCommand({ Bucket: 'media-ch3', Key: key }), { expiresIn: giay }));\n",
 "n3-3:file:goi.sh": "# in: mã HTTP + số byte + <Code>/<Message> nếu lỗi\nr=$(curl -s -o body.bin -w '%{http_code} %{size_download}' \"$1\"); echo \"HTTP ${r% *} · ${r#* } byte $(grep -o '<Code>[^<]*</Code>' body.bin) $(grep -o '<Message>[^<]*</Message>' body.bin)\"\n",
 "n3-3:het": "$ # Ký URL sống 5 giây cho một PDF trả phí (bucket KHÔNG công khai)\n$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 5); echo \"${u%%\\?*}?…X-Amz-Expires=$(echo \"$u\" | grep -o 'X-Amz-Expires=[0-9]*' | cut -d= -f2)…\"; bash goi.sh \"$u\"; echo \"$u\" > ky5.txt\nhttp://localhost:20200/media-ch3/paid/course-5/lesson-3.pdf?…X-Amz-Expires=5…\nHTTP 200 · 6300 byte  \n$ curl -s -o /dev/null -w 'không chữ ký: HTTP %{http_code}\\n' http://localhost:20200/media-ch3/paid/course-5/lesson-3.pdf\nkhông chữ ký: HTTP 403\n$ sleep 6; echo \"… 6 giây sau:\"; bash goi.sh \"$(cat ky5.txt)\"\n… 6 giây sau:\nHTTP 403 · 366 byte <Code>AccessDenied</Code> <Message>Request has expired</Message>\n$ # Sửa MỘT ký tự trong đường dẫn (lesson-3 ⇒ lesson-4) của một URL còn hạn\n$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 300); bash goi.sh \"${u/lesson-3/lesson-4}\"\nHTTP 403 · 469 byte <Code>SignatureDoesNotMatch</Code> <Message>The request signature we calculated does not match the signature you provided. Check your key and signing method.</Message>\n$ node -e \"import('@aws-sdk/s3-request-presigner').then(async ({getSignedUrl}) => { const {S3Client, GetObjectCommand} = await import('@aws-sdk/client-s3'); const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true }); for (const g of [604800, 604801]) { try { await getSignedUrl(s3, new GetObjectCommand({ Bucket: 'media-ch3', Key: 'x' }), { expiresIn: g }); console.log(g, 'giây: ký được'); } catch (e) { console.log(g, 'giây:', e.message); } } })\"\n604800 giây: ký được\n604801 giây: Signature version 4 presigned URLs must have an expiration date less than one week in the future",
 "n3-3:file:tai.mjs": "// Chép NGUYÊN getSignedDownloadUrl của kho (src/config/r2.ts:322–338): tham số filename ⇒ ResponseContentDisposition, tên làm sạch bằng /[^\\w.-]/g ⇒ '_'.\nimport { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true,\n  requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED' });\nasync function getSignedDownloadUrl(key, expiresInSeconds = 300, filename) {\n  const cmd = new GetObjectCommand({ Bucket: 'media-ch3', Key: key,\n    ...(filename ? { ResponseContentDisposition: `attachment; filename=\"${filename.replace(/[^\\w.-]/g, '_')}\"` } : {}) });\n  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });\n}\nfor (const ten of [undefined, 'lesson-3.pdf', 'Đề thi cuối kỳ (bản 2).pdf']) {\n  const u = await getSignedDownloadUrl('paid/course-5/lesson-3.pdf', 300, ten);\n  const r = await fetch(u);\n  console.log(`filename=${JSON.stringify(ten) ?? 'không'}`.padEnd(40), '⇒', r.status, r.headers.get('content-disposition') ?? '(không có Content-Disposition ⇒ trình duyệt MỞ luôn)');\n}\n",
 "n3-3:tai": "$ node tai.mjs\nfilename=không                           ⇒ 200 (không có Content-Disposition ⇒ trình duyệt MỞ luôn)\nfilename=\"lesson-3.pdf\"                  ⇒ 200 attachment; filename=\"lesson-3.pdf\"\nfilename=\"Đề thi cuối kỳ (bản 2).pdf\"    ⇒ 200 attachment; filename=\"___thi_cu_i_k___b_n_2_.pdf\"",
 "n3-3:file:cuaso.mjs": "// Chép NGUYÊN getSignedReadUrl của kho (src/config/r2.ts:350–356): signingDate làm tròn XUỐNG mốc 30 phút, sống 90 phút.\nimport { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true,\n  requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED' });\nasync function getSignedReadUrl(key, now = new Date()) {\n  const CUA_SO_MS = 30 * 60_000;\n  const signingDate = new Date(Math.floor(now.getTime() / CUA_SO_MS) * CUA_SO_MS);\n  return getSignedUrl(s3, new GetObjectCommand({ Bucket: 'media-ch3', Key: key }), { expiresIn: 90 * 60, signingDate });\n}\nconst ky = (hhmm) => getSignedReadUrl('paid/course-5/lesson-3.pdf', new Date(`2026-11-14T${hhmm}:00Z`));\nconst lay = (u) => new URL(u).searchParams;\nfor (const t of ['10:05', '10:20', '10:29', '10:31']) {\n  const p = lay(await ky(t));\n  const ky_luc = p.get('X-Amz-Date'), het = new Date(Date.UTC(+ky_luc.slice(0, 4), +ky_luc.slice(4, 6) - 1, +ky_luc.slice(6, 8), +ky_luc.slice(9, 11), +ky_luc.slice(11, 13)) + 90 * 60_000);\n  console.log(`gọi lúc ${t} ⇒ ký lúc ${ky_luc.slice(9, 11)}:${ky_luc.slice(11, 13)} · hết hạn ${het.toISOString().slice(11, 16)} · chữ ký ${p.get('X-Amz-Signature').slice(0, 12)}…`);\n}\n",
 "n3-3:cuaso": "$ node cuaso.mjs\ngọi lúc 10:05 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…\ngọi lúc 10:20 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…\ngọi lúc 10:29 ⇒ ký lúc 10:00 · hết hạn 11:30 · chữ ký 47f1f5628983…\ngọi lúc 10:31 ⇒ ký lúc 10:30 · hết hạn 12:00 · chữ ký 78bb92910b35…",
 "n3-3:file:may.mjs": "// Route kiểu kho: KIỂM QUYỀN rồi trả signed URL (KHÔNG stream byte qua máy chủ). So với cách proxy: máy chủ tự đọc và gửi cả tệp.\nimport http from 'node:http';\nimport { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true,\n  requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED' });\nconst DA_MUA = { 'u42': ['course-5'] };                                         // \"bảng enrollment\"\nlet byteRa = 0;\nhttp.createServer(async (req, res) => {\n  const gui = (ma, body, type = 'application/json') => { const b = Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body)); byteRa += b.length; res.writeHead(ma, { 'Content-Type': type }); res.end(b); };\n  if (req.url === '/byte') return res.end(String(byteRa));\n  const nguoi = /user=(\\w+)/.exec(req.headers.cookie ?? '')?.[1];\n  const [, kieu, khoa, bai] = req.url.split('/');                              // /link/course-5/lesson-3  hoặc  /proxy/course-5/lesson-3\n  if (!nguoi) return gui(401, { error: 'chưa đăng nhập' });\n  if (!(DA_MUA[nguoi] ?? []).includes(khoa)) return gui(403, { error: 'chưa mua khoá' });\n  const cmd = new GetObjectCommand({ Bucket: 'media-ch3', Key: `paid/${khoa}/${bai}.pdf` });\n  if (kieu === 'link') return gui(200, { url: await getSignedUrl(s3, cmd, { expiresIn: 300 }) });\n  const o = await s3.send(cmd); return gui(200, Buffer.from(await o.Body.transformToByteArray()), 'application/pdf');\n}).listen(20203, () => console.log('máy chủ khoá học: http://localhost:20203'));\n",
 "n3-3:route": "$ curl -s -o /dev/null -w 'chưa đăng nhập      ⇒ HTTP %{http_code}\\n' localhost:20203/link/course-5/lesson-9\nchưa đăng nhập      ⇒ HTTP 401\n$ curl -s -o /dev/null -w 'u7 chưa mua         ⇒ HTTP %{http_code}\\n' -b user=u7 localhost:20203/link/course-5/lesson-9\nu7 chưa mua         ⇒ HTTP 403\n$ u=$(curl -s -b user=u42 localhost:20203/link/course-5/lesson-9 | node -pe 'JSON.parse(require(\"fs\").readFileSync(0)).url'); curl -s -o /dev/null -w 'u42 đã mua ⇒ tải từ bucket: HTTP %{http_code} · %{size_download} byte\\n' \"$u\"\nu42 đã mua ⇒ tải từ bucket: HTTP 200 · 5242881 byte\n$ echo \"byte đi qua máy chủ (cách signed URL): $(curl -s localhost:20203/byte)\"\nbyte đi qua máy chủ (cách signed URL): 438\n$ curl -s -o /dev/null -w 'u42 cách PROXY ⇒ HTTP %{http_code} · %{size_download} byte\\n' -b user=u42 localhost:20203/proxy/course-5/lesson-9\nu42 cách PROXY ⇒ HTTP 200 · 5242881 byte\n$ echo \"byte đi qua máy chủ (sau một lượt proxy): $(curl -s localhost:20203/byte)\"\nbyte đi qua máy chủ (sau một lượt proxy): 5243319",
 "n3-3:file:lo.sh": "# GÓC KẺ XẤU: signed URL KHÔNG gắn với người — ai cầm URL cũng tải được tới khi hết hạn (như link bị chuyển vào nhóm chat).\nu=$(node ky.mjs paid/course-5/lesson-3.pdf 8)\nprintf 'người mua (cookie u42)        : '; curl -s -o /dev/null -w '%{http_code}\\n' -b user=u42 \"$u\"\nprintf 'người lạ trong nhóm chat      : '; curl -s -o /dev/null -w '%{http_code}\\n' -A 'Zalo-nguoi-la' \"$u\"\nprintf 'URL lộ ra gì? X-Amz-Credential = '; echo \"$u\" | grep -o 'X-Amz-Credential=[^&]*' | cut -d= -f2 | sed 's/%2F/\\//g' | sed \"s#^[^/]*#<access-key-id>#\"\nsleep 9; printf 'người lạ, 9 giây sau          : '; curl -s -o body.bin -w '%{http_code} ' \"$u\"; grep -o '<Message>[^<]*</Message>' body.bin\n",
 "n3-3:xau": "$ bash lo.sh\nngười mua (cookie u42)        : 200\nngười lạ trong nhóm chat      : 200\nURL lộ ra gì? X-Amz-Credential = <access-key-id>/20261114/us-east-1/s3/aws4_request\nngười lạ, 9 giây sau          : 403 <Message>Request has expired</Message>\n$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 300); curl -s -r 0-99 -o /dev/null -w 'Range 0-99 trên signed URL ⇒ HTTP %{http_code} · %{size_download} byte (video tua được)\\n' \"$u\"\nRange 0-99 trên signed URL ⇒ HTTP 206 · 100 byte (video tua được)"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, icards, cmp, box, two, steps, kw, c, ts, seq, XANH } from './_obj-chung.mjs';

export const deck = { key: 'obj-03-3', code: 'OBJ 3.3', title: '3.3 — Signed URLs for private objects', sub: 'Chapter 3 · Lesson 3.3' };
const O = (k) => { const v = DU_LIEU[`n3-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const HET = bo(O('het'));
const [HET1, HET2] = [HET.split('$ node -e')[0].trim()
  .replace(/\$ u=\$\(node ky\.mjs paid\/course-5\/lesson-3\.pdf 5\);[^\n]*/, '$ u=$(node ky.mjs paid/course-5/lesson-3.pdf 5); …; bash goi.sh "$u"')
  .replace(/\$ u=\$\(node ky\.mjs paid\/course-5\/lesson-3\.pdf 300\);[^\n]*/, '$ bash goi.sh "${u/lesson-3/lesson-4}"   # one character changed'),
  '$ node -e "… getSignedUrl(…, { expiresIn: g }) for g of [604800, 604801] …"\n' + HET.split('\n').filter((l) => /^60480/.test(l)).join('\n')];
const TAI = O('tai');
const CUASO = O('cuaso');
const ROUTE = O('route').replace(/\$ u=\$\(curl[^\n]*/, '$ u=$(curl -s -b user=u42 localhost:20203/link/course-5/lesson-9 | …url); curl -s -o /dev/null -w … "$u"');
const XAU = O('xau').replace(/\$ u=\$\(node ky\.mjs[^\n]*/, '$ curl -s -r 0-99 -o /dev/null -w … "$u"   # a byte range on a signed URL');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.3', t: 'Signed URLs<br>for private objects', sub: 'Expiry, tampering, the 7-day ceiling, the entitlement route — and what a leaked link really gives away',
    en: 'Chapter three, lesson three: signed URLs for private objects. Expiry, tampering, the seven-day ceiling, the entitlement route, and what a leaked link really gives away.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Sign a private download — this repo's real function, measured</li>
    <li>Expired, tampered, unsigned: three different 403s</li>
    <li>Choosing a lifetime — and the 7-day ceiling</li>
    <li>The entitlement route: check first, sign second, never stream</li>
    <li>Fixed-window signing, filenames, and leaked links</li></ul>`,
    en: 'Takeaways: sign a private download with this repo\'s real function; three different four hundred threes; choosing a lifetime and the seven-day ceiling; the entitlement route; fixed-window signing, filenames and leaked links.' },
  { t: 'This repo\'s signing function', body: ts(`// src/config/r2.ts:322 — real code (old text: 600 s default, no filename)
export async function getSignedDownloadUrl(
  key: string, expiresInSeconds: number = 300, filename?: string,
) {
  const cmd = new GetObjectCommand({
    Bucket: config.r2.bucketName, Key: key,
    ...(filename ? {
      ResponseContentDisposition: \`attachment; filename="\${filename.replace(/[^\\w.-]/g, '_')}"\`,
    } : {}),
  });
  return sandboxReachable(key, await getSignedUrl(client, cmd, { expiresIn: expiresInSeconds }));
}`, { fs: 15 }) + two(box('What signing is', 'A <b>local</b> computation: HMAC-SHA256 with the secret key over method + bucket + key + expiry. No network call — the bucket only checks it later, when the URL is used.', 'lam'),
      box('Defaults that matter', '300 s by default — "long enough to click Download, short enough that a leaked link is useless". <code>filename</code> ⇒ the browser downloads instead of opening.', '')),
    en: 'This repo\'s real signing function: five minutes by default, not ten as the old text said, and an optional filename that turns the response into a download. Signing is a local computation; the bucket checks the signature only when the URL is used.' },
  { t: 'Measured: valid, unsigned, expired, tampered', body: tn(HET1, { fs: 14, wrap: 120 }) + cmp(['situation', 'answer', 'meaning'], [
      ['signed, within 5 s', '200 · 6,300 bytes', 'signature and clock both check out'],
      ['no signature at all', '403', 'the API endpoint always demands a signature'],
      ['same URL, 6 s later', '403 AccessDenied · <b>Request has expired</b>', 'the deadline is part of what was signed'],
      ['one character of the path changed', '403 <b>SignatureDoesNotMatch</b>', 'the signature covers the key'],
    ], { fs: 16, hl: [2, 3] }),
    en: 'Measured: within five seconds, two hundred. Without a signature, four hundred three. Six seconds later the same URL says request has expired. And changing one character of the path gives signature does not match: you cannot edit a signed URL into another file.' },
  { t: 'How long should it live?', body: tn(HET2, { fs: 17, wrap: 108 }) + cmp(['use', 'lifetime', 'in this repo'], [
      ['download right after a click', '2–10 min', 'getSignedDownloadUrl 300 s (Hub, class work) · 600 s (chat files, NDA, issue files) · 120 s for client-portal links'],
      ['image shown many times on a page', '≥ 60 min, fixed window', 'getSignedReadUrl: 90 min, window 30 min (slide 9)'],
      ['ffmpeg reads a just-uploaded video', '10 min', 'upload.routes.ts:411 — 600 s'],
      ['"share until Friday"', 'up to 7 days', 'SigV4 ceiling: 604,800 s — one second more and the SDK refuses'],
    ], { fs: 15 }),
    en: 'How long should it live? The SDK refuses anything over seven days, six hundred four thousand eight hundred seconds. This repo uses two to ten minutes for downloads, ninety minutes with a fixed window for images, and ten minutes for ffmpeg reading a fresh upload.' },
  { t: 'The entitlement route: check, sign, step aside', body: seq(['browser', 'your API', 'bucket'], [
      [0, 1, 'GET /link/course-5/lesson-9  (cookie)'], [1, 1, 'logged in? bought course-5?', '#7c3aed'], [1, 0, '200 { url: signed, 300 s }', '#1f8a3b'],
      [0, 2, 'GET signed URL — 5 MB straight from the bucket', '#2563eb'], [2, 0, '200 · 5,242,881 bytes', '#1f8a3b', true],
    ], { rh: 50, fs: 17 }) + tn(ROUTE.split('\n').filter((l) => !l.startsWith('$ ')).join('\n'), { fs: 15, wrap: 112 }),
    en: 'The entitlement route: the browser asks your API with its cookie; the API checks login and purchase, signs, and answers with a URL; the browser then downloads five megabytes straight from the bucket. Measured: four hundred thirty-eight bytes went through the server, against five point two million with a proxy.' },
  { t: 'In this repo: the real pattern', body: ts(`// src/services/hub.service.ts:623 — the check IS the query: the file must belong to this user
export async function getSignedFileUrl(userId: number, id: number) {
  const file = await prisma.hubFile.findFirst({
    where: { id, userId }, select: { key: true, name: true, mimeType: true },
  });
  if (!file) throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  const url = await getSignedDownloadUrl(file.key, 300, file.name);   // 5 min, downloads with its name
  return { url, mimeType: file.mimeType };
}`, { fs: 15 }) + two(box('Honest label', 'The old lesson showed a <code>downloadLesson</code> route at <code>/courses/:courseId/lessons/:lessonId/download</code> — illustrative: no such route exists here. The real callers: Hub files and shares, chat files, issue attachments, CRM NDA, class work, meeting recordings.', ''),
      box('Why 404, not 403', 'For a file that is not yours the API says "does not exist". A 403 would confirm the ID is real — one more thing an attacker can learn by counting.', 'lam')),
    en: 'The real pattern in this repo, in the Hub service: the permission check is the database query itself, the file must belong to this user, then it signs for five minutes with the file name. The downloadLesson route of the old text is illustrative; it does not exist here.' },
  { t: 'Filename: download, not open', body: tn(TAI, { fs: 15, wrap: 112 }) + two(box('What you see', 'No filename ⇒ no Content-Disposition ⇒ a PDF opens in the tab. With a filename the bucket adds <code>attachment</code>, because the signed request asked for it (<code>response-content-disposition</code> is inside the signature).', 'lam'),
      box('Finding (not fixed here)', 'r2.ts:331 replaces every non-ASCII character: "Đề thi cuối kỳ (bản 2).pdf" downloads as <b>___thi_cu_i_k___b_n_2_.pdf</b>. RFC 6266 allows <code>filename*=UTF-8\'\'&lt;percent-encoded&gt;</code> plus an ASCII fallback.', 'do2')),
    en: 'Filename: download instead of open. Without a filename, a PDF opens in the tab. With one, the bucket adds attachment, because the signed request asked for it. One finding: Vietnamese file names lose every accented letter. The standard filename-star form would keep them.' },
  { t: 'Signed URLs that a browser can cache', body: tn(CUASO, { fs: 17, wrap: 108 }) + two(box('The trick', '<code>getSignedReadUrl()</code> (r2.ts:350) passes <code>signingDate</code> rounded DOWN to 30 minutes and lives 90 minutes: every call inside one window returns the <b>same URL</b>, and it always has ≥ 60 minutes left.', 'lam'),
      box('Why', 'A fresh signature every second is a new URL every time (3.1) — the browser re-downloads every private image on every page view. Same URL ⇒ the browser cache works.', '')),
    en: 'Signed URLs a browser can cache. This repo\'s private reads sign with a time rounded down to thirty minutes and live ninety. Calls at ten oh five, ten twenty and ten twenty-nine give the same signature; at ten thirty-one a new one. Same URL means the browser cache works.' },
  { t: 'Real life, what-if, and the attacker\'s view', body: two(box('You have met this', '<ul><li>A Google Drive "anyone with the link" file — but signed URLs also EXPIRE.</li><li>An e-invoice email: "this download link is valid for 7 days".</li></ul>', 'lam'),
      box('What if… it is forwarded?', 'A signed URL is not tied to a person. Forward it into a group chat and every member can download — until it expires.', 'do2')) + tn(XAU, { fs: 15, wrap: 112 }) +
      box('Defend', 'Short lifetimes · sign per request (never store signed URLs in the DB) · never log full signed URLs · the URL shows the access key ID, never the secret.', 'do2'),
    en: 'Real life: a drive link anyone can open, an e-invoice link valid for seven days, a cinema ticket. A signed URL is not tied to a person: forwarded into a group chat, anyone downloads until it expires. Keep lifetimes short, sign per request, and never log full signed URLs.' },
  { t: 'Signed PUT: the other direction (Chapter 4)', body: ts(`// src/config/r2.ts:158 — the browser uploads straight to the bucket
const cmd = new PutObjectCommand({ Bucket, Key: key, ContentType: contentType });
return getSignedUrl(client, cmd, { expiresIn: 3600, signableHeaders: new Set(['content-type']) });
// the old text wrote new Set(['host', 'content-type']) — same result: SigV4 always signs host`, { fs: 17 }) +
      box('Why it gets its own chapter', 'Without <code>signableHeaders</code> only <code>host</code> is signed and a client can upload <code>text/html</code> under your image key: stored XSS on the media domain. Chapter 4 reproduces it — and 3.2 already showed this URL stores no Cache-Control.', 'do2') + cmp(['', 'signed GET (this lesson)', 'signed PUT (Chapter 4)'], [
      ['who sends the bytes', 'the bucket ⇒ the browser', 'the browser ⇒ the bucket'],
      ['lifetime in this repo', '120–600 s, or a 90-min window', '3,600 s (getSignedUploadUrl)'],
      ['what must be pinned', 'method + key + expiry (always)', '+ Content-Type via signableHeaders'],
      ['what goes wrong if careless', 'a leaked link works until expiry', 'any file type lands under your key'],
    ], { fs: 17 }),
    en: 'Signed PUT is the other direction: the browser uploads straight to the bucket. Without signing the content type, a client could upload HTML under an image key. Chapter four reproduces that bug.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Signed URL', 'URL + signature + expiry'), kw('expiresIn', 'lifetime in seconds, ≤ 604,800'), kw('Request has expired', 'the 403 after the deadline'), kw('SignatureDoesNotMatch', 'the URL was changed'),
      kw('Entitlement check', 'may THIS user have THIS file?'), kw('Direct fetch', 'bytes go bucket ⇒ browser, not via your server'), kw('Content-Disposition', 'attachment = download, with a filename'),
      kw('signingDate window', 'same URL for 30 min ⇒ cacheable'), kw('Bearer link', 'whoever holds it can use it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: signed URL, expiresIn, request has expired, signature does not match, entitlement check, direct fetch, Content-Disposition, the signing-date window, and bearer link.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Sign a 5-second GET for a private object; fetch it, wait, fetch again',
      'Change one character of a valid URL; read the &lt;Code&gt;',
      'Write a route: 401 without login, 403 without purchase, else { url }',
      'Count the bytes through your server: signed URL vs proxy',
      'Add a filename with Vietnamese accents; fix it with filename*',
    ]), box('Keep these', '<ul><li>Check first, sign second, step aside</li><li>Minutes, not days — max 7 days</li><li>Expired ≠ tampered: read &lt;Code&gt;</li><li>Fixed window ⇒ cacheable URL</li><li>Anyone holding the URL can use it</li></ul>', 'lam'), ''),
    en: 'Your turn: expire a signed URL, tamper with one, build the entitlement route, count the bytes, and fix a Vietnamese filename.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — URLs and caching', bai: '3.3 Signed URLs' }, S);
