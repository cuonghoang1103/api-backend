/**
 * node-10-1 — Node.js · Chapter 10 · Lesson 10.1 "Receiving a file: multipart, base64, and the price in RAM" (slide EN, đợt 8b — 01/11/2026).
 * MỘT deck, HAI tập: node-10-1 (slide 1–11) · node-10-1-2 (slide 12–24).
 *   A: tệp khác JSON · ba đường vào · multipart mức byte (thật: curl -F, 316 byte, phong bì 199 byte) · base64 +33,33 % (thật) · vì sao đúng 1/3 · base64 tốn gì ở server
 *   B: bốn cách đo RSS (thật) · bốn server cạnh nhau · 120 MB bộ nhớ vs stream · 4 × 120 MB cùng lúc · quy tắc theo cỡ · limits.fileSize 413 (thật) · không error handler ⇒ 500 ·
 *      năm lỗi · website này làm thế nào · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-10-1-nhan-file-multipart. Output THẬT: that/c10/{multipart-raw,base64-cost,rss-4ways,multer-limit} (Node 22.23.3, Express 5.3.0, multer 2.5.0, busboy 1.6.0).
 * Khác web: ảnh thử tự tạo 6.814.057 byte (web 7.183.099) ⇒ base64 9.085.412 (+33,33 %); RSS: base64 +51,7 MB, memory +13,0, disk +6,1, busboy +6,1;
 *   120 MB: memory +243,2 MB / 95 ms · stream +40,7 MB / 125 ms; 4 × 120 MB +722,7 MB; 8 ảnh: memory +69,1 · stream +34,5.
 *   Web ghi "5 Mbps: 11,5 s thay vì 8,6 s" — số học đúng là 15,3 s (base64) thay vì 11,5 s (gốc) cho tệp 7,18 MB ⇒ đã sửa web.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong, ra } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-10-1', code: 'NODE 10.1', title: 'Receiving a file: multipart, base64, and the price in RAM', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c10/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const add = (re) => num(R('rss-4ways', re), /\+([\d.]+) MB\s*$/);
const B64 = { orig: num(R('base64-cost', /^original/), /([\d,]+) bytes/), b64: num(R('base64-cost', /^base64/), /([\d,]+) bytes/) };
const photoMB = (B64.orig / 1048576).toFixed(1);

const b64svg = `<svg data-k="b64" viewBox="0 0 1100 300" width="1100" height="300" font-family="Arial">
${['ff', 'd8', 'ff'].map((h, i) => `<rect x="${40 + i * 340}" y="10" width="320" height="56" rx="8" fill="#33679118" stroke="${LAM}" stroke-width="2.5"/><text x="${200 + i * 340}" y="48" text-anchor="middle" font-size="26" font-weight="700" fill="${LAM}" font-family="monospace">0x${h} = ${parseInt(h, 16).toString(2).padStart(8, '0')}</text>`).join('')}
<text x="550" y="104" text-anchor="middle" font-size="21" fill="#555">3 bytes = 24 bits → regrouped into 4 groups of 6 bits</text>
${['111111', '111101', '100011', '111111'].map((b, i) => `<rect x="${40 + i * 257}" y="124" width="236" height="56" rx="8" fill="#e08a1e18" stroke="${CAM}" stroke-width="2.5"/><text x="${158 + i * 257}" y="162" text-anchor="middle" font-size="26" font-weight="700" fill="#9a4d08" font-family="monospace">${b} = ${parseInt(b, 2)}</text>`).join('')}
${['/', '9', 'j', '/'].map((c, i) => `<line x1="${158 + i * 257}" y1="184" x2="${158 + i * 257}" y2="214" stroke="#b85a2b" stroke-width="3"/><rect x="${98 + i * 257}" y="218" width="120" height="62" rx="10" fill="#15803d18" stroke="${NODE}" stroke-width="2.5"/><text x="${158 + i * 257}" y="262" text-anchor="middle" font-size="34" font-weight="800" fill="${NODE}" font-family="monospace">${c}</text>`).join('')}
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 10 — Uploads & object storage', bai: '10.1' }, [
  { cover: true, t: 'Receiving a file:<br>multipart, base64<br>and the price in RAM', sub: 'How you RECEIVE a file decides how much memory every concurrent upload holds.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What multipart/form-data really looks like — byte for byte, captured from curl</li>
<li>Why base64 costs exactly one third more, and what it costs the server on top</li>
<li>One upload, four ways (base64, memoryStorage, diskStorage, stream), measured in RSS</li>
<li>The number that takes a VPS down: four users, one 120 MB video each</li>
<li>What limits.fileSize protects — and what it never protects</li>
</ul>` + box('Why it matters to you', 'A design that works for one tester on localhost can kill a 6 GB server with four real users. After this lesson you choose the upload path by numbers, not by habit.', 'lam') },

  { t: 'A file is a different species', to: true, giua: true, body: bang(['', 'JSON request (chapters 5–9)', 'file upload'], [
    ['size', 'a few hundred bytes', 'megabytes, sometimes hundreds'],
    ['arrives', 'in one go', 'as fast as the user\'s phone can push'],
    ['the server holds', 'a tiny object', 'whatever your receiving strategy keeps in RAM'],
    ['who controls name and type', 'nobody cares', 'the client — and it can lie (lesson 10.3)'],
  ], { co: 24 }) + box('The trap', 'You are the only person uploading while you develop. The memory bill arrives with the first four concurrent users.', 'do2') },

  { t: 'Three roads into the server', to: true, giua: true, body: cards([
    ['Base64 inside JSON', 'The client reads the file, encodes it as text, POSTs {"data":"data:image/jpeg;base64,…"}. Simple — and 33% bigger before anything happens.'],
    ['multipart/form-data', 'What HTML forms use since 1995: the body is cut by a boundary string into parts, each with its own headers. Binary-safe, streamable, every upload library speaks it.'],
    ['Raw body, straight to storage', 'A bare PUT whose body IS the file. This is how presigned URLs work (lesson 10.2) — the only road where the file never touches your server.'],
  ], 3) + flow([{ t: 'browser', s: 'has the file', mau: LAM }, { t: 'your API', s: 'roads 1 and 2 pass here', mau: CAM }, { t: 'storage', s: 'road 3 goes straight here', mau: NODE }], { h: 130 }) },

  { t: 'multipart, byte for byte', to: true, giua: true, body: J(`curl -F "caption=Anh bien" -F "file=@tiny.txt" http://127.0.0.1:4601/upload`, { sm: false }) +
    TT('c10/multipart-raw', 2, 14, 'node multipart-raw.mjs · a raw http server prints the body; \\r\\n made visible · real', { hl: [9, 10], n: 100, sm: false }) },

  { t: 'Three things to notice', to: true, giua: true, body: cards([
    ['Parts are ORDERED', 'caption comes first only because curl sent it first. A client that puts text fields last makes your file handler run before those fields exist.'],
    ['filename and Content-Type are claims', 'Plain text written by the client, never verified. Lesson 10.3 is entirely about the consequences.'],
    ['The envelope is almost free', 'Boundaries and part headers add a fixed couple of hundred bytes, whatever the file size.'],
  ], 3) + TT('c10/multipart-raw', 16, 18, 'same server, a real-size photo · real', { hl: [3], n: 100, sm: false }) +
    box('So why not always multipart?', 'On the wire it is nearly perfect. The cost appears INSIDE the server — it depends on where the file part ends up. That is part 2.', 'lam') },

  { t: 'Look at bytes before trusting a library', to: true, giua: true, body: JW(ma('c10/multipart-raw', 8, 14), 84, [3, 4, 7], { sm: false }) +
    two(box('A few lines of node:http', 'No framework, no parser: collect the chunks, print them. This is the tool that produced the previous two slides.', 'lam'),
      box('A trap we hit making this demo', 'curl was first called with execFileSync — which BLOCKED the event loop of the very server it was talking to. The request hung forever. Same process ⇒ async.', 'cam')) },

  { t: 'Measurement 1 — base64 is not free', to: true, giua: true, body: J("const body = JSON.stringify({ data: `data:image/jpeg;base64,${photo.toString('base64')}` });", { sm: false }) +
    TT('c10/base64-cost', 2, 5, 'node base64-cost.mjs · real', { hl: [2, 3], n: 100, sm: false }) +
    thanh([['original', B64.orig, NODE, `${B64.orig.toLocaleString('en-US')} B`], ['base64', B64.b64, DO, `${B64.b64.toLocaleString('en-US')} B`]], { ghi: 'bytes on the wire · real' }) +
    box('Not an implementation detail — arithmetic', `Every 3 bytes become 4 characters, so the growth is exactly one third: ${B64.orig.toLocaleString('en-US')} → ${B64.b64.toLocaleString('en-US')} bytes.`, 'do2') },

  { t: 'Why exactly one third', to: true, giua: true, body: b64svg +
    two(box('64 symbols = 6 bits each', 'A–Z, a–z, 0–9, + and /. Six bits per character, eight bits per byte: 3 × 8 = 4 × 6 = 24.', 'lam'),
      box('The first bytes of every JPEG', 'ff d8 ff — so every base64 JPEG data URL starts with /9j/. Now you know why.', 'xanh')) },

  { t: 'What base64 costs the server, on top', to: true, giua: true, body: flow([
    { t: '9.1 MB of text', s: 'arrives on the socket', mau: LAM }, { t: 'express.json()', s: 'buffers + parses a string', mau: CAM }, { t: 'req.body.data', s: 'a 9.1 MB JS string', mau: CAM }, { t: 'Buffer.from(…)', s: 'a second, decoded copy', mau: DO }], { h: 140 }) +
    TT('c10/base64-cost', 6, 6, 'same file on a 5 Mbps mobile uplink · real', { n: 100, sm: false }) +
    two(box('Paid twice', 'Once in bandwidth (+33% on the wire), once in RAM: the text, the parsed string, and the decoded bytes all live at the same moment. Part 2 measures it.', 'do2'),
      box('If a client can only send JSON', 'Keep that route\'s limit close to the real need — or hand the client a presigned URL and let it PUT raw bytes (lesson 10.2).', 'xanh')) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['road', 'on the wire', 'the server sees', 'use it for'], [
    ['base64 in JSON', '+33.33%', 'text → string → bytes', 'tiny files only, if at all'],
    ['multipart/form-data', '+199 bytes', 'a stream of parts', 'normal uploads through your API'],
    ['raw PUT to storage', '+0', 'nothing at all', 'big files (lesson 10.2)'],
  ], { co: 23 }) + two(box('One road per need', 'Small files through your API as multipart; big files around it. Base64 only when a client truly cannot send multipart.', 'xanh'), box('Where each road comes back', 'Road 2: the rest of this lesson. Road 3: lesson 10.2. What you do with the bytes once you have them: lesson 10.3.', 'lam')) + box('Next: four servers, one upload, measured in RSS', 'Same photo, base64 vs memoryStorage vs diskStorage vs a stream — then a 120 MB video, then four at once.', 'lam') },

  // ───────────── phần B ─────────────
  { t: 'Measurement 2 — one upload, four ways, in RSS', to: true, giua: true, body: TT('c10/rss-4ways', 2, 8, 'node rss-4ways.mjs · a FRESH Express process per strategy · RSS sampled every 10 ms · real', { hl: [4], n: 104, sm: false }) +
    two(box('Read the first line slowly', `A ${photoMB} MB file cost <b>+${add(/^base64/)} MB</b> of resident memory — about ${(add(/^base64/) / Number(photoMB)).toFixed(1)}× the file.`, 'do2'),
      box('Read the last line too', `Writing the file part to disk without ever holding it whole: <b>+${add(/^busboy/)} MB</b>.`, 'xanh')) +
    box('How it was measured', 'One new server process per strategy · gc() before the baseline · RSS sampled every 10 ms inside the server · added = peak − baseline · upload sent with curl -F from a separate process.', 'lam') },

  { t: 'The same numbers, drawn to scale', to: true, giua: true, body: thanh([
    ['base64 + JSON', add(/^base64/), DO, `+${add(/^base64/)} MB`], ['memoryStorage', add(/^multer memory/), CAM, `+${add(/^multer memory/)} MB`],
    ['diskStorage', add(/^multer disk/), NODE, `+${add(/^multer disk/)} MB`], ['busboy stream', add(/^busboy/), NODE, `+${add(/^busboy/)} MB`],
  ], { ghi: `added RSS for ONE ${photoMB} MB upload · real` }) +
    two(box('memoryStorage ≈ 2× the file', 'The whole file in one Buffer, plus the chunks it was assembled from, until the garbage collector runs.', 'cam'),
      box('RSS', 'Resident Set Size: the RAM the operating system has really given the process. It is what the OOM killer looks at.', 'lam')) },

  { t: 'The four servers, side by side', to: true, giua: true, body: J(`// 1. base64 in JSON                → a 9 MB string, then a decoded copy
app.post('/up', express.json({ limit: '32mb' }), (req, res) => {
  const bytes = Buffer.from(req.body.data.split(',')[1], 'base64'); /* … */ });
// 2. multer, whole file in RAM            → req.file.buffer
const mem = multer({ storage: multer.memoryStorage() });
// 3. multer, file written to ./tmp-up     → req.file.path
const disk = multer({ storage: multer.diskStorage({ destination: './tmp-up' }) });
app.post('/up', mem.single('file'), handler);            // or disk.single('file')
// 4. busboy: the file part IS a stream — pipe it, never hold it
app.post('/up', (req, res) => {
  const bb = busboy({ headers: req.headers });
  bb.on('file', (_name, file) => file.pipe(fs.createWriteStream(dest)));
  req.pipe(bb);
});`, { sm: false, hl: [3, 5, 7, 12] }) +
    box('multer is built on busboy', 'Strategies 2–4 parse the very same multipart bytes. The only difference is WHERE the file part ends up: a Buffer, a file, or a pipe.', 'lam') },

  { t: 'Measurement 3 — now make the file bigger', to: true, giua: true, body: TT('c10/rss-4ways', 10, 12, 'node rss-4ways.mjs · one 120 MB upload · real', { hl: [2], n: 104, sm: false }) +
    thanh([['memoryStorage', num(R('rss-4ways', /^multer memoryStorage\s+\d+ ms/), /\+([\d.]+) MB/), DO, `+${num(R('rss-4ways', /^multer memoryStorage\s+\d+ ms/), /\+([\d.]+) MB/)} MB`],
      ['busboy stream', num(R('rss-4ways', /^busboy -> stream to disk\s+\d+ ms/), /\+([\d.]+) MB/), NODE, `+${num(R('rss-4ways', /^busboy -> stream to disk\s+\d+ ms/), /\+([\d.]+) MB/)} MB`]], { ghi: 'added RSS for ONE 120 MB upload · real' }) +
    box('The honest trade', 'Buffering 120 MB costs about twice the file (V8 grows buffers by copying). The stream costs a sixth of that — and was a little slower here. A stream is not free in latency; it is cheap in memory.', 'lam') },

  { t: 'Measurement 4 — the number that kills production', to: true, giua: true, body: TT('c10/rss-4ways', 14, 17, 'node rss-4ways.mjs · concurrent uploads · real', { hl: [2], n: 104, sm: false }) +
    thanh([['idle', num(R('rss-4ways', /^4 x 120/), /RSS ([\d.]+) ->/), NODE, `${num(R('rss-4ways', /^4 x 120/), /RSS ([\d.]+) ->/)} MB`], ['4 × 120 MB', num(R('rss-4ways', /^4 x 120/), /-> ([\d.]+) MB/), DO, `${num(R('rss-4ways', /^4 x 120/), /-> ([\d.]+) MB/)} MB`]], { ghi: 'server RSS, memoryStorage · real' }) +
    box('Four users', 'On a 6 GB VPS that also runs PostgreSQL, Redis, a Next.js frontend and AI jobs, a dozen people uploading videos at once is not "slower" — it is the OOM killer and a container restart.', 'do2') },

  { t: 'A rule of thumb — by size, not by slogan', to: true, giua: true, body: cards([
    ['Photos, avatars, small documents (< 10 MB)', 'memoryStorage is fine and much simpler: you need the whole buffer anyway to re-encode it (lesson 10.3), and ~2× the file per request is acceptable.'],
    ['Videos, large files (> 50 MB)', 'Never buffer. Stream through to storage (lesson 10.2), or take your server out of the path with a presigned URL.'],
    ['Temp disk (diskStorage)', 'The middle move: cheap RAM, but now YOU own cleaning temp files — and in a container that is a volume quietly filling up.'],
  ], 3) + box('Why the rule is about size', `Eight ${photoMB} MB photos at once: memoryStorage +${num(R('rss-4ways', /^8 photos, memory/), /\+([\d.]+) MB/)} MB, stream +${num(R('rss-4ways', /^8 photos, busboy/), /\+([\d.]+) MB/)} MB. The gap only becomes dangerous as files grow.`, 'lam') },

  { t: 'limits.fileSize — what it protects', to: true, giua: true, body: JW(ma('c10/multer-limit', 8, 14), 92, [1, 4], { sm: false }) +
    TT('c10/multer-limit', 2, 3, `node multer-limit.mjs · limit 5 MB, a ${photoMB} MB photo · real`, { hl: [2], n: 100, sm: false }) +
    box('Refused — after the whole file arrived', 'The size limit protects your memory and disk. It never protects your bandwidth: the client still pushed every byte before hearing "too large". Content-Length could reject earlier, but it is also a client claim.', 'cam') },

  { t: '…and what happens without an error handler', to: true, giua: true, body: J("app.post('/naive', up.single('file'), (req, res) => res.json({ ok: true }));   // no error handler anywhere", { sm: false }) +
    TT('c10/multer-limit', 4, 5, 'the server log (Express prints the error) · real', { hl: [1], n: 100, sm: false }) +
    TT('c10/multer-limit', 21, 24, 'what the CLIENT receives · real', { hl: [1, 2], n: 100, sm: false }) +
    box('MulterError travels down the middleware chain', 'Without a handler for it, a too-big file is a 500 with a stack trace in an HTML page — instead of a clean 413 (chapter 5.4).', 'do2') },

  { t: 'Five ways upload handling goes wrong', to: true, giua: true, body: cards([
    ['multer() with no options', 'memoryStorage, NO size limit: one 2 GB upload ends the process.'],
    ['req.body inside fileFilter', 'Text fields may not be parsed yet ⇒ undefined. Use the URL or a header.'],
    ['upload.array(\'files\', 10)', 'Multiplies your memory per request by ten.'],
    ['diskStorage, never cleaned', 'Every failed request leaves a temp file; nobody sweeps it for you.'],
    ['A body reader in front', 'A global express.raw() reads the WHOLE body into RAM — then multer gets an empty stream (below).'],
    ['Fix all five', 'limits always · URL/headers · smaller max · clean in finally · upload routes before body readers.'],
  ], 3) + TT('c10/raw-first', 2, 3, 'node raw-first.mjs · app.use(express.raw({ type: \'*/*\' })) before a multer route · real', { hl: [1], n: 100, sm: false }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: JW(`// src/routes/upload.routes.ts
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 160 * 1024 * 1024, // 160MB hard cap (150MB videos + headroom); per-category caps live in uploadService
  },
});`, 92, [3, 5], { sm: false }) +
    two(box('Memory, on purpose', 'Every image goes straight into sharp to be re-encoded; a temp file would just be one more trip to disk. Per-type limits (images, audio, documents) live in uploadService and become a typed 413, not a Multer stack trace.', 'lam'),
      box('Videos never take this road', 'They go straight to R2 through a presigned URL — both the memory numbers above and Cloudflare\'s 100 MB request-body cap make a 150 MB multipart upload impossible.', 'xanh')) },

  { t: 'Exercise', to: true, giua: true, body: J(`const upload = multer();                                  // (a)
app.use(express.raw({ type: '*/*', limit: '200mb' }));    // (b)
app.post('/gallery', upload.array('photos', 20), async (req, res) => {
  res.json({ count: req.files.length });
});`, { sm: false, hl: [1, 2, 3] }) +
    box('Exercise', 'A gallery endpoint. Users upload up to twenty 8 MB phone photos at once. Find three memory problems, and fix each with what you measured in this lesson.', '') +
    `<div data-k="dapan">${box('Answer', '(a) multer() = memoryStorage with NO limit ⇒ add limits: { fileSize: 10 MB, files: 20 }. (b) a global express.raw() reads EVERY body into RAM first — even multipart, up to 200 MB — and multer then finds the stream empty: 500 "Unexpected end of form" (measured) ⇒ delete it, or mount it only on the route that needs it. (c) array(…, 20) × 8 MB × ~2 in RAM ≈ 320 MB per request ⇒ fewer files per request, or stream each part to storage.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Which two strings in a multipart part does the client fully control?</li>
<li>Why is base64 exactly 33.33% bigger — not "about a third"?</li>
<li>Which strategy cost the most RSS for one photo, and roughly how many times the file?</li>
<li>Four users each upload 120 MB into memoryStorage. Roughly how much RAM?</li>
<li>Does limits.fileSize save bandwidth?</li>
</ol>
<div data-k="dapan">${box('Answers', `1. filename and Content-Type. &nbsp;2. 3 bytes = 24 bits = 4 base64 characters. &nbsp;3. base64 in JSON, +${add(/^base64/)} MB ≈ ${(add(/^base64/) / Number(photoMB)).toFixed(0)}× the file. &nbsp;4. ~${Math.round(num(R('rss-4ways', /^4 x 120/), /\(\+([\d.]+) MB/))} MB measured. &nbsp;5. No — the client sends the whole file before the 413.`, 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>multipart = parts cut by a boundary; filename and Content-Type are client claims; the envelope costs ~200 bytes</li>
<li>base64 = +33.33% on the wire, and text + string + bytes in RAM at once (+${add(/^base64/)} MB for one photo)</li>
<li>memoryStorage ≈ 2× the file per request: fine for photos, fatal for video (4 × 120 MB → +${Math.round(num(R('rss-4ways', /^4 x 120/), /\(\+([\d.]+) MB/))} MB)</li>
<li>Stream large files; limit every upload; handle MulterError → 413</li>
</ul>` + box('Next: lesson 10.2', 'Object storage and presigned URLs — the upload your server never sees, and the two things the signature does NOT protect.', 'lam') },
]);
