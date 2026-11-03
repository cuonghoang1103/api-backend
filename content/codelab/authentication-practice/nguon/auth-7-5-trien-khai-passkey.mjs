/** Authentication · 7.5 — Triển khai passkey: viết counterOk (phát hiện bản sao); sắp + bảng + đọc. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s07/_ma.mjs';

const PK = OUT['74-passkey'].split('\n').slice(1);

const S1 = cs({
  ten: '7.5-1 — What the server stores, read the run', kho: 'EASY', phut: 7,
  en: `LabFlow ID v0.7 stored, from the ceremony:${pre(PK.slice(0, 4))}`,
  vi: `LabFlow ID v0.7 đã lưu, từ nghi thức:${pre(PK.slice(0, 4))}`,
  cau: [
    q('c1', ['One row per authenticator holds a credential id, a public key and a counter. Why must the challenge be server-made and one-shot?', 'Một dòng mỗi bộ xác thực giữ credential id, khoá công khai và counter. Vì sao challenge phải do máy chủ tạo và dùng một lần?'],
      ['A client-chosen or reused challenge can be pre-signed; a fresh server challenge makes each assertion one-shot', 'So the challenge stays short enough to fit inside the QR code the app scans', 'So the signature counter stays small and never overflows its column', 'Because the relying-party ID must be embedded inside the challenge bytes'],
      ['Freshness is half the security: a reusable or client-chosen challenge lets an attacker prepare a signature in advance (7.5).', 'Độ tươi là nửa sự an toàn: một challenge dùng lại hay do client chọn cho kẻ tấn công chuẩn bị một chữ ký trước (7.5).']),
    q('c2', ['auth/options should return the same shape whether or not the email has passkeys. Why?', 'auth/options nên trả cùng hình dạng dù email có passkey hay không. Vì sao?'],
      ['Otherwise it is an enumeration oracle revealing which emails have passkeys (6.4)', 'To save bandwidth by not listing credential ids that will not be used', 'Because the WebAuthn browser API refuses options with an empty credential list', 'To keep every authenticator’s signature counter in sync across devices'],
      ['Differing responses by passkey existence let an attacker enumerate users — the Chapter 6 rule applies at the login door (7.5, 6.4).', 'Phản hồi khác nhau theo sự tồn tại passkey cho kẻ tấn công dò người dùng — luật Chương 6 áp ở cửa đăng nhập (7.5, 6.4).']),
  ],
  goiY: [['A pre-signed assertion is the attack a fresh challenge prevents.', 'Một assertion ký trước là cú tấn công mà một challenge mới ngăn.'], ['The enumeration rule follows you to the login door.', 'Luật dò tài khoản theo bạn tới cửa đăng nhập.']],
  loi: [['Thinking the challenge can be reused.', 'Tưởng challenge dùng lại được.'], ['Revealing "no passkeys for that user".', 'Lộ "không passkey cho người đó".']],
  tns: [tn('challenge', 'challenge'), tn('signature counter', 'bộ đếm chữ ký')],
  kn: ['authentication'],
});

function counterOk(stored, presented) {
  // The signature counter must strictly increase; a value that does not is a cloned authenticator.
  return presented > stored;
}
const S2 = jsBai({
  ten: '7.5-2 — Write counterOk(stored, presented): clone detection', kho: 'EASY', phut: 8,
  en: `<p>Each authenticator bumps a signature counter per use. The server stores the last value and expects the next to be strictly higher. Return <code>true</code> if the presented counter is acceptable (greater than the stored one), <code>false</code> if it stayed the same or went backwards — a sign of a cloned credential.</p>`,
  vi: `<p>Mỗi bộ xác thực tăng một bộ đếm chữ ký mỗi lần dùng. Máy chủ lưu giá trị cuối và mong cái kế cao hơn hẳn. Trả <code>true</code> nếu counter nhập được chấp nhận (lớn hơn cái đã lưu), <code>false</code> nếu nó giữ nguyên hoặc đi lùi — dấu hiệu một credential bị sao chép.</p>`,
  goiY: [['Strictly greater, not greater-or-equal.', 'Lớn hơn hẳn, không phải lớn-hơn-hoặc-bằng.'], ['Equal means no increment happened — suspicious.', 'Bằng nghĩa là không có tăng — đáng ngờ.']],
  loi: [['Using >= instead of >.', 'Dùng >= thay vì >.'], ['Accepting a backwards counter.', 'Nhận một counter đi lùi.']],
  gt: ['A counter that does not strictly increase means two copies of the credential are in use — the WebAuthn clone-detection signal (7.5).', 'Một counter không tăng hẳn nghĩa là hai bản của credential đang dùng — tín hiệu phát hiện sao chép của WebAuthn (7.5).'],
  kn: ['authentication'], tns: [tn('clone detection', 'phát hiện sao chép')],
  dau: `/** ⇒ true if the presented counter is acceptable */
function counterOk(stored, presented) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(counterOk),
  cases: [
    { goi: goi('counterOk', 4, 5), moTa: ['increased ⇒ ok', 'tăng ⇒ ok'] },
    { goi: goi('counterOk', 5, 5), an: true, moTa: ['unchanged ⇒ clone', 'không đổi ⇒ bản sao'] },
    { goi: goi('counterOk', 9, 3), an: true, moTa: ['backwards ⇒ clone', 'đi lùi ⇒ bản sao'] },
  ],
});

const S3 = cs({
  ten: '7.5-3 — Order a passwordless migration', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the steps of moving a user from "password only" to "passwordless", without a lockout.',
  vi: 'Xếp các bước chuyển một người dùng từ "chỉ mật khẩu" sang "không mật khẩu", không bị khoá.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Offer passkeys alongside the password',
    'Prompt enrollment after a successful login',
    'Encourage a second authenticator and keep recovery codes',
    'Offer to drop the password only once two passkeys work',
  ], ['Add passkeys next to the password, prompt enrollment, ensure a second factor + recovery, then drop the password last (7.5).', 'Thêm passkey cạnh mật khẩu, nhắc đăng ký, bảo đảm một yếu tố thứ hai + khôi phục, rồi bỏ mật khẩu cuối (7.5).'])],
  goiY: [['Never flip a switch — walk to passwordless.', 'Đừng bật một công tắc — đi tới không-mật-khẩu.'], ['Drop the password last, after a second passkey.', 'Bỏ mật khẩu cuối, sau một passkey thứ hai.']],
  loi: [['Dropping the password after one passkey.', 'Bỏ mật khẩu sau một passkey.'], ['Removing recovery during migration.', 'Gỡ khôi phục trong lúc di trú.']],
  tns: [tn('passwordless migration', 'di trú không mật khẩu')],
  kn: ['authentication'],
});

const S4 = cs({
  ten: '7.5-4 — Stored field → purpose', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each stored passkey field with what it is for.',
  vi: 'Ghép mỗi trường passkey lưu trữ với công dụng của nó.',
  bang: [bang1('b1', ['Field → purpose', 'Trường → công dụng'], [{ ma: 'x', ten: 'Field' }, { ma: 'q', ten: 'Purpose', luaChon: ['looked up at login', 'verifies the signature', 'clone detection', 'a UI hint'] }], [
    { o: { x: 'credential id' }, a: { q: 'looked up at login' } },
    { o: { x: 'public key' }, a: { q: 'verifies the signature' } },
    { o: { x: 'counter' }, a: { q: 'clone detection' } },
    { o: { x: 'transports' }, a: { q: 'a UI hint' } },
  ], ['The id finds the row, the public key checks the signature, the counter catches clones, transports hint how to reach the authenticator — the private key is never stored (7.5).', 'id tìm dòng, khoá công khai kiểm chữ ký, counter bắt bản sao, transports gợi ý cách với tới bộ xác thực — khoá riêng không bao giờ lưu (7.5).'])],
  goiY: [['Only the public key verifies; the private key is never stored.', 'Chỉ khoá công khai xác minh; khoá riêng không bao giờ lưu.'], ['The id is the lookup key; transports are only a hint.', 'id là khoá tra; transports chỉ là một gợi ý.']],
  loi: [['Thinking the counter logs the user in.', 'Tưởng counter đăng nhập người dùng.'], ['Thinking transports are security-critical.', 'Tưởng transports là trọng yếu bảo mật.']],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-7-5-trien-khai-passkey', ten: '7.5 Shipping passkeys', khoa: KHOA, baiHoc: 'auth-7-5-trien-khai-passkey', de: [S1, S2, S3, S4] });
