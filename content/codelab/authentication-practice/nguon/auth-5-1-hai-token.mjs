/** Authentication · 5.1 — Hai token: đọc output thật (access JWT vs refresh opaque); tự viết tokenPlan; sắp luồng + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s05/_ma.mjs';

const TT = OUT['51-two-tokens'].split('\n').slice(1);
const SI = OUT['51-sign-in'].split('\n').slice(1);

const S1 = cs({
  ten: '5.1-1 — Two tokens: read the real runs', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.5 (real runs):${pre(TT)}${pre(SI)}`,
  vi: `LabFlow ID v0.5 (chạy thật):${pre(TT)}${pre(SI)}`,
  cau: [
    q('c1', ['Why is the access token short (15 min) and the refresh token long (30 days)?', 'Vì sao access token ngắn (15 phút) và refresh token dài (30 ngày)?'],
      ['A stolen access token cannot be revoked, so short caps the damage', 'The access token is larger, so it has to expire sooner than a refresh token', 'The refresh token is a JWT, so naturally it lives much longer', 'Both lifetimes are arbitrary and could just as well be swapped around'],
      ['The access token is stateless and un-revocable, so 15 minutes limits a stolen one; the refresh token is a revocable row, so it can be long without that risk (5.1).', 'Access token không trạng thái và không thu hồi được, nên 15 phút giới hạn một cái bị trộm; refresh token là một dòng thu hồi được, nên nó dài mà không rủi ro đó (5.1).']),
    q('c2', ['How is the refresh token stored on the server?', 'Refresh token được lưu phía máy chủ thế nào?'],
      ['Only as its SHA-256 digest, never the token itself', 'As plaintext in a column, so it can be re-sent to the client', 'As a signed JWT carrying the user’s claims and role', 'Inside the access token’s payload, next to the claims'],
      ['Like a session id, the refresh token is random, so the database keeps only its digest; a leaked table is a list of digests, not working tokens (5.1).', 'Như một id phiên, refresh token là ngẫu nhiên, nên cơ sở dữ liệu chỉ giữ digest của nó; một bảng bị lộ là danh sách digest, không phải token dùng được (5.1).']),
    q('c3', ['After /refresh, the refresh cookie value changed. Why must it change?', 'Sau /refresh, giá trị cookie refresh đổi. Vì sao nó phải đổi?'],
      ['Rotation — the old token is retired and a new one issued', 'The browser clears and rewrites cookies on every POST request', 'The access token replaced the refresh token in the same cookie', 'The server rotates its JWT signing key on each refresh'],
      ['Every /refresh rotates the refresh token: the old one is spent (and rejected if reused), a new one is set (5.2).', 'Mỗi /refresh xoay refresh token: cái cũ bị tiêu (và bị từ chối nếu tái dùng), một cái mới được đặt (5.2).']),
  ],
  goiY: [['Which token can be revoked?', 'Token nào thu hồi được?'], ['The refresh token is random — store its digest.', 'Refresh token là ngẫu nhiên — lưu digest của nó.']],
  loi: [['“Make the access token last 30 days for convenience.”', '"Cho access token sống 30 ngày cho tiện."'], ['Storing the refresh token in the clear.', 'Lưu refresh token dạng thô.']],
  tns: [tn('access token'), tn('refresh token')],
  kn: ['refresh token'],
});

function tokenPlan(kind) {
  if (kind === 'access') return { store: 'memory', lifetimeSec: 900, revocable: false, sentOn: 'every-request' };
  if (kind === 'refresh') return { store: 'httponly-cookie', lifetimeSec: 2592000, revocable: true, sentOn: 'refresh-only' };
  return { store: 'unknown', lifetimeSec: 0, revocable: false, sentOn: 'never' };
}
const S2 = jsBai({
  ten: '5.1-2 — Write tokenPlan(kind): the plan for each token', kho: 'EASY', phut: 10,
  en: `<p>Return the storage plan for a token. <code>'access'</code> ⇒ <code>{ store: 'memory', lifetimeSec: 900, revocable: false, sentOn: 'every-request' }</code>; <code>'refresh'</code> ⇒ <code>{ store: 'httponly-cookie', lifetimeSec: 2592000, revocable: true, sentOn: 'refresh-only' }</code> (30 days = 2,592,000 s); anything else ⇒ <code>{ store: 'unknown', lifetimeSec: 0, revocable: false, sentOn: 'never' }</code>.</p>`,
  vi: `<p>Trả về kế hoạch cất một token. <code>'access'</code> ⇒ <code>{ store: 'memory', lifetimeSec: 900, revocable: false, sentOn: 'every-request' }</code>; <code>'refresh'</code> ⇒ <code>{ store: 'httponly-cookie', lifetimeSec: 2592000, revocable: true, sentOn: 'refresh-only' }</code> (30 ngày = 2.592.000 s); còn lại ⇒ <code>{ store: 'unknown', lifetimeSec: 0, revocable: false, sentOn: 'never' }</code>.</p>`,
  goiY: [['Access is short, in memory, not revocable.', 'Access thì ngắn, trong bộ nhớ, không thu hồi được.'], ['Refresh is long, in an HttpOnly cookie, revocable.', 'Refresh thì dài, trong cookie HttpOnly, thu hồi được.']],
  loi: [['Putting the refresh token in memory or localStorage.', 'Đặt refresh token trong bộ nhớ hay localStorage.'], ['Marking the access token revocable.', 'Đánh dấu access token thu hồi được.']],
  gt: ['Each token’s plan follows its job: the access token is cheap and short so it rides everywhere in memory; the refresh token is long and revocable so it hides in an HttpOnly cookie, used only at /refresh (5.1).', 'Kế hoạch mỗi token theo việc của nó: access token rẻ và ngắn nên đi khắp nơi trong bộ nhớ; refresh token dài và thu hồi được nên nấp trong một cookie HttpOnly, chỉ dùng ở /refresh (5.1).'],
  kn: ['refresh token'], tns: [tn('access token'), tn('refresh token')],
  dau: `/** ⇒ { store, lifetimeSec, revocable, sentOn } */
function tokenPlan(kind) {
  // Write your solution here
  return { store: 'memory', lifetimeSec: 900, revocable: false, sentOn: 'every-request' };
}
`,
  giai: '// Reference solution\n' + nguon(tokenPlan),
  cases: [
    { goi: goi('tokenPlan', 'access'), moTa: ['Access token', 'Access token'] },
    { goi: goi('tokenPlan', 'refresh'), an: true, moTa: ['Refresh token', 'Refresh token'] },
    { goi: goi('tokenPlan', 'id_token'), an: true, moTa: ['Unknown kind', 'Loại lạ'] },
  ],
});

const S3 = cs({
  ten: '5.1-3 — The sign-in and refresh flow', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Put the two-token flow in order.',
  vi: 'Xếp luồng hai token theo thứ tự.',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Sign in: the server verifies the password (Chapter 2)',
    'It returns a 15-minute access token in the body and sets a refresh cookie',
    'The client sends the access token on every request until it expires',
    'On a 401, the client POSTs /refresh with the cookie',
    'The server rotates the refresh token and returns a new access token',
  ], ['The access token does the everyday work; only when it expires does the refresh token come out, once, to buy a new one — then it rotates (5.1, 5.2).', 'Access token làm việc hằng ngày; chỉ khi nó hết hạn refresh token mới xuất hiện, một lần, để mua một cái mới — rồi nó xoay (5.1, 5.2).'])],
  goiY: [['The refresh token is used only when the access token expires.', 'Refresh token chỉ dùng khi access token hết hạn.'], ['Rotation happens on /refresh.', 'Xoay vòng xảy ra ở /refresh.']],
  loi: [['Sending the refresh token on every request.', 'Gửi refresh token ở mọi request.'], ['Refreshing before the access token expires.', 'Refresh trước khi access token hết hạn.']],
  tns: [tn('rotation', 'xoay vòng')],
  kn: ['refresh token'],
});

const PROP = ['a JWT, 15 min, stateless, not revocable', 'an opaque secret, 30 days, a row, revocable'];
const S4 = cs({
  ten: '5.1-4 — Access vs refresh', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each token with its properties.',
  vi: 'Ghép mỗi token với các tính chất của nó.',
  bang: [bang1('b1', ['Token → properties', 'Token → tính chất'], [{ ma: 'x', ten: 'Token' }, { ma: 'q', ten: 'Properties', luaChon: PROP }], [
    { o: { x: 'access token' }, a: { q: 'a JWT, 15 min, stateless, not revocable' } },
    { o: { x: 'refresh token' }, a: { q: 'an opaque secret, 30 days, a row, revocable' } },
  ], ['The access token is verified by signature with no lookup (so it cannot be revoked); the refresh token is a row, so it can be revoked and rotated (5.1).', 'Access token xác minh bằng chữ ký không tra (nên không thu hồi được); refresh token là một dòng, nên thu hồi và xoay được (5.1).'])],
  goiY: [['One is stateless, one is a row.', 'Một cái không trạng thái, một cái là một dòng.'], ['Revocable means “a row you can flag”.', 'Thu hồi được nghĩa là "một dòng bạn đánh dấu được".']],
  loi: [['Thinking a JWT can be revoked.', 'Tưởng một JWT thu hồi được.'], ['Thinking the refresh token is a JWT.', 'Tưởng refresh token là một JWT.']],
  kn: ['refresh token'],
});

export default doiDau({ slug: 'auth-5-1-hai-token', ten: '5.1 Two tokens', khoa: KHOA, baiHoc: 'auth-5-1-hai-token', de: [S1, S2, S3, S4] });
