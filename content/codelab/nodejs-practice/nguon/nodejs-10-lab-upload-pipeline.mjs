/** Node.js · Lab 10 — Đường upload của Notes: video qua URL ký sẵn (ký content-type), ảnh qua đường ống chặn–đọc–đếm điểm ảnh–giải mã–lưu bản mới. */
import { modul, cs, ord, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── L1. EASY · order ─── */
const L1 = {
  ...cs({
    ten: 'Lab 10 · 1 — The two upload paths, step by step', kho: 'EASY', phut: 8, loai: 'order',
    en: 'This site splits uploads by size: videos never touch the API (presigned PUT), images go through the API to be re-encoded. Put each path in order.',
    vi: 'Site này chia upload theo cỡ: video không bao giờ đi qua API (PUT ký sẵn), ảnh đi qua API để re-encode. Sắp mỗi đường theo đúng thứ tự.',
    cau: [
      ord('v1', ['The video path (POST /upload/presign-r2 … /complete).', 'Đường video (POST /upload/presign-r2 … /complete).'],
        ['The API authenticates the user and refuses a declared type that is not video/*', 'It builds the key (video/u&lt;id&gt;/&lt;time&gt;-&lt;hex&gt;.mp4) and signs a PUT with content-type in signableHeaders', 'The browser PUTs the file straight to R2 — the API sees none of the bytes', 'The client calls /complete; the API runs HeadObject and checks the real size and type', 'It writes a PendingUpload row with a 24-hour TTL', 'The post is created and the row is marked CONFIRMED (a nightly cron sweeps the rest)'],
        ['Sign only after authenticating; verify only after the upload; record only after verifying; confirm only when the post exists — every step checks what the previous one could not.', 'Chỉ ký sau khi xác thực; chỉ kiểm sau khi upload; chỉ ghi sau khi kiểm; chỉ xác nhận khi bài viết tồn tại — mỗi bước kiểm điều bước trước không kiểm được.']),
      ord('i1', ['The image path, from bytes received to row written.', 'Đường ảnh, từ lúc nhận byte tới lúc ghi dòng.'],
        ['assertSafeUploadType: refuse active content by MIME and by extension', 'Sniff the magic bytes (fail fast on a renamed PHP shell)', 'Read the pixel count from the header and refuse a bomb', 'Decode + re-encode (sharp → WebP q80, width 1200) inside a gate of 4', 'Build the key with a .webp extension and PutObject with immutable Cache-Control', 'Write the database row'],
        ['Cheapest checks first (strings, 6 bytes, 24 bytes), the expensive decode only for files that survived them — and bounded. The output, never the input, is what gets stored.', 'Phép kiểm rẻ trước (chuỗi, 6 byte, 24 byte), giải mã đắt chỉ cho file đã qua — và có giới hạn. Bản ra, không bao giờ bản vào, là thứ được lưu.']),
    ],
    goiY: [['For each step ask what it needs from the previous one.', 'Với mỗi bước hỏi nó cần gì từ bước trước.'], ['Cheap checks before expensive ones; verification after the fact for anything the signature did not bind.', 'Kiểm rẻ trước kiểm đắt; kiểm lại sau với mọi thứ chữ ký không ràng buộc.']],
    loi: [['Writing the DB row at presign time, before anything was uploaded.', 'Ghi dòng CSDL lúc ký, trước khi có gì được upload.'], ['Decoding before the pixel check — the bomb has already cost 99 MB.', 'Giải mã trước khi kiểm điểm ảnh — quả bom đã tốn 99 MB.']],
    tns: [tn('presign', 'ký sẵn', 'cấp quyền một thao tác có hạn')],
    kn: ['uploads', 'presigned URLs'],
  }),
  dangBai: 'lab',
};

/* ─── L2. MEDIUM · js — POST /upload/presign-r2 ─── */
function presignVideo(body, user, { sign, now, rand, maxSize }) {
  if (!user) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
  const { filename, contentType, size } = body || {};
  // The declared values are INPUT to our checks, not to the signature — they are re-checked at /complete.
  if (typeof contentType !== 'string' || !/^video\/[a-z0-9.+-]+$/i.test(contentType)) return { status: 415, body: { error: 'VIDEO_ONLY' } };
  if (typeof size !== 'number' || !(size > 0)) return { status: 400, body: { error: 'BAD_SIZE' } };
  if (size > maxSize) return { status: 413, body: { error: 'TOO_LARGE', max: maxSize } };
  // Key from trusted parts only (10.2): the user's filename contributes at most its last extension.
  const m = /(\.[A-Za-z0-9]{1,5})$/.exec(String(filename || ''));
  const key = 'video/u' + user.id + '/' + now + '-' + rand + (m ? m[1].toLowerCase() : '');
  // signableHeaders: content-type ⇒ a text/html PUT to this URL gets 403 (measurement 4 cannot happen).
  const url = sign({ method: 'PUT', key, contentType, expiresIn: 3600, signableHeaders: ['content-type'] });
  // Tell the client the exact header it must send — the signature now depends on it.
  return { status: 200, body: { url, key, expiresIn: 3600, headers: { 'Content-Type': contentType } } };
}

const PRE = String.raw`
const signed = [];
const sign = (o) => { signed.push(o); return 'https://acc.r2.cloudflarestorage.com/cuongthai-media/' + o.key + '?X-Amz-SignedHeaders=' + encodeURIComponent((o.signableHeaders || []).concat('host').sort().join(';')) + '&X-Amz-Expires=' + o.expiresIn; };
const OPTS = { sign, now: 1753660001234, rand: 'deadbeef1234', maxSize: 150 * 1024 * 1024 };
`;

const L2 = jsBai({
  ten: 'Lab 10 · 2 — Sign a video upload that cannot become HTML', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p>Write <code>presignVideo(body, user, { sign, now, rand, maxSize })</code> → <code>{ status, body }</code> for <code>POST /upload/presign-r2</code>. <code>body = { filename, contentType, size }</code> as declared by the client; <code>sign(options)</code> is the injected <code>getSignedUrl</code> and returns a URL.</p>
<ol><li>no <code>user</code> → 401 <code>{ error:'UNAUTHENTICATED' }</code>;</li>
<li><code>contentType</code> must match <code>/^video\\/[a-z0-9.+-]+$/i</code> → else 415 <code>{ error:'VIDEO_ONLY' }</code>;</li>
<li><code>size</code> must be a positive number → else 400 <code>{ error:'BAD_SIZE' }</code>; above <code>maxSize</code> → 413 <code>{ error:'TOO_LARGE', max }</code>;</li>
<li>key = <code>video/u&lt;id&gt;/&lt;now&gt;-&lt;rand&gt;&lt;ext&gt;</code> (ext = last extension of the filename, lower-cased, if it matches <code>/\\.[A-Za-z0-9]{1,5}$/</code>);</li>
<li>call <code>sign({ method:'PUT', key, contentType, expiresIn:3600, signableHeaders:['content-type'] })</code>;</li>
<li>200 <code>{ url, key, expiresIn:3600, headers:{ 'Content-Type': contentType } }</code>.</li></ol>${MOI_TRUONG.en}`,
  vi: `<p>Viết <code>presignVideo(body, user, { sign, now, rand, maxSize })</code> → <code>{ status, body }</code> cho <code>POST /upload/presign-r2</code>. <code>body = { filename, contentType, size }</code> do client khai; <code>sign(options)</code> là <code>getSignedUrl</code> được tiêm vào, trả về một URL.</p>
<ol><li>không có <code>user</code> → 401 <code>{ error:'UNAUTHENTICATED' }</code>;</li>
<li><code>contentType</code> phải khớp <code>/^video\\/[a-z0-9.+-]+$/i</code> → không thì 415 <code>{ error:'VIDEO_ONLY' }</code>;</li>
<li><code>size</code> phải là số dương → không thì 400 <code>{ error:'BAD_SIZE' }</code>; lớn hơn <code>maxSize</code> → 413 <code>{ error:'TOO_LARGE', max }</code>;</li>
<li>key = <code>video/u&lt;id&gt;/&lt;now&gt;-&lt;rand&gt;&lt;ext&gt;</code> (ext = đuôi cuối của filename, viết thường, nếu khớp <code>/\\.[A-Za-z0-9]{1,5}$/</code>);</li>
<li>gọi <code>sign({ method:'PUT', key, contentType, expiresIn:3600, signableHeaders:['content-type'] })</code>;</li>
<li>200 <code>{ url, key, expiresIn:3600, headers:{ 'Content-Type': contentType } }</code>.</li></ol>${MOI_TRUONG.vi}`,
  goiY: [['Checks in the listed order; return as soon as one fails.', 'Kiểm theo đúng thứ tự liệt kê; hỏng cái nào trả về ngay.'], ['The only thing that makes the URL refuse text/html is <code>signableHeaders: ["content-type"]</code>.', 'Thứ duy nhất làm URL từ chối text/html là <code>signableHeaders: ["content-type"]</code>.']],
  loi: [['Signing without signableHeaders: the URL accepts any Content-Type (measurement 4).', 'Ký không có signableHeaders: URL nhận mọi Content-Type (phép đo 4).'], ['Believing the declared size limits the upload — it does not; /complete must HeadObject.', 'Tin cỡ khai báo giới hạn upload — không phải; /complete phải HeadObject.'], ['Using the filename in the key.', 'Dùng tên file trong khoá.']],
  gt: ['Presigning is where you decide what the URL may do, so the declared type and size are validated here even though they are not trusted later. Putting content-type into the signature turns "this is a video" from a default into a constraint the storage enforces; returning the exact header tells the client what it must send for the signature to match.', 'Ký sẵn là lúc bạn quyết URL được làm gì, nên kiểu và cỡ khai báo được kiểm ở đây dù về sau không được tin. Đưa content-type vào chữ ký biến "đây là video" từ một giá trị mặc định thành ràng buộc storage áp đặt; trả đúng header cho client biết họ phải gửi gì để chữ ký khớp.'],
  kn: ['presigned URLs', 'uploads'],
  tns: [tn('signableHeaders', 'header được ký', 'header nằm trong chữ ký')],
  fakes: PRE,
  dau: `/** POST /upload/presign-r2 */
function presignVideo(body, user, { sign, now, rand, maxSize }) {
  // Write your solution here
  const key = 'video/u' + user.id + '/' + body.filename;
  const url = sign({ method: 'PUT', key, contentType: body.contentType, expiresIn: 3600 });
  return { status: 200, body: { url, key, expiresIn: 3600 } };
}
`,
  giai: '// Reference solution\n' + nguon(presignVideo),
  cases: [
    { goi: '[presignVideo({ filename: "Holiday.MP4", contentType: "video/mp4", size: 118 * 1024 * 1024 }, { id: 7 }, OPTS), signed]', moTa: ['A 118 MB video', 'Một video 118 MB'] },
    { goi: '[presignVideo({ filename: "x.mp4", contentType: "text/html", size: 39 }, { id: 7 }, OPTS), presignVideo({ filename: "x.mp4", contentType: "video/mp4", size: 39 }, null, OPTS), signed.length]', moTa: ['text/html and no user', 'text/html và không có người dùng'] },
    { goi: '[presignVideo({ filename: "big.mov", contentType: "video/quicktime", size: 200 * 1024 * 1024 }, { id: 7 }, OPTS), presignVideo({ filename: "a.mp4", contentType: "video/mp4", size: "5MB" }, { id: 7 }, OPTS)]', moTa: ['Too large / size not a number', 'Quá cỡ / size không phải số'] },
    { goi: '[presignVideo({ filename: "../../etc/passwd", contentType: "video/webm", size: 1 }, { id: 12 }, OPTS), presignVideo({ contentType: "VIDEO/MP4", size: 1 }, { id: 12 }, OPTS), presignVideo({ filename: "a.mp4", contentType: "video/mp4; codecs=avc1", size: 1 }, { id: 12 }, OPTS), presignVideo({ filename: "a.mp4", contentType: "video/mp4", size: -1 }, { id: 12 }, OPTS), presignVideo(undefined, { id: 12 }, OPTS)]', an: true },
    { goi: '(() => { presignVideo({ filename: "a.mp4", contentType: "video/mp4", size: 1 }, { id: 3 }, OPTS); return signed[0]; })()', an: true },
  ],
});

/* ─── L3. HARD · js — đường ống ảnh ─── */
async function processImageUpload(file, { user, gate, decode, storage, db, now, rand, limits }) {
  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const fail = (status, error) => ({ status, body: { error } });
  // 0) bytes first: the cheapest possible check
  if (file.size > limits.maxBytes) return fail(413, 'TOO_LARGE');
  // 1) gate one — strings the client wrote (10.3: by MIME AND by name; octet-stream skips the family check)
  const type = String(file.mimetype || '').split(';')[0].trim().toLowerCase();
  if (['text/html', 'application/xhtml+xml', 'image/svg+xml', 'application/javascript', 'text/javascript', 'application/xml', 'text/xml', 'application/x-httpd-php'].includes(type)) return fail(415, 'DANGEROUS_TYPE');
  if (/\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i.test(String(file.originalname || ''))) return fail(415, 'DANGEROUS_EXT');
  if (type !== '' && type !== 'application/octet-stream' && !type.startsWith('image/')) return fail(415, 'WRONG_FAMILY');
  // 2) gate two — the first bytes (fail fast on a renamed shell)
  const b = file.bytes;
  const at = (o, sig) => sig.every((x, i) => b[o + i] === x);
  const asc = (o, s) => at(o, Array.from(s, (ch) => ch.charCodeAt(0)));
  const sniffed = at(0, [0xff, 0xd8, 0xff]) ? 'image/jpeg' : at(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) ? 'image/png'
    : (asc(0, 'GIF87a') || asc(0, 'GIF89a')) ? 'image/gif' : (asc(0, 'RIFF') && asc(8, 'WEBP')) ? 'image/webp' : null;
  if (!IMAGE_TYPES.includes(sniffed)) return fail(415, 'NOT_AN_IMAGE');
  // 3) gate three — the pixel budget from the PNG header, before any decoder allocates anything
  if (sniffed === 'image/png' && b.length >= 24) {
    const u32 = (i) => b[i] * 2 ** 24 + b[i + 1] * 2 ** 16 + b[i + 2] * 2 ** 8 + b[i + 3];
    if (u32(16) * u32(20) > limits.maxPixels) return fail(413, 'TOO_MANY_PIXELS');
  }
  // 4) the real test is a decode — bounded by the gate, and a failure is the USER's file: 400, not 500
  let out;
  try {
    out = await gate.run(() => decode(b, { width: 1200, format: 'webp', quality: 80, limitInputPixels: limits.maxPixels }));
  } catch {
    return fail(400, 'CORRUPT_IMAGE');
  }
  // 5) store the OUTPUT under a server-chosen .webp key, with headers that can never disagree with the bytes
  const key = 'images/post/u' + user.id + '/' + now + '-' + rand + '.webp';
  await storage.put(key, out.bytes, { contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable' });
  // 6) the row last — it describes an object that exists
  await db.createMedia({ ownerId: user.id, key, width: out.width, height: out.height, size: out.bytes.length });
  return { status: 201, body: { key, width: out.width, height: out.height } };
}

const PIPE = String.raw`
function hex(h) { const a = []; for (let i = 0; i < h.length; i += 2) a.push(parseInt(h.slice(i, i + 2), 16)); return a; }
function pngHeader(w, h) { const be = (n) => [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256]; return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, ...be(w), ...be(h), 8, 2, 0, 0, 0]; }
const text = (a) => String.fromCharCode(...a);
const st = { decodes: 0, now: 0, max: 0 };
// fake sharp: corrupt GIF+HTML polyglot throws like the lesson; anything else decodes to fresh WebP bytes (no trailer survives)
async function decode(b, opts) { st.decodes++; st.now++; st.max = Math.max(st.max, st.now); await new Promise((r) => setTimeout(r, 50)); st.now--; const s = text(b);
  if (s.startsWith('GIF') && s.includes('<script')) throw new Error('Input buffer has corrupt header: gifload_buffer: Invalid frame data');
  if (s.includes('BROKEN')) throw new Error('VipsJpeg: Premature end of input file');
  return { bytes: bytes('RIFF....WEBPVP8 pixels-only'), width: Math.min(opts.width, 4032), height: 900 }; }
function makeGate(max) { let running = 0; const q = []; const pump = () => { while (running < max && q.length) q.shift()(); };
  return { run(task) { return new Promise((res, rej) => { q.push(() => { running++; Promise.resolve().then(task).then(res, rej).finally(() => { running--; pump(); }); }); pump(); }); } }; }
const store = { objects: {}, async put(key, b, h) { this.objects[key] = { text: text(b), ...h }; } };
const db = { rows: [], async createMedia(r) { this.rows.push(r); return r; } };
const DEPS = { user: { id: 7 }, gate: makeGate(4), decode, storage: store, db, now: 1753660000000, rand: 'a1b2c3d4e5f6', limits: { maxBytes: 10 * 1024 * 1024, maxPixels: 100000000 } };
const JPEG = hex('ffd8ffdb004300030202020202030202');
const photo = (extra) => ({ originalname: 'IMG_0001.jpg', mimetype: 'image/jpeg', bytes: JPEG.concat(bytes(extra || '')), size: 7183099 });
`;

const STARTER3 = `/** The image upload route: validate, process, store. */
async function processImageUpload(file, { user, gate, decode, storage, db, now, rand, limits }) {
  // Write your solution here (this version stores whatever it was given)
  if (!file.mimetype.startsWith('image/')) return { status: 415, body: { error: 'WRONG_FAMILY' } };
  const key = 'images/post/u' + user.id + '/' + now + '-' + file.originalname;
  await storage.put(key, file.bytes, { contentType: file.mimetype, cacheControl: 'public, max-age=31536000, immutable' });
  await db.createMedia({ ownerId: user.id, key, width: 0, height: 0, size: file.size });
  return { status: 201, body: { key, width: 0, height: 0 } };
}
`;

const L3 = jsBai({
  ten: 'Lab 10 · 3 — The image pipeline: refuse, sniff, count, decode, store the output', kho: 'HARD', phut: 45, diem: 40, dangBai: 'lab',
  en: `<p>The starter stores whatever it receives, under a key containing the client’s filename, with the client’s MIME. Rewrite <code>async processImageUpload(file, deps)</code> → <code>{ status, body }</code>. <code>file = { originalname, mimetype, bytes, size }</code>; <code>deps = { user, gate, decode, storage, db, now, rand, limits:{ maxBytes, maxPixels } }</code>.</p>
<ol><li><code>file.size &gt; limits.maxBytes</code> → 413 <code>TOO_LARGE</code>;</li>
<li>gate one (10.3): normalised MIME in the dangerous list → 415 <code>DANGEROUS_TYPE</code>; name with a dangerous last extension → 415 <code>DANGEROUS_EXT</code>; a MIME that is neither empty, nor <code>application/octet-stream</code>, nor <code>image/…</code> → 415 <code>WRONG_FAMILY</code>;</li>
<li>sniff the bytes: not jpeg/png/gif/webp → 415 <code>NOT_AN_IMAGE</code>;</li>
<li>a PNG whose header says more than <code>limits.maxPixels</code> pixels → 413 <code>TOO_MANY_PIXELS</code> — <b>without calling decode</b>;</li>
<li><code>out = await gate.run(() =&gt; decode(bytes, { width:1200, format:'webp', quality:80, limitInputPixels: limits.maxPixels }))</code>; if it throws → 400 <code>CORRUPT_IMAGE</code> (the user’s file is wrong — not a 500);</li>
<li><code>key = images/post/u&lt;id&gt;/&lt;now&gt;-&lt;rand&gt;.webp</code>; <code>await storage.put(key, out.bytes, { contentType:'image/webp', cacheControl:'public, max-age=31536000, immutable' })</code>;</li>
<li><code>await db.createMedia({ ownerId, key, width, height, size: out.bytes.length })</code> → 201 <code>{ key, width, height }</code>.</li></ol>
<p>Error bodies are <code>{ error: CODE }</code>. The tests replay the lesson: a renamed PHP shell, the SVG, the GIF+HTML polyglot, a real JPEG with <code>&lt;script&gt;</code> appended (stored output must not contain it), the 256 MP bomb, and eight uploads at once (at most 4 decodes).</p>${MOI_TRUONG.en}`,
  vi: `<p>Code khởi đầu lưu mọi thứ nó nhận, dưới khoá chứa tên file của client, với MIME của client. Viết lại <code>async processImageUpload(file, deps)</code> → <code>{ status, body }</code>. <code>file = { originalname, mimetype, bytes, size }</code>; <code>deps = { user, gate, decode, storage, db, now, rand, limits:{ maxBytes, maxPixels } }</code>.</p>
<ol><li><code>file.size &gt; limits.maxBytes</code> → 413 <code>TOO_LARGE</code>;</li>
<li>cổng một (10.3): MIME đã chuẩn hoá thuộc danh sách nguy hiểm → 415 <code>DANGEROUS_TYPE</code>; tên có đuôi cuối nguy hiểm → 415 <code>DANGEROUS_EXT</code>; MIME không rỗng, không phải <code>application/octet-stream</code>, không phải <code>image/…</code> → 415 <code>WRONG_FAMILY</code>;</li>
<li>đọc magic bytes: không phải jpeg/png/gif/webp → 415 <code>NOT_AN_IMAGE</code>;</li>
<li>PNG có header nói nhiều hơn <code>limits.maxPixels</code> điểm ảnh → 413 <code>TOO_MANY_PIXELS</code> — <b>không gọi decode</b>;</li>
<li><code>out = await gate.run(() =&gt; decode(bytes, { width:1200, format:'webp', quality:80, limitInputPixels: limits.maxPixels }))</code>; ném lỗi → 400 <code>CORRUPT_IMAGE</code> (file của người dùng sai — không phải 500);</li>
<li><code>key = images/post/u&lt;id&gt;/&lt;now&gt;-&lt;rand&gt;.webp</code>; <code>await storage.put(key, out.bytes, { contentType:'image/webp', cacheControl:'public, max-age=31536000, immutable' })</code>;</li>
<li><code>await db.createMedia({ ownerId, key, width, height, size: out.bytes.length })</code> → 201 <code>{ key, width, height }</code>.</li></ol>
<p>Thân lỗi là <code>{ error: MÃ }</code>. Bộ kiểm diễn lại bài: shell PHP đổi tên, SVG, file lai GIF+HTML, JPEG thật nối <code>&lt;script&gt;</code> (bản lưu không được chứa nó), quả bom 256 MP, và tám upload cùng lúc (tối đa 4 lần giải mã).</p>${MOI_TRUONG.vi}`,
  yc: [['Reuse your code from 10.2–10.3 (assertSafeUploadType, sniff, checkPixels).', 'Dùng lại code của bạn ở 10.2–10.3 (assertSafeUploadType, sniff, checkPixels).'], ['Store out.bytes, never file.bytes; never put the original filename in the key.', 'Lưu out.bytes, không bao giờ file.bytes; không bao giờ đưa tên file gốc vào khoá.']],
  goiY: [['Order is the whole design: bytes → strings → 6 bytes → 24 bytes → decode → store → row.', 'Thứ tự là cả thiết kế: byte → chuỗi → 6 byte → 24 byte → giải mã → lưu → dòng.'], ['Wrap only the decode in try/catch: a storage failure is your problem (500), a decode failure is the user’s (400).', 'Chỉ bọc lần giải mã trong try/catch: storage hỏng là vấn đề của bạn (500), giải mã hỏng là của người dùng (400).'], ['Run the decode through <code>deps.gate.run</code> — calling decode directly lets eight uploads decode at once.', 'Chạy giải mã qua <code>deps.gate.run</code> — gọi thẳng decode cho tám upload giải mã cùng lúc.']],
  loi: [['Storing the input "because it passed every check" — the appended &lt;script&gt; is on your media domain.', 'Lưu bản vào "vì nó đã qua mọi phép kiểm" — &lt;script&gt; nối thêm nằm trên tên miền media của bạn.'], ['Calling decode before the pixel check: the bomb has already cost its RAM.', 'Gọi decode trước khi kiểm điểm ảnh: quả bom đã ăn RAM rồi.'], ['Mapping a decode error to 500: the user retries forever and your alerts fire for their bad file.', 'Đổi lỗi giải mã thành 500: người dùng thử lại mãi còn cảnh báo của bạn kêu vì file xấu của họ.']],
  gt: ['This is the three-layer design of src/storage/uploadService.ts and imageOptimizer.ts: cheap refusals first, then the decode that is simultaneously the format conversion, the payload strip and the "is this really an image" test — bounded by a pixel budget and a gate. Storing the re-encoded output under a server-chosen .webp key with matching Content-Type means the served headers can never disagree with the bytes, and nothing that was not a pixel survives the trip.', 'Đây là thiết kế ba lớp của src/storage/uploadService.ts và imageOptimizer.ts: từ chối rẻ trước, rồi lần giải mã đồng thời là đổi định dạng, gỡ payload và phép kiểm "có thật là ảnh không" — bị chặn bởi ngân sách điểm ảnh và một cổng. Lưu bản re-encode dưới khoá .webp do máy chủ chọn với Content-Type khớp nghĩa là header phục vụ không bao giờ trái với byte, và thứ gì không phải điểm ảnh đều không sống sót.'],
  kn: ['upload validation', 'decompression bombs', 'concurrency'],
  tns: [tn('re-encode', 'mã hoá lại', 'giải mã thành điểm ảnh rồi ghi file mới'), tn('defence in depth', 'phòng thủ nhiều lớp', 'mỗi lớp bắt điều lớp khác bỏ sót')],
  fakes: PIPE,
  dau: STARTER3,
  giai: '// Reference solution\n' + nguon(processImageUpload),
  cases: [
    { goi: '[await processImageUpload(photo(), DEPS), store.objects, db.rows]', moTa: ['A real JPEG: re-encoded WebP stored', 'JPEG thật: lưu bản WebP đã re-encode'] },
    { goi: 'await (async () => { const r = await processImageUpload(photo("<script>alert(document.cookie)</script>"), DEPS); const o = Object.values(store.objects)[0]; return [r.status, o.text.includes("<script"), o.contentType]; })()', moTa: ['JPEG + appended HTML: the payload does not survive', 'JPEG + HTML nối thêm: payload không sống sót'] },
    { goi: '[await processImageUpload({ originalname: "shell.png", mimetype: "image/png", bytes: bytes("<?php system($_GET[1]); ?>"), size: 26 }, DEPS), await processImageUpload({ originalname: "logo.svg", mimetype: "image/svg+xml", bytes: bytes("<svg onload=alert(1)>"), size: 21 }, DEPS)]', moTa: ['PHP shell and SVG', 'Shell PHP và SVG'] },
    { goi: '[await processImageUpload({ originalname: "bomb.png", mimetype: "image/png", bytes: pngHeader(16000, 16000), size: 776192 }, DEPS), st.decodes]', moTa: ['The 256 MP bomb is refused without decoding', 'Quả bom 256 MP bị từ chối mà không giải mã'] },
    { goi: '[await processImageUpload({ originalname: "x.gif", mimetype: "image/gif", bytes: bytes("GIF89a/**/=1;<script>alert(1)</script>"), size: 38 }, DEPS), Object.keys(store.objects).length, db.rows.length]', an: true },
    { goi: 'await (async () => { const t0 = Date.now(); const rs = await Promise.all(Array.from({ length: 8 }, () => processImageUpload(photo(), DEPS))); return [rs.map((r) => r.status), st.max, Date.now() - t0]; })()', an: true },
    { goi: '[await processImageUpload({ ...photo(), size: 11 * 1024 * 1024 }, DEPS), await processImageUpload({ ...photo(), mimetype: "application/pdf" }, DEPS), await processImageUpload({ ...photo(), mimetype: "application/octet-stream", originalname: "drop" }, DEPS), await processImageUpload({ ...photo(), originalname: "x.PHTML" }, DEPS), await processImageUpload({ ...photo("BROKEN") }, DEPS), await processImageUpload({ originalname: "a.png", mimetype: "", bytes: bytes("hello"), size: 5 }, DEPS)]', an: true },
    { goi: '[await processImageUpload({ originalname: "ok.png", mimetype: "image/png", bytes: pngHeader(4032, 3024), size: 1000 }, DEPS), db.rows]', an: true },
  ],
});

export default modul('nodejs-10-lab-upload-pipeline', 'Lab 10 — The Notes upload pipeline', [L1, L2, L3]);
