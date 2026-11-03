/** Authentication · 7.4 — Passkey: đọc output Chromium; viết originAllowed; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s07/_ma.mjs';

const PK = OUT['74-passkey'].split('\n').slice(1);

const S1 = cs({
  ten: '7.4-1 — The passkey ceremony, read the run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.7, a real Chromium virtual authenticator:${pre(PK)}`,
  vi: `LabFlow ID v0.7, một Chromium thật với bộ xác thực ảo:${pre(PK)}`,
  cau: [
    q('c1', ['The SAME real assertion verifies against the true origin but FAILS against https://evil.example. Why?', 'CÙNG chữ ký thật verify với origin thật nhưng THẤT BẠI với https://evil.example. Vì sao?'],
      ['The authenticator signed over the real origin; a check against a different origin cannot accept that signature', 'The server keeps evil.example on a blocklist of known phishing domains and refuses it', 'The challenge issued for the real origin had already expired by the second verification', 'The public key was silently rotated between the two verification attempts'],
      ['WebAuthn signs the challenge AND the requesting origin; verifying against a different origin fails — origin binding is what kills phishing (7.4).', 'WebAuthn ký challenge VÀ origin đã hỏi; xác minh với một origin khác thất bại — gắn origin là cái giết lừa đảo (7.4).']),
    q('c2', ['The server stored a credential id, a public key and a counter. Why is a dump of that table not catastrophic?', 'Máy chủ lưu một credential id, một khoá công khai và một counter. Vì sao một bản dump bảng đó không thảm hoạ?'],
      ['A signature still needs the private key, which never left the device — public keys cannot impersonate anyone', 'The public key column is encrypted at rest, so a dump cannot read it', 'The passkeys table is read-only, so an attacker cannot modify stored rows', 'The signature counter on each row blocks any login after a dump is detected'],
      ['The private key never leaves the authenticator; the server holds only public material, useless to forge a signature (7.4, 7.5).', 'Khoá riêng không bao giờ rời bộ xác thực; máy chủ chỉ giữ phần công khai, vô dụng để giả một chữ ký (7.4, 7.5).']),
    q('c3', ['Why is a passkey often "two factors in one tap"?', 'Vì sao một passkey thường là "hai yếu tố trong một cú chạm"?'],
      ['The private key is something you HAVE; unlocking it with a biometric/PIN adds something you ARE/KNOW', 'It asks the user to type two separate one-time codes during the ceremony', 'It signs the challenge twice with two different private keys for redundancy', 'It verifies the assertion against two independent servers before accepting'],
      ['The device (have) plus the user-verification biometric/PIN (are/know) make a passkey two factors in one gesture (7.4).', 'Thiết bị (có) cộng xác minh người dùng sinh-trắc/PIN (là/biết) khiến một passkey là hai yếu tố trong một cử chỉ (7.4).']),
  ],
  goiY: [['The signature covers more than the challenge.', 'Chữ ký phủ nhiều hơn challenge.'], ['What does the server NOT have?', 'Máy chủ KHÔNG có cái gì?']],
  loi: [['Thinking a blocklist stops the phishing origin.', 'Tưởng một blocklist chặn origin lừa đảo.'], ['Thinking the server stores the private key.', 'Tưởng máy chủ lưu khoá riêng.']],
  tns: [tn('origin binding', 'gắn origin'), tn('passkey', 'passkey')],
  kn: ['authentication'],
});

function originAllowed(signedOrigin, expected) {
  const list = Array.isArray(expected) ? expected : [expected];
  return list.includes(signedOrigin);
}
const S2 = jsBai({
  ten: '7.4-2 — Write originAllowed(signedOrigin, expected): the one line', kho: 'EASY', phut: 8,
  en: `<p>The heart of verification: return <code>true</code> only if the origin the authenticator signed is one the server expects. <code>expected</code> may be a single origin string or an array of allowed origins. An exact match is required — a phishing origin is never in the list, so its assertion is rejected.</p>`,
  vi: `<p>Trái tim của xác minh: trả <code>true</code> chỉ khi origin bộ xác thực đã ký là một cái máy chủ mong. <code>expected</code> có thể là một chuỗi origin hoặc một mảng origin được phép. Phải khớp CHÍNH XÁC — một origin lừa đảo không bao giờ trong danh sách, nên assertion của nó bị từ chối.</p>`,
  goiY: [['Normalise expected to an array, then check membership.', 'Chuẩn hoá expected về mảng, rồi kiểm thành viên.'], ['Require an exact string match — no prefix/suffix tricks.', 'Đòi khớp chuỗi chính xác — không mẹo tiền tố/hậu tố.']],
  loi: [['Using includes() on the string (substring match).', 'Dùng includes() trên chuỗi (khớp chuỗi con).'], ['Accepting any https origin.', 'Nhận bất kỳ origin https nào.']],
  gt: ['Exact-match origin checking is the anti-phishing line; a substring check would accept evil-labflow.example (7.4).', 'Kiểm origin khớp chính xác là dòng chống lừa đảo; một kiểm chuỗi con sẽ nhận evil-labflow.example (7.4).'],
  kn: ['authentication'], tns: [tn('expected origin', 'origin mong đợi')],
  dau: `/** ⇒ true only if signedOrigin is an allowed origin */
function originAllowed(signedOrigin, expected) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(originAllowed),
  cases: [
    { goi: goi('originAllowed', 'https://id.labflow.example', 'https://id.labflow.example'), moTa: ['exact match', 'khớp chính xác'] },
    { goi: goi('originAllowed', 'https://evil.example', 'https://id.labflow.example'), an: true, moTa: ['phishing ⇒ false', 'lừa đảo ⇒ false'] },
    { goi: goi('originAllowed', 'https://app.labflow.example', ['https://id.labflow.example', 'https://app.labflow.example']), an: true, moTa: ['in the allow-list', 'trong danh sách cho phép'] },
    { goi: goi('originAllowed', 'https://evil-labflow.example', 'https://labflow.example'), an: true, moTa: ['lookalike ⇒ false', 'nhìn-giống ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '7.4-3 — Order the authentication ceremony', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order one passkey login, from the server challenge to a verified user.',
  vi: 'Xếp một lần đăng nhập passkey, từ challenge của máy chủ tới một người dùng đã xác minh.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Server mints a fresh challenge and sends the allowed credential ids',
    'The authenticator signs the challenge + the page origin with the private key',
    'Server verifies the signature against the stored public key and its expected origin',
    'The signature counter is bumped and the user is logged in',
  ], ['Challenge → sign over challenge+origin → verify against the public key + expected origin → bump counter (7.4, 7.5).', 'Challenge → ký lên challenge+origin → xác minh với khoá công khai + origin mong đợi → tăng counter (7.4, 7.5).'])],
  goiY: [['The server starts it with a challenge.', 'Máy chủ bắt đầu bằng một challenge.'], ['The counter bump is last.', 'Tăng counter là cuối.']],
  loi: [['Signing before the challenge exists.', 'Ký trước khi có challenge.'], ['Verifying before signing.', 'Xác minh trước khi ký.']],
  tns: [tn('ceremony', 'nghi thức'), tn('challenge', 'challenge')],
  kn: ['authentication'],
});

const S4 = cs({
  ten: '7.4-4 — Password/TOTP vs passkey under attack', kho: 'EASY', phut: 6, loai: 'table',
  en: 'For each attack, does a passkey survive it?',
  vi: 'Với mỗi cú tấn công, một passkey sống qua không?',
  bang: [bang1('b1', ['Attack → passkey survives?', 'Tấn công → passkey sống?'], [{ ma: 'x', ten: 'Attack' }, { ma: 'q', ten: 'Survives?', luaChon: ['yes', 'no'] }], [
    { o: { x: 'fake site relays the challenge' }, a: { q: 'yes' } },
    { o: { x: 'server database is dumped' }, a: { q: 'yes' } },
    { o: { x: 'password reused from another breach' }, a: { q: 'yes' } },
    { o: { x: 'unlocked stolen device with a resident passkey' }, a: { q: 'no' } },
  ], ['Origin binding beats relay; only public keys are stored; there is no password to reuse — but an unlocked device holding the passkey is the credential (7.4).', 'Gắn origin thắng chuyển tiếp; chỉ khoá công khai được lưu; không có mật khẩu để dùng lại — nhưng một thiết bị mở khoá giữ passkey là cái tín vật (7.4).'])],
  goiY: [['Three attacks are defeated by design; one is about the device itself.', 'Ba cú bị đánh bại từ thiết kế; một cú về chính thiết bị.'], ['Origin binding, public-key storage and no-password each defeat one.', 'Gắn origin, lưu khoá-công-khai và không-mật-khẩu mỗi cái đánh bại một.']],
  loi: [['Thinking an unlocked stolen device is also safe.', 'Tưởng một thiết bị mở khoá bị trộm cũng an toàn.'], ['Thinking a database dump lets an attacker sign in.', 'Tưởng một bản dump cho kẻ tấn công đăng nhập.']],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-7-4-passkey', ten: '7.4 Passkeys', khoa: KHOA, baiHoc: 'auth-7-4-passkey', de: [S1, S2, S3, S4] });
