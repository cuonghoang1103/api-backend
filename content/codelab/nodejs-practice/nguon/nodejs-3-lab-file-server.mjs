/** Node.js · Lab chương 3 — File server không framework: GET /files/:name an toàn (path + fs + Buffer + http) và nhận upload có giới hạn + backpressure (stream + EventEmitter). */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, FAKE_EMITTER, FAKE_RAW_RES } from './_node-c3-5.mjs';

/* ─── Lab 3 · 1 — đọc lại các luật ─── */
const E1 = {
  ...cs({
    ten: 'Lab 3 · 1 — Which lesson does each line come from?', kho: 'EASY', phut: 6,
    en: 'The lab builds a tiny file server with nothing but core modules: <code>GET /files/:name</code> and an upload endpoint. Before writing it, match each line of the plan with the rule it applies.',
    vi: 'Lab dựng một file server nhỏ chỉ bằng module lõi: <code>GET /files/:name</code> và một endpoint upload. Trước khi viết, ghép mỗi dòng của kế hoạch với luật mà nó áp dụng.',
    cau: [
      q('c1', ['<code>const full = safeResolve(root, name)</code> runs BEFORE any fs call. Why?', '<code>const full = safeResolve(root, name)</code> chạy TRƯỚC mọi lời gọi fs. Vì sao?'],
        ['A name like ../../etc/passwd must be refused without touching the disk (3.1, path traversal)', 'fs.readFile cannot open relative paths, so the path must be resolved first', 'safeResolve also checks that the file exists, saving one fs call', 'It converts the name to bytes so Content-Length is right'],
        ['Decide on the normalised path, then read. A traversal attempt should cost you nothing and reveal nothing.', 'Quyết định trên đường đã chuẩn hoá, rồi mới đọc. Một lần thử duyệt ngược không được tốn gì và không lộ gì.']),
      q('c2', ['The file exists but <code>readFile</code> fails with <code>EMFILE</code>. The response is…', 'File có thật nhưng <code>readFile</code> lỗi <code>EMFILE</code>. Phản hồi là…'],
        ['500 with a generic message — it is our problem, and the error text is logged, not sent', '404, because the client could not get the file', '400, because the request caused too many open files', '503 with the full error message so the client can retry'],
        ['ENOENT/EACCES/EISDIR are about the request; anything else is a server fault. Never echo internal error messages (they leak paths).', 'ENOENT/EACCES/EISDIR là chuyện của request; mọi thứ khác là lỗi phía server. Không bao giờ gửi lại thông điệp lỗi nội bộ (chúng lộ đường dẫn).']),
      q('c3', ['Content-Length for a binary file is <code>bytes.length</code>, but for a JSON body it is <code>utf8Length(body)</code>. Why the difference?', 'Content-Length của file nhị phân là <code>bytes.length</code>, còn của body JSON là <code>utf8Length(body)</code>. Vì sao khác?'],
        ['The file is already bytes; the JSON is a string whose byte size must be computed (3.2)', 'Binary files are sent without encoding, so their length is in characters', 'utf8Length is slower, so it is only used for small bodies', 'Content-Length is optional for JSON responses'],
        ['Content-Length is always bytes. A Buffer’s length IS its byte count; a string’s .length is not.', 'Content-Length luôn là byte. length của Buffer CHÍNH LÀ số byte; .length của chuỗi thì không.']),
      q('c4', ['During an upload, <code>dest.write(chunk)</code> returns false. The handler should…', 'Trong lúc upload, <code>dest.write(chunk)</code> trả false. Handler nên…'],
        ['req.pause(), and req.resume() when dest emits "drain" (3.3, backpressure)', 'reject the upload with 503 because the disk is full', 'keep the chunk in an array and write it later', 'call dest.end() to flush, then continue writing'],
        ['The request is a Readable you can pause. Without it, a fast client fills your memory with chunks the disk cannot take yet.', 'Request là một Readable có thể tạm dừng. Thiếu bước này, client nhanh lấp đầy RAM của bạn bằng các chunk mà đĩa chưa nhận kịp.']),
    ],
    goiY: [['Lessons 3.1 → 3.5 each own one line of the plan.', 'Mỗi bài 3.1 → 3.5 sở hữu một dòng của kế hoạch.'], ['Ask: is this error about the request, or about us?', 'Hỏi: lỗi này là do request, hay do mình?']],
    loi: [['Reading the file first and checking the path afterwards.', 'Đọc file trước rồi mới kiểm đường dẫn.'], ['Sending err.message to the client on a 500.', 'Gửi err.message cho client khi lỗi 500.']],
    tns: [tn('core modules', 'module lõi (có sẵn trong Node)'), tn('upload', 'tải lên')],
    kn: ['path', 'fs', 'Buffer', 'streams', 'http'],
  }),
  dangBai: 'lab',
};

/* ─── Lab 3 · 2 — GET /files/:name ─── */
const PROVIDED = `// ── provided: your solutions from lessons 3.1 and 3.5 ──
function normalizeAbs(p) {
  const stack = [];
  for (const seg of p.split('/')) { if (seg === '' || seg === '.') continue; if (seg === '..') stack.pop(); else stack.push(seg); }
  return '/' + stack.join('/');
}
function safeResolve(root, name) {
  const full = normalizeAbs(name.startsWith('/') ? name : root + '/' + name);
  if (!full.startsWith(normalizeAbs(root) + '/')) throw new Error('invalid path');
  return full;
}
function utf8Length(str) {
  let n = 0;
  for (const ch of str) { const cp = ch.codePointAt(0); n += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4; }
  return n;
}
function sendJson(res, status, data, extraHeaders) {
  const body = JSON.stringify(data);
  res.writeHead(status, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': utf8Length(body) }, extraHeaders || {}));
  res.end(body);
}
const MIME = { '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8', '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf' };
`;
function extOf(name) {
  // the extension of the last segment, from its last dot; a leading dot (".env") is not an extension
  const base = name.slice(name.lastIndexOf('/') + 1);
  const dot = base.lastIndexOf('.');
  return dot <= 0 ? '' : base.slice(dot).toLowerCase();
}
async function serveFile(fs, root, req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method Not Allowed' }, { Allow: 'GET' });
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (!pathname.startsWith('/files/')) return sendJson(res, 404, { error: 'Not Found' });
  // 1. decide on the path BEFORE touching the disk
  let full;
  try {
    full = safeResolve(root, decodeURIComponent(pathname.slice('/files/'.length)));   // %2e%2e%2f is ../ too
  } catch {
    return sendJson(res, 400, { error: 'Invalid path' });
  }
  // 2. just read it — no exists() check (3.1)
  let bytes;
  try {
    bytes = await fs.readFile(full);
  } catch (err) {
    if (err.code === 'ENOENT') return sendJson(res, 404, { error: 'Not Found' });
    if (err.code === 'EACCES') return sendJson(res, 403, { error: 'Forbidden' });
    if (err.code === 'EISDIR') return sendJson(res, 400, { error: 'Is a directory' });
    console.error('[serveFile]', err.code, err.message);                // log it, never send it
    return sendJson(res, 500, { error: 'Internal Server Error' });
  }
  // 3. bytes are bytes: Content-Length is their count (3.2)
  res.writeHead(200, { 'Content-Type': MIME[extOf(full)] || 'application/octet-stream', 'Content-Length': bytes.length });
  res.end(bytes);
}
const FS_BYTES = `${FAKE_RAW_RES}
function bytesOf(s) { return new Uint8Array(Array.from(s).map(function (ch) { return ch.charCodeAt(0) & 255; })); }
function mkFs(files) { var calls = [];
function fail(code, msg, p) { var e = new Error(code + ': ' + msg + ", open '" + p + "'"); e.code = code; return e; }
return { calls: calls, readFile: function (p) { calls.push(p); return new Promise(function (ok, no) { setTimeout(function () { var v = files[p];
  if (v === undefined) return no(fail('ENOENT', 'no such file or directory', p)); if (v === '#EACCES') return no(fail('EACCES', 'permission denied', p));
  if (v === '#EISDIR') return no(fail('EISDIR', 'illegal operation on a directory, read', p)); if (v === '#EMFILE') return no(fail('EMFILE', 'too many open files', p));
  ok(bytesOf(v)); }, 2); }); } }; }
async function get(fs, url, method) { var res = mkRes(); await serveFile(fs, '/srv/files', { method: method || 'GET', url: url, headers: {} }, res); var r = res.rec; var body = r.body;
  if (r.headers['content-type'] && /json/.test(r.headers['content-type'])) body = JSON.parse(body); else if (body !== null) body = 'bytes:' + String(body).split(',').length;
  return { status: r.status, type: r.headers['content-type'] || null, length: r.headers['content-length'] === undefined ? null : Number(r.headers['content-length']), allow: r.headers.allow || null, body: body, ends: r.ends, fsCalls: fs.calls.slice(), errors: r.errors }; }`;
const E2 = nodeBai({
  ten: 'Lab 3 · 2 — GET /files/:name with no framework', kho: 'HARD', phut: 35, dangBai: 'lab',
  en: `<p><b>Brief.</b> Serve files from <code>root = /srv/files</code> with a raw <code>node:http</code> handler. Write <code>async serveFile(fs, root, req, res)</code> (<code>fs.readFile(path)</code> resolves a <b>Uint8Array</b> like a Buffer, or rejects with a real <code>err.code</code>). Provided: <code>safeResolve</code>, <code>utf8Length</code>, <code>sendJson(res, status, data, extraHeaders?)</code> and the <code>MIME</code> table.</p>
<table><thead><tr><th>#</th><th>situation</th><th>response</th></tr></thead><tbody>
<tr><td>1</td><td>method is not GET</td><td>405 <code>{ error: "Method Not Allowed" }</code> + header <code>Allow: GET</code></td></tr>
<tr><td>2</td><td>path does not start with <code>/files/</code></td><td>404 <code>{ error: "Not Found" }</code></td></tr>
<tr><td>3</td><td>the name (URL-decoded with <code>decodeURIComponent</code>) escapes root, or cannot be decoded</td><td>400 <code>{ error: "Invalid path" }</code> — <b>without calling fs</b></td></tr>
<tr><td>4</td><td>ENOENT / EACCES / EISDIR</td><td>404 Not Found / 403 Forbidden / 400 Is a directory (same <code>{ error }</code> shape)</td></tr>
<tr><td>5</td><td>any other fs error</td><td>500 <code>{ error: "Internal Server Error" }</code> — never the error message</td></tr>
<tr><td>6</td><td>found</td><td>200, <code>Content-Type</code> from the extension (lower-cased, <code>application/octet-stream</code> if unknown), <code>Content-Length</code> = number of bytes, body = the bytes</td></tr></tbody></table>
<p>Every request ends with exactly one response.</p>`,
  vi: `<p><b>Đề.</b> Phục vụ file từ <code>root = /srv/files</code> bằng một handler <code>node:http</code> thuần. Viết <code>async serveFile(fs, root, req, res)</code> (<code>fs.readFile(path)</code> resolve một <b>Uint8Array</b> giống Buffer, hoặc reject với <code>err.code</code> thật). Có sẵn: <code>safeResolve</code>, <code>utf8Length</code>, <code>sendJson(res, status, data, extraHeaders?)</code> và bảng <code>MIME</code>.</p>
<table><thead><tr><th>#</th><th>tình huống</th><th>phản hồi</th></tr></thead><tbody>
<tr><td>1</td><td>method không phải GET</td><td>405 <code>{ error: "Method Not Allowed" }</code> + header <code>Allow: GET</code></td></tr>
<tr><td>2</td><td>đường dẫn không bắt đầu bằng <code>/files/</code></td><td>404 <code>{ error: "Not Found" }</code></td></tr>
<tr><td>3</td><td>tên (giải mã URL bằng <code>decodeURIComponent</code>) thoát khỏi root, hoặc không giải mã được</td><td>400 <code>{ error: "Invalid path" }</code> — <b>không gọi fs</b></td></tr>
<tr><td>4</td><td>ENOENT / EACCES / EISDIR</td><td>404 Not Found / 403 Forbidden / 400 Is a directory (cùng dạng <code>{ error }</code>)</td></tr>
<tr><td>5</td><td>lỗi fs khác</td><td>500 <code>{ error: "Internal Server Error" }</code> — không bao giờ gửi thông điệp lỗi</td></tr>
<tr><td>6</td><td>tìm thấy</td><td>200, <code>Content-Type</code> theo phần mở rộng (viết thường, không biết thì <code>application/octet-stream</code>), <code>Content-Length</code> = số byte, thân = các byte</td></tr></tbody></table>
<p>Mọi request kết thúc bằng đúng một phản hồi.</p>`,
  dauVao: ['fs (fake fs/promises), root, req { method, url }, res (node:http response)', 'fs (fs/promises giả), root, req { method, url }, res (response của node:http)'], dauRa: ['one response per request (see the table)', 'mỗi request một phản hồi (xem bảng)'],
  yc: [['Check the path before any fs call; a traversal attempt must make zero fs calls.', 'Kiểm đường dẫn trước mọi lời gọi fs; một lần thử duyệt ngược phải có không lời gọi fs nào.'], ['return in front of every response.', 'return trước mọi phản hồi.']],
  goiY: [['Order: method → prefix → decode + safeResolve (one try/catch) → readFile (one try/catch) → 200.', 'Thứ tự: method → tiền tố → decode + safeResolve (một try/catch) → readFile (một try/catch) → 200.'], ['decodeURIComponent("%E0%A4%A") throws URIError — the same catch turns it into 400.', 'decodeURIComponent("%E0%A4%A") ném URIError — cùng catch đó biến nó thành 400.'], ['The extension: last segment, last dot, dot not at position 0, toLowerCase() — "PHOTO.PNG" is image/png.', 'Phần mở rộng: đoạn cuối, dấu chấm cuối, dấu chấm không ở vị trí 0, toLowerCase() — "PHOTO.PNG" là image/png.']],
  loi: [['Checking for ".." in the raw URL: %2e%2e%2f decodes to ../ after your check.', 'Tìm ".." trong URL thô: %2e%2e%2f giải mã thành ../ sau khi bạn đã kiểm.'], ['Content-Length from a string conversion of the bytes instead of bytes.length.', 'Content-Length từ việc đổi các byte thành chuỗi thay vì bytes.length.'], ['catch (err) { sendJson(res, 500, { error: err.message }) } — leaks "/srv/files/…" to the client.', 'catch (err) { sendJson(res, 500, { error: err.message }) } — lộ "/srv/files/…" cho client.']],
  gt: ['Each lesson of chapter 3 owns one line: path decides (3.1), fs is tried, not pre-checked (3.1), bytes give Content-Length (3.2), and the raw http rules — status, headers, exactly one end — are yours to keep (3.5). Lesson 5.3’s <code>express.static()</code> does all of this, plus ETag/304; now you know what it is saving you from.', 'Mỗi bài của chương 3 sở hữu một dòng: path quyết định (3.1), fs được thử chứ không kiểm trước (3.1), byte cho ra Content-Length (3.2), và các luật của http thuần — status, header, đúng một lần end — là việc của bạn (3.5). <code>express.static()</code> ở bài 5.3 làm tất cả những điều này, thêm ETag/304; giờ bạn biết nó đang cứu bạn khỏi những gì.'],
  kn: ['http', 'path', 'fs', 'Buffer'], tns: [tn('MIME type', 'kiểu nội dung', 'image/png, text/plain…'), tn('405 Method Not Allowed', 'phương thức không được phép'), tn('URL decoding', 'giải mã URL (%xx)')],
  chung: FS_BYTES,
  dau: `${PROVIDED}
/** GET /files/:name — safe path, real error codes, bytes on the wire */
async function serveFile(fs, root, req, res) {
  // Write your solution here — this version reads first and checks nothing
  const name = req.url.slice('/files/'.length);
  try {
    const bytes = await fs.readFile(root + '/' + name);
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': String(bytes).length });
    res.end(bytes);
  } catch (err) {
    sendJson(res, 404, { error: err.message });
  }
}
`,
  giai: `${PROVIDED}
// Reference solution — decide on the path, try the read, map the error codes
${nguon(extOf, serveFile)}`,
  cases: [
    { chuanBi: "const fs = mkFs({ '/srv/files/hello.txt': 'xin chao' });", goi: 'await get(fs, "/files/hello.txt")', moTa: ['A text file: type, length, bytes', 'File chữ: kiểu, độ dài, byte'] },
    { chuanBi: 'const fs = mkFs({});', goi: 'await get(fs, "/files/../../etc/passwd")', moTa: ['Traversal: 400 and zero fs calls', 'Duyệt ngược: 400 và không lời gọi fs nào'] },
    { chuanBi: 'const fs = mkFs({});', goi: 'await get(fs, "/files/missing.png")', moTa: ['ENOENT → 404', 'ENOENT → 404'] },
    { chuanBi: "const fs = mkFs({ '/srv/files/a.txt': 'a' });", goi: 'await get(fs, "/files/a.txt", "POST")', moTa: ['POST → 405 + Allow', 'POST → 405 + Allow'] },
    { chuanBi: 'const fs = mkFs({});', goi: '[await get(fs, "/files/%2e%2e%2f%2e%2e%2fetc%2fpasswd"), await get(fs, "/files/%E0%A4%A")]', an: true },
    { chuanBi: "const fs = mkFs({ '/srv/files/secret.txt': '#EACCES', '/srv/files/docs': '#EISDIR', '/srv/files/x.txt': '#EMFILE' });", goi: '[await get(fs, "/files/secret.txt"), await get(fs, "/files/docs"), await get(fs, "/files/x.txt")]', an: true },
    { chuanBi: "const fs = mkFs({ '/srv/files/2026/PHOTO.PNG': 'abcdef', '/srv/files/data.bin': 'zz', '/srv/files/.env': 'K=V' });", goi: '[await get(fs, "/files/2026/./PHOTO.PNG"), await get(fs, "/files/data.bin"), await get(fs, "/files/.env")]', an: true },
    { chuanBi: "const fs = mkFs({ '/srv/files/ghi chú.txt': 'ok' });", goi: '[await get(fs, "/files/ghi%20ch%C3%BA.txt"), await get(fs, "/other"), await get(fs, "/files/sub/../ghi%20ch%C3%BA.txt?download=1")]', an: true },
  ],
});

/* ─── Lab 3 · 3 — nhận upload: giới hạn + backpressure ─── */
function receiveUpload(req, dest, limitBytes) {
  return new Promise((resolve) => {
    let bytes = 0;
    let done = false;
    const finish = (result) => { if (!done) { done = true; resolve(result); } };
    req.on('data', (chunk) => {
      if (done) return;
      bytes += chunk.length;                       // Uint8Array: length IS bytes
      if (bytes > limitBytes) {
        req.destroy();                             // stop the upload as soon as it is too big
        dest.destroy();                            // and throw away the partial file
        return finish({ status: 413, bytes });
      }
      // backpressure: if the destination is full, pause the request until it drains
      if (!dest.write(chunk)) {
        req.pause();
        dest.once('drain', () => req.resume());
      }
    });
    req.on('end', () => {
      if (done) return;
      dest.once('finish', () => finish({ status: 201, bytes }));   // 201 only when every byte is stored
      dest.end();
    });
    req.on('error', () => {                        // the client disconnected mid-upload
      dest.destroy();
      finish({ status: 500, bytes });
    });
  });
}
const UPLOAD = `${FAKE_EMITTER}
function mkUpload(sizes, failAt) { var r = __em({ destroyed: false, paused: false, pauses: 0 }); var i = 0, timer = null;
r.pause = function () { if (!r.paused) { r.paused = true; r.pauses++; } }; r.resume = function () { r.paused = false; tick(); }; r.destroy = function () { r.destroyed = true; };
function tick() { if (timer !== null) return; timer = setTimeout(function () { timer = null; if (r.destroyed || r.paused) return;
  if (failAt !== undefined && i === failAt) { r.destroyed = true; var e = new Error('aborted'); e.code = 'ECONNRESET'; r.emit('error', e); return; }
  if (i < sizes.length) { var c = new Uint8Array(sizes[i]); i++; r.emit('data', c); tick(); } else r.emit('end'); }, 1); }
tick(); return r; }
function mkDest(hwm, ms) { var d = __em({ buffered: 0, maxBuffered: 0, stored: 0, endCalls: 0, destroyed: false }); var need = false, t = null, ended = false;
function pump() { if (t !== null) return; t = setTimeout(function () { t = null; if (d.destroyed) return; if (d.buffered > 0) { d.buffered--; } if (d.buffered === 0) { if (need) { need = false; d.emit('drain'); } if (ended) { d.emit('finish'); return; } } if (d.buffered > 0) pump(); }, ms); }
d.write = function (c) { if (d.destroyed || ended) return false; d.buffered++; d.stored += c.length; if (d.buffered > d.maxBuffered) d.maxBuffered = d.buffered; pump(); var ok = d.buffered < hwm; if (!ok) need = true; return ok; };
d.end = function () { d.endCalls++; ended = true; if (d.buffered === 0) setTimeout(function () { d.emit('finish'); }, 0); };
d.destroy = function () { d.destroyed = true; };
return d; }
function snap(r, d, out) { return { result: out, stored: d.stored, maxBuffered: d.maxBuffered, endCalls: d.endCalls, destDestroyed: d.destroyed, reqDestroyed: r.destroyed, pausedSometimes: r.pauses > 0 }; }`;
const E3 = nodeBai({
  ten: 'Lab 3 · 3 — Receive an upload: byte limit + backpressure', kho: 'HARD', phut: 35, dangBai: 'lab',
  en: `<p><b>Brief.</b> <code>POST /upload</code> streams the request body straight into a writable <code>dest</code> (a file on disk) — never into memory. Write <code>receiveUpload(req, dest, limitBytes)</code> returning a Promise of <code>{ status, bytes }</code>:</p>
<ol><li>On every <code>'data'</code> chunk (a Uint8Array) add its length to <code>bytes</code>.</li>
<li>If <code>bytes</code> goes over <code>limitBytes</code>: <code>req.destroy()</code>, <code>dest.destroy()</code>, resolve <code>{ status: 413, bytes }</code> (bytes counted so far). Do not write that chunk.</li>
<li>Otherwise <code>dest.write(chunk)</code>; if it returns <code>false</code>, <code>req.pause()</code> and <code>req.resume()</code> on the next <code>'drain'</code>.</li>
<li>On <code>'end'</code>: <code>dest.end()</code>, and resolve <code>{ status: 201, bytes }</code> only on dest’s <code>'finish'</code>.</li>
<li>On req <code>'error'</code> (client disconnected): <code>dest.destroy()</code>, resolve <code>{ status: 500, bytes }</code>.</li></ol>
<p>The grader’s fake disk stores one chunk every few ms and records its peak buffer; the fake request really stops emitting while paused.</p>`,
  vi: `<p><b>Đề.</b> <code>POST /upload</code> cho thân request chảy thẳng vào một writable <code>dest</code> (file trên đĩa) — không bao giờ vào RAM. Viết <code>receiveUpload(req, dest, limitBytes)</code> trả về Promise của <code>{ status, bytes }</code>:</p>
<ol><li>Với mỗi chunk <code>'data'</code> (Uint8Array) cộng độ dài của nó vào <code>bytes</code>.</li>
<li>Nếu <code>bytes</code> vượt <code>limitBytes</code>: <code>req.destroy()</code>, <code>dest.destroy()</code>, resolve <code>{ status: 413, bytes }</code> (số byte đã đếm tới lúc đó). Không ghi chunk đó.</li>
<li>Ngược lại <code>dest.write(chunk)</code>; nếu nó trả <code>false</code>, <code>req.pause()</code> và <code>req.resume()</code> ở lần <code>'drain'</code> kế tiếp.</li>
<li>Khi <code>'end'</code>: <code>dest.end()</code>, và chỉ resolve <code>{ status: 201, bytes }</code> ở sự kiện <code>'finish'</code> của dest.</li>
<li>Khi req <code>'error'</code> (client ngắt kết nối): <code>dest.destroy()</code>, resolve <code>{ status: 500, bytes }</code>.</li></ol>
<p>Đĩa giả của máy chấm lưu một chunk mỗi vài ms và ghi lại đỉnh bộ đệm; request giả thật sự ngừng phát khi bị pause.</p>`,
  dauVao: ['req — Readable (data/end/error, pause/resume/destroy); dest — Writable (write/end/destroy, drain/finish)', 'req — Readable (data/end/error, pause/resume/destroy); dest — Writable (write/end/destroy, drain/finish)'], dauRa: ['Promise of { status: 201 | 413 | 500, bytes }', 'Promise của { status: 201 | 413 | 500, bytes }'],
  yc: [['Never collect chunks in an array.', 'Không bao giờ gom chunk vào mảng.'], ['Settle the promise exactly once.', 'Promise chỉ được settle đúng một lần.']],
  goiY: [['Three listeners on req (data, end, error) inside one new Promise.', 'Ba listener trên req (data, end, error) bên trong một new Promise.'], ['Use a done flag: after a 413 more events may still be in flight.', 'Dùng cờ done: sau 413 vẫn có thể còn sự kiện đang trên đường tới.'], ['Pause/resume is the manual version of what pipeline() does for you — 3.3’s writeAll with a Readable as the source.', 'Pause/resume là bản thủ công của việc pipeline() làm giúp bạn — writeAll của bài 3.3 với nguồn là một Readable.']],
  loi: [['Ignoring dest.write()’s false: the fake disk’s buffer climbs to the whole upload.', 'Phớt lờ false của dest.write(): bộ đệm của đĩa giả leo tới cỡ cả upload.'], ['Answering 201 on req "end": the last chunks are not on disk yet — wait for "finish".', 'Trả 201 ở "end" của req: các chunk cuối chưa xuống đĩa — chờ "finish".'], ['On 413, destroying req but leaving dest open: a half-written file stays on disk.', 'Khi 413, huỷ req nhưng để dest mở: một file ghi dở nằm lại trên đĩa.']],
  gt: ['This is lesson 3.3’s backpressure loop with a real Readable as the source, plus the two exits every upload needs (too big, client gone). The grader checks the peak buffer stays at the disk’s highWaterMark, that the request was actually paused, and that a failed upload leaves no open file. Chapter 10 does the same with multipart uploads straight to object storage.', 'Đây là vòng backpressure của bài 3.3 với nguồn là một Readable thật, thêm hai lối thoát mọi upload đều cần (quá lớn, client bỏ đi). Máy chấm kiểm đỉnh bộ đệm giữ ở highWaterMark của đĩa, request thật sự đã bị pause, và upload hỏng không để lại file mở. Chương 10 làm đúng điều này với upload multipart thẳng lên object storage.'],
  kn: ['streams', 'backpressure', 'events', 'http'], tns: [tn('pause / resume', 'tạm dừng / tiếp tục đọc'), tn('destroy', 'huỷ stream (giải phóng tài nguyên)'), tn('ECONNRESET', 'kết nối bị đầu kia cắt')],
  chung: UPLOAD,
  dau: `/** stream an upload into dest: 413 over the limit, backpressure, 201 on finish */
function receiveUpload(req, dest, limitBytes) {
  // Write your solution here — no limit, no backpressure, 201 too early
  return new Promise((resolve) => {
    let bytes = 0;
    req.on('data', (chunk) => { bytes += chunk.length; dest.write(chunk); });
    req.on('end', () => { dest.end(); resolve({ status: 201, bytes }); });
  });
}
`,
  giai: '// Reference solution — count, limit, pause on false, resume on drain, 201 on finish\n' + nguon(receiveUpload),
  cases: [
    { chuanBi: 'const r = mkUpload([100, 100, 100, 100, 100, 100, 100, 100]); const d = mkDest(2, 5);', goi: 'snap(r, d, await receiveUpload(r, d, 10000))', moTa: ['800 bytes into a slow disk: paused, peak ≤ 2, 201 after finish', '800 byte vào đĩa chậm: có pause, đỉnh ≤ 2, 201 sau finish'] },
    { chuanBi: 'const r = mkUpload([400, 400, 400, 400]); const d = mkDest(10, 1);', goi: 'snap(r, d, await receiveUpload(r, d, 1000))', moTa: ['Over the limit at the 3rd chunk → 413, both destroyed', 'Vượt giới hạn ở chunk thứ 3 → 413, huỷ cả hai'] },
    { chuanBi: 'const r = mkUpload([10, 10, 10, 10], 2); const d = mkDest(10, 1);', goi: 'snap(r, d, await receiveUpload(r, d, 1000))', moTa: ['Client disconnects → 500, dest destroyed', 'Client ngắt → 500, dest bị huỷ'], an: true },
    { chuanBi: 'const r = mkUpload(Array.from({ length: 40 }, () => 64)); const d = mkDest(3, 4);', goi: 'snap(r, d, await receiveUpload(r, d, 1e6))', an: true },
    { chuanBi: 'const r = mkUpload([]); const d = mkDest(3, 4);', goi: 'snap(r, d, await receiveUpload(r, d, 10))', an: true },
    { chuanBi: 'const r = mkUpload([5, 5]); const d = mkDest(100, 50); let early = null; receiveUpload(r, d, 100).then((x) => { early = x; });', goi: '(await new Promise((z) => setTimeout(z, 20)), { settledBeforeDiskFinished: early !== null, stillBuffered: d.buffered })', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-3-lab-file-server', ten: 'Lab 3 — A file server with core modules only', khoa: KHOA, baiHoc: 'nodejs-3-5-http-server', de: [E1, E2, E3] });
