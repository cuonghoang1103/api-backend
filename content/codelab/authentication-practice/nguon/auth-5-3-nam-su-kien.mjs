/** Authentication · 5.3 — Năm sự kiện: đọc output thật (bốn REVOKED, một EXPIRED); tự viết endSessionScope; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s05/_ma.mjs';

const FE = OUT['53-five-events'].split('\n').slice(1);

const S1 = cs({
  ten: '5.3-1 — Five events: read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.5 (real run):${pre(FE)}`,
  vi: `LabFlow ID v0.5 (chạy thật):${pre(FE)}`,
  cau: [
    q('c1', ['Four events end with REVOKED and one with EXPIRED. Why is expiry different?', 'Bốn sự kiện kết thúc bằng REVOKED và một bằng EXPIRED. Vì sao hết hạn khác?'],
      ['Expiry is passive — the family’s 30 days simply passed', 'Expiry is a bug; it really ought to return REVOKED like the others', 'Expiry revokes the family faster than the other four events do', 'Expiry only affects the access token, not the refresh token'],
      ['Four events actively revoke the family (REVOKED); expiry just lets the row’s expires_at pass, so EXPIRED is the right, different code (5.3).', 'Bốn sự kiện chủ động thu hồi họ (REVOKED); hết hạn chỉ để expires_at của dòng qua, nên EXPIRED là mã đúng, khác (5.3).']),
    q('c2', ['A password change ends the session. What is its scope?', 'Đổi mật khẩu kết thúc phiên. Phạm vi của nó là gì?'],
      ['All of the user’s families — no session may survive it', 'Only the one device on which the password was actually changed', 'Only the access token; the refresh families keep working', 'Nothing at all until the existing tokens expire on their own'],
      ['A credential change must revoke every family, or a stolen password leaves old sessions working; /me/password calls revokeAll (5.3).', 'Đổi thông tin xác thực phải thu hồi mọi họ, không thì một mật khẩu bị trộm để các phiên cũ chạy; /me/password gọi revokeAll (5.3).']),
    q('c3', ['After any of these events, can the already-issued access token still call the API?', 'Sau bất kỳ sự kiện nào, access token đã phát còn gọi API được không?'],
      ['Yes, until it expires (≤ 15 min) — it is stateless', 'No — revoking the refresh family blocks the access token too', 'Yes, forever — an access token like this one never expires', 'No — the API re-checks the refresh family on every request'],
      ['Ending the family stops NEW access tokens; the one already out there is verified by signature with no lookup, so it lingers ≤ 15 min (4.3, 5.3).', 'Kết thúc họ ngừng access token MỚI; cái đã ở ngoài kia được kiểm bằng chữ ký không tra, nên nó nán ≤ 15 phút (4.3, 5.3).']),
  ],
  goiY: [['Which event needs no action?', 'Sự kiện nào không cần hành động?'], ['A password change is user-wide.', 'Đổi mật khẩu là trên toàn người dùng.']],
  loi: [['Thinking logout blocks the access token instantly.', 'Tưởng đăng xuất chặn access token tức thì.'], ['Thinking a password change only affects one device.', 'Tưởng đổi mật khẩu chỉ ảnh hưởng một thiết bị.']],
  tns: [tn('server-side revocation', 'thu hồi phía máy chủ'), tn('absolute expiry', 'hết hạn tuyệt đối')],
  kn: ['session management'],
});

function endSessionScope(event) {
  if (event === 'sign-out') return 'one-family';
  if (event === 'sign-out-everywhere') return 'all-families';
  if (event === 'password-change') return 'all-families';
  if (event === 'reuse-detected') return 'one-family';
  if (event === 'device-revoke') return 'one-family';
  if (event === 'expiry') return 'none';
  return 'unknown';
}
const S2 = jsBai({
  ten: '5.3-2 — Write endSessionScope(event): what each event revokes', kho: 'EASY', phut: 10,
  en: `<p>Return the revocation scope for a session-ending event: <code>'sign-out'</code> ⇒ <code>'one-family'</code>; <code>'sign-out-everywhere'</code> and <code>'password-change'</code> ⇒ <code>'all-families'</code>; <code>'reuse-detected'</code> and <code>'device-revoke'</code> ⇒ <code>'one-family'</code>; <code>'expiry'</code> ⇒ <code>'none'</code> (passive — no action); anything else ⇒ <code>'unknown'</code>.</p>`,
  vi: `<p>Trả về phạm vi thu hồi cho một sự kiện kết thúc phiên: <code>'sign-out'</code> ⇒ <code>'one-family'</code>; <code>'sign-out-everywhere'</code> và <code>'password-change'</code> ⇒ <code>'all-families'</code>; <code>'reuse-detected'</code> và <code>'device-revoke'</code> ⇒ <code>'one-family'</code>; <code>'expiry'</code> ⇒ <code>'none'</code> (thụ động — không hành động); còn lại ⇒ <code>'unknown'</code>.</p>`,
  goiY: [['A credential change is user-wide.', 'Đổi thông tin xác thực là trên toàn người dùng.'], ['Expiry needs no revocation.', 'Hết hạn không cần thu hồi.']],
  loi: [['Making a password change “one-family”.', 'Cho đổi mật khẩu "một họ".'], ['Making expiry revoke something.', 'Cho hết hạn thu hồi cái gì đó.']],
  gt: ['A leaked password must end every session, so its scope is all families; a lost device or a detected theft ends one; expiry ends a family on its own, so it revokes nothing (5.3).', 'Một mật khẩu bị lộ phải kết thúc mọi phiên, nên phạm vi là mọi họ; một thiết bị mất hay một lần trộm bị phát hiện kết thúc một họ; hết hạn tự kết thúc một họ, nên nó không thu hồi gì (5.3).'],
  kn: ['session management'], tns: [tn('sign out everywhere', 'đăng xuất mọi nơi')],
  dau: `/** ⇒ 'one-family' | 'all-families' | 'none' | 'unknown' */
function endSessionScope(event) {
  // Write your solution here
  return 'one-family';
}
`,
  giai: '// Reference solution\n' + nguon(endSessionScope),
  cases: [
    { goi: goi('endSessionScope', 'sign-out'), moTa: ['Sign out this device', 'Đăng xuất thiết bị này'] },
    { goi: goi('endSessionScope', 'password-change'), an: true, moTa: ['Password change', 'Đổi mật khẩu'] },
    { goi: goi('endSessionScope', 'reuse-detected'), an: true, moTa: ['Theft detected', 'Phát hiện trộm'] },
    { goi: goi('endSessionScope', 'expiry'), an: true, moTa: ['Absolute expiry', 'Hết hạn tuyệt đối'] },
    { goi: goi('endSessionScope', 'account-deleted'), an: true, moTa: ['Unknown event', 'Sự kiện lạ'] },
  ],
});

const S3 = cs({
  ten: '5.3-3 — Order the five events by scope', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order these session-ending events from the WIDEST scope to the narrowest (all users’ families → one family → no action).',
  vi: 'Xếp các sự kiện kết thúc phiên từ phạm vi RỘNG nhất tới hẹp nhất (mọi họ của người dùng → một họ → không hành động).',
  cau: [ord('o1', ['Widest → narrowest', 'Rộng → hẹp'], [
    'Password change — revoke all of the user’s families',
    'Sign out this device — revoke one family',
    'Device-page revoke — revoke one chosen family',
    'Expiry — no action, the 30 days simply pass',
  ], ['A credential change is the widest (all families); sign-out and a device revoke each end one; expiry ends a family by itself, needing no action (5.3).', 'Đổi thông tin xác thực rộng nhất (mọi họ); đăng xuất và thu hồi thiết bị mỗi cái kết thúc một; hết hạn tự kết thúc một họ, không cần hành động (5.3).'])],
  goiY: [['A password change is user-wide.', 'Đổi mật khẩu là trên toàn người dùng.'], ['Expiry needs no server action.', 'Hết hạn không cần hành động máy chủ.']],
  loi: [['Putting expiry first.', 'Đặt hết hạn đầu tiên.'], ['Thinking sign-out is user-wide.', 'Tưởng đăng xuất là trên toàn người dùng.']],
  tns: [tn('family scope', 'phạm vi họ')],
  kn: ['session management'],
});

const CODE = ['REVOKED', 'REVOKED', 'REVOKED', 'EXPIRED', 'REVOKED'];
const S4 = cs({
  ten: '5.3-4 — Event → next-refresh code', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each event with what the next refresh returns.',
  vi: 'Ghép mỗi sự kiện với cái lần refresh kế trả về.',
  bang: [bang1('b1', ['Event → code', 'Sự kiện → mã'], [{ ma: 'x', ten: 'Event' }, { ma: 'q', ten: 'Next refresh', luaChon: CODE }], [
    { o: { x: 'sign out (this device)' }, a: { q: 'REVOKED' } },
    { o: { x: 'password change' }, a: { q: 'REVOKED' } },
    { o: { x: 'theft detected (reuse)' }, a: { q: 'REVOKED' } },
    { o: { x: 'absolute expiry (30 days)' }, a: { q: 'EXPIRED' } },
    { o: { x: 'devices-page revoke' }, a: { q: 'REVOKED' } },
  ], ['Four events revoke the family (REVOKED); only expiry is passive and returns EXPIRED (5.3).', 'Bốn sự kiện thu hồi họ (REVOKED); chỉ hết hạn là thụ động và trả EXPIRED (5.3).'])],
  goiY: [['Only one event is passive.', 'Chỉ một sự kiện là thụ động.'], ['Revocation ⇒ REVOKED; a timeout ⇒ EXPIRED.', 'Thu hồi ⇒ REVOKED; một mốc hết hạn ⇒ EXPIRED.']],
  loi: [['Thinking expiry says REVOKED.', 'Tưởng hết hạn nói REVOKED.'], ['Thinking sign-out says EXPIRED.', 'Tưởng đăng xuất nói EXPIRED.']],
  kn: ['session management'],
});

export default doiDau({ slug: 'auth-5-3-nam-su-kien', ten: '5.3 Five events', khoa: KHOA, baiHoc: 'auth-5-3-nam-su-kien', de: [S1, S2, S3, S4] });
