/**
 * node-10-4 — Node.js · Chapter 10 · Lesson 10.4 "Serving media back: formats, caching and the CDN" (slide EN, đợt 8b — 01/11/2026).
 * MỘT deck, HAI tập: node-10-4 (slide 1–12) · node-10-4-2 (slide 13–25).
 *   A: tải lên một lần, đọc nghìn lần · phép đo 1 định dạng × cỡ (thật, sharp 0.35.5, ảnh tự tạo mượt + nhiễu, trung vị 3 lần) · ba cách đọc · hình hài thực tế ·
 *      phép đo 2 header production (curl media.cuongthai.com — object CÓ SẴN, chỉ đọc) · cache-control từng chữ · bẫy HEAD ⇒ DYNAMIC, GET ⇒ HIT, age tăng · cách kiểm CDN
 *   B: phép đo 3 304 / 206 / 404 (thật, production) · Range cho video · phép đo 4 proxy (thật, MinIO: đệm / stream / 302, tuần tự + 10 cùng lúc) ·
 *      ba cách phục vụ theo độ riêng tư · xoá: ba chỗ rò (thật: quét mồ côi + deleteByUrl) · thứ tự xoá · website này · sáu cách sai · bài tập · tự kiểm · tóm tắt chương
 * Nguồn: nodejs-10-4-phuc-vu-media-cache. Output THẬT: that/c10/{formats,prod-headers,proxy-cost,orphans}.
 * Khác web: ảnh nguồn tự tạo (mượt 142,1 KB, nhiễu 6 654,4 KB) ⇒ WebP thắng JPEG 2,8× (mượt) và chỉ 1,17× (nhiễu) — web: 2,25× và thua nhẹ;
 *   header 01/11: content-length 181 430, etag khác (ảnh bìa sinh lại 01/10); GET thứ nhất age 26 → 33 sau 7 s (web: 27 107); proxy: tuần tự RSS như nhau,
 *   10 cùng lúc đệm +204 MB / stream +37 / 302 +1,7 (web chỉ đo tuần tự). Bổ sung: website stream NHẠC qua API có chủ đích (CORS cho visualizer, có Range).
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong, vsd, ra } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-10-4', code: 'NODE 10.4', title: 'Serving media back: formats, caching and the CDN', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c10/${ten}`, re);
const kb = (re) => Number(R('formats', re).match(/([\d.]+) KB/)[1]);
const pr = (re, k) => Number(R('proxy-cost', re).match(k)[1]);
const BUF10 = pr(/^proxy, buffer/, /10 at once API RSS \+\s*([\d.]+)/), STR10 = pr(/^proxy, stream/, /10 at once API RSS \+\s*([\d.]+)/), RED10 = pr(/^302/, /10 at once API RSS \+\s*([\d.]+)/);
const FL = ra('c10/formats').split('\n'), gi = FL.findIndex((l) => l.startsWith('### grainy'));
const pick = (lines, re) => Number(lines.find((l) => re.test(l)).match(/([\d.]+) KB/)[1]);
const SM = { jpeg: pick(FL.slice(0, gi), /^  jpeg/), webp: pick(FL.slice(0, gi), /^  webp q80 @1200/) };
const GR = { jpeg: pick(FL.slice(gi), /^  jpeg/), webp: pick(FL.slice(gi), /^  webp q80 @1200/), avif: pick(FL.slice(gi), /^  avif/) };

export const slides = lamDeck({ chuong: 'Chapter 10 — Uploads & object storage', bai: '10.4' }, [
  { cover: true, t: 'Serving media back:<br>formats, caching<br>and the CDN', sub: 'Uploaded once, read thousands of times — the read path is where the bill arrives.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What resizing and the choice of JPEG / WebP / AVIF are worth, in bytes and milliseconds</li>
<li>The cache headers this website really serves on production — read line by line</li>
<li>The curl -I trap that makes every CDN look broken, and the right way to check</li>
<li>What 304 and 206 buy you, and what proxying media through your API costs</li>
<li>The part everyone forgets: deleting — orphans found and swept for real</li>
</ul>` + box('Why it matters to you', 'Every decision so far — the key, the format you re-encode to, the metadata — was really a decision about the READ path. This is where it is paid for, thousands of times per upload.', 'lam') },

  { t: 'Uploaded once, read thousands of times', to: true, giua: true, body: flow([
    { t: 'upload', s: 'once', mau: LAM }, { t: 're-encode + key', s: 'lessons 10.1–10.3', mau: CAM }, { t: 'storage', s: 'stored once', mau: NODE }, { t: 'CDN edge', s: 'copies near users', mau: LAM }, { t: 'readers', s: '× thousands', mau: DO }], { h: 140 }) +
    cards([
      ['Bytes per view', 'Format and size decide how much every single view downloads.'],
      ['Views per byte', 'Cache headers decide how often a view has to download at all.'],
      ['Who pays', 'Serve from the CDN and your server pays nothing; proxy through your API and it pays every time.'],
    ], 3) + box('Everyday picture', 'Printing a flyer once vs photocopying it for every passer-by. Make the flyer small, put copies in every shop window, and never hand-copy it at your desk.', 'xanh') },

  { t: 'Measurement 1 — format and size', to: true, giua: true, body: J(ma('c10/formats', 5, 10), { sm: false, hl: [2, 3, 4] }) +
    two(box('Same source, five outputs', 'A 4032×3024 image (a typical phone photo size) through sharp. Each line is the median of three runs.', 'lam'),
      box('Two sources on purpose', 'A smooth image (a sky gradient) and the same scene with sensor-like noise — because the answer is not the same for both.', 'cam')) +
    T(ra('c10/formats', 2, 2) + '\n' + ra('c10/formats', 8, 8), 'the two sources · both made by us, no real photo of anyone · real', { sm: false }) },

  { t: 'A smooth image', to: true, giua: true, body: TT('c10/formats', 2, 7, 'node formats.mjs · sharp 0.35.5 · median of 3 · real', { hl: [2, 3, 4], n: 104, sm: false }) +
    thanh([['jpeg @1200', kb(/^  jpeg/), CAM, `${kb(/^  jpeg/)} KB`], ['webp @1200', SM.webp, NODE, `${SM.webp} KB`], ['avif @1200', kb(/^  avif/), NODE, `${kb(/^  avif/)} KB`], ['webp @400', kb(/^  webp q80 @400/), LAM, `${kb(/^  webp q80 @400/)} KB`]], { ghi: 'output size, smooth source · real' }) },

  { t: 'A grainy image — the same scene plus noise', to: true, giua: true, body: TT('c10/formats', 8, 13, 'node formats.mjs · same pipelines · real', { hl: [2, 3, 4], n: 104, sm: false }) +
    thanh([['jpeg @1200', GR.jpeg, CAM, `${GR.jpeg} KB`], ['webp @1200', GR.webp, CAM, `${GR.webp} KB`], ['avif @1200', GR.avif, NODE, `${GR.avif} KB`]], { ghi: 'output size, grainy source · real' }) +
    box('Noise is information', 'An encoder has to spend bytes on every grain. Here WebP only beat JPEG by about a sixth.', 'lam') },

  { t: 'Three honest readings', to: true, giua: true, body: cards([
    ['1 · Resizing dominates', 'Down to 1200 px wide, 88% (smooth) to 98% (grainy) of the bytes are gone before the format even matters. At 400 px almost nothing is left.'],
    ['2 · WebP is not a law', `On the smooth image WebP beat JPEG ${(SM.jpeg / SM.webp).toFixed(1)}×; on the grainy one only ${(GR.jpeg / GR.webp).toFixed(2)}×. "WebP is 30% smaller" is an average, not a rule.`],
    ['3 · AVIF: smaller, slower', 'Smallest every time — and 4–7× slower to encode than JPEG here. Fine in a background job, painful inside a request handler.'],
  ], 3) + thanh(['jpeg', 'webp', 'avif'].map((f, i) => { const ms = Number(FL.slice(gi).find((l) => l.startsWith(`  ${f} q`)).match(/KB\s+(\d+) ms/)[1]); return [`${f} @1200`, ms, [CAM, CAM, DO][i], `${ms} ms`]; }), { ghi: 'encode time, grainy source, median of 3 · real' }) },

  { t: 'The practical shape', to: true, giua: true, body: flow([
    { t: 'one upload', s: 'decoded once', mau: LAM }, { t: '1200 px', s: 'display size', mau: NODE }, { t: '400 px', s: 'lists, avatars', mau: NODE }, { t: '32 px', s: '0.1 KB blurred placeholder', mau: CAM }], { h: 140 }) +
    cards([['A standard size', 'What a post or a page shows.'], ['A small size', 'Grids, feeds, avatars — where 1200 px is pure waste.'], ['A tiny blur', 'Shown instantly, stretched and blurred, while the real image loads.']], 3) +
    box('This website today', 'One size: max width 1200, WebP q80, made at upload (lesson 10.3). Extra sizes are the next step, and they belong in a background job — not in the upload request.', 'lam') },

  { t: 'Measurement 2 — what this site really serves', to: true, giua: true, body: J('curl -sI https://media.cuongthai.com/images/course-covers/nodejs.png', { sm: false }) +
    TT('c10/prod-headers', 2, 10, 'production, 01/11/2026 · an object that already exists (a course cover) · real', { hl: [7], n: 104, sm: false }) +
    box('Read cache-control first', 'The whole strategy is in that one line. The next slide takes it word by word.', 'lam') },

  { t: 'cache-control, word by word', to: true, giua: true, body: bang(['word', 'means', 'effect'], [
    ['public', 'every cache layer may store it', 'browser, CDN, any proxy'],
    ['max-age=31536000', 'fresh for one year (in seconds)', 'no trip to the server for a year'],
    ['immutable', 'do not even revalidate', 'a repeat view costs 0 bytes of network'],
  ], { co: 25, hl: [2] }) + two(box('Safe ONLY because of the key layout', 'Keys carry a timestamp and random bytes (lesson 10.2): a changed image is a NEW key, never an edited object.', 'xanh'),
    box('One decision, said twice', 'Content-addressed keys and the immutable flag are the same decision. Reuse a key and immutable becomes a year-long bug.', 'cam')) +
    J("new PutObjectCommand({ Bucket, Key, Body, ContentType: 'image/webp',\n  CacheControl: 'public, max-age=31536000, immutable' })   // set ONCE, at upload — stored with the object", { sm: false, hl: [2] }) },

  { t: 'The trap: curl -I says DYNAMIC', to: true, giua: true, body: TT('c10/prod-headers', 11, 20, 'HEAD, then GET twice, seven seconds apart · production · real', { hl: [2, 6, 7, 11, 12], n: 104, sm: false }) +
    two(box('HEAD → DYNAMIC', 'Cloudflare does not answer a HEAD from the edge cache the way it answers GET, so cf-cache-status says DYNAMIC even when the object IS cached.', 'do2'),
      box('GET → HIT, and age keeps counting', 'age is how long the edge copy has existed, in seconds. 7 seconds later it is 7 higher. A cold cache cannot fake that.', 'xanh')) },

  { t: 'How to check a CDN — properly', to: true, giua: true, body: vsd(
    J('curl -I "$URL"     # sends HEAD', { sm: false }) + '<p style="font-size:21px">Sends HEAD. The status lies about the edge cache — the cause of half the "my CDN is broken" posts on the internet.</p>',
    J('curl -s -o /dev/null -D - "$URL"     # a real GET', { sm: false }) + '<p style="font-size:21px">A real GET whose body you throw away. Read cf-cache-status AND age.</p>',
    '✗ curl -I', '✓ GET, body discarded') +
    two(box('The measurement was broken, not the cache', 'The first reading of these headers was wrong. Always ask: is my measuring tool doing what the real user does?', 'cam'),
      box('Real users send GET', 'Browsers fetch images, video and scripts with GET. Test with the same method, or you are testing a different code path.', 'lam')) +
    flow([{ t: 'curl -I', s: 'HEAD → DYNAMIC', mau: DO }, { t: 'curl -D - (GET)', s: 'HIT, age 26', mau: NODE }, { t: '7 s later', s: 'HIT, age 33', mau: NODE }], { h: 120 }) },

  // ───────────── phần B ─────────────
  { t: 'Measurement 3 — what the headers buy, in bytes', to: true, giua: true, body: TT('c10/prod-headers', 21, 26, 'production · conditional GET, range GET, missing key · real', { hl: [4, 7, 10], n: 104, sm: false }) +
    cards([['304 Not Modified', 'If-None-Match with the ETag: one round trip, 0 bytes of body.'], ['206 Partial Content', 'Range: bytes=0-99 → exactly 100 bytes.'], ['404', 'A key that does not exist.']], 3) },

  { t: '206 is what makes a video seekable', to: true, giua: true, body: flow([
    { t: 'user drags to 3:20', mau: LAM }, { t: 'browser', s: 'Range: bytes=41000000-…', mau: CAM }, { t: 'storage / CDN', s: '206 + those bytes only', mau: NODE }, { t: 'plays at 3:20', s: 'no full download', mau: NODE }], { h: 140 }) +
    two(box('accept-ranges: bytes', 'The header in measurement 2 that announces it. Storage and CDNs implement it for you.', 'xanh'),
      box('If you ever proxy media yourself', 'You must implement Range — or seeking silently breaks, and it looks like a broken player, not a broken server.', 'do2')) +
    TT('c10/prod-headers', 23, 24, 'the same request, measured on production · real', { hl: [3], n: 104, sm: false }) },

  { t: 'Measurement 4 — proxying media through your API', to: true, giua: true, body: J(ma('c10/proxy-cost', 25, 34).replace(/^  /gm, ''), { sm: false, hl: [3, 4, 7, 9] }) +
    TT('c10/proxy-cost', 2, 4, 'node proxy-cost.mjs · a 6.5 MB object in MinIO · fresh process per measurement · real', { hl: [1, 2, 5, 6], n: 104, sm: false }) },

  { t: 'The same numbers, drawn to scale', to: true, giua: true, body: thanh([
    ['buffer, 10 at once', BUF10, DO, `+${BUF10} MB`], ['stream, 10 at once', STR10, CAM, `+${STR10} MB`], ['302, 10 at once', RED10, NODE, `+${RED10} MB`]], { ghi: 'added API RSS while 10 clients download the same 6.5 MB object · real' }) +
    two(box('Twenty in a row', 'Buffer vs stream: the same RSS, stream ~22% faster. Sequential traffic hides the problem.', 'lam'),
      box('Ten at once', 'Buffering multiplies: every request holds a whole copy. Streaming holds chunks. The redirect holds nothing.', 'cam')) +
    box('And the bandwidth', 'Both proxies pushed 130 MB through the API for 20 downloads; the 302 version, 8,200 bytes. Your VPS bandwidth is the most expensive CDN you will ever use.', 'do2') },

  { t: 'Three ways to serve — chosen by privacy', to: true, giua: true, body: cards([
    ['Public', 'A direct URL on the media domain + immutable. Your server takes part in no read at all.'],
    ['Private, short-lived', 'The API checks permission, then 302 to a presigned URL valid for minutes. Not cacheable at the CDN, but no bytes through you.'],
    ['Private, checked on every byte', 'A streaming proxy with a permission check — the most expensive; for invoices and sensitive documents, not feed photos.'],
  ], 3) + JW(`app.get('/files/:id', requireAuth, async (req, res) => {
  const file = await loadFileIfAllowed(req.user, req.params.id);      // 404 if not yours
  res.redirect(302, await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key: file.key }), { expiresIn: 300 }));
});`, 96, [3], { sm: false }) },

  { t: 'The part everyone forgets: deleting', to: true, giua: true, body: cards([
    ['Delete the row, forget the object', 'Storage has no foreign keys. The object stays, billed, forever.'],
    ['Upload, then abandon', 'The video finished uploading; the user closed the tab. No row references it — hence a "pending upload" table with a deadline.'],
    ['Replace an avatar', 'New avatar = new key. The old key is an orphan unless the update path deletes it.'],
  ], 3) + flow([{ t: 'delete the OBJECT first', mau: NODE }, { t: 'then the row', mau: NODE }, { t: 'row delete fails?', s: 'a file a sweep can find', mau: CAM }], { h: 120 }) +
    box('Why object first', 'The other order leaves a row pointing at nothing — a broken image in the UI. Object first leaves, at worst, a file the cleanup job can find.', 'lam') },

  { t: 'Orphans, found and swept — measured', to: true, giua: true, body: TT('c10/orphans', 2, 7, 'node orphans.mjs · the three leaks reproduced in MinIO, then a sweep · real', { hl: [1, 5], n: 104, sm: false }) +
    J(`const referenced = new Set([...db.users.values(), ...db.posts.values()]);
const orphans = (await listAll('demo/')).filter((o) => !referenced.has(o.Key));   // storage minus rows`, { sm: false, hl: [2] }) +
    box('A sweep is "everything in the bucket minus everything a row points at"', 'It needs a list of the bucket (a scan, lesson 10.2) — so run it at night, per prefix, and only delete what is old enough.', 'lam') },

  { t: 'deleteByUrl — the careful version', to: true, giua: true, body: TT('c10/orphans', 8, 9, 'node orphans.mjs · real', { hl: [2], n: 104, sm: false }) +
    cards([['Map URL → key', 'Strip the media base URL to get the key back.'], ['Skip foreign URLs', 'A YouTube thumbnail is not yours to delete.'], ['Log, do not throw', 'A failed delete is a leak to sweep later — never an error shown to the user.']], 3) +
    box('Same rules as this website', 'deleteByUrl() / deleteByUrls() in uploadService do exactly these three things.', 'xanh') +
    J(`const keyFromUrl = (url) => (url?.startsWith(MEDIA_BASE) ? url.slice(MEDIA_BASE.length) : null);
if (!key) return;   // not our media — skip, never throw`, { sm: false, hl: [2] }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: cards([
    ['media.cuongthai.com', 'A custom domain on R2. Images are direct URLs — the backend never streams an image.'],
    ['CSP img-src is an allow-list', 'An image on another CDN silently does not show — why course covers are generated INTO R2.'],
    ['PendingUpload + nightly cron', 'Presigned videos get a 24-hour row; CONFIRMED when the post exists, swept otherwise.'],
  ], 3) + J(`// frontend/src/lib/utils.ts — getMediaUrl(): a scar from a real bug
if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;   // optimistic previews are already URLs`, { sm: false, hl: [2] }) +
    two(box('Without that line', 'A preview from URL.createObjectURL() got the CDN prefix: https://&lt;r2&gt;/blob:https://… → 400 for every upload in progress.', 'do2'),
      box('One deliberate proxy', 'Music streams through /api/v1/music/stream/:id — for CORS of the Web Audio visualizer — and it implements Range (206). One extra hop per play, chosen on purpose.', 'lam')) },

  { t: 'Six ways the read path goes wrong', to: true, giua: true, body: cards([
    ['No Cache-Control on the object', 'Caches guess: sometimes stale, mostly re-downloaded. Set it at PutObject — it is stored with the object.'],
    ['immutable on a mutable key', 'avatars/u7.jpg overwritten in place: users see the old avatar for a year, and reload does nothing.'],
    ['Presigned URLs in cached HTML', 'The page outlives the signature, and images 403 later.'],
    ['User files on the MAIN domain', 'A stored HTML file runs on the origin that holds your cookies. A separate media domain turns that into a nuisance.'],
    ['No Content-Disposition: attachment', 'A PDF meant for download opens inline — and an HTML file that slipped through renders.'],
    ['A proxy without Range', 'Video seeking stops working; it looks like a broken player.'],
  ], 3) },

  { t: 'Exercise', to: true, giua: true, body: J(`app.get('/avatars/:userId', async (req, res) => {
  const g = await s3.send(new GetObjectCommand({ Bucket, Key: \`avatars/u\${req.params.userId}.jpg\` }));
  const buf = Buffer.from(await g.Body.transformToByteArray());
  res.set('Cache-Control', 'public, max-age=31536000, immutable').type('image/jpeg').send(buf);
});
// on avatar change: PutObject to the SAME key avatars/u<id>.jpg`, { sm: false, hl: [2, 3, 4, 6] }) +
    box('Exercise', 'Public avatars, served like this. Find three problems and redesign the read path in two sentences.', '') +
    `<div data-k="dapan">${box('Answer', 'A mutable key + immutable ⇒ a year of stale avatars; buffering through the API ⇒ RAM and bandwidth per view (+204 MB at 10 at once). Redesign: a new key per upload (buildKey), store the URL in the row, serve it directly from the media domain with immutable — and delete the old key when it changes.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>What saves more bytes: resizing to 1200 px, or switching JPEG to WebP?</li>
<li>Why is immutable safe on this site's media?</li>
<li>Why can curl -I not tell you whether the CDN cached an object?</li>
<li>Which three ways to serve media exist, and when do you use each?</li>
<li>When deleting, why remove the object before the row?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Resizing, by far (88–98% gone before the format matters). &nbsp;2. Every change is a new key; no object is ever edited. &nbsp;3. It sends HEAD, which Cloudflare reports as DYNAMIC; use a GET and read age. &nbsp;4. Public direct URL; private 302 to a short presigned URL; streaming proxy for sensitive files. &nbsp;5. The reverse leaves a row pointing at nothing; this way leaves at worst a sweepable file.', 'xanh')}</div>` },

  { t: 'Chapter 10 in one slide', to: true, giua: true, body: `<ul>
<li>10.1 Receiving: multipart; base64 +33%; memoryStorage ≈ 2× the file; stream big files; limit everything</li>
<li>10.2 Storing: object storage + presigned URLs; signed = method, key, expiry — NOT body, size, unsigned headers</li>
<li>10.3 Checking: names and types are claims; decode, re-encode, store the output; pixel budget; strip EXIF</li>
<li>10.4 Serving: resize first; immutable + new key per change; GET (not HEAD) to check the CDN; never proxy public media; delete on purpose</li>
</ul>` + box('Next: chapter 11', 'Realtime with WebSocket and Socket.IO — the server starts talking without being asked.', 'lam') },
]);
