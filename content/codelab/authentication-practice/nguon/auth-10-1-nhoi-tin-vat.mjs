/** Authentication · 10.1 — Credential stuffing: lockout is a DoS; write the allow/challenge/block decision. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '10.1-1 — The highest-volume attack', kho: 'EASY', phut: 8,
  en: 'Credential stuffing replays leaked email/password pairs against your login, betting on reuse. Account lockout is the wrong fix.',
  vi: 'Nhồi tín vật phát lại các cặp email/mật khẩu rò vào trang đăng nhập của bạn, cược vào dùng lại. Khoá tài khoản là cách sửa sai.',
  cau: [
    q('c1', ['Why is "lock the account after 5 failed logins" the wrong defence against stuffing?', 'Vì sao "khoá tài khoản sau 5 lần đăng nhập sai" là phòng thủ sai trước nhồi?'],
      ['The attacker can now lock every real user on purpose — a denial-of-service you built yourself', 'It checks the failure count too slowly to keep up with the attack', 'Five failures is too generous; the real limit should be three', 'Account lockout is the officially recommended defence against stuffing'],
      ['Lockout turns against real users: fail an account five times and it is locked, no password needed (10.1).', 'Khoá quay ngược vào người thật: làm sai một tài khoản năm lần là nó bị khoá, không cần mật khẩu (10.1).']),
    q('c2', ['What is the right shape to defend, since stuffing is wide?', 'Dáng nào đúng để phòng thủ, vì nhồi thì rộng?'],
      ['The IP and the spread (one IP touching many accounts), while leaving the single account alone', 'The exact password strings seen most often in the attack', 'The time of day, blocking all logins outside business hours', 'The user-agent header, blocking any non-browser client'],
      ['Stuffing is a few IPs touching thousands of accounts; defend that shape so the real owner is never locked out (10.1).', 'Nhồi là vài IP chạm hàng nghìn tài khoản; phòng thủ dáng đó để chủ thật không bao giờ bị khoá (10.1).']),
    q('c3', ['Why does a solved CAPTCHA clear a suspicious account but not a flooding IP?', 'Vì sao một CAPTCHA đã giải xoá một tài khoản đáng ngờ nhưng không xoá một IP đang dội?'],
      ['A real user solves a CAPTCHA to prove human, but a solver farm passes CAPTCHAs too, so a true flood must stay blocked', 'A CAPTCHA takes longer to solve than the flood threshold allows', 'The IP is already banned by the firewall before the CAPTCHA loads', 'Flooding IPs cannot display a CAPTCHA at all'],
      ['Challenges clear soft signals; the hard IP block (ipFails ≥ 100) survives a solved challenge because solver farms exist (10.1).', 'Thách đố xoá tín hiệu mềm; khoá IP cứng (ipFails ≥ 100) sống qua một thách đố đã giải vì có trại giải (10.1).']),
  ],
  goiY: [['Defend the attack\'s shape, not the individual account.', 'Phòng thủ dáng của cú tấn công, không phải tài khoản đơn lẻ.'], ['A challenge is not a block.', 'Một thách đố không phải một khoá.']],
  loi: [['Thinking account lockout is a safe defence.', 'Tưởng khoá tài khoản là một phòng thủ an toàn.'], ['Thinking a solved CAPTCHA clears a true flood.', 'Tưởng một CAPTCHA đã giải xoá một đợt dội thật.']],
  tns: [tn('credential stuffing', 'nhồi tín vật'), tn('account lockout DoS', 'DoS khoá tài khoản')],
  kn: ['authentication'],
});

function decide(signal) {
  const s = signal || {};
  if (s.ipFails >= 100) return 'block';                 // flooding IP — survives a solved challenge
  if (s.ipAccounts >= 50) return 'block';               // spraying IP
  if (s.breached && !s.solvedChallenge) return 'challenge';
  if (!s.solvedChallenge && (s.ipFails >= 20 || s.accountFails >= 10)) return 'challenge';  // never block the account
  return 'allow';
}
const S2 = jsBai({
  ten: '10.1-2 — Write decide(signal): allow / challenge / block', kho: 'MEDIUM', phut: 14,
  en: `<p>Return the defence decision from <code>signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge }</code>. In order: a flooding IP (<code>ipFails ≥ 100</code>) or a spraying IP (<code>ipAccounts ≥ 50</code>) ⇒ <code>'block'</code> (even with a solved challenge); a breached password with no solved challenge ⇒ <code>'challenge'</code>; a suspicious IP (<code>ipFails ≥ 20</code>) or many account fails (<code>≥ 10</code>) with no solved challenge ⇒ <code>'challenge'</code>; otherwise <code>'allow'</code>. NEVER block on <code>accountFails</code> alone.</p>`,
  vi: `<p>Trả quyết định phòng thủ từ <code>signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge }</code>. Theo thứ tự: một IP dội (<code>ipFails ≥ 100</code>) hay phun (<code>ipAccounts ≥ 50</code>) ⇒ <code>'block'</code> (kể cả với thách đố đã giải); mật khẩu đã lộ không solved ⇒ <code>'challenge'</code>; IP đáng ngờ (<code>ipFails ≥ 20</code>) hay nhiều lần sai tài khoản (<code>≥ 10</code>) không solved ⇒ <code>'challenge'</code>; còn lại <code>'allow'</code>. KHÔNG BAO GIỜ block chỉ theo <code>accountFails</code>.</p>`,
  goiY: [['Check the two hard IP blocks first — they ignore solvedChallenge.', 'Kiểm hai khoá IP cứng trước — chúng bỏ qua solvedChallenge.'], ['The account signal is only ever a challenge, never a block.', 'Tín hiệu tài khoản chỉ bao giờ là challenge, không bao giờ block.']],
  loi: [['Blocking on accountFails (locking a real user = the DoS).', 'Block theo accountFails (khoá một người thật = cú DoS).'], ['Letting a solved challenge clear the hard IP flood.', 'Để một thách đố đã giải xoá đợt dội IP cứng.']],
  gt: ['decide() defends the IP and the spread and challenges the human; the account is never hard-blocked on its own fail count (10.1).', 'decide() phòng thủ IP và độ lan và thách đố con người; tài khoản không bao giờ bị khoá cứng theo số lần sai của chính nó (10.1).'],
  kn: ['authentication'], tns: [tn('challenge', 'thách đố')],
  dau: `/** signal ⇒ 'allow' | 'challenge' | 'block' */
function decide(signal) {
  // Write your solution here
  return 'allow';
}
`,
  giai: '// Reference solution\n' + nguon(decide),
  cases: [
    { goi: goi('decide', { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false }), moTa: ['clean ⇒ allow', 'sạch ⇒ allow'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 100, ipAccounts: 0, breached: false, solvedChallenge: true }), an: true, moTa: ['flood ⇒ block (even solved)', 'dội ⇒ block (kể cả solved)'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 0, ipAccounts: 50, breached: false, solvedChallenge: false }), an: true, moTa: ['spray ⇒ block', 'phun ⇒ block'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: true, solvedChallenge: false }), an: true, moTa: ['breached ⇒ challenge', 'đã lộ ⇒ challenge'] },
    { goi: goi('decide', { accountFails: 50, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false }), an: true, moTa: ['mistyping account ⇒ challenge, NOT block', 'tài khoản gõ sai ⇒ challenge, KHÔNG block'] },
  ],
});

const S3 = cs({
  ten: '10.1-3 — Order the anti-stuffing defences', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the defences from the one that does the most to the last-resort layer.',
  vi: 'Xếp các phòng thủ từ cái làm nhiều nhất tới lớp cuối cùng.',
  cau: [ord('o1', ['Most → last resort', 'Nhiều nhất → cuối cùng'], [
    'Block breached passwords at sign-up (the leaked password never works here)',
    'Offer passkeys (there is no password to stuff)',
    'Rate-limit and challenge by IP and spread (for accounts that still reuse a password)',
  ], ['Prevention first (no usable password), then rate limiting as the last layer for the rest (10.1, 2.4, 7.4).', 'Phòng ngừa trước (không có mật khẩu dùng được), rồi giới hạn tần suất như lớp cuối cho phần còn lại (10.1, 2.4, 7.4).'])],
  goiY: [['The best defences remove the password entirely.', 'Phòng thủ tốt nhất gỡ bỏ mật khẩu hoàn toàn.'], ['Rate limiting is the last layer, not the first.', 'Giới hạn tần suất là lớp cuối, không phải lớp đầu.']],
  loi: [['Putting rate limiting first.', 'Đặt giới hạn tần suất đầu tiên.'], ['Thinking stuffing has no earlier defence.', 'Tưởng nhồi không có phòng thủ sớm hơn.']],
  tns: [tn('defence in depth', 'phòng thủ nhiều lớp')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-10-1-nhoi-tin-vat', ten: '10.1 Credential stuffing', khoa: KHOA, baiHoc: 'auth-10-1-nhoi-tin-vat', de: [S1, S2, S3] });
