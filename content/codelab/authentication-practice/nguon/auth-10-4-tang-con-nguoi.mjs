/** Authentication · 10.4 — The human layer: fatigue, help desk, carrier; write pushApproved number-matching. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '10.4-1 — Going around the login', kho: 'EASY', phut: 8,
  en: 'When the crypto is fine, the attacker goes through the people: MFA fatigue, the help desk, and the phone carrier.',
  vi: 'Khi mật mã kín, kẻ tấn công đi qua con người: mệt mỏi MFA, bàn hỗ trợ, và nhà mạng.',
  cau: [
    q('c1', ['What stops MFA fatigue (push bombing)?', 'Cái gì chặn mệt mỏi MFA (push bombing)?'],
      ['Number matching — the victim must type a number shown only on the attacker\'s login screen, which they never see', 'Sending the approval prompts even faster and more frequently so the victim deals with them all at once', 'Allowing an unlimited number of prompts so that the victim eventually stops noticing or caring about them', 'Switching the second factor over to SMS codes, which are delivered straight to the victim\'s phone number'],
      ['The number is on the attacker\'s screen, which the victim never sees, so a tap is not enough (10.4).', 'Số nằm trên màn hình kẻ tấn công, cái nạn nhân không thấy, nên một cái bấm không đủ (10.4).']),
    q('c2', ['A help desk resets MFA when the caller "knows the last four digits of the card". Why is that weak?', 'Một bàn hỗ trợ đặt lại MFA khi người gọi "biết bốn số cuối của thẻ". Vì sao yếu?'],
      ['The last four digits are not a secret — they are on receipts and statements, so an attacker can gather them', 'The digits are too short to be typed correctly over the phone', 'Cards change their last four digits every month', 'The help desk cannot verify a card number at all'],
      ['Recovery must verify out of band, not with knowledge an attacker can collect; a weak recovery is the real authentication (10.4).', 'Khôi phục phải xác minh ngoài băng, không bằng kiến thức kẻ tấn công thu thập được; một khôi phục yếu là xác thực thật (10.4).']),
    q('c3', ['Why is SMS the weak second factor?', 'Vì sao SMS là yếu tố thứ hai yếu?'],
      ['It is SIM-swappable at the carrier, relayable by phishing, and interceptable on the network', 'SMS text messages are technically unable to carry a standard six-digit one-time authentication code', 'SMS delivery is always so slow that the one-time code has already expired by the time it finally arrives', 'Phones silence incoming SMS messages by default, so the user never notices the authentication code'],
      ['A SIM swap, a relay, or SS7 all defeat SMS; prefer TOTP/passkeys and treat SMS as a fallback (10.4).', 'Một SIM swap, một relay, hay SS7 đều đánh bại SMS; ưu tiên TOTP/passkey và coi SMS là dự phòng (10.4).']),
  ],
  goiY: [['The number matching value is hidden from the victim.', 'Giá trị ghép số bị giấu khỏi nạn nhân.'], ['Recovery must be as strong as the login.', 'Khôi phục phải mạnh ngang trang đăng nhập.']],
  loi: [['Thinking more prompts (rate limiting alone) stops fatigue.', 'Tưởng thêm lời nhắc (chỉ giới hạn tần suất) chặn mệt mỏi.'], ['Trusting SMS as a strong factor.', 'Tin SMS như một yếu tố mạnh.']],
  tns: [tn('MFA fatigue', 'mệt mỏi MFA'), tn('SIM swap', 'SIM swap')],
  kn: ['authentication'],
});

function pushApproved(mode, tapped, typedNumber, shownNumber) {
  // 'tap': any tap approves (the fatigue weakness). 'number-match': a tap is not enough — the typed number must
  // equal the number shown on the login screen, which the victim can only see if it is really their own login.
  if (mode === 'tap') return tapped === true;
  if (mode === 'number-match') return tapped === true && typedNumber === shownNumber;
  return false;
}
const S2 = jsBai({
  ten: '10.4-2 — Write pushApproved(mode, tapped, typedNumber, shownNumber)', kho: 'MEDIUM', phut: 12,
  en: `<p>Decide whether a push login is approved. In <code>'tap'</code> mode, any <code>tapped === true</code> approves (the fatigue weakness). In <code>'number-match'</code> mode, approval needs BOTH <code>tapped === true</code> AND <code>typedNumber === shownNumber</code> (the number is on the login screen; a tap alone is not enough). Any other mode ⇒ <code>false</code>.</p>`,
  vi: `<p>Quyết định một đăng nhập push có được duyệt không. Ở chế độ <code>'tap'</code>, bất kỳ <code>tapped === true</code> nào cũng duyệt (điểm yếu mệt mỏi). Ở chế độ <code>'number-match'</code>, duyệt cần CẢ <code>tapped === true</code> VÀ <code>typedNumber === shownNumber</code> (số nằm trên màn hình đăng nhập; chỉ một cái bấm là không đủ). Chế độ khác ⇒ <code>false</code>.</p>`,
  goiY: [['number-match needs both conditions, not just the tap.', 'number-match cần cả hai điều kiện, không chỉ cái bấm.'], ['An unknown mode should deny.', 'Một chế độ lạ nên từ chối.']],
  loi: [['Approving number-match on the tap alone.', 'Duyệt number-match chỉ theo cái bấm.'], ['Approving an unknown mode.', 'Duyệt một chế độ lạ.']],
  gt: ['Number matching defeats fatigue: the attacker cannot supply a number the victim never saw, so a tap is not enough (10.4).', 'Ghép số đánh bại mệt mỏi: kẻ tấn công không cung cấp được một số nạn nhân không thấy, nên một cái bấm không đủ (10.4).'],
  kn: ['authentication'], tns: [tn('number matching', 'ghép số')],
  dau: `/** ⇒ true if the push login is approved */
function pushApproved(mode, tapped, typedNumber, shownNumber) {
  // Write your solution here
  return tapped === true;
}
`,
  giai: '// Reference solution\n' + nguon(pushApproved),
  cases: [
    { goi: goi('pushApproved', 'tap', true, 0, 42), moTa: ['tap mode, tapped ⇒ true', 'chế độ tap, bấm ⇒ true'] },
    { goi: goi('pushApproved', 'number-match', true, 42, 42), an: true, moTa: ['number matches ⇒ true', 'số khớp ⇒ true'] },
    { goi: goi('pushApproved', 'number-match', true, 7, 42), an: true, moTa: ['tapped but wrong number ⇒ false', 'bấm nhưng sai số ⇒ false'] },
    { goi: goi('pushApproved', 'number-match', false, 42, 42), an: true, moTa: ['right number but not tapped ⇒ false', 'đúng số nhưng không bấm ⇒ false'] },
    { goi: goi('pushApproved', 'unknown', true, 42, 42), an: true, moTa: ['unknown mode ⇒ false', 'chế độ lạ ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '10.4-3 — Human channel → defence', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each human-layer attack to its defence.',
  vi: 'Ghép mỗi cú tấn công tầng con người với phòng thủ của nó.',
  bang: [bang1('b1', ['Attack → defence', 'Tấn công → phòng thủ'], [{ ma: 'x', ten: 'Attack' }, { ma: 'q', ten: 'Defence', luaChon: ['number matching', 'out-of-band reset verification', 'avoid SMS; prefer TOTP/passkeys'] }], [
    { o: { x: 'MFA fatigue' }, a: { q: 'number matching' } },
    { o: { x: 'help-desk social engineering' }, a: { q: 'out-of-band reset verification' } },
    { o: { x: 'SIM swap' }, a: { q: 'avoid SMS; prefer TOTP/passkeys' } },
  ], ['Number matching for fatigue, out-of-band verification for the help desk, no-SMS for SIM swap (10.4).', 'Ghép số cho mệt mỏi, xác minh ngoài băng cho bàn hỗ trợ, không-SMS cho SIM swap (10.4).'])],
  goiY: [['One defence removes the factor the attacker can port.', 'Một phòng thủ gỡ bỏ yếu tố kẻ tấn công chuyển được.'], ['The help desk defence is about the channel of verification.', 'Phòng thủ bàn hỗ trợ về kênh xác minh.']],
  loi: [['Defending fatigue with more prompts.', 'Phòng mệt mỏi bằng thêm lời nhắc.'], ['Keeping SMS to defend SIM swap.', 'Giữ SMS để phòng SIM swap.']],
  tns: [tn('out-of-band', 'ngoài băng')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-10-4-tang-con-nguoi', ten: '10.4 The human layer', khoa: KHOA, baiHoc: 'auth-10-4-tang-con-nguoi', de: [S1, S2, S3] });
