/** Node.js 3.2 — Buffer: ký tự ≠ byte, mã hoá UTF-8 bằng tay, cắt không vỡ chữ, StringDecoder giữ mẩu dở giữa các chunk. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, goi } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '3.2 · Characters are not bytes', kho: 'EASY', phut: 6,
  en: 'Five questions on the lesson’s output for <code>Buffer.from(\'Xin chào\')</code> and on the Buffer rules. Every answer was checked with Node 22.',
  vi: 'Năm câu về output của bài cho <code>Buffer.from(\'Xin chào\')</code> và các luật của Buffer. Mọi đáp án đã kiểm bằng Node 22.',
  cau: [
    q('c1', ['<code>\'Xin chào\'.length</code> is 8 but the buffer has 9 bytes. Why?', '<code>\'Xin chào\'.length</code> là 8 nhưng buffer có 9 byte. Vì sao?'],
      ['In UTF-8 the letter à costs two bytes (c3 a0); every ASCII letter costs one', 'Buffer.from adds a terminating zero byte, like a C string', 'The space between the words is stored as two bytes', 'Buffer.from always uses UTF-16, which needs extra bytes'],
      ['ASCII = 1 byte, Vietnamese letters with diacritics = 2 or 3, emoji = 4. The hex 58696e206368<b>c3a0</b>6f shows it.', 'ASCII = 1 byte, chữ Việt có dấu = 2 hoặc 3, emoji = 4. Chuỗi hex 58696e206368<b>c3a0</b>6f cho thấy điều đó.']),
    q('c2', ['What does <code>b.subarray(0, 7).toString(\'utf8\')</code> give for that buffer?', '<code>b.subarray(0, 7).toString(\'utf8\')</code> cho gì với buffer đó?'],
      ['"Xin ch�" — the cut went through the middle of à', '"Xin chà" — seven characters', '"Xin ch" — Node drops the half character silently', 'It throws RangeError because 7 splits a character'],
      ['Byte 7 is the first half of à. Decoding half a sequence gives the replacement character U+FFFD — the real cause of the mangled text you see on websites.', 'Byte thứ 7 là nửa đầu của à. Giải mã nửa chuỗi byte cho ra ký tự thay thế U+FFFD — nguyên nhân thật của chữ lỗi bạn hay gặp trên web.']),
    q('c3', ['<code>\'😀\'.length</code> and <code>Buffer.byteLength(\'😀\')</code> are…', '<code>\'😀\'.length</code> và <code>Buffer.byteLength(\'😀\')</code> là…'],
      ['2 and 4', '1 and 4', '1 and 2', '2 and 2'],
      ['JavaScript strings count UTF-16 code units (an emoji is a surrogate pair = 2); UTF-8 needs 4 bytes. Neither is “characters”.', 'Chuỗi JavaScript đếm đơn vị UTF-16 (emoji là một cặp surrogate = 2); UTF-8 cần 4 byte. Cả hai đều không phải “số ký tự”.']),
    q('c4', ['Why does the lesson forbid <code>Buffer.allocUnsafe(n)</code> unless you overwrite every byte at once?', 'Vì sao bài cấm <code>Buffer.allocUnsafe(n)</code> trừ khi ghi đè mọi byte ngay?'],
      ['Its memory is not cleared and may still hold fragments of other data from your process', 'It is slower than Buffer.alloc because it has to validate the size', 'It returns a buffer that cannot be passed to fs or crypto', 'It allocates inside V8’s heap, so the garbage collector moves it'],
      ['alloc(n) gives zeros; allocUnsafe(n) gives whatever was in that memory — maybe another user’s token. Sending it out leaks data.', 'alloc(n) cho toàn số 0; allocUnsafe(n) cho bất cứ thứ gì đang nằm ở vùng nhớ đó — có thể là token của người khác. Gửi nó ra ngoài là lộ dữ liệu.']),
    q('c5', ['A payment webhook signature never matches. The route uses <code>express.json()</code> and verifies <code>JSON.stringify(req.body)</code>. What is wrong?', 'Chữ ký webhook thanh toán không bao giờ khớp. Route dùng <code>express.json()</code> và kiểm <code>JSON.stringify(req.body)</code>. Sai ở đâu?'],
      ['Re-serialising changes whitespace and key order; the HMAC must be computed over the raw body bytes', 'JSON.stringify escapes Vietnamese letters, so the signature needs base64', 'express.json() decodes the body as latin1, which changes the bytes', 'The signature header must be parsed with Buffer.from(sig, "utf8") first'],
      ['The signature was computed over the exact bytes the provider sent. Parse → stringify produces different bytes, so keep the raw body for that one route (chapter 6).', 'Chữ ký được tính trên đúng các byte nhà cung cấp gửi. Parse → stringify ra byte khác, nên giữ thân thô cho riêng route đó (chương 6).']),
  ],
  goiY: [['Write “Xin chào” as bytes: which letter is not ASCII?', 'Viết “Xin chào” thành byte: chữ nào không phải ASCII?'], ['Remember three different counts: UTF-16 units (.length), UTF-8 bytes, and what a human calls a character.', 'Nhớ ba cách đếm khác nhau: đơn vị UTF-16 (.length), byte UTF-8, và điều con người gọi là ký tự.']],
  loi: [['Assuming str.length is the number of bytes to send.', 'Tưởng str.length là số byte sẽ gửi đi.'], ['Truncating a description with buffer.subarray(0, 100).', 'Cắt mô tả bằng buffer.subarray(0, 100).']],
  tns: [tn('code unit', 'đơn vị mã UTF-16', 'what String.length counts'), tn('replacement character', 'ký tự thay thế U+FFFD (�)'), tn('raw body', 'thân request thô (chưa parse)')],
  kn: ['Buffer', 'UTF-8'],
});

/* ─── 2. utf8Length ─── */
function utf8Length(str) {
  let bytes = 0;
  // for…of walks CODE POINTS, so an emoji (two UTF-16 units) is seen once
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) bytes += 1;            // ASCII
    else if (cp < 0x800) bytes += 2;      // à, Đ, ă …
    else if (cp < 0x10000) bytes += 3;    // ấ, ễ, € …
    else bytes += 4;                      // emoji and other astral characters
  }
  return bytes;
}
const E2 = nodeBai({
  ten: '3.2 · Count UTF-8 bytes like Buffer.byteLength', kho: 'EASY', phut: 10,
  en: `<p>In the lesson, <code>'Xin chào'</code> is 8 characters but 9 bytes. The grader runs in a browser Worker, which has no <code>Buffer</code>, so write <code>utf8Length(str)</code> — the same number as <code>Buffer.byteLength(str, 'utf8')</code>. UTF-8 spends, per code point:</p>
<table><thead><tr><th>code point</th><th>bytes</th><th>examples</th></tr></thead><tbody><tr><td>&lt; 0x80</td><td>1</td><td>a, 7, space</td></tr><tr><td>&lt; 0x800</td><td>2</td><td>à Đ ă</td></tr><tr><td>&lt; 0x10000</td><td>3</td><td>ấ ễ €</td></tr><tr><td>otherwise</td><td>4</td><td>😀</td></tr></tbody></table>`,
  vi: `<p>Trong bài, <code>'Xin chào'</code> có 8 ký tự nhưng 9 byte. Máy chấm chạy trong Worker của trình duyệt, không có <code>Buffer</code>, nên hãy viết <code>utf8Length(str)</code> — cùng số với <code>Buffer.byteLength(str, 'utf8')</code>. UTF-8 tốn, cho mỗi code point:</p>
<table><thead><tr><th>code point</th><th>byte</th><th>ví dụ</th></tr></thead><tbody><tr><td>&lt; 0x80</td><td>1</td><td>a, 7, dấu cách</td></tr><tr><td>&lt; 0x800</td><td>2</td><td>à Đ ă</td></tr><tr><td>&lt; 0x10000</td><td>3</td><td>ấ ễ €</td></tr><tr><td>còn lại</td><td>4</td><td>😀</td></tr></tbody></table>`,
  dauVao: ['str — any string (well-formed: no lone surrogates)', 'str — chuỗi bất kỳ (hợp lệ: không có surrogate lẻ)'],
  dauRa: ['number of UTF-8 bytes', 'số byte UTF-8'],
  goiY: [['for (const ch of str) gives one code point at a time; ch.codePointAt(0) is its number.', 'for (const ch of str) cho từng code point; ch.codePointAt(0) là số của nó.'], ['A classic for (let i…) loop sees an emoji as TWO units — each would count 3 bytes, giving 6 instead of 4.', 'Vòng for (let i…) cổ điển thấy emoji là HAI đơn vị — mỗi cái tính 3 byte, ra 6 thay vì 4.']],
  loi: [['return str.length — right only for pure ASCII.', 'return str.length — chỉ đúng với ASCII thuần.'], ['Iterating with str[i]/charCodeAt: an emoji counts as 3 + 3 bytes.', 'Lặp bằng str[i]/charCodeAt: emoji bị tính 3 + 3 byte.']],
  gt: ['Expected values are <code>Buffer.byteLength</code> from Node 22 (“Tiếng Việt” = 14 bytes for 10 characters). This number matters in real code: <code>Content-Length</code> is bytes, a byte-limited column or an upload limit is bytes — <code>str.length</code> is neither.', 'Giá trị mong đợi là <code>Buffer.byteLength</code> của Node 22 (“Tiếng Việt” = 14 byte cho 10 ký tự). Con số này quan trọng trong code thật: <code>Content-Length</code> tính bằng byte, cột giới hạn theo byte hay giới hạn upload cũng là byte — <code>str.length</code> không phải cái nào cả.'],
  kn: ['Buffer', 'UTF-8'], tns: [tn('code point', 'điểm mã Unicode', 'the number of a character, e.g. U+00E0 for à'), tn('surrogate pair', 'cặp thay thế UTF-16', 'two code units that encode one code point above U+FFFF')],
  dau: `/** Buffer.byteLength(str, 'utf8') without Buffer */
function utf8Length(str) {
  // Write your solution here
  return str.length;
}
`,
  giai: '// Reference solution — one code point at a time\n' + nguon(utf8Length),
  cases: [
    { goi: goi('utf8Length', 'Xin chào'), moTa: ['The lesson’s string: 8 characters, 9 bytes', 'Chuỗi của bài: 8 ký tự, 9 byte'] },
    { goi: goi('utf8Length', 'hello'), moTa: ['Pure ASCII', 'ASCII thuần'] },
    { goi: goi('utf8Length', 'ấ'), moTa: ['A three-byte Vietnamese letter', 'Chữ Việt ba byte'] },
    { goi: goi('utf8Length', '😀'), an: true },
    { goi: goi('utf8Length', ''), an: true },
    { goi: goi('utf8Length', 'Tiếng Việt'), an: true },
    { goi: goi('utf8Length', 'Nguyễn Văn Ánh 😀'), an: true },
    { goi: goi('utf8Length', 'Giá 100€ — Đà Nẵng'), an: true },
  ],
});

/* ─── 3. toHex ─── */
function utf8Bytes(str) {
  const out = [];
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) out.push(cp);
    // multi-byte: a lead byte with the length in its top bits, then 10xxxxxx continuation bytes
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
  }
  return out;
}
function toHex(str) {
  // two hex digits per byte, zero-padded: 0x0a is "0a", not "a"
  return utf8Bytes(str).map((b) => b.toString(16).padStart(2, '0')).join('');
}
const E3 = nodeBai({
  ten: '3.2 · Encode to UTF-8 and print the hex', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson prints <code>Buffer.from('Xin chào', 'utf8').toString('hex')</code> → <code>58696e206368c3a06f</code>. Write <code>toHex(str)</code> that produces the same string without <code>Buffer</code> (and without <code>TextEncoder</code>). Encode each code point:</p>
<pre>&lt; 0x80      0xxxxxxx
&lt; 0x800     110xxxxx 10xxxxxx
&lt; 0x10000   1110xxxx 10xxxxxx 10xxxxxx
otherwise   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx</pre><p>then write every byte as two lowercase hex digits.</p>`,
  vi: `<p>Bài in <code>Buffer.from('Xin chào', 'utf8').toString('hex')</code> → <code>58696e206368c3a06f</code>. Viết <code>toHex(str)</code> cho ra cùng chuỗi mà không dùng <code>Buffer</code> (và không dùng <code>TextEncoder</code>). Mã hoá từng code point:</p>
<pre>&lt; 0x80      0xxxxxxx
&lt; 0x800     110xxxxx 10xxxxxx
&lt; 0x10000   1110xxxx 10xxxxxx 10xxxxxx
còn lại     11110xxx 10xxxxxx 10xxxxxx 10xxxxxx</pre><p>rồi viết mỗi byte thành hai chữ số hex viết thường.</p>`,
  dauVao: ['str — a well-formed string', 'str — chuỗi hợp lệ'], dauRa: ['lowercase hex string, 2 characters per byte', 'chuỗi hex thường, 2 ký tự mỗi byte'],
  goiY: [['à is U+00E0: 0xc0 | (0xe0 >> 6) = 0xc3, 0x80 | (0xe0 & 63) = 0xa0 — the c3 a0 of the lesson.', 'à là U+00E0: 0xc0 | (0xe0 >> 6) = 0xc3, 0x80 | (0xe0 & 63) = 0xa0 — đúng c3 a0 của bài.'], ['b.toString(16) of 10 is "a": pad to two digits.', 'b.toString(16) của 10 là "a": đệm cho đủ hai chữ số.'], ['Walk code points with for…of, not str[i], so 😀 becomes f0 9f 98 80.', 'Đi theo code point bằng for…of, không phải str[i], để 😀 thành f0 9f 98 80.']],
  loi: [['charCodeAt(i).toString(16): "à" becomes "e0" — that is the code point, not its UTF-8 bytes.', 'charCodeAt(i).toString(16): "à" thành "e0" — đó là code point, không phải các byte UTF-8.'], ['Forgetting padStart: a newline (0x0a) prints as "a" and every later byte shifts.', 'Quên padStart: ký tự xuống dòng (0x0a) in thành "a" và mọi byte sau bị lệch.']],
  gt: ['Expected strings are Node’s <code>Buffer.from(s).toString(\'hex\')</code>. The top bits of the lead byte announce the length (110 = 2, 1110 = 3, 11110 = 4) and every continuation byte starts with 10 — which is exactly what lets a decoder find a cut in the middle of a character (next exercises).', 'Chuỗi mong đợi là <code>Buffer.from(s).toString(\'hex\')</code> của Node. Các bit đầu của byte dẫn báo độ dài (110 = 2, 1110 = 3, 11110 = 4) và mọi byte tiếp nối bắt đầu bằng 10 — đó chính là thứ giúp bộ giải mã nhận ra chỗ cắt giữa một ký tự (các bài sau).'],
  kn: ['Buffer', 'UTF-8', 'hex'], tns: [tn('lead byte', 'byte dẫn', 'the first byte of a multi-byte sequence'), tn('continuation byte', 'byte tiếp nối', '10xxxxxx')],
  dau: `/** Buffer.from(str, 'utf8').toString('hex') without Buffer */
function toHex(str) {
  // Write your solution here — this prints code units, not UTF-8 bytes
  let out = '';
  for (let i = 0; i < str.length; i++) out += str.charCodeAt(i).toString(16);
  return out;
}
`,
  giai: '// Reference solution — encode code points to bytes, then 2 hex digits per byte\n' + nguon(utf8Bytes, toHex),
  cases: [
    { goi: goi('toHex', 'Xin chào'), moTa: ['The lesson’s output', 'Output của bài'] },
    { goi: goi('toHex', 'Đ'), moTa: ['Two bytes', 'Hai byte'] },
    { goi: goi('toHex', 'a\nb'), moTa: ['A newline needs padding: 0a', 'Xuống dòng cần đệm: 0a'] },
    { goi: goi('toHex', '😀'), an: true },
    { goi: goi('toHex', 'Tiếng Việt'), an: true },
    { goi: goi('toHex', '€5'), an: true },
    { goi: goi('toHex', ''), an: true },
  ],
});

/* ─── 4. truncateUtf8 ─── */
function truncateUtf8(str, maxBytes) {
  let out = '';
  let used = 0;
  // add whole code points while they still fit — a character is never split
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    const n = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
    if (used + n > maxBytes) break;
    used += n;
    out += ch;
  }
  return out;
}
const E4 = nodeBai({
  ten: '3.2 · Truncate to N bytes without breaking a letter', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson’s output:</p><pre>subarray(0,6) = "Xin ch"
subarray(0,7) = "Xin ch�"
subarray(0,8) = "Xin chà"</pre><p>A storage column (or an SMS gateway) accepts at most <code>maxBytes</code> UTF-8 bytes. Write <code>truncateUtf8(str, maxBytes)</code>: the <b>longest prefix of whole characters</b> whose UTF-8 size is ≤ <code>maxBytes</code>. Never return a half character (no <code>�</code>) and never split an emoji.</p>`,
  vi: `<p>Output của bài:</p><pre>subarray(0,6) = "Xin ch"
subarray(0,7) = "Xin ch�"
subarray(0,8) = "Xin chà"</pre><p>Một cột lưu trữ (hay cổng SMS) nhận tối đa <code>maxBytes</code> byte UTF-8. Viết <code>truncateUtf8(str, maxBytes)</code>: <b>tiền tố dài nhất gồm các ký tự nguyên vẹn</b> có kích thước UTF-8 ≤ <code>maxBytes</code>. Không bao giờ trả nửa ký tự (không có <code>�</code>) và không cắt đôi emoji.</p>`,
  dauVao: ['str — a string; maxBytes — integer ≥ 0', 'str — chuỗi; maxBytes — số nguyên ≥ 0'], dauRa: ['a prefix of str', 'một tiền tố của str'],
  goiY: [['Walk code points, add each one’s byte size, stop BEFORE the one that would overflow.', 'Đi theo code point, cộng kích thước byte của từng cái, dừng TRƯỚC cái làm tràn.'], ['The byte size of one code point is the table from the previous exercise.', 'Kích thước byte của một code point là bảng ở bài trước.']],
  loi: [['str.slice(0, maxBytes) — counts UTF-16 units, so "Xin chào" with 7 keeps 9 bytes.', 'str.slice(0, maxBytes) — đếm đơn vị UTF-16, nên "Xin chào" với 7 vẫn giữ 9 byte.'], ['Cutting the bytes and decoding them: that is exactly how "Xin ch�" is made.', 'Cắt byte rồi giải mã: đó chính là cách tạo ra "Xin ch�".']],
  gt: ['The lesson’s advice is “truncate the string, not the buffer”. Here the limit is in bytes, so you count bytes — but you only ever cut at a character boundary, which a code-point loop gives you for free. Expected results were checked: <code>Buffer.byteLength(result) ≤ maxBytes</code> and adding the next character would exceed it.', 'Lời khuyên của bài là “cắt chuỗi, đừng cắt buffer”. Ở đây giới hạn tính bằng byte nên bạn đếm byte — nhưng chỉ cắt ở ranh giới ký tự, thứ mà vòng lặp theo code point cho sẵn. Kết quả mong đợi đã được kiểm: <code>Buffer.byteLength(kết quả) ≤ maxBytes</code> và thêm ký tự kế tiếp sẽ vượt.'],
  kn: ['Buffer', 'UTF-8'], tns: [tn('prefix', 'tiền tố'), tn('character boundary', 'ranh giới ký tự')],
  dau: `/** the longest prefix of whole characters that fits in maxBytes UTF-8 bytes */
function truncateUtf8(str, maxBytes) {
  // Write your solution here
  return str.slice(0, maxBytes);
}
`,
  giai: '// Reference solution — add whole code points while they fit\n' + nguon(truncateUtf8),
  cases: [
    { goi: goi('truncateUtf8', 'Xin chào', 7), moTa: ['7 bytes: à does not fit', '7 byte: à không vừa'] },
    { goi: goi('truncateUtf8', 'Xin chào', 8), moTa: ['8 bytes: à fits', '8 byte: à vừa'] },
    { goi: goi('truncateUtf8', 'hello', 10), moTa: ['Short enough already', 'Đã đủ ngắn'] },
    { goi: goi('truncateUtf8', 'hi😀!', 5), an: true },
    { goi: goi('truncateUtf8', 'hi😀!', 6), an: true },
    { goi: goi('truncateUtf8', 'Tiếng Việt', 4), an: true },
    { goi: goi('truncateUtf8', 'Tiếng Việt', 0), an: true },
    { goi: goi('truncateUtf8', 'Đà Nẵng mùa hè', 12), an: true },
  ],
});

/* ─── 5. createDecoder (StringDecoder) ─── */
function seqLength(lead) {
  // the top bits of the lead byte say how long the sequence is
  if (lead < 0x80) return 1;
  if (lead >= 0xf0) return 4;
  if (lead >= 0xe0) return 3;
  return 2;
}
function decodeComplete(bytes) {
  // bytes holds only whole sequences here
  let s = '';
  for (let i = 0; i < bytes.length;) {
    const n = seqLength(bytes[i]);
    let cp = n === 1 ? bytes[i] : bytes[i] & (0xff >> (n + 1));
    for (let k = 1; k < n; k++) cp = (cp << 6) | (bytes[i + k] & 63);
    s += String.fromCodePoint(cp);
    i += n;
  }
  return s;
}
function createDecoder() {
  let pending = [];   // bytes of a character that has not finished arriving
  return {
    write(chunk) {
      const all = pending.concat(Array.from(chunk));
      // find where the last COMPLETE sequence ends
      let i = 0;
      while (i < all.length && i + seqLength(all[i]) <= all.length) i += seqLength(all[i]);
      pending = all.slice(i);          // 0–3 bytes wait for the next chunk
      return decodeComplete(all.slice(0, i));
    },
    end() {
      // the stream ended in the middle of a character: one replacement character, like StringDecoder
      const out = pending.length ? '\ufffd' : '';
      pending = [];
      return out;
    },
  };
}
const DECODE_HELPER = `// ── provided helper: decode bytes, turning an INCOMPLETE sequence at the end into '\\ufffd' ──
function decodeBytes(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length;) {
    const b = bytes[i];
    const n = b < 0x80 ? 1 : b >= 0xf0 ? 4 : b >= 0xe0 ? 3 : 2;
    if (i + n > bytes.length) { s += '\\ufffd'; break; }
    let cp = n === 1 ? b : b & (0xff >> (n + 1));
    for (let k = 1; k < n; k++) cp = (cp << 6) | (bytes[i + k] & 63);
    s += String.fromCodePoint(cp);
    i += n;
  }
  return s;
}
`;
const E5 = nodeBai({
  ten: '3.2 · A StringDecoder that waits for the rest of a letter', kho: 'HARD', phut: 30,
  en: `<p>A stream hands you a Buffer per <code>data</code> event, and the boundary between two chunks falls wherever it falls — sometimes in the middle of <code>à</code>. Decoding each chunk on its own then prints <code>�</code>. The lesson’s answer is <code>StringDecoder</code>: <i>it holds an incomplete sequence until the next chunk completes it</i>.</p>
<p>Write <code>createDecoder()</code> returning <code>{ write(chunk), end() }</code> (chunks are arrays of byte values):</p>
<ul><li><code>write(chunk)</code> returns the text of every <b>complete</b> character so far and keeps the 1–3 bytes of an unfinished one for the next call;</li><li><code>end()</code> returns <code>"\\ufffd"</code> if bytes are still pending (the input ended inside a character), else <code>""</code> — exactly what <code>StringDecoder.end()</code> does.</li></ul><p>The starter already has a <code>decodeBytes(bytes)</code> helper; its problem is that it has no memory between chunks.</p>`,
  vi: `<p>Stream đưa bạn một Buffer mỗi sự kiện <code>data</code>, và ranh giới giữa hai chunk rơi vào đâu thì rơi — có lúc vào giữa chữ <code>à</code>. Giải mã từng chunk riêng sẽ in ra <code>�</code>. Câu trả lời của bài là <code>StringDecoder</code>: <i>nó giữ một chuỗi byte dở dang tới khi chunk sau làm nó đủ</i>.</p>
<p>Viết <code>createDecoder()</code> trả về <code>{ write(chunk), end() }</code> (chunk là mảng giá trị byte):</p>
<ul><li><code>write(chunk)</code> trả về chữ của mọi ký tự <b>đã đủ byte</b> và giữ lại 1–3 byte của ký tự còn dở cho lần gọi sau;</li><li><code>end()</code> trả <code>"\\ufffd"</code> nếu vẫn còn byte chờ (đầu vào kết thúc giữa một ký tự), ngược lại <code>""</code> — đúng như <code>StringDecoder.end()</code>.</li></ul><p>Code khởi đầu đã có hàm <code>decodeBytes(bytes)</code>; vấn đề của nó là không nhớ gì giữa các chunk.</p>`,
  dauVao: ['chunks of valid UTF-8, split anywhere', 'các chunk UTF-8 hợp lệ, cắt ở chỗ bất kỳ'], dauRa: ['strings from write() and end()', 'các chuỗi từ write() và end()'],
  yc: [['Keep the pending bytes inside the closure, not in a global.', 'Giữ các byte đang chờ trong closure, không ở biến toàn cục.'], ['write() must never return "\\ufffd" for valid input.', 'write() không bao giờ trả "\\ufffd" với đầu vào hợp lệ.']],
  goiY: [['Join pending + chunk, then walk sequences from the start: a lead byte says the length (1–4).', 'Ghép pending + chunk, rồi đi qua từng chuỗi byte từ đầu: byte dẫn cho biết độ dài (1–4).'], ['Stop at the first sequence that would run past the end — everything from there becomes the new pending.', 'Dừng ở chuỗi đầu tiên vượt quá cuối — mọi thứ từ đó trở thành pending mới.'], ['Decode only the complete part with the helper; end() just looks at whether pending is empty.', 'Chỉ giải mã phần đủ bằng hàm có sẵn; end() chỉ xem pending có rỗng không.']],
  loi: [['Decoding each chunk independently — the "Xin ch�" bug, one chunk at a time.', 'Giải mã từng chunk riêng — lỗi "Xin ch�", từng chunk một.'], ['Keeping pending in a global: two decoders (two uploads at once) corrupt each other.', 'Giữ pending ở biến toàn cục: hai decoder (hai upload cùng lúc) làm hỏng nhau.'], ['Forgetting end(): the last half character disappears silently instead of showing �.', 'Quên end(): nửa ký tự cuối biến mất âm thầm thay vì hiện �.']],
  gt: ['Every case was replayed through Node’s <code>new StringDecoder(\'utf8\')</code> with the same chunks (e.g. <code>[0x58,0xc3]</code> then <code>[0xa0,0x6f]</code> → <code>"X"</code>, <code>"ào"</code>, <code>""</code>). The idea is a carry: like adding numbers by hand, whatever does not fit in this column waits for the next one. Streams of text in Node (<code>setEncoding(\'utf8\')</code>, readline) use exactly this.', 'Mọi ca đã được chạy lại qua <code>new StringDecoder(\'utf8\')</code> của Node với đúng các chunk đó (vd <code>[0x58,0xc3]</code> rồi <code>[0xa0,0x6f]</code> → <code>"X"</code>, <code>"ào"</code>, <code>""</code>). Ý tưởng là “nhớ sang”: như cộng tay, phần không vừa cột này chờ sang cột sau. Stream văn bản trong Node (<code>setEncoding(\'utf8\')</code>, readline) dùng đúng cách này.'],
  kn: ['Buffer', 'streams', 'UTF-8'], tns: [tn('StringDecoder', 'bộ giải mã chuỗi', 'node:string_decoder'), tn('pending bytes', 'byte đang chờ'), tn('closure', 'bao đóng', 'a function that remembers variables of the scope it was created in')],
  dau: `${DECODE_HELPER}
/** decode a stream of byte chunks without breaking letters at chunk boundaries */
function createDecoder() {
  // Write your solution here — no memory between chunks yet
  return {
    write(chunk) { return decodeBytes(chunk); },
    end() { return ''; },
  };
}
`,
  giai: '// Reference solution — keep the bytes of an unfinished character for the next chunk\n' + nguon(seqLength, decodeComplete, createDecoder),
  cases: [
    { goi: '(() => { const d = createDecoder(); return [d.write([0x58, 0x69, 0x6e, 0x20, 0x63, 0x68, 0xc3]), d.write([0xa0, 0x6f]), d.end()]; })()', moTa: ['"Xin chào" cut at byte 7 (the lesson’s cut)', '"Xin chào" cắt ở byte 7 (chỗ cắt của bài)'] },
    { goi: '(() => { const d = createDecoder(); return [d.write([0x41, 0xe1, 0xba]), d.end()]; })()', moTa: ['Input ends inside ấ → end() gives �', 'Đầu vào hết giữa chữ ấ → end() cho �'] },
    { goi: '(() => { const d = createDecoder(); return [d.write([0x68, 0x69]), d.end()]; })()', moTa: ['Nothing pending', 'Không có gì chờ'] },
    { goi: '(() => { const d = createDecoder(); return [d.write([0xf0]), d.write([0x9f]), d.write([0x98, 0x80, 0x21]), d.end()]; })()', an: true },
    { goi: '(() => { const d = createDecoder(); return [d.write([0x54, 0x69, 0xe1]), d.write([0xba, 0xbf, 0x6e, 0x67, 0x20, 0x56, 0x69, 0xe1, 0xbb]), d.write([0x87, 0x74]), d.end()]; })()', an: true },
    { goi: '(() => { const a = createDecoder(); const b = createDecoder(); return [a.write([0xc3]), b.write([0xc4]), a.write([0xa0]), b.write([0x90]), a.end(), b.end()]; })()', an: true },
    { goi: '(() => { const d = createDecoder(); return [d.write([]), d.write([0xf0, 0x9f, 0x98]), d.end(), d.write([0x41]), d.end()]; })()', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-3-2-buffer', ten: '3.2 Buffers: binary data', khoa: KHOA, baiHoc: 'nodejs-3-2-buffer', de: [E1, E2, E3, E4, E5] });
