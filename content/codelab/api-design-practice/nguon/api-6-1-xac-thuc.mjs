/** API Design · 6.1 — Các cách xác thực: scrypt, JWT HS256 tự dựng, giới hạn đăng nhập (output thật LabFlow Ch6). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Authentication 1 — What the real runs showed', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 6.1 (LabFlow with real logins: scrypt passwords, a hand-built HS256 JWT, a login limit).',
  vi: 'Những điều từ bài 6.1 (LabFlow có đăng nhập thật: mật khẩu scrypt, JWT HS256 tự dựng, giới hạn đăng nhập).',
  cau: [
    q('c1', ['An’s token payload, decoded with base64url, shows {"sub":"usr_1","role":"STUDENT",…}. What does that tell you?', 'Payload token của An giải mã base64url thấy {"sub":"usr_1","role":"STUDENT",…}. Điều đó cho biết gì?'],
      ['A JWT is signed, not encrypted — anyone can read it, so no secrets inside', 'The token was leaked, because a valid token cannot be decoded by anyone', 'The server forgot to encrypt it; HS256 normally hides the payload', 'base64url is a weak form of encryption that only the server can undo'],
      ['HS256 is a signature (HMAC). The payload is only base64url-encoded: readable by anyone, unforgeable without the key.', 'HS256 là chữ ký (HMAC). Payload chỉ được mã hoá base64url: ai cũng đọc được, không giả được nếu không có khoá.']),
    q('c2', ['The attacker changed role to LAB_MANAGER in the payload and kept the old signature. LabFlow answered …', 'Kẻ tấn công đổi role thành LAB_MANAGER trong payload và giữ chữ ký cũ. LabFlow trả …'],
      ['401 INVALID_TOKEN — the signature covers the header and the payload', '200 — the signature only covers the header, so the payload can change', '403 FORBIDDEN — the role exists but the route checks it again later', '401 TOKEN_EXPIRED — every changed token is treated as an expired one'],
      ['Changing one byte of header or payload invalidates the HMAC.', 'Đổi một byte của header hay payload là HMAC không còn khớp.']),
    q('c3', ['Lan guessed six wrong passwords in a row, then typed the right one. What did she get?', 'Cô Lan đoán sai sáu lần liên tiếp rồi gõ đúng mật khẩu. Cô nhận được gì?'],
      ['429 with Retry-After: 180 — the limit counts attempts, not only failures', '200 and a token — the right password always resets the counter', '401 INVALID_CREDENTIALS — the account is locked for good after five', '423 Locked — LabFlow locks the account until an admin unlocks it'],
      ['loginLimit is a token bucket per (IP, email): 5 per 900 s, one token every 180 s. The trade-off: the real Lan waits too.', 'loginLimit là xô token theo (IP, email): 5 lần mỗi 900 giây, cứ 180 giây có một token. Cái giá: cô Lan thật cũng phải đợi.']),
    q('c4', ['A wrong password and an unknown email both get 401 INVALID_CREDENTIALS with the same text. Why?', 'Sai mật khẩu và email không tồn tại đều nhận 401 INVALID_CREDENTIALS với cùng một câu. Vì sao?'],
      ['So nobody can find out which emails have an account (user enumeration)', 'Because LabFlow cannot tell these two cases apart internally at all', 'Because RFC 9110 requires one single error message for every 401', 'To save one query to the database on every login request'],
      ['LabFlow even compares against a dummy hash for unknown emails, so the timing matches too.', 'LabFlow còn so với một hash giả khi email không tồn tại, nên thời gian cũng giống nhau.']),
  ],
  goiY: [['Signed is not encrypted.', 'Có chữ ký không phải là được mã hoá.'], ['What does a token bucket count?', 'Xô token đếm cái gì?']],
  loi: [['Putting secrets into a JWT payload.', 'Để bí mật trong payload của JWT.'], ['Different messages for “no such user” and “wrong password”.', 'Thông báo khác nhau cho “không có người dùng” và “sai mật khẩu”.']],
  tns: [tn('JWT (JSON Web Token)', 'chuỗi token gồm header.payload.chữ ký'), tn('user enumeration', 'dò ra tài khoản nào tồn tại')],
  kn: ['authentication', 'JWT'],
});

function verdict(header, payload, signatureValid, nowSec) {
  if (!header || header.alg !== 'HS256' || !signatureValid) return 'INVALID_TOKEN';
  if (!payload || payload.iss !== 'labflow') return 'INVALID_TOKEN';
  if (!(typeof payload.exp === 'number' && payload.exp > nowSec)) return 'TOKEN_EXPIRED';
  return 'OK';
}
const H = { alg: 'HS256', typ: 'JWT' };
const P = { iss: 'labflow', sub: 'usr_1', role: 'STUDENT', iat: 1793480866, exp: 1793481766 };
const E2 = jsBai({
  ten: 'Authentication 2 — Write verdict(header, payload, signatureValid, nowSec): LabFlow’s token check', kho: 'MEDIUM', phut: 12,
  en: `<p>The decoded parts of a token arrive already parsed. Return, in this order of checks:</p><ul>
<li><code>'INVALID_TOKEN'</code> if <code>header.alg</code> is not exactly <code>'HS256'</code> (the SERVER decides the algorithm — <code>"none"</code> is refused) or the signature is not valid</li>
<li><code>'INVALID_TOKEN'</code> if <code>payload.iss</code> is not <code>'labflow'</code></li>
<li><code>'TOKEN_EXPIRED'</code> unless <code>payload.exp</code> is a number greater than <code>nowSec</code></li>
<li>otherwise <code>'OK'</code></li></ul>`,
  vi: `<p>Các phần của token đã được giải mã sẵn. Trả về, theo đúng thứ tự kiểm:</p><ul>
<li><code>'INVALID_TOKEN'</code> nếu <code>header.alg</code> không đúng là <code>'HS256'</code> (SERVER quyết định thuật toán — <code>"none"</code> bị từ chối) hoặc chữ ký không hợp lệ</li>
<li><code>'INVALID_TOKEN'</code> nếu <code>payload.iss</code> khác <code>'labflow'</code></li>
<li><code>'TOKEN_EXPIRED'</code> trừ khi <code>payload.exp</code> là số lớn hơn <code>nowSec</code></li>
<li>còn lại <code>'OK'</code></li></ul>`,
  dauVao: ['header, payload — objects; signatureValid — boolean; nowSec — seconds', 'header, payload — object; signatureValid — boolean; nowSec — giây'],
  dauRa: ['"OK" | "INVALID_TOKEN" | "TOKEN_EXPIRED"', '"OK" | "INVALID_TOKEN" | "TOKEN_EXPIRED"'],
  goiY: [['Check the algorithm before anything that the token claims about itself.', 'Kiểm thuật toán trước mọi thứ token tự khai về mình.'], ['A missing exp is not “never expires”.', 'Thiếu exp không có nghĩa là “không bao giờ hết hạn”.']],
  loi: [['Trusting header.alg to choose how to verify — alg none slips in.', 'Tin header.alg để chọn cách kiểm — alg none lọt qua.'], ['Using >= instead of > at the exact second of expiry.', 'Dùng >= thay vì > đúng giây hết hạn.']],
  gt: ['An’s token at iat + 60 is OK; 16 minutes later it is TOKEN_EXPIRED; the forged alg none token is INVALID_TOKEN — the three results of lesson 6.1.', 'Token của An lúc iat + 60 là OK; 16 phút sau là TOKEN_EXPIRED; token giả alg none là INVALID_TOKEN — ba kết quả của bài 6.1.'],
  kn: ['JWT', 'authentication'],
  tns: [tn('claim', 'một mục trong payload (sub, role, exp…)'), tn('expiry', 'thời điểm hết hạn')],
  dau: `/** LabFlow's token check, on already decoded parts */
function verdict(header, payload, signatureValid, nowSec) {
  // Write your solution here
  if (!signatureValid) return 'INVALID_TOKEN';
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(verdict),
  cases: [
    { goi: goi('verdict', H, P, true, 1793480926), moTa: ['An’s token one minute after login', 'Token của An một phút sau khi đăng nhập'] },
    { goi: goi('verdict', H, P, true, 1793481826), moTa: ['16 minutes later', '16 phút sau'] },
    { goi: goi('verdict', { alg: 'none', typ: 'JWT' }, { ...P, sub: 'usr_3', role: 'LAB_MANAGER' }, true, 1793480926), moTa: ['alg none (forge.mjs none)', 'alg none (forge.mjs none)'] },
    { goi: goi('verdict', H, { ...P, role: 'LAB_MANAGER' }, false, 1793480926), an: true, moTa: ['Role changed, old signature', 'Đổi role, giữ chữ ký cũ'] },
    { goi: goi('verdict', H, { ...P, iss: 'evil' }, true, 1793480926), an: true },
    { goi: goi('verdict', H, P, true, 1793481766), an: true, moTa: ['Exactly at exp', 'Đúng giây exp'] },
    { goi: goi('verdict', H, { iss: 'labflow', sub: 'usr_1' }, true, 1793480926), an: true, moTa: ['No exp claim', 'Không có exp'] },
    { goi: goi('verdict', { alg: 'hs256' }, P, true, 1793480926), an: true },
  ],
});

function loginStatuses(attempts, capacity, windowSec) {
  const perSec = capacity / windowSec;
  let tokens = capacity;
  let at = attempts.length ? attempts[0].t : 0;
  return attempts.map(({ t, correct }) => {
    tokens = Math.min(capacity, tokens + (t - at) * perSec);
    at = t;
    if (tokens < 1) return '429 wait ' + Math.ceil((1 - tokens) / perSec);
    tokens -= 1;
    return correct ? '200' : '401';
  });
}
const run = (list) => `loginStatuses(${JSON.stringify(list.map(([t, c]) => ({ t, correct: c })))}, 5, 900)`;
const E3 = jsBai({
  ten: 'Authentication 3 — Write loginStatuses(attempts, capacity, windowSec): the login limit', kho: 'MEDIUM', phut: 15,
  en: `<p>LabFlow limits logins per (IP, email) with a token bucket: <code>capacity</code> tokens, refilled at <code>capacity / windowSec</code> per second, starting full at the first attempt’s time. <code>attempts</code> is a list of <code>{ t, correct }</code> (seconds, ascending) for ONE key. For each attempt return a string:</p><ul>
<li>no whole token ⇒ <code>'429 wait N'</code> where N = seconds until one token, rounded up (no token is used)</li>
<li>otherwise use one token and return <code>'200'</code> if the password was correct, <code>'401'</code> if not</li></ul>
<p>Every attempt costs a token — right or wrong. That is why the right password after five wrong ones still gets 429.</p>`,
  vi: `<p>LabFlow giới hạn đăng nhập theo (IP, email) bằng xô token: <code>capacity</code> token, rót <code>capacity / windowSec</code> mỗi giây, đầy xô lúc lần thử đầu tiên. <code>attempts</code> là danh sách <code>{ t, correct }</code> (giây, tăng dần) của MỘT khoá. Với mỗi lần thử trả một chuỗi:</p><ul>
<li>không còn trọn một token ⇒ <code>'429 wait N'</code>, N = số giây tới khi có một token, làm tròn lên (không tốn token)</li>
<li>ngược lại dùng một token và trả <code>'200'</code> nếu mật khẩu đúng, <code>'401'</code> nếu sai</li></ul>
<p>Lần thử nào cũng tốn một token — đúng hay sai. Vì thế mật khẩu đúng sau năm lần sai vẫn nhận 429.</p>`,
  dauVao: ['attempts [{ t, correct }], capacity, windowSec', 'attempts [{ t, correct }], capacity, windowSec'],
  dauRa: ['array of "200" | "401" | "429 wait N"', 'mảng "200" | "401" | "429 wait N"'],
  goiY: [['5 per 900 s ⇒ one token every 180 s.', '5 lần mỗi 900 giây ⇒ cứ 180 giây một token.'], ['Refill before deciding, and move the clock even when refusing.', 'Rót trước khi quyết định, và dời mốc thời gian kể cả khi từ chối.']],
  loi: [['Counting only failed attempts — then a correct guess resets nothing and guessing continues.', 'Chỉ đếm lần sai — đoán trúng thì không ảnh hưởng và việc đoán vẫn tiếp tục.'], ['Spending a token on a refused attempt.', 'Trừ token cho cả lần bị từ chối.']],
  gt: ['Lesson 6.1: a1 … f6 wrong give 401 ×5 then 429; the right password right after gets 429 with Retry-After 180.', 'Bài 6.1: a1 … f6 sai cho 401 ×5 rồi 429; mật khẩu đúng ngay sau đó nhận 429 kèm Retry-After 180.'],
  kn: ['authentication', 'rate limiting'],
  tns: [tn('brute force', 'đoán mò hàng loạt'), tn('Retry-After', 'header: chờ bao lâu rồi thử lại')],
  dau: `/** one status per login attempt for one (IP, email) key */
function loginStatuses(attempts, capacity, windowSec) {
  // Write your solution here
  let fails = 0;
  return attempts.map((a) => (a.correct ? '200' : (++fails > capacity ? '429 wait ' + windowSec : '401')));
}
`,
  giai: '// Reference solution\n' + nguon(loginStatuses),
  cases: [
    { goi: run([[0, false], [1, false], [2, false], [3, false], [4, false], [5, false]]), moTa: ['Six wrong guesses (lesson 6.1)', 'Sáu lần đoán sai (bài 6.1)'] },
    { goi: run([[0, false], [0, false], [0, false], [0, false], [0, false], [0, true]]), moTa: ['The right password after five wrong ones', 'Mật khẩu đúng sau năm lần sai'] },
    { goi: run([[0, true], [100, true], [200, false], [300, true]]), an: true, moTa: ['Normal use', 'Dùng bình thường'] },
    { goi: run([[0, false], [0, false], [0, false], [0, false], [0, false], [180, true], [180, true]]), an: true, moTa: ['Three minutes later', 'Ba phút sau'] },
    { goi: run([[0, false], [0, false], [0, false], [0, false], [0, false], [90, true], [5000, true]]), an: true },
    { goi: 'loginStatuses([], 5, 900)', an: true },
  ],
});

export default doiDau({ slug: 'api-6-1-xac-thuc', ten: '6.1 Authentication options', khoa: KHOA, baiHoc: 'api-6-1-xac-thuc', de: [E1, E2, E3] });
