/** Authentication · 8.5 — Làm client thật: đọc output; viết canUnlink; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s08/_ma.mjs';
const OF = OUT['81-oidc-flow'].split('\n').slice(1);
const S1 = cs({
  ten: '8.5-1 — Linking, read the verified result', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.8 (real run):${pre(OF.slice(5, 9))}`,
  vi: `LabFlow ID v0.8 (chạy thật):${pre(OF.slice(5, 9))}`,
  cau: [
    q('c1', ['What identifier should a client link a federated account on?', 'Một client nên nối một tài khoản liên kết theo định danh nào?'],
      ['The provider’s stable sub, not the email', 'The email address returned in the ID token claims', 'The user’s display name as shown by the provider', 'The opaque access token issued alongside the ID token'],
      ['sub is stable and provider-local; email can be unverified or change — linking on it is a takeover (8.5).', 'sub ổn định và cục-bộ-theo-provider; email có thể chưa xác minh hoặc đổi — nối theo nó là một cú chiếm (8.5).']),
    q('c2', ['A user’s only way in is "Sign in with X" and X has an outage. What was the design mistake?', 'Đường vào duy nhất của một người là "Đăng nhập bằng X" và X có sự cố. Lỗi thiết kế là gì?'],
      ['Single-homed identity — keep a local credential or a second provider', 'Failing to cache the ID token for reuse across requests', 'Using PKCE on the authorization code flow at all', 'Requesting too few OAuth scopes at the consent screen'],
      ['Identity must not be single-homed; one provider’s outage should not lock a user out of your product (8.5).', 'Danh tính không được một-nhà; sự cố của một provider không nên khoá một người khỏi sản phẩm của bạn (8.5).']),
    q('c3', ['After the ID token verifies, what should the client do next?', 'Sau khi ID token xác minh, client nên làm gì kế?'],
      ['Start its OWN session (Chapter 3); the ID token is a one-time statement, not a session', 'Store the raw ID token and send it back as the session cookie', 'Call the provider to re-check the user on every single request', 'Re-run the entire OAuth authorization flow on every page load'],
      ['The federated login is a moment; verify once, then run your own session — do not hammer the provider or store the token as a session (8.5).', 'Đăng nhập liên kết là một khoảnh khắc; xác minh một lần, rồi chạy phiên của mình — đừng dội provider hay lưu token làm phiên (8.5).']),
  ],
  goiY: [['sub is the stable join key.', 'sub là khoá nối ổn định.'], ['The ID token is not a session.', 'ID token không phải một phiên.']],
  loi: [['Linking on email.', 'Nối theo email.'], ['Storing the ID token as the session.', 'Lưu ID token làm phiên.']],
  tns: [tn('account linking', 'nối tài khoản'), tn('single-homed identity', 'danh tính một-nhà')],
  kn: ['authentication'],
});
function canUnlink(methods) {
  // Refuse to remove the LAST way in: after unlinking, at least one login method must remain.
  return Array.isArray(methods) && methods.length >= 2;
}
const S2 = jsBai({
  ten: '8.5-2 — Write canUnlink(methods): never remove the last way in', kho: 'EASY', phut: 8,
  en: `<p>Given the login methods currently on an account (an array like <code>['password', 'labflow', 'google']</code>), return <code>true</code> if the user may unlink one — i.e. at least two remain, so unlinking leaves one. With one method (or none), return <code>false</code>: unlinking the only way in is a self-inflicted lockout.</p>`,
  vi: `<p>Cho các cách đăng nhập hiện có trên một tài khoản (một mảng như <code>['password', 'labflow', 'google']</code>), trả <code>true</code> nếu người dùng được gỡ một — tức còn ít nhất hai, nên gỡ vẫn còn một. Với một cách (hoặc không), trả <code>false</code>: gỡ đường vào duy nhất là tự khoá mình.</p>`,
  goiY: [['Count the methods; need ≥ 2 to allow an unlink.', 'Đếm các cách; cần ≥ 2 để cho gỡ.'], ['One method left means refuse.', 'Còn một cách nghĩa là từ chối.']],
  loi: [['Allowing an unlink down to zero methods.', 'Cho gỡ xuống còn không cách nào.'], ['Not handling a non-array input.', 'Không xử lý đầu vào không phải mảng.']],
  gt: ['Unlinking the last method locks the user out; require another way in (a local password or a second provider) to exist first (8.5).', 'Gỡ cách cuối khoá người dùng ra ngoài; đòi một đường vào khác (mật khẩu nội bộ hoặc provider thứ hai) tồn tại trước (8.5).'],
  kn: ['authentication'], tns: [tn('unlink guard', 'chốt gỡ nối')],
  dau: `/** ⇒ true only if unlinking still leaves a way in */
function canUnlink(methods) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(canUnlink),
  cases: [
    { goi: goi('canUnlink', ['password', 'labflow']), moTa: ['two methods ⇒ ok', 'hai cách ⇒ ok'] },
    { goi: goi('canUnlink', ['labflow']), an: true, moTa: ['last one ⇒ refuse', 'cái cuối ⇒ từ chối'] },
    { goi: goi('canUnlink', []), an: true, moTa: ['none ⇒ refuse', 'không ⇒ từ chối'] },
  ],
});
const S3 = cs({
  ten: '8.5-3 — Order a safe passwordless-ish migration', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the steps to add "Sign in with LabFlow" without locking anyone out.',
  vi: 'Xếp các bước thêm "Đăng nhập bằng LabFlow" mà không khoá ai ra ngoài.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Verify the ID token (seven checks) and read the stable sub',
    'Link the sub to the local account (keeping the local credential)',
    'Start your own Chapter-3 session',
    'On unlink later, refuse to remove the last remaining method',
  ], ['Verify → link on sub → your own session → guard the last method on unlink (8.5).', 'Xác minh → nối theo sub → phiên của mình → chốt cách cuối khi gỡ (8.5).'])],
  goiY: [['Verify before you link.', 'Xác minh trước khi nối.'], ['Your session comes after verification.', 'Phiên của bạn tới sau xác minh.']],
  loi: [['Linking before verifying.', 'Nối trước khi xác minh.'], ['Dropping the local credential at link time.', 'Bỏ tín vật nội bộ lúc nối.']],
  tns: [tn('sub claim', 'claim sub')],
  kn: ['authentication'],
});
const S4 = cs({
  ten: '8.5-4 — Client decision → rule', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each client decision with the rule that governs it.',
  vi: 'Ghép mỗi quyết định của client với luật chi phối nó.',
  bang: [bang1('b1', ['Decision → rule', 'Quyết định → luật'], [{ ma: 'x', ten: 'Decision' }, { ma: 'q', ten: 'Rule', luaChon: ['link on the stable sub', 'keep a non-provider way in', 'start your own session', 'request the narrowest scopes'] }], [
    { o: { x: 'which id to join accounts on' }, a: { q: 'link on the stable sub' } },
    { o: { x: 'what if the provider is down' }, a: { q: 'keep a non-provider way in' } },
    { o: { x: 'what after the ID token verifies' }, a: { q: 'start your own session' } },
    { o: { x: 'which scopes to ask for' }, a: { q: 'request the narrowest scopes' } },
  ], ['Join on sub, never single-home identity, run your own session, and ask for only what you need (8.5).', 'Nối theo sub, không bao giờ một-nhà danh tính, chạy phiên của mình, và chỉ xin cái bạn cần (8.5).'])],
  goiY: [['The sub is the join key; the session is yours after verifying.', 'sub là khoá nối; phiên là của bạn sau xác minh.'], ['Never single-home identity; ask only for what you need.', 'Không bao giờ một-nhà danh tính; chỉ xin cái cần.']],
  loi: [['Joining on email.', 'Nối theo email.'], ['Treating the ID token as the session.', 'Coi ID token là phiên.']],
  kn: ['authentication'],
});
export default doiDau({ slug: 'auth-8-5-lam-client-that', ten: '8.5 Being a client', khoa: KHOA, baiHoc: 'auth-8-5-lam-client-that', de: [S1, S2, S3, S4] });
