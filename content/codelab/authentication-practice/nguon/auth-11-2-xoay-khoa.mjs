/** Authentication · 11.2 — Key rotation with an overlap; write canVerify over the keyring. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '11.2-1 — Rotate with an overlap', kho: 'EASY', phut: 8,
  en: 'Rotate a signing key without logging everyone out: both keys live for a window, the new one signs, the old one still verifies.',
  vi: 'Xoay một khoá ký mà không đá mọi người ra: cả hai khoá sống trong một cửa sổ, cái mới ký, cái cũ vẫn xác minh.',
  cau: [
    q('c1', ['You swap the signing key and restart. What breaks?', 'Bạn tráo khoá ký và khởi động lại. Cái gì hỏng?'],
      ['Every token signed with the old key is instantly invalid, logging out every user; use an overlap instead', 'Nothing at all breaks — restarting the service is the standard, correct way to rotate a signing key', 'Only the tokens that were issued in the last minute or so become invalid; everything older keeps working', 'The JWKS discovery endpoint stops responding, so clients can no longer fetch any verification keys'],
      ['A hard swap invalidates all old-key tokens at once; keep both keys live during an overlap (11.2).', 'Một cú tráo cứng vô hiệu mọi token khoá cũ cùng lúc; giữ cả hai khoá sống trong một cửa sổ (11.2).']),
    q('c2', ['Why publish the new key in JWKS (introduce) before signing with it (activate)?', 'Vì sao công bố khoá mới trong JWKS (introduce) trước khi ký bằng nó (activate)?'],
      ['So JWKS clients fetch the new key before they see a token signed with it — otherwise they reject an unknown kid', 'To make the JWKS document smaller and faster to download', 'So the old key can be deleted a little sooner than usual', 'Because activate cannot technically run until introduce finishes'],
      ['A verifier without the new key rejects a token carrying its kid; introduce first gives it time (11.2).', 'Một bộ xác minh thiếu khoá mới từ chối một token mang kid của nó; giới thiệu trước cho nó thời gian (11.2).']),
    q('c3', ['How long must the overlap last before you may retire the old key?', 'Cửa sổ phải kéo dài bao lâu trước khi bạn được cho khoá cũ nghỉ?'],
      ['At least the maximum lifetime of a token the old key signed — 15 minutes for 15-minute access tokens', 'Exactly one minute, regardless of the token lifetime', 'As short as possible, to reduce the attack surface immediately', 'Until the next scheduled deploy, whenever that happens'],
      ['Retire sooner and you invalidate still-valid old tokens; the overlap ≥ the token lifetime (11.2).', 'Nghỉ sớm hơn và bạn vô hiệu token cũ còn hợp lệ; cửa sổ ≥ vòng đời token (11.2).']),
  ],
  goiY: [['kid in the header selects which key verifies a token.', 'kid trong header chọn khoá nào xác minh một token.'], ['Retire the old key only after its tokens expire.', 'Cho khoá cũ nghỉ chỉ sau khi token của nó hết hạn.']],
  loi: [['Rotating by a hard swap and restart.', 'Xoay bằng một cú tráo cứng và khởi động lại.'], ['Retiring the old key before its tokens expire.', 'Cho khoá cũ nghỉ trước khi token của nó hết hạn.']],
  tns: [tn('overlap window', 'cửa sổ chồng lấn'), tn('kid', 'kid')],
  kn: ['authentication'],
});

function canVerify(ring, kid) {
  // A token with this kid can still be verified if the kid is in the ring's list of live keys.
  return Boolean(ring && Array.isArray(ring.live) && ring.live.includes(kid));
}
const S2 = jsBai({
  ten: '11.2-2 — Write canVerify(ring, kid): is this key still live?', kho: 'EASY', phut: 8,
  en: `<p>A keyring is <code>{ active, live }</code>: <code>active</code> is the kid that signs, <code>live</code> is the array of kids that may still verify. Return <code>true</code> if a token whose header <code>kid</code> is given can still be verified — that is, if <code>kid</code> is in <code>ring.live</code>. A missing ring or a non-array <code>live</code> ⇒ <code>false</code>.</p>`,
  vi: `<p>Một keyring là <code>{ active, live }</code>: <code>active</code> là kid ký, <code>live</code> là mảng kid còn xác minh được. Trả <code>true</code> nếu một token có header <code>kid</code> cho trước còn xác minh được — tức là nếu <code>kid</code> trong <code>ring.live</code>. Một ring thiếu hoặc <code>live</code> không phải mảng ⇒ <code>false</code>.</p>`,
  goiY: [['Array.prototype.includes answers the membership question.', 'Array.prototype.includes trả lời câu hỏi thành viên.'], ['Guard against a missing ring before reading .live.', 'Chặn một ring thiếu trước khi đọc .live.']],
  loi: [['Checking ring.active instead of ring.live.', 'Kiểm ring.active thay vì ring.live.'], ['Crashing when ring is null.', 'Sập khi ring là null.']],
  gt: ['During an overlap both the old and new kid are in ring.live, so tokens from both verify side by side (11.2).', 'Trong một cửa sổ cả kid cũ và mới đều trong ring.live, nên token từ cả hai xác minh song song (11.2).'],
  kn: ['authentication'], tns: [tn('keyring', 'keyring')],
  dau: `/** ⇒ true if a token with this kid can still be verified */
function canVerify(ring, kid) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(canVerify),
  cases: [
    { goi: goi('canVerify', { active: 'k2', live: ['k1', 'k2'] }, 'k1'), moTa: ['old key live in overlap ⇒ true', 'khoá cũ sống trong cửa sổ ⇒ true'] },
    { goi: goi('canVerify', { active: 'k2', live: ['k2'] }, 'k1'), an: true, moTa: ['old key retired ⇒ false', 'khoá cũ đã nghỉ ⇒ false'] },
    { goi: goi('canVerify', { active: 'k2', live: ['k1', 'k2'] }, 'k2'), moTa: ['new key ⇒ true', 'khoá mới ⇒ true'] },
    { goi: goi('canVerify', null, 'k1'), an: true, moTa: ['no ring ⇒ false', 'không ring ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '11.2-3 — Order the three rotation phases', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the three phases of a signing-key rotation.',
  vi: 'Xếp ba pha của một lần xoay khoá ký.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Introduce — add the new key to JWKS, but keep signing with the old one',
    'Activate — switch signing to the new key; the old key stays live for verify',
    'Retire — drop the old key, after its tokens have expired',
  ], ['Introduce (clients learn the key), activate (sign new), retire (after old tokens expire) (11.2).', 'Introduce (client học khoá), activate (ký mới), retire (sau khi token cũ hết hạn) (11.2).'])],
  goiY: [['Clients must learn the key before it signs anything.', 'Client phải học khoá trước khi nó ký gì.'], ['Retire comes only after the old tokens expire.', 'Retire đến chỉ sau khi token cũ hết hạn.']],
  loi: [['Activating before introducing.', 'Activate trước introduce.'], ['Retiring the old key immediately.', 'Cho khoá cũ nghỉ ngay.']],
  tns: [tn('introduce/activate/retire', 'introduce/activate/retire')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-11-2-xoay-khoa', ten: '11.2 Key rotation', khoa: KHOA, baiHoc: 'auth-11-2-xoay-khoa', de: [S1, S2, S3] });
