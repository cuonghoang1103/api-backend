/** Authentication · Lab 4 — Bộ xác minh JWT: dựng lại từng mảnh (chooseAlg, verifyClaims) rồi ghép (verifyToken), thuần JS, chạy thật. */
import { doiDau, KHOA, tn, jsBai, nguon, goi } from './_auth.mjs';

const ISS = 'https://id.labflow.example', AUD = 'labflow-api';
const S0 = 1793696400;

function chooseAlg(header, keyring) {
  if (!header.kid) return 'NO_KID';
  var key = keyring[header.kid];
  if (!key) return 'UNKNOWN_KID';
  if (header.alg !== key.alg) return 'ALG_MISMATCH';
  return key.alg;
}
const RING = { 'ed-a': { alg: 'EdDSA' }, 'ed-b': { alg: 'EdDSA' } };
const S1 = jsBai({
  ten: 'Lab 4·1 — chooseAlg(header, keyring): the algorithm from the key', kho: 'MEDIUM', phut: 12, dangBai: 'lab',
  en: `<p>Part one of the verifier. Return the algorithm to use — from the key, not the token. <code>'NO_KID'</code> if no kid; <code>'UNKNOWN_KID'</code> if the kid is not in <code>keyring</code>; <code>'ALG_MISMATCH'</code> if <code>header.alg</code> differs from the key’s alg; otherwise the key’s alg. This defeats <code>alg: none</code> and HS/RS confusion at once.</p>`,
  vi: `<p>Phần một của bộ xác minh. Trả về thuật toán để dùng — từ khoá, không từ token. <code>'NO_KID'</code> nếu không kid; <code>'UNKNOWN_KID'</code> nếu kid không trong <code>keyring</code>; <code>'ALG_MISMATCH'</code> nếu <code>header.alg</code> khác alg của khoá; còn lại trả alg của khoá. Việc này đánh bại <code>alg: none</code> và nhầm lẫn HS/RS cùng lúc.</p>`,
  goiY: [['Return the key’s alg, never the header’s.', 'Trả alg của khoá, không bao giờ của header.'], ['Order: no kid, unknown kid, mismatch, ok.', 'Thứ tự: không kid, kid lạ, lệch, ok.']],
  loi: [['Returning header.alg.', 'Trả header.alg.'], ['Accepting an unknown kid.', 'Chấp nhận một kid lạ.']],
  gt: ['The algorithm must come from the key the server holds; a token can never choose how it is checked. none is no key’s alg; HS256 against an EdDSA kid is ALG_MISMATCH (Lab 4 T2, T3).', 'Thuật toán phải đến từ khoá máy chủ giữ; một token không bao giờ chọn được cách nó bị kiểm. none không phải alg của khoá nào; HS256 chống một kid EdDSA là ALG_MISMATCH (Lab 4 T2, T3).'],
  kn: ['jwt'], tns: [tn('key/algorithm binding', 'gắn khoá với thuật toán')],
  dau: `/** ⇒ 'NO_KID' | 'UNKNOWN_KID' | 'ALG_MISMATCH' | the key's alg */
function chooseAlg(header, keyring) {
  // Write your solution here
  return header.alg;
}
`,
  giai: '// Reference solution\n' + nguon(chooseAlg),
  cases: [
    { goi: goi('chooseAlg', { alg: 'EdDSA', kid: 'ed-a' }, RING), moTa: ['Valid', 'Hợp lệ'] },
    { goi: goi('chooseAlg', { alg: 'none', kid: 'ed-a' }, RING), an: true, moTa: ['alg:none', 'alg:none'] },
    { goi: goi('chooseAlg', { alg: 'HS256', kid: 'ed-a' }, RING), an: true, moTa: ['Confusion', 'Nhầm lẫn'] },
    { goi: goi('chooseAlg', { alg: 'EdDSA', kid: 'ed-x' }, RING), an: true, moTa: ['Unknown kid', 'kid lạ'] },
    { goi: goi('chooseAlg', { alg: 'EdDSA' }, RING), an: true, moTa: ['No kid', 'Không kid'] },
  ],
});

function verifyClaims(payload, cfg) {
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
const CFG = { issuer: ISS, audience: AUD, now: (S0 + 100) * 1000, skewSec: 60, revoked: ['jti-dead'] };
const GOOD = { iss: ISS, sub: 'usr_3', aud: AUD, iat: S0, nbf: S0, exp: S0 + 900, jti: 'jti-ok' };
const over = (o) => Object.assign({}, GOOD, o);
const S2 = jsBai({
  ten: 'Lab 4·2 — verifyClaims(payload, cfg): the seven claims', kho: 'HARD', phut: 16, dangBai: 'lab',
  en: `<p>Part two. The signature is already verified. Return the first failing claim code or <code>'OK'</code>, in order: <code>BAD_ISS</code>, <code>BAD_AUD</code> (aud may be a string or array), <code>NO_SUB</code>, <code>EXPIRED</code> (<code>nowSec − skewSec ≥ exp</code>), <code>NOT_YET</code> (nbf optional), <code>NO_IAT</code>, <code>NO_JTI</code>, <code>REVOKED</code> (jti in <code>cfg.revoked</code>). <code>cfg.now</code> is ms; exp/nbf are seconds.</p>`,
  vi: `<p>Phần hai. Chữ ký đã được xác minh. Trả mã claim trượt đầu tiên hoặc <code>'OK'</code>, theo thứ tự: <code>BAD_ISS</code>, <code>BAD_AUD</code> (aud có thể là chuỗi hoặc mảng), <code>NO_SUB</code>, <code>EXPIRED</code> (<code>nowSec − skewSec ≥ exp</code>), <code>NOT_YET</code> (nbf tuỳ chọn), <code>NO_IAT</code>, <code>NO_JTI</code>, <code>REVOKED</code> (jti trong <code>cfg.revoked</code>). <code>cfg.now</code> là ms; exp/nbf là giây.</p>`,
  goiY: [['Normalise aud to an array.', 'Chuẩn hoá aud thành mảng.'], ['Return the FIRST failure.', 'Trả lỗi ĐẦU TIÊN.']],
  loi: [['Checking aud only as a string.', 'Kiểm aud chỉ như chuỗi.'], ['Forgetting jti / revoked.', 'Quên jti / revoked.']],
  gt: ['Each claim defends one attack; a valid signature on the wrong claims is still the wrong token. Order makes the error precise (Lab 4 T6–T9).', 'Mỗi claim chống một cú tấn công; một chữ ký hợp lệ trên claim sai vẫn là token sai. Thứ tự làm lỗi chính xác (Lab 4 T6–T9).'],
  kn: ['jwt'], tns: [tn('registered claims', 'claim chuẩn')],
  dau: `/** signature already OK ⇒ first failing claim code, or 'OK' */
function verifyClaims(payload, cfg) {
  // Write your solution here
  if (payload.iss !== cfg.issuer) return 'BAD_ISS';
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(verifyClaims),
  cases: [
    { goi: goi('verifyClaims', GOOD, CFG), moTa: ['Valid', 'Hợp lệ'] },
    { goi: goi('verifyClaims', over({ aud: 'labflow-chat' }), CFG), an: true, moTa: ['Wrong aud', 'Sai aud'] },
    { goi: goi('verifyClaims', over({ aud: ['x', AUD] }), CFG), an: true, moTa: ['aud array incl. us', 'aud mảng gồm ta'] },
    { goi: goi('verifyClaims', over({ exp: S0 - 200 }), CFG), an: true, moTa: ['Expired', 'Hết hạn'] },
    { goi: goi('verifyClaims', over({ jti: 'jti-dead' }), CFG), an: true, moTa: ['Revoked', 'Thu hồi'] },
    { goi: goi('verifyClaims', over({ jti: undefined }), CFG), an: true, moTa: ['No jti', 'Không jti'] },
  ],
});

function verifyToken(header, payload, cfg) {
  var alg = chooseAlg(header, cfg.keyring);
  if (alg === 'NO_KID' || alg === 'UNKNOWN_KID' || alg === 'ALG_MISMATCH') return alg;
  if (!cfg.signatureValid) return 'BAD_SIGNATURE';
  return verifyClaims(payload, cfg);
}
const CFG2 = Object.assign({ keyring: RING, signatureValid: true }, CFG);
const badSig = Object.assign({}, CFG2, { signatureValid: false });
const H = { alg: 'EdDSA', kid: 'ed-a' };
const S3 = jsBai({
  ten: 'Lab 4·3 — verifyToken(header, payload, cfg): put it together', kho: 'HARD', phut: 16, dangBai: 'lab',
  en: `<p>The whole verifier, in order. Use your own <code>chooseAlg</code> and <code>verifyClaims</code> (both are provided above — paste them in, or re-implement). Return the algorithm failure (<code>NO_KID</code>/<code>UNKNOWN_KID</code>/<code>ALG_MISMATCH</code>) if there is one; else if <code>cfg.signatureValid</code> is false, <code>'BAD_SIGNATURE'</code>; else the result of <code>verifyClaims(payload, cfg)</code>. <code>cfg</code> has <code>keyring</code>, <code>signatureValid</code>, <code>issuer</code>, <code>audience</code>, <code>now</code>, <code>skewSec</code>, <code>revoked</code>.</p>`,
  vi: `<p>Cả bộ xác minh, theo thứ tự. Dùng <code>chooseAlg</code> và <code>verifyClaims</code> của bạn (cả hai được cung cấp ở trên — dán vào, hoặc viết lại). Trả lỗi thuật toán (<code>NO_KID</code>/<code>UNKNOWN_KID</code>/<code>ALG_MISMATCH</code>) nếu có; nếu không, nếu <code>cfg.signatureValid</code> là false thì <code>'BAD_SIGNATURE'</code>; còn lại là kết quả của <code>verifyClaims(payload, cfg)</code>. <code>cfg</code> có <code>keyring</code>, <code>signatureValid</code>, <code>issuer</code>, <code>audience</code>, <code>now</code>, <code>skewSec</code>, <code>revoked</code>.</p>`,
  yc: [['Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'], ['Algorithm first, then signature, then claims.', 'Thuật toán trước, rồi chữ ký, rồi claim.']],
  goiY: [['Algorithm → signature → claims, in that order.', 'Thuật toán → chữ ký → claim, đúng thứ tự.'], ['Only reach the claims after the signature is valid.', 'Chỉ tới các claim sau khi chữ ký hợp lệ.']],
  loi: [['Reading claims before checking the algorithm or signature.', 'Đọc claim trước khi kiểm thuật toán hay chữ ký.'], ['Treating an algorithm failure as BAD_SIGNATURE.', 'Coi một lỗi thuật toán là BAD_SIGNATURE.']],
  gt: ['This is LabFlow ID’s verifier (src/jwt/verify.js): algorithm from the key, signature, then the seven claims. The order is the whole defence — a forged alg or a hostile claim never reaches the step it would exploit.', 'Đây là bộ xác minh của LabFlow ID (src/jwt/verify.js): thuật toán từ khoá, chữ ký, rồi bảy claim. Thứ tự là toàn bộ phòng thủ — một alg giả hay một claim thù địch không bao giờ tới được bước nó khai thác.'],
  kn: ['jwt'], tns: [tn('verification order', 'thứ tự xác minh')],
  dau: nguon(chooseAlg) + '\n' + nguon(verifyClaims) + `
/** ⇒ an algorithm code, 'BAD_SIGNATURE', a claim code, or 'OK' */
function verifyToken(header, payload, cfg) {
  // Write your solution here (use chooseAlg and verifyClaims above)
  return verifyClaims(payload, cfg);
}
`,
  giai: '// Reference solution\n' + nguon(chooseAlg) + '\n' + nguon(verifyClaims) + '\n' + nguon(verifyToken),
  cases: [
    { goi: goi('verifyToken', H, GOOD, CFG2), moTa: ['Valid token', 'Token hợp lệ'] },
    { goi: goi('verifyToken', { alg: 'none', kid: 'ed-a' }, GOOD, CFG2), an: true, moTa: ['alg:none', 'alg:none'] },
    { goi: goi('verifyToken', { alg: 'EdDSA', kid: 'ed-x' }, GOOD, CFG2), an: true, moTa: ['Unknown kid', 'kid lạ'] },
    { goi: goi('verifyToken', H, GOOD, badSig), an: true, moTa: ['Bad signature', 'Chữ ký sai'] },
    { goi: goi('verifyToken', H, over({ aud: 'labflow-chat' }), CFG2), an: true, moTa: ['Wrong aud', 'Sai aud'] },
    { goi: goi('verifyToken', H, over({ jti: 'jti-dead' }), CFG2), an: true, moTa: ['Revoked', 'Thu hồi'] },
  ],
});

export default doiDau({ slug: 'auth-4-7-lab-kiem-jwt', ten: 'Lab 4 — LabFlow ID’s JWT verifier', khoa: KHOA, baiHoc: 'auth-4-7-lab-kiem-jwt', de: [S1, S2, S3] });
