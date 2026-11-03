/** Authentication · 4.4 — Khoá & JWKS: đọc output thật (JWKS không d, rotate, perf); tự viết findVerifyKey, publicJwkOnly; order xoay vòng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s04/_ma.mjs';

const JW = OUT['44-jwks'].split('\n').slice(1);
const RT = OUT['44-rotate'].split('\n').slice(1);
const PF = OUT['44-perf'].split('\n').slice(1);

const S1 = cs({
  ten: '4.4-1 — JWKS, rotation and speed: read the real runs', kho: 'MEDIUM', phut: 8,
  en: `LabFlow ID v0.4 (real runs):${pre(JW)}${pre(RT)}${pre(PF)}`,
  vi: `LabFlow ID v0.4 (chạy thật):${pre(JW)}${pre(RT)}${pre(PF)}`,
  cau: [
    q('c1', ['The published JWKS has no "d" field. Why does that matter?', 'JWKS công bố không có trường "d". Vì sao điều đó quan trọng?'],
      ['"d" is the private key; publishing only the public half means others can verify but not mint', '"d" is the key id and is optional', 'Removing "d" makes the token smaller', '"d" is the signature and is sent with the token instead'],
      ['For an OKP/Ed25519 JWK, "d" is the private scalar. A JWKS carries only public keys, so every service can verify and none can sign.', 'Với một JWK OKP/Ed25519, "d" là đại lượng riêng. Một JWKS chỉ mang khoá công khai, nên dịch vụ nào cũng xác minh được và không ai ký được.']),
    q('c2', ['During rotation, day 2 publishes both keys. Why do old-key tokens still verify?', 'Khi xoay vòng, ngày 2 công bố cả hai khoá. Vì sao token khoá cũ vẫn xác minh được?'],
      ['Both keys are live in the JWKS, so the kid picks the right one', 'The old tokens were quietly re-signed with the new key on the fly', 'Old tokens are exempt from verification during the rotation window', 'The server kept a saved copy of every token it had ever issued'],
      ['Zero-downtime rotation keeps two keys live; the kid in each header selects the key. The old key is dropped only after its tokens expire.', 'Xoay vòng không ngừng dịch vụ giữ hai khoá sống; kid trong mỗi header chọn khoá. Khoá cũ chỉ bị gỡ sau khi token của nó hết hạn.']),
    q('c3', ['The perf table shows HS256 is the fastest. Why is it still a poor platform signing key?', 'Bảng perf cho thấy HS256 nhanh nhất. Vì sao nó vẫn là khoá ký nền tảng kém?'],
      ['It is a shared secret, so every verifier can also forge', 'The tokens it produces are simply too large to send around', 'It is not able to carry the registered claims in its payload', 'It is much slower to verify a token than it is to sign one'],
      ['Speed is not the point for a platform. HMAC uses one secret to sign and verify, so sharing it for verification also shares the power to mint. EdDSA keeps minting to the private key.', 'Tốc độ không phải điểm chính cho một nền tảng. HMAC dùng một bí mật để ký và kiểm, nên chia sẻ để kiểm cũng chia sẻ quyền đúc. EdDSA giữ việc đúc cho khoá riêng.']),
  ],
  goiY: [['Public keys only — never ship "d".', 'Chỉ khoá công khai — không bao giờ gửi "d".'], ['A shared secret verifies AND signs.', 'Một bí mật dùng chung vừa kiểm vừa ký.']],
  loi: [['Hard-coding a key instead of fetching the JWKS.', 'Hard-code một khoá thay vì tải JWKS.'], ['Choosing HS256 for a multi-service platform.', 'Chọn HS256 cho một nền tảng nhiều dịch vụ.']],
  tns: [tn('JWKS'), tn('key rotation', 'xoay khoá')],
  kn: ['jwt'],
});

function findVerifyKey(header, jwks) {
  if (!header.kid) return 'NO_KID';
  for (var i = 0; i < jwks.keys.length; i++) if (jwks.keys[i].kid === header.kid) return jwks.keys[i];
  return 'UNKNOWN_KID';
}
const JWKS = { keys: [{ kty: 'OKP', crv: 'Ed25519', kid: 'ed-2026-10', x: 'AAA' }, { kty: 'OKP', crv: 'Ed25519', kid: 'ed-2026-11', x: 'BBB' }] };
const S2 = jsBai({
  ten: '4.4-2 — Write findVerifyKey(header, jwks): resolve the kid', kho: 'MEDIUM', phut: 12,
  en: `<p>A client resolves a token’s key by kid. Given <code>header</code> (<code>{ alg, kid }</code>) and a <code>jwks</code> (<code>{ keys: [ { kid, … } ] }</code>): return <code>'NO_KID'</code> if the header has no kid; the matching JWK object if a key with that kid is in the set; otherwise <code>'UNKNOWN_KID'</code>. Look the kid up in the set only — never anywhere else (4.4: kid path traversal).</p>`,
  vi: `<p>Một client tra khoá của token theo kid. Cho <code>header</code> (<code>{ alg, kid }</code>) và một <code>jwks</code> (<code>{ keys: [ { kid, … } ] }</code>): trả <code>'NO_KID'</code> nếu header không có kid; object JWK khớp nếu một khoá có kid đó trong tập; còn lại <code>'UNKNOWN_KID'</code>. Chỉ tra kid trong tập — không bao giờ ở đâu khác (4.4: kid path traversal).</p>`,
  goiY: [['Loop the keys and compare kid.', 'Duyệt các khoá và so kid.'], ['Return the whole JWK object on a match.', 'Trả cả object JWK khi khớp.']],
  loi: [['Returning jwks.keys[0] regardless of kid.', 'Trả jwks.keys[0] bất kể kid.'], ['Turning the kid into a path or index.', 'Biến kid thành đường dẫn hay chỉ số.']],
  gt: ['The kid is attacker input, so it may only select a key from the fixed JWKS — never a file or a row. An unknown kid is rejected before any crypto (4.4).', 'kid là dữ liệu của kẻ tấn công, nên nó chỉ được chọn một khoá từ JWKS cố định — không bao giờ một tệp hay một dòng. Một kid lạ bị từ chối trước crypto nào (4.4).'],
  kn: ['jwt'], tns: [tn('kid (key id)'), tn('JWKS')],
  dau: `/** ⇒ 'NO_KID' | the matching JWK | 'UNKNOWN_KID' */
function findVerifyKey(header, jwks) {
  // Write your solution here
  return jwks.keys[0];
}
`,
  giai: '// Reference solution\n' + nguon(findVerifyKey),
  cases: [
    { goi: goi('findVerifyKey', { alg: 'EdDSA', kid: 'ed-2026-11' }, JWKS), moTa: ['Matches the second key', 'Khớp khoá thứ hai'] },
    { goi: goi('findVerifyKey', { alg: 'EdDSA', kid: 'ed-2026-10' }, JWKS), an: true, moTa: ['Matches the first (old) key', 'Khớp khoá cũ'] },
    { goi: goi('findVerifyKey', { alg: 'EdDSA', kid: 'ed-nope' }, JWKS), an: true, moTa: ['Unknown kid', 'kid lạ'] },
    { goi: goi('findVerifyKey', { alg: 'EdDSA', kid: '../secrets/app.key' }, JWKS), an: true, moTa: ['Path-like kid', 'kid kiểu đường dẫn'] },
    { goi: goi('findVerifyKey', { alg: 'EdDSA' }, JWKS), an: true, moTa: ['No kid', 'Không kid'] },
  ],
});

function publicJwkOnly(jwk) {
  var out = {};
  for (var k in jwk) if (Object.prototype.hasOwnProperty.call(jwk, k) && k !== 'd') out[k] = jwk[k];
  return out;
}
const S3 = jsBai({
  ten: '4.4-3 — Write publicJwkOnly(jwk): never publish the private half', kho: 'EASY', phut: 10,
  en: `<p>Before adding a key to the public JWKS, strip its private material. For an OKP/Ed25519 JWK the private scalar is the <code>d</code> field. Return a <strong>new</strong> object with every field of <code>jwk</code> except <code>d</code>. Do not modify the input.</p>`,
  vi: `<p>Trước khi thêm một khoá vào JWKS công khai, bỏ phần riêng của nó. Với một JWK OKP/Ed25519, đại lượng riêng là trường <code>d</code>. Trả một object <strong>mới</strong> với mọi trường của <code>jwk</code> trừ <code>d</code>. Đừng sửa đầu vào.</p>`,
  goiY: [['Copy every key except "d".', 'Chép mọi khoá trừ "d".'], ['Build a new object; do not delete from the input.', 'Dựng object mới; đừng xoá từ đầu vào.']],
  loi: [['Deleting d from the input object (mutating it).', 'Xoá d khỏi object đầu vào (sửa nó).'], ['Only removing d when it is truthy, missing other private fields.', 'Chỉ bỏ d khi nó truthy, bỏ sót các trường riêng khác.']],
  gt: ['Publishing "d" would hand everyone the signing key. A JWKS is public, so a verifier gets only what it needs to check — never to sign (4.4).', 'Công bố "d" là trao khoá ký cho mọi người. Một JWKS là công khai, nên bộ xác minh chỉ nhận thứ nó cần để kiểm — không bao giờ để ký (4.4).'],
  kn: ['jwt'], tns: [tn('JWK'), tn('public-key signing', 'ký bằng khoá công khai')],
  dau: `/** ⇒ a new JWK object without the private "d" field */
function publicJwkOnly(jwk) {
  // Write your solution here
  return jwk;
}
`,
  giai: '// Reference solution\n' + nguon(publicJwkOnly),
  cases: [
    { goi: goi('publicJwkOnly', { kty: 'OKP', crv: 'Ed25519', x: 'PUB', d: 'PRIVATE', kid: 'ed-1' }), moTa: ['Strips d', 'Bỏ d'] },
    { goi: goi('publicJwkOnly', { kty: 'OKP', crv: 'Ed25519', x: 'PUB', kid: 'ed-1', use: 'sig' }), an: true, moTa: ['No d to begin with', 'Vốn không có d'] },
    { goi: goi('publicJwkOnly', { kty: 'oct', k: 'SECRET', kid: 'hs-1' }), an: true, moTa: ['A symmetric key (k is also private!)', 'Khoá đối xứng (k cũng riêng!)'] },
  ],
});

const S4 = cs({
  ten: '4.4-4 — Rotate a key without downtime', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Put the zero-downtime rotation steps in order.',
  vi: 'Xếp các bước xoay vòng không ngừng dịch vụ theo thứ tự.',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Add the new key (new kid) to the JWKS, keep signing with the old key',
    'Let clients refresh their JWKS cache so they know the new key',
    'Switch signing to the new key; both keys still verify',
    'After one token lifetime, remove the old key from the JWKS',
  ], ['Publish before you switch so clients already hold the new key; keep both live so old tokens verify; drop the old key only after its tokens have all expired — no live token is ever refused.', 'Công bố trước khi chuyển để client đã có khoá mới; giữ cả hai sống để token cũ xác minh; chỉ gỡ khoá cũ sau khi token của nó hết hạn — không token sống nào bị khước từ.'])],
  goiY: [['Publish before switching.', 'Công bố trước khi chuyển.'], ['Drop the old key last, after its tokens expire.', 'Gỡ khoá cũ cuối cùng, sau khi token của nó hết hạn.']],
  loi: [['Switching signing before clients see the new key.', 'Chuyển việc ký trước khi client thấy khoá mới.'], ['Removing the old key immediately — old tokens break.', 'Gỡ khoá cũ ngay — token cũ vỡ.']],
  tns: [tn('key rotation', 'xoay khoá')],
  kn: ['jwt'],
});

export default doiDau({ slug: 'auth-4-4-khoa-va-jwks', ten: '4.4 Keys and JWKS', khoa: KHOA, baiHoc: 'auth-4-4-khoa-va-jwks', de: [S1, S2, S3, S4] });
