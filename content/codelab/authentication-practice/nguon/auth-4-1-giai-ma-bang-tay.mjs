/** Authentication · 4.1 — Giải mã bằng tay: đọc output thật (ba phần, payload đọc được, tamper ⇒ BAD_SIGNATURE); tự viết signingInput, looksLikeJwt. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s04/_ma.mjs';

const DE = OUT['41-decode'].split('\n').slice(1);
const TA = OUT['41-tamper'].split('\n').slice(1);

const S1 = cs({
  ten: '4.1-1 — Decode and tamper: read the real runs', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.4 (real runs):${pre(DE)}${pre(TA)}`,
  vi: `LabFlow ID v0.4 (chạy thật):${pre(DE)}${pre(TA)}`,
  cau: [
    q('c1', ['The demo decoded the header and payload with no key. What does that prove about the token?', 'Demo giải mã header và payload mà không cần khoá. Điều đó chứng minh gì về token?'],
      ['Nothing — base64url is encoding, not encryption; the payload is public', 'That the signature is valid, since the JSON parsed', 'That the token is encrypted and only the owner can read it', 'That the token has not been tampered with'],
      ['base64url just makes bytes URL-safe; anyone can decode the header and payload. Only verifying the signature proves anything.', 'base64url chỉ làm byte an toàn với URL; ai cũng giải mã được header và payload. Chỉ xác minh chữ ký mới chứng minh điều gì.']),
    q('c2', ['The attacker rewrote role to LAB_MANAGER but kept the old signature. What did the verifier return?', 'Kẻ tấn công sửa role thành LAB_MANAGER nhưng giữ chữ ký cũ. Bộ xác minh trả về gì?'],
      ['BAD_SIGNATURE — the signature covers header.payload, so editing the payload breaks it', 'ALG_MISMATCH — the algorithm changed', 'The claims, because the payload was re-encoded correctly', 'EXPIRED — tampered tokens are treated as expired'],
      ['The signature is computed over the exact header.payload bytes; one changed character no longer matches. No private key means no new signature.', 'Chữ ký được tính trên đúng các byte header.payload; một ký tự đổi là không khớp nữa. Không có khoá riêng thì không có chữ ký mới.']),
    q('c3', ['The decoded signature was 64 raw bytes. Why exactly 64?', 'Chữ ký giải mã ra 64 byte thô. Vì sao đúng 64?'],
      ['An Ed25519 signature is always 64 bytes', 'base64url always decodes to 64 bytes', 'The payload was padded to 64 bytes', 'SHA-256 produces 64 bytes'],
      ['Ed25519 signatures are a fixed 64 bytes, regardless of the message. (SHA-256 is 32 bytes; base64url length varies with the input.)', 'Chữ ký Ed25519 cố định 64 byte, bất kể thông điệp. (SHA-256 là 32 byte; độ dài base64url thay đổi theo đầu vào.)']),
  ],
  goiY: [['Decoding is free; verifying needs a key.', 'Giải mã thì miễn phí; xác minh cần một khoá.'], ['The signature covers header.payload exactly.', 'Chữ ký bảo vệ đúng header.payload.']],
  loi: [['“The payload says admin, so I am admin.”', '"Payload ghi admin nên tôi là admin."'], ['“A JWT is encrypted.”', '"JWT được mã hoá."']],
  tns: [tn('base64url'), tn('signing input', 'chuỗi được ký')],
  kn: ['jwt'],
});

function signingInput(token) {
  var i = token.lastIndexOf('.');
  return i < 0 ? token : token.slice(0, i);
}
const S2 = jsBai({
  ten: '4.1-2 — Write signingInput(token): the bytes the signature covers', kho: 'EASY', phut: 10,
  en: `<p>A JWT is <code>header.payload.signature</code>. The signature is computed over the <strong>signing input</strong>: everything before the last dot, i.e. <code>header.payload</code>. Return that substring. (If there is no dot, return the whole string.)</p>`,
  vi: `<p>Một JWT là <code>header.payload.signature</code>. Chữ ký được tính trên <strong>signing input</strong>: mọi thứ trước dấu chấm cuối, tức <code>header.payload</code>. Trả về chuỗi con đó. (Nếu không có dấu chấm, trả về cả chuỗi.)</p>`,
  goiY: [['Find the LAST dot, not the first.', 'Tìm dấu chấm CUỐI, không phải dấu đầu.'], ['Return the part before it.', 'Trả về phần trước nó.']],
  loi: [['Splitting on the first dot — the header and payload both contain none, but be safe.', 'Tách ở dấu chấm đầu — header và payload không chứa dấu chấm, nhưng cứ an toàn.'], ['Returning the signature instead.', 'Trả về chữ ký thay vì phần đầu.']],
  gt: ['The signature protects exactly these bytes, so a verifier recomputes the signature over <code>header.payload</code> and compares. Changing either part changes the signing input and breaks the signature (4.1).', 'Chữ ký bảo vệ đúng các byte này, nên bộ xác minh tính lại chữ ký trên <code>header.payload</code> và so. Đổi phần nào cũng đổi signing input và vỡ chữ ký (4.1).'],
  kn: ['jwt'], tns: [tn('signing input', 'chuỗi được ký')],
  dau: `/** ⇒ the "header.payload" part of a JWT */
function signingInput(token) {
  // Write your solution here
  return token.split('.')[0];
}
`,
  giai: '// Reference solution\n' + nguon(signingInput),
  cases: [
    { goi: goi('signingInput', 'aaa.bbb.ccc'), moTa: ['Normal token', 'Token thường'] },
    { goi: goi('signingInput', 'eyJhbGci.eyJzdWIi.ZmFrZXNpZw'), an: true },
    { goi: goi('signingInput', 'onlyonepart'), an: true, moTa: ['No dot', 'Không có dấu chấm'] },
    { goi: goi('signingInput', 'a.b.'), an: true, moTa: ['Empty signature', 'Chữ ký rỗng'] },
  ],
});

function looksLikeJwt(token) {
  if (typeof token !== 'string') return false;
  var parts = token.split('.');
  if (parts.length !== 3) return false;
  return parts.slice(0, 2).every(function (p) { return p.length > 0 && /^[A-Za-z0-9_-]+$/.test(p); });
}
const S3 = jsBai({
  ten: '4.1-3 — Write looksLikeJwt(token): three base64url parts', kho: 'MEDIUM', phut: 12,
  en: `<p>Return <code>true</code> only when <code>token</code> is a string of exactly three dot-separated parts, and the first two (header and payload) are non-empty and contain only base64url characters: <code>A–Z a–z 0–9 - _</code>. This is a cheap shape check before you spend any crypto. (The signature part may be empty — an <code>alg: none</code> forgery — so do not require it.)</p>`,
  vi: `<p>Trả về <code>true</code> chỉ khi <code>token</code> là một chuỗi gồm đúng ba phần ngăn bởi dấu chấm, và hai phần đầu (header và payload) không rỗng và chỉ chứa ký tự base64url: <code>A–Z a–z 0–9 - _</code>. Đây là phép kiểm hình dạng rẻ trước khi tốn crypto. (Phần chữ ký có thể rỗng — một cú giả mạo <code>alg: none</code> — nên đừng bắt buộc nó.)</p>`,
  goiY: [['Split on "." and count the parts.', 'Tách theo "." và đếm số phần.'], ['A base64url part matches /^[A-Za-z0-9_-]+$/.', 'Một phần base64url khớp /^[A-Za-z0-9_-]+$/.']],
  loi: [['Allowing "+" or "/" — that is base64, not base64url.', 'Cho phép "+" hay "/" — đó là base64, không phải base64url.'], ['Requiring a non-empty signature, so alg:none is "not a JWT".', 'Bắt buộc chữ ký không rỗng, khiến alg:none "không phải JWT".']],
  gt: ['A shape check is not verification, but it rejects garbage before you decode or verify — and still lets through the hostile shapes (empty signature) you must handle in 4.2.', 'Một phép kiểm hình dạng không phải xác minh, nhưng nó loại rác trước khi bạn giải mã hay xác minh — và vẫn để lọt các hình dạng thù địch (chữ ký rỗng) mà bạn phải xử lý ở 4.2.'],
  kn: ['jwt'], tns: [tn('base64url')],
  dau: `/** ⇒ true if token is 3 dot-parts with base64url header + payload */
function looksLikeJwt(token) {
  // Write your solution here
  return token.split('.').length === 3;
}
`,
  giai: '// Reference solution\n' + nguon(looksLikeJwt),
  cases: [
    { goi: goi('looksLikeJwt', 'eyJhbGci.eyJzdWIi.ZmFrZQ'), moTa: ['Valid shape', 'Hình dạng hợp lệ'] },
    { goi: goi('looksLikeJwt', 'eyJhbGci.eyJzdWIi.'), an: true, moTa: ['Empty signature (alg:none)', 'Chữ ký rỗng (alg:none)'] },
    { goi: goi('looksLikeJwt', 'eyJhbGci.eyJzdWIi'), an: true, moTa: ['Only two parts', 'Chỉ hai phần'] },
    { goi: goi('looksLikeJwt', 'ey+/.eyJzdWIi.sig'), an: true, moTa: ['base64, not base64url', 'base64, không phải base64url'] },
    { goi: goi('looksLikeJwt', '.eyJzdWIi.sig'), an: true, moTa: ['Empty header', 'Header rỗng'] },
    { goi: goi('looksLikeJwt', 42), an: true, moTa: ['Not a string', 'Không phải chuỗi'] },
  ],
});

const PART = ['the algorithm and key id', 'the claims (who, for whom, until when)', 'proof nothing was changed'];
const S4 = cs({
  ten: '4.1-4 — The three parts of a JWT', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each part of a JWT with what it holds.',
  vi: 'Ghép mỗi phần của một JWT với thứ nó giữ.',
  bang: [bang1('b1', ['Part → content', 'Phần → nội dung'], [{ ma: 'x', ten: 'Part' }, { ma: 'q', ten: 'Holds', luaChon: PART }], [
    { o: { x: 'header (base64url)' }, a: { q: 'the algorithm and key id' } },
    { o: { x: 'payload (base64url)' }, a: { q: 'the claims (who, for whom, until when)' } },
    { o: { x: 'signature (base64url)' }, a: { q: 'proof nothing was changed' } },
  ], ['Header and payload are plain JSON anyone can read; only the signature carries trust, and only after it is verified against the header.payload bytes.', 'Header và payload là JSON thường ai cũng đọc; chỉ chữ ký mang sự tin cậy, và chỉ sau khi được xác minh với các byte header.payload.'])],
  goiY: [['Two parts are readable JSON, one is opaque bytes.', 'Hai phần là JSON đọc được, một phần là byte không rõ.'], ['The signature proves integrity, not secrecy.', 'Chữ ký chứng minh toàn vẹn, không phải bí mật.']],
  loi: [['Thinking the payload is secret.', 'Tưởng payload là bí mật.'], ['Thinking the header is trusted.', 'Tưởng header là đáng tin.']],
  kn: ['jwt'],
});

export default doiDau({ slug: 'auth-4-1-giai-ma-bang-tay', ten: '4.1 Decode one by hand', khoa: KHOA, baiHoc: 'auth-4-1-giai-ma-bang-tay', de: [S1, S2, S3, S4] });
