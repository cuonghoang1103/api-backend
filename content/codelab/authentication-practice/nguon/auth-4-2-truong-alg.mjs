/** Authentication · 4.2 — Trường alg: đọc output thật (alg:none + confusion ⇒ ALG_MISMATCH); tự viết algToUse; bảng attack → defense. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s04/_ma.mjs';

const NONE = OUT['42-none'].split('\n').slice(1);
const CONF = OUT['42-confusion'].split('\n').slice(1);

const S1 = cs({
  ten: '4.2-1 — alg: none and algorithm confusion: read the real runs', kho: 'MEDIUM', phut: 8,
  en: `LabFlow ID v0.4 (real runs):${pre(NONE)}${pre(CONF)}`,
  vi: `LabFlow ID v0.4 (chạy thật):${pre(NONE)}${pre(CONF)}`,
  cau: [
    q('c1', ['The naive verifier accepted alg:none; LabFlow ID returned ALG_MISMATCH. Why?', 'Bộ xác minh ngây thơ chấp nhận alg:none; LabFlow ID trả ALG_MISMATCH. Vì sao?'],
      ['The algorithm comes from the key (an EdDSA kid), so "none" fails', 'LabFlow ID blocks the literal string "none" with a header filter before verifying', 'The signature was present in the token but did not verify correctly', 'The token had already expired before the verifier looked at it'],
      ['The algorithm comes from the key, not the header, so a header claiming "none" against an EdDSA kid fails before any signature step.', 'Thuật toán đến từ khoá, không từ header, nên một header khai "none" chống lại một kid EdDSA trượt trước bước chữ ký nào.']),
    q('c2', ['In the confusion attack, what did the attacker use as the HMAC secret?', 'Trong cú nhầm lẫn, kẻ tấn công dùng gì làm bí mật HMAC?'],
      ['Its public key, which the JWKS publishes and so is not a secret', 'The private signing key, which they managed to steal from the server', 'A password they guessed by brute force over many attempts', 'The kid string copied straight from the token header'],
      ['The server verifies EdDSA with a public key; a naive verifier reuses it as the HMAC secret for an HS256 token, and the attacker knows that public key.', 'Máy chủ kiểm EdDSA bằng một khoá công khai; một bộ xác minh ngây thơ dùng lại nó làm bí mật HMAC cho một token HS256, và kẻ tấn công biết khoá công khai đó.']),
    q('c3', ['One rule in LabFlow ID stops both forgeries. What is it?', 'Một luật trong LabFlow ID chặn cả hai cú giả mạo. Đó là gì?'],
      ['Choose the algorithm from the key (looked up by kid), never from the token header', 'Reject every token that uses HMAC', 'Always require a signature at least 64 bytes long', 'Only accept tokens younger than 60 seconds'],
      ['Binding each key to exactly one algorithm and reading it from the key defeats both alg:none and HS/RS confusion (RFC 8725, OWASP).', 'Gắn mỗi khoá với đúng một thuật toán và đọc nó từ khoá đánh bại cả alg:none lẫn nhầm lẫn HS/RS (RFC 8725, OWASP).']),
  ],
  goiY: [['Who decides the algorithm — the token or the key?', 'Ai quyết định thuật toán — token hay khoá?'], ['A public key is not a secret.', 'Một khoá công khai không phải bí mật.']],
  loi: [['Trusting header.alg.', 'Tin header.alg.'], ['Using one key for both HMAC and public-key algorithms.', 'Dùng một khoá cho cả HMAC lẫn thuật toán khoá công khai.']],
  tns: [tn('algorithm confusion', 'nhầm lẫn thuật toán'), tn('allow-list', 'danh sách cho phép')],
  kn: ['jwt'],
});

function algToUse(header, keyring) {
  if (!header.kid) return 'NO_KID';
  var key = keyring[header.kid];
  if (!key) return 'UNKNOWN_KID';
  if (header.alg !== key.alg) return 'ALG_MISMATCH';
  return key.alg;
}
const RING = { 'ed-2026-11': { alg: 'EdDSA' }, 'hs-legacy': { alg: 'HS256' } };
const S2 = jsBai({
  ten: '4.2-2 — Write algToUse(header, keyring): the one rule', kho: 'MEDIUM', phut: 14,
  en: `<p>Decide the algorithm to verify with — from the <strong>key</strong>, never the token. Given <code>header</code> (<code>{ alg, kid }</code>) and <code>keyring</code> (<code>{ kid: { alg } }</code>): return <code>'NO_KID'</code> if the header has no kid; <code>'UNKNOWN_KID'</code> if the kid is not in the keyring; <code>'ALG_MISMATCH'</code> if the header’s alg differs from the key’s alg; otherwise return the key’s alg. This single function makes <code>alg: none</code> and HS/RS confusion impossible.</p>`,
  vi: `<p>Quyết định thuật toán để xác minh — từ <strong>khoá</strong>, không từ token. Cho <code>header</code> (<code>{ alg, kid }</code>) và <code>keyring</code> (<code>{ kid: { alg } }</code>): trả <code>'NO_KID'</code> nếu header không có kid; <code>'UNKNOWN_KID'</code> nếu kid không trong keyring; <code>'ALG_MISMATCH'</code> nếu alg của header khác alg của khoá; còn lại trả alg của khoá. Hàm duy nhất này khiến <code>alg: none</code> và nhầm lẫn HS/RS bất khả thi.</p>`,
  goiY: [['Return the KEY’s alg, never the header’s.', 'Trả alg của KHOÁ, không bao giờ của header.'], ['Order: no kid, unknown kid, mismatch, then ok.', 'Thứ tự: không kid, kid lạ, lệch, rồi ok.']],
  loi: [['Returning header.alg — that is exactly the bug.', 'Trả header.alg — đó chính là lỗi.'], ['Forgetting the UNKNOWN_KID case, so an attacker names any kid.', 'Quên trường hợp UNKNOWN_KID, để kẻ tấn công nêu kid bất kỳ.']],
  gt: ['The algorithm must come from the key the server holds, so a token can never choose how it is checked. none is not any key’s alg; an HS256 header against an EdDSA kid is an ALG_MISMATCH (4.2).', 'Thuật toán phải đến từ khoá máy chủ giữ, nên một token không bao giờ chọn được cách nó bị kiểm. none không phải alg của khoá nào; một header HS256 chống lại một kid EdDSA là ALG_MISMATCH (4.2).'],
  kn: ['jwt'], tns: [tn('key/algorithm binding', 'gắn khoá với thuật toán')],
  dau: `/** ⇒ 'NO_KID' | 'UNKNOWN_KID' | 'ALG_MISMATCH' | the key's alg */
function algToUse(header, keyring) {
  // Write your solution here
  return header.alg;
}
`,
  giai: '// Reference solution\n' + nguon(algToUse),
  cases: [
    { goi: goi('algToUse', { alg: 'EdDSA', kid: 'ed-2026-11' }, RING), moTa: ['Valid EdDSA token', 'Token EdDSA hợp lệ'] },
    { goi: goi('algToUse', { alg: 'none', kid: 'ed-2026-11' }, RING), an: true, moTa: ['alg:none', 'alg:none'] },
    { goi: goi('algToUse', { alg: 'HS256', kid: 'ed-2026-11' }, RING), an: true, moTa: ['Confusion: HS256 on EdDSA kid', 'Nhầm lẫn: HS256 trên kid EdDSA'] },
    { goi: goi('algToUse', { alg: 'EdDSA', kid: 'ed-nope' }, RING), an: true, moTa: ['Unknown kid', 'Kid lạ'] },
    { goi: goi('algToUse', { alg: 'EdDSA' }, RING), an: true, moTa: ['No kid', 'Không kid'] },
    { goi: goi('algToUse', { alg: 'HS256', kid: 'hs-legacy' }, RING), an: true, moTa: ['A real HS256 key', 'Một khoá HS256 thật'] },
  ],
});

const S3 = cs({
  ten: '4.2-3 — The order of the checks', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Put the verifier’s steps in the order that defeats alg:none and confusion.',
  vi: 'Xếp các bước của bộ xác minh theo thứ tự đánh bại alg:none và nhầm lẫn.',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Look the kid up in the keyring (reject if missing or unknown)',
    'The header’s alg must equal the key’s alg (else ALG_MISMATCH)',
    'Verify the signature with that key',
    'Check the claims (iss, aud, exp, …)',
  ], ['Algorithm from the key before any signature maths, and the signature before any claim; so a forged alg or a hostile claim never reaches the step it would exploit.', 'Thuật toán từ khoá trước toán chữ ký, và chữ ký trước claim nào; nên một alg giả hay một claim thù địch không bao giờ tới được bước nó khai thác.'])],
  goiY: [['Decide the key and algorithm first.', 'Quyết định khoá và thuật toán trước.'], ['Never read a claim before the signature.', 'Không bao giờ đọc một claim trước chữ ký.']],
  loi: [['Verifying the signature before pinning the algorithm.', 'Xác minh chữ ký trước khi chốt thuật toán.'], ['Reading claims first.', 'Đọc claim trước.']],
  tns: [tn('verification order', 'thứ tự xác minh')],
  kn: ['jwt'],
});

const DEF = ['ALG_MISMATCH — the kid is an EdDSA key', 'ALG_MISMATCH — the kid is an EdDSA key, header says HS256', 'BAD_SIGNATURE', 'UNKNOWN_KID'];
const S4 = cs({
  ten: '4.2-4 — Attack → LabFlow ID’s answer', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each forged token with the code LabFlow ID returns.',
  vi: 'Ghép mỗi token giả với mã LabFlow ID trả về.',
  bang: [bang1('b1', ['Attack → code', 'Tấn công → mã'], [{ ma: 'x', ten: 'Forged token' }, { ma: 'q', ten: 'LabFlow ID', luaChon: DEF }], [
    { o: { x: 'alg:none, empty signature' }, a: { q: 'ALG_MISMATCH — the kid is an EdDSA key' } },
    { o: { x: 'HS256 HMACed with the public key' }, a: { q: 'ALG_MISMATCH — the kid is an EdDSA key, header says HS256' } },
    { o: { x: 'valid alg/kid, one payload byte changed' }, a: { q: 'BAD_SIGNATURE' } },
    { o: { x: 'kid that is not in the keyring' }, a: { q: 'UNKNOWN_KID' } },
  ], ['The algorithm check (ALG_MISMATCH) catches both header tricks before any signature maths; a tampered payload reaches and fails the signature; an unknown kid never finds a key.', 'Phép kiểm thuật toán (ALG_MISMATCH) bắt cả hai mẹo header trước toán chữ ký; một payload bị sửa tới được và trượt chữ ký; một kid lạ không tìm thấy khoá.'])],
  goiY: [['The header tricks die at the algorithm check.', 'Các mẹo header chết ở phép kiểm thuật toán.'], ['A tampered payload still reaches the signature.', 'Một payload bị sửa vẫn tới được chữ ký.']],
  loi: [['Thinking alg:none gives BAD_SIGNATURE.', 'Tưởng alg:none cho BAD_SIGNATURE.'], ['Thinking an unknown kid is ALG_MISMATCH.', 'Tưởng một kid lạ là ALG_MISMATCH.']],
  kn: ['jwt'],
});

export default doiDau({ slug: 'auth-4-2-truong-alg', ten: '4.2 The alg header', khoa: KHOA, baiHoc: 'auth-4-2-truong-alg', de: [S1, S2, S3, S4] });
