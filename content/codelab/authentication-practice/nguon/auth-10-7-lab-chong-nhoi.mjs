/** Authentication · Lab 10 — defend credential stuffing without locking real users; write the full decide(). */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: 'Lab 10-1 — Stop the attack, not the user', kho: 'MEDIUM', phut: 8,
  en: 'Lab 10: write decide(signal) — stop a stuffing spray WITHOUT locking out the real users the attacker sprays through.',
  vi: 'Lab 10: viết decide(signal) — chặn một đợt nhồi mà KHÔNG khoá những người dùng thật kẻ tấn công dội qua.',
  cau: [
    q('c1', ['The "yeu" attempt blocks after 5 account failures and scores 3/10. What is its core bug?', 'Bản "yếu" block sau 5 lần sai tài khoản và đạt 3/10. Con lỗi cốt lõi là gì?'],
      ['It locks a single account on its own fail count — so the attacker locks every real user on purpose (a DoS)', 'It is far too slow to evaluate the incoming signal object on each and every login request it receives', 'It mistakenly challenges far too many perfectly legitimate users who are simply logging in normally', 'It blocks the flooding attacker IP so aggressively that it accidentally takes down the whole service'],
      ['Blocking on accountFails is the DoS the lab exists to prevent; a single account is challenged, never blocked (Lab 10, 10.1).', 'Block theo accountFails là cú DoS lab tồn tại để ngăn; một tài khoản đơn lẻ bị challenge, không bao giờ block (Lab 10, 10.1).']),
    q('c2', ['Why must the two hard IP blocks be checked BEFORE the solved-challenge logic?', 'Vì sao hai khoá IP cứng phải được kiểm TRƯỚC logic thách-đố-đã-giải?'],
      ['A solver farm passes CAPTCHAs, so a true flood must stay blocked even when a solved challenge is present', 'The IP check is faster, so it should run first for performance', 'Solved challenges are rarely sent, so they can be ignored', 'The IP block only works on the first request'],
      ['The hard block survives a solved challenge; soft signals clear, the flood does not (Lab 10, 10.1).', 'Khoá cứng sống qua một thách đố đã giải; tín hiệu mềm xoá, đợt dội thì không (Lab 10, 10.1).']),
    q('c3', ['What should a clean signal (no fails, not breached) return?', 'Một signal sạch (không sai, không lộ) nên trả gì?'],
      ['allow — let the login proceed to the password check', 'challenge — ask every user to prove human', 'block — deny by default for safety', 'challenge only if it is a new device'],
      ['Default to allow so a normal login is not needlessly challenged; defend only the attack\'s shape (Lab 10).', 'Mặc định allow để một đăng nhập bình thường không bị thách đố vô cớ; chỉ phòng thủ dáng cú tấn công (Lab 10).']),
  ],
  goiY: [['The account is challenged, never hard-blocked.', 'Tài khoản bị challenge, không bao giờ khoá cứng.'], ['Hard IP blocks come before the challenge logic.', 'Khoá IP cứng tới trước logic thách đố.']],
  loi: [['Blocking a single account on its fail count.', 'Block một tài khoản đơn lẻ theo số lần sai.'], ['Letting a solved challenge clear a true flood.', 'Để một thách đố đã giải xoá một đợt dội thật.']],
  tns: [tn('account lockout DoS', 'DoS khoá tài khoản'), tn('challenge', 'thách đố')],
  kn: ['authentication'],
});

function decide(signal) {
  const s = signal || {};
  if (s.ipFails >= 100) return 'block';
  if (s.ipAccounts >= 50) return 'block';
  if (s.breached && !s.solvedChallenge) return 'challenge';
  if (!s.solvedChallenge && (s.ipFails >= 20 || s.accountFails >= 10)) return 'challenge';
  return 'allow';
}
const S2 = jsBai({
  ten: 'Lab 10-2 — Write decide(signal): the full defence', kho: 'HARD', phut: 16,
  en: `<p>Write the credential-stuffing defence. In order: a flooding IP (<code>ipFails ≥ 100</code>) or a spraying IP (<code>ipAccounts ≥ 50</code>) ⇒ <code>'block'</code>, even with a solved challenge; a breached password with no solved challenge ⇒ <code>'challenge'</code>; a suspicious IP (<code>ipFails ≥ 20</code>) or many account fails (<code>≥ 10</code>) with no solved challenge ⇒ <code>'challenge'</code>; otherwise <code>'allow'</code>. The single account is NEVER hard-blocked on its own fail count.</p>`,
  vi: `<p>Viết phòng thủ nhồi mật khẩu. Theo thứ tự: một IP dội (<code>ipFails ≥ 100</code>) hay phun (<code>ipAccounts ≥ 50</code>) ⇒ <code>'block'</code>, kể cả với một thách đố đã giải; một mật khẩu đã lộ không solved ⇒ <code>'challenge'</code>; một IP đáng ngờ (<code>ipFails ≥ 20</code>) hay nhiều lần sai tài khoản (<code>≥ 10</code>) không solved ⇒ <code>'challenge'</code>; còn lại <code>'allow'</code>. Tài khoản đơn lẻ KHÔNG BAO GIỜ bị khoá cứng theo số lần sai của chính nó.</p>`,
  goiY: [['Hard IP blocks first (they survive a solved challenge).', 'Khoá IP cứng trước (chúng sống qua một thách đố đã giải).'], ['Account fails ⇒ challenge, never block.', 'Sai tài khoản ⇒ challenge, không bao giờ block.']],
  loi: [['Blocking on accountFails (the DoS).', 'Block theo accountFails (cú DoS).'], ['Letting a solved challenge clear the hard flood.', 'Để một thách đố đã giải xoá đợt dội cứng.']],
  gt: ['decide() defends the IP and the spread, challenges the human, and never locks a single account — stopping the attack without a self-inflicted DoS (Lab 10, 10.1).', 'decide() phòng thủ IP và độ lan, thách đố con người, và không bao giờ khoá một tài khoản đơn lẻ — chặn cú tấn công mà không gây DoS cho mình (Lab 10, 10.1).'],
  kn: ['authentication'], tns: [tn('the spread', 'độ lan')],
  dau: `/** signal ⇒ 'allow' | 'challenge' | 'block' */
function decide(signal) {
  // Write your solution here
  return 'allow';
}
`,
  giai: '// Reference solution\n' + nguon(decide),
  cases: [
    { goi: goi('decide', { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false }), moTa: ['clean ⇒ allow', 'sạch ⇒ allow'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 100, ipAccounts: 0, breached: false, solvedChallenge: true }), an: true, moTa: ['flood (even solved) ⇒ block', 'dội (kể cả solved) ⇒ block'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 0, ipAccounts: 50, breached: false, solvedChallenge: false }), an: true, moTa: ['spray ⇒ block', 'phun ⇒ block'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: true, solvedChallenge: false }), an: true, moTa: ['breached ⇒ challenge', 'đã lộ ⇒ challenge'] },
    { goi: goi('decide', { accountFails: 999, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false }), an: true, moTa: ['mistyping account ⇒ challenge, NOT block', 'tài khoản gõ sai ⇒ challenge, KHÔNG block'] },
    { goi: goi('decide', { accountFails: 0, ipFails: 20, ipAccounts: 0, breached: false, solvedChallenge: true }), an: true, moTa: ['soft IP cleared by solved ⇒ allow', 'IP mềm được solved xoá ⇒ allow'] },
  ],
});

const S3 = cs({
  ten: 'Lab 10-3 — Grade each attempt', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order these three decide() attempts from the lowest grade to the highest.',
  vi: 'Xếp ba lần thử decide() này từ điểm thấp nhất tới cao nhất.',
  cau: [ord('o1', ['Lowest → highest', 'Thấp → cao'], [
    'The empty starter (returns \'allow\' always) — 1/10',
    'The "yeu" attempt (locks the account after 5 fails, no spread) — 3/10',
    'The reference (block the IP/spread, challenge the human, never the account) — 10/10',
  ], ['The starter allows everything; the yeu attempt locks real users and misses the spread; the reference passes all six (Lab 10).', 'Bản khởi đầu cho tất cả; lần thử yếu khoá người thật và thiếu độ lan; bản tham khảo qua cả sáu (Lab 10).'])],
  goiY: [['The starter never defends anything.', 'Bản khởi đầu không phòng thủ gì.'], ['The yeu attempt stops the attack but locks the owner.', 'Lần thử yếu chặn cú tấn công nhưng khoá chủ.']],
  loi: [['Thinking the yeu attempt passes (it is 3, below 7).', 'Tưởng lần thử yếu đạt (nó 3, dưới 7).'], ['Thinking the starter defends anything.', 'Tưởng bản khởi đầu phòng thủ gì.']],
  tns: [tn('pass = 7/10', 'đạt = 7/10')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-10-7-lab-chong-nhoi', ten: 'Lab 10 — stuffing defence', khoa: KHOA, baiHoc: 'auth-10-7-lab-chong-nhoi', de: [S1, S2, S3] });
