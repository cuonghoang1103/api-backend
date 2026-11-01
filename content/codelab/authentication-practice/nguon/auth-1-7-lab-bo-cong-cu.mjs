/** Authentication · Lab 1 — Bộ công cụ nguyên hàm của LabFlow ID, bản JavaScript thuần chạy trong trình duyệt:
 *  makeToken (định dạng + kiểm tham số), findSession (tra theo digest, có hết hạn), signValue/verifyValue (kid + hết hạn + so hằng thời gian).
 *  Cùng hành vi với máy chấm scripts/cham-lab-1.mjs của dự án (T1, T3/T4, T6–T8). Hàm trợ giúp SHA-256/HMAC/base64url đã đối chiếu node:crypto. */
import { doiDau, KHOA, tn, jsBai, nguon, goi, pre, TRO_GIUP_HMAC } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s01/_ma.mjs';

const CHAM = OUT['lab-yeu'].split('\n').filter((l) => /^[✓✗] T|TOTAL/.test(l));

/* ── L1. makeToken ── */
function makeToken(prefix, randomBytes) {
  if (typeof prefix !== 'string' || !/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/.test(prefix)) throw new TypeError('bad token prefix: ' + prefix);
  if (!Array.isArray(randomBytes) || randomBytes.length < 16) throw new RangeError('a token needs at least 16 random bytes (128 bits)');
  return prefix + '_' + b64url(randomBytes);
}
const B32 = Array.from({ length: 32 }, (_, i) => (i * 73 + 29) % 256);
const L1 = jsBai({
  ten: 'Lab 1.1 — makeToken(prefix, randomBytes): the token format', kho: 'MEDIUM', phut: 15, dangBai: 'lab',
  en: `<p>In LabFlow ID, <code>newToken(prefix)</code> = <code>prefix + "_" + base64url(32 bytes from the OS CSPRNG)</code>. The browser has no <code>node:crypto</code>, so here the random bytes are passed in and you write the rest. <code>makeToken(prefix, randomBytes)</code>:</p><ul>
<li>prefix must match <code>/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/</code> (e.g. <code>lfid_ses</code>, <code>lfid_reset</code>); otherwise throw <code>TypeError</code>;</li>
<li><code>randomBytes</code> must be an array of at least 16 bytes (128 bits); otherwise throw <code>RangeError</code>;</li>
<li>return <code>prefix + "_" + b64url(randomBytes)</code> — <code>b64url</code> is among the provided helpers.</li></ul><p>The project’s grader runs the same rules as check T1; the first attempt of the lab (<code>Math.random().toString(36)</code>) failed it with 27 characters instead of 52.</p>`,
  vi: `<p>Trong LabFlow ID, <code>newToken(prefix)</code> = <code>prefix + "_" + base64url(32 byte từ CSPRNG của hệ điều hành)</code>. Trình duyệt không có <code>node:crypto</code>, nên ở đây byte ngẫu nhiên được truyền vào và bạn viết phần còn lại. <code>makeToken(prefix, randomBytes)</code>:</p><ul>
<li>prefix phải khớp <code>/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/</code> (vd <code>lfid_ses</code>, <code>lfid_reset</code>); sai thì ném <code>TypeError</code>;</li>
<li><code>randomBytes</code> phải là mảng ít nhất 16 byte (128 bit); sai thì ném <code>RangeError</code>;</li>
<li>trả về <code>prefix + "_" + b64url(randomBytes)</code> — <code>b64url</code> nằm trong các hàm trợ giúp cho sẵn.</li></ul><p>Máy chấm của dự án kiểm đúng các luật này ở phép T1; lần thử đầu của lab (<code>Math.random().toString(36)</code>) trượt vì ra 27 ký tự thay vì 52.</p>`,
  goiY: [['Validate first, build last.', 'Kiểm tra trước, dựng sau.'], ['throw new TypeError(…) / new RangeError(…).', 'throw new TypeError(…) / new RangeError(…).']],
  loi: [['Accepting "LFID" or "lfid__ses": a typo becomes a token family nobody scans for.', 'Nhận "LFID" hay "lfid__ses": lỗi gõ thành một họ token chẳng ai quét.'], ['Accepting 8 bytes "for shorter URLs": 64 bits is the floor, not the target.', 'Nhận 8 byte "cho URL ngắn": 64 bit là sàn, không phải mục tiêu.']],
  gt: ['A strict prefix makes every secret recognisable by scanners (lesson 1.5) and by people on support calls; the byte check makes a “short token for convenience” impossible to ship by accident.', 'Tiền tố chặt khiến mọi bí mật được máy quét (bài 1.5) và người hỗ trợ nhận ra; phép kiểm số byte khiến "token ngắn cho tiện" không thể lỡ tay đưa lên.'],
  kn: ['token format'],
  dau: TRO_GIUP_HMAC + `
/** "<prefix>_<base64url of randomBytes>" — throw TypeError / RangeError on bad input */
function makeToken(prefix, randomBytes) {
  // Write your solution here
  return prefix + '_' + randomBytes.join('');
}
`,
  giai: TRO_GIUP_HMAC + '\n// Reference solution\n' + nguon(makeToken),
  cases: [
    { goi: goi('makeToken', 'lfid_ses', B32), moTa: ['32 bytes ⇒ lfid_ses_ + 43 characters', '32 byte ⇒ lfid_ses_ + 43 ký tự'] },
    { goi: goi('makeToken', 'LFID', B32), nem: 'TypeError' },
    { goi: goi('makeToken', 'lfid_key', B32.slice(0, 16)), an: true },
    { goi: goi('makeToken', 'lfid_ses', B32.slice(0, 15)), an: true, nem: 'RangeError' },
    { goi: goi('makeToken', 'lfid__ses', B32), an: true, nem: 'TypeError' },
    { goi: goi('makeToken', '_ses', B32), an: true, nem: 'TypeError' },
    { goi: `makeToken(42, ${JSON.stringify(B32)})`, an: true, nem: 'TypeError' },
    { goi: goi('makeToken', 'lfid_ses', 'not-an-array-of-bytes'), an: true, nem: 'RangeError' },
  ],
});

/* ── L2. findSession ── */
function findSession(sessions, presented, nowMs) {
  if (typeof presented !== 'string' || presented === '') return null;
  var digest = hex(sha256(utf8(presented)));             // the database never holds the token itself
  var s = sessions.find(function (x) { return x.digest === digest; });
  if (!s || nowMs >= s.expiresAt) return null;           // expired = gone
  return s.userId;
}
const tokDigest = (t) => {
  // computed with node:crypto at build time; the learner’s code must compute the same with the helpers
  return import('node:crypto').then((c) => c.createHash('sha256').update(t).digest('hex'));
};
const T_AN = 'lfid_ses_Dfcgu3iL-Yjddndj4VzrVgLHEop1b0Jtiq5i-mVTxXc';
const T_BINH = 'lfid_ses_nrb_pw07YKkzbnfUYDsQUry01Yoi881il359Ma8gcGA';
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0);
const SESS = [
  { digest: await tokDigest(T_AN), userId: 'usr_1', expiresAt: NOW + 3600000 },
  { digest: await tokDigest(T_BINH), userId: 'usr_2', expiresAt: NOW - 1 },
];
const L2 = jsBai({
  ten: 'Lab 1.2 — findSession(sessions, presented, nowMs): look up, never compare', kho: 'MEDIUM', phut: 15, dangBai: 'lab',
  en: `<p>LabFlow ID v0.1 stores only <code>sha256(token)</code> as lower-case hex (lesson 1.3). Real dump:</p>${pre(OUT['13-v01-db'].split('\n').slice(1))}<p>Write <code>findSession(sessions, presented, nowMs)</code>: compute the digest of the presented token with the helpers (<code>hex(sha256(utf8(token)))</code>), find the session with that digest, and return its <code>userId</code> — or <code>null</code> when nothing matches, when the session has expired (<code>nowMs ≥ expiresAt</code>), or when the presented value is not a non-empty string.</p>`,
  vi: `<p>LabFlow ID v0.1 chỉ lưu <code>sha256(token)</code> dạng hex thường (bài 1.3). Bản dump thật:</p>${pre(OUT['13-v01-db'].split('\n').slice(1))}<p>Viết <code>findSession(sessions, presented, nowMs)</code>: tính digest của token được trình ra bằng các hàm trợ giúp (<code>hex(sha256(utf8(token)))</code>), tìm phiên có digest đó, và trả về <code>userId</code> — hoặc <code>null</code> khi không khớp, khi phiên đã hết hạn (<code>nowMs ≥ expiresAt</code>), hoặc khi giá trị trình ra không phải chuỗi khác rỗng.</p>`,
  goiY: [['One digest, one find — no loop that compares tokens.', 'Một digest, một lần find — không có vòng lặp so token.'], ['Check expiry after finding the row.', 'Kiểm hết hạn sau khi tìm được dòng.']],
  loi: [['Storing or comparing the raw token.', 'Lưu hoặc so token thô.'], ['nowMs > expiresAt: the session lives one extra millisecond.', 'nowMs > expiresAt: phiên sống thừa một mili giây.']],
  gt: ['A leaked session table is now a list of digests that cannot be presented; the comparison happens on digests the attacker cannot steer, so there is no timing side channel to measure.', 'Bảng phiên bị lộ giờ chỉ là danh sách digest không trình ra được; phép so diễn ra trên các digest mà kẻ tấn công không điều khiển được, nên chẳng còn kênh rò thời gian nào để đo.'],
  kn: ['digest lookup'],
  dau: TRO_GIUP_HMAC + `
/** sessions: [{ digest, userId, expiresAt }] ⇒ userId or null */
function findSession(sessions, presented, nowMs) {
  // Write your solution here
  var s = sessions.find(function (x) { return x.digest === presented; });
  return s ? s.userId : null;
}
`,
  giai: TRO_GIUP_HMAC + '\n// Reference solution\n' + nguon(findSession),
  cases: [
    { goi: goi('findSession', SESS, T_AN, NOW), moTa: ['An’s token from lesson 1.3', 'Token của An ở bài 1.3'] },
    { goi: goi('findSession', SESS, T_AN + 'x', NOW) },
    { goi: goi('findSession', SESS, T_BINH, NOW), an: true, moTa: ['Binh’s session expired 1 ms ago', 'Phiên của Bình hết hạn 1 ms trước'] },
    { goi: goi('findSession', SESS, SESS[0].digest, NOW), an: true, moTa: ['Presenting the DIGEST from a leaked dump', 'Trình ra DIGEST lấy từ bản dump bị lộ'] },
    { goi: goi('findSession', SESS, T_AN, NOW + 3600000), an: true },
    { goi: `findSession(${JSON.stringify(SESS)}, undefined, ${NOW})`, an: true },
  ],
});

/* ── L3. signValue / verifyValue ── */
function signValue(value, keys, kid, ttlSec, nowMs) {
  if (typeof value !== 'string') throw new TypeError('value must be a string');
  if (!Object.prototype.hasOwnProperty.call(keys, kid)) throw new Error('unknown key id: ' + kid);
  var body = b64url(utf8(value)) + '.' + (Math.floor(nowMs / 1000) + ttlSec) + '.' + kid;
  return body + '.' + b64url(hmacSha256(utf8(keys[kid]), utf8(body)));
}
function verifyValue(signed, keys, nowMs) {
  if (typeof signed !== 'string') return null;
  var p = signed.split('.');
  if (p.length !== 4) return null;
  var kid = p[2];
  if (!Object.prototype.hasOwnProperty.call(keys, kid) || !/^\d+$/.test(p[1])) return null;
  var good = b64url(hmacSha256(utf8(keys[kid]), utf8(p[0] + '.' + p[1] + '.' + kid)));
  var diff = good.length ^ p[3].length;                          // signature first, in constant time …
  for (var i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ (p[3].charCodeAt(i) | 0);
  if (diff !== 0) return null;
  if (Math.floor(nowMs / 1000) >= Number(p[1])) return null;     // … then the (now trusted) expiry
  var bytes = unb64url(p[0]);
  return bytes ? fromUtf8(bytes) : null;
}
const KEYS = { k1: 'demo-key-one-not-secret', k2: 'demo-key-two-not-secret' };
const run = (expr) => `(function () { var KEYS = ${JSON.stringify(KEYS)}, NOW = ${NOW}; ${expr} })()`;
const L3 = jsBai({
  ten: 'Lab 1.3 — signValue / verifyValue: a value the client holds but cannot change', kho: 'HARD', phut: 40, dangBai: 'lab',
  en: `<p>The heart of Lab 1, in the browser. Format: <code>&lt;b64url(utf8(value))&gt;.&lt;exp&gt;.&lt;kid&gt;.&lt;b64url(HMAC-SHA256(keys[kid], first three parts joined by "."))&gt;</code>, where <code>exp = floor(nowMs / 1000) + ttlSec</code>. Helpers given: <code>utf8</code>, <code>fromUtf8</code>, <code>sha256</code>, <code>hmacSha256(keyBytes, msgBytes)</code>, <code>b64url</code>, <code>unb64url</code> (returns <code>null</code> for invalid input), <code>hex</code>.</p><ul>
<li><code>signValue(value, keys, kid, ttlSec, nowMs)</code>: non-string value ⇒ <code>TypeError</code>; <code>kid</code> not an OWN key of <code>keys</code> ⇒ <code>Error</code>; otherwise the signed string.</li>
<li><code>verifyValue(signed, keys, nowMs)</code> ⇒ the value, or <code>null</code> — never throws: not a string, not exactly 4 parts, unknown kid (own keys only — <code>"toString"</code> is unknown), exp not all digits, wrong signature (compare without early exit), expired (<code>floor(nowMs/1000) ≥ exp</code>), or a value that is not valid base64url. Check the signature <b>before</b> trusting exp.</li></ul><p>The project grader’s T6–T8 test exactly this; the lab’s first attempt scored:</p>${pre(CHAM)}`,
  vi: `<p>Trái tim của Lab 1, chạy trong trình duyệt. Định dạng: <code>&lt;b64url(utf8(value))&gt;.&lt;exp&gt;.&lt;kid&gt;.&lt;b64url(HMAC-SHA256(keys[kid], ba phần đầu nối bằng "."))&gt;</code>, với <code>exp = floor(nowMs / 1000) + ttlSec</code>. Hàm trợ giúp có sẵn: <code>utf8</code>, <code>fromUtf8</code>, <code>sha256</code>, <code>hmacSha256(keyBytes, msgBytes)</code>, <code>b64url</code>, <code>unb64url</code> (trả <code>null</code> khi đầu vào sai), <code>hex</code>.</p><ul>
<li><code>signValue(value, keys, kid, ttlSec, nowMs)</code>: value không phải chuỗi ⇒ <code>TypeError</code>; <code>kid</code> không phải khoá RIÊNG của <code>keys</code> ⇒ <code>Error</code>; còn lại trả chuỗi đã ký.</li>
<li><code>verifyValue(signed, keys, nowMs)</code> ⇒ giá trị, hoặc <code>null</code> — không bao giờ ném lỗi: không phải chuỗi, không đúng 4 phần, kid lạ (chỉ khoá riêng — <code>"toString"</code> là lạ), exp không toàn chữ số, sai chữ ký (so không thoát sớm), hết hạn (<code>floor(nowMs/1000) ≥ exp</code>), hoặc giá trị không phải base64url hợp lệ. Kiểm chữ ký <b>trước</b> khi tin exp.</li></ul><p>Phép T6–T8 của máy chấm dự án kiểm đúng điều này; lần thử đầu của lab được:</p>${pre(CHAM)}`,
  goiY: [['Build the "body" string once; sign = body + "." + b64url(hmacSha256(utf8(key), utf8(body))).', 'Dựng chuỗi "body" một lần; ký = body + "." + b64url(hmacSha256(utf8(key), utf8(body))).'], ['In verify: format → kid → recompute → compare all characters → expiry → decode.', 'Khi kiểm: định dạng → kid → tính lại → so hết mọi ký tự → hết hạn → giải mã.']],
  loi: [['keys[kid] for kid "toString" finds a function, not undefined.', 'keys[kid] với kid "toString" ra một hàm, không phải undefined.'], ['now > exp instead of now ≥ exp: the value lives one extra second (the first attempt’s T7).', 'now > exp thay vì now ≥ exp: giá trị sống thừa một giây (T7 của lần thử đầu).']],
  gt: ['The kid lets two keys be live at once (sign with the new one, still accept the old one until it is removed), so a rotation logs nobody out. Signature before expiry: an attacker can write any exp — it only means something once the HMAC proves LabFlow ID wrote it.', 'kid cho phép hai khoá cùng sống (ký bằng khoá mới, vẫn nhận khoá cũ tới khi gỡ), nên xoay khoá không làm ai bị đăng xuất. Chữ ký trước hạn dùng: kẻ tấn công viết exp nào cũng được — nó chỉ có nghĩa khi HMAC chứng minh chính LabFlow ID đã viết nó.'],
  kn: ['signed values', 'key rotation'],
  tns: [tn('kid', 'mã định danh khoá'), tn('key rotation', 'xoay khoá')],
  dau: TRO_GIUP_HMAC + `
/** "<b64url value>.<exp>.<kid>.<b64url HMAC>" */
function signValue(value, keys, kid, ttlSec, nowMs) {
  // Write your solution here
  var exp = Math.floor(nowMs / 1000) + ttlSec;
  var body = b64url(utf8(value)) + '.' + exp + '.' + kid;
  return body + '.' + b64url(hmacSha256(utf8(keys[kid]), utf8(body)));
}

/** the value, or null — never throws */
function verifyValue(signed, keys, nowMs) {
  // Write your solution here
  var p = signed.split('.');
  if (Math.floor(nowMs / 1000) > Number(p[1])) return null;
  var good = b64url(hmacSha256(utf8(keys[p[2]]), utf8(p[0] + '.' + p[1] + '.' + p[2])));
  return good === p[3] ? fromUtf8(unb64url(p[0])) : null;
}
`,
  giai: TRO_GIUP_HMAC + '\n// Reference solution\n' + nguon(signValue, verifyValue),
  cases: [
    { goi: run("var s = signValue('usr_1|STUDENT', KEYS, 'k1', 900, NOW); return [s, verifyValue(s, KEYS, NOW)];"), moTa: ['Round trip (the signed string is compared exactly)', 'Ký rồi kiểm (chuỗi đã ký được so chính xác)'] },
    { goi: run("var s = signValue('usr_1', KEYS, 'k1', 900, NOW); return [verifyValue(s, KEYS, NOW + 899000), verifyValue(s, KEYS, NOW + 900000)];"), moTa: ['899 s later: valid · at exp: null', '899 giây sau: hợp lệ · đúng exp: null'] },
    { goi: run("var p = signValue('usr_1|STUDENT', KEYS, 'k1', 900, NOW).split('.'); p[0] = b64url(utf8('usr_3|LAB_MANAGER')); return verifyValue(p.join('.'), KEYS, NOW);"), an: true, moTa: ['Changed value', 'Đổi giá trị'] },
    { goi: run("var p = signValue('usr_1', KEYS, 'k1', 900, NOW).split('.'); p[1] = String(Number(p[1]) + 86400); return verifyValue(p.join('.'), KEYS, NOW + 1000000);"), an: true, moTa: ['Extended expiry, used after the real one', 'Kéo dài hạn, dùng sau hạn thật'] },
    { goi: run("var s = signValue('usr_1', KEYS, 'k1', 60, NOW); return [verifyValue(s, KEYS, NOW), verifyValue(s, { k2: KEYS.k2 }, NOW), verifyValue(s.replace('.k1.', '.k2.'), KEYS, NOW)];"), an: true, moTa: ['Rotation: k1 accepted while present, rejected when removed; relabelled kid rejected', 'Xoay khoá: k1 được nhận khi còn, bị từ chối khi gỡ; đổi nhãn kid bị từ chối'] },
    { goi: run("var s = signValue('usr_1', KEYS, 'k1', 60, NOW); return verifyValue(s.replace('.k1.', '.toString.'), KEYS, NOW);"), an: true },
    { goi: run("return ['', 'abc', 'a.b.c', 'a.b.c.d.e', '...', '.1.k1.', 'x.NaN.k1.AAAA', undefined, null, 42].map(function (b) { try { return verifyValue(b, KEYS, NOW); } catch (e) { return 'THREW ' + e.name; } });"), an: true, moTa: ['Malformed input never throws', 'Đầu vào hỏng không bao giờ ném lỗi'] },
    { goi: run("var t = 'a.b.c|ñ✓ Bình'; return verifyValue(signValue(t, KEYS, 'k2', 60, NOW), KEYS, NOW);"), an: true, moTa: ['Dots and Vietnamese in the value', 'Dấu chấm và tiếng Việt trong giá trị'] },
    { goi: run("try { signValue('x', KEYS, 'toString', 60, NOW); return 'signed'; } catch (e) { return e.name; }"), an: true },
    { goi: run("var p = signValue('usr_1', KEYS, 'k1', 60, NOW).split('.'); p[3] = p[3].slice(0, -1); return verifyValue(p.join('.'), KEYS, NOW);"), an: true, moTa: ['Signature one character short', 'Chữ ký thiếu một ký tự'] },
  ],
});

export default doiDau({ slug: 'auth-1-7-lab-bo-cong-cu', ten: 'Lab 1 — LabFlow ID’s toolkit of primitives', khoa: KHOA, baiHoc: 'auth-1-7-lab-bo-cong-cu', de: [L1, L2, L3] });
