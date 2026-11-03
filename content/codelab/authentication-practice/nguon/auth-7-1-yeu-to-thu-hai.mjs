/** Authentication · 7.1 — Yếu tố thứ hai: đọc output step-up; viết isTwoFactor; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s07/_ma.mjs';

const SU = OUT['73-totp-enroll'].split('\n').slice(1);

const S1 = cs({
  ten: '7.1-1 — The step-up, read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.7 (real run):${pre(SU)}`,
  vi: `LabFlow ID v0.7 (chạy thật):${pre(SU)}`,
  cau: [
    q('c1', ['The step-up runs AFTER the password check and returns { via: "totp" }. What does a second factor defend against?', 'Step-up chạy SAU phép kiểm mật khẩu và trả { via: "totp" }. Một yếu tố thứ hai phòng cái gì?'],
      ['An attacker who has the password — leaked, reused, guessed or phished', 'Malware already running on the unlocked device', 'A session token already stolen', 'A weak hashing algorithm'],
      ['A second factor stops someone who has the password but not the second-family factor; it does not help against a compromised device or a stolen session (7.1).', 'Một yếu tố thứ hai chặn người có mật khẩu nhưng không có yếu tố họ-thứ-hai; nó không giúp với một thiết bị bị chiếm hay một phiên bị trộm (7.1).']),
    q('c2', ['When the phone is gone, the step-up accepts { via: "recovery", remaining: 9 }, and a reused recovery code returns BAD_CODE. Why single-use?', 'Khi mất điện thoại, step-up nhận { via: "recovery", remaining: 9 }, và một mã khôi phục dùng lại trả BAD_CODE. Vì sao dùng một lần?'],
      ['So an intercepted recovery code cannot be replayed after the user has spent it', 'So that all ten recovery codes fit on a single screen at enrollment', 'So the server is able to store the codes safely in plaintext', 'So the codes never expire and work years after enrollment'],
      ['Recovery codes are single-use credentials: once consumed, a code is removed, so a copy an attacker saw is already dead (7.3).', 'Mã khôi phục là tín vật dùng một lần: tiêu xong, một mã bị bỏ, nên một bản kẻ tấn công thấy đã chết (7.3).']),
    q('c3', ['Why ask the factor at login and before sensitive actions, not on every request?', 'Vì sao hỏi yếu tố lúc đăng nhập và trước hành động nhạy cảm, không phải mỗi request?'],
      ['The session carries the factor after login; step-up re-asks only where it matters most', 'Because verifying a code is too slow to do often', 'Because the code changes every 30 seconds', 'Because the browser caches the factor'],
      ['Re-prompting every request is unusable; the session carries the factor, and step-up re-asks before high-value actions to shrink the stolen-session window (7.1).', 'Hỏi lại mỗi request thì không dùng được; phiên mang yếu tố, và step-up hỏi lại trước hành động giá trị cao để thu cửa sổ phiên-bị-trộm (7.1).']),
  ],
  goiY: [['Which attacker holds the password but not the phone?', 'Kẻ tấn công nào giữ mật khẩu mà không giữ điện thoại?'], ['The session remembers the factor between prompts.', 'Phiên nhớ yếu tố giữa các lần hỏi.']],
  loi: [['Thinking 2FA stops device malware.', 'Tưởng 2FA chặn mã độc thiết bị.'], ['Thinking the factor is asked on every click.', 'Tưởng yếu tố bị hỏi mỗi cú bấm.']],
  tns: [tn('second factor', 'yếu tố thứ hai'), tn('step-up authentication', 'xác thực nâng cấp')],
  kn: ['authentication'],
});

function isTwoFactor(a, b) {
  // True only when the two factors come from DIFFERENT families (know / have / are).
  const fam = { password: 'know', pin: 'know', question: 'know', totp: 'have', sms: 'have', push: 'have', key: 'have', passkey: 'have', fingerprint: 'are', face: 'are' };
  return !!fam[a] && !!fam[b] && fam[a] !== fam[b];
}
const S2 = jsBai({
  ten: '7.1-2 — Write isTwoFactor(a, b): two DIFFERENT families', kho: 'EASY', phut: 10,
  en: `<p>Return <code>true</code> only if two authenticators are genuine two-factor — i.e. from two <b>different</b> families (know / have / are). Map: <code>password/pin/question → know</code>, <code>totp/sms/push/key/passkey → have</code>, <code>fingerprint/face → are</code>. Two of the same family (e.g. password + question) is <b>one</b> factor.</p>`,
  vi: `<p>Trả <code>true</code> chỉ khi hai bộ xác thực là hai-yếu-tố thật — tức từ hai họ <b>khác nhau</b> (biết / có / là). Ánh xạ: <code>password/pin/question → know</code>, <code>totp/sms/push/key/passkey → have</code>, <code>fingerprint/face → are</code>. Hai cái cùng họ (vd password + question) là <b>một</b> yếu tố.</p>`,
  goiY: [['Build a label → family map, then compare families.', 'Dựng một map nhãn → họ, rồi so họ.'], ['Same family ⇒ false, even if the labels differ.', 'Cùng họ ⇒ false, dù nhãn khác.']],
  loi: [['Returning true for password + security question.', 'Trả true cho password + câu hỏi bảo mật.'], ['Returning true when a label is unknown.', 'Trả true khi một nhãn lạ.']],
  gt: ['Two factors must come from different families so they fail on different days; two things you know leak together (7.1).', 'Hai yếu tố phải từ các họ khác nhau để hỏng vào các ngày khác nhau; hai thứ bạn biết rò cùng nhau (7.1).'],
  kn: ['authentication'], tns: [tn('factor family', 'họ yếu tố')],
  dau: `/** ⇒ true only if a and b are from different factor families */
function isTwoFactor(a, b) {
  // Write your solution here
  return a !== b;
}
`,
  giai: '// Reference solution\n' + nguon(isTwoFactor),
  cases: [
    { goi: goi('isTwoFactor', 'password', 'totp'), moTa: ['know + have', 'biết + có'] },
    { goi: goi('isTwoFactor', 'password', 'question'), an: true, moTa: ['know + know ⇒ one factor', 'biết + biết ⇒ một yếu tố'] },
    { goi: goi('isTwoFactor', 'passkey', 'fingerprint'), an: true, moTa: ['have + are', 'có + là'] },
    { goi: goi('isTwoFactor', 'password', 'nonsense'), an: true, moTa: ['unknown ⇒ false', 'lạ ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '7.1-3 — Order factors by phishing resistance', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order these second factors from MOST phishable to least (SMS easiest to abuse → passkey impossible).',
  vi: 'Xếp các yếu tố thứ hai từ DỄ lừa nhất tới khó nhất (SMS dễ lạm dụng nhất → passkey bất khả).',
  cau: [ord('o1', ['Most phishable → least', 'Dễ lừa nhất → khó nhất'], [
    'SMS code — SIM-swap or SS7 redirects the channel',
    'TOTP / push — relayed to the real site within the window',
    'Passkey — signed over the origin, a relayed challenge is worthless',
  ], ['SMS adds a redirectable channel on top of being relayable; TOTP/push are relayable; a passkey is origin-bound and cannot be relayed (7.1, 7.4).', 'SMS thêm một kênh chuyển hướng được bên trên việc chuyển tiếp được; TOTP/push chuyển tiếp được; một passkey gắn origin và không chuyển tiếp được (7.1, 7.4).'])],
  goiY: [['Which one has a weak delivery channel on top of being relayable?', 'Cái nào có một kênh chuyển phát yếu bên trên việc chuyển tiếp được?'], ['Only one is origin-bound.', 'Chỉ một cái gắn origin.']],
  loi: [['Putting passkey as phishable.', 'Đặt passkey là lừa được.'], ['Thinking SMS is the strongest.', 'Tưởng SMS mạnh nhất.']],
  tns: [tn('phishing resistance', 'chống lừa đảo')],
  kn: ['authentication'],
});

const S4 = cs({
  ten: '7.1-4 — Factor → family', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each authenticator with its family.',
  vi: 'Ghép mỗi bộ xác thực với họ của nó.',
  bang: [bang1('b1', ['Factor → family', 'Yếu tố → họ'], [{ ma: 'x', ten: 'Factor' }, { ma: 'q', ten: 'Family', luaChon: ['know', 'have', 'are'] }], [
    { o: { x: 'password' }, a: { q: 'know' } },
    { o: { x: 'TOTP app' }, a: { q: 'have' } },
    { o: { x: 'security key' }, a: { q: 'have' } },
    { o: { x: 'fingerprint' }, a: { q: 'are' } },
  ], ['Passwords are known; phones and keys are had; biometrics are inherent — two factors need two different columns (7.1).', 'Mật khẩu là biết; điện thoại và khoá là có; sinh trắc là vốn có — hai yếu tố cần hai cột khác nhau (7.1).'])],
  goiY: [['A phone and a key are both "have".', 'Một điện thoại và một khoá đều "có".'], ['A fingerprint is inherent.', 'Một vân tay là vốn có.']],
  loi: [['Calling a TOTP app "know".', 'Gọi một app TOTP là "biết".'], ['Calling a fingerprint "have".', 'Gọi một vân tay là "có".']],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-7-1-yeu-to-thu-hai', ten: '7.1 Second factor', khoa: KHOA, baiHoc: 'auth-7-1-yeu-to-thu-hai', de: [S1, S2, S3, S4] });
