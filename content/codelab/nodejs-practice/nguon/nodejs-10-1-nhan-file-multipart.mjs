/** Node.js 10.1 — Nhận file: multipart, base64, và cái giá bằng RAM (base64 +33,33%, memoryStorage vs stream, LIMIT_FILE_SIZE → 413). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Three ways a file gets in, and what each costs', kho: 'EASY', phut: 10,
  en: 'From the lesson: a real multipart body dumped byte for byte, base64 measured at +33.33%, the same 6.85 MB photo received four ways, four 120 MB uploads at once (+729 MB), and multer’s 5 MB limit.',
  vi: 'Từ bài: một thân multipart thật in ra từng byte, base64 đo được +33,33%, cùng ảnh 6,85 MB nhận bốn cách, bốn upload 120 MB cùng lúc (+729 MB), và giới hạn 5 MB của multer.',
  cau: [
    q('m1', ['In the captured body, <code>caption</code> came before <code>file</code>. Why does that matter for a <code>fileFilter</code> that reads <code>req.body.category</code>?', 'Trong thân đã chụp, <code>caption</code> đi trước <code>file</code>. Điều đó quan trọng gì với <code>fileFilter</code> đọc <code>req.body.category</code>?'],
      ['Parts arrive in the order the client sent them: a text field sent after the file is still undefined when the file handler runs', 'multer always parses every text field first, so the order never matters', 'fileFilter runs after the whole body is buffered, so req.body is complete', 'Text fields are sent in the URL, so req.body.category is always available'],
      ['The body is a stream of ordered parts. Decide with fields that arrive in the URL or in headers instead.', 'Thân là dòng các phần có thứ tự. Hãy quyết bằng trường đi trong URL hoặc header.']),
    q('m2', ['Who supplies <code>filename="tiny.txt"</code> and <code>Content-Type: text/plain</code> in a multipart part?', 'Ai cung cấp <code>filename="tiny.txt"</code> và <code>Content-Type: text/plain</code> trong một phần multipart?'],
      ['The client, in plain text, with no verification at all', 'The browser, after sniffing the file’s magic bytes', 'multer, which detects them from the file content', 'The operating system, from the file’s extended attributes'],
      ['Both are strings the client wrote — lesson 10.3 is entirely about what that means.', 'Cả hai là chuỗi do client viết — bài 10.3 nói trọn về hệ quả của điều đó.']),
    q('m3', ['multer with <code>limits.fileSize = 5 MB</code> receives the 6.85 MB photo. What did the lesson measure?', 'multer với <code>limits.fileSize = 5 MB</code> nhận ảnh 6,85 MB. Bài đo được gì?'],
      ['413 LIMIT_FILE_SIZE — after the client had already sent all 7,183,298 bytes', '413 LIMIT_FILE_SIZE — the connection was cut after the first 5 MB', '400 — multer refuses the request as soon as it sees Content-Length', '200 — multer truncates the file to 5 MB and stores the first part'],
      ['A size limit protects your memory and disk, never your bandwidth. Checking Content-Length first is only a hint the client controls.', 'Giới hạn cỡ bảo vệ bộ nhớ và đĩa, không bao giờ bảo vệ băng thông. Kiểm Content-Length trước chỉ là gợi ý do client kiểm soát.']),
    q('m4', ['<code>app.post(\'/u\', upload.single(\'file\'), handler)</code> with no error handler receives an oversized file. Result?', '<code>app.post(\'/u\', upload.single(\'file\'), handler)</code> không có error handler nhận một file quá cỡ. Kết quả?'],
      ['A 500 with a stack trace — MulterError goes into the middleware chain and nobody maps it to 413', 'A clean 413, because multer sends the response itself', 'The handler runs with req.file undefined and returns 200', 'The request hangs until the client times out'],
      ['Call the multer middleware yourself and map err.code (LIMIT_FILE_SIZE → 413), as the lesson’s /limited route does.', 'Tự gọi middleware multer và đổi err.code (LIMIT_FILE_SIZE → 413), như route /limited của bài.']),
    qn('m5', ['Which statements match the RSS measurements? (choose all)', 'Nhận định nào khớp số đo RSS? (chọn mọi câu đúng)'],
      ['base64 in JSON cost +47.2 MB for a 6.85 MB file, about 6.9× the file', 'Four simultaneous 120 MB uploads into memoryStorage cost +729.4 MB', 'busboy streaming to disk cost about 1.25× the file for the photo', 'For images under 10 MB that you re-encode anyway, memoryStorage is a fine default', 'Streaming was both cheaper in memory and faster than buffering for 120 MB'],
      [0, 1, 2, 3],
      ['Streaming 120 MB took 287 ms vs 151 ms buffered: cheaper in memory, NOT free in latency. And you need the whole buffer anyway to re-encode an image.', 'Stream 120 MB mất 287 ms so với 151 ms khi đệm: rẻ bộ nhớ, KHÔNG miễn phí về độ trễ. Và bạn vẫn cần cả buffer để re-encode ảnh.']),
  ],
  goiY: [['Remember the shape of the captured body: boundary, part headers, blank line, content.', 'Nhớ hình dạng thân đã chụp: boundary, header của phần, dòng trống, nội dung.'], ['For the RSS question, re-read the table of four strategies and the 120 MB timings.', 'Với câu RSS, đọc lại bảng bốn chiến lược và thời gian 120 MB.']],
  loi: [['Trusting the filename or the part’s Content-Type.', 'Tin tên file hay Content-Type của phần.'], ['Thinking a size limit saves bandwidth.', 'Nghĩ giới hạn cỡ tiết kiệm băng thông.']],
  tns: [tn('multipart/form-data', 'thân nhiều phần', 'định dạng form HTML dùng để gửi file'), tn('boundary', 'chuỗi phân cách', 'chuỗi chia thân thành các phần'), tn('memoryStorage', 'lưu trong RAM', 'multer giữ cả file trong một Buffer')],
  kn: ['uploads', 'multipart'],
});

/* ─── 2. EASY · js — base64 tốn bao nhiêu ─── */
function base64Length(bytes) {
  // Every 3 input bytes become 4 output characters; a last group of 1 or 2 bytes is padded to 4 with "=".
  return 4 * Math.ceil(bytes / 3);
}

function uploadSeconds(bytes, mbps) {
  // Mbps = megaBITS per second, decimal: bytes × 8 bits ÷ (mbps × 1,000,000). One decimal like the lesson.
  return Math.round((bytes * 8) / (mbps * 1000000) * 10) / 10;
}

const E2 = jsBai({
  ten: 'What base64 costs on a phone’s uplink', kho: 'EASY', phut: 8,
  en: `<p>The lesson: "base64 turns every 3 bytes into 4 characters, so the increase is exactly one third — not an implementation detail, arithmetic". Write:</p>
<ul><li><code>base64Length(bytes)</code> — the length of the base64 text for a file of <code>bytes</code> bytes, padding included (7,183,099 → 9,577,468);</li>
<li><code>uploadSeconds(bytes, mbps)</code> — seconds to send <code>bytes</code> over an uplink of <code>mbps</code> megabits per second (1 Mbps = 1,000,000 bits/s), rounded to 1 decimal (7,183,099 bytes at 5 Mbps → 11.5).</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Bài học: "base64 biến mỗi 3 byte thành 4 ký tự, nên phần tăng thêm đúng bằng một phần ba — không phải chi tiết cài đặt, mà là số học". Viết:</p>
<ul><li><code>base64Length(bytes)</code> — độ dài chuỗi base64 cho file <code>bytes</code> byte, tính cả phần đệm (7.183.099 → 9.577.468);</li>
<li><code>uploadSeconds(bytes, mbps)</code> — số giây gửi <code>bytes</code> qua đường lên <code>mbps</code> megabit mỗi giây (1 Mbps = 1.000.000 bit/s), làm tròn 1 chữ số thập phân (7.183.099 byte ở 5 Mbps → 11,5).</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['A partial last group (1 or 2 bytes) still produces 4 characters: <code>Math.ceil(bytes / 3)</code> groups.', 'Nhóm cuối thiếu (1 hoặc 2 byte) vẫn ra 4 ký tự: <code>Math.ceil(bytes / 3)</code> nhóm.'], ['Bytes to bits is × 8; megabits are decimal (10<sup>6</sup>), not 1024².', 'Byte sang bit là × 8; megabit là thập phân (10<sup>6</sup>), không phải 1024².']],
  loi: [['<code>bytes * 4 / 3</code> without rounding up: 7 bytes give 9.33 instead of 12.', '<code>bytes * 4 / 3</code> không làm tròn lên: 7 byte ra 9,33 thay vì 12.'], ['Forgetting × 8: network speeds are in bits, file sizes in bytes.', 'Quên × 8: tốc độ mạng tính bằng bit, cỡ file tính bằng byte.']],
  gt: ['Base64 encodes 6 bits per character, so 24 bits (3 bytes) need 4 characters and a short last group is padded. That fixed one-third is paid on every upload before the server even starts parsing — 11.5 s become 15.3 s for the lesson’s photo on a 5 Mbps uplink.', 'Base64 mã hoá 6 bit mỗi ký tự, nên 24 bit (3 byte) cần 4 ký tự và nhóm cuối ngắn được đệm. Một phần ba cố định đó bị trả ở mọi lần upload, trước cả khi máy chủ bắt đầu phân tích — 11,5 s thành 15,3 s với ảnh của bài trên đường lên 5 Mbps.'],
  kn: ['base64', 'uploads'],
  tns: [tn('base64', 'mã hoá base64', 'biểu diễn byte bằng 64 ký tự chữ'), tn('padding', 'phần đệm', 'dấu = ở cuối chuỗi base64'), tn('uplink', 'đường lên', 'chiều từ điện thoại lên máy chủ')],
  dau: `/** Length of the base64 text for a file of \`bytes\` bytes. */
function base64Length(bytes) {
  // Write your solution here
  return Math.round(bytes * 4 / 3);
}

/** Seconds to upload \`bytes\` at \`mbps\` megabits per second (1 decimal). */
function uploadSeconds(bytes, mbps) {
  return Math.round(bytes / (mbps * 1000000) * 10) / 10;
}
`,
  giai: '// Reference solution\n' + nguon(base64Length, uploadSeconds),
  cases: [
    { goi: 'base64Length(7183099)', moTa: ['The lesson’s photo', 'Ảnh của bài'] },
    { goi: '[uploadSeconds(7183099, 5), uploadSeconds(9577521, 5)]', moTa: ['Raw vs base64 JSON at 5 Mbps', 'Gốc vs JSON base64 ở 5 Mbps'] },
    { goi: '[base64Length(0), base64Length(1), base64Length(2), base64Length(3), base64Length(4)]', moTa: ['Padding of the last group', 'Phần đệm của nhóm cuối'] },
    { goi: '[base64Length(125829120), base64Length(7), uploadSeconds(125829120, 20), uploadSeconds(1000000, 8)]', an: true },
    { goi: '[uploadSeconds(base64Length(6000000), 5), (base64Length(3000000) / 3000000).toFixed(4)]', an: true },
  ],
});

/* ─── 3. MEDIUM · js — đọc một thân multipart ─── */
function parseMultipart(contentType, body) {
  // 1) The boundary lives in the Content-Type header, possibly quoted.
  const m = /boundary=(?:"([^"]+)"|([^;\s]+))/i.exec(contentType || '');
  if (!m) throw new TypeError('missing boundary');
  // 2) A delimiter is CRLF + "--" + boundary (only at the very start may the CRLF be missing). Prepending a CRLF
  //    lets one split handle both — and "--boundary" INSIDE a value (no CRLF before it) does not cut the value.
  const delimiter = '\r\n--' + (m[1] || m[2]);
  const parts = [];
  for (const chunk of ('\r\n' + body).split(delimiter).slice(1)) {   // piece 0 is the preamble
    if (chunk.startsWith('--')) break;                      // closing delimiter "--boundary--": done
    const sep = chunk.indexOf('\r\n\r\n');                  // part headers end at the first empty line
    if (sep < 0) continue;
    const head = chunk.slice(2, sep);                       // skip the \r\n that ends the delimiter line
    const data = chunk.slice(sep + 4);                      // the CRLF before the next delimiter belongs to it
    const headers = {};
    for (const line of head.split('\r\n')) {
      const i = line.indexOf(':');
      if (i > 0) headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
    const cd = headers['content-disposition'] || '';
    const name = /\bname="([^"]*)"/i.exec(cd);
    const filename = /\bfilename="([^"]*)"/i.exec(cd);
    parts.push({
      name: name ? name[1] : null,
      filename: filename ? filename[1] : null,               // client-supplied: a string, not a fact
      contentType: headers['content-type'] || null,          // client-supplied too
      data,
    });
  }
  return parts;
}

const B = '------------------------ZroCscp9Ey8HkXDMW4skii';
const CURL = `--${B}\r\nContent-Disposition: form-data; name="caption"\r\n\r\nAnh bien\r\n--${B}\r\nContent-Disposition: form-data; name="file"; filename="tiny.txt"\r\nContent-Type: text/plain\r\n\r\nxin chao\r\n--${B}--\r\n`;
const E3 = jsBai({
  ten: 'Read a multipart body before trusting a library', kho: 'MEDIUM', phut: 20,
  en: `<p>"Before trusting a library, look at the bytes." The lesson captured this body from <code>curl -F "caption=Anh bien" -F "file=@tiny.txt"</code>:</p>
<pre>Content-Type: multipart/form-data; boundary=${B}

--${B}\\r\\n
Content-Disposition: form-data; name="caption"\\r\\n
\\r\\n
Anh bien\\r\\n
--${B}\\r\\n
Content-Disposition: form-data; name="file"; filename="tiny.txt"\\r\\n
Content-Type: text/plain\\r\\n
\\r\\n
xin chao\\r\\n
--${B}--\\r\\n</pre>
<p>Write <code>parseMultipart(contentType, body)</code> → array of parts <b>in order</b>, each <code>{ name, filename, contentType, data }</code>:</p>
<ul><li>take the boundary from <code>contentType</code> (<code>boundary=…</code>, maybe in double quotes); no boundary → throw <code>TypeError</code>;</li>
<li>a delimiter is <code>\\r\\n--boundary</code> (only at the very start of the body may the <code>\\r\\n</code> be missing) — so the text <code>--boundary</code> inside a value does not cut it; a part’s headers end at the first empty line (<code>\\r\\n\\r\\n</code>); header names are case-insensitive;</li>
<li><code>name</code> / <code>filename</code> come from <code>Content-Disposition</code> (<code>null</code> if absent); <code>contentType</code> from the part’s <code>Content-Type</code> (<code>null</code> if absent);</li>
<li><code>data</code> is everything after the empty line up to the next delimiter (its leading <code>\\r\\n</code> belongs to the delimiter); stop at <code>--boundary--</code>; text before the first delimiter (preamble) is ignored.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>"Trước khi tin một thư viện, hãy nhìn các byte." Bài đã chụp thân này từ <code>curl -F "caption=Anh bien" -F "file=@tiny.txt"</code> (xem khung trong bản tiếng Anh). Viết <code>parseMultipart(contentType, body)</code> → mảng các phần <b>theo thứ tự</b>, mỗi phần <code>{ name, filename, contentType, data }</code>:</p>
<ul><li>lấy boundary từ <code>contentType</code> (<code>boundary=…</code>, có thể trong nháy kép); không có boundary → ném <code>TypeError</code>;</li>
<li>dấu phân cách là <code>\\r\\n--boundary</code> (chỉ ở đầu thân mới được thiếu <code>\\r\\n</code>) — nên chữ <code>--boundary</code> nằm trong một giá trị không cắt nó; header của phần kết thúc ở dòng trống đầu tiên (<code>\\r\\n\\r\\n</code>); tên header không phân biệt hoa thường;</li>
<li><code>name</code> / <code>filename</code> lấy từ <code>Content-Disposition</code> (<code>null</code> nếu không có); <code>contentType</code> từ <code>Content-Type</code> của phần (<code>null</code> nếu không có);</li>
<li><code>data</code> là mọi thứ sau dòng trống tới dấu phân cách kế tiếp (<code>\\r\\n</code> đứng đầu thuộc về dấu phân cách); dừng ở <code>--boundary--</code>; chữ trước dấu phân cách đầu (phần mở đầu) bị bỏ qua.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['<code>("\\r\\n" + body).split("\\r\\n--" + boundary)</code> gives you the parts (drop piece 0, the preamble).', '<code>("\\r\\n" + body).split("\\r\\n--" + boundary)</code> cho bạn các phần (bỏ mẩu 0, phần mở đầu).'], ['In each piece, <code>indexOf("\\r\\n\\r\\n")</code> separates headers from content.', 'Trong mỗi mẩu, <code>indexOf("\\r\\n\\r\\n")</code> tách header khỏi nội dung.'], ['A piece that starts with <code>--</code> is the closing delimiter.', 'Mẩu bắt đầu bằng <code>--</code> là dấu phân cách đóng.']],
  loi: [['Splitting on <code>\\n</code> instead of <code>\\r\\n</code>: every value keeps a trailing \\r.', 'Tách theo <code>\\n</code> thay vì <code>\\r\\n</code>: mọi giá trị dính \\r ở cuối.'], ['Matching <code>name="</code> inside <code>filename="</code>: use a word boundary, <code>/\\bname="/</code>.', 'Khớp <code>name="</code> bên trong <code>filename="</code>: dùng ranh giới từ, <code>/\\bname="/</code>.'], ['Treating the part’s Content-Type as the file’s real type.', 'Coi Content-Type của phần là kiểu thật của file.']],
  gt: ['Multipart is just text framing: delimiter, headers, blank line, bytes. Seeing it explains three later bugs: parts are ordered (a field after the file is not there yet), filename and Content-Type are client strings, and the envelope is tiny (199 bytes for a 7 MB photo). Real parsers like busboy do exactly this, but on a stream of Buffers instead of one string.', 'Multipart chỉ là khung chữ: dấu phân cách, header, dòng trống, byte. Thấy nó là hiểu ba lỗi sau này: các phần có thứ tự (trường sau file chưa tới), filename và Content-Type là chuỗi của client, và phần vỏ rất nhỏ (199 byte cho ảnh 7 MB). Parser thật như busboy làm đúng việc này, nhưng trên dòng Buffer thay vì một chuỗi.'],
  kn: ['multipart', 'parsing'],
  tns: [tn('Content-Disposition', 'header mô tả phần', 'chứa name và filename của trường'), tn('delimiter', 'dấu phân cách', '--boundary')],
  dau: `/** Parse a multipart/form-data body (as a string) into ordered parts. */
function parseMultipart(contentType, body) {
  // Write your solution here
  const boundary = contentType.split('boundary=')[1];
  return body.split('--' + boundary).slice(1, -1).map((chunk) => {
    const [head, data] = chunk.split('\\r\\n\\r\\n');
    return { name: /name="([^"]*)"/.exec(head)[1], filename: null, contentType: null, data };
  });
}
`,
  giai: '// Reference solution\n' + nguon(parseMultipart),
  cases: [
    { goi: `parseMultipart(${JSON.stringify('multipart/form-data; boundary=' + B)}, ${JSON.stringify(CURL)})`, moTa: ['The lesson’s captured curl body', 'Thân curl đã chụp trong bài'] },
    { goi: `parseMultipart('multipart/form-data; boundary="xYz"', ${JSON.stringify('--xYz\r\ncontent-disposition: form-data; name="file"; filename="shell.php.png"\r\ncontent-type: image/png\r\n\r\n<?php system($_GET[1]); ?>\r\n--xYz\r\nContent-Disposition: form-data; name="category"\r\n\r\navatar\r\n--xYz--\r\n')})`, moTa: ['Quoted boundary, lower-case headers, field AFTER the file', 'Boundary trong nháy, header chữ thường, trường SAU file'] },
    { goi: `(() => { try { parseMultipart('multipart/form-data', '--x--'); return 'no throw'; } catch (e) { return e.name; } })()`, moTa: ['No boundary → TypeError', 'Không có boundary → TypeError'] },
    { goi: `parseMultipart('multipart/form-data; boundary=AaB03x; charset=utf-8', ${JSON.stringify('--AaB03x\r\nContent-Disposition: form-data; name="a"\r\n\r\nline1\r\nline2\r\n--AaB03x\r\nContent-Disposition: form-data; name="b"\r\n\r\n\r\n--AaB03x\r\nContent-Disposition: form-data; name="c"; filename=""\r\n\r\nx\r\n--AaB03x--\r\n')})`, an: true },
    { goi: `parseMultipart('multipart/form-data; boundary=q', ${JSON.stringify('preamble ignored\r\n--q\r\nContent-Disposition: form-data; name="note"\r\nContent-Type: application/json\r\n\r\n{"t":"a--q"}\r\n--q--')})`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — lỗi của multer thành mã HTTP đúng ─── */
function makeUploadRoute(upload, save) {
  return function uploadRoute(req, res, next) {
    // Call multer OURSELVES, so its error comes back to us instead of falling into the default 500 handler.
    return new Promise((done) => {
      upload(req, res, async (err) => {
        try {
          if (err && err.name === 'MulterError') {
            if (err.code === 'LIMIT_FILE_SIZE') res.status(413).json({ error: 'FILE_TOO_LARGE', field: err.field });
            else res.status(400).json({ error: err.code, field: err.field });   // LIMIT_FILE_COUNT, LIMIT_UNEXPECTED_FILE…
            return done();
          }
          if (err) { next(err); return done(); }                                    // not ours: let the error handler decide
          if (!req.file) { res.status(400).json({ error: 'NO_FILE' }); return done(); }
          const key = await save(req.file);
          res.status(201).json({ key, size: req.file.size });
        } catch (e) {
          next(e);                                                                  // a failing save is a 5xx for the handler
        }
        done();
      });
    });
  };
}

const MULTER = String.raw`
class MulterError extends Error { constructor(code, field) { super({ LIMIT_FILE_SIZE: 'File too large', LIMIT_FILE_COUNT: 'Too many files', LIMIT_UNEXPECTED_FILE: 'Unexpected field' }[code] || code); this.name = 'MulterError'; this.code = code; this.field = field; } }
// fake upload.single('file'): after 20 ms (virtual) either sets req.file or calls back with an error
const fakeUpload = (outcome) => (req, res, cb) => { setTimeout(() => { if (outcome instanceof Error) cb(outcome); else { if (outcome) req.file = outcome; cb(); } }, 20); };
const saved = [];
const save = async (file) => { saved.push(file.originalname); return 'images/post/u7/1753660000000-a1b2c3d4e5f6.jpg'; };
const PHOTO = { fieldname: 'file', originalname: 'IMG_0001.jpg', mimetype: 'image/jpeg', size: 4194304 };
`;

const E4 = jsBai({
  ten: 'Turn MulterError into a 413, not a stack trace', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson: "MulterError is thrown into the middleware chain, so if you write <code>app.post('/u', upload.single('file'), handler)</code> with no error handler, an oversized upload becomes a 500 with a stack trace instead of a 413." Write <code>makeUploadRoute(upload, save)</code> → <code>(req, res, next)</code> that calls <code>upload(req, res, cb)</code> itself (like the lesson’s <code>/limited</code> route) and returns a Promise that resolves when it has answered:</p>
<ul><li><code>err.name === 'MulterError'</code>: <code>LIMIT_FILE_SIZE</code> → 413 <code>{ error:'FILE_TOO_LARGE', field }</code>; any other code → 400 <code>{ error: err.code, field }</code>;</li>
<li>any other error → <code>next(err)</code>;</li>
<li>no error but no <code>req.file</code> → 400 <code>{ error:'NO_FILE' }</code>;</li>
<li>otherwise <code>key = await save(req.file)</code> → 201 <code>{ key, size: req.file.size }</code>; if <code>save</code> throws → <code>next(err)</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Bài học: "MulterError bị ném vào chuỗi middleware, nên nếu viết <code>app.post('/u', upload.single('file'), handler)</code> mà không có error handler, upload quá cỡ thành lỗi 500 kèm stack trace thay vì 413." Viết <code>makeUploadRoute(upload, save)</code> → <code>(req, res, next)</code> tự gọi <code>upload(req, res, cb)</code> (như route <code>/limited</code> của bài) và trả Promise xong khi đã trả lời:</p>
<ul><li><code>err.name === 'MulterError'</code>: <code>LIMIT_FILE_SIZE</code> → 413 <code>{ error:'FILE_TOO_LARGE', field }</code>; mã khác → 400 <code>{ error: err.code, field }</code>;</li>
<li>lỗi khác → <code>next(err)</code>;</li>
<li>không lỗi nhưng không có <code>req.file</code> → 400 <code>{ error:'NO_FILE' }</code>;</li>
<li>còn lại <code>key = await save(req.file)</code> → 201 <code>{ key, size: req.file.size }</code>; <code>save</code> ném lỗi → <code>next(err)</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Wrap the callback API in <code>new Promise((done) =&gt; upload(req, res, async (err) =&gt; { …; done(); }))</code>.', 'Bọc API callback trong <code>new Promise((done) =&gt; upload(req, res, async (err) =&gt; { …; done(); }))</code>.'], ['Check the error first (Multer, then others), then the missing file, then save.', 'Kiểm lỗi trước (Multer, rồi lỗi khác), rồi thiếu file, rồi mới lưu.']],
  loi: [['Mounting upload.single as plain middleware and hoping a 413 appears.', 'Gắn upload.single như middleware thường rồi mong có 413.'], ['Mapping every error to 413 — a database failure in save() is not the user’s file being too large.', 'Đổi mọi lỗi thành 413 — lỗi CSDL trong save() không phải file của người dùng quá cỡ.'], ['Resolving before save() finishes: the test sees no response yet.', 'Xong Promise trước khi save() chạy xong: bộ kiểm chưa thấy phản hồi nào.']],
  gt: ['multer reports through a callback; calling it yourself puts its errors in your hands, so the user gets the precise 413 (like this site’s typed UploadError) while unexpected errors still reach the central handler. Wrapping the callback in a Promise is what lets an async route — and the test — know when the answer has been sent.', 'multer báo qua callback; tự gọi nó đưa lỗi vào tay bạn, nên người dùng nhận đúng 413 (như UploadError có kiểu của site này) còn lỗi bất ngờ vẫn tới handler trung tâm. Bọc callback trong Promise là điều cho route async — và bộ kiểm — biết khi nào câu trả lời đã gửi.'],
  kn: ['uploads', 'error handling', 'callbacks to promises'],
  tns: [tn('MulterError', 'lỗi của multer', 'có code như LIMIT_FILE_SIZE'), tn('promisify', 'bọc thành Promise', 'đổi API callback sang Promise')],
  fakes: MULTER,
  dau: `/** POST /upload route around a multer middleware \`upload\` and a storage function \`save\`. */
function makeUploadRoute(upload, save) {
  return function uploadRoute(req, res, next) {
    // Write your solution here
    return new Promise((done) => {
      upload(req, res, async (err) => {
        if (err) { next(err); return done(); }
        const key = await save(req.file);
        res.status(201).json({ key, size: req.file.size });
        done();
      });
    });
  };
}
`,
  giai: '// Reference solution\n' + nguon(makeUploadRoute),
  cases: [
    { goi: '[await runMw(makeUploadRoute(fakeUpload(PHOTO), save), {}), saved]', moTa: ['A 4 MB photo is saved', 'Ảnh 4 MB được lưu'] },
    { goi: 'await runMw(makeUploadRoute(fakeUpload(new MulterError("LIMIT_FILE_SIZE", "file")), save), {})', moTa: ['Too large → 413', 'Quá cỡ → 413'] },
    { goi: 'await runMw(makeUploadRoute(fakeUpload(null), save), {})', moTa: ['No file → 400 NO_FILE', 'Không có file → 400 NO_FILE'] },
    { goi: '[await runMw(makeUploadRoute(fakeUpload(new MulterError("LIMIT_UNEXPECTED_FILE", "avatar")), save), {}), await runMw(makeUploadRoute(fakeUpload(new Error("Unexpected end of form")), save), {})]', an: true },
    { goi: '[await runMw(makeUploadRoute(fakeUpload(PHOTO), async () => { throw new Error("R2 down"); }), {}), saved]', an: true },
  ],
});

/* ─── 5. HARD · js — stream từng mảnh, có áp lực ngược và giới hạn ─── */
async function streamToStore(source, sink, limit) {
  let total = 0;
  // for await pulls ONE chunk, we write it, and only then pull the next: memory holds one chunk, never the file.
  for await (const chunk of source) {
    total += chunk.length;
    if (total > limit) {
      await sink.abort();                                   // throw away the partial object in storage
      const err = new Error('File too large');
      err.name = 'UploadError'; err.code = 'LIMIT_FILE_SIZE'; err.status = 413;
      throw err;                                            // leaving the loop also stops reading the source
    }
    await sink.write(chunk);                                // BACKPRESSURE: wait until the destination took it
  }
  await sink.end();
  return { bytes: total };
}

const STREAM = String.raw`
// a slow network source: yields chunks 10 ms apart and counts how many were pulled
function source(chunks) { const s = { pulled: 0 }; s.it = (async function* () { for (const c of chunks) { await new Promise((r) => setTimeout(r, 10)); s.pulled++; yield c; } })(); return s; }
// a storage sink: each write takes 30 ms; it records how many writes overlap and how much was read before the first write
function sink(src) { const k = { written: 0, pending: 0, maxPending: 0, pulledAtFirstWrite: null, ended: false, aborted: false };
  k.write = (c) => { if (k.pulledAtFirstWrite === null) k.pulledAtFirstWrite = src.pulled; k.pending++; k.maxPending = Math.max(k.maxPending, k.pending); return new Promise((r) => setTimeout(() => { k.pending--; k.written += c.length; r(); }, 30)); };
  k.end = async () => { k.ended = true; }; k.abort = async () => { k.aborted = true; }; return k; }
const chunks = (n, size) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26)).repeat(size));
`;

const E5 = jsBai({
  ten: 'Stream an upload to storage without holding it', kho: 'HARD', phut: 25,
  en: `<p>busboy → stream cost +40 MB for a 120 MB file; memoryStorage cost +248 MB. The difference is <b>backpressure</b>: read a chunk, hand it to the destination, wait until it is taken, then read the next one. Write <code>async streamToStore(source, sink, limit)</code>:</p>
<ul><li><code>source</code> is an async iterable of string chunks (use <code>for await</code>); <code>sink</code> has async <code>write(chunk)</code>, <code>end()</code>, <code>abort()</code>;</li>
<li>never have more than <b>one</b> <code>write</code> in flight, and do not read ahead: the first write must happen right after the first chunk arrives;</li>
<li>count the bytes (<code>chunk.length</code>); as soon as the total exceeds <code>limit</code>: <code>await sink.abort()</code>, stop reading, and throw an error with <code>name 'UploadError'</code>, <code>code 'LIMIT_FILE_SIZE'</code>, <code>status 413</code> (do not write that chunk, do not call <code>end</code>);</li>
<li>at the end <code>await sink.end()</code> and return <code>{ bytes }</code>.</li></ul>
<p>The fake sink records <code>maxPending</code> (overlapping writes) and <code>pulledAtFirstWrite</code> (chunks read before the first write); the fake source records <code>pulled</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>busboy → stream tốn +40 MB cho file 120 MB; memoryStorage tốn +248 MB. Khác biệt là <b>áp lực ngược (backpressure)</b>: đọc một mảnh, đưa cho đích, chờ đích nhận xong, rồi mới đọc mảnh tiếp. Viết <code>async streamToStore(source, sink, limit)</code>:</p>
<ul><li><code>source</code> là async iterable các mảnh chuỗi (dùng <code>for await</code>); <code>sink</code> có các hàm async <code>write(chunk)</code>, <code>end()</code>, <code>abort()</code>;</li>
<li>không bao giờ có quá <b>một</b> lời <code>write</code> đang chạy, và không đọc trước: lần ghi đầu phải xảy ra ngay sau khi mảnh đầu tới;</li>
<li>đếm byte (<code>chunk.length</code>); ngay khi tổng vượt <code>limit</code>: <code>await sink.abort()</code>, ngừng đọc, và ném lỗi có <code>name 'UploadError'</code>, <code>code 'LIMIT_FILE_SIZE'</code>, <code>status 413</code> (không ghi mảnh đó, không gọi <code>end</code>);</li>
<li>cuối cùng <code>await sink.end()</code> và trả <code>{ bytes }</code>.</li></ul>
<p>Sink giả ghi lại <code>maxPending</code> (số lần ghi chồng nhau) và <code>pulledAtFirstWrite</code> (số mảnh đã đọc trước lần ghi đầu); source giả ghi <code>pulled</code>.</p>${MOI_TRUONG.vi}`,
  goiY: [['<code>for await (const chunk of source) { …; await sink.write(chunk); }</code> already gives you backpressure.', '<code>for await (const chunk of source) { …; await sink.write(chunk); }</code> đã cho bạn áp lực ngược.'], ['Check the limit BEFORE writing the chunk that crosses it.', 'Kiểm giới hạn TRƯỚC khi ghi mảnh vượt qua nó.'], ['Throwing inside <code>for await</code> stops the iteration — the source is not read any further.', 'Ném lỗi trong <code>for await</code> dừng vòng lặp — source không bị đọc thêm.']],
  loi: [['Collecting the chunks into an array and writing at the end — that is memoryStorage with extra steps.', 'Gom các mảnh vào mảng rồi ghi ở cuối — đó là memoryStorage có thêm bước.'], ['<code>sink.write(chunk)</code> without await: every write overlaps and the buffer grows exactly like a slow socket.', '<code>sink.write(chunk)</code> không await: mọi lần ghi chồng nhau và bộ đệm phình y như socket chậm.'], ['Writing the chunk that crosses the limit, then aborting — storage already received bytes over the limit.', 'Ghi mảnh vượt giới hạn rồi mới huỷ — storage đã nhận byte vượt giới hạn.']],
  gt: ['Memory held by a stream is "chunks read but not yet accepted downstream". Awaiting each write keeps that at one chunk, which is why streaming 120 MB cost 40 MB and not 248. Checking the running total before the write turns the size limit into a hard ceiling on what reaches storage, and aborting plus throwing lets the route answer 413 — the same contract multer’s LIMIT_FILE_SIZE has.', 'Bộ nhớ một stream giữ là "các mảnh đã đọc mà phía sau chưa nhận". Await từng lần ghi giữ con số đó ở một mảnh, vì vậy stream 120 MB tốn 40 MB chứ không phải 248. Kiểm tổng đang chạy trước khi ghi biến giới hạn cỡ thành trần cứng cho thứ tới storage, còn huỷ rồi ném lỗi cho route trả 413 — cùng hợp đồng với LIMIT_FILE_SIZE của multer.'],
  kn: ['streams', 'backpressure', 'async iteration'],
  tns: [tn('backpressure', 'áp lực ngược', 'đích chậm làm nguồn phải chờ'), tn('async iterable', 'đối tượng lặp bất đồng bộ', 'dùng được với for await')],
  fakes: STREAM,
  dau: `/** Pipe chunks from source to sink with backpressure and a size limit. */
async function streamToStore(source, sink, limit) {
  // Write your solution here
  const all = [];
  for await (const chunk of source) all.push(chunk);
  const bytes = all.join('').length;
  for (const chunk of all) sink.write(chunk);
  await sink.end();
  return { bytes };
}
`,
  giai: '// Reference solution\n' + nguon(streamToStore),
  cases: [
    { goi: 'await (async () => { const s = source(chunks(5, 1000)); const k = sink(s); const r = await streamToStore(s.it, k, 10000); return [r, k.written, k.ended]; })()', moTa: ['5 chunks of 1000 under a 10000 limit', '5 mảnh 1000 dưới giới hạn 10000'] },
    { goi: 'await (async () => { const s = source(chunks(8, 500)); const k = sink(s); await streamToStore(s.it, k, 1e6); return { maxPending: k.maxPending, pulledAtFirstWrite: k.pulledAtFirstWrite }; })()', moTa: ['One write in flight, no reading ahead', 'Một lần ghi đang chạy, không đọc trước'] },
    { goi: 'await (async () => { const s = source(chunks(10, 1000)); const k = sink(s); try { await streamToStore(s.it, k, 3500); return "no throw"; } catch (e) { return [e.name, e.code, e.status, k.written, k.aborted, k.ended, s.pulled]; } })()', moTa: ['Over the limit: abort, 413, stop reading', 'Vượt giới hạn: huỷ, 413, ngừng đọc'] },
    { goi: 'await (async () => { const s = source([]); const k = sink(s); const r = await streamToStore(s.it, k, 0); return [r, k.ended, k.maxPending]; })()', an: true },
    { goi: 'await (async () => { const s = source(chunks(4, 250)); const k = sink(s); const r = await streamToStore(s.it, k, 1000); return [r, k.written, k.aborted, k.ended]; })()', an: true },
    { goi: 'await (async () => { const s = source(chunks(6, 300)); const k = sink(s); const t0 = Date.now(); await streamToStore(s.it, k, 1e6); return [k.maxPending, Date.now() - t0]; })()', an: true },
  ],
});

export default modul('nodejs-10-1-nhan-file-multipart', '10.1 Receiving a file: multipart, base64, RAM', [E1, E2, E3, E4, E5]);
