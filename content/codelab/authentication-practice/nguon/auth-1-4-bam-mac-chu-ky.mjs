/** Authentication · 1.4 — Băm, MAC, chữ ký: ba công cụ; length extension, khoá HMAC chung, CTR vs GCM (output thật); tự viết hmacSha256Hex, base64url. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre, TRO_GIUP } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s01/_ma.mjs';

/* ── 1. Ba công cụ ── */
const S1 = cs({
  ten: '1.4-1 — Hash, MAC, signature: who can make it, who can check it', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Fill in the properties of the three tools, as measured in demo1/three-tools.mjs and demo1/shared-key.mjs.',
  vi: 'Điền tính chất của ba công cụ, đúng như đo trong demo1/three-tools.mjs và demo1/shared-key.mjs.',
  bang: [bang1('b1', ['Tool → properties', 'Công cụ → tính chất'], [
    { ma: 't', ten: 'Tool' },
    { ma: 'k', ten: 'Key needed to MAKE it', luaChon: ['none', 'the shared secret', 'the private key'] },
    { ma: 'v', ten: 'Who can CHECK it', luaChon: ['anyone (no key)', 'only holders of the shared secret', 'anyone with the public key'] },
    { ma: 'o', ten: 'Proves who made it?', luaChon: ['no', 'only “one of the key holders”', 'yes, the private-key holder'] },
  ], [
    { o: { t: 'SHA-256 (hash)' }, a: { k: 'none', v: 'anyone (no key)', o: 'no' } },
    { o: { t: 'HMAC-SHA256 (MAC)' }, a: { k: 'the shared secret', v: 'only holders of the shared secret', o: 'only “one of the key holders”' } },
    { o: { t: 'Ed25519 (signature)' }, a: { k: 'the private key', v: 'anyone with the public key', o: 'yes, the private-key holder' } },
  ], ['A hash next to the data proves nothing (anyone can recompute it). A MAC proves origin to whoever shares the key — and anyone who can check it can also make one (billing minted a LAB_MANAGER token). A signature splits the powers: only LabFlow ID can sign; everyone can verify.', 'Một bản băm đặt cạnh dữ liệu chẳng chứng minh gì (ai cũng tính lại được). MAC chứng minh nguồn gốc với ai chung khoá — và ai kiểm được thì cũng tạo được (dịch vụ billing đã tạo token LAB_MANAGER). Chữ ký tách quyền: chỉ LabFlow ID ký được; ai cũng kiểm được.'])],
  goiY: [['Ask: can the attacker compute this without a secret?', 'Hỏi: kẻ tấn công có tính được cái này mà không cần bí mật không?'], ['With HMAC, “check” and “make” use the same key.', 'Với HMAC, "kiểm" và "tạo" dùng chung một khoá.']],
  loi: [['Thinking a signature hides the data — none of the three gives secrecy.', 'Tưởng chữ ký giấu dữ liệu — không công cụ nào trong ba cho bí mật.'], ['Sharing one HMAC key with every service that must verify tokens.', 'Chia một khoá HMAC cho mọi dịch vụ cần kiểm token.']],
  tns: [tn('MAC', 'mã xác thực thông điệp'), tn('signature', 'chữ ký số'), tn('public key', 'khoá công khai')],
  kn: ['hash vs MAC vs signature'],
});

/* ── 2. Ba bẫy thật ── */
const S2 = cs({
  ten: '1.4-2 — Three traps, run for real', kho: 'MEDIUM', phut: 10,
  en: `Real outputs of lesson 1.4:${pre(OUT['14-noi-dai'].split('\n').slice(2))}${pre(OUT['14-khoa-chung'].split('\n').slice(1, 3))}${pre(OUT['14-ma-hoa'].split('\n').slice(2))}`,
  vi: `Output thật của bài 1.4:${pre(OUT['14-noi-dai'].split('\n').slice(2))}${pre(OUT['14-khoa-chung'].split('\n').slice(1, 3))}${pre(OUT['14-ma-hoa'].split('\n').slice(2))}`,
  cau: [
    q('c1', ['sha256(secret + message) accepted a forged message with &role=LAB_MANAGER appended. How, without the secret?', 'sha256(secret + message) nhận một thông điệp giả có thêm &role=LAB_MANAGER. Bằng cách nào, khi không có bí mật?'],
      ['She continued hashing from the digest (length extension)', 'She guessed the 24-byte secret by brute force first', 'SHA-256 is broken, so collisions are cheap to make', 'URLSearchParams ignored the signature completely'],
      ['Length extension needs only the digest and the secret’s length. HMAC hashes twice with two derived keys, so the outer hash cannot be extended. Use HMAC, never hash(secret + data).', 'Length extension chỉ cần bản băm và độ dài bí mật. HMAC băm hai lần với hai khoá dẫn xuất, nên lớp ngoài không nối dài được. Dùng HMAC, đừng bao giờ hash(bí mật + dữ liệu).']),
    q('c2', ['The billing service only needed to CHECK tokens, yet it made a LAB_MANAGER token that “checks out”. The fix?', 'Dịch vụ billing chỉ cần KIỂM token, vậy mà nó tạo được token LAB_MANAGER "hợp lệ". Cách sửa?'],
      ['Sign with Ed25519; give billing only the public key', 'Give billing its own, different HMAC secret key', 'Rotate the shared HMAC secret every single day', 'Encrypt the token so billing cannot change it'],
      ['With a public key billing can verify but never sign (the demo threw ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE). A different HMAC secret means billing cannot verify LabFlow ID tokens at all.', 'Với khoá công khai, billing kiểm được mà không bao giờ ký được (demo ném ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE). Một bí mật HMAC khác thì billing chẳng kiểm được token của LabFlow ID nữa.']),
    q('c3', ['AES-CTR turned "admin":false into "admin":true without the key; AES-GCM refused. Why?', 'AES-CTR biến "admin":false thành "admin":true mà không cần khoá; AES-GCM từ chối. Vì sao?'],
      ['CTR has no tag; GCM’s tag detects any change', 'GCM uses a longer key than CTR does', 'CTR mode suffers from a known AES weakness', 'The GCM ciphertext was not valid base64'],
      ['Encryption without integrity is malleable. If you need secrecy, use an AEAD mode (GCM, ChaCha20-Poly1305) — and first ask whether you need secrecy at all.', 'Mã hoá mà không có toàn vẹn thì sửa được. Cần bí mật thì dùng chế độ AEAD (GCM, ChaCha20-Poly1305) — và trước hết hỏi xem có thật sự cần bí mật không.']),
  ],
  goiY: [['Which secret did each attack NOT need?', 'Mỗi đòn tấn công KHÔNG cần bí mật nào?'], ['Integrity, origin and secrecy are three different properties.', 'Toàn vẹn, nguồn gốc và bí mật là ba tính chất khác nhau.']],
  loi: [['Rolling your own MAC as hash(key + data).', 'Tự chế MAC kiểu hash(khoá + dữ liệu).'], ['Using CTR or CBC without a MAC for cookies.', 'Dùng CTR hay CBC không kèm MAC cho cookie.']],
  tns: [tn('length extension', 'tấn công nối dài'), tn('AEAD', 'mã hoá có xác thực'), tn('malleable', 'sửa được mà không cần khoá')],
  kn: ['HMAC', 'AEAD'],
});

/* ── 3. Tự viết: hmacSha256Hex từ sha256 ── */
function hmacSha256Hex(key, message) {
  var k = utf8(key);
  if (k.length > 64) k = sha256(k);               // long keys are hashed first (RFC 2104)
  while (k.length < 64) k.push(0);                 // then padded to the 64-byte block size
  var ipad = k.map(function (b) { return b ^ 0x36; });
  var opad = k.map(function (b) { return b ^ 0x5c; });
  var inner = sha256(ipad.concat(utf8(message)));
  return hex(sha256(opad.concat(inner)));
}
const S3 = jsBai({
  ten: '1.4-3 — Write hmacSha256Hex(key, message) from SHA-256', kho: 'HARD', phut: 25,
  en: `<p>Build HMAC-SHA256 (RFC 2104) on top of a SHA-256 you are given. The starter file already contains three helpers (pure JavaScript, checked against Node’s crypto): <code>utf8(str)</code> ⇒ array of bytes, <code>sha256(bytes)</code> ⇒ array of 32 bytes, <code>hex(bytes)</code> ⇒ lower-case hex string. HMAC, with a 64-byte block:</p><ol>
<li>key bytes = <code>utf8(key)</code>; if longer than 64 bytes, replace them by <code>sha256(key bytes)</code>; then pad with zero bytes to 64;</li>
<li>inner = <code>sha256((key XOR 0x36 for each byte) ++ utf8(message))</code>;</li>
<li>result = <code>hex(sha256((key XOR 0x5c for each byte) ++ inner))</code>.</li></ol><p>The checks compare with real <code>createHmac('sha256', key).update(message).digest('hex')</code> values.</p>`,
  vi: `<p>Dựng HMAC-SHA256 (RFC 2104) trên một SHA-256 được cho sẵn. Tệp khởi đầu đã có ba hàm trợ giúp (JavaScript thuần, đã đối chiếu với crypto của Node): <code>utf8(str)</code> ⇒ mảng byte, <code>sha256(bytes)</code> ⇒ mảng 32 byte, <code>hex(bytes)</code> ⇒ chuỗi hex thường. HMAC, khối 64 byte:</p><ol>
<li>byte khoá = <code>utf8(key)</code>; nếu dài hơn 64 byte thì thay bằng <code>sha256(byte khoá)</code>; rồi đệm byte 0 cho đủ 64;</li>
<li>inner = <code>sha256((khoá XOR 0x36 từng byte) ++ utf8(message))</code>;</li>
<li>kết quả = <code>hex(sha256((khoá XOR 0x5c từng byte) ++ inner))</code>.</li></ol><p>Các kiểm so với giá trị thật của <code>createHmac('sha256', key).update(message).digest('hex')</code>.</p>`,
  goiY: [['ipad and opad are the same padded key XOR-ed with two different constants.', 'ipad và opad là cùng một khoá đã đệm, XOR với hai hằng khác nhau.'], ['concat arrays of bytes: a.concat(b).', 'Nối mảng byte: a.concat(b).']],
  loi: [['sha256(key + message) — that is the length-extendable construction this lesson attacked.', 'sha256(key + message) — chính là cấu trúc bị nối dài mà bài này tấn công.'], ['Forgetting to hash keys longer than 64 bytes.', 'Quên băm khoá dài hơn 64 byte.']],
  gt: ['Two nested hashes with two keys derived from one secret: the outer hash covers the inner digest, so knowing a tag never lets you continue hashing. That is why HMAC was immune in the length-extension demo while sha256(secret + message) fell.', 'Hai lớp băm lồng nhau với hai khoá dẫn xuất từ một bí mật: lớp ngoài bao lấy bản băm lớp trong, nên biết một thẻ không cho phép băm tiếp. Vì thế HMAC miễn nhiễm trong demo nối dài còn sha256(bí mật + thông điệp) thì đổ.'],
  kn: ['HMAC'],
  tns: [tn('ipad / opad', 'hai hằng 0x36 / 0x5c của HMAC')],
  dau: TRO_GIUP + `
/** HMAC-SHA256 as lower-case hex — build it from sha256(), utf8() and hex() above */
function hmacSha256Hex(key, message) {
  // Write your solution here
  return hex(sha256(utf8(key + message)));
}
`,
  giai: TRO_GIUP + '\n// Reference solution\n' + nguon(hmacSha256Hex),
  cases: [
    { goi: goi('hmacSha256Hex', 'demo-shared-key-not-secret', 'user=usr_1&role=STUDENT'), moTa: ['The message of lesson 1.4', 'Thông điệp của bài 1.4'] },
    { goi: goi('hmacSha256Hex', 'key', 'The quick brown fox jumps over the lazy dog') },
    { goi: goi('hmacSha256Hex', '', ''), an: true },
    { goi: goi('hmacSha256Hex', 'k'.repeat(100), 'a key longer than one block'), an: true },
    { goi: goi('hmacSha256Hex', 'k'.repeat(64), 'exactly one block of key'), an: true },
    { goi: goi('hmacSha256Hex', 'khoá bí mật', 'Bình ✓'), an: true },
  ],
});

/* ── 4. Tự viết: base64url bằng tay ── */
function toBase64url(bytes) {
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  var out = '';
  for (var i = 0; i < bytes.length; i += 3) {
    var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
    var left = bytes.length - i;                        // 1, 2 or ≥ 3 bytes in this group
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + (left > 1 ? A[(n >> 6) & 63] : '') + (left > 2 ? A[n & 63] : '');
  }
  return out;                                           // no "=" padding in base64url
}
const S4 = jsBai({
  ten: '1.4-4 — Write toBase64url(bytes) by hand', kho: 'MEDIUM', phut: 15,
  en: `<p>Every token, signed cookie and JWT in this course is written in <b>base64url</b>: the alphabet <code>A–Z a–z 0–9 - _</code> (64 symbols, 6 bits each), no <code>=</code> padding. Write <code>toBase64url(bytes)</code> for an array of byte values (0–255): take 3 bytes (24 bits) at a time, emit 4 symbols; a final group of 2 bytes emits 3 symbols, of 1 byte emits 2 symbols. Real example: <code>newToken('lfid_ses')</code> turns 32 random bytes into 43 characters.</p>`,
  vi: `<p>Mọi token, cookie có ký và JWT trong khoá này đều viết bằng <b>base64url</b>: bảng chữ <code>A–Z a–z 0–9 - _</code> (64 ký hiệu, mỗi cái 6 bit), không đệm <code>=</code>. Viết <code>toBase64url(bytes)</code> cho một mảng giá trị byte (0–255): lấy 3 byte (24 bit) một lần, sinh 4 ký hiệu; nhóm cuối 2 byte sinh 3 ký hiệu, 1 byte sinh 2 ký hiệu. Ví dụ thật: <code>newToken('lfid_ses')</code> biến 32 byte ngẫu nhiên thành 43 ký tự.</p>`,
  goiY: [['Pack three bytes into one 24-bit number with shifts.', 'Gộp ba byte vào một số 24 bit bằng phép dịch.'], ['Count how many bytes are really left before emitting symbols 3 and 4.', 'Đếm số byte thật còn lại trước khi sinh ký hiệu thứ 3 và 4.']],
  loi: [['Using "+" and "/" (that is base64, not base64url) — they break URLs and cookies.', 'Dùng "+" và "/" (đó là base64, không phải base64url) — chúng làm hỏng URL và cookie.'], ['Emitting "A" symbols for missing bytes instead of shortening the output.', 'Sinh ký hiệu "A" cho byte thiếu thay vì rút ngắn output.']],
  gt: ['32 bytes = 10 full groups (40 symbols) + 2 leftover bytes (3 symbols) = 43 characters — exactly the length of every LabFlow ID token after its prefix.', '32 byte = 10 nhóm đủ (40 ký hiệu) + 2 byte lẻ (3 ký hiệu) = 43 ký tự — đúng độ dài mọi token LabFlow ID sau tiền tố.'],
  kn: ['base64url'],
  tns: [tn('base64url', 'base64 an toàn cho URL, không đệm')],
  dau: `/** array of bytes ⇒ base64url (no padding) */
function toBase64url(bytes) {
  // Write your solution here
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var out = '';
  for (var i = 0; i < bytes.length; i += 3) {
    var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + A[n & 63];
  }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(toBase64url),
  cases: [
    { goi: goi('toBase64url', [76, 97, 98]), moTa: ['"Lab" (3 bytes)', '"Lab" (3 byte)'] },
    { goi: goi('toBase64url', [251, 255]), moTa: ['Bytes that need - and _', 'Byte cần - và _'] },
    { goi: goi('toBase64url', []), an: true },
    { goi: goi('toBase64url', [0]), an: true },
    { goi: goi('toBase64url', Array.from({ length: 32 }, (_, i) => (i * 37 + 11) % 256)), an: true, moTa: ['32 bytes ⇒ 43 characters', '32 byte ⇒ 43 ký tự'] },
    { goi: goi('toBase64url', [255, 254, 253, 252]), an: true },
  ],
});

export default doiDau({ slug: 'auth-1-4-bam-mac-chu-ky', ten: '1.4 Hash, MAC, signature: three tools, one confusion', khoa: KHOA, baiHoc: 'auth-1-4-bam-mac-chu-ky', de: [S1, S2, S3, S4] });
