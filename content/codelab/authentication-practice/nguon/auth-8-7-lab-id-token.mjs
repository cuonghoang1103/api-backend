/** Authentication · Lab 8 — Kiểm ID token: viết verifyIdToken (7 phép) + đọc điểm máy chấm. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s08/_ma.mjs';
const TK = OUT['lab-tham-khao'].split('\n').slice(1);
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
const S1 = jsBai({
  ten: 'Lab 8-1 — Write verifyIdToken(payload, ctx): the seven checks', kho: 'HARD', phut: 15,
  en: `<p>The client’s ID-token check. Return <code>{ ok, sub }</code> or <code>{ error }</code> in order: <code>malformed</code> → <code>bad_signature</code> (<code>!ctx.signatureValid</code>) → <code>bad_iss</code> → <code>bad_aud</code> (string or array) → <code>expired</code> → <code>bad_iat</code> (<code>iat &gt; now + 60</code>) → <code>bad_nonce</code>. The signature is verified elsewhere and passed in as <code>signatureValid</code> — gate on it.</p>`,
  vi: `<p>Phép kiểm ID token của client. Trả <code>{ ok, sub }</code> hoặc <code>{ error }</code> theo thứ tự: <code>malformed</code> → <code>bad_signature</code> (<code>!ctx.signatureValid</code>) → <code>bad_iss</code> → <code>bad_aud</code> (chuỗi hoặc mảng) → <code>expired</code> → <code>bad_iat</code> (<code>iat &gt; now + 60</code>) → <code>bad_nonce</code>. Chữ ký kiểm ở nơi khác và truyền vào dạng <code>signatureValid</code> — chặn theo nó.</p>`,
  goiY: [['Gate on signatureValid right after the malformed guard.', 'Chặn theo signatureValid ngay sau guard malformed.'], ['aud: normalise to an array then check includes.', 'aud: chuẩn hoá về mảng rồi kiểm includes.']],
  loi: [['Skipping the signature gate.', 'Bỏ chặn chữ ký.'], ['Treating aud as a string only.', 'Coi aud chỉ là chuỗi.']],
  gt: ['Signature and audience are the two whose omission is a full bypass — a forged token, or another client’s token, otherwise walks in (8.4).', 'Chữ ký và audience là hai cái mà bỏ đi là bypass trọn vẹn — một token giả, hay token của client khác, nếu không sẽ lọt (8.4).'],
  kn: ['authentication'], tns: [tn('token confusion', 'lẫn token'), tn('audience (aud)', 'audience (aud)')],
  dau: `/** ⇒ { ok, sub } or { error } */
function verifyIdToken(payload, ctx) {
  // Write your solution here
  return { ok: true };
}
`,
  giai: '// Reference solution\n' + nguon(verifyIdToken),
  cases: [
    { goi: `verifyIdToken(${JSON.stringify(good)}, ${JSON.stringify(ctx)})`, moTa: ['valid', 'hợp lệ'] },
    { goi: `verifyIdToken(${JSON.stringify(good)}, ${JSON.stringify({ ...ctx, signatureValid: false })})`, an: true, moTa: ['bad signature', 'sai chữ ký'] },
    { goi: `verifyIdToken(${JSON.stringify({ ...good, iss: 'https://evil.example' })}, ${JSON.stringify(ctx)})`, an: true, moTa: ['bad iss', 'sai iss'] },
    { goi: `verifyIdToken(${JSON.stringify({ ...good, aud: 'other' })}, ${JSON.stringify(ctx)})`, an: true, moTa: ['bad aud', 'sai aud'] },
    { goi: `verifyIdToken(null, ${JSON.stringify(ctx)})`, an: true, moTa: ['malformed', 'malformed'] },
  ],
});
const S2 = jsBai({
  ten: 'Lab 8-2 — Write audienceOk(aud, expected): string or array', kho: 'EASY', phut: 8,
  en: `<p>The aud claim may be a single string or an array of strings. Return <code>true</code> only if <code>expected</code> is the string, or is a member of the array. This is the subtle part of check 4 (8.4).</p>`,
  vi: `<p>Claim aud có thể là một chuỗi hoặc một mảng chuỗi. Trả <code>true</code> chỉ khi <code>expected</code> là chuỗi đó, hoặc là một thành viên của mảng. Đây là phần tinh tế của phép kiểm 4 (8.4).</p>`,
  goiY: [['Normalise to an array, then use includes.', 'Chuẩn hoá về mảng, rồi dùng includes.'], ['A string aud must equal expected exactly.', 'Một aud chuỗi phải bằng expected chính xác.']],
  loi: [['Only handling the string case.', 'Chỉ xử lý trường hợp chuỗi.'], ['Using substring instead of equality.', 'Dùng chuỗi con thay vì bằng.']],
  gt: ['OIDC allows aud to be an array; a client must check its id is present, not merely that aud is non-empty (8.4).', 'OIDC cho phép aud là một mảng; một client phải kiểm id của nó có mặt, không chỉ aud khác rỗng (8.4).'],
  kn: ['authentication'], tns: [tn('audience (aud)', 'audience (aud)')],
  dau: `/** ⇒ true if expected is the aud string or in the aud array */
function audienceOk(aud, expected) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\nfunction audienceOk(aud, expected) {\n  const list = Array.isArray(aud) ? aud : [aud];\n  return list.includes(expected);\n}\n',
  cases: [
    { goi: `audienceOk('labflow-api', 'labflow-api')`, moTa: ['string match', 'khớp chuỗi'] },
    { goi: `audienceOk(['x', 'labflow-api'], 'labflow-api')`, an: true, moTa: ['array member', 'thành viên mảng'] },
    { goi: `audienceOk('other', 'labflow-api')`, an: true, moTa: ['string mismatch', 'lệch chuỗi'] },
    { goi: `audienceOk(['a', 'b'], 'labflow-api')`, an: true, moTa: ['not in array', 'không trong mảng'] },
  ],
});
const S3 = cs({
  ten: 'Lab 8-3 — Read the reference grade', kho: 'EASY', phut: 5,
  en: `The reference ID-token check, graded and tested:${pre(TK.slice(-4))}`,
  vi: `Phép kiểm ID token tham khảo, chấm và test:${pre(TK.slice(-4))}`,
  cau: [
    q('c1', ['The first attempt checks iss and expiry and "logs the user in", scoring 3/10. Which omissions are the full bypasses?', 'Lần thử đầu kiểm iss và hết hạn và "đăng nhập người dùng", được 3/10. Những cái bỏ nào là bypass trọn vẹn?'],
      ['Skipping the signature (forgery) and the audience (another client’s token)', 'Skipping only the issuer and expiry checks, nothing more serious', 'Skipping only the malformed-input guard at the very top', 'None of them — a score of 3 out of 10 already counts as a pass'],
      ['No signature ⇒ a forged token for any sub; no audience ⇒ a token minted for another client is accepted (8.4).', 'Không chữ ký ⇒ một token giả cho bất kỳ sub; không audience ⇒ một token đúc cho client khác được nhận (8.4).']),
  ],
  goiY: [['Two checks are complete bypasses.', 'Hai phép là bypass trọn vẹn.'], ['"Logs me in" is not "correct".', '"Đăng nhập được" không phải "đúng".']],
  loi: [['Thinking a valid happy path means a safe check.', 'Tưởng một đường thuận hợp lệ là một phép kiểm an toàn.'], ['Thinking 3/10 is a pass.', 'Tưởng 3/10 là đạt.']],
  tns: [tn('machine-graded lab', 'lab chấm bằng máy')],
  kn: ['authentication'],
});
export default doiDau({ slug: 'auth-8-7-lab-id-token', ten: 'Lab 8 ID-token check', khoa: KHOA, baiHoc: 'auth-8-7-lab-id-token', de: [S1, S2, S3] });
