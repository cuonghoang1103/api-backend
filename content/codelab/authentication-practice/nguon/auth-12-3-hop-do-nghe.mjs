/** Authentication · 12.3 — The toolbox; write tokenState(payload, now) from a decoded JWT. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '12.3-1 — Answer it yourself', kho: 'EASY', phut: 8,
  en: 'A JWT is base64url JSON you can decode in two lines; the expiry answers most "why 401?" questions.',
  vi: 'Một JWT là JSON base64url bạn giải trong hai dòng; hạn trả lời phần lớn câu hỏi "vì sao 401?".',
  cau: [
    q('c1', ['You decode a token and its sub is "admin". Can you treat the request as an admin?', 'Bạn giải một token và sub của nó là "admin". Bạn coi request là admin được không?'],
      ['No — a decoded token is unverified; anyone can forge one. Only the verified signature authorizes', 'Yes, because the sub field is always set only by the real authorization server and nobody else', 'Yes, because successfully decoding the token already proves that it is genuine and trustworthy', 'Only if the token is also unexpired, in which case the decoded sub can be fully trusted'],
      ['Decoding only reads; authorize on the verified signature, decode only to diagnose (12.3, 4.1).', 'Giải mã chỉ đọc; phân quyền trên chữ ký đã xác minh, giải chỉ để chẩn đoán (12.3, 4.1).']),
    q('c2', ['Verification fails with "unknown kid". Which two documents do you compare?', 'Xác minh hỏng với "kid lạ". Bạn so hai tài liệu nào?'],
      ['The token\'s header (its kid) and the provider\'s /.well-known/jwks.json', 'The access token and the refresh token, comparing the kid claim that appears in each of them', 'The HTTP request body and the HTTP response body, looking for a mismatch between the two', 'The session cookie and the CORS policy, checking that the two are configured consistently'],
      ['A kid not present in JWKS is a botched rotation; compare the token kid against JWKS (12.3, 11.2).', 'Một kid không có trong JWKS là một lần xoay hỏng; so kid token với JWKS (12.3, 11.2).']),
    q('c3', ['How do you check whether a login leaks which accounts exist?', 'Bạn kiểm một đăng nhập có rò tài khoản nào tồn tại ra sao?'],
      ['Time a real vs a fake account — a consistent timing difference is an enumeration leak', 'Read the stored password hash directly from the database and compare it to the submitted value', 'Count the number of characters in the error message for a real versus a fake account login', 'Check the TLS certificate chain of the login endpoint for any misconfiguration or weak ciphers'],
      ['Timing a real vs fake login reveals an enumeration leak (12.3, 6.4).', 'Đo đăng nhập thật so với giả lộ một rò enumeration (12.3, 6.4).']),
  ],
  goiY: [['Decode to diagnose, verify to authorize.', 'Giải để chẩn đoán, xác minh để phân quyền.'], ['The expiry is the most common 401 cause.', 'Hạn là nguyên nhân 401 phổ biến nhất.']],
  loi: [['Trusting a decoded token\'s claims.', 'Tin claim của một token đã giải.'], ['Asking the backend instead of decoding.', 'Hỏi backend thay vì giải mã.']],
  tns: [tn('decode vs verify', 'giải vs xác minh')],
  kn: ['authentication'],
});

function tokenState(payload, nowSec) {
  // Read a decoded JWT payload and say its state relative to now (seconds). This is for DIAGNOSIS only.
  if (!payload) return 'malformed';
  if (payload.exp != null && nowSec >= payload.exp) return 'expired';     // the #1 cause of a 401
  if (payload.nbf != null && nowSec < payload.nbf) return 'not-yet-valid';
  return 'valid';
}
const S2 = jsBai({
  ten: '12.3-2 — Write tokenState(payload, nowSec): read the expiry', kho: 'EASY', phut: 10,
  en: `<p>From a decoded JWT <code>payload</code> and the current time <code>nowSec</code> (seconds), return the token's state: a missing payload ⇒ <code>'malformed'</code>; <code>exp</code> present and <code>nowSec >= exp</code> ⇒ <code>'expired'</code>; <code>nbf</code> present and <code>nowSec < nbf</code> ⇒ <code>'not-yet-valid'</code>; otherwise ⇒ <code>'valid'</code>. This is for diagnosis only — it does NOT verify the signature.</p>`,
  vi: `<p>Từ một <code>payload</code> JWT đã giải và thời gian hiện tại <code>nowSec</code> (giây), trả trạng thái token: payload thiếu ⇒ <code>'malformed'</code>; <code>exp</code> có và <code>nowSec >= exp</code> ⇒ <code>'expired'</code>; <code>nbf</code> có và <code>nowSec < nbf</code> ⇒ <code>'not-yet-valid'</code>; còn lại ⇒ <code>'valid'</code>. Đây chỉ để chẩn đoán — nó KHÔNG xác minh chữ ký.</p>`,
  goiY: [['Check exp against now, then nbf.', 'Kiểm exp với now, rồi nbf.'], ['A missing payload is malformed, not valid.', 'Một payload thiếu là malformed, không phải valid.']],
  loi: [['Calling an expired token valid.', 'Gọi một token hết hạn là valid.'], ['Treating this as verification (it is not).', 'Coi cái này là xác minh (nó không).']],
  gt: ['The expiry answers most "why 401?" questions by hand — but it is diagnosis, not authorization (12.3).', 'Hạn trả lời phần lớn câu hỏi "vì sao 401?" bằng tay — nhưng là chẩn đoán, không phải phân quyền (12.3).'],
  kn: ['authentication'], tns: [tn('exp/nbf', 'exp/nbf')],
  dau: `/** ⇒ 'malformed' | 'expired' | 'not-yet-valid' | 'valid' (diagnosis only) */
function tokenState(payload, nowSec) {
  // Write your solution here
  return 'valid';
}
`,
  giai: '// Reference solution\n' + nguon(tokenState),
  cases: [
    { goi: goi('tokenState', { exp: 1700000900 }, 1700000950), moTa: ['past exp ⇒ expired', 'qua exp ⇒ expired'] },
    { goi: goi('tokenState', { exp: 1700000900 }, 1700000800), an: true, moTa: ['before exp ⇒ valid', 'trước exp ⇒ valid'] },
    { goi: goi('tokenState', { nbf: 1700001000 }, 1700000900), an: true, moTa: ['before nbf ⇒ not-yet-valid', 'trước nbf ⇒ not-yet-valid'] },
    { goi: goi('tokenState', null, 1700000900), an: true, moTa: ['no payload ⇒ malformed', 'không payload ⇒ malformed'] },
  ],
});

const S3 = cs({
  ten: '12.3-3 — Tool → question it answers', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each toolbox technique to the question it answers.',
  vi: 'Ghép mỗi kỹ thuật hộp đồ nghề với câu hỏi nó trả lời.',
  bang: [bang1('b1', ['Tool → question', 'Công cụ → câu hỏi'], [{ ma: 'x', ten: 'Tool' }, { ma: 'q', ten: 'Answers', luaChon: ['why is it 401?', 'does it leak which accounts exist?', 'is the session cookie hardened?'] }], [
    { o: { x: 'decode the JWT, read exp' }, a: { q: 'why is it 401?' } },
    { o: { x: 'time real vs fake login' }, a: { q: 'does it leak which accounts exist?' } },
    { o: { x: 'read Set-Cookie flags' }, a: { q: 'is the session cookie hardened?' } },
  ], ['The expiry answers the 401; timing answers enumeration; the flags answer cookie hardening (12.3).', 'Hạn trả lời 401; thời gian trả lời enumeration; các cờ trả lời cookie cứng (12.3).'])],
  goiY: [['The expiry is the most common 401 cause.', 'Hạn là nguyên nhân 401 phổ biến nhất.'], ['Timing reveals enumeration.', 'Thời gian lộ enumeration.']],
  loi: [['Matching the cookie flags to the 401 question.', 'Ghép các cờ cookie với câu hỏi 401.'], ['Matching timing to cookie hardening.', 'Ghép thời gian với cookie cứng.']],
  tns: [tn('Set-Cookie', 'Set-Cookie')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-12-3-hop-do-nghe', ten: '12.3 The toolbox', khoa: KHOA, baiHoc: 'auth-12-3-hop-do-nghe', de: [S1, S2, S3] });
