/** Authentication · 8.4 — ID token: đọc output; viết verifyIdToken (7 phép); bảng. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s08/_ma.mjs';
const OF = OUT['81-oidc-flow'].split('\n').slice(1);
const S1 = cs({
  ten: '8.4-1 — ID token vs access token, read the run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.8 (real run):${pre(OF.filter((l)=>l.includes('verified')||l.includes('aud:')||l.includes('nonce:')))}`,
  vi: `LabFlow ID v0.8 (chạy thật):${pre(OF.filter((l)=>l.includes('verified')||l.includes('aud:')||l.includes('nonce:')))}`,
  cau: [
    q('c1', ['Which token tells the client who logged in, and which is a pass for the API?', 'Token nào nói cho client ai đã đăng nhập, và cái nào là tấm vé cho API?'],
      ['The ID token (aud = client) is identity; the access token (aud = API) is the pass', 'Both are identity', 'The access token is identity; the ID token is the pass', 'Neither carries identity'],
      ['The ID token is consumed by the client for identity; the access token targets the API and is opaque to the client (8.4).', 'ID token được client tiêu cho danh tính; access token nhắm API và mờ đục với client (8.4).']),
    q('c2', ['The same token re-verified with expectedAudience "other-app" ⇒ bad_aud. Why reject it?', 'Cùng token verify lại với expectedAudience "other-app" ⇒ bad_aud. Vì sao từ chối?'],
      ['A token minted for another client must not be accepted here — else app A’s token logs you into app B', 'Because re-verifying somehow changed the token signature', 'Because the token nonce expires on the second verification', 'Because the issuer claim no longer matches on the second pass'],
      ['The aud check stops cross-client token use — a classic bypass (8.4).', 'Phép kiểm aud chặn dùng token chéo client — một cú bypass kinh điển (8.4).']),
  ],
  goiY: [['The ID token’s audience is the client; the access token’s is the API.', 'audience của ID token là client; của access token là API.'], ['aud ties a token to its intended consumer.', 'aud buộc một token với bên tiêu dự định.']],
  loi: [['Authenticating with an access token.', 'Xác thực bằng một access token.'], ['Ignoring aud because the signature is valid.', 'Lờ aud vì chữ ký hợp lệ.']],
  tns: [tn('ID token', 'ID token'), tn('access token', 'access token')],
  kn: ['authentication'],
});
function verifyIdToken(payload, { signatureValid, expectedIssuer, expectedAudience, nonce, now }) {
  if (!payload || typeof payload !== 'object') return { error: 'malformed' };
  if (!signatureValid) return { error: 'bad_signature' };
  if (payload.iss !== expectedIssuer) return { error: 'bad_iss' };
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(expectedAudience)) return { error: 'bad_aud' };
  if (typeof payload.exp !== 'number' || payload.exp <= now) return { error: 'expired' };
  if (typeof payload.iat !== 'number' || payload.iat > now + 60) return { error: 'bad_iat' };
  if (nonce !== undefined && payload.nonce !== nonce) return { error: 'bad_nonce' };
  return { ok: true, sub: payload.sub };
}
const good = { iss: 'https://id.labflow.example', aud: 'labflow-api', exp: 1700000300, iat: 1700000000, nonce: 'n1', sub: 'usr_1' };
const ctx = { signatureValid: true, expectedIssuer: 'https://id.labflow.example', expectedAudience: 'labflow-api', nonce: 'n1', now: 1700000000 };
const S2 = jsBai({
  ten: '8.4-2 — Write verifyIdToken(payload, ctx): the seven checks', kho: 'HARD', phut: 15,
  en: `<p>The most security-critical function in a "sign in with…" client. Return <code>{ ok, sub }</code> or <code>{ error }</code>, checking in this order: <code>malformed</code> (null/non-object) → <code>bad_signature</code> (<code>!ctx.signatureValid</code>) → <code>bad_iss</code> → <code>bad_aud</code> (aud may be a string OR an array that must contain <code>expectedAudience</code>) → <code>expired</code> (<code>exp &lt;= now</code>) → <code>bad_iat</code> (<code>iat &gt; now + 60</code>) → <code>bad_nonce</code> (only if <code>ctx.nonce</code> is given). The signature is checked elsewhere; its result is <code>signatureValid</code> — do not skip it.</p>`,
  vi: `<p>Hàm trọng yếu bảo mật nhất trong một client "đăng nhập bằng…". Trả <code>{ ok, sub }</code> hoặc <code>{ error }</code>, kiểm theo thứ tự: <code>malformed</code> (null/không-object) → <code>bad_signature</code> (<code>!ctx.signatureValid</code>) → <code>bad_iss</code> → <code>bad_aud</code> (aud có thể là chuỗi HOẶC mảng phải chứa <code>expectedAudience</code>) → <code>expired</code> (<code>exp &lt;= now</code>) → <code>bad_iat</code> (<code>iat &gt; now + 60</code>) → <code>bad_nonce</code> (chỉ khi có <code>ctx.nonce</code>). Chữ ký kiểm ở nơi khác; kết quả là <code>signatureValid</code> — đừng bỏ nó.</p>`,
  goiY: [['Gate on signatureValid right after the malformed guard.', 'Chặn theo signatureValid ngay sau guard malformed.'], ['Normalise aud to an array, then check includes.', 'Chuẩn hoá aud về mảng, rồi kiểm includes.']],
  loi: [['Skipping the signature check.', 'Bỏ phép kiểm chữ ký.'], ['Treating aud as a plain string only.', 'Coi aud chỉ là một chuỗi.']],
  gt: ['Skip the signature and anyone forges a token for any sub; skip aud and another client’s token is accepted here — the two checks that are full bypasses (8.4).', 'Bỏ chữ ký và ai cũng giả một token cho bất kỳ sub nào; bỏ aud và token của client khác được nhận ở đây — hai phép là bypass trọn vẹn (8.4).'],
  kn: ['authentication'], tns: [tn('audience (aud)', 'audience (aud)'), tn('token confusion', 'lẫn token')],
  dau: `/** ⇒ { ok, sub } or { error } — the seven checks, in order */
function verifyIdToken(payload, ctx) {
  // Write your solution here
  return { ok: true };
}
`,
  giai: '// Reference solution\n' + nguon(verifyIdToken),
  cases: [
    { goi: `verifyIdToken(${JSON.stringify(good)}, ${JSON.stringify(ctx)})`, moTa: ['valid', 'hợp lệ'] },
    { goi: `verifyIdToken(${JSON.stringify(good)}, ${JSON.stringify({ ...ctx, signatureValid: false })})`, an: true, moTa: ['bad signature', 'sai chữ ký'] },
    { goi: `verifyIdToken(${JSON.stringify({ ...good, aud: 'other' })}, ${JSON.stringify(ctx)})`, an: true, moTa: ['wrong aud', 'sai aud'] },
    { goi: `verifyIdToken(${JSON.stringify({ ...good, aud: ['x', 'labflow-api'] })}, ${JSON.stringify(ctx)})`, an: true, moTa: ['array aud ⇒ ok', 'aud mảng ⇒ ok'] },
    { goi: `verifyIdToken(${JSON.stringify({ ...good, nonce: 'n2' })}, ${JSON.stringify(ctx)})`, an: true, moTa: ['wrong nonce', 'sai nonce'] },
    { goi: `verifyIdToken(null, ${JSON.stringify(ctx)})`, an: true, moTa: ['malformed', 'malformed'] },
  ],
});
const S3 = cs({
  ten: '8.4-3 — Check → what its omission allows', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each omitted ID-token check with the bug it causes.',
  vi: 'Ghép mỗi phép kiểm ID token bị bỏ với con lỗi nó gây.',
  bang: [bang1('b1', ['Omit → bug', 'Bỏ → lỗi'], [{ ma: 'x', ten: 'Omitted check' }, { ma: 'q', ten: 'Bug', luaChon: ['anyone forges a token for any user', 'app A’s token logs into app B', 'an old token replays', 'a stale token is accepted'] }], [
    { o: { x: 'signature' }, a: { q: 'anyone forges a token for any user' } },
    { o: { x: 'audience' }, a: { q: 'app A’s token logs into app B' } },
    { o: { x: 'nonce' }, a: { q: 'an old token replays' } },
    { o: { x: 'expiry' }, a: { q: 'a stale token is accepted' } },
  ], ['Signature and audience are full bypasses; nonce stops replay; expiry stops stale tokens (8.4).', 'Chữ ký và audience là bypass trọn vẹn; nonce chặn phát lại; hết hạn chặn token cũ (8.4).'])],
  goiY: [['Two of these are complete bypasses.', 'Hai cái là bypass trọn vẹn.'], ['nonce is about replay; expiry is about staleness.', 'nonce về phát lại; hết hạn về cũ.']],
  loi: [['Thinking a valid signature is sufficient.', 'Tưởng một chữ ký hợp lệ là đủ.'], ['Confusing the replay bug with the staleness bug.', 'Lẫn lỗi phát lại với lỗi cũ.']],
  kn: ['authentication'],
});
export default doiDau({ slug: 'auth-8-4-id-token', ten: '8.4 ID token', khoa: KHOA, baiHoc: 'auth-8-4-id-token', de: [S1, S2, S3] });
