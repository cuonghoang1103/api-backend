/**
 * node-10-2 — Node.js · Chapter 10 · Lesson 10.2 "Object storage and presigned URLs" (slide EN, đợt 8b — 01/11/2026).
 * MỘT deck, HAI tập: node-10-2 (slide 1–13) · node-10-2-2 (slide 14–28).
 *   A: vì sao không lưu đĩa máy chủ · bucket/key/object/metadata · không có mv (thật: "đổi tên" 120 MB = copy + delete) · phép đo 1 bề mặt API (thật, MinIO) ·
 *      bốn điều bỏ túi · bố trí key (keys.ts + chạy thật trên tên độc) · phép đo 2 giải phẫu URL (thật; SDK 3.1161 thêm checksum rỗng) · ba bước
 *   B: phép đo 3 đi vòng (thật) · URL là thông tin xác thực · phép đo 4 Content-Type (thật) + signableHeaders · phép đo 5 kích thước (thật) + POST policy (thật) ·
 *      phép đo 6 sửa key / hết hạn (thật) · mô hình tư duy · phép đo 7 stream xuyên (thật) · website này · sáu cách chết · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-10-2-object-storage-presigned. Output THẬT: that/c10/{s3-surface,key-layout,presign-*,stream-through} — MinIO cục bộ (container node10-minio,
 *   khoá GIẢ, 127.0.0.1:4690), @aws-sdk 3.1161.0. KHÔNG chạm bucket R2 thật.
 * Bổ sung ngoài web: "đổi tên" đo thật · SDK mặc định thêm x-amz-checksum-crc32 của thân RỖNG vào URL ký (requestChecksumCalculation) · presigned POST
 *   content-length-range đo thật (EntityTooLarge) · website này ĐÃ ký content-type (src/config/r2.ts, commit 60e28eafd) — web chưa nói.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-10-2', code: 'NODE 10.2', title: 'Object storage and presigned URLs', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c10/${ten}`, re);
const ms = (ten, re) => Number((R(ten, re).match(/:\s+([\d.]+) ms/) ?? [0, 'NaN'])[1]);

export const slides = lamDeck({ chuong: 'Chapter 10 — Uploads & object storage', bai: '10.2' }, [
  { cover: true, t: 'Object storage<br>and presigned URLs', sub: 'The upload your server never sees — and exactly what the signature does and does NOT protect.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Why "save it to the server's disk" breaks, and what object storage is instead</li>
<li>The whole S3 API surface you really use — measured on a local S3 server (MinIO)</li>
<li>Key layout as a design decision, run on hostile file names</li>
<li>A presigned URL taken apart, then used: 120 MB that never touches your API</li>
<li>Two measurements you normally only learn from an incident: Content-Type and size are NOT bound</li>
</ul>` + box('Sandbox, not production', 'Every number here comes from MinIO in Docker on this machine, with fake keys — the same S3 protocol Cloudflare R2 speaks. Never practise on a real bucket.', 'lam') },

  { t: 'Why not just the server\'s disk?', to: true, giua: true, body: cards([
    ['Two containers', 'The upload landed on container A. The next request for the file hits container B — 404.'],
    ['A redeploy', 'A new container starts from the image. Files written inside the old one are gone.'],
    ['A full volume', 'User files share the disk with PostgreSQL. When the disk fills, the database stops first.'],
  ], 3) + flow([{ t: 'API container 1', mau: LAM }, { t: 'object storage', s: 'one place, HTTP, near-infinite', mau: NODE }, { t: 'API container 2', mau: LAM }], { h: 130 }) +
    box('Everyday picture', 'Your desk drawer vs a parcel warehouse: the warehouse gives every parcel a label (the key), keeps a slip on it (metadata), and any courier with a valid ticket can fetch it.', 'xanh') },

  { t: 'It is not a file system — and that matters', to: true, giua: true, body: cards([
    ['Bucket', 'The container. One per project is common; it has a region, policies, and a bill.'],
    ['Key', 'The FULL name: images/post/u7/1753660000000-a1b2c3d4e5f6.jpg. The slashes are part of the name — no folders, only prefixes to list by.'],
    ['Object', 'Bytes + metadata. In practice immutable: you replace it, you do not edit it in place.'],
    ['Metadata', 'Content-Type, Cache-Control, ETag — stored WITH the object and returned as HTTP headers (lesson 10.4).'],
  ], 2) + box('Flat, HTTP-native, callable from a browser', 'Every operation is an HTTP request. That is why a browser can upload straight to it — the whole idea of this lesson.', 'lam') },

  { t: 'Two consequences — measured', to: true, giua: true, body: TT('c10/s3-surface', 11, 11, 'node s3-surface.mjs · there is no "mv" · real', { n: 104, sm: false }) +
    two(box('No rename', `Renaming = CopyObject + DeleteObject: a server-side copy of every byte (${ms('s3-surface', /^"rename"/)} ms for 120 MB here). Choose keys you never need to rename.`, 'cam'),
      box('No cheap "list the folder"', 'ListObjectsV2 with a prefix is a scan of keys. A layout that needs listing to find anything is a design you pay for monthly.', 'cam')) +
    TT('c10/s3-surface', 8, 10, 'prefixes are just string prefixes · real', { n: 104, sm: false }) },

  { t: 'Measurement 1 — the whole API you actually use', to: true, giua: true, body: JW(ma('c10/s3-surface', 5, 10).replace(/ +\/\/ local MinIO.*$/m, '   // local MinIO in Docker'), 96, [3, 5], { sm: false }) +
    J(`await s3.send(new PutObjectCommand({
  Bucket, Key: 'images/post/u7/1753660000000-a1b2c3d4e5f6.jpg',
  Body: photo, ContentType: 'image/jpeg',
  CacheControl: 'public, max-age=31536000, immutable',   // stored WITH the object (lesson 10.4)
}));`, { sm: false, hl: [3, 4] }) +
    box('Same code, different endpoint', 'Point endpoint at MinIO for practice, at https://&lt;account&gt;.r2.cloudflarestorage.com in production. forcePathStyle puts the bucket in the path.', 'lam') },

  { t: 'Measurement 1 — what came back', to: true, giua: true, body: TT('c10/s3-surface', 2, 10, 'node s3-surface.mjs · MinIO in Docker · a 6.5 MB photo · real', { hl: [1, 2, 3, 5, 6], n: 104, sm: false }) +
    box('Five calls cover almost every feature', 'Put, Head, Get (whole or a Range), List by prefix — plus Delete. Everything in this chapter is built from them.', 'lam') },

  { t: 'Four things to pocket', to: true, giua: true, body: cards([
    ['HeadObject is cheap', `${ms('s3-surface', /^HeadObject/)} ms, size + type, no body. That is how you confirm an upload really landed.`],
    ['Range works', `16 bytes in ${ms('s3-surface', /^GET Range/)} ms. A thumbnailer reads the head of a 120 MB video without downloading it.`],
    ['ETag = MD5 (single-part put)', 'The ETag above equals md5 of the file. A free integrity check — but only for one-shot uploads; multipart uploads get a different form.'],
    ['Missing key THROWS', 'HeadObject on a key that does not exist throws NotFound with HTTP 404 — not an empty result. try/catch is mandatory.'],
  ], 2) + TT('c10/s3-surface', 7, 7, 'real', { n: 104, sm: false }) },

  { t: 'Key layout is a design decision', to: true, giua: true, body: J(`// images/post/u7/1753660000000-a1b2c3d4e5f6.jpg
//   │      │    │        │             └── 6 random bytes (crypto) = 12 hex
//   │      │    │        └── Date.now()
//   │      │    └── u<userId> — the owner, checkable later
//   │      └── kind of content
//   └── family (images | audio | video | documents)
const filename = \`\${Date.now()}-\${randomBytes(6).toString('hex')}\${ext}\`;   // src/storage/keys.ts`, { sm: false, hl: [7] }) +
    cards([['Family prefix', 'Lifecycle rules and cost reports per family.'], ['u&lt;id&gt;', 'keyBelongsToUser() is one regex — no database query.'], ['Timestamp', 'Keys sort by time on their own.'], ['Random suffix', 'No collisions, and keys nobody can guess.']], 4) },

  { t: 'The same rules, on hostile file names', to: true, giua: true, body: TT('c10/key-layout', 2, 10, 'node key-layout.mjs · buildKey() + keyBelongsToUser() as in this website · real', { hl: [3, 4, 5], n: 104, sm: false }) +
    two(box('What is NOT in the key: the original name', 'Users\' file names carry ../, emoji, 300-character names — and sometimes the name of the person who sent them. Only the extension survives.', 'xanh'),
      box('The random part is the security model', 'For a PUBLIC bucket, an unguessable key is the only thing standing between a photo and anyone enumerating URLs.', 'cam')) },

  { t: 'Measurement 2 — a presigned URL, taken apart', to: true, giua: true, body: J("getSignedUrl(s3, new PutObjectCommand({ Bucket, Key }), { expiresIn: 3600 })", { sm: false }) +
    TT('c10/presign-anatomy', 17, 26, 'node presign-anatomy.mjs · real', { hl: [4, 7, 9], n: 104, sm: false }) +
    box('An ordinary S3 request, signed in advance', 'The signature moved into the query string. Whoever holds the URL can perform exactly that one operation until it expires. Remember the highlighted SignedHeaders = host.', 'lam') },

  { t: 'Two lines worth remembering — and one surprise', to: true, giua: true, body: two(
    box('X-Amz-SignedHeaders: host', 'The ONLY header this signature covers is host. Keep that in mind — it becomes the most expensive line of this lesson.', 'do2'),
    box('X-Amz-Content-Sha256: UNSIGNED-PAYLOAD', 'The body is not covered either. That is what lets a browser stream 120 MB — and what lets it send anything at all.', 'cam')) +
    TT('c10/presign-anatomy', 11, 13, 'the SAME call with the SDK default: two extra parameters · real', { hl: [2, 3], n: 104, sm: false }) +
    box('@aws-sdk 3.1161 adds a checksum of an EMPTY body', 'AAAAAA== is the CRC32 of zero bytes. MinIO ignored it; a service that checks it would reject the real upload. requestChecksumCalculation: \'WHEN_REQUIRED\' turns it off.', 'lam') },

  { t: 'The three-step upload', to: true, giua: true, body: flow([
    { t: '1 · ask your API', s: '"video.mp4, 118 MB"', mau: LAM }, { t: '2 · PUT to storage', s: 'browser → R2, direct', mau: NODE }, { t: '3 · "done"', s: 'API HEADs, then writes the row', mau: CAM }], { h: 150 }) +
    cards([
      ['Step 1', 'The server authenticates, builds the key, signs ONE PUT and returns the URL — a few hundred bytes, the file never touches it.'],
      ['Step 2', 'The browser sends the bytes straight to storage: no RAM, no bandwidth, no 100 MB Cloudflare body cap on your API.'],
      ['Step 3', 'The server calls HeadObject to check the object exists and how big it REALLY is, and only then records it.'],
    ], 3) + box('Next: part 2 measures every step', 'Does it really bypass the server? And what can a client do with the URL that you did not intend?', 'lam') },

  // ───────────── phần B ─────────────
  { t: 'Measurement 3 — it really goes around your server', to: true, giua: true, body: TT('c10/presign-direct', 2, 7, 'node presign-direct.mjs · a small Express API that only signs · real', { hl: [2, 5], n: 104, sm: false }) +
    flow([{ t: 'curl (the browser)', mau: LAM }, { t: 'Express API', s: `received ${R('presign-direct', /^bytes the API/).match(/total: (\d+)/)[1]} bytes in total`, mau: NODE }, { t: 'MinIO', s: '125,829,120 bytes', mau: CAM }], { h: 130 }) +
    box('Your server saw a JSON request of a few dozen bytes', 'The 120 MB went from the client straight to storage. The API\'s RSS moved by about 10 MB — the SDK warming up, not the file.', 'xanh') },

  { t: 'The URL IS the credential', to: true, giua: true, body: TT('c10/presign-direct', 7, 7, 'a signed GET URL, used from "another machine": plain curl, no keys, no cookies · real', { hl: [1], n: 104, sm: false }) +
    cards([
      ['Paste it in a chat…', '…and everyone in that chat can download the object for the rest of the expiry.'],
      ['Log it…', '…and your log files now hold working download links.'],
      ['Cache it in a page…', '…and the page outlives the signature: images 403 later (lesson 10.4).'],
    ], 3) + two(box('Short expiry, narrow scope', 'Minutes, not days. One key, one method. Treat a presigned URL like a password that happens to be a link.', 'cam'),
      box('Private files', 'Do not hand out long-lived GET URLs. Check permission on every view and redirect to a URL that lives for minutes (lesson 10.4).', 'xanh')) },

  { t: 'Measurement 4 — Content-Type is NOT bound', to: true, giua: true, body: J(`// the server signs a PUT "for a video":
getSignedUrl(s3, new PutObjectCommand({ Bucket, Key, ContentType: 'video/mp4' }), { expiresIn: 600 });
// the client uses that same URL, with another header:
// curl -X PUT -H 'Content-Type: text/html' --data-binary '<script>alert(document.cookie)</script>' "$URL"`, { sm: false, hl: [2, 4] }) +
    TT('c10/presign-ctype', 2, 3, 'node presign-ctype.mjs · real', { hl: [2], n: 104, sm: false }) +
    two(box('ContentType in the command is only a DEFAULT', 'It is not in SignedHeaders, so the signature does not care what the client sends.', 'do2'),
      box('Who can do this?', 'Anyone who opens DevTools during a normal upload, copies the URL, and replays it with curl. No stolen keys needed.', 'cam')) },

  { t: '39 bytes of HTML under a .mp4 key', to: true, giua: true, body: flow([
    { t: 'signed PUT', s: 'key …/a-clip.mp4', mau: LAM }, { t: 'client sends', s: 'Content-Type: text/html', mau: DO }, { t: 'storage keeps it', s: 'type = text/html', mau: DO }, { t: 'media domain', s: 'serves an HTML page', mau: DO }], { h: 140 }) +
    two(box('Stored XSS through the upload door', 'Chapter 9.2 spent a whole lesson on stored XSS. Here it walks in through a file — on YOUR media domain.', 'do2'),
      box('Why it is worse than it looks', 'Nothing in your API ever saw those bytes. No validation could have run.', 'cam')) +
    TT('c10/presign-ctype', 3, 3, 'what the storage now holds under video/u7/a-clip.mp4 · real', { hl: [1], n: 104, sm: false }) +
    box('How bad depends on serving — do not bet on it', 'Whether it runs depends on the domain, cookies, nosniff and Content-Disposition (lessons 10.3 and 10.4). Defence in depth means it should never be stored in the first place.', 'lam') },

  { t: 'The fix — one option', to: true, giua: true, body: J(`getSignedUrl(s3, new PutObjectCommand({ Bucket, Key, ContentType: 'video/mp4' }), {
  expiresIn: 600,
  signableHeaders: new Set(['content-type']),   // ← the header becomes part of the signature
});`, { sm: false, hl: [3] }) +
    TT('c10/presign-ctype', 5, 7, 'node presign-ctype.mjs · same attack after the fix · real', { hl: [2, 3], n: 104, sm: false }) +
    box('The browser must send the identical value', 'Content-Type in the PUT must equal what was signed, or it gets 403 too — so take it from the same file.type you sent at step 1.', 'lam') },

  { t: 'Measurement 5 — size is not bound either', to: true, giua: true, body: TT('c10/presign-size', 2, 2, 'node presign-size.mjs · the client declared 5 MB when asking for the signature · real', { hl: [1], n: 104, sm: false }) +
    box('A presigned PUT carries no size ceiling', 'The declared size is an input to YOUR check before signing — not an input to the signature. The client can send 120 MB to a "5 MB" URL.', 'do2') +
    two(box('Defence A — check afterwards', 'At step 3, HeadObject the real size; too big ⇒ delete it and refuse. What this website does.', 'xanh'),
      box('Defence B — a presigned POST policy', 'A POST form policy can carry content-length-range, which the STORAGE enforces before accepting anything.', 'xanh')) },

  { t: 'Both defences, measured', to: true, giua: true, body: TT('c10/presign-size', 3, 6, 'node presign-size.mjs · real', { hl: [1, 2, 3], n: 104, sm: false }) +
    J(`const { url, fields } = await createPresignedPost(s3, {
  Bucket, Key, Expires: 600,
  Conditions: [['content-length-range', 0, 5 * 1024 * 1024]],   // enforced by the storage
});   // the browser sends a multipart form: ...fields + file`, { sm: false, hl: [3] }) +
    box('Have both', 'The policy stops most of it at the door; the HEAD check is your last word before a row is written.', 'lam') },

  { t: 'Measurement 6 — what the signature DOES protect', to: true, giua: true, body: TT('c10/presign-tamper', 2, 8, 'node presign-tamper.mjs · real', { hl: [2, 8, 9], n: 96, sm: false }) +
    two(box('Change the key → SignatureDoesNotMatch', 'The key is inside the signed string. Pointing the URL at someone else\'s path breaks the signature.', 'xanh'),
      box('Use it late → Request has expired', 'Signed with expiresIn: 5. Right away: 206. Seven seconds later: 403.', 'xanh')) },

  { t: 'The mental model to keep', to: true, giua: true, body: bang(['part of the request', 'covered by the signature?', 'measured'], [
    ['method (PUT / GET)', '✓ yes', 'a PUT URL cannot DELETE'],
    ['bucket + key', '✓ yes', 'changed key → 403 SignatureDoesNotMatch'],
    ['expiry', '✓ yes', '7 s after a 5 s URL → 403 Request has expired'],
    ['Content-Type', '✗ only if signableHeaders', 'text/html → 200; after the fix → 403'],
    ['body / size', '✗ never', '120 MB into a "5 MB" URL → 200'],
  ], { co: 23, hl: [3, 4] }) + box('One sentence', 'Method, key and deadline are signed; the body, its size, and every header you did not name are not.', 'lam') },

  { t: 'Measurement 7 — when you must stream THROUGH', to: true, giua: true, body: J(`bb.on('file', async (_name, file) => {             // busboy gives the file part as a stream
  const uploader = new Upload({                      // @aws-sdk/lib-storage
    client: s3,
    params: { Bucket, Key, Body: file, ContentType: 'video/mp4' },
    queueSize: 4, partSize: 8 * 1024 * 1024,         // 4 parts of 8 MB in flight
  });
  await uploader.done();
});`, { sm: false, hl: [4, 5] }) +
    TT('c10/stream-through', 2, 3, 'node stream-through.mjs · fresh process each · real', { hl: [2], n: 104, sm: false }) +
    box('Same object, a fraction of the memory', 'Sometimes you cannot presign (you must inspect bytes, or the client cannot make a second request). 120 MB ÷ 8 MB = 15 parts; the first parts upload while the last bytes are still arriving.', 'lam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: flow([
    { t: '/presign-r2', s: 'auth · video/* · buildKey', mau: LAM }, { t: 'PUT to R2', s: 'host + content-type signed', mau: NODE }, { t: '/complete', s: 'key regex · HEAD · size', mau: CAM }, { t: 'PendingUpload', s: '24 h · cron sweeps', mau: LAM }], { h: 140, fs: 19 }) +
    JW(`// src/config/r2.ts — getSignedUploadUrl()
return getSignedUrl(client, cmd, { expiresIn: expiresInSeconds, signableHeaders: new Set(['content-type']) });
// src/routes/upload.routes.ts — /presign-r2/complete
if (head.size > config.maxFileSizeVideo) {
  // Guard against a client uploading more than it declared at presign.`, 92, [2, 5], { sm: false }) +
    box('Both lessons of this deck, already in the code', 'Content-Type is signed, and the real size is re-checked after upload. Images, audio and documents still take the normal multipart road. The bucket needs a CORS rule allowing PUT from the site — the one piece of config outside the code.', 'xanh') },

  { t: 'Six ways presigned uploads die in real life', to: true, giua: true, body: cards([
    ['No CORS rule on the bucket', 'The browser preflight fails: a vague "Network Error" while storage logs show nothing wrong. curl works, the browser does not.'],
    ['Expiry too long', 'A one-week URL in a message is a public file for a week.'],
    ['Expiry too short', 'The signature is checked when the request STARTS, but a 15-minute URL for a 20-minute mobile upload is a race worth avoiding.'],
    ['Clock skew', 'A server 20 minutes off signs URLs that are already expired. The error is still AccessDenied.'],
    ['Trusting "complete"', 'Without HeadObject, a client can skip the upload and still get a database row pointing at nothing.'],
    ['An over-powered key', 'Signing with a key that can write the whole bucket. R2 and S3 both support tokens scoped to a prefix.'],
  ], 3) },

  { t: 'Exercise', to: true, giua: true, body: J(`app.post('/avatar/presign', requireAuth, async (req, res) => {
  const Key = \`avatars/\${req.body.filename}\`;
  const cmd = new PutObjectCommand({ Bucket, Key, ContentType: 'image/webp' });
  res.json({ Key, url: await getSignedUrl(s3, cmd, { expiresIn: 7 * 24 * 3600 }) });
});
app.post('/avatar/complete', requireAuth, async (req, res) => {
  await db.user.update({ where: { id: req.user.id }, data: { avatarKey: req.body.key } });
  res.json({ ok: true });
});`, { sm: false, hl: [2, 4, 7] }) +
    box('Exercise', 'Find four problems in this avatar upload; fix each with a measurement from this lesson.', '') +
    `<div data-k="dapan">${box('Answer', 'L2: the user\'s file name builds the key → buildKey (u&lt;id&gt; + random). L4: Content-Type unsigned → signableHeaders; 7-day expiry → minutes. L7: trusts "complete" → HeadObject, check owner, real size and type, then save.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why is "rename" expensive in object storage?</li>
<li>What does X-Amz-SignedHeaders: host tell you?</li>
<li>Name the three things a presigned PUT signature covers.</li>
<li>Name two things it does NOT cover, and the fix for each.</li>
<li>Why must /complete call HeadObject?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. There is no mv: it is a full server-side copy plus a delete. &nbsp;2. Only the host header is signed — Content-Type and the rest are free. &nbsp;3. Method, bucket + key, expiry. &nbsp;4. Content-Type → signableHeaders; size → HEAD check or a POST policy. &nbsp;5. To prove the object exists and to read its REAL size and type.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Object storage: bucket + key + bytes + metadata; flat, HTTP, no rename, listing is a scan</li>
<li>Keys: family / u&lt;id&gt; / timestamp-random.ext — never the user's file name</li>
<li>Presigned URL = one operation, pre-signed; the URL is the credential; 120 MB never touched the API</li>
<li>Signed: method, key, expiry. NOT signed: body, size, unnamed headers ⇒ signableHeaders + HEAD check / POST policy</li>
</ul>` + box('Next: lesson 10.3', 'Never trust the file: a PHP shell renamed .png, a GIF that is also HTML, and a 758 KB PNG that eats ~190 MB of RAM.', 'lam') },
]);
