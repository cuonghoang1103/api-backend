/** Authentication · 4.3 — Các claim: đọc output thật (bỏ claim ⇒ mã; exp biên + skew); tự viết checkTime, checkClaims; bảng claim → attack. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s04/_ma.mjs';

const CL = OUT['43-claims'].split('\n').slice(1);
const EX = OUT['43-exp'].split('\n').slice(1);

const S1 = cs({
  ten: '4.3-1 — The seven claims: read the real runs', kho: 'MEDIUM', phut: 8,
  en: `LabFlow ID v0.4 (real runs):${pre(CL)}${pre(EX)}`,
  vi: `LabFlow ID v0.4 (chạy thật):${pre(CL)}${pre(EX)}`,
  cau: [
    q('c1', ['A token minted for aud "labflow-chat" was sent to labflow-api. Why was it rejected?', 'Một token đúc cho aud "labflow-chat" được gửi tới labflow-api. Vì sao bị từ chối?'],
      ['BAD_AUD — a recipient not named in aud MUST reject the token', 'EXPIRED — tokens for other services expire sooner', 'BAD_ISS — the issuer was wrong', 'It was accepted; aud is only advisory'],
      ['RFC 7519: if the recipient is not in aud, it MUST reject. Without the check, a leaked chat token becomes an API token.', 'RFC 7519: nếu người nhận không trong aud, PHẢI từ chối. Thiếu phép kiểm, một token chat bị lộ thành token API.']),
    q('c2', ['With skewSec 0, a token whose exp equals now was rejected EXPIRED. Why?', 'Với skewSec 0, một token có exp bằng now bị từ chối EXPIRED. Vì sao?'],
      ['exp is a boundary: on or after it, the token is expired', 'The machine’s clock happened to be running a little fast', 'A token’s exp must always be at least 60 seconds in the future', 'The signature expired at the same moment as the token did'],
      ['exp is a boundary: valid strictly before it. The same idea as Chapter 3’s session timeouts. Clock skew only extends it by the leeway, here 0.', 'exp là một biên: hợp lệ hẳn trước nó. Cùng ý với các mốc hết hạn phiên của Chương 3. Dung sai chỉ nới thêm bằng mức cho phép, ở đây 0.']),
    q('c3', ['After revoke, a second service with its own empty denylist still accepted the token. Why?', 'Sau khi thu hồi, một dịch vụ thứ hai với denylist rỗng riêng vẫn chấp nhận token. Vì sao?'],
      ['A jti denylist is per-verifier, so a service without it trusts the signature', 'The revoke call failed silently and never recorded the jti', 'The token was automatically re-issued right after being revoked', 'Revocation only ever works for refresh tokens, not access tokens'],
      ['A JWT cannot be un-issued; revocation works only where the denylist is shared, and only until exp — the trade-off a session (one DELETE) avoids.', 'Một JWT không huỷ phát được; thu hồi chỉ hiệu lực ở nơi denylist được chia sẻ, và chỉ tới exp — đánh đổi mà một phiên (một DELETE) né được.']),
  ],
  goiY: [['aud answers “who is this token for?”', 'aud trả lời "token này cho ai?"'], ['exp is a boundary, with a small skew.', 'exp là một biên, với dung sai nhỏ.']],
  loi: [['Thinking a valid signature is enough.', 'Tưởng một chữ ký hợp lệ là đủ.'], ['Thinking you can log a user out of a JWT instantly.', 'Tưởng có thể đăng xuất một người khỏi JWT tức thì.']],
  tns: [tn('aud (audience)'), tn('clock skew', 'lệch đồng hồ')],
  kn: ['jwt'],
});

function checkTime(payload, now, skewSec) {
  var nowSec = Math.floor(now / 1000);
  if (typeof payload.exp !== 'number' || nowSec - skewSec >= payload.exp) return 'EXPIRED';
  if (typeof payload.nbf === 'number' && nowSec + skewSec < payload.nbf) return 'NOT_YET';
  return 'OK';
}
const S0 = 1793696400; // 2026-11-03T09:00:00Z in seconds
const S2 = jsBai({
  ten: '4.3-2 — Write checkTime(payload, now, skewSec): exp and nbf with skew', kho: 'MEDIUM', phut: 14,
  en: `<p><code>now</code> is in <strong>milliseconds</strong>; <code>exp</code>/<code>nbf</code> are in <strong>seconds</strong>. Let <code>nowSec = Math.floor(now/1000)</code>. Return <code>'EXPIRED'</code> if <code>exp</code> is missing or <code>nowSec − skewSec ≥ exp</code> (on or after exp, allowing skew); <code>'NOT_YET'</code> if <code>nbf</code> is a number and <code>nowSec + skewSec &lt; nbf</code>; otherwise <code>'OK'</code>. Require <code>exp</code>; <code>nbf</code> is optional.</p>`,
  vi: `<p><code>now</code> tính bằng <strong>mili giây</strong>; <code>exp</code>/<code>nbf</code> tính bằng <strong>giây</strong>. Đặt <code>nowSec = Math.floor(now/1000)</code>. Trả <code>'EXPIRED'</code> nếu thiếu <code>exp</code> hoặc <code>nowSec − skewSec ≥ exp</code> (tại hoặc sau exp, cho dung sai); <code>'NOT_YET'</code> nếu <code>nbf</code> là số và <code>nowSec + skewSec &lt; nbf</code>; còn lại <code>'OK'</code>. Bắt buộc <code>exp</code>; <code>nbf</code> tuỳ chọn.</p>`,
  goiY: [['Convert now to seconds first.', 'Đổi now sang giây trước.'], ['≥ at exp (on or after); < at nbf (before).', '≥ ở exp (tại hoặc sau); < ở nbf (trước).']],
  loi: [['Comparing now (ms) with exp (s) directly.', 'So now (ms) với exp (s) trực tiếp.'], ['Using > instead of ≥ at exp — exp == now would wrongly pass.', 'Dùng > thay vì ≥ ở exp — exp == now sẽ qua sai.']],
  gt: ['exp is a boundary and clocks disagree, so a small skew is allowed on each side (RFC 7519). A missing exp means a token that never dies, so it must be treated as expired (4.3).', 'exp là một biên và đồng hồ lệch nhau, nên một dung sai nhỏ được cho ở mỗi phía (RFC 7519). Thiếu exp nghĩa là một token không chết, nên phải coi là hết hạn (4.3).'],
  kn: ['jwt'], tns: [tn('exp / nbf'), tn('clock skew', 'lệch đồng hồ')],
  dau: `/** now is ms, exp/nbf are seconds ⇒ 'EXPIRED' | 'NOT_YET' | 'OK' */
function checkTime(payload, now, skewSec) {
  // Write your solution here
  if (now >= payload.exp) return 'EXPIRED';
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(checkTime),
  cases: [
    { goi: goi('checkTime', { exp: S0 + 900, nbf: S0 }, (S0 + 100) * 1000, 60), moTa: ['Fresh token', 'Token mới'] },
    { goi: goi('checkTime', { exp: S0, nbf: S0 }, S0 * 1000, 0), an: true, moTa: ['exp == now, skew 0', 'exp == now, skew 0'] },
    { goi: goi('checkTime', { exp: S0, nbf: S0 }, (S0 + 30) * 1000, 60), an: true, moTa: ['30 s past exp, skew 60', 'Quá exp 30 s, skew 60'] },
    { goi: goi('checkTime', { exp: S0, nbf: S0 }, (S0 + 61) * 1000, 60), an: true, moTa: ['61 s past exp, skew 60', 'Quá exp 61 s, skew 60'] },
    { goi: goi('checkTime', { exp: S0 + 900, nbf: S0 + 120 }, (S0 + 30) * 1000, 60), an: true, moTa: ['nbf 90 s away, skew 60', 'nbf còn 90 s, skew 60'] },
    { goi: goi('checkTime', { nbf: S0 }, S0 * 1000, 60), an: true, moTa: ['No exp', 'Không exp'] },
  ],
});

function checkClaims(payload, cfg) {
  var nowSec = Math.floor(cfg.now / 1000);
  if (payload.iss !== cfg.issuer) return 'BAD_ISS';
  var aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (aud.indexOf(cfg.audience) < 0) return 'BAD_AUD';
  if (typeof payload.sub !== 'string' || !payload.sub) return 'NO_SUB';
  if (typeof payload.exp !== 'number' || nowSec - cfg.skewSec >= payload.exp) return 'EXPIRED';
  if (typeof payload.nbf === 'number' && nowSec + cfg.skewSec < payload.nbf) return 'NOT_YET';
  if (typeof payload.iat !== 'number') return 'NO_IAT';
  if (!payload.jti) return 'NO_JTI';
  if (cfg.revoked.indexOf(payload.jti) >= 0) return 'REVOKED';
  return 'OK';
}
const ISS = 'https://id.labflow.example', AUD = 'labflow-api';
const CFG = { issuer: ISS, audience: AUD, now: (S0 + 100) * 1000, skewSec: 60, revoked: ['jti-dead'] };
const GOOD = { iss: ISS, sub: 'usr_3', aud: AUD, iat: S0, nbf: S0, exp: S0 + 900, jti: 'jti-ok' };
const over = (o) => Object.assign({}, GOOD, o);
const S3 = jsBai({
  ten: '4.3-3 — Write checkClaims(payload, cfg): the seven, in order', kho: 'HARD', phut: 18,
  en: `<p>Assume the signature already verified. Check the seven claims and return the first failure code, or <code>'OK'</code>. In order: <code>iss</code> must equal <code>cfg.issuer</code> (<code>'BAD_ISS'</code>); <code>cfg.audience</code> must be in <code>aud</code> — which may be a string or an array (<code>'BAD_AUD'</code>); <code>sub</code> a non-empty string (<code>'NO_SUB'</code>); <code>exp</code> a number and not past by more than <code>cfg.skewSec</code> (<code>'EXPIRED'</code>); if present, <code>nbf</code> not in the future by more than skew (<code>'NOT_YET'</code>); <code>iat</code> a number (<code>'NO_IAT'</code>); <code>jti</code> present (<code>'NO_JTI'</code>) and not in <code>cfg.revoked</code> (<code>'REVOKED'</code>). <code>now</code> is ms; exp/nbf are seconds.</p>`,
  vi: `<p>Giả sử chữ ký đã xác minh. Kiểm bảy claim và trả mã trượt đầu tiên, hoặc <code>'OK'</code>. Theo thứ tự: <code>iss</code> phải bằng <code>cfg.issuer</code> (<code>'BAD_ISS'</code>); <code>cfg.audience</code> phải nằm trong <code>aud</code> — có thể là chuỗi hoặc mảng (<code>'BAD_AUD'</code>); <code>sub</code> là chuỗi khác rỗng (<code>'NO_SUB'</code>); <code>exp</code> là số và không quá hạn hơn <code>cfg.skewSec</code> (<code>'EXPIRED'</code>); nếu có, <code>nbf</code> không ở tương lai hơn dung sai (<code>'NOT_YET'</code>); <code>iat</code> là số (<code>'NO_IAT'</code>); <code>jti</code> có mặt (<code>'NO_JTI'</code>) và không trong <code>cfg.revoked</code> (<code>'REVOKED'</code>). <code>now</code> là ms; exp/nbf là giây.</p>`,
  goiY: [['Normalise aud to an array, then indexOf.', 'Chuẩn hoá aud thành mảng, rồi indexOf.'], ['Return the FIRST failure; order matters.', 'Trả lỗi ĐẦU TIÊN; thứ tự quan trọng.']],
  loi: [['Checking aud only as a string, so an array aud always fails.', 'Kiểm aud chỉ như chuỗi, khiến aud mảng luôn trượt.'], ['Forgetting jti, so revocation and replay checks do nothing.', 'Quên jti, khiến thu hồi và chống phát lại vô dụng.']],
  gt: ['Each claim defends a specific attack (4.3): iss/aud/sub say who; exp/nbf bound the window; iat gives age; jti enables revocation. A valid signature on the wrong claims is still the wrong token.', 'Mỗi claim chống một cú tấn công cụ thể (4.3): iss/aud/sub nói ai; exp/nbf chặn cửa sổ; iat cho tuổi; jti cho thu hồi. Một chữ ký hợp lệ trên các claim sai vẫn là token sai.'],
  kn: ['jwt'], tns: [tn('registered claims', 'claim chuẩn'), tn('jti (JWT ID)')],
  dau: `/** signature already OK ⇒ first failing claim code, or 'OK' */
function checkClaims(payload, cfg) {
  // Write your solution here
  if (payload.iss !== cfg.issuer) return 'BAD_ISS';
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(checkClaims),
  cases: [
    { goi: goi('checkClaims', GOOD, CFG), moTa: ['All seven present', 'Đủ bảy claim'] },
    { goi: goi('checkClaims', over({ iss: 'https://evil.example' }), CFG), an: true, moTa: ['Wrong issuer', 'Sai issuer'] },
    { goi: goi('checkClaims', over({ aud: 'labflow-chat' }), CFG), an: true, moTa: ['Wrong audience', 'Sai audience'] },
    { goi: goi('checkClaims', over({ aud: ['labflow-chat', AUD] }), CFG), an: true, moTa: ['aud array incl. us', 'aud mảng gồm ta'] },
    { goi: goi('checkClaims', over({ exp: S0 - 200 }), CFG), an: true, moTa: ['Expired', 'Hết hạn'] },
    { goi: goi('checkClaims', over({ jti: undefined }), CFG), an: true, moTa: ['No jti', 'Không jti'] },
    { goi: goi('checkClaims', over({ jti: 'jti-dead' }), CFG), an: true, moTa: ['Revoked jti', 'jti đã thu hồi'] },
    { goi: goi('checkClaims', over({ sub: '' }), CFG), an: true, moTa: ['Empty subject', 'sub rỗng'] },
  ],
});

const ATK = ['a token from another issuer is accepted', 'a chat token is spent at the API', 'a stolen token never expires', 'nothing can be revoked or caught as a replay'];
const S4 = cs({
  ten: '4.3-4 — Claim → the attack you skip', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each claim with the attack that skipping it allows.',
  vi: 'Ghép mỗi claim với cú tấn công mà bỏ nó cho phép.',
  bang: [bang1('b1', ['Claim → attack', 'Claim → tấn công'], [{ ma: 'x', ten: 'Skip this claim' }, { ma: 'q', ten: 'And…', luaChon: ATK }], [
    { o: { x: 'iss' }, a: { q: 'a token from another issuer is accepted' } },
    { o: { x: 'aud' }, a: { q: 'a chat token is spent at the API' } },
    { o: { x: 'exp' }, a: { q: 'a stolen token never expires' } },
    { o: { x: 'jti' }, a: { q: 'nothing can be revoked or caught as a replay' } },
  ], ['Each registered claim defends one named attack; a verifier that checks only the signature leaves all four open (4.3).', 'Mỗi claim chuẩn chống một cú tấn công có tên; một bộ xác minh chỉ kiểm chữ ký để hở cả bốn (4.3).'])],
  goiY: [['iss/aud are about who; exp about time; jti about revocation.', 'iss/aud về ai; exp về thời gian; jti về thu hồi.'], ['Which claim ties the token to one service?', 'Claim nào buộc token vào một dịch vụ?']],
  loi: [['Thinking exp protects the audience.', 'Tưởng exp bảo vệ audience.'], ['Thinking jti sets the lifetime.', 'Tưởng jti đặt tuổi thọ.']],
  kn: ['jwt'],
});

export default doiDau({ slug: 'auth-4-3-cac-claim', ten: '4.3 The claims', khoa: KHOA, baiHoc: 'auth-4-3-cac-claim', de: [S1, S2, S3, S4] });
