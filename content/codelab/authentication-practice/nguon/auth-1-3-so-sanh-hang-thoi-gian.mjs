/** Authentication · 1.3 — So sánh bí mật bằng === là bug: phép đo nói dối (output thật); tự viết safeEqual hằng thời gian, verifyWebhook; bảng khi nào dùng gì. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s01/_ma.mjs';

const giua = (k) => OUT[k].split('\n').filter((l) => /leading chars right/.test(l));
const dau = (k) => giua(k)[0].trim(); const cuoi = (k) => giua(k).at(-2).trim();

/* ── 1. Đọc các phép đo thật ── */
const S1 = cs({
  ten: '1.3-1 — Read the measurements (and spot the one that lies)', kho: 'MEDIUM', phut: 10,
  en: `Real runs of lesson 1.3 on a 64-character token (Node 22.23.3). Naive benchmark (one guess object per position):${pre(giua('13-do-naive').slice(0, 3).concat(['…']))}Fixed benchmark (8 copies rotated, every result used):${pre(giua('13-do-strict'))}timingSafeEqual:${pre([dau('13-do-safe'), '…', cuoi('13-do-safe')])}Over HTTP on 127.0.0.1, 20,000 requests per guess, three runs:${pre([OUT['13-tu-xa-1'], OUT['13-tu-xa-2'], OUT['13-tu-xa-3']].map((o) => o.split('\n').at(-1)))}`,
  vi: `Các lần đo thật của bài 1.3 trên token 64 ký tự (Node 22.23.3). Phép đo ngây thơ (một đối tượng đoán mỗi vị trí):${pre(giua('13-do-naive').slice(0, 3).concat(['…']))}Phép đo đã sửa (xoay 8 bản sao, dùng mọi kết quả):${pre(giua('13-do-strict'))}timingSafeEqual:${pre([dau('13-do-safe'), '…', cuoi('13-do-safe')])}Qua HTTP trên 127.0.0.1, 20.000 request mỗi chuỗi đoán, ba lần chạy:${pre([OUT['13-tu-xa-1'], OUT['13-tu-xa-2'], OUT['13-tu-xa-3']].map((o) => o.split('\n').at(-1)))}`,
  cau: [
    q('c1', ['The naive benchmark printed 0.99 ns for every row. What does that prove?', 'Phép đo ngây thơ in 0,99 ns cho mọi dòng. Điều đó chứng minh gì?'],
      ['Nothing: the JIT computed it once and timed an empty loop', 'That === has been constant-time since Node 22', 'That V8 hashes both strings before comparing them', 'That the CPU was throttled during the measurement'],
      ['A flat, suspiciously fast benchmark usually measures the optimiser. Rotating inputs and using results gives the real staircase.', 'Một phép đo phẳng và nhanh đáng ngờ thường là đang đo trình tối ưu. Xoay đầu vào và dùng kết quả mới ra bậc thang thật.']),
    q('c2', ['Why do 0, 1 and 8 correct characters cost the same with ===?', 'Vì sao đúng 0, 1 và 8 ký tự tốn như nhau với ===?'],
      ['V8 compares a block of bytes at a time', 'The first 8 characters are cached by V8', 'base64url characters carry only 6 bits each', 'The benchmark rotates 8 copies of every guess'],
      ['The leak is real but coarse: about 2 ns over 64 characters, in steps. Longer values leak more (1,024 characters: about 4.6 → 38 ns).', 'Chỗ rò có thật nhưng thô: khoảng 2 ns trên 64 ký tự, theo bậc. Giá trị dài hơn rò nhiều hơn (1.024 ký tự: khoảng 4,6 → 38 ns).']),
    q('c3', ['Over HTTP the median difference changed sign between runs. The right conclusion:', 'Qua HTTP, chênh lệch trung vị đổi dấu giữa các lần chạy. Kết luận đúng:'],
      ['Hard to exploit here, but the fix is free: use it anyway', 'Over a network === is safe, so keep it as it is', 'The server became constant-time by accident', 'Localhost adds more noise than the real internet'],
      ['Hard ≠ impossible: more samples, longer secrets, slower comparisons and attackers in the same data centre all help the attacker. timingSafeEqual or a digest lookup costs nothing.', 'Khó ≠ không thể: nhiều mẫu hơn, bí mật dài hơn, phép so chậm hơn và kẻ tấn công cùng trung tâm dữ liệu đều giúp kẻ tấn công. timingSafeEqual hay tra digest chẳng tốn gì.']),
  ],
  goiY: [['Ask what the CPU actually had to do in each loop.', 'Hỏi CPU thật sự phải làm gì trong mỗi vòng lặp.'], ['Compare the size of the signal with the spread of the noise.', 'So độ lớn tín hiệu với độ dao động của nhiễu.']],
  loi: [['Trusting a flat benchmark.', 'Tin một phép đo phẳng lì.'], ['“Not exploitable over HTTP, so leave ===”.', '"Qua HTTP không khai thác được, cứ để ===".']],
  tns: [tn('timing side channel', 'kênh rò thời gian'), tn('micro-benchmark', 'phép đo hiệu năng nhỏ')],
  kn: ['timing attacks'],
});

/* ── 2. Tự viết: safeEqual ── */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  var diff = a.length ^ b.length;                    // different lengths ⇒ not equal, but keep going
  var n = Math.max(a.length, b.length);
  for (var i = 0; i < n; i++) {
    diff |= (a.charCodeAt(i) | 0) ^ (b.charCodeAt(i) | 0);   // past the end: NaN | 0 = 0
  }
  return diff === 0;
}
const S2 = jsBai({
  ten: '1.3-2 — Write safeEqual(a, b) without an early exit', kho: 'MEDIUM', phut: 15,
  en: `<p>Write <code>safeEqual(a, b)</code> for two strings: <code>true</code> only if they are equal. It must look at <b>every</b> character no matter where the first difference is — combine differences with <code>^</code> and <code>|=</code> and decide once at the end. Different lengths ⇒ <code>false</code> (do not return early: fold the length difference into the same accumulator). Non-strings ⇒ <code>false</code>; it never throws. No <code>crypto</code>, no <code>timingSafeEqual</code>.</p>`,
  vi: `<p>Viết <code>safeEqual(a, b)</code> cho hai chuỗi: chỉ <code>true</code> khi chúng bằng nhau. Nó phải xem <b>mọi</b> ký tự bất kể chỗ khác đầu tiên ở đâu — gộp các chỗ khác bằng <code>^</code> và <code>|=</code> rồi quyết định một lần ở cuối. Khác độ dài ⇒ <code>false</code> (đừng thoát sớm: gộp chênh lệch độ dài vào cùng biến tích luỹ). Không phải chuỗi ⇒ <code>false</code>; không bao giờ ném lỗi. Không dùng <code>crypto</code>, không <code>timingSafeEqual</code>.</p>`,
  goiY: [['diff = a.length ^ b.length; then loop over the longer length.', 'diff = a.length ^ b.length; rồi lặp theo độ dài lớn hơn.'], ['charCodeAt past the end gives NaN; turn it into a number.', 'charCodeAt quá cuối chuỗi ra NaN; đổi nó thành một số.']],
  loi: [['if (a[i] !== b[i]) return false — the early exit is exactly the leak.', 'if (a[i] !== b[i]) return false — chính lối thoát sớm là chỗ rò.'], ['Returning false as soon as the lengths differ — fine only when length is public.', 'Trả false ngay khi độ dài khác nhau — chỉ ổn khi độ dài là công khai.']],
  gt: ['The accumulator only grows (|=), so one difference anywhere makes it non-zero, and the loop runs the same number of iterations for any content of the given lengths. In LabFlow ID the toolkit goes further (double HMAC, lesson 1.3) — and the best option is not comparing at all (digest lookup).', 'Biến tích luỹ chỉ tăng (|=), nên một chỗ khác bất kỳ cũng làm nó khác 0, và vòng lặp chạy cùng số lần với mọi nội dung ở cùng độ dài. Bộ công cụ của LabFlow ID đi xa hơn (HMAC hai lớp, bài 1.3) — và tốt nhất là không so gì cả (tra digest).'],
  kn: ['constant-time comparison'],
  tns: [tn('accumulator', 'biến tích luỹ')],
  dau: `/** true only if a and b are the same string — look at every character */
function safeEqual(a, b) {
  // Write your solution here
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(safeEqual),
  cases: [
    { goi: goi('safeEqual', 'lfid_ses_abcdef', 'lfid_ses_abcdef') },
    { goi: goi('safeEqual', 'lfid_ses_abcdef', 'lfid_ses_abcdeg') },
    { goi: goi('safeEqual', 'lfid_ses_abc', 'lfid_ses_abcdef'), an: true },
    { goi: goi('safeEqual', '', ''), an: true },
    { goi: goi('safeEqual', 'abc', ''), an: true },
    { goi: 'safeEqual(undefined, undefined)', an: true, moTa: ['undefined vs undefined ⇒ false', 'undefined với undefined ⇒ false'] },
    { goi: goi('safeEqual', 'é', 'é'), an: true },
    { goi: goi('safeEqual', 'ab', 'abab'), an: true, moTa: ['A prefix repeated', 'Lặp lại tiền tố'] },
  ],
  kiemThem: [
    { kiem: 'ma-nguon', moTa: { en: 'Combines differences with ^ and |=', vi: 'Gộp chỗ khác bằng ^ và |=' }, tep: 'answer.js', khop: '\\|=' },
    { kiem: 'ma-nguon', moTa: { en: 'Never compares single characters with == / === / != / !== (that is the early exit)', vi: 'Không so từng ký tự bằng == / === / != / !== (đó chính là lối thoát sớm)' }, tep: 'answer.js', khop: '(\\[\\s*\\w+\\s*\\]|charAt\\(\\s*\\w+\\s*\\)|charCodeAt\\(\\s*\\w+\\s*\\))\\s*(!==?|===?)', phuDinh: true },
    { kiem: 'ma-nguon', moTa: { en: 'Written by hand (no timingSafeEqual, crypto or require)', vi: 'Tự viết (không timingSafeEqual, crypto hay require)' }, tep: 'answer.js', khop: 'timingSafeEqual|crypto|require\\s*\\(', phuDinh: true },
  ],
});

/* ── 3. Tự viết: verifyWebhook ── */
function verifyWebhook(header, raw, nowSec, macHex) {
  var parts = {};
  String(header || '').split(',').forEach(function (kv) {
    var i = kv.indexOf('=');
    if (i > 0) parts[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
  });
  var t = Number(parts.t);
  if (!/^\d+$/.test(parts.t || '') || !/^[0-9a-f]{64}$/.test(parts.v1 || '')) return 'MALFORMED';
  if (Math.abs(nowSec - t) > 300) return 'TOO_OLD';
  var expected = macHex(parts.t + '.' + raw);         // the exact raw bytes, never a re-serialised object
  var diff = 0;
  for (var k = 0; k < 64; k++) diff |= expected.charCodeAt(k) ^ parts.v1.charCodeAt(k);
  return diff === 0 ? 'OK' : 'BAD_SIGNATURE';
}
// A stand-in for HMAC-SHA256 hex (64 hex chars) so the exercise runs in the browser without crypto.
const MAC = 'function (s) { var h = 2166136261, o = ""; for (var r = 0; r < 8; r++) { for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i) + r; h = Math.imul(h, 16777619) >>> 0; } o += ("0000000" + h.toString(16)).slice(-8); } return o; }';
const RAW = '{\n  "type": "user.disabled",\n  "user": "usr_2",\n  "at": "2026-11-01T06:00:00Z"\n}';
const NOW = 1793512800;
const call = (headerExpr, raw, now) => `(function () { var mac = ${MAC}; return verifyWebhook(${headerExpr}, ${JSON.stringify(raw)}, ${now}, mac); })()`;
const signed = (t, body) => `'t=${t},v1=' + mac('${t}.' + ${JSON.stringify(body)})`;
const S3 = jsBai({
  ten: '1.3-3 — Write verifyWebhook(header, raw, nowSec, macHex)', kho: 'HARD', phut: 20,
  en: `<p>LabFlow ID signs webhooks with the header <code>LabFlow-Signature: t=&lt;unix seconds&gt;,v1=&lt;64 hex chars&gt;</code>, where <code>v1 = HMAC-SHA256(secret, t + "." + rawBody)</code>. <code>macHex(text)</code> is given (it already knows the secret). Return:</p><ul>
<li><code>'MALFORMED'</code> — <code>t</code> is not all digits, or <code>v1</code> is not exactly 64 lower-case hex characters (parts may come in any order, with spaces around them);</li>
<li><code>'TOO_OLD'</code> — <code>|nowSec − t| &gt; 300</code>;</li>
<li><code>'BAD_SIGNATURE'</code> — <code>v1</code> differs from <code>macHex(t + "." + raw)</code> (compare all 64 characters, no early exit);</li>
<li><code>'OK'</code> otherwise.</li></ul><p>Lesson 1.3’s real run: parsed body ⇒ BAD_SIGNATURE, raw body ⇒ OK, user changed ⇒ BAD_SIGNATURE, replayed 10 min later ⇒ TOO_OLD.</p>`,
  vi: `<p>LabFlow ID ký webhook bằng header <code>LabFlow-Signature: t=&lt;giây unix&gt;,v1=&lt;64 ký tự hex&gt;</code>, với <code>v1 = HMAC-SHA256(bí mật, t + "." + thân gốc)</code>. <code>macHex(text)</code> được cho sẵn (nó đã biết bí mật). Trả về:</p><ul>
<li><code>'MALFORMED'</code> — <code>t</code> không toàn chữ số, hoặc <code>v1</code> không đúng 64 ký tự hex thường (các phần có thể theo thứ tự bất kỳ, có khoảng trắng quanh chúng);</li>
<li><code>'TOO_OLD'</code> — <code>|nowSec − t| &gt; 300</code>;</li>
<li><code>'BAD_SIGNATURE'</code> — <code>v1</code> khác <code>macHex(t + "." + raw)</code> (so đủ 64 ký tự, không thoát sớm);</li>
<li><code>'OK'</code> trong trường hợp còn lại.</li></ul><p>Lần chạy thật của bài 1.3: thân đã parse ⇒ BAD_SIGNATURE, thân gốc ⇒ OK, đổi người dùng ⇒ BAD_SIGNATURE, gửi lại sau 10 phút ⇒ TOO_OLD.</p>`,
  goiY: [['Split on ",", then split each part at the first "=".', 'Tách theo ",", rồi tách mỗi phần ở dấu "=" đầu tiên.'], ['Check format, then time, then the signature — the cheap checks first.', 'Kiểm định dạng, rồi thời gian, rồi chữ ký — kiểm rẻ trước.']],
  loi: [['Recomputing the MAC over JSON.stringify(JSON.parse(raw)) — the bytes change.', 'Tính MAC trên JSON.stringify(JSON.parse(raw)) — các byte đổi.'], ['No time check: a captured request can be replayed forever.', 'Không kiểm thời gian: request bị bắt được có thể gửi lại mãi.']],
  gt: ['Format first (cheap, and guarantees 64 + 64 characters for the comparison), then the time window, then a constant-time comparison over the exact raw bytes. This is the same shape GitHub, Stripe and Standard Webhooks use.', 'Định dạng trước (rẻ, và bảo đảm 64 + 64 ký tự cho phép so), rồi cửa sổ thời gian, rồi so hằng thời gian trên đúng các byte gốc. Đây cũng là hình dạng GitHub, Stripe và Standard Webhooks dùng.'],
  kn: ['webhook signatures'],
  tns: [tn('replay', 'phát lại request cũ'), tn('tolerance', 'dung sai thời gian')],
  dau: `/** ⇒ 'OK' | 'MALFORMED' | 'TOO_OLD' | 'BAD_SIGNATURE' */
function verifyWebhook(header, raw, nowSec, macHex) {
  // Write your solution here
  var v1 = header.split('v1=')[1];
  return v1 === macHex(raw) ? 'OK' : 'BAD_SIGNATURE';
}
`,
  giai: '// Reference solution\n' + nguon(verifyWebhook),
  cases: [
    { goi: call(signed(NOW, RAW), RAW, NOW), moTa: ['Raw body, fresh (real run: OK)', 'Thân gốc, mới (chạy thật: OK)'] },
    { goi: call(signed(NOW, RAW), RAW.replace('usr_2', 'usr_3'), NOW), moTa: ['User changed (real run: BAD_SIGNATURE)', 'Đổi người dùng (chạy thật: BAD_SIGNATURE)'] },
    { goi: call(signed(NOW - 600, RAW), RAW, NOW), an: true, moTa: ['Replayed 10 minutes later', 'Gửi lại sau 10 phút'] },
    { goi: call(signed(NOW - 240, RAW), RAW, NOW), an: true, moTa: ['4 minutes old: still inside the window', 'Cũ 4 phút: vẫn trong cửa sổ'] },
    { goi: call(signed(NOW, RAW), JSON.stringify(JSON.parse(RAW)), NOW), an: true, moTa: ['Re-serialised body', 'Thân bị serialize lại'] },
    { goi: call("'v1=' + mac('" + NOW + ".' + " + JSON.stringify(RAW) + ") + ' , t=" + NOW + "'", RAW, NOW), an: true, moTa: ['Parts reversed, with spaces', 'Đảo thứ tự, có khoảng trắng'] },
    { goi: call(`'t=${NOW},v1=abc'`, RAW, NOW), an: true },
    { goi: call(`'t=1e9,v1=' + mac('1e9.' + ${JSON.stringify(RAW)})`, RAW, NOW), an: true },
    { goi: call('undefined', RAW, NOW), an: true },
  ],
});

/* ── 4. Khi nào dùng gì ── */
const CACH = ['store a digest and look it up', 'timingSafeEqual / safeEqual', 'let argon2.verify compare', 'safeEqual + an attempt limit', 'plain === is fine'];
const S4 = cs({
  ten: '1.3-4 — When to use which', kho: 'EASY', phut: 6, loai: 'table',
  en: 'For each thing LabFlow ID has to check, pick how to check it.',
  vi: 'Với mỗi thứ LabFlow ID phải kiểm, chọn cách kiểm.',
  bang: [bang1('b1', ['Value → how to check', 'Giá trị → cách kiểm'], [{ ma: 'x', ten: 'Value' }, { ma: 'c', ten: 'How', luaChon: CACH }], [
    { o: { x: 'A session token lfid_ses_… presented on every request' }, a: { c: 'store a digest and look it up' } },
    { o: { x: 'An API key lfid_key_… sent by a script' }, a: { c: 'store a digest and look it up' } },
    { o: { x: 'The v1 signature of an incoming webhook' }, a: { c: 'timingSafeEqual / safeEqual' } },
    { o: { x: 'The password typed at sign-in' }, a: { c: 'let argon2.verify compare' } },
    { o: { x: 'A 6-digit code from an authenticator app' }, a: { c: 'safeEqual + an attempt limit' } },
    { o: { x: 'The role "LAB_MANAGER" read from the database' }, a: { c: 'plain === is fine' } },
  ], ['Random tokens: no comparison at all (the database index does it). Recomputed signatures: constant time. Passwords: the slow hash compares. Short codes: constant time is not enough — a million possibilities need an attempt limit. Non-secrets: ===.', 'Token ngẫu nhiên: không so gì (chỉ mục CSDL lo). Chữ ký tự tính lại: hằng thời gian. Mật khẩu: hàm băm chậm tự so. Mã ngắn: hằng thời gian chưa đủ — một triệu khả năng cần giới hạn lượt thử. Không phải bí mật: ===.'])],
  goiY: [['Is it random and long, recomputed, human-chosen, short, or not secret at all?', 'Nó ngẫu nhiên và dài, tự tính lại, do người chọn, ngắn, hay chẳng phải bí mật?'], ['A session token never needs to be compared in your code.', 'Token phiên không bao giờ cần so trong mã của bạn.']],
  loi: [['Hashing passwords with SHA-256 because tokens use SHA-256.', 'Băm mật khẩu bằng SHA-256 vì token dùng SHA-256.'], ['Protecting a 6-digit code only with constant time.', 'Bảo vệ mã 6 chữ số chỉ bằng so hằng thời gian.']],
  kn: ['constant-time comparison'],
});

export default doiDau({ slug: 'auth-1-3-so-sanh-hang-thoi-gian', ten: '1.3 Comparing two secrets with === is a bug', khoa: KHOA, baiHoc: 'auth-1-3-so-sanh-hang-thoi-gian', de: [S1, S2, S3, S4] });
