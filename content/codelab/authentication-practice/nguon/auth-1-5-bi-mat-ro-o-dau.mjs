/** Authentication · 1.5 — Bí mật rò mà không ai tấn công: log, lỗi axios, git, bundle (output thật); tự viết redact (allow-list) và scanSecrets (gitleaks thu nhỏ). */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s01/_ma.mjs';

const AX = OUT['15-axios'].split('\n');
const SO_LAN = AX.find((l) => /^\s*\d+\s*$/.test(l) && !/tmp\/app.log/.test(l))?.trim();

/* ── 1. Bốn chỗ rò thật ── */
const S1 = cs({
  ten: '1.5-1 — Four leaks nobody attacked', kho: 'EASY', phut: 10,
  en: `Real outputs of lesson 1.5. A pino deny-list logger:${pre(OUT['15-log-server'].split('\n').filter((l) => /"level"/.test(l)).slice(0, 1))}An axios error logged with <code>log.error({ err })</code>: the fake partner key appears <b>${SO_LAN}</b> times in one log line. A Vite build:${pre(OUT['15-vite'].split('\n').slice(2))}`,
  vi: `Output thật của bài 1.5. Logger pino theo danh sách cấm:${pre(OUT['15-log-server'].split('\n').filter((l) => /"level"/.test(l)).slice(0, 1))}Lỗi axios ghi bằng <code>log.error({ err })</code>: khoá đối tác giả xuất hiện <b>${SO_LAN}</b> lần trong một dòng log. Một bản build Vite:${pre(OUT['15-vite'].split('\n').slice(2))}`,
  cau: [
    q('c1', ['The deny-list hid authorization and password. What leaked anyway?', 'Danh sách cấm đã che authorization và password. Cái gì vẫn lộ?'],
      ['The x-session header and the newPassword field — names nobody put on the list', 'Nothing — pino redacts every secret automatically', 'Only the email address', 'The whole request body, because redact failed'],
      ['A deny-list protects only the names someone thought of. An allow-list (log only what you decided is safe) hid both, and later the new otp field too, with no change.', 'Danh sách cấm chỉ che những tên ai đó đã nghĩ tới. Danh sách cho phép (chỉ ghi thứ đã quyết định là an toàn) che được cả hai, và sau này cả trường otp mới, mà không phải sửa gì.']),
    q('c2', ['Why did one log.error({ err }) write the partner API key several times?', 'Vì sao một lệnh log.error({ err }) ghi khoá API đối tác nhiều lần?'],
      ['The error object carries the whole failed request', 'pino writes every field of an object twice by default', 'The key was part of the URL that axios requested', 'axios also logs the request by itself on failure'],
      ['Log the error’s message, code and status — never the error object of an HTTP client.', 'Ghi message, code và status của lỗi — đừng bao giờ ghi nguyên object lỗi của một HTTP client.']),
    q('c3', ['VITE_PAYMENT_SECRET_KEY ended up in dist/assets/*.js. Whose fault is it?', 'VITE_PAYMENT_SECRET_KEY nằm trong dist/assets/*.js. Lỗi của ai?'],
      ['The developer’s: VITE_* values ship to every visitor', 'Vite’s: it should have encrypted the value itself', 'The CDN’s: it should not serve built .js files', 'Nobody’s: minified code cannot really be read'],
      ['Anything in the bundle is public. Third-party secrets stay on the server behind your own authenticated endpoint.', 'Mọi thứ trong bundle là công khai. Bí mật của bên thứ ba ở lại máy chủ, sau một endpoint có xác thực của chính bạn.']),
  ],
  goiY: [['Look for names that are NOT in the redact list.', 'Tìm những tên KHÔNG nằm trong danh sách che.'], ['Ask what an error object remembers about the request.', 'Hỏi object lỗi nhớ gì về request.']],
  loi: [['Logging whole req, res or err objects.', 'Ghi nguyên object req, res hay err.'], ['Prefixing a secret with VITE_ / NEXT_PUBLIC_ “to make it work”.', 'Đặt tiền tố VITE_ / NEXT_PUBLIC_ cho bí mật "cho nó chạy".']],
  tns: [tn('deny-list', 'danh sách cấm'), tn('allow-list', 'danh sách cho phép')],
  kn: ['secret leakage'],
});

/* ── 2. Tự viết: redact ── */
function redact(value, allow) {
  function walk(v) {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      var out = {};
      Object.keys(v).forEach(function (k) { out[k] = allow.indexOf(k) >= 0 ? walk(v[k]) : '[redacted]'; });
      return out;
    }
    return v;
  }
  return walk(value);
}
const REQ = { method: 'POST', path: '/sign-in', headers: { 'user-agent': 'curl/8.7.1', 'x-session': 'lfid_ses_demo-session-of-an', authorization: 'Bearer lfid_key_demo-key-of-an' }, body: { email: 'an@student.labflow.example', password: 'an-lab-2026', newPassword: 'an-lab-2027' } };
const S2 = jsBai({
  ten: '1.5-2 — Write redact(value, allow): an allow-list logger', kho: 'MEDIUM', phut: 15,
  en: `<p>Write the function behind LabFlow ID’s request log. <code>redact(value, allow)</code> returns a <b>deep copy</b> where every object key that is NOT in <code>allow</code> becomes the string <code>"[redacted]"</code> (whatever its value — even a nested object). Allowed keys keep their value, walked recursively; arrays are walked element by element; strings, numbers, booleans and <code>null</code> are returned as they are. The input must not be changed.</p>`,
  vi: `<p>Viết hàm đứng sau log request của LabFlow ID. <code>redact(value, allow)</code> trả về một <b>bản sao sâu</b>, trong đó mọi khoá của object KHÔNG nằm trong <code>allow</code> thành chuỗi <code>"[redacted]"</code> (bất kể giá trị — kể cả object lồng). Khoá được phép giữ giá trị, đi đệ quy vào trong; mảng đi từng phần tử; chuỗi, số, boolean và <code>null</code> trả về nguyên. Không được sửa đầu vào.</p>`,
  goiY: [['typeof null === "object" — check v truthy first.', 'typeof null === "object" — kiểm v khác null trước.'], ['Arrays are objects too: test Array.isArray before the object branch.', 'Mảng cũng là object: kiểm Array.isArray trước nhánh object.']],
  loi: [['A deny-list (if key === "password") — misses newPassword, x-session, matKhau.', 'Danh sách cấm (if key === "password") — sót newPassword, x-session, matKhau.'], ['Mutating the request object: the next middleware sees "[redacted]" as the password.', 'Sửa thẳng object request: middleware sau thấy mật khẩu là "[redacted]".']],
  gt: ['An allow-list fails closed: a field added next year is hidden until someone decides it is safe. That is why the otp field in the lesson’s practice was hidden by the allow-list and leaked by the deny-list without any code change.', 'Danh sách cho phép hỏng theo hướng đóng: trường thêm vào năm sau bị che cho tới khi có người quyết định nó an toàn. Vì vậy trường otp trong bài thực hành bị che bởi danh sách cho phép và lộ ở danh sách cấm, mà không ai sửa dòng mã nào.'],
  kn: ['allow-list logging'],
  dau: `/** deep copy; keys not in allow ⇒ "[redacted]" */
function redact(value, allow) {
  // Write your solution here
  var copy = JSON.parse(JSON.stringify(value));
  if (copy.body && copy.body.password) copy.body.password = '[redacted]';
  if (copy.headers && copy.headers.authorization) copy.headers.authorization = '[redacted]';
  return copy;
}
`,
  giai: '// Reference solution\n' + nguon(redact),
  cases: [
    { goi: goi('redact', REQ, ['method', 'path', 'headers', 'user-agent', 'body', 'email']), moTa: ['The sign-in request of lesson 1.5', 'Request đăng nhập của bài 1.5'] },
    { goi: goi('redact', { a: 1, b: { c: 2 } }, ['a']) },
    { goi: goi('redact', { items: [{ email: 'b@x', pwd: 'p' }, 3, null] }, ['items', 'email']), an: true },
    { goi: goi('redact', { body: null, n: 0, ok: false }, ['body', 'n', 'ok']), an: true },
    { goi: goi('redact', 'just a string', []), an: true },
    { goi: `(function () { var x = ${JSON.stringify(REQ)}; redact(x, ['method']); return x.body.password; })()`, an: true, moTa: ['The input is not changed', 'Đầu vào không bị sửa'] },
  ],
});

/* ── 3. Tự viết: scanSecrets ── */
function scanSecrets(text) {
  var found = [];
  String(text).split('\n').forEach(function (line, i) {
    var re = /lfid_(?:key|ses|reset)_[A-Za-z0-9_-]{20,}/g;
    var m;
    while ((m = re.exec(line)) !== null) {
      found.push({ line: i + 1, rule: 'labflow-id-secret', preview: m[0].slice(0, m[0].indexOf('_', 5) + 1) + m[0].slice(m[0].indexOf('_', 5) + 1, m[0].indexOf('_', 5) + 5) + '…' });
    }
    if (/(secret|password|api[_-]?key|token)\s*[=:]\s*["']?[A-Za-z0-9_\-+/=]{16,}/i.test(line) && !/lfid_/.test(line)) {
      found.push({ line: i + 1, rule: 'generic-secret', preview: line.trim().slice(0, 12) + '…' });
    }
  });
  return found;
}
const FIX = 'PORT=4800\\nLFID_SIGNING_KEY=lfid_key_00Hrn21xnHuxfIBnCmJaeEyzvbN6Z1Ex0M6XM-NiWdk\\n';
const S3 = jsBai({
  ten: '1.5-3 — Write scanSecrets(text): a tiny gitleaks', kho: 'HARD', phut: 20,
  en: `<p>Lesson 1.5 taught gitleaks LabFlow ID’s prefixes; the default rules missed the test fixture, the custom rule found both:</p>${pre(OUT['15-git-4'].split('\n').filter((l) => /Finding|RuleID|File/.test(l)))}<p>Write <code>scanSecrets(text)</code> returning findings <code>{ line, rule, preview }</code> in line order (lines numbered from 1):</p><ul>
<li>rule <code>labflow-id-secret</code>: every match of <code>lfid_(key|ses|reset)_</code> followed by ≥ 20 characters from <code>A–Z a–z 0–9 _ -</code>; several per line are possible. preview = the prefix up to and including its second <code>_</code>, then the next 4 characters, then <code>…</code> (e.g. <code>lfid_key_00Hr…</code>) — never the whole secret;</li>
<li>rule <code>generic-secret</code>: a line (that has no <code>lfid_</code> at all) where a word <code>secret</code>, <code>password</code>, <code>api_key</code>/<code>api-key</code>/<code>apikey</code> or <code>token</code> (any case) is followed by <code>=</code> or <code>:</code>, optional quote, and ≥ 16 characters from <code>A–Z a–z 0–9 _ - + / =</code>. preview = the trimmed line’s first 12 characters + <code>…</code>.</li></ul>`,
  vi: `<p>Bài 1.5 dạy gitleaks các tiền tố của LabFlow ID; luật mặc định sót tệp fixture, luật tự viết tìm được cả hai:</p>${pre(OUT['15-git-4'].split('\n').filter((l) => /Finding|RuleID|File/.test(l)))}<p>Viết <code>scanSecrets(text)</code> trả về các phát hiện <code>{ line, rule, preview }</code> theo thứ tự dòng (đánh số từ 1):</p><ul>
<li>luật <code>labflow-id-secret</code>: mọi chỗ khớp <code>lfid_(key|ses|reset)_</code> theo sau là ≥ 20 ký tự trong <code>A–Z a–z 0–9 _ -</code>; một dòng có thể có nhiều chỗ. preview = phần tiền tố tới hết dấu <code>_</code> thứ hai, rồi 4 ký tự tiếp theo, rồi <code>…</code> (vd <code>lfid_key_00Hr…</code>) — không bao giờ in cả bí mật;</li>
<li>luật <code>generic-secret</code>: một dòng (không hề có <code>lfid_</code>) mà từ <code>secret</code>, <code>password</code>, <code>api_key</code>/<code>api-key</code>/<code>apikey</code> hoặc <code>token</code> (hoa thường tuỳ ý) đứng trước <code>=</code> hoặc <code>:</code>, có thể có dấu nháy, rồi ≥ 16 ký tự trong <code>A–Z a–z 0–9 _ - + / =</code>. preview = 12 ký tự đầu của dòng đã cắt khoảng trắng + <code>…</code>.</li></ul>`,
  goiY: [['A regex with the g flag and a while (exec) loop finds several matches per line.', 'Regex có cờ g và vòng while (exec) tìm nhiều chỗ khớp trên một dòng.'], ['The second "_" of lfid_key_… is at indexOf("_", 5).', 'Dấu "_" thứ hai của lfid_key_… nằm ở indexOf("_", 5).']],
  loi: [['Printing the full secret in the report — the CI log becomes the next leak.', 'In nguyên bí mật trong báo cáo — log CI thành chỗ rò tiếp theo.'], ['Using match() without g: only the first secret on the line is reported.', 'Dùng match() không có g: chỉ báo bí mật đầu tiên của dòng.']],
  gt: ['Prefixes are what make your own secrets detectable — a random 43-character string with no prefix looks like any other base64. Redacted previews keep the scanner from leaking what it found (gitleaks --redact).', 'Tiền tố là thứ làm bí mật của bạn bị phát hiện được — một chuỗi ngẫu nhiên 43 ký tự không tiền tố thì trông như mọi base64 khác. Preview đã che giữ cho chính máy quét không làm lộ thứ nó tìm thấy (gitleaks --redact).'],
  kn: ['secret scanning'],
  tns: [tn('secret scanning', 'quét bí mật'), tn('fixture', 'dữ liệu mẫu cho test')],
  dau: `/** ⇒ [{ line, rule, preview }] */
function scanSecrets(text) {
  // Write your solution here
  var found = [];
  text.split('\\n').forEach(function (line, i) {
    var m = line.match(/lfid_key_\\w+/);
    if (m) found.push({ line: i, rule: 'labflow-id-secret', preview: m[0] });
  });
  return found;
}
`,
  giai: '// Reference solution\n' + nguon(scanSecrets),
  cases: [
    { goi: `scanSecrets("${FIX}")`, moTa: ['The .env of lesson 1.5', '.env của bài 1.5'] },
    { goi: goi('scanSecrets', '{ "user": "usr_1", "sid": "lfid_ses_nrb_pw07YKkzbnfUYDsQUry01Yoi881il359Ma8gcGA" }'), moTa: ['The test fixture the default rules missed', 'Tệp fixture mà luật mặc định sót'] },
    { goi: goi('scanSecrets', 'a=lfid_reset_AAAAAAAAAAAAAAAAAAAAAAAA b=lfid_key_BBBBBBBBBBBBBBBBBBBBBBBB\nnothing here\nlfid_ses_short'), an: true },
    { goi: goi('scanSecrets', 'DB_PASSWORD="Sup3rS3cretValue2026xx"\nPORT=4800\napiKey: abcdefghijklmnopq'), an: true },
    { goi: goi('scanSecrets', 'token = short\nsecret_name=hello'), an: true },
    { goi: goi('scanSecrets', ''), an: true },
  ],
});

/* ── 4. Lộ rồi thì làm gì ── */
const S4 = cs({
  ten: '1.5-4 — A key was pushed to GitHub: what now?', kho: 'MEDIUM', phut: 6, loai: 'order',
  en: `<code>git rm --cached .env</code> did not help — real output:${pre(OUT['15-git-2'])}Put the response in the right order.`,
  vi: `<code>git rm --cached .env</code> chẳng giúp gì — output thật:${pre(OUT['15-git-2'])}Sắp phản ứng theo đúng thứ tự.`,
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Treat the key as public: revoke it at the provider and issue a new one',
    'Deploy the new key to the server’s runtime environment (never the repository)',
    'Search logs and the provider’s audit trail for use of the old key',
    'Optionally clean the history (filter-repo) — it does not un-leak clones and forks',
    'Add a scanner rule for your prefix in the pre-commit hook and in CI',
  ], ['Rotation first: history rewriting cannot reach clones, forks, CI caches or someone who already copied it. Then make sure the new key works, look for abuse, tidy up, and add the scanner so it does not happen again.', 'Xoay khoá trước tiên: viết lại lịch sử không với tới bản clone, fork, cache CI hay người đã chép mất. Rồi bảo đảm khoá mới chạy, tìm dấu hiệu lạm dụng, dọn dẹp, và thêm máy quét để chuyện này không lặp lại.'])],
  goiY: [['What stops the attacker fastest?', 'Điều gì chặn kẻ tấn công nhanh nhất?'], ['History rewriting is cosmetic once a clone exists.', 'Viết lại lịch sử chỉ là trang trí một khi đã có bản clone.']],
  loi: [['Rewriting history first and keeping the old key.', 'Viết lại lịch sử trước rồi giữ nguyên khoá cũ.'], ['Putting the new key in the repository “but private this time”.', 'Đưa khoá mới vào kho "nhưng lần này để private".']],
  kn: ['incident response'],
});

export default doiDau({ slug: 'auth-1-5-bi-mat-ro-o-dau', ten: '1.5 Where secrets leak without anyone attacking', khoa: KHOA, baiHoc: 'auth-1-5-bi-mat-ro-o-dau', de: [S1, S2, S3, S4] });
