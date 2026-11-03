/** Authentication · 10.2 — AiTM phishing: OTP is relayed, origin-bound passkey is not; write relayableFactor. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '10.2-1 — The relay, not the fake page', kho: 'EASY', phut: 8,
  en: 'Modern phishing is an AiTM relay: it forwards your REAL login page and steals the resulting session, defeating OTP second factors.',
  vi: 'Lừa đảo hiện đại là một relay AiTM: nó chuyển tiếp trang đăng nhập THẬT của bạn và trộm cái phiên tạo ra, đánh bại yếu tố thứ hai OTP.',
  cau: [
    q('c1', ['Why do TLS and "check the URL" not stop an AiTM relay?', 'Vì sao TLS và "kiểm URL" không chặn một relay AiTM?'],
      ['The victim has real TLS to the attacker\'s look-alike domain — the padlock is green and the URL is a convincing twin', 'TLS is disabled on phishing sites, so the browser shows no padlock', 'The URL always contains the word "phishing" if you look closely', 'Relays cannot forward HTTPS traffic, only HTTP'],
      ['The connection is secure — to the wrong party; the padlock proves TLS to whatever domain you are on (10.2).', 'Kết nối an toàn — tới sai bên; ổ khoá chứng minh TLS tới bất kỳ tên miền nào bạn đang ở (10.2).']),
    q('c2', ['Why is a TOTP code relayed just like a password?', 'Vì sao một mã TOTP bị relay y như một mật khẩu?'],
      ['It is a replayable secret — the relay captures the value and replays it to the real server in real time', 'It is encrypted end to end, so the relay would have to break the encryption before it could be reused', 'It is simply too long for the relay to finish forwarding it before the 30-second window expires', 'It is cryptographically bound to the device, so the relay would have to clone the entire device first'],
      ['A TOTP code is just a value; the relay forwards it verbatim and keeps the session cookie it gets back (10.2).', 'Một mã TOTP chỉ là một giá trị; relay chuyển nó nguyên văn và giữ cái cookie phiên nó nhận về (10.2).']),
    q('c3', ['Why does a passkey survive the relay?', 'Vì sao một passkey sống qua relay?'],
      ['The browser signs over the origin it is on (the phishing domain), and the real server checks expectedOrigin and rejects it', 'The passkey requires a fingerprint or face scan that the relay has no way to capture or reproduce remotely', 'The passkey private key sits in a secure enclave on the device that the relay is physically unable to read', 'The passkey produces a code that rotates faster than the relay can possibly capture and forward it along'],
      ['Origin binding: the assertion is signed for the phishing domain, so the real RP rejects it — that is phishing-resistant (10.2, 7.4).', 'Gắn origin: assertion ký cho tên miền lừa đảo, nên RP thật từ chối — đó là kháng lừa đảo (10.2, 7.4).']),
  ],
  goiY: [['The relay proxies a real TLS connection.', 'Relay proxy một kết nối TLS thật.'], ['Origin binding is a cryptographic property, not a warning.', 'Gắn origin là một tính chất mật mã, không phải một lời cảnh báo.']],
  loi: [['Thinking a green padlock proves you are on the real site.', 'Tưởng một ổ khoá xanh chứng minh bạn ở site thật.'], ['Thinking any MFA is phishing-resistant.', 'Tưởng bất kỳ MFA nào cũng kháng lừa đảo.']],
  tns: [tn('AiTM', 'Kẻ-đứng-giữa'), tn('origin binding', 'gắn origin')],
  kn: ['authentication'],
});

function relayableFactor(factor) {
  // A replayable secret can be relayed; an origin-bound credential cannot.
  if (factor === 'password') return true;
  if (factor === 'totp') return true;
  if (factor === 'sms') return true;
  if (factor === 'passkey') return false;    // origin-bound (WebAuthn)
  return true;                               // unknown: assume replayable (fail safe toward caution)
}
const S2 = jsBai({
  ten: '10.2-2 — Write relayableFactor(factor): can an AiTM relay reuse it?', kho: 'EASY', phut: 8,
  en: `<p>Return <code>true</code> if the factor is a replayable secret an AiTM relay can capture and reuse: <code>'password'</code>, <code>'totp'</code> and <code>'sms'</code> are all relayable (⇒ <code>true</code>); a <code>'passkey'</code> is origin-bound and NOT relayable (⇒ <code>false</code>). An unknown factor ⇒ <code>true</code> (assume the worst).</p>`,
  vi: `<p>Trả <code>true</code> nếu yếu tố là một bí mật phát lại được mà một relay AiTM bắt và dùng lại được: <code>'password'</code>, <code>'totp'</code> và <code>'sms'</code> đều relay được (⇒ <code>true</code>); một <code>'passkey'</code> gắn-origin và KHÔNG relay được (⇒ <code>false</code>). Một yếu tố lạ ⇒ <code>true</code> (giả định xấu nhất).</p>`,
  goiY: [['Only the origin-bound factor returns false.', 'Chỉ yếu tố gắn-origin trả false.'], ['An OTP code is a value, so it is replayable.', 'Một mã OTP là một giá trị, nên phát lại được.']],
  loi: [['Returning false for TOTP (OTP is relayable).', 'Trả false cho TOTP (OTP relay được).'], ['Returning true for a passkey (it is origin-bound).', 'Trả true cho một passkey (nó gắn-origin).']],
  gt: ['Replayable secrets (password, OTP, SMS) are relayed; only an origin-bound passkey resists the AiTM relay (10.2).', 'Bí mật phát lại được (mật khẩu, OTP, SMS) bị relay; chỉ một passkey gắn-origin kháng relay AiTM (10.2).'],
  kn: ['authentication'], tns: [tn('replayable secret', 'bí mật phát lại được')],
  dau: `/** ⇒ true if an AiTM relay can capture and reuse this factor */
function relayableFactor(factor) {
  // Write your solution here
  return false;
}
`,
  giai: '// Reference solution\n' + nguon(relayableFactor),
  cases: [
    { goi: goi('relayableFactor', 'password'), moTa: ['password ⇒ true', 'mật khẩu ⇒ true'] },
    { goi: goi('relayableFactor', 'totp'), an: true, moTa: ['TOTP ⇒ true', 'TOTP ⇒ true'] },
    { goi: goi('relayableFactor', 'passkey'), an: true, moTa: ['passkey ⇒ false', 'passkey ⇒ false'] },
    { goi: goi('relayableFactor', 'sms'), an: true, moTa: ['SMS ⇒ true', 'SMS ⇒ true'] },
  ],
});

const S3 = cs({
  ten: '10.2-3 — Factor → relay outcome', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each factor presented through an AiTM relay to what the attacker gets.',
  vi: 'Ghép mỗi yếu tố đưa qua một relay AiTM với cái kẻ tấn công nhận được.',
  bang: [bang1('b1', ['Factor → outcome', 'Yếu tố → kết cục'], [{ ma: 'x', ten: 'Factor' }, { ma: 'q', ten: 'Outcome', luaChon: ['relayed — session stolen', 'rejected — origin mismatch'] }], [
    { o: { x: 'password' }, a: { q: 'relayed — session stolen' } },
    { o: { x: 'TOTP code' }, a: { q: 'relayed — session stolen' } },
    { o: { x: 'passkey' }, a: { q: 'rejected — origin mismatch' } },
  ], ['Password and TOTP are replayable; the passkey assertion is signed for the phishing origin and rejected (10.2).', 'Mật khẩu và TOTP phát lại được; assertion passkey ký cho origin lừa đảo và bị từ chối (10.2).'])],
  goiY: [['Two of the three are replayable secrets.', 'Hai trong ba là bí mật phát lại được.'], ['Only one is bound to the origin.', 'Chỉ một gắn với origin.']],
  loi: [['Thinking TOTP stops the relay.', 'Tưởng TOTP chặn relay.'], ['Thinking the passkey is relayed like the rest.', 'Tưởng passkey bị relay như phần còn lại.']],
  tns: [tn('phishing-resistant', 'kháng lừa đảo')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-10-2-lua-dao', ten: '10.2 AiTM phishing', khoa: KHOA, baiHoc: 'auth-10-2-lua-dao', de: [S1, S2, S3] });
