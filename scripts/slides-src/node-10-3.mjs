/**
 * node-10-3 — Node.js · Chapter 10 · Lesson 10.3 "Never trust the file: magic bytes, polyglots and bombs" (slide EN, đợt 8b — 01/11/2026).
 * MỘT deck, HAI tập: node-10-3 (slide 1–11) · node-10-3-2 (slide 12–25).
 *   A: ba bề mặt tấn công · ba lời khai (filename, đuôi, Content-Type) · phép đo 1 năm tệp × ba lớp kiểm qua multer thật (curl ;type=) · 16 byte đầu ·
 *      mã ba lớp kiểm · phép đo 2 file lai GIF+HTML (thật: file-type = image/gif, sharp ném) · giải mã mới là phép kiểm · SVG bị chặn do tình cờ · bảng phần 1
 *   B: phép đo 3 ảnh thật + payload (thật: file-type jpeg, re-encode xoá) · re-encode = kiểm + tối ưu · phép đo 4 bom (thật) · vì sao 758 KB = 256 triệu điểm ·
 *      8 bom cùng lúc vs 8 ảnh thật (thật) · hạn mức điểm ảnh + hàng đợi · phép đo 5 EXIF (thật, ảnh tự tạo, toạ độ Hồ Gươm — nơi công cộng) ·
 *      nội dung sống · website này · sáu lỗi · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-10-3-kiem-file-that. Output THẬT: that/c10/{three-checks,polyglot,payload-jpeg,bomb,exif} (sharp 0.35.5, file-type 22.3.0, exifr 7.1.3, multer 2.5.0).
 * Khác web: bom 1 +190 MB (web +99), 8 bom +889 MB (web +445), 8 ảnh thật +112 MB (web +17) ⇒ tỉ lệ ~8× (web 26×) — máy/phiên bản khác, kích thước bom TRÙNG
 *   (758,0 KB / 1183,1 KB). Ảnh re-encode 90,6 KB (ảnh nhiễu tự tạo). Web nói website "vẫn để limitInputPixels mặc định" — SAI từ 28/07/2026
 *   (imageOptimizer.ts: MAX_INPUT_PIXELS = 100_000_000 + tối đa 4 ảnh giải mã cùng lúc) ⇒ đã sửa bài web.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-10-3', code: 'NODE 10.3', title: 'Never trust the file: magic bytes, polyglots and bombs', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c10/${ten}`, re);
const plus = (s) => Number((s.match(/\(\+(\d+) MB\)/) ?? [0, 'NaN'])[1]);
const BOM1 = plus(R('bomb', /sharp DEFAULT: processed/)), BOM8 = plus(R('bomb', /^8 bombs/)), PHOTO8 = plus(R('bomb', /^8 REAL/));

export const slides = lamDeck({ chuong: 'Chapter 10 — Uploads & object storage', bai: '10.3' }, [
  { cover: true, t: 'Never trust the file:<br>magic bytes, polyglots<br>and bombs', sub: 'A PHP shell named .png, a GIF that is also HTML, a 758 KB PNG that eats your RAM, and a photo that knows where it was taken.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The three things a client tells you about a file — and why all three are claims</li>
<li>Five files through three checks: extension, client MIME, magic bytes</li>
<li>A polyglot that every sniffer calls GIF, and the one test it cannot pass</li>
<li>A decompression bomb: 758 KB on the wire, ~${BOM1} MB of RAM on the server</li>
<li>What a phone photo tells about its owner — and how re-encoding erases it</li>
</ul>` + box('Why it matters to you', 'An upload endpoint accepts arbitrary bytes from anyone with an account, stores them on infrastructure you pay for, and serves them to other people\'s browsers. That sentence holds three attack surfaces.', 'lam') },

  { t: 'One endpoint, three attack surfaces', to: true, giua: true, body: flow([
    { t: 'anyone with an account', s: 'sends arbitrary bytes', mau: DO }, { t: 'your server', s: 'decodes them (CPU, RAM)', mau: CAM }, { t: 'your storage', s: 'you pay for it', mau: LAM }, { t: 'other users\' browsers', s: 'render what you serve', mau: DO }], { h: 140 }) +
    cards([
      ['Content', 'What does the file DO when a browser opens it? HTML, SVG, script — a page on your domain.'],
      ['Resources', 'What does the file COST to process? A tiny file can describe an enormous image.'],
      ['Privacy', 'What does the file SAY about its owner? Camera, time, GPS position.'],
    ], 3) + box('Everyday picture', 'A post office accepting parcels from strangers: the label says "books". You still X-ray the parcel, you weigh it before loading the truck, and you take off the sender\'s home address before forwarding it.', 'xanh') },

  { t: 'Three things the client tells you', to: true, giua: true, body: cards([
    ['filename', 'A string in the multipart header. Can contain ../, a null byte, 300 characters, or shell.php.png.'],
    ['the extension', 'Just the tail of that same string. A naming convention, not a format.'],
    ['Content-Type', 'Also written by the client, per part. curl sends whatever you tell it to.'],
  ], 3) + J("curl -F 'file=@shell.png;type=image/png' http://127.0.0.1:4630/up     # ;type= — the client picks the MIME", { sm: false }) +
    TT('c10/multipart-raw', 10, 11, 'from lesson 10.1: where filename and Content-Type come from · real', { hl: [1, 2], n: 104, sm: false }) +
    box('All three are claims', 'None of them is evidence about the bytes. The rest of this lesson is about getting real evidence.', 'do2') },

  { t: 'Measurement 1 — five files, three checks', to: true, giua: true, body: TT('c10/three-checks', 2, 7, 'node three-checks.mjs · uploaded with curl through a real multer server · real', { hl: [4], n: 104, sm: false }) +
    two(box('Extension and MIME: 5 out of 5 pass', 'Both checks pass even the PHP shell — both are strings the attacker wrote.', 'do2'),
      box('Magic bytes: 3 out of 4 bad files caught', 'Reading the first bytes is a real improvement and you should do it. But look at line 3.', 'xanh')) +
    flow([{ t: '5 files in', s: '4 are hostile', mau: LAM }, { t: 'extension', s: '5 pass', mau: DO }, { t: 'client MIME', s: '5 pass', mau: DO }, { t: 'magic bytes', s: '2 pass: polyglot + photo', mau: CAM }], { h: 130 }) },

  { t: 'The first 16 bytes tell the truth (mostly)', to: true, giua: true, body: TT('c10/three-checks', 9, 14, 'first 16 bytes (hex) and as text · real', { hl: [4, 6], n: 104, sm: false }) +
    box('Magic bytes = a file signature', 'Binary formats start with a fixed marker, and file-type reads it. PHP, HTML and SVG are plain text with no marker — that is why they were "not recognised", not because they were judged dangerous.', 'lam') +
    bang(['format', 'starts with (hex)', 'as text'], [['JPEG', 'ff d8 ff', '(binary)'], ['PNG', '89 50 4e 47 0d 0a 1a 0a', '.PNG….'], ['GIF', '47 49 46 38 39 61', 'GIF89a']], { co: 20 }) },

  { t: 'The three checks in code', to: true, giua: true, body: JW(ma('c10/three-checks', 17, 25), 100, [1, 2, 8], { sm: false }) +
    cards([['Check 1 — extension', 'f.originalname: the client\'s string.'], ['Check 2 — client MIME', 'f.mimetype: the client\'s string.'], ['Check 3 — magic bytes', 'fileTypeFromBuffer(f.buffer): the bytes.']], 3) },

  { t: 'Measurement 2 — a polyglot', to: true, giua: true, body: J(ma('c10/polyglot', 4, 8), { sm: false, hl: [2, 3] }) +
    TT('c10/polyglot', 2, 2, 'node polyglot.mjs · real', { hl: [1], n: 104, sm: false }) +
    two(box('Polyglot', 'One file that is valid in two languages at once: here GIF for the sniffer, HTML/JavaScript for a browser.', 'lam'),
      box('If your allow-list has image/gif…', '…it passes. Six correct bytes are all a sniffer ever looks at.', 'do2')) },

  { t: 'Now actually decode it', to: true, giua: true, body: TT('c10/polyglot', 2, 3, 'node polyglot.mjs · file-type vs sharp · real', { hl: [2], n: 104, sm: false }) +
    flow([{ t: 'sniffer', s: 'reads 6 bytes → "GIF"', mau: CAM }, { t: 'decoder (sharp)', s: 'reads the WHOLE file', mau: LAM }, { t: 'not a real image', s: '→ throws → 400', mau: NODE }], { h: 140 }) +
    box('The most useful idea in this lesson', 'The only reliable way to know a file is an image is to decode it as an image. A sniffer reads a few bytes; a decoder reads everything and refuses what does not parse.', 'xanh') },

  { t: 'Why the SVG was blocked — by accident', to: true, giua: true, body: TT('c10/three-checks', 6, 6, 'logo.svg in measurement 1 · real', { n: 104, sm: false }) +
    J('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(document.domain)"><circle r="40"/></svg>', { sm: false }) +
    box('SVG is an image format that is XML — "blocked" by luck', 'It can run &lt;script&gt; and onload. file-type has no magic bytes to find, so it said "not recognised". And sharp DOES decode it — into pixels:', 'do2') +
    TT('c10/decode-five', 5, 5, 'node decode-five.mjs · the same logo.svg through sharp · real', { hl: [1], n: 104, sm: false }) +
    cards([['Refuse', 'The simplest: no SVG uploads. What this website does.'], ['Sanitise', 'DOMPurify with the SVG profile — the same tool as lesson 9.2.'], ['Rasterise', 'Store sharp\'s OUTPUT: pixels only, the onload is gone (above).']], 3) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['check', 'reads', 'stopped in measurement 1', 'fooled by'], [
    ['extension allow-list', 'the client\'s file name', '0 of 4 bad files', 'renaming'],
    ['client MIME allow-list', 'the client\'s Content-Type', '0 of 4 bad files', 'curl ;type='],
    ['magic bytes (file-type)', 'the first bytes', '3 of 4 bad files', 'a polyglot'],
    ['decode (sharp)', 'the whole file', 'all 3 binary fakes; SVG → pixels', '— (part 2: payloads, bombs)'],
  ], { co: 23, hl: [3] }) + box('Next: part 2', 'A REAL photo carrying a payload, a decompression bomb, and the GPS position inside a holiday picture.', 'lam') },

  // ───────────── phần B ─────────────
  { t: 'Measurement 3 — a real photo carrying a payload', to: true, giua: true, body: J("const evil = Buffer.concat([photo, Buffer.from('<script>alert(document.cookie)</script>')]);", { sm: false }) +
    TT('c10/payload-jpeg', 2, 6, 'node payload-jpeg.mjs · real', { hl: [3, 4, 5], n: 104, sm: false }) +
    two(box('It still decodes perfectly', 'A JPEG reader stops at the end-of-image marker ff d9 and ignores the bytes after it. Decoding alone does not catch this.', 'do2'),
      box('Re-encoding does', 'sharp decodes the pixels and writes a NEW file. Anything that is not pixels does not survive the trip.', 'xanh')) },

  { t: 'Re-encode: the check AND the optimisation', to: true, giua: true, body: J(`// This is the entire image check you need — and it is also the optimisation step:
const out = await sharp(buffer)
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toBuffer();   // throws if it cannot decode → answer 400, not 500`, { sm: false, hl: [2, 5] }) +
    cards([['Store the OUTPUT', 'Never the input. The bytes you serve are bytes you produced.'], ['400, not 500', 'A file that does not decode is the user\'s mistake, not a server fault.'], ['Its own extension', 'Build the key with .webp so the served type always matches the bytes.']], 3) +
    box('Whether a stored payload would run…', '…depends on Content-Type, nosniff and which domain serves it. Defence in depth means not having to know: re-encoding removes the question.', 'lam') },

  { t: 'Measurement 4 — a decompression bomb', to: true, giua: true, body: J("// the attacker's side: one flat colour, a huge canvas, maximum PNG compression\nsharp({ create: { width: 16000, height: 16000, channels: 3, background: '#f4f4f4' } })\n  .png({ compressionLevel: 9 }).toFile('bomb16k.png');", { sm: false }) +
    TT('c10/bomb', 2, 6, 'node bomb.mjs · each measurement in a fresh process · real', { hl: [2, 4], n: 104, sm: false }) +
    box('Re-encoding solves the content problem — and opens a resource problem', `A flat colour compresses absurdly well, so a tiny file can describe a huge image. Bomb 1 sits just under sharp's default limit: 758 KB on the wire, +${BOM1} MB of RAM.`, 'do2') },

  { t: 'How 758 KB becomes 256 million pixels', to: true, giua: true, body: bang(['', 'bomb 1', 'a real phone photo'], [
    ['size on the wire', '758 KB', '6.5 MB'],
    ['pixels', '16000 × 16000 = 256,000,000', '4032 × 3024 = 12,192,768'],
    ['decoded, 3 bytes per pixel', '≈ 768 MB of raw pixels', '≈ 37 MB'],
    ['sharp\'s default limit', '268,402,689 — just above', 'far below'],
  ], { co: 24, hl: [2] }) + box('Size limits measure the wrong thing', 'A 10 MB upload limit lets bomb 1 through thirteen times over. The cost of an image is its pixel count, not its byte count.', 'cam') },

  { t: 'Eight at once — one person with a script', to: true, giua: true, body: TT('c10/bomb', 8, 9, 'node bomb.mjs · resize + webp, all eight in parallel · real', { hl: [1], n: 104, sm: false }) +
    thanh([['8 bombs', BOM8, DO, `+${BOM8} MB`], ['8 real photos', PHOTO8, NODE, `+${PHOTO8} MB`]], { ghi: 'added server RSS · uploaded: 8 bombs = 6 MB, 8 photos = 52 MB · real' }) +
    box('Read the two lines side by side', `Eight bombs: about a ninth of the bandwidth of eight real photos, and ${(BOM8 / PHOTO8).toFixed(0)}× the memory. Nothing in size limits, MIME checks or magic bytes sees this coming.`, 'do2') },

  { t: 'The defence: a pixel budget — and a queue', to: true, giua: true, body: J(`sharp(buffer, { limitInputPixels: 50e6 })   // 50 million px ≈ 8000×6000, above any normal camera
  .resize({ width: 1200 }).webp().toBuffer();`, { sm: false, hl: [1] }) +
    TT('c10/bomb', 11, 12, 'node bomb.mjs · real', { hl: [1], n: 104, sm: false }) +
    two(box('Chosen by your product, not by the format', 'Refused in a couple of milliseconds — from the header, before decoding. A real 4032×3024 photo still goes through.', 'xanh'),
      box('Bound the concurrency too', 'sharp works on libvips threads, not the event loop, so request concurrency alone decides how many decode at once. Put a small queue in front.', 'lam')) },

  { t: 'Measurement 5 — what a photo tells about its owner', to: true, giua: true, body: J("await sharp(phone).webp({ quality: 80 }).toBuffer();                  // default: metadata dropped\nawait sharp(phone).withMetadata().webp({ quality: 80 }).toBuffer();   // opt-in: EXIF kept — GPS included", { sm: false, hl: [2] }) + TT('c10/exif', 2, 6, 'node exif.mjs · a phone-style JPEG we made ourselves; GPS = Hoan Kiem Lake, a public place · real', { hl: [2, 3, 4, 5], n: 104, sm: false }) +
    two(box('EXIF', 'Exchangeable Image File Format: a metadata block inside JPEG/HEIC. Phones write the model, the time — and often the GPS position, accurate to a few metres.', 'lam'),
      box('sharp drops it by default', 'The safe default. The only way to keep EXIF is to ask for it with withMetadata() — and then you keep the GPS too.', 'xanh')) },

  { t: 'What EXIF can hold', to: true, giua: true, body: bang(['tag', 'in our test photo', 'why it matters'], [
    ['Make, Model', 'Apple iPhone 15 Pro', 'device fingerprinting'],
    ['Artist', 'Nguyen Van A', 'the owner\'s name, set once in the camera'],
    ['DateTimeOriginal', '2026:10:31 07:42:13', 'routine: when someone is usually where'],
    ['GPS latitude / longitude', '21.02850, 105.85420', 'where the photo was taken — often a home'],
  ], { co: 23, hl: [3] }) + two(box('Need orientation or copyright?', 'Then you must keep metadata on purpose — and filter it: keep Orientation and Copyright, drop GPS and Artist.', 'cam'),
    box('Upload as-is = publish all of it', 'A profile photo straight from a phone can publish the street the user lives on.', 'do2')) },

  { t: 'Live content: never store it as-is', to: true, giua: true, body: cards([
    ['HTML / XHTML', 'Served from your media domain, it IS a page on your domain — phishing under your padlock, or session theft if that domain shares cookies.'],
    ['SVG', 'An image format that is XML and runs &lt;script&gt; and onload. Sanitise it like HTML, or refuse it outright.'],
    ['JS, XML, PHP, .htaccess', 'Dangerous only if something executes them — but "nothing will ever run in this folder" outlives the person who said it.'],
  ], 3) + flow([{ t: 'upload', mau: LAM }, { t: 'live MIME / ext?', s: 'yes → 400', mau: DO }, { t: 'decode + re-encode', s: 'fails → 400', mau: CAM }, { t: 'store the OUTPUT', s: 'own key, own type', mau: NODE }], { h: 130 }) + box('An image endpoint has no reason to accept something a browser will run', 'Reject live content by MIME AND by extension, then decode and re-encode everything that remains.', 'xanh') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: JW(`// src/storage/uploadService.ts — gate 1: no live content, by MIME and by extension
const DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i;
if (DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)) throw new UploadError('File type not allowed', 'UNSAFE_FILE_TYPE', 400);
// src/storage/imageOptimizer.ts — gate 2: decode + re-encode, with a pixel budget
const MAX_INPUT_PIXELS = 100_000_000;   const MAX_CONCURRENT_DECODES = 4;
let pipeline = sharp(input, { failOn: 'none', limitInputPixels: MAX_INPUT_PIXELS });`, 104, [2, 3, 5, 6], { sm: false }) +
    cards([['Gate 1 — reject live content', 'MIME and extension, because the MIME is the client\'s. Empty or octet-stream MIME skips only the family check.'],
      ['Gate 2 — optimizeImage()', 'sharp, max width 1200, WebP q80: format change, payload stripping and the "is it really an image" test in one. Failure → 400.'],
      ['Gate 3 — the key', 'Rebuilt with .webp, so the served Content-Type never contradicts the bytes. Bombs: ≤ 100 MP, ≤ 4 decodes at once.']], 3) },

  { t: 'Six file-checking mistakes that keep coming back', to: true, giua: true, body: cards([
    ['The original name in a path', '../../etc/cron.d/x is a valid file name; every path join that trusts it is a directory traversal.'],
    ['A deny-list', 'You will forget .phtml, .mjs, .htaccess. Allow-list what you accept.'],
    ['Checking before the LAST dot', 'evil.php.png ends in .png and starts with evil.php. Only the last extension means anything — and only for naming.'],
    ['Sniff at the door, echo at the exit', 'Checking magic bytes is pointless if you later serve the client\'s original Content-Type.'],
    ['Unzipping on the server', 'A zip bomb is measurement 4 with a different decompressor.'],
    ['"image/* is safe"', 'The bomb, the polyglot and the GPS photo were all images.'],
  ], 3) },

  { t: 'Exercise', to: true, giua: true, body: J(`app.post('/avatar', upload.single('file'), async (req, res) => {
  if (!/\\.(png|jpe?g|gif|svg)$/i.test(req.file.originalname)) return res.status(400).end();
  const dest = path.join('public/avatars', req.file.originalname);
  await fs.writeFile(dest, req.file.buffer);
  res.json({ url: '/avatars/' + req.file.originalname });
});`, { sm: false, hl: [2, 3, 4] }) +
    box('Exercise', 'List every attack from this lesson that this avatar endpoint lets through, and rewrite it in a few lines.', '') +
    `<div data-k="dapan">${box('Answer', 'Line 2: an extension check only — shell.png, polyglot.gif and svg pass; svg is even allowed. Line 3: the user\'s name in a path (traversal). Line 4: stores the INPUT (payload, EXIF/GPS) with no pixel limit (bomb). Fix: sharp(buf, { limitInputPixels: 50e6 }).resize(…).webp() → store the output under buildKey(…).webp; reject svg.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Which three things about a file does the client control?</li>
<li>Why does reading magic bytes not stop a polyglot?</li>
<li>A real JPEG with a script appended decodes fine. What removes the script?</li>
<li>Why can't a 10 MB upload limit stop a decompression bomb?</li>
<li>Your app needs EXIF orientation. What must you be careful about?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. filename, extension, Content-Type. &nbsp;2. A sniffer reads only the first bytes; the polyglot starts with real GIF magic. &nbsp;3. Re-encoding: store sharp\'s output, not the input. &nbsp;4. The cost is pixels, not bytes — 758 KB describes 256 million pixels. &nbsp;5. withMetadata() keeps GPS too — keep only the tags you need.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>filename, extension, Content-Type: claims. Magic bytes: evidence for the first few bytes only</li>
<li>The real test is decoding — and the real fix is re-encoding: store the output, never the input</li>
<li>Bound work by PIXELS (limitInputPixels) and by concurrency, not just by bytes</li>
<li>Re-encoding drops EXIF/GPS by default; refuse live content (HTML, SVG, JS) explicitly</li>
</ul>` + box('Next: lesson 10.4', 'Serving media back: what format and size are worth in bytes, the cache headers this site really serves, and the part everyone forgets — deleting.', 'lam') },
]);
