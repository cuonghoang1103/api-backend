/** Node.js 8.2 — JWT đọc được nhưng không sửa được, decode ≠ verify, server chốt thuật toán + issuer + audience + hạn, refresh token ngẫu nhiên lưu dạng băm, xoay vòng và thu hồi cả họ, client làm mới một lần. */
import crypto from 'node:crypto';
import { modul, cs, q, tn, jsBai, goi, APP_ERROR, TRO_GIUP_HMAC, TRO_GIUP } from './_node-c6-8.mjs';

/* token THẬT ký bằng node:crypto lúc dựng đề (HS256), iat/exp cố định như output của bài */
const b64u = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const sign = (payload, secret, header = { alg: 'HS256', typ: 'JWT' }) => {
  const head = `${b64u(header)}.${b64u(payload)}`;
  return `${head}.${crypto.createHmac('sha256', secret).update(head).digest('base64url')}`;
};
const SECRET = 'lab-secret-0f9c2e7a4b1d8e6f3a5c7b9d2e4f6a8c';
const CLAIMS = { sub: '1', role: 'USER', tv: 0, iat: 1785172416, exp: 1785173316, aud: 'cuongthai-web', iss: 'cuongthai-api' };
const T_OK = sign(CLAIMS, SECRET);
const [TH, , TS] = T_OK.split('.');
const T_ADMIN_EDITED = `${TH}.${b64u({ ...CLAIMS, role: 'ADMIN' })}.${TS}`;                  // payload edited, original signature
const T_OTHER_KEY = sign({ ...CLAIMS, role: 'ADMIN' }, 'some-other-secret');                     // right claims, wrong key
const T_NONE = `${b64u({ alg: 'none', typ: 'JWT' })}.${b64u({ sub: '1', role: 'ADMIN' })}.`;     // alg none
const T_RS = sign({ ...CLAIMS, role: 'ADMIN' }, SECRET, { alg: 'RS256', typ: 'JWT' });           // header lies about the algorithm
const T_OTHER_AUD = sign({ ...CLAIMS, aud: 'app-khac' }, SECRET);
const T_OTHER_ISS = sign({ ...CLAIMS, iss: 'someone-else' }, SECRET);
const T_SHORT = sign({ sub: '1', iat: 1785172416, exp: 1785172417 }, SECRET);
const NOW = 1785172500;   // 84 s after iat

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '8.2 · 1 — What a JWT guarantees, and the one thing it cannot do', kho: 'EASY', phut: 8,
  en: 'Lesson 8.2 in one sentence: you cannot take a JWT back. Six questions on what follows from it.',
  vi: 'Bài 8.2 trong một câu: bạn không thể thu hồi một JWT. Sáu câu hỏi về những gì suy ra từ đó.',
  cau: [
    q('c1', ['Anyone holding an access token runs <code>Buffer.from(payload, "base64url")</code>. What do they see?', 'Ai đang giữ access token chạy <code>Buffer.from(payload, "base64url")</code>. Họ thấy gì?'],
      ['Every claim in clear text — base64url is an encoding, not encryption', 'Random bytes, because the payload is encrypted with the secret', 'Only the sub claim', 'Nothing without the secret'],
      ['A signature guarantees integrity, never confidentiality. Nothing in a payload you would not print on the user’s screen.', 'Chữ ký đảm bảo toàn vẹn, không bao giờ bảo mật. Không đưa vào payload thứ bạn không dám in lên màn hình người dùng.']),
    q('c2', ['Your auth middleware calls <code>jwt.decode(token)</code> to read the role. What do you have?', 'Middleware xác thực của bạn gọi <code>jwt.decode(token)</code> để đọc role. Bạn có gì?'],
      ['No authentication at all', 'Authentication, but slower than verify', 'Authentication without expiry checks', 'Encryption of the role'],
      ['Grep for decode in the server’s auth path today.', 'Hôm nay hãy grep decode trong đường xác thực của server.']),
    q('c3', ['A hand-rolled verifier reads <code>alg</code> from the token header and accepts <code>"none"</code>. The fix?', 'Một bộ kiểm tự viết đọc <code>alg</code> từ header của token và chấp nhận <code>"none"</code>. Cách sửa?'],
      ['The server pins the algorithm: algorithms: ["HS256"]', 'Reject every token longer than 228 characters', 'Base64-decode the header twice before reading it', 'Lower-case the alg value before comparing it'],
      ['The same mistake enables algorithm confusion: an HS256 token signed with a PUBLIC key accepted by a server that expects RS256.', 'Cùng lỗi đó mở đường cho nhầm thuật toán: token HS256 ký bằng khoá CÔNG KHAI được server mong RS256 chấp nhận.']),
    q('c4', ['A user is fired at 09:00; their access token expires at 09:13. Verification never touches the database. What happens until 09:13?', 'Một người bị cho nghỉ lúc 09:00; access token hết hạn lúc 09:13. Việc kiểm không bao giờ chạm CSDL. Chuyện gì xảy ra tới 09:13?'],
      ['The token keeps verifying', 'It stops at 09:00 because the signature changes', 'The client is logged out by the browser', 'PostgreSQL rejects the token'],
      ['15-minute access (26,113 verifies/s, no DB) + 30-day refresh stored in the database, revocable in one UPDATE.', 'Access 15 phút (26.113 lần kiểm/s, không CSDL) + refresh 30 ngày lưu trong CSDL, thu hồi bằng một UPDATE.']),
    q('c5', ['Why is plain SHA-256 fine for storing refresh tokens when lesson 8.1 forbade it for passwords?', 'Vì sao SHA-256 thường là đủ để lưu refresh token, trong khi bài 8.1 cấm dùng cho mật khẩu?'],
      ['The token is 256 random bits — there is nothing to guess, so a one-way function is all you need', 'Refresh tokens expire, so they do not need protection', 'SHA-256 is slow enough for tokens', 'Refresh tokens are encrypted by the browser'],
      ['Slowness protects human-chosen, guessable values. A leaked table of token hashes logs nobody in.', 'Độ chậm bảo vệ giá trị do người chọn, đoán được. Bảng hash token bị rò không cho ai đăng nhập.']),
    q('c6', ['A refresh token that was already used is presented again. Why revoke the WHOLE family, not just that row?', 'Một refresh token đã dùng được trình lại lần nữa. Vì sao thu hồi CẢ HỌ, không chỉ dòng đó?'],
      ['You cannot tell the thief from the user; only the user has the password', 'Revoking a whole family saves space in the sessions table', 'Prisma cannot update a single row inside a transaction', 'The access token must always be rotated at the same time'],
      ['The victim’s cost is one extra login; the thief gets nothing.', 'Cái giá của nạn nhân là đăng nhập lại một lần; kẻ trộm không được gì.']),
  ],
  goiY: [['Separate integrity (signature) from confidentiality (nobody can do it here) and revocability (needs state).', 'Tách toàn vẹn (chữ ký) khỏi bảo mật (ở đây không ai làm được) và khả năng thu hồi (cần trạng thái).'], ['Ask who decides each thing: the server or the token.', 'Hỏi ai quyết định từng thứ: server hay token.']],
  loi: [['Putting phone numbers or other users’ ids into the payload.', 'Đưa số điện thoại hay id của người khác vào payload.'], ['Long-lived access tokens to avoid building refresh.', 'Access token sống lâu để khỏi phải làm refresh.']],
  tns: [tn('access token', 'token truy cập', 'Ngắn hạn, không trạng thái.'), tn('refresh token', 'token làm mới', 'Dài hạn, lưu trong CSDL, thu hồi được.'), tn('claim', 'claim', 'Một mục trong payload: sub, exp…')],
  kn: ['JWT', 'refresh tokens'],
});

/* ── 2. Đọc claim mà không tin chúng ── */
function readClaims(token, nowSec) {
  // decoding is NOT verifying: this is for a client showing "logged in as…", never for server auth
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const dec = (p) => { const bytes = unb64url(p); if (!bytes) return null; try { return JSON.parse(fromUtf8(bytes)); } catch { return null; } };
  const header = dec(parts[0]);
  const payload = dec(parts[1]);
  if (!header || !payload) return null;
  return { header, payload, expiresInSec: typeof payload.exp === 'number' ? payload.exp - nowSec : null };
}
const E2 = jsBai({
  ten: '8.2 · 2 — Write readClaims(token, nowSec): everything in a JWT is readable', kho: 'EASY', phut: 10,
  en: `<p>“Base64url is an encoding, not encryption.” Write what the lesson did with <code>Buffer.from(x, 'base64url')</code>, without Buffer (the grader has none — <code>unb64url(text)</code> → bytes or <code>null</code> and <code>fromUtf8(bytes)</code> are in <code>helpers.js</code>). <code>readClaims(token, nowSec)</code> returns <code>{ header, payload, expiresInSec }</code>:</p>
<ul><li>Split on <code>.</code>; anything that is not exactly 3 parts ⇒ <code>null</code>.</li>
<li>Decode part 1 (header) and part 2 (payload) from base64url, then UTF-8, then JSON. If either fails ⇒ <code>null</code>.</li>
<li><code>expiresInSec = payload.exp − nowSec</code> when <code>exp</code> is a number, else <code>null</code>.</li></ul>
<p>Do <b>not</b> look at the signature: this is the client-side <code>decode</code>. Exercise 3 is the server-side <code>verify</code>.</p>`,
  vi: `<p>"Base64url là mã hoá dạng biểu diễn, không phải mã hoá bí mật." Viết lại việc bài làm với <code>Buffer.from(x, 'base64url')</code>, không dùng Buffer (máy chấm không có — <code>unb64url(text)</code> → mảng byte hoặc <code>null</code> và <code>fromUtf8(bytes)</code> nằm trong <code>helpers.js</code>). <code>readClaims(token, nowSec)</code> trả <code>{ header, payload, expiresInSec }</code>:</p>
<ul><li>Tách theo <code>.</code>; không đúng 3 phần ⇒ <code>null</code>.</li>
<li>Giải phần 1 (header) và phần 2 (payload) từ base64url, rồi UTF-8, rồi JSON. Hỏng một trong hai ⇒ <code>null</code>.</li>
<li><code>expiresInSec = payload.exp − nowSec</code> khi <code>exp</code> là số, không thì <code>null</code>.</li></ul>
<p><b>Không</b> xét chữ ký: đây là <code>decode</code> phía client. Bài 3 là <code>verify</code> phía server.</p>`,
  yc: [['Never throw — return null for anything malformed.', 'Không bao giờ ném lỗi — trả null cho mọi thứ sai dạng.'], ['Do not use the signature part.', 'Không dùng phần chữ ký.']],
  goiY: [['<code>const dec = (p) => { const b = unb64url(p); if (!b) return null; try { return JSON.parse(fromUtf8(b)); } catch { return null; } };</code>', '<code>const dec = (p) => { const b = unb64url(p); if (!b) return null; try { return JSON.parse(fromUtf8(b)); } catch { return null; } };</code>'], ['A valid JSON that is not an object (like <code>5</code>) is still a header you cannot use — treat falsy results as failure.', 'JSON hợp lệ mà không phải object (như <code>5</code>) vẫn là header không dùng được — coi kết quả falsy là hỏng.']],
  loi: [['Using <code>atob</code>: it expects standard base64 with padding, not base64url (<code>-</code>, <code>_</code>, no <code>=</code>).', 'Dùng <code>atob</code>: nó chờ base64 chuẩn có đệm, không phải base64url (<code>-</code>, <code>_</code>, không <code>=</code>).'], ['Believing the decoded role: the edited token in the checks says ADMIN, and decode happily reads it.', 'Tin role đã giải: token bị sửa trong các kiểm ghi ADMIN, và decode vui vẻ đọc ra.']],
  gt: ['The first two parts of a JWT are just base64url-encoded JSON; the signature only proves nobody changed them. So reading claims needs no secret at all — which is why the payload must never hold anything confidential, and why reading is never the same as trusting.', 'Hai phần đầu của JWT chỉ là JSON mã hoá base64url; chữ ký chỉ chứng minh không ai đổi chúng. Nên đọc claim chẳng cần bí mật gì — vì vậy payload không bao giờ được chứa thứ cần giấu, và đọc được không bao giờ đồng nghĩa với tin được.'],
  kn: ['JWT', 'base64url'],
  tns: [tn('base64url', 'base64url', 'Base64 an toàn cho URL: - _ và không có =.'), tn('decode vs verify', 'giải mã vs kiểm chứng')],
  tro: TRO_GIUP_HMAC,
  dau: `function readClaims(token, nowSec) {
  // Write your solution here
  const [h, p] = token.split('.');
  return { header: JSON.parse(atob(h)), payload: JSON.parse(atob(p)), expiresInSec: null };
}
`,
  giai: readClaims,
  cases: [
    { goi: goi('readClaims', T_OK, NOW), moTa: ['The lesson’s token, 84 s after iat', 'Token của bài, 84 s sau iat'] },
    { goi: goi('readClaims', T_ADMIN_EDITED, NOW), moTa: ['An edited token decodes just as happily', 'Token bị sửa vẫn giải ra vui vẻ'] },
    { goi: `[readClaims('abc', 0), readClaims('a.b', 0), readClaims('%%%.e30.x', 0), readClaims(b64url(utf8('not json')) + '.e30.x', 0)]`, an: true },
    { goi: goi('readClaims', T_NONE, NOW), an: true },
    { goi: `readClaims(b64url(utf8('{"alg":"HS256"}')) + '.' + b64url(utf8('{"name":"Bình 🔑","exp":"soon"}')) + '.sig', 10)`, an: true },
  ],
});

/* ── 3. verify viết tay — server quyết định mọi thứ ── */
function verifyHS256(token, secret, opts) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new JsonWebTokenError('jwt malformed');
  const json = (p) => { const b = unb64url(p); if (!b) return null; try { return JSON.parse(fromUtf8(b)); } catch { return null; } };
  const header = json(parts[0]);
  const payload = json(parts[1]);
  if (!header || !payload) throw new JsonWebTokenError('invalid token');
  // 1) the SERVER decides the algorithm — the header never gets a vote ("none", RS256… are refused here)
  if (!opts.algorithms.includes(header.alg) || header.alg !== 'HS256') throw new JsonWebTokenError('invalid algorithm');
  // 2) the signature covers header.payload EXACTLY: one changed byte and it does not match
  const expected = b64url(hmacSha256(utf8(secret), utf8(parts[0] + '.' + parts[1])));
  if (expected !== parts[2]) throw new JsonWebTokenError('invalid signature');
  // 3) expiry — the only revocation mechanism a stateless token has
  if (typeof payload.exp === 'number' && opts.nowSec >= payload.exp) throw new TokenExpiredError('jwt expired', new Date(payload.exp * 1000).toISOString());
  // 4) a valid token minted for ANOTHER app or by ANOTHER issuer is still not ours
  if (opts.audience !== undefined && payload.aud !== opts.audience) throw new JsonWebTokenError('jwt audience invalid. expected: ' + opts.audience);
  if (opts.issuer !== undefined && payload.iss !== opts.issuer) throw new JsonWebTokenError('jwt issuer invalid. expected: ' + opts.issuer);
  return payload;
}
const JWT_ERRORS = `class JsonWebTokenError extends Error { constructor(message) { super(message); this.name = 'JsonWebTokenError'; } }
class TokenExpiredError extends JsonWebTokenError { constructor(message, expiredAt) { super(message); this.name = 'TokenExpiredError'; this.expiredAt = expiredAt; } }`;
const OPTS = { algorithms: ['HS256'], issuer: 'cuongthai-api', audience: 'cuongthai-web', nowSec: NOW };
const E3 = jsBai({
  ten: '8.2 · 3 — Write verifyHS256(token, secret, opts): pin the algorithm, check the signature, expiry, audience, issuer', kho: 'HARD', phut: 30,
  en: `<p>The lesson’s hand-rolled verifier handed out ADMIN twice in eleven lines, because it trusted <code>header.alg</code>. Write one that does not. The tokens in the checks were signed for real with <code>node:crypto</code> (HS256). <code>helpers.js</code> gives you <code>utf8</code>, <code>fromUtf8</code>, <code>b64url</code>, <code>unb64url</code>, <code>hmacSha256(keyBytes, msgBytes)</code> and the two error classes of jsonwebtoken: <code>JsonWebTokenError(message)</code>, <code>TokenExpiredError(message, expiredAt)</code>.</p>
<p><code>verifyHS256(token, secret, { algorithms, issuer, audience, nowSec })</code> returns the payload or throws, checking <b>in this order</b>:</p>
<ol><li>not 3 parts ⇒ <code>JsonWebTokenError("jwt malformed")</code>; header or payload not decodable JSON ⇒ <code>"invalid token"</code>;</li>
<li><code>header.alg</code> must be in <code>opts.algorithms</code> <b>and</b> be <code>"HS256"</code> (the only one this function implements) ⇒ else <code>"invalid algorithm"</code>;</li>
<li>signature = <code>b64url(hmacSha256(utf8(secret), utf8(part0 + "." + part1)))</code> must equal part 3 ⇒ else <code>"invalid signature"</code>;</li>
<li><code>nowSec &gt;= payload.exp</code> ⇒ <code>TokenExpiredError("jwt expired", &lt;exp as ISO string&gt;)</code>;</li>
<li><code>payload.aud !== opts.audience</code> ⇒ <code>"jwt audience invalid. expected: &lt;opts.audience&gt;"</code>; <code>payload.iss !== opts.issuer</code> ⇒ <code>"jwt issuer invalid. expected: &lt;opts.issuer&gt;"</code>.</li></ol>`,
  vi: `<p>Bộ kiểm tự viết của bài đã trao quyền ADMIN hai lần trong mười một dòng, vì nó tin <code>header.alg</code>. Hãy viết một bộ không tin. Các token trong kiểm được ký thật bằng <code>node:crypto</code> (HS256). <code>helpers.js</code> cho sẵn <code>utf8</code>, <code>fromUtf8</code>, <code>b64url</code>, <code>unb64url</code>, <code>hmacSha256(keyBytes, msgBytes)</code> và hai lớp lỗi của jsonwebtoken: <code>JsonWebTokenError(message)</code>, <code>TokenExpiredError(message, expiredAt)</code>.</p>
<p><code>verifyHS256(token, secret, { algorithms, issuer, audience, nowSec })</code> trả payload hoặc ném lỗi, kiểm <b>theo thứ tự này</b>:</p>
<ol><li>không đủ 3 phần ⇒ <code>JsonWebTokenError("jwt malformed")</code>; header hay payload không giải ra JSON ⇒ <code>"invalid token"</code>;</li>
<li><code>header.alg</code> phải nằm trong <code>opts.algorithms</code> <b>và</b> là <code>"HS256"</code> (thuật toán duy nhất hàm này cài) ⇒ không thì <code>"invalid algorithm"</code>;</li>
<li>chữ ký = <code>b64url(hmacSha256(utf8(secret), utf8(part0 + "." + part1)))</code> phải bằng phần 3 ⇒ không thì <code>"invalid signature"</code>;</li>
<li><code>nowSec &gt;= payload.exp</code> ⇒ <code>TokenExpiredError("jwt expired", &lt;exp dạng chuỗi ISO&gt;)</code>;</li>
<li><code>payload.aud !== opts.audience</code> ⇒ <code>"jwt audience invalid. expected: &lt;opts.audience&gt;"</code>; <code>payload.iss !== opts.issuer</code> ⇒ <code>"jwt issuer invalid. expected: &lt;opts.issuer&gt;"</code>.</li></ol>`,
  yc: [['The header never chooses the algorithm.', 'Header không bao giờ được chọn thuật toán.'], ['Check the signature before trusting ANY claim (exp, aud, iss, role).', 'Kiểm chữ ký trước khi tin BẤT KỲ claim nào (exp, aud, iss, role).']],
  goiY: [['Recompute the signature over the ORIGINAL text of the first two parts — not over re-serialised JSON.', 'Tính lại chữ ký trên CHỮ GỐC của hai phần đầu — không phải JSON đã tuần tự hoá lại.'], ['<code>new Date(exp * 1000).toISOString()</code> for expiredAt.', '<code>new Date(exp * 1000).toISOString()</code> cho expiredAt.']],
  loi: [['<code>if (header.alg === "none") return payload</code> — hole 1 of the lesson’s verifier.', '<code>if (header.alg === "none") return payload</code> — lỗ thứ nhất của bộ kiểm trong bài.'], ['Checking exp before the signature: an attacker learns nothing from it, but you have already trusted an unverified claim.', 'Kiểm exp trước chữ ký: kẻ tấn công không học được gì, nhưng bạn đã tin một claim chưa kiểm.'], ['Signing <code>JSON.stringify(payload)</code> instead of the received text: any token with different key order or spacing fails.', 'Ký <code>JSON.stringify(payload)</code> thay vì chữ nhận được: token nào khác thứ tự khoá hay khoảng trắng đều hỏng.']],
  gt: ['Every check here is a promise the SERVER makes, configured on the server: which algorithm (so alg: none and algorithm confusion are impossible), which key (so an edited payload or another key’s signature fails), how long (exp), and for whom (aud/iss — so a valid token of another app is still refused). The order matters too: nothing from the payload is believed before the signature matched.', 'Mọi phép kiểm ở đây là lời hứa của SERVER, cấu hình trên server: thuật toán nào (nên alg: none và nhầm thuật toán là bất khả), khoá nào (nên payload bị sửa hay chữ ký bằng khoá khác đều hỏng), bao lâu (exp), và cho ai (aud/iss — nên token hợp lệ của app khác vẫn bị từ chối). Thứ tự cũng quan trọng: không tin gì trong payload trước khi chữ ký khớp.'],
  kn: ['JWT', 'HMAC', 'algorithm confusion'],
  tns: [tn('HMAC', 'HMAC', 'Mã xác thực thông điệp dùng khoá bí mật.'), tn('audience', 'đối tượng nhận', 'aud: token dành cho app nào.'), tn('issuer', 'bên phát hành', 'iss: ai ký token.')],
  tro: TRO_GIUP_HMAC + '\n// provided — the error classes of jsonwebtoken 9\n' + JWT_ERRORS + '\n',
  dau: `function verifyHS256(token, secret, opts) {
  // Write your solution here — this is the lesson's naive verifier
  const [h, p, s] = token.split('.');
  const header = JSON.parse(fromUtf8(unb64url(h)));
  const payload = JSON.parse(fromUtf8(unb64url(p)));
  if (header.alg === 'none') return payload;
  return payload;
}
`,
  giai: verifyHS256,
  chung: `const SECRET = ${JSON.stringify(SECRET)}; const OPTS = ${JSON.stringify(OPTS)};
const tryIt = (t, o = OPTS, s = SECRET) => { try { return { ok: verifyHS256(t, s, o) }; } catch (e) { return { thrown: e.name, message: e.message, ...(e.expiredAt ? { expiredAt: e.expiredAt } : {}) }; } };`,
  cases: [
    { goi: `tryIt(${JSON.stringify(T_OK)})`, moTa: ['A valid token ⇒ the payload', 'Token hợp lệ ⇒ payload'] },
    { goi: `tryIt(${JSON.stringify(T_ADMIN_EDITED)})`, moTa: ['Attack 1: payload edited to ADMIN ⇒ invalid signature', 'Tấn công 1: sửa payload thành ADMIN ⇒ invalid signature'] },
    { goi: `tryIt(${JSON.stringify(T_NONE)})`, moTa: ['alg: none ⇒ invalid algorithm', 'alg: none ⇒ invalid algorithm'] },
    { goi: `tryIt(${JSON.stringify(T_OK)}, { ...OPTS, nowSec: 1785173316 })`, moTa: ['At exp ⇒ jwt expired', 'Đúng lúc exp ⇒ jwt expired'] },
    { goi: `[tryIt(${JSON.stringify(T_OTHER_KEY)}), tryIt(${JSON.stringify(T_RS)}), tryIt(${JSON.stringify(T_OK)}, { ...OPTS, algorithms: ['RS256'] })]`, an: true, moTa: ['Other key; header says RS256; server allows only RS256', 'Khoá khác; header ghi RS256; server chỉ cho RS256'] },
    { goi: `[tryIt(${JSON.stringify(T_OTHER_AUD)}), tryIt(${JSON.stringify(T_OTHER_ISS)}), tryIt(${JSON.stringify(T_SHORT)}, { algorithms: ['HS256'], nowSec: 1785172418 })]`, an: true },
    { goi: `[tryIt('abc'), tryIt('a.b.c.d'), tryIt('%%.e30.x'), tryIt(${JSON.stringify(T_OK)}, OPTS, 'wrong-secret')]`, an: true },
    { goi: `tryIt(${JSON.stringify(T_OK.split('.').slice(0, 2).join('.') + '.' + 'A'.repeat(43))})`, an: true },
  ],
  saiMau: [
    verifyHS256.toString().replace("if (!opts.algorithms.includes(header.alg) || header.alg !== 'HS256') throw new JsonWebTokenError('invalid algorithm');", "if (header.alg === 'none') return payload;"),
    verifyHS256.toString().replace("if (opts.audience !== undefined && payload.aud !== opts.audience) throw new JsonWebTokenError('jwt audience invalid. expected: ' + opts.audience);", ''),
  ],
});

/* ── 4. Refresh token: ngẫu nhiên, lưu băm, xoay vòng, phát hiện tái sử dụng ── */
function issueSession(db, userId, deps, familyId = deps.newFamilyId()) {
  const refresh = deps.newRefreshToken();                       // 256 random bits — NOT a JWT
  db.sessions.push({
    userId, familyId,
    tokenHash: hex(sha256(utf8(refresh))),                     // store only the hash: a leaked table logs nobody in
    expiresAt: deps.now() + 30 * 86400000, usedAt: null, revokedAt: null,
  });
  return { accessToken: deps.signAccess(userId), refreshToken: refresh };
}
function refresh(db, presented, deps) {
  const s = db.sessions.find((x) => x.tokenHash === hex(sha256(utf8(String(presented)))));
  if (!s) throw new AppError(401, 'REFRESH_INVALID', 'Unknown refresh token');
  if (s.usedAt || s.revokedAt) {
    // a used token presented again cannot happen honestly: two parties hold the chain — burn the whole family
    let n = 0;
    for (const x of db.sessions) if (x.familyId === s.familyId && !x.revokedAt) { x.revokedAt = deps.now(); n++; }
    throw new AppError(401, 'REFRESH_REUSE_DETECTED', 'Refresh token reuse detected — revoked the whole family (' + n + ' sessions)');
  }
  if (s.expiresAt <= deps.now()) throw new AppError(401, 'REFRESH_EXPIRED', 'Refresh token expired');
  s.usedAt = deps.now();                                         // single-use
  return issueSession(db, s.userId, deps, s.familyId);          // same family: the chain continues
}
const DEPS = `let tokN = 0, famN = 0, clock = 1785172416000;
const deps = { newRefreshToken: () => 'rt-' + (++tokN) + '-' + 'x'.repeat(39), newFamilyId: () => 'fam-' + (++famN), signAccess: (userId) => 'access-for-' + userId + '-at-' + clock, now: () => clock };
const tick = (ms) => { clock += ms; };
const table = (db) => db.sessions.map((s) => [s.familyId, s.tokenHash.slice(0, 12), s.usedAt ? 'used' : '-', s.revokedAt ? 'revoked' : '-']);
const caught = (f) => { try { return f(); } catch (e) { return { thrown: e.name, status: e.status, code: e.code, ...(e.code === 'REFRESH_REUSE_DETECTED' ? { message: e.message } : {}) }; } };`;
const E4 = jsBai({
  ten: '8.2 · 4 — Write issueSession() and refresh(): rotation, and reuse that burns the whole family', kho: 'HARD', phut: 30,
  en: `<p>The design of lesson 8.2, on an in-memory table <code>db.sessions</code> of rows <code>{ userId, familyId, tokenHash, expiresAt, usedAt, revokedAt }</code> (times in ms). <code>deps = { newRefreshToken(), newFamilyId(), signAccess(userId), now() }</code>. <code>helpers.js</code> has <code>utf8</code>, <code>sha256</code>, <code>hex</code> and <code>AppError</code>.</p>
<ul><li><code>issueSession(db, userId, deps, familyId = deps.newFamilyId())</code> — login (new family) or rotation (existing family): push a row with <code>tokenHash = hex(sha256(utf8(refreshToken)))</code> (never the token itself), <code>expiresAt = now + 30 days</code>, <code>usedAt</code> and <code>revokedAt</code> null; return <code>{ accessToken: signAccess(userId), refreshToken }</code>.</li>
<li><code>refresh(db, presented, deps)</code>: find the row by the hash of <code>presented</code> — none ⇒ <code>AppError(401, 'REFRESH_INVALID')</code>. If it is already <b>used or revoked</b> ⇒ set <code>revokedAt = now</code> on every not-yet-revoked row of its family and throw <code>AppError(401, 'REFRESH_REUSE_DETECTED', 'Refresh token reuse detected — revoked the whole family (N sessions)')</code>. If <code>expiresAt &lt;= now</code> ⇒ <code>REFRESH_EXPIRED</code>. Otherwise mark it <code>usedAt = now</code> and issue a new pair in the <b>same</b> family.</li></ul>
<p>The first check replays the lesson’s run: rotate, replay the old token (2 sessions revoked), then the victim’s new token (0 sessions — already burned).</p>`,
  vi: `<p>Thiết kế của bài 8.2, trên bảng trong bộ nhớ <code>db.sessions</code> gồm các dòng <code>{ userId, familyId, tokenHash, expiresAt, usedAt, revokedAt }</code> (thời gian tính bằng ms). <code>deps = { newRefreshToken(), newFamilyId(), signAccess(userId), now() }</code>. <code>helpers.js</code> có <code>utf8</code>, <code>sha256</code>, <code>hex</code> và <code>AppError</code>.</p>
<ul><li><code>issueSession(db, userId, deps, familyId = deps.newFamilyId())</code> — đăng nhập (họ mới) hay xoay vòng (họ có sẵn): thêm một dòng với <code>tokenHash = hex(sha256(utf8(refreshToken)))</code> (không bao giờ là chính token), <code>expiresAt = now + 30 ngày</code>, <code>usedAt</code> và <code>revokedAt</code> null; trả <code>{ accessToken: signAccess(userId), refreshToken }</code>.</li>
<li><code>refresh(db, presented, deps)</code>: tìm dòng theo hash của <code>presented</code> — không có ⇒ <code>AppError(401, 'REFRESH_INVALID')</code>. Nếu đã <b>dùng hoặc bị thu hồi</b> ⇒ đặt <code>revokedAt = now</code> cho mọi dòng chưa bị thu hồi của họ đó và ném <code>AppError(401, 'REFRESH_REUSE_DETECTED', 'Refresh token reuse detected — revoked the whole family (N sessions)')</code>. Nếu <code>expiresAt &lt;= now</code> ⇒ <code>REFRESH_EXPIRED</code>. Còn lại đánh dấu <code>usedAt = now</code> và cấp cặp mới trong <b>cùng</b> họ.</li></ul>
<p>Kiểm đầu tiên diễn lại lần chạy của bài: xoay vòng, dùng lại token cũ (thu hồi 2 phiên), rồi token mới của nạn nhân (0 phiên — đã bị đốt).</p>`,
  yc: [['Never store the refresh token itself.', 'Không bao giờ lưu chính refresh token.'], ['Reuse ⇒ revoke the family, then refuse.', 'Dùng lại ⇒ thu hồi cả họ, rồi từ chối.'], ['Rotation keeps the familyId.', 'Xoay vòng giữ nguyên familyId.']],
  goiY: [['Login calls <code>issueSession(db, userId, deps)</code>; refresh calls it with <code>s.familyId</code> — that two-line difference is the whole rotation mechanism.', 'Đăng nhập gọi <code>issueSession(db, userId, deps)</code>; refresh gọi với <code>s.familyId</code> — khác biệt hai dòng đó là toàn bộ cơ chế xoay vòng.'], ['Check used/revoked BEFORE expiry: a stolen, replayed token must still burn the family even if it is old.', 'Kiểm đã dùng/bị thu hồi TRƯỚC hạn: token bị trộm đem dùng lại vẫn phải đốt cả họ dù nó đã cũ.']],
  loi: [['Making refresh tokens JWTs: a signed token you cannot revoke is the problem you were escaping.', 'Làm refresh token thành JWT: token có chữ ký mà không thu hồi được chính là vấn đề bạn đang thoát ra.'], ['Revoking only the replayed row: the thief’s copy of the NEW token keeps working.', 'Chỉ thu hồi dòng bị dùng lại: bản sao token MỚI của kẻ trộm vẫn chạy.'], ['Allowing a used token to refresh again (“it is still within 30 days”): theft becomes undetectable.', 'Cho token đã dùng làm mới lần nữa ("vẫn trong 30 ngày"): trộm trở nên không phát hiện được.']],
  gt: ['Single-use tokens turn theft into an observable event: in honest operation a used token is never presented again, so when it is, two parties hold the chain. You cannot tell which one is the thief, so you burn the family; the real user logs in with a password the thief does not have. Storing only SHA-256 hashes means the table itself is useless to whoever steals it.', 'Token dùng một lần biến vụ trộm thành sự kiện quan sát được: vận hành lương thiện thì token đã dùng không bao giờ được trình lại, nên khi nó xuất hiện, có hai bên đang giữ chuỗi. Không biết ai là kẻ trộm, nên đốt cả họ; người dùng thật đăng nhập bằng mật khẩu mà kẻ trộm không có. Chỉ lưu hash SHA-256 nghĩa là chính cái bảng vô dụng với kẻ lấy được nó.'],
  kn: ['refresh tokens', 'rotation'],
  tns: [tn('token family', 'họ token', 'Chuỗi xoay vòng của MỘT lần đăng nhập.'), tn('reuse detection', 'phát hiện dùng lại'), tn('rotation', 'xoay vòng')],
  tro: TRO_GIUP + '\n// provided — the AppError of lesson 5.4\n' + APP_ERROR + '\n',
  dau: `function issueSession(db, userId, deps, familyId = deps.newFamilyId()) {
  // Write your solution here
  const refresh = deps.newRefreshToken();
  db.sessions.push({ userId, familyId, tokenHash: refresh, expiresAt: deps.now() + 30 * 86400000, usedAt: null, revokedAt: null });
  return { accessToken: deps.signAccess(userId), refreshToken: refresh };
}
function refresh(db, presented, deps) {
  const s = db.sessions.find((x) => x.tokenHash === presented);
  if (!s) throw new AppError(401, 'REFRESH_INVALID', 'Unknown refresh token');
  return issueSession(db, s.userId, deps);
}
`,
  giai: [issueSession, refresh],
  chung: DEPS,
  cases: [
    { goi: `(() => { const db = { sessions: [] }; issueSession(db, 1, deps); const login = issueSession(db, 1, deps); tick(1000); const rotated = refresh(db, login.refreshToken, deps); tick(1000);
  const thief = caught(() => refresh(db, login.refreshToken, deps)); const victim = caught(() => refresh(db, rotated.refreshToken, deps));
  return { rotatedDiffers: rotated.refreshToken !== login.refreshToken, thief, victim, table: table(db) }; })()`, moTa: ['The lesson’s run: rotate, reuse, victim', 'Lần chạy của bài: xoay vòng, dùng lại, nạn nhân'] },
    { goi: `(() => { const db = { sessions: [] }; const s = issueSession(db, 7, deps); return [s, db.sessions[0].tokenHash === s.refreshToken, db.sessions[0].tokenHash.length, db.sessions[0].familyId]; })()`, moTa: ['Only the hash is stored', 'Chỉ lưu hash'] },
    { goi: `(() => { const db = { sessions: [] }; const a = issueSession(db, 1, deps); const b = refresh(db, a.refreshToken, deps); const c = refresh(db, b.refreshToken, deps); return [db.sessions.map((s) => s.familyId), c.accessToken, table(db)]; })()`, an: true },
    { goi: `(() => { const db = { sessions: [] }; const a = issueSession(db, 1, deps); tick(30 * 86400000); const r = caught(() => refresh(db, a.refreshToken, deps)); return [r, caught(() => refresh(db, 'never-issued', deps))]; })()`, an: true },
    { goi: `(() => { const db = { sessions: [] }; const phone = issueSession(db, 1, deps); const laptop = issueSession(db, 1, deps); const p2 = refresh(db, phone.refreshToken, deps); caught(() => refresh(db, phone.refreshToken, deps)); return [caught(() => refresh(db, laptop.refreshToken, deps)).accessToken, table(db)]; })()`, an: true, moTa: ['Burning one family leaves the other device logged in', 'Đốt một họ để thiết bị kia vẫn đăng nhập'] },
  ],
  saiMau: [
    `${issueSession}\n` + refresh.toString().replace("for (const x of db.sessions) if (x.familyId === s.familyId && !x.revokedAt) { x.revokedAt = deps.now(); n++; }", "if (!s.revokedAt) { s.revokedAt = deps.now(); n++; }"),
    `${issueSession}\n` + refresh.toString().replace("return issueSession(db, s.userId, deps, s.familyId);", 'return issueSession(db, s.userId, deps);'),
  ],
});

/* ── 5. Client: 401 ⇒ làm mới MỘT lần, rồi thử lại ── */
function createApi(base) {
  let refreshing = null;                                   // one refresh in flight, shared by every 401 that arrives meanwhile
  async function refreshOnce() {
    if (!refreshing) {
      refreshing = fetch(base + '/auth/refresh', { method: 'POST' })
        .then((r) => r.ok)
        .finally(() => { refreshing = null; });
    }
    return refreshing;
  }
  async function request(path, init = {}) {
    const res = await fetch(base + path, init);
    if (res.status !== 401 || path.startsWith('/auth/')) return res;      // never refresh for the auth routes themselves
    const ok = await refreshOnce();
    if (!ok) throw new AppError(401, 'LOGGED_OUT', 'Session expired, please log in again');
    return fetch(base + path, init);                                        // retry ONCE; a second 401 is returned as is
  }
  return { request };
}
const B = 'http://api.test/api/v1';
const E5 = jsBai({
  ten: '8.2 · 5 — Write createApi(base): on a 401, refresh once, retry once — never loop', kho: 'MEDIUM', phut: 20,
  en: `<p>The July 2026 incident: the access token died after a day, the cookie lived a week, and no working refresh route existed — so for six days of seven the user saw a logged-in interface where every button failed. The client half of the fix is one interceptor. Write <code>createApi(base)</code> returning <code>{ request(path, init) }</code> that uses the global <code>fetch</code> (the grader’s fake):</p>
<ul><li><code>fetch(base + path, init)</code>. Anything but 401 ⇒ return the response as is. A 401 on a path starting with <code>/auth/</code> ⇒ return it as is (no refresh for login/refresh themselves).</li>
<li>Otherwise call <code>POST base + "/auth/refresh"</code> <b>once</b>; if it is not ok ⇒ throw <code>new AppError(401, 'LOGGED_OUT', …)</code> (<code>AppError</code> is in helpers).</li>
<li>If it is ok ⇒ retry the original request <b>once</b> and return that response, whatever its status.</li>
<li>Several requests that get 401 while a refresh is already in flight must <b>share</b> it — one refresh call, not one per request.</li></ul>`,
  vi: `<p>Sự cố tháng 7/2026: access token chết sau một ngày, cookie sống một tuần, và không có route làm mới nào chạy được — nên sáu ngày trên bảy người dùng thấy giao diện đã đăng nhập mà nút nào cũng hỏng. Nửa phía client của cách sửa là một interceptor. Viết <code>createApi(base)</code> trả <code>{ request(path, init) }</code> dùng <code>fetch</code> toàn cục (fetch GIẢ của máy chấm):</p>
<ul><li><code>fetch(base + path, init)</code>. Khác 401 ⇒ trả nguyên phản hồi. 401 trên đường dẫn bắt đầu bằng <code>/auth/</code> ⇒ trả nguyên (không làm mới cho chính login/refresh).</li>
<li>Còn lại gọi <code>POST base + "/auth/refresh"</code> <b>một lần</b>; không ok ⇒ ném <code>new AppError(401, 'LOGGED_OUT', …)</code> (<code>AppError</code> có trong helpers).</li>
<li>Ok ⇒ thử lại request gốc <b>một lần</b> và trả phản hồi đó, mã gì cũng vậy.</li>
<li>Nhiều request cùng nhận 401 khi đã có một lần làm mới đang chạy phải <b>dùng chung</b> nó — một lần gọi refresh, không phải mỗi request một lần.</li></ul>`,
  yc: [['At most one refresh in flight.', 'Tối đa một lần làm mới đang chạy.'], ['At most one retry per request.', 'Mỗi request tối đa thử lại một lần.']],
  goiY: [['Keep <code>let refreshing = null</code>; the first 401 sets it to the refresh promise, everyone else awaits the same one; clear it in <code>finally</code>.', 'Giữ <code>let refreshing = null</code>; 401 đầu tiên gán nó bằng promise làm mới, mọi người khác await cùng cái đó; xoá nó trong <code>finally</code>.'], ['“Once” matters: without it, an expired refresh token produces an infinite retry loop.', '"Một lần" quan trọng: thiếu nó, refresh token hết hạn tạo vòng thử lại vô hạn.']],
  loi: [['Retrying in a loop until it is not 401 — an expired refresh token hammers your auth endpoint forever.', 'Thử lại trong vòng lặp tới khi hết 401 — refresh token hết hạn đập vào endpoint xác thực mãi mãi.'], ['Refreshing on a 401 from /auth/login: wrong password ⇒ refresh ⇒ 401 ⇒ …', 'Làm mới khi /auth/login trả 401: sai mật khẩu ⇒ làm mới ⇒ 401 ⇒ …'], ['Five parallel requests ⇒ five refreshes: with rotation, four of them present an already-used token and burn the family (exercise 4).', 'Năm request song song ⇒ năm lần làm mới: với xoay vòng, bốn lần trình token đã dùng và đốt cả họ (bài 4).']],
  gt: ['The interceptor turns a dying session into a self-healing one: the 401 triggers exactly one refresh, the request is replayed once, and a failed refresh is a real logout. Sharing the in-flight refresh is not an optimisation — with single-use refresh tokens, two parallel refreshes look exactly like theft to the server.', 'Interceptor biến một phiên đang chết thành phiên tự lành: 401 kích hoạt đúng một lần làm mới, request được phát lại một lần, và làm mới hỏng là đăng xuất thật. Dùng chung lần làm mới đang chạy không phải tối ưu — với refresh token dùng một lần, hai lần làm mới song song trông y như vụ trộm trong mắt server.'],
  kn: ['refresh tokens', 'fetch', 'promises'],
  tns: [tn('interceptor', 'bộ chặn', 'Lớp bọc mọi request của client.'), tn('in flight', 'đang chạy')],
  tro: `// provided — the AppError of lesson 5.4\n${APP_ERROR}\n`,
  dau: `function createApi(base) {
  async function request(path, init = {}) {
    // Write your solution here
    let res = await fetch(base + path, init);
    while (res.status === 401) {
      await fetch(base + '/auth/refresh', { method: 'POST' });
      res = await fetch(base + path, init);
    }
    return res;
  }
  return { request };
}
`,
  giai: createApi,
  chung: `const api = createApi('${B}');
const calls = () => __fetchDaGoi.map((c) => c.method + ' ' + c.url.replace('${B}', ''));
const caught = async (p) => { try { const r = await p; return r.status; } catch (e) { return { thrown: e.name, code: e.code }; } };`,
  timeoutMs: 5000,
  cases: [
    { goi: `[await caught(api.request('/notes')), calls()]`, moTa: ['401 ⇒ refresh ⇒ retry ⇒ 200', '401 ⇒ làm mới ⇒ thử lại ⇒ 200'],
      fetchGia: { [`GET ${B}/notes`]: [{ status: 401, json: { error: { code: 'TOKEN_EXPIRED' } } }, { status: 200, json: { items: [] } }], [`POST ${B}/auth/refresh`]: { status: 200, json: { ok: true } } } },
    { goi: `[await caught(api.request('/notes')), calls()]`, moTa: ['Refresh fails ⇒ LOGGED_OUT, no loop', 'Làm mới hỏng ⇒ LOGGED_OUT, không lặp'],
      fetchGia: { [`GET ${B}/notes`]: { status: 401, json: {} }, [`POST ${B}/auth/refresh`]: { status: 401, json: {} } } },
    { goi: `[await caught(api.request('/auth/login', { method: 'POST' })), calls()]`, moTa: ['A 401 from /auth/* is returned as is', '401 từ /auth/* được trả nguyên'],
      fetchGia: { [`POST ${B}/auth/login`]: { status: 401, json: {} } } },
    { goi: `[await Promise.all(['/notes', '/notes/1', '/me'].map((p) => caught(api.request(p)))), calls().filter((c) => c.includes('refresh')).length]`, an: true, moTa: ['Three parallel 401s share ONE refresh', 'Ba 401 song song dùng chung MỘT lần làm mới'],
      fetchGia: { [`GET ${B}/notes`]: [{ status: 401, json: {} }, { status: 200, json: {} }], [`GET ${B}/notes/1`]: [{ status: 401, json: {} }, { status: 200, json: {} }], [`GET ${B}/me`]: [{ status: 401, json: {} }, { status: 200, json: {} }], [`POST ${B}/auth/refresh`]: { status: 200, json: {}, treMs: 100 } } },
    { goi: `[await caught(api.request('/notes')), calls()]`, an: true, moTa: ['Retry still 401 ⇒ returned once, not looped', 'Thử lại vẫn 401 ⇒ trả về một lần, không lặp'],
      fetchGia: { [`GET ${B}/notes`]: { status: 401, json: {} }, [`POST ${B}/auth/refresh`]: { status: 200, json: {} } } },
    { goi: `[await caught(api.request('/notes')), await caught(api.request('/notes')), calls()]`, an: true,
      fetchGia: { [`GET ${B}/notes`]: [{ status: 200, json: {} }, { status: 403, json: {} }] } },
  ],
  saiMau: [
    createApi.toString().replace("if (!refreshing) {", 'if (true) {'),
    createApi.toString().replace(" || path.startsWith('/auth/')", ''),
  ],
});

export default modul('nodejs-8-2-jwt-access-refresh', '8.2 JWT, refresh tokens and rotation', [E1, E2, E3, E4, E5]);
