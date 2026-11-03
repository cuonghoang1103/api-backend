/** Authentication · 12.5 — Closing; write changedByAuth(topic): what changed vs what held constant. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '12.5-1 — Build vs adopt, and what changed', kho: 'EASY', phut: 8,
  en: 'For most systems, do not hand-roll auth; understand it to choose and debug one. Passkeys and automated attacks changed; the primitives did not.',
  vi: 'Với phần lớn hệ thống, đừng tự cuộn xác thực; hiểu nó để chọn và debug một cái. Passkey và tấn công tự động đổi; các nguyên thuỷ không.',
  cau: [
    q('c1', ['A new product needs login next sprint. What is the best default recommendation?', 'Một sản phẩm mới cần đăng nhập sprint tới. Khuyến nghị mặc định tốt nhất?'],
      ['Adopt a vetted library/provider; the understanding lets you choose, configure and debug it correctly', 'Hand-roll your own auth to control every detail yourself', 'Copy another team\'s auth code without review to save time', 'Store passwords in plaintext for easier debugging early on'],
      ['Understand auth to adopt and operate a vetted one well — hand-rolled crypto is where breaches live (12.5).', 'Hiểu xác thực để dùng và vận hành một cái đã kiểm tốt — mật mã tự-cuộn là nơi các vụ thủng sống (12.5).']),
    q('c2', ['When assembling auth, where does authorization belong in the order?', 'Khi lắp xác thực, phân quyền thuộc về đâu trong thứ tự?'],
      ['Last, after all the features are built and working', 'Only when a customer asks for roles explicitly', 'From day one — the one gate before the features, never bolted on', 'Only in the frontend, to hide the buttons'],
      ['Retrofitting deny-by-default onto a system that fell open is a rewrite; build the gate from day one (12.5, 9).', 'Trang bị lại từ-chối-mặc-định cho một hệ đã rơi-về-mở là một lần viết lại; dựng cổng từ ngày đầu (12.5, 9).']),
    q('c3', ['What is the single biggest real change in authentication recently?', 'Thay đổi thật lớn nhất về xác thực gần đây là gì?'],
      ['Passkeys — phishing-resistant credentials that remove the password and defeat the AiTM relay at once', 'Longer minimum password lengths now required by most corporate password policies and standards', 'Faster password-hashing algorithms that save a meaningful amount of CPU time per login request', 'Much shorter session timeouts, now typically measured in seconds rather than minutes or hours'],
      ['Passkeys remove the password and the relay together — the biggest improvement in a decade (12.5, 7/10).', 'Passkey gỡ mật khẩu và relay cùng nhau — cải thiện lớn nhất một thập kỷ (12.5, 7/10).']),
  ],
  goiY: [['Understand it to choose, not to ship your own crypto.', 'Hiểu nó để chọn, không phải ship mật mã của mình.'], ['Authorization is never an afterthought.', 'Phân quyền không bao giờ là một thứ nghĩ sau.']],
  loi: [['Hand-rolling crypto for production.', 'Tự cuộn mật mã cho production.'], ['Adding authorization last.', 'Thêm phân quyền sau cùng.']],
  tns: [tn('build vs adopt', 'dựng vs dùng'), tn('phishing resistance', 'kháng lừa đảo')],
  kn: ['authentication'],
});

const CHANGED = new Set(['passkeys', 'automated-attacks', 'origin-binding', 'breached-password-blocking']);
const CONSTANT = new Set(['slow-salted-hashing', 'deny-by-default', 'never-trust-input', 'secrets-out-of-repo', 'one-message-per-account', 'measure-not-guess']);
function changedByAuth(topic) {
  // Did this aspect of authentication genuinely change, or has it held constant since Chapter 1?
  if (CHANGED.has(topic)) return 'changed';
  if (CONSTANT.has(topic)) return 'constant';
  return 'unknown';
}
const S2 = jsBai({
  ten: '12.5-2 — Write changedByAuth(topic): changed or constant?', kho: 'EASY', phut: 8,
  en: `<p>Return <code>'changed'</code> if an aspect of authentication genuinely shifted recently (<code>passkeys</code>, <code>automated-attacks</code>, <code>origin-binding</code>, <code>breached-password-blocking</code>), <code>'constant'</code> if it held since Chapter 1 (<code>slow-salted-hashing</code>, <code>deny-by-default</code>, <code>never-trust-input</code>, <code>secrets-out-of-repo</code>, <code>one-message-per-account</code>, <code>measure-not-guess</code>), and <code>'unknown'</code> otherwise.</p>`,
  vi: `<p>Trả <code>'changed'</code> nếu một khía cạnh của xác thực thật sự dịch chuyển gần đây (<code>passkeys</code>, <code>automated-attacks</code>, <code>origin-binding</code>, <code>breached-password-blocking</code>), <code>'constant'</code> nếu nó giữ từ Chương 1 (<code>slow-salted-hashing</code>, <code>deny-by-default</code>, <code>never-trust-input</code>, <code>secrets-out-of-repo</code>, <code>one-message-per-account</code>, <code>measure-not-guess</code>), và <code>'unknown'</code> còn lại.</p>`,
  goiY: [['Two sets — changed and constant; default unknown.', 'Hai tập — changed và constant; mặc định unknown.'], ['Passkeys changed; slow salted hashing is constant.', 'Passkey đổi; băm chậm có muối là hằng.']],
  loi: [['Marking slow-salted-hashing as changed.', 'Đánh dấu slow-salted-hashing là changed.'], ['Returning undefined for an unknown topic.', 'Trả undefined cho một chủ đề lạ.']],
  gt: ['Passkeys and automated attacks changed; the Chapter 1 primitives are constant — knowing which is which is the closing lesson (12.5).', 'Passkey và tấn công tự động đổi; các nguyên thuỷ Chương 1 là hằng — biết cái nào là cái nào là bài kết (12.5).'],
  kn: ['authentication'], tns: [tn('the constants', 'các hằng số')],
  dau: `const CHANGED = new Set(['passkeys', 'automated-attacks', 'origin-binding', 'breached-password-blocking']);
const CONSTANT = new Set(['slow-salted-hashing', 'deny-by-default', 'never-trust-input', 'secrets-out-of-repo', 'one-message-per-account', 'measure-not-guess']);
/** ⇒ 'changed' | 'constant' | 'unknown' */
function changedByAuth(topic) {
  // Write your solution here
  return 'unknown';
}
`,
  giai: `const CHANGED = new Set(['passkeys', 'automated-attacks', 'origin-binding', 'breached-password-blocking']);
const CONSTANT = new Set(['slow-salted-hashing', 'deny-by-default', 'never-trust-input', 'secrets-out-of-repo', 'one-message-per-account', 'measure-not-guess']);
` + '// Reference solution\n' + nguon(changedByAuth),
  cases: [
    { goi: goi('changedByAuth', 'passkeys'), moTa: ['passkeys ⇒ changed', 'passkey ⇒ changed'] },
    { goi: goi('changedByAuth', 'slow-salted-hashing'), an: true, moTa: ['hashing ⇒ constant', 'băm ⇒ constant'] },
    { goi: goi('changedByAuth', 'deny-by-default'), an: true, moTa: ['deny-by-default ⇒ constant', 'từ-chối-mặc-định ⇒ constant'] },
    { goi: goi('changedByAuth', 'quantum-logins'), an: true, moTa: ['unknown ⇒ unknown', 'lạ ⇒ unknown'] },
  ],
});

const S3 = cs({
  ten: '12.5-3 — Changed or constant', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each aspect to whether it changed recently or held constant since Chapter 1.',
  vi: 'Ghép mỗi khía cạnh với việc nó đổi gần đây hay giữ hằng từ Chương 1.',
  bang: [bang1('b1', ['Aspect → status', 'Khía cạnh → trạng thái'], [{ ma: 'x', ten: 'Aspect' }, { ma: 'q', ten: 'Status', luaChon: ['changed', 'constant'] }], [
    { o: { x: 'phishing-resistant passkeys' }, a: { q: 'changed' } },
    { o: { x: 'automated attacks at scale' }, a: { q: 'changed' } },
    { o: { x: 'slow salted password hashing' }, a: { q: 'constant' } },
    { o: { x: 'deny by default' }, a: { q: 'constant' } },
  ], ['Passkeys and automated attacks changed; slow salted hashing and deny-by-default are constant (12.5).', 'Passkey và tấn công tự động đổi; băm chậm có muối và từ-chối-mặc-định là hằng (12.5).'])],
  goiY: [['The tools and attackers changed; the primitives did not.', 'Công cụ và kẻ tấn công đổi; các nguyên thuỷ không.'], ['Hashing and deny-by-default are foundations.', 'Băm và từ-chối-mặc-định là nền tảng.']],
  loi: [['Thinking hashing is a recent change.', 'Tưởng băm là một thay đổi gần đây.'], ['Thinking passkeys are an old constant.', 'Tưởng passkey là một hằng cũ.']],
  tns: [tn('passkeys', 'passkey')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-12-5-loi-ket', ten: '12.5 Closing', khoa: KHOA, baiHoc: 'auth-12-5-loi-ket', de: [S1, S2, S3] });
