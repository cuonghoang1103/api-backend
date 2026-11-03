/** Authentication · 11.1 — Secrets to the process; write missingKeys() for a fail-fast startup. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '11.1-1 — Secrets never touch the repo', kho: 'EASY', phut: 8,
  en: 'Secrets reach the process from the environment, never the repo; a missing one fails fast; a committed one is forever.',
  vi: 'Bí mật tới tiến trình từ môi trường, không bao giờ kho mã; một cái thiếu hỏng nhanh; một cái đã commit là vĩnh viễn.',
  cau: [
    q('c1', ['A required secret is missing at startup. What is the right behaviour?', 'Một bí mật bắt buộc thiếu lúc khởi động. Hành vi đúng là gì?'],
      ['Refuse to start with a clear error — a loud startup failure beats a mysterious 500 later in a request', 'Start and generate a random secret for this run so the process can boot', 'Start and log the whole environment so an operator can spot the gap', 'Start and fall back to a hardcoded default secret baked into the code'],
      ['Fail fast; half-configured fails later and harder to trace. A random or hardcoded secret is worse (11.1).', 'Hỏng nhanh; nửa-cấu-hình hỏng sau và khó lần hơn. Một secret ngẫu nhiên hay hardcode còn tệ hơn (11.1).']),
    q('c2', ['A secret was committed and removed in the next commit. Is it safe?', 'Một bí mật bị commit và gỡ trong commit sau. Nó an toàn chưa?'],
      ['No — it is in the git history on every clone and fork forever; the only fix is to rotate it', 'Yes, because the latest commit no longer contains the secret value', 'Yes, as long as the repository is private and not public', 'No, but only if somebody had already cloned the repository before'],
      ['The earlier commit still holds it everywhere; rotate the secret (11.1).', 'Commit trước vẫn giữ nó ở mọi nơi; xoay bí mật (11.1).']),
    q('c3', ['Why is a NEXT_PUBLIC_ third-party key dangerous?', 'Vì sao một khoá bên thứ ba NEXT_PUBLIC_ nguy hiểm?'],
      ['It is baked into the frontend bundle and shipped to every browser — it is not a secret at all', 'It makes the bundle slightly larger to download', 'It can only be read on the server, which is too slow', 'It expires faster than a server-side environment variable'],
      ['A key in the client bundle is public; keep third-party keys server-side behind a proxy (11.1, GIPHY pattern).', 'Một khoá trong bundle client là công khai; giữ khoá bên thứ ba ở máy chủ sau một proxy (11.1, mẫu GIPHY).']),
  ],
  goiY: [['Config that varies between deploys lives in the environment.', 'Cấu hình thay đổi giữa các lần deploy sống trong môi trường.'], ['Rotation is the only fix for a committed secret.', 'Xoay là cách sửa duy nhất cho một bí mật đã commit.']],
  loi: [['Thinking a later commit removes a secret from history.', 'Tưởng một commit sau gỡ một bí mật khỏi lịch sử.'], ['Shipping a key in the client bundle.', 'Ship một khoá trong bundle client.']],
  tns: [tn('fail fast', 'hỏng nhanh'), tn('Twelve-Factor config', 'cấu hình Twelve-Factor')],
  kn: ['authentication'],
});

const REQUIRED = ['DATABASE_URL', 'JWT_SIGNING_KEY', 'SESSION_SECRET'];
function missingKeys(env) {
  // Which required secrets are absent or blank? The caller refuses to start if this is non-empty.
  const e = env || {};
  return REQUIRED.filter((k) => !e[k] || String(e[k]).trim() === '');
}
const S2 = jsBai({
  ten: '11.1-2 — Write missingKeys(env): fail-fast startup check', kho: 'EASY', phut: 10,
  en: `<p>Return the list of REQUIRED secrets (<code>DATABASE_URL</code>, <code>JWT_SIGNING_KEY</code>, <code>SESSION_SECRET</code>) that are absent or blank in <code>env</code> — keeping their original order. A value is "missing" if it is undefined, empty, or only whitespace. The caller refuses to start when this list is non-empty.</p>`,
  vi: `<p>Trả danh sách các bí mật BẮT BUỘC (<code>DATABASE_URL</code>, <code>JWT_SIGNING_KEY</code>, <code>SESSION_SECRET</code>) vắng hoặc trống trong <code>env</code> — giữ thứ tự gốc. Một giá trị là "thiếu" nếu nó undefined, rỗng, hoặc chỉ khoảng trắng. Người gọi từ chối khởi động khi danh sách này không rỗng.</p>`,
  goiY: [['Filter the REQUIRED list by whether env has a non-blank value.', 'Lọc danh sách REQUIRED theo việc env có một giá trị không-trống.'], ['Trim and compare to the empty string to catch whitespace-only.', 'Trim và so với chuỗi rỗng để bắt chỉ-khoảng-trắng.']],
  loi: [['Returning the keys that ARE present instead of missing.', 'Trả các khoá CÓ mặt thay vì thiếu.'], ['Treating a whitespace-only value as present.', 'Coi một giá trị chỉ-khoảng-trắng là có mặt.']],
  gt: ['Checking required secrets at startup turns a missing one into a loud, clear failure instead of a 3am 500 (11.1).', 'Kiểm bí mật bắt buộc lúc khởi động biến một cái thiếu thành một lỗi ồn, rõ thay vì một 500 lúc 3h sáng (11.1).'],
  kn: ['authentication'], tns: [tn('required secret', 'bí mật bắt buộc')],
  dau: `const REQUIRED = ['DATABASE_URL', 'JWT_SIGNING_KEY', 'SESSION_SECRET'];
/** ⇒ array of required keys missing or blank in env (original order) */
function missingKeys(env) {
  // Write your solution here
  return [];
}
`,
  giai: `const REQUIRED = ['DATABASE_URL', 'JWT_SIGNING_KEY', 'SESSION_SECRET'];
` + '// Reference solution\n' + nguon(missingKeys),
  cases: [
    { goi: goi('missingKeys', { JWT_SIGNING_KEY: 'k' }), moTa: ['two missing (order kept)', 'thiếu hai (giữ thứ tự)'] },
    { goi: goi('missingKeys', { DATABASE_URL: 'd', JWT_SIGNING_KEY: 'k', SESSION_SECRET: 's' }), an: true, moTa: ['all set ⇒ []', 'đủ ⇒ []'] },
    { goi: goi('missingKeys', { DATABASE_URL: '   ', JWT_SIGNING_KEY: 'k', SESSION_SECRET: 's' }), an: true, moTa: ['whitespace ⇒ missing', 'khoảng trắng ⇒ thiếu'] },
    { goi: goi('missingKeys', {}), an: true, moTa: ['empty env ⇒ all three', 'env rỗng ⇒ cả ba'] },
  ],
});

const S3 = cs({
  ten: '11.1-3 — Order a safe startup', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order a safe process startup, from reading config to serving traffic.',
  vi: 'Xếp một lần khởi động an toàn, từ đọc cấu hình tới phục vụ lưu lượng.',
  cau: [ord('o1', ['Start → serve', 'Khởi động → phục vụ'], [
    'Read secrets from the environment (never the repo)',
    'Check the required ones; if any are missing, refuse to start with a clear error',
    'Log a redacted banner — which config is set, never its value',
    'Begin serving traffic',
  ], ['Read, validate (fail fast), log a redacted banner, then serve — never serve half-configured (11.1).', 'Đọc, kiểm (hỏng nhanh), log banner đã che, rồi phục vụ — không bao giờ phục vụ nửa-cấu-hình (11.1).'])],
  goiY: [['Validation comes before serving.', 'Kiểm đến trước phục vụ.'], ['The banner never prints a value.', 'Banner không bao giờ in một giá trị.']],
  loi: [['Serving before validating the config.', 'Phục vụ trước khi kiểm cấu hình.'], ['Logging the raw secret values.', 'Log các giá trị bí mật thô.']],
  tns: [tn('redacted banner', 'banner đã che')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-11-1-bi-mat', ten: '11.1 Secrets', khoa: KHOA, baiHoc: 'auth-11-1-bi-mat', de: [S1, S2, S3] });
