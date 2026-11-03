/** Authentication · 6.2 — Xác minh email: đọc output máy quét; viết verifyConsumes/tokenState; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s06/_ma.mjs';

const SC = OUT['62-scanner'].split('\n').slice(1);

const S1 = cs({
  ten: '6.2-1 — The scanner that clicks first', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.6 (real run):${pre(SC)}`,
  vi: `LabFlow ID v0.6 (chạy thật):${pre(SC)}`,
  cau: [
    q('c1', ['The GET /verify-email returns a form and the token is still unused. Why?', 'GET /verify-email trả một form và token vẫn chưa dùng. Vì sao?'],
      ['GET is safe — it only shows a confirm page; only the POST consumes', 'GET consumed it but the server restored it', 'The token was already expired', 'GET verified it silently without saying so'],
      ['A mail gateway GETs every link; a GET that consumes would burn the one-time token before the human clicks. GET shows, POST consumes (6.2).', 'Một cổng thư GET mọi link; một GET tiêu sẽ đốt token một lần trước khi con người bấm. GET hiện, POST tiêu (6.2).']),
    q('c2', ['The second POST of the same token returns USED. What property is that?', 'POST thứ hai của cùng token trả USED. Đó là tính chất gì?'],
      ['Single-use — a one-time token dies on first consume', 'Rate limiting on the verify endpoint', 'The token expired between the two POSTs', 'Purpose binding rejected the second one'],
      ['consumeToken marks the row used on first consume, so a replay returns USED — the single-use property (6.2).', 'consumeToken đánh dấu dòng đã dùng ở lần tiêu đầu, nên một lần phát lại trả USED — tính dùng-một-lần (6.2).']),
    q('c3', ['Why store the SHA-256 digest of the token, not the token itself?', 'Vì sao lưu digest SHA-256 của token, không lưu chính token?'],
      ['The row is a credential — a DB dump must not be a list of working links', 'SHA-256 is faster to index than the raw token', 'To fit the token in a fixed-width column', 'Because the token is too long to store'],
      ['Like a session id (1.3), the row is a credential; storing the digest means a leaked table is hashes, not working links. SHA-256 because the input is already high-entropy (6.2).', 'Như một session id (1.3), dòng này là tín vật; lưu digest nghĩa là một bảng bị lộ là các băm, không phải link chạy được. SHA-256 vì đầu vào đã entropy cao (6.2).']),
  ],
  goiY: [['Who clicks the link first, the human or a machine?', 'Ai bấm link trước, con người hay một cái máy?'], ['One consume, then dead.', 'Một lần tiêu, rồi chết.']],
  loi: [['Thinking a GET link is fine to consume.', 'Tưởng một đường dẫn GET tiêu được là ổn.'], ['Thinking Argon2 is needed for a random token.', 'Tưởng cần Argon2 cho một token ngẫu nhiên.']],
  tns: [tn('one-time token', 'token một lần'), tn('safe method', 'phương thức an toàn')],
  kn: ['account lifecycle'],
});

function verifyConsumes(method) {
  // Only the human's POST consumes; a scanner's GET is safe.
  return method === 'POST';
}
const S2 = jsBai({
  ten: '6.2-2 — Write verifyConsumes(method): which request burns the token', kho: 'EASY', phut: 8,
  en: `<p>Return <code>true</code> if an HTTP method should consume the one-time verification token, else <code>false</code>. Only <code>'POST'</code> consumes; <code>'GET'</code> (and <code>'HEAD'</code>, which a scanner also sends) must be safe and change nothing.</p>`,
  vi: `<p>Trả <code>true</code> nếu một phương thức HTTP nên tiêu token xác minh một lần, còn không thì <code>false</code>. Chỉ <code>'POST'</code> tiêu; <code>'GET'</code> (và <code>'HEAD'</code>, cái máy quét cũng gửi) phải an toàn và không đổi gì.</p>`,
  goiY: [['Safe methods (GET, HEAD) must not change state.', 'Phương thức an toàn (GET, HEAD) không được đổi trạng thái.'], ['Only one method here consumes: POST.', 'Chỉ một phương thức ở đây tiêu: POST.']],
  loi: [['Letting GET consume the token.', 'Cho GET tiêu token.'], ['Forgetting HEAD is also safe.', 'Quên HEAD cũng an toàn.']],
  gt: ['A mail security gateway GETs (and HEADs) every link; only a human POST must consume the token (6.2).', 'Một cổng bảo mật thư GET (và HEAD) mọi link; chỉ một POST của con người mới tiêu token (6.2).'],
  kn: ['account lifecycle'], tns: [tn('link prefetch', 'tải trước đường dẫn')],
  dau: `/** ⇒ true only for the method that should consume the token */
function verifyConsumes(method) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(verifyConsumes),
  cases: [
    { goi: goi('verifyConsumes', 'POST'), moTa: ['The human clicks', 'Con người bấm'] },
    { goi: goi('verifyConsumes', 'GET'), an: true, moTa: ['A scanner prefetch', 'Một máy quét prefetch'] },
    { goi: goi('verifyConsumes', 'HEAD'), an: true, moTa: ['A HEAD probe', 'Một cú dò HEAD'] },
  ],
});

function tokenState(rec, now) {
  if (!rec) return 'INVALID';
  if (rec.usedAt) return 'USED';
  if (now >= rec.expiresAt) return 'EXPIRED';
  return 'OK';
}
const S3 = jsBai({
  ten: '6.2-3 — Write tokenState(rec, now): the consume guard', kho: 'MEDIUM', phut: 12,
  en: `<p>Given a token row <code>rec</code> (or <code>null</code>) and the current time <code>now</code>, return its state <b>in this order</b>: no row ⇒ <code>'INVALID'</code>; <code>rec.usedAt</code> set ⇒ <code>'USED'</code>; <code>now &gt;= rec.expiresAt</code> ⇒ <code>'EXPIRED'</code>; otherwise <code>'OK'</code>. (Purpose is checked before this, so assume it matches.)</p>`,
  vi: `<p>Cho một dòng token <code>rec</code> (hoặc <code>null</code>) và thời gian hiện tại <code>now</code>, trả về trạng thái của nó <b>theo thứ tự này</b>: không có dòng ⇒ <code>'INVALID'</code>; <code>rec.usedAt</code> có ⇒ <code>'USED'</code>; <code>now &gt;= rec.expiresAt</code> ⇒ <code>'EXPIRED'</code>; còn lại <code>'OK'</code>. (Mục đích đã kiểm trước, nên coi như khớp.)</p>`,
  goiY: [['Check used before expired.', 'Kiểm đã-dùng trước hết-hạn.'], ['A missing row is INVALID, never a crash.', 'Một dòng thiếu là INVALID, không bao giờ sập.']],
  loi: [['Checking expiry before used.', 'Kiểm hết hạn trước đã-dùng.'], ['Throwing on a null row.', 'Ném lỗi trên một dòng null.']],
  gt: ['The order matters: a used token is USED even if also expired, and a missing one is INVALID — never a crash (6.2, 6.3).', 'Thứ tự quan trọng: một token đã dùng là USED kể cả khi cũng hết hạn, và một cái thiếu là INVALID — không bao giờ sập (6.2, 6.3).'],
  kn: ['account lifecycle'], tns: [tn('single-use', 'dùng một lần')],
  dau: `/** ⇒ 'INVALID' | 'USED' | 'EXPIRED' | 'OK' */
function tokenState(rec, now) {
  // Write your solution here
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(tokenState),
  cases: [
    { goi: goi('tokenState', { usedAt: null, expiresAt: 100 }, 50), moTa: ['Fresh token', 'Token mới'] },
    { goi: goi('tokenState', null, 50), an: true, moTa: ['No such token', 'Không có token'] },
    { goi: goi('tokenState', { usedAt: 40, expiresAt: 100 }, 50), an: true, moTa: ['Already used', 'Đã dùng'] },
    { goi: goi('tokenState', { usedAt: null, expiresAt: 40 }, 50), an: true, moTa: ['Expired', 'Hết hạn'] },
    { goi: goi('tokenState', { usedAt: 30, expiresAt: 40 }, 50), an: true, moTa: ['Used AND expired ⇒ USED', 'Đã dùng VÀ hết hạn ⇒ USED'] },
  ],
});

const S4 = cs({
  ten: '6.2-4 — GET vs POST on the verify route', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each request with what the verify route does.',
  vi: 'Ghép mỗi request với cái tuyến xác minh làm.',
  bang: [bang1('b1', ['Request → effect', 'Request → tác dụng'], [{ ma: 'x', ten: 'Request' }, { ma: 'q', ten: 'Effect', luaChon: ['shows a confirm page, consumes nothing', 'consumes the token, marks verified'] }], [
    { o: { x: 'scanner GET /verify-email?token=…' }, a: { q: 'shows a confirm page, consumes nothing' } },
    { o: { x: 'human POST /verify-email' }, a: { q: 'consumes the token, marks verified' } },
  ], ['The GET is safe (a scanner hits it); only the human POST consumes the one-time token (6.2).', 'GET an toàn (một máy quét gõ nó); chỉ POST của con người mới tiêu token một lần (6.2).'])],
  goiY: [['Safe method ⇒ no side effect.', 'Phương thức an toàn ⇒ không tác dụng phụ.'], ['Only the POST changes state.', 'Chỉ POST đổi trạng thái.']],
  loi: [['Letting the GET verify.', 'Cho GET xác minh.'], ['Thinking the scanner’s GET is harmful.', 'Tưởng cú GET của máy quét là có hại.']],
  kn: ['account lifecycle'],
});

export default doiDau({ slug: 'auth-6-2-xac-minh-email', ten: '6.2 Email verification', khoa: KHOA, baiHoc: 'auth-6-2-xac-minh-email', de: [S1, S2, S3, S4] });
