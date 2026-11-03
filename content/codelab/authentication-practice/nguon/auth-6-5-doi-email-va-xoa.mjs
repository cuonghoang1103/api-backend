/** Authentication · 6.5 — Đổi email & xoá: đọc output thật; viết emailChangeState/deleteSteps; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s06/_ma.mjs';

const CD = OUT['65-change-delete'].split('\n').slice(1);

const S1 = cs({
  ten: '6.5-1 — Change & delete: read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.6 (real run):${pre(CD)}`,
  vi: `LabFlow ID v0.6 (chạy thật):${pre(CD)}`,
  cau: [
    q('c1', ['After the email change, what is the new address’s state?', 'Sau khi đổi email, trạng thái địa chỉ mới là gì?'],
      ['Unverified — it clears the flag and sends a verify link', 'Verified, because the user was already logged in just now', 'Verified for login but still not usable for a reset', 'Deleted until the old address confirms the change first'],
      ['A changed email is a new claim; it must be proven again, and reset is gated on verification so a not-yet-owned address cannot receive one (6.5).', 'Một email đã đổi là một lời khai mới; nó phải được chứng minh lại, và reset bị chặn sau xác minh nên một địa chỉ chưa-sở-hữu không nhận được nó (6.5).']),
    q('c2', ['Deleting the account requires the password even in a live session. Why?', 'Xoá tài khoản đòi mật khẩu kể cả trong một phiên sống. Vì sao?'],
      ['A live session is not proof the human is still there', 'The database requires the password to run the DELETE', 'To rate-limit how often an account can be deleted', 'Because the login session has already expired by then'],
      ['Re-authentication stops a borrowed, unlocked device from erasing an account (6.5).', 'Xác thực lại chặn một thiết bị mượn, chưa khoá xoá một tài khoản (6.5).']),
    q('c3', ['After deletion, signing in with that email fails like an unknown address. Why?', 'Sau khi xoá, đăng nhập bằng email đó hỏng như một địa chỉ lạ. Vì sao?'],
      ['Soft-delete: status=deleted, and findByEmail filters status=active', 'The row was hard-deleted, so nothing matches', 'The email was renamed', 'The password hash was cleared'],
      ['setStatus(id,"deleted") plus findByEmail filtering active makes the account vanish from every flow while keeping the row for integrity (6.5).', 'setStatus(id,"deleted") cộng findByEmail lọc active làm tài khoản biến khỏi mọi luồng trong khi giữ dòng cho toàn vẹn (6.5).']),
  ],
  goiY: [['A new email is a new claim.', 'Một email mới là một lời khai mới.'], ['The row is kept, just flagged.', 'Dòng được giữ, chỉ bị đánh cờ.']],
  loi: [['Thinking a changed email stays verified.', 'Tưởng một email đã đổi vẫn xác minh.'], ['Thinking delete is a hard DELETE.', 'Tưởng xoá là một DELETE cứng.']],
  tns: [tn('re-authentication', 'xác thực lại'), tn('soft delete', 'xoá mềm')],
  kn: ['account lifecycle'],
});

function requiresReauth(action) {
  // Sensitive actions re-verify the password even inside a live session.
  return action === 'delete-account' || action === 'change-password' || action === 'change-email';
}
const S2 = jsBai({
  ten: '6.5-2 — Write requiresReauth(action): which actions re-verify the password', kho: 'MEDIUM', phut: 10,
  en: `<p>Return <code>true</code> if an action must re-authenticate with the password even inside a live session, else <code>false</code>. Sensitive actions — <code>'delete-account'</code>, <code>'change-password'</code>, <code>'change-email'</code> — require it (a borrowed, unlocked laptop must not do them). Ordinary ones like <code>'view-profile'</code> or <code>'list-devices'</code> do not.</p>`,
  vi: `<p>Trả <code>true</code> nếu một hành động phải xác thực lại bằng mật khẩu kể cả trong một phiên sống, còn không thì <code>false</code>. Hành động nhạy cảm — <code>'delete-account'</code>, <code>'change-password'</code>, <code>'change-email'</code> — đòi nó (một laptop mượn, chưa khoá không được làm chúng). Cái thường như <code>'view-profile'</code> hay <code>'list-devices'</code> thì không.</p>`,
  goiY: [['A live session is not proof the human is present.', 'Một phiên sống không phải bằng chứng con người có mặt.'], ['Deleting and changing credentials are sensitive; viewing is not.', 'Xoá và đổi thông tin xác thực là nhạy cảm; xem thì không.']],
  loi: [['Re-authing on a read-only view.', 'Xác thực lại trên một lần xem chỉ-đọc.'], ['Skipping re-auth on delete.', 'Bỏ xác thực lại khi xoá.']],
  gt: ['Re-authentication stops a borrowed, unlocked device from erasing an account or changing credentials (6.5).', 'Xác thực lại chặn một thiết bị mượn, chưa khoá xoá một tài khoản hay đổi thông tin xác thực (6.5).'],
  kn: ['account lifecycle'], tns: [tn('re-authentication', 'xác thực lại')],
  dau: `/** ⇒ true if the action must re-verify the password */
function requiresReauth(action) {
  // Write your solution here
  return false;
}
`,
  giai: '// Reference solution\n' + nguon(requiresReauth),
  cases: [
    { goi: goi('requiresReauth', 'delete-account'), moTa: ['Delete the account', 'Xoá tài khoản'] },
    { goi: goi('requiresReauth', 'change-email'), an: true, moTa: ['Change the email', 'Đổi email'] },
    { goi: goi('requiresReauth', 'view-profile'), an: true, moTa: ['View profile ⇒ no re-auth', 'Xem hồ sơ ⇒ không xác thực lại'] },
    { goi: goi('requiresReauth', 'list-devices'), an: true, moTa: ['List devices ⇒ no re-auth', 'Liệt kê thiết bị ⇒ không xác thực lại'] },
  ],
});

const S3 = cs({
  ten: '6.5-3 — Order the account-close flow', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the steps of deleting an account from a live session.',
  vi: 'Xếp các bước xoá một tài khoản từ một phiên sống.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Re-authenticate: verify the password, even in a live session',
    'Soft-delete: set status = deleted',
    'End every session and revoke every refresh family',
    'A later sign-in with that email fails like an unknown address',
  ], ['Re-auth first; flag the row deleted; revoke everything; the address then behaves as unknown because findByEmail filters active (6.5).', 'Xác thực lại trước; đánh cờ dòng đã xoá; thu hồi tất cả; địa chỉ sau đó hành xử như lạ vì findByEmail lọc active (6.5).'])],
  goiY: [['Prove the human first.', 'Chứng minh con người trước.'], ['Revocation before the "vanishes" effect.', 'Thu hồi trước hiệu ứng "biến mất".']],
  loi: [['Deleting before re-authenticating.', 'Xoá trước khi xác thực lại.'], ['Hard-deleting instead of soft-deleting.', 'Xoá cứng thay vì xoá mềm.']],
  tns: [tn('retention window', 'cửa sổ lưu giữ')],
  kn: ['account lifecycle'],
});

const S4 = cs({
  ten: '6.5-4 — Action → what it must also do', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each lifecycle action with the extra it must perform.',
  vi: 'Ghép mỗi hành động vòng đời với cái nó còn phải làm.',
  bang: [bang1('b1', ['Action → must also', 'Hành động → còn phải'], [{ ma: 'x', ten: 'Action' }, { ma: 'q', ten: 'Must also', luaChon: ['un-verify the new address + send a verify link', 're-authenticate with the password', 'soft-delete, keep the row for integrity', 'revoke every session + refresh family'] }], [
    { o: { x: 'change email' }, a: { q: 'un-verify the new address + send a verify link' } },
    { o: { x: 'delete: prove it is you' }, a: { q: 're-authenticate with the password' } },
    { o: { x: 'delete: remove the account' }, a: { q: 'soft-delete, keep the row for integrity' } },
    { o: { x: 'delete: no ghost sessions' }, a: { q: 'revoke every session + refresh family' } },
  ], ['A changed email is a new claim; deletion re-auths, soft-deletes and revokes everything so no token outlives the account (6.5).', 'Một email đã đổi là một lời khai mới; xoá xác thực lại, xoá-mềm và thu hồi tất cả để không token nào sống lâu hơn tài khoản (6.5).'])],
  goiY: [['One row is about the email; three are about delete.', 'Một dòng về email; ba về xoá.'], ['A changed email is unverified again (6.1).', 'Một email đã đổi lại chưa xác minh (6.1).']],
  loi: [['Thinking delete is a single DELETE statement.', 'Tưởng xoá là một câu DELETE.'], ['Thinking a changed email stays verified.', 'Tưởng một email đã đổi vẫn xác minh.']],
  kn: ['account lifecycle'],
});

export default doiDau({ slug: 'auth-6-5-doi-email-va-xoa', ten: '6.5 Change email & delete', khoa: KHOA, baiHoc: 'auth-6-5-doi-email-va-xoa', de: [S1, S2, S3, S4] });
